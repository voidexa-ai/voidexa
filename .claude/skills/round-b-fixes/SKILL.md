---
name: round-b-high-priority-fixes
description: Execute Round B of SKILL_FINAL_POLISH — six high-priority fixes that polish the visible surface of voidexa.com (homepage, shop, achievements, white paper, starter ships, galaxy footer). Use this skill when fixing the shop All tab, homepage missing sections, galaxy footer sizing, achievements visual polish, white paper GHAI section, or starter ship selection. Triggers on mentions of "Round B", "homepage sections", "shop all tab", "achievements polish", "white paper GHAI", "starter ships", or "galaxy footer" in voidexa context.
---

# Round B — High-Priority Fixes for voidexa

## Context
Six fixes from SKILL_FINAL_POLISH.md Round B. All six must build in ONE Claude Code run. Git backup before, git push origin main after. Round A already landed (cockpit, ship loader, Apps dropdown) — do not re-touch those files.

## FIX 1 — CC-A3: Shop "All" Tab

### Problem
Shop has tabs: Featured, Ships, Skins, Trails, Card Packs, Cockpits. No way to browse everything at once.

### Fix
Add "All" tab as the FIRST tab (before Featured) OR the LAST tab. Shows every shop item across all categories in the same Fortnite-style grid with pagination.

File: `app/shop/page.tsx` or `components/shop/ShopTabs.tsx`

Implementation:
- Add tab entry: `{ key: 'all', label: 'All', icon: ... }`
- When "All" selected, combine all category items into one array
- Apply same pagination (8 per page)
- Same card style as category tabs
- Sort by: Featured items first, then by rarity (Legendary → Common), then alphabetically

