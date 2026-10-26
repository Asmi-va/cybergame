let context: AudioContext | null = null;
export function playCue(kind: 'clue' | 'success' | 'tap', enabled: boolean) {
  if (!enabled) return;
  try {
    context ??= new AudioContext();
    if (context.state === 'suspended') void context.resume();
    const notes = kind === 'success' ? [523, 659, 784] : kind === 'clue' ? [659, 880] : [440];
    notes.forEach((frequency, index) => {
      const oscillator = context!.createOscillator(); const gain = context!.createGain();
      oscillator.type = 'sine'; oscillator.frequency.value = frequency;
      const time = context!.currentTime + index * .12;
      gain.gain.setValueAtTime(0, time); gain.gain.linearRampToValueAtTime(.07, time + .015); gain.gain.exponentialRampToValueAtTime(.001, time + .2);
      oscillator.connect(gain); gain.connect(context!.destination); oscillator.start(time); oscillator.stop(time + .22);
      oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
    });
  } catch { /* Audio is optional when the browser disallows an AudioContext. */ }
}
