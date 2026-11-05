'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import Certificate from '@/components/course/certificate';
import { useImmersive } from '@/components/platform/site-shell';
import { buildFinalQuiz } from '@/lib/courses/final-quiz';
import { HELPLINES } from '@/lib/courses/registry';
import type { CourseCheckpoint, InteractiveCourse, SimAction } from '@/lib/courses/types';
import { xpForCorrect } from '@/lib/courses/types';
import { usePlatform } from '@/lib/platform/store';

type Phase = 'overview' | 'name' | 'learn' | 'simulate' | 'quiz' | 'done';

function needsPlayerName(name: string) {
  const trimmed = name.trim();
  return trimmed.length < 2 || trimmed.toLowerCase() === 'learner';
}

export default function InteractiveCourseExperience({ course }: { course: InteractiveCourse }) {
  const [phase, setPhase] = useState<Phase>('overview');
  const save = usePlatform((state) => state.courses[course.slug]);
  const certificate = usePlatform((state) => state.certificates[course.slug]);
  const name = usePlatform((state) => state.name);
  const finalQuiz = useMemo(() => buildFinalQuiz(course), [course]);

  useImmersive(phase !== 'overview' && phase !== 'name' && phase !== 'done');

  function begin() {
    if (needsPlayerName(name)) {
      setPhase('name');
      return;
    }
    setPhase('learn');
  }

  if (phase === 'overview') {
    return (
      <div className="sr-page">
        <p className="text-sm text-[var(--sr-ink-muted)]">
          <Link href="/">Home</Link> / <Link href="/academy">Academy</Link> / {course.title}
        </p>
        <div className="mt-4 grid gap-4 lg:grid-cols-[1.35fr_0.85fr]">
          <section className="sr-panel p-6 md:p-8">
            <p className="sr-eyebrow">{course.module}</p>
            <h1 className="mt-3 text-4xl text-[var(--sr-ink)]">{course.title}</h1>
            <p className="mt-2 text-lg text-[var(--sr-ink)]">{course.subtitle}</p>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--sr-ink-muted)]">{course.description}</p>
            <div className="mt-5 flex flex-wrap gap-2 text-xs">
              <span className="sr-kind bg-[var(--sr-accent-soft)] text-[var(--sr-accent)]">Course</span>
              <span className="sr-kind bg-[var(--sr-ink-soft)] text-[var(--sr-ink)]">10-question final quiz</span>
              <span className="sr-kind bg-[var(--sr-ink-soft)] text-[var(--sr-ink)]">Pass {Math.round(course.passScore * 100)}%+</span>
              <span className="sr-kind bg-[var(--sr-ink-soft)] text-[var(--sr-ink)]">Up to {course.maxXp} XP</span>
            </div>
            <p className="mt-5 rounded-xl border border-[var(--sr-line)] bg-[var(--sr-bg)] px-4 py-3 text-sm text-[var(--sr-ink-muted)]">
              <span className="font-semibold text-[var(--sr-ink)]">For parents: </span>
              {course.parentNote}
            </p>
          </section>
          <aside className="sr-panel p-5">
            <h2 className="text-xl text-[var(--sr-ink)]">Start this course</h2>
            <p className="mt-2 text-sm text-[var(--sr-ink-muted)]">
              We need your name for the certificate, then: Learn → Simulate → 10-question quiz → Certificate.
            </p>
            <ol className="mt-4 space-y-2 text-sm text-[var(--sr-ink)]">
              <li>1. Confirm your learner name</li>
              <li>2. Lesson panels{course.videoSrc ? ' + intro video' : ''}</li>
              <li>3. Simulation decisions</li>
              <li>4. Ten-question certification quiz</li>
            </ol>
            <p className="mt-3 text-xs text-[var(--sr-ink-muted)]">
              Current name on this device: <strong className="text-[var(--sr-ink)]">{name}</strong>
              {needsPlayerName(name) ? ' (please set your real name next)' : ''}
            </p>
            <button type="button" onClick={begin} className="sr-btn sr-btn-primary mt-5 w-full">
              {save?.completed ? 'Replay course' : 'Start course'}
            </button>
            {certificate ? (
              <button type="button" onClick={() => setPhase('done')} className="sr-btn sr-btn-ghost mt-2 w-full">
                View certificate & next steps
              </button>
            ) : null}
            {course.practiceGameSlug ? (
              <Link href={`/games/${course.practiceGameSlug}`} className="mt-3 block text-center text-sm font-semibold text-[var(--sr-accent)]">
                Optional practice module →
              </Link>
            ) : null}
          </aside>
        </div>
        <section className="sr-panel mt-4 p-6">
          <h2 className="text-xl text-[var(--sr-ink)]">Outcomes</h2>
          <ul className="mt-4 space-y-2">
            {course.outcomes.map((item) => (
              <li key={item} className="rounded-xl bg-[var(--sr-bg)] px-4 py-3 text-sm text-[var(--sr-ink)]">
                {item}
              </li>
            ))}
          </ul>
        </section>
        <HelpStrip />
      </div>
    );
  }

  if (phase === 'name') {
    return <NameGate courseTitle={course.title} onReady={() => setPhase('learn')} onBack={() => setPhase('overview')} />;
  }

  if (phase === 'learn') return <LearnPhase course={course} onNext={() => setPhase('simulate')} onExit={() => setPhase('overview')} />;
  if (phase === 'simulate') return <SimulatePhase course={course} onNext={() => setPhase('quiz')} onExit={() => setPhase('overview')} />;
  if (phase === 'quiz') {
    return (
      <QuizPhase
        course={course}
        questions={finalQuiz}
        onExit={() => setPhase('overview')}
        onDone={() => setPhase('done')}
      />
    );
  }

  return (
    <div className="sr-page">
      <button type="button" onClick={() => setPhase('overview')} className="mb-4 text-sm font-semibold text-[var(--sr-accent)]">
        ← Back to course
      </button>
      {certificate ? (
        <Certificate record={certificate} />
      ) : (
        <p className="text-sm text-[var(--sr-ink-muted)]">Score at least {Math.round(course.passScore * 100)}% on the 10-question quiz to unlock the certificate.</p>
      )}
      <HelpStrip />
    </div>
  );
}

