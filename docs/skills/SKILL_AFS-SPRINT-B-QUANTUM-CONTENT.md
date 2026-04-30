# SKILL — Sprint B: Quantum Content Fix + Council Cleanup + Hero Debug

**Sprint type:** Bugfix sprint (live audit findings)
**Parent context:** AFS-10 chain (post Sprint A)
**Tag format:** `sprint-b-quantum-content-complete`
**Backup tag:** `backup/pre-sprint-b-quantum-content-20260501`
**Branch:** main
**Expected baseline at start:** HEAD = `9ca147a` (Sprint A), tests = 1515 green
**Execute with:** `claude --dangerously-skip-permissions`

---

## SCOPE (locked by Jix, SLUT 26 post live audit)

5 fixes on `/quantum` Council marketing page + 1 fix in topnav dropdown sub-label.

### Locked changes

1. **Top-fold hero broken (P0)** — debug why title + tagline don't render in first viewport. Currently only 3 badges show on empty black background; "Quantum" h1 + "Where AIs debate, disagree, and find truth." tagline only appear after scroll.

2. **"5 AI providers" → "4 AI providers"** in body copy + stats line. Two known locations:
   - Hero section paragraph: `5 AI providers debate your question in real-time.`
   - Stats card under interface preview: `Emerging from 5 providers`

3. **Council circle: remove Jix portrait** — currently 6 portraits arranged hexagonally around "QUANTUM" center. Jix (the founder, top-center on screenshot) must be removed. Keep the 4 AIs (Claude, GPT, Gemini, Perplexity) + Llama (intentional future-LLM placeholder).

4. **Council circle: enlarge AI portraits** — current portrait diameter is too small to read faces. Bump portrait size so they're clearly identifiable. The visual asset itself isn't being changed — only the rendered diameter via CSS / SVG sizing.

5. **Topnav dropdown sub-label fix** — Quantum Forge dropdown item currently reads `AI-assisted cockpit generator`. Replace with `Debate-to-build pipeline`.

### Explicit no-touch

- Captain's Log paragraph (any wording)
- Llama block in "Watch Them Debate" interface preview (Llama name + "still reading the Wikipedia article" reply stays)
- KCP-90 "March 28, 2026" date
- "Meet the team behind Quantum →" link
- All other dropdown items, labels, hrefs
- `/quantum-tools` landing page (built in Sprint A)
- Starmap nodes (built in Sprint A)
- HoverHUD CTA (built in Sprint A)
- "Quantum Council" topnav label (built in Sprint A)

---

## VERIFY-FIRST PRE-FLIGHT (mandatory — STOP for Jix approval after Checkpoint 1)

### Task 0.1 — Locate /quantum page source

```bash
ls -la app/quantum/page.tsx
wc -l app/quantum/page.tsx
```

Expected: file exists, around 951 lines per INDEX. Report exact line count.

### Task 0.2 — Find the "5 AI providers" string occurrences

```bash
grep -n "5 AI providers" app/quantum/page.tsx
grep -n "5 providers" app/quantum/page.tsx
grep -rn "5 AI providers" app/ components/ lib/
grep -rn "Emerging from 5 providers" app/ components/ lib/
```

**STOP and report to Jix:**
- Every file:line where "5 AI providers" or "5 providers" appears
- Whether occurrences are in JSX text, in a constants array, or in a component prop

### Task 0.3 — Find the Council circle component

The Council circle on `/quantum` shows 6 portraits hexagonally with "QUANTUM" + "CONSENSUS 72%" center. Search for it:

```bash
grep -rn "CONSENSUS" app/ components/
grep -rn "QUANTUM.*CONSENSUS\|consensus.*72" app/ components/
grep -rn "Jix\|founder.*portrait\|creator.*image" app/ components/
ls components/quantum/ 2>/dev/null
ls components/sections/quantum/ 2>/dev/null
find components -type f -name "*ouncil*"
find components -type f -name "*ircle*"
```

