import leoImg from "../assets/images/characters/leo-renard.png";
import ninaImg from "../assets/images/characters/nina-souris.png";
import tomImg from "../assets/images/characters/darina-herisson.png";
import zazaImg from "../assets/images/characters/lana-oiseau.png";

export interface Mascot {
  id: string;
  name: string;
  species: string;
  emoji: string;
  image: string;
  color: string;
  bgGradient: string;
  quoteFr: string;
  quoteEn: string;
}

export const MASCOTS: Record<string, Mascot> = {
  leo: {
    id: "leo",
    name: "Léo",
    species: "Renard",
    emoji: "🦊",
    image: leoImg,
    color: "#e08a2e",
    bgGradient: "from-orange-400 to-amber-500",
    quoteFr: "Prêt pour une super aventure dans la forêt ?",
    quoteEn: "Ready for a super forest adventure?"
  },
  nina: {
    id: "nina",
    name: "Nina",
    species: "Souris",
    emoji: "🐭",
    image: ninaImg,
    color: "#a083ba",
    bgGradient: "from-purple-400 to-indigo-400",
    quoteFr: "J'adore résoudre des énigmes avec toi !",
    quoteEn: "I love solving puzzles with you!"
  },
  tom: {
    id: "tom",
    name: "Tom",
    species: "Hérisson",
    emoji: "🦔",
    image: tomImg,
    color: "#8B5E3C",
    bgGradient: "from-amber-600 to-yellow-600",
    quoteFr: "Pas à pas, on va réussir tous les défis !",
    quoteEn: "Step by step, we will solve all challenges!"
  },
  zaza: {
    id: "zaza",
    name: "Zaza",
    species: "Oiseau",
    emoji: "🐦",
    image: zazaImg,
    color: "#3f9bd8",
    bgGradient: "from-sky-400 to-blue-500",
    quoteFr: "Regarde haut dans le ciel, la magie est partout !",
    quoteEn: "Look up in the sky, magic is everywhere!"
  }
};

export function getMascot(id?: string): Mascot {
  if (!id) return MASCOTS.leo;
  if (id.startsWith("data:") || id.startsWith("http") || id.startsWith("blob:")) {
    return {
      id: "custom",
      name: "Photo",
      species: "Mon Profil",
      emoji: "📸",
      image: id,
      color: "#10b981",
      bgGradient: "from-emerald-400 to-teal-500",
      quoteFr: "Super photo de profil !",
      quoteEn: "Awesome profile picture!"
    };
  }
  const key = id.toLowerCase();
  if (key.includes("nina") || key.includes("souris")) return MASCOTS.nina;
  if (key.includes("tom") || key.includes("darina") || key.includes("herisson")) return MASCOTS.tom;
  if (key.includes("zaza") || key.includes("lana") || key.includes("oiseau")) return MASCOTS.zaza;
  return MASCOTS.leo;
}
