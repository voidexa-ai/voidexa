# voidexa Ship & Item Catalog

> **Status:** Generated 2026-04-15 from the contents of `public/models/glb-ready/` (689 .glb files, ~6.8 GB).
> **Source rules:** master plan Part 3 (Ship System rarities + pricing) and the user's catalog spec.
> **Currency:** USD (Stripe). Prices are suggestions — economy-designer should validate before going live.
> **Pricing pillars:** No pay-to-win. Shop sells looks. Achievement ships are soulbound. Legendary ships are PvP-token only — never directly purchasable.

---

## Summary by rarity

| Rarity | Count | Source | Suggested price band |
|---|---:|---|---|
| **Common** | 11 | `qs_*` (Quaternius Spaceships) | $0 starter / $0.50 variant |
| **Uncommon** | 320 | `usc_*` (excluding modules kits) | $1 – $2 |
| **Rare** | 85 | `uscx_*` + `usc_*modules*` | $2 – $4 |
| **Epic** | 19 | `hirez_ship*_full` (excluding 5 Legendary) | $5 – $8 |
| **Legendary** | 5 | Hand-picked `hirez_ship*_full` | **PvP-token only** ($10 equivalent value) |
| _Cockpit theme_ | 12 | `hirez_cockpit*` + `hirez_cockpit*_interior` + `cockpit_free_seat` | $2 – $5 |
| _Weapon attachment_ | 7 | `hirez_weapon_*` | $1 – $3 |
| _Hull variant_ | 16 | `hirez_mainbody*` | $2 – $3 |
| _Wing attachment_ | 9 | `hirez_wing*` | $1 – $2 |
| _Engine trail_ | 11 | `hirez_engine*` | $1 – $2 |
| _Thruster effect_ | 8 | `hirez_thruster*` | $0.50 – $1 |
| _Cockpit dressing_ | 2 | `hirez_equipments` + `hirez_screens` | bundled / not sold separately |
| _Station structure_ | 91 | `qmsf_*` (Quaternius Modular Sci-Fi) | bundled with planet ownership |
| _Space Kit prop_ | 92 | `qsk_*` (Quaternius Space Kit) | free / world-decorated |
| _Free station_ | 1 | `station_modular_interior` | free starter |
| **TOTAL** | **689** | | |

---

## Card art mapping summary (full mapping in `CARD_ART_MAPPING.md`)

The 7 Hi-Rez weapons + the 6 Hi-Rez mainbody/cockpit assets cover the **13 Attack cards** + **6 Deployment cards** in the Core Set (`lib/cards/starter_set.ts`). The 9 Defense and 8 Tactical cards have no direct 3D source — they reuse cockpit interior renders + abstract HUD effects. The 4 Alien cards use unique uscx ships (`Nova`, `Pullora`, `Spidership`, `Reality Warp` = procedural).

| Card category | Asset source | Coverage |
|---|---|---|
| Attack (13) | `hirez_weapon_*` (7) + `hirez_ship*_full` renders for big attacks | 13/13 |
| Defense (9) | `hirez_cockpit*_interior` + procedural shader stills | 9/9 (procedural) |
| Tactical (8) | HUD overlays — no 3D | 8/8 (procedural) |
| Deployment (6) | `qs_dispatcher`, `qs_striker` etc. as drones; `hirez_weapon_smallmachinegun` as turret | 6/6 |
| Alien (4) | `uscx_nova` + `uscx_pullora` + `uscx_spidership` + procedural | 4/4 |

---

## Legendary ships (PvP-token only)

These 5 are NEVER for direct sale. They drop only as PvP rewards or tournament prizes. Each picked from a distinct MainBody texture set so they look genuinely different. All carry PBR textures (3 images each, Grey base).

| File | Source | MainBody texture | Equivalent USD value |
|---|---|---|---|
| `hirez_ship01_full.glb` | Spaceship01 + interior | MainBody1 | $10 |
| `hirez_ship06_full.glb` | Spaceship06 + interior | MainBody6 | $10 |
| `hirez_ship09_full.glb` | Spaceship09 + interior | MainBody9 (largest, 8.7 MB) | $12 (apex prize) |
| `hirez_ship13_full.glb` | Spaceship13 + interior | MainBody13 | $10 |
| `hirez_ship16_full.glb` | Spaceship16 + interior | MainBody16 | $10 |

---

## Soulbound ships (achievement-only)

Per master plan Part 3: achievement ships are **soulbound** — cannot be wagered, traded, or sold. Tied to specific achievements from `lib/achievements/definitions.ts`.

| Achievement | Ship reward | Suggested asset |
|---|---|---|
| `debater` (10× Quantum) | "AI-class Cruiser" | `usc_voidwhale01.glb` (capital-class) |
| `trader` (>10% profit) | "Trader Vessel" | `usc_genericspaceship04.glb` (cargo silhouette) |
| `pioneer` (claim planet) | "Pioneer Frigate" | `usc_spaceexcalibur01.glb` (sword/founder feel) |
| `explorer` (visit all planets) | "Scout Ship" | `qs_dispatcher.glb` (small fast scout) |
| `secret` (easter egg) | "Mystery Ship" | `uscx_nova.glb` (unique, hand-crafted feel) |

---

## Full inventory

Format: `filename` · category · rarity · price · notes. Sizes in MB. Sorted alphabetically within each section.


### Hi-Rez complete ships (24)

| File | Rarity | Price | Size | Notes |
|---|---|---|---:|---|
| hirez_ship01_full.glb | Legendary | **PvP-token only** | 8.2 | Tournament/PvP prize. Soulbound on award. |
| hirez_ship02_full.glb | Epic | $5 | 6.5 | Full ship + interior. MainBody texture varies. |
| hirez_ship03_full.glb | Epic | $5 | 7.2 | Full ship + interior. MainBody texture varies. |
| hirez_ship04_full.glb | Epic | $5 | 8.0 | Full ship + interior. MainBody texture varies. |
| hirez_ship05_full.glb | Epic | $5 | 8.1 | Full ship + interior. MainBody texture varies. |
| hirez_ship06_full.glb | Legendary | **PvP-token only** | 8.5 | Tournament/PvP prize. Soulbound on award. |
| hirez_ship07_full.glb | Epic | $8 | 8.5 | Full ship + interior. MainBody texture varies. |
| hirez_ship08_full.glb | Epic | $5 | 7.6 | Full ship + interior. MainBody texture varies. |
| hirez_ship09_full.glb | Legendary | **PvP-token only** | 8.7 | Tournament/PvP prize. Soulbound on award. |
| hirez_ship10_full.glb | Epic | $5 | 7.5 | Full ship + interior. MainBody texture varies. |
| hirez_ship11_full.glb | Epic | $5 | 7.5 | Full ship + interior. MainBody texture varies. |
| hirez_ship12_full.glb | Epic | $5 | 7.9 | Full ship + interior. MainBody texture varies. |
| hirez_ship13_full.glb | Legendary | **PvP-token only** | 8.4 | Tournament/PvP prize. Soulbound on award. |
| hirez_ship14_full.glb | Epic | $5 | 7.9 | Full ship + interior. MainBody texture varies. |
| hirez_ship15_full.glb | Epic | $8 | 8.2 | Full ship + interior. MainBody texture varies. |
| hirez_ship16_full.glb | Legendary | **PvP-token only** | 8.2 | Tournament/PvP prize. Soulbound on award. |
| hirez_ship17_full.glb | Epic | $8 | 8.2 | Full ship + interior. MainBody texture varies. |
| hirez_ship18_full.glb | Epic | $5 | 6.5 | Full ship + interior. MainBody texture varies. |
| hirez_ship19_full.glb | Epic | $5 | 7.2 | Full ship + interior. MainBody texture varies. |
| hirez_ship20_full.glb | Epic | $5 | 8.0 | Full ship + interior. MainBody texture varies. |
| hirez_ship21_full.glb | Epic | $5 | 8.0 | Full ship + interior. MainBody texture varies. |
| hirez_ship22_full.glb | Epic | $8 | 8.6 | Full ship + interior. MainBody texture varies. |
| hirez_ship23_full.glb | Epic | $8 | 8.6 | Full ship + interior. MainBody texture varies. |
| hirez_ship24_full.glb | Epic | $5 | 7.6 | Full ship + interior. MainBody texture varies. |

### Cockpits (12 — exterior, interior, dressing)

| File | Category | Price | Size | Notes |
|---|---|---|---:|---|
| hirez_cockpit01.glb | Cockpit theme | $3 | 5.3 | Exterior shell — bind to ship Free Flight model |
| hirez_cockpit02.glb | Cockpit theme | $3 | 6.1 | Exterior shell — bind to ship Free Flight model |
| hirez_cockpit03.glb | Cockpit theme | $3 | 6.6 | Exterior shell — bind to ship Free Flight model |
| hirez_cockpit04.glb | Cockpit theme | $3 | 6.1 | Exterior shell — bind to ship Free Flight model |
| hirez_cockpit05.glb | Cockpit theme | $3 | 4.5 | Exterior shell — bind to ship Free Flight model |
| hirez_cockpit01_interior.glb | Cockpit theme (FPV) | $5 | 6.6 | First-person interior. Use inside FPV camera. |
| hirez_cockpit02_interior.glb | Cockpit theme (FPV) | $5 | 7.3 | First-person interior. Use inside FPV camera. |
| hirez_cockpit03_interior.glb | Cockpit theme (FPV) | $5 | 7.1 | First-person interior. Use inside FPV camera. |
| hirez_cockpit04_interior.glb | Cockpit theme (FPV) | $5 | 7.7 | First-person interior. Use inside FPV camera. |
| hirez_cockpit05_interior.glb | Cockpit theme (FPV) | $5 | 7.0 | First-person interior. Use inside FPV camera. |
| hirez_equipments.glb | Cockpit dressing | bundled | 7.6 | Levers/dials. Bundled with interior cockpit. |
| hirez_screens.glb | Cockpit dressing | bundled | 3.5 | HUD glass screens. Bundled with interior cockpit. |

### Weapons (7 — card art + cosmetic attachments)

| File | Category | Price | Size | Notes |
|---|---|---|---:|---|
| hirez_weapon_biglauncher.glb | Weapon attachment | $3 | 6.9 | See CARD_ART_MAPPING.md for card binding |
| hirez_weapon_bigmachinegun.glb | Weapon attachment | $3 | 9.9 | See CARD_ART_MAPPING.md for card binding |
| hirez_weapon_blaster.glb | Weapon attachment | $2 | 7.5 | See CARD_ART_MAPPING.md for card binding |
| hirez_weapon_missile.glb | Weapon attachment | $2 | 6.8 | See CARD_ART_MAPPING.md for card binding |
| hirez_weapon_smalllauncher.glb | Weapon attachment | $1 | 7.8 | See CARD_ART_MAPPING.md for card binding |
| hirez_weapon_smallmachinegun.glb | Weapon attachment | $1 | 6.9 | See CARD_ART_MAPPING.md for card binding |
| hirez_weapon_trilauncher.glb | Weapon attachment | $3 | 7.3 | See CARD_ART_MAPPING.md for card binding |

