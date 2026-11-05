'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePlatform } from '@/lib/platform/store';

const STEPS = [
  { id: 'see', title: 'The alert is on the screen', copy: 'A note covers the desktop of this simulated workstation. Files in the fake list are changing their ending to .locked. Your real computer is not involved.', choices: [
    { id: 'read', label: 'Read the note and the file list', quality: 'best', feedback: 'You looked before acting. The note demands payment. The names are a simulation.' },
    { id: 'pay', label: 'Pay the address in the note', quality: 'poor', feedback: 'The note is not a vendor. Paying is not the first step, and this simulation cannot pay anyone.' },
  ]},
  { id: 'name', title: 'Name what this is', copy: 'Files you could open a minute ago now show a ransom ending, and a note demands money to “return” them.', choices: [
    { id: 'ransomware', label: 'This matches the opening signs of ransomware', quality: 'best', feedback: 'Locked names plus a payment note are the pattern. You still do not touch a real disk.' },
    { id: 'update', label: 'It is a normal software update', quality: 'poor', feedback: 'Updates do not rename your files and demand a payment.' },
  ]},
  { id: 'contain', title: 'The next defensive step', copy: 'The organisation’s card says: disconnect the affected machine from the network, then call security. Do not try to repair shared servers yourself.', choices: [
    { id: 'disconnect', label: 'Turn off this simulated machine’s network connection and stop using it', quality: 'best', feedback: 'Containment here is a story control. It represents unplugging the machine from the office network, not a change to your real adapter.' },
    { id: 'decrypt', label: 'Run the decryptor linked in the note', quality: 'poor', feedback: 'A tool from the note is part of the same incident. Do not run it.' },
    { id: 'reboot', label: 'Keep rebooting to repair the files', quality: 'poor', feedback: 'Rebooting is not the published procedure and can make recovery harder for the team that is.' },
  ]},
  { id: 'report', title: 'Report it', copy: 'Call the security number printed on the wall card, not a number from the ransom note. Tell them what you saw and when.', choices: [
    { id: 'wall', label: 'Report on the wall-card number: what appeared, which machine, what time', quality: 'best', feedback: 'A short report on a known number is the procedure. You did not need a perfect technical write-up.' },
    { id: 'note', label: 'Use the support chat printed in the ransom note', quality: 'poor', feedback: 'That chat belongs to the sender of the note.' },
    { id: 'quiet', label: 'Wait to see if the files return before telling anyone', quality: 'poor', feedback: 'Waiting spends the minutes the procedure is for.' },
  ]},
];

export default function RansomwareGame() {
  const completeGame = usePlatform((state) => state.completeGame);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [log, setLog] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const step = STEPS[index];
  const choice = step?.choices.find((item) => item.id === picked);
  const files = ['budget.xlsx', 'vendor-master.xlsx', 'floor-plan.pdf', 'notes.docx'];

  function commit() {
    if (!choice) return;
    const gained = choice.quality === 'best' ? 1 : 0;
    const next = score + gained;
    const entry = `${step.title}: ${choice.label}`;
    if (index === STEPS.length - 1) {
      completeGame('ransomware-reaction', next, STEPS.length, Math.round((next / STEPS.length) * 160), `${next}/${STEPS.length} procedure steps`);
      setScore(next);
      setLog([...log, entry]);
      setDone(true);
      return;
    }
    setScore(next);
    setLog([...log, entry]);
    setIndex(index + 1);
    setPicked(null);
  }

  if (done) {
    return (
      <div className="min-h-screen bg-[#140c0c] px-6 py-16 text-[#f8ecec]">
        <p className="text-xs tracking-[0.16em] text-[#f0a8a8]">INCIDENT REVIEW</p>
        <h1 className="mt-3 text-4xl font-semibold">The first minutes are closed</h1>
        <p className="mt-3">Procedure steps matched: {score}/{STEPS.length}. Nothing on this computer was encrypted, deleted, or changed.</p>
        <ul className="mt-4 space-y-2 text-sm">{log.map((item) => <li key={item}>{item}</li>)}</ul>
        <p className="mt-4 max-w-xl text-sm text-[#f0c8c8]">Recognise the note and the renamed files. Follow the card: separate the machine from the network, report on a number you already had, and leave repairs to the security team. Do not pay, and do not run a tool from the note.</p>
        <Link href="/games" className="mt-6 inline-block rounded-full bg-[#f0a8a8] px-4 py-2 font-semibold text-black">Back to games</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1010] p-4 text-[#f8ecec]">
      <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-[#5a3030] bg-[#120c0c]">
        <div className="flex items-center justify-between border-b border-[#5a3030] px-4 py-2 text-sm"><span>Simulated workstation · not your files</span><Link href="/games">Exit</Link></div>
        <div className="grid gap-4 p-4 md:grid-cols-[1fr_1fr]">
          <div className="rounded-xl bg-black p-4">
            <p className="text-xs tracking-[0.14em] text-[#f0a8a8]">RANSOM NOTE · SIMULATED</p>
            <p className="mt-3 text-sm">Your simulated files now end in .locked. A payment address is printed here and goes nowhere. There is no wallet and no encryption routine in this lesson.</p>
            <ul className="mt-4 space-y-1 font-mono text-xs text-[#f0c8c8]">{files.map((file) => <li key={file}>{file}.locked</li>)}</ul>
          </div>
          <div>
            <p className="text-xs text-[#f0a8a8]">{index + 1}/{STEPS.length}</p>
            <h1 className="mt-1 text-2xl font-semibold">{step.title}</h1>
            <p className="mt-2 text-sm text-[#f0d0d0]">{step.copy}</p>
            <div className="mt-4 grid gap-2">
              {step.choices.map((item) => (
                <button key={item.id} onClick={() => setPicked(item.id)} className={`rounded-xl border px-3 py-2 text-left text-sm ${picked === item.id ? 'border-[#f0a8a8]' : 'border-white/10'}`}>{item.label}</button>
              ))}
            </div>
            {choice && <p className="mt-3 text-sm text-[#f0c575]">{choice.feedback}</p>}
            <button disabled={!picked} onClick={commit} className="mt-4 rounded-full bg-[#f0a8a8] px-4 py-2 text-sm font-semibold text-black disabled:opacity-40">Continue</button>
          </div>
        </div>
      </div>
    </div>
  );
}
