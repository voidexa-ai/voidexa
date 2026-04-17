"""
Card renderer v2 — composite card art inside pre-made frame PNGs.

The frame PNGs in assets/card-frames already carry all of the metallic
bevelling, circuit / panel / rivet detail and rarity glow baked in.
This script just:
  1. Loads the matching frame for each card's rarity
  2. Fits the card art into the frame's dark art window
  3. Paints clean panels over the frame's placeholder text
     (CARD NAME / 0 / TYPE / KEYWORD / 2 / 3)
  4. Draws the real card name, energy cost, ability text (with
     keyword definitions expanded inline), flavor, type/keyword
     and ATK/DEF numbers.

Usage:
  python scripts/render_cards_v2.py --test   # renders 4 sample cards
  python scripts/render_cards_v2.py          # renders all 257
  python scripts/render_cards_v2.py --only thermal_lance,void_echo
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Optional

from PIL import Image, ImageDraw, ImageFont

# --------------------------------------------------------------------- paths

REPO = Path(__file__).resolve().parent.parent
CARDS_DIR = REPO / "lib" / "game" / "cards"
ART_DIR = REPO / "output" / "card_art_unzipped" / "utput"
FONT_DIR = REPO / "output" / "fonts"
# v3 frames: HTML/CSS-rendered, empty text zones, no placeholder cleanup needed
FRAME_DIR = REPO / "assets" / "card-frames" / "v3"
OUT_DIR = REPO / "output" / "rendered_cards"

# --------------------------------------------------------------------- sizes

CARD_W, CARD_H = 750, 1050

# Rarity → frame file. Pioneer borrows the epic frame (purple tier).
RARITY_FRAME: dict[str, str] = {
    "common":    "common.png",
    "uncommon":  "uncommon.png",
    "rare":      "rare.png",
    "legendary": "legendary.png",
    "mythic":    "mythic.png",
    "pioneer":   "epic.png",
}

# ---------------------------------------------------------------- layout

# All coordinates below are in the final 750×1050 canvas. They were
# tuned against the common.png frame; all 1024×1536 frames share the
# same layout, rare.png (1060×1484) scales slightly but the bbox still
# matches after rescaling to 750×1050.
LAYOUT = {
    # positions match the v3 frame built by scripts/build_frames_v3.js
    "art_window":    (60, 184, 690, 666),    # inside art-frame's dark window
    # header zone — name sits on the dark frame top directly, cost is
    # the double-ring circle at top-right
    "name_anchor":   (304, 88),              # centred in x=42..566
    "name_max_w":    520,
    "cost_center":   (664, 88),              # centre of top-right cost ring
    # middle strip renders "TYPE · RARITY" centred
    "type_anchor":   (375, 702),             # centre of .type-bar
    # ability box expanded
    "ability_box":   (58, 750, 692, 928),
    # footer shows ATK / DEF centred — type has moved to the mid strip
    "stats_anchor":  (375, 982),
    "flavor_y_gap":  6,
}

# --------------------------------------------------------------- fonts

FONTS = {
    "name":     (FONT_DIR / "Orbitron-VF.ttf",       38),
    "cost":     (FONT_DIR / "Orbitron-VF.ttf",       54),
    "stats":    (FONT_DIR / "Orbitron-VF.ttf",       48),
    "type":     (FONT_DIR / "Rajdhani-SemiBold.ttf", 24),
    "ability":  (FONT_DIR / "Rajdhani-Regular.ttf",  32),
    "ability_bold": (FONT_DIR / "Rajdhani-SemiBold.ttf", 32),
    "flavor":   (FONT_DIR / "Rajdhani-Medium.ttf",   24),
    "header":   (FONT_DIR / "Orbitron-VF.ttf",       20),
}


def font(key: str) -> ImageFont.FreeTypeFont:
    path, size = FONTS[key]
    return ImageFont.truetype(str(path), size)


# -------------------------------------------------- keyword definitions

# Inline definition appended the first time a keyword appears in ability
# text. Applied case-insensitively, word-boundary aware. If the ability
# already contains a parenthesised clarifier right after the keyword we
# leave it alone so we don't double-annotate.
KEYWORD_DEFS: dict[str, str] = {
    "burn":        "(2 dmg/turn, 3 turns)",
    "jam":         "(target skips next turn)",
    "exposed":     "(takes +50% damage)",
    "expose":      "(target takes +50% damage)",
    "block":       "(absorbs damage before hull)",
    "lock":        "(target can't attack next turn)",
    "shielded":    "(halves next damage taken)",
    "overcharge":  "(stacking energy buff)",
    "drone mark":  "(next hit deals 2x)",
    "scrap":       "(upgrade resource)",
    "exhaust":     "(only once per match)",
    "siphon":      "(heal equal to damage dealt)",
}


def expand_keywords(text: str) -> str:
    if not text:
        return ""
    seen: set[str] = set()
    out = text

    # order matters — longer keys first so "drone mark" beats "mark"
    for kw in sorted(KEYWORD_DEFS.keys(), key=len, reverse=True):
        if kw in seen:
            continue
        pattern = re.compile(rf"\b({re.escape(kw)})\b", re.IGNORECASE)

        def sub(match: re.Match[str]) -> str:
            # skip if the next non-space chars are already '(…)'
            tail = out[match.end():].lstrip()
            if tail.startswith("("):
                return match.group(0)
            seen.add(kw)
            return f"{match.group(0)} {KEYWORD_DEFS[kw]}"

        new = pattern.sub(sub, out, count=1)
        if new != out:
            out = new
    return out


# -------------------------------------------------- card corpus

def load_all_cards() -> list[dict]:
    out: list[dict] = []
    for name in ("baseline.json", "expansion_set_1.json", "full_card_library.json"):
        with (CARDS_DIR / name).open(encoding="utf-8") as f:
            out.extend(json.load(f))
    return out


def art_for(card_id: str) -> Optional[Path]:
    p = ART_DIR / f"{card_id}.png"
    return p if p.exists() else None


def attack_defence(card: dict) -> tuple[str, str]:
    s = card.get("stats") or {}
    atk = s.get("damage") or 0
    dfn = s.get("block") or s.get("absorb") or 0
    if not atk and not dfn and s.get("heal"):
        # consumable-style → surface heal in the DEF slot
        dfn = s.get("heal")
    ctype = card.get("type", "")
    # Non-weapon cards with nothing numeric to surface get "— / —".
    # Weapons always display their 0 so the footer is consistent.
    if ctype != "weapon" and atk == 0 and dfn == 0:
        return ("—", "—")
    return (str(atk), str(dfn))


def type_keyword_label(card: dict) -> str:
    parts = [card.get("type", "").upper()]
    kws = card.get("keywords") or []
    if kws:
        parts.append(kws[0].replace("_", " ").upper())
    return " / ".join(parts)


# -------------------------------------------------- frame cache

_FRAME_CACHE: dict[str, Image.Image] = {}


def load_frame(rarity: str) -> Image.Image:
    fname = RARITY_FRAME.get(rarity, RARITY_FRAME["common"])
    if fname in _FRAME_CACHE:
        return _FRAME_CACHE[fname]
    src = Image.open(FRAME_DIR / fname).convert("RGB")
    scaled = src.resize((CARD_W, CARD_H), Image.LANCZOS)
    _FRAME_CACHE[fname] = scaled
    return scaled


_CUTOUT_CACHE: dict[str, Image.Image] = {}


def frame_with_art_cutout(rarity: str) -> Image.Image:
    """Returns an RGBA copy of the cleaned frame with the dark art
    window made transparent so the underlying art shows through."""
    fname = RARITY_FRAME.get(rarity, RARITY_FRAME["common"])
    if fname in _CUTOUT_CACHE:
        return _CUTOUT_CACHE[fname]
    src = load_frame(rarity).copy().convert("RGBA")
    x0, y0, x1, y1 = LAYOUT["art_window"]
    px = src.load()
    for y in range(y0, y1 + 1):
        for x in range(x0, x1 + 1):
            r, g, b, _ = px[x, y]
            if r + g + b < 90:
                px[x, y] = (0, 0, 0, 0)
    _CUTOUT_CACHE[fname] = src
    return src


# -------------------------------------------------- composition helpers

def fit_art_into_window(art: Image.Image, bbox: tuple[int, int, int, int]) -> Image.Image:
    x0, y0, x1, y1 = bbox
    w, h = x1 - x0 + 1, y1 - y0 + 1
    ratio = max(w / art.width, h / art.height)
    new_size = (int(art.width * ratio), int(art.height * ratio))
    scaled = art.resize(new_size, Image.LANCZOS)
    left = (scaled.width - w) // 2
    top = (scaled.height - h) // 2
    return scaled.crop((left, top, left + w, top + h))


def wrap(text: str, fnt: ImageFont.FreeTypeFont, max_w: int) -> list[str]:
    words = text.split()
    lines: list[str] = []
    cur: list[str] = []
    for w in words:
        trial = " ".join(cur + [w])
        if fnt.getlength(trial) <= max_w or not cur:
            cur.append(w)
        else:
            lines.append(" ".join(cur))
            cur = [w]
    if cur:
        lines.append(" ".join(cur))
    return lines


def erase_rect(canvas: Image.Image, box: tuple[int, int, int, int],
               sample_from: Optional[tuple[int, int]] = None,
               fallback: tuple[int, int, int] = (10, 10, 14)) -> None:
    """Paint a solid panel over a placeholder. Sample colour from the
    clean edge of the same panel so the fill blends in."""
    colour: tuple[int, int, int]
    if sample_from is not None:
        try:
            p = canvas.getpixel(sample_from)
            colour = (p[0], p[1], p[2])
        except Exception:
            colour = fallback
    else:
        colour = fallback
    ImageDraw.Draw(canvas).rectangle(box, fill=colour)


def _row_has_bright_text(im: Image.Image, y: int, x0: int, x1: int,
                         thresh: int = 130, hits: int = 20) -> bool:
    px = im.load()
    count = 0
    for x in range(x0, x1, 2):  # step 2 — plenty for detection
        r, g, b = px[x, y][:3]
        if (r + g + b) / 3 > thresh:
            count += 1
            if count >= hits:
                return True
    return False


def _find_clean_donor_y(frame: Image.Image, box: tuple[int, int, int, int],
                        search_radius: int = 140) -> Optional[int]:
    """Look above (then below) the placeholder box for a row-range that
    contains no bright placeholder text. Returns the y coordinate of
    the top of the donor strip (h = box height), or None."""
    x0, y0, x1, y1 = box
    height = y1 - y0 + 1
    # look upward first
    for top in range(y0 - 2, max(0, y0 - search_radius), -1):
        bottom = top - height + 1
        if bottom < 0:
            break
        rows_clean = all(
            not _row_has_bright_text(frame, y, x0, x1)
            for y in range(bottom, top + 1, 2)
        )
        if rows_clean:
            return bottom
    # then downward
    for bottom in range(y1 + 2, min(frame.height - height, y1 + search_radius)):
        top = bottom + height - 1
        if top >= frame.height:
            break
        rows_clean = all(
            not _row_has_bright_text(frame, y, x0, x1)
            for y in range(bottom, top + 1, 2)
        )
        if rows_clean:
            return bottom
    return None


def erase_with_donor(canvas: Image.Image, frame: Image.Image,
                     box: tuple[int, int, int, int],
                     fallback: tuple[int, int, int] = (10, 10, 14)) -> None:
    """Paste a clean strip copied from elsewhere on the frame over the
    placeholder. Preserves gradients and textures. Falls back to a
    solid fill if no clean donor row exists."""
    donor_y = _find_clean_donor_y(frame, box)
    x0, y0, x1, y1 = box
    height = y1 - y0 + 1
    if donor_y is None:
        ImageDraw.Draw(canvas).rectangle(box, fill=fallback)
        return
    donor = frame.crop((x0, donor_y, x1 + 1, donor_y + height))
    canvas.paste(donor, (x0, y0))


def erase_ellipse(canvas: Image.Image, box: tuple[int, int, int, int],
                  colour: tuple[int, int, int]) -> None:
    """Fill an ellipse — used for the cost circle so the surrounding
    metallic rim stays intact."""
    mask = Image.new("L", (box[2] - box[0], box[3] - box[1]), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, mask.width, mask.height), fill=255)
    patch = Image.new("RGB", (mask.width, mask.height), colour)
    canvas.paste(patch, (box[0], box[1]), mask)


# -------------------------------------------------- the render

def render_card(card: dict) -> Image.Image:
    rarity = card.get("rarity", "common")
    canvas = Image.new("RGB", (CARD_W, CARD_H), (6, 8, 16))

    # 1. art
    src_art = art_for(card["id"])
    if src_art:
        art_img = Image.open(src_art).convert("RGB")
    else:
        # simple procedural backdrop for the 26 baseline cards w/o art
        art_img = Image.new("RGB", (CARD_W, CARD_H), (18, 20, 32))
        d = ImageDraw.Draw(art_img)
        for i in range(0, CARD_H, 4):
            d.line([(0, i), (CARD_W, i)], fill=(24, 26, 40))
    art_fit = fit_art_into_window(art_img, LAYOUT["art_window"])
    canvas.paste(art_fit, (LAYOUT["art_window"][0], LAYOUT["art_window"][1]))

    # 2. cleaned frame with art window cut out — no paint-over needed
    frame = frame_with_art_cutout(rarity)
    canvas.paste(frame, (0, 0), frame)

    draw = ImageDraw.Draw(canvas)

    # 3. draw name (shrink-to-fit, centred on name anchor)
    max_name_w = LAYOUT["name_max_w"]
    size = 38
    name = card.get("name", "")
    name_font = ImageFont.truetype(str(FONTS["name"][0]), size)
    while name_font.getlength(name) > max_name_w and size > 20:
        size -= 2
        name_font = ImageFont.truetype(str(FONTS["name"][0]), size)
    bl, bt, br, bb = name_font.getbbox(name)
    nw = br - bl
    nh = bb - bt
    ncx, ncy = LAYOUT["name_anchor"]
    nx = ncx - nw / 2 - bl
    ny = ncy - nh / 2 - bt
    draw.text((nx + 3, ny + 3), name, font=name_font, fill=(0, 0, 0))
    draw.text((nx, ny), name, font=name_font, fill=(252, 252, 255))

    # 4. cost number (precisely centred in the cost circle)
    cost_font = font("cost")
    cost_str = str(card.get("cost", 0))
    # getbbox gives the tight glyph bounding box (left, top, right, bottom)
    # so we can centre on the *visible* pixels, not the font's baseline box.
    bl, bt, br, bb = cost_font.getbbox(cost_str)
    glyph_w = br - bl
    glyph_h = bb - bt
    cx, cy = LAYOUT["cost_center"]
    nx = cx - glyph_w / 2 - bl
    ny = cy - glyph_h / 2 - bt
    draw.text((nx + 2, ny + 2), cost_str, font=cost_font, fill=(0, 0, 0))
    draw.text((nx, ny), cost_str, font=cost_font, fill=(255, 255, 255))

    # 5. ability text inside ability_box (with keyword definitions inline)
    ab_box = LAYOUT["ability_box"]
    abx_w = ab_box[2] - ab_box[0] - 20
    ability_text = expand_keywords(card.get("abilityText", ""))
    ability_font = font("ability")
    ability_lines = wrap(ability_text, ability_font, abx_w)
    ability_line_h = int(ability_font.size * 1.2)

    flavor = card.get("flavor")
    flav_font = font("flavor") if flavor else None
    flav_line_h = int(flav_font.size * 1.22) if flav_font else 0
    flav_lines: list[str] = []
    if flavor:
        flav_lines = wrap(flavor, flav_font, abx_w)
        # cap to what fits
        while flav_lines and len(flav_lines) > 3:
            flav_lines.pop()

    # Compute full content height so we can vertically centre it in the
    # ability box. Height = ability lines + optional gap + separator +
    # flavor lines.
    content_h = ability_line_h * len(ability_lines)
    if flav_lines:
        content_h += LAYOUT["flavor_y_gap"] + 4  # separator + gap
        content_h += flav_line_h * len(flav_lines)

    box_h = ab_box[3] - ab_box[1]
    y = ab_box[1] + max(10, (box_h - content_h) // 2)

    for line in ability_lines:
        draw.text((ab_box[0] + 14, y + 1), line, font=ability_font, fill=(0, 0, 0))
        draw.text((ab_box[0] + 14, y), line, font=ability_font, fill=(240, 244, 255))
        y += ability_line_h

    if flav_lines:
        y += LAYOUT["flavor_y_gap"]
        draw.line([(ab_box[0] + 28, y - 4), (ab_box[2] - 28, y - 4)],
                  fill=(110, 115, 140), width=1)
        y += 2
        for line in flav_lines:
            draw.text((ab_box[0] + 14, y + 1), line, font=flav_font, fill=(0, 0, 0))
            draw.text((ab_box[0] + 14, y), line, font=flav_font,
                      fill=(218, 224, 242))
            y += flav_line_h

    # 6. TYPE · RARITY — centred in the gold middle strip
    tk_font = font("type")
    tk_text = f"{card.get('type', '').upper()}  ·  {card.get('rarity', '').upper()}"
    tw = tk_font.getlength(tk_text)
    tax, tay = LAYOUT["type_anchor"]
    nx = tax - tw / 2
    ny = tay - tk_font.size / 2 - 1
    draw.text((nx + 2, ny + 2), tk_text, font=tk_font, fill=(0, 0, 0))
    draw.text((nx, ny), tk_text, font=tk_font, fill=(248, 248, 255))

    # 7. ATK / DEF footer — centred (bbox-precise)
    atk, dfn = attack_defence(card)
    stat_str = f"{atk} / {dfn}"
    s_font = font("stats")
    bl, bt, br, bb = s_font.getbbox(stat_str)
    sw = br - bl
    sh = bb - bt
    scx, scy = LAYOUT["stats_anchor"]
    nx = scx - sw / 2 - bl
    ny = scy - sh / 2 - bt
    draw.text((nx + 2, ny + 2), stat_str, font=s_font, fill=(0, 0, 0))
    draw.text((nx, ny), stat_str, font=s_font, fill=(255, 245, 215))

    return canvas


# -------------------------------------------------- main

def parse_args() -> argparse.Namespace:
    ap = argparse.ArgumentParser()
    ap.add_argument("--test", action="store_true",
                    help="render 4 sample cards (Common / Rare / Legendary / Mythic)")
    ap.add_argument("--only", default="",
                    help="comma-separated card ids to render")
    ap.add_argument("--limit", type=int, default=0)
    return ap.parse_args()


TEST_CARDS = ["thermal_lance", "emp_nova", "stellar_annihilator", "void_echo", "strafe_burn"]


def main() -> int:
    args = parse_args()
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    all_cards = load_all_cards()
    by_id = {c["id"]: c for c in all_cards}

    if args.only:
        ids = [s.strip() for s in args.only.split(",") if s.strip()]
        subset = [by_id[i] for i in ids if i in by_id]
    elif args.test:
        subset = [by_id[i] for i in TEST_CARDS if i in by_id]
    else:
        subset = all_cards

    if args.limit:
        subset = subset[: args.limit]

    print(f"Rendering {len(subset)} cards into {OUT_DIR}")
    import time
    fail = 0
    t0 = time.time()
    for i, card in enumerate(subset, 1):
        ts = time.time()
        try:
            img = render_card(card)
            img.save(OUT_DIR / f"{card['id']}.png", "PNG", optimize=True)
            dt = time.time() - ts
            marker = "art" if art_for(card["id"]) else "placeholder"
            print(f"  [{i:3d}/{len(subset)}] {card['id']:32s} {card['rarity']:10s} {marker} {dt:.2f}s")
        except Exception as exc:  # noqa: BLE001
            fail += 1
            print(f"  [{i:3d}/{len(subset)}] {card['id']} FAILED: {exc}", file=sys.stderr)
    total = time.time() - t0
    print(f"Done. {len(subset) - fail} ok, {fail} failed, {total:.1f}s total"
          f" ({total / max(1, len(subset)):.2f}s/card)")
    return 1 if fail else 0


if __name__ == "__main__":
    raise SystemExit(main())
