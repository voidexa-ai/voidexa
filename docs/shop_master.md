# VOIDEXA SHOP MASTER DESIGN DOCUMENT

**Purpose:** Complete specification for voidexa.com shop. Covers cosmetics, advertisement layers, creator economy, Claim Your Planet integration, rotation systems, and build-vs-buildable audit.

This document is the single source of truth. All shop decisions trace back here.

---

# PART 1 — VOIDEXA SHOP PHILOSOPHY

**Core rules (non-negotiable):**

1. **No pay-to-win.** Gameplay earns stats. Shop sells looks, identity, and access — never power.
2. **GHAI only.** All prices in GHAI. GHAI bought in fixed Fortnite-style packs ($5=500, $10=1000, $25=2500+bonus).
3. **Every item must have game capability.** No selling emotes if emote-system doesn't exist. Every shop item is tagged Built / Buildable / Aspirational.
4. **Fortnite rotation model.** Shop refreshes automatically on a schedule, not manually.
5. **Multiple revenue layers.** Cosmetics are ONE layer. Advertisement, planet ownership, creator royalties are additional streams.

---

# PART 2 — THE 4 REVENUE LAYERS

voidexa's shop is not just a cosmetics store. It's a commerce hub with 4 distinct revenue streams.

## Layer 1 — Direct Cosmetics (this document's main focus)
Ship skins, trails, card backs, effects, banners, titles. Individual items bought with GHAI.

## Layer 2 — Claim Your Planet (existing system)
Companies/individuals claim planets in the voidexa universe.
- $500 deposit + $50/month USD (paid in GHAI at daily rate)
- Pioneer rewards: 10M GHAI (5M+5M, 18-month vesting)
- voidexa cut: 15% / 10% / 7% scaling by tier
- Planet owners build their own products/pages on their planet
- Planet is visible in the star map, reachable in Free Flight

## Layer 3 — Advertisement (new, multi-sub-layer)
Companies advertise across voidexa without needing a full planet.

**Ad type A — Orbital banner rings** (immersive, sci-fi)
- A company pays to have a rotating advertising ring around their own planet OR around neutral stations
- Visible from space when flying near. Like billboards in sci-fi movies (Blade Runner, Fifth Element).
- Tier pricing: Inner Ring (premium, high traffic) > Mid Ring > Outer Ring
- Priced per week or month in GHAI equivalent to USD

**Ad type B — Station-interior advertising**
- When players dock at space stations, interiors show ad panels
- Like airport advertising — seen during loading/queue moments
- Cheaper than orbital rings, high impression volume

**Ad type C — Sponsored landmarks**
- A company sponsors a nebula, asteroid field, or ship wreck
- "The XYZ Corp Nebula" — name appears when scanned
- Mid-tier pricing

**Ad type D — Card pack sponsorship**
- Company sponsors a booster pack release
- Pack art features subtle company branding
- Player opens pack → sees sponsor → gets rewards
- Ad-supported card packs could be FREE for players (watch-ad model alternative)

**Ad type E — Advertisement planet (novel)**
- A planet whose ENTIRE purpose is to host ads for other companies
- Owner pays $500 + $50/month like normal planet
- But their revenue model is to sub-let ad space to other businesses
- voidexa takes its planet cut; the ad-planet owner profits from sub-leasing
- Creates a meta-economy: some planets ARE the advertising

## Layer 4 — Creator Economy
People who don't want to own planets but want to earn.

**Type A — Affiliate / content creator program**
- User makes TikTok, YouTube, Twitter content promoting voidexa
- Gets unique referral link
- % of GHAI purchases from referred users go to them
- Similar to RunPod's 10% cash affiliate after 25 referrals

**Type B — Cosmetic designer program**
- Users design cosmetics (decals, card backs, titles) via templates
- Submit to voidexa — if approved, added to shop
- Designer earns % of every sale
- Similar to Roblox / Steam Workshop / Dreams PS4

**Type C — Community quest creator**
- Users design custom missions, tracks, encounters
- Shared in community → played by others
- Creator earns small GHAI reward per play

