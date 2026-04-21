"""
Card renderer for voidexa — composites card art + rarity frame + text metadata
into a final 750x1050 PNG suitable for print or in-game display.

Usage:
    python scripts/render_cards.py --test           # render 5 sample cards
    python scripts/render_cards.py                  # render all 257 cards
    python scripts/render_cards.py --only pulse_tap,rail_spike

Output: output/rendered_cards/<card_id>.png
Input:  lib/game/cards/{baseline,expansion_set_1,full_card_library}.json
        output/card_art_unzipped/utput/<card_id>.png  (241 unique art files)
        output/fonts/{Orbitron-VF,Rajdhani-Regular,Rajdhani-SemiBold}.ttf
Placeholder: the 26 baseline cards lack art — synth a gradient backdrop.
"""

from __future__ import annotations

import argparse
import json
import math
import os
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Optional

from PIL import Image, ImageDraw, ImageFilter, ImageFont

# --- paths ----------------------------------------------------------------

REPO = Path(__file__).resolve().parent.parent
CARDS_DIR = REPO / "lib" / "game" / "cards"
ART_DIR = REPO / "output" / "card_art_unzipped" / "utput"
FONT_DIR = REPO / "output" / "fonts"
OUT_DIR = REPO / "output" / "rendered_cards"

# --- card + frame dimensions ---------------------------------------------

CARD_W, CARD_H = 750, 1050

FRAME_OUTER_PAD = 14      # space from edge to outer glow border
FRAME_INNER_PAD = 10      # inner border offset from outer

NAME_BAR_Y = 24
NAME_BAR_H = 74

COST_BADGE_CX = 78
COST_BADGE_CY = NAME_BAR_Y + NAME_BAR_H // 2
COST_BADGE_R = 44

ART_X = 44
ART_Y = 118
ART_W = 662
ART_H = 560

TYPE_BAR_Y = ART_Y + ART_H + 12
TYPE_BAR_H = 44

ABILITY_BOX_Y = TYPE_BAR_Y + TYPE_BAR_H + 12
ABILITY_BOX_H = 200

FOOTER_Y = CARD_H - 84
FOOTER_H = 60

# --- rarity palette (6 tiers) --------------------------------------------

RARITY_COLOURS: dict[str, dict] = {
    "common":    {"main": (196, 199, 208), "glow": (120, 125, 140), "name": "COMMON"},
    "uncommon":  {"main": ( 67, 211, 140), "glow": ( 20, 140,  85), "name": "UNCOMMON"},
    "rare":      {"main": ( 79, 195, 247), "glow": ( 10, 120, 200), "name": "RARE"},
    "legendary": {"main": (255, 179,  71), "glow": (200, 120,  20), "name": "LEGENDARY"},
    "mythic":    {"main": (255,  77, 126), "glow": (200,  10,  70), "name": "MYTHIC"},
    "pioneer":   {"main": (175,  82, 222), "glow": (110,  30, 160), "name": "PIONEER"},
}

# --- type palette (small coloured badge in type bar) ---------------------

TYPE_COLOURS: dict[str, tuple[int, int, int]] = {
    "weapon":     (255,  90,  90),
    "defense":    ( 90, 170, 255),
    "maneuver":   (130, 240, 170),
    "drone":      (  0, 212, 255),
    "ai":         (175,  82, 222),
    "consumable": (255, 214,  80),
}

BG_TOP = (8, 10, 22)
BG_BOTTOM = (2, 3, 12)

# --- fonts ---------------------------------------------------------------

FONT_NAME = FONT_DIR / "Orbitron-VF.ttf"         # card name + rarity label
FONT_COST = FONT_DIR / "Orbitron-VF.ttf"         # energy cost digit
FONT_STATS = FONT_DIR / "Orbitron-VF.ttf"        # ATK / DEF numerics
FONT_TYPE = FONT_DIR / "Rajdhani-SemiBold.ttf"   # type + keywords
FONT_ABILITY = FONT_DIR / "Rajdhani-Regular.ttf" # ability text
FONT_FLAVOR = FONT_DIR / "Rajdhani-Medium.ttf"   # flavour italics (use medium, no italics avail)


def load_font(path: Path, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(path), size)


# --- card corpus ---------------------------------------------------------

