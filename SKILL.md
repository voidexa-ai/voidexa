---
name: ghai-strip
description: Strip all buyable/technical GHAI token details from voidexa.com. Remove contract addresses, buy links, wallet connect, specific pricing in GHAI, and deposit flows. Replace with teaser-only "Coming Soon" content that builds hype and scarcity. Triggers on "strip ghai", "remove token details", "ghai teaser", "hide crypto", "token coming soon" in the context of voidexa.
---

# GHAI Strip — Build Skill

## Context
Project: voidexa.com at C:\Users\Jixwu\Desktop\voidexa (Next.js, Vercel)
Goal: Remove ALL public-facing token purchase details. Convert GHAI from "buy it here" to "something big is coming, and you can't have it yet."

## Strategy
Build hype before access. Create scarcity. Make people wait and want it.
- NO contract address visible anywhere on public pages
- NO buy links (Raydium, DEX, Solscan)
- NO wallet connect for deposits on public pages
- NO specific GHAI pricing per message shown to users
- NO live price ticker on public pages
- YES keep the GHAI brand, ghost visual, and "Coming Soon" energy
- YES keep backend/API routes functional (they stay for when we go live)
- YES keep admin/control-plane data intact (admin-only, not public)

## Design Language
Same voidexa dark space aesthetic:
- Background: dark gradients (#0d0a1f to #060412 to #020108)
- Primary accent: cyan (#00d4ff)
- Secondary accent: purple (#8b5cf6, #a855f7)
- Ghost AI purple: #7c3aed
- Text: light lavender tones at varying opacity
- "Coming Soon" badges: gray (#888) background rgba(136,136,136,0.1), border rgba(136,136,136,0.25)
- Font sizes: minimum 14px body, 14px labels, opacity >= 0.5

## Files to Modify (21 files)

### TIER 1 — Major page rewrites
1. app/ghost-ai/page.tsx — Remove contract address, buy links, live price, token stats. Keep hero visual + waitlist. Teaser only.
2. app/claim-your-planet/page.tsx — Remove specific GHAI amounts ($500, $50/month, 5M/5M GHAI). Replace with "Pricing at launch." Remove GHAI discount banner. Remove Raydium mention.
3. app/void-chat/pricing/page.tsx — Remove GHAI tier entirely. Keep Stripe Pro. Add "Token payments coming soon."
4. app/profile/page.tsx — Remove wallet connect (Phantom/Solflare). Keep basic profile.

### TIER 2 — Component updates
5. components/ghost-ai/CreditDisplay.tsx — Remove GHAI balance display and deposit CTA. Show Pro/USD only.
6. components/ghost-ai/DepositModal.tsx — Replace with "GHAI deposits coming soon" message.
7. components/ghost-ai/GhaiTicker.tsx — Replace live ticker with "Coming Soon" placeholder or remove.
8. components/ghost-ai/ModelSelector.tsx — Remove GHAI cost from dropdown text. Show USD only.
9. components/sections/home/ClaimPlanetTeaser.tsx — Remove "10M GHAI" specific amount. Say "exclusive pioneer rewards."
10. components/sections/home/HomeCtas.tsx — GHAI card stays visual but text becomes "Coming Soon."
11. components/layout/Navigation.tsx — Remove /token from mobile secondary links.
12. components/control-plane/ControlPlaneDashboard.tsx — Remove contract address from GhaiPanel display (admin only but clean it).
13. components/WalletProvider.tsx — Keep file, no changes needed.

### TIER 3 — Config and minor
14. config/constants.ts — Remove contractAddress value (set to empty string). Remove VOIDEXA_RECEIVER_WALLET.
15. app/token/page.tsx — Change redirect from /ghost-ai#token-info to /ghost-ai.
16. app/void-chat/page.tsx — Remove GHAI cost from model option display text.
17. app/admin/void-chat/page.tsx — Remove GHAI Deposited/Spent/In Platform admin stats.
18. app/whitepaper/page.tsx — Remove "Ghost AI · GHAI Token" eyebrow text.

### DO NOT TOUCH (keep backend functional)
- app/api/ghai/* (balance, deposit, price routes)
- lib/ghai/* (balance.ts, price-feed.ts, verify-deposit.ts)
- lib/credits/* (check.ts, deduct.ts)
- lib/stripe/* (client.ts, subscription.ts)
- app/api/chat/* (conversations, send)
- app/api/stripe/* (checkout, webhook)
- types/credits.ts, config/providers.ts, config/pricing.ts
- All break-room content
- All trading-hub tab components

## Removed Content Archive
All removed content must be saved to: C:\Users\Jixwu\Desktop\voidexa\GHAI_STRIPPED_CONTENT.md
This file preserves every piece of removed code/content organized by source file, so it can be restored when GHAI goes live with proper liquidity and social media campaign.

## Build Order
1. Git backup first: git add -A && git commit -m "pre-ghai-strip backup"
2. Create GHAI_STRIPPED_CONTENT.md archive
3. Modify all files per plan
4. npm run build — fix ALL errors
5. Git commit: "ghai-strip: convert all token details to teaser-only coming soon"
6. Deploy: npx vercel --prod

## Rules
- NEVER remove the GHAI brand or Ghost AI visual identity
- NEVER break the backend payment infrastructure
- NEVER remove waitlist functionality
- ALL removed content goes into GHAI_STRIPPED_CONTENT.md
- Keep "Powered by {provider} — orchestrated by voidexa" transparency line
- Test build before committing