### Hi-Rez engines / thrusters / wings / mainbodies (44)

| File | Category | Price | Size | Notes |
|---|---|---|---:|---|
| hirez_engine01.glb | Engine trail effect | $1.50 | 6.0 | Pairs with engine glow shader |
| hirez_engine02.glb | Engine trail effect | $1.50 | 9.2 | Pairs with engine glow shader |
| hirez_engine03.glb | Engine trail effect | $1.50 | 7.2 | Pairs with engine glow shader |
| hirez_engine04.glb | Engine trail effect | $1.50 | 6.0 | Pairs with engine glow shader |
| hirez_engine05.glb | Engine trail effect | $1.50 | 5.9 | Pairs with engine glow shader |
| hirez_engine06.glb | Engine trail effect | $1.50 | 7.1 | Pairs with engine glow shader |
| hirez_engine07.glb | Engine trail effect | $1.50 | 8.3 | Pairs with engine glow shader |
| hirez_engine08.glb | Engine trail effect | $1.50 | 7.4 | Pairs with engine glow shader |
| hirez_engine09.glb | Engine trail effect | $1.50 | 7.7 | Pairs with engine glow shader |
| hirez_engine10.glb | Engine trail effect | $1.50 | 8.5 | Pairs with engine glow shader |
| hirez_engine11.glb | Engine trail effect | $1.50 | 8.1 | Pairs with engine glow shader |
| hirez_thruster01.glb | Maneuvering thruster | $0.50 | 0.6 | Shared Thrusters_BaseColor; small accent |
| hirez_thruster02.glb | Maneuvering thruster | $0.50 | 0.6 | Shared Thrusters_BaseColor; small accent |
| hirez_thruster03.glb | Maneuvering thruster | $0.50 | 0.6 | Shared Thrusters_BaseColor; small accent |
| hirez_thruster04.glb | Maneuvering thruster | $0.50 | 0.6 | Shared Thrusters_BaseColor; small accent |
| hirez_thruster05.glb | Maneuvering thruster | $0.50 | 0.6 | Shared Thrusters_BaseColor; small accent |
| hirez_thruster06.glb | Maneuvering thruster | $0.50 | 0.6 | Shared Thrusters_BaseColor; small accent |
| hirez_thruster07.glb | Maneuvering thruster | $0.50 | 0.6 | Shared Thrusters_BaseColor; small accent |
| hirez_thruster08.glb | Maneuvering thruster | $0.50 | 0.6 | Shared Thrusters_BaseColor; small accent |
| hirez_wing01.glb | Wing attachment | $2 | 7.6 | Cosmetic only; bolts onto ship slot |
| hirez_wing02.glb | Wing attachment | $2 | 6.9 | Cosmetic only; bolts onto ship slot |
| hirez_wing03.glb | Wing attachment | $2 | 6.9 | Cosmetic only; bolts onto ship slot |
| hirez_wing04.glb | Wing attachment | $2 | 1.8 | Cosmetic only; bolts onto ship slot |
| hirez_wing05.glb | Wing attachment | $2 | 7.5 | Cosmetic only; bolts onto ship slot |
| hirez_wing06.glb | Wing attachment | $2 | 7.6 | Cosmetic only; bolts onto ship slot |
| hirez_wing07.glb | Wing attachment | $2 | 8.6 | Cosmetic only; bolts onto ship slot |
| hirez_wing08.glb | Wing attachment | $2 | 8.1 | Cosmetic only; bolts onto ship slot |
| hirez_wing09.glb | Wing attachment | $2 | 6.1 | Cosmetic only; bolts onto ship slot |
| hirez_mainbody01.glb | Hull variant | $3 | 8.0 | Standalone hull style |
| hirez_mainbody02.glb | Hull variant | $3 | 6.3 | Standalone hull style |
| hirez_mainbody03.glb | Hull variant | $3 | 7.1 | Standalone hull style |
| hirez_mainbody04.glb | Hull variant | $3 | 7.8 | Standalone hull style |
| hirez_mainbody05.glb | Hull variant | $3 | 7.8 | Standalone hull style |
| hirez_mainbody06.glb | Hull variant | $3 | 8.3 | Standalone hull style |
| hirez_mainbody07.glb | Hull variant | $3 | 8.4 | Standalone hull style |
| hirez_mainbody08.glb | Hull variant | $3 | 7.4 | Standalone hull style |
| hirez_mainbody09.glb | Hull variant | $3 | 8.5 | Standalone hull style |
| hirez_mainbody10.glb | Hull variant | $3 | 7.3 | Standalone hull style |
| hirez_mainbody11.glb | Hull variant | $3 | 7.3 | Standalone hull style |
| hirez_mainbody12.glb | Hull variant | $3 | 7.7 | Standalone hull style |
| hirez_mainbody13.glb | Hull variant | $3 | 8.2 | Standalone hull style |
| hirez_mainbody14.glb | Hull variant | $3 | 7.7 | Standalone hull style |
| hirez_mainbody15.glb | Hull variant | $3 | 8.0 | Standalone hull style |
| hirez_mainbody16.glb | Hull variant | $3 | 8.0 | Standalone hull style |
| hirez_spaceship01.glb | Hull-only ship | $4 | 8.1 | Exterior of Spaceship01 (no interior) |

### USC — Ultimate Spaceships Creator (347)

**19 ship classes** × 5–22 variants each. "_modules" entries are construction kits (Rare). All others Uncommon.

