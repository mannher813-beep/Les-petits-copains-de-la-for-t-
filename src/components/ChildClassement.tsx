import React, { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { Enfant, LeaderboardEntry } from "../types/multiTome";
import { multiTomeService } from "../services/multiTomeService";
import { ArrowLeft, Globe, Crown, Star, Trophy, Sparkles, Volume2, VolumeX, RefreshCw, Flame, PartyPopper, Zap, Timer } from "lucide-react";
import { Language } from "../i18n/translations";
import { getMascot } from "../types/mascots";
import { soundManager } from "../utils/audioCelebration";

interface ChildClassementProps {
  enfant: Enfant;
  onNavigate: (path: string) => void;
  lang: Language;
}

export const ChildClassement: React.FC<ChildClassementProps> = ({
  enfant,
  onNavigate,
  lang
}) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [animStep, setAnimStep] = useState<number>(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showAllAges, setShowAllAges] = useState(false);
  // Deux classements possibles : par points (défaut) ou par rapidité de réponse
  const [classementMode, setClassementMode] = useState<"points" | "vitesse">("points");

  const formatTemps = (ms?: number) => {
    if (ms === undefined || ms === null) return "—";
    return `${(ms / 1000).toFixed(1)}s`;
  };

  // Trigger celebration sounds & confetti sequence
  const launchCelebrationSequence = () => {
    setAnimStep(0);

    // Step 1: Reveal Rank 3 (0.3s)
    setTimeout(() => {
      setAnimStep(1);
      soundManager.playPopSound(1);
    }, 300);

    // Step 2: Reveal Rank 2 (0.8s)
    setTimeout(() => {
      setAnimStep(2);
      soundManager.playPopSound(2);
    }, 800);

    // Step 3: Reveal Champion Rank 1 (1.4s) - Confetti & Fanfare !
    setTimeout(() => {
      setAnimStep(3);
      soundManager.playFanfare();

      // Launch Confetti Explosions
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Side confetti cannons
      setTimeout(() => {
        confetti({
          particleCount: 40,
          angle: 60,
          spread: 55,
          origin: { x: 0 }
        });
        confetti({
          particleCount: 40,
          angle: 120,
          spread: 55,
          origin: { x: 1 }
        });
      }, 250);
    }, 1400);

    // Step 4: Reveal full table rows gradually (2.0s)
    setTimeout(() => {
      setAnimStep(4);
    }, 2000);
  };

  useEffect(() => {
    const trancheAge = showAllAges ? "toutes" : (enfant.tranche_age || "5-6");
    const request =
      classementMode === "vitesse"
        ? multiTomeService.getLeaderboardVitesse(trancheAge)
        : multiTomeService.getLeaderboard(trancheAge);

    request.then((data) => {
      setEntries(data);
      launchCelebrationSequence();
    });
  }, [enfant, showAllAges, classementMode]);

  const toggleSound = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundManager.isMuted = nextMuted;
  };

  const top1 = entries[0];
  const top2 = entries[1];
  const top3 = entries[2];
  const listEntries = entries.slice(3);

  return (
    <div className="max-w-md mx-auto p-4 sm:p-6 pb-28 space-y-4 animate-fade-in relative">
      {/* TOP HEADER */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={() => onNavigate("/parcours")}
          className="p-2.5 rounded-2xl bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 shadow-xs hover:scale-105 transition-transform cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-amber-500 animate-bounce" />
          <h1 className="text-xl font-black font-fun text-gray-800 dark:text-gray-100">
            Classement Global
          </h1>
        </div>

        <div className="flex items-center gap-1.5">
          {/* SOUND MUTE TOGGLE */}
          <button
            onClick={toggleSound}
            className={`p-2 rounded-2xl border transition-colors cursor-pointer ${
              isMuted
                ? "bg-rose-100 text-rose-700 border-rose-300 dark:bg-rose-950 dark:text-rose-300"
                : "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300"
            }`}
            title={isMuted ? "Activer le son" : "Couper le son"}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <span
            className="flex items-center gap-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 px-2.5 py-1.5 rounded-2xl text-xs font-bold shadow-xs"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-600" />
            <span className="uppercase">{lang}</span>
          </span>
        </div>
      </div>

      {/* CLASSEMENT MODE TOGGLE : Points vs Rapidité */}
      <div className="flex bg-gray-100 dark:bg-gray-800 rounded-2xl p-1 gap-1">
        <button
          onClick={() => setClassementMode("points")}
          className={`flex-1 text-xs font-bold py-2 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
            classementMode === "points"
              ? "bg-white dark:bg-gray-700 text-amber-700 dark:text-amber-300 shadow-xs"
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          <Trophy className="w-3.5 h-3.5" />
          Par points
        </button>
        <button
          onClick={() => setClassementMode("vitesse")}
          className={`flex-1 text-xs font-bold py-2 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
            classementMode === "vitesse"
              ? "bg-white dark:bg-gray-700 text-sky-700 dark:text-sky-300 shadow-xs"
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          Par rapidité
        </button>
      </div>

      {/* AGE FILTER TOGGLE */}
      <div className="flex bg-gray-100 dark:bg-gray-800 rounded-2xl p-1 gap-1">
        <button
          onClick={() => setShowAllAges(false)}
          className={`flex-1 text-xs font-bold py-2 rounded-xl transition-colors cursor-pointer ${
            !showAllAges
              ? "bg-white dark:bg-gray-700 text-emerald-700 dark:text-emerald-300 shadow-xs"
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          Ma tranche d'âge ({enfant.tranche_age})
        </button>
        <button
          onClick={() => setShowAllAges(true)}
          className={`flex-1 text-xs font-bold py-2 rounded-xl transition-colors cursor-pointer ${
            showAllAges
              ? "bg-white dark:bg-gray-700 text-emerald-700 dark:text-emerald-300 shadow-xs"
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          Tous les âges
        </button>
      </div>

      {/* LIVE UPDATE BANNER & RE-PLAY ANIMATION BUTTON */}
      <div className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 rounded-2xl p-3 shadow-md flex items-center justify-between border-2 border-amber-200">
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-600"></span>
          </span>
          <div className="text-xs font-extrabold text-amber-950 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-800" />
            <span>Mise à jour du classement en direct !</span>
          </div>
        </div>

        <button
          onClick={launchCelebrationSequence}
          className="bg-amber-950 hover:bg-black text-amber-200 px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-xs transition-transform active:scale-95 cursor-pointer"
        >
          <PartyPopper className="w-3.5 h-3.5" />
          <span>Fêter</span>
        </button>
      </div>

      {/* ANIMATED PODIUM STAGE */}
      <div className="bg-gradient-to-b from-emerald-800 via-emerald-900 to-emerald-950 p-5 rounded-3xl text-white shadow-2xl flex items-end justify-center gap-2 pt-12 pb-4 relative overflow-hidden border-4 border-emerald-600/30">
        {/* GOLDEN SPARKLES BACKGROUND PATTERN */}
        <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:18px_18px] opacity-15 pointer-events-none" />

        {/* 2ND PLACE (Noah / Left) */}
        {top2 && (
          <div
            className={`flex flex-col items-center transition-all duration-700 transform ${
              animStep >= 2 ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-12 scale-75"
            }`}
          >
            <div className="w-13 h-13 rounded-full bg-slate-200 p-0.5 border-2 border-slate-300 shadow-md mb-1 relative group cursor-pointer hover:scale-110 transition-transform">
              <img src={top2.enfant.photo || getMascot(top2.enfant.avatar).image} alt={top2.enfant.pseudo} className="w-full h-full object-cover rounded-full" />
              <div className="absolute -top-1 -right-1 bg-slate-300 text-slate-900 text-[9px] font-black px-1 rounded-full border border-white">
                2e
              </div>
            </div>
            <span className="text-xs font-bold truncate max-w-[70px]">{top2.enfant.pseudo}</span>
            <span className="text-[10px] text-amber-300 font-black flex items-center gap-0.5">
              {classementMode === "vitesse" ? `⚡ ${formatTemps(top2.temps_moyen_ms)}` : `⭐ ${top2.total_points.toLocaleString()}`}
            </span>
            <div className="w-20 h-20 bg-slate-300/90 text-slate-900 font-black text-xl flex items-center justify-center rounded-t-2xl mt-2 shadow-inner border-t-2 border-white/30 relative">
              <span>2</span>
            </div>
          </div>
        )}

        {/* 1ST PLACE CHAMPION (Middle - Highest & Grandest Animation) */}
        {top1 && (
          <div
            onClick={() => {
              confetti({ particleCount: 50, spread: 60, origin: { y: 0.5 } });
              soundManager.playFanfare();
            }}
            className={`flex flex-col items-center -mt-8 z-10 cursor-pointer transition-all duration-700 transform ${
              animStep >= 3 ? "opacity-100 translate-y-0 scale-105" : "opacity-0 translate-y-16 scale-50"
            }`}
          >
            <div className="relative mb-1">
              <Crown className="w-8 h-8 text-amber-400 fill-amber-400 absolute -top-6 left-1/2 -translate-x-1/2 drop-shadow-lg animate-bounce" />
              <div className="w-18 h-18 rounded-full bg-gradient-to-tr from-amber-300 via-yellow-200 to-amber-400 p-1 border-4 border-amber-300 shadow-2xl relative ring-4 ring-amber-400/50 animate-pulse">
                <img src={top1.enfant.photo || getMascot(top1.enfant.avatar).image} alt={top1.enfant.pseudo} className="w-full h-full object-cover rounded-full" />
              </div>
            </div>

            <span className="text-sm font-black text-amber-300 truncate max-w-[90px] drop-shadow-md">
              {top1.enfant.pseudo}
            </span>
            <span className="text-xs text-amber-200 font-black flex items-center gap-0.5 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-400/40 mt-0.5">
              {classementMode === "vitesse" ? `⚡ ${formatTemps(top1.temps_moyen_ms)}` : `⭐ ${top1.total_points.toLocaleString()}`}
            </span>

            <div className="w-24 h-28 bg-gradient-to-b from-amber-400 via-amber-500 to-yellow-600 text-amber-950 font-black text-3xl flex flex-col items-center justify-center rounded-t-2xl mt-2 shadow-2xl border-t-2 border-amber-200 relative">
              <Sparkles className="w-5 h-5 text-amber-200 absolute top-2" />
              <span className="mt-2">1</span>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-950/80">Champion</span>
            </div>
          </div>
        )}

        {/* 3RD PLACE (Right) */}
        {top3 && (
          <div
            className={`flex flex-col items-center transition-all duration-700 transform ${
              animStep >= 1 ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-12 scale-75"
            }`}
          >
            <div className="w-13 h-13 rounded-full bg-amber-700 p-0.5 border-2 border-amber-600 shadow-md mb-1 relative group cursor-pointer hover:scale-110 transition-transform">
              <img src={top3.enfant.photo || getMascot(top3.enfant.avatar).image} alt={top3.enfant.pseudo} className="w-full h-full object-cover rounded-full" />
              <div className="absolute -top-1 -right-1 bg-amber-600 text-amber-100 text-[9px] font-black px-1 rounded-full border border-white">
                3e
              </div>
            </div>
            <span className="text-xs font-bold truncate max-w-[70px]">{top3.enfant.pseudo}</span>
            <span className="text-[10px] text-amber-300 font-black flex items-center gap-0.5">
              {classementMode === "vitesse" ? `⚡ ${formatTemps(top3.temps_moyen_ms)}` : `⭐ ${top3.total_points.toLocaleString()}`}
            </span>
            <div className="w-20 h-16 bg-amber-800/90 text-amber-100 font-black text-lg flex items-center justify-center rounded-t-2xl mt-2 shadow-inner border-t-2 border-amber-600">
              <span>3</span>
            </div>
          </div>
        )}
      </div>

      {/* GRADUAL LEADERBOARD TABLE (Ranks 4..7) */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-4 border-2 border-amber-200 dark:border-gray-700 shadow-md space-y-2">
        <div className="flex items-center justify-between px-2 pb-1 border-b border-gray-100 dark:border-gray-700 text-[10px] font-black text-gray-400 uppercase tracking-wider">
          <span>Rang & Aventurier</span>
          <span>{classementMode === "vitesse" ? "Temps moyen" : "Pommes d'Or"}</span>
        </div>

        {listEntries.map((entry, index) => {
          const isSelf = entry.enfant.id === enfant.id || entry.enfant.pseudo === enfant.pseudo;
          const mascot = getMascot(entry.enfant.avatar);

          return (
            <div
              key={entry.enfant.id}
              style={{ transitionDelay: `${index * 120}ms` }}
              className={`p-3.5 rounded-2xl flex items-center justify-between border transition-all duration-500 transform ${
                animStep >= 4 ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
              } ${
                isSelf
                  ? "bg-gradient-to-r from-emerald-50 via-emerald-100/80 to-teal-50 dark:from-emerald-950/80 dark:to-teal-950/80 border-emerald-400 shadow-md ring-2 ring-emerald-400/40 scale-102"
                  : "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-6 text-center font-black text-sm text-gray-500 flex items-center justify-center">
                  {entry.rang}
                </span>

                <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 p-0.5 border-2 border-amber-300 shrink-0 shadow-xs relative">
                  <img src={entry.enfant.photo || mascot.image} alt={entry.enfant.pseudo} className="w-full h-full object-cover rounded-full" />
                  {isSelf && (
                    <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-0.5 rounded-full text-[8px] font-black border border-white">
                      Moi
                    </span>
                  )}
                </div>

                <div className="flex flex-col">
                  <span className="text-sm font-extrabold text-gray-800 dark:text-gray-100 flex items-center gap-1.5">
                    {entry.enfant.pseudo}
                    {isSelf && (
                      <span className="bg-emerald-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded-md uppercase tracking-wider">
                        Mon profil
                      </span>
                    )}
                  </span>
                  <span className="text-[10px] text-gray-400 font-bold">
                    {classementMode === "vitesse"
                      ? `${entry.chapitres_chronometres ?? 0} défis chronométrés`
                      : `${entry.chapitres_valides} chapitres complétés`}
                  </span>
                </div>
              </div>

              {classementMode === "vitesse" ? (
                <span className="text-xs font-black text-sky-700 dark:text-sky-300 flex items-center gap-1 bg-white dark:bg-gray-800 px-2.5 py-1 rounded-xl border border-sky-200 dark:border-gray-700 shadow-2xs">
                  <Timer className="w-3.5 h-3.5" />
                  {formatTemps(entry.temps_moyen_ms)}
                </span>
              ) : (
                <span className="text-xs font-black text-emerald-700 dark:text-emerald-300 flex items-center gap-1 bg-white dark:bg-gray-800 px-2.5 py-1 rounded-xl border border-amber-200 dark:border-gray-700 shadow-2xs">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {entry.total_points.toLocaleString()}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
