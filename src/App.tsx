import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LandingPage, QuizFlow } from './pages';
import { PageWrapper } from './components/layout';

type AppState = 'landing' | 'quiz' | 'cleanup' | 'receipt';

const getAmbientGlow = (severity: string) => {
  if (severity === '2') return 'orange';
  if (severity === '3') return 'green';
  return 'cyan';
};

function App() {
  const [appState, setAppState] = useState<AppState>('landing');
  const [severity, setSeverity] = useState<string>('1');

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
            <QuizFlow severityId={severity} onComplete={() => setAppState('cleanup')} />
          </motion.div>
        )}
        
        {appState === 'cleanup' && (
          <motion.div 
            key="cleanup" 
            initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }} 
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} 
            exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }} 
            transition={{ duration: 0.4, ease: "easeOut" }} 
            className="h-full w-full flex items-center justify-center text-white"
          >
            {/* Phase 2: 3D Cleanup will go here */}
            <h1 className="text-3xl font-mono text-neon-cyan animate-pulse tracking-[0.2em]">INITIATING NEURAL CLEANUP...</h1>
          </motion.div>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
}

export default App;
