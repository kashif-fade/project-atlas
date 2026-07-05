"use client";

import { useState } from "react";
import { db } from "@/lib/db";
import { Explorer, DiscoveryRecord } from "@/lib/types";
import { Discovery, getFact } from "@/lib/museum/types";
import { museumRooms, findDiscovery } from "@/lib/museum/data";
import { getCuratorMessage } from "@/lib/curator";
import { getTodaysMystery } from "@/lib/mystery";
import Journal from "./Journal";
import RoomScene from "./RoomScene";

type Props = {
  explorer: Explorer;
  greeting?: string | null;
  onExplorerChange: (updated: Explorer) => void;
  onSwitchProfile: () => void;
};

type Mystery = {
  discoveryId: string;
  title: string;
  roomId: string;
  roomName: string;
  roomEmoji: string;
};

export default function MuseumView({
  explorer,
  greeting,
  onExplorerChange,
  onSwitchProfile,
}: Props) {
  const [roomIndex, setRoomIndex] = useState(0);
  const [view, setView] = useState<"room" | "journal">("room");
  const [discoveringId, setDiscoveringId] = useState<string | null>(null);
  const [justFoundId, setJustFoundId] = useState<string | null>(null);
  const [pendingOpenId, setPendingOpenId] = useState<string | null>(null);

  const m = getTodaysMystery();
  const mystery: Mystery = {
    discoveryId: m.discovery.id,
    title: m.discovery.title,
    roomId: m.room.id,
    roomName: m.room.name,
    roomEmoji: m.room.emoji,
  };

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

  const mysteryFound = foundIds.has(mystery.discoveryId);

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

  function navigateToDiscovery(discoveryId: string) {
    const target = findDiscovery(discoveryId);
    if (!target) return;
    const idx = museumRooms.findIndex((r) => r.id === target.room.id);
    if (idx === -1) return;
    setPendingOpenId(discoveryId);
    setRoomIndex(idx);
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

      {/* Curator greeting */}
      {greeting && (
        <p className="text-slate-400 italic text-sm text-center bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-3">
          🎩 {greeting}
        </p>
      )}

      {view === "journal" && (
        <Journal explorer={explorer} onExplorerChange={onExplorerChange} />
      )}

      {view === "room" && (
        <div className="text-center space-y-4">
          {/* Room navigation */}
          <div className="flex justify-center gap-2 flex-wrap">
            {museumRooms.map((r, i) => (
              <button
                key={r.id}
                onClick={() => {
                  setPendingOpenId(null);
                  setRoomIndex(i);
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

          {/* Daily mystery hint */}
          {(
            <p className="text-amber-400/90 text-sm">
              {mysteryFound
                ? `🌟 You found today's mystery — the ${mystery.title}!`
                : mystery.roomId === room.id
                  ? "🔮 Today's mystery hides somewhere in this very room..."
                  : `🔮 Today's mystery hides in the ${mystery.roomEmoji} ${mystery.roomName}...`}
            </p>
          )}

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
            key={`${room.id}:${pendingOpenId || ""}`}
            room={room}
            roomIndex={roomIndex}
            level={level}
            foundIds={foundIds}
            discoveringId={discoveringId}
            justFoundId={justFoundId}
            mysteryId={mystery.discoveryId}
            initialOpenId={pendingOpenId}
            onDiscover={discover}
            onNavigate={navigateToDiscovery}
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
