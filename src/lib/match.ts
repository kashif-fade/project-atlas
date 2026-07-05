import { Explorer } from "./types";
import { Discovery } from "./museum/types";
import { allDiscoveries } from "./museum/data";

export type MatchMode = "name" | "fact";

export type MatchRound = {
  wonders: Discovery[];
  labels: { id: string; text: string }[];
};

/** All museum discoveries this explorer has actually found */
export function getDiscoveredPool(explorer: Explorer): Discovery[] {
  const records = explorer.discoveries || [];
  const ids = new Set(records.map((r) => r.discoveryId).filter(Boolean));
  const titles = new Set(records.map((r) => r.title));
  return allDiscoveries
    .filter(
      ({ discovery }) => ids.has(discovery.id) || titles.has(discovery.title)
    )
    .map(({ discovery }) => discovery);
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Build a round of 4 pairs from the explorer's discovered wonders */
export function makeRound(pool: Discovery[], mode: MatchMode): MatchRound {
  const four = shuffle(pool).slice(0, 4);
  const labels = shuffle(
    four.map((d) => ({
      id: d.id,
      text: mode === "name" ? d.title : d.factSimple,
    }))
  );
  return { wonders: four, labels };
}
