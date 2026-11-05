'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { playNayapurCue } from '@/lib/nayapur/audio';
import { useNayapur } from '@/lib/nayapur/progress';
import type { MissionId } from '@/lib/nayapur/campaign';

type Option = { id: string; label: string; ok: boolean; tip: string };
type Beat =
  | { kind: 'talk'; title: string; lines: string[]; next: string }
  | { kind: 'artifact'; title: string; subtitle: string; body: ReactNode; next: string }
  | { kind: 'choice'; title: string; prompt: string; options: Option[] }
  | { kind: 'quiz'; title: string; q: string; options: { id: string; label: string; ok: boolean }[] }
  | { kind: 'done'; title: string; lines: string[] };

export function StreetMission({
  missionId,
  reward,
  beats,
  onClose,
}: {
  missionId: MissionId;
  reward: { trust: number; stars: number; coins: number };
  beats: Beat[];
  onClose: () => void;
}) {
  const sound = useNayapur((s) => s.soundEnabled);
  const completeMission = useNayapur((s) => s.completeMission);
  const [index, setIndex] = useState(0);
  const [tip, setTip] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const beat = beats[index];

  useEffect(() => {
    if (!beat) return;
    if (beat.kind === 'talk') playNayapurCue('talk', sound);
    if (beat.kind === 'artifact') playNayapurCue('message', sound);
    if (beat.kind === 'done') playNayapurCue('success', sound);
  }, [index, beat, sound]);

  if (!beat) return null;

  const advance = () => {
    playNayapurCue('tap', sound);
    setTip(null);
    setOk(false);
    if (index + 1 >= beats.length) {
      onClose();
      return;
    }
    setIndex((v) => v + 1);
  };

  return (
    <div className="absolute inset-0 z-40 grid place-items-end bg-black/45 p-4 sm:place-items-center">
      <div className="w-full max-w-xl rounded-2xl bg-[#1c1712] p-5 shadow-2xl">
        {'title' in beat && (
          <>
            <p className="text-xs tracking-[0.14em] text-[#f0c27a]">{missionId.toUpperCase()}</p>
            <h3 className="mt-1 text-xl font-semibold text-[#f3efe7]">{beat.title}</h3>
          </>
        )}

        {beat.kind === 'talk' && (
          <>
            {beat.lines.map((line) => (
              <p key={line} className="mt-3 text-sm leading-relaxed text-[#efe7da]">{line}</p>
            ))}
            <button onClick={advance} className="mt-5 rounded-full bg-[#f0c27a] px-5 py-2.5 text-sm font-semibold text-[#1c140c]">
              Continue
            </button>
          </>
        )}

        {beat.kind === 'artifact' && (
          <>
            <p className="mt-1 text-xs text-[#b9a890]">{beat.subtitle}</p>
            <div className="mt-4 rounded-xl border border-white/10 bg-black/30 p-4 text-sm text-[#efe7da]">{beat.body}</div>
            <button onClick={advance} className="mt-5 rounded-full bg-[#f0c27a] px-5 py-2.5 text-sm font-semibold text-[#1c140c]">
              Continue
            </button>
          </>
        )}

        {beat.kind === 'choice' && (
          <>
            <p className="mt-3 text-sm leading-relaxed text-[#efe7da]">{beat.prompt}</p>
            <div className="mt-4 grid gap-2">
              {beat.options.map((opt) => (
                <button
                  key={opt.id}
                  disabled={!!tip}
                  onClick={() => {
                    setTip(opt.tip);
                    setOk(opt.ok);
                    playNayapurCue(opt.ok ? 'correct' : 'wrong', sound);
                  }}
                  className="rounded-xl border border-white/10 px-3 py-2 text-left text-sm hover:border-[#f0c27a] disabled:opacity-60"
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {tip && (
              <div className="mt-4 rounded-xl bg-white/5 p-3 text-sm">
                <p className={ok ? 'text-[#8fd4a0]' : 'text-[#f0a07a]'}>{ok ? 'Safe move.' : 'Risky move.'}</p>
                <p className="mt-1 text-[#d9cfc0]">{tip}</p>
                <button
                  className="mt-3 rounded-full bg-[#f0c27a] px-4 py-2 text-sm font-semibold text-[#1c140c]"
                  onClick={() => {
                    if (!ok) {
                      setTip(null);
                      return;
                    }
                    advance();
                  }}
                >
                  {ok ? 'Next' : 'Try again'}
                </button>
              </div>
            )}
          </>
        )}

        {beat.kind === 'quiz' && (
          <>
            <p className="mt-3 text-sm leading-relaxed text-[#efe7da]">{beat.q}</p>
            <div className="mt-4 grid gap-2">
              {beat.options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    playNayapurCue(opt.ok ? 'correct' : 'wrong', sound);
                    if (!opt.ok) return;
                    const upcoming = beats[index + 1];
                    if (upcoming?.kind === 'done') completeMission(missionId, reward);
                    if (index + 1 >= beats.length) onClose();
                    else advance();
                  }}
                  className="rounded-xl border border-white/10 px-3 py-2 text-left text-sm hover:border-[#f0c27a]"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </>
        )}

        {beat.kind === 'done' && (
          <>
            {beat.lines.map((line) => (
              <p key={line} className="mt-3 text-sm leading-relaxed text-[#efe7da]">{line}</p>
            ))}
            <button
              onClick={() => {
                playNayapurCue('tap', sound);
                onClose();
              }}
              className="mt-5 rounded-full bg-[#f0c27a] px-5 py-2.5 text-sm font-semibold text-[#1c140c]"
            >
              Return to the street
            </button>
          </>
        )}

        {beat.kind !== 'done' && (
          <button onClick={onClose} className="mt-3 block text-xs text-[#b9a890]">
            Step back for now
          </button>
        )}
      </div>
    </div>
  );
}

export const PAYMENT_BEATS: Beat[] = [
  {
    kind: 'talk',
    title: 'Mr. Sharma · Kirana counter',
    lines: [
      'Beta, this customer says UPI payment of ₹2,400 already went through. He showed me a screenshot and wants the goods now.',
      'My phone did not ding. Look at this image — does it look real to you?',
    ],
    next: 'shot',
  },
  {
    kind: 'artifact',
    title: 'Payment screenshot',
    subtitle: 'Forwarded image on his counter phone',
    body: (
      <div className="space-y-2 font-mono text-[12px]">
        <p className="text-[#8fd4a0]">Payment Successful</p>
        <p>To: Sharma Kirana</p>
        <p>Amount: ₹2,400.00</p>
        <p>UTR: 3291XX8821 · 12:04 PM</p>
        <p className="text-[#f0a07a]">From: unknown · edited timestamp bar</p>
        <p className="text-[#b9a890]">Bank app font looks slightly stretched</p>
      </div>
    ),
    next: 'choice',
  },
  {
    kind: 'choice',
    title: 'Ledger check',
    prompt: 'What should Mr. Sharma do before handing over the bags?',
    options: [
      { id: 'believe', label: 'Trust the screenshot — customer is waiting', ok: false, tip: 'Screenshots are easy to fake. The shop ledger / SMS is the source of truth.' },
      { id: 'ledger', label: 'Check the bank / UPI app notification himself', ok: true, tip: 'Only a credit in his own app counts as payment.' },
      { id: 'partial', label: 'Take half cash now and release goods', ok: false, tip: 'Half-and-half still risks the unpaid half if the shot is fake.' },
    ],
  },
  {
    kind: 'quiz',
    title: 'Quick check',
    q: 'A customer shows a UPI success screenshot. Safest proof of payment?',
    options: [
      { id: 'a', label: 'The screenshot alone', ok: false },
      { id: 'b', label: 'Credit visible in the merchant’s own UPI / bank app', ok: true },
      { id: 'c', label: 'A WhatsApp forward from the customer’s cousin', ok: false },
    ],
  },
  {
    kind: 'done',
    title: 'Mission clear',
    lines: [
      'No credit on Sharma’s phone. The customer walks off. You saved the stock — and unlocked the club computer lab.',
    ],
  },
];

export const PARCEL_BEATS: Beat[] = [
  {
    kind: 'talk',
    title: 'Delivery bag on the scooter',
    lines: [
      'A slip on the bag says: “Customs / handling fee ₹89 unpaid. Pay on this link within 30 minutes or return to warehouse.”',
      'Riya from the next building asked you to check if this is real before she pays.',
    ],
    next: 'slip',
  },
  {
    kind: 'artifact',
    title: 'Fee demand slip',
    subtitle: 'Pinned under the seat strap',
    body: (
      <div className="space-y-2 text-[13px]">
        <p className="font-semibold">SPEEDPOST / COURIER ALERT</p>
        <p>Shipment ID: IN9981XZ</p>
        <p>Pay holding fee: https://speed-post-fee.support/pay</p>
        <p className="text-[#f0a07a]">Timer: 00:28:12</p>
        <p className="text-[#b9a890]">Sender name misspelled · no official tracking domain</p>
      </div>
    ),
    next: 'choice',
  },
  {
    kind: 'choice',
    title: 'Parcel decision',
    prompt: 'Best move for Riya?',
    options: [
      { id: 'pay', label: 'Pay ₹89 on the link so the parcel is not returned', ok: false, tip: 'Fake fee links steal card/UPI details. Real couriers use official apps / COD rules you already agreed.' },
      { id: 'track', label: 'Open the official courier app / site and enter the tracking ID yourself', ok: true, tip: 'You choose the channel. If no fee exists there, it is a scam.' },
      { id: 'call', label: 'Call the number printed on the slip', ok: false, tip: 'The slip number belongs to the scammer.' },
    ],
  },
  {
    kind: 'quiz',
    title: 'Quick check',
    q: 'Unexpected “customs / handling” fee by SMS or slip. First step?',
    options: [
      { id: 'a', label: 'Pay small amounts — ₹89 is cheap insurance', ok: false },
      { id: 'b', label: 'Verify on the official courier channel you open yourself', ok: true },
      { id: 'c', label: 'Forward the link to the colony group for crowdfunding', ok: false },
    ],
  },
  {
    kind: 'done',
    title: 'Mission clear',
    lines: [
      'Official tracking shows no fee. Riya ignores the slip. Investigation room unlocks at the club when you are ready.',
    ],
  },
];
