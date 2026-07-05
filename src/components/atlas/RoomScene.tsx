"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Discovery, MuseumRoom, ReadingLevel } from "@/lib/museum/types";
import { getFact } from "@/lib/museum/types";
import { findDiscovery } from "@/lib/museum/data";

type Props = {
  room: MuseumRoom;
  roomIndex: number;
  level: ReadingLevel;
  foundIds: Set<string>;
  discoveringId: string | null;
  justFoundId: string | null;
  /** Today's mystery discovery id (golden ring if in this room) */
  mysteryId?: string | null;
  /** Open this exhibit immediately on mount (cross-room navigation) */
  initialOpenId?: string | null;
  onDiscover: (d: Discovery) => void;
  /** Navigate to a discovery in another room */
  onNavigate: (discoveryId: string) => void;
};

/** Scattered spots (percentages) — rotated per room so layouts differ */
const SPOTS = [
  { x: 16, y: 18 },
  { x: 50, y: 10 },
  { x: 81, y: 20 },
  { x: 28, y: 38 },
  { x: 64, y: 34 },
  { x: 86, y: 52 },
  { x: 12, y: 58 },
  { x: 46, y: 55 },
  { x: 72, y: 72 },
  { x: 24, y: 78 },
];

const SCENE_BG: Record<string, string> = {
  "ocean-hall": "bg-gradient-to-b from-cyan-900 via-blue-950 to-slate-950",
  "sky-gallery": "bg-gradient-to-b from-sky-800 via-indigo-900 to-slate-950",
  "earth-lab": "bg-gradient-to-b from-emerald-900 via-green-950 to-stone-950",
  "space-wing": "bg-gradient-to-b from-indigo-950 via-purple-950 to-slate-950",
  "dinosaur-hall": "bg-gradient-to-b from-amber-900 via-orange-950 to-stone-950",
  "animal-kingdom": "bg-gradient-to-b from-green-800 via-emerald-950 to-slate-950",
};

