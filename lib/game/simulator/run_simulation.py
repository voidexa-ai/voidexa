"""
lib/game/simulator/run_simulation.py — Runs the voidexa card balance simulator at scale.

Loads all 222 cards from three JSON sources, runs:
  - 10,000 matches with random deck pairings
  - 1,000 matches with hill-climbing "best deck" search
    (start random, swap one card, keep if win rate improves, 50 iterations)
Saves results to lib/game/simulator/results.json for report.py.
"""

import json
import os
import random
import time
from collections import Counter, defaultdict
from dataclasses import asdict
from pathlib import Path

from engine import (
    build_deck,
    estimate_card_value,
    simulate_match,
)

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------

SCRIPT_DIR = Path(__file__).resolve().parent
CARDS_DIR = SCRIPT_DIR.parent / "cards"
RESULTS_PATH = SCRIPT_DIR / "results.json"

# ---------------------------------------------------------------------------
# Load all cards
# ---------------------------------------------------------------------------

def load_all_cards() -> list[dict]:
    """Load baseline + expansion_set_1 + full_card_library JSON files."""
    pool: list[dict] = []

    for filename in ("baseline.json", "expansion_set_1.json", "full_card_library.json"):
        path = CARDS_DIR / filename
        if path.exists():
            with open(path, "r", encoding="utf-8") as f:
                cards = json.load(f)
                pool.extend(cards)
                print(f"  Loaded {len(cards):>4} cards from {filename}")
        else:
            print(f"  WARNING: {filename} not found at {path}")

    # Deduplicate by id (baseline may overlap with expansion)
    seen: dict[str, dict] = {}
    for c in pool:
        cid = c["id"]
        if cid not in seen:
            seen[cid] = c
        # if duplicate id, keep first (baseline takes priority)

    unique = list(seen.values())
    print(f"  Total unique cards: {len(unique)}")
    return unique


# ---------------------------------------------------------------------------
# Random match phase (10K matches)
# ---------------------------------------------------------------------------

def run_random_matches(
    card_pool: list[dict],
    num_matches: int = 10_000,
    seed: int = 42,
) -> list[dict]:
    """Run num_matches with random decks. Returns list of match result dicts."""
    rng = random.Random(seed)
    results = []

    t0 = time.time()
    for i in range(num_matches):
        deck0 = build_deck(card_pool, rng)
        deck1 = build_deck(card_pool, rng)
        res = simulate_match(deck0, deck1, rng)
        results.append(asdict(res))

        if (i + 1) % 2000 == 0:
            elapsed = time.time() - t0
            rate = (i + 1) / elapsed
            print(f"  Random: {i+1:>6}/{num_matches}  ({rate:.0f} matches/s)")

    elapsed = time.time() - t0
    print(f"  Random phase done: {num_matches} matches in {elapsed:.1f}s "
          f"({num_matches/elapsed:.0f} matches/s)")
    return results


# ---------------------------------------------------------------------------
# Hill-climbing phase (1K matches)
# ---------------------------------------------------------------------------

def evaluate_deck(
    deck_cards: list[dict],
    card_pool: list[dict],
    rng: random.Random,
    num_eval: int = 10,
) -> float:
    """Win rate of deck_cards over num_eval matches vs random opponents."""
    wins = 0
    for _ in range(num_eval):
        opp_deck = build_deck(card_pool, rng)
        res = simulate_match(list(deck_cards), opp_deck, rng)
        if res.winner == 0:
            wins += 1
        elif res.winner == -1:
            wins += 0.5
    return wins / num_eval


def hill_climb_deck(
    card_pool: list[dict],
    rng: random.Random,
    iterations: int = 50,
    eval_matches: int = 10,
) -> tuple[list[dict], float]:
    """Start with random deck, swap one card per iteration, keep if win rate improves."""
    current_deck = build_deck(card_pool, rng)
    current_wr = evaluate_deck(current_deck, card_pool, rng, eval_matches)

    for _ in range(iterations):
        # Pick a random slot to swap
        slot = rng.randint(0, len(current_deck) - 1)
        old_card = current_deck[slot]

        # Pick a replacement card that respects rarity limits
        candidate = rng.choice(card_pool)
        trial_deck = current_deck[:]
        trial_deck[slot] = dict(candidate)

        # Quick rarity check
        rarities = Counter(c.get("rarity", "common") for c in trial_deck)
        if rarities.get("legendary", 0) > 1:
            continue
        if rarities.get("mythic", 0) > 1:
            continue
        if rarities.get("rare", 0) > 3:
            continue

        id_counts = Counter(c["id"] for c in trial_deck)
        if any(v > 2 for v in id_counts.values()):
            continue

        trial_wr = evaluate_deck(trial_deck, card_pool, rng, eval_matches)
        if trial_wr >= current_wr:
            current_deck = trial_deck
            current_wr = trial_wr

    return current_deck, current_wr


