# VOIDEXA CARD ART PROMPT GENERATION — MASTER DESIGN DOCUMENT

**Purpose:** Generate 1000 unique Vast.ai-ready art prompts — one per card — from the verified alpha set (`docs/alpha_set/batch_01.json` through `batch_10.json`).

**Scope:** One-sprint task. Claude Code reads all 10 batch files, applies template rules from this document, outputs `card_art_prompts.json` ready for Vast.ai batch rendering.

**Not in scope:** Actually rendering the art. That's a separate Vast.ai sprint after these prompts are generated and spot-checked.

---

# PART 1 — WHY THIS EXISTS

Every card has `type`, `rarity`, `effect_text`, `flavor_text`, `archetype`, and in most cases `keywords`. But the card JSONs do NOT have an `art_prompt_hints` field like the shop items did.

This means the card prompt generator has to INFER the subject from the card's data rather than reading a hints field. The inference logic is locked in this document so every card gets a coherent, on-brand prompt.

A real Vast.ai Stable Diffusion card prompt needs:
- Subject (inferred from type + name + effect text)
- Composition rules (centered hero shot, trading card framing)
- Type-specific style block (Weapon looks different from AI Routine)
- Rarity quality block (mythic has dramatic shaders, common is clean)
- Archetype mood (aggro = aggressive, control = defensive, combo = intricate, etc.)
- Lighting + atmosphere (cold sci-fi)
- Negative prompts
- Aspect ratio matching trading card format
- Consistency anchors so all 1000 cards feel like one set

This doc locks how those additions get built.

---

# PART 2 — INPUT AND OUTPUT

## Input
- `docs/alpha_set/batch_01.json` through `docs/alpha_set/batch_10.json` — 1000 cards total, verified complete

## Output
- `docs/alpha_set/card_art_prompts.json` — 1000 prompts, one per card
- Format per prompt:

```json
{
  "card_id": "weapon_crimson_fang",
  "card_name": "Crimson Fang",
  "type": "Weapon",
  "rarity": "common",
  "archetype": "aggro",
  "keywords": ["priority_fire", "alpha_strike"],
  "prompt_positive": "full prompt text ready for Vast.ai",
  "prompt_negative": "standard negative prompt",
  "canvas": "768x1024",
  "suggested_seed": 847293,
  "style_anchor": "voidexa_tcg_v1",
  "estimated_tokens": 95,
  "notes": "any special rendering notes"
}
```

---

# PART 3 — PROMPT TEMPLATE STRUCTURE

Every card prompt follows this 8-part anatomy:

**[1] UNIVERSE ANCHOR** (constant for all 1000 cards — ensures visual consistency across the set)

"voidexa trading card game, sci-fi space combat, cohesive card art direction, premium TCG illustration"

**[2] SUBJECT** (inferred from card type + name + effect_text — see Part 4)

Example for a Weapon called "Crimson Fang" with effect "Deal 3 damage": "ship-mounted energy cannon with crimson plasma discharge, weapon hardware detail shot"

**[3] TYPE STYLE BLOCK** (locked per card type — see Part 5)

Example for Weapon: "mechanical hardware close-up, industrial detail, metal and energy materials"

**[4] RARITY QUALITY BLOCK** (locked per rarity — see Part 6)

Example for common: "clean simple illustration, solid color work, clear readable composition"
Example for mythic: "masterwork illustration, complex multi-layer effects, dramatic particle systems, god-rays and volumetric light"

**[5] ARCHETYPE MOOD** (locked per archetype — see Part 7)

Example for aggro: "aggressive stance, forward motion, warm red and orange accents"
Example for control: "defensive stance, cool blues, static and protective composition"

**[6] LIGHTING + ATMOSPHERE** (derived from type + rarity)

Example: "dramatic rim lighting, deep space backdrop, cool blue-purple color grading, cinematic mood"

**[7] TECHNICAL SPECS** (locked for all cards)

"8K quality, sharp focus, trading card game illustration, digital painting style, professional concept art"

**[8] NEGATIVE PROMPT** (locked global)

"text, watermark, logo, signature, card border, card frame, title bar, stat numbers, blur, low quality, amateur, distorted, human faces, realistic photography, stock photo, AI fingerprints, noise, grain"

---

# PART 4 — SUBJECT INFERENCE FROM CARD DATA

The hardest part — since cards don't have explicit art hints, the prompt generator must build the SUBJECT from three inputs: `type`, `name`, and the first 80 characters of `effect_text`.

