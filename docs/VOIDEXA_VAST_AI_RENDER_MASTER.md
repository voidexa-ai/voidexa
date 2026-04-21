# VOIDEXA VAST.AI API RENDERING PIPELINE — MASTER DESIGN DOCUMENT

**Purpose:** Build a fully automated, API-driven image generation pipeline on Vast.ai. Orchestrate from Jix's machine via Claude Code — no manual terminal, no web UI, no clicking through forms.

**Scope:** Render 1400 images total for voidexa alpha launch:
- 400 shop items (prompts in `docs/shop_alpha/shop_art_prompts.json`)
- 1000 cards (prompts in `docs/alpha_set/card_art_prompts.json`)

**Goal:** One command triggers lease → render → download → teardown. Jix never logs into Vast.ai again after initial setup.

---

# PART 1 — WHY THIS EXISTS

Jix currently renders on Vast.ai by logging into the website, selecting instances manually, running commands in the web terminal, babysitting the job, downloading files one by one. That's slow, error-prone, and doesn't scale to 1400 images.

Vast.ai provides a full REST API and a Python SDK (`vastai_sdk`). Everything the website does can be done programmatically. This master doc locks exactly how voidexa uses that API for rendering.

---

# PART 2 — WHAT'S NEEDED FROM JIX

## One-time setup (30 seconds, done once):

1. Log into https://cloud.vast.ai (last manual login ever)
2. Go to Account → API Keys → Generate new key
3. Copy the key
4. Paste into voidexa `.env.local`:
   ```
   VAST_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
5. Add `.env.local` to `.gitignore` if not already (it should be)

## One-time Vast.ai account setup:

1. Add credits via Stripe (recommend $30 starter — covers 1400 renders + buffer)
2. Add SSH public key to Vast.ai account (needed for direct instance access)
3. Note account ID for billing verification

That's it. All other interaction goes through API.

---

# PART 3 — PIPELINE ARCHITECTURE

```
┌─────────────────────┐
│ Jix runs command    │
│ in Claude Code      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Python orchestrator │  scripts/vast_render.py
│ (vastai_sdk)        │
└──────────┬──────────┘
           │
     ┌─────┼─────┐
     │           │
     ▼           ▼
┌─────────┐  ┌──────────┐
│ Vast.ai │  │ Supabase │
│ API     │  │ Storage  │
└────┬────┘  └────▲─────┘
     │            │
     ▼            │
