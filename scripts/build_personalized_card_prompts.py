"""AFS-5 Task 1: personalized card art prompt builder.

Reads docs/alpha_set/batch_*.json and emits one Imagen 4 prompt per
card derived from that card's own data (type, name, effect_text,
keywords, subsystem_target, archetype, rarity) so every prompt shows
what the card DOES rather than generic stock sci-fi art.

Outputs: card_art_prompts_v2.json, CARD_PROMPT_SAMPLE_V2_30.md,
VALIDATION_LOG_CARD_PROMPTS_V2.md (all under docs/alpha_set/).
"""
from __future__ import annotations
import hashlib, json, pathlib, random, re
from collections import Counter

ROOT = pathlib.Path(__file__).resolve().parent.parent
BATCH_DIR = ROOT / "docs" / "alpha_set"
OUT_JSON = BATCH_DIR / "card_art_prompts_v2.json"
OUT_SAMPLE = BATCH_DIR / "CARD_PROMPT_SAMPLE_V2_30.md"
OUT_LOG = BATCH_DIR / "VALIDATION_LOG_CARD_PROMPTS_V2.md"

CANVAS = "2048x2048"

UNIVERSE_ANCHOR = (
    "voidexa trading card game illustration, premium sci-fi space combat art, "
    "cohesive TCG art direction, digital painting, concept art"
)

# Composition enforces 15% bottom safe-text padding for the Pillow
# compositor. Phrased as plain English so Imagen understands.
COMPOSITION = (
    "vertical card art composition, 2K resolution, subject centered in the "
    "upper 70 percent of the canvas, dark void margin reserved across the "
    "bottom 15 percent of the frame for card text overlay, clean silhouette "
    "against a single unified background"
)

NEGATIVE_PROMPT = (
    "humans, faces, people, hands, fingers, portraits, pilots, astronauts, "
    "crowds, eyes, mouths, "
    "text, letters, words, numbers, typography, watermark, signature, logo, "
    "card border, card frame, title bar, stat circle, keyword icons, UI element, "
    "blur, low quality, amateur, distorted, warped, stock photo, "
    "multiple disconnected subjects, cluttered background, noise, grain"
)

TYPE_SUBJECT = {
    "Weapon": (
        "ship-mounted weapon hardware, {name} installation, "
        "industrial mechanical detail, metal and energy materials"
    ),
    "Defense": (
        "defensive ship system detail, {name} armour or shield installation, "
        "structural emphasis, reinforced plating"
    ),
    "Drone": (
        "small autonomous attack craft, {name} silhouette at 3/4 angle, "
        "tactical profile, mechanical greebles"
    ),
    "AI Routine": (
        "holographic ship AI interface, {name} data visualisation, "
        "glowing data streams, abstract digital composition"
    ),
    "Module": (
        "hardware module component, {name} technical detail shot, "
        "product render style on gradient backdrop"
    ),
    "Maneuver": (
        "starship in dynamic motion, {name} flight trajectory, "
        "streaks and energy trails, cinematic angle"
    ),
    "Equipment": (
        "ship-attached equipment gear, {name} installed on a hardpoint, "
        "hardware close-up detail"
    ),
    "Field": (
        "persistent environmental battlefield zone, {name} area effect, "
        "wide atmospheric exposure, environmental zone visualisation"
    ),
    "Ship Core": (
        "reactor-core crest at the heart of a vessel, {name} heraldic "
        "centerpiece, symmetrical composition, trading card centerpiece"
    ),
}

# Type-specific lighting anchor (aligns with v1 but tightened).
TYPE_LIGHTING = {
    "Weapon": "ship-in-space lighting, thruster rim glow, starfield backdrop",
    "Defense": "ship-in-space lighting, thruster rim glow, starfield backdrop",
    "Drone": "ship-in-space lighting, thruster rim glow, starfield backdrop",
    "Maneuver": "ship-in-space lighting, thruster rim glow, starfield backdrop",
    "AI Routine": "cyan holographic interface glow, clean UI lighting, floating data",
    "Module": "clean product-render lighting, soft gradient backdrop",
    "Equipment": "gear close-up lighting, tight focus on attached piece",
    "Field": "zone-colored ambient lighting, wide atmospheric exposure",
    "Ship Core": "heraldic backlighting, centered radial highlight",
}

