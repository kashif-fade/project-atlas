"use client";

import { useState } from "react";
import { db } from "@/lib/db";
import { Explorer, DiscoveryRecord } from "@/lib/types";
import { Discovery, getFact } from "@/lib/museum/types";
import { museumRooms } from "@/lib/museum/data";
import { getCuratorMessage } from "@/lib/curator";
import Journal from "./Journal";

type Props = {
  explorer: Explorer;
  onExplorerChange: (updated: Explorer) => void;
  onSwitchProfile: () => void;
};

function hasFound(explorer: Explorer, d: Discovery) {
  return (explorer.discoveries || []).some(
    (r) => r.discoveryId === d.id || r.title === d.title
  );
}

export default function MuseumView({
  explorer,
  onExplorerChange,
  onSwitchProfile,
}: Props) {
  const [roomIndex, setRoomIndex] = useState(0);
  const [view, setView] = useState<"room" | "journal">("room");
  const [discoveringId, setDiscoveringId] = useState<string | null>(null);
  const [justFoundId, setJustFoundId] = useState<string | null>(null);
  const [moreOpenId, setMoreOpenId] = useState<string | null>(null);

  const room = museumRooms[roomIndex];
  const level = explorer.readingLevel || "advanced";
  const discoveryCount = explorer.discoveries?.length || 0;
  const foundInRoom = room.discoveries.filter((d) =>
    hasFound(explorer, d)
  ).length;

  async function discover(d: Discovery) {
    if (hasFound(explorer, d) || discoveringId) return;

    setDiscoveringId(d.id);
    // A small pause makes discovery feel like an event, not a click.
    await new Promise((resolve) => setTimeout(resolve, 900));

    const record: DiscoveryRecord = {
      id: crypto.randomUUID(),
      discoveryId: d.id,
      title: d.title,
      fact: getFact(d, level),
      emoji: d.emoji,
      // eslint-disable-next-line react-hooks/purity -- event handler, impurity is fine
      foundAt: Date.now(),
    };

    const updated: Explorer = {
      ...explorer,
      discoveries: [...(explorer.discoveries || []), record],
    };

    await db.explorers.put(updated);
    onExplorerChange(updated);
    setDiscoveringId(null);
    setJustFoundId(d.id);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onSwitchProfile}
          className="flex items-center gap-2 px-3 py-2 bg-slate-900 hover:bg-slate-800 rounded-lg text-sm transition"
          title="Switch Explorer"
        >
          <span className="text-2xl">{explorer.avatar}</span>
          <span className="text-slate-400">{explorer.name}</span>
        </button>

        <div className="flex gap-2">
          <button
            onClick={() => setView("room")}
            className={`px-4 py-2 rounded-lg transition ${
              view === "room" ? "bg-slate-700" : "bg-slate-900 hover:bg-slate-800"
            }`}
          >
            🏛️ Museum
          </button>
          <button
            onClick={() => setView("journal")}
            className={`px-4 py-2 rounded-lg transition ${
              view === "journal" ? "bg-slate-700" : "bg-slate-900 hover:bg-slate-800"
            }`}
          >
            📖 Journal
          </button>
        </div>
      </div>

      {view === "journal" && <Journal explorer={explorer} />}

      {view === "room" && (
        <div className="text-center space-y-6">
          {/* Room navigation */}
          <div className="flex justify-center gap-2 flex-wrap">
            {museumRooms.map((r, i) => (
              <button
                key={r.id}
                onClick={() => {
                  setRoomIndex(i);
                  setMoreOpenId(null);
                }}
                className={`px-3 py-2 rounded-lg text-sm transition ${
                  i === roomIndex
                    ? "bg-slate-700"
                    : "bg-slate-900 hover:bg-slate-800"
                }`}
              >
                {r.emoji} {r.name}
              </button>
            ))}
          </div>

          <div>
            <h1 className="text-2xl font-light">
              {room.emoji} {room.name}
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              {foundInRoom} of {room.discoveries.length} wonders found
            </p>
          </div>

          {/* Exhibits */}
          {room.discoveries.map((d) => {
            const found = hasFound(explorer, d);
            const isDiscovering = discoveringId === d.id;
            const moreOpen = moreOpenId === d.id;

            return (
              <div
                key={d.id}
                className={`border rounded-xl p-6 space-y-3 transition ${
                  found
                    ? "bg-slate-900 border-slate-700"
                    : "bg-slate-950 border-slate-800"
                }`}
              >
                <div className={`text-4xl ${found ? "" : "opacity-60"}`}>
                  {d.emoji}
                </div>
                <h2 className="text-xl">{d.title}</h2>

                {found ? (
                  <>
                    <p className="text-slate-300">{getFact(d, level)}</p>

                    {d.more && (
                      <button
                        onClick={() => setMoreOpenId(moreOpen ? null : d.id)}
                        className="text-sm text-sky-400 hover:text-sky-300 transition"
                      >
                        {moreOpen ? "▾ That's amazing!" : "▸ Tell me more"}
                      </button>
                    )}

                    {moreOpen && d.more && (
                      <p className="text-slate-400 text-sm text-left bg-slate-950 rounded-lg p-4">
                        {d.more}
                      </p>
                    )}

                    <p className="text-emerald-400 text-sm">
                      {justFoundId === d.id
                        ? "✨ Added to your Journal!"
                        : "✓ In your Journal"}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-slate-500 italic text-sm">
                      What secret does the {d.title.toLowerCase()} hold?
                    </p>
                    <button
                      onClick={() => discover(d)}
                      disabled={isDiscovering}
                      className="mt-1 px-5 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg disabled:opacity-60 transition"
                    >
                      {isDiscovering ? "Discovering..." : "🔍 Discover"}
                    </button>
                  </>
                )}
              </div>
            );
          })}

          {/* Curator */}
          {discoveryCount > 0 && (
            <p className="text-slate-500 italic text-sm pt-4">
              🎩 {getCuratorMessage(discoveryCount, room.name)}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
