import { Explorer, DiscoveryRecord } from "./types";

/**
 * Repair journals saved by pre-dedupe versions of the app, which could
 * store the same wonder many times. Keeps the earliest record of each
 * discovery (and preserves a favorite star if any duplicate had one).
 * Returns the repaired explorer, or null if nothing needed fixing.
 */
export function dedupeDiscoveries(explorer: Explorer): Explorer | null {
  const records = explorer.discoveries || [];
  if (records.length < 2) return null;

  const byKey = new Map<string, DiscoveryRecord>();
  const sorted = [...records].sort((a, b) => a.foundAt - b.foundAt);

  for (const r of sorted) {
    const key = r.discoveryId || r.title;
    const existing = byKey.get(key);
    if (!existing) {
      byKey.set(key, r);
    } else if (r.favorite && !existing.favorite) {
      byKey.set(key, { ...existing, favorite: true });
    }
  }

  const deduped = [...byKey.values()].sort((a, b) => a.foundAt - b.foundAt);
  if (deduped.length === records.length) return null;

  return { ...explorer, discoveries: deduped };
}
