"use client";

import { Explorer } from "@/lib/types";

type Props = {
  explorers: Explorer[];
  onSelect: (explorer: Explorer) => void;
  onNew: () => void;
};

export default function ProfilePicker({ explorers, onSelect, onNew }: Props) {
  return (
    <div className="text-center space-y-8">
      <h1 className="text-3xl font-light">Who&apos;s exploring today?</h1>

      <div className="flex flex-wrap justify-center gap-4">
        {explorers.map((e) => (
          <button
            key={e.id}
            onClick={() => onSelect(e)}
            className="flex flex-col items-center gap-2 bg-slate-900 border border-slate-800 hover:border-slate-600 rounded-2xl px-8 py-6 transition"
          >
            <span className="text-5xl">{e.avatar}</span>
            <span className="text-lg">{e.name}</span>
            <span className="text-xs text-slate-500">
              {e.discoveries?.length || 0}{" "}
              {(e.discoveries?.length || 0) === 1 ? "discovery" : "discoveries"}
            </span>
          </button>
        ))}
      </div>

      <button
        onClick={onNew}
        className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 transition"
      >
        ✨ New Explorer
      </button>
    </div>
  );
}