┌─────────────────┴────┐
│ Rented GPU instance  │
│ ComfyUI + SDXL       │
│ Renders 1400 images  │
└──────────────────────┘
```

## Phases:

1. **Lease phase** — Search Vast.ai offers, pick cheapest suitable GPU, launch instance, wait for ready
2. **Setup phase** — Download SDXL model + ComfyUI workflow JSON to instance (first time only)
3. **Render phase** — Send prompts in batches via ComfyUI API, collect images
4. **Upload phase** — Push rendered images to Supabase Storage bucket
5. **Teardown phase** — Destroy instance (stops billing immediately)

---

# PART 4 — MODEL + TEMPLATE CHOICE

## Model: SDXL Base 1.0 + Juggernaut XL

**Why SDXL, not FLUX:**
- SDXL renders 3-4x faster than FLUX (critical for 1400 images)
- SDXL runs comfortably on 16GB VRAM (cheap GPUs)
- FLUX requires 24GB+ VRAM (expensive GPUs)
- Batch iteration speed matters more than per-image quality at alpha stage
- SDXL + Juggernaut XL checkpoint produces excellent sci-fi game art

**Model files needed:**
- `sd_xl_base_1.0.safetensors` (base SDXL)
- `juggernautXL_v9.safetensors` (fine-tuned checkpoint for higher quality)
- `sdxl_vae.safetensors` (VAE for color accuracy)

All downloadable from HuggingFace during instance setup.

## ComfyUI template on Vast.ai:

Template ID: Use Vast.ai's official "ComfyUI + FLUX.1" template and swap the model. OR use the official "Stable Diffusion XL Base 1.0" model library template.

Docker image: `runpod/stable-diffusion:comfyui-latest` (verified working).

---

# PART 5 — GPU SELECTION STRATEGY

## Target GPU profile:

- H100 SXM (80GB VRAM) — maximum speed for batch rendering
- Bandwidth > 500 Mbps (for downloading models and uploading results)
- Reliability score ≥ 0.95 (minimize interruption risk)
- Price ≤ $3.00/hour (budget ceiling for H100 tier)

## GPU selection: H100

**Jix-locked choice.** Speed prioritized over cost savings. SDXL on H100 runs at maximum hardware throughput.

**Secondary fallback** (if H100 unavailable at reasonable price):
- RTX 4090 (24GB VRAM, ~$0.45-0.60/hr) — 3-4x slower than H100 but still fast
- RTX 3090 (24GB VRAM, ~$0.25-0.35/hr) — slowest acceptable tier

Script searches H100 first, falls back to 4090 only if no H100 available under $3/hr.

## Interruptible vs On-Demand:

- Use **ON-DEMAND** for this project. The batch must finish. Interruptible can get reclaimed mid-render, wasting partial work.

## Estimated render time per image:

- SDXL 768x1024 on H100: ~1.2-1.5 seconds
- SDXL 1024x1024 on H100: ~2-2.5 seconds
- SDXL 1536x1024 on H100: ~3-4 seconds

## Total batch estimates on H100:

- 1000 cards @ 768x1024 × 1.3s = ~22 minutes render time
- 400 shop items mixed canvases avg 2s = ~13 minutes render time
- + model download (first run only): 5-8 minutes (faster network on H100 hosts)
- + mythic 2x render time buffer: 3 minutes
- **Total first run: ~45-55 minutes** including setup
- **Total cost estimate on H100 @ $2.50/hr: ~$2.00-2.50**

These estimates are conservative. Actual cost likely between $1.50-3.00. Well within Jix's $7.99 Vast.ai balance.

---

# PART 6 — ORCHESTRATOR SCRIPT SPECIFICATION

## File: `scripts/vast_render.py`

## Dependencies:
```
pip install vastai-sdk supabase python-dotenv pillow tqdm
```

## Command-line interface:

```
python scripts/vast_render.py --source <shop|cards|both> --test <N> [--gpu RTX_3090]
```

Examples:
- `python scripts/vast_render.py --source shop --test 5` — render 5 shop items as preview
- `python scripts/vast_render.py --source cards --test 10` — render 10 random cards as preview
- `python scripts/vast_render.py --source both --test 0` — render all 1400 (test=0 means full batch)

## Script behavior:

### Phase 1: Pre-flight checks
- Verify `VAST_API_KEY` exists in env
- Verify prompt JSON files exist and are valid
- Verify Supabase credentials
- If test mode: select N random prompts from source; if full: use all
- Display cost estimate and prompt Jix: "Estimated cost $X.XX on [GPU]. Proceed? (y/n)"
- Block on user confirmation

### Phase 2: Lease instance
- Search Vast.ai offers matching GPU profile (Part 5)
- Filter by reliability ≥ 0.95, price ≤ ceiling, on-demand
- Sort by price ascending
- Lease cheapest matching offer
- Wait for instance status = "running" (poll every 10 seconds, max 5 min timeout)
- If lease fails, try next cheapest; up to 3 retries

### Phase 3: Setup instance
- SSH into instance (SSH key was added in Part 2)
- Check if SDXL model + Juggernaut XL already cached on disk
- If not, download models from HuggingFace (15-20 min first time)
- Start ComfyUI server in background
- Verify ComfyUI API accessible on port 8188
- Upload the standard voidexa ComfyUI workflow JSON (see Part 7)

### Phase 4: Render batch
- For each prompt in source list:
    - POST to ComfyUI API with prompt + seed + canvas
    - Poll for completion (ComfyUI returns job ID)
    - Download result PNG from instance to local temp dir
    - Name file: `{item_id}.png`
    - Log render time + any errors
- Handle errors:
    - If ComfyUI crashes → restart it, retry failed prompt once
    - If instance becomes unreachable → destroy and re-lease, resume from last completed
    - If 10+ consecutive failures → halt, report to Jix

### Phase 5: Upload to Supabase
- Connect to Supabase using env vars
- Upload all rendered PNGs to bucket:
    - Shop items → bucket `shop-art/`
    - Cards → bucket `card-art/`
- Verify each upload succeeded (get public URL back)
- Save upload manifest to `docs/alpha_set/render_manifest.json` or `docs/shop_alpha/render_manifest.json`:
    ```json
    {
      "item_id": "weapon_crimson_fang",
      "rendered_at": "2026-04-19T...",
      "seed": 847293,
      "render_seconds": 4.2,
      "supabase_url": "https://.../card-art/weapon_crimson_fang.png",
      "canvas": "768x1024"
    }
    ```

### Phase 6: Teardown
- Destroy Vast.ai instance via API
- Verify instance is destroyed (no more billing)
- Report to Jix:
    - Total rendered
    - Total failed
    - Total cost charged
    - Total duration
    - Supabase bucket URLs
- Commit manifest to git: `feat(render): [source] batch complete — [N] images rendered`
- STOP — do NOT auto-start next phase

---

# PART 7 — COMFYUI WORKFLOW JSON

## Workflow template: `scripts/voidexa_sdxl_workflow.json`

Standard 7-node SDXL pipeline:
1. CheckpointLoaderSimple → loads Juggernaut XL
2. CLIPTextEncode (positive) → our prompt_positive
3. CLIPTextEncode (negative) → our prompt_negative
4. EmptyLatentImage → canvas from prompt (768x1024 for cards, variable for shop)
5. KSampler → steps=30, cfg=5.0, sampler=dpmpp_2m, scheduler=karras, seed from prompt
6. VAEDecode → decode latent to image
7. SaveImage → output to /workspace/output/

Workflow JSON is static; only the inputs (prompt text, seed, canvas) change per render. Python orchestrator builds the API payload by substituting these fields into the template.

---

# PART 8 — TEST-BATCH PROTOCOL

## Mandatory before full 1400-item render:

### Test 1: 10 diverse shop items
- 2 common, 2 uncommon, 2 rare, 2 epic, 1 legendary, 1 mythic
- Mix of categories (ship_skin, card_back, battle_board, bundle)
- Render, download, visual inspection by Jix
- If Jix approves → continue to Test 2
- If Jix rejects → adjust prompt master doc, regenerate prompts, re-test

### Test 2: 10 diverse cards
- Same distribution across rarity and type
- Must include: 1 Ship Core (verify heraldic emblem renders), 1 AI Routine (verify holographic), 1 Field (verify environmental)
- Render, download, visual inspection by Jix
- If Jix approves → continue to full batch
- If Jix rejects → adjust card prompt master doc, regenerate prompts, re-test

### Only after both tests pass does the full 1400-item batch run.

---

# PART 9 — SUPABASE STORAGE STRUCTURE

## Buckets:

```
supabase://voidexa-assets/
  ├── shop-art/
  │   ├── common/
  │   ├── uncommon/
  │   ├── rare/
  │   ├── epic/
  │   ├── legendary/
  │   └── mythic/
  └── card-art/
      ├── common/
      ├── uncommon/
      ├── rare/
      ├── epic/
      ├── legendary/
      └── mythic/
