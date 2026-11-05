'use client';

import { useEffect, useState } from 'react';
import { playNayapurCue } from '@/lib/nayapur/audio';

const BEATS: { eyebrow: string; title: string; body: string; cue?: 'open' | 'talk' | 'message' }[] = [
  {
    eyebrow: 'STORY GAME · LEARN FROM THE STREET',
    title: 'Nayapur is a story world for cyber safety.',
    body: 'You do not just read tips — you walk the lane, talk to neighbours, and stop everyday India scams before money moves.',
    cue: 'open',
  },
  {
    eyebrow: 'YOUR ROLE',
    title: 'You live on this lane.',
    body: 'The Cyber Safety Club needs people who notice fraud early. Missions unlock as you help: bijli bills, fake payments, parcels, and more.',
    cue: 'talk',
  },
  {
    eyebrow: 'FIRST MISSION',
    title: 'A bijli “disconnection” threat just landed.',
    body: 'Uncle is about to call a number he does not know. After this intro you will see the full mission board — then learn to move and help him.',
    cue: 'message',
  },
];

export function OpeningSequence({ onDone }: { onDone: () => void }) {
  const [index, setIndex] = useState(0);
  const beat = BEATS[index];

  useEffect(() => {
    playNayapurCue(beat.cue ?? 'open');
  }, [index, beat.cue]);

  return (
    <div className="absolute inset-0 z-40 overflow-hidden bg-[#0c0a08]">
      <div
        className="absolute inset-0 opacity-80"
        style={{
          background:
            'radial-gradient(ellipse at 30% 20%, #3a2a18 0%, transparent 55%), radial-gradient(ellipse at 80% 70%, #1a3040 0%, transparent 50%), linear-gradient(160deg, #1a1510, #0c0a08 60%)',
        }}
      />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent" />
      <div className="relative flex h-full flex-col justify-end p-6 sm:p-10">
        <div className="mb-6 flex gap-2">
          {BEATS.map((_, i) => (
            <span key={i} className={`h-1 flex-1 rounded-full ${i <= index ? 'bg-[#f0c27a]' : 'bg-white/15'}`} />
          ))}
        </div>
        <p className="text-xs tracking-[0.18em] text-[#f0c27a]">{beat.eyebrow}</p>
        <h2 className="mt-3 max-w-2xl text-3xl font-semibold leading-tight text-[#f3efe7] sm:text-4xl">{beat.title}</h2>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#d9cfc0] sm:text-base">{beat.body}</p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              playNayapurCue('tap');
              if (index + 1 < BEATS.length) setIndex((v) => v + 1);
              else onDone();
            }}
            className="rounded-full bg-[#f0c27a] px-6 py-2.5 text-sm font-semibold text-[#1c140c]"
          >
            {index + 1 < BEATS.length ? 'Continue' : 'See mission board'}
          </button>
          <button
            onClick={() => {
              playNayapurCue('tap');
              onDone();
            }}
            className="text-xs text-[#b9a890] underline-offset-2 hover:underline"
          >
            Skip opening
          </button>
        </div>
      </div>
    </div>
  );
}
