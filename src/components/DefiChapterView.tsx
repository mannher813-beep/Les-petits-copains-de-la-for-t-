import React, { useEffect, useState } from "react";
import { Tome, Chapitre, Enfant, Progression } from "../types/multiTome";
import { multiTomeService, normalizeText } from "../services/multiTomeService";
import { ArrowLeft, Sparkles, CheckCircle2, HelpCircle, Award, BookOpen, ArrowRight, RefreshCw } from "lucide-react";

interface DefiChapterViewProps {
  tomeSlug: string;
  chapitreSlug: string;
  activeEnfant: Enfant | null;
  onSelectEnfant: (enfant: Enfant) => void;
  onNavigate: (path: string) => void;
  lang: "fr" | "en";
}

const AVATAR_EMOJIS: Record<string, string> = {
  leo: "🦊",
  nina: "🐭",
  darina: "🦔",
  lana: "🐦",
  squirrel: "🐿️",
  chouette: "🦉",
  ourson: "🐻"
};

export const DefiChapterView: React.FC<DefiChapterViewProps> = ({
  tomeSlug,
  chapitreSlug,
  activeEnfant,
  onSelectEnfant,
  onNavigate,
  lang
}) => {
  const [data, setData] = useState<{ tome: Tome; chapitre: Chapitre } | null>(null);
  const [allChapters, setAllChapters] = useState<Chapitre[]>([]);
  const [loading, setLoading] = useState(true);

  // "Who's playing?" gate — re-asked on every scan so points always land on the right child
  const [confirmedEnfant, setConfirmedEnfant] = useState<Enfant | null>(null);
  const [availableEnfants, setAvailableEnfants] = useState<Enfant[]>([]);
  const [enfantsLoading, setEnfantsLoading] = useState(true);

  // Interaction State
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [textAnswer, setTextAnswer] = useState("");
  const [attempted, setAttempted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [attemptsCount, setAttemptsCount] = useState(0);

  // Success Progression Result
  const [savedProgression, setSavedProgression] = useState<Progression | null>(null);
  const [isTomeCompleted, setIsTomeCompleted] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setAttempted(false);
      setIsCorrect(false);
      setSelectedChoice(null);
      setTextAnswer("");
      setAttemptsCount(0);
      setConfirmedEnfant(null); // require a fresh pick every time this screen is reached
      setEnfantsLoading(true);

      const res = await multiTomeService.getChapitreBySlugs(tomeSlug, chapitreSlug);
      if (res) {
        setData(res);
        const chaps = await multiTomeService.getChapitresByTomeId(res.tome.id);
        setAllChapters(chaps);
      }
      setLoading(false);

      const enfants = await multiTomeService.getEnfantsByParent();
      setAvailableEnfants(enfants);
      setEnfantsLoading(false);
    }
    load();
  }, [tomeSlug, chapitreSlug]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center text-gray-500 font-bold">
        {lang === "fr" ? "Chargement du défi..." : "Loading challenge..."}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="text-5xl mb-4">🔍</div>
        <h2 className="text-xl font-bold text-gray-700 dark:text-gray-200 mb-2">
          {lang === "fr" ? "Défi introuvable" : "Challenge not found"}
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          {lang === "fr" ? "Ce chapitre n'existe pas ou le QR code est invalide." : "This chapter does not exist or QR code is invalid."}
        </p>
        <button
          onClick={() => onNavigate("/")}
          className="bg-forest text-white font-bold px-6 py-3 rounded-2xl shadow-md"
        >
          {lang === "fr" ? "Retour à l'accueil" : "Back home"}
        </button>
      </div>
    );
  }

  const { tome, chapitre } = data;

  // Gate: show the account selector before every défi, regardless of what
  // was last active on this phone — this is what makes sharing one device
  // between several children safe (points always go to whoever taps their
  // own tile here, not to whoever played last).
  if (!confirmedEnfant) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => onNavigate("/")}
            className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-forest transition cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>{lang === "fr" ? "Retour à l'accueil" : "Back home"}</span>
          </button>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-forest/10 text-forest dark:bg-forest/30 dark:text-forest-light">
            {tome.titre}
          </span>
        </div>

        <div
          className="bg-white dark:bg-gray-800 rounded-3xl border-4 shadow-2xl p-6 sm:p-8 text-center"
          style={{ borderColor: chapitre.couleur || tome.couleur_theme }}
        >
          <div className="text-4xl mb-3">🙋</div>
          <h1 className="text-xl sm:text-2xl font-fun font-bold text-gray-900 dark:text-white mb-2">
            {lang === "fr" ? "Qui relève le défi ?" : "Who's taking the challenge?"}
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            {lang === "fr"
              ? `Chapitre ${chapitre.numero} — ${chapitre.titre}. Choisis ton profil pour que tes points comptent pour toi !`
              : `Chapter ${chapitre.numero} — ${chapitre.titre}. Pick your profile so your points count for you!`}
          </p>

          {enfantsLoading ? (
            <p className="text-sm text-gray-400 font-bold">
              {lang === "fr" ? "Chargement des profils..." : "Loading profiles..."}
            </p>
          ) : availableEnfants.length === 0 ? (
            <div>
              <p className="text-sm text-gray-500 mb-4">
                {lang === "fr" ? "Aucun profil pour l'instant." : "No profile yet."}
              </p>
              <button
                onClick={() => onNavigate("/compte/enfants/nouveau")}
                className="bg-forest text-white font-bold px-6 py-3 rounded-2xl shadow-md hover:bg-forest-light transition cursor-pointer"
              >
                {lang === "fr" ? "Créer un profil" : "Create a profile"}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {availableEnfants.map((enfant) => {
                const isSuggested = activeEnfant?.id === enfant.id;
                return (
                  <button
                    key={enfant.id}
                    type="button"
                    onClick={() => {
                      setConfirmedEnfant(enfant);
                      onSelectEnfant(enfant);
                    }}
                    className={`rounded-2xl border-2 p-4 text-center transition flex flex-col items-center gap-1 cursor-pointer ${
                      isSuggested
                        ? "border-forest bg-forest/10 dark:bg-forest/30 ring-2 ring-forest"
                        : "border-warm-border bg-white dark:bg-gray-700 hover:border-forest-light"
                    }`}
                  >
                    <span className="text-3xl">{AVATAR_EMOJIS[enfant.avatar] || "🌟"}</span>
                    <span className="text-sm font-bold text-gray-800 dark:text-gray-100">{enfant.pseudo}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  const handleValidate = async () => {
    let correct = false;

    if (chapitre.type_reponse === "choix_multiple") {
      if (selectedChoice !== null && chapitre.choix?.[selectedChoice]?.correct) {
        correct = true;
      }
    } else if (chapitre.type_reponse === "texte_libre") {
      const inputNorm = normalizeText(textAnswer);
      const expectedNorm = normalizeText(chapitre.reponse_attendue || "");
      if (inputNorm === expectedNorm || inputNorm.includes(expectedNorm)) {
        correct = true;
      }
    }

    setAttempted(true);
    setIsCorrect(correct);
    setAttemptsCount((prev) => prev + 1);

    if (correct && confirmedEnfant) {
      const isFirstTry = attemptsCount === 0;
      const prog = await multiTomeService.validerProgression(
        confirmedEnfant.id,
        chapitre.id,
        chapitre.points,
        isFirstTry
      );
      setSavedProgression(prog);

      // Check if all chapters of this tome are completed for this child
      const currentProgs = await multiTomeService.getProgressionsByEnfant(confirmedEnfant.id);
      const completedChapIds = new Set(currentProgs.map((p) => p.chapitre_id));
      const allDone = allChapters.every((c) => completedChapIds.has(c.id));
      if (allDone) {
        setIsTomeCompleted(true);
      }
    }
  };

  // Find next chapter slug
  const currentIndex = allChapters.findIndex((c) => c.id === chapitre.id);
  const nextChapter = currentIndex >= 0 && currentIndex < allChapters.length - 1 ? allChapters[currentIndex + 1] : null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
      
      {/* Top Header */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => {
            if (confirmedEnfant) {
              onNavigate(`/enfant/${confirmedEnfant.id}/parcours`);
            } else {
              onNavigate("/");
            }
          }}
          className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-forest transition cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>{lang === "fr" ? "Retour au parcours" : "Back to path"}</span>
        </button>

        <span className="text-xs font-bold px-3 py-1 rounded-full bg-forest/10 text-forest dark:bg-forest/30 dark:text-forest-light">
          {tome.titre}
        </span>
      </div>

      {/* Main Challenge Card */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl border-4 shadow-2xl p-6 sm:p-8 text-left transition" style={{ borderColor: chapitre.couleur || tome.couleur_theme }}>
        
        {/* Chapter Header Badge */}
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl text-white shadow-md"
            style={{ backgroundColor: chapitre.couleur || tome.couleur_theme }}
          >
            {chapitre.numero}
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
              {lang === "fr" ? `Chapitre ${chapitre.numero}` : `Chapter ${chapitre.numero}`}
            </span>
            <h1 className="text-xl sm:text-2xl font-fun font-bold text-gray-900 dark:text-white">
              {chapitre.titre}
            </h1>
          </div>
        </div>

        {/* Question Prompt */}
        <div className="bg-warm-cream/60 dark:bg-gray-700/60 p-5 rounded-2xl border-2 border-warm-border mb-6">
          <p className="text-lg sm:text-xl font-bold text-forest dark:text-forest-light leading-snug">
            {chapitre.question_defi}
          </p>
        </div>

        {/* Secret Words Hint Badge */}
        {chapitre.mots_secrets && chapitre.mots_secrets.length > 0 && (
          <div className="mb-6 flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/40 p-3 rounded-xl border border-amber-300">
            <Sparkles size={16} />
            <span>
              {lang === "fr"
                ? `Mots magiques à débloquer : ${chapitre.mots_secrets.join(" · ")}`
                : `Magic words to unlock: ${chapitre.mots_secrets.join(" · ")}`}
            </span>
          </div>
        )}

        {/* Input Interface */}
        {!isCorrect && (
          <div className="space-y-4 mb-6">
            
            {chapitre.type_reponse === "choix_multiple" && chapitre.choix && (
              <div className="space-y-3">
                {chapitre.choix.map((choice, idx) => {
                  const isSelected = selectedChoice === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setSelectedChoice(idx);
                        setAttempted(false);
                      }}
                      className={`w-full text-left p-4 rounded-2xl border-2 font-bold text-base transition cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? "border-forest bg-forest/10 dark:bg-forest/30 text-forest dark:text-forest-light shadow-md ring-2 ring-forest"
                          : "border-warm-border bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 hover:border-forest-light"
                      }`}
                    >
                      <span>{choice.label}</span>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected ? "border-forest bg-forest text-white" : "border-warm-border"}`}>
                        {isSelected && "✓"}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {chapitre.type_reponse === "texte_libre" && (
              <div>
                <input
                  type="text"
                  value={textAnswer}
                  onChange={(e) => {
                    setTextAnswer(e.target.value);
                    setAttempted(false);
                  }}
                  placeholder={lang === "fr" ? "Écris ta réponse ici..." : "Write your answer here..."}
                  className="w-full px-5 py-4 rounded-2xl border-2 border-warm-border text-xl font-handwriting focus:outline-none focus:border-forest dark:bg-gray-700 dark:text-white"
                />
              </div>
            )}

            {/* Validation Trigger Button */}
            <button
              type="button"
              onClick={handleValidate}
              disabled={chapitre.type_reponse === "choix_multiple" ? selectedChoice === null : !textAnswer.trim()}
              className="w-full py-4 rounded-2xl bg-forest hover:bg-forest-light text-white font-fun font-bold text-lg shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Sparkles size={20} />
              <span>{lang === "fr" ? "Valider ma réponse !" : "Validate my answer!"}</span>
            </button>

          </div>
        )}

        {/* Feedback Messages */}
        {attempted && !isCorrect && (
          <div className="bg-amber-50 dark:bg-amber-900/40 border-2 border-amber-300 p-4 rounded-2xl text-center mb-6 animate-shake">
            <p className="text-base font-bold text-amber-800 dark:text-amber-200 mb-1">
              {lang === "fr" ? "Pas tout à fait, petit copain ! 🌿" : "Not quite, little friend! 🌿"}
            </p>
            <p className="text-xs text-amber-700 dark:text-amber-300">
              {lang === "fr"
                ? "Regarde bien l'indice ou essaie à nouveau ! Tu vas y arriver."
                : "Check the hint or try again! You can do it."}
            </p>
          </div>
        )}

        {/* Correct Victory State */}
        {isCorrect && (
          <div className="bg-emerald-50 dark:bg-emerald-900/30 border-2 border-emerald-400 p-6 rounded-3xl text-center space-y-4 animate-scale-up">
            <div className="text-5xl">🎉</div>
            <h2 className="text-2xl font-fun font-bold text-emerald-800 dark:text-emerald-200">
              {lang === "fr" ? "BRAVO ! Réponse Correcte !" : "BRAVO! Correct Answer!"}
            </h2>
            <p className="text-sm text-emerald-700 dark:text-emerald-300 font-bold">
              {lang === "fr"
                ? `Tu as gagné ${savedProgression?.points_gagnes || chapitre.points} points pour ce défi !`
                : `You earned ${savedProgression?.points_gagnes || chapitre.points} points for this challenge!`}
            </p>

            {/* Completion Options */}
            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
              
              {isTomeCompleted && confirmedEnfant && (
                <button
                  onClick={() => onNavigate(`/certificat/${tome.slug}/${confirmedEnfant.id}`)}
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Award size={18} />
                  <span>{lang === "fr" ? "Voir mon Certificat de Tome !" : "View Tome Certificate!"}</span>
                </button>
              )}

              {nextChapter && (
                <button
                  onClick={() => onNavigate(`/defi/${tome.slug}/${nextChapter.slug}`)}
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-forest hover:bg-forest-light text-white font-bold shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{lang === "fr" ? "Chapitre Suivant ➡️" : "Next Chapter ➡️"}</span>
                </button>
              )}

              {confirmedEnfant && (
                <button
                  onClick={() => onNavigate(`/enfant/${confirmedEnfant.id}/parcours`)}
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-white dark:bg-gray-700 text-forest dark:text-forest-light font-bold border-2 border-forest hover:bg-forest/10 cursor-pointer"
                >
                  <span>{lang === "fr" ? "Voir mon parcours 🗺️" : "View my path 🗺️"}</span>
                </button>
              )}

            </div>
          </div>
        )}

      </div>

    </div>
  );
};
