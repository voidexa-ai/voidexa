import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase-admin'

const EXEMPT_EMAILS = ['ceo@voidexa.com', 'tom@voidexa.com']

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

  // Admin/tester bypass
  if (EXEMPT_EMAILS.includes(user.email ?? '')) {
    return NextResponse.json({ new_balance: 999, exempt: true })
  }

  const { amount_usd, quantum_session_id, description } = await req.json()
  if (!amount_usd || amount_usd <= 0) {
    return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
  }

  // Read current balance
  const { data: wallet } = await supabaseAdmin
    .from('user_wallets')
    .select('balance_usd, total_spent_usd')
    .eq('user_id', user.id)
    .single()

  const currentBalance = parseFloat(wallet?.balance_usd ?? '0')
  if (currentBalance < amount_usd) {
    return NextResponse.json({ error: 'insufficient_balance', balance: currentBalance }, { status: 402 })
  }

  const newBalance = currentBalance - amount_usd
  const currentSpent = parseFloat(wallet?.total_spent_usd ?? '0')

  // Update wallet
  await supabaseAdmin
    .from('user_wallets')
    .update({
      balance_usd: newBalance,
      total_spent_usd: currentSpent + amount_usd,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', user.id)

  // Record transaction
  await supabaseAdmin
    .from('wallet_transactions')
    .insert({
      user_id: user.id,
      type: 'deduction',
      amount_usd: amount_usd,
      description: description || 'Quantum session',
      quantum_session_id: quantum_session_id || null,
      balance_after: newBalance,
    })

  return NextResponse.json({ new_balance: newBalance })
}
