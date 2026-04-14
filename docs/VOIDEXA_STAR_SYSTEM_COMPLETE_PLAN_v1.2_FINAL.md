# VOIDEXA STAR SYSTEM + FREE FLIGHT — COMPLETE PLAN
**Version 1.2 FINAL — April 14, 2026**
**Status: ALL PHASES AGREED. Ready for CLAUDE.md + SKILL.md creation.**
**This document is the SINGLE SOURCE OF TRUTH.**

---

## PART 1: STAR SYSTEM (Navigation)

### Three Levels

**Level 1 — Galaxy View (NEW)**
- Top-level overview of entire voidexa ecosystem
- voidexa as the sun in center (biggest, brightest)
- Company planets orbiting (business customers)
- "Claim Your Planet" as mysterious distant planet at edge
- Constellation grouping by industry to avoid clutter
- Zoom-based reveal: far = dots, medium = shapes + labels, close = full detail
- Search/directory sidebar for non-visual navigation
- Filter by industry, Gravity Score, trade activity

**Level 2 — Company System (EXISTING star map, upgraded)**
- Click a planet in Level 1 → enter that company's own star system
- Company becomes a mini-sun, its products/services orbit as planets
- voidexa's current star map IS Level 2 for voidexa
- Trade routes visible to connected companies
- "Back to galaxy" button to return to Level 1
- Same Three.js mechanics, different data per company

**Level 3 — Page Surface (EXISTING)**
- Click a product planet → land on that page
- Already works today

### Planet Types and Details
Each planet has a type that determines its visual appearance:
- Desert (sandy texture, orange atmosphere glow)
- Ocean (blue/green, water reflections)
- Ice (white/blue, crystalline atmosphere)
- Jungle (green, thick atmosphere haze)
- Gas Giant (swirling bands, no surface, massive)
- Volcanic (red/orange, lava glow, dark surface)
- Tech-World (city lights on dark side, geometric patterns)
- Each type = texture on sphere + unique atmosphere bloom ring
- Planet-owners choose their type on claim (or assigned by industry)
- Built in code (shaders/textures) — no purchased assets needed

### Visual Style — Premium (Elite Dangerous / Star Citizen level)
- Post-processing: UnrealBloomPass, chromatic aberration, vignette, film grain, ACES tone mapping
- Emissive materials with toneMapped={false}
- Custom shaders: procedural nebula, star twinkle, energy tendrils
- Particles: ambient dust (5000 max), mouse parallax, warp streaks
- Camera: idle auto-orbit, click-to-warp with FOV increase, GSAP transitions
- Tech: React Three Fiber + @react-three/postprocessing
- Mobile: search/list primary nav, 3D as bonus, disable post-processing

### Navigation Mode Controls
- OrbitControls (drag to rotate)
- Click planet → warp animation → arrive
- Zoom in/out to reveal detail levels
- NOT free flight — this is website navigation

---

## PART 2: FREE FLIGHT (Game / Break Room)

### Overview
Separate mode launched from Break Room or "Explore the Universe" button.
Same 3D scene as star map but with spaceship controls.
Ship is a REAL 3D model visible in both camera modes.

### Two Camera Modes (V key toggle)
1. **First Person Cockpit** — inside ship, holographic HUD (Elite Dangerous blue orb style), universe through glass canopy
2. **Third Person Chase Cam** — behind/above ship, see full 3D ship in universe

### Cockpit HUD Design
- Large transparent cyan/blue holographic radar orb in center
- Planets visible THROUGH the hologram
- Cockpit frame panels from 3D model
- Displays: speed, nearest planet, health/shield bars, rank badge, energy meter, card hand (in card combat), alien tech status, PvP toggle indicator
- Matches voidexa palette (cyan/blue glow, dark panels)

### Controls
- WASD + mouse look (first person) / mouse aim (third person)
- Shift = boost, Space = brake, V = camera toggle
- Q = use power-up (races) / play card (turn-based)
- Right-click on player = interaction menu (duel, trade, PM, view profile)

### Universe Content

**Layer 1 (always loaded — shared with navigation):**
- Planets with type-specific textures and atmosphere glow
- Sun, background stars, nebula
- Company planets with labels

