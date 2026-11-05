'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { playNayapurCue } from '@/lib/nayapur/audio';
import { useNayapur } from '@/lib/nayapur/progress';

export type BijliStage =
  | 'talk'
  | 'calling'
  | 'mobile'
  | 'explain'
  | 'simulation'
  | 'quiz'
  | 'done';

const RED_FLAGS = [
  { title: 'Unknown number', detail: 'Saved as “Bijli Board Helpline” only after the chat started. Official boards do not cold-message citizens on WhatsApp.' },
  { title: 'Two-hour threat', detail: 'Disconnection countdowns push panic. Real notices give a bill number and time to verify on the official app or office.' },
  { title: 'Pay-here link', detail: 'The URL looks close to a board site but ends in .support. Never pay from a chat link — open the official app yourself.' },
  { title: 'Ask for UPI PIN / OTP', detail: 'No electricity office needs your UPI PIN or SMS OTP. Those unlock your money, not a bill desk.' },
];

const SIM_STEPS: { prompt: string; options: { id: string; label: string; ok: boolean; tip: string }[] }[] = [
  {
    prompt: 'Uncle’s thumb is over “Pay ₹4,870 Now”. What do you do first?',
    options: [
      { id: 'tap', label: 'Let him tap — disconnection is in 2 hours', ok: false, tip: 'Urgency is the bait. Stopping the tap protects him.' },
      { id: 'stop', label: 'Stop him and open the official bijli app / bill desk instead', ok: true, tip: 'You verify on a channel you chose, not the chat.' },
      { id: 'forward', label: 'Forward the chat to the colony group', ok: false, tip: 'Forwarding spreads panic before facts.' },
    ],
  },
  {
    prompt: 'The chat asks for the OTP that just arrived. Safe move?',
    options: [
      { id: 'share', label: 'Share it so the “officer” can clear the bill', ok: false, tip: 'OTP sharing hands the account to the scammer.' },
      { id: 'hang', label: 'End the chat. OTP is only for apps Uncle opened himself', ok: true, tip: 'Never read an OTP to anyone who messaged first.' },
      { id: 'screenshot', label: 'Send a screenshot of the OTP', ok: false, tip: 'A screenshot is still the secret.' },
    ],
  },
  {
    prompt: 'How should Uncle warn neighbours without spreading the scam link?',
    options: [
      { id: 'paste', label: 'Paste the full message with the link', ok: false, tip: 'Someone else may tap it by mistake.' },
      { id: 'facts', label: 'Describe the trick: fake board chat + urgency + pay link — no link', ok: true, tip: 'Facts without the payload keep the colony safer.' },
      { id: 'ignore', label: 'Say nothing; it was only his phone', ok: false, tip: 'The same number often hits the next flat.' },
    ],
  },
];

const QUIZ: { q: string; options: { id: string; label: string; ok: boolean }[] }[] = [
  {
    q: 'A WhatsApp “bijli board” gives 2 hours to pay via a link. Best first step?',
    options: [
      { id: 'a', label: 'Pay quickly so the line stays on', ok: false },
      { id: 'b', label: 'Check the official app / bill desk yourself', ok: true },
      { id: 'c', label: 'Call the number saved inside that chat', ok: false },
    ],
  },
  {
    q: 'Who is allowed to ask for your UPI PIN?',
    options: [
      { id: 'a', label: 'Electricity board recovery officers', ok: false },
      { id: 'b', label: 'Nobody — PIN stays with you', ok: true },
      { id: 'c', label: 'Colony WhatsApp admins during emergencies', ok: false },
    ],
  },
  {
    q: 'Why is a countdown threat a red flag?',
    options: [
      { id: 'a', label: 'It creates panic so you skip verification', ok: true },
      { id: 'b', label: 'Official systems always use 2-hour timers', ok: false },
      { id: 'c', label: 'Countdowns prove the message is from government', ok: false },
    ],
  },
];

