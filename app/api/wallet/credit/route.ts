import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase-admin'

// REST wrapper for crediting platform-GHAI on gameplay completion.
// Mission/battle/hauling/speedrun handlers already credit client-side via
// `creditGhai` in lib/credits/credit.ts — this endpoint exists for external
// payout flows (e.g. admin tools, server-side quest completion).
//
// Input:  { amount_usd: number (0 < x <= 100), reason: string, source_id?: string }
// Output: { success: true, new_balance_ghai: number }
// GHAI is credited at the fixed $1 = 100 GHAI rate.

const USD_TO_GHAI = 100

export async function POST(req: NextRequest) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { amount_usd?: unknown; reason?: unknown; source_id?: unknown }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const amountUsd = body.amount_usd
  const reason = typeof body.reason === 'string' ? body.reason : 'credit'
  const sourceId = typeof body.source_id === 'string' ? body.source_id : `${reason}-${Date.now()}`

  if (typeof amountUsd !== 'number' || !Number.isFinite(amountUsd) || amountUsd <= 0 || amountUsd > 100) {
    return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
  }

  const ghaiAmount = Math.floor(amountUsd * USD_TO_GHAI)

  // Idempotent ledger insert — unique index on (user_id, tx_signature) prevents double-credit.
  const { error: txErr } = await supabaseAdmin.from('ghai_transactions').insert({
    user_id: user.id,
    amount: ghaiAmount,
    type: 'credit',
    product: reason,
    tx_signature: sourceId,
  })

  if (txErr) {
    const code = (txErr as { code?: string }).code
    if (code === '23505') {
      // Already credited — return current balance without changing it.
      const { data: existing } = await supabaseAdmin
        .from('user_credits')
        .select('ghai_balance_platform')
        .eq('user_id', user.id)
        .maybeSingle()
      return NextResponse.json({
        success: true,
        already_credited: true,
        new_balance_ghai: existing?.ghai_balance_platform ?? 0,
      })
    }
    return NextResponse.json({ error: txErr.message }, { status: 500 })
  }

  const { data: existing } = await supabaseAdmin
    .from('user_credits')
    .select('ghai_balance_platform')
    .eq('user_id', user.id)
    .maybeSingle()

  const newBalance = (existing?.ghai_balance_platform ?? 0) + ghaiAmount

  if (!existing) {
    await supabaseAdmin.from('user_credits').insert({
      user_id: user.id,
      ghai_balance_platform: newBalance,
    })
  } else {
    await supabaseAdmin
      .from('user_credits')
      .update({ ghai_balance_platform: newBalance, updated_at: new Date().toISOString() })
      .eq('user_id', user.id)
  }

  return NextResponse.json({ success: true, new_balance_ghai: newBalance })
}
