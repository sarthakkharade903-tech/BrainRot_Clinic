import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '../../utils/cn';

type TextVariant = 'h1' | 'h2' | 'h3' | 'body' | 'mono' | 'cyber';

interface TextProps extends HTMLMotionProps<'p'> {
  as?: React.ElementType;
  variant?: TextVariant;
  glow?: 'cyan' | 'green' | 'white' | 'none' | 'orange';
}

export const Text = React.forwardRef<HTMLElement, TextProps>(
  ({ className, as, variant = 'body', glow = 'none', children, ...props }, ref) => {
    
    const Component = as || (['h1', 'h2', 'h3'].includes(variant) ? variant : 'p');

    const baseStyles = {
      h1: 'text-5xl md:text-7xl font-black tracking-tighter',
      h2: 'text-3xl md:text-5xl font-bold tracking-tight',
      h3: 'text-xl md:text-2xl font-medium tracking-wide',
      body: 'text-base md:text-lg text-white/70 font-light leading-relaxed',
      mono: 'text-xs md:text-sm font-mono tracking-widest text-white/50 uppercase',
      cyber: 'text-2xl font-mono tracking-[0.3em] font-bold uppercase'
    };

    const glowStyles = {
      cyan: 'text-neon-cyan text-glow-cyan',
      green: 'text-neon-green text-glow-green',
      white: 'text-white text-glow-white',
      orange: 'text-orange-500 drop-shadow-[0_0_8px_rgba(255,165,0,0.8)]',
      none: ''
    };

    const MotionComponent = motion(Component);

    return (
      <MotionComponent
        ref={ref as any}
        className={cn(baseStyles[variant], glowStyles[glow], className)}
        {...props}
      >
        {children}
      </MotionComponent>
    );
  }
);

Text.displayName = 'Text';
