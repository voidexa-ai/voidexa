# SKILL: voidexa Final Polish — 28 Issues
**April 15, 2026 — Post-Audit Consolidated Fix Plan**

---

## CLAUDE CODE TASKS (14 tasks)

### CC-A1: Cockpit Interior Repositioning [CRITICAL]
The cockpit interior model renders IN FRONT of the camera, blocking the pilot's view. Fix:
- Move interior model DOWN (y) and BEHIND (z) so dashboard is BELOW eye level
- Cockpit frame at screen EDGES only — canopy window must be clear center view
- Camera sits INSIDE cockpit looking FORWARD through glass
- Test with all 5 cockpits (cockpit01-05)
- All 5 cockpits must be selectable in Change Cockpit menu

### CC-A2: Ship Model Loading Fallback [CRITICAL]
Ship sometimes appears as blocky cyan column instead of textured model.
- Add proper loading state: show wireframe silhouette while Supabase CDN loads the .glb
- Add retry logic if fetch fails (3 attempts, 2s delay)
- If all retries fail, show a clean placeholder with "Loading ship..." text

### CC-A3: Shop "All" Tab [HIGH]
Add an "All" tab to shop that shows every item across all categories. Place it as first or last tab.

### CC-A4: Homepage Sections [HIGH]
The homepage is ONLY the star map. Add below the star map:
- Stats counter section (animated): "X projects built", "153,000+ lines of code", "28 days since launch", "7 active products"
- Product cards grid (6 cards): AI Trading, Custom Apps, AI Book Creator, AI Website Builder, Data Intelligence, AI Consulting — matching the Products dropdown
- "Built from Denmark" section: Danish flag icon, text about digital sovereignty, voidexa CVR
- Footer with links to all main pages

### CC-A5: Footer Sizing on Galaxy View [HIGH]
"Operating globally from Denmark. CVR-nr: 46343387" text is too large/prominent on /starmap. Reduce font size to 12px and opacity to 0.5 on starmap/galaxy pages.

### CC-A6: Achievements Visual Polish [HIGH]
Achievements page looks dull compared to shop. Apply:
- Rarity glow borders on achievement cards (same style as shop)
- Larger achievement icons
- Progress bar with gradient fill
- Completed achievements: gold shimmer border
- Locked achievements: dark/greyed with lock icon
- Category headers with decorative lines

### CC-A7: White Paper GHAI Section [HIGH]
/white-paper is a blank placeholder. Add:
- GHAI token image (use render from public/images/renders/legendary/)
- "Coming soon — pending legal review by ADVORA" text
- Brief teaser: "200M tokens minted. 300M burned. Utility token for the voidexa ecosystem."
- "Learn more when we launch" CTA

### CC-A8: Starter Ship Selection [HIGH]
Update ship picker to offer these 6 FREE starter ships (small, agile, combat-ready):
- qs_bob (Starter — tiny, fast)
- qs_challenger (Patrol fighter)
- qs_striker (Attack fighter)
- qs_imperial (Escort)
- usc_astroeagle01 (Medium fighter)
- usc_cosmicshark01 (Medium fighter)
Large ships (VoidWhale, GalacticOkamoto, StarForce) should show as LOCKED with price tag.

### CC-A9: Card Combat Entry Point [MEDIUM]
Players can see cards but cannot start combat. Add:
- "Battle" button on /cards page → starts PvE match vs random NPC deck
- In Free Flight ESC menu: add "Card Battle" option → starts PvE match
- Combat uses CombatUI.tsx already built — just wire the entry points

### CC-A10: Planet Collision [MEDIUM]
Ship flies through planets. Add collision spheres matching planet visual radius. Ship bounces off on contact.

### CC-A11: Q/E Roll Thrusters [MEDIUM]
- Q key: roll ship left (counter-clockwise)
- E key: roll ship right (clockwise)
- Smooth rotation animation
- Side thruster glow effect during roll

### CC-A12: Free Look Lock [MEDIUM]
- Currently: hold RMB to orbit camera, release = snaps back
- Change: release RMB = camera STAYS at that orbit position
- Middle mouse button OR double-tap RMB = reset to default behind-ship view

