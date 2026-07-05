# Project Atlas — Complete Project Summary

Last updated: 2026-07-05 · Status: **v1 shipped, all 8 build sessions complete**

This is the single consolidated reference for the project. If you're picking
this up fresh (new chat, new machine, new collaborator), read this file first,
then `ROADMAP.md` for the session-by-session changelog.

---

## 1. What this is

**Atlas** is a web game — the *Museum of Curiosity* — built for a specific
6-year-old with ~8-year-old reading ability. She plays as an "Explorer" who
wanders themed museum rooms, taps sparkling objects to discover real facts,
and collects them in a personal journal. Profiles let siblings/cousins join
later with their own museums and reading levels.

**Design rules (non-negotiable, from the original vision):**
wonder over engagement · no streaks/timers/points/reward loops · explain,
don't test · calm design · personal persistent world · big tap targets.

## 2. Where everything lives

- **Code**: `C:\Users\Kashif\atlas\project-atlas` (this repo)
- **GitHub**: https://github.com/kashif-fade/project-atlas (push from local
  terminal; commits are made locally first)
- **Deployment**: Vercel, connected to the GitHub repo — every push to
  `main` auto-deploys in ~1–2 min
- **On devices**: open the Vercel URL; on iPhone/iPad use Safari → Share →
  Add to Home Screen (installs as a full-screen app with the sparkle icon)
- **Player data**: IndexedDB, **per browser/device** — journals do NOT sync
  between devices; each device is its own museum
- **Docs**: `docs/atlas/ROADMAP.md` (session tracker + changelog),
  `docs/atlas/PROJECT.md` (this file). `STATE.md` is the original pre-build
  vision doc, kept for history.

## 3. Feature inventory (all live)

- **Profiles**: picker at entrance ("Who's exploring today?"), emoji avatar,
  per-profile reading level (🌳 rich facts / 🌱 short facts), optional
  **3-emoji secret code** lock (set/change/remove in Journal settings)
- **Museum**: 10 rooms × 10 discoveries = 100 wonders live. Rooms: Ocean
  Hall, Sky Gallery, Earth Lab, Space Wing, Dinosaur Hall, Animal Kingdom,
  Human Body Hall, Inventors' Workshop, Long Ago Hall, Tiny World
- **Room scenes**: gradient backdrops, objects scattered spatially,
  undiscovered ones bob + sparkle ✨, found ones wear ✓; ‹ › arrows and
  scrollable chips for room navigation
- **Discovery**: tap object → animated exhibit card → Discover (900ms
  "event" pause) → fact revealed + expandable "Tell me more" + connected-
  wonder chips that navigate across rooms (mini knowledge graph via
  `relatedTo`)
- **Journal**: personal museum — per-room wings with progress bars, tile
  grids (❓ for unfound), detail cards with found-date, ⭐ favorites shelf
- **Curator**: personalized greeting (name, time since last visit, last
  wonder found), milestone + room-flavored one-liners
- **Daily mystery**: deterministic per-date pick, hint line, golden ring on
  the object, celebration on find — deliberately streak-free
- **Curator's Match** (🎲 Play tab): match your own discovered wonders to
  names or facts; no score/timer; wrong = gentle wiggle
- **Audio**: read-aloud (Web Speech, quality-ranked voice locked per
  session), synthesized sound effects (pop/discover-arpeggio/mystery-
  shimmer/match/oops), generative ambient music (pentatonic pad + drone,
  🎵 toggle, default on), separate 🔇 SFX mute — both persisted
- **Custom art**: hand-drawn SVG seahorse + jellyfish (`public/wonders/`)
  via `Discovery.image` + `WonderIcon` component (extend this pattern for
  any wonder with no good emoji)
- **PWA**: manifest + icons (golden sparkle on night gradient), standalone
  portrait mode, iOS meta
- **Data hygiene**: one-time journal dedupe migration on load; legacy
  records matched by title; journal shows current art for old records

