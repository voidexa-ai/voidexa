# VOIDEXA ALPHA SET — MASTER DESIGN DOCUMENT

**Purpose:** Complete specification for a 1000-card TCG alpha set. Claude Code uses this as CLAUDE.md + SKILL.md to generate cards in batches, with mandatory stop/validation gates.

**Target:** 1000 unique cards · 60-card decks · turn-based ship-vs-ship combat.

---

# PART 1 — GAME PREMISE (DO NOT IGNORE WHEN DESIGNING)

Two pilots face each other in space. Each has a ship with a hull (HP), systems (subsystems), reactor (energy source), and pilot loadout. Cards represent every action, system, drone, AI routine, module, and maneuver a ship can use.

**Turn structure (reference):**
1. Draw phase — draw 1 card (more with effects)
2. Energy phase — gain reactor energy (1 + pilot bonus)
3. Main phase — play cards, activate Order abilities, declare attacks
4. Combat phase — resolve combat with Priority Fire / Quick Strike ordering
5. End phase — end-of-turn triggers, heat cooldown, status tick-down

**Win condition:** Reduce opponent's ship hull to 0, OR destroy their Reactor Core subsystem.

---

# PART 2 — THE 6-SUBSYSTEM HEALTH MODEL (UNIQUE TO VOIDEXA)

Ship health is not one HP bar. Each ship has 6 subsystems that cards can target.

| Subsystem | Function if destroyed |
|---|---|
| **Hull Integrity** | Main HP pool. If 0, you lose. |
| **Shield Capacity** | Regenerates 2/turn. First damage absorbed here. |
| **Reactor Core** | Provides energy. If 0, you lose (alt win condition). |
| **Weapons Array** | If 0, you cannot play Weapon cards until repaired. |
| **Engines** | If 0, you cannot play Maneuver cards until repaired. |
| **Life Support** | If 0, you lose in 3 turns unless restored. |

Not every card targets a specific subsystem. Most damage hits Shield → Hull in standard order. Specialty cards (EMP, Ion Cannon, Piercing Railgun, Life Support Assault) target specific subsystems.

---

# PART 3 — THE 9 CARD TYPES

| Type | What it is | Duration on field |
|---|---|---|
| **Weapon** | Offensive systems — turrets, missile racks, beams | Permanent until destroyed |
| **Defense** | Shields, armor, interceptor drones | Permanent until destroyed |
| **Drone** | Autonomous units deployed outside the ship | Permanent until destroyed |
| **AI Routine** | Tactical programs, ongoing subroutines | Permanent until destroyed |
| **Module** | Single-use hardware — warheads, EMPs, flares | Consumed after use |
| **Maneuver** | Pilot actions — dodges, ramming, evasive rolls | Instant, discarded after use |
| **Equipment** | Attaches to a Drone, Weapon, or your Ship for a permanent buff | Stays while host is alive |
| **Field** | Ongoing protocol that modifies game rules | Permanent until removed |
| **Ship Core** | ONE permanent ship modification per deck | Permanent, cannot be removed |

**Ship Core rule:** Each deck includes exactly 1 Ship Core card. Placed in its own zone at game start. Gives passive bonuses throughout the game. Think of it like MTG's Commander.

---

# PART 4 — THE 3 NEW SYSTEMIC MECHANICS (UNIQUE TO VOIDEXA)

## 4A — Heat System

Every ship has a Heat Meter (0 to 10). Each Weapon card played adds heat. Each turn end removes 1 heat.

- Heat 0-5: normal operation
- Heat 6-8: next Weapon costs +1 energy (overheat penalty)
- Heat 9-10: your ship takes 2 self-damage per turn end until heat drops

Specific cards interact: **Heat Sink** modules reduce heat. **Overcharge Reactor** cards grow stronger with high heat.

## 4B — Pilot Selection (Login Choice)

At login / game start, player chooses one pilot type. Pilot provides a passive bonus the entire match:

