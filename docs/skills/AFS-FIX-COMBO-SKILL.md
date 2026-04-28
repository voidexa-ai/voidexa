# SKILL — AFS-FIX-COMBO: Marketing Accuracy + Homepage Opacity (v2)

**Sprint:** AFS-FIX-COMBO
**Status:** 🔴 Ready to execute
**Priority:** P0 (marketing accuracy + visible UX bug)
**Depends on:** None
**Estimated:** 1 session, 6 small fixes
**Tag on complete:** `sprint-afs-fix-combo-complete`
**Backup tag before start:** `backup/pre-afs-fix-combo-20260428` → `9b7e51a`

**v2 change:** Simplified Fix 2+3. Confirmed via 04_KNOWN_ISSUES_DELTA_APR27_SLUT16.md that all 6 community bot rows are mock/seed placeholders. No A/B/C sort decision needed — just sort DESC.

---

## SCOPE

Six small string/CSS fixes consolidated into one sprint. All fixes verified live on voidexa.com on 2026-04-28 before SKILL was written.

| # | Page | Type | Current → Target |
|---|---|---|---|
| 1 | `/products` | string | `+313%` → `+194.79%` |
| 2 | `/trading-hub` | string | leaderboard row 1 `+357.0%` → `+194.79%` |
| 3 | `/trading-hub` | logic | leaderboard sort by `total_return DESC` |
| 4 | `/quantum` | string | `960` tests → `1324` tests (3 occurrences) |
| 5 | `/quantum` | string | `95% compression` → `~93%` (2 occurrences) |
| 6 | `/` (home) | CSS | 3 quick-menu labels: opacity ≥ 0.75 + spacing fix |

**Out of scope:**
- Sovereign Sky branding rename (waits on animation video — see AFS-SOVEREIGN-LAUNCH in 09_WISHES_PENDING)
- Real-world product shop unbuilt (P1-NEW-11 → AFS-6c)
- /starmap dead links (deferred to AFS-10)
- Visual overlap bugs P1-NEW-6 through P1-NEW-9

---

## VERIFY-FIRST PRE-FLIGHT (MANDATORY)

**Stop for Jix approval after pre-flight before any code change.**

### Pre-flight Task 0.1 — confirm live state matches SKILL

Run from voidexa repo root:

```powershell
# Verify HEAD is unchanged
git status
git log origin/main --oneline -3
# Expected HEAD: 9b7e51a
```

If HEAD ≠ `9b7e51a`, stop and reconcile with Jix.

### Pre-flight Task 0.2 — grep target strings

```powershell
# Fix 1: /products trading return
git grep -n "313%" -- "*.tsx" "*.ts" "*.json"
git grep -n "313 backtest" -- "*.tsx" "*.ts" "*.json"
git grep -n "+313" -- "*.tsx" "*.ts" "*.json"

# Fix 2: /trading-hub leaderboard row 1
git grep -n "357.0" -- "*.tsx" "*.ts" "*.json"
git grep -n "357%" -- "*.tsx" "*.ts" "*.json"
git grep -nE "voidexa.{0,4}All.{0,4}Season" -- "*.tsx" "*.ts" "*.json"

# Fix 3: leaderboard sort
git grep -n "leaderboard" -- "*.tsx" "*.ts"
# Look for component that maps over rows without .sort()

# Fix 4: /quantum test counter
git grep -n "960" -- "app/quantum/**" "components/quantum/**" "lib/**"
git grep -n "960 tests" -- "*.tsx" "*.ts" "*.json"
git grep -n "960 Quantum" -- "*.tsx" "*.ts" "*.json"

# Fix 5: /quantum KCP-90 percentage
git grep -n "95% byte compression" -- "*.tsx" "*.ts" "*.json"
git grep -n "95% compression" -- "*.tsx" "*.ts" "*.json"

# Fix 6: homepage opacity (apostrophe is CURLY ’ — important for grep)
# Try both apostrophe variants:
git grep -n "Don.t show intro video" -- "*.tsx" "*.ts"
git grep -n "Skip quick menu" -- "*.tsx" "*.ts"
git grep -n "Replay intro video" -- "*.tsx" "*.ts"
```

### Pre-flight Task 0.3 — list files to edit

After greps, produce a table:

| Fix | File | Line(s) | Change type |
|---|---|---|---|
| 1 | `app/products/page.tsx` (likely) | TBD | string |
| 2 | `lib/data/leaderboard.ts` (likely) | TBD | string |
| 3 | leaderboard component | TBD | add `.sort()` |
| 4 | `app/quantum/page.tsx` | TBD | string × 3 |
| 5 | `app/quantum/page.tsx` | TBD | string × 2 |
| 6 | quick menu component | TBD | className opacity |

