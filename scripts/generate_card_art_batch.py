"""AFS-5 Task 2/3: Imagen 4 card art batch renderer.

Default (test) mode:
  python scripts/generate_card_art_batch.py
    Renders 5 random cards per rarity = 30 cards total. Seed is fixed
    so the same 30 cards are picked every run.

Full mode (only after Jix approval per SKILL):
  python scripts/generate_card_art_batch.py --full

Inputs:
  docs/alpha_set/card_art_prompts_v2.json  (from Task 1)
  env GOOGLE_AI_STUDIO_API_KEY             (Google AI Studio key)

Outputs:
  public/cards/art/<card_id>.png           (one PNG per card)
  docs/alpha_set/render_log_test.json      (test run log)
  docs/alpha_set/render_log_full.json      (full run log, if --full)
"""
from __future__ import annotations
import argparse
import base64
import json
import os
import pathlib
import random
import sys
import time
from urllib import request, error

ROOT = pathlib.Path(__file__).resolve().parent.parent
PROMPTS_JSON = ROOT / "docs" / "alpha_set" / "card_art_prompts_v2.json"
ART_DIR = ROOT / "public" / "cards" / "art"
LOG_TEST = ROOT / "docs" / "alpha_set" / "render_log_test.json"
LOG_FULL = ROOT / "docs" / "alpha_set" / "render_log_full.json"

MODEL_ID = "imagen-4.0-generate-001"
ENDPOINT = (
    f"https://generativelanguage.googleapis.com/v1beta/models/"
    f"{MODEL_ID}:predict"
)

# Per-request pause to stay inside the Imagen 4 paid-tier RPM cap.
REQUEST_DELAY_S = 1.0
# Max retries on transient HTTP failures.
MAX_RETRIES = 3


def load_api_key() -> str:
    """Prefer env; fall back to scanning .env.local so the script also
    works when invoked from a shell that has not exported the var."""
    key = os.environ.get("GOOGLE_AI_STUDIO_API_KEY", "").strip()
    if key:
        return key
    env_local = ROOT / ".env.local"
    if env_local.exists():
        for line in env_local.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            if line.startswith("GOOGLE_AI_STUDIO_API_KEY="):
                return line.split("=", 1)[1].strip().strip('"').strip("'")
    return ""


def pick_test_set(entries: list[dict], per_rarity: int, seed: int) -> list[dict]:
    """Stratified random sample: <per_rarity> cards per rarity bucket."""
    by_rarity: dict[str, list[dict]] = {}
    for e in entries:
        by_rarity.setdefault(e["rarity"], []).append(e)
    rng = random.Random(seed)
    out: list[dict] = []
    for r in ("common", "uncommon", "rare", "epic", "legendary", "mythic"):
        pool = list(by_rarity.get(r, []))
        k = min(per_rarity, len(pool))
        out.extend(rng.sample(pool, k))
    return out


