'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

export function Block({ p, s, color, ...props }: { p: [number, number, number]; s: [number, number, number]; color: string; rotation?: [number, number, number] }) {
  return <mesh position={p} castShadow receiveShadow {...props}><boxGeometry args={s} /><meshStandardMaterial color={color} roughness={.85} /></mesh>;
}
function Sign({ text, sub = '', position, width = 4, height = 1, color = '#174f48' }: { text: string; sub?: string; position: [number, number, number]; width?: number; height?: number; color?: string }) {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas'); canvas.width = 1024; canvas.height = 256;
    const ctx = canvas.getContext('2d')!; ctx.fillStyle = color; ctx.fillRect(0, 0, 1024, 256);
    ctx.strokeStyle = '#c8d9ac'; ctx.lineWidth = 4; ctx.strokeRect(15, 15, 994, 226);
    ctx.fillStyle = '#fff7d9'; ctx.textAlign = 'center'; ctx.font = 'bold 70px sans-serif'; ctx.fillText(text, 512, sub ? 120 : 150);
    if (sub) { ctx.font = '30px sans-serif'; ctx.fillText(sub, 512, 187); }
    const t = new THREE.CanvasTexture(canvas); t.colorSpace = THREE.SRGBColorSpace; return t;
  }, [text, sub, color]);
  return <mesh position={position}><planeGeometry args={[width, height]} /><meshStandardMaterial map={texture} roughness={.9} /></mesh>;
}
function Window({ x, y, z }: { x: number; y: number; z: number }) {
  return <group position={[x, y, z]}>
    <Block p={[0, 0, 0]} s={[1.4, 1.75, .15]} color="#f1dcb3" />
    <Block p={[0, 0, .1]} s={[1.13, 1.48, .08]} color="#427b79" />
    <Block p={[0, 0, .16]} s={[.06, 1.5, .06]} color="#a3c0af" />
    <Block p={[0, .1, .16]} s={[1.13, .06, .06]} color="#a3c0af" />
    <Block p={[0, -.92, .14]} s={[1.62, .13, .4]} color="#e6c392" />
    <Block p={[0, 1, .1]} s={[1.65, .16, .65]} color="#cd9c75" />
  </group>;
}
function Building() {
  return <group>
    <Block p={[0, 3.6, -10]} s={[28, 7.2, 4.5]} color="#e1bc8d" />
    <Block p={[0, .36, -7.9]} s={[28.7, .7, 5]} color="#c1ac8b" />
    <Block p={[0, .12, -5.8]} s={[29, .24, 1]} color="#d4c3a2" />
    <Block p={[0, 7.3, -10]} s={[29, .38, 5.2]} color="#ba7960" />
    <Block p={[0, 7.57, -10]} s={[28.7, .18, 5]} color="#dc9d77" />
    <Block p={[0, 3.65, -7.5]} s={[28.6, .22, 1.7]} color="#edc99a" />
    <Block p={[0, 3.4, -7.25]} s={[28.4, .15, 1.9]} color="#bc8761" />
    {[-12,-9,-6,-3,0,3,6,9,12].map(x => <group key={x}>
      <Window x={x} y={5.5} z={-7.69} />
      <Block p={[x, 1.8, -7.65]} s={[1.6, 2.65, .12]} color="#345f59" />
      <Block p={[x, 1.8, -7.55]} s={[.07, 2.65, .08]} color="#7faba1" />
      <Block p={[x, 1.3, -7.5]} s={[1.4, .07, .07]} color="#7faba1" />
      <Block p={[x - 1.4, 1.9, -6.9]} s={[.3, 3.2, .3]} color="#f2d9ad" />
      <Block p={[x - 1.4, .65, -6.9]} s={[.5, .5, .5]} color="#c39170" />
    </group>)}
    <Sign text="NAVRANG PUBLIC SCHOOL" sub="LUCKNOW, UTTAR PRADESH  ·  LEARN. EXPLORE. GROW." position={[0, 7, -7.25]} width={8} height={1.1} />
    <Sign text="TECH UTSAV 2026" sub="BIG IDEAS. BRIGHTER TOMORROWS." position={[0, 3.1, -6.6]} width={6} height={1.1} color="#d2854d" />
    <Sign text="COMPUTER LAB" position={[8, 3.1, -6.65]} width={3.5} height={.6} />
    <group position={[-14.25,0,2]} rotation={[0,Math.PI / 2,0]}>
      <Block p={[0, 2.2, 0]} s={[17,4.4,3]} color="#d6b286" />
      <Block p={[0,4.5,0]} s={[17.7,.3,3.7]} color="#bd8067" />
      {[-6,-3,0,3,6].map(x => <Window key={x} x={x} y={2.4} z={1.55} />)}
      <Sign text="DISCOVER SOMETHING NEW" position={[0,4,1.72]} width={7} height={.65} />
    </group>
  </group>;
}
export function Tree({ position, scale = 1, seed = 0 }: { position: [number, number, number]; scale?: number; seed?: number }) {
  return <group position={position} scale={scale}>
    <mesh position={[0,1.5,0]} castShadow><cylinderGeometry args={[.18,.3,3,7]} /><meshStandardMaterial color="#7d6950" /></mesh>
    {[[-.6,2.7,0],[.6,3.1,.3],[0,3.9,0],[.1,3.1,-.7],[-.7,3.6,.4],[.8,3.8,-.4]].map((p,i) => <mesh key={i} position={p as [number,number,number]} rotation={[i*.7,seed+i,.3]} castShadow><dodecahedronGeometry args={[i===2 ? 1.35 : 1.15,0]} /><meshStandardMaterial color={['#729955','#85a75c','#98b96c','#658d55'][i%4]} flatShading /></mesh>)}
  </group>;
}
function Bench({ position, rotation = 0 }: { position: [number,number,number]; rotation?: number }) {
  return <group position={position} rotation={[0,rotation,0]}>
    {[-.32,0,.32].map(z => <Block key={z} p={[0,.65,z]} s={[2.5,.13,.25]} color="#a5754e" />)}
    {[.95,1.25].map(y => <Block key={y} p={[0,y,-.4]} s={[2.5,.2,.12]} color="#b58453" />)}
    {[-.9,.9].map(x => <group key={x}><Block p={[x,.35,0]} s={[.12,.65,.7]} color="#3d6257" /><Block p={[x,.8,-.42]} s={[.1,1.2,.12]} color="#3d6257" /></group>)}
  </group>;
}
export function Character({ shirt = '#f1e7cd', skin = '#b67a50', backpack = false, animated = false }: { shirt?: string; skin?: string; backpack?: boolean; animated?: boolean }) {
  const body = useRef<THREE.Group>(null); const legL = useRef<THREE.Group>(null); const legR = useRef<THREE.Group>(null); const armL = useRef<THREE.Group>(null); const armR = useRef<THREE.Group>(null);
  useFrame(({clock}) => { const t = clock.elapsedTime; if(body.current) body.current.position.y = animated ? Math.abs(Math.sin(t*9))*.055 : Math.sin(t*2)*.015; const a = animated ? Math.sin(t*9)*.48 : .04; if(legL.current) legL.current.rotation.x=a; if(legR.current) legR.current.rotation.x=-a; if(armL.current) armL.current.rotation.x=-a; if(armR.current) armR.current.rotation.x=a; });
  return <group ref={body}>
    {[-1,1].map((side,i) => <group key={side} position={[side*.16,.68,0]} ref={i===0?legL:legR}>
      <mesh position={[0,-.23,0]} castShadow><capsuleGeometry args={[.12,.3,4,8]} /><meshStandardMaterial color="#324e56" /></mesh>
      <RoundedBox args={[.27,.17,.42]} radius={.06} smoothness={2} position={[0,-.54,.075]} castShadow><meshStandardMaterial color="#263837" /></RoundedBox>
      <mesh position={[0,-.4,0]}><cylinderGeometry args={[.095,.095,.13,8]} /><meshStandardMaterial color="#f7eedc" /></mesh>
    </group>)}
    <RoundedBox args={[.66,.67,.4]} radius={.15} smoothness={3} position={[0,1,0]} castShadow><meshStandardMaterial color={shirt} /></RoundedBox>
    <Block p={[0,.74,.215]} s={[.55,.055,.03]} color="#4e5c54" />
    {[-1,1].map((side,i) => <group key={side} position={[side*.37,1.2,0]} ref={i===0?armL:armR}>
      <mesh position={[side*.035,-.08,0]} castShadow><capsuleGeometry args={[.13,.18,4,8]} /><meshStandardMaterial color={shirt} /></mesh>
      <mesh position={[side*.07,-.3,0]} castShadow><capsuleGeometry args={[.09,.2,4,8]} /><meshStandardMaterial color={skin} /></mesh>
    </group>)}
    <mesh position={[0,1.39,0]}><cylinderGeometry args={[.12,.13,.2,10]} /><meshStandardMaterial color={skin} /></mesh>
    <mesh position={[0,1.72,.02]} castShadow><sphereGeometry args={[.34,20,16]} /><meshStandardMaterial color={skin} roughness={.8} /></mesh>
    <mesh position={[0,1.84,-.04]} rotation={[-.2,0,0]} castShadow><sphereGeometry args={[.35,16,12,0,Math.PI*2,0,Math.PI*.6]} /><meshStandardMaterial color="#302d29" /></mesh>
    <mesh position={[-.14,1.93,.21]} rotation={[0,0,-.35]} castShadow><sphereGeometry args={[.19,12,8]} /><meshStandardMaterial color="#302d29" /></mesh>
    {[-1,1].map(side => <group key={side}><mesh position={[side*.12,1.74,.327]}><sphereGeometry args={[.034,8,8]} /><meshStandardMaterial color="#242b27" /></mesh><mesh position={[side*.32,1.7,.02]}><sphereGeometry args={[.075,8,8]} /><meshStandardMaterial color={skin} /></mesh></group>)}
    <mesh position={[0,1.65,.35]}><sphereGeometry args={[.045,8,8]} /><meshStandardMaterial color={skin} /></mesh>
    <mesh position={[0,1.58,.318]} rotation={[0,0,Math.PI]}><torusGeometry args={[.065,.012,6,12,Math.PI]} /><meshStandardMaterial color="#6e4433" /></mesh>
    <Block p={[.15,1.12,.205]} s={[.1,.13,.02]} color="#d5af55" />
    {backpack && <><RoundedBox args={[.51,.56,.28]} radius={.1} smoothness={3} position={[0,1,-.31]} castShadow><meshStandardMaterial color="#cf8d43" /></RoundedBox><RoundedBox args={[.35,.24,.08]} radius={.05} smoothness={2} position={[0,.87,-.48]}><meshStandardMaterial color="#e4af5b" /></RoundedBox>{[-.22,.22].map(x => <Block key={x} p={[x,1.06,.22]} s={[.07,.5,.05]} color="#ae7842" />)}</>}
  </group>;
}
function Flags() {
  return <group>{Array.from({length:23},(_,i) => { const x=-11+i; const y=4.7-Math.sin(i/22*Math.PI)*1.2; return <group key={i} position={[x,y,-2]}><mesh><coneGeometry args={[.22,.55,3]} /><meshStandardMaterial color={['#df985a','#e7ca83','#6a9c8b'][i%3]} side={THREE.DoubleSide} /></mesh></group>; })}<mesh position={[0,4.1,-2]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[.012,.012,24,4]} /><meshStandardMaterial color="#756c56" /></mesh></group>;
}
export function Campus() {
  const tiles = useMemo(() => Array.from({length: 20*17},(_,i) => ({ x: (i%20)*1.5-14.25, z: Math.floor(i/20)*1.5-10.5, c: ['#d9ceae','#d5c8a8','#d2c6a6','#ddd0b2'][(i*7+Math.floor(i/20))%4] })),[]);
  return <group>
    <Block p={[0,-.4,0]} s={[31,.8,28]} color="#b8b590" />
    {tiles.map((t,i) => <Block key={i} p={[t.x,.015,t.z]} s={[1.47,.05,1.47]} color={t.c} />)}
    <Building />
    <Flags />
    <group position={[-4,0,6]}>
      <RoundedBox args={[4,.35,3.4]} radius={.18} smoothness={2} position={[0,.18,0]} receiveShadow><meshStandardMaterial color="#b2b095" /></RoundedBox>
      <Block p={[0,.37,0]} s={[3.65,.1,3.05]} color="#8a9b62" />
      <Tree position={[0,.4,0]} scale={1.15} />
    </group>
    <group position={[5,0,5]}><mesh position={[0,.2,0]} receiveShadow><cylinderGeometry args={[1.35,1.4,.4,12]} /><meshStandardMaterial color="#b3b095" /></mesh><mesh position={[0,.42,0]}><cylinderGeometry args={[1.2,1.2,.08,12]} /><meshStandardMaterial color="#82965b" /></mesh><Tree position={[0,.45,0]} scale={1.05} seed={2} /></group>
    <Tree position={[-10.5,0,-5]} scale={.85} />
    <Tree position={[12,0,-7]} scale={1.2} />
    <Tree position={[-10,0,10]} scale={1.3} />
    <Tree position={[12,0,10]} scale={1.1} />
    <Bench position={[-4,0,8.4]} />
    <Bench position={[5,0,7]} />
    <Bench position={[-9.4,0,3.5]} rotation={Math.PI/2} />
    <group position={[-6,0,.65]}>
      {[-1.05,1.05].map(x => <Block key={x} p={[x,1.1,0]} s={[.12,2.2,.12]} color="#566b55" />)}
      <RoundedBox args={[2.7,1.8,.18]} radius={.06} smoothness={2} position={[0,2,0]} castShadow><meshStandardMaterial color="#496e5d" /></RoundedBox>
      <Block p={[0,1.95,.1]} s={[2.43,1.42,.02]} color="#b79c70" />
      <Sign text="NOTICEBOARD" position={[0,2.73,.11]} width={2.45} height={.3} />
      {[[-.7,2.1],[-.05,1.95],[.7,2.1]].map(([x,y],i) => <group key={i}><Block p={[x,y,.14]} s={[.55,.75,.02]} color={i===1?'#e7b66f':'#eee9ce'} /><Block p={[x,y+.12,.16]} s={[.4,.045,.01]} color="#718477" /><Block p={[x,y-.02,.16]} s={[.35,.025,.01]} color="#a3a58a" /><mesh position={[x,y+.3,.18]}><sphereGeometry args={[.035,6,6]} /><meshStandardMaterial color="#b66e4e" /></mesh></group>)}
    </group>
    <group position={[8,0,-4.7]}>
      <Block p={[0,.95,0]} s={[2.8,.13,.9]} color="#a27e55" />
      {[-1.15,1.15].map(x => <Block key={x} p={[x,.46,0]} s={[.1,.95,.65]} color="#536d61" />)}
      <Block p={[0,1.2,0]} s={[.1,.45,.12]} color="#334c48" />
      <RoundedBox args={[1.15,.72,.1]} radius={.04} smoothness={2} position={[0,1.6,0]} castShadow><meshStandardMaterial color="#2a4542" /></RoundedBox>
      <Block p={[0,1.6,.06]} s={[1.02,.59,.015]} color="#88c6bd" />
      <Block p={[0,1.02,.27]} s={[.8,.04,.25]} color="#3b5952" />
    </group>
    <group position={[10.5,0,5]} rotation={[0,-Math.PI/2,0]}>
      <Block p={[0,.7,0]} s={[3,1.4,1.1]} color="#71978a" />
      <Block p={[0,1.45,0]} s={[3.2,.12,1.3]} color="#ead2a9" />
      {[-1.4,1.4].map(x => <Block key={x} p={[x,1.8,0]} s={[.1,3.6,.1]} color="#d4bd8c" />)}
      <Block p={[0,3.4,0]} s={[3.4,.2,2]} color="#ba7552" />
      <Sign text="THE HAPPY TIFFIN" sub="FRESH FOOD. HAPPY MINDS." position={[0,2.8,.2]} width={3} height={.7} />
      {[0,.4,.8].map(x => <mesh key={x} position={[x,1.65,0]}><cylinderGeometry args={[.12,.09,.3,12]} /><meshStandardMaterial color="#e9c47e" /></mesh>)}
    </group>
    <group position={[2,0,-3]} rotation={[0,.35,0]}><Character shirt="#c58166" skin="#a57550" /></group>
    <group position={[-8,0,-3]} rotation={[0,1,0]}><Character /></group>
    <group position={[-7,0,-3.5]} rotation={[0,-.6,0]}><Character shirt="#e9dabe" skin="#94643f" backpack /></group>
    <group position={[6,0,-6]} rotation={[0,-.5,0]}><Character shirt="#d6e4d4" /></group>
    {[-10,10].map(x => <group key={x} position={[x,0,0]}><mesh position={[0,.45,0]} castShadow><cylinderGeometry args={[.4,.3,.8,10]} /><meshStandardMaterial color="#b58160" /></mesh><mesh position={[0,1,0]} castShadow><dodecahedronGeometry args={[.55,0]} /><meshStandardMaterial color="#789956" /></mesh></group>)}
    <Block p={[0,.5,13]} s={[30,1,.25]} color="#acb8a1" />
    {Array.from({length:16},(_,i) => <Block key={i} p={[-15+i*2,1.15,13]} s={[.12,1.3,.12]} color="#4e7264" />)}
    <Block p={[0,1.5,13]} s={[30,.1,.12]} color="#4e7264" />
  </group>;
}
