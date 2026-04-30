import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const QUANTUM_SRC = readFileSync(
  resolve(__dirname, '..', 'app', 'quantum', 'page.tsx'),
  'utf8',
)

describe('Sprint B — Hero top-fold fix (h1 visible above the fold)', () => {
  it('Quantum heading is rendered as a top-level <motion.h1> element', () => {
    // The h1 carries the title now — was previously buried as a positioned
    // <span> inside the 500px hero image at bottom: 28.
    expect(QUANTUM_SRC).toMatch(/<motion\.h1[\s\S]*?>\s*Quantum\s*<\/motion\.h1>/)
  })

  it('hero image height reduced to 320 (was 500)', () => {
    // The hero image div had height: 500 in FIX-15 baseline.
    expect(QUANTUM_SRC).toMatch(/height:\s*320,\s*borderRadius:\s*16/)
    expect(QUANTUM_SRC).not.toMatch(/height:\s*500,\s*borderRadius:\s*16/)
  })

  it('the bottom-of-image positioned "Quantum" span is removed', () => {
    // Pattern: position: absolute, bottom: 28, ... { Quantum } — should be gone.
    // Match a position:absolute + bottom:28 block followed somewhere by a
    // Quantum text node within reasonable proximity. Should not match.
    expect(QUANTUM_SRC).not.toMatch(/bottom:\s*28[\s\S]{0,400}>Quantum</)
  })

  it('eyebrow "Quantum by voidexa" still rendered before the h1', () => {
    const eyebrowIdx = QUANTUM_SRC.indexOf('Quantum by voidexa')
    const h1Idx = QUANTUM_SRC.search(/<motion\.h1[\s\S]*?>\s*Quantum\s*<\/motion\.h1>/)
    expect(eyebrowIdx).toBeGreaterThan(-1)
    expect(h1Idx).toBeGreaterThan(eyebrowIdx)
  })

  it('subtitle "Where AIs debate, disagree, and find truth." preserved (no scope creep)', () => {
    expect(QUANTUM_SRC).toMatch(/Where AIs debate, disagree, and find truth\./)
  })
})
