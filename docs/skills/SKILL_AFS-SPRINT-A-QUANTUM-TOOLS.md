# SKILL — Sprint A: Quantum Tools Landing + Nav Rename + Starmap Repoint

**Sprint type:** Net-new feature build (NOT a fix)
**Parent context:** AFS-10 chain (post FIX-17)
**Tag format:** `sprint-a-quantum-tools-complete`
**Backup tag:** `backup/pre-sprint-a-quantum-tools-20260501`
**Branch:** main
**Expected baseline at start:** HEAD = `c115f99`, tests = 1495 green
**Execute with:** `claude --dangerously-skip-permissions`

---

## SCOPE (locked by Jix, SLUT 26)

Build a new landing page at `/quantum-tools` that acts as a hub for the three Quantum sub-products. Repoint the starmap Quantum-planet click target to this new landing. Rename the existing topnav dropdown child "Quantum Chat" → "Quantum Council" and change its href.

**3 sub-products presented as cards on the new landing:**
1. **Quantum Council** → `/quantum` (existing Council marketing page)
2. **Quantum Forge** → `https://forge.voidexa.com` (external, new tab)
3. **Void Pro AI** → `/void-pro-ai` (existing premium pay-per-msg page)

**Live state (audited Apr 30 SLUT 25 + confirmed by Jix SLUT 26):**
- Topnav "Quantum Tools" dropdown EXISTS already (Sprint 14b)
- Dropdown currently has 3 items: Void Pro AI, Quantum Chat, Quantum Forge
- "Void Chat" was already removed and replaced by "Void Pro AI" in a prior session
- Only nav change needed in this sprint: rename "Quantum Chat" → "Quantum Council" + change its href

**Locked by Jix:**
- Route name for new landing: `/quantum-tools`
- Topnav label "Quantum Tools" stays the same (dropdown name unchanged)
- Starmap Quantum-planet click → `/quantum-tools` (changed from `/quantum`)
- `/quantum`, `forge.voidexa.com`, `/void-pro-ai` content NOT touched in this sprint
- `/quantum` Llama+Jix content fix is Sprint B (out of scope)

---

## VERIFY-FIRST PRE-FLIGHT (mandatory — STOP for Jix approval after Checkpoint 1)

### Task 0.1 — Find topnav source file

Grep for the existing "Quantum Tools" dropdown:

```bash
grep -rn "Quantum Tools" --include="*.tsx" --include="*.ts" -l
grep -rn "Quantum Chat" --include="*.tsx" --include="*.ts" -l
grep -rn "Quantum Forge" --include="*.tsx" --include="*.ts" -l
```

Expected: a single nav component file (likely under `components/` or `components/layout/`). Possible candidates per past INDEX state: `Header.tsx`, `Navigation.tsx`, `TopNav.tsx`, `Navbar.tsx`.

**STOP and report to Jix:**
- Exact file path of nav component
- Exact label string used today ("Quantum Chat" or another casing variant)
- Exact href today (`/quantum/chat` per INDEX, verify)
- Whether dropdown items are inline JSX or array config

### Task 0.2 — Find starmap nodes config

```bash
grep -rn "id: ['\"]quantum['\"]" --include="*.ts" --include="*.tsx"
```

Expected match: `nodes.ts` or similar in `lib/` or `data/` containing the 10-node starmap config. Per SLUT 25 state the quantum node's `path` field equals `/quantum`.

**STOP and report to Jix:**
- Exact file path
- Exact line where quantum node's path is defined
- Field name (`path`, `href`, `url` — could be any)

### Task 0.3 — Confirm /quantum-tools route does not yet exist

```bash
ls -la app/quantum-tools 2>/dev/null
ls -la app/(marketing)/quantum-tools 2>/dev/null
find app -type d -name "quantum-tools"
```

Expected: no match. If the route DOES exist, STOP and report to Jix.

### Task 0.4 — Identify a parallel landing page to mirror for design system

Read one of these to understand the project's design system for landing pages:
- `app/void-pro-ai/page.tsx` (closest analogue: single product landing)
- `app/quantum/page.tsx` (Council marketing page, 951 lines per INDEX)
- `app/services/page.tsx` (194 lines)