def load_all_cards() -> list[dict]:
    out: list[dict] = []
    for fname in ("baseline.json", "expansion_set_1.json", "full_card_library.json"):
        with (CARDS_DIR / fname).open(encoding="utf-8") as f:
            out.extend(json.load(f))
    return out


def art_path_for(card_id: str) -> Optional[Path]:
    p = ART_DIR / f"{card_id}.png"
    return p if p.exists() else None


# --- drawing primitives --------------------------------------------------

def make_background_placeholder(w: int, h: int, seed: int, accent: tuple[int, int, int]) -> Image.Image:
    """Procedural backdrop for cards without art. Radial gradient + noise specks."""
    img = Image.new("RGB", (w, h), (5, 6, 16))
    pixels = img.load()
    cx, cy = w / 2, h / 2
    maxr = math.hypot(cx, cy)
    ar, ag, ab = accent
    for y in range(h):
        for x in range(w):
            r = math.hypot(x - cx, y - cy) / maxr
            fall = max(0.0, 1.0 - r)
            cr = int(5 + ar * 0.18 * fall)
            cg = int(6 + ag * 0.18 * fall)
            cb = int(16 + ab * 0.22 * fall)
            pixels[x, y] = (cr, cg, cb)
    # sparse speck pattern so it reads as "space"
    rng = _mulberry(seed)
    for _ in range(260):
        sx = int(rng() * w)
        sy = int(rng() * h)
        br = 140 + int(rng() * 100)
        img.putpixel((sx, sy), (br, br, br))
    return img


def _mulberry(seed: int):
    s = [seed & 0xFFFFFFFF]
    def rng() -> float:
        s[0] = (s[0] + 0x6D2B79F5) & 0xFFFFFFFF
        t = s[0]
        t = ((t ^ (t >> 15)) * (t | 1)) & 0xFFFFFFFF
        t ^= (t + ((t ^ (t >> 7)) * (t | 61))) & 0xFFFFFFFF
        return ((t ^ (t >> 14)) & 0xFFFFFFFF) / 4294967296
    return rng


def gradient_fill(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int],
                  c1: tuple[int, int, int], c2: tuple[int, int, int]) -> None:
    x0, y0, x1, y1 = box
    h = y1 - y0
    for i in range(h):
        t = i / max(1, h - 1)
        r = int(c1[0] + (c2[0] - c1[0]) * t)
        g = int(c1[1] + (c2[1] - c1[1]) * t)
        b = int(c1[2] + (c2[2] - c1[2]) * t)
        draw.line([(x0, y0 + i), (x1, y0 + i)], fill=(r, g, b))


def draw_glow_rect(canvas: Image.Image, box: tuple[int, int, int, int],
                   colour: tuple[int, int, int], radius: int = 20, blur: int = 18,
                   width: int = 4) -> None:
    """Draw a glowing rounded rectangle by rendering to a separate layer + blur."""
    layer = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    ld = ImageDraw.Draw(layer)
    ld.rounded_rectangle(box, radius=radius, outline=colour + (255,), width=width)
    blurred = layer.filter(ImageFilter.GaussianBlur(blur))
    canvas.alpha_composite(blurred)
    ImageDraw.Draw(canvas).rounded_rectangle(box, radius=radius, outline=colour + (255,), width=width)


def wrap_text(text: str, font: ImageFont.FreeTypeFont, max_w: int) -> list[str]:
    words = text.split()
    lines: list[str] = []
    cur: list[str] = []
    for w in words:
        trial = " ".join(cur + [w])
        if font.getlength(trial) <= max_w or not cur:
            cur.append(w)
        else:
            lines.append(" ".join(cur))
            cur = [w]
    if cur:
        lines.append(" ".join(cur))
    return lines


def attack_defence_for(card: dict) -> tuple[Optional[int], Optional[int]]:
    """Map card stats → (ATK, DEF) footer pair. Both may be None."""
    stats = card.get("stats") or {}
    atk = stats.get("damage")
    dfn = stats.get("block") or stats.get("absorb")
    if atk is None and dfn is None:
        # fall back to heal / per_turn so drones/consumables still show something
        if stats.get("heal"):
            return None, stats.get("heal")
        if stats.get("draw"):
            return stats.get("draw"), None
    return atk, dfn


# --- compositor ----------------------------------------------------------

