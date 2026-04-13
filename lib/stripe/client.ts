// lib/stripe/client.ts
// Void Chat — Stripe Client

import Stripe from 'stripe';

let _stripe: Stripe | null = null;
export function getStripe(): Stripe {
  if (!_stripe) _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!.trim(), { apiVersion: '2026-02-25.clover' });
  return _stripe;
}
// Named export for backwards compat — resolved lazily via getter
export const stripe: Stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return (getStripe() as unknown as Record<string | symbol, unknown>)[prop];
  },
});
