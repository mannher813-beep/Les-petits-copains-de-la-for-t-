import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, TargetAndTransition } from "motion/react";
import { getMascot, getAccessory, parseAvatarConfig, Mascot } from "../types/mascots";
import { soundManager } from "../utils/audioCelebration";
import { getCutoutImage } from "../utils/imageUtils";

interface AnimatedMascotProps {
  avatarId?: string;
  mascot?: Mascot;
  className?: string;
  imgClassName?: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  interactive?: boolean;
  showQuoteOnClick?: boolean;
  animateType?: "float" | "bounce" | "wave" | "celebrate";
  customQuote?: string;
  popOutOfFrame?: boolean;
}

const SIZE_CLASSES = {
  sm: "w-10 h-10",
  md: "w-16 h-16",
  lg: "w-24 h-24",
  xl: "w-36 h-36",
  "2xl": "w-48 h-48"
};

const POP_OUT_CONTAINER = {
  sm: "overflow-visible",
  md: "overflow-visible",
  lg: "overflow-visible",
  xl: "overflow-visible",
  "2xl": "overflow-visible"
};

const FUN_EXCLAMATIONS = [
  "Coucou !",
  "Tu es génial !",
  "Super copain !",
  "En route !",
  "Hop !",
  "C'est parti !"
];

export const AnimatedMascot: React.FC<AnimatedMascotProps> = ({
  avatarId,
  mascot: providedMascot,
  className = "",
  imgClassName = "w-full h-full object-contain filter drop-shadow-[0_12px_18px_rgba(0,0,0,0.3)]",
  size = "lg",
  interactive = true,
  showQuoteOnClick = true,
  animateType = "float",
  customQuote,
  popOutOfFrame = true
}) => {
  const { accessoryId } = parseAvatarConfig(avatarId);
  const mascot = providedMascot || getMascot(avatarId);
  const accessory = getAccessory(accessoryId);

  const [displaySrc, setDisplaySrc] = useState<string>(mascot.image);
  const [isTapped, setIsTapped] = useState(false);
  const [speechText, setSpeechText] = useState<string | null>(null);
  const [sparkles, setSparkles] = useState<number[]>([]);

  useEffect(() => {
    let isMounted = true;
    if (mascot.image) {
      getCutoutImage(mascot.image).then((transparentUrl) => {
        if (isMounted) {
          setDisplaySrc(transparentUrl);
        }
      });
    }
    return () => {
      isMounted = false;
    };
  }, [mascot.image]);

  const handleTap = () => {
    if (!interactive) return;

    soundManager.playTapSound();
    setIsTapped(true);

    // Generate floating sparkles
    setSparkles([Date.now(), Date.now() + 1, Date.now() + 2]);

    // Choose speech text
    if (showQuoteOnClick) {
      if (customQuote) {
        setSpeechText(customQuote);
      } else {
        const randomExclamation = FUN_EXCLAMATIONS[Math.floor(Math.random() * FUN_EXCLAMATIONS.length)];
        setSpeechText(`${randomExclamation} ${mascot.quoteFr}`);
      }
    }

    setTimeout(() => {
      setIsTapped(false);
    }, 800);

    setTimeout(() => {
      setSpeechText(null);
    }, 2800);
  };

  // Animation variants
  const floatAnimation: TargetAndTransition = {
    y: [0, -8, 0],
    rotate: [-1.5, 1.5, -1.5],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  const bounceAnimation: TargetAndTransition = {
    y: [0, -12, 0],
    scaleY: [1, 0.9, 1.05, 1],
    transition: {
      duration: 1.6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  const waveAnimation: TargetAndTransition = {
    y: [0, -4, 0],
    rotate: [0, 8, -8, 8, 0],
    transition: {
      duration: 2.2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  const celebrateAnimation: TargetAndTransition = {
    y: [0, -14, 0],
    rotate: [0, -10, 10, -5, 0],
    scale: [1, 1.1, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  let activeAnimation = floatAnimation;
  if (animateType === "bounce") activeAnimation = bounceAnimation;
  if (animateType === "wave") activeAnimation = waveAnimation;
  if (animateType === "celebrate") activeAnimation = celebrateAnimation;

  return (
    <div className={`relative inline-flex items-center justify-center overflow-visible z-20 ${popOutOfFrame ? POP_OUT_CONTAINER[size] : ""} ${className}`}>
      {/* Speech Bubble popup on click */}
      <AnimatePresence>
        {speechText && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: -45, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="absolute z-40 bottom-full left-1/2 -translate-x-1/2 mb-2 bg-amber-300 text-emerald-950 px-3 py-1.5 rounded-2xl text-[11px] font-black shadow-2xl whitespace-nowrap border-2 border-emerald-800 text-center pointer-events-none"
          >
            {speechText}
            {/* Bubble Tail */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-amber-300" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Burst Sparkles on Tap */}
      {sparkles.map((id, index) => (
        <motion.span
          key={id}
          initial={{ opacity: 1, scale: 0.5, x: 0, y: 0 }}
          animate={{
            opacity: 0,
            scale: 1.5,
            x: index === 0 ? -28 : index === 1 ? 28 : 0,
            y: index === 2 ? -36 : -20
          }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="absolute z-30 text-amber-400 text-xl pointer-events-none select-none"
        >
          ✨
        </motion.span>
      ))}

      {/* Main Mascot Wrapper with Pop-Out Scaling & 3D Effect */}
      <motion.div
        animate={isTapped ? { y: [-2, -26, 0], rotate: [0, -18, 18, 0], scale: [1, 1.3, 1] } : activeAnimation}
        whileHover={interactive ? { scale: 1.25, y: -8, rotate: 3 } : undefined}
        whileTap={interactive ? { scale: 0.95 } : undefined}
        onClick={handleTap}
        className={`${SIZE_CLASSES[size] || ""} relative cursor-pointer select-none transition-all ${
          popOutOfFrame ? "scale-130 -translate-y-3 z-30 pointer-events-auto" : ""
        }`}
      >
        {/* Floating 3D Accessory Emoji Badge on Character Head */}
        {accessory && accessory.id !== "none" && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0.9, 1.15, 1], rotate: [-6, 6, -6] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-3 -right-2 z-20 text-xl sm:text-2xl filter drop-shadow-md pointer-events-none select-none"
            title={accessory.nameFr}
          >
            {accessory.emoji}
          </motion.div>
        )}

        <img
          src={displaySrc}
          alt={mascot.name}
          className={`${imgClassName} ${isTapped ? "brightness-110" : ""}`}
        />
      </motion.div>
    </div>
  );
};

