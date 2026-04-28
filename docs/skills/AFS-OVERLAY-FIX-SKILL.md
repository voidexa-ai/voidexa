# SKILL — AFS-OVERLAY-FIX: CommBubble Overlap Cleanup + 960 Audit

**Sprint:** AFS-OVERLAY-FIX
**Status:** 🔴 Ready to execute
**Priority:** P1 (visible UX bugs on conversion-critical pages)
**Depends on:** AFS-FIX-COMBO ✅ (`64975b2`)
**Estimated:** 1 session, 3 fixes
**Tag on complete:** `sprint-afs-overlay-fix-complete`
**Backup tag before start:** `backup/pre-afs-overlay-fix-20260428` → `64975b2`

---

## SCOPE

Three fixes consolidated into one sprint:

| # | Page | Type | Bug |
|---|---|---|---|
| 1 | `/break-room` | overlap | Universe Chat "AI" bubble overlaps Leaderboard pill (bottom-right) |
| 2 | `/void-chat` | overlap | Jarvis CommBubble overlaps GHAI sidebar text (bottom-left) |
| 3 | multiple | audit | 4 stale `960` references — verify and fix only stale ones |

**Out of scope:**
- /starmap optical issues (star renderer blending + default zoom too far) → moved to **AFS-10 expanded scope**
- /services and /apps overlap bugs (P1-NEW-8, P1-NEW-9) — verified RESOLVED on Apr 28 live audit
- Sovereign Sky branding (waiting on animation video)

---

## VERIFY-FIRST PRE-FLIGHT (MANDATORY)

**Stop for Jix approval after pre-flight before any code change.**

### Pre-flight Task 0.1 — confirm git state

```powershell
git status
git log origin/main --oneline -3
# Expected HEAD: 64975b2 (test(afs-fix-combo): lock marketing strings + sort + opacity)
```

If HEAD ≠ `64975b2`, stop and reconcile with Jix.

### Pre-flight Task 0.2 — grep CommBubble + sidebar layout

```powershell
# Find Universe Chat / CommBubble component(s)
git grep -nE "UniverseChat|CommBubble|Open Universe Chat" -- "*.tsx" "*.ts"

# Find Jarvis CommBubble (separate component)
git grep -nE "Jarvis|JarvisChat|JarvisBubble" -- "*.tsx" "*.ts"

# Find route-skip logic (already exists per CommBubble hotfix aae6b64)
git grep -nE "routeSkip|route-skip|hideOnRoute" -- "*.tsx" "*.ts"

# Find /break-room Leaderboard pill
git grep -nE "Leaderboard.*pill|leaderboardButton|trophy" -- "components/break-room/**" "app/break-room/**"

# Find /void-chat GHAI sidebar
git grep -nE "GHAI.*sidebar|ecosystem token|More details available" -- "components/void-chat/**" "app/void-chat/**"
```

### Pre-flight Task 0.3 — grep `960` audit (4 surfaces)

Per Claude Code's AFS-FIX-COMBO finding (Finding 2), these 4 occurrences were intentionally left untouched. We need to verify each one before fixing:

```powershell
# 1. ScienceDeck card + tooltip
git grep -n "960" -- "components/station/ScienceDeck.tsx"

# 2. Star Map sublabel
git grep -n "960" -- "components/starmap/nodes.ts"

# 3. Admin dashboard
git grep -n "960" -- "components/control-plane/ControlPlaneDashboard.tsx"
```

For each hit, read the surrounding 5-10 lines and classify:

| Surface | Question | If "marketing display" → fix to 1324 | If "live/historic data" → leave alone |
|---|---|---|---|
| ScienceDeck card | What does 960 represent here? | yes | no |
| ScienceDeck tooltip | Same metric or different? | yes | no |
| Starmap node sublabel | Test count display or something else? | yes | no |
| ControlPlaneDashboard 589 | Live aggregate or hardcoded? | should already be live | no |
| ControlPlaneDashboard 660 | Live aggregate or hardcoded? | should already be live | no |

### Pre-flight Task 0.4 — produce report

After greps, produce:

| Fix | File | Line(s) | Component | Action |
|---|---|---|---|---|
| 1 | TBD | TBD | Universe Chat bubble | adjust position OR add bottom-right collision avoidance |
| 2 | TBD | TBD | Jarvis bubble | adjust position OR add bottom-left collision avoidance |
| 3a | components/station/ScienceDeck.tsx | 38, 39 | classify before fix |
| 3b | components/starmap/nodes.ts | 152 | classify before fix |
| 3c | components/control-plane/ControlPlaneDashboard.tsx | 589, 660 | classify before fix |

