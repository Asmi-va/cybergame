'use client';

import Link from 'next/link';
import { GAME_COURSE_LINKS } from '@/lib/platform/journey';
import { GAMES } from '@/lib/platform/catalog';

export default function GameChrome({ slug, children }: { slug: string; children: React.ReactNode }) {
  const meta = GAMES.find((game) => game.slug === slug);
  const link = GAME_COURSE_LINKS[slug];

  return (
    <div className="min-h-screen bg-[#090909] text-[#f6f1e8]">
      <div className="sr-game-chrome">
        <div className="flex min-w-0 flex-wrap items-center gap-3">
          <Link href="/academy">← Academy</Link>
          <span className="hidden text-[#2a2a2a] sm:inline">|</span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{meta?.title ?? 'Practice module'}</p>
            <p className="truncate text-xs text-[#9c968c]">
              Practice · {meta?.topic ?? 'SafeRon'}
              {link ? ` · pairs with ${link.courseTitle}` : ''}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {link ? (
            <Link href={`/courses/${link.courseSlug}`} className="hidden sm:inline">
              Related course
            </Link>
          ) : null}
          <Link href="/academy?tab=practice">All practice</Link>
        </div>
      </div>
      {children}
    </div>
  );
}
