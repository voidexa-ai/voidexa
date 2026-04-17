import { describe, expect, it } from 'vitest'
import {
  loadAll,
  loadLandmarks,
  loadEncounters,
  loadNpcs,
  loadQuestChains,
  filterByZone,
  landmarkPositions,
  colorForVisual,
} from '../loaders'
import { ZONE_RADIUS, type UniverseZone } from '../types'

describe('universe content — counts', () => {
  it('has at least 80 landmarks', () => {
    expect(loadLandmarks().length).toBeGreaterThanOrEqual(80)
  })
  it('has at least 45 encounters', () => {
    expect(loadEncounters().length).toBeGreaterThanOrEqual(45)
  })
  it('has at least 20 NPCs', () => {
    expect(loadNpcs().length).toBeGreaterThanOrEqual(20)
  })
  it('has at least 15 quest chains', () => {
    expect(loadQuestChains().length).toBeGreaterThanOrEqual(15)
  })
})

describe('universe content — schema integrity', () => {
  it('every landmark has all required fields', () => {
    for (const lm of loadLandmarks()) {
      expect(lm.id).toBeTruthy()
      expect(lm.name).toBeTruthy()
      expect(lm.zone).toBeTruthy()
      expect(typeof lm.scannable).toBe('boolean')
      expect(lm.visual_type).toBeTruthy()
      expect(lm.lore_text.length).toBeGreaterThan(20)
    }
  })
  it('every encounter has 1+ choice and a 1–5 danger level', () => {
    for (const e of loadEncounters()) {
      expect(e.choices.length).toBeGreaterThanOrEqual(1)
      expect(e.danger_level).toBeGreaterThanOrEqual(1)
      expect(e.danger_level).toBeLessThanOrEqual(5)
      for (const c of e.choices) {
        expect(c.label).toBeTruthy()
        expect(typeof c.reward_ghai).toBe('number')
      }
    }
  })
  it('every NPC has 1+ dialogue line and a greeting', () => {
    for (const n of loadNpcs()) {
      expect(n.greeting.length).toBeGreaterThan(0)
      expect(n.dialogue_lines.length).toBeGreaterThanOrEqual(1)
    }
  })
  it('every quest chain has at least 2 mission steps', () => {
    for (const q of loadQuestChains()) {
      expect(q.missions.length).toBeGreaterThanOrEqual(2)
      let lastStep = 0
      for (const m of q.missions) {
        expect(m.step).toBe(lastStep + 1)
        lastStep = m.step
        expect(m.objective).toBeTruthy()
      }
    }
  })
  it('IDs are unique across each entity collection', () => {
    const lmIds = new Set(loadLandmarks().map((l) => l.id))
    expect(lmIds.size).toBe(loadLandmarks().length)
    const encIds = new Set(loadEncounters().map((e) => e.id))
    expect(encIds.size).toBe(loadEncounters().length)
    const npcIds = new Set(loadNpcs().map((n) => n.id))
    expect(npcIds.size).toBe(loadNpcs().length)
    const qIds = new Set(loadQuestChains().map((q) => q.id))
    expect(qIds.size).toBe(loadQuestChains().length)
  })
})

describe('universe content — filtering', () => {
  it('filterByZone returns full list for "all"', () => {
    expect(filterByZone(loadLandmarks(), 'all').length).toBe(loadLandmarks().length)
  })
  it('filterByZone restricts to a single zone', () => {
    const filtered = filterByZone(loadLandmarks(), 'inner_ring')
    expect(filtered.length).toBeGreaterThan(0)
    for (const lm of filtered) expect(lm.zone).toBe('inner_ring')
  })
  it('all 4 zones yield non-empty landmark slices', () => {
    const zones: UniverseZone[] = ['inner_ring', 'outer_rim', 'contested_space', 'deep_void']
    for (const z of zones) {
      expect(filterByZone(loadLandmarks(), z).length).toBeGreaterThan(0)
    }
  })
})

describe('universe content — positions', () => {
  it('landmarkPositions returns one entry per landmark', () => {
    expect(landmarkPositions().length).toBe(loadLandmarks().length)
  })
  it('each position lies inside its zone radius band', () => {
    const positions = landmarkPositions()
    for (const p of positions) {
      const r = Math.sqrt(p.x * p.x + p.z * p.z + (p.y / 0.4) * (p.y / 0.4))
      const [rMin, rMax] = ZONE_RADIUS[p.zone]
      // tolerance 1u for floating-point at band edges
      expect(r).toBeGreaterThanOrEqual(rMin - 1)
      expect(r).toBeLessThanOrEqual(rMax + 1)
    }
  })
  it('positions are deterministic across calls', () => {
    const a = landmarkPositions()
    const b = landmarkPositions()
    for (let i = 0; i < a.length; i++) {
      expect(a[i].x).toBe(b[i].x)
      expect(a[i].y).toBe(b[i].y)
      expect(a[i].z).toBe(b[i].z)
    }
  })
})

describe('universe content — visuals', () => {
  it('colorForVisual returns a valid hex for every visual type', () => {
    const types = ['station', 'asteroid', 'monument', 'nebula', 'wreck', 'anomaly'] as const
    for (const t of types) {
      const c = colorForVisual(t)
      expect(c).toMatch(/^#[0-9a-f]{6}$/i)
    }
  })
})

describe('loadAll', () => {
  it('returns all four collections in one call', () => {
    const all = loadAll()
    expect(all.landmarks.length).toBeGreaterThanOrEqual(80)
    expect(all.encounters.length).toBeGreaterThanOrEqual(45)
    expect(all.npcs.length).toBeGreaterThanOrEqual(20)
    expect(all.quest_chains.length).toBeGreaterThanOrEqual(15)
  })
})
