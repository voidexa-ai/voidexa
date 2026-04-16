# Card Render Audit — Renders ↔ PART 5 Baseline Abilities

> **Generated:** 2026-04-16
> **Source renders:** `public/images/renders/` (59 PNGs, 512×512, 9 subfolders)
> **Ability reference:** `docs/VOIDEXA_GAMING_COMBINED_V2.md` PART 5 — 26 baseline card abilities across 6 types (Weapon, Defense, Maneuver, Drone, AI, Consumable)
> **Existing mapping:** `docs/CARD_ART_MAPPING.md` (40-card Core Set → 25 distinct 3D assets + 6 procedural)

---

## Baseline abilities from PART 5 (quick reference)

| # | Ability | Type | Cost |
|---|---|---|---:|
| W1 | Pulse Tap | Weapon | 1 |
| W2 | Rail Spike | Weapon | 2 |
| W3 | Plasma Arc | Weapon | 3 |
| W4 | Breach Cannon | Weapon | 4 |
| W5 | Nova Charge | Weapon | 5 |
| W6 | Salvage Harpoon | Weapon | 2 |
| D1 | Quick Shield | Defense | 1 |
| D2 | Deflector Net | Defense | 2 |
| D3 | Reactive Plating | Defense | 3 |
| D4 | Emergency Bulkhead | Defense | 0 |
| M1 | Strafe Burn | Maneuver | 1 |
| M2 | Hard Flip | Maneuver | 2 |
| M3 | Vector Cut | Maneuver | 2 |
| M4 | Ghost Drift | Maneuver | 3 |
| DR1 | Scout Drone | Drone | 1 |
| DR2 | Gun Drone | Drone | 3 |
| DR3 | Repair Drone | Drone | 3 |
| DR4 | Intercept Drone | Drone | 2 |
| AI1 | Tactical Predict | AI | 1 |
| AI2 | Hunter Logic | AI | 2 |
| AI3 | Overclock Core | AI | 3 |
| AI4 | Battlefield Read | AI | 4 |
| C1 | Repair Foam | Consumable | 1 |
| C2 | Coolant Purge | Consumable | 0 |
| C3 | Charge Cell | Consumable | 2 |
| C4 | Scrap Injector | Consumable | 1 |

---

## Audit table — Weapons renders (7)

All weapon renders carry cyan rim light on dark space background. These are the primary card art sources for Attack-type cards.

| # | Filename | Art description | Suggested ability match | New ability needed? |
|---|---|---|---|---|
| 1 | `weapons/hirez_weapon_blaster.png` | Slim single-barrel energy blaster with cylindrical segments and cyan accent glow; compact sidearm-class weapon | **W1 Pulse Tap** — light rapid-fire weapon matches the low-cost "deal 6 damage" feel. Also reusable for Plasma Bolt / Thermal Lance via VFX overlay | No |
| 2 | `weapons/hirez_weapon_missile.png` | Bulbous-nosed torpedo/missile with red banding and metallic body; clearly a guided munition | **W6 Salvage Harpoon** — projectile shape suits a targeted single-hit weapon. Also maps to Micro Missile / Homing Missile cards | No |
| 3 | `weapons/hirez_weapon_bigmachinegun.png` | Massive multi-barrel rotary cannon (gatling-style) with perforated heat shroud and heavy cylindrical housing; fills frame with intimidating bulk | **W2 Rail Spike** — heavy slug weapon with Lock effect. Also maps to Railgun Shot / Phase Beam cards | No |
| 4 | `weapons/hirez_weapon_biglauncher.png` | Rectangular heavy launcher platform with 6-tube cluster warhead array and cyan accent strip; industrial military aesthetic | **W4 Breach Cannon** — heavy ordnance that ignores Block. Also maps to Void Lance (Epic) and Fortress Turret (Deployment) | No |
| 5 | `weapons/hirez_weapon_smalllauncher.png` | Single-tube cylindrical launcher with open muzzle; compact grenade/mortar launcher feel with cyan rim lighting | **W3 Plasma Arc** — area damage dealer (14 to target, 4 adjacent). Maps to Acid Cloud card | No |
| 6 | `weapons/hirez_weapon_smallmachinegun.png` | Twin parallel barrels on a mounting bracket; rapid-fire point-defense weapon with slim profile | **DR2 Gun Drone** (turret variant) — sustained fire platform. Maps to Gatling Burst and Point Defense cards | No |
| 7 | `weapons/hirez_weapon_trilauncher.png` | Compact triple-tube rocket pod with 3 visible launch ports; boxy chassis with cyan highlights | **W5 Nova Charge** — multi-warhead volley suits the "consume Overcharge, deal escalating damage" fantasy. Maps to Torpedo Barrage / Nova Barrage cards | No |

