import { useState, useCallback } from 'react';
import { toPng } from 'html-to-image';

export type ExportStatus = 'idle' | 'scanning' | 'capturing' | 'sharing' | 'done' | 'error';

interface UseReceiptExportOptions {
  targetId: string;
  classification: string;
}

// ─── Filename sanitizer ───────────────────────────────────────────────────────
function toFilename(classification: string): string {
  return (
    'THE_CLINIC_' +
    classification
      .toUpperCase()
      .replace(/[^A-Z0-9\s]/g, '')
      .replace(/\s+/g, '_')
      .replace(/_+/g, '_')
      .trim() +
    '.png'
  );
}

// ─── Blob downloader ──────────────────────────────────────────────────────────
function downloadDataUrl(dataUrl: string, filename: string): void {
  console.log('[ReceiptExport] downloadDataUrl → filename:', filename);
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => document.body.removeChild(a), 3000);
}

// ─── dataURL → Blob ───────────────────────────────────────────────────────────
function dataUrlToBlob(dataUrl: string): Blob {
  const [header, base64] = dataUrl.split(',');
  const mime = header.match(/:(.*?);/)![1];
  const binary = atob(base64);
  const arr = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) arr[i] = binary.charCodeAt(i);
  return new Blob([arr], { type: mime });
}

// ─────────────────────────────────────────────────────────────────────────────

export function useReceiptExport({ targetId, classification }: UseReceiptExportOptions) {
  const [status, setStatus] = useState<ExportStatus>('idle');
  const [isExportMode, setIsExportMode] = useState(false);

  const triggerExport = useCallback(async () => {
    console.log('[ReceiptExport] ── START ──────────────────────────────────');

    // ── 1. Find element ───────────────────────────────────────────────────
    const el = document.getElementById(targetId);
    console.log('[ReceiptExport] #1 element:', el ? '✓' : '✗ NOT FOUND', { targetId });
    if (!el) {
      console.error('[ReceiptExport] ABORT: #' + targetId + ' not in DOM');
      setStatus('error');
      setTimeout(() => setStatus('idle'), 2000);
      return;
    }

    const { offsetWidth, offsetHeight } = el;
    console.log('[ReceiptExport] #2 dimensions:', { offsetWidth, offsetHeight });
    if (offsetWidth === 0 || offsetHeight === 0) {
      console.error('[ReceiptExport] ABORT: element has zero size');
      setStatus('error');
      setTimeout(() => setStatus('idle'), 2000);
      return;
    }

    const filename = toFilename(classification);
    console.log('[ReceiptExport] #3 filename:', filename);

    try {
      // ── 2. Export mode + scan animation ──────────────────────────────────
      setIsExportMode(true);
      setStatus('scanning');
      console.log('[ReceiptExport] #4 scanning...');
      await new Promise(r => setTimeout(r, 700));

      setStatus('capturing');
      console.log('[ReceiptExport] #5 capturing...');

      // ── 3. Two rAFs — let DOM settle ──────────────────────────────────────
      await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

      // ── 4. Capture with html-to-image ─────────────────────────────────────
      // html-to-image uses SVG foreignObject — handles Tailwind v4, CSS vars,
      // oklab colors, gradients, and box-shadows natively. No oklab crash.
      const dpr = Math.min(window.devicePixelRatio || 1, 3);
      const scale = dpr * 2; // up to 6× native = retina sharp

      console.log('[ReceiptExport] #6 toPng config:', { scale, width: offsetWidth, height: offsetHeight });
      const t0 = performance.now();

      const dataUrl = await toPng(el, {
        // Retina scaling
        pixelRatio: scale,
        // Explicit dimensions — prevents auto-sizing issues
        width: offsetWidth,
        height: offsetHeight,
        // Deep obsidian background — matches the receipt
        backgroundColor: '#040404',
        // Export-only visual tweaks applied via the filter callback
        filter: (node) => {
          // Exclude the scan sweep overlay from the capture (it's outside #receipt-export anyway)
          if (node instanceof HTMLElement && node.dataset.excludeFromExport === 'true') {
            return false;
          }
          return true;
        },
        style: {
          // Sharper font rendering for the exported image
          WebkitFontSmoothing: 'antialiased',
          textRendering: 'geometricPrecision',
        } as any,
        // Skip web fonts that may 404 (use system fallbacks)
        skipFonts: false,
        // Cache bust for any cross-origin resources
        cacheBust: true,
      });

      const captureMs = (performance.now() - t0).toFixed(0);
      console.log('[ReceiptExport] #7 toPng DONE ✓', { captureMs: captureMs + 'ms', dataUrlLength: dataUrl.length });

      setStatus('sharing');
      await new Promise(r => setTimeout(r, 150));

      // ── 5. Convert to Blob for Web Share API ──────────────────────────────
      console.log('[ReceiptExport] #8 converting to blob...');
      const blob = dataUrlToBlob(dataUrl);
      console.log('[ReceiptExport] #9 blob size:', blob.size, 'bytes');

      // ── 6. Share or Download ──────────────────────────────────────────────
      const file = new File([blob], filename, { type: 'image/png' });
      const canNativeShare =
        typeof navigator.share === 'function' &&
        typeof navigator.canShare === 'function' &&
        navigator.canShare({ files: [file] });

      console.log('[ReceiptExport] #10 Web Share available:', canNativeShare);

      if (canNativeShare) {
        console.log('[ReceiptExport] → navigator.share (native sheet)');
        try {
          await navigator.share({
            files: [file],
            title: 'THE CLINIC — Neural Diagnostic Report',
            text: 'My behavioral evaluation from THE CLINIC.',
          });
          console.log('[ReceiptExport] navigator.share ✓');
        } catch (shareErr) {
          // Share dismissed / permission denied → fall back silently
          console.warn('[ReceiptExport] share dismissed/failed, falling back to download:', shareErr);
          downloadDataUrl(dataUrl, filename);
        }
      } else {
        console.log('[ReceiptExport] → download fallback');
        downloadDataUrl(dataUrl, filename);
      }

      setStatus('done');
      console.log('[ReceiptExport] ── DONE ✓ ──────────────────────────────');
    } catch (err) {
      console.error('[ReceiptExport] ── FAILED ✗ ─────────────────────────', err);
      setStatus('error');
    } finally {
      await new Promise(r => setTimeout(r, 1200));
      setIsExportMode(false);
      setStatus('idle');
    }
  }, [targetId, classification]);

  return {
    triggerExport,
    status,
    isExportMode,
    isCapturing: status === 'scanning' || status === 'capturing',
  };
}
