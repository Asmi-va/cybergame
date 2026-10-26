'use client';

import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Search,
  Eye,
  ShieldCheck,
  Laptop,
  FileText,
  Lock,
  Trash2,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { playCue } from '@/lib/game/audio';
import GameBackdrop3D from './game-backdrop-3d';

export type DeskItem = {
  id: string;
  name: string;
  description: string;
  category: 'public' | 'internal' | 'confidential' | 'restricted' | 'decoy';
  isRisk: boolean;
  correctAction: 'lock' | 'shred' | 'file' | 'leave';
  explanation: string;
};

const LAB_ITEMS: DeskItem[] = [
  {
    id: 'item-1',
    name: 'Yellow Sticky Note on Monitor',
    description: 'Sticky note reading: "Admin Login: teacher_sharma / Pass: Lucknow2026!"',
    category: 'restricted',
    isRisk: true,
    correctAction: 'shred',
    explanation: 'Passwords should never be written on sticky notes or displayed on monitors.',
  },
  {
    id: 'item-2',
    name: 'Ceramic Chai Mug & Coaster',
    description: 'A clean ceramic mug sitting next to a pencil stand on the teacher desk.',
    category: 'decoy',
    isRisk: false,
    correctAction: 'leave',
    explanation: 'Harmless decoy! Tidying personal items that pose no security risk wastes time.',
  },
  {
    id: 'item-3',
    name: 'Unlocked Student Lab Computer',
    description: 'Monitor left on with active browser logged into the School Grading System.',
    category: 'confidential',
    isRisk: true,
    correctAction: 'lock',
    explanation: 'Always lock your workstation or log out of shared computers before walking away.',
  },
  {
    id: 'item-4',
    name: 'Printed Student Fee & Aadhaar List',
    description: 'A stack of papers showing Class 6 student full names, father names, and Aadhaar numbers.',
    category: 'restricted',
    isRisk: true,
    correctAction: 'file',
    explanation: 'Personally Identifiable Information (PII) must be locked in confidential filing cabinets.',
  },
  {
    id: 'item-5',
    name: 'Annual Sports Day Public Poster',
    description: 'A printed flyer announcing tomorrow’s sports day schedule and race timings.',
    category: 'public',
    isRisk: false,
    correctAction: 'leave',
    explanation: 'Public festival posters are meant for everyone and are not a data leak.',
  },
  {
    id: 'item-6',
    name: 'Unattended USB Flash Drive',
    description: 'A black flash drive labelled "Mid-Term Exam Papers 2026" left in the USB port.',
    category: 'restricted',
    isRisk: true,
    correctAction: 'file',
    explanation: 'Removable media with confidential school files should be stored securely, not left plugged into open lab computers.',
  },
  {
    id: 'item-7',
    name: 'Small Potted Desk Plant',
    description: 'A green succulent plant beside the computer keyboard.',
    category: 'decoy',
    isRisk: false,
    correctAction: 'leave',
    explanation: 'Decoy item. Greenery on a desk carries zero cybersecurity risk.',
  },
];

