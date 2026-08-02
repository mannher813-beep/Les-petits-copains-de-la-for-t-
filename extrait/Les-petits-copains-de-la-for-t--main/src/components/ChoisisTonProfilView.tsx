import React, { useEffect, useState } from "react";
import { Enfant } from "../types/multiTome";
import { multiTomeService } from "../services/multiTomeService";
import { ArrowLeft, Plus, Check } from "lucide-react";
import { Language, getTranslation } from "../i18n/translations";
import { getMascot } from "../types/mascots";
import { AnimatedMascot } from "./AnimatedMascot";

interface ChoisisTonProfilViewProps {
  onNavigate: (path: string) => void;
  onSelectEnfant: (enfant: Enfant) => void;
  activeEnfantId?: string;
  lang: Language;
}

export const ChoisisTonProfilView: React.FC<ChoisisTonProfilViewProps> = ({
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
    <div className="max-w-md mx-auto p-4 sm:p-6 pb-28 space-y-6 animate-fade-in">
      {/* TOP BAR */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => onNavigate("/")}
          className="p-2.5 rounded-2xl bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 shadow-xs hover:scale-105 transition-transform"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h1 className="text-xl font-black font-fun text-gray-800 dark:text-gray-100">
          {getTranslation(lang, "chooseProfile")}
        </h1>

        <div className="w-10" />
      </div>

      {/* AVATARS LIST (Matching Screen 2 in reference image) */}
      <div className="pt-6 pb-4">
        {loading ? (
          <div className="text-center py-12 text-xs font-bold text-gray-400">
            Chargement des profils...
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-center gap-6">
            {enfants.map((enfant) => {
              const isSelected = activeEnfantId === enfant.id;
              const mascot = getMascot(enfant.avatar);

              return (
                <button
                  key={enfant.id}
                  onClick={() => {
                    onSelectEnfant(enfant);
                    onNavigate("/parcours");
                  }}
                  className="group flex flex-col items-center gap-2 cursor-pointer transition-transform active:scale-95"
                >
                  <div className="relative">
                    <div
                      className={`w-20 h-20 sm:w-22 sm:h-22 rounded-full p-1 border-4 transition-all shadow-lg flex items-center justify-center bg-amber-50 dark:bg-gray-800 ${
                        isSelected
                          ? "border-emerald-500 ring-4 ring-emerald-500/20 scale-105"
                          : "border-gray-200 dark:border-gray-700 group-hover:border-emerald-300"
                      }`}
                    >
                      {enfant.photo ? (
                        <img src={enfant.photo} alt={enfant.pseudo} className="w-full h-full object-cover rounded-full" />
                      ) : (
                        <AnimatedMascot mascot={mascot} size="lg" animateType={isSelected ? "bounce" : "float"} />
                      )}
                    </div>

                    {/* Selected Checkmark Badge */}
                    {isSelected && (
                      <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center border-2 border-white shadow-md">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                    )}
                  </div>

                  <span
                    className={`text-sm font-black transition-colors ${
                      isSelected ? "text-emerald-600 dark:text-emerald-400 font-extrabold" : "text-gray-700 dark:text-gray-200"
                    }`}
                  >
                    {enfant.pseudo}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ADD PROFILE BIG BUTTON */}
      <div className="pt-4 text-center">
        <button
          onClick={() => onNavigate("/compte/enfants/nouveau")}
          className="w-full max-w-xs mx-auto bg-white dark:bg-gray-800 border-2 border-dashed border-emerald-400 hover:border-emerald-600 text-emerald-800 dark:text-emerald-300 p-6 rounded-3xl flex flex-col items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all group active:scale-95 cursor-pointer"
        >
          <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Plus className="w-8 h-8 stroke-[3]" />
          </div>
          <span className="text-sm font-black font-fun">
            {getTranslation(lang, "addProfile")}
          </span>
        </button>
      </div>
    </div>
  );
};