**Layer 2 (Free Flight only):**
- Asteroid belts (procedural, instanced mesh, 200-500 per belt)
- Debris fields (broken ship parts, scrap)
- Nebula zones (colored gas, reduced visibility, ambush spots)
- Derelict ships (scan for lore/easter eggs)
- Warp gates (ring structures, fast travel)
- Beacons/lighthouses (markers, planet-owners can place)
- Minefields (dangerous shortcut zones)
- Alien Tech spawns (glowing green/gold artifacts)
- Card drops (glowing card pickups)
- Power-up spawns (race mode only)

### NPCs (Non-Player Characters)

**At Stations:**
- Mission givers — named NPCs with personality, give missions
- Shopkeepers — NPC behind shop terminal, tips about new items
- Lore NPCs — at abandoned stations, tell universe history fragments

**In Space:**
- Patrol ships — NPC ships flying routes between stations. Makes universe feel alive
- Pirate ships — hostile NPCs in dangerous zones. Attack on sight. Combat mission targets
- Trade caravans — NPC cargo ships between trading posts. Escort mission targets
- Alien probes — mysterious NPCs near alien tech spawns. Scan you and fly away. Clue that alien tech is nearby

**Near Planets:**
- Orbital traffic — NPC ships around planets. Living, busy feeling
- Planetary defense — NPC guard ships near planet-owner stations. Enforce safe zones

**Why NPCs matter:** Without them, universe is empty unless 100+ players online. With NPCs it feels alive from day 1 with just 5 real players.

### Space Stations

**voidexa Hub (central)**
- Near voidexa sun. Universal spawn point. Safe zone (500m radius)
- Contains: shop terminal, leaderboard, mission board, trade board, card terminal
- Chat hotspot. Largest, brightest station. Beacon visible from far

**Planet-owner stations (per claimed planet)**
- Orbital station auto-generated on planet claim
- Shows company name/logo. Dock → link to planet page
- Owner customizes color/skin from presets
- Safe zone (200m radius)

**Abandoned stations (5-8 scattered)**
- Half-destroyed, dark, flickering lights, debris
- Scan → lore text popup. Each tells part of larger story
- Hidden rewards: card blueprints, cosmetics
- NO safe zone (risk = excitement)

**Repair/Rest stations (evenly spread)**
- Dock → full health/shield reset. Free
- Small, functional, green glow
- Safe zone (100m radius)
- Strategic: after duels, fly to nearest repair. Ambush risk outside

**Trading posts (3-4 at major routes)**
- Player-to-player trade UI
- Post offers, browse, accept trades
- Safe zone (200m radius)
- Trade chat hotspot

### Performance Budget
- Navigation mode: ~5000 particles + 7-15 planets + post-processing
- Free Flight adds: ~200-500 asteroid instances + NPC ships (instanced) + cockpit + collision
- LOD: low-poly far, high-poly close
- Cockpit loads only in Free Flight
- NPCs: predefined routes, simple AI, instanced mesh

---

## PART 3: SHIP SYSTEM

### Ship Classes (5 types)
1. **Fighter** — small, fast, agile. Best for dogfights. Ability: Double fire rate 3s (cd 15s)
2. **Cruiser** — medium, balanced. Ability: Repair drone heals 20 shield over 5s (cd 30s)
3. **Stealth** — sleek, dark. Ambush specialist. Ability: Cloak 4s, broken on attack (cd 20s)
4. **Tank/Battleship** — huge, slow, heavy. Ability: Fortress mode 50% dmg reduction 5s, immobile (cd 25s)
5. **Racer** — stripped, fastest. Ability: Afterburner speed boost 3s (cd 12s)

### Ship Stats for Turn-Based Card Combat
| Class | Shield | Hull | Total HP | Energy/turn | Card Hand Size |
|---|---|---|---|---|---|
| Fighter | 30 | 70 | 100 | 4 | 6 |
| Cruiser | 50 | 100 | 150 | 4 | 5 |
| Stealth | 20 | 60 | 80 | 5 | 7 |
| Tank | 80 | 170 | 250 | 3 | 4 |
| Racer | 15 | 50 | 65 | 5 | 6 |

### Ship Components (attachment points)
- 2x weapon slots (gameplay earned — NOT shop)
- 1x motor slot (gameplay earned)
- 1x shield slot (gameplay earned)
- 2x cosmetic slots (shop items — wings, antennas, decorations)

### RULE: Shop sells LOOKS. Gameplay earns STATS. No pay-to-win.

