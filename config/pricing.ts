// config/pricing.ts
// Void Chat — Pricing Configuration
// ALL prices live here. NEVER hardcode prices in components or API routes.

// Free tier is intentionally removed. Platform requires GHAI balance or Pro subscription.

export const STRIPE_PRO = {
  pricePerMonth: 500, // $5.00 in cents
  unlimitedStandardModels: true,
  premiumModelsRequireGHAI: true, // Opus etc. still cost GHAI even for Pro subs
  stripePriceId: (process.env.STRIPE_PRICE_ID_PRO || '').trim(),
} as const;

export const GHAI_DISCOUNT_PERCENT = 15; // GHAI payments are 15% cheaper than Stripe equivalent

// USD cost per message by provider + model (displayed alongside GHAI cost)
export const USD_COSTS: Record<string, string> = {
  'claude-sonnet': '$0.01',
  'claude-opus':   '$0.02',
  'gpt-4o':        '$0.02',
  'gpt-4o-mini':   '$0.01',
  'gemini-pro':    '$0.02',
  'gemini-flash':  '$0.01',
} as const;

// GHAI cost per message by provider + model
// These are the BASE costs. Adjust as provider pricing changes.
export const GHAI_COSTS: Record<string, number> = {
  // Claude
  'claude-sonnet': 1,
  'claude-opus': 5,
  // OpenAI
  'gpt-4o': 2,
  'gpt-4o-mini': 1,
  // Google
  'gemini-pro': 2,
  'gemini-flash': 1,
} as const;

// Models that require GHAI even for Pro subscribers
export const PREMIUM_MODELS = ['claude-opus'] as const;

// Rate limiting
export const RATE_LIMITS = {
  messagesPerMinute: 60,
  messagesPerHour: 500,
} as const;
