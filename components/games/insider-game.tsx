'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePlatform } from '@/lib/platform/store';

type Round = {
  title: string;
  incident: string;
  task: string;
  insider: string;
  statements: { id: string; text: string; suspicious: boolean }[];
  culprit: string;
};

const ROUNDS: Round[] = [
  {
    title: 'North stair',
    incident: 'The stair door was held for someone whose badge did not beep.',
    task: 'File the visitor count you already collected.',
    insider: 'You were asked, in this practice, to hold that door and say the badge reader was broken.',
    statements: [
      { id: 'isha', text: 'Isha was in the kitchen. The board shows her there.', suspicious: false },
      { id: 'rohan', text: 'Rohan says the reader has been sticky all week.', suspicious: false },
      { id: 'dev', text: 'Dev was by the stair and told reception the reader was broken.', suspicious: true },
    ],
    culprit: 'dev',
  },
  {
    title: 'Finance desk',
    incident: 'An unlabelled USB appeared on the finance desk during lunch.',
    task: 'Lock your own screen before you leave the desk.',
    insider: 'The practice asks you to leave the USB and mention it was “IT’s, for updates”.',
    statements: [
      { id: 'isha', text: 'Isha ate at the canteen. Two people saw her.', suspicious: false },
      { id: 'rohan', text: 'Rohan walked past finance with a USB and said IT had asked.', suspicious: true },
      { id: 'dev', text: 'Dev was on a client call with the camera on.', suspicious: false },
    ],
    culprit: 'rohan',
  },
  {
    title: 'Lift poster',
    incident: 'The guest-wifi poster by the lift was covered with a new code.',
    task: 'Compare the poster with the card reception printed this morning.',
    insider: 'The practice asks you to swap the poster and say facilities refreshed the artwork.',
    statements: [
      { id: 'isha', text: 'Isha had a roll of posters and said facilities changed the artwork.', suspicious: true },
      { id: 'rohan', text: 'Rohan was in a workshop on another floor.', suspicious: false },
      { id: 'dev', text: 'Dev photographed the original poster at 9:10.', suspicious: false },
    ],
    culprit: 'isha',
  },
];

const NAMES = ['Isha', 'Rohan', 'Dev'];

