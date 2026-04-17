"""
Strip placeholder text ("CARD NAME", "0", "ABILITY TEXT", "TYPE / KEYWORD",
"2 / 3") from the 6 source frame PNGs and save cleaned copies under
assets/card-frames/clean/. The cleaned frames have empty text zones that
the renderer can write real values into without having to paint over
anything.

Uses OpenCV's Telea inpainting with a mask covering every bright
placeholder-text pixel plus a small dilation margin so the inpaint
softly blends the donor pixels.

Run once:
    python scripts/clean_frames.py
"""

from __future__ import annotations

from pathlib import Path

import cv2
import numpy as np

REPO = Path(__file__).resolve().parent.parent
SRC_DIR = REPO / "assets" / "card-frames"
OUT_DIR = REPO / "assets" / "card-frames" / "clean"

# Placeholder zones (in the SCALED 750x1050 coordinate system) where the
# frames' baked-in "CARD NAME" / "0" / "ABILITY TEXT" / "TYPE / KEYWORD"
# / "2 / 3" labels live. Each zone gets wiped with a uniform dark panel
# colour — the renderer writes real text on top, so the exact shade
# under the text doesn't matter so long as it's dark and the edges
# blend with the surrounding frame.
ZONES = {
    # zones are generous — they must cover placeholder positions on
    # both the 1024x1536 frames and the 1060x1484 rare frame, whose
    # CARD NAME sits ~70 px higher and whose TYPE/STATS strip sits
    # ~20 px lower than the other five.
    "name":    (40,   10, 612, 180),
    "cost":    (562,  10, 732, 180),
    "ability": (180, 700, 570, 820),
    "type":    (55,  905, 475, 1045),
    "stats":   (480, 905, 725, 1045),
}

# Fill colour used for every cleaned zone. Slightly warm-black so it
# doesn't sit too sharply against the surrounding metallic frame.
DARK_FILL = np.array([10, 11, 16], dtype=np.float32)  # BGR
# Feather kernel — must be odd. Larger = softer edge between the
# cleaned zone and the surrounding frame.
FEATHER_K = 81

# Source → output filename. We clean whatever is in SRC_DIR.
FRAMES = ["common.png", "uncommon.png", "rare.png",
          "epic.png", "legendary.png", "mythic.png"]


def clean_frame(src_path: Path, dst_path: Path) -> None:
    bgr = cv2.imread(str(src_path), cv2.IMREAD_COLOR)
    if bgr is None:
        raise FileNotFoundError(src_path)

    h, w = bgr.shape[:2]
    sx, sy = w / 750.0, h / 1050.0

    # One combined soft mask for all zones so overlapping feathers merge.
    zone_mask = np.zeros((h, w), np.float32)
    for zone in ZONES.values():
        x0, y0, x1, y1 = zone[:4]
        X0, Y0 = int(x0 * sx), int(y0 * sy)
        X1, Y1 = int(x1 * sx), int(y1 * sy)
        cv2.rectangle(zone_mask, (X0, Y0), (X1, Y1), 1.0, -1)

    # Feather the combined mask so every zone's edge blends smoothly
    # into the surrounding frame metal/bevel.
    zone_mask = cv2.GaussianBlur(zone_mask, (FEATHER_K, FEATHER_K), 0)
    zone_mask = np.clip(zone_mask, 0, 1)[..., None]  # (h, w, 1)

    # Dark fill layer — same colour across the image, masked out to the
    # feathered zone area via alpha compositing.
    fill_layer = np.full_like(bgr, DARK_FILL, dtype=np.float32)
    src_f = bgr.astype(np.float32)
    result = src_f * (1 - zone_mask) + fill_layer * zone_mask
    result = np.clip(result, 0, 255).astype(np.uint8)

    dst_path.parent.mkdir(parents=True, exist_ok=True)
    cv2.imwrite(str(dst_path), result)


def main() -> int:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    missing = [f for f in FRAMES if not (SRC_DIR / f).exists()]
    if missing:
        print(f"WARN: missing source frames: {missing}")

    done = 0
    for fname in FRAMES:
        src = SRC_DIR / fname
        if not src.exists():
            continue
        dst = OUT_DIR / fname
        clean_frame(src, dst)
        print(f"  cleaned {fname} ({src.stat().st_size // 1024} KB -> {dst.stat().st_size // 1024} KB)")
        done += 1
    print(f"Done. {done} frames cleaned into {OUT_DIR}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
