import { readFileSync } from 'fs'
import { resolve } from 'path'
import { describe, it, expect } from 'vitest'
import { STAR_MAP_NODES } from '../components/starmap/nodes'

const SYSTEM_CANVAS = readFileSync(
  resolve(__dirname, '../components/starmap/StarMapCanvas.tsx'),
  'utf-8',
)
const SYSTEM_SCENE = readFileSync(
  resolve(__dirname, '../components/starmap/StarMapScene.tsx'),
  'utf-8',
)

describe('AFS-10-FIX-12 — corrected camera flip (negative z)', () => {
  it('voidexa size is 5.0 (FIX-16 dominant focal point)', () => {
    const voidexa = STAR_MAP_NODES.find(n => n.id === 'voidexa')!
    expect(voidexa.size).toBeCloseTo(5.0, 1)
  })

  it('apps stays at 3.5 (pink gas giant prominence — no longer ties voidexa post FIX-16)', () => {
    const apps = STAR_MAP_NODES.find(n => n.id === 'apps')!
    expect(apps.size).toBeCloseTo(3.5, 1)
  })

  it('station size 2.5 (position further moved to [16, 5, -42] in FIX-13)', () => {
    const station = STAR_MAP_NODES.find(n => n.id === 'station')!
    expect(station.size).toBeCloseTo(2.5, 1)
    expect(station.position).toEqual([16, 5, -42])
  })

  it('voidexa position UNCHANGED at origin', () => {
    const voidexa = STAR_MAP_NODES.find(n => n.id === 'voidexa')!
    expect(voidexa.position).toEqual([0, 0, 0])
  })

  it('non-station satellite positions UNCHANGED from FIX-9', () => {
    const apps = STAR_MAP_NODES.find(n => n.id === 'apps')!
    expect(apps.position).toEqual([-12, 4.5, -18])

    const claim = STAR_MAP_NODES.find(n => n.id === 'claim-your-planet')!
    expect(claim.position).toEqual([-18, -6, -60])

    const gameHub = STAR_MAP_NODES.find(n => n.id === 'game-hub')!
    expect(gameHub.position).toEqual([9, 6, -15])
  })

  it('all 10 nodes preserved', () => {
    expect(STAR_MAP_NODES.length).toBe(10)
  })

  it('claim-your-planet sits at most-negative z (back of system from old POV, FRONT from new POV)', () => {
    const claim = STAR_MAP_NODES.find(n => n.id === 'claim-your-planet')!
    const otherSatellites = STAR_MAP_NODES.filter(n => n.id !== 'voidexa' && n.id !== 'claim-your-planet')
    for (const node of otherSatellites) {
      expect(claim.position[2]).toBeLessThanOrEqual(node.position[2])
    }
  })

  it('camera flipped to negative-z depth POV [0, 5, -90]', () => {
    expect(SYSTEM_CANVAS).toMatch(/position:\s*\[0,\s*5,\s*-90\]/)
  })

  it('OrbitControls target moved to [0, 0, 0] (voidexa origin)', () => {
    expect(SYSTEM_SCENE).toMatch(/target=\{\[0,\s*0,\s*0\]\}/)
  })

  it('OrbitControls maxDistance bumped to 150 (camera ~90 from target)', () => {
    expect(SYSTEM_SCENE).toMatch(/maxDistance=\{150\}/)
  })

  it('OrbitControls drag-rotate stays enabled (no enableRotate={false})', () => {
    expect(SYSTEM_SCENE).not.toMatch(/enableRotate=\{false\}/)
  })

  it('camera-to-target distance is within maxDistance', () => {
    // Camera [0, 5, -90] to target [0, 0, 0]: sqrt(0 + 25 + 8100) = 90.14
    const camera: [number, number, number] = [0, 5, -90]
    const target: [number, number, number] = [0, 0, 0]
    const dist = Math.sqrt(
      (camera[0] - target[0]) ** 2 +
      (camera[1] - target[1]) ** 2 +
      (camera[2] - target[2]) ** 2,
    )
    expect(dist).toBeCloseTo(90.14, 1)
    expect(dist).toBeLessThan(150)
  })
})
