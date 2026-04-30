import { describe, it, expect } from 'vitest'
import { STAR_MAP_NODES } from '../components/starmap/nodes'

describe('AFS-10-FIX-13 — contact + space station spacing fix', () => {
  it('contact moved to left side at [-6, 11, -28]', () => {
    const contact = STAR_MAP_NODES.find(n => n.id === 'contact')!
    expect(contact.position).toEqual([-6, 11, -28])
  })

  it('station moved to right-deep at [16, 5, -42]', () => {
    const station = STAR_MAP_NODES.find(n => n.id === 'station')!
    expect(station.position).toEqual([16, 5, -42])
  })

  it('contact and station are at least 25 units apart (no clustering)', () => {
    const contact = STAR_MAP_NODES.find(n => n.id === 'contact')!
    const station = STAR_MAP_NODES.find(n => n.id === 'station')!
    const [cx, cy, cz] = contact.position
    const [sx, sy, sz] = station.position
    const dist = Math.sqrt((cx - sx) ** 2 + (cy - sy) ** 2 + (cz - sz) ** 2)
    expect(dist).toBeGreaterThan(25)
  })

  it('contact is on negative-x side (left), separating from game-hub at +9', () => {
    const contact = STAR_MAP_NODES.find(n => n.id === 'contact')!
    expect(contact.position[0]).toBeLessThan(0)
  })

  it('all 10 nodes preserved', () => {
    expect(STAR_MAP_NODES.length).toBe(10)
  })

  it('no size or voidexa-position regression from FIX-12', () => {
    const voidexa = STAR_MAP_NODES.find(n => n.id === 'voidexa')!
    expect(voidexa.size).toBeCloseTo(3.5, 1)
    expect(voidexa.position).toEqual([0, 0, 0])

    const apps = STAR_MAP_NODES.find(n => n.id === 'apps')!
    expect(apps.size).toBeCloseTo(3.5, 1)

    const station = STAR_MAP_NODES.find(n => n.id === 'station')!
    expect(station.size).toBeCloseTo(2.5, 1)
  })

  it('non-affected satellite positions UNCHANGED from FIX-9', () => {
    const apps = STAR_MAP_NODES.find(n => n.id === 'apps')!
    expect(apps.position).toEqual([-12, 4.5, -18])

    const claim = STAR_MAP_NODES.find(n => n.id === 'claim-your-planet')!
    expect(claim.position).toEqual([-18, -6, -60])

    const gameHub = STAR_MAP_NODES.find(n => n.id === 'game-hub')!
    expect(gameHub.position).toEqual([9, 6, -15])

    const services = STAR_MAP_NODES.find(n => n.id === 'services')!
    expect(services.position).toEqual([15, -3, -21])
  })
})
