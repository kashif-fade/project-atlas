"use client";

import { useState } from "react";
import { Explorer } from "@/lib/types";
import EmojiCodeInput from "./EmojiCode";

type Props = {
  explorers: Explorer[];
  onSelect: (explorer: Explorer) => void;
  onNew: () => void;
};

export default function ProfilePicker({ explorers, onSelect, onNew }: Props) {
  const [locked, setLocked] = useState<Explorer | null>(null);
  const [wrongOnce, setWrongOnce] = useState(false);

  function attempt(e: Explorer) {
    if (e.secretCode) {
      setWrongOnce(false);
      setLocked(e);
    } else {
      onSelect(e);
    }
  }

  if (locked) {
    return (
      <div className="text-center space-y-6">
        <div className="text-5xl">{locked.avatar}</div>
        <h1 className="text-2xl font-light">
          Psst, {locked.name}&hellip;
        </h1>

        <EmojiCodeInput
          prompt={
            wrongOnce
              ? "Hmm, that's not it. Try again!"
              : "What's your secret code?"
          }
          onComplete={(code) => {
            if (code === locked.secretCode) {
              onSelect(locked);
              return true;
            }
            setWrongOnce(true);
            return false;
          }}
        />

        <button
          onClick={() => setLocked(null)}
          className="text-slate-400 hover:text-white text-sm transition"
        >
          ← Back
        </button>
      </div>
    );
  }

  return (
    <div className="text-center space-y-8">
      <h1 className="text-3xl font-light">Who&apos;s exploring today?</h1>

      <div className="flex flex-wrap justify-center gap-4">
        {explorers.map((e) => (
          <button
            key={e.id}
            onClick={() => attempt(e)}
            className="flex flex-col items-center gap-2 bg-slate-900 border border-slate-800 hover:border-slate-600 rounded-2xl px-8 py-6 transition"
          >
            <span className="text-5xl">{e.avatar}</span>
            <span className="text-lg">
              {e.name} {e.secretCode && <span className="text-sm">🔒</span>}
            </span>
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
