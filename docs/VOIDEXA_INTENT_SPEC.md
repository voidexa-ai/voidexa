# VOIDEXA_INTENT_SPEC.md
## The canonical intent specification — April 17, 2026

**Purpose:** This is the Single Source of Truth for what voidexa.com SHOULD be. It supersedes implementation details in V3 where Jix has confirmed updated intent (April 17, 2026 conversations). The build is audited against this document.

**Companion documents (do not conflict, this supersedes on overlap):**
- `docs/VOIDEXA_GAMING_COMBINED_V3.md` — gameplay mechanics, zones, cards, ship classes, tech stack
- `docs/VOIDEXA_UNIVERSE_CONTENT.md` — landmarks, NPCs, encounters, quest chains
- `docs/POWER_PLAN.md` — sprint chain executed April 17

---

## 1. CORE IDENTITY

**voidexa is a playground, not a game.** A digital third place — after home and work. Visitors come back because they belong, not because they grind.

**Single city, six roles (NOT six products):**
- Quantum + Void Chat = workshop (AI tools for work)
- Claim Your Planet = ownership (companies build here)
- Gaming layer = playground (play when not working)
- Break Room = social house (hang out, planned)
- Quantum Live = community time (weekly AI debate show)
- Trading Hub = marketplace (commerce)

**Design principles:**
- Short sessions (15–30 min completable)
- Horizontal progression (no grind, you become more established)
- No mandatory grind
- Gaming is NOT the main attraction
- Universe rewards curiosity
- Product transparency: all voidexa AI products show "Powered by Claude + GPT + Gemini — orchestrated by voidexa"

---

## 2. HOMEPAGE — THE ONBOARDING CINEMATIC

### Current status
**BROKEN / does not match intent.** Current homepage is a static shuttle parallax image with 4 glassmorphism cards in 2×2 grid BELOW the hero. This was built because `docs/gpt_keywords_homepage.md` was corrupt (UTF-16 PowerShell artifact) when Sprint 8 ran. It is a fallback. Must be replaced.

### Intent (the correct homepage)

**Homepage is NOT a scrollable page. It is ONE page running a 45-second cinematic film.**

The film is a continuous Three.js realtime 3D scene (NOT an AI-generated video). It uses React Three Fiber and reuses existing voidexa starmap assets. The film runs automatically when the user lands on voidexa.com. It cannot be scrolled. The entire homepage is the film + the end-state overlay.

### Film sequence (45 seconds)

**Seconds 0–8 — Approach:**
Camera is outside voidexa Galaxy. Distant stars, faint nebula, voidexa visible as a small light point. Inside the shuttle, pilot silhouetted in the front seat. Stars drift past the panorama windows.
Voiceover begins: *"Welcome to voidexa. This is not just a website — it's a universe we built."*

**Seconds 8–12 — Warp transition:**
Warp effect triggers. Blue tunnel, starlines, shuttle accelerates. Voiceover pauses, lets visuals speak. Reuses warp shader assets from the existing /freeflight warp system.

**Seconds 12–25 — Arrival at voidexa Galaxy:**
Warp ends. The shuttle is now inside voidexa Galaxy. Through the windows: voidexa star central, Claim Planet in the distance as a mysterious distant sphere at the edge, constellation hints. This view matches exactly what the user sees in Level 1 Galaxy View on /starmap when they later explore (consistency is mandatory).
Voiceover: *"Out here, companies can claim their own planet and build their presence. Your business in the stars."*

**Seconds 25–35 — Door opening:**
Camera rotates inside the shuttle toward the rear cargo door. The door begins opening slowly downward. Light from the galaxy floods into the dark cabin.
Voiceover: *"We build websites, custom apps, AI tools — the things that make your business fly."*

**Seconds 35–42 — Reveal:**
Door is fully open. Through the door frame: voidexa Galaxy view. voidexa star central, Claim Planet visible, subtle silhouettes of gaming landmarks (Hive distant mass, racing track faint glow, Break Room station) hint at "there is more inside voidexa system." Not detailed — just suggestion of scale.
Voiceover: *"And if you want to explore the universe itself — fly a ship, collect cards, race against pilots — free flight is one click away."*

**Seconds 42–45 — Interactive end-state:**
Camera freezes. The freeze-frame composition is the canonical homepage end-state. Four black semi-transparent boxes fade in as a 2×2 grid overlaid ON the freeze-frame (NOT below, NOT beside). "Enter Free Flight" CTA button appears at the bottom.
Voiceover: *"Website Creation. Custom Apps. Universe. Tools. Or press Enter Free Flight to jump right in."*

