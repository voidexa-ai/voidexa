# SKILL — AFS-10-FIX-7: Starmap Nodes Cleanup

**Sprint:** AFS-10-FIX-7
**Parent sprint:** AFS-10 (structural scope, originally locked SLUT 21)
**Type:** Bugfix (data cleanup, no UI scope)
**Priority:** P0 (top priority for SLUT 25 per Jix instruction)
**Estimated time:** 30-45 min
**Authored:** SLUT 25 (Apr 30 2026)

---

## CONTEXT

SLUT 21 locked the authoritative 10-node planet mapping for `/starmap/voidexa`. AFS-10 main sprint (shipped SLUT 23) wired **12 nodes** instead of 10. The 2 extra nodes (`about` + `ghost-ai`) and 1 wrongly-kept node (`trading`) violate the locked mapping.

Live audit at SLUT 25 start (Apr 30 2026 via Claude in Chrome bridge) confirmed:
- `/starmap/voidexa` shows 12 labeled nodes
- `about` (golden globe) and `Void Pro AI` (= ghost-ai, purple) still rendering
- `AI Trading` and `Trading Hub` rendering as 2 separate planets (should be 1 per SLUT 21)

This sprint removes ONLY the 3 wrong nodes from `components/starmap/nodes.ts`. No texture changes, no sphere/camera changes, no other routes touched.

**The original SLUT 23 plan was AFS-10-FIX-3 — but FIX-3 through FIX-6 were used in SLUT 24 for camera+sphere+overlay work. This sprint takes the next available number: FIX-7.**

---

## SLUT 21 LOCKED 10-NODE MAPPING (verbatim — DO NOT re-derive)

| # | Node ID | Label | Texture | Route |
|---|---|---|---|---|
| 1 | voidexa | voidexa sun | `/textures/planets/voidexa.png` | `/` |
| 2 | station | Space Station | `/textures/planets/spacestation_planet.png` | `/station` |
| 3 | apps | Apps | `/textures/planets/pink.png` | `/apps` |
| 4 | quantum | Quantum (samlet) | `/textures/planets/saturen_like_rings.png` | `/quantum` |
| 5 | trading-hub | Trading (samlet) | `/textures/planets/icy_blue.png` | `/trading-hub` |
| 6 | services | Services | `/textures/planets/lilla.png` | `/services` |
| 7 | game-hub | Game Hub | `/textures/planets/red_rocky.png` | `/game-hub` |
| 8 | ai-tools | AI Tools | `/textures/planets/earth.png` | `/ai-tools` |
| 9 | contact | Contact | `/textures/planets/purpel-pink.png` | `/contact` |
| 10 | claim-your-planet | Claim Your Planet | `/textures/planets/pastel_green.png` | `/claim-your-planet` |

**Reserved (NOT wired as nodes):**
- `orange.png` — fri til fremtidig node
- `goldenblue.png` — gemt til første rigtige Pioneer planet-claim

**EXPLICITLY EXCLUDED FROM STARMAP (must be removed):**
- `about` — was old node, removed from scope per SLUT 21
- `ghost-ai` (Void Pro AI) — sub-product of `/quantum` landing page, NOT a separate planet
- `trading` (AI Trading) — merged into `trading-hub` per SLUT 21

---

## SCOPE

### IN SCOPE
1. Remove `about` node from `components/starmap/nodes.ts`
2. Remove `ghost-ai` node from `components/starmap/nodes.ts`
3. Remove `trading` (AI Trading) node from `components/starmap/nodes.ts`
4. Verify the 10 correct nodes still wire to their textures per SLUT 21 mapping
5. Update tests that reference the 3 removed nodes
6. Live verify on `/starmap/voidexa`: only 10 nodes visible

### OUT OF SCOPE
- Sphere radius / camera FOV / OrbitControls (locked at sphere=800, galaxy z=38, system z=12 from SLUT 24)
- Any other route or page (`/about` route stays, `/trading` route stays — Sprint B handles `/trading` content merge)
- Any other component
- Texture file replacements
- 308 redirects (Sprint B)
- Page restructure (Sprint C)

