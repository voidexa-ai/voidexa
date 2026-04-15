# Card Art Status — Core Set ↔ glb-ready renders

> **Status:** Generated 2026-04-15 (CW-2 from `.claude/skills/star-system-polish/SKILL.md`).
> **Mapping lives in:** `components/combat/cardArt.ts`
> **Spec mirror:** `lib/cards/starter_set.ts` (40-card Core Set)
> **Renders source:** `public/images/renders/`
> **Coverage:** **40 / 40** cards have real art. **0 procedural fallbacks.** All 34 unique render paths verified to exist on disk.

## Mapping rules (per CW-2)

| Card category | Source folder | Notes |
|---|---|---|
| Attack | `weapons/` | 7 distinct weapon glbs reused across 13 cards via VFX |
| Defense | `cockpits/` + `cockpit-interiors/` | 5 exteriors + 5 interiors → 9 unique mappings |
| Tactical | `uncommon/` | 8 different ship classes — distinct hero per card |
| Deployment | `starter/` + `uncommon/` | drone-sized ships (qs_bob + 5 USC fighters/capitals) |
| Alien | `legendary/` | 4 of 5 Hi-Rez full-ship Legendary renders |

## All 40 cards — current art assignment

### Common (15)

| Card id | Name | Category | Render | Status |
|---|---|---|---|:-:|
| `laser-pulse` | Laser Pulse | Attack | `weapons/hirez_weapon_blaster.png` | ✅ |
| `plasma-bolt` | Plasma Bolt | Attack | `weapons/hirez_weapon_blaster.png` | ✅ |
| `micro-missile` | Micro Missile | Attack | `weapons/hirez_weapon_missile.png` | ✅ |
| `gatling-burst` | Gatling Burst | Attack | `weapons/hirez_weapon_smallmachinegun.png` | ✅ |
| `thermal-lance` | Thermal Lance | Attack | `weapons/hirez_weapon_blaster.png` | ✅ |
| `energy-shield-small` | Energy Shield | Defense | `cockpits/hirez_cockpit01.png` | ✅ |
| `emergency-weld` | Emergency Weld | Defense | `cockpits/hirez_cockpit02.png` | ✅ |
| `decoy-flare` | Decoy Flare | Defense | `cockpits/hirez_cockpit03.png` | ✅ |
| `evasive-roll` | Evasive Roll | Defense | `cockpits/hirez_cockpit04.png` | ✅ |
| `speed-boost` | Speed Boost | Tactical | `uncommon/usc_hyperfalcon01.png` | ✅ |
| `jam-weapons` | Jam Weapons | Tactical | `uncommon/usc_nightaye01.png` | ✅ |
| `scan-target` | Scan Target | Tactical | `uncommon/usc_lightfox01.png` | ✅ |
| `laser-drone` | Laser Drone | Deployment | `starter/qs_bob.png` | ✅ |
| `point-defense` | Point Defense | Deployment | `uncommon/usc_astroeagle01.png` | ✅ |
| `minor-phase-ripple` | Minor Phase Ripple | Alien | `legendary/hirez_ship01_full.png` | ✅ |

### Uncommon (10)

| Card id | Name | Category | Render | Status |
|---|---|---|---|:-:|
| `railgun-shot` | Railgun Shot | Attack | `weapons/hirez_weapon_bigmachinegun.png` | ✅ |
| `acid-cloud` | Acid Cloud | Attack | `weapons/hirez_weapon_smalllauncher.png` | ✅ |
| `homing-missile` | Homing Missile | Attack | `weapons/hirez_weapon_missile.png` | ✅ |
| `magnetic-shield` | Magnetic Shield | Defense | `cockpits/hirez_cockpit05.png` | ✅ |
| `nano-repair` | Nano Repair | Defense | `cockpit-interiors/hirez_cockpit01_interior.png` | ✅ |
| `damage-booster` | Damage Booster | Tactical | `uncommon/usc_galaxyraptor01.png` | ✅ |
| `blind-pulse` | Blind Pulse | Tactical | `uncommon/usc_meteormantis01.png` | ✅ |
| `missile-drone` | Missile Drone | Deployment | `uncommon/usc_cosmicshark01.png` | ✅ |
| `shield-drone` | Shield Drone | Deployment | `uncommon/usc_galacticleopard1.png` | ✅ |
| `void-pulse` | Void Pulse | Alien | `legendary/hirez_ship06_full.png` | ✅ |

### Rare (8)

