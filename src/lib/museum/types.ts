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