**STOP and report:**
- Which file you'll mirror for visual language (Tailwind classes, hero pattern, card pattern, font scales)
- Whether shadcn `<Card>` is used or custom Tailwind cards

### Checkpoint 1 — Pre-flight summary

Before writing any code, output this summary and wait for Jix's GO:

```
PRE-FLIGHT SUMMARY
==================
Nav file:           <path>:<line range for Quantum Tools dropdown>
Current label:      "Quantum Chat"
Current href:       /quantum/chat
Target label:       "Quantum Council"
Target href:        /quantum

Starmap nodes file: <path>:<line for quantum node>
Current quantum path: /quantum
Target quantum path:  /quantum-tools

New route:          app/quantum-tools/page.tsx (NEW)
Mirror file:        <path of chosen reference landing>
Card pattern:       <shadcn Card | custom Tailwind card>

Test files to add:  __tests__/sprint-a-quantum-tools-*.test.ts
Expected new tests: 6-10
Expected end count: 1501-1505 (1495 + new)
```

**Wait for Jix "GO".** Do not start Task 1 until approved.

---

## TASK 1 — Commit SKILL first

```bash
git checkout main
git pull origin main
git tag backup/pre-sprint-a-quantum-tools-20260501
git push origin backup/pre-sprint-a-quantum-tools-20260501

git add SKILL_AFS-SPRINT-A-QUANTUM-TOOLS.md
git commit -m "chore(sprint-a): add Quantum Tools landing + nav rename + starmap repoint SKILL"
git push origin main
```

Verify push:
```bash
git log origin/main --oneline -2
git status
```

Tree must be clean before Task 2.

---

## TASK 2 — Topnav rename

In the nav component file identified at Checkpoint 1:

**Change 1:** Rename the dropdown child label.
- FIND: `Quantum Chat` (the label string, not other occurrences)
- REPLACE: `Quantum Council`

**Change 2:** Change the href on the same item.
- FIND: `/quantum/chat` (only on the matching dropdown child — NOT a global replace; other parts of site may legitimately link to `/quantum/chat`)
- REPLACE: `/quantum`

If the dropdown is built from an array config, edit the relevant entry. If inline JSX, edit the matching `<Link>` or `<a>` element.

**Do NOT touch:**
- Void Pro AI dropdown item
- Quantum Forge dropdown item
- The "Quantum Tools" parent label of the dropdown

After change, confirm with grep:
```bash
grep -n "Quantum Council" <nav-file>
grep -n "Quantum Chat" <nav-file>     # should now only match unrelated occurrences if any
```

---

## TASK 3 — Build /quantum-tools landing page

Create `app/quantum-tools/page.tsx` mirroring the design system of the file chosen in Task 0.4.

### Page structure

```
<main>
  <Hero>
    <h1>Quantum Tools</h1>
    <p>Three ways to harness multi-AI intelligence.</p>
  </Hero>

  <Cards grid (3 columns desktop, stacked mobile)>
    Card 1: Quantum Council
    Card 2: Quantum Forge
    Card 3: Void Pro AI
  </Cards>
</main>
```

### Card content (verbatim — locked)

**Card 1 — Quantum Council**
- Heading: `Quantum Council`
- Tagline: `4 AIs debate. You get the answer.`
- Body: `Claude, GPT, Gemini, and Perplexity argue, refine, and converge on a single answer. The minority view is preserved when it disagrees with the majority.`
- CTA: `Enter Council →`
- Link: `/quantum` (internal, same tab)

**Card 2 — Quantum Forge**
- Heading: `Quantum Forge`
- Tagline: `Debate-to-build pipeline.`
- Body: `Describe what you want. Multiple AIs debate the spec, extract a scaffold, and execute the build through Claude Agent SDK — all in one unbroken pipeline.`
- CTA: `Open Forge ↗`
- Link: `https://forge.voidexa.com` (external, `target="_blank"`, `rel="noopener noreferrer"`)

**Card 3 — Void Pro AI**
- Heading: `Void Pro AI`
- Tagline: `Premium pay-per-message.`
- Body: `Direct access to Claude, GPT, and Gemini at premium quality with no subscription. Pay for what you use, when you use it.`
- CTA: `Try Void Pro AI →`
- Link: `/void-pro-ai` (internal, same tab)

