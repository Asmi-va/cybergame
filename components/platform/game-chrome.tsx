'use client';

import Link from 'next/link';
import { GAME_COURSE_LINKS } from '@/lib/platform/journey';
import { GAMES } from '@/lib/platform/catalog';

export default function GameChrome({ slug, children }: { slug: string; children: React.ReactNode }) {
  const meta = GAMES.find((game) => game.slug === slug);
  const link = GAME_COURSE_LINKS[slug];

  return (
    <div className="min-h-[100dvh] bg-[#090909] text-[#f6f1e8]">
      <div className="sr-game-chrome px-3 py-2 sm:px-4">
        <div className="flex min-w-0 flex-wrap items-center gap-2 sm:gap-3">
          <Link href="/academy?tab=practice">← Practice</Link>
          <span className="hidden text-[#2a2a2a] sm:inline">|</span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{meta?.title ?? 'Practice module'}</p>
            <p className="truncate text-[11px] text-[#9c968c] sm:text-xs">
              Sim · {meta?.topic ?? 'SafeRon'}
              {link ? ` · ${link.courseTitle}` : ''}
            </p>
          </div>
        </div>
        <div className="hidden flex-wrap items-center gap-3 sm:flex">
          {link ? <Link href={`/courses/${link.courseSlug}`}>Related course</Link> : null}
          <Link href="/academy?tab=practice">All practice</Link>
        </div>
      </div>
      {children}
    </div>
  );
}
