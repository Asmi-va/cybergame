export type StationId = 'noticeboard' | 'teacher' | 'computer' | 'canteen';
export type Point = { x: number; z: number };

export const stations: Record<StationId, { name: string; label: string; position: Point }> = {
  noticeboard: { name: 'Noticeboard', label: 'School noticeboard', position: { x: -6, z: 1 } },
  teacher: { name: 'Ms. Meera', label: 'Talk to Ms. Meera', position: { x: 2, z: -3 } },
  computer: { name: 'Computer lab', label: 'Festival computer', position: { x: 8, z: -4 } },
  canteen: { name: 'Canteen', label: 'Canteen notice', position: { x: 9, z: 5 } },
};

export type Mission = {
  title: string;
  short: string;
  station: StationId;
  sender: string;
  subject: string;
  message: string;
  linkText: string;
  clues: { label: string; detail: string }[];
  verification: string;
  safe: boolean;
  lesson: string;
};

export const missions: Mission[] = [
  {
    title: 'The scholarship surprise',
    short: 'A scholarship too good to be true?',
    station: 'noticeboard',
    sender: 'Awards desk · bright-future@award-fast.example',
    subject: 'You have won a scholarship!',
    message: 'Hello, student! You have been chosen for the Bright Future scholarship. Claim your award before lunch! Use the registration link and send a parent’s payment PIN to reserve your place.',
    linkText: 'award-fast.example/claim-scholarship',
    clues: [
      { label: 'Check the sender', detail: 'award-fast.example is not our school address (navrang.example). Anyone can write "Awards desk" as their display name.' },
      { label: 'Inspect the request', detail: 'The message asks for a parent’s payment PIN. Legitimate scholarships never require secret payment PINs or passwords.' },
      { label: 'Look at the deadline', detail: '“Claim before lunch!” creates false panic so you act quickly without asking a trusted adult.' },
    ],
    verification: 'I’m so glad you checked! Our school scholarship forms are handed out by the principal’s office next month, and we NEVER ask for payment codes or PINs. This message is definitely fraudulent.',
    safe: false,
    lesson: 'You protected your classmates! Always check the real sender address, never share secret codes or PINs, and double-check urgent prizes in person.',
  },
  {
    title: 'The urgent exam result alert',
    short: 'Sudden marks update or panic trap?',
    station: 'computer',
    sender: 'School Exam Portal · marks-update@navrang-results.online',
    subject: 'URGENT: Re-examination alert & score mismatch',
    message: 'Attention student: A scoring mismatch was detected in your mid-term assessment. Log into the external emergency marks portal within 2 hours or your grades will be withheld.',
    linkText: 'navrang-results.online/verify-marks?id=9214',
    clues: [
      { label: 'Examine the web address', detail: 'The link points to "navrang-results.online" instead of the official school portal "portal.navrang.example".' },
      { label: 'Spot the pressure tactics', detail: 'Threatening "grades will be withheld in 2 hours" is designed to trigger anxiety and impulsive logins.' },
      { label: 'Unexpected login page', detail: 'The page asks for student credentials and parent phone numbers directly via an unfamiliar external link.' },
    ],
    verification: 'Our official examination results are only published through portal.navrang.example, and teachers always speak with students directly if there is any evaluation issue. Never enter passwords on strange result sites!',
    safe: false,
    lesson: 'Great eye! Real schools do not send threatening two-hour deadlines or ask you to log into unfamiliar domain names.',
  },
  {
    title: 'The substitute teacher impersonator',
    short: 'Is that really Sharma Sir writing?',
    station: 'noticeboard',
    sender: 'Sharma Sir (Robotics) · sharma-teacher@freemail-in.example',
    subject: 'Robotics kit installation app for festival',
    message: 'Dear students, I am off campus today. Download and install this robotics utility `.apk` package on your home devices right away to be selected for the tech exhibition team.',
    linkText: 'drive-share-download.example/robotics-setup.apk',
    clues: [
      { label: 'Look at the sender mailbox', detail: 'Sharma Sir uses his official school email (@navrang.example), not an unverified free mail account.' },
      { label: 'Dangerous file type', detail: 'The email asks you to download an unknown executable app (.apk / installer). Malicious software often hides inside app downloads.' },
      { label: 'Bypassing school channels', detail: 'All robotics festival tools are pre-installed in the computer lab; teachers do not ask you to sideload unknown apps.' },
    ],
    verification: 'Sharma Sir is actually right in the staff room! He confirms he never sent this email, and our school only uses approved software that our tech team installs directly.',
    safe: false,
    lesson: 'Outstanding catch! Scammers often pretend to be familiar teachers. Never download unknown software or app packages without adult verification.',
  },
  {
    title: 'Official Science Exhibition circular',
    short: 'A genuine school announcement to verify',
    station: 'computer',
    sender: 'Principal Office · admin@navrang.example',
    subject: 'Schedule for Annual Tech Utsav project submissions',
    message: 'Greetings students: Project submissions for Tech Utsav close this Friday at 4:00 PM. Please submit your project abstract through the student portal or hand in a physical copy to your class teacher.',
    linkText: 'portal.navrang.example/tech-utsav-2026',
    clues: [
      { label: 'Legitimate domain', detail: 'The sender is @navrang.example and the link is portal.navrang.example — the authentic school domain.' },
      { label: 'No secret information requested', detail: 'The message only provides schedules and asks for project abstracts. No passwords, payments, or OTPs are requested.' },
      { label: 'Multiple trusted options', detail: 'Students can submit either online via the known portal or by handing a physical copy to their class teacher.' },
    ],
    verification: 'Yes, this is our official circular! We put it out this morning. Notice how it uses our genuine school domain and gives you a normal, calm deadline without asking for sensitive secrets.',
    safe: true,
    lesson: 'Not every unexpected message is malicious! Learning to recognize legitimate notices from authentic sources gives you confidence in digital spaces.',
  },
  {
    title: 'The free canteen samosa & lassi QR trap',
    short: 'Scan to claim festival feast treats?',
    station: 'canteen',
    sender: 'Fest Treat Club · promo@quick-canteen-bazaar.example',
    subject: 'Fest special: Free samosa & drink voucher',
    message: 'Special Tech Utsav feast! Scan the QR code pasted near the water cooler or click the voucher link to enter your parent UPI PIN and receive Rs. 100 canteen cash immediately.',
    linkText: 'quick-canteen-bazaar.example/scan-upi-cash',
    clues: [
      { label: 'UPI PIN logic trap', detail: 'You only ever enter a UPI PIN to SEND money, never to RECEIVE money or coupons!' },
      { label: 'Unverified poster source', detail: 'The flyer has no school stamp and points to an unofficial third-party payment form.' },
      { label: 'Too good to be true', detail: 'Promising instant free money in exchange for banking credentials is the classic payment scam tactic.' },
    ],
    verification: 'Canteen Uncle Rajinder says: "We only accept tokens purchased at the billing counter! I did not put up that QR code." Always remember: receiving money NEVER requires entering your PIN!',
    safe: false,
    lesson: 'Crucial rule remembered: Entering a UPI PIN always sends money out of an account. You never enter a PIN to receive a prize or payment!',
  },
  {
    title: 'The fake festival circular',
    short: 'Misleading instructions about bag checks',
    station: 'noticeboard',
    sender: 'Security Committee · security-check@fake-circulars.example',
    subject: 'Emergency rule: Surrender your mobile phone credentials',
    message: 'Notice to all students: Due to cyber safety week, every student must submit their personal email passwords and phone unlocking codes on this online inspection form before tomorrow morning.',
    linkText: 'inspection-desk.example/submit-credentials',
    clues: [
      { label: 'Rule violation', detail: 'School rules explicitly forbid teachers or staff from ever asking for students’ private passwords or phone PINs.' },
      { label: 'Suspicious origin', detail: 'The circular uses an unofficial external domain fake-circulars.example.' },
      { label: 'Severe privacy risk', detail: 'Handing over unlocking codes or passwords compromises personal photos, family communications, and accounts.' },
    ],
    verification: 'The school headmaster and I have already alerted security about this fake paper. No school authority will ever ask for your private passwords or device codes.',
    safe: false,
    lesson: 'Your passwords and screen locks belong only to you and your parents. No school, teacher, or authority will ever ask you to surrender them.',
  },
  {
    title: 'The urgent software patch attachment',
    short: 'Urgent anti-virus update `.zip` file?',
    station: 'computer',
    sender: 'IT Support Team · helpdesk-alert@techfest-patch.example',
    subject: 'ACTION REQUIRED: Security patch `Navrang_Patch.zip`',
    message: 'A critical virus was detected in the student network. Extract and execute the attached `Navrang_Patch.zip` on your computer immediately to prevent system locks.',
    linkText: 'techfest-patch.example/files/Navrang_Patch.zip',
    clues: [
      { label: 'Suspicious compressed attachment', detail: 'Emails pushing zip or executable files with urgent warnings are standard vectors for ransomware and malware.' },
      { label: 'External IT identity', detail: 'The IT address techfest-patch.example is unaffiliated with our school’s administration.' },
      { label: 'Fear-inducing language', detail: 'Words like "critical virus" and "immediate action" are designed to stop critical thinking.' },
    ],
    verification: 'Our network administrator manages all campus updates automatically. Students are never asked to download or unzip system patches.',
    safe: false,
    lesson: 'Never run unexpected executable or archive files from emails. True IT departments handle computer updates centrally without sending zip files to students.',
  },
  {
    title: 'The Grand Tech Fest Master Investigation',
    short: 'Connect all the clues to protect the campus',
    station: 'canteen',
    sender: 'Tech Utsav Committee · festival-desk@navrang.example',
    subject: 'Volunteer team badge distribution & schedule',
    message: 'Tech Fest volunteers: Badge collection is scheduled at the main auditorium desk at 2:00 PM today. Please bring your student ID card for physical verification. No digital payments or codes needed.',
    linkText: 'portal.navrang.example/tech-utsav-2026/volunteers',
    clues: [
      { label: 'Sender verification', detail: 'Sent from festival-desk@navrang.example with valid internal routing.' },
      { label: 'Sensible real-world protocol', detail: 'Requires a standard student ID badge at a physical desk on campus, with zero private data or monetary demands.' },
      { label: 'No red flags', detail: 'No artificial panic, no shortened links, no password requests, and consistent with the earlier approved circular.' },
    ],
    verification: 'This is genuine! You cross-referenced the sender address, verified the physical campus location, and confirmed there were no traps. You are now a full-fledged Senior Cyber Detective!',
    safe: true,
    lesson: 'Outstanding investigation! You have mastered the three golden rules: inspect the real address, protect secret codes, and verify in the real world.',
  },
];