**STOP and report to Jix:**
- Component file path that renders the 6-portrait circle
- Whether portraits are sourced from an array (e.g. `const PARTICIPANTS = [...]`) or hardcoded JSX
- Exact entry to remove (Jix / "the creator" / similar identifier)
- Current portrait size (CSS class or SVG attribute) and the file that controls it

### Task 0.4 — Diagnose top-fold hero broken state

The hero currently shows only 3 badges in first viewport. After scroll, "Quantum" h1 + tagline appear. Possible causes:

```bash
grep -n "min-h-screen\|h-screen\|paddingTop\|pt-\\[" app/quantum/page.tsx | head -30
grep -rn "QuantumHero\|HeroSection" app/quantum components/quantum 2>/dev/null
```

Look for:
- Excessive top padding pushing content below the fold
- An empty wrapper before the hero content (placeholder)
- A hero component that uses `opacity-0` / `translate-y-*` initial state with no animation triggering it
- A spacer div with fixed height
- `mt-screen` / `pt-screen` / similar full-viewport offset

**STOP and report to Jix:**
- Component file containing the hero
- The exact element / class causing the empty-top behavior
- Proposed minimal fix (e.g. remove the spacer, fix a missed `motion.div` that never animates in, lower a `pt-` value)

### Task 0.5 — Find the topnav dropdown sub-label

Sprint A modified `Navigation.tsx` line 63 area (Quantum Council rename). Find the Quantum Forge sub-label nearby:

```bash
grep -n "AI-assisted cockpit generator\|cockpit generator" components/ -r
grep -n "Quantum Forge" components/ -r
```

**STOP and report to Jix:**
- File:line of `AI-assisted cockpit generator` string
- Whether it's a description prop, a `<p>` text node, or in a config array

### Checkpoint 1 — Pre-flight summary

Output this summary and wait for Jix's GO:

```
PRE-FLIGHT SUMMARY
==================
/quantum page:        app/quantum/page.tsx (<line count>)

"5 AI providers" hits:
  - <file>:<line>  "<context snippet>"
  - <file>:<line>  "<context snippet>"

"Emerging from 5 providers" hit:
  - <file>:<line>  "<context snippet>"

Council circle:
  Component:        <path>
  Portrait source:  <array | hardcoded JSX>
  Jix entry:        <line / array index / JSX block>
  Portrait size:    <current CSS / SVG attr> at <file>:<line>
  Proposed size:    <new value>

Hero broken cause (proposed):
  Root cause:       <description>
  File:             <path>:<line>
  Fix approach:     <description>

Forge sub-label:
  File:             <path>:<line>
  Current text:     "AI-assisted cockpit generator"
  Target text:      "Debate-to-build pipeline"

Test files to add:  __tests__/sprint-b-*.test.ts
Expected new tests: 5-8
Expected end count: 1520-1523 (1515 + new)
```

**Wait for Jix "GO".** Do not start Task 1 until approved.

---

## TASK 1 — Commit SKILL first

```bash
git checkout main
git pull origin main
git tag backup/pre-sprint-b-quantum-content-20260501
git push origin backup/pre-sprint-b-quantum-content-20260501

git add SKILL_AFS-SPRINT-B-QUANTUM-CONTENT.md
git commit -m "chore(sprint-b): add Quantum content fix + Council cleanup + hero debug SKILL"
git push origin main
```

Verify:
```bash
git log origin/main --oneline -2
git status
```

Tree must be clean before Task 2.

---

## TASK 2 — Fix "5 AI providers" → "4 AI providers"

For every occurrence found in Task 0.2:

- `5 AI providers` → `4 AI providers`
- `5 providers` (when referring to AI count) → `4 providers`
- `Emerging from 5 providers` → `Emerging from 4 providers`

**Constraint:** Only change occurrences that refer to AI provider count. If "5" appears in unrelated context (test counts, version numbers, stats unrelated to providers) — leave it. The grep in Task 0.2 should have isolated only the relevant ones.

After change, confirm:
```bash
grep -n "5 AI providers\|5 providers\|Emerging from 5" app/quantum/page.tsx
# expected: no matches
grep -n "4 AI providers\|4 providers\|Emerging from 4" app/quantum/page.tsx
# expected: 2-3 matches
```

