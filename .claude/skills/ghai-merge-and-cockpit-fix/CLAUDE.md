# CLAUDE.md — GHAI Page Merge + Cockpit Orientation Fix

## What This Is
Two fixes in one build run:

### Fix 1: Merge /white-paper platform-credit content INTO /ghost-ai
Right now /ghost-ai and /white-paper tell two different GHAI stories. User wants ONE canonical GHAI page (/ghost-ai) that combines:
- The GHAI.jpg hero visual (already on /ghost-ai, NOT on /white-paper)
- The V-Bucks "Platform Currency" framing from /white-paper ($1 = 100 GHAI)
- The Pioneer Rewards + Waitlist sections (already on /ghost-ai)
- A small "Read the fine print →" link to /white-paper in footer

/white-paper becomes a slim technical document page — no image, no marketing, just "what we might do when legal allows it."

### Fix 2: Cockpit orientation
Vattalus fighter cockpit loads on qs_challenger but pilot sees BACK of seat, not canopy. Classic Blender (+Z forward) to Three.js (-Z forward) mismatch.

Simple fix: change rotation in `lib/data/shipCockpits.ts` from `[0, 0, 0]` to `[0, Math.PI, 0]`.

## Read SKILL.md for full implementation details.

## Strategic Context

**GHAI strategy (agreed April 16):**
- Public-facing: V-Bucks / Fortnite platform credit ($1 = 100 GHAI fixed)
- Hidden: Solana SPL token exists, ADVORA reviewing MiCA compliance
- When ADVORA clears → same page, upgraded framing (same /ghost-ai URL, just different sections shown)

**What MUST NOT appear anywhere on public pages:**
- Contract address (Ch8Ek9PT...)
- Words "cryptocurrency" or "crypto"
- Specific supply numbers (700M, 300M burned, 200M minted, 50M pool, 1B total)
- DEX links (Raydium, DexScreener, Solscan)
- "Buy on Solana" or similar exchange CTAs
- Burn mechanics, mint authority, token address

**What CAN appear:**
- "Ghost AI (GHAI)" brand name
- "$1 = 100 GHAI" fixed exchange rate
- "Platform currency" / "platform token" / "platform credit"
- "Pioneer rewards — structure pending legal review"
- "Blockchain integration being explored with legal advisors"
- "Future utility expansion under legal review"
- GHAI.jpg image as hero

## Rules
- Git backup first
- Build must pass: `npx next build`
- Deploy: `git push origin main`
- Do NOT touch /claim-your-planet, /home, /station — they're already compliant
- Do NOT re-upload cockpit .glb (just transform change)
- Do NOT touch VoidForge or Assembly Editor
