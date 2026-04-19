# VOIDEXA BUSINESS PORTAL MASTER DESIGN DOCUMENT

**Scope:** B2B and ecosystem revenue streams. Everything related to monetizing voidexa for people who DON'T necessarily play the game.

**Target audience:** Companies, content creators, designers, affiliates, resellers.

**Placement:** voidexa.com homepage, visible in top nav as "Business" or "Ecosystem" (decision needed).

**Not covered here:** In-game cosmetics shop. See `VOIDEXA_INGAME_SHOP_MASTER.md` for those.

---

# PART 1 — PURPOSE

Right now, revenue streams that are NOT in-game cosmetics are invisible. A company that wants to advertise, claim a planet, become an affiliate, or sell designs never discovers these options because they live inside the game.

The Business Portal surfaces them all in one public place so non-players can:
- Understand what voidexa offers business-wise
- See pricing
- Sign up / apply / purchase
- Track earnings (if applicable)

---

# PART 2 — THE 4 BUSINESS PORTAL LAYERS

## Layer 1 — Claim Your Planet
## Layer 2 — Advertisement
## Layer 3 — Creator / Designer / Affiliate Economy
## Layer 4 — Reseller Partnerships

---

# PART 3 — LAYER 1: CLAIM YOUR PLANET (existing)

## What it is
Companies or individuals own a planet in the voidexa star system. The planet is their own real estate — they build their own products, pages, and presence on it.

## Current pricing (locked)
- $500 deposit (one-time)
- $50/month USD (paid in GHAI at daily rate)
- Pioneer rewards: 10M GHAI total (5M immediate + 5M vested over 18 months)
- voidexa revenue share: 15% / 10% / 7% scaling by tier

## What each planet gets
- Unique planet in star map (visible to all players)
- Reachable in Free Flight (players can fly to and dock at the planet)
- Custom planet color and name
- Dedicated page / subdomain
- Access to shared infrastructure: Quantum API, KCP-90 compression, Supabase
- Listed in Business Portal directory
- Revenue streams: their own products + any ads they host on their orbital banner

## What planet owners can do on their planet
- Run their own business (any legal industry)
- Host their own products
- Sell their own services
- Run advertisements for other companies (sub-letting ad space)
- Host events, tournaments, or community gatherings

## Tiers (proposed)
- **Bronze planet** ($500 deposit + $50/month) — standard planet in Outer Ring
- **Silver planet** ($1000 deposit + $100/month) — Mid Ring position, larger visual presence
- **Gold planet** ($2500 deposit + $250/month) — Inner Ring, highest traffic, premium visual
- Tier upgrades possible; tier downgrades not possible

## Display on Business Portal
- "Claim Your Planet" landing page
- Pricing calculator
- Planet slot availability ("5 Bronze slots available this month")
- Gallery of existing planets (showcase)
- Application form
- FAQ and legal terms

---

# PART 4 — LAYER 2: ADVERTISEMENT

Advertisement runs across voidexa for companies that don't want or need a full planet.

## Ad type A — Orbital Banner Rings
- Rotating advertising ring around a planet or neutral station
- Visible from space during Free Flight
- Immersive sci-fi aesthetic (Blade Runner / Fifth Element style)
- Texture spec: 2048x512, seamless horizontal tile
- **Placement zones:**
  - Inner Ring planet (premium) — $500/week
  - Mid Ring planet — $250/week
  - Outer Ring planet — $100/week
  - Neutral station (not tied to a planet) — $150/week
- Revenue split: voidexa 85% / planet owner 15% (if ring is around their planet)
- Admin approval workflow required

## Ad type B — Station Interior Panels
- 2D image panels on station walls
- Rendered when player docks
- Auto-rotate every 15 seconds
- Clickable → opens advertiser URL in new tab
- **Pricing:** $50/week per panel, $150/week for premium placement
- High impression volume, moderate engagement
- Easy to approve/deploy

## Ad type C — Sponsored Landmarks
- Existing landmark gets "Sponsored by X" tag when scanned
- Flavor text includes sponsor mention
- Can include custom lore paragraph
- **Pricing:** $300/month per landmark
- Limited number of premium landmarks (20-30 total)

## Ad type D — Card Pack Sponsorship
- Company sponsors a special booster pack
- Pack art features subtle company branding
- Opening animation shows sponsor logo briefly
- Could be ad-supported FREE pack for players (watch-ad model)
- **Pricing:** $2000/month for one branded pack type
- Very high visibility — every player who opens packs sees it

