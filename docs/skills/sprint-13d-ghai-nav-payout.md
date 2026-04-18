# SPRINT 13D — HOME NAV + GHAI DISPLAY + AUTO-PAYOUT
## Skill file for Claude Code
## Location: docs/skills/sprint-13d-ghai-nav-payout.md

---

## SCOPE

Fix 5 concrete issues identified in Sprint 13c post-deploy audit:

1. **Home nav dropdown** — Home link currently goes to `/` (replays video). Users need shortcut to Quick Menu without video.
2. **Quick Menu route** — `/?menu=true` query param skips video, shows overlay directly.
3. **Global GHAI WalletBar** — currently only on `/quantum/chat`, balance shown in USD. Move to top nav globally, display as GHAI tokens (× 100 from USD).
4. **Shop GHAI prices** — shop products show `$3.00` etc. Convert to GHAI display (`300 GHAI`).
5. **Mission Board auto-payout** — players complete missions but GHAI is not auto-credited to wallet. Implement auto-payout on mission completion.

**NOT in scope** (separate future sprints):
- Creating Stripe GHAI pack products
- Shop product inventory audit (missing products, emoji placeholders)
- Card game balance and missing cards
- Star map visual redesign
- Game Battle Phase 4b completion

---

## CRITICAL CONTEXT

### Platform-GHAI economy (locked)
- Platform-GHAI = in-game V-Bucks style currency, ACTIVE
- **$1 USD = 100 GHAI** (fixed rate)
- Purely fictive, NO real-world value
- Separate from Crypto-GHAI (Solana token, on hold)

### Wallet system (already built, from Session 2026-04-11)
Existing wallet infrastructure in repo:
- `app/api/wallet/route.ts` — GET balance
- `app/api/wallet/topup/route.ts` — POST Stripe Checkout
- `app/api/wallet/deduct/route.ts` — POST deduct from balance
- `app/api/wallet/webhook/route.ts` — Stripe webhook handler
- `components/wallet/WalletBar.tsx` — currently on `/quantum/chat` only
- `lib/supabase-admin.ts` — service role client
- Supabase tables: `user_wallets`, `wallet_transactions`
- Admin/tester exemption: `ceo@voidexa.com`, `tom@voidexa.com`

**DO NOT rebuild any of this. Only modify display + add mission payout.**

### Visual standards
- Body text ≥16px, labels ≥14px, opacity ≥0.5
- All env vars `.trim()` defensively
- Deploy via `git push origin main` (Vercel auto-deploys)
- Font rules apply everywhere

---

## PRE-TASKS

1. `git tag backup/pre-sprint-13d-20260418`
2. `git push origin --tags`
3. `npm test` — baseline (expect 660+ from 13c)
4. Verify existing wallet files exist:
   - `Test-Path components/wallet/WalletBar.tsx`
   - `Test-Path app/api/wallet/route.ts`
5. HALT if wallet infrastructure is missing — report what's not found

---

## TASKS

### STEP 1 — Home nav dropdown

File: `components/layout/Nav.tsx` (or wherever top nav lives)

**1.1** Change Home link:
- Before: `href="/"`
- After: `href="/home"`

**1.2** Add hover dropdown to Home nav item (desktop) / tap-expand (mobile):

Dropdown options:
- "Main Page" → `/home`
- "Quick Menu" → `/?menu=true`

Match existing dropdown styling from Products and Universe dropdowns for visual consistency. Same transition, background, border, hover states.

**1.3** Keep all other nav items unchanged (Products, Universe, About).

### STEP 2 — Quick Menu route handler

File: `app/page.tsx`

Current flow: video plays → overlay fades in after video ends.

Add query param handler:
```typescript
'use client';
import { useSearchParams } from 'next/navigation';

export default function Home() {
  const searchParams = useSearchParams();
  const menuOnly = searchParams?.get('menu') === 'true';
  
  // ... existing state ...
  
  useEffect(() => {
    if (!menuOnly && shouldSkipIntro()) {
      router.replace('/starmap');
    }
  }, [menuOnly]);
  
  // If menuOnly, render backdrop + overlay immediately, no video
  if (menuOnly) {
    return (
      <main className="h-screen w-screen fixed inset-0 overflow-hidden">
        <img src={NEXT_PUBLIC_INTRO_BACKDROP_URL} className="fixed inset-0 w-full h-full object-cover" />
        <QuickMenuOverlay show={true} />
        <WebsiteCreationModal ... />
      </main>
    );
  }
  
  // ... existing video flow ...
}
```

Key behavior:
- `/` with no param → existing video → overlay flow
- `/?menu=true` → skip video, render overlay immediately
- `shouldSkipIntro()` flag NOT respected when `menuOnly=true` (user explicitly requested menu)

