import React, { useState } from "react";
import { Home, Compass, QrCode, Trophy, User, Moon, Sun, Globe, Settings, ShieldCheck, Volume2, VolumeX, Music } from "lucide-react";
import { Enfant } from "../types/multiTome";
import { Language, getTranslation } from "../i18n/translations";
import { getMascot } from "../types/mascots";
import { AnimatedMascot } from "./AnimatedMascot";
import { soundManager } from "../utils/audioCelebration";

interface NavigationProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  activeEnfant: Enfant | null;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  lang: Language;
  onSelectLang: (lang: Language) => void;
  isAdminLoggedIn?: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentPath,
  onNavigate,
  activeEnfant,
  isDarkMode,
  onToggleDarkMode,
  lang,
  onSelectLang,
  isAdminLoggedIn
}) => {
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [showVolumePanel, setShowVolumePanel] = useState(false);
  const [isMuted, setIsMuted] = useState(soundManager.isMuted);
  const [isBGMOn, setIsBGMOn] = useState(soundManager.isBGMPlaying);
  const [bgmVolume, setBgmVolume] = useState(soundManager.bgmVolume);
  const mascot = activeEnfant ? getMascot(activeEnfant.avatar) : getMascot("leo");

  const toggleSound = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    soundManager.setMuted(nextMute);
  };

  const toggleBGM = () => {
    soundManager.toggleAmbientBGM();
    setIsBGMOn(soundManager.isBGMPlaying);
    setShowVolumePanel(true);
  };

  // Par défaut, l'app doit s'ouvrir avec un fond sonore audible. Les
  // navigateurs bloquant l'audio avant toute interaction, on démarre la
  // musique d'ambiance dès le tout premier geste de l'utilisateur (tap,
  // clic ou touche), sauf s'il a explicitement coupé le son au préalable.
  React.useEffect(() => {
    if (soundManager.isMuted || soundManager.isBGMPlaying) return;

    const startOnFirstInteraction = () => {
      soundManager.startAmbientBGM();
      setIsBGMOn(soundManager.isBGMPlaying);
      window.removeEventListener("pointerdown", startOnFirstInteraction);
      window.removeEventListener("keydown", startOnFirstInteraction);
    };

    window.addEventListener("pointerdown", startOnFirstInteraction, { once: true });
    window.addEventListener("keydown", startOnFirstInteraction, { once: true });

    return () => {
      window.removeEventListener("pointerdown", startOnFirstInteraction);
      window.removeEventListener("keydown", startOnFirstInteraction);
    };
  }, []);

  const handleVolumeChange = (value: number) => {
    setBgmVolume(value);
    soundManager.setBGMVolume(value);
    // Si on remonte le son alors qu'il était coupé, on relance la musique.
    if (value > 0 && !soundManager.isBGMPlaying && !isMuted) {
      soundManager.startAmbientBGM();
      setIsBGMOn(true);
    }
  };

  const handleNavClick = (path: string) => {
    soundManager.playTapSound();
    onNavigate(path);
  };

  const languages: Array<{ code: Language; flag: string; name: string }> = [
    { code: "fr", flag: "🇫🇷", name: "Français" },
    { code: "en", flag: "🇺🇸", name: "English" },
    { code: "es", flag: "🇪🇸", name: "Español" },
    { code: "de", flag: "🇩🇪", name: "Deutsch" },
    { code: "it", flag: "🇮🇹", name: "Italiano" },
    { code: "pt", flag: "🇵🇹", name: "Português" }
  ];

  // Helper for active navigation
  const isActive = (path: string) => {
    if (path === "/" && currentPath === "/") return true;
    if (path !== "/" && currentPath.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      {/* TOP HEADER BAR */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-amber-200/50 dark:border-gray-800 px-4 py-2.5 transition-colors">
        <div className="max-w-md mx-auto flex items-center justify-between">
          {/* Active Child Profile Badge */}
          <button
            onClick={() => onNavigate("/compte/enfants")}
            className="flex items-center gap-2.5 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-full px-3 py-1 hover:bg-emerald-100 transition-all text-left shadow-sm cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-amber-100 p-0.5 border border-amber-300 flex items-center justify-center overflow-hidden">
              {activeEnfant?.photo ? (
                <img src={activeEnfant.photo} alt={activeEnfant.pseudo} className="w-full h-full object-cover rounded-full" />
              ) : (
                <AnimatedMascot mascot={mascot} size="sm" showQuoteOnClick={false} />
              )}
            </div>
            <div className="leading-tight">
              <div className="text-xs font-bold text-emerald-900 dark:text-emerald-200 truncate max-w-[100px]">
                {activeEnfant ? activeEnfant.pseudo : "Mon Profil"}
              </div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                {activeEnfant ? `Âge: ${activeEnfant.tranche_age} ans` : "Sélectionner"}
              </div>
            </div>
          </button>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1.5">
            {/* Ambient BGM Music Toggle + Volume */}
            <div className="relative">
              <button
                onClick={toggleBGM}
                onDoubleClick={() => setShowVolumePanel((v) => !v)}
                className={`p-2 rounded-full border transition-transform cursor-pointer hover:scale-105 ${
                  isBGMOn
                    ? "bg-amber-300 text-amber-950 border-amber-400 animate-pulse shadow-xs"
                    : "bg-amber-50 dark:bg-gray-800 text-amber-800 dark:text-amber-200 border-amber-200 dark:border-gray-700"
                }`}
                title={isBGMOn ? "Couper la musique de fond" : "Activer la musique de fond"}
              >
                <Music className="w-4 h-4" />
              </button>

              {showVolumePanel && (
                <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl p-3 z-50 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold text-gray-700 dark:text-gray-200">
                      Volume musique
                    </span>
                    <button
                      onClick={() => setShowVolumePanel(false)}
                      className="text-[10px] text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={Math.round(bgmVolume * 100)}
                    onChange={(e) => handleVolumeChange(Number(e.target.value) / 100)}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <div className="text-[10px] text-gray-400 text-right mt-0.5">
                    {Math.round(bgmVolume * 100)}%
                  </div>
                </div>
              )}
            </div>

            {/* Sound Effects Toggle */}
            <button
              onClick={toggleSound}
              className={`p-2 rounded-full border transition-transform cursor-pointer hover:scale-105 ${
                isMuted
                  ? "bg-rose-100 text-rose-700 border-rose-300 dark:bg-rose-950 dark:text-rose-300"
                  : "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300"
              }`}
              title={isMuted ? "Activer les bruitages" : "Couper les bruitages"}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => {
                  soundManager.playTapSound();
                  setShowLangPicker(!showLangPicker);
                }}
                className="flex items-center gap-1 bg-amber-50 dark:bg-gray-800 border border-amber-200 dark:border-gray-700 text-amber-900 dark:text-amber-200 px-2 py-1.5 rounded-full text-xs font-bold shadow-xs hover:scale-105 transition-transform cursor-pointer"
                title="Langue"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-600" />
                <span className="uppercase">{lang}</span>
              </button>

              {showLangPicker && (
                <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        soundManager.playTapSound();
                        onSelectLang(l.code);
                        setShowLangPicker(false);
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-left hover:bg-emerald-50 dark:hover:bg-gray-700 ${
                        lang === l.code ? "bg-emerald-100/60 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-200 font-bold" : "text-gray-700 dark:text-gray-200"
                      }`}
                    >
                      <span className="text-base">{l.flag}</span>
                      <span>{l.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => {
                soundManager.playTapSound();
                onToggleDarkMode();
              }}
              className="p-2 rounded-full bg-amber-50 dark:bg-gray-800 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-gray-700 hover:scale-105 transition-transform cursor-pointer"
              title={isDarkMode ? getTranslation(lang, "lightMode") : getTranslation(lang, "darkMode")}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-emerald-700" />}
            </button>

            {/* Raccourci admin visible UNIQUEMENT si une session admin réelle est active
                (jamais déclenché par l'URL — /admin ne doit être atteignable que tapé directement) */}
            {isAdminLoggedIn && (
              <button
                onClick={() => handleNavClick("/admin")}
                className="p-2 rounded-full bg-purple-100 text-purple-800 border border-purple-300 hover:scale-105 transition-transform cursor-pointer"
                title="Admin Dashboard"
              >
                <ShieldCheck className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-t border-emerald-100 dark:border-gray-800 shadow-2xl pb-safe">
        <div className="max-w-md mx-auto flex items-center justify-around px-2 py-2">
          {/* 1. Accueil */}
          <button
            onClick={() => handleNavClick("/")}
            className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all cursor-pointer ${
              isActive("/") && currentPath === "/"
                ? "text-emerald-600 dark:text-emerald-400 font-bold scale-105"
                : "text-gray-500 dark:text-gray-400 hover:text-emerald-600"
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px]">{getTranslation(lang, "navHome")}</span>
          </button>

          {/* 2. Parcours */}
          <button
            onClick={() => handleNavClick("/parcours")}
            className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all cursor-pointer ${
              isActive("/parcours")
                ? "text-emerald-600 dark:text-emerald-400 font-bold scale-105"
                : "text-gray-500 dark:text-gray-400 hover:text-emerald-600"
            }`}
          >
            <Compass className="w-5 h-5" />
            <span className="text-[10px]">{getTranslation(lang, "navParcours")}</span>
          </button>

          {/* 3. SCANNER - Center Elevated Floating Action Button */}
          <div className="-mt-7 relative group">
            <button
              onClick={() => handleNavClick("/scan")}
              className="w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-600 via-emerald-500 to-amber-400 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 border-4 border-white dark:border-gray-900 active:scale-95 transition-all hover:rotate-6 cursor-pointer"
              title={getTranslation(lang, "scanQrBtn")}
            >
              <QrCode className="w-7 h-7" />
            </button>
            <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-extrabold text-emerald-800 dark:text-emerald-300 tracking-tight whitespace-nowrap bg-amber-200/80 dark:bg-emerald-950 px-2 py-0.5 rounded-full shadow-xs">
              {getTranslation(lang, "scanTitle")}
            </span>
          </div>

          {/* 4. Classement */}
          <button
            onClick={() => handleNavClick("/classement")}
            className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all cursor-pointer ${
              isActive("/classement")
                ? "text-emerald-600 dark:text-emerald-400 font-bold scale-105"
                : "text-gray-500 dark:text-gray-400 hover:text-emerald-600"
            }`}
          >
            <Trophy className="w-5 h-5" />
            <span className="text-[10px]">{getTranslation(lang, "navClassement")}</span>
          </button>

          {/* 5. Profil */}
          <button
            onClick={() => handleNavClick("/profil")}
            className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all cursor-pointer ${
              isActive("/profil")
                ? "text-emerald-600 dark:text-emerald-400 font-bold scale-105"
                : "text-gray-500 dark:text-gray-400 hover:text-emerald-600"
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px]">{getTranslation(lang, "navProfil")}</span>
          </button>
        </div>
      </nav>
    </>
  );
};