---

## Audit table — Legendary ships (5)

All legendary ships carry golden rim light. Massive capital-class vessels with PBR textures, gold accent paneling. These are primarily shop/tournament reward art, not direct card art — except `ship09` which backs the Stellar Annihilator legendary card.

| # | Filename | Art description | Suggested ability match | New ability needed? |
|---|---|---|---|---|
| 8 | `legendary/hirez_ship01_full.png` | Wide-wingspan capital ship with gold-paneled hull plates, twin engine nacelles, exposed superstructure framework; aggressive carrier silhouette | **AI4 Battlefield Read** — flagship command vessel evokes tactical overview / "duplicate next card" power fantasy | No |
| 9 | `legendary/hirez_ship06_full.png` | Heavy dreadnought with gold armor banding, central bridge module, angular wing pylons; warship posture | **W4 Breach Cannon** — raw firepower dreadnought silhouette matches "ignore Block" devastating attack | No |
| 10 | `legendary/hirez_ship09_full.png` | Largest ship in the fleet; blocky capital hull with gold plating, heavy engine cluster, bridge tower forward; intimidating mass | **W5 Nova Charge** — already mapped to Stellar Annihilator (legendary finisher card, cost 7). Confirmed match | No |
| 11 | `legendary/hirez_ship13_full.png` | Compact gold-accented warship with integrated weapon hardpoints, layered hull plating | **AI3 Overclock Core** — compact but powerful; "gain 2 energy, take 4 self-damage" risk/reward matches aggressive design | Yes — could also justify **"Fleet Commander"** (new AI type: summon 2 temporary Gun Drones) |
| 12 | `legendary/hirez_ship16_full.png` | Sleek gold-trimmed destroyer with swept-back wings, minimal profile; speed-oriented legendary | **M4 Ghost Drift** — stealth/speed profile matches "untargetable until next action" | Yes — could justify **"Phantom Strike"** (new Maneuver: become untargetable, next weapon deals double, cost 5-6) |

---

## Audit table — Epic ships (10)

Premium tier ships with dark PBR textures, no gold rim. Complex detailed geometry.

