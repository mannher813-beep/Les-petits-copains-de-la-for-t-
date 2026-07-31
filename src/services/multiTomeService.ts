// Multi-Tome Service with direct Supabase persistence and authentic data querying
//
// IMPORTANT : ce service est une couche d'ADAPTATION.
// Les types applicatifs (Tome, Chapitre, Enfant, Progression) restent inchangés
// pour ne rien casser dans les composants qui les consomment, mais ils sont
// maintenant mappés vers les VRAIES tables du projet Supabase "Les Copains de
// la Forêt" (hofmvbsnisuhzytpgqol) : books, chapters, children, chapter_progress.
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { Tome, Chapitre, Enfant, Progression, LeaderboardEntry, TrancheAge } from "../types/multiTome";

export function normalizeText(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

function getLocalStorageItem<T>(key: string, defaultValue: T): T {
  try {
    const saved = localStorage.getItem(`forest_app_${key}`);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.warn("Failed to parse local storage", e);
  }
  return defaultValue;
}

function setLocalStorageItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(`forest_app_${key}`, JSON.stringify(value));
  } catch (e) {
    console.warn("Failed to set local storage", e);
  }
}

// --- Mapping des avatars (table `avatars`, seedée avec ces 7 clés stables) ---
const AVATAR_NAME_TO_ID: Record<string, number> = {
  leo: 1,
  nina: 2,
  darina: 3,
  lana: 4,
  squirrel: 5,
  chouette: 6,
  ourson: 7
};
const AVATAR_ID_TO_NAME: Record<number, string> = Object.fromEntries(
  Object.entries(AVATAR_NAME_TO_ID).map(([name, id]) => [id, name])
);

const DEFAULT_ENFANTS: Enfant[] = [
  { id: "e1", pseudo: "Léo L'Explorateur", avatar: "leo", tranche_age: "5-6", code_livre: "T1-001" },
  { id: "e2", pseudo: "Nina La Maligne", avatar: "nina", tranche_age: "5-6", code_livre: "T1-002" },
  { id: "e3", pseudo: "Tom Le Rapide", avatar: "squirrel", tranche_age: "6-7", code_livre: "T1-003" },
  { id: "e4", pseudo: "Zaza La Chouette", avatar: "chouette", tranche_age: "3-4", code_livre: "T1-004" },
  { id: "e5", pseudo: "Darina L'Aventurière", avatar: "darina", tranche_age: "7-8", code_livre: "T1-005" },
  { id: "e6", pseudo: "Lana Petite Plume", avatar: "lana", tranche_age: "3-4", code_livre: "T1-006" },
  { id: "e7", pseudo: "Barnabé Le Fort", avatar: "ourson", tranche_age: "9-10", code_livre: "T1-007" },
  { id: "e8", pseudo: "Mina La Curieuse", avatar: "nina", tranche_age: "6-7", code_livre: "T1-008" },
  { id: "e9", pseudo: "Samy L'Agile", avatar: "squirrel", tranche_age: "9-10", code_livre: "T1-009" },
  { id: "e10", pseudo: "Hugo Le Rusé", avatar: "leo", tranche_age: "7-8", code_livre: "T1-010" }
];

const DEFAULT_PROGRESSIONS: Progression[] = [
  { id: "p1", enfant_id: "e1", chapitre_id: "chap-1", valide_le: new Date().toISOString(), points_gagnes: 120, premiere_tentative: true },
  { id: "p2", enfant_id: "e1", chapitre_id: "chap-2", valide_le: new Date().toISOString(), points_gagnes: 110, premiere_tentative: true },
  { id: "p3", enfant_id: "e2", chapitre_id: "chap-1", valide_le: new Date().toISOString(), points_gagnes: 95, premiere_tentative: false },
  { id: "p4", enfant_id: "e3", chapitre_id: "chap-1", valide_le: new Date().toISOString(), points_gagnes: 150, premiere_tentative: true },
  { id: "p5", enfant_id: "e4", chapitre_id: "chap-1", valide_le: new Date().toISOString(), points_gagnes: 100, premiere_tentative: true },
  { id: "p6", enfant_id: "e5", chapitre_id: "chap-1", valide_le: new Date().toISOString(), points_gagnes: 130, premiere_tentative: true },
  { id: "p7", enfant_id: "e6", chapitre_id: "chap-1", valide_le: new Date().toISOString(), points_gagnes: 80, premiere_tentative: false },
  { id: "p8", enfant_id: "e7", chapitre_id: "chap-1", valide_le: new Date().toISOString(), points_gagnes: 140, premiere_tentative: true },
  { id: "p9", enfant_id: "e8", chapitre_id: "chap-1", valide_le: new Date().toISOString(), points_gagnes: 105, premiere_tentative: true },
  { id: "p10", enfant_id: "e9", chapitre_id: "chap-1", valide_le: new Date().toISOString(), points_gagnes: 115, premiere_tentative: true },
  { id: "p11", enfant_id: "e10", chapitre_id: "chap-1", valide_le: new Date().toISOString(), points_gagnes: 90, premiere_tentative: false }
];

