# VOIDEXA_GAMING_COMBINED_V2.md
## The definitive gaming layer design — April 16 2026

**Single source of truth.** Replaces VOIDEXA_GAMING_MASTER.md and VOIDEXA_GAMING_MASTER_UPDATE_APR16_EVENING.md. All decisions from the original master doc, evening deep dive, and GPT counter-document are merged here. Where conflicts existed, this document contains the resolved version.

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

### Scale

Big and open. You can get a little lost, but nothing traumatic. Never boring. Action and consequences are welcome — unfairness is not. Always a way back to the known.

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
- Max 3 rare, max 1 legendary per deck
- Ship class restricts some cards
- Max 10 saved decks per account

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

### Card acquisition (revised)

Cards drop SLOWLY. Full collection is never achievable for free. Always new expansions.

1. **Starter deck** — 20 cards on first login (Bob-class basics)
2. **Mission drops** — 1 random card from tier loot table on mission completion (not guaranteed — ~30% drop rate)
3. **Exploration drops** — higher drop rate (~60%) for exploration-only missions
4. **Card packs** — 100 GHAI = 5 cards, 1 uncommon+ guaranteed. Monthly soft cap.
5. **Quest rewards** — named card for completing quest arcs
6. **Pioneer cards** — unique series for planet owners
7. **Achievement cards** — long-term milestones
8. **Crafting** — combine 3 duplicate commons → 1 random uncommon. 50 GHAI fee.

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

### Three economy buckets (from GPT, adopted)

1. **Earn:** missions, exploration drops, events, recovery services
2. **Spend:** ships, repairs, cosmetics, card packs, rerolls, entry fees, power-ups
3. **Circulate:** towing fees, claim fees, player-to-player services (later)

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
| 6 | Mission system | Dual: board + exploration. Locked. |
| 7 | Economy pacing | Never have everything. Fortnite model. Locked. |
| 8 | Card scale | 60-80 launch, expand quarterly. Locked. |
| 9 | Encounter math | Hand 5, draw 2, limit 8, energy 1→7. Locked. |
| 10 | Combat language | 8 statuses, cost-power curve, 7 animation families. Locked. |
| 11 | Claim economics | Class-based not tier-based. Locked. |

### Still open (parked for future sessions)

| # | Item | Status |
|---|---|---|
| 12 | Exact ship stats (number of stats, values) | Principle locked, numbers TBD |
| 13 | Salvager as dedicated role with own progression | Confirmed concept, economy math TBD |
| 14 | Card-to-render mapping (which of 40 renders gets which ability) | Needs visual review session |
| 15 | Break Room SKILL.md + CLAUDE.md | Not written |
| 16 | Quantum Live technical pipeline | Requires Jarvis + TTS |
| 17 | Planet owner integration with gaming layer | Bridge planned, not designed |
| 18 | Dependabot vulnerabilities (15) | Housekeeping, npm audit fix |
| 19 | Ship catalog expansion beyond 9 | Batches of 10, after class/tier is defined |
| 20 | Cards 21-80 design | After renders reviewed and GPT baseline applied |

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

**Phase 1 — Foundation (4 sessions)**
- Supabase gaming schema (all tables)
- Mission Board UI component
- Card template registry (first 20 from GPT baseline)
- Deck builder on /cards

**Phase 2 — Speed Run (2 sessions)**
- Waypoint rings, timer, collision
- Leaderboard
- Thruster Surge / Phase Shell / Null Drift power-ups
- Purchase flow tied to GHAI wallet

**Phase 3 — Hauling (2 sessions)**
- Hauling hub on planets, contract browsing
- Safe + risky contracts
- Cargo pickup/deliver loop
- GHAI reward payout

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

**Phase 6 — Social Memory v1 (2 sessions)**
- Pilot reputation profile
- Universe Wall feed
- Basic pilot encounter tracking

**Phase 7 — Onboarding + Polish (2 sessions)**
- 4-quest tutorial arc
- Cast voices as contract issuers on board
- Font/opacity audit
- Mobile performance pass

**Total: 19 sessions.** At 2-4 hours each = 5-10 weeks.

### What is OUT of the MVP (build later)

- PvP card battle (Phase 5+ in GPT roadmap)
- Full Break Room
- Quantum Live gamification
- Space Defender migration
- Deep salvage progression tree
- Battle Pass / seasonal system
- Main story Chapters 1-5
- Ship catalog expansion beyond 9
- Cards 21-80+
- Planet owner gaming integration

### Single command to start Phase 1 in Claude Code

**Box 1:**
```powershell
cd C:\Users\Jixwu\Desktop\voidexa; claude --dangerously-skip-permissions
```

**Box 2:**
```
Read docs/VOIDEXA_GAMING_COMBINED_V2.md (the single source of truth for all gaming layer decisions).

Execute Phase 1 — Foundation:

1. Create Supabase migration supabase/migrations/20260416_game_core.sql with ALL gaming tables from PART 12:
   - user_cards, decks, deck_cards
   - battle_sessions, battle_turns
   - pvp_queue, speedrun_times, hauling_contracts
   - ship_tags, wrecks
   - pilot_reputation, universe_wall, pilot_encounters
   - quest_templates, user_quest_progress
   - mission_board_state
   Apply RLS per PART 12 guidelines.

2. Generate TypeScript types: npx supabase gen types typescript > types/game.ts

3. Create lib/game/cards/index.ts with the 20 baseline card templates from PART 5 as a typed registry.

4. Create lib/game/balance.ts with the cost-power curve from PART 5 as a validation function.

5. Commit: "feat(gaming): Phase 1 — gaming schema + card registry + balance validator"

6. git push origin main

Do NOT build any UI yet. Do NOT touch the star map. Report: migration file path, table count, any RLS errors, commit hash.
```

---

## APPENDIX — DOCUMENT LINEAGE

This document supersedes:
- `docs/VOIDEXA_GAMING_MASTER.md` (original, commit 68ffc50)
- `VOIDEXA_GAMING_MASTER_UPDATE_APR16_EVENING.md` (session update)
- GPT Counter-Document (external input, key decisions adopted)

When this file is committed to the repo, delete or archive the originals.

**End of VOIDEXA_GAMING_COMBINED_V2.md**
