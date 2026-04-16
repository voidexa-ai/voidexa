---
name: ghai-merge-and-cockpit-fix
description: Merge /white-paper V-Bucks platform-credit content into /ghost-ai so there is one canonical GHAI page with the GHAI.jpg hero image, Fortnite-style platform currency framing, Pioneer Rewards, and fine-print link to slimmed /white-paper. Also fixes Vattalus cockpit orientation (rotation 180° off). Use this skill when merging the two GHAI pages, consolidating token messaging, adding the GHAI.jpg hero to ghost-ai, or fixing the cockpit showing pilot seat backrest instead of canopy view.
---

# GHAI Page Merge + Cockpit Orientation Fix

## Part 1 — Merge /white-paper → /ghost-ai

### Current State
- **/ghost-ai** has: GHAI.jpg hero image, "Coming Soon" badge, "Powered by GHAI", 5 Pioneer Rewards (Create account / Connect wallet / Refer friend / Upload bot / Win competition), waitlist CTA, Telegram link, "Try Void Chat" link
- **/white-paper** has: NO image, V-Bucks framing ("Platform Currency · GHAI", "$1 = 100 GHAI"), "Platform credit · Not an investment vehicle · In-ecosystem only", "Blockchain integration under review" notice, "In the full paper" teaser (Platform economy, Roadmap, Partners, Technology Stack), subscribe-for-updates email form

### Target State for /ghost-ai
A single marketing-focused page that combines both in this order:

**1. Hero section** (top of page)
- Large GHAI.jpg image (the "fucking nice picture") centered as hero
- Badge: "PLATFORM CURRENCY · GHAI"  (was "Coming Soon · Powered by GHAI")
- Title: "Ghost AI (GHAI)"
- Subtitle: "The platform currency of the voidexa ecosystem"
- One-line teaser: "Earn it. Spend it. Upgrade your experience. Something bigger is being finalized with our legal advisors."
- Primary CTA: "Try Void Chat" → /void-chat
- Secondary CTAs: "Join the waitlist" and "Telegram" (keep existing)

**2. Platform Currency Explainer** (from /white-paper V-Bucks section)
- Heading: "What GHAI is — and isn't"
- Paragraph: "GHAI is the platform currency of the voidexa ecosystem — similar in concept to in-game currencies you may have used elsewhere. GHAI is earned or purchased in fixed increments and spent inside voidexa to unlock AI compute, priority access, and seasonal content."
- Three cards grid (same style as /white-paper currently):
  - Card 1: **$1 = 100 GHAI** / "Fixed exchange rate"
  - Card 2: **Platform credit** / "Not an investment vehicle"
  - Card 3: **In-ecosystem only** / "Used for voidexa services"

**3. Pioneer Rewards** (keep from existing /ghost-ai, reword "Connect wallet")
- Heading: "Pioneer Rewards"
- Subline: "Early supporters earn more. Reward structure pending legal review — GHAI integration coming soon, subject to regulatory approval."
- Five reward cards, all with "Reward TBA" badges:
  - Create account — "Welcome bonus for new members"
  - Link your voidexa account — "Verify your identity for extra perks"  (was "Connect wallet · Verify your Solana wallet" — REMOVE Solana reference)
  - Refer a friend — "Both you and your friend earn"
  - Upload a trading bot — "Share your strategy on Trading Hub"
  - Win monthly competition — "Top ranked bot of the month"

**4. How you'll use GHAI** (new lightweight section, optional but recommended)
- Heading: "How you'll use GHAI"
- 3-4 short bullets showing concrete utility:
  - "Pay per AI session — Void Chat, Quantum debate, VoidForge generation"
  - "Unlock premium ships, cosmetics, and card packs in the voidexa universe"
  - "Priority queue access during peak hours"
  - "Seasonal content drops and pioneer-only perks"

**5. Blockchain Integration Under Review** (from /white-paper notice)
- Heading: "Blockchain integration under review"
- Paragraph: "voidexa is exploring blockchain integration for GHAI with legal advisors in Denmark. Mechanics, technical infrastructure, and distribution details will be disclosed only after regulatory review is complete. Until then, GHAI functions exclusively as a platform credit within voidexa products."

**6. Fine print footer link** (bottom of page — small text, muted color)
- Text: "Want the technical overview? Read the fine print →"
- Links to /white-paper

