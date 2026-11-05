'use client';

import { useGLTF } from '@react-three/drei';
import { useMemo } from 'react';
import * as THREE from 'three';

export const NAYAPUR_MODELS = {
  starterStreet: '/models/nayapur/bazaar/starter-street.glb',
  road: '/models/nayapur/streets/road-module.glb',
  pavement: '/models/nayapur/streets/pavement-module.glb',
  shopClosed: '/models/nayapur/shops/shopfront-shutter.glb',
  shopOpen: '/models/nayapur/shops/shopfront-open.glb',
  balcony: '/models/nayapur/houses/balcony-jali.glb',
  corner: '/models/nayapur/houses/corner-block.glb',
  wall: '/models/nayapur/houses/plaster-wall.glb',
  gate: '/models/nayapur/houses/compound-gate.glb',
  stairs: '/models/nayapur/houses/external-stairs.glb',
  tank: '/models/nayapur/houses/rooftop-tank.glb',
  colonnade: '/models/nayapur/shops/colonnade-bay.glb',
  fruit: '/models/nayapur/shops/fruit-stall.glb',
  spice: '/models/nayapur/shops/spice-stall.glb',
  tea: '/models/nayapur/shops/tea-stall.glb',
  awning: '/models/nayapur/shops/awning.glb',
  rickshaw: '/models/nayapur/vehicles/auto-rickshaw.glb',
  scooter: '/models/nayapur/vehicles/scooter.glb',
  motorcycle: '/models/nayapur/vehicles/motorcycle.glb',
  bicycle: '/models/nayapur/vehicles/bicycle.glb',
  handcart: '/models/nayapur/vehicles/handcart.glb',
  pole: '/models/nayapur/streets/utility-pole.glb',
  cables: '/models/nayapur/streets/overhead-cables.glb',
} as const;

Object.values(NAYAPUR_MODELS).forEach((url) => {
  useGLTF.preload(url);
});

export function NayapurProp({
  url,
  position,
  rotation,
  scale = 1,
}: {
  url: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
}) {
  const { scene } = useGLTF(url);
  const object = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      child.castShadow = true;
      child.receiveShadow = true;
    });
    return clone;
  }, [scene]);
  return <primitive object={object} position={position} rotation={rotation} scale={scale} />;
}
