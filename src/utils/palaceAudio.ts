// Procedural Web Audio API sound generator for Clozapine Mind Palace
// Uses pure browser oscillator nodes and biquad filters—zero external mp3 assets needed.

export class PalaceAudioEngine {
  private ctx: AudioContext | null = null;
  private ambientGain: GainNode | null = null;
  private ambientOsc1: OscillatorNode | null = null;
  private ambientOsc2: OscillatorNode | null = null;
  private isMuted: boolean = false;
  private isAmbientPlaying: boolean = false;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setTargetAtTime(this.isMuted ? 0 : 0.04, this.ctx.currentTime, 0.2);
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public toggleAmbient(): boolean {
    this.initCtx();
    if (!this.ctx) return false;

    if (this.isAmbientPlaying) {
      if (this.ambientGain) {
        this.ambientGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.5);
      }
      setTimeout(() => {
        this.ambientOsc1?.stop();
        this.ambientOsc2?.stop();
        this.ambientOsc1?.disconnect();
        this.ambientOsc2?.disconnect();
        this.ambientOsc1 = null;
        this.ambientOsc2 = null;
        this.isAmbientPlaying = false;
      }, 600);
      return false;
    } else {
      try {
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        // 108Hz / 216Hz grounding acoustic drone
        osc1.type = "sine";
        osc1.frequency.setValueAtTime(108, this.ctx.currentTime);
        osc2.type = "triangle";
        osc2.frequency.setValueAtTime(162, this.ctx.currentTime); // Perfect fifth harmonic

        filter.type = "lowpass";
        filter.frequency.setValueAtTime(320, this.ctx.currentTime);
        filter.Q.setValueAtTime(2.0, this.ctx.currentTime);

        gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(this.isMuted ? 0.0001 : 0.04, this.ctx.currentTime + 1.5);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc1.start();
        osc2.start();

        this.ambientOsc1 = osc1;
        this.ambientOsc2 = osc2;
        this.ambientGain = gain;
        this.isAmbientPlaying = true;
        return true;
      } catch (e) {
        console.warn("Audio Context blocked until user interaction", e);
        return false;
      }
    }
  }

  public playDoorOpen() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Resonant deep wooden/bronze door echo
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = "sine";
      osc.frequency.setValueAtTime(80, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.6);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(280, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.65);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.7);
    } catch {
      // Ignore audio interruption
    }
  }

  public playDoorChime() {
    this.playDoorOpen();
  }

  public playLocusInspect() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Crystalline mnemonic discovery chime (chimes at 528Hz and 1056Hz)
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = "sine";
      osc1.frequency.setValueAtTime(528, now);
      osc1.frequency.exponentialRampToValueAtTime(660, now + 0.35);

      osc2.type = "sine";
      osc2.frequency.setValueAtTime(1056, now);
      osc2.frequency.exponentialRampToValueAtTime(1320, now + 0.35);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.75);
      osc2.stop(now + 0.75);
    } catch {
      // Ignore
    }
  }

  public playFootstep() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.1);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(400, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.03, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.16);
    } catch {}
  }

  public playVoiceListenChime() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.26);
    } catch {}
  }

  public playVoiceSuccessChime() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.setValueAtTime(880, now + 0.1); // A5
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.06, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.36);
    } catch {}
  }

  // =========================================================================
  // SPEECH SYNTHESIS NARRATION ENGINE
  // =========================================================================
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private _isVoiceSpeaking: boolean = false;

  public cleanTextForSpeech(rawText: string): string {
    return rawText
      // Remove markdown links, symbols, headers, asterisks, bullet points
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/[#*`_~]/g, "")
      .replace(/•|\*/g, "")
      // Convert medical symbols & abbreviations for fluid oral delivery
      .replace(/\bANC\b/g, "A-N-C")
      .replace(/\bTRS\b/g, "treatment resistant schizophrenia")
      .replace(/\bCYP1A2\b/g, "C-Y-P one A two")
      .replace(/\bCYP2D6\b/g, "C-Y-P two D six")
      .replace(/\bCYP3A4\b/g, "C-Y-P three A four")
      .replace(/\b5-HT2A\b/g, "5-H-T two A")
      .replace(/\b5-HT1A\b/g, "5-H-T one A")
      .replace(/\bD2\b/g, "D two")
      .replace(/\bD4\b/g, "D four")
      .replace(/\bM1\b/g, "M one")
      .replace(/\bH1\b/g, "H one")
      .replace(/\bng\/mL\b/g, "nanograms per milliliter")
      .replace(/\bmg\/day\b/g, "milligrams per day")
      .replace(/\b\/µL\b/g, "per microliter")
      .replace(/<|&lt;/g, "less than ")
      .replace(/>|&gt;/g, "greater than ")
      .replace(/≤/g, "less than or equal to ")
      .replace(/≥/g, "greater than or equal to ")
      .replace(/\s+/g, " ")
      .trim();
  }

  public speak(
    text: string,
    options?: {
      onStart?: () => void;
      onEnd?: () => void;
      onError?: () => void;
      rate?: number;
      pitch?: number;
    }
  ) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    this.stopSpeaking();

    const clean = this.cleanTextForSpeech(text);
    if (!clean) return;

    try {
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.rate = options?.rate ?? 1.0;
      utterance.pitch = options?.pitch ?? 0.98;

      // Select high quality natural voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(
        (v) =>
          (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("Samantha") || v.name.includes("Daniel")) &&
          v.lang.startsWith("en")
      ) || voices.find((v) => v.lang.startsWith("en"));

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onstart = () => {
        this._isVoiceSpeaking = true;
        options?.onStart?.();
      };

      utterance.onend = () => {
        this._isVoiceSpeaking = false;
        this.currentUtterance = null;
        options?.onEnd?.();
      };

      utterance.onerror = () => {
        this._isVoiceSpeaking = false;
        this.currentUtterance = null;
        options?.onError?.();
      };

      this.currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    } catch {
      this._isVoiceSpeaking = false;
    }
  }

  public stopSpeaking() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    this._isVoiceSpeaking = false;
    this.currentUtterance = null;
  }

  public isVoiceSpeaking(): boolean {
    return this._isVoiceSpeaking || (typeof window !== "undefined" && window.speechSynthesis?.speaking);
  }
}

export const palaceAudio = new PalaceAudioEngine();
