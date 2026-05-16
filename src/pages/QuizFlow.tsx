import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageWrapper } from '../components/layout';
import { Text, Button, GlassPanel } from '../components/ui';

interface QuizFlowProps {
  severityId: string;
  onComplete: () => void;
}

interface Question {
  title: string;
  options: string[];
  weight?: number; // Higher weight = more likely to be selected
}

// --------------------------------------------------
// MASSIVE DYNAMIC QUESTION POOLS
// --------------------------------------------------
const quizVariants: Record<string, {
  color: 'cyan' | 'orange' | 'green';
  diagnosticMessage: string;
  questions: Question[];
}> = {
  '1': {
    color: 'cyan',
    diagnosticMessage: 'MINOR COGNITIVE SCROLL DAMAGE DETECTED',
    questions: [
      { weight: 2, title: "Someone texts you “can I call you real quick?” What is your immediate reaction?", options: ["An immediate spike in cortisol.", "Texting back “in a meeting” from my bed.", "Letting it ring out and typing “what’s up?” two minutes later."] },
      { weight: 2, title: "You are trying to fall asleep. What is the final barrier?", options: ["“One more video” turning into a 90-minute rabbit hole.", "Answering a text from four days ago.", "Checking my alarm six times to make sure it’s actually on."] },
      { weight: 2, title: "You unlocked your phone to look up something specific. Where are you 45 seconds later?", options: ["Staring at the home screen, completely forgetting the task.", "Deep in the comments section of a random thread.", "Checking an ex’s LinkedIn profile."] },
      { weight: 2, title: "You need to buy a basic item online. What is the process?", options: ["Reading 50 reviews to ensure it won't ruin my life.", "Sorting by lowest price and praying.", "Leaving it in the cart for a month because the shipping fee felt personal."] },
      { weight: 1, title: "You sit down to watch a movie. What happens five minutes in?", options: ["I put my phone in another room.", "I pause it to check Wikipedia for an actor's entire filmography.", "I start scrolling and miss the entire plot."] },
      { weight: 1, title: "You are watching a YouTube video that is 12 minutes long.", options: ["I watch it normally.", "I put it on 1.5x speed immediately.", "I rapidly skip through the timeline looking for the visual spikes."] },
      { weight: 1, title: "You have a free hour. What is the default action?", options: ["Do something productive or relaxing.", "Open an app, get bored, immediately open another app.", "Refresh my email inbox three times for no reason."] },
      { weight: 1, title: "You are eating a meal alone.", options: ["I eat in silence.", "I need a podcast playing in the background.", "I cannot take a single bite until I find the perfect 20-minute video."] },
      { weight: 1, title: "You have to make a phone call to schedule an appointment.", options: ["I dial the number immediately.", "I rehearse the first sentence in my head three times.", "I stare at the number for ten minutes until they close."] },
      { weight: 1, title: "You open a new tab on your browser.", options: ["To search something specific.", "To check Twitter, which is already open in another tab.", "To stare blankly at the Google homepage."] },
      { weight: 1, title: "You receive an email marked “URGENT”.", options: ["I read and reply immediately.", "I mark it unread and pretend I didn't see it.", "I leave it sitting in my inbox for three weeks as a psychological weight."] }
    ]
  },
  '2': {
    color: 'orange',
    diagnosticMessage: 'MODERATE ATTENTION DEFICIT DETECTED',
    questions: [
      { weight: 2, title: "How many tabs are currently open on your mobile browser?", options: ["Enough to make the browser icon change to a smiley face.", "42 tabs. None emotionally closed.", "I don’t check. If I look, the app might crash."] },
      { weight: 2, title: "You closed an app, locked your phone, and unlocked it two seconds later. Why?", options: ["Muscle memory took over.", "I hoped the internet changed in those two seconds.", "I literally forgot I just closed it."] },
      { weight: 2, title: "You are currently listening to music, but you also have a muted video playing on your laptop. Why?", options: ["Absolute silence is terrifying.", "My brain requires two streams of input to stay calm.", "I genuinely forgot it was open."] },
      { weight: 2, title: "It’s 3:00 AM. Why are you still awake?", options: ["A 3-hour video essay on a niche controversy.", "I’m deep in a comment section argument.", "The algorithm found my specific, unaddressed insecurity."] },
      { weight: 1, title: "You’re watching a movie and someone speaks a little too quietly. What is your reaction?", options: ["I turn the volume up.", "I instinctively look down hoping for a subtitle toggle.", "I accept that I missed the dialogue forever."] },
      { weight: 1, title: "You have to watch a 15-second unskippable ad.", options: ["I wait patiently.", "I mute the tab and look at my phone for exactly 15 seconds.", "I close the video. It’s no longer worth it."] },
      { weight: 1, title: "Your weekly screen time report pops up.", options: ["I review it to optimize my week.", "I swipe it away before my brain processes the number.", "I laugh at the 11-hour daily average. It's a high score."] },
      { weight: 1, title: "You are in an elevator with one other person.", options: ["I make polite small talk.", "I stare intently at the floor numbers.", "I pull out my phone and aggressively scroll through my own settings app."] },
      { weight: 1, title: "Someone sends you a 4-minute voice note.", options: ["I listen to it immediately.", "I listen to it on 2x speed while doing dishes.", "I reply “omg crazy” without listening to a single second."] },
      { weight: 1, title: "You receive a notification that someone liked a post of yours from 2018.", options: ["Oh, nice.", "Absolute panic. Who is perceiving me?", "I immediately archive the entire year of 2018."] }
    ]
  },
  '3': {
    color: 'green',
    diagnosticMessage: 'SEVERE DOPAMINE CORRUPTION DETECTED',
    questions: [
      { weight: 2, title: "You see a beautiful sunset in real life. What is your immediate thought?", options: ["“This looks like a high-end render.”", "“The graphics out here are crazy.”", "I need to take a photo to prove I was outside."] },
      { weight: 2, title: "How do you maintain your closest friendships?", options: ["A silent, non-stop exchange of TikTok links.", "Sending a meme that explains my mental state instead of talking.", "We haven’t spoken in actual paragraphs since 2023."] },
      { weight: 2, title: "How does your brain process real-time, physical conversations lately?", options: ["I catch myself looking for a 2x speed toggle on the person.", "I genuinely feel like I need subtitles for human speech.", "I just nod along while mentally scrolling my feed."] },
      { weight: 2, title: "Your phone screen goes black for a second and you see your own reflection. What is the vibe?", options: ["Jumpscare.", "Total existential defeat.", "I don’t recognize the person looking back."] },
      { weight: 1, title: "What happens when your internet goes down for exactly 3 minutes?", options: ["I go get a glass of water.", "I toggle airplane mode repeatedly like a rat hitting a lever.", "I legitimately forget how to exist in physical space."] },
      { weight: 1, title: "You're trying to focus on a serious task.", options: ["I put on lo-fi beats.", "I need a split-screen with Subway Surfers gameplay.", "I need three screens, an ambient noise generator, and a podcast to feel normal."] },
      { weight: 1, title: "How do you respond to a complex emotional situation?", options: ["I process my feelings and communicate.", "I find a TikTok therapist explaining it in 60 seconds.", "I reply with a reaction image of a cat staring blankly."] },
      { weight: 1, title: "You go to the bathroom.", options: ["I do my business and leave.", "I take my phone but only stay for 5 minutes.", "My legs fall asleep while I argue with strangers in a comment section."] },
      { weight: 1, title: "What does your inner monologue sound like?", options: ["My own voice, narrating thoughts.", "A text-to-speech AI voice reading Reddit posts.", "A chaotic mashup of trending audios overlapping each other."] },
      { weight: 1, title: "You drop your phone on your face while scrolling in bed.", options: ["I put the phone away and sleep.", "I wince, adjust my grip, and keep scrolling.", "I don't feel physical pain anymore. The scroll is eternal."] }
    ]
  }
};

