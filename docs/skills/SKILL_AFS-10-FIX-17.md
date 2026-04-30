# SKILL — AFS-10-FIX-17: HUD Content + Label fontSize Bump

**Sprint:** AFS-10-FIX-17
**Parent sprint:** AFS-10 (visual polish layer, follow-up to FIX-16)
**Type:** HoverHUD content rewrite + default label fontSize bump
**Priority:** P1 (visual polish — premium game-interface look + readable labels)
**Estimated time:** 30-45 min
**Authored:** SLUT 25 (Apr 30 2026)

---

## CONTEXT

After AFS-10-FIX-16 shipped (voidexa 5.0 + labels 48/42 + HUD same-side), Jix observed:

1. **Default planet labels still too small** — labels look like "Word size 6" but should look like "Word size 12-14". That maps to roughly 2× CSS pixel bump: 48/42 → **64/56**.

2. **HUD content is too thin** — current HUD shows `node.sublabel` only (e.g. "Build · Compete · Learn", "Get in touch"). Jix wants premium game-interface look: each planet's HUD should give the user **quick understanding** of what that product/page IS.

3. **Quantum-planet represents 3 sub-products** per SLUT 21 lock — Council, Forge, Void Pro AI. HUD must mention all three.

Jix performed live audit of all 10 routes during this session (autoritative content fetched). Content for HUD has been authored from real page taglines/descriptions, NOT guessed.

---

## SCOPE

### IN SCOPE

1. **Default label fontSize** in `NodeMesh.tsx`:
   - Sun (isCenter): `48px` → `64px`
   - Satellite: `42px` → `56px`
   - distanceFactor=16 PRESERVED (FIX-14 lesson)

2. **HoverHUD content** in `HoverHUD.tsx`:
   - Replace current rendering of `node.sublabel` with a richer per-node content lookup
   - Add a content map keyed by node `id` with fields: `title`, `body`, `cta`
   - Fall back to current `sublabel` rendering if a node id is missing from the map (defensive — should never trigger since all 10 are mapped)

### OUT OF SCOPE — DO NOT TOUCH

- nodes.ts (no size, position, route, texture, color, planetType changes)
- voidexa size 5.0 from FIX-16
- All FIX-13 spacing
- Camera position/target/FOV (FIX-12 state)
- OrbitControls min/maxDistance / autoRotate / autoRotateSpeed
- Sphere radius
- distanceFactor (stays 16 on label `<Html>` block — DO NOT REMOVE)
- HUD design tokens: background `rgba(10, 14, 28, 0.85)`, blur 8px, border `rgba(0, 212, 255, 0.3)`, glow, fade timings 200/150ms, panel width 360, edge padding 60
- HUD title fontSize 22px, body 14px, footer 12px
- HUD same-side logic (`isPlanetOnLeft ? 'left' : 'right'`)
- SVG line color `#00d4ff`, strokeWidth 1.5, opacity 0.6
- Per-frame screen position tracking
- Subtitle removal from FIX-15 (subtitle stays removed from default labels)
- Decorative dashed ring on claim-your-planet
- Galaxy view
- Quantum landing rebuild — separate Sprint A (NOT this sprint)
- `/quantum` Council marketing-page Llama removal — separate Sprint B (NOT this sprint)
- Click-target routes (Quantum-planet still goes to current route — Sprint A fixes this later)
- "While I'm in here..." anything else

---

## HUD CONTENT MAP (LOCKED FROM JIX VERBATIM)

