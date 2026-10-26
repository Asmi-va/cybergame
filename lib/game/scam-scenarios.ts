export type ScenarioCategory =
  | 'upi'
  | 'qr'
  | 'school_fee'
  | 'scholarship'
  | 'whatsapp'
  | 'gaming'
  | 'delivery'
  | 'portal'
  | 'location'
  | 'impersonation';

export type ActionType = 'proceed' | 'verify' | 'report' | 'reject';

export type EvidencePoint = {
  label: string;
  detail: string;
  type: 'suspicious' | 'safe' | 'warning';
};

export type ScamScenario = {
  id: string;
  category: ScenarioCategory;
  categoryLabel: string;
  title: string;
  sender: string;
  senderDetail: string;
  channel: 'SMS' | 'WhatsApp' | 'Email' | 'Poster' | 'App' | 'Web';
  previewBadge?: string;
  content: string;
  contextNote: string;
  simulatedArtifact?: {
    type: 'payment_req' | 'qr_code' | 'login_box' | 'delivery_card' | 'chat_bubble';
    header: string;
    amount?: string;
    senderUpi?: string;
    url?: string;
    qrDescription?: string;
  };
  evidenceList: EvidencePoint[];
  independentVerificationHint: string;
  correctAction: ActionType;
  explanation: string;
  keyTakeaway: string;
};