| File | Class | Rarity | Price | Size | Notes |
|---|---|---|---|---:|---|
| usc_astroeagle01.glb | astroeagle | Uncommon | $1 | 15.0 | Variant of astroeagle class |
| usc_astroeagle02.glb | astroeagle | Uncommon | $1 | 15.0 | Variant of astroeagle class |
| usc_astroeagle03.glb | astroeagle | Uncommon | $1 | 15.0 | Variant of astroeagle class |
| usc_astroeagle04.glb | astroeagle | Uncommon | $1 | 15.0 | Variant of astroeagle class |
| usc_astroeagle05.glb | astroeagle | Uncommon | $1 | 15.0 | Variant of astroeagle class |
| usc_astroeagle06.glb | astroeagle | Uncommon | $1 | 15.0 | Variant of astroeagle class |
| usc_astroeagle07.glb | astroeagle | Uncommon | $1 | 15.0 | Variant of astroeagle class |
| usc_astroeagle08.glb | astroeagle | Uncommon | $1 | 15.0 | Variant of astroeagle class |
| usc_astroeagle09.glb | astroeagle | Uncommon | $1 | 15.0 | Variant of astroeagle class |
| usc_astroeagle10.glb | astroeagle | Uncommon | $1 | 15.0 | Variant of astroeagle class |
| usc_astroeagle11.glb | astroeagle | Uncommon | $1 | 15.0 | Variant of astroeagle class |
| usc_astroeagle12.glb | astroeagle | Uncommon | $1 | 15.0 | Variant of astroeagle class |
| usc_astroeagle13.glb | astroeagle | Uncommon | $1 | 15.0 | Variant of astroeagle class |
| usc_astroeagle14.glb | astroeagle | Uncommon | $1 | 15.0 | Variant of astroeagle class |
| usc_astroeagle15.glb | astroeagle | Uncommon | $1 | 15.0 | Variant of astroeagle class |
| usc_astroeagle16.glb | astroeagle | Uncommon | $1 | 15.0 | Variant of astroeagle class |
| usc_astroeagle17.glb | astroeagle | Uncommon | $1 | 15.0 | Variant of astroeagle class |
| usc_astroeagle18.glb | astroeagle | Uncommon | $1 | 15.0 | Variant of astroeagle class |
| usc_astroeagle19.glb | astroeagle | Uncommon | $1 | 15.0 | Variant of astroeagle class |
| usc_astroeagle20.glb | astroeagle | Uncommon | $1 | 15.0 | Variant of astroeagle class |
| usc_astroeaglemodules.glb | astroeagle | Rare | $3 | 15.0 | Construction kit / parts library |
| usc_cosmicshark01.glb | cosmicshark | Uncommon | $1 | 11.9 | Variant of cosmicshark class |
| usc_cosmicshark02.glb | cosmicshark | Uncommon | $1 | 11.9 | Variant of cosmicshark class |
| usc_cosmicshark03.glb | cosmicshark | Uncommon | $1 | 11.9 | Variant of cosmicshark class |
| usc_cosmicshark04.glb | cosmicshark | Uncommon | $1 | 11.9 | Variant of cosmicshark class |
| usc_cosmicshark05.glb | cosmicshark | Uncommon | $1 | 11.9 | Variant of cosmicshark class |
| usc_cosmicshark06.glb | cosmicshark | Uncommon | $1 | 11.9 | Variant of cosmicshark class |
| usc_cosmicshark07.glb | cosmicshark | Uncommon | $1 | 11.9 | Variant of cosmicshark class |
| usc_cosmicshark08.glb | cosmicshark | Uncommon | $1 | 11.9 | Variant of cosmicshark class |
| usc_cosmicshark09.glb | cosmicshark | Uncommon | $1 | 11.9 | Variant of cosmicshark class |
| usc_cosmicshark10.glb | cosmicshark | Uncommon | $1 | 11.9 | Variant of cosmicshark class |
| usc_cosmicshark11.glb | cosmicshark | Uncommon | $1 | 11.9 | Variant of cosmicshark class |
| usc_cosmicshark12.glb | cosmicshark | Uncommon | $1 | 11.9 | Variant of cosmicshark class |
| usc_cosmicshark13.glb | cosmicshark | Uncommon | $1 | 11.9 | Variant of cosmicshark class |
| usc_cosmicshark14.glb | cosmicshark | Uncommon | $1 | 11.9 | Variant of cosmicshark class |
| usc_cosmicshark15.glb | cosmicshark | Uncommon | $1 | 11.9 | Variant of cosmicshark class |
| usc_cosmicshark16.glb | cosmicshark | Uncommon | $1 | 11.9 | Variant of cosmicshark class |
| usc_cosmicshark17.glb | cosmicshark | Uncommon | $1 | 11.9 | Variant of cosmicshark class |
| usc_cosmicshark18.glb | cosmicshark | Uncommon | $1 | 11.9 | Variant of cosmicshark class |
| usc_cosmicshark19.glb | cosmicshark | Uncommon | $1 | 11.9 | Variant of cosmicshark class |
| usc_cosmicshark20.glb | cosmicshark | Uncommon | $1 | 11.9 | Variant of cosmicshark class |
| usc_cosmicsharkmodules.glb | cosmicshark | Rare | $3 | 11.9 | Construction kit / parts library |
| usc_craizanstar01.glb | craizanstar | Uncommon | $1 | 29.1 | Variant of craizanstar class |
| usc_craizanstar02.glb | craizanstar | Uncommon | $1 | 29.1 | Variant of craizanstar class |
| usc_craizanstar03.glb | craizanstar | Uncommon | $1 | 29.1 | Variant of craizanstar class |
| usc_craizanstar04.glb | craizanstar | Uncommon | $1 | 29.1 | Variant of craizanstar class |
| usc_craizanstar05.glb | craizanstar | Uncommon | $1 | 29.1 | Variant of craizanstar class |
| usc_craizanstar06.glb | craizanstar | Uncommon | $1 | 29.1 | Variant of craizanstar class |
| usc_craizanstar07.glb | craizanstar | Uncommon | $1 | 29.1 | Variant of craizanstar class |
| usc_craizanstar08.glb | craizanstar | Uncommon | $1 | 29.1 | Variant of craizanstar class |
| usc_craizanstar09.glb | craizanstar | Uncommon | $1 | 29.1 | Variant of craizanstar class |
| usc_craizanstar10.glb | craizanstar | Uncommon | $1 | 29.1 | Variant of craizanstar class |
| usc_craizanstar11.glb | craizanstar | Uncommon | $1 | 29.1 | Variant of craizanstar class |
| usc_craizanstar12.glb | craizanstar | Uncommon | $1 | 29.1 | Variant of craizanstar class |
| usc_craizanstar13.glb | craizanstar | Uncommon | $1 | 29.1 | Variant of craizanstar class |
| usc_craizanstar14.glb | craizanstar | Uncommon | $1 | 29.1 | Variant of craizanstar class |
| usc_craizanstar15.glb | craizanstar | Uncommon | $1 | 29.1 | Variant of craizanstar class |
| usc_craizanstar16.glb | craizanstar | Uncommon | $1 | 29.1 | Variant of craizanstar class |
| usc_craizanstar17.glb | craizanstar | Uncommon | $1 | 29.1 | Variant of craizanstar class |
| usc_craizanstar18.glb | craizanstar | Uncommon | $1 | 29.1 | Variant of craizanstar class |
| usc_craizanstar19.glb | craizanstar | Uncommon | $1 | 29.1 | Variant of craizanstar class |
| usc_craizanstar20.glb | craizanstar | Uncommon | $1 | 29.1 | Variant of craizanstar class |
| usc_craizanstarmodules.glb | craizanstar | Rare | $3 | 29.1 | Construction kit / parts library |
| usc_flyinginsect01.glb | flyinginsect | Uncommon | $1 | 4.2 | Variant of flyinginsect class |
| usc_flyinginsect02.glb | flyinginsect | Uncommon | $1 | 6.9 | Variant of flyinginsect class |
| usc_flyinginsect03.glb | flyinginsect | Uncommon | $1 | 4.4 | Variant of flyinginsect class |
| usc_flyinginsect04.glb | flyinginsect | Uncommon | $1 | 5.4 | Variant of flyinginsect class |
| usc_flyinginsect05.glb | flyinginsect | Uncommon | $1 | 3.9 | Variant of flyinginsect class |
| usc_forcebadger01.glb | forcebadger | Uncommon | $1 | 23.8 | Variant of forcebadger class |
| usc_forcebadger02.glb | forcebadger | Uncommon | $1 | 23.8 | Variant of forcebadger class |
| usc_forcebadger03.glb | forcebadger | Uncommon | $1 | 23.8 | Variant of forcebadger class |
| usc_forcebadger04.glb | forcebadger | Uncommon | $1 | 23.8 | Variant of forcebadger class |
| usc_forcebadger05.glb | forcebadger | Uncommon | $1 | 23.8 | Variant of forcebadger class |
| usc_forcebadger06.glb | forcebadger | Uncommon | $1 | 23.8 | Variant of forcebadger class |
| usc_forcebadger07.glb | forcebadger | Uncommon | $1 | 23.8 | Variant of forcebadger class |
| usc_forcebadger08.glb | forcebadger | Uncommon | $1 | 23.8 | Variant of forcebadger class |
| usc_forcebadger09.glb | forcebadger | Uncommon | $1 | 23.8 | Variant of forcebadger class |
| usc_forcebadger10.glb | forcebadger | Uncommon | $1 | 23.8 | Variant of forcebadger class |
| usc_forcebadger11.glb | forcebadger | Uncommon | $1 | 23.8 | Variant of forcebadger class |
| usc_forcebadger12.glb | forcebadger | Uncommon | $1 | 23.8 | Variant of forcebadger class |
| usc_forcebadger13.glb | forcebadger | Uncommon | $1 | 23.8 | Variant of forcebadger class |
| usc_forcebadger14.glb | forcebadger | Uncommon | $1 | 23.8 | Variant of forcebadger class |
| usc_forcebadger15.glb | forcebadger | Uncommon | $1 | 23.8 | Variant of forcebadger class |
| usc_forcebadger16.glb | forcebadger | Uncommon | $1 | 23.8 | Variant of forcebadger class |
| usc_forcebadger17.glb | forcebadger | Uncommon | $1 | 23.8 | Variant of forcebadger class |
| usc_forcebadger18.glb | forcebadger | Uncommon | $1 | 23.8 | Variant of forcebadger class |
| usc_forcebadger19.glb | forcebadger | Uncommon | $1 | 23.8 | Variant of forcebadger class |
| usc_forcebadger20.glb | forcebadger | Uncommon | $1 | 23.8 | Variant of forcebadger class |
| usc_forcebadgermodules.glb | forcebadger | Rare | $3 | 23.8 | Construction kit / parts library |
| usc_galacticleopard1.glb | galacticleopard | Uncommon | $1 | 20.0 | Variant of galacticleopard class |
| usc_galacticleopard10.glb | galacticleopard | Uncommon | $1 | 20.0 | Variant of galacticleopard class |
| usc_galacticleopard11.glb | galacticleopard | Uncommon | $1 | 20.0 | Variant of galacticleopard class |
| usc_galacticleopard12.glb | galacticleopard | Uncommon | $1 | 20.0 | Variant of galacticleopard class |
| usc_galacticleopard13.glb | galacticleopard | Uncommon | $1 | 20.0 | Variant of galacticleopard class |
| usc_galacticleopard14.glb | galacticleopard | Uncommon | $1 | 20.0 | Variant of galacticleopard class |
| usc_galacticleopard15.glb | galacticleopard | Uncommon | $1 | 20.0 | Variant of galacticleopard class |
| usc_galacticleopard16.glb | galacticleopard | Uncommon | $1 | 20.0 | Variant of galacticleopard class |
| usc_galacticleopard17.glb | galacticleopard | Uncommon | $1 | 20.0 | Variant of galacticleopard class |
| usc_galacticleopard18.glb | galacticleopard | Uncommon | $1 | 20.0 | Variant of galacticleopard class |
| usc_galacticleopard19.glb | galacticleopard | Uncommon | $1 | 20.0 | Variant of galacticleopard class |
| usc_galacticleopard2.glb | galacticleopard | Uncommon | $1 | 20.0 | Variant of galacticleopard class |
| usc_galacticleopard20.glb | galacticleopard | Uncommon | $1 | 20.0 | Variant of galacticleopard class |
| usc_galacticleopard21.glb | galacticleopard | Uncommon | $1 | 20.0 | Variant of galacticleopard class |
| usc_galacticleopard22.glb | galacticleopard | Uncommon | $1 | 20.0 | Variant of galacticleopard class |
| usc_galacticleopard23.glb | galacticleopard | Uncommon | $1 | 20.0 | Variant of galacticleopard class |
| usc_galacticleopard24.glb | galacticleopard | Uncommon | $1 | 20.0 | Variant of galacticleopard class |
| usc_galacticleopard25.glb | galacticleopard | Uncommon | $1 | 20.0 | Variant of galacticleopard class |
| usc_galacticleopard26.glb | galacticleopard | Uncommon | $1 | 20.0 | Variant of galacticleopard class |
| usc_galacticleopard27.glb | galacticleopard | Uncommon | $1 | 20.0 | Variant of galacticleopard class |
| usc_galacticleopard28.glb | galacticleopard | Uncommon | $1 | 20.0 | Variant of galacticleopard class |
| usc_galacticleopard29.glb | galacticleopard | Uncommon | $1 | 20.0 | Variant of galacticleopard class |
| usc_galacticleopard3.glb | galacticleopard | Uncommon | $1 | 20.0 | Variant of galacticleopard class |
| usc_galacticleopard30.glb | galacticleopard | Uncommon | $1 | 20.0 | Variant of galacticleopard class |
| usc_galacticleopard31.glb | galacticleopard | Uncommon | $1 | 20.0 | Variant of galacticleopard class |
| usc_galacticleopard32.glb | galacticleopard | Uncommon | $1 | 20.0 | Variant of galacticleopard class |
| usc_galacticleopard33.glb | galacticleopard | Uncommon | $1 | 20.0 | Variant of galacticleopard class |
| usc_galacticleopard34.glb | galacticleopard | Uncommon | $1 | 20.0 | Variant of galacticleopard class |
| usc_galacticleopard35.glb | galacticleopard | Uncommon | $1 | 20.0 | Variant of galacticleopard class |
| usc_galacticleopard36.glb | galacticleopard | Uncommon | $1 | 20.0 | Variant of galacticleopard class |
| usc_galacticleopard37.glb | galacticleopard | Uncommon | $1 | 20.0 | Variant of galacticleopard class |
| usc_galacticleopard38.glb | galacticleopard | Uncommon | $1 | 20.0 | Variant of galacticleopard class |
| usc_galacticleopard39.glb | galacticleopard | Uncommon | $1 | 20.0 | Variant of galacticleopard class |
| usc_galacticleopard4.glb | galacticleopard | Uncommon | $1 | 20.0 | Variant of galacticleopard class |
| usc_galacticleopard40.glb | galacticleopard | Uncommon | $1 | 20.0 | Variant of galacticleopard class |
| usc_galacticleopard5.glb | galacticleopard | Uncommon | $1 | 20.0 | Variant of galacticleopard class |
| usc_galacticleopard6.glb | galacticleopard | Uncommon | $1 | 20.0 | Variant of galacticleopard class |
| usc_galacticleopard7.glb | galacticleopard | Uncommon | $1 | 20.0 | Variant of galacticleopard class |
| usc_galacticleopard8.glb | galacticleopard | Uncommon | $1 | 20.0 | Variant of galacticleopard class |
| usc_galacticleopard9.glb | galacticleopard | Uncommon | $1 | 20.0 | Variant of galacticleopard class |
| usc_galacticleopard_main_modules.glb | galacticleopard_main | Rare | $3 | 20.0 | Construction kit / parts library |
| usc_galacticleopard_parts_modules.glb | galacticleopard_parts | Rare | $3 | 20.0 | Construction kit / parts library |
| usc_galaxyraptor01.glb | galaxyraptor | Uncommon | $1 | 16.5 | Variant of galaxyraptor class |
| usc_galaxyraptor02.glb | galaxyraptor | Uncommon | $1 | 16.5 | Variant of galaxyraptor class |
| usc_galaxyraptor03.glb | galaxyraptor | Uncommon | $1 | 16.5 | Variant of galaxyraptor class |
| usc_galaxyraptor04.glb | galaxyraptor | Uncommon | $1 | 16.5 | Variant of galaxyraptor class |
| usc_galaxyraptor05.glb | galaxyraptor | Uncommon | $1 | 16.5 | Variant of galaxyraptor class |
| usc_galaxyraptor06.glb | galaxyraptor | Uncommon | $1 | 16.5 | Variant of galaxyraptor class |
| usc_galaxyraptor07.glb | galaxyraptor | Uncommon | $1 | 16.5 | Variant of galaxyraptor class |
| usc_galaxyraptor08.glb | galaxyraptor | Uncommon | $1 | 16.5 | Variant of galaxyraptor class |
| usc_galaxyraptor09.glb | galaxyraptor | Uncommon | $1 | 16.5 | Variant of galaxyraptor class |
| usc_galaxyraptor10.glb | galaxyraptor | Uncommon | $1 | 16.5 | Variant of galaxyraptor class |
| usc_galaxyraptor11.glb | galaxyraptor | Uncommon | $1 | 16.5 | Variant of galaxyraptor class |
| usc_galaxyraptor12.glb | galaxyraptor | Uncommon | $1 | 16.5 | Variant of galaxyraptor class |
| usc_galaxyraptor13.glb | galaxyraptor | Uncommon | $1 | 16.5 | Variant of galaxyraptor class |
| usc_galaxyraptor14.glb | galaxyraptor | Uncommon | $1 | 16.5 | Variant of galaxyraptor class |
| usc_galaxyraptor15.glb | galaxyraptor | Uncommon | $1 | 16.5 | Variant of galaxyraptor class |
| usc_galaxyraptor16.glb | galaxyraptor | Uncommon | $1 | 16.5 | Variant of galaxyraptor class |
| usc_galaxyraptor17.glb | galaxyraptor | Uncommon | $1 | 16.5 | Variant of galaxyraptor class |
| usc_galaxyraptor18.glb | galaxyraptor | Uncommon | $1 | 16.5 | Variant of galaxyraptor class |
| usc_galaxyraptor19.glb | galaxyraptor | Uncommon | $1 | 16.5 | Variant of galaxyraptor class |
| usc_galaxyraptor20.glb | galaxyraptor | Uncommon | $1 | 16.5 | Variant of galaxyraptor class |
| usc_galaxyraptormodules.glb | galaxyraptor | Rare | $3 | 16.5 | Construction kit / parts library |
| usc_genericspaceship01.glb | genericspaceship | Uncommon | $1 | 6.2 | Variant of genericspaceship class |
| usc_genericspaceship02.glb | genericspaceship | Uncommon | $1 | 6.2 | Variant of genericspaceship class |
| usc_genericspaceship03.glb | genericspaceship | Uncommon | $1 | 6.2 | Variant of genericspaceship class |
| usc_genericspaceship04.glb | genericspaceship | Uncommon | $1 | 6.2 | Variant of genericspaceship class |
| usc_genericspaceship05.glb | genericspaceship | Uncommon | $1 | 6.2 | Variant of genericspaceship class |
| usc_genericspaceship06.glb | genericspaceship | Uncommon | $1 | 6.2 | Variant of genericspaceship class |
| usc_genericspaceship07.glb | genericspaceship | Uncommon | $1 | 6.2 | Variant of genericspaceship class |
| usc_genericspaceship08.glb | genericspaceship | Uncommon | $1 | 6.2 | Variant of genericspaceship class |
| usc_hyperfalcon01.glb | hyperfalcon | Uncommon | $1 | 13.6 | Variant of hyperfalcon class |
| usc_hyperfalcon02.glb | hyperfalcon | Uncommon | $1 | 13.6 | Variant of hyperfalcon class |
| usc_hyperfalcon03.glb | hyperfalcon | Uncommon | $1 | 13.6 | Variant of hyperfalcon class |
| usc_hyperfalcon04.glb | hyperfalcon | Uncommon | $1 | 13.6 | Variant of hyperfalcon class |
| usc_hyperfalcon05.glb | hyperfalcon | Uncommon | $1 | 13.6 | Variant of hyperfalcon class |
| usc_hyperfalcon06.glb | hyperfalcon | Uncommon | $1 | 13.6 | Variant of hyperfalcon class |
| usc_hyperfalcon07.glb | hyperfalcon | Uncommon | $1 | 13.6 | Variant of hyperfalcon class |
| usc_hyperfalcon08.glb | hyperfalcon | Uncommon | $1 | 13.6 | Variant of hyperfalcon class |
| usc_hyperfalcon09.glb | hyperfalcon | Uncommon | $1 | 13.6 | Variant of hyperfalcon class |
| usc_hyperfalcon10.glb | hyperfalcon | Uncommon | $1 | 13.6 | Variant of hyperfalcon class |
| usc_hyperfalcon11.glb | hyperfalcon | Uncommon | $1 | 13.6 | Variant of hyperfalcon class |
| usc_hyperfalcon12.glb | hyperfalcon | Uncommon | $1 | 13.6 | Variant of hyperfalcon class |
| usc_hyperfalcon13.glb | hyperfalcon | Uncommon | $1 | 13.6 | Variant of hyperfalcon class |
| usc_hyperfalcon14.glb | hyperfalcon | Uncommon | $1 | 13.6 | Variant of hyperfalcon class |
| usc_hyperfalcon15.glb | hyperfalcon | Uncommon | $1 | 13.6 | Variant of hyperfalcon class |
| usc_hyperfalcon16.glb | hyperfalcon | Uncommon | $1 | 13.6 | Variant of hyperfalcon class |
| usc_hyperfalcon17.glb | hyperfalcon | Uncommon | $1 | 13.6 | Variant of hyperfalcon class |
| usc_hyperfalcon18.glb | hyperfalcon | Uncommon | $1 | 13.6 | Variant of hyperfalcon class |
| usc_hyperfalcon19.glb | hyperfalcon | Uncommon | $1 | 13.6 | Variant of hyperfalcon class |
| usc_hyperfalcon20.glb | hyperfalcon | Uncommon | $1 | 13.6 | Variant of hyperfalcon class |
| usc_hyperfalconmodules.glb | hyperfalcon | Rare | $3 | 13.6 | Construction kit / parts library |
| usc_lightfox01.glb | lightfox | Uncommon | $1 | 15.1 | Variant of lightfox class |
| usc_lightfox02.glb | lightfox | Uncommon | $1 | 15.1 | Variant of lightfox class |
| usc_lightfox03.glb | lightfox | Uncommon | $1 | 15.1 | Variant of lightfox class |
| usc_lightfox04.glb | lightfox | Uncommon | $1 | 15.1 | Variant of lightfox class |
| usc_lightfox05.glb | lightfox | Uncommon | $1 | 15.1 | Variant of lightfox class |
| usc_lightfox06.glb | lightfox | Uncommon | $1 | 15.1 | Variant of lightfox class |
| usc_lightfox07.glb | lightfox | Uncommon | $1 | 15.1 | Variant of lightfox class |
| usc_lightfox08.glb | lightfox | Uncommon | $1 | 15.1 | Variant of lightfox class |
| usc_lightfox09.glb | lightfox | Uncommon | $1 | 15.1 | Variant of lightfox class |
| usc_lightfox10.glb | lightfox | Uncommon | $1 | 15.1 | Variant of lightfox class |
| usc_lightfox11.glb | lightfox | Uncommon | $1 | 15.1 | Variant of lightfox class |
| usc_lightfox12.glb | lightfox | Uncommon | $1 | 15.1 | Variant of lightfox class |
| usc_lightfox13.glb | lightfox | Uncommon | $1 | 15.1 | Variant of lightfox class |
| usc_lightfox14.glb | lightfox | Uncommon | $1 | 15.1 | Variant of lightfox class |
| usc_lightfox15.glb | lightfox | Uncommon | $1 | 15.1 | Variant of lightfox class |
| usc_lightfox16.glb | lightfox | Uncommon | $1 | 15.1 | Variant of lightfox class |
| usc_lightfox17.glb | lightfox | Uncommon | $1 | 15.1 | Variant of lightfox class |
| usc_lightfox18.glb | lightfox | Uncommon | $1 | 15.1 | Variant of lightfox class |
| usc_lightfox19.glb | lightfox | Uncommon | $1 | 15.1 | Variant of lightfox class |
| usc_lightfox20.glb | lightfox | Uncommon | $1 | 15.1 | Variant of lightfox class |
| usc_lightfoxmodules.glb | lightfox | Rare | $3 | 15.1 | Construction kit / parts library |
| usc_meteormantis01.glb | meteormantis | Uncommon | $1 | 13.7 | Variant of meteormantis class |
| usc_meteormantis02.glb | meteormantis | Uncommon | $1 | 13.7 | Variant of meteormantis class |
| usc_meteormantis03.glb | meteormantis | Uncommon | $1 | 13.7 | Variant of meteormantis class |
| usc_meteormantis04.glb | meteormantis | Uncommon | $1 | 13.7 | Variant of meteormantis class |
| usc_meteormantis05.glb | meteormantis | Uncommon | $1 | 13.7 | Variant of meteormantis class |
| usc_meteormantis06.glb | meteormantis | Uncommon | $1 | 13.7 | Variant of meteormantis class |
| usc_meteormantis07.glb | meteormantis | Uncommon | $1 | 13.7 | Variant of meteormantis class |
| usc_meteormantis08.glb | meteormantis | Uncommon | $1 | 13.7 | Variant of meteormantis class |
| usc_meteormantis09.glb | meteormantis | Uncommon | $1 | 13.7 | Variant of meteormantis class |
| usc_meteormantis10.glb | meteormantis | Uncommon | $1 | 13.7 | Variant of meteormantis class |
| usc_meteormantis11.glb | meteormantis | Uncommon | $1 | 13.7 | Variant of meteormantis class |
| usc_meteormantis12.glb | meteormantis | Uncommon | $1 | 13.7 | Variant of meteormantis class |
| usc_meteormantis13.glb | meteormantis | Uncommon | $1 | 13.7 | Variant of meteormantis class |
| usc_meteormantis14.glb | meteormantis | Uncommon | $1 | 13.7 | Variant of meteormantis class |
| usc_meteormantis15.glb | meteormantis | Uncommon | $1 | 13.7 | Variant of meteormantis class |
| usc_meteormantis16.glb | meteormantis | Uncommon | $1 | 13.7 | Variant of meteormantis class |
| usc_meteormantis17.glb | meteormantis | Uncommon | $1 | 13.7 | Variant of meteormantis class |
| usc_meteormantis18.glb | meteormantis | Uncommon | $1 | 13.7 | Variant of meteormantis class |
| usc_meteormantis19.glb | meteormantis | Uncommon | $1 | 13.7 | Variant of meteormantis class |
| usc_meteormantis20.glb | meteormantis | Uncommon | $1 | 13.7 | Variant of meteormantis class |
| usc_meteormantismodules.glb | meteormantis | Rare | $3 | 13.7 | Construction kit / parts library |
| usc_nightaye01.glb | nightaye | Uncommon | $1 | 18.9 | Variant of nightaye class |
| usc_nightaye02.glb | nightaye | Uncommon | $1 | 18.9 | Variant of nightaye class |
| usc_nightaye03.glb | nightaye | Uncommon | $1 | 18.9 | Variant of nightaye class |
| usc_nightaye04.glb | nightaye | Uncommon | $1 | 18.9 | Variant of nightaye class |
| usc_nightaye05.glb | nightaye | Uncommon | $1 | 18.9 | Variant of nightaye class |
| usc_nightaye06.glb | nightaye | Uncommon | $1 | 18.9 | Variant of nightaye class |
| usc_nightaye07.glb | nightaye | Uncommon | $1 | 18.9 | Variant of nightaye class |
| usc_nightaye08.glb | nightaye | Uncommon | $1 | 18.9 | Variant of nightaye class |
| usc_nightaye09.glb | nightaye | Uncommon | $1 | 18.9 | Variant of nightaye class |
| usc_nightaye10.glb | nightaye | Uncommon | $1 | 18.9 | Variant of nightaye class |
| usc_nightaye11.glb | nightaye | Uncommon | $1 | 18.9 | Variant of nightaye class |
| usc_nightaye12.glb | nightaye | Uncommon | $1 | 18.9 | Variant of nightaye class |
| usc_nightaye13.glb | nightaye | Uncommon | $1 | 18.9 | Variant of nightaye class |
| usc_nightaye14.glb | nightaye | Uncommon | $1 | 18.9 | Variant of nightaye class |
| usc_nightaye15.glb | nightaye | Uncommon | $1 | 18.9 | Variant of nightaye class |
| usc_nightaye16.glb | nightaye | Uncommon | $1 | 18.9 | Variant of nightaye class |
| usc_nightaye17.glb | nightaye | Uncommon | $1 | 18.9 | Variant of nightaye class |
| usc_nightaye18.glb | nightaye | Uncommon | $1 | 18.9 | Variant of nightaye class |
| usc_nightaye19.glb | nightaye | Uncommon | $1 | 18.9 | Variant of nightaye class |
| usc_nightaye20.glb | nightaye | Uncommon | $1 | 18.9 | Variant of nightaye class |
| usc_nightayemodules.glb | nightaye | Rare | $3 | 18.9 | Construction kit / parts library |
| usc_protonlegacy01.glb | protonlegacy | Uncommon | $2 | 9.0 | Variant of protonlegacy class |
| usc_protonlegacy02.glb | protonlegacy | Uncommon | $2 | 9.1 | Variant of protonlegacy class |
| usc_protonlegacy03.glb | protonlegacy | Uncommon | $2 | 9.0 | Variant of protonlegacy class |
| usc_protonlegacy04.glb | protonlegacy | Uncommon | $2 | 9.0 | Variant of protonlegacy class |
| usc_protonlegacy05.glb | protonlegacy | Uncommon | $2 | 9.0 | Variant of protonlegacy class |
| usc_protonlegacy06.glb | protonlegacy | Uncommon | $2 | 9.0 | Variant of protonlegacy class |
| usc_protonlegacy07.glb | protonlegacy | Uncommon | $2 | 9.0 | Variant of protonlegacy class |
| usc_protonlegacy08.glb | protonlegacy | Uncommon | $2 | 9.0 | Variant of protonlegacy class |
| usc_protonlegacy09.glb | protonlegacy | Uncommon | $2 | 9.1 | Variant of protonlegacy class |
| usc_protonlegacy10.glb | protonlegacy | Uncommon | $2 | 9.1 | Variant of protonlegacy class |
| usc_protonlegacy11.glb | protonlegacy | Uncommon | $2 | 9.0 | Variant of protonlegacy class |
| usc_protonlegacy12.glb | protonlegacy | Uncommon | $2 | 9.0 | Variant of protonlegacy class |
| usc_protonlegacy13.glb | protonlegacy | Uncommon | $2 | 9.0 | Variant of protonlegacy class |
| usc_protonlegacy14.glb | protonlegacy | Uncommon | $2 | 9.0 | Variant of protonlegacy class |
| usc_protonlegacy15.glb | protonlegacy | Uncommon | $2 | 9.0 | Variant of protonlegacy class |
| usc_protonlegacy16.glb | protonlegacy | Uncommon | $2 | 9.0 | Variant of protonlegacy class |
| usc_protonlegacy17.glb | protonlegacy | Uncommon | $2 | 9.0 | Variant of protonlegacy class |
| usc_protonlegacy18.glb | protonlegacy | Uncommon | $2 | 9.0 | Variant of protonlegacy class |
| usc_protonlegacy19.glb | protonlegacy | Uncommon | $2 | 9.0 | Variant of protonlegacy class |
| usc_protonlegacy20.glb | protonlegacy | Uncommon | $2 | 9.0 | Variant of protonlegacy class |
| usc_protonlegacymodules.glb | protonlegacy | Rare | $3 | 9.1 | Construction kit / parts library |
| usc_spaceexcalibur01.glb | spaceexcalibur | Uncommon | $2 | 9.4 | Variant of spaceexcalibur class |
| usc_spaceexcalibur02.glb | spaceexcalibur | Uncommon | $2 | 9.4 | Variant of spaceexcalibur class |
| usc_spaceexcalibur03.glb | spaceexcalibur | Uncommon | $2 | 9.4 | Variant of spaceexcalibur class |
| usc_spaceexcalibur04.glb | spaceexcalibur | Uncommon | $2 | 9.4 | Variant of spaceexcalibur class |
| usc_spaceexcalibur05.glb | spaceexcalibur | Uncommon | $2 | 9.4 | Variant of spaceexcalibur class |
| usc_spaceexcalibur06.glb | spaceexcalibur | Uncommon | $2 | 9.4 | Variant of spaceexcalibur class |
| usc_spaceexcalibur07.glb | spaceexcalibur | Uncommon | $2 | 9.4 | Variant of spaceexcalibur class |
| usc_spaceexcalibur08.glb | spaceexcalibur | Uncommon | $2 | 9.4 | Variant of spaceexcalibur class |
| usc_spaceexcalibur09.glb | spaceexcalibur | Uncommon | $2 | 9.4 | Variant of spaceexcalibur class |
| usc_spaceexcalibur10.glb | spaceexcalibur | Uncommon | $2 | 9.4 | Variant of spaceexcalibur class |
| usc_spaceexcalibur11.glb | spaceexcalibur | Uncommon | $2 | 9.4 | Variant of spaceexcalibur class |
| usc_spaceexcalibur12.glb | spaceexcalibur | Uncommon | $2 | 9.4 | Variant of spaceexcalibur class |
| usc_spaceexcalibur13.glb | spaceexcalibur | Uncommon | $2 | 9.4 | Variant of spaceexcalibur class |
| usc_spaceexcalibur14.glb | spaceexcalibur | Uncommon | $2 | 9.4 | Variant of spaceexcalibur class |
| usc_spaceexcalibur15.glb | spaceexcalibur | Uncommon | $2 | 9.4 | Variant of spaceexcalibur class |
| usc_spaceexcalibur16.glb | spaceexcalibur | Uncommon | $2 | 9.4 | Variant of spaceexcalibur class |
| usc_spaceexcalibur17.glb | spaceexcalibur | Uncommon | $2 | 9.4 | Variant of spaceexcalibur class |
| usc_spaceexcalibur18.glb | spaceexcalibur | Uncommon | $2 | 9.4 | Variant of spaceexcalibur class |
| usc_spaceexcalibur19.glb | spaceexcalibur | Uncommon | $2 | 9.4 | Variant of spaceexcalibur class |
| usc_spaceexcalibur20.glb | spaceexcalibur | Uncommon | $2 | 9.4 | Variant of spaceexcalibur class |
| usc_spaceexcaliburmodules.glb | spaceexcalibur | Rare | $3 | 9.5 | Construction kit / parts library |
| usc_spacesphinx01.glb | spacesphinx | Uncommon | $2 | 8.6 | Variant of spacesphinx class |
| usc_spacesphinx02.glb | spacesphinx | Uncommon | $2 | 8.6 | Variant of spacesphinx class |
| usc_spacesphinx03.glb | spacesphinx | Uncommon | $2 | 8.6 | Variant of spacesphinx class |
| usc_spacesphinx04.glb | spacesphinx | Uncommon | $2 | 8.6 | Variant of spacesphinx class |
| usc_spacesphinx05.glb | spacesphinx | Uncommon | $2 | 8.6 | Variant of spacesphinx class |
| usc_spacesphinx06.glb | spacesphinx | Uncommon | $2 | 8.6 | Variant of spacesphinx class |
| usc_spacesphinx07.glb | spacesphinx | Uncommon | $2 | 8.6 | Variant of spacesphinx class |
| usc_spacesphinx08.glb | spacesphinx | Uncommon | $2 | 8.6 | Variant of spacesphinx class |
| usc_spacesphinxmodules.glb | spacesphinx | Rare | $3 | 8.6 | Construction kit / parts library |
| usc_starsparrow01.glb | starsparrow | Uncommon | $1 | 10.7 | Variant of starsparrow class |
| usc_starsparrow02.glb | starsparrow | Uncommon | $1 | 10.7 | Variant of starsparrow class |
| usc_starsparrow03.glb | starsparrow | Uncommon | $1 | 10.7 | Variant of starsparrow class |
| usc_starsparrow04.glb | starsparrow | Uncommon | $1 | 10.7 | Variant of starsparrow class |
| usc_starsparrow05.glb | starsparrow | Uncommon | $1 | 10.7 | Variant of starsparrow class |
| usc_starsparrow06.glb | starsparrow | Uncommon | $1 | 10.7 | Variant of starsparrow class |
| usc_starsparrow07.glb | starsparrow | Uncommon | $1 | 10.7 | Variant of starsparrow class |
| usc_starsparrow08.glb | starsparrow | Uncommon | $1 | 10.7 | Variant of starsparrow class |
| usc_starsparrow09.glb | starsparrow | Uncommon | $1 | 10.7 | Variant of starsparrow class |
| usc_starsparrow10.glb | starsparrow | Uncommon | $1 | 10.7 | Variant of starsparrow class |
| usc_starsparrow11.glb | starsparrow | Uncommon | $1 | 10.7 | Variant of starsparrow class |
| usc_starsparrow12.glb | starsparrow | Uncommon | $1 | 10.7 | Variant of starsparrow class |
| usc_starsparrow13.glb | starsparrow | Uncommon | $1 | 10.7 | Variant of starsparrow class |
| usc_starsparrow14.glb | starsparrow | Uncommon | $1 | 10.7 | Variant of starsparrow class |
| usc_starsparrow15.glb | starsparrow | Uncommon | $1 | 10.7 | Variant of starsparrow class |
| usc_starsparrow16.glb | starsparrow | Uncommon | $1 | 10.7 | Variant of starsparrow class |
| usc_starsparrow17.glb | starsparrow | Uncommon | $1 | 10.7 | Variant of starsparrow class |
| usc_starsparrow18.glb | starsparrow | Uncommon | $1 | 10.7 | Variant of starsparrow class |
| usc_starsparrow19.glb | starsparrow | Uncommon | $1 | 10.7 | Variant of starsparrow class |
| usc_starsparrow20.glb | starsparrow | Uncommon | $1 | 10.7 | Variant of starsparrow class |
| usc_starsparrowmodules.glb | starsparrow | Rare | $3 | 10.7 | Construction kit / parts library |
| usc_striderox01.glb | striderox | Uncommon | $2 | 19.8 | Variant of striderox class |
| usc_striderox02.glb | striderox | Uncommon | $2 | 19.8 | Variant of striderox class |
| usc_striderox03.glb | striderox | Uncommon | $2 | 19.8 | Variant of striderox class |
| usc_striderox04.glb | striderox | Uncommon | $2 | 19.8 | Variant of striderox class |
| usc_striderox05.glb | striderox | Uncommon | $2 | 19.8 | Variant of striderox class |
| usc_striderox06.glb | striderox | Uncommon | $2 | 19.8 | Variant of striderox class |
| usc_striderox07.glb | striderox | Uncommon | $2 | 19.8 | Variant of striderox class |
| usc_striderox08.glb | striderox | Uncommon | $2 | 19.8 | Variant of striderox class |
| usc_striderox09.glb | striderox | Uncommon | $2 | 19.8 | Variant of striderox class |
| usc_striderox10.glb | striderox | Uncommon | $2 | 19.8 | Variant of striderox class |
| usc_striderox11.glb | striderox | Uncommon | $2 | 19.8 | Variant of striderox class |
| usc_striderox12.glb | striderox | Uncommon | $2 | 19.8 | Variant of striderox class |
| usc_striderox13.glb | striderox | Uncommon | $2 | 19.8 | Variant of striderox class |
| usc_striderox14.glb | striderox | Uncommon | $2 | 19.8 | Variant of striderox class |
| usc_striderox15.glb | striderox | Uncommon | $2 | 19.8 | Variant of striderox class |
| usc_striderox16.glb | striderox | Uncommon | $2 | 19.8 | Variant of striderox class |
| usc_striderox17.glb | striderox | Uncommon | $2 | 19.8 | Variant of striderox class |
| usc_striderox18.glb | striderox | Uncommon | $2 | 19.8 | Variant of striderox class |
| usc_striderox19.glb | striderox | Uncommon | $2 | 19.8 | Variant of striderox class |
| usc_striderox20.glb | striderox | Uncommon | $2 | 19.8 | Variant of striderox class |
| usc_strideroxmodules.glb | striderox | Rare | $3 | 19.8 | Construction kit / parts library |
| usc_voidwhale01.glb | voidwhale | Uncommon | $2 | 17.0 | Variant of voidwhale class |
| usc_voidwhale02.glb | voidwhale | Uncommon | $2 | 17.1 | Variant of voidwhale class |
| usc_voidwhale03.glb | voidwhale | Uncommon | $2 | 17.0 | Variant of voidwhale class |
| usc_voidwhale04.glb | voidwhale | Uncommon | $2 | 17.0 | Variant of voidwhale class |
| usc_voidwhale05.glb | voidwhale | Uncommon | $2 | 17.0 | Variant of voidwhale class |
| usc_voidwhale06.glb | voidwhale | Uncommon | $2 | 17.0 | Variant of voidwhale class |
| usc_voidwhale07.glb | voidwhale | Uncommon | $2 | 17.0 | Variant of voidwhale class |
| usc_voidwhale08.glb | voidwhale | Uncommon | $2 | 17.0 | Variant of voidwhale class |
| usc_voidwhale09.glb | voidwhale | Uncommon | $2 | 17.0 | Variant of voidwhale class |
| usc_voidwhalemodules.glb | voidwhale | Rare | $3 | 17.0 | Construction kit / parts library |

