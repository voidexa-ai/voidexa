# CLAUDE.md — GHAI Strip Task

## What This Is
Strip all public-facing GHAI token purchase details from voidexa.com.
Convert from "buy it here" to "coming soon — join the waitlist."
Keep backend infrastructure intact for future reactivation.

## Project Location
C:\Users\Jixwu\Desktop\voidexa

## Critical Rules
1. Read SKILL.md FIRST — it has the complete file list and modification plan
2. Git backup BEFORE any changes: git add -A && git commit -m "pre-ghai-strip backup"
3. Save ALL removed content to GHAI_STRIPPED_CONTENT.md organized by source file
4. Do NOT touch any files in app/api/, lib/ghai/, lib/credits/, lib/stripe/, types/
5. Do NOT remove the GHAI brand name, Ghost AI visuals, or ghost watermark SVG
6. Do NOT break the build — run npm run build and fix ALL errors before committing
7. Build everything in ONE command — no user input mid-build
8. After build succeeds: git add -A && git commit -m "ghai-strip: convert all token details to teaser-only coming soon"

## The Vibe for Replaced Content
Every place that currently says "buy GHAI here, contract is X, pay Y GHAI/msg" becomes:
- "GHAI — The ecosystem token of voidexa"
- "Coming Soon"
- "Join the waitlist to be first"
- Keep it mysterious, premium, exclusive

## What Stays
- Ghost AI page hero visual (ghost SVG watermark, GHAI title, purple/cyan gradient)
- Waitlist forms
- Earn GHAI section (marked Coming Soon)
- Void Chat functionality (USD/Stripe payments)
- All backend API routes
- Admin control plane (internal only)
- Break Room, Trading Hub content

## What Goes
- Contract address (Ch8Ek9PTbzSGdL4EWHC2pQfPq2vTseiCPjeZsAZLx5gK) everywhere
- Buy on Raydium buttons/links
- Live price ticker/card
- Solscan links
- Token stats grid (Chain, Supply, Mint, Freeze boxes)
- Wallet connect buttons (Phantom, Solflare) on profile page
- GHAI deposit modal flow
- GHAI balance display in sidebar
- GHAI cost per message in model selectors
- Specific dollar/GHAI amounts on Claim Your Planet
- GHAI discount banner on Claim Your Planet
- GHAI tier on pricing page

## Deploy
After successful build: npx vercel --prod