## 4. The vault (planned content drop)

Two fully-authored rooms are committed but NOT wired in, saved for a
"a new wing has opened!" moment (~2–3 weeks after launch):
**Plant Conservatory 🌿** and **World Wonders 🗺️** — 20 discoveries in
`src/lib/museum/vault/`. **To open them:** in `src/lib/museum/data.ts`,
uncomment the two vault imports and add both rooms to `museumRooms`.
Everything else (mystery, journal, game, totals) adapts automatically.

## 5. Architecture (for whoever codes next)

Next.js 16 App Router + TypeScript + Tailwind v4 + framer-motion + Dexie
(IndexedDB). Local-first; no server, no accounts, no analytics.

- `src/app/page.tsx` — screen orchestrator (loading→picker→onboarding→museum)
- `src/components/atlas/` — ProfilePicker, Onboarding, MuseumView (tabs:
  room/journal/play), RoomScene, Journal, MatchGame, EmojiCode, WonderIcon
- `src/lib/` — db.ts (Dexie, one `explorers` table; discoveries embedded in
  the explorer doc), types.ts, curator.ts, mystery.ts, match.ts, speech.ts,
  sound.ts, music.ts, migrate.ts
- `src/lib/museum/` — types.ts (`Discovery`: fact/factSimple/more/relatedTo/
  image), data.ts (room registry + totals + lookups), packs/ (one file per
  room), vault/ (unreleased rooms)

**Environment gotchas** (Cowork sandbox): `next build` hangs (Google Fonts
fetch blocked) — verify with `npx tsc --noEmit` + `npx eslint src`; file
sync can NUL-pad/truncate — write via bash heredoc and re-verify; git locks
need the file-delete permission tool. Content rule: **emoji must be
≤ Unicode 12** (Kashif's Windows lacks newer glyphs; no flag emoji).

## 6. Build history (16 commits, one day: 2026-07-05)

1. `ba72ab9` Baseline prototype committed
2. `315da31` S1: componentized, profile picker, dedupe, Curator wired
3. `f0cb626` S2: content engine — 60 discoveries, reading levels, ROADMAP
4. `116ad2e` S3: hidden-object room scenes (the "it's a game now" commit)
5. `ecc1d71` S4: journal as collection (wings, progress, favorites)
6. `74ac18d` S5: Curator memory, daily mystery, connected wonders
7. `7b24a75` S6: scale to 100 live + 20 vaulted, read-aloud, sound
8. `9c59895` Fix: Unicode 13+ emoji swapped for Windows
9. `0be4bad` Fix: journal duplicate-record repair migration
10. `b40b4fa` S7: responsive layout, room arrows, kid-proofing
11. `1eb713c` PWA manifest + app icons
12. `f9c18f4` S8 (playtest fixes): secret codes, Curator's Match, SVG
    seahorse/jellyfish, locked TTS voice, ambient music

## 7. Playtest #1 findings (all fixed in f9c18f4)

Profile privacy → secret codes · wants more interaction → matching game ·
seahorse/jellyfish art wrong → custom SVGs · voice went drawly mid-session
→ voice ranked & locked · wants background music → generative ambient.

## 8. Ideas for future sessions (unbuilt)

- Open the vault wings (see §4) — the Curator already foreshadows this
- More custom SVG art for weak-emoji wonders
- Cross-device sync (needs a small backend; only if it ever matters)
- Knowledge-graph view of connected wonders in the Journal
- Curator personality growth; seasonal/holiday exhibits
- More rooms: Music Hall, Weather Station, Under the City…
- Export journal as a printable "field notebook" PDF

## 9. How to resume work with Claude

Open a Cowork session on the `project-atlas` folder and say "read
docs/atlas/PROJECT.md and ROADMAP.md". Claude's persistent memory for this
workspace also carries the plan, progress, and sandbox quirks.