### Acquisition
- **Free starter ship** — basic, not wagerable
- **Achievement ships** — SOULBOUND. Cannot wager/trade. Proves personal accomplishment
- **Shop ships/parts** — CAN be wagered. Skins, trails, effects, cosmetics
- **PvP won items** — CAN be wagered further
- **Legendary** — ONLY from PvP wins. Cannot be purchased. Ultimate status

### Rarity: Common → Uncommon → Rare → Epic → Legendary

### Shop Rotation (Fortnite model)
- Daily: 4-6 items rotate every 24h
- Weekly: 2-3 premium items
- Seasonal: new theme monthly (pirate, military, alien, cyberpunk)
- Limited: announced, 48-72h only, NEVER return
- Item creation: 80% texture swaps (fast), 20% new models (rare/desirable)

### Shop Pricing (Stripe USD — GHAI later after ADVORA)
- Common skin: $1-2 | Attachment: $2-5 | Full ship skin: $5-10
- Premium effect: $5-10 | Epic ship: $10-20 | Limited bundle: $15-25
- Card packs: see Part 8

---

## PART 4: PvP SYSTEM

### Core: Everyone flies together. PvP is opt-in within rank brackets.

### PvP Toggle
- In cockpit: "PvP Enabled" ON/OFF
- ON = visible glow, can receive duel requests
- OFF = invisible to challengers, fly in peace

### Duel Flow
1. Right-click player → "Request Duel"
2. Popup → Accept / Decline
3. Rank check: within ±1 bracket? (Exception: Alien Tech allows any rank)
4. Duel zone spawns in nearest open space (away from planets/stations)
5. Glowing ring barrier. "DUEL IN PROGRESS" label
6. Fight inside zone. Fly outside = forfeit
7. Spectators can watch from outside. Health bars visible
8. Winner gets wagered items. Both return to Free Flight

### Rank System
Bronze → Silver → Gold → Platinum → Diamond → Legendary
- Start Bronze. Win = points up, lose = points down
- Only duel ±1 rank (except with Alien Tech)
- ALL players in same universe regardless of rank

### Gear Normalization: max 15% advantage from gear in PvP
### Optional "Pure Ranked" mode: all stats normalized, pure skill

### Wager Rules
- Shop-bought and PvP-won items: CAN wager
- Achievement ships: NEVER (soulbound)
- Starter ship: NEVER (always have something)
- voidexa earns from SHOP, not wager fees (losers buy new ships)

### Safe Zones
- voidexa Hub: 500m | Planet stations: 200m | Repair: 100m | Trading: 200m
- Abandoned stations: NO safe zone

---

## PART 5: UNIVERSE CHAT ✅ AGREED

### Three Channels
- **Universe Chat** — global, all pages, bubble in lower-left corner, fold in/out
- **System Chat** — per planet system (Level 2)
- **Whisper/DM** — `/pm [player] [message]`

### Chat Commands
- `/pm [player] [msg]` — private message
- `/trade [item]` — post trade offer
- `/duel [player]` — send duel request
- `/stats` — show your stats
- `/rank` — show rank and points
- `/who` — nearby players (Free Flight)
- `/help` — list commands
- `/mute [player]` — hide their messages

### Visibility
- Normal web pages: discrete bubble lower-left, foldable
- Free Flight cockpit: semi-transparent chat in lower-left HUD panel, messages fade after 10s
- Free Flight third person: chat overlay lower-left

### Moderation (adult approach — business platform, not kids game)
- Auto-filter: slurs, spam, external links. Rate limit 5 msgs/10 sec
- Player report: right-click message → Report. X reports → auto-mute 24h
- Admin: Control Plane dashboard, review reports, perma-ban

### Details
- 200 character limit per message
- History: 7 days in Supabase
- Standard unicode emojis (no custom stickers v1)
- Player names show rank color (Bronze=bronze, Gold=gold, Legendary=purple glow)
- Tech: Supabase Realtime (WebSocket)

---

## PART 6: ACHIEVEMENT SYSTEM ✅ AGREED

### ~25 Achievements in 3 categories

**Product Achievements (drive voidexa usage):**
- Use Quantum 1x → "First Debate" badge
- Use Quantum 10x → "Debater" + AI-class cruiser ship
- Use Quantum 50x → "Quantum Master" + gold badge
- Paper trade with Trading Bot → "Paper Trader" badge
- Trading Bot profit >10% → "Trader" + trader vessel ship
- Claim a planet → "Pioneer" + pioneer frigate ship
- First wallet top-up → "Investor" badge
- Use Void Chat 10x → "Communicator" badge

