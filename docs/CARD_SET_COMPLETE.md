# VOIDEXA COMPLETE CARD SET — Cards 81–257

> **177 cards** in this file (142 original + 35 keyword expansion).
> Cards 1–26: baseline (index.ts) | Cards 27–80: expansion set 1 | Cards 81–222: original full library | Cards 223–257: keyword expansion.
> All cards follow PART 5 cost-power curve. 15 new keywords added (see GPT_CARD_KEYWORD_RETROFIT.md).
> Grand total across all sets: **257 cards**.

## Distribution

| Rarity | Count | % |
|---|---:|---:|
| common | 65 | 46% |
| uncommon | 35 | 25% |
| rare | 22 | 15% |
| legendary | 14 | 10% |
| mythic | 6 | 4% |
| **Total** | **142** | |

| Type | Count |
|---|---:|
| weapon | 26 |
| defense | 16 |
| maneuver | 13 |
| drone | 12 |
| ai | 44 |
| consumable | 31 |
| **Total** | **142** |

| Faction | Count |
|---|---:|
| core | 61 |
| void | 37 |
| neutral | 43 |
| pioneer | 1 |

---

## WEAPON (26 cards)

| # | ID | Name | Rarity | Cost | Faction | Ship | Ability Text |
|---:|---|---|---|---:|---|---|---|
| 81 | `heavy_torpedo` | **Heavy Torpedo** | uncommon | 3 | core | — | Consume 1 Ammo. Deal 22 damage. |
| 82 | `unstable_warhead` | **Unstable Warhead** | rare | 4 | void | — | Deal 28 damage. 20% chance to take 6 self-damage. |
| 83 | `flak_warhead` | **Flak Warhead** | common | 2 | core | — | Deal 6 damage. +10 bonus vs drones. |
| 84 | `guided_missile` | **Guided Missile** | uncommon | 2 | core | — | Consume 1 Ammo. Deal 12 damage. Apply Lock. |
| 85 | `thermal_breach` | **Thermal Breach** | common | 2 | core | — | Deal 4 damage. Apply Burn (4 damage for 2 turns). |
| 86 | `emp_spike` | **EMP Spike** | legendary | 4 | void | — | Deal 10 damage. Enemy loses next action. |
| 87 | `signal_jam` | **Signal Jam** | common | 1 | core | — | Deal 3 damage. Apply Jam. |
| 88 | `grapple_lock` | **Grapple Lock** | common | 1 | neutral | — | Deal 4 damage. Apply Lock. |
| 89 | `null_field` | **Null Field** | rare | 3 | void | — | Deal 6 damage. Disable 1 enemy module for 2 turns. |
| 90 | `system_ping` | **System Ping** | common | 0 | neutral | — | Deal 2 damage. Reveal enemy's next action. |
| 91 | `cascade_overload` | **Cascade Overload** | rare | 4 | void | — | Deal 14 damage. If target has 2+ statuses, enemy loses next action. |
| 92 | `elite_hunter` | **Elite Hunter** | uncommon | 3 | core | — | Deal 14 damage. +6 vs Elite/Boss enemies. |
| 93 | `dual_lock_salvo` | **Dual Lock Salvo** | uncommon | 3 | core | — | Deal 8 damage to 2 targets. Apply Lock to both. |
| 94 | `proximity_mine` | **Proximity Mine** | uncommon | 2 | neutral | — | Place a mine. When enemy attacks, deal 12 damage. |
| 95 | `heat_injector` | **Heat Injector** | uncommon | 2 | void | — | Deal 6 damage. Enemy takes 2 self-damage each time they play a Weapon this turn. |
| 96 | `paint_target` | **Paint Target** | common | 1 | core | — | Deal 3 damage. Apply Drone Mark and Expose. |
| 97 | `polarity_flip` | **Polarity Flip** | rare | 3 | void | — | Transfer 8 Block from enemy to yourself. |
| 98 | `energy_siphon` | **Energy Siphon** | uncommon | 2 | void | — | Deal 6 damage. Enemy -1 energy next turn. You +1 energy next turn. |
| 99 | `hazard_pulse` | **Hazard Pulse** | common | 2 | core | — | Deal 6 damage to all enemies. |
| 100 | `catastrophic_strike` | **Catastrophic Strike** | legendary | 6 | void | — | Deal 32 damage. Apply Burn and Expose. Exhaust. |
| 101 | `singularity_cannon` | **Singularity Cannon** | mythic | 7 | void | — | Destroy all enemy Block and drones. Deal 40 damage. Once per game. Exhaust. |
| 102 | `blink_strike` | **Blink Strike** | uncommon | 2 | void | — | Deal 10 damage. Evade next attack. Exhaust. |
| 103 | `chaff_torpedo` | **Chaff Torpedo** | uncommon | 2 | neutral | — | Deal 8 damage. Add 2 Noise cards to enemy deck. |
| 104 | `iff_scrambler` | **IFF Scrambler** | rare | 3 | void | — | Deal 8 damage. Enemy's next attack hits a random target (may hit self). |
| 105 | `berserker_round` | **Berserker Round** | common | 1 | neutral | — | Deal 5 damage. +2 damage for each turn elapsed this combat. |
| 219 | `null_ray` | **Null Ray** | uncommon | 2 | void | — | Deal 6 damage. Disable 1 enemy module for 1 turn. |

