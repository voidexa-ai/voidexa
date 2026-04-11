# QUANTUM WALLET + CHAT HISTORY + SESSION BAR FIX
# Place in C:\Users\Jixwu\Desktop\voidexa\
# Run: claude --dangerously-skip-permissions "Read QUANTUM_WALLET_BUILD.md. Execute ALL steps in order. Git backup both repos first. Build backend first, then frontend. Deploy backend: cd C:\Users\Jixwu\Projects\quantum && git add -A && git commit -m 'feat: wallet system, chat history API, session bar fix' && git push. Deploy frontend: npx vercel --prod. Delete this file after completion."

---

## CRITICAL CONTEXT
- Supabase project ID: ihuljnekxkyqgroklurp (EU region)
- Supabase is already configured in voidexa (NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY exist)
- Auth is already implemented (Fix 9 from previous build)
- Frontend: C:\Users\Jixwu\Desktop\voidexa (Next.js, Vercel)
- Backend: C:\Users\Jixwu\Projects\quantum (FastAPI, Railway)
- Production frontend: https://voidexa.com
- Production backend: https://quantum-production-dd9d.up.railway.app
- Admin email: ceo@voidexa.com
- Tester email: tom@voidexa.com
- Deploy frontend: npx vercel --prod
- Deploy backend: git push (Railway auto-deploys)

---

## PART 1 — SUPABASE DATABASE TABLES

### Step 1: Create wallet table
Connect to Supabase and run this SQL migration:

```sql
-- Wallet / user credits
CREATE TABLE IF NOT EXISTS user_wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  balance_usd DECIMAL(10,4) NOT NULL DEFAULT 0.0000,
  total_deposited_usd DECIMAL(10,4) NOT NULL DEFAULT 0.0000,
  total_spent_usd DECIMAL(10,4) NOT NULL DEFAULT 0.0000,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Deposit/transaction history
CREATE TABLE IF NOT EXISTS wallet_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('deposit', 'deduction', 'refund')),
  amount_usd DECIMAL(10,4) NOT NULL,
  description TEXT,
  stripe_session_id TEXT,
  quantum_session_id TEXT,
  balance_after DECIMAL(10,4) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Chat history / saved sessions
CREATE TABLE IF NOT EXISTS quantum_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  mode TEXT NOT NULL DEFAULT 'standard',
  question_type TEXT DEFAULT 'analytical',
  synthesis TEXT,
  messages JSONB DEFAULT '[]'::jsonb,
  cost_usd DECIMAL(10,4),
  customer_price_usd DECIMAL(10,4),
  tokens_used INTEGER,
  providers_used TEXT[],
  duration_seconds DECIMAL(8,1),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'complete', 'error')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quantum_sessions ENABLE ROW LEVEL SECURITY;

-- RLS policies: users can only see their own data
CREATE POLICY "Users see own wallet" ON user_wallets FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users see own transactions" ON wallet_transactions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users see own sessions" ON quantum_sessions FOR ALL USING (auth.uid() = user_id);

-- Admin policies (ceo@voidexa.com can see everything)
CREATE POLICY "Admin sees all wallets" ON user_wallets FOR SELECT USING (
  auth.jwt() ->> 'email' = 'ceo@voidexa.com'
);
CREATE POLICY "Admin sees all transactions" ON wallet_transactions FOR SELECT USING (
  auth.jwt() ->> 'email' = 'ceo@voidexa.com'
);
CREATE POLICY "Admin sees all sessions" ON quantum_sessions FOR SELECT USING (
  auth.jwt() ->> 'email' = 'ceo@voidexa.com'
);

-- Index for fast lookups
CREATE INDEX idx_wallet_user ON user_wallets(user_id);
CREATE INDEX idx_transactions_user ON wallet_transactions(user_id);
CREATE INDEX idx_sessions_user ON quantum_sessions(user_id);
CREATE INDEX idx_sessions_created ON quantum_sessions(created_at DESC);
```

Run this SQL via Supabase dashboard SQL editor or via the Supabase CLI. If you cannot connect to Supabase directly, create a migration file at `supabase/migrations/001_wallet_and_sessions.sql` and instruct the user to run it manually.

---

## PART 2 — FRONTEND: WALLET SYSTEM

### Step 2: Wallet API routes
Create these Next.js API routes:

**app/api/wallet/route.ts** — GET: returns user's current balance
- Query user_wallets table for current user (from Supabase auth)
- If no wallet exists, create one with balance 0
- Return { balance_usd, total_deposited_usd, total_spent_usd }

**app/api/wallet/topup/route.ts** — POST: creates Stripe Checkout session
- Accept { amount } in body (5, 10, 25, or 50 USD only)
- Create Stripe Checkout session in payment mode (not subscription)
- Product: "Quantum Wallet Top-up — $X"
- Success URL: /quantum/chat?topup=success
- Cancel URL: /quantum/chat?topup=cancelled
- Store user_id in Stripe metadata
- Return { checkout_url }

**app/api/wallet/webhook/route.ts** — POST: Stripe webhook
- Verify Stripe signature
- On checkout.session.completed:
  - Read amount and user_id from metadata
  - UPDATE user_wallets SET balance_usd = balance_usd + amount, total_deposited_usd = total_deposited_usd + amount
  - INSERT into wallet_transactions (type='deposit', amount, description='Stripe top-up', stripe_session_id, balance_after)

