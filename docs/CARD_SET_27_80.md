# VOIDEXA LAUNCH SET — Cards 27–80

> **54 new cards** extending the 26 baseline cards from `lib/game/cards/index.ts`.
> Designed against the PART 5 cost-power curve, using only the 8 approved statuses, and sourced from the 223-pattern library (High sci-fi fit only).

## TS Type Note

The current `GameCardRarity` type in `index.ts` is `'common' | 'uncommon' | 'rare' | 'legendary' | 'pioneer'`. PART 5 defines **Mythic** as a separate rarity (limited supply, 0.1% drop). Cards #80 and #73 use `mythic` — the TS enum should be extended to include it.

## Distribution Summary

| Rarity | Count | Target |
|---|---:|---|
| Common | 20 | ~20 |
| Uncommon | 15 | ~15 |
| Rare | 12 | ~12 |
| Legendary | 5 | ~5 |
| Mythic | 2 | ~2 |
| **Total** | **54** | |

| Type | Count | Target |
|---|---:|---|
| Weapon | 15 | ≥15 |
| Defense | 10 | ≥10 |
| Maneuver | 8 | ≥8 |
| Drone | 8 | ≥8 |
| AI | 6 | ≥6 |
| Consumable | 7 | ≥7 |
| **Total** | **54** | |

## Cost Curve Reference

| Cost | Expected Value |
|---|---|
| 0 | Utility only, no full-value damage |
| 1 | 5–7 dmg or 5 block or light setup |
| 2 | 9–12 dmg or 8–10 block or utility + minor effect |
| 3 | 14–18 dmg or 12–16 block or strong status |
| 4 | 18–24 dmg or major swing |
| 5 | 24–30 dmg or summon/board-control |
| 6 | 30–36 dmg or encounter-defining |
| 7 | Rare/legendary finisher only |

---

## WEAPONS (15)

| # | ID | Name | Rarity | Cost | Faction | Ship Restrict | Ability Text | Pattern Source | Render Match |
|---|---|---|---|---:|---|---|---|---|---|
| 27 | thermal_lance | Thermal Lance | common | 1 | core | null | Deal 5 damage. Apply Burn. | Damage over time | hirez_weapon_blaster.png |
| 28 | flak_burst | Flak Burst | common | 2 | neutral | null | Deal 4 damage to each of 3 random targets. | Split damage | hirez_weapon_smalllauncher.png |
| 29 | finisher_torpedo | Finisher Torpedo | common | 2 | core | null | Deal 9 damage. If target below 30% hull, deal 12 extra. | Execute | hirez_weapon_missile.png |
| 30 | breach_mark | Breach Mark | common | 1 | neutral | null | Deal 5 damage. Apply Expose. | Mark then detonate | hirez_weapon_smallmachinegun.png |
| 31 | salvo_barrage | Salvo Barrage | common | 2 | core | null | Deal 10 damage. Gain 1 Scrap. | Damage converts to Scrap | hirez_weapon_bigmachinegun.png |
| 32 | piercing_beam | Piercing Beam | uncommon | 3 | core | null | Deal 14 damage. Ignore 50% of target's Block. | True damage | hirez_weapon_blaster.png |
| 33 | arc_coil | Arc Coil | uncommon | 3 | void | null | Deal 6 damage, then 4, then 2 to successive targets. | Chain lightning | hirez_weapon_trilauncher.png |
| 34 | reactor_spike | Reactor Spike | uncommon | 2 | void | fighter | Take 5 self-damage. Deal 18 damage. | Self-damage for power | hirez_weapon_biglauncher.png |
| 35 | rail_line | Rail Line | uncommon | 3 | core | fighter | Deal 15 to primary target. Deal 7 to secondary target. | Piercing line | hirez_weapon_bigmachinegun.png |
| 36 | emp_nova | EMP Nova | rare | 4 | core | null | Deal 8 damage to all enemies. Apply Jam to all. | Area blast | hirez_weapon_trilauncher.png |
| 37 | shatter_beam | Shatter Beam | rare | 4 | void | null | Deal 18 damage. If target has Block, deal 8 bonus damage. | Shield breaker | hirez_ship05_full.png |
| 38 | void_lance | Void Lance | rare | 5 | void | null | Deal 28 damage. Apply Lock. | Heavy hit | hirez_ship06_full.png |
| 39 | charged_shot | Charged Shot | rare | 3 | core | null | Deal 14 damage. +4 damage for each turn held in hand. | Charge-up | hirez_weapon_biglauncher.png |
| 40 | stellar_annihilator | Stellar Annihilator | legendary | 7 | void | null | Deal 36 damage. If target has 2+ statuses, deal 12 extra. Exhaust. | Finisher scales with statuses | hirez_ship09_full.png |
| 41 | void_echo | Void Echo | mythic | 6 | void | null | Deal damage equal to total damage dealt this combat. Once per game. Exhaust. | PART 5 mythic example | hirez_ship09_full.png |

