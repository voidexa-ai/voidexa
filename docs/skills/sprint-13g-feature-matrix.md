# SPRINT 13G — FEATURE VALIDATION MATRIX
## Skill file for Claude Code
## Location: docs/skills/sprint-13g-feature-matrix.md

---

## SCOPE

Produce a comprehensive `VOIDEXA_FEATURE_MATRIX.md` — a single master document listing every feature built from Sprint 1 through Sprint 13f, with:
- Feature name + description
- Sprint of origin
- Expected behavior (what it should do)
- Validation step (how to verify it works — URL, API call, test name, or manual check)
- Current status field (to be filled by later AI validation runs)

The output is a **validation matrix**, not a new analysis. Jix needs one place to see everything that was built so he can verify nothing regressed during the 30-day build rush.

**NOT in scope:**
- Fixing broken features
- Rebuilding anything
- Adding new tests (matrix references existing tests only)
- Deep analysis (those are separate chats)

---

## METHODOLOGY

This skill reads existing documentation — it does NOT guess or invent features. Every matrix entry must trace to a real source.

### Source documents (read in this order)

1. `CLAUDE.md` — session logs from Apr 11 onward (primary source)
2. `docs/POWER_PLAN.md` if exists — sprint planning
3. `docs/SPRINT*.md` files — individual sprint docs
4. `docs/SPRINT*_CLAUDE.md` files — Claude Code sprint specs
5. `docs/skills/sprint-*.md` files — skill files including 13a, 13b, 13c, 13d, 13e, 13f
6. `docs/VOIDEXA_INTENT_SPEC.md` — intent spec
7. `docs/VOIDEXA_GAMING_COMBINED_V3.md` — gaming mechanics
8. `docs/SESSION_HANDOVER_APR17.md` if exists
9. Git log with full commit messages (use `git log --all --oneline --decorate` and dig into sprint tags)
10. Tag list: `git tag -l "sprint-*"` to enumerate all sprints

### Categorization

Features grouped by domain:
- **Homepage & intro** (video, overlay, quick menu, nav)
- **Universe / Star Map** (starmap, voidexa system, planets, galaxy view)
- **Free Flight** (3D gameplay, ship controls, cockpit, warp, docking)
- **Mission Board** (quests, rewards, AI cast, chains)
- **Speed Run** (racing, tracks, leaderboard)
- **Hauling** (trade goods, routes, contracts, wrecks)
- **Card System** (257 cards, keywords, art)
- **Deck Builder** (20-card decks, rarity limits, saving)
- **Game Battle** (PvE tiers, boss fights, 3D battle scene)
- **Shop** (products, GHAI pricing, tabs, Starter Pack)
- **GHAI Economy** (Platform-GHAI wallet, Stripe top-up, balance display, auto-payout, credit API)
- **Quantum Chat** (multi-AI debate, synthesis, scaffold mode, follow-ups, session history)
- **Void Chat** (secure messaging product)
- **AI Trading** (trading hub, strategies)
- **Admin & Dev** (ship-tagger, void-chat admin, control-plane)
- **Auth & Profile** (login, signup, profile, Danish routes /dk)
- **Break Room** (sofa, AI chat, arcade, jukebox, YouTube)
- **Content pages** (about, team, contact, services, products, whitepaper, token)
- **Infrastructure** (CSP, env vars, Supabase tables, Stripe integration, Vercel deploy)

---

## PRE-TASKS

1. `git tag backup/pre-sprint-13g-20260418`
2. `git push origin --tags`
3. Verify all source docs exist:
   ```powershell
   Get-ChildItem CLAUDE.md, docs/POWER_PLAN.md, docs/VOIDEXA_INTENT_SPEC.md, docs/VOIDEXA_GAMING_COMBINED_V3.md -ErrorAction SilentlyContinue | Select-Object Name, Length
   Get-ChildItem docs/SPRINT*.md, docs/skills/sprint-*.md -ErrorAction SilentlyContinue | Select-Object Name, Length
   ```
   Report which docs exist and which are missing.

---

## TASKS

### STEP 1 — Enumerate all sprints from git tags

Run `git tag -l "sprint-*" --sort=creatordate > sprints.txt` and read. Every tag represents a completed sprint. For each tag:
- Get the commit it points to: `git rev-list -n 1 <tag>`
- Get the commit message body: `git log -1 --format=%B <commit>`
- Note the date: `git log -1 --format=%ai <commit>`

Produce a table: `Sprint | Tag | Commit | Date | Primary scope (1 line)`

### STEP 2 — Read every sprint doc

For each sprint doc found in `docs/SPRINT*.md` and `docs/skills/sprint-*.md`:
- Extract "Scope" section
- Extract "Tasks" / "Steps" sections
- Extract "Exit criteria" section
- Note the features the sprint committed to

Output: `docs/audit/sprint-docs-summary.md` (max 500 lines) — condensed summary of each sprint's scope and deliverables.

### STEP 3 — Cross-reference with git commits

For each commit between sprint tags, extract:
- Files modified
- Commit message

