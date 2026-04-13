# STAR SYSTEM BUILD — Claude Code Commands
# ============================================

# ============================================
# BOX 1 — Start Claude Code
# ============================================

cd C:\Users\Jixwu\Desktop\voidexa; claude --dangerously-skip-permissions


# ============================================
# BOX 2 — Full instruction
# ============================================

Git backup first: git add -A && git commit -m "backup before star system ecosystem update"

Read the existing claim-your-planet skill if it exists in the project. Then do ALL of the following:

TASK 1 — Place the star system spec:
Copy the file from C:\Users\Jixwu\Downloads\VOIDEXA_STAR_SYSTEM_SPEC.md to docs/STAR_SYSTEM_SPEC.md in this project.

TASK 2 — Update CLAUDE.md:
Add this line to the top of CLAUDE.md under any existing "read these first" section:
"Read docs/STAR_SYSTEM_SPEC.md for the complete voidexa star system ecosystem design (visual architecture, economic engine, data model, build phases)."

TASK 3 — Rebuild /claim-your-planet page with the full ecosystem design:
The page must now explain the COMPLETE value proposition, not just a teaser. Keep the existing dark space aesthetic. Include these sections in order:

1. HERO: "Claim Your Planet" — shimmer title. Subtitle: "You're not renting a page. You're building a sovereign system inside the voidexa galaxy. Your planet, your economy, your orbit."

2. WHAT YOU GET (infrastructure bundle):
   - Quantum API access (multi-AI orchestration)
   - KCP-90 compression (95.67% token reduction)
   - Shared Supabase infrastructure
   - Deployment pipeline
   - Custom planet in the 3D star map with your brand color
   - Your own Level 2 star system (your products orbit YOUR sun)

3. THE ECOSYSTEM (why it matters):
   - Service Mesh: sell your API services to other planets, earn GHAI
   - Trade Routes: visible connections between planets that do business together
   - Gravity Score: your activity, trades, and contributions determine your planet's size and visibility
   - Revenue sharing: voidexa takes 7-15% of inter-planet transactions (scaling by tier)
   - You earn when OTHER planets use YOUR services

4. PIONEER REWARDS (tiered table):
   - Planet 1-10: 10M GHAI, 2x governance, 12 months featured
   - Planet 11-25: 7M GHAI, 1.5x governance, 6 months featured
   - Planet 26-50: 5M GHAI, 1x governance, 3 months featured
   - Vesting: 20% immediate, 80% over 18 months
   - Pioneer Royalties: earn 2% of derivative services built on your work

5. PIONEER SLOTS: Show 10 slots (not 5), dashed circles, with "X of 10 Pioneer slots remaining"

6. PRICING:
   - Deposit: $500 USD (paid in GHAI at daily rate, 15% discount)
   - Monthly: $50 USD
   - Self-sustaining: monthly drops when planet reaches critical mass
   - "Your deposit funds ecosystem infrastructure — servers, APIs, scaling. Transparent allocation."

7. GRAVITY SCORE EXPLAINED:
   - What it measures: transactions + services + tenure
   - What it affects: planet size on star map, search ranking, governance weight
   - "Your planet grows as you contribute"

8. HOW INTER-PLANET COMMERCE WORKS:
   - You offer a service → another planet uses it → you earn 70% in GHAI
   - The routing planet earns 15%
   - voidexa takes 15%
   - All visible as trade routes on the star map

9. GOVERNANCE:
   - Planet owners vote on ecosystem direction
   - Vote weight = Gravity Score × Pioneer multiplier
   - "You have a voice in how this universe evolves"

10. WHY JOIN EARLY (FOMO section):
    - Pioneer GHAI grants decrease over time
    - Early planets claim key marketplace niches
    - Governance influence compounds with tenure
    - Pioneer Royalties create permanent passive income
    - "Planet #50 will wish they were Planet #5"

11. CTA:
    - "10 Pioneer slots — first come, first proven"
    - Button: "Apply for a planet" → links to /contact or contact@voidexa.com
    - Secondary: "Questions? Reach the board directly — contact@voidexa.com"

Build each section as a separate component in app/claim-your-planet/components/. Match existing voidexa dark space aesthetic exactly. Minimum font 16px body, 14px labels. Mobile responsive.

After building the page: git add -A && git commit -m "feat: rebuild Claim Your Planet with full ecosystem design — Service Mesh, Gravity Score, Pioneer Rewards, inter-planet commerce"

Then deploy: npx vercel --prod