### Design constraints

- Match Tailwind tokens of the mirror file (do not invent new colors / spacing)
- Cards have hover state (subtle scale or border glow) consistent with site convention
- External link card (Forge) shows the `↗` glyph or equivalent external indicator already used elsewhere on site
- Page must render with `metadata` export including `title: 'Quantum Tools — voidexa'` and a description ≤ 160 chars
- No new fonts. No new background images. Reuse what exists.

### What NOT to add (out of scope)

- Sub-product feature comparison tables
- Pricing widgets
- Integrated chat preview
- Animations beyond what the mirror file uses
- Footer changes
- Header changes (other than nav rename in Task 2)

---

## TASK 4 — Repoint starmap quantum node

In the nodes config file identified at Task 0.2:

- FIND: the `quantum` node entry's `path` (or `href`/`url`) field
- CURRENT VALUE: `/quantum`
- NEW VALUE: `/quantum-tools`

**Do NOT change:**
- Node id (`quantum`)
- Node label (`Quantum`)
- Node position, size, texture, or any other field
- Any other node's path

After change:
```bash
grep -n "quantum-tools" lib/<file>.ts
grep -n "'/quantum'" lib/<file>.ts   # quantum node should NO LONGER show this exact path
```

---

## TASK 5 — Update HUD content map for quantum node (FIX-17 follow-up)

In `components/starmap/HoverHUD.tsx`, the `HUD_CONTENT.quantum.cta` from FIX-17 currently reads `→ ENTER QUANTUM` (or similar — verify). Since the planet now leads to a landing showing all 3 tools, the CTA should reflect this.

- FIND: `HUD_CONTENT.quantum.cta` value
- REPLACE: `→ EXPLORE QUANTUM TOOLS`

The body text from FIX-17 already mentions all 3 sub-products, which now matches the landing page perfectly. Do NOT change body text.

---

## TASK 6 — Tests

Create `__tests__/sprint-a-quantum-tools-landing.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('Sprint A — Quantum Tools landing', () => {
  const pagePath = path.resolve(process.cwd(), 'app/quantum-tools/page.tsx');
  const pageSrc = fs.readFileSync(pagePath, 'utf8');

  it('exports a default React component', () => {
    expect(pageSrc).toMatch(/export\s+default\s+function/);
  });

  it('renders all 3 sub-product card headings', () => {
    expect(pageSrc).toContain('Quantum Council');
    expect(pageSrc).toContain('Quantum Forge');
    expect(pageSrc).toContain('Void Pro AI');
  });

  it('links Council card to /quantum (NOT /quantum/chat or /quantum-tools)', () => {
    expect(pageSrc).toMatch(/href=["']\/quantum["']/);
    expect(pageSrc).not.toMatch(/href=["']\/quantum\/chat["']/);
  });

  it('links Forge card to forge.voidexa.com as external', () => {
    expect(pageSrc).toMatch(/forge\.voidexa\.com/);
    expect(pageSrc).toMatch(/target=["']_blank["']/);
    expect(pageSrc).toMatch(/rel=["']noopener noreferrer["']/);
  });

  it('links Void Pro AI card to /void-pro-ai', () => {
    expect(pageSrc).toMatch(/href=["']\/void-pro-ai["']/);
  });

  it('exports metadata with title containing "Quantum Tools"', () => {
    expect(pageSrc).toMatch(/export\s+const\s+metadata/);
    expect(pageSrc).toMatch(/Quantum Tools/);
  });
});
```

