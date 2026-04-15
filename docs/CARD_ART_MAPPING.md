# Card Art Mapping — Core Set ↔ glb-ready

> **Status:** Generated 2026-04-15 alongside `SHIP_CATALOG.md`.
> **Anchored to:** `lib/cards/starter_set.ts` (40-card Core Set) + `public/models/glb-ready/` (689 .glb assets).
> **Goal:** Tell the artist + 3D pipeline exactly which `.glb` source to render for each card's hero art.

## Conventions

- **Hero shot:** 3/4 view, cinematic lens, dark space backdrop with cyan rim-light. Match `RANK_COLORS` palette.
- **Resolution:** 1024×1024 webp at quality 82 → ~120 KB per card. 2x retina export at 2048×2048 for animation triggers.
- **VFX overlay:** Procedural — applied in the React layer over the static hero. Don't bake muzzle flash into the render.
- **Procedural fallback:** When a card has no 3D source, list "PROCEDURAL" in the Asset column. The art pipeline uses an HUD-style icon + voidexa palette gradient.
- **Reuse:** Multiple cards can share an asset with different VFX. Marked `+VFX:<name>` in the notes.

---

## Attack cards (13)

| Card id | Card name | Rarity | Energy | 3D asset | Notes |
|---|---|---|---:|---|---|
| `laser-pulse` | Laser Pulse | Common | 1 | `hirez_weapon_blaster.glb` | Side-on, glowing barrel +VFX:cyan_pulse |
| `plasma-bolt` | Plasma Bolt | Common | 2 | `hirez_weapon_blaster.glb` | Same blaster, +VFX:green_plasma_orb |
| `micro-missile` | Micro Missile | Common | 2 | `hirez_weapon_missile.glb` | Single missile, contrail +VFX:smoke_trail |
| `gatling-burst` | Gatling Burst | Common | 1 | `hirez_weapon_smallmachinegun.glb` | Spin-blur on barrels +VFX:tracer_burst |
| `thermal-lance` | Thermal Lance | Common | 2 | `hirez_weapon_blaster.glb` | Long exposure +VFX:red_beam |
| `railgun-shot` | Railgun Shot | Uncommon | 3 | `hirez_weapon_bigmachinegun.glb` | Heavy slug rail +VFX:white_streak |
| `acid-cloud` | Acid Cloud | Uncommon | 2 | `hirez_weapon_smalllauncher.glb` | Launcher firing +VFX:green_cloud |
| `homing-missile` | Homing Missile | Uncommon | 3 | `hirez_weapon_missile.glb` | Banking turn +VFX:lock_on_HUD |
| `torpedo-barrage` | Torpedo Barrage | Rare | 4 | `hirez_weapon_trilauncher.glb` | 3-tube launcher firing volley |
| `phase-beam` | Phase Beam | Rare | 3 | `hirez_weapon_bigmachinegun.glb` | +VFX:purple_beam_through_shield |
| `void-lance` | Void Lance | Epic | 5 | `hirez_weapon_biglauncher.glb` | Heavy launcher, dramatic light +VFX:dark_energy |
| `nova-barrage` | Nova Barrage | Epic | 5 | `hirez_weapon_trilauncher.glb` | Wide spread +VFX:explosion_chain |
| `stellar-annihilator` | Stellar Annihilator | Legendary | 7 | `hirez_ship09_full.glb` | Full ship hero shot — Legendary card uses Legendary ship as backdrop |

**Asset coverage:** 7 weapons + 1 Legendary ship = 8 distinct assets across 13 cards. Reuse via VFX overlay.

---

## Defense cards (9)

Defense effects are largely procedural — shield bubbles, repair animations, dodge maneuvers. Background uses cockpit interior renders so the player feels they're "inside" the defense.

| Card id | Card name | Rarity | Energy | 3D asset | Notes |
|---|---|---|---:|---|---|
| `energy-shield-small` | Energy Shield | Common | 1 | `hirez_cockpit01_interior.glb` | Cockpit POV +VFX:cyan_shield_dome |
| `emergency-weld` | Emergency Weld | Common | 2 | `hirez_cockpit02_interior.glb` | Repair drone view +VFX:weld_sparks |
| `decoy-flare` | Decoy Flare | Common | 1 | `hirez_thruster04.glb` | Single thruster firing flare |
| `evasive-roll` | Evasive Roll | Common | 1 | `qs_spitfire.glb` | Mid-roll silhouette |
| `magnetic-shield` | Magnetic Shield | Uncommon | 2 | `hirez_cockpit03_interior.glb` | Cockpit POV +VFX:magnetic_field_lines |
| `nano-repair` | Nano Repair | Uncommon | 3 | `hirez_equipments.glb` | Cockpit panel close-up +VFX:nanobot_swarm |
| `mirror-shield` | Mirror Shield | Rare | 4 | PROCEDURAL | Polished chrome dome over an `hirez_ship04_full.glb` silhouette |
| `phase-shift-defense` | Phase Shift | Rare | 3 | `qs_insurgent.glb` | Stealth ship phasing +VFX:translucency |
| `plasma-ablative-shield` | Plasma Ablative Shield | Epic | 4 | `hirez_cockpit05_interior.glb` | Inside-out plasma shell |

**Asset coverage:** 5 cockpit interiors + 2 ships + 1 thruster + 1 equipment = 9 distinct sources, 1 fully procedural.

---

## Tactical cards (8)

Tactical = no direct 3D source. Use HUD-style flat icons over a faint cockpit interior or galaxy-view backdrop. Listed for completeness so the art pipeline doesn't waste time hunting.