## Subject builder logic per type:

### Weapon
Formula: `"{name-as-subject}, ship-mounted weapon system, {effect-derived action}"`
- If effect contains "damage" or "destroy" → add "active firing, energy discharge visible"
- If effect contains "critical" or "pierce" → add "armor-piercing projectile, impact flash"
- If effect contains "chain" or "multi" → add "multi-barrel or linked firing pattern"
- Example: "Crimson Fang" + "Deal 3 damage" → "ship-mounted crimson plasma cannon, active firing, energy discharge visible"

### Drone
Formula: `"{name-as-drone-descriptor}, small autonomous spacecraft, {effect-derived behavior}"`
- If effect contains "deploy" → add "mid-deployment, released from carrier"
- If effect contains "attack" or "strike" → add "attack-run configuration, weapons hot"
- If effect contains "shield" or "protect" → add "escort formation, defensive posture"
- Example: "Assault Drone" → "small autonomous attack spacecraft, angular aggressive design, attack-run configuration"

### Defense
Formula: `"defensive ship system, {name-as-descriptor}, {effect-derived visual}"`
- If effect contains "shield" → add "active energy shield barrier, hexagonal pattern glow"
- If effect contains "hull" or "armor" → add "reinforced plating, structural armor detail"
- If effect contains "absorb" or "block" → add "energy absorption effect, impact deflection"
- Example: "Void Shield" → "defensive ship system with active energy shield barrier, hexagonal pattern glow"

### Maneuver
Formula: `"pilot cockpit action scene, {name-as-maneuver-descriptor}, {motion effect}"`
- If effect contains "move" or "dodge" → add "ship mid-evasion, motion blur streaks"
- If effect contains "boost" or "speed" → add "thrusters flaring, acceleration trails"
- If effect contains "warp" or "phase" → add "spatial distortion, reality-bending effect"
- Example: "Barrel Roll" → "pilot cockpit action, ship mid-evasion with motion blur streaks"

### AI Routine
Formula: `"ship AI interface, holographic data visualization, {name-as-concept}, {effect-derived pattern}"`
- If effect contains "scan" or "detect" → add "sonar pulse visualization, target-lock display"
- If effect contains "draw" or "cycle" → add "data stream visualization, information flow"
- If effect contains "persist" or "field" → add "ambient system glow, passive aura"
- Example: "Tactical Overwatch" → "ship AI interface with target-lock display, sonar pulse visualization"

### Module
Formula: `"modular ship component, {name-as-module-descriptor}, hardware close-up"`
- If effect contains "boost" or "upgrade" → add "active enhancement glow, power indicator"
- If effect contains "energy" or "power" → add "reactor-core detail, energy conduits"
- Example: "Power Conduit" → "modular ship component, reactor-core detail with energy conduits"

### Equipment
Formula: `"pilot equipment gear, {name-as-equipment-descriptor}, personal loadout item"`
- If effect contains "crew" or "pilot" → add "pilot personal gear, human-scale item"
- Example: "Combat Visor" → "pilot equipment, combat visor with HUD overlay"

### Field
Formula: `"persistent battlefield zone, {name-as-zone-descriptor}, area-of-effect visualization"`
- If effect contains "damage" or "hurt" → add "hostile energy zone, red-orange glow"
- If effect contains "heal" or "repair" → add "restorative aura, green-cyan glow"
- If effect contains "slow" or "lock" → add "gravitational or temporal distortion field"
- Example: "Radiation Zone" → "persistent battlefield zone with hostile energy, red-orange glow"

### Ship Core
Formula: `"ship identity emblem, {name-as-heraldic-crest}, centered symbolic composition"`
- Ship Cores are passive identity cards — always render as a heraldic emblem/crest
- Example: "Fighter Core: Aggressor" → "ship identity emblem, aggressor crest with aggressive heraldic motif"

---

# PART 5 — TYPE STYLE BLOCKS (locked per card type)

| Type | Style block | Canvas |
|---|---|---|
| Weapon | "mechanical hardware close-up, industrial weapon detail, metal and energy materials, hard surface design" | 768x1024 |
| Drone | "small spacecraft hero shot, 3/4 angle, tactical silhouette, mechanical greebles" | 768x1024 |
| Defense | "defensive ship system detail, shield or armor focus, structural emphasis" | 768x1024 |
| Maneuver | "dynamic motion scene, ship in action, streaks and trails, cinematic angle" | 768x1024 |
| AI Routine | "holographic interface visualization, data-viz abstract composition, blue-cyan glow, digital aesthetic" | 768x1024 |
| Module | "component hardware detail shot, product render style, isolated on gradient" | 768x1024 |
| Equipment | "pilot gear still life, equipment detail, personal-scale object" | 768x1024 |
| Field | "environmental zone visualization, area effect atmosphere, wide atmospheric shot" | 768x1024 |
| Ship Core | "heraldic emblem design, centered symbolic crest, symmetrical composition, trading card art centerpiece" | 768x1024 |

