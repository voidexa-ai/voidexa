"""Generate 1000 Vast.ai card art prompts from the alpha set.

Implements docs/VOIDEXA_CARD_ART_PROMPTS_MASTER.md Parts 3-15.

Inputs:
  docs/alpha_set/batch_01.json .. batch_10.json

Outputs:
  docs/alpha_set/card_art_prompts.json
  docs/alpha_set/CARD_PROMPT_SAMPLE_30.md
  docs/alpha_set/VALIDATION_LOG_CARD_PROMPTS.md

Run:
  python scripts/generate_card_prompts.py
"""

from __future__ import annotations

import hashlib
import json
import pathlib
import random
import re
from collections import Counter, defaultdict

ROOT = pathlib.Path(__file__).resolve().parent.parent
BATCH_DIR = ROOT / "docs" / "alpha_set"
OUT_JSON = BATCH_DIR / "card_art_prompts.json"
OUT_SAMPLE = BATCH_DIR / "CARD_PROMPT_SAMPLE_30.md"
OUT_LOG = BATCH_DIR / "VALIDATION_LOG_CARD_PROMPTS.md"

# ---------------------------------------------------------------------------
# Locked constants from master doc Parts 3, 6, 7, 8, 9, 10, 11
# ---------------------------------------------------------------------------

UNIVERSE_ANCHOR = (
    "voidexa trading card game, sci-fi space combat, "
    "cohesive card art direction, premium TCG illustration"
)

TYPE_STYLE = {
    "Weapon": "mechanical hardware close-up, industrial weapon detail, metal and energy materials, hard surface design",
    "Drone": "small spacecraft hero shot, 3/4 angle, tactical silhouette, mechanical greebles",
    "Defense": "defensive ship system detail, shield or armor focus, structural emphasis",
    "Maneuver": "dynamic motion scene, ship in action, streaks and trails, cinematic angle",
    "AI Routine": "holographic interface visualization, data-viz abstract composition, blue-cyan glow, digital aesthetic",
    "Module": "component hardware detail shot, product render style, isolated on gradient",
    "Equipment": "pilot gear still life, equipment detail, personal-scale object",
    "Field": "environmental zone visualization, area effect atmosphere, wide atmospheric shot",
    "Ship Core": "heraldic emblem design, centered symbolic crest, symmetrical composition, trading card art centerpiece",
}

RARITY_QUALITY = {
    "common": "clean simple illustration, solid color work, clear readable composition, workmanlike craftsmanship",
    "uncommon": "refined illustration with added detail, secondary color accents, subtle atmospheric effect",
    "rare": "detailed illustration, rich color palette, noticeable lighting effects, premium craftsmanship",
    "epic": "elaborate detailed illustration, dramatic lighting, particle effects, custom color treatment, cinematic",
    "legendary": "masterwork illustration, signature visual motifs, dynamic composition, volumetric lighting, heroic presentation",
    "mythic": "masterwork plus, complex multi-layer effects, dramatic particle systems, god-rays and volumetric light, reality-bending quality, unmistakably rare",
}

ARCHETYPE_MOOD = {
    "aggro": "aggressive stance, forward motion, warm red and orange accents, tension and speed",
    "control": "defensive stance, cool blue tones, static and protective composition, measured and commanding",
    "midrange": "balanced composition, neutral colors, versatile stance, tactical readiness",
    "combo": "intricate interconnected detail, multiple moving parts visible, complex layered composition",
    "ramp": "growth motif, expanding energy, building power visualization, accumulating resource",
    "utility": "precision instrument aesthetic, technical clarity, purposeful design, supportive role",
}

BASE_LIGHTING = "dramatic rim lighting, deep space backdrop, cool blue-purple color grading"

TYPE_LIGHTING = {
    "AI Routine": "digital holographic glow, cyan interface light, clean UI lighting",
    "Module": "digital holographic glow, cyan interface light, clean UI lighting",
    "Equipment": "digital holographic glow, cyan interface light, clean UI lighting",
    "Weapon": "ship-in-space lighting, thruster glow, starfield backdrop",
    "Drone": "ship-in-space lighting, thruster glow, starfield backdrop",
    "Defense": "ship-in-space lighting, thruster glow, starfield backdrop",
    "Maneuver": "ship-in-space lighting, thruster glow, starfield backdrop",
    "Field": "atmospheric environmental lighting, zone-colored ambient",
    "Ship Core": "heraldic backlighting, symbolic composition lighting, centered highlight",
}

