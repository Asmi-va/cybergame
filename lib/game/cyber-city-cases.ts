// ─────────────────────────────────────────────────────────────
//  SafeRon: Cyber City Investigations — Case Data & Framework
// ─────────────────────────────────────────────────────────────

export type Evidence = {
  id: string;
  label: string;
  detail: string;
  icon: string;
};

export type Decision = {
  id: string;
  label: string;
  outcome: 'correct' | 'partial' | 'wrong';
  consequence: string;
  lesson: string;
};

export type CaseStage =
  | 'briefing'
  | 'explore'
  | 'investigate'
  | 'phone'
  | 'evidence'
  | 'decide'
  | 'debrief';

export type GameplayType =
  | 'fake-login'
  | 'email-analysis'
  | 'otp-mfa'
  | 'qr-trap'
  | 'prize-scam'
  | 'social-overshare'
  | 'download-risk'
  | 'wifi-trap'
  | 'impersonation'
  | 'hidden-permission'
  | 'fake-support'
  | 'voice-clone'
  | 'urgent-payment'
  | 'gaming-friend'
  | 'attachment'
  | 'ransomware'
  | 'compromised-account'
  | 'insider-mistake'
  | 'deepfake'
  | 'final-investigation';

export type Case = {
  id: string;
  chapterId: string;
  caseNumber: number;
  title: string;
  subtitle: string;
  briefing: string;
  objective: string;
  location: string;
  gameplayType: GameplayType;
  environment: 'office' | 'city' | 'school' | 'home' | 'lab';
  npcName: string;
  npcRole: string;
  npcDialogue: string;
  evidenceItems: Evidence[];
  decisions: Decision[];
  teachingPoints: string[];
  xpReward: number;
  badgeId?: string;
};

export type Chapter = {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  cases: Case[];
};