**All cards use 768x1024 canvas** — standard trading card portrait ratio (3:4).

---

# PART 6 — RARITY QUALITY BLOCKS (locked per rarity)

| Rarity | Quality block |
|---|---|
| common | "clean simple illustration, solid color work, clear readable composition, workmanlike craftsmanship" |
| uncommon | "refined illustration with added detail, secondary color accents, subtle atmospheric effect" |
| rare | "detailed illustration, rich color palette, noticeable lighting effects, premium craftsmanship" |
| epic | "elaborate detailed illustration, dramatic lighting, particle effects, custom color treatment, cinematic" |
| legendary | "masterwork illustration, signature visual motifs, dynamic composition, volumetric lighting, heroic presentation" |
| mythic | "masterwork plus, complex multi-layer effects, dramatic particle systems, god-rays and volumetric light, reality-bending quality, unmistakably rare" |

---

# PART 7 — ARCHETYPE MOOD BLOCKS (locked per archetype)

| Archetype | Mood block |
|---|---|
| aggro | "aggressive stance, forward motion, warm red and orange accents, tension and speed" |
| control | "defensive stance, cool blue tones, static and protective composition, measured and commanding" |
| midrange | "balanced composition, neutral colors, versatile stance, tactical readiness" |
| combo | "intricate interconnected detail, multiple moving parts visible, complex layered composition" |
| ramp | "growth motif, expanding energy, building power visualization, accumulating resource" |
| utility | "precision instrument aesthetic, technical clarity, purposeful design, supportive role" |

---

# PART 8 — LIGHTING + ATMOSPHERE MATRIX

Base lighting rule: "dramatic rim lighting, deep space backdrop, cool blue-purple color grading"

Type modifier:
- AI Routine, Module, Equipment: "digital holographic glow, cyan interface light, clean UI lighting"
- Weapon, Drone, Defense, Maneuver: "ship-in-space lighting, thruster glow, starfield backdrop"
- Field: "atmospheric environmental lighting, zone-colored ambient"
- Ship Core: "heraldic backlighting, symbolic composition lighting, centered highlight"

Rarity modifier added on top:
- common/uncommon: "subtle lighting"
- rare: "emphasized dramatic lighting"
- epic: "strong directional cinematic lighting"
- legendary: "bold cinematic hero lighting with volumetric rays"
- mythic: "transcendent lighting, prismatic refractions, volumetric glow throughout"

---

# PART 9 — TECHNICAL SPEC BLOCK (locked for all 1000 cards)

"8K quality, sharp focus, trading card game illustration, digital painting style, professional concept art, ArtStation quality, single centered subject"

---

# PART 10 — NEGATIVE PROMPT (locked global, every prompt)

"text, watermark, logo, signature, card border, card frame, title bar, stat numbers, visible keywords, UI elements, blur, low quality, amateur, distorted, extra limbs, human faces, realistic photography, stock photo aesthetic, AI fingerprints, noise, grain, multiple subjects, busy background, cluttered composition"

---

# PART 11 — STYLE ANCHOR AND SEED STRATEGY

**Style anchor:** `voidexa_tcg_v1` (string appended to all prompts)

Ensures all 1000 cards share a coherent visual identity across the set.

**Seed strategy:**
- Each card gets a deterministic seed derived from its `id` (SHA-256 hash → int32)
- Same card regenerated always gets same seed → reproducible
- If a render is bad, changing seed by +1 gives a variation without full re-prompt

---

# PART 12 — SPECIAL CASE HANDLING

## 12A — Ship Cores
Always render as heraldic emblems/crests, NOT as ships. They are identity cards, not physical objects.

## 12B — AI Routines
Render as abstract holographic interfaces, NOT as physical hardware. They are software/data visualizations.

## 12C — Fields
Render as ENVIRONMENTS, not objects. Wide atmospheric scene showing the zone effect.

