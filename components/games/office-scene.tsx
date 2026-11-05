'use client';

import { Canvas } from '@react-three/fiber';
import { RoundedBox, useTexture } from '@react-three/drei';
import { Suspense, useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import * as THREE from 'three';
import { FirstPersonWalker } from '@/components/games/first-person-walker';
import { OFFICE_MODELS, OfficeProp } from '@/components/games/office-props';
import { MobileControls, useTouchPlay } from '@/components/nayapur/mobile-controls';

type Solid = { x: number; z: number; w: number; d: number; h?: number; y?: number; color?: string; partition?: boolean; prop?: boolean };
type Box = { minX: number; maxX: number; minZ: number; maxZ: number };

const EYE = 1.62;

const SOLIDS: Solid[] = [
  { x: -4.05, z: 5.48, w: 6.05, d: 0.24, color: '#2a3142' },
  { x: 4.05, z: 5.48, w: 6.05, d: 0.24, color: '#2a3142' },
  { x: 0, z: -6.95, w: 14.15, d: 0.24, color: '#2a3142' },
  { x: -7.05, z: -0.75, w: 0.24, d: 12.5, color: '#2a3142' },
  { x: 7.05, z: -0.75, w: 0.24, d: 12.5, color: '#2a3142' },
  { x: -4.2, z: 0.1, w: 5.7, d: 0.18, partition: true },
  { x: -4.2, z: 3.5, w: 5.7, d: 0.18, partition: true },
  { x: -1.32, z: 0.62, w: 0.16, d: 1.04, partition: true },
  { x: -1.32, z: 3.4, w: 0.16, d: 0.2, partition: true },
  { x: 4.15, z: -1.48, w: 5.8, d: 0.18, partition: true },
  { x: 4.15, z: -6.28, w: 5.8, d: 0.18, partition: true },
  { x: 1.32, z: -5.15, w: 0.16, d: 2.1, partition: true },
  { x: 1.32, z: -1.95, w: 0.16, d: 0.85, partition: true },
  { x: -4.2, z: 1.5, w: 1.6, d: 0.8, h: 0.75, y: 0.38, prop: true },
  { x: 4.3, z: -4.3, w: 2.5, d: 1.15, h: 0.76, y: 0.38, prop: true },
  { x: -5.85, z: 1.15, w: 0.5, d: 0.7, h: 1.3, y: 0.65, prop: true },
  { x: -2.7, z: -6.2, w: 0.7, d: 0.9, h: 1.9, y: 0.95, prop: true },
  { x: 2.7, z: -6.2, w: 0.7, d: 0.9, h: 1.9, y: 0.95, prop: true },
  { x: 3.5, z: 3.7, w: 0.55, d: 0.65, h: 0.35, y: 0.18, prop: true },
  { x: 5.6, z: 4.4, w: 0.4, d: 0.45, h: 1.35, y: 0.68, prop: true },
  { x: 5.1, z: -5.95, w: 1.45, d: 0.5, h: 1.85, y: 0.92, prop: true },
  { x: 6.55, z: -3.2, w: 0.4, d: 1.1, h: 1.8, y: 0.9, prop: true },
];

function bounds(solid: Solid): Box {
  return {
    minX: solid.x - solid.w / 2,
    maxX: solid.x + solid.w / 2,
    minZ: solid.z - solid.d / 2,
    maxZ: solid.z + solid.d / 2,
  };
}

const BLOCKS = SOLIDS.map(bounds);

function indoors(x: number, z: number) {
  const inside = x > -6.9 && x < 6.9 && z > -6.8 && z < 5.35;
  const apron = x > -1.45 && x < 1.45 && z >= 5.35 && z < 8.1;
  return inside || apron;
}

const WORKSTATION = { x: -4.2, z: 2.35 };
const SEAT = new THREE.Vector3(-4.2, EYE, 2.35);
const PAPER = { x: -5.85, z: 2.05, id: 'printed', prompt: 'inspect the printed vendor master' };
const BOARD = { x: 5.1, z: -5.25, id: 'whiteboard', prompt: 'read the meeting-room board' };
const USB = { x: 0.15, z: -5.45, id: 'usb', prompt: 'look at the unlabelled USB' };

type Objective = { label: string; done: boolean };

function Sign({ text, position, rotation }: { text: string; position: [number, number, number]; rotation: [number, number, number] }) {
  const map = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const context = canvas.getContext('2d');
    if (!context) return null;
    context.fillStyle = '#1d4e89';
    context.fillRect(0, 0, 512, 128);
    context.fillStyle = '#ffffff';
    context.font = '600 72px sans-serif';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, 256, 68);
    return new THREE.CanvasTexture(canvas);
  }, [text]);
  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[1.35, 0.34]} />
      <meshBasicMaterial map={map ?? undefined} />
    </mesh>
  );
}

