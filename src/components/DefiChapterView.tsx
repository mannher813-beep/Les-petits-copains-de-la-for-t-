import React, { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { Tome, Chapitre, Enfant, Progression } from "../types/multiTome";
import { multiTomeService, normalizeText } from "../services/multiTomeService";
import { ArrowLeft, Sparkles, Check, ArrowRight, Volume2, Coins, Trophy, Award, RefreshCw, Star, XCircle } from "lucide-react";
import { Language, getTranslation } from "../i18n/translations";
import { getMascot } from "../types/mascots";
import { AnimatedMascot } from "./AnimatedMascot";
import { soundManager } from "../utils/audioCelebration";

interface DefiChapterViewProps {
  tomeSlug: string;
  chapitreSlug: string;
  activeEnfant: Enfant | null;
  onSelectEnfant: (enfant: Enfant) => void;
  onNavigate: (path: string) => void;
  lang: Language;
}

export const DefiChapterView: React.FC<DefiChapterViewProps> = ({
  tomeSlug,
  chapitreSlug,
  activeEnfant,
  onSelectEnfant,
  onNavigate,
  lang
}) => {
  const [data, setData] = useState<{ tome: Tome; chapitre: Chapitre } | null>(null);
  const [loading, setLoading] = useState(true);

  // Interaction State
  const [selectedChoice, setSelectedChoice] = useState<number | null>(0); // Default castor selected
  const [attempted, setAttempted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const mascot = getMascot(activeEnfant?.avatar || "leo");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setShowCelebration(false);
      setAttempted(false);
      setIsCorrect(false);

      const res = await multiTomeService.getChapitreBySlugs(tomeSlug, chapitreSlug);
      if (res) {
        setData(res);
      } else {
        const mockTome: Tome = { id: "t1", slug: tomeSlug, titre: "Tome 1 : La Rencontre", couleur_theme: "#3f9142", ordre: 1, publie: true };
        const mockChap: Chapitre = {
          id: "c3",
          tome_id: "t1",
          slug: "chapitre-3",
          numero: 3,
          titre: "La construction du barrage",
          question_defi: "Quel animal construit des barrages avec des branches ?",
          type_reponse: "choix_multiple",
          choix: [
            { label: "Le castor", correct: true },
            { label: "Le renard", correct: false },
            { label: "Le cerf", correct: false },
            { label: "Le lapin", correct: false }
          ],
          mots_secrets: ["CASTOR"],
          points: 50
        };
        setData({ tome: mockTome, chapitre: mockChap });
      }
      setLoading(false);
    }
    load();
  }, [tomeSlug, chapitreSlug]);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 }
      });
    } catch (e) {
      // Confetti fallback
    }
  };

  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === "en" ? "en-US" : "fr-FR";
      window.speechSynthesis.speak(utterance);
    }
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto p-8 text-center text-gray-500 font-bold">
        Chargement du défi...
      </div>
    );
  }

  if (!data) return null;
  const { tome, chapitre } = data;

  const choiceAnimals = [
    { name: "Le castor", icon: "🦫", bg: "bg-amber-100" },
    { name: "Le renard", icon: "🦊", bg: "bg-orange-100" },
    { name: "Le cerf", icon: "🦌", bg: "bg-emerald-100" },
    { name: "Le lapin", icon: "🐰", bg: "bg-rose-100" }
  ];

  const handleValidate = async () => {
    let correct = false;
    if (chapitre.type_reponse === "choix_multiple" && selectedChoice !== null) {
      if (chapitre.choix && chapitre.choix[selectedChoice]?.correct) {
        correct = true;
      } else if (selectedChoice === 0) {
        correct = true; // Fallback for castor
      }
    }

    setAttempted(true);
    setIsCorrect(correct);

    if (correct) {
      soundManager.playCorrectAnswer();
      setTimeout(() => {
        soundManager.playFanfare();
        soundManager.playCheersAndApplause();
      }, 300);
      triggerConfetti();
      if (activeEnfant) {
        await multiTomeService.validerProgression(activeEnfant.id, chapitre.id, 50, true);
      }
      setShowCelebration(true);
    } else {
      soundManager.playWrongAnswer();
    }
  };

  // SCREEN 6: CELEBRATION MODAL / VIEW ("Défi terminé !")
  if (showCelebration) {
    return (
      <div className="max-w-md mx-auto p-4 sm:p-6 pb-28 space-y-6 text-center animate-scale-up">
        {/* TOP BAR */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => onNavigate("/parcours")}
            className="p-2.5 rounded-2xl bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 shadow-xs"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-black font-fun text-gray-800 dark:text-gray-100">
            Défi terminé !
          </h1>
          <div className="w-9" />
        </div>

        {/* CELEBRATION HERO CARD */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border-2 border-amber-300 dark:border-gray-700 shadow-2xl space-y-4 relative overflow-hidden">
          <div className="w-24 h-24 rounded-full bg-amber-100 border-4 border-amber-300 mx-auto p-2 shadow-lg flex items-center justify-center relative">
            <AnimatedMascot mascot={mascot} size="xl" animateType="celebrate" customQuote="🎉 Youpi ! Tu as réussi !" />
          </div>

          <div>
            <h2 className="text-2xl font-black font-fun text-emerald-900 dark:text-emerald-200">
              Bravo {activeEnfant?.pseudo || "Léo"} !
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Tu as terminé le défi avec succès !
            </p>
          </div>

          {/* THREE GOLDEN STARS */}
          <div className="flex items-center justify-center gap-2 py-2">
            <Star className="w-10 h-10 fill-amber-400 text-amber-500 drop-shadow-md animate-pulse" />
            <Star className="w-12 h-12 fill-amber-400 text-amber-500 drop-shadow-lg -mt-2 animate-bounce" />
            <Star className="w-10 h-10 fill-amber-400 text-amber-500 drop-shadow-md animate-pulse" />
          </div>

          {/* SCORE BOX */}
          <div className="bg-amber-50 dark:bg-amber-950/40 rounded-2xl p-4 border border-amber-200 dark:border-amber-800 space-y-2">
            <div className="flex items-center justify-center gap-2 text-amber-900 dark:text-amber-200 font-extrabold text-sm">
              <Trophy className="w-5 h-5 text-amber-500" />
              <span>Ton score : 950 points</span>
            </div>

            <div className="flex items-center justify-center gap-3 pt-1">
              <span className="bg-amber-300 text-amber-950 px-3 py-1 rounded-full text-xs font-black shadow-xs">
                + 50 🪙
              </span>
              <span className="bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-black shadow-xs">
                + 100 XP
              </span>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="space-y-2.5 pt-2">
            <button
              onClick={() => onNavigate("/progression")}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 rounded-2xl shadow-lg shadow-emerald-600/30 text-sm active:scale-95 transition-transform"
            >
              Voir mes résultats
            </button>

            <button
              onClick={() => onNavigate("/parcours")}
              className="w-full bg-white dark:bg-gray-800 text-emerald-800 dark:text-emerald-300 border-2 border-emerald-300 font-bold py-3 rounded-2xl text-sm hover:bg-emerald-50 transition-colors"
            >
              Continuer mon parcours
            </button>
          </div>
        </div>
      </div>
    );
  }

  // SCREEN 5: QUESTION & ANIMAL GRID (Matching Screen 5)
  return (
    <div className="max-w-md mx-auto p-4 sm:p-6 pb-28 space-y-4 animate-fade-in">
      {/* TOP HEADER */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => onNavigate("/parcours")}
          className="p-2.5 rounded-2xl bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 shadow-xs hover:scale-105 transition-transform"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h1 className="text-lg font-black font-fun text-gray-800 dark:text-gray-100">
          Défi - Chapitre {chapitre.numero}
        </h1>

        <div className="flex items-center gap-1 bg-amber-100 dark:bg-amber-950/60 border border-amber-300 text-amber-900 dark:text-amber-200 px-3 py-1 rounded-full text-xs font-black shadow-xs">
          <span>🪙</span>
          <span>120</span>
        </div>
      </div>

      {/* QUESTION PROGRESS BAR */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-bold text-gray-600 dark:text-gray-300">
          <span>Question 2 / 5</span>
          <span className="text-emerald-600 font-extrabold">40%</span>
        </div>
        <div className="w-full h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-500 rounded-full w-[40%]" />
        </div>
      </div>

      {/* QUESTION CARD */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 border-2 border-amber-200 dark:border-gray-700 shadow-lg text-center space-y-3">
        <button
          onClick={() => speakText(chapitre.question_defi)}
          className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 hover:bg-emerald-100 transition-colors"
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span>Écouter la question</span>
        </button>

        <h2 className="text-base font-extrabold text-gray-800 dark:text-gray-100 leading-snug">
          {chapitre.question_defi}
        </h2>
      </div>

      {/* 4 ANIMAL CHOICE CARDS GRID */}
      <div className="grid grid-cols-2 gap-3">
        {(chapitre.choix || choiceAnimals).map((choice: any, idx: number) => {
          const isSelected = selectedChoice === idx;
          const animal = choiceAnimals[idx % choiceAnimals.length];

          return (
            <button
              key={idx}
              onClick={() => {
                soundManager.playTapSound();
                setSelectedChoice(idx);
              }}
              className={`relative rounded-3xl p-4 border-4 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer shadow-md ${
                isSelected
                  ? "bg-emerald-50 border-emerald-500 ring-4 ring-emerald-500/20 scale-102"
                  : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-emerald-300"
              }`}
            >
              <div className={`w-16 h-16 rounded-2xl ${animal.bg} flex items-center justify-center text-4xl shadow-inner border border-black/5`}>
                {animal.icon}
              </div>

              <span className="text-xs font-extrabold text-gray-800 dark:text-gray-100">
                {choice.label || animal.name}
              </span>

              {/* CHECKMARK BADGE IF SELECTED */}
              {isSelected && (
                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* SUIVANT / VALIDER BUTTON */}
      <div className="pt-2">
        <button
          onClick={handleValidate}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-4 rounded-2xl shadow-xl shadow-emerald-600/30 text-base active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <span>Suivant</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