## 12D — Dual-identity cards (Part 10A mechanic)
These flip between two states during gameplay. For art, render only the PRIMARY state. Flip-state rendered separately in future sprint if needed. Flag in `notes` field.

## 12E — Escalation cards (Part 10B)
Show growth/accumulation visually — charging energy, stacking plates, etc. Use the "ramp" archetype mood regardless of card's actual archetype.

## 12F — Sacrifice cards (Part 10C)
Show cost-benefit visually — damaged/destroyed component alongside the powered-up result. Dark edge lighting on one side, bright on the other.

## 12G — Stacked-attack cards (Part 10D)
Show the charge-up motion — targeting reticle locking, power building, explosive release. Use Weapon style block regardless of actual type.

## 12H — Mythic signature cards
The 20 mythics are the set's showpieces. Each gets `estimated_render_time: 2x` in the output JSON — flag for Vast.ai to use higher-quality settings.

---

# PART 13 — EXAMPLE FULL PROMPTS (5 reference)

## Example 1 — Common Weapon (Aggro)
Card: Crimson Fang (Weapon, common, aggro)
Effect: "Deal 3 damage to target ship."
Keywords: priority_fire

Full prompt positive:
```
voidexa trading card game, sci-fi space combat, cohesive card art direction, premium TCG illustration, 
ship-mounted crimson plasma cannon, weapon hardware detail shot, active firing, energy discharge visible, 
mechanical hardware close-up, industrial weapon detail, metal and energy materials, hard surface design, 
clean simple illustration, solid color work, clear readable composition, workmanlike craftsmanship, 
aggressive stance, forward motion, warm red and orange accents, tension and speed, 
dramatic rim lighting, deep space backdrop, cool blue-purple color grading, ship-in-space lighting, thruster glow, starfield backdrop, subtle lighting, 
8K quality, sharp focus, trading card game illustration, digital painting style, professional concept art, ArtStation quality, single centered subject, 
voidexa_tcg_v1
```
Canvas: 768x1024

## Example 2 — Mythic AI Routine (Combo)
Card: Quantum Convergence (AI Routine, mythic, combo)
Effect: "At end of cycle, link any two cards in your hand."

Full prompt positive:
```
voidexa trading card game, sci-fi space combat, cohesive card art direction, premium TCG illustration, 
ship AI interface, holographic data visualization, quantum convergence concept, interconnected data streams linking nodes, 
holographic interface visualization, data-viz abstract composition, blue-cyan glow, digital aesthetic, 
masterwork plus, complex multi-layer effects, dramatic particle systems, god-rays and volumetric light, reality-bending quality, unmistakably rare, 
intricate interconnected detail, multiple moving parts visible, complex layered composition, 
dramatic rim lighting, deep space backdrop, cool blue-purple color grading, digital holographic glow, cyan interface light, clean UI lighting, transcendent lighting, prismatic refractions, volumetric glow throughout, 
8K quality, sharp focus, trading card game illustration, digital painting style, professional concept art, ArtStation quality, single centered subject, 
voidexa_tcg_v1
```
Canvas: 768x1024

## Example 3 — Epic Defense (Control)
Card: Paragon Shield (Defense, epic, control)
Effect: "Absorb next 8 damage. Reactive."
Keywords: reactive, ablative_plating

Full prompt positive:
```
voidexa trading card game, sci-fi space combat, cohesive card art direction, premium TCG illustration, 
defensive ship system, paragon shield, active energy shield barrier, hexagonal pattern glow, 
defensive ship system detail, shield or armor focus, structural emphasis, 
elaborate detailed illustration, dramatic lighting, particle effects, custom color treatment, cinematic, 
defensive stance, cool blue tones, static and protective composition, measured and commanding, 
dramatic rim lighting, deep space backdrop, cool blue-purple color grading, ship-in-space lighting, thruster glow, starfield backdrop, strong directional cinematic lighting, 
8K quality, sharp focus, trading card game illustration, digital painting style, professional concept art, ArtStation quality, single centered subject, 
voidexa_tcg_v1
```
Canvas: 768x1024

## Example 4 — Legendary Ship Core
Card: Valkyrie (Ship Core, legendary)
Effect: "Passive: +2 attack to all Weapons. Archetype: aggro"