function PhoneChrome({ children, status }: { children: ReactNode; status: string }) {
  return (
    <div className="mx-auto w-full max-w-[320px] overflow-hidden rounded-[2rem] border border-[#2a2a2e] bg-[#0b0b0d] shadow-2xl">
      <div className="flex items-center justify-between bg-[#111] px-5 pb-2 pt-3 text-[10px] text-[#cfcfcf]">
        <span>9:41</span>
        <span className="h-1.5 w-16 rounded-full bg-[#222]" />
        <span>5G ▮▮▮</span>
      </div>
      <div className="border-b border-white/5 bg-[#075e54] px-4 py-3 text-white">
        <p className="text-[10px] uppercase tracking-wider text-white/70">{status}</p>
        <p className="text-sm font-semibold">Bijli Board Helpline</p>
        <p className="text-[11px] text-white/75">+91 98XXX-XX412 · not in contacts</p>
      </div>
      <div className="min-h-[380px] bg-[#0e1621] p-3 text-[13px] text-[#e8eef5]">{children}</div>
    </div>
  );
}

export function BijliMission({
  stage,
  onStage,
  onClose,
}: {
  stage: BijliStage;
  onStage: (stage: BijliStage) => void;
  onClose: () => void;
}) {
  const completeMission = useNayapur((s) => s.completeMission);
  const sound = useNayapur((s) => s.soundEnabled);
  const [simIndex, setSimIndex] = useState(0);
  const [simTip, setSimTip] = useState<string | null>(null);
  const [simOk, setSimOk] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (stage === 'talk' || stage === 'explain') playNayapurCue('talk', sound);
    if (stage === 'calling') playNayapurCue('phone', sound);
    if (stage === 'mobile') playNayapurCue('message', sound);
    if (stage === 'done') playNayapurCue('success', sound);
  }, [stage, sound]);

  if (stage === 'talk') {
    return (
      <Panel title="Neighbourhood Uncle" eyebrow="MISSION 1 · BIJLI BILL KA CHAKKAR">
        <p className="text-sm leading-relaxed text-[#efe7da]">
          Arre beta, wait — don’t go. This number says they are from the bijli board. Line cut in two hours if I don’t pay.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-[#efe7da]">
          I’m calling them now. You stand here. If something feels wrong, stop me.
        </p>
        <button
          onClick={() => { playNayapurCue('tap', sound); onStage('calling'); }}
          className="mt-5 rounded-full bg-[#f0c27a] px-5 py-2.5 text-sm font-semibold text-[#1c140c]"
        >
          Watch Uncle dial
        </button>
        <button onClick={onClose} className="mt-3 block text-xs text-[#b9a890]">Step back for now</button>
      </Panel>
    );
  }

  if (stage === 'calling') {
    return (
      <div className="absolute inset-0 z-40 grid place-items-center bg-black/70 p-4">
        <PhoneChrome status="Outgoing call">
          <div className="flex min-h-[360px] flex-col items-center justify-center gap-4 text-center">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-[#1f2c3a]">
              <div className="h-8 w-8 rounded-full border-2 border-[#8fd4a0]" />
            </div>
            <div>
              <p className="text-lg font-semibold">Calling…</p>
              <p className="mt-1 text-[#9fb0c3]">Bijli Board Helpline</p>
              <p className="mt-3 font-mono text-2xl tracking-widest text-[#f0c27a]">0:04</p>
            </div>
            <p className="max-w-[220px] text-xs text-[#9fb0c3]">
              Uncle puts it on speaker. A rushed voice says “Sir, pay on the link I just sent, otherwise meter seal today.”
            </p>
            <button
              onClick={() => { playNayapurCue('message', sound); onStage('mobile'); }}
              className="rounded-full bg-[#25d366] px-5 py-2 text-sm font-semibold text-[#06210f]"
            >
              Show the chat they sent
            </button>
          </div>
        </PhoneChrome>
      </div>
    );
  }

  if (stage === 'mobile') {
    return (
      <div className="absolute inset-0 z-40 grid place-items-center bg-black/70 p-4">
        <div className="w-full max-w-3xl grid gap-4 lg:grid-cols-[320px_1fr]">
          <PhoneChrome status="WhatsApp · today">
            <div className="space-y-2">
              <Bubble incoming>
                Respected Consumer, your electricity connection will be DISCONNECTED in 2 HOURS due to unpaid bill ₹4,870.
              </Bubble>
              <Bubble incoming>
                Pay immediately via secure link to avoid meter sealing: https://bijli-board-pay.support/pay-now
              </Bubble>
              <Bubble incoming>
                After payment share UPI OTP with officer on this number. Ref: BB/DISC/88421
              </Bubble>
              <Bubble>Uncle: Is this real? My last bill was already paid…</Bubble>
              <Bubble incoming>Sir ignore old receipt. Link is only way. Timer running.</Bubble>
            </div>
          </PhoneChrome>
          <div className="rounded-2xl bg-[#1c1712] p-5">
            <p className="text-xs tracking-[0.14em] text-[#f0c27a]">MOBILE SCREEN</p>
            <h3 className="mt-2 text-xl font-semibold text-[#f3efe7]">Uncle’s phone — scam chat open</h3>
            <p className="mt-3 text-sm leading-relaxed text-[#d9cfc0]">
              The call and the chat work together: fear on the speaker, a pay link in the hand. This is where you step in as beta.
            </p>
            <button
              onClick={() => { playNayapurCue('talk', sound); onStage('explain'); }}
              className="mt-5 rounded-full bg-[#f0c27a] px-5 py-2.5 text-sm font-semibold text-[#1c140c]"
            >
              Beta — explain the scam
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'explain') {
    return (
      <Panel title="Beta explains" eyebrow="RED FLAGS">
        <p className="text-sm leading-relaxed text-[#efe7da]">
          Uncle, put the phone down. This is not the board — this is a payment trap. Look with me:
        </p>
        <ul className="mt-4 space-y-3">
          {RED_FLAGS.map((flag) => (
            <li key={flag.title} className="rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="text-sm font-semibold text-[#f0c27a]">{flag.title}</p>
              <p className="mt-1 text-sm text-[#d9cfc0]">{flag.detail}</p>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-[#efe7da]">
          Next we rehearse the safe moves, then a short quiz so it sticks.
        </p>
        <button
          onClick={() => { setSimIndex(0); setSimTip(null); setSimOk(false); onStage('simulation'); }}
          className="mt-5 rounded-full bg-[#f0c27a] px-5 py-2.5 text-sm font-semibold text-[#1c140c]"
        >
          Start simulation
        </button>
      </Panel>
    );
  }

  if (stage === 'simulation') {
    const step = SIM_STEPS[simIndex];
    return (
      <Panel title="Street simulation" eyebrow={`STEP ${simIndex + 1} / ${SIM_STEPS.length}`}>
        <p className="text-sm leading-relaxed text-[#efe7da]">{step.prompt}</p>
        <div className="mt-4 grid gap-2">
          {step.options.map((opt) => (
            <button
              key={opt.id}
              disabled={!!simTip}
              onClick={() => {
                setSimTip(opt.tip);
                setSimOk(opt.ok);
                playNayapurCue(opt.ok ? 'correct' : 'wrong', sound);
              }}
              className="rounded-xl border border-white/10 px-3 py-2 text-left text-sm hover:border-[#f0c27a] disabled:opacity-60"
            >
              {opt.label}
            </button>
          ))}
        </div>
        {simTip && (
          <div className="mt-4 rounded-xl bg-white/5 p-3 text-sm">
            <p className={simOk ? 'text-[#8fd4a0]' : 'text-[#f0a07a]'}>{simOk ? 'Safe move.' : 'Risky move.'}</p>
            <p className="mt-1 text-[#d9cfc0]">{simTip}</p>
            <button
              className="mt-3 rounded-full bg-[#f0c27a] px-4 py-2 text-sm font-semibold text-[#1c140c]"
              onClick={() => {
                if (!simOk) {
                  setSimTip(null);
                  return;
                }
                if (simIndex + 1 < SIM_STEPS.length) {
                  setSimIndex((i) => i + 1);
                  setSimTip(null);
                  setSimOk(false);
                } else {
                  setQuizIndex(0);
                  setQuizScore(0);
                  setQuizFeedback(null);
                  onStage('quiz');
                }
              }}
            >
              {simOk ? (simIndex + 1 < SIM_STEPS.length ? 'Next situation' : 'Take the quiz') : 'Try again'}
            </button>
          </div>
        )}
      </Panel>
    );
  }

  if (stage === 'quiz') {
    const item = QUIZ[quizIndex];
    return (
      <Panel title="Colony quiz" eyebrow={`QUESTION ${quizIndex + 1} / ${QUIZ.length}`}>
        <p className="text-sm leading-relaxed text-[#efe7da]">{item.q}</p>
        <div className="mt-4 grid gap-2">
          {item.options.map((opt) => (
            <button
              key={opt.id}
              disabled={!!quizFeedback}
              onClick={() => {
                const nextScore = quizScore + (opt.ok ? 1 : 0);
                setQuizScore(nextScore);
                playNayapurCue(opt.ok ? 'correct' : 'wrong', sound);
                setQuizFeedback(opt.ok ? 'Correct.' : 'Not quite — remember: verify on official channels, never share OTP/PIN.');
                window.setTimeout(() => {
                  if (quizIndex + 1 < QUIZ.length) {
                    setQuizIndex((i) => i + 1);
                    setQuizFeedback(null);
                  } else {
                    completeMission('bijli-bill', { trust: 12, stars: 2, coins: 40 });
                    onStage('done');
                  }
                }, 900);
              }}
              className="rounded-xl border border-white/10 px-3 py-2 text-left text-sm hover:border-[#f0c27a] disabled:opacity-60"
            >
              {opt.label}
            </button>
          ))}
        </div>
        {quizFeedback && <p className="mt-3 text-sm text-[#f0c27a]">{quizFeedback}</p>}
      </Panel>
    );
  }

  return (
    <Panel title="Mission clear" eyebrow="BIJLI BILL KA CHAKKAR">
      <p className="text-sm leading-relaxed text-[#efe7da]">
        Uncle deletes the chat, blocks the number, and checks the official app — bill already paid. You earned trust on the street.
      </p>
      <p className="mt-3 text-sm text-[#d9cfc0]">Quiz score locked in. Find Mr. Sharma at the open shop for Mission 2.</p>
      <button onClick={onClose} className="mt-5 rounded-full bg-[#f0c27a] px-5 py-2.5 text-sm font-semibold text-[#1c140c]">
        Return to Nayapur street
      </button>
    </Panel>
  );
}

function Bubble({ children, incoming }: { children: ReactNode; incoming?: boolean }) {
  return (
    <div className={`max-w-[92%] rounded-2xl px-3 py-2 ${incoming ? 'bg-[#1f2c3a] text-left' : 'ml-auto bg-[#005c4b] text-left'}`}>
      {children}
    </div>
  );
}

function Panel({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow: string;
  children: ReactNode;
}) {
  return (
    <div className="absolute inset-0 z-40 grid place-items-end bg-black/45 p-4 sm:place-items-center">
      <div className="w-full max-w-xl rounded-2xl bg-[#1c1712] p-5 shadow-2xl">
        <p className="text-xs tracking-[0.14em] text-[#f0c27a]">{eyebrow}</p>
        <h3 className="mt-1 text-xl font-semibold text-[#f3efe7]">{title}</h3>
        <div className="mt-3">{children}</div>
      </div>
    </div>
  );
}