```

## File naming:
- Shop: `{item_id}.png` (e.g., `skin_crimson_fighter.png`)
- Cards: `{card_id}.png` (e.g., `weapon_crimson_fang.png`)

## Storage bucket permissions:
- Read: public (images served directly in game/shop UI)
- Write: authenticated (only orchestrator can upload)

## Row-level security on asset metadata:
Store render manifest in Supabase table `asset_renders` for game/UI to query:
```sql
CREATE TABLE asset_renders (
  item_id TEXT PRIMARY KEY,
  asset_type TEXT CHECK (asset_type IN ('shop','card')),
  rarity TEXT,
  public_url TEXT,
  rendered_at TIMESTAMPTZ,
  seed BIGINT,
  render_seconds NUMERIC
);
```

---

# PART 10 — ERROR HANDLING + RESUMABILITY

## Resumability:

Orchestrator maintains `scripts/.render_state.json`:
```json
{
  "source": "cards",
  "started_at": "2026-04-19T...",
  "completed": ["card_id_1", "card_id_2", ...],
  "failed": [{"id": "card_id_3", "error": "ComfyUI timeout"}],
  "current_instance_id": 12345
}
```

If script crashes or user stops it, re-running with same args resumes from `completed` list — never re-renders already-done items.

## Retry logic per prompt:
- First failure: retry once with same seed
- Second failure: retry with seed+1 (sometimes specific seeds hang SDXL)
- Third failure: log to `failed`, continue with next prompt

## Budget circuit-breaker:
- Track running cost every 5 minutes
- If cost > 3x estimate OR duration > 2x estimate → halt, report to Jix
- Prevents runaway spending

## Instance health check:
- Ping ComfyUI every 60 seconds during render
- If unresponsive for 5 minutes → destroy instance, re-lease, resume from last completed

---

# PART 11 — SECURITY

## Credentials:
- `VAST_API_KEY` → env var only, never logged, never committed
- `SUPABASE_SERVICE_ROLE_KEY` → env var only (service role needed for bucket write)
- SSH private key → stays on Jix's machine, never uploaded
- All API calls use HTTPS only

## Prompt safety:
- Negative prompt in both master docs already blocks human faces, realistic photography, text
- Orchestrator does NOT modify user prompts before sending — raw prompt from JSON → ComfyUI
- If a prompt triggers Vast.ai content policy, log and skip that item

## Instance isolation:
- Each render batch uses a fresh instance (no persistent state between batches)
- Instance destroyed at end of batch — no orphaned workloads billing in background

---

# PART 12 — COST MONITORING

## Real-time cost tracking:

Orchestrator logs per-minute:
- Instance hourly rate (from Vast.ai offer)
- Minutes elapsed
- Running total
- Estimated remaining based on completion %

Output to console every 5 minutes:
```
[12:34] Progress: 450/1000 cards  |  Instance: RTX_3090 @ $0.24/hr  |  Elapsed: 38 min  |  Spent: $0.15  |  ETA: 42 min  |  Est. total: $0.32
```

## Hard limits (configurable in script):
- Max budget per batch: $15 (aborts if exceeded — raised from $10 to accommodate H100 pricing safely)
- Max duration per batch: 4 hours (aborts if exceeded)
- Max GPU rate: $3.00/hr (H100 tier ceiling)

---

# PART 13 — EXECUTION FLOW (HAPPY PATH)

```
$ cd C:\Users\Jixwu\Desktop\voidexa
$ claude --dangerously-skip-permissions

