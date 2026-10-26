'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrthographicCamera } from '@react-three/drei';
import * as THREE from 'three';
import { Campus, Character } from './campus';
import { canWalk, stations, type Point, type StationId } from '@/lib/game/missions';
import { PlayerBadge, StationMarker3D } from './world-labels';

export type SceneProps = {
  active: boolean; target: Point | null; resetKey: number; station: StationId; verified: boolean;
  onPosition: (p: Point) => void; onTarget: (p: Point | null) => void; onStation: (id: StationId) => void; onReady: () => void;
};
function Player({active,target,onPosition,onTarget}: Pick<SceneProps,'active'|'target'|'onPosition'|'onTarget'>) {
  const player=useRef<THREE.Group>(null); const keys=useRef(new Set<string>()); const pos=useRef({x:0,z:5}); const last=useRef(0); const [walking,setWalking]=useState(false); const moving=useRef(false);
  useEffect(() => {
    const down=(e:KeyboardEvent)=>{ if(['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code) && !e.isComposing){ e.preventDefault();keys.current.add(e.code); } };
    const up=(e:KeyboardEvent)=>keys.current.delete(e.code); const clear=()=>keys.current.clear();
    window.addEventListener('keydown',down);window.addEventListener('keyup',up);window.addEventListener('blur',clear);document.addEventListener('visibilitychange',clear);
    return()=>{window.removeEventListener('keydown',down);window.removeEventListener('keyup',up);window.removeEventListener('blur',clear);document.removeEventListener('visibilitychange',clear);};
  },[]);
  useEffect(()=>{if(!active)keys.current.clear();},[active]);
  useFrame((state,delta)=>{
    if(!player.current)return; let dx=0,dz=0;
    if(active){
      const k=keys.current; const right=Number(k.has('KeyD')||k.has('ArrowRight'))-Number(k.has('KeyA')||k.has('ArrowLeft'));const forward=Number(k.has('KeyW')||k.has('ArrowUp'))-Number(k.has('KeyS')||k.has('ArrowDown'));
      dx=right*.82-forward*.57; dz=-right*.57-forward*.82;
      if(right||forward){if(target)onTarget(null);}else if(target){dx=target.x-pos.current.x;dz=target.z-pos.current.z;if(Math.hypot(dx,dz)<.15){dx=dz=0;onTarget(null);}}
    }
    const len=Math.hypot(dx,dz); const isMoving=len>.05;
    if(isMoving){const step=Math.min(delta,.04)*3.6; dx=dx/len*step;dz=dz/len*step; const oldX=pos.current.x,oldZ=pos.current.z;
      if(canWalk(oldX+dx,oldZ))pos.current.x+=dx;if(canWalk(pos.current.x,oldZ+dz))pos.current.z+=dz;
      if(target && oldX===pos.current.x && oldZ===pos.current.z)onTarget(null);
      player.current.rotation.y=THREE.MathUtils.lerp(player.current.rotation.y,Math.atan2(dx,dz),Math.min(1,delta*12));
    }
    if(isMoving!==moving.current){moving.current=isMoving;setWalking(isMoving);}
    player.current.position.set(pos.current.x,.08,pos.current.z);
    if(state.clock.elapsedTime-last.current>.12){last.current=state.clock.elapsedTime;onPosition({...pos.current});}
  });
  return (
    <group ref={player} position={[0, 0.08, 5]}>
      <Character backpack animated={walking} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.035, 0]}>
        <ringGeometry args={[0.55, 0.61, 40]} />
        <meshBasicMaterial color="#f4d283" transparent opacity={0.95} />
      </mesh>
      <PlayerBadge text="YOU" position={[0, 2.45, 0]} />
    </group>
  );
}
function CameraRig(){const {size,camera}=useThree();useEffect(()=>{if(camera instanceof THREE.OrthographicCamera){camera.zoom=Math.min(size.width/35,size.height/25);camera.updateProjectionMatrix();}},[size,camera]);return null;}
function Ready({onReady}:{onReady:()=>void}){useEffect(onReady,[onReady]);return null;}
function Marker({id,highlight,onStation}:{id:StationId;highlight:boolean;onStation:SceneProps['onStation']}){
  const s=stations[id];
  const symbol = id === 'teacher' ? '…' : id === 'computer' ? '@' : id === 'canteen' ? '?' : '!';
  return (
    <StationMarker3D
      name={s.name}
      symbol={symbol}
      position={[s.position.x, 3.35, s.position.z]}
      highlight={highlight}
      onClick={() => onStation(id)}
    />
  );
}
export default function GameScene(props:SceneProps){
  return <Canvas shadows dpr={[1,1.5]} gl={{antialias:true,powerPreference:'high-performance'}} onCreated={({gl})=>{gl.setClearColor('#c5cdb5');gl.toneMapping=THREE.ACESFilmicToneMapping;gl.toneMappingExposure=1.15;}}>
    <OrthographicCamera makeDefault position={[22,26,31]} zoom={30} near={.1} far={150} onUpdate={c=>c.lookAt(0,0,0)} />
    <CameraRig />
    <ambientLight intensity={.8} color="#fff1cf" /><hemisphereLight args={['#d4e7e1','#aa936b',1.6]} />
    <directionalLight position={[-12,24,10]} intensity={3} color="#fff2cf" castShadow shadow-mapSize={[2048,2048]} shadow-camera-left={-22} shadow-camera-right={22} shadow-camera-top={22} shadow-camera-bottom={-22} shadow-normalBias={.04} shadow-bias={-.0001} />
    <fog attach="fog" args={['#c5cdb5',55,100]} />
    <mesh rotation={[-Math.PI/2,0,0]} position={[0,-.83,0]} receiveShadow><planeGeometry args={[200,200]} /><meshStandardMaterial color="#a7b28e" /></mesh>
    <Suspense fallback={null}><Campus /><Player key={props.resetKey} {...props} />
      {(Object.keys(stations) as StationId[]).map(id=><Marker key={id} id={id} highlight={props.verified?id===props.station:id===props.station||id==='teacher'} onStation={props.onStation} />)}
      <Ready onReady={props.onReady} />
    </Suspense>
    <mesh
      position={[0, 0.09, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      onClick={(e) => {
        if (props.active) {
          e.stopPropagation();
          props.onTarget({ x: e.point.x, z: e.point.z });
        }
      }}
    >
      <planeGeometry args={[27, 24]} />
      <meshBasicMaterial transparent opacity={0} depthWrite={false} />
    </mesh>
    {props.target && (
      <mesh position={[props.target.x, 0.12, props.target.z]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.2, 0.3, 24]} />
        <meshBasicMaterial color="#fff1a8" transparent opacity={0.8} />
      </mesh>
    )}
  </Canvas>;
}
