import Link from 'next/link';
import SiteShell from '@/components/platform/site-shell';
import { HELPLINES } from '@/lib/courses/registry';

export default function PrivacyPage() {
  return (
    <SiteShell>
      <div className="sr-page max-w-3xl">
        <p className="sr-eyebrow">Safety by design</p>
        <h1 className="mt-3 text-4xl text-[var(--sr-ink)]">Privacy & guardians</h1>
        <p className="sr-lead">
          SafeRon is built for ages 8–16 with minimal personal data. Progress stays on this device unless you print or screenshot a certificate.
        </p>

        <section className="sr-panel mt-8 space-y-3 p-5 text-sm text-[var(--sr-ink-muted)]">
          <h2 className="text-xl text-[var(--sr-ink)]">What we store on this device</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>First name (for certificates) — you choose it</li>
            <li>Course / practice / story progress and XP</li>
            <li>Certificate records (score, date, next steps)</li>
            <li>A guardian/teacher acknowledgment flag</li>
          </ul>
          <p>Nothing is uploaded to a SafeRon account server in this MVP. Clearing browser data removes progress.</p>
        </section>

        <section className="sr-panel mt-4 space-y-3 p-5 text-sm text-[var(--sr-ink-muted)]">
          <h2 className="text-xl text-[var(--sr-ink)]">What we do not collect</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>Email, phone, Aadhaar, school ID, or passwords</li>
            <li>Advertising trackers or third-party ad pixels</li>
            <li>Analytics by default (hosting analytics only if the operator opts in)</li>
          </ul>
        </section>

        <section className="sr-panel mt-4 space-y-3 p-5 text-sm text-[var(--sr-ink-muted)]">
          <h2 className="text-xl text-[var(--sr-ink)]">For parents & teachers</h2>
          <p>
            Sit with younger learners for payment / OTP topics. Certificates are educational practice records, not legal licences.
            For real incidents, help the child contact support — do not leave them alone with cybercrime reporting.
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {HELPLINES.map((item) => (
              <div key={item.value} className="rounded-xl bg-[var(--sr-bg)] px-3 py-3">
                <p className="font-semibold text-[var(--sr-ink)]">
                  {item.label}: {item.value}
                </p>
                <p className="mt-1 text-xs">{item.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <p className="mt-8 text-sm">
          <Link href="/" className="font-semibold text-[var(--sr-accent)]">
            ← Back home
          </Link>
        </p>
      </div>
    </SiteShell>
  );
}
