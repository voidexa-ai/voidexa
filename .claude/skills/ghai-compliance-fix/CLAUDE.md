# CLAUDE.md — GHAI Compliance Fix (Urgent)

## What This Is
Round B CC-A7 (White Paper) accidentally reintroduced specific GHAI token promises that were previously scrubbed in commit a7f30cc (April 11-12). This fix re-scrubs them before ADVORA legal review completes.

## The Problem
Current /white-paper page shows:
- "700,000,000 Total Supply" 
- "200M Minted + Distributed"
- "300M Burned Permanently"
- "Utility · Token Type — Platform Currency"
- "utility model behind GHAI"

**ALL of this violates our compliance stance while ADVORA review is pending.**

## The Agreed Strategy

Per memory #24 (GHAI Strategy April 16): Platform-GHAI is presented as V-Bucks-style platform credits. **$1 = 100 GHAI fixed**. Nothing else.

**Never say:**
- "cryptocurrency" or "crypto"
- "token" as a standalone noun (OK as "platform credit")  
- Specific supply numbers (700M, 300M burned, 200M minted, etc.)
- "Listed on exchange"
- Contract address
- Burn mechanics
- Tokenomics breakdowns

**Always say:**
- "platform credit" or "platform currency"
- "$1 = 100 GHAI"
- "Blockchain integration being explored with legal advisors"
- "Pending legal review" for anything beyond basic V-Bucks framing
- Subject to regulatory approval

## Read SKILL.md for full replacement text.

## Rules
- Git backup first
- Single file to edit: `app/white-paper/WhitePaperPageClient.tsx`
- Check other pages for leakage: /home, /token, /ghost-ai, /station, /claim-your-planet, /apps (trading, void-chat pricing)
- Deploy: `git push origin main` (auto-deploys via Vercel+GitHub)
- This is URGENT — legal exposure until fixed
