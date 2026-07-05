"use client";

import { useState } from "react";

const avatars = ["🦊", "🦉", "🐻", "🐱", "🐸", "🐙"];

type Props = {
  /** Show the "Atlas" intro screen (first launch only) */
  showIntro: boolean;
  onCreate: (name: string, avatar: string) => void;
  /** Present when there are existing explorers to go back to */
  onBack?: () => void;
};

type Step = "intro" | "name" | "avatar";

export default function Onboarding({ showIntro, onCreate, onBack }: Props) {
  const [step, setStep] = useState<Step>(showIntro ? "intro" : "name");
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("🦊");

  return (
    <div className="text-center space-y-6">
      {step === "intro" && (
        <>
          <h1 className="text-5xl font-light">Atlas</h1>
          <p className="text-slate-300">A world of curiosity awaits.</p>

          <button
            onClick={() => setStep("name")}
            className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 transition"
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
            autoFocus
          />

          <div className="flex justify-center gap-3">
            {onBack && (
              <button
                onClick={onBack}
                className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 transition"
              >
                Back
              </button>
            )}
            <button
              disabled={!name.trim()}
              onClick={() => setStep("avatar")}
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 transition"
            >
              Continue
            </button>
          </div>
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
                className={`p-3 rounded-xl transition ${
                  avatar === a ? "bg-slate-700 ring-2 ring-slate-500" : "bg-slate-800"
                }`}
              >
                {a}
              </button>
            ))}
          </div>

          <button
            onClick={() => onCreate(name.trim(), avatar)}
            className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 transition"
          >
            Enter Museum
          </button>
        </>
      )}
    </div>
  );
}
