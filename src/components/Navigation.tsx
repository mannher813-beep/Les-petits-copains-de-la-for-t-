import React, { useState } from "react";
import { Home, Compass, QrCode, Trophy, User, Moon, Sun, Globe, Settings, ShieldCheck, Volume2, VolumeX, Music, Sliders, Volume1 } from "lucide-react";
import { Enfant } from "../types/multiTome";
import { Language, getTranslation } from "../i18n/translations";
import { getMascot } from "../types/mascots";
import { AnimatedMascot } from "./AnimatedMascot";
import { soundManager } from "../utils/audioCelebration";
import { backgroundMusic } from "../utils/backgroundMusic";

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
  const [showVolumeMenu, setShowVolumeMenu] = useState(false);
  const [isMuted, setIsMuted] = useState(soundManager.isMuted);
  const [isMusicMuted, setIsMusicMuted] = useState(backgroundMusic.getMuted());
  const [musicVol, setMusicVol] = useState(backgroundMusic.getVolume());
  const [soundVol, setSoundVol] = useState(soundManager.getVolume());

  const mascot = activeEnfant ? getMascot(activeEnfant.avatar) : getMascot("leo");

  const toggleSound = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    soundManager.setMuted(nextMute);
  };

  const toggleMusic = () => {
    const nextMute = backgroundMusic.toggleMute();
    setIsMusicMuted(nextMute);
  };

  const handleMusicVolChange = (v: number) => {
    setMusicVol(v);
    backgroundMusic.setVolume(v);
    setIsMusicMuted(backgroundMusic.getMuted());
  };

  const handleSoundVolChange = (v: number) => {
    setSoundVol(v);
    soundManager.setVolume(v);
    setIsMuted(soundManager.isMuted);
    soundManager.playTapSound();
  };

  const handleNavClick = (path: string) => {
    soundManager.playTapSound();
    onNavigate(path);
  };

  const languages: Array<{ code: Language; flag: string; name: string }> = [
    { code: "fr", flag: "🇫🇷", name: "Français" },
    { code: "en", flag: "🇬🇧", name: "English" },
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
            <div className="w-8 h-8 rounded-full bg-amber-100 p-0.5 border border-amber-300 flex items-center justify-center overflow-visible relative">
              <AnimatedMascot avatarId={activeEnfant?.avatar} mascot={mascot} size="sm" popOutOfFrame={true} showQuoteOnClick={false} />
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
          <div className="flex items-center gap-1.5 relative">
            {/* Volume Control Sliders Toggle Button */}
            <button
              onClick={() => {
                soundManager.playTapSound();
                setShowVolumeMenu(!showVolumeMenu);
                setShowLangPicker(false);
              }}
              className={`p-2 rounded-full border transition-all cursor-pointer hover:scale-105 flex items-center justify-center relative ${
                showVolumeMenu
                  ? "bg-amber-500 text-white border-amber-600 shadow-md scale-105"
                  : isMuted && isMusicMuted
                  ? "bg-rose-100 text-rose-700 border-rose-300 dark:bg-rose-950 dark:text-rose-300"
                  : "bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-200"
              }`}
              title="Ajuster le volume (Musique & Bruitages)"
            >
              <Sliders className="w-4 h-4" />
            </button>

            {/* Volume Control Popover Panel */}
            {showVolumeMenu && (
              <div className="absolute top-11 right-0 z-50 w-80 bg-white dark:bg-gray-800 border-2 border-amber-300 dark:border-amber-700 rounded-3xl shadow-2xl p-4 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between mb-3 border-b border-amber-100 dark:border-gray-700 pb-2">
                  <div className="flex items-center gap-2 font-fun text-amber-900 dark:text-amber-200 text-sm">
                    <Sliders className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Réglage des Volumes</span>
                  </div>
                  <button
                    onClick={() => setShowVolumeMenu(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xs font-bold px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                {/* Slider 1: Générique Musical (Fond) */}
                <div className="mb-3.5 bg-amber-50/80 dark:bg-gray-900/60 p-3 rounded-2xl border border-amber-200/60 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-950 dark:text-amber-200">
                      <Music className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      <span>Musique de fond</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-extrabold text-amber-700 dark:text-amber-300 w-9 text-right font-mono">
                        {isMusicMuted ? "Muet" : `${Math.round(musicVol * 100)}%`}
                      </span>
                      <button
                        onClick={toggleMusic}
                        className={`p-1 rounded-full text-xs transition-colors cursor-pointer ${
                          isMusicMuted
                            ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                            : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                        }`}
                        title={isMusicMuted ? "Activer la musique" : "Couper la musique"}
                      >
                        {isMusicMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMusicMuted ? 0 : musicVol}
                    onChange={(e) => handleMusicVolChange(parseFloat(e.target.value))}
                    className="w-full accent-amber-500 hover:accent-amber-600 cursor-pointer h-2 bg-amber-200 dark:bg-gray-700 rounded-lg"
                  />
                </div>

                {/* Slider 2: Effets Sonores (Bruitages) */}
                <div className="bg-emerald-50/80 dark:bg-gray-900/60 p-3 rounded-2xl border border-emerald-200/60 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-950 dark:text-emerald-200">
                      <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Bruitages & Victoires</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-300 w-9 text-right font-mono">
                        {isMuted ? "Muet" : `${Math.round(soundVol * 100)}%`}
                      </span>
                      <button
                        onClick={toggleSound}
                        className={`p-1 rounded-full text-xs transition-colors cursor-pointer ${
                          isMuted
                            ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                            : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                        }`}
                        title={isMuted ? "Activer les bruitages" : "Couper les bruitages"}
                      >
                        {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : soundVol}
                    onChange={(e) => handleSoundVolChange(parseFloat(e.target.value))}
                    className="w-full accent-emerald-500 hover:accent-emerald-600 cursor-pointer h-2 bg-emerald-200 dark:bg-gray-700 rounded-lg"
                  />
                </div>

                {/* Sound Test Button */}
                <button
                  onClick={() => soundManager.playCorrectAnswer()}
                  className="w-full mt-3 py-1.5 px-3 bg-amber-100 hover:bg-amber-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-amber-900 dark:text-amber-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-amber-300 dark:border-gray-600"
                >
                  <Volume1 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Tester le volume sonore 🔔</span>
                </button>
              </div>
            )}

            {/* Background Music Quick Toggle */}
            <button
              onClick={toggleMusic}
              className={`p-2 rounded-full border transition-transform cursor-pointer hover:scale-105 ${
                isMusicMuted
                  ? "bg-amber-100/60 text-amber-700/60 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400/60"
                  : "bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-200 shadow-xs animate-pulse-subtle"
              }`}
              title={isMusicMuted ? "Activer le générique musical" : "Couper le générique musical"}
            >
              <Music className={`w-4 h-4 ${!isMusicMuted ? "text-amber-600 dark:text-amber-300 font-bold" : "line-through"}`} />
            </button>

            {/* Sound Effects Quick Toggle */}
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
                type="button"
                onClick={() => {
                  soundManager.playTapSound();
                  setShowLangPicker(!showLangPicker);
                }}
                className="flex items-center gap-1.5 bg-amber-50 dark:bg-gray-800 border-2 border-amber-200 dark:border-gray-700 text-amber-900 dark:text-amber-200 px-2.5 py-1 rounded-full text-xs font-black shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
                title={getTranslation(lang, "language")}
              >
                <span className="text-sm">{languages.find(l => l.code === lang)?.flag || "🌐"}</span>
                <span className="uppercase font-fun">{lang}</span>
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
