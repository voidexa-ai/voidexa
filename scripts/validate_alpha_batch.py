"""
scripts/validate_alpha_batch.py

Runs the 10 validation checks from Part 14 of docs/alpha_set_master.md on a
single batch JSON. Prints errors + warnings, writes an internal log to
docs/alpha_set/_batch_NN_validation.json.

Usage:
    python scripts/validate_alpha_batch.py 01
"""
from __future__ import annotations

import json
import re
import sys
from collections import Counter
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
ALPHA_DIR = REPO / "docs" / "alpha_set"

VALID_KEYWORDS = {
    # A - Combat (10)
    "priority_fire", "alpha_strike", "overflow_fire", "critical_strike",
    "assault_protocol", "battle_hardened", "rapid_launch", "flanking_fire",
    "quick_strike", "breach_cascade",
    # B - Defense (12)
    "interceptor", "system_shielding", "ablative_plating", "reinforced_hull",
    "cloaked_entry", "gain_stealth", "countermeasure", "auto_repair",
    "evade", "emergency_reboot", "signal_jammer", "tracking_array",
    # C - Life/Resource (7)
    "hull_drain", "recon_beacon", "overclock", "power_surge",
    "reactor_vent", "fuel_scavenge", "energy_surge",
    # D - Evasion (4)
    "skyward_maneuver", "phase_drive", "outrider", "emp_pulse",
    # E - Triggers/Timing (13)
    "deploy_burst", "critical_breach", "persistent_field", "end_cycle",
    "mission_complete", "manual_fire", "hot_activation", "reactive",
    "hot_deploy", "cold_boot", "chain_catalyst", "cascading_power",
    "linked_fire",
    # F - Draw/Deck (6)
    "probe", "deep_scan", "cycling_protocol", "tactical_draw",
    "archive_recall", "endgame_protocol",
    # G - Board (10)
    "apply_lock", "tracking_lock", "disable", "system_reset",
    "tractor_beam_hold", "negate", "hack_corrupt", "transform_overhaul",
    "bounce", "scrap",
    # H - Cost/Efficiency (8)
    "overcharge", "crew_pooling", "salvage_redirect", "upgrade_trigger",
    "modular_payload", "adaptive_learning", "efficiency_protocol",
    "deferred_deployment",
    # I - Disruption (8)
    "signal_jamming", "radiation_leak", "system_corruption", "ai_takeover",
    "encryption_block", "phantom_echo", "data_wipe", "sabotage_charge",
}

VALID_TYPES = {"Weapon", "Defense", "Drone", "AI Routine", "Module",
               "Maneuver", "Equipment", "Field", "Ship Core"}
VALID_RARITIES = {"common", "uncommon", "rare", "epic", "legendary", "mythic"}
VALID_ARCHETYPES = {"aggro", "control", "midrange", "combo", "ramp", "utility"}
VALID_SUBSYSTEMS = {None, "hull", "shield", "reactor", "weapons",
                    "engines", "life_support"}

# Rule 1 A+D bands per energy_cost: (min, max, absolute_max_without_drawback)
AD_BANDS = {
    0: (0, 3, 5), 1: (3, 6, 8), 2: (5, 10, 12), 3: (8, 14, 18),
    4: (12, 20, 24), 5: (16, 26, 30), 6: (20, 32, 36), 7: (24, 38, 42),
    8: (28, 50, 55), 9: (28, 50, 55), 10: (28, 50, 55),
}

# Part 7 cost curve target percentages (per 100 cards)
COST_TARGETS = {0: 5, 1: 17, 2: 20, 3: 20, 4: 15, 5: 10, 6: 7, 7: 4}

# Rule 8 archetype targets per 100 cards
ARCHETYPE_TARGETS = {
    "aggro": 20, "control": 20, "midrange": 25, "combo": 15,
    "ramp": 8, "utility": 12,
}

REQUIRED_FIELDS = [
    "id", "name", "type", "rarity", "energy_cost", "effect_text",
    "flavor_text", "keywords", "archetype",
]


