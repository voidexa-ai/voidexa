# VOIDEXA IN-GAME SHOP ALPHA — MASTER DESIGN DOCUMENT

**Purpose:** Complete specification for a full in-game shop rebuild. Claude Code uses this as CLAUDE.md + SKILL.md to generate shop items in batches, with mandatory stop/validation gates.

**Target:** ~400 unique shop items covering all in-game cosmetic categories.

**Scope:** This is a complete REDO of the current shop. Nothing from the current 19-item shop is preserved. Clean slate.

**Not in scope:** Claim Your Planet, advertisement, creator economy — see `business_portal_master.md`.

---

# PART 1 — GAME CONTEXT (Claude Code MUST read this before designing items)

Two pilots face each other in space in turn-based card combat. Outside card combat, players fly freely in a 1-hour-radius sphere universe with 5 zones (Core → Inner → Mid → Outer → Deep Void).

**Where shop items are VISIBLE:**
1. **Free Flight** — ship hull, trails, reactor glow, engine flames, scanner pulses, warp tunnels
2. **Cockpit (first-person view)** — cockpit model, dashboard lighting, bobbleheads, cockpit radio
3. **Card Battle Scene** — card backs, card frames, battle boards, battle music, victory/defeat screens, damage numbers, targeting reticles
4. **Profile Screens** — titles, banners, nameplates, rank badges
5. **Universe Interactions** — last-words messages (shown when defeated), custom ship nameplate visible to other pilots
6. **Audio Systems** — engine sounds, weapon SFX, warp stings, pilot voice lines

