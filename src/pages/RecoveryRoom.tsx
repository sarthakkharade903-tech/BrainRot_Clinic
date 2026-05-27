import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Text } from '../components/ui';
import { RipplePlane } from '../components/ui/RipplePlane';
import { useAmbientSound } from '../hooks/useAmbientSound';

interface RecoveryRoomProps {
  onExit: () => void;
}

const MESSAGES = [
  "You are safe here.",
  "Breathe.",
  "The internet is paused.",
  "Stay as long as you need.",
];

export const RecoveryRoom: React.FC<RecoveryRoomProps> = ({ onExit }) => {
  const [msgIndex, setMsgIndex] = useState(0);
  const [showExit, setShowExit] = useState(false);

  // Start the procedural breathing drone
  useAmbientSound(true);

  // Slowly cycle through reassuring messages
  useEffect(() => {
    if (msgIndex >= MESSAGES.length - 1) return;

    const timer = setTimeout(() => {
      setMsgIndex((prev) => prev + 1);
    }, 8000); // Very slow pacing

    return () => clearTimeout(timer);
  }, [msgIndex]);

  // Show exit button after 15 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowExit(true);
    }, 15000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden bg-transparent z-10 select-none">
      
      {/* ── 3D Interactive Layer (Ripples) ── */}
      <div className="absolute inset-0 z-0">
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 5], fov: 75 }}
          gl={{
            antialias: false,
            alpha: true,
            powerPreference: 'low-power',
          }}
          style={{ background: 'transparent' }}
        >
          {/* Subtle lighting not really needed for ShaderMaterial, but good practice */}
          <ambientLight intensity={1} />
          <RipplePlane />
        </Canvas>
      </div>

      {/* ── UI Layer ── */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center pointer-events-none">
        
        <AnimatePresence mode="wait">
          <motion.div
            key={msgIndex}
            initial={{ opacity: 0, filter: 'blur(8px)', y: 5 }}
            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            exit={{ opacity: 0, filter: 'blur(8px)', y: -5 }}
            transition={{ duration: 4.0, ease: 'easeInOut' }} // Extremely slow fades
          >
            <Text 
              variant="body" 
              className="text-white/40 tracking-[0.2em] font-light text-sm md:text-base"
              style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
            >
              {MESSAGES[msgIndex]}
            </Text>
          </motion.div>
        </AnimatePresence>

      </div>

      {/* ── Exit Controls ── */}
      <AnimatePresence>
        {showExit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 3.0 }}
            className="absolute bottom-12 left-0 right-0 flex justify-center z-20"
          >
            <button
              onClick={onExit}
              className="px-6 py-3 font-mono text-[10px] tracking-[0.4em] text-white/20 hover:text-white/60 transition-colors duration-1000 uppercase"
            >
              Return
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Vignette / Darkening Overlay ── */}
      <div 
        className="absolute inset-0 pointer-events-none z-[-1]"
        style={{
          background: 'radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.6) 100%)'
        }}
      />
    </div>
  );
};
