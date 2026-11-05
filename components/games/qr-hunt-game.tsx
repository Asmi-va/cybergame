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
    <div className="relative h-[100dvh] overflow-hidden bg-[#10140f] text-[#f3f6ef]">
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
      <aside className="absolute left-3 top-3 z-20 max-w-[min(100%-1.5rem,14rem)] rounded-2xl bg-[#0c121a]/90 p-3 text-sm backdrop-blur sm:left-4 sm:top-4 sm:w-56 sm:max-w-none">
        <Link href="/academy?tab=practice" className="text-sm text-[#b7e0b2]">Leave floor</Link>
        <h1 className="mt-2 text-xl font-semibold sm:mt-3 sm:text-2xl">QR Hunt</h1>
        <p className="mt-1 text-xs text-[#c9d4c4] sm:text-sm">{solved} recorded · {roomsDone}/6 rooms</p>
        <p className="mt-2 hidden text-xs text-[#c9d4c4] sm:block">{room.name}. {room.blurb}</p>
        <p className="mt-2 text-[11px] text-[#9fb39a] sm:hidden">{room.name} · walk & scan</p>
        <div className="mt-3 hidden space-y-2 sm:block">
          {ROOMS.map((item) => (
            <div key={item.id} className={`rounded-xl px-3 py-2 ${item.id === roomId ? 'bg-[#245c32]' : 'bg-white/5'}`}>
              {item.name}
              <span className="block text-xs text-[#c9d4c4]">{CODES.filter((code) => code.room === item.id && code.id in done).length}/2</span>
            </div>
          ))}
        </div>
      </aside>

      {active && (
        <div className="fixed inset-0 z-40 grid place-items-end bg-black/70 p-3 sm:place-items-center sm:p-4">
          <div className="w-full max-w-md overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0b0f0c] shadow-2xl">
            <div className="flex items-center justify-center bg-[#121812] px-4 py-2">
              <span className="h-1.5 w-16 rounded-full bg-white/20" />
            </div>
            <div className="p-5">
              <p className="text-[10px] tracking-[0.16em] text-[#b7e0b2]">PHONE SCANNER · SIM</p>
              <p className="mt-2 text-lg font-semibold">{active.label}</p>
              <p className="mt-3 break-all rounded-xl bg-black/50 px-3 py-2 font-mono text-xs text-[#d7eccf]">{active.url}</p>
              <p className="mt-2 text-sm text-[#c9d4c4]">
                {active.secure ? 'Destination shows a lock.' : 'Destination is not encrypted.'} Fiction only — nothing opens for real.
              </p>
              <div className="mt-4 grid gap-2">
                {(['open', 'ignore', 'report'] as const).map((verdict) => (
                  <button
                    key={verdict}
                    type="button"
                    onClick={() => setChoice(verdict)}
                    className={`rounded-xl border px-4 py-3 text-left text-sm capitalize ${choice === verdict ? 'border-[#FF9933] bg-[#FF9933]/15' : 'border-white/10'}`}
                  >
                    {verdict}
                  </button>
                ))}
              </div>
              {choice ? (
                <p className="mt-3 text-sm text-[#d7eccf]">
                  {choice === active.verdict ? active.why : `Safer call: ${active.verdict}. ${active.why}`}
                </p>
              ) : null}
              <button
                type="button"
                disabled={!choice}
                onClick={commit}
                className="mt-4 w-full rounded-full bg-[#FF9933] px-4 py-3 text-sm font-semibold text-[#0b0b0b] disabled:opacity-40"
              >
                Record decision
              </button>
            </div>
          </div>
        </div>
      )}

      {finished && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4">
          <div className="w-full max-w-md rounded-3xl bg-[#172117] p-6 text-center">
            <p className="text-xs tracking-[0.16em] text-[#b7e0b2]">FLOOR CLEARED</p>
            <h2 className="mt-2 text-3xl font-semibold">{solved}/12 codes</h2>
            <Link href="/academy?tab=practice" className="mt-6 inline-block rounded-full bg-[#FF9933] px-5 py-2 text-sm font-semibold text-[#0b0b0b]">
              Back to practice
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
