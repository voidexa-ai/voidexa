# CLAUDE.md — voidexa-gaming

This file is loaded automatically when Claude Code runs in the `voidexa-gaming` subproject context. It tells Claude Code who it is talking to, what it is working on, what to assume, and what to never do.

## Who
Jix (Jimmi Wulff). Solo founder and CEO of voidexa (CVR 46343387), Denmark, Vordingborg. Danish, communicates in a mix of Danish and English via voice-to-text. ADHD — uses Claude as external memory. Builds everything alone with Claude Code as implementation partner, ChatGPT for specs, Gemini as backup, Quantum for multi-AI research.

## What this subproject is
The **gaming layer** on top of voidexa.com — the "fun layer" that lives on top of the existing Star System Phase 1–9 infrastructure. Includes: game modes (Speed Run, Free Run, Hauling, PvE card battle, PvP card battle, Space Defender, Break Room arcade, Quantum Live), the 40-card roster on `/cards`, card battle engine, ship roles (hauler/explorer/fighter), cosmetics economy, quest and storyline system, visual effects for ability use, and the Bob-is-the-only-free-ship progression ladder.

BWOWC is a separate confidential project. Do not import its concepts here.

## What is already built and deployed on voidexa.com
- **Star System Phase 1–9:** starmap, galaxy `/starmap`, freeflight `/freeflight`, shop `/shop`, achievements `/achievements`, chat UI, stations, warp, nebula, derelicts. 342 tests passing. Fortnite-style shop with tabs and $0.50–$10 prices.
- **`/cards` page:** 40 cards with renders. **No playable combat yet.** This is the missing layer.
- **`/assembly-editor`, `/ship-catalog`, `/control-plane`, `/claim-your-planet`, `/cards`, `/freeflight`, `/shop`, `/starmap`, `/achievements`.** 50+ pages total with 9 Danish `/dk/*` routes.
- **Vattalus cockpit live** on `/freeflight` (commit `9b3af26`, orientation fix `340d729` — rotation `[0, π, 0]`, offset `[0, -1.4, -0.3]`).
- **Ship ecosystem:** 62 ship types, 425 skins. Hi-Rez assembly parts: 16 mainbodies, 11 engines, 9 wings, 7 weapons, 5 cockpits. 689 `.glb` models on disk (6.8 GB), ~60 on Supabase Storage bucket `models`.
- **Space Defender arcade prototype** already built as a Break Room game (arrow keys + space shooter with waves, purple=30/green=20/blue=10 points).
- **Wallet + Stripe top-up working.** GHAI on-chain details scrubbed pending ADVORA MiCA review.

## Tech stack
- **Framework:** Next.js 16 on Vercel Pro
- **3D:** Three.js + React Three Fiber + drei + @react-three/postprocessing
- **State (proposed for gaming):** Zustand for UI state, XState for turn-based battle state machine
- **Backend:** Supabase EU, project `ihuljnekxkyqgroklurp`. Tables: `chat_conversations`, `chat_messages`, `user_credits`, `ghai_deposits`. New gaming tables to be added (see master doc PART 8).
- **Currency:** Platform-GHAI at $1 = 100 GHAI (V-Bucks style). Stripe-only top-up. No on-chain GHAI in gaming flows yet.
- **Models on CDN:** Supabase Storage bucket `models`. Only ~60 of 689 uploaded so far — rest is on disk.

## Working directory
`C:\Users\Jixwu\Desktop\voidexa` (same repo as rest of voidexa.com — gaming is not a separate repo).

New gaming code goes in:
- `app/game/` — game mode pages (`/game/speed-run`, `/game/hauling`, `/game/battle`)
- `components/game/` — shared battle UI, card components, HUD
- `lib/game/` — deck logic, turn engine, matchmaking, ability resolver
- `hooks/game/` — React hooks for battle state, hand, deck, presence
- `supabase/migrations/game_*.sql` — gaming-specific tables

## Deploy rule (do not forget)
`git push origin main` auto-deploys via Vercel + GitHub. **NOT** `main:master`. **NOT** `npx vercel --prod`. Auto-deploy is already wired up. Always `.trim()` Vercel env vars — they have trailing whitespace issues. Every new API route defensively trims.

## Global voidexa rules (enforced here too)
- **Font sizes:** body ≥ 16px, labels/badges ≥ 14px, opacity ≥ 0.5. Card stat numbers ≥ 18px, font-weight ≥ 500. No exceptions.
- **PowerShell chaining:** semicolons `;` not `&&`.
- **Downloads folder** is `Downloads/` (not `Overførsler/`).
- **Git backups** before installing packages, plugins, or major changes.
- **Never troubleshoot manually with Jix.** If something is broken, send the whole task to Claude Code or PowerShell — never ask Jix to edit env vars, code, or Vercel/Stripe/webapp UI by hand.
- **Listen the first time.** If Jix reports something broken, don't ask clarifying questions — fix root cause, don't go in circles.
- **Never suggest ending sessions, taking breaks, or sleeping.** Jix decides when to stop.

## Workflow rules (Jix's preferences, already enforced)
- **Full copy-paste.** Every code change delivered as complete file blocks, never "change line 42." Jix does not find lines in long files.
- **Complete plan before any build larger than a normal question.** Lay out the plan, get approval, then build.
- **SKILL.md + CLAUDE.md before every new subproject.** Done for this one.
- **One build = one command.** Ask "anything to add?" before running.
- **Two-box Claude Code invocation.** Box 1: `cd C:\Users\Jixwu\Desktop\voidexa; claude --dangerously-skip-permissions`. Box 2: the actual task. Never inline long task prompts.
- **Model pin:** `claude-opus-4-7` or current — never legacy Opus 4.

## Single source of truth for gaming decisions
`VOIDEXA_GAMING_MASTER.md` in this folder. Read it before answering anything about game modes, card mechanics, battle engine, visual effects, or MVP scope. If this `CLAUDE.md` conflicts with the master doc, the master doc wins.

## What is NOT in scope for this subproject
- Modifying the existing Star System Phase 1–9 infrastructure (those are done — we build on top, not into)
- Changing Quantum, Void Chat, Trading Hub, Control Plane, KCP-90 (those are separate products)
- BWOWC (separate confidential project)
- On-chain GHAI transactions (ADVORA pending)
- Creating new accounts, modifying share/permissions, entering financial data — those are all blocked actions per voidexa security rules

## First thing to do in any new Claude Code session here
1. `git status` and `git log -5` — know where the repo is.
2. `view VOIDEXA_GAMING_MASTER.md` — load the single source of truth.
3. Confirm the task maps to one of the 12 parts in the master doc. If it does not, stop and ask.
4. If building something new, write the plan first. Jix approves. Then one command.