File size limit: `app/page.tsx` max 150 lines.

### STEP 3 — Global GHAI WalletBar

**3.1** Create `components/wallet/GhaiBalance.tsx` (max 120 lines):

This is a compact version of WalletBar suitable for top nav. Shows:
- Small GHAI icon (use `/public/icons/ghai.svg` — create minimal placeholder if not exists: cyan glowing circle with "G")
- Balance as GHAI tokens (convert USD to GHAI: `balance_usd * 100`)
- Click → opens full GHAI modal (existing top-up modal but rebranded)

Example display: `⬡ 424 GHAI` (compact, matches nav height)

**3.2** Update existing `components/wallet/WalletBar.tsx`:
- Add prop `displayMode: 'full' | 'compact'` (default `full`)
- `compact` = nav bar variant
- `full` = existing Quantum Chat variant
- When balance fetched in USD cents, display as GHAI: `Math.floor(balance_usd_cents / 100 * 100)` = `balance_usd * 100`

**3.3** Rebrand text:
- "Balance: $4.24" → "Balance: 424 GHAI"
- "Top Up" button text → keep as "Top Up" for now (creating Stripe GHAI pack products is separate sprint)
- Modal title stays "Top Up Wallet" for now

**3.4** Add GhaiBalance to top nav:

File: `components/layout/Nav.tsx`

Insert GhaiBalance component in top nav between nav links and user profile:
```
[VX voidexa logo] [Home▾ Products▾ Universe▾ About▾]     [GhaiBalance]  [DK] [Get in touch] [Profile]
```

