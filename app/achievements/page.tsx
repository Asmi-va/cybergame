'use client';

import SiteShell from '@/components/platform/site-shell';
import { ACHIEVEMENTS } from '@/lib/platform/catalog';
import { ACADEMY_COURSES } from '@/lib/courses/academy-pack';
import { usePlatform } from '@/lib/platform/store';

export default function AchievementsPage() {
  const course = usePlatform((state) => state.courses['email-phishing']);
  const games = usePlatform((state) => state.games);
  const certificates = usePlatform((state) => state.certificates);
  const xp = usePlatform((state) => state.xp);
  const academyCompleted = ACADEMY_COURSES.filter((item) => certificates[item.slug]).length;
  const input = {
    courseDone: !!course?.completed,
    coursePerfect: course?.firstAttempt?.correct === 5,
    games,
    certificates,
    academyCompleted,
  };

  return (
    <SiteShell>
      <div className="sr-page">
        <p className="sr-eyebrow">Progress</p>
        <h1 className="mt-3 text-4xl text-[var(--sr-ink)] md:text-5xl">{xp} XP</h1>
        <p className="sr-lead">{academyCompleted}/8 academy certificates on this device.</p>
        <div className="mt-8 grid gap-3 md:grid-cols-2">
          {ACHIEVEMENTS.map((item) => {
            const earned = item.earned(input);
            return (
              <article
                key={item.id}
                className={`sr-panel p-5 ${earned ? 'border-[var(--sr-success)]' : ''}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-xl text-[var(--sr-ink)]">{item.title}</h2>
                  <span className="text-xs font-semibold uppercase tracking-wide text-[var(--sr-ink-muted)]">
                    {earned ? 'Earned' : 'Open'}
                  </span>
                </div>
                <p className="mt-2 text-sm text-[var(--sr-ink-muted)]">{item.detail}</p>
              </article>
            );
          })}
        </div>
      </div>
    </SiteShell>
  );
}
