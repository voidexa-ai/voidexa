import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

// AFS-6g — Source-level invariants for the battle scene camera + skybox
// swap. Covers Tasks 6 (skybox swap in BattleScene) and 7 (OrbitControls
// in BattleCanvas). Vitest runs in `environment: node`.

const SCENE_SRC = readFileSync(
  join(process.cwd(), 'components', 'game', 'battle', 'BattleScene.tsx'),
  'utf8',
)

const CANVAS_SRC = readFileSync(
  join(process.cwd(), 'components', 'game', 'battle', 'BattleCanvas.tsx'),
  'utf8',
)

describe('AFS-6g BattleScene — Task 6 skybox swap', () => {
  it('imports SpaceSkybox from components/three', () => {
    expect(SCENE_SRC).toMatch(
      /import\s*\{\s*SpaceSkybox\s*\}\s*from\s*['"]@\/components\/three\/SpaceSkybox['"]/,
    )
  })

  it('does NOT import Stars from @react-three/drei (regression guard)', () => {
    expect(SCENE_SRC).not.toMatch(/import\s*\{[^}]*Stars[^}]*\}\s*from\s*['"]@react-three\/drei['"]/)
  })

  it('does NOT render the legacy <Stars> particle system (regression guard)', () => {
    expect(SCENE_SRC).not.toMatch(/<Stars\b/)
  })

  it('renders SpaceSkybox with the bundled deep_space_universe.png texture (post fix-7)', () => {
    // fix-7 swapped to custom AI-generated equirectangular nebula. The earlier
    // hazy_nebulae_1.png path is now the SpaceSkybox component default and is
    // used by Free Flight only.
    expect(SCENE_SRC).toMatch(/<SpaceSkybox\b[\s\S]*?texture="\/skybox\/deep_space_universe\.png"/)
  })

  it('renders SpaceSkybox with radius 1500 (matches camera far plane)', () => {
    expect(SCENE_SRC).toMatch(/<SpaceSkybox\b[\s\S]*?radius=\{1500\}/)
  })

  it('renders SpaceSkybox with rotateWithCamera=false (battle is third-person)', () => {
    expect(SCENE_SRC).toMatch(/<SpaceSkybox\b[\s\S]*?rotateWithCamera=\{false\}/)
  })

  it('renders SpaceSkybox with intensity=1 (full brightness)', () => {
    expect(SCENE_SRC).toMatch(/<SpaceSkybox\b[\s\S]*?intensity=\{1\}/)
  })

  it('wraps SpaceSkybox in a Suspense fallback (texture is async)', () => {
    expect(SCENE_SRC).toMatch(/<Suspense\s+fallback=\{null\}>[\s\S]*?<SpaceSkybox/)
  })
})

describe('AFS-6g BattleCanvas — Task 7 OrbitControls config', () => {
  it('imports OrbitControls from @react-three/drei', () => {
    expect(CANVAS_SRC).toMatch(
      /import\s*\{\s*OrbitControls\s*\}\s*from\s*['"]@react-three\/drei['"]/,
    )
  })

  it('renders an <OrbitControls /> element inside Canvas', () => {
    expect(CANVAS_SRC).toMatch(/<OrbitControls\b/)
  })

  it('enables zoom and rotate, disables pan', () => {
    expect(CANVAS_SRC).toMatch(/enableZoom=\{true\}/)
    expect(CANVAS_SRC).toMatch(/enableRotate=\{true\}/)
    expect(CANVAS_SRC).toMatch(/enablePan=\{false\}/)
  })

  it('caps zoom range to 10-24 units (matches existing camera z=16)', () => {
    expect(CANVAS_SRC).toMatch(/minDistance=\{10\}/)
    expect(CANVAS_SRC).toMatch(/maxDistance=\{24\}/)
  })

  it('limits azimuth rotation to ±20° (Math.PI / 9)', () => {
    expect(CANVAS_SRC).toMatch(/minAzimuthAngle=\{-Math\.PI\s*\/\s*9\}/)
    expect(CANVAS_SRC).toMatch(/maxAzimuthAngle=\{Math\.PI\s*\/\s*9\}/)
  })

  it('limits polar angle to 60°-82° (Math.PI/3 to Math.PI/2.2)', () => {
    expect(CANVAS_SRC).toMatch(/minPolarAngle=\{Math\.PI\s*\/\s*3\}/)
    expect(CANVAS_SRC).toMatch(/maxPolarAngle=\{Math\.PI\s*\/\s*2\.2\}/)
  })

  it('orbits around scene origin [0, 0, 0]', () => {
    expect(CANVAS_SRC).toMatch(/target=\{\[\s*0\s*,\s*0\s*,\s*0\s*\]\}/)
  })

  it('uses gentle zoom and rotate speeds (0.6, 0.4)', () => {
    expect(CANVAS_SRC).toMatch(/zoomSpeed=\{0\.6\}/)
    expect(CANVAS_SRC).toMatch(/rotateSpeed=\{0\.4\}/)
  })
})

describe('AFS-6g BattleCanvas — camera frustum supports skybox', () => {
  it('keeps camera position [0, 0, 16] (no reposition this sprint)', () => {
    expect(CANVAS_SRC).toMatch(/position:\s*\[\s*0\s*,\s*0\s*,\s*16\s*\]/)
  })

  it('keeps camera fov 55', () => {
    expect(CANVAS_SRC).toMatch(/fov:\s*55/)
  })

  it('extends camera far plane to >=1500 so SpaceSkybox sphere is not culled', () => {
    const m = CANVAS_SRC.match(/far:\s*(\d+)/)
    expect(m).not.toBeNull()
    const far = Number(m![1])
    expect(far).toBeGreaterThanOrEqual(1500)
  })
})
