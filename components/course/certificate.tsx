'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { CertificateRecord } from '@/lib/platform/store';
import { getCourseNextStep } from '@/lib/courses/next-steps';

function formatDate(iso: string) {
  const date = new Date(iso);
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function Certificate({
  record,
  onClose,
}: {
  record: CertificateRecord;
  onClose?: () => void;
}) {
  const fallback = getCourseNextStep(record.courseId);
  const about = record.about || fallback.about;
  const howToProceed = record.howToProceed?.length ? record.howToProceed : fallback.howToProceed;
  const nextTitle = record.nextTitle || fallback.nextTitle;
  const nextHref = record.nextHref || fallback.nextHref;
  const nextDetail = record.nextDetail || fallback.nextDetail;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <p className="text-sm text-[var(--sr-ink-muted)]">Certificate ready on this device · score {record.score}/{record.total}</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-md bg-[#FF9933] px-4 py-2 text-sm font-semibold text-[#0b0b0b]"
          >
            Print / Save PDF
          </button>
          {onClose ? (
            <button type="button" onClick={onClose} className="sr-btn sr-btn-ghost">
              Close
            </button>
          ) : null}
        </div>
      </div>

      <div
        id="saferon-certificate"
        className="relative mx-auto aspect-[1.414/1] w-full max-w-4xl overflow-hidden rounded-sm border-[3px] border-[#FF9933] bg-white text-[#111] shadow-2xl"
      >
        <div className="pointer-events-none absolute -left-8 -top-8 h-40 w-40 rotate-12 bg-[#0b0b0b]" />
        <div className="pointer-events-none absolute -left-4 top-16 h-24 w-48 -rotate-6 bg-[#FF9933]" />
        <div className="pointer-events-none absolute -bottom-10 -right-10 h-44 w-44 -rotate-12 bg-[#0b0b0b]" />
        <div className="pointer-events-none absolute bottom-16 -right-6 h-24 w-40 rotate-6 bg-[#FF9933]" />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.08]">
          <Image src="/saferon-logo.png" alt="" width={280} height={280} className="object-contain" />
        </div>

        <div className="relative flex h-full flex-col items-center px-8 py-7 text-center sm:px-12">
          <div className="flex flex-col items-center">
            <Image src="/saferon-logo.png" alt="SafeRon" width={56} height={56} className="object-contain" />
            <p className="mt-1 text-lg font-bold tracking-[0.08em] text-[#111]">SafeRon</p>
            <p className="text-[10px] font-semibold tracking-[0.22em] text-[#666]">LEARN • TRUST • VERIFY</p>
          </div>

          <div className="absolute right-8 top-7 sm:right-10">
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[#0b0b0b] text-white shadow-md">
              <span className="absolute -bottom-2 left-1/2 h-3 w-8 -translate-x-1/2 rounded-sm bg-[#FF9933]" />
              <span className="absolute -bottom-2 left-[35%] h-3 w-3 -translate-x-1/2 rotate-[-25deg] rounded-sm bg-[#FF9933]" />
              <span className="absolute -bottom-2 left-[65%] h-3 w-3 -translate-x-1/2 rotate-[25deg] rounded-sm bg-[#FF9933]" />
              <span className="text-xl font-bold text-[#FF9933]">✓</span>
            </div>
          </div>

          <h1 className="mt-8 text-2xl font-extrabold tracking-[0.12em] text-[#111] sm:text-3xl">CERTIFICATE OF COMPLETION</h1>
          <p className="mt-8 text-3xl font-bold tracking-tight text-[#111] sm:text-4xl">{record.learnerName}</p>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[#333] sm:text-base">
            has successfully completed the <strong>{record.courseTitle}</strong> certification quiz ({record.score}/{record.total}) and demonstrated
            understanding of online safety, scam prevention and responsible digital behaviour.
          </p>

          <div className="mt-6 rounded-full border-2 border-[#FF9933] px-5 py-2 text-sm font-semibold text-[#FF9933]">
            {record.courseTitle}
          </div>

          <div className="mt-auto flex w-full items-end justify-between gap-4 pt-10">
            <div className="text-left">
              <p className="text-sm font-semibold">{formatDate(record.issuedAt)}</p>
              <p className="text-[10px] tracking-[0.16em] text-[#777]">DATE OF COMPLETION</p>
            </div>
            <Image src="/saferon-logo.png" alt="" width={36} height={36} className="mb-1 object-contain" />
            <div className="text-right">
              <p className="text-sm font-semibold">{record.certificateId}</p>
              <p className="text-[10px] tracking-[0.16em] text-[#777]">CERTIFICATE ID</p>
            </div>
          </div>

          <div className="mt-6 flex w-full items-center gap-3">
            <div className="h-px flex-1 bg-[#ddd]" />
            <p className="text-[10px] font-semibold tracking-[0.18em] text-[#555]">LEARN • TRUST • VERIFY</p>
            <div className="h-px flex-1 bg-[#ddd]" />
          </div>
        </div>
      </div>

      <section className="sr-panel space-y-4 p-5 print:border print:border-black">
        <div>
          <p className="sr-eyebrow">What this certificate is about</p>
          <p className="mt-2 text-sm text-[var(--sr-ink-muted)]">{about}</p>
        </div>
        <div>
          <p className="sr-eyebrow">How to proceed</p>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-[var(--sr-ink-muted)]">
            {howToProceed.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
        <div className="rounded-xl border border-[var(--sr-line)] bg-[var(--sr-bg)] p-4">
          <p className="sr-eyebrow">Where to go next</p>
          <p className="mt-2 text-lg font-semibold text-[var(--sr-ink)]">{nextTitle}</p>
          <p className="mt-1 text-sm text-[var(--sr-ink-muted)]">{nextDetail}</p>
          <Link href={nextHref} className="sr-btn sr-btn-primary mt-4 inline-flex print:hidden">
            Continue →
          </Link>
        </div>
      </section>

      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #saferon-certificate, #saferon-certificate *, .sr-panel, .sr-panel * { visibility: visible !important; }
          #saferon-certificate {
            position: relative !important;
            width: 100% !important;
            max-width: none !important;
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
}

