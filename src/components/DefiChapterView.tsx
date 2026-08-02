import React, { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { Tome, Chapitre, Enfant, Progression } from "../types/multiTome";
import { multiTomeService, normalizeText } from "../services/multiTomeService";
import { ArrowLeft, Sparkles, Check, ArrowRight, Volume2, Coins, Trophy, Award, RefreshCw, Star, XCircle, Timer } from "lucide-react";
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
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null); // Never preselect answer in advance
  const [attempted, setAttempted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);

  // Chronomètre de rapidité : démarre dès que la question s'affiche, s'arrête
  // à la validation. Sert à classer les enfants par rapidité de réponse.
  const [elapsedMs, setElapsedMs] = useState(0);
  const [questionStartedAt, setQuestionStartedAt] = useState<number | null>(null);
  const [finalResponseTimeMs, setFinalResponseTimeMs] = useState<number | null>(null);

  const mascot = getMascot(activeEnfant?.avatar || "leo");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setShowCelebration(false);
      setAttempted(false);
      setIsCorrect(false);
      setSelectedChoice(null); // Never preselect answer
      setElapsedMs(0);
      setFinalResponseTimeMs(null);
      setQuestionStartedAt(null);

      const res = await multiTomeService.getChapitreBySlugs(tomeSlug, chapitreSlug);
      setData(res); // null si introuvable — affiché comme une vraie erreur, pas masqué par un faux chapitre
      setLoading(false);
      if (res) setQuestionStartedAt(Date.now());
    }
    load();
  }, [tomeSlug, chapitreSlug]);

  // Tick du chronomètre pendant que la question est active (pas encore tentée)
  useEffect(() => {
    if (!questionStartedAt || attempted) return;
    const interval = setInterval(() => {
      setElapsedMs(Date.now() - questionStartedAt);
    }, 100);
    return () => clearInterval(interval);
  }, [questionStartedAt, attempted]);

  const formatChrono = (ms: number) => {
    const totalSeconds = ms / 1000;
    return `${totalSeconds.toFixed(1)}s`;
  };

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

  if (!data) {
    return (
      <div className="max-w-md mx-auto p-6 text-center space-y-4">
        <p className="font-bold text-gray-700 dark:text-gray-200">
          Ce défi n'existe pas encore dans le livre.
        </p>
        <button
          onClick={() => onNavigate("/parcours")}
          className="px-5 py-2.5 rounded-2xl bg-emerald-600 text-white font-bold"
        >
          Retour au parcours
        </button>
      </div>
    );
  }
  const { chapitre } = data;

  const choiceMascots = [
    { id: "leo", name: "Léo le renard", bg: "bg-orange-100 dark:bg-orange-950/40" },
    { id: "nina", name: "Nina la souris", bg: "bg-purple-100 dark:bg-purple-950/40" },
    { id: "tom", name: "Tom le hérisson", bg: "bg-amber-100 dark:bg-amber-950/40" },
    { id: "zaza", name: "Zaza l'oiseau", bg: "bg-sky-100 dark:bg-sky-950/40" }
  ];

  const handleValidate = async () => {
    if (selectedChoice === null) return;

    const choicesList = (chapitre.choix && chapitre.choix.length > 0)
      ? chapitre.choix
      : [
          { label: "Léo le renard", correct: true, avatar: "leo" },
          { label: "Nina la souris", correct: false, avatar: "nina" },
          { label: "Tom le hérisson", correct: false, avatar: "tom" },
          { label: "Zaza l'oiseau", correct: false, avatar: "zaza" }
        ];

    let correct = false;
    const choiceItem = choicesList[selectedChoice];
    if (choiceItem) {
      if (typeof choiceItem.correct === "boolean") {
        correct = choiceItem.correct;
      } else if (chapitre.reponse_attendue) {
        const selLabel = choiceItem.label || choiceItem.textFr || choiceItem.name || "";
        correct = normalizeText(selLabel) === normalizeText(chapitre.reponse_attendue);
      } else {
        correct = (selectedChoice === 0);
      }
    }

    // Fige le chrono au moment précis de la validation (temps de réponse réel)
    const responseTimeMs = questionStartedAt ? Date.now() - questionStartedAt : undefined;
    if (responseTimeMs !== undefined) {
      setElapsedMs(responseTimeMs);
      setFinalResponseTimeMs(responseTimeMs);
    }

    setAttempted(true);
    setIsCorrect(correct);

    if (correct) {
      soundManager.playCorrectAnswer();
      setTimeout(() => {
        soundManager.playFanfare();
      }, 300);
      triggerConfetti();
      if (activeEnfant) {
        const isFirstAttempt = !attempted;
        const saved = await multiTomeService.validerProgression(
          activeEnfant.id,
          chapitre.id,
          chapitre.points,
          isFirstAttempt,
          isFirstAttempt ? responseTimeMs : undefined
        );
        setEarnedPoints((saved?.points_gagnes) ?? chapitre.points);
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
              <span>Tu as gagné {earnedPoints} points !</span>
            </div>

            <div className="flex items-center justify-center gap-2 pt-1 flex-wrap">
              <span className="bg-amber-300 text-amber-950 px-3 py-1 rounded-full text-xs font-black shadow-xs">
                + {earnedPoints} 🪙
              </span>
              {finalResponseTimeMs !== null && (
                <span className="flex items-center gap-1 bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 px-3 py-1 rounded-full text-xs font-black shadow-xs">
                  <Timer className="w-3.5 h-3.5" />
                  Répondu en {formatChrono(finalResponseTimeMs)}
                </span>
              )}
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
          <span>{chapitre.points}</span>
        </div>
      </div>

      {/* CHRONOMÈTRE DE RAPIDITÉ */}
      <div className="flex items-center justify-center gap-1.5 bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300 px-3 py-1.5 rounded-2xl text-xs font-black w-fit mx-auto">
        <Timer className="w-3.5 h-3.5" />
        <span>{formatChrono(elapsedMs)}</span>
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

      {/* 4 3D ANIMATED MASCOT CHOICE CARDS GRID */}
      {(() => {
        const choicesList = (chapitre.choix && chapitre.choix.length > 0)
          ? chapitre.choix
          : [
              { label: "Léo le renard", correct: true, avatar: "leo" },
              { label: "Nina la souris", correct: false, avatar: "nina" },
              { label: "Tom le hérisson", correct: false, avatar: "tom" },
              { label: "Zaza l'oiseau", correct: false, avatar: "zaza" }
            ];

        return (
          <div className="grid grid-cols-2 gap-3 pt-2">
            {choicesList.map((choice: any, idx: number) => {
              const isSelected = selectedChoice === idx;
              const mascotChoice = choiceMascots[idx % choiceMascots.length];
              const avatarId = choice.avatar || mascotChoice.id;

              // Check if this choice is intrinsically the correct one
              let isChoiceCorrect = false;
              if (typeof choice.correct === "boolean") {
                isChoiceCorrect = choice.correct;
              } else if (chapitre.reponse_attendue) {
                const selLabel = choice.label || choice.textFr || choice.name || "";
                isChoiceCorrect = normalizeText(selLabel) === normalizeText(chapitre.reponse_attendue);
              } else {
                isChoiceCorrect = (idx === 0);
              }

              let cardStyle = "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-amber-300";
              let badge = null;

              if (!attempted) {
                if (isSelected) {
                  cardStyle = "bg-amber-50 dark:bg-amber-950/40 border-amber-400 ring-4 ring-amber-400/30 scale-102";
                  badge = (
                    <div className="absolute top-2 right-2 z-20 w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-md">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  );
                }
              } else {
                // Evaluation done
                if (isSelected) {
                  if (isCorrect) {
                    // Correct answer chosen -> Green
                    cardStyle = "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 ring-4 ring-emerald-500/40 scale-102";
                    badge = (
                      <div className="absolute top-2 right-2 z-20 bg-emerald-500 text-white px-2 py-0.5 rounded-full text-[10px] font-black flex items-center gap-1 shadow-md">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Bonne !</span>
                      </div>
                    );
                  } else {
                    // Wrong answer chosen -> Red
                    cardStyle = "bg-red-50 dark:bg-red-950/60 border-red-500 ring-4 ring-red-500/40 scale-102 animate-shake";
                    badge = (
                      <div className="absolute top-2 right-2 z-20 bg-red-500 text-white px-2 py-0.5 rounded-full text-[10px] font-black flex items-center gap-1 shadow-md">
                        <XCircle className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Faux !</span>
                      </div>
                    );
                  }
                } else if (isChoiceCorrect) {
                  // Show true correct choice in Green
                  cardStyle = "bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-400 ring-2 ring-emerald-400/20";
                  badge = (
                    <div className="absolute top-2 right-2 z-20 bg-emerald-600 text-white px-2 py-0.5 rounded-full text-[10px] font-black flex items-center gap-1 shadow-md">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Correcte</span>
                    </div>
                  );
                } else {
                  cardStyle = "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 opacity-60";
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={attempted}
                  onClick={() => {
                    if (attempted) return;
                    soundManager.playTapSound();
                    setSelectedChoice(idx);
                  }}
                  className={`relative rounded-3xl p-4 border-4 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer shadow-md overflow-visible ${cardStyle}`}
                >
                  {/* Pop-Out 3D Mascot Avatar Container */}
                  <div className={`w-18 h-18 rounded-2xl ${mascotChoice.bg} flex items-center justify-center overflow-visible border-2 border-amber-200 dark:border-gray-600 shadow-inner relative mt-1`}>
                    <AnimatedMascot
                      avatarId={avatarId}
                      size="md"
                      popOutOfFrame={true}
                      animateType={isSelected ? (attempted ? (isCorrect ? "celebrate" : "shake") : "bounce") : "float"}
                    />
                  </div>

                  <span className="text-xs font-extrabold text-gray-800 dark:text-gray-100 text-center">
                    {choice.label || choice.textFr || choice.textEn || mascotChoice.name}
                  </span>

                  {badge}
                </button>
              );
            })}
          </div>
        );
      })()}

      {/* FEEDBACK BANNER IF WRONG ANSWER */}
      {attempted && !isCorrect && (
        <div className="bg-red-100 dark:bg-red-950/80 border-2 border-red-300 dark:border-red-800 rounded-2xl p-4 text-center space-y-2 animate-bounce-short">
          <div className="flex items-center justify-center gap-2 text-red-700 dark:text-red-300 font-black text-sm">
            <XCircle className="w-5 h-5 text-red-500" />
            <span>Oups ! Ce n'est pas la bonne réponse.</span>
          </div>
          <p className="text-xs text-red-600 dark:text-red-300 font-bold">
            La réponse encadrée en vert est la bonne. Tu peux réinstaller ton choix et réessayer !
          </p>
          <button
            type="button"
            onClick={() => {
              soundManager.playTapSound();
              setAttempted(false);
              setIsCorrect(false);
              setSelectedChoice(null);
            }}
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow-md flex items-center justify-center gap-2 mx-auto active:scale-95 transition-transform cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Réessayer</span>
          </button>
        </div>
      )}

      {/* SUIVANT / VALIDER BUTTON */}
      <div className="pt-2">
        {!attempted ? (
          <button
            type="button"
            disabled={selectedChoice === null}
            onClick={handleValidate}
            className={`w-full font-extrabold py-4 rounded-2xl shadow-xl text-base transition-all flex items-center justify-center gap-2 ${
              selectedChoice !== null
                ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30 active:scale-95 cursor-pointer"
                : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed shadow-none"
            }`}
          >
            <span>{selectedChoice !== null ? "Valider ma réponse" : "Choisis une réponse"}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        ) : isCorrect ? (
          <button
            type="button"
            onClick={() => setShowCelebration(true)}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-4 rounded-2xl shadow-xl shadow-emerald-600/30 text-base active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Voir mon résultat</span>
            <Sparkles className="w-5 h-5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              soundManager.playTapSound();
              setAttempted(false);
              setIsCorrect(false);
              setSelectedChoice(null);
            }}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-extrabold py-4 rounded-2xl shadow-xl shadow-amber-500/30 text-base active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Réessayer</span>
          </button>
        )}
      </div>
    </div>
  );
};
