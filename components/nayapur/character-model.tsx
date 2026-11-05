'use client';

import { useGLTF } from '@react-three/drei';
import { useMemo } from 'react';
import * as THREE from 'three';

export const NAYAPUR_CHARACTERS = {
  uncle: '/models/nayapur/characters/uncle-elderly-man-light.glb',
  player: '/models/nayapur/characters/player-casual-man-light.glb',
  playerRigged: '/models/nayapur/characters/player-casual-man-rigged.glb',
  shopkeeper: '/models/nayapur/characters/shopkeeper-businessman-light.glb',
} as const;

Object.values(NAYAPUR_CHARACTERS).forEach((url) => {
  useGLTF.preload(url);
});

/** CC0 Grab3D humanoid scaled so feet sit on y=0 at ~targetHeight metres. */
export function CharacterModel({
  url,
  targetHeight = 1.72,
  rotation = [0, 0, 0],
  position = [0, 0, 0],
}: {
  url: string;
  targetHeight?: number;
  rotation?: [number, number, number];
  position?: [number, number, number];
}) {
  const { scene } = useGLTF(url);
  const { object, scale } = useMemo(() => {
    const clone = scene.clone(true);
    let meshH = 0;
    clone.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      child.castShadow = true;
      child.receiveShadow = true;
      if (!child.geometry.boundingBox) child.geometry.computeBoundingBox();
      const box = child.geometry.boundingBox;
      if (box) meshH = Math.max(meshH, box.max.y - box.min.y);
      if (child.material) {
        const mats = Array.isArray(child.material) ? child.material : [child.material];
        mats.forEach((mat) => {
          mat.side = THREE.FrontSide;
        });
      }
    });
    const height = meshH > 0.1 ? meshH : 1.72;
    return { object: clone, scale: targetHeight / height };
  }, [scene, targetHeight]);

  return <primitive object={object} position={position} rotation={rotation} scale={scale} />;
}
