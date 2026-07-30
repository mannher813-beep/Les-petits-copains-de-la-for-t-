import { supabase, isSupabaseConfigured } from "../supabase";
import { Tome, Chapitre, Enfant, Progression, LeaderboardEntry, TrancheAge } from "../types/multiTome";

// Initial seed data for fallback / local storage initialization
export const DEFAULT_TOMES: Tome[] = [
  {
    id: "tome-1-id",
    slug: "tome-1",
    titre: "Tome 1 : La Rencontre",
    couleur_theme: "#3f9142",
    ordre: 1,
    publie: true,
    description: "Fais la connaissance de Léo, Nina, Darina et Lana. Répare le pont et voyage dans la forêt !"
  },
  {
    id: "tome-2-id",
    slug: "tome-2",
    titre: "Tome 2 : La Cabane dans les Arbres",
    couleur_theme: "#d97706",
    ordre: 2,
    publie: true,
    description: "Aide les Copains à construire une incroyable cabane perchée et prépare la grande fête !"
  }
];

export const DEFAULT_CHAPITRES: Chapitre[] = [
  // Tome 1 Chapters
  {
    id: "chap-1-1",
    tome_id: "tome-1-id",
    slug: "chapitre-1",
    numero: 1,
    titre: "La Rencontre",
    couleur: "#4e9d58",
    question_defi: "Quelle est la première lettre du prénom de Léo le renard ?",
    type_reponse: "choix_multiple",
    choix: [
      { label: "A", correct: false },
      { label: "L", correct: true },
      { label: "E", correct: false }
    ],
    mots_secrets: ["LÉO", "AMITIÉ"],
    points: 10
  },
  {
    id: "chap-1-2",
    tome_id: "tome-1-id",
    slug: "chapitre-2",
    numero: 2,
    titre: "Le chemin du ruisseau",
    couleur: "#e07a3f",
    question_defi: "Combien d'oranges ou de pommes Nina la souris a-t-elle cueillies ?",
    type_reponse: "choix_multiple",
    choix: [
      { label: "3", correct: false },
      { label: "5", correct: true },
      { label: "7", correct: false }
    ],
    mots_secrets: ["RUISSEAU", "POMME"],
    points: 10
  },
  {
    id: "chap-1-3",
    tome_id: "tome-1-id",
    slug: "chapitre-3",
    numero: 3,
    titre: "Le pont cassé",
    couleur: "#38bdf8",
    question_defi: "Écris le mot secret pour réparer les planches du pont :",
    type_reponse: "texte_libre",
    reponse_attendue: "PONT",
    mots_secrets: ["PONT", "PLANCHES"],
    points: 15
  },
  {
    id: "chap-1-4",
    tome_id: "tome-1-id",
    slug: "chapitre-4",
    numero: 4,
    titre: "Le grand chêne",
    couleur: "#8b5cf6",
    question_defi: "Combien de beaux fruits sont cachés sous le grand chêne ?",
    type_reponse: "choix_multiple",
    choix: [
      { label: "4", correct: false },
      { label: "6", correct: true },
      { label: "8", correct: false }
    ],
    mots_secrets: ["CHÊNE", "ÉCUREUIL"],
    points: 10
  },
  {
    id: "chap-1-5",
    tome_id: "tome-1-id",
    slug: "chapitre-5",
    numero: 5,
    titre: "La faim des copains",
    couleur: "#ec4899",
    question_defi: "Quel friandise aime déguster Darina la hérissonne ?",
    type_reponse: "choix_multiple",
    choix: [
      { label: "Pomme", correct: true },
      { label: "Banane", correct: false },
      { label: "Citron", correct: false }
    ],
    mots_secrets: ["GOÛTER", "PARTAGE"],
    points: 10
  },
  {
    id: "chap-1-6",
    tome_id: "tome-1-id",
    slug: "chapitre-6",
    numero: 6,
    titre: "L'énigme des empreintes",
    couleur: "#059669",
    question_defi: "À quel animal appartient l'empreinte de coussinets sur le sentier ?",
    type_reponse: "choix_multiple",
    choix: [
      { label: "Léo le renard", correct: true },
      { label: "Lana l'oiseau", correct: false }
    ],
    mots_secrets: ["TRACES", "RENARD"],
    points: 10
  },
  {
    id: "chap-1-7",
    tome_id: "tome-1-id",
    slug: "chapitre-7",
    numero: 7,
    titre: "La chanson de Lana",
    couleur: "#f59e0b",
    question_defi: "Écris le cri joyeux chanté par Lana l'oiseau :",
    type_reponse: "texte_libre",
    reponse_attendue: "CUI",
    mots_secrets: ["CHANT", "OISEAU"],
    points: 15
  },
  {
    id: "chap-1-8",
    tome_id: "tome-1-id",
    slug: "chapitre-8",
    numero: 8,
    titre: "Le jardin secret",
    couleur: "#10b981",
    question_defi: "De quelle couleur est la fleur magique au cœur de la clairière ?",
    type_reponse: "choix_multiple",
    choix: [
      { label: "Rouge", correct: false },
      { label: "Jaune", correct: true },
      { label: "Bleue", correct: false }
    ],
    mots_secrets: ["FLEUR", "JARDIN"],
    points: 10
  },
  {
    id: "chap-1-9",
    tome_id: "tome-1-id",
    slug: "chapitre-9",
    numero: 9,
    titre: "La nuit tombante",
    couleur: "#6366f1",
    question_defi: "Quel ami de la nuit brille doucement dans l'obscurité ?",
    type_reponse: "choix_multiple",
    choix: [
      { label: "La luciole", correct: true },
      { label: "Le papillon de jour", correct: false }
    ],
    mots_secrets: ["ÉTOILE", "LUMIÈRE"],
    points: 10
  },
  {
    id: "chap-1-10",
    tome_id: "tome-1-id",
    slug: "chapitre-10",
    numero: 10,
    titre: "Le trésor de la forêt",
    couleur: "#84cc16",
    question_defi: "Quel est le plus grand trésor à préserver dans la forêt ?",
    type_reponse: "choix_multiple",
    choix: [
      { label: "L'amitié et la nature", correct: true },
      { label: "Une pièce en plastique", correct: false }
    ],
    mots_secrets: ["TRÉSOR", "NATURE"],
    points: 15
  },
  {
    id: "chap-1-11",
    tome_id: "tome-1-id",
    slug: "chapitre-11",
    numero: 11,
    titre: "La grande fête",
    couleur: "#f43f5e",
    question_defi: "Écris le mot de victoire pour célébrer la fin du Tome 1 :",
    type_reponse: "texte_libre",
    reponse_attendue: "BRAVO",
    mots_secrets: ["FÊTE", "VICTOIRE"],
    points: 20
  },

  // Tome 2 Chapters
  {
    id: "chap-2-1",
    tome_id: "tome-2-id",
    slug: "chapitre-1",
    numero: 1,
    titre: "Le Grand Projet",
    couleur: "#d97706",
    question_defi: "Dans quel arbre majestueux les copains veulent-ils construire la cabane ?",
    type_reponse: "choix_multiple",
    choix: [
      { label: "Le grand chêne", correct: true },
      { label: "Sous un buisson", correct: false }
    ],
    mots_secrets: ["CABANE", "ARBRE"],
    points: 10
  },
  {
    id: "chap-2-2",
    tome_id: "tome-2-id",
    slug: "chapitre-2",
    numero: 2,
    titre: "Les outils de charpentier",
    couleur: "#2563eb",
    question_defi: "Combien de clous faut-il pour assembler la première barrière ?",
    type_reponse: "choix_multiple",
    choix: [
      { label: "2", correct: false },
      { label: "4", correct: true },
      { label: "10", correct: false }
    ],
    mots_secrets: ["MARTEAU", "CLOU"],
    points: 10
  },
  {
    id: "chap-2-3",
    tome_id: "tome-2-id",
    slug: "chapitre-3",
    numero: 3,
    titre: "L'échelle de corde",
    couleur: "#059669",
    question_defi: "Écris le mot secret pour fabriquer l'échelle suspendue :",
    type_reponse: "texte_libre",
    reponse_attendue: "CORDE",
    mots_secrets: ["ÉCHELLE", "CORDE"],
    points: 15
  },
  {
    id: "chap-2-4",
    tome_id: "tome-2-id",
    slug: "chapitre-4",
    numero: 4,
    titre: "L'inauguration perchée",
    couleur: "#db2777",
    question_defi: "Quel drapeau flotte désormais fièrement au sommet de la cabane ?",
    type_reponse: "choix_multiple",
    choix: [
      { label: "Le drapeau des Copains", correct: true },
      { label: "Un drapeau noir", correct: false }
    ],
    mots_secrets: ["DRAPEAU", "SOMMET"],
    points: 15
  }
];

