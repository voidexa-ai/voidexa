# SKILL — AFS-10-FIX-9: Spacing Rebalance + Label Readability

**Sprint:** AFS-10-FIX-9
**Parent sprint:** AFS-10 (visual polish layer, follow-up to FIX-8)
**Type:** Visual tuning (data + label component)
**Priority:** P1 (visual polish — Jix observed 3 issues on FIX-8 result)
**Estimated time:** 30-45 min
**Authored:** SLUT 25 (Apr 30 2026)

---

## CONTEXT

After AFS-10-FIX-8 shipped (3.5x size + 2.0x position + 1.5x sun), Jix uploaded a screenshot of live `/starmap/voidexa` showing 3 problems:

1. **Near cluster crowded against sun** — Apps + Game Hub + Services + Quantum sit too close to voidexa center; planets nearly overlap with sun glow
2. **Labels too small** — node labels (id/title + subtitle) are visually undersized vs the now-larger planets
3. **Far planets isolated** — Trading Hub + Claim-your-planet sit far out at the edge, looking detached from the cluster

Root cause of problem 1+3: position multiplier 2.0× was applied uniformly. Near planets (small original distance) became MORE crowded relative to their new size. Far planets (large original distance) drifted further out.

This sprint:
- **Reduces position multiplier** from 2.0× to **1.5×** uniformly — pulls all planets back toward middle distance
- **Bumps node label font size** by **1.75×** — readability without dominating
- **Keeps sun size at 0.9** (FIX-8 value) — already correct per Jix
- **Keeps satellite size at FIX-8 values (3.5×)** — they're correctly sized, just badly spaced

---

## CRITICAL — POSITION MULTIPLIER MATH

FIX-8 applied position × 2.0 to ORIGINAL (pre-FIX-8) values. Current `nodes.ts` positions are now ORIGINAL × 2.0.

**To get to "ORIGINAL × 1.5" target:** divide current position by (2.0 / 1.5) = **÷ 1.3333** (or × 0.75).

DO NOT multiply current values by 1.5 — that would compound to ORIGINAL × 3.0.

**Worked examples (current → target):**

| ID | Current position (FIX-8) | Target position (÷ 1.333) |
|---|---|---|
| apps | [-16, 6, -24] | [-12, 4.5, -18] |
| ai-tools | [0, -12, -32] | [0, -9, -24] |
| services | [20, -4, -28] | [15, -3, -21] |
| game-hub | [12, 8, -20] | [9, 6, -15] |
| contact | [16, 12, -40] | [12, 9, -30] |
| quantum | [24, -12, -64] | [18, -9, -48] |
| trading-hub | [-12, 16, -72] | [-9, 12, -54] |
| station | [6, 8, -40] | [4.5, 6, -30] |
| claim-your-planet | [-24, -8, -80] | [-18, -6, -60] |

**Distance from origin (current → target):**

| ID | Current distance | Target distance |
|---|---|---|
| apps | 29.46 | 22.10 |
| ai-tools | 34.18 | 25.63 |
| services | 34.64 | 25.98 |
| game-hub | 24.66 | 18.49 |
| contact | 44.72 | 33.54 |
| quantum | 69.40 | 52.05 |
| trading-hub | 74.73 | 56.05 |
| station | 41.23 | 30.92 |
| claim-your-planet | 83.91 | 62.94 |

Max distance after FIX-9 = 62.94. **OrbitControls maxDistance 80 from FIX-8 stays comfortable.**

---

## SCOPE

### IN SCOPE
1. Update 9 satellite positions per table above (÷ 1.333 from current FIX-8 state)
2. Bump node label font size by 1.75× in label rendering component (likely `NodeMesh.tsx` or separate `NodeLabel.tsx`)
3. Verify labels remain readable but don't overflow planet bodies
4. Update tests if they assert exact position values
5. Live verify: spacing balanced, labels readable, near cluster breathes, far planets feel connected

