import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

// AFS-18b - Walker tests for the mythic iridescent frame branch in
// AlphaCardFrame.tsx + the matching globals.css block (.mythic-frame
// class, @property --mythic-angle, @keyframes mythic-rotate, RPM
// fallback, locked palette).

const FRAME_SRC = readFileSync(
  join(process.cwd(), 'components', 'cards', 'AlphaCardFrame.tsx'),
  'utf8',
)
const GLOBALS_SRC = readFileSync(
  join(process.cwd(), 'app', 'globals.css'),
  'utf8',
)

describe('AFS-18b AlphaCardFrame - mythic branch', () => {
  it("declares isMythic = rarity === 'mythic'", () => {
    expect(FRAME_SRC).toMatch(/const\s+isMythic\s*=\s*rarity\s*===\s*['"]mythic['"]/)
  })

  it('emits data-mythic="true" only when isMythic', () => {
    expect(FRAME_SRC).toMatch(/data-mythic=\{isMythic\s*\?\s*['"]true['"]\s*:\s*undefined\}/)
  })

  it("toggles className between 'mythic-frame' and 'border-2'", () => {
    expect(FRAME_SRC).toMatch(/isMythic\s*\?\s*['"]mythic-frame['"]\s*:\s*['"]border-2['"]/)
  })

  it('mythic outer glow uses pink + cyan RGBA (gold intentionally omitted from halo)', () => {
    expect(FRAME_SRC).toMatch(/rgba\(\s*236\s*,\s*72\s*,\s*153/) // pink-500
    expect(FRAME_SRC).toMatch(/rgba\(\s*34\s*,\s*211\s*,\s*238/) // cyan-400
  })
})

describe('AFS-18b globals.css - mythic-frame infrastructure', () => {
  it('registers --mythic-angle via @property (first @property in repo)', () => {
    expect(GLOBALS_SRC).toMatch(/@property\s+--mythic-angle/)
    expect(GLOBALS_SRC).toMatch(/syntax:\s*['"]<angle>['"]/)
  })

  it('defines .mythic-frame using padding-box + border-box gradient trick', () => {
    expect(GLOBALS_SRC).toMatch(/\.mythic-frame\s*\{[\s\S]*?padding-box[\s\S]*?border-box/)
  })

  it('defines @keyframes mythic-rotate ending at 360deg', () => {
    expect(GLOBALS_SRC).toMatch(/@keyframes\s+mythic-rotate\s*\{[\s\S]*?--mythic-angle:\s*360deg/)
  })

  it('respects prefers-reduced-motion: reduce by removing animation', () => {
    expect(GLOBALS_SRC).toMatch(
      /@media\s*\(\s*prefers-reduced-motion:\s*reduce\s*\)\s*\{[\s\S]*?\.mythic-frame[\s\S]*?animation:\s*none/,
    )
  })

  it('embeds the 3 locked palette stops (magenta + cyan + metallic gold)', () => {
    expect(GLOBALS_SRC).toContain('#ec4899')
    expect(GLOBALS_SRC).toContain('#22d3ee')
    expect(GLOBALS_SRC).toContain('#d4af37')
  })

  it('does NOT use Tailwind theme() fn (hardcoded zinc-950 hex for v4 compat)', () => {
    expect(GLOBALS_SRC).toMatch(/\.mythic-frame[\s\S]*?#0a0a0a/)
    expect(GLOBALS_SRC).not.toMatch(/\.mythic-frame[\s\S]*?theme\(/)
  })
})
