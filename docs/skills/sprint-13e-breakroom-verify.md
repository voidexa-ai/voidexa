# SPRINT 13E — BREAK ROOM RESTORE + LIVE VERIFICATION
## Skill file for Claude Code
## Location: docs/skills/sprint-13e-breakroom-verify.md

---

## SCOPE

Two small tasks in one sprint:

1. **Restore Break Room link in top nav** — Break Room was incorrectly removed from nav in Sprint 13c. It is a BUILT feature (interactive lounge with sofa, AI chat, arcade machines, laptop/YouTube, jukebox). Must be accessible from nav again, but placed under Universe dropdown (not as standalone top-level item).

2. **Live verification of Sprint 13d features** — confirm all 5 Sprint 13d changes work in production. Report status of each.

**NOT in scope:**
- New features
- Visual redesigns
- Shop product audit
- Card game audit

---

## CONTEXT

### Why Break Room was removed
During Sprint 13c intro video work, the claim was made that Break Room "is planned but not built per V3." This was WRONG. Break Room IS built — it's a social/interactive lounge feature inside voidexa. The 3D upgrade was discussed as a future enhancement, but the current Break Room functionality works.

### What Break Room is
Interactive in-universe location with:
- Sofa for chatting personally with AI characters (Claude, GPT, Gemini, Perplexity, Llama)
- 3-4 vintage arcade machines
- Laptop that opens YouTube
- Jukebox that will play Jix's AI-generated music (anonymous)

Part of the "Universe" category — a place users visit in the voidexa universe, alongside Star Map and Free Flight.

### Current state to verify
Route `/break-room` exists. Route `/dk/break-room` also exists (Danish version).

---

## PRE-TASKS

1. `git tag backup/pre-sprint-13e-20260418`
2. `git push origin --tags`
3. Verify `/break-room` route exists: `Test-Path app\break-room\page.tsx` (should return True)
4. `npm test` baseline (expect 700 from 13d)

---

## TASKS

### STEP 1 — Restore Break Room to Universe dropdown

File: `components/layout/Nav.tsx` (or wherever top nav is defined)

Locate the Universe dropdown. Current structure (after Sprint 13c):
- Universe
  - Star Map → `/starmap`
  - (other Universe-related items already here)

Add Break Room to the Universe dropdown so it becomes:
- Universe
  - Star Map → `/starmap`
  - voidexa System → `/starmap/voidexa`
  - Free Flight → `/freeflight`
  - Break Room → `/break-room`

Placement order in dropdown: Star Map, voidexa System, Free Flight, Break Room (Break Room last in list).

If these Universe sub-items don't already exist in the dropdown, add them all. The goal is a complete Universe dropdown with all four in-world locations.

**Do NOT add Break Room as a standalone top-level nav item.** It must live under Universe only.

Match existing dropdown styling — same transition, background, border, hover states as Products dropdown.

File size: Nav.tsx max 250 lines. Split into sub-components if over.

### STEP 2 — Update tests

File: `tests/nav-dropdown.test.ts` (created in Sprint 13d)

Add tests:
- Universe dropdown contains Break Room link
- Break Room link in nav has href="/break-room"
- Break Room is NOT present as a standalone top-level nav item
- Universe dropdown contains Star Map, voidexa System, Free Flight, Break Room in that order

### STEP 3 — Build + deploy

1. `npm run build` clean
2. `npm test` — must stay 700+ (target 703+ with new tests)
3. `git add .`
4. `git commit -m "fix(nav): restore Break Room under Universe dropdown"`
5. `git push origin main`
6. Wait for Vercel deploy
7. `git tag sprint-13e-complete`
8. `git push origin --tags`

### STEP 4 — Live verification (scripted)

After deploy, run a verification script that hits production voidexa.com and reports status. Create a one-shot Node script or PowerShell that:

