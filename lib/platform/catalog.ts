export type GameMeta = {
  slug: string;
  title: string;
  tagline: string;
  topic: string;
  minutes: string;
  kind: 'Desktop' | 'Investigation' | 'Rooms' | 'Workday' | 'Multiplayer' | 'Incident';
  players: 'Single player' | 'Multiplayer';
  summary: string;
  xp: number;
};

export const GAMES: GameMeta[] = [
  {
    slug: 'find-the-fake-login',
    title: 'Find the Fake Login',
    tagline: 'Can you tell a real sign-in page from a careful fake?',
    topic: 'Identity & Access',
    minutes: '15–20 min',
    kind: 'Desktop',
    players: 'Single player',
    summary: 'Twenty sign-in pages across four chapters. Inspect the address and the page, then classify each one as legitimate, suspicious, or malicious.',
    xp: 200,
  },
  {
    slug: 'phishing-detective',
    title: 'Phishing Detective 3D',
    tagline: 'Build the case. Trust the file, not the latest mail.',
    topic: 'Social Engineering',
    minutes: '20–30 min',
    kind: 'Investigation',
    players: 'Single player',
    summary: 'A supplier payment of ₹39,85,000 is stuck. Use the corporate desktop, the mail, the files, and the office itself before you file the report.',
    xp: 240,
  },
  {
    slug: 'qr-hunt',
    title: 'QR Hunt',
    tagline: 'A code is a link. The domain decides.',
    topic: 'Social Engineering',
    minutes: '12–18 min',
    kind: 'Rooms',
    players: 'Single player',
    summary: 'Six office rooms. Twelve fictional codes. Scan each one and choose whether to open, ignore, or report it.',
    xp: 180,
  },
  {
    slug: 'the-social-engineer',
    title: 'The Social Engineer',
    tagline: 'Check the process, not the person.',
    topic: 'Physical Security',
    minutes: '12–16 min',
    kind: 'Workday',
    players: 'Single player',
    summary: 'One workday, from 09:00 to 16:45. Approve, refuse, verify, or escalate the requests that reach the door, the desk, the printer, and the phone.',
    xp: 200,
  },
  {
    slug: 'insider',
    title: 'INSIDER',
    tagline: 'Someone on floor 4 is not playing the same game.',
    topic: 'Social Engineering',
    minutes: '10–15 min',
    kind: 'Multiplayer',
    players: 'Multiplayer',
    summary: 'A social deduction match at Northwind Dynamics. Practise offline now. A local realtime server is there when two or more people can connect.',
    xp: 120,
  },
  {
    slug: 'ransomware-reaction',
    title: 'Ransomware Reaction',
    tagline: 'The first minutes are a procedure, not a repair job.',
    topic: 'Incident Response',
    minutes: '8–12 min',
    kind: 'Incident',
    players: 'Single player',
    summary: 'A simulated workstation shows the opening signs of ransomware. Identify it, follow the response, and report it. Nothing on your real computer is touched.',
    xp: 160,
  },
];

export const TOPICS = ['All topics', ...Array.from(new Set(GAMES.map((game) => game.topic)))];

