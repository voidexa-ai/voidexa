import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const PAGE_SRC = readFileSync(
  join(process.cwd(), 'app', 'quantum', 'page.tsx'),
  'utf8',
)
const LAYOUT_SRC = readFileSync(
  join(process.cwd(), 'app', 'quantum', 'layout.tsx'),
  'utf8',
)
const CHAT_LAYOUT_SRC = readFileSync(
  join(process.cwd(), 'app', 'quantum', 'chat', 'layout.tsx'),
  'utf8',
)
const CARD_SRC = readFileSync(
  join(process.cwd(), 'components', 'quantum', 'QuantumLandingCard.tsx'),
  'utf8',
)
const NAV_SRC = readFileSync(
  join(process.cwd(), 'components', 'layout', 'Navigation.tsx'),
  'utf8',
)

describe('AFS-10 /quantum 3-card landing page', () => {
  it('quantum landing page imports QuantumLandingCard component', () => {
    expect(PAGE_SRC).toMatch(/import\s+QuantumLandingCard\s+from\s+['"]@\/components\/quantum\/QuantumLandingCard['"]/)
  })

  it('does NOT import QuantumDebatePanel — debate engine moved to /quantum/chat', () => {
    expect(PAGE_SRC).not.toMatch(/QuantumDebatePanel/)
  })

  it('page no longer carries the legacy 951-line marketing surface ("framer-motion" / CAST array)', () => {
    expect(PAGE_SRC).not.toMatch(/framer-motion/)
    expect(PAGE_SRC).not.toMatch(/^const CAST\s*=/m)
  })

  it('renders exactly 3 cards mapping to the 3 sub-products', () => {
    const cardBlock = PAGE_SRC.match(/const CARDS\s*=\s*\[([\s\S]*?)\]\s*as const/)
    expect(cardBlock).not.toBeNull()
    const titles = Array.from(cardBlock![1].matchAll(/title:\s*['"]([^'"]+)['"]/g)).map(m => m[1])
    expect(titles).toEqual(['Quantum Council', 'Quantum Forge', 'Void Pro AI'])
  })

  it('cards link to the correct destinations', () => {
    const cardBlock = PAGE_SRC.match(/const CARDS\s*=\s*\[([\s\S]*?)\]\s*as const/)![1]
    const hrefs = Array.from(cardBlock.matchAll(/href:\s*['"]([^'"]+)['"]/g)).map(m => m[1])
    expect(hrefs).toEqual(['/quantum/chat', '/quantum-forge', '/void-pro-ai'])
  })

  it('layout metadata renamed to "Council · Forge · Void Pro AI"', () => {
    expect(LAYOUT_SRC).toMatch(/Council\s*·\s*Forge\s*·\s*Void Pro AI/)
    expect(LAYOUT_SRC).not.toMatch(/Multi-AI Debate Engine/)
  })

  it('/quantum/chat layout title renamed to Quantum Council', () => {
    expect(CHAT_LAYOUT_SRC).toMatch(/Quantum Council/)
    expect(CHAT_LAYOUT_SRC).not.toMatch(/Quantum Chat/)
  })

  it('Navigation dropdown labels Quantum Council, not Quantum Chat', () => {
    expect(NAV_SRC).toMatch(/label:\s*['"]Quantum Council['"]/)
    expect(NAV_SRC).not.toMatch(/label:\s*['"]Quantum Chat['"]/)
  })
})

describe('AFS-10 QuantumLandingCard component', () => {
  it('exports a default component with title/href/tagline/description/cta props', () => {
    expect(CARD_SRC).toMatch(/export default function QuantumLandingCard/)
    expect(CARD_SRC).toMatch(/title/)
    expect(CARD_SRC).toMatch(/href/)
    expect(CARD_SRC).toMatch(/tagline/)
    expect(CARD_SRC).toMatch(/description/)
    expect(CARD_SRC).toMatch(/cta/)
  })

  it('uses Next Link for client-side routing', () => {
    expect(CARD_SRC).toMatch(/from\s+['"]next\/link['"]/)
  })
})
