"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/db";
import { Explorer } from "@/lib/types";
import type { ReadingLevel } from "@/lib/museum/types";
import { getCuratorGreeting } from "@/lib/curator";
import { dedupeDiscoveries } from "@/lib/migrate";
import ProfilePicker from "@/components/atlas/ProfilePicker";
import Onboarding from "@/components/atlas/Onboarding";
import MuseumView from "@/components/atlas/MuseumView";

type Screen = "loading" | "picker" | "onboarding" | "museum";

export default function Home() {
  const [screen, setScreen] = useState<Screen>("loading");
  const [explorers, setExplorers] = useState<Explorer[]>([]);
  const [explorer, setExplorer] = useState<Explorer | null>(null);
  const [greeting, setGreeting] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const all = await db.explorers.toArray();

      // One-time repair: old versions could save duplicate discoveries
      const repaired = await Promise.all(
        all.map(async (e) => {
          const fixed = dedupeDiscoveries(e);
          if (fixed) {
            await db.explorers.put(fixed);
            return fixed;
          }
          return e;
        })
      );

      setExplorers(repaired);
      setScreen(repaired.length > 0 ? "picker" : "onboarding");
    };

    load();
  }, []);

  async function handleCreate(
    name: string,
    avatar: string,
    readingLevel: ReadingLevel
  ) {
    const now = Date.now();
    const newExplorer: Explorer = {
      id: crypto.randomUUID(),
      name,
      avatar,
      createdAt: now,
      lastVisitAt: now,
      readingLevel,
      discoveries: [],
    };

    await db.explorers.add(newExplorer);
    setExplorers((prev) => [...prev, newExplorer]);
    setExplorer(newExplorer);
    setGreeting(getCuratorGreeting(name, undefined, null, now));
    setScreen("museum");
  }

  async function handleSelect(selected: Explorer) {
    const now = Date.now();
    const prevVisitAt = selected.lastVisitAt;
    const records = selected.discoveries || [];
    const lastFound =
      records.length > 0 ? records[records.length - 1].title : null;

    const updated = { ...selected, lastVisitAt: now };
    await db.explorers.put(updated);
    setExplorer(updated);
    setGreeting(getCuratorGreeting(selected.name, prevVisitAt, lastFound, now));
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
    setGreeting(null);
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
            greeting={greeting}
            onExplorerChange={handleExplorerChange}
            onSwitchProfile={handleSwitchProfile}
          />
        )}
      </div>
    </main>
  );
}