# Keyword → VFX instruction. Strongest signal for what the art shows.
KEYWORD_VISUALS = {
    # Weapons / firing patterns
    "priority_fire": "first-shot barrel flare, charged firing chamber",
    "alpha_strike": "twin synchronised discharge beams",
    "overclock": "over-amplified energy bloom, overcharged conduits",
    "overflow_fire": "excess energy spillover around the barrel",
    "critical_strike": "pinpoint impact flash, surgical hit",
    "breach_cascade": "chain impact spreading to adjacent enemy units",
    "linked_fire": "networked targeting mesh between weapon nodes",
    "flanking_fire": "side-angle attack vector, crossfire trail",
    "quick_strike": "fast-draw discharge motion",
    "manual_fire": "hand-keyed firing sequence sparks",
    # Targeting / sensors
    "countermeasure": "intercept burst of flare and chaff",
    "tracking_lock": "targeting reticle lock pattern",
    "tracking_array": "sensor sweep radar wave",
    "apply_lock": "target acquisition reticle locking on",
    "recon_beacon": "pulsing beacon signal ring",
    "probe": "sensor probe sweep arc",
    "deep_scan": "wide-area scanner bloom",
    "signal_jammer": "disruptive noise bloom",
    "signal_jamming": "static distortion field ripple",
    # Stealth / phase
    "gain_stealth": "partial shimmer transparency effect",
    "cloaked_entry": "ghosted fade-in silhouette",
    "phase_drive": "phase-shift translucency, reality ripple",
    "evade": "motion blur on an evasive curve",
    "skyward_maneuver": "upward spiralling trail",
    "phantom_echo": "ghost-image afterburner trail",
    # Deployment / drones
    "interceptor": "forward-facing guard pose, intercept posture",
    "rapid_launch": "rapid-deployment cradle opening",
    "hot_deploy": "emergency-launch rocket flare",
    "hot_activation": "reactor spinning up in a bloom",
    "deploy_burst": "deployment shockwave ring",
    "deferred_deployment": "standby posture with latent power glow",
    "outrider": "lead scout positioned at the point",
    "reactive": "triggered reactive-discharge posture",
    # Defense / durability
    "persistent_field": "ambient persistent aura filling the frame",
    "auto_repair": "nanite repair swarm across hull",
    "reinforced_hull": "thick armoured plating detail",
    "ablative_plating": "scorched layered armor with ablation streaks",
    "system_shielding": "layered inner shield shell, concentric rings",
    "battle_hardened": "weathered battle-scarred metallic surface",
    # Power / energy
    "emergency_reboot": "system reboot glyph, power cycling",
    "cold_boot": "slow cold startup glow",
    "reactor_vent": "thermal vent bloom",
    "power_surge": "surge of bright energy along conduits",
    "energy_surge": "rising energy wave",
    "cascading_power": "cascading lightning chain",
    "overcharge": "over-saturated over-driven energy glow",
    # Damage effects
    "radiation_leak": "green-yellow radiation plume venting",
    "emp_pulse": "electromagnetic shock ring",
    "disable": "system failure sparks, dead circuits",
    "critical_breach": "hull breach detonation",
    # Utility / economy
    "upgrade_trigger": "upgrade bloom VFX",
    "transform_overhaul": "mid-transform mechanical reconfiguration",
    "modular_payload": "segmented modular payload assembly",
    "scrap": "salvage debris cloud",
    "salvage_redirect": "debris being rerouted back to the player",
    "fuel_scavenge": "siphoning fuel conduit arc",
    "hull_drain": "hull-draining tether beam",
    "tractor_beam_hold": "tractor beam cone",
    "tactical_draw": "data-card drawn from the deck in a glow",
    "archive_recall": "archival retrieval beam",
    "cycling_protocol": "rotating cycle glyph",
    "efficiency_protocol": "optimised circuit glow",
    "adaptive_learning": "learning neural-net lattice",
    "ai_takeover": "AI overtaking a corrupted interface",
    "endgame_protocol": "final-sequence glyph",
    "mission_complete": "completed-objective glow",
    "assault_protocol": "attack-command highlight",
    "end_cycle": "turn-end pulse ring",
    "chain_catalyst": "chain-reaction catalyst bloom",
    "data_wipe": "data erasure static",
    "negate": "nullifier burst, counter-effect ring",
    "bounce": "ricochet vector trail",
    "sabotage_charge": "magnetic sabotage charge attached",
    "encryption_block": "encryption cipher wall",
    "hack_corrupt": "corruption glitch overlay",
    "system_corruption": "malware fault pattern",
    "system_reset": "full system reset beacon",
    "crew_pooling": "interlinked crew-energy web",
}