function NameGate({ courseTitle, onReady, onBack }: { courseTitle: string; onReady: () => void; onBack: () => void }) {
  const name = usePlatform((state) => state.name);
  const setName = usePlatform((state) => state.setName);
  const guardianAck = usePlatform((state) => state.guardianAck);
  const setGuardianAck = usePlatform((state) => state.setGuardianAck);
  const [draft, setDraft] = useState(needsPlayerName(name) ? '' : name);
  const [ack, setAck] = useState(guardianAck);
  const valid = draft.trim().length >= 2 && draft.trim().toLowerCase() !== 'learner' && ack;

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col justify-center px-4 py-10">
      <p className="sr-eyebrow">Before you begin</p>
      <h1 className="mt-3 text-3xl text-[var(--sr-ink)]">What should we call you?</h1>
      <p className="mt-3 text-sm text-[var(--sr-ink-muted)]">
        Your name appears on the <strong className="text-[var(--sr-ink)]">{courseTitle}</strong> certificate. It stays on this device only — no account server.
      </p>
      <label className="mt-6 block text-sm font-medium text-[var(--sr-ink)]">
        Learner name
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value.slice(0, 32))}
          placeholder="e.g. Asmi"
          className="sr-input mt-2"
          autoFocus
        />
      </label>
      <label className="mt-4 flex items-start gap-3 text-sm text-[var(--sr-ink-muted)]">
        <input
          type="checkbox"
          className="mt-1"
          checked={ack}
          onChange={(event) => setAck(event.target.checked)}
        />
        <span>
          A parent, guardian, or teacher knows I am using SafeRon. First name only is enough — do not type email, phone, or school ID.
        </span>
      </label>
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          disabled={!valid}
          className="sr-btn sr-btn-primary disabled:opacity-40"
          onClick={() => {
            setName(draft.trim());
            setGuardianAck(true);
            onReady();
          }}
        >
          Continue to lessons
        </button>
        <button type="button" className="sr-btn sr-btn-ghost" onClick={onBack}>
          Back
        </button>
      </div>
    </div>
  );
}