**Type D — Streamer / tournament host program**
- Official streamers get priority features, beta access, revenue share on their promoted items
- Tournaments sponsored with GHAI prize pools

---

# PART 3 — WHAT CAN ACTUALLY BE SOLD TODAY

Every shop item tagged Built / Buildable / Aspirational.

- **Built** = already works in current game engine
- **Buildable** = can be implemented in 1-2 sprints without new systems
- **Aspirational** = requires major system work (emote-system, assembly-app, pilot-avatar system)

## 3A — Items currently in shop (audit of 19 live items)

| Item | Current status | Capability tag | Notes |
|---|---|---|---|
| Starter Pack Bundle | Live | Built | Bundle mechanic works |
| Ion Corona (Effect) | Live | Buildable | Shader around hull, similar to boost trail system |
| Obsidian Stealth Coating (Ship Skin) | Live | Built | Color/material swap on existing 3D model |
| Ultimate Card Pack | Live | Built | Pack-opening UI exists, just needs Stripe completion |
| Aurora Legendary Trail | Live | Built | Boost trail system already works |
| Voidrunner Legendary Hull | Live | Built | Ship skin swap |
| Gilded Cockpit | Live | Built | Cockpit Picker has 5 slots |
| **Victory Roll (Emote)** | Live | **Aspirational** | **No emote-system. Must be built.** |
| Chrome Cruiser Plating | Live | Built | Ship skin |
| **Ornamental Cannons (Attachment)** | Live | **Aspirational** | **Requires assembly-app fix** |
| Carbon Fiber Cockpit | Live | Built | Cockpit Picker |
| Nebula Wake (Effect) | Live | Built | Particle/trail system |
| Premium Card Pack | Live | Built | Pack UI |
| **Sensor Antenna Array (Attachment)** | Live | **Aspirational** | **Assembly-app required** |
| Solar Flare Trail | Live | Built | Trail system |
| Blue Ion Trail | Live | Built | Trail system |
| **Pilot Salute (Emote)** | Live | **Aspirational** | **No emote-system** |
| Standard Card Pack | Live | Built | Pack UI |
| Crimson Fighter Skin | Live | Built | Ship skin |
| **Swept Wing Fins (Attachment)** | Live | **Aspirational** | **Assembly-app required** |
| Warp Bloom (Effect) | Live | Buildable | Shader effect on warp exit |

**Problematic items to delist or flag:** Victory Roll, Pilot Salute, Ornamental Cannons, Sensor Antenna Array, Swept Wing Fins. These 5 items advertise functionality that doesn't exist.

**Recommendation:** Either build the systems, or move these to "Coming Soon" badges with pre-order mechanics.

## 3B — New items to add (Built / Buildable only)

### Ship hull visuals (expand existing texture-swap system)

| Item | Type | Capability |
|---|---|---|
| Tiger Stripes | Ship decal | Built |
| Digital Camouflage | Ship decal | Built |
| Carbon Weave Pattern | Ship decal | Built |
| Racing Stripes (5 colors) | Ship decal | Built |
| Skull Nose Art | Ship decal | Built |
| Pin-up Nose Art | Ship decal | Built |
| Neon Underglow (8 colors) | Ship effect | Buildable |
| Canopy Tint — Gold | Cockpit effect | Buildable |
| Canopy Tint — Chrome | Cockpit effect | Buildable |
| Canopy Tint — Smoked | Cockpit effect | Buildable |
| Reactor Glow — Purple | Ship effect | Built |
| Reactor Glow — Green | Ship effect | Built |
| Reactor Glow — White | Ship effect | Built |
| Engine Flame — Purple Fire | Ship effect | Built |
| Engine Flame — Green Plasma | Ship effect | Built |
| Engine Flame — White Inferno | Ship effect | Built |
| Hull Wear — Veteran Scars | Ship skin | Built |
| Hull Wear — Pristine Showroom | Ship skin | Built |
| Muzzle Flash — Blue | Weapon effect | Buildable |
| Muzzle Flash — Red | Weapon effect | Buildable |
| Muzzle Flash — Green | Weapon effect | Buildable |
| Shield Bubble — Blue | Defense effect | Buildable |
| Shield Bubble — Amber | Defense effect | Buildable |
| Shield Bubble — Pink | Defense effect | Buildable |
| Exhaust Smoke Trail | Ship effect | Buildable |