function Building() {
  const city = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const context = canvas.getContext('2d');
    if (!context) return null;
    const sky = context.createLinearGradient(0, 0, 0, 512);
    sky.addColorStop(0, '#0b1630');
    sky.addColorStop(1, '#24324a');
    context.fillStyle = sky;
    context.fillRect(0, 0, 1024, 512);
    for (let i = 0; i < 28; i += 1) {
      const height = 80 + ((i * 97) % 280);
      const x = i * 36;
      context.fillStyle = '#121826';
      context.fillRect(x, 512 - height, 30, height);
      context.fillStyle = '#e8c56b';
      for (let y = 512 - height + 8; y < 500; y += 14) {
        for (let wx = x + 4; wx < x + 26; wx += 8) {
          if (((i + y + wx) % 3) !== 0) context.fillRect(wx, y, 3, 5);
        }
      }
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  return (
    <>
      <OfficeFloor />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 6.6]} receiveShadow>
        <planeGeometry args={[3.2, 3.2]} />
        <meshStandardMaterial color="#6d737c" roughness={0.95} />
      </mesh>
      <mesh position={[0, 2.35, -6.82]}>
        <planeGeometry args={[14, 4.4]} />
        <meshBasicMaterial map={city ?? undefined} />
      </mesh>
      {SOLIDS.map((solid) => (
        <OfficeWall key={`${solid.x}-${solid.z}-${solid.w}`} solid={solid} />
      ))}
      <mesh position={[0, 3.15, -0.6]}>
        <boxGeometry args={[14.4, 0.12, 13.2]} />
        <meshStandardMaterial color="#161b24" />
      </mesh>
      {[-2.2, 2.2].map((x) => (
        <mesh key={x} position={[x, 2.95, 1]}>
          <boxGeometry args={[1.6, 0.05, 0.16]} />
          <meshStandardMaterial color="#f4f7ff" emissive="#dfe7ff" emissiveIntensity={0.7} />
        </mesh>
      ))}
      <OfficeProp url={OFFICE_MODELS.desk} position={[-4.2, 0, 1.5]} />
      <OfficeProp url={OFFICE_MODELS.monitor} position={[-4.2, 0.75, 1.62]} />
      <OfficeProp url={OFFICE_MODELS.keyboard} position={[-4.2, 0.75, 1.82]} />
      <OfficeProp url={OFFICE_MODELS.mouse} position={[-3.92, 0.75, 1.8]} />
      <OfficeProp url={OFFICE_MODELS.lamp} position={[-3.55, 0.75, 1.35]} />
      <OfficeProp url={OFFICE_MODELS.tower} position={[-3.4, 0, 1.35]} />
      <OfficeProp url={OFFICE_MODELS.chair} position={[-4.2, 0, 2.95]} rotation={[0, Math.PI, 0]} />
      <OfficeProp url={OFFICE_MODELS.cabinet} position={[-5.85, 0, 1.15]} />
      <OfficeProp url={OFFICE_MODELS.papers} position={[-5.85, 1.3, 1.15]} />
      <OfficeProp url={OFFICE_MODELS.plant} position={[-6.2, 0, 2.85]} />
      <OfficeProp url={OFFICE_MODELS.printer} position={[3.5, 0, 3.7]} />
      <OfficeProp url={OFFICE_MODELS.bin} position={[3.05, 0, 4.25]} />
      <OfficeProp url={OFFICE_MODELS.cooler} position={[5.6, 0, 4.4]} />
      <OfficeProp url={OFFICE_MODELS.rack} position={[-2.7, 0, -6.2]} />
      <OfficeProp url={OFFICE_MODELS.rack} position={[2.7, 0, -6.2]} rotation={[0, Math.PI, 0]} />
      <OfficeProp url={OFFICE_MODELS.board} position={[5.1, 0, -5.95]} />
      <OfficeProp url={OFFICE_MODELS.laptop} position={[4.3, 0.78, -4.3]} />
      <OfficeProp url={OFFICE_MODELS.shelf} position={[6.55, 0, -3.2]} rotation={[0, -Math.PI / 2, 0]} />
      <group position={[4.3, 0, -4.3]}>
        <RoundedBox args={[2.4, 0.08, 1.1]} position={[0, 0.74, 0]} radius={0.04} castShadow receiveShadow>
          <meshStandardMaterial color="#4a4036" />
        </RoundedBox>
      </group>
      <Sign text="Finance" position={[-1.15, 2.25, 2.05]} rotation={[0, Math.PI / 2, 0]} />
      <Sign text="Meeting" position={[1.15, 2.25, -3.2]} rotation={[0, -Math.PI / 2, 0]} />
      <Sign text="Servers" position={[0, 2.35, -6.7]} rotation={[0, 0, 0]} />
    </>
  );
}

function OfficeFloor() {
  const texture = useTexture('/textures/office/laminate.jpg');
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 6);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -0.6]} receiveShadow>
      <planeGeometry args={[16, 16]} />
      <meshStandardMaterial map={texture} color="#b7b1a6" roughness={0.86} />
    </mesh>
  );
}

