import React, { useRef, useState, useEffect } from 'react';
import { motion, type HTMLMotionProps, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion';
import { cn } from '../../utils/cn';

interface GlassPanelProps extends HTMLMotionProps<'div'> {
  variant?: 'default' | 'cyan' | 'toxic' | 'medical';
  intensity?: 'light' | 'medium' | 'heavy';
  interactiveGlow?: boolean;
}

export const GlassPanel = React.forwardRef<HTMLDivElement, GlassPanelProps>(
  ({ className, variant = 'default', intensity = 'medium', interactiveGlow = true, children, ...props }, ref) => {
    
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

    // Mouse tracking setup
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const smoothX = useSpring(mouseX, { stiffness: 300, damping: 40 });
    const smoothY = useSpring(mouseY, { stiffness: 300, damping: 40 });
    
    const [isHovered, setIsHovered] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const internalRef = useRef<HTMLDivElement>(null);

    // Sync refs
    const setRefs = (element: HTMLDivElement) => {
      internalRef.current = element;
      if (typeof ref === 'function') ref(element);
      else if (ref && 'current' in ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = element;
    };

    useEffect(() => {
      // Detect touch devices to disable performance-heavy mouse tracking on mobile
      setIsMobile(!window.matchMedia("(hover: hover) and (pointer: fine)").matches);
    }, []);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!internalRef.current || isMobile || !interactiveGlow) return;
      const { left, top } = internalRef.current.getBoundingClientRect();
      mouseX.set(e.clientX - left);
      mouseY.set(e.clientY - top);
    };

    const getGlowColor = () => {
      if (variant === 'cyan' || variant === 'medical') return 'rgba(0, 255, 255, 0.08)';
      if (variant === 'toxic') return 'rgba(57, 255, 20, 0.08)';
      return 'rgba(255, 255, 255, 0.04)';
    };

    const background = useMotionTemplate`radial-gradient(400px circle at ${smoothX}px ${smoothY}px, ${getGlowColor()}, transparent 80%)`;

    return (
      <motion.div
        ref={setRefs}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => !isMobile && setIsHovered(true)}
        onMouseLeave={() => !isMobile && setIsHovered(false)}
        className={cn(
          'relative rounded-3xl border overflow-hidden',
          borders[variant],
          blurIntensity[intensity],
          className
        )}
        {...props}
      >
        {/* Interactive Mouse Glow Overlay */}
        {interactiveGlow && !isMobile && (
          <motion.div
            className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-700"
            style={{ background, opacity: isHovered ? 1 : 0 }}
          />
        )}
        
        {/* Subtle inner gradient for premium feel */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none z-0" />
        
        <div className="relative z-10">
          {children}
        </div>
      </motion.div>
    );
  }
);

GlassPanel.displayName = 'GlassPanel';
