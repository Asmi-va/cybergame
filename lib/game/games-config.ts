export type GameId = 'phishing' | 'legit-or-scam' | 'whatsapp' | 'portal' | 'upi';

export type GameDef = {
  id: GameId;
  title: string;
  subtitle: string;
  tagline: string;
  badge: string;
  description: string;
  accentColor: string;
  iconName: string;
};

export const GAMES: GameDef[] = [
  {
    id: 'phishing',
    title: 'Phishing Detective',
    subtitle: 'The Tech Fest Mystery',
    tagline: 'Big curiosity. Sharp eyes. Safer clicks.',
    badge: '3D Campus Adventure',
    description: 'Explore Navrang Public School in full 3D, inspect deceptive communications, verify details in person with teachers, and protect fellow students from digital traps.',
    accentColor: '#174f48',
    iconName: 'Search',
  },
  {
    id: 'legit-or-scam',
    title: 'Legit or Scam?',
    subtitle: 'The Digital Fact-Checker',
    tagline: 'Inspect the evidence. Spot the tricks.',
    badge: 'Interactive Inspection Simulator',
    description: 'Analyze real-world Indian digital scenarios: UPI requests, public QR codes, gaming rewards, delivery notifications, and messages impersonating teachers or relatives.',
    accentColor: '#9e3f1b',
    iconName: 'ShieldAlert',
  },
  {
    id: 'whatsapp',
    title: 'WhatsApp Forward Investigation',
    subtitle: 'Truth Behind Viral Messages',
    tagline: 'Pause before you forward. Verify before you believe.',
    badge: 'Viral Message Lab',
    description: 'Investigate viral chain forwards, sensational school cancellation alerts, fake government schemes, and deceptive emergency claims before they spread.',
    accentColor: '#1e6840',
    iconName: 'MessageSquareShare',
  },
  {
    id: 'portal',
    title: 'School Portal Security',
    subtitle: 'Computer Lab Lockdown',
    tagline: 'Guard your logins. Lock shared devices.',
    badge: 'Lab Defense Simulator',
    description: 'Navigate the school computer lab, identify lookalike phishing login pages, handle shared browser sessions safely, and prevent credential leaks.',
    accentColor: '#1b3b6f',
    iconName: 'Laptop',
  },
  {
    id: 'upi',
    title: 'UPI & QR Scam Simulator',
    subtitle: 'Payment Safety Lab',
    tagline: 'PIN sends money. Receiving is always free.',
    badge: 'Payment Safety Simulator',
    description: 'Evaluate simulated street vendor QR codes, marketplace refund tricks, reward scratch cards, and money-request traps safely with zero financial risk.',
    accentColor: '#7a224a',
    iconName: 'QrCode',
  },
];