**STOP. Show table to Jix. Wait for explicit approval before continuing.**

---

## CONTEXT — VERIFIED LIVE STATE (Apr 28)

### `/products` — Trading Bot section (verified live)

Current marketing string:

> "+313% backtest return over 12 months vs buy-and-hold -6%"

Target:

> "+194.79% backtest return over 12 months vs buy-and-hold -6%"

**Reasoning:** `/trading` already shows the canonical `+194.79%` (validated SLUT 16). `/products` is stale.

### `/trading-hub` — Leaderboard table

Current visible state:

```
#  Bot                    Return    Sharpe  Max DD   Regime
1  voidexa All-Season     +357.0%   3.21    -8.4%    All Phases    ← real (house)
2  BTC Momentum Alpha     +218.7%   2.44    -14.2%   BTC Phase     ← placeholder
3  ETH Grid Master        +187.3%   2.11    -11.8%   ETH Phase     ← placeholder
4  AltSeason Hunter       +155.9%   1.88    -22.1%   Alt Phase     ← placeholder
6  Regime Switcher        +142.0%   1.72    -18.6%   All Phases    ← placeholder
5  Safe Harbor v2         +98.4%    2.89    -4.2%    Risk-Off      ← placeholder
7  MACD Crossover Pro     +76.3%    1.34    -25.0%   BTC Phase     ← placeholder
```

**Confirmed via 04_KNOWN_ISSUES SLUT 16:** All 6 community bot rows below row 1 are mock/seed placeholders. They will be replaced with real users when upload-flow ships. Only row 1 (voidexa All-Season house) is real.

Two bugs:

1. **Fix 2:** Row 1 (house bot) shows `+357.0%` — should be `+194.79%` (matches house bot card above table + /trading canonical)
2. **Fix 3:** Sort order is `1, 2, 3, 4, 6, 5, 7` — should sort all rows by `total_return DESC`. After fix:

```
1  BTC Momentum Alpha     +218.7%   ← placeholder rises to top
2  voidexa All-Season     +194.79%  ← house bot drops to #2
3  ETH Grid Master        +187.3%
4  AltSeason Hunter       +155.9%
5  Regime Switcher        +142.0%
6  Safe Harbor v2         +98.4%
7  MACD Crossover Pro     +76.3%
```

**This is fine** — the placeholders are throwaway. When real users populate the table, the sort handles it correctly. No need for special "pin house bot" logic.

### `/quantum` — Marketing strings (verified live)

Locations of `960`:
1. Top badge: `LIVE · 960 tests`
2. Body: `960 Quantum tests passed`
3. Footer: `KCP-90 middleware active · 95% compression · 960 Quantum tests passed · Built by voidexa · March 28, 2026`

Locations of `95%`:
1. Body: `95% byte compression integrated as middleware in Quantum`
2. Footer: `KCP-90 middleware active · 95% compression`

**Test counter target:** `1324` (matches voidexa frontend test count post AFS-18c, jf. SLUT 16 rule — each page shows hardcoded marketing display).

**KCP-90 % target:** `~93%` (locked in this chat 2026-04-28 — closest honest representation of v0.4.0 deployed reality).

Replace strings:
- `95% byte compression integrated as middleware in Quantum` → `~93% byte compression integrated as middleware in Quantum`
- `95% compression` → `~93% compression`

### Homepage quick menu — opacity bugs (verified live)

Three elements at bottom of quick menu, all overlap with the planet/nebula background imagery:

```html
<label>
  <input type="checkbox" />
  <span>Don't show intro video on future visits</span>  <!-- low opacity -->
</label>
<label>
  <input type="checkbox" />
  <span>Skip quick menu on future visits (go directly to star map)</span>  <!-- low opacity -->
</label>
<button>Replay intro video</button>  <!-- low opacity -->
```

**Apostrophe note:** The text on the live page uses CURLY apostrophe `’` (U+2019), not straight `'`. Grep needs to handle both.

**Fix:** Apply `opacity: 0.85` (or remove existing low opacity utility class) + add a semi-transparent dark backdrop behind the labels OR a `text-shadow` for legibility against the planet background. Pick whichever is simplest in existing component.

**Acceptance:** Visually readable against the Earth-planet rendered behind them. Test in incognito with hard reload.

---

## TASKS (post pre-flight approval)

### Task 1 — Backup tag
```powershell
git tag backup/pre-afs-fix-combo-20260428 9b7e51a
git push origin backup/pre-afs-fix-combo-20260428
```

### Task 2 — Commit this SKILL
```powershell
git add SKILL.md   # or wherever SKILLs live in repo
git commit -m "skill(afs-fix-combo): marketing accuracy + homepage opacity"
git push origin main
```

