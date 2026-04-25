import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

// AFS-6d — Source-level invariants for the Alpha deck builder.

const PAGE_EN_SRC = readFileSync(
  join(process.cwd(), 'app', 'cards', 'alpha', 'deck-builder', 'page.tsx'),
  'utf8',
)
const PAGE_DK_SRC = readFileSync(
  join(process.cwd(), 'app', 'dk', 'cards', 'alpha', 'deck-builder', 'page.tsx'),
  'utf8',
)
const BUILDER_SRC = readFileSync(
  join(process.cwd(), 'components', 'cards', 'AlphaDeckBuilder.tsx'),
  'utf8',
)
const BAR_SRC = readFileSync(
  join(process.cwd(), 'components', 'cards', 'AlphaDeckBar.tsx'),
  'utf8',
)
const SLOTS_SRC = readFileSync(
  join(process.cwd(), 'components', 'cards', 'AlphaDeckSlots.tsx'),
  'utf8',
)
const SAVE_SRC = readFileSync(
  join(process.cwd(), 'app', 'actions', 'decks', 'saveDeck.ts'),
  'utf8',
)
const LOAD_SRC = readFileSync(
  join(process.cwd(), 'app', 'actions', 'decks', 'loadDeck.ts'),
  'utf8',
)
const DELETE_SRC = readFileSync(
  join(process.cwd(), 'app', 'actions', 'decks', 'deleteDeck.ts'),
  'utf8',
)