function LearnPhase({ course, onNext, onExit }: { course: InteractiveCourse; onNext: () => void; onExit: () => void }) {
  const [index, setIndex] = useState(0);
  const panel = course.lessons[index];
  const last = index >= course.lessons.length - 1;

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-4xl flex-col px-4 py-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs tracking-[0.14em] text-[var(--sr-accent)]">LEARN · {index + 1}/{course.lessons.length}</p>
        <button type="button" onClick={onExit} className="text-sm text-[var(--sr-ink-muted)]">Exit</button>
      </div>
      {course.videoSrc && index === 0 ? (
        <video className="mt-4 aspect-video w-full rounded-2xl bg-black" controls preload="metadata" src={course.videoSrc} />
      ) : null}
      <article className="mt-4 flex-1 rounded-3xl border border-[var(--sr-line)] bg-[var(--sr-panel)] p-6 md:p-8">
        <h2 className="text-3xl text-[var(--sr-ink)]">{panel.heading}</h2>
        <p className="mt-4 text-base leading-relaxed text-[var(--sr-ink-muted)]">{panel.body}</p>
      </article>
      <div className="mt-4 flex justify-between gap-3">
        <button type="button" disabled={index === 0} onClick={() => setIndex((value) => Math.max(0, value - 1))} className="sr-btn sr-btn-ghost disabled:opacity-40">
          Back
        </button>
        <button type="button" onClick={() => (last ? onNext() : setIndex((value) => value + 1))} className="sr-btn sr-btn-primary">
          {last ? 'Start simulations' : 'Next'}
        </button>
      </div>
    </div>
  );
}

function SimulatePhase({ course, onNext, onExit }: { course: InteractiveCourse; onNext: () => void; onExit: () => void }) {
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<SimAction | null>(null);
  const step = course.simulations[index];
  const correct = chosen === step.correctAction;
  const last = index >= course.simulations.length - 1;

  function pick(action: SimAction) {
    if (chosen) return;
    setChosen(action);
  }

  function next() {
    if (!chosen) return;
    if (last) {
      onNext();
      return;
    }
    setChosen(null);
    setIndex((value) => value + 1);
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-4xl flex-col px-4 py-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs tracking-[0.14em] text-[var(--sr-accent)]">SIMULATE · {index + 1}/{course.simulations.length}</p>
        <button type="button" onClick={onExit} className="text-sm text-[var(--sr-ink-muted)]">Exit</button>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
        <PhoneFrame channel={step.channel} title={step.title} body={step.artifact} />
        <section className="rounded-3xl border border-[var(--sr-line)] bg-[var(--sr-panel)] p-5">
          <h2 className="text-2xl text-[var(--sr-ink)]">{step.title}</h2>
          <p className="mt-2 text-sm text-[var(--sr-ink-muted)]">{step.hint}</p>
          <div className="mt-4 grid gap-2">
            {step.actions.map((action) => (
              <button
                key={action.id}
                type="button"
                onClick={() => pick(action.id)}
                className={`rounded-2xl border px-4 py-3 text-left text-sm ${
                  chosen === action.id
                    ? action.id === step.correctAction
                      ? 'border-emerald-400 bg-emerald-500/15'
                      : 'border-rose-400 bg-rose-500/15'
                    : 'border-[var(--sr-line)] bg-[var(--sr-bg)]'
                }`}
              >
                {action.label}
              </button>
            ))}
          </div>
          {chosen ? (
            <p className={`mt-4 rounded-2xl px-4 py-3 text-sm ${correct ? 'bg-emerald-500/15 text-emerald-100' : 'bg-rose-500/15 text-rose-100'}`}>
              {correct ? step.feedbackCorrect : step.feedbackWrong}
            </p>
          ) : null}
          <button type="button" disabled={!chosen} onClick={next} className="sr-btn sr-btn-primary mt-5 disabled:opacity-40">
            {last ? 'Start 10-question quiz' : 'Next scenario'}
          </button>
        </section>
      </div>
    </div>
  );
}

