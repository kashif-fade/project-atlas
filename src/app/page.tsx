"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/db";
import { Explorer } from "@/lib/types";
import { museumRooms } from "@/lib/museum/data";
import { DiscoveryRecord } from "@/lib/types";

const avatars = ["🦊", "🦉", "🐻", "🐱", "🐸", "🐙"];

export default function Home() {
  const [step, setStep] = useState<
  "loading" | "intro" | "name" | "avatar" | "museum"
>("loading");

const [explorer, setExplorer] = useState<Explorer | null>(null);
const [name, setName] = useState("");
const [avatar, setAvatar] = useState("🦊");
const [roomIndex, setRoomIndex] = useState(0);
const room = museumRooms[roomIndex];
const [view, setView] = useState<"room" | "journal">("room");

useEffect(() => {
  const loadExplorer = async () => {
    const all = await db.explorers.toArray();

    if (all.length > 0) {
      setExplorer(all[0]);
      setStep("museum");
    } else {
      setStep("intro");
    }
  };

  loadExplorer();
}, []);

  async function createExplorer() {
  const newExplorer: Explorer = {
    id: crypto.randomUUID(),
    name,
    avatar,
    createdAt: Date.now(),
  };

  await db.explorers.add(newExplorer);

  setExplorer(newExplorer);
  setStep("museum");
}
async function saveDiscovery() {
  if (!explorer) return;

  const discovery: DiscoveryRecord = {
    id: crypto.randomUUID(),
    title: room.discoveries[0].title,
    fact: room.discoveries[0].fact,
    emoji: room.discoveries[0].emoji,
    foundAt: Date.now(),
  };

  const updated = {
    ...explorer,
    discoveries: [...(explorer.discoveries || []), discovery],
  };

  await db.explorers.put(updated);
  setExplorer(updated);
}

  return (
 <main className="min-h-screen flex items-start justify-center pt-10 bg-slate-950 text-white overflow-y-auto">
      <div className="text-center space-y-6 w-full max-w-md px-6">
	  <div className="flex justify-center gap-4 mb-6">
  <button
    onClick={() => setView("room")}
    className="px-4 py-2 bg-slate-800 rounded-lg"
  >
    Museum
  </button>
{view === "room" && (
  <>
    {/* existing room UI goes here */}
	<div className="flex justify-center gap-2 mb-6 flex-wrap">
  {museumRooms.map((r, i) => (
    <button
      key={r.id}
      onClick={() => setRoomIndex(i)}
      className={`px-3 py-2 rounded-lg text-sm transition ${
        i === roomIndex
          ? "bg-slate-700"
          : "bg-slate-800 hover:bg-slate-700"
      }`}
    >
      {r.emoji} {r.name}
    </button>
  ))}
</div>
  </>
)}
  <button
    onClick={() => setView("journal")}
    className="px-4 py-2 bg-slate-800 rounded-lg"
  >
    Journal
  </button>
  {view === "journal" && explorer && (
  <div className="space-y-4 text-left max-w-md mx-auto">
    <h2 className="text-xl text-center mb-4">
      📖 {explorer.name}'s Journal
    </h2>

    {!explorer.discoveries?.length && (
      <p className="text-slate-400 text-center">
        No discoveries yet. Start exploring the museum.
      </p>
    )}

    {explorer.discoveries?.map((d) => (
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
)}
</div>
	  
	  {step === "museum" && explorer && (
  <div className="text-center space-y-8 px-6">

    <div className="text-6xl">{explorer.avatar}</div>

    <h1 className="text-2xl font-light">
      {room.emoji} {room.name}
    </h1>

    <p className="text-slate-400">
      The Museum is alive with discoveries waiting to be found.
    </p>

    {/* First Exhibit */}
    <div className="mt-10 bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
      <div className="text-4xl">
        {room.discoveries[0].emoji}
      </div>

      <h2 className="text-xl">
        {room.discoveries[0].title}
      </h2>

      <p className="text-slate-300">
        {room.discoveries[0].fact}
      </p>

      <button
        onClick={() => {
          saveDiscovery();
        }}
        className="mt-4 px-4 py-2 bg-slate-800 rounded-lg"
      >
        Discover
      </button>
    </div>

  </div>
)}

        {step === "intro" && (
          <>
            <h1 className="text-5xl font-light">Atlas</h1>
            <p className="text-slate-300">A world of curiosity awaits.</p>

            <button
  onClick={() => setStep("name")}
>
  Begin Journey
</button>
          </>
        )}

        {step === "name" && (
          <>
            <p className="text-lg">What is your name, Explorer?</p>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-slate-800 text-white"
              placeholder="Type your name..."
            />

            <button
              disabled={!name}
              onClick={() => setStep("avatar")}
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50"
            >
              Continue
            </button>
          </>
        )}

        {step === "avatar" && (
          <>
            <p className="text-lg">Choose your explorer icon</p>

            <div className="flex justify-center gap-3 text-3xl">
              {avatars.map((a) => (
                <button
                  key={a}
                  onClick={() => setAvatar(a)}
                  className={`p-3 rounded-xl ${
                    avatar === a ? "bg-slate-700" : "bg-slate-800"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>

            <button
              onClick={createExplorer}
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700"
            >
              Enter Museum
            </button>
          </>
        )}

        {step === "done" && (
          <>
            <div className="text-6xl">{avatar}</div>
            <h2 className="text-2xl">Welcome, {name}</h2>
            <p className="text-slate-300">
              The Museum of Curiosity is opening...
            </p>
          </>
        )}

      </div>
    </main>
  );
}