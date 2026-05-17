import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface AmbientParticlesProps {
  colorVariant?: 'cyan' | 'green' | 'orange' | 'none';
}

export const AmbientParticles: React.FC<AmbientParticlesProps> = ({ colorVariant = 'cyan' }) => {
  const particles = useMemo(() => {
    const isMobile = typeof window !== 'undefined' ? window.matchMedia("(max-width: 768px)").matches : false;
    const count = isMobile ? 12 : 45;

    return Array.from({ length: count }).map((_, i) => {
      const zLayer = Math.random(); // 0 (far) to 1 (close)
      const isSpark = Math.random() > 0.95; // 5% chance to be an electrical spark
      
      const initialX = Math.random() * 100;
      const initialY = Math.random() * 100;
      
      // Pull particles subtly towards the center neural core (50, 50)
      const driftX = (50 - initialX) * (Math.random() * 0.4) + (Math.random() * 20 - 10);
      const driftY = (50 - initialY) * (Math.random() * 0.4) + (Math.random() * 20 - 10);
      
      return {
        id: i,
        zLayer,
        isSpark,
        size: zLayer * 2.5 + 1.5, // 1.5px to 4px
        initialX,
        initialY,
        duration: (1 - zLayer) * 20 + 15, // Closer = faster (15s), Further = slower (35s)
        delay: Math.random() * -30,
        driftX,
        driftY,
        blur: (1 - zLayer) * 3, // Farther = blurrier
      };
    });
  }, []);

  if (colorVariant === 'none') return null;

  const getGlowColor = () => {
    if (colorVariant === 'cyan') return 'bg-neon-cyan shadow-glow-cyan';
    if (colorVariant === 'orange') return 'bg-orange-500 shadow-[0_0_8px_rgba(255,165,0,0.8)]';
    if (colorVariant === 'green') return 'bg-neon-green shadow-glow-green';
    return 'bg-white';
  };

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-60 z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className={`absolute rounded-full ${getGlowColor()}`}
          style={{
            width: p.size,
            height: p.size,
            left: `${p.initialX}%`,
            top: `${p.initialY}%`,
            filter: `blur(${p.blur}px)`,
          }}
          animate={{
            y: [0, p.driftY],
            x: [0, p.driftX],
            opacity: p.isSpark 
              ? [0, 0.1, 0.9, 0.1, 0] // Electrical flash
              : [0, p.zLayer * 0.6 + 0.2, 0], // Depth-based opacity pulse
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: p.delay,
            repeatType: "mirror" // Bounces back and forth smoothly
          }}
        />
      ))}
    </div>
  );
};
