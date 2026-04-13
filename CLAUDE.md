## READ THESE FIRST
- Read docs/STAR_SYSTEM_SPEC.md for the complete voidexa star system ecosystem design (visual architecture, economic engine, data model, build phases).

## PRODUCTION — QUANTUM ER LIVE
- Backend: https://quantum-production-dd9d.up.railway.app
- Frontend: https://voidexa.com/quantum/chat (Vercel)
- ALDRIG test på localhost. ALDRIG foreslå dev server. Alt er production.
- Deploy backend: git push (Railway auto-deployer)
- Deploy frontend: cd C:\Users\Jixwu\Desktop\voidexa && npx vercel --prod
- Port 8080. httpx<0.28. Guest sessions tilladt.
- Ejer: Jix (IKKE Jimmi/Jimmy). Virksomhed: voidexa, CVR 46343387.

## WORKFLOW REGLER
- ALDRIG start building før Jix bekræfter planen
- ALDRIG troubleshoot manuelt — fix selv
- ALDRIG foreslå pauser eller at stoppe
- Én kommando = én build. Byg ALT i én session
- Git backup FØR store ændringer
- Font regler: body 16px min, labels 14px min, opacity 0.5 min
- Ved AFSLUTNING af HVER session: opdater denne CLAUDE.md med hvad der blev bygget/ændret

## Session 2026-04-11: Quantum UI Fixes (11 fixes)
### Frontend (voidexa)
- SessionBar: shows backend final cost on session_complete, min-width 200px, no text overlap
- CostSummaryStrip: customer pricing (2.5x standard / 3.5x deep, min $0.05/$0.25), market price = 10x (strikethrough), savings %
- Follow-up label: "+$0.005 per follow-up" (was "~$0.005")
- QuantumSSEEvent: added kcp_savings field
- Auth guard: /quantum/chat requires Supabase login, shows sign-in prompt for anonymous users

### Backend (quantum, webui branch)
- Fix session DB bug: event type "complete" → "session_complete" in sessions.py — sessions now save to DB
- KCP-90 savings: kcp_savings included in session_complete SSE event
- Language matching: ALL provider system prompts now include "Always respond in the same language as the user's question"
- Admin stats: GET /api/sessions/admin/stats returns total sessions, tokens, cost, per-user breakdowns

### Manual step needed
- Fix 11: Add TESTER_EMAILS=tom@voidexa.com in Railway dashboard env variables

## Session 2026-04-11 (2): Debate Engine + Pricing Overhaul (10 fixes)
### Backend (quantum, webui branch)
- Question classifier: quantum/classifier.py — keyword-based A/B/C (factual/analytical/creative)
- Role-based debate: factual → Perplexity+Gemini first; creative → Claude+GPT first; analytical → all
- Self-eval exclusion: round 2/3 prompts exclude each provider's own response
- Anti-filler prompts: no greetings, no self-praise, every sentence must add value
- Compiled synthesis: after final round, Claude compiles all positions into one answer ({"type":"synthesis"})
- KCP-90 round context fix: compressed text no longer fed to AIs (plain text only, KCP for metrics)

### Frontend (voidexa)
- SessionBar: shows CUSTOMER price (not API cost) — live ticker uses 2.5x/3.5x multiplier
- Savings label: "You saved ~XX% vs market price" (removed KCP-90 branding from customer-facing text)
- Synthesis display: "Quantum Consensus" card shown above debate, individual messages in collapsible section
- Follow-up: "+$0.005 per follow-up question"

## Session 2026-04-11 (3): Wallet System + Chat History + Session Bar Fix
### Supabase (ihuljnekxkyqgroklurp)
- Migration: user_wallets, wallet_transactions, quantum_sessions tables with RLS
- Admin RLS policies for ceo@voidexa.com
- Indexes on user_id and created_at

### Frontend (voidexa)
- lib/supabase-admin.ts: service-role client for server-side API routes
- Wallet API: GET /api/wallet (balance), POST /api/wallet/topup (Stripe Checkout), POST /api/wallet/deduct, POST /api/wallet/webhook
- WalletBar component: balance display + $5/$10/$25/$50 top-up modal via Stripe
- Pre-session balance check: blocks session if insufficient, shows "Top Up Now" prompt
- Admin/tester exemption: ceo@voidexa.com and tom@voidexa.com skip wallet checks
- Auto-deduct customer price from wallet on session_complete
- Chat history: sessions saved to quantum_sessions on start, updated on complete (messages, synthesis, cost, tokens, providers, duration)
- ChatHistorySidebar: left sidebar with session list, click to load old session (read-only), "New Debate" button
- SessionBar fix: status/timer/price now stacked vertically (no text overlap), min-width 240px
- Admin stats: GET /api/admin/stats — wallet totals, sessions, profit, top users, recent sessions