---

## PRE-FLIGHT (MANDATORY — STOP at checkpoint)

### Task 0.1 — Repo state baseline

```bash
cd C:\Users\Jixwu\Desktop\voidexa
git status
git log origin/main --oneline -3
```

**Expected:**
- HEAD = `e3af4cf` (post AFS-10-FIX-6) or newer
- Working tree clean

**STOP if:** Working tree dirty. Resolve first.

### Task 0.2 — Backup tag

```bash
git tag backup/pre-afs-10-fix-7-20260430
git push origin backup/pre-afs-10-fix-7-20260430
```

### Task 0.3 — Read current nodes.ts

```bash
cat components/starmap/nodes.ts
```

**Expected findings:**
- 12 node entries (10 correct + about + ghost-ai + trading)
- Each node has: id, label, position, texture path, plus other props (color, size, planetType, ringMaterial?, etc.)

**STOP and report:**
```
PRE-FLIGHT REPORT — AFS-10-FIX-7

0.1 Repo state: HEAD [hash], clean
0.2 Backup tag: pushed
0.3 nodes.ts current state:
    - Total nodes: [N]
    - Nodes to remove: about, ghost-ai, trading
    - Nodes to keep: voidexa, station, apps, quantum, trading-hub, services, game-hub, ai-tools, contact, claim-your-planet
    - Texture wiring per kept node: [list each id → texture path]
    - Any other props that need preserving: [list]
```

**WAIT FOR JIX APPROVAL.** Do NOT proceed to Task 1.

---

### Task 0.4 — Find all references to removed nodes

```bash
grep -rn "'about'\|\"about\"\|'ghost-ai'\|\"ghost-ai\"\|'trading'\|\"trading\"" --include="*.ts" --include="*.tsx" --include="*.test.ts" --include="*.test.tsx" components/ app/ tests/ lib/ 2>/dev/null | grep -v node_modules
```

**Categorize results:**
- Files where `'trading'` refers to the ROUTE `/trading` (page component, link href) → DO NOT TOUCH
- Files where `'trading'` refers to the NODE id (in nodes.ts data, starmap tests) → MUST UPDATE
- Files where `'about'` refers to ROUTE `/about` (page, link, nav) → DO NOT TOUCH
- Files where `'about'` refers to NODE id → MUST UPDATE
- Files where `'ghost-ai'` appears at all → context-check; ghost-ai is ONLY a node id, no route exists

**STOP and report categorized list to Jix.** Do NOT touch route/page references.

---

### 🔴 CHECKPOINT 1 — MANDATORY STOP

After Task 0.1-0.4, output the pre-flight report + categorized grep results.

**WAIT FOR JIX EXPLICIT APPROVAL** (e.g. "go" or "proceed").

Do NOT continue to Task 1 without approval.

---

## TASK 1 — REMOVE 3 NODES FROM nodes.ts

Edit `components/starmap/nodes.ts`:
1. Delete the entire `{ id: 'about', ... }` block
2. Delete the entire `{ id: 'ghost-ai', ... }` block
3. Delete the entire `{ id: 'trading', ... }` block (NOT `'trading-hub'` — keep that one)

Verify the resulting array contains exactly 10 nodes in this order (or whatever order existed — preserve order, just remove the 3):
- voidexa, station, apps, quantum, trading-hub, services, game-hub, ai-tools, contact, claim-your-planet

Run typecheck:
```bash
npx tsc --noEmit
```

**STOP if:** Typecheck fails. Report errors.

---

## TASK 2 — UPDATE TESTS

For each test file flagged in Task 0.4 that references removed node ids:

**Pattern A — Test asserts node EXISTS (must remove or flip assertion):**
```ts
expect(nodes.find(n => n.id === 'about')).toBeDefined()
// → DELETE this assertion entirely OR flip to:
expect(nodes.find(n => n.id === 'about')).toBeUndefined()
```

