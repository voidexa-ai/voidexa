# VOIDEXA STAR SYSTEM — SHIP CATALOG & ITEM ECONOMY
**Part 18: Asset Categorization, Pricing & PvP Token System**
**April 15, 2026 — v1.0**

---

## 1. SHIP RARITY TIERS

### COMMON (Free / Achievement rewards)
- Source: Quaternius Spaceships (11 models: Bob, Challenger, Dispatcher, etc.)
- Look: Simple, low-poly, material colors only (no PBR textures)
- Stats: Base level, balanced, nothing special
- How to get: Bob is free starter. Others unlocked via achievements
- Price if in shop: $0 (achievement only) or $0.50 for color variants
- These are ships NOBODY wants to use long-term — functional but boring

### UNCOMMON ($1-$2)
- Source: USC base variants (347 ships, grouped by ship class)
- Look: Decent detail, PBR textures, Grey base color
- Stats: Slightly better than Common in one area (speed OR hull OR shields)
- How to get: Shop purchase
- Note: Many USC ships are color variants — sell color swaps as separate $0.50 skins

### RARE ($2-$4)
- Source: USC unique designs + USC Expansion (58 ships)
- Look: Good detail, distinctive silhouettes, PBR textures
- Stats: Noticeably better than Uncommon, specialized roles
- How to get: Shop purchase, some from race wins

### EPIC ($4-$7)
- Source: Hi-Rez complete ships (Spaceship01-24 with interior)
- Look: High detail, full PBR with emission maps, cockpit interior visible
- Stats: Strong, clear specialization (fast racer, tanky hauler, agile fighter)
- How to get: Shop purchase
- Note: These have interiors — player sees cockpit when pressing V

### LEGENDARY ($8-$12) — NOT FREELY PURCHASABLE
- Source: Hand-picked best Hi-Rez ships + unique color variants
- Look: Best detail, unique effects (engine glow trails, hull shimmer)
- Stats: Best in class, but not overpowered (max 15% stat advantage over Epic)
- How to get: PvP PURCHASE TOKEN ONLY (see section 2)

### SOULBOUND (Cannot be traded/wagered/sold)
- Achievement ships: specific ships tied to achievement completion
- Story completion ship: "Chronicler's Vessel" for finishing all 5 story missions
- Cannot be put in shop, cannot be wagered in PvP, permanently bound to player

---

## 2. PvP LEGENDARY PURCHASE TOKEN SYSTEM

### How It Works
1. Player wins a PvP duel or tournament
2. System generates a "Legendary Access Token"
3. Token unlocks the Legendary section in the shop FOR THAT PLAYER ONLY
4. Player can now SEE and PURCHASE one Legendary ship
5. Token expires in 48 hours — buy or lose access

### Price Scaling Based on Match Status
| Match Situation | Price Modifier | Example ($12 base) |
|---|---|---|
| Fair match (±1 rank) | 100% (full price) | $12.00 |
| Slight underdog (-1 rank) | 85% | $10.20 |
| Big underdog (-2 ranks) | 70% | $8.40 |
| Massive underdog (-3+ ranks) | 50% | $6.00 |
| Favored (+1 rank) | 100% | $12.00 |
| Heavy favorite (+2+ ranks) | 120% (premium) | $14.40 |

### Token Rules
- One token per PvP win (not stackable — use it or lose it)
- 48-hour expiration from moment of win
- Token shows WHICH Legendary ships are available (rotates weekly)
- Tournament wins give CHOICE of any Legendary (no rotation limit)
- Cannot gift tokens to other players
- UI: golden notification banner "LEGENDARY ACCESS UNLOCKED — 47:59:32 remaining"

### Why This Works
- voidexa earns on EVERY Legendary (nothing free)
- Underdogs are rewarded with discounts (encourages risk-taking)
- Favorites pay premium (discourages stomping weaker players)
- 48-hour timer creates urgency
- Exclusivity maintained — you MUST win to even see Legendary ships
- Weekly rotation means not all Legendaries available at once

---

## 3. CARD ART FROM 3D ASSETS

### Weapon Models → Attack Cards
| Weapon Model | Card Name | Energy | Rarity |
|---|---|---|---|
| hirez_weapon_bigmachinegun.glb | Heavy Barrage | 4 | Rare |
| hirez_weapon_blaster.glb | Plasma Bolt | 2 | Common |
| hirez_weapon_missile.glb | Guided Missile | 3 | Uncommon |
| hirez_weapon_biglauncher.glb | Nova Launcher | 5 | Epic |
| hirez_weapon_trilauncher.glb | Triple Strike | 6 | Legendary |
| hirez_weapon_smallmachinegun.glb | Quick Shot | 1 | Common |
| hirez_weapon_smalllauncher.glb | Mini Rocket | 2 | Uncommon |

