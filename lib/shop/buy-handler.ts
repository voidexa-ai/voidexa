import { supabase } from '@/lib/supabase'
import { spendGhai } from '@/lib/credits/deduct'
import { ShopCategory, type ShopItem } from '@/lib/shop/items'

export type BuyOutcome =
  | { kind: 'ok'; newBalance?: number }
  | { kind: 'redirect'; url: string }
  | { kind: 'err'; code: BuyErrorCode; detail?: string }

export type BuyErrorCode =
  | 'UNAUTHORIZED'
  | 'INSUFFICIENT_BALANCE'
  | 'ALREADY_OWNED'
  | 'UNKNOWN'

export function isCardPack(item: ShopItem): boolean {
  return item.category === ShopCategory.CardPack
}

// STARTER_SHOP_ITEMS prices are stored as USD cents. With $1 = 100 GHAI
// fixed, cents map 1:1 to GHAI (300 cents = 300 GHAI).
function priceInGhai(item: ShopItem): number {
  return item.price
}

export async function buyShopItem(item: ShopItem): Promise<BuyOutcome> {
  if (isCardPack(item)) {
    return { kind: 'redirect', url: '/shop/packs' }
  }

  const { data: auth } = await supabase.auth.getUser()
  const userId = auth.user?.id
  if (!userId) return { kind: 'err', code: 'UNAUTHORIZED' }

  const { data: owned } = await supabase
    .from('user_cosmetics')
    .select('cosmetic_id')
    .eq('user_id', userId)
    .eq('cosmetic_id', item.id)
    .maybeSingle()
  if (owned) return { kind: 'err', code: 'ALREADY_OWNED' }

  const spend = await spendGhai(userId, priceInGhai(item), {
    source: 'module_purchase',
    sourceId: `starter_${item.id}`,
  })
  if (!spend.ok) {
    const msg = (spend.error ?? '').toLowerCase()
    if (msg.includes('insufficient')) {
      return { kind: 'err', code: 'INSUFFICIENT_BALANCE', detail: spend.error }
    }
    return { kind: 'err', code: 'UNKNOWN', detail: spend.error }
  }

  const { error: insertErr } = await supabase.from('user_cosmetics').insert({
    user_id: userId,
    cosmetic_id: item.id,
    equipped: false,
  })
  if (insertErr) {
    return { kind: 'err', code: 'UNKNOWN', detail: insertErr.message }
  }

  return { kind: 'ok', newBalance: spend.newBalance }
}