def render_card(card: dict) -> Image.Image:
    rarity_key = card.get("rarity", "common")
    rarity = RARITY_COLOURS.get(rarity_key, RARITY_COLOURS["common"])
    card_type = card.get("type", "weapon")
    type_colour = TYPE_COLOURS.get(card_type, (200, 200, 220))

    canvas = Image.new("RGBA", (CARD_W, CARD_H), (0, 0, 0, 255))

    # 1. Background gradient
    draw = ImageDraw.Draw(canvas)
    gradient_fill(draw, (0, 0, CARD_W, CARD_H), BG_TOP, BG_BOTTOM)

    # 2. Art panel
    art_src = art_path_for(card["id"])
    if art_src:
        art = Image.open(art_src).convert("RGBA")
        art_fit = Image.new("RGBA", (ART_W, ART_H), (0, 0, 0, 0))
        ratio = max(ART_W / art.width, ART_H / art.height)
        new_size = (int(art.width * ratio), int(art.height * ratio))
        art_scaled = art.resize(new_size, Image.LANCZOS)
        # centre-crop to ART_W x ART_H
        left = (art_scaled.width - ART_W) // 2
        top = (art_scaled.height - ART_H) // 2
        art_fit.paste(art_scaled.crop((left, top, left + ART_W, top + ART_H)), (0, 0))
    else:
        seed = sum(ord(c) for c in card["id"]) * 131 + 17
        placeholder = make_background_placeholder(ART_W, ART_H, seed, type_colour)
        art_fit = placeholder.convert("RGBA")
        # type-glyph label for placeholder so it doesn't read blank
        pd = ImageDraw.Draw(art_fit)
        label_font = load_font(FONT_NAME, 120)
        label = card_type[:1].upper()
        tw = pd.textlength(label, font=label_font)
        pd.text(((ART_W - tw) / 2, ART_H / 2 - 90), label, font=label_font,
                fill=type_colour + (210,))
        sub_font = load_font(FONT_TYPE, 24)
        sub = "PROCEDURAL · ART PENDING"
        sw = pd.textlength(sub, font=sub_font)
        pd.text(((ART_W - sw) / 2, ART_H / 2 + 40), sub, font=sub_font,
                fill=(220, 220, 240, 180))

    canvas.alpha_composite(art_fit, (ART_X, ART_Y))

    # 3. Soft vignette around art
    vignette = Image.new("RGBA", (ART_W, ART_H), (0, 0, 0, 0))
    vd = ImageDraw.Draw(vignette)
    vd.rounded_rectangle((0, 0, ART_W - 1, ART_H - 1), radius=8,
                         outline=(0, 0, 0, 160), width=14)
    canvas.alpha_composite(vignette.filter(ImageFilter.GaussianBlur(9)), (ART_X, ART_Y))

    # 4. Outer rarity glow border
    outer = (FRAME_OUTER_PAD, FRAME_OUTER_PAD,
             CARD_W - FRAME_OUTER_PAD, CARD_H - FRAME_OUTER_PAD)
    draw_glow_rect(canvas, outer, rarity["main"], radius=22, blur=22, width=6)
    inner = (FRAME_OUTER_PAD + FRAME_INNER_PAD, FRAME_OUTER_PAD + FRAME_INNER_PAD,
             CARD_W - FRAME_OUTER_PAD - FRAME_INNER_PAD,
             CARD_H - FRAME_OUTER_PAD - FRAME_INNER_PAD)
    ImageDraw.Draw(canvas).rounded_rectangle(inner, radius=14,
                                             outline=rarity["glow"] + (200,),
                                             width=2)

    # 5. Name bar
    name_box = (110, NAME_BAR_Y, CARD_W - 34, NAME_BAR_Y + NAME_BAR_H)
    bar_layer = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    bd = ImageDraw.Draw(bar_layer)
    bd.rounded_rectangle(name_box, radius=14, fill=(14, 17, 34, 235),
                         outline=rarity["main"] + (220,), width=2)
    canvas.alpha_composite(bar_layer)

    name_font_size = 38
    name_font = load_font(FONT_NAME, name_font_size)
    name = card.get("name", "Unknown")
    # shrink-to-fit so long names don't clip
    max_name_w = (name_box[2] - name_box[0]) - 28
    while name_font.getlength(name) > max_name_w and name_font_size > 20:
        name_font_size -= 2
        name_font = load_font(FONT_NAME, name_font_size)
    draw = ImageDraw.Draw(canvas)
    tx = name_box[0] + 18
    ty = name_box[1] + (NAME_BAR_H - name_font_size) // 2 - 2
    draw.text((tx + 2, ty + 2), name, font=name_font, fill=(0, 0, 0, 200))
    draw.text((tx, ty), name, font=name_font, fill=(240, 245, 255, 255))

    # 6. Cost badge
    cost = card.get("cost", 0)
    badge_layer = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    bdl = ImageDraw.Draw(badge_layer)
    bdl.ellipse((COST_BADGE_CX - COST_BADGE_R - 6, COST_BADGE_CY - COST_BADGE_R - 6,
                 COST_BADGE_CX + COST_BADGE_R + 6, COST_BADGE_CY + COST_BADGE_R + 6),
                fill=rarity["glow"] + (90,))
    badge_blur = badge_layer.filter(ImageFilter.GaussianBlur(12))
    canvas.alpha_composite(badge_blur)
    draw = ImageDraw.Draw(canvas)
    draw.ellipse((COST_BADGE_CX - COST_BADGE_R, COST_BADGE_CY - COST_BADGE_R,
                  COST_BADGE_CX + COST_BADGE_R, COST_BADGE_CY + COST_BADGE_R),
                 fill=(10, 14, 28, 250), outline=rarity["main"] + (255,), width=4)
    cost_font = load_font(FONT_COST, 48)
    cost_txt = str(cost)
    cw = draw.textlength(cost_txt, font=cost_font)
    draw.text((COST_BADGE_CX - cw / 2, COST_BADGE_CY - 28), cost_txt,
              font=cost_font, fill=(240, 245, 255, 255))

    # 7. Type + keywords bar
    type_box = (34, TYPE_BAR_Y, CARD_W - 34, TYPE_BAR_Y + TYPE_BAR_H)
    tlayer = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    td = ImageDraw.Draw(tlayer)
    td.rounded_rectangle(type_box, radius=10, fill=(10, 13, 28, 220),
                         outline=type_colour + (200,), width=2)
    canvas.alpha_composite(tlayer)
    draw = ImageDraw.Draw(canvas)
    type_font = load_font(FONT_TYPE, 22)
    type_label = card_type.upper()
    keywords = card.get("keywords") or []
    kw_text = ""
    if keywords:
        kw_text = " · ".join(k.replace("_", " ").upper() for k in keywords)
    # type on left, keywords on right
    draw.text((type_box[0] + 18, type_box[1] + 8), type_label,
              font=type_font, fill=type_colour + (255,))
    rarity_tag = rarity["name"]
    rtw = draw.textlength(rarity_tag, font=type_font)
    draw.text((type_box[2] - rtw - 18, type_box[1] + 8), rarity_tag,
              font=type_font, fill=rarity["main"] + (255,))
    if kw_text:
        # second line centred for keywords if we had space — use ability area instead
        pass

    # 8. Ability text box
    ab_box = (34, ABILITY_BOX_Y, CARD_W - 34, ABILITY_BOX_Y + ABILITY_BOX_H)
    alayer = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    ad = ImageDraw.Draw(alayer)
    ad.rounded_rectangle(ab_box, radius=10, fill=(8, 10, 24, 220),
                         outline=(50, 55, 85, 180), width=1)
    canvas.alpha_composite(alayer)
    draw = ImageDraw.Draw(canvas)

    ability_font = load_font(FONT_ABILITY, 26)
    ability_lines = wrap_text(card.get("abilityText", ""), ability_font, ab_box[2] - ab_box[0] - 36)
    y = ab_box[1] + 14
    for line in ability_lines[:5]:
        draw.text((ab_box[0] + 18, y), line, font=ability_font, fill=(225, 230, 245, 255))
        y += 32

    # keywords appear under ability text
    if kw_text and y < ab_box[3] - 24:
        kw_font = load_font(FONT_TYPE, 18)
        kw_lines = wrap_text(kw_text, kw_font, ab_box[2] - ab_box[0] - 36)
        for line in kw_lines[:2]:
            draw.text((ab_box[0] + 18, y + 4), line, font=kw_font, fill=type_colour + (240,))
            y += 22

    flavor = card.get("flavor") or ""
    if flavor and y < ab_box[3] - 30:
        f_font = load_font(FONT_FLAVOR, 18)
        flav_lines = wrap_text(flavor, f_font, ab_box[2] - ab_box[0] - 36)
        for line in flav_lines[:2]:
            draw.text((ab_box[0] + 18, y + 6), line, font=f_font, fill=(170, 175, 200, 220))
            y += 22

    # 9. Footer ATK / DEF + card id
    atk, dfn = attack_defence_for(card)
    foot_box = (34, FOOTER_Y, CARD_W - 34, FOOTER_Y + FOOTER_H)
    flayer = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    fd = ImageDraw.Draw(flayer)
    fd.rounded_rectangle(foot_box, radius=10, fill=(6, 8, 20, 230),
                         outline=rarity["main"] + (180,), width=2)
    canvas.alpha_composite(flayer)
    draw = ImageDraw.Draw(canvas)

    stats_font = load_font(FONT_STATS, 32)
    small = load_font(FONT_TYPE, 18)
    mid = CARD_H - 54
    # ATK (left pod)
    label_atk = "ATK"
    val_atk = str(atk) if atk is not None else "—"
    draw.text((foot_box[0] + 24, mid - 14), label_atk, font=small, fill=(255, 90, 90, 220))
    draw.text((foot_box[0] + 24 + small.getlength(label_atk) + 10, mid - 20),
              val_atk, font=stats_font, fill=(255, 230, 230, 255))
    # DEF (right pod)
    label_def = "DEF"
    val_def = str(dfn) if dfn is not None else "—"
    dw = stats_font.getlength(val_def) + small.getlength(label_def) + 10
    draw.text((foot_box[2] - dw - 24, mid - 14), label_def, font=small, fill=(90, 170, 255, 220))
    draw.text((foot_box[2] - stats_font.getlength(val_def) - 24, mid - 20),
              val_def, font=stats_font, fill=(230, 240, 255, 255))

    # 10. Card id + set tag bottom-outside (tiny, decorative)
    idfont = load_font(FONT_TYPE, 13)
    faction = (card.get("faction") or "").upper()
    footer = f"{card['id']}  ·  {faction}"
    draw.text((34, CARD_H - 22), footer, font=idfont, fill=(90, 95, 120, 200))

    return canvas.convert("RGB")