**Pattern B — Test iterates all nodes and counts:**
```ts
expect(nodes.length).toBe(12)
// → UPDATE to:
expect(nodes.length).toBe(10)
```

**Pattern C — Test iterates and asserts each id is in expected set:**
```ts
const expectedIds = ['voidexa', 'station', 'apps', 'quantum', 'trading-hub', 'services', 'game-hub', 'ai-tools', 'contact', 'claim-your-planet', 'about', 'ghost-ai', 'trading']
// → REMOVE 'about', 'ghost-ai', 'trading' from list
```

**Pattern D — Test renders starmap and checks for label text:**
```ts
expect(screen.queryByText(/About/i)).toBeInTheDocument()
// → If this asserts About PLANET, delete. If asserts About NAV LINK, keep.
```

**Run tests:**
```bash
npm test -- --run components/starmap
npm test -- --run
```

**Expected:** All tests green. Test count = 1415 - (removed assertions) + (any new assertions added). Report exact delta.

**STOP if:** Tests fail. Report which.

---

## TASK 3 — ADD REGRESSION TEST

Create `components/starmap/__tests__/afs-10-fix-7-removed-nodes.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { nodes } from '../nodes'

describe('AFS-10-FIX-7 — removed nodes per SLUT 21 lock', () => {
  it('does not include about node on starmap', () => {
    expect(nodes.find(n => n.id === 'about')).toBeUndefined()
  })

  it('does not include ghost-ai node on starmap', () => {
    expect(nodes.find(n => n.id === 'ghost-ai')).toBeUndefined()
  })

  it('does not include trading node on starmap (merged to trading-hub)', () => {
    expect(nodes.find(n => n.id === 'trading')).toBeUndefined()
  })

  it('includes exactly 10 nodes per SLUT 21 lock', () => {
    expect(nodes.length).toBe(10)
  })

  it('includes all 10 SLUT 21 mapped nodes', () => {
    const expectedIds = [
      'voidexa', 'station', 'apps', 'quantum', 'trading-hub',
      'services', 'game-hub', 'ai-tools', 'contact', 'claim-your-planet',
    ]
    const actualIds = nodes.map(n => n.id).sort()
    expect(actualIds).toEqual(expectedIds.sort())
  })
})
```

Run the new test:
```bash
npm test -- --run afs-10-fix-7-removed-nodes
```

**Expected:** 5/5 green.

---

## TASK 4 — BUILD VERIFICATION

```bash
npm run build
```

**Expected:** Build succeeds. No new warnings about missing routes for removed nodes.

**STOP if:** Build fails.

---

## TASK 5 — COMMIT + TAG + PUSH

```bash
git add components/starmap/nodes.ts
git add components/starmap/__tests__/afs-10-fix-7-removed-nodes.test.ts
git add [any test files updated in Task 2]
git status
```

**Verify:** Only the expected files staged. No accidental other changes.

```bash
git commit -m "fix(afs-10-fix-7): remove about + ghost-ai + trading nodes from starmap

Per SLUT 21 locked 10-node mapping. About and Void Pro AI are not
starmap planets. Trading was merged into trading-hub. Restores
authoritative node count to 10.

Tests: +5 (regression suite for removed nodes)
Routes /about, /trading, /quantum unchanged."

git tag sprint-afs-10-fix-7-complete
git push origin main
git push origin sprint-afs-10-fix-7-complete
```

**Post-push verify:**
```bash
git status                              # working tree clean
git log origin/main --oneline -3        # commit on remote
```

---

## TASK 6 — LIVE VERIFY (wait ≥90s for Vercel deploy)

After deploy:

