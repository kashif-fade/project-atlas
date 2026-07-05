"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Explorer } from "@/lib/types";
import {
  getDiscoveredPool,
  makeRound,
  MatchMode,
  MatchRound,
} from "@/lib/match";
import { playPop, playMatch, playOops } from "@/lib/sound";
import WonderIcon from "./WonderIcon";

type Props = {
  explorer: Explorer;
};

export default function MatchGame({ explorer }: Props) {
  const pool = getDiscoveredPool(explorer);

  const [mode, setMode] = useState<MatchMode>("name");
  const [round, setRound] = useState<MatchRound | null>(null);
  const [leftPick, setLeftPick] = useState<string | null>(null);
  const [rightPick, setRightPick] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [wrongPair, setWrongPair] = useState<[string, string] | null>(null);

  function startRound(m: MatchMode) {
    setMode(m);
    setRound(makeRound(pool, m));
    setMatched(new Set());
    setLeftPick(null);
    setRightPick(null);
    setWrongPair(null);
  }

  function evaluate(left: string | null, right: string | null) {
    if (!left || !right) return;
    if (left === right) {
      playMatch();
      setMatched((prev) => new Set(prev).add(left));
      setLeftPick(null);
      setRightPick(null);
    } else {
      playOops();
      setWrongPair([left, right]);
      setTimeout(() => {
        setWrongPair(null);
        setLeftPick(null);
        setRightPick(null);
      }, 700);
    }
  }

  function chooseLeft(id: string) {
    if (matched.has(id) || wrongPair) return;
    playPop();
    setLeftPick(id);
    evaluate(id, rightPick);
  }

  function chooseRight(id: string) {
    if (matched.has(id) || wrongPair) return;
    playPop();
    setRightPick(id);
    evaluate(leftPick, id);
  }

  if (pool.length < 4) {
    return (
      <div className="text-center space-y-4 py-10">
        <div className="text-5xl">🎲</div>
        <h2 className="text-xl font-light">Curator&apos;s Match</h2>
        <p className="text-slate-400 max-w-sm mx-auto">
          Find at least 4 wonders in the museum, then come back — we&apos;ll
          play a matching game with the wonders from YOUR journal!
        </p>
      </div>
    );
  }

  if (!round) {
    return (
      <div className="text-center space-y-6 py-8">
        <div className="text-5xl">🎲</div>
        <h2 className="text-xl font-light">Curator&apos;s Match</h2>
        <p className="text-slate-400 max-w-sm mx-auto">
          A game with wonders from your own journal. Match each wonder to
          its... what shall it be?
        </p>

        <div className="flex flex-col gap-3 items-stretch max-w-xs mx-auto">
          <button
            onClick={() => startRound("name")}
            className="px-6 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 transition text-left"
          >
            <span className="text-2xl mr-2">🏷️</span>
            <span className="text-lg">Match the names</span>
          </button>
          <button
            onClick={() => startRound("fact")}
            className="px-6 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 transition text-left"
          >
            <span className="text-2xl mr-2">💡</span>
            <span className="text-lg">Match the facts</span>
          </button>
        </div>
      </div>
    );
  }

  const complete = matched.size === round.wonders.length;

  return (
    <div className="space-y-5">
      <div className="text-center">
        <h2 className="text-xl font-light">🎲 Curator&apos;s Match</h2>
        <p className="text-slate-500 text-sm mt-1">
          {mode === "name"
            ? "Tap a wonder, then tap its name!"
            : "Tap a wonder, then tap its fact!"}
        </p>
      </div>

      {complete && (
        <motion.div
          className="text-center space-y-3 bg-slate-900 border border-emerald-800/60 rounded-2xl p-5"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <p className="text-emerald-400">
            🌟 You matched them all! The Curator is impressed.
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => startRound(mode)}
              className="px-5 py-3 bg-sky-700 hover:bg-sky-600 rounded-xl transition"
            >
              Play again
            </button>
            <button
              onClick={() => setRound(null)}
              className="px-5 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition"
            >
              Change game
            </button>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {/* Wonders */}
        <div className="space-y-3">
          {round.wonders.map((d) => {
            const isMatched = matched.has(d.id);
            const isPicked = leftPick === d.id;
            const isWrong = wrongPair?.[0] === d.id;

            return (
              <motion.button
                key={d.id}
                onClick={() => chooseLeft(d.id)}
                disabled={isMatched}
                animate={isWrong ? { x: [0, -8, 8, -6, 6, 0] } : {}}
                transition={{ duration: 0.45 }}
                className={`w-full py-4 rounded-xl border text-4xl transition touch-manipulation flex items-center justify-center gap-2 ${
                  isMatched
                    ? "bg-emerald-950/60 border-emerald-800 opacity-70"
                    : isPicked
                      ? "bg-slate-700 border-sky-500"
                      : "bg-slate-900 border-slate-800 hover:bg-slate-800"
                }`}
              >
                <WonderIcon wonder={d} />
                {isMatched && <span className="text-base">✓</span>}
              </motion.button>
            );
          })}
        </div>

        {/* Labels */}
        <div className="space-y-3">
          {round.labels.map((label) => {
            const isMatched = matched.has(label.id);
            const isPicked = rightPick === label.id;
            const isWrong = wrongPair?.[1] === label.id;

            return (
              <motion.button
                key={label.id}
                onClick={() => chooseRight(label.id)}
                disabled={isMatched}
                animate={isWrong ? { x: [0, 8, -8, 6, -6, 0] } : {}}
                transition={{ duration: 0.45 }}
                className={`w-full min-h-16 py-2 px-3 rounded-xl border transition touch-manipulation ${
                  mode === "name" ? "text-base" : "text-xs leading-snug"
                } ${
                  isMatched
                    ? "bg-emerald-950/60 border-emerald-800 opacity-70"
                    : isPicked
                      ? "bg-slate-700 border-sky-500"
                      : "bg-slate-900 border-slate-800 hover:bg-slate-800"
                }`}
              >
                {label.text}
                {isMatched && " ✓"}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
