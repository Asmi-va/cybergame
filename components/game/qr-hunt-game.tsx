'use client';

import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ShieldAlert,
  Search,
  Eye,
  Flag,
  XCircle,
  HelpCircle,
  QrCode,
  Smartphone,
  Sparkles,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { playCue } from '@/lib/game/audio';
import CanteenQRExperience3D from './canteen-qr-scene';

export type QRTarget = {
  id: string;
  location: string;
  foundOn: string;
  claim: string;
  fullUrl: string;
  registeredDomain: string;
  encrypted: boolean;
  tampered: boolean;
  isSafe: boolean;
  checks: [string, string, string];
  verdictReason: string;
  safetyLesson: string;
};

const QR_STATIONS: QRTarget[] = [
  {
    id: 'qr-1',
    location: 'School Canteen Counter',
    foundOn: 'Fresh sticker pasted over billing counter acrylic stand',
    claim: 'Get ₹50 free samosa coupon on Tech Fest day',
    fullUrl: 'upi://pay?pa=canteen-cashback-treat@fakeyesbank.example&pn=FestCash',
    registeredDomain: 'fakeyesbank.example',
    encrypted: true,
    tampered: true,
    isSafe: false,
    checks: [
      'Look for physical peeling or sticker stuck on top of real board',
      'Examine the payee VPA (fakeyesbank.example vs Canteen school account)',
      'Free food vouchers NEVER require opening a UPI payment link',
    ],
    verdictReason: 'A scammer pasted their own collect QR code over the canteen owner’s code to siphon festival money!',
    safetyLesson: 'Never scan a pasted QR sticker that promises free money or food without asking the vendor in person.',
  },
  {
    id: 'qr-2',
    location: 'Library Circulation Desk',
    foundOn: 'Official laminated poster signed by Mrs. Kapoor',
    claim: 'Browse Navrang digital book catalogue and audiobooks',
    fullUrl: 'https://library.navrang.example/digital-catalog',
    registeredDomain: 'navrang.example',
    encrypted: true,
    tampered: false,
    isSafe: true,
    checks: [
      'Official laminated poster with authentic school stamp',
      'Points directly to registered school domain navrang.example',
      'Requests no payments, passwords, or personal phone numbers',
    ],
    verdictReason: 'This is the genuine school digital library catalogue verified by the librarian.',
    safetyLesson: 'Safe QR codes lead to official, recognized domain names and provide resources without demanding private codes.',
  },
  {
    id: 'qr-3',
    location: 'School Bus Stop Notice Board',
    foundOn: 'Paper flyer stapled near bus route schedule',
    claim: 'Emergency Bus Route tracker app download (`.apk`)',
    fullUrl: 'http://schoolbus-live-gps.online/download/tracker.apk',
    registeredDomain: 'schoolbus-live-gps.online',
    encrypted: false,
    tampered: false,
    isSafe: false,
    checks: [
      'Unencrypted http:// web address',
      'Direct download of an executable .apk software package',
      'Not mentioned on the school portal or transport circular',
    ],
    verdictReason: 'Scanning this code attempts to install unauthorized malicious spyware onto your phone.',
    safetyLesson: 'Never scan QR codes that directly initiate an app or `.apk` download.',
  },
  {
    id: 'qr-4',
    location: 'Tech Fest Project Display Hall',
    foundOn: 'Exhibition project display stand (Class 8 Robotics)',
    claim: 'View the Class 8 student solar-powered robot demo video',
    fullUrl: 'https://portal.navrang.example/tech-utsav-2026/robotics-demo',
    registeredDomain: 'navrang.example',
    encrypted: true,
    tampered: false,
    isSafe: true,
    checks: [
      'Matches the students’ physical project board right in front of you',
      'Uses official school fest portal domain',
      'Safe streaming link with no permissions requested',
    ],
    verdictReason: 'This is the students’ genuine science exhibition demonstration link.',
    safetyLesson: 'Codes matching genuine local classroom displays and school domains are safe to explore.',
  },
  {
    id: 'qr-5',
    location: 'Main Gate Drinking Water Cooler',
    foundOn: 'Printed yellow sticker near the tap',
    claim: 'Govt Free Tablet Scheme 2026 for Class 4–10',
    fullUrl: 'https://free-tablet-scheme-claim.site/apply?token=8923',
    registeredDomain: 'free-tablet-scheme-claim.site',
    encrypted: true,
    tampered: false,
    isSafe: false,
    checks: [
      'Suspicious `.site` domain (official govt portals always end in `.gov.in`)',
      'Pasted anonymously on a drinking water cooler',
      'Demands Aadhaar card upload and parent phone OTP',
    ],
    verdictReason: 'Phishing trap harvesting Aadhaar numbers and bank credentials from children.',
    safetyLesson: 'Government welfare schemes are never announced via random stickers on school water coolers.',
  },
];

