import type { Metadata } from 'next'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import AlphaCatalog, {
  type AlphaCatalogCard,
} from '@/components/cards/AlphaCatalog'
import {
  ALPHA_PAGE_SIZE,
  DEFAULT_ALPHA_TYPE,
  isValidAlphaRarity,
  isValidAlphaType,
  parsePage,
} from '@/lib/cards/alpha-types'

// AFS-18  (Apr 28): /cards renders the Alpha 1000 catalog instead of the V3
// First Edition Core Set. V3 components remain in repo
// (components/combat/CardCollection.tsx, lib/cards/full_library.ts) for
// possible future restoration. Do not re-import without explicit approval.
// /cards/alpha route stays live as a backward-compat alias.
//
// AFS-18b (Apr 28): added ?rarity= search param. Both filters AND-combine
// against alpha_cards.

export const metadata: Metadata = {
  title: 'Cards - Alpha Library - voidexa',
  description:
    'Browse the 1000-card voidexa Alpha set across 9 types and 6 rarities - premium frames with unique per-card art.',
  alternates: {
    canonical: '/cards',
    languages: {
      en: '/cards',
      da: '/dk/cards',
      'x-default': '/cards',
    },
  },
}

type SearchParams = { type?: string; rarity?: string; page?: string }

export default async function CardsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const type = isValidAlphaType(params.type) ? params.type : DEFAULT_ALPHA_TYPE
  const rarity = isValidAlphaRarity(params.rarity) ? params.rarity : null
  const requestedPage = parsePage(params.page)

  const supabase = await createServerSupabaseClient()

  let countQ = supabase
    .from('alpha_cards')
    .select('*', { count: 'exact', head: true })
    .eq('type', type)
    .eq('active', true)
  if (rarity) countQ = countQ.eq('rarity', rarity)
  const { count } = await countQ

  const totalCount = count ?? 0
  const totalPages = Math.max(1, Math.ceil(totalCount / ALPHA_PAGE_SIZE))
  const page = Math.min(requestedPage, totalPages)
  const offset = (page - 1) * ALPHA_PAGE_SIZE

  let cardsQ = supabase
    .from('alpha_cards')
    .select(
      'id, type, name, energy_cost, attack, defense, rarity, archetype, effect_text, flavor_text, keywords, extras',
    )
    .eq('type', type)
    .eq('active', true)
  if (rarity) cardsQ = cardsQ.eq('rarity', rarity)
  const { data: cards } = await cardsQ
    .order('id', { ascending: true })
    .range(offset, offset + ALPHA_PAGE_SIZE - 1)

  return (
    <AlphaCatalog
      activeType={type}
      activeRarity={rarity}
      currentPage={page}
      totalPages={totalPages}
      totalCount={totalCount}
      cards={(cards ?? []) as AlphaCatalogCard[]}
      basePath="/cards"
    />
  )
}