Create `__tests__/sprint-a-nav-rename.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const NAV_FILE = path.resolve(process.cwd(), '<NAV_FILE_FROM_TASK_0_1>');

describe('Sprint A — Topnav rename Quantum Chat → Quantum Council', () => {
  const navSrc = fs.readFileSync(NAV_FILE, 'utf8');

  it('contains "Quantum Council" label', () => {
    expect(navSrc).toContain('Quantum Council');
  });

  it('does NOT contain old "Quantum Chat" label in dropdown', () => {
    // Allow string elsewhere if used in unrelated context, but
    // the dropdown should not still show the old label
    const dropdownRegion = navSrc.match(/Quantum Tools[\s\S]{0,2000}/)?.[0] ?? '';
    expect(dropdownRegion).not.toContain('Quantum Chat');
  });

  it('Quantum Council href points to /quantum (not /quantum/chat)', () => {
    const dropdownRegion = navSrc.match(/Quantum Tools[\s\S]{0,2000}/)?.[0] ?? '';
    expect(dropdownRegion).toMatch(/['"]\/quantum['"]/);
    expect(dropdownRegion).not.toMatch(/['"]\/quantum\/chat['"]/);
  });
});
```

Create `__tests__/sprint-a-starmap-quantum-repoint.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const NODES_FILE = path.resolve(process.cwd(), '<NODES_FILE_FROM_TASK_0_2>');

describe('Sprint A — Starmap quantum node repoint to /quantum-tools', () => {
  const src = fs.readFileSync(NODES_FILE, 'utf8');

  it('quantum node path/href is /quantum-tools', () => {
    // Match a stanza starting with id: 'quantum' (allow either quote) and
    // ending at next id: or close brace, then assert path field
    const stanza = src.match(/id:\s*['"]quantum['"][\s\S]*?(?=id:\s*['"]|\}\s*[,\]])/)?.[0] ?? '';
    expect(stanza).toMatch(/['"]\/quantum-tools['"]/);
  });

  it('quantum node still exists with id "quantum"', () => {
    expect(src).toMatch(/id:\s*['"]quantum['"]/);
  });
});
```

Create `__tests__/sprint-a-hud-cta-update.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const HUD_FILE = path.resolve(process.cwd(), 'components/starmap/HoverHUD.tsx');

describe('Sprint A — HoverHUD quantum CTA reflects landing repoint', () => {
  const src = fs.readFileSync(HUD_FILE, 'utf8');

  it('quantum HUD CTA mentions Quantum Tools', () => {
    const stanza = src.match(/quantum:[\s\S]*?cta:\s*['"][^'"]+['"]/)?.[0] ?? '';
    expect(stanza).toMatch(/EXPLORE QUANTUM TOOLS/);
  });
});
```

**Substitute `<NAV_FILE_FROM_TASK_0_1>` and `<NODES_FILE_FROM_TASK_0_2>` with the exact paths from pre-flight before running tests.**

---

## TASK 7 — Run full test suite

```bash
npm test
```

Expected: 1495 + new tests (target 6-10) green. If any test fails, STOP and diagnose. Do not commit a red suite.

```bash
npm run build
```

Expected: clean build. If build fails, STOP. Common failures to watch for:
- TypeScript: missing import in new page.tsx
- Next.js: metadata export shape wrong
- Module not found: external link href written without `https://` prefix

---

## TASK 8 — Commit + tag + push

```bash
git add app/quantum-tools/page.tsx
git add __tests__/sprint-a-*.test.ts
git add <nav-file-from-task-0-1>
git add <nodes-file-from-task-0-2>
git add components/starmap/HoverHUD.tsx
git status   # confirm only expected files staged

git commit -m "feat(sprint-a): add /quantum-tools landing + rename nav + repoint starmap quantum node"
git tag sprint-a-quantum-tools-complete
git push origin main
git push origin sprint-a-quantum-tools-complete
```

Post-push verify:

```bash
git status                                  # clean
git log origin/main --oneline -3           # confirms commits on remote
git tag --list | grep sprint-a-quantum     # tag listed locally
git ls-remote --tags origin | grep sprint-a-quantum  # tag on remote
```

---

## TASK 9 — Wait + live verify (Jix)

Wait ≥ 90 seconds for Vercel deploy. Then hard-refresh incognito on:

1. **`https://voidexa.com/quantum-tools`**
   - 200 OK, not 404
   - Hero shows "Quantum Tools" h1
   - 3 cards visible (Council, Forge, Void Pro AI)
   - Card 1 click → `/quantum` (Council marketing page loads)
   - Card 2 click → opens `forge.voidexa.com` in new tab
   - Card 3 click → `/void-pro-ai` loads
   - Mobile layout stacks cards vertically (resize / DevTools)

