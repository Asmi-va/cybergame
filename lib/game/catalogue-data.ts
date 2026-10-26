export type GameStyle = 'investigate' | 'walk-and-fix' | 'role-play' | 'manage' | 'arcade';
export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type CatalogueGame = {
  id: string;
  title: string;
  subtitle: string;
  style: GameStyle;
  styleLabel: string;
  time: string;
  rating: DifficultyLevel;
  tagline: string;
  badge: string;
  description: string;
  accentColor: string;
  playable: boolean;
  features: string[];
};

export const CATALOGUE_GAMES: CatalogueGame[] = [
  // Playable Game 1
  {
    id: 'phishing',
    title: 'Phishing Detective 3D',
    subtitle: 'Navrang Tech Fest Mystery',
    style: 'investigate',
    styleLabel: '3D Investigate',
    time: '15 min',
    rating: 'Intermediate',
    tagline: 'Big curiosity. Sharp eyes. Safer clicks.',
    badge: 'Playable Now',
    description: 'Walk through Navrang Public School courtyard in full 3D. Collect evidence at the noticeboard, computer lab, and canteen. Verify claims in person with teacher Ms. Meera before making your call.',
    accentColor: '#174f48',
    playable: true,
    features: ['Real-time 3D campus & player movement', '8 full Indian school festival cases', 'In-person teacher verification', 'Touch D-pad & click-to-walk'],
  },
  // Playable Game 2
  {
    id: 'legit-or-scam',
    title: 'Legit or Scam?',
    subtitle: 'The Digital Fact-Checker',
    style: 'investigate',
    styleLabel: 'Investigate & Decide',
    time: '12 min',
    rating: 'Intermediate',
    tagline: 'Inspect the evidence. Spot the tricks.',
    badge: 'Playable Now',
    description: 'Distinguish authentic messages from scams across 10 realistic Indian scenarios: UPI collect traps, swapped bus-stop QR codes, exam results, free gaming skins, and family impersonation.',
    accentColor: '#9e3f1b',
    playable: true,
    features: ['10 rich simulated Indian scenarios', 'Detailed evidence & domain inspector', 'Real-world independent check', 'Immediate educational takeaways'],
  },
  // Playable Game 3
  {
    id: 'qr-hunt',
    title: 'QR Hunt',
    subtitle: 'Campus Code Investigator',
    style: 'investigate',
    styleLabel: 'Inspect & Scan',
    time: '8 min',
    rating: 'Beginner',
    tagline: 'Look where codes lead before you scan.',
    badge: 'Playable Now',
    description: 'Inspect 10 suspicious and legitimate QR codes across the school library, canteen counter, bus stop, and noticeboards. Check registered domain names, physical overlays, and payment intents.',
    accentColor: '#0f766e',
    playable: true,
    features: ['10 QR inspection stations', 'Domain breakdown & overlay detector', 'Safe vs Trap verdicts', 'Scored case debrief'],
  },
  // Playable Game 4
  {
    id: 'clean-desk',
    title: 'Clean Desk Challenge',
    subtitle: 'Lab & Classroom Tidiness',
    style: 'walk-and-fix',
    styleLabel: 'Walk and Fix',
    time: '10 min',
    rating: 'Beginner',
    tagline: 'Spot what is private. Leave decoys alone.',
    badge: 'Playable Now',
    description: 'Step into the school computer lab and teacher staff desk at the end of the day. Identify sensitive sticky notes, unlocked monitors, exposed attendance registers, and harmless decoys.',
    accentColor: '#2563eb',
    playable: true,
    features: ['Interactive room inspection', 'Confidential vs public tagging', 'Decoy awareness (avoid over-fixing)', 'S to D grade scoring'],
  },
  // Playable Game 5
  {
    id: 'data-dash',
    title: 'Data Dash',
    subtitle: 'Cyber Runner Challenge',
    style: 'arcade',
    styleLabel: 'Arcade Runner',
    time: '5 min',
    rating: 'Beginner',
    tagline: 'Collect good data. Dodge traps and fake gates.',
    badge: 'Playable Now',
    description: 'Speed through the digital highway! Collect verified data packets, leap over malware obstacles, and steer into safe privacy gates while avoiding deceptive login approvals.',
    accentColor: '#7c3aed',
    playable: true,
    features: ['Fast 3-lane arcade gameplay', 'Touch swipe & tap steering', 'Cybersecurity question checkpoints', 'Endless score multiplier'],
  },
  // Reference games from CyberPlay catalogue
  {
    id: 'find-fake-login',
    title: 'Find the Fake Login',
    subtitle: 'Authentication Under Pressure',
    style: 'investigate',
    styleLabel: 'Investigate',
    time: '12 min',
    rating: 'Intermediate',
    tagline: 'Look beyond the logo: check URL hostnames & MFA.',
    badge: 'Coming Soon',
    description: 'Examine lookalike login portals, password autofill traps, OAuth consent prompts, and fake browser popups across multi-monitor office setups.',
    accentColor: '#0369a1',
    playable: false,
    features: ['Hostname splitting', 'Password manager autofill cues', 'Fake popup window dragging', 'MFA challenge simulator'],
  },
  {
    id: 'secure-the-office',
    title: 'Secure the Office',
    subtitle: 'Physical & Digital Risk Audit',
    style: 'walk-and-fix',
    styleLabel: 'Walk and Fix',
    time: '10 min',
    rating: 'Beginner',
    tagline: 'Find what is wrong. Fix it without disturbing decoys.',
    badge: 'Coming Soon',
    description: 'One open modern floor. Discover visible screens through glass, open server racks, dropped badges, and distinguish them from plants and harmless mugs.',
    accentColor: '#15803d',
    playable: false,
    features: ['10 risks drawn from 13', 'Credit budget system', '11 harmless decoys', 'Report card with A to F grade'],
  },
  {
    id: 'wifi-picker',
    title: 'Wi-Fi Picker',
    subtitle: 'Public Network Scanner',
    style: 'investigate',
    styleLabel: 'Investigate',
    time: '32 min',
    rating: 'Intermediate',
    tagline: 'Read the room. Compare candidates before connecting.',
    badge: 'Coming Soon',
    description: 'Evaluate wireless networks in coffee shops, airports, hotels, and conferences. Detect captive portal traps, rogue access points, and evil twin attacks.',
    accentColor: '#b45309',
    playable: false,
    features: ['6 rich environments', 'Interactive spectrum scanner', 'Ask official staff protocol', '10,000 point mastery scale'],
  },
  {
    id: 'the-social-engineer',
    title: 'The Social Engineer',
    subtitle: 'Workday Under Pressure',
    style: 'role-play',
    styleLabel: 'Role-Play',
    time: '20 min',
    rating: 'Advanced',
    tagline: 'Spot tailgaters, fake callers, and urgent requests.',
    badge: 'Coming Soon',
    description: 'Work an entire shift from 09:00 to 16:45 handling 15 realistic requests at the badge gate, printer, and phone while protecting company secrets.',
    accentColor: '#c2410c',
    playable: false,
    features: ['Badge inspection system', 'Directory callbacks', 'Human psychology triggers', 'Incident debrief report'],
  },
  {
    id: 'security-tower-defense',
    title: 'Security Tower Defense',
    subtitle: 'Network Perimeter Defense',
    style: 'manage',
    styleLabel: 'Strategy',
    time: '20 min',
    rating: 'Intermediate',
    tagline: 'Place firewalls, EDR, and SIEM to stop cyber intrusions.',
    badge: 'Coming Soon',
    description: 'Route internet traffic away from data vaults. Build and upgrade MFA gateways, spam filters, intrusion sensors, and SOC analyst teams.',
    accentColor: '#4338ca',
    playable: false,
    features: ['15 authored rounds + endless', '15 defensive cyber controls', '12 attack vectors (DDoS, zero-day)', 'Deep network metrics'],
  },
  {
    id: 'password-builder',
    title: 'Password Builder',
    subtitle: 'Arcade Bit-Strength Puzzle',
    style: 'arcade',
    styleLabel: 'Arcade Puzzle',
    time: '15 min',
    rating: 'Beginner',
    tagline: 'Catch strong passphrase pieces. Dodge brute-force traps.',
    badge: 'Coming Soon',
    description: 'Catch falling rare words, numbers, and symbols to assemble 78-bit passphrases while dodging common dictionary words and shoulder-surfers.',
    accentColor: '#be185d',
    playable: false,
    features: ['Falling piece lane mechanics', 'Entropy strength gauge', 'Age-adaptive profiles (kids to seniors)', 'Vault lock mastery'],
  },
];

