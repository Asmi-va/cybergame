'use client';

import Link from 'next/link';
import SiteShell from '@/components/platform/site-shell';
import { LEARN_ARTICLES } from '@/lib/platform/catalog';

export default function LearnPage() {
  return (
    <SiteShell>
      <div className="sr-page">
        <p className="sr-eyebrow">Guides</p>
        <h1 className="mt-3 text-4xl text-[var(--sr-ink)] md:text-5xl">Practical reading</h1>
        <p className="sr-lead">
          Short references that sit inside the academy journey — use before a course or after a practice module.
        </p>
        <Link href="/academy" className="mt-4 inline-block text-sm font-semibold text-[var(--sr-accent)]">
          ← Back to academy
        </Link>
        <div className="mt-8 space-y-3">
          {LEARN_ARTICLES.map((article) => (
            <article key={article.slug} id={article.slug} className="sr-panel p-5">
              <p className="text-xs font-medium tracking-wide text-[var(--sr-ink-muted)]">{article.minutes}</p>
              <h2 className="mt-1 text-2xl text-[var(--sr-ink)]">{article.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-[var(--sr-ink-muted)]">{article.body}</p>
            </article>
          ))}
        </div>
      </div>
    </SiteShell>
  );
}
