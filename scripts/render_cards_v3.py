"""
scripts/render_cards_v3.py — Sprint 14h

Composites rarity frames onto all 257 cards (baseline + full_card_library +
expansion_set_1). Each output is a 1024x1536 PNG with:

  * Rarity frame as background
  * Card art from public/cards/rendered/<id>.png pasted into the frame's
    interior window (per-frame bounds detected by near-black-pixel scan)
  * Card name in the top banner
  * Energy cost in the top-right circle
  * ATK (stats.damage) bottom-left, DEF (stats.block) bottom-right
  * Ability text (wrapped) in the lower band
  * Type + keywords label under the ability text

Usage:
    python scripts/render_cards_v3.py            # write 257 PNGs
    python scripts/render_cards_v3.py --limit 5  # smoke-test first 5
    python scripts/render_cards_v3.py --only heavy_torpedo  # single card

Exits non-zero if any frame or art file is missing, or if the art-window
detector fails on any frame (writes a debug PNG and aborts).
"""
from __future__ import annotations

import argparse
import json
import os
import sys
import textwrap
from pathlib import Path

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    sys.stderr.write("STOP: PIL (Pillow) is not installed. Run: pip install Pillow\n")
    sys.exit(2)

REPO = Path(__file__).resolve().parent.parent
LIB_DIR = REPO / "lib" / "game" / "cards"
RENDERED_DIR = REPO / "public" / "cards" / "rendered"
FRAMES_DIR = REPO / "public" / "card-frames-clean"
OUT_DIR = REPO / "public" / "cards" / "composed"
DEBUG_DIR = REPO / "public" / "cards" / "_debug"
FONTS_DIR = REPO / "public" / "fonts"

# Rarity -> frame filename (all in public/card-frames/)
FRAME_MAP = {
    "common":    "frame_common.png",
    "uncommon":  "frame_uncommon.png",
    "rare":      "frame_rare.png",
    "epic":      "frame_epic.png",   # not currently present in library, but supported
    "legendary": "frame_legendary.png",
    "mythic":    "frame_mythic.png",
}

CANVAS = (1024, 1536)

# Per-frame layout. Panels mask the frame's baked placeholder text (CARD NAME,
# cost 0, ABILITY TEXT, TYPE / KEYWORD, 2 / 3). Text positions place dynamic
# values where the placeholder sat. Sampled by scanning each frame PNG.
FRAME_LAYOUT = {
    # Text anchor centres and ability-body start y are calibrated against the
    # frames cleaned by scripts/clean_frames.py — so they sit in the middle
    # of each now-empty inlay zone.
    "common": {
        "name_pos":       (495, 185),
        "cost_pos":       (905, 180),
        "ability_body_y": 1122,
        "bottom_y":       1427,
    },
    "uncommon": {
        "name_pos":       (495, 185),
        "cost_pos":       (905, 180),
        "ability_body_y": 1122,
        "bottom_y":       1427,
    },
    "rare": {
        "name_pos":       (495, 143),
        "cost_pos":       (905, 140),
        "ability_body_y": 1165,
        "bottom_y":       1487,
    },
    "epic": {
        "name_pos":       (495, 185),
        "cost_pos":       (905, 170),
        "ability_body_y": 1120,
        "bottom_y":       1390,
    },
    "legendary": {
        "name_pos":       (495, 180),
        "cost_pos":       (905, 160),
        "ability_body_y": 1100,
        "bottom_y":       1370,
    },
    "mythic": {
        "name_pos":       (495, 185),
        "cost_pos":       (905, 180),
        "ability_body_y": 1108,
        "bottom_y":       1375,
    },
}


# ─── font loader ───────────────────────────────────────────────────────────

def _try_font(candidates, size):
    for c in candidates:
        try:
            return ImageFont.truetype(str(c), size)
        except (OSError, IOError):
            continue
    return ImageFont.load_default()