function OfficeWall({ solid }: { solid: Solid }) {
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

export default function OfficeScene({
  seated,
  collected,
  onSit,
  onStand,
  onCollect,
  onEntered,
  onLocate,
  objectives,
}: {
  seated: boolean;
  collected: string[];
  onSit: () => void;
  onStand: () => void;
  onCollect: (id: string) => void;
  onEntered: () => void;
  onLocate: () => void;
  objectives: Objective[];
}) {
  const touch = useTouchPlay();
  const [paused, setPaused] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [locked, setLocked] = useState(false);
  const lastPrompt = useRef('');
  const poseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sync = () => setLocked(document.pointerLockElement !== null);
    document.addEventListener('pointerlockchange', sync);
    return () => document.removeEventListener('pointerlockchange', sync);
  }, []);

  useEffect(() => {
    if (seated) setPaused(false);
  }, [seated]);

  return (
    <div ref={poseRef} data-player="office" className="absolute inset-0 touch-none overscroll-none bg-black">
      <Canvas
        shadows={{ type: THREE.PCFShadowMap }}
        camera={{ position: [0, EYE, 7.05], fov: 68 }}
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
        <hemisphereLight args={['#e7eefc', '#3a332c', 0.4]} />
        <directionalLight
          position={[6, 9, 4]}
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
        <pointLight position={[0, 2.7, 0.4]} intensity={18} distance={18} color="#f4f7ff" />
        <pointLight position={[-4.2, 2.5, 2]} intensity={12} distance={10} color="#f4f7ff" />
        <pointLight position={[4.2, 2.5, -3.6]} intensity={10} distance={10} color="#f4f7ff" />
        <pointLight position={[0, 1.6, -5.4]} intensity={8} distance={7} color="#9fd0ff" />
        <FirstPersonWalker
          spawn={[0, EYE, 7.05]}
          blocks={BLOCKS}
          contains={indoors}
          paused={paused}
          seated={seated}
          collected={collected}
          sit={{
            x: WORKSTATION.x,
            z: WORKSTATION.z,
            radius: 1.2,
            prompt: touch ? 'Tap Use to sit at the workstation' : 'Press E to use workstation',
            seat: SEAT,
            yaw: 0,
            pitch: -0.18,
          }}
          points={[
            { ...PAPER, radius: 0.85, prompt: touch ? 'Tap Use · paper clue' : PAPER.prompt },
            { ...BOARD, radius: 0.85, prompt: touch ? 'Tap Use · notice board' : BOARD.prompt },
            { ...USB, radius: 0.85, prompt: touch ? 'Tap Use · USB stick' : USB.prompt },
          ]}
          enteredZ={5.2}
          onEntered={onEntered}
          onLocate={onLocate}
          onSit={onSit}
          onStand={onStand}
          onTogglePause={() => setPaused((current) => !current)}
          onInteract={onCollect}
          onPrompt={(text) => {
            if (text !== lastPrompt.current) {
              lastPrompt.current = text;
              setPrompt(text);
            }
          }}
          poseRef={poseRef}
        />
        <Suspense fallback={null}>
          <Building />
        </Suspense>
      </Canvas>
      {!seated && (
        <>
          <div className="pointer-events-none absolute left-3 top-3 max-w-[min(100%-1.5rem,16rem)] rounded-2xl bg-[#0c121a]/85 p-3 text-xs text-[#d5deea] sm:left-4 sm:top-4 sm:max-w-xs">
            <p className="text-[10px] tracking-[0.14em] text-[#93c5fd]">FLOOR · SIM</p>
            <ul className="mt-2 space-y-1">
              {objectives.map((item) => <li key={item.label} className={item.done ? 'text-[#86efac]' : ''}>{item.done ? '✓' : '○'} {item.label}</li>)}
            </ul>
          </div>
          <p className="pointer-events-none absolute right-3 top-3 text-[11px] text-[#b7c3d6] sm:right-4 sm:top-4 sm:text-xs">
            {touch ? 'Stick · drag look · Use' : 'Click to look · WASD · E · Esc'}
          </p>
          {locked && !paused && !touch && <div className="pointer-events-none absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/80" />}
          {prompt && !paused && (
            <div className={`pointer-events-none absolute left-1/2 z-10 -translate-x-1/2 rounded-full bg-black/75 px-4 py-2 text-center text-sm text-white ${touch ? 'bottom-44' : 'bottom-8'}`}>
              {prompt}
            </div>
          )}
          {!touch && !locked && !paused && !prompt && (
            <div className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-4 py-2 text-sm text-white">Click the building to look around</div>
          )}
          <MobileControls
            visible={!paused}
            canInteract={!!prompt}
            lookEnabled={!paused}
            interactLabel="Use"
            showRun={false}
          />
        </>
      )}
      {paused && !seated && (
        <div className="absolute inset-0 z-10 grid place-items-center bg-black/65">
          <div className="rounded-2xl bg-[#121a28] p-6 text-center">
            <h2 className="text-xl font-semibold">Paused</h2>
            <p className="mt-2 text-sm text-[#b7c3d6]">The office stays where you left it.</p>
            <button onClick={() => setPaused(false)} className="mt-4 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black">Resume</button>
          </div>
        </div>
      )}
    </div>
  );
}
