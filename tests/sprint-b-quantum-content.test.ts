import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const QUANTUM_SRC = readFileSync(
  resolve(__dirname, '..', 'app', 'quantum', 'page.tsx'),
  'utf8',
)

describe('Sprint B — /quantum content fix (5 -> 4 AI providers)', () => {
  it('does NOT contain "5 AI providers"', () => {
    expect(QUANTUM_SRC).not.toMatch(/5 AI providers/)
  })

  it('contains "4 AI providers"', () => {
    expect(QUANTUM_SRC).toMatch(/4 AI providers/)
  })

  it('does NOT contain "Emerging from 5 providers"', () => {
    expect(QUANTUM_SRC).not.toMatch(/Emerging from 5 providers/)
  })

  it('contains "Emerging from 4 providers"', () => {
    expect(QUANTUM_SRC).toMatch(/Emerging from 4 providers/)
  })
})
