/** Tiny synthesized sound effects via WebAudio — no audio files needed. */

let ctx: AudioContext | null = null;
let mutedFlag: boolean | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    try {
      ctx = new AudioContext();
    } catch {
      return null;
    }
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

export function isMuted(): boolean {
  if (mutedFlag === null) {
    try {
      mutedFlag = localStorage.getItem("atlas-muted") === "1";
    } catch {
      mutedFlag = false;
    }
  }
  return mutedFlag;
}

export function setMuted(m: boolean) {
  mutedFlag = m;
  try {
    localStorage.setItem("atlas-muted", m ? "1" : "0");
  } catch {
    // ignore
  }
}

function tone(
  freq: number,
  startIn: number,
  duration: number,
  type: OscillatorType = "sine",
  peak = 0.12
) {
  const audio = getCtx();
  if (!audio || isMuted()) return;

  const osc = audio.createOscillator();
  const gain = audio.createGain();
  const t0 = audio.currentTime + startIn;

  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  gain.gain.setValueAtTime(0, t0);
  gain.gain.linearRampToValueAtTime(peak, t0 + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.001, t0 + duration);

  osc.connect(gain).connect(audio.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.05);
}

/** Soft tap when opening an exhibit */
export function playPop() {
  tone(440, 0, 0.09, "triangle", 0.08);
  tone(660, 0.03, 0.08, "triangle", 0.06);
}

/** Little rising arpeggio when a wonder is discovered */
export function playDiscover() {
  tone(523.25, 0, 0.15, "sine");      // C5
  tone(659.25, 0.1, 0.15, "sine");    // E5
  tone(783.99, 0.2, 0.18, "sine");    // G5
  tone(1046.5, 0.3, 0.35, "sine");    // C6
}

/** Happy chime when a match is made in the matching game */
export function playMatch() {
  tone(659.25, 0, 0.12, "sine");     // E5
  tone(783.99, 0.09, 0.12, "sine");  // G5
  tone(1046.5, 0.18, 0.25, "sine");  // C6
}

/** Soft, kind "not quite" — two gentle low tones, never harsh */
export function playOops() {
  tone(392.0, 0, 0.15, "sine", 0.06);   // G4
  tone(329.63, 0.14, 0.22, "sine", 0.05); // E4
}

/** Shared AudioContext for other audio modules (music) */
export function getAudioCtx() {
  return getCtx();
}

/** Extra shimmer for today's mystery */
export function playMystery() {
  playDiscover();
  tone(1318.5, 0.45, 0.3, "sine", 0.09);  // E6
  tone(1568.0, 0.55, 0.4, "sine", 0.08);  // G6
}