---

## DEFENSE (16 cards)

| # | ID | Name | Rarity | Cost | Faction | Ship | Ability Text |
|---:|---|---|---|---:|---|---|---|
| 106 | `purge_protocol` | **Purge Protocol** | uncommon | 2 | core | — | Remove all statuses from self. Gain 8 Block per status removed. |
| 107 | `shield_recharge` | **Shield Recharge** | uncommon | 2 | core | — | If you were not hit last turn, gain 10 Block. |
| 108 | `shield_drone` | **Shield Drone** | uncommon | 3 | core | — | Deploy drone: +4 Block each turn for 3 turns. |
| 109 | `point_defense` | **Point Defense** | common | 1 | core | — | Negate the next missile or projectile attack. |
| 110 | `signal_denial` | **Signal Denial** | rare | 4 | void | — | Cancel the next enemy Weapon card. |
| 111 | `spoof_flare` | **Spoof Flare** | common | 2 | neutral | — | Redirect the next hit to one of your drones. |
| 112 | `escort_screen` | **Escort Screen** | common | 1 | core | — | Gain 5 Block. Redirect the next hit targeting an ally to self. |
| 113 | `threat_spoof` | **Threat Spoof** | common | 1 | neutral | — | Force enemy to target one of your drones instead of your ship. |
| 114 | `digital_firewall` | **Digital Firewall** | uncommon | 2 | core | — | Negate the next Jam applied to you. Gain Shielded. Draw 1. |
| 115 | `stealth_mask` | **Stealth Mask** | common | 2 | void | — | For 2 turns, enemy hack/ECM effects have 50% chance to fail. |
| 116 | `harmonic_barrier` | **Harmonic Barrier** | rare | 3 | core | — | Gain 12 Block. While this Block remains, gaining more Block cleanses 1 status. |
| 117 | `shield_breaker_protocol` | **Shield Breaker Protocol** | rare | 3 | core | — | Gain 8 Block. Remove Shielded from enemy. |
| 118 | `capacitor_hold` | **Capacitor Hold** | common | 0 | neutral | — | Retain 1 unused energy this turn (max 2 stored). Exhaust. |
| 119 | `temporal_loop` | **Temporal Loop** | mythic | 6 | void | — | Undo all damage taken last turn. Restore hull to last turn's value. Once per game. Exhaust. |
| 120 | `reinforced_plating` | **Reinforced Plating** | common | 1 | core | — | Gain 4 Block. All Block gained this turn is increased by 30%. |
| 221 | `counter_clamp` | **Counter Clamp** | uncommon | 2 | core | — | Prevent the next card-steal effect. Gain 5 Block. |

---

## MANEUVER (13 cards)

| # | ID | Name | Rarity | Cost | Faction | Ship | Ability Text |
|---:|---|---|---|---:|---|---|---|
| 121 | `timing_override` | **Timing Override** | common | 2 | core | — | Swap initiative. You act first next turn. |
| 122 | `warp_blink` | **Warp Blink** | common | 2 | void | — | Negate the next hit this turn. Exhaust. |
| 123 | `boost_thrusters` | **Boost Thrusters** | common | 1 | core | — | Next Maneuver card costs 0 this turn. |
| 124 | `true_aim` | **True Aim** | common | 1 | core | — | Next attack cannot miss or be evaded. |
| 125 | `combat_mode_swap` | **Combat Mode Swap** | rare | 2 | core | — | Toggle ship mode: Assault (+3 weapon damage, -3 Block) or Guard (+5 Block, -2 weapon damage). Persists. |
| 126 | `burst_window` | **Burst Window** | legendary | 4 | core | — | Play 1 additional card this turn. |
| 127 | `lag_injection` | **Lag Injection** | common | 2 | void | — | Enemy acts last next turn. |
| 128 | `echo_shot` | **Echo Shot** | rare | 2 | core | — | Replay your last Weapon card at -2 damage. |
| 129 | `queued_command` | **Queued Command** | uncommon | 1 | neutral | — | Store 1 card from hand. It auto-plays free next turn. |
| 130 | `rate_limiter` | **Rate Limiter** | rare | 3 | void | — | Enemy can only play 1 Weapon next turn. |
| 131 | `signal_scramble` | **Signal Scramble** | common | 2 | void | — | Enemy draws 1 fewer card next turn. |
| 132 | `wide_spectrum_jam` | **Wide Spectrum Jam** | legendary | 4 | void | — | All enemy cards cost +1 next turn. |
| 222 | `event_horizon` | **Event Horizon** | mythic | 5 | void | — | All enemies skip their next turn. Once per game. Exhaust. |