```ts
type HudContent = {
  title: string
  body: string
  cta: string
}

const HUD_CONTENT: Record<string, HudContent> = {
  voidexa: {
    title: 'voidexa',
    body: 'Sovereign AI Infrastructure. An ecosystem where developers, hardware builders, creators, and businesses build alongside us — from a single product to your own planet.',
    cta: '→ ENTER ECOSYSTEM',
  },
  apps: {
    title: 'Apps',
    body: 'Tools for people who think in systems. Encrypted messaging (Comlink), custom apps, automation tools — software that respects your intelligence and your privacy.',
    cta: '→ EXPLORE APPS',
  },
  quantum: {
    title: 'Quantum',
    body: 'Three AI-powered tools in one orbit. Council — 4 AIs debate and converge. Forge — describe a project, AIs debate it, Claude builds it. Void Pro AI — premium pay-per-message access to Claude, ChatGPT, Gemini.',
    cta: '→ ENTER QUANTUM',
  },
  'trading-hub': {
    title: 'Trading Hub',
    body: 'AI trading systems and a live bot leaderboard. APEX Trader Core + Scalper Core run V3 regime-based trading. +194.79% backtest. Compete with your bot or watch autonomous bots trade.',
    cta: '→ ENTER HUB',
  },
  services: {
    title: 'Services',
    body: 'Custom AI development, data intelligence, and consulting. We scope it, we ship it. No retainers, no padded teams — just the work, scoped and delivered.',
    cta: '→ START A PROJECT',
  },
  'game-hub': {
    title: 'Game Hub',
    body: 'Card battle, free flight, and a living sci-fi universe. Build decks, fly your ship, explore the voidexa galaxy.',
    cta: '→ COMING SOON',
  },
  'ai-tools': {
    title: 'AI Tools',
    body: "AI that does the work. From publishing a book to launching a website — voidexa's AI tools turn conversations into finished products.",
    cta: '→ EXPLORE TOOLS',
  },
  contact: {
    title: 'Contact',
    body: "Let's build something. Tell us what you're working on. We respond within 24 hours.",
    cta: '→ GET IN TOUCH',
  },
  station: {
    title: 'Space Station',
    body: 'The content hub for the voidexa universe. Cinema, Science, and Social decks — videos, full roadmap, and the team behind the mission.',
    cta: '→ EXPLORE STATION',
  },
  'claim-your-planet': {
    title: 'Your Planet?',
    body: "Pioneer Program — 10 slots open. You're not renting a page. You're building a sovereign system inside the voidexa galaxy. Your planet, your economy, your orbit.",
    cta: '→ CLAIM YOUR PLANET',
  },
}
```

**Note:** Pre-flight Task 0.4 must verify the actual node `id` strings in nodes.ts match these keys exactly. If any mismatch (e.g. `'space-station'` vs `'station'`), report and adjust the map keys to match nodes.ts (NOT the other way around — nodes.ts is the source of truth).

---

## PRE-FLIGHT (MANDATORY — STOP at checkpoint)

### Task 0.1 — Repo state baseline

```bash
cd C:\Users\Jixwu\Desktop\voidexa
git status
git log origin/main --oneline -3
```

**Expected:**
- HEAD = `ad65728` (post AFS-10-FIX-16) or newer
- Working tree clean (carryover untracked OK)

### Task 0.2 — Backup tag

```bash
git tag backup/pre-afs-10-fix-17-20260430
git push origin backup/pre-afs-10-fix-17-20260430
```

### Task 0.3 — Verify current state matches FIX-16

```bash
grep -A 2 "fontSize" components/starmap/NodeMesh.tsx | head -20
grep -A 4 "isPlanetOnLeft\|hudSide\|sublabel" components/starmap/HoverHUD.tsx | head -40
```

**Cross-check:**
- NodeMesh fontSize: sun 48px, satellite 42px (FIX-16 values)
- HoverHUD reads `node.sublabel` for body text
- HoverHUD same-side logic: `isPlanetOnLeft ? 'left' : 'right'`

### Task 0.4 — Verify node ID strings in nodes.ts

```bash
grep "id:" components/starmap/nodes.ts
```

Report all 10 node `id` values as a list. Cross-check against HUD_CONTENT map keys above:
- voidexa
- apps
- quantum
- trading-hub
- services
- game-hub
- ai-tools
- contact
- station
- claim-your-planet

If any node id differs (e.g. `space-station` instead of `station`), STOP and report — map keys must be adjusted to match real ids.

**Report:**
```
PRE-FLIGHT REPORT — AFS-10-FIX-17

0.1 Repo state: HEAD [hash], clean
0.2 Backup tag: pushed
0.3 Current state cross-check:
    NodeMesh fontSize sun=48, sat=42 [✅/🔴]
    HoverHUD reads node.sublabel [✅/🔴]
    HoverHUD same-side logic [✅/🔴]
    
0.4 Node IDs in nodes.ts:
    [list all 10 ids exactly as written]
    
    HUD_CONTENT map key mismatch check:
    [✅ all 10 ids match map keys | 🔴 mismatch on: list]

Computed FIX-17 targets:
    NodeMesh fontSize: 48/42 → 64/56
    HoverHUD body text: node.sublabel → HUD_CONTENT[node.id].body
    HoverHUD title: keep node.label (or switch to HUD_CONTENT[node.id].title)
    HoverHUD CTA: hardcoded "→ CLICK TO ENTER" → HUD_CONTENT[node.id].cta
```

---

### 🔴 CHECKPOINT 1 — MANDATORY STOP

**WAIT FOR JIX EXPLICIT APPROVAL.**

