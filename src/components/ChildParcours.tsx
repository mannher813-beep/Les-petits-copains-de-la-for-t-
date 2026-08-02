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

  // Nombre total d'étapes = nombre RÉEL de missions (chapitres) en base pour ce
  // tome — la carte doit refléter le contenu de la base, plus une valeur figée à 8.
  const totalSteps = Math.max(chapitres.length, 1);

  // Determine current unlocked level (1..totalSteps)
  const currentUnlockedStep = Math.min(completedChapIds.size + 1, totalSteps);

  const STEP_HEIGHT = 90;
  const TOP_OFFSET = 70;
  const BIOME_EMOJIS = ["🌲", "🌳", "🦫", "🌊", "🍄", "🏡", "✨", "🏰", "🦋", "🌸", "🦌", "🐿️"];

  // Positions générées dynamiquement pour autant de noeuds que de missions
  // réellement présentes en base (chemin en zigzag, pas une liste figée).
  const nodePositions = Array.from({ length: totalSteps }).map((_, i) => {
    const chap = chapitres[i];
    const xWave = 50 + 26 * Math.sin(i * 1.05 + 0.5);
    return {
      x: Math.round(Math.max(15, Math.min(85, xWave))),
      y: TOP_OFFSET + i * STEP_HEIGHT,
      label: chap?.titre || `Chapitre ${i + 1}`,
      emoji: BIOME_EMOJIS[i % BIOME_EMOJIS.length]
    };
  });

  // Hauteur totale de la carte, calculée pour accueillir toutes les missions
  const mapHeight = TOP_OFFSET + (totalSteps - 1) * STEP_HEIGHT + 160;

  // Tracé du chemin reliant chaque mission, généré pour N noeuds
  const roadPathD =
    nodePositions.length > 1
      ? `M ${nodePositions[0].x} ${nodePositions[0].y} ` +
        nodePositions
          .slice(1)
          .map((p) => `L ${p.x} ${p.y}`)
          .join(" ")
      : nodePositions.length === 1
      ? `M ${nodePositions[0].x} ${nodePositions[0].y} L ${nodePositions[0].x} ${nodePositions[0].y}`
      : "";

  // Map world themes per tome
  const getWorldTheme = () => {
    if (!selectedTome) return { bg: "from-emerald-400 via-emerald-500 to-teal-700", border: "border-amber-300 dark:border-amber-700", path: "#fef08a", name: "Forêt Enchantée 🌲" };
    if (selectedTome.slug === "tome-2") {
      return { bg: "from-amber-400 via-orange-500 to-amber-800", border: "border-orange-300 dark:border-orange-700", path: "#fed7aa", name: "Vallée d'Automne 🍁" };
    }
    if (selectedTome.slug === "tome-3") {
      return { bg: "from-indigo-600 via-purple-700 to-sky-900", border: "border-purple-300 dark:border-purple-700", path: "#e0e7ff", name: "Royaume des Étoiles ⭐" };
    }
    return { bg: "from-emerald-400 via-emerald-500 to-teal-700", border: "border-amber-300 dark:border-amber-700", path: "#fef08a", name: "Forêt Enchantée 🌲" };
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

  const progressPercent = Math.round(((currentUnlockedStep - 1) / totalSteps) * 100);

  return (
    <div className="max-w-md mx-auto p-4 sm:p-6 pb-40 space-y-4 animate-fade-in select-none">
      {/* TOP HEADER */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={() => onNavigate("/")}
          className="p-2.5 rounded-2xl bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-2 border-amber-200 dark:border-gray-700 shadow-[0_4px_0_#d97706] hover:scale-105 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
        </button>

        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider shadow-md mb-0.5 border border-white/50">
            <Compass className="w-3.5 h-3.5 text-amber-950 animate-spin" />
            <span>Carte d'Aventure 3D</span>
          </div>
          <h1 className="text-base font-black font-fun text-gray-900 dark:text-gray-100 leading-tight">
            {selectedTome ? selectedTome.titre.split("-")[0].trim() : "Tome 1"} - {worldTheme.name}
          </h1>
        </div>

        <span
          className="flex items-center gap-1 bg-white dark:bg-gray-800 border-2 border-amber-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1.5 rounded-2xl text-xs font-black shadow-xs"
        >
          <Globe className="w-3.5 h-3.5 text-emerald-600" />
          <span className="uppercase">{lang}</span>
        </span>
      </div>

      {/* TOME / WORLD SELECTOR 3D TABS */}
      <div className="flex gap-2 bg-gradient-to-b from-amber-100 to-amber-200 dark:from-gray-800 dark:to-gray-900 p-2 rounded-3xl border-2 border-amber-300 dark:border-gray-700 shadow-lg">
        {tomes.map((t, idx) => {
          const isSelected = selectedTome?.id === t.id;
          const icons = ["🌲", "🍂", "✨"];
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => handleSelectTome(t)}
              className={`flex-1 py-2.5 px-2 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer relative ${
                isSelected
                  ? "bg-gradient-to-b from-emerald-400 to-emerald-600 text-white shadow-[0_4px_0_#047857] border-2 border-white scale-102"
                  : "bg-white/80 dark:bg-gray-700/80 text-gray-700 dark:text-gray-200 hover:bg-white border border-amber-200/50 shadow-sm"
              }`}
            >
              <span className="text-base filter drop-shadow">{icons[idx] || "📖"}</span>
              <span className="truncate max-w-[85px] font-fun">Tome {idx + 1}</span>
            </button>
          );
        })}
      </div>

      {/* WORLD MAP CANVAS CONTAINER — 3D REALISTIC KIDS ADVENTURE MAP */}
      <div
        style={{ minHeight: `${mapHeight}px` }}
        className={`bg-gradient-to-b ${worldTheme.bg} rounded-[2.5rem] p-4 sm:p-6 border-8 ${worldTheme.border} shadow-[0_16px_35px_rgba(0,0,0,0.35)] relative overflow-hidden ring-4 ring-black/10`}
      >
        {/* PARCHMENT / DIRT TEXTURE OVERLAY */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1.5px,transparent_1.5px)] [background-size:20px_20px] opacity-15 pointer-events-none" />

        {/* 3D FLOATING BIOME DECORATIONS & STICKERS */}
        <div className="absolute top-4 left-3 text-4xl filter drop-shadow-[0_8px_10px_rgba(0,0,0,0.3)] animate-pulse pointer-events-none z-10">☁️</div>
        <div className="absolute top-10 right-4 text-4xl filter drop-shadow-[0_8px_10px_rgba(0,0,0,0.3)] pointer-events-none z-10">🌲</div>
        {mapHeight > 250 && <div className="absolute top-48 left-2 text-3xl filter drop-shadow-[0_6px_8px_rgba(0,0,0,0.25)] pointer-events-none z-10">🦋</div>}
        {mapHeight > 350 && <div className="absolute top-80 right-3 text-4xl filter drop-shadow-[0_8px_10px_rgba(0,0,0,0.3)] pointer-events-none z-10">🍄</div>}
        {mapHeight > 480 && <div className="absolute top-[430px] left-4 text-3xl filter drop-shadow-[0_6px_8px_rgba(0,0,0,0.25)] pointer-events-none z-10">🌸</div>}
        {mapHeight > 620 && <div className="absolute top-[580px] right-6 text-4xl filter drop-shadow-[0_8px_10px_rgba(0,0,0,0.3)] pointer-events-none z-10">🏰</div>}
        <div className="absolute bottom-12 left-3 text-4xl filter drop-shadow-[0_8px_10px_rgba(0,0,0,0.3)] pointer-events-none z-10">🌳</div>

        {/* SVG SMOOTH WINDING ROAD PATH WITH 3D DEPTH */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox={`0 0 100 ${mapHeight}`} preserveAspectRatio="none">
          {/* Path Deep Shadow */}
          <path
            d={roadPathD}
            fill="none"
            stroke="rgba(0, 0, 0, 0.4)"
            strokeWidth="24"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Path Outer 3D Stone/Dirt Border */}
          <path
            d={roadPathD}
            fill="none"
            stroke="#78350f"
            strokeWidth="18"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Path Golden Cobblestone Surface */}
          <path
            d={roadPathD}
            fill="none"
            stroke="#fef08a"
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Inner Golden Dashed Center Line */}
          <path
            d={roadPathD}
            fill="none"
            stroke="#d97706"
            strokeWidth="4"
            strokeDasharray="3,5"
            strokeLinecap="round"
          />
        </svg>

        {/* 3D BIOME LANDMARKS ALONG ROAD */}
        {nodePositions.map((node, i) => (
          <div
            key={`landmark-${i}`}
            style={{ left: `${node.x}%`, top: `${node.y - 34}px` }}
            className="absolute -translate-x-1/2 pointer-events-none z-10 flex items-center gap-1.5 bg-amber-950/80 backdrop-blur-sm text-amber-100 px-2.5 py-1 rounded-full text-[10px] font-black border border-amber-400/50 shadow-[0_4px_10px_rgba(0,0,0,0.4)]"
          >
            <span className="text-sm filter drop-shadow">{node.emoji}</span>
            <span className="hidden sm:inline font-fun tracking-wide">{node.label}</span>
          </div>
        ))}

        {/* PLAYER MASCOT AVATAR STANDING ON ACTIVE LEVEL WITH 3D SHADOW */}
        {(() => {
          const activePos = nodePositions[currentUnlockedStep - 1] || nodePositions[0];
          return (
            <div
              style={{ left: `${activePos.x}%`, top: `${activePos.y - 62}px` }}
              className="absolute -translate-x-1/2 z-30 transition-all duration-700 ease-out flex flex-col items-center pointer-events-none"
            >
              {/* SPEECH BUBBLE */}
              <div className="bg-gradient-to-r from-amber-300 to-amber-400 text-amber-950 font-black text-[11px] font-fun px-3 py-1 rounded-2xl shadow-[0_6px_15px_rgba(0,0,0,0.3)] border-2 border-white animate-bounce whitespace-nowrap mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-700 fill-amber-400" />
                <span>Chapitre {currentUnlockedStep} !</span>
              </div>
              {/* 3D MASCOT AVATAR STANDEE */}
              <div className="w-20 h-20 rounded-full bg-gradient-to-b from-white/90 to-amber-100/90 backdrop-blur-md p-1 border-4 border-amber-400 shadow-[0_12px_25px_rgba(0,0,0,0.4)] relative pointer-events-auto flex items-center justify-center ring-4 ring-amber-300/50">
                <AnimatedMascot avatarId={enfant.avatar} mascot={mascot} size="lg" animateType="bounce" customQuote={`En avant pour le chapitre ${currentUnlockedStep} !`} />
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full border-2 border-white shadow-md">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              </div>
              {/* 3D Ground Shadow */}
              <div className="w-14 h-3 bg-black/30 rounded-full blur-[2px] mt-0.5" />
            </div>
          );
        })()}

        {/* STEP NODES (Interactive 3D Buttons 1..N) */}
        {Array.from({ length: totalSteps }).map((_, idx) => {
          const stepNum = idx + 1;
          const pos = nodePositions[idx] || { x: 50, y: 100 * idx };
          const isCompleted = stepNum < currentUnlockedStep;
          const isCurrent = stepNum === currentUnlockedStep;
          const isLocked = stepNum > currentUnlockedStep;

          return (
            <button
              key={stepNum}
              type="button"
              onClick={() => setActiveNodeModal(stepNum)}
              style={{ left: `${pos.x}%`, top: `${pos.y}px` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 w-16 h-16 sm:w-18 sm:h-18 rounded-3xl font-black font-fun text-xl flex flex-col items-center justify-center border-4 z-20 transition-all cursor-pointer ${
                isCurrent
                  ? "bg-gradient-to-b from-amber-300 via-amber-400 to-amber-500 text-amber-950 border-white shadow-[0_8px_0_#b45309,0_15px_20px_rgba(0,0,0,0.4)] ring-4 ring-amber-300/80 animate-pulse scale-110 active:translate-y-1 active:shadow-[0_2px_0_#b45309]"
                  : isCompleted
                  ? "bg-gradient-to-b from-emerald-400 via-emerald-500 to-teal-600 text-white border-white shadow-[0_6px_0_#047857,0_10px_15px_rgba(0,0,0,0.3)] hover:scale-110 active:translate-y-1 active:shadow-[0_2px_0_#047857]"
                  : "bg-gradient-to-b from-slate-700 to-slate-800 text-gray-400 border-slate-600/90 shadow-[0_5px_0_#334155,0_8px_12px_rgba(0,0,0,0.3)]"
              }`}
            >
              {isCompleted && (
                <div className="flex flex-col items-center drop-shadow">
                  <span className="text-base font-black leading-none">{stepNum}</span>
                  <div className="flex gap-0.5 text-amber-300 mt-0.5">
                    <Star className="w-3 h-3 fill-amber-300 stroke-amber-500" />
                    <Star className="w-3 h-3 fill-amber-300 stroke-amber-500" />
                    <Star className="w-3 h-3 fill-amber-300 stroke-amber-500" />
                  </div>
                </div>
              )}

              {isCurrent && (
                <div className="flex flex-col items-center drop-shadow-md">
                  <Play className="w-7 h-7 fill-amber-950 stroke-amber-950 ml-0.5" />
                </div>
              )}

              {isLocked && <Lock className="w-6 h-6 text-gray-400/80 filter drop-shadow" />}
            </button>
          );
        })}

      </div>

      {/* Espace réservé pour ne pas laisser la barre fixe recouvrir le bas de la carte */}
      <div className="h-2" />

      {/* PROGRESS BAR — fixe à l'écran (au-dessus de la nav du bas), toujours visible
          pendant le défilement de la carte, indépendante de celle-ci. */}
      <div
        className="fixed left-0 right-0 z-40 px-4 sm:px-6 pointer-events-none"
        style={{ bottom: "calc(4.75rem + env(safe-area-inset-bottom, 0px))" }}
      >
        <div className="max-w-md mx-auto bg-white/97 dark:bg-gray-900/97 backdrop-blur-md rounded-2xl p-3.5 border-2 border-emerald-400 shadow-2xl space-y-2 pointer-events-auto">
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
                type="button"
                onClick={() => {
                  onNavigate(`/defi/${selectedTome?.slug || "tome-1"}/chapitre-${activeNodeModal}`);
                }}
                className="w-full bg-gradient-to-b from-emerald-500 via-emerald-600 to-teal-700 hover:from-emerald-600 hover:to-teal-800 text-white font-black font-fun py-3.5 px-6 rounded-2xl shadow-[0_6px_0_#047857,0_10px_20px_rgba(0,0,0,0.25)] border-2 border-white flex items-center justify-center gap-2 text-base cursor-pointer active:translate-y-1 active:shadow-[0_2px_0_#047857] transition-all"
              >
                <Play className="w-5 h-5 fill-white stroke-white" />
                <span>
                  {activeNodeModal < currentUnlockedStep ? "Rejouer ce chapitre !" : "Lancer le Défi !"}
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

