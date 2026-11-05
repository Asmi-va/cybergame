'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePlatform } from '@/lib/platform/store';
import QrFloor from '@/components/games/qr-floor';

type Code = { id: string; room: string; label: string; url: string; secure: boolean; verdict: 'open' | 'ignore' | 'report'; why: string };
type Room = { id: string; name: string; blurb: string };

const ROOMS: Room[] = [
  { id: 'reception', name: 'Reception', blurb: 'The visitor desk and the glass by the turnstiles.' },
  { id: 'open', name: 'Open office', blurb: 'Desks, a coffee point, and the aisle poster.' },
  { id: 'meet', name: 'Meeting room', blurb: 'A whiteboard and the clicker cradle.' },
  { id: 'print', name: 'Print room', blurb: 'The tray and the wall above it.' },
  { id: 'canteen', name: 'Canteen', blurb: 'A table tent and the door on the way out.' },
  { id: 'hall', name: 'Server hallway', blurb: 'The rack end and the floor sign. You do not open the racks.' },
];

const CORRIDOR: Room = { id: 'corridor', name: 'Corridor', blurb: 'The spine between the rooms. The doorways are open.' };

const CODES: Code[] = [
  { id: 'r1', room: 'reception', label: 'Visitor wifi card', url: 'https://guest.meridianforge.example/wifi', secure: true, verdict: 'open', why: 'This is the guest network the company publishes at reception. Opening it joins the guest terms, not a password page.' },
  { id: 'r2', room: 'reception', label: 'Sticker on the glass', url: 'http://meridian-guest-login.example/password', secure: false, verdict: 'report', why: 'A sticker over the glass asks for a password on a different host. Report it. Do not open it.' },
  { id: 'o1', room: 'open', label: 'Monitor bezel card', url: 'https://id.meridianforge.example/login', secure: true, verdict: 'ignore', why: 'The address is the real identity host, but a QR on a bezel is not how you should reach it. Ignore the code and use the bookmark you already have.' },
  { id: 'o2', room: 'open', label: 'Coffee-point prize', url: 'https://free-coffee.meridianforge-rewards.example/', secure: true, verdict: 'report', why: 'A prize domain that is not the company’s is a lure, even with a lock icon. Report the card.' },
  { id: 'm1', room: 'meet', label: 'Clicker cradle', url: 'https://rooms.meridianforge.example/book', secure: true, verdict: 'open', why: 'Room booking on the company’s rooms host matches the sign outside the door.' },
  { id: 'm2', room: 'meet', label: 'Whiteboard corner', url: 'https://meet-join.example/m/secret-recording', secure: true, verdict: 'report', why: 'An unknown host offering a recording of the meeting is not the company room system.' },
  { id: 'p1', room: 'print', label: 'Paper-tray card', url: 'https://print.meridianforge.example/release', secure: true, verdict: 'open', why: 'Print release on the company print host is the normal way to collect a job.' },
  { id: 'p2', room: 'print', label: 'Driver download notice', url: 'http://printer-fix.example/setup.exe', secure: false, verdict: 'report', why: 'A notice that points at a setup file on an unrelated host should be reported. Do not open it.' },
  { id: 'c1', room: 'canteen', label: 'Table tent', url: 'https://menu.maplecanteen.example/today', secure: true, verdict: 'open', why: 'The canteen vendor’s own menu host, with no password, is safe to open.' },
  { id: 'c2', room: 'canteen', label: 'Door poster', url: 'https://refunds.harbourline-pay.example/upi', secure: true, verdict: 'report', why: 'A refund code that wants a payment app is not a menu. Report the poster.' },
  { id: 'h1', room: 'hall', label: 'Rack label', url: 'https://status.meridianforge.example/hall', secure: true, verdict: 'ignore', why: 'The status page is real, and you still do not need it to walk the hall. Ignore it rather than treating every real code as something to open.' },
  { id: 'h2', room: 'hall', label: 'Floor sign', url: 'https://badge-reset.northwind-access.example/', secure: true, verdict: 'report', why: 'Badge resets do not live on a lookalike access domain stuck to the floor.' },
];

const MOVE_KEYS = [
  { label: 'up', code: 'ArrowUp' },
  { label: 'left', code: 'ArrowLeft' },
  { label: 'down', code: 'ArrowDown' },
  { label: 'right', code: 'ArrowRight' },
];

function holdKey(code: string, down: boolean) {
  window.dispatchEvent(new KeyboardEvent(down ? 'keydown' : 'keyup', { code, bubbles: true }));
}

