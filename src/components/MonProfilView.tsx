import React, { useState } from "react";
import { Enfant } from "../types/multiTome";
import { multiTomeService } from "../services/multiTomeService";
import { ArrowLeft, Globe, User, Award, Scroll, HelpCircle, LogOut, ChevronRight, Sparkles, Check } from "lucide-react";
import { Language, getTranslation } from "../i18n/translations";
import { getMascot, MASCOTS, CHARACTER_ACCESSORIES, parseAvatarConfig, formatAvatarConfig } from "../types/mascots";
import { AnimatedMascot } from "./AnimatedMascot";

interface MonProfilViewProps {
  enfant: Enfant;
  onNavigate: (path: string) => void;
  lang: Language;
  onSelectEnfant?: (enfant: Enfant) => void;
}

export const MonProfilView: React.FC<MonProfilViewProps> = ({
  enfant,
  onNavigate,
  lang,
  onSelectEnfant
}) => {
  const [completedBadges, setCompletedBadges] = useState(0);
  const [showCustomizer, setShowCustomizer] = useState(false);

  const { mascotId: initialMascot, accessoryId: initialAccessory } = parseAvatarConfig(enfant.avatar);
  const [selectedMascot, setSelectedMascot] = useState(initialMascot);
  const [selectedAccessory, setSelectedAccessory] = useState(initialAccessory);
  const [isSavingAvatar, setIsSavingAvatar] = useState(false);

  const currentAvatarConfig = formatAvatarConfig(selectedMascot, selectedAccessory);
  const mascot = getMascot(currentAvatarConfig);

  React.useEffect(() => {
    multiTomeService.getProgressionsByEnfant(enfant.id).then((progs) => {
      setCompletedBadges(progs.length);
    });
  }, [enfant.id]);

  const handleSaveAvatar = async () => {
    setIsSavingAvatar(true);
    const updatedConfig = formatAvatarConfig(selectedMascot, selectedAccessory);
    const updated = await multiTomeService.saveEnfant({
      ...enfant,
      avatar: updatedConfig
    });

    setIsSavingAvatar(false);
    if (updated) {
      localStorage.setItem("forest_active_enfant", JSON.stringify(updated));
      if (onSelectEnfant) {
        onSelectEnfant(updated);
      }
      setShowCustomizer(false);
    }
  };

  const menuItems = [
    {
      id: "profil",
      icon: User,
      label: getTranslation(lang, "chooseProfile"),
      badge: null,
      action: () => onNavigate("/compte/enfants")
    },
    {
      id: "badges",
      icon: Award,
      label: getTranslation(lang, "badges"),
      badge: String(completedBadges),
      action: () => onNavigate("/badges")
    },
    {
      id: "diplomes",
      icon: Scroll,
      label: getTranslation(lang, "diplomas"),
      badge: completedBadges >= 5 ? "1" : "0",
      action: () => onNavigate(`/certificat/tome-1/${enfant.id}`)
    },
    {
      id: "help",
      icon: HelpCircle,
      label: getTranslation(lang, "helpSupport"),
      badge: null,
      action: () => onNavigate("/aide")
    }
  ];

  const mascotsList = Object.values(MASCOTS);

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
          {getTranslation(lang, "navProfil")}
        </h1>

        <span
          className="flex items-center gap-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 px-2.5 py-1 rounded-full text-xs font-bold shadow-xs"
        >
          <Globe className="w-3.5 h-3.5 text-emerald-600" />
          <span className="uppercase">{lang}</span>
        </span>
      </div>

      {/* 3D AVATAR PROFILE HEADER CARD WITH POP-OUT FRAME */}
      <div className="bg-gradient-to-b from-emerald-50 via-white to-amber-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900 rounded-3xl p-6 border-2 border-amber-200 dark:border-gray-700 shadow-xl text-center space-y-4 relative overflow-visible">
        
        {/* Pop-Out 3D Character Container */}
        <div className="relative inline-block mt-2">
          <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-amber-200 via-amber-100 to-amber-300 dark:from-gray-700 dark:to-gray-600 p-1 border-4 border-emerald-500 shadow-2xl mx-auto flex items-center justify-center overflow-visible ring-4 ring-emerald-500/20 relative">
            <AnimatedMascot
              avatarId={currentAvatarConfig}
              size="xl"
              popOutOfFrame={true}
              animateType="bounce"
            />
          </div>

          {/* Quick Edit 3D Avatar Button */}
          <button
            type="button"
            onClick={() => setShowCustomizer(!showCustomizer)}
            className="absolute -bottom-1 -right-3 z-40 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white text-xs font-black px-3.5 py-1.5 rounded-full border-2 border-white shadow-[0_4px_12px_rgba(245,158,11,0.5)] hover:scale-110 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
            title={lang === "en" ? "Customize 3D Companion" : "Personnaliser mon compagnon 3D"}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-100 animate-spin" />
            <span>{lang === "en" ? "Change" : "Changer"}</span>
          </button>
        </div>

        <div>
          <h2 className="text-2xl font-black font-fun text-gray-800 dark:text-gray-100">
            {enfant.pseudo}
          </h2>
          <div className="flex items-center justify-center gap-2 mt-1">
            <span className="inline-block bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 text-xs font-extrabold px-3 py-1 rounded-full border border-emerald-300">
              {mascot.species}
            </span>
            <span className="inline-block bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 text-xs font-extrabold px-3 py-1 rounded-full border border-amber-300">
              {enfant.tranche_age} {lang === "en" ? "years" : "ans"}
            </span>
          </div>
        </div>

        {/* Dedicated prominent button to change avatar */}
        <button
          type="button"
          onClick={() => setShowCustomizer(!showCustomizer)}
          className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-black shadow-md border border-emerald-300 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
        >
          <span>🎭</span>
          <span>
            {showCustomizer
              ? (lang === "en" ? "Close Customizer" : "Fermer la personnalisation")
              : (lang === "en" ? "Change Avatar / Customize 3D Companion" : "Changer l'avatar / Personnaliser mon compagnon 3D")}
          </span>
        </button>
      </div>

      {/* 3D CUSTOMIZER MODAL / DRAWER */}
      {showCustomizer && (
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 border-2 border-emerald-400 dark:border-emerald-700 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
            <h3 className="text-base font-black text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
              <span>🎭</span>
              <span>Personnalise ton compagnon 3D</span>
            </h3>
            <button
              onClick={() => setShowCustomizer(false)}
              className="text-xs font-bold text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              Fermer ✕
            </button>
          </div>

          {/* Pick 3D Character Avatar */}
          <div>
            <label className="text-xs font-extrabold text-gray-600 dark:text-gray-300 block mb-2 text-left">
              {lang === "fr" ? "Choisis ton compagnon 3D :" : "Pick your 3D companion:"}
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {mascotsList.map((m) => {
                const isSelected = selectedMascot === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedMascot(m.id)}
                    className={`p-2.5 rounded-2xl border-2 flex flex-col items-center gap-1 transition-all cursor-pointer relative ${
                      isSelected
                        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 font-bold shadow-md scale-102"
                        : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-gray-800 flex items-center justify-center overflow-visible my-1 relative">
                      <AnimatedMascot
                        avatarId={m.id}
                        size="sm"
                        popOutOfFrame={true}
                        animateType={isSelected ? "bounce" : "float"}
                      />
                    </div>
                    <span className="text-xs font-black truncate max-w-full">{m.name}</span>
                    <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 truncate max-w-full">{m.species}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSaveAvatar}
            disabled={isSavingAvatar}
            className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>{isSavingAvatar ? "Enregistrement..." : "Sauvegarder mon style 3D !"}</span>
          </button>
        </div>
      )}

      {/* MENU LIST OPTIONS */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-3 border-2 border-amber-200 dark:border-gray-700 shadow-md divide-y divide-gray-100 dark:divide-gray-700">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <button
              key={item.id}
              onClick={item.action}
              className="w-full py-3.5 px-3 flex items-center justify-between text-left hover:bg-emerald-50/50 dark:hover:bg-gray-700/50 rounded-2xl transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <IconComponent className="w-5 h-5" />
                </div>
                <span className="text-sm font-extrabold text-gray-800 dark:text-gray-200">
                  {item.label}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {item.badge && (
                  <span className="text-xs font-black text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 transition-colors" />
              </div>
            </button>
          );
        })}

        {/* LOG OUT BUTTON */}
        <button
          onClick={() => onNavigate("/")}
          className="w-full py-3.5 px-3 flex items-center justify-between text-left hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-2xl transition-colors text-rose-600 dark:text-rose-400 font-extrabold text-sm group cursor-pointer mt-1"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <LogOut className="w-5 h-5" />
            </div>
            <span>Se déconnecter</span>
          </div>
          <ChevronRight className="w-5 h-5 text-rose-400" />
        </button>
      </div>
    </div>
  );
};

