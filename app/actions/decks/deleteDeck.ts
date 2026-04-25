'use server'

import { revalidatePath } from 'next/cache'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export type DeleteDeckResult =
  | { ok: true }
  | { ok: false; error: 'unauthenticated' | 'not_found' | 'unknown' }

// Soft-delete: flips active=false. Trigger does not fire for active=false
// flips, so the user reclaims a slot for future saves immediately.
export async function deleteDeck(deckId: string): Promise<DeleteDeckResult> {
  if (!deckId || typeof deckId !== 'string') {
    return { ok: false, error: 'not_found' }
  }
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'unauthenticated' }

  const { error, count } = await supabase
    .from('user_decks')
    .update(
      { active: false, updated_at: new Date().toISOString() },
      { count: 'exact' },
    )
    .eq('id', deckId)
    .eq('user_id', user.id)
    .eq('active', true)
  if (error) return { ok: false, error: 'unknown' }
  if (!count) return { ok: false, error: 'not_found' }

  revalidatePath('/cards/alpha/deck-builder')
  revalidatePath('/dk/cards/alpha/deck-builder')
  return { ok: true }
}
