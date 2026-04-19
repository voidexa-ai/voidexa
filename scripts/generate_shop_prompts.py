"""Generate 400 Vast.ai art prompts from FINAL_SHOP_CATALOG.json.

Implements the template rules in docs/shop_art_prompts_master.md (Parts 3-12).
One-shot run: prompts + 20-sample markdown + validation log.
"""
import json
import pathlib
import hashlib
import random
from collections import Counter

SRC = pathlib.Path('docs/shop_alpha/FINAL_SHOP_CATALOG.json')
OUT_JSON = pathlib.Path('docs/shop_alpha/shop_art_prompts.json')
OUT_SAMPLE = pathlib.Path('docs/shop_alpha/PROMPT_SAMPLE_20.md')
OUT_LOG = pathlib.Path('docs/shop_alpha/VALIDATION_LOG_PROMPTS.md')

catalog = json.loads(SRC.read_text(encoding='utf-8'))
items = catalog['items']
assert len(items) == 400, f'Expected 400 items, got {len(items)}'

UNIVERSE = "voidexa universe, science fiction, space combat aesthetic, cohesive sci-fi art direction"
TECHNICAL = "8K upscale quality, sharp focus, professional product render, industry-standard 3D visualization, Octane render style, high dynamic range"
STYLE_ANCHOR = "voidexa_universe_v1"
NEGATIVE = "text, watermark, logo, signature, blur, low quality, amateur, distorted, cluttered composition, extra limbs, human figures, humans, faces, realistic photography, stock photo aesthetic, AI fingerprints, noise, grain"

CATEGORY = {
    "ship_skin":          ("full starfighter 3/4 angle, centered composition, clean dark gradient background, matte finish, detailed panel lines, hard surface modeling", "1024x1024"),
    "decal":              ("close-up hull surface detail, flat pattern on curved metal, isolated on neutral background, tileable texture feel", "1024x1024"),
    "trail":              ("motion blur effect, horizontal streak composition, particle trail, left-to-right motion direction, dark space backdrop", "1024x512"),
    "effect":             ("radial glow effect, hull-centered aura, semi-transparent layered particles, dramatic mood lighting", "1024x1024"),
    "cockpit":            ("first-person cockpit interior view, instrument panels visible, window to space foreground, immersive perspective", "1024x768"),
    "interior_decor":     ("small object on cockpit dashboard, studio product render, soft ambient lighting, clean background", "512x512"),
    "card_back":          ("square card-back design, decorative pattern, symmetrical composition, tarot-card-style borders, centered emblem", "1024x1024"),
    "card_frame":         ("ornate frame overlay, empty rectangular center, decorative corners, transparent background, trading card game frame", "1024x1024"),
    "battle_board":       ("wide battlefield vista, tactical top-down view, thematic environment, atmospheric", "1536x1024"),
    "battle_music":       ("abstract album cover art, musical mood visualization, sci-fi aesthetic, sound waves or frequency patterns", "1024x1024"),
    "victory_screen":     ("triumphant moment, heroic composition, bright color scheme, celebratory particles and effects", "1536x1024"),
    "damage_numbers":     ("UI overlay style, transparent background, stylized numeric typography, color-coded mood", "512x512"),
    "targeting_reticle":  ("HUD crosshair design, transparent center, symmetrical, minimalist or ornate depending on tier, green amber red colorway", "512x512"),
    "title":              ("text typography design, stylized lettering, gradient or metallic treatment, no background", "1024x256"),
    "banner":             ("wide horizontal banner, hero composition, profile-card aesthetic, strong central focal point", "1536x512"),
    "nameplate":          ("small rectangular text plate design, metallic or glowing text style, decorative edges, transparent background", "1024x256"),
    "rank_badge":         ("circular or shield-shaped badge, military insignia aesthetic, centered symbol, detailed metalwork", "512x512"),
    "engine_sound":       ("sound wave visualization, abstract audio representation, frequency spectrum, dynamic motion", "1024x512"),
    "weapon_sfx":         ("energy burst visualization, impact pattern, radial composition, electric or plasma styling", "1024x1024"),
    "warp_sting":         ("warp tunnel entry effect, spiraling tunnel geometry, motion streaks, dimensional transition", "1024x1024"),
    "pilot_voice":        ("waveform portrait, abstract voice signature, headset or microphone silhouette, vocal character suggestion", "1024x1024"),
    "card_pack":          ("booster pack design, card deck stack, rarity color-coded, premium foil appearance, slight perspective tilt", "1024x1024"),
    "bundle":             ("collection showcase, multiple items arranged, product-shot lighting, cohesive theme", "1536x1024"),
    "warp_tunnel":        ("tunnel interior looking forward, high-speed motion, dimensional light streaks, immersive perspective", "1024x1024"),
    "scanner_pulse":      ("radial sonar pulse, ring expansion, top-down radar aesthetic, colored ripple waves", "1024x1024"),
    "last_words":         ("parchment or holo-scroll, flowing text, dim atmospheric lighting, dramatic mood", "1024x512"),
    "custom_nameplate":   ("engraved plate with mock text, hull-attached, realistic metal rendering", "1024x256"),
    "dashboard_lighting": ("cockpit interior close-up, colored lighting effect, instrument panel glow", "1024x768"),
    "cockpit_radio":      ("audio equipment close-up, retro or futuristic radio design, dials and displays", "1024x768"),
    "bobblehead":         ("small figurine on cockpit dashboard, playful character design, miniature scale", "512x512"),
}

