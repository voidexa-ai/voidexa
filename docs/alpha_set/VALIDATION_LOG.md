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