| # | Filename | Art description | Suggested ability match | New ability needed? |
|---|---|---|---|---|
| 13 | `epic/hirez_ship02_full.png` | Angular assault frigate with twin lateral engines, aggressive forward-pointing hull | **W3 Plasma Arc** — attack ship silhouette suits AoE damage dealer | No |
| 14 | `epic/hirez_ship03_full.png` | Dark heavy cruiser with bulbous twin engine pods on articulated pylons, central bridge; sci-fi gunship profile | **DR2 Gun Drone** — multi-hardpoint platform evokes sustained-fire drone carrier | No |
| 15 | `epic/hirez_ship04_full.png` | Compact corvette with hexagonal hull plating, forward-swept wings | **D2 Deflector Net** — armored hull suggests Block + Shielded. Already used as Mirror Shield backdrop in CARD_ART_MAPPING | No |
| 16 | `epic/hirez_ship05_full.png` | Elongated battlecruiser with exposed spine framework, multiple weapon mounts visible | **W4 Breach Cannon** — heavy weapons platform matches "ignore half Block" | No |
| 17 | `epic/hirez_ship07_full.png` | Mid-size patrol ship with balanced wing-engine layout, versatile profile | **M3 Vector Cut** — maneuverable attack ship matches "move first, next attack +4" | No |
| 18 | `epic/hirez_ship08_full.png` | Angular stealth-profile ship with flat faceted hull, radar-deflecting geometry | **M4 Ghost Drift** — stealth design matches "untargetable until next action" | No |
| 19 | `epic/hirez_ship10_full.png` | Compact escort ship with twin lateral fins, small but detailed | **DR4 Intercept Drone** — escort profile suits "absorb next 8 damage" | No |
| 20 | `epic/hirez_ship11_full.png` | Small aggressive fighter with forward-swept weapon pods | **W1 Pulse Tap** — nimble striker fits quick-fire weapon card | No |
| 21 | `epic/hirez_ship12_full.png` | Large detailed cruiser with layered hull sections, prominent engine array | **D3 Reactive Plating** — heavy armor visual matches "gain 14 Block, deal 4 back" | No |
| 22 | `epic/hirez_ship14_full.png` | Slim interceptor-class with swept delta wings, minimal cross-section | **M1 Strafe Burn** — fast interceptor matches "evade next attack, next weapon applies Expose" | No |

---

## Audit table — Soulbound ships (5)

Achievement-locked rewards. Cannot be purchased. Mixed art packs (USC, Quaternius, USCX).

| # | Filename | Art description | Suggested ability match | New ability needed? |
|---|---|---|---|---|
| 23 | `soulbound/usc_voidwhale01.png` | Very long dark capital ship with lattice superstructure, antenna arrays, submarine-like elongated hull; barely visible against dark background | **AI4 Battlefield Read** — massive command vessel fits "duplicate next 2-cost card" strategic ability. Achievement: debater (10× Quantum) | Yes — could justify **"Leviathan Presence"** (new AI type: all allies gain +2 Block for 3 turns, cost 5) |
| 24 | `soulbound/usc_genericspaceship04.png` | Dark angular frigate with circular engine nacelle, modular hull segments, industrial cargo ship feel | **C4 Scrap Injector** — trader/cargo vessel matches salvage/resource theme. Achievement: trader (>10% profit) | No |
| 25 | `soulbound/usc_spaceexcalibur01.png` | Dark heavy warship with angular forward blade-like prow, multiple weapon hardpoints, aggressive military silhouette | **W4 Breach Cannon** — military warship with blade prow evokes devastating firepower. Achievement: pioneer (claim planet) | No |
| 26 | `soulbound/qs_dispatcher.png` | Small golden-orange scout with swept delta wings, antenna mast, cockpit canopy visible; agile recon craft | **DR1 Scout Drone** — small recon ship perfectly matches "reveal top card; may discard." Achievement: explorer (visit all planets) | No |
| 27 | `soulbound/uscx_nova.png` | Dark smooth teardrop-shaped pod with minimal detail; mysterious featureless alien vessel | **M4 Ghost Drift** — alien mystery ship matches "untargetable" stealth. Achievement: secret (easter egg). Also Alien card Time Reverse | No |

---

## Audit table — Rare ships (8)

USCX expansion uniques with distinctive silhouettes. Some reserved for Alien card art.