---

## DRONE (12 cards)

| # | ID | Name | Rarity | Cost | Faction | Ship | Ability Text |
|---:|---|---|---|---:|---|---|---|
| 133 | `micro_swarm` | **Micro-Swarm** | rare | 4 | core | — | Deploy 5 micro-drones: 1 damage each per turn for 4 turns. Each grows +1 damage per turn. |
| 134 | `detonate_drone` | **Detonate Drone** | common | 1 | void | — | Consume 1 active drone. Deal 12 damage to all enemies. |
| 135 | `firmware_patch` | **Firmware Patch** | common | 1 | core | — | Target active drone gains +3 damage per tick and +1 turn duration. |
| 136 | `drone_controller` | **Drone Controller** | legendary | 3 | core | — | This turn, all newly deployed drones act twice on their first turn. |
| 137 | `hangar_pod` | **Hangar Pod** | legendary | 5 | core | — | Every 2 turns, automatically spawn a Gun Drone (4 damage/turn, 2 turns). Lasts 6 turns. |
| 138 | `fleet_sync` | **Fleet Sync** | common | 2 | core | — | All active drones gain +1 damage per tick this combat. |
| 139 | `swarm_intelligence` | **Swarm Intelligence** | legendary | 3 | core | — | Your Weapons deal +1 damage for each active drone. |
| 140 | `sleeper_drone` | **Sleeper Drone** | common | 2 | neutral | — | Deploy a drone facedown. It reveals and activates next turn as a Gun Drone (4 damage, 3 turns). |
| 141 | `emergency_swarm` | **Emergency Swarm** | common | 2 | neutral | — | Summon 3 Decoy Drones (1 HP each, absorb 1 hit each). |
| 142 | `decoy_flare_token` | **Decoy Flare Token** | common | 1 | neutral | — | Place a bluff token on the field. Enemy must guess: real drone or decoy. If they attack it, waste their action. |
| 143 | `the_hive_mind` | **The Hive Mind** | mythic | 6 | void | — | Summon 3 Echo Drones. Each copies every Weapon you play at half damage for 3 turns. Once per game. Exhaust. |
| 144 | `emp_net` | **EMP Net** | common | 1 | core | — | Destroy 1 enemy drone. |

---

## AI (44 cards)

