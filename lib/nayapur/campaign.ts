export type NayapurArea =
  | 'residential'
  | 'market'
  | 'school'
  | 'transport'
  | 'club';

export type MissionId =
  | 'bijli-bill'
  | 'payment-aaya'
  | 'free-fire'
  | 'parcel-stuck'
  | 'scholarship'
  | 'bank-call'
  | 'ticket-confirm'
  | 'photo-delete'
  | 'boss-call'
  | 'cyber-cafe';

export type MissionDef = {
  id: MissionId;
  chapter: number;
  title: string;
  area: NayapurArea;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  blurb: string;
  miniGame?: string;
};

export const MISSIONS: MissionDef[] = [
  { id: 'bijli-bill', chapter: 1, title: 'Bijli Bill Ka Chakkar', area: 'residential', difficulty: 'Beginner', blurb: 'A neighbour gets a disconnection threat over SMS.' },
  { id: 'payment-aaya', chapter: 2, title: 'Payment Aaya Kya?', area: 'market', difficulty: 'Beginner', blurb: 'Mr. Sharma is shown a payment screenshot that does not match his ledger.', miniGame: 'the-social-engineer' },
  { id: 'free-fire', chapter: 3, title: 'Free Fire Diamond Giveaway', area: 'school', difficulty: 'Beginner', blurb: 'Aarav almost signs into a fake reward page.', miniGame: 'find-the-fake-login' },
  { id: 'parcel-stuck', chapter: 2, title: 'Your Parcel Is Stuck', area: 'transport', difficulty: 'Intermediate', blurb: 'Riya is asked for an unexpected courier fee.', miniGame: 'qr-hunt' },
  { id: 'scholarship', chapter: 3, title: 'Scholarship Ka Shortcut', area: 'school', difficulty: 'Intermediate', blurb: 'A paid registration shortcut for a scholarship.', miniGame: 'find-the-fake-login' },
  { id: 'bank-call', chapter: 4, title: 'Bank Se Baat Hui?', area: 'residential', difficulty: 'Intermediate', blurb: 'A caller wants OTPs and PINs.', miniGame: 'the-social-engineer' },
  { id: 'ticket-confirm', chapter: 4, title: 'Ticket Confirm Hai?', area: 'transport', difficulty: 'Intermediate', blurb: 'An unfamiliar booking site looks too cheap.', miniGame: 'find-the-fake-login' },
  { id: 'photo-delete', chapter: 3, title: 'Photo Toh Delete Kar!', area: 'school', difficulty: 'Intermediate', blurb: 'A student photo is shared without consent.' },
  { id: 'boss-call', chapter: 4, title: 'Boss Ka Video Call', area: 'residential', difficulty: 'Advanced', blurb: 'An urgent video call that looks familiar.' },
  { id: 'cyber-cafe', chapter: 5, title: 'Cyber Café Ka Raaz', area: 'market', difficulty: 'Advanced', blurb: 'A shared PC still has someone else’s account open.', miniGame: 'ransomware-reaction' },
];

export const CLUB_FACILITIES = [
  { id: 'reception', label: 'Club Reception', unlockMission: null as MissionId | null },
  { id: 'lab', label: 'Computer Lab', unlockMission: 'payment-aaya' as MissionId },
  { id: 'investigation', label: 'Investigation Room', unlockMission: 'parcel-stuck' as MissionId },
  { id: 'classroom', label: 'Awareness Classroom', unlockMission: 'bank-call' as MissionId },
  { id: 'helpdesk', label: 'Help Desk', unlockMission: 'photo-delete' as MissionId },
  { id: 'server', label: 'Secure Server Room', unlockMission: 'cyber-cafe' as MissionId },
] as const;
