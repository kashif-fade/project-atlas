import { allDiscoveries } from "./museum/data";

export function getDateKey(d: Date) {
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

/**
 * Deterministic "mystery of the day": same for everyone on a given date,
 * no streaks, no penalty for missing a day.
 */
export function getDailyMystery(dateKey: string) {
  let h = 7;
  for (const c of dateKey) {
    h = (h * 31 + c.charCodeAt(0)) >>> 0;
  }
  return allDiscoveries[h % allDiscoveries.length];
}

let cached: { key: string; pick: ReturnType<typeof getDailyMystery> } | null =
  null;

/** Today's mystery, cached per calendar day */
export function getTodaysMystery() {
  const key = getDateKey(new Date());
  if (!cached || cached.key !== key) {
    cached = { key, pick: getDailyMystery(key) };
  }
  return cached.pick;
}