| # | Filename | Art description | Suggested ability match | New ability needed? |
|---|---|---|---|---|
| 28 | `rare/uscx_galacticokamoto1.png` | Small compact ship with smooth curves, muted tones; modest civilian-class vessel | **C3 Charge Cell** — utility ship matches "gain 2 energy next turn" support role | No |
| 29 | `rare/uscx_starforce01.png` | Mid-size military ship with balanced proportions, visible weapon mounts, conventional fighter layout | **W2 Rail Spike** — military fighter matches "deal 10 damage, apply Lock" | No |
| 30 | `rare/uscx_arrowship.png` | Sleek dark blue arrow-shaped ship with swept blade wings, sharp forward profile, cyan accent glow; fast interceptor | **M1 Strafe Burn** — speed-focused arrow silhouette matches "evade next attack, next weapon applies Expose" | No |
| 31 | `rare/uscx_nova.png` | Dark smooth featureless pod, almost organic; minimal surface detail, alien aesthetic | **RESERVED for Alien card: Time Reverse** (Rare, cost 4). Matches existing CARD_ART_MAPPING | No |
| 32 | `rare/uscx_pullora.png` | Dark flat organic-looking craft, low profile, teal-green accents; biological/alien silhouette | **RESERVED for Alien card: Void Pulse** (Uncommon, cost 3). Matches existing CARD_ART_MAPPING | No |
| 33 | `rare/uscx_scorpionship.png` | Organic scorpion-shaped ship with curved tail pincers, hexagonal cockpit dome, segmented body; alien bio-mech | **AI2 Hunter Logic** — predatory bio-mech shape matches "apply Drone Mark and Expose" targeting lock | Yes — could justify **"Predator Lock"** (new AI type: apply Expose + Lock + Drone Mark, cost 4) |
| 34 | `rare/uscx_spidership.png` | Organic whale/ray-shaped ship with scaled skin texture, long curved body, biological appearance; largest alien vessel | **RESERVED for Alien card: Reality Warp** (Legendary, cost 6). Matches existing CARD_ART_MAPPING | No |
| 35 | `rare/uscx_starship.png` | Classic starship silhouette with conventional hull shape, balanced proportions | **D2 Deflector Net** — balanced ship matches "gain 9 Block and Shielded" | No |

---

## Audit table — Uncommon ships (13)

One-per-class hero renders from USC. PBR textures, dark tones.

| # | Filename | Art description | Suggested ability match | New ability needed? |
|---|---|---|---|---|
| 36 | `uncommon/usc_astroeagle01.png` | Compact fighter with forward-swept wings, twin engines, agile silhouette | **M1 Strafe Burn** — agile fighter matches evasion + offense combo | No |
| 37 | `uncommon/usc_cosmicshark01.png` | Assault-class with aggressive pointed nose, lateral weapon pods, predatory profile | **W2 Rail Spike** — assault ship matches heavy single-target damage + Lock | No |
| 38 | `uncommon/usc_voidwhale01.png` | Very long capital ship with lattice frame, dark hull (same model as soulbound version); submarine in space | **AI4 Battlefield Read** — command capital matches strategic card duplication | No |
| 39 | `uncommon/usc_forcebadger01.png` | Stocky cruiser with wide-set engines, armored hull plates, bulky defensive posture | **D3 Reactive Plating** — armored cruiser matches "gain 14 Block, deal 4 back on hit" | No |
| 40 | `uncommon/usc_galaxyraptor01.png` | Heavy fighter with downswept wings, visible weapon hardpoints, attack-oriented | **W3 Plasma Arc** — heavy fighter with multiple hardpoints matches AoE damage | No |
| 41 | `uncommon/usc_hyperfalcon01.png` | Fast interceptor with narrow fuselage, swept-back wings, speed lines in silhouette | **M3 Vector Cut** — fast interceptor matches "move first next turn, next attack +4" | No |
| 42 | `uncommon/usc_lightfox01.png` | Very dark/stealthy small craft with minimal profile, nearly invisible against space; black-on-black | **M4 Ghost Drift** — near-invisible stealth craft perfectly matches "untargetable until next action" | No |
| 43 | `uncommon/usc_meteormantis01.png` | Gunship with wide lateral weapon arrays, extended barrel clusters, heavy ordnance posture | **W5 Nova Charge** — heavy gunship matches "consume Overcharge, escalating damage" | No |
| 44 | `uncommon/usc_nightaye01.png` | Dark stealth ship with multiple engine nacelles, elongated spine, guns visible; covert ops warship | **AI2 Hunter Logic** — stealth targeting ship matches "apply Drone Mark and Expose" | No |
| 45 | `uncommon/usc_protonlegacy01.png` | Large capital ship with prominent engine block, industrial hull design | **D2 Deflector Net** — capital ship bulk suggests shields and defense | No |
| 46 | `uncommon/usc_striderox01.png` | Capital-class with wide hull, multiple deck levels visible, carrier/transport silhouette | **DR3 Repair Drone** — carrier/support ship matches "heal 3 hull for 3 turns" support role | Yes — could justify **"Carrier Deploy"** (new Drone type: summon 1 Scout Drone + 1 Repair Drone, cost 4) |
| 47 | `uncommon/usc_craizanstar01.png` | Frigate with balanced proportions, mid-range combat vessel | **W6 Salvage Harpoon** — versatile frigate matches "deal 8, gain Scrap on kill" | No |
| 48 | `uncommon/usc_galacticleopard1.png` | Mid-size ship with distinctive asymmetric profile, lean predatory build | **M2 Hard Flip** — agile mid-size matches "gain 5 Block, draw 2, discard 1" versatility | No |

