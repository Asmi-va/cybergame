'use client';

import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ShieldCheck,
  ShieldAlert,
  Search,
  Eye,
  Flag,
  XCircle,
  HelpCircle,
  QrCode,
  Smartphone,
  Mail,
  Send,
  Star,
  Sparkles,
  ChevronRight,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SCAM_SCENARIOS, ScamScenario, ActionType } from '@/lib/game/scam-scenarios';
import { playCue } from '@/lib/game/audio';
import GameBackdrop3D from './game-backdrop-3d';

const STORAGE_KEY = 'saferon-legit-or-scam-v1';

export default function LegitOrScamGame({ onBack }: { onBack: () => void }) {
  const [index, setIndex] = useState(0);
  const [inspectedPoints, setInspectedPoints] = useState<number[]>([]);
  const [verifiedWithAdult, setVerifiedWithAdult] = useState(false);
  const [selectedAction, setSelectedAction] = useState<ActionType | null>(null);
  const [resultState, setResultState] = useState<'success' | 'mistake' | null>(null);
  const [score, setScore] = useState(0);
  const [completedScenarios, setCompletedScenarios] = useState<string[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const scenario: ScamScenario = SCAM_SCENARIOS[index];
  const isFinished = completedScenarios.length === SCAM_SCENARIOS.length;

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.completed)) setCompletedScenarios(parsed.completed);
        if (typeof parsed.score === 'number') setScore(parsed.score);
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  const saveProgress = (newCompleted: string[], newScore: number) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ completed: newCompleted, score: newScore }));
    } catch {
      // ignore storage errors
    }
  };

  const toggleEvidence = (idx: number) => {
    if (!inspectedPoints.includes(idx)) {
      setInspectedPoints([...inspectedPoints, idx]);
      playCue('clue', soundEnabled);
    }
  };

  const handleVerifyPrompt = () => {
    setVerifiedWithAdult(true);
    playCue('tap', soundEnabled);
  };

  const handleAction = (action: ActionType) => {
    setSelectedAction(action);
    const isCorrect = action === scenario.correctAction;

    if (isCorrect) {
      setResultState('success');
      playCue('success', soundEnabled);
      if (!completedScenarios.includes(scenario.id)) {
        const newCompleted = [...completedScenarios, scenario.id];
        const newScore = score + 100;
        setCompletedScenarios(newCompleted);
        setScore(newScore);
        saveProgress(newCompleted, newScore);
      }
    } else {
      setResultState('mistake');
      playCue('tap', soundEnabled);
    }
  };

  const handleNext = () => {
    setResultState(null);
    setSelectedAction(null);
    setInspectedPoints([]);
    setVerifiedWithAdult(false);
    if (index < SCAM_SCENARIOS.length - 1) {
      setIndex(index + 1);
    } else {
      // wrap around or stay finished
      setIndex(0);
    }
  };

  const handleRestart = () => {
    setCompletedScenarios([]);
    setScore(0);
    setIndex(0);
    setResultState(null);
    setSelectedAction(null);
    setInspectedPoints([]);
    setVerifiedWithAdult(false);
    localStorage.removeItem(STORAGE_KEY);
    playCue('success', soundEnabled);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0e1817] text-[#ecf0e7] font-sans">
      {/* Top Bar Navigation */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-[#243f3c] bg-[#142624]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            className="border-[#385e58] hover:bg-[#1f3a36] text-[#b8dfd8] gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            Adventures Library
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#f59e0b] animate-pulse" />
              <h1 className="text-lg font-bold text-white tracking-wide">Legit or Scam?</h1>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#9e3f1b]/40 text-[#fca5a5] border border-[#ef4444]/30">
                Digital Fact-Checker
              </span>
            </div>
            <p className="text-xs text-[#a2bcb7]">Inspect the evidence. Spot the tricks.</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#1b3431] border border-[#2d524c]">
            <Star className="w-4 h-4 text-[#fbbf24] fill-[#fbbf24]" />
            <span className="font-bold text-sm text-[#fef3c7]">{score}</span>
            <span className="text-xs text-[#9bb7b2]">XP</span>
          </div>

          <div className="text-xs font-medium text-[#b0cbc6] px-3 py-1.5 rounded-xl bg-[#172c29] border border-[#264440]">
            Case <strong className="text-white">{index + 1}</strong> of {SCAM_SCENARIOS.length}
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Simulated Situation & Evidence Preview */}
        <section className="lg:col-span-7 flex flex-col gap-4">
          {/* Interactive 3D Real-Time World Viewport */}
          <GameBackdrop3D
            environment={
              scenario.category === 'portal' || scenario.category === 'gaming'
                ? 'lab'
                : 'market'
            }
          />
          {/* Situation Header Card */}
          <div className="p-5 rounded-2xl bg-[#152a27] border border-[#2b4c47] shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#224540] text-[#7de0c8] border border-[#33655e]">
                {scenario.categoryLabel}
              </span>
              <span className="text-xs text-[#90b2ad] flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5" /> Channel: <strong>{scenario.channel}</strong>
              </span>
            </div>

            <h2 className="text-xl md:text-2xl font-bold text-white mb-2 leading-tight">
              {scenario.title}
            </h2>
            <p className="text-sm text-[#c0d6d2] mb-4">{scenario.contextNote}</p>

            {/* Simulated Digital Artifact / Message Card */}
            <div className="p-4 rounded-xl bg-[#0b1413] border border-[#243d39] font-mono text-xs md:text-sm shadow-inner relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-[#1c3330] pb-2 mb-3 text-[#799993]">
                <span className="flex items-center gap-1.5 font-sans font-semibold text-[#a8cfc8]">
                  <Mail className="w-3.5 h-3.5" /> {scenario.sender}
                </span>
                <span className="font-sans text-[11px] text-[#5e7c77]">{scenario.senderDetail}</span>
              </div>

              {scenario.previewBadge && (
                <div className="inline-block px-2.5 py-1 mb-2 rounded bg-[#3b231a] text-[#fca5a5] border border-[#78350f] text-xs font-sans font-bold">
                  {scenario.previewBadge}
                </div>
              )}

              <p className="text-[#e2eae8] font-sans leading-relaxed text-sm mb-3">
                &ldquo;{scenario.content}&rdquo;
              </p>

              {scenario.simulatedArtifact && (
                <div className="mt-3 p-3 rounded-lg bg-[#142321] border border-[#2c4743] font-sans text-xs flex flex-col gap-1.5">
                  <div className="font-bold text-[#b5ded7] flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-[#38bdf8]" />
                    {scenario.simulatedArtifact.header}
                  </div>
                  {scenario.simulatedArtifact.amount && (
                    <div className="text-lg font-extrabold text-[#f87171]">
                      Requested Amount: {scenario.simulatedArtifact.amount}
                    </div>
                  )}
                  {scenario.simulatedArtifact.senderUpi && (
                    <div className="text-xs text-[#9bb7b2] break-all font-mono">
                      Payee VPA: <span className="text-[#fde047]">{scenario.simulatedArtifact.senderUpi}</span>
                    </div>
                  )}
                  {scenario.simulatedArtifact.url && (
                    <div className="text-xs text-[#9bb7b2] break-all font-mono">
                      Target Link: <span className="text-[#38bdf8] underline">{scenario.simulatedArtifact.url}</span>
                    </div>
                  )}
                  {scenario.simulatedArtifact.qrDescription && (
                    <div className="text-xs text-[#cbd5e1] italic">
                      Physical inspection: {scenario.simulatedArtifact.qrDescription}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Interactive Evidence Point Accordion */}
          <div className="p-5 rounded-2xl bg-[#152a27] border border-[#2b4c47] shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#99c2bc] flex items-center gap-2">
                <Search className="w-4 h-4 text-[#2dd4bf]" />
                Inspect Key Evidence ({inspectedPoints.length}/{scenario.evidenceList.length} reviewed)
              </h3>
              <span className="text-xs text-[#709690]">Tap to inspect clues</span>
            </div>

            <div className="flex flex-col gap-2">
              {scenario.evidenceList.map((ev, i) => {
                const isOpen = inspectedPoints.includes(i);
                return (
                  <div
                    key={i}
                    onClick={() => toggleEvidence(i)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isOpen
                        ? 'bg-[#1b3431] border-[#3d6e67]'
                        : 'bg-[#10201e] border-[#223d39] hover:border-[#335d57]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold flex items-center gap-2 text-white">
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                            isOpen
                              ? 'bg-[#14b8a6] text-[#042f2e]'
                              : 'bg-[#213f3b] text-[#93b7b2]'
                          }`}
                        >
                          {isOpen ? '✓' : i + 1}
                        </span>
                        {ev.label}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded font-medium ${
                          ev.type === 'suspicious'
                            ? 'bg-[#ef4444]/20 text-[#fca5a5]'
                            : ev.type === 'safe'
                            ? 'bg-[#10b981]/20 text-[#6ee7b7]'
                            : 'bg-[#f59e0b]/20 text-[#fde68a]'
                        }`}
                      >
                        {ev.type}
                      </span>
                    </div>
                    {isOpen && (
                      <p className="mt-2 text-xs md:text-sm text-[#b2d1cb] leading-relaxed pl-7">
                        {ev.detail}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Right Column: Independent Verification, Action Decision, Feedback */}
        <section className="lg:col-span-5 flex flex-col gap-4">
          {/* Real-World Independent Verification Card */}
          <div className="p-5 rounded-2xl bg-[#152a27] border border-[#2b4c47] shadow-lg">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#99c2bc] flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-[#38bdf8]" />
              Independent Real-World Check
            </h3>
            <p className="text-xs text-[#a9c9c3] mb-3">
              Never verify a suspicious message by clicking its own link or calling the number sent in it!
            </p>

            <div className="p-3.5 rounded-xl bg-[#0f2220] border border-[#223f3b] text-xs text-[#c3ded9] mb-3 leading-relaxed">
              <strong>Trusted Verification Protocol:</strong>
              <br />
              {scenario.independentVerificationHint}
            </div>

            <Button
              variant={verifiedWithAdult ? 'outline' : 'default'}
              size="sm"
              onClick={handleVerifyPrompt}
              className={`w-full text-xs font-bold gap-2 ${
                verifiedWithAdult
                  ? 'border-[#22c55e]/50 text-[#86efac] bg-[#14532d]/20'
                  : 'bg-[#0284c7] hover:bg-[#0369a1] text-white'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              {verifiedWithAdult
                ? 'Independent check recorded in case file'
                : 'Confirm you would verify independently'}
            </Button>
          </div>

          {/* Action Choice Deck */}
          <div className="p-5 rounded-2xl bg-[#152a27] border border-[#2b4c47] shadow-lg">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#99c2bc] mb-1">
              What is your detective call?
            </h3>
            <p className="text-xs text-[#8cb1ab] mb-4">
              Select the safest action based on your inspected clues and verification.
            </p>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                disabled={resultState === 'success'}
                onClick={() => handleAction('proceed')}
                className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-xs font-bold ${
                  selectedAction === 'proceed'
                    ? 'border-[#10b981] bg-[#064e3b] text-[#6ee7b7]'
                    : 'border-[#284a45] bg-[#102320] hover:bg-[#1a3531] text-[#c4dfda]'
                }`}
              >
                <CheckCircle2 className="w-5 h-5 text-[#34d399]" />
                Proceed / Safe
                <span className="text-[10px] font-normal text-[#86a8a2]">Verified legitimate</span>
              </button>

              <button
                disabled={resultState === 'success'}
                onClick={() => handleAction('verify')}
                className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-xs font-bold ${
                  selectedAction === 'verify'
                    ? 'border-[#38bdf8] bg-[#0c4a6e] text-[#bae6fd]'
                    : 'border-[#284a45] bg-[#102320] hover:bg-[#1a3531] text-[#c4dfda]'
                }`}
              >
                <Eye className="w-5 h-5 text-[#38bdf8]" />
                Verify In Person
                <span className="text-[10px] font-normal text-[#86a8a2]">Speak with parent/staff</span>
              </button>

              <button
                disabled={resultState === 'success'}
                onClick={() => handleAction('reject')}
                className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-xs font-bold ${
                  selectedAction === 'reject'
                    ? 'border-[#f59e0b] bg-[#78350f] text-[#fef08a]'
                    : 'border-[#284a45] bg-[#102320] hover:bg-[#1a3531] text-[#c4dfda]'
                }`}
              >
                <XCircle className="w-5 h-5 text-[#fbbf24]" />
                Reject & Delete
                <span className="text-[10px] font-normal text-[#86a8a2]">Refuse sensitive demand</span>
              </button>

              <button
                disabled={resultState === 'success'}
                onClick={() => handleAction('report')}
                className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-xs font-bold ${
                  selectedAction === 'report'
                    ? 'border-[#ef4444] bg-[#7f1d1d] text-[#fca5a5]'
                    : 'border-[#284a45] bg-[#102320] hover:bg-[#1a3531] text-[#c4dfda]'
                }`}
              >
                <Flag className="w-5 h-5 text-[#f87171]" />
                Report Scam
                <span className="text-[10px] font-normal text-[#86a8a2]">Alert school & adults</span>
              </button>
            </div>
          </div>

          {/* Outcome & Educational Learning Feedback */}
          {resultState && (
            <div
              className={`p-5 rounded-2xl border shadow-2xl animate-in fade-in zoom-in-95 duration-200 ${
                resultState === 'success'
                  ? 'bg-[#0f2e29] border-[#22c55e]/60 text-[#dcfce7]'
                  : 'bg-[#3b1717] border-[#ef4444]/60 text-[#fee2e2]'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {resultState === 'success' ? (
                  <>
                    <ShieldCheck className="w-6 h-6 text-[#4ade80]" />
                    <h4 className="font-bold text-base text-white">Excellent Detective Judgment!</h4>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-6 h-6 text-[#f87171]" />
                    <h4 className="font-bold text-base text-white">Let&apos;s Review the Clues</h4>
                  </>
                )}
              </div>

              <p className="text-xs md:text-sm leading-relaxed mb-3">
                {resultState === 'success' ? scenario.explanation : (
                  <span>
                    That choice could leave you or a classmate vulnerable. Remember:{' '}
                    <strong>{scenario.keyTakeaway}</strong>
                  </span>
                )}
              </p>

              <div className="p-3 rounded-xl bg-black/30 border border-white/10 text-xs text-[#e2e8f0] mb-4">
                💡 <strong>Key Safety Lesson:</strong> {scenario.keyTakeaway}
              </div>

              <div className="flex items-center justify-between">
                {resultState === 'success' ? (
                  <Button
                    size="sm"
                    onClick={handleNext}
                    className="w-full bg-[#10b981] hover:bg-[#059669] text-black font-bold gap-1.5"
                  >
                    Next Case <ArrowRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setResultState(null)}
                    className="w-full border-[#ef4444]/50 hover:bg-[#451a1a] text-white font-bold gap-1.5"
                  >
                    Try Again With Clues <RotateCcw className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Complete Adventure State */}
          {isFinished && (
            <div className="p-5 rounded-2xl bg-[#1e3a34] border border-[#34d399]/40 text-center flex flex-col items-center gap-3">
              <Sparkles className="w-8 h-8 text-[#facc15]" />
              <h3 className="text-lg font-bold text-white">All 10 Fact-Checker Cases Solved!</h3>
              <p className="text-xs text-[#b8ded6]">
                You have mastered UPI precautions, public QR code checks, scholarship verification, and fake login detection!
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRestart}
                className="border-[#386b62] hover:bg-[#254d45] text-white text-xs gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset & Play Again
              </Button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