**Exploration Achievements:**
- Visit all voidexa planets → "Explorer" + scout ship
- Find all abandoned stations → "Archaeologist" + unique badge
- Fly 1000km total → "Voyager" badge
- Enter every nebula zone → "Nebula Runner" badge
- Find hidden easter egg → "Secret" + mystery ship
- Dock at every station type → "Station Hopper" badge
- Scan 10 derelict ships → "Salvager" badge

**PvP/Social Achievements:**
- Win first duel → "Warrior" badge
- Win 10 duels → "Veteran" + veteran badge
- Win 50 duels → "Champion" + champion badge
- Reach Gold rank → "Gold Ace" + gold trail effect
- Reach Legendary rank → "Legend" + animated chat name
- Complete first race → "Racer" badge
- Win a race → "Speed Demon" badge
- Trade with another player → "Merchant" badge

### Progression Tiers
Bronze/Silver/Gold versions for repeated achievements (1/10/50)

### Title System (Game of Thrones / Daenerys style)
- Each achievement gives a title fragment
- System combines fragments into compound title
- Examples: "Voice of the Consensus, Scourge of the Void, Keeper of Lost Worlds"
- Player CHOOSES which fragments to display (like WoW title selection)
- Hover over ship shows: "PlayerName — [chosen title] [Rank Badge]"
- Click → full profile with all achievements, fragments, ship collection
- AI-generated unique titles for rarest achievements (personalized, nobody else has same)

### Rewards
- Ships (soulbound, per achievement)
- Badges (displayed on profile)
- Titles/fragments (displayed on ship hover and chat)
- Chat name colors (per rank)
- Profile borders/frames

---

## PART 7: PvP RACES (Mario Kart Style) ✅ AGREED

### Track Design: HYBRID
- 5 fixed tracks with leaderboards (learn and master)
- 1 daily random route (keeps it fresh)

### Race Flow
1. Challenge or queue at station
2. Select ship (racer class has advantage but any class can enter)
3. Countdown 3-2-1-GO
4. Route: glowing checkpoint rings (10-15 per track)
5. Through asteroid fields, past planets, through nebula
6. Crash = time penalty +3s (ship bounces, lose momentum, no respawn)
7. Miss checkpoint = must go back or +5s penalty
8. First to finish all checkpoints wins

### Racing Mode: Ghost Race (v1)
- Fly against opponent's recorded "ghost" (semi-transparent ship)
- No real-time sync needed. Simple to build, still fun
- v2 later: real-time racing with WebSocket

### Power-Ups (Mario Kart style — spawn as glowing orbs on track)

**Offensive:**
- EMP Blast — opponent loses control 1.5s (ship spins)
- Asteroid Drop — 3 asteroids dropped behind you as mines
- Tractor Beam — slows opponent 2s

**Defensive:**
- Shield Bubble — blocks next hit, 5s duration
- Stealth Cloak — invisible 3s, can't be targeted

**Speed:**
- Nitro Boost — massive speed 2s
- Warp Skip — teleport 1 checkpoint ahead (rare, spawns once per race)

**Sabotage:**
- Scrambler — inverts opponent controls 2s
- Nebula Cloud — blinds opponent behind you

**Rules:**
- Hold 1 power-up at a time. Use with Q key
- New spawns every 15-20s at fixed positions
- Rubber-banding: player behind gets stronger power-ups (keeps races close)

### Leaderboards
- Per track: top 100 all-time
- Daily random: top 100, resets daily
- Overall race rank
- Visible at voidexa Hub and web UI

### Race Rewards
- Win: rank points + achievement progress
- Beat track record: special badge + name on track
- Daily winner: uncommon shop item
- Tournament winner: rare/epic item

### Tournaments
- 8 or 16 players, bracket elimination
- Weekly or monthly
- Finals are spectator events with Universe Chat hype
- Winner gets epic/legendary reward

---

## PART 8: COLLECTIBLE CARD SYSTEM ✅ AGREED

### Overview
Cards represent abilities your ship can perform in turn-based combat.
Playing a card triggers a 3D ANIMATION on your ship (missiles fire, shields activate, drones deploy).
Cards are collected, traded, crafted, and used to build combat decks.

