'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

function hold(code: string, down: boolean) {
  window.dispatchEvent(new CustomEvent('saferon-hold', { detail: { code, down } }));
}

function look(dx: number, dy: number) {
  window.dispatchEvent(new CustomEvent('saferon-look', { detail: { dx, dy } }));
}

function useIsCoarsePointer() {
  const [coarse, setCoarse] = useState(false);
  useEffect(() => {
    const sync = () => {
      setCoarse(
        window.matchMedia('(pointer: coarse)').matches
          || window.matchMedia('(max-width: 900px)').matches
          || 'ontouchstart' in window,
      );
    };
    sync();
    window.addEventListener('resize', sync);
    return () => window.removeEventListener('resize', sync);
  }, []);
  return coarse;
}

function Stick({
  onVector,
}: {
  onVector: (x: number, y: number, active: boolean) => void;
}) {
  const baseRef = useRef<HTMLDivElement>(null);
  const [knob, setKnob] = useState({ x: 0, y: 0 });
  const active = useRef(false);

  const apply = useCallback(
    (clientX: number, clientY: number) => {
      const el = baseRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      let dx = (clientX - cx) / (rect.width / 2);
      let dy = (clientY - cy) / (rect.height / 2);
      const len = Math.hypot(dx, dy) || 1;
      if (len > 1) {
        dx /= len;
        dy /= len;
      }
      setKnob({ x: dx * 36, y: dy * 36 });
      onVector(dx, dy, true);
    },
    [onVector],
  );

  const end = useCallback(() => {
    active.current = false;
    setKnob({ x: 0, y: 0 });
    onVector(0, 0, false);
  }, [onVector]);

  return (
    <div
      ref={baseRef}
      className="relative h-32 w-32 touch-none rounded-full border border-white/20 bg-black/35 shadow-lg backdrop-blur-sm"
      onPointerDown={(event) => {
        event.preventDefault();
        event.currentTarget.setPointerCapture(event.pointerId);
        active.current = true;
        apply(event.clientX, event.clientY);
      }}
      onPointerMove={(event) => {
        if (!active.current) return;
        event.preventDefault();
        apply(event.clientX, event.clientY);
      }}
      onPointerUp={end}
      onPointerCancel={end}
      onLostPointerCapture={end}
      aria-label="Move"
    >
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#FF9933]/70 bg-[#FF9933]/35"
        style={{ transform: `translate(calc(-50% + ${knob.x}px), calc(-50% + ${knob.y}px))` }}
      />
    </div>
  );
}

function LookPad({ enabled }: { enabled: boolean }) {
  const last = useRef<{ x: number; y: number } | null>(null);

  if (!enabled) return null;

  return (
    <div
      className="absolute inset-y-16 right-0 z-10 w-[48%] touch-none"
      aria-label="Look around"
      onPointerDown={(event) => {
        event.preventDefault();
        event.currentTarget.setPointerCapture(event.pointerId);
        last.current = { x: event.clientX, y: event.clientY };
      }}
      onPointerMove={(event) => {
        if (!last.current) return;
        event.preventDefault();
        const dx = event.clientX - last.current.x;
        const dy = event.clientY - last.current.y;
        last.current = { x: event.clientX, y: event.clientY };
        look(dx, dy);
      }}
      onPointerUp={() => {
        last.current = null;
      }}
      onPointerCancel={() => {
        last.current = null;
      }}
      onLostPointerCapture={() => {
        last.current = null;
      }}
    />
  );
}

function ActionButton({
  label,
  code,
  holdable = true,
  highlight,
}: {
  label: string;
  code: string;
  holdable?: boolean;
  highlight?: boolean;
}) {
  const release = () => hold(code, false);
  return (
    <button
      type="button"
      className={`h-14 min-w-14 touch-none rounded-full border px-4 text-sm font-semibold shadow-lg backdrop-blur-sm ${
        highlight
          ? 'border-[#FF9933] bg-[#FF9933] text-[#0b0b0b]'
          : 'border-white/20 bg-black/45 text-[#f6f1e8]'
      }`}
      aria-label={label}
      onPointerDown={(event) => {
        event.preventDefault();
        event.currentTarget.setPointerCapture(event.pointerId);
        hold(code, true);
        if (!holdable) {
          window.setTimeout(() => hold(code, false), 120);
        }
      }}
      onPointerUp={holdable ? release : undefined}
      onPointerCancel={holdable ? release : undefined}
      onLostPointerCapture={holdable ? release : undefined}
    >
      {label}
    </button>
  );
}

/** Virtual stick + look pad + interact for phones / tablets (Nayapur + practice 3D). */
export function MobileControls({
  visible,
  canInteract,
  lookEnabled = true,
  interactLabel = 'Talk',
  showRun = true,
}: {
  visible: boolean;
  canInteract: boolean;
  lookEnabled?: boolean;
  interactLabel?: string;
  showRun?: boolean;
}) {
  const coarse = useIsCoarsePointer();
  const codes = useRef({ w: false, a: false, s: false, d: false, shift: false });

  const onVector = useCallback((x: number, y: number, active: boolean) => {
    const dead = 0.22;
    const next = {
      w: active && y < -dead,
      s: active && y > dead,
      a: active && x < -dead,
      d: active && x > dead,
      shift: showRun && active && Math.hypot(x, y) > 0.72,
    };
    const map: Record<string, boolean> = {
      KeyW: next.w,
      KeyS: next.s,
      KeyA: next.a,
      KeyD: next.d,
      ShiftLeft: next.shift,
    };
    const prev = codes.current;
    const prevMap = {
      KeyW: prev.w,
      KeyS: prev.s,
      KeyA: prev.a,
      KeyD: prev.d,
      ShiftLeft: prev.shift,
    };
    for (const [code, down] of Object.entries(map)) {
      if (prevMap[code] !== down) hold(code, down);
    }
    codes.current = next;
  }, [showRun]);

  useEffect(() => {
    return () => {
      for (const code of ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ShiftLeft', 'KeyE']) {
        hold(code, false);
      }
    };
  }, []);

  if (!visible || !coarse) return null;

  return (
    <>
      <LookPad enabled={lookEnabled} />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex items-end justify-between gap-3 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <div className="pointer-events-auto">
          <Stick onVector={onVector} />
          <p className="mt-2 text-center text-[10px] tracking-[0.14em] text-white/60">MOVE</p>
        </div>
        <div className="pointer-events-auto mb-2 flex flex-col items-end gap-3">
          {showRun ? <ActionButton label="Run" code="ShiftLeft" /> : null}
          <ActionButton label={interactLabel} code="KeyE" holdable={false} highlight={canInteract} />
          <p className="text-[10px] tracking-[0.14em] text-white/60">DRAG RIGHT → LOOK</p>
        </div>
      </div>
    </>
  );
}

export function useTouchPlay() {
  return useIsCoarsePointer();
}

/** @deprecated use useTouchPlay */
export function useNayapurMobile() {
  return useIsCoarsePointer();
}