# Effect-text fallback scan (first match wins; only used when keywords empty).
EFFECT_PATTERNS = [
    (re.compile(r"\bburn\b", re.I), "persistent plasma burn trail"),
    (re.compile(r"\bheat\b", re.I), "thermal red-orange glow, venting heat"),
    (re.compile(r"\bcloak\b|\bstealth\b", re.I), "partial shimmer transparency"),
    (re.compile(r"\brepair\b|\brestore\b|\brevive\b", re.I),
        "nanite repair swarm, regeneration glow"),
    (re.compile(r"\bdestroy\b|\bdetonat", re.I),
        "catastrophic destruction explosion"),
    (re.compile(r"\bdraw\b", re.I),
        "energy converging toward command deck"),
    (re.compile(r"\bdeal \d+ damage\b", re.I),
        "directed damage beam impacting target"),
    (re.compile(r"\bhack\b|\bcorrupt\b", re.I),
        "hostile corruption glitch pattern"),
    (re.compile(r"\bemp\b|\bpulse\b", re.I),
        "electromagnetic shockwave ring"),
    (re.compile(r"\breveal\b|\bscan\b", re.I),
        "scanner revelation sweep"),
    (re.compile(r"\bwarp\b|\bphase\b|\bteleport\b", re.I),
        "reality-distorting phase ripple"),
    (re.compile(r"\bgain\b", re.I),
        "buff aura around subject"),
    (re.compile(r"\battach\b", re.I),
        "module being attached to host hardpoint"),
]

SUBSYSTEM_TARGET = {
    "hull": "impact landing on enemy hull plating",
    "shield": "enemy shield bubble fracturing at the impact point",
    "reactor": "enemy reactor-core meltdown bloom",
    "weapons": "enemy weapon mounts sparking and failing",
    "engines": "enemy engine nacelles flaming out",
    "life_support": "enemy life-support sector venting atmosphere",
}

TARGET_HINTS = [
    (re.compile(r"\bhull\b", re.I), "impact on enemy hull plating"),
    (re.compile(r"\bshield\b", re.I), "enemy shield fracture at impact"),
    (re.compile(r"\breactor\b", re.I), "enemy reactor venting"),
    (re.compile(r"\bengine", re.I), "enemy engine misfire plume"),
    (re.compile(r"\bweapon", re.I), "enemy weapon mount sparks"),
    (re.compile(r"\bdrone\b", re.I), "drone swarm in formation nearby"),
]

RARITY_MOOD = {
    "common": "clean readable illustration, clear composition, workmanlike craftsmanship",
    "uncommon": "refined illustration, secondary color accent, subtle atmospheric effect",
    "rare": "detailed illustration, rich color palette, noticeable lighting effects, premium craftsmanship",
    "epic": "elaborate detailed illustration, dramatic lighting, particle effects, cinematic treatment, purple-magenta color accents",
    "legendary": "masterwork illustration, dynamic composition, volumetric lighting, heroic presentation, golden god-rays",
    "mythic": "masterwork plus, multi-layer VFX, prismatic reality-bending quality, holographic rainbow shimmer, transcendent lighting",
}