### CC-A13: Deck Builder Load Button [MEDIUM]
Replace combobox deck selector with explicit "Load Deck" and "Save Deck" buttons side by side.

### CC-A14: Chat Bubble HUD Overlap [LOW]
The chat bubble icon in bottom-left overlaps the hull/shield HUD in bottom-right. Move chat bubble to NOT overlap any HUD elements. In cockpit mode, hide the bubble entirely (WoW-style strip replaces it).

---

## COWORK TASKS (6 tasks)

### CW-A1: Danish Star Map Labels [HIGH]
Translate all star map node labels to Danish on /dk/:
- "Sovereign AI Infrastructure" → "Suveræn AI-infrastruktur"
- "Autonomous Bot Systems" → "Autonome botsystemer"
- "Secure Tools · Private by Design" → "Sikre værktøjer · Privat fra design"
- "Multi-AI Orchestration Suite" → "Multi-AI orkestreringsplatform"
- "Custom AI · Data Intelligence" → "Tilpasset AI · Dataintelligens"
- "Content Hub" → "Indholdscentral"
- "Born from the void" → "Født fra tomrummet"
- "Claim your planet" → "Gør krav på din planet"
- And all other visible English text on the star map
Add keys to lib/i18n/da.ts. Update star map component to use i18n when locale=da.

### CW-A2: Danish Page Body Translations [HIGH]
These /dk/ pages load but body text is still English:
- /dk/services → translate service descriptions
- /dk/about → translate about content
- /dk/contact → translate contact form labels and text
- /dk/team → translate team descriptions (keep humor in Danish)
- /dk/quantum → translate debate engine description
- /dk/break-room → translate game descriptions
Add all translations to lib/i18n/da.ts. Update page components to use useI18n().

### CW-A3: Danish Shop Tab Translation [MEDIUM]
- "FEATURED" → "UDVALGTE"
- "COCKPITS" → keep as "COCKPITS" (gaming term)
- Verify all other tabs are translated

### CW-A4: Danish Achievements Terminology [MEDIUM]
Change "Bedrifter" to "Præstationer" on /dk/achievements per master plan spec.

### CW-A5: Apps Visibility [MEDIUM]
Apps is buried in About dropdown. Add "Apps" as a visible item in the Products dropdown with label "Apps (BETA)" linking to /apps. This makes it more visible for service customers.

### CW-A6: Upload More Models to Supabase [LOW]
Upload the next batch of important ship models to Supabase Storage for shop catalog expansion:
- 5 Epic ships (hirez_ship02-07)
- 10 Rare ships (best uscx_ silhouettes)
- 5 Uncommon ships (one per USC class)
Add all URLs to lib/config/modelUrls.ts.

---

## BUILD ORDER

### Round A (Critical — cockpit + ship loading):
**Claude Code:** CC-A1, CC-A2
**Cowork:** CW-A5 (Apps visibility — quick fix)

### Round B (High priority — homepage + shop + achievements):
**Claude Code:** CC-A3, CC-A4, CC-A5, CC-A6, CC-A7, CC-A8
**Cowork:** CW-A1, CW-A2 (Danish translations)

### Round C (Gameplay):
**Claude Code:** CC-A9, CC-A10, CC-A11, CC-A12, CC-A13, CC-A14
**Cowork:** CW-A3, CW-A4 (Danish minor fixes)

### Round D (Expansion):
**Cowork:** CW-A6 (Upload more models)

---

## NOT IN SCOPE (future sessions)
- Stripe integration for real purchases
- Authentication for save/progress
- Multiplayer sync
- Upload remaining 669 models
- voidexa.dk domain configuration
- Supabase Realtime for chat

## DEPLOY RULE
- ALWAYS: git push origin main (auto-deploys via Vercel+GitHub)
- NEVER: main:master or npx vercel --prod
- 3D models on Supabase Storage CDN
- Build must pass: npx next build (60/60 pages)

## FILES NOT TO TOUCH
- lib/game/ (342 tests)
- lib/cards/ (card data)
- lib/chat/, lib/achievements/, lib/race/, lib/missions/ (data layers)
