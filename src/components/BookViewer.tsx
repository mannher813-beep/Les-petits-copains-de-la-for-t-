/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { BookData, UserProgress } from "../types";
import { DrawingCanvas } from "./DrawingCanvas";
import { 
  CheckCircle, 
  HelpCircle, 
  Volume2, 
  VolumeX, 
  BookOpen, 
  ArrowLeft, 
  ArrowRight,
  Sparkles,
  Trophy,
  Undo
} from "lucide-react";

interface BookViewerProps {
  book: BookData;
  progress: UserProgress;
  onChangeProgress: (updater: (prev: UserProgress) => UserProgress) => void;
  onExit: () => void;
}

export const BookViewer: React.FC<BookViewerProps> = ({
  book,
  progress,
  onChangeProgress,
  onExit
}) => {
  const { childName, currentLanguage: lang, currentPage } = progress;
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Track selected options for each QCM
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  // Track grid targets found
  const [gridFound, setGridFound] = useState<Record<string, string[]>>({});
  // Track drawing canvas states
  const [drawings, setDrawings] = useState<Record<string, string>>({});
  // Track handwritten text inputs
  const [textInputs, setTextInputs] = useState<Record<string, string>>({});
  // Track connecting pairs (matching)
  const [activeMatch, setActiveMatch] = useState<{ missionId: number; leftIndex: number } | null>(null);
  const [matches, setMatches] = useState<Record<string, Record<number, number>>>({}); // maps left index to right index

  // Simple Web Audio API sound player for sweet kid-friendly sound effects
  const playSound = (type: "correct" | "incorrect" | "badge" | "click") => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === "correct") {
        // High, happy beep
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.12); // E5
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      } else if (type === "incorrect") {
        // Lower buzzing sound
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      } else if (type === "badge") {
        // Magical arpeggio
        const now = ctx.currentTime;
        [261.63, 329.63, 392.00, 523.25, 659.25].forEach((freq, idx) => {
          const oscNode = ctx.createOscillator();
          const gainNode = ctx.createGain();
          oscNode.connect(gainNode);
          gainNode.connect(ctx.destination);
          oscNode.frequency.setValueAtTime(freq, now + idx * 0.08);
          gainNode.gain.setValueAtTime(0.08, now + idx * 0.08);
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.08 + 0.3);
          oscNode.start(now + idx * 0.08);
          oscNode.stop(now + idx * 0.08 + 0.3);
        });
      } else if (type === "click") {
        // Simple subtle tap
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      }
    } catch (e) {
      console.warn("Web Audio API not supported or blocked", e);
    }
  };

  // Helper to get total pages
  const totalPages = 40;

  const navigateToPage = (target: number) => {
    playSound("click");
    onChangeProgress(prev => ({
      ...prev,
      currentPage: Math.max(1, Math.min(totalPages, target))
    }));
  };

  // Determine what content belongs on the current page
  // Page 1: Cover
  // Page 2: Presentation
  // Pages 3-8: Chapter 1 (Cover, Story, M1/2, M3/4, M5/6, Badge)
  // Pages 9-16: Chapter 2 (Cover, Story, M7/8, M9/10, M11/12, M13/14, M15/16, Badge)
  // Pages 17-24: Chapter 3 (Cover, Story, M17/18, M19/20, M21/22, M23/24, M25/26, Badge)
  // Pages 25-32: Chapter 4 (Cover, Story, M27/28, M29/30, M31/32, M33/34, M35/36, Badge)
  // Pages 33-39: Chapter 5 (Cover, Story, M37/38, M39/40, M41/42, M43/44, Badge)
  // Page 40: Diploma

  // Returns { type: "cover" | "presentation" | "chap-cover" | "story" | "exercises" | "badge" | "diploma", chapter?: Chapter }
  const getPageConfig = (page: number) => {
    if (page === 1) return { type: "cover" };
    if (page === 2) return { type: "presentation" };
    if (page === 40) return { type: "diploma" };

    // Find corresponding chapter
    let chapId = 1;
    let offset = 3; // Chap 1 starts at page 3

    if (page >= 3 && page <= 8) {
      chapId = 1;
      offset = 3;
    } else if (page >= 9 && page <= 16) {
      chapId = 2;
      offset = 9;
    } else if (page >= 17 && page <= 24) {
      chapId = 3;
      offset = 17;
    } else if (page >= 25 && page <= 32) {
      chapId = 4;
      offset = 25;
    } else if (page >= 33 && page <= 39) {
      chapId = 5;
      offset = 33;
    }

    const chapter = book.chapters.find(c => c.id === chapId)!;
    const relPage = page - offset; // 0: Cover, 1: Story, 2+: Exercises, last: Badge

    const isLastOfChapter = (chapId === 1 && relPage === 5) || 
                          (chapId > 1 && relPage === (chapId === 5 ? 6 : 7));

    if (relPage === 0) return { type: "chap-cover", chapter };
    if (relPage === 1) return { type: "story", chapter };
    if (isLastOfChapter) return { type: "badge", chapter };

    // Exercise page. Map the relative page to specific missions
    // In Chap 1 (total 6 pages): page 5 (M1, M2), page 6 (M3, M4), page 7 (M5, M6)
    // In Chap 2 (total 8 pages): page 11 (M7, M8), page 12 (M9, M10), page 13 (M11, M12), page 14 (M13, M14), page 15 (M15, M16)
    // In Chap 3 (total 8 pages): page 19 (M17, M18), page 20 (M19, M20), page 21 (M21, M22), page 22 (M23, M24), page 23 (M25, M26)
    // In Chap 4 (total 8 pages): page 27 (M27, M28), page 28 (M29, M30), page 29 (M31, M32), page 30 (M33, M34), page 31 (M35, M36)
    // In Chap 5 (total 7 pages): page 35 (M37, M38), page 36 (M39, M40), page 37 (M41, M42), page 38 (M43, M44)
    let mIndexStart = (relPage - 2) * 2;
    const missions = chapter.missions.slice(mIndexStart, mIndexStart + 2);

    return { type: "exercises", chapter, missions };
  };

  const pageConfig = getPageConfig(currentPage);

  // Handle QCM Option Click
  const handleQcmClick = (missionId: number, optionId: string, isCorrect?: boolean) => {
    setSelectedOptions(prev => ({
      ...prev,
      [missionId]: optionId
    }));
    playSound(isCorrect ? "correct" : "incorrect");
  };

  // Handle Grid Item Toggle
  const handleGridClick = (missionId: number, itemId: string, isTarget: boolean, maxTargets: number) => {
    const key = `${missionId}`;
    const current = gridFound[key] || [];
    let updated = [...current];

    if (current.includes(itemId)) {
      updated = updated.filter(id => id !== itemId);
      playSound("click");
    } else {
      updated.push(itemId);
      playSound(isTarget ? "correct" : "incorrect");
    }

    setGridFound(prev => ({
      ...prev,
      [key]: updated
    }));

    // Auto congrats if found all targets
    if (isTarget && updated.filter(id => id.startsWith(`${missionId}`)).length === maxTargets) {
      playSound("correct");
    }
  };

  // Handle Matching pair linking
  const handleMatchClick = (missionId: number, index: number, side: "left" | "right", correctIndex: number) => {
    if (side === "left") {
      setActiveMatch({ missionId, leftIndex: index });
      playSound("click");
    } else if (side === "right" && activeMatch && activeMatch.missionId === missionId) {
      const leftIdx = activeMatch.leftIndex;
      const isCorrectMatch = leftIdx === index; // In our layout, correct pairs share same indices

      if (isCorrectMatch) {
        setMatches(prev => ({
          ...prev,
          [missionId]: {
            ...(prev[missionId] || {}),
            [leftIdx]: index
          }
        }));
        playSound("correct");
      } else {
        playSound("incorrect");
      }
      setActiveMatch(null);
    }
  };

  const renderDifficultyStars = (difficulty: number = 1) => {
    const stars = [];
    for (let i = 0; i < 3; i++) {
      stars.push(
        <span 
          key={i} 
          className={`text-sm sm:text-base transition-all duration-300 ${i < difficulty ? "text-yellow-500 font-bold" : "text-gray-300 opacity-40"}`}
        >
          ★
        </span>
      );
    }
    return (
      <div className="flex items-center gap-0.5" title={`Difficulty: ${difficulty}/3`}>
        {stars}
      </div>
    );
  };

  const isMatched = (missionId: number, leftIdx: number) => {
    return matches[missionId] && matches[missionId][leftIdx] !== undefined;
  };

  // Find current chapter or stage for the progress bar
  let progressText = "";
  let progressPercentage = 0;

  if (currentPage === 1) {
    progressText = lang === "fr" ? "Couverture 📖" : "Cover 📖";
    progressPercentage = 2.5;
  } else if (currentPage === 2) {
    progressText = lang === "fr" ? "Présentation de l'Atelier" : "Workshop Introduction";
    progressPercentage = 5;
  } else if (currentPage === 40) {
    progressText = lang === "fr" ? "Diplôme d'Honneur ! 🎓" : "Honorary Diploma! 🎓";
    progressPercentage = 100;
  } else if (pageConfig.chapter) {
    const chapNum = pageConfig.chapter.id; // 1 to 5
    progressText = lang === "fr" 
      ? `Chapitre ${chapNum}/5 : ${pageConfig.chapter.titleFr}` 
      : `Chapter ${chapNum}/5: ${pageConfig.chapter.titleEn}`;
    progressPercentage = Math.round(5 + ((currentPage - 2) / 38) * 95);
  }

  return (
    <div className="min-h-screen warm-organic-dots py-4 px-2 md:px-8 pb-24 font-sans select-none relative">
      
      {/* Top Header controls */}
      <header className="no-print max-w-5xl mx-auto flex items-center justify-between mb-4 bg-white/90 backdrop-blur-sm p-4 rounded-2xl border-2 border-warm-border shadow-md">
        <button 
          onClick={onExit}
          className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-xl font-bold transition border border-red-200 cursor-pointer min-h-[44px]"
        >
          <ArrowLeft size={18} />
          {lang === "fr" ? "Quitter l'Atelier" : "Leave Workshop"}
        </button>

        <div className="flex items-center gap-4">
          {/* Sound toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 bg-warm-cream hover:bg-warm-linen text-forest rounded-xl border border-warm-border transition cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            title={soundEnabled ? "Couper le son" : "Activer le son"}
          >
            {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>

          {/* Book & Name Info */}
          <div className="text-right hidden sm:block">
            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">
              {lang === "fr" ? "Copain actif" : "Active friend"}
            </p>
            <p className="font-fun text-forest font-bold">{childName}</p>
          </div>
        </div>
      </header>

      {/* Chapter Progress Bar */}
      <div className="max-w-4xl mx-auto mb-4 bg-white/90 backdrop-blur-sm p-3 rounded-2xl border-2 border-warm-border shadow-md no-print">
        <div className="flex items-center justify-between gap-2 mb-1.5 px-1 flex-wrap">
          <span className="text-xs sm:text-sm font-bold text-forest flex items-center gap-1.5">
            <span>🎨</span> {progressText}
          </span>
          <span className="text-xs font-mono font-bold text-gray-500 bg-warm-cream px-2 py-0.5 rounded-full border border-warm-border">
            {lang === "fr" ? "Progression : " : "Progress: "}{progressPercentage}%
          </span>
        </div>
        <div className="w-full bg-warm-linen rounded-full h-3.5 overflow-hidden border border-warm-border p-0.5">
          <div 
            className="bg-forest h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Main Book Viewer */}
      <main className="max-w-4xl mx-auto flex flex-col items-center w-full">
        
        {/* Printable/Interactive Book Spreads */}
        <div 
          className="w-full max-w-[210mm] min-h-0 sm:min-h-[296mm] bg-white rounded-2xl shadow-2xl border-4 sm:border-8 md:border-12 border-wood-brown p-4 sm:p-8 md:p-12 flex flex-col justify-between relative overflow-hidden transition-all duration-300 transform-gpu"
          style={{ 
            color: "var(--color-text-charcoal)",
            boxShadow: "0 25px 50px -12px rgba(139, 94, 60, 0.35)",
            background: "radial-gradient(circle, #ffffff 0%, #F7F3E9 100%)"
          }}
        >
          {/* Realistic book crease effect */}
          <div className="absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-black/5 to-transparent pointer-events-none" />

          {/* PAGE RENDER CONTROLLER */}
          <div className="flex-1 flex flex-col justify-between">
            
            {/* 1. COVER PAGE */}
            {pageConfig.type === "cover" && (
              <div className="flex flex-col items-center justify-between h-full text-center py-6">
                <div>
                  <p className="text-xs tracking-widest text-[#8c7b60] font-bold uppercase mb-2">
                    {lang === "fr" ? "🌟 CAHIER D'ACTIVITÉS ÉDUCATIF 🌟" : "🌟 EDUCATIONAL ACTIVITY BOOK 🌟"}
                  </p>
                  <p className="text-sm font-bold text-forest-light">
                    {lang === "fr" ? "Pour les enfants de 5 à 7 ans" : "For children aged 5 to 7"}
                  </p>
                </div>

                {/* Big central customized vector cover */}
                <div className="w-full max-w-lg my-6 bg-white border-4 border-dashed border-forest-light rounded-3xl p-6 shadow-md relative overflow-hidden">
                  <h1 className="text-4xl md:text-5xl font-serif italic text-forest leading-tight mb-2">
                    {book.id === 1 
                      ? (lang === "fr" ? "La Rencontre" : "The Meeting") 
                      : (lang === "fr" ? "La Cabane dans les Arbres" : "The Treehouse")}
                  </h1>
                  <p className="text-lg font-handwriting text-wood-brown font-bold mb-4">
                    {lang === "fr" ? "Les Copains de la Forêt" : "The Forest Friends"}
                  </p>

                  {/* Group vector scenic placeholder */}
                  <svg className="w-full h-48 mx-auto filter drop-shadow-sm" viewBox="0 0 400 200">
                    <rect width="400" height="150" fill="#d2f1fc" rx="10"/>
                    <rect y="120" width="400" height="80" fill="#bfe3a8" rx="10"/>
                    <use href="#d-soleil" x="20" y="15" width="45" height="45"/>
                    <use href="#d-tree" x="320" y="40" width="60" height="90"/>
                    <use href="#d-sapin" x="30" y="55" width="55" height="85"/>
                    
                    {/* Render different items per Tome */}
                    {book.id === 1 ? (
                      <g>
                        <use href="#c-leo" x="120" y="80" width="65" height="80"/>
                        <use href="#c-nina" x="185" y="90" width="55" height="70"/>
                      </g>
                    ) : (
                      <g>
                        {/* Treehouse graphic */}
                        <rect x="150" y="50" width="90" height="70" rx="4" fill="#a8713f" stroke="#fff" strokeWidth="2"/>
                        <polygon points="140,50 195,15 250,50" fill="#e05a4e" stroke="#fff" strokeWidth="2"/>
                        <use href="#c-leo" x="90" y="80" width="65" height="80"/>
                        <use href="#c-nina" x="250" y="90" width="55" height="70"/>
                      </g>
                    )}
                  </svg>

                  {/* Personalized text */}
                  <div className="mt-6 bg-white/95 py-3 px-6 rounded-2xl border-2 border-dashed border-forest-light inline-block shadow-inner">
                    <p className="text-xs text-gray-500 font-bold uppercase mb-1">
                      {lang === "fr" ? "Ce cahier t'appartient !" : "This book belongs to you!"}
                    </p>
                    <p className="text-2xl font-handwriting text-forest font-bold px-4">
                      {childName}
                    </p>
                  </div>
                </div>

                <div className="text-center text-sm text-gray-500 max-w-sm leading-relaxed">
                  <p className="font-bold">© TechSen for Kids 2026</p>
                  <p className="text-xs mt-1">
                    {lang === "fr" 
                      ? "Tous droits réservés. Ne peut être vendu séparément du pack d'apprentissage forestier." 
                      : "All rights reserved. Not to be sold separately from the forest learning pack."}
                  </p>
                </div>
              </div>
            )}

            {/* 2. CHARACTERS PRESENTATION PAGE */}
            {pageConfig.type === "presentation" && (
              <div className="py-2">
                <h2 className="text-3xl font-serif italic font-medium text-forest mb-2">
                  {lang === "fr" ? "Bonjour, toi ! 👋" : "Hello, you! 👋"}
                </h2>
                <p className="text-center text-lg text-gray-600 mb-6 font-medium">
                  {lang === "fr" 
                    ? "Nous sommes les Copains de la Forêt. Viens, on se présente !" 
                    : "We are the Forest Friends. Come, let's meet each other!"}
                </p>

                {/* Grid of characters */}
                <div className="space-y-4">
                  <div className="flex gap-4 items-center bg-orange-50/50 p-3 rounded-2xl border border-orange-100">
                    <div className="w-16 h-16 bg-white border-2 border-orange-300 rounded-full flex items-center justify-center shrink-0">
                      <svg className="w-12 h-12"><use href="#c-leo" /></svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-orange-800 text-lg">
                        {lang === "fr" ? "Léo le renard" : "Leo the Fox"}
                      </h4>
                      <p className="text-sm text-gray-600 leading-tight">
                        {lang === "fr"
                          ? "« Salut ! Je suis roux et très malin. J'adore les devinettes… et les pommes ! »"
                          : "'Hi! I'm orange and very clever. I love riddles... and apples!'"}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-center bg-slate-50 p-3 rounded-2xl border border-slate-200">
                    <div className="w-16 h-16 bg-white border-2 border-slate-300 rounded-full flex items-center justify-center shrink-0">
                      <svg className="w-12 h-12"><use href="#c-nina" /></svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-lg">
                        {lang === "fr" ? "Nina la souris" : "Nina the Mouse"}
                      </h4>
                      <p className="text-sm text-gray-600 leading-tight">
                        {lang === "fr"
                          ? "« Coucou ! Je suis petite mais super rapide. Je connais tous les chemins de la forêt. »"
                          : "'Hi! I am small but super fast. I know all the paths in the forest.'"}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-center bg-amber-50/50 p-3 rounded-2xl border border-amber-100">
                    <div className="w-16 h-16 bg-white border-2 border-amber-400 rounded-full flex items-center justify-center shrink-0">
                      <svg className="w-12 h-12"><use href="#c-tom" /></svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-amber-900 text-lg">
                        {lang === "fr" ? "Darina la hérissonne" : "Darina the Hedgehog"}
                      </h4>
                      <p className="text-sm text-gray-600 leading-tight">
                        {lang === "fr"
                          ? "« Bonjour… Je suis piquante dehors, mais toute douce dedans. J'aime compter les noisettes. »"
                          : "'Hello... I am prickly outside, but very soft inside. I love counting hazelnuts.'"}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-center bg-sky-50 p-3 rounded-2xl border border-sky-100">
                    <div className="w-16 h-16 bg-white border-2 border-sky-300 rounded-full flex items-center justify-center shrink-0">
                      <svg className="w-12 h-12"><use href="#c-zaza" /></svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-sky-800 text-lg">
                        {lang === "fr" ? "Lana l'oiseau" : "Lana the Bird"}
                      </h4>
                      <p className="text-sm text-gray-600 leading-tight">
                        {lang === "fr"
                          ? "« Cui-cui ! Je chante, je vole, je vois tout d'en haut. Bienvenue ! »"
                          : "'Tweet-tweet! I sing, I fly, I see everything from above. Welcome!'"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 bg-forest/10 border-2 border-forest rounded-2xl p-4 text-center">
                  <p className="text-xl font-bold text-forest">
                    {lang === "fr" ? `🌟 Et toi, ${childName}, tu es notre 5ᵉ Copain ! 🌟` : `🌟 And you, ${childName}, are our 5th Friend! 🌟`}
                  </p>
                  <p className="text-sm text-gray-700 mt-1">
                    {lang === "fr"
                      ? "Dans ce cahier, les Copains ont besoin de ton aide pour vivre une grande aventure. À chaque page, une mission t'attend !"
                      : "In this book, the Friends need your help to live a great adventure. On each page, a mission awaits you!"}
                  </p>
                </div>
              </div>
            )}

            {/* 3. CHAPTER COVER PAGE */}
            {pageConfig.type === "chap-cover" && pageConfig.chapter && (
              <div className="flex flex-col justify-between h-full py-4 text-center">
                {/* Chapter Banner */}
                <div className="bg-forest text-white rounded-3xl p-4 flex items-center gap-4 shadow-md text-left border-2 border-dashed border-white/40">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shrink-0">
                    <svg className="w-12 h-12"><use href={`#c-${pageConfig.chapter.missions[0]?.character || "leo"}`} /></svg>
                  </div>
                  <div>
                    <span className="text-xs uppercase font-black tracking-widest text-yellow-300">
                      {lang === "fr" ? `Chapitre ${pageConfig.chapter.id}` : `Chapter ${pageConfig.chapter.id}`}
                    </span>
                    <h2 className="text-2xl font-serif italic font-medium">
                      {lang === "fr" ? pageConfig.chapter.titleFr : pageConfig.chapter.titleEn}
                    </h2>
                  </div>
                </div>

                {/* Beautiful custom vector illustrations for Chapter Covers */}
                <div className="my-6 relative border-4 border-dashed border-forest-light rounded-3xl overflow-hidden aspect-[4/3] bg-white shadow-inner flex flex-col justify-between p-4">
                  {/* Floating elements */}
                  <div className="absolute top-4 left-4">
                    <svg className="w-12 h-12 text-yellow-400 filter drop-shadow" fill="currentColor" viewBox="0 0 100 100">
                      <use href="#d-soleil" />
                    </svg>
                  </div>
                  <div className="absolute top-6 right-12 opacity-60">
                    <svg className="w-16 h-8 text-white" fill="currentColor" viewBox="0 0 120 60">
                      <use href="#d-nuage" />
                    </svg>
                  </div>

                  {/* Main scenic render depending on chapter */}
                  <div className="flex-1 flex items-center justify-center">
                    {pageConfig.chapter.id === 1 && (
                      <div className="relative w-full h-full flex items-end justify-center">
                        <svg className="w-24 h-24 absolute left-10 bottom-6"><use href="#d-tree" /></svg>
                        <svg className="w-24 h-32 absolute right-8 bottom-6"><use href="#d-sapin" /></svg>
                        <svg className="w-32 h-40 z-10"><use href="#c-leo" /></svg>
                      </div>
                    )}
                    {pageConfig.chapter.id === 2 && (
                      <div className="relative w-full h-full flex items-end justify-center">
                        <svg className="w-24 h-24 absolute left-8 bottom-6"><use href="#d-tree" /></svg>
                        {/* Winding road */}
                        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 200">
                          <path d="M50,180 Q150,130 250,160 T350,110" fill="none" stroke="#e08a2e" strokeWidth="12" strokeLinecap="round"/>
                        </svg>
                        <svg className="w-28 h-36 z-10 mr-12"><use href="#c-nina" /></svg>
                      </div>
                    )}
                    {pageConfig.chapter.id === 3 && (
                      <div className="relative w-full h-full flex items-end justify-center">
                        <svg className="absolute inset-x-0 bottom-0 h-16 w-full" viewBox="0 0 400 100">
                          <path d="M0,50 Q100,20 200,50 T400,50 L400,100 L0,100 Z" fill="#58b7e8" />
                        </svg>
                        <svg className="w-24 h-32 absolute left-12 bottom-12"><use href="#c-tom" /></svg>
                        <svg className="w-24 h-32 absolute right-12 bottom-12"><use href="#c-zaza" /></svg>
                      </div>
                    )}
                    {pageConfig.chapter.id === 4 && (
                      <div className="relative w-full h-full flex items-end justify-center">
                        <svg className="w-16 h-16 absolute left-16 bottom-6"><use href="#d-champi" /></svg>
                        <svg className="w-24 h-24 absolute left-24 bottom-6"><use href="#d-champi" /></svg>
                        <svg className="w-20 h-20 absolute right-24 bottom-6"><use href="#d-champi" /></svg>
                        <svg className="w-24 h-32 z-10"><use href="#c-tom" /></svg>
                      </div>
                    )}
                    {pageConfig.chapter.id === 5 && (
                      <div className="relative w-full h-full flex items-end justify-center gap-2">
                        {/* Hanging bunting garlands */}
                        <svg className="absolute top-0 inset-x-0 w-full h-12" viewBox="0 0 400 60">
                          <path d="M10,10 Q200,40 390,10" fill="none" stroke="#b0790a" strokeWidth="2"/>
                          <polygon points="50,14 70,14 60,35" fill="#e05a4e"/>
                          <polygon points="120,18 140,18 130,39" fill="#ffd23f"/>
                          <polygon points="190,20 210,20 200,41" fill="#58b7e8"/>
                          <polygon points="260,18 280,18 270,39" fill="#5cae5f"/>
                          <polygon points="330,14 350,14 340,35" fill="#f6a8c4"/>
                        </svg>
                        <svg className="w-20 h-24"><use href="#c-leo" /></svg>
                        <svg className="w-16 h-20"><use href="#c-nina" /></svg>
                        <svg className="w-16 h-20"><use href="#c-tom" /></svg>
                        <svg className="w-16 h-20"><use href="#c-zaza" /></svg>
                      </div>
                    )}
                  </div>

                  <p className="text-xl font-fun text-forest">
                    {lang === "fr" ? "Prêt à relever les défis ?" : "Ready to take on the challenges?"}
                  </p>
                </div>

                {/* Warm Invitation Bubble */}
                <div className="bubble max-w-xl mx-auto">
                  <svg className="w-16 h-20"><use href={`#c-${pageConfig.chapter.missions[0]?.character || "leo"}`} /></svg>
                  <p className="text-left leading-snug">
                    <b>{pageConfig.chapter.missions[0]?.character === "leo" ? "Léo" : pageConfig.chapter.missions[0]?.character === "nina" ? "Nina" : pageConfig.chapter.missions[0]?.character === "tom" ? (lang === "fr" ? "Darina" : "Darina") : "Lana"} :</b>{" "}
                    {lang === "fr" 
                      ? `« Tourne vite la page, ${childName} ! L'aventure commence ici ! »` 
                      : `\"Turn the page quickly, ${childName}! The adventure starts here!\"`}
                  </p>
                </div>
              </div>
            )}

            {/* 4. STORY (HISTORY) PAGE */}
            {pageConfig.type === "story" && pageConfig.chapter && (
              <div className="py-2 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center gap-3 border-b-2 border-forest-light pb-2 mb-4">
                    <span className="text-sm font-black uppercase text-forest tracking-widest">
                      {lang === "fr" ? `Chapitre ${pageConfig.chapter.id}` : `Chapter ${pageConfig.chapter.id}`}
                    </span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-sm text-gray-500 font-bold">
                      {lang === "fr" ? "L'histoire de la forêt" : "The Forest Story"}
                    </span>
                  </div>

                  {/* Story Text paragraphs */}
                  <div className="space-y-4 text-lg leading-relaxed text-[#4e3a2c]">
                    {(lang === "fr" ? pageConfig.chapter.storyFr : pageConfig.chapter.storyEn).map((paragraph, index) => (
                      <p key={index} className="indent-4 font-sans">
                        {/* Bold names and terms dynamically */}
                        {paragraph.split(/(Léo|Nina|Darina|Lana|cabane|champignons|rivière|pont|labyrinthe|secret|Copains|treehouse|friends|mushrooms|bridge|ladder|rope)/g).map((part, i) => {
                          const isSpecial = ["Léo", "Nina", "Darina", "Lana", "cabane", "champignons", "rivière", "pont", "labyrinthe", "secret", "Copains", "treehouse", "friends", "mushrooms", "bridge", "ladder", "rope"].includes(part);
                          return isSpecial ? <strong key={i} className="text-forest font-bold">{part}</strong> : part;
                        })}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Chapter Story Illustration Scene */}
                <div className="my-4 bg-gradient-to-r from-sky-50 to-green-50 rounded-2xl p-4 border border-green-200">
                  <svg className="w-full h-32" viewBox="0 0 600 150">
                    <rect width="600" height="110" fill="#daf0fd" rx="8"/>
                    <rect y="95" width="600" height="55" fill="#c3e8b0" rx="8"/>
                    <use href="#d-nuage" x="50" y="15" width="60" height="30"/>
                    <use href="#d-tree" x="480" y="20" width="70" height="90"/>
                    
                    {pageConfig.chapter.id === 1 && (
                      <g>
                        <use href="#c-leo" x="150" y="50" width="60" height="75"/>
                        <use href="#c-nina" x="220" y="65" width="50" height="60"/>
                        <use href="#c-tom" x="300" y="70" width="55" height="55"/>
                        <use href="#c-zaza" x="380" y="55" width="50" height="70"/>
                      </g>
                    )}
                    {pageConfig.chapter.id === 2 && (
                      <g>
                        {/* Map or trails */}
                        <rect x="220" y="40" width="100" height="70" rx="4" fill="#fdf6e8" stroke="#c07318" strokeWidth="2"/>
                        <path d="M240,90 Q270,60 300,75" fill="none" stroke="#c07318" strokeWidth="2" strokeDasharray="4 3"/>
                        <use href="#c-nina" x="120" y="60" width="60" height="75"/>
                        <use href="#c-leo" x="350" y="50" width="65" height="80"/>
                      </g>
                    )}
                    {pageConfig.chapter.id === 3 && (
                      <g>
                        {/* Sliced bridge */}
                        <path d="M0,110 Q200,90 400,110 T600,110 L600,150 L0,150 Z" fill="#58b7e8"/>
                        <rect x="200" y="90" width="30" height="10" fill="#a8713f" rx="2"/>
                        <rect x="280" y="90" width="30" height="10" fill="#a8713f" rx="2" opacity=".4" stroke="#a8713f" strokeDasharray="3 2"/>
                        <use href="#c-leo" x="100" y="40" width="60" height="75"/>
                        <use href="#c-zaza" x="380" y="40" width="60" height="75"/>
                      </g>
                    )}
                    {pageConfig.chapter.id === 4 && (
                      <g>
                        <use href="#d-champi" x="120" y="80" width="45" height="45"/>
                        <use href="#d-champi" x="180" y="75" width="50" height="50"/>
                        <use href="#c-tom" x="260" y="50" width="65" height="75"/>
                        <use href="#c-nina" x="350" y="60" width="55" height="65"/>
                      </g>
                    )}
                    {pageConfig.chapter.id === 5 && (
                      <g>
                        {/* Little lanterns or decorations */}
                        <circle cx="200" cy="30" r="8" fill="#ffd23f"/>
                        <circle cx="280" cy="20" r="10" fill="#f6a8c4"/>
                        <circle cx="360" cy="35" r="7" fill="#58b7e8"/>
                        <use href="#c-leo" x="150" y="55" width="60" height="75"/>
                        <use href="#c-tom" x="240" y="65" width="55" height="65"/>
                        <use href="#c-zaza" x="320" y="55" width="55" height="75"/>
                      </g>
                    )}
                  </svg>
                </div>

                <div className="note-histoire text-left">
                  <p className="font-bold mb-1">🧭 {lang === "fr" ? "La mission de l'histoire :" : "The story mission:"}</p>
                  <p className="text-sm">
                    {pageConfig.chapter.id === 1 && (lang === "fr" ? "Dis bonjour bien fort à tes nouveaux amis et tourne la page !" : "Say hello loudly to your new friends and turn the page!")}
                    {pageConfig.chapter.id === 2 && (lang === "fr" ? "Fais un clin d'œil complice à Nina pour lui montrer que tu es prêt, puis tourne la page !" : "Wink at Nina to show her you're ready, then turn the page!")}
                    {pageConfig.chapter.id === 3 && (lang === "fr" ? "Récite la formule secrète 'Cui-cui !' avec Lana, puis prépare-toi à lire !" : "Say the secret formula 'Tweet-tweet!' with Lana, then get ready to read!")}
                    {pageConfig.chapter.id === 4 && (lang === "fr" ? "Prépare tes doigts pour compter avec Darina, puis tourne la page !" : "Get your fingers ready to count with Darina, then turn the page!")}
                    {pageConfig.chapter.id === 5 && (lang === "fr" ? "Mets ton plus beau chapeau de fête imaginaire et prépare-toi pour le gâteau !" : "Put on your best imaginary party hat and get ready for the cake!")}
                  </p>
                </div>
              </div>
            )}

            {/* 5. INTERACTIVE EXERCISES / MISSIONS PAGE */}
            {pageConfig.type === "exercises" && pageConfig.missions && (
              <div className="space-y-4 py-2 flex-1 flex flex-col justify-between">
                {pageConfig.missions.map((mission, idx) => {
                  const mKey = `${mission.id}`;
                  return (
                    <div key={mission.id} className="exo flex-1 flex flex-col justify-between p-4">
                      
                      {/* Header */}
                      <div className="exo-head flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="exo-num">{lang === "fr" ? `Mission ${mission.num}` : `Mission ${mission.num}`}</span>
                          {renderDifficultyStars(mission.difficulty)}
                        </div>
                        <span className="exo-type">
                          {lang === "fr" ? mission.typeFr : mission.typeEn}
                        </span>
                      </div>

                      {/* Character Bubble speech */}
                      <div className="bubble my-1 py-1">
                        <svg className="w-12 h-16 shrink-0"><use href={`#c-${mission.character}`} /></svg>
                        <p className="text-left text-sm leading-snug">
                          <b className="capitalize">{mission.character === "tom" ? (lang === "fr" ? "Darina" : "Darina") : mission.character === "zaza" ? "Lana" : mission.character} :</b>{" "}
                          {lang === "fr" ? mission.bubbleFr : mission.bubbleEn}
                        </p>
                      </div>

                      {/* Instruction */}
                      <p className="consigne text-base text-left text-forest mb-2">
                        {lang === "fr" ? mission.consigneFr : mission.consigneEn}
                      </p>

                      {/* Exercise controls based on type */}
                      <div className="flex-1 flex flex-col justify-center">
                        
                        {/* QCM Type */}
                        {mission.exerciseType === "qcm" && mission.choices && (
                          <div className="space-y-2">
                            <div className="flex flex-wrap gap-3 justify-center">
                              {mission.choices.map((choice) => {
                                const isSelected = selectedOptions[mKey] === choice.id;
                                const buttonStyle = isSelected
                                  ? choice.isCorrect
                                    ? "bg-green-100 border-green-500 text-green-800 scale-105"
                                    : "bg-red-100 border-red-500 text-red-800"
                                  : "bg-white border-blue-400 text-gray-700 hover:border-blue-600";

                                return (
                                  <button
                                    key={choice.id}
                                    type="button"
                                    onClick={() => handleQcmClick(mission.id, choice.id, choice.isCorrect)}
                                    className={`choice font-medium px-4 py-2.5 sm:py-2 border-2 rounded-xl transition-all shadow-sm cursor-pointer min-h-[44px] ${buttonStyle}`}
                                  >
                                    {lang === "fr" ? choice.textFr : choice.textEn}
                                  </button>
                                );
                              })}
                            </div>
                            
                            {/* Validation feedback text */}
                            {selectedOptions[mKey] && (
                              <div className="text-center font-bold text-sm mt-1 animate-pulse">
                                {mission.choices.find(c => c.id === selectedOptions[mKey])?.isCorrect ? (
                                  <span className="text-green-600">
                                    ✨ {lang === "fr" ? "Bravo, c'est exact !" : "Hooray, that's correct!"}
                                  </span>
                                ) : (
                                  <span className="text-red-500">
                                    ❌ {lang === "fr" ? "Oups, réessaie !" : "Oops, try again!"}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Grid-find Type */}
                        {mission.exerciseType === "grid-find" && mission.gridItems && (
                          <div className="flex flex-col items-center">
                            <div className="flex flex-wrap gap-2 justify-center max-w-md">
                              {mission.gridItems.map((item) => {
                                const isFound = (gridFound[mKey] || []).includes(item.id);
                                return (
                                  <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => handleGridClick(
                                      mission.id, 
                                      item.id, 
                                      item.isTarget, 
                                      mission.gridItems!.filter(x => x.isTarget).length
                                    )}
                                    className={`pick w-12 h-12 flex items-center justify-center font-bold text-xl rounded-xl border-2 transition ${
                                      isFound 
                                        ? item.isTarget 
                                          ? "bg-yellow-300 border-yellow-500 scale-105" 
                                          : "bg-red-200 border-red-400"
                                        : "bg-white border-gray-300 hover:border-green-300"
                                    }`}
                                  >
                                    {item.text}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Matching Type */}
                        {mission.exerciseType === "matching" && mission.matches && (
                          <div className="space-y-2 select-none w-full max-w-sm mx-auto">
                            <p className="text-xs text-center text-gray-400 font-bold mb-1">
                              {lang === "fr" ? "👉 Clique un mot puis sa cible !" : "👉 Click a word then its target!"}
                            </p>
                            <div className="flex justify-between gap-4">
                              {/* Left column (Source words) */}
                              <div className="flex flex-col gap-2 flex-1">
                                {mission.matches.map((match, i) => {
                                  const done = isMatched(mission.id, i);
                                  const active = activeMatch && activeMatch.missionId === mission.id && activeMatch.leftIndex === i;
                                  return (
                                    <button
                                      key={`left-${i}`}
                                      type="button"
                                      onClick={() => handleMatchClick(mission.id, i, "left", match.correctPairIndex)}
                                      disabled={done}
                                      className={`px-3 py-1.5 text-sm font-bold border-2 rounded-xl transition text-left flex items-center justify-between min-h-[44px] cursor-pointer ${
                                        done
                                          ? "bg-green-100 border-green-400 text-green-800 opacity-60"
                                          : active
                                            ? "bg-yellow-100 border-yellow-500 text-yellow-800 scale-102"
                                            : "bg-white border-blue-200 text-gray-700 hover:border-blue-400"
                                      }`}
                                    >
                                      <span>{lang === "fr" ? match.leftFr : match.leftEn}</span>
                                      <span className={`w-3 h-3 rounded-full border-2 ${done ? "bg-green-600 border-green-800" : "bg-blue-400 border-blue-600"}`} />
                                    </button>
                                  );
                                })}
                              </div>

                              {/* Right column (Target illustrations or endpoints) */}
                              <div className="flex flex-col gap-2 flex-1">
                                {mission.matches.map((match, i) => {
                                  // Find if any left index is connected to this right index
                                  const leftConnectedIdx = Object.keys(matches[mission.id] || {}).find(
                                    key => (matches[mission.id] as any)[key] === i
                                  );
                                  const done = leftConnectedIdx !== undefined;

                                  return (
                                    <button
                                      key={`right-${i}`}
                                      type="button"
                                      onClick={() => handleMatchClick(mission.id, i, "right", match.correctPairIndex)}
                                      disabled={done}
                                      className={`px-3 py-1.5 text-sm font-bold border-2 rounded-xl transition text-left flex items-center justify-start gap-2 min-h-[44px] cursor-pointer ${
                                        done
                                          ? "bg-green-100 border-green-400 text-green-800 opacity-60"
                                          : "bg-white border-blue-200 text-gray-700 hover:border-blue-400"
                                      }`}
                                    >
                                      <span className={`w-3 h-3 rounded-full border-2 ${done ? "bg-green-600 border-green-800" : "bg-blue-400 border-blue-600"}`} />
                                      {match.rightIcon && (
                                        <svg className="w-6 h-6"><use href={`#${match.rightIcon}`} /></svg>
                                      )}
                                      <span>{lang === "fr" ? match.rightFr : match.rightEn}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Interactive Drawing Board & Tracing Canvases */}
                        {(mission.exerciseType === "drawing" || mission.exerciseType === "tracing-letter" || mission.exerciseType === "symmetry") && (
                          <DrawingCanvas
                            width={320}
                            height={150}
                            onSave={(url) => setDrawings(prev => ({ ...prev, [mKey]: url }))}
                            savedDataUrl={drawings[mKey]}
                            lang={lang}
                          />
                        )}

                        {/* Input Text / Handwritten Type */}
                        {mission.exerciseType === "input-text" && (
                          <div className="text-center flex flex-col sm:flex-row items-center justify-center gap-3">
                            <input
                              type="text"
                              value={textInputs[mKey] || ""}
                              onChange={(e) => setTextInputs(prev => ({ ...prev, [mKey]: e.target.value }))}
                              placeholder={lang === "fr" ? mission.inputPlaceholderFr : mission.inputPlaceholderEn}
                              className="case-ecrire w-full max-w-[280px] sm:max-w-md h-12 text-center text-xl sm:text-2xl font-handwriting border-b-4 border-dashed border-orange-friend focus:outline-none focus:border-green-600 bg-transparent"
                            />
                            {textInputs[mKey] && (
                              <button 
                                type="button"
                                onClick={() => playSound("correct")}
                                className="px-4 py-2 bg-green-50 border border-green-200 rounded-xl text-xs font-bold text-forest no-print min-h-[44px] cursor-pointer animate-pulse"
                              >
                                ✔ {lang === "fr" ? "Valider" : "Check"}
                              </button>
                            )}
                          </div>
                        )}

                        {/* Order/Sequence Numbers validation */}
                        {mission.exerciseType === "order-numbers" && mission.choices && (
                          <div className="space-y-2">
                            <p className="text-xs text-gray-400 font-bold mb-1 text-center">
                              {lang === "fr" ? "👉 Coche les affirmations correctes :" : "👉 Check the correct statements:"}
                            </p>
                            <div className="flex flex-col gap-2 max-w-sm mx-auto">
                              {mission.choices.map((choice) => {
                                const isChecked = selectedOptions[`${mission.id}-${choice.id}`] === "checked";
                                return (
                                  <button
                                    key={choice.id}
                                    type="button"
                                    onClick={() => {
                                      setSelectedOptions(prev => ({
                                        ...prev,
                                        [`${mission.id}-${choice.id}`]: isChecked ? "unchecked" : "checked"
                                      }));
                                      playSound("correct");
                                    }}
                                    className={`px-4 py-2 border-2 rounded-xl text-sm font-bold flex items-center gap-3 transition cursor-pointer min-h-[44px] ${
                                      isChecked
                                        ? "bg-green-50 border-green-500 text-green-800"
                                        : "bg-white border-gray-200 text-gray-700 hover:border-green-300"
                                    }`}
                                  >
                                    <span className={`w-5 h-5 rounded flex items-center justify-center border-2 ${isChecked ? "bg-green-500 border-green-600 text-white" : "border-gray-300"}`}>
                                      {isChecked && "✔"}
                                    </span>
                                    <span>{lang === "fr" ? choice.textFr : choice.textEn}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                      </div>

                    </div>
                  );
                })}
              </div>
            )}

            {/* 6. BADGE PAGE */}
            {pageConfig.type === "badge" && pageConfig.chapter && (
              <div className="badge-page flex flex-col justify-between h-full py-4 text-center">
                {/* Header Band */}
                <div className="bg-gradient-to-r from-forest to-forest-light text-white rounded-3xl p-4 flex items-center gap-4 shadow-md text-left">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shrink-0">
                    <svg className="w-12 h-12"><use href={`#c-${pageConfig.chapter.missions[0]?.character || "leo"}`} /></svg>
                  </div>
                  <div>
                    <span className="text-xs uppercase font-black tracking-widest text-yellow-300">
                      {lang === "fr" ? "Chapitre Terminé !" : "Chapter Completed!"}
                    </span>
                    <h2 className="text-2xl font-fun">
                      {lang === "fr" ? "Ta récompense !" : "Your Reward!"}
                    </h2>
                  </div>
                </div>

                {/* Badge medal seal */}
                <div className="my-6">
                  <p className="text-2xl font-fun text-yellow-600 uppercase tracking-widest animate-bounce mb-3">
                    {lang === "fr" ? "🎉 FÉLICITATIONS ! 🎉" : "🎉 CONGRATULATIONS! 🎉"}
                  </p>
                  
                  {/* Glowing circular seal wrapper */}
                  <div 
                    onClick={() => playSound("badge")}
                    className="badge-cercle cursor-pointer group transform hover:scale-105 active:scale-95 transition"
                    style={{
                      borderColor: pageConfig.chapter.badgeColor,
                      background: "radial-gradient(#fff8dd, #ffe9a3)"
                    }}
                  >
                    <svg className="w-24 h-24 text-forest transition group-hover:rotate-12">
                      <use href={pageConfig.chapter.badgeIconId} />
                    </svg>
                  </div>

                  <p className="badge-nom mt-4" style={{ color: pageConfig.chapter.badgeColor }}>
                    {lang === "fr" ? pageConfig.chapter.badgeNameFr : pageConfig.chapter.badgeNameEn}
                  </p>
                </div>

                {/* Speech info */}
                <div className="bubble max-w-xl mx-auto">
                  <svg className="w-16 h-20"><use href={`#c-${pageConfig.chapter.missions[0]?.character || "leo"}`} /></svg>
                  <p className="text-left text-sm leading-snug">
                    <b>{pageConfig.chapter.missions[0]?.character === "leo" ? "Léo" : pageConfig.chapter.missions[0]?.character === "nina" ? "Nina" : pageConfig.chapter.missions[0]?.character === "tom" ? (lang === "fr" ? "Darina" : "Darina") : "Lana"} :</b>{" "}
                    {lang === "fr" ? pageConfig.chapter.badgeDescFr : pageConfig.chapter.badgeDescEn}
                  </p>
                </div>

                {/* Printable Date Form */}
                <div className="note-histoire max-w-md mx-auto w-full">
                  <p className="text-sm">
                    🎨 <b>{lang === "fr" ? "Colorie ton badge" : "Color your badge"}</b>,{" "}
                    {lang === "fr" ? "et écris la date de ta victoire :" : "and write down the date of your victory:"}
                  </p>
                  <input
                    type="text"
                    placeholder={lang === "fr" ? "Exemple: 24 Juin..." : "Example: June 24..."}
                    className="case-ecrire min-w-[40mm] text-center font-handwriting bg-transparent border-b-2 border-dashed border-orange-friend focus:outline-none focus:border-green-600 mt-2"
                  />
                </div>
              </div>
            )}

            {/* 7. DIPLOMA / CERTIFICATE PAGE */}
            {pageConfig.type === "diploma" && (
              <div 
                className="border-8 border-double p-6 rounded-3xl h-full flex flex-col justify-between items-center text-center relative"
                style={{ borderColor: "var(--color-yellow-friend)", background: "#fffdf0" }}
              >
                {/* Seal graphics */}
                <div className="absolute top-2 left-2 opacity-20 pointer-events-none">
                  <svg className="w-16 h-16 text-yellow-500" fill="currentColor" viewBox="0 0 100 100"><use href="#d-etoile" /></svg>
                </div>
                <div className="absolute top-2 right-2 opacity-20 pointer-events-none">
                  <svg className="w-16 h-16 text-yellow-500" fill="currentColor" viewBox="0 0 100 100"><use href="#d-etoile" /></svg>
                </div>

                <div className="w-full">
                  <p className="text-xs tracking-widest text-[#a88a44] font-black uppercase mb-1">
                    TECHSEN FOR KIDS PRESENTS
                  </p>
                  <h1 className="text-3xl md:text-4xl font-fun text-yellow-600 drop-shadow mb-1">
                    🏆 {lang === "fr" ? "Diplôme Officiel" : "Official Certificate"} 🏆
                  </h1>
                  <p className="text-base text-gray-500 font-bold">
                    {lang === "fr" ? "des Copains de la Forêt" : "of the Forest Friends"}
                  </p>
                </div>

                {/* Team Scene under certificate */}
                <div className="w-full max-w-sm my-4 bg-green-50 border-2 border-green-200 rounded-2xl p-2 relative">
                  <svg className="w-full h-24 filter drop-shadow-sm" viewBox="0 0 400 120">
                    <rect width="400" height="100" fill="#daf0fd" rx="6"/>
                    <rect y="80" width="400" height="40" fill="#c3e8b0" rx="6"/>
                    <use href="#c-leo" x="50" y="20" width="60" height="75"/>
                    <use href="#c-nina" x="130" y="30" width="50" height="62"/>
                    <use href="#c-tom" x="200" y="35" width="55" height="55"/>
                    <use href="#c-zaza" x="280" y="25" width="55" height="70"/>
                  </svg>
                </div>

                <div className="space-y-4 w-full">
                  <p className="text-lg text-gray-700 font-medium">
                    {lang === "fr" ? "Ce diplôme est fièrement décerné à :" : "This certificate is proudly awarded to:"}
                  </p>
                  <p className="text-3xl md:text-4xl font-handwriting text-forest font-black border-b-2 border-dashed border-orange-friend inline-block px-8 py-1 max-w-md w-full">
                    {childName}
                  </p>
                  <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
                    {lang === "fr"
                      ? `pour avoir accompli avec succès les 44 missions du livre "${book.titleFr}", collecté les badges et être devenu(e) pour toujours le 5ᵉ Copain de la Forêt !`
                      : `for successfully completing all 44 missions of the book "${book.titleEn}", earning all badges, and becoming forever the 5th Forest Friend!`}
                  </p>
                </div>

                {/* Hand-signed fields and date */}
                <div className="w-full border-t border-yellow-200 pt-4 flex flex-col items-center">
                  <p className="text-sm font-medium text-gray-700">
                    {lang === "fr" ? "Fait dans la Grande Clairière, le :" : "Done in the Grand Clearing, on:"}
                  </p>
                  <input
                    type="text"
                    placeholder={lang === "fr" ? "Date de réussite..." : "Completion date..."}
                    className="case-ecrire min-w-[50mm] text-center font-handwriting bg-transparent border-b-2 border-dashed border-orange-friend focus:outline-none focus:border-green-600 mt-1"
                  />
                  
                  {/* Signatures */}
                  <div className="flex gap-4 md:gap-6 justify-center mt-4 text-xs font-bold text-[#8a7a4a]">
                    <span>✍️ Léo 🦊</span>
                    <span>✍️ Nina 🐭</span>
                    <span>✍️ {lang === "fr" ? "Darina" : "Darina"} 🦔</span>
                    <span>✍️ Lana 🐦</span>
                  </div>
                </div>

              </div>
            )}

          </div>

          {/* Page Footer Folio */}
          <footer className="w-full flex items-center justify-between border-t border-green-100 pt-4 mt-4">
            <span className="text-xs text-gray-400 font-bold">
              {book.id === 1 ? "Tome 1 — La Rencontre" : "Tome 2 — La Cabane"}
            </span>
            <span className="text-sm font-handwriting text-forest-light font-bold">
              — {currentPage} —
            </span>
            <span className="text-xs text-gray-400 font-bold">
              {lang === "fr" ? "5-7 ans" : "Ages 5-7"}
            </span>
          </footer>

        </div>

        {/* Navigation & Toolbar */}
        <div className="no-print mt-6 w-full max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border-2 border-warm-border shadow-md">
          {/* Previous Page */}
          <button
            onClick={() => navigateToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-full sm:w-auto px-6 py-3 bg-wood-brown text-white hover:bg-[#724a2c] rounded-xl font-bold flex items-center justify-center gap-2 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-md border-b-4 border-[#5c3e27] min-h-[44px] cursor-pointer"
          >
            <ArrowLeft size={20} />
            {lang === "fr" ? "Précédent" : "Previous"}
          </button>

          {/* Current Page Folio Progress */}
          <div className="flex items-center gap-2 font-bold text-gray-700">
            <BookOpen className="text-forest" size={20} />
            <span>
              {lang === "fr" ? "Page" : "Page"} {currentPage} / {totalPages}
            </span>
          </div>

          {/* Next Page */}
          <button
            onClick={() => navigateToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-full sm:w-auto px-6 py-3 bg-forest text-white hover:bg-green-700 rounded-xl font-bold flex items-center justify-center gap-2 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-md border-b-4 border-[#415a3a] min-h-[44px] cursor-pointer"
          >
            {lang === "fr" ? "Suivant" : "Next"}
            <ArrowRight size={20} />
          </button>
        </div>

      </main>
    </div>
  );
};
