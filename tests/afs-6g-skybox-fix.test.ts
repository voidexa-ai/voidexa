import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const battleCanvasSrc = readFileSync(resolve('components/game/battle/BattleCanvas.tsx'), 'utf-8')
const battleSceneSrc = readFileSync(resolve('components/game/battle/BattleScene.tsx'), 'utf-8')
const freeFlightCanvasSrc = readFileSync(resolve('components/freeflight/FreeFlightCanvas.tsx'), 'utf-8')
const freeFlightSceneSrc = readFileSync(resolve('components/freeflight/FreeFlightScene.tsx'), 'utf-8')
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

  // fix-5 root-cause assertion: scene fog (THREE.Material.fog defaults to true)
  // was multiplying skybox sphere fragments by fogFactor=0 because sphere
  // distance ~1484 >> fog.far=160 in BattleScene. Result: 100% fog color
  // overwrote nebula texture, masking all earlier fixes (alpha buffer,
  // vignette, brightness, ref-based color setter). fog={false} on the
  // skybox material exempts it from scene fog without affecting other meshes.
  it('material disables fog so distant skybox is not fog-overwritten', () => {
    expect(skyboxSrc).toMatch(/fog=\{false\}/)
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

describe('afs-6g-skybox-fix-3 — brightness prop boosts dim nebula past Bloom threshold', () => {
  // Pixel sampling after fix-2 showed skybox renders but at sum=8-12 (below
  // scene.background fallback rgb(4,3,11) sum=18). hazy_nebulae_1 midtones
  // are too dim natively; with toneMapped={false} we can multiply material
  // color > 1 and let WebGL clamp at framebuffer write — boosts visible
  // brightness without breaking other scenes.
  it('SpaceSkybox declares optional brightness prop in its interface', () => {
    expect(skyboxSrc).toMatch(/brightness\?:\s*number/)
  })

  it('SpaceSkybox brightness defaults to 1 (no change for existing callers)', () => {
    expect(skyboxSrc).toMatch(/brightness\s*=\s*1\s*[,)]/)
  })

  it('SpaceSkybox uses imperative ref-based color setter (fix-4: bypass R3F prop reconciliation)', () => {
    // Direct mutation of material.color via setRGB so values > 1 reach the
    // shader. Earlier fix-3 used `color={Color}` prop which appeared to
    // no-op on production for values > 1.
    expect(skyboxSrc).toMatch(/matRef\s*=\s*useRef<MeshBasicMaterial>/)
    expect(skyboxSrc).toMatch(/matRef\.current\.color\.setRGB\(brightness,\s*brightness,\s*brightness\)/)
    expect(skyboxSrc).toMatch(/<meshBasicMaterial[\s\S]*?ref=\{matRef\}/)
  })

  it('SpaceSkybox no longer uses the prop-based color={colorMul} pattern', () => {
    expect(skyboxSrc).not.toMatch(/color=\{colorMul\}/)
  })

  it('Battle scene passes brightness > 1 to compensate for dim nebula texture', () => {
    const brightnessMatch = battleSceneSrc.match(/<SpaceSkybox[\s\S]*?brightness=\{([\d.]+)\}/)
    expect(brightnessMatch).toBeTruthy()
    expect(parseFloat(brightnessMatch![1])).toBeGreaterThan(1)
  })

  it('Free Flight does NOT pass brightness (uses default 1.0, scene already reads correctly)', () => {
    const freeFlightSkyboxBlock = freeFlightSceneSrc.match(/<SpaceSkybox[\s\S]*?\/>/)
    expect(freeFlightSkyboxBlock).toBeTruthy()
    expect(freeFlightSkyboxBlock![0]).not.toMatch(/brightness/)
  })
})
