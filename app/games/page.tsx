'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SiteShell from '@/components/platform/site-shell';

/** Practice modules live inside the unified Academy hub. */
export default function GamesPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/academy?tab=practice');
  }, [router]);
  return (
    <SiteShell>
      <div className="sr-page text-sm text-[var(--sr-ink-muted)]">Opening academy practice…</div>
    </SiteShell>
  );
}
