"use client";

import { Explorer } from "@/lib/types";

type Props = {
  explorer: Explorer;
};

export default function Journal({ explorer }: Props) {
  const discoveries = explorer.discoveries || [];

  return (
    <div className="space-y-4 text-left">
      <h2 className="text-xl text-center mb-4">📖 {explorer.name}&apos;s Journal</h2>

      {discoveries.length === 0 && (
        <p className="text-slate-400 text-center">
          No discoveries yet. Start exploring the museum!
        </p>
      )}

      {[...discoveries]
        .sort((a, b) => b.foundAt - a.foundAt)
        .map((d) => (
          <div
            key={d.id}
            className="bg-slate-900 border border-slate-800 p-4 rounded-xl"
          >
            <div className="text-3xl">{d.emoji}</div>
            <h3 className="text-lg">{d.title}</h3>
            <p className="text-slate-400 text-sm">{d.fact}</p>
          </div>
        ))}
    </div>
  );
}
