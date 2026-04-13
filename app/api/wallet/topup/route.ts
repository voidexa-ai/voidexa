import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { stripe } from '@/lib/stripe/client'

const ALLOWED_AMOUNTS = [5, 10, 25, 50]

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

  const { amount } = await req.json()
  if (!ALLOWED_AMOUNTS.includes(amount)) {
    return NextResponse.json({ error: 'Invalid amount. Choose $5, $10, $25, or $50.' }, { status: 400 })
  }

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://voidexa.com').trim()

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: `Quantum Wallet Top-up — $${amount}` },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      success_url: `${siteUrl}/quantum/chat?topup=success`,
      cancel_url: `${siteUrl}/quantum/chat?topup=cancelled`,
      metadata: {
        supabase_user_id: user.id,
        wallet_topup: 'true',
        amount_usd: String(amount),
      },
    })

    return NextResponse.json({ checkout_url: session.url })
  } catch (error) {
    console.error('[wallet/topup]', error)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
