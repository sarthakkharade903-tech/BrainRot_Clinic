import React from 'react';
import { motion } from 'framer-motion';

interface HudOverlayProps {
  colorVariant?: 'cyan' | 'green' | 'orange' | 'none';
}

export const HudOverlay: React.FC<HudOverlayProps> = ({ colorVariant = 'cyan' }) => {
  const getStatusText = () => {
    if (colorVariant === 'orange') return 'EMERGENCY OVERRIDE // ATTENTION DEFICIT';
    if (colorVariant === 'green') return 'CRITICAL WARNING // DOPAMINE DEPLETION';
    return 'SYSTEM ONLINE // SIGNAL STABLE';
  };

  const getBlinkColor = () => {
    if (colorVariant === 'cyan') return 'bg-neon-cyan shadow-glow-cyan';
    if (colorVariant === 'orange') return 'bg-orange-500 shadow-[0_0_8px_rgba(255,165,0,0.8)]';
    if (colorVariant === 'green') return 'bg-neon-green shadow-glow-green';
    return 'bg-white';
  };

  const getDopamineLevel = () => {
    if (colorVariant === 'cyan') return 4;
    if (colorVariant === 'orange') return 2;
    if (colorVariant === 'green') return 1;
    return 5;
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden hidden md:block select-none">
      
      {/* Top Left: Main System Status */}
      <div className="absolute top-8 left-8 flex items-center gap-3">
        <motion.div 
          className={`w-1.5 h-1.5 rounded-full ${getBlinkColor()}`}
          animate={{ opacity: [1, 0.2, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="text-[9px] font-mono text-white/40 tracking-[0.4em] uppercase">
          {getStatusText()}
        </div>
      </div>

      {/* Top Right: Telemetry Data */}
      <div className="absolute top-8 right-8 flex flex-col items-end gap-1.5">
        <div className="text-[9px] font-mono text-white/30 tracking-[0.3em]">
          NEURAL SCAN: ACTIVE
        </div>
        <motion.div 
          className="text-[8px] font-mono text-white/20 tracking-[0.2em]"
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          {colorVariant === 'none' ? 'AWAITING INPUT...' : 'ANALYZING CORTEX...'}
        </motion.div>
      </div>

      {/* Bottom Left: Coordinates / Serial */}
      <div className="absolute bottom-8 left-8 flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <div className="w-4 h-[1px] bg-white/20" />
          <div className="text-[8px] font-mono text-white/20 tracking-[0.4em]">
            CLINIC_VER_0.9.4
          </div>
        </div>
        <motion.div 
          className="text-[8px] font-mono text-white/10 tracking-[0.2em] ml-6"
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          SEQ: {Math.floor(Math.random() * 89999 + 10000)} // REC: ONLINE
        </motion.div>
      </div>

      {/* Bottom Right: Dynamic Dopamine Levels */}
      <div className="absolute bottom-8 right-8 flex items-end gap-4">
        <div className="flex flex-col gap-2 items-end">
          <div className="text-[8px] font-mono text-white/30 tracking-[0.3em]">
            DOPAMINE RECEPTORS
          </div>
          <div className="flex gap-1.5">
            {[...Array(5)].map((_, i) => (
              <motion.div 
                key={i}
                className={`w-3 h-1 ${i < getDopamineLevel() ? getBlinkColor().split(' ')[0] + ' opacity-60' : 'bg-white/10'}`}
                animate={i === getDopamineLevel() - 1 ? { opacity: [0.2, 0.8, 0.2] } : {}}
                transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.1, ease: "easeInOut" }}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Environmental Neural Scan Geometry */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.03] blur-[1px]">
        {/* Subtle angled medical data lines */}
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          <line x1="-10%" y1="10%" x2="110%" y2="70%" stroke="currentColor" strokeWidth="0.2" className="text-white" strokeDasharray="2 15" />
          <line x1="-10%" y1="85%" x2="110%" y2="25%" stroke="currentColor" strokeWidth="0.2" className="text-white opacity-50" strokeDasharray="1 30" />
        </svg>

        {/* Massive Orbital Sweep 1 (Anchored far Bottom-Right) */}
        <motion.div 
          className="absolute -bottom-[50vh] -right-[20vw] w-[150vw] h-[150vw] min-w-[1200px] min-h-[1200px]"
          animate={{ rotate: -360 }}
          transition={{ duration: 400, repeat: Infinity, ease: "linear" }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
            {/* Tiny fragmented arcs with massive gaps */}
            <circle cx="50" cy="50" r="49" fill="none" stroke="currentColor" strokeWidth="0.05" strokeDasharray="5 150 1 120 8 100" className="text-white" />
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.02" strokeDasharray="15 300" className="text-white" />
          </svg>
        </motion.div>

        {/* Massive Orbital Sweep 2 (Anchored far Top-Left) */}
        <motion.div 
          className="absolute -top-[60vh] -left-[30vw] w-[180vw] h-[180vw] min-w-[1500px] min-h-[1500px]"
          animate={{ rotate: 360 }}
          transition={{ duration: 550, repeat: Infinity, ease: "linear" }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
            <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.03" strokeDasharray="12 250 2 200" className="text-white" />
            <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="0.08" strokeDasharray="0.5 150" className="text-white" />
          </svg>
        </motion.div>
      </div>
    </div>
  );
};