ARCHETYPE_MOOD = {
    "aggro": "aggressive forward motion, warm red-orange accents, tension and speed",
    "control": "calculated precision, cool blue-white tones, commanding stance",
    "midrange": "balanced composition, neutral palette, tactical readiness",
    "combo": "intricate interconnected detail, chain-effect energy, layered composition",
    "ramp": "building energy, expanding growth motif, accumulating power",
    "utility": "precision instrument aesthetic, clean technical display, supportive role",
}

TECH_TAIL = (
    "8K quality, sharp focus, ArtStation quality, "
    "single centered subject, voidexa_tcg_v2"
)


def seed_for(card_id: str) -> int:
    """Deterministic 32-bit seed from card id."""
    digest = hashlib.sha256(card_id.encode("utf-8")).hexdigest()
    return int(digest[:8], 16)


def _display_name(card: dict) -> str:
    """Card name as a short lowercase phrase safe to inject inline."""
    # Strip possessives/special punctuation that trip token counters.
    return card["name"].replace("'", "").lower()


def infer_subject(card: dict) -> str:
    template = TYPE_SUBJECT[card["type"]]
    return template.format(name=_display_name(card))


def infer_action(card: dict) -> list[str]:
    """Up to three short VFX phrases describing what the card does visually."""
    phrases: list[str] = []

    # Keywords first (strongest signal).
    for kw in card.get("keywords") or []:
        v = KEYWORD_VISUALS.get(kw)
        if v and v not in phrases:
            phrases.append(v)

    # Effect-text scan as backup / enrichment when no keywords matched.
    if not phrases:
        et = card.get("effect_text") or ""
        for rx, v in EFFECT_PATTERNS:
            if rx.search(et):
                phrases.append(v)
                break

    # Type-default if still nothing.
    if not phrases:
        type_defaults = {
            "Weapon": "active firing discharge pose",
            "Defense": "defensive stance posture",
            "Drone": "in-flight attack run silhouette",
            "Module": "isolated technical showcase",
            "AI Routine": "ambient routine glow and data flux",
            "Maneuver": "executing a hard maneuver arc",
            "Equipment": "gear installed on hardpoint",
            "Field": "ambient persistent field diffusing outward",
            "Ship Core": "core pulsing with identity energy",
        }
        phrases.append(type_defaults[card["type"]])

    return phrases[:3]


def infer_target(card: dict) -> str:
    st = card.get("subsystem_target")
    if st in SUBSYSTEM_TARGET:
        return SUBSYSTEM_TARGET[st]
    et = card.get("effect_text") or ""
    for rx, hint in TARGET_HINTS:
        if rx.search(et):
            return hint
    return ""


def build_prompt(card: dict) -> dict:
    subject = infer_subject(card)
    action_parts = infer_action(card)
    target = infer_target(card)

    fragments: list[str] = [UNIVERSE_ANCHOR, subject]
    fragments.extend(action_parts)
    if target:
        fragments.append(target)
    fragments.append(ARCHETYPE_MOOD[card["archetype"]])
    fragments.append(RARITY_MOOD[card["rarity"]])
    fragments.append(TYPE_LIGHTING[card["type"]])
    fragments.append(COMPOSITION)
    fragments.append(TECH_TAIL)

    prompt = ", ".join(f for f in fragments if f)

    return {
        "id": card["id"],
        "name": card["name"],
        "type": card["type"],
        "rarity": card["rarity"],
        "archetype": card["archetype"],
        "subsystem_target": card.get("subsystem_target"),
        "keywords": card.get("keywords", []),
        "prompt": prompt,
        "negative_prompt": NEGATIVE_PROMPT,
        "seed": seed_for(card["id"]),
        "canvas": CANVAS,
    }


def load_cards() -> list[dict]:
    cards: list[dict] = []
    for f in sorted(BATCH_DIR.glob("batch_*.json")):
        if f.name.startswith("_"):
            continue
        cards.extend(json.loads(f.read_text(encoding="utf-8")))
    return cards


