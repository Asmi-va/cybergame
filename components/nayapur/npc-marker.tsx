'use client';

import { CharacterModel, NAYAPUR_CHARACTERS } from '@/components/nayapur/character-model';

const URLS = {
  uncle: NAYAPUR_CHARACTERS.uncle,
  shopkeeper: NAYAPUR_CHARACTERS.shopkeeper,
} as const;

export function NpcMarker({
  position,
  rotation = [0, Math.PI * 0.15, 0],
  variant = 'uncle',
  height = 1.7,
}: {
  position: [number, number, number];
  color?: string;
  rotation?: [number, number, number];
  variant?: keyof typeof URLS;
  height?: number;
}) {
  return (
    <group position={position}>
      <CharacterModel url={URLS[variant]} targetHeight={height} rotation={rotation} />
    </group>
  );
}
