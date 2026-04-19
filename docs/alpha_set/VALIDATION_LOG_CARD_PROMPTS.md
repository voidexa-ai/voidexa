# VALIDATION LOG — Card Art Prompts

Cards loaded: 1000
Prompts generated: 1000

## Distribution

**By type:**
- AI Routine: 149
- Defense: 143
- Drone: 173
- Equipment: 51
- Field: 39
- Maneuver: 98
- Module: 112
- Ship Core: 49
- Weapon: 186

**By rarity:**
- common: 400
- epic: 90
- legendary: 50
- mythic: 20
- rare: 160
- uncommon: 280

**By archetype:**
- aggro: 192
- combo: 156
- control: 194
- midrange: 252
- ramp: 87
- utility: 119

## Prompt length
- avg tokens: 100.0
- min tokens: 93
- max tokens: 119
- 150-word cap: PASS

## Render budget
- total render units (1x + mythics 2x): 1020
- mythics flagged for 2x: 20

## Part 15 checks

- ERRORS: 0 ✓
- WARNINGS: 0

## Check key
1. card → prompt 1:1 mapping (by id)
2. all 8 anatomy sections present per prompt
3. no prompt exceeds 150 words
4. duplicate positive-text detection (warning only)
5. canvas = 768x1024 on every prompt
6. deterministic seeds unique across set
7. subject inference non-trivial (name or heraldic-crest present)
8. special cases (dual_identity / escalation / cargo / mythic) tagged in notes