## DEFENSE (10)

| # | ID | Name | Rarity | Cost | Faction | Ship Restrict | Ability Text | Pattern Source | Render Match |
|---|---|---|---|---:|---|---|---|---|---|
| 42 | ablative_plating | Ablative Plating | common | 1 | neutral | null | Gain 5 Block. If hit this turn, gain Shielded. | Damage reduction + barrier | hirez_cockpit05.png |
| 43 | firewall_bubble | Firewall Bubble | common | 1 | core | null | Gain Shielded. Draw 1. | Barrier vs status | hirez_cockpit01_interior.png |
| 44 | drain_beam | Drain Beam | common | 2 | void | null | Steal 8 Block from enemy. | Shield Drain | hirez_cockpit03_interior.png |
| 45 | shield_lattice | Shield Lattice | uncommon | 3 | core | hauler | Gain 12 Block. Retain 50% of remaining Block next turn. | Persistent shield | hirez_cockpit04.png |
| 46 | bulkhead_lock | Bulkhead Lock | uncommon | 2 | core | null | Gain 12 Block. Lose 1 energy next turn. | Emergency button | hirez_cockpit05_interior.png |
| 47 | auto_repair_module | Auto-Repair Module | uncommon | 2 | core | null | Heal 2 hull each turn for 3 turns. | Regeneration | hirez_cockpit02_interior.png |
| 48 | phase_shell | Phase Shell | rare | 4 | void | explorer | Ignore the next attack completely. Draw 1. | Invulnerability | hirez_ship08_full.png |
| 49 | leech_shield | Leech Shield | rare | 3 | void | null | This turn, gain Block equal to half the damage your weapons deal. | Block from damage dealt | hirez_ship04_full.png |
| 50 | persistent_barrier | Persistent Barrier | rare | 4 | core | hauler | Gain 16 Block. Retain up to 10 Block at end of turn. | Block retained | hirez_ship12_full.png |
| 51 | crash_override | Crash Override | legendary | 5 | void | null | If you would take lethal damage this turn, survive with 1 hull instead. Gain 10 Block. Exhaust. | Emergency hull | hirez_ship16_full.png |

## MANEUVER (8)

| # | ID | Name | Rarity | Cost | Faction | Ship Restrict | Ability Text | Pattern Source | Render Match |
|---|---|---|---|---:|---|---|---|---|---|
| 52 | afterburn | Afterburn | common | 1 | core | null | Evade next attack. Gain 1 energy next turn. | Afterburn | hirez_ship14_full.png |
| 53 | barrel_roll | Barrel Roll | common | 1 | core | fighter | Reduce damage from next 2 hits by 3 each. | Barrel roll | usc_astroeagle01.png |
| 54 | vector_feint | Vector Feint | common | 1 | neutral | null | If attacked this turn, gain 6 Block and draw 1. | Vector feint | hirez_ship07_full.png |
| 55 | drift_turn | Drift Turn | uncommon | 2 | neutral | null | Next weapon hits twice at −3 damage per hit. | Drift turn | usc_hyperfalcon01.png |
| 56 | tractor_pulse | Tractor Pulse | uncommon | 2 | void | null | Apply Lock. Deal 4 damage. | Pull/Push | uscx_pullora.png |
| 57 | anchor_protocol | Anchor Protocol | uncommon | 2 | core | hauler | Gain 10 Block. Cannot Evade this turn. | Anchor | usc_forcebadger01.png |
| 58 | cloak_burst | Cloak Burst | rare | 3 | void | explorer | Become untargetable until your next turn. Discard 1. | Cloak burst | usc_lightfox01.png |
| 59 | phantom_strike | Phantom Strike | legendary | 5 | void | fighter | Become untargetable. Next weapon deals double damage. | Untargetable + buff | hirez_ship16_full.png |

## DRONE (8)

