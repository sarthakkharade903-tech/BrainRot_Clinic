import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LandingPage, QuizFlow } from './pages';
import { DiagnosisReveal } from './pages/DiagnosisReveal';
import { PageWrapper } from './components/layout';
import type { NeuralMetrics } from './data/quizData';

type AppState = 'landing' | 'quiz' | 'receipt';

const getAmbientGlow = (severity: string): 'cyan' | 'orange' | 'green' => {
  if (severity === '2') return 'orange';
  if (severity === '3') return 'green';
  return 'cyan';
};

function App() {
  const [appState, setAppState] = useState<AppState>('landing');
  const [severity, setSeverity] = useState<string>('1');
  const [neuralProfile, setNeuralProfile] = useState<NeuralMetrics | null>(null);

  return (
    <PageWrapper ambientGlow={getAmbientGlow(severity)}>
      <AnimatePresence mode="wait">
        {appState === 'landing' && (
          <motion.div 
            key="landing" 
            initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }} 
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} 
            exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }} 
            transition={{ duration: 0.4, ease: "easeOut" }} 
            className="h-full w-full flex flex-col items-center justify-center"
          >
            <LandingPage onStartQuiz={(id) => {
              setSeverity(id);
              setAppState('quiz');
            }} />
          </motion.div>
        )}
        
        {appState === 'quiz' && (
          <motion.div 
            key="quiz" 
            initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }} 
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} 
            exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }} 
            transition={{ duration: 0.4, ease: "easeOut" }} 
            className="h-full w-full flex flex-col items-center justify-center"
          >
            <QuizFlow 
              severityId={severity} 
              onComplete={(profile) => {
                setNeuralProfile(profile);
                setAppState('receipt');
              }} 
            />
          </motion.div>
        )}
        
        {appState === 'receipt' && neuralProfile && (
          <motion.div 
            key="receipt" 
            initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }} 
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} 
            exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }} 
            transition={{ duration: 0.5, ease: "easeOut" }} 
            className="h-full w-full flex flex-col items-center justify-center overflow-y-auto"
          >
            <DiagnosisReveal 
              profile={neuralProfile} 
              severityColor={getAmbientGlow(severity)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
}

export default App;
