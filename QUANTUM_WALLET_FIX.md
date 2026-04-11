# QUANTUM_WALLET_FIX.md — Claude Code Task

## Context
voidexa.com at C:\Users\Jixwu\Desktop\voidexa
Quantum chat page: /quantum/chat
Backend: quantum-production-dd9d.up.railway.app (NEVER localhost)
Supabase: ihuljnekxkyqgroklurp
Admin/tester email: ceo@voidexa.com (exempt from payment)

## What Was Just Built (April 11)
- user_wallets table (Supabase) — balance_usd, total_deposited, total_spent
- wallet_transactions table — deposit/deduction/refund tracking
- quantum_sessions table — question, mode, cost, customer_price, providers
- WalletBar component — shows balance + $5/$10/$25/$50 Stripe top-up buttons
- ChatHistorySidebar — session list + load old sessions
- Balance check before session + admin/tester exemption
- Auto-deduct after session
- SessionBar text overlap fix
- Admin stats endpoint GET /api/admin/stats
- Stripe webhook at /api/wallet/webhook (checkout.session.completed)

## Problem 1 — WalletBar Not Visible
The WalletBar component was built but NOT wired into the Quantum chat layout.
Find the WalletBar component in the project. Add it visibly in the /quantum/chat page layout — either in the sidebar or as a top bar showing:
- Current USD balance
- Top-up buttons ($5 / $10 / $25 / $50)
- "Admin / Tester — Free Access" badge for exempt users

## Problem 2 — Horizontal Scroll Bug
The Quantum chat page content is wider than the viewport, causing horizontal scrolling.
Fix: Set overflow-x: hidden on the main container. Check all child elements for fixed widths exceeding viewport. Ensure the sidebar + main content area respect max-width and don't overflow. The layout must fit within the browser window without any horizontal scroll.

## Rules
1. Git backup first: git add -A && git commit -m "pre-wallet-fix backup"
2. Fix BOTH problems
3. npm run build — fix ALL errors
4. Git commit: "fix: wallet bar visible + horizontal scroll fix"
5. npx vercel --prod
6. Do NOT touch the backend API or Supabase tables
7. Do NOT change any pricing logic
8. Build everything in ONE run — no stopping for user input
