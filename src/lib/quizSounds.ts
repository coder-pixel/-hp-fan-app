/**
 * Subtle quiz sound effects using Web Audio API.
 * No external files; low volume and short duration so they are not distracting.
 */

let audioContext: AudioContext | null = null;

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

/** Right answer – soft, pleasant high tone. */
export function playCorrect(): void {
  resumeAudioContext();
  playTone({
    frequency: 523,
    durationMs: 90,
    gain: 0.35,
    type: "sine",
  });
}

/** Wrong answer – soft, brief lower tone. */
export function playWrong(): void {
  resumeAudioContext();
  playTone({
    frequency: 220,
    durationMs: 100,
    gain: 0.3,
    type: "sine",
  });
}

/** Normal timer (40s down to 11s) – subtle tick each second. */
export function playTimerTickSubtle(): void {
  resumeAudioContext();
  playTone({
    frequency: 480,
    durationMs: 40,
    gain: 0.22,
    type: "sine",
  });
}

/** Timer very low (e.g. last 5 seconds) – pulsating emphasis (double tick). */
export function playTimerPulse(): void {
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
    osc.frequency.setValueAtTime(600, now);
    const g = 0.4 * 0.35;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(g, now + 0.03);
    gainNode.gain.linearRampToValueAtTime(0, now + 0.08);
    gainNode.gain.setValueAtTime(0, now + 0.12);
    gainNode.gain.linearRampToValueAtTime(g, now + 0.15);
    gainNode.gain.linearRampToValueAtTime(0, now + 0.22);
    osc.start(now);
    osc.stop(now + 0.25);
  } catch {
    // ignore
  }
}

/** Time's up – soft alert tone. */
export function playTimeout(): void {
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
