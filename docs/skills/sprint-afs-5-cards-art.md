# SPRINT AFS-5 — 1000 ALPHA CARDS ART + DEPLOY
## Skill file for Claude Code
## Location: docs/skills/sprint-afs-5-cards-art.md

---

## SCOPE

Replace the existing 257 V3 card system on voidexa.com/cards with the 1000-card Alpha Set (commit `b47053e` already on local main, not yet pushed to origin).

Generate personalized art for each of the 1000 cards using Google Imagen 4 API where each prompt is built from the specific card's data (name, type, ability, effect_text, keywords, flavor_text, archetype, target subsystem) so the image visualizes what the card actually does — not generic sci-fi stock art.

Composite frame + art + text into final card PNGs using existing Pillow pipeline (clean_frames.py + render_cards_v3.py logic, adapted for 9 card types and 6 rarities).

Wire `/cards` page to display 1000 cards from the alpha catalog.

The 257 V3 system is fully replaced. No 257 cards remain on the site after this sprint.

---

## CONTEXT

### What exists now
- `docs/alpha_set/batch_01.json` through `batch_10.json` — 1000 cards, 15 fields each, validated clean
- `docs/alpha_set/MASTER_INDEX.md` + `VALIDATION_LOG.md`
- `docs/alpha_set/card_art_prompts.json` — 1000 generic prompts (will be REPLACED by personalized prompts in this sprint)
- `public/card-frames-clean/` — 6 PNG frames (common, uncommon, rare, epic, legendary, mythic) with placeholder text inpainted out
- `scripts/render_cards_v3.py` — Pillow compositor (frame + art + text), works for 6 card types
- `scripts/clean_frames.py` — frame inpainting tool

### What gets replaced
- 257 V3 cards → 1000 Alpha cards
- Old generic prompts → 1000 personalized prompts
- Old `public/cards/composed/` (257 PNGs) → new 1000 PNGs
- `lib/cards/full_library.ts` adapter → points to alpha set

### Card data structure (15 fields)
```
id, name, type, rarity, energy_cost, attack, defense,
effect_text, keywords, flavor_text, archetype,
subsystem_target, escalation, dual_identity, cargo
```

### Card types (9)
Weapon, Defense, Drone, AI Routine, Module, Maneuver, Equipment, Field, Ship Core

### Rarity distribution (1000 total)
Common 400 / Uncommon 280 / Rare 160 / Epic 90 / Legendary 50 / Mythic 20

### Archetypes (6)
aggro, control, midrange, combo, ramp, utility

---

## API ACCESS

- Google AI Studio API key (Jix has billing set up, prepaid >= $10)
- Model: `imagen-4.0-generate-001` (standard quality, $0.04/image baseline)
- Endpoint: `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:generateImage`
- Output: 2K resolution (2048x2048) for high-res renders
- Watermark: SynthID (invisible) only — no visible watermark on paid tier

### Test phase first
Generate 30 cards (5 per rarity) → review with Jix → adjust prompts if needed → only proceed to full 1000 batch after explicit Jix approval.

---

## TASKS

### Task 1: Personalized prompt builder
**File:** `scripts/build_personalized_card_prompts.py` (NEW)

Read all 10 batch JSONs → for each card, build a unique prompt using this template:

```python
def build_prompt(card):
    # Subject inference based on type + name + effect
    subject = infer_subject(card)
    
    # Action inference based on effect_text + keywords
    action = infer_action(card)
    
    # Target inference based on subsystem_target
    target = infer_target(card)
    
    # Mood/lighting based on rarity + archetype
    mood = infer_mood(card)
    
    # Composition with 15% bottom padding (for safe text overlay)
    composition = "vertical card art composition, subject centered upper 70%, dark void margin bottom 15%, no humans, no faces, no text, no logos, no watermarks"
    
    return f"{subject}, {action}, {target}, {mood}, {composition}"
```

**Subject inference rules:**
- Weapon → specific weapon type from name (plasma cannon, missile launcher, beam emitter)
- Defense → shield/armor/barrier visualization
- Drone → autonomous craft based on flavor_text hints
- AI Routine → glowing data streams, holographic interface, neural patterns
- Module → mechanical component, engine part, reactor core
- Maneuver → ship in motion, evasive trail, formation movement
- Equipment → attached gear on ship hull
- Field → environmental zone, gas cloud, energy field
- Ship Core → crystal/reactor at heart of vessel

**Action inference rules (parsed from effect_text):**
- "Deal X damage" → projectile firing, explosion impact
- "Burn X turns" → continuous flame/plasma persistent damage
- "Cloak" → shimmer effect, partial transparency
- "Disable Weapons Array" → sparks at weapon mounts, system failure VFX
- "Heat +X" → red-orange glow, thermal venting
- "Draw X cards" → energy convergence at player ship
- etc. (full mapping table in script)

