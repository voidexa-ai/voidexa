import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const QUANTUM_SRC = readFileSync(
  resolve(__dirname, '..', 'app', 'quantum', 'page.tsx'),
  'utf8',
)

// Isolate the CAST array stanza so we don't accidentally match unrelated
// "Jix" / "/images/cast/jix.jpg" strings elsewhere on the page (e.g. Captain's
// Log section may legitimately mention Jix's name in narrative copy).
const CAST_BLOCK = QUANTUM_SRC.match(/const CAST\s*=\s*\[[\s\S]*?\n\]/)?.[0] ?? ''

describe('Sprint B — Council circle cleanup', () => {
  it('CAST array block was located', () => {
    expect(CAST_BLOCK.length).toBeGreaterThan(0)
  })

  it('CAST does NOT contain a Jix entry (id: "jix")', () => {
    expect(CAST_BLOCK).not.toMatch(/id:\s*['"]jix['"]/)
    expect(CAST_BLOCK).not.toMatch(/name:\s*['"]Jix['"]/)
    expect(CAST_BLOCK).not.toMatch(/\/images\/cast\/jix\.jpg/)
  })

  it('CAST still contains the 4 AI providers + Llama placeholder', () => {
    expect(CAST_BLOCK).toMatch(/id:\s*['"]claude['"]/)
    expect(CAST_BLOCK).toMatch(/id:\s*['"]gpt['"]/)
    expect(CAST_BLOCK).toMatch(/id:\s*['"]gemini['"]/)
    expect(CAST_BLOCK).toMatch(/id:\s*['"]perplexity['"]/)
    expect(CAST_BLOCK).toMatch(/id:\s*['"]llama['"]/)
  })

  it('Council circle portrait size bumped to 64px (was 46)', () => {
    // Avatar wrapper width/height + img width/height all bumped to 64.
    // Match the avatar wrapper pattern with width: 64, height: 64.
    expect(QUANTUM_SRC).toMatch(/width:\s*64,\s*height:\s*64/)
    // Old 46px avatar dimensions should be gone from the orbit layout.
    expect(QUANTUM_SRC).not.toMatch(/width:\s*46,\s*height:\s*46/)
  })

  it('Council circle container bumped to 200x200 (was 168)', () => {
    expect(QUANTUM_SRC).toMatch(/style=\{\{\s*width:\s*200,\s*height:\s*200\s*\}\}/)
    expect(QUANTUM_SRC).toMatch(/viewBox="0 0 200 200"/)
  })

  it('Hexagon radius bumped to 80 (was 72)', () => {
    // The orbit code uses `const r = 80` twice (lines + avatars). Old r=72
    // should be gone from the orbit layout.
    const orbitBlock = QUANTUM_SRC.match(
      /Orbit layout[\s\S]*?\{CAST\.map[\s\S]*?\}\)\}\s*<\/div>/,
    )?.[0] ?? ''
    expect(orbitBlock).toMatch(/const r = 80/)
    expect(orbitBlock).not.toMatch(/const r = 72/)
  })

  it('Center "QUANTUM" label preserved', () => {
    expect(QUANTUM_SRC).toMatch(/>\s*QUANTUM\s*</)
  })
})
