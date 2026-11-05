'use client';

import { Canvas } from '@react-three/fiber';
import Link from 'next/link';
import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { BijliMission, type BijliStage } from '@/components/nayapur/bijli-mission';
import { NpcMarker } from '@/components/nayapur/npc-marker';
import { MissionBriefing } from '@/components/nayapur/mission-briefing';
import { OpeningSequence } from '@/components/nayapur/opening-sequence';
import { QuestBeacon, QuestGuidePanel } from '@/components/nayapur/quest-guide';
import { ResidentialStreet, STREET_COLLIDERS, STREET_POINTS } from '@/components/nayapur/residential-street';
import { PARCEL_BEATS, PAYMENT_BEATS, StreetMission } from '@/components/nayapur/street-mission';
import { ThirdPersonController } from '@/components/nayapur/third-person-controller';
import { TutorialOverlay } from '@/components/nayapur/tutorial-overlay';
import { useImmersive } from '@/components/platform/site-shell';
import { playNayapurCue } from '@/lib/nayapur/audio';
import { getGuideTarget } from '@/lib/nayapur/guide';
import { useNayapur } from '@/lib/nayapur/progress';

const SPAWN: [number, number, number] = [0, 0, 14.5];

type SideId = 'gate-note' | null;
type ActiveMissionUi = 'bijli' | 'payment' | 'parcel' | null;

const SIDE_DIALOGUE = {
  'gate-note': {
    title: 'Gate notice',
    lines: ['Colony notice: Beware of fake electricity, payment screenshots, and courier fee links. Confirm only through official apps. — Cyber Safety Club'],
  },
} as const;

