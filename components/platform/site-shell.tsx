'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';
import SaferonLogo from '@/components/platform/saferon-logo';
import { usePlatform } from '@/lib/platform/store';

const ImmersiveContext = createContext<(value: boolean) => void>(() => {});

export function useImmersive(active: boolean) {
  const setImmersive = useContext(ImmersiveContext);
  useEffect(() => {
    setImmersive(active);
    return () => setImmersive(false);
  }, [active, setImmersive]);
}

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/academy', label: 'Academy' },
  { href: '/nayapur', label: 'Nayapur' },
  { href: '/achievements', label: 'Progress' },
  { href: '/profile', label: 'Profile' },
  { href: '/privacy', label: 'Privacy' },
];

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const name = usePlatform((state) => state.name);
  const xp = usePlatform((state) => state.xp);
  const [immersive, setImmersive] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <ImmersiveContext.Provider value={setImmersive}>
      <div className="sr-shell" data-immersive={immersive ? 'true' : 'false'}>
        {!immersive && (
          <header className="sr-header">
            <div className="sr-header-inner">
              <Link href="/" className="sr-brand">
                <SaferonLogo size={44} priority className="sr-brand-logo" />
                <span>
                  <span className="sr-brand-title">SafeRon</span>
                  <span className="sr-brand-sub">Learn · Trust · Verify</span>
                </span>
              </Link>
              <nav className="sr-nav" aria-label="Primary">
                {LINKS.map((link) => {
                  const active =
                    link.href === '/'
                      ? pathname === '/'
                      : link.href === '/academy'
                        ? pathname.startsWith('/academy') || pathname.startsWith('/courses') || pathname.startsWith('/games') || pathname.startsWith('/learn')
                        : pathname.startsWith(link.href);
                  return (
                    <Link key={link.href} href={link.href} data-active={active ? 'true' : 'false'}>
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
              <div className="ml-auto hidden items-center gap-3 sm:flex">
                <span className="text-sm text-[var(--sr-ink-muted)]">{xp} XP</span>
                <Link
                  href="/profile"
                  className="grid h-9 w-9 place-items-center rounded-md bg-[var(--sr-accent)] text-sm font-bold text-[#0b0b0b]"
                  aria-label="Profile"
                >
                  {name.slice(0, 1).toUpperCase()}
                </Link>
              </div>
              <button
                type="button"
                className="ml-auto rounded-md border border-[var(--sr-line)] px-3 py-1.5 text-sm md:hidden"
                onClick={() => setOpen((value) => !value)}
                aria-expanded={open}
              >
                Menu
              </button>
            </div>
            {open ? (
              <div className="mx-auto flex max-w-[1120px] flex-col gap-1 border-t border-[var(--sr-line)] px-4 py-3 md:hidden">
                {LINKS.map((link) => (
                  <Link key={link.href} href={link.href} className="rounded-md px-3 py-2 text-sm" onClick={() => setOpen(false)}>
                    {link.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </header>
        )}
        <main>{children}</main>
      </div>
    </ImmersiveContext.Provider>
  );
}
