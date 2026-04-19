"""
scripts/clean_frames.py — Sprint 14h-patch

Inpaints baked placeholder text ("CARD NAME", "0", "ABILITY TEXT",
"TYPE / KEYWORD", "2 / 3") out of every PNG in public/card-frames/ and
writes the result to public/card-frames-clean/.

Algorithm per region (tight text bbox, smaller than the panels in
render_cards_v3.py's FRAME_LAYOUT):

  1. Sample a 15px strip along the outside border of the region
     (above + below for horizontal bars, all 4 sides for the cost and
     stat boxes). These strips sit inside the dark recessed inlay
     that normally surrounds the placeholder text, so they reflect
     the panel's true background colour.
  2. Compute the median RGB of the sampled pixels.
  3. Fill every pixel inside the region with that median.
  4. Apply a Gaussian blur (radius=3) just over the filled region so
     the replacement blends into the surrounding inlay texture.

Stop condition: if any region's outside border yields no valid samples
(all off-canvas) the script writes a debug PNG showing the attempted
region + sample strips and exits non-zero.
"""
from __future__ import annotations

import sys
from pathlib import Path

try:
    from PIL import Image, ImageDraw, ImageFilter
except ImportError:
    sys.stderr.write("STOP: PIL (Pillow) is not installed. Run: pip install Pillow\n")
    sys.exit(2)

REPO = Path(__file__).resolve().parent.parent
SRC_DIR = REPO / "public" / "card-frames"
DST_DIR = REPO / "public" / "card-frames-clean"
DEBUG_DIR = REPO / "public" / "card-frames-clean" / "_debug"

# Tight text bboxes per rarity. These are the actual bounding boxes of the
# baked placeholder glyphs — NOT the generous masking panels used by the
# renderer. "hbar" means the text is a horizontal label (sample above+below);
# "box" means it's a small square (sample all 4 sides).
TEXT_REGIONS = {
    "common": {
        "name":    ("hbar", (150,  140,  840,  230)),
        "cost":    ("box",  (830,  110,  985,  250)),
        "ability": ("hbar", (200, 1080,  820, 1165)),
        "type":    ("hbar", (110, 1380,  690, 1475)),
        "stat":    ("box",  (690, 1380,  960, 1475)),
    },
    "uncommon": {
        "name":    ("hbar", (150,  140,  840,  230)),
        "cost":    ("box",  (830,  110,  985,  250)),
        "ability": ("hbar", (200, 1080,  820, 1165)),
        "type":    ("hbar", (110, 1380,  690, 1475)),
        "stat":    ("box",  (690, 1380,  960, 1475)),
    },
    "rare": {
        "name":    ("hbar", (150,   85,  840,  200)),
        "cost":    ("box",  (830,   30,  985,  250)),
        "ability": ("hbar", (200, 1115,  820, 1210)),
        "type":    ("hbar", (110, 1440,  690, 1535)),
        "stat":    ("box",  (690, 1440,  960, 1535)),
    },
    "epic": {
        "name":    ("hbar", (150,  140,  840,  230)),
        "cost":    ("box",  (830,   80,  985,  255)),
        "ability": ("hbar", (200, 1075,  820, 1165)),
        "type":    ("hbar", (110, 1305,  690, 1475)),
        "stat":    ("box",  (690, 1305,  960, 1475)),
    },
    "legendary": {
        "name":    ("hbar", (150,  135,  840,  220)),
        "cost":    ("box",  (830,   75,  985,  250)),
        "ability": ("hbar", (200, 1055,  820, 1140)),
        "type":    ("hbar", (110, 1290,  690, 1450)),
        "stat":    ("box",  (690, 1290,  960, 1450)),
    },
    "mythic": {
        "name":    ("hbar", (150,  140,  840,  230)),
        "cost":    ("box",  (830,   75,  985,  285)),
        "ability": ("hbar", (200, 1065,  820, 1150)),
        "type":    ("hbar", (110, 1290,  690, 1460)),
        "stat":    ("box",  (690, 1290,  960, 1460)),
    },
}

FRAME_FILES = {
    "common":    "frame_common.png",
    "uncommon":  "frame_uncommon.png",
    "rare":      "frame_rare.png",
    "epic":      "frame_epic.png",
    "legendary": "frame_legendary.png",
    "mythic":    "frame_mythic.png",
}

STRIP_WIDTH = 15
BLUR_RADIUS = 3
CANVAS = (1024, 1536)