### Skip button

A "Skip" button is visible in the top-right corner from second 3 onwards. Clicking Skip:
- Jumps video to second 42 (freeze frame)
- 4 boxes already visible
- Voiceover stops immediately
- No second asset — freeze frame IS the skip destination

### Voiceover technical

- Auto-starts on page load (muted first, browser autoplay policy; small "unmute" prompt for first 2 seconds)
- Generated via Eleven Labs (single voice, calm confident tone — like a friend showing their workshop)
- Saved as `public/audio/homepage-voiceover.mp3`
- Tone: welcoming, NOT corporate

### The 4 panels (end-state overlay)

2×2 grid, black semi-transparent boxes, each panel contains icon + title + 1-line description + CTA:

| Panel | Title | Description | CTA | Route |
|-------|-------|-------------|-----|-------|
| Top-left | Website Creation | From sketch to live in days. | Explore | /products |
| Top-right | Custom Apps | Bespoke solutions for any business. | Explore | /apps |
| Bottom-left | Universe | A living sci-fi world to explore. | Enter | /starmap |
| Bottom-right | Tools | AI tools ready to use now. | Try | /tools |

**"Enter Free Flight" button** — separate from 4 panels, positioned below them. Goes directly to /freeflight with a 2–3 second warp-loading transition ("Requisitioning your ship from docking bay...").

### What must NOT be on the homepage

- Scrollable sections
- KCP-90 terminal window (belongs on starmap, not homepage)
- "What we build" prose sections
- Product grid below hero
- Stats counters
- Footer links (nav footer OK; product marketing footer NO)

### Fallback during Three.js scene construction

While the Three.js scene is being built (1–2 Claude Code sessions), a temporary fallback can use:
1. Runway-generated 15-second clip (Jix has 500 credits) as intro
2. Static freeze-frame image with 4 boxes for skip/after-clip state

Fallback is TEMPORARY. Target is full 45-sec Three.js scene.

---

## 3. UNIVERSE ARCHITECTURE

### Three zoom levels (V3 Part 1)

**Level 1 — voidexa Galaxy View:**
- Top-level overview
- voidexa = central sun (biggest, brightest)
- Company planets orbiting (business customers)
- "Claim Your Planet" as mysterious distant planet at edge
- Constellation grouping by industry
- Zoom-based reveal (far = dots, medium = shapes + labels, close = full detail)
- **Search/directory sidebar MANDATORY** for non-visual navigation
- Filter by industry, Gravity Score, trade activity
- Deliberately sparse — mysterious, "more than just voidexa but you can't see it all yet"

**Level 2 — voidexa Star System (when zoomed into voidexa):**
- Entered via zoom transition (2–3 sec Three.js animation, NOT cut)
- This is where gaming landmarks live: voidexa Hub, racing track, PvP zones, Hive structure (distant silhouette at first), Break Room station, abandoned stations, derelicts
- User discovers "there's a whole amusement park inside voidexa"
- "Enter Free Flight" CTA available from this level
- "Back to galaxy" button returns to Level 1

**Level 3 — Page Surface:**
- Click a product planet → land on that page (/products, /apps, /tools, etc.)
- Already works

### Zoom transition (Level 1 → Level 2)

One continuous Three.js scene with camera zoom animation — NOT separate scenes with cut. Feels like Google Maps universal zoom. 2–3 seconds, smooth.

### Holographic Universe Map

- Player-facing 3D sphere showing the universe
- Personal fog-of-war: shows ONLY places the user has visited
- Unvisited space = dark
- Two players at same hologram see different maps (veteran bright, newbie dark)
- Accessible from: every station + ship cockpit (smaller HUD version) + dedicated holo-map page
- Scanner resolution by ship class: Explorer 8 units, Fighter/Hauler/Salvager 4, Bob 3
- Status: NOT BUILT, Post-MVP in V3 but part of intent

### Universe scale (V3 Part 2)

- 1 hour travel time in all directions from voidexa Core
- Genuine 3D sphere, NOT 2D map with skybox
- 360° in every axis

### Zones

| Zone | Travel | Content | Risk |
|------|--------|---------|------|
| Core | 0–5 min | voidexa Core, stations, tutorial, Break Room | Safe |
| Inner Ring | 5–15 min | Claimed planets, trade routes, moderate missions | Low |
| Mid Ring | 15–30 min | Unclaimed planets, derelicts, PvE 1–3 | Medium |
| Outer Ring | 30–45 min | Rare resources, high-risk hauling, PvE 4–5 | High |
| Deep Void | 45–60 min | Mythic encounters, The Silent Ones, The Edge | Very High |

