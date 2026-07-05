"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { db } from "@/lib/db";
import { Explorer, DiscoveryRecord } from "@/lib/types";
import { museumRooms, totalDiscoveries } from "@/lib/museum/data";

type Props = {
  explorer: Explorer;
  onExplorerChange: (updated: Explorer) => void;
};

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
  });
}

export default function Journal({ explorer, onExplorerChange }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const records = explorer.discoveries || [];

  // Match each museum discovery to this explorer's record (id or legacy title)
  const recordFor = (discoveryId: string, title: string) =>
    records.find((r) => r.discoveryId === discoveryId || r.title === title);

  const selected = records.find((r) => r.id === selectedId) || null;
  const favorites = records.filter((r) => r.favorite);
  const foundCount = records.length;

  async function toggleFavorite(record: DiscoveryRecord) {
    const updated: Explorer = {
      ...explorer,
      discoveries: records.map((r) =>
        r.id === record.id ? { ...r, favorite: !r.favorite } : r
      ),
    };
    await db.explorers.put(updated);
    onExplorerChange(updated);
  }

  return (
    <div className="space-y-6 text-left">
      <div className="text-center">
        <h2 className="text-2xl font-light">
          📖 {explorer.name}&apos;s Museum
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          {foundCount} of {totalDiscoveries} wonders collected
        </p>
      </div>

      {foundCount === 0 && (
        <p className="text-slate-400 text-center">
          No discoveries yet. The Museum&apos;s wonders are waiting for you!
        </p>
      )}

      {/* Detail card */}
      {selected && (
        <motion.div
          key={selected.id}
          className="bg-slate-900 border border-slate-700 rounded-2xl p-5 space-y-2"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-start justify-between">
            <div className="text-4xl">{selected.emoji}</div>
            <button
              onClick={() => toggleFavorite(selected)}
              className="text-2xl p-1"
              title={selected.favorite ? "Un-star" : "Star this wonder"}
            >
              {selected.favorite ? "⭐" : "☆"}
            </button>
          </div>
          <h3 className="text-lg">{selected.title}</h3>
          <p className="text-slate-300">{selected.fact}</p>
          <p className="text-slate-500 text-xs">
            Found on {formatDate(selected.foundAt)}
          </p>
          <button
            onClick={() => setSelectedId(null)}
            className="text-slate-400 hover:text-white text-sm transition"
          >
            Close
          </button>
        </motion.div>
      )}

      {/* Favorites shelf */}
      {favorites.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm text-slate-400">⭐ Favorites</h3>
          <div className="flex flex-wrap gap-2">
            {favorites.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelectedId(r.id)}
                className="text-3xl bg-slate-900 border border-amber-700/50 rounded-xl p-3 hover:bg-slate-800 transition"
                title={r.title}
              >
                {r.emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Wings */}
      {museumRooms.map((room) => {
        const roomRecords = room.discoveries.map((d) => ({
          discovery: d,
          record: recordFor(d.id, d.title),
        }));
        const foundInRoom = roomRecords.filter((x) => x.record).length;
        const pct = Math.round((foundInRoom / room.discoveries.length) * 100);

        return (
          <div key={room.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm text-slate-300">
                {room.emoji} {explorer.name}&apos;s {room.name}
              </h3>
              <span className="text-xs text-slate-500">
                {foundInRoom} / {room.discoveries.length}
              </span>
            </div>

            <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-emerald-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>

            <div className="grid grid-cols-5 gap-2">
              {roomRecords.map(({ discovery, record }) =>
                record ? (
                  <button
                    key={discovery.id}
                    onClick={() => setSelectedId(record.id)}
                    className={`aspect-square rounded-xl bg-slate-900 border text-2xl flex items-center justify-center hover:bg-slate-800 transition relative ${
                      selectedId === record.id
                        ? "border-sky-500"
                        : "border-slate-800"
                    }`}
                    title={discovery.title}
                  >
                    {discovery.emoji}
                    {record.favorite && (
                      <span className="absolute -top-1 -right-1 text-xs">
                        ⭐
                      </span>
                    )}
                  </button>
                ) : (
                  <div
                    key={discovery.id}
                    className="aspect-square rounded-xl bg-slate-950 border border-slate-900 text-xl flex items-center justify-center text-slate-700"
                    title="Not found yet"
                  >
                    ❓
                  </div>
                )
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
