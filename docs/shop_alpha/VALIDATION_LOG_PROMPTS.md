# VOIDEXA SHOP ART PROMPTS — VALIDATION LOG

Generated: 2026-04-19  
Source: `docs/shop_alpha/FINAL_SHOP_CATALOG.json` (400 items)  
Output: `docs/shop_alpha/shop_art_prompts.json` (400 prompts)  
Template spec: `docs/shop_art_prompts_master.md`

## Part 12 validation checks

1. **Catalog coverage** — every catalog item has a prompt: PASS (400/400)
2. **7-anatomy sections** — every prompt contains universe + category + rarity + technical + style-anchor anchors: PASS
3. **Word cap** — no prompt exceeds 150 words: PASS
4. **Prompt uniqueness** — no two prompts identical: PASS
5. **Canvas correctness** — every canvas matches Part 4 spec for its category: PASS
6. **Seed uniqueness** — every item has a unique deterministic seed: PASS

**Total warnings: 0**

## Warnings

*None.*

## Statistics

- **Prompt count:** 400
- **Words per prompt:** min=73, max=101, avg=82
- **Estimated tokens:** min=94, max=131, avg=106
- **Distinct categories covered:** 28 / 30 in Part 4 table
- **Distinct canvases used:** ['1024x1024', '1024x256', '1024x512', '1024x768', '1536x1024', '1536x512', '512x512']

### Distribution by category

| Category | Count |
|---|---|
| ship_skin | 64 |
| trail | 34 |
| bundle | 31 |
| title | 30 |
| effect | 25 |
| card_back | 24 |
| card_frame | 18 |
| battle_board | 17 |
| weapon_sfx | 16 |
| banner | 14 |
| decal | 12 |
| pilot_voice | 12 |
| interior_decor | 11 |
| bobblehead | 11 |
| battle_music | 10 |
| card_pack | 10 |
| cockpit | 9 |
| victory_screen | 8 |
| dashboard_lighting | 8 |
| engine_sound | 8 |
| warp_sting | 6 |
| damage_numbers | 4 |
| cockpit_radio | 4 |
| rank_badge | 4 |
| scanner_pulse | 3 |
| targeting_reticle | 3 |
| nameplate | 3 |
| warp_tunnel | 1 |

### Distribution by rarity

| Rarity | Count |
|---|---|
| common | 129 |
| uncommon | 102 |
| rare | 69 |
| epic | 46 |
| legendary | 42 |
| mythic | 12 |

### Distribution by capability tier

| Tier | Count |
|---|---|
| T1 | 253 |
| T2 | 112 |
| T3 | 35 |

### Distribution by canvas

| Canvas | Count |
|---|---|
| 1024x1024 | 201 |
| 1536x1024 | 56 |
| 1024x512 | 42 |
| 512x512 | 33 |
| 1024x256 | 33 |
| 1024x768 | 21 |
| 1536x512 | 14 |

## Output files

- `docs/shop_alpha/shop_art_prompts.json` — 528,074 bytes
- `docs/shop_alpha/PROMPT_SAMPLE_20.md` — 20 random samples for Jix review
- `docs/shop_alpha/VALIDATION_LOG_PROMPTS.md` — this file