### Card battle visuals (new category — huge revenue potential, low build cost)

| Item | Type | Capability |
|---|---|---|
| Card Back — Starfield | Card back | Buildable |
| Card Back — Holographic | Card back | Buildable |
| Card Back — Voidexa Emblem | Card back | Buildable |
| Card Back — Neon Grid | Card back | Buildable |
| Card Back — Ancient Runes | Card back | Buildable |
| Card Frame — Gold Border | Card frame | Buildable |
| Card Frame — Silver Chrome | Card frame | Buildable |
| Card Frame — Neon Purple | Card frame | Buildable |
| Card Frame — Holographic | Card frame | Buildable |
| Battle Board — Bridge Command | Battle theme | Buildable |
| Battle Board — Deep Void | Battle theme | Buildable |
| Battle Board — Hangar Bay | Battle theme | Buildable |
| Battle Board — Asteroid Belt | Battle theme | Buildable |
| Battle Board — Ancient Station | Battle theme | Buildable |
| Battle Music Track — Combat Pulse | Battle audio | Buildable |
| Battle Music Track — Cold War | Battle audio | Buildable |
| Battle Music Track — Victory Symphony | Battle audio | Buildable |
| Victory Screen — Fireworks | Victory theme | Buildable |
| Victory Screen — Warp Jump | Victory theme | Buildable |
| Victory Screen — Hologram Trophy | Victory theme | Buildable |
| Damage Numbers — Neon Cyan | UI cosmetic | Buildable |
| Damage Numbers — Blood Red | UI cosmetic | Buildable |
| Damage Numbers — Classic White | UI cosmetic | Buildable |
| Targeting Reticle — Military Grade | UI cosmetic | Buildable |
| Targeting Reticle — Hologram | UI cosmetic | Buildable |
| Targeting Reticle — Minimalist | UI cosmetic | Buildable |

### Profile / identity items (0 tech cost)

| Item | Type | Capability |
|---|---|---|
| Callsign: "The Unkillable" | Title | Built |
| Callsign: "Asteroid Hermit" | Title | Built |
| Callsign: "Deep Void Wanderer" | Title | Built |
| Callsign: "Apex Predator" | Title | Built |
| Callsign: "Silent Saint" | Title | Built |
| Profile Banner — Nebula | Banner | Buildable |
| Profile Banner — Battle Damaged Ship | Banner | Buildable |
| Profile Banner — Corporate Logo (custom) | Banner | Buildable |
| Nameplate — Gold Trim | Nameplate style | Buildable |
| Nameplate — Crimson Text | Nameplate style | Buildable |
| Nameplate — Pulsing Glow | Nameplate style | Buildable |
| Rank Badge — Platinum Wing | Rank cosmetic | Buildable |
| Rank Badge — Crimson Talon | Rank cosmetic | Buildable |

### Cockpit items

| Item | Type | Capability |
|---|---|---|
| Dashboard Lighting — Red | Cockpit effect | Buildable |
| Dashboard Lighting — Green | Cockpit effect | Buildable |
| Dashboard Lighting — Amber | Cockpit effect | Buildable |
| Cockpit Radio — Synthwave | Cockpit audio | Buildable |
| Cockpit Radio — Drone Ambient | Cockpit audio | Buildable |
| Cockpit Radio — Ship News | Cockpit audio | Buildable |
| Bobblehead — Classic Astronaut | Cockpit decoration | Buildable |
| Bobblehead — Alien Friend | Cockpit decoration | Buildable |
| Dashboard Photo — Custom Upload | Cockpit decoration | Buildable |
| Ship Nameplate — Custom Text | Hull text | Buildable |

### Audio items