### Task 3 — Fix 1: /products trading return
Replace `+313%` with `+194.79%` at the location identified in pre-flight Task 0.2/0.3.

Commit:
```
fix(afs-fix-combo): /products trading return 313% to 194.79%
```

### Task 4 — Fix 2 + 3: /trading-hub leaderboard

- Fix 2: change house bot return string in seed/mock data from `357.0` to `194.79`
- Fix 3: add `.sort((a, b) => b.total_return - a.total_return)` (or equivalent) to leaderboard render component

Commit:
```
fix(afs-fix-combo): leaderboard house bot return + sort DESC
```

### Task 5 — Fix 4 + 5: /quantum strings

Replace all 3 occurrences of `960` with `1324`.
Replace 2 occurrences of `95%` with `~93%`.

Commit:
```
fix(afs-fix-combo): /quantum test counter + kcp-90 percentage marketing
```

### Task 6 — Fix 6: homepage opacity

Update quick-menu label/button styling so the 3 elements are legible against planet background. Suggested: opacity ≥ 0.85 + light text-shadow OR semi-transparent background behind labels.

Commit:
```
fix(afs-fix-combo): homepage quick menu label opacity + legibility
```

### Task 7 — Test additions

Add Vitest assertions to lock the fixed strings in place:

- `tests/afs-fix-combo.test.ts` (or extend existing /products /trading-hub /quantum / homepage tests):
  - `/products` page contains `194.79`, does NOT contain `313%`
  - `/trading-hub` mock data house bot return = `194.79`
  - leaderboard rows are sorted by `total_return DESC`
  - `/quantum` page contains `1324`, does NOT contain `960`
  - `/quantum` page contains `~93%`, does NOT contain `95%`
  - homepage quick-menu labels have computed opacity ≥ 0.75 (or className assertion)

Target test count delta: ~+8-12 assertions.

Commit:
```
test(afs-fix-combo): lock marketing strings + sort + opacity
```

### Task 8 — Final tag + push
```powershell
git tag sprint-afs-fix-combo-complete
git push origin main
git push origin sprint-afs-fix-combo-complete

git status                              # must be clean
git log origin/main --oneline -5        # verify all commits on remote
```

### Task 9 — Live verification (≥90s after push)

Wait minimum 90 seconds after final push for Vercel deploy. Then via Claude in Chrome (incognito + hard reload):

1. `/products` — verify `194.79` shown, `313` gone
2. `/trading-hub` — verify house bot = 194.79, all rows sorted DESC by return
3. `/quantum` — verify `1324`, `~93%` shown, `960`/`95%` gone
4. `/` — verify quick-menu labels readable

---

## DEFINITION OF DONE

- [ ] SKILL committed FIRST (before any code)
- [ ] Backup tag `backup/pre-afs-fix-combo-20260428` pushed
- [ ] Pre-flight grep results shown to Jix
- [ ] All 6 fixes implemented
- [ ] Tests green at sprint end count (1324 + ~8-12 = ~1332-1336)
- [ ] Build succeeds (`npm run build`)
- [ ] Lint baseline unchanged (no new issues)
- [ ] Committed + tagged + pushed
- [ ] `git status` clean post-push
- [ ] `git log origin/main --oneline -7` shows commits on remote
- [ ] Tag `sprint-afs-fix-combo-complete` on remote
- [ ] Wait ≥90s for Vercel deploy
- [ ] Hard-refresh incognito live-verify (4 routes)
- [ ] CLAUDE.md updated + uploaded to Project Knowledge at SLUT
- [ ] INDEX deltas delivered at SLUT (04, 08, 11)
- [ ] No regressions on previously-shipped features (homepage cinematic, Sovereign Sky pending, /cards, /manual)

---

## ROLLBACK

```powershell
git reset --hard backup/pre-afs-fix-combo-20260428
git push origin main --force-with-lease
git push origin :refs/tags/sprint-afs-fix-combo-complete
```

No data migrations. No schema changes. Pure code.

---

## RISKS

- **Low risk overall** — all fixes are string/CSS scope.
- **Curly vs straight apostrophe** in homepage labels — pre-flight grep handles both, but watch for missed matches.
- **Multiple `960`/`95%` occurrences** — grep all of them, don't stop at first hit.
- **Lint baseline** — 221 pre-existing issues (per AFS-7/6a/6g/18 precedent). Don't introduce new ones; existing are AFS-22 territory.

---

## CLAUDE CODE EXECUTION COMMAND

After Jix approves SKILL:

```powershell
claude --dangerously-skip-permissions
```

Then point Claude Code at this SKILL.md.
