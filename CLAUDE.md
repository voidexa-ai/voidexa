# CLAUDE.md — Ghost AI Chat MVP (Phase 2)

## Project Context
This is Phase 2 of the voidexa platform (voidexa.com).
Phase 1 is COMPLETE: Supabase auth, wallet connection, waitlist, profiles, 10 tables with RLS.
Phase 2 builds the Ghost AI Chat MVP — the first revenue-generating product.

**Location**: C:\Users\Jixwu\Desktop\voidexa
**Framework**: Next.js 14 + React + Tailwind + ShadcnUI
**Backend**: Supabase (project: ihuljnekxkyqgroklurp, EU region, free tier)
**Hosting**: Vercel (frontend) + Supabase Cloud (backend)
**Blockchain**: Solana (GHAI SPL token)
**GHAI Contract**: Ch8Ek9PTbzSGdL4EWHC2pQfPq2vTseiCPjeZsAZLx5gK

## STRICT RULES
1. NEVER expose API keys in client-side code. All provider calls go through Next.js API routes.
2. NEVER advertise GHAI as an investment. It is a utility token.
3. ALWAYS show "Powered by [Provider] — orchestrated by voidexa" on every AI response.
4. ALWAYS git commit before and after major changes.
5. ALL new Supabase tables MUST have Row Level Security enabled.
6. NO async frameworks beyond what Next.js provides. No Redis, no queues, no workers for v1.
7. Dry-run/test mode MUST exist for GHAI transactions before going live.
8. All prices in a config file, NEVER hardcoded in components.
9. Mobile-responsive from day one. Dark theme matching voidexa space aesthetic.
10. Every API route must validate auth via Supabase session. No anonymous access to chat.

## Tech Stack (locked)
- Next.js 14 (App Router)
- React 18
- Tailwind CSS
- ShadcnUI components
- @supabase/supabase-js + @supabase/ssr
- @solana/web3.js + @solana/wallet-adapter
- Stripe (stripe + @stripe/stripe-js)
- AI SDKs: @anthropic-ai/sdk, openai, @google/generative-ai

## Architecture Overview

### Database (Supabase — new tables for Phase 2)
- `chat_conversations` — user's chat sessions with provider/model info
- `chat_messages` — individual messages with token tracking and GHAI cost
- `user_credits` — free tier tracking, GHAI platform balance, Stripe subscription status

### API Routes (Next.js server-side)
- `/api/chat/send` — POST: auth check → credit check → provider API call → stream response → log message → deduct credits
- `/api/chat/conversations` — GET: list user's conversations. POST: create new. DELETE: remove.
- `/api/chat/history/[conversationId]` — GET: fetch messages for a conversation
- `/api/stripe/checkout` — POST: create Stripe checkout session for $5/mo Pro plan
- `/api/stripe/webhook` — POST: handle Stripe subscription events
- `/api/ghai/deposit` — POST: verify on-chain GHAI transfer, credit user's platform balance
- `/api/ghai/balance` — GET: return user's GHAI platform balance + on-chain wallet balance

### Frontend Pages
- `/ghost-ai/chat` — main chat interface (protected)
- `/ghost-ai/chat/[conversationId]` — specific conversation view
- `/ghost-ai/pricing` — pricing tiers and comparison
- `/admin/ghost-ai` — admin dashboard (role=admin only)

### Key Components
- `ChatSidebar` — conversation list, new chat, provider picker
- `ChatArea` — message display with streaming, markdown rendering
- `ChatInput` — text input with model selector and send button
- `CreditDisplay` — shows remaining free messages OR GHAI balance OR Pro status
- `ProviderBadge` — "Powered by X — orchestrated by voidexa" under each AI message
- `DepositModal` — GHAI deposit flow with wallet popup
- `PricingCard` — tier comparison cards
- `UpgradePrompt` — shown when free tier exhausted

## Pricing Config
All pricing lives in `src/config/pricing.ts`. Never hardcode prices.

```
Free tier: 10 messages/day, resets midnight UTC
GHAI pricing:
  claude-sonnet: 1 GHAI
  claude-opus: 5 GHAI
  gpt-4o: 2 GHAI
  gpt-4o-mini: 1 GHAI
  gemini-pro: 2 GHAI
  gemini-flash: 1 GHAI
Stripe Pro: $5/month (unlimited standard models, premium models still cost GHAI)
GHAI discount: 15% cheaper than Stripe equivalent
```

