import React from 'react';
import { motion } from 'framer-motion';
import { PageWrapper } from '../components/layout';
import { Text, GlassPanel, TriageSelector } from '../components/ui';
import { staggerContainer, fadeUp, pulseGlow } from '../utils/motion';

interface LandingPageProps {
  onStartQuiz: (severityId: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartQuiz }) => {
  return (
    <PageWrapper ambientGlow="cyan">
      
      {/* Scanline Overlay */}
      <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden mix-blend-overlay opacity-20">
        <div className="w-full h-full bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] shadow-[0_0_2px_rgba(0,0,0,0.5)_inset]" />
      </div>

      <motion.div 
        className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[80vh] relative z-10"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {/* Glowing Medical Icon */}
        <motion.div variants={fadeUp} className="mb-12 relative">
          <motion.div 
            variants={pulseGlow}
            className="absolute inset-0 bg-neon-cyan/20 blur-xl rounded-full"
          />
          <GlassPanel intensity="heavy" variant="cyan" className="w-20 h-20 flex items-center justify-center rounded-full">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-neon-cyan">
              <path d="M12 2V6M12 18V22M6 12H2M22 12H18M19.0711 19.0711L16.2426 16.2426M7.75736 7.75736L4.92893 4.92893M19.0711 4.92893L16.2426 7.75736M7.75736 16.2426L4.92893 19.0711" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
          </GlassPanel>
        </motion.div>

        {/* Hero Text */}
        <motion.div variants={fadeUp} className="text-center mb-6">
          <Text variant="h1" glow="cyan" className="mb-4 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70">
            DIGITAL EMERGENCY ROOM
          </Text>
          <Text variant="body" className="max-w-2xl mx-auto opacity-80">
            Your brain has been exposed to dangerous levels of scrolling.
          </Text>
        </motion.div>

        {/* Divider */}
        <motion.div variants={fadeUp} className="w-full max-w-xs h-px bg-gradient-to-r from-transparent via-neon-cyan/30 to-transparent my-12" />

        {/* Triage Prompt */}
        <motion.div variants={fadeUp} className="w-full max-w-xl mx-auto">
          <GlassPanel intensity="medium" className="p-8 md:p-10 flex flex-col items-center">
            <Text variant="cyber" glow="cyan" className="text-sm md:text-base mb-8 tracking-[0.4em] text-center">
              EVALUATION PROTOCOL
            </Text>
            
            <Text variant="h3" className="mb-8 text-center text-white/90 font-medium">
              How cooked are you?
            </Text>

            <TriageSelector onSelect={onStartQuiz} />
          </GlassPanel>
        </motion.div>

      </motion.div>
    </PageWrapper>
  );
};