[In Box 2]
Run vast_render test batch for 10 shop items.
Use scripts/vast_render.py with --source shop --test 10 --gpu H100_SXM.

[Claude Code executes]
> python scripts/vast_render.py --source shop --test 10 --gpu H100_SXM
> [Pre-flight OK]
> [Estimated cost: $0.35 — 8 minutes on H100]
> [Proceed? y/n]: y
> [Leasing offer 123456 @ $2.50/hr]
> [Instance live in 30s]
> [Downloading SDXL models... 6 min]
> [Rendering prompt 1/10: skin_crimson_fighter] OK 1.4s
> [Rendering prompt 2/10: trail_phoenix_wings] OK 2.1s
> ...
> [All 10 rendered, uploading to Supabase...]
> [10 uploads successful]
> [Destroying instance]
> [DONE — 8 min total, $0.33 spent]
> [Preview URLs in docs/shop_alpha/test_batch_preview.md]

[Jix reviews images]
[If approved]
> python scripts/vast_render.py --source both --test 0 --gpu H100_SXM
[Full 1400-image render begins — est. 50 min, $2.10]
```

---

# PART 14 — DELIVERABLES

Files Claude Code produces this sprint:
- `scripts/vast_render.py` — main orchestrator
- `scripts/voidexa_sdxl_workflow.json` — ComfyUI workflow template
- `scripts/render_config.yaml` — GPU preferences, budget limits, retry counts
- `.env.local.example` — documents required env vars (no real secrets)
- `docs/alpha_set/VAST_AI_RENDER_README.md` — operator guide for Jix
- `supabase/migrations/asset_renders_table.sql` — creates the asset_renders table

Files created at render time (not in this sprint):
- Rendered PNGs (stored on Vast.ai then uploaded to Supabase)
- `docs/shop_alpha/shop_render_manifest.json`
- `docs/alpha_set/card_render_manifest.json`

---

# PART 15 — CLAUDE CODE EXECUTION PROTOCOL

## This is a BUILD sprint, not a render sprint.

This sprint builds the pipeline scripts. Running the pipeline is a later action.

## Steps Claude Code performs:

1. Read this master doc completely
2. Read `.gitignore` — verify `.env.local` is excluded
3. Install Python dependencies locally: `pip install vastai-sdk supabase python-dotenv pillow tqdm`
4. Build `scripts/vast_render.py` implementing Parts 6, 8, 10, 11, 12
5. Build `scripts/voidexa_sdxl_workflow.json` per Part 7
6. Build `scripts/render_config.yaml` per Part 11 defaults
7. Build `.env.local.example` per Part 2
8. Build `docs/alpha_set/VAST_AI_RENDER_README.md` per Part 13 with copy-paste-ready commands for Jix
9. Build `supabase/migrations/asset_renders_table.sql` per Part 9
10. Run a dry-run mode: `python scripts/vast_render.py --dry-run` — should print all phases without making API calls
11. Commit on main: "feat(render): Vast.ai API orchestration pipeline for 1400 images"
12. STOP — do NOT lease any instance, do NOT start rendering
13. Report what was built + next command for Jix to actually start test batch

## Validation Claude Code runs before reporting success:
- `scripts/vast_render.py` passes `python -m py_compile`
- `scripts/voidexa_sdxl_workflow.json` is valid JSON
- Dry-run completes all phases without errors
- README has correct copy-paste commands for the 3 test scenarios (test shop 10, test cards 10, full both)

---

# PART 16 — NON-NEGOTIABLE RULES

1. NEVER commit API keys or credentials to git
2. NEVER skip the test batch phase — full 1400 render only after both test batches approved
3. NEVER lease instances during build sprint — this sprint only builds scripts
4. NEVER use Interruptible instances for voidexa renders
5. NEVER modify prompts from the JSON files before sending to ComfyUI
6. ALWAYS destroy instance at end of batch (billing stops instantly)
7. ALWAYS commit render manifest after batch completes
8. ALWAYS respect the $10 budget hard cap per batch
9. If anything unexpected happens during render (ComfyUI hang, SSH failure, API timeout), STOP and report to Jix — do not "fix" by leasing another instance without permission

---

# PART 17 — POST-RENDER FLOW

After successful 1400-image render:

1. Frontend developers (Jix + Claude Code) update game UI and shop UI to read from Supabase bucket URLs
2. Asset manifest powers lookup: `item_id → public_url`
3. Assets load on-demand in game/shop — no bulk preload
4. Low-rarity assets eligible for CDN caching; mythic assets always fresh
5. Any re-render for quality improvement is a separate sprint using the same pipeline (just rerun with same prompt files)

---

**End of master document.**
