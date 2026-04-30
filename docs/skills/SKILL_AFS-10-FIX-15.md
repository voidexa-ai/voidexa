# SKILL — AFS-10-FIX-15: Hover HUD Terminal + Auto-Rotate + Label Cleanup

**Sprint:** AFS-10-FIX-15
**Parent sprint:** AFS-10 (visual polish layer, replacement for FIX-14 label distance approach)
**Type:** Architecture change — hover-driven info HUD + auto-rotation + label simplification
**Priority:** P1 (visual polish — Jix's game-style HUD redesign)
**Estimated time:** 60-90 min (larger sprint than FIX-3 through FIX-14)
**Authored:** SLUT 25 (Apr 30 2026)

---

## CONTEXT

After AFS-10-FIX-14 was rolled back (label distanceFactor removal made labels massively oversized), Jix proposed a fundamentally different solution:

> "kunne man ikke lave det sådan her istedet. når man holder musen over en planet. stopper auto rotering. og der laves en tynd line fra planeten op til et terminal vindu. og der kan man læse hvad den planet indebær. igen olidt game agtigt. så kun behold selve planet name. i en læsebar tekst under planeten."

**The new model:**

1. **Default state:** Auto-rotation enabled. Each planet shows ONLY its name (small, readable) underneath. NO subtitle clutter.
2. **Hover over planet:** Auto-rotation pauses → thin cyan line connects planet to a HUD terminal panel → terminal shows planet name + description.
3. **Mouse leaves:** HUD fades out → auto-rotation resumes.

This solves the label-readability problem without making any text bigger — instead, info is on-demand rather than always visible. Default scene becomes clean, game-like, sci-fi.

**Build state at sprint start:** HEAD = `34f8c58` (FIX-13 — post-FIX-14-rollback).

---

## DESIGN DECISIONS (LOCKED FROM JIX)

| Item | Lock |
|---|---|
| HUD position | Side-aware: HUD appears on opposite side from hovered planet (planet on right → HUD left, planet on left → HUD right) |
| HUD style | Clean / minimalistic (NOT KCP-90 terminal-with-scanlines style) |
| Connecting line color | Cyan / aqua (matches voidexa-sun and scene aesthetic) |
| HUD content | Planet name (large) + description (current `subtitle` from nodes.ts) + small "Click to enter" hint |
| Default label under planet | Planet name ONLY (drop subtitle from default rendering) |
| Auto-rotation | Enabled at slow speed by default; pauses on hover |
| Auto-rotation resume | Resumes when mouse leaves planet |

---

## SCOPE

### IN SCOPE

1. **Auto-rotation in OrbitControls** (`StarMapScene.tsx`):
   - Add `autoRotate={true}` and `autoRotateSpeed={0.5}` (slow rotation)
   - Pause via state when any node is hovered

2. **NodeMesh.tsx hover detection:**
   - Add `onPointerEnter` and `onPointerLeave` to the planet mesh
   - Track `hoveredNodeId` in scene-level state (lift state up to StarMapScene.tsx or use a Zustand store if one exists)

3. **Default label simplification:**
   - Existing main label `<Html>` block: keep, but simplify to show ONLY name (no subtitle)
   - Existing subtitle `<Html>` block: REMOVE entirely (its content moves to HUD)
   - Keep distanceFactor=16 on remaining label (FIX-13 baseline behavior)
   - fontSize for name: 45px → **30px** (smaller now that subtitle is gone, scene needs less text density)

4. **NEW HoverHUD component** (new file `components/starmap/HoverHUD.tsx`):
   - Receives `hoveredNode: StarNode | null` as prop
   - Receives `screenPosition: { x, y } | null` (planet's projected screen position)
   - Renders fixed-position HUD panel on opposite side of screen from planet
   - Renders SVG line from planet screen position to HUD edge
   - Fades in/out smoothly (CSS transition)

5. **Screen position calculation:**
   - In `NodeMesh.tsx`, expose hovered node's 3D position
   - In `StarMapScene.tsx` parent, project the 3D position to 2D screen coordinates using `useThree()` camera and `vector.project(camera)`
   - Pass projected coordinates to `HoverHUD`

6. **HoverHUD design** (clean/minimalistic per Jix):
   - Backdrop: semi-transparent dark panel, soft border, subtle cyan glow
   - Title: planet name, large, white
   - Body: description (current subtitle text), grey-ish
   - Footer: "→ Click to enter" hint
   - Fade-in 200ms, fade-out 150ms
   - No scanlines, no terminal chrome (Jix specifically said NOT KCP-90 style)

7. **Connecting line (SVG overlay):**
   - Cyan color (#00d4ff or similar matching scene)
   - 1-2px stroke
   - From planet screen position to HUD panel edge
   - Subtle pulsing or steady (designer's choice, default steady)

### OUT OF SCOPE — DO NOT TOUCH

- All node `size` values (FIX-13 state)
- All node `position` values (FIX-13 state)
- Camera position / target / FOV / far plane (FIX-12 state)
- OrbitControls minDistance / maxDistance (5 / 150)
- Sphere radius (800)
- Galaxy view
- KCP-90 terminal in corner (separate decoration)
- Decorative dashed ring on claim-your-planet (Block 1 — keep its distanceFactor=16)
- Background nebula
- "While I'm in here..." anything else

---

## ARCHITECTURE OVERVIEW

```
StarMapCanvas.tsx
└─ Canvas
   └─ StarMapScene.tsx
      ├─ state: hoveredNodeId, hoveredScreenPos
      ├─ <OrbitControls autoRotate={!hoveredNodeId} ... />
      ├─ <NodeMesh
      │    onHoverStart={(id, pos) => setHovered(id, pos)}
      │    onHoverEnd={() => setHovered(null, null)}
      │    showSubtitle={false}      ← new prop, default false
      │    fontSize="30px"           ← reduced from 45
      │    ... />
      └─ ... (sun, nebula, etc)
└─ HoverHUD.tsx                       ← NEW component (rendered as DOM sibling, NOT inside Canvas)
   ├─ receives: hoveredNode + screenPos
   ├─ renders: fixed-position panel + SVG line
   └─ fade-in/out via CSS opacity transition
```

**Key insight:** HoverHUD must be rendered OUTSIDE the `<Canvas>` but inside the same React tree, so it overlays the canvas as a normal DOM element. Use a wrapper component that renders both `<Canvas>` and `<HoverHUD>` siblings.

---

## PRE-FLIGHT (MANDATORY — STOP at checkpoint)

### Task 0.1 — Repo state baseline

```bash
cd C:\Users\Jixwu\Desktop\voidexa
git status
git log origin/main --oneline -3
```

**Expected:**
- HEAD = `34f8c58` (FIX-13 post-rollback) or newer
- Working tree clean

### Task 0.2 — Backup tag

```bash
git tag backup/pre-afs-10-fix-15-20260430
git push origin backup/pre-afs-10-fix-15-20260430
```

### Task 0.3 — Read current architecture

```bash
cat components/starmap/StarMapScene.tsx
cat components/starmap/NodeMesh.tsx
cat components/starmap/StarMapCanvas.tsx
ls components/starmap/
```

**Identify and report:**

1. Where is OrbitControls rendered? (StarMapScene.tsx confirmed at line ~125)
2. How is NodeMesh structured? Does it accept onPointerEnter/Leave already? Where are the two `<Html>` blocks (decorative ring + label)?
3. Where in JSX tree is the Canvas mounted? Can we add a sibling component for HoverHUD outside Canvas?
4. Is there a state-management library (Zustand/Jotai/Redux)? Or should we lift state to StarMapScene + drill props?
5. What styling system (Tailwind classes? CSS modules? styled-components?) for HUD panel?
6. What's the existing color palette / design tokens for the scene? (look for CSS vars or theme constants)

**Report:**
```
PRE-FLIGHT REPORT — AFS-10-FIX-15

0.1 Repo state: HEAD [hash], clean
0.2 Backup tag: pushed
0.3 Architecture cross-check:
    OrbitControls location: [file:line]
    NodeMesh structure: [summary]
      - Block 1 (decorative ring): line [N], distanceFactor=16
      - Block 2 (main label): line [N], fontSize 45px
      - Block 3 (subtitle): line [N], fontSize 35px
    Canvas mount point: [file:line]
    State management: [Zustand store path | none — drill props]
    Styling: [Tailwind | CSS modules | styled-components | other]
    Color palette / design tokens: [paste relevant CSS vars or constants]

Recommended approach:
    [if Zustand exists, use it for hoveredNode state]
    [if no store, lift state to StarMapScene and pass via React Context or prop drilling]
    [if Tailwind, use Tailwind classes; otherwise match existing pattern]
```

---

### 🔴 CHECKPOINT 1 — MANDATORY STOP

After Task 0.1-0.3, output the pre-flight report.

**WAIT FOR JIX EXPLICIT APPROVAL** with locked architecture decisions:
- State management approach (store vs drill)
- Styling approach
- HUD position offsets (px from edge)
- Line stroke color exact value
- Fade timings

---

## TASK 1 — STARMAPSCENE STATE LIFT + AUTO-ROTATE

Edit `components/starmap/StarMapScene.tsx`:

1. Add state at scene level:
```tsx
const [hoveredNode, setHoveredNode] = useState<StarNode | null>(null)
const [hoveredScreenPos, setHoveredScreenPos] = useState<{ x: number; y: number } | null>(null)
```

2. Update OrbitControls:
```tsx
<OrbitControls
  ...existing props...
  autoRotate={!hoveredNode}
  autoRotateSpeed={0.5}
  enableRotate={true}  // unchanged
/>
```

3. Pass hover handlers to each NodeMesh:
```tsx
{nodes.map(node => (
  <NodeMesh
    key={node.id}
    node={node}
    onHoverStart={(screenPos) => {
      setHoveredNode(node)
      setHoveredScreenPos(screenPos)
    }}
    onHoverEnd={() => {
      setHoveredNode(null)
      setHoveredScreenPos(null)
    }}
    showSubtitle={false}
    nameFontSize="30px"
  />
))}
```

4. Lift hovered state to parent `StarMapCanvas.tsx` via callback prop or context, so HoverHUD (outside Canvas) can read it.

```bash
npx tsc --noEmit
```

---

## TASK 2 — NODEMESH HOVER + LABEL SIMPLIFICATION

Edit `components/starmap/NodeMesh.tsx`:

1. Add `onHoverStart` / `onHoverEnd` / `showSubtitle` / `nameFontSize` props to component signature
2. Add hover handlers to the planet mesh:

```tsx
<mesh
  ...existing props...
  onPointerEnter={(e) => {
    e.stopPropagation()
    document.body.style.cursor = 'pointer'
    // Compute screen position
    const vec = new THREE.Vector3()
    meshRef.current.getWorldPosition(vec)
    vec.project(camera)
    const x = (vec.x * 0.5 + 0.5) * size.width
    const y = (-vec.y * 0.5 + 0.5) * size.height
    onHoverStart?.({ x, y })
  }}
  onPointerLeave={(e) => {
    e.stopPropagation()
    document.body.style.cursor = 'auto'
    onHoverEnd?.()
  }}
>
```

(Need `useThree()` for `camera` and `size`.)

3. Update the main label `<Html>` block to use new fontSize:
   - Replace `fontSize: isCenter ? '52px' : '45px'` with `fontSize: isCenter ? '36px' : nameFontSize` (or whatever's clean)
   - Sun keeps a slightly larger value vs satellites for hierarchy

4. **DELETE the subtitle `<Html>` block entirely.** Subtitle text moves to HoverHUD.

```bash
npx tsc --noEmit
```

---

## TASK 3 — CREATE HOVERHUD COMPONENT

Create `components/starmap/HoverHUD.tsx`:

```tsx
'use client'

import { useEffect, useState } from 'react'
import type { StarNode } from './nodes'

type Props = {
  node: StarNode | null
  screenPos: { x: number; y: number } | null
  viewportWidth: number
  viewportHeight: number
}

export default function HoverHUD({ node, screenPos, viewportWidth, viewportHeight }: Props) {
  const [visible, setVisible] = useState(false)
  const [renderedNode, setRenderedNode] = useState<StarNode | null>(null)
  const [renderedPos, setRenderedPos] = useState<typeof screenPos>(null)

  useEffect(() => {
    if (node && screenPos) {
      setRenderedNode(node)
      setRenderedPos(screenPos)
      setVisible(true)
    } else {
      setVisible(false)
      // Don't clear renderedNode — let fade-out finish first
      const t = setTimeout(() => setRenderedNode(null), 200)
      return () => clearTimeout(t)
    }
  }, [node, screenPos])

  if (!renderedNode || !renderedPos) return null

  // HUD position: opposite side from planet
  const isPlanetOnLeft = renderedPos.x < viewportWidth / 2
  const hudSide: 'left' | 'right' = isPlanetOnLeft ? 'right' : 'left'
  const hudX = hudSide === 'left' ? 60 : viewportWidth - 360 - 60
  const hudY = Math.min(Math.max(renderedPos.y - 80, 60), viewportHeight - 200)

  // Line from planet to HUD edge
  const lineEndX = hudSide === 'left' ? hudX + 360 : hudX
  const lineEndY = hudY + 60

  return (
    <>
      {/* SVG overlay for connecting line */}
      <svg
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 50,
          opacity: visible ? 1 : 0,
          transition: 'opacity 200ms ease',
        }}
      >
        <line
          x1={renderedPos.x}
          y1={renderedPos.y}
          x2={lineEndX}
          y2={lineEndY}
          stroke="#00d4ff"
          strokeWidth="1.5"
          strokeOpacity="0.6"
        />
      </svg>

      {/* HUD panel */}
      <div
        style={{
          position: 'fixed',
          left: hudX,
          top: hudY,
          width: 360,
          padding: '24px 28px',
          background: 'rgba(10, 14, 28, 0.85)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(0, 212, 255, 0.3)',
          borderRadius: 8,
          boxShadow: '0 0 40px rgba(0, 212, 255, 0.15)',
          color: 'white',
          fontFamily: 'var(--font-inter, system-ui)',
          opacity: visible ? 1 : 0,
          transition: 'opacity 200ms ease',
          zIndex: 51,
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            fontSize: '22px',
            fontWeight: 600,
            color: '#00d4ff',
            marginBottom: 8,
            letterSpacing: '-0.01em',
          }}
        >
          {renderedNode.label}
        </div>
        <div
          style={{
            fontSize: '14px',
            color: 'rgba(255, 255, 255, 0.75)',
            lineHeight: 1.5,
            marginBottom: 16,
          }}
        >
          {renderedNode.subtitle ?? renderedNode.description ?? ''}
        </div>
        <div
          style={{
            fontSize: '12px',
            color: 'rgba(0, 212, 255, 0.7)',
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
          }}
        >
          → Click to enter
        </div>
      </div>
    </>
  )
}
```

**Note:** The `subtitle` field name on StarNode may be different — pre-flight Task 0.3 should report the actual field. Adjust the component accordingly. Common candidates: `subtitle`, `description`, `tagline`.

---

## TASK 4 — WIRE HOVERHUD INTO STARMAPCANVAS

Edit `components/starmap/StarMapCanvas.tsx`:

```tsx
const [hoveredNode, setHoveredNode] = useState<StarNode | null>(null)
const [hoveredScreenPos, setHoveredScreenPos] = useState<{ x: number; y: number } | null>(null)
const [vp, setVp] = useState({ w: 0, h: 0 })

useEffect(() => {
  const update = () => setVp({ w: window.innerWidth, h: window.innerHeight })
  update()
  window.addEventListener('resize', update)
  return () => window.removeEventListener('resize', update)
}, [])

return (
  <div className="relative w-full h-full">
    <Canvas ...>
      <StarMapScene
        onHoverChange={(node, pos) => {
          setHoveredNode(node)
          setHoveredScreenPos(pos)
        }}
      />
    </Canvas>
    <HoverHUD
      node={hoveredNode}
      screenPos={hoveredScreenPos}
      viewportWidth={vp.w}
      viewportHeight={vp.h}
    />
  </div>
)
```

StarMapScene gets a new prop `onHoverChange` instead of internal state.

```bash
npx tsc --noEmit
```

---

## TASK 5 — UPDATE TESTS

```bash
grep -rn "fontSize\|<Html\|distanceFactor\|autoRotate" tests/ components/starmap/__tests__/ 2>/dev/null | head -40
```

Categorize:
- Tests asserting subtitle exists in render → REMOVE or update (subtitle moved to HUD)
- Tests asserting fontSize 45/52/40 → update to new name fontSize value (30/36 or whatever locked)
- Tests asserting `distanceFactor={16}` count → still 2 occurrences (1 decorative ring on claim + 1 main label) ← unchanged
- New: tests should NOT crash if HoverHUD imported (component is stateless/prop-driven)

```bash
npm test -- --run
```

Report exact count delta.

---

## TASK 6 — ADD REGRESSION TEST

Create `components/starmap/__tests__/afs-10-fix-15-hover-hud.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'

describe('AFS-10-FIX-15 — hover HUD + auto-rotate + label cleanup', () => {
  it('NodeMesh.tsx removes subtitle <Html> block (subtitle moved to HoverHUD)', () => {
    const file = readFileSync(
      join(process.cwd(), 'components/starmap/NodeMesh.tsx'),
      'utf-8'
    )
    // Subtitle text was rendered with fontSize 35px (FIX-13) or 40px (had FIX-13 attempted bump)
    // After FIX-15, no <Html> block should match the subtitle pattern
    const htmlBlocks = (file.match(/<Html\b/g) || []).length
    // Expect: 1 decorative ring (claim only, conditional) + 1 main label = 2 total
    // OR if claim ring is in same block as label, 1 total
    // Pre-flight Task 0.3 should report exact baseline; assertion validates count went DOWN by 1
    expect(htmlBlocks).toBeLessThanOrEqual(2)
  })

  it('NodeMesh.tsx accepts onHoverStart and onHoverEnd props', () => {
    const file = readFileSync(
      join(process.cwd(), 'components/starmap/NodeMesh.tsx'),
      'utf-8'
    )
    expect(file).toMatch(/onHoverStart/)
    expect(file).toMatch(/onHoverEnd/)
  })

  it('StarMapScene.tsx uses autoRotate on OrbitControls', () => {
    const file = readFileSync(
      join(process.cwd(), 'components/starmap/StarMapScene.tsx'),
      'utf-8'
    )
    expect(file).toMatch(/autoRotate/)
  })

  it('HoverHUD component file exists and exports default', () => {
    const file = readFileSync(
      join(process.cwd(), 'components/starmap/HoverHUD.tsx'),
      'utf-8'
    )
    expect(file).toMatch(/export default/)
    expect(file).toMatch(/HoverHUD/)
  })

  it('HoverHUD component is wired into StarMapCanvas', () => {
    const file = readFileSync(
      join(process.cwd(), 'components/starmap/StarMapCanvas.tsx'),
      'utf-8'
    )
    expect(file).toMatch(/HoverHUD/)
  })

  it('positions and sizes UNCHANGED from FIX-13', async () => {
    const { nodes } = await import('../nodes')
    const voidexa = nodes.find(n => n.id === 'voidexa')!
    expect(voidexa.size).toBeCloseTo(3.5, 1)
    expect(voidexa.position).toEqual([0, 0, 0])
    
    const contact = nodes.find(n => n.id === 'contact')!
    expect(contact.position).toEqual([-6, 11, -28])
    
    const station = nodes.find(n => n.id === 'station')!
    expect(station.position).toEqual([16, 5, -42])
  })
})
```

```bash
npm test -- --run afs-10-fix-15-hover-hud
```

Expected: 6/6 green.

---

## TASK 7 — BUILD VERIFICATION

```bash
npm run build
```

---

## TASK 8 — COMMIT + TAG + PUSH

SKILL first:
```bash
git add docs/skills/SKILL_AFS-10-FIX-15.md
git commit -m "chore(afs-10-fix-15): add hover HUD + auto-rotate SKILL"
```

Sprint:
```bash
git add components/starmap/StarMapScene.tsx
git add components/starmap/StarMapCanvas.tsx
git add components/starmap/NodeMesh.tsx
git add components/starmap/HoverHUD.tsx
git add components/starmap/__tests__/afs-10-fix-15-hover-hud.test.ts
git add [updated test files from Task 5]
git status
```

```bash
git commit -m "fix(afs-10-fix-15): hover HUD terminal + auto-rotate + label cleanup

Game-style interactive HUD replaces always-visible subtitles. Default
scene shows planet name only (small, readable). Hovering a planet
pauses auto-rotation, draws a thin cyan line to a side-panel HUD
showing planet name + description + 'click to enter' hint.

Auto-rotation enabled at 0.5 speed by default, paused on hover.
HUD positioned on opposite side from hovered planet (left/right
auto-detected). Clean minimalistic design (NOT KCP-90 terminal).

Architecture changes:
- New HoverHUD.tsx component (DOM overlay, sibling of Canvas)
- NodeMesh exposes onHoverStart/onHoverEnd with screen-projected pos
- StarMapCanvas owns hover state, drills to scene + HUD
- Subtitle <Html> block removed from NodeMesh (text moved to HUD)
- Main label fontSize reduced (subtitle no longer adds clutter)

ALL positions UNCHANGED. ALL sizes UNCHANGED. Camera UNCHANGED.
Galaxy view UNCHANGED."

git tag sprint-afs-10-fix-15-complete
git push origin main
git push origin sprint-afs-10-fix-15-complete
```

```bash
git status
git log origin/main --oneline -3
```

---

## TASK 9 — LIVE VERIFY (Jix-performed)

Wait ≥90s for Vercel deploy. Hard-refresh `/starmap/voidexa` incognito.

### 9.1 Default scene
- ✅ Auto-rotation visible (slow, 0.5 speed)
- ✅ Each planet shows ONLY its name (no subtitle text)
- ✅ Names readable but not dominating scene
- ✅ Scene feels clean and game-like

### 9.2 Hover interaction
- ✅ Hover any planet → auto-rotation pauses
- ✅ Thin cyan line draws from planet to side panel
- ✅ HUD panel appears with: planet name (large) + description + "Click to enter"
- ✅ HUD on OPPOSITE side from planet (planet right → HUD left, planet left → HUD right)
- ✅ Mouse leaves planet → HUD fades out → auto-rotation resumes

### 9.3 Multiple hover
- ✅ Hover planet A, then move directly to planet B → HUD smoothly switches content + position
- ✅ Line follows planet's screen position even while planet moves due to OrbitControls drag

### 9.4 Click behavior
- ✅ Clicking a planet still navigates to its route (existing behavior preserved)

### 9.5 Regression
- ✅ All 10 planets visible
- ✅ Saturn rings on Quantum proportional
- ✅ Voidexa sun unchanged at 3.5
- ✅ Spacing unchanged (FIX-13 layout)
- ✅ Galaxy view UNCHANGED
- ✅ Routes load (/game-hub 404 = pre-existing P0-NEW-8)
- ✅ No new console errors

---

## DEFINITION OF DONE

- [ ] SKILL.md committed FIRST
- [ ] Backup tag pushed
- [ ] Pre-flight report delivered + locks confirmed (architecture, styling, exact pixel values)
- [ ] StarMapScene.tsx: autoRotate + hover state lift
- [ ] NodeMesh.tsx: hover handlers + subtitle removed + name fontSize updated
- [ ] StarMapCanvas.tsx: HoverHUD integrated
- [ ] HoverHUD.tsx: new component, clean design, side-aware
- [ ] Existing tests updated (subtitle removal, fontSize)
- [ ] FIX-15 regression test (6 assertions) green
- [ ] `npm run build` succeeds
- [ ] Committed + tagged + pushed
- [ ] Vercel deployed
- [ ] Jix live-verifies hover interaction across multiple planets and angles

---

## ROLLBACK

```bash
git reset --hard backup/pre-afs-10-fix-15-20260430
git push origin main --force-with-lease
git push origin :refs/tags/sprint-afs-10-fix-15-complete
git tag -d sprint-afs-10-fix-15-complete
```

---

## RISKS

- **R1 — Screen position calculation drifts as camera rotates.** Need to recompute on every frame OR on mouse-move. Mitigation: project node position in onPointerEnter only (single moment); HUD stays anchored to that snapshot until mouse leaves. If user rotates while hovering, HUD position may drift — acceptable for v1.
- **R2 — Subtitle field name mismatch.** Pre-flight Task 0.3 should report exact StarNode shape. Adjust HoverHUD to use the correct field name.
- **R3 — Auto-rotation feels too fast or too slow.** Locked at 0.5; if wrong, FIX-16 tunes to 0.3 or 0.8.
- **R4 — HoverHUD fixed-position covers important UI.** "Back to Galaxy" button (top-left), KCP-90 terminal (bottom-right), "Enter Free Flight" button (bottom-center). HUD positioning logic needs to avoid these zones — Task 3 component sets `top: max(60, planet.y - 80)` and `left: 60 / right: 60` which sits below "Back to Galaxy" and away from corners. Live-verify.
- **R5 — Mobile/touch devices have no hover.** This sprint focuses on desktop. Mobile fallback (tap to show HUD, tap elsewhere to dismiss) is a future sprint.
- **R6 — Canvas pointer events may conflict with OrbitControls drag.** drei OrbitControls swallows pointer events on the canvas background but planet meshes should still get them. Test thoroughly.
- **R7 — Decorative dashed ring on claim-your-planet** (Block 1, distanceFactor=16) — UNCHANGED. Not affected by this sprint.

---

## RULES APPLIED

- **Rule A:** Searched conversation_search — FIX-13 baseline confirmed, FIX-14 lessons captured ✅
- **Rule B:** Architecture verified — drei `<Html>` removal is well-understood from FIX-14 rollback
- **Rule C:** SKILL committed before code ✅
- **Rule D:** Locks from Jix in chat (auto-rotate, side-aware HUD, clean minimalistic, cyan line, name only under planet) captured
- **Rule E:** Scope respects all FIX-3 through FIX-13 locked items — no positions, sizes, camera changes
- **Rule F:** This sprint is BIGGER than typical FIX sprints (4 files modified, 1 new file). Estimate 60-90 min reflects this.

---

# END SKILL — AFS-10-FIX-15
