"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { db } from "@/lib/db";
import { Explorer } from "@/lib/types";
import { coloringPages, ColoringPage, Region } from "@/lib/coloring";
import { playFlip, playOops, playSolve } from "@/lib/sound";

type Props = {
  explorer: Explorer;
  onExplorerChange: (updated: Explorer) => void;
};

const EMPTY = "#ffffff";

function RegionShape({
  region,
  fill,
  wrong,
  onClick,
}: {
  region: Region;
  fill: string;
  wrong: boolean;
  onClick: () => void;
}) {
  const common = {
    fill,
    stroke: wrong ? "#f59e0b" : "#334155",
    strokeWidth: wrong ? 4 : 2,
    strokeLinejoin: "round" as const,
    onClick,
    style: { cursor: "pointer" },
  };
  switch (region.kind) {
    case "circle":
      return <circle cx={region.cx} cy={region.cy} r={region.r} {...common} />;
    case "ellipse":
      return (
        <ellipse cx={region.cx} cy={region.cy} rx={region.rx} ry={region.ry} {...common} />
      );
    case "rect":
      return (
        <rect
          x={region.x}
          y={region.y}
          width={region.width}
          height={region.height}
          rx={region.round ?? 0}
          {...common}
        />
      );
    case "polygon":
      return <polygon points={region.points} {...common} />;
    case "path":
      return <path d={region.d} {...common} />;
  }
}

export default function ColoringStudio({ explorer, onExplorerChange }: Props) {
  const [page, setPage] = useState<ColoringPage>(coloringPages[0]);
  const [mode, setMode] = useState<"number" | "free">("number");
  const [selectedN, setSelectedN] = useState<number>(coloringPages[0].palette[0].n);
  const [selectedColor, setSelectedColor] = useState<string>(
    coloringPages[0].palette[0].color
  );
  const [fills, setFills] = useState<Record<string, string>>(
    () => explorer.colorings?.[coloringPages[0].id] ?? {}
  );
  const [wrongId, setWrongId] = useState<string | null>(null);
  const [justDone, setJustDone] = useState(false);
  const [loadedPageId, setLoadedPageId] = useState(coloringPages[0].id);

  // Reset the palette + saved artwork when the picture changes (React's
  // endorsed "adjust state during render" pattern — no effect needed).
  if (loadedPageId !== page.id) {
    setLoadedPageId(page.id);
    setFills(explorer.colorings?.[page.id] ?? {});
    setSelectedN(page.palette[0].n);
    setSelectedColor(page.palette[0].color);
    setJustDone(false);
  }

  async function persist(next: Record<string, string>) {
    const updated: Explorer = {
      ...explorer,
      colorings: { ...(explorer.colorings ?? {}), [page.id]: next },
    };
    await db.explorers.put(updated);
    onExplorerChange(updated);
  }

  function fillRegion(r: Region) {
    if (mode === "number" && r.n !== selectedN) {
      setWrongId(r.id);
      playOops();
      setTimeout(() => setWrongId(null), 450);
      return;
    }
    const color =
      mode === "number"
        ? page.palette.find((p) => p.n === selectedN)?.color ?? EMPTY
        : selectedColor;

    const next = { ...fills, [r.id]: color };
    setFills(next);
    persist(next);

    if (page.regions.every((rr) => next[rr.id])) {
      playSolve();
      setJustDone(true);
    } else {
      playFlip();
    }
  }

  function clearPage() {
    setFills({});
    setJustDone(false);
    persist({});
  }

  return (
    <div className="space-y-5">
      <div className="text-center">
        <h2 className="text-xl font-light">🎨 Coloring Studio</h2>
        <p className="text-slate-500 text-sm mt-1">
          {mode === "number"
            ? "Pick a number, then tap the spaces with that number."
            : "Pick any color, then tap a space to fill it."}
        </p>
      </div>

      {/* Page picker */}
      <div className="flex justify-center gap-2 flex-wrap">
        {coloringPages.map((p) => (
          <button
            key={p.id}
            onClick={() => setPage(p)}
            className={`px-3 py-2 rounded-xl text-2xl transition touch-manipulation ${
              p.id === page.id
                ? "bg-slate-700 ring-2 ring-sky-500"
                : "bg-slate-900 hover:bg-slate-800"
            }`}
            title={p.title}
          >
            {p.emoji}
          </button>
        ))}
      </div>

      {justDone && (
        <motion.p
          className="text-center text-emerald-400 bg-slate-900 border border-emerald-800/60 rounded-2xl p-4"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          🌟 You colored the whole {page.title}! It&apos;s saved in your museum.
        </motion.p>
      )}

      {/* Canvas */}
      <div className="max-w-xs mx-auto bg-white rounded-2xl p-3 shadow-xl">
        <svg viewBox={page.viewBox} className="w-full h-auto select-none">
          {page.regions.map((r) => (
            <RegionShape
              key={r.id}
              region={r}
              fill={fills[r.id] ?? EMPTY}
              wrong={wrongId === r.id}
              onClick={() => fillRegion(r)}
            />
          ))}
          {mode === "number" &&
            page.regions.map((r) =>
              fills[r.id] ? null : (
                <text
                  key={`n-${r.id}`}
                  x={r.label.x}
                  y={r.label.y}
                  fontSize={12}
                  fill="#64748b"
                  textAnchor="middle"
                  dominantBaseline="central"
                  style={{ pointerEvents: "none" }}
                >
                  {r.n}
                </text>
              )
            )}
        </svg>
      </div>

      {/* Mode toggle */}
      <div className="flex justify-center gap-2">
        <button
          onClick={() => setMode("number")}
          className={`px-4 py-2 rounded-xl text-sm transition ${
            mode === "number" ? "bg-slate-700" : "bg-slate-900 hover:bg-slate-800"
          }`}
        >
          🔢 By number
        </button>
        <button
          onClick={() => setMode("free")}
          className={`px-4 py-2 rounded-xl text-sm transition ${
            mode === "free" ? "bg-slate-700" : "bg-slate-900 hover:bg-slate-800"
          }`}
        >
          🎨 Free color
        </button>
      </div>

      {/* Palette */}
      <div className="flex justify-center gap-3 flex-wrap">
        {page.palette.map((sw) => {
          const active =
            mode === "number" ? selectedN === sw.n : selectedColor === sw.color;
          return (
            <button
              key={sw.n}
              onClick={() => {
                setSelectedN(sw.n);
                setSelectedColor(sw.color);
              }}
              className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-semibold transition touch-manipulation ${
                active
                  ? "border-white scale-110 shadow-lg"
                  : "border-slate-700"
              }`}
              style={{ backgroundColor: sw.color, color: "#1e293b" }}
              title={sw.name}
            >
              {mode === "number" ? sw.n : ""}
            </button>
          );
        })}
      </div>

      <div className="text-center">
        <button
          onClick={clearPage}
          className="text-slate-400 hover:text-white text-sm transition"
        >
          Start this picture over
        </button>
      </div>
    </div>
  );
}