**STOP. Show classification table to Jix. Wait for explicit approval before proceeding.**

---

## CONTEXT — VERIFIED LIVE STATE (Apr 28)

### Fix 1 — `/break-room` Universe Chat ↔ Leaderboard pill

**Visual evidence (zoomed screenshot 226×104 of bottom-right):**
The blue "AI" circle bubble (Universe Chat / CommBubble) is rendered overlapping the top-right corner of the "🏆 Leaderboard" pill. The bubble cuts into the pill border.

**Root cause hypothesis:**
- Both elements use `position: fixed` bottom-right
- Universe Chat bubble has same z-index OR doesn't account for Leaderboard pill's space
- Leaderboard pill is page-specific (only on /break-room)

**Fix approach:**
Either (pick one based on simplest implementation):
- **A)** Move Leaderboard pill to bottom-left or middle-right
- **B)** When Leaderboard pill is present, shift Universe Chat bubble up by pill height + margin
- **C)** Stack vertically — bubble above pill on /break-room

Recommended: **B** — least invasive, keeps existing user expectation of where bubbles live.

### Fix 2 — `/void-chat` Jarvis bubble ↔ GHAI sidebar

**Visual evidence (zoomed screenshot 289×248 of bottom-left):**
The Jarvis CommBubble (small chat icon circle) is rendered on top of the GHAI sidebar's bottom area. The text "More details available at" is partially blocked by the bubble.

**Root cause hypothesis:**
- Jarvis bubble: `position: fixed` bottom-left
- GHAI sidebar: also bottom-left zone but is sidebar content, not floating
- They occupy the same screen real estate

