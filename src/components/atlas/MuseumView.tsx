"use client";

import { useState } from "react";
import { db } from "@/lib/db";
import { Explorer, DiscoveryRecord } from "@/lib/types";
import { Discovery, getFact } from "@/lib/museum/types";
import { museumRooms } from "@/lib/museum/data";
import { getCuratorMessage } from "@/lib/curator";
import Journal from "./Journal";
import RoomScene from "./RoomScene";

type Props = {
  explorer: Explorer;
  onExplorerChange: (updated: Explorer) => void;
  onSwitchProfile: () => void;
};

export default function MuseumView({
  explorer,
  onExplorerChange,
  onSwitchProfile,
}: Props) {
  const [roomIndex, setRoomIndex] = useState(0);
  const [view, setView] = useState<"room" | "journal">("room");
  const [discoveringId, setDiscoveringId] = useState<string | null>(null);
  const [justFoundId, setJustFoundId] = useState<string | null>(null);

  const room = museumRooms[roomIndex];
  const level = explorer.readingLevel || "advanced";
  const discoveryCount = explorer.discoveries?.length || 0;

  const foundIds = new Set(
    (explorer.discoveries || [])
      .map((r) => r.discoveryId)
      .filter((id): id is string => Boolean(id))
  );
  // Legacy records (pre-session-2) stored no discoveryId; match by title.
  const foundTitles = new Set(
    (explorer.discoveries || []).map((r) => r.title)
  );
  for (const r of museumRooms) {
    for (const d of r.discoveries) {
      if (foundTitles.has(d.title)) foundIds.add(d.id);
    }
  }

  const foundInRoom = room.discoveries.filter((d) =>
    foundIds.has(d.id)
  ).length;

  async function discover(d: Discovery) {
    if (foundIds.has(d.id) || discoveringId) return;

    setDiscoveringId(d.id);
    // A small pause makes discovery feel like an event, not a click.
    await new Promise((resolve) => setTimeout(resolve, 900));

    const record: DiscoveryRecord = {
      id: crypto.randomUUID(),
      discoveryId: d.id,
      title: d.title,
      fact: getFact(d, level),
      emoji: d.emoji,
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
    <div className="space-y-5">
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
        <div className="text-center space-y-4">
          {/* Room navigation */}
          <div className="flex justify-center gap-2 flex-wrap">
            {museumRooms.map((r, i) => (
              <button
                key={r.id}
                onClick={() => setRoomIndex(i)}
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
              {foundInRoom} of {room.discoveries.length} wonders found —
              tap the sparkling ones!
            </p>
          </div>

          <RoomScene
            key={room.id}
            room={room}
            roomIndex={roomIndex}
            level={level}
            foundIds={foundIds}
            discoveringId={discoveringId}
            justFoundId={justFoundId}
            onDiscover={discover}
          />

          {/* Curator */}
          {discoveryCount > 0 && (
            <p className="text-slate-500 italic text-sm pt-2">
              🎩 {getCuratorMessage(discoveryCount, room.name)}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
