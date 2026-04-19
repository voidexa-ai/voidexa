# VOIDEXA IN-GAME SHOP MASTER DESIGN DOCUMENT

**Scope:** In-game cosmetics shop only. Accessed from inside the game (docked at stations, cockpit menu, or /shop route).

**Target audience:** Active players who already play voidexa.

**Not covered here:** Claim Your Planet, advertisement, creator economy, reseller programs. See `VOIDEXA_BUSINESS_PORTAL_MASTER.md` for those.

---

# PART 1 — PHILOSOPHY

Non-negotiable rules:

1. **No pay-to-win.** Gameplay earns stats. Shop sells looks, identity, audio.
2. **GHAI only.** All prices in GHAI. GHAI bought in Fortnite-style fixed packs ($5=500, $10=1000, $25=2500+bonus).
3. **Every item must have a working game capability behind it.** Tagged Built / Buildable / Aspirational. Nothing ships to shop without a working system.
4. **Fortnite-style auto-rotation.** Shop refreshes on schedule, not manually.
5. **UI standards locked:** body text 16px+, labels 14px+, opacity 0.5+.

---

# PART 2 — CAPABILITY TAGS

- **Built** = works in current game engine today
- **Buildable** = can ship in 1-2 sprints without new systems
- **Aspirational** = requires a system that doesn't exist yet (emote-system, assembly-app fix, pilot-avatar system)

Aspirational items do NOT ship until the underlying system exists.

---

# PART 3 — AUDIT OF CURRENT 19 ITEMS

| Item | Tag | Action |
|---|---|---|
| Starter Pack Bundle | Built | Keep |
| Ion Corona (Effect) | Buildable | Keep |
| Obsidian Stealth Coating | Built | Keep |
| Ultimate Card Pack | Built | Keep (wire Stripe on GHAI top-up) |
| Aurora Legendary Trail | Built | Keep |
| Voidrunner Legendary Hull | Built | Keep |
| Gilded Cockpit | Built | Keep |
| **Victory Roll (Emote)** | **Aspirational** | Delist OR "Coming Soon" pre-order |
| Chrome Cruiser Plating | Built | Keep |
| **Ornamental Cannons** | **Aspirational** | Delist — needs assembly-app fix |
| Carbon Fiber Cockpit | Built | Keep |
| Nebula Wake (Effect) | Built | Keep |
| Premium Card Pack | Built | Keep |
| **Sensor Antenna Array** | **Aspirational** | Delist — needs assembly-app |
| Solar Flare Trail | Built | Keep |
| Blue Ion Trail | Built | Keep |
| **Pilot Salute (Emote)** | **Aspirational** | Delist OR "Coming Soon" |
| Standard Card Pack | Built | Keep |
| Crimson Fighter Skin | Built | Keep |
| **Swept Wing Fins** | **Aspirational** | Delist — needs assembly-app |
| Warp Bloom (Effect) | Buildable | Keep |

**5 items to delist / flag Coming Soon until systems exist.**

---

# PART 4 — CATEGORIES (12 tabs)

| Tab | Contents |
|---|---|
| ALL | Everything |
| FEATURED | Rotating weekly spotlights |
| SHIPS & SKINS | Hull skins, decals, patterns |
| TRAILS & EFFECTS | Trails, reactor glow, engine flames, warp skins, shields |
| CARD PACKS | Booster pack bundles |
| CARD COSMETICS | Card backs, frames, sleeves, battle boards |
| COCKPITS | Cockpit swaps, dashboards, bobbleheads |
| PROFILE | Titles, banners, nameplates, badges |
| AUDIO | Engine sounds, weapon SFX, warp stings, pilot voice |
| BUNDLES | Multi-item discount packages |
| LIMITED | 48-72h only, never return |
| PREMIUM | High-price tier |

---

# PART 5 — ITEM CATALOG (Built/Buildable only)

## 5A — Ship hull visuals