export const SCAM_SCENARIOS: ScamScenario[] = [
  {
    id: 'scen-01',
    category: 'upi',
    categoryLabel: 'UPI Payment Request',
    title: 'The "Cashback Reward" Payment Request',
    sender: 'PhonePe Rewards Desk (Claim ID: 9481)',
    senderDetail: 'via UPI Collect · collect-desk@vpa.bank.example',
    channel: 'App',
    previewBadge: 'Collect Request: ₹500',
    content: 'Congratulations! You have received ₹500 cashback for shopping during Diwali. To deposit this amount to your bank account, please accept the request and enter your UPI PIN.',
    contextNote: 'You received a notification on your phone asking you to authorize a transaction of ₹500.',
    simulatedArtifact: {
      type: 'payment_req',
      header: 'UPI Collect Request Pending',
      amount: '₹500.00',
      senderUpi: 'cashback-claim-9481@fakeyesbank.example',
    },
    evidenceList: [
      {
        label: 'Collect Request vs Credit',
        detail: 'This is a "Collect Request" (debit), which pulls money OUT of your account. Receiving rewards is credited automatically without requesting authorization.',
        type: 'suspicious',
      },
      {
        label: 'UPI PIN Mechanic',
        detail: 'UPI PIN is ONLY entered to deduct money from your account. You NEVER enter your PIN to receive money, cashbacks, or refunds.',
        type: 'suspicious',
      },
      {
        label: 'Unsolicited Reward',
        detail: 'You never entered a contest requiring a ₹500 claim procedure.',
        type: 'warning',
      },
    ],
    independentVerificationHint: 'Open the official bank or payments app history directly without tapping the notification prompt.',
    correctAction: 'reject',
    explanation: 'Scammers frequently send "Collect Requests" titled "Cashback" or "Refund". When a victim enters their PIN, the money is instantly debited from their account!',
    keyTakeaway: 'Rule of Gold: Entering a UPI PIN always sends money away. Receiving money requires zero PINs.',
  },
  {
    id: 'scen-02',
    category: 'qr',
    categoryLabel: 'Public QR Code',
    title: 'Pasted QR Code at Bus Stop Book Stall',
    sender: 'Sticker pasted over vendor’s counter board',
    senderDetail: 'Physical sticker: "Pay Here for 20% Discount"',
    channel: 'Poster',
    previewBadge: 'QR Sticker Overlay',
    content: 'Pay using any UPI app to get 20% flat discount on school notebooks and geometry sets. Scan below to pay Merchant: `quick-pay-deals@ybl.example`.',
    contextNote: 'You notice the shiny QR sticker is peeling at the corner and was stuck on top of the shop’s original weathered laminated QR code.',
    simulatedArtifact: {
      type: 'qr_code',
      header: 'Street Vendor Counter QR',
      qrDescription: 'Sticker overlay visible on top of original shop acrylic board.',
      url: 'upi://pay?pa=quick-pay-deals@ybl.example&pn=DiscountMerchant',
    },
    evidenceList: [
      {
        label: 'Physical Tampering',
        detail: 'A fresh sticker has been visibly placed over the shopkeeper’s authentic QR code board.',
        type: 'suspicious',
      },
      {
        label: 'Mismatched Merchant Name',
        detail: 'The QR name shows "DiscountMerchant" instead of the shop’s actual registered name "Gupta Book Depot".',
        type: 'suspicious',
      },
      {
        label: 'Unusually high discount',
        detail: 'Street stationery vendors rarely offer 20% instant flat discount without any poster announcement.',
        type: 'warning',
      },
    ],
    independentVerificationHint: 'Always verbally ask the shopkeeper: "Uncle, is this sticker your QR code, or is your name Gupta Book Depot?"',
    correctAction: 'verify',
    explanation: 'QR code tampering (QR swapping) is common in public markets. Fraudsters paste their own stickers over real merchant QRs to hijack payments.',
    keyTakeaway: 'Always verify the payee name on your payment screen with the merchant in person before confirming.',
  },
  {
    id: 'scen-03',
    category: 'school_fee',
    categoryLabel: 'School Fee Reminder',
    title: 'Quarter 3 Tuition Fee Reminder',
    sender: 'Accounts Dept · accounts@navrang.example',
    senderDetail: 'Verified official school domain · SMS sender ID: NVRSCH',
    channel: 'SMS',
    previewBadge: 'Official School Notice',
    content: 'Dear Parent/Guardian, Quarter 3 tuition fee for Navrang Public School is due by 10th November. You may pay online via the verified parent portal or at the school fee counter on campus.',
    contextNote: 'This SMS arrived from the standard school sender ID that provides your attendance notices every morning.',
    simulatedArtifact: {
      type: 'chat_bubble',
      header: 'SMS from NVRSCH',
      url: 'https://portal.navrang.example/fees',
    },
    evidenceList: [
      {
        label: 'Official Sender Identity',
        detail: 'The email domain is @navrang.example and SMS header NVRSCH matches regular school circulars.',
        type: 'safe',
      },
      {
        label: 'Legitimate Payment Options',
        detail: 'Offers both physical payment at the school accounts desk and standard portal login; does not demand emergency direct bank transfers.',
        type: 'safe',
      },
      {
        label: 'Calm and standard timeline',
        detail: 'Normal advance notice given (due by 10th November), without threats of immediate expulsion or emergency 1-hour deadlines.',
        type: 'safe',
      },
    ],
    independentVerificationHint: 'Parents can check fee slips from previous quarters or call the school reception landline.',
    correctAction: 'proceed',
    explanation: 'This communication is completely authentic. It comes from the official school domain, matches scheduled fee cycles, and does not demand unusual private actions.',
    keyTakeaway: 'Legitimate institutions provide calm deadlines, standard official web domains, and physical offline options.',
  },
  {
    id: 'scen-04',
    category: 'scholarship',
    categoryLabel: 'Scholarship Announcement',
    title: 'National Talent Scheme WhatsApp Forward',
    sender: 'Forwarded many times · +91 98210-XXXXX',
    senderDetail: 'Unknown mobile number with flag icon',
    channel: 'WhatsApp',
    previewBadge: 'Forwarded many times',
    content: '🚨 BREAKING: Central Govt announces ₹25,000 direct scholarship for all Class 4–10 students! Apply before midnight with Aadhaar card and parent bank account details at: `pmscheme-free-funds.site`. Forward to 5 groups to activate!',
    contextNote: 'A group message sent to your class WhatsApp chat by an unknown participant.',
    simulatedArtifact: {
      type: 'chat_bubble',
      header: 'WhatsApp Message (Forwarded many times)',
      url: 'http://pmscheme-free-funds.site/apply-now',
    },
    evidenceList: [
      {
        label: 'Forwarded Chain Letter Trick',
        detail: 'The instruction "Forward to 5 groups to activate" is a classic viral hoax trick to propagate spam.',
        type: 'suspicious',
      },
      {
        label: 'Fake Domain Extension',
        detail: 'Official Government of India portals always end in `.gov.in` or `.nic.in`, NEVER `.site` or `.free-funds.com`.',
        type: 'suspicious',
      },
      {
        label: 'Harvesting Sensitive ID',
        detail: 'Demands Aadhaar numbers and bank credentials with an artificial midnight countdown.',
        type: 'suspicious',
      },
    ],
    independentVerificationHint: 'Check the official Ministry of Education portal at education.gov.in or ask your class teacher.',
    correctAction: 'report',
    explanation: 'Scammers create fake government scholarship schemes to harvest Aadhaar cards, phone numbers, and bank account information from young students and families.',
    keyTakeaway: 'All Indian government education schemes are published on official `.gov.in` websites, never forwarded on informal WhatsApp links.',
  },
  {
    id: 'scen-05',
    category: 'gaming',
    categoryLabel: 'Gaming Rewards',
    title: 'Free 1,000 Diamonds & Mythic Skin Generator',
    sender: 'RoboQuest Skins Bot · gamer-loot-drop@free-diamonds.xyz',
    senderDetail: 'In-game chat whisper from Level 1 account',
    channel: 'Web',
    previewBadge: 'Free Gaming Gift',
    content: 'You won the Ultra Mythic Cyber Armor and 1,000 diamonds! To transfer them into your game profile, sign in with your game account email and password, then temporarily disable 2-Factor Authentication.',
    contextNote: 'A direct message received while playing a multiplayer mobile game.',
    simulatedArtifact: {
      type: 'login_box',
      header: 'RoboQuest Loot Distributor Portal',
      url: 'http://free-diamonds.xyz/roboquest/claim?user=detective',
    },
    evidenceList: [
      {
        label: 'Asking for Password & Credentials',
        detail: 'Legitimate game developers and publishers NEVER ask for your game account password to grant items.',
        type: 'suspicious',
      },
      {
        label: 'Request to Disable 2FA',
        detail: 'Asking to disable 2-Factor Authentication is an immediate giveaway of an account takeover attempt.',
        type: 'suspicious',
      },
      {
        label: 'Unofficial Website',
        detail: 'The URL uses `.xyz` domain rather than the game’s official publisher website.',
        type: 'suspicious',
      },
    ],
    independentVerificationHint: 'Check the official in-game inbox or news tab. Genuine event gifts appear in your mailbox automatically.',
    correctAction: 'reject',
    explanation: 'This is a phishing scam targeting children to steal gaming accounts, rare skins, and connected parental credit cards.',
    keyTakeaway: 'Never reveal your gaming passwords or turn off two-factor security for promised items.',
  },
  {
    id: 'scen-06',
    category: 'delivery',
    categoryLabel: 'Delivery Notification',
    title: 'India Post Address Incomplete Notification',
    sender: 'IndiaPost Express · dispatch-notice@speed-post-track.click',
    senderDetail: 'SMS with suspicious link · Sent from 10-digit number',
    channel: 'SMS',
    previewBadge: 'Package Delivery Issue',
    content: 'IndiaPost: Your speed post parcel cannot be delivered due to missing house number. Please update your address and pay ₹5 re-delivery fee within 12 hours or package will be returned.',
    contextNote: 'Neither you nor your family ordered anything recently that is expected via Speed Post.',
    simulatedArtifact: {
      type: 'delivery_card',
      header: 'Package Pending Verification',
      amount: '₹5.00 Re-delivery Fee',
      url: 'http://speed-post-track.click/address-update',
    },
    evidenceList: [
      {
        label: 'Phishing for Banking Details via Small Fee',
        detail: 'The tiny "₹5 fee" is a trick to get victims to enter their full credit/debit card numbers and CVV onto a fake payment gateway.',
        type: 'suspicious',
      },
      {
        label: 'Fake Domain',
        detail: 'India Post uses `indiapost.gov.in`. They never send links ending in `.click` or `.top`.',
        type: 'suspicious',
      },
      {
        label: 'Generic Package Notification',
        detail: 'No tracking consignment number (e.g. `ED123456789IN`) is provided.',
        type: 'warning',
      },
    ],
    independentVerificationHint: 'Track packages exclusively on indiapost.gov.in using a valid consignment number received at the time of booking.',
    correctAction: 'report',
    explanation: 'This is one of the most widespread delivery scams in India (smishing). The fake ₹5 charge is used to steal entire bank cards.',
    keyTakeaway: 'Postal services do not withhold packages over ₹5 web links. Never enter bank card details on SMS links.',
  },
  {
    id: 'scen-07',
    category: 'portal',
    categoryLabel: 'School Portal Sign-In',
    title: 'School Library Book Reservation Confirmation',
    sender: 'Navrang Library Desk · library@navrang.example',
    senderDetail: 'From verified librarian email · Signed by Mrs. Kapoor',
    channel: 'Email',
    previewBadge: 'Book Hold Notice',
    content: 'Dear Student: The science encyclopedia you requested ("Our Marvelous Universe") is now on hold at the circulation desk. You can review your loan history on the library portal before Friday.',
    contextNote: 'You did indeed ask the librarian for this encyclopedia during yesterday’s library period.',
    simulatedArtifact: {
      type: 'chat_bubble',
      header: 'Library System Notification',
      url: 'https://portal.navrang.example/library/loans',
    },
    evidenceList: [
      {
        label: 'Matches Prior Real-World Action',
        detail: 'Directly corresponds to a book you physically requested from Mrs. Kapoor yesterday.',
        type: 'safe',
      },
      {
        label: 'Authentic School URL',
        detail: 'Links directly to the established `portal.navrang.example` portal.',
        type: 'safe',
      },
      {
        label: 'Zero Pressure or Demands',
        detail: 'No fee requested, no password resets demanded, no panic deadlines.',
        type: 'safe',
      },
    ],
    independentVerificationHint: 'You can walk straight to the library desk and collect your book from Mrs. Kapoor.',
    correctAction: 'proceed',
    explanation: 'This is a genuine, routine school notification. It mirrors your real-life request and directs you to the established internal school portal.',
    keyTakeaway: 'When digital messages match known offline interactions and use verified school channels, they are safe to trust.',
  },
  {
    id: 'scen-08',
    category: 'location',
    categoryLabel: 'Location & Personal Information',
    title: 'Festival Photo Contest "Location Permission" App',
    sender: 'Pop-Up on Free Games Webpage · ads@fest-camera-fun.online',
    senderDetail: 'Third-party banner advertisement',
    channel: 'Web',
    previewBadge: 'Permission Request',
    content: 'To see your festival photo rank, allow "TechFestSnap" to access your real-time GPS location, contact list, microphone, and photo album 24/7.',
    contextNote: 'You clicked a banner ad while reading science quiz notes online.',
    simulatedArtifact: {
      type: 'chat_bubble',
      header: 'Browser Permission Dialog',
      url: 'fest-camera-fun.online/snap',
    },
    evidenceList: [
      {
        label: 'Excessive Privacy Permissions',
        detail: 'A basic photo viewer has no legitimate need for background 24/7 GPS tracking, contact lists, or microphone access.',
        type: 'suspicious',
      },
      {
        label: 'Unrelated Third-Party Ad',
        detail: 'Originates from an unverified advertisement rather than an authorized school activity.',
        type: 'warning',
      },
      {
        label: 'Data Harvesting Risk',
        detail: 'Granting contact and location permissions exposes family members and home locations.',
        type: 'suspicious',
      },
    ],
    independentVerificationHint: 'Ask a parent or teacher before approving browser permission prompts for camera or location.',
    correctAction: 'reject',
    explanation: 'Many shady apps and ad networks demand excessive permissions to track children and harvest contacts for telemarketing or scams.',
    keyTakeaway: 'Always question why an app needs your location, contacts, or microphone. Say no to unnecessary access.',
  },
  {
    id: 'scen-09',
    category: 'impersonation',
    categoryLabel: 'Impersonation of Relatives / Staff',
    title: 'Urgent WhatsApp from "Mama ji" (Uncle)',
    sender: 'Unknown Number (+91 99341-XXXXX)',
    senderDetail: 'Profile photo shows a downloaded family picture',
    channel: 'WhatsApp',
    previewBadge: 'Emergency Contact Claim',
    content: 'Beta, this is your Rajesh Mama. My phone fell into water so I am using my friend’s number. I am stuck at Lucknow airport and need ₹2,000 urgently for taxi fare. Please send to this UPI ID right now: `travel-help-urgent@upi.example`. Don’t tell your mother yet, I will repay this evening!',
    contextNote: 'Your mother is cooking in the kitchen right next to you.',
    simulatedArtifact: {
      type: 'payment_req',
      header: 'Emergency UPI Transfer Request',
      amount: '₹2,000.00',
      senderUpi: 'travel-help-urgent@upi.example',
    },
    evidenceList: [
      {
        label: 'Secrecy Request ("Don\'t tell your mother")',
        detail: 'Scammers frequently instruct children to keep secrets from parents to avoid being caught.',
        type: 'suspicious',
      },
      {
        label: 'Unknown Phone Number',
        detail: 'Claiming a lost or damaged phone is the standard script for family impersonation frauds.',
        type: 'suspicious',
      },
      {
        label: 'High-Urgency Money Request',
        detail: 'Demanding immediate money transfer via an anonymous UPI ID.',
        type: 'suspicious',
      },
    ],
    independentVerificationHint: 'Immediately walk to your mother in the kitchen and say: "Mama ji just texted from a strange number asking for ₹2,000. Can you call his real number?"',
    correctAction: 'verify',
    explanation: 'Family emergency impersonation exploits love and fear. Scammers steal profile photos from social media and pose as relatives in distress.',
    keyTakeaway: 'Never transfer money to a relative claiming an emergency on a new number without speaking to them directly on voice or video call.',
  },
  {
    id: 'scen-10',
    category: 'portal',
    categoryLabel: 'Lookalike Login Portal',
    title: 'Mid-Day Attendance Verification Link',
    sender: 'School Notice Desk · alerts@navrangg-school.org',
    senderDetail: 'Notice double "g" in navrangg-school.org',
    channel: 'Email',
    previewBadge: 'Security Re-Authentication',
    content: 'Notice: Due to attendance database maintenance, please verify your student login credentials on our new server portal: `http://student.navrangg-school.org/login`.',
    contextNote: 'The email looks very similar to real school emails, but something in the address feels slightly off.',
    simulatedArtifact: {
      type: 'login_box',
      header: 'Navrang Public School Student Portal',
      url: 'http://student.navrangg-school.org/login',
    },
    evidenceList: [
      {
        label: 'Typosquatting Domain',
        detail: 'Look closely at the domain: "navrangg-school.org" has a double "g". The real school domain is "navrang.example".',
        type: 'suspicious',
      },
      {
        label: 'Insecure Connection',
        detail: 'The URL uses unencrypted `http://` instead of secure `https://`.',
        type: 'suspicious',
      },
      {
        label: 'Credential Harvesting Page',
        detail: 'The page is an identical visual copy of the school portal designed solely to steal student logins.',
        type: 'suspicious',
      },
    ],
    independentVerificationHint: 'Type the real school portal address directly from your browser bookmark, never from an email link.',
    correctAction: 'report',
    explanation: 'Typosquatting creates domain names with deliberate spelling errors (like an extra letter) to fool people into entering passwords on fake sites.',
    keyTakeaway: 'Carefully inspect letter-by-letter spelling in website addresses before typing your password.',
  },
];