# --- main ---------------------------------------------------------------

def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--test", action="store_true",
                    help="render only 5 sample cards (one per rarity tier + 1 placeholder)")
    ap.add_argument("--only", default="",
                    help="comma-separated card ids to render (overrides --test)")
    ap.add_argument("--limit", type=int, default=0,
                    help="cap the number of cards to render (0 = no cap)")
    args = ap.parse_args()

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    all_cards = load_all_cards()
    by_id = {c["id"]: c for c in all_cards}

    if args.only:
        ids = [s.strip() for s in args.only.split(",") if s.strip()]
        subset = [by_id[i] for i in ids if i in by_id]
    elif args.test:
        # one of each rarity if available + one placeholder (baseline = no art)
        picks: list[dict] = []
        seen_r: set[str] = set()
        for rarity in ("common", "uncommon", "rare", "legendary", "mythic"):
            for c in all_cards:
                if c["rarity"] == rarity and art_path_for(c["id"]) and rarity not in seen_r:
                    picks.append(c)
                    seen_r.add(rarity)
                    break
        # add a placeholder (baseline card with no art)
        for c in all_cards:
            if not art_path_for(c["id"]):
                picks.append(c)
                break
        subset = picks
    else:
        subset = all_cards

    if args.limit and len(subset) > args.limit:
        subset = subset[: args.limit]

    print(f"Rendering {len(subset)} cards into {OUT_DIR}")
    fail = 0
    for i, card in enumerate(subset, 1):
        try:
            img = render_card(card)
            out_path = OUT_DIR / f"{card['id']}.png"
            img.save(out_path, "PNG", optimize=True)
            marker = "art" if art_path_for(card["id"]) else "placeholder"
            print(f"  [{i:3d}/{len(subset)}] {card['id']:32s} {card['rarity']:10s} {marker}")
        except Exception as exc:  # noqa: BLE001
            fail += 1
            print(f"  [{i:3d}/{len(subset)}] {card['id']} FAILED: {exc}", file=sys.stderr)

    print(f"Done. {len(subset) - fail} ok, {fail} failed.")
    return 1 if fail else 0


if __name__ == "__main__":
    raise SystemExit(main())
