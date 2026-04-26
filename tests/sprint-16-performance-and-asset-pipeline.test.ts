import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { BOOST_TRAIL_TUNING } from '@/components/freeflight/ships/BoostTrail'
import { CONTROLS_LEGEND_CATEGORIES, CONTROLS_LEGEND_LINES } from '@/components/freeflight/ControlsLegend'
import { RARITY_LABEL, RARITY_STYLE, SHIP_CATALOG, getShipRarity, type Rarity } from '@/components/freeflight/ships/catalog'
import { MODEL_URLS } from '@/lib/config/modelUrls'
import { SHIP_TIERS, STARTER_SHIPS } from '@/lib/data/shipTiers'

const QUICK_MENU_SRC = readFileSync(
  join(process.cwd(), 'components', 'home', 'QuickMenuOverlay.tsx'),
  'utf8',
)
const CONTROLS_LEGEND_SRC = readFileSync(
  join(process.cwd(), 'components', 'freeflight', 'ControlsLegend.tsx'),
  'utf8',
)
const STARMAP_SRC = readFileSync(
  join(process.cwd(), 'components', 'starmap', 'StarMapPage.tsx'),
  'utf8',
)
const JARVIS_SRC = readFileSync(
  join(process.cwd(), 'components', 'ui', 'JarvisAssistant.tsx'),
  'utf8',
)
const LEVEL2_SRC = readFileSync(
  join(process.cwd(), 'app', 'starmap', 'voidexa', 'page.tsx'),
  'utf8',
)
const LOADER_SRC = readFileSync(
  join(process.cwd(), 'components', 'freeflight', 'ships', 'ShipLoader.tsx'),
  'utf8',
)
const SHIP_PICKER_SRC = readFileSync(
  join(process.cwd(), 'components', 'freeflight', 'ships', 'ShipPicker.tsx'),
  'utf8',
)

describe('Sprint 16 Task 1 — BoostTrail tuning + GPU thrash mitigations', () => {
  it('particle count dropped 150 → 80', () => {
    expect(BOOST_TRAIL_TUNING.PARTICLE_COUNT).toBe(80)
  })

  it('boost emission rate capped at 250/sec (was 600)', () => {
    expect(BOOST_TRAIL_TUNING.MAX_BOOST_EMIT).toBeLessThanOrEqual(250)
  })

  it('idle emission rate capped at 120/sec + speed bonus ≤ 80', () => {
    expect(BOOST_TRAIL_TUNING.MAX_IDLE_EMIT).toBe(120)
    expect(BOOST_TRAIL_TUNING.IDLE_SPEED_BONUS).toBe(80)
  })

  it('BoostTrail source gates needsUpdate behind dirty flags (no unconditional updates)', () => {
    const src = readFileSync(join(process.cwd(), 'components', 'freeflight', 'ships', 'BoostTrail.tsx'), 'utf8')
    expect(src).toMatch(/let posDirty/)
    expect(src).toMatch(/let colDirty/)
    expect(src).toMatch(/if \(posDirty\)/)
    expect(src).toMatch(/if \(colDirty\)/)
  })

  it('BoostTrail skips already-dead particles in the update loop', () => {
    const src = readFileSync(join(process.cwd(), 'components', 'freeflight', 'ships', 'BoostTrail.tsx'), 'utf8')
    expect(src).toMatch(/if \(dead\[i\]\) continue/)
  })
})

