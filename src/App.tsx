import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LandingPage, QuizFlow, RecoveryRoom } from './pages';
import { DiagnosisReveal } from './pages/DiagnosisReveal';
import { PageWrapper } from './components/layout';
import type { NeuralMetrics } from './data/quizData';

type AppState = 'landing' | 'quiz' | 'receipt' | 'recovery';

const getAmbientGlow = (
  state: AppState,
  severity: string,
): 'cyan' | 'orange' | 'green' | 'none' => {
  // Recovery room has its own canvas/backgrounds — suppress PageWrapper orbs
  if (state === 'recovery') return 'none';
  // Diagnosis wing: follows selected severity
  if (severity === '2') return 'orange';
  if (severity === '3') return 'green';
  return 'cyan';
};

// Shared cinematic page transition
const pageVariants = {
  initial: { opacity: 0, y: 14, filter: 'blur(8px)' },
  animate: { opacity: 1, y: 0,  filter: 'blur(0px)' },
  exit:    { opacity: 0, y: -10, filter: 'blur(8px)' },
};
const pageTransition = { duration: 0.55, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] };

function App() {
  const [appState, setAppState]       = useState<AppState>('landing');
  const [severity, setSeverity]       = useState<string>('1');
  const [neuralProfile, setNeuralProfile] = useState<NeuralMetrics | null>(null);

  return (
    <PageWrapper ambientGlow={getAmbientGlow(appState, severity)}>
      <AnimatePresence mode="wait">

        {/* ── Landing ─────────────────────────────────────────────── */}
        {appState === 'landing' && (
          <motion.div key="landing" variants={pageVariants} initial="initial" animate="animate" exit="exit"
            transition={pageTransition} className="h-full w-full flex flex-col items-center justify-center">
            <LandingPage
              onStartQuiz={(id) => { setSeverity(id); setAppState('quiz'); }}
            />
          </motion.div>
        )}

        {/* ── Quiz ────────────────────────────────────────────────── */}
        {appState === 'quiz' && (
          <motion.div key="quiz" variants={pageVariants} initial="initial" animate="animate" exit="exit"
            transition={pageTransition} className="h-full w-full flex flex-col items-center justify-center">
            <QuizFlow severityId={severity} onComplete={(profile) => { setNeuralProfile(profile); setAppState('receipt'); }} />
          </motion.div>
        )}

        {/* ── Receipt ─────────────────────────────────────────────── */}
        {appState === 'receipt' && neuralProfile && (
          <motion.div key="receipt" variants={pageVariants} initial="initial" animate="animate" exit="exit"
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="h-full w-full flex flex-col items-center justify-center overflow-y-auto">
            <DiagnosisReveal
              profile={neuralProfile}
              severityColor={getAmbientGlow('receipt', severity) as 'cyan' | 'orange' | 'green'}
              onEnterRecovery={() => setAppState('recovery')}
            />
          </motion.div>
        )}

        {/* ── Recovery Room ────────────────────────────────────────── */}
        {appState === 'recovery' && (
          <motion.div key="recovery" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 2.5, ease: 'easeInOut' }}
            className="h-full w-full relative z-20">
            <RecoveryRoom onExit={() => setAppState('landing')} />
          </motion.div>
        )}

      </AnimatePresence>
    </PageWrapper>
  );
}

export default App;