| # | ID | Name | Rarity | Cost | Faction | Ship | Ability Text |
|---:|---|---|---|---:|---|---|---|
| 145 | `cycle_systems` | **Cycle Systems** | common | 1 | core | — | Discard 1. Draw 2. |
| 146 | `telemetry_leak` | **Telemetry Leak** | common | 1 | neutral | — | Reveal enemy's next 2 actions. |
| 147 | `power_drain` | **Power Drain** | common | 2 | void | — | Enemy loses 1 energy next turn. |
| 148 | `system_shutdown` | **System Shutdown** | legendary | 4 | void | — | Disable 1 enemy Weapon card next turn. They cannot play Weapons. |
| 149 | `signal_spoof` | **Signal Spoof** | rare | 3 | void | — | Enemy's next attack targets their own drone instead. |
| 150 | `trace_protocol` | **Trace Protocol** | rare | 3 | void | — | Spend 2 energy. If you have more remaining energy than enemy, apply Jam and Lock. |
| 151 | `weapons_hot` | **Weapons Hot** | legendary | 3 | core | — | Passive: After playing 3 Weapon cards this combat, gain Overcharge. |
| 152 | `fortress_logic` | **Fortress Logic** | legendary | 3 | core | — | If your Block is over 20, deal 6 damage to attacker when hit. |
| 153 | `intel_cascade` | **Intel Cascade** | common | 2 | core | — | After drawing/scanning this turn, next Weapon gets +4 damage. |
| 154 | `scrap_synergy` | **Scrap Synergy** | common | 2 | neutral | — | Whenever you spend Scrap this combat, draw 1. |
| 155 | `ecm_feedback` | **ECM Feedback** | common | 2 | void | — | Whenever you apply a status effect this combat, gain 2 Block. |
| 156 | `rapid_fire_logic` | **Rapid Fire Logic** | common | 2 | neutral | — | Each 0-1 cost card played this turn adds +1 damage to your next Weapon. |
| 157 | `power_surge_protocol` | **Power Surge Protocol** | rare | 3 | core | — | If you have 3+ Overcharge, your next 5+ cost card costs 3 instead. |
| 158 | `targeting_core` | **Targeting Core** | common | 2 | core | — | All Weapon cards deal +2 damage this combat. |
| 159 | `weapon_router` | **Weapon Router** | rare | 3 | core | — | Whenever you play a Weapon card this combat, gain 2 Block. |
| 160 | `heat_sink_protocol` | **Heat Sink Protocol** | common | 2 | core | — | After playing 3 Weapons in a combat, gain Overcharge automatically. |
| 161 | `ecm_suite` | **ECM Suite** | legendary | 3 | void | — | When you apply Jam or Lock this combat, gain 1 energy next turn. |
| 162 | `system_restore` | **System Restore** | uncommon | 2 | core | — | Return the last card you played to your hand. |
| 163 | `archive_recall` | **Archive Recall** | uncommon | 2 | core | — | Return 1 card from your discard pile to your hand. |
| 164 | `preload_sequence` | **Preload Sequence** | common | 1 | core | — | Choose a card from your discard. Place it on top of your deck. |
| 165 | `recycle_protocol` | **Recycle Protocol** | common | 0 | neutral | — | Shuffle 1 card from your discard pile into your deck. |
| 166 | `hard_burn` | **Hard Burn** | uncommon | 1 | void | — | Exhaust 1 card from your hand permanently. Gain 2 energy. |
| 167 | `archive_echo` | **Archive Echo** | rare | 4 | core | — | Play a copy of any card from your discard pile. Then exhaust that card permanently. |
| 168 | `the_founders_key` | **The Founder's Key** | mythic | 0 | pioneer | — | Draw 5. Gain 3 energy. Heal 10. Once per game. Exhaust. |
| 169 | `dome_protocol` | **Dome Protocol** | uncommon | 2 | neutral | — | PvP: Both players reveal cards simultaneously. Higher initiative resolves first. |
| 190 | `nebula_fog` | **Nebula Fog** | rare | 3 | neutral | — | All Weapons deal -20% damage unless target is Locked. Lasts 3 turns. |
| 191 | `asteroid_field` | **Asteroid Field** | common | 2 | neutral | — | For 2 turns, ships without Evade take 3 damage at end of turn. |
| 192 | `ion_storm` | **Ion Storm** | legendary | 3 | void | — | For 3 turns: all statuses last +1 turn, energy gain -1. |
| 193 | `gravity_well` | **Gravity Well** | common | 2 | neutral | — | For 2 turns, all Maneuver cards cost +1. |
| 194 | `derelict_debris_field` | **Derelict Debris Field** | common | 2 | neutral | — | For 3 turns, gain +1 extra Scrap on each kill. |
| 195 | `signal_blackout` | **Signal Blackout** | rare | 3 | void | — | For 3 turns: draw effects -1, but Scan/reveal effects doubled. |
| 196 | `solar_flare` | **Solar Flare** | common | 2 | neutral | — | For 2 turns, all ships lose 3 Block at end of turn. |
| 197 | `quantum_rift` | **Quantum Rift** | legendary | 4 | void | — | For 3 turns, the first card played each turn is duplicated. |
| 198 | `ammo_rack` | **Ammo Rack** | common | 2 | core | — | Gain 1 Ammo token every 2 turns this combat. |
| 199 | `missile_guidance` | **Missile Guidance** | uncommon | 2 | core | — | All missile/torpedo Weapons apply Lock and ignore Evade. |
| 200 | `rail_capacitor` | **Rail Capacitor** | common | 2 | core | — | First Weapon card each turn deals +4 damage. |
| 201 | `heat_sink_module` | **Heat Sink Module** | common | 1 | core | — | After playing 3 Weapons, remove any Overheat effects. |
| 202 | `repair_bay` | **Repair Bay** | common | 1 | core | — | Heal 5 hull after this combat ends. |
| 203 | `salvage_rig` | **Salvage Rig** | uncommon | 2 | neutral | salvager | After combat, gain Scrap equal to total damage dealt / 20. |
| 204 | `quantum_relay` | **Quantum Relay** | legendary | 5 | void | — | The first card you play each combat is duplicated (played twice). |
| 205 | `memory_pin` | **Memory Pin** | common | 1 | core | — | Choose 1 card in your hand. It is retained (not discarded) at end of turn. |
| 213 | `power_contest` | **Power Contest** | uncommon | 2 | neutral | — | PvP: Compare total card power played this turn. Winner draws 2. |
| 214 | `arena_modifier` | **Arena Modifier** | uncommon | 2 | neutral | — | Set arena location: +1 energy gain for 2 turns. |
| 220 | `intent_scanner` | **Intent Scanner** | common | 1 | core | — | Reveal boss hidden intent for this turn. |

---

## CONSUMABLE (31 cards)