export default function NayapurExperience() {
  useImmersive(true);
  const hydrated = useNayapur((s) => s.hydrated);
  const onboarding = useNayapur((s) => s.onboarding);
  const setOnboarding = useNayapur((s) => s.setOnboarding);
  const trust = useNayapur((s) => s.trust);
  const stars = useNayapur((s) => s.stars);
  const soundEnabled = useNayapur((s) => s.soundEnabled);
  const setSoundEnabled = useNayapur((s) => s.setSoundEnabled);
  const missions = useNayapur((s) => s.missions);
  const startMission = useNayapur((s) => s.startMission);

  const [paused, setPaused] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [side, setSide] = useState<SideId>(null);
  const [missionUi, setMissionUi] = useState<ActiveMissionUi>(null);
  const [bijliStage, setBijliStage] = useState<BijliStage | null>(null);
  const [locked, setLocked] = useState(false);
  const [moving, setMoving] = useState(false);
  const [running, setRunning] = useState(false);
  const [pose, setPose] = useState({ x: SPAWN[0], z: SPAWN[2], yaw: 0 });
  const lastPrompt = useRef('');
  const poseRef = useRef<HTMLDivElement>(null);

  const inTutorial = onboarding === 'tutorial';
  const playing = onboarding === 'play';
  const suspended = onboarding === 'opening' || onboarding === 'briefing' || !!side || !!missionUi || !!bijliStage;
  const guideTarget = getGuideTarget(missions);

  useEffect(() => {
    const sync = () => setLocked(document.pointerLockElement !== null);
    document.addEventListener('pointerlockchange', sync);
    return () => document.removeEventListener('pointerlockchange', sync);
  }, []);

  const finishTutorial = useCallback(() => {
    setOnboarding('play');
    playNayapurCue('success', soundEnabled);
  }, [setOnboarding, soundEnabled]);

  if (!hydrated) {
    return (
      <div className="grid h-screen place-items-center bg-[#1a1510] text-[#f3efe7]">
        <p className="text-sm tracking-[0.14em] text-[#f0c27a]">Loading Nayapur…</p>
      </div>
    );
  }

  return (
    <div ref={poseRef} data-player="nayapur" data-x="0.00" data-z="14.50" className="relative h-screen overflow-hidden bg-[#1a1510] text-[#f3efe7]">
      <Canvas
        shadows={{ type: THREE.PCFShadowMap }}
        camera={{ position: [0, 3.2, 13], fov: 55 }}
        onCreated={({ gl }) => {
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.PCFShadowMap;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.08;
        }}
      >
        <color attach="background" args={['#8fa6bc']} />
        <fog attach="fog" args={['#b7c6d6', 22, 48]} />
        <ambientLight intensity={0.52} />
        <hemisphereLight args={['#fff4e0', '#5c5348', 0.58]} />
        <directionalLight
          position={[12, 18, 6]}
          intensity={1.6}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={48}
          shadow-camera-left={-22}
          shadow-camera-right={22}
          shadow-camera-top={22}
          shadow-camera-bottom={-22}
          shadow-bias={-0.0003}
        />
        <Suspense fallback={null}>
          <ResidentialStreet />
          <NpcMarker position={[-1.4, 0, 2.4]} variant="uncle" />
          <NpcMarker position={[-3.2, 0, -4.2]} variant="shopkeeper" rotation={[0, Math.PI * 0.6, 0]} height={1.76} />
          {(playing || inTutorial) && <QuestBeacon target={guideTarget} />}
          <ThirdPersonController
            spawn={SPAWN}
            colliders={STREET_COLLIDERS}
            points={STREET_POINTS}
            paused={paused}
            suspended={suspended && !inTutorial}
            onPrompt={(text) => {
              if (text !== lastPrompt.current) {
                lastPrompt.current = text;
                setPrompt(text);
              }
            }}
            onInteract={(id) => {
              playNayapurCue('tap', soundEnabled);
              if (id === 'uncle') {
                startMission('bijli-bill');
                setBijliStage(missions['bijli-bill']?.completed ? 'done' : 'talk');
                setMissionUi('bijli');
                return;
              }
              if (id === 'shopkeeper') {
                if (!missions['bijli-bill']?.completed) {
                  setSide(null);
                  setPrompt('Finish Uncle’s bijli case before helping Mr. Sharma.');
                  return;
                }
                startMission('payment-aaya');
                setMissionUi('payment');
                return;
              }
              if (id === 'scooter') {
                if (!missions['payment-aaya']?.completed) {
                  setPrompt(missions['bijli-bill']?.completed
                    ? 'Help Mr. Sharma first — then this parcel case unlocks.'
                    : 'Parcel case unlocks after Missions 1 and 2.');
                  return;
                }
                startMission('parcel-stuck');
                setMissionUi('parcel');
                return;
              }
              if (id === 'gate-note') setSide('gate-note');
            }}
            onTogglePause={() => setPaused((value) => !value)}
            onMove={(x, z, yaw) => {
              setPose({ x, z, yaw });
              if (poseRef.current) {
                poseRef.current.dataset.x = x.toFixed(2);
                poseRef.current.dataset.z = z.toFixed(2);
              }
            }}
            onMotion={(state) => {
              setMoving(state.moving);
              setRunning(state.running);
            }}
          />
        </Suspense>
      </Canvas>

      <div className="pointer-events-none absolute left-4 top-4 max-w-sm rounded-2xl bg-[#14110e]/82 p-4">
        <p className="text-[10px] tracking-[0.16em] text-[#f0c27a]">NAYAPUR · CITY LANE</p>
        <h1 className="mt-1 text-xl font-semibold">Operation Real Life</h1>
        <p className="mt-1 text-xs text-[#d9cfc0]">Trust {trust} · Stars {stars}</p>
        <p className="mt-2 text-sm text-[#d9cfc0]">
          {guideTarget
            ? `Next: ${guideTarget.meet} · ${guideTarget.step}`
            : 'Chapter 1 street cases clear. Explore freely.'}
        </p>
      </div>

      <div className="pointer-events-none absolute right-4 top-4 text-right text-xs text-[#e8dfd2]">
        <p>Click to look · WASD · Shift run · E · Esc</p>
        <div className="pointer-events-auto mt-2 flex justify-end gap-3">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="text-[#f0c27a]"
          >
            Sound {soundEnabled ? 'on' : 'off'}
          </button>
          <Link href="/games" className="text-[#f0c27a]">Leave Nayapur</Link>
        </div>
      </div>

      {prompt && !paused && !side && !missionUi && (playing || inTutorial) && (
        <div className="pointer-events-none absolute bottom-28 left-1/2 z-20 -translate-x-1/2 rounded-full bg-black/70 px-4 py-2 text-sm">{prompt}</div>
      )}
      {!locked && !paused && !side && !missionUi && playing && !prompt && (
        <div className="pointer-events-none absolute bottom-28 left-1/2 -translate-x-1/2 rounded-full bg-black/65 px-4 py-2 text-sm">Click the street to look around</div>
      )}

      <QuestGuidePanel
        target={guideTarget}
        playerX={pose.x}
        playerZ={pose.z}
        yaw={pose.yaw}
        visible={(playing || inTutorial) && !paused && !side && !missionUi}
      />

      {onboarding === 'opening' && (
        <OpeningSequence onDone={() => setOnboarding('briefing')} />
      )}

      {onboarding === 'briefing' && (
        <MissionBriefing missions={missions} onContinue={() => setOnboarding('tutorial')} />
      )}

      {inTutorial && (
        <TutorialOverlay
          locked={locked}
          moving={moving}
          running={running}
          nearPrompt={!!prompt}
          onDone={finishTutorial}
        />
      )}

      {side && (
        <div className="absolute inset-0 z-30 grid place-items-end bg-black/35 p-4 sm:place-items-center">
          <div className="w-full max-w-xl rounded-2xl bg-[#1c1712] p-5">
            <p className="text-xs tracking-[0.14em] text-[#f0c27a]">{SIDE_DIALOGUE[side].title}</p>
            {SIDE_DIALOGUE[side].lines.map((line) => (
              <p key={line} className="mt-3 text-sm leading-relaxed text-[#efe7da]">{line}</p>
            ))}
            <button
              onClick={() => { playNayapurCue('tap', soundEnabled); setSide(null); }}
              className="mt-4 rounded-full bg-[#f0c27a] px-4 py-2 text-sm font-semibold text-[#1c140c]"
            >
              Step back
            </button>
          </div>
        </div>
      )}

      {missionUi === 'bijli' && bijliStage && (
        <BijliMission
          stage={bijliStage}
          onStage={setBijliStage}
          onClose={() => { setMissionUi(null); setBijliStage(null); }}
        />
      )}

      {missionUi === 'payment' && (
        <StreetMission
          missionId="payment-aaya"
          reward={{ trust: 14, stars: 2, coins: 50 }}
          beats={missions['payment-aaya']?.completed
            ? [{ kind: 'done', title: 'Already clear', lines: ['Mr. Sharma already learned the screenshot trick. Check the scooter for Mission 3.'] }]
            : PAYMENT_BEATS}
          onClose={() => setMissionUi(null)}
        />
      )}

      {missionUi === 'parcel' && (
        <StreetMission
          missionId="parcel-stuck"
          reward={{ trust: 16, stars: 3, coins: 60 }}
          beats={missions['parcel-stuck']?.completed
            ? [{ kind: 'done', title: 'Already clear', lines: ['This parcel trap is solved. Walk the lane — more of Nayapur comes next.'] }]
            : PARCEL_BEATS}
          onClose={() => setMissionUi(null)}
        />
      )}

      {paused && (
        <div className="absolute inset-0 z-20 grid place-items-center bg-black/55">
          <button className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black" onClick={() => setPaused(false)}>Resume</button>
        </div>
      )}
    </div>
  );
}
