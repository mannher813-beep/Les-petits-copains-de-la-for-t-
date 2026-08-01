import React, { useEffect, useState } from "react";
import { Enfant, Tome, Chapitre, Progression } from "../types/multiTome";
import { multiTomeService } from "../services/multiTomeService";
import { ArrowLeft, Globe, Lock, Check, Gift, Star, Sparkles, Play, Award, ChevronRight, Compass, ShieldCheck, X } from "lucide-react";
import { Language, getTranslation } from "../i18n/translations";
import { getMascot } from "../types/mascots";
import { AnimatedMascot } from "./AnimatedMascot";

interface ChildParcoursProps {
  enfant: Enfant;
  onNavigate: (path: string) => void;
  lang: Language;
}

interface BiomeLandmark {
  nameFr: string;
  nameEn: string;
  emoji: string;
  x: number; // percentage
  y: number; // px
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
  const [activeNodeModal, setActiveNodeModal] = useState<number | null>(null);
  const mascot = getMascot(enfant.avatar || "leo");

  // Load data
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const allTomes = await multiTomeService.getTomes();
      setTomes(allTomes);
      const activeTome = allTomes[0] || null;
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
    setActiveNodeModal(null);
  };

  const completedChapIds = new Set(progressions.map((p) => p.chapitre_id));

  // Determine current unlocked level (1..8)
  const currentUnlockedStep = Math.min(completedChapIds.size + 1, 8);

  // 8 S-Curved Node Positions (percentages & pixels)
  const nodePositions = [
    { x: 30, y: 70, label: "Clairière de départ", emoji: "🌲" },
    { x: 72, y: 150, label: "Le Grand Chêne", emoji: "🌳" },
    { x: 78, y: 240, label: "Le Barrage du Castor", emoji: "🦫" },
    { x: 48, y: 320, label: "Ruisseau Enchanté", emoji: "🌊" },
    { x: 22, y: 400, label: "Vallée des Champignons", emoji: "🍄" },
    { x: 45, y: 485, label: "La Cabane Cachée", emoji: "🏡" },
    { x: 75, y: 565, label: "Sentier des Étoiles", emoji: "✨" },
    { x: 50, y: 645, label: "Le Sommet Magique", emoji: "🏰" }
  ];

  // Map world themes per tome
  const getWorldTheme = () => {
    if (!selectedTome) return { bg: "from-emerald-400 via-emerald-500 to-teal-600", border: "border-emerald-600", path: "#34d399", name: "Forêt Enchantée" };
    if (selectedTome.slug === "tome-2") {
      return { bg: "from-amber-400 via-orange-500 to-amber-700", border: "border-amber-600", path: "#fbbf24", name: "Vallée d'Automne" };
    }
    if (selectedTome.slug === "tome-3") {
      return { bg: "from-indigo-500 via-purple-600 to-sky-700", border: "border-indigo-600", path: "#a78bfa", name: "Royaume des Étoiles" };
    }
    return { bg: "from-emerald-400 via-emerald-500 to-teal-600", border: "border-emerald-600", path: "#34d399", name: "Forêt Enchantée" };
  };

  const worldTheme = getWorldTheme();

  // Selected chapter for modal preview
  const selectedModalChap = activeNodeModal
    ? chapitres.find((c) => c.numero === activeNodeModal) || {
        id: `c${activeNodeModal}`,
        tome_id: selectedTome?.id || "t1",
        slug: `chapitre-${activeNodeModal}`,
        numero: activeNodeModal,
        titre: `Chapitre ${activeNodeModal} : ${nodePositions[activeNodeModal - 1]?.label || "Le Défi"}`,
        question_defi: "Réponds au défi interactif et gagne des pommes d'or !",
        type_reponse: "choix_multiple",
        mots_secrets: ["FORET"],
        points: 100 * activeNodeModal
      }
    : null;

  const totalSteps = 8;
  const progressPercent = Math.round(((currentUnlockedStep - 1) / totalSteps) * 100);

  return (
    <div className="max-w-md mx-auto p-4 sm:p-6 pb-28 space-y-4 animate-fade-in">
      {/* TOP HEADER */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={() => onNavigate("/")}
          className="p-2.5 rounded-2xl bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 shadow-xs hover:scale-105 transition-transform cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="text-center">
          <div className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider mb-0.5">
            <Compass className="w-3 h-3 text-amber-600" />
            <span>Monde Interactif</span>
          </div>
          <h1 className="text-base font-black font-fun text-gray-800 dark:text-gray-100 leading-tight">
            {selectedTome ? selectedTome.titre.split("-")[0].trim() : "Tome 1"} - {worldTheme.name}
          </h1>
        </div>

        <span
          className="flex items-center gap-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 px-2.5 py-1.5 rounded-2xl text-xs font-bold shadow-xs"
        >
          <Globe className="w-3.5 h-3.5 text-emerald-600" />
          <span className="uppercase">{lang}</span>
        </span>
      </div>

      {/* TOME / WORLD SELECTOR TABS */}
      <div className="flex gap-1.5 bg-gray-100 dark:bg-gray-800/80 p-1.5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-inner">
        {tomes.map((t, idx) => {
          const isSelected = selectedTome?.id === t.id;
          const icons = ["🌲", "🏡", "🐾"];
          return (
            <button
              key={t.id}
              onClick={() => handleSelectTome(t)}
              className={`flex-1 py-2 px-1 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 cursor-pointer ${
                isSelected
                  ? "bg-white dark:bg-gray-700 text-emerald-900 dark:text-white shadow-md border border-emerald-300 scale-102"
                  : "text-gray-500 hover:text-gray-800 dark:text-gray-400"
              }`}
            >
              <span className="text-sm">{icons[idx] || "📖"}</span>
              <span className="truncate max-w-[80px]">Tome {idx + 1}</span>
            </button>
          );
        })}
      </div>

      {/* WORLD MAP CANVAS CONTAINER */}
      <div className={`bg-gradient-to-b ${worldTheme.bg} rounded-3xl p-4 sm:p-6 border-4 ${worldTheme.border} shadow-2xl relative min-h-[730px] overflow-hidden`}>
        {/* PARCHMENT TEXTURE OVERLAY */}
        <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />

        {/* FLOATING CLOUDS / PARTICLES DECORATION */}
        <div className="absolute top-4 left-3 text-3xl opacity-85 animate-pulse pointer-events-none">☁️</div>
        <div className="absolute top-12 right-6 text-3xl opacity-80 pointer-events-none">🌲</div>
        <div className="absolute top-52 left-2 text-2xl opacity-80 pointer-events-none">🦋</div>
        <div className="absolute top-80 right-4 text-3xl opacity-80 pointer-events-none">🍄</div>
        <div className="absolute top-[430px] left-5 text-2xl opacity-80 pointer-events-none">🌸</div>
        <div className="absolute top-[580px] right-8 text-3xl opacity-85 pointer-events-none">✨</div>
        <div className="absolute bottom-16 left-4 text-3xl opacity-80 pointer-events-none">🌳</div>

        {/* SVG SMOOTH WINDING ROAD PATH */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 730" preserveAspectRatio="none">
          {/* Path Shadow / Outer Border */}
          <path
            d="M 30 70 Q 82 110 72 150 T 78 240 Q 48 280 48 320 T 22 400 Q 25 440 45 485 T 75 565 Q 60 605 50 645"
            fill="none"
            stroke="rgba(0, 0, 0, 0.25)"
            strokeWidth="18"
            strokeLinecap="round"
          />
          {/* Outer Road Base */}
          <path
            d="M 30 70 Q 82 110 72 150 T 78 240 Q 48 280 48 320 T 22 400 Q 25 440 45 485 T 75 565 Q 60 605 50 645"
            fill="none"
            stroke="#fef3c7"
            strokeWidth="14"
            strokeLinecap="round"
          />
          {/* Inner Golden Dashed Line */}
          <path
            d="M 30 70 Q 82 110 72 150 T 78 240 Q 48 280 48 320 T 22 400 Q 25 440 45 485 T 75 565 Q 60 605 50 645"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="6"
            strokeDasharray="4,6"
            strokeLinecap="round"
          />
        </svg>

        {/* BIOME LANDMARKS ALONG ROAD */}
        {nodePositions.map((node, i) => (
          <div
            key={`landmark-${i}`}
            style={{ left: `${node.x}%`, top: `${node.y - 32}px` }}
            className="absolute -translate-x-1/2 pointer-events-none z-10 flex items-center gap-1 bg-black/40 backdrop-blur-xs text-white px-2 py-0.5 rounded-full text-[10px] font-black border border-white/20 shadow-md"
          >
            <span>{node.emoji}</span>
            <span className="hidden sm:inline">{node.label}</span>
          </div>
        ))}

        {/* PLAYER MASCOT AVATAR STANDING ON ACTIVE LEVEL */}
        {(() => {
          const activePos = nodePositions[currentUnlockedStep - 1] || nodePositions[0];
          return (
            <div
              style={{ left: `${activePos.x}%`, top: `${activePos.y - 55}px` }}
              className="absolute -translate-x-1/2 z-30 transition-all duration-700 ease-out flex flex-col items-center pointer-events-none"
            >
              {/* SPEECH BUBBLE */}
              <div className="bg-amber-300 text-amber-950 font-black text-[10px] px-2.5 py-1 rounded-xl shadow-lg border-2 border-white animate-bounce whitespace-nowrap mb-1 flex items-center gap-1">
                <span>En avant ! Chapitre {currentUnlockedStep}</span>
                <Sparkles className="w-3 h-3 text-amber-700" />
              </div>
              {/* MASCOT ICON */}
              <div className="w-16 h-16 rounded-full bg-white/30 backdrop-blur-md p-1 border-2 border-white shadow-2xl relative pointer-events-auto flex items-center justify-center">
                <AnimatedMascot mascot={mascot} size="lg" animateType="bounce" customQuote={`En avant pour le chapitre ${currentUnlockedStep} !`} />
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-0.5 rounded-full border border-white">
                  <Check className="w-3 h-3" />
                </div>
              </div>
            </div>
          );
        })()}

        {/* STEP NODES (Interactive 1..8) */}
        {Array.from({ length: totalSteps }).map((_, idx) => {
          const stepNum = idx + 1;
          const pos = nodePositions[idx] || { x: 50, y: 100 * idx };
          const isCompleted = stepNum < currentUnlockedStep;
          const isCurrent = stepNum === currentUnlockedStep;
          const isLocked = stepNum > currentUnlockedStep;

          return (
            <button
              key={stepNum}
              onClick={() => setActiveNodeModal(stepNum)}
              style={{ left: `${pos.x}%`, top: `${pos.y}px` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 w-14 h-14 sm:w-16 sm:h-16 rounded-full font-black text-lg flex flex-col items-center justify-center border-4 shadow-2xl z-20 transition-all cursor-pointer active:scale-90 ${
                isCurrent
                  ? "bg-gradient-to-tr from-amber-400 via-amber-300 to-yellow-200 text-amber-950 border-white ring-4 ring-amber-300/60 animate-pulse scale-110"
                  : isCompleted
                  ? "bg-gradient-to-tr from-emerald-500 to-teal-400 text-white border-white hover:scale-110"
                  : "bg-slate-800/80 text-gray-400 border-slate-600/80 backdrop-blur-xs"
              }`}
            >
              {isCompleted && (
                <div className="flex flex-col items-center">
                  <span className="text-sm font-black leading-none">{stepNum}</span>
                  <div className="flex gap-0.5 text-amber-300 mt-0.5">
                    <Star className="w-2.5 h-2.5 fill-amber-300" />
                    <Star className="w-2.5 h-2.5 fill-amber-300" />
                    <Star className="w-2.5 h-2.5 fill-amber-300" />
                  </div>
                </div>
              )}

              {isCurrent && (
                <div className="flex flex-col items-center">
                  <Play className="w-6 h-6 fill-amber-950 ml-0.5" />
                </div>
              )}

              {isLocked && <Lock className="w-5 h-5 text-gray-400" />}
            </button>
          );
        })}

        {/* BOTTOM PROGRESS CARD & REWARD MILESTONES */}
        <div className="absolute bottom-3 left-3 right-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl p-3.5 border-2 border-emerald-400 shadow-2xl z-30 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span className="text-xs font-black text-gray-800 dark:text-gray-100">
                Aventure du Tome : {progressPercent}%
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400">
                <Gift className="w-4 h-4" />
                <span>2 Coffres</span>
              </div>
            </div>
          </div>

          {/* PROGRESS BAR */}
          <div className="w-full h-3.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden border border-emerald-300 p-0.5 relative">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 rounded-full transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* INTERACTIVE LEVEL DRAWER / MODAL */}
      {activeNodeModal !== null && selectedModalChap && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-end sm:items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 w-full max-w-sm rounded-3xl p-6 border-2 border-amber-300 dark:border-gray-700 shadow-2xl relative space-y-4 animate-scale-up">
            <button
              onClick={() => setActiveNodeModal(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* LEVEL HEADER */}
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 flex items-center justify-center font-black text-2xl border-2 border-amber-300 shadow-inner shrink-0">
                {activeNodeModal}
              </div>
              <div>
                <div className="inline-block bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider mb-0.5">
                  {nodePositions[activeNodeModal - 1]?.label || "Chapitre"}
                </div>
                <h3 className="font-extrabold text-base text-gray-900 dark:text-gray-100 leading-tight">
                  {selectedModalChap.titre}
                </h3>
              </div>
            </div>

            {/* DESCRIPTION / QUESTION TEASER */}
            <div className="bg-amber-50/80 dark:bg-gray-700/50 rounded-2xl p-3 border border-amber-200 dark:border-gray-600 text-xs text-gray-700 dark:text-gray-200">
              <p className="font-medium">{selectedModalChap.question_defi}</p>
            </div>

            {/* REWARD POINTS & STARS */}
            <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-900 rounded-2xl p-3 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-1.5">
                <span className="text-xl">🍎</span>
                <div>
                  <span className="text-[10px] text-gray-400 block font-bold uppercase">Récompense</span>
                  <span className="text-xs font-black text-emerald-700 dark:text-emerald-300">
                    +{selectedModalChap.points || 100} pommes d'or
                  </span>
                </div>
              </div>

              <div className="flex gap-1 text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
                <Star className="w-4 h-4 fill-amber-400" />
                <Star className="w-4 h-4 fill-amber-400" />
              </div>
            </div>

            {/* ACTION BUTTON */}
            {activeNodeModal <= currentUnlockedStep ? (
              <button
                onClick={() => {
                  onNavigate(`/defi/${selectedTome?.slug || "tome-1"}/chapitre-${activeNodeModal}`);
                }}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold py-3.5 px-6 rounded-2xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 text-base cursor-pointer active:scale-95 transition-all"
              >
                <Play className="w-5 h-5 fill-white" />
                <span>
                  {activeNodeModal < currentUnlockedStep ? "Rejouer ce chapitre" : "Lancer le Défi !"}
                </span>
              </button>
            ) : (
              <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-2xl text-center text-xs font-bold text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2">
                <Lock className="w-4 h-4 text-gray-400" />
                <span>Termine les chapitres précédents pour débloquer ce niveau !</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