| Item | Type | Tag |
|---|---|---|
| Tiger Stripes | Decal | Built |
| Digital Camouflage | Decal | Built |
| Carbon Weave Pattern | Decal | Built |
| Racing Stripes (5 colors) | Decal | Built |
| Skull Nose Art | Decal | Built |
| Pin-up Nose Art | Decal | Built |
| Neon Underglow (8 colors) | Effect | Buildable |
| Canopy Tint — Gold / Chrome / Smoked | Cockpit | Buildable |
| Reactor Glow — Purple / Green / White / Red / Cyan | Effect | Built |
| Engine Flame — Purple / Green / White / Blue | Effect | Built |
| Hull Wear — Veteran Scars | Skin | Built |
| Hull Wear — Pristine Showroom | Skin | Built |
| Muzzle Flash — Blue / Red / Green / Purple | Weapon FX | Buildable |
| Shield Bubble Color — Blue / Amber / Pink / Cyan | Defense FX | Buildable |
| Exhaust Smoke Trail | Effect | Buildable |

## 5B — Card cosmetics (huge category, low build cost)

| Item | Type | Tag |
|---|---|---|
| Card Back — Starfield / Holographic / Voidexa Emblem / Neon Grid / Ancient Runes | Card back | Buildable |
| Card Frame — Gold / Silver Chrome / Neon Purple / Holographic | Frame | Buildable |
| Battle Board — Bridge Command / Deep Void / Hangar / Asteroid Belt / Ancient Station | Board | Buildable |
| Battle Music — Combat Pulse / Cold War / Victory Symphony | Audio | Buildable |
| Victory Screen — Fireworks / Warp Jump / Hologram Trophy | Theme | Buildable |
| Damage Numbers — Neon Cyan / Blood Red / Classic | UI | Buildable |
| Targeting Reticle — Military / Hologram / Minimalist | UI | Buildable |

## 5C — Profile / identity (0 tech cost)

| Item | Type | Tag |
|---|---|---|
| Callsigns (20+ titles) | Title | Built |
| Profile Banner — Nebula / Battle Damaged / Custom | Banner | Buildable |
| Nameplate — Gold Trim / Crimson Text / Pulsing Glow | Style | Buildable |
| Rank Badge — Platinum Wing / Crimson Talon | Cosmetic | Buildable |

## 5D — Cockpit items

| Item | Type | Tag |
|---|---|---|
| Dashboard Lighting — Red / Green / Amber / Blue | Effect | Buildable |
| Cockpit Radio — Synthwave / Drone / Ship News | Audio | Buildable |
| Bobblehead — Astronaut / Alien / Custom | Decoration | Buildable |
| Dashboard Photo Upload | Decoration | Buildable |
| Ship Hull Nameplate — Custom Text | Hull | Buildable |

## 5E — Audio

| Item | Type | Tag |
|---|---|---|
| Engine Sound — Deep Rumble / High Whine / Silent Drive | Audio | Buildable |
| Weapon SFX — Heavy Thump / Laser Zap / Sharp Crack | Audio | Buildable |
| Warp Sting — Classic / Void Echo / Plasma Roar | Audio | Buildable |
| Pilot Voice — Old Military / Butler / Cosmonaut / Robotic | Voice | Buildable |

## 5F — voidexa-unique (no other game has these)

| Item | Type | Tag |
|---|---|---|
| Last Words Message (custom text on defeat) | Text | Buildable |
| Warp Tunnel Skin — Rainbow / Void Black / Plasma Gold | Visual | Buildable |
| Scanner Pulse Color — Cyan / Red / Purple | Scanner | Buildable |
| Death Replay Cinematic Style | Replay | Aspirational |

---

# PART 6 — PRICING

Based on earning rate ~200-300 GHAI/hour.

| Rarity | GHAI | USD | Grind time |
|---|---|---|---|
| Common | 50 | $0.50 | 10-15 min |
| Uncommon | 150 | $1.50 | 30-45 min |
| Rare | 300 | $3 | 1-1.5 h |
| Epic | 600 | $6 | 2-3 h |
| Legendary | 1000-1500 | $10-15 | 3-5 h |
| Mythic | 2500-5000 | $25-50 | 8-25 h |

