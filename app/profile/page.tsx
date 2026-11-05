'use client';

import Link from 'next/link';
import { useState } from 'react';
import SiteShell from '@/components/platform/site-shell';
import Certificate from '@/components/course/certificate';
import { GAMES } from '@/lib/platform/catalog';
import { HELPLINES, listCourses } from '@/lib/courses/registry';
import { usePlatform } from '@/lib/platform/store';

export default function ProfilePage() {
  const name = usePlatform((state) => state.name);
  const setName = usePlatform((state) => state.setName);
  const xp = usePlatform((state) => state.xp);
  const courses = usePlatform((state) => state.courses);
  const games = usePlatform((state) => state.games);
  const certificates = usePlatform((state) => state.certificates);
  const [activeCert, setActiveCert] = useState<string | null>(null);
  const certList = Object.values(certificates);
  const viewing = activeCert ? certificates[activeCert] : null;

  return (
    <SiteShell>
      <div className="sr-page max-w-3xl">
        <p className="sr-eyebrow">Profile</p>
        <h1 className="mt-3 text-4xl text-[var(--sr-ink)]">This device</h1>
        <p className="sr-lead">
          No account server. Name, XP, progress, and certificates stay in this browser — minimal personal data by design.
        </p>

        <label className="mt-8 block text-sm font-medium text-[var(--sr-ink)]">
          Name for certificates
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="sr-input mt-2"
          />
        </label>
        <p className="mt-4 text-lg font-semibold text-[var(--sr-ink)]">{xp} XP</p>

        <section className="mt-10">
          <h2 className="text-2xl text-[var(--sr-ink)]">Certificates</h2>
          {certList.length === 0 ? (
            <p className="mt-2 text-sm text-[var(--sr-ink-muted)]">Pass a course quiz to unlock a printable certificate.</p>
          ) : (
            <div className="mt-3 space-y-2">
              {certList.map((cert) => (
                <button
                  key={cert.courseId}
                  type="button"
                  onClick={() => setActiveCert(cert.courseId)}
                  className="sr-panel flex w-full items-center justify-between px-4 py-3 text-left text-sm"
                >
                  <span className="font-medium">{cert.courseTitle}</span>
                  <span className="text-[var(--sr-ink-muted)]">{cert.certificateId}</span>
                </button>
              ))}
            </div>
          )}
          {viewing ? (
            <div className="mt-4">
              <Certificate record={viewing} onClose={() => setActiveCert(null)} />
            </div>
          ) : null}
        </section>

        <section className="mt-10">
          <h2 className="text-2xl text-[var(--sr-ink)]">Courses</h2>
          <div className="mt-3 space-y-2">
            {listCourses().map((course) => {
              const save = courses[course.slug];
              return (
                <article key={course.slug} className="sr-panel p-4">
                  <h3 className="font-semibold text-[var(--sr-ink)]">{course.title}</h3>
                  <p className="mt-1 text-sm text-[var(--sr-ink-muted)]">
                    {certificates[course.slug]
                      ? 'Certificate earned'
                      : save?.firstAttempt
                        ? `First attempt ${save.firstAttempt.correct}/${save.firstAttempt.total}`
                        : save
                          ? `${save.completedCheckpoints.length} checkpoints saved`
                          : 'Not started'}
                  </p>
                  <Link href={`/courses/${course.slug}`} className="mt-2 inline-block text-sm font-semibold text-[var(--sr-accent)]">
                    Open
                  </Link>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl text-[var(--sr-ink)]">Practice</h2>
          <div className="mt-3 space-y-2">
            {GAMES.map((game) => {
              const save = games[game.slug];
              return (
                <article key={game.slug} className="sr-panel flex items-center justify-between px-4 py-3 text-sm">
                  <span>{game.title}</span>
                  <span className="text-[var(--sr-ink-muted)]">
                    {save?.completed ? `${save.score}/${save.maxScore}` : 'Not finished'}
                  </span>
                </article>
              );
            })}
          </div>
        </section>

        <section className="sr-panel mt-10 p-5">
          <h2 className="text-xl text-[var(--sr-ink)]">Help numbers</h2>
          <ul className="mt-3 space-y-2 text-sm text-[var(--sr-ink-muted)]">
            {HELPLINES.map((item) => (
              <li key={item.value}>
                <span className="font-semibold text-[var(--sr-ink)]">{item.label}: {item.value}</span> — {item.detail}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </SiteShell>
  );
}
