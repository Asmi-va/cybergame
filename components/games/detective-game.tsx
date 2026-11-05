'use client';

import dynamic from 'next/dynamic';
import { useMemo, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePlatform } from '@/lib/platform/store';

const OfficeScene = dynamic(() => import('@/components/games/office-scene'), { ssr: false, loading: () => <div className="grid h-screen place-items-center bg-[#0c1016] text-sm text-[#93a4bf]">Opening the office…</div> });

type AppId = 'mail' | 'chat' | 'calendar' | 'browser' | 'files' | 'notes' | 'board';
type Phase = 'brief' | 'tutorial' | 'world' | 'result';

const EVIDENCE: Record<string, { label: string; detail: string; key: boolean }> = {
  urgency: { label: 'Countdown in the mail', detail: 'The message tries to move ₹39,85,000 before the 4pm run.', key: false },
  sender: { label: 'Sender domain', detail: 'The display name says Aarav Textiles. The address is accounts@aarav-textiies.example.', key: true },
  'new-account': { label: 'New account in the mail', detail: 'The mail tells finance to pay ICICI ****9091 instead of the account on file.', key: true },
  'mail-phone': { label: 'Phone number inside the mail', detail: 'The signature offers a mobile number that is not the vendor-file number.', key: true },
  'prior-domain': { label: 'Earlier genuine thread', detail: 'Last month’s paid invoice came from billing@aaravtextiles.example.', key: true },
  policy: { label: 'Security note', detail: 'Bank changes are confirmed on the number already stored, never from the change email.', key: false },
  vikram: { label: 'Chat with Vikram', detail: 'Accounts payable did not request a bank change. The file still shows HDFC ****4412.', key: true },
  calendar: { label: 'Supplier call already booked', detail: 'Tomorrow 11:00 uses the number stored on the vendor master: +91 22 4000 1180.', key: true },
  master: { label: 'Vendor master', detail: 'Aarav Textiles, billing@aaravtextiles.example, HDFC ****4412, +91 22 4000 1180.', key: true },
  invoice: { label: 'Attachment HF-2041', detail: 'The attached invoice shows ICICI ****9091 and a different phone.', key: true },
  notes: { label: 'AP checklist', detail: 'Call the number on the vendor master before any bank edit.', key: false },
  board: { label: 'Floor notice', detail: 'Payment-redirection attempts are being reported this month.', key: false },
  bookmark: { label: 'Known supplier portal', detail: 'The browser bookmark is portal.aaravtextiles.example.', key: false },
  'doc-request': { label: 'Permission request', detail: 'The same lookalike address wants edit and external sharing on the vendor bank file.', key: true },
  printed: { label: 'Printed master on the desk', detail: 'The paper copy matches HDFC ****4412, not the account in the new mail.', key: true },
  whiteboard: { label: 'Meeting-room note', detail: 'Bank changes: call the number we already have.', key: true },
  usb: { label: 'Unlabelled USB', detail: 'A loose USB is not evidence about this payment. Leave it for IT.', key: false },
};

const OBJECTIVES = [
  { id: 'building', label: 'Enter the building', test: (flags: Set<string>) => flags.has('entered-building') },
  { id: 'desk', label: 'Locate the workstation', test: (flags: Set<string>) => flags.has('found-workstation') || flags.has('used-workstation') },
  { id: 'inbox', label: 'Open the inbox', test: (flags: Set<string>) => flags.has('opened-inbox') },
  { id: 'mail', label: 'Inspect the suspicious email', test: (flags: Set<string>) => flags.has('opened-change') },
  { id: 'sender', label: 'Inspect the sender address', test: (flags: Set<string>) => flags.has('sender') },
  { id: 'pay', label: 'Check the payment request', test: (flags: Set<string>) => flags.has('new-account') },
  { id: 'compare', label: 'Examine the supplier invoice', test: (flags: Set<string>) => flags.has('invoice') },
  { id: 'docs', label: 'Inspect document permissions', test: (flags: Set<string>) => flags.has('doc-decision') },
  { id: 'support', label: 'Collect evidence', test: (flags: Set<string>) => [...flags].filter((id) => EVIDENCE[id]).length >= 4 },
  { id: 'report', label: 'Submit the investigation report', test: (flags: Set<string>) => flags.has('submitted') },
];

