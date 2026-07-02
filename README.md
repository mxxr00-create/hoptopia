# 🐸 Lilypad OS — "The Pond"

A fan-made, browser-based replica of the **Lilypad** toy tablet's operating system
as seen in the *Toy Story 5* trailer. Built to run on an **iPad over the web** —
it's a single self-contained `index.html` (no build step, no dependencies).

## What's recreated (grounded in the trailer footage)

| Element | Source in trailer | Status |
|---|---|---|
| **Green frog tablet body** — big blinking eyes, smile, webbed feet | the physical Lilypad device | ✅ replicated |
| **Blue "Pond" OS** — bright blue background, lily pads, bubbles, top toolbar (home / volume / settings + battery) | every interface shot | ✅ replicated |
| **The Pond** (Friends/social) — "Friends" tab, "Be my friend on the Pond!", @BonnieBoo, critter avatars Heidi / Chelsea / Kara, friend-request flow + confetti, "Pond Girls" | the main demonstrated app | ✅ interactive |
| **Posts** — wooden bulletin board with pinned notes ("Save the Earth", "Cookie Sale", "NEW!") | the "POST" board shot | ✅ interactive |
| **Doodle** — drawing canvas with palette | the art/palette tile | ✅ interactive |
| **Games → Guess Who?** — the "ROUND 1–7, de-blur the toy" reveal game | the ROUND 1–7 sequence | ✅ playable |
| **Games → Bubble Pop** — 5 rounds of floating bubbles over changing pond scenes | (new, pond-themed) | ✅ playable |
| **Wallpaper** — the official "The Pond" background art | manufacturer-provided | ✅ in use |
| **Ribbit** — a kids' knock-off of Reddit (frog-themed forum) | named in the film | ✅ interactive |
| **HOPTOPIA** — a blocky 3D pond sandbox (Roblox/Minecraft-style) | original addition | ✅ playable |

### HOPTOPIA (the big one — `hoptopia.html`)
*"Hop in — build on."* A **3D blocky sandbox** inspired by Minecraft & Roblox, tuned
for little critters on an iPad. Its own self-contained file (custom WebGL voxel
engine, zero dependencies), launched from the home screen or Games menu.

- **Blocky humanoid pond critters** — play as a Frog, Toad, Tree Frog, Duckling,
  Turtle or Newt (box-rig characters with walk/jump animation).
- **A hand-of-nature world** — procedural meadow / forest / swamp / beach / pond
  biomes around the capital city **Lilyopolis** (mud lodge, lily-silk towers,
  fountain plaza, market) plus three towns: stilted **Reedville**, mushroom-house
  **Mosshollow**, and **Pebble Bay** with its boardwalk. Every structure uses
  critter materials: mud, driftwood, reeds, sand, mushroom caps.
- **Scavenging loop, zero enemies** — tap flowers, berries, sticks, pebbles,
  shells, reeds and mushrooms into your bag (they regrow); 13 friendly NPCs
  wander the towns with dialogue, fetch quests and trades that pay coins.
- **Arcade Plaza tutorial games** — step on a glowing pad to play **Lily Hop**
  (lily-pad parkour with checkpoints), **Berry Scramble** (timed picking) or
  **Firefly Chase** (catch 8 fireflies). They teach move/hop/look/collect.
- **Maker Isle — build your own game** — a private plot + a model kit (blocks,
  steps, fences, trees, ponds, huts, towers…, some unlocked with coins). Place a
  Start Pad, a Goal Flag and coins, then hit **TEST** to *play the game you made*.
- **Two paths for two kinds of kids** — "Just Explore" hides all building tools;
  "Explore + Make" adds the hammer button. Switchable any time in Pause.
- **Touch-first controls** (floating joystick + look-drag + big HOP/TALK buttons),
  full **gamepad** support, and keyboard/mouse on desktop. Progress, coins,
  quests and your Maker Isle build all save locally.
- **Play Together** (invite-only multiplayer) — host a pond and friends hop in
  with a session-only secret code. Knock-to-enter approval, room lock, kick +
  block, preset emotes only (no chat), guest building off by default. Peer-to-
  peer WebRTC with automatic fallback to a Firebase Realtime Database relay
  (REST + EventSource, no SDK); the deterministic world seed means only edits
  and positions ever cross the wire. Guests visit the host's world; approved
  guest builds persist in the host's save.

### Deployment
Pushed to GitHub → **GitHub Pages** auto-deploys `main` at
`https://mxxr00-create.github.io/hoptopia/`. Multiplayer needs the Firebase
project's Realtime Database rules (locked-down room schema) published once via
the Firebase console.

### Ribbit (the kids' Reddit)
A frog-themed forum: posts ("ribbits") in communities (p/PondLife, p/FrogFacts,
p/Tadpoles, p/BugClub, p/LilyPads, p/CritterCorner), each with up/down vote arrows
(tap to vote — counts update live), a community icon, author, comment count, and an
Award button. Sort by **Hot / New / Top**.

### Icons & audio
Every emoji in the UI has been replaced with a custom inline-SVG icon — a cohesive
set of line glyphs (volume, play, search, vote arrows, …), illustrated post-topic
icons, guess-game toy icons, camera scenes, and album covers — so the interface is
100% emoji-free. The **Tunes** app now plays real looping chiptune melodies (one per
track) synthesized with the Web Audio API.
| **Messages, Camera, Tunes, Settings** | glimpsed as icons, not demonstrated | 🟡 functional stubs |

Apps only *glimpsed* in the trailer are filled in as stubs (mock chat, a viewfinder + shutter,
a mini music player, and a partly-live Settings page with volume/brightness/sound).

## Icons

The home-screen app tiles and the friend avatars are hand-built **SVG illustrations**
(inline sprite in `index.html`), not emoji — produced with the
[`svg-creator`](https://github.com/upbrew-tech/svg-creator-skill) Agent Skill's
render-verify-fix workflow (multi-stop gradients, gloss highlights, soft colored
shadows) to better match the trailer's glossy, illustrated look:
a frog mascot for The Pond, and critter avatars (Heidi = ladybug, Chelsea = beaver,
Kara = fuzzy monster, BonnieBoo = frog).

The **Bubble Pop** game art (glossy translucent bubbles, a double-points frog, a
penalty lily pad, and five round backgrounds — Sunny, Lily, Deep, Sunset, Night) was
made the same way. Scoring: bubble **+1**, frog **+2** (double), tapping a lily pad
**−1**. The first two rounds are slow and gentle for small children; spawn rate,
size, and lily-pad frequency ramp up each round. The score HUD is a colorful chip
set (round / score / timer) with a rainbow countdown bar and animated point pop-ups.

## Run it on an iPad

**Easiest — host the folder and open in Safari:**
```bash
cd lilypad-os
python3 -m http.server 8080
```
Then on the iPad (same Wi-Fi) open `http://<your-mac-ip>:8080`.
In Safari tap **Share → Add to Home Screen** for a full-screen, app-like experience.

**Or** just open `index.html` directly in any browser, or drop it on any static host
(GitHub Pages, Netlify, etc.).

> Use **landscape** orientation for the authentic toy-tablet look. Tap the 🔊 button
> in the toolbar to toggle sound. State (friends, posts, drawings, settings) is saved locally.

*Not affiliated with Disney/Pixar — a fan tribute.*