### OUT OF SCOPE — DO NOT TOUCH
- `size` values (kept at FIX-8 levels: sun 0.9, satellites 1.23 average)
- `voidexa` size or position (locked correct at FIX-8)
- Sphere radius (800)
- Camera FOV / position / target
- OrbitControls maxDistance (80 stays — works for new max of 63)
- OrbitControls minDistance / target
- Node count, ids, routes, textures, colors, planetType
- Galaxy view (`/starmap`) — separate `companies.ts`
- NodeMesh rendering geometry (Saturn rings, Space Station modules — those scale with size)
- Background nebula
- "While I'm in here..." anything else

---

## PRE-FLIGHT (MANDATORY — STOP at checkpoint)

### Task 0.1 — Repo state baseline

```bash
cd C:\Users\Jixwu\Desktop\voidexa
git status
git log origin/main --oneline -3
```

**Expected:**
- HEAD = `b411945` (post AFS-10-FIX-8) or newer
- Working tree clean

**STOP if:** dirty tree.

### Task 0.2 — Backup tag

```bash
git tag backup/pre-afs-10-fix-9-20260430
git push origin backup/pre-afs-10-fix-9-20260430
```

### Task 0.3 — Verify current state matches expected FIX-8 values

```bash
cat components/starmap/nodes.ts
```

**Cross-check current positions against the "Current position (FIX-8)" column above.** They should match exactly. If any differ, STOP and report — math will be wrong.

### Task 0.4 — Find label rendering component + current font size

```bash
grep -rn "fontSize\|font-size\|font:" components/starmap/ 2>/dev/null
grep -rn "<Text\|<Html" components/starmap/ 2>/dev/null
ls components/starmap/
```

**Identify:**
- Which file renders the node labels (Apps / Services / etc text + subtitle)
- Whether labels use Three.js `<Text>` (drei) with fontSize prop, or HTML overlay (CSS class), or `<Html>` from drei
- Current fontSize / CSS font-size values for both the main label and the subtitle below it

**Report:**
```
PRE-FLIGHT REPORT — AFS-10-FIX-9

0.1 Repo state: HEAD [hash], clean
0.2 Backup tag: pushed
0.3 Position cross-check:
    [✅ All 9 positions match FIX-8 expected values | 🔴 mismatch on [list]]
0.4 Label rendering:
    File: [path]
    Render method: [drei Text | drei Html | CSS overlay | other]
    Main label fontSize: [value + unit]
    Subtitle fontSize: [value + unit]
    Other label-related styling that might need adjustment: [list]
```

---

### 🔴 CHECKPOINT 1 — MANDATORY STOP

After Task 0.1-0.4, output the pre-flight report.

**WAIT FOR JIX EXPLICIT APPROVAL** — possibly with adjusted label multiplier if 1.75× looks wrong given actual current font size, or with a different position target if 0.3 reveals something unexpected.

Lock format:
```
LOCKED:
- position_target: per SKILL table (÷ 1.333 from current FIX-8)
- label_main_multiplier: 1.75
- label_subtitle_multiplier: 1.75
- size: unchanged
- voidexa: unchanged
- maxDistance: unchanged at 80
```

---

## TASK 1 — UPDATE NODE POSITIONS

Edit `components/starmap/nodes.ts`:

For each of the 9 satellite nodes, replace position array with values from "Target position" column above. Round to 1 decimal where values aren't integers (e.g. 4.5, -3.0, -18.0).

Order in file: preserve existing order. Only `position` arrays change. Do NOT touch `size`, `id`, `label`, `route`, `texture`, `color`, `planetType`, or any other props.

**Verify count:** Still exactly 10 nodes after edit (10 incl voidexa).

Run typecheck:
```bash
npx tsc --noEmit
```

**STOP if:** typecheck fails.

---

## TASK 2 — BUMP LABEL FONT SIZE

In the label rendering file identified in Task 0.4:

- Multiply main label fontSize by 1.75×
- Multiply subtitle fontSize by 1.75×
- If label uses CSS, update CSS values
- If label uses drei `<Text fontSize={N}>`, update N
- If multiple label sizes exist (e.g. different per node type), apply 1.75× to ALL

