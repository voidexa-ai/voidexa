// Sprint AFS-6a regression coverage.
// Mirrors the AFS-4/AFS-7 pattern: source-level invariant checks for routes,
// plus direct unit exercise of the buy-handler module under a stubbed
// supabase + spendGhai.

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const read = (...parts: string[]) => readFileSync(join(ROOT, ...parts), 'utf8')

const SHOP_COSMETICS_SRC = read('app', 'shop', 'cosmetics', 'page.tsx')
const DK_SHOP_COSMETICS_SRC = read('app', 'dk', 'shop', 'cosmetics', 'page.tsx')
const SHOP_TABS_SRC = read('components', 'shop', 'ShopTabs.tsx')
const SHOP_PAGE_SRC = read('components', 'shop', 'ShopPage.tsx')
const INVENTORY_SRC = read('app', 'inventory', 'page.tsx')
const DK_INVENTORY_SRC = read('app', 'dk', 'inventory', 'page.tsx')
const INVENTORY_GRID_SRC = read('components', 'inventory', 'InventoryGrid.tsx')

describe('AFS-6a — /shop/cosmetics route mount', () => {
  it('defines an async default page component', () => {
    expect(SHOP_COSMETICS_SRC).toMatch(/export default async function\s+\w+Page/)
  })

  it('awaits searchParams (Next.js 16 Promise signature)', () => {
    expect(SHOP_COSMETICS_SRC).toContain('searchParams: Promise<SearchParams>')
    expect(SHOP_COSMETICS_SRC).toContain('await searchParams')
  })

  it('renders ShopCosmeticsClient with a tab prop', () => {
    expect(SHOP_COSMETICS_SRC).toContain("import ShopCosmeticsClient from '@/components/shop/ShopCosmeticsClient'")
    expect(SHOP_COSMETICS_SRC).toMatch(/<ShopCosmeticsClient\s+tab=\{tab\}\s*\/>/)
  })

  it('defaults tab to racing when unset', () => {
    expect(SHOP_COSMETICS_SRC).toContain("params.tab ?? 'racing'")
  })

  it('defines DK mirror at /dk/shop/cosmetics', () => {
    expect(DK_SHOP_COSMETICS_SRC).toContain("import ShopCosmeticsClient from '@/components/shop/ShopCosmeticsClient'")
    expect(DK_SHOP_COSMETICS_SRC).toMatch(/export default async function\s+\w+PageDk/)
  })
})

describe('AFS-6a — ShopTabs points to /shop/cosmetics', () => {
  it('router.push targets /shop/cosmetics (not /shop)', () => {
    expect(SHOP_TABS_SRC).toContain('router.push(`/shop/cosmetics?')
    expect(SHOP_TABS_SRC).not.toContain('router.push(`/shop?')
  })
})

describe('AFS-6a — ShopPage ItemModal BUY wired to ItemBuyButton', () => {
  it('imports ItemBuyButton', () => {
    expect(SHOP_PAGE_SRC).toContain("import ItemBuyButton from './ItemBuyButton'")
  })

  it('renders ItemBuyButton in ItemModal with onSuccess closing the modal', () => {
    expect(SHOP_PAGE_SRC).toMatch(/<ItemBuyButton\s+item=\{item\}\s+accent=\{color\}\s+onSuccess=\{onClose\}\s*\/>/)
  })

  it('no longer contains a disabled Coming Soon Stripe button', () => {
    expect(SHOP_PAGE_SRC).not.toContain('t.shop.comingSoonStripe')
  })
})