### USC Expansion (58)

All Rare. Includes the 6 "GenericSpacehips" set (ArrowShip / Nova / Pullora / ScorpionShip / SpiderShip / StarShip) plus GalacticOkamoto + StarForce variants and one modules kit.

| File | Class | Rarity | Price | Size | Notes |
|---|---|---|---|---:|---|
| uscx_arrowship.glb | arrowship | Rare | $4 | 0.4 | Unique GenericSpacehips variant — premium silhouette |
| uscx_galacticokamoto1.glb | galacticokamoto | Rare | $2 | 19.6 | Variant of galacticokamoto class |
| uscx_galacticokamoto10.glb | galacticokamoto | Rare | $2 | 19.6 | Variant of galacticokamoto class |
| uscx_galacticokamoto11.glb | galacticokamoto | Rare | $2 | 19.6 | Variant of galacticokamoto class |
| uscx_galacticokamoto12.glb | galacticokamoto | Rare | $2 | 19.6 | Variant of galacticokamoto class |
| uscx_galacticokamoto13.glb | galacticokamoto | Rare | $2 | 19.6 | Variant of galacticokamoto class |
| uscx_galacticokamoto14.glb | galacticokamoto | Rare | $2 | 19.6 | Variant of galacticokamoto class |
| uscx_galacticokamoto15.glb | galacticokamoto | Rare | $2 | 19.6 | Variant of galacticokamoto class |
| uscx_galacticokamoto16.glb | galacticokamoto | Rare | $2 | 19.6 | Variant of galacticokamoto class |
| uscx_galacticokamoto17.glb | galacticokamoto | Rare | $2 | 19.6 | Variant of galacticokamoto class |
| uscx_galacticokamoto18.glb | galacticokamoto | Rare | $2 | 19.6 | Variant of galacticokamoto class |
| uscx_galacticokamoto19.glb | galacticokamoto | Rare | $2 | 19.6 | Variant of galacticokamoto class |
| uscx_galacticokamoto2.glb | galacticokamoto | Rare | $2 | 19.6 | Variant of galacticokamoto class |
| uscx_galacticokamoto20.glb | galacticokamoto | Rare | $2 | 19.6 | Variant of galacticokamoto class |
| uscx_galacticokamoto21.glb | galacticokamoto | Rare | $2 | 19.6 | Variant of galacticokamoto class |
| uscx_galacticokamoto22.glb | galacticokamoto | Rare | $2 | 19.6 | Variant of galacticokamoto class |
| uscx_galacticokamoto23.glb | galacticokamoto | Rare | $2 | 19.6 | Variant of galacticokamoto class |
| uscx_galacticokamoto24.glb | galacticokamoto | Rare | $2 | 19.6 | Variant of galacticokamoto class |
| uscx_galacticokamoto25.glb | galacticokamoto | Rare | $2 | 19.6 | Variant of galacticokamoto class |
| uscx_galacticokamoto26.glb | galacticokamoto | Rare | $2 | 19.6 | Variant of galacticokamoto class |
| uscx_galacticokamoto27.glb | galacticokamoto | Rare | $2 | 19.6 | Variant of galacticokamoto class |
| uscx_galacticokamoto28.glb | galacticokamoto | Rare | $2 | 19.6 | Variant of galacticokamoto class |
| uscx_galacticokamoto29.glb | galacticokamoto | Rare | $2 | 19.6 | Variant of galacticokamoto class |
| uscx_galacticokamoto3.glb | galacticokamoto | Rare | $2 | 19.6 | Variant of galacticokamoto class |
| uscx_galacticokamoto30.glb | galacticokamoto | Rare | $2 | 19.6 | Variant of galacticokamoto class |
| uscx_galacticokamoto4.glb | galacticokamoto | Rare | $2 | 19.6 | Variant of galacticokamoto class |
| uscx_galacticokamoto5.glb | galacticokamoto | Rare | $2 | 19.6 | Variant of galacticokamoto class |
| uscx_galacticokamoto6.glb | galacticokamoto | Rare | $2 | 19.6 | Variant of galacticokamoto class |
| uscx_galacticokamoto7.glb | galacticokamoto | Rare | $2 | 19.6 | Variant of galacticokamoto class |
| uscx_galacticokamoto8.glb | galacticokamoto | Rare | $2 | 19.6 | Variant of galacticokamoto class |
| uscx_galacticokamoto9.glb | galacticokamoto | Rare | $2 | 19.6 | Variant of galacticokamoto class |
| uscx_galacticokamoto_modules.glb | galacticokamoto | Rare | $4 | 19.6 | Construction kit |
| uscx_nova.glb | nova | Rare | $4 | 0.5 | Unique GenericSpacehips variant — premium silhouette |
| uscx_pullora.glb | pullora | Rare | $4 | 0.5 | Unique GenericSpacehips variant — premium silhouette |
| uscx_scorpionship.glb | scorpionship | Rare | $4 | 0.6 | Unique GenericSpacehips variant — premium silhouette |
| uscx_spidership.glb | spidership | Rare | $4 | 0.5 | Unique GenericSpacehips variant — premium silhouette |
| uscx_starforce01.glb | starforce | Rare | $2 | 3.5 | Variant of starforce class |
| uscx_starforce02.glb | starforce | Rare | $2 | 3.6 | Variant of starforce class |
| uscx_starforce03.glb | starforce | Rare | $2 | 3.5 | Variant of starforce class |
| uscx_starforce04.glb | starforce | Rare | $2 | 3.5 | Variant of starforce class |
| uscx_starforce05.glb | starforce | Rare | $2 | 3.5 | Variant of starforce class |
| uscx_starforce06.glb | starforce | Rare | $2 | 3.5 | Variant of starforce class |
| uscx_starforce07.glb | starforce | Rare | $2 | 3.6 | Variant of starforce class |
| uscx_starforce08.glb | starforce | Rare | $2 | 3.6 | Variant of starforce class |
| uscx_starforce09.glb | starforce | Rare | $2 | 3.5 | Variant of starforce class |
| uscx_starforce10.glb | starforce | Rare | $2 | 3.5 | Variant of starforce class |
| uscx_starforce11.glb | starforce | Rare | $2 | 3.5 | Variant of starforce class |
| uscx_starforce12.glb | starforce | Rare | $2 | 3.5 | Variant of starforce class |
| uscx_starforce13.glb | starforce | Rare | $2 | 3.5 | Variant of starforce class |
| uscx_starforce14.glb | starforce | Rare | $2 | 3.6 | Variant of starforce class |
| uscx_starforce15.glb | starforce | Rare | $2 | 3.5 | Variant of starforce class |
| uscx_starforce16.glb | starforce | Rare | $2 | 3.5 | Variant of starforce class |
| uscx_starforce17.glb | starforce | Rare | $2 | 3.5 | Variant of starforce class |
| uscx_starforce18.glb | starforce | Rare | $2 | 3.5 | Variant of starforce class |
| uscx_starforce19.glb | starforce | Rare | $2 | 3.5 | Variant of starforce class |
| uscx_starforce20.glb | starforce | Rare | $2 | 3.5 | Variant of starforce class |
| uscx_starforcemodules.glb | starforce | Rare | $4 | 3.5 | Construction kit |
| uscx_starship.glb | starship | Rare | $4 | 0.7 | Unique GenericSpacehips variant — premium silhouette |

