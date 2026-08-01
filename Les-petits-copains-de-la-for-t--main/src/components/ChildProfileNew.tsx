import React, { useState, useRef } from "react";
import { Enfant, TrancheAge } from "../types/multiTome";
import { multiTomeService } from "../services/multiTomeService";
import { ArrowLeft, Sparkles, Check, Camera, Upload } from "lucide-react";
import { compressImageFile } from "../utils/imageUtils";

interface ChildProfileNewProps {
  onNavigate: (path: string) => void;
  onChildCreated: (enfant: Enfant) => void;
  lang: "fr" | "en";
}

const AVATARS = [
  { id: "leo", emoji: "🦊", nameFr: "Léo le renard", nameEn: "Leo the Fox" },
  { id: "nina", emoji: "🐭", nameFr: "Nina la souris", nameEn: "Nina the Mouse" },
  { id: "darina", emoji: "🦔", nameFr: "Darina la hérissonne", nameEn: "Darina the Hedgehog" },
  { id: "lana", emoji: "🐦", nameFr: "Lana l'oiseau", nameEn: "Lana the Bird" },
  { id: "squirrel", emoji: "🐿️", nameFr: "Samy l'écureuil", nameEn: "Sammy the Squirrel" },
  { id: "chouette", emoji: "🦉", nameFr: "Chloé la chouette", nameEn: "Chloe the Owl" },
  { id: "ourson", emoji: "🐻", nameFr: "Barnabé l'ourson", nameEn: "Barnaby the Bear" }
];

export const ChildProfileNew: React.FC<ChildProfileNewProps> = ({
  onNavigate,
  onChildCreated,
  lang
}) => {
  const [pseudo, setPseudo] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("leo");
  const [trancheAge, setTrancheAge] = useState<TrancheAge>("5-6");
  const [isSaving, setIsSaving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [customPhoto, setCustomPhoto] = useState<string | null>(null);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImageFile(file, 256, 256);
      setCustomPhoto(compressed);
      setSelectedAvatar(compressed);
    } catch (err) {
      console.error("Error processing photo:", err);
    }
  };

  const [saveError, setSaveError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pseudo.trim()) return;

    setIsSaving(true);
    setSaveError(null);
    const usingCustomPhoto = Boolean(customPhoto) && selectedAvatar === customPhoto;
    const newEnfant = await multiTomeService.saveEnfant({
      pseudo: pseudo.trim(),
      avatar: usingCustomPhoto ? "leo" : selectedAvatar,
      photo: usingCustomPhoto ? customPhoto! : undefined,
      tranche_age: trancheAge
    });

    setIsSaving(false);

    if (!newEnfant) {
      // L'écriture Supabase a échoué (session anonyme non ouverte, RLS, etc.) —
      // on ne navigue pas et on l'affiche clairement au lieu de rester muet.
      setSaveError(
        lang === "fr"
          ? "Le profil n'a pas pu être enregistré. Vérifie ta connexion et réessaie."
          : "The profile could not be saved. Check your connection and try again."
      );
      return;
    }

    onChildCreated(newEnfant);
    onNavigate(`/enfant/${newEnfant.id}/parcours`);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
      
      {/* Back Button */}
      <button
        onClick={() => onNavigate("/compte/enfants")}
        className="mb-6 flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-forest transition"
      >
        <ArrowLeft size={16} />
        <span>{lang === "fr" ? "Retour à la liste des enfants" : "Back to children list"}</span>
      </button>

      {/* Main Card */}
      <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-3xl border-2 border-warm-border shadow-xl">
        
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-3xl bg-forest/10 dark:bg-forest/30 text-forest dark:text-forest-light text-3xl flex items-center justify-center mx-auto mb-3 shadow-inner">
            ✨
          </div>
          <h1 className="text-2xl sm:text-3xl font-fun font-bold text-forest dark:text-forest-light">
            {lang === "fr" ? "Créer un profil enfant" : "Create Child Profile"}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
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

          {/* Avatar Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 text-left">
                {lang === "fr" ? "🎭 Choisis un avatar ou ta photo :" : "🎭 Pick an avatar or your photo:"}
              </label>

              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Custom Photo Tile */}
              <div
                onClick={() => {
                  if (customPhoto) {
                    setSelectedAvatar(customPhoto);
                  } else {
                    fileInputRef.current?.click();
                  }
                }}
                className={`cursor-pointer rounded-2xl border-2 p-3 text-center transition flex flex-col items-center justify-center relative ${
                  selectedAvatar === customPhoto && customPhoto
                    ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 font-bold ring-2 ring-emerald-500"
                    : "border-dashed border-emerald-400 bg-emerald-50/50 dark:bg-gray-700 hover:border-emerald-500"
                }`}
              >
                {customPhoto ? (
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-emerald-500 mb-1">
                    <img src={customPhoto} alt="Ma photo" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-1">
                    <Camera size={20} />
                  </div>
                )}
                <span className="text-xs font-extrabold text-emerald-800 dark:text-emerald-300">
                  {customPhoto ? (lang === "fr" ? "Ma photo" : "My photo") : (lang === "fr" ? "+ Ma photo" : "+ Upload photo")}
                </span>
                {selectedAvatar === customPhoto && customPhoto && (
                  <div className="absolute top-2 right-2 bg-emerald-600 text-white rounded-full p-0.5 shadow-xs">
                    <Check size={12} />
                  </div>
                )}
              </div>

              {AVATARS.map((av) => {
                const isSelected = selectedAvatar === av.id;
                return (
                  <div
                    key={av.id}
                    onClick={() => setSelectedAvatar(av.id)}
                    className={`cursor-pointer rounded-2xl border-2 p-3 text-center transition flex flex-col items-center justify-center relative ${
                      isSelected
                        ? "border-forest bg-forest/10 dark:bg-forest/30 font-bold ring-2 ring-forest"
                        : "border-warm-border bg-white dark:bg-gray-700 hover:border-forest-light"
                    }`}
                  >
                    <span className="text-3xl mb-1 select-none">{av.emoji}</span>
                    <span className="text-xs text-gray-700 dark:text-gray-200">
                      {lang === "fr" ? av.nameFr : av.nameEn}
                    </span>
                    {isSelected && (
                      <div className="absolute top-2 right-2 bg-forest text-white rounded-full p-0.5 shadow-sm">
                        <Check size={12} />
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
