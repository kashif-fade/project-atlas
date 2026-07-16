"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Explorer } from "@/lib/types";
import { Discovery } from "@/lib/museum/types";
import { getDiscoveredPool, shuffle } from "@/lib/match";
import { playFlip, playMatch, playOops, playSolve } from "@/lib/sound";
import WonderIcon from "../WonderIcon";

function buildDeck(pool: Discovery[]): Discovery[] {
  const chosen = shuffle(pool).slice(0, Math.min(6, pool.length));
  const deck: Discovery[] = [];
  chosen.forEach((w) => {
    for (let i = 0; i < 3; i++) deck.push(w);
  });
  const shuffled = shuffle(deck);
  // Sprinkle a few guaranteed "snaps" so matches show up often enough to be fun.
  const snaps = Math.min(5, Math.floor(shuffled.length / 4));
  for (let s = 0; s < snaps; s++) {
    const i = Math.floor(Math.random() * (shuffled.length - 1));
    shuffled[i + 1] = shuffled[i];
  }
  return shuffled;
}

export default function Snap({ explorer }: { explorer: Explorer }) {
  const pool = useMemo(() => getDiscoveredPool(explorer), [explorer]);

  const [deck, setDeck] = useState<Discovery[]>(() => buildDeck(pool));
  const [pos, setPos] = useState(0);
  const [snaps, setSnaps] = useState(0);
  const [caught, setCaught] = useState(false);
  const [wiggle, setWiggle] = useState(false);
  const [finished, setFinished] = useState(false);

  function newGame() {
    setDeck(buildDeck(pool));
    setPos(0);
    setSnaps(0);
    setCaught(false);
    setWiggle(false);
    setFinished(false);
  }

  const current = deck[pos];
  const previous = pos > 0 ? deck[pos - 1] : null;
  const isMatch = Boolean(previous && current.id === previous.id);
  const snapReady = isMatch && !caught;

  function flip() {
    if (finished) return;
    if (pos >= deck.length - 1) {
      setFinished(true);
      playSolve();
      return;
    }
    playFlip();
    setPos(pos + 1);
    setCaught(false);
  }

  function snap() {
    if (finished) return;
    if (snapReady) {
      playMatch();
      setSnaps((s) => s + 1);
      setCaught(true);
    } else {
      playOops();
      setWiggle(true);
      setTimeout(() => setWiggle(false), 450);
    }
  }

  if (pool.length < 3) {
    return (
      <div className="text-center space-y-4 py-10">
        <div className="text-5xl">⚡</div>
        <h2 className="text-xl font-light">Snap!</h2>
        <p className="text-slate-400 max-w-sm mx-auto">
          Find at least 3 wonders in the museum first — then flip through the
          deck and shout SNAP when two of the same wonder land in a row!
        </p>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="text-center space-y-4 py-8">
        <div className="text-5xl">⚡</div>
        <h2 className="text-xl font-light">You went through the whole deck!</h2>
        <p className="text-emerald-400">
          You caught {snaps} {snaps === 1 ? "snap" : "snaps"}. 🌟
        </p>
        <button
          onClick={newGame}
          className="px-5 py-3 bg-sky-700 hover:bg-sky-600 rounded-xl transition"
        >
          Play again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="text-center">
        <h2 className="text-xl font-light">⚡ Snap!</h2>
        <p className="text-slate-500 text-sm mt-1">
          Flip cards one by one. When two of the same wonder land in a row, tap
          SNAP!
        </p>
      </div>

      <div className="flex items-center justify-center gap-4">
        {/* Previous card (ghost) */}
        <div className="text-center">
          <div
            className={`w-20 h-24 rounded-xl border flex items-center justify-center text-4xl ${
              previous
                ? "bg-slate-900 border-slate-800 opacity-60"
                : "bg-transparent border-dashed border-slate-800 opacity-30"
            }`}
          >
            {previous ? <WonderIcon wonder={previous} /> : ""}
          </div>
          <p className="text-[10px] text-slate-600 mt-1">last card</p>
        </div>

        {/* Current card */}
        <motion.div
          key={pos}
          initial={{ rotateY: 90, opacity: 0 }}
          animate={{ rotateY: 0, opacity: 1 }}
          transition={{ duration: 0.22 }}
          className={`w-28 h-32 rounded-2xl border-2 flex items-center justify-center text-6xl shadow-xl ${
            snapReady
              ? "bg-amber-950/40 border-amber-400"
              : "bg-slate-800 border-slate-600"
          }`}
        >
          <WonderIcon wonder={current} />
        </motion.div>
      </div>

      <p className="text-center text-sm text-slate-500">
        Card {pos + 1} of {deck.length} · {snaps} caught
      </p>

      <div className="flex justify-center gap-3">
        <button
          onClick={flip}
          className="px-6 py-4 bg-slate-800 hover:bg-slate-700 rounded-2xl text-lg transition touch-manipulation"
        >
          🃏 Flip next
        </button>
        <motion.button
          onClick={snap}
          animate={
            wiggle
              ? { x: [0, -8, 8, -6, 6, 0] }
              : snapReady
                ? { scale: [1, 1.06, 1] }
                : {}
          }
          transition={
            snapReady && !wiggle
              ? { duration: 0.8, repeat: Infinity }
              : { duration: 0.45 }
          }
          className={`px-8 py-4 rounded-2xl text-lg font-semibold transition touch-manipulation ${
            snapReady
              ? "bg-amber-500 hover:bg-amber-400 text-slate-950"
              : "bg-slate-900 hover:bg-slate-800 text-slate-300"
          }`}
        >
          SNAP!
        </motion.button>
      </div>

      <div className="text-center">
        <button
          onClick={newGame}
          className="text-slate-400 hover:text-white text-sm transition"
        >
          New deck
        </button>
      </div>
    </div>
  );
}
