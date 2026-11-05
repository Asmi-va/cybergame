'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import type { ComponentType } from 'react';
import GameChrome from '@/components/platform/game-chrome';
import { useImmersive } from '@/components/platform/site-shell';

const FakeLoginGame = dynamic(() => import('@/components/games/fake-login-game'), { ssr: false });
const DetectiveGame = dynamic(() => import('@/components/games/detective-game'), { ssr: false });
const QrHuntGame = dynamic(() => import('@/components/games/qr-hunt-game'), { ssr: false });
const SocialEngineerGame = dynamic(() => import('@/components/games/social-engineer-game'), { ssr: false });
const InsiderGame = dynamic(() => import('@/components/games/insider-game'), { ssr: false });
const RansomwareGame = dynamic(() => import('@/components/games/ransomware-game'), { ssr: false });

const GAMES: Record<string, ComponentType> = {
  'find-the-fake-login': FakeLoginGame,
  'phishing-detective': DetectiveGame,
  'qr-hunt': QrHuntGame,
  'the-social-engineer': SocialEngineerGame,
  insider: InsiderGame,
  'ransomware-reaction': RansomwareGame,
};

export default function PlayGame({ slug }: { slug: string }) {
  useImmersive(true);
  const Game = GAMES[slug];
  if (!Game) {
    return (
      <div className="sr-page">
        <p className="text-[var(--sr-ink)]">That practice module is not in the academy yet.</p>
        <Link href="/academy?tab=practice" className="sr-btn sr-btn-primary mt-4 inline-flex">
          Back to academy practice
        </Link>
      </div>
    );
  }
  return (
    <GameChrome slug={slug}>
      <Game />
    </GameChrome>
  );
}