def write_sample(entries: list[dict], cards: list[dict]) -> None:
    by_id = {c["id"]: c for c in cards}
    by_rarity: dict[str, list[dict]] = {}
    for e in entries:
        by_rarity.setdefault(e["rarity"], []).append(e)
    order = ["common", "uncommon", "rare", "epic", "legendary", "mythic"]

    rng = random.Random(42)
    out: list[str] = [
        "# Card Prompt Sample V2 — 30 cards for Jix review",
        "",
        "Generated by `scripts/build_personalized_card_prompts.py`.",
        "Each prompt is derived from the specific card: type, name, "
        "effect_text, keywords, subsystem_target, archetype, rarity.",
        "",
        "Review these before running Imagen 4 for the full 1000 batch.",
        "",
    ]
    for r in order:
        pool = list(by_rarity.get(r, []))
        rng.shuffle(pool)
        # Prefer type diversity in the 5 picks per rarity.
        picks: list[dict] = []
        used_types: set[str] = set()
        for e in pool:
            if e["type"] not in used_types:
                picks.append(e)
                used_types.add(e["type"])
            if len(picks) == 5:
                break
        # Fill from remaining if fewer than 5 distinct types available.
        for e in pool:
            if len(picks) >= 5:
                break
            if e not in picks:
                picks.append(e)

        out.append(f"## {r.capitalize()}")
        out.append("")
        for e in picks:
            c = by_id[e["id"]]
            out.append(f"### {e['name']} — {e['type']} · {e['archetype']}")
            out.append("")
            out.append(f"- id: `{e['id']}`")
            out.append(f"- seed: `{e['seed']}`")
            out.append(f"- canvas: `{e['canvas']}`")
            out.append(f"- effect_text: `{c['effect_text']}`")
            kws = ", ".join(c.get("keywords") or []) or "-"
            out.append(f"- keywords: `{kws}`")
            out.append(f"- subsystem: `{c.get('subsystem_target') or '-'}`")
            out.append("")
            out.append("**Positive prompt:**")
            out.append("")
            out.append("```")
            out.append(e["prompt"])
            out.append("```")
            out.append("")
            out.append("**Negative prompt:**")
            out.append("")
            out.append("```")
            out.append(e["negative_prompt"])
            out.append("```")
            out.append("")

    OUT_SAMPLE.write_text("\n".join(out), encoding="utf-8")


def write_log(entries: list[dict]) -> None:
    total = len(entries)
    by_type = Counter(e["type"] for e in entries)
    by_rarity = Counter(e["rarity"] for e in entries)
    by_archetype = Counter(e["archetype"] for e in entries)
    prompt_lens = [len(e["prompt"]) for e in entries]
    uniq_seeds = len({e["seed"] for e in entries})
    uniq_prompts = len({e["prompt"] for e in entries})

    lines = [
        "# Card Art Prompts V2 — Validation Log",
        "",
        f"- total_entries: {total}",
        f"- unique_seeds: {uniq_seeds}",
        f"- unique_prompts: {uniq_prompts}",
        f"- canvas_all_2048: {all(e['canvas'] == CANVAS for e in entries)}",
        f"- prompt_len_chars min={min(prompt_lens)} max={max(prompt_lens)} "
        f"avg={sum(prompt_lens) // total}",
        "",
        "## Distributions",
        "",
        f"- by_type: {dict(sorted(by_type.items()))}",
        f"- by_rarity: {dict(sorted(by_rarity.items()))}",
        f"- by_archetype: {dict(sorted(by_archetype.items()))}",
        "",
    ]
    OUT_LOG.write_text("\n".join(lines), encoding="utf-8")


def main() -> None:
    cards = load_cards()
    if len(cards) != 1000:
        raise SystemExit(f"expected 1000 cards, got {len(cards)}")

    entries = [build_prompt(c) for c in cards]

    OUT_JSON.write_text(
        json.dumps(entries, indent=2, ensure_ascii=False),
        encoding="utf-8",
    )
    write_sample(entries, cards)
    write_log(entries)

    print(f"wrote {len(entries)} entries -> {OUT_JSON.relative_to(ROOT)}")
    print(f"sample          -> {OUT_SAMPLE.relative_to(ROOT)}")
    print(f"validation log  -> {OUT_LOG.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
