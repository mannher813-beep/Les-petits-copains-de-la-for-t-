import { supabase, isSupabaseConfigured } from "../supabase";
import { Tome, Chapitre, Enfant, Progression, LeaderboardEntry, TrancheAge } from "../types/multiTome";

// NOTE: This service reads and writes exclusively from Supabase.
// There is intentionally no local/sandbox fallback data and no
// localStorage caching — if Supabase is unreachable or a table is
// empty, the corresponding methods return an empty result rather
// than fabricated content. Populate real content via the admin
// panel (which writes straight to Supabase).

// Kept exported (empty) for backward compatibility with any code that
// still imports these names.
export const DEFAULT_TOMES: Tome[] = [];
export const DEFAULT_CHAPITRES: Chapitre[] = [];
export const DEFAULT_ENFANTS: Enfant[] = [];
export const DEFAULT_PROGRESSIONS: Progression[] = [];

// Helper to normalize strings for free-text answers
export function normalizeText(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

function requireSupabase(action: string): boolean {
  if (!isSupabaseConfigured()) {
    console.error(`Supabase is not configured — cannot ${action}. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.`);
    return false;
  }
  return true;
}

// Service implementation — Supabase only
class MultiTomeService {
  // --- TOMES ---
  async getTomes(): Promise<Tome[]> {
    if (!requireSupabase("load tomes")) return [];
    const { data, error } = await supabase.from("tomes").select("*").order("ordre", { ascending: true });
    if (error) {
      console.error("Supabase fetch tomes error", error);
      return [];
    }
    return (data as Tome[]) || [];
  }

  async getTomeBySlug(slug: string): Promise<Tome | null> {
    if (!requireSupabase("load tome")) return null;
    const { data, error } = await supabase.from("tomes").select("*").eq("slug", slug).maybeSingle();
    if (error) {
      console.error("Supabase fetch tome by slug error", error);
      return null;
    }
    return (data as Tome) || null;
  }

  async saveTome(tome: Partial<Tome>): Promise<Tome | null> {
    if (!requireSupabase("save tome")) return null;

    const payload: Partial<Tome> = tome.id
      ? tome
      : {
          slug: tome.slug || `tome-${Date.now()}`,
          titre: tome.titre || "Nouveau Tome",
          couleur_theme: tome.couleur_theme || "#3f9142",
          ordre: tome.ordre ?? 1,
          publie: tome.publie ?? false,
          description: tome.description || ""
        };

    const { data, error } = await supabase.from("tomes").upsert(payload).select().single();
    if (error) {
      console.error("Supabase upsert tome error", error);
      return null;
    }
    return data as Tome;
  }

  async deleteTome(id: string): Promise<boolean> {
    if (!requireSupabase("delete tome")) return false;
    const { error } = await supabase.from("tomes").delete().eq("id", id);
    if (error) {
      console.error("Supabase delete tome error", error);
      return false;
    }
    return true;
  }

  // --- CHAPITRES ---
  async getChapitresByTomeId(tomeId: string): Promise<Chapitre[]> {
    if (!requireSupabase("load chapitres")) return [];
    const { data, error } = await supabase
      .from("chapitres")
      .select("*")
      .eq("tome_id", tomeId)
      .order("numero", { ascending: true });
    if (error) {
      console.error("Supabase fetch chapitres error", error);
      return [];
    }
    return (data as Chapitre[]) || [];
  }

  async getChapitreBySlugs(tomeSlug: string, chapitreSlug: string): Promise<{ tome: Tome; chapitre: Chapitre } | null> {
    const tome = await this.getTomeBySlug(tomeSlug);
    if (!tome) return null;
    const chapitres = await this.getChapitresByTomeId(tome.id);
    const chapitre = chapitres.find((c) => c.slug === chapitreSlug);
    if (!chapitre) return null;
    return { tome, chapitre };
  }

  async saveChapitre(chapitre: Partial<Chapitre>): Promise<Chapitre | null> {
    if (!requireSupabase("save chapitre")) return null;

    const payload: Partial<Chapitre> = chapitre.id
      ? chapitre
      : {
          tome_id: chapitre.tome_id,
          slug: chapitre.slug || `chapitre-${Date.now()}`,
          numero: chapitre.numero ?? 1,
          titre: chapitre.titre || "Nouveau Chapitre",
          couleur: chapitre.couleur || "#3f9142",
          question_defi: chapitre.question_defi || "Quelle est la réponse ?",
          type_reponse: chapitre.type_reponse || "choix_multiple",
          choix: chapitre.choix || [{ label: "Option A", correct: true }],
          reponse_attendue: chapitre.reponse_attendue || "",
          mots_secrets: chapitre.mots_secrets || [],
          points: chapitre.points ?? 10
        };

    const { data, error } = await supabase.from("chapitres").upsert(payload).select().single();
    if (error) {
      console.error("Supabase upsert chapitre error", error);
      return null;
    }
    return data as Chapitre;
  }

  async deleteChapitre(id: string): Promise<boolean> {
    if (!requireSupabase("delete chapitre")) return false;
    const { error } = await supabase.from("chapitres").delete().eq("id", id);
    if (error) {
      console.error("Supabase delete chapitre error", error);
      return false;
    }
    return true;
  }

  // --- ENFANTS (PROFILS) ---
  async getEnfantsByParent(parentId?: string): Promise<Enfant[]> {
    if (!requireSupabase("load enfants")) return [];
    let query = supabase.from("enfants").select("*");
    if (parentId) {
      query = query.eq("parent_id", parentId);
    }
    const { data, error } = await query;
    if (error) {
      console.error("Supabase fetch enfants error", error);
      return [];
    }
    return (data as Enfant[]) || [];
  }

  async getEnfantById(id: string): Promise<Enfant | null> {
    if (!requireSupabase("load enfant")) return null;
    const { data, error } = await supabase.from("enfants").select("*").eq("id", id).maybeSingle();
    if (error) {
      console.error("Supabase fetch enfant by id error", error);
      return null;
    }
    return (data as Enfant) || null;
  }

  async saveEnfant(enfant: Partial<Enfant>): Promise<Enfant | null> {
    if (!requireSupabase("save enfant")) return null;

    const payload: Partial<Enfant> = enfant.id
      ? enfant
      : {
          pseudo: enfant.pseudo || "PetitCopain",
          avatar: enfant.avatar || "leo",
          tranche_age: enfant.tranche_age || "5-6",
          code_livre: enfant.code_livre || "",
          parent_id: enfant.parent_id || undefined
        };

    const { data, error } = await supabase.from("enfants").upsert(payload).select().single();
    if (error) {
      console.error("Supabase upsert enfant error", error);
      return null;
    }
    return data as Enfant;
  }

  // --- PROGRESSIONS & SCORING ---
  async getProgressionsByEnfant(enfantId: string): Promise<Progression[]> {
    if (!requireSupabase("load progressions")) return [];
    const { data, error } = await supabase.from("progressions").select("*").eq("enfant_id", enfantId);
    if (error) {
      console.error("Supabase fetch progressions error", error);
      return [];
    }
    return (data as Progression[]) || [];
  }

  async validerProgression(
    enfantId: string,
    chapitreId: string,
    points: number,
    isFirstAttempt: boolean
  ): Promise<Progression | null> {
    if (!requireSupabase("save progression")) return null;

    const { data: existing, error: fetchError } = await supabase
      .from("progressions")
      .select("*")
      .eq("enfant_id", enfantId)
      .eq("chapitre_id", chapitreId)
      .maybeSingle();

    if (fetchError) {
      console.error("Supabase fetch existing progression error", fetchError);
    }
    if (existing) {
      return existing as Progression; // Already validated
    }

    const pointsGagnes = points + (isFirstAttempt ? 5 : 0); // +5 bonus for 1st attempt

    const { data, error } = await supabase
      .from("progressions")
      .insert({
        enfant_id: enfantId,
        chapitre_id: chapitreId,
        points_gagnes: pointsGagnes,
        premiere_tentative: isFirstAttempt
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase insert progression error", error);
      return null;
    }
    return data as Progression;
  }

  // --- CLASSEMENT (LEADERBOARD) ---
  async getLeaderboard(trancheAge: TrancheAge): Promise<LeaderboardEntry[]> {
    if (!requireSupabase("load leaderboard")) return [];

    const { data: enfants, error: enfantsError } = await supabase
      .from("enfants")
      .select("*")
      .eq("tranche_age", trancheAge);

    if (enfantsError) {
      console.error("Supabase fetch enfants for leaderboard error", enfantsError);
      return [];
    }
    if (!enfants || enfants.length === 0) return [];

    const enfantIds = enfants.map((e: Enfant) => e.id);
    const { data: progressions, error: progError } = await supabase
      .from("progressions")
      .select("*")
      .in("enfant_id", enfantIds);

    if (progError) {
      console.error("Supabase fetch progressions for leaderboard error", progError);
    }

    const entries: LeaderboardEntry[] = (enfants as Enfant[]).map((enfant) => {
      const childProgs = ((progressions as Progression[]) || []).filter((p) => p.enfant_id === enfant.id);
      const total_points = childProgs.reduce((sum, p) => sum + p.points_gagnes, 0);
      return {
        enfant,
        total_points,
        chapitres_valides: childProgs.length,
        rang: 0
      };
    });

    entries.sort((a, b) => b.total_points - a.total_points);
    return entries.map((entry, idx) => ({ ...entry, rang: idx + 1 }));
  }
}

export const multiTomeService = new MultiTomeService();