| Item | Type | Capability |
|---|---|---|
| Engine Sound — Deep Rumble | Ship audio | Buildable |
| Engine Sound — High Whine | Ship audio | Buildable |
| Engine Sound — Silent Drive | Ship audio | Buildable |
| Weapon SFX — Heavy Thump | Weapon audio | Buildable |
| Weapon SFX — Laser Zap | Weapon audio | Buildable |
| Warp Sting — Classic | Warp audio | Buildable |
| Warp Sting — Void Echo | Warp audio | Buildable |
| Pilot Voice — Old Military | AI voice | Buildable |
| Pilot Voice — British Butler | AI voice | Buildable |
| Pilot Voice — Russian Cosmonaut | AI voice | Buildable |
| Pilot Voice — Robotic | AI voice | Buildable |

### Progression boosters (controversial, use carefully)

| Item | Type | Capability |
|---|---|---|
| GHAI 2x Booster (24h) | Consumable | Buildable |
| GHAI 2x Booster (7-day) | Consumable | Buildable |
| Card Pack Selector — Choose Set | Utility | Buildable |

### voidexa-unique items (nothing else does this)

| Item | Type | Capability |
|---|---|---|
| Last Words Message — Custom | Text cosmetic | Buildable |
| Warp Tunnel Skin — Rainbow | Warp visual | Buildable |
| Warp Tunnel Skin — Void Black | Warp visual | Buildable |
| Warp Tunnel Skin — Plasma Gold | Warp visual | Buildable |
| Scanner Pulse — Cyan | Scanner cosmetic | Buildable |
| Scanner Pulse — Red | Scanner cosmetic | Buildable |
| Landmark Naming Rights — Asteroid | Permanent name | Aspirational |
| Landmark Naming Rights — Nebula | Permanent name | Aspirational |
| Holo-Projector: Pet Dragon | Dock decoration | Aspirational |
| Death Replay Cinematic | Replay cosmetic | Aspirational |

### Aspirational items (future — require systems built)

| Item | Type | Blocks |
|---|---|---|
| Victory Roll Emote | Ship emote | Needs emote-system |
| Pilot Salute Emote | Ship emote | Needs emote-system |
| Any attachment (cannons, fins, antennas) | Hull attachment | Needs assembly-app fix |
| Pilot portrait / skin | Avatar | Needs pilot-character system |
| Voice line packs | Voice | Needs voice-line system |
| Ship DNA hybrid | Paint job | Needs hybrid-shader system |

---

# PART 4 — SHOP CATEGORIES (expanded from 7 to 12 tabs)

Current tabs: ALL · FEATURED · SHIPS · SKINS · TRAILS · CARD PACKS · COCKPITS

Proposed new tabs:

| Tab | Contents | Rationale |
|---|---|---|
| ALL | Everything | Keep |
| FEATURED | Rotating weekly highlights | Keep |
| SHIPS & SKINS | All hull-related | Merge existing |
| TRAILS & EFFECTS | Trails, boost glows, engine flames, reactor colors | Expand |
| CARD PACKS | Pack bundles | Keep |
| CARD COSMETICS | Card backs, frames, sleeves, battle boards | NEW — huge category |
| COCKPITS | Cockpit swaps, dashboards, bobbleheads | Expand |
| PROFILE | Titles, banners, nameplates, badges | NEW |
| AUDIO | Engine, weapon, warp, voice | NEW |
| BUNDLES | Multi-item packages | NEW |
| LIMITED | 48-72h only | Keep, make prominent |
| PREMIUM | High-price tier items | NEW |

---

# PART 5 — PRICING STRUCTURE

Based on earning rate ~200-300 GHAI/hour and $1=100 GHAI fixed rate.

## Price tiers by rarity:

| Rarity | GHAI range | USD equivalent | Grind time |
|---|---|---|---|
| Common | 50 | $0.50 | 10-15 min |
| Uncommon | 150 | $1.50 | 30-45 min |
| Rare | 300 | $3 | 1-1.5 hour |
| Epic | 600 | $6 | 2-3 hours |
| Legendary | 1000-1500 | $10-15 | 3-5 hours |
| Mythic | 2500-5000 | $25-50 | 8-25 hours |

## Price tiers by item type:

