'use client';

import Link from 'next/link';
import { useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Certificate from '@/components/course/certificate';
import { CHECKPOINTS, COURSE_LANGUAGES, EMAIL_PHISHING_COURSE, type CourseCheckpoint } from '@/lib/courses/email-phishing';
import { buildCheckpointFinalQuiz } from '@/lib/courses/final-quiz';
import type { CourseCheckpoint as FinalCheckpoint } from '@/lib/courses/types';
import { GUIDES, GuidePortrait, guideById } from '@/lib/platform/guides';
import { usePlatform } from '@/lib/platform/store';
import { useImmersive } from '@/components/platform/site-shell';

type Timeline = { duration: number; checkpoints: { id: string; at: number }[]; video: string; subtitles: string };

export default function CourseExperience() {
  const params = useSearchParams();
  const save = usePlatform((state) => state.courses[EMAIL_PHISHING_COURSE.slug]);
  const setGuide = usePlatform((state) => state.setGuide);
  const learnerName = usePlatform((state) => state.name);
  const setName = usePlatform((state) => state.setName);
  const certificate = usePlatform((state) => state.certificates[EMAIL_PHISHING_COURSE.slug]);
  const [showCert, setShowCert] = useState(false);
  const initialGuide = params.get('guide') || save?.guideId || 'mira';
  const [guideId, setGuideId] = useState(initialGuide);
  const [language, setLanguage] = useState(save?.language || 'en');
  const [playing, setPlaying] = useState(false);
  const [replaying, setReplaying] = useState(false);
  const guide = guideById(guideId);
  const locale = COURSE_LANGUAGES.find((item) => item.id === language) ?? COURSE_LANGUAGES[0];
  const nameReady = learnerName.trim().length >= 2 && learnerName.trim().toLowerCase() !== 'learner';

  useImmersive(playing);

  function start(replay: boolean) {
    if (!nameReady) return;
    setGuide(EMAIL_PHISHING_COURSE.slug, guideId, language);
    setReplaying(replay);
    setPlaying(true);
  }

  if (playing) {
    return <CoursePlayer guideName={guide.name} replay={replaying} resume={!replaying} onExit={() => setPlaying(false)} />;
  }

  if (showCert && certificate) {
    return (
      <div className="sr-page">
        <Certificate record={certificate} onClose={() => setShowCert(false)} />
      </div>
    );
  }

  const progress = save?.completedCheckpoints.length ?? 0;

  return (
    <div className="sr-page">
      <p className="text-sm text-[var(--sr-ink-muted)]"><Link href="/">Home</Link> / <Link href="/courses">Courses</Link> / {EMAIL_PHISHING_COURSE.title}</p>
      <div className="mt-4 grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
        <section className="sr-panel p-6 md:p-8">
          <p className="sr-eyebrow">{EMAIL_PHISHING_COURSE.module}</p>
          <h1 className="mt-3 text-4xl text-[var(--sr-ink)]">{EMAIL_PHISHING_COURSE.title}</h1>
          <p className="mt-2 text-lg text-[var(--sr-ink)]">{EMAIL_PHISHING_COURSE.subtitle}</p>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--sr-ink-muted)]">{EMAIL_PHISHING_COURSE.description}</p>
          <div className="mt-5 flex flex-wrap gap-2 text-xs">
            <span className="sr-kind bg-[var(--sr-accent-soft)] text-[var(--sr-accent)]">Course</span>
            <span className="sr-kind bg-[var(--sr-ink-soft)] text-[var(--sr-ink)]">{EMAIL_PHISHING_COURSE.durationLabel}</span>
            <span className="sr-kind bg-[var(--sr-ink-soft)] text-[var(--sr-ink)]">10-question sim quiz</span>
            <span className="sr-kind bg-[var(--sr-ink-soft)] text-[var(--sr-ink)]">Up to 160 XP</span>
          </div>
        </section>
        <aside className="sr-panel p-5">
          <h2 className="text-xl text-[var(--sr-ink)]">Start the lesson</h2>
          <p className="mt-2 text-sm text-[var(--sr-ink-muted)]">
            Name first → film → 10-question sim quiz → certificate with what you learned and where to go next.
          </p>
          <p className="mt-3 text-xs uppercase tracking-[0.14em] text-[var(--sr-ink-muted)]">Guide</p>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {GUIDES.map((item) => (
              <button key={item.id} onClick={() => setGuideId(item.id)} className={`rounded-lg border p-1 ${item.id === guideId ? 'border-[var(--sr-accent)]' : 'border-[var(--sr-line)] bg-[var(--sr-bg)]'}`} aria-pressed={item.id === guideId}>
                <GuidePortrait guide={item} size={48} />
                <span className="block text-center text-[11px]">{item.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>
          <label className="mt-4 block text-xs uppercase tracking-[0.14em] text-[var(--sr-ink-muted)]">
            Language
            <select value={language} onChange={(event) => setLanguage(event.target.value)} className="sr-input mt-2 text-sm">
              {COURSE_LANGUAGES.map((item) => (
                <option key={item.id} value={item.id}>{item.label}{item.narration ? '' : ' · narration coming'}</option>
              ))}
            </select>
          </label>
          {!locale.narration && <p className="mt-2 text-xs text-[var(--sr-ink-muted)]">English narration will play. {locale.label} audio is not recorded yet.</p>}
          <label className="mt-4 block text-xs uppercase tracking-[0.14em] text-[var(--sr-ink-muted)]">
            Your name (for the certificate)
            <input
              value={learnerName === 'Learner' ? '' : learnerName}
              onChange={(event) => setName(event.target.value)}
              className="sr-input mt-2 text-sm normal-case tracking-normal"
              placeholder="Type your name"
            />
          </label>
          {!nameReady ? <p className="mt-2 text-xs text-[var(--sr-accent)]">Enter your name before starting.</p> : null}
          {save?.completed ? (
            <button onClick={() => start(true)} disabled={!nameReady} className="sr-btn sr-btn-primary mt-4 w-full disabled:opacity-40">Replay from the start</button>
          ) : (
            <button onClick={() => start(false)} disabled={!nameReady} className="sr-btn sr-btn-primary mt-4 w-full disabled:opacity-40">
              {progress > 0 ? 'Resume course' : 'Start course'}
            </button>
          )}
          {certificate ? (
            <button type="button" onClick={() => setShowCert(true)} className="sr-btn sr-btn-ghost mt-2 w-full">
              View certificate & next steps
            </button>
          ) : null}
          <p className="mt-3 text-xs leading-relaxed text-[var(--sr-ink-muted)]">
            Film checks {Math.min(progress, 5)}/5 · then 10Q quiz. {save?.firstAttempt ? `First attempt ${save.firstAttempt.correct}/${save.firstAttempt.total}.` : 'Your first completion score is kept.'}
          </p>
        </aside>
      </div>

      <section className="sr-panel mt-4 p-6">
        <h2 className="text-xl text-[var(--sr-ink)]">Key facts</h2>
        <ul className="mt-4 grid gap-2 text-sm text-[var(--sr-ink-muted)] md:grid-cols-2">
          {EMAIL_PHISHING_COURSE.facts.map((fact) => <li key={fact}>· {fact}</li>)}
        </ul>
      </section>
      <section className="sr-panel mt-4 p-6">
        <h2 className="text-xl text-[var(--sr-ink)]">Outcomes</h2>
        <ul className="mt-4 space-y-2">
          {EMAIL_PHISHING_COURSE.outcomes.map((item) => (
            <li key={item} className="rounded-xl bg-[var(--sr-bg)] px-4 py-3 text-sm text-[var(--sr-ink)]">{item}</li>
          ))}
        </ul>
      </section>
      <section className="sr-panel mt-4 p-6">
        <h2 className="text-xl text-[var(--sr-ink)]">The lesson in writing</h2>
        <div className="mt-4 space-y-4">
          {EMAIL_PHISHING_COURSE.written.map((section) => (
            <article key={section.heading}>
              <h3 className="font-semibold text-[var(--sr-ink)]">{section.heading}</h3>
              <p className="mt-1 text-sm leading-relaxed text-[var(--sr-ink-muted)]">{section.body}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function CoursePlayer({ guideName, replay, resume, onExit }: { guideName: string; replay: boolean; resume: boolean; onExit: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const save = usePlatform((state) => state.courses[EMAIL_PHISHING_COURSE.slug]);
  const recordCheckpoint = usePlatform((state) => state.recordCheckpoint);
  const [timeline, setTimeline] = useState<Timeline | null>(null);
  const [loadError, setLoadError] = useState('');
  const [waiting, setWaiting] = useState(true);
  const [paused, setPaused] = useState(true);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [active, setActive] = useState<CourseCheckpoint | null>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const [sessionAnswers, setSessionAnswers] = useState<Record<string, { choiceId: string; correct: boolean }>>(() => (replay ? {} : save?.answers ?? {}));
  const [phase, setPhase] = useState<'film' | 'quiz' | 'done'>('film');
  const [startedAt, setStartedAt] = useState(false);
  const finalQuiz = useMemo(() => buildCheckpointFinalQuiz(CHECKPOINTS), []);

  const checkpoints = useMemo(() => {
    const marks = timeline?.checkpoints ?? [];
    return CHECKPOINTS.map((question) => ({ ...question, at: marks.find((mark) => mark.id === question.id)?.at ?? 0 }));
  }, [timeline]);

  function nextUnanswered(current = time) {
    return checkpoints.find((item) => item.at > 0 && current >= item.at - 0.05 && !sessionAnswers[item.id]) ?? checkpoints.find((item) => item.at > 0 && !sessionAnswers[item.id] && current + 0.2 >= item.at);
  }

  function onTime(current: number) {
    setTime(current);
    if (active || phase !== 'film') return;
    const hit = checkpoints.find((item) => item.at > 0 && !sessionAnswers[item.id] && current >= item.at - 0.15);
    if (!hit || !videoRef.current) return;
    videoRef.current.pause();
    videoRef.current.currentTime = hit.at;
    setPaused(true);
    setActive(hit);
    setPicked(null);
  }

  function guardSeek() {
    const video = videoRef.current;
    if (!video || !timeline) return;
    const pending = checkpoints.find((item) => item.at > 0 && !sessionAnswers[item.id]);
    if (pending && video.currentTime > pending.at + 0.2) {
      video.currentTime = Math.max(0, pending.at - 0.05);
    }
  }

  function choose(choiceId: string, correct: boolean) {
    if (!active || sessionAnswers[active.id]) return;
    const answer = { choiceId, correct };
    setPicked(choiceId);
    setSessionAnswers((current) => ({ ...current, [active.id]: answer }));
    if (!replay) recordCheckpoint(EMAIL_PHISHING_COURSE.slug, active.id, answer);
  }

  function continueFilm() {
    setActive(null);
    setPicked(null);
    videoRef.current?.play();
    setPaused(false);
  }

  function finishFilm() {
    if (phase !== 'film') return;
    setPhase('quiz');
  }

  async function boot(video: HTMLVideoElement) {
    if (startedAt) return;
    setStartedAt(true);
    try {
      const response = await fetch('/courses/email-phishing/timeline.json');
      if (!response.ok) throw new Error('missing');
      const data = (await response.json()) as Timeline;
      setTimeline(data);
      if (resume && !replay && save?.completedCheckpoints.length) {
        const last = data.checkpoints.filter((item) => save.completedCheckpoints.includes(item.id)).at(-1);
        if (last) video.currentTime = last.at + 0.2;
      }
    } catch {
      setLoadError('The lesson film is still being prepared. Refresh in a moment.');
    }
  }

  const selected = active?.choices.find((item) => item.id === picked);
  const answered = active ? Boolean(sessionAnswers[active.id]) : false;

  if (phase === 'quiz') {
    return (
      <EmailFinalQuiz
        questions={finalQuiz}
        replay={replay}
        onExit={onExit}
        onDone={() => setPhase('done')}
      />
    );
  }

  if (phase === 'done') {
    return <Completion replay={replay} onExit={onExit} />;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 text-sm">
        <button onClick={onExit} className="text-[#93c5fd]">Leave lesson</button>
        <span>Guided by {guideName}</span>
        <span>{Object.keys(sessionAnswers).length}/5 film checks · then 10Q quiz</span>
      </div>
      <div className="relative mx-auto max-w-5xl px-4">
        {waiting && !loadError && <div className="absolute inset-0 z-10 grid place-items-center text-sm text-[#93a4bf]">Loading lesson…</div>}
        {loadError && <p className="py-20 text-center text-sm text-[#f0c575]">{loadError}</p>}
        <video
          ref={videoRef}
          className="aspect-video w-full rounded-xl bg-[#05070d]"
          src="/courses/email-phishing/lesson.mp4"
          preload="auto"
          playsInline
          onLoadedMetadata={(event) => {
            setDuration(event.currentTarget.duration);
            setWaiting(false);
            void boot(event.currentTarget);
          }}
          onWaiting={() => setWaiting(true)}
          onPlaying={() => { setWaiting(false); setPaused(false); }}
          onPause={() => setPaused(true)}
          onTimeUpdate={(event) => {
            const tracks = event.currentTarget.textTracks;
            for (let index = 0; index < tracks.length; index += 1) tracks[index].mode = active ? 'hidden' : 'showing';
            onTime(event.currentTarget.currentTime);
          }}
          onSeeking={guardSeek}
          onEnded={finishFilm}
          onVolumeChange={(event) => setVolume(event.currentTarget.volume)}
        >
          <track kind="subtitles" src="/courses/email-phishing/lesson.en.vtt" srcLang="en" label="English" default />
        </video>
        {active && (
          <div className="absolute inset-0 z-20 grid place-items-center bg-black/80 p-4">
          <div className="max-h-full w-full max-w-2xl overflow-auto rounded-2xl border border-white/10 bg-[#0e1728] p-5 shadow-2xl">
            <p className="text-xs uppercase tracking-[0.14em] text-[#93c5fd]">Checkpoint · the film is waiting</p>
            <h2 className="mt-2 text-lg font-semibold">{active.prompt}</h2>
            <div className="mt-3 grid gap-2">
              {active.choices.map((choice) => {
                const chosen = sessionAnswers[active.id]?.choiceId === choice.id;
                return (
                  <button
                    key={choice.id}
                    disabled={answered}
                    onClick={() => choose(choice.id, choice.correct)}
                    className={`rounded-xl border px-3 py-2 text-left text-sm ${chosen ? 'border-[#60a5fa] bg-[#13233c]' : 'border-white/10'} ${answered && choice.correct ? 'border-[#34d399]' : ''} ${answered && chosen && !choice.correct ? 'border-[#f07178]' : ''}`}
                  >
                    {choice.text}
                  </button>
                );
              })}
            </div>
            {answered && selected && (
              <div className="mt-3 rounded-xl bg-white/5 p-3 text-sm">
                <p>{selected.feedback}</p>
                <p className="mt-2 text-[#f0c575]">{active.principle}</p>
              </div>
            )}
            <div className="mt-3 flex justify-end">
              <button disabled={!answered} onClick={continueFilm} className="rounded-full bg-[#2563eb] px-4 py-2 text-sm font-semibold disabled:opacity-40">Continue</button>
            </div>
          </div>
          </div>
        )}
        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
          <button
            onClick={() => {
              const video = videoRef.current;
              if (!video || active) return;
              if (video.paused) void video.play();
              else video.pause();
            }}
            className="rounded-full bg-white px-4 py-2 font-semibold text-black"
          >
            {paused ? 'Play' : 'Pause'}
          </button>
          <span className="tabular-nums text-[#93a4bf]">{formatTime(time)} / {formatTime(duration || timeline?.duration || 0)}</span>
          <input
            aria-label="Timeline"
            className="min-w-40 flex-1"
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={Math.min(time, duration || 0)}
            onChange={(event) => {
              const video = videoRef.current;
              if (!video) return;
              const pending = checkpoints.find((item) => item.at > 0 && !sessionAnswers[item.id]);
              const requested = Number(event.target.value);
              video.currentTime = pending ? Math.min(requested, pending.at) : requested;
            }}
          />
          <label className="flex items-center gap-2 text-[#93a4bf]">
            Volume
            <input aria-label="Volume" type="range" min={0} max={1} step={0.05} value={volume} onChange={(event) => { if (videoRef.current) videoRef.current.volume = Number(event.target.value); }} />
          </label>
          <button onClick={() => videoRef.current?.requestFullscreen()} className="rounded-full border border-white/15 px-3 py-2">Fullscreen</button>
        </div>
        <p className="mt-2 text-xs text-[#93a4bf]">English subtitles are on. After the film: 10-question sim quiz, then certificate.</p>
      </div>
    </div>
  );
}

function EmailFinalQuiz({
  questions,
  replay,
  onExit,
  onDone,
}: {
  questions: FinalCheckpoint[];
  replay: boolean;
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

  function confirm() {
    if (!choice || locked) return;
    setLocked(true);
    if (!replay) recordCheckpoint(EMAIL_PHISHING_COURSE.slug, question.id, { choiceId: choice.id, correct: choice.correct });
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
    if (!replay) {
      completeCourse(EMAIL_PHISHING_COURSE.slug, score, total, Math.round((score / total) * EMAIL_PHISHING_COURSE.maxXp));
      if (score / total >= 0.7) {
        issueCertificate({
          courseId: EMAIL_PHISHING_COURSE.slug,
          courseTitle: 'Modern Email Phishing',
          score,
          total,
        });
      }
    }
    onDone();
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col bg-[#090909] px-4 py-6 text-[#f6f1e8]">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs tracking-[0.14em] text-[#FF9933]">SIM QUIZ · {index + 1}/10</p>
        <button type="button" onClick={onExit} className="text-sm text-[#9c968c]">Exit</button>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#2a2a2a]">
        <div className="h-full bg-[#FF9933] transition-all" style={{ width: `${((index + (locked ? 1 : 0)) / 10) * 100}%` }} />
      </div>
      <section className="mt-4 flex-1 rounded-3xl border border-[#2a2a2a] bg-[#121212] p-6">
        <p className="text-xs uppercase tracking-[0.14em] text-[#FF9933]">{question.principle}</p>
        <h2 className="mt-3 text-2xl">{question.prompt}</h2>
        <div className="mt-5 grid gap-2">
          {question.choices.map((item) => (
            <button
              key={item.id}
              type="button"
              disabled={locked}
              onClick={() => setChoiceId(item.id)}
              className={`rounded-xl border px-4 py-3 text-left text-sm ${
                choiceId === item.id ? 'border-[#FF9933] bg-[#FF9933]/10' : 'border-[#2a2a2a]'
              } ${locked && item.correct ? 'border-[#3dd68c]' : ''} ${locked && choiceId === item.id && !item.correct ? 'border-[#f07178]' : ''}`}
            >
              {item.text}
            </button>
          ))}
        </div>
        {locked && choice ? (
          <p className="mt-4 rounded-xl bg-white/5 px-4 py-3 text-sm text-[#9c968c]">{choice.feedback}</p>
        ) : null}
      </section>
      <div className="mt-4 flex justify-end gap-2">
        {!locked ? (
          <button type="button" disabled={!choiceId} onClick={confirm} className="rounded-md bg-[#FF9933] px-5 py-2 text-sm font-semibold text-[#0b0b0b] disabled:opacity-40">
            Lock answer
          </button>
        ) : (
          <button type="button" onClick={advance} className="rounded-md bg-[#FF9933] px-5 py-2 text-sm font-semibold text-[#0b0b0b]">
            {last ? 'See certificate' : 'Next question'}
          </button>
        )}
      </div>
    </div>
  );
}

function Completion({ replay, onExit }: { replay: boolean; onExit: () => void }) {
  const save = usePlatform((state) => state.courses[EMAIL_PHISHING_COURSE.slug]);
  const certificate = usePlatform((state) => state.certificates[EMAIL_PHISHING_COURSE.slug]);
  const first = save?.firstAttempt;

  if (certificate) {
    return (
      <div className="sr-page min-h-screen bg-[var(--sr-bg)]">
        <Certificate record={certificate} onClose={onExit} />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-30 grid place-items-center bg-black/70 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-auto rounded-3xl bg-[#10192b] p-6 text-white">
        <p className="text-xs tracking-[0.16em] text-[#93c5fd]">KEEP PRACTISING</p>
        <h2 className="mt-2 text-3xl font-semibold">Almost there</h2>
        <p className="mt-3 text-lg">
          {first ? `Score ${first.correct}/${first.total}.` : 'Quiz finished.'} You need 70%+ on the 10-question sim quiz for a certificate.
          {replay ? ' Replay does not change your first result.' : ''}
        </p>
        <div className="mt-5 flex gap-2">
          <button onClick={onExit} className="rounded-full bg-[#2563eb] px-4 py-2 text-sm font-semibold">Back to the course</button>
          <Link href="/courses/phishing-smishing-vishing" className="rounded-full border border-white/15 px-4 py-2 text-sm">Try interactive phishing course</Link>
        </div>
      </div>
    </div>
  );
}

function formatTime(value: number) {
  if (!Number.isFinite(value)) return '0:00';
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