export default function CleanDeskGame({ onBack }: { onBack: () => void }) {
  const [selectedItemIdx, setSelectedItemIdx] = useState(0);
  const [handledItems, setHandledItems] = useState<Record<string, { action: string; correct: boolean }>>({});
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  const currentItem = LAB_ITEMS[selectedItemIdx];
  const totalRisks = LAB_ITEMS.filter((i) => i.isRisk).length;
  const risksSolved = Object.values(handledItems).filter((h) => h.correct).length;
  const isComplete = Object.keys(handledItems).length === LAB_ITEMS.length;

  const handleAction = (act: 'lock' | 'shred' | 'file' | 'leave') => {
    const isCorrect = act === currentItem.correctAction;
    setHandledItems((prev) => ({
      ...prev,
      [currentItem.id]: { action: act, correct: isCorrect },
    }));

    if (isCorrect) {
      setScore((s) => s + 100);
      setFeedback(`Correct! ${currentItem.explanation}`);
      playCue('success', true);
    } else {
      setScore((s) => Math.max(0, s - 35));
      setFeedback(`Not quite. ${currentItem.explanation}`);
      playCue('tap', true);
    }
  };

  const handleNext = () => {
    setFeedback(null);
    if (selectedItemIdx < LAB_ITEMS.length - 1) {
      setSelectedItemIdx(selectedItemIdx + 1);
    } else {
      setSelectedItemIdx(0);
    }
  };

  const getGrade = () => {
    const ratio = score / (totalRisks * 100);
    if (ratio >= 0.9) return 'S Grade (Cyber Guardian)';
    if (ratio >= 0.75) return 'A Grade (Security Ready)';
    if (ratio >= 0.5) return 'B Grade (Needs Attention)';
    return 'C Grade (At Risk)';
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#07131b] text-[#e8f0f8] font-sans">
      <header className="flex items-center justify-between px-4 md:px-8 py-3.5 border-b border-[#1b3145] bg-[#0c2236]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            className="border-[#234b6e] hover:bg-[#15344f] text-[#93c5fd] gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" /> Adventures
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <Laptop className="w-5 h-5 text-[#60a5fa]" />
              <h1 className="text-base md:text-lg font-bold text-white">Clean Desk Challenge</h1>
            </div>
            <p className="text-xs text-[#94a3b8]">Computer lab &amp; staff desk end-of-day audit</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs px-3 py-1.5 rounded-xl bg-[#142e47] border border-[#234b6e] font-bold text-[#fde047]">
            {score} Points
          </div>
          <div className="text-xs text-[#94a3b8]">
            Item <strong className="text-white">{selectedItemIdx + 1}</strong> of {LAB_ITEMS.length}
          </div>
        </div>
      </header>

      <main className="max-w-4xl w-full mx-auto p-4 md:p-6 flex-1 flex flex-col gap-5">
        {/* Real-time 3D Computer Lab Viewport */}
        <GameBackdrop3D environment="lab" />
        {/* Desk Inspection Room Screen */}
        <div className="p-6 rounded-2xl bg-[#0f2840] border border-[#204a73] shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#93c5fd]">
              Zone: Computer Lab Teacher Desk
            </span>
            <span className="text-xs text-[#94a3b8]">Walk-and-Fix Mode</span>
          </div>

          <h2 className="text-xl md:text-2xl font-extrabold text-white mb-2">
            {currentItem.name}
          </h2>
          <p className="text-sm text-[#cbd5e1] mb-5 leading-relaxed">
            {currentItem.description}
          </p>

          {/* Classification Label */}
          <div className="p-3.5 rounded-xl bg-[#081524] border border-[#1b3a5c] text-xs flex items-center justify-between">
            <span className="text-[#94a3b8]">Document / Asset Classification:</span>
            <span
              className={`font-bold px-2.5 py-1 rounded-md uppercase text-[11px] ${
                currentItem.category === 'restricted'
                  ? 'bg-[#ef4444]/20 text-[#fca5a5] border border-[#ef4444]/40'
                  : currentItem.category === 'confidential'
                  ? 'bg-[#f59e0b]/20 text-[#fde68a] border border-[#f59e0b]/40'
                  : currentItem.category === 'internal'
                  ? 'bg-[#3b82f6]/20 text-[#93c5fd] border border-[#3b82f6]/40'
                  : currentItem.category === 'public'
                  ? 'bg-[#10b981]/20 text-[#6ee7b7] border border-[#10b981]/40'
                  : 'bg-[#64748b]/20 text-[#cbd5e1] border border-[#64748b]/40'
              }`}
            >
              {currentItem.category}
            </span>
          </div>
        </div>

        {/* Action Choice Deck */}
        <div className="p-5 rounded-2xl bg-[#0f2840] border border-[#204a73] shadow-lg">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#93c5fd] mb-1">
            Choose Your Desk Action:
          </h3>
          <p className="text-xs text-[#94a3b8] mb-4">
            Remember: Touching harmless decoys loses 35 points! Leave non-risks alone.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => handleAction('lock')}
              className="p-3.5 rounded-xl border border-[#234b6e] bg-[#0c2033] hover:bg-[#183959] text-xs font-bold text-white flex flex-col items-center gap-1.5 transition-all"
            >
              <Lock className="w-5 h-5 text-[#38bdf8]" />
              Lock Screen
              <span className="text-[10px] text-[#94a3b8] font-normal">Active monitors</span>
            </button>

            <button
              onClick={() => handleAction('shred')}
              className="p-3.5 rounded-xl border border-[#234b6e] bg-[#0c2033] hover:bg-[#183959] text-xs font-bold text-white flex flex-col items-center gap-1.5 transition-all"
            >
              <Trash2 className="w-5 h-5 text-[#f87171]" />
              Secure Shred
              <span className="text-[10px] text-[#94a3b8] font-normal">Password sticky notes</span>
            </button>

            <button
              onClick={() => handleAction('file')}
              className="p-3.5 rounded-xl border border-[#234b6e] bg-[#0c2033] hover:bg-[#183959] text-xs font-bold text-white flex flex-col items-center gap-1.5 transition-all"
            >
              <FileText className="w-5 h-5 text-[#fbbf24]" />
              Lock in Drawer
              <span className="text-[10px] text-[#94a3b8] font-normal">PII papers &amp; USBs</span>
            </button>

            <button
              onClick={() => handleAction('leave')}
              className="p-3.5 rounded-xl border border-[#234b6e] bg-[#0c2033] hover:bg-[#183959] text-xs font-bold text-white flex flex-col items-center gap-1.5 transition-all"
            >
              <CheckCircle2 className="w-5 h-5 text-[#34d399]" />
              Leave Untouched
              <span className="text-[10px] text-[#94a3b8] font-normal">Decoys &amp; public flyers</span>
            </button>
          </div>
        </div>

        {/* Feedback Area */}
        {feedback && (
          <div className="p-4 rounded-xl bg-[#081726] border border-[#25527d] text-xs md:text-sm text-[#e2e8f0] flex items-center justify-between gap-4">
            <div>{feedback}</div>
            <Button
              size="sm"
              onClick={handleNext}
              className="bg-[#38bdf8] hover:bg-[#0284c7] text-black font-extrabold text-xs whitespace-nowrap"
            >
              Next Item <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}

        {/* Completion Debrief */}
        {isComplete && (
          <div className="p-6 rounded-2xl bg-[#0b2238] border border-[#38bdf8]/40 text-center flex flex-col items-center gap-3">
            <Sparkles className="w-8 h-8 text-[#facc15]" />
            <h3 className="text-xl font-bold text-white">Clean Desk Audit Concluded!</h3>
            <div className="text-sm font-semibold text-[#38bdf8]">{getGrade()}</div>
            <p className="text-xs text-[#cbd5e1] max-w-md">
              You audited {LAB_ITEMS.length} items with {risksSolved} accurate security judgments.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setHandledItems({});
                setScore(0);
                setSelectedItemIdx(0);
                setFeedback(null);
              }}
              className="border-[#234b6e] hover:bg-[#173757] text-white text-xs gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Audit
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}

