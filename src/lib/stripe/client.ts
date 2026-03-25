// src/lib/stripe/client.ts
// Ghost AI Chat — Stripe Client

import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});