Lock format:
```
LOCKED:
- fontSize: 48/42 → 64/56
- HUD content: HUD_CONTENT map per SKILL §HUD CONTENT MAP
- HUD title source: [HUD_CONTENT[id].title | node.label] — pick one
- HUD CTA source: HUD_CONTENT[id].cta (per-node varies)
- ALL FIX-13 to FIX-16 invariants UNCHANGED
- ALL HUD design tokens UNCHANGED
```

---

## TASK 1 — UPDATE NodeMesh.tsx fontSize

Edit `components/starmap/NodeMesh.tsx`:

Locate the main label `<Html>` block (the one preserved from FIX-15, post-subtitle-deletion).

- Sun (isCenter branch): `'48px'` → `'64px'`
- Satellite branch: `'42px'` → `'56px'`

DO NOT touch:
- distanceFactor (stays 16)
- position offset
- styling (color, fontWeight, fontFamily, letterSpacing, textShadow, lineHeight)
- Hover handlers
- Decorative dashed ring `<Html>` block on claim-your-planet (separate block, distanceFactor=16, untouched)

```bash
npx tsc --noEmit
```

---

## TASK 2 — UPDATE HoverHUD.tsx with content map

Edit `components/starmap/HoverHUD.tsx`:

1. At top of file, add `HUD_CONTENT` map per SKILL §HUD CONTENT MAP above (verbatim).

2. In the component body, replace current title/body/CTA rendering with map lookup:

```tsx
const content = HUD_CONTENT[renderedNode.id] ?? {
  title: renderedNode.label,
  body: renderedNode.sublabel ?? '',
  cta: '→ CLICK TO ENTER',
}

// In JSX:
<div style={{ fontSize: '22px', fontWeight: 600, color: '#00d4ff', marginBottom: 8, ... }}>
  {content.title}
</div>
<div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.75)', lineHeight: 1.5, marginBottom: 16 }}>
  {content.body}
</div>
<div style={{ fontSize: '12px', color: 'rgba(0, 212, 255, 0.7)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
  {content.cta}
</div>
```

DO NOT touch:
- panel container styles (background, border, glow, blur, padding, width, position, fade)
- SVG line element
- `isPlanetOnLeft` calculation
- `hudSide`, `hudX`, `hudY`, `lineEndX`, `lineEndY` formulas
- visible/renderedNode/renderedPos state machinery
- useEffect cleanup logic

```bash
npx tsc --noEmit
```

---

## TASK 3 — UPDATE EXISTING TESTS

```bash
grep -rn "fontSize\|sublabel\|CLICK TO ENTER" tests/ components/starmap/__tests__/ 2>/dev/null | head -30
```

Update:

**fontSize regex assertions:**
- FIX-9 fontSize regex: `48/42` → `64/56`
- FIX-15 fontSize regex (if present): `48/42` → `64/56`
- FIX-16 fontSize regex: `48/42` → `64/56`
- Old FIX-13/14/15 values like `36px`, `30px`, `45px`, `52px`, `40px` should already be absent — verify

**HoverHUD assertions:**
- If FIX-15 test asserted "→ CLICK TO ENTER" hardcoded, update to per-node CTA pattern (or relax to test that ANY uppercase CTA renders)
- New: assert HUD_CONTENT map exists in HoverHUD.tsx with 10 entries

**FIX-16 sun:satellite raw size ratio still passes:** voidexa 5.0, apps 3.5 → ratio 1.43 ✅ unchanged

```bash
npm test -- --run
```

Report exact count delta.

---

## TASK 4 — ADD REGRESSION TEST