### Quaternius Ultimate Spaceships (11) — COMMON / starter pool

Free starter ships. `qs_dispatcher` doubles as the "Scout Ship" achievement reward. `qs_striker` is the default starter.

| File | Suggested role | Rarity | Price | Size | Notes |
|---|---|---|---|---:|---|
| qs_bob.glb | Cruiser, balanced | Common | $0.50 (skin variant) | 2.6 | Quaternius CC0; baked atlas |
| qs_challenger.glb | Heavy fighter | Common | $0.50 (skin variant) | 3.3 | Quaternius CC0; baked atlas |
| qs_dispatcher.glb | Scout — Explorer achievement reward | Common | $0.50 (skin variant) | 2.2 | Quaternius CC0; baked atlas |
| qs_executioner.glb | Heavy attack | Common | $0.50 (skin variant) | 3.0 | Quaternius CC0; baked atlas |
| qs_imperial.glb | Capital cruiser | Common | $0.50 (skin variant) | 3.1 | Quaternius CC0; baked atlas |
| qs_insurgent.glb | Stealth ambusher | Common | $0.50 (skin variant) | 2.1 | Quaternius CC0; baked atlas |
| qs_omen.glb | Mid-tier dogfighter | Common | $0.50 (skin variant) | 3.1 | Quaternius CC0; baked atlas |
| qs_pancake.glb | Wide racer (bonus turn radius) | Common | $0.50 (skin variant) | 3.2 | Quaternius CC0; baked atlas |
| qs_spitfire.glb | Fast fighter | Common | $0.50 (skin variant) | 3.2 | Quaternius CC0; baked atlas |
| qs_striker.glb | Default starter | Common | **FREE** (starter) | 1.8 | Quaternius CC0; baked atlas |
| qs_zenith.glb | Top-tier all-rounder | Common | $0.50 (skin variant) | 3.2 | Quaternius CC0; baked atlas |

