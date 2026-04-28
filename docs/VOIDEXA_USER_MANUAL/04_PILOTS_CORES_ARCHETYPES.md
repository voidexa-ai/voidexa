# VOIDEXA — USER MANUAL & UNIVERSE GUIDE

**ETAPE 4 of 5 — Pilots, Ship Cores, Archetypes & Deckbuilding**

This document covers the strategic / deckbuilding layer of voidexa. Pilot class selection, Ship Core deep-dive, the 6 archetypes that define deck strategies, and how to build a 60-card deck that works.

**Prerequisite:** ETAPE 1 (Universe), ETAPE 2 (Mechanics), ETAPE 3 (Card Types) — read first.

---

## 1. PILOT CLASSES — DEEP DIVE

The pilot is the player's persistent identity across all battles. Pilot is chosen at account creation and is **separate from the deck** — one pilot can play any deck, but the pilot's passive bonus applies to every match.

There are 5 pilot classes. Each has a distinct playstyle alignment.

### Ace

**Identity:** The aggressive fighter pilot. Dogfighter mentality. Goes for the throat.

**Passive direction:** Bonus damage on weapons. Faster aggressive plays.

**Best decks:** Aggro archetype, weapon-heavy builds, tempo decks that race the opponent.

**Weakness:** No defensive synergy. If aggro fails to kill quickly, Ace runs out of resources.

**Visual representation in UI:** Avatar shows a pilot in a flight suit with a fighter-pilot helmet. Confident, alert posture. Combat-ready.

---

### Engineer

**Identity:** The technical operator. Keeps the ship running through hell. Plays the long game.

**Passive direction:** Faster subsystem repair. Bonus to defensive recovery.

**Best decks:** Control archetype, ramp builds, late-game survival decks. Heavy Module synergy.

**Weakness:** Slow start. Vulnerable to aggro pressure before defensive setup completes.

**Visual representation:** Avatar shows a pilot with engineering kit visible — utility belt, repair tools, technical patches. Practical, focused expression.

---

### Strategist

**Identity:** The tactical planner. Predicts opponent moves. Sets up combos.

**Passive direction:** Bonus card draw, energy efficiency, prediction abilities.

**Best decks:** Combo archetype, utility-heavy builds, decks that need consistent draws to assemble win conditions.

**Weakness:** Weak when forced into reactive play. Suffers if opponent disrupts the setup.

**Visual representation:** Avatar shows a pilot with tactical display elements visible behind them — holographic interfaces, data overlays. Calculating expression.

---

### Commander

**Identity:** The fleet leader. Coordinates drones and field assets. Battlefield presence.

**Passive direction:** Drone bonuses, field-effect amplification, board control.

**Best decks:** Drone-swarm decks, field-control decks, midrange builds with persistent units.

**Weakness:** If drones are wiped, Commander loses tempo and value.

**Visual representation:** Avatar shows a pilot with command insignia, formal flight suit, authoritative posture. Slight gold/gilt accents to imply leadership.

---

### Infiltrator

**Identity:** The shadow operator. Stealth, sabotage, deception.

**Passive direction:** Stealth bonuses, debuff effects, disruption.

**Best decks:** Disruption decks, stealth-focused builds, decks that target enemy subsystems.

**Weakness:** Lower raw damage. Loses in pure damage races.

**Visual representation:** Avatar shows a pilot in dark/stealth flight suit, partial visor, minimal insignia. Shadowed, mysterious lighting.

---

### Pilot ≠ Card art

**Important rule:** The pilot is shown ONLY in the UI avatar (top-left of battle screen). The pilot is NEVER shown in card art. Pilot avatar art uses different visual rules than card art (humans allowed in avatar context, never in card context).

---

## 2. SHIP CORE — DEEP DIVE

The Ship Core is the deck's anchor identity — both narratively (this is the ship the pilot is flying) and mechanically (this passive is always active).

There are **49 unique Ship Cores** in the Alpha Set.

### How Ship Cores work

| Property | Detail |
|---|---|
| Slot | Special "Ship Core" slot, separate from the 60-card deck |
| Quantity | Exactly 1 per deck |
| Active | From turn 1, always |
| Destruction | Cannot be destroyed by normal damage |
| Replacement | Cannot be replaced mid-battle |

### Ship Core archetypes