export default function InsiderGame() {
  const completeGame = usePlatform((state) => state.completeGame);
  const [mode, setMode] = useState<'pick' | 'practice' | 'online'>('pick');
  const [role, setRole] = useState<'employee' | 'insider'>('employee');
  const [round, setRound] = useState(0);
  const [taskDone, setTaskDone] = useState(false);
  const [secretDone, setSecretDone] = useState(false);
  const [statement, setStatement] = useState<string | null>(null);
  const [vote, setVote] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [correctVotes, setCorrectVotes] = useState(0);
  const [finished, setFinished] = useState(false);
  const [online, setOnline] = useState('Not connected. This is not a live match.');
  const [roster, setRoster] = useState<string[]>([]);
  const current = ROUNDS[round];

  useEffect(() => {
    if (mode !== 'online') return;
    let socket: WebSocket | null = null;
    try {
      socket = new WebSocket('ws://127.0.0.1:8787');
    } catch {
      setOnline('This browser could not open a realtime socket.');
      return;
    }
    socket.onopen = () => {
      setOnline('Connected to the local realtime server.');
      socket?.send(JSON.stringify({ type: 'join', name: 'Learner', room: 'floor-4' }));
    };
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data as string) as { type: string; roster?: string[]; role?: string; note?: string };
      if (data.roster) setRoster(data.roster);
      if (data.note) setOnline(data.note);
      if (data.role) setOnline(`Role from the server: ${data.role}. This match is live only while the socket stays open.`);
    };
    socket.onerror = () => setOnline('No realtime server is running on this machine. Offline practice is the mode you can finish.');
    socket.onclose = () => setOnline((currentNote) => currentNote.includes('Connected') ? 'The realtime server closed.' : currentNote);
    return () => socket?.close();
  }, [mode]);

  function next() {
    const gained = role === 'employee' && vote === current.culprit ? 1 : 0;
    const total = correctVotes + gained;
    if (round === ROUNDS.length - 1) {
      const score = role === 'employee' ? total : (secretDone ? 1 : 0);
      const max = role === 'employee' ? ROUNDS.length : 1;
      completeGame('insider', score, max, Math.round((score / max) * 120), role === 'employee' ? `${total}/3 votes` : 'Insider practice debrief');
      setCorrectVotes(total);
      setFinished(true);
      return;
    }
    setCorrectVotes(total);
    setRound(round + 1);
    setTaskDone(false);
    setSecretDone(false);
    setStatement(null);
    setVote(null);
    setRevealed(false);
  }

  if (finished) {
    return (
      <div className="min-h-screen bg-[#10131a] px-6 py-16 text-[#e7eef8]">
        <p className="text-xs tracking-[0.16em] text-[#93c5fd]">FLOOR 4 · RESULT</p>
        <h1 className="mt-3 text-4xl font-semibold">The practice match is over</h1>
        <p className="mt-3 max-w-xl">{role === 'employee' ? `You named the insider in ${correctVotes} of 3 rounds.` : 'You saw the insider side of a fictional floor. The debrief is the same either way: unusual access, an unknown USB, and a swapped poster are reports, not puzzles to solve alone.'}</p>
        <p className="mt-3 text-sm text-[#b7c3d6]">This was offline practice. It was not an online multiplayer match.</p>
        <Link href="/games" className="mt-6 inline-block rounded-full bg-white px-4 py-2 text-sm font-semibold text-black">Back to games</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#10131a] text-[#e7eef8]">
      <div className="mx-auto max-w-3xl px-4 py-6">
        <Link href="/games" className="text-sm text-[#93c5fd]">Leave floor 4</Link>
        <h1 className="mt-3 text-3xl font-semibold">INSIDER · Northwind Dynamics</h1>
        {mode === 'pick' && (
          <div className="mt-6 grid gap-3">
            <button onClick={() => { setRole('employee'); setMode('practice'); }} className="rounded-2xl border border-white/10 p-4 text-left"><strong>Offline practice as an employee</strong><p className="text-sm text-[#b7c3d6]">Tasks, a discussion, a vote, and a result. No network.</p></button>
            <button onClick={() => { setRole('insider'); setMode('practice'); }} className="rounded-2xl border border-white/10 p-4 text-left"><strong>Offline practice as the insider</strong><p className="text-sm text-[#b7c3d6]">A fictional role so you can see what the floor is asked to notice. It does not leave this browser.</p></button>
            <button onClick={() => setMode('online')} className="rounded-2xl border border-white/10 p-4 text-left"><strong>Realtime room</strong><p className="text-sm text-[#b7c3d6]">Connects only if the local server is running. Otherwise it stays offline.</p></button>
          </div>
        )}
        {mode === 'online' && (
          <div className="mt-6 rounded-2xl border border-white/10 p-4">
            <p>{online}</p>
            <p className="mt-2 text-sm text-[#b7c3d6]">People in the room: {roster.length ? roster.join(', ') : 'none yet'}.</p>
            <p className="mt-2 text-sm text-[#b7c3d6]">Start the server with <code>pnpm insider-server</code> and open this page in a second browser if you want a live assignment. A single closed tab is not a multiplayer game.</p>
            <button onClick={() => setMode('pick')} className="mt-4 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black">Use offline practice</button>
          </div>
        )}
        {mode === 'practice' && (
          <div className="mt-6">
            <p className="text-xs tracking-[0.14em] text-[#93c5fd]">ROUND {round + 1} / 3 · YOU ARE THE {role.toUpperCase()} · OFFLINE</p>
            <h2 className="mt-2 text-2xl font-semibold">{current.title}</h2>
            <p className="mt-3">{current.incident}</p>
            <label className="mt-4 flex items-center gap-2 text-sm"><input type="checkbox" checked={taskDone} onChange={(event) => setTaskDone(event.target.checked)} />{current.task}</label>
            {role === 'insider' && <label className="mt-2 flex items-center gap-2 text-sm"><input type="checkbox" checked={secretDone} onChange={(event) => setSecretDone(event.target.checked)} />{current.insider}</label>}
            <h3 className="mt-6 font-semibold">Discussion</h3>
            <div className="mt-2 grid gap-2">
              {current.statements.map((item) => (
                <button key={item.id} onClick={() => setStatement(item.id)} className={`rounded-xl border px-3 py-2 text-left text-sm ${statement === item.id ? 'border-[#93c5fd]' : 'border-white/10'}`}>{item.text}</button>
              ))}
            </div>
            {statement && <p className="mt-3 text-sm text-[#d5deea]">{NAMES.map((name) => `${name} repeats what they already said.`).join(' ')} Look for the detail that does not match the room.</p>}
            <h3 className="mt-6 font-semibold">Vote</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {current.statements.map((item) => (
                <button key={item.id} onClick={() => setVote(item.id)} className={`rounded-full px-3 py-2 text-sm ${vote === item.id ? 'bg-[#2563eb]' : 'bg-white/10'}`}>{item.id}</button>
              ))}
            </div>
            {revealed && <p className="mt-4 text-sm text-[#f0c575]">The insider this round was {current.culprit}. {vote === current.culprit ? 'The vote matched the evidence.' : 'The vote missed the person whose story did not fit.'} Report the stair, the USB, or the poster to the floor lead either way.</p>}
            {!revealed ? (
              <button disabled={!taskDone || !vote || (role === 'insider' && !secretDone)} onClick={() => setRevealed(true)} className="mt-4 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black disabled:opacity-40">Close the vote</button>
            ) : (
              <button onClick={next} className="mt-4 rounded-full bg-[#2563eb] px-4 py-2 text-sm font-semibold">Next result</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