describe('AFS-6a — /inventory page', () => {
  it('auth-gates with redirect to /auth/login', () => {
    expect(INVENTORY_SRC).toContain("redirect('/auth/login?redirect=/inventory')")
  })

  it('reads user_cards and user_cosmetics', () => {
    expect(INVENTORY_SRC).toContain(".from('user_cards')")
    expect(INVENTORY_SRC).toContain(".from('user_cosmetics')")
  })

  it('DK mirror re-exports the English handler', () => {
    expect(DK_INVENTORY_SRC).toContain("import EnglishInventory from '@/app/inventory/page'")
  })

  it('grid exposes all/cards/cosmetics tabs', () => {
    expect(INVENTORY_GRID_SRC).toContain("(['all', 'cards', 'cosmetics'] as const)")
  })

  it('grid renders an empty state with a pack-shop call to action', () => {
    expect(INVENTORY_GRID_SRC).toContain('Your inventory is empty')
    expect(INVENTORY_GRID_SRC).toContain('/shop/packs')
  })
})

// ---------------------------------------------------------------------------
// buy-handler unit tests — mock supabase + spendGhai via vi.mock.
// ---------------------------------------------------------------------------

type MaybeSingleResult<T> = { data: T | null; error: null }

const getUserMock = vi.fn<() => Promise<{ data: { user: { id: string } | null } }>>()
const ownedLookupMock = vi.fn<() => Promise<MaybeSingleResult<{ cosmetic_id: string }>>>()
const cosmeticInsertMock = vi.fn<(_: unknown) => Promise<{ error: { message: string } | null }>>()
const spendGhaiMock = vi.fn<(userId: string, amount: number, opts: { source: string; sourceId: string }) => Promise<{
  ok: boolean
  alreadySpent: boolean
  newBalance?: number
  error?: string
}>>()

vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getUser: () => getUserMock(),
    },
    from: (table: string) => {
      if (table === 'user_cosmetics') {
        return {
          select: () => ({
            eq: () => ({
              eq: () => ({ maybeSingle: () => ownedLookupMock() }),
            }),
          }),
          insert: (payload: unknown) => cosmeticInsertMock(payload),
        }
      }
      throw new Error(`unexpected table ${table}`)
    },
  },
}))

vi.mock('@/lib/credits/deduct', () => ({
  spendGhai: (userId: string, amount: number, opts: { source: string; sourceId: string }) =>
    spendGhaiMock(userId, amount, opts),
}))

// Lazy import AFTER vi.mock so the mocked modules are used.
const loadHandler = async () => await import('@/lib/shop/buy-handler')

beforeEach(() => {
  getUserMock.mockReset()
  ownedLookupMock.mockReset()
  cosmeticInsertMock.mockReset()
  spendGhaiMock.mockReset()
})