### Energy System (like Mana in Magic)
- Each turn your ship generates Energy based on motor tier
- Tier 1: 3 Energy/turn | Tier 2: 4 | Tier 3: 5 | Tier 4: 6
- Cards cost Energy to play
- Common: 1-2 Energy | Uncommon: 2-3 | Rare: 3-4 | Epic: 4-5 | Legendary: 5-7

### Card Categories (~280 unique cards total)

**Attack Cards (80 total):**
- Direct damage: laser, plasma, railgun, missile, torpedo
- Area damage: barrage, swarm, nova, carpet bomb
- Damage over time: acid, nanobots, fire, radiation
- Piercing (ignore shield): AP round, phase beam, void lance

**Defense Cards (65 total):**
- Shield: energy, magnetic, plasma, ablative
- Dodge: evasive, phase shift, afterburner, cloak
- Reflect: mirror shield, counter-pulse
- Heal: nanobots, repair drone, emergency weld

**Tactical Cards (65 total):**
- Buff self: speed up, damage up, crit chance, extra AP
- Debuff enemy: slow, disable, blind, jam weapons
- Terrain: move asteroid, create nebula, deploy mine
- Intel: scan hand, predict move, reveal trap

**Deployment Cards (50 total):**
- Attack drones: laser drone, missile drone, kamikaze
- Defense drones: shield drone, decoy, point defense
- Utility: repair bot, energy harvester, scanner probe
- Structures: turret, mine, beacon, barrier

**Alien Cards (20 total):**
- Void Rift, Time Reverse, Reality Warp, Gravity Well, Phase Storm, etc.
- Each with 20% backfire chance

### Visual: Cards Come Alive
- Play "Missile Swarm" → ship physically opens missile bays, fires missiles in 3D
- Play "Energy Shield" → glowing shield wraps around ship
- Play "Deploy Drones" → small drones fly out of ship
- Play "EMP Disable" → blue shockwave from ship
- Legendary cards: epic full-screen animations, camera zoom
- THIS drives card purchases — people want the cool animations

### Turn-Based Combat Flow
1. Both players see each other's ships in 3D arena
2. Card hand at bottom of screen (5-7 cards visible)
3. Your turn: play cards (spend Energy), position ship on tactical grid
4. Watch 3D animations of your actions
5. Opponent's turn: watch their ship execute actions
6. Back and forth until one ship destroyed
7. Max 15 turns (longest surviving HP% wins if timeout)

### Deck Rules
- Deck size: 20 cards
- Max 2 copies of same card (Legendary: max 1)
- Starting hand: 5 cards, draw 1 per turn
- Max 7 in hand (excess discarded)

### Core Set (v1 launch — 40 cards)
- 15 Common, 10 Uncommon, 8 Rare, 5 Epic, 2 Legendary
- Enough for varied gameplay
- Future expansions: "Alien Awakening", "Pirate's Arsenal", "Void Storms" (20 cards each)

### Crafting / Disenchant System

**Disenchant (destroy card → get Dust):**
- Common → 5 Dust | Uncommon → 20 | Rare → 100 | Epic → 400 | Legendary → 1600

**Craft (spend Dust → create specific card):**
- Common: 30 Dust | Uncommon: 100 | Rare: 400 | Epic: 1600 | Legendary: 6400

**Imbue/Fusion (combine 2 same-rarity → 1 random next-rarity):**
- 2 Common → 1 random Uncommon
- 2 Uncommon → 1 random Rare
- 2 Rare → 1 random Epic
- 2 Epic → 1 random Legendary
- Random result creates excitement

### How Players Get Cards
- Drops in universe (glowing card pickups in asteroid fields, near stations)
- Mission rewards (choose card or cosmetic)
- Achievement points → spend at card terminal
- PvP wins → random card from loser's deck or random drop
- Shop: card packs (Stripe)

### Card Pack Pricing
- Standard pack ($2): 5 cards, 4 common + 1 guaranteed uncommon
- Premium pack ($5): 5 cards, 3 common + 1 uncommon + 1 guaranteed rare
- Ultimate pack ($10): 5 cards, 2 uncommon + 2 rare + 1 guaranteed epic
- Legendary pack ($20): 10 cards, guaranteed 1 legendary (max 1 purchase per week)

