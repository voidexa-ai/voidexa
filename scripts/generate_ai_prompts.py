"""
generate_ai_prompts.py
======================

For each of the 1000 alpha cards, ask an AI to write ONE natural
image prompt based on the card's ability.

Uses OpenAI GPT-4o-mini (cheapest, fastest, good at this task).

Cost estimate:
  - GPT-4o-mini: ~$0.15 per 1M input tokens, ~$0.60 per 1M output tokens
  - Each card: ~200 input tokens, ~80 output tokens
  - Total for 1000 cards: ~$0.10

Time: ~10-15 min (1 card per ~1 sec, parallelism optional)

Output: docs/alpha_set/card_art_prompts_ai.json
"""

import argparse
import json
import os
import sys
import time
from pathlib import Path

try:
    from openai import OpenAI
except ImportError:
    print("ERROR: install openai first: pip install openai")
    sys.exit(1)

# ---------------------------------------------------------------------------
# LOAD .env.local (auto, so user doesn't need to set env var)
# ---------------------------------------------------------------------------

def load_env_local():
    """Load OPENAI_API_KEY from .env.local if not already set."""
    if os.getenv("OPENAI_API_KEY"):
        return
    env_file = Path(".env.local")
    if not env_file.exists():
        return
    try:
        for line in env_file.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            if "=" not in line:
                continue
            key, _, value = line.partition("=")
            key = key.strip()
            value = value.strip().strip('"').strip("'")
            if key and value and not os.getenv(key):
                os.environ[key] = value
    except Exception as e:
        print(f"Warning: could not read .env.local: {e}")

load_env_local()

# ---------------------------------------------------------------------------
# CONFIG
# ---------------------------------------------------------------------------

ALPHA_SET_DIR = Path("docs/alpha_set")
OUTPUT_FILE = ALPHA_SET_DIR / "card_art_prompts_ai.json"
SAMPLE_FILE = ALPHA_SET_DIR / "CARD_PROMPT_SAMPLE_AI_30.md"
LOG_FILE = ALPHA_SET_DIR / "AI_PROMPT_GENERATION_LOG.json"

MODEL = "gpt-4o-mini"
CANVAS = "1024x1792"

SYSTEM_PROMPT = """You write image prompts for a sci-fi space trading card game.

For each card I give you, write ONE natural-language image prompt that visually shows the card's ability.

Rules:
1. ONE concrete scene based on the card's ability. Not multiple scenes blended.
2. Length: 200-350 characters total.
3. No contradictory words (e.g. "dynamic motion" + "standing still").
4. If the ability has 2+ parts, show ALL of them in the scene.
5. End every prompt with exactly this suffix: "Cinematic deep space scene. No humans, no text, no labels, no UI overlays. Free negative space at bottom for card title overlay."
6. Leave clear empty space at the bottom of the scene (card text overlays there later).
7. No humans, pilots, astronauts, faces. Ships and machines only.
8. No text, labels, hull markings, ship names painted on hull.
9. Photorealistic cinematic sci-fi style.

Output ONLY the prompt text. No explanations, no markdown, no quotes, no labels."""

USER_TEMPLATE = """Card: {name}
Type: {type}
Rarity: {rarity}
Ability: {effect_text}

Write the image prompt."""

# ---------------------------------------------------------------------------
# HELPERS
# ---------------------------------------------------------------------------

def deterministic_seed(card_id: str) -> int:
    import hashlib
    return int(hashlib.sha256(card_id.encode()).hexdigest()[:8], 16)

def clean_prompt(text: str) -> str:
    """Strip quotes, newlines, leading labels if AI added any."""
    text = text.strip()
    if text.startswith('"') and text.endswith('"'):
        text = text[1:-1]
    if text.startswith("'") and text.endswith("'"):
        text = text[1:-1]
    # Remove common AI preambles
    for prefix in ["Prompt:", "Image prompt:", "Here is the prompt:", "Here's the prompt:"]:
        if text.lower().startswith(prefix.lower()):
            text = text[len(prefix):].strip()
    return text.replace("\n", " ").strip()

def generate_prompt_for_card(client: OpenAI, card: dict) -> dict:
    """Ask AI to write a prompt for this card."""
    user_msg = USER_TEMPLATE.format(
        name=card.get("name", "Unknown"),
        type=card.get("type", "Unknown"),
        rarity=card.get("rarity", "common"),
        effect_text=card.get("effect_text", ""),
    )
    
    resp = client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_msg},
        ],
        temperature=0.7,
        max_tokens=200,
    )
    
    prompt = clean_prompt(resp.choices[0].message.content)
    
    return {
        "id": card["id"],
        "name": card.get("name", ""),
        "type": card.get("type", ""),
        "rarity": card.get("rarity", ""),
        "archetype": card.get("archetype", ""),
        "effect_text": card.get("effect_text", ""),
        "prompt": prompt,
        "prompt_length": len(prompt),
        "seed": deterministic_seed(card["id"]),
        "canvas": CANVAS,
    }

