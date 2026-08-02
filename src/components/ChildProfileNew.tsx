import React, { useState } from "react";
import { Enfant, TrancheAge } from "../types/multiTome";
import { multiTomeService } from "../services/multiTomeService";
import { ArrowLeft, Sparkles, Check } from "lucide-react";
import { MASCOTS, CHARACTER_ACCESSORIES, formatAvatarConfig } from "../types/mascots";
import { AnimatedMascot } from "./AnimatedMascot";

interface ChildProfileNewProps {
  onNavigate: (path: string) => void;
  onChildCreated: (enfant: Enfant) => void;
  lang: "fr" | "en";
}

export const ChildProfileNew: React.FC<ChildProfileNewProps> = ({
  onNavigate,
  onChildCreated,
  lang
}) => {
  const [pseudo, setPseudo] = useState("");
  const [selectedMascotId, setSelectedMascotId] = useState("leo");
  const [selectedAccessoryId, setSelectedAccessoryId] = useState("none");
  const [trancheAge, setTrancheAge] = useState<TrancheAge>("5-6");
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pseudo.trim()) return;

    setIsSaving(true);
    setSaveError(null);

    const fullAvatarConfig = formatAvatarConfig(selectedMascotId, selectedAccessoryId);

    const newEnfant = await multiTomeService.saveEnfant({
      pseudo: pseudo.trim(),
      avatar: fullAvatarConfig,
      tranche_age: trancheAge
    });

    setIsSaving(false);

    if (!newEnfant) {
      setSaveError(
        lang === "fr"
          ? "Le profil n'a pas pu être enregistré. Vérifie ta connexion et réessaie."
          : "The profile could not be saved. Check your connection and try again."
      );
      return;
    }

    onChildCreated(newEnfant);
  };

  const mascotsList = Object.values(MASCOTS);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
      
      {/* Back Button */}
      <button
        onClick={() => onNavigate("/compte/enfants")}
        className="mb-6 flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-forest transition"
      >
        <ArrowLeft size={16} />
        <span>{lang === "fr" ? "Retour à la liste des enfants" : "Back to children list"}</span>
      </button>

      {/* Main Card */}
      <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-3xl border-2 border-warm-border dark:border-gray-700 shadow-xl">
        
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-3xl bg-forest/10 dark:bg-forest/30 text-forest dark:text-forest-light text-3xl flex items-center justify-center mx-auto mb-3 shadow-inner">
            ✨
          </div>
          <h1 className="text-2xl sm:text-3xl font-fun font-bold text-forest dark:text-forest-light">
            {lang === "fr" ? "Créer un profil enfant" : "Create Child Profile"}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            {lang === "fr"
              ? "Protection de la vie privée : utilise un pseudonyme rigolo. Pas de nom de famille !"
              : "Privacy protection: use a funny nickname. No last names!"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Pseudonym Input */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2 text-left">
              {lang === "fr" ? "✏️ Pseudonyme de l'enfant :" : "✏️ Child Nickname:"}
            </label>
            <input
              type="text"
              required
              maxLength={20}
              value={pseudo}
              onChange={(e) => setPseudo(e.target.value)}
              placeholder={lang === "fr" ? "ex: LéoExplorateur, NinaSouriante" : "e.g. LeoExplorer, HappyNina"}
              className="w-full px-4 py-3 rounded-2xl border-2 border-warm-border text-base focus:outline-none focus:border-forest font-handwriting dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Age Group Selector */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2 text-left">
              {lang === "fr" ? "🎂 Tranche d'âge (pour le classement équitable) :" : "🎂 Age group (for fair leaderboard):"}
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {(["3-4", "5-6", "6-7", "7-8", "9-10"] as TrancheAge[]).map((age) => (
                <button
                  key={age}
                  type="button"
                  onClick={() => setTrancheAge(age)}
                  className={`py-3 px-2 rounded-2xl border-2 font-bold text-sm transition cursor-pointer flex flex-col items-center justify-center gap-1 ${
                    trancheAge === age
                      ? "border-forest bg-forest text-white shadow-md"
                      : "border-warm-border bg-warm-cream/50 text-gray-700 dark:bg-gray-700 dark:text-white hover:border-forest-light"
                  }`}
                >
                  <span className="text-lg">🎈</span>
                  <span>{age} ans</span>
                </button>
              ))}
            </div>
          </div>

          {/* 3D Character Selection */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-3 text-left">
              {lang === "fr" ? "🎭 Choisi ton compagnon 3D de la forêt :" : "🎭 Pick your 3D forest companion:"}
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              {mascotsList.map((m) => {
                const isSelected = selectedMascotId === m.id;
                return (
                  <div
                    key={m.id}
                    onClick={() => setSelectedMascotId(m.id)}
                    className={`cursor-pointer rounded-3xl border-3 p-3 text-center transition-all flex flex-col items-center justify-between relative ${
                      isSelected
                        ? "border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 ring-4 ring-emerald-500/20 shadow-xl scale-102"
                        : "border-amber-200 dark:border-gray-700 bg-white dark:bg-gray-700 hover:border-emerald-300"
                    }`}
                  >
                    {/* Pop-Out 3D Character Preview */}
                    <div className="w-18 h-18 rounded-full bg-gradient-to-tr from-amber-100 to-amber-50 dark:from-gray-800 dark:to-gray-700 border-2 border-amber-300 dark:border-gray-600 flex items-center justify-center overflow-visible mb-1 mt-1">
                      <AnimatedMascot
                        avatarId={m.id}
                        size="md"
                        popOutOfFrame={true}
                        animateType={isSelected ? "bounce" : "float"}
                      />
                    </div>

                    <div className="mt-1 text-center">
                      <span className="text-xs font-black text-gray-800 dark:text-gray-100 block">
                        {m.name}
                      </span>
                      <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 block">
                        {m.species}
                      </span>
                    </div>

                    {isSelected && (
                      <div className="absolute top-2 right-2 bg-emerald-500 text-white rounded-full p-1 shadow-md z-20">
                        <Check size={12} className="stroke-[3]" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {saveError && (
            <p className="text-sm font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/40 rounded-2xl px-4 py-3">
              {saveError}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!pseudo.trim() || isSaving}
            className="w-full py-4 rounded-2xl bg-forest hover:bg-forest-light text-white font-fun font-bold text-lg shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Sparkles size={20} />
            <span>
              {isSaving
                ? (lang === "fr" ? "Enregistrement..." : "Saving...")
                : (lang === "fr" ? "Valider et commencer l'aventure !" : "Save & Start Adventure!")}
            </span>
          </button>

        </form>

      </div>

    </div>
  );
};

