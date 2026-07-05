/** Read-aloud via the Web Speech API (free, offline, built into browsers). */

let chosenVoice: SpeechSynthesisVoice | null = null;

export function canSpeak() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

/**
 * Score voices so we consistently pick the clearest English one.
 * Browsers load the voice list asynchronously; before it loads, the default
 * voice is used — which caused the "voice suddenly changes and gets drawly"
 * bug. We now pick the best voice ONCE and lock it for the whole session.
 */
function rankVoice(v: SpeechSynthesisVoice): number {
  if (!v.lang.toLowerCase().startsWith("en")) return -1;
  const n = v.name.toLowerCase();
  let score = 1;
  if (/natural|neural|premium|enhanced/.test(n)) score += 10;
  if (/google/.test(n)) score += 7;
  if (/samantha|karen|moira|tessa|daniel|serena/.test(n)) score += 6; // Apple
  if (/aria|jenny|sonia|libby|michelle/.test(n)) score += 6; // MS natural names
  if (/zira|hazel|susan|catherine/.test(n)) score += 3;
  if (/david|mark|george|compact|espeak|robosoft/.test(n)) score -= 2;
  return score;
}

function pickVoice() {
  if (!canSpeak() || chosenVoice) return;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return;
  let best: SpeechSynthesisVoice | null = null;
  let bestScore = 0;
  for (const v of voices) {
    const s = rankVoice(v);
    if (s > bestScore) {
      best = v;
      bestScore = s;
    }
  }
  chosenVoice = best;
}

/** Call once on app start: locks in the best voice as soon as the list loads. */
export function initSpeech() {
  if (!canSpeak()) return;
  pickVoice();
  window.speechSynthesis.onvoiceschanged = () => pickVoice();
}

export function speak(text: string) {
  if (!canSpeak()) return;
  window.speechSynthesis.cancel();
  pickVoice();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.95;
  utterance.pitch = 1.0;
  if (chosenVoice) {
    utterance.voice = chosenVoice;
    utterance.lang = chosenVoice.lang;
  }

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if (canSpeak()) window.speechSynthesis.cancel();
}
