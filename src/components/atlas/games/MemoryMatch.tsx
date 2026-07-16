"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Explorer } from "@/lib/types";
import { Discovery } from "@/lib/museum/types";
import { getDiscoveredPool, shuffle } from "@/lib/match";
import { playFlip, playMatch, playOops, playSolve } from "@/lib/sound";
import WonderIcon from "../WonderIcon";

type Card = { uid: string; wonder: Discovery };

function buildDeck(pool: Discovery[]): Card[] {
  const pairs = Math.min(6, pool.length);
  const chosen = shuffle(pool).slice(0, pairs);
  const cards = chosen.flatMap((w) => [
    { uid: `${w.id}-a`, wonder: w },
    { uid: `${w.id}-b`, wonder: w },
  ]);
  return shuffle(cards);
}

export default function MemoryMatch({ explorer }: { explorer: Explorer }) {
  const pool = useMemo(() => getDiscoveredPool(explorer), [explorer]);

  const [deck, setDeck] = useState<Card[]>(() => buildDeck(pool));
  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [locked, setLocked] = useState(false);

  const pairs = deck.length / 2;
  const complete = matched.size === pairs && pairs > 0;

  function newBoard() {
    setDeck(buildDeck(pool));
    setFlipped([]);
    setMatched(new Set());
    setLocked(false);
  }

  function flip(card: Card) {
    if (locked) return;
    if (matched.has(card.wonder.id)) return;
    if (flipped.includes(card.uid)) return;

    playFlip();
    const next = [...flipped, card.uid];
    setFlipped(next);

    if (next.length < 2) return;

    setLocked(true);
    const [firstUid, secondUid] = next;
    const first = deck.find((c) => c.uid === firstUid);
    const second = deck.find((c) => c.uid === secondUid);

    if (first && second && first.wonder.id === second.wonder.id) {
      setTimeout(() => {
        const done = new Set(matched).add(first.wonder.id);
        setMatched(done);
        setFlipped([]);
        setLocked(false);
        if (done.size === pairs) playSolve();
        else playMatch();
      }, 350);
    } else {
      playOops();
      setTimeout(() => {
        setFlipped([]);
        setLocked(false);
      }, 850);
    }
  }

  if (pool.length < 3) {
    return (
      <div className="text-center space-y-4 py-10">
        <div className="text-5xl">🎴</div>
        <h2 className="text-xl font-light">Memory Match</h2>
        <p className="text-slate-400 max-w-sm mx-auto">
          Find at least 3 wonders in the museum, then come back — you&apos;ll
          flip and match cards made from the wonders in YOUR journal!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="text-center">
        <h2 className="text-xl font-light">🎴 Memory Match</h2>
        <p className="text-slate-500 text-sm mt-1">
          Flip two cards. Can you remember where each wonder hides?
        </p>
      </div>

      {complete && (
        <motion.div
          className="text-center space-y-3 bg-slate-900 border border-emerald-800/60 rounded-2xl p-5"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <p className="text-emerald-400">
            🌟 You found every pair! What a memory.
          </p>
          <button
            onClick={newBoard}
            className="px-5 py-3 bg-sky-700 hover:bg-sky-600 rounded-xl transition"
          >
            New board
          </button>
        </motion.div>
      )}

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-w-md mx-auto">
        {deck.map((card) => {
          const isUp =
            flipped.includes(card.uid) || matched.has(card.wonder.id);
          const isMatched = matched.has(card.wonder.id);

          return (
            <motion.button
              key={card.uid}
              onClick={() => flip(card)}
              disabled={locked || isMatched}
              whileTap={isUp ? {} : { scale: 0.94 }}
              className={`aspect-square rounded-2xl border flex items-center justify-center text-4xl sm:text-5xl transition touch-manipulation ${
                isMatched
                  ? "bg-emerald-950/60 border-emerald-800 opacity-80"
                  : isUp
                    ? "bg-slate-700 border-sky-500"
                    : "bg-slate-900 border-slate-800 hover:bg-slate-800"
              }`}
              aria-label={isUp ? card.wonder.title : "A face-down card"}
            >
              {isUp ? (
                <motion.span
                  initial={{ rotateY: 90 }}
                  animate={{ rotateY: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <WonderIcon wonder={card.wonder} />
                </motion.span>
              ) : (
                <span className="text-slate-600">✨</span>
              )}
            </motion.button>
          );
        })}
      </div>

      {!complete && (
        <div className="text-center">
          <button
            onClick={newBoard}
            className="text-slate-400 hover:text-white text-sm transition"
          >
            Shuffle a new board
          </button>
        </div>
      )}
    </div>
  );
}
