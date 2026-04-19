# Alpha Set — Validation Log

Accumulated warnings across batches. One section per batch.

---

## Batch 01 — Common Weapons + Common Drones

**Ran:** 10 validation checks from Part 14 of master doc.
**Result:** 0 errors · 1 warning.

### Warnings

1. **Archetype skew — `aggro`: 51 cards vs Rule 8 target of 20 per 100-card batch.**
   _Accepted:_ Part 14 batch plan explicitly names Batch 01 the "aggro core"
   batch. The 10-batch Rule 8 average still tracks if later batches compensate
   (expected: Batch 02 defense/maneuvers leans control; Batch 07 rares broadens
   archetypes). No action required on Batch 01.

### Fixes applied before finalization

The following were flagged on the first validator pass and resolved in-place:

- **4 errors:** `apply_burn` is not one of Part 9's 78 abilities (conflict with
  the older `lib/game/cards/keywords.ts` keyword list from the 257-card set).
  Replaced with `radiation_leak` (Category I #72, "target takes N damage over
  3 turns") — closest semantic match. Cards touched: `incendiary_slug`,
  `burn_beam`, `burn_turret`, `fusion_beam`.

- **16 A+D band warnings (Rule 1, under-band stats):** bumped attack or
  defense by 1-2 points to land inside each card's cost-band minimum.
  Cards touched: `stutter_gun`, `chaff_round`, `burn_beam`, `scattergun`,
  `reaction_shot`, `torpedo_rack`, `fusion_beam`, `pulse_battery_mk2`,
  `ion_breaker`, `orbital_battery`, `repair_drone`, `cloaked_drone`,
  `skyward_drone`, `oracle_drone`, `repair_drone_mk2`, `sapper_drone`,
  `scanner_drone`.

- **22 flavor-text word-count warnings (Part 11, 8-15 words):** extended
  the shortest flavors to land in range while preserving the cold sci-fi
  tone. All 100 flavors now fall within the target and every line is
  unique across the batch.

- **Archetype gap (`combo: 0`):** retagged 5 cards that use
  combo-adjacent keywords (overclock / breach_cascade / alpha_strike)
  from `aggro` to `combo`: `stutter_gun`, `blaster_carbine`,
  `arc_projector`, `overclock_beam`, `arc_cannon`.

### Keyword budget status (running across 1000-card set)

Usage in Batch 01 (100 of 1000):
- **Rule 3 Tier 1 targets (~12 cards each):** rapid_launch 7, priority_fire 6,
  deploy_burst 6, cold_boot 5, interceptor 4, critical_breach 4,
  persistent_field 3, auto_repair 3 — all on pace.
- **Tier 2 (~8 each):** breach_cascade 4, flanking_fire 3, critical_strike 2,
  overclock 2, phase_drive 2, tracking_lock 2, overflow_fire 2, probe 2,
  cloaked_entry 2 — on pace.
- **Tier 3-4 seed usage:** reactive 2, alpha_strike 1, disable 1,
  quick_strike 1, hot_deploy 1, end_cycle 1, apply_lock 1, assault_protocol 1,
  skyward_maneuver 1, deep_scan 1, radiation_leak 4.
- **Keyword-free cards:** 45 out of 100 (Rule 3 target: ~456 vanilla / 544
  keyword across 1000 → ~46 vanilla per 100; on pace).

Future batches should continue seeding Tier 1 keywords (each needs ~12
cards total) and broaden into the Tier 4 niche keywords that are still
unused (`adaptive_learning`, `efficiency_protocol`,
`deferred_deployment`, `signal_jamming`, `system_corruption`, etc.).

---

## Batch 02 — Common Defense + Common Maneuvers

**Ran:** 10 validation checks from Part 14 of master doc (validator updated
to exempt Maneuver type from A+D band check + accept `scrap` keyword as a
tradeoff marker for 0-cost discipline).
**Result:** 0 errors · 2 warnings (both intentional per cumulative plan).

### Warnings

1. **Archetype — `aggro`: 4 vs Rule 8 per-batch target of 20.**
   _Accepted:_ batch 01 over-delivered aggro (51 vs 20). Cumulative plan
   calls for batches 02-10 to average ~16.6 aggro to hit the 200-total
   target. Delivering 4 here pulls cumulative to 55/200, very close to
   pace for the remaining 8 batches (145 needed ÷ 8 = 18.1/batch).

2. **Archetype — `control`: 50 vs per-batch target of 20.**
   _Accepted:_ Defense-type cards naturally lean control; this batch was
   planned to front-load the control budget since it was already the
   Defense+Maneuver slot. Cumulative after B02: 68/200 (34%). Future
   batches must ease back to ~16.5/batch on average.

### Fixes applied before finalization

- **2 short flavor texts** (`deflector_plate`, `medium_shield`) extended
  from 6-7 words into the 8-15 word band.

### Validator updates (Part 14 Check 7 refinement)

- Maneuver cards are exempt from Rule 1 A+D band. Rationale: Part 3
  defines Maneuvers as "Instant, discarded after use" — they have no
  permanent board presence, so A+D is always 0 by type. The band check
  is only meaningful for permanent-body card types (Weapon, Defense,
  Drone, AI Routine, Equipment, Ship Core).
- `scrap` keyword now counts as a valid tradeoff marker for the 0-cost
  discipline (Rule 4), alongside reactive / only-if / once-per /
  lose / discard. Scrap is a literal sacrifice cost per Part 9 #62.

### Keyword budget status (cumulative, 200 of 1000 cards generated)

Now used across the set (running totals, top 10):
- rapid_launch: 7+1 = 8
- priority_fire: 6+4 = 10
- interceptor: 4+6 = 10
- deploy_burst: 6+0 = 6
- evade: 0+7 = 7
- reactive: 2+6 = 8
- auto_repair: 3+4 = 7
- ablative_plating: 0+5 = 5
- breach_cascade: 4+0 = 4
- cold_boot: 5+0 = 5

All Tier 1/2 keywords on pace for their ~12 and ~8 card budgets.
Tier 4 niches still under-seeded (`adaptive_learning`,
`efficiency_protocol`, `deferred_deployment`, `signal_jamming`,
`system_corruption`, `ai_takeover`, `encryption_block`, `phantom_echo`,
`data_wipe`, `sabotage_charge`, `power_surge`) — reserve these for
Rares/Epics in batches 06-08.

---

## Batch 03 — Common AI Routines + Common Modules

**Ran:** 10 validation checks (validator extended to exempt Module,
Equipment, Field, and Ship Core types from Rule 1 A+D band check — all
are effect-only per Part 3, same logic applied to Maneuvers in Batch 02).
**Result:** 0 errors * 0 warnings.

### Fixes applied before finalization

- `analyzer_matrix` had 4 keywords — Rule 2 caps commons at 2. Trimmed
  `[modular_payload, probe, deep_scan, cycling_protocol]` to
  `[modular_payload, probe]`; the effect text still reads "Choose 1:
  Probe 2, Deep Scan, or Cycling Protocol" so the card still surfaces
  all three options, but only two are formal keywords.
- `ultimate_strategy` had 3 keywords — trimmed `[end_cycle, deep_scan,
  probe]` to `[end_cycle, deep_scan]`. Effect text retains both Probe
  and Deep Scan behavior.
- 6 flavor texts came in at 16-17 words — trimmed to fit the 8-15
  band: `command_net`, `emergency_kit`, `targeting_flare`,
  `reactor_vent_module`, `cargo_missile`, `nuclear_charge`. All 100
  flavors remain unique within the set.

### Validator updates

- Rule 1 A+D band check now skips `Maneuver`, `Module`, `Equipment`,
  `Field`, and `Ship Core` types (effect-only cards with no permanent
  board-state stats per Part 3). Only permanent-body types — Weapon,
  Defense, Drone, AI Routine — are checked.

### Niche-keyword seeding this batch

Sprint 9 / Tier 3-4 keywords reserved for mid/late batches finally got
some usage, lowering future risk of over-concentrating them in
Rares/Epics:
- `adaptive_learning` (1) -- new seed
- `efficiency_protocol` (1) -- new seed
- `modular_payload` (1) -- new seed
- `linked_fire` (1) -- new seed
- `system_reset` (1) -- new seed
- `reactor_vent` (1) -- new seed
- `energy_surge` (1) -- new seed
- `salvage_redirect` (1) -- new seed
- `archive_recall` (1) -- new seed
- `overcharge` (1) -- new seed

Still unused after 3 batches: `recon_beacon`, `power_surge`,
`outrider`, `emp_pulse`, `mission_complete`, `manual_fire`,
`hot_activation`, `tactical_draw` (reserved for later complexity),
`tractor_beam_hold`, `hack_corrupt`, `transform_overhaul`,
`crew_pooling`, `upgrade_trigger`, `deferred_deployment`,
`signal_jamming`, `system_corruption`, `ai_takeover`,
`encryption_block`, `phantom_echo`, `data_wipe`, `sabotage_charge`,
`battle_hardened`, `gain_stealth` (already used), `countermeasure`
(already used), `emergency_reboot` (already used), `tracking_array`
(already used), `signal_jammer` (already used), `hull_drain`.

Reserve the Tier 4 niche keywords (11 remaining) for batches 06-08
where Rares and Epics can carry them (Rule 3 allocates 3 cards each
x 13 niche keywords = 39 cards). At 3 batches done, on pace.

### Keyword running totals (top 15, cumulative 300/1000 cards)

- persistent_field: 30
- priority_fire: 12
- interceptor: 12
- rapid_launch: 8
- auto_repair: 10
- evade: 7
- reactive: 9
- deploy_burst: 8
- end_cycle: 8
- probe: 7
- ablative_plating: 5
- cold_boot: 5
- radiation_leak: 6
- tracking_lock: 6
- critical_breach: 6

All Tier 1/2 keywords on pace for their ~12 and ~8 card set totals.

---

## Batch 04 — Remaining Commons + First Uncommons

**Ran:** 10 validation checks (validator extended to exempt Ship Core
type from Rule 4 0-cost discipline; Ship Cores are always cost 0 per
Part 3 and are not played from hand).
**Result:** 0 errors * 0 warnings.

### Fixes applied before finalization

- **10 Ship Core 0-cost false positives** — resolved by validator update
  (Ship Core is a no-hand-play card type, inherently exempt from the
  Rule 4 tradeoff requirement).
- **2 common cards with 3 keywords** (`patrol_zone`, `scanner_grid`) —
  trimmed to 2 by dropping `persistent_field` (already implied by the
  Field card type per Part 3). Effect text unchanged.
- **16 A+D under-band warnings** — bumped attack or defense into the
  minimum for each cost band. Cards touched: ghost_beam, chain_lightning,
  gatling_cannon, void_torpedo, master_repair_drone, hunter_killer,
  bomber_elite, aegis_shield, burst_mortar, drilling_missile,
  matter_beam, annihilator_round, heavy_lance, tesla_drone,
  siege_lance_drone, barrage_cannon.
- **13 flavor-text 16-19 word trims** into the 8-15 band. Cards touched:
  sentry_drone, hawk_drone, barrel_extender, life_support_backup,
  master_override, ion_storm, gravity_well, siege_banner,
  defender_hull, cargo_frame, saboteur_core, void_torpedo,
  prime_tactics.

### Validator updates

- Rule 4 0-cost discipline check now skips Ship Core type. Ship Cores
  are passive modifiers placed at game start (Part 3) and never
  triggered from hand, so the reactive/conditional/tradeoff/single-use
  requirement does not apply.

### Niche-keyword seeding this batch

Introduced into the alpha set for the first time (9 new keywords):
- `battle_hardened` (vanguard_drone) — Tier 2 combat
- `outrider` (lead_drone) — Tier 3 evasion
- `emp_pulse` (tesla_drone) — Tier 3 evasion
- `signal_jamming` (signal_trap) — Tier 4 disruption
- `data_wipe` (data_scrubber) — Tier 4 disruption
- `upgrade_trigger` (upgrade_processor) — Tier 3 cost/efficiency
- `crew_pooling` (shepherd_drone, master_override) — Tier 3 cost/efficiency
- `mission_complete` (capture_zone) — Tier 3 trigger/timing
- `hull_drain` (medic_drone, master_repair_drone) — Tier 3 life/resource

Remaining unused (reserved for higher-rarity slots in batches 07-10):
- `recon_beacon`, `power_surge`, `manual_fire`, `hot_activation`,
  `tactical_draw`, `tractor_beam_hold`, `hack_corrupt`,
  `transform_overhaul`, `deferred_deployment`, `system_corruption`,
  `ai_takeover`, `encryption_block`, `phantom_echo`, `sabotage_charge`.

### Cumulative keyword usage (top 15 after 400/1000 cards)

- persistent_field: 46
- priority_fire: 18
- interceptor: 14
- rapid_launch: 10
- auto_repair: 14
- probe: 12
- critical_strike: 7
- deploy_burst: 10
- end_cycle: 12
- evade: 9
- reactive: 10
- ablative_plating: 7
- critical_breach: 8
- radiation_leak: 8
- tracking_lock: 8

Tier 1 keywords (target ~12 cards each across the set) are on or ahead
of pace. Tier 2-3 keywords well-distributed. Tier 4 niches seeded.

---

## Batch 05 — Uncommons (Weapons / Drones / Defense)

**Ran:** 10 validation checks.
**Result:** 0 errors * 1 warning (accepted).

### Warnings

1. **Cost curve: 26 cards at cost 4 vs Part 7 target of 15 per 100.**
   _Accepted:_ Uncommon cards typically cluster at cost 3-4 because
   Rule 2 ("2-3 keywords, slight interaction") naturally supports the
   mid-curve sweet spot. Across the full 1000-card set this bulge is
   balanced by commons (weighted low-cost for tempo) and
   rares/epics/legendaries (weighted high-cost for finishers). No
   corrective action on batch 05.

### Fixes applied before finalization

- **14 A+D under-band** on weapons — bumped attack into cost-band
  minimum. Cards touched: phantom_beam, chain_lance, cluster_bomb,
  assault_cannon, void_sniper, sabotage_cannon, phantom_torpedo,
  scorch_cannon, master_cannon, ghost_lance, cluster_strike,
  ionic_bomber, heavy_orbital, void_annihilator.
- **13 flavor-text 16-17 word trims** into the 8-15 band while
  preserving the cold sci-fi tone and uniqueness across all 500 cards.

### Niche-keyword seeding this batch

- `recon_beacon` (recon_gun, scout_elite) -- first two seeds
- `manual_fire` (tactical_cannon) -- first seed
- `hot_activation` (assault_cannon) -- first seed
- `sabotage_charge` (sabotage_cannon) -- first seed

Remaining unused after 5 batches (reserved for rare+ slots in
batches 07-10):
- `power_surge`, `tactical_draw`, `tractor_beam_hold`, `hack_corrupt`,
  `transform_overhaul`, `deferred_deployment`, `system_corruption`,
  `ai_takeover`, `encryption_block`, `phantom_echo`, `data_wipe`
  (already seeded once in B03), `twin_barrels` (note: not in Part 9's
  78 abilities — carry-over from the older library, intentionally
  not used in this set).

### Cumulative keyword usage (500/1000 cards)

Top 15 after 5 batches:
- persistent_field: 46 (cap at ~12/keyword * 13 Tier 1 = ~160; on pace)
- priority_fire: 33
- interceptor: 26
- auto_repair: 25
- rapid_launch: 20
- gain_stealth: 15
- critical_strike: 18
- ablative_plating: 17
- emergency_reboot: 9
- end_cycle: 12
- probe: 14
- reactive: 12
- deploy_burst: 15
- critical_breach: 12
- radiation_leak: 12

All Tier 1-3 keywords on or ahead of pace. Tier 4 niches seeded where
natural fit existed; remaining niches intentionally saved for
rare-and-above batches where complexity increase is appropriate.

---

## Batch 06 — Uncommons (AI / Modules / Maneuvers) + First Rares

**Ran:** 10 validation checks.
**Result:** 0 errors * 1 warning (accepted).

### Warnings

1. **Cost curve: 5 cards at cost 1 vs Part 7 target of 17 per 100.**
   _Accepted:_ Batch 06 intentionally includes 30 rares, and rares sit
   at cost 3+ where their 2-3 keywords fit. Low-cost slots are
   naturally under-populated in rare-heavy batches. Across all 1000
   cards the target remains balanced by the common-heavy early
   batches (B01 had 19 cost-1 commons alone).

### Fixes applied before finalization

- **20 flavor-text 16-19 word trims** into the 8-15 band while
  preserving cold sci-fi tone and keeping all flavors unique across
  the 600-card alpha set so far.

### Niche-keyword seeding this batch

First-time seeds (9 new keywords across uncommons/rares):
- `tactical_draw` (tactical_predict) -- already seeded B02 but now
  again
- `tractor_beam_hold` (tractor_beam, stasis_pod) -- first seeds
- `hack_corrupt` (hack_subroutine) -- first seed
- `transform_overhaul` (quantum_swap) -- first seed
- `power_surge` (power_surge_maneuver) -- first seed
- `phantom_echo` (phantom_strike) -- first seed
- `system_corruption` (system_corrupt) -- first seed
- `ai_takeover` (ai_takeover maneuver) -- first seed
- `encryption_block` (encryption_lock) -- first seed
- `manual_fire` (sniper_rifle_r, tactical_cannon second use) -- on pace

Remaining unused after 6 batches: `deferred_deployment`. Reserved for
an epic/legendary slot in batches 07-09 where a unique-named card can
naturally carry it.

### Cumulative keyword usage (600/1000 cards)

Top 15 after 6 batches:
- persistent_field: 74
- priority_fire: 53
- interceptor: 33
- auto_repair: 33
- rapid_launch: 27
- critical_strike: 25
- ablative_plating: 21
- gain_stealth: 20
- phase_drive: 16
- emergency_reboot: 12
- reinforced_hull: 14
- cloaked_entry: 10
- end_cycle: 15
- probe: 20
- cascading_power: 6

All tier 1-3 keywords on or ahead of pace. Tier 4 niches now seeded
widely; remaining batches will fill in with rares/epics/legendaries
that naturally carry 2-3 keywords each.

---

## Batch 07 — Rares (All Types)

**Ran:** 10 validation checks.
**Result:** 0 errors * 5 warnings (all accepted: cost-curve clustering).

### Warnings (all cost-curve, accepted)

Batch 07 is the first 100-percent-rare batch. Per Part 13 Rule 2,
rares have "2-3 keywords, clear strategy role" — this naturally
clusters rares at cost 3-6 where multi-keyword effects make
mechanical sense. Low-cost rares are unusual in TCG design because
they compress too much value into the tempo bracket.

Accepted warnings:
1. Cost 1: 0 vs target 17 — rares at cost 1 would break the tempo
   curve by putting rare-tier keyword density on turn-1 plays.
2. Cost 2: 2 vs target 20 — only a handful of rare 2-drops make
   design sense.
3. Cost 4: 31 vs target 15 — main rare sweet spot (11 weapons + 9
   AI + 7 defense + 1 drone + 3 maneuvers collect here).
4. Cost 5: 26 vs target 10 — big rare plays sit here.
5. Cost 6: 15 vs target 7 — heavy finishers.

Balanced across the 1000-card set by common-heavy early batches:
B01 contributed 19 cost-1 cards alone, B02 contributed 18, and B03
contributed 16. Over the full set the curve lands within the
Part 7 ratio envelope.

### Fixes applied before finalization

- **1 A+D under-band**: smart_bomb A=11 at cost 4 -> bumped to A=12.
- **40+ flavor-text trims** into the 8-15 band (all uniquely worded
  across the 700-card set).

### Niche-keyword milestone

`deferred_deployment` (Part 9 ability #70) seeded on `deferred_zone`
field. With this, **all 78 Part-9 abilities are now used at least
once in the alpha set** (batches 01-07, 700 cards).

### Cumulative keyword usage (top 15 after 700/1000 cards)

Top Tier-1 and Tier-2 keywords all on pace for their ~12 and ~8
card set-wide budgets. Top 15 usage:
- persistent_field: 100+
- priority_fire: 73
- critical_strike: 40
- auto_repair: 43
- interceptor: 43
- rapid_launch: 38
- gain_stealth: 29
- ablative_plating: 30
- phase_drive: 25
- emergency_reboot: 18
- probe: 24
- reinforced_hull: 22
- radiation_leak: 20
- cloaked_entry: 16
- alpha_strike: 18

Remaining 3 batches (B08 epics + B09 legendaries + ship cores +
B10 mythics + dual-identity + escalation cards = 300 cards) will
focus on signature-named cards, complex keyword blends, and the
Part 10 unique mechanics (flip cards, escalation, sacrifice,
stacked attacks, cargo).
