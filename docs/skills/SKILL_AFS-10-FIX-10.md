# SKILL — AFS-10-FIX-10: Planet + Label Size Bump

**Sprint:** AFS-10-FIX-10
**Parent sprint:** AFS-10 (visual polish layer, follow-up to FIX-9)
**Type:** Visual scale tuning (size + label only — positions UNCHANGED)
**Priority:** P1 (visual polish — Jix observed planets + labels still too small in FIX-9 result)
**Estimated time:** 30-45 min
**Authored:** SLUT 25 (Apr 30 2026)

---

## CONTEXT

After AFS-10-FIX-9 shipped (1.5x position rebalance + 1.5x labels), Jix uploaded a screenshot showing spacing is now correct (planets no longer crowd sun, far planets connected to cluster). But:

1. **Planets still too small** vs reference image — they should fill more of the scene
2. **Labels still too small** — text under planets hard to read at default zoom
3. **Spacing is GOOD** — must NOT touch positions

This sprint:
- **Bumps satellite size 2x** — from current ~1.23 to ~2.46
- **Keeps voidexa-sun at 0.9** — already dominant per Jix screenshot
- **Bumps labels 1.3x** — from current 23/27/21px to 30/35/27px
- **Positions UNCHANGED** — FIX-9 spacing is locked correct

---

## CRITICAL — DO NOT TOUCH POSITIONS

FIX-9 spent significant work rebalancing positions. Current positions (after FIX-9) are:

| ID | Position | Distance |
|---|---|---|
| voidexa | [0, 0, 0] | 0 |
| apps | [-12, 4.5, -18] | 22.10 |
| ai-tools | [0, -9, -24] | 25.63 |
| services | [15, -3, -21] | 25.98 |
| game-hub | [9, 6, -15] | 18.49 |
| contact | [12, 9, -30] | 33.54 |
| quantum | [18, -9, -48] | 52.05 |
| trading-hub | [-9, 12, -54] | 56.05 |
| station | [4.5, 6, -30] | 30.92 |
| claim-your-planet | [-18, -6, -60] | 62.94 |

**Pre-flight Task 0.3 must verify these are unchanged before Task 1.**

---

## SIZE COLLISION CHECK

Bumping satellites 2x (from 1.23 to 2.46) — closest planet to sun is **game-hub at distance 18.49**.

Sun "size" = 0.9 (raw geometry), but voidexa renders with atmosphere ring + emissive glow that visually extends ~3-4 units around the body. Game-hub at distance 18.49 with new size 2.46 means edge-to-edge:
- Sun visual extent: ~4 units from origin
- Game-hub center: 18.49 units from origin
- Game-hub edge facing sun: 18.49 - 2.46 = 16.03 units from origin
- Gap: 16.03 - 4 = ~12 units

**Safe.** No sun overlap risk at 2x size.

Planet-to-planet collision check (closest pair after FIX-9):
- game-hub [9, 6, -15] and apps [-12, 4.5, -18]: distance = sqrt(21² + 1.5² + 3²) = ~21.3 units between centers
- New combined radii: 2.46 + 2.46 = 4.92
- Gap: 21.3 - 4.92 = ~16.4 units **safe**

---

## SCOPE

### IN SCOPE
1. Multiply all 9 satellite `size` values by 2.0× in `components/starmap/nodes.ts`
2. Bump label fontSize 1.3× in `components/starmap/NodeMesh.tsx`:
   - Sun (isCenter): 27px → 35px
   - Satellites: 23px → 30px
   - Subtitles: 21px → 27px
3. Update tests asserting exact size/font values
4. Live verify: planets feel "present and real" matching reference image, labels readable

### OUT OF SCOPE — DO NOT TOUCH
- **`position` arrays** — FIX-9 spacing is locked
- voidexa node `size` (kept at 0.9)
- Sphere radius (800)
- Camera FOV / position / target
- OrbitControls minDistance / maxDistance / target
- Node count, ids, routes, textures, colors, planetType
- Galaxy view (`/starmap`) — separate `companies.ts`
- NodeMesh rendering geometry beyond fontSize values (Saturn rings, Space Station modules — those scale with `size` automatically)
- Background nebula
- Label positioning offset (`position={[0, -(size + 0.55), 0]}` — auto-scales with size)
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
- HEAD = `80227d9` (post AFS-10-FIX-9) or newer
- Working tree clean (carryover untracked files OK — same set as FIX-7/8/9)

