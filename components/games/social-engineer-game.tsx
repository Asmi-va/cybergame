'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePlatform } from '@/lib/platform/store';

type Request = {
  time: string;
  place: string;
  person: string;
  context: string;
  ask: string;
  options: { id: string; label: string; quality: 'best' | 'acceptable' | 'poor'; feedback: string }[];
};

const REQUESTS: Request[] = [
  { time: '09:05', place: 'Badge entrance', person: 'Someone with boxes and no badge', context: 'The visitor board has no delivery booked for this door.', ask: 'They ask you to hold the door because their hands are full.', options: [
    { id: 'hold', label: 'Hold the door', quality: 'poor', feedback: 'A stack of boxes is not a badge. The door stays shut.' },
    { id: 'reception', label: 'Walk them to reception without letting them in', quality: 'best', feedback: 'Reception can check the booking. You stayed helpful without opening the floor.' },
    { id: 'refuse', label: 'Refuse and walk away', quality: 'acceptable', feedback: 'The door stays shut. Pointing them to reception would have been the complete response.' },
  ]},
  { time: '09:40', place: 'Reception', person: 'Receptionist you work with', context: 'The parcel label has your name and today’s date. The courier matches the desk log.', ask: 'Sign for a courier addressed to you.', options: [
    { id: 'sign', label: 'Sign and take the sealed parcel', quality: 'best', feedback: 'The log, the name, and a person you know line up. Signing is proportionate.' },
    { id: 'refuse', label: 'Refuse every parcel today', quality: 'poor', feedback: 'Blanket refusal is not verification. This one matched the desk.' },
    { id: 'open', label: 'Open it at the desk before signing', quality: 'acceptable', feedback: 'You can take it sealed. Opening someone else’s process in the lobby adds nothing.' },
  ]},
  { time: '10:15', place: 'Employee desks', person: 'Colleague sitting at their own desk', context: 'They are holding the printed agenda for the meeting you are both in.', ask: 'Pass the spare agenda to the person beside you.', options: [
    { id: 'pass', label: 'Pass the agenda', quality: 'best', feedback: 'You can see the colleague and the document is an agenda. Help them.' },
    { id: 'verify', label: 'Call security about the agenda', quality: 'poor', feedback: 'Suspicion without a mismatched fact wastes the check. Nothing here is off.' },
    { id: 'ignore', label: 'Ignore them', quality: 'poor', feedback: 'A visible colleague with a meeting paper is an ordinary request.' },
  ]},
  { time: '10:50', place: 'Printer', person: 'Person you do not know', context: 'They are holding a USB and asking for the payroll printer.', ask: 'Print the CFO’s salary file from their USB on your login.', options: [
    { id: 'print', label: 'Print it', quality: 'poor', feedback: 'Your login and a stranger’s USB do not belong on a salary file.' },
    { id: 'escalate', label: 'Refuse and tell finance security', quality: 'best', feedback: 'The request is outside every normal print job. Escalate it.' },
    { id: 'usb', label: 'Take the USB to inspect it later', quality: 'poor', feedback: 'Keeping the USB is not a check. Leave it out of your machine and report the ask.' },
  ]},
  { time: '11:20', place: 'Meeting room', person: 'Voice on the conference phone', context: 'The screen says unknown caller. They claim to be IT.', ask: 'Read your password so they can fix the display.', options: [
    { id: 'read', label: 'Read the password', quality: 'poor', feedback: 'IT does not need your password to see a screen you are looking at.' },
    { id: 'callback', label: 'Hang up and use the IT number on the wall card', quality: 'best', feedback: 'The number on the wall was there before the call. That is the check.' },
    { id: 'their-number', label: 'Call the number they dictate', quality: 'poor', feedback: 'A number from the caller routes back to the caller.' },
  ]},
  { time: '12:05', place: 'Telephone', person: 'Caller saying they are the bank', context: 'Your desk phone shows no internal extension. They want an OTP “to stop a payment”.', ask: 'Read the one-time code that just arrived.', options: [
    { id: 'otp', label: 'Read the code', quality: 'poor', feedback: 'A code read aloud is the payment. Banks do not ask for it.' },
    { id: 'card', label: 'Hang up and call the number on the card', quality: 'best', feedback: 'The card number was printed before this call. Use that.' },
    { id: 'hold', label: 'Ask them to hold while you check with a colleague who also does not have the card', quality: 'acceptable', feedback: 'You did not read the code. The card number is still the right next call.' },
  ]},
  { time: '13:10', place: 'Reception', person: 'Courier in a labelled uniform', context: 'You are covering reception. The slip matches a delivery on today’s board. They do not ask to come upstairs.', ask: 'Leave a sealed package at reception.', options: [
    { id: 'accept', label: 'Accept the sealed package and keep your badge', quality: 'best', feedback: 'The slip matches the board. They do not need a badge or a desk.' },
    { id: 'badge', label: 'Lend a visitor badge so they can deliver it themselves', quality: 'poor', feedback: 'A matching slip is not a reason to lend a badge.' },
    { id: 'refuse', label: 'Refuse the delivery', quality: 'poor', feedback: 'The board already expected this package. Refusing it is not caution, it is a missed delivery.' },
  ]},
  { time: '13:45', place: 'Employee desks', person: 'Contractor with yesterday’s visitor badge', context: 'The date on the badge is yesterday. They want your unlocked laptop.', ask: 'Use your logged-in laptop for two minutes.', options: [
    { id: 'lend', label: 'Slide the laptop over', quality: 'poor', feedback: 'An expired badge and your session are a bad pair.' },
    { id: 'refuse', label: 'Refuse and ask reception to reissue a badge if the visit is real', quality: 'best', feedback: 'The visit can be real after reception checks it. The laptop stays yours.' },
    { id: 'password', label: 'Give them the password instead of the laptop', quality: 'poor', feedback: 'That is the same secret, with a longer life.' },
  ]},
  { time: '14:30', place: 'Meeting room', person: 'Your manager, standing in the room', context: 'You can see them. They ask you to book a room your account is already allowed to book.', ask: 'Book the next room on the company calendar.', options: [
    { id: 'book', label: 'Book it in the company calendar', quality: 'best', feedback: 'You can see the person, and the action is one you are allowed to take. Do it.' },
    { id: 'refuse', label: 'Refuse because managers can be impersonated', quality: 'poor', feedback: 'Impersonation is a risk when you cannot see the person. This person is in the room.' },
    { id: 'security', label: 'Call security first', quality: 'poor', feedback: 'A visible manager and an ordinary booking do not need a security incident.' },
  ]},
  { time: '15:20', place: 'Printer', person: 'No one is waiting', context: 'A printed page of customer records is sitting on the tray. The owner’s name is on the header.', ask: 'Decide what happens to the page.', options: [
    { id: 'leave', label: 'Leave it. The owner might return.', quality: 'poor', feedback: 'A tray is not a safe place for customer records.' },
    { id: 'return', label: 'Take it to the named owner or lock it for them', quality: 'best', feedback: 'The name on the page is an internal route. Use it.' },
    { id: 'bin', label: 'Put it in the open recycling bin', quality: 'poor', feedback: 'Recycling in the open is still leaving it.' },
  ]},
  { time: '16:45', place: 'Telephone', person: 'Internal extension', context: 'The phone display shows the finance colleague’s name from the directory.', ask: 'Send the non-sensitive meeting link you already discussed.', options: [
    { id: 'send', label: 'Send the meeting link', quality: 'best', feedback: 'The extension matches the directory and the link is not a secret. Send it.' },
    { id: 'refuse', label: 'Refuse all afternoon calls', quality: 'poor', feedback: 'The display gave you the verification. Refusing a meeting link helps no one.' },
    { id: 'password', label: 'Also text them your calendar password to be sure', quality: 'poor', feedback: 'The link was enough. A password was not the ask.' },
  ]},
];