**Round result:** if current is 0.16, target is 0.28. Keep similar decimal precision as original.

Run typecheck:
```bash
npx tsc --noEmit
```

**STOP if:** typecheck fails or font file missing (drei Text needs a font asset — verify it loads).

---

## TASK 3 — UPDATE TESTS

```bash
grep -rn "position:\s*\[\|position\[0\] ===\|fontSize\|font-size" tests/ components/starmap/__tests__/ 2>/dev/null | head -40
```

Categorize:
- Tests asserting exact position values from FIX-8 → MUST UPDATE to FIX-9 values
- Tests asserting exact fontSize → MUST UPDATE to new value
- Relative assertions (>, <, exists) → keep as-is

Run:
```bash
npm test -- --run components/starmap
npm test -- --run
```

**Expected:** All tests green. Report exact count delta.

---

## TASK 4 — ADD REGRESSION TEST

Create `components/starmap/__tests__/afs-10-fix-9-spacing-labels.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { nodes } from '../nodes'

describe('AFS-10-FIX-9 — spacing rebalance', () => {
  it('all satellite distances are between 15 and 65 from origin', () => {
    const satellites = nodes.filter(n => n.id !== 'voidexa')
    for (const node of satellites) {
      const [x, y, z] = node.position
      const distance = Math.sqrt(x*x + y*y + z*z)
      expect(distance).toBeGreaterThan(15)
      expect(distance).toBeLessThan(65)
    }
  })

  it('no satellite sits closer than 15 units to origin (no sun crowding)', () => {
    const satellites = nodes.filter(n => n.id !== 'voidexa')
    for (const node of satellites) {
      const [x, y, z] = node.position
      const distance = Math.sqrt(x*x + y*y + z*z)
      expect(distance).toBeGreaterThan(15)
    }
  })

  it('no satellite sits beyond 65 units from origin (no isolation)', () => {
    const satellites = nodes.filter(n => n.id !== 'voidexa')
    for (const node of satellites) {
      const [x, y, z] = node.position
      const distance = Math.sqrt(x*x + y*y + z*z)
      expect(distance).toBeLessThan(65)
    }
  })

  it('voidexa unchanged at origin', () => {
    const voidexa = nodes.find(n => n.id === 'voidexa')!
    expect(voidexa.position).toEqual([0, 0, 0])
    expect(voidexa.size).toBeCloseTo(0.9, 1)
  })

  it('all 10 nodes preserved (no cleanup regression)', () => {
    expect(nodes.length).toBe(10)
    const expectedIds = [
      'voidexa', 'station', 'apps', 'quantum', 'trading-hub',
      'services', 'game-hub', 'ai-tools', 'contact', 'claim-your-planet',
    ]
    expect(nodes.map(n => n.id).sort()).toEqual(expectedIds.sort())
  })
})
```

Run:
```bash
npm test -- --run afs-10-fix-9-spacing-labels
```

Expected: 5/5 green.

---

## TASK 5 — BUILD VERIFICATION

```bash
npm run build
```

**STOP if:** build fails.

---

## TASK 6 — COMMIT + TAG + PUSH

```bash
git add components/starmap/nodes.ts
git add [label rendering file from Task 0.4]
git add components/starmap/__tests__/afs-10-fix-9-spacing-labels.test.ts
git add [any test files updated in Task 3]
git status
```

**Verify:** only expected files staged.

```bash
git commit -m "fix(afs-10-fix-9): rebalance planet spacing + 1.75x label font

Position multiplier reduced from 2x to 1.5x (vs original pre-FIX-8
values) — pulls near cluster away from sun, brings far planets
back toward middle distance. Sizes unchanged. Labels bumped 1.75x
for readability against larger planets.

Distance range: now 18-63 (was 25-84).
maxDistance 80 unchanged."

git tag sprint-afs-10-fix-9-complete
git push origin main
git push origin sprint-afs-10-fix-9-complete
```

**Post-push verify:**
```bash
git status
git log origin/main --oneline -3
```

---

