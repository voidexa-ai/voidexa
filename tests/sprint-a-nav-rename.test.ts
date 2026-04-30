import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const NAV_SRC = readFileSync(
  resolve(__dirname, '..', 'components', 'layout', 'Navigation.tsx'),
  'utf8',
)

// Isolate the "Quantum Tools" dropdown stanza so unrelated parts of the file
// (e.g. a future link to /quantum/chat from a different surface) don't poison
// the assertions.
const DROPDOWN_REGION = NAV_SRC.match(/Quantum Tools[\s\S]{0,2000}/)?.[0] ?? ''

describe('Sprint A — Topnav rename Quantum Chat -> Quantum Council', () => {
  it('dropdown stanza was located', () => {
    expect(DROPDOWN_REGION.length).toBeGreaterThan(0)
  })

  it('contains "Quantum Council" label', () => {
    expect(DROPDOWN_REGION).toContain('Quantum Council')
  })

  it('does NOT contain old "Quantum Chat" label in the dropdown', () => {
    expect(DROPDOWN_REGION).not.toContain('Quantum Chat')
  })

  it('Quantum Council href points to /quantum (NOT /quantum/chat)', () => {
    expect(DROPDOWN_REGION).toMatch(/href:\s*['"]\/quantum['"]/)
    expect(DROPDOWN_REGION).not.toMatch(/href:\s*['"]\/quantum\/chat['"]/)
  })

  it('other Quantum Tools dropdown items preserved (Void Pro AI + Quantum Forge)', () => {
    expect(DROPDOWN_REGION).toContain('Void Pro AI')
    expect(DROPDOWN_REGION).toContain('Quantum Forge')
    expect(DROPDOWN_REGION).toContain('forge.voidexa.com')
  })
})