---

## TASK 3 — Remove Jix from Council circle

In the component file from Task 0.3:

**If portraits are from an array:**
- Remove the entry for Jix / "the creator" / equivalent
- The array length goes from 6 → 5
- All other entries unchanged
- Layout math (hexagon angles) MUST adapt to 5 entries — see Task 4 for sizing/layout

**If portraits are hardcoded JSX:**
- Delete the JSX block for Jix's portrait
- Adjust positioning of remaining 5 if hexagon coordinates were hardcoded

**Constraint:** Do NOT remove Llama (intentional future-LLM placeholder per Jix lock). Do NOT touch Claude/GPT/Gemini/Perplexity entries.

If the component uses image filenames like `jix.png` / `creator.jpg` / `founder.webp`, the file itself stays in `public/` — only the array reference / JSX is removed. Image asset cleanup is out of scope.

---

## TASK 4 — Enlarge AI portraits in Council circle

In the same component as Task 3:

- Find the portrait size declaration (likely a `w-` / `h-` Tailwind class on the portrait `<img>` or `<div>` wrapper, or a `r=` / `width=` SVG attribute)
- Increase by ~40-60% to make faces clearly readable
- If portraits use a fixed pixel size (e.g. `w-12` = 48px), bump to `w-16` or `w-20` (64-80px)
- If SVG `r="24"`, bump to `r="36"` or `r="40"`
- Adjust the hexagon radius (the distance from center "QUANTUM" to each portrait) proportionally so portraits don't overlap each other or the center label

**Visual constraint:** After change, the 5 portraits + center "QUANTUM/CONSENSUS" label must all fit within the existing card/container without overflow. If the container has a fixed max-width that would cause clipping, also bump the container max-width.

If unsure about exact values — pick the largest size that doesn't break the existing card layout, document the chosen values in the commit message.

---

## TASK 5 — Hero top-fold fix

Apply the fix proposed in Task 0.4. Common patterns:

**Pattern A — Excessive padding/spacer:**
- Reduce `pt-[N]` to lower value
- Or remove a `<div className="h-screen" />` spacer

**Pattern B — Animation never fires:**
- A `<motion.div initial={{ opacity: 0, y: 50 }} animate={{ ... }}>` where `animate` is conditional on a state that isn't being set
- Fix: ensure animate fires on mount, OR set initial state to visible

**Pattern C — Wrapper height pushing content down:**
- Hero wrapped in `<section className="min-h-screen flex items-end">` instead of `items-center`
- Fix: change to `items-center` or `items-start` with appropriate padding

**Pattern D — Background image hides text:**
- Less likely but possible — the round-table image renders BEFORE the text, with text below image
- Fix: stack text on top via absolute positioning or grid

**Constraint:** The fix must NOT break the rest of the page. After fix:
- "Quantum" h1 + tagline must appear in the FIRST viewport (above the fold)
- Round-table image position relative to text can change, but not break the visual hierarchy
- Captain's Log + interface preview + How It Works + Unique Features + KCP-90 cards + Waitlist sections all still render correctly

---

## TASK 6 — Fix Forge sub-label in topnav

In the file from Task 0.5:

- FIND: `AI-assisted cockpit generator`
- REPLACE: `Debate-to-build pipeline`

Single-line edit. No other changes to Navigation.tsx or wherever the dropdown lives.

---

## TASK 7 — Tests

Create `__tests__/sprint-b-quantum-content.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const QUANTUM_PAGE = path.resolve(process.cwd(), 'app/quantum/page.tsx');

describe('Sprint B — /quantum content fix', () => {
  const src = fs.readFileSync(QUANTUM_PAGE, 'utf8');

  it('does NOT contain "5 AI providers"', () => {
    expect(src).not.toMatch(/5 AI providers/);
  });

  it('contains "4 AI providers"', () => {
    expect(src).toMatch(/4 AI providers/);
  });

  it('does NOT contain "Emerging from 5 providers"', () => {
    expect(src).not.toMatch(/Emerging from 5 providers/);
  });

  it('contains "Emerging from 4 providers"', () => {
    expect(src).toMatch(/Emerging from 4 providers/);
  });
});
```

