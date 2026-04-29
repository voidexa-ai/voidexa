// Sprint AFS-FIX-COMBO regression coverage.
//
// Locks the 6 marketing-accuracy + opacity fixes shipped on 2026-04-28:
//   Fix 1 — /products trading return 313% -> 194.79%
//   Fix 2 — /trading-hub leaderboard house bot return 357.0 -> 194.79
//   Fix 3 — /trading-hub leaderboard rank column uses sorted enumerator (i+1)
//   Fix 4 — /quantum test counter 960 -> 1324 (badge + footer)
//   Fix 5 — /quantum KCP-90 percentage 95% -> ~93% (body + footer)
//   Fix 6 — homepage quick-menu label legibility (backdrop pill + halo shadow)
//
// Source-level assertions, mirrors AFS-1 / AFS-3 / AFS-7 / AFS-18 pattern.

import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const read = (...parts: string[]) => readFileSync(join(ROOT, ...parts), 'utf8')

const PRODUCTS_PAGE_SRC = read('app', 'products', 'page.tsx')
const LEADERBOARD_SRC   = read('components', 'trading-hub', 'LeaderboardTab.tsx')
const QUANTUM_PAGE_SRC  = read('app', 'quantum', 'page.tsx')
const QUICKMENU_SRC     = read('components', 'home', 'QuickMenuOverlay.tsx')

describe('AFS-FIX-COMBO Fix 1 — /products trading return string', () => {
  it('contains the canonical +194.79% backtest figure', () => {
    expect(PRODUCTS_PAGE_SRC).toContain('+194.79% backtest return over 12 months vs buy-and-hold -6%')
  })

  it('does NOT contain the stale +313% figure', () => {
    expect(PRODUCTS_PAGE_SRC).not.toContain('+313%')
  })
})

describe('AFS-FIX-COMBO Fix 2 — /trading-hub house bot return', () => {
  it('voidexa All-Season house row uses return_pct 194.79', () => {
    expect(LEADERBOARD_SRC).toMatch(
      /name:\s*'voidexa All-Season',[^}]*return_pct:\s*194\.79[^}]*isHouse:\s*true/
    )
  })

  it('does NOT contain the stale 357.0 house return', () => {
    expect(LEADERBOARD_SRC).not.toContain('357.0')
  })
})

describe('AFS-FIX-COMBO Fix 3 — leaderboard rank uses sorted enumerator', () => {
  it('rank cell renders {i + 1} from the sorted.map enumerator, not bot.rank', () => {
    expect(LEADERBOARD_SRC).toMatch(/\{i \+ 1\}/)
    expect(LEADERBOARD_SRC).not.toMatch(/<div[^>]*>\s*\{bot\.rank\}\s*<\/div>/)
  })

  it('keeps the .sort() default of return_pct DESC', () => {
    expect(LEADERBOARD_SRC).toMatch(/useState<SortKey>\(['"]return_pct['"]\)/)
    expect(LEADERBOARD_SRC).toMatch(/useState<SortDir>\(['"]desc['"]\)/)
  })

  it('rank top-3 highlight switches from bot.rank <= 3 to i < 3 (consistent with i+1)', () => {
    expect(LEADERBOARD_SRC).toMatch(/i < 3 \? ACCENT/)
  })
})

// AFS-FIX-COMBO Fix 4 + Fix 5 originally asserted on a 951-line marketing
// surface at /quantum. AFS-10 replaced that surface wholesale with a 3-card
// landing page (Quantum Council · Forge · Void Pro AI), so the historical
// "1324 tests" / "~93% compression" copy no longer lives here. The intent of
// these regression checks — guard the new landing from re-introducing stale
// strings ("960 tests", "95% byte compression") — is preserved below.
describe('AFS-FIX-COMBO Fix 4 — /quantum landing has no stale test-count marketing', () => {
  it('does NOT contain the stale 960 marketing string', () => {
    expect(QUANTUM_PAGE_SRC).not.toContain('960 tests')
    expect(QUANTUM_PAGE_SRC).not.toContain('960 Quantum tests passed')
  })

  it('does NOT carry a hardcoded test-count badge (drift-prone — covered by AFS-10 3-card layout)', () => {
    expect(QUANTUM_PAGE_SRC).not.toMatch(/\d{3,4}\s*Quantum tests passed/)
  })
})

describe('AFS-FIX-COMBO Fix 5 — /quantum landing has no stale KCP-90 marketing', () => {
  it('does NOT contain the stale 95% compression marketing string', () => {
    expect(QUANTUM_PAGE_SRC).not.toContain('95% byte compression')
    expect(QUANTUM_PAGE_SRC).not.toContain('95% compression · 1324')
  })

  it('does NOT carry a hardcoded compression percentage (drift-prone — moved to ScienceDeck per AFS-10)', () => {
    expect(QUANTUM_PAGE_SRC).not.toMatch(/~9[0-9]%\s*(?:byte\s*)?compression/)
  })
})

describe('AFS-FIX-COMBO Fix 6 — homepage quick-menu label legibility', () => {
  it('CHECKBOX_LABEL_STYLE has a dark backdrop pill', () => {
    expect(QUICKMENU_SRC).toMatch(
      /CHECKBOX_LABEL_STYLE[\s\S]{0,400}background:\s*['"]rgba\(0,0,0,0\.45\)['"]/
    )
    expect(QUICKMENU_SRC).toMatch(
      /CHECKBOX_LABEL_STYLE[\s\S]{0,400}padding:\s*['"]6px 12px['"]/
    )
    expect(QUICKMENU_SRC).toMatch(
      /CHECKBOX_LABEL_STYLE[\s\S]{0,400}borderRadius:\s*8/
    )
  })

  it('CHECKBOX_LABEL_STYLE keeps high color opacity (>= 0.75) per SKILL acceptance', () => {
    // Source-level assertion: the rgba alpha component on the color line.
    expect(QUICKMENU_SRC).toMatch(
      /CHECKBOX_LABEL_STYLE[\s\S]{0,400}color:\s*['"]rgba\(230,240,255,0\.95\)['"]/
    )
  })

  it('CHECKBOX_LABEL_STYLE has a double-layer halo text-shadow', () => {
    expect(QUICKMENU_SRC).toMatch(
      /CHECKBOX_LABEL_STYLE[\s\S]{0,400}textShadow:\s*['"]0 1px 4px rgba\(0,0,0,0\.9\), 0 0 12px rgba\(0,0,0,0\.6\)['"]/
    )
  })

  it('REPLAY_LINK_STYLE has a backdrop pill + halo shadow', () => {
    expect(QUICKMENU_SRC).toMatch(
      /REPLAY_LINK_STYLE[\s\S]{0,400}background:\s*['"]rgba\(0,0,0,0\.45\)['"]/
    )
    expect(QUICKMENU_SRC).toMatch(
      /REPLAY_LINK_STYLE[\s\S]{0,400}textShadow:\s*['"]0 1px 4px rgba\(0,0,0,0\.9\), 0 0 12px rgba\(0,0,0,0\.6\)['"]/
    )
  })
})