RARITY = {
    "common":    "clean simple design, minimal detailing, base material finish, solid colors, understated aesthetic",
    "uncommon":  "refined design with subtle details, mild accent colors, light surface effects, professional quality",
    "rare":      "detailed craftsmanship, distinctive color palette, noticeable surface effects, premium finish",
    "epic":      "elaborate detailing, multi-tone color palette, prominent visual effects, custom shader treatment, cinematic quality",
    "legendary": "ornate design with signature visual motifs, animated or dynamic feel, particle effects, volumetric lighting, heroic composition",
    "mythic":    "masterwork-level complexity, unique shader effects, prismatic holographic animated surface, intense particle systems, transcendent aesthetic, unmistakably rare",
}

SHIP_CATS    = {"ship_skin","decal","effect","trail","warp_tunnel","cockpit","dashboard_lighting","interior_decor","scanner_pulse","bobblehead"}
CARD_CATS    = {"card_back","card_frame","battle_board","battle_music","victory_screen","card_pack"}
UI_CATS      = {"damage_numbers","targeting_reticle","nameplate"}
PROFILE_CATS = {"title","banner","rank_badge","custom_nameplate","last_words"}
AUDIO_CATS   = {"engine_sound","weapon_sfx","warp_sting","pilot_voice","cockpit_radio"}
BUNDLE_CATS  = {"bundle"}

def lighting_family(cat):
    if cat in SHIP_CATS:    return "dramatic rim lighting, deep space backdrop, cool blue-purple color grading"
    if cat in CARD_CATS:    return "mystical rim light, rich saturated color palette, mythological mood"
    if cat in UI_CATS:      return "clean UI aesthetic, neon or holo lighting, minimalist contrast"
    if cat in PROFILE_CATS: return "dramatic hero lighting, vignette composition, formal portrait mood"
    if cat in AUDIO_CATS:   return "abstract dynamic lighting, energy-reactive glow, motion-implying illumination"
    if cat in BUNDLE_CATS:  return "warm product-shot studio lighting, soft shadows, showcase aesthetic"
    return "dramatic rim lighting, deep space backdrop"

RARITY_LIGHT = {
    "common":    "subtle lighting",
    "uncommon":  "subtle lighting",
    "rare":      "emphasized dramatic lighting",
    "epic":      "strong directional cinematic lighting",
    "legendary": "bold cinematic hero lighting with volumetric rays",
    "mythic":    "transcendent lighting, prismatic refractions, volumetric glow throughout",
}

def seed_for(item_id):
    h = hashlib.sha256(item_id.encode("utf-8")).digest()
    return int.from_bytes(h[:4], "big") % 2_000_000_000

def build_prompt(item):
    cat = item['category']
    rar = item['rarity']
    cat_style, canvas = CATEGORY[cat]
    subject = item['art_prompt_hints'].rstrip('.,; ')
    rarity_quality = RARITY[rar]
    lighting = f"{lighting_family(cat)}, {RARITY_LIGHT[rar]}"
    positive = ",\n".join([
        UNIVERSE,
        subject,
        cat_style,
        rarity_quality,
        lighting,
        TECHNICAL,
        STYLE_ANCHOR,
    ])
    return positive, canvas

warnings = []
prompts = []
positive_seen = {}

