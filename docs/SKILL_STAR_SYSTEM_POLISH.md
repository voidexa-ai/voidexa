# SKILL: Star System Polish — Complete Fix Plan
**voidexa Star System — All Outstanding Issues**
**April 15, 2026**

---

## STATUS: 35 known issues across 8 categories

---

## CLAUDE CODE TASKS (UI/Component fixes — touches components/, app/)

### CC-1: Cockpit Interior Assembly
- Upload to Supabase Storage bucket "models": hirez_cockpit01_interior.glb, hirez_equipments.glb, hirez_screens.glb
- Add URLs to lib/config/modelUrls.ts
- Load all 3 models inside CockpitModel.tsx combined with the cockpit frame
- Position: interior centered inside frame, screens on dashboard, equipments at panel level
- Result: Full cockpit with screens, joysticks, instruments — not just metal bars

### CC-2: Chat Position in Free Flight
- Universe Chat overlaps cockpit HUD in first person
- When pathname is /freeflight AND cockpit mode: move chat to WoW-style
- WoW-style: thin text strip at bottom-center of screen, no bubble, messages fade after 8s
- When chat is NOT in cockpit mode: normal bubble position (bottom-left)

### CC-3: Boost Trail Particle System
- Remove cone-shaped boost trail
- Replace with Points geometry particle system
- 150 small particles emitted from ship engine position
- Particles travel backwards along ship reverse direction
- Normal flight: cyan particles, short trail, 0.3s fade
- Boost (Shift): orange particles, 3x longer trail, 0.5s fade, faster emission
- Scale particle count and trail length with current speed

### CC-4: Shop Fix — Crash on Show All
- Shop crashes when clicking "Show All" to display 20 items
- Debug and fix the crash (likely missing key prop, undefined item, or render loop)
- Test that all 20 items render without error

### CC-5: Shop Fix — Larger Images
- Item preview images are too small (barely visible)
- Increase card image area to minimum 200x200px
- Use actual rendered images from public/images/renders/ where available
- Map ship skins to renders: legendary/ epic/ uncommon/ rare/ folders
- Map weapons to renders: weapons/ folder
- Map cockpits to renders: cockpits/ folder
- Items without a matching render: use a category-specific placeholder SVG (not emoji)

### CC-6: Shop Redesign — Fortnite Style
- Remove "DAILY ROTATION" + "WEEKLY FEATURED" + "FULL CATALOG" single-scroll layout
- Replace with TAB navigation: "Featured" | "Ships" | "Skins" | "Trails" | "Card Packs" | "Cockpits"
- "Featured" tab: 1-2 hero items displayed LARGE (400px+ preview), daily countdown timer
- Each other tab: grid of 6-8 items per page, "Next/Prev" pagination
- Click item: fullscreen modal with large preview, description, price, "Coming Soon" button
- More space between items — current layout is cramped

### CC-7: Shop Prices
- Update lib/shop/items.ts with lower prices:
  - Common: $0.50-$1
  - Uncommon: $1-$2  
  - Rare: $2-$4
  - Epic: $4-$7
  - Legendary: $8-$12
  - Card packs: $1/$2/$5/$10
  - Starter Pack: $1.99

### CC-8: Card Game Access
- Add "Cards" to Universe dropdown in nav bar (between Shop and Achievements)
- Links to /cards (collection) and /cards/deck-builder
- Add "Card Combat" button in Free Flight ESC menu

### CC-9: Camera Zoom for Large Ships
- In third person: camera distance should auto-adjust based on ship bounding box
- Small ships (qs_bob): camera at 5 units
- Large ships (VoidWhale): camera at 15 units
- Scroll wheel still works for manual adjustment within range

### CC-10: Planet Collision
- Verify planets have collision (ship bounces off like asteroids)
- If not working, add collision spheres matching planet visual radius

### CC-11: Q/E Roll Thrusters
- Q key: roll ship left (counter-clockwise when looking from behind)
- E key: roll ship right (clockwise)
- Smooth rotation, not instant snap
- Visual: side thrusters glow briefly when rolling

### CC-12: Free Look Lock
- Currently: hold RMB to free look, release = camera snaps back
- Change: hold RMB to orbit, release = camera STAYS in that position
- Press middle mouse button OR double-tap RMB to reset camera to default behind-ship position
- This lets players look at their ship from any angle while flying

### CC-13: Danish Routes Missing
- /dk/starmap → 404 (needs route)
- /dk/freeflight → 404 (needs route)
- /dk/cards → 404 (needs route)
- Add these routes with Danish translations where applicable
- Star map / Free Flight can reuse English components with Danish HUD text