| Pilot | Bonus |
|---|---|
| **Ace** | All Weapons +1 damage |
| **Engineer** | All Modules cost -1 energy |
| **Strategist** | See top 2 cards of your deck each turn end |
| **Commander** | +1 card at start of each turn |
| **Saboteur** | Your Disruption cards (Cat. I) cost -1 |
| **Defender** | All Defense cards +1 HP |

Cannot be changed mid-match. Choose before match start.

## 4C — Environmental Cards (Battlefield Modifiers)

Some Field cards modify the battlefield for all players. Only ONE Environmental Field can be active at a time. Playing a new one replaces the old.

Examples: Nebula Storm (-30% accuracy all attacks) · Asteroid Field (non-Defense units take 2 damage at turn start) · Solar Flare (Modules cost +1) · Null Space (no Negate or Reactive allowed).

---

# PART 5 — RARITY DISTRIBUTION

| Rarity | Count | % | Max copies per deck |
|---|---|---|---|
| Common | 400 | 40% | 4 |
| Uncommon | 280 | 28% | 4 |
| Rare | 160 | 16% | 2 |
| Epic | 90 | 9% | 2 |
| Legendary | 50 | 5% | 1 |
| Mythic | 20 | 2% | 1 |

---

# PART 6 — CARD TYPE DISTRIBUTION

| Type | Count | % |
|---|---|---|
| Weapon | 170 | 17% |
| Drone | 140 | 14% |
| AI Routine | 140 | 14% |
| Defense | 130 | 13% |
| Module | 110 | 11% |
| Maneuver | 100 | 10% |
| Equipment | 90 | 9% |
| Field | 70 | 7% |
| Ship Core | 50 | 5% |

---

# PART 7 — ENERGY COST CURVE

| Cost | Count | % | Rule |
|---|---|---|---|
| 0 | 50 | 5% | Reactive / Conditional / Single-use ONLY |
| 1 | 170 | 17% | Tempo plays |
| 2 | 200 | 20% | Core midgame |
| 3 | 200 | 20% | Core midgame |
| 4 | 150 | 15% | Power plays |
| 5 | 100 | 10% | Finishers |
| 6 | 70 | 7% | Big threats |
| 7 | 40 | 4% | Legendary-tier |
| 8+ | 20 | 2% | Mythic / ultimate |

---

# PART 8 — TEMPO ARCHETYPES

| Archetype | Count | % | Signature abilities |
|---|---|---|---|
| Aggro | 200 | 20% | Rapid Launch, Hot Deploy, Assault Protocol, Overflow Fire |
| Control | 200 | 20% | Interceptor, System Shielding, Negate, Board Clears |
| Midrange | 250 | 25% | Trade-efficient units, toolbox removal |
| Combo | 150 | 15% | Chain Catalyst, Linked Fire, Cascading Power |
| Ramp | 80 | 8% | Energy Surge, Reactor Vent, Fuel Scavenge |
| Utility | 120 | 12% | Probe, Deep Scan, Cycling Protocol |

---

# PART 9 — THE 78 ABILITIES (FULL LIST)

## Category A — Combat (10)
1. **Priority Fire** — Resolves damage before opponent this turn.
2. **Alpha Strike** — Hits twice in same combat step.
3. **Overflow Fire** — Excess damage hits the enemy ship directly.
4. **Critical Strike** — Any damage destroys target Drone or Weapon system.
5. **Assault Protocol X** — +X power when attacking.
6. **Battle Hardened** — +1 power per damage on this unit.
7. **Rapid Launch** — Enters play ready to attack an enemy unit.
8. **Flanking Fire** — Must be blocked by 2 or more units.
9. **Quick Strike** — Strikes before defender when attacking.
10. **Breach Cascade** — When this deals damage, adjacent enemy units take 1.

## Category B — Defense (12)
11. **Interceptor** — Enemy must attack Interceptor units first.
12. **System Shielding** — Ignores the first instance of damage.
13. **Ablative Plating X** — Damage reduced by X before hitting HP.
14. **Reinforced Hull** — Cannot be destroyed by damage this turn.
15. **Cloaked Entry** — Cannot be attacked the turn deployed.
16. **Gain Stealth** — Cannot be targeted by enemy abilities.
17. **Countermeasure X** — Opponent pays +X energy to target this.
18. **Auto-Repair X** — Heals X at end of your turn.
19. **Evade X%** — X% chance to negate incoming damage.
20. **Emergency Reboot** — First time destroyed, revive with 1 HP.
21. **Signal Jammer** — Negates first spell targeting this unit.
22. **Tracking Array** — Can block Skyward Maneuver units.