| # | ID | Name | Rarity | Cost | Faction | Ship | Ability Text |
|---:|---|---|---|---:|---|---|---|
| 170 | `load_rack` | **Load Rack** | common | 1 | core | — | Gain 2 Ammo tokens. Exhaust. |
| 171 | `emergency_reload` | **Emergency Reload** | uncommon | 2 | core | — | Spend 2 energy. Gain 3 Ammo tokens. Exhaust. |
| 172 | `tow_beacon` | **Tow Beacon** | common | 0 | neutral | hauler | Tow speed +30% this mission. Exhaust. |
| 173 | `legal_lock` | **Legal Lock** | uncommon | 2 | neutral | salvager | Extend wreck protected timer by 5 minutes. Exhaust. |
| 174 | `defrag_routine` | **Defrag Routine** | common | 1 | core | — | Remove 2 Noise cards from your deck. Exhaust. |
| 175 | `jettison` | **Jettison** | uncommon | 0 | neutral | — | After this encounter, permanently remove 1 card from your deck. Exhaust. |
| 176 | `refit_module` | **Refit Module** | uncommon | 1 | core | — | Choose 1 Weapon in your deck. It permanently gains +3 damage. Exhaust. |
| 177 | `recode_chip` | **Recode Chip** | rare | 2 | void | — | Transform 1 card in your deck into a random card of higher rarity. Exhaust. |
| 178 | `print_routine` | **Print Routine** | rare | 2 | core | — | Add a copy of a chosen 1-cost card to your deck. Exhaust. |
| 179 | `flash_routine` | **Flash Routine** | common | 0 | neutral | — | Add a temporary 0-cost Evade card to your hand (this combat only). Exhaust. |
| 180 | `buffer_burst` | **Buffer Burst** | uncommon | 1 | core | — | +2 hand limit this combat. Exhaust. |
| 181 | `chaff_packet` | **Chaff Packet** | uncommon | 1 | neutral | — | Add 2 Noise cards to enemy deck. Exhaust. |
| 182 | `emergency_reroute` | **Emergency Reroute** | uncommon | 1 | core | — | Discard your hand. Draw the same number of cards. Exhaust. |
| 183 | `amplifier_cell` | **Amplifier Cell** | common | 1 | core | — | All Weapons deal +3 damage this turn. Exhaust. |
| 184 | `servo_disruptor` | **Servo Disruptor** | common | 1 | neutral | — | Enemy Weapons deal -2 damage this turn. Exhaust. |
| 185 | `armor_strip_charge` | **Armor Strip Charge** | common | 1 | neutral | — | Enemy gains 3 less Block from each source this turn. Exhaust. |
| 186 | `critical_lock_cell` | **Critical Lock Cell** | rare | 2 | core | — | Next Weapon card deals double damage. Exhaust. |
| 187 | `quantum_splice` | **Quantum Splice** | mythic | 3 | void | — | Copy any card from opponent's hand and play it for free. Once per game. Exhaust. |
| 188 | `docking_window` | **Docking Window** | common | 1 | neutral | — | Heal 10 hull between fights. Exhaust. |
| 189 | `rescue_beacon` | **Rescue Beacon** | common | 0 | neutral | hauler | Increase tow availability by 2 for this run. Exhaust. |
| 206 | `risk_rider` | **Risk Rider** | uncommon | 0 | neutral | — | Mission payout +30%. Start combat with Burn. Exhaust. |
| 207 | `insurance_clause` | **Insurance Clause** | common | 0 | neutral | — | Wreck claim fee -20%. Mission payout -10%. Exhaust. |
| 208 | `tow_voucher` | **Tow Voucher** | common | 0 | neutral | — | Gain 1 free tow token. Exhaust. |
| 209 | `cargo_stabilizer` | **Cargo Stabilizer** | common | 0 | neutral | hauler | Hauling missions: collision penalties reduced 50%. Exhaust. |
| 210 | `race_sponsor` | **Race Sponsor** | uncommon | 0 | neutral | — | Speed run bonus: +50 GHAI if you finish in top 10%. Exhaust. |
| 211 | `reputation_first` | **Reputation First** | common | 0 | neutral | — | Mission: -30 GHAI payout, +2 reputation gain. Exhaust. |
| 212 | `black_market_deal` | **Black Market Deal** | uncommon | 0 | void | — | Mission: +80 GHAI payout. Add 2 Noise cards to your deck. Exhaust. |
| 215 | `data_cache` | **Data Cache** | uncommon | 1 | core | — | Store 1 card outside your deck for this run. Retrieve it at any shop. Exhaust. |
| 216 | `long_range_scan` | **Long-Range Scan** | common | 0 | neutral | — | Reveal the next 2 nodes on your PvE path. Exhaust. |
| 217 | `supply_credit` | **Supply Credit** | common | 0 | neutral | — | Shop prices -20% for this run. Exhaust. |
| 218 | `silent_running` | **Silent Running** | common | 1 | neutral | hauler | Random encounter chance -30% while hauling. Exhaust. |

---

## Pattern Coverage

All 223 patterns from `voidexa_scifi_card_pattern_library.xlsx` are now covered across 222 cards (some patterns covered by multiple cards, some cards combine multiple patterns):

### Special System Coverage

