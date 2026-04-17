// lib/credits/deduct.ts
// Two exports live here:
//   1. deductCredits — legacy Void Chat model-usage debit (Pro/GHAI tiers)
//   2. spendGhai    — Sprint 3 gameplay spend helper (idempotent ledger write
//                      via ghai_transactions, used by pack shop + future
//                      warp/repair/module purchases)
//
// They share the same `user_credits.ghai_balance_platform` column.

import { createClient } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { GHAI_COSTS } from '@/config/pricing'
import type { CreditTier } from '@/types/credits'

// ---------------------------------------------------------------------------
// Legacy: Void Chat model-usage debit.
// ---------------------------------------------------------------------------
export async function deductCredits(
  userId: string,
  modelId: string,
  tier: CreditTier,
): Promise<{ success: boolean; ghaiDeducted?: number; error?: string }> {
  const sb = createClient(
    (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').trim(),
    (process.env.SUPABASE_SERVICE_ROLE_KEY ?? '').trim(),
  )

  const ghaiCost = GHAI_COSTS[modelId] || 1

  if (tier === 'pro') return { success: true, ghaiDeducted: 0 }

  if (tier === 'ghai') {
    const { error } = await sb.rpc('deduct_ghai_balance', {
      p_user_id: userId,
      p_amount: ghaiCost,
    })

    if (error) {
      const { data: credits } = await sb
        .from('user_credits')
        .select('ghai_balance_platform, total_ghai_spent')
        .eq('user_id', userId)
        .single()

      if (!credits || credits.ghai_balance_platform < ghaiCost) {
        return { success: false, error: 'Insufficient GHAI balance' }
      }

      const { error: updateError } = await sb
        .from('user_credits')
        .update({
          ghai_balance_platform: credits.ghai_balance_platform - ghaiCost,
          total_ghai_spent: credits.total_ghai_spent + ghaiCost,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId)

      if (updateError) return { success: false, error: updateError.message }
    }

    return { success: true, ghaiDeducted: ghaiCost }
  }

  return { success: false, error: 'No valid payment tier' }
}

// ---------------------------------------------------------------------------
// Sprint 3: gameplay spend (packs etc.) — idempotent via ghai_transactions.
// ---------------------------------------------------------------------------
export type GhaiSpendSource =
  | 'pack_standard'
  | 'pack_premium'
  | 'pack_legendary'
  | 'warp'
  | 'repair'
  | 'module_purchase'

export interface SpendOptions {
  source: GhaiSpendSource
  /** Stable per-transaction id. */
  sourceId: string
}

export interface SpendResult {
  ok: boolean
  alreadySpent: boolean
  newBalance?: number
  error?: string
}

export async function spendGhai(
  userId: string,
  amount: number,
  opts: SpendOptions,
): Promise<SpendResult> {
  if (!userId) return { ok: false, alreadySpent: false, error: 'missing userId' }
  if (!Number.isFinite(amount) || amount <= 0) {
    return { ok: false, alreadySpent: false, error: 'amount must be positive' }
  }
  if (!opts.sourceId) return { ok: false, alreadySpent: false, error: 'missing sourceId' }

  // Ledger insert first. Relies on a unique partial index on
  // (user_id, product, tx_signature) — Sprint 1 added it for 'credit' type;
  // for 'debit' we instead rely on a broader unique constraint below.
  const { error: insertErr } = await supabase.from('ghai_transactions').insert({
    user_id: userId,
    amount,
    type: 'debit',
    product: opts.source,
    tx_signature: opts.sourceId,
  })

  if (insertErr) {
    const code = (insertErr as { code?: string }).code
    if (code === '23505') return { ok: true, alreadySpent: true }
    return { ok: false, alreadySpent: false, error: insertErr.message }
  }

  const { data: existing, error: readErr } = await supabase
    .from('user_credits')
    .select('ghai_balance_platform')
    .eq('user_id', userId)
    .maybeSingle()

  if (readErr) return { ok: false, alreadySpent: false, error: readErr.message }
  if (!existing) return { ok: false, alreadySpent: false, error: 'no wallet row' }
  if ((existing.ghai_balance_platform ?? 0) < amount) {
    return { ok: false, alreadySpent: false, error: 'insufficient GHAI' }
  }

  const newBalance = (existing.ghai_balance_platform ?? 0) - amount
  const { error: updErr } = await supabase
    .from('user_credits')
    .update({ ghai_balance_platform: newBalance, updated_at: new Date().toISOString() })
    .eq('user_id', userId)
  if (updErr) return { ok: false, alreadySpent: false, error: updErr.message }

  return { ok: true, alreadySpent: false, newBalance }
}