### CC-14: NPC Variation
- Currently all patrol NPCs look identical, all pirate NPCs look identical
- Upload 2-3 more ship models to Supabase for NPC variety
- Patrol: rotate between qs_challenger, qs_striker, qs_imperial
- Pirates: rotate between qs_executioner, qs_omen, qs_spitfire
- Upload these 4 extra models to Supabase "models" bucket

---

## COWORK TASKS (Data/assets/docs — touches lib/, public/, docs/)

### CW-1: Upload All NPC Ship Models to Supabase
- Upload these .glb files from public/models/glb-ready/ to Supabase Storage "models" bucket:
  - qs_striker.glb
  - qs_imperial.glb
  - qs_omen.glb
  - qs_spitfire.glb
  - hirez_cockpit01_interior.glb
  - hirez_cockpit02_interior.glb
  - hirez_cockpit03_interior.glb
  - hirez_cockpit04_interior.glb
  - hirez_cockpit05_interior.glb
  - hirez_equipments.glb
  - hirez_screens.glb

### CW-2: Card Art Integration
- Map the 40 starter cards from lib/cards/starter_set.ts to rendered images
- Copy appropriate renders from public/images/renders/weapons/ to card art paths
- Create docs/CARD_ART_STATUS.md showing which cards have art and which need it
- Update components/combat/cardArt.ts with correct paths

### CW-3: Supabase Database Tables
- Create these tables in Supabase (project ihuljnekxkyqgroklurp):
  - player_profiles (id, user_id, username, rank, rank_points, title, created_at)
  - ship_inventory (id, user_id, ship_model_id, skin_id, is_soulbound, acquired_via)
  - card_collection (id, user_id, card_id, quantity, dust_balance)
  - achievement_progress (id, user_id, achievement_id, current_count, completed, completed_at)
  - mission_progress (id, user_id, mission_id, status, objectives_completed, started_at)
  - race_results (id, track_id, player_id, time_ms, power_ups_used, created_at)
  - shop_transactions (id, user_id, item_id, price_cents, stripe_session_id, created_at)

### CW-4: Danish Translation Session B
- Translate remaining pages not covered in Session A:
  - Free Flight HUD text (all controls, dock prompts, lore popups)
  - Quantum page
  - Claim Your Planet
  - Team page (keep humor in Danish)
  - About/Contact/Services
  - Break Room
  - Station/AI Tools/Trading pages
- Add translations to lib/i18n/da.ts
- Create /dk/ routes for each translated page

### CW-5: Upload More Ship Models for Shop
- Upload top 20 most visually impressive ships to Supabase for shop previews:
  - 5 Epic (hirez_ship02_full through hirez_ship05_full, hirez_ship07_full)
  - 10 Rare (uscx_ ships with best silhouettes)
  - 5 Uncommon (one per USC ship class)
- Add URLs to lib/config/modelUrls.ts

---

## BUILD ORDER

### Round 1 (Critical — site is broken):
- CC-4: Shop crash fix
- CC-5: Shop images
- CC-1: Cockpit interior
- CW-1: Upload models to Supabase (parallel)

### Round 2 (Visual polish):
- CC-3: Boost trail particles
- CC-6: Shop Fortnite redesign
- CC-7: Price update
- CC-2: Chat WoW-style
- CW-2: Card art (parallel)

### Round 3 (Gameplay):
- CC-8: Card game access
- CC-9: Camera zoom for large ships
- CC-10: Planet collision
- CC-11: Q/E thrusters
- CC-12: Free look lock
- CW-3: Supabase tables (parallel)

### Round 4 (Danish + NPCs):
- CC-13: Danish routes
- CC-14: NPC variation
- CW-4: Danish translations (parallel)
- CW-5: More shop models (parallel)

---

## FILES NOT TO TOUCH
- lib/game/ (game logic — already tested, 342 tests)
- lib/cards/ (card data — already tested)
- lib/chat/ (chat logic — already tested)
- lib/achievements/ (achievement data — already tested)
- lib/race/ (race data — already tested)
- lib/missions/ (mission data — already tested)
- docs/ (documentation — read only)

## DEPLOY RULE
- ALWAYS: git push origin main (auto-deploys via Vercel+GitHub)
- NEVER: git push origin main:master
- NEVER: npx vercel --prod
- 3D models load from Supabase Storage, NOT from Vercel/public/
