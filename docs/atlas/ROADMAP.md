# Project Atlas — Roadmap & Progress Tracker

Last updated: 2026-07-05 (Session 2)

## Intent

Atlas is an exploratory trivia/knowledge game built for a specific 6-year-old
with high reading ability (~8-year-old level). She plays as an "Explorer" in a
persistent **Museum of Curiosity** filled with discoveries — real facts,
presented with wonder. The game is personalized per profile so younger
siblings and cousins can be introduced over time with their own explorers,
journals, and reading levels.

Target usage: light play (10–15 min sessions) sustained over a month+.
Inspiration for polish/feel: Lingokids — but calm, and web-based.

## Design rules (non-negotiable)

- Wonder over engagement: no streaks, timers, points, or reward loops
- Exploration over competition: no scoring, no failure states
- Explain, don't test: interactions teach, they never quiz for grades
- Personal world: each Explorer has a persistent museum, journal, identity
- Calm design; big tap targets; readable for a strong young reader

## Architecture

- **Stack**: Next.js (App Router) + TypeScript + Tailwind v4; framer-motion
  available for animation; local-first, no accounts, no server
- **Persistence**: IndexedDB via Dexie (`src/lib/db.ts`), one `explorers`
  table; each Explorer document embeds their discovery records
- **Screens** (`src/app/page.tsx` orchestrates): ProfilePicker → Onboarding →
  MuseumView (rooms + Journal) — components in `src/components/atlas/`
- **Content**: data packs in `src/lib/museum/packs/` (one file per room),
  aggregated by `src/lib/museum/data.ts`. Each Discovery carries two reading
  levels (`fact` advanced / `factSimple`) plus optional `more` (deeper text)
  and `relatedTo` (future knowledge-graph links)
- **Reading levels**: Explorer.readingLevel ("simple" | "advanced") chosen at
  onboarding, decides which fact text is shown
- **Curator** (`src/lib/curator.ts`): deterministic narrative voice reacting
  to discovery count and current room

## Session plan & progress

| # | Session | Status | Notes |
|---|---------|--------|-------|
| 1 | Foundation: componentize, profile picker, dedupe, wire Curator | ✅ Done | commit 315da31 |
| 2 | Content engine: layered facts, reading levels, 60 discoveries, 6 rooms | ✅ Done | 6 rooms × 10 discoveries |
| 3 | Hidden-object rooms: scene layouts, tap-to-reveal, animation | ✅ Done | RoomScene + framer-motion |
| 4 | Journal as collection: wings, progress fill, favorites | ⬜ Planned | ownership, not points |
| 5 | Curator memory + daily mystery exhibit + fact connections | ⬜ Planned | reason to return, no streaks |
| 6 | Content scale-up (~180 discoveries), read-aloud (Web Speech), sound | ⬜ Planned | hold ~30% for week-3 "new wing" drop |
| 7 | Polish: tablet/phone layout, transitions, kid-proofing | ⬜ Planned | |
| 8 | Playtest iteration with the kid | ⬜ Planned | non-negotiable |

## Changelog

- **2026-07-05 — Session 1** (315da31): split monolithic page.tsx into
  ProfilePicker / Onboarding / MuseumView / Journal; profile picker enables
  multiple explorers; duplicate discoveries prevented; Curator actually
  rendered; "Discovering…" feedback pause; journal newest-first.
- **2026-07-05 — Session 2**: layered-fact content engine, reading levels,
  6 rooms × 10 discoveries, facts hidden until discovered, "Tell me more",
  per-room progress counts, Curator lines for new rooms.

## Known environment quirks (for future sessions)

- `next build` hangs in the Cowork sandbox (Google Fonts fetch blocked);
  verify with `npx tsc --noEmit` + `npx eslint src`, test with `npm run dev`
  on the host machine.
- Windows↔sandbox file sync can NUL-pad or truncate files; prefer writing
  source via sandbox-side heredoc and re-verify with tsc.

- **2026-07-05 — Session 3**: hidden-object room scenes — per-room gradient
  backdrops, discoveries scattered as bobbing/sparkling tappable objects,
  animated exhibit card modal (spring reveal, wiggle while discovering,
  expandable Tell me more), legacy journal records matched by title.
