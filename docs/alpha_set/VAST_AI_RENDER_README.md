# Vast.ai Render Orchestrator — Operator Guide

One-command rendering of voidexa's 400 shop items + 1000 cards on Vast.ai H100
instances. Implements `docs/VOIDEXA_VAST_AI_RENDER_MASTER.md` Parts 6–13.

> Build state: orchestration scripts are scaffolded and pass a full
> `--dry-run`. The ComfyUI HTTP path and SSH wiring are stubbed with
> clearly-marked hooks so a later sprint can enable live rendering without
> reshaping the pipeline.

## 0. One-time setup

```bash
# 1. Vast.ai
#    - cloud.vast.ai -> Account -> API Keys -> generate
#    - Account -> SSH Keys -> paste ~/.ssh/id_ed25519.pub
#    - Billing -> top up (recommend $30)

# 2. Copy env template and fill
cp .env.local.example .env.local
#    Edit: VAST_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, VAST_SSH_PUBLIC_KEY_PATH

# 3. Apply the manifest table once
#    (via Supabase SQL editor or `supabase db push` if linked)
cat supabase/migrations/asset_renders_table.sql

# 4. Verify Python deps
pip install vastai-sdk supabase python-dotenv pillow tqdm pyyaml paramiko requests
```

## 1. Dry-run (no API calls, always safe)

```bash
python scripts/vast_render.py --source both --test 0 --dry-run --yes
```

Prints every phase it would take (pre-flight, lease, setup, render, upload,
teardown), loads 1400 prompts from disk, costs the batch, but never touches
Vast.ai or Supabase. Use this to verify wiring after any config change.

## 2. Test batch — 10 shop items

```bash
python scripts/vast_render.py --source shop --test 10 --gpu H100_SXM
```

Mandated by master doc Part 8 before any full render. Stratified pick:
2 common / 2 uncommon / 2 rare / 2 epic / 1 legendary / 1 mythic, diversified
by `category`. Review the uploaded PNGs before the next step.

## 3. Test batch — 10 cards

```bash
python scripts/vast_render.py --source cards --test 10 --gpu H100_SXM
```

Same rarity spread. Automatically forces one Ship Core, one AI Routine, one
Field to verify Parts 12A–12C rendering rules.

## 4. Full batch — 1400 images

```bash
python scripts/vast_render.py --source both --test 0 --gpu H100_SXM
```

Only run this after both test batches above are approved. Approx 50–55 minutes
on a single H100 @ $2.50/hr (≈ $2.00–2.50 total). Mythics auto-render at 2x
time. Budget cap enforced: hard halt at $15.

## Flags

| Flag | Default | Effect |
|---|---|---|
| `--source {shop,cards,both}` | `cards` | Which prompt file(s) to render |
| `--test N` | `0` (full) | Stratified preview of N prompts |
| `--gpu <profile>` | `render_config.yaml: default_gpu` | H100_SXM, H100, RTX_4090, RTX_3090 |
| `--dry-run` | off | Simulate all phases, no network |
| `--yes` | off | Skip interactive cost confirmation |

## Resuming after a crash

`scripts/.render_state.json` tracks completed + failed ids per source. Re-run
the same command — already-done prompts are skipped; only missing ones render.
Delete the state file to force a fresh start.

## Safety features (enforced by the orchestrator)

- **Budget circuit-breaker** — halt if spend exceeds `limits.max_budget_usd`
  ($15) or duration exceeds `limits.max_duration_hours` (4h).
- **Consecutive-failure halt** — stop after 10 failures in a row so a broken
  prompt or a sick instance can't burn the budget.
- **Instance destroyed at end** — both success and failure paths call
  `destroy_instance`. Billing stops instantly on destroy.
- **On-demand only** — config hard-wires `instance_type: on-demand`.
  Interruptible offers are never picked (master doc rule).
- **Prompts are never mutated** — the positive/negative text read from the
  JSON is sent verbatim to ComfyUI.

## Cost telemetry

Every 5 minutes during the render phase the orchestrator prints:

```
[cost] 450/1000  $0.15  elapsed 38.0min
```

and the final teardown block prints the estimated charge. Reconcile the
number against your Vast.ai dashboard — budget cap is soft upper bound, the
dashboard is ground truth.

## Outputs written per batch

- `docs/alpha_set/card_render_manifest.json` — per-card render metadata +
  Supabase public URLs
- `docs/shop_alpha/shop_render_manifest.json` — same for shop items
- `scripts/.render_state.json` — resumable progress
- Supabase Storage bucket `voidexa-assets/{shop-art,card-art}/<rarity>/<id>.png`
- Supabase table `public.asset_renders` — one row per PNG

## Troubleshooting

- **`no Vast.ai offers matched`** — widen `offer_filters` in
  `scripts/render_config.yaml` (raise `dph_max`, lower `min_reliability`, or
  fall back to `RTX_4090`).
- **Pre-flight FAIL: VAST_API_KEY** — your `.env.local` isn't being loaded.
  Make sure it lives at the repo root and contains `VAST_API_KEY=...`.
- **Pre-flight FAIL: supabase keys** — service-role key is required for bucket
  writes. Copy from Supabase project settings > API.
- **ComfyUI HTTP path `NotImplementedError`** — expected in build-sprint
  state. Render-time sprint wires the HTTP submit+poll against the running
  instance.

## Render-time paths now wired

- `setup_instance` — SSHes in via paramiko with the key derived from
  `VAST_SSH_PUBLIC_KEY_PATH`, `wget -c`s SDXL + Juggernaut XL + VAE into
  `/workspace/ComfyUI/models/`, launches ComfyUI with `nohup` on port 8188,
  and polls `GET /queue` until 200 OK (or 5-min timeout).
- `_submit_comfyui_job` — deep-copies the workflow template, injects the
  prompt/seed/canvas/checkpoint, POSTs `/prompt` with a per-run `client_id`,
  polls `/history/{prompt_id}` every 2 s, and downloads the PNG via
  `/view` into `scripts/.voidexa_render_cache/{shop,card}/`.
- `upload_results` — `supabase-py` path, uploads each PNG to
  `voidexa-assets/{shop-art,card-art}/<rarity>/<id>.png` and captures the
  public URL for the manifest.
- `teardown` — `VastAI.destroy_instance` on both success and failure.

Dry-run short-circuits every network call. `--dry-run` still walks the
workflow-build step inside `_submit_comfyui_job` so the JSON template path
gets exercised without touching HTTP or SSH.