| Type | Expected price range |
|---|---|
| Ship skin | 50-1500 |
| Ship decal | 50-500 |
| Trail | 50-1000 |
| Effect | 100-600 |
| Cockpit | 150-1000 |
| Card back | 100-1000 |
| Battle board | 300-1500 |
| Title | 50-300 |
| Banner | 100-500 |
| Audio pack | 100-600 |
| Bundle | 199-2999 (discount from piecemeal) |
| Card pack (Standard) | 100 |
| Card pack (Premium) | 200-300 |
| Card pack (Ultimate) | 500 |
| Card pack (Legendary) | 1000 |

---

# PART 6 — ROTATION SYSTEM (Fortnite Model)

Shop refreshes AUTONOMOUSLY on a schedule. No manual selection needed.

## Daily Rotation (24h)
- 6 items refresh every 24 hours at 00:00 UTC
- Pulls from pool of ~200 total items
- Mix: 2 Common, 2 Uncommon, 1 Rare, 1 Epic
- Returns in rotation pool after 30 days

## Weekly Featured (7 days)
- 4 items displayed for 7 days, refresh Monday 00:00 UTC
- Higher-tier: 2 Epic, 1 Legendary, 1 Premium bundle
- Price slightly discounted from normal (incentive to buy during featured window)

## Limited Drops (48-72h)
- 1-2 items announced 24h in advance
- Available for 48-72 hours only
- After that, NEVER return (FOMO driver)
- Always Legendary or Mythic tier
- Used for special events, seasonals, anniversaries

## Seasonal Events (monthly theme)
- New theme each month: Halloween, Christmas, Anniversary, Summer, etc
- 10-20 themed items released at start of month
- Remain in shop for that month only
- Some items revive the following year ("Returning from last Halloween")

## "Just For You" Offers (personalized)
- Based on what the player plays most
- 2-3 items shown
- Discounted price
- Limited to 3-day window
- Hearthstone model

## Mystery Boxes
- Gacha-style: 5 random unowned items for fair fixed price
- Guaranteed 1 Rare+ in each box
- Monthly cap (max 3 boxes/month) to prevent whaling

---

# PART 7 — BUNDLES

Bundles give discount vs buying piecemeal. Drive volume.

## Starter Bundle (New Pilot)
- 199 GHAI
- 1 Uncommon ship skin + 5 standard card packs
- Current "Starter Pack" — keep

## Theme Bundles
- Pack of items around a theme (e.g., "Crimson Fleet Bundle" = red hull + red trail + red reactor glow + red card back)
- 30% discount vs piecemeal
- Rotated monthly

## Class Bundles
- Items tailored for each ship class (Fighter, Cruiser, Stealth, Tank, Racer)
- 5 class-matched items
- 30% discount

## Collector Bundles
- Full sets: all 6 card backs of a series, all 5 reactor glow colors, etc
- 25% discount + 1 bonus exclusive item

## Founder Bundles (limited, never return)
- For players who were active before major milestones
- Exclusive Founder's Edition cosmetics
- Signals "I was here early" — prestige

---

# PART 8 — ADVERTISEMENT IMPLEMENTATION DETAILS

## Orbital banner rings (technical)
- Sprite/plane geometry around planet, rendered in Free Flight
- Texture is the ad image (provided by advertiser)
- Rotates slowly on planet's orbital axis
- Visible from 2-5km game distance
- Performance-optimized: LOD (low detail far away)
- Admin UI for ad approval workflow
- Image specs: 2048x512 texture, seamless horizontal tile

## Station-interior advertising (technical)
- 2D image panels on station walls
- Rendered via HTML/CSS overlay when docked
- Auto-rotation every 15 seconds
- Player can click to visit advertiser URL (opens new tab)
- Analytics: track impressions + click-through

## Sponsored landmarks (technical)
- Existing landmark gets "Sponsored by X" tag when scanned
- Flavor text includes sponsor mention
- Lore integration (some sponsors get custom lore)

## Advertisement revenue flow
- Advertiser pays in USD via Stripe invoice (B2B model)
- voidexa keeps 85%, planet owner gets 15% if ad is on their planet
- Prices: Inner Ring $500/week, Mid Ring $250/week, Outer Ring $100/week
- Station interior: $50/week per panel
- Sponsored landmark: $300/month

---

# PART 9 — CREATOR ECONOMY IMPLEMENTATION