Create `components/starmap/__tests__/afs-10-fix-17-hud-content.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'
import { nodes } from '../nodes'

describe('AFS-10-FIX-17 — HUD content map + label fontSize bump', () => {
  it('NodeMesh.tsx uses 64px sun and 56px satellite fontSize', () => {
    const file = readFileSync(
      join(process.cwd(), 'components/starmap/NodeMesh.tsx'),
      'utf-8'
    )
    expect(file).toMatch(/64px/)
    expect(file).toMatch(/56px/)
    // Old FIX-16 values should be gone from main label
    expect(file).not.toMatch(/'48px'/)
    expect(file).not.toMatch(/'42px'/)
  })

  it('NodeMesh.tsx still has distanceFactor=16 (NOT removed — FIX-14 lesson)', () => {
    const file = readFileSync(
      join(process.cwd(), 'components/starmap/NodeMesh.tsx'),
      'utf-8'
    )
    expect(file).toMatch(/distanceFactor=\{16\}/)
  })

  it('HoverHUD.tsx has HUD_CONTENT map with all 10 node ids', () => {
    const file = readFileSync(
      join(process.cwd(), 'components/starmap/HoverHUD.tsx'),
      'utf-8'
    )
    expect(file).toMatch(/HUD_CONTENT/)
    
    // All 10 node ids should be keys in the map
    const expectedIds = [
      'voidexa', 'apps', 'quantum', 'trading-hub', 'services',
      'game-hub', 'ai-tools', 'contact', 'station', 'claim-your-planet',
    ]
    for (const id of expectedIds) {
      // Match either 'id' or "id" or `id` as a key in the map
      expect(file).toMatch(new RegExp(`['"\`]${id}['"\`]\\s*:\\s*\\{`))
    }
  })

  it('HoverHUD.tsx mentions ECOSYSTEM and 4 AIs (key voidexa + Quantum body excerpts)', () => {
    const file = readFileSync(
      join(process.cwd(), 'components/starmap/HoverHUD.tsx'),
      'utf-8'
    )
    expect(file).toMatch(/Sovereign AI Infrastructure/)
    expect(file).toMatch(/4 AIs/)
    expect(file).toMatch(/Council/)
    expect(file).toMatch(/Forge/)
    expect(file).toMatch(/Void Pro AI/)
  })

  it('HoverHUD.tsx still uses same-side logic from FIX-16', () => {
    const file = readFileSync(
      join(process.cwd(), 'components/starmap/HoverHUD.tsx'),
      'utf-8'
    )
    expect(file).toMatch(/isPlanetOnLeft\s*\?\s*['"]left['"]\s*:\s*['"]right['"]/)
  })

  it('HoverHUD.tsx design tokens UNCHANGED from FIX-15/16', () => {
    const file = readFileSync(
      join(process.cwd(), 'components/starmap/HoverHUD.tsx'),
      'utf-8'
    )
    expect(file).toMatch(/#00d4ff/)
    expect(file).toMatch(/rgba\(10,\s*14,\s*28/)
    expect(file).toMatch(/360/)
  })

  it('all 10 nodes preserved + voidexa size 5.0 (FIX-16 invariant)', () => {
    expect(nodes.length).toBe(10)
    const voidexa = nodes.find(n => n.id === 'voidexa')!
    expect(voidexa.size).toBeCloseTo(5.0, 1)
  })

  it('positions UNCHANGED (FIX-13 invariant)', () => {
    const contact = nodes.find(n => n.id === 'contact')!
    expect(contact.position).toEqual([-6, 11, -28])
    
    const station = nodes.find(n => n.id === 'station')!
    expect(station.position).toEqual([16, 5, -42])
    
    const apps = nodes.find(n => n.id === 'apps')!
    expect(apps.position).toEqual([-12, 4.5, -18])
  })
})
```

```bash
npm test -- --run afs-10-fix-17
```

Expected: 8/8 green.

---

## TASK 5 — BUILD VERIFICATION

```bash
npm run build
```

---

## TASK 6 — COMMIT + TAG + PUSH

SKILL first:
```bash
git add docs/skills/SKILL_AFS-10-FIX-17.md
git commit -m "chore(afs-10-fix-17): add HUD content + fontSize bump SKILL"
```

Sprint:
```bash
git add components/starmap/NodeMesh.tsx
git add components/starmap/HoverHUD.tsx
git add components/starmap/__tests__/afs-10-fix-17-hud-content.test.ts
git add [updated test files from Task 3]
git status
```

```bash
git commit -m "fix(afs-10-fix-17): premium HUD content + label fontSize 64/56

Per Jix audit of all 10 routes — HUD now shows authoritative content
per planet, not just sublabel. Voidexa describes ecosystem mission.
Quantum mentions all 3 sub-products (Council, Forge, Void Pro AI).
Trading Hub describes merged vision (APEX + Scalper + leaderboard).
All 10 planets have title + body + per-node CTA.

Default label fontSize 48/42 -> 64/56 (Word size 6 -> 12-14).
distanceFactor=16 PRESERVED (FIX-14 lesson).

ALL FIX-13 spacing UNCHANGED.
ALL FIX-16 sizes UNCHANGED.
HUD design tokens UNCHANGED."

git tag sprint-afs-10-fix-17-complete
git push origin main
git push origin sprint-afs-10-fix-17-complete
```

```bash
git status
git log origin/main --oneline -3
```

---

## TASK 7 — LIVE VERIFY (Jix-performed)

Wait ≥90s for Vercel deploy. Hard-refresh `/starmap/voidexa` incognito.

### 7.1 Default label readability
- ✅ Planet names noticeably bigger and clearly readable at default zoom
- ✅ Far planets (game-hub, ai-tools) labels still readable
- ✅ Labels bigger but still scale with distance via distanceFactor=16

### 7.2 HUD content per planet
Hover EACH of the 10 planets and verify:
- ✅ voidexa: ecosystem mission text shows
- ✅ apps: Comlink + tools text
- ✅ quantum: 3 sub-products listed (Council, Forge, Void Pro AI)
- ✅ trading-hub: APEX + Scalper + +194.79% text
- ✅ services: custom AI development text
- ✅ game-hub: card battle + free flight + universe
- ✅ ai-tools: book + website + idea text
- ✅ contact: "Let's build something" text
- ✅ station: cinema/science/social decks text
- ✅ claim-your-planet: Pioneer Program + 10 slots text

### 7.3 Per-node CTA
- ✅ Each planet has unique footer CTA (not all "→ CLICK TO ENTER")
- ✅ voidexa: "→ ENTER ECOSYSTEM"
- ✅ Game Hub: "→ COMING SOON" (matches pre-existing 404 state)
- ✅ Others per content map

### 7.4 Regression
- ✅ Side-aware HUD still works (planet left → HUD left)
- ✅ Auto-rotation still works at 0.22 speed
- ✅ Hover-pause still works
- ✅ Per-frame line tracking still works
- ✅ Voidexa still size 5.0
- ✅ Saturn rings on Quantum proportional
- ✅ All 10 planets visible
- ✅ Galaxy view UNCHANGED
- ✅ Routes load (/game-hub 404 = pre-existing P0-NEW-8)
- ✅ No new console errors

---

## DEFINITION OF DONE

- [ ] SKILL.md committed FIRST
- [ ] Backup tag pushed
- [ ] Pre-flight report delivered + node id verification + locks confirmed
- [ ] NodeMesh.tsx: fontSize 64/56, distanceFactor=16 PRESERVED
- [ ] HoverHUD.tsx: HUD_CONTENT map added, content lookup wired in, design tokens unchanged
- [ ] Existing tests updated (fontSize regex, HUD CTA assertions)
- [ ] FIX-17 regression test (8 assertions) green
- [ ] `npm run build` succeeds
- [ ] Committed + tagged + pushed
- [ ] Vercel deployed
- [ ] Jix live-verifies all 10 planet HUDs + label readability

---

## ROLLBACK

```bash
git reset --hard backup/pre-afs-10-fix-17-20260430
git push origin main --force-with-lease
git push origin :refs/tags/sprint-afs-10-fix-17-complete
git tag -d sprint-afs-10-fix-17-complete
```

---

## RISKS

- **R1 — Node id mismatch.** Pre-flight Task 0.4 catches this. If `space-station` vs `station` etc, adjust map keys at Checkpoint 1.
- **R2 — 64px sun label overflows voidexa body.** voidexa size 5.0 = larger body, can absorb larger label. 56px on satellites may overflow smaller bodies (station 2.5, claim 1.54). Live verify; if grotesque, FIX-18 trims to 56/48.
- **R3 — HUD body too long for some planets.** Quantum and voidexa bodies are longer than current sublabels. HUD panel width 360px + lineHeight 1.5 should accommodate. Live verify; if text wraps awkwardly, FIX-18 either widens panel or shortens body text.
- **R4 — Forward-looking content vs current state.** Trading Hub body describes merged vision (per SLUT 21 lock) which doesn't yet match `/trading-hub` live UI. Sprint B will merge AI Trading content into /trading-hub. Acceptable — HUD shows what voidexa platform delivers, not transient route state.
- **R5 — Game Hub 404 + "COMING SOON" CTA.** Consistent with P0-NEW-8 deferral. When Sprint B builds /game-hub MVP, FIX-18 can flip CTA to "→ ENTER HUB".

---

## RULES APPLIED

- **Rule A:** Live audit performed on all 10 routes during this session — content authored from real page text, not guesses ✅
- **Rule B:** Math verified — fontSize 64/56 = 1.33× from FIX-16's 48/42, matches Jix's "size 6 → size 12-14" intent
- **Rule C:** SKILL committed before code ✅
- **Rule D:** Locks from Jix in chat (HUD content per planet, fontSize bump, no Jix on Quantum AI list, no scope creep into Quantum landing rebuild) captured
- **Rule E:** Scope respects all FIX-3 through FIX-16 locked items — only fontSize + HoverHUD.tsx content touched
- **Rule F:** Forward-looking Trading Hub content explicitly noted — will require Sprint B to align /trading-hub UI

---

# END SKILL — AFS-10-FIX-17
