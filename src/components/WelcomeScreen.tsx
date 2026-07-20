/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { booksData } from "../data";
import { Lock, Sparkles, Moon, Sun } from "lucide-react";
import coverEn from "../assets/images/forest_friends_pwa_icon_1784212488830.jpg";
import coverFr from "../assets/images/forest_friends_pwa_icon_1784283197982.jpg";

interface WelcomeScreenProps {
  onStart: (childName: string, bookId: number, language: "fr" | "en") => void;
  initialName?: string;
  initialBookId?: number;
  initialLanguage?: "fr" | "en";
  isPremium?: boolean;
  onOpenPremiumModal?: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onStart,
  initialName = "",
  initialBookId = 1,
  initialLanguage = "fr",
  isPremium = false,
  onOpenPremiumModal,
  isDarkMode = false,
  onToggleDarkMode
}) => {
  const [name, setName] = useState(initialName);
  const [selectedBookId, setSelectedBookId] = useState(initialBookId);
  const [lang, setLang] = useState<"fr" | "en">(initialLanguage);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedBookId !== 1 && !isPremium) {
      if (onOpenPremiumModal) onOpenPremiumModal();
      return;
    }
    const finalName = name.trim() || (lang === "fr" ? "Copain" : "Friend");
    onStart(finalName, selectedBookId, lang);
  };

  return (
    <div className="min-h-screen bg-warm-cream py-6 sm:py-8 px-2 sm:px-4 flex items-center justify-center font-sans">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl border-4 sm:border-8 md:border-12 border-wood-brown overflow-hidden p-4 sm:p-6 md:p-10 relative">
        
        {/* Theme Toggle Button */}
        {onToggleDarkMode && (
          <button
            type="button"
            onClick={onToggleDarkMode}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full bg-warm-cream hover:bg-warm-linen text-forest border border-warm-border transition shadow-md z-10 cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
            title={isDarkMode ? "Mode jour" : "Mode nuit"}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        )}

        {/* Background Decorative SVGs */}
        <div className="absolute top-4 left-4 opacity-10 pointer-events-none">
          <svg className="w-16 h-16 sm:w-24 sm:h-24 text-green-700" fill="currentColor" viewBox="0 0 100 100">
            <path d="M50 6 Q92 30 78 70 Q64 96 50 94 Q36 96 22 70 Q8 30 50 6 Z" />
          </svg>
        </div>
        <div className="absolute bottom-4 right-4 opacity-10 pointer-events-none">
          <svg className="w-12 h-12 sm:w-20 sm:h-20 text-yellow-500" fill="currentColor" viewBox="0 0 100 100">
            <polygon points="50,4 62,36 96,38 69,60 79,94 50,74 21,94 31,60 4,38 38,36" />
          </svg>
        </div>

        {/* Title */}
        <div className="text-center mb-6 sm:mb-8">
          {isPremium && (
            <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-bold text-xs px-4 py-1.5 rounded-full shadow-md animate-pulse mb-3">
              <Sparkles size={14} />
              {lang === "fr" ? "🎒 Membre Premium 🌟" : "🎒 Premium Member 🌟"}
            </div>
          )}
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif italic text-forest drop-shadow-sm mb-3">
            {lang === "fr" ? "L'Atelier des Copains de la Forêt" : "The Forest Friends Workshop"}
          </h1>
          <p className="text-sm sm:text-base md:text-xl text-text-charcoal font-medium max-w-xl mx-auto px-2">
            {lang === "fr" 
              ? "Crée, personnalise et joue avec tes livres d'activités préférés ! Destiné aux enfants de 5 à 7 ans." 
              : "Create, customize, and play with your favorite activity books! Designed for kids aged 5 to 7."}
          </p>
        </div>

        {/* Characters Bar */}
        <div className="flex justify-center gap-2 sm:gap-4 md:gap-8 mb-6 sm:mb-8 flex-wrap">
          <div className="flex flex-col items-center group">
            <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-orange-100 border-2 border-orange-400 rounded-full flex items-center justify-center shadow-md transform transition group-hover:scale-110">
              <svg className="w-9 h-9 sm:w-12 sm:h-12 md:w-16 md:h-16" viewBox="0 0 120 150">
                <use href="#c-leo" xlinkHref="#c-leo" />
              </svg>
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-orange-700 mt-1">Léo</span>
          </div>
          <div className="flex flex-col items-center group">
            <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-slate-100 border-2 border-slate-400 rounded-full flex items-center justify-center shadow-md transform transition group-hover:scale-110">
              <svg className="w-9 h-9 sm:w-12 sm:h-12 md:w-16 md:h-16" viewBox="0 0 120 150">
                <use href="#c-nina" xlinkHref="#c-nina" />
              </svg>
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-slate-700 mt-1">Nina</span>
          </div>
          <div className="flex flex-col items-center group">
            <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-amber-100 border-2 border-amber-600 rounded-full flex items-center justify-center shadow-md transform transition group-hover:scale-110">
              <svg className="w-9 h-9 sm:w-12 sm:h-12 md:w-16 md:h-16" viewBox="0 0 130 145">
                <use href="#c-tom" xlinkHref="#c-tom" />
              </svg>
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-amber-800 mt-1">{lang === "fr" ? "Darina" : "Darina"}</span>
          </div>
          <div className="flex flex-col items-center group">
            <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-sky-100 border-2 border-sky-400 rounded-full flex items-center justify-center shadow-md transform transition group-hover:scale-110">
              <svg className="w-9 h-9 sm:w-12 sm:h-12 md:w-16 md:h-16" viewBox="0 0 110 145">
                <use href="#c-zaza" xlinkHref="#c-zaza" />
              </svg>
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-sky-700 mt-1">{lang === "fr" ? "Lana" : "Lana"}</span>
          </div>
        </div>

        {/* Configuration Form */}
        <form onSubmit={handleSubmit} className="pb-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-5xl mx-auto">
            {/* Left Column: Input and Selection Controls */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Language Selection */}
              <div className="bg-white p-3 sm:p-4 rounded-2xl border-2 border-warm-border shadow-sm flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                <span className="font-bold text-sm sm:text-base text-text-charcoal text-left">
                  {lang === "fr" ? "🌍 Choisis ta langue :" : "🌍 Choose your language:"}
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setLang("fr")}
                    className={`flex-1 sm:flex-none px-3 py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 border-2 transition cursor-pointer min-h-[44px] ${
                      lang === "fr"
                        ? "bg-forest text-white border-forest"
                        : "bg-white text-text-charcoal border-warm-border hover:border-forest-light"
                    }`}
                  >
                    <span>🇫🇷</span> Français
                  </button>
                  <button
                    type="button"
                    onClick={() => setLang("en")}
                    className={`flex-1 sm:flex-none px-3 py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 border-2 transition cursor-pointer min-h-[44px] ${
                      lang === "en"
                        ? "bg-forest text-white border-forest"
                        : "bg-white text-text-charcoal border-warm-border hover:border-forest-light"
                    }`}
                  >
                    <span>🇬🇧</span> English
                  </button>
                </div>
              </div>

              {/* Child's Name Input */}
              <div className="bg-white p-4 rounded-2xl border-2 border-warm-border shadow-sm">
                <label className="block font-bold text-sm sm:text-base text-text-charcoal mb-2 text-left">
                  {lang === "fr" ? "✏️ Quel est ton prénom, petit copain ?" : "✏️ What is your name, little friend?"}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={lang === "fr" ? "Écris ton prénom ici..." : "Write your name here..."}
                  maxLength={22}
                  className="w-full px-4 py-3 rounded-xl border-2 border-warm-border text-base sm:text-lg focus:outline-none focus:border-forest font-handwriting min-h-[44px]"
                />
              </div>

              {/* Book Selection */}
              <div className="space-y-3">
                <label className="block font-bold text-sm sm:text-base text-text-charcoal text-left px-2">
                  {lang === "fr" ? "📚 Choisis ton aventure :" : "📚 Choose your adventure:"}
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4 md:gap-6">
                  {booksData.map((book) => {
                    const isSelected = selectedBookId === book.id;
                    // Alternate colors for Tome tags
                    const tagColors = [
                      "bg-green-100 text-green-700",
                      "bg-orange-100 text-orange-700",
                      "bg-sky-100 text-sky-700",
                      "bg-purple-100 text-purple-700"
                    ];
                    const tagColor = tagColors[(book.id - 1) % tagColors.length];
                    
                    // Book Title and description based on current language
                    const title = lang === "fr" ? book.titleFr : book.titleEn;
                    const description = lang === "fr" ? book.descriptionFr : book.descriptionEn;
                    const emojis = book.themeEmojis || ["📖", "🌟", "✨"];

                    return (
                      <div
                        key={book.id}
                        onClick={() => {
                          if (book.id !== 1 && !isPremium) {
                            if (onOpenPremiumModal) onOpenPremiumModal();
                          } else {
                            setSelectedBookId(book.id);
                          }
                        }}
                        className={`cursor-pointer rounded-2xl border-4 p-4 bg-white transition relative flex flex-col justify-between min-h-[44px] ${
                          isSelected
                            ? "border-forest ring-4 ring-forest-light/30 shadow-md"
                            : "border-transparent hover:border-warm-border shadow-sm"
                        }`}
                      >
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className={`text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full ${tagColor} flex items-center gap-1`}>
                              {lang === "fr" ? `Tome ${book.id}` : `Volume ${book.id}`}
                              {book.id !== 1 && !isPremium && <Lock size={12} />}
                            </span>
                            {isSelected && <span className="text-forest font-bold text-base sm:text-lg">✔</span>}
                          </div>
                          <h3 className="text-base sm:text-lg md:text-xl font-bold text-forest mb-1 text-left flex items-center gap-1.5 flex-wrap">
                            {title}
                            {book.id !== 1 && !isPremium && (
                              <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full font-bold flex items-center gap-0.5 shadow-sm">
                                <Lock size={10} />
                                {lang === "fr" ? "Premium" : "Premium"}
                              </span>
                            )}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-600 line-clamp-3 text-left">
                            {description}
                          </p>
                        </div>
                        <div className="mt-3 flex gap-1 justify-center">
                          {emojis.map((emoji, idx) => (
                            <span key={idx} className="text-sm sm:text-lg">{emoji}</span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Right Column: Live Book Mockup */}
            <div className="lg:col-span-5 flex flex-col items-center justify-start pt-2">
              <div className="w-full max-w-[340px] bg-white rounded-3xl p-4 border-2 border-warm-border shadow-md text-center">
                <p className="font-fun font-bold text-forest text-sm sm:text-base mb-2">
                  {lang === "fr" ? "📖 Ton vrai cahier d'activités !" : "📖 Your real activity book!"}
                </p>
                <p className="text-[11px] text-gray-500 mb-4 leading-tight">
                  {lang === "fr"
                    ? "Voici la couverture officielle imprimable avec ton prénom écrit dessus !"
                    : "Here is the official printable cover with your name written on it!"}
                </p>
                
                {/* 3D Book Cover Cover Mockup */}
                <div className="relative aspect-[1/1.5] w-full bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-wood-brown/40 group transition-all duration-300 hover:rotate-1">
                  {/* Real-book spine & gradient effects */}
                  <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/25 via-black/5 to-transparent z-10" />
                  <div className="absolute inset-y-0 left-3 w-1 bg-white/15 z-10" />
                  
                  {/* Cover Image based on current language */}
                  <img
                    src={lang === "fr" ? coverFr : coverEn}
                    alt="Cahier de la Forêt"
                    className="w-full h-full object-cover select-none pointer-events-none"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Kids Name overlay on the underline */}
                  <div
                    className="absolute text-center select-none pointer-events-none font-handwriting text-[#1d4ed8] font-black drop-shadow-sm leading-none flex items-center justify-center text-ellipsis overflow-hidden whitespace-nowrap"
                    style={{
                      bottom: "4.8%",
                      left: lang === "fr" ? "35%" : "44%",
                      right: "8%",
                      height: "6%",
                      fontSize: "clamp(12px, 3.5vw, 18px)",
                      fontFamily: '"Short Stack", cursive, sans-serif'
                    }}
                  >
                    {name.trim() || "______"}
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Floating Submit Button */}
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md px-4 no-print">
            <button
              type="submit"
              className="w-full bg-sun-yellow hover:bg-[#ebd056] text-wood-brown font-fun text-lg sm:text-2xl py-3 sm:py-4 px-6 sm:px-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 transition border-b-4 border-wood-brown font-bold cursor-pointer min-h-[44px]"
            >
              {lang === "fr" ? "🚀 Entrer dans l'Atelier !" : "🚀 Enter the Workshop!"}
            </button>
          </div>

        </form>

        <div className="text-center text-[10px] sm:text-xs text-gray-500 mt-4 border-t border-gray-100 pt-4 pb-2">
          {lang === "fr" 
            ? "Fait pour les enfants de 5 à 7 ans — Conforme à l'éco-système d'activités interactives." 
            : "Made for children aged 5 to 7 — Complies with the interactive activity ecosystem."}
        </div>
      </div>
    </div>
  );
};
