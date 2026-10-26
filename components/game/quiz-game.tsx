'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, XCircle, Clock, Trophy, RotateCcw, Shield, Star, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { QUIZ_TOPICS, QuizTopic } from '@/lib/game/quiz-data';
import { playCue } from '@/lib/game/audio';

const QUESTION_TIME = 20; // seconds per question

function QuizTopicCard({ topic, onSelect, completed, bestScore }: {
  topic: QuizTopic;
  onSelect: () => void;
  completed: boolean;
  bestScore: number;
}) {
  return (
    <button
      onClick={onSelect}
      className="w-full text-left p-5 rounded-2xl border transition-all hover:scale-[1.02] active:scale-[.98]"
      style={{ background: topic.bg, borderColor: topic.color + '50' }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{topic.icon}</span>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <strong className="text-white text-base font-bold">{topic.title}</strong>
              {completed && (
                <span className="text-xs font-bold px-1.5 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                  ✓ Done
                </span>
              )}
            </div>
            <p className="text-sm" style={{ color: topic.color + 'cc' }}>{topic.subtitle}</p>
            <p className="text-xs text-gray-400 mt-1">10 questions · 20s each · timed</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          {bestScore > 0 && (
            <span className="text-xs font-bold px-2 py-1 rounded-lg bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
              Best: {bestScore}
            </span>
          )}
          <span className="text-xs font-medium px-3 py-1.5 rounded-xl border text-white" style={{ borderColor: topic.color + '40', background: topic.color + '15' }}>
            Start Quiz →
          </span>
        </div>
      </div>
    </button>
  );
}

type QuizState = 'topic-select' | 'countdown' | 'playing' | 'result';

export default function QuizGame({ onBack }: { onBack: () => void }) {
  const [state, setState] = useState<QuizState>('topic-select');
  const [activeTopic, setActiveTopic] = useState<QuizTopic | null>(null);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [countdown, setCountdown] = useState(3);
  const [scores, setScores] = useState<Record<string, number>>(() => {
    try { return JSON.parse(localStorage.getItem('saferon-quiz-scores') || '{}'); } catch { return {}; }
  });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = () => { if (timerRef.current) clearTimeout(timerRef.current); };

  // Save scores
  useEffect(() => {
    try { localStorage.setItem('saferon-quiz-scores', JSON.stringify(scores)); } catch {}
  }, [scores]);

  // Countdown before quiz
  useEffect(() => {
    if (state !== 'countdown') return;
    if (countdown === 0) { setState('playing'); setTimeLeft(QUESTION_TIME); return; }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [state, countdown]);

  // Question timer
  useEffect(() => {
    if (state !== 'playing' || selected !== null) return;
    if (timeLeft <= 0) {
      // auto-advance with no answer
      handleAnswer(null);
      return;
    }
    timerRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return clearTimer;
  }, [state, timeLeft, selected]);

  const startQuiz = (topic: QuizTopic) => {
    setActiveTopic(topic);
    setQuestionIdx(0);
    setSelected(null);
    setAnswers([]);
    setCountdown(3);
    setState('countdown');
    playCue('tap', true);
  };

  const handleAnswer = useCallback((choice: number | null) => {
    clearTimer();
    setSelected(choice ?? -1);
    const isCorrect = choice !== null && activeTopic && choice === activeTopic.questions[questionIdx].correct;
    if (isCorrect) playCue('success', true); else playCue('tap', true);
    setAnswers(prev => [...prev, choice]);
  }, [activeTopic, questionIdx]);

  const handleNext = () => {
    if (!activeTopic) return;
    if (questionIdx < activeTopic.questions.length - 1) {
      setQuestionIdx(q => q + 1);
      setSelected(null);
      setTimeLeft(QUESTION_TIME);
    } else {
      // finished
      const correct = answers.filter((a, i) => a === activeTopic.questions[i].correct).length;
      const finalScore = correct * 100;
      if (finalScore > (scores[activeTopic.id] || 0)) {
        setScores(s => ({ ...s, [activeTopic.id]: finalScore }));
      }
      setState('result');
      playCue('success', true);
    }
  };

  const totalCorrect = activeTopic
    ? answers.filter((a, i) => a === activeTopic.questions[i]?.correct).length
    : 0;

  const getGrade = (correct: number, total: number) => {
    const ratio = correct / total;
    if (ratio === 1) return { label: 'Perfect!', color: '#fbbf24', emoji: '🏆' };
    if (ratio >= 0.8) return { label: 'Excellent', color: '#34d399', emoji: '🌟' };
    if (ratio >= 0.6) return { label: 'Good Job', color: '#38bdf8', emoji: '👍' };
    if (ratio >= 0.4) return { label: 'Keep Practising', color: '#fb923c', emoji: '💪' };
    return { label: 'Try Again', color: '#f87171', emoji: '📚' };
  };

  if (state === 'topic-select') {
    return (
      <div className="min-h-screen bg-[#080f1a] text-white flex flex-col">
        {/* Header */}
        <header className="flex items-center gap-4 px-6 py-4 border-b border-[#1a2a3a] bg-[#0a1525]/90 backdrop-blur-md sticky top-0 z-40">
          <Button variant="outline" size="sm" onClick={onBack} className="border-[#1e3a52] text-[#7dd3fc] hover:bg-[#0f2a3d] gap-1.5">
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
          <div>
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" /> Cyber Awareness Quizzes
            </h1>
            <p className="text-xs text-[#5a8a9f]">10 timed questions per topic · Test your cyber knowledge</p>
          </div>
          <div className="ml-auto flex items-center gap-2 text-sm">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="font-bold text-yellow-400">{Object.values(scores).reduce((a, b) => a + b, 0)}</span>
            <span className="text-gray-400">Total XP</span>
          </div>
        </header>

        {/* Topic Grid */}
        <main className="flex-1 max-w-3xl w-full mx-auto p-6 flex flex-col gap-4">
          <div className="text-center mb-2">
            <h2 className="text-2xl font-bold text-white mb-1">Choose a Quiz Topic</h2>
            <p className="text-gray-400 text-sm">Master each topic to earn XP and become a Cyber Guardian.</p>
          </div>

          {/* Progress summary */}
          <div className="flex items-center gap-3 p-4 rounded-xl bg-[#0f1f2e] border border-[#1a3045] mb-2">
            <Shield className="w-8 h-8 text-blue-400" />
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-semibold text-white">Overall Progress</span>
                <span className="text-sm text-blue-400 font-bold">{Object.keys(scores).length}/{QUIZ_TOPICS.length} topics</span>
              </div>
              <div className="h-2 bg-[#1a3045] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-700"
                  style={{ width: `${(Object.keys(scores).length / QUIZ_TOPICS.length) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {QUIZ_TOPICS.map(topic => (
              <QuizTopicCard
                key={topic.id}
                topic={topic}
                onSelect={() => startQuiz(topic)}
                completed={topic.id in scores}
                bestScore={scores[topic.id] || 0}
              />
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (state === 'countdown') {
    return (
      <div className="min-h-screen bg-[#080f1a] flex flex-col items-center justify-center text-white gap-6">
        <span className="text-6xl">{activeTopic?.icon}</span>
        <h2 className="text-2xl font-bold">{activeTopic?.title}</h2>
        <div className="text-8xl font-black text-blue-400" style={{ textShadow: '0 0 40px #38bdf880' }}>
          {countdown === 0 ? 'GO!' : countdown}
        </div>
        <p className="text-gray-400">Get ready — 20 seconds per question!</p>
      </div>
    );
  }

  if (state === 'playing' && activeTopic) {
    const q = activeTopic.questions[questionIdx];
    const answered = selected !== null;
    const timerPct = (timeLeft / QUESTION_TIME) * 100;
    const timerColor = timeLeft > 10 ? '#34d399' : timeLeft > 5 ? '#fbbf24' : '#f87171';

    return (
      <div className="min-h-screen flex flex-col" style={{ background: activeTopic.bg }}>
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: activeTopic.color + '30' }}>
          <button onClick={() => setState('topic-select')} className="text-sm text-gray-400 hover:text-white flex items-center gap-1.5">
            <ArrowLeft className="w-4 h-4" /> Exit Quiz
          </button>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-300">
              Q <strong className="text-white">{questionIdx + 1}</strong> / {activeTopic.questions.length}
            </span>
            <span className="flex items-center gap-1.5 text-sm font-bold" style={{ color: timerColor }}>
              <Clock className="w-4 h-4" /> {timeLeft}s
            </span>
          </div>
        </div>

        {/* Timer bar */}
        <div className="h-1.5 bg-[#ffffff15] w-full">
          <div
            className="h-full transition-all duration-1000"
            style={{ width: `${timerPct}%`, background: timerColor }}
          />
        </div>

        {/* Progress dots */}
        <div className="flex gap-1.5 px-5 py-3 justify-center">
          {activeTopic.questions.map((_, i) => (
            <div key={i} className="w-5 h-1.5 rounded-full transition-all" style={{
              background: i < answers.length
                ? (answers[i] === activeTopic.questions[i].correct ? '#34d399' : '#f87171')
                : i === questionIdx ? activeTopic.color : '#ffffff20'
            }} />
          ))}
        </div>

        {/* Question */}
        <main className="flex-1 max-w-2xl w-full mx-auto px-5 py-4 flex flex-col gap-5">
          <div className="p-5 rounded-2xl border" style={{ background: '#ffffff08', borderColor: activeTopic.color + '30' }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: activeTopic.color }}>
              {activeTopic.title} · Question {questionIdx + 1}
            </p>
            <p className="text-lg font-bold text-white leading-relaxed">{q.question}</p>
          </div>

          {/* Options */}
          <div className="flex flex-col gap-3">
            {q.options.map((opt, i) => {
              let borderColor = '#ffffff20';
              let bg = '#ffffff08';
              let textColor = 'text-gray-200';

              if (answered) {
                if (i === q.correct) { borderColor = '#34d399'; bg = '#34d39920'; textColor = 'text-green-300'; }
                else if (i === selected && i !== q.correct) { borderColor = '#f87171'; bg = '#f8717120'; textColor = 'text-red-300'; }
                else { borderColor = '#ffffff10'; bg = '#ffffff05'; textColor = 'text-gray-500'; }
              }

              return (
                <button
                  key={i}
                  disabled={answered}
                  onClick={() => handleAnswer(i)}
                  className={`w-full text-left p-4 rounded-xl border font-medium text-sm transition-all flex items-center gap-3 ${textColor}`}
                  style={{ background: bg, borderColor }}
                >
                  <span className="w-7 h-7 rounded-full border flex items-center justify-center text-xs font-bold shrink-0" style={{ borderColor }}>
                    {answered && i === q.correct ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : answered && i === selected ? <XCircle className="w-4 h-4 text-red-400" /> : String.fromCharCode(65 + i)}
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {answered && (
            <div className="p-4 rounded-xl border border-blue-500/30 bg-blue-500/10">
              <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">
                {selected === q.correct ? '✓ Correct!' : selected === -1 ? '⏰ Time\'s up!' : '✗ Incorrect'}
              </p>
              <p className="text-sm text-blue-100">{q.explanation}</p>
              <Button
                className="w-full mt-4"
                style={{ background: activeTopic.color, color: '#000' }}
                onClick={handleNext}
              >
                {questionIdx < activeTopic.questions.length - 1 ? 'Next Question' : 'See Results'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </main>
      </div>
    );
  }

  if (state === 'result' && activeTopic) {
    const total = activeTopic.questions.length;
    const grade = getGrade(totalCorrect, total);
    const xp = totalCorrect * 100;

    return (
      <div className="min-h-screen bg-[#080f1a] flex flex-col items-center justify-center text-white p-6 gap-6">
        <div className="text-6xl">{grade.emoji}</div>
        <div className="text-center">
          <p className="text-sm uppercase tracking-widest mb-2" style={{ color: grade.color }}>{activeTopic.title} — Results</p>
          <h2 className="text-4xl font-black mb-1" style={{ color: grade.color }}>{grade.label}</h2>
          <p className="text-gray-400 text-sm">You answered {totalCorrect} of {total} questions correctly</p>
        </div>

        {/* Score circle */}
        <div className="relative w-32 h-32">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1a2a3a" strokeWidth="3" />
            <circle cx="18" cy="18" r="15.9" fill="none" stroke={grade.color} strokeWidth="3"
              strokeDasharray={`${(totalCorrect / total) * 100} 100`} strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-black" style={{ color: grade.color }}>{totalCorrect}</span>
            <span className="text-xs text-gray-400">/{total}</span>
          </div>
        </div>

        {/* XP earned */}
        <div className="flex items-center gap-3 px-6 py-3 rounded-full border border-yellow-500/30 bg-yellow-500/10">
          <Trophy className="w-5 h-5 text-yellow-400" />
          <span className="font-bold text-yellow-400">+{xp} XP earned</span>
        </div>

        {/* Per-question review */}
        <div className="w-full max-w-md flex flex-col gap-2">
          {activeTopic.questions.map((q, i) => {
            const correct = answers[i] === q.correct;
            return (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: correct ? '#34d39910' : '#f8717110' }}>
                {correct ? <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" /> : <XCircle className="w-4 h-4 text-red-400 shrink-0" />}
                <span className="text-sm text-gray-300 line-clamp-1">{q.question}</span>
              </div>
            );
          })}
        </div>

        <div className="flex gap-3 w-full max-w-md">
          <Button variant="outline" className="flex-1 border-[#1a3045] text-gray-300 hover:bg-[#0f1f2e]" onClick={() => startQuiz(activeTopic)}>
            <RotateCcw className="w-4 h-4 mr-2" /> Retry
          </Button>
          <Button className="flex-1 bg-blue-600 hover:bg-blue-500" onClick={() => setState('topic-select')}>
            All Topics <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  return null;
}