- **Environment/Sector (8/8):** Nebula Fog, Asteroid Field, Ion Storm, Gravity Well, Derelict Debris, Signal Blackout, Solar Flare, Quantum Rift
- **Mission Modifiers (7/7):** Risk Rider, Insurance Clause, Tow Voucher, Cargo Stabilizer, Race Sponsor, Reputation First, Black Market Deal
- **Wreck/Salvage (5/5):** Tow Beacon, Legal Lock, Field Patch (exp1), Salvo Barrage (exp1), Scrap Injector (baseline)
- **Boss Hooks (8/8):** Shield Breaker Protocol, Null Ray, Intent Scanner, Counter Clamp, Hazard Pulse, Catastrophic Strike, Berserker Round, Emergency Swarm
- **PvP Dome (5/5):** Dome Protocol, Arena Modifier, Power Contest, Sleeper Drone, Decoy Flare Token
- **Deck Recursion (8/8):** System Restore, Archive Recall, Preload Sequence, Recycle Protocol, Hard Burn, Archive Echo, Defrag Routine, Chaff Torpedo
- **Ammo/Payload (5/5):** Load Rack, Emergency Reload, Heavy Torpedo, Guided Missile, Unstable Warhead, Flak Warhead, Ammo Rack, Missile Guidance
- **Archetype Engines (8/8):** Weapons Hot, Fortress Logic, Swarm Intelligence, Intel Cascade, Scrap Synergy, ECM Feedback, Rapid Fire Logic, Power Surge Protocol
- **Modules/Ongoing (15/15):** Targeting Core, Weapon Router, Heat Sink Protocol/Module, ECM Suite, Rail Capacitor, Ammo Rack, Missile Guidance, Salvage Rig, Repair Bay, Quantum Relay, Memory Pin, Fleet Sync, Drone Controller, Shield Drone, Harmonic Barrier
- **Reactions/Intercepts (4/4):** Signal Denial, Point Defense, Proximity Mine, Spoof Flare
- **Disruption (4/4):** Null Field, Chaff Torpedo, IFF Scrambler, Null Ray
- **Status/Control (21/21):** Signal Jam, Grapple Lock, Thermal Breach, EMP Spike, Null Field, Coolant Purge (baseline), Cascade Overload, System Ping, Trace Protocol, Digital Firewall, Stealth Mask, Polarity Flip, Energy Siphon, Signal Scramble, Rate Limiter, Wide Spectrum Jam, etc.
- **PvE Meta (14/14):** Jettison, Refit Module, Recode Chip, Print Routine, Flash Routine, Buffer Burst, Emergency Reroute, Data Cache, Long-Range Scan, Supply Credit, Silent Running, Docking Window, Rescue Beacon, Chaff Packet
- **Targeting (5/5):** Paint Target, Escort Screen, Threat Spoof, Dual Lock Salvo, Elite Hunter
- **Buffs/Stat Mods (9/9):** Amplifier Cell, Reinforced Plating, True Aim, Critical Lock Cell, Boost Thrusters, Servo Disruptor, Armor Strip Charge, Heat Injector, Drain Beam (exp1)
- **Timing/Turn Control (5/5):** Burst Window, Lag Injection, Echo Shot, Queued Command, Combat Mode Swap

## Mythic Cards (8 total across all sets)

Limited to 50 copies per card in the universe. 0.1% drop rate. Once per game. Game-changing but not unbeatable.

| # | Name | Type | Cost | Ability | Set |
|---:|---|---|---:|---|---|
| 41 | Void Echo | weapon | 6 | Deal damage = total combat damage. Once per game. | Expansion 1 |
| 73 | Quantum Convergence | ai | 7 | Duplicate every card played this turn. Once per game. | Expansion 1 |
| 101 | Singularity Cannon | weapon | 7 | Destroy all enemy Block and drones. Deal 40 damage. Once per game. Exhaust. | Complete Set |
| 119 | Temporal Loop | defense | 6 | Undo all damage taken last turn. Restore hull to last turn's value. Once per game. Exhaust. | Complete Set |
| 143 | The Hive Mind | drone | 6 | Summon 3 Echo Drones. Each copies every Weapon you play at half damage for 3 turns. Once per game. Exhaust. | Complete Set |
| 168 | The Founder's Key | ai | 0 | Draw 5. Gain 3 energy. Heal 10. Once per game. Exhaust. | Complete Set |
| 187 | Quantum Splice | consumable | 3 | Copy any card from opponent's hand and play it for free. Once per game. Exhaust. | Complete Set |
| 222 | Event Horizon | maneuver | 5 | All enemies skip their next turn. Once per game. Exhaust. | Complete Set |

## Approved Statuses

All cards use only: **Expose**, **Burn**, **Jam**, **Lock**, **Shielded**, **Overcharge**, **Drone Mark**, **Scrap**. No new statuses introduced.

## Cost Curve Reference

| Cost | Expected Value |
|---:|---|
| 0 | Utility only, no full-value damage |
| 1 | 5–7 dmg or 5 block or light setup |
| 2 | 9–12 dmg or 8–10 block or utility + minor effect |
| 3 | 14–18 dmg or 12–16 block or strong status |
| 4 | 18–24 dmg or major swing |
| 5 | 24–30 dmg or summon/board-control |
| 6 | 30–36 dmg or encounter-defining |
| 7 | Rare/legendary finisher only |

---

## KEYWORD EXPANSION — Cards 223–257 (35 new cards)