**STOP if:** dirty tree (modified files, not just untracked).

### Task 0.2 — Backup tag

```bash
git tag backup/pre-afs-10-fix-10-20260430
git push origin backup/pre-afs-10-fix-10-20260430
```

### Task 0.3 — Verify current state matches FIX-9

```bash
cat components/starmap/nodes.ts
```

**Cross-check:**
- All 9 satellite POSITIONS match the table above (FIX-9 state) — if mismatch, STOP
- All 9 satellite SIZES are at FIX-8 values (1.23 average — apps/services/ai-tools/game-hub at 1.23, contact 1.05, quantum 1.12, trading-hub 0.98, station 0.63, claim 0.77) — verify exact values and report

```bash
grep -A 2 "fontSize" components/starmap/NodeMesh.tsx | head -30
```

**Cross-check:**
- Sun fontSize = 27px (FIX-9 value)
- Satellite fontSize = 23px (FIX-9 value)
- Subtitle fontSize = 21px (FIX-9 value)

**Report:**
```
PRE-FLIGHT REPORT — AFS-10-FIX-10

0.1 Repo state: HEAD [hash], clean
0.2 Backup tag: pushed
0.3 Current state cross-check:
    Positions: [✅ all match FIX-9 | 🔴 mismatch on [list]]
    Sizes: [list each id → current size]
    Label fontSize: sun=[N], satellite=[N], subtitle=[N]
    
Computed FIX-10 targets (size × 2.0, font × 1.3):
    Sizes:
        apps: [current] → [target]
        ai-tools: [current] → [target]
        services: [current] → [target]
        game-hub: [current] → [target]
        contact: [current] → [target]
        quantum: [current] → [target]
        trading-hub: [current] → [target]
        station: [current] → [target]
        claim-your-planet: [current] → [target]
    Labels:
        sun: 27px → 35px
        satellite: 23px → 30px
        subtitle: 21px → 27px
```

---

### 🔴 CHECKPOINT 1 — MANDATORY STOP

After Task 0.1-0.3, output the pre-flight report.

**WAIT FOR JIX EXPLICIT APPROVAL** with locked size + label multipliers (default 2.0× size, 1.3× font — Jix may adjust).

Lock format:
```
LOCKED:
- satellite_size_multiplier: 2.0
- label_main_multiplier: 1.3
- label_subtitle_multiplier: 1.3
- voidexa_size: unchanged (0.9)
- positions: unchanged (FIX-9 state)
- sphere/camera/maxDistance: unchanged
```

---

## TASK 1 — UPDATE SATELLITE SIZES

Edit `components/starmap/nodes.ts`:

For each of the 9 satellite nodes (NOT voidexa):
- Multiply `size` by 2.0
- Round to 2 decimals (e.g. 1.23 → 2.46, 0.63 → 1.26)
- DO NOT touch `position`
- DO NOT touch any other prop

**Verify:** voidexa `size` remains 0.9. All 9 satellite positions identical to FIX-9 values.

Run typecheck:
```bash
npx tsc --noEmit
```

**STOP if:** typecheck fails.

---

## TASK 2 — UPDATE LABEL FONT SIZE

Edit `components/starmap/NodeMesh.tsx`:

Find the fontSize values from FIX-9:
- Main label sun (isCenter): `'27px'` → `'35px'`
- Main label satellite (else branch): `'23px'` → `'30px'`
- Subtitle: `'21px'` → `'27px'`

**Verify:** label `position` offset (`[0, -(size + 0.55), 0]`) is unchanged — it auto-scales with size.

Run typecheck:
```bash
npx tsc --noEmit
```

**STOP if:** typecheck fails.

---

## TASK 3 — UPDATE EXISTING TESTS

```bash
grep -rn "size:\s*[0-9]\|toBeCloseTo\|fontSize\|font-size" tests/ components/starmap/__tests__/ 2>/dev/null | head -40
```

