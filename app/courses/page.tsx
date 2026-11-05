'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SiteShell from '@/components/platform/site-shell';

/** Courses live inside the unified Academy hub. */
export default function CoursesPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/academy?tab=courses');
  }, [router]);
  return (
    <SiteShell>
      <div className="sr-page text-sm text-[var(--sr-ink-muted)]">Opening academy courses…</div>
    </SiteShell>
  );
}