describe('AFS-6d deck-builder server pages — auth gate + data fetch', () => {
  it('EN page redirects unauthenticated users to /auth/login with redirect param', () => {
    expect(PAGE_EN_SRC).toMatch(
      /redirect\(['"]\/auth\/login\?redirect=\/cards\/alpha\/deck-builder['"]\)/,
    )
  })

  it('DK page redirects unauthenticated users to localized redirect target', () => {
    expect(PAGE_DK_SRC).toMatch(
      /redirect\(['"]\/auth\/login\?redirect=\/dk\/cards\/alpha\/deck-builder['"]\)/,
    )
  })

  it('Both pages call supabase.auth.getUser() before fetching data', () => {
    expect(PAGE_EN_SRC).toMatch(/supabase\.auth\.getUser/)
    expect(PAGE_DK_SRC).toMatch(/supabase\.auth\.getUser/)
  })

  it('Both pages fetch active alpha_cards and active user_decks (card_set=alpha, limit 5)', () => {
    for (const src of [PAGE_EN_SRC, PAGE_DK_SRC]) {
      expect(src).toMatch(/from\(['"]alpha_cards['"]\)/)
      expect(src).toMatch(/from\(['"]user_decks['"]\)/)
      expect(src).toMatch(/\.eq\(['"]card_set['"],\s*['"]alpha['"]\)/)
      expect(src).toMatch(/\.limit\(5\)/)
    }
  })

  it('Both pages mark the route force-dynamic (auth + per-user data)', () => {
    expect(PAGE_EN_SRC).toMatch(/dynamic\s*=\s*['"]force-dynamic['"]/)
    expect(PAGE_DK_SRC).toMatch(/dynamic\s*=\s*['"]force-dynamic['"]/)
  })
})

describe('AFS-6d server actions — auth + RLS + DB shape', () => {
  it('saveDeck declares "use server" and validates 60-card length + name', () => {
    expect(SAVE_SRC).toMatch(/^['"]use server['"]/m)
    expect(SAVE_SRC).toMatch(/cardIds\.length\s*!==\s*DECK_SIZE/)
    expect(SAVE_SRC).toMatch(/DECK_SIZE\s*=\s*60\b/)
    expect(SAVE_SRC).toMatch(/error:\s*['"]invalid_deck_size['"]/)
    expect(SAVE_SRC).toMatch(/error:\s*['"]invalid_name['"]/)
  })

  it('saveDeck maps the trigger error MAX_5_DECKS_PER_USER to max_decks_reached', () => {
    expect(SAVE_SRC).toMatch(/MAX_5_DECKS_PER_USER/)
    expect(SAVE_SRC).toMatch(/error:\s*['"]max_decks_reached['"]/)
  })

  it('saveDeck takes the UPDATE branch when deckId is set, INSERT otherwise (card_set=alpha)', () => {
    expect(SAVE_SRC).toMatch(/\.update\(\s*\{[^}]*card_ids/)
    expect(SAVE_SRC).toMatch(/\.insert\(\s*\{[^}]*card_set:\s*['"]alpha['"]/)
  })

  it('saveDeck revalidates both EN and DK deck-builder paths', () => {
    expect(SAVE_SRC).toMatch(/revalidatePath\(['"]\/cards\/alpha\/deck-builder['"]\)/)
    expect(SAVE_SRC).toMatch(/revalidatePath\(['"]\/dk\/cards\/alpha\/deck-builder['"]\)/)
  })

  it('loadDeck declares "use server" and filters by user_id + active=true', () => {
    expect(LOAD_SRC).toMatch(/^['"]use server['"]/m)
    expect(LOAD_SRC).toMatch(/\.eq\(['"]user_id['"],\s*user\.id\)/)
    expect(LOAD_SRC).toMatch(/\.eq\(['"]active['"],\s*true\)/)
  })

  it('deleteDeck declares "use server" and soft-deletes via active=false (no hard DELETE)', () => {
    expect(DELETE_SRC).toMatch(/^['"]use server['"]/m)
    expect(DELETE_SRC).toMatch(/\.update\(\s*\{[^}]*active:\s*false/)
    expect(DELETE_SRC).not.toMatch(/\.delete\(\)/)
  })
})

describe('AFS-6d AlphaDeckBuilder client — UX wiring', () => {
  it('marks itself as a client component', () => {
    expect(BUILDER_SRC).toMatch(/^['"]use client['"]/m)
  })

  it('imports the three deck server actions for save/load/delete', () => {
    expect(BUILDER_SRC).toMatch(
      /from\s+['"]@\/app\/actions\/decks\/saveDeck['"]/,
    )
    expect(BUILDER_SRC).toMatch(
      /from\s+['"]@\/app\/actions\/decks\/loadDeck['"]/,
    )
    expect(BUILDER_SRC).toMatch(
      /from\s+['"]@\/app\/actions\/decks\/deleteDeck['"]/,
    )
  })

  it('debounces search input by 300ms via setTimeout (SEARCH_DEBOUNCE_MS = 300)', () => {
    expect(BUILDER_SRC).toMatch(/SEARCH_DEBOUNCE_MS\s*=\s*300\b/)
    expect(BUILDER_SRC).toMatch(/setTimeout\(/)
  })

  it('renders type filter (9 + All) and rarity filter (6 + All)', () => {
    expect(BUILDER_SRC).toMatch(/value=['"]all['"]/)
    expect(BUILDER_SRC).toMatch(/VALID_ALPHA_TYPES\.map\(/)
    expect(BUILDER_SRC).toMatch(/ALL_RARITIES\.map\(/)
    for (const r of ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic']) {
      expect(BUILDER_SRC).toContain(`'${r}'`)
    }
  })

  it('inventory item is draggable and click-to-add (mobile fallback)', () => {
    expect(BUILDER_SRC).toMatch(/draggable\b/)
    expect(BUILDER_SRC).toMatch(/onDragStart=/)
    expect(BUILDER_SRC).toMatch(/onClick=\{\(\)\s*=>\s*addCard\(card\.id\)\}/)
  })

  it('client-side gates save when 60-card invariant or 5-deck cap is breached', () => {
    expect(BUILDER_SRC).toMatch(/deckIds\.length\s*!==\s*DECK_SIZE/)
    expect(BUILDER_SRC).toMatch(/savedDecks\.length\s*>=\s*MAX_DECKS/)
  })

  it('renders cards via AlphaCardFrame (NOT V3 components/combat/*)', () => {
    expect(BUILDER_SRC).toMatch(
      /from\s+['"]@\/components\/cards\/AlphaCardFrame['"]/,
    )
    expect(BUILDER_SRC).not.toMatch(
      /from\s+['"][^'"]*components\/combat\/CardCollection['"]/,
    )
    expect(BUILDER_SRC).not.toMatch(
      /from\s+['"][^'"]*components\/combat\/DeckBuilder['"]/,
    )
  })
})

describe('AFS-6d AlphaDeckBar client — sticky bar UX', () => {
  it('marks itself as a client component', () => {
    expect(BAR_SRC).toMatch(/^['"]use client['"]/m)
  })

  it('exports DECK_SIZE = 60 and renders X / 60 counter', () => {
    expect(BAR_SRC).toMatch(/DECK_SIZE\s*=\s*60\b/)
    expect(BAR_SRC).toMatch(/\{deckIds\.length\}\s*\/\s*\{DECK_SIZE\}/)
  })

  it('renders 5/10/15 visible toggle buttons (VISIBLE_OPTIONS)', () => {
    expect(BAR_SRC).toMatch(/VISIBLE_OPTIONS\s*=\s*\[\s*5\s*,\s*10\s*,\s*15\s*\]/)
  })

  it('drop target receives onDragOver + onDrop and is sticky at top', () => {
    expect(BAR_SRC).toMatch(/onDragOver=\{onDragOver\}/)
    expect(BAR_SRC).toMatch(/onDrop=\{onDrop\}/)
    expect(BAR_SRC).toMatch(/sticky\s+top-0/)
  })

  it('deck-bar entries are click-to-remove buttons with aria-label', () => {
    expect(BAR_SRC).toMatch(/onClick=\{\(\)\s*=>\s*onRemoveAt\(idx\)\}/)
    expect(BAR_SRC).toMatch(/aria-label=\{`Remove \$\{card\.name\}`\}/)
  })
})

describe('AFS-6d AlphaDeckSlots client — saved decks rail', () => {
  it('marks itself as a client component', () => {
    expect(SLOTS_SRC).toMatch(/^['"]use client['"]/m)
  })

  it('exports MAX_DECKS = 5 and shows count vs MAX_DECKS', () => {
    expect(SLOTS_SRC).toMatch(/MAX_DECKS\s*=\s*5\b/)
    expect(SLOTS_SRC).toMatch(/\{savedDecks\.length\}\s*\/\s*\{MAX_DECKS\}/)
  })

  it('renders Load + Delete buttons per slot', () => {
    expect(SLOTS_SRC).toMatch(/onClick=\{\(\)\s*=>\s*onLoad\(d\.id\)\}/)
    expect(SLOTS_SRC).toMatch(/onClick=\{\(\)\s*=>\s*onDelete\(d\.id\)\}/)
  })
})

describe('AFS-6d V3 isolation — existing deck-builder untouched', () => {
  it('V3 deck-builder page still renders <DeckBuilder /> from components/combat', () => {
    const v3 = readFileSync(
      join(process.cwd(), 'app', 'cards', 'deck-builder', 'page.tsx'),
      'utf8',
    )
    expect(v3).toMatch(/from\s+['"]@\/components\/combat\/DeckBuilder['"]/)
  })

  it('V3 components/combat/DeckBuilder.tsx still exists (no accidental delete)', () => {
    expect(
      existsSync(
        join(process.cwd(), 'components', 'combat', 'DeckBuilder.tsx'),
      ),
    ).toBe(true)
  })
})
