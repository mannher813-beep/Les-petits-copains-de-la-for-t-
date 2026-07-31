import React, { useState, useRef } from "react";
import { Enfant } from "../types/multiTome";
import { multiTomeService } from "../services/multiTomeService";
import { ArrowLeft, Globe, Camera, User, Award, Scroll, Settings, HelpCircle, LogOut, ChevronRight } from "lucide-react";
import { Language } from "../i18n/translations";
import { getMascot } from "../types/mascots";
import { AnimatedMascot } from "./AnimatedMascot";
import { compressImageFile } from "../utils/imageUtils";

interface MonProfilViewProps {
  enfant: Enfant;
  onNavigate: (path: string) => void;
  lang: Language;
}

export const MonProfilView: React.FC<MonProfilViewProps> = ({
  enfant,
  onNavigate,
  lang
}) => {
  const [currentAvatar, setCurrentAvatar] = useState(enfant.avatar || "leo");
  const [completedBadges, setCompletedBadges] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mascot = getMascot(currentAvatar);

  React.useEffect(() => {
    multiTomeService.getProgressionsByEnfant(enfant.id).then((progs) => {
      setCompletedBadges(progs.length);
    });
  }, [enfant.id]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImageFile(file, 256, 256);
      setCurrentAvatar(compressed);
      const updated = { ...enfant, avatar: compressed };
      await multiTomeService.saveEnfant(updated);
      localStorage.setItem("forest_active_enfant", JSON.stringify(updated));
    } catch (err) {
      console.error("Error updating avatar photo:", err);
    }
  };

  const menuItems = [
    {
      id: "profil",
      icon: User,
      label: "Mon profil",
      badge: null,
      action: () => onNavigate("/compte/enfants")
    },
    {
      id: "badges",
      icon: Award,
      label: "Mes badges",
      badge: String(completedBadges),
      action: () => onNavigate(`/enfant/${enfant.id}/badges`)
    },
    {
      id: "diplomes",
      icon: Scroll,
      label: "Mes diplômes",
      badge: completedBadges >= 5 ? "1" : "0",
      action: () => onNavigate(`/certificat/tome-1/${enfant.id}`)
    },
    {
      id: "settings",
      icon: Settings,
      label: "Paramètres",
      badge: null,
      action: () => onNavigate("/admin")
    },
    {
      id: "help",
      icon: HelpCircle,
      label: "Aide et support",
      badge: null,
      action: () => onNavigate("/aide")
    }
  ];

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
          Mon profil
        </h1>

        <button
          onClick={() => onNavigate("/admin")}
          className="flex items-center gap-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 px-2.5 py-1 rounded-full text-xs font-bold shadow-xs"
        >
          <Globe className="w-3.5 h-3.5 text-emerald-600" />
          <span className="uppercase">{lang}</span>
        </button>
      </div>

      {/* AVATAR PROFILE HEADER (Matching Screen 10) */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border-2 border-amber-200 dark:border-gray-700 shadow-lg text-center space-y-3">
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handlePhotoUpload}
          className="hidden"
        />

        <div className="relative inline-block">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-24 h-24 rounded-full bg-amber-100 p-1 border-4 border-emerald-500 shadow-xl mx-auto flex items-center justify-center overflow-hidden cursor-pointer hover:opacity-95 transition-opacity"
          >
            {currentAvatar.startsWith("data:") ? (
              <img src={currentAvatar} alt={enfant.pseudo} className="w-full h-full object-cover rounded-full" />
            ) : (
              <AnimatedMascot mascot={mascot} size="xl" animateType="bounce" />
            )}
          </div>

          {/* GREEN CAMERA BADGE */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center border-2 border-white shadow-md hover:scale-110 transition-transform cursor-pointer"
            title="Ajouter ou changer de photo"
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>

        <div>
          <h2 className="text-2xl font-black font-fun text-gray-800 dark:text-gray-100">
            {enfant.pseudo}
          </h2>
          <span className="inline-block bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 text-xs font-extrabold px-3 py-1 rounded-full mt-1 border border-emerald-300">
            Niveau 5 - Explorateur
          </span>
        </div>
      </div>

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
