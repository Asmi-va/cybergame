'use client';

import { NAYAPUR_MODELS, NayapurProp } from '@/components/nayapur/nayapur-props';

export type HouseVariant = 'a' | 'b' | 'c';

/** Modular South Asian frontage from the CC0 Indian Bazaar pack (not low-poly office assets). */
export function IndianHouse({
  variant,
  position,
  rotation = 0,
}: {
  variant: HouseVariant;
  position: [number, number, number];
  rotation?: number;
}) {
  const yaw: [number, number, number] = [0, rotation, 0];
  if (variant === 'a') {
    return (
      <group position={position} rotation={yaw}>
        <NayapurProp url={NAYAPUR_MODELS.shopClosed} position={[0, 0, 0]} />
        <NayapurProp url={NAYAPUR_MODELS.balcony} position={[0, 0, 0]} />
        <NayapurProp url={NAYAPUR_MODELS.tank} position={[0.6, 0, -0.4]} />
      </group>
    );
  }
  if (variant === 'b') {
    return (
      <group position={position} rotation={yaw}>
        <NayapurProp url={NAYAPUR_MODELS.shopOpen} position={[0, 0, 0]} />
        <NayapurProp url={NAYAPUR_MODELS.balcony} position={[0, 0, 0]} />
        <NayapurProp url={NAYAPUR_MODELS.stairs} position={[1.8, 0, 0.2]} />
      </group>
    );
  }
  return (
    <group position={position} rotation={yaw}>
      <NayapurProp url={NAYAPUR_MODELS.corner} position={[0, 0, 0]} />
      <NayapurProp url={NAYAPUR_MODELS.wall} position={[-2.2, 0, 0]} />
      <NayapurProp url={NAYAPUR_MODELS.tank} position={[0.4, 0, -0.3]} />
    </group>
  );
}
