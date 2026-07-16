"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Explorer } from "@/lib/types";
import { Discovery } from "@/lib/museum/types";
import { getDiscoveredPool } from "@/lib/match";
import { playCatch } from "@/lib/sound";
import WonderIcon from "../WonderIcon";

type Item = { id: number; x: number; vy: number; wonder: Discovery };

const BASKET_HALF = 15; // percent — generous catch width for little hands
const CATCH_LINE = 0.84; // fraction of height where the basket sits

export default function WonderCatch({ explorer }: { explorer: Explorer }) {
  const pool = useMemo(() => getDiscoveredPool(explorer), [explorer]);
  const enoughWonders = pool.length >= 3;

  const areaRef = useRef<HTMLDivElement>(null);
  const basketRef = useRef<HTMLDivElement>(null);
  const basketXRef = useRef(50);

  // The falling items live in refs so the animation loop can move them by
  // touching the DOM directly. React only re-renders to add/remove nodes.
  const itemsRef = useRef<Item[]>([]);
  const yRef = useRef<Map<number, number>>(new Map());
  const elRef = useRef<Map<number, HTMLSpanElement>>(new Map());
  const nextIdRef = useRef(1);

  const [items, setItems] = useState<Item[]>([]);
  const [caught, setCaught] = useState(0);

  useEffect(() => {
    if (!enoughWonders) return;
    let raf = 0;
    let last = 0;
    let spawnTimer = 0;
    const yMap = yRef.current;
    const elMap = elRef.current;

    const loop = (ts: number) => {
      if (!last) last = ts;
      const dt = Math.min(0.05, (ts - last) / 1000);
      last = ts;

      let changed = false;
      let caughtThisFrame = 0;

      // Spawn.
      spawnTimer += dt;
      if (spawnTimer > 0.95) {
        spawnTimer = 0;
        const id = nextIdRef.current++;
        const item: Item = {
          id,
          x: 10 + Math.random() * 80,
          vy: 0.26 + Math.random() * 0.16,
          wonder: pool[Math.floor(Math.random() * pool.length)],
        };
        itemsRef.current = [...itemsRef.current, item];
        yMap.set(id, -0.05);
        changed = true;
      }

      // Move + resolve.
      const bx = basketXRef.current;
      const removals: number[] = [];
      for (const it of itemsRef.current) {
        const prevY = yMap.get(it.id) ?? 0;
        const y = prevY + it.vy * dt;
        if (y >= CATCH_LINE && prevY < CATCH_LINE) {
          if (Math.abs(it.x - bx) <= BASKET_HALF) {
            removals.push(it.id);
            caughtThisFrame++;
            continue;
          }
        }
        if (y > 1.08) {
          removals.push(it.id);
          continue;
        }
        yMap.set(it.id, y);
        const el = elMap.get(it.id);
        if (el) el.style.top = `${y * 100}%`;
      }

      if (removals.length) {
        itemsRef.current = itemsRef.current.filter(
          (i) => !removals.includes(i.id)
        );
        removals.forEach((id) => {
          yMap.delete(id);
          elMap.delete(id);
        });
        changed = true;
      }

      if (caughtThisFrame > 0) {
        playCatch();
        setCaught((c) => c + caughtThisFrame);
        basketRef.current?.animate(
          [
            { transform: "translateX(-50%) scale(1.25)" },
            { transform: "translateX(-50%) scale(1)" },
          ],
          { duration: 180, easing: "ease-out" }
        );
      }

      if (changed) setItems(itemsRef.current);
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      itemsRef.current = [];
      yMap.clear();
      elMap.clear();
    };
  }, [enoughWonders, pool]);

  function moveBasket(clientX: number) {
    const rect = areaRef.current?.getBoundingClientRect();
    if (!rect) return;
    const pct = ((clientX - rect.left) / rect.width) * 100;
    const clamped = Math.max(8, Math.min(92, pct));
    basketXRef.current = clamped;
    if (basketRef.current) basketRef.current.style.left = `${clamped}%`;
  }

  if (!enoughWonders) {
    return (
      <div className="text-center space-y-4 py-10">
        <div className="text-5xl">🧺</div>
        <h2 className="text-xl font-light">Wonder Catch</h2>
        <p className="text-slate-400 max-w-sm mx-auto">
          Find at least 3 wonders in the museum — then help the Curator catch
          them as they tumble down. Slide your basket to scoop them up!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-xl font-light">🧺 Wonder Catch</h2>
        <p className="text-slate-500 text-sm mt-1">
          The exhibits came loose! Slide your basket to catch the falling
          wonders.
        </p>
        <p className="text-emerald-400 text-sm mt-1">🌟 {caught} caught</p>
      </div>

      <div
        ref={areaRef}
        onPointerMove={(e) => moveBasket(e.clientX)}
        onPointerDown={(e) => moveBasket(e.clientX)}
        className="relative w-full h-96 sm:h-[28rem] rounded-2xl border border-slate-800 overflow-hidden bg-gradient-to-b from-indigo-950 via-slate-950 to-slate-950 touch-none select-none cursor-pointer"
      >
        {items.map((it) => (
          <span
            key={it.id}
            ref={(el) => {
              if (el) elRef.current.set(it.id, el);
              else elRef.current.delete(it.id);
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 text-4xl sm:text-5xl drop-shadow-lg pointer-events-none"
            style={{ left: `${it.x}%`, top: "-5%" }}
          >
            <WonderIcon wonder={it.wonder} />
          </span>
        ))}

        {/* Basket — moved directly via ref, never through React state */}
        <div
          ref={basketRef}
          className="absolute -translate-x-1/2 text-5xl sm:text-6xl pointer-events-none"
          style={{ left: "50%", top: `${CATCH_LINE * 100}%` }}
        >
          🧺
        </div>
      </div>

      <p className="text-center text-xs text-slate-600">
        Move your finger (or mouse) across the picture to slide the basket.
      </p>
    </div>
  );
}
