export type FourC = 'content' | 'contact' | 'conduct' | 'contract';
export type AgeBand = '8-12' | '13-16';

export type CourseChoice = {
  id: string;
  text: string;
  correct: boolean;
  feedback: string;
};

export type CourseCheckpoint = {
  id: string;
  principle: string;
  prompt: string;
  choices: CourseChoice[];
};

export type LessonPanel = {
  id: string;
  heading: string;
  body: string;
};

export type SimAction = 'proceed' | 'verify' | 'reject' | 'report';

export type SimulationStep = {
  id: string;
  title: string;
  channel: 'sms' | 'whatsapp' | 'call' | 'upi' | 'web' | 'chat' | 'form';
  artifact: string;
  hint: string;
  correctAction: SimAction;
  actions: { id: SimAction; label: string }[];
  feedbackCorrect: string;
  feedbackWrong: string;
};

export type InteractiveCourse = {
  slug: string;
  module: string;
  title: string;
  subtitle: string;
  description: string;
  durationLabel: string;
  maxXp: number;
  passScore: number;
  certificateTitle: string;
  fourCs: FourC[];
  ageBands: AgeBand[];
  handbookRefs: string[];
  dpdpTopics: string[];
  parentNote: string;
  outcomes: string[];
  facts: string[];
  lessons: LessonPanel[];
  simulations: SimulationStep[];
  quiz: CourseCheckpoint[];
  videoSrc?: string;
  practiceGameSlug?: string;
};

export const DEFAULT_SIM_ACTIONS: SimulationStep['actions'] = [
  { id: 'proceed', label: 'Looks safe — continue' },
  { id: 'verify', label: 'Verify with a trusted adult' },
  { id: 'reject', label: 'Reject / delete / ignore' },
  { id: 'report', label: 'Report / tell someone who can help' },
];

export function xpForCorrect(correct: number, maxXp: number, total: number) {
  if (total <= 0) return 0;
  return Math.round((correct / total) * maxXp);
}

export function makeCertificateId(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const rand = String(Math.floor(1000 + Math.random() * 9000));
  return `SR-${y}-${m}${d}-${rand}`;
}
