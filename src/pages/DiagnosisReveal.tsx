import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Text } from '../components/ui';
import { ExportControls } from '../components/ui/ExportControls';
import { useReceiptExport } from '../hooks/useReceiptExport';
import { getDiagnosis, getClinicalStats, getExitLine } from '../data/quizData';
import type { NeuralMetrics } from '../data/quizData';

interface DiagnosisRevealProps {
  profile: NeuralMetrics;
  severityColor: 'cyan' | 'orange' | 'green';
  onEnterRecovery?: () => void;
}

// ─── Processing Sequence ──────────────────────────────────────────────────────
const PROCESSING_STEPS = [
  'COMPILING NEURAL PROFILE...',
  'ANALYZING BEHAVIORAL PATTERNS...',
  'CROSS-REFERENCING DOPAMINE DAMAGE...',
  'MAPPING ATTENTION FRAGMENTATION...',
  'FINALIZING DIAGNOSIS...',
];

type Stage = 'processing' | 'lockIn' | 'reveal';

// ─── Severity palette ─────────────────────────────────────────────────────────
const severityPalette = {
  low:      { text: 'text-neon-cyan',  bar: 'bg-neon-cyan',  glow: 'shadow-glow-cyan',  hex: '#00f5ff' },
  moderate: { text: 'text-orange-400', bar: 'bg-orange-400', glow: 'shadow-[0_0_15px_2px_rgba(255,165,0,0.5)]', hex: '#fb923c' },
  high:     { text: 'text-orange-500', bar: 'bg-orange-500', glow: 'shadow-[0_0_15px_2px_rgba(255,100,0,0.5)]', hex: '#f97316' },
  critical: { text: 'text-neon-green', bar: 'bg-neon-green', glow: 'shadow-glow-green', hex: '#39ff14' },
};

// ─── Case Status per severity ─────────────────────────────────────────────────
const caseStatusMap = {
  low:      'MONITORED',
  moderate: 'COMPROMISED',
  high:     'ACTIVE',
  critical: 'ACTIVE',
};

// ─── Rarity line per severity ─────────────────────────────────────────────────
const rarityMap = {
  low:      'OBSERVED IN 61.2% OF EVALUATIONS',
  moderate: 'OBSERVED IN 27.4% OF EVALUATIONS',
  high:     'OBSERVED IN 6.9% OF EVALUATIONS',
  critical: 'OBSERVED IN 4.8% OF EVALUATIONS',
};

// ─── Stable barcode bars ──────────────────────────────────────────────────────
const BARCODE_BARS = Array.from({ length: 38 }, () => ({
  width:   Math.random() > 0.55 ? '2px' : '1px',
  height:  Math.random() > 0.75 ? '100%' : '78%',
  opacity: (Math.random() * 0.35 + 0.55).toFixed(2),
}));

