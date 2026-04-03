# CLAUDE.md — Control Plane Dashboard Addendum

## What This Is
A complete admin dashboard at /control-plane on voidexa.com showing live stats from all voidexa products. Admin-only access.

## Design
Dark sci-fi command center. Matrix terminal style for data. Blue (#3b82f6) and purple (#7c3aed) accents on black (#0a0a0a). Monospace for data readouts. Glassmorphism cards. Premium, NOT retro chunky.

## Existing Infrastructure
- voidexa.com: Next.js, Vercel, Supabase (ihuljnekxkyqgroklurp)
- /control-plane route already exists with basic KCP-90 stats
- Admin check: profiles table, role='admin', user_id 644b8f41-4cac-41c7-8d1e-0415ca858197
- KCP-90 API: /api/kcp90/public-stats already works
- Supabase tables: kcp90_stats, kcp90_summary view exist

## What To Build
Replace current /control-plane with a full dashboard. Read .claude/skills/control-plane-dashboard/SKILL.md for complete spec.

## Rules
- Admin-only: verify role before rendering
- Read-only dashboard: no state-changing buttons
- All data from Supabase or API endpoints
- No API keys or secrets in frontend code
- Use existing voidexa component patterns (glassmorphism, dark theme)
- PowerShell uses semicolons not &&
- Push to main AND master for Vercel deploy
