'use client';

import Link from 'next/link';
import SaferonLogo from '@/components/platform/saferon-logo';
import ModuleCard from '@/components/platform/module-card';
import { LEARNING_PATH } from '@/lib/platform/journey';
import { listLibraryModules } from '@/lib/platform/modules';

export default function HomeView() {
  const featured = listLibraryModules().filter((item) => item.kind === 'Course').slice(0, 2);
  const practice = listLibraryModules().filter((item) => item.kind === 'Practice').slice(0, 2);

  return (
    <div className="sr-page">
      <section className="sr-hero">
        <SaferonLogo size={96} priority className="mb-4" />
        <p className="sr-eyebrow">SafeRon · Learn · Trust · Verify</p>
        <h1 className="mt-4 text-[var(--sr-ink)]">
          One academy.
          <span className="block text-[var(--sr-accent)]">Saffron clarity. Black focus.</span>
        </h1>
        <p className="sr-lead">
          Courses ask your name, then teach with sims and a 10-question quiz before a certificate that shows what you learned and where to go next. The Nayapur story game shows missions when a new player enters — learn from the street.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/academy" className="sr-btn sr-btn-primary">
            Enter the academy
          </Link>
          <Link href="/academy?tab=path" className="sr-btn sr-btn-secondary">
            Follow the learning path
          </Link>
          <Link href="/nayapur" className="sr-btn sr-btn-ghost">
            Play the story game
          </Link>
        </div>
        <div className="sr-stat-row">
          <div className="sr-stat">
            <strong>Learn</strong>
            <span>Name → lesson → sim → 10Q quiz → certificate</span>
          </div>
          <div className="sr-stat">
            <strong>Practice</strong>
            <span>Decision modules that share academy XP</span>
          </div>
          <div className="sr-stat">
            <strong>Story game</strong>
            <span>New players see Nayapur missions first</span>
          </div>
        </div>
      </section>

      <section className="sr-section">
        <div className="sr-section-head">
          <div>
            <p className="sr-eyebrow">Interactive path</p>
            <h2 className="mt-2 text-3xl text-[var(--sr-ink)]">Not separate dumps — one journey</h2>
          </div>
          <Link href="/academy?tab=path" className="text-sm font-semibold text-[var(--sr-accent)]">
            Full path
          </Link>
        </div>
        <div className="sr-path">
          {LEARNING_PATH.slice(0, 5).map((step, index) => (
            <Link key={step.id} href={step.href} className="sr-path-step">
              <span className="sr-path-index">{index + 1}</span>
              <span>
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--sr-accent)]">{step.stage}</span>
                <span className="mt-1 block text-lg font-semibold">{step.title}</span>
                <span className="mt-1 block text-sm text-[var(--sr-ink-muted)]">{step.detail}</span>
              </span>
              <span className="text-sm font-semibold text-[var(--sr-accent)]">Go →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="sr-section">
        <div className="sr-section-head">
          <div>
            <p className="sr-eyebrow">Same card. Same genre.</p>
            <h2 className="mt-2 text-3xl text-[var(--sr-ink)]">Courses & practice together</h2>
          </div>
          <Link href="/academy" className="text-sm font-semibold text-[var(--sr-accent)]">
            Open academy
          </Link>
        </div>
        <div className="sr-grid-modules">
          {[...featured, ...practice].map((item) => (
            <ModuleCard key={item.slug} {...item} />
          ))}
        </div>
      </section>

      <section className="sr-section sr-panel p-6 md:p-8">
        <p className="sr-eyebrow">Brand story</p>
        <h2 className="mt-3 max-w-2xl text-3xl text-[var(--sr-ink)]">
          Saffron for awareness. Black for discipline.
        </h2>
        <p className="mt-4 max-w-2xl text-[var(--sr-ink-muted)]">
          SafeRon uses India’s saffron as the signal to pause and verify — and black as the calm space where learners make careful decisions. Every module should feel like the same product: academy chrome, shared XP, linked courses and practice, printable certificates.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/profile" className="sr-btn sr-btn-primary">
            Certificates & profile
          </Link>
          <Link href="/learn" className="sr-btn sr-btn-ghost">
            Short guides
          </Link>
        </div>
      </section>

      <footer className="sr-footer">
        <p>SafeRon Academy · Learn · Trust · Verify</p>
        <p>
          Help: 1098 · 1930 ·{' '}
          <Link href="/privacy" className="text-[var(--sr-accent)]">
            Privacy
          </Link>
        </p>
      </footer>
    </div>
  );
}
