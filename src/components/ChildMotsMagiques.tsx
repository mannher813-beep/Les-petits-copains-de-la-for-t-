import React, { useEffect, useState } from "react";
import { Enfant, Progression, Chapitre } from "../types/multiTome";
import { multiTomeService } from "../services/multiTomeService";
import { ArrowLeft, BookOpen, Sparkles, Key } from "lucide-react";

interface ChildMotsMagiquesProps {
  enfant: Enfant;
  onNavigate: (path: string) => void;
  lang: "fr" | "en";
}

export const ChildMotsMagiques: React.FC<ChildMotsMagiquesProps> = ({
  enfant,
  onNavigate,
  lang
}) => {
  const [motsCollectes, setMotsCollectes] = useState<{ mot: string; chapitreTitre: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const progs = await multiTomeService.getProgressionsByEnfant(enfant.id);
      const completedChapIds = new Set(progs.map((p) => p.chapitre_id));

      const allTomes = await multiTomeService.getTomes();
      let collectes: { mot: string; chapitreTitre: string }[] = [];

      for (const t of allTomes) {
        const chaps = await multiTomeService.getChapitresByTomeId(t.id);
        for (const c of chaps) {
          if (completedChapIds.has(c.id) && c.mots_secrets) {
            c.mots_secrets.forEach((m) => {
              collectes.push({ mot: m, chapitreTitre: c.titre });
            });
          }
        }
      }

      setMotsCollectes(collectes);
      setLoading(false);
    }
    load();
  }, [enfant.id]);

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
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6 sm:p-8 rounded-3xl shadow-lg mb-8 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full">
            {lang === "fr" ? "Carnet d'indices" : "Index of Indices"}
          </span>
          <h1 className="text-2xl sm:text-3xl font-fun font-bold mt-2 mb-1">
            {lang === "fr" ? `Les Mots Magiques de ${enfant.pseudo}` : `${enfant.pseudo}'s Magic Words`}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100">
            {lang === "fr"
              ? "Tous les mots secrets récoltés pendant ton voyage dans la forêt !"
              : "All the secret words collected during your forest adventure!"}
          </p>
        </div>
        <div className="text-5xl sm:text-6xl select-none">
          📖
        </div>
      </div>

      {/* Mots List Grid */}
      {loading ? (
        <div className="text-center py-12 text-gray-500 font-bold">
          {lang === "fr" ? "Ouverture du carnet..." : "Opening notebook..."}
        </div>
      ) : motsCollectes.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border-2 border-dashed border-warm-border text-center">
          <div className="text-5xl mb-3">🗝️</div>
          <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200 mb-2">
            {lang === "fr" ? "Aucun mot magique collecté pour l'instant" : "No magic words collected yet"}
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            {lang === "fr"
              ? "Résous les défis du parcours pour remplir ton carnet de mots secrets !"
              : "Solve challenges along the path to fill your magic notebook!"}
          </p>
          <button
            onClick={() => onNavigate(`/enfant/${enfant.id}/parcours`)}
            className="bg-forest text-white font-bold px-6 py-3 rounded-2xl shadow-md hover:bg-forest-light transition"
          >
            {lang === "fr" ? "Commencer un défi" : "Start a Challenge"}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {motsCollectes.map((item, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-gray-800 p-4 rounded-2xl border-2 border-emerald-200 dark:border-emerald-700/50 shadow-md text-center hover:scale-105 transition"
            >
              <div className="text-2xl mb-1">✨</div>
              <div className="text-xl font-handwriting font-extrabold text-forest dark:text-forest-light tracking-widest mb-1">
                {item.mot}
              </div>
              <div className="text-[10px] text-gray-400 dark:text-gray-400 line-clamp-1">
                {item.chapitreTitre}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
