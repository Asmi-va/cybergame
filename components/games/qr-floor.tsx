'use client';

import { Canvas } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { FirstPersonWalker, type WalkBox, type WalkPoint } from '@/components/games/first-person-walker';
import { OFFICE_MODELS, OfficeProp } from '@/components/games/office-props';
import { MobileControls, useTouchPlay } from '@/components/nayapur/mobile-controls';

type Solid = { x: number; z: number; w: number; d: number; h?: number; y?: number; color?: string; partition?: boolean; prop?: boolean };

const EYE = 1.62;

const SOLIDS: Solid[] = [
  { x: 0, z: 13.05, w: 7.3, d: 0.2, color: '#2a3142' },
  { x: -3.55, z: 10.6, w: 0.2, d: 5.1, color: '#2a3142' },
  { x: 3.55, z: 10.6, w: 0.2, d: 5.1, color: '#2a3142' },
  { x: -2.45, z: 8.15, w: 2.4, d: 0.2, partition: true },
  { x: 2.45, z: 8.15, w: 2.4, d: 0.2, partition: true },
  { x: -4.1, z: 8.05, w: 5.9, d: 0.18, color: '#2a3142' },
  { x: 4.1, z: 8.05, w: 5.9, d: 0.18, color: '#2a3142' },
  { x: -7.05, z: 4.25, w: 0.2, d: 7.6, color: '#2a3142' },
  { x: 7.05, z: 4.25, w: 0.2, d: 7.6, color: '#2a3142' },
  { x: -4.1, z: 4.5, w: 5.9, d: 0.16, partition: true },
  { x: 4.1, z: 4.5, w: 5.9, d: 0.16, partition: true },
  { x: -1.15, z: 0.85, w: 0.16, d: 0.7, partition: true },
  { x: -1.15, z: 4.55, w: 0.16, d: 0.9, partition: true },
  { x: -1.15, z: 7.75, w: 0.16, d: 0.6, partition: true },
  { x: 1.15, z: 0.85, w: 0.16, d: 0.7, partition: true },
  { x: 1.15, z: 4.55, w: 0.16, d: 0.9, partition: true },
  { x: 1.15, z: 7.75, w: 0.16, d: 0.6, partition: true },
  { x: 0, z: -3.45, w: 14.3, d: 0.2, color: '#2a3142' },
  { x: -7.05, z: -1.5, w: 0.2, d: 3.9, color: '#2a3142' },
  { x: 7.05, z: -1.5, w: 0.2, d: 3.9, color: '#2a3142' },
  { x: -4.45, z: 0.4, w: 5.2, d: 0.18, partition: true },
  { x: 4.45, z: 0.4, w: 5.2, d: 0.18, partition: true },
  { x: -2.2, z: 11.55, w: 1.6, d: 0.8, prop: true },
  { x: -2.2, z: 10.85, w: 0.66, d: 0.68, prop: true },
  { x: 2.55, z: 12.15, w: 0.45, d: 0.66, prop: true },
  { x: -5.05, z: 6.35, w: 1.6, d: 0.8, prop: true },
  { x: -6.35, z: 7.25, w: 0.36, d: 0.4, prop: true },
  { x: -5.05, z: 2.15, w: 1.6, d: 0.8, prop: true },
  { x: -6.55, z: 1.15, w: 0.45, d: 1.4, prop: true },
  { x: -5.6, z: 4.15, w: 1.05, d: 0.35, prop: true },
  { x: 5.15, z: 6.35, w: 0.55, d: 0.62, prop: true },
  { x: 6.35, z: 5.3, w: 0.32, d: 0.32, prop: true },
  { x: 5.15, z: 2.15, w: 1.6, d: 0.8, prop: true },
  { x: 6.4, z: 1.2, w: 0.32, d: 0.32, prop: true },
  { x: -2.4, z: -2.15, w: 0.65, d: 0.9, prop: true },
  { x: 2.7, z: -2.15, w: 0.65, d: 0.9, prop: true },
];

function bounds(solid: Solid): WalkBox {
  return {
    minX: solid.x - solid.w / 2,
    maxX: solid.x + solid.w / 2,
    minZ: solid.z - solid.d / 2,
    maxZ: solid.z + solid.d / 2,
  };
}

