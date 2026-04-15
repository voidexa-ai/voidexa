# VOIDEXA STAR SYSTEM — FIX LIST + REMAINING WORK
**Version 2.0 — April 15, 2026**
**Status: Phase 1-9 data/logic DONE. Visual polish and UI builds NEEDED.**

---

## SECTION A: CRITICAL FIXES (must fix before anything new)

### A1. Free Flight access broken
- "Explore the Universe" button on Galaxy View (/starmap) does not work or is missing
- Users can ONLY access /freeflight via direct URL
- FIX: Ensure the CTA button on /starmap links to /freeflight and works
- Also add "Free Flight" to the main nav bar or Break Room page

### A2. Bought 3D assets not used (813 kr wasted)
- USC ships (289): only qs_bob loaded. AstroEagle, CosmicShark, VoidWhale etc unused
- Hi-Rez cockpits (5): NONE loaded. Procedural cockpit used instead
- Hi-Rez ships: NONE loaded
- Expansion ships (50): NONE loaded
- FIX: Convert with textures intact → replace procedural cockpit with Hi-Rez cockpit → use USC/Hi-Rez ships for NPCs and ship selection
- BLOCKER: FBX/OBJ→glb conversion lost textures. Need Blender rebinding or alternative approach

### A3. NPCs are cones
- All NPC ships render as small cone geometry
- FIX: Replace with actual .glb ship models (use Quaternius ships which DO have textures)
- Patrol = one ship type, Pirates = different ship type with red glow

### A4. Boost trail is a cone
- Shift boost shows an ugly cone behind the ship
- FIX: Replace with particle-based engine trail (small glowing particles spreading backwards, fading out)
- Blue at engine, orange during boost, length scales with speed

### A5. Footer visible in cockpit
- "Operating globally from Denmark" footer shows inside cockpit view
- STATUS: FIXED in phase 8 deploy (ConditionalFooter.tsx)
- VERIFY: Check if it's actually gone now

### A6. Ship orientation in cockpit view
- Verify: in first person, are you looking out the FRONT of the ship?
- The cockpit frame was added but might need adjustment

---

## SECTION B: UI BUILDS NEEDED (data exists in lib/, needs React components)

### B1. Shop UI (lib/shop/ has data)
- Route: /shop or /break-room/shop
- Visual: Grid of items with rarity glow borders
- Daily rotation section (4-6 items, countdown timer)
- Weekly featured section (2-3 premium items)
- Limited editions section (if any active)
- Click item → detail modal with preview + buy button (Stripe)
- Ship skin preview: show 3D model rotating in modal
- Card pack: show pack opening animation
- Integration: Stripe checkout for purchases

### B2. Chat UI (lib/chat/ has data)
- Floating bubble in lower-left corner on ALL pages
- Click → expand to chat window
- Universe Chat / System Chat / Whisper tabs
- Message input with 200 char limit
- Player names colored by rank
- Command support (/pm, /trade, /duel, etc)
- In Free Flight: semi-transparent overlay, messages fade after 10s
- Integration: Supabase Realtime WebSocket

### B3. Achievement UI (lib/achievements/ has data)
- Achievement panel accessible from profile/menu
- Grid of all 23 achievements with progress bars
- Locked/unlocked state with visual difference
- Popup notification when achievement unlocked (toast)
- Title composer: select which title fragments to display
- Current title shown on player profile
- In Free Flight: hover over ship shows player name + title

### B4. Mission UI (lib/missions/ has data)
- Mission board at voidexa Hub station (dock → see missions)
- Also accessible from ESC menu in Free Flight
- List of available missions with difficulty, rewards, time limit
- Active mission tracker in cockpit HUD (waypoint + objective progress)
- Daily challenge with countdown and leaderboard
- Story mission chain with chapter progression
- Mission complete popup with rewards

### B5. Race UI (lib/race/ has data)
- Race challenge system (right-click player → challenge to race)
- Track selection screen (5 fixed + daily random)
- Countdown overlay (3-2-1-GO)
- Checkpoint rings rendered in 3D (glowing rings to fly through)
- Power-up pickups rendered as glowing orbs on track
- Power-up HUD slot (shows current power-up, Q to use)
- Race results screen (times, winner, rewards)
- Leaderboard per track
- Tournament bracket UI

---

## SECTION C: CARD SYSTEM VISUAL (needs design decisions)

### C1. Card illustrations
- 40 cards in Core Set need visual art
- OPTIONS:
  a) AI-generated (use DALL-E, Midjourney, or SUNO-style tool) — fast, cheap, unique
  b) Simple icon-based (geometric symbols per card type) — fastest, code-only
  c) Buy card art packs — cost money
- RECOMMENDATION: Start with (b) icon-based for v1, upgrade to (a) AI-generated for v2

### C2. Card UI in hand
- During turn-based combat: cards displayed at bottom of screen
- Each card shows: name, energy cost, rarity border color, illustration, brief effect text
- Drag card up to play → target selection → 3D animation on ship

