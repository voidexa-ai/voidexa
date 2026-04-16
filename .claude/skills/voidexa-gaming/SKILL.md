---
name: voidexa-gaming
description: |
  Apply this skill whenever working on the voidexa.com gaming layer — the "fun layer" on top of the existing voidexa star system, monetized with Platform-GHAI ($1 = 100 GHAI V-Bucks style). Trigger words: game mode, speed run, free flight, free run, hauling, card battle, turn-based combat, PvE, PvP, deck, card play, card effect, card ability, battle scene, boss fight, ship role (hauler/explorer/fighter), skins, cosmetics, power-up (Mario Kart style bomb/shield/boost during flight), PvP dome, arena, quest, storyline, progression, onboarding, Space Defender, Break Room arcade, Quantum Live show, Claim Your Planet quest, achievement-unlocked ship, Bob free ship, Vattalus cockpit, immersive HUD, ship tagger, /cards page, 40 cards, /shop, /assembly-editor, /ship-catalog, /freeflight, /starmap. DO NOT trigger this skill for BWOWC — that is a separate confidential project. DO NOT trigger for pure Star System structure work (Phase 1–9 galaxy/stations/warp/nebula/derelicts) unless it is explicitly the gaming layer on top.
---

# voidexa-gaming — the fun layer on top of the star system

## What this skill is for
voidexa.com has a working Star System (Phase 1–9 done: starmap, galaxy, freeflight, shop, achievements, chat UI, stations, warp, nebula, derelicts). On top of that sits the **gaming layer** — the playable, monetizable, story-driven part. This skill governs all decisions about game modes, cards, combat, quests, ship roles, cosmetics, visual battle effects, and monetization tied to the fun layer.

## Hard boundaries
- **BWOWC is excluded.** If a request overlaps conceptually with BWOWC (Heroes-of-Might-and-Magic style hex-grid, Solana smart contracts, AKE/AKEIG tokens, full MMO), stop and confirm whether it belongs to BWOWC or voidexa-gaming. BWOWC is its own repo/scope under `C:\Users\Jixwu\Projects\apps\ideas\crypto-gaming\`.
- **Star System infrastructure is not gaming.** Stations, warp physics, nebula rendering, derelict spawning — those are Star System Phase 1–9 work. This skill only applies when those assets are being *used* for gameplay (e.g. a derelict becomes a quest location; a station becomes a shop hub).
- **Platform-GHAI only.** All in-game currency is Platform-GHAI at fixed $1 = 100 GHAI V-Bucks rate. Never design a second in-game token. Never mention on-chain GHAI in gaming flows — that is pending ADVORA MiCA review.
- **No copyrighted IP.** No Fortnite characters, no Mario, no Hearthstone card names, no Slay the Spire relics verbatim. Patterns and mechanics are fine; names and assets are not.

## Core principles (non-negotiable)
1. **Bob is the only free ship.** Elite-Dangerous-style: you start in Bob, everything else is earned or bought. Achievement-unlocked ships and paid ships coexist — never put the same ship behind both.
2. **Ships live in the real 3D world during card battles.** Cards render as 2D panels *beneath* or *in front of* the ship. The ship is not replaced by a card-only screen. Turn-based logic runs in React state; the 3D scene stays alive.
3. **PvP is bounded by an invisible dome.** When two players enter PvP, both teleport to the nearest arena. The dome is transparent to outsiders — they can fly past and watch. Combatants cannot leave until the match resolves.
4. **Ship roles justify different stats beyond PvP.** Hauler, Explorer, Fighter. Each has a dominant stat (cargo, scan range, weapons). PvP is not the only way to get value out of a ship.
5. **Speed Run is the first game mode we ship.** Not card battle. Speed Run proves the 3D pipeline handles gameplay without requiring the full card engine.
6. **Hauling between planets is the second game mode.** Proves the economy loop (earn → spend on cosmetics or ship upgrade) without PvP risk.
7. **Card battle (PvE) is third.** First boss on a derelict ship. PvP card battle is fourth.
8. **Transparency rule.** All voidexa AI/gaming products are transparent about using Claude/GPT/Gemini APIs underneath. Sell orchestration and experience, not API access. "Powered by [providers] — orchestrated by voidexa" where relevant.

## Monetization defaults for gaming
- Skins: 50–500 GHAI ($0.50–$5) — most sold tier.
- Legendary ships / full aircraft: 1000–5000 GHAI ($10–$50).
- Power-ups consumable during Speed Run / Free Flight: 5–25 GHAI per charge.
- Pioneer reward ships and quest-reward ships are free — never offered for GHAI.
- Battle Pass-style seasonal track: 500 GHAI one-time, rewards across 60 levels.

## Tech stack this skill assumes
- Next.js 16 on Vercel Pro (auto-deploy: `git push origin main`)
- Three.js + React Three Fiber for 3D (star map, free flight, battle scene)
- drei + @react-three/postprocessing for bloom/effects
- Zustand for client state (turn state, hand, deck, board)
- XState for turn-based battle state machine (proposed — see master doc PART 8)
- Supabase EU (`ihuljnekxkyqgroklurp`) for persistence, realtime presence, matchmaking queue
- 689 `.glb` ship models on disk (6.8 GB), ~60 on Supabase Storage bucket `models`
- 40 card renders already on `/cards` — no combat engine yet

## Font and opacity rule (applies to every gaming UI)
- Body text minimum 16px
- Labels and badges minimum 14px
- Opacity minimum 0.5 for any text
- Card stat numbers: minimum 18px on the card face, never thinner than font-weight 500

## Deploy rule for gaming pages (same as rest of voidexa)
`git push origin main` auto-deploys via Vercel + GitHub. **NOT** `main:master`. **NOT** `npx vercel --prod`. Always `.trim()` Vercel env vars defensively — they have trailing whitespace.

## When to reach for the master doc
Any question that touches game modes, cards, battle, quest system, ship roles, visual effects for abilities, engine architecture, or the MVP roadmap — read `VOIDEXA_GAMING_MASTER.md` before answering. That doc is the single source of truth. If the master doc disagrees with something in this SKILL, the master doc wins and this SKILL should be updated.

## What "done" looks like for the MVP
- Bob flies (already done in `/freeflight` with Vattalus cockpit, commits `9b3af26` + orientation fix `340d729`)
- One Speed Run track live, GHAI leaderboard, best time saved in Supabase
- One hauling run: pick up cargo on Planet A, deliver on Planet B, earn GHAI
- One PvE card battle against a single derelict boss using 8 of the 40 existing cards
- Shop sells one Bob skin at 100 GHAI and one consumable power-up at 10 GHAI
That is the slice that proves the full loop.
