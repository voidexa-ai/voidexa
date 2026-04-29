import { describe, it, expect } from 'vitest'
import { STAR_MAP_NODES } from '../components/starmap/nodes'

describe('AFS-10-FIX-7 — starmap nodes match SLUT 21 lock', () => {
  it('does not include about node on starmap (removed per SLUT 21)', () => {
    expect(STAR_MAP_NODES.find(n => n.id === 'about')).toBeUndefined()
  })

  it('does not include ghost-ai node on starmap (Void Pro AI is a /quantum sub-product, not a planet)', () => {
    expect(STAR_MAP_NODES.find(n => n.id === 'ghost-ai')).toBeUndefined()
  })

  it('does not include trading node on starmap (merged into trading-hub per SLUT 21)', () => {
    expect(STAR_MAP_NODES.find(n => n.id === 'trading')).toBeUndefined()
  })

  it('includes exactly 10 nodes per SLUT 21 lock', () => {
    expect(STAR_MAP_NODES.length).toBe(10)
  })

  it('includes all 10 SLUT 21 mapped nodes', () => {
    const expectedIds = [
      'voidexa',
      'station',
      'apps',
      'quantum',
      'trading-hub',
      'services',
      'game-hub',
      'ai-tools',
      'contact',
      'claim-your-planet',
    ]
    const actualIds = STAR_MAP_NODES.map(n => n.id).sort()
    expect(actualIds).toEqual(expectedIds.sort())
  })

  it('voidexa node points at root path / per SLUT 21 (was /home before AFS-10-FIX-7)', () => {
    const voidexa = STAR_MAP_NODES.find(n => n.id === 'voidexa')
    expect(voidexa).toBeDefined()
    expect(voidexa?.path).toBe('/')
  })

  it('services node texture is lilla.png per SLUT 21 (was red_rocky.png before AFS-10-FIX-7)', () => {
    const services = STAR_MAP_NODES.find(n => n.id === 'services')
    expect(services?.texture).toBe('/textures/planets/lilla.png')
  })

  it('game-hub node uses red_rocky.png per SLUT 21', () => {
    const gameHub = STAR_MAP_NODES.find(n => n.id === 'game-hub')
    expect(gameHub).toBeDefined()
    expect(gameHub?.path).toBe('/game-hub')
    expect(gameHub?.texture).toBe('/textures/planets/red_rocky.png')
  })
})
