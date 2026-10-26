'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import LandingPage from '@/components/game/landing-page';
import QuizGame from '@/components/game/quiz-game';

const GameShell = dynamic(() => import('@/components/game/game-shell'), { ssr: false });

type Screen = 'landing' | 'quiz' | 'game';
type View = 'home' | 'games' | 'courses' | 'quizzes' | 'for-schools';

export default function Page() {
  const [screen, setScreen] = useState<Screen>('landing');
  const [activeGameId, setActiveGameId] = useState<string>('phishing');
  const [landingView, setLandingView] = useState<View>('home');

  if (screen === 'quiz') {
    return <QuizGame onBack={() => setScreen('landing')} />;
  }

  if (screen === 'game') {
    return (
      <GameShell
        initialGame={activeGameId}
        onBackToHome={() => setScreen('landing')}
      />
    );
  }

  return (
    <LandingPage
      currentView={landingView}
      onViewChange={setLandingView}
      onStartGame={(gameId) => {
        setActiveGameId(gameId);
        setScreen('game');
      }}
      onOpenQuiz={() => setScreen('quiz')}
    />
  );
}