## Category C — Life / Resource (7)
23. **Hull Drain** — Damage dealt heals your ship.
24. **Recon Beacon X** — Heal your ship X when attacking.
25. **Overclock** — +1 power at end of each your turn.
26. **Power Surge** — Take damage = own power, then effect.
27. **Reactor Vent** — Gain 2 energy, skip next draw.
28. **Fuel Scavenge** — Gain 1 energy when enemy unit destroyed.
29. **Energy Surge** — Fills energy meter when played.

## Category D — Evasion (4)
30. **Skyward Maneuver** — Only blockable by Skyward or Tracking Array.
31. **Phase Drive** — Only blockable by other Phase Drive units.
32. **Outrider** — First attack each turn does not cost your action.
33. **EMP Pulse** — Target's power becomes 0 this turn.

## Category E — Triggers / Timing (13)
34. **Deploy Burst** — Effect triggers when deployed from hand.
35. **Critical Breach** — Effect triggers when destroyed.
36. **Persistent Field** — Passive effect while in play.
37. **End Cycle** — Triggers at end of your turn.
38. **Mission Complete** — Transforms when task condition met.
39. **Manual Fire** — Once-per-turn activated ability.
40. **Hot Activation** — Can use Manual Fire the turn deployed.
41. **Reactive** — Can be played on opponent's turn.
42. **Hot Deploy** — Can act on the turn deployed.
43. **Cold Boot X** — Disabled for X turns after deployed.
44. **Chain Catalyst** — Triggers on next non-unit card.
45. **Cascading Power** — +1 power per non-unit card played.
46. **Linked Fire** — Bonus if another card played this turn.

## Category F — Card Draw / Deck (6)
47. **Probe X** — Look at top X cards, reorder.
48. **Deep Scan** — Choose 1 of 3 random cards.
49. **Cycling Protocol** — Discard to draw.
50. **Tactical Draw** — Draw N, lose X energy.
51. **Archive Recall** — Play a copy from discard.
52. **Endgame Protocol** — Bonus when deck has 15 or fewer cards.

## Category G — Board Manipulation (10)
53. **Apply Lock** — Target skips next refresh.
54. **Tracking Lock** — Target takes +N damage from future attacks.
55. **Disable** — Target cannot activate abilities next turn.
56. **System Reset** — Remove all statuses from target.
57. **Tractor Beam Hold** — Remove target from play, returns when captor dies.
58. **Negate** — Counter an opponent action.
59. **Hack/Corrupt** — Gain control of target for N turns.
60. **Transform/Overhaul** — Convert target into different unit.
61. **Bounce** — Return target to owner's hand.
62. **Scrap** — Sacrifice own unit for resource gain.

## Category H — Cost / Efficiency (8)
63. **Overcharge** — Pay extra for stronger effect.
64. **Crew Pooling** — Allied units contribute to cost.
65. **Salvage Redirect** — Destroy own units to reduce cost.
66. **Upgrade Trigger** — Upgrades when higher-cost card played.
67. **Modular Payload** — Choose 1 of 2 effects when played.
68. **Adaptive Learning** — +1 per card variety played.
69. **Efficiency Protocol** — Next N cards cost 1 less.
70. **Deferred Deployment** — Can play as energy source, deploy later.

## Category I — Disruption (sci-fi specific, 8)
71. **Signal Jamming** — Opponent cannot play specified card type next turn.
72. **Radiation Leak** — Target takes N damage over 3 turns.
73. **System Corruption** — Target's next card costs +N.
74. **AI Takeover** — Enemy drone attacks its owner next turn.
75. **Encryption Block** — Target cannot be copied or cloned.
76. **Phantom Echo** — Create decoy copy of enemy unit.
77. **Data Wipe** — Opponent discards random card.
78. **Sabotage Charge** — Plant on enemy card, triggers when used.

