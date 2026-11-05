import type { CourseCheckpoint, InteractiveCourse } from './types';

const SHARED_FILLERS: CourseCheckpoint[] = [
  {
    id: 'shared-adult',
    principle: 'Trusted adult first.',
    prompt: 'Something online feels scary or confusing. What should you do first?',
    choices: [
      { id: 'alone', text: 'Handle it alone so you do not worry anyone.', correct: false, feedback: 'You deserve support.' },
      { id: 'adult', text: 'Tell a trusted adult (parent, guardian, or teacher).', correct: true, feedback: 'That is the SafeRon rule.' },
      { id: 'stranger', text: 'Ask a random person in a game chat.', correct: false, feedback: 'Strangers are not your support system.' },
      { id: 'post', text: 'Post everything publicly for advice.', correct: false, feedback: 'That can worsen harm.' },
    ],
  },
  {
    id: 'shared-otp',
    principle: 'OTP secrecy.',
    prompt: 'Someone on a call asks you to read an OTP from your phone. What is safest?',
    choices: [
      { id: 'read', text: 'Read it — they say they are support.', correct: false, feedback: 'That hands them control.' },
      { id: 'hang', text: 'Hang up and tell a trusted adult. Do not read the OTP.', correct: true, feedback: 'Correct.' },
      { id: 'photo', text: 'Photograph the OTP and WhatsApp it.', correct: false, feedback: 'Still sharing the secret.' },
      { id: 'later', text: 'Save the OTP for later and keep chatting.', correct: false, feedback: 'End the call.' },
    ],
  },
  {
    id: 'shared-link',
    principle: 'Do not trust urgency links.',
    prompt: 'An SMS says “Act in 5 minutes or lose access” with a link. Best move?',
    choices: [
      { id: 'click', text: 'Open the link immediately.', correct: false, feedback: 'Urgency is the trap.' },
      { id: 'official', text: 'Ignore the link. Open the official app/site yourself or ask an adult.', correct: true, feedback: 'You choose the path.' },
      { id: 'forward', text: 'Forward it to friends to check.', correct: false, feedback: 'That spreads the bait.' },
      { id: 'reply', text: 'Reply with your password to verify.', correct: false, feedback: 'Never.' },
    ],
  },
  {
    id: 'shared-qr',
    principle: 'QR pays out.',
    prompt: 'A stranger says “Scan this QR to receive money.” What is true?',
    choices: [
      { id: 'receive', text: 'Scanning + PIN receives money.', correct: false, feedback: 'PIN sends money out.' },
      { id: 'pay', text: 'Scanning a pay QR and entering UPI PIN sends money out.', correct: true, feedback: 'Correct.' },
      { id: 'safe', text: 'Any QR from WhatsApp is safe.', correct: false, feedback: 'No.' },
      { id: 'school', text: 'Only school QR codes can steal money.', correct: false, feedback: 'Any pay QR can.' },
    ],
  },
  {
    id: 'shared-game',
    principle: 'No free currency via outside links.',
    prompt: 'A chat offers free game diamonds if you log in on a website. What do you do?',
    choices: [
      { id: 'login', text: 'Log in fast before it expires.', correct: false, feedback: 'That steals the account.' },
      { id: 'refuse', text: 'Refuse and tell a parent. Stay in the official game.', correct: true, feedback: 'Perfect.' },
      { id: 'share', text: 'Give a friend your password to test it.', correct: false, feedback: 'Never share passwords.' },
      { id: '2fa', text: 'Turn off 2FA so the site works.', correct: false, feedback: 'That makes theft easier.' },
    ],
  },
  {
    id: 'shared-photo',
    principle: 'Consent for photos.',
    prompt: 'You want to post a classmate’s photo in a big group. First step?',
    choices: [
      { id: 'post', text: 'Post it — they will like the fame.', correct: false, feedback: 'Ask first.' },
      { id: 'ask', text: 'Ask them for permission first.', correct: true, feedback: 'Consent before upload.' },
      { id: 'blur', text: 'Post without asking but blur nothing.', correct: false, feedback: 'Still no consent.' },
      { id: 'tag', text: 'Tag their whole family for fun.', correct: false, feedback: 'Worse.' },
    ],
  },
  {
    id: 'shared-1098',
    principle: 'Know Childline.',
    prompt: 'Childline 1098 is mainly for:',
    choices: [
      { id: 'food', text: 'Food delivery.', correct: false, feedback: 'No.' },
      { id: 'help', text: 'Children needing help with abuse or serious harm — with adult support.', correct: true, feedback: 'Correct.' },
      { id: 'otp', text: 'Sharing OTPs safely.', correct: false, feedback: 'Never share OTPs.' },
      { id: 'game', text: 'Free game codes.', correct: false, feedback: 'No.' },
    ],
  },
];

function simToCheckpoint(course: InteractiveCourse): CourseCheckpoint[] {
  return course.simulations.map((sim) => {
    const correctLabel = sim.actions.find((a) => a.id === sim.correctAction)?.label ?? 'Verify with a trusted adult';
    return {
      id: `sim-${sim.id}`,
      principle: sim.hint,
      prompt: `Simulation: ${sim.title}. You see: “${sim.artifact.slice(0, 140)}${sim.artifact.length > 140 ? '…' : ''}” What should you do?`,
      choices: sim.actions.map((action) => ({
        id: action.id,
        text: action.label,
        correct: action.id === sim.correctAction,
        feedback: action.id === sim.correctAction ? sim.feedbackCorrect : sim.feedbackWrong,
      })),
    };
  });
}

function takeTen(pool: CourseCheckpoint[]): CourseCheckpoint[] {
  const seen = new Set<string>();
  const unique: CourseCheckpoint[] = [];
  for (const item of pool) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    unique.push(item);
  }

  while (unique.length < 10) {
    const filler = SHARED_FILLERS[unique.length % SHARED_FILLERS.length];
    unique.push({ ...filler, id: `${filler.id}-${unique.length}` });
  }

  return unique.slice(0, 10).map((item, index) => ({
    ...item,
    id: `final-${index + 1}-${item.id}`,
  }));
}

/** Build a fixed 10-question certification quiz for a course. */
export function buildFinalQuiz(course: InteractiveCourse): CourseCheckpoint[] {
  return takeTen([...course.quiz, ...simToCheckpoint(course), ...SHARED_FILLERS]);
}

/** 10-question sim-style quiz from video checkpoints + shared safety fillers. */
export function buildCheckpointFinalQuiz(checkpoints: CourseCheckpoint[]): CourseCheckpoint[] {
  return takeTen([...checkpoints, ...SHARED_FILLERS]);
}