### Quaternius Ultimate Space Kit (92)

CC0. Used for in-world dressing — astronauts at stations, NPC enemies in Free Flight, vegetation on planets, building props at the voidexa Hub. Not directly purchasable; bundled with planet ownership or world content.

| File | Category | Size | Suggested use |
|---|---|---:|---|
| qsk_astronaut_barbarathebee.glb | Character | 0.6 | Station NPC / pilot avatar |
| qsk_astronaut_fernandotheflamingo.glb | Character | 0.6 | Station NPC / pilot avatar |
| qsk_astronaut_finnthefrog.glb | Character | 0.6 | Station NPC / pilot avatar |
| qsk_astronaut_raetheredpanda.glb | Character | 0.6 | Station NPC / pilot avatar |
| qsk_base_large.glb | Building | 0.0 | Hub / planet station |
| qsk_building_l.glb | Building | 0.0 | Hub / planet station |
| qsk_bush_1.glb | Foliage | 0.0 | Planet surface dressing |
| qsk_bush_2.glb | Foliage | 0.0 | Planet surface dressing |
| qsk_bush_3.glb | Foliage | 0.0 | Planet surface dressing |
| qsk_connector.glb | Station part | 0.0 | Hub modular dressing |
| qsk_enemy_extrasmall.glb | NPC | 0.1 | Free Flight hostile mob |
| qsk_enemy_flying.glb | NPC | 0.1 | Free Flight hostile mob |
| qsk_enemy_large.glb | NPC | 0.4 | Free Flight hostile mob |
| qsk_enemy_small.glb | NPC | 0.1 | Free Flight hostile mob |
| qsk_geodesicdome.glb | Misc prop | 0.0 | World decoration |
| qsk_grass_1.glb | Foliage | 0.0 | Planet surface dressing |
| qsk_grass_2.glb | Foliage | 0.0 | Planet surface dressing |
| qsk_grass_3.glb | Foliage | 0.0 | Planet surface dressing |
| qsk_house_cylinder.glb | Building | 0.0 | Hub / planet station |
| qsk_house_long.glb | Building | 0.0 | Hub / planet station |
| qsk_house_open.glb | Building | 0.0 | Hub / planet station |
| qsk_house_openback.glb | Building | 0.0 | Hub / planet station |
| qsk_house_single.glb | Building | 0.0 | Hub / planet station |
| qsk_house_single_support.glb | Building | 0.0 | Hub / planet station |
| qsk_mech_barbarathebee.glb | Character | 0.3 | Station NPC / pilot avatar |
| qsk_mech_fernandotheflamingo.glb | Character | 0.2 | Station NPC / pilot avatar |
| qsk_mech_finnthefrog.glb | Character | 0.3 | Station NPC / pilot avatar |
| qsk_mech_raetheredpanda.glb | Character | 0.2 | Station NPC / pilot avatar |
| qsk_metalsupport.glb | Terrain / structure | 0.0 | World decoration |
| qsk_pickup_bullets.glb | Pickup | 0.0 | In-world reward orb |
| qsk_pickup_crate.glb | Pickup | 0.0 | In-world reward orb |
| qsk_pickup_health.glb | Pickup | 0.0 | In-world reward orb |
| qsk_pickup_jar.glb | Pickup | 0.0 | In-world reward orb |
| qsk_pickup_keycard.glb | Pickup | 0.0 | In-world reward orb |
| qsk_pickup_sphere.glb | Pickup | 0.0 | In-world reward orb |
| qsk_pickup_thunder.glb | Pickup | 0.0 | In-world reward orb |
| qsk_planet_1.glb | Celestial | 0.0 | Background scenery |
| qsk_planet_10.glb | Celestial | 0.0 | Background scenery |
| qsk_planet_11.glb | Celestial | 0.0 | Background scenery |
| qsk_planet_2.glb | Celestial | 0.0 | Background scenery |
| qsk_planet_3.glb | Celestial | 0.0 | Background scenery |
| qsk_planet_4.glb | Celestial | 0.0 | Background scenery |
| qsk_planet_5.glb | Celestial | 0.0 | Background scenery |
| qsk_planet_6.glb | Celestial | 0.0 | Background scenery |
| qsk_planet_7.glb | Celestial | 0.0 | Background scenery |
| qsk_planet_8.glb | Celestial | 0.0 | Background scenery |
| qsk_planet_9.glb | Celestial | 0.0 | Background scenery |
| qsk_plant_1.glb | Foliage | 0.0 | Planet surface dressing |
| qsk_plant_2.glb | Foliage | 0.0 | Planet surface dressing |
| qsk_plant_3.glb | Foliage | 0.0 | Planet surface dressing |
| qsk_ramp.glb | Misc prop | 0.0 | World decoration |
| qsk_rock_1.glb | Terrain / structure | 0.0 | World decoration |
| qsk_rock_2.glb | Terrain / structure | 0.0 | World decoration |
| qsk_rock_3.glb | Terrain / structure | 0.0 | World decoration |
| qsk_rock_4.glb | Terrain / structure | 0.0 | World decoration |
| qsk_rock_large_1.glb | Terrain / structure | 0.0 | World decoration |
| qsk_rock_large_2.glb | Terrain / structure | 0.0 | World decoration |
| qsk_rock_large_3.glb | Terrain / structure | 0.0 | World decoration |
| qsk_roof_antenna.glb | Misc prop | 0.0 | World decoration |
| qsk_roof_opening.glb | Misc prop | 0.0 | World decoration |
| qsk_roof_radar.glb | Misc prop | 0.0 | World decoration |
| qsk_roof_ventl.glb | Misc prop | 0.0 | World decoration |
| qsk_roof_ventr.glb | Misc prop | 0.0 | World decoration |
| qsk_rover_1.glb | Vehicle | 0.0 | NPC patrol / ambient traffic |
| qsk_rover_2.glb | Vehicle | 0.0 | NPC patrol / ambient traffic |
| qsk_rover_round.glb | Vehicle | 0.0 | NPC patrol / ambient traffic |
| qsk_solarpanel_ground.glb | Misc prop | 0.0 | World decoration |
| qsk_solarpanel_roof.glb | Misc prop | 0.0 | World decoration |
| qsk_solarpanel_structure.glb | Building | 0.0 | Hub / planet station |
| qsk_spaceship_barbarathebee.glb | Vehicle | 0.0 | NPC patrol / ambient traffic |
| qsk_spaceship_fernandotheflamingo.glb | Vehicle | 0.0 | NPC patrol / ambient traffic |
| qsk_spaceship_finnthefrog.glb | Vehicle | 0.0 | NPC patrol / ambient traffic |
| qsk_spaceship_raetheredpanda.glb | Vehicle | 0.0 | NPC patrol / ambient traffic |
| qsk_stairs.glb | Misc prop | 0.0 | World decoration |
| qsk_tree_blob_1.glb | Foliage | 0.0 | Planet surface dressing |
| qsk_tree_blob_2.glb | Foliage | 0.0 | Planet surface dressing |
| qsk_tree_blob_3.glb | Foliage | 0.0 | Planet surface dressing |
| qsk_tree_floating_1.glb | Foliage | 0.0 | Planet surface dressing |
| qsk_tree_floating_2.glb | Foliage | 0.0 | Planet surface dressing |
| qsk_tree_floating_3.glb | Foliage | 0.0 | Planet surface dressing |
| qsk_tree_lava_1.glb | Foliage | 0.0 | Planet surface dressing |
| qsk_tree_lava_2.glb | Foliage | 0.0 | Planet surface dressing |
| qsk_tree_lava_3.glb | Foliage | 0.0 | Planet surface dressing |
| qsk_tree_light_1.glb | Foliage | 0.0 | Planet surface dressing |
| qsk_tree_light_2.glb | Foliage | 0.0 | Planet surface dressing |
| qsk_tree_spikes_1.glb | Foliage | 0.0 | Planet surface dressing |
| qsk_tree_spikes_2.glb | Foliage | 0.0 | Planet surface dressing |
| qsk_tree_spiral_1.glb | Foliage | 0.0 | Planet surface dressing |
| qsk_tree_spiral_2.glb | Foliage | 0.0 | Planet surface dressing |
| qsk_tree_spiral_3.glb | Foliage | 0.0 | Planet surface dressing |
| qsk_tree_swirl_1.glb | Foliage | 0.0 | Planet surface dressing |
| qsk_tree_swirl_2.glb | Foliage | 0.0 | Planet surface dressing |

