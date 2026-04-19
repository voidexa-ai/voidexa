import { describe, it, expect, beforeEach, vi } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { resolveTopLayer, DEBOUNCE_MS } from '@/lib/ui/escStack'
import { CONTROLS_LEGEND_LINES } from '@/components/freeflight/ControlsLegend'
import { FLIGHT_CONTROLS_CONSTANTS } from '@/components/freeflight/controls/FlightControls'

const FREEFLIGHT_SRC = readFileSync(
  join(process.cwd(), 'components', 'freeflight', 'FreeFlightPage.tsx'),
  'utf8',
)
const CONTROLS_SRC = readFileSync(
  join(process.cwd(), 'components', 'freeflight', 'controls', 'FlightControls.tsx'),
  'utf8',
)
const BOOST_TRAIL_SRC = readFileSync(
  join(process.cwd(), 'components', 'freeflight', 'ships', 'BoostTrail.tsx'),
  'utf8',
)
const HUD_PANEL_SRC = readFileSync(
  join(process.cwd(), 'components', 'freeflight', 'hud', 'HUDCallPanel.tsx'),
  'utf8',
)
const LEVEL2_SRC = readFileSync(
  join(process.cwd(), 'app', 'starmap', 'voidexa', 'page.tsx'),
  'utf8',
)
const HOME_PAGE_SRC = readFileSync(
  join(process.cwd(), 'app', 'page.tsx'),
  'utf8',
)

class MockStorage {
  private store = new Map<string, string>()
  getItem = (k: string) => (this.store.has(k) ? this.store.get(k)! : null)
  setItem = (k: string, v: string) => { this.store.set(k, v) }
  removeItem = (k: string) => { this.store.delete(k) }
  clear = () => { this.store.clear() }
  key = () => null
  get length() { return this.store.size }
}

function installWindow() {
  const local = new MockStorage()
  const session = new MockStorage()
  vi.stubGlobal('window', { localStorage: local, sessionStorage: session })
  return { local, session }
}

