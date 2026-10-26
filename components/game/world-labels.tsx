'use client';

import { useMemo } from 'react';
import * as THREE from 'three';

export function PlayerBadge({ text = 'YOU', position = [0, 2.45, 0] }: { text?: string; position?: [number, number, number] }) {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;

    // Rounded pill
    ctx.fillStyle = '#174f48';
    ctx.beginPath();
    ctx.roundRect(28, 20, 200, 88, 44);
    ctx.fill();

    ctx.strokeStyle = '#f4d283';
    ctx.lineWidth = 6;
    ctx.stroke();

    ctx.fillStyle = '#fff7d9';
    ctx.font = 'bold 44px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 128, 64);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [text]);

  return (
    <sprite position={position} scale={[1.4, 0.7, 1]}>
      <spriteMaterial map={texture} depthTest={false} transparent />
    </sprite>
  );
}

export function StationMarker3D({
  name,
  symbol,
  position,
  highlight,
  onClick,
}: {
  name: string;
  symbol: string;
  position: [number, number, number];
  highlight: boolean;
  onClick: () => void;
}) {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 192;
    const ctx = canvas.getContext('2d')!;

    // Background pill
    ctx.fillStyle = highlight ? '#174f48' : '#142523';
    ctx.beginPath();
    ctx.roundRect(16, 24, 480, 144, 72);
    ctx.fill();

    ctx.strokeStyle = highlight ? '#f59e0b' : '#3d635c';
    ctx.lineWidth = 8;
    ctx.stroke();

    // Circle symbol container
    ctx.fillStyle = highlight ? '#f59e0b' : '#274f49';
    ctx.beginPath();
    ctx.arc(88, 96, 48, 0, Math.PI * 2);
    ctx.fill();

    // Symbol character
    ctx.fillStyle = highlight ? '#1c1917' : '#e6f3f0';
    ctx.font = 'bold 52px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(symbol, 88, 98);

    // Label text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 40px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(name, 160, 96);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [name, symbol, highlight]);

  return (
    <group position={position}>
      <sprite
        position={[0, 0, 0]}
        scale={[2.6, 0.98, 1]}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        <spriteMaterial map={texture} depthTest={false} transparent opacity={0.96} />
      </sprite>
    </group>
  );
}