def load_fonts():
    title_candidates = [
        FONTS_DIR / "title.ttf",
        FONTS_DIR / "display.ttf",
        "C:/Windows/Fonts/segoeuib.ttf",
        "C:/Windows/Fonts/arialbd.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    ]
    body_candidates = [
        FONTS_DIR / "body.ttf",
        "C:/Windows/Fonts/segoeui.ttf",
        "C:/Windows/Fonts/arial.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    ]
    return {
        "title":  _try_font(title_candidates, 58),
        "cost":   _try_font(title_candidates, 72),
        "stat":   _try_font(title_candidates, 52),
        "kw":     _try_font(title_candidates, 34),
        "body":   _try_font(body_candidates, 28),
        "meta":   _try_font(body_candidates, 22),
    }


# ─── art-window detection ──────────────────────────────────────────────────

def _longest_dark_run(pixels, axis_range, fixed, orientation, threshold=20):
    best_start, best_len = None, 0
    cur_start, cur_len = None, 0
    for v in axis_range:
        r, g, b = pixels[(v, fixed)] if orientation == "h" else pixels[(fixed, v)]
        bright = (r + g + b) // 3
        if bright <= threshold:
            if cur_start is None:
                cur_start = v
            cur_len += 1
            if cur_len > best_len:
                best_len, best_start = cur_len, cur_start
        else:
            cur_start, cur_len = None, 0
    return best_start, best_len


def detect_window(im):
    """Find the largest contiguous near-black rectangle in the frame's interior.
    Returns (left, top, right, bottom) inclusive, or None."""
    w, h = im.size
    px = im.load()
    cx = w // 2
    v_start, v_len = _longest_dark_run(px, range(h), cx, "v")
    if v_len < 200:
        return None
    top, bottom = v_start, v_start + v_len - 1
    midy = (top + bottom) // 2
    h_start, h_len = _longest_dark_run(px, range(w), midy, "h")
    if h_len < 200:
        return None
    left, right = h_start, h_start + h_len - 1
    midx = (left + right) // 2
    v_start2, v_len2 = _longest_dark_run(px, range(h), midx, "v")
    if v_len2 >= v_len * 0.9:
        top, bottom = v_start2, v_start2 + v_len2 - 1
    return (left, top, right, bottom)


def save_debug(im, window, rarity):
    DEBUG_DIR.mkdir(parents=True, exist_ok=True)
    dbg = im.copy()
    draw = ImageDraw.Draw(dbg)
    if window:
        l, t, r, b = window
        draw.rectangle((l, t, r, b), outline=(255, 0, 255), width=6)
    out = DEBUG_DIR / f"window_{rarity}.png"
    dbg.save(out)
    return out


# ─── compositor ────────────────────────────────────────────────────────────

def extract_art_region(rendered_card):
    """The 257 source PNGs in public/cards/rendered/ are 750x1050 legacy
    cards — title/cost header on top, art window in the middle, ability
    text + stats bar on the bottom. Crop to just the middle art region.
    Coordinates derived by variance-analysis sampling the legacy template."""
    w, h = rendered_card.size
    left = int(round(0.06 * w))
    right = int(round(0.94 * w))
    top = int(round(0.17 * h))
    bottom = int(round(0.655 * h))
    return rendered_card.crop((left, top, right, bottom))


def paste_art_in_window(base, art, window):
    """Paste art, cover-style (fill the window; crop overflow), into base."""
    l, t, r, b = window
    ww, wh = r - l + 1, b - t + 1
    art = extract_art_region(art)
    aw, ah = art.size
    # Cover fit: scale so art covers the window, then center-crop overflow.
    scale = max(ww / aw, wh / ah)
    new_w = max(1, int(round(aw * scale)))
    new_h = max(1, int(round(ah * scale)))
    resized = art.resize((new_w, new_h), Image.LANCZOS)
    cx, cy = new_w // 2, new_h // 2
    left = cx - ww // 2
    top = cy - wh // 2
    cropped = resized.crop((left, top, left + ww, top + wh))
    base.paste(cropped, (l, t))


def draw_text_with_outline(draw, xy, text, font, fill="#f8fafc",
                            outline="#000000", outline_w=3, anchor="mm"):
    x, y = xy
    for dx in range(-outline_w, outline_w + 1):
        for dy in range(-outline_w, outline_w + 1):
            if dx == 0 and dy == 0:
                continue
            draw.text((x + dx, y + dy), text, font=font, fill=outline, anchor=anchor)
    draw.text(xy, text, font=font, fill=fill, anchor=anchor)


def wrap_to_width(text, font, draw, max_w):
    words = text.split()
    lines = []
    cur = ""
    for w in words:
        trial = f"{cur} {w}".strip()
        bbox = draw.textbbox((0, 0), trial, font=font)
        if bbox[2] - bbox[0] <= max_w:
            cur = trial
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def compose_card(card, frame_img, window, rarity, fonts):
    layout = FRAME_LAYOUT[rarity]
    base = frame_img.copy().convert("RGB")
    art_path = RENDERED_DIR / f"{card['id']}.png"
    if not art_path.exists():
        return None, f"missing art: {art_path.name}"
    art = Image.open(art_path).convert("RGB")
    paste_art_in_window(base, art, window)

    draw = ImageDraw.Draw(base)

    # Frames are pre-cleaned by scripts/clean_frames.py — no mask rectangles
    # needed. The dark recessed inlays are empty and ready for dynamic text.

    # Name — top banner
    name = card.get("name", card["id"]).upper()
    draw_text_with_outline(draw, layout["name_pos"], name,
                           fonts["title"], fill="#fef3c7", outline="#1a1105",
                           outline_w=3, anchor="mm")

    # Energy cost — top-right circle
    cost = str(card.get("cost", 0))
    draw_text_with_outline(draw, layout["cost_pos"], cost,
                           fonts["cost"], fill="#ffffff", outline="#000000",
                           outline_w=4, anchor="mm")

    # Ability body text
    ability = card.get("abilityText", "")
    lines = wrap_to_width(ability, fonts["body"], draw, max_w=820)
    line_h = 36
    start_y = layout["ability_body_y"]
    for i, line in enumerate(lines[:5]):
        draw_text_with_outline(draw, (CANVAS[0] // 2, start_y + i * line_h),
                               line, fonts["body"], fill="#f1f5f9",
                               outline="#000000", outline_w=2, anchor="mm")

    # Bottom-left — type + first keyword
    ctype = card.get("type", "").upper()
    kws = card.get("keywords") or []
    if kws:
        left_label = f"{ctype}  " + kws[0].replace("_", " ").upper()
    else:
        left_label = ctype
    draw_text_with_outline(draw, (345, layout["bottom_y"]), left_label,
                           fonts["kw"], fill="#e2e8f0", outline="#000000",
                           outline_w=3, anchor="mm")

    # Bottom-right — ATK / DEF composite
    stats = card.get("stats", {}) or {}
    atk = stats.get("damage")
    df = stats.get("block")
    if atk is None and df is None:
        stat_label = str(card.get("cost", 0))
    elif df is None:
        stat_label = f"{atk} / 0"
    elif atk is None:
        stat_label = f"0 / {df}"
    else:
        stat_label = f"{atk} / {df}"
    draw_text_with_outline(draw, (815, layout["bottom_y"]), stat_label,
                           fonts["stat"], fill="#fef9c3", outline="#1a1105",
                           outline_w=3, anchor="mm")

    return base, None


# ─── driver ────────────────────────────────────────────────────────────────

def load_library():
    files = ["baseline.json", "full_card_library.json", "expansion_set_1.json"]
    seen = set()
    out = []
    for name in files:
        p = LIB_DIR / name
        if not p.exists():
            sys.exit(f"STOP: missing library file: {p}")
        with open(p, "r", encoding="utf-8") as f:
            data = json.load(f)
        for c in data:
            if c["id"] in seen:
                continue
            seen.add(c["id"])
            out.append(c)
    return out


def load_frames_and_windows():
    frames = {}
    windows = {}
    for rarity, fname in FRAME_MAP.items():
        p = FRAMES_DIR / fname
        if not p.exists():
            sys.exit(f"STOP: missing frame for rarity '{rarity}': {p}")
        im = Image.open(p).convert("RGB")
        if im.size != CANVAS:
            im = im.resize(CANVAS, Image.LANCZOS)
        window = detect_window(im)
        if window is None:
            dbg = save_debug(im, None, rarity)
            sys.exit(f"STOP: could not detect art window for '{rarity}'. "
                     f"Debug image written to {dbg}")
        frames[rarity] = im
        windows[rarity] = window
    return frames, windows


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--limit", type=int, default=None,
                    help="Only process the first N cards (smoke test).")
    ap.add_argument("--only", type=str, default=None,
                    help="Only process a single card id.")
    args = ap.parse_args()

    print(f"[1/4] Loading library...")
    cards = load_library()
    if args.only:
        cards = [c for c in cards if c["id"] == args.only]
        if not cards:
            sys.exit(f"STOP: no card with id '{args.only}'")
    if args.limit:
        cards = cards[: args.limit]
    print(f"      {len(cards)} cards to render")

    print(f"[2/4] Loading frames + detecting windows...")
    frames, windows = load_frames_and_windows()
    for rarity, w in windows.items():
        l, t, r, b = w
        print(f"      {rarity:10s} window=({l},{t})-({r},{b}) "
              f"size={r-l+1}x{b-t+1}")

    print(f"[3/4] Loading fonts...")
    fonts = load_fonts()

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    print(f"[4/4] Rendering -> {OUT_DIR.relative_to(REPO)}/")
    missing_art = []
    written = 0
    for i, card in enumerate(cards):
        rarity = card.get("rarity", "common").lower()
        if rarity not in frames:
            print(f"      SKIP {card['id']}: unknown rarity '{rarity}'")
            continue
        img, err = compose_card(card, frames[rarity], windows[rarity], rarity, fonts)
        if err:
            missing_art.append(f"{card['id']}: {err}")
            continue
        out = OUT_DIR / f"{card['id']}.png"
        # Downscale to retina web size (600x900) to keep the /public/ payload small.
        # Original 1024x1536 composites balloon to ~1.4 MB each; at 600x900 they
        # stay under ~250 KB without visible quality loss at card-grid display.
        img_out = img.resize((600, 900), Image.LANCZOS)
        img_out.save(out, "PNG", optimize=True)
        written += 1
        if (i + 1) % 50 == 0 or i == len(cards) - 1:
            print(f"      {i+1}/{len(cards)} done")

    print(f"\nDone. Wrote {written} PNG(s) to {OUT_DIR}")
    if missing_art:
        print("\nWARN: {} card(s) had missing art:".format(len(missing_art)))
        for m in missing_art[:10]:
            print(f"      - {m}")
        if len(missing_art) > 10:
            print(f"      ({len(missing_art) - 10} more)")
        sys.exit(1)


if __name__ == "__main__":
    main()
