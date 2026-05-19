import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ExportStatus } from '../../hooks/useReceiptExport';

interface ExportControlsProps {
  onExport: () => void;
  status: ExportStatus;
  isCapturing: boolean;
  accentText: string;
  accentBg: string;
  severityHex: string;
}

/** Labels shown inside the export button based on state */
const STATUS_LABEL: Record<ExportStatus, string> = {
  idle:      'EXPORT RECEIPT',
  scanning:  'SCANNING...',
  capturing: 'CAPTURING...',
  sharing:   'PREPARING...',
  done:      'EXPORTED',
  error:     'RETRY EXPORT',
};

export const ExportControls: React.FC<ExportControlsProps> = ({
  onExport,
  status,
  isCapturing,
  accentText,
  accentBg,
  severityHex,
}) => {
  const isActive = status !== 'idle' && status !== 'done' && status !== 'error';
  const label = STATUS_LABEL[status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.8, duration: 0.8, ease: 'easeOut' }}
      className="w-full max-w-[420px] flex flex-col items-center gap-3 mt-5"
    >
      {/* ── Cinematic Scan Sweep Line ──────────────────────────────────── */}
      <AnimatePresence>
        {isCapturing && (
          <motion.div
            key="sweep"
            className="absolute left-0 right-0 pointer-events-none z-50"
            style={{ top: 0, height: '100%' }}
          >
            <motion.div
              initial={{ top: '-2px' }}
              animate={{ top: '100%' }}
              transition={{ duration: 0.65, ease: 'linear' }}
              className="absolute left-0 right-0"
              style={{ height: '1px', background: `linear-gradient(to right, transparent, ${severityHex}99, transparent)` }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Primary Export Button ─────────────────────────────────────── */}
      <button
        onClick={onExport}
        disabled={isActive}
        className={`
          relative w-full h-11 font-mono text-[10px] tracking-[0.45em]
          border transition-all duration-300 rounded-lg
          overflow-hidden group
          ${isActive
            ? 'opacity-50 cursor-not-allowed border-white/10 text-white/30'
            : `border-white/10 ${accentText} hover:border-white/20 hover:bg-white/[0.02] cursor-pointer`
          }
        `}
        style={{ background: 'rgba(255,255,255,0.02)' }}
        aria-label="Export diagnosis receipt as image"
      >
        {/* Shimmer sweep on hover */}
        {!isActive && (
          <span
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: `linear-gradient(90deg, transparent 0%, ${severityHex}08 50%, transparent 100%)`,
            }}
          />
        )}

        {/* Animated label */}
        <AnimatePresence mode="wait">
          <motion.span
            key={status}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="relative z-10"
          >
            {isActive && (
              <span className="inline-block w-1.5 h-1.5 rounded-full mr-3 align-middle animate-pulse"
                style={{ background: severityHex }}
              />
            )}
            {label}
          </motion.span>
        </AnimatePresence>
      </button>

      {/* ── Tip line ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {status === 'idle' && (
          <motion.p
            key="tip"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="text-[9px] font-mono tracking-[0.3em] text-white/15 text-center"
          >
            SAVES AS HIGH-RES PNG — SAFE TO SHARE
          </motion.p>
        )}
        {status === 'done' && (
          <motion.p
            key="done"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="text-[9px] font-mono tracking-[0.3em] text-center"
            style={{ color: severityHex, opacity: 0.6 }}
          >
            RECEIPT SAVED TO YOUR DEVICE
          </motion.p>
        )}
        {status === 'error' && (
          <motion.p
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="text-[9px] font-mono tracking-[0.3em] text-white/20 text-center"
          >
            EXPORT FAILED — TAP TO RETRY
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
