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

// AFS-18  (Apr 28): DK shell for /cards Alpha rendering. V3 Core Set
// retired from this surface; V3 files stay on disk untouched. UI strings
// stay English per AFS-26 deferral; only metadata is localized for SEO.
//
// AFS-18b (Apr 28): added ?rarity= search param.

export const metadata: Metadata = {
  title: 'Kort - Alpha-bibliotek - voidexa',
  description:
    'Bla i voidexa Alpha-saettet - 1000 kort fordelt paa 9 typer og 6 sjaeldenheder. UI paa engelsk pr. AFS-26.',
  alternates: {
    canonical: '/dk/cards',
    languages: {
      en: '/cards',
      da: '/dk/cards',
      'x-default': '/cards',
    },
  },
}

type SearchParams = { type?: string; rarity?: string; page?: string }

export default async function CardsPageDk({
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
      basePath="/dk/cards"
    />
  )
}
