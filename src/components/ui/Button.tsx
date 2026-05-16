import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '../../utils/cn';

interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'toxic' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', glow = true, children, ...props }, ref) => {
    
    const variants = {
      primary: 'bg-white/5 border border-neon-cyan/50 text-white hover:bg-neon-cyan/10 hover:border-neon-cyan',
      secondary: 'bg-transparent border border-white/20 text-white/70 hover:text-white hover:border-white/50 hover:bg-white/5',
      toxic: 'bg-white/5 border border-neon-green/50 text-white hover:bg-neon-green/10 hover:border-neon-green',
      ghost: 'bg-transparent border-transparent text-white/50 hover:text-white hover:bg-white/5'
    };

    const glowStyles = {
      primary: glow ? 'shadow-glow-cyan' : '',
      secondary: '',
      toxic: glow ? 'shadow-glow-green' : '',
      ghost: ''
    };

    const sizes = {
      sm: 'px-4 py-2 text-xs',
      md: 'px-6 py-3 text-sm',
      lg: 'px-8 py-4 text-base tracking-widest'
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          'relative flex items-center justify-center font-mono uppercase tracking-[0.2em] rounded-full transition-colors duration-300 backdrop-blur-md',
          variants[variant],
          glowStyles[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        <span className="relative z-10">{children}</span>
        
        {/* Hover Highlight Overlay */}
        <div className="absolute inset-0 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
