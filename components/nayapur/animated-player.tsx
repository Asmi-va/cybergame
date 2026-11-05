'use client';

import { useAnimations, useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { clone as cloneSkinned } from 'three/examples/jsm/utils/SkeletonUtils.js';
import { NAYAPUR_CHARACTERS } from '@/components/nayapur/character-model';

useGLTF.preload(NAYAPUR_CHARACTERS.playerRigged);

/** Grab3D casual man is authored at ~1.8 m tall in mesh space. */
const AUTHOR_HEIGHT = 1.8;

export function AnimatedPlayer({
  moving,
  running,
  targetHeight = 1.68,
}: {
  moving: boolean;
  running: boolean;
  targetHeight?: number;
}) {
  const mixerRoot = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(NAYAPUR_CHARACTERS.playerRigged);
  const scale = targetHeight / AUTHOR_HEIGHT;

  const clone = useMemo(() => {
    const next = cloneSkinned(scene);
    next.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      child.castShadow = true;
      child.receiveShadow = true;
      child.frustumCulled = false;
    });
    return next;
  }, [scene]);

  const { actions } = useAnimations(animations, mixerRoot);
  const gait = useRef<'idle' | 'walk' | 'run'>('idle');

  useEffect(() => {
    actions.walk?.setLoop(THREE.LoopRepeat, Infinity);
    actions.run?.setLoop(THREE.LoopRepeat, Infinity);
  }, [actions]);

  useFrame(() => {
    const next: 'idle' | 'walk' | 'run' = !moving ? 'idle' : running ? 'run' : 'walk';
    if (next === gait.current) return;
    const prev = gait.current;
    gait.current = next;
    const walk = actions.walk;
    const run = actions.run;
    const fade = 0.18;

    if (next === 'idle') {
      walk?.fadeOut(fade);
      run?.fadeOut(fade);
      return;
    }
    if (next === 'walk' && walk) {
      if (prev === 'idle') walk.reset();
      walk.fadeIn(fade).play();
      run?.fadeOut(fade);
      return;
    }
    if (next === 'run' && run) {
      if (prev === 'idle') run.reset();
      run.fadeIn(fade).play();
      walk?.fadeOut(fade);
    }
  });

  return (
    <group scale={scale} userData={{ nayapurScale: scale }}>
      <group ref={mixerRoot}>
        <primitive object={clone} />
      </group>
    </group>
  );
}