| Card id | Name | Category | Render | Status |
|---|---|---|---|:-:|
| `torpedo-barrage` | Torpedo Barrage | Attack | `weapons/hirez_weapon_trilauncher.png` | ✅ |
| `phase-beam` | Phase Beam | Attack | `weapons/hirez_weapon_bigmachinegun.png` | ✅ |
| `mirror-shield` | Mirror Shield | Defense | `cockpit-interiors/hirez_cockpit02_interior.png` | ✅ |
| `phase-shift-defense` | Phase Shift | Defense | `cockpit-interiors/hirez_cockpit03_interior.png` | ✅ |
| `crit-amplifier` | Crit Amplifier | Tactical | `uncommon/usc_forcebadger01.png` | ✅ |
| `create-nebula` | Create Nebula | Tactical | `uncommon/usc_craizanstar01.png` | ✅ |
| `kamikaze-drone` | Kamikaze Drone | Deployment | `uncommon/usc_voidwhale01.png` | ✅ |
| `time-reverse` | Time Reverse | Alien | `legendary/hirez_ship09_full.png` | ✅ |

### Epic (5)

| Card id | Name | Category | Render | Status |
|---|---|---|---|:-:|
| `void-lance` | Void Lance | Attack | `weapons/hirez_weapon_biglauncher.png` | ✅ |
| `nova-barrage` | Nova Barrage | Attack | `weapons/hirez_weapon_trilauncher.png` | ✅ |
| `plasma-ablative-shield` | Plasma Ablative Shield | Defense | `cockpit-interiors/hirez_cockpit04_interior.png` | ✅ |
| `mind-read` | Mind Read | Tactical | `uncommon/usc_striderox01.png` | ✅ |
| `fortress-turret` | Fortress Turret | Deployment | `uncommon/usc_protonlegacy01.png` | ✅ |

### Legendary (2)

| Card id | Name | Category | Render | Status |
|---|---|---|---|:-:|
| `stellar-annihilator` | Stellar Annihilator | Attack | `weapons/hirez_weapon_biglauncher.png` | ✅ |
| `reality-warp` | Reality Warp | Alien | `legendary/hirez_ship16_full.png` | ✅ |

## Coverage summary

| Category | Cards | Distinct renders | Reuse |
|---|---:|---:|---|
| Attack | 13 | 7 | `blaster` (×3), `missile` (×2), `bigmachinegun` (×2), `trilauncher` (×2), `biglauncher` (×2), `smalllauncher` (×1), `smallmachinegun` (×1) |
| Defense | 9 | 9 | none — every card a unique cockpit |
| Tactical | 8 | 8 | none — every card a different USC class |
| Deployment | 6 | 6 | none — qs_bob + 5 unique USC ships |
| Alien | 4 | 4 | 4 of the 5 Legendary Hi-Rez ships (`ship13_full` is unused — could host a future Alien card) |
| **Total** | **40** | **34** | |

## Renders not yet referenced by any card (12)

These exist in `public/images/renders/` but no card binds to them. Available for future cards, marketing pages, or shop SKUs.

| Folder | File | Reserved use |
|---|---|---|
| `legendary/` | `hirez_ship13_full.png` | Spare for a 5th Alien card or PvP-token visual |
| `epic/` | All 10 (`hirez_ship02..14_full`) | Shop "Epic ship" SKUs (`docs/SHIP_CATALOG.md` pricing $5–$8) |
| `rare/` | All 8 `uscx_*` | Shop "Rare ship" SKUs ($2–$4) |
| `soulbound/` | 5 files | Achievement reward art (Debater, Trader, Pioneer, Explorer, Secret) |

## Verification

Every referenced render path was checked against disk:

```
$ grep -oE '/images/renders/[A-Za-z0-9/_.-]+\.png' components/combat/cardArt.ts | sort -u | wc -l
34

$ for ref in $(grep -oE '/images/renders/...png' …); do test -f public$ref || echo MISSING $ref; done
(no output)
```

**0 missing files.** Re-run anytime `cardArt.ts` is edited.

## Notes for the art pipeline

- **VFX overlay** — multiple cards reusing the same weapon render (e.g. blaster for Laser Pulse / Plasma Bolt / Thermal Lance) should be visually distinguished by a per-card VFX overlay applied in the React layer (cyan / green / red plasma respectively). Card art = static base, VFX = animated layer.
- **Defense cockpit-vs-interior split** — the lower-power Defense cards (Common-Uncommon) use cockpit exteriors; higher-power cards (Rare-Epic) use cockpit interiors so the player feels "inside" the more dramatic effect.
- **Alien card backdrop** — Legendary ships were chosen for Alien cards because their MainBody textures look genuinely otherworldly under the gold rim light from the renders; this reinforces the "wild-card alien tech" vibe versus the more straightforward weapons/cockpits/USC ships used elsewhere.
- **Stellar Annihilator** — moved from a Legendary ship render to `biglauncher` so Attack cards stay 100% on `weapons/` per the CW-2 spec. The Legendary status is conveyed by the gold rarity glow on the card border (handled by `RARITY_GLOW` in `cardArt.ts`).
- **Adding a new card** — the `cardArtPath()` function returns `null` for unknown ids, and `CardComponent.tsx` renders a procedural category-coloured gradient as fallback. Add the card id to `CARD_ART` to give it real art.
