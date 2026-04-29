// Sprint AFS-MICRO-FIX regression coverage.
//
// Locks the two fixes shipped on 2026-04-28:
//   Fix 1 — ChatSidebar GHAI bottom section pb-24 clears UniverseChat bubble
//   Fix 2 — StarMapPage KCP-90 terminal compress + range now show ~93%
//
// Source-level assertions, mirrors AFS-FIX-COMBO / AFS-OVERLAY-FIX-V2 pattern.

import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const read = (...parts: string[]) => readFileSync(join(ROOT, ...parts), 'utf8')

const SIDEBAR_SRC  = read('components', 'ghost-ai', 'ChatSidebar.tsx')
const STARMAP_SRC  = read('components', 'starmap', 'StarMapPage.tsx')

describe('AFS-MICRO-FIX Fix 1 — GHAI sidebar bottom padding', () => {
  it('GHAI section wrapper has pb-24 (96px) bottom padding', () => {
    // Override of the default p-4 (16px) so the bottom 96px of the section
    // stays clear of the UniverseChat bubble (bottom-6 left-6, ~80px footprint).
    expect(SIDEBAR_SRC).toMatch(
      /<div className="p-4 pb-24 border-t border-gray-800 space-y-3">/
    )
  })

  it('does not regress to plain p-4 (the broken pre-fix layout)', () => {
    expect(SIDEBAR_SRC).not.toMatch(
      /<div className="p-4 border-t border-gray-800 space-y-3">/
    )
  })

  it('CreditDisplay + GhaiTicker still render inside the padded section', () => {
    // Guard against accidental removal during sidebar refactors.
    expect(SIDEBAR_SRC).toMatch(/pb-24[\s\S]{0,200}<CreditDisplay \/>/)
    expect(SIDEBAR_SRC).toMatch(/pb-24[\s\S]{0,200}<GhaiTicker \/>/)
  })
})

describe('AFS-MICRO-FIX Fix 2 — starmap KCP-90 terminal percentage', () => {
  it('compress row shows ~93%, not 95%', () => {
    expect(STARMAP_SRC).toMatch(
      /\{t\.home\.kcpCompress\}[\s\S]{0,400}>~93%<\/span>/
    )
  })

  it('range row shows ~93%, not 95%', () => {
    expect(STARMAP_SRC).toMatch(
      /\{t\.home\.kcpRange\}[\s\S]{0,400}>~93%<\/span>/
    )
  })

  it('does not regress to the stale 95% marketing string', () => {
    expect(STARMAP_SRC).not.toMatch(/>95%<\/span>/)
  })

  it('preserves untouched terminal lines (sessions, kcpStatus blinking cursor)', () => {
    // SKILL Fix 2 scope was compress + range only. Sessions value is dynamic
    // ({sessions} variable); kcpStatus i18n line stays as-is.
    expect(STARMAP_SRC).toMatch(/\{t\.home\.kcpSessions\}/)
    expect(STARMAP_SRC).toMatch(/\{t\.home\.kcpStatus\}/)
    expect(STARMAP_SRC).toMatch(/\{sessions\}/)
  })
})