### C3. Card combat arena
- Split view or over-the-shoulder 3D arena
- Both ships visible
- Cards in hand at bottom
- Energy counter
- Turn indicator
- Health bars for both ships
- 3D animations when cards are played (missiles fire, shields activate, etc)

### C4. Card pack opening
- Bought from shop → pack opening animation
- Cards flip/reveal one by one
- Rarity glow on reveal (gold flash for Legendary)
- "NEW" indicator for cards not in collection

### C5. Deck builder
- Collection view: all owned cards in grid
- Drag cards into deck (max 20)
- Deck validation (max 2 copies, max 1 legendary)
- Save/load multiple decks

---

## SECTION D: DATABASE (Supabase tables needed)

### D1. Player profile
- user_id, username, rank, rank_points, title_fragments, selected_title, created_at

### D2. Ship inventory
- user_id, ship_id, ship_model, skin_id, attachments[], is_soulbound, acquired_via

### D3. Card collection
- user_id, card_id, quantity, dust_balance

### D4. Achievement progress
- user_id, achievement_id, current_count, completed, completed_at

### D5. Chat messages
- id, channel, sender_id, sender_name, sender_rank, content, timestamp

### D6. Mission progress
- user_id, mission_id, status, objectives_completed[], started_at, completed_at

### D7. Race results
- race_id, track_id, player_ids[], times[], winner_id, power_ups_used[], wagers[]

### D8. Shop transactions
- user_id, item_id, price_cents, purchased_at, stripe_session_id

---

## SECTION E: INFRASTRUCTURE NEEDED

### E1. Player authentication
- Currently: voidexa has Supabase auth for Quantum wallet
- Need: same auth system extended to Free Flight / shop / cards
- Player must be logged in to: buy from shop, save progress, PvP, chat

### E2. Multiplayer (future)
- Currently: single player only in Free Flight
- Need: Supabase Realtime or dedicated WebSocket server
- Other players visible as ships in universe
- Real-time position sync
- Phase: AFTER all single-player content works

### E3. Stripe integration for shop
- Currently: Stripe works for Quantum wallet top-up
- Need: extend to ship/card shop purchases
- Webhook for purchase confirmation → add item to player inventory

---

## BUILD PRIORITY ORDER

| Priority | What | Type | Effort |
|---|---|---|---|
| 1 | Fix Free Flight access from starmap | Fix | 10 min |
| 2 | Fix NPCs — use real ship models | Fix | 30 min |
| 3 | Fix boost trail — particle system | Fix | 30 min |
| 4 | Fix texture conversion for bought models | Fix | 1-2 hours |
| 5 | Replace procedural cockpit with Hi-Rez model | Fix | 1 hour |
| 6 | Supabase tables (D1-D8) | Backend | 1 hour |
| 7 | Chat UI component (B2) | UI Build | 2 hours |
| 8 | Shop UI component (B1) | UI Build | 3 hours |
| 9 | Achievement UI component (B3) | UI Build | 2 hours |
| 10 | Mission UI in Free Flight (B4) | UI Build | 3 hours |
| 11 | Card illustrations — icon-based v1 (C1b) | Design | 2 hours |
| 12 | Deck builder UI (C5) | UI Build | 2 hours |
| 13 | Card combat arena (C3) | UI Build | 4 hours |
| 14 | Race UI — checkpoints + power-ups in 3D (B5) | UI Build | 4 hours |
| 15 | Card pack opening animation (C4) | UI Build | 2 hours |
| 16 | PvP dogfight (phase 10) | Game Build | 4 hours |
| 17 | Multiplayer sync (E2) | Infrastructure | 8+ hours |
| 18 | GHAI integration | Blocked by ADVORA | — |

---

## WHAT'S DONE vs WHAT'S LEFT

### DONE (deployed and working):
- ✅ Phase 1: Premium star map effects
- ✅ Phase 2: Galaxy View at /starmap
- ✅ Phase 3: Free Flight at /freeflight (with bugs)
- ✅ Phase 4: Shop data (lib/shop/) — 20 items, rotation logic
- ✅ Phase 5: Chat data (lib/chat/) — commands, moderation, formatting
- ✅ Phase 6: Achievement data (lib/achievements/) — 23 achievements, titles
- ✅ Phase 7: Race data (lib/race/) — 5 tracks, 9 power-ups, tournaments
- ✅ Phase 8: Space stations + nebula + derelicts + warp gates (deployed)
- ✅ Phase 9: Mission data (lib/missions/) — 12 missions, daily, story chain
- ✅ 342 tests passing across all phases
- ✅ 4.48 GB 3D assets organized
- ✅ 20 .glb models converted (11 with textures, 9 without)

### LEFT TO BUILD:
- ❌ Visual fixes (A1-A6)
- ❌ All UI components (B1-B5)
- ❌ Card visuals and combat (C1-C5)
- ❌ Database tables (D1-D8)
- ❌ Auth + Stripe for shop (E1, E3)
- ❌ Multiplayer (E2)
- ❌ Phase 10: PvP dogfight
- ❌ Phase 11: Turn-based card combat
- ❌ GHAI (blocked by ADVORA)