### Card Trading
- Trade at Trading Post stations
- Universe Chat: "/trade [card-name] for [card-name]"
- Rare cards become VALUABLE in player economy

---

## PART 9: ALIEN TECH SYSTEM ✅ AGREED

### Spawning
- Dynamic rate: 1 Alien Tech per 5 active players per hour
- 10 players = 2/hr | 50 = 10/hr | 500 = 100/hr
- Spawns randomly: asteroid fields, near abandoned stations, nebula zones, derelict ships
- Glowing green/gold artifact, unique color (unlike anything else)
- No map marker — must explore to find
- Alien probes (NPCs) nearby = clue that alien tech is in area
- Persists when player logs out (accumulates over time)

### Capacity
- Max 2: 1 INSTALLED (ready to use) + 1 STORED (backup)
- Find third → choose: replace installed, replace stored, or ignore
- Installation takes 10 seconds (progress bar) — CANNOT install during combat
- Single use — gone after activation

### Visible Glow
- Ship has subtle alien shimmer (green/gold) when Alien Tech installed
- Experienced players recognize it: mind games in PvP
- Glow disappears after use

### Backfire System (20% chance)
| Alien Tech | Primary Effect | Backfire |
|---|---|---|
| Void Cannon | Massive damage burst | Damages yourself |
| Time Warp | Freeze opponent 3s | You freeze 3s |
| Shield Overcharge | Full shield + 200% for 10s | Shield drops to 0 |
| Gravity Well | Pull opponent toward you | You get pulled |
| Phase Shift | Teleport 500m any direction | Random teleport (into asteroid?) |
| Nano Swarm | Drain opponent shield over time | Drains your shield |
| EMP Nova | Disable all ships in radius | Only disables you |
| Cloaking Field | Total invisibility 10s | Become EXTRA visible (beacon) |
| Berserker Core | Double damage + speed 5s | Double damage TAKEN 5s |
| Repair Pulse | Full heal shield + hull | Heals everyone in radius incl. enemies |

### Rank Bypass
- With Alien Tech installed: can challenge ANY rank (not just ±1)
- Single use, massive gamble
- Opponent can decline
- If opponent wins: "Survived Alien Tech" badge

### Used In
- PvP duels (wild card)
- Races (Phase Shift to skip section, EMP to stop opponent)
- PvE missions (emergency heal, escape)
- Solo exploration (teleport to unknown areas)

---

## PART 10: MISSIONS (PvE) ✅ AGREED

### Mission Types

**Timed Challenges:**
- Asteroid Run — A to B through asteroid field, leaderboard
- Speed Delivery — cargo pickup + deliver before timer
- Nebula Dash — reduced visibility, checkpoints, shortcuts at own risk

**Exploration:**
- Scan Mission — find and scan 3-5 derelict ships
- Uncharted Sector — fly to unknown zone, content spawns, scan all
- Beacon Placement — place beacon at location for planet-owner

**Combat (requires phase 10 dogfight):**
- Pirate Hunt — destroy NPC pirate ships near station
- Escort — protect NPC cargo ship between stations
- Base Defense — defend station against NPC waves

**Story (one-time):**
- Chain of 5-10 missions telling voidexa universe origin story
- Each abandoned station reveals a chapter
- Complete all → unique title + epic cosmetic
- One-time per player (keeps it special)

### Solo vs Co-op
- Timed: solo (personal leaderboard)
- Exploration: solo or co-op
- Combat: solo (easy) or co-op (hard, better rewards)
- Story: solo

### Difficulty scales with rank
### Found at: Hub mission board, station terminals, Universe Chat daily announcement, cockpit HUD waypoint

### Rewards
- Timed: XP + credits
- Timed top 10: XP + uncommon cosmetic
- Exploration: XP + lore + badge progress
- Combat: XP + weapon/shield upgrade progress
- Combat co-op: XP + better gear/card drop chance
- Story complete: unique title + epic cosmetic
- Daily challenge winner: rare shop item

### Repeatability
- Timed: unlimited (chase records)
- Exploration: repeatable, reduced rewards after first
- Combat: repeatable full rewards (grind spot)
- Story: one-time only
- Daily: resets midnight

---

## PART 11: PvP DOGFIGHT (Real-Time) ✅ AGREED

