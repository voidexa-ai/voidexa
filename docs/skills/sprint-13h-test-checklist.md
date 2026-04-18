# SPRINT 13H — TEST CHECKLIST FOR SHOP, CARDS, FREE FLIGHT
## Skill file for Claude Code
## Location: docs/skills/sprint-13h-test-checklist.md

---

## SCOPE

Produce THREE focused test checklists — one per area — covering only features built in the last 4-5 days (roughly Sprint 6 through Sprint 13f, plus any earlier commits touching these areas).

Output:
1. `docs/test-checklists/shop.md`
2. `docs/test-checklists/cards.md`
3. `docs/test-checklists/freeflight.md`

Each checklist is a list of concrete, testable items with:
- Feature name
- Sprint/commit origin
- Route to visit or file to inspect
- Exact UI element or behavior to look for
- Expected result (what "working" looks like)
- Checkbox for status

Jix will hand these three files to a browser-AI to systematically verify each item. Listing is scoped so the AI tests only what was built, not the entire site.

**NOT in scope:**
- Anything outside Shop, Cards, Free Flight
- Fixing anything found to be broken
- New features
- General audits

---

## METHODOLOGY

This skill reads **git history** plus **sprint docs** — it does NOT guess. Every checklist item must trace to a real commit or a real sprint doc statement.

### Date range

Look at commits from `2026-04-14` through `2026-04-18` (last 4-5 days). If git log shows earlier relevant commits to these three areas (e.g., original Shop build), include them too.

### Source material (read in this order)

1. Git log filtered by the three areas:
   ```powershell
   git log --since="2026-04-13" --until="2026-04-19" --all --oneline --decorate
   git log --since="2026-04-13" --all --name-status -- app/shop app/shop/packs components/shop lib/ghai
   git log --since="2026-04-13" --all --name-status -- app/cards app/cards/deck-builder app/game/battle components/cards lib/cards
   git log --since="2026-04-13" --all --name-status -- app/freeflight components/freeflight lib/freeflight lib/game
   ```
2. Sprint docs in `docs/skills/sprint-*.md` and `docs/SPRINT*.md`
3. CLAUDE.md session logs for relevant sprint entries
4. Existing tests in `tests/` that cover these three areas (they point at real features)

### Categorization within each checklist

Organize by sub-feature. Example for Shop:
- Price display (GHAI conversion)
- Product tabs / categories
- Starter Pack / featured bundles
- Individual product cards
- Purchase flow (click → modal → deduct)
- Cosmetic categories (Ships, Skins, Trails, Card Packs, Cockpits)
- Sub-route `/shop/packs`

---

## PRE-TASKS

1. `git tag backup/pre-sprint-13h-20260418`
2. `git push origin --tags`
3. Verify the three target directories exist:
   ```powershell
   Test-Path app\shop, app\cards, app\freeflight, app\game\battle | ForEach-Object { Write-Host $_ }
   ```
4. List all sprint-* tags for reference:
   ```powershell
   git tag -l "sprint-*" --sort=creatordate
   ```

---

## TASKS

### STEP 1 — Build the Shop checklist

Read all commits touching Shop-related files in the date range. For each distinct feature introduced or modified, create a checklist item.

Output: `docs/test-checklists/shop.md`

Format:

```markdown
# SHOP TEST CHECKLIST
## Last 4-5 days of builds — use this to verify Shop features

Test live at https://voidexa.com/shop

---

## Price display

### [ ] 1. All product prices show as GHAI (not USD)
- **Origin:** Sprint 13d (commit [hash])
- **Route:** /shop
- **Look for:** Prices like "300 GHAI", "150 GHAI", "199 GHAI"
- **Should NOT see:** "$3.00", "$1.50", "$1.99"
- **Status:** ❓ Unverified

### [ ] 2. Starter Pack button is active (not Coming Soon)
- **Origin:** Sprint 13d
- **Route:** /shop (top featured bundle)
- **Look for:** Button text like "BUY · 199 GHAI"
- **Should NOT see:** "COMING SOON · STRIPE"
- **Status:** ❓ Unverified

## Product categories / tabs

### [ ] 3. Tab navigation works
- **Origin:** [sprint + commit]
- **Route:** /shop
- **Look for:** Tabs — ALL, FEATURED, SHIPS, SKINS, TRAILS, CARD PACKS, COCKPITS
- **Action:** Click each tab, verify products filter correctly
- **Status:** ❓ Unverified

... (continue for every Shop feature found in git log)
```

Aim for 15-30 items. Every item must reference a real commit or sprint doc.

### STEP 2 — Build the Cards checklist

