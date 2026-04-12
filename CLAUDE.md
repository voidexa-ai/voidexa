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