Ship Cores fall into recognizable strategic groups based on their passive type:

| Group | Example | Passive direction |
|---|---|---|
| Weapon Boost | Basic Frame | "Your Weapons deal +1 damage" |
| Hull Boost | Defender Hull | "Start with +5 Hull Integrity" |
| Recon | Scout Chassis | "End Cycle: Probe 1 (peek at top card)" |
| Cargo / Resources | Cargo Frame | "+1 Cargo slot" (extra inventory) |
| Tempo | Fighter Core | "First Weapon each turn costs 1 less" |
| Defensive | Heavy Core | "+3 starting Shield Capacity" |
| Card Draw | Commander Core | "Draw 1 extra at start of turn 1" |
| Module Specialist | Engineer Frame | "Your Modules cost 1 less energy" |

### Sample Ship Cores from the Alpha Set

| Ship Core | Rarity | Passive |
|---|---|---|
| Basic Frame | Common | Your Weapons deal +1 damage. |
| Defender Hull | Common | Your ship starts each match with +5 Hull Integrity. |
| Scout Chassis | Common | End Cycle: Probe 1. |
| Cargo Frame | Common | Your ship has 1 extra Cargo slot. |
| Fighter Core | Common | Your first Weapon each turn costs 1 less. |
| Heavy Core | Common | Your ship starts each match with +3 Shield Capacity. |
| Commander Core | Common | You draw 1 extra card at the start of the first turn. |
| Engineer Frame | Common | Your Modules cost 1 less energy. |

Higher-rarity Ship Cores (Epic, Legendary, Mythic) have more powerful and more situational passives — they enable specific deck archetypes that wouldn't work without them.

### How Ship Core defines the deck

When you choose a Ship Core, you're choosing **the deck's win condition.**

- **Pick "Basic Frame" (Weapons +1 damage)** → Build a weapon-heavy aggro deck. Every weapon hits 1 harder. Stack many weapons.
- **Pick "Defender Hull" (+5 Hull start)** → Build a control deck that survives long. The extra hull buys you 1-2 more turns to set up defensively.
- **Pick "Engineer Frame" (Modules cost 1 less)** → Build a module-stacking ramp deck. Modules are normally expensive — this Core makes them cheap, enabling Module-cluster strategies.

Without a chosen Ship Core, the deck has no identity. Choose first, then build.

---

## 3. ARCHETYPES — DEEP DIVE

Cards are tagged with one or more **archetypes** — the strategic role they play. There are 6 archetypes in voidexa.

### Distribution in the Alpha Set

| Archetype | Count | % of set |
|---|---|---|
| Midrange | 252 | 25.2% |
| Control | 194 | 19.4% |
| Aggro | 192 | 19.2% |
| Combo | 156 | 15.6% |
| Utility | 119 | 11.9% |
| Ramp | 87 | 8.7% |

A card may belong to multiple archetypes (e.g. a draw-and-damage card = Utility + Aggro).

---

### AGGRO

**Goal:** End the game by turn 5-7. Damage the opponent before they can set up.

**Card profile:**
- Low energy cost (0-2)
- High damage per energy ratio
- Often with conditional bonuses ("if you played a weapon last turn, deal +2")
- Generates Heat fast

**Sample aggro cards:**
| Card | Type | Cost | Effect |
|---|---|---|---|
| Spark Discharge | Weapon | 0 | Reactive. Deal 2 damage to target enemy unit. |
| Scavenged Round | Weapon | 0 | Play only if one of your Drones was destroyed this turn. Deal 3 damage. |