```powershell
# Verify Sprint 13d + 13e features live
Write-Host "=== Sprint 13d + 13e Verification ===" -ForegroundColor Cyan

# 1. Homepage loads
$home = Invoke-WebRequest -Uri "https://voidexa.com/" -UseBasicParsing
Write-Host "1. Homepage status: $($home.StatusCode)"
$hasVideo = $home.Content -match "voidexa_intro_final"
Write-Host "   Video URL present: $hasVideo"

# 2. /home loads
$homeAlt = Invoke-WebRequest -Uri "https://voidexa.com/home" -UseBasicParsing
Write-Host "2. /home status: $($homeAlt.StatusCode)"

# 3. /break-room loads
$breakRoom = Invoke-WebRequest -Uri "https://voidexa.com/break-room" -UseBasicParsing
Write-Host "3. /break-room status: $($breakRoom.StatusCode)"

# 4. Quick menu route
$quickMenu = Invoke-WebRequest -Uri "https://voidexa.com/?menu=true" -UseBasicParsing
Write-Host "4. /?menu=true status: $($quickMenu.StatusCode)"

# 5. Shop loads
$shop = Invoke-WebRequest -Uri "https://voidexa.com/shop" -UseBasicParsing
Write-Host "5. /shop status: $($shop.StatusCode)"
$hasGhaiText = $shop.Content -match "GHAI"
Write-Host "   'GHAI' text in shop: $hasGhaiText"

# 6. GHAI API auth-gated
try {
    $ghaiApi = Invoke-WebRequest -Uri "https://voidexa.com/api/ghai/balance" -UseBasicParsing -ErrorAction Stop
    Write-Host "6. /api/ghai/balance status: $($ghaiApi.StatusCode) (UNEXPECTED - should be 401)"
} catch {
    Write-Host "6. /api/ghai/balance returns $($_.Exception.Response.StatusCode) (expected 401 Unauthorized)"
}

# 7. Mission Board loads
$mission = Invoke-WebRequest -Uri "https://voidexa.com/game/mission-board" -UseBasicParsing
Write-Host "7. /game/mission-board status: $($mission.StatusCode)"
$missionHasGhai = $mission.Content -match "GHAI"
Write-Host "   Mission Board shows GHAI: $missionHasGhai"

# 8. Starmap loads
$starmap = Invoke-WebRequest -Uri "https://voidexa.com/starmap" -UseBasicParsing
Write-Host "8. /starmap status: $($starmap.StatusCode)"

Write-Host "=== Verification complete ===" -ForegroundColor Green
```

Run this script and report the output.

### STEP 5 — Report findings

After verification script runs, produce a final status report with this structure:

```
SPRINT 13E REPORT
=================

Break Room restoration:
- Nav updated: [YES/NO]
- Universe dropdown items: [list them]
- Break Room link position: [position in dropdown]
- Tests added: [count]

Sprint 13d feature verification:
- [x] Home dropdown with Main Page + Quick Menu: [WORKING/BROKEN + why]
- [x] /?menu=true skips video: [WORKING/BROKEN + why]
- [x] Global GHAI balance in top nav: [WORKING/BROKEN + why]
- [x] Shop shows GHAI prices: [WORKING/BROKEN + why]
- [x] Mission Board auto-payout: [IMPLEMENTED/NOT IMPLEMENTED + evidence]

Build + deploy:
- Tests: X/X passing
- Commit: [hash]
- Vercel deploy: [URL]
- Tag: sprint-13e-complete pushed

Known issues found during verification (for future sprints):
- [list anything broken or unexpected]
```

---

## EXIT CRITERIA

- Break Room link restored in Universe dropdown
- Break Room NOT in top-level nav
- `/break-room` still loads 200 OK
- `/dk/break-room` still loads 200 OK (Danish version)
- Nav dropdown tests updated
- Test count 703+ green
- `npm run build` clean
- Deployed via `git push origin main`
- Tag `sprint-13e-complete` pushed
- Verification report produced with status of all Sprint 13d features

---

## STOP CONDITIONS

- `/break-room` route does not exist (404) — halt, report (means Jix is wrong about it being built, or it was deleted)
- Nav file structure unclear — halt, request guidance
- Tests regress below 700 — halt, report
- Build fails 3 times consecutively — halt, report

---

## ROLLBACK

```powershell
git reset --hard backup/pre-sprint-13e-20260418
git push --force-with-lease origin main
```

---

## FILES MODIFIED

- `components/layout/Nav.tsx` (add Break Room to Universe dropdown)
- `tests/nav-dropdown.test.ts` (new tests for Break Room placement)

No new files expected unless nav file exceeds 250-line limit and needs splitting.