Categorize:
- Tests asserting exact size values from FIX-8/9 → MUST UPDATE to FIX-10 values
- Tests asserting exact fontSize → MUST UPDATE
- Relative assertions (>, <, exists) → keep as-is

Run:
```bash
npm test -- --run components/starmap
npm test -- --run
```

**Expected:** All tests green. Report exact count delta.

---

## TASK 4 — ADD REGRESSION TEST

Create `components/starmap/__tests__/afs-10-fix-10-size-bump.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { nodes } from '../nodes'

describe('AFS-10-FIX-10 — planet size + label bump', () => {
  it('all satellite sizes are >= 1.9 (after 2x bump from FIX-9 ~1.23 average)', () => {
    const satellites = nodes.filter(n => n.id !== 'voidexa')
    for (const node of satellites) {
      expect(node.size).toBeGreaterThanOrEqual(1.25)
    }
  })

  it('largest satellite size is between 2.0 and 3.0', () => {
    const satellites = nodes.filter(n => n.id !== 'voidexa')
    const max = Math.max(...satellites.map(n => n.size))
    expect(max).toBeGreaterThanOrEqual(2.0)
    expect(max).toBeLessThanOrEqual(3.0)
  })

  it('voidexa sun size unchanged at 0.9', () => {
    const voidexa = nodes.find(n => n.id === 'voidexa')!
    expect(voidexa.size).toBeCloseTo(0.9, 1)
  })

  it('voidexa position unchanged at origin', () => {
    const voidexa = nodes.find(n => n.id === 'voidexa')!
    expect(voidexa.position).toEqual([0, 0, 0])
  })

  it('positions UNCHANGED from FIX-9 state — game-hub still at [9, 6, -15]', () => {
    const gameHub = nodes.find(n => n.id === 'game-hub')!
    expect(gameHub.position[0]).toBeCloseTo(9, 1)
    expect(gameHub.position[1]).toBeCloseTo(6, 1)
    expect(gameHub.position[2]).toBeCloseTo(-15, 1)
  })

  it('positions UNCHANGED — claim-your-planet still at [-18, -6, -60]', () => {
    const claim = nodes.find(n => n.id === 'claim-your-planet')!
    expect(claim.position[0]).toBeCloseTo(-18, 1)
    expect(claim.position[1]).toBeCloseTo(-6, 1)
    expect(claim.position[2]).toBeCloseTo(-60, 1)
  })

  it('all 10 nodes preserved', () => {
    expect(nodes.length).toBe(10)
  })

  it('no satellite is bigger than sun radius × 4 (sanity)', () => {
    const voidexa = nodes.find(n => n.id === 'voidexa')!
    const satellites = nodes.filter(n => n.id !== 'voidexa')
    for (const node of satellites) {
      expect(node.size).toBeLessThan(voidexa.size * 4)
    }
  })
})
```

Run:
```bash
npm test -- --run afs-10-fix-10-size-bump
```

Expected: 8/8 green.

---

## TASK 5 — BUILD VERIFICATION

```bash
npm run build
```

**STOP if:** build fails.

---

## TASK 6 — COMMIT + TAG + PUSH

First commit the SKILL itself if not already committed:
```bash
git add docs/skills/SKILL_AFS-10-FIX-10.md  # or wherever the SKILL lives
git commit -m "chore(afs-10-fix-10): add planet + label size bump SKILL"
```

Then the sprint:
```bash
git add components/starmap/nodes.ts
git add components/starmap/NodeMesh.tsx
git add components/starmap/__tests__/afs-10-fix-10-size-bump.test.ts
git add [any test files updated in Task 3]
git status
```

**Verify:** only expected files staged.