---

# PART 10 — UNIQUE MECHANICS FROM BRAINSTORM (ALL APPROVED BY JIX)

These are NOT keyword abilities. They are systemic mechanics that shape the whole set.

## 10A — Dual-Identity Cards (flip cards)
Some cards have two sides. Flip via a specific trigger.
- Example: "Scout Drone / Recon Beacon" — flips when you scan an enemy.
- Example: "Missile Module / Spent Casing" — flips after being used, can be recycled.
- Approx. 40 cards in the set are flip cards.

## 10B — Escalation Cards (growing power)
Start weak, grow stronger over time.
- Example: "Charging Capacitor" — damage starts 2, +1 per turn alive (cap 15).
- Example: "Patient Wreck" — dormant 5 turns, then massive effect.
- Approx. 30 cards in the set.

## 10C — Sacrifice Mechanics (power at a cost)
Cards that require destroying your own units or HP.
- Example: "Reactor Overload" — deal 30, lose 10 max HP permanently.
- Example: "Last Stand" — +10 all your cards, all destroyed at turn end.
- Approx. 25 cards in the set.

## 10D — Stacked Attacks (multi-turn wind-up)
Build up an attack over several turns before firing.
- Turn 1: Aim (no effect shown).
- Turn 2: Lock (apply Tracking Lock).
- Turn 3: Fire (damage × accumulated stacks).
- Approx. 15 cards in the set, mostly Legendary/Mythic.

## 10E — Cargo Hold (strategic deferral)
Some Modules can be placed face-down in cargo (max 5 slots). Played later at reduced cost. Opponent sees the slot but not the content.
- About 30 cards have the Cargo keyword.

## 10F — Environmental (battlefield-wide Field cards)
Replaces any other active Environmental when played.
- Approx. 15 cards in the Field category are Environmental.

---

# PART 11 — FLAVOR TEXT RULES

Every card gets ONE line of italic flavor text at bottom. Reminder text for keywords comes separately (generated automatically from keyword list).

Flavor text rules:
- 1 line, 8-15 words max
- First-person pilot voice, cold sci-fi tone, or lore fragment
- NO game mechanics in flavor text
- Can be dark, funny, poetic, or cynical — never bland
- Mythic cards may have 2 lines

Reference samples:
- Laser Pulse (Common): *"First weapon they teach you. Last weapon you forget."*
- Energy Shield (Common Defense): *"The geometry between you and death."*
- Scout Drone (Common): *"Small, cheap, expendable. Don't tell it that."*
- Stellar Annihilator (Legendary): *"Named by the only pilot who survived using it."*
- Quantum Convergence (Mythic): *"Probability bends. The universe blinks. You win."*

---

# PART 12 — EXAMPLE FULLY-DESIGNED CARDS (TEMPLATES FOR CLAUDE CODE)

Each example shows the complete card schema. Claude Code must match this format.

## Template schema (JSON)
```json
{
  "id": "lowercase_snake_case_id",
  "name": "Display Name",
  "type": "Weapon | Defense | Drone | AI Routine | Module | Maneuver | Equipment | Field | Ship Core",
  "rarity": "common | uncommon | rare | epic | legendary | mythic",
  "energy_cost": 0-10,
  "attack": 0-50,
  "defense": 0-50,
  "effect_text": "Plain text describing the ability",
  "keywords": ["keyword_slug_1", "keyword_slug_2"],
  "flavor_text": "Italic one-liner",
  "archetype": "aggro | control | midrange | combo | ramp | utility",
  "subsystem_target": "hull | shield | reactor | weapons | engines | life_support | null",
  "escalation": false,
  "dual_identity": false,
  "cargo": false
}
```

## 10 reference cards covering all 9 types and 6 rarities

