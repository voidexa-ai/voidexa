import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

// AFS-6d — Source-level invariants for the Alpha catalog page + client + DK shell.

const PAGE_EN_SRC = readFileSync(
  join(process.cwd(), 'app', 'cards', 'alpha', 'page.tsx'),
  'utf8',
)
const PAGE_DK_SRC = readFileSync(
  join(process.cwd(), 'app', 'dk', 'cards', 'alpha', 'page.tsx'),
  'utf8',
)
const CATALOG_SRC = readFileSync(
  join(process.cwd(), 'components', 'cards', 'AlphaCatalog.tsx'),
  'utf8',
)
const TYPES_SRC = readFileSync(
  join(process.cwd(), 'lib', 'cards', 'alpha-types.ts'),
  'utf8',
)

const NINE_TYPES = [
  'weapon',
  'drone',
  'ai_routine',
  'defense',
  'module',
  'maneuver',
  'equipment',
  'field',
  'ship_core',
] as const

const NINE_LABELS = [
  'Weapon',
  'Drone',
  'AI Routine',
  'Defense',
  'Module',
  'Maneuver',
  'Equipment',
  'Field',
  'Ship Core',
] as const

describe('AFS-6d alpha-types — shared catalog constants', () => {
  it('VALID_ALPHA_TYPES lists all 9 canonical lowercase types in source order', () => {
    for (const t of NINE_TYPES) {
      expect(TYPES_SRC).toContain(`'${t}'`)
    }
  })

  it('ALPHA_PAGE_SIZE is exactly 20', () => {
    expect(TYPES_SRC).toMatch(/ALPHA_PAGE_SIZE\s*=\s*20\b/)
  })

  it('DEFAULT_ALPHA_TYPE is weapon (first tab)', () => {
    expect(TYPES_SRC).toMatch(
      /DEFAULT_ALPHA_TYPE[^=]*=\s*['"]weapon['"]/,
    )
  })

  it('ALPHA_DB_TO_LABEL maps every db type to its titlecase label', () => {
    for (let i = 0; i < NINE_TYPES.length; i++) {
      const db = NINE_TYPES[i]
      const label = NINE_LABELS[i]
      const re = new RegExp(`${db}\\s*:\\s*['"]${label}['"]`)
      expect(TYPES_SRC).toMatch(re)
    }
  })
})

describe('AFS-6d alpha catalog server page (EN) — search params + Supabase fetch', () => {
  it('uses createServerSupabaseClient (anon key, RLS-respecting), NOT supabaseAdmin', () => {
    expect(PAGE_EN_SRC).toMatch(
      /createServerSupabaseClient.*from\s+['"]@\/lib\/supabase-server['"]/,
    )
    expect(PAGE_EN_SRC).not.toMatch(/supabaseAdmin/)
  })

  it('declares searchParams as Promise<SearchParams> (Next.js 16 async params)', () => {
    expect(PAGE_EN_SRC).toMatch(/searchParams:\s*Promise<SearchParams>/)
    expect(PAGE_EN_SRC).toMatch(/await\s+searchParams/)
  })

  it('filters alpha_cards by type AND active=true (RLS-friendly query)', () => {
    expect(PAGE_EN_SRC).toMatch(/\.eq\(['"]type['"],\s*type\)/)
    expect(PAGE_EN_SRC).toMatch(/\.eq\(['"]active['"],\s*true\)/)
  })

  it('paginates via .range(offset, offset + ALPHA_PAGE_SIZE - 1)', () => {
    expect(PAGE_EN_SRC).toMatch(
      /\.range\(\s*offset\s*,\s*offset\s*\+\s*ALPHA_PAGE_SIZE\s*-\s*1\s*\)/,
    )
  })

  it('canonical metadata + alternates point at /cards/alpha', () => {
    expect(PAGE_EN_SRC).toMatch(/canonical:\s*['"]\/cards\/alpha['"]/)
    expect(PAGE_EN_SRC).toMatch(/da:\s*['"]\/dk\/cards\/alpha['"]/)
  })
})

describe('AFS-6d alpha catalog DK shell — i18n', () => {
  it('renders the same AlphaCatalog component', () => {
    expect(PAGE_DK_SRC).toMatch(
      /import\s+AlphaCatalog[\s\S]*from\s+['"]@\/components\/cards\/AlphaCatalog['"]/,
    )
  })

  it('passes basePath="/dk/cards/alpha" so tab + pagination links stay localized', () => {
    expect(PAGE_DK_SRC).toMatch(/basePath=['"]\/dk\/cards\/alpha['"]/)
  })

  it('canonical metadata points at /dk/cards/alpha', () => {
    expect(PAGE_DK_SRC).toMatch(/canonical:\s*['"]\/dk\/cards\/alpha['"]/)
  })

  it('description is Danish (i18n shell, EN content per AFS-26)', () => {
    expect(PAGE_DK_SRC).toMatch(/Bla i voidexa Alpha-s/)
  })
})

describe('AFS-6d AlphaCatalog client component — tabs + pagination', () => {
  it('marks itself as a client component', () => {
    expect(CATALOG_SRC).toMatch(/^['"]use client['"]/m)
  })

  it('renders one tab per VALID_ALPHA_TYPES entry via .map', () => {
    expect(CATALOG_SRC).toMatch(
      /VALID_ALPHA_TYPES[\s\S]{0,200}\.map\(/,
    )
  })

  it('tab href uses ${basePath}?type=${dbType}&page=1 (resets page to 1 on tab change)', () => {
    expect(CATALOG_SRC).toContain('${basePath}?type=${dbType}&page=1')
  })

  it('pagination href uses ${basePath}?type=${activeType}&page=${p}', () => {
    expect(CATALOG_SRC).toContain('${basePath}?type=${activeType}&page=${p}')
  })

  it('renders cards via AlphaCardFrame from components/cards (NOT V3 combat)', () => {
    expect(CATALOG_SRC).toMatch(
      /import\s+AlphaCardFrame[\s\S]*from\s+['"]@\/components\/cards\/AlphaCardFrame['"]/,
    )
    expect(CATALOG_SRC).not.toMatch(
      /from\s+['"][^'"]*components\/combat\/CardCollection['"]/,
    )
    expect(CATALOG_SRC).not.toMatch(
      /from\s+['"][^'"]*components\/combat\/DeckBuilder['"]/,
    )
  })

  it('hides pagination block when totalPages <= 1', () => {
    expect(CATALOG_SRC).toMatch(/totalPages\s*>\s*1\s*&&/)
  })

  it('uses aria-current="page" for active tab + active page link (a11y)', () => {
    expect(CATALOG_SRC).toMatch(
      /aria-current=\{isActive\s*\?\s*['"]page['"]/,
    )
    expect(CATALOG_SRC).toMatch(
      /aria-current=\{active\s*\?\s*['"]page['"]/,
    )
  })

  it('uses ALPHA_DB_TO_LABEL to translate db type -> AlphaCardType prop', () => {
    expect(CATALOG_SRC).toMatch(/ALPHA_DB_TO_LABEL\[card\.type\]/)
  })
})
