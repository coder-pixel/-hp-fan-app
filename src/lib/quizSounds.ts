/**
 * Subtle quiz sound effects using Web Audio API.
 * No external files; low volume and short duration so they are not distracting.
 */

let audioContext: AudioContext | null = null;
let quizSoundsEnabled = true;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  return audioContext;
}

/** Play a short tone. */
function playTone(options: {
  frequency: number;
  durationMs: number;
  gain: number;
  type?: OscillatorType;
  fadeOut?: boolean;
}): void {
  const ctx = getContext();
  if (!ctx) return;

  const {
    frequency,
    durationMs,
    gain,
    type = "sine",
    fadeOut = true,
  } = options;

  try {
    const now = ctx.currentTime;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, now);
    gainNode.gain.setValueAtTime(gain * 0.25, now); // keep overall volume low

    if (fadeOut) {
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + durationMs / 1000);
    }
    oscillator.start(now);
    oscillator.stop(now + durationMs / 1000);
  } catch {
    // ignore if audio fails (e.g. autoplay policy)
  }
}

/** Resume context on first user interaction (helps with autoplay policy). */
export function resumeAudioContext(): void {
  const ctx = getContext();
  if (ctx?.state === "suspended") {
    ctx.resume();
  }
}

/** Global runtime toggle for all quiz sound effects. */
export function setQuizSoundsEnabled(enabled: boolean): void {
  quizSoundsEnabled = enabled;
  const ctx = getContext();
  if (!ctx) return;
  if (!enabled && ctx.state === "running") {
    // Best-effort suspend to respect user mute.
    ctx.suspend().catch(() => undefined);
  }
}

/**
 * Right answer – "magical glint"
 * Quick 3-note arpeggio with slightly detuned overtones.
 */
export function playCorrect(): void {
  if (!quizSoundsEnabled) return;
  resumeAudioContext();
  const baseGain = 0.38;
  const notes = [
    // A gentle, bright arpeggio (E5, B5, E6-ish)
    { f: 659.25, t: 0, type: "triangle" as OscillatorType }, // E5
    { f: 987.77, t: 0.045, type: "sine" as OscillatorType }, // B5
    { f: 1318.51, t: 0.09, type: "triangle" as OscillatorType }, // E6
  ];

  const ctx = getContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  for (const n of notes) {
    const startAt = now + n.t;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = n.type;
    osc2.type = "sine";
    osc1.frequency.setValueAtTime(n.f, startAt);
    osc2.frequency.setValueAtTime(n.f * 2, startAt); // a light harmonic "sparkle"
    osc2.detune.setValueAtTime(-8, startAt);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Short shimmer envelope
    const g = baseGain * 0.25;
    gainNode.gain.setValueAtTime(0.0008, startAt);
    gainNode.gain.exponentialRampToValueAtTime(g, startAt + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startAt + 0.08);

    osc1.start(startAt);
    osc2.start(startAt);
    osc1.stop(startAt + 0.09);
    osc2.stop(startAt + 0.09);
  }
}

/**
 * Wrong answer – "soft magical thud"
 * Downward shimmer using a brief descending sweep and low gain.
 */
export function playWrong(): void {
  if (!quizSoundsEnabled) return;
  resumeAudioContext();
  const ctx = getContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gainNode = ctx.createGain();
  osc.connect(gainNode);
  osc2.connect(gainNode);
  gainNode.connect(ctx.destination);

  osc.type = "triangle";
  osc2.type = "sine";

  // Descending sweep (gentle, not jarring)
  osc.frequency.setValueAtTime(440, now);
  osc.frequency.linearRampToValueAtTime(220, now + 0.08);
  osc2.frequency.setValueAtTime(660, now);
  osc2.frequency.linearRampToValueAtTime(330, now + 0.08);
  osc2.detune.setValueAtTime(-12, now);

  const g = 0.32 * 0.25;
  gainNode.gain.setValueAtTime(0.0008, now);
  gainNode.gain.exponentialRampToValueAtTime(g, now + 0.012);
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.11);

  osc.start(now);
  osc2.start(now);
  osc.stop(now + 0.12);
  osc2.stop(now + 0.12);
}

/** Single clock-style tick: short, sharp transient. */
function playClockTick(options: { gain?: number; atTime?: number } = {}): void {
  if (!quizSoundsEnabled) return;
  const ctx = getContext();
  if (!ctx) return;
  const { gain = 0.35, atTime = ctx.currentTime } = options;
  try {
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(1200, atTime);
    const g = gain * 0.3;
    gainNode.gain.setValueAtTime(0, atTime);
    gainNode.gain.linearRampToValueAtTime(g, atTime + 0.002);
    gainNode.gain.exponentialRampToValueAtTime(0.001, atTime + 0.018);
    osc.start(atTime);
    osc.stop(atTime + 0.02);
  } catch {
    // ignore
  }
}

/** Normal timer (40s down to 11s) – clock tick each second. */
export function playTimerTickSubtle(): void {
  if (!quizSoundsEnabled) return;
  resumeAudioContext();
  playClockTick({ gain: 0.28 });
}

/** Timer very low (e.g. last 5 seconds) – double clock tick for emphasis. */
export function playTimerPulse(): void {
  if (!quizSoundsEnabled) return;
  resumeAudioContext();
  const ctx = getContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  playClockTick({ gain: 0.4, atTime: now });
  playClockTick({ gain: 0.4, atTime: now + 0.12 });
}

/** Time's up – soft alert tone. */
export function playTimeout(): void {
  if (!quizSoundsEnabled) return;
  resumeAudioContext();
  const ctx = getContext();
  if (!ctx) return;
  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.setValueAtTime(360, now + 0.06);
    gainNode.gain.setValueAtTime(0.2 * 0.25, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc.start(now);
    osc.stop(now + 0.12);
  } catch {
    // ignore
  }
}