### 1. Common Weapon — Aggro
```json
{
  "id": "pulse_cannon",
  "name": "Pulse Cannon",
  "type": "Weapon",
  "rarity": "common",
  "energy_cost": 1,
  "attack": 4,
  "defense": 0,
  "effect_text": "Deals 4 damage to target enemy unit or ship.",
  "keywords": [],
  "flavor_text": "Point and fire. Most of the time, that's enough.",
  "archetype": "aggro",
  "subsystem_target": null,
  "escalation": false,
  "dual_identity": false,
  "cargo": false
}
```

### 2. Uncommon Defense — Control
```json
{
  "id": "reactive_shield_grid",
  "name": "Reactive Shield Grid",
  "type": "Defense",
  "rarity": "uncommon",
  "energy_cost": 2,
  "attack": 0,
  "defense": 6,
  "effect_text": "System Shielding. When destroyed, give Shield Capacity +3.",
  "keywords": ["system_shielding", "critical_breach"],
  "flavor_text": "It breaks once. It breaks well.",
  "archetype": "control",
  "subsystem_target": "shield",
  "escalation": false,
  "dual_identity": false,
  "cargo": false
}
```

### 3. Rare Drone — Midrange
```json
{
  "id": "interceptor_drone_mk3",
  "name": "Interceptor Drone Mk.III",
  "type": "Drone",
  "rarity": "rare",
  "energy_cost": 3,
  "attack": 3,
  "defense": 5,
  "effect_text": "Interceptor. Hot Deploy.",
  "keywords": ["interceptor", "hot_deploy"],
  "flavor_text": "Bred for one purpose: to die before you do.",
  "archetype": "midrange",
  "subsystem_target": null,
  "escalation": false,
  "dual_identity": false,
  "cargo": false
}
```

### 4. Epic AI Routine — Combo
```json
{
  "id": "cascading_strike_protocol",
  "name": "Cascading Strike Protocol",
  "type": "AI Routine",
  "rarity": "epic",
  "energy_cost": 3,
  "attack": 0,
  "defense": 4,
  "effect_text": "Persistent Field. Your Weapon cards have Chain Catalyst: next non-unit card you play deals 2 extra damage.",
  "keywords": ["persistent_field", "chain_catalyst"],
  "flavor_text": "One trigger. Then the next. Then the next.",
  "archetype": "combo",
  "subsystem_target": null,
  "escalation": false,
  "dual_identity": false,
  "cargo": false
}
```

### 5. Legendary Module — Sacrifice / Finisher
```json
{
  "id": "reactor_overload",
  "name": "Reactor Overload",
  "type": "Module",
  "rarity": "legendary",
  "energy_cost": 5,
  "attack": 0,
  "defense": 0,
  "effect_text": "Deal 25 damage to target enemy ship. Your ship loses 8 max Hull Integrity permanently.",
  "keywords": [],
  "flavor_text": "You'll feel the heat in your teeth. Then nothing.",
  "archetype": "control",
  "subsystem_target": "hull",
  "escalation": false,
  "dual_identity": false,
  "cargo": false
}
```

### 6. Mythic Ship Core
```json
{
  "id": "quantum_core_singularity",
  "name": "Quantum Core: Singularity",
  "type": "Ship Core",
  "rarity": "mythic",
  "energy_cost": 0,
  "attack": 0,
  "defense": 0,
  "effect_text": "Passive: Once per match, you may play any card from your hand for 0 energy. That card cannot be Negated.",
  "keywords": ["persistent_field"],
  "flavor_text": "The probability of this working exactly once is perfect.",
  "archetype": "combo",
  "subsystem_target": null,
  "escalation": false,
  "dual_identity": false,
  "cargo": false
}
```

### 7. Common Maneuver — Reactive
```json
{
  "id": "evasive_roll",
  "name": "Evasive Roll",
  "type": "Maneuver",
  "rarity": "common",
  "energy_cost": 0,
  "attack": 0,
  "defense": 0,
  "effect_text": "Reactive. Target your ship or drone: the next incoming damage this turn is reduced by 4.",
  "keywords": ["reactive"],
  "flavor_text": "The pilots who survive are the ones who know when to not be there.",
  "archetype": "control",
  "subsystem_target": null,
  "escalation": false,
  "dual_identity": false,
  "cargo": false
}
```

