import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';

const options = [
  { id: '1', label: 'Slightly Toasted', color: 'cyan', description: 'Still somewhat functional in society.' },
  { id: '2', label: 'Deep Fried', color: 'orange', description: 'Attention span of a goldfish on TikTok.' },
  { id: '3', label: 'I Forgot What Grass Looks Like', color: 'green', description: 'Critically overstimulated. Requires immediate neural wipe.' }
] as const;

export const TriageSelector: React.FC<{ onSelect?: (id: string) => void }> = ({ onSelect }) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (id: string) => {
    // Haptic feedback for mobile
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(50);
    }
    setSelectedId(id);
    
    // Trigger the state machine to move to Phase 2 after a tiny satisfying delay
    if (onSelect) {
      setTimeout(() => onSelect(id), 600);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {options.map((option, index) => {
        const isHovered = hoveredId === option.id;
        const isSelected = selectedId === option.id;
        
        // Dynamic glow colors based on option
        const glowColor = option.color === 'cyan' ? 'rgba(0, 255, 255, 0.5)' : 
                          option.color === 'orange' ? 'rgba(255, 165, 0, 0.5)' : 
                          'rgba(57, 255, 20, 0.5)';
                          
        const borderColor = option.color === 'cyan' ? 'border-neon-cyan' : 
                            option.color === 'orange' ? 'border-orange-500' : 
                            'border-neon-green';

        return (
          <motion.button
            key={option.id}
            onHoverStart={() => setHoveredId(option.id)}
            onHoverEnd={() => setHoveredId(null)}
            onClick={() => handleSelect(option.id)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "relative w-full p-6 flex items-center justify-between group overflow-hidden rounded-2xl border transition-all duration-300 text-left",
              isSelected || isHovered ? "bg-white/[0.08]" : "bg-white/[0.03] border-white/10",
              (isSelected || isHovered) ? borderColor : ""
            )}
            style={{
              boxShadow: (isSelected || isHovered) ? `0 0 20px -5px ${glowColor}` : 'none'
            }}
          >
            {/* Background animated gradient on hover */}
            <AnimatePresence>
              {(isHovered || isSelected) && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent pointer-events-none"
                />
              )}
            </AnimatePresence>

            <div className="relative z-10 flex flex-col">
              <div className="flex items-center gap-4 mb-1">
                <span className="font-mono text-xs tracking-widest text-white/30 uppercase w-6">
                  0{index + 1}
                </span>
                <span className={cn(
                  "font-bold tracking-wider text-lg md:text-xl transition-colors duration-300",
                  (isSelected || isHovered) ? "text-white" : "text-white/70"
                )}>
                  {option.label}
                </span>
              </div>
              <span className={cn(
                "pl-10 text-sm font-light transition-colors duration-300",
                (isSelected || isHovered) ? "text-white/70" : "text-white/40"
              )}>
                {option.description}
              </span>
            </div>

            {/* Glowing Cyber Indicator */}
            <div className="relative z-10 flex items-center justify-center w-6 h-6">
              <div className={cn(
                "w-2 h-2 rounded-full transition-all duration-500",
                (isSelected || isHovered) ? "scale-150" : "bg-white/20"
              )}
              style={{
                backgroundColor: (isSelected || isHovered) ? glowColor.replace('0.5', '1') : undefined,
                boxShadow: (isSelected || isHovered) ? `0 0 10px ${glowColor}` : 'none'
              }}
              />
            </div>
          </motion.button>
        );
      })}
    </div>
  );
};
