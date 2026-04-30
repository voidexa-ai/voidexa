import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { STAR_MAP_NODES } from '../components/starmap/nodes'

const NODES_SRC = readFileSync(
  resolve(__dirname, '..', 'components', 'starmap', 'nodes.ts'),
  'utf8',
)

describe('Sprint A — Starmap quantum node repoint to /quantum-tools', () => {
  it('quantum node still exists with id "quantum"', () => {
    const quantum = STAR_MAP_NODES.find(n => n.id === 'quantum')
    expect(quantum).toBeDefined()
  })

  it('quantum node path is now /quantum-tools (was /quantum)', () => {
    const quantum = STAR_MAP_NODES.find(n => n.id === 'quantum')!
    expect(quantum.path).toBe('/quantum-tools')
  })

  it('source file shows /quantum-tools in the quantum stanza', () => {
    const stanza = NODES_SRC.match(
      /id:\s*['"]quantum['"][\s\S]*?(?=id:\s*['"]|\}\s*[,\]])/,
    )?.[0] ?? ''
    expect(stanza).toMatch(/['"]\/quantum-tools['"]/)
  })

  it('quantum node spatial properties UNCHANGED (no spacing/size regression)', () => {
    const quantum = STAR_MAP_NODES.find(n => n.id === 'quantum')!
    // FIX-9 spacing + FIX-10 size — preserved through Sprint A.
    expect(quantum.position).toEqual([18, -9, -48])
    expect(quantum.size).toBeCloseTo(2.24, 2)
    expect(quantum.label).toBe('Quantum')
  })

  it('all 10 nodes preserved (no cleanup regression)', () => {
    expect(STAR_MAP_NODES.length).toBe(10)
  })
})
