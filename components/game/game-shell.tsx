'use client';

import dynamic from 'next/dynamic';
import { Component, useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, BookOpen, Check, ChevronRight, CircleHelp, Compass, Flag, Footprints, Gamepad2, GraduationCap, Home, Leaf, MapPin, Maximize, MousePointer2, Pause, Play, RotateCcw, Search, Settings2, Shield, ShieldAlert, ShieldCheck, Sparkles, Star, Trophy, Volume2, VolumeX, X, MessageSquareShare, Laptop, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { missions, stations, readProgress, initialProgress, SAVE_KEY, type Point, type Progress, type StationId } from '@/lib/game/missions';
import { playCue } from '@/lib/game/audio';
import { GameDialog, Investigation } from './investigation';
import LegitOrScamGame from './legit-or-scam-game';
import { GameId, GAMES } from '@/lib/game/games-config';

const GameScene=dynamic(()=>import('./game-scene'),{ssr:false,loading:()=> <div className="scene-loading"><Shield size={32}/><span>Opening the school gates…</span></div>});
class SceneBoundary extends Component<{children:ReactNode},{error:boolean}>{state={error:false};static getDerivedStateFromError(){return {error:true};}render(){return this.state.error?<div className="scene-loading"><Shield/><h2>The campus needs WebGL</h2><p>Try a browser with hardware acceleration enabled.</p><button onClick={()=>window.location.reload()}>Reload campus</button></div>:this.props.children;}}

type Panel = 'pause'|'journal'|'help'|'games'|null;
export default function GameShell(){
  const [currentGame, setCurrentGame] = useState<GameId>('phishing');
  const [progress,setProgress]=useState<Progress>(initialProgress);const [hydrated,setHydrated]=useState(false);const [ready,setReady]=useState(false);const [started,setStarted]=useState(false);const [panel,setPanel]=useState<Panel>(null);const [station,setStation]=useState<StationId|null>(null);const [position,setPosition]=useState<Point>({x:0,z:5});const [target,setTarget]=useState<Point|null>(null);const [resetKey,setResetKey]=useState(0);const [sound,setSound]=useState(true);const [guided,setGuided]=useState(true);const [outcome,setOutcome]=useState<'success'|'retry'|null>(null);const [toast,setToast]=useState('');const [storageError,setStorageError]=useState(false);const [mapOpen,setMapOpen]=useState(true);const toastTimer=useRef<ReturnType<typeof setTimeout>|null>(null);
  const mission=missions[progress.mission];const finished=progress.completed.length===missions.length;
  const active=started&&!panel&&!station&&!outcome;
  useEffect(()=>{setProgress(readProgress());setHydrated(true);return()=>{if(toastTimer.current)clearTimeout(toastTimer.current);};},[]);
  useEffect(()=>{if(hydrated)try{localStorage.setItem(SAVE_KEY,JSON.stringify(progress));setStorageError(false);}catch{setStorageError(true);}},[progress,hydrated]);
  const notify=useCallback((text:string)=>{setToast(text);if(toastTimer.current)clearTimeout(toastTimer.current);toastTimer.current=setTimeout(()=>setToast(''),3500);},[]);
  const onReady=useCallback(()=>setReady(true),[]);
  const nearest=(Object.keys(stations) as StationId[]).find(id=>Math.hypot(position.x-stations[id].position.x,position.z-stations[id].position.z)<2.25);
  const interact=useCallback((id:StationId)=>{
    if(!started){notify('Start your adventure to explore the campus.');return;}
    if(panel||station||outcome)return;
    const p=stations[id].position;
    if(Math.hypot(position.x-p.x,position.z-p.z)<2.25){setTarget(null);setStation(id);playCue('tap',sound);}else{setTarget({x:p.x,z:p.z+1.25});notify(`Walking to ${stations[id].name}. Press E or Interact when close.`);}
  },[started,panel,station,outcome,position,sound,notify]);
  useEffect(()=>{const key=(e:KeyboardEvent)=>{if(e.isComposing||e.keyCode===229)return;if(e.code==='KeyE'&&active&&nearest){e.preventDefault();interact(nearest);}if(e.code==='Escape'&&!station&&!outcome&&started){setPanel(p=>p?null:'pause');}if(e.code==='KeyJ'&&!station&&!outcome&&started)setPanel(p=>p==='journal'?null:'journal');};window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key);},[active,nearest,interact,station,outcome,started]);
  const start=()=>{setStarted(true);playCue('success',sound);notify('Welcome, detective. Follow the gold marker!');};
  const collect=(i:number)=>{if(progress.clues.includes(i))return;setProgress(p=>({...p,clues:[...p.clues,i]}));playCue('clue',sound);};
  const verify=()=>{setProgress(p=>({...p,verified:true}));setStation(null);playCue('clue',sound);notify('Confirmation saved. Return to the message to make your decision.');};
  const resolve=(safe:boolean)=>{setStation(null);if(safe===mission.safe){setProgress(p=>({...p,completed:[...new Set([...p.completed,p.mission])],xp:p.completed.includes(p.mission)?p.xp:p.xp+100}));setOutcome('success');playCue('success',sound);}else setOutcome('retry');};
  const next=()=>{setOutcome(null);if(progress.mission<missions.length-1){setProgress(p=>({...p,mission:p.mission+1,clues:[],verified:false}));setTarget(null);}else setPanel('journal');};
  const restart=()=>{setProgress(initialProgress());setStation(null);setOutcome(null);setPanel(null);setTarget(null);setPosition({x:0,z:5});setResetKey(k=>k+1);setStarted(false);notify('A fresh adventure is ready.');};
  const touch=(code:string,down:boolean)=>window.dispatchEvent(new KeyboardEvent(down?'keydown':'keyup',{code,bubbles:true}));

  if (currentGame === 'legit-or-scam') {
    return <LegitOrScamGame onBack={() => setCurrentGame('phishing')} />;
  }

  return <main className="game-app" data-ready={ready&&hydrated} data-player-x={position.x.toFixed(2)} data-player-z={position.z.toFixed(2)}>
    <header className="topbar"><button className="brand" onClick={()=>setPanel('games')} aria-label="SafeRon game library"><span className="brand-icon"><ShieldCheck size={25}/></span><span>safe<span className="brand-accent">ron</span><small>SMALL HEROES. SAFE WORLDS.</small></span></button><div className="topbar-divider"/><nav aria-label="Game navigation"><button className="nav-game active" onClick={()=>setPanel(null)}><Search size={16}/>Phishing Detective<span className="live-dot"/></button><button className="nav-game" onClick={()=>setPanel('games')}><Gamepad2 size={17}/>All adventures</button></nav><div className="header-right"><span className="safe-label"><ShieldCheck size={14}/> A safe place to learn</span><button className="profile-button" onClick={()=>setPanel('journal')} aria-label="Open detective progress">R<span/></button></div></header>
    <div className="world"><SceneBoundary><GameScene active={active} target={target} resetKey={resetKey} station={mission.station} verified={progress.verified} onPosition={setPosition} onTarget={setTarget} onStation={interact} onReady={onReady}/></SceneBoundary><div className="world-vignette"/></div>
    <div className="hud">
      <section className="mission-column"><div className="location-pill"><MapPin size={13}/><span>Navrang Public School</span><span className="location-dot"/>Lucknow, UP</div>
        <div className="mission-card glass"><div className="mission-topline"><span className="eyebrow"><span className="live-dot"/> YOUR ADVENTURE</span><span className="chapter-pill">CHAPTER 01</span></div><h1>Phishing<br/>Detective<span className="heading-period">.</span></h1><p className="mission-tagline">Big curiosity. Sharp eyes. Safer clicks.</p><div className="mission-divider"/><div className="mission-count"><span>THE TECH FEST MYSTERY</span><span>{progress.completed.length} / {missions.length}</span></div><div className="progress-track"><span style={{width:`${progress.completed.length/missions.length*100}%`}}/></div>
          <div className="current-mission"><span className="objective-icon"><Search size={18}/></span><div><span className="eyebrow">{finished?'ALL CASES SOLVED':`MISSION ${String(progress.mission+1).padStart(2,'0')}`}</span><h2>{finished?'A safer school starts with you':mission.title}</h2></div></div>
          <p className="mission-description">{!started?'Something strange is happening before the school festival. Ready to follow the clues?':finished?'You asked questions, checked the facts, and helped your friends stay safe.':progress.verified?'You have the facts. Return to the message and decide what to do.':progress.clues.length===0?`Someone has left a message at the ${stations[mission.station].name.toLowerCase()}. Let’s take a closer look.`:'Good detective work! Collect all three clues, then check with Ms. Meera in the courtyard.'}</p>
          {!started?<Button className="w-full" size="lg" onClick={start} disabled={!ready||!hydrated}><Play data-icon="inline-start"/>{ready?'Let’s investigate':'Preparing campus…'}<ArrowRight data-icon="inline-end"/></Button>:<div className="objectives"><div className={cn('objective',progress.clues.length===3&&'complete')}><span>{progress.clues.length===3?<Check size={12}/>:1}</span>Inspect the message <small>{progress.clues.length}/3</small></div><div className={cn('objective',progress.verified&&'complete')}><span>{progress.verified?<Check size={12}/>:2}</span>Check with Ms. Meera</div><div className={cn('objective',progress.completed.includes(progress.mission)&&'complete')}><span>{progress.completed.includes(progress.mission)?<Check size={12}/>:3}</span>Make a safe choice</div></div>}
        </div>
        <div className="kind-note"><span className="note-icon"><Leaf size={17}/></span><p>No rush, detective.<br/><strong>Great questions beat quick answers.</strong></p></div>
      </section>
      <aside className="right-hud"><div className="xp-pill glass"><span className="xp-star"><Star size={18} fill="currentColor"/></span><strong>{progress.xp}</strong><span>XP</span><div/><Shield size={17}/><span>Rookie detective</span></div>
        <div className="utility-buttons"><button className="icon-button glass" aria-label={sound?'Mute sound':'Enable sound'} onClick={()=>setSound(!sound)}>{sound?<Volume2 size={18}/>:<VolumeX size={18}/>}</button><button className="icon-button glass" aria-label="Settings and pause" onClick={()=>setPanel('pause')}><Settings2 size={18}/></button><button className="icon-button glass" aria-label="Help and controls" onClick={()=>setPanel('help')}><CircleHelp size={18}/></button></div>
        <div className={cn('minimap-card glass',!mapOpen&&'collapsed')}><button className="minimap-title" onClick={()=>setMapOpen(!mapOpen)} aria-expanded={mapOpen}><Compass size={14}/><span>THE CAMPUS</span><span>{mapOpen?'−':'+'}</span></button>{mapOpen&&<><div className="minimap" aria-label="Campus map with your location"><span className="map-building north"/><span className="map-building west"/><span className="map-garden one"/><span className="map-garden two"/><span className="map-path"/>{(Object.keys(stations) as StationId[]).map(id=><button key={id} aria-label={`Map: ${stations[id].name}`} onClick={()=>interact(id)} className={cn('map-pin',id===mission.station&&'quest-pin')} style={{left:`${(stations[id].position.x+14)/28*100}%`,top:`${(stations[id].position.z+11)/24*100}%`}}/>)}<span className="map-you" style={{left:`${(position.x+14)/28*100}%`,top:`${(position.z+11)/24*100}%`}}/><span className="map-north">N ↑</span></div><div className="map-legend"><span><i/>You</span><span><i/>Your next clue</span></div></>}</div>
      </aside>
      {active&&nearest?<div className="interact-prompt glass"><span className="interact-symbol"><Search size={20}/></span><div><small>{stations[nearest].name}</small><strong>{nearest==='teacher'?'A little help from a trusted adult':'There’s something to investigate'}</strong></div><button onClick={()=>interact(nearest)}><kbd>E</kbd><span>Interact</span></button></div>:!started?<div className="welcome-caption"><span>WELCOME TO YOUR FIRST CASE</span><p>A little detective.<br/>A big difference.</p><div><span/>Explore. Discover. Protect.</div></div>:guided&&!panel&&!station&&!outcome?<div className="walking-hint"><MousePointer2 size={16}/> Click the ground to walk, or use WASD</div>:null}
      <footer className="bottom-hud"><div className="player-card glass"><div className="player-portrait"><GraduationCap size={29}/></div><div><strong>Hey, Detective!</strong><span><span className="live-dot"/>Ready to make a difference</span></div></div><div className="bottom-actions glass"><button onClick={()=>setPanel('journal')}><BookOpen size={19}/><span>Case journal</span><kbd>J</kbd><span className="journal-count">{progress.clues.length}</span></button><span className="action-divider"/><button onClick={()=>setPanel('help')}><Gamepad2 size={19}/><span>How to play</span></button><span className="action-divider"/><button aria-label="Pause game" onClick={()=>setPanel('pause')}><Pause size={19}/></button></div><div className="save-status"><span className="status-dot"/>{storageError?'Progress cannot be saved':hydrated?'Progress saved on this device':'Loading progress'}</div></footer>
      {active&&<div className="touch-controls" aria-label="Movement controls">{[['ArrowUp',ArrowUp],['ArrowLeft',ArrowLeft],['ArrowDown',ArrowDown],['ArrowRight',ArrowRight]].map(([code,Icon])=>{const ControlIcon=Icon as typeof ArrowUp;return <button key={code as string} aria-label={`Move ${String(code).replace('Arrow','').toLowerCase()}`} onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);touch(code as string,true);}} onPointerUp={()=>touch(code as string,false)} onPointerCancel={()=>touch(code as string,false)} onLostPointerCapture={()=>touch(code as string,false)}><ControlIcon size={20}/></button>;})}</div>}
      {toast&&<div className="game-toast" role="status"><Sparkles size={17}/>{toast}</div>}
    </div>
    <Investigation key={`${station}-${progress.mission}`} station={station} progress={progress} onClose={()=>setStation(null)} onClue={collect} onVerify={verify} onResolve={resolve}/>
    <GameDialog open={outcome!==null} onClose={()=>setOutcome(null)} title={outcome==='success'?'That’s thoughtful detective work!':'Every clue helps you learn'} eyebrow={outcome==='success'?'CASE SOLVED · +100 XP':'LET’S TAKE ANOTHER LOOK'}><div className="outcome-icon">{outcome==='success'?<ShieldCheck size={44}/>:<Search size={44}/>}</div><p className="dialog-copy">{outcome==='success'?mission.lesson:mission.safe?'This announcement was confirmed in person and asks for no secrets. Not every message is a trick. Look at the evidence and try again.':'In our pretend story, trusting this message would put private information at risk. Nothing was actually sent. Ms. Meera’s confirmation gives you the clue you need—try again!'}</p><Button size="lg" onClick={outcome==='success'?next:()=>{setOutcome(null);setStation(mission.station);}}>{outcome==='success'?(finished?'See your detective journal':'Next investigation'):'Try again'}<ArrowRight data-icon="inline-end"/></Button></GameDialog>
    <GameDialog open={panel==='pause'} onClose={()=>setPanel(null)} title="Take a little breather" eyebrow="GAME PAUSED"><p className="dialog-copy">The courtyard can wait. Your clues are safe.</p><div className="settings-list"><label><span><Volume2 size={18}/>Sound effects</span><input type="checkbox" checked={sound} onChange={e=>setSound(e.target.checked)}/></label><label><span><Compass size={18}/>Little detective hints <small>Ages 4–6 · with an adult</small></span><input type="checkbox" checked={guided} onChange={e=>setGuided(e.target.checked)}/></label></div><div className="dialog-actions"><Button size="lg" onClick={()=>setPanel(null)}><Play data-icon="inline-start"/>Back to the adventure</Button><Button variant="outline" size="lg" onClick={restart}><RotateCcw data-icon="inline-start"/>Restart story</Button></div><p className="small-note">Restart clears this game&apos;s progress on this device.</p></GameDialog>
    <GameDialog open={panel==='help'} onClose={()=>setPanel(null)} title="Curiosity is your superpower" eyebrow="DETECTIVE FIELD GUIDE"><div className="help-steps"><div><Footprints/><p><strong>Explore your school</strong>Use WASD or arrow keys. You can also click the ground or a gold marker to walk. On a phone, use the arrow buttons.</p></div><div><Search/><p><strong>Look a little closer</strong>Walk near a marker, then press E or tap Interact. Read the message and collect three clues.</p></div><div><ShieldCheck/><p><strong>Check before you trust</strong>Talk to Ms. Meera in person. Return to the message, and use what you learned to make a safe choice.</p></div></div><p className="small-note">All messages, addresses, and people are fictional. No personal information is collected. Younger children should play with a grown-up.</p><Button size="lg" onClick={()=>setPanel(null)}>Got it. Let’s explore!<ArrowRight data-icon="inline-end"/></Button></GameDialog>
    <GameDialog open={panel==='journal'} onClose={()=>setPanel(null)} title="Your detective journal" eyebrow={`${progress.xp} XP · ${progress.completed.length} OF ${missions.length} CASES SOLVED`}><div className="journal-list">{missions.map((m,i)=><div className={cn('journal-row',i===progress.mission&&'current')} key={m.title}><span>{progress.completed.includes(i)?<Check size={17}/>:String(i+1).padStart(2,'0')}</span><div><strong>{m.title}</strong><small>{progress.completed.includes(i)?m.lesson:i===progress.mission?`${progress.clues.length} clues collected · ${progress.verified?'Teacher confirmation saved':'Check with Ms. Meera'}`:'A new mystery awaits'}</small></div>{progress.completed.includes(i)?<ShieldCheck size={19}/>:i===progress.mission?<Search size={18}/>:null}</div>)}</div>{finished&&<div className="completion-note"><Trophy size={24}/><p><strong>Campus guardian!</strong>You made your school a little safer. Keep asking good questions.</p></div>}<div className="dialog-actions"><Button size="lg" onClick={()=>setPanel(null)}>Back to campus</Button>{finished&&<Button variant="outline" size="lg" onClick={restart}>Play again<RotateCcw data-icon="inline-end"/></Button>}</div></GameDialog>
    <GameDialog open={panel==='games'} onClose={()=>setPanel(null)} title="Small heroes. Big adventures." eyebrow="THE SAFERON COLLECTION">
      <p className="dialog-copy">Learn by exploring, asking questions, and making a difference.</p>
      
      <div className="flex flex-col gap-3 my-3">
        <button
          className="library-active text-left p-4 rounded-xl border border-[#3b7268] bg-[#163832] flex items-center justify-between transition-all hover:bg-[#1a443d]"
          onClick={() => {
            setCurrentGame('phishing');
            setPanel(null);
          }}
        >
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-lg bg-[#27534b] flex items-center justify-center text-white">
              <Search size={22} />
            </span>
            <div>
              <strong className="block text-white font-bold text-sm">Phishing Detective</strong>
              <small className="text-[#a4ccc6] text-xs">The Tech Fest Mystery · 3D Campus Adventure</small>
            </div>
          </div>
          <ArrowRight size={18} className="text-[#64b5a8]" />
        </button>

        <button
          className="text-left p-4 rounded-xl border border-[#9e3f1b]/60 bg-[#2d1b15] flex items-center justify-between transition-all hover:bg-[#3d241d]"
          onClick={() => {
            setCurrentGame('legit-or-scam');
            setPanel(null);
          }}
        >
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-lg bg-[#5a2412] flex items-center justify-center text-[#fca5a5]">
              <ShieldAlert size={22} />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <strong className="block text-white font-bold text-sm">Legit or Scam?</strong>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#9e3f1b] text-white">PLAY NOW</span>
              </div>
              <small className="text-[#e2b0a3] text-xs">The Digital Fact-Checker · UPI, QR, WhatsApp &amp; Fees</small>
            </div>
          </div>
          <ArrowRight size={18} className="text-[#fca5a5]" />
        </button>
      </div>

      <div className="future-games">
        {[
          { id: '03', name: 'WhatsApp Forward Investigation', desc: 'Viral Message Lab · Coming in Next Update' },
          { id: '04', name: 'School Portal Security', desc: 'Lab Defense Simulator · Coming in Next Update' },
          { id: '05', name: 'UPI & QR Scam Simulator', desc: 'Payment Safety Simulator · Coming in Next Update' }
        ].map((g) => (
          <div key={g.name} className="opacity-75">
            <span>{g.id}</span>
            <div>
              <strong>{g.name}</strong>
              <small>{g.desc}</small>
            </div>
          </div>
        ))}
      </div>
      <p className="small-note">Play independently. Each game trains a unique cyber-safety skill.</p>
    </GameDialog>
  </main>;
}
