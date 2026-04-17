---
name: sprint-10-baseline-art-handoff
description: SKIPPED in autonomous run — 26 baseline card art renders are owned by Jix on Vast.ai
sprint: 10
status: skipped
---

## Why skipped
GPU-rendered baseline art (26 cards lacking Suno-source visuals) requires Stable
Diffusion XL on Vast.ai with the `docs/card_art_prompts.json` prompt set. This is a
Jix-owned task and out of scope for the Claude Code autonomous chain.

## Handoff brief
Inputs ready for Jix's Vast.ai run:
- `docs/card_art_prompts.json` (untracked but present) — prompt seeds per card.
- `docs/GPT_CARD_ART_PROMPT_GENERATOR.md` — generator notes.
- `docs/card_art_v2.zip` — prior render pack (reference).
- `assets/card-frames/` (untracked) — 6 rarity frames + clean variants.

## Output expected from Jix
- 26 PNGs at 1024×1024 in `assets/card-art/baseline/`.
- Drop into `scripts/render_cards.py` pipeline (already present, untracked) to
  composite frame + art + keywords.
- Final renders land in `public/images/cards/`.

## When complete
Tag `sprint-10-complete` and update `docs/POWER_PLAN.md` table. No code changes
expected from this sprint other than the asset drop.
