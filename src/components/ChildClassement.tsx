import React, { useEffect, useState } from "react";
import { Enfant, LeaderboardEntry, TrancheAge } from "../types/multiTome";
import { multiTomeService } from "../services/multiTomeService";
import { Trophy, ArrowLeft, Star, TrendingUp, Sparkles, Award } from "lucide-react";

interface ChildClassementProps {
  enfant: Enfant;
  onNavigate: (path: string) => void;
  lang: "fr" | "en";
}

export const ChildClassement: React.FC<ChildClassementProps> = ({
  enfant,
  onNavigate,
  lang
}) => {
  const [selectedAge, setSelectedAge] = useState<TrancheAge>(enfant.tranche_age || "5-6");
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    multiTomeService.getLeaderboard(selectedAge).then((data) => {
      setEntries(data);
      setLoading(false);
    });
  }, [selectedAge]);

  const currentChildEntry = entries.find((e) => e.enfant.id === enfant.id);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      
      {/* Back Button */}
      <button
        onClick={() => onNavigate(`/enfant/${enfant.id}/parcours`)}
        className="mb-6 flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-forest transition cursor-pointer"
      >
        <ArrowLeft size={16} />
        <span>{lang === "fr" ? "Retour au parcours" : "Back to path"}</span>
      </button>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 sm:p-8 rounded-3xl shadow-lg mb-8 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full">
            {lang === "fr" ? "Classement Équitable" : "Fair Leaderboard"}
          </span>
          <h1 className="text-2xl sm:text-3xl font-fun font-bold mt-2 mb-1">
            {lang === "fr" ? "Tableau d'Honneur de la Forêt" : "Forest Honor Board"}
          </h1>
          <p className="text-xs sm:text-sm text-blue-100">
            {lang === "fr"
              ? "Chaque tranche d'âge a son propre classement pour que tout le monde participe avec plaisir !"
              : "Each age group has its own leaderboard so everyone competes fairly!"}
          </p>
        </div>
        <div className="text-5xl sm:text-6xl select-none">
          🏆
        </div>
      </div>

      {/* Encouragement Card for active child */}
      {currentChildEntry && (
        <div className="bg-amber-100 dark:bg-amber-900/40 border-2 border-amber-300 dark:border-amber-700 p-4 sm:p-6 rounded-3xl shadow-md mb-8 flex items-center gap-4">
          <div className="text-4xl">🌟</div>
          <div className="text-left">
            <h3 className="text-base sm:text-lg font-bold text-amber-900 dark:text-amber-200">
              {lang === "fr"
                ? `Bravo ${enfant.pseudo} ! Tu es au rang #${currentChildEntry.rang} !`
                : `Great job ${enfant.pseudo}! You are rank #${currentChildEntry.rang}!`}
            </h3>
            <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-300">
              {lang === "fr"
                ? "Tu es dans le top de ta catégorie cette semaine ! Continue de résoudre les défis pour grimper encore plus haut !"
                : "You are at the top of your category this week! Keep solving challenges to climb even higher!"}
            </p>
          </div>
        </div>
      )}

      {/* Age Category Selector Filter */}
      <div className="flex justify-center gap-3 mb-8">
        {(["5-6", "6-7", "7-8"] as TrancheAge[]).map((age) => (
          <button
            key={age}
            onClick={() => setSelectedAge(age)}
            className={`px-5 py-2.5 rounded-2xl font-bold text-sm transition cursor-pointer min-h-[44px] ${
              selectedAge === age
                ? "bg-forest text-white shadow-md scale-105"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-warm-border hover:border-forest"
            }`}
          >
            <span>{age} ans</span>
          </button>
        ))}
      </div>

      {/* Leaderboard Table */}
      {loading ? (
        <div className="text-center py-12 text-gray-500 font-bold">
          {lang === "fr" ? "Calcul du classement..." : "Calculating scores..."}
        </div>
      ) : entries.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border-2 border-dashed border-warm-border text-center text-gray-500 font-bold">
          {lang === "fr" ? "Aucun aventurier dans cette catégorie pour le moment." : "No adventurers in this age group yet."}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-3xl border-2 border-warm-border shadow-xl overflow-hidden mb-8">
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {entries.map((entry) => {
              const isCurrentChild = entry.enfant.id === enfant.id;
              const rankMedal =
                entry.rang === 1 ? "🥇" : entry.rang === 2 ? "🥈" : entry.rang === 3 ? "🥉" : `#${entry.rang}`;

              return (
                <div
                  key={entry.enfant.id}
                  className={`p-4 sm:p-5 flex items-center justify-between gap-4 transition ${
                    isCurrentChild
                      ? "bg-amber-50 dark:bg-amber-900/30 border-l-8 border-amber-500 font-extrabold"
                      : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  }`}
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    {/* Rank Badge */}
                    <div className="w-10 h-10 rounded-2xl bg-warm-cream dark:bg-gray-700 flex items-center justify-center text-lg font-black text-gray-700 dark:text-gray-200 shadow-inner">
                      {rankMedal}
                    </div>

                    {/* Avatar & Pseudo */}
                    <div className="w-12 h-12 rounded-2xl bg-forest/10 dark:bg-forest/30 flex items-center justify-center text-2xl">
                      {entry.enfant.avatar === "leo"
                        ? "🦊"
                        : entry.enfant.avatar === "nina"
                        ? "🐭"
                        : entry.enfant.avatar === "darina"
                        ? "🦔"
                        : entry.enfant.avatar === "lana"
                        ? "🐦"
                        : "🌟"}
                    </div>

                    <div className="text-left">
                      <div className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
                        <span>{entry.enfant.pseudo}</span>
                        {isCurrentChild && (
                          <span className="bg-forest text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                            {lang === "fr" ? "C'est toi !" : "It's you!"}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {lang === "fr" ? `${entry.chapitres_valides} chapitres complétés` : `${entry.chapitres_valides} chapters completed`}
                      </div>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="text-right">
                    <div className="text-lg sm:text-xl font-black text-amber-600 dark:text-amber-400">
                      {entry.total_points} pts
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Ton Evolution Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border-2 border-warm-border shadow-md text-left">
        <h3 className="text-lg font-bold text-forest dark:text-forest-light flex items-center gap-2 mb-2">
          <TrendingUp size={20} />
          <span>{lang === "fr" ? "Ton Évolution" : "Your Progression"}</span>
        </h3>
        <p className="text-xs text-gray-500 mb-4">
          {lang === "fr"
            ? "Chaque semaine, ton travail porte ses fruits ! Continue ton bel effort."
            : "Every week, your hard work pays off! Keep up the great effort."}
        </p>

        <div className="bg-warm-cream/50 dark:bg-gray-700/50 p-4 rounded-2xl border border-warm-border flex items-center justify-around text-center">
          <div>
            <div className="text-2xl font-black text-forest dark:text-forest-light">
              {currentChildEntry?.chapitres_valides || 0}
            </div>
            <div className="text-[11px] font-bold text-gray-500 uppercase">{lang === "fr" ? "Défis Relevés" : "Challenges Met"}</div>
          </div>
          <div className="w-px h-8 bg-warm-border" />
          <div>
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
              {currentChildEntry?.total_points || 0}
            </div>
            <div className="text-[11px] font-bold text-gray-500 uppercase">{lang === "fr" ? "Points Cumulés" : "Total Score"}</div>
          </div>
        </div>
      </div>

    </div>
  );
};
