'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef, type RefObject } from 'react';
import * as THREE from 'three';

export type WalkBox = { minX: number; maxX: number; minZ: number; maxZ: number };
export type WalkPoint = { id: string; x: number; z: number; radius: number; prompt: string };
export type SitTarget = {
  x: number;
  z: number;
  radius: number;
  prompt: string;
  seat: THREE.Vector3;
  yaw: number;
  pitch: number;
};

const EYE = 1.62;
const RADIUS = 0.28;
const SPEED = 2.35;

function lerpAngle(from: number, to: number, t: number) {
  let delta = to - from;
  while (delta > Math.PI) delta -= Math.PI * 2;
  while (delta < -Math.PI) delta += Math.PI * 2;
  return from + delta * t;
}

function blocked(x: number, z: number, blocks: WalkBox[]) {
  return blocks.some((box) => {
    const nearestX = Math.max(box.minX, Math.min(x, box.maxX));
    const nearestZ = Math.max(box.minZ, Math.min(z, box.maxZ));
    const dx = x - nearestX;
    const dz = z - nearestZ;
    return dx * dx + dz * dz < RADIUS * RADIUS;
  });
}

function release(x: number, z: number, blocks: WalkBox[]) {
  let px = x;
  let pz = z;
  for (let pass = 0; pass < 3; pass += 1) {
    let moved = false;
    for (const box of blocks) {
      const nearestX = Math.max(box.minX, Math.min(px, box.maxX));
      const nearestZ = Math.max(box.minZ, Math.min(pz, box.maxZ));
      const dx = px - nearestX;
      const dz = pz - nearestZ;
      const distanceSq = dx * dx + dz * dz;
      if (distanceSq >= RADIUS * RADIUS) continue;
      if (distanceSq > 1e-8) {
        const distance = Math.sqrt(distanceSq);
        const push = RADIUS - distance + 0.02;
        px += (dx / distance) * push;
        pz += (dz / distance) * push;
      } else {
        const left = px - box.minX;
        const right = box.maxX - px;
        const south = pz - box.minZ;
        const north = box.maxZ - pz;
        const nearest = Math.min(left, right, south, north);
        if (nearest === left) px = box.minX - RADIUS - 0.02;
        else if (nearest === right) px = box.maxX + RADIUS + 0.02;
        else if (nearest === south) pz = box.minZ - RADIUS - 0.02;
        else pz = box.maxZ + RADIUS + 0.02;
      }
      moved = true;
    }
    if (!moved) break;
  }
  return [px, pz] as const;
}