2. **Topnav `Quantum Tools ▼` dropdown**
   - Reads "Quantum Council" (NOT "Quantum Chat")
   - "Quantum Council" click → `/quantum` (NOT `/quantum/chat`)
   - "Quantum Forge" still works
   - "Void Pro AI" still works

3. **`https://voidexa.com/starmap/voidexa`**
   - Quantum planet still visible (size/position unchanged)
   - Hover Quantum → HUD shows updated CTA "→ EXPLORE QUANTUM TOOLS"
   - Click Quantum planet → lands on `/quantum-tools` (NOT `/quantum`)

4. **Regression spot-checks**
   - `/quantum` still loads (Council marketing page unchanged — Llama+Jix bug remains, that's Sprint B)
   - `/void-pro-ai` still loads
   - All other 9 starmap planets click to correct routes (no collateral damage)
   - `/starmap` (galaxy view) unchanged

If anything fails live, file P0 and proceed to rollback section. Do NOT mark sprint complete until all 4 verification blocks pass.

---

## ROLLBACK (if needed)

```bash
git reset --hard backup/pre-sprint-a-quantum-tools-20260501
git push origin main --force-with-lease
git push origin :refs/tags/sprint-a-quantum-tools-complete
git tag -d sprint-a-quantum-tools-complete
```

Note: The backup tag was placed BEFORE the SKILL commit, so single-reset is sufficient (unlike the FIX-17 dual-reset pattern where backup was placed post-SKILL-commit).

---

## DEFINITION OF DONE

- [ ] SKILL committed FIRST (Task 1)
- [ ] Backup tag pushed before any code change
- [ ] Pre-flight Checkpoint 1 approved by Jix
- [ ] `app/quantum-tools/page.tsx` exists, renders 3 cards correctly
- [ ] Topnav "Quantum Chat" → "Quantum Council" + href `/quantum/chat` → `/quantum`
- [ ] Starmap quantum node path → `/quantum-tools`
- [ ] HoverHUD quantum CTA reflects new landing
- [ ] All tests green (target 1501-1505)
- [ ] `npm run build` clean
- [ ] Committed + tagged + pushed
- [ ] `git status` clean post-push
- [ ] `git log origin/main --oneline -3` shows commits on remote
- [ ] Wait ≥ 90s, hard-refresh incognito live-verify all 4 blocks
- [ ] No regression on `/quantum`, `/void-pro-ai`, other 9 starmap nodes
- [ ] Sprint A entry added to CLAUDE.md (deferred per pattern — combined session-log)
- [ ] INDEX deltas at SLUT (08, 04, 09, 11)

---

## OUT OF SCOPE (do not do in this sprint)

- Llama removal from `/quantum` content (Sprint B)
- Jix removal from `/quantum` AI debate-list (Sprint B)
- `/game-hub` MVP build (Sprint B)
- `/trading` + `/trading-hub` merge (Sprint B)
- Any changes to topnav layout, parent label, or other dropdowns
- Any Tailwind theme / color / token changes
- New components (use existing card pattern from mirror file)
- Adding pricing/feature-comparison content to landing
- DK i18n of new landing (AFS-26 territory)

---

## EXPECTED FINAL STATE

```
HEAD (after Task 8):  <new-commit-hash> feat(sprint-a): add /quantum-tools landing + rename nav + repoint starmap quantum node
HEAD~1:               <skill-commit-hash> chore(sprint-a): add Quantum Tools landing + nav rename + starmap repoint SKILL
Backup tag:           backup/pre-sprint-a-quantum-tools-20260501 → c115f99
Sprint tag:           sprint-a-quantum-tools-complete → <new-commit-hash>
Tests:                1495 → 1501-1505 green
Build:                clean
Tree:                 clean
```

---

## NOTES FOR EXECUTION CHAT

- Jix executes via `claude --dangerously-skip-permissions` from voidexa repo root
- All file edits use full content (no line-edits per Jix rules)
- No PowerShell unless explicitly requested
- One coherent commit at Task 8, not piecewise commits
- Pre-flight Checkpoint 1 STOP is mandatory — do not auto-approve
