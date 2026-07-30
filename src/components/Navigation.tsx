import React from "react";
import { Enfant } from "../types/multiTome";
import { Lock, Sun, Moon, Sparkles, Trophy, Map, Users, Settings } from "lucide-react";

interface NavigationProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  activeEnfant: Enfant | null;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  lang: "fr" | "en";
  onToggleLang: () => void;
  isAdminLoggedIn: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentPath,
  onNavigate,
  activeEnfant,
  isDarkMode,
  onToggleDarkMode,
  lang,
  onToggleLang,
  isAdminLoggedIn
}) => {
  return (
    <header className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b-2 border-warm-border dark:border-gray-800 sticky top-0 z-50 transition-colors shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-2 flex-wrap">
        
        {/* Brand Logo & Name */}
        <div
          onClick={() => onNavigate("/")}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-2xl bg-forest text-white flex items-center justify-center font-black text-xl shadow-md group-hover:scale-105 transition-transform">
            🌿
          </div>
          <div>
            <h1 className="font-fun font-bold text-forest dark:text-forest-light text-lg sm:text-xl leading-none">
              Les Copains de la Forêt
            </h1>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider">
              {lang === "fr" ? "Cahiers & Suivi Enfant" : "Activity & Progress App"}
            </p>
          </div>
        </div>

        {/* Primary Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2 flex-wrap text-xs sm:text-sm font-bold">
          
          <button
            onClick={() => onNavigate("/")}
            className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer min-h-[38px] ${
              currentPath === "/" || currentPath === "/welcome"
                ? "bg-forest/10 text-forest dark:bg-forest/30 dark:text-white font-extrabold"
                : "text-gray-700 dark:text-gray-200 hover:bg-warm-border/50"
            }`}
          >
            <span>🏠</span> {lang === "fr" ? "Accueil" : "Home"}
          </button>

          <button
            onClick={() => onNavigate("/compte/enfants")}
            className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer min-h-[38px] ${
              currentPath.startsWith("/compte")
                ? "bg-forest/10 text-forest dark:bg-forest/30 dark:text-white font-extrabold"
                : "text-gray-700 dark:text-gray-200 hover:bg-warm-border/50"
            }`}
          >
            <Users size={16} /> {lang === "fr" ? "Mes Enfants" : "Children"}
          </button>

          {activeEnfant ? (
            <>
              <button
                onClick={() => onNavigate(`/enfant/${activeEnfant.id}/parcours`)}
                className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer min-h-[38px] ${
                  currentPath.includes("/parcours")
                    ? "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200 font-extrabold shadow-sm"
                    : "text-gray-700 dark:text-gray-200 hover:bg-warm-border/50"
                }`}
              >
                <Map size={16} /> {lang === "fr" ? "Parcours" : "Path"}
              </button>

              <button
                onClick={() => onNavigate(`/enfant/${activeEnfant.id}/classement`)}
                className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer min-h-[38px] ${
                  currentPath.includes("/classement")
                    ? "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200 font-extrabold shadow-sm"
                    : "text-gray-700 dark:text-gray-200 hover:bg-warm-border/50"
                }`}
              >
                <Trophy size={16} /> {lang === "fr" ? "Classement" : "Leaderboard"}
              </button>
            </>
          ) : (
            <button
              onClick={() => onNavigate("/compte/enfants/nouveau")}
              className="px-3 py-2 rounded-xl bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 font-bold flex items-center gap-1.5 hover:bg-amber-200 transition min-h-[38px]"
            >
              <Sparkles size={16} /> {lang === "fr" ? "Créer un profil" : "New Profile"}
            </button>
          )}

          <button
            onClick={() => onNavigate("/admin")}
            className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer min-h-[38px] ${
              currentPath.startsWith("/admin")
                ? "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 font-extrabold"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            <Settings size={16} /> {isAdminLoggedIn ? (lang === "fr" ? "Admin (Connecté)" : "Admin") : "Admin"}
          </button>
        </nav>

        {/* Control Badges: Child Selector, Language & Theme Toggle */}
        <div className="flex items-center gap-2">
          
          {/* Active Child Badge */}
          {activeEnfant && (
            <div
              onClick={() => onNavigate("/compte/enfants")}
              className="flex items-center gap-1.5 bg-forest/10 dark:bg-forest/30 border border-forest/30 px-2.5 py-1 rounded-full cursor-pointer hover:bg-forest/20 transition"
              title={lang === "fr" ? "Changer de profil enfant" : "Switch child profile"}
            >
              <span className="text-base">
                {activeEnfant.avatar === "leo"
                  ? "🦊"
                  : activeEnfant.avatar === "nina"
                  ? "🐭"
                  : activeEnfant.avatar === "darina"
                  ? "🦔"
                  : activeEnfant.avatar === "lana"
                  ? "🐦"
                  : "🌟"}
              </span>
              <span className="font-bold text-xs text-forest dark:text-forest-light max-w-[80px] truncate">
                {activeEnfant.pseudo}
              </span>
            </div>
          )}

          {/* Lang Toggle */}
          <button
            onClick={onToggleLang}
            className="px-2.5 py-1.5 rounded-xl border border-warm-border dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-bold hover:bg-warm-border/50 transition cursor-pointer min-h-[36px]"
            title={lang === "fr" ? "Passer en anglais" : "Switch to French"}
          >
            {lang === "fr" ? "🇫🇷 FR" : "🇬🇧 EN"}
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-xl border border-warm-border dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-yellow-400 hover:bg-warm-border/50 transition cursor-pointer min-h-[36px] flex items-center justify-center"
            title={lang === "fr" ? "Changer de mode clair/sombre" : "Toggle theme"}
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

      </div>
    </header>
  );
};
