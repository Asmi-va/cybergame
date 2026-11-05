'use client';

import { useFrame } from '@react-three/fiber';
import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  bearingToTarget,
  directionLabel,
  distanceToTarget,
  type GuideTarget,
} from '@/lib/nayapur/guide';

export function QuestBeacon({ target }: { target: GuideTarget | null }) {
  const ref = useRef<THREE.Mesh>(null);
  const ring = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ref.current) {
      ref.current.position.y = 2.35 + Math.sin(t * 2.4) * 0.12;
      ref.current.rotation.y = t * 1.5;
    }
    if (ring.current) {
      const pulse = 0.85 + Math.sin(t * 3) * 0.15;
      ring.current.scale.setScalar(pulse);
    }
  });

  if (!target) return null;

  return (
    <group position={[target.x, 0, target.z]}>
      <mesh ref={ref}>
        <octahedronGeometry args={[0.22, 0]} />
        <meshStandardMaterial color="#f0c27a" emissive="#c4892e" emissiveIntensity={0.65} roughness={0.35} />
      </mesh>
      <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <ringGeometry args={[0.55, 0.72, 32]} />
        <meshBasicMaterial color="#f0c27a" transparent opacity={0.55} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

export function QuestGuidePanel({
  target,
  playerX,
  playerZ,
  yaw,
  visible,
}: {
  target: GuideTarget | null;
  playerX: number;
  playerZ: number;
  yaw: number;
  visible: boolean;
}) {
  const [open, setOpen] = useState(true);

  const guide = useMemo(() => {
    if (!target) return null;
    const bearing = bearingToTarget(playerX, playerZ, yaw, target.x, target.z);
    const dist = distanceToTarget(playerX, playerZ, target.x, target.z);
    return {
      bearing,
      dist,
      label: directionLabel(bearing),
      near: dist < 2.2,
    };
  }, [target, playerX, playerZ, yaw]);

  if (!visible) return null;

  if (!target) {
    return (
      <div className="pointer-events-none absolute bottom-4 left-4 max-w-xs rounded-2xl bg-[#14110e]/88 p-4">
        <p className="text-[10px] tracking-[0.16em] text-[#8fd4a0]">GUIDE</p>
        <p className="mt-1 text-sm text-[#efe7da]">All street cases clear. Explore the lane — more of Nayapur opens next.</p>
      </div>
    );
  }

  return (
    <div className="absolute bottom-4 left-4 z-20 w-[min(100%-2rem,20rem)]">
      <div className="rounded-2xl border border-white/10 bg-[#14110e]/92 p-4 shadow-xl backdrop-blur">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[10px] tracking-[0.16em] text-[#f0c27a]">GUIDE · {target.step}</p>
            <h2 className="mt-1 text-base font-semibold text-[#f3efe7]">Meet {target.meet}</h2>
          </div>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="rounded-full border border-white/10 px-2 py-0.5 text-[11px] text-[#d9cfc0]"
          >
            {open ? 'Hide' : 'Show'}
          </button>
        </div>

        {open && (
          <>
            <p className="mt-2 text-sm leading-relaxed text-[#d9cfc0]">{target.next}</p>
            <p className="mt-1 text-xs text-[#b9a890]">{target.place}</p>

            <div className="mt-3 flex items-center gap-3 rounded-xl bg-white/5 p-3">
              <div
                className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-[#f0c27a]/40 bg-[#1c1712]"
                aria-hidden
              >
                <span
                  className="block text-2xl text-[#f0c27a] transition-transform duration-150"
                  style={{ transform: `rotate(${guide?.bearing ?? 0}deg)` }}
                >
                  ↑
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-[#f3efe7]">
                  {guide?.near ? 'You are here — press E' : guide?.label}
                </p>
                <p className="text-xs text-[#b9a890]">
                  {guide ? `${guide.dist.toFixed(1)} m away` : '—'}
                </p>
              </div>
            </div>

            <p className="mt-3 text-xs leading-relaxed text-[#cfc3b2]">{target.tip}</p>
          </>
        )}
      </div>
    </div>
  );
}
