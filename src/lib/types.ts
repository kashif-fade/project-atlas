import type { ReadingLevel } from "./museum/types";

export type Explorer = {
  id: string;
  name: string;
  avatar: string;
  createdAt: number;
  lastVisitAt?: number;
  /** Which fact text this explorer sees; defaults to "advanced" */
  readingLevel?: ReadingLevel;
  /** 3-emoji secret code protecting this profile (optional) */
  secretCode?: string;
  discoveries?: DiscoveryRecord[];
  /** Saved coloring artwork: pageId → (regionId → color) */
  colorings?: Record<string, Record<string, string>>;
};

export type DiscoveryRecord = {
  id: string;
  /** id of the museum Discovery this record came from */
  discoveryId?: string;
  title: string;
  /** The fact text as the explorer saw it when discovering */
  fact: string;
  emoji: string;
  foundAt: number;
  /** Starred by the explorer in their journal */
  favorite?: boolean;
};