## TASK 7 — LIVE VERIFY (Jix-performed)

Wait ≥90s for Vercel deploy.

### 7.1 System view `/starmap/voidexa`
Hard-refresh incognito → check:
- ✅ Near planets (apps, game-hub, ai-tools, services) NO LONGER crowd voidexa sun — visible breathing space between sun and nearest planet
- ✅ Far planets (quantum, trading-hub, claim-your-planet) feel connected to the cluster, not isolated edge-dwellers
- ✅ Labels readable at default zoom — main label clearly legible, subtitle readable
- ✅ Labels don't overflow planet bodies grotesquely (slight overhang OK; massive overlap not OK)
- ✅ Saturn rings on Quantum still visible
- ✅ Space Station orbital ring + 4 modules still visible
- ✅ Sun still dominant, no clipping
- ✅ Zoom in/out still functional within 5–80 orbit range

### 7.2 Galaxy view `/starmap`
- ✅ NO change vs FIX-8 (companies.ts untouched)

### 7.3 Regression check
- ✅ No new console errors
- ✅ Tests still green (count = previous + 5 new from Task 4)
- ✅ All routes still load — `/about`, `/trading`, `/quantum`, `/void-pro-ai`, `/game-hub` (404 = pre-existing P0-NEW-8)

**If labels too big or too small:**
- Adjust label multiplier in a quick FIX-10 or polish patch (not rollback)

**If spacing still off:**
- Rollback if visually broken; otherwise tune in FIX-10 with revised multiplier

---

## DEFINITION OF DONE

- [ ] SKILL.md committed FIRST (this file)
- [ ] Backup tag `backup/pre-afs-10-fix-9-20260430` pushed
- [ ] Pre-flight report delivered + locks confirmed by Jix
- [ ] `nodes.ts` updated: 9 satellite positions per target table; sizes UNCHANGED; voidexa UNCHANGED
- [ ] Label font size bumped 1.75× in identified label component
- [ ] Existing tests updated where they referenced exact position/font values — all green
- [ ] Regression test file created (`afs-10-fix-9-spacing-labels.test.ts`) with 5 assertions, all green
- [ ] `npm test` full suite green (count delta reported)
- [ ] `npm run build` succeeds
- [ ] Committed + tagged `sprint-afs-10-fix-9-complete` + pushed
- [ ] `git status` clean post-push
- [ ] Wait ≥90s for Vercel deploy
- [ ] Jix live-verifies and signs off on visual result

---

## ROLLBACK

```bash
git reset --hard backup/pre-afs-10-fix-9-20260430
git push origin main --force-with-lease
git push origin :refs/tags/sprint-afs-10-fix-9-complete
git tag -d sprint-afs-10-fix-9-complete
```

---

## RISKS

- **R1 — Position math compounded.** Mitigation: SKILL provides explicit current → target table. Do NOT compute from scratch. Do NOT multiply current by 1.5.
- **R2 — Label font asset missing.** Mitigation: Task 0.4 identifies render method. If drei Text with custom font, verify font file path still resolves.
- **R3 — Labels overflow planets.** Mitigation: live verify in Task 7. If overflow grotesque, FIX-10 adjusts multiplier to 1.5× or 1.25×.
- **R4 — Tests assert FIX-8 positions.** Mitigation: Task 3 grep + categorize. Update or skip.
- **R5 — Position changes affect Saturn rings or Space Station modules visually.** They use `size * constant` for ring/module geometry — position doesn't affect ring scaling. Safe.

---

## RULES APPLIED

- **Rule A:** Searched conversation_search for prior label/spacing locks — none found ✅
- **Rule B:** Math verified — current values × (1.5 / 2.0) = ÷ 1.333. Explicit target table provided. No compound errors possible.
- **Rule C:** SKILL committed before code ✅
- **Rule D:** Locks from Jix in chat (1.5× position vs original, 1.75× font) explicitly captured here
- **Rule E:** Scope respects all FIX-3/4/5/6/7/8 locked items

---

# END SKILL — AFS-10-FIX-9