**7. Powered by / Try Void Chat section** (keep from existing /ghost-ai)
- "Powered by GHAI · Try Void Chat" block linking to /void-chat

### Target State for /white-paper
Slim down to a technical document page. Audience: lawyers, technical readers, partners who want depth.

Structure (prose document, no marketing hero):

**Header**
- Small label: "voidexa · White Paper"
- Title: "The infrastructure behind the universe"
- Short paragraph: "voidexa builds sovereign AI infrastructure — trading systems, encrypted communication, custom decision platforms — and a gameplay layer that fuels it all. This document outlines the stack, the mechanics, and the platform currency that powers the ecosystem."

**Platform Currency Overview** (brief — details live on /ghost-ai)
- Short paragraph restating V-Bucks framing  
- Link: "Full GHAI overview →" → /ghost-ai

**Technology Stack**
- Quantum debate engine — brief 1-2 lines
- KCP-90 compression protocol — brief 1-2 lines
- voidexa.com surface — brief 1-2 lines
- "All sovereign, all in-house"

**Roadmap**
- Short paragraph
- Link: "See Station →" → /station

**What may come later** (tentative, legal-review gated)
- Heading: "Under consideration with legal advisors"
- Short paragraph: "voidexa is working with ADVORA (Danish crypto law specialists) on the regulatory framework that would allow GHAI to extend beyond platform credit into a broader utility token. Timeline, scope, and technical details will be finalized only after legal clearance. No contract addresses, technical infrastructure, or distribution mechanics will be disclosed until that review is complete."

**Subscribe for updates**
- Keep existing email form
- Text: "Subscribe and we'll send you the full paper when it publishes — no marketing drip, just the document."

**Remove from /white-paper:**
- ❌ GHAI hero section with "$1 = 100 GHAI" cards (moved to /ghost-ai)
- ❌ "Partners" placeholder card (not ready)
- ❌ "Platform economy" teaser card (merged into /ghost-ai utility section)
- ❌ Any large visual / orb / graphic (slim document, no marketing decoration)

### Nav bar updates (if applicable)
If the nav bar has a link to /white-paper in Products or About dropdown, keep it — the page still exists, just slimmed. If there's a link to /ghost-ai too, keep both. Don't break existing routing.

### Files likely affected
- `app/ghost-ai/page.tsx` — expand with new sections
- `app/white-paper/WhitePaperPageClient.tsx` — slim down, remove GHAI hero, remove card grid
- `app/white-paper/page.tsx` — if title/metadata needs update
- Possibly new shared components if /ghost-ai gets long enough to split

### Compliance guardrails (absolute — do not violate)
When writing the new /ghost-ai content:
- ❌ Never output the word "cryptocurrency" or "crypto"  
- ❌ Never output "Solana" anywhere on /ghost-ai (was there in "Connect wallet · Verify your Solana wallet")
- ❌ Never output specific token supply numbers
- ❌ Never link to DexScreener, Raydium, Solscan, or any DEX/explorer
- ❌ Never show contract address
- ❌ Never say "Buy GHAI" in a way that implies crypto purchase — only "Top up your GHAI" (future Stripe flow)
- ✅ Always use "platform currency" or "platform token" or "platform credit"
- ✅ Always qualify blockchain mention with "exploring with legal advisors"

## Part 2 — Cockpit Orientation Fix

### Problem
User loaded qs_challenger + Vattalus fighter cockpit (fighter_light). Pilot sees the BACK of the pilot seat with dashboard panels on left/right and floor below, but no canopy view forward. Classic coordinate system mismatch.

### Fix
Edit `lib/data/shipCockpits.ts`. Find `COCKPIT_MODELS.fighter_light`. Change rotation:

```typescript
fighter_light: {
  url: '...',
  withSeat: '...',
  scale: 1.0,
  offset: [0, -0.5, -0.3],
  // OLD: rotation: [0, 0, 0]
  rotation: [0, Math.PI, 0],  // 180° around Y axis
},
```

### If that doesn't fix it
Add a dev-mode tuning helper so user can iterate live. In `components/freeflight/CockpitModel.tsx` (StandaloneCockpit branch):

