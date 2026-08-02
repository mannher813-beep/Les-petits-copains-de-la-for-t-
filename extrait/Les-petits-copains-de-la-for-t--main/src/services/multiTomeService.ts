// Multi-Tome Service with direct Supabase persistence and authentic data querying
//
// IMPORTANT : ce service est une couche d'ADAPTATION.
// Les types applicatifs (Tome, Chapitre, Enfant, Progression) restent inchangés
// pour ne rien casser dans les composants qui les consomment, mais ils sont
// maintenant mappés vers les VRAIES tables du projet Supabase "Les Copains de
// la Forêt" (hofmvbsnisuhzytpgqol) : books, chapters, children, chapter_progress.
import { supabase, isSupabaseConfigured, ensureSession, getCurrentUserId } from "../lib/supabase";
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
    photo: row.photo_data_url || undefined,
    tranche_age: (row.age_band || "5-6") as TrancheAge,
    code_livre: row.code_livre || undefined,
    total_points: row.total_points ?? undefined,
    niveau: row.niveau ?? undefined,
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
    premiere_tentative: row.first_attempt,
    temps_reponse_ms: row.response_time_ms ?? undefined
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
  // Toute lecture/écriture passe par la session Supabase courante : la RLS de
  // "children" filtre déjà sur profile_id = auth.uid(), donc parentId n'a plus
  // besoin d'être passé manuellement — il est dérivé de la session active.
  async getEnfantsByParent(): Promise<Enfant[]> {
    if (!isSupabaseConfigured() || !supabase) {
      console.warn("Supabase non configuré (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY manquants).");
      return [];
    }
    await ensureSession();
    const { data, error } = await supabase
      .from("children")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Erreur lecture des profils enfants:", error.message);
      return [];
    }
    return (data || []).map(rowToEnfant);
  }

  async getEnfantById(id: string): Promise<Enfant | null> {
    if (!isSupabaseConfigured() || !supabase) return null;
    await ensureSession();
    const { data, error } = await supabase.from("children").select("*").eq("id", id).maybeSingle();
    if (error) {
      console.error("Erreur lecture du profil enfant:", error.message);
      return null;
    }
    return data ? rowToEnfant(data) : null;
  }

  async saveEnfant(enfant: Partial<Enfant>): Promise<Enfant | null> {
    if (!isSupabaseConfigured() || !supabase) {
      console.error("Supabase non configuré : impossible d'enregistrer le profil enfant.");
      return null;
    }

    const userId = await ensureSession();
    if (!userId) {
      console.error(
        "Aucune session Supabase active — vérifie que les connexions anonymes sont activées " +
        "(Dashboard > Authentication > Sign In / Providers > Anonymous)."
      );
      return null;
    }

    const payload: any = {
      profile_id: userId,
      pseudo: enfant.pseudo || "PetitCopain",
      name: enfant.pseudo || "PetitCopain",
      avatar_id: AVATAR_NAME_TO_ID[enfant.avatar || "leo"] || 1,
      age_band: enfant.tranche_age || "5-6",
      photo_data_url: enfant.photo ?? null
    };
    // Un id venant de la vraie table children est un uuid ; sinon on laisse Postgres le générer.
    if (enfant.id && /^[0-9a-f-]{8}-[0-9a-f-]{4}-[0-9a-f-]{4}-[0-9a-f-]{4}-[0-9a-f-]{12}$/i.test(enfant.id)) {
      payload.id = enfant.id;
    }

    const { data, error } = await supabase.from("children").upsert(payload).select().single();
    if (error) {
      console.error("Erreur enregistrement du profil enfant (Supabase):", error.message);
      return null;
    }
    return rowToEnfant(data);
  }

  // --- PROGRESSIONS (table réelle: chapter_progress) ---
  async getProgressionsByEnfant(enfantId: string): Promise<Progression[]> {
    if (!isSupabaseConfigured() || !supabase) return [];
    await ensureSession();
    const { data, error } = await supabase.from("chapter_progress").select("*").eq("child_id", enfantId);
    if (error) {
      console.error("Erreur lecture progression:", error.message);
      return [];
    }
    return (data || []).map(rowToProgression);
  }

  async validerProgression(
    enfantId: string,
    chapitreId: string,
    points: number,
    isFirstAttempt: boolean,
    responseTimeMs?: number
  ): Promise<Progression | null> {
    if (!isSupabaseConfigured() || !supabase) return null;
    if (Number.isNaN(Number(chapitreId))) {
      console.error(`chapitreId "${chapitreId}" n'est pas un id réel de la table "chapters" — progression non enregistrée.`);
      return null;
    }
    await ensureSession();

    const pointsGagnes = points + (isFirstAttempt ? 5 : 0);

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
        first_attempt: isFirstAttempt,
        response_time_ms: typeof responseTimeMs === "number" && Number.isFinite(responseTimeMs)
          ? Math.round(responseTimeMs)
          : null
      })
      .select()
      .single();
    if (error) {
      console.error("Erreur enregistrement progression (Supabase):", error.message);
      return null;
    }
    return rowToProgression(data);
  }

  // --- CLASSEMENT (LEADERBOARD) ---
  // Utilise la fonction RPC dédiée get_leaderboard(p_age_band), qui tourne en
  // SECURITY DEFINER côté base : elle seule peut agréger les points de TOUS
  // les enfants (la RLS de "children" limite sinon chaque parent à ses propres
  // enfants, ce qui rendait le classement global impossible à calculer côté front).
  async getLeaderboard(trancheAge: TrancheAge | "toutes"): Promise<LeaderboardEntry[]> {
    if (!isSupabaseConfigured() || !supabase) return [];
    await ensureSession();

    const { data, error } = await supabase.rpc("get_leaderboard", {
      p_age_band: trancheAge && trancheAge !== "toutes" ? trancheAge : null
    });
    if (error) {
      console.error("Erreur lecture classement (RPC get_leaderboard):", error.message);
      return [];
    }

    return (data || []).map((row: any, idx: number) => ({
      enfant: {
        id: row.child_id,
        pseudo: row.pseudo,
        avatar: AVATAR_ID_TO_NAME[row.avatar_id] || "leo",
        photo: row.photo_data_url || undefined,
        tranche_age: row.age_band as TrancheAge
      },
      total_points: Number(row.total_points) || 0,
      chapitres_valides: Number(row.chapitres_valides) || 0,
      rang: idx + 1
    }));
  }

  // --- CLASSEMENT VITESSE (temps moyen de réponse, le plus rapide en tête) ---
  // Utilise get_leaderboard_vitesse (RPC dédiée, même principe que get_leaderboard) :
  // ne classe que les enfants ayant au moins un défi chronométré.
  async getLeaderboardVitesse(trancheAge: TrancheAge | "toutes"): Promise<LeaderboardEntry[]> {
    if (!isSupabaseConfigured() || !supabase) return [];
    await ensureSession();

    const { data, error } = await supabase.rpc("get_leaderboard_vitesse", {
      p_age_band: trancheAge && trancheAge !== "toutes" ? trancheAge : null
    });
    if (error) {
      console.error("Erreur lecture classement vitesse (RPC get_leaderboard_vitesse):", error.message);
      return [];
    }

    return (data || []).map((row: any, idx: number) => ({
      enfant: {
        id: row.child_id,
        pseudo: row.pseudo,
        avatar: AVATAR_ID_TO_NAME[row.avatar_id] || "leo",
        photo: row.photo_data_url || undefined,
        tranche_age: row.age_band as TrancheAge
      },
      total_points: Number(row.total_points) || 0,
      chapitres_valides: Number(row.chapitres_valides) || 0,
      chapitres_chronometres: Number(row.chapitres_chronometres) || 0,
      temps_moyen_ms: row.temps_moyen_ms != null ? Number(row.temps_moyen_ms) : undefined,
      rang: idx + 1
    }));
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
    const isInternalAppUrl = raw.includes("/defi/") || raw.includes("/verification/") || raw.includes("ais-dev") || raw.includes("ais-pre") || raw.includes("localhost");

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

    // 1. Vrai QR imprimé : le jeton scanné correspond à un token réel de la
    // table "qr_codes". C'est le chemin normal en production — on utilise la
    // RPC get_defi_by_token, qui seule sait faire la jointure qr_codes -> chapters -> books.
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data: rpcData, error: rpcError } = await supabase.rpc("get_defi_by_token", { p_token: raw });
        if (!rpcError && rpcData && rpcData.length > 0) {
          const row = rpcData[0];
          const { data: bookRow } = await supabase
            .from("chapters")
            .select("slug, chapter_num, books(slug)")
            .eq("id", row.chapter_id)
            .maybeSingle();
          return {
            tome_slug: (bookRow as any)?.books?.slug || "tome-1",
            chapitre_slug: bookRow?.slug || `chapitre-${bookRow?.chapter_num || 1}`,
            chapitre_num: bookRow?.chapter_num || 1,
            question_defi: row.defi_question_fr,
            type_reponse: row.defi_type === "texte_libre" ? "texte_libre" : "choix_multiple",
            choix: row.defi_choices || [],
            mots_secrets: row.defi_mots_secrets || []
          };
        }
      } catch (e) {
        console.info("Supabase RPC get_defi_by_token notice:", e);
      }
    }

    // 2. Code saisi à la main (pas un vrai scan QR) : recherche directe dans "chapters".
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
  // get_admin_stats() est une RPC SECURITY DEFINER qui vérifie elle-même
  // is_admin() côté base (JWT app_metadata.role = 'admin') et renvoie une
  // erreur pour tout autre appelant : les stats réelles ne sont donc
  // accessibles qu'à un compte réellement promu admin dans Supabase Auth,
  // jamais à un simple état local "isAdminLoggedIn" côté front.
  async getAdminStats(): Promise<{
    total_parents: number;
    total_enfants: number;
    total_tomes: number;
    total_chapitres: number;
    total_qr_scanned: number;
    total_certificats: number;
  } | null> {
    if (!isSupabaseConfigured() || !supabase) return null;
    await ensureSession();

    const { data, error } = await supabase.rpc("get_admin_stats");
    if (error) {
      console.error(
        "Erreur RPC get_admin_stats — probablement un compte non-admin (voir is_admin() côté Supabase) :",
        error.message
      );
      return null;
    }

    const c = data?.comptages || {};
    return {
      total_parents: c.parents || 0,
      total_enfants: c.enfants || 0,
      total_tomes: c.tomes || 0,
      total_chapitres: c.chapitres || 0,
      total_qr_scanned: c.validations_totales || 0,
      total_certificats: c.diplomes || 0
    };
  }
}

export const multiTomeService = new MultiTomeService();
