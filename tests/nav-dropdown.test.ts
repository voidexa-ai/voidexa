import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

// The Nav component is a client component with React hooks + i18n context,
// so we statically assert its NAV_GROUPS declaration contains the Home
// dropdown. Source inspection avoids needing jsdom + every nav provider.

const NAV_SRC = readFileSync(
  join(process.cwd(), 'components', 'layout', 'Navigation.tsx'),
  'utf8',
)

describe('Nav Home dropdown — sprint 13d', () => {
  it('Home group has a Main Page child pointing at /home (never bare /)', () => {
    // Match the object literal in the NAV_GROUPS declaration.
    expect(NAV_SRC).toMatch(/href:\s*['"]\/home['"]/)
    expect(NAV_SRC).toMatch(/label:\s*['"]Main Page['"]/)
  })

  it('Home group has a Quick Menu child pointing at /?menu=true', () => {
    expect(NAV_SRC).toMatch(/href:\s*['"]\/\?menu=true['"]/)
    expect(NAV_SRC).toMatch(/label:\s*['"]Quick Menu['"]/)
  })

  it('Home group children descriptions explain each option', () => {
    // Main Page description anchor — product surface.
    expect(NAV_SRC).toMatch(/Products, team, and GHAI cards/)
    // Quick Menu description anchor — no video.
    expect(NAV_SRC).toMatch(/no video|no-video|no video\./i)
  })

  it('Home label uses i18n (t.nav.home), not a hardcoded string', () => {
    expect(NAV_SRC).toMatch(/label:\s*t\.nav\.home/)
  })

  it('Home bare href is NOT exposed as a top-level link (dropdown only)', () => {
    // The Home group entry must not have its own `href:` above `children:`.
    // Extract the first group entry and assert it has no top-level href.
    const homeGroupMatch = NAV_SRC.match(
      /label:\s*t\.nav\.home[\s\S]{0,160}?children:/,
    )
    expect(homeGroupMatch).not.toBeNull()
    const slice = homeGroupMatch![0]
    expect(slice).not.toMatch(/\bhref:\s*['"]\/['"][,\s]/)
  })
})
