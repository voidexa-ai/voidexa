import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/client'
import { supabaseAdmin } from '@/lib/supabase-admin'
import type Stripe from 'stripe'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      (process.env.STRIPE_WALLET_WEBHOOK_SECRET || process.env.STRIPE_WEBHOOK_SECRET!).trim()
    )
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Webhook verification failed'
    return NextResponse.json({ error: msg }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const meta = session.metadata ?? {}

    // Only process wallet top-ups (not subscription checkouts)
    if (meta.wallet_topup !== 'true') {
      return NextResponse.json({ received: true })
    }

    const userId = meta.supabase_user_id
    const amount = parseFloat(meta.amount_usd || '0')

    if (!userId || amount <= 0) {
      return NextResponse.json({ error: 'Invalid metadata' }, { status: 400 })
    }

    // Ensure wallet exists
    await supabaseAdmin
      .from('user_wallets')
      .upsert({ user_id: userId }, { onConflict: 'user_id' })

    // Read current balance
    const { data: wallet } = await supabaseAdmin
      .from('user_wallets')
      .select('balance_usd, total_deposited_usd')
      .eq('user_id', userId)
      .single()

    const currentBalance = parseFloat(wallet?.balance_usd ?? '0')
    const currentDeposited = parseFloat(wallet?.total_deposited_usd ?? '0')
    const newBalance = currentBalance + amount

    // Update wallet
    await supabaseAdmin
      .from('user_wallets')
      .update({
        balance_usd: newBalance,
        total_deposited_usd: currentDeposited + amount,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)

    // Record transaction
    await supabaseAdmin
      .from('wallet_transactions')
      .insert({
        user_id: userId,
        type: 'deposit',
        amount_usd: amount,
        description: `Stripe top-up — $${amount}`,
        stripe_session_id: session.id,
        balance_after: newBalance,
      })
  }

  return NextResponse.json({ received: true })
}