## GHAI Token Integration
Phase 2 uses a PLATFORM CREDIT system (not per-message on-chain transactions):
1. User clicks "Deposit GHAI" → wallet popup → sends GHAI to voidexa receiver wallet
2. Supabase Edge Function or API route verifies the on-chain transaction
3. `user_credits.ghai_balance_platform` is credited
4. Each message deducts from platform balance
5. Per-message on-chain tx is a FUTURE optimization (not Phase 2)

## Streaming
AI responses stream via Server-Sent Events (SSE) from `/api/chat/send`.
Frontend uses EventSource or fetch with ReadableStream to display tokens as they arrive.
Streaming indicator shows while response is generating.

## Error Handling
- Provider API failure → show user-friendly error, don't charge credits
- Insufficient credits → show upgrade prompt (deposit GHAI or subscribe)
- Wallet not connected → prompt to connect before GHAI operations
- Stripe webhook failure → log error, retry logic
- Rate limiting → 60 messages/minute per user max

## File Structure (Phase 2 additions)
```
src/
  app/
    ghost-ai/
      chat/
        page.tsx                    # main chat page
        [conversationId]/
          page.tsx                  # specific conversation
        layout.tsx                  # chat layout with sidebar
      pricing/
        page.tsx                    # pricing page
    admin/
      ghost-ai/
        page.tsx                    # admin dashboard
    api/
      chat/
        send/
          route.ts                  # provider bridge + streaming
        conversations/
          route.ts                  # CRUD conversations
        history/
          [conversationId]/
            route.ts                # fetch messages
      stripe/
        checkout/
          route.ts                  # create checkout session
        webhook/
          route.ts                  # handle Stripe events
      ghai/
        deposit/
          route.ts                  # verify on-chain deposit
        balance/
          route.ts                  # get user balance
  components/
    ghost-ai/
      ChatSidebar.tsx
      ChatArea.tsx
      ChatInput.tsx
      CreditDisplay.tsx
      ProviderBadge.tsx
      DepositModal.tsx
      UpgradePrompt.tsx
      MessageBubble.tsx
      StreamingIndicator.tsx
      ModelSelector.tsx
      ConversationList.tsx
    pricing/
      PricingCard.tsx
      PricingTable.tsx
    admin/
      GhostAiStats.tsx
      ProviderCostTracker.tsx
      UsageChart.tsx
  config/
    pricing.ts                      # all pricing config
    providers.ts                    # provider/model definitions
    constants.ts                    # GHAI contract, receiver wallet, limits
  lib/
    providers/
      anthropic.ts                  # Claude API wrapper
      openai.ts                     # OpenAI API wrapper
      google.ts                     # Gemini API wrapper
      types.ts                      # shared provider types
    credits/
      check.ts                      # credit validation logic
      deduct.ts                     # deduct credits after message
      free-tier.ts                  # free tier reset logic
    ghai/
      verify-deposit.ts             # on-chain tx verification
      balance.ts                    # read SPL token balance
    stripe/
      client.ts                     # Stripe client init
      subscription.ts               # subscription helpers
    supabase/
      chat-queries.ts               # DB queries for chat
      credit-queries.ts             # DB queries for credits
  types/
    chat.ts                         # chat-related TypeScript types
    credits.ts                      # credit/billing types
    providers.ts                    # provider/model types
supabase/
  migrations/
    phase2_chat_tables.sql          # SQL for new tables + RLS
    phase2_rls_policies.sql         # RLS policies
```

## Build Order
1. Database: Run migrations for new tables + RLS
2. Config: pricing.ts, providers.ts, constants.ts
3. Types: All TypeScript type definitions
4. Lib: Provider wrappers, credit logic, GHAI verification
5. API Routes: /api/chat/*, /api/ghai/*, /api/stripe/*
6. Components: Chat UI components
7. Pages: /ghost-ai/chat, /ghost-ai/pricing, /admin/ghost-ai
8. Test: End-to-end flow with free tier

## Environment Variables Needed
```
# Existing (Phase 1)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# New for Phase 2
ANTHROPIC_API_KEY=
OPENAI_API_KEY=
GOOGLE_AI_API_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_PRICE_ID_PRO=              # Stripe price ID for $5/mo plan
GHAI_RECEIVER_WALLET=             # voidexa's Solana wallet for deposits
SOLANA_RPC_URL=                   # Helius or QuickNode RPC
```

## What Is NOT In Phase 2
- Quantum (Phase 6)
- Trading Hub (Phase 3)
- Node System (Phase 4)
- Competitions (Phase 5)
- Comlink (Phase 9)
- Referrals / Achievements (Phase 7)
- Copy-trading (Phase 10)
- Per-message on-chain GHAI transactions (future optimization)
- Image/file upload in chat
- Chat sharing / public conversations
- Conversation search