| Card id | Card name | Rarity | Energy | 3D asset | Notes |
|---|---|---|---:|---|---|
| `speed-boost` | Speed Boost | Common | 1 | `hirez_thruster01.glb` | Booster firing close-up |
| `jam-weapons` | Jam Weapons | Common | 2 | `hirez_screens.glb` | Cockpit screen with static |
| `scan-target` | Scan Target | Common | 1 | PROCEDURAL | Target reticle HUD |
| `damage-booster` | Damage Booster | Uncommon | 2 | `hirez_weapon_blaster.glb` | Barrel charging glow +VFX:overcharge |
| `blind-pulse` | Blind Pulse | Uncommon | 3 | PROCEDURAL | EM shockwave radial |
| `crit-amplifier` | Crit Amplifier | Rare | 3 | PROCEDURAL | HUD crosshair convergence |
| `create-nebula` | Create Nebula | Rare | 4 | `qsk_pickup_battery.glb` | Glowing canister +VFX:nebula_cloud |
| `mind-read` | Mind Read | Epic | 4 | PROCEDURAL | Neural-overlay HUD |

**Asset coverage:** 3 reused + 1 prop + 4 procedural = 8 cards.

---

## Deployment cards (6)

Deployment = drones + turrets. Use the smallest qs_ ships as drones and `hirez_weapon_smallmachinegun` as the turret base.

| Card id | Card name | Rarity | Energy | 3D asset | Notes |
|---|---|---|---:|---|---|
| `laser-drone` | Laser Drone | Common | 2 | `qs_dispatcher.glb` | Smallest fighter as drone |
| `point-defense` | Point Defense | Common | 2 | `hirez_weapon_smallmachinegun.glb` | Turret on a hardpoint |
| `missile-drone` | Missile Drone | Uncommon | 3 | `qs_striker.glb` | Drone-sized fighter +VFX:missile_loadout |
| `shield-drone` | Shield Drone | Uncommon | 2 | `qs_omen.glb` | Bubble drone +VFX:shield_pulse |
| `kamikaze-drone` | Kamikaze Drone | Rare | 4 | `qs_executioner.glb` | Aggressive small ship +VFX:explosion_imminent |
| `fortress-turret` | Fortress Turret | Epic | 5 | `hirez_weapon_biglauncher.glb` | Static heavy turret on a base plate |

**Asset coverage:** 4 qs_ ships + 2 weapons = 6 distinct sources for 6 cards.

---

## Alien cards (4)

Alien tech uses unique uscx ships from the GenericSpacehips set — they look "alien" because they break the USC/Hi-Rez naming convention and have non-standard silhouettes.

| Card id | Card name | Rarity | Energy | 3D asset | Notes |
|---|---|---|---:|---|---|
| `minor-phase-ripple` | Minor Phase Ripple | Common | 2 | PROCEDURAL | Spacetime ripple FX, no 3D source |
| `void-pulse` | Void Pulse | Uncommon | 3 | `uscx_pullora.glb` | Alien-looking unique ship |
| `time-reverse` | Time Reverse | Rare | 4 | `uscx_nova.glb` | Strange silhouette + clock VFX |
| `reality-warp` | Reality Warp | Legendary | 6 | `uscx_spidership.glb` | Most alien-looking ship; full-screen +VFX:spacetime_distortion |

**Asset coverage:** 3 uscx unique + 1 procedural = 4 cards. The 3 reserved uscx ships (`Nova`, `Pullora`, `Spidership`) shouldn't appear elsewhere — they're the alien-tech anchor.

---

## Summary

| Category | Cards | Distinct 3D assets used | Procedural fallbacks |
|---|---:|---:|---:|
| Attack | 13 | 8 | 0 |
| Defense | 9 | 8 | 1 |
| Tactical | 8 | 4 | 4 |
| Deployment | 6 | 6 | 0 |
| Alien | 4 | 3 | 1 |
| **Total** | **40** | **~25 unique** | **6** |

**Asset reuse strategy.** 7 Hi-Rez weapons cover most attack cards via VFX variation. 5 Hi-Rez cockpit interiors cover most defense cards via shader overlays. Quaternius small ships handle drones. The 3 alien uscx ships are reserved exclusively for Alien-category cards.

**Ships pulled into card art (do not also feature in shop without flagging):**
- `hirez_ship09_full.glb` — Stellar Annihilator card backdrop (also Legendary PvP prize — fine, complementary)
- `uscx_nova.glb`, `uscx_pullora.glb`, `uscx_spidership.glb` — locked to Alien cards
- `qs_dispatcher.glb`, `qs_striker.glb`, `qs_omen.glb`, `qs_executioner.glb`, `qs_spitfire.glb`, `qs_insurgent.glb` — drone/scout fleet (also free starter ships — fine, the shared identity reinforces "you're flying the drone")

---

## Open questions for art pipeline

- Procedural shaders for "shield dome", "magnetic field", "warp ripple", "nebula cloud" — same authored shader or per-card variants? Recommend a single ShaderGraph with parameterised colour/scale/intensity to keep cost down.
- Animated card art for Legendary tier: spec says "epic full-screen animations, camera zoom" (master plan Part 8 line 458). Suggest a 3-second 30 fps webm overlay on top of the static hero — generate per Legendary card from the same source asset with a camera dolly.
- Card-back art (uniform across all cards): use a galaxy-view scenic with the voidexa logo. No 3D asset needed; reuse the existing `GalaxyScene` render.
