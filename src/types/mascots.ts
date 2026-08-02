import leoImg from "../assets/images/characters/leo-renard.png";
import ninaImg from "../assets/images/characters/nina-souris.png";
import tomImg from "../assets/images/characters/darina-herisson.png";
import zazaImg from "../assets/images/characters/lana-oiseau.png";
import samyImg from "../assets/images/avatar_3d_squirrel_1785660753217.jpg";
import chloeImg from "../assets/images/avatar_3d_owl_1785660768754.jpg";
import barnabeImg from "../assets/images/avatar_3d_bear_1785660779399.jpg";
import lunaImg from "../assets/images/avatar_3d_rabbit_1785660801822.jpg";
import felixImg from "../assets/images/avatar_3d_raccoon_1785660817501.jpg";
import pandaImg from "../assets/images/avatar_3d_panda_1785661251019.jpg";
import koalaImg from "../assets/images/avatar_3d_koala_1785661267356.jpg";
import mimiImg from "../assets/images/avatar_3d_cat_1785661282937.jpg";
import maxImg from "../assets/images/avatar_3d_puppy_1785661305698.jpg";

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

export interface CharacterAccessory {
  id: string;
  nameFr: string;
  nameEn: string;
  emoji: string;
  auraClass: string;
  badgeBg: string;
}

export const CHARACTER_ACCESSORIES: CharacterAccessory[] = [
  { id: "none", nameFr: "Aucun", nameEn: "None", emoji: "✨", auraClass: "shadow-emerald-500/30", badgeBg: "bg-emerald-500" }
];

export const MASCOTS: Record<string, Mascot> = {
  leo: {
    id: "leo",
    name: "Léo",
    species: "Renard Rusé",
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
    species: "Souris Douce",
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
    species: "Hérisson Malin",
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
    species: "Oiseau Enchanté",
    emoji: "🐦",
    image: zazaImg,
    color: "#3f9bd8",
    bgGradient: "from-sky-400 to-blue-500",
    quoteFr: "Regarde haut dans le ciel, la magie est partout !",
    quoteEn: "Look up in the sky, magic is everywhere!"
  },
  samy: {
    id: "samy",
    name: "Samy",
    species: "Écureuil Rapide",
    emoji: "🐿️",
    image: samyImg,
    color: "#c26d28",
    bgGradient: "from-amber-500 to-orange-600",
    quoteFr: "Hop hop hop ! On grimpe vers la victoire !",
    quoteEn: "Hop hop hop! Climbing to victory!"
  },
  chloe: {
    id: "chloe",
    name: "Chloé",
    species: "Chouette Sage",
    emoji: "🦉",
    image: chloeImg,
    color: "#6b5b95",
    bgGradient: "from-indigo-400 to-purple-600",
    quoteFr: "La sagesse commence par la curiosité !",
    quoteEn: "Wisdom begins with curiosity!"
  },
  barnabe: {
    id: "barnabe",
    name: "Barnabé",
    species: "Ourson Câlin",
    emoji: "🐻",
    image: barnabeImg,
    color: "#795548",
    bgGradient: "from-amber-700 to-yellow-800",
    quoteFr: "Un bon gros câlin et c'est parti pour apprendre !",
    quoteEn: "A big warm hug and let's learn!"
  },
  luna: {
    id: "luna",
    name: "Luna",
    species: "Lapine Joyeuse",
    emoji: "🐰",
    image: lunaImg,
    color: "#ec407a",
    bgGradient: "from-pink-400 to-rose-500",
    quoteFr: "Fais des grands bonds de joie !",
    quoteEn: "Make big leaps of joy!"
  },
  felix: {
    id: "felix",
    name: "Félix",
    species: "Raton Explorateur",
    emoji: "🦝",
    image: felixImg,
    color: "#455a64",
    bgGradient: "from-slate-500 to-teal-700",
    quoteFr: "Aucun mystère ne nous résiste !",
    quoteEn: "No mystery can resist us!"
  },
  panda: {
    id: "panda",
    name: "Bao",
    species: "Panda Gourmand",
    emoji: "🐼",
    image: pandaImg,
    color: "#37474f",
    bgGradient: "from-emerald-600 to-teal-800",
    quoteFr: "Miam ! Rien de mieux qu'un bon défi à croquer !",
    quoteEn: "Yum! Nothing better than a tasty challenge!"
  },
  koala: {
    id: "koala",
    name: "Koko",
    species: "Koala Rêveur",
    emoji: "🐨",
    image: koalaImg,
    color: "#78909c",
    bgGradient: "from-sky-500 to-indigo-600",
    quoteFr: "Rêvons grand et accomplissons des merveilles !",
    quoteEn: "Dream big and accomplish wonders!"
  },
  mimi: {
    id: "mimi",
    name: "Mimi",
    species: "Chat Joueur",
    emoji: "🐱",
    image: mimiImg,
    color: "#f57c00",
    bgGradient: "from-amber-400 to-rose-400",
    quoteFr: "Miaou ! Viens jouer et apprendre avec moi !",
    quoteEn: "Meow! Come play and learn with me!"
  },
  max: {
    id: "max",
    name: "Max",
    species: "Chiot Fidèle",
    emoji: "🐶",
    image: maxImg,
    color: "#8d6e63",
    bgGradient: "from-yellow-600 to-amber-700",
    quoteFr: "Wouf ! Je suis prêt pour toutes les aventures !",
    quoteEn: "Woof! I am ready for all adventures!"
  }
};

