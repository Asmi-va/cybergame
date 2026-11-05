'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MissionId } from '@/lib/nayapur/campaign';

export type MissionProgress = {
  started: boolean;
  completed: boolean;
  bestChoice?: string;
};

type ClubId = 'reception' | 'lab' | 'investigation' | 'classroom' | 'helpdesk' | 'server';

export type OnboardingPhase = 'opening' | 'briefing' | 'tutorial' | 'play';

type PersistedSlice = {
  onboarding: OnboardingPhase;
  soundEnabled: boolean;
  trust: number;
  stars: number;
  coins: number;
  activeMission: MissionId | null;
  missions: Partial<Record<MissionId, MissionProgress>>;
  club: Record<ClubId, boolean>;
};

type NayapurState = PersistedSlice & {
  hydrated: boolean;
  setHydrated: (value: boolean) => void;
  setOnboarding: (phase: OnboardingPhase) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setActiveMission: (id: MissionId | null) => void;
  startMission: (id: MissionId) => void;
  completeMission: (id: MissionId, reward: { trust: number; stars: number; coins: number }) => void;
};

function nextActive(missions: Partial<Record<MissionId, MissionProgress>>): MissionId | null {
  if (!missions['bijli-bill']?.completed) return 'bijli-bill';
  if (!missions['payment-aaya']?.completed) return 'payment-aaya';
  if (!missions['parcel-stuck']?.completed) return 'parcel-stuck';
  return null;
}

const DEFAULT_CLUB: Record<ClubId, boolean> = {
  reception: true,
  lab: false,
  investigation: false,
  classroom: false,
  helpdesk: false,
  server: false,
};

function readLegacyV1(): Partial<PersistedSlice> | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem('saferon-nayapur-v1');
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { state?: Record<string, unknown> } | Record<string, unknown>;
    const s: Record<string, unknown> =
      parsed && typeof parsed === 'object' && 'state' in parsed && parsed.state && typeof parsed.state === 'object'
        ? (parsed.state as Record<string, unknown>)
        : (parsed as Record<string, unknown>);
    if (!s || typeof s !== 'object') return null;
    const introSeen = !!s.introSeen;
    const tutorialDone = !!s.tutorialDone;
    let onboarding: OnboardingPhase = 'opening';
    if (tutorialDone) onboarding = 'play';
    else if (introSeen) onboarding = 'briefing';
    return {
      onboarding,
      soundEnabled: true,
      trust: typeof s.trust === 'number' ? s.trust : 0,
      stars: typeof s.stars === 'number' ? s.stars : 0,
      coins: typeof s.coins === 'number' ? s.coins : 0,
      activeMission: (s.activeMission as MissionId | null) ?? 'bijli-bill',
      missions: (s.missions as PersistedSlice['missions']) ?? {},
      club: { ...DEFAULT_CLUB, ...(s.club as PersistedSlice['club'] | undefined) },
    };
  } catch {
    return null;
  }
}

export const useNayapur = create<NayapurState>()(
  persist(
    (set) => ({
      hydrated: false,
      onboarding: 'opening',
      soundEnabled: true,
      trust: 0,
      stars: 0,
      coins: 0,
      activeMission: 'bijli-bill',
      missions: {},
      club: { ...DEFAULT_CLUB },
      setHydrated: (value) => set({ hydrated: value }),
      setOnboarding: (phase) => set({ onboarding: phase }),
      setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
      setActiveMission: (id) => set({ activeMission: id }),
      startMission: (id) =>
        set((state) => ({
          activeMission: id,
          missions: {
            ...state.missions,
            [id]: {
              started: true,
              completed: !!state.missions[id]?.completed,
              bestChoice: state.missions[id]?.bestChoice,
            },
          },
        })),
      completeMission: (id, reward) =>
        set((state) => {
          const missions = {
            ...state.missions,
            [id]: { started: true, completed: true, bestChoice: state.missions[id]?.bestChoice },
          };
          return {
            trust: state.trust + reward.trust,
            stars: state.stars + reward.stars,
            coins: state.coins + reward.coins,
            activeMission: nextActive(missions),
            missions,
            club: {
              ...state.club,
              lab: state.club.lab || id === 'payment-aaya',
              investigation: state.club.investigation || id === 'parcel-stuck',
              classroom: state.club.classroom || id === 'bank-call',
              helpdesk: state.club.helpdesk || id === 'scholarship',
              server: state.club.server || id === 'free-fire',
            },
          };
        }),
    }),
    {
      name: 'saferon-nayapur-v2',
      version: 2,
      partialize: (state): PersistedSlice => ({
        onboarding: state.onboarding,
        soundEnabled: state.soundEnabled,
        trust: state.trust,
        stars: state.stars,
        coins: state.coins,
        activeMission: state.activeMission,
        missions: state.missions,
        club: state.club,
      }),
      merge: (persisted, current) => {
        const saved = (persisted ?? {}) as Partial<PersistedSlice>;
        const legacy = !saved.onboarding && Object.keys(saved.missions ?? {}).length === 0 ? readLegacyV1() : null;
        const source = legacy ?? saved;
        return {
          ...current,
          ...source,
          club: { ...DEFAULT_CLUB, ...source.club },
          missions: source.missions ?? {},
          hydrated: false,
        };
      },
      onRehydrateStorage: () => (_state, error) => {
        // Always mark hydrated so UI can leave the loading gate (even if storage failed).
        queueMicrotask(() => useNayapur.setState({ hydrated: true }));
        if (error) console.warn('[nayapur] progress rehydrate failed', error);
      },
    },
  ),
);