def call_imagen(api_key: str, entry: dict) -> bytes:
    """POST to Imagen 4 :predict, return PNG bytes or raise."""
    body = {
        "instances": [{"prompt": entry["prompt"]}],
        "parameters": {
            "sampleCount": 1,
            "aspectRatio": "1:1",
            "imageSize": "2K",
            "personGeneration": "dont_allow",
            "safetyFilterLevel": "block_only_high",
            "negativePrompt": entry["negative_prompt"],
        },
    }
    req = request.Request(
        f"{ENDPOINT}?key={api_key}",
        data=json.dumps(body).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with request.urlopen(req, timeout=180) as resp:
        payload = json.loads(resp.read().decode("utf-8"))
    preds = payload.get("predictions") or []
    if not preds:
        raise RuntimeError(f"no predictions: {json.dumps(payload)[:300]}")
    b64 = preds[0].get("bytesBase64Encoded")
    if not b64:
        raise RuntimeError(
            f"no bytesBase64Encoded: keys={list(preds[0].keys())}"
        )
    return base64.b64decode(b64)


def render_one(api_key: str, entry: dict, out_dir: pathlib.Path) -> dict:
    out_path = out_dir / f"{entry['id']}.png"
    if out_path.exists() and out_path.stat().st_size > 0:
        return {
            "id": entry["id"],
            "name": entry["name"],
            "rarity": entry["rarity"],
            "type": entry["type"],
            "status": "skipped_exists",
            "path": str(out_path.relative_to(ROOT)),
            "bytes": out_path.stat().st_size,
        }
    delay = 2.0
    last_detail = ""
    for attempt in range(1, MAX_RETRIES + 1):
        t0 = time.time()
        try:
            png = call_imagen(api_key, entry)
            out_path.write_bytes(png)
            return {
                "id": entry["id"],
                "name": entry["name"],
                "rarity": entry["rarity"],
                "type": entry["type"],
                "status": "ok",
                "render_time_s": round(time.time() - t0, 2),
                "bytes": len(png),
                "path": str(out_path.relative_to(ROOT)),
                "attempt": attempt,
            }
        except error.HTTPError as e:
            code = e.code
            last_detail = e.read().decode("utf-8", errors="replace")[:300]
            if code in (429, 500, 502, 503, 504) and attempt < MAX_RETRIES:
                time.sleep(delay)
                delay *= 2
                continue
            return {
                "id": entry["id"],
                "name": entry["name"],
                "rarity": entry["rarity"],
                "type": entry["type"],
                "status": f"error_http_{code}",
                "detail": last_detail,
            }
        except Exception as e:
            last_detail = str(e)[:300]
            if attempt < MAX_RETRIES:
                time.sleep(delay)
                delay *= 2
                continue
            return {
                "id": entry["id"],
                "name": entry["name"],
                "rarity": entry["rarity"],
                "type": entry["type"],
                "status": "error",
                "detail": last_detail,
            }
    return {
        "id": entry["id"],
        "name": entry["name"],
        "status": "error_exhausted",
        "detail": last_detail,
    }


def summarise(logs: list[dict]) -> dict:
    return {
        "total": len(logs),
        "ok": sum(1 for r in logs if r.get("status") == "ok"),
        "skipped": sum(1 for r in logs if r.get("status") == "skipped_exists"),
        "errors": sum(
            1 for r in logs if str(r.get("status", "")).startswith("error")
        ),
        "total_bytes": sum(r.get("bytes", 0) for r in logs),
    }


def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument(
        "--full",
        action="store_true",
        help="render all 1000 (only after Jix approval)",
    )
    p.add_argument("--per-rarity", type=int, default=5)
    p.add_argument("--seed", type=int, default=42)
    p.add_argument(
        "--dry-run",
        action="store_true",
        help="print targets, do not call API",
    )
    args = p.parse_args()

    if not PROMPTS_JSON.exists():
        print(
            f"ERROR: {PROMPTS_JSON.relative_to(ROOT)} missing."
            " Run build_personalized_card_prompts.py first.",
            file=sys.stderr,
        )
        sys.exit(2)
    entries = json.loads(PROMPTS_JSON.read_text(encoding="utf-8"))

    if args.full:
        targets = entries
        log_path = LOG_FULL
    else:
        targets = pick_test_set(entries, args.per_rarity, args.seed)
        log_path = LOG_TEST

    print(
        f"mode={'full' if args.full else 'test'} "
        f"count={len(targets)} "
        f"art_dir={ART_DIR.relative_to(ROOT)} "
        f"log={log_path.relative_to(ROOT)}"
    )
    if args.dry_run:
        for i, e in enumerate(targets, 1):
            print(f"[{i}] {e['rarity']:>10} {e['type']:<12} {e['id']}")
        print(f"DRY RUN: {len(targets)} targets, no API calls made")
        return

    api_key = load_api_key()
    if not api_key:
        print(
            "ERROR: GOOGLE_AI_STUDIO_API_KEY not set (checked env and"
            " .env.local). Add it and rerun.",
            file=sys.stderr,
        )
        sys.exit(2)

    ART_DIR.mkdir(parents=True, exist_ok=True)
    logs: list[dict] = []
    for i, e in enumerate(targets, 1):
        t0 = time.time()
        result = render_one(api_key, e, ART_DIR)
        logs.append(result)
        elapsed = time.time() - t0
        flag = result.get("status")
        print(
            f"[{i:>4}/{len(targets)}] {e['rarity']:>10} "
            f"{e['id']:<32} {flag} ({elapsed:.1f}s)"
        )
        # Persist log after every card so a crash does not lose progress.
        log_path.write_text(
            json.dumps(
                {"summary": summarise(logs), "entries": logs},
                indent=2,
            ),
            encoding="utf-8",
        )
        if i < len(targets):
            time.sleep(REQUEST_DELAY_S)

    summary = summarise(logs)
    log_path.write_text(
        json.dumps({"summary": summary, "entries": logs}, indent=2),
        encoding="utf-8",
    )
    print(f"DONE: {summary}")


if __name__ == "__main__":
    main()