export type Achievement = {
  id: string;
  title: string;
  detail: string;
  earned: (input: {
    courseDone: boolean;
    coursePerfect: boolean;
    games: Record<string, { completed?: boolean; score?: number; maxScore?: number }>;
    certificates: Record<string, unknown>;
    academyCompleted: number;
  }) => boolean;
};

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first-lesson', title: 'First lesson finished', detail: 'Complete Modern Email Phishing.', earned: ({ courseDone }) => courseDone },
  { id: 'perfect-lesson', title: 'Clean first listen', detail: 'Score 5 of 5 on your first course attempt.', earned: ({ coursePerfect }) => coursePerfect },
  { id: 'first-cert', title: 'First certificate', detail: 'Earn any Digital Safety Academy certificate.', earned: ({ certificates }) => Object.keys(certificates).length > 0 },
  { id: 'academy-three', title: 'Academy starter pack', detail: 'Earn 3 academy course certificates.', earned: ({ academyCompleted }) => academyCompleted >= 3 },
  { id: 'academy-eight', title: 'Safety graduate', detail: 'Earn all 8 interactive academy certificates.', earned: ({ academyCompleted }) => academyCompleted >= 8 },
  { id: 'login-eye', title: 'Address reader', detail: 'Finish Find the Fake Login.', earned: ({ games }) => !!games['find-the-fake-login']?.completed },
  { id: 'case-filed', title: 'Case filed', detail: 'Submit the Phishing Detective report.', earned: ({ games }) => !!games['phishing-detective']?.completed },
  { id: 'codes', title: 'Twelve codes', detail: 'Finish QR Hunt.', earned: ({ games }) => !!games['qr-hunt']?.completed },
  { id: 'workday', title: 'Workday closed', detail: 'Finish The Social Engineer.', earned: ({ games }) => !!games['the-social-engineer']?.completed },
  { id: 'floor', title: 'Floor 4', detail: 'Finish an INSIDER practice match.', earned: ({ games }) => !!games['insider']?.completed },
  { id: 'first-minutes', title: 'First minutes', detail: 'Complete Ransomware Reaction.', earned: ({ games }) => !!games['ransomware-reaction']?.completed },
];

export const LEARN_ARTICLES = [
  {
    slug: 'trusted-adult',
    title: 'Tell a trusted adult first',
    minutes: '3 min',
    body: 'If a message, call, game chat, or payment feels wrong, pause and tell a parent, guardian, or teacher. Children should not handle cybercrime reporting alone. Adults help with Childline 1098, cyber helpline 1930, and school support.',
  },
  {
    slug: 'personal-data',
    title: 'Protect personal data',
    minutes: '3 min',
    body: 'Your name, photo, phone, school, and ID details are personal data. Do not share OTPs, passwords, or Aadhaar on surprise links or calls. Ask a parent before creating accounts or granting odd app permissions. This matches good DPDP-minded habits for kids.',
  },
  {
    slug: 'upi-approve',
    title: 'You never approve to receive money',
    minutes: '3 min',
    body: 'A UPI collect request that says “approve for cashback” sends money out when you approve. QR codes with a PIN also pay someone. Receive money by watching your own bank or UPI history — not by scanning a stranger’s code.',
  },
  {
    slug: 'free-diamonds',
    title: 'No free diamonds from random links',
    minutes: '3 min',
    body: 'Real games do not give diamonds, UC, or skins through chat links that ask for your password. Stay in the official app or store. Keep your webcam off with strangers and use a username without your real name or school.',
  },
  {
    slug: 'kind-online',
    title: 'Be kind online',
    minutes: '3 min',
    body: 'Pause before you post. Ask before sharing someone else’s photo. If classmates pile on, do not join — support the person and tell a trusted adult. Save evidence instead of deleting everything in panic.',
  },
  {
    slug: 'sender-address',
    title: 'Read the address, not the name',
    minutes: '4 min',
    body: 'The display name is typed by the sender. The domain after the @ sign is the part you compare with a contact you already saved. Extra letters, hyphens, and a different ending are a different destination. A real invoice number can be pasted into a mail from the wrong domain.',
  },
  {
    slug: 'qr-codes',
    title: 'A square is still a link',
    minutes: '3 min',
    body: 'Scanning only reveals a destination. Read the domain before you open it. Codes on posters can be covered with a sticker. If the domain is not one your organisation published, ignore it or report it. Never use a code as a reason to type a password or a payment PIN.',
  },
  {
    slug: 'ransomware-first-minutes',
    title: 'The first minutes of ransomware',
    minutes: '4 min',
    body: 'Warning signs include files you cannot open, a note demanding payment, and shared folders that suddenly fail. Follow the procedure: disconnect the affected machine from the network if that is your organisation’s step, and report to the security team. Do not pay from the note, do not run an unknown decryptor, and do not try to repair servers yourself.',
  },
];
