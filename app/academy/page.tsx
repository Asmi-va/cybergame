'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import SiteShell from '@/components/platform/site-shell';
import ModuleCard from '@/components/platform/module-card';
import { listCourses } from '@/lib/courses/registry';
import { MISSIONS } from '@/lib/nayapur/campaign';
import { GAMES } from '@/lib/platform/catalog';
import { LEARNING_PATH } from '@/lib/platform/journey';
import { usePlatform } from '@/lib/platform/store';

type Tab = 'path' | 'courses' | 'practice' | 'story';

function AcademyInner() {
  const params = useSearchParams();
  const initial = (params.get('tab') as Tab) || 'path';
  const [tab, setTab] = useState<Tab>(['path', 'courses', 'practice', 'story'].includes(initial) ? initial : 'path');
  const certificates = usePlatform((state) => state.certificates);
  const courseSaves = usePlatform((state) => state.courses);
  const games = usePlatform((state) => state.games);
  const courses = listCourses();

  const pathDone = useMemo(() => {
    return LEARNING_PATH.filter((step) => {
      if (step.href.startsWith('/courses/')) {
        const slug = step.href.replace('/courses/', '');
        return !!certificates[slug] || !!courseSaves[slug]?.completed;
      }
      if (step.href.startsWith('/games/')) {
        const slug = step.href.replace('/games/', '');
        return !!games[slug]?.completed;
      }
      return false;
    }).length;
  }, [certificates, courseSaves, games]);

  return (
    <div className="sr-page">
      <p className="sr-eyebrow">One academy · one journey</p>
      <h1 className="mt-3 text-4xl text-[var(--sr-ink)] md:text-5xl">SafeRon Academy</h1>
      <p className="sr-lead">
        Courses, practice modules, and the Nayapur story world share one path. Black for focus. Saffron for India-ready awareness. Learn → practise → certify.
      </p>

      <div className="mt-8 flex flex-wrap gap-2">
        {(
          [
            ['path', 'Learning path'],
            ['courses', 'Courses'],
            ['practice', 'Practice'],
            ['story', 'Story game'],
          ] as const
        ).map(([id, label]) => (
          <button key={id} type="button" className="sr-filter" data-active={tab === id ? 'true' : 'false'} onClick={() => setTab(id)}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'path' ? (
        <section className="mt-8">
          <div className="mb-4 flex items-end justify-between gap-3">
            <h2 className="text-2xl text-[var(--sr-ink)]">Recommended path</h2>
            <p className="text-sm text-[var(--sr-ink-muted)]">{pathDone}/{LEARNING_PATH.length} touched</p>
          </div>
          <div className="sr-path">
            {LEARNING_PATH.map((step, index) => (
              <Link key={step.id} href={step.href} className="sr-path-step">
                <span className="sr-path-index">{index + 1}</span>
                <span>
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--sr-accent)]">{step.stage}</span>
                  <span className="mt-1 block text-lg font-semibold text-[var(--sr-ink)]">{step.title}</span>
                  <span className="mt-1 block text-sm text-[var(--sr-ink-muted)]">{step.detail}</span>
                </span>
                <span className="text-sm font-semibold text-[var(--sr-accent)]">Open →</span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {tab === 'courses' ? (
        <section className="mt-8">
          <h2 className="mb-4 text-2xl text-[var(--sr-ink)]">Courses</h2>
          <div className="sr-grid-modules">
            {courses.map((course) => (
              <ModuleCard
                key={course.slug}
                href={`/courses/${course.slug}`}
                kind="Course"
                title={course.title}
                summary={course.subtitle}
                meta={`${course.durationLabel}${certificates[course.slug] ? ' · Certificate' : ''}`}
                topic={course.module}
              />
            ))}
          </div>
        </section>
      ) : null}

      {tab === 'practice' ? (
        <section className="mt-8">
          <h2 className="mb-4 text-2xl text-[var(--sr-ink)]">Practice modules</h2>
          <p className="mb-4 max-w-2xl text-sm text-[var(--sr-ink-muted)]">
            Same academy genre as courses — decision drills that award platform XP and unlock achievements.
          </p>
          <div className="sr-grid-modules">
            {GAMES.map((game) => (
              <ModuleCard
                key={game.slug}
                href={`/games/${game.slug}`}
                kind="Practice"
                title={game.title}
                summary={game.summary}
                meta={`${game.minutes}${games[game.slug]?.completed ? ` · Best ${games[game.slug].score}/${games[game.slug].maxScore}` : ''}`}
                topic={game.topic}
              />
            ))}
          </div>
        </section>
      ) : null}

      {tab === 'story' ? (
        <section className="mt-8 sr-panel p-6 md:p-8">
          <p className="sr-eyebrow">Story game · learn from the street</p>
          <h2 className="mt-3 text-3xl text-[var(--sr-ink)]">Nayapur</h2>
          <p className="mt-3 max-w-2xl text-[var(--sr-ink-muted)]">
            This is a story game — you learn by helping neighbours. New players see the full mission board first, then a short tutorial, then the lane.
          </p>
          <ol className="mt-6 space-y-3">
            {MISSIONS.map((mission, index) => (
              <li key={mission.id} className="rounded-xl border border-[var(--sr-line)] bg-[var(--sr-bg)] px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--sr-accent)]">
                  Mission {index + 1} · Ch.{mission.chapter}
                </p>
                <p className="mt-1 font-semibold text-[var(--sr-ink)]">{mission.title}</p>
                <p className="mt-1 text-sm text-[var(--sr-ink-muted)]">{mission.blurb}</p>
              </li>
            ))}
          </ol>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/nayapur" className="sr-btn sr-btn-primary">
              Enter story game
            </Link>
            <Link href="/courses/india-payment-scams" className="sr-btn sr-btn-ghost">
              Pair with payment scams course
            </Link>
          </div>
        </section>
      ) : null}
    </div>
  );
}

export default function AcademyPage() {
  return (
    <SiteShell>
      <Suspense fallback={<div className="sr-page text-sm text-[var(--sr-ink-muted)]">Opening academy…</div>}>
        <AcademyInner />
      </Suspense>
    </SiteShell>
  );
}
