'use client';

import { useState } from 'react';
import { Dialog } from '@base-ui/react/dialog';
import { ArrowRight, Check, ChevronDown, FileSearch, Flag, Mail, ShieldCheck, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { missions, type Progress, type StationId } from '@/lib/game/missions';

export function GameDialog({open,onClose,title,eyebrow,children}:{open:boolean;onClose:()=>void;title:string;eyebrow?:string;children:React.ReactNode}){
  return <Dialog.Root open={open} onOpenChange={v=>{if(!v)onClose();}}><Dialog.Portal><Dialog.Backdrop className="game-backdrop"/><Dialog.Popup className="game-dialog"><div className="dialog-heading"><div>{eyebrow&&<span className="eyebrow">{eyebrow}</span>}<Dialog.Title>{title}</Dialog.Title></div><Dialog.Close className="icon-button" aria-label="Close panel"><X size={20}/></Dialog.Close></div>{children}</Dialog.Popup></Dialog.Portal></Dialog.Root>;
}
export function Investigation({station,progress,onClose,onClue,onVerify,onResolve}:{station:StationId|null;progress:Progress;onClose:()=>void;onClue:(i:number)=>void;onVerify:()=>void;onResolve:(safe:boolean)=>void}){
  const [expanded,setExpanded]=useState<number|null>(null);const mission=missions[progress.mission];const isTeacher=station==='teacher';const isRelevant=station===mission.station;const done=progress.completed.includes(progress.mission);
  return <GameDialog open={station!==null} onClose={onClose} title={isTeacher?'A trusted second opinion':isRelevant?mission.title:'Nothing to investigate here… yet'} eyebrow={isTeacher?'INDEPENDENT VERIFICATION':'CASE FILE · '+String(progress.mission+1).padStart(2,'0')}>
    {isTeacher?<div className="teacher-dialog"><div className="teacher-avatar">M</div><p className="speaker-name">Ms. Meera <span>Your technology teacher</span></p><p className="dialog-copy">{progress.clues.length>0?mission.verification:'Welcome, detective! Find the message first and look closely at its details. Then come back and we will check it together.'}</p><Button size="lg" disabled={progress.clues.length===0} onClick={onVerify}><ShieldCheck data-icon="inline-start"/>{progress.verified?'Back to investigating':'Save teacher’s confirmation'}</Button><p className="small-note">You checked in person, not through the message&apos;s link.</p></div>:isRelevant?<>
      <div className="simulated-label"><span className="status-dot"/> A pretend message. No links can open.</div>
      <article className="message-paper"><div className="mail-from"><span className="mail-icon"><Mail size={20}/></span><div><strong>{mission.sender.split(' · ')[0]}</strong><span>{mission.sender.split(' · ')[1]}</span></div><span className="mail-time">09:41</span></div><h3>{mission.subject}</h3><p>{mission.message}</p><span className="fake-link">{mission.linkText || (mission.safe?'navrang.example/festival':'award-fast.example/claim')}</span></article>
      <div className="inspection-heading"><h3><FileSearch size={17}/> Look a little closer</h3><span>{progress.clues.length}/3 clues</span></div>
      <div className="clue-list">{mission.clues.map((clue,i)=><div className={`clue ${progress.clues.includes(i)?'found':''}`} key={clue.label}><button onClick={()=>{setExpanded(expanded===i?null:i);onClue(i);}} aria-expanded={expanded===i}><span className="clue-number">{progress.clues.includes(i)?<Check size={13}/>:i+1}</span>{clue.label}<ChevronDown size={16}/></button>{expanded===i&&<p>{clue.detail}</p>}</div>)}</div>
      <div className={`verification-strip ${progress.verified?'verified':''}`}><ShieldCheck size={19}/><span>{progress.verified?'Independently checked with Ms. Meera':'Before deciding, walk over and check with Ms. Meera.'}</span></div>
      {done?<Button size="lg" onClick={onClose}>Case already solved <Check data-icon="inline-end"/></Button>:<div className="decision-buttons"><Button size="lg" disabled={progress.clues.length<3||!progress.verified} onClick={()=>onResolve(false)}><Flag data-icon="inline-start"/>Report this message</Button><Button size="lg" variant="outline" disabled={progress.clues.length<3||!progress.verified} onClick={()=>onResolve(true)}>Trust the message <ArrowRight data-icon="inline-end"/></Button></div>}
      {!progress.verified&&<button className="text-button" onClick={onClose}>Return to the courtyard <ArrowRight size={15}/></button>}
    </>:<><p className="dialog-copy">Follow the gold marker to the current message. You can come back here when a new case begins.</p><Button onClick={onClose}>Keep exploring <ArrowRight data-icon="inline-end"/></Button></>}
  </GameDialog>;
}