### 8. Rare Equipment (new type)
```json
{
  "id": "overdrive_targeting_scope",
  "name": "Overdrive Targeting Scope",
  "type": "Equipment",
  "rarity": "rare",
  "energy_cost": 2,
  "attack": 0,
  "defense": 0,
  "effect_text": "Attach to a Weapon you control. Host gains +2 attack and Priority Fire.",
  "keywords": ["priority_fire"],
  "flavor_text": "Old pilots' rule: measure twice, fire first.",
  "archetype": "aggro",
  "subsystem_target": null,
  "escalation": false,
  "dual_identity": false,
  "cargo": false
}
```

### 9. Uncommon Field — Environmental
```json
{
  "id": "asteroid_field",
  "name": "Asteroid Field",
  "type": "Field",
  "rarity": "uncommon",
  "energy_cost": 2,
  "attack": 0,
  "defense": 0,
  "effect_text": "Environmental. At start of each turn, all Drones without Evade or Skyward Maneuver take 2 damage. Replaces any active Environmental.",
  "keywords": ["persistent_field"],
  "flavor_text": "Space is never empty. It is only hiding its teeth.",
  "archetype": "control",
  "subsystem_target": null,
  "escalation": false,
  "dual_identity": false,
  "cargo": false
}
```

### 10. Legendary Dual-Identity Drone
```json
{
  "id": "scout_drone_alpha",
  "name": "Scout Drone Alpha",
  "type": "Drone",
  "rarity": "legendary",
  "energy_cost": 2,
  "attack": 1,
  "defense": 3,
  "effect_text": "Deploy Burst: Probe 3. If an enemy unit is revealed this way, flip this card.",
  "keywords": ["deploy_burst", "probe"],
  "flavor_text": "It doesn't come back. It changes.",
  "archetype": "utility",
  "subsystem_target": null,
  "escalation": false,
  "dual_identity": true,
  "cargo": false,
  "flip_to": {
    "name": "Recon Beacon",
    "type": "AI Routine",
    "attack": 0,
    "defense": 5,
    "effect_text": "Persistent Field. Draw an extra card at the start of your turn. All your Weapons have +1 Priority Fire bonus.",
    "keywords": ["persistent_field"],
    "flavor_text": "The scout never dies. It just stops pretending to be one."
  }
}
```

---

# PART 13 — DESIGN RULES FOR CLAUDE CODE

When generating cards, follow these rules strictly.

## Rule 1 — Cost/Power Curve
Attack + Defense combined values must stay within the curve for the card's cost. Reference:

| Cost | Expected combined stats (A+D) | Max legit |
|---|---|---|
| 0 | 0-3 | 5 |
| 1 | 3-6 | 8 |
| 2 | 5-10 | 12 |
| 3 | 8-14 | 18 |
| 4 | 12-20 | 24 |
| 5 | 16-26 | 30 |
| 6 | 20-32 | 36 |
| 7 | 24-38 | 42 |
| 8+ | 28-50 | 55 |

Above "max legit" the card MUST have a drawback (Cold Boot, self-damage, once-per-game, Scrap cost, etc).

## Rule 2 — Rarity reflects complexity, not just power
- Common: 1-2 keywords max, simple effect
- Uncommon: 2-3 keywords, slight interaction
- Rare: 2-3 keywords, clear strategy role
- Epic: 3-4 keywords or complex conditional
- Legendary: unique named card, signature effect, often a win condition
- Mythic: game-changing, once-per-match effects usual, 1 copy rule

## Rule 3 — Keyword distribution (across 1000 cards)
- Tier 1 abilities (15 critical): 12 cards each = 180
- Tier 2 abilities (25 core): 8 cards each = 200
- Tier 3 abilities (25 flavor): 5 cards each = 125
- Tier 4 abilities (13 niche): 3 cards each = 39
- **Keyword cards total: 544**
- **Vanilla cards (0 keywords, pure stats/effect): 456**

## Rule 4 — 0-cost discipline
A 0-cost card MUST match one of these categories:
- **Reactive** — only playable on opponent's turn
- **Conditional** — "0 if you control a Drone" style
- **Trade-off** — "0, but lose 1 HP" or "0, but discard a card"
- **Single-use** — "Once per match" on the card

