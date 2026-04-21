# VOIDEXA SHOP ART PROMPT GENERATION — MASTER DESIGN DOCUMENT

**Purpose:** Generate 400 unique Vast.ai-ready art prompts — one per shop item — from the verified `FINAL_SHOP_CATALOG.json`.

**Scope:** This is a one-sprint task. Claude Code reads the shop catalog, applies template rules from this document, outputs `shop_art_prompts.json` ready for Vast.ai batch rendering.

**Not in scope:** Actually rendering the art. That's a separate Vast.ai sprint after these prompts are generated and spot-checked.

---

# PART 1 — WHY THIS EXISTS

Every shop item has an `art_prompt_hints` field already in the catalog (e.g., "starfighter hull full paint, clean matte finish, deep crimson red with subtle panel shading, aggressive and confident").

But `art_prompt_hints` is just the SUBJECT. A real Vast.ai Stable Diffusion prompt needs:
- Subject (from hints)
- Style/quality descriptors (standardized per category)
- Composition rules (framing, angle, canvas aspect)
- Lighting + mood (matched to rarity tier)
- Negative prompts (what to avoid — text, watermarks, blur)
- Aspect ratio + resolution instructions
- Consistency anchors so all 400 items look like they belong to the same universe

This doc locks how those additions get built so every item's final prompt is consistent, complete, and Vast.ai-ready.

---

# PART 2 — INPUT AND OUTPUT

## Input
- `docs/shop_alpha/FINAL_SHOP_CATALOG.json` — 400 items, verified complete

## Output
- `docs/shop_alpha/shop_art_prompts.json` — 400 prompts, one per item
- Format per prompt:

```json
{
  "item_id": "skin_crimson_fighter",
  "item_name": "Crimson Fighter",
  "category": "ship_skin",
  "rarity": "common",
  "tier": "T1",
  "prompt_positive": "full prompt text ready for Vast.ai",
  "prompt_negative": "standard negative prompt",
  "canvas": "1024x1024 | 1024x768 | 512x768",
  "suggested_seed": 12345,
  "style_anchor": "voidexa_universe_v1",
  "estimated_tokens": 95,
  "notes": "any special rendering notes"
}
```

---

# PART 3 — PROMPT TEMPLATE STRUCTURE

Every prompt follows this 7-part anatomy:

**[1] UNIVERSE ANCHOR** (constant for all 400 items — ensures visual consistency across the catalog)

"voidexa universe, science fiction, space combat aesthetic, cohesive sci-fi art direction"