Category specifics:
- Ship skin: 50-1500
- Decal: 50-500
- Trail: 50-1000
- Effect: 100-600
- Cockpit swap: 150-1000
- Card back: 100-1000
- Battle board: 300-1500
- Title: 50-300
- Banner: 100-500
- Audio pack: 100-600
- Bundle: 199-2999 (discount vs piecemeal)
- Card pack Standard/Premium/Ultimate/Legendary: 100/200-300/500/1000

---

# PART 7 — ROTATION SYSTEM (Fortnite-style)

## Daily Rotation (24h)
- 6 items refresh every 24h at 00:00 UTC
- Pool: ~200 items
- Mix: 2 Common, 2 Uncommon, 1 Rare, 1 Epic
- Return to rotation after 30 days

## Weekly Featured (7 days)
- 4 items displayed Monday 00:00 UTC for 7 days
- 2 Epic, 1 Legendary, 1 Premium bundle
- Slight discount vs normal price

## Limited Drops (48-72h)
- 1-2 items, announced 24h ahead
- Legendary/Mythic tier only
- Never returns after window
- FOMO driver

## Seasonal (monthly theme)
- New theme: Halloween, Christmas, Anniversary, Summer, Expansion launch
- 10-20 themed items
- Some return next year ("Returning from last Halloween")

## Just For You (personalized)
- 2-3 items based on play patterns
- 3-day window
- Discounted

## Mystery Boxes (gacha)
- 5 random unowned items, fixed price
- Guaranteed 1 Rare+
- Max 3/month per account

---

# PART 8 — BUNDLES

| Bundle type | Description |
|---|---|
| Starter | New pilot: 1 Uncommon skin + 5 card packs, 199 GHAI, 70% vs piecemeal |
| Theme | "Crimson Fleet" = red hull + red trail + red reactor + red card back, 30% off |
| Class | 5 items tailored to Fighter / Cruiser / Stealth / Tank / Racer, 30% off |
| Collector | Full sets of a series, 25% off + 1 bonus exclusive |
| Founder | Pre-milestone players only, never return, prestige signal |

---

# PART 9 — TOTAL CATALOG SIZE

Target at full launch:

- Ship skins + decals + effects: ~100
- Card cosmetics: ~80
- Trails + warp skins: ~40
- Cockpit items: ~30
- Profile items: ~60
- Audio items: ~30
- Card packs: ~10
- Bundles: ~20 rotating

**Total: ~370 items.** Enough for 60+ days of daily rotation without repeats.

---

# PART 10 — BUILD ROADMAP

**Phase A (1 sprint):** Fix current shop
- Wire Stripe on GHAI top-up pages
- Delist or "Coming Soon" tag the 5 aspirational items
- Deploy cleaned catalog

**Phase B (2-3 sprints):** Expand buildable cosmetics
- New decals + effects + reactor colors + engine flames
- New card cosmetics (backs, frames, boards)
- Profile items (titles, banners)

**Phase C (1 sprint):** Auto-rotation backend
- Daily / weekly / limited mechanics
- Inventory management
- Just For You personalization

**Phase D (future):** Unlock aspirational tier
- Emote-system (enables Victory Roll, Pilot Salute, future emotes)
- Assembly-app fix (enables attachments)
- Pilot-avatar system (enables pilot skins, voice packs)

---

# PART 11 — CLAUDE CODE BATCH PROTOCOL (future sprint)

When implementing items in voidexa.com codebase, use batch structure:

- Batch of 30-50 items per sprint
- Each item in JSON matching existing shop item schema
- After batch: run validation (unique IDs, capability tag present, pricing within band)
- Stop and await Jix approval before next batch
- Branch: `shop-expansion` (never push direct to main)

---

# PART 12 — LINK TO BUSINESS PORTAL

If a company buys an advertisement slot via `VOIDEXA_BUSINESS_PORTAL_MASTER.md`, their ad appears in-game as orbital banner ring or station panel. This in-game shop does NOT sell advertisement slots — those are B2B and live in the business portal.

Similarly, creator-designed cosmetics (from the designer marketplace in the business portal) enter this in-game shop once approved, and the designer earns revenue share per sale.

**End of in-game shop master.**