export const DiagnosisReveal: React.FC<DiagnosisRevealProps> = ({ profile, severityColor, onEnterRecovery }) => {
  const [stage, setStage] = useState<Stage>('processing');
  const [stepIndex, setStepIndex] = useState(0);

  const diagnosis     = getDiagnosis(profile);
  const themeSeverity = severityColor === 'cyan' ? 'low' : severityColor === 'orange' ? 'moderate' : 'critical';
  const palette       = severityPalette[themeSeverity];
  const clinicalStats = getClinicalStats(diagnosis.severity);

  // ── Session Metadata ───────────────────────────────────────────────────────
  const { sessionId, receiptDate, receiptTime } = useMemo(() => ({
    sessionId:   Math.random().toString(36).substring(2, 10).toUpperCase(),
    receiptDate: new Date()
      .toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })
      .replace(/\//g, '.'),
    receiptTime: new Date().toLocaleTimeString('en-US', {
      hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit',
    }),
  }), []);

  // ── Processing timer ───────────────────────────────────────────────────────
  useEffect(() => {
    if (stage !== 'processing') return;
    if (stepIndex < PROCESSING_STEPS.length - 1) {
      const t = setTimeout(() => setStepIndex(i => i + 1), 900);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStage('lockIn'), 1000);
    return () => clearTimeout(t);
  }, [stage, stepIndex]);

  // ── Lock-in → reveal ───────────────────────────────────────────────────────
  useEffect(() => {
    if (stage !== 'lockIn') return;
    const t = setTimeout(() => setStage('reveal'), 1600);
    return () => clearTimeout(t);
  }, [stage]);

  // ── Accent helpers ─────────────────────────────────────────────────────────
  const accentText   = severityColor === 'orange' ? 'text-orange-400'  : severityColor === 'green' ? 'text-neon-green'  : 'text-neon-cyan';
  const accentBg     = severityColor === 'orange' ? 'bg-orange-400'    : severityColor === 'green' ? 'bg-neon-green'    : 'bg-neon-cyan';
  const accentShadow = severityColor === 'orange'
    ? 'shadow-[0_0_15px_2px_rgba(255,165,0,0.4)]'
    : severityColor === 'green' ? 'shadow-glow-green' : 'shadow-glow-cyan';

  const exitLine   = getExitLine(profile);
  const caseStatus = caseStatusMap[diagnosis.severity];
  const rarityLine = rarityMap[diagnosis.severity];

  // ── Export system ──────────────────────────────────────────────────────────
  const receiptWrapperRef = useRef<HTMLDivElement>(null);
  const { triggerExport, status: exportStatus, isCapturing } = useReceiptExport({
    targetId:       'receipt-export',
    classification: diagnosis.classification,
  });

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center min-h-screen relative z-10 px-4 py-8 sm:py-12">
      <AnimatePresence mode="wait">

        {/* ── PROCESSING ──────────────────────────────────────────────────── */}
        {stage === 'processing' && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0,  filter: 'blur(0px)' }}
            exit={{    opacity: 0, y: -20, filter: 'blur(8px)' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="flex flex-col items-center gap-10 text-center w-full my-auto"
          >
            <motion.div
              animate={{ scale: [1, 1.12, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              className={`w-16 h-16 rounded-full ${accentBg} ${accentShadow} flex items-center justify-center`}
            >
              <div className="w-6 h-6 bg-obsidianDark rounded-full" />
            </motion.div>

            <div className="flex flex-col items-center gap-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={stepIndex}
                  initial={{ opacity: 0, y: 8,  filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0,  filter: 'blur(0px)' }}
                  exit={{    opacity: 0, y: -8,  filter: 'blur(4px)' }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                >
                  <Text variant="cyber" className={`text-sm md:text-base tracking-[0.4em] ${accentText}`}>
                    {PROCESSING_STEPS[stepIndex]}
                  </Text>
                </motion.div>
              </AnimatePresence>
              <div className="flex gap-2 mt-2">
                {PROCESSING_STEPS.map((_, i) => (
                  <motion.div
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
                      i <= stepIndex ? `${accentBg} ${accentShadow}` : 'bg-white/20'
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── LOCK-IN ─────────────────────────────────────────────────────── */}
        {stage === 'lockIn' && (
          <motion.div
            key="lockIn"
            initial={{ opacity: 0, scale: 0.95, filter: 'blur(8px)' }}
            animate={{ opacity: 1, scale: 1,    filter: 'blur(0px)' }}
            exit={{    opacity: 0, scale: 1.02,  filter: 'blur(4px)' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="flex flex-col items-center gap-6 text-center my-auto"
          >
            <motion.div
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Text variant="cyber" className={`text-lg md:text-2xl tracking-[0.5em] ${accentText}`}>
                DIAGNOSIS COMPLETE
              </Text>
            </motion.div>
            <div className={`w-24 h-px ${accentBg} opacity-60`} />
            <Text variant="mono" className="text-white/40 tracking-[0.3em] text-xs">
              GENERATING NEURAL RECEIPT...
            </Text>
          </motion.div>
        )}

        {/* ── REVEAL / RECEIPT ────────────────────────────────────────────── */}
        {stage === 'reveal' && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0, y: 36, filter: 'blur(14px)' }}
            animate={{ opacity: 1, y: 0,  filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(6px)' }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
            className="w-full flex flex-col items-center pt-4 pb-12 sm:pt-8"
          >
            {/* ── Receipt Wrapper (scan sweep anchor) ───────────────────── */}
            <div ref={receiptWrapperRef} className="relative w-full max-w-[420px]">

              {/* ── Cinematic Scan Sweep ──────────────────────────────────── */}
              <AnimatePresence>
                {isCapturing && (
                  <motion.div
                    key="scan-sweep"
                    className="absolute inset-x-0 pointer-events-none z-50"
                    style={{ top: 0, bottom: 0, borderRadius: '18px', overflow: 'hidden' }}
                  >
                    <motion.div
                      initial={{ top: 0 }}
                      animate={{ top: '100%' }}
                      transition={{ duration: 0.65, ease: 'linear' }}
                      className="absolute left-0 right-0"
                      style={{
                        height: '2px',
                        background: `linear-gradient(to right, transparent 0%, ${palette.hex}cc 40%, ${palette.hex} 50%, ${palette.hex}cc 60%, transparent 100%)`,
                        boxShadow: `0 0 12px 4px ${palette.hex}44`,
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── THE RECEIPT CARD ─────────────────────────────────────── */}
              <div
                id="receipt-export"
                className="relative w-full flex flex-col gap-0"
                style={{
                  background:   '#040404',
                  border:       '1px solid rgba(255,255,255,0.07)',
                  borderRadius: '18px',
                  overflow:     'hidden',
                  boxShadow:    '0 24px 80px rgba(0,0,0,0.8), 0 2px 0px rgba(255,255,255,0.04) inset',
                }}
              >
                {/* Scanline texture */}
                <div
                  className="absolute inset-0 pointer-events-none z-10"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.07) 2px, rgba(0,0,0,0.07) 4px)',
                    borderRadius: '18px',
                  }}
                />
                {/* Print grain */}
                <div
                  data-export-grain
                  className="absolute inset-0 pointer-events-none z-10 opacity-[0.018]"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
                    backgroundSize: '160px 160px',
                  }}
                />
                {/* Atmospheric top glow */}
                <div
                  data-export-glow
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-[200%] pointer-events-none"
                  style={{
                    height:     '120px',
                    background: `radial-gradient(ellipse at center, ${palette.hex}08 0%, transparent 70%)`,
                  }}
                />

                {/* ── Inner Content ─────────────────────────────────────── */}
                <div className="relative z-20 flex flex-col gap-4 p-5 sm:p-7">

                  {/* ── Header / Metadata ──────────────────────────────── */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.9 }}
                    className="flex justify-between items-start pb-5"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                  >
                    <div className="flex flex-col gap-1.5">
                      <Text variant="mono" className="text-[8px] tracking-[0.25em] text-white/20">
                        PATIENT.ID // {sessionId}
                      </Text>
                      <Text variant="mono" className="text-[8px] tracking-[0.25em] text-white/20">
                        SYS.TIME // {receiptTime}
                      </Text>
                    </div>
                    <div className="flex flex-col gap-1.5 text-right">
                      <Text variant="mono" className="text-[8px] tracking-[0.25em] text-white/20">
                        DATE // {receiptDate}
                      </Text>
                      <div className="flex flex-col gap-0.5 items-end">
                        <Text variant="mono" className={`text-[8px] tracking-[0.25em] ${palette.text} opacity-70`}>
                          STATUS // {diagnosis.severity.toUpperCase()}
                        </Text>
                        <Text variant="mono" className="text-[7px] tracking-[0.2em] text-white/15">
                          CASE // {caseStatus}
                        </Text>
                      </div>
                    </div>
                  </motion.div>

                  {/* ── Classification Block ───────────────────────────── */}
                  <div className="text-center py-2 relative">
                    <Text variant="mono" className="text-[7px] tracking-[0.45em] text-white/15 mb-3 block">
                      NEURAL DIAGNOSTIC REPORT
                    </Text>

                    {/* Ambient glow pulse — breathes in after classification reveals */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 0.14, 0] }}
                      transition={{ delay: 1.7, duration: 3.5, repeat: Infinity, repeatDelay: 5, ease: 'easeInOut' }}
                      className="absolute inset-x-0 pointer-events-none"
                      style={{
                        top: '50%', transform: 'translateY(-50%)',
                        height: '70px',
                        background: `radial-gradient(ellipse at center, ${palette.hex}50 0%, transparent 70%)`,
                        filter: 'blur(8px)',
                      }}
                    />
                    <motion.h1
                      initial={{ opacity: 0, scale: 0.94 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                      className={`relative font-mono font-bold leading-[1.08] mb-2 ${
                        diagnosis.severity === 'critical' ? 'text-3xl sm:text-[2.6rem]' :
                        diagnosis.severity === 'high'     ? 'text-2xl sm:text-[2rem]'   :
                                                            'text-xl sm:text-2xl'
                      } ${palette.text}`}
                      style={{ letterSpacing: '0.06em' }}
                    >
                      {diagnosis.classification}
                    </motion.h1>

                    {/* Rarity line */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.75, duration: 0.8 }}
                      className="mb-3"
                    >
                      <Text variant="mono" className="text-[7px] tracking-[0.3em] text-white/15">
                        {rarityLine}
                      </Text>
                    </motion.div>

                    {/* Hairline divider */}
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.65, duration: 0.7, ease: 'easeOut' }}
                      className="mx-auto mb-4"
                      style={{
                        height:     '1px',
                        width:      '40px',
                        background: `linear-gradient(to right, transparent, ${palette.hex}55, transparent)`,
                      }}
                    />

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8, duration: 0.9 }}
                      className="text-white/40 text-[13px] font-light leading-relaxed max-w-[260px] mx-auto italic"
                      style={{ fontFamily: 'Georgia, serif' }}
                    >
                      "{diagnosis.subtitle}"
                    </motion.p>
                  </div>

                  {/* ── Behavioral Recognition ─────────────────────────── */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.85, duration: 0.8 }}
                    className="flex flex-col gap-0"
                  >
                    <Text variant="mono" className="text-[7px] tracking-[0.4em] text-white/15 block mb-4">
                      BEHAVIORAL RECOGNITION
                    </Text>

                    {diagnosis.behavioralFinds.map((find, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -4 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.0 + i * 0.13, duration: 0.55 }}
                        className="flex gap-3 items-baseline py-2"
                        style={{
                          borderBottom: i < diagnosis.behavioralFinds.length - 1
                            ? '1px solid rgba(255,255,255,0.04)'
                            : 'none',
                        }}
                      >
                        <span
                          className={`font-mono text-[10px] shrink-0 ${palette.text}`}
                          style={{ opacity: 0.45 }}
                        >
                          —
                        </span>
                        <p
                          className="text-white/75 leading-snug"
                          style={{ fontFamily: 'Georgia, serif', fontSize: '13px' }}
                        >
                          {find}
                        </p>
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* ── System Readings ────────────────────────────────── */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.55, duration: 0.7 }}
                    className="flex flex-col gap-0 rounded-xl px-4 py-4"
                    style={{
                      background: 'rgba(255,255,255,0.015)',
                      border:     '1px solid rgba(255,255,255,0.035)',
                    }}
                  >
                    <Text variant="mono" className="text-[7px] tracking-[0.4em] text-white/15 block mb-3">
                      SYSTEM READINGS
                    </Text>
                    {clinicalStats.map((stat, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center"
                        style={{
                          paddingTop:    i > 0 ? '10px' : '0',
                          paddingBottom: i < clinicalStats.length - 1 ? '10px' : '0',
                          borderBottom:  i < clinicalStats.length - 1
                            ? '1px solid rgba(255,255,255,0.04)'
                            : 'none',
                        }}
                      >
                        <Text variant="mono" className="text-[9px] tracking-[0.15em] text-white/30">
                          {stat.label}
                        </Text>
                        <span
                          className={`font-mono text-[9px] tracking-[0.12em] ${palette.text}`}
                          style={{ opacity: 0.65 }}
                        >
                          {stat.value}
                        </span>
                      </div>
                    ))}
                  </motion.div>

                  {/* ── Footer / Exit Quote + Barcode ─────────────────── */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.0, duration: 1.1 }}
                    className="flex flex-col items-center text-center"
                    style={{ borderTop: '1px dashed rgba(255,255,255,0.06)', paddingTop: '24px', marginTop: '4px' }}
                  >
                    <p
                      className={`leading-relaxed mb-7 max-w-[300px] mx-auto ${
                        diagnosis.severity === 'critical' ? palette.text : 'text-white/55'
                      }`}
                      style={{
                        fontFamily:    'Georgia, serif',
                        fontSize:      '15px',
                        fontStyle:     'italic',
                        letterSpacing: '0.015em',
                        lineHeight:    '1.65',
                        opacity:       diagnosis.severity === 'critical' ? undefined : 0.85,
                      }}
                    >
                      "{exitLine}"
                    </p>

                    {/* Barcode stamp */}
                    <div className="flex flex-col items-center gap-2.5" style={{ opacity: 0.22 }}>
                      <div className="flex gap-[2px] items-end" style={{ height: '30px' }}>
                        {BARCODE_BARS.map((bar, i) => (
                          <div
                            key={i}
                            className="bg-white"
                            style={{ width: bar.width, height: bar.height, opacity: Number(bar.opacity) }}
                          />
                        ))}
                      </div>
                      <Text variant="mono" className="text-[6.5px] tracking-[0.55em] text-white/70">
                        VALIDATED BY THE CLINIC
                      </Text>
                    </div>
                  </motion.div>

                </div>{/* end inner content */}
              </div>{/* end receipt card */}

            </div>{/* end receipt wrapper */}

            {/* ── Export Controls ───────────────────────────────────────── */}
            <ExportControls
              onExport={triggerExport}
              status={exportStatus}
              isCapturing={isCapturing}
              accentText={accentText}
              accentBg={accentBg}
              severityHex={palette.hex}
              onEnterRecovery={onEnterRecovery}
            />

          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};