export default function QrHuntGame({ onBack }: { onBack: () => void }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [inspectedChecks, setInspectedChecks] = useState<number[]>([]);
  const [decision, setDecision] = useState<'open' | 'ignore' | 'report' | null>(null);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'success' | 'mistake' | null>(null);

  // 3D Walk-and-Scan sequence state
  const [hasReachedCanteen, setHasReachedCanteen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const target = QR_STATIONS[currentIdx];

  const handleInspect = (idx: number) => {
    if (!inspectedChecks.includes(idx)) {
      setInspectedChecks([...inspectedChecks, idx]);
      playCue('clue', true);
    }
  };

  const startScanSequence = () => {
    setIsScanning(true);
    playCue('tap', true);
    setTimeout(() => {
      setIsScanning(false);
      playCue('success', true);
    }, 1200);
  };

  const handleDecision = (choice: 'open' | 'ignore' | 'report') => {
    setDecision(choice);

    let isCorrect = false;
    if (target.isSafe && choice === 'open') isCorrect = true;
    if (!target.isSafe && (choice === 'report' || choice === 'ignore')) isCorrect = true;

    if (isCorrect) {
      setFeedback('success');
      setScore((s) => s + 100);
      playCue('success', true);
    } else {
      setFeedback('mistake');
      playCue('tap', true);
    }
  };

  const handleNext = () => {
    setFeedback(null);
    setDecision(null);
    setInspectedChecks([]);
    if (currentIdx < QR_STATIONS.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setCurrentIdx(0);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#071312] text-[#e8f2ef] font-sans">
      {/* Top Bar */}
      <header className="flex items-center justify-between px-4 md:px-8 py-3.5 border-b border-[#1c3834] bg-[#0c201e]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            className="border-[#2b4c47] hover:bg-[#16332f] text-[#a9d1cb] gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" /> Adventures
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <QrCode className="w-5 h-5 text-[#2dd4bf]" />
              <h1 className="text-base md:text-lg font-bold text-white">QR Hunt: Code Investigator</h1>
            </div>
            <p className="text-xs text-[#8ab2ac]">Inspect the registered domain before scanning</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs px-3 py-1.5 rounded-xl bg-[#132c28] border border-[#234b45] font-bold text-[#fde047]">
            {score} XP
          </div>
          <div className="text-xs text-[#8ab2ac] font-medium">
            Station <strong className="text-white">{currentIdx + 1}</strong> of {QR_STATIONS.length}
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <main className="max-w-4xl w-full mx-auto p-4 md:p-6 flex-1 flex flex-col gap-5">
        {/* Real-time 3D Walk to Canteen & QR Stand Viewport */}
        <CanteenQRExperience3D
          hasReachedCanteen={hasReachedCanteen}
          isScanning={isScanning}
          onWalkComplete={() => setHasReachedCanteen(true)}
        />

        {/* Canteen Arrival & Scan Trigger Header */}
        <div className="p-4 rounded-2xl bg-[#0f2422] border border-[#214842] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-[#173a35] flex items-center justify-center text-[#2dd4bf]">
              <QrCode className="w-5 h-5" />
            </span>
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                Navrang School Canteen Counter
                {hasReachedCanteen && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#10b981]/20 text-[#6ee7b7] border border-[#10b981]/30">
                    Kid At Counter
                  </span>
                )}
              </div>
              <p className="text-xs text-[#8ab2ac]">
                {hasReachedCanteen
                  ? 'The kid is standing right in front of the counter acrylic QR stand!'
                  : 'Walking across the campus courtyard to reach the canteen counter...'}
              </p>
            </div>
          </div>

          <Button
            size="sm"
            disabled={!hasReachedCanteen || isScanning}
            onClick={startScanSequence}
            className="bg-[#2dd4bf] hover:bg-[#14b8a6] text-black font-extrabold text-xs gap-2 px-4 py-2 rounded-xl"
          >
            <Smartphone className="w-4 h-4" />
            {isScanning ? 'Scanning QR...' : 'Scan Counter QR Code'}
          </Button>
        </div>
        {/* Location & Discovery Context */}
        <div className="p-5 rounded-2xl bg-[#0f2422] border border-[#214842] shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5eead4]">
              Location: {target.location}
            </span>
            <span className="text-xs text-[#8cb1ab]">Physical QR Inspection</span>
          </div>

          <h2 className="text-lg md:text-xl font-bold text-white mb-2">
            &ldquo;{target.claim}&rdquo;
          </h2>
          <p className="text-xs text-[#b0cec9] mb-4">
            <strong>Found on:</strong> {target.foundOn}
          </p>

          {/* Scanner Simulation Screen */}
          <div className="p-4 rounded-xl bg-[#07100f] border border-[#1b3935] flex flex-col gap-3 font-mono text-xs shadow-inner">
            <div className="flex items-center justify-between text-[#7fa39d] border-b border-[#142926] pb-2 font-sans">
              <span className="flex items-center gap-1.5 text-white font-semibold">
                <QrCode className="w-4 h-4 text-[#2dd4bf]" /> Simulated Camera Scanner
              </span>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                  target.encrypted ? 'bg-[#10b981]/20 text-[#6ee7b7]' : 'bg-[#ef4444]/20 text-[#fca5a5]'
                }`}
              >
                {target.encrypted ? '🔒 HTTPS Encrypted' : '⚠️ Unencrypted HTTP'}
              </span>
            </div>

            <div>
              <span className="text-[#648b85] font-sans text-[11px] block">Full Decoded URL:</span>
              <div className="text-[#e2e8f0] break-all bg-[#0d1e1c] p-2.5 rounded-lg border border-[#1a3a35] mt-1 text-xs">
                {target.fullUrl}
              </div>
            </div>

            <div className="flex items-center gap-2 font-sans text-xs">
              <span className="text-[#8cb1ab]">Registered Domain:</span>
              <span className="px-2 py-0.5 rounded bg-[#183a34] text-[#5eead4] font-bold font-mono">
                {target.registeredDomain}
              </span>
            </div>
          </div>
        </div>

        {/* 3 Verification Checks */}
        <div className="p-5 rounded-2xl bg-[#0f2422] border border-[#214842] shadow-lg">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#99c2bc] mb-2 flex items-center gap-2">
            <Search className="w-4 h-4 text-[#2dd4bf]" />
            Run the 3 Safety Checks ({inspectedChecks.length}/3 examined)
          </h3>
          <p className="text-xs text-[#709690] mb-3">Tap each check to analyze the evidence:</p>

          <div className="flex flex-col gap-2">
            {target.checks.map((chk, i) => {
              const done = inspectedChecks.includes(i);
              return (
                <div
                  key={i}
                  onClick={() => handleInspect(i)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    done
                      ? 'bg-[#173833] border-[#2e6259]'
                      : 'bg-[#0a1716] border-[#183632] hover:border-[#27534c]'
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs md:text-sm text-white">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                        done ? 'bg-[#14b8a6] text-[#042f2e]' : 'bg-[#1a3834] text-[#86a8a2]'
                      }`}
                    >
                      {done ? '✓' : i + 1}
                    </span>
                    {chk}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Player Verdict Decision */}
        <div className="p-5 rounded-2xl bg-[#0f2422] border border-[#214842] shadow-lg">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#99c2bc] mb-1">
            What is your decision?
          </h3>
          <p className="text-xs text-[#8cb1ab] mb-4">Choose the safest reaction:</p>

          <div className="grid grid-cols-3 gap-3">
            <button
              disabled={feedback !== null}
              onClick={() => handleDecision('open')}
              className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 text-xs font-bold transition-all ${
                decision === 'open'
                  ? 'border-[#10b981] bg-[#064e3b] text-[#6ee7b7]'
                  : 'border-[#214640] bg-[#0c1c1a] hover:bg-[#163330] text-[#c4dfda]'
              }`}
            >
              <CheckCircle2 className="w-5 h-5 text-[#34d399]" />
              Safe to Open
              <span className="text-[10px] font-normal text-[#7fa39d]">Genuine school link</span>
            </button>

            <button
              disabled={feedback !== null}
              onClick={() => handleDecision('ignore')}
              className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 text-xs font-bold transition-all ${
                decision === 'ignore'
                  ? 'border-[#f59e0b] bg-[#78350f] text-[#fef08a]'
                  : 'border-[#214640] bg-[#0c1c1a] hover:bg-[#163330] text-[#c4dfda]'
              }`}
            >
              <XCircle className="w-5 h-5 text-[#fbbf24]" />
              Ignore & Avoid
              <span className="text-[10px] font-normal text-[#7fa39d]">Skip suspicious flyer</span>
            </button>

            <button
              disabled={feedback !== null}
              onClick={() => handleDecision('report')}
              className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 text-xs font-bold transition-all ${
                decision === 'report'
                  ? 'border-[#ef4444] bg-[#7f1d1d] text-[#fca5a5]'
                  : 'border-[#214640] bg-[#0c1c1a] hover:bg-[#163330] text-[#c4dfda]'
              }`}
            >
              <Flag className="w-5 h-5 text-[#f87171]" />
              Report QR Trap
              <span className="text-[10px] font-normal text-[#7fa39d]">Alert school authorities</span>
            </button>
          </div>
        </div>

        {/* Outcome Feedback */}
        {feedback && (
          <div
            className={`p-5 rounded-2xl border shadow-xl ${
              feedback === 'success'
                ? 'bg-[#0f2e29] border-[#22c55e]/60 text-[#dcfce7]'
                : 'bg-[#3b1717] border-[#ef4444]/60 text-[#fee2e2]'
            }`}
          >
            <div className="flex items-center gap-2 mb-2 font-bold text-white text-base">
              {feedback === 'success' ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-[#4ade80]" /> Case Accurately Solved!
                </>
              ) : (
                <>
                  <AlertTriangle className="w-5 h-5 text-[#f87171]" /> Let&apos;s Review This Code
                </>
              )}
            </div>
            <p className="text-xs md:text-sm mb-3 leading-relaxed">{target.verdictReason}</p>
            <div className="p-3 rounded-xl bg-black/30 border border-white/10 text-xs mb-4">
              💡 <strong>Key QR Safety Rule:</strong> {target.safetyLesson}
            </div>
            <Button
              size="sm"
              onClick={handleNext}
              className="w-full bg-[#10b981] hover:bg-[#059669] text-black font-extrabold gap-1.5"
            >
              {currentIdx < QR_STATIONS.length - 1 ? 'Next Station' : 'Review Investigation'}{' '}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}

