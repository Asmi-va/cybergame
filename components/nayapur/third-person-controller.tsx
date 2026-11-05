'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { AnimatedPlayer } from '@/components/nayapur/animated-player';

export type Collider = { minX: number; maxX: number; minZ: number; maxZ: number };
export type InteractPoint = { id: string; x: number; z: number; radius: number; prompt: string };

const RADIUS = 0.32;
const WALK = 3.1;
const RUN = 5.2;
const CAM_DIST = 4.4;
const CAM_HEIGHT = 2.15;

function blocked(x: number, z: number, colliders: Collider[]) {
  return colliders.some((box) => {
    const nearestX = Math.max(box.minX, Math.min(x, box.maxX));
    const nearestZ = Math.max(box.minZ, Math.min(z, box.maxZ));
    const dx = x - nearestX;
    const dz = z - nearestZ;
    return dx * dx + dz * dz < RADIUS * RADIUS;
  });
}

export function ThirdPersonController({
  spawn = [0, 0, 8] as [number, number, number],
  colliders,
  points,
  paused,
  suspended,
  collected = [],
  onPrompt,
  onInteract,
  onTogglePause,
  onMove,
  onMotion,
  onLooked,
}: {
  spawn?: [number, number, number];
  colliders: Collider[];
  points: InteractPoint[];
  paused: boolean;
  suspended?: boolean;
  collected?: string[];
  onPrompt: (text: string) => void;
  onInteract: (id: string) => void;
  onTogglePause: () => void;
  onMove?: (x: number, z: number, yaw: number) => void;
  onMotion?: (state: { moving: boolean; running: boolean }) => void;
  onLooked?: () => void;
}) {
  const { camera, gl } = useThree();
  const group = useRef<THREE.Group>(null);
  const keys = useRef<Record<string, boolean>>({});
  const yaw = useRef(0);
  const pitch = useRef(0.28);
  const facing = useRef(Math.PI);
  const collidersRef = useRef(colliders);
  const pointsRef = useRef(points);
  const collectedRef = useRef(collected);
  const pausedRef = useRef(paused);
  const suspendedRef = useRef(!!suspended);
  const callbacks = useRef({ onPrompt, onInteract, onTogglePause, onMove, onMotion, onLooked });
  const lastMove = useRef({ x: spawn[0], z: spawn[2], yaw: 0 });
  const [moving, setMoving] = useState(false);
  const [running, setRunning] = useState(false);
  const motionRef = useRef({ moving: false, running: false });
  collidersRef.current = colliders;
  pointsRef.current = points;
  collectedRef.current = collected;
  pausedRef.current = paused;
  suspendedRef.current = !!suspended;
  callbacks.current = { onPrompt, onInteract, onTogglePause, onMove, onMotion, onLooked };

  useEffect(() => {
    if (group.current) group.current.position.set(spawn[0], spawn[1], spawn[2]);
    const coarse =
      typeof window !== 'undefined'
      && (window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window);

    const tryInteract = () => {
      if (pausedRef.current || suspendedRef.current || !group.current) return;
      const { x, z } = group.current.position;
      for (const point of pointsRef.current) {
        if (collectedRef.current.includes(point.id)) continue;
        if (Math.hypot(x - point.x, z - point.z) < point.radius) {
          callbacks.current.onInteract(point.id);
          break;
        }
      }
    };

    const applyLook = (dx: number, dy: number) => {
      if (pausedRef.current || suspendedRef.current) return;
      if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) return;
      yaw.current -= dx * 0.0024;
      pitch.current = THREE.MathUtils.clamp(pitch.current + dy * 0.0018, 0.08, 0.85);
      callbacks.current.onLooked?.();
    };

    const down = (event: KeyboardEvent) => {
      if (event.repeat) return;
      const typing = event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement;
      const move = ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ShiftLeft', 'ShiftRight', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Escape', 'KeyE', 'Tab'].includes(event.code);
      if (!typing && move) event.preventDefault();
      keys.current[event.code] = true;
      if (event.code === 'Escape' && !typing && !suspendedRef.current) {
        callbacks.current.onTogglePause();
        if (document.pointerLockElement) document.exitPointerLock();
        return;
      }
      if (event.code === 'KeyE' && !typing) tryInteract();
    };
    const up = (event: KeyboardEvent) => { keys.current[event.code] = false; };
    const hold = (event: Event) => {
      const detail = (event as CustomEvent<{ code?: string; down?: boolean }>).detail;
      if (!detail?.code) return;
      const wasDown = !!keys.current[detail.code];
      keys.current[detail.code] = !!detail.down;
      if (detail.code === 'KeyE' && detail.down && !wasDown) tryInteract();
    };
    const lookMouse = (event: MouseEvent) => {
      if (document.pointerLockElement !== gl.domElement || pausedRef.current || suspendedRef.current) return;
      applyLook(event.movementX, event.movementY);
    };
    const lookTouch = (event: Event) => {
      const detail = (event as CustomEvent<{ dx?: number; dy?: number }>).detail;
      if (detail?.dx == null || detail?.dy == null) return;
      applyLook(detail.dx, detail.dy);
    };
    const onClick = () => {
      if (coarse) return;
      if (!pausedRef.current && !suspendedRef.current && document.pointerLockElement !== gl.domElement) {
        void gl.domElement.requestPointerLock();
      }
    };
    const clear = () => { keys.current = {}; };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    window.addEventListener('saferon-hold', hold as EventListener);
    window.addEventListener('saferon-look', lookTouch as EventListener);
    window.addEventListener('mousemove', lookMouse);
    window.addEventListener('blur', clear);
    gl.domElement.addEventListener('click', onClick);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
      window.removeEventListener('saferon-hold', hold as EventListener);
      window.removeEventListener('saferon-look', lookTouch as EventListener);
      window.removeEventListener('mousemove', lookMouse);
      window.removeEventListener('blur', clear);
      gl.domElement.removeEventListener('click', onClick);
    };
  }, [gl, spawn]);

  useEffect(() => {
    if (suspended && document.pointerLockElement) document.exitPointerLock();
  }, [suspended]);

  useFrame((_, delta) => {
    const body = group.current;
    if (!body) return;
    const step = Math.min(delta, 0.05);
    let isMoving = false;
    let isRunning = false;
    if (!pausedRef.current && !suspendedRef.current) {
      const forward = new THREE.Vector3(-Math.sin(yaw.current), 0, -Math.cos(yaw.current));
      const right = new THREE.Vector3(Math.cos(yaw.current), 0, -Math.sin(yaw.current));
      const move = new THREE.Vector3();
      if (keys.current.KeyW || keys.current.ArrowUp) move.add(forward);
      if (keys.current.KeyS || keys.current.ArrowDown) move.sub(forward);
      if (keys.current.KeyD || keys.current.ArrowRight) move.add(right);
      if (keys.current.KeyA || keys.current.ArrowLeft) move.sub(right);
      if (move.lengthSq() > 0) {
        isRunning = !!(keys.current.ShiftLeft || keys.current.ShiftRight);
        const speed = isRunning ? RUN : WALK;
        move.normalize().multiplyScalar(speed * step);
        const nextX = body.position.x + move.x;
        const nextZ = body.position.z + move.z;
        const boxes = collidersRef.current;
        if (!blocked(nextX, body.position.z, boxes)) body.position.x = nextX;
        if (!blocked(body.position.x, nextZ, boxes)) body.position.z = nextZ;
        facing.current = Math.atan2(move.x, move.z);
        isMoving = true;
      }
      body.rotation.y = THREE.MathUtils.damp(body.rotation.y, facing.current, 12, step);
    }

    if (isMoving !== motionRef.current.moving || isRunning !== motionRef.current.running) {
      motionRef.current = { moving: isMoving, running: isRunning };
      setMoving(isMoving);
      setRunning(isRunning);
      callbacks.current.onMotion?.({ moving: isMoving, running: isRunning });
    }

    const ideal = new THREE.Vector3(
      body.position.x + Math.sin(yaw.current) * CAM_DIST * Math.cos(pitch.current),
      body.position.y + CAM_HEIGHT + Math.sin(pitch.current) * 1.4,
      body.position.z + Math.cos(yaw.current) * CAM_DIST * Math.cos(pitch.current),
    );
    camera.position.lerp(ideal, 1 - Math.exp(-8 * step));
    camera.lookAt(body.position.x, body.position.y + 1.35, body.position.z);

    const yawDelta = Math.abs(yaw.current - lastMove.current.yaw);
    if (
      Math.hypot(body.position.x - lastMove.current.x, body.position.z - lastMove.current.z) > 0.12
      || yawDelta > 0.04
    ) {
      lastMove.current = { x: body.position.x, z: body.position.z, yaw: yaw.current };
      callbacks.current.onMove?.(body.position.x, body.position.z, yaw.current);
    }
    let prompt = '';
    if (!pausedRef.current && !suspendedRef.current) {
      for (const point of pointsRef.current) {
        if (collectedRef.current.includes(point.id)) continue;
        if (Math.hypot(body.position.x - point.x, body.position.z - point.z) < point.radius) {
          prompt = point.prompt;
          break;
        }
      }
    }
    callbacks.current.onPrompt(prompt);
  });

  return (
    <group ref={group} userData={{ nayapurPlayer: true }}>
      <AnimatedPlayer moving={moving} running={running} />
    </group>
  );
}
