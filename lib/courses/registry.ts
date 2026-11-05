import { EMAIL_PHISHING_COURSE } from './email-phishing';
import { ACADEMY_COURSES } from './academy-pack';
import type { InteractiveCourse } from './types';

export type CourseListItem = {
  slug: string;
  kind: 'video' | 'interactive';
  module: string;
  title: string;
  subtitle: string;
  durationLabel: string;
  maxXp: number;
  certificateTitle?: string;
  fourCs?: string[];
  ageBands?: string[];
};

export const INTERACTIVE_BY_SLUG: Record<string, InteractiveCourse> = Object.fromEntries(
  ACADEMY_COURSES.map((course) => [course.slug, course]),
);

export function getInteractiveCourse(slug: string) {
  return INTERACTIVE_BY_SLUG[slug] ?? null;
}

export function listCourses(): CourseListItem[] {
  return [
    {
      slug: EMAIL_PHISHING_COURSE.slug,
      kind: 'video',
      module: EMAIL_PHISHING_COURSE.module,
      title: EMAIL_PHISHING_COURSE.title,
      subtitle: EMAIL_PHISHING_COURSE.subtitle,
      durationLabel: EMAIL_PHISHING_COURSE.durationLabel,
      maxXp: EMAIL_PHISHING_COURSE.maxXp,
      certificateTitle: 'Modern Email Phishing',
    },
    ...ACADEMY_COURSES.map((course) => ({
      slug: course.slug,
      kind: 'interactive' as const,
      module: course.module,
      title: course.title,
      subtitle: course.subtitle,
      durationLabel: course.durationLabel,
      maxXp: course.maxXp,
      certificateTitle: course.certificateTitle,
      fourCs: course.fourCs,
      ageBands: course.ageBands,
    })),
  ];
}

export const HELPLINES = [
  { label: 'Childline', value: '1098', detail: 'Help for children — tell a trusted adult too.' },
  { label: 'Cybercrime helpline', value: '1930', detail: 'Financial cyber fraud — ask an adult to help call.' },
  { label: 'Report online', value: 'cybercrime.gov.in', detail: 'National Cyber Crime Reporting Portal.' },
] as const;
