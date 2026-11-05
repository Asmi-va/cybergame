'use client';

import { useGLTF } from '@react-three/drei';
import { useMemo } from 'react';
import * as THREE from 'three';

const ROOT = '/models/office';

export const OFFICE_MODELS = {
  desk: `${ROOT}/office_desk.glb`,
  chair: `${ROOT}/office_chair.glb`,
  monitor: `${ROOT}/monitor.glb`,
  keyboard: `${ROOT}/keyboard.glb`,
  mouse: `${ROOT}/computer_mouse.glb`,
  tower: `${ROOT}/desktop_tower.glb`,
  lamp: `${ROOT}/desk_lamp.glb`,
  papers: `${ROOT}/paper_stack.glb`,
  cabinet: `${ROOT}/filing_cabinet.glb`,
  plant: `${ROOT}/office_plant.glb`,
  printer: `${ROOT}/printer.glb`,
  rack: `${ROOT}/server_rack.glb`,
  cooler: `${ROOT}/water_cooler.glb`,
  board: `${ROOT}/whiteboard.glb`,
  laptop: `${ROOT}/laptop.glb`,
  shelf: `${ROOT}/bookshelf.glb`,
  bin: `${ROOT}/trash_bin.glb`,
} as const;

Object.values(OFFICE_MODELS).forEach((url) => {
  useGLTF.preload(url);
});

export function OfficeProp({
  url,
  position,
  rotation,
}: {
  url: string;
  position: [number, number, number];
  rotation?: [number, number, number];
}) {
  const { scene } = useGLTF(url);
  const object = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      child.castShadow = true;
      child.receiveShadow = true;
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      for (const material of materials) {
        if (material instanceof THREE.MeshStandardMaterial && material.emissive.getHex() !== 0) {
          material.emissiveIntensity = 1.6;
        }
      }
    });
    return clone;
  }, [scene]);
  return <primitive object={object} position={position} rotation={rotation} />;
}
