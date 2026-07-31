import React, { useEffect } from "react";
import { motion } from "motion/react";
import { MASCOTS } from "../types/mascots";
import { Sparkles, Trees } from "lucide-react";

interface SplashScreenProps {
  onFinish: () => void;
  lang?: string;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2100);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-[#2d5028] via-[#3a6834] to-[#1e381b] text-white p-6 overflow-hidden">
      {/* Background Magic Forest Particles */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-amber-300 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-emerald-300 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-md w-full">
        {/* Animated Mascots Row */}
        <div className="flex items-center justify-center gap-3 mb-6">
          {Object.values(MASCOTS).map((mascot, index) => (
            <motion.div
              key={mascot.id}
              initial={{ scale: 0, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: index * 0.15
              }}
              className="relative group"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/20 backdrop-blur-md p-1 border-2 border-amber-300/60 shadow-lg flex items-center justify-center">
                <img
                  src={mascot.image}
                  alt={mascot.name}
                  className="w-full h-full object-contain drop-shadow-md"
                />
              </div>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="block mt-1 text-xs font-bold text-amber-200 tracking-wide"
              >
                {mascot.name}
              </motion.span>
            </motion.div>
          ))}
        </div>

        {/* Logo & App Title */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 bg-amber-400 text-emerald-950 font-black px-4 py-1.5 rounded-full text-xs uppercase tracking-widest shadow-md mb-3">
            <Sparkles className="w-4 h-4 animate-spin" />
            L'Atelier d'Aventure PWA
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-fun drop-shadow-md flex items-center gap-2">
            <Trees className="w-8 h-8 text-amber-300 inline" />
            Les Copains de la Forêt
          </h1>
          <p className="text-amber-100/90 text-sm mt-1 font-medium max-w-xs">
            Le compagnon magique de ton cahier d'activités
          </p>
        </motion.div>

        {/* Loading Spinner / Bar */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.8, ease: "easeInOut" }}
          className="h-2 bg-gradient-to-r from-amber-300 via-emerald-300 to-yellow-300 rounded-full mt-8 max-w-xs shadow-inner"
        />
      </div>
    </div>
  );
};