export default function QrHuntGame() {
  const completeGame = usePlatform((state) => state.completeGame);
  const [roomId, setRoomId] = useState(ROOMS[0].id);
  const [active, setActive] = useState<Code | null>(null);
  const [choice, setChoice] = useState<string | null>(null);
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [finished, setFinished] = useState(false);
  const room = ROOMS.find((item) => item.id === roomId) ?? CORRIDOR;
  const solved = Object.values(done).filter(Boolean).length;
  const roomsDone = ROOMS.filter((item) => CODES.filter((code) => code.room === item.id).every((code) => code.id in done)).length;

  function commit() {
    if (!active || !choice) return;
    const correct = choice === active.verdict;
    const next = { ...done, [active.id]: correct };
    setDone(next);
    setActive(null);
    setChoice(null);
    if (Object.keys(next).length === CODES.length) {
      const score = Object.values(next).filter(Boolean).length;
      completeGame('qr-hunt', score, CODES.length, Math.round((score / CODES.length) * 180), `${score}/12 codes`);
      setFinished(true);
    }
  }

  return (
    <div className="relative h-screen overflow-hidden bg-[#10140f] text-[#f3f6ef]">
      <QrFloor
        done={Object.keys(done)}
        suspended={!!active || finished}
        onScan={(id) => {
          const code = CODES.find((item) => item.id === id);
          if (!code || code.id in done) return;
          setActive(code);
          setChoice(null);
        }}
        onRoom={setRoomId}
      />
      <aside className="absolute left-4 top-4 z-20 w-56 rounded-2xl bg-[#0c121a]/85 p-3 text-sm">
        <Link href="/games" className="text-sm text-[#b7e0b2]">Leave the floor</Link>
        <h1 className="mt-3 text-2xl font-semibold">QR Hunt</h1>
        <p className="mt-1 text-sm text-[#c9d4c4]">{solved} recorded · {roomsDone}/6 rooms finished</p>
        <p className="mt-2 text-xs text-[#c9d4c4]">{room.name}. {room.blurb} Walk with WASD or the arrows. Scan when you are close.</p>
        <div className="mt-4 space-y-2">
          {ROOMS.map((item) => (
            <div key={item.id} className={`rounded-xl px-3 py-2 ${item.id === roomId ? 'bg-[#245c32]' : 'bg-white/5'}`}>
              {item.name}
              <span className="block text-xs text-[#c9d4c4]">{CODES.filter((code) => code.room === item.id && code.id in done).length}/2</span>
            </div>
          ))}
        </div>
      </aside>
      <div className="absolute bottom-4 left-4 z-20 flex gap-2 md:hidden">
        {MOVE_KEYS.map((direction) => (
          <button
            key={direction.code}
            className="rounded-full bg-white/10 px-3 py-2 text-sm"
            onPointerDown={(event) => { event.preventDefault(); holdKey(direction.code, true); }}
            onPointerUp={() => holdKey(direction.code, false)}
            onPointerLeave={() => holdKey(direction.code, false)}
            onPointerCancel={() => holdKey(direction.code, false)}
          >
            {direction.label}
          </button>
        ))}
      </div>
      {active && (
        <div className="fixed inset-0 z-40 grid place-items-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#172117] p-5">
            <p className="text-xs tracking-[0.14em] text-[#b7e0b2]">SCANNER · {active.label}</p>
            <p className="mt-3 break-all font-mono text-sm">{active.url}</p>
            <p className="mt-2 text-sm text-[#c9d4c4]">{active.secure ? 'The destination shows a lock.' : 'The destination is not encrypted.'} This code is fictional and is not opened for real.</p>
            <div className="mt-4 grid gap-2">
              {(['open', 'ignore', 'report'] as const).map((option) => (
                <button key={option} onClick={() => setChoice(option)} className={`rounded-xl border px-3 py-2 text-left capitalize ${choice === option ? 'border-[#b7e0b2]' : 'border-white/10'}`}>{option}</button>
              ))}
            </div>
            {choice && <p className="mt-3 text-sm">{choice === active.verdict ? active.why : `The safer call is to ${active.verdict}. ${active.why}`}</p>}
            <button disabled={!choice} onClick={commit} className="mt-4 rounded-full bg-[#d6f5a8] px-4 py-2 text-sm font-semibold text-black disabled:opacity-40">Record decision</button>
          </div>
        </div>
      )}
      {finished && <div className="fixed inset-0 z-40 grid place-items-center bg-black/70 p-4"><div className="rounded-2xl bg-[#172117] p-6"><h2 className="text-2xl font-semibold">Twelve codes reviewed</h2><p className="mt-2">{solved} matched the safer decision. Rooms completed: {roomsDone}/6.</p><Link href="/games" className="mt-4 inline-block rounded-full bg-[#d6f5a8] px-4 py-2 font-semibold text-black">Back to games</Link></div></div>}
    </div>
  );
}