Map commits to features. Example:
```
Commit 19f4178 "feat(sprint-13c): replace Three.js cinematic..."
→ Features: IntroVideo, QuickMenuOverlay, WebsiteCreationModal, voiceover MP3 generation
→ Files: components/home/IntroVideo.tsx, etc.
```

### STEP 4 — Build the matrix

Create `docs/VOIDEXA_FEATURE_MATRIX.md`.

Format per entry:

```markdown
### Feature: <name>

- **Sprint:** <sprint number + tag>
- **Commit(s):** <short hashes>
- **Category:** <category from list>
- **Description:** <one line what it does>
- **Files:** <key files involved>
- **Expected behavior:** <what happens when user interacts>
- **Validation:**
  - Route: <URL if applicable>
  - API: <endpoint + expected response if applicable>
  - Test: <test file name if applicable>
  - Manual: <what to look for on screen if no test exists>
- **Status:** ❓ Unverified
```

Group features under category headings. Use tables for dense sections (e.g., routes list).

Target length: 30-60 pages of markdown. Comprehensive but readable.

### STEP 5 — Validation checklist preface

At the top of `VOIDEXA_FEATURE_MATRIX.md`, include:

1. Table of contents (auto-generated from categories)
2. Quick stats: total features, breakdown by sprint, breakdown by category
3. Legend:
   - ✅ Verified working
   - ❌ Broken (with reason)
   - ⚠️ Partial / degraded
   - 🚧 Work in progress (Phase X)
   - ❓ Unverified (default for all entries in this sprint)
4. "How to validate" section: short instruction on how a human or AI should work through the matrix — check each feature's validation step, update the status field, commit back.

### STEP 6 — Identify known issues

Search the matrix output and flag any feature where the source docs mention:
- "in-progress", "phase 4b", "WIP", "TODO", "deferred"
- "not yet implemented", "coming soon", "not wired"

Mark these with 🚧 and include the reason from the source.

Examples expected (from memory/context):
- Game Battle Phase 4b (3D battle scene UI) — 🚧 in-progress
- BWOWC references — should NOT appear in matrix (confidential)
- Crypto-GHAI token visibility — 🚧 on hold pending ADVORA

### STEP 7 — Commit + deliver

1. Commit docs:
   - `docs/audit/sprint-docs-summary.md`
   - `docs/VOIDEXA_FEATURE_MATRIX.md`
2. No code changes. No test changes.
3. `git add docs/`
4. `git commit -m "docs(sprint-13g): feature validation matrix + sprint docs summary"`
5. `git push origin main`
6. `git tag sprint-13g-complete`
7. `git push origin --tags`

### STEP 8 — Report

Produce final report:

```
SPRINT 13G — FEATURE MATRIX REPORT
===================================

Source docs read:
- [list of docs actually found and processed]

Missing docs (could not process):
- [list of expected docs not found, if any]

Matrix stats:
- Total features catalogued: [N]
- Sprints covered: Sprint 1 through Sprint 13f
- Categories: [count]
- Features marked 🚧 in-progress: [count]
- Known confidential items excluded: [count]

Output files:
- docs/VOIDEXA_FEATURE_MATRIX.md ([N] features, [M] lines)
- docs/audit/sprint-docs-summary.md

Top of matrix sample:
[paste first 50 lines of VOIDEXA_FEATURE_MATRIX.md so Jix can see the format]

Tag: sprint-13g-complete pushed
Commit: [hash]

Next step for Jix:
- Review matrix
- Start validation chat (new session) and work through features one by one
- Each verification updates the ❓ status to ✅ / ❌ / ⚠️
```

---

## EXIT CRITERIA

- `docs/VOIDEXA_FEATURE_MATRIX.md` exists with all features listed
- Each feature has validation step defined
- Each feature has status field (default ❓)
- Categories grouped per methodology list
- Sprint 1-13f coverage complete
- Git log cross-referenced with doc claims
- Confidential items (BWOWC, Crypto-GHAI reveals) excluded
- Tag `sprint-13g-complete` pushed
- Report produced

---

## STOP CONDITIONS

- Git log inaccessible → halt, report
- More than 50% of expected sprint docs missing → halt, report what's available, ask if partial matrix is OK
- Matrix approaches 100 pages → stop at 100 pages, note incomplete coverage, list what was skipped
- 60 minutes wall clock reached → stop at next safe checkpoint, commit partial matrix, document what remains

---

## SIZE RULES

This is a documentation sprint. No code file line limits apply because no code is changed.

Matrix file itself can exceed 500 lines — this is docs, not lib. But split into multiple files if > 2000 lines:
- `docs/VOIDEXA_FEATURE_MATRIX.md` (master index)
- `docs/features/game.md`
- `docs/features/cards.md`
- etc.

Primary rule: the matrix should be readable, scannable, and useful — not exhaustive to the point of uselessness.

---

## ROLLBACK

```powershell
git reset --hard backup/pre-sprint-13g-20260418
git push --force-with-lease origin main
```

---

## FILES DELIVERED

- `docs/VOIDEXA_FEATURE_MATRIX.md` (master feature list)
- `docs/audit/sprint-docs-summary.md` (condensed sprint doc summary)
- Possibly `docs/features/*.md` if matrix split for readability

No code changes. No test changes. No dependency changes.