Same process, focused on:
- `/cards` page
- `/cards/deck-builder`
- `/game/cards/deck-builder`
- `/game/battle` (PvE card combat)
- Card data: `docs/card_definitions.json`, `docs/card_art_prompts_complete.json`
- Card rendering in components
- Deck builder logic
- Battle engine phase status (Phase 4b is WIP per memory)

Output: `docs/test-checklists/cards.md`

Expected sections:
- Card display (257 cards rendered with art)
- Rarity filters (Common, Uncommon, Rare, Epic, Legendary)
- Category filters (Attack, Defense, Tactical, Deployment, Alien)
- Deck builder (20-card limit, 2-copies-of-normal / 1-of-Legendary rule)
- Deck saving / loading
- Battle tier selection (T1 Core Patrol → T5 Deep Void Prowler)
- Boss fights (4 bosses with GHAI rewards)
- Battle scene (Phase 4b — may still crash on "Fight" click per memory)

Aim for 20-35 items.

### STEP 3 — Build the Free Flight checklist

Same process, focused on:
- `/freeflight` page
- Tutorial system (Bob's First Loop, 4-step tutorial)
- 3D flight controls (WASD, mouse, scroll zoom)
- Cockpit view (V key)
- Dock mechanic (E key near stations)
- Warp gates (interaction and navigation)
- Station docking (Voidexa Hub)
- GHAI rewards (180 GHAI tutorial completion, 600 GHAI chain bonus)
- Audio integration (67 sounds from Sprint 7)
- Tutorial skip button
- Ship models (Vattalus cockpit, others)

Output: `docs/test-checklists/freeflight.md`

Aim for 15-25 items.

### STEP 4 — Cross-reference with existing tests

For each checklist item, if an existing test in `tests/` covers it, note the test file name:

```markdown
### [ ] X. Feature name
- **Origin:** Sprint N
- **Test file:** `tests/foo.test.ts` (if applicable)
- **Route:** ...
```

If no test exists, mark **Manual verification only**.

### STEP 5 — Include commit hash per item

Every checklist item must have at least one commit hash showing where it was introduced. Use `git log --all --oneline --grep="shop"` or similar to find the originating commit.

### STEP 6 — Commit + deliver

1. Create the three files:
   - `docs/test-checklists/shop.md`
   - `docs/test-checklists/cards.md`
   - `docs/test-checklists/freeflight.md`
2. No code changes. No test changes. Only new docs.
3. `git add docs/test-checklists/`
4. `git commit -m "docs(sprint-13h): test checklists for Shop, Cards, Free Flight"`
5. `git push origin main`
6. `git tag sprint-13h-complete`
7. `git push origin --tags`

### STEP 7 — Report

```
SPRINT 13H — TEST CHECKLIST REPORT
===================================

Files delivered:
- docs/test-checklists/shop.md ([N] items)
- docs/test-checklists/cards.md ([N] items)
- docs/test-checklists/freeflight.md ([N] items)

Commits analyzed (date range 2026-04-14 to 2026-04-18):
- Shop-related commits: [count]
- Cards-related commits: [count]
- Free Flight-related commits: [count]

Test coverage:
- Checklist items with existing test: [N]
- Checklist items requiring manual verification: [N]

Known partial/in-progress items flagged:
- [e.g., Game Battle Phase 4b — 3D battle scene WIP]

Sample (top 20 lines of shop.md):
[paste]

Tag: sprint-13h-complete pushed
Commit: [hash]

Next step for Jix:
- Review the three checklists
- Start new chat with browser-AI (Claude in Chrome)
- Hand each checklist to the AI and walk through systematically
- Mark each ❓ → ✅ / ❌ / ⚠️ with evidence
```

---

## EXIT CRITERIA

- Three files exist in `docs/test-checklists/`
- Every item has: commit origin, route, what to look for, expected result, status field
- Every item traceable to real git history (no invented features)
- Existing tests cross-referenced where applicable
- Tag `sprint-13h-complete` pushed
- Report produced

---

## STOP CONDITIONS

- Git history inaccessible → halt, report
- Less than 5 items found in any of the three areas → halt, report (means date range may need expanding)
- 45 minutes wall clock reached → stop, commit what's done, document what's missing

---

## SIZE RULES

Documentation only — no code file limits apply. Each checklist file should stay under 500 lines for readability. If a file would exceed 500 lines, split by sub-feature (e.g., `shop-prices.md`, `shop-purchase-flow.md`).

---

## ROLLBACK

```powershell
git reset --hard backup/pre-sprint-13h-20260418
git push --force-with-lease origin main
```

---

## FILES DELIVERED

- `docs/test-checklists/shop.md`
- `docs/test-checklists/cards.md`
- `docs/test-checklists/freeflight.md`

No code changes. No test changes.