const BLOCKS = SOLIDS.map(bounds);

export const QR_SCAN: WalkPoint[] = [
  { id: 'r1', x: -1.1, z: 11.0, radius: 0.95, prompt: 'Press E to scan the visitor wifi card' },
  { id: 'r2', x: 2.7, z: 11.55, radius: 0.95, prompt: 'Press E to scan the sticker on the glass' },
  { id: 'o1', x: -3.85, z: 6.35, radius: 0.95, prompt: 'Press E to scan the monitor bezel card' },
  { id: 'o2', x: -5.7, z: 7.45, radius: 0.95, prompt: 'Press E to scan the coffee-point prize' },
  { id: 'm1', x: -3.85, z: 2.15, radius: 0.95, prompt: 'Press E to scan the clicker cradle' },
  { id: 'm2', x: -5.7, z: 0.9, radius: 0.95, prompt: 'Press E to scan the whiteboard corner' },
  { id: 'p1', x: 4.15, z: 6.35, radius: 0.95, prompt: 'Press E to scan the paper-tray card' },
  { id: 'p2', x: 5.9, z: 7.45, radius: 0.95, prompt: 'Press E to scan the driver download notice' },
  { id: 'c1', x: 4.0, z: 1.45, radius: 0.95, prompt: 'Press E to scan the table tent' },
  { id: 'c2', x: 2.2, z: 3.7, radius: 0.95, prompt: 'Press E to scan the door poster' },
  { id: 'h1', x: -2.4, z: -1.15, radius: 0.95, prompt: 'Press E to scan the rack label' },
  { id: 'h2', x: 1.7, z: -0.85, radius: 0.95, prompt: 'Press E to scan the floor sign' },
];

export function qrRoom(x: number, z: number) {
  if (z > 8.05 && Math.abs(x) < 3.4) return 'reception';
  if (z < 0.35 && Math.abs(x) < 6.9) return 'hall';
  if (x < -1.25 && z > 4.55) return 'open';
  if (x < -1.25 && z <= 4.55) return 'meet';
  if (x > 1.25 && z > 4.55) return 'print';
  if (x > 1.25 && z <= 4.55) return 'canteen';
  return 'corridor';
}

function contains(x: number, z: number) {
  if (z > 8.02 && z < 12.9 && Math.abs(x) < 3.4) return true;
  if (z > 0.28 && z <= 8.12 && Math.abs(x) < 6.9) {
    if (z > 7.92 && Math.abs(x) > 1.02) return false;
    return true;
  }
  if (z > -3.28 && z <= 0.55 && Math.abs(x) < 6.9) return true;
  return false;
}

function Wall({ solid }: { solid: Solid }) {
  if (solid.prop) return null;
  if (solid.partition) {
    return (
      <group>
        <mesh position={[solid.x, 0.52, solid.z]} castShadow receiveShadow>
          <boxGeometry args={[solid.w, 1.04, solid.d]} />
          <meshStandardMaterial color="#d5dbe6" roughness={0.62} />
        </mesh>
        <mesh position={[solid.x, 1.9, solid.z]}>
          <boxGeometry args={[solid.w, 1.55, Math.max(0.04, solid.d * 0.45)]} />
          <meshStandardMaterial color="#c5dff3" transparent opacity={0.22} roughness={0.04} metalness={0.08} depthWrite={false} />
        </mesh>
      </group>
    );
  }
  return (
    <mesh position={[solid.x, solid.y ?? 1.55, solid.z]} castShadow receiveShadow>
      <boxGeometry args={[solid.w, solid.h ?? 3.1, solid.d]} />
      <meshStandardMaterial color={solid.color ?? '#3e4758'} roughness={0.78} />
    </mesh>
  );
}

function Floor() {
  const texture = useTexture('/textures/office/laminate.jpg');
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(8, 10);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 4.6]} receiveShadow>
      <planeGeometry args={[16, 18]} />
      <meshStandardMaterial map={texture} color="#b7b1a6" roughness={0.86} />
    </mesh>
  );
}

function qrTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const context = canvas.getContext('2d');
  if (!context) return new THREE.CanvasTexture(canvas);
  context.fillStyle = '#f7f4ee';
  context.fillRect(0, 0, 64, 64);
  context.fillStyle = '#16181d';
  for (let y = 0; y < 8; y += 1) {
    for (let x = 0; x < 8; x += 1) {
      const finder = (x < 3 && y < 3) || (x > 4 && y < 3) || (x < 3 && y > 4);
      if (finder || ((x * 3 + y * 5) % 3) === 0) context.fillRect(x * 8 + 1, y * 8 + 1, 6, 6);
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

const MARKERS: { id: string; position: [number, number, number]; rotation: [number, number, number] }[] = [
  { id: 'r1', position: [-1.7, 0.82, 11.82], rotation: [-0.4, 0, 0] },
  { id: 'r2', position: [3.42, 1.45, 11.55], rotation: [0, -Math.PI / 2, 0] },
  { id: 'o1', position: [-4.55, 1.05, 6.55], rotation: [0, Math.PI / 2, 0] },
  { id: 'o2', position: [-6.15, 1.15, 7.25], rotation: [0, 0.4, 0] },
  { id: 'm1', position: [-4.55, 0.86, 2.05], rotation: [-0.5, 0.2, 0] },
  { id: 'm2', position: [-6.28, 1.35, 1.55], rotation: [0, Math.PI / 2, 0] },
  { id: 'p1', position: [5.15, 0.42, 6.05], rotation: [-0.6, 0, 0] },
  { id: 'p2', position: [6.9, 1.55, 7.15], rotation: [0, -Math.PI / 2, 0] },
  { id: 'c1', position: [4.7, 0.84, 1.85], rotation: [-0.4, 0.3, 0] },
  { id: 'c2', position: [1.32, 1.5, 3.7], rotation: [0, Math.PI / 2, 0] },
  { id: 'h1', position: [-2.05, 1.15, -1.85], rotation: [0, 0, 0] },
  { id: 'h2', position: [1.85, 0.04, -0.85], rotation: [-Math.PI / 2, 0, 0] },
];

function Markers({ done }: { done: string[] }) {
  const map = useMemo(() => qrTexture(), []);
  return (
    <>
      {MARKERS.filter((marker) => !done.includes(marker.id)).map((marker) => (
        <mesh key={marker.id} position={marker.position} rotation={marker.rotation} castShadow>
          <boxGeometry args={[0.16, 0.2, 0.012]} />
          <meshStandardMaterial map={map} roughness={0.45} />
        </mesh>
      ))}
    </>
  );
}

function signTexture(label: string) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const context = canvas.getContext('2d');
  if (!context) return new THREE.CanvasTexture(canvas);
  context.fillStyle = '#1c2430';
  context.fillRect(0, 0, 512, 128);
  context.fillStyle = '#f4f7ff';
  context.font = '600 54px sans-serif';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(label, 256, 68);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function Sign({ text, position, rotation }: { text: string; position: [number, number, number]; rotation: [number, number, number] }) {
  const map = useMemo(() => signTexture(text), [text]);
  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[1.15, 0.28]} />
      <meshBasicMaterial map={map} />
    </mesh>
  );
}