export default function RoomScene({
  room,
  roomIndex,
  level,
  foundIds,
  discoveringId,
  justFoundId,
  mysteryId,
  initialOpenId,
  onDiscover,
  onNavigate,
}: Props) {
  const [selected, setSelected] = useState<Discovery | null>(() =>
    initialOpenId
      ? room.discoveries.find((d) => d.id === initialOpenId) || null
      : null
  );
  const [moreOpen, setMoreOpen] = useState(false);

  const bg = SCENE_BG[room.id] || "bg-slate-900";

  function openExhibit(d: Discovery) {
    setSelected(d);
    setMoreOpen(false);
  }

  function closeExhibit() {
    if (discoveringId) return; // don't close mid-discovery
    setSelected(null);
    setMoreOpen(false);
  }

  const selectedFound = selected ? foundIds.has(selected.id) : false;
  const selectedDiscovering = selected ? discoveringId === selected.id : false;
  const selectedIsMystery = selected ? selected.id === mysteryId : false;

  const related =
    selected && selectedFound && selected.relatedTo
      ? selected.relatedTo
          .map((id) => findDiscovery(id))
          .filter((x): x is NonNullable<typeof x> => Boolean(x))
      : [];

  return (
    <div
      className={`relative w-full rounded-2xl border border-slate-800 overflow-hidden ${bg}`}
      style={{ height: "26rem" }}
    >
      {/* Objects */}
      {room.discoveries.map((d, i) => {
        const spot = SPOTS[(i + roomIndex * 3) % SPOTS.length];
        const found = foundIds.has(d.id);
        const isMystery = d.id === mysteryId && !found;

        return (
          <motion.button
            key={d.id}
            onClick={() => openExhibit(d)}
            className="absolute -translate-x-1/2 -translate-y-1/2 p-2 focus:outline-none"
            style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
            animate={found ? {} : { y: [0, -7, 0] }}
            transition={
              found
                ? {}
                : {
                    duration: 2.4,
                    repeat: Infinity,
                    delay: (i % 5) * 0.4,
                    ease: "easeInOut",
                  }
            }
            whileTap={{ scale: 1.25 }}
            aria-label={found ? `${d.title} (found)` : "Something to discover"}
          >
            {isMystery && (
              <motion.span
                className="absolute inset-0 rounded-full border-2 border-amber-400"
                animate={{ scale: [1, 1.25, 1], opacity: [0.9, 0.3, 0.9] }}
                transition={{ duration: 1.6, repeat: Infinity }}
              />
            )}
            <span
              className={`block text-4xl drop-shadow-lg ${
                found ? "opacity-90" : ""
              }`}
            >
              {d.emoji}
            </span>
            {found ? (
              <span className="absolute -top-1 -right-1 text-xs bg-emerald-600 rounded-full w-5 h-5 flex items-center justify-center">
                ✓
              </span>
            ) : (
              <motion.span
                className="absolute -top-2 -right-2 text-sm"
                animate={{ opacity: [1, 0.2, 1], scale: [1, 1.25, 1] }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  delay: (i % 4) * 0.5,
                }}
              >
                ✨
              </motion.span>
            )}
          </motion.button>
        );
      })}

      {/* Exhibit card */}
      <AnimatePresence>
        {selected && (
          <motion.div
            key="backdrop"
            className="absolute inset-0 bg-black/60 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeExhibit}
          >
            <motion.div
              key={selected.id}
              className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-sm max-h-full overflow-y-auto text-center space-y-3 shadow-2xl"
              initial={{ scale: 0.8, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                className="text-6xl"
                animate={
                  selectedDiscovering
                    ? { rotate: [0, -8, 8, -8, 0], scale: [1, 1.1, 1] }
                    : {}
                }
                transition={
                  selectedDiscovering
                    ? { duration: 0.9, repeat: Infinity }
                    : {}
                }
              >
                {selected.emoji}
              </motion.div>

              <h2 className="text-2xl font-light">{selected.title}</h2>

              {selectedFound ? (
                <>
                  <p className="text-slate-200 text-lg leading-relaxed">
                    {getFact(selected, level)}
                  </p>

                  {selected.more && (
                    <button
                      onClick={() => setMoreOpen(!moreOpen)}
                      className="text-sky-400 hover:text-sky-300 transition"
                    >
                      {moreOpen ? "▾ That's amazing!" : "▸ Tell me more"}
                    </button>
                  )}

                  <AnimatePresence>
                    {moreOpen && selected.more && (
                      <motion.p
                        className="text-slate-300 text-left bg-slate-950 rounded-xl p-4 leading-relaxed"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        {selected.more}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  {related.length > 0 && (
                    <div className="space-y-2 pt-1">
                      <p className="text-xs text-slate-500">
                        Connected wonders
                      </p>
                      <div className="flex flex-wrap justify-center gap-2">
                        {related.map(({ discovery, room: r }) => (
                          <button
                            key={discovery.id}
                            onClick={() => {
                              if (r.id === room.id) {
                                openExhibit(discovery);
                              } else {
                                onNavigate(discovery.id);
                              }
                            }}
                            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition"
                          >
                            {discovery.emoji} {discovery.title}
                            {r.id !== room.id && (
                              <span className="text-slate-500">
                                {" "}
                                · {r.emoji}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <p className="text-emerald-400 text-sm">
                    {justFoundId === selected.id
                      ? selectedIsMystery
                        ? "🌟 You found today's mystery!"
                        : "✨ Added to your Journal!"
                      : "✓ In your Journal"}
                  </p>
                </>
              ) : (
                <>
                  {selectedIsMystery && (
                    <p className="text-amber-400 text-sm">
                      🌟 Today&apos;s mystery!
                    </p>
                  )}
                  <p className="text-slate-400 italic">
                    What secret does the {selected.title.toLowerCase()} hold?
                  </p>
                  <button
                    onClick={() => onDiscover(selected)}
                    disabled={selectedDiscovering}
                    className="px-8 py-4 bg-sky-700 hover:bg-sky-600 rounded-xl text-lg disabled:opacity-70 transition"
                  >
                    {selectedDiscovering ? "✨ Discovering..." : "🔍 Discover"}
                  </button>
                </>
              )}

              <div>
                <button
                  onClick={closeExhibit}
                  className="mt-2 px-5 py-2 text-slate-400 hover:text-white transition"
                >
                  Back to the room
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
