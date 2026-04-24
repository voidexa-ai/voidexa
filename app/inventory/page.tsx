import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { getCardTemplate } from '@/lib/game/cards/index'
import { getCosmetic } from '@/lib/game/shop/catalog'
import { STARTER_SHOP_ITEMS } from '@/lib/shop/items'
import InventoryGrid, { type InventoryCardRow, type InventoryCosmeticRow } from '@/components/inventory/InventoryGrid'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Your Inventory — voidexa',
  description: 'Cards and cosmetics you own in the voidexa universe.',
  alternates: {
    canonical: '/inventory',
    languages: {
      en: '/inventory',
      da: '/dk/inventory',
      'x-default': '/inventory',
    },
  },
}

export default async function InventoryPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login?redirect=/inventory')

  const [{ data: cards }, { data: cosmetics }] = await Promise.all([
    supabaseAdmin
      .from('user_cards')
      .select('template_id, quantity, acquired_from, first_acquired_at')
      .eq('user_id', user.id)
      .order('first_acquired_at', { ascending: false }),
    supabaseAdmin
      .from('user_cosmetics')
      .select('cosmetic_id, equipped')
      .eq('user_id', user.id),
  ])

  const cardRows: InventoryCardRow[] = (cards ?? []).map(c => {
    const tpl = getCardTemplate(c.template_id)
    return {
      id: c.template_id,
      name: tpl?.name ?? c.template_id,
      rarity: (tpl?.rarity ?? null) as InventoryCardRow['rarity'],
      quantity: c.quantity ?? 1,
      acquiredFrom: c.acquired_from ?? null,
    }
  })

  const cosmeticRows: InventoryCosmeticRow[] = (cosmetics ?? []).map(row => {
    const id = row.cosmetic_id as string
    const catalogHit = getCosmetic(id)
    const starterHit =
      id.startsWith('starter_') || id.startsWith('skin-') || id.startsWith('attach-') || id.startsWith('effect-') || id.startsWith('trail-') || id.startsWith('cockpit-') || id.startsWith('emote-')
        ? STARTER_SHOP_ITEMS.find(s => s.id === id.replace(/^starter_/, ''))
        : undefined
    return {
      id,
      name: catalogHit?.name ?? starterHit?.name ?? id,
      category: catalogHit?.category ?? null,
      equipped: Boolean(row.equipped),
    }
  })

  return <InventoryGrid cards={cardRows} cosmetics={cosmeticRows} />
}