1. Hard-refresh incognito → `https://voidexa.com/starmap/voidexa`
2. Count visible labeled planets: must be **10** (not 12)
3. Verify ABSENT: "About", "Void Pro AI", "AI Trading"
4. Verify PRESENT: voidexa, Space Station, Apps, Quantum, Trading Hub, Services, Game Hub, AI Tools, Contact, Yours? (= claim-your-planet)
5. Verify regular routes still work:
   - `/about` → loads About page
   - `/trading` → loads AI Trading product page (Sprint B will merge content into /trading-hub later)
   - `/quantum` → loads Quantum page (Void Pro AI accessible via card here per AFS-10)

**Use Claude in Chrome bridge to confirm DOM:**
```js
// Run in /starmap/voidexa console:
const labels = Array.from(document.querySelectorAll('canvas + div, [data-node-label]'))
  .map(el => el.textContent?.trim()).filter(Boolean)
console.log({ count: labels.length, labels })
```

Expected: 10 labels. If different, something went wrong.

---

## DEFINITION OF DONE

- [ ] SKILL.md committed FIRST (this file, before any code)
- [ ] Backup tag `backup/pre-afs-10-fix-7-20260430` pushed
- [ ] `nodes.ts` has exactly 10 nodes
- [ ] Removed: about, ghost-ai, trading
- [ ] Kept (10): voidexa, station, apps, quantum, trading-hub, services, game-hub, ai-tools, contact, claim-your-planet
- [ ] Regression test file created (`afs-10-fix-7-removed-nodes.test.ts`) with 5 assertions, all green
- [ ] Existing tests updated where they referenced removed node ids — all green
- [ ] `npm test` full suite green (count = 1415 - removed assertions + 5 new)
- [ ] `npm run build` succeeds
- [ ] Committed + tagged `sprint-afs-10-fix-7-complete` + pushed to origin/main
- [ ] `git status` clean post-push
- [ ] `git log origin/main --oneline -3` confirms commit on remote
- [ ] Wait ≥90s for Vercel deploy
- [ ] Hard-refresh incognito live-verify on `/starmap/voidexa` shows exactly 10 labeled planets
- [ ] About / Void Pro AI / AI Trading planets ABSENT from /starmap/voidexa
- [ ] `/about`, `/trading`, `/quantum` routes still accessible as regular pages
- [ ] No regressions on other starmap features (sphere, overlays, camera — all SLUT 24 fixes preserved)
- [ ] Same-day backup verification (per AFS-46 rule, when active)

---

## ROLLBACK PROCEDURE (if something breaks)

```bash
git reset --hard backup/pre-afs-10-fix-7-20260430
git push origin main --force-with-lease
git push origin :refs/tags/sprint-afs-10-fix-7-complete  # delete remote tag
git tag -d sprint-afs-10-fix-7-complete                  # delete local tag
```

Then: STOP, search past chats, re-author SKILL with corrected scope.

---

## RISKS

- **R1 — Removed node breaks an unexpected import.** Mitigation: Task 0.4 grep covers this. If grep misses something (rare), build will fail in Task 4.
- **R2 — Test count drift.** Mitigation: Report exact delta in Task 2 + 3. Don't claim "tests green" without count.
- **R3 — Confusing `'trading'` (node id) vs `/trading` (route).** Mitigation: Task 0.4 explicit categorization step. Route references stay.
- **R4 — `/about` page link in nav uses `'about'` somewhere unrelated to nodes.ts.** Mitigation: Task 0.4 categorization. Only nodes.ts data + starmap tests touched.

---

## RULES APPLIED (from SLUT 23 corrections)

- **Rule A:** Searched conversation_search + project_knowledge_search before authoring this SKILL ✅
- **Rule B:** SLUT 21 mapping is the authoritative decision — no defaults proposed ✅
- **Rule C:** SKILL committed before code ✅
- **Rule D:** SLUT 21 + SLUT 23 lock decisions re-read in chat scroll-back ✅
- **Rule E:** SLUT 21 mapping referenced verbatim from 16_AUDIT_ROADMAP ✅

---

# END SKILL — AFS-10-FIX-7
