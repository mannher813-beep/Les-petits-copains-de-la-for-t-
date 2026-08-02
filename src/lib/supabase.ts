import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

let supabaseInstance: SupabaseClient | null = null;

if (supabaseUrl && supabaseAnonKey) {
  try {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  } catch (err) {
    console.warn("Erreur d'initialisation de Supabase client:", err);
  }
}

export const supabase = supabaseInstance;

export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey && supabaseInstance);
}

// Toutes les policies RLS (children, chapter_progress, child_badges, diplomes...)
// exigent profile_id = auth.uid(). Sans session, l'app est un utilisateur "anon"
// pour qui auth.uid() est NULL : chaque lecture/écriture est alors silencieusement
// bloquée par la RLS. On ouvre donc systématiquement une session anonyme Supabase
// (persistée par le SDK dans le storage du navigateur, donc stable entre visites
// sur le même appareil) avant toute opération sur les données enfant.
//
// ⚠️ Nécessite que "Allow anonymous sign-ins" soit activé dans
// Dashboard Supabase > Authentication > Sign In / Providers > Anonymous.
let ensureSessionPromise: Promise<string | null> | null = null;

export function ensureSession(): Promise<string | null> {
  if (!supabase) return Promise.resolve(null);
  if (!ensureSessionPromise) {
    ensureSessionPromise = (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data?.session?.user?.id) return data.session.user.id;

        const { data: signData, error } = await supabase.auth.signInAnonymously();
        if (error) {
          console.warn(
            "Impossible d'ouvrir une session anonyme Supabase. " +
            "Vérifie que 'Allow anonymous sign-ins' est activé dans le dashboard Supabase.",
            error
          );
          ensureSessionPromise = null;
          return null;
        }
        return signData.session?.user?.id ?? null;
      } catch (err) {
        console.warn("Supabase auth non disponible (mode hors-ligne):", err);
        ensureSessionPromise = null;
        return null;
      }
    })();
  }
  return ensureSessionPromise;
}

export async function getCurrentUserId(): Promise<string | null> {
  if (!supabase) return null;
  try {
    const { data } = await supabase.auth.getSession();
    return data.session?.user?.id ?? (await ensureSession());
  } catch (err) {
    console.warn("Erreur lecture utilisateur courant:", err);
    return null;
  }
}
