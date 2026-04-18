import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const SRC = readFileSync(
  join(process.cwd(), 'components', 'wallet', 'GhaiBalance.tsx'),
  'utf8',
)
const NAV_SRC = readFileSync(
  join(process.cwd(), 'components', 'layout', 'Navigation.tsx'),
  'utf8',
)

describe('GhaiBalance component — sprint 13d', () => {
  it('renders balance via formatGhai (GHAI units, not USD)', () => {
    expect(SRC).toMatch(/formatGhai/)
    expect(SRC).toMatch(/from ['"]@\/lib\/ghai\/format['"]/)
    expect(SRC).toMatch(/formatGhai\(ghai\s*\?\?\s*0\)/)
  })

  it('fetches from the platform GHAI balance endpoint (not USD wallet)', () => {
    expect(SRC).toMatch(/fetch\(['"]\/api\/ghai\/balance['"]\)/)
  })

  it('returns null when the user is not authenticated (compact mode stays invisible logged out)', () => {
    expect(SRC).toMatch(/if \(!user\) return null/)
  })

  it('exposes a data-testid for integration checks', () => {
    expect(SRC).toMatch(/data-testid=['"]ghai-balance['"]/)
  })

  it('admin/tester emails get free-access label instead of a balance', () => {
    expect(SRC).toMatch(/ceo@voidexa\.com/)
    expect(SRC).toMatch(/tom@voidexa\.com/)
    expect(SRC).toMatch(/Free Access/)
  })

  it('top-up modal shows GHAI amounts, not raw USD', () => {
    // +N GHAI must appear (amount pre-conversion) alongside the $USD helper line.
    expect(SRC).toMatch(/usdToGhai\(usd\)/)
    expect(SRC).toMatch(/GHAI/)
  })

  it('is mounted in the desktop nav right cluster', () => {
    expect(NAV_SRC).toMatch(/import GhaiBalance/)
    expect(NAV_SRC).toMatch(/<GhaiBalance\s*\/>/)
  })
})