Create `__tests__/sprint-b-council-circle.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const COUNCIL_FILE = path.resolve(process.cwd(), '<COUNCIL_FILE_FROM_TASK_0_3>');

describe('Sprint B — Council circle cleanup', () => {
  const src = fs.readFileSync(COUNCIL_FILE, 'utf8');

  it('does NOT contain Jix / creator portrait reference', () => {
    // Specific tokens to forbid — substitute with the exact identifier found
    expect(src.toLowerCase()).not.toMatch(/jix|the creator|founder.*portrait/);
  });

  it('still contains the 4 AI providers + Llama placeholder', () => {
    expect(src).toMatch(/Claude/);
    expect(src).toMatch(/GPT/);
    expect(src).toMatch(/Gemini/);
    expect(src).toMatch(/Perplexity/);
    expect(src).toMatch(/Llama/);
  });
});
```

Create `__tests__/sprint-b-forge-sublabel.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const NAV_FILE = path.resolve(process.cwd(), '<NAV_FILE_FROM_TASK_0_5>');

describe('Sprint B — Topnav Forge sub-label fix', () => {
  const src = fs.readFileSync(NAV_FILE, 'utf8');

  it('does NOT contain "AI-assisted cockpit generator"', () => {
    expect(src).not.toMatch(/AI-assisted cockpit generator/);
  });

  it('contains "Debate-to-build pipeline"', () => {
    expect(src).toMatch(/Debate-to-build pipeline/);
  });
});
```

**Substitute `<COUNCIL_FILE_FROM_TASK_0_3>` and `<NAV_FILE_FROM_TASK_0_5>` with exact paths from pre-flight.**

**Hero fix tests:** No automated test for the hero visual fix — it's a layout/CSS issue. Verify via live audit (Task 9). Optional: add a snapshot test if hero component has a stable test ID.

---

## TASK 8 — Run full test suite + build

```bash
npm test
```

Expected: 1515 + new tests (target 5-8) green. Sprint A tests must remain green. If any test fails, STOP.

```bash
npm run build
```

Expected: clean build. Watch for:
- TypeScript errors from removed array entries (length type narrowing)
- Tailwind purge warnings if new classes used
- Image import errors if Jix portrait file was inlined

---

## TASK 9 — Commit + tag + push

```bash
git add app/quantum/page.tsx
git add <council-component-file>
git add <nav-file>
git add __tests__/sprint-b-*.test.ts
git status   # confirm only expected files staged

git commit -m "fix(sprint-b): /quantum 4-providers + Council cleanup + Forge sublabel + hero top-fold"
git tag sprint-b-quantum-content-complete
git push origin main
git push origin sprint-b-quantum-content-complete
```

Post-push verify:
```bash
git status                                       # clean
git log origin/main --oneline -3                 # commits on remote
git tag --list | grep sprint-b-quantum-content   # tag local
git ls-remote --tags origin | grep sprint-b-quantum-content   # tag on remote
```

---

## TASK 10 — Wait + live verify (Jix)

Wait ≥ 90 seconds. Hard-refresh incognito.

### 10.1 — `https://voidexa.com/quantum` first viewport (no scroll)

- ✅ "Quantum" h1 visible
- ✅ "Where AIs debate, disagree, and find truth." tagline visible
- ✅ Round-table image visible OR positioned correctly
- ✅ 3 badges still present (LIVE / 1324 TESTS / $0.02-$0.05)
- ✅ No empty black gap above content

### 10.2 — `/quantum` body content

- ✅ Hero paragraph reads "4 AI providers" (NOT 5)
- ✅ Stats line reads "Emerging from 4 providers" (NOT 5)
- ✅ Watch Them Debate UI unchanged — Llama block + replikken still present
- ✅ Captain's Log unchanged
- ✅ KCP-90 / Binary / SHM cards unchanged
- ✅ Waitlist + footer unchanged

