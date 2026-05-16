import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LandingPage, QuizFlow } from './pages';

type AppState = 'landing' | 'quiz' | 'cleanup' | 'receipt';

function App() {
  const [appState, setAppState] = useState<AppState>('landing');
  const [severity, setSeverity] = useState<string>('1');

  return (
    <AnimatePresence mode="wait">
      {appState === 'landing' && (
        <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full w-full">
          <LandingPage onStartQuiz={(id) => {
            setSeverity(id);
            setAppState('quiz');
          }} />
        </motion.div>
      )}
      
      {appState === 'quiz' && (
        <motion.div key="quiz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full w-full">
          <QuizFlow severityId={severity} onComplete={() => setAppState('cleanup')} />
        </motion.div>
      )}
      
      {appState === 'cleanup' && (
        <motion.div key="cleanup" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full w-full bg-obsidianDark flex items-center justify-center text-white">
          {/* Phase 2: 3D Cleanup will go here */}
          <h1 className="text-3xl font-mono text-neon-cyan animate-pulse">INITIATING NEURAL CLEANUP...</h1>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default App;
