import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

// Source-inspection style, consistent with tests/nav-dropdown.test.ts.
// The Nav is a client component with hooks + i18n context, so rather than
// boot jsdom + providers we assert on the NAV_GROUPS declaration directly.

const NAV_SRC = readFileSync(
  join(process.cwd(), 'components', 'layout', 'Navigation.tsx'),
  'utf8',
)

const quantumToolsBlock = (() => {
  const m = NAV_SRC.match(
    /label:\s*['"]Quantum Tools['"][\s\S]*?children:\s*\[([\s\S]*?)\]\s*,\s*\}/,
  )
  if (!m) throw new Error('Quantum Tools group not found in Navigation.tsx')
  return m[1]
})()

describe('Nav Quantum Tools dropdown — sprint 14b', () => {
  it('Quantum Tools group exists as a top-level NavGroup', () => {
    expect(NAV_SRC).toMatch(/label:\s*['"]Quantum Tools['"]/)
  })

  it('Quantum Tools is positioned between Products and Universe', () => {
    const productsIdx = NAV_SRC.search(/label:\s*t\.nav\.products/)
    const quantumIdx = NAV_SRC.search(/label:\s*['"]Quantum Tools['"]/)
    const universeIdx = NAV_SRC.search(/label:\s*t\.nav\.universe/)
    expect(productsIdx).toBeGreaterThan(-1)
    expect(quantumIdx).toBeGreaterThan(productsIdx)
    expect(universeIdx).toBeGreaterThan(quantumIdx)
  })

  it('Quantum Tools contains exactly 3 child items', () => {
    const hrefs = Array.from(quantumToolsBlock.matchAll(/href:\s*['"]([^'"]+)['"]/g)).map(
      m => m[1],
    )
    expect(hrefs).toHaveLength(3)
  })

  it('Quantum Tools items are in order: Void Pro AI, Quantum Council, Quantum Forge', () => {
    const voidIdx = quantumToolsBlock.indexOf("'Void Pro AI'")
    const quantumIdx = quantumToolsBlock.indexOf("'Quantum Council'")
    const forgeIdx = quantumToolsBlock.indexOf("'Quantum Forge'")
    expect(voidIdx).toBeGreaterThan(-1)
    expect(quantumIdx).toBeGreaterThan(voidIdx)
    expect(forgeIdx).toBeGreaterThan(quantumIdx)
  })

  it('Void Pro AI uses the internal route /void-pro-ai (formerly /void-chat)', () => {
    expect(quantumToolsBlock).toMatch(
      /href:\s*['"]\/void-pro-ai['"][\s\S]*?label:\s*['"]Void Pro AI['"]/,
    )
  })

  it('Quantum Council uses the internal route /quantum/chat', () => {
    expect(quantumToolsBlock).toMatch(
      /href:\s*['"]\/quantum\/chat['"][\s\S]*?label:\s*['"]Quantum Council['"]/,
    )
  })

  it('Quantum Forge uses the external URL https://forge.voidexa.com and is flagged external', () => {
    expect(quantumToolsBlock).toMatch(
      /href:\s*['"]https:\/\/forge\.voidexa\.com['"][\s\S]*?label:\s*['"]Quantum Forge['"][\s\S]*?external:\s*true/,
    )
  })

  it('renders external links with target="_blank" and rel="noopener noreferrer"', () => {
    // Desktop + mobile branches each render a plain <a> for external items.
    expect(NAV_SRC).toMatch(/target=["']_blank["']/)
    expect(NAV_SRC).toMatch(/rel=["']noopener noreferrer["']/)
  })

  it('NavLink interface allows an optional external boolean flag', () => {
    expect(NAV_SRC).toMatch(/external\?:\s*boolean/)
  })

  it('does not add Quantum Tools entries inside Products or Universe groups', () => {
    // Products block
    const products = NAV_SRC.match(
      /label:\s*t\.nav\.products[\s\S]*?children:\s*\[([\s\S]*?)\]\s*,\s*\}/,
    )
    expect(products).not.toBeNull()
    expect(products![1]).not.toMatch(/Quantum Forge/)
    expect(products![1]).not.toMatch(/['"]\/quantum\/chat['"]/)

    // Universe block
    const universe = NAV_SRC.match(
      /label:\s*t\.nav\.universe[\s\S]*?children:\s*\[([\s\S]*?)\]\s*,\s*\}/,
    )
    expect(universe).not.toBeNull()
    expect(universe![1]).not.toMatch(/Quantum Forge/)
    expect(universe![1]).not.toMatch(/['"]\/quantum\/chat['"]/)
    expect(universe![1]).not.toMatch(/['"]\/void-pro-ai['"]/)
  })
})
