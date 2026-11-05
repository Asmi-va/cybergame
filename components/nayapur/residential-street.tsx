'use client';

import { NAYAPUR_MODELS, NayapurProp } from '@/components/nayapur/nayapur-props';
import type { Collider, InteractPoint } from '@/components/nayapur/third-person-controller';

/**
 * Open city lane: road modules + spaced shopfronts/houses.
 * Intentionally not using the dense starter-street bazaar mashup.
 */
export const STREET_COLLIDERS: Collider[] = [
  // Building lines left / right
  { minX: -12.5, maxX: -5.1, minZ: -18, maxZ: 18 },
  { minX: 5.1, maxX: 12.5, minZ: -18, maxZ: 18 },
  // Ends
  { minX: -12.5, maxX: 12.5, minZ: -18.6, maxZ: -17.8 },
  { minX: -12.5, maxX: 12.5, minZ: 17.8, maxZ: 18.6 },
  // Parked auto footprint only — tea stall sits on pavement outside walk lane
  { minX: 2.8, maxX: 4.6, minZ: 8.4, maxZ: 10.6 },
];

export const STREET_POINTS: InteractPoint[] = [
  { id: 'uncle', x: -1.4, z: 2.4, radius: 1.8, prompt: 'Press E to talk to Neighbourhood Uncle' },
  { id: 'shopkeeper', x: -3.2, z: -4.2, radius: 1.6, prompt: 'Press E to talk to Mr. Sharma' },
  { id: 'gate-note', x: 4.6, z: -10.2, radius: 1.25, prompt: 'Press E to read the compound notice' },
  { id: 'scooter', x: 3.4, z: 6.2, radius: 1.25, prompt: 'Press E to inspect the delivery bag' },
];

function RoadStretch() {
  // Road modules are ~6 m; overlap slightly so the city lane reads continuous.
  const zs = [-15, -9, -3, 3, 9, 15];
  return (
    <group>
      {zs.map((z) => (
        <NayapurProp key={`road-${z}`} url={NAYAPUR_MODELS.road} position={[0, 0, z]} scale={1.05} />
      ))}
      {zs.map((z) => (
        <NayapurProp key={`pav-l-${z}`} url={NAYAPUR_MODELS.pavement} position={[-4.35, 0, z]} rotation={[0, Math.PI / 2, 0]} scale={1.05} />
      ))}
      {zs.map((z) => (
        <NayapurProp key={`pav-r-${z}`} url={NAYAPUR_MODELS.pavement} position={[4.35, 0, z]} rotation={[0, -Math.PI / 2, 0]} scale={1.05} />
      ))}
    </group>
  );
}

function CityBlocks() {
  return (
    <group>
      {/* Left elevation — residential / shuttered shops, spaced like a city block */}
      <NayapurProp url={NAYAPUR_MODELS.corner} position={[-7.2, 0, 12]} rotation={[0, Math.PI / 2, 0]} />
      <NayapurProp url={NAYAPUR_MODELS.shopClosed} position={[-7.0, 0, 6]} rotation={[0, Math.PI / 2, 0]} />
      <NayapurProp url={NAYAPUR_MODELS.balcony} position={[-7.1, 0, 1.2]} rotation={[0, Math.PI / 2, 0]} />
      <NayapurProp url={NAYAPUR_MODELS.shopOpen} position={[-7.0, 0, -4]} rotation={[0, Math.PI / 2, 0]} />
      {/* Mr. Sharma stands just in front of the open shop */}
      <NayapurProp url={NAYAPUR_MODELS.wall} position={[-7.3, 0, -10]} rotation={[0, Math.PI / 2, 0]} />
      <NayapurProp url={NAYAPUR_MODELS.stairs} position={[-6.4, 0, -14]} rotation={[0, Math.PI / 2, 0]} />

      {/* Right elevation */}
      <NayapurProp url={NAYAPUR_MODELS.shopOpen} position={[7.0, 0, 11]} rotation={[0, -Math.PI / 2, 0]} />
      <NayapurProp url={NAYAPUR_MODELS.colonnade} position={[7.1, 0, 5]} rotation={[0, -Math.PI / 2, 0]} />
      <NayapurProp url={NAYAPUR_MODELS.shopClosed} position={[7.0, 0, -1]} rotation={[0, -Math.PI / 2, 0]} />
      <NayapurProp url={NAYAPUR_MODELS.corner} position={[7.2, 0, -7]} rotation={[0, -Math.PI / 2, 0]} />
      <NayapurProp url={NAYAPUR_MODELS.balcony} position={[7.1, 0, -13]} rotation={[0, -Math.PI / 2, 0]} />

      <NayapurProp url={NAYAPUR_MODELS.gate} position={[6.2, 0, -10.4]} rotation={[0, -Math.PI / 2, 0]} />
      <NayapurProp url={NAYAPUR_MODELS.tank} position={[-6.8, 3.2, 6]} />
      <NayapurProp url={NAYAPUR_MODELS.tank} position={[6.8, 3.2, -7]} />
    </group>
  );
}

export function ResidentialStreet() {
  return (
    <group>
      {/* Quiet ground plane under the modules for city continuity */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[36, 42]} />
        <meshStandardMaterial color="#6d655c" roughness={0.95} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[8.4, 36]} />
        <meshStandardMaterial color="#3f3c38" roughness={0.9} />
      </mesh>

      <RoadStretch />
      <CityBlocks />

      {/* Sparse street life — city, not packed bazaar */}
      <NayapurProp url={NAYAPUR_MODELS.tea} position={[-3.8, 0, 1.4]} rotation={[0, Math.PI / 2, 0]} />
      <NayapurProp url={NAYAPUR_MODELS.awning} position={[-3.6, 2.1, 1.4]} rotation={[0, Math.PI / 2, 0]} scale={0.85} />
      <NayapurProp url={NAYAPUR_MODELS.rickshaw} position={[3.6, 0, 9.4]} rotation={[0, -0.35, 0]} />
      <NayapurProp url={NAYAPUR_MODELS.scooter} position={[3.5, 0, 6.1]} rotation={[0, 0.55, 0]} />
      <NayapurProp url={NAYAPUR_MODELS.bicycle} position={[-3.2, 0, -8.5]} rotation={[0, 1.1, 0]} />

      <NayapurProp url={NAYAPUR_MODELS.pole} position={[-4.8, 0, 14]} />
      <NayapurProp url={NAYAPUR_MODELS.pole} position={[4.8, 0, 4]} />
      <NayapurProp url={NAYAPUR_MODELS.pole} position={[-4.8, 0, -8]} />
      <NayapurProp url={NAYAPUR_MODELS.cables} position={[0, 5.4, 4]} scale={[1.15, 1, 1.15]} />
    </group>
  );
}
