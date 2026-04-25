'use server'

import { createServerSupabaseClient } from '@/lib/supabase-server'

export type LoadDeckResult =
  | {
      ok: true
      deck: { id: string; name: string; cardIds: string[] }
    }
  | { ok: false; error: 'unauthenticated' | 'not_found' }

export async function loadDeck(deckId: string): Promise<LoadDeckResult> {
  if (!deckId || typeof deckId !== 'string') {
    return { ok: false, error: 'not_found' }
  }
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'unauthenticated' }

  const { data, error } = await supabase
    .from('user_decks')
    .select('id, name, card_ids')
    .eq('id', deckId)
    .eq('user_id', user.id)
    .eq('active', true)
    .maybeSingle()
  if (error || !data) return { ok: false, error: 'not_found' }
  return {
    ok: true,
    deck: {
      id: data.id,
      name: data.name,
      cardIds: Array.isArray(data.card_ids) ? data.card_ids : [],
    },
  }
}
