'use server'

import { revalidatePath } from 'next/cache'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export interface SaveDeckInput {
  deckId?: string | null
  name: string
  cardIds: string[]
}

export type SaveDeckResult =
  | { ok: true; deckId: string }
  | {
      ok: false
      error:
        | 'unauthenticated'
        | 'invalid_deck_size'
        | 'invalid_name'
        | 'max_decks_reached'
        | 'unknown'
    }

const DECK_SIZE = 60
const NAME_MAX = 60

export async function saveDeck(
  input: SaveDeckInput,
): Promise<SaveDeckResult> {
  if (!Array.isArray(input.cardIds) || input.cardIds.length !== DECK_SIZE) {
    return { ok: false, error: 'invalid_deck_size' }
  }
  const name = (input.name ?? '').trim().slice(0, NAME_MAX)
  if (!name) return { ok: false, error: 'invalid_name' }

  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'unauthenticated' }

  const nowIso = new Date().toISOString()

  if (input.deckId) {
    // UPDATE existing deck (RLS ensures user_id match).
    const { error } = await supabase
      .from('user_decks')
      .update({
        name,
        card_ids: input.cardIds,
        updated_at: nowIso,
      })
      .eq('id', input.deckId)
      .eq('user_id', user.id)
    if (error) return { ok: false, error: 'unknown' }
    revalidatePath('/cards/alpha/deck-builder')
    revalidatePath('/dk/cards/alpha/deck-builder')
    return { ok: true, deckId: input.deckId }
  }

  // INSERT new deck. The DB trigger blocks if user has 5 active decks.
  const { data, error } = await supabase
    .from('user_decks')
    .insert({
      user_id: user.id,
      name,
      card_set: 'alpha',
      card_ids: input.cardIds,
      active: true,
    })
    .select('id')
    .single()
  if (error || !data) {
    if (error?.message?.includes('MAX_5_DECKS_PER_USER')) {
      return { ok: false, error: 'max_decks_reached' }
    }
    return { ok: false, error: 'unknown' }
  }
  revalidatePath('/cards/alpha/deck-builder')
  revalidatePath('/dk/cards/alpha/deck-builder')
  return { ok: true, deckId: data.id }
}