export type Progress = {
  mission: number;
  clues: number[];
  verified: boolean;
  completed: number[];
  xp: number;
};

export const initialProgress = (): Progress => ({
  mission: 0,
  clues: [],
  verified: false,
  completed: [],
  xp: 0,
});

export const SAVE_KEY = 'saferon-detective-v1';

export function readProgress(): Progress {
  try {
    const p = JSON.parse(localStorage.getItem(SAVE_KEY) || 'null');
    if (!p || !Number.isInteger(p.mission) || p.mission < 0 || p.mission >= missions.length) return initialProgress();
    return {
      mission: p.mission,
      clues: Array.isArray(p.clues)
        ? p.clues.filter((n: unknown) => Number.isInteger(n) && Number(n) >= 0 && Number(n) < 3)
        : [],
      verified: p.verified === true,
      completed: Array.isArray(p.completed)
        ? [...new Set<number>(p.completed.filter((n: unknown) => Number.isInteger(n) && Number(n) >= 0 && Number(n) < missions.length))]
        : [],
      xp: Number.isFinite(p.xp) ? Math.max(0, Math.min(800, p.xp)) : 0,
    };
  } catch {
    return initialProgress();
  }
}

export const obstacles = [
  { x: 0, z: -9.5, w: 29, d: 4 },
  { x: -13, z: -1.5, w: 3, d: 13 },
  { x: -4, z: 6, w: 4.1, d: 3.5 },
  { x: 5, z: 5, w: 2.8, d: 2.8 },
  { x: -6, z: 0.65, w: 2.6, d: 0.55 },
  { x: 8, z: -4.7, w: 2.8, d: 0.9 },
  { x: 10.5, z: 5, w: 1.2, d: 3 },
];

export function canWalk(x: number, z: number) {
  if (x < -11 || x > 12 || z < -7 || z > 11) return false;
  return !obstacles.some((o) => Math.abs(x - o.x) < o.w / 2 + 0.28 && Math.abs(z - o.z) < o.d / 2 + 0.28);
}