No free combo enablers.

## Rule 5 — Archetype alignment
Every card must clearly serve at least one archetype. When writing effect_text, the card's use-case must be obvious within 3 seconds.

## Rule 6 — Flavor text is required
No card ships without flavor text. 8-15 words, cold sci-fi voice.

## Rule 7 — Subsystem targeting
Most cards leave `subsystem_target` as null (hits Shield → Hull). Only specialty cards target specific subsystems. Aim for: ~15% of Weapons target specific subsystems. ~10% of Modules target specific subsystems.

## Rule 8 — Tempo archetype distribution (per batch of 100)
For every 100 cards generated, target this distribution:
- 20 Aggro
- 20 Control
- 25 Midrange
- 15 Combo
- 8 Ramp
- 12 Utility

---

# PART 14 — CLAUDE CODE EXECUTION PROTOCOL

## Batch structure

Claude Code generates cards in **batches of 100**. After each batch:

1. Output the full batch as JSON to `docs/alpha_set/batch_NN.json`
2. Append a one-line summary per card to `docs/alpha_set/MASTER_INDEX.md`
3. Run a validation script (see Rule Validation below)
4. **STOP execution**
5. Write a clear summary message: "Batch NN complete. X cards generated. Y validation warnings. Awaiting Jix approval before batch NN+1."

Jix reviews the batch. Only after Jix types "approve" does Claude Code proceed to the next batch.

## Batch plan (10 batches → 1000 cards)

| Batch | Focus | Cards |
|---|---|---|
| 01 | Common Weapons + Common Drones (aggro core) | 100 |
| 02 | Common Defense + Common Maneuvers | 100 |
| 03 | Common AI Routines + Common Modules | 100 |
| 04 | All remaining Commons + first Uncommons | 100 |
| 05 | Uncommons (weapons/drones/defense) | 100 |
| 06 | Uncommons (AI/modules/maneuvers) + first Rares | 100 |
| 07 | Rares (all types) | 100 |
| 08 | Epics + first Equipment / Field cards | 100 |
| 09 | Legendaries + all Ship Cores | 100 |
| 10 | Mythics + dual-identity cards + escalation cards | 100 |

## Validation checks Claude Code must run per batch

1. Every card has valid id, name, type, rarity, energy_cost, effect_text, flavor_text
2. id is lowercase_snake_case, unique within batch and vs earlier batches
3. rarity distribution in batch matches Part 5 ratios ±10%
4. type distribution in batch tracks Part 6 ratios
5. cost curve per Part 7
6. 0-cost discipline per Rule 4
7. A+D stats within Rule 1 bands
8. keyword usage stays within budgets (Tier 1 abilities not overused)
9. archetype tags present and distributed per Rule 8
10. flavor text present, 8-15 words

Any warnings → list them in the summary message to Jix.

## Output structure

```
docs/alpha_set/
  MASTER_DESIGN_DOCUMENT.md   (this file, never overwritten)
  batch_01.json
  batch_02.json
  ...
  batch_10.json
  MASTER_INDEX.md             (appended each batch)
  VALIDATION_LOG.md           (warnings accumulated)
  FINAL_SET.json              (merge of all batches, last step)
```

---

# PART 15 — NON-NEGOTIABLE RULES FOR CLAUDE CODE

1. **NEVER skip Jix's approval between batches.** Always stop and wait.
2. **NEVER invent new keywords.** Use only the 78 in Part 9.
3. **NEVER invent new card types.** Use only the 9 in Part 3.
4. **NEVER exceed combined A+D caps in Rule 1** without matching drawback.
5. **NEVER ship a card without flavor text.**
6. **NEVER repeat flavor text** across cards — each is unique.
7. **NEVER reuse card names** across batches.
8. **NEVER push to main.** Work on branch `alpha-set-generation`.
9. **If a rule in this document is ambiguous, STOP and ask Jix.**

---

**End of master document. Claude Code reads this top-to-bottom before generating batch 01.**
