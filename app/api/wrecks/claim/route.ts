import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { computeClaimEconomics, insurancePayout } from '@/lib/game/wrecks/economics'
import type { ShipTier, WreckRow } from '@/lib/game/wrecks/types'

const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').trim()
const SERVICE_KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY ?? '').trim()

function admin() { return createClient(SUPABASE_URL, SERVICE_KEY) }

export async function POST(req: NextRequest) {
  try {
    const { wreckId } = await req.json()
    if (!wreckId) return NextResponse.json({ error: 'missing wreckId' }, { status: 400 })

    const sb = await createServerSupabaseClient()
    const { data: userData } = await sb.auth.getUser()
    const claimerUserId = userData?.user?.id
    if (!claimerUserId) return NextResponse.json({ error: 'not signed in' }, { status: 401 })

    const adminSb = admin()
    const { data: wreckRaw } = await adminSb.from('wrecks').select('*').eq('id', wreckId).maybeSingle()
    const wreck = wreckRaw as unknown as WreckRow | null
    if (!wreck) return NextResponse.json({ error: 'wreck not found' }, { status: 404 })
    if (wreck.phase !== 'abandoned') return NextResponse.json({ error: 'wreck not claimable' }, { status: 409 })
    if (wreck.owner_user_id === claimerUserId) return NextResponse.json({ error: 'cannot claim your own wreck' }, { status: 409 })

    const tier = (wreck.ship_tier as ShipTier) ?? 'common'
    const econ = computeClaimEconomics(tier)
    if (!econ) return NextResponse.json({ error: 'wreck not claimable (tier)' }, { status: 409 })

    // Check balance.
    const { data: wallet } = await adminSb
      .from('user_credits')
      .select('ghai_balance_platform')
      .eq('user_id', claimerUserId)
      .maybeSingle()
    if (!wallet || (wallet.ghai_balance_platform ?? 0) < econ.total) {
      return NextResponse.json({ error: 'insufficient GHAI' }, { status: 402 })
    }

    // Debit claimer: claim fee + repair cost (single tx_signature for idempotency).
    const { error: debitErr } = await adminSb.from('ghai_transactions').insert({
      user_id: claimerUserId,
      amount: econ.total,
      type: 'debit',
      product: 'module_purchase',
      tx_signature: `claim_${wreck.id}`,
    })
    if (debitErr && (debitErr as { code?: string }).code !== '23505') {
      return NextResponse.json({ error: debitErr.message }, { status: 500 })
    }

    await adminSb.from('user_credits')
      .update({ ghai_balance_platform: (wallet.ghai_balance_platform ?? 0) - econ.total, updated_at: new Date().toISOString() })
      .eq('user_id', claimerUserId)

    // Credit original owner with insurance.
    const insurance = insurancePayout(tier)
    await adminSb.from('ghai_transactions').insert({
      user_id: wreck.owner_user_id,
      amount: insurance,
      type: 'credit',
      product: 'hauling',
      tx_signature: `insurance_${wreck.id}`,
    })
    const { data: ownerWallet } = await adminSb
      .from('user_credits')
      .select('ghai_balance_platform')
      .eq('user_id', wreck.owner_user_id)
      .maybeSingle()
    if (ownerWallet) {
      await adminSb.from('user_credits')
        .update({ ghai_balance_platform: (ownerWallet.ghai_balance_platform ?? 0) + insurance, updated_at: new Date().toISOString() })
        .eq('user_id', wreck.owner_user_id)
    } else {
      await adminSb.from('user_credits').insert({ user_id: wreck.owner_user_id, ghai_balance_platform: insurance })
    }

    // Grant ship to claimer (ship_inventory table).
    await adminSb.from('ship_inventory').insert({
      user_id: claimerUserId,
      ship_model_id: wreck.ship_id,
      skin_id: null,
      is_soulbound: false,
      acquired_via: 'wreck_claim',
    })

    // Mark wreck claimed.
    await adminSb.from('wrecks').update({
      phase: 'claimed',
      claimed_by_user_id: claimerUserId,
      claimed_at: new Date().toISOString(),
      resolution: 'claimed_by_other',
    }).eq('id', wreck.id)

    return NextResponse.json({ ok: true, insurancePaid: insurance, totalSpent: econ.total })
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'server error' }, { status: 500 })
  }
}
