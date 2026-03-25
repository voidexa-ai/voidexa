// app/api/stripe/checkout/route.ts
// Void Chat — Create Stripe Checkout Session for Pro subscription

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { stripe } from '@/lib/stripe/client';
import { getOrCreateStripeCustomer } from '@/lib/stripe/subscription';
import { STRIPE_PRO } from '@/config/pricing';

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !user.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const customerId = await getOrCreateStripeCustomer(user.id, user.email);

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [
        {
          price: STRIPE_PRO.stripePriceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://voidexa.com'}/ghost-ai/chat?subscription=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://voidexa.com'}/ghost-ai/pricing?subscription=cancelled`,
      metadata: {
        supabase_user_id: user.id,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Stripe error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
