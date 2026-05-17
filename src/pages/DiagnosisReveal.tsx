import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Text, GlassPanel } from '../components/ui';
import { getDiagnosis, getMetricInterpretation, getExitLine } from '../data/quizData';
import type { NeuralMetrics } from '../data/quizData';

interface DiagnosisRevealProps {
  profile: NeuralMetrics;
  severityColor: 'cyan' | 'orange' | 'green';
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
  low:      { text: 'text-neon-cyan',  bar: 'bg-neon-cyan',    glow: 'shadow-glow-cyan' },
  moderate: { text: 'text-orange-400', bar: 'bg-orange-400',   glow: 'shadow-[0_0_15px_2px_rgba(255,165,0,0.5)]' },
  high:     { text: 'text-orange-500', bar: 'bg-orange-500',   glow: 'shadow-[0_0_15px_2px_rgba(255,100,0,0.5)]' },
  critical: { text: 'text-neon-green', bar: 'bg-neon-green',   glow: 'shadow-glow-green' },
};

export const DiagnosisReveal: React.FC<DiagnosisRevealProps> = ({ profile, severityColor }) => {
  const [stage, setStage] = useState<Stage>('processing');
  const [stepIndex, setStepIndex] = useState(0);

  const diagnosis = getDiagnosis(profile);
  const palette = severityPalette[diagnosis.severity];

  // ── Processing sequence timer ──────────────────────────────────────────────
  useEffect(() => {
    if (stage !== 'processing') return;
    if (stepIndex < PROCESSING_STEPS.length - 1) {
      const t = setTimeout(() => setStepIndex(i => i + 1), 900);
      return () => clearTimeout(t);
    }
    // All steps done → lock-in
    const t = setTimeout(() => setStage('lockIn'), 1000);
    return () => clearTimeout(t);
  }, [stage, stepIndex]);

  // ── Lock-in hold → reveal ──────────────────────────────────────────────────
  useEffect(() => {
    if (stage !== 'lockIn') return;
    const t = setTimeout(() => setStage('reveal'), 2000);
    return () => clearTimeout(t);
  }, [stage]);

  // ── Colour theme from the quiz variant ────────────────────────────────────
  const accentText  = severityColor === 'orange' ? 'text-orange-400' : severityColor === 'green' ? 'text-neon-green' : 'text-neon-cyan';
  const accentBg    = severityColor === 'orange' ? 'bg-orange-400'   : severityColor === 'green' ? 'bg-neon-green'   : 'bg-neon-cyan';
  const accentShadow = severityColor === 'orange'
    ? 'shadow-[0_0_15px_2px_rgba(255,165,0,0.4)]'
    : severityColor === 'green' ? 'shadow-glow-green' : 'shadow-glow-cyan';

  // ── Helpers ────────────────────────────────────────────────────────────────
  const clampedValue = (key: keyof NeuralMetrics) => Math.min(100, profile[key]);

  const isCriticalMetric = (key: keyof NeuralMetrics, invert?: boolean) => {
    const v = profile[key];
    return invert ? v < 50 : v > 50;
  };

  const exitLine = getExitLine(profile);

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center min-h-screen relative z-10 px-4 py-12">
      <AnimatePresence mode="wait">

        {/* ── PROCESSING ──────────────────────────────────────────────────── */}
        {stage === 'processing' && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="flex flex-col items-center gap-10 text-center w-full"
          >
            {/* Pulsing Core */}
            <motion.div
              animate={{ scale: [1, 1.12, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              className={`w-16 h-16 rounded-full ${accentBg} ${accentShadow} flex items-center justify-center`}
            >
              <div className="w-6 h-6 bg-obsidianDark rounded-full" />
            </motion.div>

            {/* Cycling step messages */}
            <div className="flex flex-col items-center gap-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={stepIndex}
                  initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                >
                  <Text variant="cyber" className={`text-sm md:text-base tracking-[0.4em] ${accentText}`}>
                    {PROCESSING_STEPS[stepIndex]}
                  </Text>
                </motion.div>
              </AnimatePresence>

              {/* Progress dots */}
              <div className="flex gap-2 mt-2">
                {PROCESSING_STEPS.map((_, i) => (
                  <motion.div
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${i <= stepIndex ? `${accentBg} ${accentShadow}` : 'bg-white/20'}`}
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
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.02, filter: 'blur(4px)' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="flex flex-col items-center gap-6 text-center"
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

        {/* ── REVEAL ──────────────────────────────────────────────────────── */}
        {stage === 'reveal' && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="w-full flex flex-col gap-6"
          >
            {/* ── Header ─────────────────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="text-center mb-4"
            >
              <Text variant="mono" className="text-white/25 tracking-[0.5em] text-[9px] mb-6 block">
                DIGITAL EMERGENCY ROOM — NEURAL REPORT
              </Text>

              {/* Classification — dominant visual element */}
              <motion.h1
                initial={{ opacity: 0, scale: 0.97, filter: 'blur(6px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                transition={{ delay: 0.2, duration: 0.7, ease: 'easeOut' }}
                className={`font-mono font-bold tracking-[0.15em] leading-tight ${
                  diagnosis.severity === 'critical' ? 'text-2xl md:text-4xl' :
                  diagnosis.severity === 'high'     ? 'text-xl md:text-3xl' :
                                                      'text-xl md:text-2xl'
                } ${palette.text}`}
              >
                {diagnosis.classification}
              </motion.h1>

              {/* Thin divider */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 0.6, ease: 'easeOut' }}
                className={`mx-auto mt-5 mb-5 h-px w-20 ${palette.bar} opacity-40`}
              />

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.5 }}
                className="text-white/45 text-sm md:text-base font-light leading-relaxed max-w-md mx-auto"
              >
                {diagnosis.subtitle}
              </motion.p>
            </motion.div>

            {/* ── Metrics ────────────────────────────────────────────────── */}
            <GlassPanel intensity="medium" className="w-full p-6 md:p-8">
              <Text variant="mono" className="text-white/25 tracking-[0.4em] text-[9px] mb-7 block">
                NEURAL METRICS — SCAN RESULTS
              </Text>
              <div className="flex flex-col gap-5">
                {diagnosis.metrics.map((m, i) => {
                  const value = clampedValue(m.key, m.invert);
                  const critical = isCriticalMetric(m.key, m.invert);
                  const displayValue = m.invert ? value : value;
                  const barFill = m.invert ? (100 - value) : value;

                  return (
                    <motion.div
                      key={m.key}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + i * 0.14, duration: 0.4, ease: 'easeOut' }}
                      className="flex flex-col gap-1.5"
                    >
                      {/* Label + value row */}
                      <div className="flex justify-between items-center">
                        <Text variant="mono" className={`text-[10px] tracking-[0.25em] ${critical ? palette.text : 'text-white/50'}`}>
                          {m.label}
                        </Text>
                        <div className="flex items-center gap-2">
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 + i * 0.14 }}
                            className={`font-mono text-xs font-bold ${critical ? palette.text : 'text-white/60'}`}
                          >
                            {clampedValue(m.key)}{m.unit}
                          </motion.span>
                          {critical && (
                            <motion.span
                              initial={{ opacity: 0 }}
                              animate={{ opacity: [0, 1, 0] }}
                              transition={{ delay: 0.4 + i * 0.14, duration: 1.5, repeat: Infinity }}
                              className={`text-[8px] font-mono ${palette.text} tracking-widest`}
                            >
                              ⬤
                            </motion.span>
                          )}
                        </div>
                      </div>

                      {/* Bar */}
                      <div className="w-full h-[3px] bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${critical ? palette.bar : 'bg-white/25'} ${critical ? palette.glow : ''}`}
                          initial={{ width: '0%' }}
                          animate={{ width: `${m.invert ? (100 - clampedValue(m.key)) : clampedValue(m.key)}%` }}
                          transition={{ delay: 0.2 + i * 0.14, duration: 0.9, ease: 'easeOut' }}
                        />
                      </div>

                      {/* Interpretation line */}
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 + i * 0.14, duration: 0.5 }}
                        className={`text-[9px] md:text-[10px] font-light italic leading-relaxed ${
                          critical ? `${palette.text} opacity-60` : 'text-white/30'
                        }`}
                      >
                        {getMetricInterpretation(m.key, profile[m.key])}
                      </motion.p>
                    </motion.div>
                  );
                })}
              </div>
            </GlassPanel>

            {/* ── Clinical Observations ──────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
            >
              <GlassPanel intensity="light" className="w-full p-6 border border-white/5">
                <Text variant="mono" className="text-white/20 tracking-[0.4em] text-[9px] mb-5 block">
                  CLINICAL OBSERVATIONS
                </Text>
                <div className="flex flex-col gap-4">
                  {diagnosis.medicalNotes.map((note, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.0 + i * 0.18, duration: 0.4 }}
                      className="flex items-start gap-3"
                    >
                      <span className={`text-[8px] mt-[4px] ${palette.text} font-mono shrink-0 opacity-60`}>▸</span>
                      <p className="text-white/50 text-[11px] md:text-xs font-light leading-relaxed tracking-wide">
                        {note}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </GlassPanel>
            </motion.div>

            {/* ── Signature Exit Line ─────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.7, duration: 0.8, ease: 'easeOut' }}
              className="text-center pt-6 pb-4"
            >
              <div className="w-full h-px bg-gradient-to-r from-transparent via-white/8 to-transparent mb-8" />
              <Text variant="mono" className="text-white/15 tracking-[0.4em] text-[8px] mb-4 block">
                DIGITAL EMERGENCY ROOM — CASE CLOSED
              </Text>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.0, duration: 1.0 }}
                className={`text-sm md:text-base italic font-light tracking-wide leading-relaxed ${
                  diagnosis.severity === 'critical' ? palette.text + ' opacity-60' : 'text-white/35'
                }`}
              >
                {exitLine}
              </motion.p>
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
