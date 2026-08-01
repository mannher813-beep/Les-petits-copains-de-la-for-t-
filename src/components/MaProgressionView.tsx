import React, { useEffect, useState } from "react";
import { Enfant, Tome, Progression } from "../types/multiTome";
import { multiTomeService } from "../services/multiTomeService";
import { ArrowLeft, Globe, Trophy, Target, Lock, Sparkles, Star } from "lucide-react";
import { Language, getTranslation } from "../i18n/translations";
import { getMascot } from "../types/mascots";

interface MaProgressionViewProps {
  enfant: Enfant;
  onNavigate: (path: string) => void;
  lang: Language;
}

export const MaProgressionView: React.FC<MaProgressionViewProps> = ({
  enfant,
  onNavigate,
  lang
}) => {
  const [tomes, setTomes] = useState<Tome[]>([]);
  const [progressions, setProgressions] = useState<Progression[]>([]);
  const [tomeProgresses, setTomeProgresses] = useState<{ title: string; percent: number; isLocked: boolean; color: string }[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [defisCompleted, setDefisCompleted] = useState(0);
  const [defisTotal, setDefisTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const mascot = getMascot(enfant.avatar || "leo");

  useEffect(() => {
    async function load() {
      setLoading(true);
      const allTomes = await multiTomeService.getTomes();
      setTomes(allTomes);

      const progs = await multiTomeService.getProgressionsByEnfant(enfant.id);
      setProgressions(progs);

      const completedChapIds = new Set(progs.map((p) => p.chapitre_id));
      const calculatedPoints = progs.reduce((sum, p) => sum + (p.points_gagnes || 0), 0);
      setTotalPoints(calculatedPoints);
      setDefisCompleted(progs.length);

      let totalChapCount = 0;
      const progresses: { title: string; percent: number; isLocked: boolean; color: string }[] = [];

      for (let i = 0; i < allTomes.length; i++) {
        const t = allTomes[i];
        const chaps = await multiTomeService.getChapitresByTomeId(t.id);
        totalChapCount += chaps.length;

        const completedInTome = chaps.filter((c) => completedChapIds.has(c.id)).length;
        const percent = chaps.length > 0 ? Math.round((completedInTome / chaps.length) * 100) : 0;
        const isLocked = !t.publie;

        const colors = [
          "from-emerald-500 to-lime-400",
          "from-amber-500 to-yellow-400",
          "from-purple-500 to-indigo-400"
        ];

        progresses.push({
          title: t.titre,
          percent,
          isLocked,
          color: colors[i % colors.length]
        });
      }

      setDefisTotal(totalChapCount);
      setTomeProgresses(progresses);
      setLoading(false);
    }
    load();
  }, [enfant.id]);

  return (
    <div className="max-w-md mx-auto p-4 sm:p-6 pb-28 space-y-5 animate-fade-in">
      {/* TOP HEADER */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => onNavigate("/parcours")}
          className="p-2.5 rounded-2xl bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 shadow-xs hover:scale-105 transition-transform"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h1 className="text-xl font-black font-fun text-gray-800 dark:text-gray-100">
          Ma progression
        </h1>

        <span
          className="flex items-center gap-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 px-2.5 py-1 rounded-full text-xs font-bold shadow-xs"
        >
          <Globe className="w-3.5 h-3.5 text-emerald-600" />
          <span className="uppercase">{lang}</span>
        </span>
      </div>

      {/* CHILD PROFILE BANNER (Matching Screen 7) */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-5 text-white shadow-xl flex items-center gap-4 relative overflow-hidden">
        <div className="w-16 h-16 rounded-2xl bg-white/20 p-1 border-2 border-white/30 shrink-0 shadow-md">
          <img src={mascot.image} alt={mascot.name} className="w-full h-full object-contain" />
        </div>

        <div className="flex-1">
          <span className="bg-amber-300 text-amber-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Niveau {Math.floor(totalPoints / 50) + 1}
          </span>
          <h2 className="text-xl font-black font-fun mt-1">
            {enfant.pseudo}
          </h2>
          <p className="text-xs text-emerald-100 font-medium">
            Niveau actuel : Explorateur
          </p>
        </div>
      </div>

      {/* STAT BOXES ROW */}
      <div className="grid grid-cols-2 gap-3">
        {/* STAT 1: POINTS TOTAUX */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-4 border-2 border-amber-200 dark:border-gray-700 shadow-md flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 text-xl border border-amber-300">
            🏆
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 block">
              Points totaux
            </span>
            <span className="text-lg font-black text-gray-800 dark:text-gray-100">
              {totalPoints.toLocaleString()}
            </span>
          </div>
        </div>

        {/* STAT 2: DÉFIS RÉUSSIS */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-4 border-2 border-emerald-200 dark:border-gray-700 shadow-md flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 text-xl border border-emerald-300">
            🎯
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 block">
              Défis réussis
            </span>
            <span className="text-lg font-black text-gray-800 dark:text-gray-100">
              {defisCompleted} / {defisTotal}
            </span>
          </div>
        </div>
      </div>

      {/* TOME PROGRESSION LIST */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 border-2 border-amber-200 dark:border-gray-700 shadow-md space-y-4">
        <h3 className="text-xs font-black uppercase text-gray-500 dark:text-gray-400">
          Progression par Tome
        </h3>

        <div className="space-y-4">
          {tomeProgresses.map((item, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border-2 space-y-2 ${
                item.isLocked
                  ? "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 opacity-60"
                  : "bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800"
              }`}
            >
              <div className="flex items-center justify-between text-xs font-extrabold text-gray-800 dark:text-gray-100">
                <span className="flex items-center gap-1.5">
                  {item.isLocked && <Lock className="w-3.5 h-3.5 text-gray-400" />}
                  {item.title}
                </span>
                <span className="text-emerald-700 dark:text-emerald-300 font-black">
                  {item.percent}%
                </span>
              </div>

              <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden p-0.5">
                <div
                  className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-500`}
                  style={{ width: `${item.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
