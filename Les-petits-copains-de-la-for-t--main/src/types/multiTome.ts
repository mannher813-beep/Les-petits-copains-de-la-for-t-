/**
 * Multi-Tome System Data Types
 */

export interface Tome {
  id: string;
  slug: string;             // ex: "tome-1"
  titre: string;
  couleur_theme: string;    // hex color, ex: "#3f9142"
  ordre: number;
  publie: boolean;
  description?: string;
  cree_le?: string;
}

export interface ChoixQCM {
  label: string;
  correct: boolean;
}

export interface Chapitre {
  id: string;
  tome_id: string;
  slug: string;             // ex: "chapitre-1"
  numero: number;
  titre: string;
  couleur?: string;
  question_defi: string;
  type_reponse: "choix_multiple" | "texte_libre";
  choix?: ChoixQCM[];
  reponse_attendue?: string;
  mots_secrets: string[];
  points: number;
}

export interface Profile {
  id: string;
  email?: string;
  role: "parent" | "admin";
  cree_le?: string;
}

export type TrancheAge = "3-4" | "5-6" | "6-7" | "7-8" | "9-10";

export interface Enfant {
  id: string;
  parent_id?: string;
  pseudo: string;           // Child nickname (never full name)
  avatar: string;           // Avatar identifier key (leo, nina, darina, lana, etc.) — mascotte de secours
  photo?: string;           // Photo personnalisée (data URL compressée), stockée dans children.photo_data_url
  tranche_age: TrancheAge;
  code_livre?: string;
  total_points?: number;
  niveau?: number;
  cree_le?: string;
}

export interface Progression {
  id: string;
  enfant_id: string;
  chapitre_id: string;
  valide_le: string;
  points_gagnes: number;
  premiere_tentative: boolean;
}

export interface LeaderboardEntry {
  enfant: Enfant;
  total_points: number;
  chapitres_valides: number;
  rang: number;
}
