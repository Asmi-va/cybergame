export type Guide = {
  id: string;
  name: string;
  role: string;
  blurb: string;
  shirt: string;
  skin: string;
  hair: string;
  accent: string;
};

export const GUIDES: Guide[] = [
  { id: 'mira', name: 'Mira Sen', role: 'Calm analyst', blurb: 'Stops at the request before the logo.', shirt: '#1f6f78', skin: '#f0c7a8', hair: '#2a211c', accent: '#9ee7df' },
  { id: 'arun', name: 'Arun Desai', role: 'Address reader', blurb: 'Compares the domain with the one on file.', shirt: '#345a8a', skin: '#e0b090', hair: '#1c1a22', accent: '#f0c575' },
  { id: 'lila', name: 'Lila George', role: 'Precise reviewer', blurb: 'Names the ask in one sentence.', shirt: '#5b3d86', skin: '#f3d2b5', hair: '#3a2418', accent: '#e4d4ff' },
  { id: 'dev', name: 'Dev Kapoor', role: 'Practical teammate', blurb: 'Uses the path the company already has.', shirt: '#1d4e89', skin: '#c98a62', hair: '#24160f', accent: '#b9d6ff' },
  { id: 'noor', name: 'Noor Rahman', role: 'Patient teacher', blurb: 'Explains the principle after every choice.', shirt: '#1f6b45', skin: '#e7be9a', hair: '#1a120e', accent: '#b7ebc8' },
  { id: 'kabir', name: 'Kabir Shah', role: 'Careful auditor', blurb: 'Keeps payment changes next to the vendor file.', shirt: '#3d4a5c', skin: '#d9a57a', hair: '#2c241c', accent: '#d5deea' },
  { id: 'sana', name: 'Sana Iqbal', role: 'Clear reporter', blurb: 'Knows what to say after a click.', shirt: '#8a3d55', skin: '#f0c7a8', hair: '#241018', accent: '#ffd0dc' },
];

export function guideById(id: string) {
  return GUIDES.find((guide) => guide.id === id) ?? GUIDES[0];
}

export function GuidePortrait({ guide, size = 72 }: { guide: Guide; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" aria-hidden>
      <rect width="80" height="80" rx="18" fill="#0e1728" />
      <circle cx="40" cy="34" r="16" fill={guide.skin} />
      <path d="M18 34c2-16 12-24 22-24s20 8 22 24c-6-6-12-8-22-8s-16 2-22 8z" fill={guide.hair} />
      <rect x="22" y="52" width="36" height="22" rx="10" fill={guide.shirt} />
      <circle cx="33" cy="34" r="1.6" fill="#1b1a1a" />
      <circle cx="47" cy="34" r="1.6" fill="#1b1a1a" />
      <path d="M34 41c2 2 10 2 12 0" stroke="#7a4b3a" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <circle cx="62" cy="18" r="6" fill={guide.accent} />
    </svg>
  );
}