## Ad type E — Advertisement Planet (novel)
- A planet whose entire business IS advertising
- Owner pays $500 + $50/month like standard planet
- Their revenue model: sub-let ad space to other businesses
- voidexa takes planet cut (15-7%); owner profits from reselling ad slots
- Creates a meta-economy where some planets ARE the advertising
- New category in Business Portal: "Advertising Planets"

## Display on Business Portal
- "Advertise on voidexa" landing page
- Ad type comparison table
- Pricing calculator (weekly/monthly)
- Available slot inventory (real-time)
- Self-service upload for approved advertisers
- Analytics dashboard: impressions, clicks, engagement
- Invoicing via Stripe (B2B)

---

# PART 5 — LAYER 3: CREATOR / DESIGNER / AFFILIATE ECONOMY

Multiple ways for people to earn from voidexa without owning a planet.

## 5A — Affiliate Program
- Public signup: voidexa.com/affiliates
- Unique referral link generated on approval
- Dashboard showing clicks, signups, earnings
- **Payout:** 10% of referred user's GHAI purchases for first 6 months
- Threshold: $50 minimum payout, monthly
- Model: RunPod's 10% cash affiliate after 25 referrals
- Content creators can share via TikTok, YouTube, Twitter, Discord

## 5B — Designer Marketplace
- Public submission portal: voidexa.com/designers
- Template kits provided for: card backs, decals, battle boards, titles, banners
- Designer creates using templates or from scratch
- Submits via portal
- 14-day review cycle
- If approved: added to in-game shop
- **Revenue split:** Designer gets 30% of every sale, voidexa keeps 70%
- Designer keeps ownership of their design; voidexa gets distribution rights
- Inspired by Steam Workshop, Roblox UGC, TF2 item creators

## 5C — Streamer / Content Creator Tier
- Application-based (not automatic)
- Approved creators get:
  - Early access to new features
  - Branded in-game title ("Official Creator")
  - Custom profile banner
  - Higher affiliate rate (15% instead of 10%)
  - Revenue share on items they help promote (additional 5%)
- Obligations: minimum content output per month, brand guidelines compliance

## 5D — Community Quest Creator
- Players/creators design custom tracks, missions, encounters via in-game tools
- Published to community portal
- Other players rate and play
- **Creator earns:** 50 GHAI per play above 100-play threshold (prevents spam)
- Featured creators get weekly bonus (1000 GHAI)
- Top 10 creators monthly get Mythic cosmetic

## 5E — Tournament Host Program
- Official creator hosts tournaments
- voidexa provides GHAI prize pool funding (up to $500/event)
- Host earns 10% of entry fees + stream revenue share
- Tournaments feed into voidexa's leaderboard and create content

## Display on Business Portal
- "Earn with voidexa" landing page
- 5 clear paths (Affiliate / Designer / Streamer / Quest Creator / Tournament Host)
- Application forms for each
- Earnings calculator
- Success stories / showcase
- Creator dashboard (after approval)

---

# PART 6 — LAYER 4: RESELLER PARTNERSHIPS (existing + planned)

voidexa resells third-party services with markup.

## 6A — GPU Rental Reseller
- Third-party providers: Vast.ai, RunPod, Lambda Labs, Paperspace
- voidexa-branded frontend on voidexa.com/gpu
- Customer orders through voidexa → voidexa books with provider → markup retained
- **Margins:** 10-15% typical
- Use case: AI researchers, Quantum Forge users, Claim Your Planet owners who need compute

## 6B — Server Rental Reseller
- Third-party providers: Hetzner, OVHcloud
- EU-focused (GDPR-safe) to match Supabase EU setup
- voidexa-branded frontend on voidexa.com/servers
- **Margins:** 10-15%

