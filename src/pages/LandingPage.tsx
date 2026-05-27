import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';
import { AtmosphericScene } from '../components/layout/AtmosphericScene';
import { staggerContainer, fadeUp } from '../utils/motion';

// ── Rotating behavioral observations ─────────────────────────────────────────
const OBSERVATIONS = [
  "Opens phone to check the time. Scrolls for 14 minutes instead.",
  "Has 9 tabs open from last Tuesday. None of them finished.",
  "Read the first sentence of an article. Formed a complete opinion.",
  "Felt guilty about not being productive. Scrolled to cope.",
  "Replied 'sounds good' without reading the message.",
  "Started typing a message. Deleted it. Reopened the app.",
  "Watched 3 seconds of a tutorial. Considered themselves informed.",
  "Opened the fridge. Forgot why. Checked the phone instead.",
  "Paused a video to scroll. Forgot the video. Forgot the scroll.",
  "Saved something to watch later. Later became never.",
  "Checked the time. Did not register the time. Checked again.",
  "Currently watching a video about phone addiction. On the phone.",
  "Listened to a podcast at 2x speed. Started another one before it ended.",
  "The to-do list has items. None of them were opened today.",
  "Liked a post mid-conversation. Did not notice either was happening.",
];

const SEVERITIES = [
  { id: '1', label: 'TOASTED', color: 'cyan', description: 'Occasional lapses. Phone still wins sometimes. Prognosis: manageable.' },
  { id: '2', label: 'FRIED', color: 'orange', description: 'Sustained scroll damage. Attention fragmented. Algorithm dependency confirmed.' },
  { id: '3', label: 'COOKED', color: 'green', description: 'Critical overstimulation. Reality feels underproduced. Grass: not found.' }
] as const;