> Added in the keyword patch (April 2026). All 35 cards introduce the 15 new sci-fi keywords.
> These cards are drone-heavy by design — keywords model advanced drone mechanics (deploy timing, resilience, targeting).

### New Keywords Reference

| Keyword | Effect |
|---|---|
| System Reboot | When destroyed, return to bay (with Cold Boot delay) |
| Cold Boot | Deploys facedown/delayed — activates next turn |
| Hot Deploy | Drone acts immediately on deployment turn |
| Priority Fire | Deals damage before opponent resolves |
| Cascade | Excess drone damage overflows to hull |
| High Orbit | Only targetable by long-range; bonus on hull damage |
| Tracking Lock | Targets precisely; bonus vs High Orbit |
| Critical Breach | Any damage destroys target drone/module |
| Auto-Repair Protocol | Survives first destruction with 1 hull |
| Hull Siphon | Damage dealt heals your hull |
| Persistent Systems | Does not engage (exhaust) on attack |
| Stealth Coating | Cannot be targeted by ECM/hack |
| Hardened Core | Cannot be destroyed by damage |
| Emergency Launch | Deploy during opponent's turn/attack |
| Twin Barrels | Deals damage twice (separately) |

### Distribution

| Rarity | Count |
|---|---:|
| common | 12 |
| uncommon | 10 |
| rare | 11 |
| legendary | 2 |
| **Total** | **35** |

| Type | Count |
|---|---:|
| drone | 26 |
| ai | 9 |
| **Total** | **35** |

| Faction | Count |
|---|---:|
| core | 15 |
| void | 14 |
| neutral | 6 |

### Full Card Table

| # | ID | Name | Type | Rarity | Cost | Faction | Keywords | Ability Text |
|---:|---|---|---|---|---:|---|---|---|
| 223 | `scrapline_reclaimer` | **Scrapline Reclaimer** | drone | common | 2 | void | system_reboot, cold_boot | System Reboot — When destroyed, return to bay with Cold Boot. |
| 224 | `lazarus_swarm_node` | **Lazarus Swarm Node** | drone | rare | 4 | core | system_reboot | System Reboot — When friendly drone destroyed, pay 1 to return with Cold Boot. |
| 225 | `dockborn_interceptor` | **Dockborn Interceptor** | drone | common | 1 | core | cold_boot | Cold Boot. On enter, gain 1 shield. |
| 226 | `assembly_line_siege_pod` | **Assembly-Line Siege Pod** | drone | uncommon | 3 | void | cold_boot | Cold Boot. After boot, +1 attack this turn. |
| 227 | `redline_breacher` | **Redline Breacher** | drone | common | 2 | void | hot_deploy | Hot Deploy. May attack immediately. |
| 228 | `burnwake_assault_rack` | **Burnwake Assault Rack** | ai | rare | 4 | void | hot_deploy | Drones deployed this turn have Hot Deploy. |
| 229 | `vector_duelist` | **Vector Duelist** | drone | common | 2 | core | priority_fire | Priority Fire. Deals damage before opponent. |
| 230 | `sentinel_mark_iv` | **Sentinel Mark-IV** | drone | uncommon | 3 | core | priority_fire | Priority Fire. If destroys before return fire, prevent return damage. |
| 231 | `mass_driver_colossus` | **Mass Driver Colossus** | drone | rare | 5 | core | cascade | Cascade. Excess drone damage hits hull. |
| 232 | `breachline_torpedo_bus` | **Breachline Torpedo Bus** | drone | uncommon | 4 | void | cascade | Cascade. Excess damage to damaged drone hits hull. |
| 233 | `stratos_relay_kite` | **Stratos Relay Kite** | drone | common | 2 | neutral | high_orbit | High Orbit. Draw 1 on hull damage. |
| 234 | `orbital_lance_platform` | **Orbital Lance Platform** | drone | rare | 5 | neutral | high_orbit | High Orbit. Long-range +1 hull damage. |
| 235 | `skyhook_flak_drone` | **Skyhook Flak Drone** | drone | common | 2 | core | tracking_lock | Tracking Lock. +1 vs High Orbit. |
| 236 | `predictive_aegis_grid` | **Predictive Aegis Grid** | ai | uncommon | 3 | core | tracking_lock | All friendlies gain Tracking Lock. Draw 1 if enemy has High Orbit. |
| 237 | `needlefang_hunter` | **Needlefang Hunter** | drone | uncommon | 3 | void | critical_breach | Critical Breach. Any damage destroys drones. |
| 238 | `blacksite_sever_pod` | **Blacksite Sever Pod** | drone | rare | 4 | void | critical_breach | Critical Breach. On hull damage, disable 1 enemy module. |
| 239 | `patchwork_bastion` | **Patchwork Bastion** | drone | common | 3 | core | auto_repair_protocol | Auto-Repair Protocol. First destruction prevented, engage instead. |
| 240 | `self_mending_bulwark` | **Self-Mending Bulwark** | drone | rare | 5 | core | auto_repair_protocol | Auto-Repair Protocol. On survival, repair 2 hull. |
| 241 | `leechray_skimmer` | **Leechray Skimmer** | drone | uncommon | 2 | void | hull_siphon | Hull Siphon. Damage dealt repairs your hull. |
| 242 | `reclamation_harvester` | **Reclamation Harvester** | drone | rare | 4 | void | hull_siphon | Hull Siphon. On drone damage, gain 1 energy next turn. |
| 243 | `watchline_custodian` | **Watchline Custodian** | drone | common | 2 | core | persistent_systems | Persistent Systems. No engage on attack. |
| 244 | `everwake_patrol_spine` | **Everwake Patrol Spine** | drone | uncommon | 4 | core | persistent_systems | Persistent Systems. Unengaged adjacent drones +1 defense. |
| 245 | `ghostglass_scout` | **Ghostglass Scout** | drone | common | 2 | void | stealth_coating | Stealth Coating. Cannot be targeted by ECM. |
| 246 | `phantom_mesh_array` | **Phantom Mesh Array** | ai | rare | 4 | void | stealth_coating | Drones deployed this turn gain Stealth Coating. |
| 247 | `adamant_siege_engine` | **Adamant Siege Engine** | drone | rare | 6 | core | hardened_core | Hardened Core. Cannot be destroyed by damage. |
| 248 | `corevault_guardian` | **Corevault Guardian** | drone | legendary | 7 | core | hardened_core | Hardened Core. Enemy modules cost +1 targeting your board. |
| 249 | `rapid_bay_interceptor` | **Rapid Bay Interceptor** | drone | common | 2 | void | emergency_launch | Emergency Launch. Deploy during opponent's attack. |
| 250 | `ambush_deployment_net` | **Ambush Deployment Net** | ai | uncommon | 3 | void | emergency_launch | Emergency Launch. On enemy attack, deploy drone cost 2 or less. |
| 251 | `dualcoil_pursuer` | **Dualcoil Pursuer** | drone | uncommon | 3 | core | twin_barrels | Twin Barrels. Deals damage twice. |
| 252 | `barrage_widow` | **Barrage Widow** | drone | rare | 5 | void | twin_barrels | Twin Barrels. Both hits apply separately to hull. |
| 253 | `graveyard_sync_core` | **Graveyard Sync Core** | ai | legendary | 6 | void | system_reboot | Once per turn, first friendly drone destroyed gains System Reboot. |
| 254 | `burngate_commander` | **Burngate Commander** | ai | legendary | 5 | void | hot_deploy | Drones cost 3 or less have Hot Deploy. |
| 255 | `surgical_kill_mesh` | **Surgical Kill Mesh** | ai | rare | 4 | void | critical_breach | Drones with attack 1 gain Critical Breach. |
| 256 | `overclocked_gunbrain` | **Overclocked Gunbrain** | ai | rare | 4 | core | twin_barrels | Next drone deployed gains Twin Barrels this turn. |
| 257 | `crisis_hangar_ai` | **Crisis Hangar AI** | ai | rare | 5 | core | emergency_launch | Each opponent turn, first drone deployed gains Emergency Launch, costs 1 less. |