function QuizPhase({
  course,
  questions,
  onExit,
  onDone,
}: {
  course: InteractiveCourse;
  questions: CourseCheckpoint[];
  onExit: () => void;
  onDone: () => void;
}) {
  const recordCheckpoint = usePlatform((state) => state.recordCheckpoint);
  const completeCourse = usePlatform((state) => state.completeCourse);
  const issueCertificate = usePlatform((state) => state.issueCertificate);
  const [index, setIndex] = useState(0);
  const [choiceId, setChoiceId] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [locked, setLocked] = useState(false);
  const question = questions[index];
  const choice = question.choices.find((item) => item.id === choiceId);
  const last = index >= questions.length - 1;

  function select(id: string) {
    if (locked) return;
    setChoiceId(id);
  }

  function confirm() {
    if (!choice || locked) return;
    setLocked(true);
    recordCheckpoint(course.slug, question.id, { choiceId: choice.id, correct: choice.correct });
    setCorrectCount((value) => value + (choice.correct ? 1 : 0));
  }

  function advance() {
    if (!choice || !locked) return;
    if (!last) {
      setIndex((value) => value + 1);
      setChoiceId(null);
      setLocked(false);
      return;
    }
    const total = questions.length;
    const score = correctCount;
    const ratio = score / total;
    const xp = xpForCorrect(score, course.maxXp, total);
    completeCourse(course.slug, score, total, xp);
    if (ratio >= course.passScore) {
      issueCertificate({
        courseId: course.slug,
        courseTitle: course.certificateTitle,
        score,
        total,
      });
    }
    onDone();
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-3xl flex-col px-4 py-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs tracking-[0.14em] text-[var(--sr-accent)]">
          SIM QUIZ · {index + 1}/10
        </p>
        <button type="button" onClick={onExit} className="text-sm text-[var(--sr-ink-muted)]">Exit</button>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--sr-line)]">
        <div className="h-full bg-[var(--sr-accent)] transition-all" style={{ width: `${((index + (locked ? 1 : 0)) / 10) * 100}%` }} />
      </div>
      <section className="mt-4 flex-1 rounded-3xl border border-[var(--sr-line)] bg-[var(--sr-panel)] p-6">
        <p className="text-xs uppercase tracking-[0.14em] text-[var(--sr-accent)]">{question.principle}</p>
        <h2 className="mt-3 text-2xl text-[var(--sr-ink)]">{question.prompt}</h2>
        <div className="mt-5 grid gap-2">
          {question.choices.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => select(item.id)}
              className={`rounded-2xl border px-4 py-3 text-left text-sm ${
                choiceId === item.id ? 'border-[var(--sr-accent)] bg-[var(--sr-accent-soft)]' : 'border-[var(--sr-line)] bg-[var(--sr-bg)]'
              }`}
            >
              {item.text}
            </button>
          ))}
        </div>
        {locked && choice ? (
          <p className={`mt-4 rounded-2xl px-4 py-3 text-sm ${choice.correct ? 'bg-emerald-500/15 text-emerald-100' : 'bg-rose-500/15 text-rose-100'}`}>
            {choice.feedback}
          </p>
        ) : null}
        <div className="mt-5 flex gap-2">
          {!locked ? (
            <button type="button" disabled={!choiceId} onClick={confirm} className="sr-btn sr-btn-primary disabled:opacity-40">
              Check answer
            </button>
          ) : (
            <button type="button" onClick={advance} className="sr-btn sr-btn-secondary">
              {last ? 'See certificate' : 'Next question'}
            </button>
          )}
        </div>
      </section>
    </div>
  );
}

function PhoneFrame({ channel, title, body }: { channel: string; title: string; body: string }) {
  return (
    <div className="mx-auto w-full max-w-sm rounded-[2rem] border border-[var(--sr-line)] bg-[#0b0b0b] p-3 shadow-xl">
      <div className="rounded-[1.5rem] bg-[#f5f1ea] text-[#111]">
        <div className="flex items-center justify-between px-4 pb-2 pt-3 text-[10px] font-semibold text-[#444]">
          <span>9:41</span>
          <span className="rounded-full bg-[#111] px-3 py-1 text-white">{channel.toUpperCase()}</span>
          <span>SafeRon SIM</span>
        </div>
        <div className="min-h-[280px] px-4 pb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#FF9933]">{title}</p>
          <div className="mt-3 rounded-2xl bg-white p-4 text-sm leading-relaxed shadow-sm">{body}</div>
          <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#888]">Simulation only · not a real app</p>
        </div>
      </div>
    </div>
  );
}

function HelpStrip() {
  return (
    <section className="sr-panel mt-4 p-5">
      <h2 className="sr-eyebrow">Get help</h2>
      <p className="mt-2 text-sm text-[var(--sr-ink-muted)]">If something online feels wrong, tell a trusted adult first.</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        {HELPLINES.map((item) => (
          <div key={item.value} className="rounded-xl bg-[var(--sr-bg)] px-3 py-3 text-sm">
            <p className="font-semibold text-[var(--sr-ink)]">{item.label}: {item.value}</p>
            <p className="mt-1 text-xs text-[var(--sr-ink-muted)]">{item.detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