# ---------------------------------------------------------------------------
# MAIN
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--test", type=int, help="Generate N random cards only (test mode)")
    parser.add_argument("--resume", action="store_true", help="Skip cards already generated")
    parser.add_argument("--full", action="store_true", help="Generate all 1000")
    args = parser.parse_args()
    
    if not (args.test or args.full):
        print("Specify --test N or --full")
        sys.exit(1)
    
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        print("ERROR: OPENAI_API_KEY not set.")
        print("Get one at https://platform.openai.com/api-keys")
        print("Then: $env:OPENAI_API_KEY = 'sk-...'  (PowerShell)")
        sys.exit(1)
    
    if not ALPHA_SET_DIR.exists():
        print(f"ERROR: {ALPHA_SET_DIR} not found. Run from voidexa repo root.")
        sys.exit(1)
    
    # Load all cards
    all_cards = []
    for i in range(1, 11):
        batch_file = ALPHA_SET_DIR / f"batch_{i:02d}.json"
        with open(batch_file, encoding="utf-8") as f:
            all_cards.extend(json.load(f))
    print(f"Loaded {len(all_cards)} cards")
    
    # Filter for test mode
    if args.test:
        import random
        rng = random.Random(42)
        # Sample across rarities
        by_rarity = {}
        for c in all_cards:
            by_rarity.setdefault(c.get("rarity", "common").lower(), []).append(c)
        sample = []
        per_rarity = max(1, args.test // len(by_rarity))
        for r, items in by_rarity.items():
            rng.shuffle(items)
            sample.extend(items[:per_rarity])
        all_cards = sample[:args.test]
        print(f"Test mode: generating for {len(all_cards)} cards")
    
    # Resume: skip already-done cards
    existing = []
    if args.resume and OUTPUT_FILE.exists():
        with open(OUTPUT_FILE) as f:
            existing = json.load(f)
        done_ids = {e["id"] for e in existing}
        all_cards = [c for c in all_cards if c["id"] not in done_ids]
        print(f"Resume mode: {len(done_ids)} done, {len(all_cards)} to do")
    
    client = OpenAI(api_key=api_key)
    results = list(existing)
    
    start = time.time()
    for i, card in enumerate(all_cards, 1):
        try:
            entry = generate_prompt_for_card(client, card)
            results.append(entry)
            print(f"[{i}/{len(all_cards)}] {card['id']} ({entry['prompt_length']} chars)")
        except Exception as e:
            print(f"[{i}/{len(all_cards)}] {card['id']} FAILED: {e}")
            results.append({
                "id": card["id"],
                "name": card.get("name", ""),
                "error": str(e),
            })
        
        # Persist every 10 cards
        if i % 10 == 0 or i == len(all_cards):
            with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
                json.dump(results, f, indent=2, ensure_ascii=False)
    
    elapsed = time.time() - start
    ok_count = sum(1 for r in results if "prompt" in r)
    fail_count = sum(1 for r in results if "error" in r)
    
    print()
    print(f"=== DONE ===")
    print(f"Generated: {ok_count}")
    print(f"Failed: {fail_count}")
    print(f"Time: {elapsed:.0f}s")
    print(f"Output: {OUTPUT_FILE}")
    
    # Build sample for review
    ok_results = [r for r in results if "prompt" in r]
    by_rarity = {"common": [], "uncommon": [], "rare": [], "epic": [], "legendary": [], "mythic": []}
    for r in ok_results:
        rar = r.get("rarity", "common").lower()
        if rar in by_rarity:
            by_rarity[rar].append(r)
    
    import random
    rng = random.Random(42)
    sample = []
    for rar, items in by_rarity.items():
        rng.shuffle(items)
        sample.extend(items[:5])
    
    with open(SAMPLE_FILE, "w", encoding="utf-8") as f:
        f.write("# Card Prompt Sample - AI-generated (GPT-4o-mini)\n\n")
        f.write(f"Generated by scripts/generate_ai_prompts.py\n")
        f.write(f"Natural-language prompts written by AI, one per card.\n\n")
        for r in sample:
            f.write(f"## {r['name']} - {r['type']} - {r['rarity']}\n\n")
            f.write(f"- id: `{r['id']}`\n")
            f.write(f"- ability: {r.get('effect_text', '')}\n")
            f.write(f"- length: {r['prompt_length']} chars\n\n")
            f.write(f"**Prompt:**\n\n```\n{r['prompt']}\n```\n\n---\n\n")
    
    print(f"Sample: {SAMPLE_FILE}")

if __name__ == "__main__":
    main()