---

## Audit table — Starter ship (1)

Free ship for all new pilots.

| # | Filename | Art description | Suggested ability match | New ability needed? |
|---|---|---|---|---|
| 49 | `starter/qs_bob.png` | Small balanced cruiser with white/grey hull, gold wing tips, visible cockpit canopy; Quaternius "Bob" low-poly style; friendly approachable design | **D4 Emergency Bulkhead** — starter ship matches the 0-cost emergency defense; "gain 5 Block, only below 50% hull" fits a new pilot's desperation move | No |

---

## Audit table — Cockpits exterior (5)

Shop cosmetic items (cockpit themes). Not direct card art but could serve as Defense card backdrops.

| # | Filename | Art description | Suggested ability match | New ability needed? |
|---|---|---|---|---|
| 50 | `cockpits/hirez_cockpit01.png` | Large domed glass canopy with dark metal frame, gold accent trim; bulky armored cockpit pod | **D1 Quick Shield** — armored cockpit evokes personal protection / "gain 6 Block" | No |
| 51 | `cockpits/hirez_cockpit02.png` | Angular cockpit with flat faceted glass panels, military industrial | **AI1 Tactical Predict** — tactical cockpit matches "draw 2, next defense costs 1 less" | No |
| 52 | `cockpits/hirez_cockpit03.png` | Compact streamlined cockpit, smooth curves, minimal frame | **M2 Hard Flip** — nimble cockpit matches maneuverability + card draw | No |
| 53 | `cockpits/hirez_cockpit04.png` | Wide-view cockpit with large viewport, sensor arrays visible | **AI1 Tactical Predict** — panoramic sensor cockpit fits tactical awareness | No |
| 54 | `cockpits/hirez_cockpit05.png` | Heavy reinforced cockpit with layered armor plating around viewport | **D3 Reactive Plating** — armored cockpit matches "gain Block, deal damage back" | No |

---

## Audit table — Cockpit interiors (5)

FPV cockpit themes. Already mapped as Defense card backdrops in CARD_ART_MAPPING.md.