RARITY_LIGHTING = {
    "common": "subtle lighting",
    "uncommon": "subtle lighting",
    "rare": "emphasized dramatic lighting",
    "epic": "strong directional cinematic lighting",
    "legendary": "bold cinematic hero lighting with volumetric rays",
    "mythic": "transcendent lighting, prismatic refractions, volumetric glow throughout",
}

TECHNICAL_SPEC = (
    "8K quality, sharp focus, trading card game illustration, "
    "digital painting style, professional concept art, ArtStation quality, single centered subject"
)

STYLE_ANCHOR = "voidexa_tcg_v1"

NEGATIVE_PROMPT = (
    "text, watermark, logo, signature, card border, card frame, title bar, "
    "stat numbers, visible keywords, UI elements, blur, low quality, amateur, "
    "distorted, extra limbs, human faces, realistic photography, stock photo aesthetic, "
    "AI fingerprints, noise, grain, multiple subjects, busy background, cluttered composition"
)

CANVAS = "768x1024"

# ---------------------------------------------------------------------------
# Part 4 — subject inference per card type
# ---------------------------------------------------------------------------


def _has(txt: str, words) -> bool:
    t = txt.lower()
    return any(w in t for w in words)


def subject_weapon(name: str, effect: str) -> str:
    base = f"{name.lower()}, ship-mounted weapon system"
    if _has(effect, ["critical", "pierce", "breach"]):
        return f"{base}, armor-piercing projectile, impact flash"
    if _has(effect, ["chain", "multi", "linked", "flank"]):
        return f"{base}, multi-barrel or linked firing pattern"
    if _has(effect, ["damage", "destroy", "kill"]):
        return f"{base}, active firing, energy discharge visible"
    return f"{base}, weapon hardware detail shot"


def subject_drone(name: str, effect: str) -> str:
    base = f"{name.lower()}, small autonomous spacecraft"
    if _has(effect, ["deploy", "launch", "summon"]):
        return f"{base}, mid-deployment, released from carrier"
    if _has(effect, ["shield", "protect", "escort", "guard"]):
        return f"{base}, escort formation, defensive posture"
    if _has(effect, ["attack", "strike", "damage", "destroy"]):
        return f"{base}, attack-run configuration, weapons hot"
    return f"{base}, tactical loiter pattern"


def subject_defense(name: str, effect: str) -> str:
    base = f"defensive ship system, {name.lower()}"
    if _has(effect, ["shield", "barrier", "bulwark"]):
        return f"{base}, active energy shield barrier, hexagonal pattern glow"
    if _has(effect, ["absorb", "block", "deflect", "negate"]):
        return f"{base}, energy absorption effect, impact deflection"
    if _has(effect, ["hull", "armor", "plating", "reinforce"]):
        return f"{base}, reinforced plating, structural armor detail"
    return f"{base}, protective system activation"


def subject_maneuver(name: str, effect: str) -> str:
    base = f"pilot cockpit action scene, {name.lower()} maneuver"
    if _has(effect, ["warp", "phase", "blink", "teleport"]):
        return f"{base}, spatial distortion, reality-bending effect"
    if _has(effect, ["boost", "speed", "thrust", "accelerate"]):
        return f"{base}, thrusters flaring, acceleration trails"
    if _has(effect, ["move", "dodge", "evade", "reposition"]):
        return f"{base}, ship mid-evasion, motion blur streaks"
    return f"{base}, high-speed ship trajectory, cinematic angle"


def subject_ai_routine(name: str, effect: str) -> str:
    base = f"ship AI interface, holographic data visualization, {name.lower()} routine"
    if _has(effect, ["scan", "detect", "probe", "reveal"]):
        return f"{base}, sonar pulse visualization, target-lock display"
    if _has(effect, ["draw", "cycle", "recall", "search"]):
        return f"{base}, data stream visualization, information flow"
    if _has(effect, ["persist", "field", "aura", "continuous"]):
        return f"{base}, ambient system glow, passive aura"
    return f"{base}, glowing interface schematics"