export function parseAvatarConfig(avatarStr?: string): { mascotId: string; accessoryId: string } {
  if (!avatarStr) return { mascotId: "leo", accessoryId: "none" };
  const parts = avatarStr.split(":");
  const mascotKey = parts[0]?.toLowerCase() || "leo";

  let mascotId = "leo";
  if (MASCOTS[mascotKey]) {
    mascotId = mascotKey;
  } else if (mascotKey.includes("nina") || mascotKey.includes("souris")) {
    mascotId = "nina";
  } else if (mascotKey.includes("tom") || mascotKey.includes("darina") || mascotKey.includes("herisson")) {
    mascotId = "tom";
  } else if (mascotKey.includes("zaza") || mascotKey.includes("lana") || mascotKey.includes("oiseau")) {
    mascotId = "zaza";
  } else if (mascotKey.includes("samy") || mascotKey.includes("squirrel") || mascotKey.includes("ecureuil")) {
    mascotId = "samy";
  } else if (mascotKey.includes("chloe") || mascotKey.includes("owl") || mascotKey.includes("chouette")) {
    mascotId = "chloe";
  } else if (mascotKey.includes("barnabe") || mascotKey.includes("ourson") || mascotKey.includes("bear")) {
    mascotId = "barnabe";
  } else if (mascotKey.includes("luna") || mascotKey.includes("rabbit") || mascotKey.includes("lapin")) {
    mascotId = "luna";
  } else if (mascotKey.includes("felix") || mascotKey.includes("raccoon") || mascotKey.includes("raton")) {
    mascotId = "felix";
  } else if (mascotKey.includes("panda") || mascotKey.includes("bao")) {
    mascotId = "panda";
  } else if (mascotKey.includes("koala") || mascotKey.includes("koko")) {
    mascotId = "koala";
  } else if (mascotKey.includes("mimi") || mascotKey.includes("cat") || mascotKey.includes("chat")) {
    mascotId = "mimi";
  } else if (mascotKey.includes("max") || mascotKey.includes("puppy") || mascotKey.includes("chiot")) {
    mascotId = "max";
  }

  const accessoryId = parts[1] || "none";
  return { mascotId, accessoryId };
}

export function formatAvatarConfig(mascotId: string, accessoryId?: string): string {
  return mascotId;
}

export function getMascot(id?: string): Mascot {
  if (!id) return MASCOTS.leo;
  const { mascotId } = parseAvatarConfig(id);
  return MASCOTS[mascotId] || MASCOTS.leo;
}

export function getAccessory(id?: string): CharacterAccessory {
  return CHARACTER_ACCESSORIES[0];
}