def run_hill_climbing(
    card_pool: list[dict],
    num_climbs: int = 100,
    matches_per_climb: int = 10,
    seed: int = 12345,
) -> tuple[list[dict], list[dict]]:
    """
    Run num_climbs hill-climbing sessions. Each produces a 'best deck'.
    Then pit top decks against random opponents for final 1K match results.
    Returns (climb_results_meta, match_results).
    """
    rng = random.Random(seed)

    climb_meta: list[dict] = []
    best_decks: list[tuple[list[dict], float]] = []

    t0 = time.time()
    for i in range(num_climbs):
        deck, wr = hill_climb_deck(card_pool, rng, iterations=50, eval_matches=10)
        best_decks.append((deck, wr))
        climb_meta.append({
            "climb_id": i,
            "win_rate": round(wr, 3),
            "deck_ids": [c["id"] for c in deck],
        })

        if (i + 1) % 20 == 0:
            elapsed = time.time() - t0
            print(f"  Hill-climb: {i+1:>4}/{num_climbs}  ({elapsed:.1f}s elapsed)")

    # Sort by win rate, take top 10 decks
    best_decks.sort(key=lambda x: x[1], reverse=True)
    top_decks = best_decks[:10]

    print(f"  Top 10 deck win rates: {[round(wr, 3) for _, wr in top_decks]}")

    # Run 1K matches with these top decks vs random opponents
    match_results: list[dict] = []
    for deck, wr in top_decks:
        for _ in range(matches_per_climb):
            opp = build_deck(card_pool, rng)
            res = simulate_match(list(deck), opp, rng)
            rd = asdict(res)
            rd["optimized_deck"] = True
            match_results.append(rd)

    elapsed = time.time() - t0
    print(f"  Hill-climb phase done: {num_climbs} climbs + {len(match_results)} "
          f"matches in {elapsed:.1f}s")

    return climb_meta, match_results


# ---------------------------------------------------------------------------
# Per-card statistics aggregation
# ---------------------------------------------------------------------------

def aggregate_card_stats(
    card_pool: list[dict],
    all_results: list[dict],
) -> dict:
    """
    Compute per-card metrics: inclusion rate, play rate, win rate when included,
    average damage contribution.
    """
    card_ids = {c["id"] for c in card_pool}
    card_meta = {c["id"]: c for c in card_pool}

    # Count appearances in decks and wins
    deck_appearances: Counter = Counter()
    deck_wins: Counter = Counter()
    play_counts: Counter = Counter()
    total_matches = len(all_results)

    for r in all_results:
        winner = r["winner"]
        for idx, (deck_key, played_key) in enumerate([
            ("p0_deck_ids", "p0_cards_played"),
            ("p1_deck_ids", "p1_cards_played"),
        ]):
            deck_ids = set(r[deck_key])
            played_ids = r[played_key]

            for cid in deck_ids:
                deck_appearances[cid] += 1
                if winner == idx:
                    deck_wins[cid] += 1

            for cid in played_ids:
                play_counts[cid] += 1

    per_card: dict[str, dict] = {}
    for cid in card_ids:
        appearances = deck_appearances.get(cid, 0)
        wins = deck_wins.get(cid, 0)
        plays = play_counts.get(cid, 0)
        meta = card_meta.get(cid, {})

        per_card[cid] = {
            "id": cid,
            "name": meta.get("name", cid),
            "type": meta.get("type", "?"),
            "rarity": meta.get("rarity", "?"),
            "cost": meta.get("cost", 0),
            "deck_inclusion_rate": round(appearances / max(total_matches * 2, 1), 4),
            "play_rate": round(plays / max(total_matches * 2, 1), 4),
            "win_rate": round(wins / max(appearances, 1), 4),
            "total_appearances": appearances,
            "total_wins": wins,
            "total_plays": plays,
        }

    return per_card


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    print("=" * 60)
    print("VOIDEXA CARD BALANCE SIMULATOR")
    print("=" * 60)

    t_start = time.time()

    print("\n[1/4] Loading card pool...")
    card_pool = load_all_cards()
    if not card_pool:
        print("ERROR: No cards loaded. Check JSON files in lib/game/cards/")
        return

    print(f"\n[2/4] Running 10,000 random matches...")
    random_results = run_random_matches(card_pool, num_matches=10_000, seed=42)

    print(f"\n[3/4] Running hill-climbing optimization (100 climbs × 50 iterations)...")
    climb_meta, hill_results = run_hill_climbing(
        card_pool, num_climbs=100, matches_per_climb=10, seed=12345,
    )

    print(f"\n[4/4] Aggregating card statistics...")
    all_results = random_results + hill_results
    per_card = aggregate_card_stats(card_pool, all_results)

    # Summary stats
    random_winners = Counter(r["winner"] for r in random_results)
    random_turns = [r["turns"] for r in random_results]
    random_draws = random_winners.get(-1, 0)
    hill_winners = Counter(r["winner"] for r in hill_results)

    summary = {
        "total_cards": len(card_pool),
        "random_matches": len(random_results),
        "hill_matches": len(hill_results),
        "random_p0_wins": random_winners.get(0, 0),
        "random_p1_wins": random_winners.get(1, 0),
        "random_draws": random_draws,
        "random_avg_turns": round(sum(random_turns) / max(len(random_turns), 1), 2),
        "random_median_turns": sorted(random_turns)[len(random_turns) // 2] if random_turns else 0,
        "hill_optimized_wins": hill_winners.get(0, 0),
        "hill_opponent_wins": hill_winners.get(1, 0),
        "hill_draws": hill_winners.get(-1, 0),
    }

    # Rarity distribution in pool
    rarity_dist = Counter(c.get("rarity", "?") for c in card_pool)
    type_dist = Counter(c.get("type", "?") for c in card_pool)

    output = {
        "summary": summary,
        "rarity_distribution": dict(rarity_dist),
        "type_distribution": dict(type_dist),
        "per_card": per_card,
        "climb_meta": climb_meta,
        "random_sample": random_results[:50],  # first 50 for debugging
        "hill_sample": hill_results[:50],
    }

    with open(RESULTS_PATH, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2, default=str)

    elapsed = time.time() - t_start
    print(f"\n{'=' * 60}")
    print(f"DONE in {elapsed:.1f}s")
    print(f"Results saved to: {RESULTS_PATH}")
    print(f"Summary: {summary}")
    print(f"{'=' * 60}")


if __name__ == "__main__":
    main()
