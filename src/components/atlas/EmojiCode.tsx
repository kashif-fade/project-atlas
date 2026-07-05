"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export const CODE_EMOJIS = ["🦊", "🐙", "🌙", "⭐", "🌈", "🍎", "🚀", "🐸"];
export const CODE_LENGTH = 3;

type Props = {
  prompt: string;
  /** Called when CODE_LENGTH emojis are picked; return false to shake+reset */
  onComplete: (code: string) => boolean | void;
};

/** Kid-friendly secret code: tap 3 emojis in order */
export default function EmojiCodeInput({ prompt, onComplete }: Props) {
  const [picks, setPicks] = useState<string[]>([]);
  const [shake, setShake] = useState(0);

  function pick(e: string) {
    const next = [...picks, e];
    if (next.length < CODE_LENGTH) {
      setPicks(next);
      return;
    }
    const ok = onComplete(next.join(""));
    if (ok === false) {
      setShake((s) => s + 1);
    }
    setPicks([]);
  }

  return (
    <div className="space-y-4 text-center">
      <p className="text-slate-300">{prompt}</p>

      <motion.div
        key={shake}
        className="flex justify-center gap-3"
        animate={shake > 0 ? { x: [0, -10, 10, -8, 8, 0] } : {}}
        transition={{ duration: 0.4 }}
      >
        {Array.from({ length: CODE_LENGTH }).map((_, i) => (
          <div
            key={i}
            className="w-14 h-14 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-3xl"
          >
            {picks[i] || <span className="text-slate-600 text-xl">•</span>}
          </div>
        ))}
      </motion.div>

      <div className="grid grid-cols-4 gap-2 max-w-64 mx-auto">
        {CODE_EMOJIS.map((e) => (
          <button
            key={e}
            onClick={() => pick(e)}
            className="text-3xl bg-slate-800 hover:bg-slate-700 rounded-xl p-3 transition touch-manipulation"
          >
            {e}
          </button>
        ))}
      </div>
    </div>
  );
}
