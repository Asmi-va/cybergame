'use client';

import { MISSIONS } from '@/lib/nayapur/campaign';
import type { MissionId } from '@/lib/nayapur/campaign';
import type { MissionProgress } from '@/lib/nayapur/progress';

const PLAYABLE: MissionId[] = ['bijli-bill', 'payment-aaya', 'parcel-stuck'];

export function MissionBriefing({
  missions,
  onContinue,
}: {
  missions: Partial<Record<MissionId, MissionProgress>>;
  onContinue: () => void;
}) {
  return (
    <div className="absolute inset-0 z-40 overflow-auto bg-[#090909] text-[#f6f1e8]">
      <div className="mx-auto flex min-h-full max-w-3xl flex-col px-5 py-8 sm:px-8">
        <p className="text-xs font-semibold tracking-[0.18em] text-[#FF9933]">STORY GAME · LEARN FROM THE STREET</p>
        <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Nayapur missions</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#9c968c]">
          This is a story game. You walk the neighbourhood, help people spot scams, and learn by doing. Start with mission 1 — more story beats unlock as you go.
        </p>

        <div className="mt-8 space-y-3">
          {MISSIONS.map((mission, index) => {
            const playable = PLAYABLE.includes(mission.id);
            const done = !!missions[mission.id]?.completed;
            const active = playable && !done && (index === 0 || !!missions[PLAYABLE[PLAYABLE.indexOf(mission.id) - 1] as MissionId]?.completed || mission.id === 'bijli-bill');
            return (
              <article
                key={mission.id}
                className={`rounded-xl border px-4 py-3 ${
                  done
                    ? 'border-[#3dd68c]/40 bg-[#3dd68c]/10'
                    : active
                      ? 'border-[#FF9933] bg-[#FF9933]/10'
                      : 'border-[#2a2a2a] bg-[#121212]'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#FF9933]">
                    Mission {index + 1} · Ch.{mission.chapter} · {mission.difficulty}
                  </p>
                  <span className="text-xs text-[#9c968c]">
                    {done ? 'Completed' : playable ? (active || mission.id === 'bijli-bill' ? 'Playable now' : 'Locked until previous') : 'Coming in story later'}
                  </span>
                </div>
                <h2 className="mt-1 text-lg font-semibold">{mission.title}</h2>
                <p className="mt-1 text-sm text-[#9c968c]">{mission.blurb}</p>
              </article>
            );
          })}
        </div>

        <div className="mt-8 rounded-xl border border-[#2a2a2a] bg-[#121212] p-4 text-sm text-[#9c968c]">
          <p className="font-semibold text-[#f6f1e8]">How to play</p>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>Finish the short movement tutorial (phone: stick + drag to look + Talk).</li>
            <li>Follow the quest beacon to Neighbourhood Uncle (Bijli Bill).</li>
            <li>Complete street talks — then return to Academy courses for certificates.</li>
          </ol>
        </div>

        <button
          type="button"
          onClick={onContinue}
          className="mt-8 rounded-md bg-[#FF9933] px-6 py-3 text-sm font-semibold text-[#0b0b0b]"
        >
          Start story tutorial
        </button>
      </div>
    </div>
  );
}
