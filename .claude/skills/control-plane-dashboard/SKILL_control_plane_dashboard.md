# SKILL.md — voidexa Control Plane Dashboard

## Project
Complete admin dashboard at /control-plane on voidexa.com. Premium dark-mode command center showing live data from all voidexa products.

## Design Direction
Dark sci-fi command center. Bloomberg terminal meets cyberpunk. Matrix terminal aesthetic with blue/purple accents on pure black backgrounds. Monospace fonts for data, sans-serif for labels. Glassmorphism cards with subtle borders. NO retro chunky fonts. Clean, premium, readable.

## Reference
User prefers: dark backgrounds (#0a0a0a to #000), subtle borders (#1a1a2a), blue accent (#3b82f6, #60a5fa), purple accent (#7c3aed, #a78bfa), green for status (#22c55e). Terminal/matrix style for data readouts.

## Tech Stack
- Next.js (existing voidexa.com stack)
- Tailwind CSS
- Supabase (project: ihuljnekxkyqgroklurp, EU)
- React Three Fiber (if 3D elements needed)
- Admin-only route (role='admin' in profiles table)

## Data Sources

### KCP-90 Protocol
- Supabase: kcp90_stats table + kcp90_summary view
- API: /api/kcp90/public-stats (already exists)
- Metrics: total_compressions, avg_compression_pct, tokens_saved, cost_saved, compressions_today, historical chart

### Trading Bot
- State files: 12_LOGS/state/ (paper_portfolio.json, season_state.json, apex_decision.json, system_health.json)
- API: Create /api/admin/trading-status endpoint that reads state files
- Metrics: current_season, P&L, positions, defense_layer_status (GREEN/YELLOW/RED), last_apex_decision, scalper_status

### GHAI Token
- Solana RPC: token supply, burn count
- Raydium: pool liquidity, price
- Contract: Ch8Ek9PTbzSGdL4EWHC2pQfPq2vTseiCPjeZsAZLx5gK
- AMM: F1tZH4xQGEJjVEHpbQGyPBUAJS1ywFZM14HLewMBcXDM
- Metrics: price, circulating_supply, burned, pool_liquidity, 24h_volume

### Quantum Engine
- Supabase: quantum_sessions table (create if not exists)
- Metrics: sessions_today, total_sessions, providers_used, avg_cost_per_session

### Void Chat
- Supabase: void_chat_messages table (create if not exists)
- Metrics: messages_today, active_users, cost_per_message

### Website
- Vercel Analytics API (if available) or Supabase page_views table
- Metrics: visits_today, total_views, top_pages, bounce_rate

### System Health
- Aggregate status from all products
- Each product: GREEN (running, no errors) / YELLOW (warning) / RED (down/error)
- Overall health indicator

## Dashboard Sections (Layout)

### Top Bar
- voidexa logo + "Control Plane" title
- System health indicator (GREEN/YELLOW/RED dot)
- Last updated timestamp
- Admin user avatar

### Row 1 — Key Metrics (4 cards)
- Total compressions (KCP-90)
- Trading bot P&L today
- GHAI price
- Active systems count

### Row 2 — KCP-90 Protocol (wide card)
- Live compression stats
- Historical chart (last 30 days)
- Per-product breakdown (Quantum, Trading Bot, Void Chat)

### Row 3 — Trading Bot + GHAI (2 cards side by side)
- Trading Bot: season, positions, defense status, APEX decision
- GHAI: price chart, supply, burn rate, pool

### Row 4 — Quantum + Void Chat (2 cards side by side)
- Quantum: sessions, providers, cost
- Void Chat: messages, users, cost

### Row 5 — Activity Feed (full width)
- Real-time event log from all products
- Filterable by product

## Safety
- Admin-only: check user role before rendering
- No sensitive data exposed (no API keys, no wallet seeds)
- Rate limit API endpoints
- All data read-only from dashboard (no actions/buttons that modify state)

## Build Order
1. Create Supabase tables (quantum_sessions, void_chat_messages, page_views)
2. Create API endpoints (/api/admin/dashboard-stats)
3. Build dashboard page layout + components
4. Connect real data sources
5. Add historical charts
6. Polish design + responsive
7. Test with admin login
8. Deploy

## Phase 2 (Later)
- Real-time WebSocket updates
- Alerting (Telegram notification if system goes RED)
- Export reports as PDF
- Mobile-responsive version
