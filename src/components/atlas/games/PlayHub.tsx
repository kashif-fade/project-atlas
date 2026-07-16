"use client";

import { useState } from "react";
import { Explorer } from "@/lib/types";
import MatchGame from "../MatchGame";
import MemoryMatch from "./MemoryMatch";
import Snap from "./Snap";
import WonderCatch from "./WonderCatch";
import Puzzle from "./Puzzle";
import ColoringStudio from "./ColoringStudio";

type Props = {
  explorer: Explorer;
  onExplorerChange: (updated: Explorer) => void;
};

type GameId = "memory" | "snap" | "catch" | "puzzle" | "coloring" | "match";

const GAMES: { id: GameId; emoji: string; name: string; blurb: string }[] = [
  { id: "coloring", emoji: "🎨", name: "Coloring Studio", blurb: "Color pictures by number, or any way you like" },
  { id: "memory", emoji: "🎴", name: "Memory Match", blurb: "Flip cards and remember where each wonder hides" },
  { id: "catch", emoji: "🧺", name: "Wonder Catch", blurb: "Slide your basket to catch falling wonders" },
  { id: "snap", emoji: "⚡", name: "Snap!", blurb: "Tap SNAP when two wonders match in a row" },
  { id: "puzzle", emoji: "🧩", name: "Wonder Puzzles", blurb: "Piece a wonder back together" },
  { id: "match", emoji: "🎲", name: "Curator's Match", blurb: "Match your wonders to their names and facts" },
];

export default function PlayHub({ explorer, onExplorerChange }: Props) {
  const [active, setActive] = useState<GameId | null>(null);

  if (active) {
    const meta = GAMES.find((g) => g.id === active)!;
    return (
      <div className="space-y-4">
        <button
          onClick={() => setActive(null)}
          className="px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-sm transition"
        >
          ‹ All games
        </button>

        {active === "memory" && <MemoryMatch explorer={explorer} />}
        {active === "snap" && <Snap explorer={explorer} />}
        {active === "catch" && <WonderCatch explorer={explorer} />}
        {active === "puzzle" && <Puzzle explorer={explorer} />}
        {active === "coloring" && (
          <ColoringStudio explorer={explorer} onExplorerChange={onExplorerChange} />
        )}
        {active === "match" && <MatchGame explorer={explorer} />}

        <p className="sr-only">{meta.name}</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="text-center">
        <h2 className="text-2xl font-light">🎲 The Play Room</h2>
        <p className="text-slate-500 text-sm mt-1">
          Games made from the wonders in your own museum. Pick one to play!
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {GAMES.map((g) => (
          <button
            key={g.id}
            onClick={() => setActive(g.id)}
            className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:border-slate-700 transition text-left touch-manipulation"
          >
            <span className="text-4xl shrink-0">{g.emoji}</span>
            <span>
              <span className="block text-lg">{g.name}</span>
              <span className="block text-sm text-slate-500">{g.blurb}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