export function FirstPersonWalker({
  spawn,
  blocks,
  contains,
  paused,
  suspended,
  seated,
  collected,
  points,
  sit,
  enteredZ,
  onEntered,
  onLocate,
  onSit,
  onStand,
  onTogglePause,
  onInteract,
  onPrompt,
  onMove,
  poseRef,
}: {
  spawn: [number, number, number];
  blocks: WalkBox[];
  contains: (x: number, z: number) => boolean;
  paused: boolean;
  suspended?: boolean;
  seated: boolean;
  collected: string[];
  points: WalkPoint[];
  sit?: SitTarget | null;
  enteredZ?: number | null;
  onEntered?: () => void;
  onLocate?: () => void;
  onSit?: () => void;
  onStand?: () => void;
  onTogglePause?: () => void;
  onInteract?: (id: string) => void;
  onPrompt: (text: string) => void;
  onMove?: (x: number, z: number) => void;
  poseRef: RefObject<HTMLDivElement | null>;
}) {
  const { camera, gl } = useThree();
  const keys = useRef<Record<string, boolean>>({});
  const yaw = useRef(0);
  const pitch = useRef(-0.04);
  const velocityY = useRef(0);
  const mode = useRef<'walk' | 'sit' | 'seated' | 'stand'>('walk');
  const saved = useRef<{ x: number; y: number; z: number; yaw: number; pitch: number } | null>(null);
  const anim = useRef<{ t: number; from: THREE.Vector3; yaw: number; pitch: number; to: THREE.Vector3; yawTo: number; pitchTo: number } | null>(null);
  const entered = useRef(false);
  const located = useRef(false);
  const spawnRef = useRef(spawn);
  const lastMove = useRef({ x: spawn[0], z: spawn[2] });
  const seatedProp = useRef(seated);
  const pausedProp = useRef(paused);
  const suspendedProp = useRef(!!suspended);
  const collectedRef = useRef(collected);
  const pointsRef = useRef(points);
  const blocksRef = useRef(blocks);
  const sitRef = useRef(sit);
  const containsRef = useRef(contains);
  const callbacks = useRef({ onEntered, onLocate, onSit, onStand, onTogglePause, onInteract, onPrompt, onMove });
  seatedProp.current = seated;
  pausedProp.current = paused;
  suspendedProp.current = !!suspended;
  collectedRef.current = collected;
  pointsRef.current = points;
  blocksRef.current = blocks;
  sitRef.current = sit;
  containsRef.current = contains;
  callbacks.current = { onEntered, onLocate, onSit, onStand, onTogglePause, onInteract, onPrompt, onMove };

  useEffect(() => {
    const start = spawnRef.current;
    camera.position.set(start[0], start[1], start[2]);
    camera.rotation.order = 'YXZ';
    const coarse =
      typeof window !== 'undefined'
      && (window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window);

    const tryInteract = () => {
      if (mode.current !== 'walk' || pausedProp.current || suspendedProp.current) return;
      const x = camera.position.x;
      const z = camera.position.z;
      const seat = sitRef.current;
      if (seat && Math.hypot(x - seat.x, z - seat.z) < seat.radius) {
        saved.current = { x, y: camera.position.y, z, yaw: yaw.current, pitch: pitch.current };
        anim.current = { t: 0, from: camera.position.clone(), yaw: yaw.current, pitch: pitch.current, to: seat.seat.clone(), yawTo: seat.yaw, pitchTo: seat.pitch };
        mode.current = 'sit';
        if (document.pointerLockElement) document.exitPointerLock();
        callbacks.current.onPrompt('');
        return;
      }
      for (const point of pointsRef.current) {
        if (collectedRef.current.includes(point.id)) continue;
        if (Math.hypot(x - point.x, z - point.z) < point.radius) {
          callbacks.current.onInteract?.(point.id);
          break;
        }
      }
    };

    const applyLook = (dx: number, dy: number) => {
      if (mode.current !== 'walk' || pausedProp.current || suspendedProp.current) return;
      if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) return;
      yaw.current -= dx * 0.0022;
      pitch.current = THREE.MathUtils.clamp(pitch.current - dy * 0.0022, -1.05, 1.05);
    };

    const down = (event: KeyboardEvent) => {
      if (event.repeat) return;
      const typing = event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement;
      const movement = event.code === 'KeyW' || event.code === 'KeyA' || event.code === 'KeyS' || event.code === 'KeyD' || event.code === 'ArrowUp' || event.code === 'ArrowDown' || event.code === 'ArrowLeft' || event.code === 'ArrowRight' || event.code === 'Escape' || event.code === 'KeyE';
      if (!typing && movement) event.preventDefault();
      keys.current[event.code] = true;
      if (event.code === 'Escape') {
        if (typing || suspendedProp.current) return;
        if (mode.current === 'sit' && saved.current) {
          const pose = saved.current;
          anim.current = { t: 0, from: camera.position.clone(), yaw: yaw.current, pitch: pitch.current, to: new THREE.Vector3(pose.x, pose.y, pose.z), yawTo: pose.yaw, pitchTo: pose.pitch };
          mode.current = 'stand';
          if (document.pointerLockElement) document.exitPointerLock();
          return;
        }
        if (mode.current === 'seated' || seatedProp.current) {
          callbacks.current.onStand?.();
          if (document.pointerLockElement) document.exitPointerLock();
          return;
        }
        if (mode.current === 'walk' || mode.current === 'stand') {
          callbacks.current.onTogglePause?.();
          if (document.pointerLockElement) document.exitPointerLock();
        }
        return;
      }
      if (event.code === 'KeyE' && !typing) tryInteract();
    };
    const up = (event: KeyboardEvent) => { keys.current[event.code] = false; };
    const clearKeys = () => { keys.current = {}; };
    const hold = (event: Event) => {
      const detail = (event as CustomEvent<{ code?: string; down?: boolean }>).detail;
      if (!detail?.code) return;
      const wasDown = !!keys.current[detail.code];
      keys.current[detail.code] = !!detail.down;
      if (detail.code === 'KeyE' && detail.down && !wasDown) tryInteract();
    };
    const lookMouse = (event: MouseEvent) => {
      if (document.pointerLockElement !== gl.domElement) return;
      applyLook(event.movementX, event.movementY);
    };
    const lookTouch = (event: Event) => {
      const detail = (event as CustomEvent<{ dx?: number; dy?: number }>).detail;
      if (detail?.dx == null || detail?.dy == null) return;
      applyLook(detail.dx, detail.dy);
    };
    const onClick = () => {
      if (coarse) return;
      if (mode.current === 'walk' && !pausedProp.current && !suspendedProp.current && document.pointerLockElement !== gl.domElement) {
        void gl.domElement.requestPointerLock();
      }
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    window.addEventListener('blur', clearKeys);
    document.addEventListener('visibilitychange', clearKeys);
    window.addEventListener('saferon-hold', hold as EventListener);
    window.addEventListener('saferon-look', lookTouch as EventListener);
    window.addEventListener('mousemove', lookMouse);
    gl.domElement.addEventListener('click', onClick);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
      window.removeEventListener('blur', clearKeys);
      document.removeEventListener('visibilitychange', clearKeys);
      window.removeEventListener('saferon-hold', hold as EventListener);
      window.removeEventListener('saferon-look', lookTouch as EventListener);
      window.removeEventListener('mousemove', lookMouse);
      gl.domElement.removeEventListener('click', onClick);
    };
  }, [camera, gl]);

  useEffect(() => {
    if (suspended && document.pointerLockElement) document.exitPointerLock();
  }, [suspended]);

  useEffect(() => {
    if (!seated && mode.current === 'seated' && saved.current) {
      const pose = saved.current;
      anim.current = {
        t: 0,
        from: camera.position.clone(),
        yaw: yaw.current,
        pitch: pitch.current,
        to: new THREE.Vector3(pose.x, pose.y, pose.z),
        yawTo: pose.yaw,
        pitchTo: pose.pitch,
      };
      mode.current = 'stand';
    }
  }, [seated, camera]);

  useFrame((_, delta) => {
    const step = Math.min(delta, 0.05);
    const publish = () => {
      const node = poseRef.current;
      if (!node) return;
      node.dataset.x = camera.position.x.toFixed(2);
      node.dataset.y = camera.position.y.toFixed(2);
      node.dataset.z = camera.position.z.toFixed(2);
      node.dataset.mode = mode.current;
    };
    if (mode.current === 'sit' || mode.current === 'stand') {
      const clip = anim.current;
      if (!clip) { publish(); return; }
      clip.t = Math.min(1, clip.t + step / 0.8);
      const k = clip.t * clip.t * (3 - 2 * clip.t);
      camera.position.lerpVectors(clip.from, clip.to, k);
      yaw.current = lerpAngle(clip.yaw, clip.yawTo, k);
      pitch.current = clip.pitch + (clip.pitchTo - clip.pitch) * k;
      camera.rotation.y = yaw.current;
      camera.rotation.x = pitch.current;
      if (clip.t >= 1 && mode.current === 'sit') {
        mode.current = 'seated';
        callbacks.current.onSit?.();
      }
      if (clip.t >= 1 && mode.current === 'stand') mode.current = 'walk';
      publish();
      return;
    }
    if (mode.current === 'seated' || pausedProp.current || suspendedProp.current) {
      camera.rotation.y = yaw.current;
      camera.rotation.x = pitch.current;
      publish();
      return;
    }
    const forward = new THREE.Vector3(-Math.sin(yaw.current), 0, -Math.cos(yaw.current));
    const right = new THREE.Vector3(Math.cos(yaw.current), 0, -Math.sin(yaw.current));
    const move = new THREE.Vector3();
    if (keys.current.KeyW || keys.current.ArrowUp) move.add(forward);
    if (keys.current.KeyS || keys.current.ArrowDown) move.sub(forward);
    if (keys.current.KeyD || keys.current.ArrowRight) move.add(right);
    if (keys.current.KeyA || keys.current.ArrowLeft) move.sub(right);
    if (move.lengthSq() > 0) {
      move.normalize().multiplyScalar(SPEED * step);
      const nextX = camera.position.x + move.x;
      const nextZ = camera.position.z + move.z;
      const boxes = blocksRef.current;
      const inside = containsRef.current;
      if (inside(nextX, camera.position.z) && !blocked(nextX, camera.position.z, boxes)) camera.position.x = nextX;
      if (inside(camera.position.x, nextZ) && !blocked(camera.position.x, nextZ, boxes)) camera.position.z = nextZ;
      if (blocked(camera.position.x, camera.position.z, boxes)) {
        const [freedX, freedZ] = release(camera.position.x, camera.position.z, boxes);
        if (inside(freedX, freedZ)) {
          camera.position.x = freedX;
          camera.position.z = freedZ;
        }
      }
    }
    velocityY.current = Math.max(-8, velocityY.current - 18 * step);
    camera.position.y = Math.max(EYE, camera.position.y + velocityY.current * step);
    if (camera.position.y === EYE) velocityY.current = 0;
    camera.rotation.order = 'YXZ';
    camera.rotation.y = yaw.current;
    camera.rotation.x = pitch.current;
    if (enteredZ != null && !entered.current && camera.position.z < enteredZ) {
      entered.current = true;
      callbacks.current.onEntered?.();
    }
    const x = camera.position.x;
    const z = camera.position.z;
    if (Math.hypot(x - lastMove.current.x, z - lastMove.current.z) > 0.2) {
      lastMove.current = { x, z };
      callbacks.current.onMove?.(x, z);
    }
    const seat = sitRef.current;
    let prompt = '';
    if (seat && Math.hypot(x - seat.x, z - seat.z) < seat.radius) {
      prompt = seat.prompt;
      if (!located.current) {
        located.current = true;
        callbacks.current.onLocate?.();
      }
    } else {
      for (const point of pointsRef.current) {
        if (collectedRef.current.includes(point.id)) continue;
        if (Math.hypot(x - point.x, z - point.z) < point.radius) prompt = point.prompt;
      }
    }
    callbacks.current.onPrompt(prompt);
    publish();
  });

  return null;
}