def subject_module(name: str, effect: str) -> str:
    base = f"modular ship component, {name.lower()}"
    if _has(effect, ["energy", "power", "reactor", "charge"]):
        return f"{base}, reactor-core detail, energy conduits"
    if _has(effect, ["boost", "upgrade", "enhance", "amplify"]):
        return f"{base}, active enhancement glow, power indicator"
    return f"{base}, hardware close-up"


def subject_equipment(name: str, effect: str) -> str:
    base = f"pilot equipment gear, {name.lower()}"
    if _has(effect, ["crew", "pilot", "captain"]):
        return f"{base}, pilot personal gear, human-scale item"
    return f"{base}, personal loadout item"


def subject_field(name: str, effect: str) -> str:
    base = f"persistent battlefield zone, {name.lower()}, area-of-effect visualization"
    if _has(effect, ["heal", "repair", "restore", "mend"]):
        return f"{base}, restorative aura, green-cyan glow"
    if _has(effect, ["slow", "lock", "hold", "freeze"]):
        return f"{base}, gravitational or temporal distortion field"
    if _has(effect, ["damage", "hurt", "radiation", "burn"]):
        return f"{base}, hostile energy zone, red-orange glow"
    return f"{base}, persistent ambient field"


def subject_ship_core(name: str, effect: str) -> str:
    clean = name.replace("Core:", "").replace("Ship Core", "").strip()
    return f"ship identity emblem, {clean.lower()} heraldic crest, centered symbolic composition"


SUBJECT_BUILDERS = {
    "Weapon": subject_weapon,
    "Drone": subject_drone,
    "Defense": subject_defense,
    "Maneuver": subject_maneuver,
    "AI Routine": subject_ai_routine,
    "Module": subject_module,
    "Equipment": subject_equipment,
    "Field": subject_field,
    "Ship Core": subject_ship_core,
}

# ---------------------------------------------------------------------------
# Part 12 — special case handling
# ---------------------------------------------------------------------------


def special_case_notes(card: dict) -> tuple[list[str], str | None, bool]:
    """Return (notes, overridden_archetype_mood_key, double_render_time).

    - dual_identity primary render + note
    - escalation: use ramp mood regardless of archetype
    - sacrifice (scrap keyword heuristic): split-light note
    - stacked-attack (Aim/Lock/Fire protocol or related keywords): Weapon style note
    - mythic: 2x render time
    - cargo true: cargo-hold note
    """
    notes: list[str] = []
    override = None
    double_time = False

    if card.get("dual_identity") or card.get("flip_to"):
        notes.append("dual_identity: render primary state only (flip handled in later sprint)")

    if card.get("escalation"):
        notes.append("escalation: ramp-mood override for growth visualization")
        override = "ramp"

    kws = card.get("keywords", []) or []
    effect_l = (card.get("effect_text") or "").lower()

    if "scrap" in kws or "sacrifice" in effect_l or "destroy this" in effect_l:
        notes.append("sacrifice: split-lighting cost-benefit framing")

    if any(k in kws for k in ("apply_lock", "tracking_lock")) and "counter" in effect_l:
        notes.append("stacked-attack: charge-up motion, targeting reticle lock")

    if card.get("cargo"):
        notes.append("cargo: hauling-class, include cargo-hold detail")

    if card.get("rarity") == "mythic":
        notes.append("mythic signature — use higher-quality render settings")
        double_time = True

    if not notes:
        notes.append("standard render")

    return notes, override, double_time


# ---------------------------------------------------------------------------
# Prompt assembly
# ---------------------------------------------------------------------------


def deterministic_seed(card_id: str) -> int:
    """SHA-256-derived int32 seed per Part 11."""
    h = hashlib.sha256(card_id.encode("utf-8")).hexdigest()
    return int(h[:8], 16)  # 0..4294967295, fits int32 unsigned


def build_subject(card: dict) -> str:
    builder = SUBJECT_BUILDERS.get(card["type"])
    if not builder:
        return f"{card['name'].lower()}, sci-fi card illustration"
    return builder(card["name"], card.get("effect_text", ""))


