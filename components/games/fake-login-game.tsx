'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { CHAPTERS, SCENARIOS, type Verdict } from '@/lib/games/fake-login/scenarios';
import { usePlatform } from '@/lib/platform/store';
import { GAMES } from '@/lib/platform/catalog';

const OPTIONS: { id: Verdict; label: string; hint: string }[] = [
  { id: 'legitimate', label: 'Legitimate', hint: 'Host matches this brand.' },
  { id: 'suspicious', label: 'Suspicious', hint: 'Do not type a password yet.' },
  { id: 'malicious', label: 'Malicious', hint: 'Built to steal a secret.' },
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
    setPicked(verdict);
    setAnswers((current) => [...current, { id: scenario.id, correct: verdict === scenario.verdict }]);
    setStage('result');
  }

  function next() {
    const upcoming = SCENARIOS[index + 1];
    if (!upcoming) {
      const score = answers.filter((answer) => answer.correct).length;
      const xp = Math.round((score / SCENARIOS.length) * GAMES[0].xp);
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
    <div className="min-h-[100dvh] bg-[#090909] px-3 py-3 text-[#f4efe6] sm:px-4 sm:py-4">
      <div className="mx-auto flex max-w-lg flex-col gap-3 sm:max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#d9cbb8] sm:text-sm">
          <Link href="/academy?tab=practice" className="text-[#FF9933]">Leave sim</Link>
          <span>Ch {scenario.chapter}/4 · {index + 1}/20</span>
          <span>{correct} ok · {formatClock(seconds)}</span>
        </div>

        <div className="mx-auto w-full overflow-hidden rounded-[1.75rem] border border-[#3a2c22] bg-[#14100c] shadow-2xl sm:max-w-none sm:rounded-2xl">
          <div className="flex items-center justify-center bg-[#1c1612] px-4 py-2 sm:hidden">
            <span className="h-1.5 w-16 rounded-full bg-white/15" />
          </div>
          <div className="hidden items-center gap-2 border-b border-[#3a2c22] px-4 py-2 text-xs text-[#d9cbb8] sm:flex">
            <span className="h-2.5 w-2.5 rounded-full bg-[#c46b4a]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#e0b15a]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#7d9a6a]" />
            <span className="ml-3">Meridian Forge · investigation workstation</span>
          </div>
          <p className="border-b border-[#3a2c22] px-4 py-2 text-[10px] tracking-[0.16em] text-[#FF9933] sm:hidden">
            PHONE BROWSER · SIM ONLY
          </p>

          {stage === 'brief' && (
            <div className="space-y-5 p-5 sm:grid sm:gap-6 sm:p-8 md:grid-cols-[1.1fr_0.9fr] sm:space-y-0">
              <div>
                <p className="text-xs tracking-[0.16em] text-[#FF9933]">{chapter.title.toUpperCase()}</p>
                <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">{scenario.title}</h1>
                <p className="mt-4 text-sm leading-relaxed text-[#e7dccb] sm:text-base">{scenario.briefing}</p>
              </div>
              <button
                type="button"
                onClick={() => setStage('browser')}
                className="w-full rounded-2xl bg-[#FF9933] px-4 py-5 text-left text-[#0b0b0b]"
              >
                <span className="text-xs tracking-[0.14em]">OPEN PAGE</span>
                <strong className="mt-2 block text-lg sm:text-xl">View sign-in screen</strong>
                <span className="mt-2 block text-sm">No real password is accepted. This is a practice page.</span>
              </button>
            </div>
          )}

          {stage === 'chapter' && (
            <div className="p-5 sm:p-8">
              <p className="text-xs tracking-[0.16em] text-[#FF9933]">CHAPTER {SCENARIOS[index].chapter}</p>
              <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">{CHAPTERS[SCENARIOS[index].chapter - 1].title}</h1>
              <p className="mt-3 text-sm text-[#e7dccb] sm:text-base">{CHAPTERS[SCENARIOS[index].chapter - 1].summary}</p>
              <button type="button" onClick={() => setStage('brief')} className="mt-6 w-full rounded-full bg-[#FF9933] px-5 py-3 font-semibold text-[#0b0b0b] sm:w-auto">
                Continue
              </button>
            </div>
          )}

          {(stage === 'browser' || stage === 'result') && (
            <div className="p-3 sm:grid sm:grid-cols-[200px_1fr] sm:p-0">
              <aside className="hidden border-r border-[#3a2c22] p-4 text-sm sm:block">
                <p className="text-xs tracking-[0.14em] text-[#FF9933]">CHAPTERS</p>
                {CHAPTERS.map((item) => (
                  <p key={item.id} className={`mt-3 ${item.id === scenario.chapter ? 'text-white' : 'text-[#a89886]'}`}>
                    {item.id}. {item.title}
                  </p>
                ))}
              </aside>
              <div className="space-y-3 sm:p-4">
                <div className="overflow-hidden rounded-2xl border border-[#d7d1c8] bg-[#f7f4ee] text-[#1d1a17]">
                  <div className="flex items-center gap-2 bg-[#ece7df] px-3 py-2">
                    <div className={`min-w-0 flex-1 truncate rounded-full px-3 py-1.5 text-xs sm:text-sm ${scenario.secure ? 'bg-white' : 'bg-[#f8d7d3]'}`}>
                      <span className="mr-2 text-[10px] font-semibold">{scenario.secure ? 'HTTPS' : 'NOT SECURE'}</span>
                      {scenario.url}
                    </div>
                    <button type="button" onClick={() => setInspected(true)} className="shrink-0 rounded-full bg-[#1d1a17] px-3 py-1.5 text-[11px] text-white">
                      Details
                    </button>
                  </div>
                  <div className="space-y-4 p-4">
                    <div>
                      <p className="text-[10px] tracking-[0.14em] text-[#6b6258]">{scenario.brand.toUpperCase()}</p>
                      <h2 className="mt-1 text-xl font-semibold">{scenario.headline}</h2>
                    </div>
                    <form className="rounded-xl border border-[#e4ddd2] bg-white p-3" onSubmit={(event) => event.preventDefault()}>
                      {scenario.fields.map((field) => (
                        <label key={field} className="mb-3 block text-sm">
                          {field}
                          <input disabled value="" placeholder="Disabled in this simulation" className="mt-1 w-full rounded-lg border border-[#e4ddd2] bg-[#fafafa] px-3 py-2.5" />
                        </label>
                      ))}
                      <p className="text-[11px] text-[#6b6258]">No password is stored or sent.</p>
                    </form>
                    {inspected ? (
                      <ul className="space-y-1 border-t border-[#e4ddd2] pt-3 text-sm">
                        {scenario.details.map((detail) => (
                          <li key={detail}>· {detail}</li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </div>

                {stage === 'browser' && (
                  <div className="grid gap-2">
                    {OPTIONS.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => classify(option.id)}
                        className="rounded-xl border border-[#6b5344] bg-[#2c211b] px-4 py-3 text-left"
                      >
                        <strong className="block">{option.label}</strong>
                        <span className="text-xs text-[#d9cbb8]">{option.hint}</span>
                      </button>
                    ))}
                  </div>
                )}

                {stage === 'result' && picked && (
                  <div className="rounded-xl bg-[#2c211b] p-4">
                    <p className="text-xs uppercase tracking-[0.14em] text-[#FF9933]">
                      {picked === scenario.verdict ? 'That classification holds' : `The page is ${scenario.verdict}`}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed">{scenario.explanation}</p>
                    <button type="button" onClick={next} className="mt-4 w-full rounded-full bg-[#FF9933] px-4 py-3 text-sm font-semibold text-[#0b0b0b] sm:w-auto">
                      Continue
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {stage === 'done' && (
            <div className="p-5 sm:p-8">
              <p className="text-xs tracking-[0.16em] text-[#FF9933]">SIM CLOSED</p>
              <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">{correct}/20</h1>
              <p className="mt-2 text-sm text-[#e7dccb]">Time {formatClock(seconds)}. XP once from first completion.</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
                {chapterScores.map((item) => (
                  <article key={item.id} className="rounded-xl bg-[#2c211b] p-3 text-sm">
                    <strong>{item.title}</strong>
                    <p>{item.correct}/5</p>
                  </article>
                ))}
              </div>
              <Link href="/academy?tab=practice" className="mt-6 inline-flex rounded-full bg-[#FF9933] px-4 py-3 font-semibold text-[#0b0b0b]">
                Back to practice
              </Link>
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