**Aggro decks include:**
- Many cheap weapons
- Few defenses (you don't need them if you win fast)
- A Ship Core that boosts weapon damage (Basic Frame, Fighter Core)

**Weakness:** Runs out of gas. If the game extends to turn 8+, aggro decks have empty hands and lose to control.

---

### CONTROL

**Goal:** Survive until you out-resource the opponent. Win the long game.

**Card profile:**
- Defense-focused
- Disruption (debuffs, removal)
- Late-game value cards
- High-impact Modules and AI Routines

**Sample control cards:**
| Card | Type | Cost | Effect |
|---|---|---|---|
| Chaff Round | Weapon | 1 | Deal 2 damage and Disable target unit's abilities next turn. |
| Ion Spark | Weapon | 1 | Deal 3 damage to target subsystem. Hits Weapons Array by default. |

**Control decks include:**
- Many defenses
- Subsystem-targeting cards (cripple enemy systems)
- Long-game value cards
- A Ship Core that boosts hull or shields (Defender Hull, Heavy Core)

**Weakness:** Slow to set up. Loses to aggro that wins by turn 5.

---

### MIDRANGE

**Goal:** Balanced curve. Strong threats at every cost. Adapt to opponent.

**Card profile:**
- Mid-cost (2-4 energy)
- Balanced damage and effects
- Flexible answers to multiple deck types
- The "default" archetype

**Sample midrange cards:**
| Card | Type | Cost | Effect |
|---|---|---|---|
| Heavy Laser | Weapon | 2 | Deal 6 damage to target enemy unit or ship. |
| Torpedo Mk.I | Weapon | 2 | Cold Boot 1. Deal 6 damage. |

**Midrange decks include:**
- Mix of weapons, drones, defenses
- 2-4 cost cards dominant
- Flexible answers
- Most generic Ship Cores work

**Strength:** Beats both aggro (with defenses) and control (with pressure). The "rock-paper-scissors center."

**Weakness:** Doesn't beat dedicated combo decks consistently.

---

### COMBO

**Goal:** Assemble a multi-card combination for a single huge turn that ends the game.

**Card profile:**
- Synergy cards that need each other
- Tutoring (find specific cards)
- Setup cards that pay off later
- Sometimes specific card-name interactions

**Sample combo cards:**
| Card | Type | Cost | Effect |
|---|---|---|---|
| Stutter Gun | Weapon | 1 | Alpha Strike. Deal 2 damage twice to target. |
| Blaster Carbine | Weapon | 1 | Overclock. Deal 4 damage. |

**Combo decks include:**
- Setup cards (cheap, draw, tutor)
- Combo pieces (the cards that go off together)
- Disruption protection (counter-counters)
- A Ship Core that enables the combo (often Legendary/Mythic)

**Weakness:** If opponent disrupts the combo or kills you before it assembles, you lose with junk in hand.

---

### UTILITY

**Goal:** Card advantage and flexibility. Outresource the opponent through draws and tutoring.

**Card profile:**
- Card draw effects
- Tutor effects (find specific cards in deck)
- Information effects (peek, scry, probe)
- Cheap "filler" that enables other strategies

**Sample utility cards:**
| Card | Type | Cost | Effect |
|---|---|---|---|
| Scout Drone Beta | Drone | 1 | Deploy Burst: Probe 1. Rearrange the top card of your deck. |
| Spotter Drone | Drone | 1 | End Cycle: reveal the top card of your deck. |

**Utility decks include:**
- Heavy card draw
- Many cheap cards (more cards = more draws triggered)
- Knowledge of opponent's deck (Probe, Scry effects)
- Often paired with Combo or Control as supporting layer

**Weakness:** Doesn't directly win games — utility is a support layer, not a win condition by itself.

---

### RAMP

**Goal:** Generate extra resources early to play powerful late-game cards faster.

**Card profile:**
- Energy generation
- Repair / healing (extends survival window)
- Setup cards for big plays
- High-cost payoff cards

**Sample ramp cards:**
| Card | Type | Cost | Effect |
|---|---|---|---|
| Point Barrier | Defense | 1 | Auto-Repair 1. Heals 1 HP at end of your turn. |
| Repair Nanites | Defense | 2 | Auto-Repair 2. Heals 2 HP at end of your turn. |

**Ramp decks include:**
- Energy boost cards
- Healing/repair to survive while ramping
- 5-7 cost finishers
- A Ship Core that provides resource bonuses

**Weakness:** Loses to fast aggro before ramp pays off. Highest-risk archetype.

---

## 4. ARCHETYPE MATCHUP TRIANGLE

The classic TCG matchup triangle applies in voidexa with adjustments:

```
        AGGRO
        ↗  ↘
    beats  loses
       ↗      ↘
   COMBO  ←  CONTROL
       ↘      ↗
    loses  beats
        ↘  ↗
       MIDRANGE
       (balanced vs all)
```

**General rules of thumb:**
- Aggro beats Control (kills before defense sets up)
- Control beats Combo (disrupts combo pieces)
- Combo beats Aggro (combos out before aggro can finish)
- Midrange is a fair-fight against everything (no extreme matchups)
- Utility supports any archetype
- Ramp is wildcard — beats Control, loses to Aggro, depends vs Combo

---

## 5. DECKBUILDING — STEP BY STEP

A 60-card deck must be constructed deliberately. Here's the process.

### Step 1: Choose a Ship Core

This is the deck's identity. Decide:
- "What do I want to do?" (race, control, combo, etc.)
- "What Ship Core enables that?"

Example: "I want to play many cheap weapons to overwhelm." → **Basic Frame** (Weapons +1 damage) or **Fighter Core** (first Weapon costs 1 less).

### Step 2: Pick a primary archetype

Match Ship Core to an archetype. Basic Frame → Aggro. Defender Hull → Control. Engineer Frame → Module-Ramp.

### Step 3: Build the curve

A balanced deck has cards across all energy costs. Recommended distribution for most decks:

| Energy cost | Card count | Role |
|---|---|---|
| 0 | 4-8 | Reactive plays, cheap fillers |
| 1 | 8-12 | Early game cards, cantrips |
| 2 | 12-16 | Backbone of your turn 2-3 |
| 3 | 8-12 | Strong mid-game threats |
| 4 | 6-10 | Premium mid-game |
| 5 | 4-8 | Late-game finishers |
| 6+ | 0-4 | Big finishers, only with ramp support |

**Aggro decks skew lower** (more 0-2 cost). **Ramp decks skew higher** (more 4-6 cost). **Midrange is the table above.**

### Step 4: Card type distribution

Recommended distribution for a typical midrange deck:

| Type | Count | Role |
|---|---|---|
| Weapons | 18-25 | Damage source |
| Drones | 8-12 | Board presence |
| Defenses | 8-12 | Survival |
| Maneuvers | 4-6 | Reactive evasion |
| AI Routines | 3-5 | Persistent value |
| Modules | 3-5 | Hardware buffs |
| Equipment | 2-4 | Specific upgrades |
| Fields | 1-3 | Battlefield control |

**Total = 60.** Adjust per archetype:
- Aggro: more Weapons + Drones, fewer Defenses
- Control: more Defenses + AI Routines, fewer Weapons
- Combo: more Utility (drone) + specific combo pieces

### Step 5: Copy limits

| Rarity | Max copies per deck |
|---|---|
| Common | 4 |
| Uncommon | 4 |
| Rare | 4 |
| Epic | 2 |
| Legendary | 1 |
| Mythic | 1 |

This creates natural deck diversity — you can't just stack 60 copies of the best card.

### Step 6: Test and iterate

A deck is rarely right on first build. Play 5-10 matches. Note:
- "I always wanted X but never had it" → add more of X
- "I always had Y but never needed it" → cut Y
- "I lost on turn 3 every time" → not enough early defense
- "I had energy but no cards to play" → too many high-cost cards

Iterate. The 5-saved-decks slot lets you keep multiple builds and switch between matchups.

---

## 6. DECK ARCHETYPE EXAMPLES

### Example 1: Aggro Weapons Deck

**Ship Core:** Fighter Core (first Weapon each turn costs 1 less)

**Archetype:** Aggro

**Card distribution:**
- 30 Weapons (mostly 0-2 cost)
- 8 Drones (1-2 cost, fast deploys)
- 6 Maneuvers (Reactive, dodge attacks)
- 6 Defenses (cheap, just to survive turn 4-5)
- 4 AI Routines (Targeting Assist for damage boost)
- 4 Equipment (Targeting Sights on weapons)
- 2 Fields (Debris Cloud to slow opponent)

**Win condition:** Reduce opponent's hull to 0 by turn 6.

---

### Example 2: Control Hull Deck

**Ship Core:** Defender Hull (+5 starting Hull) OR Heavy Core (+3 starting Shield)

**Archetype:** Control

**Card distribution:**
- 12 Weapons (mid-cost, high impact)
- 4 Drones (defensive drones)
- 18 Defenses (multiple shield/repair options)
- 6 Maneuvers (Reactive damage reduction)
- 8 AI Routines (Persistent Field passives)
- 6 Modules (Auto-repair, defensive)
- 4 Equipment (Recoil Damper for less heat)
- 2 Fields (Ion Storm to slow opponent weapons)

**Win condition:** Outlast opponent. Win on resources after turn 10+.

---

### Example 3: Drone Swarm Midrange

**Ship Core:** Commander-tier Core (Epic/Legendary) with drone synergy

**Archetype:** Midrange + Drone-swarm

**Card distribution:**
- 16 Drones (max 5 in play, cycle through them)
- 14 Weapons (drone-buff weapons, anti-air)
- 8 Defenses (protect drones)
- 4 Maneuvers (Reactive)
- 8 AI Routines (drone-buff routines)
- 6 Equipment (drone armor kits)
- 4 Modules (hangar bay extension)

**Win condition:** Maintain board presence. Multiple drones ticking damage every turn.

---

## 7. PILOT-CORE-ARCHETYPE STACKING

The strongest decks combine all three layers:

**Example stack:**
- **Pilot:** Ace (bonus weapon damage)
- **Ship Core:** Basic Frame (Weapons +1 damage)
- **Archetype:** Aggro
- **Combined effect:** Every weapon hits +2 damage (1 from pilot, 1 from Ship Core, plus archetype curve giving lots of weapons)

This **stacking** of bonuses creates the deck's power level. Don't pick a control Ship Core with an aggro pilot — the pilot bonus is wasted.

**Stack examples:**
| Pilot | Ship Core | Archetype | Identity |
|---|---|---|---|
| Ace | Basic Frame | Aggro Weapons | Damage-race |
| Engineer | Defender Hull | Control Tank | Outlast |
| Strategist | Commander Core | Combo Draw | Set-up combo |
| Commander | Drone Carrier (legendary) | Midrange Swarm | Board presence |
| Infiltrator | Stealth Hull (legendary) | Disruption | Lock opponent |

---

## 8. WHAT MAKES A DECK BAD

Common deckbuilding mistakes:

❌ **No theme:** Random good cards across all archetypes. Looks strong on paper, plays inconsistently.

❌ **Curve too high:** Too many 4+ cost cards, no early defense. Loses to aggro before ramp pays off.

❌ **Curve too low:** All 0-2 cost cards, runs out of gas. Loses to control after turn 6.

❌ **Pilot/Core mismatch:** Aggro pilot with control Ship Core. Wasted bonuses.

❌ **No win condition:** Lots of utility, no way to actually kill the opponent. Decks need clear damage paths.

❌ **Over-singletons:** Too many 1-of cards. Inconsistent draws. Stick to 3-4 of cards you NEED to draw.

❌ **Ignoring matchup:** Pure aggro vs known control meta = lose. Bring a tech card to address matchup.

---

## 9. DECKBUILDER UI BEHAVIOR (LOCKED)

Per SLUT 9 strategy lock, the deckbuilder has these mechanics:

| Feature | Behavior |
|---|---|
| Active deck bar | Horizontal at top of screen |
| Add card | Drag from inventory UP into bar |
| Remove card | Click card in bar |
| View toggle | Show 5 / 10 / 15 cards in bar (3 boxes) |
| Filter | Filter inventory by type (Defense, Damage, etc.) — see what you're missing |
| Saved decks | 5 per user |
| Catalog | Max 20 cards per page, paginated |
| Type tabs | 9 type sections |

The catalog and deckbuilder are completion-gated — you can only put cards into a deck that you OWN in your inventory. Owning happens via pack opening, mission rewards, or trading.

---

## END ETAPE 4

After ETAPE 4, the reader knows:
- All 5 pilot classes and their playstyle alignments
- How Ship Cores work, with 8 sample cores from the set
- The 6 archetypes (Aggro, Control, Midrange, Combo, Utility, Ramp) with sample cards
- The matchup triangle
- Step-by-step deckbuilding (6 steps)
- 3 sample deck builds with full distributions
- How pilot + core + archetype stack
- Common deckbuilding mistakes
- The deckbuilder UI behavior

**Next: ETAPE 5** — The full keyword glossary. Every game term used on card text:
- Reactive, Persistent Field, End Cycle, Deploy Burst
- Probe, Scry, Tutor
- Pierce, Splash, Cascade, Alpha Strike
- Overclock, Cold Boot, Auto-Repair
- Stealth, Priority Fire, Disable, Scrap
- And every other term that appears on card text in the 1000-card set

---

**End of Etape 4.**
