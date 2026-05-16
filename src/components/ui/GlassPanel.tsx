import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '../../utils/cn';

interface GlassPanelProps extends HTMLMotionProps<'div'> {
  variant?: 'default' | 'cyan' | 'toxic' | 'medical';
  intensity?: 'light' | 'medium' | 'heavy';
}

export const GlassPanel = React.forwardRef<HTMLDivElement, GlassPanelProps>(
  ({ className, variant = 'default', intensity = 'medium', children, ...props }, ref) => {
    
    const borders = {
      default: 'border-white/10',
      cyan: 'border-neon-cyan/30 shadow-glow-cyan',
      toxic: 'border-neon-green/30 shadow-glow-green',
      medical: 'border-white/20 border-t-neon-cyan/50'
    };

    const blurIntensity = {
      light: 'bg-white/[0.02] backdrop-blur-sm',
      medium: 'bg-white/[0.04] backdrop-blur-md',
      heavy: 'bg-white/[0.08] backdrop-blur-xl'
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          'relative rounded-3xl border overflow-hidden',
          borders[variant],
          blurIntensity[intensity],
          className
        )}
        {...props}
      >
        {/* Subtle inner gradient for premium feel */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
        
        <div className="relative z-10">
          {children}
        </div>
      </motion.div>
    );
  }
);

GlassPanel.displayName = 'GlassPanel';
