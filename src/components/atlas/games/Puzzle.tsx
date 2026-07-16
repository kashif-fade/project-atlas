"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Explorer } from "@/lib/types";
import { Discovery } from "@/lib/museum/types";
import { getDiscoveredPool, shuffle } from "@/lib/match";
import { playFlip, playMatch, playSolve } from "@/lib/sound";

const GRID = 3;
const SIZE = 288; // px — the full picture is SIZE×SIZE
const TILE = SIZE / GRID;

function scramble(): number[] {
  const identity = Array.from({ length: GRID * GRID }, (_, i) => i);
  let order = shuffle(identity);
  // Never start already solved.
  if (order.every((v, i) => v === i)) order = shuffle(identity);
  return order;
}

/** The full picture, sized exactly SIZE×SIZE so slices line up. */
function Picture({ wonder }: { wonder: Discovery }) {
  if (wonder.image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={wonder.image}
        alt={wonder.title}
        width={SIZE}
        height={SIZE}
        draggable={false}
        style={{ width: SIZE, height: SIZE, objectFit: "contain" }}
      />
    );
  }
  return (
    <div
      style={{
        width: SIZE,
        height: SIZE,
        fontSize: SIZE * 0.72,
        lineHeight: `${SIZE}px`,
        textAlign: "center",
      }}
    >
      {wonder.emoji}
    </div>
  );
}

export default function Puzzle({ explorer }: { explorer: Explorer }) {
  const pool = useMemo(() => getDiscoveredPool(explorer), [explorer]);

  const [wonder, setWonder] = useState<Discovery | null>(
    () => pool[Math.floor(Math.random() * pool.length)] ?? null
  );
  const [order, setOrder] = useState<number[]>(() => scramble());
  const [picked, setPicked] = useState<number | null>(null);

  const solved = order.every((v, i) => v === i);

  function newPicture() {
    setWonder(pool[Math.floor(Math.random() * pool.length)] ?? null);
    setOrder(scramble());
    setPicked(null);
  }

  function tapTile(position: number) {
    if (solved) return;
    if (picked === null) {
      playFlip();
      setPicked(position);
      return;
    }
    if (picked === position) {
      setPicked(null);
      return;
    }
    // Swap the two tiles' contents.
    const next = [...order];
    [next[picked], next[position]] = [next[position], next[picked]];
    setOrder(next);
    setPicked(null);
    if (next.every((v, i) => v === i)) playSolve();
    else playMatch();
  }

  if (pool.length < 3 || !wonder) {
    return (
      <div className="text-center space-y-4 py-10">
        <div className="text-5xl">🧩</div>
        <h2 className="text-xl font-light">Wonder Puzzles</h2>
        <p className="text-slate-400 max-w-sm mx-auto">
          Find at least 3 wonders in the museum — then piece them back together
          in a jigsaw made from YOUR discoveries.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="text-center">
        <h2 className="text-xl font-light">🧩 Wonder Puzzles</h2>
        <p className="text-slate-500 text-sm mt-1">
          Tap two pieces to swap them. Rebuild the picture!
        </p>
      </div>

      {/* Reference "box lid" */}
      <div className="flex items-center justify-center gap-3 text-sm text-slate-500">
        <span>Making:</span>
        <div className="w-12 h-12 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center overflow-hidden">
          <div style={{ transform: `scale(${48 / SIZE})`, transformOrigin: "top left" }}>
            <div style={{ width: SIZE, height: SIZE }}>
              <Picture wonder={wonder} />
            </div>
          </div>
        </div>
        <span className="text-slate-300">{wonder.title}</span>
      </div>

      {solved && (
        <motion.p
          className="text-center text-emerald-400 bg-slate-900 border border-emerald-800/60 rounded-2xl p-4"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          🌟 You solved the {wonder.title} puzzle!
        </motion.p>
      )}

      <div className="flex justify-center">
        <div
          className="grid gap-[2px] bg-slate-800 rounded-xl overflow-hidden border border-slate-700"
          style={{ gridTemplateColumns: `repeat(${GRID}, ${TILE}px)` }}
        >
          {order.map((content, position) => {
            const cRow = Math.floor(content / GRID);
            const cCol = content % GRID;
            const isPicked = picked === position;
            const inPlace = content === position;

            return (
              <button
                key={position}
                onClick={() => tapTile(position)}
                disabled={solved}
                className={`relative overflow-hidden touch-manipulation transition ${
                  isPicked ? "ring-4 ring-sky-400 z-10" : ""
                }`}
                style={{ width: TILE, height: TILE }}
              >
                <div
                  className="absolute top-0 left-0"
                  style={{
                    transform: `translate(${-cCol * TILE}px, ${-cRow * TILE}px)`,
                  }}
                >
                  <Picture wonder={wonder} />
                </div>
                {!solved && inPlace && (
                  <span className="absolute inset-0 ring-2 ring-emerald-500/40 rounded-sm pointer-events-none" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="text-center flex justify-center gap-4">
        <button
          onClick={() => setOrder(scramble())}
          className="text-slate-400 hover:text-white text-sm transition"
        >
          Shuffle again
        </button>
        <button
          onClick={newPicture}
          className="text-sky-400 hover:text-sky-300 text-sm transition"
        >
          New picture
        </button>
      </div>
    </div>
  );
}