### Weapons (earned through gameplay, NOT shop)
| Tier | Weapon | Damage | Style | Type |
|---|---|---|---|---|
| 1 | Pulse Laser | Low, fast fire | Blue beams | Hitscan |
| 2 | Plasma Cannon | Medium, medium rate | Green bolts | Projectile |
| 3 | Railgun | High, slow, precise aim | White beam | Hitscan |
| 4 | Quantum Disruptor | Very high, slow, splash | Purple explosion | Projectile |

### Ship Class Balance
| Class | Shield | Hull | Total | Speed | Special |
|---|---|---|---|---|---|
| Fighter | 30 | 70 | 100 | Fast | Double fire rate 3s |
| Cruiser | 50 | 100 | 150 | Medium | Repair drone |
| Stealth | 20 | 60 | 80 | Medium | Cloak 4s |
| Tank | 80 | 170 | 250 | Slow | Fortress 50% reduction |
| Racer | 15 | 50 | 65 | Fastest | Afterburner |

### Mechanics
- Shield regenerates 5%/s out of combat. Hull does NOT (repair station only)
- Shield absorbs first, then hull
- Hit detection: raycast for hitscan weapons, projectile physics for others
- Special abilities on cooldown per class
- Max 3 minutes per duel. Timeout → highest HP% wins

### Gear normalization: max 15% advantage. Skill > gear.

---

## PART 12: PvP AUTO-BATTLER / TURN-BASED CARD COMBAT ✅ AGREED

This IS the card combat system from Part 8. NOT a separate auto-sim.
Players play cards from their hand, each card triggers 3D ship animations.
Turn-based, strategic, like Magic the Gathering meets space combat.
See Part 8 for complete card system details.

---

## PART 13: 3D ASSET SHOPPING LIST (FINAL)

### Free Packs
| # | Asset | Ships | Link |
|---|---|---|---|
| 1 | Quaternius Ultimate Spaceships | 10 × 5 colors = 50 | https://quaternius.com/packs/ultimatespaceships.html |
| 2 | CraftPix Spaceship Pack (red/black) | 5-6 fighters | https://craftpix.net/freebies/free-spaceship-3d-low-poly-models-pack/ |
| 3 | Shepard.Alex Battleships (LARGE) | 8+ battleships | https://sketchfab.com/Shepard.Alex/collections/space-battleships-713910f64490413e9f25e3ef01e6d6b6 |
| 4 | JazOone Fighter (3 colors, 4K) | 1 × 3 | https://sketchfab.com/3d-models/spaceship-6164a883f57f4f13938c3c5999bc0e1f |
| 5 | valterjherson Sci-Fi Fighter | 1 | https://sketchfab.com/3d-models/sci-fi-aircraft-spaceship-fighter-99c1d15965c74f3aa7b5999e2d4e42e1 |
| 6 | Marius Ciulei Collection | 5+ mixed | https://sketchfab.com/omassyx/collections/sci-fi-ships-fab3063baae942268b2cbd7aaf0397e1 |
| 7 | CGTrader Asset Pack | 9 ships | https://www.cgtrader.com/free-3d-models/space/spaceship/spaceship-asset-pack |
| 8 | Free Cockpit + Seat | 1 cockpit | https://sketchfab.com/3d-models/spaceship-cockpit-seat-8fe765ad88bf4da4a32e3656dfbe9133 |
| 9 | Free Cockpit 02 | 1 cockpit | https://sketchfab.com/3d-models/sci-fi-spaceship-cockpit-02-c6825892999242319c1a29326c4e7713 |
| 10 | Modular Interior Pack | Station parts | https://sketchfab.com/3d-models/sci-fi-ship-interior-modular-asset-pack-50e2af8800cc4ab79add375f817b2d76 |
| | **FREE TOTAL** | **~40+ ships, 2 cockpits, parts** | |

### Paid Models (Option B — $90 / 585 kr)
| # | Asset | Price | What | Link |
|---|---|---|---|---|
| 1 | Spaceship+Cockpit+Interior+Bonus | $29.99 | Fighter, cockpit, seat, rifle, crate, 4K | https://www.fab.com/listings/81802f02-9377-4ca1-ac22-5c5b7e649922 |
| 2 | Space Fighter+Cockpit+Animations | ~$29.99 | Fast fighter, gatlings, animations | https://sketchfab.com/3d-models/space-fighter-with-cockpit-interior-animations-38e9ccb63dab45d7be44bb62c3b4d0b7 |
| 3 | Gunboat+Cockpit+Animations | ~$29.99 | Large gunboat, blasters, missiles, 4 anims | https://sketchfab.com/3d-models/spaceshipgunboat-with-cockpit-and-animations-2fa2d8ee30fa460cba3f6ee6c9d8afbc |

