import { listCourses } from '@/lib/courses/registry';
import { GAMES } from '@/lib/platform/catalog';

export type ModuleKind = 'Course' | 'Practice' | 'Story';

export type LibraryModule = {
  slug: string;
  href: string;
  kind: ModuleKind;
  title: string;
  summary: string;
  meta: string;
  topic: string;
};

export function listLibraryModules(): LibraryModule[] {
  const courses = listCourses().map((course) => ({
    slug: course.slug,
    href: `/courses/${course.slug}`,
    kind: 'Course' as const,
    title: course.title,
    summary: course.subtitle,
    meta: `${course.durationLabel} · up to ${course.maxXp} XP`,
    topic: course.kind === 'video' ? 'Video lesson' : 'Interactive academy',
  }));

  const games = GAMES.map((game) => ({
    slug: game.slug,
    href: `/games/${game.slug}`,
    kind: 'Practice' as const,
    title: game.title,
    summary: game.tagline,
    meta: `${game.minutes} · ${game.players}`,
    topic: game.topic,
  }));

  const stories: LibraryModule[] = [
    {
      slug: 'nayapur',
      href: '/nayapur',
      kind: 'Story',
      title: 'Nayapur street missions',
      summary: 'Walk a neighbourhood story world and practice everyday scam decisions.',
      meta: 'Open world · India scenarios',
      topic: 'Story world',
    },
  ];

  return [...courses, ...games, ...stories];
}
