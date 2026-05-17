import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { Text, Button, GlassPanel } from '../components/ui';

import { INITIAL_METRICS, quizVariants, getWeightedRandomQuestions, getAdaptiveMessage, getFinishingMessages, getContextualQuestion } from '../data/quizData';
import type { NeuralMetrics, Question } from '../data/quizData';

interface QuizFlowProps {
  severityId: string;
  onComplete: (profile: NeuralMetrics) => void;
}

export const QuizFlow: React.FC<QuizFlowProps> = ({ severityId, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFinishing, setIsFinishing] = useState(false);
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [profile, setProfile] = useState<NeuralMetrics>(INITIAL_METRICS);
  
  // Adaptive Messaging State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [adaptiveMessage, setAdaptiveMessage] = useState("CALIBRATING NEURAL BASELINE...");
  
  // Finishing Sequence State
  const [finishingMsgIndex, setFinishingMsgIndex] = useState(0);
  const finishingMessages = useMemo(() => isFinishing ? getFinishingMessages(profile) : [], [isFinishing, profile]);

  useEffect(() => {
    if (isFinishing && finishingMsgIndex < finishingMessages.length - 1) {
      const timer = setTimeout(() => setFinishingMsgIndex(prev => prev + 1), 1200);
      return () => clearTimeout(timer);
    }
  }, [isFinishing, finishingMsgIndex, finishingMessages]);

  // Fallback to '1' if invalid severityId is passed
  const variant = quizVariants[severityId] || quizVariants['1'];

  // Initialize randomized questions + 1 contextual time-aware question on mount
  useEffect(() => {
    const randomized = getWeightedRandomQuestions(variant.questions, 3);
    const contextual = getContextualQuestion();
    // Inject contextual Q at a random position (not first, feels more natural)
    const insertAt = Math.floor(Math.random() * randomized.length) + 1;
    randomized.splice(insertAt, 0, contextual);
    setActiveQuestions(randomized);
  }, [severityId, variant.questions]);

  const handleSelect = (impact: Partial<NeuralMetrics>) => {
    // Haptic Feedback
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(40);
    }

    // Update Hidden Neural Profile
    const newProfile = {
      dopamineCorruption: profile.dopamineCorruption + (impact.dopamineCorruption || 0),
      attentionDecay: profile.attentionDecay + (impact.attentionDecay || 0),
      grassDeficiency: profile.grassDeficiency + (impact.grassDeficiency || 0),
      neuralStability: profile.neuralStability + (impact.neuralStability || 0),
      cognitiveFragmentation: profile.cognitiveFragmentation + (impact.cognitiveFragmentation || 0),
    };
    setProfile(newProfile);

    const progressRatio = currentIndex / activeQuestions.length;

    // Compute Adaptive Message
    const totalImpact = Object.values(impact).reduce((a, b) => Math.abs(a as number) + Math.abs(b as number), 0);
    const msg = getAdaptiveMessage(newProfile, impact, progressRatio);
    setAdaptiveMessage(msg);

    const isSevere = totalImpact > 25;
    const isCritical = totalImpact > 35;

    // Dynamic pacing: Deeper stages and severe answers get longer, more dramatic pauses
    let pauseDuration = 0;
    if (isCritical && progressRatio > 0.6) pauseDuration = 2200; // Late stage critical realization
    else if (isSevere) pauseDuration = 1400; // Standard severe anomaly
    else if (progressRatio > 0.7) pauseDuration = 800; // Subtle processing delay late in the quiz

    if (pauseDuration > 0 && currentIndex < activeQuestions.length - 1) {
      setIsAnalyzing(true);
      setTimeout(() => {
        setIsAnalyzing(false);
        setCurrentIndex(prev => prev + 1);
      }, pauseDuration);
    } else if (currentIndex < activeQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsFinishing(true);
      const finalMsgs = getFinishingMessages(newProfile);
      setTimeout(() => {
        onComplete(newProfile);
      }, Math.max(4500, finalMsgs.length * 1200 + 500)); // Dynamic cinematic hold
    }
  };

  if (activeQuestions.length === 0) return null; // Avoid rendering until questions are set

  const progress = ((currentIndex) / activeQuestions.length) * 100;
  
  // Tailwind dynamic classes based on variant color
  const colorMap = {
    cyan: { bg: 'bg-neon-cyan', text: 'text-neon-cyan', shadow: 'shadow-glow-cyan', hoverBg: 'hover:bg-neon-cyan/5', hoverText: 'group-hover:text-neon-cyan' },
    orange: { bg: 'bg-orange-500', text: 'text-orange-500', shadow: 'shadow-[0_0_15px_2px_rgba(255,165,0,0.4)]', hoverBg: 'hover:bg-orange-500/5', hoverText: 'group-hover:text-orange-500' },
    green: { bg: 'bg-neon-green', text: 'text-neon-green', shadow: 'shadow-glow-green', hoverBg: 'hover:bg-neon-green/5', hoverText: 'group-hover:text-neon-green' }
  };
  
  const theme = colorMap[variant.color];

  return (
    <>
      {/* HUD Progress Indicator */}
      <div className="fixed top-0 left-0 w-full h-1 bg-white/5 z-50">
        <motion.div 
          className={`h-full ${theme.bg} ${theme.shadow}`}
          initial={{ width: '0%' }}
          animate={{ width: isFinishing ? '100%' : `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>

      <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[70vh] relative z-10 px-4">
        
        <GlassPanel intensity="heavy" className="w-full p-6 md:p-12 overflow-hidden relative">
          
          <AnimatePresence mode="wait">
            {!isFinishing ? (
              <motion.div 
                key="quiz-content" 
                initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }} 
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} 
                exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <div className="flex justify-between items-center mb-10 border-b border-white/10 pb-6">
                  <div className="flex flex-col gap-1">
                    <Text variant="cyber" glow={variant.color} className="text-xs md:text-sm tracking-[0.3em]">
                      DIAGNOSTIC {currentIndex + 1}/{activeQuestions.length}
                    </Text>
                    <AnimatePresence mode="wait">
                      <motion.span 
                        key={adaptiveMessage}
                        initial={{ opacity: 0, filter: 'blur(4px)' }}
                        animate={{ opacity: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, filter: 'blur(4px)' }}
                        className="text-[9px] md:text-[10px] font-mono text-white/40 tracking-[0.2em] uppercase"
                      >
                        {adaptiveMessage}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                  <div className="flex gap-2">
                    {activeQuestions.map((_, idx) => (
                      <div 
                        key={idx} 
                        className={`w-2 h-2 rounded-full transition-all duration-500 ${idx <= currentIndex ? `${theme.bg} ${theme.shadow} scale-110` : 'bg-white/20'}`}
                      />
                    ))}
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {isAnalyzing ? (
                    <motion.div
                      key="analyzing-pause"
                      initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="flex flex-col items-center justify-center min-h-[250px] text-center"
                    >
                      <Text variant="cyber" className={`text-sm md:text-base tracking-[0.4em] ${theme.text} animate-pulse`}>
                        {adaptiveMessage}
                      </Text>
                    </motion.div>
                  ) : (
                    <motion.div
                      key={currentIndex}
                      initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="flex flex-col gap-8"
                    >
                      <Text variant="h3" className="text-white/90 font-medium leading-relaxed min-h-[80px]">
                        {activeQuestions[currentIndex].title}
                      </Text>

                    <div className="flex flex-col gap-4">
                      {activeQuestions[currentIndex].options.map((opt, idx) => (
                        <Button 
                          key={idx}
                          variant="ghost" 
                          onClick={() => handleSelect(opt.impact)}
                          className={`w-full justify-start text-left border border-white/10 ${theme.hoverBg} py-3 px-4 md:py-4 md:px-6 group`}
                        >
                          <span className={`text-white/30 ${theme.hoverText} mr-4 font-mono text-xs transition-colors`}>
                            {['A', 'B', 'C'][idx]}
                          </span>
                          <span className="text-white/80 group-hover:text-white transition-colors">
                            {opt.text}
                          </span>
                        </Button>
                      ))}
                    </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div 
                key="finishing"
                initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="flex flex-col items-center justify-center min-h-[300px] text-center"
              >
                {/* Core Glow Icon */}
                <motion.div 
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: [0.5, 1.2, 1], opacity: [0, 1, 1] }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="mb-8"
                >
                  <motion.div 
                    className={`w-16 h-16 rounded-full ${theme.bg} ${theme.shadow} flex items-center justify-center`}
                    animate={{ scale: [1, 1.15, 1], opacity: [0.8, 1, 0.8] }}
                    transition={{ delay: 1.2, duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <div className="w-6 h-6 bg-obsidianDark rounded-full" />
                  </motion.div>
                </motion.div>
                
                {/* Main Diagnostic Text */}
                <motion.div
                  initial={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ delay: 1.2, duration: 0.8 }}
                >
                  <Text variant="cyber" className={`mb-6 text-sm md:text-xl ${theme.text}`}>
                    {variant.diagnosticMessage}
                  </Text>
                </motion.div>
                
                {/* Secondary Prep Text */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.5, duration: 0.8 }}
                  className="w-full max-w-xs"
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={finishingMsgIndex}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Text variant="mono" className="text-white/50 tracking-[0.3em] text-[10px] md:text-xs mb-3">
                        {finishingMessages[finishingMsgIndex] || "PREPARING NEURAL WIPE..."}
                      </Text>
                    </motion.div>
                  </AnimatePresence>
                  
                  {/* Progress Bar for the wipe prep */}
                  <div className="w-full h-[2px] bg-white/10 overflow-hidden rounded-full">
                    <motion.div 
                      className={`h-full ${theme.bg} ${theme.shadow}`}
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ delay: 2.5, duration: Math.max(2, finishingMessages.length * 1.2), ease: "linear" }}
                    />
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

        </GlassPanel>
        
      </div>
    </>
  );
};
