'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { CHAPTERS, SCENARIOS, type Verdict } from '@/lib/games/fake-login/scenarios';
import { usePlatform } from '@/lib/platform/store';
import { GAMES } from '@/lib/platform/catalog';

const OPTIONS: { id: Verdict; label: string; hint: string }[] = [
  { id: 'legitimate', label: 'Legitimate', hint: 'The host is the one this brand actually uses.' },
  { id: 'suspicious', label: 'Suspicious', hint: 'Do not type a password until someone confirms the host.' },
  { id: 'malicious', label: 'Malicious', hint: 'This page is built to collect a secret.' },
];

export default function FakeLoginGame() {
  const completeGame = usePlatform((state) => state.completeGame);
  const [index, setIndex] = useState(0);
  const [stage, setStage] = useState<'brief' | 'browser' | 'result' | 'chapter' | 'done'>('brief');
  const [inspected, setInspected] = useState(false);
  const [answers, setAnswers] = useState<{ id: string; correct: boolean }[]>([]);
  const [picked, setPicked] = useState<Verdict | null>(null);
  const [started] = useState(() => Date.now());
  const [now, setNow] = useState(() => Date.now());
  const scenario = SCENARIOS[index];
  const chapter = CHAPTERS[scenario.chapter - 1];
  const chapterScores = useMemo(() => CHAPTERS.map((item) => {
    const rows = answers.filter((answer) => SCENARIOS.find((scene) => scene.id === answer.id)?.chapter === item.id);
    return { ...item, correct: rows.filter((row) => row.correct).length, total: rows.length };
  }), [answers]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  function classify(verdict: Verdict) {
    const correct = verdict === scenario.verdict;
    setPicked(verdict);
    setAnswers((current) => [...current, { id: scenario.id, correct }]);
    setStage('result');
  }

  function next() {
    const upcoming = SCENARIOS[index + 1];
    if (!upcoming) {
      const correct = answers.filter((answer) => answer.correct).length;
      const score = correct;
      const xp = Math.round((score / SCENARIOS.length) * (GAMES[0].xp));
      const seconds = Math.round((Date.now() - started) / 1000);
      completeGame('find-the-fake-login', score, SCENARIOS.length, xp, `${score}/20 correct · ${formatClock(seconds)}`);
      setStage('done');
      return;
    }
    if (upcoming.chapter !== scenario.chapter) {
      setIndex(index + 1);
      setStage('chapter');
      setInspected(false);
      setPicked(null);
      return;
    }
    setIndex(index + 1);
    setStage('brief');
    setInspected(false);
    setPicked(null);
  }

  const correct = answers.filter((answer) => answer.correct).length;
  const seconds = Math.round((now - started) / 1000);

  return (
    <div className="min-h-screen bg-[#1a120c] text-[#f4efe6]">
      <div className="mx-auto max-w-6xl px-4 py-4">
        <div className="mb-3 flex items-center justify-between text-sm text-[#d9cbb8]">
          <Link href="/games" className="text-[#f0c575]">Leave the workstation</Link>
          <span>Chapter {scenario.chapter} of 4 · Scenario {index + 1} of 20</span>
          <span>{correct} correct · {formatClock(seconds)}</span>
        </div>
        <div className="overflow-hidden rounded-2xl border border-[#3a2c22] bg-[#241910] shadow-2xl">
          <div className="flex items-center gap-2 border-b border-[#3a2c22] px-4 py-2 text-xs text-[#d9cbb8]">
            <span className="h-2.5 w-2.5 rounded-full bg-[#c46b4a]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#e0b15a]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#7d9a6a]" />
            <span className="ml-3">Meridian Forge · investigation workstation</span>
          </div>
          {stage === 'brief' && (
            <div className="grid gap-6 p-8 md:grid-cols-[1.1fr_0.9fr]">
              <div>
                <p className="text-xs tracking-[0.16em] text-[#f0c575]">{chapter.title.toUpperCase()}</p>
                <h1 className="mt-2 text-3xl font-semibold">{scenario.title}</h1>
                <p className="mt-4 text-[#e7dccb]">{scenario.briefing}</p>
              </div>
              <button onClick={() => setStage('browser')} className="rounded-2xl bg-[#f0c575] px-4 py-6 text-left text-[#2a2118]">
                <span className="text-xs tracking-[0.14em]">BROWSER</span>
                <strong className="mt-2 block text-xl">Open the sign-in page</strong>
                <span className="mt-2 block text-sm">Nothing you type here leaves this simulation. There is no real password field behind the page.</span>
              </button>
            </div>
          )}
          {stage === 'chapter' && (
            <div className="p-8">
              <p className="text-xs tracking-[0.16em] text-[#f0c575]">CHAPTER {SCENARIOS[index].chapter}</p>
              <h1 className="mt-2 text-3xl font-semibold">{CHAPTERS[SCENARIOS[index].chapter - 1].title}</h1>
              <p className="mt-3 max-w-xl text-[#e7dccb]">{CHAPTERS[SCENARIOS[index].chapter - 1].summary}</p>
              <button onClick={() => setStage('brief')} className="mt-6 rounded-full bg-[#f0c575] px-5 py-3 font-semibold text-[#2a2118]">Continue</button>
            </div>
          )}
          {(stage === 'browser' || stage === 'result') && (
            <div className="grid lg:grid-cols-[220px_1fr]">
              <aside className="border-r border-[#3a2c22] p-4 text-sm">
                <p className="text-xs tracking-[0.14em] text-[#f0c575]">CHAPTERS</p>
                {CHAPTERS.map((item) => (
                  <p key={item.id} className={`mt-3 ${item.id === scenario.chapter ? 'text-white' : 'text-[#a89886]'}`}>{item.id}. {item.title}</p>
                ))}
                <p className="mt-6 text-xs text-[#a89886]">Correct {correct} · Missed {answers.length - correct}</p>
              </aside>
              <div className="p-4">
                <div className="overflow-hidden rounded-xl border border-[#d7d1c8] bg-[#f7f4ee] text-[#1d1a17]">
                  <div className="flex items-center gap-2 bg-[#ece7df] px-3 py-2">
                    <div className={`min-w-0 flex-1 truncate rounded-full px-3 py-1 text-sm ${scenario.secure ? 'bg-white' : 'bg-[#f8d7d3]'}`}>
                      <span className="mr-2 text-xs">{scenario.secure ? 'HTTPS' : 'NOT SECURE'}</span>
                      {scenario.url}
                    </div>
                    <button onClick={() => setInspected(true)} className="rounded-full bg-[#1d1a17] px-3 py-1 text-xs text-white">Page details</button>
                  </div>
                  <div className={`grid gap-6 p-6 ${scenario.layout === 'split' ? 'md:grid-cols-2' : ''}`}>
                    <div>
                      <p className="text-xs tracking-[0.14em] text-[#6b6258]">{scenario.brand.toUpperCase()}</p>
                      <h2 className="mt-2 text-2xl font-semibold">{scenario.headline}</h2>
                      {scenario.layout === 'bank' && <p className="mt-3 text-sm text-[#6b6258]">Staff services · simulated page</p>}
                    </div>
                    <form className="rounded-xl border border-[#e4ddd2] bg-white p-4" onSubmit={(event) => event.preventDefault()}>
                      {scenario.fields.map((field) => (
                        <label key={field} className="mb-3 block text-sm">
                          {field}
                          <input disabled value="" placeholder="Disabled in this simulation" className="mt-1 w-full rounded-lg border border-[#e4ddd2] bg-[#fafafa] px-3 py-2" />
                        </label>
                      ))}
                      <p className="text-xs text-[#6b6258]">This control does not accept or store a password.</p>
                    </form>
                  </div>
                  {inspected && (
                    <ul className="space-y-1 border-t border-[#e4ddd2] px-6 py-4 text-sm">
                      {scenario.details.map((detail) => <li key={detail}>· {detail}</li>)}
                    </ul>
                  )}
                </div>
                {stage === 'browser' && (
                  <div className="mt-4 grid gap-2 md:grid-cols-3">
                    {OPTIONS.map((option) => (
                      <button key={option.id} onClick={() => classify(option.id)} className="rounded-xl border border-[#6b5344] bg-[#2c211b] px-3 py-3 text-left">
                        <strong className="block">{option.label}</strong>
                        <span className="text-xs text-[#d9cbb8]">{option.hint}</span>
                      </button>
                    ))}
                  </div>
                )}
                {stage === 'result' && picked && (
                  <div className="mt-4 rounded-xl bg-[#2c211b] p-4">
                    <p className="text-sm uppercase tracking-[0.14em] text-[#f0c575]">{picked === scenario.verdict ? 'That classification holds' : `The page is ${scenario.verdict}`}</p>
                    <p className="mt-2 text-sm leading-relaxed text-[#f4efe6]">{scenario.explanation}</p>
                    <button onClick={next} className="mt-4 rounded-full bg-[#f0c575] px-4 py-2 text-sm font-semibold text-[#2a2118]">Continue</button>
                  </div>
                )}
              </div>
            </div>
          )}
          {stage === 'done' && (
            <div className="p-8">
              <p className="text-xs tracking-[0.16em] text-[#f0c575]">WORKSTATION CLOSED</p>
              <h1 className="mt-2 text-4xl font-semibold">{correct}/20 classifications</h1>
              <p className="mt-2 text-[#e7dccb]">Time {formatClock(seconds)}. XP is awarded once, from this first completion.</p>
              <div className="mt-6 grid gap-3 md:grid-cols-4">
                {chapterScores.map((item) => (
                  <article key={item.id} className="rounded-xl bg-[#2c211b] p-3 text-sm">
                    <strong>{item.title}</strong>
                    <p>{item.correct}/5 in this chapter record</p>
                  </article>
                ))}
              </div>
              <Link href="/games" className="mt-6 inline-block rounded-full bg-[#f0c575] px-4 py-2 font-semibold text-[#2a2118]">Back to games</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function formatClock(total: number) {
  return `${Math.floor(total / 60)}:${(total % 60).toString().padStart(2, '0')}`;
}
