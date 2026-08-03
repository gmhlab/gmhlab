/**
 * The sound of the system: each intent is a degree on a major-pentatonic
 * scale, prominence softens the velocity. Entirely opt-in — nothing plays
 * until the user flips the toggle (which is also the user gesture that
 * lets us create the AudioContext).
 */

const SCALE_SEMITONES = [0, 2, 4, 7, 9, 12, 14, 16, 19];
const BASE_FREQ = 392; // G4

class Chime {
  enabled = false;
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private lastPluckAt = 0;

  setEnabled(on: boolean) {
    this.enabled = on;
    if (on) this.ensure();
  }

  private ensure(): AudioContext | null {
    if (!this.ctx) {
      const Ctor = window.AudioContext;
      if (!Ctor) return null;
      this.ctx = new Ctor();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.14;
      this.master.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") void this.ctx.resume();
    return this.ctx;
  }

  /** Short pluck. `degree` indexes the scale; `depth` (0–2) softens it. */
  pluck(degree: number, depth = 0) {
    if (!this.enabled) return;
    const now = performance.now();
    if (now - this.lastPluckAt < 55) return; // don't machine-gun on fast hovers
    this.lastPluckAt = now;
    this.note(degree, 0, 0.5 * (1 - depth * 0.22), 0.22);
  }

  /** Root + fifth — the "copied" confirmation. */
  confirm(degree = 0) {
    if (!this.enabled) return;
    this.note(degree, 0, 0.45, 0.18);
    this.note(degree + 3, 0.09, 0.35, 0.28);
  }

  private note(degree: number, delay: number, gain: number, decay: number) {
    const ctx = this.ensure();
    if (!ctx || !this.master) return;
    const semis = SCALE_SEMITONES[Math.abs(degree) % SCALE_SEMITONES.length];
    const freq = BASE_FREQ * 2 ** (semis / 12);
    const t = ctx.currentTime + delay;

    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.value = freq;
    const shimmer = ctx.createOscillator();
    shimmer.type = "sine";
    shimmer.frequency.value = freq * 2;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 2200;

    const env = ctx.createGain();
    env.gain.setValueAtTime(0, t);
    env.gain.linearRampToValueAtTime(gain, t + 0.008);
    env.gain.exponentialRampToValueAtTime(0.0001, t + decay);

    const shimmerGain = ctx.createGain();
    shimmerGain.gain.value = 0.18;

    osc.connect(filter);
    shimmer.connect(shimmerGain);
    shimmerGain.connect(filter);
    filter.connect(env);
    env.connect(this.master);

    osc.start(t);
    shimmer.start(t);
    osc.stop(t + decay + 0.05);
    shimmer.stop(t + decay + 0.05);
  }
}

export const chime = new Chime();