function Building({ done }: { done: string[] }) {
  return (
    <>
      <Floor />
      <mesh position={[0, 3.15, 4.6]}>
        <boxGeometry args={[14.6, 0.12, 16.8]} />
        <meshStandardMaterial color="#161b24" />
      </mesh>
      {SOLIDS.map((solid) => <Wall key={`${solid.x}-${solid.z}-${solid.w}-${solid.d}`} solid={solid} />)}
      <OfficeProp url={OFFICE_MODELS.desk} position={[-2.2, 0, 11.55]} />
      <OfficeProp url={OFFICE_MODELS.monitor} position={[-2.2, 0.75, 11.4]} rotation={[0, Math.PI, 0]} />
      <OfficeProp url={OFFICE_MODELS.keyboard} position={[-2.2, 0.75, 11.2]} rotation={[0, Math.PI, 0]} />
      <OfficeProp url={OFFICE_MODELS.lamp} position={[-1.7, 0.75, 11.4]} />
      <OfficeProp url={OFFICE_MODELS.chair} position={[-2.2, 0, 10.85]} />
      <OfficeProp url={OFFICE_MODELS.cabinet} position={[2.55, 0, 12.15]} />
      <OfficeProp url={OFFICE_MODELS.plant} position={[2.35, 0, 11.35]} />
      <OfficeProp url={OFFICE_MODELS.desk} position={[-5.05, 0, 6.35]} />
      <OfficeProp url={OFFICE_MODELS.monitor} position={[-4.7, 0.75, 6.35]} rotation={[0, Math.PI / 2, 0]} />
      <OfficeProp url={OFFICE_MODELS.keyboard} position={[-4.45, 0.75, 6.35]} rotation={[0, Math.PI / 2, 0]} />
      <OfficeProp url={OFFICE_MODELS.tower} position={[-5.55, 0, 6.7]} />
      <OfficeProp url={OFFICE_MODELS.cooler} position={[-6.35, 0, 7.25]} />
      <OfficeProp url={OFFICE_MODELS.plant} position={[-6.35, 0, 5.55]} />
      <OfficeProp url={OFFICE_MODELS.desk} position={[-5.05, 0, 2.15]} />
      <OfficeProp url={OFFICE_MODELS.laptop} position={[-4.7, 0.75, 2.05]} rotation={[0, 0.6, 0]} />
      <OfficeProp url={OFFICE_MODELS.chair} position={[-4.15, 0, 2.85]} rotation={[0, Math.PI, 0]} />
      <OfficeProp url={OFFICE_MODELS.board} position={[-6.55, 0, 1.15]} rotation={[0, Math.PI / 2, 0]} />
      <OfficeProp url={OFFICE_MODELS.shelf} position={[-5.6, 0, 4.15]} rotation={[0, Math.PI, 0]} />
      <OfficeProp url={OFFICE_MODELS.printer} position={[5.15, 0, 6.35]} rotation={[0, -Math.PI / 2, 0]} />
      <OfficeProp url={OFFICE_MODELS.papers} position={[5.15, 0.34, 6.05]} />
      <OfficeProp url={OFFICE_MODELS.bin} position={[6.35, 0, 5.3]} />
      <OfficeProp url={OFFICE_MODELS.desk} position={[5.15, 0, 2.15]} />
      <OfficeProp url={OFFICE_MODELS.papers} position={[4.7, 0.75, 1.95]} />
      <OfficeProp url={OFFICE_MODELS.bin} position={[6.4, 0, 1.2]} />
      <OfficeProp url={OFFICE_MODELS.cooler} position={[6.2, 0, 3.5]} />
      <OfficeProp url={OFFICE_MODELS.rack} position={[-2.4, 0, -2.15]} />
      <OfficeProp url={OFFICE_MODELS.rack} position={[2.7, 0, -2.15]} />
      <Sign text="Reception" position={[0, 2.35, 8.28]} rotation={[0, Math.PI, 0]} />
      <Sign text="Open office" position={[-1.28, 2.25, 6.5]} rotation={[0, Math.PI / 2, 0]} />
      <Sign text="Meeting" position={[-1.28, 2.25, 2.5]} rotation={[0, Math.PI / 2, 0]} />
      <Sign text="Print" position={[1.28, 2.25, 6.5]} rotation={[0, -Math.PI / 2, 0]} />
      <Sign text="Canteen" position={[1.28, 2.25, 2.5]} rotation={[0, -Math.PI / 2, 0]} />
      <Sign text="Servers" position={[0, 2.35, 0.22]} rotation={[0, 0, 0]} />
      <Markers done={done} />
    </>
  );
}

