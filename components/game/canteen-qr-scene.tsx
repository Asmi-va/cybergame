'use client';

import { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrthographicCamera } from '@react-three/drei';
import * as THREE from 'three';
import { MarketplaceEnvironment } from './environments';
import { Character, Block } from './campus';

function InteractiveKidAndCanteen({
  hasReachedCanteen,
  isScanning,
  onWalkComplete,
}: {
  hasReachedCanteen: boolean;
  isScanning: boolean;
  onWalkComplete: () => void;
}) {
  const kidRef = useRef<THREE.Group>(null);
  const [pos, setPos] = useState({ x: -4, z: 6 });
  const [isWalking, setIsWalking] = useState(false);

  // Target coordinates for Canteen Counter: x: 6.2, z: -4.5
  const targetX = 6.2;
  const targetZ = -4.5;

  useFrame((_, delta) => {
    if (!kidRef.current) return;

    if (!hasReachedCanteen) {
      // Walk towards canteen
      const dx = targetX - pos.x;
      const dz = targetZ - pos.z;
      const dist = Math.hypot(dx, dz);

      if (dist > 0.15) {
        setIsWalking(true);
        const step = Math.min(delta * 2.8, dist);
        const nx = pos.x + (dx / dist) * step;
        const nz = pos.z + (dz / dist) * step;
        setPos({ x: nx, z: nz });
        kidRef.current.position.set(nx, 0.08, nz);
        kidRef.current.rotation.y = THREE.MathUtils.lerp(
          kidRef.current.rotation.y,
          Math.atan2(dx, dz),
          0.15
        );
      } else {
        setIsWalking(false);
        onWalkComplete();
      }
    } else {
      // Reached canteen, turn to counter
      kidRef.current.rotation.y = THREE.MathUtils.lerp(kidRef.current.rotation.y, -Math.PI / 2, 0.1);
      // Breathing idle bobbing
      kidRef.current.position.y = 0.08 + Math.sin(Date.now() * 0.003) * 0.03;
    }
  });

  return (
    <group>
      {/* 3D Student Detective */}
      <group ref={kidRef} position={[pos.x, 0.08, pos.z]}>
        <Character shirt="#0284c7" backpack animated={isWalking} />

        {/* Smartphone in hand when scanning */}
        {isScanning && (
          <group position={[0.3, 1.25, 0.35]} rotation={[0.4, 0.2, 0]}>
            <Block p={[0, 0, 0]} s={[0.18, 0.32, 0.03]} color="#0f172a" />
            <mesh position={[0, 0, 0.02]}>
              <planeGeometry args={[0.16, 0.28]} />
              <meshBasicMaterial color="#38bdf8" />
            </mesh>
            {/* Green Scanning Cone / Ray */}
            <mesh position={[0, 0, 0.6]} rotation={[Math.PI / 2, 0, 0]}>
              <coneGeometry args={[0.35, 1, 16, 1, true]} />
              <meshBasicMaterial color="#22c55e" transparent opacity={0.4} wireframe />
            </mesh>
          </group>
        )}
      </group>

      {/* 3D QR Code Stand placed on Canteen Counter (x: 8, z: -6) */}
      <group position={[8, 1.95, -5]}>
        {/* Counter Acrylic Stand */}
        <Block p={[0, 0.45, 0]} s={[0.9, 0.9, 0.06]} color="#f8fafc" />
        <Block p={[0, 0.05, 0]} s={[0.95, 0.1, 0.4]} color="#0f172a" />

        {/* QR Code Graphic Texture */}
        <mesh position={[0, 0.45, 0.04]}>
          <planeGeometry args={[0.7, 0.7]} />
          <meshBasicMaterial color="#020617" />
        </mesh>
        <mesh position={[0, 0.45, 0.045]}>
          <planeGeometry args={[0.62, 0.62]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        {/* Tampered sticker peeling effect */}
        <mesh position={[0.1, 0.48, 0.05]} rotation={[0, 0, -0.1]}>
          <planeGeometry args={[0.38, 0.38]} />
          <meshBasicMaterial color="#f59e0b" />
        </mesh>

        {/* Floating Indicator */}
        <mesh position={[0, 1.3, 0]}>
          <sphereGeometry args={[0.18, 12, 12]} />
          <meshBasicMaterial color="#facc15" />
        </mesh>
      </group>
    </group>
  );
}

export default function CanteenQRExperience3D({
  hasReachedCanteen,
  isScanning,
  onWalkComplete,
}: {
  hasReachedCanteen: boolean;
  isScanning: boolean;
  onWalkComplete: () => void;
}) {
  return (
    <div className="w-full h-56 md:h-72 relative rounded-2xl overflow-hidden border border-[#234b45] shadow-2xl mb-4 bg-[#0a1413]">
      <Canvas
        shadows
        dpr={[1, 1.5]}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.15;
        }}
      >
        <OrthographicCamera
          makeDefault
          position={[16, 20, 22]}
          zoom={34}
          near={0.1}
          far={130}
          onUpdate={(c) => c.lookAt(4, 1.5, -2)}
        />
        <ambientLight intensity={0.9} color="#fffbeb" />
        <directionalLight position={[-12, 24, 16]} intensity={3} color="#fef08a" castShadow />
        <fog attach="fog" args={['#a89f91', 35, 95]} />

        <Suspense fallback={null}>
          <MarketplaceEnvironment />
          <InteractiveKidAndCanteen
            hasReachedCanteen={hasReachedCanteen}
            isScanning={isScanning}
            onWalkComplete={onWalkComplete}
          />
        </Suspense>
      </Canvas>

      {/* Dynamic Status Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#071312] via-transparent to-transparent pointer-events-none" />
      <div className="absolute bottom-3 left-4 flex items-center gap-2 text-xs font-bold text-white bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 pointer-events-none">
        <span
          className={`w-2.5 h-2.5 rounded-full ${
            isScanning
              ? 'bg-[#22c55e] animate-ping'
              : hasReachedCanteen
              ? 'bg-[#38bdf8]'
              : 'bg-[#f59e0b] animate-pulse'
          }`}
        />
        {isScanning
          ? 'Scanning Counter QR Code...'
          : hasReachedCanteen
          ? 'Arrived at Canteen Billing Counter'
          : 'Walking across courtyard to Canteen...'}
      </div>
    </div>
  );
}

