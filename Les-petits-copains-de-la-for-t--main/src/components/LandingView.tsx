import React from "react";
import { Sparkles, ArrowRight, ShieldCheck, Globe } from "lucide-react";
import { Language, getTranslation } from "../i18n/translations";
import { getMascot } from "../types/mascots";

interface LandingViewProps {
  onNavigate: (path: string) => void;
  lang: Language;
  onSelectLang: (lang: Language) => void;
  onContinueWithoutAccount: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onNavigate,
  lang,
  onSelectLang,
  onContinueWithoutAccount
}) => {
  const mascots = ["leo", "nina", "darina", "lana"].map((id) => getMascot(id));

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-200 via-emerald-100 to-emerald-600 flex flex-col justify-between p-4 sm:p-6 pb-12 relative overflow-hidden font-sans">
      {/* BACKGROUND DECORATION */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-sky-300/40 to-transparent pointer-events-none" />
      
      {/* TOP BAR */}
      <div className="relative z-10 max-w-md mx-auto w-full flex items-center justify-between pt-2">
        <div className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center shadow-xs">
          <span className="text-sm">🌲</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelectLang(lang === "fr" ? "en" : "fr")}
            className="flex items-center gap-1.5 bg-white/90 backdrop-blur-md text-emerald-950 px-3 py-1 rounded-full text-xs font-black shadow-md border border-white"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-600" />
            <span className="uppercase">{lang}</span>
          </button>
        </div>
      </div>

      {/* CENTRAL LOGO & MASCOTS ILLUSTRATION HERO */}
      <div className="relative z-10 max-w-md mx-auto w-full text-center space-y-4 my-auto pt-4">
        {/* LOGO */}
        <div className="inline-block relative">
          <div className="absolute -inset-2 bg-amber-300/40 rounded-full blur-xl animate-pulse" />
          <div className="relative bg-white/90 backdrop-blur-md border-4 border-amber-300 rounded-3xl px-6 py-3 shadow-2xl inline-flex flex-col items-center">
            <span className="text-3xl sm:text-4xl font-black font-fun tracking-tight text-emerald-900 drop-shadow-xs flex items-center gap-2">
              <span className="text-2xl">🌲</span>
              Les Copains
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold font-fun text-emerald-600 -mt-1 tracking-wider">
              de la Forêt 🍃
            </span>
          </div>
        </div>

        {/* MASCOTS GROUP ARTWORK */}
        <div className="bg-white/40 backdrop-blur-md rounded-3xl p-4 border-2 border-white/60 shadow-xl relative overflow-hidden my-4">
          <div className="flex items-center justify-center gap-2 py-2">
            {mascots.map((m, idx) => (
              <div
                key={m.id}
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/80 p-1 border-2 border-amber-300 shadow-md flex items-center justify-center transform transition-transform hover:scale-110 ${
                  idx % 2 === 0 ? "-rotate-3" : "rotate-3"
                }`}
              >
                <img src={m.image} alt={m.name} className="w-full h-full object-contain" />
              </div>
            ))}
          </div>

          <p className="text-xs font-bold text-emerald-950 bg-amber-200/90 rounded-full py-1 px-4 inline-block shadow-xs mt-2">
            ✨ L'application compagnon magique de ton livre !
          </p>
        </div>

        {/* ACTION BUTTONS */}
        <div className="space-y-3 pt-2">
          {/* 1. SE CONNECTER */}
          <button
            onClick={() => onNavigate("/compte/enfants")}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-4 rounded-2xl text-base shadow-xl shadow-emerald-800/30 border-2 border-emerald-400 active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <span>{getTranslation(lang, "login")}</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          {/* 2. CRÉER UN COMPTE */}
          <button
            onClick={() => onNavigate("/compte/enfants/nouveau")}
            className="w-full bg-white hover:bg-gray-50 text-emerald-900 font-extrabold py-3.5 rounded-2xl text-base shadow-lg border-2 border-emerald-300 active:scale-98 transition-all"
          >
            {getTranslation(lang, "createAccount")}
          </button>

          {/* 3. CONTINUER SANS COMPTE */}
          <button
            onClick={onContinueWithoutAccount}
            className="block mx-auto text-xs font-extrabold text-emerald-950 underline underline-offset-4 hover:text-amber-200 transition-colors py-1"
          >
            {getTranslation(lang, "continueNoAccount")}
          </button>
        </div>
      </div>

      {/* FOOTER MULTI-LANGUAGE FLAGS */}
      <div className="relative z-10 max-w-md mx-auto w-full text-center pt-4">
        <div className="text-[10px] font-black uppercase text-emerald-900 tracking-wider mb-1.5">
          Disponible en plusieurs langues
        </div>
        <div className="flex items-center justify-center gap-2 text-xl bg-white/40 backdrop-blur-md rounded-full py-1.5 px-4 inline-flex border border-white/50">
          <span>🇫🇷</span>
          <span>🇺🇸</span>
          <span>🇪🇸</span>
          <span>🇩🇪</span>
          <span>🇮🇹</span>
          <span>🇵🇹</span>
        </div>
      </div>
    </div>
  );
};