for it in items:
    cat = it['category']
    if cat not in CATEGORY:
        warnings.append(f"UNKNOWN_CATEGORY: {it['id']} category={cat}")
        continue
    if it['rarity'] not in RARITY:
        warnings.append(f"UNKNOWN_RARITY: {it['id']} rarity={it['rarity']}")
        continue
    positive, canvas = build_prompt(it)
    word_count = len(positive.split())
    if word_count > 150:
        warnings.append(f"OVER_150_WORDS: {it['id']} words={word_count}")
    if positive in positive_seen:
        warnings.append(f"DUPLICATE_PROMPT: {it['id']} duplicates {positive_seen[positive]}")
    else:
        positive_seen[positive] = it['id']

    notes = []
    if cat in {"pilot_voice","engine_sound","weapon_sfx","warp_sting","cockpit_radio"}:
        notes.append("audio item — thumbnail visualization only, not actual audio")
    if cat == "bundle":
        notes.append("bundle composite — thumbnail shows arranged collection")
    if cat == "title":
        notes.append("text-only item — stylized typography, transparent background")
    if cat in {"custom_nameplate","last_words"}:
        notes.append("user-text runtime; thumbnail uses placeholder mock text")

    prompts.append({
        "item_id": it['id'],
        "item_name": it['name'],
        "category": cat,
        "rarity": it['rarity'],
        "tier": it['capability_tier'],
        "prompt_positive": positive,
        "prompt_negative": NEGATIVE,
        "canvas": canvas,
        "suggested_seed": seed_for(it['id']),
        "style_anchor": STYLE_ANCHOR,
        "estimated_tokens": int(word_count * 1.3),
        "notes": "; ".join(notes) if notes else "",
    })

assert len(prompts) == len(items), f"prompt count {len(prompts)} != item count {len(items)}"

seeds_seen = Counter(p['suggested_seed'] for p in prompts)
for s, c in seeds_seen.items():
    if c > 1:
        ids = [p['item_id'] for p in prompts if p['suggested_seed'] == s]
        warnings.append(f"DUPLICATE_SEED: {s} used by {ids}")

for p in prompts:
    pos = p['prompt_positive']
    required_anchors = [
        UNIVERSE,
        CATEGORY[p['category']][0],
        RARITY[p['rarity']],
        TECHNICAL,
        STYLE_ANCHOR,
    ]
    for a in required_anchors:
        if a not in pos:
            warnings.append(f"MISSING_ANCHOR: {p['item_id']} missing anchor snippet")

for p in prompts:
    expected = CATEGORY[p['category']][1]
    if p['canvas'] != expected:
        warnings.append(f"CANVAS_MISMATCH: {p['item_id']} canvas={p['canvas']} expected={expected}")

item_ids = {it['id'] for it in items}
prompt_ids = {p['item_id'] for p in prompts}
missing = item_ids - prompt_ids
extra = prompt_ids - item_ids
if missing: warnings.append(f"MISSING_PROMPTS: {missing}")
if extra:   warnings.append(f"EXTRA_PROMPTS: {extra}")

out = {
    "generated_at": "2026-04-19",
    "source_catalog": "docs/shop_alpha/FINAL_SHOP_CATALOG.json",
    "total_prompts": len(prompts),
    "style_anchor": STYLE_ANCHOR,
    "template_spec": "docs/shop_art_prompts_master.md",
    "negative_prompt_global": NEGATIVE,
    "prompts": prompts,
}
OUT_JSON.write_text(json.dumps(out, indent=2, ensure_ascii=False) + "\n", encoding='utf-8')

rng = random.Random(42)
sample = rng.sample(prompts, 20)
sample.sort(key=lambda p: (p['category'], p['rarity'], p['item_id']))

lines = [
    "# VOIDEXA SHOP — 20 RANDOM ART PROMPT SAMPLES",
    "",
    f"Drawn from `docs/shop_alpha/shop_art_prompts.json` ({len(prompts)} total prompts).",
    "Random seed: 42. Sorted by category, rarity, id for readability.",
    "",
    "Review these 20 before kicking off the Vast.ai batch render sprint. If the aesthetic",
    "is consistent and the prompts read cleanly, approve and proceed. If anything looks off",
    "(wrong category style, wrong lighting, subject not landing), flag and regenerate with",
    "rule tweaks.",
    "",
    "---",
    "",
]
for i, p in enumerate(sample, 1):
    lines.append(f"## {i}. {p['item_name']}")
    lines.append("")
    lines.append(f"`{p['item_id']}` · {p['category']} · {p['rarity']} · {p['tier']} · canvas **{p['canvas']}** · seed `{p['suggested_seed']}`")
    lines.append("")
    lines.append("**Positive prompt:**")
    lines.append("")
    lines.append("```")
    lines.append(p['prompt_positive'])
    lines.append("```")
    lines.append("")
    if p['notes']:
        lines.append(f"**Notes:** {p['notes']}")
        lines.append("")
    lines.append(f"**Estimated tokens:** {p['estimated_tokens']}")
    lines.append("")
    lines.append("---")
    lines.append("")

OUT_SAMPLE.write_text("\n".join(lines), encoding='utf-8')