**[2] SUBJECT** (from item's `art_prompt_hints`)

Injected verbatim.

**[3] CATEGORY STYLE BLOCK** (locked per category — see Part 4)

Example for `ship_skin`: "full starfighter 3/4 angle, centered composition, clean background, matte finish, panel line details"

**[4] RARITY QUALITY BLOCK** (locked per rarity — see Part 5)

Example for `common`: "clean simple design, minimal detailing, base material finish"
Example for `mythic`: "highly complex detailing, multi-layer shader, particle effects, volumetric glow, prismatic reflections"

**[5] LIGHTING + MOOD** (derived from category + rarity)

Example: "dramatic rim lighting, deep space backdrop, cool color temperature"

**[6] TECHNICAL SPECS** (locked per category)

"4K quality, sharp focus, professional product render, studio lighting"

**[7] NEGATIVE PROMPT** (locked global)

"text, watermark, logo, signature, blur, low quality, amateur, distorted, extra limbs, human figures, humans, faces"

---

# PART 4 — CATEGORY STYLE BLOCKS (locked per category)

| Category | Style block | Canvas |
|---|---|---|
| ship_skin | "full starfighter 3/4 angle, centered composition, clean dark gradient background, matte finish, detailed panel lines, hard surface modeling" | 1024x1024 |
| decal | "close-up hull surface detail, flat pattern on curved metal, isolated on neutral background, tileable texture feel" | 1024x1024 |
| trail | "motion blur effect, horizontal streak composition, particle trail, left-to-right motion direction, dark space backdrop" | 1024x512 |
| effect | "radial glow effect, hull-centered aura, semi-transparent layered particles, dramatic mood lighting" | 1024x1024 |
| cockpit | "first-person cockpit interior view, instrument panels visible, window to space foreground, immersive perspective" | 1024x768 |
| interior_decor | "small object on cockpit dashboard, studio product render, soft ambient lighting, clean background" | 512x512 |
| card_back | "square card-back design, decorative pattern, symmetrical composition, tarot-card-style borders, centered emblem" | 1024x1024 |
| card_frame | "ornate frame overlay, empty rectangular center, decorative corners, transparent background, trading card game frame" | 1024x1024 |
| battle_board | "wide battlefield vista, tactical top-down view, thematic environment (bridge, hangar, asteroid belt), atmospheric" | 1536x1024 |
| battle_music | "abstract album cover art, musical mood visualization, sci-fi aesthetic, sound waves or frequency patterns" | 1024x1024 |
| victory_screen | "triumphant moment, heroic composition, bright color scheme, celebratory particles and effects" | 1536x1024 |
| damage_numbers | "UI overlay style, transparent background, stylized numeric typography, color-coded mood" | 512x512 |
| targeting_reticle | "HUD crosshair design, transparent center, symmetrical, minimalist or ornate depending on tier, green/amber/red colorway" | 512x512 |
| title | "text typography design, stylized lettering, gradient or metallic treatment, no background" | 1024x256 |
| banner | "wide horizontal banner, hero composition, profile-card aesthetic, strong central focal point" | 1536x512 |
| nameplate | "small rectangular text plate design, metallic or glowing text style, decorative edges, transparent background" | 1024x256 |
| rank_badge | "circular or shield-shaped badge, military insignia aesthetic, centered symbol, detailed metalwork" | 512x512 |
| engine_sound | "sound wave visualization, abstract audio representation, frequency spectrum, dynamic motion" | 1024x512 |
| weapon_sfx | "energy burst visualization, impact pattern, radial composition, electric or plasma styling" | 1024x1024 |
| warp_sting | "warp tunnel entry effect, spiraling tunnel geometry, motion streaks, dimensional transition" | 1024x1024 |
| pilot_voice | "waveform portrait, abstract voice signature, headset or microphone silhouette, vocal character suggestion" | 1024x1024 |
| card_pack | "booster pack design, card deck stack, rarity color-coded, premium foil appearance, slight perspective tilt" | 1024x1024 |
| bundle | "collection showcase, multiple items arranged, product-shot lighting, cohesive theme" | 1536x1024 |
| warp_tunnel | "tunnel interior looking forward, high-speed motion, dimensional light streaks, immersive perspective" | 1024x1024 |
| scanner_pulse | "radial sonar pulse, ring expansion, top-down radar aesthetic, colored ripple waves" | 1024x1024 |
| last_words | "parchment or holo-scroll, flowing text, dim atmospheric lighting, dramatic mood" | 1024x512 |
| custom_nameplate | "engraved plate with mock text, hull-attached, realistic metal rendering" | 1024x256 |
| dashboard_lighting | "cockpit interior close-up, colored lighting effect, instrument panel glow" | 1024x768 |
| cockpit_radio | "audio equipment close-up, retro or futuristic radio design, dials and displays" | 1024x768 |
| bobblehead | "small figurine on cockpit dashboard, playful character design, miniature scale" | 512x512 |

---

# PART 5 — RARITY QUALITY BLOCKS (locked per rarity)

| Rarity | Quality block |
|---|---|
| common | "clean simple design, minimal detailing, base material finish, solid colors, understated aesthetic" |
| uncommon | "refined design with subtle details, mild accent colors, light surface effects, professional quality" |
| rare | "detailed craftsmanship, distinctive color palette, noticeable surface effects (subtle glow, patterns), premium finish" |
| epic | "elaborate detailing, multi-tone color palette, prominent visual effects, custom shader treatment, cinematic quality" |
| legendary | "ornate design with signature visual motifs, animated or dynamic feel, particle effects, volumetric lighting, heroic composition" |
| mythic | "masterwork-level complexity, unique shader effects, prismatic/holographic/animated surface, intense particle systems, transcendent aesthetic, unmistakably rare" |

---

# PART 6 — LIGHTING + MOOD MATRIX

Lighting derived from category × rarity combination. Base rules:

- Ship-related categories (ship_skin, decal, effect, trail, warp_tunnel, cockpit, dashboard_lighting): "dramatic rim lighting, deep space backdrop, cool blue-purple color grading"
- Card-related categories (card_back, card_frame, battle_board, battle_music, victory_screen, card_pack): "mystical rim light, rich saturated color palette, mythological mood"
- UI-related categories (damage_numbers, targeting_reticle, nameplate): "clean UI aesthetic, neon or holo lighting, minimalist contrast"
- Profile-related (title, banner, rank_badge, custom_nameplate): "dramatic hero lighting, vignette composition, formal portrait mood"
- Audio-related (engine_sound, weapon_sfx, warp_sting, pilot_voice, cockpit_radio): "abstract dynamic lighting, energy-reactive glow, motion-implying illumination"
- Bundle/collection: "warm product-shot studio lighting, soft shadows, showcase aesthetic"

Rarity modifier added on top:
- common/uncommon: "subtle lighting"
- rare: "emphasized dramatic lighting"
- epic: "strong directional cinematic lighting"
- legendary: "bold cinematic hero lighting with volumetric rays"
- mythic: "transcendent lighting, prismatic refractions, volumetric glow throughout"

---

# PART 7 — TECHNICAL SPEC BLOCK (locked)

Every prompt appends:
"8K upscale quality, sharp focus, professional product render, industry-standard 3D visualization, Octane render style, high dynamic range"

---

# PART 8 — NEGATIVE PROMPT (locked global, every prompt)

"text, watermark, logo, signature, blur, low quality, amateur, distorted, cluttered composition, extra limbs, human figures, humans, faces, realistic photography, stock photo aesthetic, AI fingerprints, noise, grain"

---

# PART 9 — STYLE ANCHOR AND SEED STRATEGY

**Style anchor:** `voidexa_universe_v1` (string appended to all prompts)

Ensures all 400 items share a coherent visual identity when Vast.ai renders them in batches.

**Seed strategy:**
- Each item gets a deterministic seed derived from its `id` (hash → int)
- Same item regenerated always gets same seed → reproducible results
- If a render is bad, changing the seed by +1 gives a variation without full re-prompt

---

# PART 10 — SPECIAL CASES

## 10A — Audio items without visual
pilot_voice, engine_sound, weapon_sfx, warp_sting, cockpit_radio — these are audio products but still need shop thumbnails. Art prompt generates the THUMBNAIL visualization, not actual audio.

## 10B — Bundles (composite items)
Bundles bundle multiple items. Prompt for bundle thumbnail shows "collection of items arranged together" rather than a single subject. Reference up to 3 flagship items from the bundle's theme.

## 10C — Titles (text-only)
Title items are pure text cosmetics. Their "art" is stylized typography. Prompt generates the title text as styled typography with transparent background.

## 10D — Custom-text items (custom_nameplate, last_words)
These accept user text at runtime. Their shop thumbnail shows a MOCK version with placeholder text like "[PILOT NAME]" or "[MESSAGE]".

---

# PART 11 — EXAMPLE FULL PROMPTS (10 reference)

## Example 1 — Common Ship Skin
Item: Crimson Fighter (common, T1)
Category: ship_skin
Art hints: "starfighter hull full paint, clean matte finish, deep crimson red with subtle panel shading, aggressive and confident"

Full prompt positive:
```
voidexa universe, science fiction, space combat aesthetic, cohesive sci-fi art direction, 
starfighter hull full paint, clean matte finish, deep crimson red with subtle panel shading, aggressive and confident, 
full starfighter 3/4 angle, centered composition, clean dark gradient background, matte finish, detailed panel lines, hard surface modeling, 
clean simple design, minimal detailing, base material finish, solid colors, understated aesthetic, 
dramatic rim lighting, deep space backdrop, cool blue-purple color grading, subtle lighting, 
8K upscale quality, sharp focus, professional product render, industry-standard 3D visualization, Octane render style, high dynamic range, 
voidexa_universe_v1
```

Canvas: 1024x1024

## Example 2 — Mythic Card Back
Item: Reality Bender Card Back (mythic, T3)
Category: card_back
Art hints: "prismatic holographic card-back pattern, reality-warping fractal mandala, iridescent color shift, cosmic mythology aesthetic"

Full prompt positive:
```
voidexa universe, science fiction, space combat aesthetic, cohesive sci-fi art direction, 
prismatic holographic card-back pattern, reality-warping fractal mandala, iridescent color shift, cosmic mythology aesthetic, 
square card-back design, decorative pattern, symmetrical composition, tarot-card-style borders, centered emblem, 
masterwork-level complexity, unique shader effects, prismatic/holographic/animated surface, intense particle systems, transcendent aesthetic, unmistakably rare, 
mystical rim light, rich saturated color palette, mythological mood, transcendent lighting, prismatic refractions, volumetric glow throughout, 
8K upscale quality, sharp focus, professional product render, industry-standard 3D visualization, Octane render style, high dynamic range, 
voidexa_universe_v1
```

Canvas: 1024x1024

## Example 3 — Epic Battle Board
Item: Crimson Nebula Foundry (epic, T3)
Category: battle_board
Art hints: "industrial forge station surrounded by red nebula, orbital ship factory, heavy machinery silhouettes, molten metal glow"

Full prompt positive:
```
voidexa universe, science fiction, space combat aesthetic, cohesive sci-fi art direction, 
industrial forge station surrounded by red nebula, orbital ship factory, heavy machinery silhouettes, molten metal glow, 
wide battlefield vista, tactical top-down view, thematic environment (bridge, hangar, asteroid belt), atmospheric, 
elaborate detailing, multi-tone color palette, prominent visual effects, custom shader treatment, cinematic quality, 
mystical rim light, rich saturated color palette, mythological mood, strong directional cinematic lighting, 
8K upscale quality, sharp focus, professional product render, industry-standard 3D visualization, Octane render style, high dynamic range, 
voidexa_universe_v1
```

Canvas: 1536x1024

Continues through 7 more examples covering: rare trail, legendary cockpit, common title, uncommon banner, epic engine sound thumb, legendary battle music album art, mythic bundle.

---

# PART 12 — CLAUDE CODE EXECUTION PROTOCOL

## Single execution, not batched

This is ONE run — not 10 batches. Input is 400 items, output is 400 prompts. Runs in one Claude Code session.

## Steps Claude Code performs:

1. Read `docs/shop_alpha/FINAL_SHOP_CATALOG.json`
2. For each item, construct prompt using Parts 3-10 rules
3. Save to `docs/shop_alpha/shop_art_prompts.json`
4. Generate spot-check sample: 20 random items with full rendered prompt text in `docs/shop_alpha/PROMPT_SAMPLE_20.md` for Jix to review before Vast.ai rendering
5. Commit on main branch: "feat(shop): generate 400 Vast.ai art prompts from final catalog"
6. Report totals + spot-check file path
7. STOP — await Jix approval before any Vast.ai activity

## Validation Claude Code runs:

- Every item in catalog has a matching prompt in output
- Every prompt has all 7 anatomy parts (universe, subject, category, rarity, lighting, technical, negative)
- No prompt exceeds 150 words (Vast.ai token limit safety)
- No duplicate prompts (possible if two items had identical hints — flag as warning)
- All canvas values match Part 4 category specs
- All seeds are unique per item

## Output file structure:

```
docs/shop_alpha/
  shop_art_prompts.json      (400 complete prompts)
  PROMPT_SAMPLE_20.md         (20 random samples for Jix review)
  VALIDATION_LOG_PROMPTS.md   (validation results)
```

---

# PART 13 — POST-PROMPT FLOW

1. Jix reviews `PROMPT_SAMPLE_20.md`
2. If samples look good → proceed to Vast.ai rendering (separate sprint)
3. If samples need adjustment → regenerate with rule tweaks
4. Vast.ai sprint uses prompts from `shop_art_prompts.json` to batch-render 400 PNGs
5. Rendered PNGs stored in Supabase Storage bucket
6. Shop UI reads from that bucket

---

# PART 14 — NON-NEGOTIABLE RULES

1. NEVER skip Parts 4-8 of the template — every prompt has all 7 anatomy sections
2. NEVER modify an item's `art_prompt_hints` — use verbatim as the SUBJECT part
3. NEVER invent new categories — only the 30 from Part 4
4. NEVER include human faces or figures in any prompt (negative prompt enforces)
5. NEVER push to main without spot-check sample file generated
6. If an item has ambiguous hints, STOP and ask Jix

---

**End of master document.**
