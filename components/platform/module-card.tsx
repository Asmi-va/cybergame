import Link from 'next/link';
import type { ModuleKind } from '@/lib/platform/modules';

const KIND_STYLE: Record<ModuleKind, string> = {
  Course: 'text-[var(--sr-accent)] bg-[var(--sr-accent-soft)]',
  Practice: 'text-[var(--sr-ink)] bg-[var(--sr-ink-soft)]',
  Story: 'text-[var(--sr-ink-muted)] bg-[var(--sr-line)]',
};

export default function ModuleCard({
  href,
  kind,
  title,
  summary,
  meta,
  topic,
}: {
  href: string;
  kind: ModuleKind;
  title: string;
  summary: string;
  meta: string;
  topic: string;
}) {
  return (
    <Link href={href} className="sr-module-card group">
      <div className="flex items-center justify-between gap-3">
        <span className={`sr-kind ${KIND_STYLE[kind]}`}>{kind}</span>
        <span className="text-xs text-[var(--sr-ink-muted)]">{topic}</span>
      </div>
      <h3 className="mt-4 font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-[var(--sr-ink)] transition group-hover:text-[var(--sr-accent)]">
        {title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--sr-ink-muted)]">{summary}</p>
      <p className="mt-5 text-xs font-medium tracking-wide text-[var(--sr-ink)]">{meta}</p>
    </Link>
  );
}
