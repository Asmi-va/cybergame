import type { MissionId } from '@/lib/nayapur/campaign';
import type { MissionProgress } from '@/lib/nayapur/progress';

export type GuideTarget = {
  id: string;
  meet: string;
  place: string;
  step: string;
  next: string;
  tip: string;
  x: number;
  z: number;
  missionId: MissionId | null;
};

const TARGETS: GuideTarget[] = [
  {
    id: 'uncle',
    meet: 'Neighbourhood Uncle',
    place: 'Tea stall on the left',
    step: 'Step 1 of 3',
    next: 'Talk to Uncle and stop the fake bijli bill call.',
    tip: 'Walk forward down the lane. Look for the tea kettle — Uncle stands beside it.',
    x: -1.4,
    z: 2.4,
    missionId: 'bijli-bill',
  },
  {
    id: 'shopkeeper',
    meet: 'Mr. Sharma',
    place: 'Open shop on the left',
    step: 'Step 2 of 3',
    next: 'Check the UPI payment screenshot before he hands over goods.',
    tip: 'Keep walking past Uncle toward the open shutter shop. Sharma waits out front.',
    x: -3.2,
    z: -4.2,
    missionId: 'payment-aaya',
  },
  {
    id: 'scooter',
    meet: 'Delivery bag',
    place: 'Parked scooter on the right',
    step: 'Step 3 of 3',
    next: 'Inspect the courier fee slip on the scooter seat.',
    tip: 'Turn back toward the rickshaw side of the road — blue scooter with a bag on it.',
    x: 3.4,
    z: 6.2,
    missionId: 'parcel-stuck',
  },
];

export function getGuideTarget(
  missions: Partial<Record<MissionId, MissionProgress>>,
): GuideTarget | null {
  for (const target of TARGETS) {
    if (!target.missionId) continue;
    if (!missions[target.missionId]?.completed) return target;
  }
  return null;
}

/** Compass bearing in degrees: 0 = straight ahead (controller yaw), + = right. */
export function bearingToTarget(
  playerX: number,
  playerZ: number,
  yaw: number,
  targetX: number,
  targetZ: number,
) {
  const fx = -Math.sin(yaw);
  const fz = -Math.cos(yaw);
  const tx = targetX - playerX;
  const tz = targetZ - playerZ;
  const cross = fx * tz - fz * tx;
  const dot = fx * tx + fz * tz;
  return (Math.atan2(cross, dot) * 180) / Math.PI;
}

export function distanceToTarget(playerX: number, playerZ: number, targetX: number, targetZ: number) {
  return Math.hypot(targetX - playerX, targetZ - playerZ);
}

export function directionLabel(bearingDeg: number) {
  const a = Math.abs(bearingDeg);
  if (a < 25) return 'Straight ahead';
  if (a < 70) return bearingDeg > 0 ? 'Ahead and right' : 'Ahead and left';
  if (a < 115) return bearingDeg > 0 ? 'To your right' : 'To your left';
  if (a < 155) return bearingDeg > 0 ? 'Behind and right' : 'Behind and left';
  return 'Turn around';
}