export const CHAPTERS: Chapter[] = [
  {
    id: 'ch1',
    number: 1,
    title: 'The First Signal',
    subtitle: 'Learn to spot digital deception',
    icon: '📡',
    color: '#22d3ee',
    cases: [
      {
        id: 'c1-1',
        chapterId: 'ch1',
        caseNumber: 1,
        title: 'Find the Fake Login',
        subtitle: 'A suspicious sign-in request needs investigation',
        briefing: 'A colleague just received an unexpected login alert. Someone is trying to access their SafeCity account from an unknown location. Before anything is approved, you need to investigate.',
        objective: 'Examine the login page, check the URL, inspect the phone notification, and decide if this login is legitimate.',
        location: 'Cyber Investigation Office — Floor 3, SafeCity HQ',
        gameplayType: 'fake-login',
        environment: 'office',
        npcName: 'Priya Mehta',
        npcRole: 'Senior Investigator',
        npcDialogue: "Something feels off. I got a sign-in request I didn't initiate. The URL looks almost right but... can you take a closer look? Check the domain carefully and see what the phone is showing.",
        evidenceItems: [
          { id: 'e1', label: 'Suspicious Domain', detail: 'URL reads "safecity-login.net" — official portal is "safecity.gov.in"', icon: '🌐' },
          { id: 'e2', label: 'Unexpected Location', detail: 'Login attempt originates from Noida — Priya works from Mumbai', icon: '📍' },
          { id: 'e3', label: 'MFA Fatigue', detail: 'Three consecutive approval requests sent in 90 seconds', icon: '🔁' },
          { id: 'e4', label: 'Missing HTTPS Lock', detail: 'Browser shows "Not Secure" warning for this page', icon: '🔓' },
          { id: 'e5', label: 'Urgency Language', detail: 'Page says "Approve immediately or your account will be suspended"', icon: '⚠️' },
        ],
        decisions: [
          {
            id: 'd1',
            label: 'Approve the login — it might be urgent',
            outcome: 'wrong',
            consequence: 'The attacker gains full access to the SafeCity database. Thousands of citizen records are exposed. The incident takes 3 weeks to contain.',
            lesson: 'Never approve unexpected MFA requests. Attackers use urgency to prevent you from thinking carefully.',
          },
          {
            id: 'd2',
            label: 'Deny and report to the security team',
            outcome: 'correct',
            consequence: 'The attack is blocked. Security traces the IP to a known phishing group. Priya changes her password and the account is secured.',
            lesson: 'Reporting suspicious login attempts protects everyone. When in doubt, deny and report — it is always the safer choice.',
          },
          {
            id: 'd3',
            label: 'Ignore it — probably a glitch',
            outcome: 'wrong',
            consequence: 'The attacker tries again with a different method an hour later and succeeds. Ignoring security alerts is as dangerous as approving them.',
            lesson: 'Security alerts should never be ignored. Even if it turns out to be a false alarm, investigating protects you.',
          },
        ],
        teachingPoints: [
          'Always verify the full URL before entering credentials — one different letter can mean a fake site.',
          'Unexpected MFA requests you did not initiate are a sign someone has your password.',
          'Attackers send multiple MFA requests rapidly to exhaust your patience — this is called MFA fatigue.',
          'Official government portals in India end in .gov.in, not .net or .com.',
          'Approving a login from an unknown location and device is never safe.',
        ],
        xpReward: 300,
        badgeId: 'fake-login-detective',
      },
      {
        id: 'c1-2',
        chapterId: 'ch1',
        caseNumber: 2,
        title: 'The Suspicious Email',
        subtitle: 'A message that looks real — but is it?',
        briefing: 'The city mayor\'s office received an email claiming to be from the National Cyber Security Agency. It asks for immediate action on attached documents. Something does not feel right.',
        objective: 'Analyse the email headers, sender address, attachments, and links to determine if this is a spear-phishing attempt.',
        location: 'Mayor\'s Office — SafeCity Municipal Building',
        gameplayType: 'email-analysis',
        environment: 'office',
        npcName: 'Arjun Kapoor',
        npcRole: 'Mayor\'s Secretary',
        npcDialogue: "The attachment opens fine but asks us to enable macros. The sender domain looks official but I've never received emails from them before.",
        evidenceItems: [
          { id: 'e1', label: 'Spoofed Sender', detail: 'From: ncsa-alerts@ncsa-gov.in.mail.com — not the real ncsa.gov.in', icon: '📧' },
          { id: 'e2', label: 'Macro Request', detail: 'Document asks to "Enable Content" to view — classic malware delivery', icon: '📄' },
          { id: 'e3', label: 'Urgency Pressure', detail: '"Respond within 2 hours or face legal consequences" — designed to panic', icon: '⏰' },
          { id: 'e4', label: 'Generic Greeting', detail: 'Email says "Dear Sir/Madam" — real agencies know your name', icon: '👤' },
          { id: 'e5', label: 'Suspicious Link', detail: 'Link goes to "ncsa-portal.xyz/verify" — .xyz is not a government domain', icon: '🔗' },
        ],
        decisions: [
          { id: 'd1', label: 'Enable macros and read the document', outcome: 'wrong', consequence: 'Malware installs itself and begins exfiltrating city documents overnight.', lesson: 'Never enable macros in unsolicited documents. Macros can run harmful code silently.' },
          { id: 'd2', label: 'Delete it and report to IT security', outcome: 'correct', consequence: 'IT traces the campaign to a criminal group targeting municipal offices across India.', lesson: 'Report phishing emails rather than just deleting them — your report helps protect others.' },
          { id: 'd3', label: 'Forward to colleagues to warn them', outcome: 'partial', consequence: 'Warning is good intent but forwarding spreads the malicious link. Use official reporting channels instead.', lesson: 'Never forward suspicious emails. Report them through your security team\'s official process.' },
        ],
        teachingPoints: [
          'Check the full email address, not just the display name — these are different.',
          'Government agencies never ask you to enable macros in documents.',
          'Urgency and threats in emails are manipulation tactics.',
          'Real government portals in India use .gov.in domains exclusively.',
        ],
        xpReward: 250,
      },
      {
        id: 'c1-3',
        chapterId: 'ch1',
        caseNumber: 3,
        title: 'The Unexpected OTP',
        subtitle: 'A one-time password arrives — but you didn\'t request it',
        briefing: 'A city employee received three OTPs in quick succession for a service they have not used in months. Then a caller claims to be from the bank asking for the OTP to "verify their account".',
        objective: 'Identify the social engineering attempt and advise the correct response.',
        location: 'SafeCity Finance Department',
        gameplayType: 'otp-mfa',
        environment: 'office',
        npcName: 'Sunita Rao',
        npcRole: 'Finance Officer',
        npcDialogue: "The caller sounds very professional and knows my name and department. They said there is an urgent problem with my account and need the OTP to fix it immediately.",
        evidenceItems: [
          { id: 'e1', label: 'Unsolicited OTPs', detail: 'Three OTPs received without any login attempt from Sunita\'s device', icon: '📱' },
          { id: 'e2', label: 'Caller Knowledge', detail: 'Attacker researched victim\'s name and department from public sources', icon: '🕵️' },
          { id: 'e3', label: 'OTP Request', detail: 'No legitimate service ever calls asking for your OTP — this is the rule', icon: '🚫' },
          { id: 'e4', label: 'Time Pressure', detail: '"You have 2 minutes or your account will be blocked permanently"', icon: '⏱️' },
        ],
        decisions: [
          { id: 'd1', label: 'Share the OTP to fix the account', outcome: 'wrong', consequence: 'Account is immediately emptied. The caller was an attacker who already had credentials.', lesson: 'OTPs are single-use authentication tokens. Sharing them gives attackers complete access.' },
          { id: 'd2', label: 'Hang up and call the bank\'s official number', outcome: 'correct', consequence: 'The real bank confirms no such call was made. The incident is reported and account secured.', lesson: 'Always verify by calling back on official numbers you find independently, never numbers provided by the caller.' },
          { id: 'd3', label: 'Ask the caller to wait and consult a colleague', outcome: 'partial', consequence: 'Good instinct. A colleague recognises the social engineering attempt and advises hanging up.', lesson: 'Involving others is good, but the safest move is always to hang up and call the official number yourself.' },
        ],
        teachingPoints: [
          'No legitimate bank, app, or service ever asks for your OTP over the phone.',
          'Receiving unexpected OTPs means someone already has your password — change it immediately.',
          'Social engineers research targets in advance to appear credible.',
          'Time pressure is the primary tool of phone fraud — slow down, hang up, verify independently.',
        ],
        xpReward: 250,
      },
      {
        id: 'c1-4',
        chapterId: 'ch1',
        caseNumber: 4,
        title: 'The QR Code Trap',
        subtitle: 'A sticker in the lobby leads somewhere unexpected',
        briefing: 'A new QR code appeared on the SafeCity building lobby desk overnight. Staff have been scanning it thinking it is the visitor check-in code. Where does it actually go?',
        objective: 'Examine the QR code, analyse the destination URL, and determine if it is the legitimate check-in system.',
        location: 'SafeCity HQ Main Lobby',
        gameplayType: 'qr-trap',
        environment: 'office',
        npcName: 'Vikram Singh',
        npcRole: 'Receptionist',
        npcDialogue: "I thought the IT team replaced our old QR poster. It looks official. But some visitors are saying the site asks for their Aadhaar number which seems unusual for a visitor log.",
        evidenceItems: [
          { id: 'e1', label: 'Pasted Sticker', detail: 'Original QR poster is still behind the reception desk — the new one is a sticker placed on top', icon: '🖨️' },
          { id: 'e2', label: 'Unknown Domain', detail: 'QR leads to "safecity-visitor.in" — official system uses "visitor.safecity.gov.in"', icon: '🌐' },
          { id: 'e3', label: 'Excess Data Request', detail: 'Fake site requests name, phone, Aadhaar, and home address — visitor log only needs name and phone', icon: '📋' },
          { id: 'e4', label: 'No HTTPS', detail: 'The destination site uses http:// without encryption', icon: '🔓' },
        ],
        decisions: [
          { id: 'd1', label: 'Leave it — it probably just got updated', outcome: 'wrong', consequence: 'Forty visitors submit Aadhaar numbers to an identity theft ring before the problem is found.', lesson: 'Suspicious or unexplained changes to public QR codes should always be reported immediately.' },
          { id: 'd2', label: 'Remove it, restore the original, and report to security', outcome: 'correct', consequence: 'Security identifies the perpetrator via CCTV footage of when the sticker was placed.', lesson: 'Physical security and digital security are connected. Fake QR stickers are a real threat.' },
          { id: 'd3', label: 'Warn visitors verbally but leave the QR up', outcome: 'partial', consequence: 'Some visitors are protected but many still scan before being warned.', lesson: 'Warnings help but leaving a dangerous QR code in place still causes harm. Remove it immediately.' },
        ],
        teachingPoints: [
          'QR codes can be counterfeited and pasted over legitimate ones — inspect them physically.',
          'Official government systems use .gov.in domains — never unknown .in domains for sensitive data.',
          'Any QR form requesting Aadhaar, bank details or home address in a visitor log is suspicious.',
          'Report unexpected QR code changes to your building security team immediately.',
        ],
        xpReward: 250,
      },
      {
        id: 'c1-5',
        chapterId: 'ch1',
        caseNumber: 5,
        title: 'The Fake Prize',
        subtitle: 'Congratulations! You definitely did not win anything.',
        briefing: 'City employees received WhatsApp messages claiming they won a ₹50,000 SafeCity loyalty prize. To claim it, they must click a link and submit their bank details within 30 minutes.',
        objective: 'Analyse the prize claim message, identify the deception techniques, and advise affected employees.',
        location: 'SafeCity Staff Common Room',
        gameplayType: 'prize-scam',
        environment: 'office',
        npcName: 'Raman Verma',
        npcRole: 'IT Support',
        npcDialogue: "Three people in my department already clicked the link. One of them entered their account number and is now worried. What do we do?",
        evidenceItems: [
          { id: 'e1', label: 'No Such Programme', detail: 'SafeCity has no loyalty prize scheme — this event never existed', icon: '🏆' },
          { id: 'e2', label: 'Unknown Sender', detail: 'Message from an unsaved number claiming to be "SafeCity HR Department"', icon: '📱' },
          { id: 'e3', label: 'Extreme Urgency', detail: '"30-minute deadline" designed to prevent rational thinking', icon: '⏰' },
          { id: 'e4', label: 'Bank Detail Request', detail: 'Legitimate prizes never require bank credentials to deliver a reward', icon: '🏦' },
          { id: 'e5', label: 'Poor Grammar', detail: 'Message contains spelling errors and inconsistent formatting', icon: '✏️' },
        ],
        decisions: [
          { id: 'd1', label: 'Submit bank details quickly before the deadline', outcome: 'wrong', consequence: 'Account is drained within minutes of submitting details. Recovery takes months.', lesson: 'Legitimate prizes never require bank credentials. This is always a scam.' },
          { id: 'd2', label: 'Verify with HR directly, report to security, advise others not to click', outcome: 'correct', consequence: 'HR confirms no such scheme exists. Affected staff are guided to contact their banks immediately.', lesson: 'Verify prizes through official channels. Reporting quickly helps those who already clicked.' },
          { id: 'd3', label: 'Click the link to see what it says without entering anything', outcome: 'partial', consequence: 'The site may install tracking cookies or exploit browser vulnerabilities on click alone.', lesson: 'Even opening a malicious link can be harmful. When in doubt, do not click at all.' },
        ],
        teachingPoints: [
          'You cannot win a competition you did not enter.',
          'Legitimate organisations never send prize notifications via WhatsApp from unknown numbers.',
          'Strict deadlines in prize messages are psychological pressure tools.',
          'Never share bank account numbers, IFSC codes, or UPI PINs to "receive" money.',
          'Report prize scams to the Cyber Crime Portal: cybercrime.gov.in',
        ],
        xpReward: 250,
      },
    ],
  },
  {
    id: 'ch2',
    number: 2,
    title: 'Digital Footprints',
    subtitle: 'What you share can be used against you',
    icon: '👣',
    color: '#a78bfa',
    cases: [
      {
        id: 'c2-1', chapterId: 'ch2', caseNumber: 6, title: 'The Overshared Profile',
        subtitle: 'Too much public information is a security risk',
        briefing: 'A city official\'s social media profile contains enough information for an attacker to guess security questions, locate their home, and impersonate them.',
        objective: 'Audit the profile and identify every piece of information that creates a security risk.',
        location: 'SafeCity Social Media Monitoring Unit', gameplayType: 'social-overshare', environment: 'office',
        npcName: 'Deepa Nair', npcRole: 'Social Media Analyst',
        npcDialogue: 'She posts everything publicly — her commute route, gym timings, even her mother\'s name which is also her banking security question.',
        evidenceItems: [
          { id: 'e1', label: 'Security Question Answers', detail: 'Mother\'s maiden name, school name, and pet name all visible publicly', icon: '🔑' },
          { id: 'e2', label: 'Daily Routine', detail: 'Regular posts reveal home area, office route, and lunch habits', icon: '🗺️' },
          { id: 'e3', label: 'Phone Number', detail: 'Contact details visible to all followers including unknown accounts', icon: '📞' },
          { id: 'e4', label: 'Work Details', detail: 'Department, floor number, and manager\'s name all publicly shared', icon: '🏢' },
        ],
        decisions: [
          { id: 'd1', label: 'No action — personal social media is private business', outcome: 'wrong', consequence: 'Account is compromised using security question answers found on the profile.', lesson: 'Anything you post publicly can be used to attack you professionally and personally.' },
          { id: 'd2', label: 'Set profile to private and remove sensitive posts', outcome: 'correct', consequence: 'Profile is secured. A digital safety audit finds and removes all high-risk information.', lesson: 'Review your privacy settings and audit past posts regularly.' },
          { id: 'd3', label: 'Only remove the phone number', outcome: 'partial', consequence: 'Phone number removal is good but security question answers remain exploitable.', lesson: 'A full digital audit is needed — partial fixes leave dangerous gaps.' },
        ],
        teachingPoints: ['Security question answers should never appear publicly online.', 'Sharing daily routines helps criminals plan physical and digital attacks.', 'Review and tighten social media privacy settings regularly.'],
        xpReward: 200,
      },
      {
        id: 'c2-2', chapterId: 'ch2', caseNumber: 7, title: 'The Unknown Download',
        subtitle: 'Free software always has a price',
        briefing: 'A staff member downloaded a "free VPN" from an unofficial website. Network monitoring now shows unusual outbound traffic from their workstation.',
        objective: 'Analyse the downloaded application, identify what it is actually doing, and advise on remediation.',
        location: 'SafeCity Network Operations Centre', gameplayType: 'download-risk', environment: 'lab',
        npcName: 'Kiran Joshi', npcRole: 'Network Administrator',
        npcDialogue: 'The traffic pattern looks like keystrokes being transmitted to an external server every 30 seconds. The VPN app requested admin rights on install.',
        evidenceItems: [
          { id: 'e1', label: 'Unofficial Source', detail: 'Downloaded from "free-vpn-pro.site" not from an official app store', icon: '🌐' },
          { id: 'e2', label: 'Excessive Permissions', detail: 'App requested access to microphone, camera, and all files', icon: '🎙️' },
          { id: 'e3', label: 'Outbound Traffic', detail: 'Regular encrypted packets to unrecognised server in unknown jurisdiction', icon: '📡' },
          { id: 'e4', label: 'No Verified Publisher', detail: 'Application has no digital signature or verified developer identity', icon: '✍️' },
        ],
        decisions: [
          { id: 'd1', label: 'Continue using it — the VPN works fine', outcome: 'wrong', consequence: 'Months of keystrokes including passwords have been transmitted to attackers.', lesson: 'Functioning software can still be malicious. Always verify the source and permissions.' },
          { id: 'd2', label: 'Isolate the device, remove the app, change all passwords', outcome: 'correct', consequence: 'Malware is identified as a commercial keylogger. Passwords changed before any breach occurs.', lesson: 'When malware is detected, isolate first — disconnect from the network immediately.' },
          { id: 'd3', label: 'Just uninstall the VPN app', outcome: 'partial', consequence: 'App removed but malware may have dropped secondary persistence mechanisms.', lesson: 'Uninstalling is not enough. A full device scan and password reset are required after any malware incident.' },
        ],
        teachingPoints: ['Only download software from verified, official sources.', 'Check app permissions before installing — VPNs do not need microphone access.', 'Free software supported by ads may sell your data as its real business model.'],
        xpReward: 200,
      },
      {
        id: 'c2-3', chapterId: 'ch2', caseNumber: 8, title: 'The Public Wi-Fi Trap',
        subtitle: 'Not every network is what it claims to be',
        briefing: 'An investigator connected to "SafeCity_Free_WiFi" at a café and then accessed the case management system. A man-in-the-middle attack may have intercepted the session.',
        objective: 'Determine what data was exposed and advise on secure public Wi-Fi practices.',
        location: 'SafeCity Canteen and Field Operations', gameplayType: 'wifi-trap', environment: 'city',
        npcName: 'Anita Sharma', npcRole: 'Field Investigator',
        npcDialogue: 'I only logged in for 10 minutes to update a case report. The network name matched what the café had on their menu board — or so I thought.',
        evidenceItems: [
          { id: 'e1', label: 'Evil Twin Network', detail: 'Café\'s real network is "SafeCity_Café" — attacker created a duplicate named "SafeCity_Free_WiFi"', icon: '📶' },
          { id: 'e2', label: 'No VPN', detail: 'Device was not connected to the corporate VPN during the session', icon: '🔒' },
          { id: 'e3', label: 'HTTP Session', detail: 'Case management login used HTTP on this particular page', icon: '🌐' },
          { id: 'e4', label: 'Session Token Exposed', detail: 'Unencrypted session cookie captured — attacker may reuse it', icon: '🍪' },
        ],
        decisions: [
          { id: 'd1', label: 'Nothing to worry about — the site had a padlock', outcome: 'wrong', consequence: 'Attacker uses captured session token to access the case system without needing a password.', lesson: 'HTTPS does not protect you on a rogue network if the attacker intercepts before encryption.' },
          { id: 'd2', label: 'Immediately log out all sessions, change password, report to IT', outcome: 'correct', consequence: 'Session tokens are invalidated. No data is accessed. New policy requires VPN for all remote work.', lesson: 'If you suspect session hijacking, invalidate all active sessions immediately.' },
          { id: 'd3', label: 'Just disconnect from the Wi-Fi', outcome: 'partial', consequence: 'Good instinct but the session token already captured remains valid until the password is changed.', lesson: 'Disconnecting is the right first step but changing passwords invalidates existing captured tokens.' },
        ],
        teachingPoints: ['Verify Wi-Fi network names carefully — attackers create networks with nearly identical names.', 'Never access work systems on public Wi-Fi without a corporate VPN.', 'Assume anything transmitted on public Wi-Fi can be intercepted.'],
        xpReward: 200,
      },
      {
        id: 'c2-4', chapterId: 'ch2', caseNumber: 9, title: 'The Impersonation Account',
        subtitle: 'Someone is pretending to be the SafeCity director online',
        briefing: 'A fake social media account using the director\'s name and photo is contacting city officials asking for sensitive documents "urgently".',
        objective: 'Identify the impersonation and advise officials who received requests from the fake account.',
        location: 'SafeCity Digital Intelligence Unit', gameplayType: 'impersonation', environment: 'office',
        npcName: 'Director Mehrotra', npcRole: 'SafeCity Director',
        npcDialogue: 'I have never sent any such messages. This account was created yesterday and already has forty followers. Two of my staff have already responded to it.',
        evidenceItems: [
          { id: 'e1', label: 'New Account', detail: 'Account created 22 hours ago — real Director account has 4-year history', icon: '📅' },
          { id: 'e2', label: 'Slight Name Variation', detail: 'Fake: "Director_Mehrotra_IAS" — Real: "MehrotraDirectorIAS" — subtle difference', icon: '👤' },
          { id: 'e3', label: 'Document Request', detail: 'Asking for budget spreadsheets "before tomorrow\'s meeting" — no such meeting exists', icon: '📁' },
          { id: 'e4', label: 'No Verification Badge', detail: 'Official government accounts have platform verification — this account does not', icon: '✅' },
        ],
        decisions: [
          { id: 'd1', label: 'Send the requested documents — seems like the Director needs them', outcome: 'wrong', consequence: 'Sensitive budget data is in criminal hands and appears in a competitor\'s press release.', lesson: 'Always verify urgent requests through a secondary channel — call the person directly.' },
          { id: 'd2', label: 'Verify with Director\'s real account, report fake account to platform', outcome: 'correct', consequence: 'Platform removes the fake account within hours. Staff are briefed on impersonation verification.', lesson: 'Report impersonation accounts immediately. Use platforms\' official reporting mechanisms.' },
          { id: 'd3', label: 'Ask for a password before sending', outcome: 'partial', consequence: 'Smart instinct but the attacker may invent a plausible-sounding password.', lesson: 'Passwords over social media can be fabricated. Call the real person using a known number.' },
        ],
        teachingPoints: ['Verify the identity of senior officials through a known, separate channel before sharing any document.', 'Check account creation date and history before trusting any social media contact.', 'Report impersonation accounts to platforms as soon as they are discovered.'],
        xpReward: 200,
      },
      {
        id: 'c2-5', chapterId: 'ch2', caseNumber: 10, title: 'The Hidden Permission',
        subtitle: 'An app asking for much more than it needs',
        briefing: 'A popular city utility app update now requests access to contacts, camera, microphone, and location — far beyond what it needed before. Citizens are alarmed.',
        objective: 'Audit the permission requests, evaluate whether they are justified, and advise citizens.',
        location: 'SafeCity App Store Review Office', gameplayType: 'hidden-permission', environment: 'lab',
        npcName: 'Pooja Gupta', npcRole: 'App Store Reviewer',
        npcDialogue: 'The app just shows bus timings. It suddenly wants access to my microphone and all my contacts. The update description says nothing about new features.',
        evidenceItems: [
          { id: 'e1', label: 'Unnecessary Permissions', detail: 'Bus timing app needs only location — not camera, microphone, or contacts', icon: '📱' },
          { id: 'e2', label: 'Ownership Change', detail: 'App was acquired by an advertising company last month — original developer no longer involved', icon: '🏢' },
          { id: 'e3', label: 'Hidden Data Collection', detail: 'Privacy policy update allows selling contact data to third parties', icon: '📜' },
          { id: 'e4', label: 'No Feature Justification', detail: 'App changelog mentions only "bug fixes" — no explanation for new permissions', icon: '📝' },
        ],
        decisions: [
          { id: 'd1', label: 'Accept all permissions — the app is useful', outcome: 'wrong', consequence: 'Contact lists of thousands of users are harvested and sold to data brokers.', lesson: 'Each permission granted is data potentially sold or stolen. Evaluate every one carefully.' },
          { id: 'd2', label: 'Deny unnecessary permissions and find an alternative app', outcome: 'correct', consequence: 'Investigation reveals the app company was fined for illegal data harvesting in another state.', lesson: 'Unnecessary permission requests after ownership changes are major red flags.' },
          { id: 'd3', label: 'Grant only the location permission', outcome: 'partial', consequence: 'Correct instinct but the app may still function with hidden background data collection.', lesson: 'Limiting permissions is good. Also check the updated privacy policy for what the app collects automatically.' },
        ],
        teachingPoints: ['Review all permissions when an app updates — legitimate updates explain new permission needs.', 'App ownership changes can radically alter data collection practices.', 'Read privacy policy updates even when they are long.', 'Delete apps you no longer use to reduce your data exposure.'],
        xpReward: 200,
      },
    ],
  },
  {
    id: 'ch3',
    number: 3,
    title: 'Trust Under Pressure',
    subtitle: 'Advanced manipulation and social engineering',
    icon: '🎭',
    color: '#fb923c',
    cases: [
      {
        id: 'c3-1', chapterId: 'ch3', caseNumber: 11, title: 'The Fake Support Agent',
        subtitle: 'Someone claims to be from technical support',
        briefing: 'A caller claiming to be from "SafeCity Tech Support" tells an employee their computer has been hacked and demands remote access to fix it immediately.',
        objective: 'Identify the social engineering techniques being used and advise the employee.',
        location: 'SafeCity Employee Workstation', gameplayType: 'fake-support', environment: 'office',
        npcName: 'Rakesh Kumar', npcRole: 'Admin Officer',
        npcDialogue: 'He knew my employee ID and my manager\'s name. He sent a link to install a remote access tool. He says if I don\'t do it now the malware will spread to the whole network.',
        evidenceItems: [
          { id: 'e1', label: 'Social Engineering', detail: 'Employee ID and manager name gathered from public LinkedIn profile', icon: '🕵️' },
          { id: 'e2', label: 'Remote Access Demand', detail: 'Legitimate IT teams never cold-call and demand remote access', icon: '💻' },
          { id: 'e3', label: 'Urgency Tactic', detail: 'Threat of network-wide infection prevents employee from thinking carefully', icon: '🚨' },
          { id: 'e4', label: 'Unverified Caller', detail: 'Call came from a mobile number, not the official IT helpdesk extension', icon: '📞' },
        ],
        decisions: [
          { id: 'd1', label: 'Install the remote access tool to fix the issue', outcome: 'wrong', consequence: 'Attacker gains full control of the workstation and accesses shared drives.', lesson: 'Remote access tools installed on demand from unsolicited callers are always malicious.' },
          { id: 'd2', label: 'Hang up and call the real IT helpdesk number', outcome: 'correct', consequence: 'IT confirms no such call was made. Incident is logged and team is alerted.', lesson: 'Always verify support calls by hanging up and calling back on the official number you find independently.' },
          { id: 'd3', label: 'Ask for an employee badge number', outcome: 'partial', consequence: 'Attacker provides a fabricated badge number convincingly.', lesson: 'Attackers can invent plausible badge numbers. Only an independent callback to the real helpdesk number verifies identity.' },
        ],
        teachingPoints: ['Legitimate IT support never makes unsolicited calls demanding remote access.', 'Urgency and fear are the primary tools of tech support scammers.', 'Verify all support requests by calling your organisation\'s official helpdesk independently.'],
        xpReward: 300,
      },
      {
        id: 'c3-2', chapterId: 'ch3', caseNumber: 12, title: 'The Voice Clone',
        subtitle: 'It sounds like your manager — but is it?',
        briefing: 'An employee receives a voice call that sounds exactly like their manager asking them to urgently transfer funds to a new vendor account before end of business.',
        objective: 'Evaluate the voice call, identify the AI voice cloning indicators, and determine the safe course of action.',
        location: 'SafeCity Finance Department', gameplayType: 'voice-clone', environment: 'office',
        npcName: 'Lalitha Krishnan', npcRole: 'Accounts Executive',
        npcDialogue: 'The voice is perfect — same accent, same phrases my manager uses. But she normally sends everything in writing. And she is in a meeting right now according to her calendar.',
        evidenceItems: [
          { id: 'e1', label: 'Process Bypass', detail: 'All fund transfers require written authorisation — never phone-only approval', icon: '📋' },
          { id: 'e2', label: 'Calendar Mismatch', detail: 'Manager\'s calendar shows a 3-hour meeting — inconsistent with making this call', icon: '📅' },
          { id: 'e3', label: 'New Vendor Account', detail: 'Unknown payee not in the approved vendor register', icon: '🏦' },
          { id: 'e4', label: 'Unusual Urgency', detail: '"Before end of business" — real financial processes have standard lead times', icon: '⏰' },
        ],
        decisions: [
          { id: 'd1', label: 'Transfer the funds — the manager sounds genuine', outcome: 'wrong', consequence: 'Funds transferred to a mule account and immediately withdrawn. Near-unrecoverable loss.', lesson: 'AI voice cloning is now convincingly real. Always follow financial authorisation processes regardless of how real a voice sounds.' },
          { id: 'd2', label: 'Decline and verify in person or via the manager\'s known email', outcome: 'correct', consequence: 'Manager confirms she never called. Security team identifies a voice clone generated from public speech recordings.', lesson: 'Establish a code word or second-verification process with your manager for urgent financial requests.' },
          { id: 'd3', label: 'Ask the caller to send an email confirming the request', outcome: 'partial', consequence: 'Good thinking. If the email comes from the real account it adds verification — but a compromised email account makes this insufficient alone.', lesson: 'Multiple independent verification methods together are stronger than any single one.' },
        ],
        teachingPoints: ['AI voice cloning can now replicate voices from as little as 30 seconds of public audio.', 'Financial processes require written authorisation for a reason — never bypass them.', 'Establish safe word protocols with colleagues for verifying unusual urgent requests.'],
        xpReward: 300,
      },
      {
        id: 'c3-3', chapterId: 'ch3', caseNumber: 13, title: 'The Urgent Payment Message',
        subtitle: 'Your electricity will be cut in 2 hours — unless you pay now',
        briefing: 'Thousands of SafeCity residents receive SMS messages claiming their electricity will be disconnected in 2 hours unless they call a number to pay immediately.',
        objective: 'Analyse the SMS, identify the deception, and help residents respond safely.',
        location: 'SafeCity Consumer Helpline', gameplayType: 'urgent-payment', environment: 'office',
        npcName: 'Mamta Devi', npcRole: 'Resident (Caller)',
        npcDialogue: 'I paid my bill last week. Why is this happening? The SMS looks official. The man on the phone asked me to pay through a UPI number I have never seen before.',
        evidenceItems: [
          { id: 'e1', label: 'Fabricated Bill', detail: 'Official utility sends disconnection notices by registered post with 15-day notice', icon: '📬' },
          { id: 'e2', label: 'Unknown UPI ID', detail: 'Payment requested to "payment-elec2026@ybl" — not the official utility VPA', icon: '💳' },
          { id: 'e3', label: 'No Account Reference', detail: 'Legitimate SMS contains account number and consumer ID — this one does not', icon: '🔢' },
          { id: 'e4', label: 'Extreme Time Pressure', detail: '"2 hour" deadline prevents verification through official channels', icon: '⚡' },
        ],
        decisions: [
          { id: 'd1', label: 'Pay immediately to avoid disconnection', outcome: 'wrong', consequence: 'Payment goes to a criminal. Electricity is not affected because the bill was already paid.', lesson: 'Utility disconnections require legal notice periods — they never happen via SMS with a 2-hour warning.' },
          { id: 'd2', label: 'Call the official utility number from the electricity bill to verify', outcome: 'correct', consequence: 'Utility confirms account is paid and in good standing. Complaint registered about the fraud campaign.', lesson: 'Always call utility providers on official numbers printed on your actual bill — never numbers provided in SMS.' },
          { id: 'd3', label: 'Check the utility website for the official UPI ID', outcome: 'partial', consequence: 'Good step. Comparing UPI IDs reveals the fraud immediately.', lesson: 'Checking official sources before any payment is always correct practice.' },
        ],
        teachingPoints: ['Utilities give legally-mandated notice periods for disconnection — 2-hour threats are always fraud.', 'Always pay utilities through official apps or websites, never through UPI IDs received by SMS.', 'When in doubt, call the official number on your physical bill.'],
        xpReward: 300,
      },
      {
        id: 'c3-4', chapterId: 'ch3', caseNumber: 14, title: 'The Gaming Friend',
        subtitle: 'A new online friend wants to share something',
        briefing: 'A 12-year-old playing an online city-building game is befriended by another player who offers rare in-game items in exchange for sharing their parent\'s UPI PIN.',
        objective: 'Help identify the grooming and financial fraud attempt and understand how to respond safely.',
        location: 'SafeCity Child Safety Unit', gameplayType: 'gaming-friend', environment: 'office',
        npcName: 'Inspector Meera Patel', npcRole: 'Child Safety Officer',
        npcDialogue: 'The child thought this was a normal gaming friendship. The "other player" spent two weeks building trust before asking for anything. This is a textbook grooming pattern.',
        evidenceItems: [
          { id: 'e1', label: 'Extended Trust Building', detail: 'Two weeks of friendly gaming interaction before any request — deliberate grooming', icon: '🎮' },
          { id: 'e2', label: 'Financial Request', detail: 'In-game items never require real banking PINs — this is never how games work', icon: '💰' },
          { id: 'e3', label: 'Secret Keeping', detail: '"Don\'t tell your parents" — a clear warning sign in any interaction with children', icon: '🤫' },
          { id: 'e4', label: 'Unknown Identity', detail: 'Player\'s real identity cannot be verified — anyone can claim any age online', icon: '👤' },
        ],
        decisions: [
          { id: 'd1', label: 'Share the PIN — it is just a game, nothing can go wrong', outcome: 'wrong', consequence: 'UPI PIN used to make unauthorised transactions. Family suffers financial loss.', lesson: 'PINs and passwords must never be shared with anyone regardless of context or how trustworthy someone seems.' },
          { id: 'd2', label: 'Block the player, tell a parent, and report to the game platform', outcome: 'correct', consequence: 'Platform investigates and finds the account targeted multiple children. Account is permanently banned.', lesson: 'Tell a trusted adult immediately if any online contact asks for financial information or requests secrecy.' },
          { id: 'd3', label: 'Ask the player to prove their identity first', outcome: 'partial', consequence: 'Attacker provides false information convincingly. Children cannot reliably verify online identities.', lesson: 'Children should never attempt to independently verify online identities. Involve a trusted adult always.' },
        ],
        teachingPoints: ['No legitimate game ever requires real banking credentials for in-game rewards.', 'Online friendships that lead to financial requests are a form of fraud regardless of how friendly they seem.', 'The phrase "don\'t tell your parents" from an online contact is always a danger sign.', 'Tell a trusted adult immediately about any uncomfortable online interaction.'],
        xpReward: 300,
      },
      {
        id: 'c3-5', chapterId: 'ch3', caseNumber: 15, title: 'The Secret Attachment',
        subtitle: 'A document that does more than it shows',
        briefing: 'An email arrives with what appears to be a tender document for a SafeCity infrastructure project. Opening the document triggers unusual system behaviour.',
        objective: 'Investigate what the attachment does, contain the damage, and report the incident.',
        location: 'SafeCity Procurement Office', gameplayType: 'attachment', environment: 'office',
        npcName: 'Deepak Menon', npcRole: 'Procurement Manager',
        npcDialogue: 'I only previewed the first page. Then my screen flickered and now my antivirus is disabled. I haven\'t clicked anything else but I\'m worried.',
        evidenceItems: [
          { id: 'e1', label: 'Unsolicited Tender', detail: 'No active tender was open for this project category', icon: '📄' },
          { id: 'e2', label: 'Macro Execution', detail: 'Document silently ran a macro on opening despite macro settings', icon: '⚙️' },
          { id: 'e3', label: 'Antivirus Disabled', detail: 'Malware immediately disabled security software to prevent detection', icon: '🛡️' },
          { id: 'e4', label: 'Network Activity', detail: 'Workstation is now transmitting to an unrecognised server', icon: '📡' },
        ],
        decisions: [
          { id: 'd1', label: 'Restart the computer and see if that fixes it', outcome: 'wrong', consequence: 'Malware persists through restart and establishes deeper persistence mechanisms.', lesson: 'Restarting an infected computer does not remove malware. It may make things worse by running startup scripts.' },
          { id: 'd2', label: 'Disconnect from network, power off, call IT security immediately', outcome: 'correct', consequence: 'Forensic analysis finds a sophisticated intrusion tool. Isolated early, network damage is minimal.', lesson: 'Disconnect first to stop data exfiltration, then call security. Do not try to clean it yourself.' },
          { id: 'd3', label: 'Delete the attachment and the email', outcome: 'partial', consequence: 'Too late — the malware is already active. Deleting the file does not remove the malware already in memory.', lesson: 'Once malware executes, deleting its delivery mechanism does not undo the damage already done.' },
        ],
        teachingPoints: ['Never open attachments from unexpected emails even if they appear professional.', 'Disconnect infected devices from the network immediately — do not try to fix them yourself.', 'Macro-based malware can execute even before you interact with a document in some cases.'],
        xpReward: 300,
      },
    ],
  },
  {
    id: 'ch4',
    number: 4,
    title: 'Protect the City',
    subtitle: 'Major threats require coordinated response',
    icon: '🏙️',
    color: '#f87171',
    cases: [
      {
        id: 'c4-1', chapterId: 'ch4', caseNumber: 16, title: 'The Ransomware Warning',
        subtitle: 'Critical city systems are being encrypted',
        briefing: 'SafeCity\'s traffic management systems show a ransom demand. Someone entered the network through an unpatched vulnerability. The city has 72 hours to pay or lose all traffic data.',
        objective: 'Coordinate the incident response, identify the entry point, and determine whether to engage with attackers.',
        location: 'SafeCity Emergency Response Centre', gameplayType: 'ransomware', environment: 'lab',
        npcName: 'Chief Singh', npcRole: 'Incident Response Commander',
        npcDialogue: 'We have backups but they are 48 hours old. Paying the ransom funds criminals and does not guarantee decryption. We need to make a decision in the next 4 hours.',
        evidenceItems: [
          { id: 'e1', label: 'Entry Point', detail: 'Unpatched VPN server was the initial access vector — patch was available for 6 months', icon: '🔓' },
          { id: 'e2', label: 'Backup Status', detail: 'Last clean backup from 48 hours ago — 2 days of traffic data will be lost', icon: '💾' },
          { id: 'e3', label: 'Attacker Communication', detail: 'Ransom note requests cryptocurrency payment — no guarantee of decryption key', icon: '💰' },
          { id: 'e4', label: 'Scope Assessment', detail: 'Only traffic management affected — core city systems remain isolated', icon: '🗺️' },
        ],
        decisions: [
          { id: 'd1', label: 'Pay the ransom to restore systems quickly', outcome: 'wrong', consequence: 'Payment funds criminals. Decryption key never arrives. Attack group targets SafeCity again 3 months later.', lesson: 'Paying ransoms funds criminal organisations and provides no guarantee of recovery. It makes you a repeat target.' },
          { id: 'd2', label: 'Restore from backups, patch the vulnerability, report to authorities', outcome: 'correct', consequence: 'Systems restored in 18 hours. Attacker group identified and law enforcement notified internationally.', lesson: 'Regular backups and a tested incident response plan are the only reliable ransomware defences.' },
          { id: 'd3', label: 'Try to negotiate the ransom amount', outcome: 'wrong', consequence: 'Negotiations delay response while attackers delete backup files they discover.', lesson: 'Do not engage with ransomware attackers. Every minute spent negotiating is a minute not spent recovering.' },
        ],
        teachingPoints: ['Apply security patches promptly — many ransomware attacks exploit known vulnerabilities that had available patches.', 'Maintain offline backups tested regularly — these are your only guaranteed recovery mechanism.', 'Never pay ransoms. Report to CERT-In (cert-in.org.in) immediately.'],
        xpReward: 400,
      },
      {
        id: 'c4-2', chapterId: 'ch4', caseNumber: 17, title: 'The Compromised Account',
        subtitle: 'An insider account is being misused',
        briefing: 'Account activity logs show a senior administrator\'s credentials being used to access files outside their department at 3 AM from an unfamiliar device.',
        objective: 'Determine whether this is account compromise, insider threat, or legitimate access, and take appropriate action.',
        location: 'SafeCity Security Operations Centre', gameplayType: 'compromised-account', environment: 'lab',
        npcName: 'Raghav Nair', npcRole: 'SOC Analyst',
        npcDialogue: 'The administrator says they were asleep at 3 AM. Their credentials may have been phished weeks ago and used now. The accessed files include personnel salary data.',
        evidenceItems: [
          { id: 'e1', label: 'Abnormal Hours', detail: 'Access at 03:14 AM — user has no record of any after-hours access in 2 years', icon: '🕒' },
          { id: 'e2', label: 'Unknown Device', detail: 'Login from device fingerprint not registered to the user', icon: '💻' },
          { id: 'e3', label: 'Out-of-Scope Access', detail: 'HR salary files accessed — user has no operational need for this data', icon: '📁' },
          { id: 'e4', label: 'Previous Phishing Attempt', detail: 'User clicked a phishing link 3 weeks ago — reported but password was not reset', icon: '🎣' },
        ],
        decisions: [
          { id: 'd1', label: 'Send the administrator a warning email about policy', outcome: 'wrong', consequence: 'Attacker still has valid credentials and continues accessing data for another week.', lesson: 'Suspected account compromise requires immediate credential reset, not a warning email.' },
          { id: 'd2', label: 'Lock account, force password reset, investigate forensically', outcome: 'correct', consequence: 'Attacker access stopped. Forensics confirms credential theft via the phishing click 3 weeks earlier.', lesson: 'Always reset credentials after a confirmed phishing click, even if no immediate harm is visible.' },
          { id: 'd3', label: 'Monitor the account without intervention to gather more evidence', outcome: 'partial', consequence: 'Evidence is gathered but salary data for all staff is exfiltrated during the monitoring window.', lesson: 'Passive monitoring during active compromise allows ongoing data theft. Act first, investigate after.' },
        ],
        teachingPoints: ['Always reset passwords immediately after any confirmed phishing click, not weeks later.', 'Unusual access patterns — wrong time, wrong device, wrong files — are reliable indicators of compromise.', 'Least-privilege access limits the damage any compromised account can cause.'],
        xpReward: 400,
      },
      {
        id: 'c4-3', chapterId: 'ch4', caseNumber: 18, title: 'The Insider\'s Mistake',
        subtitle: 'Good intentions, catastrophic consequences',
        briefing: 'A junior employee took sensitive city planning documents home on a personal USB drive to finish work over the weekend. The USB drive was lost on public transport.',
        objective: 'Manage the data breach, assess the risk, and establish what policy failures led to this incident.',
        location: 'SafeCity Data Protection Office', gameplayType: 'insider-mistake', environment: 'office',
        npcName: 'Prashant Tiwari', npcRole: 'Junior City Planner',
        npcDialogue: 'I just wanted to finish the project on time. The files are not encrypted. They include location data for the new water treatment plant, which someone said was sensitive.',
        evidenceItems: [
          { id: 'e1', label: 'Unencrypted Data', detail: 'USB drive has no encryption — anyone who finds it can read all files', icon: '🔓' },
          { id: 'e2', label: 'Policy Violation', detail: 'City policy prohibits copying classified documents to personal storage devices', icon: '📋' },
          { id: 'e3', label: 'Critical Infrastructure', detail: 'Water treatment plant locations are classified infrastructure data', icon: '🏭' },
          { id: 'e4', label: 'No Tracking', detail: 'Personal USB has no remote wipe capability — data cannot be remotely deleted', icon: '💾' },
        ],
        decisions: [
          { id: 'd1', label: 'Hope the USB is never found and say nothing', outcome: 'wrong', consequence: 'USB found by a journalist. Infrastructure data published. Major national security review initiated.', lesson: 'Concealing a data breach makes the consequences far worse legally and practically.' },
          { id: 'd2', label: 'Report immediately, file a police report, notify the data protection officer', outcome: 'correct', consequence: 'Quick response triggers a security review of the listed locations. Risk is mitigated. Policy training is strengthened.', lesson: 'Immediate reporting of data loss, however embarrassing, is always the right action.' },
          { id: 'd3', label: 'Post a lost-and-found notice to recover the USB', outcome: 'partial', consequence: 'Well-intentioned but public notice reveals that sensitive data was lost on a USB drive.', lesson: 'Lost USB drives containing sensitive data must be reported through official security channels, not public notices.' },
        ],
        teachingPoints: ['Never copy classified or sensitive data to personal unencrypted storage devices.', 'Work systems should use approved encrypted cloud storage for remote access, not personal USB drives.', 'Report data loss immediately — delay significantly worsens regulatory and security consequences.'],
        xpReward: 400,
      },
      {
        id: 'c4-4', chapterId: 'ch4', caseNumber: 19, title: 'The Deepfake Broadcast',
        subtitle: 'The mayor never said that — or did they?',
        briefing: 'A video clip spreading rapidly on social media appears to show the SafeCity Mayor announcing the cancellation of a major public safety programme. The clip seems authentic but the Mayor denies making any such statement.',
        objective: 'Analyse the video for deepfake indicators, coordinate a public response, and advise on verification.',
        location: 'SafeCity Communications Department', gameplayType: 'deepfake', environment: 'office',
        npcName: 'Meenakshi Rao', npcRole: 'Communications Director',
        npcDialogue: 'The lip sync looks perfect and the voice is identical. But the mayor was in an all-day summit in Delhi when this was supposedly recorded. The background is also inconsistent with any known location.',
        evidenceItems: [
          { id: 'e1', label: 'Alibi Confirmed', detail: 'Mayor was verified at the Delhi summit at the exact time shown in the video timestamp', icon: '📅' },
          { id: 'e2', label: 'Lighting Inconsistency', detail: 'Shadow direction in the video is inconsistent with claimed time of day', icon: '💡' },
          { id: 'e3', label: 'Background Anomaly', detail: 'Office shown has different window position than the Mayor\'s actual office', icon: '🏢' },
          { id: 'e4', label: 'Unknown Source', detail: 'Video first appeared from a 3-day-old account with no prior posting history', icon: '📱' },
        ],
        decisions: [
          { id: 'd1', label: 'Ignore it — people will know it is fake', outcome: 'wrong', consequence: 'Video reaches 500,000 views in 6 hours. Programme is defunded following public outcry before the truth emerges.', lesson: 'Deepfakes spread faster than corrections. Fast official response is critical.' },
          { id: 'd2', label: 'Issue an immediate official statement with verified evidence of the alibi', outcome: 'correct', consequence: 'Official response with summit timestamped photos reduces spread. Platforms remove the video within hours.', lesson: 'Counter disinformation with verified facts quickly. Delay allows false narratives to solidify.' },
          { id: 'd3', label: 'Request platforms remove the video before responding publicly', outcome: 'partial', consequence: 'Platform removal takes 48 hours. Without official denial, many believe the video is authentic.', lesson: 'Platform removal and official denial must happen simultaneously, not sequentially.' },
        ],
        teachingPoints: ['Deepfake videos can convincingly replicate real people\'s faces and voices.', 'Check timestamps, lighting, backgrounds, and source accounts before sharing any alarming video.', 'Official denials with supporting evidence are more effective than requests for removal alone.'],
        xpReward: 400,
      },
      {
        id: 'c4-5', chapterId: 'ch4', caseNumber: 20, title: 'The Final Investigation',
        subtitle: 'Connect the dots across all four chapters',
        briefing: 'Every case you have investigated was connected. A coordinated attack group has been targeting SafeCity systematically. Now you have enough evidence to identify the full operation and brief the national cyber task force.',
        objective: 'Review all collected evidence across chapters, identify the common patterns, and present the final investigation briefing.',
        location: 'SafeCity National Cyber Briefing Room', gameplayType: 'final-investigation', environment: 'lab',
        npcName: 'Director General Krishnamurthy', npcRole: 'National Cyber Security Director',
        npcDialogue: 'Every case you worked this year was part of one coordinated campaign. The fake login, the QR trap, the voice clone, the ransomware — all one operation. Brief us. What did you find and what do we do about it?',
        evidenceItems: [
          { id: 'e1', label: 'Coordinated Pattern', detail: 'All attacks used the same infrastructure provider and similar social engineering scripts', icon: '🕸️' },
          { id: 'e2', label: 'Target Profile', detail: 'All targets were medium-seniority officials with budget or database access', icon: '🎯' },
          { id: 'e3', label: 'Attack Timeline', detail: 'Cases clustered around major city event announcements — attackers monitored public calendars', icon: '📅' },
          { id: 'e4', label: 'Mitigation Plan', detail: 'Patch management, security awareness training, and MFA enforcement address all identified vectors', icon: '🛡️' },
          { id: 'e5', label: 'Reporting Chain', detail: 'CERT-In, CyberDost, and local cyber cell contacts established for future incidents', icon: '📞' },
        ],
        decisions: [
          { id: 'd1', label: 'Classify the investigation and share nothing', outcome: 'wrong', consequence: 'Without shared intelligence, other cities fall victim to the same attack group within months.', lesson: 'Sharing threat intelligence across organisations and cities makes everyone safer.' },
          { id: 'd2', label: 'Brief the task force fully and share anonymised threat intelligence nationally', outcome: 'correct', consequence: 'Attack group is disrupted across multiple states. SafeCity becomes a national model for cyber resilience.', lesson: 'Cyber defence is collective. Sharing information about attacks protects the wider community.' },
          { id: 'd3', label: 'Publish the full report publicly for maximum transparency', outcome: 'partial', consequence: 'Full public disclosure includes attacker monitoring methods — this helps other attack groups evade detection.', lesson: 'Share intelligence through controlled official channels, not unfiltered public disclosure.' },
        ],
        teachingPoints: [
          'Cyber attacks on organisations are rarely isolated — look for coordinated patterns.',
          'Consistent security practices across an organisation prevent targeted attacks from succeeding.',
          'Report cyber incidents to CERT-In (cert-in.org.in) and CyberDost (cybercrime.gov.in).',
          'Security awareness is the most cost-effective cyber defence available.',
          'You have become a cyber investigator. Use your knowledge to protect those around you.',
        ],
        xpReward: 500,
        badgeId: 'cyber-guardian',
      },
    ],
  },
];

export type SaveData = {
  completedCases: string[];
  unlockedChapters: string[];
  totalXP: number;
  badges: string[];
  currentCase: string | null;
};

export const SAVE_KEY = 'saferon-cyber-city-v1';

export function loadSave(): SaveData {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) {
      const d = JSON.parse(raw);
      return {
        completedCases: Array.isArray(d.completedCases) ? d.completedCases : [],
        unlockedChapters: Array.isArray(d.unlockedChapters) ? d.unlockedChapters : ['ch1'],
        totalXP: typeof d.totalXP === 'number' ? d.totalXP : 0,
        badges: Array.isArray(d.badges) ? d.badges : [],
        currentCase: typeof d.currentCase === 'string' ? d.currentCase : null,
      };
    }
  } catch {}
  return { completedCases: [], unlockedChapters: ['ch1'], totalXP: 0, badges: [], currentCase: null };
}

export function saveSave(data: SaveData) {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(data)); } catch {}
}

export function getAllCases(): Case[] {
  return CHAPTERS.flatMap(ch => ch.cases);
}

export function getCaseById(id: string): Case | undefined {
  return getAllCases().find(c => c.id === id);
}

