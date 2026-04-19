# VOIDEXA SHOP ALPHA — VALIDATION LOG

Accumulated warnings from the 10-check validator (Part 11 of master doc).

---

## Batch 01 — Ship Skins & Decals (Common + Uncommon)
Run date: 2026-04-19

### Checks run
1. All required fields present — PASS
2. IDs are `lowercase_snake_case` and unique across batch — PASS
3. Rarity distribution tracks Part 4 — PASS *(batch-focused: 24 Common + 16 Uncommon, 60/40 split matches the 32:22 ratio in the Ship Skins sub-catalog in Part 9A)*
4. Category distribution tracks Part 5 — INTENTIONAL DEVIATION *(see note below)*
5. Prices within rarity bands (Common 50-100, Uncommon 100-250) — PASS
6. `capability_tier` ∈ {T1, T2, T3} — PASS (all 40 are T1, ship immediately)
7. `flavor_text` 8-15 words, unique across batch — PASS (after one fix: `decal_shark_teeth` reduced from 16→12 words pre-commit)
8. `name` unique across batch — PASS
9. `category` matches `tab` (ship_skin/decal → SHIPS_AND_SKINS) — PASS
10. `art_prompt_hints` has subject + style + color palette + mood — PASS

### Warnings
**0 warnings after fix.**

### Intentional deviations (not warnings, logged for transparency)
- **Check 4 (category distribution per-batch):** Rule 6 in Part 8 targets `~20% ship skins, ~15% trails...` per batch. Part 11's batch plan explicitly says Batch 01 = 40 Ship Skins & Decals. The batch plan wins — Rule 6 will average out across all 10 batches, not within one. Expect similar intentional deviations in Batches 02–10.
- **Check 3 (rarity distribution per-batch):** Part 4's 40/28/16/9/5/2 split is a catalog-wide target. Batch 01's focus is Common + Uncommon only, so this batch intentionally contains 60% Common / 40% Uncommon. Over-weight here is offset by future batches containing Rare → Mythic items.

### Pre-commit fix applied
- `decal_shark_teeth.flavor_text`: shortened from 16→12 words
  - before: "The teeth were painted by a pilot who did not come back. New one keeps them."
  - after:  "Painted by a pilot who did not come back. Kept anyway."