export default function SocialEngineerGame() {
  const completeGame = usePlatform((state) => state.completeGame);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const request = REQUESTS[index];
  const choice = request?.options.find((option) => option.id === picked);

  function commit() {
    if (!choice) return;
    const gained = choice.quality === 'best' ? 2 : choice.quality === 'acceptable' ? 1 : 0;
    const nextScore = score + gained;
    if (index === REQUESTS.length - 1) {
      completeGame('the-social-engineer', nextScore, REQUESTS.length * 2, Math.round((nextScore / (REQUESTS.length * 2)) * 200), `${nextScore}/${REQUESTS.length * 2} decision points`);
      setScore(nextScore);
      setDone(true);
      return;
    }
    setScore(nextScore);
    setIndex(index + 1);
    setPicked(null);
  }

  if (done) {
    return (
      <div className="min-h-[100dvh] bg-[#090909] px-4 py-10 text-[#f6efe6]">
        <div className="mx-auto max-w-md rounded-[1.75rem] border border-white/10 bg-[#1b140f] p-6">
          <p className="text-xs tracking-[0.16em] text-[#FF9933]">16:45 · DAY CLOSED</p>
          <h1 className="mt-3 text-3xl font-semibold">Workday filed</h1>
          <p className="mt-3 text-sm text-[#e7dccb]">Decision quality {score}/{REQUESTS.length * 2}.</p>
          <Link href="/academy?tab=practice" className="mt-6 inline-flex rounded-full bg-[#FF9933] px-4 py-3 font-semibold text-[#0b0b0b]">
            Back to practice
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-[#090909] px-3 py-3 text-[#f6efe6] sm:px-4 sm:py-6">
      <div className="mx-auto max-w-md sm:max-w-3xl">
        <div className="mb-3 flex items-center justify-between text-xs text-[#d9cbb8] sm:text-sm">
          <Link href="/academy?tab=practice">Leave day</Link>
          <span>{request.time}</span>
          <span>{index + 1}/{REQUESTS.length}</span>
        </div>
        <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div className="h-full bg-[#FF9933]" style={{ width: `${(index / REQUESTS.length) * 100}%` }} />
        </div>

        <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#1b140f] shadow-2xl">
          <div className="flex items-center justify-center bg-[#241c16] px-4 py-2 sm:hidden">
            <span className="h-1.5 w-16 rounded-full bg-white/15" />
          </div>
          <div className="border-b border-white/10 px-4 py-3">
            <p className="text-[10px] tracking-[0.16em] text-[#FF9933]">WORKDAY ALERT · SIM</p>
            <p className="mt-1 text-xs text-[#b9a890]">{request.place}</p>
          </div>
          <div className="space-y-4 p-4 sm:p-6">
            <h1 className="text-2xl font-semibold sm:text-3xl">{request.person}</h1>
            <p className="text-sm leading-relaxed text-[#e7dccb]">{request.context}</p>
            <p className="rounded-xl bg-black/30 px-4 py-3 text-base">{request.ask}</p>
            <div className="grid gap-2">
              {request.options.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setPicked(option.id)}
                  className={`rounded-2xl border px-4 py-3 text-left text-sm ${picked === option.id ? 'border-[#FF9933] bg-[#FF9933]/10' : 'border-white/10'}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            {choice ? <p className="text-sm text-[#FF9933]">{choice.feedback}</p> : null}
            <button
              type="button"
              disabled={!picked}
              onClick={commit}
              className="w-full rounded-full bg-[#FF9933] px-4 py-3 text-sm font-semibold text-[#0b0b0b] disabled:opacity-40"
            >
              Continue the day
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