def collect_border_pixels(px, bbox, kind, width=STRIP_WIDTH, canvas=CANVAS):
    """Sample pixels on the outside border of a region. For horizontal bars
    sample the `width`-tall strip above and below; for boxes sample all 4 sides."""
    l, t, r, b = bbox
    cw, ch = canvas
    samples = []

    def scan(xs, ys):
        for y in ys:
            if y < 0 or y >= ch:
                continue
            for x in xs:
                if x < 0 or x >= cw:
                    continue
                samples.append(px[x, y])

    if kind == "hbar":
        scan(range(l, r), range(max(0, t - width), t))
        scan(range(l, r), range(b, min(ch, b + width)))
    else:  # "box" — sample all 4 sides
        scan(range(l, r), range(max(0, t - width), t))
        scan(range(l, r), range(b, min(ch, b + width)))
        scan(range(max(0, l - width), l), range(t, b))
        scan(range(r, min(cw, r + width)), range(t, b))
    return samples


def median_color(samples):
    if not samples:
        return None
    n = len(samples)
    r_sorted = sorted(s[0] for s in samples)
    g_sorted = sorted(s[1] for s in samples)
    b_sorted = sorted(s[2] for s in samples)
    return (r_sorted[n // 2], g_sorted[n // 2], b_sorted[n // 2])


def save_debug(im, rarity, region_name, bbox, kind):
    DEBUG_DIR.mkdir(parents=True, exist_ok=True)
    dbg = im.copy()
    draw = ImageDraw.Draw(dbg)
    l, t, r, b = bbox
    draw.rectangle((l, t, r, b), outline=(255, 0, 255), width=4)
    w = STRIP_WIDTH
    draw.rectangle((l, t - w, r, t), outline=(0, 255, 255), width=2)
    draw.rectangle((l, b, r, b + w), outline=(0, 255, 255), width=2)
    if kind == "box":
        draw.rectangle((l - w, t, l, b), outline=(0, 255, 255), width=2)
        draw.rectangle((r, t, r + w, b), outline=(0, 255, 255), width=2)
    p = DEBUG_DIR / f"{rarity}__{region_name}.png"
    dbg.save(p)
    return p


def inpaint_region(im, bbox, med):
    """Fill the region with median colour, then blur the edges so the flat
    fill blends into the surrounding inlay texture."""
    l, t, r, b = bbox
    fill = Image.new("RGB", (r - l, b - t), med)
    im.paste(fill, (l, t))
    # Blur a slab slightly larger than the region so edges soften into the frame.
    pad = BLUR_RADIUS * 2
    l2 = max(0, l - pad)
    t2 = max(0, t - pad)
    r2 = min(CANVAS[0], r + pad)
    b2 = min(CANVAS[1], b + pad)
    slab = im.crop((l2, t2, r2, b2)).filter(ImageFilter.GaussianBlur(BLUR_RADIUS))
    im.paste(slab, (l2, t2))
    # Re-solid-fill the inner region so the body stays matte while only the
    # edges keep the blended softening.
    inner = Image.new("RGB", (r - l, b - t), med)
    im.paste(inner, (l, t))


def clean_frame(rarity, src_path, dst_path):
    im = Image.open(src_path).convert("RGB")
    if im.size != CANVAS:
        im = im.resize(CANVAS, Image.LANCZOS)
    regions = TEXT_REGIONS[rarity]
    px = im.load()

    for name, (kind, bbox) in regions.items():
        samples = collect_border_pixels(px, bbox, kind)
        med = median_color(samples)
        if med is None:
            dbg = save_debug(im, rarity, name, bbox, kind)
            sys.exit(f"STOP: no border samples for {rarity}/{name}. "
                     f"Debug at {dbg}")
        inpaint_region(im, bbox, med)
        # reload pixel accessor for the next region
        px = im.load()

    dst_path.parent.mkdir(parents=True, exist_ok=True)
    im.save(dst_path, "PNG", optimize=True)


def main():
    if not SRC_DIR.exists():
        sys.exit(f"STOP: source dir missing: {SRC_DIR}")

    DST_DIR.mkdir(parents=True, exist_ok=True)
    print(f"[1/2] Cleaning frames -> {DST_DIR.relative_to(REPO)}/")
    for rarity, fname in FRAME_FILES.items():
        src = SRC_DIR / fname
        if not src.exists():
            sys.exit(f"STOP: frame file missing: {src}")
        dst = DST_DIR / fname
        clean_frame(rarity, src, dst)
        print(f"      {rarity:10s} -> {dst.name}")

    print(f"[2/2] Done. Wrote {len(FRAME_FILES)} cleaned frame(s).")


if __name__ == "__main__":
    main()
