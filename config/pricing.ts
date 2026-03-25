// config/pricing.ts
// Void Chat — Pricing Configuration
// ALL prices live here. NEVER hardcode prices in components or API routes.

export const FREE_TIER = {
  messagesPerDay: 10,
  resetTimeUTC: '00:00', // midnight UTC
  allowedModels: ['claude-sonnet', 'gpt-4o-mini', 'gemini-flash'], // free tier = budget models only
} as const;

export const STRIPE_PRO = {
  pricePerMonth: 500, // $5.00 in cents
  unlimitedStandardModels: true,
  premiumModelsRequireGHAI: true, // Opus etc. still cost GHAI even for Pro subs
  stripePriceId: process.env.STRIPE_PRICE_ID_PRO || '',
} as const;

export const GHAI_DISCOUNT_PERCENT = 15; // GHAI payments are 15% cheaper than Stripe equivalent

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
