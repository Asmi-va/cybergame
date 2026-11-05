'use client';

import { useParams } from 'next/navigation';
import SiteShell from '@/components/platform/site-shell';
import PlayGame from '@/components/games/play-game';

export default function GameRoute() {
  const params = useParams<{ slug: string }>();
  return (
    <SiteShell>
      <PlayGame slug={params.slug} />
    </SiteShell>
  );
}
