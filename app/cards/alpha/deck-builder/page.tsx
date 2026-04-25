import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import AlphaDeckBuilder, {
  type DeckBuilderCard,
  type SavedDeck,
} from '@/components/cards/AlphaDeckBuilder'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Alpha Deck Builder — voidexa',
  description:
    'Build a 60-card voidexa Alpha deck. Drag cards up, click to remove, save up to 5 decks per pilot.',
  alternates: {
    canonical: '/cards/alpha/deck-builder',
    languages: {
      en: '/cards/alpha/deck-builder',
      da: '/dk/cards/alpha/deck-builder',
      'x-default': '/cards/alpha/deck-builder',
    },
  },
}

export default async function AlphaDeckBuilderPage() {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect('/auth/login?redirect=/cards/alpha/deck-builder')
  }

  const [{ data: cards }, { data: decks }] = await Promise.all([
    supabase
      .from('alpha_cards')
      .select(
        'id, name, type, rarity, energy_cost, attack, defense, effect_text, flavor_text',
      )
      .eq('active', true)
      .order('name', { ascending: true }),
    supabase
      .from('user_decks')
      .select('id, name, card_ids, created_at')
      .eq('user_id', user.id)
      .eq('card_set', 'alpha')
      .eq('active', true)
      .order('created_at', { ascending: true })
      .limit(5),
  ])

  return (
    <AlphaDeckBuilder
      cards={(cards ?? []) as DeckBuilderCard[]}
      savedDecks={(decks ?? []) as SavedDeck[]}
    />
  )
}
