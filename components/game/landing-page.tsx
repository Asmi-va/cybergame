'use client';

import { useState } from 'react';
import {
  Search, Bell, ChevronDown, Play, ArrowRight, Shield, BookOpen,
  Zap, Trophy, Star, CheckCircle, Lock, Users, Globe, Menu, X,
  ShieldCheck, Gamepad2, GraduationCap, QrCode, ShieldAlert,
  MessageSquareShare, Laptop, Clock, Award, BarChart2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { QUIZ_TOPICS } from '@/lib/game/quiz-data';

// Course levels that map to the adventure games
const COURSE_LEVELS = [
  {
    level: 1,
    gameId: 'phishing',
    title: 'Phishing Detective',
    subtitle: 'The Tech Fest Mystery',
    description: 'Explore Navrang Public School in 3D. Inspect suspicious messages, verify with teachers, and protect your friends from digital traps.',
    icon: '🔍',
    color: '#22d3ee',
    bg: 'from-[#0c2a3f] to-[#0a1a2e]',
    badge: '3D Campus Adventure',
    xp: 800,
    duration: '25–35 min',
    skills: ['Spot phishing emails', 'Verify sources', 'Read URLs'],
    quizTopic: 'phishing',
  },
  {
    level: 2,
    gameId: 'legit-or-scam',
    title: 'Legit or Scam?',
    subtitle: 'The Digital Fact-Checker',
    description: 'Examine UPI requests, WhatsApp forwards, QR codes and suspicious portals in the school marketplace and computer lab.',
    icon: '⚖️',
    color: '#f97316',
    bg: 'from-[#2a1205] to-[#1a0c03]',
    badge: 'Inspection Simulator',
    xp: 700,
    duration: '20–30 min',
    skills: ['Spot fake sites', 'Verify QR codes', 'Evaluate evidence'],
    quizTopic: 'upi-safety',
  },
  {
    level: 3,
    gameId: 'qr-hunt',
    title: 'QR Hunt',
    subtitle: 'Safe Scan Challenge',
    description: 'Walk to the canteen and school locations, scan QR codes, and decide which ones are safe to open and which are dangerous.',
    icon: '📱',
    color: '#a78bfa',
    bg: 'from-[#1a0e3a] to-[#0f0826]',
    badge: 'Walk & Scan Game',
    xp: 600,
    duration: '15–25 min',
    skills: ['Inspect QR destinations', 'Spot tampered codes', 'Evaluate payment QRs'],
    quizTopic: 'passwords',
  },
  {
    level: 4,
    gameId: 'clean-desk',
    title: 'Clean Desk Challenge',
    subtitle: 'Computer Lab Security',
    description: 'Audit the school computer lab. Lock unlocked devices, secure confidential documents, and identify data security risks.',
    icon: '🖥️',
    color: '#34d399',
    bg: 'from-[#051e14] to-[#030e09]',
    badge: 'Lab Defense Simulator',
    xp: 500,
    duration: '15–20 min',
    skills: ['Physical security', 'Data classification', 'Device locking'],
    quizTopic: 'privacy',
  },
  {
    level: 5,
    gameId: 'data-dash',
    title: 'Data Dash',
    subtitle: 'Cyber Highway Race',
    description: 'Race through the cyber highway, dodge malware threats, collect data shields, and defend your information from attacks.',
    icon: '🚀',
    color: '#fb7185',
    bg: 'from-[#1f0514] to-[#0f0209]',
    badge: 'Action Runner',
    xp: 500,
    duration: '10–15 min',
    skills: ['Identify malware', 'Data protection', 'Quick decision making'],
    quizTopic: 'malware',
  },
];

const NAV_ITEMS = ['Games', 'Courses', 'Quizzes', 'For Schools'];

type View = 'home' | 'games' | 'courses' | 'quizzes' | 'for-schools';

type HomePageProps = {
  onStartGame: (gameId: string) => void;
  onOpenQuiz: () => void;
};

function StatBadge({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10">
      <div className="text-blue-400">{icon}</div>
      <span className="text-xl font-black text-white">{value}</span>
      <span className="text-xs text-gray-400">{label}</span>
    </div>
  );
}

function CourseLevelCard({
  level, locked, onPlay, onQuiz
}: {
  level: typeof COURSE_LEVELS[0];
  locked: boolean;
  onPlay: () => void;
  onQuiz: () => void;
}) {
  return (
    <div className={`relative rounded-2xl border overflow-hidden transition-all ${locked ? 'opacity-60' : 'hover:scale-[1.01]'}`}
      style={{ borderColor: level.color + '40' }}>
      <div className={`bg-gradient-to-br ${level.bg} p-5`}>
        {/* Level badge */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: level.color + '20', border: `1px solid ${level.color}40` }}>
              {level.icon}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xs font-bold px-2 py-0.5 rounded-md text-black" style={{ background: level.color }}>
                  LEVEL {level.level}
                </span>
                <span className="text-xs text-gray-400">{level.badge}</span>
              </div>
              <h3 className="text-lg font-bold text-white leading-tight">{level.title}</h3>
              <p className="text-xs" style={{ color: level.color + 'cc' }}>{level.subtitle}</p>
            </div>
          </div>
          {locked ? (
            <Lock className="w-5 h-5 text-gray-500 mt-1" />
          ) : (
            <div className="flex items-center gap-1 text-xs text-yellow-400 font-bold">
              <Star className="w-3.5 h-3.5 fill-yellow-400" /> +{level.xp} XP
            </div>
          )}
        </div>

        <p className="text-sm text-gray-300 mb-4 leading-relaxed">{level.description}</p>

        {/* Skills */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {level.skills.map(skill => (
            <span key={skill} className="text-xs px-2 py-0.5 rounded-full border text-gray-300" style={{ borderColor: level.color + '40', background: level.color + '10' }}>
              {skill}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Clock className="w-3.5 h-3.5" /> {level.duration}
          </div>
          <div className="flex gap-2">
            <button
              onClick={onQuiz}
              disabled={locked}
              className="text-xs px-3 py-1.5 rounded-lg border font-medium transition-all hover:brightness-110 disabled:cursor-not-allowed"
              style={{ borderColor: level.color + '50', color: level.color, background: level.color + '15' }}
            >
              Take Quiz
            </button>
            <button
              onClick={onPlay}
              disabled={locked}
              className="text-xs px-4 py-1.5 rounded-lg font-bold text-black transition-all hover:brightness-110 disabled:cursor-not-allowed flex items-center gap-1"
              style={{ background: locked ? '#666' : level.color }}
            >
              <Play className="w-3 h-3" /> Play Level
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage({
  onStartGame,
  onOpenQuiz,
  currentView,
  onViewChange,
}: {
  onStartGame: (gameId: string) => void;
  onOpenQuiz: () => void;
  currentView: View;
  onViewChange: (v: View) => void;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const navClick = (item: string) => {
    const map: Record<string, View> = {
      'Games': 'games',
      'Courses': 'courses',
      'Quizzes': 'quizzes',
      'For Schools': 'for-schools',
    };
    onViewChange(map[item] || 'home');
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-white flex flex-col">
      {/* ── NAVBAR (CyberPlay style) ── */}
      <nav className="sticky top-0 z-50 bg-[#0d1117]/95 backdrop-blur-md border-b border-[#1e2a3a]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 flex items-center gap-4">
          {/* Logo */}
          <button onClick={() => onViewChange('home')} className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Shield className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="text-lg font-black tracking-tight">
              safe<span className="text-blue-400">ron</span>
            </span>
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1 ml-4">
            {NAV_ITEMS.map(item => (
              <button
                key={item}
                onClick={() => navClick(item)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  currentView === item.toLowerCase().replace(' ', '-')
                    ? 'bg-white/10 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {/* Right side */}
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(s => !s)}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
            >
              <Search className="w-4 h-4" />
            </button>
            <button className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-all">
              <Globe className="w-4 h-4" /> English
            </button>
            <button className="hidden md:flex text-sm text-gray-300 hover:text-white px-3 py-1.5 transition-all">
              Sign in
            </button>
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4"
              onClick={() => onStartGame('phishing')}
            >
              Get started
            </Button>
            <button className="md:hidden p-2 text-gray-400" onClick={() => setMobileMenuOpen(m => !m)}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#1e2a3a] bg-[#0d1117] p-4 flex flex-col gap-2">
            {NAV_ITEMS.map(item => (
              <button key={item} onClick={() => navClick(item)}
                className="text-left px-4 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-white/5 hover:text-white">
                {item}
              </button>
            ))}
            <div className="border-t border-[#1e2a3a] mt-2 pt-2 flex gap-2">
              <button className="flex-1 py-2 text-sm text-gray-300">Sign in</button>
              <Button size="sm" className="flex-1 bg-blue-600 text-white" onClick={() => onStartGame('phishing')}>
                Get started
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* ── VIEWS ── */}
      {currentView === 'home' && <HomeView onStartGame={onStartGame} onOpenQuiz={onOpenQuiz} onViewChange={onViewChange} />}
      {currentView === 'games' && <GamesView onStartGame={onStartGame} />}
      {currentView === 'courses' && <CoursesView onStartGame={onStartGame} onOpenQuiz={onOpenQuiz} />}
      {currentView === 'quizzes' && <QuizzesView onOpenQuiz={onOpenQuiz} />}
      {currentView === 'for-schools' && <ForSchoolsView onStartGame={onStartGame} />}
    </div>
  );
}

/* ────────── HOME VIEW ────────── */
function HomeView({ onStartGame, onOpenQuiz, onViewChange }: {
  onStartGame: (id: string) => void;
  onOpenQuiz: () => void;
  onViewChange: (v: View) => void;
}) {
  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            VIDEO COURSES · REAL-WORLD GAMES · CYBER QUIZZES
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-3">
            Learn cybersecurity.
          </h1>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight text-blue-400 mb-6">
            Put it into play.
          </h2>
          <p className="text-gray-400 text-base leading-relaxed mb-8 max-w-md">
            Spot a suspicious email. Check a strange login. Know your next move.
            Learn through interactive 3D games and test your skills with timed quizzes.
          </p>
          <div className="flex flex-wrap gap-3 mb-6">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 gap-2"
              onClick={() => onStartGame('phishing')}
            >
              <Zap className="w-4 h-4" /> Start Free Adventure
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-[#1e3a52] text-gray-300 hover:bg-white/5 gap-2"
              onClick={onOpenQuiz}
            >
              <Play className="w-4 h-4" /> Take a Quiz
            </Button>
          </div>
          <div className="flex flex-wrap gap-4 text-xs text-gray-500">
            {['✓ All games free', '✓ 6 quiz topics · 60+ questions', '✓ No account needed'].map(t => (
              <span key={t}>{t}</span>
            ))}
          </div>
          <p className="text-xs text-gray-600 mt-2">For children aged 6–14. For everyday safety at school and online.</p>
        </div>

        {/* Hero card */}
        <div className="relative">
          <div className="rounded-2xl bg-gradient-to-br from-[#0f1f35] to-[#080f1a] border border-[#1e3a52] p-8 text-center">
            <div className="flex justify-center gap-3 mb-6 text-4xl">
              {['🔍','⚖️','📱','🖥️','🚀'].map((e, i) => (
                <span key={i} className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  {e}
                </span>
              ))}
            </div>
            <h3 className="text-xl font-black text-white mb-2">Play. Decide. Learn.</h3>
            <p className="text-gray-400 text-sm mb-6">5 interactive 3D games + 6 timed quizzes</p>
            <div className="grid grid-cols-3 gap-3">
              <StatBadge icon={<Gamepad2 className="w-4 h-4" />} label="Games" value="5" />
              <StatBadge icon={<Zap className="w-4 h-4" />} label="Quizzes" value="60+" />
              <StatBadge icon={<GraduationCap className="w-4 h-4" />} label="Topics" value="6" />
            </div>
          </div>
        </div>
      </section>

      {/* Feature pills */}
      <section className="border-y border-[#1e2a3a] bg-[#080f1a] py-8">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-wrap justify-center gap-8">
          {[
            { icon: <Shield className="w-5 h-5 text-blue-400" />, label: 'Phishing Detection' },
            { icon: <QrCode className="w-5 h-5 text-purple-400" />, label: 'QR Code Safety' },
            { icon: <Lock className="w-5 h-5 text-green-400" />, label: 'Password Security' },
            { icon: <ShieldAlert className="w-5 h-5 text-orange-400" />, label: 'Scam Prevention' },
            { icon: <Users className="w-5 h-5 text-pink-400" />, label: 'Social Media Safety' },
            { icon: <BookOpen className="w-5 h-5 text-yellow-400" />, label: 'Privacy Awareness' },
          ].map(f => (
            <div key={f.label} className="flex items-center gap-2 text-sm text-gray-400">
              {f.icon} {f.label}
            </div>
          ))}
        </div>
      </section>

      {/* Course preview */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-2">LEARNING PATH</p>
            <h2 className="text-3xl font-black">Course Levels</h2>
            <p className="text-gray-400 text-sm mt-1">Complete adventures in order to unlock new skills.</p>
          </div>
          <button onClick={() => onViewChange('courses')} className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {COURSE_LEVELS.slice(0, 4).map((level, i) => (
            <CourseLevelCard
              key={level.gameId}
              level={level}
              locked={i > 1}
              onPlay={() => onStartGame(level.gameId)}
              onQuiz={onOpenQuiz}
            />
          ))}
        </div>
      </section>

      {/* Quiz CTA */}
      <section className="bg-gradient-to-br from-blue-900/30 to-purple-900/20 border-y border-blue-500/20 py-16">
        <div className="max-w-3xl mx-auto px-4 md:px-6 text-center">
          <div className="text-4xl mb-4">⚡</div>
          <h2 className="text-3xl font-black mb-3">Test Your Knowledge</h2>
          <p className="text-gray-400 mb-6">6 quiz topics · 10 questions each · 20-second timer · Instant feedback</p>
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {QUIZ_TOPICS.map(t => (
              <span key={t.id} className="px-3 py-1.5 rounded-full text-sm font-medium border" style={{ borderColor: t.color + '50', color: t.color, background: t.color + '15' }}>
                {t.icon} {t.title}
              </span>
            ))}
          </div>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-500 text-white font-bold gap-2" onClick={onOpenQuiz}>
            <Zap className="w-4 h-4" /> Start a Quiz Now
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </section>
    </main>
  );
}

/* ────────── GAMES VIEW ────────── */
function GamesView({ onStartGame }: { onStartGame: (id: string) => void }) {
  const games = [
    { id: 'phishing', icon: '🔍', title: 'Phishing Detective', desc: 'Explore a 3D school campus and catch phishing traps before the Tech Fest.', color: '#22d3ee', tag: '3D Adventure' },
    { id: 'legit-or-scam', icon: '⚖️', title: 'Legit or Scam?', desc: 'Analyse UPI requests, QR codes and suspicious portals.', color: '#f97316', tag: 'Inspection Sim' },
    { id: 'qr-hunt', icon: '📱', title: 'QR Hunt', desc: 'Walk to canteen and scan QR codes — safe or dangerous?', color: '#a78bfa', tag: 'Walk & Scan' },
    { id: 'clean-desk', icon: '🖥️', title: 'Clean Desk', desc: 'Audit the computer lab. Secure devices and confidential data.', color: '#34d399', tag: 'Lab Defender' },
    { id: 'data-dash', icon: '🚀', title: 'Data Dash', desc: 'Race on the cyber highway. Dodge malware. Protect your data.', color: '#fb7185', tag: 'Action Runner' },
  ];

  return (
    <main className="max-w-5xl mx-auto px-4 md:px-6 py-12">
      <div className="mb-8">
        <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-2">INTERACTIVE 3D GAMES</p>
        <h1 className="text-3xl font-black">All Adventures</h1>
        <p className="text-gray-400 text-sm mt-1">Real-world cybersecurity scenarios in immersive 3D environments.</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {games.map((g, i) => (
          <div key={g.id} className="rounded-2xl border overflow-hidden" style={{ borderColor: g.color + '30', background: g.color + '08' }}>
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">{g.icon}</span>
                <span className="text-xs px-2 py-1 rounded-md font-bold text-black" style={{ background: g.color }}>
                  {g.tag}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">{g.title}</h3>
              <p className="text-sm text-gray-400 mb-4 leading-relaxed">{g.desc}</p>
              <button
                onClick={() => onStartGame(g.id)}
                className="w-full py-2 rounded-xl font-bold text-sm text-black transition-all hover:brightness-110 flex items-center justify-center gap-2"
                style={{ background: g.color }}
              >
                <Play className="w-4 h-4" /> Play Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

/* ────────── COURSES VIEW ────────── */
function CoursesView({ onStartGame, onOpenQuiz }: { onStartGame: (id: string) => void; onOpenQuiz: () => void }) {
  return (
    <main className="max-w-4xl mx-auto px-4 md:px-6 py-12">
      <div className="mb-8">
        <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-2">STRUCTURED LEARNING PATH</p>
        <h1 className="text-3xl font-black">Cybersecurity Course</h1>
        <p className="text-gray-400 text-sm mt-1 max-w-xl">
          Each level is a complete 3D game adventure. Complete levels in order — each one teaches a new cybersecurity skill, followed by a quiz to test your understanding.
        </p>
      </div>

      {/* Path connector */}
      <div className="relative flex flex-col gap-0">
        {COURSE_LEVELS.map((level, i) => (
          <div key={level.level} className="relative">
            {i < COURSE_LEVELS.length - 1 && (
              <div className="absolute left-6 top-full w-0.5 h-5 z-10" style={{ background: level.color + '60' }} />
            )}
            <div className="mb-5">
              <CourseLevelCard
                level={level}
                locked={i > 1}
                onPlay={() => onStartGame(level.gameId)}
                onQuiz={onOpenQuiz}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Completion card */}
      <div className="mt-6 p-6 rounded-2xl border border-yellow-500/30 bg-yellow-500/5 text-center">
        <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-white mb-1">Complete the full course</h3>
        <p className="text-sm text-gray-400">Finish all 5 levels and 5 quizzes to earn the <strong className="text-yellow-400">Cyber Guardian</strong> certificate.</p>
      </div>
    </main>
  );
}

/* ────────── QUIZZES VIEW ────────── */
function QuizzesView({ onOpenQuiz }: { onOpenQuiz: () => void }) {
  return (
    <main className="max-w-3xl mx-auto px-4 md:px-6 py-12">
      <div className="mb-8">
        <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-2">KNOWLEDGE TESTS</p>
        <h1 className="text-3xl font-black">Cyber Awareness Quizzes</h1>
        <p className="text-gray-400 text-sm mt-1">10 timed questions per topic · instant explanations · XP rewards</p>
      </div>
      <div className="grid gap-4">
        {QUIZ_TOPICS.map(topic => (
          <button
            key={topic.id}
            onClick={onOpenQuiz}
            className="w-full text-left p-5 rounded-2xl border transition-all hover:scale-[1.01]"
            style={{ background: topic.bg, borderColor: topic.color + '40' }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-3xl">{topic.icon}</span>
                <div>
                  <h3 className="text-lg font-bold text-white">{topic.title}</h3>
                  <p className="text-sm" style={{ color: topic.color + 'cc' }}>{topic.subtitle}</p>
                  <p className="text-xs text-gray-500 mt-1">10 questions · 20s each · 1000 XP max</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="text-xs font-bold px-3 py-1.5 rounded-lg text-black" style={{ background: topic.color }}>
                  Start Quiz →
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </main>
  );
}

/* ────────── FOR SCHOOLS VIEW ────────── */
function ForSchoolsView({ onStartGame }: { onStartGame: (id: string) => void }) {
  return (
    <main className="max-w-4xl mx-auto px-4 md:px-6 py-12">
      <div className="mb-10 text-center">
        <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-3">FOR TEACHERS & SCHOOLS</p>
        <h1 className="text-4xl font-black mb-4">Bring SafeRon to Your School</h1>
        <p className="text-gray-400 max-w-xl mx-auto">
          A complete cybersecurity awareness curriculum for classes 4–10. Free to use in classrooms, computer labs, and assemblies.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-5 mb-10">
        {[
          { icon: <Gamepad2 className="w-6 h-6 text-blue-400" />, title: '5 Immersive Games', desc: 'Each game covers a real cybersecurity threat in an Indian school context.' },
          { icon: <Zap className="w-6 h-6 text-yellow-400" />, title: '60+ Quiz Questions', desc: '6 topics, 10 questions each, with timed challenges and instant explanations.' },
          { icon: <BarChart2 className="w-6 h-6 text-green-400" />, title: 'Progress Tracking', desc: 'Students earn XP and badges as they complete levels and quizzes.' },
          { icon: <Users className="w-6 h-6 text-purple-400" />, title: 'Age 6–14', desc: 'Designed for primary and middle school children with age-appropriate content.' },
          { icon: <Globe className="w-6 h-6 text-cyan-400" />, title: 'Indian Scenarios', desc: 'UPI scams, WhatsApp forwards, Aadhaar phishing — scenarios children actually face.' },
          { icon: <Award className="w-6 h-6 text-orange-400" />, title: 'No Account Needed', desc: 'Students can play immediately on any device with a browser.' },
        ].map(f => (
          <div key={f.title} className="p-5 rounded-xl bg-white/5 border border-white/10">
            <div className="mb-3">{f.icon}</div>
            <h3 className="font-bold text-white mb-1">{f.title}</h3>
            <p className="text-sm text-gray-400">{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="text-center">
        <Button size="lg" className="bg-blue-600 hover:bg-blue-500 text-white font-bold gap-2" onClick={() => onStartGame('phishing')}>
          <Play className="w-4 h-4" /> Try the First Adventure
          <ArrowRight className="w-4 h-4" />
        </Button>
        <p className="text-xs text-gray-600 mt-3">Works in any browser · Mobile & desktop · No downloads required</p>
      </div>
    </main>
  );
}