## 6C — PC Builder Service
- Partner with local PC builder (Jix's friend)
- Customer configures PC on voidexa.com/pc-builder
- Friend builds physical machine
- Two speed tiers: fast delivery (premium parts) / normal (cheapest online parts)
- voidexa handles order + payment, partner handles build + shipping
- Revenue split TBD based on partner agreement

## 6D — Quantum Box (future hardware product)
- Mini PC / NUC for running Comlink / Jarvis locally
- voidexa's own product (not resold)
- Hardware sourced via PC Builder partnership
- Sold on Business Portal under Hardware category

## Display on Business Portal
- "Hardware" category in top nav
- Three sub-sections: GPU Rental / Server Rental / PC Builder
- Quantum Box featured when ready

---

# PART 7 — BUSINESS PORTAL UI STRUCTURE

## Top nav integration
Add "Business" or "Ecosystem" link to voidexa.com top nav. Current nav is: Home / Products / Universe / About. Add Business between Products and Universe.

## Landing page structure

### Hero section
- "Build with voidexa" headline
- Subtext: "Planets, advertisement, creator programs, hardware — everything to grow your business inside our ecosystem."
- 4 category cards (one per layer)

### Category 1: Claim Your Planet
- Preview visual (planet in star map)
- Starting price
- "Apply now" CTA

### Category 2: Advertise
- Preview visual (orbital banner ring)
- Pricing tiers
- "Start campaign" CTA

### Category 3: Earn with voidexa
- 5 paths listed
- "Apply to creator program" CTA

### Category 4: Hardware
- GPU / Server / PC Builder / Quantum Box
- "Configure and order" CTA

### Trust signals
- Existing planet owners showcase
- Creator success stories
- Testimonials
- Revenue transparency (e.g., "Paid out $X to creators last month")

---

# PART 8 — REVENUE FLOW SUMMARY

How money moves through the Business Portal:

| Source | Paid by | Paid to | voidexa cut |
|---|---|---|---|
| Planet ownership | Planet owner | voidexa | 100% of monthly fee |
| Ad on planet | Advertiser | voidexa (85%) + planet owner (15%) | 85% |
| Ad on station | Advertiser | voidexa | 100% |
| Sponsored landmark | Advertiser | voidexa | 100% |
| Card pack sponsorship | Advertiser | voidexa | 100% |
| Affiliate referral | voidexa | Affiliate | 90% (creator gets 10%) |
| Designer marketplace | Player (GHAI) | voidexa (70%) + designer (30%) | 70% |
| Creator revenue share | voidexa | Streamer/creator | Variable (10-20%) |
| GPU/server reseller | Customer | voidexa (markup) + provider (cost) | 10-15% markup |
| PC Builder | Customer | voidexa + partner | Split per agreement |

---

# PART 9 — LEGAL / COMPLIANCE

## Planet ownership
- ADVORA (Niels Gade-Jacobsen) engaged for MiCA / utility token legal review
- GHAI classification: utility token, no speculative value
- Terms of Service for planet owners required

## Advertisement
- Content moderation required (no hate speech, scams, adult content)
- Right of refusal reserved for voidexa
- Minimum $100 order for B2B invoicing efficiency
- Advertiser provides all creative assets
- voidexa owns approval workflow

## Creator programs
- Standard creator agreement template needed
- IP terms: creator retains ownership, voidexa gets distribution license
- Payout via PayPal / bank transfer (not GHAI, unless creator prefers)
- Tax reporting: US 1099 / EU equivalent at threshold

---

# PART 10 — BUILD ROADMAP

**Phase A (immediate):**
- Claim Your Planet already exists — polish page, add tier system
- Publish Business Portal landing page on voidexa.com/business

**Phase B (2-3 sprints):**
- Advertisement: station interior panels (easiest, 2D overlay)
- Affiliate program signup + dashboard
- Designer marketplace submission portal

**Phase C (3-5 sprints):**
- Orbital banner rings (3D asset system)
- Sponsored landmarks integration
- Creator tier application
- Reseller storefronts (GPU, Server, PC)

**Phase D (future):**
- Card pack sponsorship system
- Advertisement Planet mechanics
- Tournament Host program
- Quantum Box launch

---

# PART 11 — INTEGRATION WITH IN-GAME SHOP

Some items flow between the two shops:

- **Designer-submitted cosmetics** → created via Business Portal → approved → appear in In-Game Shop → designer earns revenue share
- **Advertiser's orbital banner** → purchased via Business Portal → displayed in-game in Free Flight
- **Creator's unique title** → earned via Business Portal creator program → displayed on player profile in-game

**The two master documents cross-reference each other. Neither is complete alone.**

---

# PART 12 — ANALYTICS REQUIRED

Business Portal needs its own analytics dashboard per category:

- Planet ownership: total planets, MRR, churn, tier distribution
- Advertisement: slots sold, impressions served, CTR, revenue
- Creator economy: active creators, payouts, top earners, submission queue
- Reseller: orders, margin, customer LTV
- Aggregated: total Business Portal MRR, growth %, breakdown by layer

---

**End of Business Portal master document.**

Next step: wire both shops to work together in product + build sprint plan.