def build_prompt(card: dict) -> dict:
    notes_list, archetype_override, double_time = special_case_notes(card)

    archetype_key = archetype_override or card.get("archetype", "midrange")
    archetype_mood = ARCHETYPE_MOOD.get(archetype_key, ARCHETYPE_MOOD["midrange"])

    ctype = card["type"]
    rarity = card["rarity"]

    subject = build_subject(card)
    type_style = TYPE_STYLE[ctype]
    rarity_quality = RARITY_QUALITY[rarity]

    lighting = ", ".join([
        BASE_LIGHTING,
        TYPE_LIGHTING[ctype],
        RARITY_LIGHTING[rarity],
    ])

    # 8 anatomy sections joined in order, separated by a blank line marker
    sections = [
        UNIVERSE_ANCHOR,        # [1]
        subject,                # [2]
        type_style,             # [3]
        rarity_quality,         # [4]
        archetype_mood,         # [5]
        lighting,               # [6]
        TECHNICAL_SPEC,         # [7]
        STYLE_ANCHOR,           # [8]
    ]

    prompt_positive = ", ".join(sections)
    token_est = len(re.findall(r"\w+", prompt_positive))

    return {
        "card_id": card["id"],
        "card_name": card["name"],
        "type": ctype,
        "rarity": rarity,
        "archetype": card.get("archetype"),
        "keywords": card.get("keywords", []),
        "prompt_positive": prompt_positive,
        "prompt_negative": NEGATIVE_PROMPT,
        "canvas": CANVAS,
        "suggested_seed": deterministic_seed(card["id"]),
        "style_anchor": STYLE_ANCHOR,
        "estimated_tokens": token_est,
        "estimated_render_time": 2 if double_time else 1,
        "notes": "; ".join(notes_list),
        "anatomy_sections": len(sections),
    }


def load_all_cards() -> list[dict]:
    cards: list[dict] = []
    for fp in sorted(BATCH_DIR.glob("batch_*.json")):
        d = json.loads(fp.read_text(encoding="utf-8"))
        batch = d if isinstance(d, list) else d.get("cards") or d.get("items") or []
        for c in batch:
            c["_source"] = fp.name
            cards.append(c)
    return cards


# ---------------------------------------------------------------------------
# Part 15 validation
# ---------------------------------------------------------------------------


def validate(prompts: list[dict], cards: list[dict]) -> dict:
    errors: list[str] = []
    warnings: list[str] = []

    # Check 1: 1:1 card → prompt by id
    card_ids = {c["id"] for c in cards}
    prompt_ids = {p["card_id"] for p in prompts}
    missing = card_ids - prompt_ids
    extra = prompt_ids - card_ids
    if missing:
        errors.append(f"{len(missing)} cards missing prompts, e.g. {list(missing)[:5]}")
    if extra:
        errors.append(f"{len(extra)} prompts have no matching card")
    if len(prompts) != len(cards):
        errors.append(f"count mismatch: {len(prompts)} prompts vs {len(cards)} cards")

    # Check 2: 8 anatomy sections per prompt
    bad_sections = [p["card_id"] for p in prompts if p.get("anatomy_sections") != 8]
    if bad_sections:
        errors.append(f"{len(bad_sections)} prompts missing 8 anatomy sections, e.g. {bad_sections[:5]}")

    # Check 3: 150-word cap
    over_150 = [(p["card_id"], p["estimated_tokens"]) for p in prompts if p["estimated_tokens"] > 150]
    if over_150:
        errors.append(f"{len(over_150)} prompts exceed 150 words, e.g. {over_150[:3]}")

    # Check 4: duplicate prompt_positive → warning
    pos_counts = Counter(p["prompt_positive"] for p in prompts)
    dup_positive = {t: c for t, c in pos_counts.items() if c > 1}
    if dup_positive:
        warnings.append(f"{sum(dup_positive.values())} prompts share text with another card ({len(dup_positive)} groups)")

    # Check 5: all canvas = 768x1024
    wrong_canvas = [p["card_id"] for p in prompts if p["canvas"] != CANVAS]
    if wrong_canvas:
        errors.append(f"{len(wrong_canvas)} prompts have wrong canvas")

    # Check 6: seeds unique
    seed_counts = Counter(p["suggested_seed"] for p in prompts)
    dup_seeds = [s for s, c in seed_counts.items() if c > 1]
    if dup_seeds:
        errors.append(f"{len(dup_seeds)} duplicate seeds — hash collision")

    # Check 7: subject inference non-trivial (heuristic: positive contains the card name lowercased OR is a ship-core emblem)
    empty_subject = []
    for p in prompts:
        # Positive must at least contain either the id root or the name lowercased somewhere
        name_l = p["card_name"].lower()
        if name_l not in p["prompt_positive"] and "heraldic crest" not in p["prompt_positive"]:
            empty_subject.append(p["card_id"])
    if empty_subject:
        warnings.append(f"{len(empty_subject)} prompts may lack name-derived subject")

    # Check 8: special cases tagged in notes
    card_by_id = {c["id"]: c for c in cards}
    miss_tag = []
    for p in prompts:
        c = card_by_id.get(p["card_id"], {})
        need = []
        if c.get("dual_identity") or c.get("flip_to"):
            need.append("dual_identity")
        if c.get("escalation"):
            need.append("escalation")
        if c.get("cargo"):
            need.append("cargo")
        if c.get("rarity") == "mythic":
            need.append("mythic")
        for n in need:
            if n not in p["notes"]:
                miss_tag.append((p["card_id"], n))
    if miss_tag:
        errors.append(f"{len(miss_tag)} special cases missing notes, e.g. {miss_tag[:3]}")

    return {"errors": errors, "warnings": warnings}


