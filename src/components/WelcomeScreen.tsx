/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { booksData } from "../data";

interface WelcomeScreenProps {
  onStart: (childName: string, bookId: number, language: "fr" | "en") => void;
  initialName?: string;
  initialBookId?: number;
  initialLanguage?: "fr" | "en";
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onStart,
  initialName = "",
  initialBookId = 1,
  initialLanguage = "fr"
}) => {
  const [name, setName] = useState(initialName);
  const [selectedBookId, setSelectedBookId] = useState(initialBookId);
  const [lang, setLang] = useState<"fr" | "en">(initialLanguage);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = name.trim() || (lang === "fr" ? "Copain" : "Friend");
    onStart(finalName, selectedBookId, lang);
  };

  return (
    <div className="min-h-screen bg-warm-cream py-8 px-4 flex items-center justify-center font-sans">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl border-8 md:border-12 border-wood-brown overflow-hidden p-6 md:p-10 relative">
        
        {/* Background Decorative SVGs */}
        <div className="absolute top-4 left-4 opacity-10 pointer-events-none">
          <svg className="w-24 h-24 text-green-700" fill="currentColor" viewBox="0 0 100 100">
            <path d="M50 6 Q92 30 78 70 Q64 96 50 94 Q36 96 22 70 Q8 30 50 6 Z" />
          </svg>
        </div>
        <div className="absolute bottom-4 right-4 opacity-10 pointer-events-none">
          <svg className="w-20 h-20 text-yellow-500" fill="currentColor" viewBox="0 0 100 100">
            <polygon points="50,4 62,36 96,38 69,60 79,94 50,74 21,94 31,60 4,38 38,36" />
          </svg>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-serif italic text-forest drop-shadow-sm mb-3">
            {lang === "fr" ? "L'Atelier des Copains de la Forêt" : "The Forest Friends Workshop"}
          </h1>
          <p className="text-lg md:text-xl text-text-charcoal font-medium max-w-xl mx-auto">
            {lang === "fr" 
              ? "Crée, personnalise et joue avec tes livres d'activités préférés ! Destiné aux enfants de 5 à 7 ans." 
              : "Create, customize, and play with your favorite activity books! Designed for kids aged 5 to 7."}
          </p>
        </div>

        {/* Characters Bar */}
        <div className="flex justify-center gap-4 md:gap-8 mb-8 flex-wrap">
          <div className="flex flex-col items-center group">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-orange-100 border-2 border-orange-400 rounded-full flex items-center justify-center shadow-md transform transition group-hover:scale-110">
              <svg className="w-12 h-12 md:w-16 md:h-16"><use href="#c-leo" /></svg>
            </div>
            <span className="text-xs font-bold text-orange-700 mt-1">Léo</span>
          </div>
          <div className="flex flex-col items-center group">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-100 border-2 border-slate-400 rounded-full flex items-center justify-center shadow-md transform transition group-hover:scale-110">
              <svg className="w-12 h-12 md:w-16 md:h-16"><use href="#c-nina" /></svg>
            </div>
            <span className="text-xs font-bold text-slate-700 mt-1">Nina</span>
          </div>
          <div className="flex flex-col items-center group">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-amber-100 border-2 border-amber-600 rounded-full flex items-center justify-center shadow-md transform transition group-hover:scale-110">
              <svg className="w-12 h-12 md:w-16 md:h-16"><use href="#c-tom" /></svg>
            </div>
            <span className="text-xs font-bold text-amber-800 mt-1">{lang === "fr" ? "Darina" : "Darina"}</span>
          </div>
          <div className="flex flex-col items-center group">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-sky-100 border-2 border-sky-400 rounded-full flex items-center justify-center shadow-md transform transition group-hover:scale-110">
              <svg className="w-12 h-12 md:w-16 md:h-16"><use href="#c-zaza" /></svg>
            </div>
            <span className="text-xs font-bold text-sky-700 mt-1">{lang === "fr" ? "Lana" : "Lana"}</span>
          </div>
        </div>

        {/* Configuration Form */}
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
          
          {/* Language Selection */}
          <div className="bg-white p-4 rounded-2xl border-2 border-warm-border shadow-sm flex items-center justify-between">
            <span className="font-bold text-text-charcoal">
              {lang === "fr" ? "🌍 Choisis ta langue :" : "🌍 Choose your language:"}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setLang("fr")}
                className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 border-2 transition ${
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
                className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 border-2 transition ${
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
            <label className="block font-bold text-text-charcoal mb-2 text-left">
              {lang === "fr" ? "✏️ Quel est ton prénom, petit copain ?" : "✏️ What is your name, little friend?"}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={lang === "fr" ? "Écris ton prénom ici..." : "Write your name here..."}
              maxLength={22}
              className="w-full px-4 py-3 rounded-xl border-2 border-warm-border text-lg focus:outline-none focus:border-forest font-handwriting"
            />
          </div>

          {/* Book Selection */}
          <div className="space-y-3">
            <label className="block font-bold text-text-charcoal text-left px-2">
              {lang === "fr" ? "📚 Choisis ton aventure :" : "📚 Choose your adventure:"}
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    onClick={() => setSelectedBookId(book.id)}
                    className={`cursor-pointer rounded-2xl border-4 p-4 bg-white transition relative flex flex-col justify-between ${
                      isSelected
                        ? "border-forest ring-4 ring-forest-light/30 shadow-md"
                        : "border-transparent hover:border-warm-border shadow-sm"
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${tagColor}`}>
                          {lang === "fr" ? `Tome ${book.id}` : `Volume ${book.id}`}
                        </span>
                        {isSelected && <span className="text-forest font-bold text-lg">✔</span>}
                      </div>
                      <h3 className="text-xl font-bold text-forest mb-1">
                        {title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {description}
                      </p>
                    </div>
                    <div className="mt-4 flex gap-1 justify-center">
                      {emojis.map((emoji, idx) => (
                        <span key={idx} className="text-lg">{emoji}</span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-sun-yellow hover:bg-[#ebd056] text-wood-brown font-fun text-2xl py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 transition border-b-4 border-wood-brown font-bold"
            >
              {lang === "fr" ? "🚀 Entrer dans l'Atelier !" : "🚀 Enter the Workshop!"}
            </button>
          </div>

        </form>

        <div className="text-center text-xs text-gray-500 mt-8 border-t border-gray-100 pt-4">
          {lang === "fr" 
            ? "Fait pour les enfants de 5 à 7 ans — Conforme à l'éco-système d'activités interactives." 
            : "Made for children aged 5 to 7 — Complies with the interactive activity ecosystem."}
        </div>
      </div>
    </div>
  );
};
