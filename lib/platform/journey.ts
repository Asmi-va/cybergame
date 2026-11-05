/** Single learning path that connects courses ↔ practice ↔ story */

export type JourneyStep = {
  id: string;
  stage: 'Learn' | 'Practice' | 'Story' | 'Certify';
  title: string;
  detail: string;
  href: string;
  related?: string;
};

export const LEARNING_PATH: JourneyStep[] = [
  {
    id: 'citizenship',
    stage: 'Learn',
    title: 'Digital citizenship',
    detail: 'Etiquette, footprints, and pause-before-you-post.',
    href: '/courses/digital-citizenship',
    related: '/games/the-social-engineer',
  },
  {
    id: 'data',
    stage: 'Learn',
    title: 'Personal data',
    detail: 'OTPs, permissions, and DPDP-minded habits.',
    href: '/courses/personal-data-dpdp',
    related: '/games/find-the-fake-login',
  },
  {
    id: 'phishing',
    stage: 'Learn',
    title: 'Phishing defence',
    detail: 'Smishing, vishing, and fake pages.',
    href: '/courses/phishing-smishing-vishing',
    related: '/games/phishing-detective',
  },
  {
    id: 'fake-login',
    stage: 'Practice',
    title: 'Find the Fake Login',
    detail: 'Classify twenty sign-in pages.',
    href: '/games/find-the-fake-login',
    related: '/courses/phishing-smishing-vishing',
  },
  {
    id: 'qr',
    stage: 'Practice',
    title: 'QR Hunt',
    detail: 'Open, ignore, or report twelve codes.',
    href: '/games/qr-hunt',
    related: '/courses/india-payment-scams',
  },
  {
    id: 'payments',
    stage: 'Learn',
    title: 'India payment scams',
    detail: 'UPI collect, QR traps, bills, jobs.',
    href: '/courses/india-payment-scams',
    related: '/nayapur',
  },
  {
    id: 'nayapur',
    stage: 'Story',
    title: 'Nayapur missions',
    detail: 'Neighbourhood story world — apply what you learned.',
    href: '/nayapur',
    related: '/courses/report-and-get-help',
  },
  {
    id: 'help',
    stage: 'Certify',
    title: 'Report & get help',
    detail: 'Trusted adult, 1098, 1930 — then print certificates.',
    href: '/courses/report-and-get-help',
    related: '/profile',
  },
];

export const GAME_COURSE_LINKS: Record<string, { courseSlug: string; courseTitle: string; blurb: string }> = {
  'find-the-fake-login': {
    courseSlug: 'phishing-smishing-vishing',
    courseTitle: 'Phishing, smishing & vishing',
    blurb: 'Practice follows the phishing course.',
  },
  'phishing-detective': {
    courseSlug: 'phishing-smishing-vishing',
    courseTitle: 'Phishing, smishing & vishing',
    blurb: 'Investigate a supplier payment redirect.',
  },
  'qr-hunt': {
    courseSlug: 'india-payment-scams',
    courseTitle: 'India payment scams',
    blurb: 'QR codes are payment actions — never “receive”.',
  },
  'the-social-engineer': {
    courseSlug: 'digital-citizenship',
    courseTitle: 'Digital citizenship',
    blurb: 'Proportionate decisions under pressure.',
  },
  insider: {
    courseSlug: 'cyberbullying-bystander',
    courseTitle: 'Cyberbullying & bystanders',
    blurb: 'Someone on the floor is not playing fair.',
  },
  'ransomware-reaction': {
    courseSlug: 'report-and-get-help',
    courseTitle: 'Report & get help',
    blurb: 'First minutes are a procedure, not a repair.',
  },
};