def validate(batch_num: str, cards: list, prior_ids: set = None) -> tuple[list, list, dict]:
    """Return (errors, warnings, distributions)."""
    errors = []
    warnings = []
    prior_ids = prior_ids or set()

    # Check 1: required fields
    for c in cards:
        for f in REQUIRED_FIELDS:
            if f not in c:
                errors.append(f"{c.get('id','<no-id>')}: missing required field '{f}'")
            elif f == "keywords" and not isinstance(c.get(f), list):
                errors.append(f"{c.get('id')}: 'keywords' must be list")
            elif f not in ("keywords",) and (c.get(f) is None or c.get(f) == ""):
                errors.append(f"{c.get('id','<no-id>')}: empty '{f}'")

    # Check 2: unique ids + snake_case + not in prior batches
    ids = [c.get("id") for c in cards if c.get("id")]
    for cid in ids:
        if not re.fullmatch(r"[a-z0-9_]+", cid):
            errors.append(f"id not lowercase_snake_case: {cid}")
        if cid in prior_ids:
            errors.append(f"id collides with earlier batch: {cid}")
    dup = [k for k, v in Counter(ids).items() if v > 1]
    if dup:
        errors.append(f"duplicate ids in batch: {dup}")

    # Check 3: rarity distribution (batch 01 focus = all common)
    rarity_ct = Counter(c.get("rarity") for c in cards)
    for r in rarity_ct:
        if r not in VALID_RARITIES:
            errors.append(f"invalid rarity: {r}")
    if batch_num == "01" and set(rarity_ct.keys()) != {"common"}:
        warnings.append(
            f"batch 01 expected all common per plan; got {dict(rarity_ct)}"
        )

    # Check 4: type distribution
    type_ct = Counter(c.get("type") for c in cards)
    for t in type_ct:
        if t not in VALID_TYPES:
            errors.append(f"invalid type: {t}")
    if batch_num == "01":
        unexpected = set(type_ct.keys()) - {"Weapon", "Drone"}
        if unexpected:
            warnings.append(
                f"batch 01 focus is Weapons+Drones; unexpected types: {unexpected}"
            )

    # Check 5: cost curve per Part 7 (soft tolerance)
    cost_ct = Counter(c.get("energy_cost") for c in cards)
    for cost, target in COST_TARGETS.items():
        actual = cost_ct.get(cost, 0)
        if abs(actual - target) > max(7, target * 0.7):
            warnings.append(
                f"cost {cost}: {actual} cards vs target {target}"
            )

    # Check 6: 0-cost discipline
    for c in cards:
        if c.get("energy_cost") == 0:
            effect = (c.get("effect_text") or "").lower()
            kws = c.get("keywords") or []
            ok = ("reactive" in kws
                  or "only if" in effect
                  or "once per" in effect
                  or "lose" in effect
                  or "discard" in effect)
            if not ok:
                warnings.append(
                    f"{c.get('id')}: 0-cost card lacks reactive/conditional/"
                    f"tradeoff/single-use marker"
                )

    # Check 7: A+D bands (Rule 1)
    for c in cards:
        cost = c.get("energy_cost", 0)
        a = c.get("attack", 0) or 0
        d = c.get("defense", 0) or 0
        ad = a + d
        band = AD_BANDS.get(min(cost, 10))
        if not band:
            continue
        lo, hi, maxlegit = band
        if ad > maxlegit:
            drawback = (
                any(k in (c.get("keywords") or [])
                    for k in ["cold_boot", "scrap", "salvage_redirect"])
                or any(s in (c.get("effect_text") or "").lower()
                       for s in ["ship takes", "lose ", "self-damage",
                                 "permanently", "once per match"])
            )
            if not drawback:
                errors.append(
                    f"{c.get('id')}: A+D {ad} exceeds max_legit {maxlegit} "
                    f"at cost {cost} with no drawback"
                )
        elif ad < lo and cost > 0:
            warnings.append(
                f"{c.get('id')}: A+D {ad} below band {lo}-{hi} at cost {cost}"
            )

    # Check 8: keyword validity + rarity-complexity rules
    kw_usage = Counter()
    for c in cards:
        kws = c.get("keywords") or []
        for k in kws:
            kw_usage[k] += 1
            if k not in VALID_KEYWORDS:
                errors.append(f"{c.get('id')}: invalid keyword '{k}'")
        # Rule 2 — common cards: 1-2 keywords max
        if c.get("rarity") == "common" and len(kws) > 2:
            warnings.append(
                f"{c.get('id')}: common card has {len(kws)} keywords (rule: max 2)"
            )

    # Check 9: archetype tags present + distribution
    arch_ct = Counter(c.get("archetype") for c in cards)
    for a in arch_ct:
        if a not in VALID_ARCHETYPES:
            errors.append(f"invalid archetype: {a}")
    for a, target in ARCHETYPE_TARGETS.items():
        actual = arch_ct.get(a, 0)
        if abs(actual - target) > max(10, target * 0.75):
            warnings.append(
                f"archetype '{a}': {actual} vs target {target} (Rule 8)"
            )

    # Check 10: flavor text 8-15 words, unique
    flavors = []
    for c in cards:
        ft = c.get("flavor_text") or ""
        if not ft:
            errors.append(f"{c.get('id')}: missing flavor text")
            continue
        words = len(ft.split())
        if words < 8 or words > 15:
            warnings.append(
                f"{c.get('id')}: flavor has {words} words (target 8-15): '{ft}'"
            )
        flavors.append(ft)
    flavor_dups = [k for k, v in Counter(flavors).items() if v > 1]
    if flavor_dups:
        errors.append(f"duplicate flavor text(s): {flavor_dups}")

    # Extra: subsystem validity
    for c in cards:
        if c.get("subsystem_target") not in VALID_SUBSYSTEMS:
            errors.append(
                f"{c.get('id')}: invalid subsystem_target {c.get('subsystem_target')}"
            )

    distributions = {
        "card_count": len(cards),
        "rarity": dict(rarity_ct),
        "type": dict(type_ct),
        "cost": dict(sorted(cost_ct.items())),
        "archetype": dict(arch_ct),
        "keyword_usage": dict(sorted(kw_usage.items(), key=lambda x: -x[1])),
    }
    return errors, warnings, distributions