### Quaternius Ultimate Modular Sci-Fi (91)

CC0. Modular station interiors — columns, panels, vents, details. Bundled with planet ownership for the Pioneer-tier station fit-out.

| File | Category | Size | Suggested use |
|---|---|---:|---|
| qmsf_column_1.glb | Station column | 0.0 | Pioneer station interior modular kit |
| qmsf_column_2.glb | Station column | 0.0 | Pioneer station interior modular kit |
| qmsf_column_3.glb | Station column | 0.0 | Pioneer station interior modular kit |
| qmsf_column_slim.glb | Station column | 0.0 | Pioneer station interior modular kit |
| qmsf_details_arrow.glb | Detail trim | 0.0 | Pioneer station interior modular kit |
| qmsf_details_arrow_2.glb | Detail trim | 0.0 | Pioneer station interior modular kit |
| qmsf_details_basic_1.glb | Detail trim | 0.0 | Pioneer station interior modular kit |
| qmsf_details_basic_2.glb | Detail trim | 0.0 | Pioneer station interior modular kit |
| qmsf_details_basic_3.glb | Detail trim | 0.0 | Pioneer station interior modular kit |
| qmsf_details_basic_4.glb | Detail trim | 0.0 | Pioneer station interior modular kit |
| qmsf_details_cylinder.glb | Detail trim | 0.0 | Pioneer station interior modular kit |
| qmsf_details_cylinder_long.glb | Detail trim | 0.0 | Pioneer station interior modular kit |
| qmsf_details_dots.glb | Detail trim | 0.0 | Pioneer station interior modular kit |
| qmsf_details_hexagon.glb | Detail trim | 0.0 | Pioneer station interior modular kit |
| qmsf_details_output.glb | Detail trim | 0.0 | Pioneer station interior modular kit |
| qmsf_details_output_small.glb | Detail trim | 0.0 | Pioneer station interior modular kit |
| qmsf_details_pipes_long.glb | Detail trim | 0.0 | Pioneer station interior modular kit |
| qmsf_details_pipes_medium.glb | Detail trim | 0.0 | Pioneer station interior modular kit |
| qmsf_details_pipes_small.glb | Detail trim | 0.0 | Pioneer station interior modular kit |
| qmsf_details_plate_details.glb | Detail trim | 0.0 | Pioneer station interior modular kit |
| qmsf_details_plate_large.glb | Detail trim | 0.0 | Pioneer station interior modular kit |
| qmsf_details_plate_long.glb | Detail trim | 0.0 | Pioneer station interior modular kit |
| qmsf_details_plate_small.glb | Detail trim | 0.0 | Pioneer station interior modular kit |
| qmsf_details_triangles.glb | Detail trim | 0.0 | Pioneer station interior modular kit |
| qmsf_details_vent_1.glb | Detail trim | 0.0 | Pioneer station interior modular kit |
| qmsf_details_vent_2.glb | Detail trim | 0.0 | Pioneer station interior modular kit |
| qmsf_details_vent_3.glb | Detail trim | 0.0 | Pioneer station interior modular kit |
| qmsf_details_vent_4.glb | Detail trim | 0.0 | Pioneer station interior modular kit |
| qmsf_details_vent_5.glb | Detail trim | 0.0 | Pioneer station interior modular kit |
| qmsf_details_x.glb | Detail trim | 0.0 | Pioneer station interior modular kit |
| qmsf_door_double.glb | Door | 0.0 | Pioneer station interior modular kit |
| qmsf_door_single.glb | Door | 0.0 | Pioneer station interior modular kit |
| qmsf_doordouble_wall_sidea.glb | Wall panel | 0.0 | Pioneer station interior modular kit |
| qmsf_doordouble_wall_sideb.glb | Wall panel | 0.0 | Pioneer station interior modular kit |
| qmsf_doordoublelong_wall_sidea.glb | Wall panel | 0.0 | Pioneer station interior modular kit |
| qmsf_doorsingle_wall_sidea.glb | Wall panel | 0.0 | Pioneer station interior modular kit |
| qmsf_doorsingle_wall_sideb.glb | Wall panel | 0.0 | Pioneer station interior modular kit |
| qmsf_doorsinglelong_wall_sidea.glb | Wall panel | 0.0 | Pioneer station interior modular kit |
| qmsf_floortile_basic.glb | Floor panel | 0.0 | Pioneer station interior modular kit |
| qmsf_floortile_basic2.glb | Floor panel | 0.0 | Pioneer station interior modular kit |
| qmsf_floortile_corner.glb | Floor panel | 0.0 | Pioneer station interior modular kit |
| qmsf_floortile_double_hallway.glb | Floor panel | 0.0 | Pioneer station interior modular kit |
| qmsf_floortile_empty.glb | Floor panel | 0.0 | Pioneer station interior modular kit |
| qmsf_floortile_innercorner.glb | Floor panel | 0.0 | Pioneer station interior modular kit |
| qmsf_floortile_side.glb | Floor panel | 0.0 | Pioneer station interior modular kit |
| qmsf_longwindow_wall_sidea.glb | Wall panel | 0.0 | Pioneer station interior modular kit |
| qmsf_longwindow_wall_sideb.glb | Wall panel | 0.0 | Pioneer station interior modular kit |
| qmsf_pipes.glb | Utility | 0.0 | Pioneer station interior modular kit |
| qmsf_props_base.glb | Modular part | 0.0 | Pioneer station interior modular kit |
| qmsf_props_capsule.glb | Modular part | 0.0 | Pioneer station interior modular kit |
| qmsf_props_chest.glb | Modular part | 0.0 | Pioneer station interior modular kit |
| qmsf_props_computer.glb | Modular part | 0.0 | Pioneer station interior modular kit |
| qmsf_props_computersmall.glb | Modular part | 0.0 | Pioneer station interior modular kit |
| qmsf_props_containerfull.glb | Modular part | 0.0 | Pioneer station interior modular kit |
| qmsf_props_crate.glb | Modular part | 0.0 | Pioneer station interior modular kit |
| qmsf_props_cratelong.glb | Modular part | 0.0 | Pioneer station interior modular kit |
| qmsf_props_laser.glb | Modular part | 0.0 | Pioneer station interior modular kit |
| qmsf_props_pod.glb | Modular part | 0.0 | Pioneer station interior modular kit |
| qmsf_props_shelf.glb | Furniture | 0.0 | Pioneer station interior modular kit |
| qmsf_props_shelf_tall.glb | Furniture | 0.0 | Pioneer station interior modular kit |
| qmsf_props_statue.glb | Modular part | 0.0 | Pioneer station interior modular kit |
| qmsf_props_teleporter_1.glb | Modular part | 0.0 | Pioneer station interior modular kit |
| qmsf_props_teleporter_2.glb | Modular part | 0.0 | Pioneer station interior modular kit |
| qmsf_props_vessel.glb | Modular part | 0.0 | Pioneer station interior modular kit |
| qmsf_props_vessel_short.glb | Modular part | 0.0 | Pioneer station interior modular kit |
| qmsf_props_vessel_tall.glb | Modular part | 0.0 | Pioneer station interior modular kit |
| qmsf_rooftile_corner_pipes.glb | Floor panel | 0.0 | Pioneer station interior modular kit |
| qmsf_rooftile_details.glb | Floor panel | 0.0 | Pioneer station interior modular kit |
| qmsf_rooftile_empty.glb | Floor panel | 0.0 | Pioneer station interior modular kit |
| qmsf_rooftile_innercorner_pipes.glb | Floor panel | 0.0 | Pioneer station interior modular kit |
| qmsf_rooftile_orangevent.glb | Floor panel | 0.0 | Pioneer station interior modular kit |
| qmsf_rooftile_pipes1.glb | Floor panel | 0.0 | Pioneer station interior modular kit |
| qmsf_rooftile_pipes2.glb | Floor panel | 0.0 | Pioneer station interior modular kit |
| qmsf_rooftile_plate.glb | Floor panel | 0.0 | Pioneer station interior modular kit |
| qmsf_rooftile_plate2.glb | Floor panel | 0.0 | Pioneer station interior modular kit |
| qmsf_rooftile_sides_pipes.glb | Floor panel | 0.0 | Pioneer station interior modular kit |
| qmsf_rooftile_smallvents.glb | Floor panel | 0.0 | Pioneer station interior modular kit |
| qmsf_rooftile_vents.glb | Floor panel | 0.0 | Pioneer station interior modular kit |
| qmsf_smallwindows_wall_sidea.glb | Wall panel | 0.0 | Pioneer station interior modular kit |
| qmsf_smallwindows_wall_sideb.glb | Wall panel | 0.0 | Pioneer station interior modular kit |
| qmsf_staircase.glb | Modular part | 0.0 | Pioneer station interior modular kit |
| qmsf_threewindows_wall_sidea.glb | Wall panel | 0.0 | Pioneer station interior modular kit |
| qmsf_threewindows_wall_sideb.glb | Wall panel | 0.0 | Pioneer station interior modular kit |
| qmsf_wall_1.glb | Wall panel | 0.0 | Pioneer station interior modular kit |
| qmsf_wall_2.glb | Wall panel | 0.0 | Pioneer station interior modular kit |
| qmsf_wall_3.glb | Wall panel | 0.0 | Pioneer station interior modular kit |
| qmsf_wall_4.glb | Wall panel | 0.0 | Pioneer station interior modular kit |
| qmsf_wall_5.glb | Wall panel | 0.0 | Pioneer station interior modular kit |
| qmsf_wall_empty.glb | Wall panel | 0.0 | Pioneer station interior modular kit |
| qmsf_window_wall_sidea.glb | Wall panel | 0.0 | Pioneer station interior modular kit |
| qmsf_window_wall_sideb.glb | Wall panel | 0.0 | Pioneer station interior modular kit |