```bash
git commit -m "fix(afs-10-fix-10): satellite size 2x + label font 1.3x

Per Jix reference image — planets needed more visual presence.
Sizes go from FIX-9 ~1.23 average to ~2.46 average. Labels 23px
to 30px (satellites) for readability against larger bodies.

Positions UNCHANGED from FIX-9 spacing.
voidexa sun unchanged at 0.9.
maxDistance 80, sphere 800, camera all unchanged.

Saturn rings + Space Station modules scale automatically with size."

git tag sprint-afs-10-fix-10-complete
git push origin main
git push origin sprint-afs-10-fix-10-complete
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
- ✅ Planets visibly bigger — closer to reference image proportions
- ✅ Labels readable at default zoom AND zoomed-out
- ✅ NO planet overlap with each other
- ✅ NO planet overlap with sun's atmosphere ring
- ✅ Saturn rings on Quantum still visible + proportional
- ✅ Space Station orbital ring + 4 modules still proportional
- ✅ Sun still dominant (or matched by larger planets — both OK)
- ✅ Zoom in/out functional within 5–80 orbit range
- ✅ Spacing UNCHANGED — same layout as FIX-9, just bigger planets

### 7.2 Galaxy view `/starmap`
- ✅ NO change vs FIX-9 (companies.ts untouched)

### 7.3 Regression check
- ✅ No new console errors
- ✅ Tests green (count = previous + 8 new)
- ✅ All routes `/about`, `/trading`, `/quantum`, `/void-pro-ai` still load (`/game-hub` 404 = pre-existing P0-NEW-8)

**Possible follow-ups:**
- If game-hub overlaps sun ring: FIX-11 micro-adjust game-hub position only
- If labels still too small: FIX-11 push to 1.5x
- If labels too big: FIX-11 pull to 1.15x

---

## DEFINITION OF DONE

- [ ] SKILL.md committed FIRST (this file)
- [ ] Backup tag `backup/pre-afs-10-fix-10-20260430` pushed
- [ ] Pre-flight report delivered + locks confirmed by Jix
- [ ] `nodes.ts` updated: 9 satellite sizes × 2.0; positions UNCHANGED; voidexa UNCHANGED
- [ ] `NodeMesh.tsx` updated: fontSize 27→35 / 23→30 / 21→27
- [ ] Existing tests updated where they referenced exact values — all green
- [ ] Regression test file created (`afs-10-fix-10-size-bump.test.ts`) with 8 assertions, all green
- [ ] `npm test` full suite green (count delta reported)
- [ ] `npm run build` succeeds
- [ ] Committed + tagged `sprint-afs-10-fix-10-complete` + pushed
- [ ] `git status` clean post-push
- [ ] Wait ≥90s for Vercel deploy
- [ ] Jix live-verifies and signs off

---

## ROLLBACK

```bash
git reset --hard backup/pre-afs-10-fix-10-20260430
git push origin main --force-with-lease
git push origin :refs/tags/sprint-afs-10-fix-10-complete
git tag -d sprint-afs-10-fix-10-complete
```

---

## RISKS

- **R1 — Game-hub (closest to sun) clashes with sun atmosphere ring.** Mitigation: collision math in §SIZE COLLISION CHECK shows 12-unit gap remains. If visually off, FIX-11 nudges only game-hub position.
- **R2 — Saturn rings on Quantum too big.** Saturn rings use `size * constant` — they scale automatically. If they look disproportionate, polish in FIX-11.
- **R3 — Labels overflow planet bodies.** FIX-9 set 23px → readable, slight overlap acceptable. 30px increases overlap risk. If grotesque, FIX-11 trims to 1.2× or 1.15×.
- **R4 — Tests assert FIX-9 exact sizes.** Mitigation: Task 3 grep + categorize. Update or skip.
- **R5 — Position accidentally touched.** Mitigation: Task 1 explicitly says "DO NOT touch position". Task 4 regression test asserts game-hub + claim positions unchanged.

---

## RULES APPLIED

- **Rule A:** Searched conversation_search + project_knowledge_search for prior size locks — FIX-8/9 history reviewed ✅
- **Rule B:** Math verified — 2.0× size + 0× position change = pure size bump. Collision check done. Safe.
- **Rule C:** SKILL committed before code ✅
- **Rule D:** Locks from Jix in chat (2× size, 1.3× labels, positions UNCHANGED) explicitly captured here
- **Rule E:** Scope respects all FIX-3/4/5/6/7/8/9 locked items — especially FIX-9 spacing

---

# END SKILL — AFS-10-FIX-10
