import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

// AFS-6g Task 9 — Free Flight skybox swap.
// Source-level only: live verify is skipped because BUG-04 (memory leak)
// makes the route unsafe to enter for visual inspection. Per Jix decision
// during checkpoint review.

const FF_SCENE_SRC = readFileSync(
  join(process.cwd(), 'components', 'freeflight', 'FreeFlightScene.tsx'),
  'utf8',
)

describe('AFS-6g FreeFlightScene — Task 9 skybox swap', () => {
  it('imports SpaceSkybox from components/three', () => {
    expect(FF_SCENE_SRC).toMatch(
      /import\s*\{\s*SpaceSkybox\s*\}\s*from\s*['"]@\/components\/three\/SpaceSkybox['"]/,
    )
  })

  it('imports Suspense from react (needed for async texture)', () => {
    expect(FF_SCENE_SRC).toMatch(
      /import\s*\{\s*[^}]*Suspense[^}]*\}\s*from\s*['"]react['"]/,
    )
  })

  it('does NOT import Stars from @react-three/drei (regression guard)', () => {
    expect(FF_SCENE_SRC).not.toMatch(/import\s*\{[^}]*Stars[^}]*\}\s*from\s*['"]@react-three\/drei['"]/)
  })

  it('does NOT render the legacy <Stars> particle system (regression guard)', () => {
    expect(FF_SCENE_SRC).not.toMatch(/<Stars\b/)
  })

  it('renders SpaceSkybox with the bundled deep_space_01.png texture', () => {
    expect(FF_SCENE_SRC).toMatch(/<SpaceSkybox\b[\s\S]*?texture="\/skybox\/deep_space_01\.png"/)
  })

  it('renders SpaceSkybox with radius 1500 (consistent with battle scene)', () => {
    expect(FF_SCENE_SRC).toMatch(/<SpaceSkybox\b[\s\S]*?radius=\{1500\}/)
  })

  it('renders SpaceSkybox with rotateWithCamera=true (first-person flight)', () => {
    expect(FF_SCENE_SRC).toMatch(/<SpaceSkybox\b[\s\S]*?rotateWithCamera=\{true\}/)
  })

  it('wraps SpaceSkybox in a Suspense fallback (texture is async)', () => {
    expect(FF_SCENE_SRC).toMatch(/<Suspense\s+fallback=\{null\}>[\s\S]*?<SpaceSkybox/)
  })
})
