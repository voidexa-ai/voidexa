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

describe('Nav Universe dropdown — sprint 13e Break Room restore', () => {
  // Isolate the Universe group block so assertions don't leak into other groups.
  const universeBlock = (() => {
    const m = NAV_SRC.match(
      /label:\s*t\.nav\.universe[\s\S]*?children:\s*\[([\s\S]*?)\]\s*,\s*\}/,
    )
    if (!m) throw new Error('Universe group not found in Navigation.tsx')
    return m[1]
  })()

  it('Universe dropdown contains a Break Room child pointing at /break-room', () => {
    expect(universeBlock).toMatch(/href:\s*['"]\/break-room['"]/)
  })

  it('Universe dropdown contains a voidexa System child pointing at /starmap/voidexa', () => {
    expect(universeBlock).toMatch(/href:\s*['"]\/starmap\/voidexa['"]/)
  })

  it('Universe dropdown contains Star Map, voidexa System, Free Flight, Break Room in that order', () => {
    const starMapIdx = universeBlock.indexOf("'/starmap'")
    const voidexaSystemIdx = universeBlock.indexOf("'/starmap/voidexa'")
    const freeFlightIdx = universeBlock.indexOf("'/freeflight'")
    const breakRoomIdx = universeBlock.indexOf("'/break-room'")
    expect(starMapIdx).toBeGreaterThan(-1)
    expect(voidexaSystemIdx).toBeGreaterThan(starMapIdx)
    expect(freeFlightIdx).toBeGreaterThan(voidexaSystemIdx)
    expect(breakRoomIdx).toBeGreaterThan(freeFlightIdx)
  })

  it('Inventory is the LAST item in the Universe dropdown (AFS-6a-fix)', () => {
    // Sprint 13e originally asserted Break Room last. AFS-6a-fix moved it to
    // second-to-last and appended Inventory as the 9th canonical item.
    const hrefs = Array.from(universeBlock.matchAll(/href:\s*['"]([^'"]+)['"]/g)).map(
      m => m[1],
    )
    expect(hrefs.length).toBeGreaterThan(0)
    expect(hrefs[hrefs.length - 1]).toBe('/inventory')
    expect(hrefs[hrefs.length - 2]).toBe('/break-room')
  })

  it('Break Room is NOT present as a standalone top-level nav group', () => {
    // Top-level groups are declared as `label: t.nav.X` — there should be no
    // `t.nav.breakRoom` used as a top-level group label in NAV_GROUPS.
    // Allowed: `/break-room` href inside Universe children, and the string
    // constant in the i18n dictionary itself (not this file).
    const topLevelGroupLabels = Array.from(
      NAV_SRC.matchAll(/^\s*label:\s*(t\.nav\.[a-zA-Z]+)\s*,/gm),
    ).map(m => m[1])
    expect(topLevelGroupLabels).not.toContain('t.nav.breakRoom')
  })
})