interface LandingPageProps {
  onStartQuiz: (severityId: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartQuiz }) => {
  const [selectedSeverity, setSelectedSeverity] = useState<string>('2');
  const [obsIndex, setObsIndex] = useState(0);
  const [obsVisible, setObsVisible] = useState(true);

  // Rotate behavioral observation every 4.2s
  useEffect(() => {
    const interval = setInterval(() => {
      setObsVisible(false);
      const timer = setTimeout(() => {
        setObsIndex(i => (i + 1) % OBSERVATIONS.length);
        setObsVisible(true);
      }, 520);
      return () => clearTimeout(timer);
    }, 4200);
    return () => clearInterval(interval);
  }, []);

  // Soft haptic vibration for supported mobile devices
  const handleVibrate = () => {
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(30);
    }
  };

  // Dynamic glow classes for the selected pill
  const getActivePillStyle = (id: string) => {
    if (id !== selectedSeverity) return 'text-white/30 hover:text-white/50 border-transparent bg-transparent';
    return {
      '1': 'text-neon-cyan border-neon-cyan/30 bg-neon-cyan/[0.04] shadow-[0_0_20px_rgba(0,255,255,0.18)] scale-[1.03]',
      '2': 'text-orange-400 border-orange-500/30 bg-orange-500/[0.04] shadow-[0_0_20px_rgba(255,165,0,0.18)] scale-[1.03]',
      '3': 'text-neon-green border-neon-green/30 bg-neon-green/[0.04] shadow-[0_0_20px_rgba(57,255,20,0.18)] scale-[1.03]'
    }[id];
  };

  // Dynamic glow classes for primary CTA hover
  const getPrimaryCtaHoverStyle = () => {
    return {
      '1': 'hover:border-neon-cyan/40 hover:shadow-[0_0_30px_rgba(0,255,255,0.22)] hover:text-neon-cyan hover:bg-neon-cyan/[0.02]',
      '2': 'hover:border-orange-500/40 hover:shadow-[0_0_30px_rgba(255,165,0,0.22)] hover:text-orange-400 hover:bg-orange-500/[0.02]',
      '3': 'hover:border-neon-green/40 hover:shadow-[0_0_30px_rgba(57,255,20,0.22)] hover:text-neon-green hover:bg-neon-green/[0.02]'
    }[selectedSeverity];
  };

  return (
    <>
      {/* 3D atmospheric layer — sits fixed behind all content */}
      <AtmosphericScene />

      <motion.div 
        className="w-full max-w-md mx-auto flex flex-col items-center justify-center relative z-10 px-4 py-8 md:py-16 text-center select-none"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {/* Elegant pulsing logo */}
        <motion.div variants={fadeUp} className="mb-6 relative">
          <motion.div 
            animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.55, 0.3] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className={cn(
              "absolute inset-0 blur-lg rounded-full transition-colors duration-700 pointer-events-none",
              selectedSeverity === '1' ? 'bg-neon-cyan/25' :
              selectedSeverity === '2' ? 'bg-orange-500/25' :
              'bg-neon-green/25'
            )}
          />
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white/[0.02] border border-white/10 backdrop-blur-md">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white/70">
              <path d="M12 2V6M12 18V22M6 12H2M22 12H18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </div>
        </motion.div>

        {/* Cinematic Title & Emotional Subtitle */}
        <motion.div variants={fadeUp} className="mb-6 flex flex-col gap-2.5">
          <h1 
            className="text-4xl md:text-5xl font-light tracking-wide text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70"
            style={{ fontFamily: 'Georgia, serif', letterSpacing: '0.02em' }}
          >
            THE CLINIC
          </h1>
          <p 
            className="text-white/40 text-xs md:text-sm font-light italic tracking-wide"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            A premium digital sanctuary for overstimulated minds.
          </p>
        </motion.div>

        {/* Ambient Behavioral Observation whisper */}
        <motion.div variants={fadeUp} className="h-10 flex items-center justify-center mb-8 px-2 max-w-[280px] md:max-w-xs mx-auto">
          <AnimatePresence mode="wait">
            {obsVisible && (
              <motion.p
                key={obsIndex}
                initial={{ opacity: 0, y: 5, filter: 'blur(3px)' }}
                animate={{ opacity: 1, y: 0,  filter: 'blur(0px)' }}
                exit={{    opacity: 0, y: -4, filter: 'blur(3px)' }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="text-center text-[11px] leading-relaxed font-light text-white/20 italic"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                "{OBSERVATIONS[obsIndex]}"
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Compact Pill Selector ──────────────────────────────────── */}
        <motion.div variants={fadeUp} className="w-full mb-4">
          <div className="flex gap-2 p-1.5 rounded-full border border-white/5 bg-white/[0.015] backdrop-blur-md max-w-[340px] mx-auto relative justify-between">
            {SEVERITIES.map(s => (
              <button
                key={s.id}
                onClick={() => {
                  handleVibrate();
                  setSelectedSeverity(s.id);
                }}
                className={cn(
                  "flex-1 py-2 px-3 text-[10px] tracking-[0.25em] font-mono font-semibold rounded-full border transition-all duration-500 cursor-pointer text-center",
                  getActivePillStyle(s.id)
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Severity Description Reveal */}
        <div className="h-12 flex items-center justify-center mb-10 max-w-[320px] mx-auto px-4">
          <AnimatePresence mode="wait">
            <motion.p
              key={selectedSeverity}
              initial={{ opacity: 0, y: 4, filter: 'blur(2px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -4, filter: 'blur(2px)' }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="text-xs text-center text-white/45 font-light leading-relaxed italic"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              {SEVERITIES.find(s => s.id === selectedSeverity)?.description}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* ── CTA Stack ─────────────────────────────────────────────── */}
        <motion.div variants={fadeUp} className="w-full flex flex-col gap-3 max-w-[280px] mx-auto mt-2">
          {/* Primary CTA: Start Evaluation */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onStartQuiz(selectedSeverity)}
            className={cn(
              "w-full h-13 rounded-2xl border border-white/10 bg-white/[0.02] font-mono text-[9px] tracking-[0.4em] font-semibold text-white/70 transition-all duration-500 uppercase flex items-center justify-center cursor-pointer",
              getPrimaryCtaHoverStyle()
            )}
          >
            BEGIN EVALUATION
          </motion.button>
        </motion.div>

      </motion.div>
    </>
  );
};
