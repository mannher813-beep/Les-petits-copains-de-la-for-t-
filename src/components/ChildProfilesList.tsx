import React, { useEffect, useState } from "react";
import { Enfant } from "../types/multiTome";
import { multiTomeService } from "../services/multiTomeService";
import { UserPlus, Sparkles, Map, Trophy, Award, BookOpen } from "lucide-react";

interface ChildProfilesListProps {
  onNavigate: (path: string) => void;
  onSelectEnfant: (enfant: Enfant) => void;
  activeEnfantId?: string;
  lang: "fr" | "en";
}

const AVATAR_EMOJIS: Record<string, string> = {
  leo: "🦊 Léo le renard",
  nina: "🐭 Nina la souris",
  darina: "🦔 Darina la hérissonne",
  lana: "🐦 Lana l'oiseau",
  squirrel: "🐿️ Samy l'écureuil",
  chouette: "🦉 Chloé la chouette",
  ourson: "🐻 Barnabé l'ourson"
};

export const ChildProfilesList: React.FC<ChildProfilesListProps> = ({
  onNavigate,
  onSelectEnfant,
  activeEnfantId,
  lang
}) => {
  const [enfants, setEnfants] = useState<Enfant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    multiTomeService.getEnfantsByParent().then((data) => {
      setEnfants(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-forest to-forest-light text-white p-6 sm:p-8 rounded-3xl shadow-lg mb-8 relative overflow-hidden">
        <div className="relative z-10">
          <span className="text-xs font-bold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full">
            {lang === "fr" ? "Espace Famille" : "Family Hub"}
          </span>
          <h1 className="text-2xl sm:text-4xl font-fun font-bold mt-2 mb-2">
            {lang === "fr" ? "Profils de tes petits aventuriers" : "Your Little Adventurers"}
          </h1>
          <p className="text-sm sm:text-base text-white/90 max-w-xl">
            {lang === "fr"
              ? "Chaque enfant a son propre carnet, son classement par tranche d'âge et sa collection de médailles !"
              : "Each child has their own workbook, age-filtered leaderboard, and medal collection!"}
          </p>
        </div>
        <div className="absolute right-4 bottom-0 text-7xl opacity-20 select-none">
          🦊🐭🦔
        </div>
      </div>

      {/* Action Button: Add Child */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-forest dark:text-forest-light flex items-center gap-2">
          <span>👶</span> {lang === "fr" ? "Liste des enfants enregistrés" : "Registered children"}
        </h2>
        <button
          onClick={() => onNavigate("/compte/enfants/nouveau")}
          className="bg-forest hover:bg-forest-light text-white font-bold px-4 py-2.5 rounded-2xl shadow-md transition flex items-center gap-2 min-h-[44px] cursor-pointer"
        >
          <UserPlus size={18} />
          <span>{lang === "fr" ? "Nouveau profil enfant" : "Add Child Profile"}</span>
        </button>
      </div>

      {/* Profiles Grid */}
      {loading ? (
        <div className="text-center py-12 text-gray-500 font-bold">
          {lang === "fr" ? "Chargement des profils..." : "Loading profiles..."}
        </div>
      ) : enfants.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border-2 border-dashed border-warm-border text-center">
          <div className="text-5xl mb-4">🌟</div>
          <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200 mb-2">
            {lang === "fr" ? "Aucun profil enfant créé pour l'instant" : "No child profile created yet"}
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            {lang === "fr"
              ? "Crée un profil avec un pseudonyme (sans vrai nom) et choisis une mascotte pour démarrer !"
              : "Create a profile with a nickname (no real names) and pick a mascot to get started!"}
          </p>
          <button
            onClick={() => onNavigate("/compte/enfants/nouveau")}
            className="bg-forest text-white font-bold px-6 py-3 rounded-2xl shadow-md hover:bg-forest-light transition"
          >
            {lang === "fr" ? "Créer un profil enfant" : "Create Child Profile"}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {enfants.map((enfant) => {
            const isActive = activeEnfantId === enfant.id;
            return (
              <div
                key={enfant.id}
                className={`bg-white dark:bg-gray-800 rounded-3xl p-6 border-4 transition-all shadow-md relative flex flex-col justify-between ${
                  isActive
                    ? "border-forest ring-4 ring-forest/20 dark:ring-forest/40"
                    : "border-transparent hover:border-warm-border"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-warm-cream dark:bg-gray-700 border-2 border-warm-border flex items-center justify-center text-3xl shadow-inner">
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
                        <h3 className="text-xl font-bold text-forest dark:text-forest-light">
                          {enfant.pseudo}
                        </h3>
                        <span className="inline-block bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 text-xs font-bold px-2.5 py-0.5 rounded-full mt-0.5">
                          {lang === "fr" ? `Tranche : ${enfant.tranche_age} ans` : `Age group: ${enfant.tranche_age}`}
                        </span>
                      </div>
                    </div>
                    {isActive && (
                      <span className="bg-forest text-white text-xs font-black px-2.5 py-1 rounded-full shadow-sm">
                        {lang === "fr" ? "Actif" : "Active"}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-gray-500 dark:text-gray-400 text-left mb-4">
                    {AVATAR_EMOJIS[enfant.avatar] || "Mascotte de la forêt"}
                  </p>
                </div>

                {/* Quick Action Navigation Buttons for this Child */}
                <div className="pt-4 border-t border-gray-100 dark:border-gray-700 grid grid-cols-3 gap-2">
                  <button
                    onClick={() => {
                      onSelectEnfant(enfant);
                      onNavigate(`/enfant/${enfant.id}/parcours`);
                    }}
                    className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-2 rounded-xl text-xs flex items-center justify-center gap-1 shadow-sm transition"
                  >
                    <Map size={14} />
                    <span>{lang === "fr" ? "Parcours" : "Path"}</span>
                  </button>

                  <button
                    onClick={() => {
                      onSelectEnfant(enfant);
                      onNavigate(`/enfant/${enfant.id}/badges`);
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-2 rounded-xl text-xs flex items-center justify-center gap-1 shadow-sm transition"
                  >
                    <Award size={14} />
                    <span>{lang === "fr" ? "Badges" : "Badges"}</span>
                  </button>

                  <button
                    onClick={() => {
                      onSelectEnfant(enfant);
                      onNavigate(`/enfant/${enfant.id}/classement`);
                    }}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-2 rounded-xl text-xs flex items-center justify-center gap-1 shadow-sm transition"
                  >
                    <Trophy size={14} />
                    <span>{lang === "fr" ? "Score" : "Ranks"}</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
