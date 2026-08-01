import React from "react";
import { Smile, Trash2 } from "lucide-react";

export interface StickerType {
  id: string;
  emoji: string;
  labelFr: string;
  labelEn: string;
  symbolId?: string; // If we want to render the vector SVG instead of emoji!
}

export const STICKERS_LIST: StickerType[] = [
  { id: "leo", emoji: "🦊", labelFr: "Léo", labelEn: "Leo", symbolId: "c-leo" },
  { id: "nina", emoji: "🐭", labelFr: "Nina", labelEn: "Nina", symbolId: "c-nina" },
  { id: "tom", emoji: "🦔", labelFr: "Darina", labelEn: "Darina", symbolId: "c-tom" },
  { id: "zaza", emoji: "🐦", labelFr: "Lana", labelEn: "Lana", symbolId: "c-zaza" },
  { id: "star", emoji: "⭐", labelFr: "Étoile", labelEn: "Star", symbolId: "d-etoile" },
  { id: "flower", emoji: "🌸", labelFr: "Fleur", labelEn: "Flower", symbolId: "d-fleur" },
  { id: "mushroom", emoji: "🍄", labelFr: "Champi", labelEn: "Mushroom", symbolId: "d-champi" },
  { id: "apple", emoji: "🍎", labelFr: "Pomme", labelEn: "Apple", symbolId: "d-pomme" },
  { id: "butterfly", emoji: "🦋", labelFr: "Papillon", labelEn: "Butterfly", symbolId: "d-papillon" }
];

interface StickerPaletteProps {
  onSelectSticker: (stickerId: string) => void;
  lang: "fr" | "en";
  onClearPageStickers: () => void;
  hasStickersOnPage: boolean;
}

export const StickerPalette: React.FC<StickerPaletteProps> = ({
  onSelectSticker,
  lang,
  onClearPageStickers,
  hasStickersOnPage
}) => {
  return (
    <div className="no-print bg-white/95 backdrop-blur-sm p-3 rounded-2xl border-2 border-warm-border shadow-md w-full max-w-4xl mx-auto mt-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mb-2 pb-2 border-b border-warm-border">
        <div className="flex items-center gap-2">
          <Smile className="text-forest animate-bounce" size={20} />
          <span className="font-fun font-bold text-forest text-sm sm:text-base">
            {lang === "fr" ? "Boîte à autocollants magiques 🎨" : "Magical Sticker Box 🎨"}
          </span>
        </div>
        <p className="text-xs text-gray-500">
          {lang === "fr" 
            ? "Touche un autocollant pour le coller, puis glisse-le avec ton doigt !" 
            : "Tap a sticker to stick it, then drag it with your finger!"}
        </p>
        {hasStickersOnPage && (
          <button
            onClick={onClearPageStickers}
            className="flex items-center gap-1 text-xs text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 px-2.5 py-1 rounded-xl transition cursor-pointer font-bold"
          >
            <Trash2 size={13} />
            <span>{lang === "fr" ? "Enlever tout" : "Clear all"}</span>
          </button>
        )}
      </div>

      {/* Grid of Selectable Stickers */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 py-1">
        {STICKERS_LIST.map((sticker) => (
          <button
            key={sticker.id}
            onClick={() => onSelectSticker(sticker.id)}
            className="group flex flex-col items-center p-1.5 sm:p-2 bg-warm-cream hover:bg-warm-linen rounded-xl border-2 border-warm-border transition-all hover:scale-105 active:scale-95 cursor-pointer"
            style={{ minWidth: "64px" }}
          >
            {sticker.symbolId ? (
              <div className="w-10 h-10 flex items-center justify-center">
                <svg className="w-8 h-8 transition-transform group-hover:rotate-6">
                  <use href={`#${sticker.symbolId}`} />
                </svg>
              </div>
            ) : (
              <span className="text-3xl transition-transform group-hover:scale-110 group-hover:rotate-6">
                {sticker.emoji}
              </span>
            )}
            <span className="text-[10px] font-bold text-forest mt-0.5">
              {lang === "fr" ? sticker.labelFr : sticker.labelEn}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
