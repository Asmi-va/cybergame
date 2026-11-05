'use client';

import dynamic from 'next/dynamic';
import SiteShell from '@/components/platform/site-shell';

const NayapurExperience = dynamic(() => import('@/components/nayapur/nayapur-experience'), { ssr: false });

export default function NayapurPage() {
  return (
    <SiteShell>
      <NayapurExperience />
    </SiteShell>
  );
}