Only show if user is authenticated. For logged-out users, show nothing (don't block nav).

File size: nav file max 250 lines.

### STEP 4 — Shop GHAI price display

File: `app/shop/page.tsx` (or wherever shop products render)

Find where product prices render. Currently shows `$3.00`, `$1.50`, etc.

**4.1** Create helper `lib/ghai/format.ts` (max 40 lines):
```typescript
export function usdToGhai(usd: number): number {
  return Math.floor(usd * 100);
}

export function formatGhai(ghai: number): string {
  return `${ghai.toLocaleString()} GHAI`;
}

export function formatUsdAsGhai(usd: number): string {
  return formatGhai(usdToGhai(usd));
}
```

**4.2** Replace all `${price}` displays in shop with `formatUsdAsGhai(price)`.

Expected results:
- `$3.00` → `300 GHAI`
- `$1.50` → `150 GHAI`
- `$1.99` → `199 GHAI`

**4.3** Starter Pack "COMING SOON · STRIPE" button:
- Change text to "BUY · 199 GHAI"
- Button should call existing deduct endpoint (`POST /api/wallet/deduct` with amount 1.99)
- On success, show success toast
- On insufficient balance, show "Top Up" prompt (reuse existing modal)
- If Starter Pack purchase logic is not yet wired to any backend flow, leave the button text change but keep it as placeholder click (log purchase intent) — DO NOT crash the shop if backend isn't ready

### STEP 5 — Mission Board auto-payout

Currently: players complete missions, GHAI reward is displayed but NOT credited to wallet.

File to identify: mission completion handler (likely `app/game/mission-board/page.tsx` or `lib/game/missions.ts` or `app/api/missions/complete/route.ts`). Search codebase for mission completion logic.

**5.1** Find mission completion flow. Likely location:
```
Get-ChildItem -Recurse -Path app,lib,components -Include *.ts,*.tsx | 
  Select-String -Pattern "mission.*complete|completeMission|mission_complete" -SimpleMatch |
  Select-Object Filename, LineNumber, Line
```

**5.2** When mission is completed successfully, call wallet credit:

```typescript
// After mission success logic:
const reward = mission.reward_ghai_max; // or random between min/max
await fetch('/api/wallet/credit', {
  method: 'POST',
  body: JSON.stringify({
    amount_usd: reward / 100, // convert GHAI back to USD for internal wallet
    reason: 'mission_reward',
    mission_id: mission.id
  })
});
```

**5.3** Create credit endpoint if missing: `app/api/wallet/credit/route.ts` (max 80 lines)

Pattern:
```typescript
export async function POST(request: Request) {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  const { amount_usd, reason, mission_id } = await request.json();
  
  // Defensive validation
  if (typeof amount_usd !== 'number' || amount_usd <= 0 || amount_usd > 100) {
    return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
  }
  
  // Credit wallet (use service role admin client)
  const admin = createAdminClient();
  const { data: wallet } = await admin.from('user_wallets').select('balance_usd').eq('user_id', user.id).single();
  const newBalance = (wallet?.balance_usd || 0) + amount_usd;
  
  await admin.from('user_wallets').upsert({ user_id: user.id, balance_usd: newBalance });
  await admin.from('wallet_transactions').insert({
    user_id: user.id,
    amount_usd,
    type: 'credit',
    reason,
    metadata: { mission_id }
  });
  
  return NextResponse.json({ success: true, new_balance_ghai: newBalance * 100 });
}
```

**5.4** Similar auto-payout for:
- Speed Run completion (if not already wired)
- Hauling contract completion
- Card battle victory (boss fights have GHAI rewards)
- Quest chain completion

If these mission types each have their own completion handler, add credit call to each. If they all funnel through one central handler, add it there once.

Report which completion handlers were found and modified.

### STEP 6 — Tests

Add tests for each step:

`tests/nav-dropdown.test.ts` (min 3 tests):
1. Home link has href="/home" (not "/")
2. Hovering Home shows dropdown with "Main Page" and "Quick Menu"
3. Quick Menu link has href="/?menu=true"

`tests/quick-menu-route.test.ts` (min 2 tests):
1. `/?menu=true` renders QuickMenuOverlay without video element
2. `/?menu=true` renders backdrop image

`tests/ghai-format.test.ts` (min 4 tests):
1. `usdToGhai(1.99)` returns 199
2. `usdToGhai(3.00)` returns 300
3. `formatGhai(424)` returns "424 GHAI"
4. `formatUsdAsGhai(4.24)` returns "424 GHAI"

`tests/ghai-balance-component.test.ts` (min 2 tests):
1. Renders balance in GHAI format
2. Compact mode renders without "Top Up" text (only icon + number)

`tests/mission-payout.test.ts` (min 3 tests):
1. Mission completion triggers credit API call
2. Credit API rejects unauthenticated requests
3. Credit API rejects negative amounts

Test count target: **660 + 14 = 674+** green.

### STEP 7 — Build, verify, deploy

1. `npm run build` — clean
2. `npm run lint` — no new errors
3. `npm test` — 674+ green
4. `npm run dev` — localhost:3000 manual check:
   - Hover Home → dropdown appears
   - Click "Main Page" → goes to `/home`
   - Click "Quick Menu" → goes to `/?menu=true`, overlay appears without video
   - Visit `/` fresh → video plays normally
   - Top nav shows GHAI balance (if logged in)
   - `/shop` shows prices in GHAI (not USD)
   - Complete a mission (or simulate) → wallet balance increases
5. Mobile check 375x812
6. `git add .`
7. `git commit -m "feat(sprint-13d): Home dropdown + Quick Menu route + global GHAI display + mission auto-payout"`
8. `git push origin main`
9. Wait Vercel deploy
10. Test production (incognito)
11. `git tag sprint-13d-complete`
12. `git push origin --tags`

---

## EXIT CRITERIA

- Home nav link goes to `/home`, not `/`
- Home hover dropdown shows Main Page + Quick Menu
- `/?menu=true` shows overlay without video
- Global GHAI balance visible in top nav (logged in users)
- All shop prices display as GHAI (not USD)
- Mission completion credits GHAI to wallet automatically
- Test count at 674+ green
- `npm run build` clean
- Deployed to voidexa.com via `git push origin main`
- Tag `sprint-13d-complete` pushed

---

## STOP CONDITIONS

- Wallet infrastructure files missing → halt, report
- Mission completion handler not found after reasonable search → halt, report
- Build fails 3 times consecutively → halt, report
- Tests regress below 660 → halt, report
- Any change breaks existing `/quantum/chat` wallet flow → halt, report and rollback

---

## ROLLBACK

```powershell
git reset --hard backup/pre-sprint-13d-20260418
git push --force-with-lease origin main
```

---

## FILES DELIVERED

**New:**
- `components/wallet/GhaiBalance.tsx` (compact GHAI nav display)
- `lib/ghai/format.ts` (USD ↔ GHAI conversion helpers)
- `app/api/wallet/credit/route.ts` (mission payout endpoint, if not exists)
- `tests/nav-dropdown.test.ts`
- `tests/quick-menu-route.test.ts`
- `tests/ghai-format.test.ts`
- `tests/ghai-balance-component.test.ts`
- `tests/mission-payout.test.ts`
- `public/icons/ghai.svg` (if not exists, create placeholder)

**Modified:**
- `components/layout/Nav.tsx` (Home dropdown + GhaiBalance integration)
- `components/wallet/WalletBar.tsx` (add displayMode prop, rebrand text to GHAI)
- `app/page.tsx` (handle `/?menu=true` query param)
- `app/shop/page.tsx` (use formatUsdAsGhai for prices, fix Starter Pack button)
- Mission completion handler (to be identified — add credit call)

**Database:**
- No new tables (use existing `user_wallets`, `wallet_transactions`)