const TUTORIAL = [
  'Gold outlines are evidence. Click one to record it. Reading alone does not add it to the case.',
  'Judge the sender by the address, not the display name.',
  'A payment change has to sit next to the invoice and the vendor file you already trust.',
  'Read the older thread. One urgent message is not the whole relationship.',
  'Walk into the finance office and sit at the computer. The same desk holds the mail, the invoice, and the permission request.',
];

export default function DetectiveGame() {
  const completeGame = usePlatform((state) => state.completeGame);
  const [phase, setPhase] = useState<Phase>('brief');
  const [seated, setSeated] = useState(false);
  const [reporting, setReporting] = useState(false);
  const [step, setStep] = useState(0);
  const [app, setApp] = useState<AppId>('mail');
  const [mailId, setMailId] = useState<string | null>(null);
  const [folder, setFolder] = useState<'inbox' | 'sent' | 'drafts' | 'archive'>('inbox');
  const [query, setQuery] = useState('');
  const [flags, setFlags] = useState<string[]>([]);
  const [docChoice, setDocChoice] = useState<string | null>(null);
  const [docsOpen, setDocsOpen] = useState(false);
  const [conclusion, setConclusion] = useState<string | null>(null);
  const [started] = useState(() => Date.now());
  const bag = useMemo(() => new Set(flags), [flags]);

  function add(id: string) {
    setFlags((current) => (current.includes(id) ? current : [...current, id]));
  }

  const evidence = flags.filter((id) => EVIDENCE[id]);
  const doneCount = OBJECTIVES.filter((item) => item.test(bag)).length;

  function submit() {
    add('submitted');
    const keys = evidence.filter((id) => EVIDENCE[id].key);
    const conclusionScore = conclusion === 'hold' ? 40 : 0;
    const evidenceScore = Math.min(60, keys.length * 8);
    const score = conclusionScore + evidenceScore;
    const xp = Math.round((score / 100) * 240);
    completeGame('phishing-detective', score, 100, xp, conclusion === 'hold' ? 'Payment held and reported' : 'Report filed with the wrong conclusion');
    setPhase('result');
  }

  const objectiveItems = OBJECTIVES.map((item) => ({ label: item.label, done: item.test(bag) }));

  return (
    <div className="min-h-screen bg-[#070b10] text-[#e8eef7]">
      {phase === 'brief' && (
        <div className="mx-auto max-w-3xl px-6 py-16">
          <p className="text-xs tracking-[0.18em] text-[#93c5fd]">OPERATION STILL LEDGER</p>
          <h1 className="mt-3 text-4xl font-semibold">A supplier payment is frozen</h1>
          <p className="mt-4 leading-relaxed text-[#b7c3d6]">Meridian Forge Pvt. Ltd. is holding ₹39,85,000 for Aarav Textiles, invoice HF-2041. A new message says the bank account changed today and asks finance to pay before the evening run. You are the investigator on the case.</p>
          <ul className="mt-6 space-y-2 text-sm text-[#d5deea]">
            <li>Background: Aarav Textiles is a real supplier on the vendor master. The relationship is not new.</li>
            <li>Incident: the new mail also asks for edit rights on the bank file.</li>
            <li>Objective: decide whether the payment should move, and file a report that matches the evidence.</li>
          </ul>
          <button onClick={() => setPhase('tutorial')} className="mt-8 rounded-full bg-[#2563eb] px-5 py-3 text-sm font-semibold">Start investigation</button>
        </div>
      )}
      {phase === 'tutorial' && (
        <div className="mx-auto max-w-2xl px-6 py-16">
          <p className="text-xs tracking-[0.16em] text-[#f0c575]">EVIDENCE TUTORIAL · {step + 1} / {TUTORIAL.length}</p>
          <h1 className="mt-3 text-3xl font-semibold">How this desk works</h1>
          <p className="mt-4 text-lg leading-relaxed text-[#d5deea]">{TUTORIAL[step]}</p>
          <button
            onClick={() => (step < TUTORIAL.length - 1 ? setStep(step + 1) : setPhase('world'))}
            className="mt-8 rounded-full bg-white px-5 py-3 text-sm font-semibold text-black"
          >
            {step < TUTORIAL.length - 1 ? 'Next' : 'Enter the building'}
          </button>
        </div>
      )}
      {phase === 'world' && (
        <div className="relative h-screen">
          <OfficeScene
            seated={seated}
            collected={flags}
            objectives={objectiveItems}
            onEntered={() => add('entered-building')}
            onLocate={() => add('found-workstation')}
            onSit={() => { add('used-workstation'); setSeated(true); }}
            onStand={() => setSeated(false)}
            onCollect={add}
          />
          {seated && (
        <div className="absolute inset-0 z-30 grid h-full grid-cols-[72px_1fr_280px] grid-rows-[52px_1fr] bg-[#070b10]">
          <header className="col-span-3 flex items-center justify-between border-b border-white/10 px-4 text-sm">
            <span>Meridian Forge · corporate desktop</span>
            <span>{evidence.length} evidence · {doneCount}/{OBJECTIVES.length} objectives</span>
            <span className="flex items-center gap-4">
              <button onClick={() => setSeated(false)} className="text-[#f0c575]">Stand up</button>
              <Link href="/games" className="text-[#93c5fd]">Exit case</Link>
            </span>
          </header>
          <nav className="flex flex-col gap-1 border-r border-white/10 bg-[#0b1016] p-2">
            {(['mail', 'chat', 'calendar', 'browser', 'files', 'notes', 'board'] as AppId[]).map((id) => (
              <button key={id} onClick={() => setApp(id)} className={`rounded-xl px-2 py-3 text-[11px] capitalize ${app === id ? 'bg-[#1d4e89]' : 'text-[#b7c3d6]'}`}>{id}</button>
            ))}
            <button onClick={() => setSeated(false)} className="mt-auto rounded-xl bg-[#3a2a12] px-2 py-3 text-[11px] text-[#f0c575]">Stand up</button>
          </nav>
          <section className="overflow-auto bg-[#10161f]">
            {app === 'mail' && <Mail folder={folder} setFolder={(next) => { setFolder(next); if (next === 'inbox') add('opened-inbox'); }} query={query} setQuery={setQuery} mailId={mailId} open={(id) => { setMailId(id); add('opened-inbox'); if (id === 'change') add('opened-change'); }} add={add} flags={flags} />}
            {app === 'chat' && <Chat add={add} found={flags.includes('vikram')} />}
            {app === 'calendar' && <Calendar add={add} found={flags.includes('calendar')} />}
            {app === 'browser' && <Browser add={add} found={flags.includes('bookmark')} />}
            {app === 'files' && <Files add={add} flags={flags} onDocs={() => setDocsOpen(true)} />}
            {app === 'notes' && <Notes add={add} found={flags.includes('notes')} />}
            {app === 'board' && <Board add={add} found={flags.includes('board')} />}
          </section>
          <aside className="border-l border-white/10 bg-[#0c121a] p-4">
            <p className="text-xs tracking-[0.14em] text-[#93c5fd]">OBJECTIVES</p>
            <ul className="mt-3 space-y-2 text-sm">
              {OBJECTIVES.map((item) => (
                <li key={item.id} className={item.test(bag) ? 'text-[#86efac]' : 'text-[#d5deea]'}>{item.test(bag) ? '✓' : '○'} {item.label}</li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-[#93a4bf]">{evidence.length} recorded</p>
            <button disabled={!flags.includes('opened-change')} onClick={() => setReporting(true)} className="mt-4 w-full rounded-full bg-[#2563eb] py-2 text-sm font-semibold disabled:opacity-40">Submit case report</button>
            <button onClick={() => setSeated(false)} className="mt-2 w-full rounded-full border border-white/15 py-2 text-sm">Stand up</button>
          </aside>
        </div>
          )}
        </div>
      )}
      {docsOpen && (
        <Modal title="Document access request" onClose={() => setDocsOpen(false)}>
          <p className="text-sm text-[#d5deea]">accounts@aarav-textiies.example wants Edit, Download, and Share outside the organisation on Vendor bank master.</p>
          <p className="mt-2 text-sm text-[#93a4bf]">Current access: you can edit. Finance can view. External sharing is off. This simulation cannot change a real file.</p>
          <div className="mt-4 grid gap-2">
            {[
              ['approve', 'Approve every permission'],
              ['view', 'Allow view only'],
              ['deny', 'Deny and report the request'],
            ].map(([id, label]) => (
              <button key={id} onClick={() => { setDocChoice(id); add('doc-request'); add('doc-decision'); }} className={`rounded-xl border px-3 py-2 text-left text-sm ${docChoice === id ? 'border-[#60a5fa]' : 'border-white/10'}`}>{label}</button>
            ))}
          </div>
          {docChoice && <p className="mt-3 text-sm text-[#f0c575]">{docChoice === 'deny' ? 'External edit rights are not required to ask a question about an invoice. Denying and reporting matches the file’s purpose.' : 'The request came from the same lookalike address as the payment change. Extra rights are not a safe middle step.'}</p>}
        </Modal>
      )}
      {reporting && phase === 'world' && (
        <Modal title="Investigation report" onClose={() => setReporting(false)}>
          <p className="text-sm text-[#d5deea]">What should happen to the ₹39,85,000 payment?</p>
          <div className="mt-3 grid gap-2">
            {[
              ['pay', 'Pay the new account. The invoice number is real.'],
              ['call', 'Call the number in the email and pay if they agree.'],
              ['hold', 'Do not pay the new account. Report it, and verify only with the number already on the vendor master.'],
            ].map(([id, label]) => (
              <button key={id} onClick={() => setConclusion(id)} className={`rounded-xl border px-3 py-2 text-left text-sm ${conclusion === id ? 'border-[#60a5fa]' : 'border-white/10'}`}>{label}</button>
            ))}
          </div>
          <button disabled={!conclusion} onClick={submit} className="mt-4 rounded-full bg-[#2563eb] px-4 py-2 text-sm font-semibold disabled:opacity-40">File the report</button>
        </Modal>
      )}
      {phase === 'result' && (
        <div className="mx-auto max-w-3xl px-6 py-12">
          <p className="text-xs tracking-[0.16em] text-[#93c5fd]">CASE RESULT</p>
          <h1 className="mt-3 text-4xl font-semibold">{conclusion === 'hold' ? 'The payment stays frozen' : 'The report does not match the evidence'}</h1>
          <p className="mt-4 text-[#d5deea]">{conclusion === 'hold' ? 'The invoice number was real. The destination was not. A lookalike domain, a new account, and a permission grab belong in one report to security, confirmed only through the vendor file.' : 'Paying, or trusting the phone number that arrived with the request, follows the path the sender chose. The vendor master was the check.'}</p>
          <p className="mt-4 text-sm text-[#93a4bf]">Time {formatClock(Math.round((Date.now() - started) / 1000))} · Evidence {evidence.length}</p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl bg-[#121a28] p-4">
              <h2 className="font-semibold">Collected</h2>
              <ul className="mt-2 space-y-1 text-sm text-[#d5deea]">{evidence.map((id) => <li key={id}>{EVIDENCE[id].label}</li>)}</ul>
            </article>
            <article className="rounded-2xl bg-[#121a28] p-4">
              <h2 className="font-semibold">Missed</h2>
              <ul className="mt-2 space-y-1 text-sm text-[#d5deea]">{Object.entries(EVIDENCE).filter(([id, item]) => item.key && !flags.includes(id)).map(([id, item]) => <li key={id}>{item.label}</li>)}</ul>
            </article>
          </div>
          {flags.includes('usb') && <p className="mt-4 text-sm text-[#f0c575]">The USB was noted and kept out of the payment conclusion. It is a facilities issue for IT, not proof about invoice HF-2041.</p>}
          <Link href="/games" className="mt-6 inline-block rounded-full bg-white px-4 py-2 text-sm font-semibold text-black">Back to games</Link>
        </div>
      )}
    </div>
  );
}

function Mail({ folder, setFolder, query, setQuery, mailId, open, add, flags }: { folder: string; setFolder: (folder: 'inbox' | 'sent' | 'drafts' | 'archive') => void; query: string; setQuery: (value: string) => void; mailId: string | null; open: (id: string) => void; add: (id: string) => void; flags: string[] }) {
  const messages = [
    { id: 'change', folder: 'inbox', from: 'Priya Shah', address: 'accounts@aarav-textiies.example', subject: 'URGENT: bank change before the 4pm run — HF-2041', body: 'change' },
    { id: 'paid', folder: 'inbox', from: 'Priya Shah', address: 'billing@aaravtextiles.example', subject: 'Invoice HF-2038 paid, thank you', body: 'paid' },
    { id: 'policy', folder: 'inbox', from: 'Meera Iyer', address: 'security@meridianforge.example', subject: 'Vendor bank changes', body: 'policy' },
    { id: 'sent', folder: 'sent', from: 'You', address: 'meera.iyer@meridianforge.example', subject: 'Re: HF-2038', body: 'sent' },
    { id: 'draft', folder: 'drafts', from: 'You', address: 'meera.iyer@meridianforge.example', subject: 'Draft: call Aarav about HF-2041', body: 'draft' },
    { id: 'archive', folder: 'archive', from: 'Finance', address: 'ap@meridianforge.example', subject: 'Vendor master excerpt', body: 'archive' },
  ].filter((item) => item.folder === folder && `${item.subject} ${item.from}`.toLowerCase().includes(query.toLowerCase()));
  const selected = messages.find((item) => item.id === mailId) ?? null;
  return (
    <div className="grid h-full md:grid-cols-[180px_260px_1fr]">
      <div className="border-r border-white/10 p-3 text-sm">
        {(['inbox', 'sent', 'drafts', 'archive'] as const).map((id) => (
          <button key={id} onClick={() => setFolder(id)} className={`block w-full rounded-lg px-2 py-2 text-left capitalize ${folder === id ? 'bg-white/10' : ''}`}>{id}</button>
        ))}
      </div>
      <div className="border-r border-white/10">
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search mail" className="m-3 w-[calc(100%-1.5rem)] rounded-lg border border-white/10 bg-transparent px-2 py-1 text-sm" />
        {messages.map((item) => (
          <button key={item.id} onClick={() => open(item.id)} className={`block w-full border-t border-white/5 px-3 py-3 text-left ${mailId === item.id ? 'bg-white/5' : ''}`}>
            <strong className="block text-sm">{item.from}</strong>
            <span className="text-xs text-[#93a4bf]">{item.subject}</span>
          </button>
        ))}
      </div>
      <div className="p-5 text-sm leading-relaxed">
        {!selected && <p className="text-[#93a4bf]">Open a message. The case starts in the inbox.</p>}
        {selected?.id === 'change' && (
          <article>
            <h2 className="text-xl font-semibold">{selected.subject}</h2>
            <p className="mt-2">Priya Shah &lt;<Mark id="sender" flags={flags} onClick={() => add('sender')}>{selected.address}</Mark>&gt;</p>
            <p className="mt-4">Please <Mark id="urgency" flags={flags} onClick={() => add('urgency')}>release ₹39,85,000 before 4pm</Mark> or the shipment stalls. Our bank is now <Mark id="new-account" flags={flags} onClick={() => add('new-account')}>ICICI ****9091</Mark>. If you need to confirm, call <Mark id="mail-phone" flags={flags} onClick={() => add('mail-phone')}>+91 98450 22011</Mark>. The invoice is attached.</p>
            <p className="mt-4 text-[#93a4bf]">Attachment: HF-2041.pdf · open it from Files</p>
          </article>
        )}
        {selected?.id === 'paid' && <article><h2 className="text-xl font-semibold">{selected.subject}</h2><p className="mt-3">Thank you for settling HF-2038. Future invoices will come from <Mark id="prior-domain" flags={flags} onClick={() => add('prior-domain')}>billing@aaravtextiles.example</Mark>. Our accounts line remains +91 22 4000 1180.</p></article>}
        {selected?.id === 'policy' && <article><h2 className="text-xl font-semibold">{selected.subject}</h2><p className="mt-3"><Mark id="policy" flags={flags} onClick={() => add('policy')}>Do not change a vendor bank from a link or a new number in the same email. Use the vendor master.</Mark></p></article>}
        {selected?.id === 'sent' && <article><h2 className="text-xl font-semibold">{selected.subject}</h2><p className="mt-3">Sent to billing@aaravtextiles.example confirming HF-2038. Reply and forward stay inside this simulation.</p><div className="mt-3 flex gap-2"><button className="rounded-full border border-white/15 px-3 py-1">Reply</button><button className="rounded-full border border-white/15 px-3 py-1">Forward</button><button onClick={() => add('policy')} className="rounded-full border border-white/15 px-3 py-1">Report phishing</button></div></article>}
        {selected?.id === 'draft' && <p>Draft note: call the supplier on the stored number before the payment run. Nothing has been sent.</p>}
        {selected?.id === 'archive' && <p>Archive copy of the vendor master summary. The live file is in Files.</p>}
      </div>
    </div>
  );
}

function Mark({ id, flags, onClick, children }: { id: string; flags: string[]; onClick: () => void; children: ReactNode }) {
  const found = flags.includes(id);
  return <button onClick={onClick} className={`rounded px-1 ${found ? 'bg-emerald-900/60 text-emerald-100' : 'bg-amber-400/20 text-amber-100 outline outline-1 outline-amber-300/70'}`}>{children}</button>;
}

function Chat({ add, found }: { add: (id: string) => void; found: boolean }) {
  return <div className="p-6"><h2 className="text-xl font-semibold">Vikram · Accounts payable</h2><p className="mt-4 max-w-xl rounded-2xl bg-[#182232] p-4">I did not ask anyone to change Aarav’s bank details. Our file still shows HDFC ****4412.</p><button onClick={() => add('vikram')} className="mt-4 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black">{found ? 'Recorded' : 'Record this message'}</button></div>;
}
function Calendar({ add, found }: { add: (id: string) => void; found: boolean }) {
  return <div className="p-6"><h2 className="text-xl font-semibold">Tomorrow · 11:00</h2><p className="mt-3">Quarterly call — Aarav Textiles. Number on the invite: +91 22 4000 1180. Today 16:00 is the payment run.</p><button onClick={() => add('calendar')} className="mt-4 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black">{found ? 'Recorded' : 'Record the stored number'}</button></div>;
}
function Browser({ add, found }: { add: (id: string) => void; found: boolean }) {
  return <div className="p-6"><h2 className="text-xl font-semibold">Bookmarks</h2><p className="mt-3">Supplier portal · https://portal.aaravtextiles.example</p><p className="mt-2 text-sm text-[#93a4bf]">A preview of the lookalike host stays inside this desk. It is not a live website.</p><button onClick={() => add('bookmark')} className="mt-4 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black">{found ? 'Recorded' : 'Record the known portal'}</button></div>;
}
function Files({ add, flags, onDocs }: { add: (id: string) => void; flags: string[]; onDocs: () => void }) {
  return <div className="grid gap-3 p-6 md:grid-cols-3">{[
    ['master', 'Vendor master — Aarav', 'billing@aaravtextiles.example · HDFC ****4412 · +91 22 4000 1180'],
    ['invoice', 'HF-2041 attachment', 'ICICI ****9091 · phone +91 98450 22011 · not the master'],
  ].map(([id, title, copy]) => (
    <button key={id} onClick={() => add(id)} className="rounded-2xl border border-white/10 p-4 text-left"><strong>{title}</strong><p className="mt-2 text-sm text-[#d5deea]">{copy}</p><span className="mt-3 block text-xs text-[#f0c575]">{flags.includes(id) ? 'In the case file' : 'Inspect'}</span></button>
  ))}<button onClick={onDocs} className="rounded-2xl border border-amber-300/40 p-4 text-left"><strong>Access request</strong><p className="mt-2 text-sm">External edit on the bank master.</p></button></div>;
}
function Notes({ add, found }: { add: (id: string) => void; found: boolean }) {
  return <div className="p-6"><h2 className="text-xl font-semibold">AP checklist</h2><p className="mt-3 max-w-xl">Call the number on the vendor master before any bank edit. Do not use a number that arrived in the change request.</p><button onClick={() => add('notes')} className="mt-4 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black">{found ? 'Recorded' : 'Record the checklist'}</button></div>;
}
function Board({ add, found }: { add: (id: string) => void; found: boolean }) {
  return <div className="p-6"><h2 className="text-xl font-semibold">Floor notice</h2><p className="mt-3">Security bulletin: payment-redirection fraud is active this month. Report lookalike supplier domains.</p><button onClick={() => add('board')} className="mt-4 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black">{found ? 'Recorded' : 'Record the bulletin'}</button></div>;
}
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return <div className="fixed inset-0 z-40 grid place-items-center bg-black/60 p-4"><div className="w-full max-w-lg rounded-2xl bg-[#121a28] p-5"><div className="flex items-start justify-between gap-4"><h2 className="text-lg font-semibold">{title}</h2><button onClick={onClose}>Close</button></div><div className="mt-3">{children}</div></div></div>;
}
function formatClock(total: number) {
  return `${Math.floor(total / 60)}:${(total % 60).toString().padStart(2, '0')}`;
}
