'use client';

import { playCue } from '@/lib/game/audio';

let context: AudioContext | null = null;

function ctx() {
  context ??= new AudioContext();
  if (context.state === 'suspended') void context.resume();
  return context;
}

function tone(freqs: number[], opts?: { type?: OscillatorType; gap?: number; vol?: number; dur?: number }) {
  try {
    const audio = ctx();
    const gap = opts?.gap ?? 0.11;
    const vol = opts?.vol ?? 0.06;
    const dur = opts?.dur ?? 0.18;
    freqs.forEach((frequency, index) => {
      const oscillator = audio.createOscillator();
      const gain = audio.createGain();
      oscillator.type = opts?.type ?? 'sine';
      oscillator.frequency.value = frequency;
      const time = audio.currentTime + index * gap;
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(vol, time + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.001, time + dur);
      oscillator.connect(gain);
      gain.connect(audio.destination);
      oscillator.start(time);
      oscillator.stop(time + dur + 0.02);
      oscillator.onended = () => {
        oscillator.disconnect();
        gain.disconnect();
      };
    });
  } catch {
    /* optional */
  }
}

export type NayapurCue =
  | 'tap'
  | 'talk'
  | 'phone'
  | 'message'
  | 'correct'
  | 'wrong'
  | 'success'
  | 'open';

export function playNayapurCue(kind: NayapurCue, enabled = true) {
  if (!enabled) return;
  switch (kind) {
    case 'tap':
      playCue('tap', true);
      break;
    case 'talk':
      tone([320, 380, 340], { type: 'triangle', gap: 0.08, vol: 0.045, dur: 0.14 });
      break;
    case 'phone':
      tone([880, 0.01, 880, 0.01, 880], { type: 'sine', gap: 0.16, vol: 0.05, dur: 0.12 });
      break;
    case 'message':
      tone([740, 980], { type: 'sine', gap: 0.09, vol: 0.055, dur: 0.16 });
      break;
    case 'correct':
      playCue('clue', true);
      break;
    case 'wrong':
      tone([220, 180], { type: 'sawtooth', gap: 0.1, vol: 0.035, dur: 0.2 });
      break;
    case 'success':
      playCue('success', true);
      break;
    case 'open':
      tone([392, 523, 659], { type: 'triangle', gap: 0.14, vol: 0.05, dur: 0.22 });
      break;
    default:
      break;
  }
}