**Fix approach:**
Either:
- **A)** Move Jarvis bubble to top-left or middle-left on /void-chat
- **B)** Add bottom padding to GHAI sidebar so text ends above bubble zone
- **C)** Add route-skip for /void-chat (Jarvis bubble doesn't show on this page) — same pattern as /starmap CommBubble route-skip from hotfix `aae6b64`

Recommended: **C** — /void-chat IS a chat surface already (multi-AI Void Chat). Adding a separate Jarvis bubble there is redundant. Route-skip is the cleanest fix.

### Fix 3 — `960` audit on 4 surfaces

Per AFS-FIX-COMBO Finding 2:
- `components/station/ScienceDeck.tsx:38, 39` — Station deck card + tooltip
- `components/starmap/nodes.ts:152` — Star Map sublabel
- `components/control-plane/ControlPlaneDashboard.tsx:589, 660` — Admin dashboard

**Audit logic:**
- If number is **hardcoded marketing copy** describing voidexa frontend test count → fix to `1324` (matches AFS-FIX-COMBO scope)
- If number is **live aggregate from /api/kcp90/stats or similar** → leave alone, it's correct by construction
- If number is **historic data point** (e.g., "as of March 2026") → leave alone

ControlPlaneDashboard likely shows live data (per AFS-4 wiring). Almost certainly out of scope. ScienceDeck and starmap node are more likely stale marketing.

---

## TASKS (post pre-flight approval)

### Task 1 — Backup tag
```powershell
git tag backup/pre-afs-overlay-fix-20260428 64975b2
git push origin backup/pre-afs-overlay-fix-20260428
```

### Task 2 — Commit this SKILL
```powershell
git add docs/skills/afs-overlay-fix-SKILL.md   # or wherever SKILLs live
git commit -m "skill(afs-overlay-fix): commbubble overlap cleanup + 960 audit"
git push origin main
```

### Task 3 — Fix 1: /break-room Leaderboard pill collision

Implement chosen approach (likely B: shift Universe Chat bubble up when pill present).

Suggested implementation:
- Detect /break-room route in CommBubble container
- Apply `bottom: calc(<default> + <pill-height> + 12px)` only on that route
- OR add a CSS variable `--commbubble-bottom-offset` that /break-room layout sets to pill height

Commit:
```
fix(afs-overlay-fix): /break-room — universe chat bubble avoids leaderboard pill
```

### Task 4 — Fix 2: /void-chat Jarvis bubble route-skip

Add `/void-chat` to Jarvis CommBubble route-skip list (same pattern as /starmap from hotfix `aae6b64`).

Commit:
```
fix(afs-overlay-fix): /void-chat — route-skip jarvis bubble (redundant on chat surface)
```

### Task 5 — Fix 3: stale 960 audit + targeted fixes

Per pre-flight classification, fix only the surfaces classified as stale marketing copy.

Possible scenarios:
- All 4 are live data → no fix, document and close
- Some are stale → fix those, leave live ones
- All are stale → fix all 5 line occurrences (38, 39, 152, 589, 660)

Commit (one per file changed):
```
fix(afs-overlay-fix): <surface> — 960 → 1324 marketing string
```

If no stale matches found:
```
chore(afs-overlay-fix): 960 audit — all 4 surfaces verified live, no fix needed
```

### Task 6 — Test additions

Add Vitest assertions to lock the fixes:

- `tests/afs-overlay-fix.test.ts` (or extend existing per-component tests):
  - `/break-room` page: Universe Chat bubble does NOT visually overlap Leaderboard pill (computed bottom positions test)
  - Jarvis CommBubble route-skip list contains `/void-chat`
  - For each 960 surface fixed: assert new value, assert old value gone
  - For each 960 surface NOT fixed: assert it's reading from live source (mock test, not hardcoded)

Target test count delta: ~+5-10 assertions.

Commit:
```
test(afs-overlay-fix): lock overlap fixes + 960 audit results
```

### Task 7 — Final tag + push
```powershell
git tag sprint-afs-overlay-fix-complete
git push origin main
git push origin sprint-afs-overlay-fix-complete

git status
git log origin/main --oneline -7
```

### Task 8 — Live verification (≥90s after push)

Wait minimum 90 seconds for Vercel deploy. Then via Claude in Chrome (incognito + hard reload):

1. `/break-room` — Leaderboard pill bottom-right NOT overlapped by bubble
2. `/void-chat` — Jarvis bubble GONE from page (route-skip confirmed)
3. `/break-room` and `/void-chat` — confirm Universe Chat bubble still works as expected
4. For any 960 fixes: confirm new value live on respective page

---

## DEFINITION OF DONE

- [ ] SKILL committed FIRST (before any code)
- [ ] Backup tag `backup/pre-afs-overlay-fix-20260428` pushed
- [ ] Pre-flight grep + 960 classification table shown to Jix
- [ ] Jix approves classification before fixes start
- [ ] All fixes implemented per approved scope
- [ ] Tests green (1341 baseline + ~5-10 new = ~1346-1351)
- [ ] Build succeeds (`npm run build`)
- [ ] Lint baseline unchanged
- [ ] Committed + tagged + pushed
- [ ] `git status` clean post-push
- [ ] `git log origin/main --oneline -7` shows commits on remote
- [ ] Tag `sprint-afs-overlay-fix-complete` on remote
- [ ] Wait ≥90s for Vercel deploy
- [ ] Hard-refresh incognito live-verify
- [ ] CLAUDE.md updated + uploaded to Project Knowledge at SLUT
- [ ] INDEX deltas delivered at SLUT (04, 08, 11)
- [ ] No regressions on AFS-FIX-COMBO fixes (re-verify /products, /trading-hub, /quantum, /home)

---

## ROLLBACK

```powershell
git reset --hard backup/pre-afs-overlay-fix-20260428
git push origin main --force-with-lease
git push origin :refs/tags/sprint-afs-overlay-fix-complete
```

No data migrations. No schema changes. Pure code.

---

## RISKS

- **Low risk overall** — CSS positioning + route-skip pattern (already proven by hotfix `aae6b64`).
- **Risk:** If CommBubble route-skip is implemented differently for Jarvis vs Universe Chat, need to find the right list. Pre-flight grep handles this.
- **Risk:** Fix 1 approach B (shift bubble up on /break-room) may break if Leaderboard pill gets repositioned later. Acceptable — that's a future maintenance cost, not a now-cost.
- **Risk:** 960 surfaces may have different "correct" values per surface (admin shows live, marketing shows static). Don't apply blanket 1324 — classify first.

---

## NOTES — STARMAP DEFERRED TO AFS-10

Two starmap optical bugs noticed during AFS-OVERLAY-FIX scoping but **NOT** included in this sprint:

1. Star renderer blends with nebula background image (renderer stars and background-image stars are visually indistinguishable)
2. Default zoom level too far out — voidexa SUN appears small, galaxy doesn't fill viewport

These are added to AFS-10 (Starmap Level 2 Repair) scope which already includes:
- Dead links: /tools planet → /apps redirect
- /space-station → new "planet med ring" visual (assets ready)
- New planet assets insertion (assets ready)

AFS-10 becomes a single coherent starmap overhaul instead of 2-3 small ripples.

See `16_AUDIT_ROADMAP.md` (next session) for updated AFS-10 scope.

---

## CLAUDE CODE EXECUTION COMMAND

After Jix approves SKILL:

```powershell
claude --dangerously-skip-permissions
```

Then point Claude Code at this SKILL.md.