describe('AFS-6a — buy-handler outcomes', () => {
  it('card_pack item returns a redirect to /shop/packs without touching auth', async () => {
    const { buyShopItem } = await loadHandler()
    const { ShopCategory } = await import('@/lib/shop/items')

    const out = await buyShopItem({
      id: 'pack-starter',
      name: 'Starter Pack',
      description: 'Intro pack',
      rarity: 0 as never, // irrelevant for redirect path
      category: ShopCategory.CardPack,
      price: 100,
      imageUrl: '',
      isLimitedEdition: false,
    })
    expect(out).toEqual({ kind: 'redirect', url: '/shop/packs' })
    expect(getUserMock).not.toHaveBeenCalled()
    expect(spendGhaiMock).not.toHaveBeenCalled()
  })

  it('cosmetic item with no auth returns UNAUTHORIZED', async () => {
    getUserMock.mockResolvedValue({ data: { user: null } })
    const { buyShopItem } = await loadHandler()
    const { ShopCategory } = await import('@/lib/shop/items')

    const out = await buyShopItem({
      id: 'skin-crimson-fighter',
      name: 'Crimson',
      description: '',
      rarity: 0 as never,
      category: ShopCategory.ShipSkin,
      price: 50,
      imageUrl: '',
      isLimitedEdition: false,
    })
    expect(out).toEqual({ kind: 'err', code: 'UNAUTHORIZED' })
    expect(spendGhaiMock).not.toHaveBeenCalled()
  })

  it('cosmetic item already owned returns ALREADY_OWNED', async () => {
    getUserMock.mockResolvedValue({ data: { user: { id: 'u1' } } })
    ownedLookupMock.mockResolvedValue({ data: { cosmetic_id: 'skin-crimson-fighter' }, error: null })
    const { buyShopItem } = await loadHandler()
    const { ShopCategory } = await import('@/lib/shop/items')

    const out = await buyShopItem({
      id: 'skin-crimson-fighter',
      name: 'Crimson',
      description: '',
      rarity: 0 as never,
      category: ShopCategory.ShipSkin,
      price: 50,
      imageUrl: '',
      isLimitedEdition: false,
    })
    expect(out).toEqual({ kind: 'err', code: 'ALREADY_OWNED' })
    expect(spendGhaiMock).not.toHaveBeenCalled()
  })

  it('insufficient GHAI balance surfaces INSUFFICIENT_BALANCE', async () => {
    getUserMock.mockResolvedValue({ data: { user: { id: 'u1' } } })
    ownedLookupMock.mockResolvedValue({ data: null, error: null })
    spendGhaiMock.mockResolvedValue({ ok: false, alreadySpent: false, error: 'insufficient GHAI' })
    const { buyShopItem } = await loadHandler()
    const { ShopCategory } = await import('@/lib/shop/items')

    const out = await buyShopItem({
      id: 'skin-crimson-fighter',
      name: 'Crimson',
      description: '',
      rarity: 0 as never,
      category: ShopCategory.ShipSkin,
      price: 50,
      imageUrl: '',
      isLimitedEdition: false,
    })
    expect(out.kind).toBe('err')
    if (out.kind === 'err') expect(out.code).toBe('INSUFFICIENT_BALANCE')
    expect(cosmeticInsertMock).not.toHaveBeenCalled()
  })

  it('successful purchase returns ok with new balance and inserts user_cosmetics row', async () => {
    getUserMock.mockResolvedValue({ data: { user: { id: 'u1' } } })
    ownedLookupMock.mockResolvedValue({ data: null, error: null })
    spendGhaiMock.mockResolvedValue({ ok: true, alreadySpent: false, newBalance: 150 })
    cosmeticInsertMock.mockResolvedValue({ error: null })
    const { buyShopItem } = await loadHandler()
    const { ShopCategory } = await import('@/lib/shop/items')

    const out = await buyShopItem({
      id: 'skin-chrome-cruiser',
      name: 'Chrome',
      description: '',
      rarity: 0 as never,
      category: ShopCategory.ShipSkin,
      price: 300,
      imageUrl: '',
      isLimitedEdition: false,
    })
    expect(out).toEqual({ kind: 'ok', newBalance: 150 })
    expect(spendGhaiMock).toHaveBeenCalledWith('u1', 300, {
      source: 'module_purchase',
      sourceId: 'starter_skin-chrome-cruiser',
    })
    expect(cosmeticInsertMock).toHaveBeenCalledWith({
      user_id: 'u1',
      cosmetic_id: 'skin-chrome-cruiser',
      equipped: false,
    })
  })
})

describe('AFS-6a — buy-handler isCardPack helper', () => {
  it('returns true for CardPack category', async () => {
    const { isCardPack } = await loadHandler()
    const { ShopCategory } = await import('@/lib/shop/items')
    expect(
      isCardPack({
        id: 'x',
        name: '',
        description: '',
        rarity: 0 as never,
        category: ShopCategory.CardPack,
        price: 100,
        imageUrl: '',
        isLimitedEdition: false,
      }),
    ).toBe(true)
  })

  it('returns false for non-pack categories', async () => {
    const { isCardPack } = await loadHandler()
    const { ShopCategory } = await import('@/lib/shop/items')
    for (const c of [
      ShopCategory.ShipSkin,
      ShopCategory.Attachment,
      ShopCategory.Effect,
      ShopCategory.Trail,
      ShopCategory.CockpitTheme,
      ShopCategory.Emote,
    ]) {
      expect(
        isCardPack({
          id: 'x',
          name: '',
          description: '',
          rarity: 0 as never,
          category: c,
          price: 50,
          imageUrl: '',
          isLimitedEdition: false,
        }),
      ).toBe(false)
    }
  })
})