**app/api/wallet/deduct/route.ts** — POST: deduct after Quantum session
- Accept { amount_usd, quantum_session_id, description }
- Check balance >= amount
- If insufficient: return { error: 'insufficient_balance' }
- UPDATE user_wallets SET balance_usd = balance_usd - amount, total_spent_usd = total_spent_usd + amount
- INSERT into wallet_transactions (type='deduction', amount, quantum_session_id, balance_after)
- Return { new_balance }

IMPORTANT: Use Stripe from the existing Stripe MCP connection or install stripe package. The Stripe API key should already be in environment variables. If not, add STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET to .env.local and Vercel environment variables.

### Step 3: Wallet UI in Quantum chat
**File:** components/quantum/WalletBar.tsx (new component)

Create a wallet display bar that sits between the navbar and the chat area on the /quantum/chat page:
- Shows: "Balance: $X.XX" in green
- "Top Up" button that opens a modal with $5 / $10 / $25 / $50 options
- Each option redirects to Stripe Checkout
- If balance is $0.00: show warning "Add funds to use Quantum"

### Step 4: Pre-session balance check
**File:** components/quantum/QuantumDebatePanel.tsx

Before starting a new session (when user clicks Ask Quantum):
1. Check wallet balance via GET /api/wallet
2. If balance < estimated cost (Standard: $0.05, Deep: $0.25):
   - Show message: "Insufficient balance. Please top up your wallet."
   - Do NOT start the session
   - Show the Top Up modal
3. If balance is sufficient: proceed with session as normal
4. After session_complete: call POST /api/wallet/deduct with the customer_price

### Step 5: Exempt admin and testers
Emails ceo@voidexa.com and tom@voidexa.com skip the balance check and deduction. They can use Quantum for free. Check against a hardcoded list or the TESTER_EMAILS environment variable.

---

## PART 3 — FRONTEND: CHAT HISTORY

### Step 6: Save sessions to Supabase
**File:** components/quantum/QuantumDebatePanel.tsx

When a session starts (user clicks Ask Quantum):
- INSERT into quantum_sessions: user_id, question, mode, status='active'
- Store the returned session ID in React state

As messages stream in:
- Accumulate messages in state as they arrive (already happening)

On session_complete:
- UPDATE quantum_sessions SET status='complete', synthesis=..., messages=..., cost_usd=..., customer_price_usd=..., tokens_used=..., providers_used=..., duration_seconds=...

### Step 7: Chat history sidebar
**File:** components/quantum/ChatHistorySidebar.tsx (new component)

Create a sidebar on the LEFT side of the Quantum chat page (replace or sit above the current character ring sidebar):

Layout:
- Top section: "New Debate" button (clears chat, starts fresh)
- Below: scrollable list of previous sessions
- Each item shows: first 50 chars of question + date + mode badge (Standard/Deep)
- Clicking an item loads that session's messages and synthesis into the chat area
- Currently active session is highlighted

Data: Query quantum_sessions WHERE user_id = current user, ORDER BY created_at DESC, LIMIT 50

### Step 8: Load old session
When user clicks a previous session in the sidebar:
- Fetch the full session from Supabase (messages JSONB, synthesis)
- Display synthesis at top (same QUANTUM CONSENSUS card)
- Display messages below (same format as live debate)
- Show session summary (cost, tokens, time, providers)
- Hide the "Ask Quantum" input bar (it's a read-only view)
- Show a "New Debate" button to return to the chat input

---

## PART 4 — SESSION BAR TEXT FIX

### Step 9: Fix text overlap in SessionBar
**File:** components/quantum/SessionBar.tsx

The price text ($0.0853) overlaps with "Session Complete" text. The zero touches the "e" in Complete.

Fix: Add a clear separator between the status text and the price/timer area. Options:
- Increase min-width of the session bar to 240px
- Or reduce font-size of the timer/price to 12px
- Or put the status text ("Ready" / "Session Complete") on its own line, with timer and price below it, each on their own line:
  ```
  Session Complete
  2:28
  $0.0853
  ```
- All three lines centered, with adequate line-height (1.4)

---

## PART 5 — ADMIN DASHBOARD

### Step 10: Admin wallet overview
**File:** app/api/admin/stats/route.ts (new or extend existing)

Add endpoint that returns (only for ceo@voidexa.com):
- Total users with wallets
- Total deposited (sum of all deposits)
- Total spent (sum of all deductions)
- Total sessions run
- Total API cost vs total customer revenue (profit)
- Top users by spend
- Recent sessions list

This data feeds into the existing /control-plane dashboard later.

---

## BUILD & DEPLOY ORDER
1. Git backup BOTH repos
2. Run Supabase SQL migration (create tables)
3. Build frontend: wallet API routes, wallet UI, chat history sidebar, session saving, session bar fix
4. Run next build — fix any errors
5. Git commit: "feat: wallet system, chat history, session bar fix"
6. Deploy frontend: npx vercel --prod
7. Backend: no changes needed for this build (sessions already saved via existing API)
8. Delete this file

## ENVIRONMENT VARIABLES NEEDED (add to Vercel if missing)
- STRIPE_SECRET_KEY (from Stripe dashboard)
- STRIPE_WEBHOOK_SECRET (create webhook in Stripe pointing to https://voidexa.com/api/wallet/webhook)
- NEXT_PUBLIC_SUPABASE_URL (should already exist)
- NEXT_PUBLIC_SUPABASE_ANON_KEY (should already exist)
- SUPABASE_SERVICE_ROLE_KEY (for server-side operations — check if exists, add if not)