```typescript
useEffect(() => {
  if (process.env.NODE_ENV === 'development' && cockpitRef.current) {
    (window as any).__cockpit = cockpitRef.current
    console.log('[voidexa] Cockpit ref exposed as window.__cockpit')
    console.log('[voidexa] Try: window.__cockpit.rotation.set(0, Math.PI, 0)')
    console.log('[voidexa] Try: window.__cockpit.position.set(0, -1.5, -0.8)')
  }
}, [])
```

This only runs in dev mode, so it doesn't affect production.

### What NOT to do for cockpit
- Do NOT modify the .glb file
- Do NOT re-run the Blender conversion script
- Do NOT re-upload to Supabase (already there, cached, 200 OK)
- Do NOT touch CC-A1 hirez_generic offset `[0, -0.8, -1.5]` — that's working
- Do NOT touch the seat-separated variant

## Build Order

1. **Git backup:** `git add -A && git commit -m "backup before GHAI merge and cockpit orientation fix" --allow-empty`

2. **Part 1a — Rebuild /ghost-ai:**
   - Expand `app/ghost-ai/page.tsx` with the target structure above
   - Keep GHAI.jpg as hero (already in /public)
   - Add V-Bucks explainer section (3-card grid)
   - Keep Pioneer Rewards section, reword "Connect wallet" to "Link your voidexa account"
   - Add "How you'll use GHAI" section
   - Add "Blockchain integration under review" notice
   - Add fine-print footer link to /white-paper
   - Keep "Powered by GHAI — Try Void Chat" block
   - Style consistent with existing voidexa dark space aesthetic

3. **Part 1b — Slim /white-paper:**
   - Edit `app/white-paper/WhitePaperPageClient.tsx`
   - Remove GHAI hero section entirely (moved to /ghost-ai)
   - Remove 3-card "$1=100 GHAI" grid (moved)
   - Keep: header, Technology Stack, Roadmap link, "Under consideration with legal advisors" section, subscribe form
   - Add link: "Full GHAI overview →" → /ghost-ai near the top

4. **Part 2 — Cockpit rotation:**
   - Edit `lib/data/shipCockpits.ts`
   - Change `fighter_light.rotation` to `[0, Math.PI, 0]`
   - Add dev-mode `window.__cockpit` helper in `components/freeflight/CockpitModel.tsx`

5. **Build check:** `npx next build` — must pass with no new errors

6. **Commit:** `git add -A && git commit -m "feat: merge GHAI pages, slim white paper, fix cockpit orientation"`

7. **Deploy:** `git push origin main`

## Success Criteria

**GHAI merge:**
- ✅ /ghost-ai has GHAI.jpg hero at top
- ✅ /ghost-ai has "$1 = 100 GHAI" V-Bucks card grid
- ✅ /ghost-ai has all 5 Pioneer Rewards (Solana reference removed from Connect wallet)
- ✅ /ghost-ai has "How you'll use GHAI" section
- ✅ /ghost-ai has blockchain-under-review notice
- ✅ /ghost-ai has fine-print link to /white-paper at bottom
- ✅ /white-paper is slim — no hero, no card grid, no image
- ✅ /white-paper has "Full GHAI overview →" link to /ghost-ai
- ✅ /white-paper has "Under consideration with legal advisors" section
- ✅ No "cryptocurrency" / "crypto" / "Solana" / contract address / supply numbers anywhere
- ✅ Grep check passes: `grep -rn "Solana\|cryptocurrency\|crypto token\|700[,.]000[,.]000\|200M\|300M burned" app/ components/ --include="*.tsx"`

**Cockpit fix:**
- ✅ Rotation changed to `[0, Math.PI, 0]` in shipCockpits.ts
- ✅ Dev-mode window.__cockpit helper added (only runs in dev)
- ✅ Build passes
- ✅ Deployed to production

## Report Back

After completion provide:
1. Confirmation that /ghost-ai has all target sections with GHAI.jpg hero
2. Confirmation that /white-paper is slimmed and no longer shows V-Bucks card grid
3. Grep results for forbidden terms (should be zero)
4. Confirmation cockpit rotation changed
5. Git push confirmation and Vercel deployment URL

User will then test:
1. Load /ghost-ai in browser, verify new layout
2. Load /white-paper, verify it's slim and has link back
3. Load /freeflight, select qs_challenger, press V, verify cockpit shows canopy view forward (not seat backrest)

If cockpit rotation is still wrong, user will use window.__cockpit console helper to find working values and report back. We then bake those final values into shipCockpits.ts in a follow-up commit.