**Where shop items CANNOT currently exist (Aspirational only):**
- Emote-system (no animation system for ship rolls, salutes, etc.)
- Hull attachments (assembly-app doesn't work — no attachment mount points on 3D models)
- Pilot-avatar system (pilot is just a profile, not a character)

---

# PART 2 — THE 5 CAPABILITY TIERS

Every shop item MUST be tagged with a capability tier. Items only ship at tier 1-3.

| Tier | Meaning | Ship? |
|---|---|---|
| **T1 — Built** | System exists in game today, item is ready to ship | Yes |
| **T2 — Buildable-Simple** | 1 sprint to add system (shader swap, texture overlay, UI theme) | Yes after sprint |
| **T3 — Buildable-Complex** | 2-3 sprints (new audio pipeline, custom text system, UI overlay category) | Yes after sprint |
| **T4 — Aspirational-Small** | Requires system that doesn't exist (emote-system) | No — park for future |
| **T5 — Aspirational-Large** | Requires major game system (pilot avatar, assembly-app rebuild) | No — park for future |

Claude Code never generates T4 or T5 items in the shop. They live in the `aspirational_backlog.md` file for future unlocking.

---

# PART 3 — THE 10 SHOP CATEGORIES

| # | Category | Tab in shop UI |
|---|---|---|
| 1 | Ship Skins & Decals | SHIPS & SKINS |
| 2 | Trails & Effects | TRAILS & EFFECTS |
| 3 | Card Cosmetics | CARD COSMETICS |
| 4 | Cockpits & Interior | COCKPITS |
| 5 | Profile & Identity | PROFILE |
| 6 | Audio & Voice | AUDIO |
| 7 | Card Packs | CARD PACKS |
| 8 | Bundles | BUNDLES |
| 9 | Limited Drops | LIMITED |
| 10 | Premium Tier | PREMIUM |

Plus 2 navigation tabs: ALL, FEATURED.

---

# PART 4 — RARITY DISTRIBUTION

Based on ~400 total items:

| Rarity | Count | % | Drop weight in rotation |
|---|---|---|---|
| Common | 160 | 40% | High (appears often) |
| Uncommon | 112 | 28% | Medium-high |
| Rare | 64 | 16% | Medium |
| Epic | 36 | 9% | Low |
| Legendary | 20 | 5% | Very low |
| Mythic | 8 | 2% | Ultra-rare, usually Limited |

---

# PART 5 — CATEGORY DISTRIBUTION

| Category | Count | % | Reasoning |
|---|---|---|---|
| Ship Skins & Decals | 80 | 20% | Core cosmetic, visible constantly in Free Flight |
| Trails & Effects | 60 | 15% | Visible constantly, wide variety |
| Card Cosmetics | 80 | 20% | Huge potential, low build cost |
| Cockpits & Interior | 40 | 10% | Personal, first-person view |
| Profile & Identity | 50 | 12% | Zero tech cost, high identity value |
| Audio & Voice | 30 | 8% | Immersion boost |
| Card Packs | 10 | 2% | Small number, used heavily |
| Bundles | 30 | 8% | Rotating collections |
| Limited Drops | 15 | 4% | Seasonal / event items |
| Premium Tier | 5 | 1% | High-price signature items |
| **Total** | **400** | **100%** | |

---

# PART 6 — PRICING STRUCTURE (GHAI)

Based on earning rate ~200-300 GHAI/hour. $1 = 100 GHAI fixed.

| Rarity | Min price | Max price | Grind time equivalent |
|---|---|---|---|
| Common | 50 | 100 | 10-30 min |
| Uncommon | 100 | 250 | 30-60 min |
| Rare | 250 | 500 | 1-2 hours |
| Epic | 500 | 1000 | 2-5 hours |
| Legendary | 1000 | 2500 | 5-12 hours |
| Mythic | 2500 | 5000 | 12-25 hours |

Category-specific pricing:
- Titles: 50-300 (always cheap, always available)
- Banners: 100-500
- Card backs: 100-1000
- Battle boards: 300-1500
- Ship skins: 50-1500
- Trails: 50-1000
- Bundles: 199-2999 (always discounted vs piecemeal)
- Card packs: Standard 100, Premium 200, Ultimate 500, Legendary 1000

---

# PART 7 — THE ITEM SCHEMA

Every shop item uses this JSON structure. Claude Code generates in this exact format.

```json
{
  "id": "lowercase_snake_case_id",
  "name": "Display Name",
  "category": "ship_skin | decal | trail | effect | cockpit | interior_decor | card_back | card_frame | battle_board | battle_music | victory_screen | damage_numbers | targeting_reticle | title | banner | nameplate | rank_badge | engine_sound | weapon_sfx | warp_sting | pilot_voice | card_pack | bundle | warp_tunnel | scanner_pulse | last_words | custom_nameplate | dashboard_lighting | cockpit_radio | bobblehead",
  "tab": "SHIPS_AND_SKINS | TRAILS_AND_EFFECTS | CARD_COSMETICS | COCKPITS | PROFILE | AUDIO | CARD_PACKS | BUNDLES | LIMITED | PREMIUM",
  "rarity": "common | uncommon | rare | epic | legendary | mythic",
  "capability_tier": "T1 | T2 | T3",
  "price_ghai": 50-5000,
  "description": "1-2 lines of shop-visible copy",
  "flavor_text": "Italic one-liner, sci-fi voice, 8-15 words",
  "game_visibility": ["free_flight" | "cockpit_first_person" | "card_battle" | "profile" | "universe_scan" | "audio"],
  "rotation_pool": "daily | weekly_featured | limited | seasonal | always_available | premium",
  "limited_drop_duration_hours": null | 48 | 72,
  "seasonal_theme": null | "halloween" | "christmas" | "anniversary" | "summer" | "expansion_launch",
  "unlocks": null | "achievement_id_if_grind_reward",
  "art_prompt_hints": "Keywords for Vast.ai art generation: subject, style, color palette, mood"
}
```

---

# PART 8 — DESIGN RULES

## Rule 1 — Every item must have game visibility
No "invisible" items. Each item appears in at least one game context (Free Flight, Cockpit, Card Battle, Profile, Universe, Audio).

## Rule 2 — Rarity reflects visual complexity AND impact
- Common: simple color swap, single-asset
- Uncommon: mild visual flair, single particle effect
- Rare: custom animation or shader, multi-layered
- Epic: multi-component (e.g., trail + glow + sound combination)
- Legendary: signature design, highly visible, themed
- Mythic: game-changing visual presence, complete package

## Rule 3 — Flavor text mandatory
Every item has flavor text. 8-15 words. Cold sci-fi voice or first-person pilot quote. No game mechanics in flavor text. No duplicates across the entire catalog.

## Rule 4 — Price matches grind time
Check the rarity price band in Part 6. Deviate only for Limited/Mythic (can exceed band).

## Rule 5 — Capability tier locks availability
T1 items ship immediately. T2 items wait for their sprint. T3 items wait for their sprint. T4/T5 items never enter the shop catalog — they go to `aspirational_backlog.md`.

## Rule 6 — Category distribution per batch
For every batch of 40 items, target ~20% ship skins, ~15% trails, ~20% card cosmetics, ~10% cockpits, ~12% profile, ~8% audio, remainder other. Prevents accidental over-concentration.

## Rule 7 — Art prompt hints required
Every item has 1 line of art prompt hints for the later Vast.ai rendering sprint. Claude Code writes these as: "subject keywords, style descriptor, color palette, mood/feel". Example: "sleek black starfighter, chrome detailing, polished obsidian surface, sinister stealth aesthetic."

## Rule 8 — No duplicate names
Every item name unique across the catalog.

## Rule 9 — Tab alignment
Category and tab must be consistent. Ship skins always go in SHIPS_AND_SKINS tab, etc. One exception: Bundles can contain any category.

## Rule 10 — Seasonal items flagged
Items tagged seasonal_theme must also have rotation_pool=seasonal. Halloween items do not appear in daily rotation — they wait for October.

---

# PART 9 — FULL ITEM CATALOG REFERENCES

Exact items by category (T1-T3 only, ready for Claude Code to flesh out to 400 total):

## 9A — Ship Skins & Decals (80 items target)

Common (32):
Crimson Fighter, Glacier Blue, Jungle Camouflage, Desert Tan, Obsidian Black, Arctic White, Neon Pink, Solar Yellow, Forest Green, Ocean Teal, Lavender Mist, Sunset Orange, Midnight Navy, Ash Grey, Rust Copper, Electric Cyan... (continue to 32)

Uncommon (22):
Tiger Stripes, Digital Camo, Carbon Weave, Racing Stripes Red, Racing Stripes Blue, Skull Nose Art, Flame Decal, Arrow Decal, Hexagon Pattern, Wave Pattern, Circuit Board Texture... (continue)

Rare (14):
Chrome Cruiser Plating, Holographic Shift Shell, Iridescent Nebula Paint, Bio-Luminescent Hull, Void-Absorbing Matte...

Epic (8):
Obsidian Stealth Coating, Ion Corona Casing, Quantum Ripple Finish, Prismatic Dragon Scale...

Legendary (3):
Voidrunner Legendary Hull (animated star-map etching), Phoenix Rising Hull, Ancient Relic Restoration...

Mythic (1):
Singularity Echo (reality-bending shader that shimmers with quantum noise)

## 9B — Trails & Effects (60 items target)

Common (24):
Blue Ion Trail, Red Plasma Trail, Green Acid Trail, Purple Void Trail, White Starlight Trail, Yellow Solar Trail, Orange Flame Trail... (continue)

Uncommon (17):
Nebula Wake, Solar Flare Trail, Cosmic Ribbon, Ion Storm Trail, Reactor Glow Purple, Reactor Glow Green, Reactor Glow White, Engine Flame Purple, Engine Flame Green, Engine Flame White, Muzzle Flash Red, Muzzle Flash Blue, Muzzle Flash Green, Shield Bubble Blue, Shield Bubble Pink, Shield Bubble Amber, Exhaust Smoke Trail

Rare (10):
Neon Underglow Pink, Neon Underglow Cyan, Neon Underglow Green, Neon Underglow Orange... Warp Bloom, Scanner Pulse Cyan, Scanner Pulse Red, Scanner Pulse Purple

Epic (6):
Ion Corona Aura, Plasma Corona Aura, Gravity Well Effect, Phase Shimmer, Quantum Spark Trail, Antimatter Exhaust

Legendary (2):
Aurora Legendary Trail (rotating rainbow aurora), Event Horizon Trail (pulls in starlight behind ship)

Mythic (1):
Singularity Wake (black hole effect trailing the ship — unique visual tech)

## 9C — Card Cosmetics (80 items target)

Card Backs — 20 items (Common to Mythic spread):
Starfield, Holographic, Voidexa Emblem, Neon Grid, Ancient Runes, Nebula Swirl, Circuit Pattern, Obsidian Obsidian, Crimson Flame, Arctic Ice... (continue to 20)

Card Frames — 15 items:
Gold Border, Silver Chrome, Neon Purple, Holographic, Minimalist Black, Ancient Gold, Obsidian Edge, Crystal Cut, Glitch Frame...

Battle Boards — 20 items:
Bridge Command, Deep Void, Hangar Bay, Asteroid Belt, Ancient Station, Nebula Core, Crystal Cavern, Abandoned Fleet, Orbital Dock, Warp Gate Interior... (continue)

Battle Music — 10 items:
Combat Pulse, Cold War, Victory Symphony, Void Ambient, Synth Warfare, Orchestral Battle, Industrial Combat, Ethereal Battle, Dark Ambient, Heroic Charge

Victory/Defeat Screens — 8 items:
Fireworks Victory, Warp Jump Victory, Hologram Trophy Victory, Fade to Stars Victory, Static Signal Defeat, Self-Destruct Defeat, Graceful Exit Defeat, Heroic Last Stand Defeat

Damage Numbers & Reticles — 7 items:
Damage Numbers Neon Cyan, Blood Red, Classic White, Gold Glitter, Targeting Reticle Military, Hologram, Minimalist

## 9D — Cockpits & Interior (40 items target)

Cockpit models — 8 items:
Gilded Cockpit, Carbon Fiber Cockpit, Industrial Rust Cockpit, Pristine Chrome Cockpit, Ancient Relic Cockpit, Crystal Cathedral Cockpit, Minimalist Glass Cockpit, Battle-Worn Veteran Cockpit

Dashboard Lighting — 8 items (color variants):
Red, Green, Amber, Blue, Purple, White, Pulsing Rainbow, Stealth Black

Canopy Tints — 6 items:
Gold, Chrome, Smoked, Blood Red, Ocean Blue, Iridescent

Bobbleheads — 10 items:
Classic Astronaut, Alien Friend, Jix Miniature, Voidexa Logo, Luck Dragon, Void Crab, Mini Ship Model, Dice, Miniature Star, Rubber Duck

Dashboard Photos — 4 items:
Custom Upload Slot, Family Photo Frame, Pet Portrait, Ship Factory Photo

Cockpit Audio Ambience — 4 items:
Engine Hum Loop, Radio Static, Deep Space Silence, Storm Ambient

## 9E — Profile & Identity (50 items target)

Callsigns / Titles — 30 items:
The Unkillable, Asteroid Hermit, Deep Void Wanderer, Apex Predator, Silent Saint, Iron Pilot, Glass Cannon, Nebula Prophet, Void Dancer, First Wave Veteran, The Last Stand, Reactor Riot, Warp Whisperer, Phantom Ace, Deadshot... (continue to 30)

Profile Banners — 12 items:
Nebula Banner, Battle Damaged Banner, Corporate Logo Slot, Crimson Flame, Void Black, Arctic Blue, Golden Ascension, Starfield Calm, Asteroid Storm, Solar Eclipse, Phoenix Rebirth, Quantum Grid

Nameplate Styles — 6 items:
Gold Trim, Crimson Text, Pulsing Glow, Holographic Shift, Plain Elite, Battle-Scarred Look

Rank Badges — 2 items (prestige variants only; earned badges from gameplay don't go in shop):
Platinum Wing Cosmetic Variant, Crimson Talon Cosmetic Variant

## 9F — Audio & Voice (30 items target)

Engine Sounds — 6 items:
Deep Rumble, High Whine, Silent Drive, Jet Turbine, Old Diesel, Whisper-Quiet

Weapon SFX — 8 items:
Heavy Thump, Laser Zap, Sharp Crack, Plasma Hiss, Kinetic Punch, Electric Screech, Muffled Boom, Crystal Chime

Warp Stings — 4 items:
Classic, Void Echo, Plasma Roar, Glass Shatter

Pilot Voice Packs — 8 items:
Old Military, British Butler, Russian Cosmonaut, Robotic Monotone, Southern Drawl, French Philosopher, Japanese Anime Hero, Gravelly Veteran

Hull Impact Sounds — 4 items:
Metal Scream, Dull Thud, Shattered Crystal, Warped Echo

## 9G — Card Packs (10 items)

Standard Pack (100 GHAI) — 4 Common + 1 guaranteed Uncommon
Premium Pack (200 GHAI) — 3 Common + 1 Uncommon + 1 guaranteed Rare
Ultimate Pack (500 GHAI) — 2 Uncommon + 2 Rare + 1 guaranteed Epic
Legendary Pack (1000 GHAI) — 2 Rare + 2 Epic + 1 chance at Legendary
Mythic Pack (2500 GHAI) — 3 Epic + 1 Legendary + 1 chance at Mythic
Seasonal Pack variants (5 rotating themes): Halloween Pack, Christmas Pack, Anniversary Pack, Summer Pack, Expansion Launch Pack

## 9H — Bundles (30 items target)

Starter Bundle (199 GHAI) — existing starter
Class Bundles (5): Fighter Bundle, Cruiser Bundle, Stealth Bundle, Tank Bundle, Racer Bundle
Theme Bundles (10 rotating): Crimson Fleet, Void Walker, Ancient Relic, Neon Dreams, Corporate Chrome, Battle-Tested, Deep Void Explorer, Stellar Storm, Quantum Flux, Phoenix Rising
Collector Bundles (8): Full card back sets, full reactor glow set, full engine flame set, full cockpit set, full voice pack set, full trail set, full battle board set, full banner set
Founder Bundles (6): limited — for pre-launch and milestone commemoration

## 9I — Limited Drops (15 items target)

48-72h only, never return. Legendary/Mythic tier only.

Halloween drops (3): Pumpkin Hull, Ghost Trail, Nightmare Cockpit
Christmas drops (3): Santa Hat Cockpit Topper, Reindeer Trail, Snowstorm Battle Board
Anniversary drops (3): Founder Phoenix, Anniversary Banner, First Year Trail
Summer drops (3): Tropical Hull, Beach Vibes Bobblehead, Sunset Trail
Expansion Launch drops (3): New-set themed items

## 9J — Premium Tier (5 items target)

Mythic-tier signature items always available (no rotation):
Quantum Core Singularity Hull (most expensive at 5000 GHAI)
Reality Bender Card Back
Event Horizon Battle Board
Transcendent Pilot Voice Pack
Infinity Bundle (bundles ALL other Mythic items at slight discount)

---

# PART 10 — ROTATION ASSIGNMENTS

Each item gets a rotation_pool value. Distribution target:

| Pool | Count | Behavior |
|---|---|---|
| always_available | 40 | Card packs, titles, basic bundles — no rotation |
| daily | 160 | Pool of 160 items — 6 shown per day, refreshes 24h |
| weekly_featured | 60 | Pool of 60 — 4 shown per week |
| limited | 15 | Scheduled 48-72h drops |
| seasonal | 40 | Only active during their theme month |
| premium | 5 | Always available, high price |
| bundles (rotating) | 30 | Pool of 30 bundles, rotate weekly |
| milestone/reward | 50 | Not shop-bought, earned via gameplay (tracked here for art generation) |

Total: 400

---

# PART 11 — CLAUDE CODE EXECUTION PROTOCOL

## Batch structure

Claude Code generates items in **batches of 40**. After each batch:

1. Output full batch as JSON to `docs/shop_alpha/batch_NN.json`
2. Append one-line summary per item to `docs/shop_alpha/MASTER_INDEX.md`
3. Run validation script (see Rule Validation below)
4. **STOP execution**
5. Write summary message: "Shop Batch NN complete. X items generated. Y validation warnings. Awaiting Jix approval before batch NN+1."

Jix reviews batch. Only after Jix types "approve" does Claude Code proceed.

## Batch plan (10 batches × 40 items = 400 items)

| Batch | Focus | Items |
|---|---|---|
| 01 | Ship Skins & Decals — Common + Uncommon | 40 |
| 02 | Ship Skins & Decals Rare+ + Trails Common | 40 |
| 03 | Trails & Effects Uncommon to Mythic | 40 |
| 04 | Card Cosmetics — Card Backs + Frames | 40 |
| 05 | Card Cosmetics — Battle Boards + Music + Screens | 40 |
| 06 | Cockpits & Interior — all rarities | 40 |
| 07 | Profile & Identity — Titles + Banners + Nameplates | 40 |
| 08 | Audio & Voice — all audio types | 40 |
| 09 | Card Packs + Bundles | 40 |
| 10 | Limited + Premium + Seasonal + Milestone rewards | 40 |

## Validation checks Claude Code runs per batch

1. Every item has valid id, name, category, tab, rarity, capability_tier, price, description, flavor_text, game_visibility, rotation_pool, art_prompt_hints
2. id is lowercase_snake_case, unique across entire catalog (vs earlier batches)
3. rarity distribution in batch approximately tracks Part 4 ratios
4. category distribution in batch approximately tracks Part 5 ratios
5. price within rarity band from Part 6
6. capability_tier is T1, T2, or T3 only (never T4 or T5)
7. flavor_text is 8-15 words, never duplicated across entire catalog
8. name never duplicated across entire catalog
9. category matches tab per Part 9 listings
10. art_prompt_hints has subject + style + color palette + mood

Any warnings → list them in summary message.

## Output structure

```
docs/shop_alpha/
  MASTER_DESIGN_DOCUMENT.md       (this file, never overwritten)
  batch_01.json
  batch_02.json
  ...
  batch_10.json
  MASTER_INDEX.md                  (appended each batch)
  VALIDATION_LOG.md                (warnings accumulated)
  aspirational_backlog.md          (T4/T5 items parked here, never shipped)
  FINAL_SHOP_CATALOG.json          (merge of all batches, last step)
```

---

# PART 12 — NON-NEGOTIABLE RULES FOR CLAUDE CODE

1. **NEVER skip Jix's approval between batches.** Always stop and wait.
2. **NEVER generate T4 or T5 items in the main catalog.** Park them in `aspirational_backlog.md`.
3. **NEVER invent new categories** beyond the 10 in Part 3.
4. **NEVER exceed rarity price bands** from Part 6 (except Mythic Premium tier).
5. **NEVER ship an item without flavor_text and art_prompt_hints.**
6. **NEVER reuse item names across batches.**
7. **NEVER reuse flavor text across batches.**
8. **NEVER push to main.** Work on branch `shop-alpha-generation`.
9. **If a rule in this document is ambiguous, STOP and ask Jix.**

---

# PART 13 — WHAT COMES AFTER THE 400 ITEMS ARE DESIGNED

Same flow as the card set:

1. **Now:** Claude Code generates 400 items in 10 batches (this document's job)
2. **Next sprint:** Claude Code reads the 400 items and generates **art prompts** for Vast.ai rendering. Each item's art_prompt_hints becomes a full Stable Diffusion prompt based on its category and rarity rules. Output: `shop_art_prompts.json`
3. **Rendering:** Test 5-10 on Vast.ai → approve style → run all 400 (except items that don't need art like titles and audio)
4. **Composite:** Integrate rendered art into shop UI
5. **Wire the actual shop rebuild** in voidexa.com (separate sprint): build the 10-tab UI, the rotation backend, the GHAI purchase flow with Stripe top-up, delete the 19-item legacy shop, deploy new catalog

This master document ONLY covers step 1. Each subsequent step gets its own sprint with its own master document if needed.

---

# PART 14 — CROSS-REFERENCES

- In-game card data lives in `docs/alpha_set_master.md` — shop sells cosmetics for those cards (backs, frames, boards)
- Business revenue streams live in `docs/business_portal_master.md` — designer-submitted shop items flow from there
- Game universe spec lives in `docs/VOIDEXA_GAMING_COMBINED_V3.md` — ensures shop items fit the lore

---

**End of master document. Claude Code reads this top-to-bottom before generating batch 01.**