log = [
    "# VOIDEXA SHOP ART PROMPTS — VALIDATION LOG",
    "",
    "Generated: 2026-04-19  ",
    "Source: `docs/shop_alpha/FINAL_SHOP_CATALOG.json` (400 items)  ",
    "Output: `docs/shop_alpha/shop_art_prompts.json` (400 prompts)  ",
    "Template spec: `docs/shop_art_prompts_master.md`",
    "",
    "## Part 12 validation checks",
    "",
    f"1. **Catalog coverage** — every catalog item has a prompt: {'PASS' if len(prompts)==400 and not missing and not extra else 'FAIL'} ({len(prompts)}/400)",
    f"2. **7-anatomy sections** — every prompt contains universe + category + rarity + technical + style-anchor anchors: {'PASS' if not any(w.startswith('MISSING_ANCHOR') for w in warnings) else 'FAIL'}",
    f"3. **Word cap** — no prompt exceeds 150 words: {'PASS' if not any(w.startswith('OVER_150_WORDS') for w in warnings) else 'FAIL'}",
    f"4. **Prompt uniqueness** — no two prompts identical: {'PASS' if not any(w.startswith('DUPLICATE_PROMPT') for w in warnings) else 'FAIL'}",
    f"5. **Canvas correctness** — every canvas matches Part 4 spec for its category: {'PASS' if not any(w.startswith('CANVAS_MISMATCH') for w in warnings) else 'FAIL'}",
    f"6. **Seed uniqueness** — every item has a unique deterministic seed: {'PASS' if not any(w.startswith('DUPLICATE_SEED') for w in warnings) else 'FAIL'}",
    "",
    f"**Total warnings: {len(warnings)}**",
    "",
]

if warnings:
    log.append("## Warnings")
    log.append("")
    for w in warnings:
        log.append(f"- {w}")
    log.append("")
else:
    log.append("## Warnings")
    log.append("")
    log.append("*None.*")
    log.append("")

cat_counts = Counter(p['category'] for p in prompts)
rarity_counts = Counter(p['rarity'] for p in prompts)
tier_counts = Counter(p['tier'] for p in prompts)
canvas_counts = Counter(p['canvas'] for p in prompts)
token_stats = [p['estimated_tokens'] for p in prompts]
word_stats = [len(p['prompt_positive'].split()) for p in prompts]

log.append("## Statistics")
log.append("")
log.append(f"- **Prompt count:** {len(prompts)}")
log.append(f"- **Words per prompt:** min={min(word_stats)}, max={max(word_stats)}, avg={sum(word_stats)//len(prompts)}")
log.append(f"- **Estimated tokens:** min={min(token_stats)}, max={max(token_stats)}, avg={sum(token_stats)//len(prompts)}")
log.append(f"- **Distinct categories covered:** {len(cat_counts)} / 30 in Part 4 table")
log.append(f"- **Distinct canvases used:** {sorted(canvas_counts.keys())}")
log.append("")
log.append("### Distribution by category")
log.append("")
log.append("| Category | Count |")
log.append("|---|---|")
for cat, n in sorted(cat_counts.items(), key=lambda x: -x[1]):
    log.append(f"| {cat} | {n} |")
log.append("")
log.append("### Distribution by rarity")
log.append("")
log.append("| Rarity | Count |")
log.append("|---|---|")
for r in ['common','uncommon','rare','epic','legendary','mythic']:
    log.append(f"| {r} | {rarity_counts.get(r,0)} |")
log.append("")
log.append("### Distribution by capability tier")
log.append("")
log.append("| Tier | Count |")
log.append("|---|---|")
for t in ['T1','T2','T3']:
    log.append(f"| {t} | {tier_counts.get(t,0)} |")
log.append("")
log.append("### Distribution by canvas")
log.append("")
log.append("| Canvas | Count |")
log.append("|---|---|")
for canvas, n in sorted(canvas_counts.items(), key=lambda x: -x[1]):
    log.append(f"| {canvas} | {n} |")
log.append("")
log.append("## Output files")
log.append("")
log.append(f"- `docs/shop_alpha/shop_art_prompts.json` — {OUT_JSON.stat().st_size:,} bytes")
log.append(f"- `docs/shop_alpha/PROMPT_SAMPLE_20.md` — 20 random samples for Jix review")
log.append(f"- `docs/shop_alpha/VALIDATION_LOG_PROMPTS.md` — this file")
log.append("")

OUT_LOG.write_text("\n".join(log), encoding='utf-8')

print(f"Prompts: {len(prompts)} / 400")
print(f"Warnings: {len(warnings)}")
print(f"Words per prompt — min:{min(word_stats)} max:{max(word_stats)} avg:{sum(word_stats)//len(prompts)}")
print(f"Est tokens     — min:{min(token_stats)} max:{max(token_stats)} avg:{sum(token_stats)//len(prompts)}")
print(f"Categories covered: {len(cat_counts)}")
print(f"Canvases used: {sorted(canvas_counts.keys())}")
print(f"Output sizes: json={OUT_JSON.stat().st_size:,}  sample={OUT_SAMPLE.stat().st_size:,}  log={OUT_LOG.stat().st_size:,}")
