# Project Atlas — Roadmap & Progress Tracker

Last updated: 2026-07-17 (Session 9)

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
| 4 | Journal as collection: wings, progress fill, favorites | ✅ Done | tile grids + starring |
| 5 | Curator memory + daily mystery exhibit + fact connections | ✅ Done | greeting, 🔮 daily hint, chips |
| 6 | Content scale-up (120 authored: 100 live + 20 vaulted), read-aloud, sound | ✅ Done | vault flip documented in data.ts |
| 7 | Polish: tablet/phone layout, transitions, kid-proofing | ✅ Done | arrows, chips, touch targets |
| 8 | Playtest iteration with the kid | ✅ Done | 5 findings, all fixed |
| 9 | Play Room arcade: 5 gentle games built from her wonders | ✅ Done | 2026-07-17; coloring, memory, catch, snap, puzzle |

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

- **2026-07-05 — Session 4**: journal rebuilt as a personal museum — per-room
  wings with animated progress bars, emoji tile grids (dimmed ❓ for unfound),
  detail card with found date, favorites starring + favorites shelf.

- **2026-07-05 — Session 5**: Curator memory (personalized greeting by name,
  time since last visit, last discovery), deterministic daily mystery exhibit
  (hint line, golden pulsing ring, celebration on find — no streaks), and
  connected-wonder chips in exhibit cards with cross-room navigation.

- **2026-07-05 — Session 6**: 4 new rooms live (Human Body Hall, Inventors'
  Workshop, Long Ago Hall, Tiny World → 100 discoveries live), 2 vault rooms
  authored for the week-3 "new wing" drop (Plant Conservatory, World Wonders —
  flip instructions in data.ts), read-aloud via Web Speech ("🔊 Read to me" on
  exhibit + journal cards), synthesized WebAudio sounds (tap pop, discovery
  arpeggio, mystery shimmer), mute toggle persisted in localStorage. Curator
  completion milestone now tracks totalDiscoveries.

- **2026-07-05 — Session 7**: polish pass — responsive container (wider on
  tablet), taller scenes on bigger screens, horizontally scrollable room
  chips on phones, ‹ › prev/next room arrows flanking the room title,
  room-complete note, bigger touch targets with touch-manipulation and
  select-none (no double-tap zoom or text selection), scene fade-in,
  proper page title/description, dark body background (no white flash).

- **2026-07-05 — PWA**: web app manifest (standalone, portrait, dark theme),
  app icons (golden wonder-sparkle on night gradient; favicon, apple-icon,
  192/512 + maskable), iOS standalone meta. "Add to Home Screen" on iPhone
  now installs Atlas like a real app. Deploy target: Vercel.

- **2026-07-05 — Session 8 (playtest fixes)**: first real playtest! Her
  findings → fixes: (1) profile privacy → 3-emoji secret code per explorer,
  gate at picker, set/change/remove in Journal settings; (2) wants more
  interaction → Curator's Match game (🎲 Play tab): match her OWN discovered
  wonders to names or facts, no scores/timers, wrong guesses just wiggle;
  (3) seahorse/jellyfish emoji wrong → hand-drawn SVG creatures via new
  Discovery.image + WonderIcon; (4) voice went drawly mid-session → voice
  is now quality-ranked and locked once (voices load async; the old code
  re-picked badly); (5) wants music → gentle generative WebAudio pentatonic
  ambient, 🎵 toggle, persisted, default on.

- **2026-07-17 — Session 9 (the Play Room arcade)**: motivation — she enjoys
  Atlas but drifts to flashier games; the diagnosis was a narrow interaction
  vocabulary (basically "tap to reveal + read"). Fix was *more verbs*, not
  louder ones: the 🎲 Play tab is now a **PlayHub** menu of six games, all
  built from the wonders in her own journal and all obeying the calm rules
  (no scores/timers/streaks/fail states; wrong = gentle wiggle). New games in
  `src/components/atlas/games/`:
  (1) **Coloring Studio** (`ColoringStudio.tsx` + `src/lib/coloring.ts`) —
  4 hand-authored SVG line-art pages (fish, rocket, flower, sailboat) with
  color-by-number and free-color modes; artwork persists per page on the
  Explorer via new `Explorer.colorings` (pageId → regionId → color). To add
  pictures: append a `ColoringPage` to `coloringPages` (typed shape union, no
  wiring needed). Good future home for the ART-PROMPTS illustration set.
  (2) **Memory Match** (`MemoryMatch.tsx`) — classic concentration flip game,
  up to 6 pairs from discovered wonders.
  (3) **Snap!** (`Snap.tsx`) — flip the deck at your own pace, tap SNAP when
  two wonders land in a row; deck seeds a few guaranteed adjacent matches.
  (4) **Wonder Catch** (`WonderCatch.tsx`) — "hole 'em all": slide a basket to
  catch falling wonders, misses drift away. The animation loop moves items via
  direct DOM writes (refs), keeping React out of the 60fps path — no per-frame
  reconcile, easy on tablet battery. First motor/dexterity play in the app.
  (5) **Wonder Puzzles** (`Puzzle.tsx`) — tap-to-swap 3×3 jigsaw; each tile is
  a translated viewport onto the wonder art (works for emoji and SVG images),
  finished picture shown as a reference "box lid".
  Curator's Match is kept in the lineup. Shared bits: `shuffle` now exported
  from `match.ts`; three new sounds (`playFlip`/`playCatch`/`playSolve`) in
  `sound.ts`. Verified with tsc + eslint and a live dev-server playthrough
  (hub nav, coloring render, memory flips, puzzle slicing, catch loop).
  Also added `.claude/launch.json` for `npm run dev` previews.