### Manual steps needed
- Add STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET to Vercel env variables
- Create Stripe webhook pointing to https://voidexa.com/api/wallet/webhook (event: checkout.session.completed)
- Optionally add STRIPE_WALLET_WEBHOOK_SECRET if using a separate webhook from the subscription one

## Session 2026-04-12: Quantum Follow-up Upgrade
### Frontend (voidexa)
- QuantumDebatePanel: added `followUpMode` state ('claude_only' | 'all_providers' | 'challenge' | 'scaffold')
- FollowUpToggles pill-buttons below follow-up input: "All Providers", "Challenge", "Scaffold"
  - Inactive = outline only, Active = glowing purple/indigo gradient
  - Hover shows tooltip popup (280px, 14px text, dark glass)
  - Challenge/Scaffold auto-enable All Providers, mutually exclusive
  - Toggling All Providers off resets to claude_only
- Follow-up submission routing:
  - claude_only (default): existing askFollowUp API (+$0.005)
  - all_providers/challenge/scaffold: composes context block from previous synthesis + optional challenge/scaffold prefix + user's q, then calls handleSubmit to start a new full debate (costs same as new session)
- Challenge prefix: "The user challenges your previous conclusions. Re-examine... Perplexity: search for sources that CONTRADICT..."
- Scaffold prefix: generates CLAUDE.md + SKILL.md + file structure + build command, provider-specialized (Claude=architecture, GPT=spec, Gemini=alternatives, Perplexity=libraries)
- Submit button label + placeholder adapt to active mode; cost label switches between "+$0.005 per follow-up" and "Costs same as a new session"
- Follow-up mode resets to claude_only on new debate

