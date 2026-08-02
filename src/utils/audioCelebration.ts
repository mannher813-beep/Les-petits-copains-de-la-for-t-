// Gestionnaire de sons unifié — joue les vrais effets sonores livrés
// (public/sounds/*.mp3) au lieu de synthétiser des tonalités approximatives
// à la volée. Le fond sonore en boucle a été entièrement retiré : il ne
// s'agissait que d'une note isolée rejouée toutes les 2,4s (aucune vraie
// musique), jugé de mauvaise qualité — en attendant une vraie bande sonore
// composée séparément.

const SOUND_FILES = {
  correct: "/sounds/ding_bonne_reponse.mp3",
  wrong: "/sounds/erreur_douce.mp3",
  tap: "/sounds/bouton_pop.mp3",
  badge: "/sounds/badge_debloque.mp3",
  diplome: "/sounds/diplome_victoire.mp3",
  sticker: "/sounds/autocollant_pose.mp3"
} as const;

class SoundManager {
  public isMuted: boolean = false;
  private volume: number = 0.8; // Default 80%
  // Un pool de lecteurs par son permet de rejouer un même effet très
  // rapidement (plusieurs bonnes réponses d'affilée, etc.) sans qu'un appel
  // coupe le précédent.
  private pools: Partial<Record<keyof typeof SOUND_FILES, HTMLAudioElement[]>> = {};

  constructor() {
    try {
      const savedMute = localStorage.getItem("forest_audio_muted");
      if (savedMute !== null) {
        this.isMuted = JSON.parse(savedMute);
      }
      const savedVol = localStorage.getItem("forest_audio_volume");
      if (savedVol !== null) {
        this.volume = Math.max(0, Math.min(1, parseFloat(savedVol)));
      }
    } catch {
      this.isMuted = false;
      this.volume = 0.8;
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    try {
      localStorage.setItem("forest_audio_muted", JSON.stringify(muted));
    } catch {}
  }

  public setVolume(vol: number) {
    const clamped = Math.max(0, Math.min(1, vol));
    this.volume = clamped;
    try {
      localStorage.setItem("forest_audio_volume", JSON.stringify(clamped));
    } catch {}

    if (clamped === 0) {
      this.setMuted(true);
    } else if (this.isMuted) {
      this.isMuted = false;
      try {
        localStorage.setItem("forest_audio_muted", "false");
      } catch {}
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  private play(key: keyof typeof SOUND_FILES, playbackRate: number = 1) {
    if (this.isMuted || this.volume <= 0) return;
    try {
      let pool = this.pools[key];
      if (!pool) {
        pool = [];
        this.pools[key] = pool;
      }
      // Réutilise un lecteur déjà terminé s'il y en a un, sinon en crée un.
      let audio = pool.find((a) => a.ended || a.paused);
      if (!audio) {
        audio = new Audio(SOUND_FILES[key]);
        pool.push(audio);
      }
      audio.currentTime = 0;
      audio.playbackRate = playbackRate;
      audio.volume = Math.max(0, Math.min(1, this.volume));
      void audio.play().catch(() => {
        // Lecture bloquée (pas encore d'interaction utilisateur) — sans
        // conséquence, l'effet suivant retentera normalement.
      });
    } catch {
      // best-effort uniquement
    }
  }

  /** Bonne réponse à un défi ou scan QR valide. */
  public playCorrectAnswer() {
    this.play("correct");
  }

  /** Mauvaise réponse — son doux et jamais négatif. */
  public playWrongAnswer() {
    this.play("wrong");
  }

  /** Clic / tap générique sur un bouton. */
  public playTapSound() {
    this.play("tap");
  }

  /** Badge débloqué, fin de chapitre, ou petite fanfare de célébration. */
  public playFanfare() {
    this.play("badge");
  }

  /** Alias conservé pour compatibilité — désormais identique à playFanfare
   * (il n'y a plus de son distinct d'applaudissements synthétisés). */
  public playCheersAndApplause() {
    // Volontairement silencieux : évite de superposer deux fois le même son
    // quand playFanfare() est déjà appelé au même moment ailleurs.
  }

  /** Petit "pop" pour les révélations de classement, légèrement plus aigu à
   * chaque rang pour varier. */
  public playPopSound(index: number = 0) {
    this.play("tap", 1 + Math.min(index, 4) * 0.06);
  }

  /** Mélodie de victoire chaleureuse à l'obtention du diplôme. */
  public playDiplomeVictoire() {
    this.play("diplome");
  }

  /** Petit son doux quand un autocollant est posé. */
  public playStickerPlaced() {
    this.play("sticker");
  }
}

export const soundManager = new SoundManager();