### Success Criteria
- "All" tab visible in shop nav
- Clicking shows every item from every category
- Pagination works (don't render 200+ items at once)
- Same visual style as other tabs

---

## FIX 2 — CC-A4: Homepage Sections

### Problem
Homepage is ONLY the star map. No content below, no product showcase, no identity.

### Fix
Add these sections BELOW the star map on the homepage (/ and /home):

**Section 1: Stats Counter (animated)**
- 4 stats in a row (or 2x2 on mobile)
- Numbers count up from 0 to target on scroll-into-view
- Values:
  - "7 active products" (or actual count)
  - "153,000+ lines of code" (or actual LOC from git)
  - "28 days since launch" (calculate from launch date)
  - "342+ tests passing"
- Style: large numbers in cyan, small label underneath, subtle background glow

**Section 2: Product Cards Grid**
- 6 cards in 3x2 grid (1x6 on mobile)
- Cards: AI Trading (LIVE), Custom Apps (BETA), AI Book Creator (IN DEV), AI Website Builder (SOON), Data Intelligence (SERVICES), AI Consulting (SERVICES)
- Each card: icon, title, short description, status badge, "Learn more →" link
- Match existing card style from /shop or /apps
- Status badges color-coded (LIVE=green, BETA=cyan, IN DEV=orange, SOON=grey)

**Section 3: "Built from Denmark"**
- Danish flag icon or subtle background element
- Heading: "Built from Denmark"
- Text: Short paragraph about digital sovereignty, solo founder, voidexa CVR 46343387
- Subtle — not overwhelming, just identity marker

**Section 4: Footer**
- Link columns: Products, Universe, About, Legal
- Social links (if any — use placeholders if not)
- Copyright: "© 2026 voidexa. CVR 46343387. Built from Denmark."
- Terms, Privacy, Cookie Policy links (placeholder pages OK)

File: `app/page.tsx` or `app/home/page.tsx` — whichever is the homepage

### Success Criteria
- Scroll down on homepage reveals new content
- Stats counter animates on scroll into view
- Product grid readable on mobile
- Footer appears at bottom with CVR

---

## FIX 3 — CC-A5: Footer Sizing on Galaxy View

### Problem
"Operating globally from Denmark. CVR-nr: 46343387" text is too large/prominent on /starmap and galaxy views.

### Fix
On /starmap and any galaxy-related view, reduce the footer text size:
- Font size: 12px (down from current)
- Opacity: 0.5
- Position: bottom-center or bottom-right, subtle

Keep homepage footer (CC-A4) at normal size — this fix only applies to immersive galaxy/starmap views where the 3D scene is the focus.

File: Find the component that renders this footer text. Might be in a global layout or a starmap-specific wrapper.

### Success Criteria
- Text present but subtle on /starmap
- Does not compete with 3D scene for attention
- Still readable if user looks for it

---

## FIX 4 — CC-A6: Achievements Visual Polish

### Problem
/achievements page looks dull compared to /shop. Achievement cards lack polish.

### Fix
Apply these to each achievement card:

**Rarity glow borders**
- Common: grey glow
- Rare: cyan glow (voidexa brand)
- Epic: purple glow
- Legendary: orange/gold glow
- Glow visible even on uncompleted achievements (at 30% opacity)

**Larger icons**
- Current icons: probably small
- Increase to 64-96px
- Add subtle background circle matching rarity color

**Gradient progress bars**
- Fill gradient: rarity color → brighter version
- Smooth animation when value changes
- Show "X / Y" text overlay

**Completed achievements**
- Gold shimmer border (animated)
- Checkmark icon in corner
- Slight scale bump (1.02x) vs uncompleted
- "Completed [date]" text

**Locked achievements**
- Dark/greyed style (opacity 0.4)
- Lock icon overlay
- Hidden description: "Complete prerequisites to unlock"

**Category headers**
- Decorative lines on left and right of heading
- Icon for category
- Count: "3 / 5 Completed"

File: `app/achievements/page.tsx` and components in `components/achievements/`

### Success Criteria
- Achievements page feels premium like shop
- Clear visual hierarchy (legendary > epic > rare > common)
- Completed vs locked vs in-progress states obvious
- Smooth animations on progress

---

## FIX 5 — CC-A7: White Paper GHAI Section

### Problem
/white-paper is a blank placeholder.

### Fix
Add content to /white-paper:

**Hero section**
- Title: "voidexa White Paper"
- Subtitle: "The infrastructure behind the universe"
- Background: subtle space gradient

**GHAI Token Section**
- GHAI token image (find in `public/images/renders/legendary/` or `public/images/ghai/`)
  - If no image exists, use a placeholder glowing orb
- Title: "Ghost AI (GHAI)"
- Stats (in a grid):
  - "700,000,000 supply"
  - "200M minted + distributed"
  - "300M burned permanently"
  - "Utility token — platform currency"
- Note box (important): "Coming soon — pending legal review by ADVORA"
- Text: Brief teaser about the utility vision

**Placeholder sections (future)**
- "Tokenomics" (coming soon)
- "Roadmap" (link to /station)
- "Partners" (coming soon)
- "Technology Stack" (brief: Quantum, KCP-90, voidexa.com)

**CTA**
- "Learn more when we launch"
- "Subscribe for updates" (email signup → Supabase waitlist_signups)

File: `app/white-paper/page.tsx`

### Success Criteria
- Page no longer blank
- GHAI image visible
- Clear "pending legal review" disclaimer
- No contract address shown
- Professional feel matching voidexa aesthetic

---

## FIX 6 — CC-A8: Starter Ship Selection

### Problem
Ship picker doesn't define which ships are FREE starters vs paid. Large bulky ships (VoidWhale, GalacticOkamoto) bad for new players — too slow for combat.

### Fix
Update ship selection in Free Flight Change Ship menu:

**Free starter ships (6 — shown as "STARTER" badge)**
- qs_bob — tiny, fast
- qs_challenger — patrol fighter
- qs_striker — attack fighter
- qs_imperial — escort
- usc_astroeagle01 — medium USC fighter
- usc_cosmicshark01 — medium USC fighter

**Display rule**
- Starter ships: green "STARTER" badge, no price, "Play now" button
- All other ships: price tag in GHAI or USD, "Locked" overlay with 🔒 icon
- Hover on locked: tooltip "Unlock in shop"
- Click locked: redirect to /shop with that ship scrolled into view

**Large ships that should be LOCKED**
- VoidWhale — Legendary tier
- GalacticOkamoto (all variants) — Legendary tier
- StarForce — Epic tier
- All Hi-Rez complete ships — Epic/Legendary

File: Component that renders Change Ship menu — likely `components/freeflight/ShipPicker.tsx`

Data source: Create or update `lib/data/shipTiers.ts` with tier definitions.

Example:
```typescript
export const SHIP_TIERS = {
  starter: ['qs_bob', 'qs_challenger', 'qs_striker', 'qs_imperial', 'usc_astroeagle01', 'usc_cosmicshark01'],
  common: [...],
  uncommon: [...],
  rare: [...],
  epic: [...],
  legendary: ['uscx_voidwhale01', 'uscx_galacticokamoto01', ...]
}

export function getShipTier(modelSlug: string): 'starter' | 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' {
  for (const [tier, ships] of Object.entries(SHIP_TIERS)) {
    if (ships.includes(modelSlug)) return tier as any
  }
  return 'common'
}
```

### Success Criteria
- New user opens Free Flight, sees 6 STARTER ships they can use immediately
- Locked ships clearly marked
- Clicking locked ship goes to shop
- No "blocky cyan column" — starter ships all load correctly (already verified in Round A)

---

## BUILD ORDER

1. Git backup: `git add -A; git commit -m "backup before Round B polish" --allow-empty`
2. Create `lib/data/shipTiers.ts` first (CC-A8 data dependency)
3. Build all 6 fixes (any order — they're independent)
4. Run `npx next build` — must pass
5. After build clean: `git push origin main`

## TESTING CHECKLIST

- [ ] /shop: "All" tab present, works, paginated
- [ ] Homepage: scroll reveals stats, products, Denmark, footer
- [ ] Homepage: stats animate on scroll
- [ ] /starmap: footer text small and subtle (not dominant)
- [ ] /achievements: rarity glows, completed shimmer, locked styling
- [ ] /white-paper: no longer blank, GHAI section visible, pending ADVORA note
- [ ] Free Flight > Change Ship: 6 STARTER ships free, others locked
- [ ] Click locked ship: redirects to /shop
- [ ] All fonts minimum 14px labels, 16px body, opacity 0.5+
- [ ] `npx next build` passes (60+ pages)

## WHAT NOT TO DO

- Do NOT touch lib/game/, lib/cards/, lib/chat/, lib/achievements/ (data layer)
- Do NOT add Danish translations (separate Cowork task)
- Do NOT build card combat entry point (Round C)
- Do NOT change cockpit code (Round A done)
- Do NOT deploy via npx vercel --prod
- Do NOT show GHAI contract address on white paper
- Do NOT say "cryptocurrency" or "crypto token" anywhere

## IF THINGS GO WRONG

- Homepage sections break star map: wrap new sections in their own container with clear separation
- Achievements glow hurts performance: use CSS `filter: drop-shadow()` instead of box-shadow
- Shop "All" tab has 200+ items: ensure pagination actually works before committing
- White paper GHAI image missing: use placeholder glowing orb with "Coming soon" text
- Starter ship tier breaks existing ship logic: add tier as ADDITIVE metadata, don't rewrite ship loading

## AFTER COMPLETION

Report back with:
1. Which fixes landed successfully
2. Screenshots or URLs to verify
3. Build time and test results
4. Any fixes that needed workarounds

Memory updates will happen in chat.
