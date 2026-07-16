/** Hand-authored coloring pages: bold, clearly-separated regions that a young
 *  child can tap to fill. Each region carries a color-by-number target (`n`)
 *  matching a swatch in the page's palette. Shapes are a small typed union so
 *  the renderer stays type-safe with no casts. Start small (a few pages);
 *  add more the same way. */

export type ColorSwatch = { n: number; color: string; name: string };

type RegionBase = { id: string; n: number; label: { x: number; y: number } };

export type Region = RegionBase &
  (
    | { kind: "circle"; cx: number; cy: number; r: number }
    | { kind: "ellipse"; cx: number; cy: number; rx: number; ry: number }
    | { kind: "rect"; x: number; y: number; width: number; height: number; round?: number }
    | { kind: "polygon"; points: string }
    | { kind: "path"; d: string }
  );

export type ColoringPage = {
  id: string;
  title: string;
  emoji: string;
  viewBox: string;
  palette: ColorSwatch[];
  regions: Region[];
};

export const coloringPages: ColoringPage[] = [
  {
    id: "fish",
    title: "Friendly Fish",
    emoji: "🐟",
    viewBox: "0 0 200 160",
    palette: [
      { n: 1, color: "#f97316", name: "orange" },
      { n: 2, color: "#fbbf24", name: "gold" },
      { n: 3, color: "#ef4444", name: "red" },
      { n: 4, color: "#f8fafc", name: "white" },
      { n: 5, color: "#38bdf8", name: "blue" },
    ],
    regions: [
      { id: "tail", n: 1, label: { x: 26, y: 80 }, kind: "polygon", points: "48,80 14,52 14,108" },
      { id: "body", n: 1, label: { x: 96, y: 92 }, kind: "ellipse", cx: 112, cy: 80, rx: 72, ry: 46 },
      { id: "topFin", n: 2, label: { x: 112, y: 26 }, kind: "path", d: "M92,36 Q112,8 134,38 Z" },
      { id: "bottomFin", n: 2, label: { x: 112, y: 134 }, kind: "path", d: "M92,124 Q112,152 134,122 Z" },
      { id: "stripe", n: 3, label: { x: 138, y: 80 }, kind: "path", d: "M138,42 Q150,80 138,118 Q126,80 138,42 Z" },
      { id: "eye", n: 4, label: { x: 158, y: 66 }, kind: "circle", cx: 158, cy: 66, r: 9 },
      { id: "bubble", n: 5, label: { x: 192, y: 40 }, kind: "circle", cx: 192, cy: 40, r: 7 },
    ],
  },
  {
    id: "rocket",
    title: "Blast-Off Rocket",
    emoji: "🚀",
    viewBox: "0 0 140 200",
    palette: [
      { n: 1, color: "#ef4444", name: "red" },
      { n: 2, color: "#bfdbfe", name: "light blue" },
      { n: 3, color: "#facc15", name: "yellow" },
      { n: 4, color: "#fb923c", name: "orange" },
    ],
    regions: [
      { id: "flame", n: 4, label: { x: 70, y: 182 }, kind: "path", d: "M56,168 Q70,212 84,168 Q70,182 56,168 Z" },
      { id: "body", n: 2, label: { x: 70, y: 130 }, kind: "rect", x: 52, y: 70, width: 36, height: 100, round: 6 },
      { id: "nose", n: 1, label: { x: 70, y: 52 }, kind: "path", d: "M52,70 Q70,20 88,70 Z" },
      { id: "finLeft", n: 1, label: { x: 40, y: 150 }, kind: "path", d: "M52,120 L30,172 L52,160 Z" },
      { id: "finRight", n: 1, label: { x: 100, y: 150 }, kind: "path", d: "M88,120 L110,172 L88,160 Z" },
      { id: "window", n: 3, label: { x: 70, y: 100 }, kind: "circle", cx: 70, cy: 100, r: 13 },
    ],
  },
  {
    id: "flower",
    title: "Sunny Flower",
    emoji: "🌸",
    viewBox: "0 0 200 200",
    palette: [
      { n: 1, color: "#f472b6", name: "pink" },
      { n: 2, color: "#facc15", name: "yellow" },
      { n: 3, color: "#4ade80", name: "green" },
    ],
    regions: [
      { id: "stem", n: 3, label: { x: 100, y: 165 }, kind: "rect", x: 96, y: 110, width: 8, height: 78 },
      { id: "leafLeft", n: 3, label: { x: 72, y: 150 }, kind: "ellipse", cx: 78, cy: 150, rx: 20, ry: 10 },
      { id: "leafRight", n: 3, label: { x: 128, y: 135 }, kind: "ellipse", cx: 122, cy: 135, rx: 20, ry: 10 },
      { id: "petalTop", n: 1, label: { x: 100, y: 46 }, kind: "ellipse", cx: 100, cy: 52, rx: 18, ry: 26 },
      { id: "petalBottom", n: 1, label: { x: 100, y: 110 }, kind: "ellipse", cx: 100, cy: 104, rx: 18, ry: 26 },
      { id: "petalLeft", n: 1, label: { x: 68, y: 78 }, kind: "ellipse", cx: 74, cy: 78, rx: 26, ry: 18 },
      { id: "petalRight", n: 1, label: { x: 132, y: 78 }, kind: "ellipse", cx: 126, cy: 78, rx: 26, ry: 18 },
      { id: "center", n: 2, label: { x: 100, y: 78 }, kind: "circle", cx: 100, cy: 78, r: 18 },
    ],
  },
  {
    id: "sailboat",
    title: "Little Sailboat",
    emoji: "⛵",
    viewBox: "0 0 200 200",
    palette: [
      { n: 1, color: "#38bdf8", name: "blue" },
      { n: 2, color: "#b45309", name: "brown" },
      { n: 3, color: "#f1f5f9", name: "white" },
      { n: 4, color: "#ef4444", name: "red" },
      { n: 5, color: "#facc15", name: "yellow" },
    ],
    regions: [
      { id: "sea", n: 1, label: { x: 36, y: 176 }, kind: "rect", x: 0, y: 150, width: 200, height: 50 },
      { id: "sun", n: 5, label: { x: 165, y: 45 }, kind: "circle", cx: 165, cy: 45, r: 22 },
      { id: "mast", n: 2, label: { x: 100, y: 70 }, kind: "rect", x: 97, y: 40, width: 6, height: 110 },
      { id: "sailBig", n: 3, label: { x: 72, y: 116 }, kind: "polygon", points: "94,46 94,140 44,140" },
      { id: "sailSmall", n: 4, label: { x: 124, y: 116 }, kind: "polygon", points: "106,62 106,140 150,140" },
      { id: "hull", n: 2, label: { x: 100, y: 166 }, kind: "path", d: "M30,150 L170,150 L150,182 L50,182 Z" },
    ],
  },
];

export function findColoringPage(id: string): ColoringPage | undefined {
  return coloringPages.find((p) => p.id === id);
}
