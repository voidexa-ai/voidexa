import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const PAGE_SRC = readFileSync(
  resolve(__dirname, '..', 'app', 'quantum-tools', 'page.tsx'),
  'utf8',
)

describe('Sprint A — Quantum Tools landing', () => {
  it('exports a default React component', () => {
    expect(PAGE_SRC).toMatch(/export\s+default\s+function/)
  })

  it('renders all 3 sub-product card headings', () => {
    expect(PAGE_SRC).toContain('Quantum Council')
    expect(PAGE_SRC).toContain('Quantum Forge')
    expect(PAGE_SRC).toContain('Void Pro AI')
  })

  it('Council card hrefs to /quantum (NOT /quantum/chat or /quantum-tools)', () => {
    expect(PAGE_SRC).toMatch(/href:\s*['"]\/quantum['"]/)
    expect(PAGE_SRC).not.toMatch(/href:\s*['"]\/quantum\/chat['"]/)
  })

  it('Forge card hrefs to forge.voidexa.com as external (target=_blank, rel=noopener noreferrer)', () => {
    expect(PAGE_SRC).toMatch(/forge\.voidexa\.com/)
    expect(PAGE_SRC).toMatch(/target:\s*['"]_blank['"]/)
    expect(PAGE_SRC).toMatch(/rel:\s*['"]noopener noreferrer['"]/)
  })

  it('Void Pro AI card hrefs to /void-pro-ai', () => {
    expect(PAGE_SRC).toMatch(/href:\s*['"]\/void-pro-ai['"]/)
  })

  it('exports Next.js metadata with title containing "Quantum Tools"', () => {
    expect(PAGE_SRC).toMatch(/export\s+const\s+metadata/)
    expect(PAGE_SRC).toMatch(/title:\s*['"][^'"]*Quantum Tools[^'"]*['"]/)
  })

  it('uses the project glass-card design pattern (mirrors services landing)', () => {
    expect(PAGE_SRC).toMatch(/glass-card/)
    expect(PAGE_SRC).toMatch(/grid-cols-1\s+lg:grid-cols-3/)
  })
})
