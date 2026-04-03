# SKILL.md — voidexa Control Plane Dashboard
## Project
Complete admin dashboard at /control-plane on voidexa.com. Premium dark-mode command center showing live data from all voidexa products.
## Design Direction
Dark sci-fi command center. Matrix terminal aesthetic with blue/purple accents on pure black backgrounds. Monospace fonts for data, sans-serif for labels. Glassmorphism cards with subtle borders.
## Tech Stack
Next.js, Tailwind CSS, Supabase (project: ihuljnekxkyqgroklurp, EU), admin-only route (role='admin' in profiles table).
## Data Sources
- KCP-90: Supabase kcp90_stats table + kcp90_summary view, API /api/kcp90/public-stats
- Trading Bot: state files in 12_LOGS/state/, create /api/admin/trading-status endpoint
- GHAI Token: Solana RPC, contract Ch8Ek9PTbzSGdL4EWHC2pQfPq2vTseiCPjeZsAZLx5gK
- Quantum: Supabase quantum_sessions table
- Void Chat: Supabase void_chat_messages table
- Website: Vercel Analytics or Supabase page_views table
## Dashboard Sections
1. Top Bar: logo + Control Plane title + system health + last updated + admin avatar
2. Row 1: 4 key metric cards (compressions, trading P&L, GHAI price, active systems)
3. Row 2: KCP-90 Protocol wide card with chart
4. Row 3: Trading Bot + GHAI Token side by side
5. Row 4: Quantum + Void Chat side by side
6. Row 5: Activity Feed full width
## Safety
Admin-only, read-only dashboard, no API keys in frontend, rate limit endpoints.
## Reference Design
See docs/dashboard/CHATGPT_DASHBOARD_DESIGN.jsx for ChatGPT's React mockup.
