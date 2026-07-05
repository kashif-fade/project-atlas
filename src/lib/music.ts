/**
 * Gentle generative ambient music — soft pentatonic notes over a quiet
 * drone, synthesized with WebAudio. No files, tiny CPU, deliberately calm.
 */
import { getAudioCtx } from "./sound";

let playing = false;
let noteTimer: ReturnType<typeof setTimeout> | null = null;
let droneNodes: { osc: OscillatorNode; gain: GainNode }[] = [];
let musicFlag: boolean | null = null;

// C major pentatonic — every combination sounds pleasant
const SCALE = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25];

export function isMusicOn(): boolean {
  if (musicFlag === null) {
    try {
      musicFlag = localStorage.getItem("atlas-music") !== "0"; // default ON
    } catch {
      musicFlag = true;
    }
  }
  return musicFlag;
}

export function setMusicOn(on: boolean) {
  musicFlag = on;
  try {
    localStorage.setItem("atlas-music", on ? "1" : "0");
  } catch {
    // ignore
  }
  if (on) startMusic();
  else stopMusic();
}

function softNote(freq: number, duration: number, peak: number) {
  const ctx = getAudioCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const t0 = ctx.currentTime;

  osc.type = "sine";
  osc.frequency.setValueAtTime(freq, t0);
  gain.gain.setValueAtTime(0, t0);
  gain.gain.linearRampToValueAtTime(peak, t0 + 0.9); // slow bloom
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);

  osc.connect(gain).connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.1);
}

function loop() {
  if (!playing) return;
  const base = SCALE[Math.floor(Math.random() * SCALE.length)];
  const freq = Math.random() < 0.25 ? base * 2 : base;
  softNote(freq, 4, 0.028);
  if (Math.random() < 0.35) softNote(freq * 1.5, 3.2, 0.014); // gentle fifth
  noteTimer = setTimeout(loop, 2200 + Math.random() * 2600);
}

export function startMusic() {
  if (playing) return;
  const ctx = getAudioCtx();
  if (!ctx) return;
  playing = true;

  // very quiet two-note drone (C3 + G3)
  droneNodes = [130.81, 196.0].map((f) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(f, ctx.currentTime);
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.011, ctx.currentTime + 3);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    return { osc, gain };
  });

  loop();
}

export function stopMusic() {
  playing = false;
  if (noteTimer) {
    clearTimeout(noteTimer);
    noteTimer = null;
  }
  const ctx = getAudioCtx();
  for (const { osc, gain } of droneNodes) {
    if (ctx) {
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
      osc.stop(ctx.currentTime + 1.1);
    } else {
      osc.stop();
    }
  }
  droneNodes = [];
}
