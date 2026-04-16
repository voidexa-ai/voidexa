// Sprint 1 — Task 4: single GHAI credit path shared by every gameplay mode.
//
// Every gameplay-mode result screen (mission, speed run, hauling, battle)
// funnels payouts through `creditGhai`. The function is idempotent per
// (userId, source, sourceId) — a unique index on `ghai_transactions` enforces
// that, so retries don't double-pay even if the client calls twice.
//
// Schema note: the existing `ghai_transactions` table uses `product` for the
// source name and `tx_signature` for the idempotency key. We reuse both.

import { supabase } from '@/lib/supabase'

export type GhaiCreditSource = 'mission' | 'speedrun' | 'hauling' | 'battle'

export interface CreditOptions {
  source: GhaiCreditSource
  /** Stable per-source id (mission_acceptances.id, battle_sessions.id, etc.). */
  sourceId: string
}

export interface CreditResult {
  ok: boolean
  alreadyCredited: boolean
  newBalance?: number
  error?: string
}

/**
 * Credit GHAI to a user's platform balance. Idempotent per (userId, source, sourceId).
 *
 * Returns `{ alreadyCredited: true }` if the same sourceId has already been
 * credited — no balance change, no error.
 */
export async function creditGhai(
  userId: string,
  amount: number,
  opts: CreditOptions,
): Promise<CreditResult> {
  if (!userId) return { ok: false, alreadyCredited: false, error: 'missing userId' }
  if (!Number.isFinite(amount) || amount <= 0) {
    return { ok: false, alreadyCredited: false, error: 'amount must be positive' }
  }
  if (!opts.sourceId) return { ok: false, alreadyCredited: false, error: 'missing sourceId' }

  // Step 1: insert the ledger row first. If it collides with the unique
  // idempotency index, we've already credited this source — bail out.
  const { error: insertErr } = await supabase.from('ghai_transactions').insert({
    user_id: userId,
    amount,
    type: 'credit',
    product: opts.source,
    tx_signature: opts.sourceId,
  })

  if (insertErr) {
    // 23505 = unique_violation → already credited. Anything else = real error.
    const code = (insertErr as { code?: string }).code
    if (code === '23505') {
      return { ok: true, alreadyCredited: true }
    }
    return { ok: false, alreadyCredited: false, error: insertErr.message }
  }

  // Step 2: bump the running balance.
  const { data: existing, error: readErr } = await supabase
    .from('user_credits')
    .select('ghai_balance_platform')
    .eq('user_id', userId)
    .maybeSingle()

  if (readErr) return { ok: false, alreadyCredited: false, error: readErr.message }

  if (!existing) {
    const { error: upsertErr } = await supabase.from('user_credits').insert({
      user_id: userId,
      ghai_balance_platform: amount,
    })
    if (upsertErr) return { ok: false, alreadyCredited: false, error: upsertErr.message }
    return { ok: true, alreadyCredited: false, newBalance: amount }
  }

  const newBalance = (existing.ghai_balance_platform ?? 0) + amount
  const { error: updErr } = await supabase
    .from('user_credits')
    .update({ ghai_balance_platform: newBalance, updated_at: new Date().toISOString() })
    .eq('user_id', userId)
  if (updErr) return { ok: false, alreadyCredited: false, error: updErr.message }

  return { ok: true, alreadyCredited: false, newBalance }
}
