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

export const EMAIL_PHISHING_COURSE = {
  slug: 'email-phishing',
  module: 'Module 01 · Phishing and deceptive messages',
  title: 'Modern email phishing',
  subtitle: 'Invoices, login alerts and HR notes can look finished and still be the wrong ask.',
  description:
    'Learn why tidy writing and a familiar logo do not prove an email is real, how to inspect the request, the sender address and the path you use to check it, and what to do if a password was already typed.',
  durationLabel: 'About 7 min',
  questionCount: 5,
  maxXp: 160,
  outcomes: [
    'A clean layout does not prove the message is real.',
    'Name what the email is asking you to do.',
    'Sign in, pay, or send a code only on a path you already trust.',
  ],
  facts: [
    'Five checkpoint questions inside the video',
    'Ten-question sim quiz before the certificate',
    'About seven minutes of English narration',
    'Progress is saved on this device',
    'Up to 160 XP the first time you finish',
    'Certificate explains what you learned and where to go next',
  ],
  written: [
    {
      heading: 'What it is',
      body: 'Phishing is a message that pretends to come from someone you trust so that you will sign in, pay, download a file, or send a code. The costume is often a login alert, an invoice, an HR note, or an account warning. The costume can be polished. The test is the action it wants.',
    },
    {
      heading: 'How a modern message is built',
      body: 'The display name can say a real team while the address behind it is a lookalike or a free mailbox. A button such as Review, Pay, or View benefits leads to a page the sender controls. An invoice number copied from a real thread does not repair a wrong domain. Spelling is no longer a reliable test.',
    },
    {
      heading: 'How to check it',
      body: 'Name the ask. Notice a deadline that exists to cancel your normal process. Read the address, not only the name. Then leave the message and use a path you already had: a bookmarked portal, a number on the vendor master, or the app you open yourself. Do not use the link or the phone number the message just handed you.',
    },
    {
      heading: 'If you already clicked',
      body: 'Treat a password typed on that page as no longer secret. Change it from a different device, including anywhere it was reused. Tell your security contact through a channel your organisation already published. If money or a card was involved, call the bank on the number printed on the card. Do not install a cleanup tool from the same email, and do not forward the link as a test.',
    },
  ],
};

export const COURSE_LANGUAGES = [
  { id: 'en', label: 'English', narration: true },
];

export const CHECKPOINTS: CourseCheckpoint[] = [
  {
    id: 'requests',
    principle: 'A payment process never needs your mailbox password.',
    prompt: 'A tidy finance email asks you to confirm your mailbox password so an unpaid invoice can be released. What is the safest reading of that request?',
    choices: [
      { id: 'normal', text: 'A password check is a normal accounts step when an invoice is waiting.', correct: false, feedback: 'Paying a supplier does not require the password to your mailbox. The invoice and the password are separate systems.' },
      { id: 'refuse', text: 'Any request for a password, PIN, or one-time code is something to refuse and verify on a path you already trust.', correct: true, feedback: 'The polished layout is not the clue. The clue is the secret the message is asking for.' },
      { id: 'forward', text: 'Forward it to the whole company so more people can decide.', correct: false, feedback: 'Forwarding spreads the link. Report it to the contact your organisation already uses.' },
      { id: 'logo', text: 'Reply with the password if the logo looks familiar.', correct: false, feedback: 'A logo is a picture. It can be copied into any email.' },
    ],
  },
  {
    id: 'urgency',
    principle: 'A short deadline is pressure, not proof.',
    prompt: 'The message says a supplier payment will be cancelled in 25 minutes unless you update bank details from the link. What does that pressure usually mean?',
    choices: [
      { id: 'rank', text: 'A short deadline proves the sender is an executive.', correct: false, feedback: 'Rank is not established by a countdown. Executives can use the normal payment path.' },
      { id: 'pause', text: 'Urgency is being used to skip your normal check. Pause and use the usual process.', correct: true, feedback: 'If the payment is real, it can survive a check against the vendor file. The countdown is there to stop that check.' },
      { id: 'pay', text: 'Pay immediately and investigate after the money has moved.', correct: false, feedback: 'Once the new account is paid, the investigation is a recovery, not a check.' },
      { id: 'caps', text: 'Deadlines only matter when the email is written in capitals.', correct: false, feedback: 'Calm sentences can carry the same pressure as capital letters.' },
    ],
  },
  {
    id: 'sender',
    principle: 'The address identifies the sender. The display name does not.',
    prompt: 'The display name says “Aarav Textiles Accounts”, but the address is accounts@aarav-textiies.example. Your saved contact uses accounts@aaravtextiles.example. What matters most?',
    choices: [
      { id: 'name', text: 'The display name, because that is what people see.', correct: false, feedback: 'Anyone can type a trusted name in the display field.' },
      { id: 'domain', text: 'The actual address, and whether it matches the domain you already have on file.', correct: true, feedback: 'An extra letter in the domain is a different destination, even when the invoice number looks familiar.' },
      { id: 'invoice', text: 'The email is safe if it mentions a real invoice number.', correct: false, feedback: 'Invoice numbers leak and get copied. They do not prove who sent this copy.' },
      { id: 'co', text: 'A shorter domain ending is always the company’s official address.', correct: false, feedback: 'Official domains are the ones your organisation already recorded, not whichever ending looks short.' },
    ],
  },
  {
    id: 'channel',
    principle: 'Verify on a path the suspicious message did not choose.',
    prompt: 'You need to know whether a supplier really changed bank details. Which check can you trust?',
    choices: [
      { id: 'signature', text: 'Call the phone number printed in the email signature.', correct: false, feedback: 'That number arrived with the request. A pretender will answer it and confirm the change.' },
      { id: 'reply', text: 'Reply and ask, “Is this really you?”', correct: false, feedback: 'A reply goes back to the sender who just made the claim.' },
      { id: 'file', text: 'Use the phone number already on the vendor file, or the supplier portal you had bookmarked before this email.', correct: true, feedback: 'A path you already trusted does not depend on the message being honest.' },
      { id: 'look', text: 'Open the link and continue if the page looks professional.', correct: false, feedback: 'A professional page can still be operated by the sender of the mail.' },
    ],
  },
  {
    id: 'recovery',
    principle: 'After a password is typed, change it from a safe device and report on a known channel.',
    prompt: 'You clicked the link and typed your work password before you noticed the domain. What should you do first?',
    choices: [
      { id: 'quiet', text: 'Change nothing, in case the page was legitimate.', correct: false, feedback: 'Waiting leaves a captured password usable. A real page can be confirmed after you protect the account.' },
      { id: 'tool', text: 'Download a cleanup tool from the same email and run it.', correct: false, feedback: 'The same sender should not be trusted with a second install.' },
      { id: 'report', text: 'From a device that did not open the link, change the password, stop reusing it, and tell your security contact on a channel you already had.', correct: true, feedback: 'Recovery uses your own paths: a clean device, a new secret, and the team your organisation already named.' },
      { id: 'share', text: 'Forward the link so colleagues can test whether it is safe.', correct: false, feedback: 'A test that asks other people to open the link repeats the mistake.' },
    ],
  },
];

export function xpForCorrect(correct: number) {
  return Math.round((correct / CHECKPOINTS.length) * EMAIL_PHISHING_COURSE.maxXp);
}
