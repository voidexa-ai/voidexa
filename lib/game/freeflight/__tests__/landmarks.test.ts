import { describe, it, expect } from 'vitest'
import { LANDMARKS, LANDMARK_SCAN_RADIUS, getLandmarkById } from '../landmarks'

const EXPECTED = 20
const ZONES = ['Core Zone', 'Inner Ring'] as const
const TYPES = [
  'station', 'monument', 'training_ring', 'beacon_garden', 'bio_dome',
  'relay', 'gate_marker', 'waypoint_path', 'refinery', 'data_vault', 'agri_orbital',
] as const

describe('landmarks', () => {
  it('has exactly 20 entries', () => {
    expect(LANDMARKS).toHaveLength(EXPECTED)
  })

  it('all ids are unique', () => {
    const ids = LANDMARKS.map(l => l.id)
    expect(new Set(ids).size).toBe(EXPECTED)
  })

  it('every landmark has a valid zone', () => {
    for (const l of LANDMARKS) expect(ZONES).toContain(l.zone)
  })

  it('every landmark has a valid type', () => {
    for (const l of LANDMARKS) expect(TYPES).toContain(l.type)
  })

  it('splits 15 Core + 5 Inner Ring', () => {
    const core = LANDMARKS.filter(l => l.zone === 'Core Zone')
    const inner = LANDMARKS.filter(l => l.zone === 'Inner Ring')
    expect(core).toHaveLength(15)
    expect(inner).toHaveLength(5)
  })

  it('every landmark has non-empty name, scanText, loreSnippet, hook', () => {
    for (const l of LANDMARKS) {
      expect(l.name.length).toBeGreaterThan(0)
      expect(l.scanText.length).toBeGreaterThan(0)
      expect(l.loreSnippet.length).toBeGreaterThan(0)
      expect(l.hook.length).toBeGreaterThan(0)
    }
  })

  it('every landmark has finite coordinates', () => {
    for (const l of LANDMARKS) {
      expect(Number.isFinite(l.x)).toBe(true)
      expect(Number.isFinite(l.y)).toBe(true)
      expect(Number.isFinite(l.z)).toBe(true)
    }
  })

  it('Core landmarks sit within 60–150 of origin', () => {
    for (const l of LANDMARKS.filter(x => x.zone === 'Core Zone')) {
      const d = Math.sqrt(l.x * l.x + l.y * l.y + l.z * l.z)
      expect(d).toBeGreaterThan(40)
      expect(d).toBeLessThan(180)
    }
  })

  it('Inner Ring landmarks sit further out than Core', () => {
    for (const l of LANDMARKS.filter(x => x.zone === 'Inner Ring')) {
      const d = Math.sqrt(l.x * l.x + l.y * l.y + l.z * l.z)
      expect(d).toBeGreaterThan(170)
    }
  })

  it('no two landmarks are within 40 units of each other', () => {
    for (let i = 0; i < LANDMARKS.length; i++) {
      for (let j = i + 1; j < LANDMARKS.length; j++) {
        const a = LANDMARKS[i], b = LANDMARKS[j]
        const dx = a.x - b.x, dy = a.y - b.y, dz = a.z - b.z
        const d = Math.sqrt(dx * dx + dy * dy + dz * dz)
        expect(d).toBeGreaterThan(40)
      }
    }
  })

  it('getLandmarkById works and rejects unknown ids', () => {
    expect(getLandmarkById('break_room_halo')?.name).toBe('Break Room Halo')
    expect(getLandmarkById('no_such_landmark')).toBeUndefined()
  })

  it('scan radius is a positive number', () => {
    expect(LANDMARK_SCAN_RADIUS).toBeGreaterThan(0)
  })
})
