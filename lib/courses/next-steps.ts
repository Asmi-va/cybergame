export type CourseNextStep = {
  about: string;
  howToProceed: string[];
  nextTitle: string;
  nextHref: string;
  nextDetail: string;
};

const DEFAULT: CourseNextStep = {
  about: 'This certificate shows you finished a SafeRon Academy course on cyber safety.',
  howToProceed: [
    'Save or print this certificate from Profile.',
    'Open the Academy learning path for your next module.',
    'Tell a trusted adult what you practised today.',
  ],
  nextTitle: 'Continue in the Academy',
  nextHref: '/academy?tab=path',
  nextDetail: 'Follow the recommended path: learn → practice → story.',
};

export const COURSE_NEXT_STEPS: Record<string, CourseNextStep> = {
  'digital-citizenship': {
    about: 'You learned digital etiquette, footprints, and pausing before you post or download.',
    howToProceed: [
      'Print or save this certificate.',
      'Practice decisions in The Social Engineer module.',
      'Then open Personal data to protect OTPs and permissions.',
    ],
    nextTitle: 'Practice: The Social Engineer',
    nextHref: '/games/the-social-engineer',
    nextDetail: 'Make proportionate choices under pressure — same academy XP.',
  },
  'personal-data-dpdp': {
    about: 'You learned what personal data is, how permissions work, and why OTPs stay secret (DPDP-minded habits).',
    howToProceed: [
      'Save this certificate on Profile.',
      'Practice with Find the Fake Login.',
      'Never share OTPs — even with “support” callers.',
    ],
    nextTitle: 'Practice: Find the Fake Login',
    nextHref: '/games/find-the-fake-login',
    nextDetail: 'Spot real vs fake sign-in pages.',
  },
  'phishing-smishing-vishing': {
    about: 'You learned phishing by mail, SMS (smishing), and voice (vishing).',
    howToProceed: [
      'Keep this certificate with your academy progress.',
      'Play Phishing Detective or Find the Fake Login.',
      'Always leave scare messages and use an official app with an adult.',
    ],
    nextTitle: 'Practice: Phishing Detective',
    nextHref: '/games/phishing-detective',
    nextDetail: 'Investigate a payment case in a simulated office.',
  },
  'gaming-safety': {
    about: 'You learned that free diamonds/UC links are traps and webcam/personal data stay private in games.',
    howToProceed: [
      'Save the certificate.',
      'Replay Find the Fake Login for reward-page fakes.',
      'Agree family rules: official stores only, no webcam with strangers.',
    ],
    nextTitle: 'Practice: Find the Fake Login',
    nextHref: '/games/find-the-fake-login',
    nextDetail: 'Fake reward pages look like real logins.',
  },
  'cyberbullying-bystander': {
    about: 'You learned how to respond to cyberbullying: don’t pile on, save evidence, get a trusted adult.',
    howToProceed: [
      'Print this certificate if you want.',
      'Remember Childline 1098 with an adult’s help.',
      'Continue to Identity & impersonation next.',
    ],
    nextTitle: 'Course: Identity & impersonation',
    nextHref: '/courses/identity-impersonation',
    nextDetail: 'Verify urgent “family” messages before acting.',
  },
  'identity-impersonation': {
    about: 'You learned to verify surprising messages and refuse pressure for private photos or secret payments.',
    howToProceed: [
      'Save this certificate.',
      'Practice India payment scams next.',
      'Create a family code word for real emergencies.',
    ],
    nextTitle: 'Course: India payment scams',
    nextHref: '/courses/india-payment-scams',
    nextDetail: 'UPI, QR, bill SMS, and job/scheme traps.',
  },
  'india-payment-scams': {
    about: 'You learned UPI collect, QR payout traps, bill/parcel scares, and pay-first job/scheme frauds.',
    howToProceed: [
      'Save this certificate.',
      'Practice with QR Hunt.',
      'Then enter the Nayapur story game to apply skills on the street.',
    ],
    nextTitle: 'Practice: QR Hunt',
    nextHref: '/games/qr-hunt',
    nextDetail: 'Open, ignore, or report twelve codes.',
  },
  'report-and-get-help': {
    about: 'You learned help-seeking: trusted adult first, Childline 1098, cyber helpline 1930, keep evidence.',
    howToProceed: [
      'Save all certificates from Profile.',
      'Play Ransomware Reaction for incident steps.',
      'Return to Academy path or Nayapur story game.',
    ],
    nextTitle: 'Story game: Nayapur',
    nextHref: '/nayapur',
    nextDetail: 'Learn from street missions with neighbours.',
  },
  'email-phishing': {
    about: 'You completed the Modern Email Phishing video lesson and checkpoints.',
    howToProceed: [
      'Save this certificate.',
      'Continue with interactive Phishing, smishing & vishing.',
      'Practice on Find the Fake Login.',
    ],
    nextTitle: 'Course: Phishing, smishing & vishing',
    nextHref: '/courses/phishing-smishing-vishing',
    nextDetail: 'SMS and call traps beyond email.',
  },
};

export function getCourseNextStep(slug: string): CourseNextStep {
  return COURSE_NEXT_STEPS[slug] ?? DEFAULT;
}
