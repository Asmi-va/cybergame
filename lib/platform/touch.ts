/** True when the primary pointing device is a finger (phones / most tablets). */
export function isPrimaryTouchDevice() {
  if (typeof window === 'undefined') return false;
  // Do NOT use `ontouchstart in window` — Windows laptops with touch report that
  // and would wrongly disable mouse pointer-lock + WASD play.
  return window.matchMedia('(hover: none) and (pointer: coarse)').matches;
}