# ---------------------------------------------------------------------------
# Sample file
# ---------------------------------------------------------------------------


def pick_sample(prompts: list[dict], n: int = 30) -> list[dict]:
    """30 stratified-random samples: up to 5 per rarity, best-effort type diversity."""
    rng = random.Random(20260419)
    by_rarity: dict[str, list[dict]] = defaultdict(list)
    for p in prompts:
        by_rarity[p["rarity"]].append(p)

    rarities = ["common", "uncommon", "rare", "epic", "legendary", "mythic"]
    per = max(1, n // len(rarities))  # 5
    selected: list[dict] = []
    seen_types: set[str] = set()
    for r in rarities:
        pool = by_rarity.get(r, [])[:]
        rng.shuffle(pool)
        # prefer unseen types first
        picked_here = []
        for p in pool:
            if len(picked_here) >= per:
                break
            if p["type"] not in seen_types:
                picked_here.append(p)
                seen_types.add(p["type"])
        if len(picked_here) < per:
            for p in pool:
                if p in picked_here:
                    continue
                picked_here.append(p)
                if len(picked_here) >= per:
                    break
        selected.extend(picked_here)

    selected = selected[:n]
    # pad if short
    if len(selected) < n:
        leftover = [p for p in prompts if p not in selected]
        rng.shuffle(leftover)
        selected.extend(leftover[: n - len(selected)])
    return selected


def render_sample_md(sample: list[dict]) -> str:
    out: list[str] = []
    out.append("# Card Prompt Sample — 30 cards for Jix review")
    out.append("")
    out.append(
        "Generated by `scripts/generate_card_prompts.py`. Stratified: 5 per rarity × 6 rarities, "
        "best-effort coverage across all 9 card types."
    )
    out.append("")
    out.append("Review these 30 prompts before approving any Vast.ai render.")
    out.append("")
    rarities = ["common", "uncommon", "rare", "epic", "legendary", "mythic"]
    by_r: dict[str, list[dict]] = defaultdict(list)
    for p in sample:
        by_r[p["rarity"]].append(p)
    for r in rarities:
        items = by_r.get(r, [])
        if not items:
            continue
        out.append(f"## {r.title()}")
        out.append("")
        for p in items:
            out.append(f"### {p['card_name']} — {p['type']} · {p['archetype']}")
            out.append("")
            out.append(f"- card_id: `{p['card_id']}`")
            out.append(f"- seed: `{p['suggested_seed']}`")
            out.append(f"- canvas: {p['canvas']}")
            out.append(f"- tokens: {p['estimated_tokens']}")
            out.append(f"- render_time: {p['estimated_render_time']}x")
            out.append(f"- notes: {p['notes']}")
            out.append("")
            out.append("**Positive prompt:**")
            out.append("")
            out.append("```")
            out.append(p["prompt_positive"])
            out.append("```")
            out.append("")
            out.append("**Negative prompt:**")
            out.append("")
            out.append("```")
            out.append(p["prompt_negative"])
            out.append("```")
            out.append("")
    return "\n".join(out) + "\n"


def render_validation_log(cards: list[dict], prompts: list[dict], report: dict) -> str:
    total_render_units = sum(p["estimated_render_time"] for p in prompts)
    by_type = Counter(p["type"] for p in prompts)
    by_rarity = Counter(p["rarity"] for p in prompts)
    by_archetype = Counter(p["archetype"] for p in prompts)
    avg_tokens = round(sum(p["estimated_tokens"] for p in prompts) / max(1, len(prompts)), 1)
    min_tokens = min(p["estimated_tokens"] for p in prompts)
    max_tokens = max(p["estimated_tokens"] for p in prompts)

    lines: list[str] = []
    lines.append("# VALIDATION LOG — Card Art Prompts")
    lines.append("")
    lines.append(f"Cards loaded: {len(cards)}")
    lines.append(f"Prompts generated: {len(prompts)}")
    lines.append("")
    lines.append("## Distribution")
    lines.append("")
    lines.append("**By type:**")
    for t, c in sorted(by_type.items()):
        lines.append(f"- {t}: {c}")
    lines.append("")
    lines.append("**By rarity:**")
    for r, c in sorted(by_rarity.items()):
        lines.append(f"- {r}: {c}")
    lines.append("")
    lines.append("**By archetype:**")
    for a, c in sorted(by_archetype.items()):
        lines.append(f"- {a}: {c}")
    lines.append("")
    lines.append("## Prompt length")
    lines.append(f"- avg tokens: {avg_tokens}")
    lines.append(f"- min tokens: {min_tokens}")
    lines.append(f"- max tokens: {max_tokens}")
    lines.append(f"- 150-word cap: {'PASS' if max_tokens <= 150 else 'FAIL'}")
    lines.append("")
    lines.append("## Render budget")
    lines.append(f"- total render units (1x + mythics 2x): {total_render_units}")
    lines.append(f"- mythics flagged for 2x: {by_rarity.get('mythic', 0)}")
    lines.append("")
    lines.append("## Part 15 checks")
    lines.append("")
    if not report["errors"]:
        lines.append("- ERRORS: 0 ✓")
    else:
        lines.append(f"- ERRORS: {len(report['errors'])}")
        for e in report["errors"]:
            lines.append(f"  - {e}")
    if not report["warnings"]:
        lines.append("- WARNINGS: 0")
    else:
        lines.append(f"- WARNINGS: {len(report['warnings'])}")
        for w in report["warnings"]:
            lines.append(f"  - {w}")
    lines.append("")
    lines.append("## Check key")
    lines.append("1. card → prompt 1:1 mapping (by id)")
    lines.append("2. all 8 anatomy sections present per prompt")
    lines.append("3. no prompt exceeds 150 words")
    lines.append("4. duplicate positive-text detection (warning only)")
    lines.append("5. canvas = 768x1024 on every prompt")
    lines.append("6. deterministic seeds unique across set")
    lines.append("7. subject inference non-trivial (name or heraldic-crest present)")
    lines.append("8. special cases (dual_identity / escalation / cargo / mythic) tagged in notes")
    lines.append("")
    return "\n".join(lines) + "\n"


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------


def main() -> int:
    cards = load_all_cards()
    if len(cards) != 1000:
        print(f"WARN: expected 1000 cards, got {len(cards)}")

    prompts = [build_prompt(c) for c in cards]

    # Write prompts JSON
    OUT_JSON.write_text(json.dumps(prompts, indent=2, ensure_ascii=False), encoding="utf-8")

    # Validate
    report = validate(prompts, cards)

    # Sample MD
    sample = pick_sample(prompts, 30)
    OUT_SAMPLE.write_text(render_sample_md(sample), encoding="utf-8")

    # Validation log
    OUT_LOG.write_text(render_validation_log(cards, prompts, report), encoding="utf-8")

    # Console summary
    print(f"Cards: {len(cards)} -> Prompts: {len(prompts)}")
    print(f"Errors: {len(report['errors'])}  Warnings: {len(report['warnings'])}")
    for e in report["errors"]:
        print(f"  ERR: {e}")
    for w in report["warnings"]:
        print(f"  WARN: {w}")
    print(f"Wrote:\n  {OUT_JSON}\n  {OUT_SAMPLE}\n  {OUT_LOG}")
    return 0 if not report["errors"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
