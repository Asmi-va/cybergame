'use client';

import { Suspense } from 'react';
import { useParams } from 'next/navigation';
import SiteShell from '@/components/platform/site-shell';
import CourseExperience from '@/components/course/course-experience';
import InteractiveCourseExperience from '@/components/course/interactive-course';
import { getInteractiveCourse } from '@/lib/courses/registry';

export default function CoursePage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const interactive = getInteractiveCourse(slug);

  return (
    <SiteShell>
      {slug === 'email-phishing' ? (
        <Suspense fallback={<p className="p-8 text-sm text-[#93a4bf]">Opening the lesson…</p>}>
          <CourseExperience />
        </Suspense>
      ) : interactive ? (
        <InteractiveCourseExperience course={interactive} />
      ) : (
        <p className="p-8">That course is not on SafeRon yet. Browse the Digital Safety Academy courses.</p>
      )}
    </SiteShell>
  );
}
