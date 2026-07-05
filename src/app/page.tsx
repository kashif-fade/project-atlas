"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/db";
import { Explorer } from "@/lib/types";
import ProfilePicker from "@/components/atlas/ProfilePicker";
import Onboarding from "@/components/atlas/Onboarding";
import MuseumView from "@/components/atlas/MuseumView";

type Screen = "loading" | "picker" | "onboarding" | "museum";

export default function Home() {
  const [screen, setScreen] = useState<Screen>("loading");
  const [explorers, setExplorers] = useState<Explorer[]>([]);
  const [explorer, setExplorer] = useState<Explorer | null>(null);

  useEffect(() => {
    db.explorers.toArray().then((all) => {
      setExplorers(all);
      setScreen(all.length > 0 ? "picker" : "onboarding");
    });
  }, []);

  async function handleCreate(name: string, avatar: string) {
    const newExplorer: Explorer = {
      id: crypto.randomUUID(),
      name,
      avatar,
      createdAt: Date.now(),
      lastVisitAt: Date.now(),
      discoveries: [],
    };

    await db.explorers.add(newExplorer);
    setExplorers((prev) => [...prev, newExplorer]);
    setExplorer(newExplorer);
    setScreen("museum");
  }

  async function handleSelect(selected: Explorer) {
    const updated = { ...selected, lastVisitAt: Date.now() };
    await db.explorers.put(updated);
    setExplorer(updated);
    setScreen("museum");
  }

  function handleExplorerChange(updated: Explorer) {
    setExplorer(updated);
    setExplorers((prev) =>
      prev.map((e) => (e.id === updated.id ? updated : e))
    );
  }

  function handleSwitchProfile() {
    setExplorer(null);
    setScreen("picker");
  }

  return (
    <main className="min-h-screen flex items-start justify-center pt-10 pb-16 bg-slate-950 text-white overflow-y-auto">
      <div className="w-full max-w-md px-6">
        {screen === "loading" && (
          <p className="text-slate-500 text-center">The Museum is opening…</p>
        )}

        {screen === "picker" && (
          <ProfilePicker
            explorers={explorers}
            onSelect={handleSelect}
            onNew={() => setScreen("onboarding")}
          />
        )}

        {screen === "onboarding" && (
          <Onboarding
            showIntro={explorers.length === 0}
            onCreate={handleCreate}
            onBack={
              explorers.length > 0 ? () => setScreen("picker") : undefined
            }
          />
        )}

        {screen === "museum" && explorer && (
          <MuseumView
            explorer={explorer}
            onExplorerChange={handleExplorerChange}
            onSwitchProfile={handleSwitchProfile}
          />
        )}
      </div>
    </main>
  );
}
