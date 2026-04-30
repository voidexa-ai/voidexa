import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'
import { describe, it, expect } from 'vitest'
import { STAR_MAP_NODES } from '../components/starmap/nodes'

const STARMAP_DIR = resolve(__dirname, '..', 'components', 'starmap')
const NODE_MESH_SRC = readFileSync(resolve(STARMAP_DIR, 'NodeMesh.tsx'), 'utf-8')
const SCENE_SRC = readFileSync(resolve(STARMAP_DIR, 'StarMapScene.tsx'), 'utf-8')
const CANVAS_SRC = readFileSync(resolve(STARMAP_DIR, 'StarMapCanvas.tsx'), 'utf-8')

describe('AFS-10-FIX-15 — hover HUD + auto-rotate + label cleanup', () => {
  it('NodeMesh.tsx removes subtitle <Html> block (sublabel moved to HoverHUD)', () => {
    // FIX-13 had two <div> children inside the label <Html>: main label +
    // subtitle. FIX-15 deletes the subtitle div. Standalone fontSize 40px
    // and the literal {sublabel} render path inside NodeMesh should be gone.
    expect(NODE_MESH_SRC).not.toMatch(/fontSize:\s*'40px'/)
    // The {sublabel} expression rendered as JSX text should no longer appear
    // — sublabel is now a *destructured* identifier only.
    expect(NODE_MESH_SRC).not.toMatch(/>\s*\{sublabel\}\s*</)
  })

  it('NodeMesh.tsx accepts onHoverStart, onHoverEnd, onHoverUpdate, isHovered props', () => {
    expect(NODE_MESH_SRC).toMatch(/onHoverStart/)
    expect(NODE_MESH_SRC).toMatch(/onHoverEnd/)
    expect(NODE_MESH_SRC).toMatch(/onHoverUpdate/)
    expect(NODE_MESH_SRC).toMatch(/isHovered/)
  })

  it('NodeMesh.tsx no longer uses the old onHoverChange callback signature', () => {
    expect(NODE_MESH_SRC).not.toMatch(/onHoverChange\?\.\(/)
  })

  it('NodeMesh.tsx label fontSize is 48px (center) / 42px (satellite) post FIX-16', () => {
    expect(NODE_MESH_SRC).toMatch(/fontSize:\s*isCenter\s*\?\s*'48px'\s*:\s*'42px'/)
  })

  it('StarMapScene.tsx OrbitControls autoRotate is gated on hoveredNodeId', () => {
    // autoRotate should pause when a planet is hovered.
    expect(SCENE_SRC).toMatch(/autoRotate=\{!hoveredNodeId\}/)
  })

  it('StarMapScene.tsx is now a controlled component (hoveredNodeId, onHover* props)', () => {
    expect(SCENE_SRC).toMatch(/hoveredNodeId/)
    expect(SCENE_SRC).toMatch(/onHoverStart/)
    expect(SCENE_SRC).toMatch(/onHoverEnd/)
    expect(SCENE_SRC).toMatch(/onHoverUpdate/)
  })

  it('HoverHUD.tsx file exists and exports default', () => {
    const hudPath = resolve(STARMAP_DIR, 'HoverHUD.tsx')
    expect(existsSync(hudPath)).toBe(true)
    const hudSrc = readFileSync(hudPath, 'utf-8')
    expect(hudSrc).toMatch(/export default function HoverHUD/)
  })

  it('HoverHUD.tsx uses node.sublabel (the actual StarNode field)', () => {
    const hudSrc = readFileSync(resolve(STARMAP_DIR, 'HoverHUD.tsx'), 'utf-8')
    expect(hudSrc).toMatch(/renderedNode\.sublabel/)
    // SKILL template's wrong field names should not have leaked in.
    expect(hudSrc).not.toMatch(/renderedNode\.subtitle/)
    expect(hudSrc).not.toMatch(/renderedNode\.description/)
  })

  it('HoverHUD.tsx uses cyan accent #00d4ff for line stroke + locked design tokens', () => {
    const hudSrc = readFileSync(resolve(STARMAP_DIR, 'HoverHUD.tsx'), 'utf-8')
    expect(hudSrc).toMatch(/#00d4ff/)
    expect(hudSrc).toMatch(/rgba\(10,\s*14,\s*28,\s*0\.85\)/)
    expect(hudSrc).toMatch(/blur\(8px\)/)
  })

  it('HoverHUD is wired into StarMapCanvas as a sibling of the Canvas', () => {
    expect(CANVAS_SRC).toMatch(/import HoverHUD from/)
    expect(CANVAS_SRC).toMatch(/<HoverHUD/)
  })

  it('StarMapCanvas owns hover state (hoveredNode, hoveredScreenPos)', () => {
    expect(CANVAS_SRC).toMatch(/hoveredNode/)
    expect(CANVAS_SRC).toMatch(/hoveredScreenPos/)
  })

  it('positions UNCHANGED + voidexa 5.0 post FIX-16 (no spatial regression)', () => {
    const voidexa = STAR_MAP_NODES.find(n => n.id === 'voidexa')!
    expect(voidexa.size).toBeCloseTo(5.0, 1)
    expect(voidexa.position).toEqual([0, 0, 0])

    const apps = STAR_MAP_NODES.find(n => n.id === 'apps')!
    expect(apps.size).toBeCloseTo(3.5, 1)
    expect(apps.position).toEqual([-12, 4.5, -18])

    const contact = STAR_MAP_NODES.find(n => n.id === 'contact')!
    expect(contact.position).toEqual([-6, 11, -28])

    const station = STAR_MAP_NODES.find(n => n.id === 'station')!
    expect(station.position).toEqual([16, 5, -42])
  })

  it('all 10 nodes preserved', () => {
    expect(STAR_MAP_NODES.length).toBe(10)
  })

  it('decorative dashed ring on claim-your-planet (Block 1) keeps distanceFactor=16', () => {
    // Only Block 1 should retain the prop — Block 2 (label) keeps it too in
    // FIX-15 (we only removed the subtitle, not distanceFactor on the name).
    // The regression guard: distanceFactor=16 must still appear in NodeMesh
    // (it's used on at least the dashed ring), and Block 1's claim-only
    // conditional render is preserved.
    expect(NODE_MESH_SRC).toMatch(/node\.id\s*===\s*'claim-your-planet'/)
    expect(NODE_MESH_SRC).toMatch(/distanceFactor=\{16\}/)
  })
})