### Tone (locked)

- Primary: No Man's Sky (hopeful, curious, exploration-driven)
- Secondary: Firefly (warm, human, your ship is your home)
- Seasoning: Guardians of the Galaxy (humor through Cast)
- Visual: Elite Dangerous aesthetics only (bloom, space rendering)
- REJECTED: Elite Dangerous coldness, Star Citizen corporate-grim

---

## 4. STARMAP (/starmap)

### Current status
**INCOMPLETE.** Shows only 2 nodes (voidexa + Your Planet). Missing: search sidebar, company planets, gaming landmarks in Level 2, zoom transition, Holographic Map access.

### Intent

- Landing on /starmap defaults to Level 1 voidexa Galaxy View
- Left sidebar has search input (MANDATORY, currently missing) + filter by industry/Gravity/trade
- Double-click voidexa planet → zoom to Level 2
- Level 2 shows gaming landmarks: voidexa Hub, racing track, PvP zones, Hive silhouette (distant), Break Room station, stations
- "Enter Free Flight" CTA on Level 2
- KCP-90 terminal panel ONLY on first starmap page view (Level 1) — matrix-style, promotional
- Holographic Map button accessible from Level 2 cockpit HUD area

---

## 5. FREE FLIGHT (/freeflight)

### Current status
**WORKS.** Tutorial loads, encounters fire, docking works, warp map opens. Issues:
- Warp locked for new users (0 GHAI, can't afford any destination — blocks tutorial completion)
- Warp Gate has white placeholder texture (missing 3D asset)
- Encounters show "+20 GHAI" reward (that's fine per current GHAI policy, see section 8)
- Console error: `AbortError: Lock broken` on load (Supabase auth double init)

### Intent (V3 Part 3 + 6)

**Cockpit:**
- First-person cockpit + third-person chase cam (V to toggle)
- Holographic cockpit HUD = blue orb style, transparent
- Displays: speed, nearest planet, health/shield bars, rank badge, energy meter, card hand, alien tech status, PvP toggle

**Controls:**
- WASD + mouse look (first person) / mouse aim (third)
- Shift = boost, Space = brake, V = camera toggle
- Q = use power-up / play card
- Right-click on player = interaction menu (duel, trade, PM, view profile)

**Universe content layers:**
- Layer 1 (always loaded): planets with type-specific textures, sun, nebula, stars, company planets with labels
- Layer 2 (Free Flight only): asteroid belts, debris fields, nebula zones, derelicts, warp gates, beacons, minefields, alien tech spawns, card drops, power-up spawns

**Ship classes (5):**
Fighter (30/70 HP, Double Fire Rate 3s), Cruiser (50/100, Repair Drone 20 shield), Stealth (20/60, Cloak 4s), Tank (80/170, Fortress Mode 50% DMG reduction), Racer (15/50, Afterburner 3s)

### Fixes needed

- **Starter GHAI grant:** 100 GHAI on first signup so tutorial completable
- **OR:** Tutorial warp (Bob's First Loop) is free-cost for new pilots
- **Warp Gate texture:** Replace white placeholder with real GLB
- **Supabase Lock error:** Fix double client init

---

## 6. CARDS (/cards)

### Current status
**REGRESSION.** Shows old 40-card core set with ship 3D renders, Tactical/Deployment/Alien types, dust/disenchant/craft/fuse economy. The 257 rendered PNG cards with v3 frames and inline keywords (deployed to `public/cards/rendered/*.png` on CDN) are NOT wired to any route. Sprint 10 was skipped, so UI was never updated.

### Intent

- /cards displays the 257 rendered PNG cards (not 40 ship renders)
- Cards use v3 rarity frames (silver/teal/blue/purple/gold/prismatic)
- Inline keyword definitions visible on cards (e.g., "Apply Burn (2 dmg/turn, 3 turns)")
- Core Set v1 launch = 40 cards (the 40 shown) as introductory deck
- Full library = 280 cards total (257 rendered + 23 to render later + future expansions)
- Card categories: Attack (80), Defense (65), Tactical (65), Deployment (50), Alien (20)
- Dust/Craft/Fuse economy: remains (it's correct, not a regression) — Disenchant Common → 5 Dust, Legendary → 1600; Craft Common 30 Dust, Legendary 6400; Fuse 2 same-rarity → 1 next-rarity
- Keywords library: 15 base (Burn, Jam, Exposed, Block, Exhaust, Siphon, Overcharge, Pierce, Regen, Cloak, Disable, Drain, Fortify, Reboot, Salvage) + 15 MTG-style (System Reboot, Cold Boot, Hot Deploy, Priority Fire, Cascade, High Orbit, Tracking Lock, Critical Breach, Auto-Repair Protocol, Hull Siphon, Persistent Systems, Stealth Coating, Hardened Core, Emergency Launch, Twin Barrels)

### Fix needed

- Sprint 13 or similar: wire `/cards` route to display 257 rendered PNG cards from `public/cards/rendered/`
- Filter/search by type, rarity, keyword
- Dust/Craft/Fuse UI stays

---

## 7. SHOP (/shop)

### Current status
**MOSTLY WORKS.** Fortnite-style tabs (All/Featured/Ships/Skins/Trails/Card Packs/Cockpits) render correctly. Starter Pack $1.99 visible. Problem: Stripe checkout disabled — button shows "COMING SOON · STRIPE" on all products.

### Intent (V3 Part 5 + 8)

- Fortnite-style shop rotation
- Daily: 4–6 items rotate every 24h
- Weekly: 2–3 premium items
- Seasonal: new theme monthly (pirate, military, alien, cyberpunk)
- Limited: announced 48–72h only, NEVER return
- Shop pricing: Common skin $1–2, Attachment $2–5, Full ship skin $5–10, Premium effect $5–10, Epic ship $10–20, Limited bundle $15–25
- Card packs: Standard $2, Premium $5, Ultimate $10, Legendary $20 (max 1/week)

### Fix needed

- Wire Stripe checkout on ALL shop products (wallet top-up already works — extend same flow)
- Remove "COMING SOON" state

---

## 8. GHAI POLICY (CLARIFIED)

**Platform-GHAI (in-game currency) = V-Bucks model. ACTIVE.**
- $1 USD = 100 GHAI fixed
- Top-up via Stripe ($5, $10, $20, $50)
- Used for: warp costs (5–30 GHAI), space taxi (50–150 GHAI), mission rewards, encounter choices, quest chain rewards, ship recovery
- Purely fictive in-game currency, NO real-world value
- Visible throughout game — this is CORRECT and NOT a bug

**Crypto-GHAI (Solana token, separate project) = PARKED.**
- On hold pending ADVORA legal review
- 200M on Ledger, 300M burned, 50M in Raydium pool
- Mint authority revoked
- Contract: Ch8Ek9PTbzSGdL4EWHC2pQfPq2vTseiCPjeZsAZLx5gK
- Kept as "coming soon" teaser only
- NOT the same thing as Platform-GHAI

**These are two different things. Do not conflate them in audits or UI.**

---

## 9. THE HIVE

### Status
NOT BUILT. Designed in V3. Major 3D modeling project.

### Visual spec

**From distance (>5 units):** Dark irregular mass with faint amber/cyan light leaking from holes. Silhouette against starfield. Mysterious.

**Approach (<5 units):** Holes become visible. Light trails from pilots inside. Structure detail resolves — rocky, organic, petrified coral in space.

**Inside:** Bioluminescent walls (soft cyan/amber glow). Narrow passages opening into large chambers. Floating debris. Stalactite formations. Deepest chamber = glowing core (lore object, potential boss lair).

**Collision:** Sparks + hull damage. Not instant death. Wreck risk in Needle-class tunnels only.

**Placement:** Visible as distant silhouette from Level 2 starmap. Full access requires flying there in free flight.

---

## 10. HOMEPAGE CHAT BUBBLES

### Current status
Two chat bubbles present: Universal chat (bottom-left) and Jarvis/AI chat (bottom-right). BOTH WORK per Jix confirmation.

### Intent
- Keep both on homepage
- Keep on all pages (global availability)
- Universal chat = Void Chat (multi-AI)
- AI button = Jarvis (voidexa assistant)

---

## 11. LOADING TRANSITIONS

### "Enter Free Flight" transition

2–3 second loading screen between homepage and /freeflight:
- Text: "Requisitioning your ship from docking bay..."
- Subtle progress indicator or rotating ship silhouette
- Background: dark with subtle warp shader hint
- Actual game assets load during this time
- Feels like lore, not technical waiting

### Warp transitions (in-game)

When user warps station-to-station in /freeflight:
- Hold F to initiate
- Blue warp tunnel effect (same shader used in homepage film)
- 3–5 second duration
- Arrive at destination with smooth deceleration

---

## 12. TECHNICAL STACK (V3 Part 12, LOCKED)

- Next.js 16 on Vercel Pro
- Auto-deploy: `git push origin main` (NOT `main:master`, NOT `npx vercel --prod`)
- Three.js + React Three Fiber + drei + @react-three/postprocessing
- Zustand for client state
- XState for turn machine (proposed for card combat)
- Supabase EU (`ihuljnekxkyqgroklurp`) for persistence, realtime, matchmaking
- 689 .glb on disk, ~60 on CDN bucket `models`
- Claude API: `claude-opus-4-7` (Opus 4.6 is deprecated, do not use)
- All env vars MUST `.trim()` (Vercel has trailing whitespace issue)
- Font rules: body ≥16px, labels ≥14px, opacity ≥0.5 — on every page without exception

---

## 13. CURRENT BUILD STATE (as of April 17 audit)

### Live and working
- Homepage (wrong design, see section 2)
- /freeflight (with fixable issues, see section 5)
- /starmap (incomplete Level 1 only, see section 4)
- /shop (Stripe checkout not wired, see section 7)
- /cards (shows old 40-card system, see section 6)
- /achievements (23 achievements, locked status, works)
- /control-plane (admin)
- /claim-your-planet (works)
- /assembly-editor, /ship-catalog, /admin/ship-tagger (admin tools)
- Wallet + Stripe top-up (works)
- Universe chat + AI chat bubbles (works)
- 50+ pages total, 9 Danish routes
- 642 tests green (after Sprint 12)
- Tag: `mvp-launch-ready` pushed

### Built but not wired to UI
- 257 rendered cards on CDN (no route displays them)
- 67 sounds in docs/sounds/ (not renamed to clean names, not wired to gameplay events)
- Gemini universe content (80 landmarks, 45 encounters, 20 NPCs, 15 quest chains — imported but may not be fully integrated)

### Not built
- Homepage cinematic (this spec, section 2)
- Level 2 star system zoom
- Starmap search sidebar
- Holographic Universe Map
- The Hive 3D structure
- Starter GHAI grant / free tutorial warp
- Shop Stripe checkout wire-up
- Break Room
- Quantum Live
- PvP card battle, Void Duel, Void Prix
- Player trading marketplace
- AI-generated quests
- voidexa Artifacts
- Mobile responsive test (done in Sprint 11 but post-sprint verification needed)

---

## 14. CONFLICTS TO RESOLVE (noted, not fixed by this doc)

1. **Homepage design:** current build (parallax + 4 cards below) vs. intent (45-sec Three.js cinematic). This doc resolves: build the cinematic.
2. **GHAI visibility:** V3 Part 13 says "scrubbed pending ADVORA." V3 Part 12 says "Platform-GHAI: $1 = 100 GHAI." Resolution in section 8: Platform-GHAI ON, Crypto-GHAI OFF. They are different things.
3. **Cards count:** /cards shows 40, renders exist for 257. Resolution: /cards displays 257 rendered PNGs. 40 was the original Core Set v1 launch plan, superseded by expansion.

---

## 15. BUILD PRIORITY (for next sprint after audit)

**Priority 1 — Homepage cinematic (Sprint 13)**
- Three.js 45-sec scene
- Eleven Labs voiceover
- 4 overlay boxes + Enter Free Flight CTA
- Skip button
- Replace current parallax homepage

**Priority 2 — Cards UI wire-up (Sprint 14)**
- Wire /cards to display 257 rendered PNGs
- Keep dust/craft/fuse economy
- Add filter/search

**Priority 3 — Starter experience fixes (Sprint 15)**
- 100 GHAI starter grant OR free tutorial warp
- Starmap search sidebar
- Warp Gate texture
- Supabase Lock error fix

**Priority 4 — Shop Stripe wire-up (Sprint 16)**
- Enable Stripe checkout on all shop products
- Remove "COMING SOON" states

**Priority 5 — Level 2 starmap + zoom (Sprint 17)**
- Three.js zoom animation Level 1 → Level 2
- Populate Level 2 with gaming landmarks (silhouettes)
- Move KCP-90 terminal to Level 2 only

**Priority 6+ — Everything else from section 13**

---

## END OF INTENT SPEC

This document is the canonical source for what voidexa.com should be. When it conflicts with older specs, this wins. When implementation conflicts with this, implementation is wrong.

**Last updated:** April 17, 2026  
**Author:** Jix + Claude (synthesized from V3 + April 17 conversations)  
**Next review:** after Chrome extension audit completes