**Target inference (subsystem_target field):**
- hull → main body of enemy ship
- shield → blue shield bubble breaking
- reactor → glowing core of enemy
- weapons → enemy weapon mounts
- engines → enemy engine glow
- life_support → enemy crew quarters area
- (none) → neutral target

**Mood by rarity:**
- common: standard sci-fi lighting
- uncommon: blue accent glow
- rare: cyan/green energy emphasis
- epic: purple/magenta dramatic lighting
- legendary: golden god-rays, cinematic
- mythic: holographic rainbow shimmer, reality-bending VFX

**Mood by archetype:**
- aggro: aggressive forward motion, red accents
- control: calculated precision, blue/white tones
- midrange: balanced composition
- combo: interconnected elements, chain effects
- ramp: building energy, growth visualization
- utility: clean technical display

**Output:** `docs/alpha_set/card_art_prompts_v2.json`
- 1000 entries
- Each entry: `{id, name, prompt, negative_prompt, seed, canvas}`
- `negative_prompt`: "humans, faces, people, hands, text, watermark, signature, logo, blurry, low quality"
- `seed`: deterministic per card (hash of card.id)
- `canvas`: "2048x2048" for all

### Task 2: Spot-check generation
Generate 30 test cards (5 random per rarity) using `card_art_prompts_v2.json` via Gemini Imagen 4 API.

**File:** `scripts/generate_card_art_batch.py` (NEW)
- Reads prompts JSON
- POST to Imagen 4 endpoint
- Saves to `public/cards/art/{card_id}.png`
- Logs per-card render time + cost
- Rate limit: respect Imagen 4 paid tier RPM
- Retry on 429/500 with exponential backoff
- On failure: skip card, log error, continue

**Output:** 30 PNGs in `public/cards/art/` + `docs/alpha_set/render_log_test.json`

**STOP HERE.** Show Jix the 30 cards. Wait for explicit "go ahead" before Task 3.

### Task 3: Full batch generation (only after Jix approval)
Run `scripts/generate_card_art_batch.py` for remaining 970 cards.

**Cost estimate:** 1000 × $0.04 = $40 (Imagen 4 standard 2K)
**Time estimate:** ~2-4 hours depending on rate limits
**Output:** 1000 PNGs in `public/cards/art/`

### Task 4: Frame + art + text composition
**File:** `scripts/render_cards_v4.py` (NEW — adapts existing v3 for 9 types)

For each of 1000 cards:
1. Load frame from `public/card-frames-clean/{rarity}.png`
2. Load art from `public/cards/art/{card_id}.png`
3. Resize art to fit frame's art window
4. Paste art into frame
5. Draw text overlays:
   - Card name (top bar)
   - Energy cost (corner circle)
   - Type label (mid bar)
   - Effect text (ability box)
   - Flavor text (italic, small, bottom of ability box)
   - Keywords (icon row)
   - ATK/DEF stats (bottom corners)
6. Save to `public/cards/composed/{card_id}.png` at 600x900

**Important:** Script must FAIL LOUD if art file missing — no silent skip to blank composition. This was the bug that caused the 257 cards to render blank.

### Task 5: Wire /cards page
- Update `lib/cards/full_library.ts` (or create alpha equivalent) to load from `docs/alpha_set/batch_*.json`
- Update `components/cards/CardCollection.tsx` if needed — img src already points to `/cards/composed/{id}.png`
- Update `/cards` page header: "1000 cards in the Alpha Set"
- Update filter logic for 9 types (was 6) and 6 archetypes
- Update keyword chips for 78 unique keywords (was 19)

### Task 6: Tests
Add tests:
- 1000 cards loaded correctly from batch JSONs
- Each card has matching composed PNG (1000 files exist)
- Filter by type returns correct counts (9 categories)
- Filter by rarity returns correct counts (400/280/160/90/50/20)
- Filter by archetype returns correct counts
- Keyword chips render for cards with keywords

### Task 7: Push 1000 catalog to origin (was held back as `b47053e` local-only)
Already committed. Just needs to be pushed when everything is verified.

---

## FILE SIZE LIMITS (Tom's rules)

- React components: MAX 300 lines
- page.tsx: MAX 100 lines
- lib files: MAX 500 lines
- Python scripts: MAX 500 lines (split into modules if larger)

---

## TESTING REQUIREMENTS

### Before commit:
- [ ] All unit tests pass: `npm test`
- [ ] Build succeeds: `npm run build`
- [ ] No TypeScript errors
- [ ] No console errors in dev mode
- [ ] All 1000 composed PNGs exist on disk
- [ ] /cards page loads in dev (visual check)

