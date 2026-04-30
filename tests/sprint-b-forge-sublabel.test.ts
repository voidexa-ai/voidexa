import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const NAV_SRC = readFileSync(
  resolve(__dirname, '..', 'components', 'layout', 'Navigation.tsx'),
  'utf8',
)

describe('Sprint B — Topnav Forge sub-label fix', () => {
  it('Navigation.tsx does NOT contain "AI-assisted cockpit generator"', () => {
    expect(NAV_SRC).not.toMatch(/AI-assisted cockpit generator/)
  })

  it('Navigation.tsx contains "Debate-to-build pipeline"', () => {
    expect(NAV_SRC).toMatch(/Debate-to-build pipeline/)
  })

  it('Quantum Forge dropdown entry pairs the new description with the external href', () => {
    // The dropdown stanza should have the new description on the same entry
    // as the forge.voidexa.com href + external: true flag.
    expect(NAV_SRC).toMatch(
      /href:\s*['"]https:\/\/forge\.voidexa\.com['"][\s\S]{0,200}?label:\s*['"]Quantum Forge['"][\s\S]{0,200}?description:\s*['"]Debate-to-build pipeline['"]/,
    )
  })

  it('Sprint A invariants preserved: Quantum Council still at /quantum, Void Pro AI still at /void-pro-ai', () => {
    const dropdown = NAV_SRC.match(/Quantum Tools[\s\S]{0,2000}/)?.[0] ?? ''
    expect(dropdown).toContain('Quantum Council')
    expect(dropdown).toContain('Void Pro AI')
    expect(dropdown).toMatch(/href:\s*['"]\/quantum['"][\s\S]*?label:\s*['"]Quantum Council['"]/)
    expect(dropdown).toMatch(/href:\s*['"]\/void-pro-ai['"][\s\S]*?label:\s*['"]Void Pro AI['"]/)
  })
})
