'use client';

import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Search,
  Filter,
  Clock,
  Sparkles,
  Gamepad2,
  Laptop,
  QrCode,
  ShieldCheck,
  Zap,
  Play,
  Star,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CATALOGUE_GAMES, CatalogueGame, GameStyle } from '@/lib/game/catalogue-data';

export default function GameCatalogueView({
  onSelectGame,
  onClose,
}: {
  onSelectGame: (gameId: string) => void;
  onClose: () => void;
}) {
  const [selectedStyle, setSelectedStyle] = useState<GameStyle | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeGameModal, setActiveGameModal] = useState<CatalogueGame | null>(null);

  const filteredGames = CATALOGUE_GAMES.filter((g) => {
    const matchesStyle = selectedStyle === 'all' || g.style === selectedStyle;
    const matchesSearch =
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStyle && matchesSearch;
  });

  const getStyleIcon = (style: GameStyle) => {
    switch (style) {
      case 'investigate':
        return <Search className="w-4 h-4" />;
      case 'walk-and-fix':
        return <Laptop className="w-4 h-4" />;
      case 'role-play':
        return <ShieldCheck className="w-4 h-4" />;
      case 'manage':
        return <Gamepad2 className="w-4 h-4" />;
      case 'arcade':
        return <Zap className="w-4 h-4" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#091211]/95 backdrop-blur-xl flex flex-col text-[#ecf0e7] overflow-y-auto">
      {/* Top Header */}
      <header className="sticky top-0 z-20 px-4 md:px-8 py-4 bg-[#0d1a18]/90 border-b border-[#203a36] backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="border-[#2b4c47] hover:bg-[#19332f] text-[#a9d1cb] gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Game
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-ping" />
              <h1 className="text-lg md:text-xl font-extrabold text-white tracking-wide">
                SafeRon Adventures Catalogue
              </h1>
            </div>
            <p className="text-xs text-[#8ab2ac]">
              Explore 17 cybersecurity adventures inspired by real-world digital threats
            </p>
          </div>
        </div>

        {/* Search & Counter */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#688f89]" />
            <input
              type="text"
              placeholder="Search games, topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#132623] border border-[#2b4c47] rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-[#688f89] focus:outline-none focus:border-[#10b981]"
            />
          </div>
          <span className="text-xs font-bold text-[#b6dfd9] px-3 py-1.5 rounded-xl bg-[#142926] border border-[#264440] whitespace-nowrap">
            {filteredGames.length} Games
          </span>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl w-full mx-auto p-4 md:p-8 flex-1 flex flex-col gap-6">
        {/* Style Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedStyle('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all whitespace-nowrap ${
              selectedStyle === 'all'
                ? 'bg-[#10b981] text-black border-[#10b981]'
                : 'bg-[#122421] border-[#223f3b] text-[#a7cec8] hover:border-[#38645d]'
            }`}
          >
            All 5 Styles
          </button>

          {(
            [
              ['investigate', 'Investigate'],
              ['walk-and-fix', 'Walk and Fix'],
              ['role-play', 'Role-Play'],
              ['manage', 'Strategy & Manage'],
              ['arcade', 'Arcade & Puzzle'],
            ] as const
          ).map(([styleKey, label]) => (
            <button
              key={styleKey}
              onClick={() => setSelectedStyle(styleKey)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all flex items-center gap-1.5 whitespace-nowrap ${
                selectedStyle === styleKey
                  ? 'bg-[#10b981] text-black border-[#10b981]'
                  : 'bg-[#122421] border-[#223f3b] text-[#a7cec8] hover:border-[#38645d]'
              }`}
            >
              {getStyleIcon(styleKey)}
              {label}
            </button>
          ))}
        </div>

        {/* Featured Hero Banner */}
        <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-[#173832] via-[#102723] to-[#0c1f1c] border border-[#2f5e55] shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#f59e0b] text-black font-extrabold text-[10px] uppercase tracking-wider">
                FLAGSHIP 3D GAME
              </span>
              <span className="text-xs text-[#a9d4ce]">Navrang Public School, Lucknow</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2 leading-tight">
              Phishing Detective 3D &middot; The Tech Fest Mystery
            </h2>
            <p className="text-xs md:text-sm text-[#b8dfd9] leading-relaxed mb-4">
              Explore a lively Indian school campus in real-time 3D. Follow clues across the noticeboards, computer labs, and canteen. Verify suspicious prizes with Ms. Meera and stop the scams!
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                onClick={() => {
                  onSelectGame('phishing');
                  onClose();
                }}
                className="bg-[#10b981] hover:bg-[#059669] text-black font-extrabold text-xs gap-2 px-5 py-2 rounded-xl shadow-lg"
              >
                <Play className="w-4 h-4 fill-current" /> Play Phishing Detective 3D
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  onSelectGame('legit-or-scam');
                  onClose();
                }}
                className="border-[#3d7067] hover:bg-[#1d403a] text-white text-xs gap-2 px-4 py-2 rounded-xl"
              >
                Play Legit or Scam?
              </Button>
            </div>
          </div>

          <div className="hidden lg:flex flex-col items-center justify-center p-6 rounded-2xl bg-[#091514]/70 border border-[#23423d] text-center min-w-[200px]">
            <Sparkles className="w-8 h-8 text-[#facc15] mb-2" />
            <div className="text-2xl font-black text-white">100%</div>
            <div className="text-[11px] text-[#93bdb6] uppercase tracking-wider font-semibold">
              Cyber Safety Verified
            </div>
            <div className="mt-2 text-[10px] text-[#6d9690]">
              Zero real data, age-appropriate (4–10)
            </div>
          </div>
        </div>

        {/* Game Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredGames.map((game) => (
            <div
              key={game.id}
              className={`p-5 rounded-2xl border flex flex-col justify-between transition-all duration-200 relative group overflow-hidden ${
                game.playable
                  ? 'bg-[#122421] border-[#254641] hover:border-[#10b981] hover:bg-[#162e2a] hover:shadow-xl'
                  : 'bg-[#0d1716]/80 border-[#1d312e] opacity-80 hover:opacity-100 hover:border-[#2f4f49]'
              }`}
            >
              <div>
                {/* Header Tag / Badge */}
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      game.playable
                        ? 'bg-[#10b981]/20 text-[#6ee7b7] border border-[#10b981]/30'
                        : 'bg-[#64748b]/20 text-[#cbd5e1] border border-[#64748b]/30'
                    }`}
                  >
                    {game.playable && <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />}
                    {game.badge}
                  </span>

                  <div className="flex items-center gap-2 text-xs text-[#8ab2ac]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#628b85]" /> {game.time}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-[#466963]" />
                    <span
                      className={`font-semibold ${
                        game.rating === 'Beginner'
                          ? 'text-[#34d399]'
                          : game.rating === 'Intermediate'
                          ? 'text-[#fbbf24]'
                          : 'text-[#f87171]'
                      }`}
                    >
                      {game.rating}
                    </span>
                  </div>
                </div>

                {/* Title & Tagline */}
                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[#5eead4] transition-colors">
                  {game.title}
                </h3>
                <div className="text-xs font-semibold text-[#8ebbb4] mb-2">{game.subtitle}</div>
                <p className="text-xs text-[#b0cec9] leading-relaxed mb-4 line-clamp-3">
                  {game.description}
                </p>

                {/* Features Pill List */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {game.features.slice(0, 2).map((feat, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-[#19322e] text-[#93c2bb] border border-[#254640]"
                    >
                      {feat}
                    </span>
                  ))}
                  {game.features.length > 2 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[#19322e] text-[#6d9690]">
                      +{game.features.length - 2} more
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[#1d3531] flex items-center justify-between gap-2">
                <button
                  onClick={() => setActiveGameModal(game)}
                  className="text-xs text-[#7bb0a8] hover:text-white font-medium flex items-center gap-1"
                >
                  View Details <ArrowRight className="w-3 h-3" />
                </button>

                {game.playable ? (
                  <Button
                    size="sm"
                    onClick={() => {
                      onSelectGame(game.id);
                      onClose();
                    }}
                    className="bg-[#10b981] hover:bg-[#059669] text-black font-extrabold text-xs gap-1.5 px-3.5 rounded-xl shadow-md"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" /> Play
                  </Button>
                ) : (
                  <span className="text-[11px] font-bold text-[#62847f] px-2.5 py-1 rounded bg-[#101e1c]">
                    In Pipeline
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      {activeGameModal && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-lg w-full p-6 rounded-3xl bg-[#122421] border border-[#2b524c] shadow-2xl flex flex-col gap-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase px-2.5 py-1 rounded-md bg-[#1d3d37] text-[#5eead4]">
                {activeGameModal.styleLabel}
              </span>
              <button
                onClick={() => setActiveGameModal(null)}
                className="text-[#7bb0a8] hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white">{activeGameModal.title}</h3>
              <p className="text-xs text-[#8ebbb4] mb-2">{activeGameModal.subtitle}</p>
              <p className="text-xs text-[#b8dfd9] leading-relaxed">{activeGameModal.description}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0b1716] border border-[#1e3b36]">
              <div className="text-xs font-bold text-[#bfe8e1] mb-2">Key Gameplay Mechanics:</div>
              <ul className="text-xs text-[#9bbdb7] space-y-1.5">
                {activeGameModal.features.map((feat, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                    {feat}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="text-xs text-[#8ab2ac]">
                Play Time: <strong className="text-white">{activeGameModal.time}</strong> &middot; Level:{' '}
                <strong className="text-white">{activeGameModal.rating}</strong>
              </div>

              {activeGameModal.playable ? (
                <Button
                  onClick={() => {
                    onSelectGame(activeGameModal.id);
                    setActiveGameModal(null);
                    onClose();
                  }}
                  className="bg-[#10b981] hover:bg-[#059669] text-black font-extrabold text-xs gap-1.5 rounded-xl px-4"
                >
                  <Play className="w-3.5 h-3.5 fill-current" /> Play Adventure Now
                </Button>
              ) : (
                <Button disabled variant="outline" className="border-[#2c4e48] text-[#5e827d] text-xs">
                  Coming Soon
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

