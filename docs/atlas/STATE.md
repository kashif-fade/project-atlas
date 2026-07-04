# Project Atlas — Current State

Version: 0.1.0 (Alpha Foundation)
Status: Active Development (Milestone 1 Complete → Early Milestone 1.8)
Last Updated: 2026-07-05

---

# 🧭 What This Project Is Right Now

Project Atlas is a web-based exploratory learning game for children (target age ~6–8) designed around curiosity, discovery, and memory-building.

The child is an "Explorer" who enters a persistent world called the **Museum of Curiosity**.

The experience is designed to feel like:
- a living museum
- an interactive learning world
- a calm, non-addictive educational adventure

---

# 🎮 Current Functional Features

## 1. Explorer System (Identity Layer)
- Child creates an Explorer profile:
  - name
  - avatar (emoji-based)
- Profile is persisted using IndexedDB (Dexie)
- Returning users bypass onboarding automatically

---

## 2. Museum Entrance System
- New Explorer enters onboarding → transitions into Museum
- Returning Explorer goes directly to Museum entrance
- Simple narrative framing: “The Museum is opening…”

---

## 3. Museum World (Core Experience)
- Multi-room museum structure:
  - 🌊 Ocean Hall
  - ☁️ Sky Gallery
  - 🌍 Earth Lab
- Room navigation system (switch between rooms instantly)
- Each room contains “discoveries”

---

## 4. Discovery System (Core Interaction Loop)
- Each room contains a discovery (fact + emoji)
- User can “Discover” an item
- Discovery triggers:
  - state update
  - persistence to Explorer profile
  - temporary feedback moment (“Discovering…”)

---

## 5. Journal System (Memory Layer)
- Each Explorer has a persistent journal
- Every discovery is saved with:
  - title
  - fact
  - emoji
  - timestamp
- Journal view inside Museum
- Data persists across reloads

---

## 6. Curator System (Narrative Voice Layer)
- Deterministic rule-based system
- Provides contextual messages based on:
  - number of discoveries
  - current room
- Gives the museum a “presence” without full AI

Example outputs:
- “A first discovery. Every journey begins quietly.”
- “The Museum is starting to remember your curiosity.”

---

## 7. Living Feedback Layer
- Discovery action has temporal feedback:
  - "Discovering..." state
  - brief delay
  - confirmation message
- Creates sense of interaction rather than instant UI response

---

# 🧱 Current Architecture

## Frontend
- Next.js (App Router)
- TypeScript
- Tailwind CSS

## State Management
- React state (local)
- Zustand (installed, not heavily used yet)

## Persistence
- IndexedDB via Dexie
- Single-table Explorer model (expandable)

## Data Model
- Explorer
  - id
  - name
  - avatar
  - discoveries[]

- MuseumRoom
  - id
  - name
  - emoji
  - discoveries[]

- DiscoveryRecord
  - id
  - title
  - fact
  - emoji
  - timestamp

---

# 🎯 Current Design Philosophy (Active Rules)

## 1. Wonder over Engagement
We optimize for curiosity, not screen time.

## 2. Exploration over Competition
No scoring, no failure states.

## 3. Explain, Don’t Test
Interactions are for learning, not assessment.

## 4. Calm Design
No:
- streaks
- timers
- rewards loops
- addictive mechanics

## 5. Personal World
Every Explorer has their own persistent museum and journal.

## 6. Learning Through Action
Discovery is the core interaction primitive.

---

# 🧠 What the System Is Becoming

Even in early form, Atlas is evolving into:

- identity system (Explorer)
- memory system (Journal)
- spatial system (Museum rooms)
- interaction system (Discoveries)
- narrative system (Curator)

These together form the foundation of a **curated learning world engine**.

---

# 🚧 Current Limitations

- No real animations beyond simple transitions
- No deep interaction inside rooms (only one discovery per room)
- No structured progression system
- No adaptive learning yet
- No asset pipeline or visual system
- UI is still minimal and functional rather than immersive

---

# 🧭 Immediate Next Milestone (1.8)

## Goal: “Living Museum Rooms”

Planned upgrades:
- multiple discoveries per room
- interactive elements inside rooms (clickable objects)
- richer room traversal
- expanded Curator responses
- early sense of exploration within rooms

---

# 🧩 Open Design Questions

- How should children “move” through space eventually?
- Should rooms unlock, or always be accessible?
- Should Curator evolve personality over time?
- Should discoveries connect into a knowledge graph later?
- How visual should exploration become (2D / map / 3D-like illusion)?

---

# 📌 System Summary

Atlas is currently a:
> persistent, room-based curiosity engine with memory and narrative framing

It is NOT yet:
- a full game
- a full learning system
- or an adaptive AI experience

It is the foundation of one.