def main():
    if len(sys.argv) < 2:
        sys.exit("usage: validate_alpha_batch.py <batch_num>")
    batch_num = sys.argv[1].zfill(2)
    path = ALPHA_DIR / f"batch_{batch_num}.json"
    if not path.exists():
        sys.exit(f"missing {path}")

    # Gather ids from earlier batches (batch_01..batch_(N-1))
    prior_ids = set()
    for i in range(1, int(batch_num)):
        p = ALPHA_DIR / f"batch_{str(i).zfill(2)}.json"
        if p.exists():
            with open(p, encoding="utf-8") as fp:
                for c in json.load(fp):
                    if c.get("id"):
                        prior_ids.add(c["id"])

    with open(path, encoding="utf-8") as fp:
        cards = json.load(fp)

    errors, warnings, dists = validate(batch_num, cards, prior_ids)

    print(f"=== Batch {batch_num} validation ===")
    print(f"Cards: {dists['card_count']}")
    print(f"Rarity: {dists['rarity']}")
    print(f"Type: {dists['type']}")
    print(f"Cost: {dists['cost']}")
    print(f"Archetype: {dists['archetype']}")
    print(f"Keywords: {dists['keyword_usage']}")
    print()
    print(f"ERRORS ({len(errors)}):")
    for e in errors:
        print("  E:", e)
    print()
    print(f"WARNINGS ({len(warnings)}):")
    for w in warnings:
        print("  W:", w)

    # Save internal log
    out = {
        "batch": batch_num,
        "errors": errors,
        "warnings": warnings,
        "distributions": dists,
    }
    log_path = ALPHA_DIR / f"_batch_{batch_num}_validation.json"
    with open(log_path, "w", encoding="utf-8") as fp:
        json.dump(out, fp, indent=2)
    print(f"\nInternal log: {log_path.relative_to(REPO)}")


if __name__ == "__main__":
    main()