// Weighted random selection engine
function getWeightedRandomQuestions(pool: Question[], count: number): Question[] {
  const selected: Question[] = [];
  const available = [...pool];
  
  while (selected.length < count && available.length > 0) {
    const totalWeight = available.reduce((sum, q) => sum + (q.weight || 1), 0);
    let random = Math.random() * totalWeight;
    
    for (let i = 0; i < available.length; i++) {
      random -= (available[i].weight || 1);
      if (random <= 0) {
        selected.push(available[i]);
        available.splice(i, 1);
        break;
      }
    }
  }
  return selected;
}

export const QuizFlow: React.FC<QuizFlowProps> = ({ severityId, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFinishing, setIsFinishing] = useState(false);
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);

  // Fallback to '1' if invalid severityId is passed
  const variant = quizVariants[severityId] || quizVariants['1'];

  // Initialize randomized questions on mount
  useEffect(() => {
    const randomized = getWeightedRandomQuestions(variant.questions, 3);
    setActiveQuestions(randomized);
  }, [severityId, variant.questions]);

  const handleSelect = () => {
    // Mobile Haptic Feedback
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(40);
    }

    if (currentIndex < activeQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsFinishing(true);
      setTimeout(() => {
        onComplete();
      }, 4500); // Cinematic hold for staggered animations
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
    <PageWrapper ambientGlow={variant.color}>
      
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
        
        <GlassPanel intensity="heavy" className="w-full p-8 md:p-12 overflow-hidden relative">
          
          <AnimatePresence mode="wait">
            {!isFinishing ? (
              <motion.div key="quiz-content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="flex justify-between items-center mb-10 border-b border-white/10 pb-6">
                  <Text variant="cyber" glow={variant.color} className="text-xs md:text-sm tracking-[0.3em]">
                    DIAGNOSTIC {currentIndex + 1}/{activeQuestions.length}
                  </Text>
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
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
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
                          onClick={handleSelect}
                          className={`w-full justify-start text-left border border-white/10 ${theme.hoverBg} py-4 px-6 group`}
                        >
                          <span className={`text-white/30 ${theme.hoverText} mr-4 font-mono text-xs transition-colors`}>
                            {['A', 'B', 'C'][idx]}
                          </span>
                          <span className="text-white/80 group-hover:text-white transition-colors">
                            {opt}
                          </span>
                        </Button>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div 
                key="finishing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.8 }}
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
                  <Text variant="mono" className="text-white/50 tracking-[0.3em] text-[10px] md:text-xs mb-3">
                    PREPARING NEURAL WIPE...
                  </Text>
                  
                  {/* Progress Bar for the wipe prep */}
                  <div className="w-full h-[2px] bg-white/10 overflow-hidden rounded-full">
                    <motion.div 
                      className={`h-full ${theme.bg} ${theme.shadow}`}
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ delay: 2.5, duration: 2.0, ease: "linear" }}
                    />
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

        </GlassPanel>
        
      </div>
    </PageWrapper>
  );
};
