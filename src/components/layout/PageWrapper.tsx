import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '../../utils/cn';
import { fadeUp } from '../../utils/motion';
import { HudOverlay } from './HudOverlay';
import { AtmosphericScene } from './AtmosphericScene';

interface PageWrapperProps extends HTMLMotionProps<'main'> {
  ambientGlow?: 'cyan' | 'green' | 'orange' | 'none';
}

export const PageWrapper = React.forwardRef<HTMLElement, PageWrapperProps>(
  ({ className, ambientGlow = 'cyan', children, ...props }, ref) => {
    
    return (
      <div className="relative min-h-screen w-full overflow-hidden bg-obsidianDark text-white flex flex-col items-center justify-center selection:bg-neon-cyan/30 selection:text-white">
        
        {/* Animated Gradient Orbs */}
        {ambientGlow !== 'none' && (() => {
          const glowColor = 
            ambientGlow === 'cyan' ? 'bg-neon-cyan/[0.04]' : 
            ambientGlow === 'green' ? 'bg-neon-green/[0.04]' : 
            'bg-orange-500/[0.04]';
          const secondaryGlowColor = 
            ambientGlow === 'cyan' ? 'bg-neon-cyan/[0.02]' : 
            ambientGlow === 'green' ? 'bg-neon-green/[0.02]' : 
            'bg-orange-500/[0.02]';

          return (
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
              {/* Primary Top-Left Orb */}
              <motion.div 
                className={cn("absolute top-[10%] left-[10%] w-[60vw] h-[60vw] max-w-[700px] max-h-[700px] rounded-full blur-[130px]", glowColor)}
                animate={{ 
                  x: [0, 40, 0, -40, 0], 
                  y: [0, -40, 40, 0, 0], 
                  scale: [1, 1.15, 0.9, 1.05, 1] 
                }}
                transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
              />
              
              {/* Secondary Bottom-Right Orb */}
              <motion.div 
                className={cn("absolute bottom-[10%] right-[10%] w-[70vw] h-[70vw] max-w-[800px] max-h-[800px] rounded-full blur-[150px]", secondaryGlowColor)}
                animate={{ 
                  x: [0, -50, 0, 50, 0], 
                  y: [0, 50, -30, 20, 0], 
                  scale: [1, 1.05, 1.15, 0.95, 1] 
                }}
                transition={{ duration: 32, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              />

              {/* Core Center Orb */}
              <motion.div 
                className={cn("absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] rounded-full blur-[100px]", secondaryGlowColor)}
                animate={{ 
                  scale: [1, 1.2, 1], 
                  opacity: [0.5, 0.8, 0.5] 
                }}
                transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          );
        })()}

        {/* ── 3D Atmospheric Scene (deepest layer) ── */}
        <AtmosphericScene />

        {/* Subtle Scanline Texture — very faint, cinematic not cyberpunk */}
        <motion.div 
          className="absolute inset-0 pointer-events-none z-40 mix-blend-overlay opacity-[0.05]"
          style={{
            backgroundImage: `linear-gradient(rgba(18,16,16,0) 50%, rgba(0,0,0,0.15) 50%)`,
            backgroundSize: '100% 4px'
          }}
          animate={{ backgroundPosition: ["0px 0px", "0px 4px"] }}
          transition={{ repeat: Infinity, duration: 0.25, ease: "linear" }}
        />

        {/* Edge Vignette — soft, cinematic depth */}
        <motion.div 
          className="absolute inset-0 pointer-events-none z-40"
          style={{ boxShadow: 'inset 0 0 120px rgba(0,0,0,0.55)' }}
          animate={{ opacity: [0.75, 1, 0.75] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Occasional very-soft signal flicker */}
        <motion.div 
          className="absolute inset-0 pointer-events-none z-50 bg-white mix-blend-overlay"
          animate={{ opacity: [0, 0, 0, 0.02, 0, 0, 0] }}
          transition={{ duration: 18, repeat: Infinity, times: [0, 0.4, 0.41, 0.42, 0.43, 0.9, 1] }}
        />

        {/* Noise Texture Overlay for premium cinematic feel */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-50" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />

        {/* Content Wrapper */}
        <motion.main
          ref={ref}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={fadeUp}
          className={cn('relative z-20 w-full max-w-5xl mx-auto px-6 py-12 flex flex-col items-center', className)}
          {...props}
        >
          {children}
        </motion.main>
        
        {/* Dynamic Telemetry HUD */}
        <HudOverlay colorVariant={ambientGlow} />
      </div>
    );
  }
);

PageWrapper.displayName = 'PageWrapper';