export const DEFAULT_ENFANTS: Enfant[] = [
  { id: "enf-1", pseudo: "LéoLover", avatar: "leo", tranche_age: "5-6" },
  { id: "enf-2", pseudo: "SourisNina", avatar: "nina", tranche_age: "5-6" },
  { id: "enf-3", pseudo: "FoxExplorateur", avatar: "leo", tranche_age: "6-7" },
  { id: "enf-4", pseudo: "PetiteHérissonne", avatar: "darina", tranche_age: "6-7" },
  { id: "enf-5", pseudo: "OiseauSuperStar", avatar: "lana", tranche_age: "7-8" }
];

export const DEFAULT_PROGRESSIONS: Progression[] = [
  { id: "prog-1", enfant_id: "enf-1", chapitre_id: "chap-1-1", valide_le: new Date().toISOString(), points_gagnes: 15, premiere_tentative: true },
  { id: "prog-2", enfant_id: "enf-1", chapitre_id: "chap-1-2", valide_le: new Date().toISOString(), points_gagnes: 15, premiere_tentative: true },
  { id: "prog-3", enfant_id: "enf-3", chapitre_id: "chap-1-1", valide_le: new Date().toISOString(), points_gagnes: 10, premiere_tentative: false }
];

// Helper to normalize strings for free-text answers
export function normalizeText(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

// Service implementation
class MultiTomeService {
  private getLocal<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(`forest_${key}`);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  }

  private setLocal<T>(key: string, value: T): void {
    try {
      localStorage.setItem(`forest_${key}`, JSON.stringify(value));
    } catch (e) {
      console.error(e);
    }
  }

  // --- TOMES ---
  async getTomes(): Promise<Tome[]> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from("tomes").select("*").order("ordre", { ascending: true });
        if (!error && data && data.length > 0) {
          return data as Tome[];
        }
      } catch (e) {
        console.warn("Supabase fetch tomes error, using local fallback", e);
      }
    }
    return this.getLocal<Tome[]>("tomes", DEFAULT_TOMES);
  }

  async getTomeBySlug(slug: string): Promise<Tome | null> {
    const tomes = await this.getTomes();
    return tomes.find((t) => t.slug === slug) || null;
  }

  async saveTome(tome: Partial<Tome>): Promise<Tome> {
    const tomes = await this.getTomes();
    let updatedTome: Tome;

    if (tome.id) {
      updatedTome = { ...tomes.find((t) => t.id === tome.id)!, ...tome };
      const newTomes = tomes.map((t) => (t.id === tome.id ? updatedTome : t));
      this.setLocal("tomes", newTomes);
    } else {
      updatedTome = {
        id: `tome-${Date.now()}`,
        slug: tome.slug || `tome-${tomes.length + 1}`,
        titre: tome.titre || `Tome ${tomes.length + 1}`,
        couleur_theme: tome.couleur_theme || "#3f9142",
        ordre: tome.ordre || tomes.length + 1,
        publie: tome.publie ?? true,
        description: tome.description || ""
      };
      this.setLocal("tomes", [...tomes, updatedTome]);
    }

    if (isSupabaseConfigured()) {
      try {
        await supabase.from("tomes").upsert(updatedTome);
      } catch (e) {
        console.warn("Supabase upsert tome error", e);
      }
    }

    return updatedTome;
  }

  // --- CHAPITRES ---
  async getChapitresByTomeId(tomeId: string): Promise<Chapitre[]> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from("chapitres")
          .select("*")
          .eq("tome_id", tomeId)
          .order("numero", { ascending: true });
        if (!error && data && data.length > 0) {
          return data as Chapitre[];
        }
      } catch (e) {
        console.warn("Supabase fetch chapitres error, using local fallback", e);
      }
    }
    const chapitres = this.getLocal<Chapitre[]>("chapitres", DEFAULT_CHAPITRES);
    return chapitres
      .filter((c) => c.tome_id === tomeId)
      .sort((a, b) => a.numero - b.numero);
  }

  async getChapitreBySlugs(tomeSlug: string, chapitreSlug: string): Promise<{ tome: Tome; chapitre: Chapitre } | null> {
    const tome = await this.getTomeBySlug(tomeSlug);
    if (!tome) return null;
    const chapitres = await this.getChapitresByTomeId(tome.id);
    const chapitre = chapitres.find((c) => c.slug === chapitreSlug);
    if (!chapitre) return null;
    return { tome, chapitre };
  }

  async saveChapitre(chapitre: Partial<Chapitre>): Promise<Chapitre> {
    const allChapitres = this.getLocal<Chapitre[]>("chapitres", DEFAULT_CHAPITRES);
    let updated: Chapitre;

    if (chapitre.id) {
      updated = { ...allChapitres.find((c) => c.id === chapitre.id)!, ...chapitre };
      const newChapitres = allChapitres.map((c) => (c.id === chapitre.id ? updated : c));
      this.setLocal("chapitres", newChapitres);
    } else {
      updated = {
        id: `chap-${Date.now()}`,
        tome_id: chapitre.tome_id || "tome-1-id",
        slug: chapitre.slug || `chapitre-${Date.now()}`,
        numero: chapitre.numero || 1,
        titre: chapitre.titre || "Nouveau Chapitre",
        couleur: chapitre.couleur || "#3f9142",
        question_defi: chapitre.question_defi || "Quelle est la réponse ?",
        type_reponse: chapitre.type_reponse || "choix_multiple",
        choix: chapitre.choix || [{ label: "Option A", correct: true }],
        reponse_attendue: chapitre.reponse_attendue || "",
        mots_secrets: chapitre.mots_secrets || ["MOT"],
        points: chapitre.points || 10
      };
      this.setLocal("chapitres", [...allChapitres, updated]);
    }

    if (isSupabaseConfigured()) {
      try {
        await supabase.from("chapitres").upsert(updated);
      } catch (e) {
        console.warn("Supabase upsert chapitre error", e);
      }
    }

    return updated;
  }

  // --- ENFANTS (PROFILS) ---
  async getEnfantsByParent(parentId?: string): Promise<Enfant[]> {
    if (isSupabaseConfigured() && parentId) {
      try {
        const { data, error } = await supabase.from("enfants").select("*").eq("parent_id", parentId);
        if (!error && data) {
          return data as Enfant[];
        }
      } catch (e) {
        console.warn("Supabase fetch enfants error", e);
      }
    }
    return this.getLocal<Enfant[]>("enfants", DEFAULT_ENFANTS);
  }

  async getEnfantById(id: string): Promise<Enfant | null> {
    const enfants = await this.getEnfantsByParent();
    return enfants.find((e) => e.id === id) || null;
  }

  async saveEnfant(enfant: Partial<Enfant>): Promise<Enfant> {
    const enfants = this.getLocal<Enfant[]>("enfants", DEFAULT_ENFANTS);
    let updated: Enfant;

    if (enfant.id) {
      updated = { ...enfants.find((e) => e.id === enfant.id)!, ...enfant };
      const newEnfants = enfants.map((e) => (e.id === enfant.id ? updated : e));
      this.setLocal("enfants", newEnfants);
    } else {
      updated = {
        id: `enf-${Date.now()}`,
        pseudo: enfant.pseudo || "PetitCopain",
        avatar: enfant.avatar || "leo",
        tranche_age: enfant.tranche_age || "5-6",
        code_livre: enfant.code_livre || "",
        parent_id: enfant.parent_id || undefined,
        cree_le: new Date().toISOString()
      };
      this.setLocal("enfants", [...enfants, updated]);
    }

    if (isSupabaseConfigured()) {
      try {
        await supabase.from("enfants").upsert(updated);
      } catch (e) {
        console.warn("Supabase upsert enfant error", e);
      }
    }

    return updated;
  }

  // --- PROGRESSIONS & SCORING ---
  async getProgressionsByEnfant(enfantId: string): Promise<Progression[]> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from("progressions").select("*").eq("enfant_id", enfantId);
        if (!error && data) {
          return data as Progression[];
        }
      } catch (e) {
        console.warn("Supabase fetch progressions error", e);
      }
    }
    const progs = this.getLocal<Progression[]>("progressions", DEFAULT_PROGRESSIONS);
    return progs.filter((p) => p.enfant_id === enfantId);
  }

  async validerProgression(
    enfantId: string,
    chapitreId: string,
    points: number,
    isFirstAttempt: boolean
  ): Promise<Progression> {
    const allProgs = this.getLocal<Progression[]>("progressions", DEFAULT_PROGRESSIONS);
    const existing = allProgs.find((p) => p.enfant_id === enfantId && p.chapitre_id === chapitreId);

    if (existing) {
      return existing; // Already validated
    }

    const pointsGagnes = points + (isFirstAttempt ? 5 : 0); // +5 bonus for 1st attempt

    const newProg: Progression = {
      id: `prog-${Date.now()}`,
      enfant_id: enfantId,
      chapitre_id: chapitreId,
      valide_le: new Date().toISOString(),
      points_gagnes: pointsGagnes,
      premiere_tentative: isFirstAttempt
    };

    this.setLocal("progressions", [...allProgs, newProg]);

    if (isSupabaseConfigured()) {
      try {
        await supabase.from("progressions").insert(newProg);
      } catch (e) {
        console.warn("Supabase insert progression error", e);
      }
    }

    return newProg;
  }

  // --- CLASSEMENT (LEADERBOARD) ---
  async getLeaderboard(trancheAge: TrancheAge): Promise<LeaderboardEntry[]> {
    const enfants = this.getLocal<Enfant[]>("enfants", DEFAULT_ENFANTS);
    const progressions = this.getLocal<Progression[]>("progressions", DEFAULT_PROGRESSIONS);

    const filteredEnfants = enfants.filter((e) => e.tranche_age === trancheAge);

    const entries: LeaderboardEntry[] = filteredEnfants.map((enfant) => {
      const childProgs = progressions.filter((p) => p.enfant_id === enfant.id);
      const total_points = childProgs.reduce((sum, p) => sum + p.points_gagnes, 0);
      return {
        enfant,
        total_points,
        chapitres_valides: childProgs.length,
        rang: 0
      };
    });

    // Sort by total points descending
    entries.sort((a, b) => b.total_points - a.total_points);

    // Assign rank
    return entries.map((entry, idx) => ({ ...entry, rang: idx + 1 }));
  }
}

export const multiTomeService = new MultiTomeService();