### Sketchfab freebies (2)

| File | Category | Price | Size | Notes |
|---|---|---|---:|---|
| cockpit_free_seat.glb | Free starter cockpit | **FREE** | 15.6 | 30 PBR textures. Default cockpit for new pilots. |
| station_modular_interior.glb | Free starter station | **FREE** | 9.7 | 40 PBR textures. Default voidexa Hub interior. |

---

## Notes for ops

- Every paid model defaults to the **Grey** color variant. Re-run `add_textures.mjs` from `TEXTURE_FIX_GUIDE.md` to ship per-variant SKUs (Blue / Red / Cyan etc.) — same model, different texture, sold as a "skin variant" at $0.50–$1.
- Pricing here is the floor. Bundle pricing (e.g. "Pioneer Starter Pack: 1 ship + 1 cockpit + 1 trail = $8") usually beats à-la-carte by ~15%.
- Achievement-soulbound ships are listed at suggested asset references but the actual ship binding lives in `lib/achievements/definitions.ts` (`rewardId` field). Update both this catalog and the definitions when you commit.
- Legendary ships are tracked in `lib/race/tournament.ts` reward tier (when implemented). Distribution rule: 1 Legendary per major tournament, capped at 1 per pilot per season.
- Quaternius packs (qs / qsk / qmsf — 194 files) use `baseColorFactor` instead of PNG textures. They render correctly but won't appear in image-count audits.

## Generated

From `/tmp/glb_inventory.tsv` produced by walking `public/models/glb-ready/*.glb`. Re-run by sourcing the script blocks at the top of each section.
