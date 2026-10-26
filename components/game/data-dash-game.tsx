'use client';

import { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Zap,
  Shield,
  Heart,
  Star,
  RotateCcw,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { playCue } from '@/lib/game/audio';

type Lane = 0 | 1 | 2; // Left, Middle, Right

type Obstacle = {
  id: number;
  lane: Lane;
  y: number; // 0 (top) to 100 (bottom)
  type: 'data' | 'malware' | 'gate_safe' | 'gate_phish';
  label: string;
};

export default function DataDashGame({ onBack }: { onBack: () => void }) {
  const [lane, setLane] = useState<Lane>(1);
  const [score, setScore] = useState(0);
  const [dataDelivered, setDataDelivered] = useState(0);
  const [lives, setLives] = useState(3);
  const [isGameOver, setIsGameOver] = useState(false);
  const [paused, setPaused] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);

  const [items, setItems] = useState<Obstacle[]>([
    { id: 1, lane: 0, y: 15, type: 'data', label: '+10 Data Capsule' },
    { id: 2, lane: 1, y: 40, type: 'malware', label: '⚠️ Unverified .EXE' },
    { id: 3, lane: 2, y: 70, type: 'gate_safe', label: '🛡️ Safe HTTPS Gate' },
  ]);

  const nextId = useRef(4);

  // Game loop ticker
  useEffect(() => {
    if (isGameOver || paused) return;

    const interval = setInterval(() => {
      setItems((prevItems) => {
        const nextItems: Obstacle[] = [];
        let hitSomething = false;

        for (const it of prevItems) {
          const newY = it.y + 4 * speedMultiplier;

          // Check player collision (player is at y ≈ 85)
          if (newY >= 80 && newY <= 90 && it.lane === lane) {
            hitSomething = true;
            if (it.type === 'data') {
              setScore((s) => s + 50);
              setDataDelivered((d) => d + 1);
              playCue('clue', true);
            } else if (it.type === 'gate_safe') {
              setScore((s) => s + 100);
              playCue('success', true);
            } else {
              // malware or phishing gate
              setLives((l) => {
                const nextL = l - 1;
                if (nextL <= 0) setIsGameOver(true);
                return Math.max(0, nextL);
              });
              playCue('tap', true);
            }
          } else if (newY < 100) {
            nextItems.push({ ...it, y: newY });
          }
        }

        // Periodically spawn new obstacle at top
        if (Math.random() < 0.28) {
          const randomLane = Math.floor(Math.random() * 3) as Lane;
          const types: Obstacle['type'][] = ['data', 'data', 'malware', 'gate_safe', 'gate_phish'];
          const randType = types[Math.floor(Math.random() * types.length)];
          const label =
            randType === 'data'
              ? '💾 Verified Data'
              : randType === 'malware'
              ? '👾 Trojan Trap'
              : randType === 'gate_safe'
              ? '✅ Official Portal'
              : '❌ Spoofed Portal';

          nextItems.push({
            id: nextId.current++,
            lane: randomLane,
            y: 0,
            type: randType,
            label,
          });
        }

        return nextItems;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [lane, isGameOver, paused, speedMultiplier]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        setLane((l) => (l > 0 ? ((l - 1) as Lane) : l));
      } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        setLane((l) => (l < 2 ? ((l + 1) as Lane) : l));
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const handleRestart = () => {
    setLane(1);
    setScore(0);
    setDataDelivered(0);
    setLives(3);
    setIsGameOver(false);
    setItems([]);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0f091f] text-[#f1edf8] font-sans">
      <header className="flex items-center justify-between px-4 md:px-8 py-3.5 border-b border-[#2e1d52] bg-[#1a0f38]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            className="border-[#472d7d] hover:bg-[#2e1a54] text-[#c084fc] gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" /> Adventures
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#c084fc]" />
              <h1 className="text-base md:text-lg font-bold text-white">Data Dash: Cyber Runner</h1>
            </div>
            <p className="text-xs text-[#a892d1]">Collect clean data capsules &middot; Dodge malware</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            {Array.from({ length: 3 }).map((_, i) => (
              <Heart
                key={i}
                className={`w-4 h-4 ${
                  i < lives ? 'text-[#f43f5e] fill-[#f43f5e]' : 'text-[#4c3b6b]'
                }`}
              />
            ))}
          </div>

          <div className="text-xs px-3 py-1.5 rounded-xl bg-[#2a174f] border border-[#482c7a] font-bold text-[#fde047]">
            {score} Score
          </div>
        </div>
      </header>

      {/* Runner Track Area */}
      <main className="max-w-xl w-full mx-auto p-4 flex-1 flex flex-col items-center justify-center">
        <div className="w-full relative h-[480px] bg-gradient-to-b from-[#180a33] via-[#120726] to-[#0a0317] rounded-3xl border-2 border-[#3c1d73] shadow-2xl overflow-hidden flex flex-col justify-between">
          {/* 3 Lanes Grid */}
          <div className="absolute inset-0 grid grid-cols-3 divide-x divide-[#301c59]/50 pointer-events-none">
            <div />
            <div />
            <div />
          </div>

          {/* Falling Obstacles / Pickups */}
          {items.map((it) => (
            <div
              key={it.id}
              className={`absolute -translate-x-1/2 px-2.5 py-1.5 rounded-xl text-[11px] font-bold shadow-md transition-transform flex items-center justify-center whitespace-nowrap ${
                it.type === 'data'
                  ? 'bg-[#10b981] text-black border border-[#34d399]'
                  : it.type === 'gate_safe'
                  ? 'bg-[#38bdf8] text-black border border-[#7dd3fc]'
                  : 'bg-[#ef4444] text-white border border-[#f87171]'
              }`}
              style={{
                left: it.lane === 0 ? '16.6%' : it.lane === 1 ? '50%' : '83.3%',
                top: `${it.y}%`,
              }}
            >
              {it.label}
            </div>
          ))}

          {/* Player Drone Marker */}
          <div
            className="absolute bottom-6 -translate-x-1/2 w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#9333ea] to-[#c084fc] border-2 border-white flex flex-col items-center justify-center shadow-[0_0_20px_rgba(192,132,252,0.8)] transition-all duration-150"
            style={{
              left: lane === 0 ? '16.6%' : lane === 1 ? '50%' : '83.3%',
            }}
          >
            <Shield className="w-6 h-6 text-white" />
            <span className="text-[9px] font-extrabold text-white">YOU</span>
          </div>

          {/* Game Over Screen */}
          {isGameOver && (
            <div className="absolute inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-30">
              <ShieldAlert className="w-12 h-12 text-[#ef4444] mb-2 animate-bounce" />
              <h2 className="text-2xl font-extrabold text-white mb-1">Session Terminated</h2>
              <p className="text-xs text-[#cbd5e1] mb-4">
                You delivered <strong>{dataDelivered}</strong> data capsules with a final score of{' '}
                <strong>{score}</strong>!
              </p>
              <Button
                onClick={handleRestart}
                className="bg-[#c084fc] hover:bg-[#a855f7] text-black font-extrabold text-xs px-5 py-2 rounded-xl gap-1.5"
              >
                <RotateCcw className="w-4 h-4" /> Dash Again
              </Button>
            </div>
          )}
        </div>

        {/* Mobile & Touch Controls */}
        <div className="w-full mt-4 flex items-center justify-between gap-3">
          <Button
            size="lg"
            onClick={() => setLane((l) => (l > 0 ? ((l - 1) as Lane) : l))}
            className="flex-1 py-4 bg-[#231245] hover:bg-[#321961] border border-[#482882] text-white font-bold gap-2 rounded-2xl"
          >
            <ChevronLeft className="w-5 h-5" /> Steer Left
          </Button>
          <Button
            size="lg"
            onClick={() => setLane((l) => (l < 2 ? ((l + 1) as Lane) : l))}
            className="flex-1 py-4 bg-[#231245] hover:bg-[#321961] border border-[#482882] text-white font-bold gap-2 rounded-2xl"
          >
            Steer Right <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </main>
    </div>
  );
}