## Affiliate program
- Public signup at voidexa.com/creators
- Unique referral link generated
- Dashboard showing clicks, signups, earnings
- Payout: 10% of referred user's GHAI purchases for first 6 months
- Threshold: $50 minimum payout, monthly
- Model: RunPod 10% affiliate structure

## Designer marketplace
- Public submission portal at voidexa.com/designers
- Template kits for card backs, decals, battle boards, titles
- Review process: 14-day approval cycle
- If approved: 30% of every sale goes to designer
- Designer keeps ownership of design, voidexa gets distribution rights
- Inspired by Steam Workshop / Roblox UGC

## Content creator tier
- Official streamers/YouTubers get:
  - Early access to new features
  - Branded in-game title ("Official Creator")
  - Custom profile banner
  - Revenue share on any items they helped promote
- Application-based, not automatic

## Community quest creator
- Players design custom tracks, missions, encounters via tools
- Published via community portal
- Other players rate and play
- Creator earns 50 GHAI per play above threshold
- Featured creators get additional bonus

---

# PART 10 — VISUAL/UX STANDARDS

All shop UI must follow these rules (per voidexa non-negotiable UI standards):

- Body text minimum 16px
- Labels/badges minimum 14px
- Opacity minimum 0.5
- No text smaller than this anywhere
- "Powered by [Claude + GPT + Gemini] — orchestrated by voidexa" on any AI-generated cosmetics

Shop item card layout:
- Image (square, 400x400 minimum)
- Rarity badge (top left)
- Item type badge (top right)
- Name (prominent)
- Description (1-2 lines)
- Price (large, GHAI logo)
- BUY button

---

# PART 11 — PROMPT GENERATION READINESS

This document is the single source for shop item design. Future step: generate art prompts for each item.

Each item's art prompt will use:
- Item name → subject
- Item type → style constraints (ship skin = full ship, card back = square design, etc)
- Rarity → visual quality (Common = simple, Mythic = complex + particle effects)
- Description → specific details

Art prompt sprint runs AFTER this document is locked.

---

# PART 12 — BUILD ROADMAP (order of implementation)

**Phase A: Fix current shop (1 sprint)**
- Wire Stripe checkout for GHAI pack purchases
- Add Coming Soon badges to aspirational items OR remove them
- Deploy current 19 items as-is with proper tags

**Phase B: Expand buildable cosmetics (2-3 sprints)**
- Add new Ship decals (Tiger Stripes, Camo, etc)
- Add Ship effects (Neon Underglow, Reactor colors, Engine flames)
- Add Card cosmetics (backs, frames, battle boards)
- Add Profile items (titles, banners)

**Phase C: Rotation system (1 sprint)**
- Build auto-rotation backend
- Daily/weekly/limited mechanics
- Inventory management

**Phase D: Advertisement layer (2 sprints)**
- Orbital banner rings (3D asset + admin tool)
- Station interior panels
- Analytics + revenue tracking

**Phase E: Creator economy (3+ sprints)**
- Affiliate program
- Designer marketplace
- Community creator portal

**Phase F: Aspirational unlock (major builds)**
- Emote-system (enables Victory Roll, Pilot Salute, future emotes)
- Assembly-app fix (enables attachment items)
- Pilot-avatar system (enables pilot skins, voice packs)

---

# PART 13 — TOTAL CATALOG SIZE

Full catalog at completion:

- Ship skins + decals + effects: ~100 items
- Card cosmetics (backs, frames, boards, sleeves): ~80 items
- Trails + boosts + warp skins: ~40 items
- Cockpit items: ~30 items
- Profile items (titles, banners, badges): ~60 items
- Audio items: ~30 items
- Card packs: ~10 different packs
- Bundles: ~20 rotating bundles
- Advertisement slots: ~50 available positions
- Creator-submitted items: ~100+ (community-sourced)

**Total target: 400-500 shop items** when fully populated. Enough for Fortnite-style daily rotation to feel fresh for 60+ days without repeat.

---

**End of Shop Master Design Document.**

Next step: build Claude Code batch protocol for implementing this in voidexa.com (mirrors the card set master doc). Then art prompt generation sprint for Vast.ai rendering.