### 10.3 — `/quantum` Council circle

- ✅ Only 5 portraits visible (was 6)
- ✅ Jix's portrait gone
- ✅ Llama portrait still present
- ✅ Portraits noticeably larger and faces clearly recognizable
- ✅ "QUANTUM" + "CONSENSUS 72%" still center
- ✅ No portrait overlap or container overflow

### 10.4 — Topnav dropdown

- ✅ Hover "Quantum Tools" → dropdown opens
- ✅ "Quantum Forge" sub-label reads "Debate-to-build pipeline" (NOT "AI-assisted cockpit generator")
- ✅ "Quantum Council" + "Void Pro AI" sub-labels unchanged
- ✅ All 3 hrefs unchanged from Sprint A state

### 10.5 — Regression spot-checks

- ✅ `/quantum-tools` landing still loads (Sprint A)
- ✅ Starmap quantum-planet click still goes to `/quantum-tools`
- ✅ Topnav "Quantum Council" still goes to `/quantum`
- ✅ Other 9 starmap nodes unchanged
- ✅ `/void-pro-ai` and forge.voidexa.com still work
- ✅ No new console errors

If anything fails live → file P0, rollback if blocking.

---

## ROLLBACK (if needed)

```bash
git reset --hard backup/pre-sprint-b-quantum-content-20260501
git push origin main --force-with-lease
git push origin :refs/tags/sprint-b-quantum-content-complete
git tag -d sprint-b-quantum-content-complete
```

Backup tag is pre-SKILL — single-reset rollback works.

---

## DEFINITION OF DONE

- [ ] SKILL committed FIRST (Task 1)
- [ ] Backup tag pushed before any code change
- [ ] Pre-flight Checkpoint 1 approved by Jix
- [ ] "5 AI providers" / "5 providers" gone from `/quantum`
- [ ] "4 AI providers" / "4 providers" present
- [ ] Jix portrait removed from Council circle
- [ ] AI portraits enlarged (no overflow / overlap)
- [ ] Forge sub-label = "Debate-to-build pipeline"
- [ ] Hero renders in first viewport (no empty top)
- [ ] All tests green (target 1520-1523)
- [ ] `npm run build` clean
- [ ] Committed + tagged + pushed
- [ ] `git status` clean post-push
- [ ] Wait ≥ 90s, hard-refresh incognito live-verify all 5 blocks
- [ ] No regression on Sprint A artifacts (`/quantum-tools`, starmap, dropdown)
- [ ] CLAUDE.md update deferred per pattern (combined session-log)

---

## OUT OF SCOPE (do not touch)

- Captain's Log paragraph
- Llama block in "Watch Them Debate" interface preview (intentional)
- KCP-90 "March 28, 2026" date
- "Meet the team behind Quantum →" link
- `/game-hub` MVP (separate sprint)
- `/trading` + `/trading-hub` merge (separate sprint)
- DK i18n (AFS-26 territory)
- Council circle visual asset files in `public/`
- Topnav layout, parent labels, other dropdowns

---

## EXPECTED FINAL STATE

```
HEAD (after Task 9): <new-commit-hash> fix(sprint-b): /quantum 4-providers + Council cleanup + Forge sublabel + hero top-fold
HEAD~1:              <skill-commit-hash> chore(sprint-b): add Quantum content fix + Council cleanup + hero debug SKILL
Backup tag:          backup/pre-sprint-b-quantum-content-20260501 → 9ca147a
Sprint tag:          sprint-b-quantum-content-complete → <new-commit-hash>
Tests:               1515 → 1520-1523 green
Build:               clean
Tree:                clean
```

---

## NOTES FOR EXECUTION CHAT

- Jix executes via `claude --dangerously-skip-permissions` from voidexa repo root
- Full file content edits, no line-edits
- No PowerShell unless requested
- One commit at Task 9, not piecewise
- Pre-flight Checkpoint 1 STOP is mandatory
- Hero fix needs Task 0.4 diagnostic phase — don't guess root cause; locate it first
- Council circle layout math may need adjustment when array shrinks 6→5 — verify visually after change