describe('Sprint 16 Task 2 — asset pipeline extends the catalog', () => {
  it('MODEL_URLS covers every family representative we uploaded', () => {
    const expected = [
      'qs_bob', 'qs_challenger', 'qs_striker', 'qs_imperial', 'qs_executioner',
      'qs_omen', 'qs_spitfire', 'qs_dispatcher', 'qs_insurgent', 'qs_zenith', 'qs_pancake',
      'usc_astroeagle01', 'usc_cosmicshark01', 'usc_voidwhale01',
      'usc_hyperfalcon01', 'usc_lightfox01', 'usc_starsparrow01', 'usc_striderox01',
      'usc_nightaye01', 'usc_meteormantis01', 'usc_craizanstar01', 'usc_forcebadger01',
      'usc_protonlegacy01', 'usc_galacticleopard1', 'usc_galaxyraptor01',
      'usc_spacesphinx01', 'usc_spaceexcalibur01', 'usc_genericspaceship01',
      'uscx_galacticokamoto1', 'uscx_starforce01', 'uscx_nova', 'uscx_scorpionship',
      'uscx_spidership', 'uscx_pullora', 'uscx_arrowship', 'uscx_starship',
      'hirez_mainbody01', 'hirez_mainbody02', 'hirez_mainbody05',
    ] as const
    for (const k of expected) {
      expect(MODEL_URLS).toHaveProperty(k)
      expect((MODEL_URLS as Record<string, string>)[k]).toMatch(/^https:\/\/ihuljnekxkyqgroklurp\.supabase\.co\/storage\/v1\/object\/public\/models\//)
    }
  })

  it('catalog grew past the 9-ship Sprint 15 baseline', () => {
    expect(SHIP_CATALOG.length).toBeGreaterThanOrEqual(35)
  })

  it('every catalog entry has a rarity + shipClass', () => {
    for (const s of SHIP_CATALOG) {
      expect(s.rarity).toBeTruthy()
      expect(s.shipClass).toBeTruthy()
    }
  })
})

describe('Sprint 16 Task 3 — rarity badges', () => {
  it('only Bob carries STARTER rarity', () => {
    const starters = SHIP_CATALOG.filter(s => s.rarity === 'starter').map(s => s.id)
    expect(starters).toEqual(['qs_bob'])
  })

  it('QS basic fighters are COMMON (not STARTER)', () => {
    for (const id of ['qs_challenger', 'qs_striker', 'qs_imperial', 'qs_executioner', 'qs_omen', 'qs_spitfire']) {
      expect(getShipRarity(id)).toBe('common')
    }
  })

  it('AstroEagle / CosmicShark / VoidWhale are RARE', () => {
    expect(getShipRarity('usc_astroeagle')).toBe('rare')
    expect(getShipRarity('usc_cosmicshark')).toBe('rare')
    expect(getShipRarity('usc_voidwhale')).toBe('rare')
  })

  it('Hi-Rez hulls are EPIC', () => {
    for (const id of ['hirez_mainbody01', 'hirez_mainbody02', 'hirez_mainbody05']) {
      expect(getShipRarity(id)).toBe('epic')
    }
  })

  it('USCX expansion ships are LEGENDARY', () => {
    for (const id of ['uscx_galacticokamoto', 'uscx_starforce', 'uscx_nova']) {
      expect(getShipRarity(id)).toBe('legendary')
    }
  })

  it('USC standard families are UNCOMMON', () => {
    for (const id of ['usc_hyperfalcon', 'usc_lightfox', 'usc_starsparrow', 'usc_striderox']) {
      expect(getShipRarity(id)).toBe('uncommon')
    }
  })

  it('every rarity tier has a label + style entry', () => {
    const tiers: readonly Rarity[] = ['starter', 'common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic']
    for (const t of tiers) {
      expect(RARITY_LABEL[t]).toBeTruthy()
      expect(RARITY_STYLE[t]).toBeTruthy()
    }
  })

  it('ShipPicker reads from the rarity field (not legacy TIER_LABEL)', () => {
    expect(SHIP_PICKER_SRC).toMatch(/RARITY_STYLE\[rarity\]/)
    expect(SHIP_PICKER_SRC).toMatch(/RARITY_LABEL\[rarity\]/)
    expect(SHIP_PICKER_SRC).toMatch(/data-testid=\{`rarity-badge-\$\{rarity\}`\}/)
  })

  it('badge label size ≥ 14px (voidexa UI standard)', () => {
    // The new span's fontSize was bumped from 11 → 14.
    expect(SHIP_PICKER_SRC).toMatch(/fontSize: 14,\s*letterSpacing: '0\.14em'/)
  })
})

describe('Sprint 16 Task 4 — Quick menu readability polish', () => {
  it('panel background opacity raised to 0.72 with 12px blur', () => {
    expect(QUICK_MENU_SRC).toMatch(/background: 'rgba\(8, 12, 28, 0\.72\)'/)
    expect(QUICK_MENU_SRC).toMatch(/backdropFilter: 'blur\(12px\)'/)
  })

  it('panel border uses cyan tech tint', () => {
    expect(QUICK_MENU_SRC).toMatch(/border: '1px solid rgba\(0, 212, 255, 0\.25\)'/)
  })

  it('body text bumped to 16 px (voidexa ≥16 px body rule)', () => {
    expect(QUICK_MENU_SRC).toMatch(/fontSize: 16, color: '#e0e8f0'/)
  })
})

describe('Sprint 16 Task 5 — Controls legend categories', () => {
  it('categories drive the layout (thrust, camera, systems, navigation, menu)', () => {
    const ids = CONTROLS_LEGEND_CATEGORIES.map(c => c.id)
    expect(ids).toContain('thrust')
    expect(ids).toContain('camera')
    expect(ids).toContain('systems')
    expect(ids).toContain('navigation')
    expect(ids).toContain('menu')
  })

  it('each category has at least one binding', () => {
    for (const c of CONTROLS_LEGEND_CATEGORIES) {
      expect(c.bindings.length).toBeGreaterThan(0)
    }
  })

  it('CONTROLS_LEGEND_LINES flatten preserves Sprint 15 substrings', () => {
    const joined = CONTROLS_LEGEND_LINES.join(' | ')
    expect(joined).toMatch(/WASD/)
    expect(joined).toMatch(/Q \/ E/)
    expect(joined).toMatch(/R \/ F/)
    expect(joined).toMatch(/M \/ Tab/)
  })

  it('component source uses a KeyChip primitive (chip-per-key rendering)', () => {
    expect(CONTROLS_LEGEND_SRC).toMatch(/function KeyChip\(/)
    expect(CONTROLS_LEGEND_SRC).toMatch(/background: 'rgba\(0, 212, 255, 0\.12\)'/)
  })

  it('category header uses cyan tint with 0.14em letter-spacing', () => {
    expect(CONTROLS_LEGEND_SRC).toMatch(/letterSpacing: '0\.14em'[\s\S]*textTransform: 'uppercase'/)
  })
})

describe('Sprint 16 Task 6 — Starmap HUD declutter', () => {
  it('KCP-90 panel collapses to an icon below 1280px viewport', () => {
    expect(STARMAP_SRC).toMatch(/max-width: 1279px/)
    expect(STARMAP_SRC).toMatch(/data-testid="kcp-collapsed-icon"/)
  })

  it('Jarvis avoids the KCP-90 terminal on /starmap (route-skip after CommBubble Hotfix Apr 26 2026)', () => {
    // Sprint 16 Task 6 originally moved Jarvis to bottom-LEFT to avoid the
    // KCP-90 terminal at bottom-right on /starmap. CommBubble Hotfix
    // (docs/skills/bugfix-commbubble-position.md) moved Jarvis back to
    // bottom-right to clear the UniverseChat overlap on 9 other routes,
    // and instead returns null on /starmap (+/dk/starmap) to keep the
    // KCP-90 terminal unblocked. Both protections are now active.
    expect(JARVIS_SRC).toMatch(/fixed bottom-6 right-6 z-\[60\]/)
    expect(JARVIS_SRC).toContain('/^\\/(?:dk\\/)?starmap(?:\\/|$)/')
    expect(JARVIS_SRC).toMatch(/z-\[60\]/)
  })

  it('Level 2 company footer is a thin full-width strip at z:10', () => {
    expect(LEVEL2_SRC).toMatch(/height: 28/)
    expect(LEVEL2_SRC).toMatch(/zIndex: 10/)
    expect(LEVEL2_SRC).toMatch(/left: 0,\s*right: 0,\s*bottom: 0/)
  })
})

describe('Sprint 16 Task 7 — Ship fallback to Bob', () => {
  it('ShipLoader falls back to qs_bob after MAX_ATTEMPTS before giving up', () => {
    expect(LOADER_SRC).toMatch(/BOB_FALLBACK_URL/)
    expect(LOADER_SRC).toMatch(/usingBobFallback/)
    expect(LOADER_SRC).toMatch(/falling back to Bob/)
  })

  it('fallback is short-circuited when the failing URL IS Bob (avoid loop)', () => {
    expect(LOADER_SRC).toMatch(/url !== BOB_FALLBACK_URL/)
  })

  it('BOB_FALLBACK_URL resolves via MODEL_URLS.qs_bob', () => {
    expect(LOADER_SRC).toMatch(/BOB_FALLBACK_URL = MODEL_URLS\.qs_bob/)
  })
})

describe('Sprint 16 — STARTER_SHIPS + SHIP_TIERS consistency', () => {
  it('STARTER_SHIPS now includes the full common-free set', () => {
    for (const id of ['qs_bob', 'qs_executioner', 'qs_omen', 'qs_spitfire', 'qs_dispatcher', 'usc_astroeagle']) {
      expect(STARTER_SHIPS).toContain(id)
    }
  })

  it('SHIP_TIERS.uncommon lists the USC standard families we added', () => {
    expect(SHIP_TIERS.uncommon).toContain('usc_hyperfalcon')
    expect(SHIP_TIERS.uncommon).toContain('usc_galaxyraptor')
  })

  it('SHIP_TIERS.legendary lists the USCX expansion drops', () => {
    expect(SHIP_TIERS.legendary).toContain('uscx_nova')
    expect(SHIP_TIERS.legendary).toContain('uscx_scorpionship')
  })
})