Full prompt positive:
```
voidexa trading card game, sci-fi space combat, cohesive card art direction, premium TCG illustration, 
ship identity emblem, valkyrie crest, winged warrior heraldic motif, centered symbolic composition, 
heraldic emblem design, centered symbolic crest, symmetrical composition, trading card art centerpiece, 
masterwork illustration, signature visual motifs, dynamic composition, volumetric lighting, heroic presentation, 
aggressive stance, forward motion, warm red and orange accents, tension and speed, 
heraldic backlighting, symbolic composition lighting, centered highlight, bold cinematic hero lighting with volumetric rays, 
8K quality, sharp focus, trading card game illustration, digital painting style, professional concept art, ArtStation quality, single centered subject, 
voidexa_tcg_v1
```
Canvas: 768x1024

## Example 5 — Rare Field (Utility)
Card: Deferred Zone (Field, rare, utility)
Effect: "Delay next attack by 1 cycle. Persistent field."
Keywords: persistent_field, deferred_deployment

Full prompt positive:
```
voidexa trading card game, sci-fi space combat, cohesive card art direction, premium TCG illustration, 
persistent battlefield zone, deferred time dilation, temporal distortion field, area-of-effect visualization, 
environmental zone visualization, area effect atmosphere, wide atmospheric shot, 
detailed illustration, rich color palette, noticeable lighting effects, premium craftsmanship, 
precision instrument aesthetic, technical clarity, purposeful design, supportive role, 
dramatic rim lighting, deep space backdrop, cool blue-purple color grading, atmospheric environmental lighting, zone-colored ambient, emphasized dramatic lighting, 
8K quality, sharp focus, trading card game illustration, digital painting style, professional concept art, ArtStation quality, single centered subject, 
voidexa_tcg_v1
```
Canvas: 768x1024

---

# PART 14 — CLAUDE CODE EXECUTION PROTOCOL

## Single execution, not batched

Input is 1000 cards across 10 files. Output is 1000 prompts in one JSON file. Runs in one Claude Code session.

## Steps Claude Code performs:

1. Read all 10 files from `docs/alpha_set/batch_01.json` through `batch_10.json`
2. For each card, build prompt using Part 3's 8-part anatomy + Part 4's subject inference logic
3. Save to `docs/alpha_set/card_art_prompts.json`
4. Generate spot-check sample: 30 random cards (3 per rarity tier × 10 different types) in `docs/alpha_set/CARD_PROMPT_SAMPLE_30.md` for Jix review
5. Validation per Part 15
6. Commit on main: "feat(alpha-set): generate 1000 Vast.ai card art prompts from alpha catalog"
7. STOP — await Jix approval before any Vast.ai activity

## Output file structure:

```
docs/alpha_set/
  card_art_prompts.json       (1000 complete prompts)
  CARD_PROMPT_SAMPLE_30.md    (30 random samples for Jix review)
  VALIDATION_LOG_CARD_PROMPTS.md (validation results)
scripts/
  generate_card_prompts.py    (reproducible regenerator)
```

---

# PART 15 — VALIDATION CHECKS

Claude Code runs these checks before reporting success:

1. Every card in the 10 batch files has a matching prompt in output
2. Every prompt has all 8 anatomy sections present
3. No prompt exceeds 150 words (Vast.ai token safety)
4. No duplicate prompts (flag as warning if two cards produce identical text)
5. All canvas values are 768x1024
6. All seeds are unique per card
7. Subject inference ran for every card — no card has generic placeholder subject
8. All special cases from Part 12 are correctly tagged in `notes` field

If any check fails, report and stop. Do NOT commit.

---

# PART 16 — POST-PROMPT FLOW

1. Jix reviews `CARD_PROMPT_SAMPLE_30.md`
2. If samples look good → proceed to Vast.ai rendering sprint (separate master doc)
3. If samples need adjustment → tweak rules in this doc, regenerate
4. Vast.ai sprint uses prompts from `card_art_prompts.json` to batch-render 1000 PNGs
5. Rendered PNGs stored in Supabase Storage bucket `cards`
6. Game UI reads from that bucket

---

# PART 17 — NON-NEGOTIABLE RULES

1. NEVER skip any of the 8 anatomy sections
2. NEVER hardcode a subject — always derive from card type + name + effect_text per Part 4
3. NEVER use a canvas other than 768x1024
4. NEVER include human faces or figures (negative prompt enforces)
5. NEVER push to main without spot-check sample file generated
6. If a card has ambiguous type or effect_text, STOP and ask Jix
7. Ship Cores are ALWAYS heraldic emblems — never render as ships
8. AI Routines are ALWAYS holographic interfaces — never physical hardware
9. Fields are ALWAYS environmental scenes — never objects

---

**End of master document.**