### Ship Parts → Defense/Tactical Cards
| Model Type | Card Concept | Category |
|---|---|---|
| hirez_mainbody (hull variants) | Shield Plating, Hull Reinforcement | Defense |
| hirez_wing (9 variants) | Evasive Maneuver, Wing Shield | Tactical |
| hirez_engine (11 variants) | Engine Boost, Emergency Thrust | Tactical |
| hirez_thruster (8 variants) | Barrel Roll, Quick Dodge | Tactical |

### Ship Models → Deployment Cards
| Ship Source | Card Concept |
|---|---|
| Small fighters (qs_striker, etc) | Deploy Fighter Drone |
| Capital ships (VoidWhale) | Call Reinforcements |
| Stealth ships | Cloaking Decoy |

### Rendering Card Art
- Render each 3D model at 512x512 PNG
- Dark background with colored glow matching rarity
- Dramatic angle (45° from front-below)
- Weapon cards: show weapon firing (add muzzle flash in post)
- Ship cards: show ship with engine glow trail
- Defense cards: show hull with shield bubble effect

---

## 4. SHOP ITEM STRUCTURE (from 689 models)

### Category: Ships (sellable)
- ~50 Uncommon ships (curated from 347 USC)
- ~20 Rare ships (curated from USC + Expansion)
- ~15 Epic ships (Hi-Rez with interior)
- ~5 Legendary ships (PvP token only)
- Total sellable ships: ~90

### Category: Ship Skins (color variants)
- Each ship has Black/Blue/Green/Grey/Red variants
- Sell color swaps at $0.50-$1 each
- Grey is default, others are premium colors
- Potential: 90 ships × 4 extra colors = 360 skins

### Category: Cockpit Themes
- 5 Hi-Rez cockpits as themes ($2-$5 each)
- Common: procedural cockpit (free)
- Uncommon-Epic: Hi-Rez cockpit 01-05

### Category: Trails/Effects
- Engine trails from thruster models
- Warp effects
- Shield bubble visual variants
- $1-$5 each

### Category: Card Packs
- Starter Pack: 5 cards, $1 (guaranteed 1 Uncommon+)
- Standard Pack: 5 cards, $2 (guaranteed 1 Rare+)
- Premium Pack: 5 cards, $5 (guaranteed 1 Epic+)
- Legendary Pack: 10 cards, $10 (guaranteed 1 Legendary)

### Category: Attachments (cosmetic)
- Antenna arrays, wing fins, weapon mounts (visual only)
- From Hi-Rez weapons + misc parts
- $1-$3 each

---

## 5. ITEMS THAT ARE NEVER SOLD

| Item Type | How to Get |
|---|---|
| Legendary ships | PvP Purchase Token only |
| Achievement ships | Complete specific achievements (soulbound) |
| Titles | Achievement fragments only |
| Alien Tech | Found in-game only (random spawn) |
| Rank badges | Earn through rank progression |
| Story rewards | Complete story mission chain |
| Daily challenge skins | Win daily challenge (limited 24hr to earn) |

---

## 6. NAV BAR RESTRUCTURE

### Current (15+ items — too many):
Home, AI Trading, Trading Hub, Apps, AI Tools, Services, Station, Quantum, Team, Break Room, Free Flight, Shop, Achievements, Void Chat

### New (5 groups):
- **Home**
- **Products** → Quantum, AI Trading, Trading Hub, AI Tools, Void Chat, Services
- **Universe** → Star Map, Free Flight, Shop, Achievements
- **About** → Team, Station, Apps, White Paper
- **Break Room**

### SEO: Unique Page Titles
- Home: "voidexa — Sovereign AI Infrastructure"
- Shop: "voidexa Shop — Ship Skins, Card Packs & Cosmetics"
- Free Flight: "voidexa Free Flight — Explore the Universe"
- Achievements: "voidexa Hall of Records — 23 Achievements"
- Star Map: "voidexa Galaxy — Explore the Star System"
- Quantum: "voidexa Quantum — Multi-AI Debate Engine"
- AI Trading: "voidexa AI Trading — Autonomous Crypto Bot"

---

## 7. SHOP REDESIGN PRINCIPLES (Fortnite-inspired)

1. TABS not scroll — "Featured", "Ships", "Skins", "Trails", "Card Packs", "Cockpits"
2. LARGE preview images — not small cards with emoji icons
3. 3D rotating preview on click — drag to rotate ship
4. MAX 6-8 items visible per section
5. Daily rotation timer LARGE at top
6. "Try in Free Flight" button on ship previews
7. Rarity glow borders (keep current system)
8. Prices lowered for launch (see Section 4)
9. Starter Pack banner: "$1.99 — 1 Uncommon Ship + 5 Card Packs"
10. PvP Token section: golden banner only visible to token holders
