import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import { Enfant, LeaderboardEntry } from "../types/multiTome";
import { multiTomeService } from "../services/multiTomeService";
import {
  ArrowLeft,
  Globe,
  Crown,
  Star,
  Trophy,
  Sparkles,
  Volume2,
  VolumeX,
  PartyPopper,
  Zap,
  Timer,
  Medal,
  Award,
  UserCheck
} from "lucide-react";
import { Language, getTranslation } from "../i18n/translations";
import { getMascot } from "../types/mascots";
import { AnimatedMascot } from "./AnimatedMascot";
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
  const [isMuted, setIsMuted] = useState(soundManager.isMuted);
  const [showAllAges, setShowAllAges] = useState(false);
  const [classementMode, setClassementMode] = useState<"points" | "vitesse">("points");
  const [tappedChild, setTappedChild] = useState<string | null>(null);

  const formatTemps = (ms?: number) => {
    if (ms === undefined || ms === null) return "—";
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const launchCelebrationSequence = () => {
    setAnimStep(0);

    // Step 1: Reveal Rank 3 (0.3s)
    setTimeout(() => {
      setAnimStep(1);
      soundManager.playPopSound(1);
    }, 300);

    // Step 2: Reveal Rank 2 (0.7s)
    setTimeout(() => {
      setAnimStep(2);
      soundManager.playPopSound(2);
    }, 700);

    // Step 3: Reveal Champion Rank 1 (1.2s) - Confetti & Fanfare !
    setTimeout(() => {
      setAnimStep(3);
      soundManager.playFanfare();

      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.55 }
      });

      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 60,
          origin: { x: 0, y: 0.6 }
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 60,
          origin: { x: 1, y: 0.6 }
        });
      }, 300);
    }, 1200);

    // Step 4: Reveal full table rows
    setTimeout(() => {
      setAnimStep(4);
    }, 1800);
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

  const handleMascotTap = (pseudo: string) => {
    setTappedChild(pseudo);
    soundManager.playTapSound();
    confetti({
      particleCount: 35,
      spread: 50,
      origin: { y: 0.6 }
    });
    setTimeout(() => setTappedChild(null), 2500);
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
            {getTranslation(lang, "leaderboardTitle") || "Le Podium des Champions"}
          </h1>
        </div>

        <div className="flex items-center gap-1.5">
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

          <span className="flex items-center gap-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 px-2.5 py-1.5 rounded-2xl text-xs font-bold shadow-xs">
            <Globe className="w-3.5 h-3.5 text-emerald-600" />
            <span className="uppercase">{lang}</span>
          </span>
        </div>
      </div>

      {/* CLASSEMENT MODE TOGGLE: Points vs Rapidité */}
      <div className="grid grid-cols-2 bg-gray-100 dark:bg-gray-800 p-1.5 rounded-2xl gap-1.5 shadow-inner">
        <button
          onClick={() => setClassementMode("points")}
          className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-black transition-all cursor-pointer ${
            classementMode === "points"
              ? "bg-white dark:bg-gray-700 text-amber-600 dark:text-amber-300 shadow-md scale-102"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700"
          }`}
        >
          <Trophy className="w-4 h-4 text-amber-500" />
          <span>Par Points ⭐</span>
        </button>

        <button
          onClick={() => setClassementMode("vitesse")}
          className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-black transition-all cursor-pointer ${
            classementMode === "vitesse"
              ? "bg-white dark:bg-gray-700 text-sky-600 dark:text-sky-300 shadow-md scale-102"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700"
          }`}
        >
          <Zap className="w-4 h-4 text-sky-500" />
          <span>Par Rapidité ⚡</span>
        </button>
      </div>

      {/* AGE FILTER TOGGLE */}
      <div className="grid grid-cols-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-2xl gap-1">
        <button
          onClick={() => setShowAllAges(false)}
          className={`py-1.5 px-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
            !showAllAges
              ? "bg-emerald-600 text-white shadow-sm"
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          Tranche {enfant.tranche_age || "5-6 ans"}
        </button>
        <button
          onClick={() => setShowAllAges(true)}
          className={`py-1.5 px-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
            showAllAges
              ? "bg-emerald-600 text-white shadow-sm"
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          Tous les âges 🌍
        </button>
      </div>

      {/* GRAND CELEBRATION PODIUM ARENA STAGE */}
      <div className="relative bg-gradient-to-b from-slate-900 via-indigo-950 to-emerald-950 p-4 sm:p-6 rounded-3xl text-white shadow-2xl border-4 border-amber-400/30 overflow-hidden">
        {/* Golden Sparkles & Spotlight background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-400/20 via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

        {/* Top Header Banner inside Arena */}
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div className="flex items-center gap-2 bg-amber-400/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-amber-400/40">
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: "6s" }} />
            <span className="text-xs font-black text-amber-200 uppercase tracking-wider">
              Podium Officiel
            </span>
          </div>

          <button
            onClick={launchCelebrationSequence}
            className="bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-xs px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
          >
            <PartyPopper className="w-4 h-4" />
            <span>Fêter 🎉</span>
          </button>
        </div>

        {/* Interactive Speech Notification */}
        <AnimatePresence>
          {tappedChild && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-14 left-1/2 -translate-x-1/2 z-30 bg-amber-300 text-amber-950 text-xs font-black px-4 py-1.5 rounded-full shadow-2xl border-2 border-amber-500 whitespace-nowrap"
            >
               Bravo {tappedChild} ! 🎉
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3D PODIUM CEREMONY STAGE */}
        <div className="flex items-end justify-center gap-2 sm:gap-3 pt-6 pb-2 relative z-10 min-h-[300px]">
          {/* --- 2ND PLACE (SILVER - LEFT) --- */}
          {top2 && (
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.8 }}
              animate={animStep >= 2 ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 100, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 140, damping: 14, delay: 0.2 }}
              className="flex flex-col items-center flex-1 max-w-[110px] group cursor-pointer"
              onClick={() => handleMascotTap(top2.enfant.pseudo)}
            >
              {/* Unobscured Mascot Section */}
              <div className="relative mb-1.5 flex flex-col items-center">
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-b from-slate-200 to-slate-400 p-1 shadow-lg border-2 border-white/80 flex items-center justify-center">
                  <AnimatedMascot
                    avatarId={top2.enfant.avatar}
                    size="md"
                    popOutOfFrame={false}
                    animateType="float"
                  />
                </div>
                <div className="mt-1 bg-slate-200 text-slate-900 text-[10px] font-black px-2 py-0.5 rounded-full border border-white shadow-md flex items-center gap-1">
                  <Medal className="w-3 h-3 text-slate-700" />
                  <span>2e Place</span>
                </div>
              </div>

              {/* Child Pseudo */}
              <span className="text-xs sm:text-sm font-black text-slate-100 truncate max-w-[90px] text-center drop-shadow-sm">
                {top2.enfant.pseudo}
              </span>

              {/* Score Tag */}
              <span className="text-[10px] sm:text-xs text-slate-950 font-black bg-slate-200 px-2 py-0.5 rounded-full border border-slate-300 mt-1 shadow-xs">
                {classementMode === "vitesse" ? `⚡ ${formatTemps(top2.temps_moyen_ms)}` : `⭐ ${top2.total_points.toLocaleString()}`}
              </span>

              {/* 3D Pedestal Block */}
              <div className="w-full h-24 sm:h-28 bg-gradient-to-b from-slate-300 via-slate-400 to-slate-500 rounded-t-2xl mt-2 flex flex-col items-center justify-center border-t-2 border-slate-100 shadow-2xl relative overflow-hidden">
                <span className="text-3xl sm:text-4xl font-black text-slate-900/80 drop-shadow-md">2</span>
                <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-900/60 mt-0.5">ARGENT</span>
              </div>
            </motion.div>
          )}

          {/* --- 1ST PLACE (GOLD / CHAMPION - MIDDLE) --- */}
          {top1 && (
            <motion.div
              initial={{ opacity: 0, y: 120, scale: 0.7 }}
              animate={animStep >= 3 ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 120, scale: 0.7 }}
              transition={{ type: "spring", stiffness: 130, damping: 12, delay: 0.4 }}
              className="flex flex-col items-center flex-1 max-w-[130px] z-20 group cursor-pointer -mt-6"
              onClick={() => handleMascotTap(top1.enfant.pseudo)}
            >
              {/* Golden Floating Crown & Mascot Section */}
              <div className="relative mb-1.5 flex flex-col items-center">
                <motion.div
                  animate={{ y: [-3, 3, -3], rotate: [-3, 3, -3] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  className="mb-1"
                >
                  <Crown className="w-8 h-8 sm:w-10 sm:h-10 text-amber-300 fill-amber-400 drop-shadow-[0_4px_10px_rgba(251,191,36,0.8)]" />
                </motion.div>

                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-200 to-amber-500 p-1.5 shadow-2xl border-4 border-amber-300 ring-4 ring-amber-400/40 flex items-center justify-center">
                  <AnimatedMascot
                    avatarId={top1.enfant.avatar}
                    size="lg"
                    popOutOfFrame={false}
                    animateType="bounce"
                  />
                </div>

                <div className="mt-1 bg-gradient-to-r from-amber-400 to-yellow-300 text-amber-950 text-[11px] font-black px-2.5 py-0.5 rounded-full border border-amber-200 shadow-lg flex items-center gap-1">
                  <Trophy className="w-3.5 h-3.5 text-amber-900 fill-amber-900" />
                  <span>CHAMPION</span>
                </div>
              </div>

              {/* Child Pseudo */}
              <span className="text-sm sm:text-base font-black text-amber-300 truncate max-w-[110px] text-center drop-shadow-md">
                {top1.enfant.pseudo}
              </span>

              {/* Score Tag */}
              <span className="text-xs sm:text-sm text-amber-950 font-black bg-gradient-to-r from-amber-300 to-yellow-300 px-3 py-0.5 rounded-full border border-amber-200 mt-1 shadow-md">
                {classementMode === "vitesse" ? `⚡ ${formatTemps(top1.temps_moyen_ms)}` : `⭐ ${top1.total_points.toLocaleString()}`}
              </span>

              {/* 3D Gold Pedestal Block */}
              <div className="w-full h-32 sm:h-36 bg-gradient-to-b from-amber-400 via-amber-500 to-yellow-600 rounded-t-2xl mt-2 flex flex-col items-center justify-center border-t-4 border-amber-200 shadow-2xl relative overflow-hidden">
                <Sparkles className="w-5 h-5 text-amber-200 absolute top-2 animate-pulse" />
                <span className="text-4xl sm:text-5xl font-black text-amber-950 drop-shadow-lg mt-2">1</span>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-950/90">OR</span>
              </div>
            </motion.div>
          )}

          {/* --- 3RD PLACE (BRONZE - RIGHT) --- */}
          {top3 && (
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.8 }}
              animate={animStep >= 1 ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 100, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 140, damping: 14, delay: 0.1 }}
              className="flex flex-col items-center flex-1 max-w-[110px] group cursor-pointer"
              onClick={() => handleMascotTap(top3.enfant.pseudo)}
            >
              {/* Unobscured Mascot Section */}
              <div className="relative mb-1.5 flex flex-col items-center">
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-b from-amber-600 to-amber-800 p-1 shadow-lg border-2 border-amber-400/80 flex items-center justify-center">
                  <AnimatedMascot
                    avatarId={top3.enfant.avatar}
                    size="md"
                    popOutOfFrame={false}
                    animateType="float"
                  />
                </div>
                <div className="mt-1 bg-amber-700 text-amber-100 text-[10px] font-black px-2 py-0.5 rounded-full border border-amber-500 shadow-md flex items-center gap-1">
                  <Award className="w-3 h-3 text-amber-300" />
                  <span>3e Place</span>
                </div>
              </div>

              {/* Child Pseudo */}
              <span className="text-xs sm:text-sm font-black text-amber-100 truncate max-w-[90px] text-center drop-shadow-sm">
                {top3.enfant.pseudo}
              </span>

              {/* Score Tag */}
              <span className="text-[10px] sm:text-xs text-amber-100 font-black bg-amber-800 px-2 py-0.5 rounded-full border border-amber-600 mt-1 shadow-xs">
                {classementMode === "vitesse" ? `⚡ ${formatTemps(top3.temps_moyen_ms)}` : `⭐ ${top3.total_points.toLocaleString()}`}
              </span>

              {/* 3D Bronze Pedestal Block */}
              <div className="w-full h-20 sm:h-24 bg-gradient-to-b from-amber-700 via-amber-800 to-amber-900 rounded-t-2xl mt-2 flex flex-col items-center justify-center border-t-2 border-amber-400 shadow-2xl relative overflow-hidden">
                <span className="text-3xl sm:text-4xl font-black text-amber-200/90 drop-shadow-md">3</span>
                <span className="text-[9px] font-extrabold uppercase tracking-wider text-amber-200/70 mt-0.5">BRONZE</span>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* GRADUAL LEADERBOARD TABLE (Ranks 4+) */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-4 border-2 border-amber-200 dark:border-gray-700 shadow-md space-y-2.5">
        <div className="flex items-center justify-between px-2 pb-2 border-b border-gray-100 dark:border-gray-700 text-[11px] font-black text-gray-400 uppercase tracking-wider">
          <span>Rang & Aventurier</span>
          <span>{classementMode === "vitesse" ? "Temps Moyen" : "Score Total"}</span>
        </div>

        {listEntries.length === 0 ? (
          <div className="text-center py-6 text-gray-400 text-xs font-bold">
            Aucun autre aventurier dans cette catégorie pour l'instant !
          </div>
        ) : (
          listEntries.map((entry, index) => {
            const isSelf = entry.enfant.id === enfant.id || entry.enfant.pseudo === enfant.pseudo;
            const mascot = getMascot(entry.enfant.avatar);

            return (
              <motion.div
                key={entry.enfant.id}
                initial={{ opacity: 0, x: -20 }}
                animate={animStep >= 4 ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className={`p-3 rounded-2xl flex items-center justify-between border transition-all ${
                  isSelf
                    ? "bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100 dark:from-emerald-950/90 dark:to-teal-950/90 border-emerald-400 ring-2 ring-emerald-400/50 shadow-md"
                    : "bg-gray-50/90 dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Rank Number Badge */}
                  <span className="w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-black text-xs flex items-center justify-center shrink-0">
                    {entry.rang}
                  </span>

                  {/* Clean Mascot Frame */}
                  <div className="w-11 h-11 rounded-full bg-amber-50 dark:bg-gray-800 p-0.5 border-2 border-amber-300 shrink-0 shadow-xs flex items-center justify-center overflow-hidden">
                    <AnimatedMascot
                      avatarId={entry.enfant.avatar}
                      mascot={mascot}
                      size="sm"
                      popOutOfFrame={false}
                    />
                  </div>

                  <div className="flex flex-col">
                    <span className="text-xs sm:text-sm font-extrabold text-gray-800 dark:text-gray-100 flex items-center gap-1.5">
                      {entry.enfant.pseudo}
                      {isSelf && (
                        <span className="bg-emerald-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded-md uppercase tracking-wider flex items-center gap-0.5">
                          <UserCheck className="w-2.5 h-2.5" /> Moi
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

                {/* Score Pill */}
                {classementMode === "vitesse" ? (
                  <span className="text-xs font-black text-sky-700 dark:text-sky-300 flex items-center gap-1 bg-white dark:bg-gray-800 px-2.5 py-1 rounded-xl border border-sky-200 dark:border-gray-700 shadow-2xs">
                    <Timer className="w-3.5 h-3.5 text-sky-500" />
                    {formatTemps(entry.temps_moyen_ms)}
                  </span>
                ) : (
                  <span className="text-xs font-black text-emerald-700 dark:text-emerald-300 flex items-center gap-1 bg-white dark:bg-gray-800 px-2.5 py-1 rounded-xl border border-amber-200 dark:border-gray-700 shadow-2xs">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {entry.total_points.toLocaleString()}
                  </span>
                )}
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};
