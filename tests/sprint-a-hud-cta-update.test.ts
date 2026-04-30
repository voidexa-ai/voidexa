import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const HUD_SRC = readFileSync(
  resolve(__dirname, '..', 'components', 'starmap', 'HoverHUD.tsx'),
  'utf8',
)

describe('Sprint A — HoverHUD quantum CTA reflects landing repoint', () => {
  it('quantum HUD CTA mentions Quantum Tools', () => {
    const stanza = HUD_SRC.match(/quantum:\s*\{[\s\S]*?cta:\s*['"][^'"]+['"]/)?.[0] ?? ''
    expect(stanza).toMatch(/EXPLORE QUANTUM TOOLS/)
  })

  it('old FIX-17 quantum CTA "→ ENTER QUANTUM" is gone', () => {
    const stanza = HUD_SRC.match(/quantum:\s*\{[\s\S]*?cta:\s*['"][^'"]+['"]/)?.[0] ?? ''
    expect(stanza).not.toMatch(/→\s*ENTER QUANTUM\s*['"]/)
  })

  it('quantum HUD body still mentions all 3 sub-products (FIX-17 invariant)', () => {
    const stanza = HUD_SRC.match(/quantum:\s*\{[\s\S]*?\},/)?.[0] ?? ''
    expect(stanza).toMatch(/Council/)
    expect(stanza).toMatch(/Forge/)
    expect(stanza).toMatch(/Void Pro AI/)
  })
})