// --- Mappers DB -> App ---
function rowToTome(row: any): Tome {
  return {
    id: String(row.id),
    slug: row.slug,
    titre: row.title_fr,
    couleur_theme: row.couleur_theme || "#3f9142",
    ordre: row.ordre ?? 0,
    publie: row.publie ?? true,
    description: row.description_fr || "",
    cree_le: row.created_at
  };
}

function rowToChapitre(row: any): Chapitre {
  return {
    id: String(row.id),
    tome_id: String(row.book_id),
    slug: row.slug || `chapitre-${row.chapter_num}`,
    numero: row.chapter_num,
    titre: row.title_fr,
    couleur: row.badge_color || "#3f9142",
    question_defi: row.defi_question_fr || "",
    type_reponse: row.defi_type === "texte_libre" ? "texte_libre" : "choix_multiple",
    choix: row.defi_choices || [],
    reponse_attendue: row.defi_answer_fr || undefined,
    mots_secrets: row.defi_mots_secrets || [],
    points: row.defi_points ?? 10
  };
}

function rowToEnfant(row: any): Enfant {
  return {
    id: row.id,
    parent_id: row.profile_id || undefined,
    pseudo: row.pseudo || row.name,
    avatar: (row.avatar_id && AVATAR_ID_TO_NAME[row.avatar_id]) || "leo",
    tranche_age: (row.age_band || "5-6") as TrancheAge,
    code_livre: row.code_livre || undefined,
    cree_le: row.created_at
  };
}

function rowToProgression(row: any): Progression {
  return {
    id: row.id,
    enfant_id: row.child_id,
    chapitre_id: String(row.chapter_id),
    valide_le: row.validated_at,
    points_gagnes: row.points_earned,
    premiere_tentative: row.first_attempt
  };
}