export default function QrFloor({
  done,
  suspended,
  onScan,
  onRoom,
}: {
  done: string[];
  suspended: boolean;
  onScan: (id: string) => void;
  onRoom: (id: string) => void;
}) {
  const touch = useTouchPlay();
  const [paused, setPaused] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [locked, setLocked] = useState(false);
  const lastPrompt = useRef('');
  const poseRef = useRef<HTMLDivElement>(null);
  const roomRef = useRef('reception');

  useEffect(() => {
    const sync = () => setLocked(document.pointerLockElement !== null);
    document.addEventListener('pointerlockchange', sync);
    return () => document.removeEventListener('pointerlockchange', sync);
  }, []);

  const scanPoints = useMemo(
    () =>
      QR_SCAN.map((point) => ({
        ...point,
        prompt: touch ? point.prompt.replace(/Press E/i, 'Tap Scan').replace(/press E/i, 'tap Scan') : point.prompt,
      })),
    [touch],
  );

  return (
    <div ref={poseRef} data-player="qr" className="absolute inset-0 touch-none overscroll-none bg-black">
      <Canvas
        shadows={{ type: THREE.PCFShadowMap }}
        camera={{ position: [0, EYE, 11.2], fov: 68 }}
        style={{ touchAction: 'none' }}
        onCreated={({ gl }) => {
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.PCFShadowMap;
          gl.domElement.style.touchAction = 'none';
        }}
      >
        <color attach="background" args={['#10151f']} />
        <fog attach="fog" args={['#10151f', 12, 28]} />
        <ambientLight intensity={0.55} />
        <hemisphereLight args={['#d5e4ff', '#2a241c', 0.45]} />
        <directionalLight
          position={[6, 10, 8]}
          intensity={1.35}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-near={1}
          shadow-camera-far={28}
          shadow-camera-left={-12}
          shadow-camera-right={12}
          shadow-camera-top={12}
          shadow-camera-bottom={-12}
          shadow-bias={-0.0004}
        />
        <pointLight position={[0, 2.6, 10.6]} intensity={14} distance={12} color="#f4f7ff" />
        <pointLight position={[-4.2, 2.6, 5.4]} intensity={12} distance={11} color="#f4f7ff" />
        <pointLight position={[4.2, 2.6, 5.4]} intensity={12} distance={11} color="#f4f7ff" />
        <pointLight position={[0, 2.5, -1.6]} intensity={10} distance={12} color="#9fd0ff" />
        <FirstPersonWalker
          spawn={[0, EYE, 11.2]}
          blocks={BLOCKS}
          contains={contains}
          paused={paused}
          suspended={suspended}
          seated={false}
          collected={done}
          points={scanPoints}
          onTogglePause={() => setPaused((current) => !current)}
          onInteract={onScan}
          onPrompt={(text) => {
            if (text !== lastPrompt.current) {
              lastPrompt.current = text;
              setPrompt(text);
            }
          }}
          onMove={(x, z) => {
            const next = qrRoom(x, z);
            if (next !== roomRef.current) {
              roomRef.current = next;
              onRoom(next);
            }
          }}
          poseRef={poseRef}
        />
        <Suspense fallback={null}>
          <Building done={done} />
        </Suspense>
      </Canvas>
      <p className="pointer-events-none absolute right-3 top-3 text-[11px] text-[#b7c3d6] sm:right-4 sm:top-4 sm:text-xs">
        {touch ? 'Stick · drag look · Scan' : 'Click to look · WASD · E · Esc'}
      </p>
      {locked && !paused && !suspended && !touch && <div className="pointer-events-none absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/80" />}
      {prompt && !paused && !suspended && (
        <div className={`pointer-events-none absolute left-1/2 z-10 -translate-x-1/2 rounded-full bg-black/75 px-4 py-2 text-center text-sm text-white ${touch ? 'bottom-44' : 'bottom-8'}`}>
          {prompt}
        </div>
      )}
      {!touch && !locked && !paused && !suspended && !prompt && (
        <div className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-4 py-2 text-sm text-white">Click the floor to look around</div>
      )}
      {!suspended && (
        <MobileControls
          visible={!paused}
          canInteract={!!prompt}
          lookEnabled={!paused && !suspended}
          interactLabel="Scan"
          showRun={false}
        />
      )}
      {paused && (
        <div className="absolute inset-0 z-40 grid place-items-center bg-black/55">
          <button type="button" className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black" onClick={() => setPaused(false)}>Resume</button>
        </div>
      )}
    </div>
  );
}
