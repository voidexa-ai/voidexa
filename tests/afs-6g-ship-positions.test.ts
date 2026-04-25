import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

// AFS-6g Task 8 — Ship positions and scales MUST remain unchanged from the
// post-AFS-6d baseline. This sprint adds skybox + orbit controls only;
// per-Jix decision in checkpoint review, ships are NOT repositioned.
// Re-tune is a separate sprint.

const SCENE_SRC = readFileSync(
  join(process.cwd(), 'components', 'game', 'battle', 'BattleScene.tsx'),
  'utf8',
)

describe('AFS-6g BattleScene — Task 8 ship positions unchanged', () => {
  it('PLAYER_POS stays at [0, -3.5, 8]', () => {
    expect(SCENE_SRC).toMatch(
      /PLAYER_POS\s*:\s*\[\s*number\s*,\s*number\s*,\s*number\s*\]\s*=\s*\[\s*0\s*,\s*-3\.5\s*,\s*8\s*\]/,
    )
  })

  it('ENEMY_POS stays at [0, 3.5, -14]', () => {
    expect(SCENE_SRC).toMatch(
      /ENEMY_POS\s*:\s*\[\s*number\s*,\s*number\s*,\s*number\s*\]\s*=\s*\[\s*0\s*,\s*3\.5\s*,\s*-14\s*\]/,
    )
  })

  it('player ship scale stays at 1.4', () => {
    expect(SCENE_SRC).toMatch(/url=\{playerShipUrl\}[\s\S]*?scale=\{1\.4\}/)
  })

  it('enemy ship scale stays at 1.6', () => {
    expect(SCENE_SRC).toMatch(/url=\{enemyShipUrl\}[\s\S]*?scale=\{1\.6\}/)
  })

  it('player ship rotation stays at Math.PI (faces enemy)', () => {
    expect(SCENE_SRC).toMatch(/url=\{playerShipUrl\}[\s\S]*?rotationY=\{Math\.PI\}/)
  })

  it('enemy ship rotation stays at 0 (faces player)', () => {
    expect(SCENE_SRC).toMatch(/url=\{enemyShipUrl\}[\s\S]*?rotationY=\{0\}/)
  })

  it('fog stays at near=40 far=160 (unchanged from AFS-6d)', () => {
    expect(SCENE_SRC).toMatch(/<fog\s+attach="fog"\s+args=\{\[\s*'#04030b'\s*,\s*40\s*,\s*160\s*\]\}/)
  })

  it('background color stays #04030b (deep space tint)', () => {
    expect(SCENE_SRC).toMatch(/<color\s+attach="background"\s+args=\{\[\s*'#04030b'\s*\]\}/)
  })
})