describe('Sprint 15 Task 1 — HUDCallPanel shape', () => {
  it('is positioned top-left (no fullscreen overlay)', () => {
    expect(HUD_PANEL_SRC).toMatch(/top:\s*24/)
    expect(HUD_PANEL_SRC).toMatch(/left:\s*24/)
    // The outer wrapper must NOT be a fixed fullscreen overlay — only a fixed
    // pill in the corner. Specifically reject the `position: 'fixed'` + full
    // `inset: 0` combination at the top level.
    expect(HUD_PANEL_SRC).not.toMatch(/position:\s*['"]fixed['"][^}]*inset:\s*0/)
  })

  it('uses lightweight blur (no heavy backdrop-filter beyond 4px)', () => {
    // Only blur(4px) or no blur — anything heavier kills FPS.
    const heavyBlur = /backdrop-filter:\s*blur\((?:[5-9]|1[0-9])px\)/i
    expect(HUD_PANEL_SRC).not.toMatch(heavyBlur)
    expect(HUD_PANEL_SRC).toMatch(/backdropFilter:\s*['"`]blur\(4px\)['"`]/)
  })

  it('declares all five call types', () => {
    for (const type of ['exploration', 'npc', 'hostile', 'mission', 'system']) {
      expect(HUD_PANEL_SRC).toContain(`'${type}'`)
    }
  })

  it('registers with the ESC stack and logs missed calls on dismiss', () => {
    expect(HUD_PANEL_SRC).toMatch(/useEscStack/)
    expect(HUD_PANEL_SRC).toMatch(/useMissedCalls/)
    expect(HUD_PANEL_SRC).toMatch(/priority:\s*['"`]hud-call['"`]/)
  })

  it('caps around 300 lines per Tom\'s rules', () => {
    const lines = HUD_PANEL_SRC.split('\n').length
    expect(lines).toBeLessThanOrEqual(300)
  })
})

describe('Sprint 15 Task 2 — encounter routed through HUD panel, not modal', () => {
  it('FreeFlightPage does not render ExplorationChoiceModal', () => {
    expect(FREEFLIGHT_SRC).not.toMatch(/<ExplorationChoiceModal/)
    expect(FREEFLIGHT_SRC).not.toMatch(/import ExplorationChoiceModal/)
  })

  it('FreeFlightPage renders HUDCallPanel for exploration encounters', () => {
    expect(FREEFLIGHT_SRC).toMatch(/<HUDCallPanel/)
    expect(FREEFLIGHT_SRC).toMatch(/encounterToHudCall\(/)
  })

  it('encounter trigger keeps pointer lock active (non-blocking UX)', () => {
    // Old code exited pointer lock inside handleEncounterTrigger; the new path
    // explicitly does not.
    const handlerMatch = FREEFLIGHT_SRC.match(/const handleEncounterTrigger[\s\S]*?setActiveEncounter\(enc\)\s*}/)
    expect(handlerMatch).not.toBeNull()
    expect(handlerMatch![0]).not.toMatch(/exitPointerLock/)
  })
})

describe('Sprint 15 Task 3 — W no longer opens the warp map; M + Tab do', () => {
  it('no W-key keydown handler in FreeFlightPage (thrust only lives in FlightControls)', () => {
    expect(FREEFLIGHT_SRC).not.toMatch(/e\.code === ['"]KeyW['"]/)
  })

  it('M and Tab both open the warp map', () => {
    expect(FREEFLIGHT_SRC).toMatch(/e\.code === ['"]KeyM['"].*Tab/)
  })
})

describe('Sprint 15 Task 4 — Q/E roll (not translate)', () => {
  it('Q and E feed angularVelocity.z for roll inertia', () => {
    expect(CONTROLS_SRC).toMatch(/k\[['"]KeyQ['"]\][\s\S]*angularVelocity\.current\.z/)
    expect(CONTROLS_SRC).toMatch(/k\[['"]KeyE['"]\][\s\S]*angularVelocity\.current\.z/)
  })

  it('Q/E no longer add or subtract tmpUp (vertical translation is R/F)', () => {
    // The old broken code added tmpUp on KeyE / subtracted on KeyQ.
    expect(CONTROLS_SRC).not.toMatch(/KeyQ['"][^\n]*thrust\.sub\(tmpUp\)/)
    expect(CONTROLS_SRC).not.toMatch(/KeyE['"][^\n]*thrust\.add\(tmpUp\)/)
  })

  it('R = ascend, F = descend', () => {
    expect(CONTROLS_SRC).toMatch(/k\[['"]KeyR['"]\][\s\S]*thrust\.add\(tmpUp\)/)
    expect(CONTROLS_SRC).toMatch(/k\[['"]KeyF['"]\][\s\S]*thrust\.sub\(tmpUp\)/)
  })

  it('Euler order is YXZ so yaw→pitch→roll composes correctly', () => {
    expect(CONTROLS_SRC).toMatch(/tmpEuler\.set\(pitch\.current,\s*yaw\.current,\s*roll\.current,\s*['"]YXZ['"]\)/)
  })
})

describe('Sprint 15 Task 5 — rotation inertia', () => {
  it('FlightControls keeps an angularVelocity Vector3 ref', () => {
    expect(CONTROLS_SRC).toMatch(/angularVelocity\s*=\s*useRef\(new THREE\.Vector3/)
  })

  it('mouse events push angular velocity — do not snap pitch/yaw directly', () => {
    expect(CONTROLS_SRC).toMatch(/angularVelocity\.current\.y\s*-=\s*e\.movementX/)
    expect(CONTROLS_SRC).toMatch(/angularVelocity\.current\.x\s*-=\s*e\.movementY/)
    // Old code mutated pitch/yaw refs directly from mouse movement — gone.
    expect(CONTROLS_SRC).not.toMatch(/pitch\.current\s*-=\s*e\.movementY/)
    expect(CONTROLS_SRC).not.toMatch(/yaw\.current\s*-=\s*e\.movementX/)
  })

  it('tuning constants match the skill spec', () => {
    expect(FLIGHT_CONTROLS_CONSTANTS.ANGULAR_DAMPING).toBeCloseTo(0.92, 3)
    expect(FLIGHT_CONTROLS_CONSTANTS.MAX_ANGULAR_VELOCITY).toBe(3)
    expect(FLIGHT_CONTROLS_CONSTANTS.MOUSE_SENSITIVITY).toBeCloseTo(0.003, 4)
  })
})

describe('Sprint 15 Task 6 — controls legend covers every new binding', () => {
  it('includes Q/E roll', () => {
    expect(CONTROLS_LEGEND_LINES.some(l => /Q \/ E/i.test(l) && /Roll/i.test(l))).toBe(true)
  })

  it('includes R/F ascend/descend', () => {
    expect(CONTROLS_LEGEND_LINES.some(l => /R \/ F/i.test(l))).toBe(true)
  })

  it('includes M / Tab for warp map', () => {
    expect(CONTROLS_LEGEND_LINES.some(l => /M \/ Tab/i.test(l) && /Warp/i.test(l))).toBe(true)
  })

  it('still lists WASD, Shift boost, Space brake, ESC menu', () => {
    const joined = CONTROLS_LEGEND_LINES.join(' | ')
    expect(joined).toMatch(/WASD/i)
    expect(joined).toMatch(/Shift/i)
    expect(joined).toMatch(/Space/i)
    expect(joined).toMatch(/ESC/i)
  })
})

describe('Sprint 15 Task 8 — Level 2 Enter Free Flight CTA', () => {
  it('Level 2 page includes a bottom-center CTA that routes to /freeflight', () => {
    expect(LEVEL2_SRC).toMatch(/data-testid=["']cta-level2-free-flight["']/)
    expect(LEVEL2_SRC).toMatch(/router\.push\(['"`]\/freeflight['"`]\)/)
    expect(LEVEL2_SRC).toMatch(/Enter Free Flight/i)
  })

  it('shows a requisitioning transition before routing', () => {
    expect(LEVEL2_SRC).toMatch(/Requisitioning your ship/i)
  })
})

describe('Sprint 15 Task 9 — ESC stack priority resolver', () => {
  it('pops the highest-priority layer first (hud-call > map > menu)', () => {
    const top = resolveTopLayer([
      { id: 'menu', priority: 'menu', onEscape: () => {} },
      { id: 'map', priority: 'map', onEscape: () => {} },
      { id: 'hud', priority: 'hud-call', onEscape: () => {} },
    ])
    expect(top?.id).toBe('hud')
  })

  it('returns null for an empty stack', () => {
    expect(resolveTopLayer([])).toBeNull()
  })

  it('exports a 150ms debounce window', () => {
    expect(DEBOUNCE_MS).toBe(150)
  })
})

describe('Sprint 15 Task 10 — BoostTrail uses a ShaderMaterial, not PointsMaterial', () => {
  it('no longer imports or renders pointsMaterial (uniform size only — ignored per-particle attribute)', () => {
    // Match the JSX element specifically, ignoring backtick references in the
    // doc comment that explains *why* we stopped using it.
    expect(BOOST_TRAIL_SRC).not.toMatch(/<pointsMaterial[\s\n]/)
    expect(BOOST_TRAIL_SRC).not.toMatch(/<pointsMaterial\s*\/>/)
  })

  it('uses a ShaderMaterial with custom per-particle size/color attributes', () => {
    expect(BOOST_TRAIL_SRC).toMatch(/ShaderMaterial/)
    expect(BOOST_TRAIL_SRC).toMatch(/attribute float aSize/)
    expect(BOOST_TRAIL_SRC).toMatch(/attribute vec3 aColor/)
  })

  it('fragment shader gives particles a soft circular falloff', () => {
    expect(BOOST_TRAIL_SRC).toMatch(/discard/)
    expect(BOOST_TRAIL_SRC).toMatch(/smoothstep\(0\.5/)
  })
})

describe('Sprint 15 Task 11 — audio gate + session-based video skip', () => {
  beforeEach(() => {
    vi.unstubAllGlobals()
  })

  it('AudioGatePopup component is rendered from stage==="audio-gate"', () => {
    expect(HOME_PAGE_SRC).toMatch(/<AudioGatePopup/)
    expect(HOME_PAGE_SRC).toMatch(/stage === ['"]audio-gate['"]/)
  })

  it('exposes setAudioPreference / getAudioPreference helpers', async () => {
    installWindow()
    const mod = await import('@/lib/intro/preferences')
    mod.setAudioPreference('enabled')
    expect(mod.getAudioPreference()).toBe('enabled')
    mod.setAudioPreference('muted')
    expect(mod.getAudioPreference()).toBe('muted')
    mod.setAudioPreference(null)
    expect(mod.getAudioPreference()).toBeNull()
  })

  it('session seen flag lives in sessionStorage and survives repeat reads within a session', async () => {
    installWindow()
    const mod = await import('@/lib/intro/preferences')
    expect(mod.hasSeenIntroThisSession()).toBe(false)
    mod.markIntroSeenThisSession()
    expect(mod.hasSeenIntroThisSession()).toBe(true)
  })

  it('independent skip flags write to separate localStorage keys', async () => {
    const { local } = installWindow()
    const mod = await import('@/lib/intro/preferences')
    mod.setSkipIntroVideo(true)
    mod.setSkipQuickMenu(true)
    expect(local.getItem('voidexaSkipIntroVideo')).toBe('true')
    expect(local.getItem('voidexaSkipQuickMenu')).toBe('true')
  })

  it('computeIntroMode truth table matches the skill spec', async () => {
    installWindow()
    const { computeIntroMode } = await import('@/lib/intro/preferences')
    // skipVideo=false skipQuickMenu=false sessionSeen=false → video
    expect(computeIntroMode({ menuOnly: false, skipVideo: false, skipQuickMenu: false, sessionSeen: false })).toBe('video')
    // skipVideo=false skipQuickMenu=false sessionSeen=true → quick-menu
    expect(computeIntroMode({ menuOnly: false, skipVideo: false, skipQuickMenu: false, sessionSeen: true })).toBe('quick-menu')
    // skipVideo=false skipQuickMenu=true sessionSeen=false → video (play once, then always skip menu)
    expect(computeIntroMode({ menuOnly: false, skipVideo: false, skipQuickMenu: true, sessionSeen: false })).toBe('video')
    // skipVideo=false skipQuickMenu=true sessionSeen=true → redirect (video already seen this session, menu skipped)
    expect(computeIntroMode({ menuOnly: false, skipVideo: false, skipQuickMenu: true, sessionSeen: true })).toBe('redirect')
    // skipVideo=true skipQuickMenu=false → quick-menu (never video)
    expect(computeIntroMode({ menuOnly: false, skipVideo: true, skipQuickMenu: false, sessionSeen: false })).toBe('quick-menu')
    // skipVideo=true skipQuickMenu=true → redirect
    expect(computeIntroMode({ menuOnly: false, skipVideo: true, skipQuickMenu: true, sessionSeen: false })).toBe('redirect')
    // menu=true always wins
    expect(computeIntroMode({ menuOnly: true, skipVideo: true, skipQuickMenu: true, sessionSeen: true })).toBe('menu-only')
  })

  it('resetOnboardingPreferences clears video+menu+audio flags', async () => {
    const { local, session } = installWindow()
    const mod = await import('@/lib/intro/preferences')
    mod.setSkipIntroVideo(true)
    mod.setSkipQuickMenu(true)
    mod.setAudioPreference('enabled')
    mod.markIntroSeenThisSession()
    mod.resetOnboardingPreferences()
    expect(local.getItem('voidexaSkipIntroVideo')).toBeNull()
    expect(local.getItem('voidexaSkipQuickMenu')).toBeNull()
    expect(local.getItem('voidexaAudioPreference')).toBeNull()
    expect(session.getItem('hasSeenIntroThisSession')).toBeNull()
  })

  it('QuickMenuOverlay renders two independent checkboxes + replay link', async () => {
    const src = readFileSync(join(process.cwd(), 'components', 'home', 'QuickMenuOverlay.tsx'), 'utf8')
    expect(src).toMatch(/data-testid=["']skip-video-checkbox["']/)
    expect(src).toMatch(/data-testid=["']skip-menu-checkbox["']/)
    expect(src).toMatch(/data-testid=["']replay-intro-link["']/)
  })
})

describe('Sprint 15 Task 7 — CTA routing unified at Level 1', () => {
  it('SECONDARY_CTA points at /starmap (Level 1 galaxy view)', async () => {
    const { SECONDARY_CTA } = await import('@/lib/intro/panels')
    expect(SECONDARY_CTA.href).toBe('/starmap')
  })
})