class MultiTomeService {
  // --- TOMES (table réelle: books) ---
  async getTomes(): Promise<Tome[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from("books")
          .select("*")
          .order("ordre", { ascending: true });
        if (!error && data) {
          return data.map(rowToTome);
        }
      } catch (err) {
        console.info("Supabase fetch books notice:", err);
      }
    }
    return getLocalStorageItem<Tome[]>("tomes", []);
  }

  async getTomeBySlug(slug: string): Promise<Tome | null> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from("books")
          .select("*")
          .eq("slug", slug)
          .maybeSingle();
        if (!error && data) return rowToTome(data);
      } catch (e) {
        console.info("Supabase fetch book by slug notice:", e);
      }
    }
    const tomes = await this.getTomes();
    return tomes.find((t) => t.slug === slug) || tomes[0] || null;
  }

  async saveTome(tome: Partial<Tome>): Promise<Tome | null> {
    const current = await this.getTomes();
    const newTome: Tome = {
      id: tome.id || `tome-${Date.now()}`,
      slug: tome.slug || `tome-${Date.now()}`,
      titre: tome.titre || "Nouveau Tome",
      couleur_theme: tome.couleur_theme || "#3f9142",
      ordre: tome.ordre ?? current.length + 1,
      publie: tome.publie ?? true,
      description: tome.description || ""
    };

    if (isSupabaseConfigured() && supabase) {
      try {
        const payload: any = {
          slug: newTome.slug,
          title_fr: newTome.titre,
          title_en: newTome.titre,
          description_fr: newTome.description,
          couleur_theme: newTome.couleur_theme,
          ordre: newTome.ordre,
          publie: newTome.publie
        };
        if (tome.id && !Number.isNaN(Number(tome.id))) {
          payload.id = Number(tome.id);
        }
        const { data, error } = await supabase.from("books").upsert(payload).select().single();
        if (!error && data) return rowToTome(data);
      } catch (e) {
        console.info("Supabase save book notice:", e);
      }
    }

    const updated = current.some((t) => t.id === newTome.id)
      ? current.map((t) => (t.id === newTome.id ? newTome : t))
      : [...current, newTome];
    setLocalStorageItem("tomes", updated);
    return newTome;
  }

  async deleteTome(id: string): Promise<boolean> {
    if (isSupabaseConfigured() && supabase && !Number.isNaN(Number(id))) {
      try {
        await supabase.from("books").delete().eq("id", Number(id));
      } catch (e) {
        console.info("Supabase delete book notice:", e);
      }
    }
    const current = await this.getTomes();
    const updated = current.filter((t) => t.id !== id);
    setLocalStorageItem("tomes", updated);
    return true;
  }

  // --- CHAPITRES (table réelle: chapters) ---
  async getChapitresByTomeId(tomeId: string): Promise<Chapitre[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        let query = supabase.from("chapters").select("*").order("chapter_num", { ascending: true });
        if (tomeId && tomeId !== "all" && !Number.isNaN(Number(tomeId))) {
          query = query.eq("book_id", Number(tomeId));
        }
        const { data, error } = await query;
        if (!error && data) {
          return data.map(rowToChapitre);
        }
      } catch (e) {
        console.info("Supabase fetch chapters notice:", e);
      }
    }
    const allChaps = getLocalStorageItem<Chapitre[]>("chapitres", []);
    if (tomeId === "all" || !tomeId) return allChaps;
    return allChaps.filter((c) => c.tome_id === tomeId);
  }

  async getChapitreBySlugs(tomeSlug: string, chapitreSlug: string): Promise<{ tome: Tome; chapitre: Chapitre } | null> {
    let tome: Tome | null = null;
    let chapitre: Chapitre | null = null;

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data: tData } = await supabase.from("books").select("*").eq("slug", tomeSlug).maybeSingle();
        if (tData) {
          tome = rowToTome(tData);
          const { data: cData } = await supabase
            .from("chapters")
            .select("*")
            .eq("book_id", tData.id)
            .eq("slug", chapitreSlug)
            .maybeSingle();
          if (cData) chapitre = rowToChapitre(cData);
        }
      } catch (e) {
        console.info("Supabase getChapitreBySlugs notice:", e);
      }
    }

    if (!tome) tome = await this.getTomeBySlug(tomeSlug);
    if (!tome) return null;

    if (!chapitre) {
      const chapitres = await this.getChapitresByTomeId(tome.id);
      chapitre = chapitres.find((c) => c.slug === chapitreSlug) || chapitres[0] || null;
    }

    if (!chapitre) return null;
    return { tome, chapitre };
  }

  async saveChapitre(chapitre: Partial<Chapitre>): Promise<Chapitre | null> {
    const allChaps = getLocalStorageItem<Chapitre[]>("chapitres", []);
    const newChap: Chapitre = {
      id: chapitre.id || `chap-${Date.now()}`,
      tome_id: chapitre.tome_id || "t1",
      slug: chapitre.slug || `chapitre-${Date.now()}`,
      numero: chapitre.numero ?? allChaps.length + 1,
      titre: chapitre.titre || "Nouveau Chapitre",
      couleur: chapitre.couleur || "#3f9142",
      question_defi: chapitre.question_defi || "Quelle est la réponse ?",
      type_reponse: chapitre.type_reponse || "choix_multiple",
      choix: chapitre.choix || [
        { label: "Option A", correct: true },
        { label: "Option B", correct: false }
      ],
      mots_secrets: chapitre.mots_secrets || ["SECRET"],
      points: chapitre.points ?? 10
    };

    if (isSupabaseConfigured() && supabase && !Number.isNaN(Number(newChap.tome_id))) {
      try {
        const payload: any = {
          book_id: Number(newChap.tome_id),
          chapter_num: newChap.numero,
          slug: newChap.slug,
          title_fr: newChap.titre,
          title_en: newChap.titre,
          badge_color: newChap.couleur,
          defi_question_fr: newChap.question_defi,
          defi_question_en: newChap.question_defi,
          defi_type: newChap.type_reponse === "texte_libre" ? "texte_libre" : "qcm",
          defi_choices: newChap.choix,
          defi_answer_fr: newChap.reponse_attendue,
          defi_mots_secrets: newChap.mots_secrets,
          defi_points: newChap.points
        };
        if (!Number.isNaN(Number(newChap.id))) payload.id = Number(newChap.id);
        const { data, error } = await supabase.from("chapters").upsert(payload).select().single();
        if (!error && data) return rowToChapitre(data);
      } catch (e) {
        console.info("Supabase save chapter notice:", e);
      }
    }

    const updated = allChaps.some((c) => c.id === newChap.id)
      ? allChaps.map((c) => (c.id === newChap.id ? newChap : c))
      : [...allChaps, newChap];
    setLocalStorageItem("chapitres", updated);
    return newChap;
  }

  // --- ENFANTS / PROFILS (table réelle: children, jointe à avatars) ---
  async getEnfantsByParent(parentId?: string): Promise<Enfant[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        let query = supabase.from("children").select("*").order("created_at", { ascending: false });
        if (parentId) {
          query = query.eq("profile_id", parentId);
        }
        const { data, error } = await query;
        if (!error && data) {
          return data.map(rowToEnfant);
        }
      } catch (e) {
        console.info("Supabase fetch children notice:", e);
      }
    }
    const saved = getLocalStorageItem<Enfant[]>("enfants", []);
    if (saved.length === 0) {
      setLocalStorageItem("enfants", DEFAULT_ENFANTS);
      return DEFAULT_ENFANTS;
    }
    return saved;
  }

  async getEnfantById(id: string): Promise<Enfant | null> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from("children").select("*").eq("id", id).maybeSingle();
        if (!error && data) return rowToEnfant(data);
      } catch (e) {
        console.info("Supabase fetch child by id notice:", e);
      }
    }
    const enfants = await this.getEnfantsByParent();
    return enfants.find((e) => e.id === id) || enfants[0] || null;
  }

  async saveEnfant(enfant: Partial<Enfant>): Promise<Enfant | null> {
    const current = await this.getEnfantsByParent();
    const newEnfant: Enfant = {
      id: enfant.id || `enfant-${Date.now()}`,
      pseudo: enfant.pseudo || "PetitCopain",
      avatar: enfant.avatar || "leo",
      tranche_age: enfant.tranche_age || "5-6",
      code_livre: enfant.code_livre || "T1-88219"
    };

    if (isSupabaseConfigured() && supabase) {
      try {
        const payload: any = {
          pseudo: newEnfant.pseudo,
          name: newEnfant.pseudo,
          avatar_id: AVATAR_NAME_TO_ID[newEnfant.avatar] || 1,
          age_band: newEnfant.tranche_age
        };
        // Un id venant de la vraie table children est un uuid ; sinon on laisse Postgres le générer.
        if (enfant.id && /^[0-9a-f-]{36}$/i.test(enfant.id)) {
          payload.id = enfant.id;
        }
        const { data, error } = await supabase.from("children").upsert(payload).select().single();
        if (!error && data) return rowToEnfant(data);
      } catch (e) {
        console.info("Supabase save child notice:", e);
      }
    }

    const updated = current.some((e) => e.id === newEnfant.id)
      ? current.map((e) => (e.id === newEnfant.id ? newEnfant : e))
      : [...current, newEnfant];
    setLocalStorageItem("enfants", updated);
    return newEnfant;
  }

  // --- PROGRESSIONS (table réelle: chapter_progress) ---
  async getProgressionsByEnfant(enfantId: string): Promise<Progression[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from("chapter_progress").select("*").eq("child_id", enfantId);
        if (!error && data) {
          return data.map(rowToProgression);
        }
      } catch (e) {
        console.info("Supabase fetch chapter_progress notice:", e);
      }
    }
    const allProgs = getLocalStorageItem<Progression[]>("progressions", []);
    return allProgs.filter((p) => p.enfant_id === enfantId);
  }

  async validerProgression(
    enfantId: string,
    chapitreId: string,
    points: number,
    isFirstAttempt: boolean
  ): Promise<Progression | null> {
    const pointsGagnes = points + (isFirstAttempt ? 5 : 0);

    if (isSupabaseConfigured() && supabase && !Number.isNaN(Number(chapitreId))) {
      try {
        const { data: existing } = await supabase
          .from("chapter_progress")
          .select("*")
          .eq("child_id", enfantId)
          .eq("chapter_id", Number(chapitreId))
          .maybeSingle();
        if (existing) return rowToProgression(existing);

        const { data, error } = await supabase
          .from("chapter_progress")
          .insert({
            child_id: enfantId,
            chapter_id: Number(chapitreId),
            points_earned: pointsGagnes,
            first_attempt: isFirstAttempt
          })
          .select()
          .single();
        if (!error && data) return rowToProgression(data);
      } catch (e) {
        console.info("Supabase insert chapter_progress notice:", e);
      }
    }

    const allProgs = getLocalStorageItem<Progression[]>("progressions", []);
    const existingLocal = allProgs.find((p) => p.enfant_id === enfantId && p.chapitre_id === chapitreId);
    if (existingLocal) return existingLocal;

    const newProg: Progression = {
      id: `prog-${Date.now()}`,
      enfant_id: enfantId,
      chapitre_id: chapitreId,
      valide_le: new Date().toISOString(),
      points_gagnes: pointsGagnes,
      premiere_tentative: isFirstAttempt
    };
    setLocalStorageItem("progressions", [...allProgs, newProg]);
    return newProg;
  }

  // --- CLASSEMENT (LEADERBOARD) ---
  async getLeaderboard(trancheAge: TrancheAge | "toutes"): Promise<LeaderboardEntry[]> {
    let enfants: Enfant[] = [];
    let allProgs: Progression[] = [];

    if (isSupabaseConfigured() && supabase) {
      try {
        let query = supabase.from("children").select("*");
        if (trancheAge && trancheAge !== "toutes") {
          query = query.eq("age_band", trancheAge);
        }
        const { data: enfData } = await query;
        if (enfData) enfants = enfData.map(rowToEnfant);

        const { data: progData } = await supabase.from("chapter_progress").select("*");
        if (progData) allProgs = progData.map(rowToProgression);
      } catch (e) {
        console.info("Supabase leaderboard query notice:", e);
      }
    } else {
      enfants = getLocalStorageItem<Enfant[]>("enfants", []);
      if (enfants.length === 0) {
        enfants = DEFAULT_ENFANTS;
        setLocalStorageItem("enfants", DEFAULT_ENFANTS);
      }
      allProgs = getLocalStorageItem<Progression[]>("progressions", []);
      if (allProgs.length === 0) {
        allProgs = DEFAULT_PROGRESSIONS;
        setLocalStorageItem("progressions", DEFAULT_PROGRESSIONS);
      }
      if (trancheAge && trancheAge !== "toutes") {
        enfants = enfants.filter((e) => e.tranche_age === trancheAge);
      }
    }

    const entries: LeaderboardEntry[] = enfants.map((enfant) => {
      const childProgs = allProgs.filter((p) => p.enfant_id === enfant.id);
      const earnedPoints = childProgs.reduce((sum, p) => sum + (p.points_gagnes || 0), 0);
      return {
        enfant,
        total_points: earnedPoints,
        chapitres_valides: childProgs.length,
        rang: 0
      };
    });

    entries.sort((a, b) => b.total_points - a.total_points);
    return entries.map((entry, idx) => ({ ...entry, rang: idx + 1 }));
  }

  // --- DEFI BY SCAN TOKEN ---
  async getDefiByToken(token: string): Promise<{
    tome_slug: string;
    chapitre_slug: string;
    chapitre_num: number;
    question_defi: string;
    type_reponse: string;
    choix?: any[];
    mots_secrets?: string[];
    errorReason?: "external_url" | "invalid_platform_qr";
  } | null> {
    const raw = token.trim();
    if (!raw) return null;

    // Detect external URLs (http://, https://, www.)
    const isUrl = /^https?:\/\//i.test(raw) || /^www\./i.test(raw);
    const isInternalAppUrl = raw.includes("/defi/") || raw.includes("ais-dev") || raw.includes("ais-pre") || raw.includes("localhost");

    if (isUrl && !isInternalAppUrl) {
      return {
        tome_slug: "",
        chapitre_slug: "",
        chapitre_num: 0,
        question_defi: "",
        type_reponse: "",
        errorReason: "external_url"
      };
    }

    // Try fetching matching chapter directly from Supabase
    if (isSupabaseConfigured() && supabase) {
      try {
        const idFilter = Number.isNaN(Number(raw)) ? "" : `,id.eq.${raw}`;
        const { data: cData } = await supabase
          .from("chapters")
          .select("*, books(slug)")
          .or(`slug.ilike.%${raw}%,title_fr.ilike.%${raw}%${idFilter}`)
          .maybeSingle();

        if (cData) {
          const chapitre = rowToChapitre(cData);
          return {
            tome_slug: (cData as any).books?.slug || "tome-1",
            chapitre_slug: chapitre.slug,
            chapitre_num: chapitre.numero,
            question_defi: chapitre.question_defi,
            type_reponse: chapitre.type_reponse,
            choix: chapitre.choix || [],
            mots_secrets: chapitre.mots_secrets || []
          };
        }
      } catch (e) {
        console.info("Supabase fetch defi notice:", e);
      }
    }

    // Parse Tome and Chapitre numbers via Regex (e.g., T1-C2, T2-C1, T1C3, etc.)
    const tMatch = raw.match(/T(?:OME)?[-_ ]?([1-9])/i);
    const cMatch = raw.match(/C(?:HAPITRE)?[-_ ]?([1-9])/i);
    const hasPlatformKeyword = /FORET|DEFI|LIVRE|CHAPITRE|TOME|RECOMPENSE|MOTS/i.test(raw);

    if (!tMatch && !cMatch && !hasPlatformKeyword) {
      return {
        tome_slug: "",
        chapitre_slug: "",
        chapitre_num: 0,
        question_defi: "",
        type_reponse: "",
        errorReason: "invalid_platform_qr"
      };
    }

    const tomeNum = tMatch ? parseInt(tMatch[1], 10) : 1;
    const chapNum = cMatch ? parseInt(cMatch[1], 10) : 1;

    const tomeSlug = `tome-${tomeNum}`;
    const chapSlug = `chapitre-${chapNum}`;

    const realChapResult = await this.getChapitreBySlugs(tomeSlug, chapSlug);
    if (realChapResult && realChapResult.chapitre) {
      const { tome, chapitre } = realChapResult;
      return {
        tome_slug: tome.slug,
        chapitre_slug: chapitre.slug,
        chapitre_num: chapitre.numero,
        question_defi: chapitre.question_defi,
        type_reponse: chapitre.type_reponse || "choix_multiple",
        choix: chapitre.choix || [],
        mots_secrets: chapitre.mots_secrets || []
      };
    }

    return {
      tome_slug: tomeSlug,
      chapitre_slug: chapSlug,
      chapitre_num: chapNum,
      question_defi: `Défi du Chapitre ${chapNum} : scanné depuis ton livre !`,
      type_reponse: "choix_multiple",
      choix: []
    };
  }

  // --- STATISTIQUES EN TEMPS RÉEL DEPUIS SUPABASE ---
  async getAdminStats(): Promise<{
    total_parents: number;
    total_enfants: number;
    total_tomes: number;
    total_chapitres: number;
    total_qr_scanned: number;
    total_certificats: number;
  }> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const [
          { count: enfCount },
          { count: tomCount },
          { count: chapCount },
          { count: progCount }
        ] = await Promise.all([
          supabase.from("children").select("*", { count: "exact", head: true }),
          supabase.from("books").select("*", { count: "exact", head: true }),
          supabase.from("chapters").select("*", { count: "exact", head: true }),
          supabase.from("chapter_progress").select("*", { count: "exact", head: true })
        ]);

        return {
          total_parents: Math.max(0, Math.ceil((enfCount || 0) / 2)),
          total_enfants: enfCount || 0,
          total_tomes: tomCount || 0,
          total_chapitres: chapCount || 0,
          total_qr_scanned: progCount || 0,
          total_certificats: Math.floor((progCount || 0) / 5)
        };
      } catch (e) {
        console.info("Supabase stats query notice:", e);
      }
    }

    const localEnfants = getLocalStorageItem<Enfant[]>("enfants", []);
    const localTomes = getLocalStorageItem<Tome[]>("tomes", []);
    const localChapitres = getLocalStorageItem<Chapitre[]>("chapitres", []);
    const localProgs = getLocalStorageItem<Progression[]>("progressions", []);

    return {
      total_parents: Math.max(0, Math.ceil(localEnfants.length / 2)),
      total_enfants: localEnfants.length,
      total_tomes: localTomes.length,
      total_chapitres: localChapitres.length,
      total_qr_scanned: localProgs.length,
      total_certificats: Math.floor(localProgs.length / 5)
    };
  }
}

export const multiTomeService = new MultiTomeService();
