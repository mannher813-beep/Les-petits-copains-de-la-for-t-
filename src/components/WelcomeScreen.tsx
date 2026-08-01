import React, { useEffect, useState } from "react";
import { QrCode, Sparkles, Compass, Trophy, Award, ArrowRight, Play, BookOpen } from "lucide-react";
import { Enfant } from "../types/multiTome";
import { multiTomeService } from "../services/multiTomeService";
import { Language, getTranslation } from "../i18n/translations";
import { getMascot } from "../types/mascots";
import { AnimatedMascot } from "./AnimatedMascot";

interface WelcomeScreenProps {
  onNavigate: (path: string) => void;
  activeEnfant: Enfant | null;
  lang: Language;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onNavigate,
  activeEnfant,
  lang
}) => {
  const mascot = getMascot(activeEnfant?.avatar || "leo");

  const [totalPoints, setTotalPoints] = useState(0);
  const [completedBadges, setCompletedBadges] = useState(0);
  const [rank, setRank] = useState("#1");
  const [activeTomeTitle, setActiveTomeTitle] = useState("Tome 1 : La Rencontre dans la Forêt");
  const [completedChapitres, setCompletedChapitres] = useState(0);
  const [totalChapitres, setTotalChapitres] = useState(8);
  const [progressPercent, setProgressPercent] = useState(0);

  useEffect(() => {
    async function loadData() {
      if (!activeEnfant) {
        setTotalPoints(0);
        setCompletedBadges(0);
        setRank("#1");
        setCompletedChapitres(0);
        setTotalChapitres(8);
        setProgressPercent(0);
        return;
      }

      const progs = await multiTomeService.getProgressionsByEnfant(activeEnfant.id);
      const pts = progs.reduce((sum, p) => sum + (p.points_gagnes || 0), 0);
      setTotalPoints(pts);
      setCompletedBadges(progs.length);

      const tomes = await multiTomeService.getTomes();
      const activeTome = tomes[0];
      if (activeTome) {
        setActiveTomeTitle(activeTome.titre);
        const chaps = await multiTomeService.getChapitresByTomeId(activeTome.id);
        const total = chaps.length || 8;
        setTotalChapitres(total);

        const completedInTome = chaps.filter((c) => progs.some((p) => p.chapitre_id === c.id)).length;
        setCompletedChapitres(completedInTome);
        const pct = total > 0 ? Math.round((completedInTome / total) * 100) : 0;
        setProgressPercent(pct);
      } else {
        const pct = Math.round((progs.length / 8) * 100);
        setCompletedChapitres(progs.length);
        setTotalChapitres(8);
        setProgressPercent(pct);
      }

      // Rank calculation
      const leaderboard = await multiTomeService.getLeaderboard("toutes");
      const myRankIdx = leaderboard.findIndex((item) => item.enfant.id === activeEnfant.id);
      if (myRankIdx >= 0) {
        setRank(`#${myRankIdx + 1}`);
      } else {
        setRank("#1");
      }
    }

    loadData();
  }, [activeEnfant?.id]);

  return (
    <div className="max-w-md mx-auto p-4 sm:p-6 pb-28 space-y-6">
      {/* CHILD GREETING BANNER */}
      <div className="bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-700 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        {/* Background Sparkles */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-amber-300/20 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-amber-300 text-emerald-950 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              {getTranslation(lang, "welcomeMessage")}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-fun tracking-wide">
              {activeEnfant ? activeEnfant.pseudo : "Petit Copain"} !
            </h1>
            <p className="text-emerald-100 text-xs mt-1 font-medium italic">
              "{mascot.quoteFr}"
            </p>
          </div>

          {/* Avatar Companion */}
          <div className="w-20 h-20 shrink-0 rounded-3xl bg-white/20 backdrop-blur-md p-1.5 border-2 border-amber-300 shadow-lg flex items-center justify-center relative overflow-hidden">
            {activeEnfant?.photo ? (
              <img src={activeEnfant.photo} alt={activeEnfant.pseudo} className="w-full h-full object-cover rounded-2xl" />
            ) : (
              <AnimatedMascot mascot={mascot} size="lg" animateType="celebrate" />
            )}
          </div>
        </div>

        {/* Quick Child Stats Row */}
        <div className="mt-5 grid grid-cols-3 gap-2 bg-emerald-950/40 backdrop-blur-md rounded-2xl p-3 border border-white/10 text-center">
          <div>
            <div className="text-[10px] text-emerald-200 font-bold uppercase">{getTranslation(lang, "totalPoints")}</div>
            <div className="text-lg font-black text-amber-300 flex items-center justify-center gap-1">
              ⭐ {totalPoints.toLocaleString()}
            </div>
          </div>
          <div className="border-x border-white/10">
            <div className="text-[10px] text-emerald-200 font-bold uppercase">{getTranslation(lang, "badges")}</div>
            <div className="text-lg font-black text-amber-300 flex items-center justify-center gap-1">
              🏅 {completedBadges}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-emerald-200 font-bold uppercase">{getTranslation(lang, "rank")}</div>
            <div className="text-lg font-black text-amber-300 flex items-center justify-center gap-1">
              🏆 {rank}
            </div>
          </div>
        </div>
      </div>

      {/* CENTRAL MAIN CTA: SCANNER MON QR CODE */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 via-emerald-500 to-amber-400 rounded-3xl blur-md opacity-75 group-hover:opacity-100 transition duration-500 animate-pulse" />
        <button
          onClick={() => onNavigate("/scan")}
          className="relative w-full bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-500 hover:to-yellow-500 text-amber-950 font-black p-5 rounded-3xl shadow-xl flex items-center justify-between border-4 border-amber-500/30 active:scale-98 transition-all"
        >
          <div className="flex items-center gap-4 text-left">
            <div className="w-14 h-14 rounded-2xl bg-amber-950 text-amber-300 flex items-center justify-center shadow-lg shrink-0">
              <QrCode className="w-8 h-8" />
            </div>
            <div>
              <span className="block text-xl font-extrabold font-fun uppercase tracking-tight">
                {getTranslation(lang, "scanQrBtn")}
              </span>
              <span className="text-xs font-semibold text-amber-900/90 block">
                Débloque ton défi en scannant ton livre !
              </span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-amber-950 text-amber-300 flex items-center justify-center shrink-0 shadow-md">
            <ArrowRight className="w-5 h-5" />
          </div>
        </button>
      </div>

      {/* ACTIVE TOME PROGRESS CARD */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 border-2 border-amber-200 dark:border-gray-700 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            <h2 className="font-bold text-gray-800 dark:text-gray-100 text-base font-fun">
              {getTranslation(lang, "currentTome")}
            </h2>
          </div>
          <span className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 px-3 py-1 rounded-full text-xs font-extrabold">
            {progressPercent}% Réussi
          </span>
        </div>

        <div className="bg-amber-50/80 dark:bg-gray-900/80 rounded-2xl p-4 border border-amber-200/60 dark:border-gray-700 mb-4">
          <h3 className="font-extrabold text-emerald-900 dark:text-emerald-200 text-base">
            {activeTomeTitle}
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Rejoins ton copain pour réparer la forêt et relever tous les défis magiques !
          </p>

          {/* Progress Bar */}
          <div className="mt-3">
            <div className="flex justify-between text-xs font-bold text-emerald-800 dark:text-emerald-300 mb-1">
              <span>{getTranslation(lang, "progress")}</span>
              <span>{completedChapitres} / {totalChapitres} Défi(s)</span>
            </div>
            <div className="w-full h-3.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden p-0.5 border border-emerald-300">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
              />
            </div>
          </div>
        </div>

        <button
          onClick={() => onNavigate("/parcours")}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 rounded-2xl text-sm flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
        >
          <Compass className="w-4 h-4" />
          Explorer la Carte du Parcours
        </button>
      </div>

      {/* QUICK SHORTCUTS GRID */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onNavigate("/classement")}
          className="bg-white dark:bg-gray-800 p-4 rounded-3xl border-2 border-amber-200 dark:border-gray-700 shadow-sm hover:border-amber-400 transition-all text-left flex flex-col justify-between"
        >
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mb-3">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-gray-800 dark:text-gray-100 text-sm font-fun">
              {getTranslation(lang, "navClassement")}
            </h4>
            <p className="text-[10px] text-gray-500 dark:text-gray-400">
              Voir le podium des champions
            </p>
          </div>
        </button>

        <button
          onClick={() =>
            onNavigate(activeEnfant ? `/certificat/tome-1/${activeEnfant.id}` : "/compte/enfants")
          }
          className="bg-white dark:bg-gray-800 p-4 rounded-3xl border-2 border-amber-200 dark:border-gray-700 shadow-sm hover:border-amber-400 transition-all text-left flex flex-col justify-between"
        >
          <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mb-3">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-gray-800 dark:text-gray-100 text-sm font-fun">
              Mes Diplômes
            </h4>
            <p className="text-[10px] text-gray-500 dark:text-gray-400">
              Télécharger tes certificats
            </p>
          </div>
        </button>
      </div>
    </div>
  );
};
