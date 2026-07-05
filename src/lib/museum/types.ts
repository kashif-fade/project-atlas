export type Discovery = {
  id: string;
  title: string;
  emoji: string;
  /** Rich fact for strong readers (default) */
  fact: string;
  /** Short, simple fact for younger explorers */
  factSimple: string;
  /** Optional deeper "Tell me more" text */
  more?: string;
  /** Optional image (public path) used instead of the emoji, for wonders
   *  with no good emoji (e.g. seahorse, jellyfish) */
  image?: string;
  /** Future knowledge-graph links (discovery ids) */
  relatedTo?: string[];
};

export type MuseumRoom = {
  id: string;
  name: string;
  emoji: string;
  discoveries: Discovery[];
};

export type ReadingLevel = "simple" | "advanced";

export function getFact(d: Discovery, level: ReadingLevel): string {
  return level === "simple" ? d.factSimple : d.fact;
}