### 21 Retrofitted Cards (keywords added to existing cards)

| ID | Card | Added Keyword(s) | Source File |
|---|---|---|---|
| ghost_drift | Ghost Drift | stealth_coating | index.ts |
| cloak_burst | Cloak Burst | stealth_coating | expansion_set_1.json |
| phantom_strike | Phantom Strike | stealth_coating | expansion_set_1.json |
| stealth_mask | Stealth Mask | stealth_coating | full_card_library.json |
| drift_turn | Drift Turn | twin_barrels | expansion_set_1.json |
| drone_controller | Drone Controller | hot_deploy, twin_barrels | full_card_library.json |
| fleet_commander | Fleet Commander | hot_deploy | expansion_set_1.json |
| spare_drone_kit | Spare Drone Kit | hot_deploy | expansion_set_1.json |
| escort_wing | Escort Wing | hot_deploy | expansion_set_1.json |
| micro_swarm | Micro-Swarm | hot_deploy | full_card_library.json |
| hangar_pod | Hangar Pod | hot_deploy | full_card_library.json |
| sleeper_drone | Sleeper Drone | cold_boot | full_card_library.json |
| flak_burst | Flak Burst | tracking_lock | expansion_set_1.json |
| flak_warhead | Flak Warhead | tracking_lock | full_card_library.json |
| missile_guidance | Missile Guidance | tracking_lock | full_card_library.json |
| emp_net | EMP Net | critical_breach | full_card_library.json |
| singularity_cannon | Singularity Cannon | critical_breach | full_card_library.json |
| vector_cut | Vector Cut | priority_fire | index.ts |
| timing_override | Timing Override | priority_fire | full_card_library.json |
| dome_protocol | Dome Protocol | priority_fire | full_card_library.json |
| crash_override | Crash Override | auto_repair_protocol | expansion_set_1.json |