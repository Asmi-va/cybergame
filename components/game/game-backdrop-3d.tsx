'use client';

import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrthographicCamera } from '@react-three/drei';
import * as THREE from 'three';
import { MarketplaceEnvironment, LabEnvironment, CyberHighwayEnvironment } from './environments';
import { Character } from './campus';

function SceneLighting({ env }: { env: string }) {
  if (env === 'cyber') {
    return (
      <>
        <ambientLight intensity={0.6} color="#c084fc" />
        <pointLight position={[0, 10, 0]} intensity={4} color="#38bdf8" distance={30} />
        <directionalLight position={[-10, 20, 10]} intensity={2.5} color="#ec4899" />
        <fog attach="fog" args={['#0a051b', 20, 65]} />
      </>
    );
  }
  if (env === 'lab') {
    return (
      <>
        <ambientLight intensity={0.8} color="#e0f2fe" />
        <directionalLight position={[10, 20, 15]} intensity={2.8} color="#ffffff" castShadow />
        <fog attach="fog" args={['#1a202c', 30, 80]} />
      </>
    );
  }
  // Marketplace / Courtyard
  return (
    <>
      <ambientLight intensity={0.9} color="#fffbeb" />
      <directionalLight position={[-12, 22, 14]} intensity={3} color="#fef08a" castShadow />
      <fog attach="fog" args={['#a89f91', 35, 90]} />
    </>
  );
}

function FloatingDetective() {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y = 0.08 + Math.sin(clock.elapsedTime * 2.5) * 0.06;
      ref.current.rotation.y = Math.sin(clock.elapsedTime * 0.8) * 0.35 + 0.2;
    }
  });

  return (
    <group ref={ref} position={[0, 0.08, 0]}>
      <Character shirt="#e11d48" backpack animated={false} />
    </group>
  );
}

export default function GameBackdrop3D({
  environment = 'market',
}: {
  environment?: 'market' | 'lab' | 'cyber';
}) {
  return (
    <div className="w-full h-48 md:h-56 relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl mb-4 bg-black/40">
      <Canvas
        shadows
        dpr={[1, 1.5]}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.1;
        }}
      >
        <OrthographicCamera
          makeDefault
          position={[14, 18, 20]}
          zoom={32}
          near={0.1}
          far={120}
          onUpdate={(c) => c.lookAt(0, 2, 0)}
        />
        <SceneLighting env={environment} />
        <Suspense fallback={null}>
          {environment === 'lab' ? (
            <LabEnvironment />
          ) : environment === 'cyber' ? (
            <CyberHighwayEnvironment />
          ) : (
            <MarketplaceEnvironment />
          )}
          <FloatingDetective />
        </Suspense>
      </Canvas>

      <div className="absolute inset-0 bg-gradient-to-t from-[#0e1817] via-transparent to-transparent pointer-events-none" />
      <div className="absolute bottom-3 left-4 flex items-center gap-2 text-[11px] font-bold text-white/90 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
        3D Real-Time Scene: {environment === 'lab' ? 'Computer Lab Zone' : environment === 'cyber' ? 'Cyber Highway' : 'Marketplace & Courtyard'}
      </div>
    </div>
  );
}