| # | Filename | Art description | Suggested ability match | New ability needed? |
|---|---|---|---|---|
| 55 | `cockpit-interiors/hirez_cockpit01_interior.png` | Dark industrial cockpit interior with armored panels, instrument clusters, green-tinted displays | **D1 Quick Shield** — mapped to Energy Shield card (cockpit POV + cyan shield dome VFX) | No |
| 56 | `cockpit-interiors/hirez_cockpit02_interior.png` | Interior with repair drone viewport, dark metal panels, maintenance bay feel | **C1 Repair Foam** — repair bay interior matches "heal 7 hull" consumable. Mapped to Emergency Weld card | No |
| 57 | `cockpit-interiors/hirez_cockpit03_interior.png` | Clean interior with wide viewport, minimal instrumentation | **D2 Deflector Net** — mapped to Magnetic Shield card (cockpit POV + magnetic field VFX) | No |
| 58 | `cockpit-interiors/hirez_cockpit04_interior.png` | Complex cockpit with layered instrument panels, multiple displays | **AI1 Tactical Predict** — info-dense cockpit matches tactical awareness / "draw 2" | No |
| 59 | `cockpit-interiors/hirez_cockpit05_interior.png` | Heavy reinforced interior, armored viewport frame, dramatic lighting | **D3 Reactive Plating** — mapped to Plasma Ablative Shield card (inside-out plasma shell VFX) | No |

---

## Summary

| Category | Renders | Direct ability matches | New abilities suggested |
|---|---:|---:|---:|
| Weapons | 7 | 7 (all 6 Weapon abilities + Gun Drone turret) | 0 |
| Legendary ships | 5 | 5 | 2 (Fleet Commander, Phantom Strike) |
| Epic ships | 10 | 10 | 0 |
| Soulbound ships | 5 | 5 | 1 (Leviathan Presence) |
| Rare ships | 8 | 8 (3 reserved for Alien cards) | 1 (Predator Lock) |
| Uncommon ships | 13 | 13 | 1 (Carrier Deploy) |
| Starter ship | 1 | 1 | 0 |
| Cockpits exterior | 5 | 5 | 0 |
| Cockpit interiors | 5 | 5 | 0 |
| **Total** | **59** | **59** | **5 suggested** |

### Key findings

1. **Full coverage.** Every one of the 59 renders maps to at least one of the 26 baseline abilities from PART 5. No renders are orphaned.
2. **Weapon renders are the strongest card art.** The 7 weapon renders directly serve as hero art for 13 of the 40 Core Set attack cards (via VFX overlay reuse). These are the most card-ready assets.
3. **Cockpit interiors = Defense card backdrops.** Already mapped in CARD_ART_MAPPING.md. Confirmed fit.
4. **Ship renders are ship art, not card art.** Most ship renders serve the shop and achievement system, not the card system directly. Only `hirez_ship09_full` (Stellar Annihilator) and the 3 alien uscx ships are directly used as card art. The rest are available as future card expansion backdrops.
5. **5 new abilities suggested** where a render's visual identity doesn't perfectly fit any existing ability and could inspire expansion cards:
   - **Fleet Commander** (AI, cost 5) — summon 2 temporary Gun Drones. Fits `legendary/hirez_ship13_full.png`.
   - **Phantom Strike** (Maneuver, cost 5-6) — untargetable + next weapon deals double. Fits `legendary/hirez_ship16_full.png`.
   - **Leviathan Presence** (AI, cost 5) — all allies gain +2 Block for 3 turns. Fits `soulbound/usc_voidwhale01.png`.
   - **Predator Lock** (AI, cost 4) — apply Expose + Lock + Drone Mark. Fits `rare/uscx_scorpionship.png`.
   - **Carrier Deploy** (Drone, cost 4) — summon Scout Drone + Repair Drone. Fits `uncommon/usc_striderox01.png`.

### Gaps for future card art

The following PART 5 abilities have **no dedicated render** and rely on procedural/VFX art:
- **Consumables** (Repair Foam, Coolant Purge, Charge Cell, Scrap Injector) — no item/pickup renders exist. Consider rendering `qsk_pickup_battery.glb` and similar props.
- **Maneuver cards** — no dedicated maneuver renders; ship silhouettes are repurposed. Consider rendering ships mid-roll or with motion blur for dedicated maneuver card art.
- **AI cards** — no dedicated AI/tech renders. Consider rendering cockpit HUD close-ups or `hirez_screens.glb` for Tactical Predict / Hunter Logic / Overclock Core.
