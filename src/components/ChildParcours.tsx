import React, { useEffect, useState } from "react";
import { Enfant, Tome, Chapitre, Progression } from "../types/multiTome";
import { multiTomeService } from "../services/multiTomeService";
import { Award, BookOpen, Trophy, Sparkles, CheckCircle, Lock, ArrowRight, Star } from "lucide-react";

interface ChildParcoursProps {
  enfant: Enfant;
  onNavigate: (path: string) => void;
  lang: "fr" | "en";
}

export const ChildParcours: React.FC<ChildParcoursProps> = ({
  enfant,
  onNavigate,
  lang
}) => {
  const [tomes, setTomes] = useState<Tome[]>([]);
  const [selectedTome, setSelectedTome] = useState<Tome | null>(null);
  const [chapitres, setChapitres] = useState<Chapitre[]>([]);
  const [progressions, setProgressions] = useState<Progression[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const allTomes = await multiTomeService.getTomes();
      const publishedTomes = allTomes.filter((t) => t.publie);
      setTomes(publishedTomes);

      const activeTome = publishedTomes[0] || null;
      setSelectedTome(activeTome);

      if (activeTome) {
        const chaps = await multiTomeService.getChapitresByTomeId(activeTome.id);
        setChapitres(chaps);
      }

      const progs = await multiTomeService.getProgressionsByEnfant(enfant.id);
      setProgressions(progs);

      setLoading(false);
    }
    loadData();
  }, [enfant.id]);

  const handleSelectTome = async (tome: Tome) => {
    setSelectedTome(tome);
    const chaps = await multiTomeService.getChapitresByTomeId(tome.id);
    setChapitres(chaps);
  };

  const totalPoints = progressions.reduce((sum, p) => sum + p.points_gagnes, 0);
  const completedChapIds = new Set(progressions.map((p) => p.chapitre_id));

  // Count magic words collected
  const completedChapters = chapitres.filter((c) => completedChapIds.has(c.id));
  const totalWords = completedChapters.reduce((acc, c) => acc + (c.mots_secrets?.length || 0), 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      
      {/* Top Child Header */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border-2 border-warm-border shadow-md mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-amber-100 dark:bg-amber-900/40 border-2 border-amber-300 flex items-center justify-center text-4xl shadow-inner">
            {enfant.avatar === "leo"
              ? "🦊"
              : enfant.avatar === "nina"
              ? "🐭"
              : enfant.avatar === "darina"
              ? "🦔"
              : enfant.avatar === "lana"
              ? "🐦"
              : "🌟"}
          </div>
          <div className="text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
              {lang === "fr" ? "Aventurier actif" : "Active Adventurer"}
            </span>
            <h1 className="text-2xl font-fun font-bold text-forest dark:text-forest-light">
              {enfant.pseudo}
            </h1>
            <p className="text-xs text-gray-500">
              {lang === "fr" ? `Catégorie : ${enfant.tranche_age} ans` : `Category: ${enfant.tranche_age} years`}
            </p>
          </div>
        </div>

        {/* Quick Stats Badges */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          
          <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700/50 px-3 py-2 rounded-2xl flex items-center gap-2">
            <Star className="text-amber-500 fill-amber-500" size={20} />
            <div className="text-left">
              <div className="text-[10px] text-gray-500 uppercase font-bold">{lang === "fr" ? "Points" : "Points"}</div>
              <div className="text-base font-extrabold text-amber-700 dark:text-amber-300 leading-none">{totalPoints} pts</div>
            </div>
          </div>

          <button
            onClick={() => onNavigate(`/enfant/${enfant.id}/mots-magiques`)}
            className="bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700/50 px-3 py-2 rounded-2xl flex items-center gap-2 hover:bg-emerald-100 transition cursor-pointer"
          >
            <BookOpen className="text-emerald-600" size={20} />
            <div className="text-left">
              <div className="text-[10px] text-gray-500 uppercase font-bold">{lang === "fr" ? "Mots" : "Words"}</div>
              <div className="text-base font-extrabold text-emerald-700 dark:text-emerald-300 leading-none">{totalWords}</div>
            </div>
          </button>

          <button
            onClick={() => onNavigate(`/enfant/${enfant.id}/badges`)}
            className="bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-700/50 px-3 py-2 rounded-2xl flex items-center gap-2 hover:bg-purple-100 transition cursor-pointer"
          >
            <Award className="text-purple-600" size={20} />
            <div className="text-left">
              <div className="text-[10px] text-gray-500 uppercase font-bold">{lang === "fr" ? "Badges" : "Badges"}</div>
              <div className="text-base font-extrabold text-purple-700 dark:text-purple-300 leading-none">{completedChapters.length}</div>
            </div>
          </button>

          <button
            onClick={() => onNavigate(`/enfant/${enfant.id}/classement`)}
            className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700/50 px-3 py-2 rounded-2xl flex items-center gap-2 hover:bg-blue-100 transition cursor-pointer"
          >
            <Trophy className="text-blue-600" size={20} />
            <div className="text-left">
              <div className="text-[10px] text-gray-500 uppercase font-bold">{lang === "fr" ? "Rang" : "Rank"}</div>
              <div className="text-base font-extrabold text-blue-700 dark:text-blue-300 leading-none">🏆</div>
            </div>
          </button>

        </div>

      </div>

      {/* Tome Selector Tabs */}
      <div className="flex items-center justify-center gap-3 mb-8 overflow-x-auto pb-2">
        {tomes.map((tome) => {
          const isSelected = selectedTome?.id === tome.id;
          return (
            <button
              key={tome.id}
              onClick={() => handleSelectTome(tome)}
              style={{
                borderColor: isSelected ? tome.couleur_theme : "transparent"
              }}
              className={`px-5 py-3 rounded-2xl font-bold text-sm sm:text-base border-4 transition-all shadow-md cursor-pointer whitespace-nowrap min-h-[48px] flex items-center gap-2 ${
                isSelected
                  ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-lg scale-105"
                  : "bg-white/70 dark:bg-gray-800/70 text-gray-600 dark:text-gray-300 hover:bg-white"
              }`}
            >
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: tome.couleur_theme }} />
              <span>{tome.titre}</span>
            </button>
          );
        })}
      </div>

      {/* Main Path Map */}
      {selectedTome && (
        <div
          className="bg-white dark:bg-gray-800 p-6 sm:p-10 rounded-3xl border-2 border-warm-border shadow-xl relative overflow-hidden"
          style={{
            borderTop: `8px solid ${selectedTome.couleur_theme}`
          }}
        >
          <div className="mb-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-fun font-bold text-forest dark:text-forest-light">
              {selectedTome.titre}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              {selectedTome.description}
            </p>
          </div>

          {/* Chapter Path List */}
          {loading ? (
            <div className="py-12 text-center text-gray-500 font-bold">
              {lang === "fr" ? "Chargement des chapitres..." : "Loading chapters..."}
            </div>
          ) : chapitres.length === 0 ? (
            <div className="py-12 text-center text-gray-500 font-bold">
              {lang === "fr" ? "Aucun chapitre disponible dans ce tome." : "No chapters available in this volume."}
            </div>
          ) : (
            <div className="space-y-6 relative before:absolute before:left-7 sm:before:left-10 before:top-8 before:bottom-8 before:w-1.5 before:bg-warm-border dark:before:bg-gray-700 before:z-0">
              {chapitres.map((chap, idx) => {
                const isCompleted = completedChapIds.has(chap.id);
                // Next playable chapter is the first uncompleted one or if previous is completed
                const isPreviousCompleted = idx === 0 || completedChapIds.has(chapitres[idx - 1].id);
                const isPlayable = !isCompleted && isPreviousCompleted;

                const prog = progressions.find((p) => p.chapitre_id === chap.id);

                return (
                  <div
                    key={chap.id}
                    className={`relative z-10 flex items-center justify-between gap-4 p-4 sm:p-6 rounded-2xl border-2 transition-all ${
                      isCompleted
                        ? "bg-emerald-50/80 dark:bg-emerald-900/20 border-emerald-300 shadow-sm"
                        : isPlayable
                        ? "bg-amber-50 dark:bg-amber-900/30 border-amber-400 shadow-md ring-4 ring-amber-400/20 scale-[1.02]"
                        : "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 opacity-60"
                    }`}
                  >
                    {/* Chapter Node Badge */}
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center font-black text-lg sm:text-xl text-white shadow-md flex-shrink-0 ${
                          isCompleted
                            ? "bg-emerald-600"
                            : isPlayable
                            ? "bg-amber-500 animate-pulse"
                            : "bg-gray-400 dark:bg-gray-600"
                        }`}
                        style={{
                          backgroundColor: isCompleted ? "#059669" : isPlayable ? chap.couleur || "#d97706" : undefined
                        }}
                      >
                        {isCompleted ? (
                          <CheckCircle size={28} />
                        ) : isPlayable ? (
                          <span>{chap.numero}</span>
                        ) : (
                          <Lock size={22} />
                        )}
                      </div>

                      <div className="text-left">
                        <div className="text-xs font-bold text-gray-500 uppercase">
                          {lang === "fr" ? `Chapitre ${chap.numero}` : `Chapter ${chap.numero}`}
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-gray-800 dark:text-gray-100">
                          {chap.titre}
                        </h3>
                        {isCompleted && (
                          <div className="text-xs text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
                            <Sparkles size={12} />
                            <span>
                              {lang === "fr" ? `Validé (+${prog?.points_gagnes || chap.points} pts)` : `Completed (+${prog?.points_gagnes || chap.points} pts)`}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Play / Replay Button */}
                    <div>
                      <button
                        onClick={() => onNavigate(`/defi/${selectedTome.slug}/${chap.slug}`)}
                        disabled={!isPlayable && !isCompleted}
                        className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer min-h-[40px] ${
                          isCompleted
                            ? "bg-white dark:bg-gray-700 text-emerald-700 dark:text-emerald-300 border border-emerald-300 hover:bg-emerald-100"
                            : isPlayable
                            ? "bg-forest hover:bg-forest-light text-white shadow-md text-base px-6 py-3"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        <span>
                          {isCompleted
                            ? (lang === "fr" ? "Rejouer 🔄" : "Replay 🔄")
                            : isPlayable
                            ? (lang === "fr" ? "Lancer le défi 🎯" : "Start Challenge 🎯")
                            : (lang === "fr" ? "Verrouillé 🔒" : "Locked 🔒")}
                        </span>
                        {isPlayable && <ArrowRight size={18} />}
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

    </div>
  );
};
