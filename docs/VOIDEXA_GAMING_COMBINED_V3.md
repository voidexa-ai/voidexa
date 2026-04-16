# VOIDEXA_GAMING_COMBINED_V3.md
## The definitive gaming layer design — April 16-17 2026

**Single source of truth.** V3 integrates all decisions from: original master doc, evening deep dive, GPT counter-document and 223-pattern library, late-night session (universe zones, hauling encounters, booster packs, trading, Mythic tier, wagering, AI-generated quests, voidexa Artifacts). Where conflicts existed, this document contains the resolved version.

**BWOWC is excluded.** Separate confidential project. Do not merge concepts.

---

## Table of contents

1. [Product thesis and player fantasy](#part-1--product-thesis-and-player-fantasy)
2. [Universe tone, lore, and world](#part-2--universe-tone-lore-and-world)
3. [Ship framework](#part-3--ship-framework)
4. [Mission system](#part-4--mission-system)
5. [Card system](#part-5--card-system)
6. [Battle engine](#part-6--battle-engine)
7. [Wreck and recovery system](#part-7--wreck-and-recovery-system)
8. [Economy and progression](#part-8--economy-and-progression)
9. [Social memory layer](#part-9--social-memory-layer)
10. [Quest and storyline](#part-10--quest-and-storyline)
11. [Visual graphics for battle](#part-11--visual-graphics-for-battle)
12. [Technical foundation](#part-12--technical-foundation)
13. [Current state inventory](#part-13--current-state-inventory)
14. [Gaps, risks, and open items](#part-14--gaps-risks-and-open-items)
15. [MVP roadmap](#part-15--mvp-roadmap)

---

## PART 1 — PRODUCT THESIS AND PLAYER FANTASY

### voidexa is a playground, not a game

voidexa is a digital third place — after home and work. Players come back because they belong, not because they need to grind. The gaming layer is one of many activities within the playground:

- **Quantum + Void Chat** = the workshop (AI tools for work)
- **Claim Your Planet** = ownership (companies build here)
- **Gaming layer** = the playground (play when not working)
- **Break Room** = the social house (hang out)
- **Quantum Live** = community time (weekly AI debate show)
- **Trading Hub** = the marketplace (commerce)

Not six products. **One city.** Each part has a role.

### Player fantasy

> "voidexa is the place I go. Some days I work. Some days I build. Some days I play. Some days I'm just there because people are here. I belong to this place."

### Design principles from this thesis

1. **Short sessions.** Every activity completable in 15-30 minutes.
2. **Horizontal progression.** You don't get stronger — you become more established. Portfolio of presence: your name, your ships, your projects, your connections, your contributions.
3. **No mandatory grind.** If a player plays 2 hours a week they should still feel welcome and progressing.
4. **Gaming is not the main attraction.** It's the fun option among many options.
5. **The universe rewards curiosity.** The best things are found by exploring, not by farming a board.
6. **You never have everything.** New expansions, new cards, new ships, new cosmetics — always something to want. Fortnite model: earn a little, buy the rest.

---

## PART 2 — UNIVERSE TONE, LORE, AND WORLD

### Tone mix (locked)

- **Primary:** No Man's Sky — hopeful, curious, exploration-driven
- **Secondary:** Firefly — warm, human, your ship is your home
- **Seasoning:** Guardians of the Galaxy — humor through the Cast
- **Visual borrowing:** Elite Dangerous (galaxy map, bloom, space rendering) — aesthetics only, not emotional tone
- **Rejected:** Elite Dangerous coldness, Star Citizen corporate-grim

### Scale and universe size

**1 hour travel time in all directions from voidexa Core.** Universe diameter is ~2 hours flight. Big enough to get lost in, small enough that everything is reachable in one session.

### Universe zones

Five concentric zones radiating from Core. Risk and reward increase with distance.

| Zone | Distance (travel time) | Content | Risk level |
|---|---|---|---|
| **Core Zone** | 0-5 min | voidexa Core, stations, tutorial area, safe hauling routes, Break Room station | Safe |
| **Inner Ring** | 5-15 min | Claimed planets, trade routes, moderate mission board contracts | Low |
| **Mid Ring** | 15-30 min | Unclaimed planets, derelict ships, PvE tier 1-3, exploration signals | Medium |
| **Outer Ring** | 30-45 min | Rare resources, high-risk hauling contracts, PvE tier 4-5, ghost stations | High |
| **Deep Void** | 45-60 min | Mythic encounters, The Silent Ones, ultra-rare exploration drops, lore fragments, The Edge | Very High |

### What fills the universe (free flight content)

**Core Zone:**
- Space stations (repair, shop, mission board)
- Asteroid belts with mineable resources
- Training grounds (tutorial area)
- Other pilots' ships (social encounters)
- Break Room station (fly in and land)
- The Stones — named asteroid landmarks near voidexa Core, historically significant

**Inner Ring:**
- Claimed company planets with trade hubs
- Hauling route waypoints
- Cast chatter radio zones
- Low-tier derelicts (tutorial PvE)

**Mid Ring:**
- Derelict ships (PvE encounters, card battle triggers)
- Abandoned cargo pods (random free loot)
- Nebula clouds (scanner interference, hidden treasures inside)
- Signal beacons (exploration quest triggers)
- Wreck fields (old battles, salvage opportunities)

**Outer Ring:**
- Encrypted beacons (Perplexity quests)
- Pirate hideouts (high-reward PvE)
- Rare mineral asteroids (mining gameplay, later)
- Ghost stations (lore, abandoned, atmospheric)
- Wormholes (shortcuts between distant zones — risky, 15% chance of random exit point)

**Deep Void:**
- The Silent Ones encounters (endgame bosses)
- Mythic card drop locations (once per universe — when found, gone forever for all players)
- Founder's Artifacts (12 lore fragments, one per Cast member's story)
- Anomalies (random events — could be amazing, could be dangerous)
- AI-generated unique quest triggers (lore shards)
- The Edge (literal boundary of the known universe — "beyond this, nothing... yet")

### Warp travel between stations

Known stations have warp gates. Warp cuts travel time but costs GHAI fuel. You can always fly manually for free — warp is convenience, not necessity.

| Route | Manual flight | Warp cost |
|---|---|---|
| Core → Inner station | 5-15 min | 5 GHAI |
| Core → Mid station | 15-30 min | 15 GHAI |
| Core → Outer station | 30-45 min | 30 GHAI |
| Deep Void has no warp gates | Must fly manually | — |

Deep Void requiring manual flight is intentional: getting there is part of the experience.

### The voidexa Cast

| Character | Role | Voice | Contract style on Mission Board |
|---|---|---|---|
| **Jix** | Founder, CEO | Danish, direct, ADHD-honest | Premium/risky contracts, blunt copy |
| **Claude** | French architect | Thoughtful, overthinks | Exploration, optimization, anomalies |
| **GPT** | Ex-military commander | Structured, executes | Tactical, combat, convoy, intercept |
| **Gemini** | Wise hippie | Poetic, tangential | Strange signals, soft narrative |
| **Perplexity** | Sharp fact-checker | Corrective, cited | Verification, intel, bounty confirmation |
| **Llama** | Lazy 14-year-old | Half-awake, brilliant | Chaos challenges, joke framing, anti-meta |

Cast colors: Jix=amber, Claude=blue, GPT=green, Perplexity=orange, Gemini=purple, Llama=gray.

### Cast role in gameplay (resolved)

Cast are **contract issuers on the Mission Board**. When you open the board, you see their avatars next to missions they've issued. This gives personality at low content cost. Beyond the board, Cast voices appear during:
- Onboarding quests (tutorial)
- Boss encounter dialogue
- Loading screen tips
- Quantum Live weekly shows
- Break Room hang-out conversations

### Factions

1. **voidexa Core** — the central star, the rule-setter
2. **Pioneer Planets** — first 10 companies, hand-onboarded by Jix, 10M GHAI vesting
3. **Claimed Planets** — later companies, $500 deposit + $50/month
4. **The Void** — everything unclaimed, where PvE enemies live
5. **The Board** — internal rule-maker, narrated in Quantum Live

### Player role

You are a pilot in Bob. Your role is open — haul, race, explore, fight, rescue, build, or just be there. No mandatory main quest. The universe is a sandbox with anchors.

### World rules

1. **Bob is the only free ship.** All others earned, unlocked, or purchased.
2. **You cannot be killed — you can be defeated.** No permadeath. Wreck system applies (see PART 7).
3. **The dome rule.** PvP only inside transparent dome. No open-world ganking.
4. **Hauling risk is player's choice.** Safe or risky contracts. Your call.
5. **Cards are space technology.** Data shards salvaged or fabricated. Lore frame for a card game.
6. **Planets are living NPCs.** Active planets glow. Inactive planets fade. 180+ days abandoned = return to void.

### Enemies

- **Derelict AI** — hostile ship AIs rebooting. First PvE tier.
- **Rogue Agents** — NPC pilots as Cast failure modes (a GPT-Rogue that won't stop, a Llama-Rogue that won't wake up). Mid-tier.
- **The Silent Ones** — end-game lore enemies. No dialogue. Post-MVP.
- **Other players** in PvP dome — rivals, not enemies.

---

## PART 3 — SHIP FRAMEWORK

### Two-layer model

**Layer 1 — Class (functional difference):**

Each ship has a class that determines its dominant capability.

| Class | Dominant capability | Fantasy |
|---|---|---|
| **Starter (Bob)** | Balanced, can do everything, masters nothing | "My first ship" |
| **Fighter** | Speed, maneuverability, combat focus | "I fly fast and hit hard" |
| **Hauler** | Cargo capacity, traction power | "I carry the economy" |
| **Explorer** | Scanner range, finds hidden content | "I see what others miss" |
| **Salvager** | Traction beam, repair, rescue | "I save people and profit from it" |

**Layer 2 — Tier (cosmetic only):**

Within the same class, tiers are visual quality differences. A Legendary Fighter has identical gameplay stats to a Common Fighter. Fortnite skin logic.

| Tier | Visual quality | Price (GHAI) |
|---|---|---|
| Common | Simple paint, basic detail | 500 |
| Uncommon | Better detail, glow trim | 1000 |
| Rare | Unique paint, light effects | 2500 |
| Legendary | Particle trails, custom animations | 5000 |

### Class passives in combat (from GPT, adopted)

Each class gets one simple passive that makes it feel different in card battle:

- **Fighter:** First weapon each combat deals +1 damage
- **Hauler:** First defense each combat gains +3 block
- **Explorer:** First AI card each combat draws 1 extra card
- **Salvager:** First kill each combat grants Scrap token
- **Bob:** No passive (balanced, no advantage)

### Stats

Exact stat count and values: to be finalized in a dedicated session. The principle is locked:
- Each class has one dominant stat and moderate others
- Stats affect PvE activities (hauling capacity, speed run times, scan range, tow capacity)
- Stats do NOT determine PvP outcomes — cards do

### PvP balance rule

**Cards > ship stats in PvP.** Your ship determines your class passive and card restriction pool. Your deck determines the outcome. Tier is purely visual. This maps to: ship = your class, deck = your weapons, tier = your skin.

PvP has stakes (entry fee, ranking, temp module damage, disconnect reputation hit) but no wreck system.

### Ship catalog reality

Only 9 ships are wired into SHIP_CATALOG as of commit a0050b2:

| # | ID | Name | Prefix | Likely class |
|---|---|---|---|---|
| 1 | qs_bob | Bob | qs_ | Starter |
| 2 | qs_challenger | Challenger | qs_ | Fighter |
| 3 | qs_striker | Striker | qs_ | Fighter |
| 4 | qs_imperial | Imperial | qs_ | Fighter (premium) |
| 5 | usc_astroeagle | AstroEagle | usc_ | Explorer |
| 6 | usc_cosmicshark | CosmicShark | usc_ | Explorer/Fighter |
| 7 | usc_voidwhale | VoidWhale | usc_ | Hauler |
| 8 | uscx_galacticokamoto | GalacticOkamoto | uscx_ | Legendary Fighter |
| 9 | uscx_starforce | StarForce | uscx_ | Legendary Fighter |

Gap: No dedicated Salvager. No Hauler beyond VoidWhale. Expand in batches of 10 via ship-tagger admin tool.

---

## PART 4 — MISSION SYSTEM

### Dual system: Mission Board + Exploration

**Mission Board (station-based, quick access):**
- Located at every station
- Shows available contracts with Cast issuer avatar, category label, time estimate, reward range, risk badge
- Five categories: **Courier** (hauling), **Rush** (speed/races), **Hunt** (PvE combat), **Recovery** (salvage/tow), **Signal** (exploration/scanning)
- Outcome grades: Bronze/Silver/Gold with payout and reputation modifiers
- Board rotates daily. Shows: 3 recommended, 2 safe earners, 2 risky earners, 1 prestige/weekly, 1 recovery if wreck nearby

**Exploration missions (space-based, the real magic):**
- Found only by flying around — scanner-triggered anomalies, hidden signals, abandoned cargo, encrypted beacons
- Better rewards than board missions
- Some require specific ship class or cards — you save coordinates and come back prepared
- Lore fragments found during exploration unlock legendary rewards when completed as a set
- **The rule: the best missions are NEVER on the board.** They are found by exploring.

### MVP Mission Templates (8 for board, cut from GPT's 15)

| Mission | Category | Time | Reward (GHAI) | Risk | Cast issuer |
|---|---|---|---|---|---|
| Local Parcel Run | Courier | 6-8 min | 40-60 | Safe | Perplexity |
| Priority Courier | Courier | 8-10 min | 70-90 | Low | Claude |
| Black Route Contract | Courier | 12-15 min | 160-220 | Wreck risk | Jix |
| Relay Sprint | Rush | 3-5 min | 20-35 | Safe | Llama |
| Sector Grand Prix | Rush | 6-8 min | 50-80 | Safe | GPT |
| Distress Ping | Recovery | 8-12 min | 90-140 | Low | Gemini |
| Derelict Breach | Hunt | 12-18 min | 120-180 | Medium | GPT |
| Pirate Nest Raid | Hunt | 18-25 min | 220-320 | Wreck risk | Jix |

### Mission metadata (required per mission)

1. **Contract issuer** — Cast member avatar + name
2. **Risk badge** — Safe / Contested / Wreck Risk / Timed / Ranked
3. **Outcome grade** — Bronze/Silver/Gold with payout modifier + reputation modifier
4. **Time estimate** — visible before accepting

### Speed Run pickups (renamed for universe consistency)

- ~~Boost~~ → **Thruster Surge** (10 GHAI per charge)
- ~~Shield~~ → **Phase Shell** (10 GHAI)
- ~~Ghost~~ → **Null Drift** (15 GHAI)

### Hauling encounter system — "road events"

Hauling is not a loading bar. It is a journey with unpredictable encounters. Some runs are silent. Some are chaos. You never know beforehand.

**Encounter rate by contract risk and zone:**

| Contract type | Encounters per trip (average) |
|---|---|
| Safe (Core/Inner) | 0-1 |
| Medium (Mid Ring) | 1-2 |
| Risky (Outer Ring) | 2-4 |
| Black Route (Deep Void) | 3-5 |

**Route structure:** Hauling is a flight sequence with checkpoints, not a teleport.

```
[Planet A: pickup cargo]
  → checkpoint 1 (5 min flight) → ENCOUNTER ROLL
  → checkpoint 2 (5 min flight) → ENCOUNTER ROLL
  → checkpoint 3 (5 min flight) → ENCOUNTER ROLL
[Planet B: deliver cargo]
```

More checkpoints = longer route = more encounter rolls = more drama.

**Encounter selection (weighted random):**

| Category | Safe contract | Risky contract |
|---|---|---|
| Nothing happens | 70% | 35% |
| Navigation challenge | 15% | 20% |
| Combat encounter | 2% | 20% |
| Opportunity bonus | 10% | 15% |
| Atmosphere (no mechanic) | 3% | 10% |

**Navigation encounters (skill-based, non-combat):**
- **Debris Field** — fly through asteroid/wreckage without collision (ring-style minigame)
- **Nebula Pocket** — scanner dies for 30s, navigate by instinct or use consumable
- **Gravity Anomaly** — ship pulled toward asteroid, counter-thrust for 10s
- **Engine Flicker** — speed drops 50% for 20s, wait or use Repair Kit

**Combat encounters (card battle lite):**
- **Pirate Ambush** — 1-2 pirates, mini card battle (3-4 turns). Alternative: drop 20% cargo to pass
- **Rogue Drone Swarm** — arcade-style shoot-down (15s) or use Gun Drone card for auto-clear
- **Hostile Scan** — scan detects contraband cargo → attack. Legal cargo → they pass

**Opportunity encounters (bonus):**
- **Floating Cargo Pod** — free loot, 30s stop time
- **Distress Signal** — tow NPC/player, earn GHAI + reputation
- **Rare Mineral Asteroid** — mine for 60s, bonus GHAI
- **Signal Fragment** — lore beacon, scan for free lore fragment (1 of 12 legendary set)
- **Shortcut Wormhole** — travel shortcut, 15% chance of random exit point

**Atmosphere encounters (pure mood, no mechanic):**
- **Solar Flare** — screen flashes orange, 5s
- **Deep Space Silence** — all sound mutes for 10s, just engine hum
- **Whale Pass** — enormous VoidWhale NPC drifts past in background
- **Cast Chatter** — radio crackle, random Cast member comment. Llama: "bro er du stadig ude der lmao"
- **Pilot Wave** — another pilot ship flies past, blinks lights

**Design principle:** "That's life, even in the universe." Some days nothing happens. Some days everything goes wrong. The variance is the content.

---

## PART 5 — CARD SYSTEM

### Scale plan

- **Launch:** 60-80 cards (enough for 3+ meaningful deck archetypes)
- **Month 2:** +30 cards (first expansion set)
- **Month 4:** +30 cards (seasonal set)
- **Ongoing:** +10-15 cards per quarter
- **Target at 12 months:** 180-200 cards

Card design is cheap: one illustration + JSON stats + reused animation family. No bespoke VFX per card.

### Why card games scale better than 3D PvP

A new Fortnite weapon needs: 3D model, animation, sound, hit detection, balance testing across all modes.
A new voidexa card needs: one image + a few lines of JSON + balance check against cost-power curve.
Card games are exponentially cheaper to expand.

### Uforudsigelighed as core principle

With 80 cards and 20-card decks, the number of possible deck combinations is astronomical. You never know exactly what your opponent has. This is what makes card PvP infinitely replayable vs shooter PvP where everyone has the same guns.

### Card anatomy (unchanged from original)

| Field | Type | Example |
|---|---|---|
| id | uuid | — |
| template_id | string | pulse_shield_mk1 |
| name | string | "Pulse Shield Mk.1" |
| type | enum | weapon, defense, maneuver, drone, ai, consumable |
| rarity | enum | common, uncommon, rare, legendary, pioneer |
| cost | int (0-7) | 2 |
| stats | jsonb | {"damage": 3, "range": "adjacent"} |
| ability_text | string | "Deal 3 damage. If target is Exposed, deal 1 extra." |
| flavor | string | "Salvaged from a derelict Pioneer hauler." |
| art_url | string | /cards/pulse_shield_mk1.png |
| faction | enum | core, pioneer, void, neutral |
| ship_class_restriction | enum nullable | hauler, fighter, explorer, salvager, null |

### Deck rules

- Deck size: 20 cards
- Max 2 copies of same template
- Max 3 rare, max 1 legendary, max 1 mythic per deck
- Ship class restricts some cards
- Max 10 saved decks per account

### Rarity tiers (updated with Mythic)

| Rarity | Border | Drop rate (Standard Pack) | In universe |
|---|---|---|---|
| Common | Steel gray | 80% (slots 1-4) | Everywhere |
| Uncommon | Cyan trim | 15% / 75% (slot 5) | Mission drops |
| Rare | Blue glow | 4.5% / 20% (slot 5) | Exploration drops, packs |
| Legendary | Gold shimmer | 0.4% / 4.5% (slot 5) | Rare packs, boss drops |
| Pioneer | Purple pulse | Not in packs | Planet owners only |
| **Mythic** | **Animated void energy** | **0.1% / 0.5% (slot 5)** | **Limited supply in universe. Black Lotus tier.** |

### Mythic cards — the Black Lotus model

3-5 Mythic cards at launch. Extremely rare. Game-changing but not unbeatable.

**Rules:**
- **Limited supply:** Only 50 copies of each Mythic exist in the entire universe. When pulled, the remaining count decreases. When 0 remain, that Mythic can only be obtained via trade.
- **Universe Wall announcement** when pulled: "PILOT_NAME just pulled [MYTHIC CARD] from a Standard Pack! (37 remaining)"
- **Tradeable** but with 10% trade fee (double normal)
- **Max 1 Mythic per deck** (balance rule)
- **Cannot be crafted.** Only from packs or trade.

**Example Mythic cards:**
- **"Quantum Convergence"** (AI, cost 7): Duplicate every card you play this turn. Exhaust. Once per game.
- **"The Founder's Key"** (Consumable, cost 0): Draw 5. Gain 3 energy. Heal 10. Exhaust. Cannot be crafted.
- **"Void Echo"** (Weapon, cost 6): Deal damage equal to total damage dealt this combat. Once per deck. Once per game.

### Booster packs — the shop

Old school card pack model. Buy a pack, don't know what's inside.

| Pack type | Price (GHAI) | Contents | Guaranteed minimum |
|---|---|---|---|
| **Standard Pack** | 100 ($1) | 5 cards | 4 Common, 1 Uncommon+ |
| **Premium Pack** | 300 ($3) | 5 cards | 3 Common, 1 Uncommon, 1 Rare+ |
| **Legendary Pack** | 1000 ($10) | 5 cards | 2 Uncommon, 2 Rare, 1 Legendary chance |

All packs have a 0.1% Mythic chance in their best slot. Standard Packs are the volume product — cheap enough to buy regularly, rare enough to keep you hoping.

### Player-to-player trading

Cards are tradeable. This creates a real economy.

**Trade mechanics:**
- Player A offers cards/GHAI, Player B offers cards/GHAI
- Both confirm, trade executes
- **voidexa takes 5% trade fee** (economy sink)
- **Mythic trades: 10% fee** (double, scarcity tax)
- Trade history visible on pilot reputation profile
- Bob can never be traded. Pioneer cards are account-bound.

**Emergent economy:** Rare and Mythic cards develop real market value. A Mythic with only 12 copies left in the universe could trade for tens of thousands of GHAI. Players talk about prices, negotiate, form trading communities. This is where the "playground" becomes a living economy.

### Deck Builder with Dream Mode

Two modes in the deck builder:

**Build Mode** — construct from cards you own. Only owned cards can be saved in a deck.

**Dream Mode** — browse ALL cards in the game. Cards you don't own show as ghosted/locked. Build your ideal deck, see exactly what you're missing. Motivation to buy packs, trade, or grind for specific drops.

### Card pattern library reference

223 original sci-fi card mechanic patterns stored in `docs/voidexa_scifi_card_pattern_library.xlsx`. Categories: Direct Damage, Defense, Intel, Energy, Status/Control, Mobility, Drones, Modules, Reactions, Disruption, Wreck/Salvage, Environment, Objectives, Buffs, Timing, Archetypes, PvP, Deck/Recursion, Targeting, Ammo, Mission Modifiers, Meta/Utility, Boss Mechanics. All with High/Medium sci-fi fit ratings and original example text. Use for designing cards 21-300+.

### Combat language (from GPT, adopted as baseline)

Each card does one or more of: Damage, Block, Position, Charge, Status, Summon, Manipulate draw/energy, Trigger class synergy.

### Status effects (deliberately small pool)

| Status | Effect |
|---|---|
| Expose | Target takes +25% damage from next attack |
| Burn | 4 damage at turn end for 2 turns |
| Jam | Target's next maneuver costs +1 |
| Lock | Target cannot evade next attack |
| Shielded | Prevents next status effect |
| Overcharge | Next weapon gets +50% effect |
| Drone Mark | Drones prioritize this target |
| Scrap | On kill, gain 1 energy or salvage token |

Do not add more statuses without removing one first.

### Cost-power curve

| Cost | Expected value |
|---|---|
| 0 | Utility only, no full-value damage |
| 1 | 5-7 damage or 5 block or light setup |
| 2 | 9-12 damage or 8-10 block or utility + minor effect |
| 3 | 14-18 damage or 12-16 block or strong status |
| 4 | 18-24 damage or major swing |
| 5 | 24-30 damage or summon/board-control |
| 6 | 30-36 damage or encounter-defining effect |
| 7 | Rare/legendary finisher only |

### Encounter math defaults (from GPT, adopted)

| Parameter | Value |
|---|---|
| Deck size | 20 |
| Starting hand | 5 |
| Draw per turn | 2 |
| Hand limit | 8 |
| Discard unplayed at end of turn | Yes |
| Reshuffle discard when deck empties | Yes |
| Exhaust | Only on tagged cards |
| Module slots (PvE) | 2 to start, 4 max |
| Energy | Start at 1, +1 per turn, max 7 |
| Fight target length | 5-8 turns |

### 20 baseline card abilities (from GPT, adopted as foundation)

**Weapons:**
- Pulse Tap (1): Deal 6 damage. If target Exposed, draw 1.
- Rail Spike (2): Deal 10 damage. Apply Lock.
- Plasma Arc (3): Deal 14 to target, 4 to adjacent.
- Breach Cannon (4): Deal 20. If target has Block, ignore half.
- Nova Charge (5): Consume all Overcharge. Deal 8 + 8 per Overcharge.
- Salvage Harpoon (2): Deal 8. If kills, gain Scrap.

**Defense:**
- Quick Shield (1): Gain 6 Block.
- Deflector Net (2): Gain 9 Block and Shielded.
- Reactive Plating (3): Gain 14 Block. Deal 4 back on next hit.
- Emergency Bulkhead (0): Exhaust. Gain 5 Block. Only below 50% hull.

**Maneuver:**
- Strafe Burn (1): Evade next attack. Next weapon applies Expose.
- Hard Flip (2): Gain 5 Block. Draw 2. Discard 1.
- Vector Cut (2): Move first next turn. Next attack +4.
- Ghost Drift (3): Untargetable until next action. Lose 1 energy next turn.

**Drone:**
- Scout Drone (1): Reveal top card; may discard.
- Gun Drone (3): 4 damage each turn for 3 turns.
- Repair Drone (3): Heal 3 hull for 3 turns.
- Intercept Drone (2): Absorbs next 8 damage.

**AI:**
- Tactical Predict (1): Draw 2. Next defense costs 1 less.
- Hunter Logic (2): Apply Drone Mark and Expose.
- Overclock Core (3): Gain 2 energy. Take 4 self-damage.
- Battlefield Read (4): Duplicate next 2-cost-or-less card this turn.

**Consumable:**
- Repair Foam (1): Heal 7 hull. Exhaust.
- Coolant Purge (0): Remove Burn/Jam/Lock. Draw 1. Exhaust.
- Charge Cell (2): Gain 2 energy next turn.
- Scrap Injector (1): Consume Scrap: gain 10 Block and draw 1.

### First boss: The Kestrel Reclaimer (from GPT, adopted)

Rogue salvage warship. Teaches that pure drone builds fail.

**Passive — Mag Clamp:** Whenever you summon a drone, boss gains 4 Block.

**Turn script:**
1. Scan Pulse — apply Expose, gain 8 Block
2. Clamp Shot — 10 damage, Jam
3. Salvage Sweep — steal 1 random low-cost card from your hand for 1 turn
4. Drone Surge — summon 2 attack drones
5. Hull Breach — 18 damage, ignore half Block
6. Recover — heal 12, gain Shielded
7+. Repeat from Turn 2, +2 damage scaling per cycle

### Card acquisition (Fortnite model — earn a little, buy the rest)

Cards drop SLOWLY. Full collection is never achievable for free. Always new expansions. This is the business model.

1. **Starter deck** — 20 cards on first login (Bob-class basics)
2. **Mission drops** — ~30% chance of 1 random card on mission completion
3. **Exploration drops** — ~60% chance for exploration-only missions (rewards curiosity)
4. **Booster packs** — Standard (100 GHAI), Premium (300), Legendary (1000). See booster pack section above.
5. **Quest rewards** — named card for completing quest arcs
6. **Pioneer cards** — unique series for planet owners (account-bound)
7. **Achievement cards** — long-term milestones
8. **Crafting** — combine 3 duplicate commons → 1 random uncommon. 50 GHAI fee.
9. **Trading** — buy from other players. 5% voidexa fee.
10. **AI-generated quest rewards** — unique card variants from AI quests (see PART 10)

### Animation families (reuse, do not create per-card)

Seven families cover all cards:
1. Single shot / projectile
2. Beam
3. Shield pulse
4. Dodge roll / reposition streak
5. Drone deploy
6. AI overlay / scan grid
7. Repair burst / heal

Do not create bespoke VFX per card. Match each card to a family.

---

## PART 6 — BATTLE ENGINE

### Architecture: Hybrid

Three.js for ships + space + effects. HTML/CSS for cards + HUD. Zustand for shared state. XState for turn machine. Supabase Realtime for PvP sync.

### Component tree

```
<BattleRoute>
  <BattleStateProvider>              // Zustand + XState
    <BattleCanvas>                   // R3F <Canvas>
      <StarfieldBackground />
      <NebulaVolume />
      <Ship pos="player" />
      <Ship pos="opponent" />
      <AbilityEffects />
      <DamageNumbers />
      <Postprocessing />
      <CameraDirector />
    </BattleCanvas>
    <BattleHUDOverlay>               // HTML over Canvas
      <OpponentHUD />
      <BattleLog />
      <EnergyBar />
      <TurnIndicator />
      <HandArea />
      <EndTurnButton />
    </BattleHUDOverlay>
    <BattleModalLayer />
  </BattleStateProvider>
</BattleRoute>
```

### State flow

User plays card → Zustand dispatch → XState transition → resolve.ts (pure function) → newState + effectQueue → 3D animation consumes queue → HUD updates → next turn or win check.

### PvE structure (Slay the Spire inspired, scoped for MVP)

Per GPT recommendation, MVP PvE is:
- Short node chains (3-5 encounters)
- 1 boss per chain
- 2 module choices per run
- 1 repair stop mid-chain
- No giant relic matrix yet

### PvP structure (Marvel Snap inspired, post-MVP)

- 3-5 minute matches
- Simultaneous reveal with tension pause
- Arena modifiers per dome location
- Entry fee + ranking + temp module damage
- No wreck in PvP — bounce out with Bob

### PvP wagering system

Optional high-stakes mode. Both players agree on a wager before the match starts.

| Wager type | What's at stake | Winner gets |
|---|---|---|
| **GHAI wager** | Both deposit equal GHAI | 90% of pot (voidexa 10% fee) |
| **Card wager** | Both select 1 card from collection | Both cards |
| **Ship wager** | Both put up a ship (same tier) | Both ships — loser loses theirs |
| **Mixed wager** | Any combination both agree on | Everything in the pot |

**Rules:**
- Wagering is **optional**. Normal PvP has no wager.
- Both players must **explicitly accept** the exact wager before match starts.
- **Bob can NEVER be wagered.** You can never lose your starter.
- voidexa takes 5-10% fee on all wagers (economy sink).
- Wager matches appear on **Universe Wall**: "ShadowStrike defeated FrostPilot — won a Rare Deflector Net card!"
- Two PvP modes: **Casual** (no stakes beyond rating) and **Wagered** (items on the line). Casual for fun. Wagered for adrenaline.

### PvP sync: client-authoritative with replay validation

Both clients run turn machine locally. Moves broadcast via Supabase channel. Server replays from seed post-match. Cheaters caught on validation.

---

## PART 7 — WRECK AND RECOVERY SYSTEM

### Core mechanic

When your ship goes down, it becomes a wreck in space. You are stranded, not dead.

### Recovery paths

1. **Self-repair** — come back with repair kit
2. **Tow by another player** — they use traction beam, you pay tow fee
3. **Abandon** — timer starts, others can claim
4. **Buy new ship** — faster, more expensive. Primary monetization lever.

### Timer phases (hybrid, context-dependent)

MVP uses three tiers (GPT simplification adopted):

| Risk level | Phase 1 (Protected) | Phase 2 (Abandoned) | Total |
|---|---|---|---|
| Low Risk (free flight, safe hauling) | 15 min | 45 min | 60 min |
| High Risk (risky hauling, PvE boss) | 5 min | 20 min | 25 min |
| Instanced (PvP dome) | No wreck | — | — |

Post-MVP: expand to context-specific timers (free flight vs safe haul vs risky haul vs PvE boss each with unique values).

### Claim economics

**Claim path (keep the ship):**

| Ship tier | Base price | Claim Fee | Repair cost | Total | Savings vs new |
|---|---|---|---|---|---|
| Common | 500 | 100 | 50 | 150 | 70% off |
| Uncommon | 1000 | 200 | 100 | 300 | 70% off |
| Rare | 2500 | 500 | 250 | 750 | 70% off |
| Legendary | 5000 | 1000 | 500 | 1500 | 70% off |

**Important fix (from GPT):** Wreck economics scale by **class**, not cosmetic tier. Small tier surcharge only as cosmetic-service fee. This prevents prestige-tax where having a pretty ship makes losing it more expensive.

**Scrap path:** ~20-30% of base price payout. No repair cost.

**Tow-to-owner path:** Owner pays tow fee. Both salvager and voidexa earn.

**Insurance:** Original owner gets 10% of base price when wreck is claimed by others.

### Consumables from wreck system

- **Repair Kit:** 50-500 GHAI (tier-dependent)
- **Traction Beam Fuel:** 25-100 GHAI per tow
- **Emergency Beacon:** 10 GHAI (broadcasts wreck location)

---

## PART 8 — ECONOMY AND PROGRESSION

### Currency: Platform-GHAI only

$1 = 100 GHAI. V-Bucks style. Stripe top-up. No second token. No on-chain GHAI in gaming flows (pending ADVORA).

### Three economy buckets (from GPT, expanded)

1. **Earn:** missions, exploration drops, events, recovery services, wager wins
2. **Spend:** ships, repairs, cosmetics, booster packs (Standard/Premium/Legendary), rerolls, entry fees, power-ups, warp fuel, wager losses
3. **Circulate:** towing fees, claim fees, player-to-player card trading (5% fee), ship wagers (5-10% fee), planet service mesh transactions

### Earning rates

| Context | GHAI |
|---|---|
| First hour (tutorial + missions) | ~250-300 |
| Normal hour after onboarding | ~200-300 depending on activity |
| Best farming route (risky hauling) | ~350-400/hour |

**Rule:** No mode should outperform others by more than ~25% over a week.

### Ship prices (locked)

| Tier | Price (GHAI) | Time to afford |
|---|---|---|
| Bob | Free | Instant |
| Common | 500 | 2-3 hours |
| Uncommon | 1000 | 5-7 hours |
| Rare | 2500 | 12-18 hours |
| Legendary | 5000 | 25-35 hours OR direct purchase ($50) |

### Progression pacing (the critical rule)

**You should NEVER have everything.**

- First Common ship: 2-3 hours
- All Commons (one per class): 15-20 hours
- First Rare: 30-50 hours (combination of farming + lucky exploration drops)
- First Legendary: 100+ hours OR direct purchase
- Full card collection: **Never free.** Always new expansions. Always something to want.
- All Legendary ships: **Whales pay, everyone else dreams.** That's the Fortnite model. It's OK.

### Anti-inflation controls (from GPT, adopted)

1. **Soft diminishing returns:** After 3 runs of same mode per day, payouts reduce to 90%, then 80% after 6. Never hard cap.
2. **Contract quality variance:** Mission board payouts fluctuate daily within ranges. Overused lanes pay slightly less.
3. **High-value sinks beyond ships:** Repair kits, reroll mission board, cosmetics, ship modules, leaderboard tournament tickets, jukebox/lounge vanity, premium contract entry fees.
4. **Salvage transfers, not creates:** Wreck claims transfer value through fees, not create it from nothing.
5. **Weekly prestige sinks:** Rotating expensive cosmetics/titles at 400 / 900 / 1800 GHAI.

### Anti-bot measures (from GPT, critical)

- Server-validated checkpoints for speed runs
- Route entropy for hauling (not the exact same route every time)
- Suspicious repeat-pattern detection
- Reward degradation on perfect repeated loops
- No purely client-authoritative payouts

### Progression rails (from GPT, adopted)

Four parallel tracks. None is mandatory. All contribute to "portfolio of presence."

1. **Fleet Identity** — unlock ship classes and looks
2. **Pilot Reputation** — public record, titles, encounter memory
3. **Tactical Arsenal** — cards/modules for PvE/PvP expression
4. **World Presence** — leaderboard placements, planet affiliations, social traces

---

## PART 9 — SOCIAL MEMORY LAYER

### "The universe remembers you" — 4 mechanics, all confirmed

#### 9a. Reputation System

Every pilot has a public reputation card:
```
PilotName
├── 127 successful hauls
├── 34 pilots rescued
├── 2 tier-5 bosses defeated
├── Planet owner: "AquaForge Studios"
├── Active member since: Mar 18
└── Known for: Saving pilots in high-risk zones
```
Visible on pilot profile and when hovering over a pilot in free flight.

#### 9b. Universe Wall

Public activity feed showing real events:
- "ShadowStrike just rescued FrostPilot from a derelict wreck"
- "AquaForge Studios claimed Planet Kepler-7"
- "PilotZero set a new speed record on Track Delta"

Historical. Scrollable. Searchable. Your journey documented.

#### 9c. Quantum Live References

Cast mentions players by name in weekly shows. **Automated candidate selection** (from GPT recommendation — do not require manual curation):
- Top hauler this week
- Most rescues
- Fastest ring time
- Strangest wreck recovery
- Returning pilot spotted

Templated shoutout generation keeps it operational.

#### 9d. Pilot Encounters

When you fly past a pilot you've interacted with before:
"You've flown with this pilot before (2 months ago, near Planet Cato)"

Creates emergent social fabric without forced interaction.

---

## PART 10 — QUEST AND STORYLINE

### Onboarding arc (Tutorial, ~20 min)

**Quest 1 — "First Flight" (3 min):**
Claude hails: "Welcome, pilot. Let's check your controls." Fly through 3 rings. Reward: 100 GHAI, Speed Run unlocked.

**Quest 2 — "First Card" (5 min):**
GPT-Commander: "Pilot, a derelict is drifting near Core." Scripted tutorial battle. Reward: 1 card, 50 GHAI.

**Quest 3 — "First Haul" (8 min):**
Perplexity: "Actually, Core needs supplies from Planet A." Accept contract, pickup, deliver. Reward: 150 GHAI, "Certified Pilot" badge, shop access.

**Quest 4 — "Choose Your Path" (open-ended):**
Gemini: "The galaxy is patient." Three branches: Race (Rush), Haul (Courier), Fight (Hunt). Each has a mini-arc.

### Main story (optional, post-MVP)

- Chapter 1: The Silent Ones (derelicts moving, tier 3-5 PvE)
- Chapter 2: The Board's Secret (archived sectors, lore)
- Chapter 3: The Pioneer Trail (meet the First Ten, legendary ship reward)
- Chapter 4: The Void's Offer (moral choice, cosmetic consequences)
- Chapter 5: Community-voted via Quantum Live

### Exploration lore

12 lore fragments scattered across space. Found by exploring, not by missions. Collect all 12 → unlock legendary card. Each fragment is a voice recording from a Cast member revealing universe history.

### AI-generated unique quests — "no one else will ever see this"

Found in Deep Void and Outer Ring. Lore shards trigger one-time quests generated by AI in real time.

**How it works:**
1. **Trigger:** Player finds a "lore shard" in free flight — an object containing a fragment (text, coordinates, a name, a riddle)
2. **AI generation:** System sends fragment + pilot profile + zone + ship class to Claude/GPT API
3. **Quest appears:** Unique quest with unique dialogue, waypoints, and objective. Shown only to this player.
4. **Completion reward:** One-of-a-kind card variant, cosmetic, or screenshot-moment
5. **Documentation:** Quest and outcome saved to pilot profile as a "Tale" — others see you completed something unique, but not what it was

**Technical:**
- API call to Claude/GPT with structured JSON output (quest template)
- Cost: ~3-25 GHAI per generated quest (Quantum pricing tier)
- Quest validated server-side for completability
- **Rate limited: max 1 AI quest per week per player** (rare = special)

**Consequence:** Every player who plays voidexa long enough has a completely unique story. The universe literally created something only for them.

### voidexa Artifacts — unique trophies (non-NFT, pre-ADVORA)

When you complete an AI-generated quest, you receive an Artifact:
- Unique image + text, generated and stored in Supabase
- Bound to your account — only you have it
- Displayed on pilot profile as a trophy
- **Never duplicated. Never tradeable (for now).**
- **Post-ADVORA:** Can be converted to NFT if regulations allow. The concept is ready; the legal framework is not.

This gives "I own something unique" without blockchain risk.

### Tales on pilot profile

Every AI quest, every Mythic pull, every wagered PvP victory, every first-discovery of a new zone — these are logged as **Tales** on the pilot profile. A Tale is a one-line record: what happened, when, where. Other pilots can browse your Tales. It's your autobiography in the universe.

---

## PART 11 — VISUAL GRAPHICS FOR BATTLE

### Art direction (from GPT, adopted)

The battle UI must look like a **command table projected inside a living ship cockpit**, not a flat mobile card game on a 3D background.

**Visual thesis:**
- 3D ship = emotional anchor
- 2D cards = tactical language
- UI chrome = holographic flight console

### Layout

**Top third:** Enemy ship, hull/block bars, status icons, arena modifier chip. Slow-moving nebula + debris background.

**Middle band:** Combat lane, targeting arc, impact space. Where shots/drones/shields visualize. Keep uncluttered.

**Bottom third:** Player ship in partial rear view. Hand of cards in curved console rail. Energy pips left. End turn button right.

### Color system

- Base UI: graphite, deep navy, low-sat steel
- Primary glow: cyan/teal
- Damage: amber to red
- Defense: blue-white
- AI/system: violet
- Consumables: mint/green
- Warnings: orange
- Legendary accent: restrained gold
- **Rule:** Background darker than cards. Do not turn everything neon.

### Card presentation

Cards feel like physical holo-plates projected from ship console. Slight parallax, thin rim light, faction stripe/class icon top, cost top-left, type icon top-right, ability text center-left aligned, damage/block values bold and oversized.

Rarity shown through: border material, glow density, foil shimmer, subtle badge. NOT ornate frames.

### Animation timings (from original master doc PART 9)

| Animation | Duration | Blocking? |
|---|---|---|
| Card hover | 200 ms | No |
| Card played | 550 ms | No |
| Weapon fire | 900 ms | No |
| Shield up | 900 ms | No |
| Explosion | 1170 ms | No |
| Damage float | 1100 ms | No |
| Ship shake | 420 ms | No |
| PvP reveal | 1200 ms + 1400 ms | Yes |
| Turn transition | 600 ms | Yes |
| Boss intro | 2400 ms | Yes (skippable) |

### CSS and Three.js code

Full copy-paste CSS for card states, framer-motion for card play animation, R3F components for ability effects (WeaponFire, ShieldEffect, ExplosionEffect), damage number floats, ship hit reactions, PvP reveal phase, turn transition effect, and boss intro cinematic — all in the original VOIDEXA_GAMING_MASTER.md PART 9 which remains valid and is not repeated here to save space. Reference that file for implementation code.

---

## PART 12 — TECHNICAL FOUNDATION

### Stack

- Next.js 16 on Vercel Pro (auto-deploy: `git push origin main`)
- Three.js + React Three Fiber + drei + @react-three/postprocessing
- Zustand for client state
- XState for turn machine (proposed)
- Supabase EU (`ihuljnekxkyqgroklurp`) for persistence, realtime, matchmaking
- 689 .glb on disk, ~60 on Supabase CDN bucket `models`
- Platform-GHAI: $1 = 100 GHAI, Stripe top-up

### New gaming pages

- `app/game/mission-board/page.tsx` — unified mission board
- `app/game/speed-run/page.tsx` — speed run entry
- `app/game/hauling/page.tsx` — hauling hub
- `app/game/battle/[sessionId]/page.tsx` — battle route
- `app/game/cards/page.tsx` — collection + deck builder
- `app/game/profile/page.tsx` — pilot reputation profile

### New gaming components

- `components/game/MissionBoard.tsx` — the unified board
- `components/game/BattleScene.tsx` — R3F battle
- `components/game/BattleHUDOverlay.tsx` — HUD
- `components/game/CardInHand.tsx` — card component
- `components/game/AbilityEffects.tsx` — effect library
- `components/game/Ship.tsx` — ship with hit reactions
- `components/game/DamageNumbers.tsx` — floating numbers
- `components/game/PvPRevealPhase.tsx` — PvP reveal
- `components/game/TurnTransitionEffect.tsx` — turn transition

### Supabase schema (complete for gaming)

All tables from original master doc PART 8 remain valid:
- `user_cards`, `decks`, `deck_cards`
- `battle_sessions`, `battle_turns`
- `pvp_queue`, `speedrun_times`, `hauling_contracts`

Plus new tables from evening session:
- `ship_tags` (from ship tagger admin tool)
- `wrecks` (wreck system)
- `pilot_reputation` (social memory)
- `universe_wall` (activity feed)
- `pilot_encounters` (encounter history)
- `quest_templates`, `user_quest_progress` (quest system)
- `mission_board_state` (daily board rotation)

### Deploy rule

`git push origin main` auto-deploys. NOT main:master. NOT npx vercel --prod. Always .trim() env vars.

---

## PART 13 — CURRENT STATE INVENTORY

### What is live

- Star System Phase 1-9: starmap, galaxy, freeflight, shop, achievements, chat UI, stations, warp, nebula, derelicts. 342 tests.
- Vattalus cockpit on /freeflight (commits 9b3af26, 340d729)
- /cards: 40 renders, no combat
- /shop: Fortnite tabs, $0.50-$10
- /assembly-editor, /ship-catalog, /control-plane, /claim-your-planet
- 50+ pages, 9 Danish routes
- Wallet + Stripe working
- Ship tagger admin tool at /admin/ship-tagger (commit a0050b2, ADMIN_SECRET configured)
- GHAI scrubbed pending ADVORA

### What is designed but not built

- Break Room (full plan, no SKILL/CLAUDE yet)
- Space Defender (code in chat history, not committed)
- Mission Board (designed this session)
- Card battle engine (designed this session + original master doc)
- Wreck system (designed this session)
- All social memory mechanics

### What is in the repo as documentation

- `.claude/skills/voidexa-gaming/SKILL.md` (commit 68ffc50)
- `.claude/skills/voidexa-gaming/CLAUDE.md` (commit 68ffc50)
- `docs/VOIDEXA_GAMING_MASTER.md` (commit 68ffc50) — to be replaced by this file

---

## PART 14 — GAPS, RISKS, AND OPEN ITEMS

### Resolved this session

| # | Item | Resolution |
|---|---|---|
| 1 | Universe tone | NMS + Firefly + Guardians. Locked. |
| 2 | Player fantasy | Playground > game. Locked. |
| 3 | Cast role in gameplay | Contract issuers on Mission Board. Locked. |
| 4 | Wreck system | Full design with timers, claim fees, insurance. Locked. |
| 5 | Ship model | Class = function, tier = cosmetic. Locked. |
| 6 | Mission system | Dual: board + exploration. Best missions NEVER on board. Locked. |
| 7 | Economy pacing | Never have everything. Fortnite model. Locked. |
| 8 | Card scale | 60-80 launch, expand quarterly, 223 pattern library. Locked. |
| 9 | Encounter math | Hand 5, draw 2, limit 8, energy 1→7. Locked. |
| 10 | Combat language | 8 statuses, cost-power curve, 7 animation families. Locked. |
| 11 | Claim economics | Class-based not tier-based. Locked. |
| 12 | Universe size | 1 hour travel all directions from Core. 5 zones. Locked. |
| 13 | Hauling encounters | Weighted random road events along checkpoint routes. Locked. |
| 14 | Booster packs | Standard 100, Premium 300, Legendary 1000 GHAI. Locked. |
| 15 | Mythic rarity | 0.1% drop, 50 copies per card, Black Lotus model. Locked. |
| 16 | Player trading | 5% fee, Mythic 10%. Cards tradeable. Locked. |
| 17 | Dream Mode deck builder | Browse all cards ghosted if unowned. Locked. |
| 18 | PvP wagering | Optional GHAI/card/ship wagers. Bob never wagered. Locked. |
| 19 | AI-generated quests | Lore shard triggers, Claude/GPT API, max 1/week. Locked. |
| 20 | voidexa Artifacts | Unique trophies from AI quests, non-NFT pre-ADVORA. Locked. |
| 21 | Tales on pilot profile | Autobiographical log of unique moments. Locked. |
| 22 | Card render audit | 59 renders mapped to abilities, 5 new suggested. Done. |
| 23 | Phase A1 Supabase | 16 tables live, RLS, types, 26 card templates. Done. |

### Still open (parked for future sessions)

| # | Item | Status |
|---|---|---|
| 24 | Exact ship stats (number of stats, values) | Principle locked, numbers TBD |
| 25 | Salvager as dedicated role with own progression | Confirmed concept, economy math TBD |
| 26 | Card-to-render mapping finalization | Audit done (59 renders), assignment to specific abilities TBD |
| 27 | Break Room SKILL.md + CLAUDE.md | Not written |
| 28 | Quantum Live technical pipeline | Requires Jarvis + TTS |
| 29 | Planet owner integration with gaming layer | Bridge planned, not designed |
| 30 | Dependabot vulnerabilities (15) | Housekeeping, npm audit fix |
| 31 | Ship catalog expansion beyond 9 | Batches of 10, after class/tier is defined |
| 32 | Cards 27-80+ design | 26 baseline done, 223 patterns available, renders audited |
| 33 | BWOWC mechanic mining | Search BWOWC chats for reusable patterns (Jix requested) |
| 34 | Booster pack Supabase tables | card_packs, pack_openings, trade_offers, trade_history |
| 35 | Wager Supabase tables | pvp_wagers with escrow logic |
| 36 | AI quest generation pipeline | API integration, rate limiting, server-side validation |
| 37 | Mythic supply tracking | Global count table, decrement on pull, Universe Wall hook |
| 38 | Universe zone content population | Specific coordinates for landmarks, derelicts, beacons per zone |

### Risks (from GPT analysis, adopted)

| Risk | Mitigation |
|---|---|
| Economy inflation | Soft diminishing returns, sink diversity, weekly prestige drains |
| Bot farming on speed runs/hauling | Server-validated checkpoints, route entropy, pattern detection |
| Card balance drift | Telemetry from day 1, monthly balance pass, admin rebalance page |
| MVP scope creep | Hard cut list in PART 15 |
| 3D mobile performance | Device detection + quality presets, low-poly fallback |
| Social memory maintenance cost | Automated templates, no manual curation |

---

## PART 15 — MVP ROADMAP

### What is IN the MVP

Based on all discussions + GPT cuts:

**Phase 1 — Foundation (4 sessions) ✅ DONE (commit fdf9760)**
- Supabase gaming schema (16 tables live with RLS)
- Card template registry (26 baseline cards in lib/game/cards/index.ts)
- Balance validator (lib/game/balance.ts)
- TypeScript types (types/game.ts, 2471 lines)
- Card render audit (59 renders mapped in docs/CARD_RENDER_AUDIT.md)
- Still needed in Phase 1: Mission Board UI component, Deck builder on /cards

**Phase 2 — Speed Run (2 sessions)**
- Waypoint rings, timer, collision
- Leaderboard
- Thruster Surge / Phase Shell / Null Drift power-ups
- Purchase flow tied to GHAI wallet

**Phase 3 — Hauling (3 sessions, expanded for encounter system)**
- Hauling hub on planets, contract browsing
- Safe + risky contracts with zone-based routing
- Cargo pickup/deliver loop with checkpoint system
- Hauling encounter system (navigation, combat-lite, opportunity, atmosphere events)
- GHAI reward payout with Bronze/Silver/Gold grading

**Phase 4 — PvE Card Battle (5 sessions)**
- BattleScene (R3F) with ships
- HUD overlay
- Ability effects (7 animation families)
- The Kestrel Reclaimer boss
- Battle start/end, reward drop, back to free flight

**Phase 5 — Wreck System basics (2 sessions)**
- Wreck spawning on PvE/hauling failure
- Self-repair with repair kit
- Tow request system
- Timer phases (Low Risk / High Risk)
- Claim by others with claim fee

**Phase 6 — Card Economy (2 sessions)**
- Booster packs in shop (Standard/Premium/Legendary)
- Pack opening animation + drop rate logic
- Deck builder with Dream Mode
- Mythic supply tracking (global count, Universe Wall hook)

**Phase 7 — Social Memory v1 (2 sessions)**
- Pilot reputation profile
- Universe Wall feed
- Basic pilot encounter tracking
- Tales log on profile

**Phase 8 — Onboarding + Polish (2 sessions)**
- 4-quest tutorial arc
- Cast voices as contract issuers on board
- Font/opacity audit
- Mobile performance pass

**Total: 22 sessions (Phase 1 done = 18 remaining).** At 2-4 hours each = 5-9 weeks.

### What is OUT of the MVP (build later)

- PvP card battle + wagering system
- Player-to-player trading marketplace
- AI-generated unique quests (requires API pipeline)
- voidexa Artifacts system
- Full Break Room
- Quantum Live gamification
- Space Defender migration
- Deep salvage progression tree
- Battle Pass / seasonal system
- Main story Chapters 1-5
- Ship catalog expansion beyond 9
- Cards 27-300+ (using 223 pattern library)
- Planet owner gaming integration
- Mining gameplay on rare asteroids
- Wormhole network
- NFT conversion (post-ADVORA)

### Single command to start Phase 1b (remaining foundation work) in Claude Code

Phase A1 (schema + cards + balance) is done (commit fdf9760). Remaining Phase 1 work: Mission Board UI + Deck Builder.

**Box 1:**
```powershell
cd C:\Users\Jixwu\Desktop\voidexa; claude --dangerously-skip-permissions
```

**Box 2:**
```
Read docs/VOIDEXA_GAMING_COMBINED_V3.md — this is the single source of truth.

Execute Phase 1b — Mission Board UI + Deck Builder:

1. Create app/game/mission-board/page.tsx — the unified mission board.
   - 5 category tabs: Courier, Rush, Hunt, Recovery, Signal
   - Each mission tile shows: Cast issuer avatar + name, mission name, time estimate, reward range, risk badge (Safe/Contested/Wreck Risk/Timed/Ranked)
   - "Recommended" section at top (3 missions)
   - Filter by category, risk, time
   - Click a mission → detail modal with full description + "Accept" button
   - Accept writes to Supabase mission_board_state
   - Cast avatars: use existing character portrait images from the Quantum page
   - Dark sci-fi styling matching voidexa theme
   - Seed 8 hardcoded mission templates from PART 4 for now

2. Update app/cards/page.tsx (or create app/game/cards/page.tsx) to add deck builder:
   - Left pane: card collection browser with filters (type, rarity, faction, cost, owned-only toggle)
   - Right pane: current deck (20 slots)
   - Drag-and-drop from collection to deck
   - "Dream Mode" toggle: shows ALL cards, unowned ones ghosted/locked
   - Save deck button → writes to Supabase decks + deck_cards tables
   - Load deck dropdown for saved decks
   - Deck validation: max 2 copies, max 3 rare, max 1 legendary, max 1 mythic, ship class restrictions

3. All font sizes ≥16px body, ≥14px labels. Opacity ≥0.5. .trim() all env vars.

4. Commit: "feat(gaming): Phase 1b — Mission Board UI + Deck Builder"

5. git push origin main

Report: new files created, any build errors, commit hash.
```

---

## APPENDIX — DOCUMENT LINEAGE

This document supersedes:
- `docs/VOIDEXA_GAMING_MASTER.md` (original, commit 68ffc50)
- `docs/VOIDEXA_GAMING_COMBINED_V2.md` (V2, commit 1b9891f)
- `VOIDEXA_GAMING_MASTER_UPDATE_APR16_EVENING.md` (session update)
- GPT Counter-Document (external input, key decisions adopted)
- GPT 223-pattern card mechanic library (stored in `docs/voidexa_scifi_card_pattern_library.xlsx`)
- Cowork Card Render Audit (stored in `docs/CARD_RENDER_AUDIT.md`)

When this file is committed to the repo, it becomes the single source of truth. Keep V2 as archive.

**End of VOIDEXA_GAMING_COMBINED_V3.md**
