import React, { useEffect, useState } from "react";
import { Enfant, Progression, Chapitre, Tome } from "../types/multiTome";
import { multiTomeService } from "../services/multiTomeService";
import { Award, ArrowLeft, Lock, Sparkles } from "lucide-react";
import { AnimatedMascot } from "./AnimatedMascot";

interface ChildBadgesProps {
  enfant: Enfant;
  onNavigate: (path: string) => void;
  lang: "fr" | "en";
}

export const ChildBadges: React.FC<ChildBadgesProps> = ({
  enfant,
  onNavigate,
  lang
}) => {
  const [progressions, setProgressions] = useState<Progression[]>([]);
  const [allChapitres, setAllChapitres] = useState<Chapitre[]>([]);
  const [tomes, setTomes] = useState<Tome[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const allT = await multiTomeService.getTomes();
      setTomes(allT);

      let chaps: Chapitre[] = [];
      for (const t of allT) {
        const cList = await multiTomeService.getChapitresByTomeId(t.id);
        chaps = [...chaps, ...cList];
      }
      setAllChapitres(chaps);

      const progs = await multiTomeService.getProgressionsByEnfant(enfant.id);
      setProgressions(progs);

      setLoading(false);
    }
    load();
  }, [enfant.id]);

  const completedIds = new Set(progressions.map((p) => p.chapitre_id));

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      
      {/* Back Button */}
      <button
        onClick={() => onNavigate("/parcours")}
        className="mb-6 flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-forest transition cursor-pointer"
      >
        <ArrowLeft size={16} />
        <span>{lang === "fr" ? "Retour au parcours" : "Back to path"}</span>
      </button>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 sm:p-8 rounded-3xl shadow-lg mb-8 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full">
            {lang === "fr" ? "Récompenses" : "Rewards"}
          </span>
          <h1 className="text-2xl sm:text-3xl font-fun font-bold mt-2 mb-1">
            {lang === "fr" ? `Galerie de médailles de ${enfant.pseudo}` : `${enfant.pseudo}'s Medal Gallery`}
          </h1>
          <p className="text-xs sm:text-sm text-purple-100">
            {lang === "fr"
              ? "Chaque chapitre réussi te débloque un badge d'honneur !"
              : "Each completed chapter unlocks an honor badge!"}
          </p>
        </div>
        <div className="w-16 h-18 relative overflow-visible shrink-0">
          <AnimatedMascot avatarId={enfant.avatar} size="md" popOutOfFrame={true} animateType="bounce" />
        </div>
      </div>

      {/* Badges Grid */}
      {loading ? (
        <div className="text-center py-12 text-gray-500 font-bold">
          {lang === "fr" ? "Chargement des médailles..." : "Loading medals..."}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
          {allChapitres.map((chap) => {
            const isUnlocked = completedIds.has(chap.id);
            const tome = tomes.find((t) => t.id === chap.tome_id);

            return (
              <div
                key={chap.id}
                className={`p-5 rounded-3xl border-2 text-center transition flex flex-col items-center justify-between shadow-md ${
                  isUnlocked
                    ? "bg-white dark:bg-gray-800 border-amber-300 dark:border-amber-700/60 ring-2 ring-amber-300/30"
                    : "bg-gray-100 dark:bg-gray-800/40 border-gray-200 dark:border-gray-700 opacity-50"
                }`}
              >
                <div className="mb-2">
                  <div
                    className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-3xl mb-2 shadow-inner ${
                      isUnlocked
                        ? "bg-gradient-to-br from-amber-300 to-amber-500 text-white"
                        : "bg-gray-300 dark:bg-gray-700 text-gray-500"
                    }`}
                  >
                    {isUnlocked ? "🏆" : <Lock size={24} />}
                  </div>
                  <div className="text-[10px] font-bold uppercase text-gray-400">
                    {tome ? tome.titre : `Chapitre ${chap.numero}`}
                  </div>
                  <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 line-clamp-1">
                    {chap.titre}
                  </h3>
                </div>

                <div className="w-full pt-2 border-t border-gray-100 dark:border-gray-700">
                  {isUnlocked ? (
                    <span className="inline-block bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                      ✨ Débloqué (+{chap.points} pts)
                    </span>
                  ) : (
                    <span className="inline-block bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                      🔒 Verrouillé
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