## Session 2026-04-12 (2): Scaffold Mode Standalone
- Moved "Scaffold" toggle out of follow-up toggles into QuantumInput (always visible next to mode dropdown)
- QuantumInput: added `scaffoldMode` + `onScaffoldToggle` props, placeholder switches to "Describe what you want to build...", submit button becomes "Build Scaffold" when active
- QuantumDebatePanel: `scaffoldMode` state, wraps question with SCAFFOLD_PREFIX on submit, resets after submit
- Follow-up toggles now only "All Providers" and "Challenge" (scaffold removed — it's a pre-question mode, not follow-up)

## Session 2026-04-12 (3): Scaffold Downloads
- QuantumDebatePanel tracks `sessionWasScaffold` when scaffold-mode submit fires
- After synthesis renders, shows a `ScaffoldDownloads` card (glassmorphism, indigo/teal gradient) with buttons:
  - Download CLAUDE.md, Download SKILL.md, Download Build Command (shown only when section is detected)
  - Download Complete Scaffold (always, primary button)
- Parser `extractScaffoldSection` finds markdown/bare headings for CLAUDE.md / SKILL.md / Build Command and slices up to the next major heading (#, or sibling labels like SKILL.md/Build Command/File Structure)
- Downloads via Blob + createObjectURL, no server round-trip
- Fallback message if no sections detected — user still gets full scaffold

## Session 2026-04-13: Stripe Wallet Top-Up Recovery
### Problem
- Wallet top-ups completed in Stripe but balance stayed at $0 — webhook was not crediting
- Earlier Stripe checkout errors: `ERR_INVALID_CHAR` on Authorization header, then `success_url` "Not a valid URL"
- Vercel env vars had trailing `\n` / `\r\n` on multiple values (`NEXT_PUBLIC_SITE_URL`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_PRICE_ID_PRO`) from paste artifacts

### Root Cause
- `STRIPE_WEBHOOK_SECRET` in Vercel production was set to the value of `STRIPE_SECRET_KEY` (`sk_test_...`) instead of a `whsec_...` signing secret → every Stripe delivery failed signature verification with 400, Stripe marked event as pending indefinitely

### Defensive code fix — `.trim()` on all Stripe/site env reads
- `lib/stripe/client.ts:8` — `STRIPE_SECRET_KEY`
- `app/api/wallet/topup/route.ts:26` — `NEXT_PUBLIC_SITE_URL` (extracted into `siteUrl` const)
- `app/api/wallet/webhook/route.ts:21` — `STRIPE_WALLET_WEBHOOK_SECRET || STRIPE_WEBHOOK_SECRET`
- `app/api/stripe/webhook/route.ts:25` — `STRIPE_WEBHOOK_SECRET`
- `app/api/stripe/checkout/route.ts:27` — `NEXT_PUBLIC_SITE_URL`
- `config/pricing.ts:11` — `STRIPE_PRICE_ID_PRO`

### Infrastructure fix
- Created new Stripe webhook endpoint `we_1TLluLDVfBjAC4z8878uAbqXl` → URL `https://voidexa.com/api/wallet/webhook`, event `checkout.session.completed`
- Captured new signing secret (`whsec_hR4n...`, 38 chars) and replaced `STRIPE_WEBHOOK_SECRET` in Vercel production via `vercel env rm` + `vercel env add`
- Deleted old broken endpoint `we_1TLjO2DVfBjAC4z8MFCdFtqh`
- Redeployed with `npx vercel --prod`

### Missed top-up recovery
- User `fc0f1632-9724-42c8-a31d-d05a466e7588` had a successful $5 Stripe test payment (session `cs_test_a1M4WKJM78QstRIlLm1ktnbWIpMLqFDmHgAFAappFZYD0ji3y1JnfR2bs9`) but wallet = $0
- Credited directly via Supabase SQL: `balance_usd` and `total_deposited_usd` += $5, inserted `wallet_transactions` row with the `stripe_session_id` for idempotency (prevents double-credit if Stripe replays)

### Debugging workflow reference
- `npx vercel logs voidexa.com --environment production --since 4h --expand --no-follow --query "path"` — filtered prod logs
- `npx vercel logs ... --status-code 400` — find 4xx only (must be specific code, not `4xx`)
- `npx vercel env pull .env.prod-check --environment=production --yes` — inspect prod env values for hidden chars (delete file after!)
- Direct Stripe API for webhook management: `curl -u $STRIPE_SECRET_KEY: https://api.stripe.com/v1/webhook_endpoints` (list/create/delete)
- Stripe API doesn't expose existing webhook signing secrets — only returned on endpoint creation. To "rotate": delete + recreate.
# ============================================
# APPEND THIS TO THE BOTTOM OF YOUR EXISTING CLAUDE.md
# in C:\Users\Jixwu\Desktop\voidexa\CLAUDE.md
# ============================================

---

## Star System Ecosystem

### Required reading before any star system work
Read these files before touching anything related to star map, planets, claiming, ecosystem, or inter-planet features:
- `docs/STAR_SYSTEM_SPEC.md` — Complete ecosystem design (visual + economic + data model + build phases)
- `docs/SKILL_STAR_SYSTEM.md` — Build rules and priorities for star system work

### Key architecture decisions
- The EXISTING star map on the homepage is Level 2 for voidexa (voidexa's internal system)
- Level 1 (Galaxy View) is a NEW parent view showing all company planets
- Level 2 is reusable per company — same Three.js mechanics, different data
- All commerce in GHAI — no second token
- Service Mesh is voluntary for planet owners
- Build everything, enable features based on planet count thresholds (see STAR_SYSTEM_SPEC.md Phase 5-10)
- Claim Your Planet page at /claim-your-planet explains the full ecosystem value proposition

### Supabase tables for star system
Tables defined in STAR_SYSTEM_SPEC.md Part 3: companies, industries, sectors, company_services, trade_routes, gravity_score_snapshots, gravity_events, planet_claim_leads, company_tags.

### Non-negotiable rules
1. Never show 500 labeled planets at once
2. Current star map is preserved as Level 2 for voidexa
3. Mobile prioritizes search/list over 3D
4. First 10 planets onboarded personally by Jix
5. Match existing dark space aesthetic exactly
6. Minimum font 16px body, 14px labels

## Session 2026-04-13 (2): Claim Your Planet rebuild (full ecosystem)
### Frontend (voidexa)
- Split /claim-your-planet into 11 section components in app/claim-your-planet/components/
  - Hero, WhatYouGet, Ecosystem, PioneerRewards, PioneerSlots, Pricing, GravityScore, InterPlanetCommerce, Governance, WhyJoinEarly, CTA
- shared.tsx (fadeUp, ShimmerText, sectionHeading/Sub, glassCard) used across sections
- Hero copy: "You're not renting a page. You're building a sovereign system inside the voidexa galaxy."
- PioneerRewards: tiered cards (1-10: 10M/2x/12mo, 11-25: 7M/1.5x/6mo, 26-50: 5M/1x/3mo) + vesting (20% immediate, 80% over 18 months) + 2% Pioneer Royalties
- PioneerSlots: 10 dashed circles, "X of 10 Pioneer slots remaining"
- Pricing: $500 deposit (GHAI 15% discount) + $50/mo, self-sustaining at critical mass
- GravityScore: what it measures (transactions/services/tenure) vs affects (size/ranking/governance)
- InterPlanetCommerce: 70/15/15 split cards (provider / routing / voidexa)
- Governance: vote weight = Gravity Score × Pioneer multiplier
- WhyJoinEarly: 4 FOMO points, "Planet #50 will wish they were Planet #5"
- CTA: mailto:contact@voidexa.com, 10 Pioneer Slots badge
- Deployed via npx vercel --prod (dpl_Fr9Br2pYfx3KNArtuEQsdHXyT3cJ)