### Expected test count:
- Sprint start baseline: 938/938
- Sprint end target: 970-985 (+30-50 new tests)

---

## GIT WORKFLOW

### Before starting:
```
cd C:\Users\Jixwu\Desktop\voidexa
git status
git pull origin main
git tag backup/pre-sprint-afs-5-20260423
```

### During build:
- Commit prompt builder script first
- Commit test 30 cards separately
- Commit full 1000 batch as separate commit
- Commit composition script
- Commit /cards wire-up
- Commit tests

### After completion:
```
git add .
git status
git commit -m "feat(afs-5): replace 257 V3 cards with 1000 Alpha Set + personalized art"
git tag sprint-afs-5-complete
git push origin main
git push origin sprint-afs-5-complete
```

### MANDATORY post-push verification:
```
git status
git log origin/main --oneline -3
```
Then wait 60-90s for Vercel and check `https://voidexa.com/cards` shows "1000 cards in the Alpha Set" and 1000 cards render with full art.

---

## DEFINITION OF DONE

- [ ] All 7 tasks complete
- [ ] 1000 personalized prompts in `card_art_prompts_v2.json`
- [ ] 30 test cards approved by Jix
- [ ] 1000 art PNGs in `public/cards/art/`
- [ ] 1000 composed PNGs in `public/cards/composed/`
- [ ] /cards page shows 1000 cards with art
- [ ] Tests pass (970+/970+)
- [ ] Build succeeds
- [ ] Tagged `sprint-afs-5-complete`
- [ ] Pushed to origin/main
- [ ] `git status` clean
- [ ] Live verified: voidexa.com/cards shows 1000 cards with proper art

---

## CLAUDE.md UPDATE TEMPLATE

```markdown
## Session 2026-04-23 — Sprint AFS-5: 1000 Alpha Cards Art + Deploy

**Commit:** `[hash]`
**Tag:** `sprint-afs-5-complete`
**Tests:** [X/X] passing
**Cards:** 1000 (replaced 257 V3 system)
**Art generation:** Imagen 4 via Google AI Studio API
**Total cost:** ~$40

### Built:
- Personalized prompt builder reading 15 fields per card
- Generated 1000 unique context-aware art prompts
- Spot-check 30 cards approved by Jix
- Full batch render of 1000 cards via Imagen 4
- Composition pipeline (frame + art + text) for 9 card types
- /cards page wired to alpha set
- 1000 cards live with high-res art

### Replaced:
- 257 V3 cards (deprecated, removed from /cards)
- Generic art prompts → personalized per-card prompts
- 6 card types → 9 (added Equipment, Field, Ship Core)
- 19 keywords → 78
- 20-card decks → 60-card decks (data only, deck builder UI updates separate sprint)

### Technical notes:
- Imagen 4 paid tier: SynthID watermark only (invisible)
- 2048x2048 output, downsampled in composition to 600x900
- 15% bottom padding in prompts for safe text overlay
- Render script fails LOUD on missing art (no silent skip)

### What Jix verified live:
- voidexa.com/cards header: "1000 cards in the Alpha Set"
- Random sample of 10 cards across rarities — art matches ability text
- Filter by type works for all 9 types
- Mythic cards display holographic frame correctly

### Next sprint prep:
- Deck builder UI needs 60-card support (separate sprint)
- Game engine needs 9-type support (separate sprint)
- 6-subsystem health model + Heat system + Pilot Selection (future sprints)
- 257 V3 catalog can be archived in `docs/legacy/v3_cards/`
```

---

## SAFETY RULES

- NO force push
- NO direct push to master
- NO commits of API keys (.env stays gitignored)
- NO commits of intermediate render artifacts (only final PNGs)
- Test 30 cards FIRST, await Jix approval, THEN run full 1000
- If Imagen 4 generates humans despite negative prompt: STOP, adjust prompt template, regenerate affected cards
- If cost exceeds $60 (50% over estimate): STOP, alert Jix
- Keep `public/card-frames-clean/` untouched (existing 6 frames work)
- Keep `scripts/clean_frames.py` untouched (already shipped, working)

### If something goes wrong:
```
git reset --hard backup/pre-sprint-afs-5-20260423
git push --force-with-lease origin main
```

---

## TOOLS USED

- Claude Code (`claude --dangerously-skip-permissions`)
- Python 3.12 + Pillow (PIL)
- Google AI Studio Imagen 4 API
- Git
- npm
- Vercel (auto-deploy via GitHub)

---

## ENV VARS REQUIRED

`.env.local` (NOT committed):
```
GOOGLE_AI_STUDIO_API_KEY=...
```

Set this BEFORE running `scripts/generate_card_art_batch.py`.