| # | ID | Name | Rarity | Cost | Faction | Ship Restrict | Ability Text | Pattern Source | Render Match |
|---|---|---|---|---:|---|---|---|---|---|
| 60 | decoy_drone | Decoy Drone | common | 1 | core | null | Deploy drone: Absorbs next 5 damage. | Decoy drone | hirez_ship10_full.png |
| 61 | oracle_drone | Oracle Drone | common | 1 | neutral | null | Deploy drone: Reveals enemy intent each turn for 2 turns. | Scout drone reveals | qs_dispatcher.png |
| 62 | snare_drone | Snare Drone | common | 2 | core | null | Deploy drone: Applies Lock each turn for 2 turns. | Snare drone | hirez_ship03_full.png |
| 63 | salvage_drone | Salvage Drone | common | 2 | neutral | null | Deploy drone: Generates 1 Scrap each turn for 3 turns. | Salvage drone | usc_craizanstar01.png |
| 64 | emp_drone | EMP Drone | uncommon | 3 | void | null | Deploy drone: Applies Jam every other turn for 4 turns. | EMP drone | hirez_ship02_full.png |
| 65 | escort_wing | Escort Wing | rare | 3 | neutral | null | Deploy 2 micro-fighters: each deals 2 damage per turn for 3 turns. | Escort wing | usc_striderox01.png |
| 66 | kamikaze_drone | Kamikaze Drone | rare | 3 | void | null | Deploy drone: 3 damage per turn for 2 turns. On death, deal 10 damage. | Kamikaze drone | hirez_ship11_full.png |
| 67 | carrier_deploy | Carrier Deploy | rare | 4 | core | null | Deploy Scout Drone and Repair Drone. Each lasts 3 turns. | Drone bay engine | usc_striderox01.png |

## AI (6)

| # | ID | Name | Rarity | Cost | Faction | Ship Restrict | Ability Text | Pattern Source | Render Match |
|---|---|---|---|---:|---|---|---|---|---|
| 68 | efficiency_protocol | Efficiency Protocol | common | 1 | core | null | Next 2 cards cost 1 less this turn. | Cost reduction | hirez_cockpit02.png |
| 69 | system_query | System Query | uncommon | 2 | neutral | null | Search your deck for a Drone card. Add it to your hand. | Tutor/Search | hirez_cockpit04_interior.png |
| 70 | predator_lock | Predator Lock | rare | 4 | void | null | Apply Expose, Lock, and Drone Mark to target. | Multi-status + mark | uscx_scorpionship.png |
| 71 | fleet_commander | Fleet Commander | legendary | 5 | core | null | Summon 2 temporary Gun Drones. Each deals 4 damage per turn for 2 turns. | Summon attacker (x2) | hirez_ship13_full.png |
| 72 | leviathan_presence | Leviathan Presence | legendary | 5 | pioneer | null | All allies gain 2 Block each turn for 3 turns. Draw 2. | Aura/formation | usc_voidwhale01.png |
| 73 | quantum_convergence | Quantum Convergence | mythic | 7 | void | null | Duplicate every card you play this turn. Once per game. Exhaust. | PART 5 mythic example + Copy | hirez_ship01_full.png |

## CONSUMABLE (7)

| # | ID | Name | Rarity | Cost | Faction | Ship Restrict | Ability Text | Pattern Source | Render Match |
|---|---|---|---|---:|---|---|---|---|---|
| 74 | battery_swap | Battery Swap | common | 0 | neutral | null | Gain 2 energy. Exhaust. | Battery swap | uscx_galacticokamoto1.png |
| 75 | nanite_pack | Nanite Pack | common | 1 | core | null | Heal 5. Remove 1 status. Exhaust. | Nanite pack | hirez_cockpit02_interior.png |
| 76 | smoke_chaff | Smoke Chaff | common | 1 | neutral | null | Gain Evade. Remove Lock from self. Exhaust. | Smoke chaff | usc_astroeagle01.png |
| 77 | spare_drone_kit | Spare Drone Kit | common | 1 | neutral | null | Summon a 1-turn Gun Drone that deals 4 damage. Exhaust. | Spare drone kit | qs_dispatcher.png |
| 78 | field_patch | Field Patch | uncommon | 1 | core | null | Heal 6. Take 2 damage next turn (Repair Debt). Exhaust. | Emergency repair kit | hirez_cockpit02_interior.png |
| 79 | hard_reboot | Hard Reboot | uncommon | 2 | core | null | Remove all statuses from self. Skip next draw phase. Exhaust. | Hard reboot | hirez_cockpit03.png |
| 80 | thermal_vent | Thermal Vent | uncommon | 1 | core | null | Remove Overcharge from self. Deal 3 damage to all enemies. Exhaust. | Thermal vent | hirez_cockpit01.png |

---

## Faction Distribution

| Faction | Count |
|---|---:|
| core | 27 |
| void | 17 |
| neutral | 9 |
| pioneer | 1 |
| **Total** | **54** |

## Ship Class Restriction Distribution

| Restriction | Count |
|---|---:|
| null (any ship) | 46 |
| fighter | 4 |
| hauler | 4 |
| explorer | 2 |
| salvager | 0 |
| **Total** | **54** |

## Approved Statuses Used

All cards use only the 8 approved statuses: **Expose**, **Burn**, **Jam**, **Lock**, **Shielded**, **Overcharge**, **Drone Mark**, **Scrap**. No new statuses were introduced.
