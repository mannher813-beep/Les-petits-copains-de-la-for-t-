import React, { useState } from "react";
import { Sparkles } from "lucide-react";

interface AppleCounterProps {
  targetCount: number;
  lang: "fr" | "en";
}

export const AppleCounter: React.FC<AppleCounterProps> = ({ targetCount, lang }) => {
  const [clickedApples, setClickedApples] = useState<Record<number, boolean>>({});

  // Web Audio API for counting sounds
  const playCountSound = (index: number) => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);

      // Pitch increases as you count up!
      const baseFreq = 261.63; // C4
      const freqStep = 1.122; // Semitone step
      const frequency = baseFreq * Math.pow(freqStep, index * 2);
      
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
      console.warn("Audio not supported yet", e);
    }
  };

  const handleAppleClick = (idx: number) => {
    const nextState = !clickedApples[idx];
    setClickedApples(prev => ({
      ...prev,
      [idx]: nextState
    }));
    
    if (nextState) {
      playCountSound(idx + 1);
    }
  };

  const resetCount = () => {
    setClickedApples({});
  };

  const allCounted = Object.keys(clickedApples).filter(k => clickedApples[Number(k)]).length === targetCount;

  return (
    <div className="my-4 bg-orange-50/40 p-4 rounded-2xl border-2 border-dashed border-orange-200 text-center select-none max-w-md mx-auto">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-bold text-orange-800">
          🍎 {lang === "fr" ? "Touche les pommes pour les compter :" : "Tap the apples to count them:"}
        </p>
        <button
          onClick={resetCount}
          className="text-xs bg-white border border-orange-200 text-orange-700 px-2 py-1 rounded-md hover:bg-orange-100 transition font-bold"
        >
          {lang === "fr" ? "Recommencer" : "Reset"}
        </button>
      </div>

      {/* Grid of apples */}
      <div className="flex flex-wrap justify-center gap-4 py-2">
        {Array.from({ length: targetCount }).map((_, idx) => {
          const isClicked = !!clickedApples[idx];
          return (
            <button
              key={idx}
              onClick={() => handleAppleClick(idx)}
              className="relative focus:outline-none transition-transform active:scale-90 hover:scale-110"
              style={{ width: "64px", height: "64px" }}
              title={lang === "fr" ? `Pomme ${idx + 1}` : `Apple ${idx + 1}`}
            >
              {/* Apple SVG */}
              <svg 
                className={`w-full h-full transition-all duration-300 ${
                  isClicked 
                    ? "filter drop-shadow-[0_4px_6px_rgba(229,72,77,0.4)] scale-105" 
                    : "opacity-80 saturate-50 brightness-110"
                }`}
                viewBox="0 0 100 100"
              >
                <use href="#d-pomme" />
              </svg>

              {/* Counting Number bubble overlay */}
              {isClicked && (
                <span className="absolute -bottom-1 -right-1 bg-yellow-300 text-orange-950 font-black rounded-full w-6 h-6 flex items-center justify-center text-xs border-2 border-orange-400 animate-bounce">
                  {idx + 1}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Success Banner */}
      {allCounted && (
        <div className="mt-3 bg-green-50 text-green-800 text-xs font-bold py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 border border-green-200 animate-pulse">
          <Sparkles size={14} className="text-green-600" />
          <span>
            {lang === "fr" 
              ? `Super ! Tu as compté les ${targetCount} pommes !` 
              : `Great! You counted all ${targetCount} apples!`}
          </span>
        </div>
      )}
    </div>
  );
};
