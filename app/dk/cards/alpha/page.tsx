import type { Metadata } from 'next'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import AlphaCatalog, {
  type AlphaCatalogCard,
} from '@/components/cards/AlphaCatalog'
import {
  ALPHA_PAGE_SIZE,
  DEFAULT_ALPHA_TYPE,
  isValidAlphaType,
  parsePage,
} from '@/lib/cards/alpha-types'

// DK shell — same data + same UI as English /cards/alpha. Catalog UI strings
// stay English per AFS-26 deferral; only metadata is localized for SEO/share.
export const metadata: Metadata = {
  title: 'Alpha-kortbiblioteket — voidexa',
  description:
    'Bla i voidexa Alpha-sættet — 1000 kort fordelt på 9 typer og 6 sjældenheder. UI på engelsk pr. AFS-26.',
  alternates: {
    canonical: '/dk/cards/alpha',
    languages: {
      en: '/cards/alpha',
      da: '/dk/cards/alpha',
      'x-default': '/cards/alpha',
    },
  },
}

type SearchParams = { type?: string; page?: string }

export default async function AlphaCatalogPageDk({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const type = isValidAlphaType(params.type) ? params.type : DEFAULT_ALPHA_TYPE
  const requestedPage = parsePage(params.page)

  const supabase = await createServerSupabaseClient()

  const { count } = await supabase
    .from('alpha_cards')
    .select('*', { count: 'exact', head: true })
    .eq('type', type)
    .eq('active', true)

  const totalCount = count ?? 0
  const totalPages = Math.max(1, Math.ceil(totalCount / ALPHA_PAGE_SIZE))
  const page = Math.min(requestedPage, totalPages)
  const offset = (page - 1) * ALPHA_PAGE_SIZE

  const { data: cards } = await supabase
    .from('alpha_cards')
    .select(
      'id, type, name, energy_cost, attack, defense, rarity, archetype, effect_text, flavor_text, keywords, extras',
    )
    .eq('type', type)
    .eq('active', true)
    .order('id', { ascending: true })
    .range(offset, offset + ALPHA_PAGE_SIZE - 1)

  return (
    <AlphaCatalog
      activeType={type}
      currentPage={page}
      totalPages={totalPages}
      totalCount={totalCount}
      cards={(cards ?? []) as AlphaCatalogCard[]}
      basePath="/dk/cards/alpha"
    />
  )
}
