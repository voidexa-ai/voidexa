// src/lib/stripe/subscription.ts
// Ghost AI Chat — Stripe Subscription Helpers

import { createClient } from '@supabase/supabase-js';
import { stripe } from './client';
import type { SubscriptionStatus } from '@/types/credits';

/**
 * Create or get a Stripe customer for a user.
 */
export async function getOrCreateStripeCustomer(
  userId: string,
  email: string
): Promise<string> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Check if user already has a Stripe customer ID
  const { data: credits } = await supabase
    .from('user_credits')
    .select('stripe_customer_id')
    .eq('user_id', userId)
    .single();

  if (credits?.stripe_customer_id) {
    return credits.stripe_customer_id;
  }

  // Create new Stripe customer
  const customer = await stripe.customers.create({
    email,
    metadata: { supabase_user_id: userId },
  });

  // Save customer ID
  await supabase
    .from('user_credits')
    .update({ stripe_customer_id: customer.id, updated_at: new Date().toISOString() })
    .eq('user_id', userId);

  return customer.id;
}

/**
 * Update subscription status in Supabase after Stripe webhook event.
 */
export async function updateSubscriptionStatus(
  stripeCustomerId: string,
  subscriptionId: string,
  status: SubscriptionStatus,
  expiresAt: string | null
): Promise<void> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  await supabase
    .from('user_credits')
    .update({
      stripe_subscription_id: subscriptionId,
      subscription_status: status,
      subscription_expires_at: expiresAt,
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_customer_id', stripeCustomerId);
}
