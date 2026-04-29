import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { PLAY_NOW_TILES } from '../components/game-hub/PlayNow'
import { ROADMAP_ITEMS } from '../components/game-hub/ComingSoonRoadmap'
import { ROLLING_PROMOS } from '../components/game-hub/RollingPromo'

const PAGE_SRC = readFileSync(
  join(process.cwd(), 'app', 'game-hub', 'page.tsx'),
  'utf8',
)
const HERO_SRC = readFileSync(
  join(process.cwd(), 'components', 'game-hub', 'GameHubHero.tsx'),
  'utf8',
)
const ROADMAP_SRC = readFileSync(
  join(process.cwd(), 'components', 'game-hub', 'ComingSoonRoadmap.tsx'),
  'utf8',
)
const SIGNUP_SRC = readFileSync(
  join(process.cwd(), 'components', 'game-hub', 'DevSignup.tsx'),
  'utf8',
)
const AFFILIATE_SRC = readFileSync(
  join(process.cwd(), 'components', 'game-hub', 'AffiliatePlaceholder.tsx'),
  'utf8',
)
const ROLLING_SRC = readFileSync(
  join(process.cwd(), 'components', 'game-hub', 'RollingPromo.tsx'),
  'utf8',
)
const ACTION_SRC = readFileSync(
  join(process.cwd(), 'app', 'actions', 'leads.ts'),
  'utf8',
)

describe('AFS-10 /game-hub MVP', () => {
  it('page wires all 6 sections (Hero · PlayNow · Roadmap · DevSignup · Affiliate · RollingPromo)', () => {
    for (const section of [
      'GameHubHero',
      'PlayNow',
      'ComingSoonRoadmap',
      'DevSignup',
      'AffiliatePlaceholder',
      'RollingPromo',
    ]) {
      expect(PAGE_SRC).toMatch(new RegExp(`<${section}\\b`))
    }
  })

  it('hero tagline locks the locked-DK copy "Spil. Skab. Konkurrer. Tjen."', () => {
    expect(HERO_SRC).toMatch(/Spil\.\s*Skab\.\s*Konkurrer\.\s*Tjen\./)
  })

  it('PlayNow renders 5 tiles: Sovereign Sky + 4 Break Room games', () => {
    const ids = PLAY_NOW_TILES.map(t => t.id)
    expect(ids).toEqual([
      'sovereign-sky',
      'ghai-invaders',
      'ghost-jump',
      'kcp-stacker',
      'void-pong',
    ])
  })

  it('Sovereign Sky links to /freeflight; the 4 break-room games to /break-room', () => {
    const sovereign = PLAY_NOW_TILES.find(t => t.id === 'sovereign-sky')
    expect(sovereign?.href).toBe('/freeflight')
    for (const id of ['ghai-invaders', 'ghost-jump', 'kcp-stacker', 'void-pong']) {
      const tile = PLAY_NOW_TILES.find(t => t.id === id)
      expect(tile?.href).toBe('/break-room')
    }
  })

  it('Coming Soon roadmap has exactly 5 items (Marketplace, Tournaments, Forums, Leaderboards, Affiliate)', () => {
    const ids = ROADMAP_ITEMS.map(i => i.id)
    expect(ids).toEqual([
      'marketplace',
      'tournaments',
      'forums',
      'leaderboards',
      'affiliate',
    ])
  })

  it('roadmap component renders a Coming Soon pulse on every item', () => {
    expect(ROADMAP_SRC).toMatch(/animate-ping/)
    expect(ROADMAP_SRC).toMatch(/data-testid="coming-soon-pulse"/)
  })

  it('Affiliate placeholder also carries a Coming Soon pulse', () => {
    expect(AFFILIATE_SRC).toMatch(/animate-ping/)
    expect(AFFILIATE_SRC).toMatch(/data-testid="coming-soon-pulse"/)
  })

  it('RollingPromo cycles through voidexa-internal promos only', () => {
    expect(ROLLING_PROMOS.length).toBeGreaterThanOrEqual(3)
    for (const promo of ROLLING_PROMOS) {
      expect(promo.href).toMatch(/^\//)
    }
    expect(ROLLING_SRC).toMatch(/setInterval/)
  })

  it('DevSignup form posts to the submitDevLead server action', () => {
    expect(SIGNUP_SRC).toMatch(/import\s*\{\s*submitDevLead\s*\}\s*from\s*['"]@\/app\/actions\/leads['"]/)
    expect(SIGNUP_SRC).toMatch(/await submitDevLead\(/)
  })

  it('DevSignup input requires email + has accessible label', () => {
    expect(SIGNUP_SRC).toMatch(/type="email"/)
    expect(SIGNUP_SRC).toMatch(/required/)
    expect(SIGNUP_SRC).toMatch(/htmlFor="dev-signup-email"/)
  })
})

describe('AFS-10 leads server action', () => {
  it('marked "use server" + server-only import', () => {
    expect(ACTION_SRC).toMatch(/^['"]use server['"]/m)
    expect(ACTION_SRC).toMatch(/import 'server-only'/)
  })

  it('uses supabaseAdmin singleton (not user-scoped client)', () => {
    expect(ACTION_SRC).toMatch(/import\s*\{\s*supabaseAdmin\s*\}/)
  })

  it('inserts into leads table reusing existing schema (contact, type, source)', () => {
    expect(ACTION_SRC).toMatch(/from\(['"]leads['"]\)/)
    expect(ACTION_SRC).toMatch(/contact:\s*trimmed/)
    expect(ACTION_SRC).toMatch(/type:\s*['"]email['"]/)
    expect(ACTION_SRC).toMatch(/source:\s*['"]game-hub['"]/)
  })

  it('does NOT create a new migration file (existing schema reused)', () => {
    expect(ACTION_SRC).not.toMatch(/CREATE TABLE/i)
  })

  it('rejects empty + malformed emails', () => {
    expect(ACTION_SRC).toMatch(/Email is required/)
    expect(ACTION_SRC).toMatch(/Enter a valid email address/)
  })
})
