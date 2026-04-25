import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const battleCanvasSrc = readFileSync(resolve('components/game/battle/BattleCanvas.tsx'), 'utf-8')
const freeFlightCanvasSrc = readFileSync(resolve('components/freeflight/FreeFlightCanvas.tsx'), 'utf-8')
const battleControllerSrc = readFileSync(resolve('components/game/battle/BattleController.tsx'), 'utf-8')
const skyboxSrc = readFileSync(resolve('components/three/SpaceSkybox.tsx'), 'utf-8')

describe('afs-6g-skybox-fix — canvas alpha buffer', () => {
  it('BattleCanvas Canvas gl prop sets alpha: false', () => {
    expect(battleCanvasSrc).toMatch(/gl=\{\{[^}]*alpha:\s*false/)
  })

  it('BattleCanvas keeps antialias: true alongside alpha: false', () => {
    expect(battleCanvasSrc).toMatch(/alpha:\s*false,\s*antialias:\s*true/)
  })

  it('BattleCanvas style prop has no opacity declaration', () => {
    const styleMatch = battleCanvasSrc.match(/<Canvas[\s\S]*?style=\{(\{[^}]*\})\}/)
    expect(styleMatch).toBeTruthy()
    expect(styleMatch![1]).not.toMatch(/opacity/)
  })

  it('FreeFlightCanvas Canvas gl prop sets alpha: false (parity)', () => {
    expect(freeFlightCanvasSrc).toMatch(/gl=\{\{[^}]*alpha:\s*false/)
  })
})

describe('afs-6g-skybox-fix — wrapper opacity regression guard', () => {
  it('BattleController canvasLayer style does not apply opacity', () => {
    const canvasLayerMatch = battleControllerSrc.match(/canvasLayer:\s*\{[^}]*\}/)
    expect(canvasLayerMatch).toBeTruthy()
    expect(canvasLayerMatch![0]).not.toMatch(/opacity/)
  })

  it('BattleController wrap style does not apply opacity', () => {
    const wrapMatch = battleControllerSrc.match(/wrap:\s*\{[^}]*\}/)
    expect(wrapMatch).toBeTruthy()
    expect(wrapMatch![0]).not.toMatch(/opacity/)
  })
})

describe('afs-6g-skybox-fix — SpaceSkybox component intact', () => {
  it('material still uses BackSide (regression guard)', () => {
    expect(skyboxSrc).toMatch(/side=\{BackSide\}/)
  })

  it('texture path unchanged', () => {
    expect(skyboxSrc).toMatch(/\/skybox\/deep_space_01\.png/)
  })

  it('material preserves toneMapped={false} for nebula color fidelity', () => {
    expect(skyboxSrc).toMatch(/toneMapped=\{false\}/)
  })
})

describe('afs-6g-skybox-fix-2 — vignette no longer crushes nebula midtones', () => {
  // Pixel sampling on prod (afs-6g-skybox-fix-2) showed center pixels at
  // (3,3,9) — barely above fallback #04030b — because Vignette darkness=0.78
  // multiplied dim nebula colors below the visible threshold. 0.55 matches
  // FreeFlightCanvas parity and lets nebula midtones come through.
  it('Battle Vignette darkness <= 0.6 so nebula midtones survive', () => {
    const vignetteMatch = battleCanvasSrc.match(/<Vignette[^/>]*darkness=\{([\d.]+)\}/)
    expect(vignetteMatch).toBeTruthy()
    const darkness = parseFloat(vignetteMatch![1])
    expect(darkness).toBeLessThanOrEqual(0.6)
  })

  it('Battle Vignette parity with FreeFlight (both use the same darkness)', () => {
    const battleVignette = battleCanvasSrc.match(/<Vignette[^/>]*darkness=\{([\d.]+)\}/)
    const freeFlightVignette = freeFlightCanvasSrc.match(/<Vignette[^/>]*darkness=\{([\d.]+)\}/)
    expect(battleVignette).toBeTruthy()
    expect(freeFlightVignette).toBeTruthy()
    expect(parseFloat(battleVignette![1])).toBe(parseFloat(freeFlightVignette![1]))
  })
})
