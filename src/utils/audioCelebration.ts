// Web Audio API Synthesizer for rich child-friendly sound effects & ambient background soundscape

class SoundManager {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;
  private bgmOscs: OscillatorNode[] = [];
  private bgmGain: GainNode | null = null;
  public isBGMPlaying: boolean = false;
  private bgmTimer: any = null;

  constructor() {
    try {
      const savedMute = localStorage.getItem("forest_audio_muted");
      if (savedMute !== null) {
        this.isMuted = JSON.parse(savedMute);
      }
    } catch {
      this.isMuted = false;
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    try {
      localStorage.setItem("forest_audio_muted", JSON.stringify(muted));
    } catch {}
    if (muted && this.isBGMPlaying) {
      this.stopAmbientBGM();
    }
  }

  private getContext(): AudioContext | null {
    if (this.isMuted) return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // 1. JOYFUL CORRECT ANSWER CHIME
  public playCorrectAnswer() {
    const ctx = this.getContext();
    if (!ctx) return;

    const notes = [
      { freq: 523.25, time: 0, duration: 0.15 },    // C5
      { freq: 659.25, time: 0.1, duration: 0.15 },   // E5
      { freq: 783.99, time: 0.2, duration: 0.2 },    // G5
      { freq: 1046.50, time: 0.35, duration: 0.4 }   // C6 High Sparkle
    ];

    notes.forEach((note) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(note.freq, ctx.currentTime + note.time);

      gain.gain.setValueAtTime(0, ctx.currentTime + note.time);
      gain.gain.linearRampToValueAtTime(0.35, ctx.currentTime + note.time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + note.time + note.duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + note.time);
      osc.stop(ctx.currentTime + note.time + note.duration);
    });
  }

  // 2. SOFT TRY-AGAIN WRONG ANSWER SOUND
  public playWrongAnswer() {
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(280, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.3);

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.3);
  }

  // 3. NAVIGATION & BUTTON TAP CLICK
  public playTapSound() {
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.06);
  }

  // 4. BRASS / TRUMPET FANFARE
  public playFanfare() {
    const ctx = this.getContext();
    if (!ctx) return;

    const notes = [
      { freq: 523.25, time: 0, duration: 0.15 },    // C5
      { freq: 659.25, time: 0.15, duration: 0.15 }, // E5
      { freq: 783.99, time: 0.30, duration: 0.15 }, // G5
      { freq: 1046.50, time: 0.45, duration: 0.5 }, // C6
    ];

    notes.forEach((note) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(note.freq, ctx.currentTime + note.time);

      gain.gain.setValueAtTime(0, ctx.currentTime + note.time);
      gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + note.time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + note.time + note.duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + note.time);
      osc.stop(ctx.currentTime + note.time + note.duration);
    });
  }

  // 5. CHEERS & APPLAUSE SYNTHESIZER
  public playCheersAndApplause() {
    const ctx = this.getContext();
    if (!ctx) return;

    // Clapping noise
    const bufferSize = ctx.sampleRate * 2.5;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const bandpass = ctx.createBiquadFilter();
    bandpass.type = "bandpass";
    bandpass.frequency.value = 1200;
    bandpass.Q.value = 1.0;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.4);

    noise.connect(bandpass);
    bandpass.connect(gain);
    gain.connect(ctx.destination);

    noise.start(ctx.currentTime);

    // Rising pitch sweeps for "YAY!"
    const cheerPitches = [
      { start: 350, end: 700, delay: 0.1 },
      { start: 450, end: 900, delay: 0.3 },
      { start: 300, end: 650, delay: 0.6 },
    ];

    cheerPitches.forEach((cheer) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(cheer.start, ctx.currentTime + cheer.delay);
      osc.frequency.exponentialRampToValueAtTime(cheer.end, ctx.currentTime + cheer.delay + 0.3);

      oscGain.gain.setValueAtTime(0.01, ctx.currentTime + cheer.delay);
      oscGain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + cheer.delay + 0.1);
      oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + cheer.delay + 0.6);

      osc.connect(oscGain);
      oscGain.connect(ctx.destination);

      osc.start(ctx.currentTime + cheer.delay);
      osc.stop(ctx.currentTime + cheer.delay + 0.6);
    });
  }

  // 6. POP SOUND FOR RANK REVEALS
  public playPopSound(index: number = 0) {
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    const baseFreq = 400 + index * 100;
    osc.type = "sine";
    osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 2, ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.15);
  }

  // 7. AMBIENT BACKGROUND FOREST MUSIC SYNTH (Calm & Soothing)
  public startAmbientBGM() {
    if (this.isBGMPlaying || this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    this.isBGMPlaying = true;
    const notes = [261.63, 329.63, 392.00, 523.25, 440.00, 349.23]; // C4, E4, G4, C5, A4, F4
    let noteIdx = 0;

    const playNextBar = () => {
      if (!this.isBGMPlaying || this.isMuted) return;

      const freq = notes[noteIdx % notes.length];
      noteIdx++;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.8);
      gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 2.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 2.3);

      this.bgmTimer = setTimeout(playNextBar, 2400);
    };

    playNextBar();
  }

  public stopAmbientBGM() {
    this.isBGMPlaying = false;
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  public toggleAmbientBGM() {
    if (this.isBGMPlaying) {
      this.stopAmbientBGM();
    } else {
      this.startAmbientBGM();
    }
  }
}

export const soundManager = new SoundManager();
