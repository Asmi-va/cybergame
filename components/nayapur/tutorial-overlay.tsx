'use client';

import { useEffect, useState } from 'react';
import { playNayapurCue } from '@/lib/nayapur/audio';

type StepId = 'look' | 'move' | 'run' | 'interact';

const DESKTOP: { id: StepId; title: string; hint: string; keys: string[] }[] = [
  { id: 'look', title: 'Look around', hint: 'Click the street once, then move the mouse.', keys: ['Click', 'Mouse'] },
  { id: 'move', title: 'Walk the lane', hint: 'Use W A S D (or arrow keys) to walk.', keys: ['W', 'A', 'S', 'D'] },
  { id: 'run', title: 'Sprint', hint: 'Hold Shift while walking to run.', keys: ['Shift'] },
  { id: 'interact', title: 'Talk / inspect', hint: 'Walk near a glowing prompt and press E.', keys: ['E'] },
];

const MOBILE: { id: StepId; title: string; hint: string; keys: string[] }[] = [
  { id: 'look', title: 'Look around', hint: 'Drag on the right half of the screen to turn the camera.', keys: ['Drag right'] },
  { id: 'move', title: 'Walk the lane', hint: 'Use the left stick to walk.', keys: ['Stick'] },
  { id: 'run', title: 'Sprint', hint: 'Push the stick far or hold Run.', keys: ['Run'] },
  { id: 'interact', title: 'Talk / inspect', hint: 'Walk near a glowing prompt and tap Talk.', keys: ['Talk'] },
];

export function TutorialOverlay({
  locked,
  moving,
  running,
  nearPrompt,
  mobile = false,
  onDone,
}: {
  locked: boolean;
  moving: boolean;
  running: boolean;
  nearPrompt: boolean;
  mobile?: boolean;
  onDone: () => void;
}) {
  const steps = mobile ? MOBILE : DESKTOP;
  const [done, setDone] = useState<Record<StepId, boolean>>({
    look: false,
    move: false,
    run: false,
    interact: false,
  });

  useEffect(() => {
    setDone((prev) => {
      const next = { ...prev };
      if (locked) next.look = true;
      if (moving) next.move = true;
      if (running) next.run = true;
      if (nearPrompt) next.interact = true;
      return next;
    });
  }, [locked, moving, running, nearPrompt]);

  useEffect(() => {
    if (Object.values(done).every(Boolean)) {
      playNayapurCue('success');
      const timer = window.setTimeout(onDone, 700);
      return () => window.clearTimeout(timer);
    }
  }, [done, onDone]);

  const current = steps.find((step) => !done[step.id]) ?? steps[steps.length - 1];
  const progress = steps.filter((step) => done[step.id]).length;

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 p-4 pb-[11.5rem] sm:p-6 sm:pb-6">
      <div className="pointer-events-auto mx-auto w-full max-w-lg rounded-2xl border border-white/10 bg-[#14110e]/92 p-4 shadow-2xl backdrop-blur">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[10px] tracking-[0.16em] text-[#f0c27a]">
            TUTORIAL · {progress}/{steps.length}
            {mobile ? ' · TOUCH' : ''}
          </p>
          <button
            onClick={() => {
              playNayapurCue('tap');
              onDone();
            }}
            className="text-[11px] text-[#b9a890] hover:text-[#f0c27a]"
          >
            Skip
          </button>
        </div>
        <h3 className="mt-2 text-lg font-semibold text-[#f3efe7]">{current.title}</h3>
        <p className="mt-1 text-sm text-[#d9cfc0]">{current.hint}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {current.keys.map((key) => (
            <span key={key} className="rounded-md border border-white/15 bg-white/5 px-2 py-1 font-mono text-xs text-[#f0c27a]">
              {key}
            </span>
          ))}
        </div>
        <ul className="mt-4 grid grid-cols-2 gap-2 text-xs text-[#cfc3b2]">
          {steps.map((step) => (
            <li key={step.id} className={`rounded-lg px-2 py-1.5 ${done[step.id] ? 'bg-[#2a4028] text-[#b7e0b4]' : 'bg-white/5'}`}>
              {done[step.id] ? '✓' : '○'} {step.title}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
