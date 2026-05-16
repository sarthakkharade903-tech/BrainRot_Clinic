import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '../../utils/cn';
import { fadeUp } from '../../utils/motion';

interface PageWrapperProps extends HTMLMotionProps<'main'> {
  ambientGlow?: 'cyan' | 'green' | 'orange' | 'none';
}

export const PageWrapper = React.forwardRef<HTMLElement, PageWrapperProps>(
  ({ className, ambientGlow = 'cyan', children, ...props }, ref) => {
    
    return (
      <div className="relative min-h-screen w-full overflow-hidden bg-obsidianDark text-white flex flex-col items-center justify-center selection:bg-neon-cyan/30 selection:text-white">
        
        {/* Ambient Glow Backgrounds */}
        {ambientGlow === 'cyan' && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-neon-cyan/5 rounded-full blur-[120px] pointer-events-none" />
        )}
        
        {ambientGlow === 'green' && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-neon-green/5 rounded-full blur-[120px] pointer-events-none" />
        )}

        {ambientGlow === 'orange' && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-orange-500/5 rounded-full blur-[120px] pointer-events-none" />
        )}

        {/* Noise Texture Overlay for premium cinematic feel */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />

        {/* Content Wrapper */}
        <motion.main
          ref={ref}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={fadeUp}
          className={cn('relative z-10 w-full max-w-5xl mx-auto px-6 py-12 flex flex-col items-center', className)}
          {...props}
        >
          {children}
        </motion.main>
        
        {/* Global Medical HUD Elements */}
        <div className="fixed top-6 left-6 text-[10px] font-mono text-white/30 tracking-[0.3em] uppercase pointer-events-none hidden md:block">
          CLINIC // SYSTEM.ACTIVE
        </div>
        <div className="fixed bottom-6 right-6 text-[10px] font-mono text-white/30 tracking-[0.3em] uppercase pointer-events-none hidden md:block">
          STATUS // MONITORING
        </div>
      </div>
    );
  }
);

PageWrapper.displayName = 'PageWrapper';