### Ship Class Mapping
- Fighter: JazOone, valterjherson, CraftPix, Demonic Arts fighters
- Cruiser: Quaternius medium, Marius Ciulei ships
- Stealth: dark-textured kitbash from Quaternius/CraftPix
- Tank/Battleship: Shepard.Alex (Excalibur, Leviathan, Valkyrie)
- Racer: stripped Quaternius variants, custom kitbash

### Total: 40+ free ships + 3 premium = 200+ variants via kitbash/texture swaps. Cost: 585 kr.

---

## PART 14: BUILD ORDER (FINAL)

| Phase | What | Status |
|---|---|---|
| 1 | Premium star map (bloom, nebula, effects, planet types) | AGREED |
| 2 | Level 1 Galaxy View (navigation) | AGREED |
| 3 | Free Flight + cockpit + asteroids + chase cam + NPCs | AGREED |
| 4 | Ship system + cosmetic shop (Stripe) | AGREED |
| 5 | Universe Chat (Supabase Realtime) | AGREED |
| 6 | Achievement system + title system | AGREED |
| 7 | PvP Races (Mario Kart power-ups, ghost race) | AGREED |
| 8 | Space stations + universe content + alien tech | AGREED |
| 9 | Missions (PvE — timed, exploration, story) | AGREED |
| 10 | PvP Dogfight (real-time combat) | AGREED |
| 11 | Turn-based Card Combat (collectible cards, crafting) | AGREED |
| 12 | Combat missions (pirate hunt, escort, base defense) | AGREED (needs phase 10) |
| 13 | GHAI integration | PARKED — needs ADVORA |

---

## PART 15: ALL DECISIONS CONFIRMED

- ✅ Realistic sci-fi visual style (Elite Dangerous level)
- ✅ Holographic cockpit HUD (blue orb, transparent)
- ✅ First-person cockpit + third-person chase cam (V toggle)
- ✅ Ship is real 3D model in scene
- ✅ All players fly together, PvP restricted by rank ±1
- ✅ PvP toggle (opt-in, visible glow)
- ✅ Duel zones in-universe, spectators watch, safe zones enforced
- ✅ Achievement ships soulbound
- ✅ Legendary ships PvP-only
- ✅ Shop sells looks, gameplay earns stats
- ✅ Fortnite-style shop rotation
- ✅ Mario Kart power-ups in races (rubber-banding)
- ✅ Ghost race v1, real-time v2
- ✅ Alien Tech: dynamic spawn, rank bypass, backfire 20%, 1 installed + 1 stored
- ✅ NPCs: patrol, pirates, caravans, probes, orbital traffic, defense
- ✅ Planet types with unique visuals (desert, ocean, ice, jungle, gas, volcanic, tech)
- ✅ Space stations: hub, owner, abandoned, repair, trading
- ✅ Universe Chat: global + system + /pm, moderation, commands
- ✅ Title system: compound titles from achievement fragments, AI-generated for rarest
- ✅ Card combat: 280 card types, Energy system, deck building, 3D animations per card
- ✅ Card crafting: disenchant, craft, imbue/fusion
- ✅ Card packs in shop ($2/$5/$10/$20)
- ✅ Missions: timed, exploration, combat, story, co-op, daily challenges
- ✅ Rank: Bronze→Legendary, matchmaking, gear normalization 15% cap
- ✅ No GHAI until ADVORA (Stripe only)
- ✅ Reset achievements on crypto migration, keep USD purchases
- ✅ Budget: 585 kr for 3D assets

---

## PART 16: CRYPTO / LEGAL (PARKED)

### Not building — waiting ADVORA
- GHAI shop payments
- Smart contract wagers
- NFT skins/cards
- voidexa fee on crypto wagers

### ADVORA Questions
- Skill-based crypto wager legality (Danish law + MiCA)
- Gambling license requirement?
- voidexa fee impact on legal status?
- Utility token (GHAI) vs ETH/USDC — different treatment?
- Item wager (not money) — different legal?

### Reset Policy
- Achievement unlocks RESET on crypto migration
- USD purchases STAY
- PvP items STAY
- Fresh wager system start
