'use client';

import { RoundedBox } from '@react-three/drei';
import { Block, Tree } from './campus';

export function LabEnvironment() {
  return (
    <group>
      {/* Lab Room Floor */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <boxGeometry args={[32, 0.2, 26]} />
        <meshStandardMaterial color="#2d3748" roughness={0.6} />
      </mesh>

      {/* Lab Back Walls */}
      <Block p={[0, 4, -13]} s={[32, 8, 0.8]} color="#1a202c" />
      <Block p={[-16, 4, 0]} s={[0.8, 8, 26]} color="#1a202c" />
      <Block p={[16, 4, 0]} s={[0.8, 8, 26]} color="#1a202c" />

      {/* Server Rack Area */}
      <group position={[-12, 0, -8]}>
        <Block p={[0, 3, 0]} s={[3, 6, 2]} color="#111827" />
        <Block p={[0, 3, 1.05]} s={[2.6, 5.4, 0.1]} color="#1e293b" />
        {/* Flashing LED lights on server */}
        {[-1.8, -0.6, 0.6, 1.8].map((y, i) => (
          <mesh key={i} position={[0.8, 3 + y, 1.12]}>
            <sphereGeometry args={[0.07, 8, 8]} />
            <meshBasicMaterial color={i % 2 === 0 ? '#10b981' : '#38bdf8'} />
          </mesh>
        ))}
      </group>

      {/* Lab Workstation Rows (Row 1) */}
      {[-8, -2, 4, 10].map((x, i) => (
        <group key={x} position={[x, 0, -3]}>
          {/* Desk */}
          <Block p={[0, 0.9, 0]} s={[3.2, 0.12, 1.4]} color="#334155" />
          <Block p={[-1.4, 0.45, 0]} s={[0.1, 0.9, 1.2]} color="#475569" />
          <Block p={[1.4, 0.45, 0]} s={[0.1, 0.9, 1.2]} color="#475569" />

          {/* Dual Monitor */}
          <RoundedBox args={[1.2, 0.75, 0.08]} radius={0.03} position={[-0.6, 1.6, 0.1]}>
            <meshStandardMaterial color="#0f172a" />
          </RoundedBox>
          <mesh position={[-0.6, 1.6, 0.15]}>
            <planeGeometry args={[1.1, 0.65]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>

          <RoundedBox args={[1.2, 0.75, 0.08]} radius={0.03} position={[0.6, 1.6, -0.05]} rotation={[0, -0.2, 0]}>
            <meshStandardMaterial color="#0f172a" />
          </RoundedBox>
          <mesh position={[0.6, 1.6, 0.01]} rotation={[0, -0.2, 0]}>
            <planeGeometry args={[1.1, 0.65]} />
            <meshBasicMaterial color="#10b981" />
          </mesh>

          {/* Keyboard & Mouse */}
          <Block p={[0, 0.98, 0.4]} s={[1.2, 0.03, 0.4]} color="#1e293b" />
          <Block p={[0.8, 0.98, 0.4]} s={[0.15, 0.03, 0.25]} color="#0f172a" />
        </group>
      ))}

      {/* Teacher Podium & Desk (Center Front) */}
      <group position={[0, 0, 5]}>
        <Block p={[0, 1.1, 0]} s={[5.5, 0.16, 2]} color="#475569" />
        <Block p={[-2.5, 0.55, 0]} s={[0.2, 1.1, 1.8]} color="#334155" />
        <Block p={[2.5, 0.55, 0]} s={[0.2, 1.1, 1.8]} color="#334155" />

        {/* Master Teacher Laptop */}
        <RoundedBox args={[1.4, 0.06, 1]} radius={0.02} position={[0, 1.2, 0.2]}>
          <meshStandardMaterial color="#64748b" />
        </RoundedBox>
        <RoundedBox args={[1.4, 0.9, 0.05]} radius={0.02} position={[0, 1.7, -0.25]} rotation={[-0.2, 0, 0]}>
          <meshStandardMaterial color="#0f172a" />
        </RoundedBox>
      </group>

      {/* Lab Tech Noticeboard / Whiteboard */}
      <group position={[0, 4.5, -12.5]}>
        <Block p={[0, 0, 0]} s={[12, 4, 0.1]} color="#f8fafc" />
        <Block p={[0, 2.05, 0]} s={[12.4, 0.15, 0.15]} color="#64748b" />
        <Block p={[0, -2.05, 0]} s={[12.4, 0.15, 0.15]} color="#64748b" />
      </group>
    </group>
  );
}

export function MarketplaceEnvironment() {
  return (
    <group>
      {/* Street / Bazaar Pavement */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <boxGeometry args={[36, 0.2, 30]} />
        <meshStandardMaterial color="#a89f91" roughness={0.9} />
      </mesh>

      {/* Bazaar Shop Fronts */}
      <Block p={[0, 4.5, -12]} s={[36, 9, 3]} color="#c29875" />
      <Block p={[0, 4.5, -10.4]} s={[36.5, 0.4, 1.5]} color="#8b5e3c" />

      {/* Book Depot Canopy & Stall (Left) */}
      <group position={[-8, 0, -6]}>
        <Block p={[0, 1.2, 0]} s={[5, 1.4, 2.5]} color="#795548" />
        <Block p={[0, 1.95, 0]} s={[5.4, 0.1, 2.8]} color="#d7ccc8" />
        {/* Books on display */}
        {[-1.6, -0.6, 0.6, 1.6].map((x, i) => (
          <Block key={i} p={[x, 2.2, 0]} s={[0.8, 0.4, 1.4]} color={['#ef4444', '#3b82f6', '#10b981', '#f59e0b'][i % 4]} />
        ))}
        {/* Stall Canopy */}
        <mesh position={[0, 4, 0.6]} rotation={[0.2, 0, 0]}>
          <boxGeometry args={[5.6, 0.1, 3.2]} />
          <meshStandardMaterial color="#f97316" />
        </mesh>
      </group>

      {/* Canteen & Snack Stall (Right) */}
      <group position={[8, 0, -6]}>
        <Block p={[0, 1.2, 0]} s={[5, 1.4, 2.5]} color="#607d8b" />
        <Block p={[0, 1.95, 0]} s={[5.4, 0.1, 2.8]} color="#cfd8dc" />
        {/* Canopy */}
        <mesh position={[0, 4, 0.6]} rotation={[0.2, 0, 0]}>
          <boxGeometry args={[5.6, 0.1, 3.2]} />
          <meshStandardMaterial color="#059669" />
        </mesh>
      </group>

      {/* Street Trees & Benches */}
      <Tree position={[-12, 0, 4]} scale={1.1} />
      <Tree position={[12, 0, 4]} scale={1.2} />
      <Tree position={[0, 0, 8]} scale={1} />
    </group>
  );
}

export function CyberHighwayEnvironment() {
  return (
    <group>
      {/* Glowing Neon Cyber Grid Ground */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <boxGeometry args={[40, 0.2, 60]} />
        <meshStandardMaterial color="#0a051b" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* 3 Neon Lane Strips */}
      {[-4, 0, 4].map((x, i) => (
        <mesh key={i} position={[x, 0.08, 0]}>
          <planeGeometry args={[0.25, 55]} />
          <meshBasicMaterial color="#a855f7" />
        </mesh>
      ))}

      {/* Outer Floating Cyber Pillars */}
      {[-12, 12].map((x) =>
        [-20, -10, 0, 10, 20].map((z, j) => (
          <group key={`${x}-${z}`} position={[x, 0, z]}>
            <Block p={[0, 5, 0]} s={[1.2, 10, 1.2]} color="#1e103a" />
            <mesh position={[0, 10.2, 0]}>
              <sphereGeometry args={[0.5, 12, 12]} />
              <meshBasicMaterial color={j % 2 === 0 ? '#38bdf8' : '#ec4899'} />
            </mesh>
          </group>
        ))
      )}
    </group>
  );
}

