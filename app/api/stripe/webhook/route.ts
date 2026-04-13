// app/api/stripe/webhook/route.ts
// Void Chat — Stripe Webhook Handler

import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/client';
import { updateSubscriptionStatus } from '@/lib/stripe/subscription';
import type Stripe from 'stripe';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!.trim()
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Webhook verification failed';
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = typeof subscription.customer === 'string'
          ? subscription.customer
          : subscription.customer.id;

        const status = subscription.status === 'active' ? 'active'
          : subscription.status === 'past_due' ? 'past_due'
          : subscription.status === 'canceled' ? 'cancelled'
          : 'none';

        // current_period_end moved to items in Stripe v17+; fall back via cast
        const periodEnd = (subscription as unknown as Record<string, unknown>).current_period_end as number | undefined
          ?? subscription.items?.data?.[0]?.current_period_end;
        const expiresAt = periodEnd
          ? new Date(periodEnd * 1000).toISOString()
          : null;

        await updateSubscriptionStatus(customerId, subscription.id, status, expiresAt);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = typeof subscription.customer === 'string'
          ? subscription.customer
          : subscription.customer.id;

        await updateSubscriptionStatus(customerId, subscription.id, 'cancelled', null);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = typeof invoice.customer === 'string'
          ? invoice.customer
          : invoice.customer?.id || '';

        // invoice.subscription moved in Stripe v17+
        const invoiceAny = invoice as unknown as Record<string, unknown>;
        const invoiceSub = invoiceAny.subscription as string | { id: string } | undefined;
        if (customerId && invoiceSub) {
          const subId = typeof invoiceSub === 'string' ? invoiceSub : invoiceSub.id;
          await updateSubscriptionStatus(customerId, subId, 'past_due', null);
        }
        break;
      }

      default:
        // Unhandled event type — ignore
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Webhook processing error';
    console.error('Stripe webhook error:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
