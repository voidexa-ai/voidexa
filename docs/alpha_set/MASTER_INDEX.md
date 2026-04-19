# Alpha Set — Master Index

Rolling summary of generated batches. One line per card. Appended per batch; never rewritten.

---

## Cumulative archetype tracker (updated after every batch)

Target distribution across all 1000 cards (Part 8):
Aggro 200 · Control 200 · Midrange 250 · Combo 150 · Ramp 80 · Utility 120.

Each batch's plan is derived from remaining budget ÷ remaining batches, not
from the static Rule 8 per-batch average — so a batch that over-delivers on
one archetype must be offset by the next.

| Archetype | Target | After B01 | After B02 | Remaining | Batches left | Avg needed |
|---|---|---|---|---|---|---|
| Aggro    | 200 | 51 | 55  | 145 | 8 | 18.1 |
| Control  | 200 | 18 | 68  | 132 | 8 | 16.5 |
| Midrange | 250 | 21 | 38  | 212 | 8 | 26.5 |
| Combo    | 150 |  5 | 16  | 134 | 8 | 16.8 |
| Ramp     |  80 |  0 |  5  |  75 | 8 |  9.4 |
| Utility  | 120 |  5 | 18  | 102 | 8 | 12.8 |

Status after B02: Aggro ahead of pace (need less than 20/batch going
forward). Control slightly ahead. Midrange behind — future batches must
lean midrange-heavy. Ramp+Utility on pace. Combo on pace.

---

## Batch 01 — Common Weapons + Common Drones (Aggro Core)

**Cards:** 100 · **File:** `batch_01.json`

Distribution:
- Rarity: 100 common
- Types: 55 Weapon, 45 Drone
- Cost: 2× 0 · 19× 1 · 30× 2 · 27× 3 · 14× 4 · 6× 5 · 2× 6
- Archetype: 51 aggro · 21 midrange · 18 control · 5 combo · 5 utility · 0 ramp
- Keywords used: rapid_launch (7), priority_fire (6), deploy_burst (6), cold_boot (5), breach_cascade (4), radiation_leak (4), interceptor (4), critical_breach (4), flanking_fire (3), persistent_field (3), auto_repair (3), reactive (2), critical_strike (2), overclock (2), phase_drive (2), tracking_lock (2), overflow_fire (2), probe (2), cloaked_entry (2), alpha_strike (1), disable (1), quick_strike (1), hot_deploy (1), end_cycle (1), apply_lock (1), assault_protocol (1), skyward_maneuver (1), deep_scan (1)

### Cards

| # | id | name | type | cost | A/D | archetype | keywords |
|---|---|---|---|---|---|---|---|
| 001 | spark_discharge | Spark Discharge | Weapon | 0 | 2/0 | aggro | reactive |
| 002 | scavenged_round | Scavenged Round | Weapon | 0 | 3/0 | aggro |  |
| 003 | pulse_rifle | Pulse Rifle | Weapon | 1 | 4/0 | aggro |  |
| 004 | laser_tap | Laser Tap | Weapon | 1 | 3/0 | aggro |  |
| 005 | kinetic_slug | Kinetic Slug | Weapon | 1 | 4/0 | aggro |  |
| 006 | gauss_bolt | Gauss Bolt | Weapon | 1 | 3/0 | aggro | priority_fire |
| 007 | needle_beam | Needle Beam | Weapon | 1 | 3/0 | aggro | critical_strike |
| 008 | stutter_gun | Stutter Gun | Weapon | 1 | 3/0 | combo | alpha_strike |
| 009 | arc_cutter | Arc Cutter | Weapon | 1 | 4/0 | aggro | breach_cascade |
| 010 | rapid_pulse | Rapid Pulse | Weapon | 1 | 3/0 | aggro | priority_fire |
| 011 | chaff_round | Chaff Round | Weapon | 1 | 3/0 | control | disable |
| 012 | ion_spark | Ion Spark | Weapon | 1 | 3/0 | control |  |
| 013 | incendiary_slug | Incendiary Slug | Weapon | 1 | 3/0 | aggro | radiation_leak |
| 014 | scatter_round | Scatter Round | Weapon | 1 | 4/0 | aggro |  |
| 015 | splinter_missile | Splinter Missile | Weapon | 1 | 3/0 | aggro | flanking_fire |
| 016 | blaster_carbine | Blaster Carbine | Weapon | 1 | 4/0 | combo | overclock |
| 017 | plasma_bolt | Plasma Bolt | Weapon | 2 | 6/0 | aggro |  |
| 018 | ion_cannon_mk1 | Ion Cannon Mk.I | Weapon | 2 | 5/0 | control |  |
| 019 | fusion_lance | Fusion Lance | Weapon | 2 | 5/0 | aggro | priority_fire |
| 020 | railgun_round | Railgun Round | Weapon | 2 | 6/0 | aggro |  |
| 021 | heavy_laser | Heavy Laser | Weapon | 2 | 6/0 | midrange |  |
| 022 | phase_bolt | Phase Bolt | Weapon | 2 | 5/0 | aggro | phase_drive |
| 023 | arc_projector | Arc Projector | Weapon | 2 | 5/0 | combo | breach_cascade |
| 024 | smart_missile | Smart Missile | Weapon | 2 | 5/0 | aggro | rapid_launch |
| 025 | torpedo_mk1 | Torpedo Mk.I | Weapon | 2 | 6/0 | midrange | cold_boot |
| 026 | aim_shot | Aim Shot | Weapon | 2 | 5/0 | control | tracking_lock |
| 027 | coilgun_mk1 | Coilgun Mk.I | Weapon | 2 | 6/0 | midrange |  |
| 028 | snap_fire | Snap Fire | Weapon | 2 | 5/0 | aggro | quick_strike |
| 029 | burn_beam | Burn Beam | Weapon | 2 | 5/0 | control | radiation_leak |
| 030 | scattergun | Scattergun | Weapon | 2 | 5/0 | aggro |  |
| 031 | reaction_shot | Reaction Shot | Weapon | 2 | 5/0 | control | reactive |
| 032 | overclock_beam | Overclock Beam | Weapon | 2 | 5/0 | combo | overclock |
| 033 | recoil_cannon | Recoil Cannon | Weapon | 2 | 6/0 | aggro |  |
| 034 | heavy_railgun | Heavy Railgun | Weapon | 3 | 9/0 | aggro |  |
| 035 | plasma_lance | Plasma Lance | Weapon | 3 | 8/0 | aggro | priority_fire |
| 036 | fusion_cannon | Fusion Cannon | Weapon | 3 | 9/0 | midrange |  |
| 037 | warhead_tube | Warhead Tube | Weapon | 3 | 8/0 | aggro | overflow_fire |
| 038 | ion_turret | Ion Turret | Weapon | 3 | 6/3 | midrange | persistent_field |
| 039 | shear_beam | Shear Beam | Weapon | 3 | 8/0 | aggro | flanking_fire |
| 040 | siege_cannon | Siege Cannon | Weapon | 3 | 10/0 | midrange | cold_boot |
| 041 | triple_turret | Triple Turret | Weapon | 3 | 6/2 | aggro |  |
| 042 | mass_driver | Mass Driver | Weapon | 3 | 8/0 | control |  |
| 043 | burn_turret | Burn Turret | Weapon | 3 | 7/2 | control | radiation_leak |
| 044 | smart_torpedo | Smart Torpedo | Weapon | 3 | 8/0 | aggro | rapid_launch |
| 045 | pulse_battery | Pulse Battery | Weapon | 3 | 7/3 | midrange | persistent_field |
| 046 | quad_railgun | Quad Railgun | Weapon | 4 | 12/0 | aggro |  |
| 047 | torpedo_rack | Torpedo Rack | Weapon | 4 | 12/0 | aggro | hot_deploy |
| 048 | breach_cannon | Breach Cannon | Weapon | 4 | 12/0 | aggro |  |
| 049 | arc_cannon | Arc Cannon | Weapon | 4 | 10/2 | combo | breach_cascade |
| 050 | fusion_beam | Fusion Beam | Weapon | 4 | 12/0 | control | radiation_leak |
| 051 | siege_turret | Siege Turret | Weapon | 4 | 8/5 | midrange | cold_boot, persistent_field |
| 052 | pulse_battery_mk2 | Pulse Battery Mk.II | Weapon | 5 | 16/0 | aggro |  |
| 053 | breach_torpedo | Breach Torpedo | Weapon | 5 | 16/0 | aggro | overflow_fire |
| 054 | ion_breaker | Ion Breaker | Weapon | 5 | 16/0 | control | critical_strike |
| 055 | orbital_battery | Orbital Battery | Weapon | 6 | 20/0 | aggro | priority_fire |
| 056 | scout_drone_beta | Scout Drone Beta | Drone | 1 | 1/2 | utility | deploy_burst, probe |
| 057 | light_drone | Light Drone | Drone | 1 | 2/1 | aggro |  |
| 058 | gun_drone | Gun Drone | Drone | 1 | 3/1 | aggro |  |
| 059 | spotter_drone | Spotter Drone | Drone | 1 | 1/2 | utility | end_cycle |
| 060 | swarm_drone | Swarm Drone | Drone | 1 | 2/2 | aggro |  |
| 061 | fighter_drone | Fighter Drone | Drone | 2 | 3/3 | midrange |  |
| 062 | interceptor_drone | Interceptor Drone | Drone | 2 | 2/4 | control | interceptor |
| 063 | striker_drone | Striker Drone | Drone | 2 | 4/1 | aggro | rapid_launch |
| 064 | bomber_drone | Bomber Drone | Drone | 2 | 4/1 | aggro | critical_breach |
| 065 | recon_drone | Recon Drone | Drone | 2 | 2/3 | utility | deploy_burst |
| 066 | decoy_drone | Decoy Drone | Drone | 2 | 1/4 | control |  |
| 067 | repair_drone | Repair Drone | Drone | 2 | 1/4 | midrange | auto_repair |
| 068 | siege_drone | Siege Drone | Drone | 2 | 4/2 | midrange |  |
| 069 | patrol_drone | Patrol Drone | Drone | 2 | 3/2 | utility | deploy_burst, probe |
| 070 | flashbang_drone | Flashbang Drone | Drone | 2 | 2/3 | control | deploy_burst, apply_lock |
| 071 | chain_drone | Chain Drone | Drone | 2 | 3/2 | aggro | assault_protocol |
| 072 | arc_drone | Arc Drone | Drone | 2 | 3/3 | aggro | breach_cascade |
| 073 | jury_rigged_drone | Jury-Rigged Drone | Drone | 2 | 4/2 | aggro |  |
| 074 | heavy_fighter | Heavy Fighter | Drone | 3 | 5/3 | midrange |  |
| 075 | interceptor_mk2 | Interceptor Mk.II | Drone | 3 | 3/5 | control | interceptor |
| 076 | assault_drone | Assault Drone | Drone | 3 | 5/3 | aggro | rapid_launch |
| 077 | bomber_mk2 | Bomber Mk.II | Drone | 3 | 4/4 | aggro | critical_breach |
| 078 | cloaked_drone | Cloaked Drone | Drone | 3 | 4/4 | midrange | cloaked_entry |
| 079 | phase_drone | Phase Drone | Drone | 3 | 4/4 | aggro | phase_drive |
| 080 | skyward_drone | Skyward Drone | Drone | 3 | 4/4 | aggro | skyward_maneuver |
| 081 | oracle_drone | Oracle Drone | Drone | 3 | 2/6 | utility | deploy_burst, deep_scan |
| 082 | turret_drone | Turret Drone | Drone | 3 | 5/4 | midrange |  |
| 083 | repair_drone_mk2 | Repair Drone Mk.II | Drone | 3 | 2/6 | midrange | auto_repair |
| 084 | sapper_drone | Sapper Drone | Drone | 3 | 4/4 | control |  |
| 085 | laser_drone | Laser Drone | Drone | 3 | 5/3 | aggro |  |
| 086 | siege_drone_mk2 | Siege Drone Mk.II | Drone | 3 | 5/4 | midrange |  |
| 087 | flanker_drone | Flanker Drone | Drone | 3 | 5/3 | aggro | flanking_fire |
| 088 | scanner_drone | Scanner Drone | Drone | 3 | 2/6 | control | deploy_burst, tracking_lock |
| 089 | heavy_bomber_drone | Heavy Bomber Drone | Drone | 4 | 8/5 | aggro | rapid_launch |
| 090 | bulwark_drone | Bulwark Drone | Drone | 4 | 4/9 | control | interceptor |
| 091 | strike_drone_mk3 | Strike Drone Mk.III | Drone | 4 | 7/5 | aggro | priority_fire |
| 092 | bomber_mk3 | Bomber Mk.III | Drone | 4 | 7/5 | aggro | critical_breach |
| 093 | support_drone | Support Drone | Drone | 4 | 3/9 | midrange | auto_repair |
| 094 | heavy_fighter_mk2 | Heavy Fighter Mk.II | Drone | 4 | 8/5 | midrange |  |
| 095 | kamikaze_drone | Kamikaze Drone | Drone | 4 | 10/2 | aggro | critical_breach |
| 096 | cloaker_drone | Cloaker Drone | Drone | 4 | 6/6 | midrange | cloaked_entry |
| 097 | elite_fighter | Elite Fighter | Drone | 5 | 9/7 | midrange |  |
| 098 | siege_bomber | Siege Bomber | Drone | 5 | 10/6 | aggro | rapid_launch |
| 099 | heavy_interceptor | Heavy Interceptor | Drone | 5 | 6/12 | control | interceptor, cold_boot |
| 100 | capital_drone | Capital Drone | Drone | 6 | 10/10 | midrange | rapid_launch, cold_boot |

## Batch 02 — Common Defense + Common Maneuvers

**Cards:** 100 · **File:** `batch_02.json`

Distribution:
- Rarity: 100 common
- Types: 55 Defense, 45 Maneuver
- Cost: 8x 0 · 18x 1 · 25x 2 · 24x 3 · 14x 4 · 8x 5 · 3x 6
- Archetype: 50 control · 17 midrange · 13 utility · 11 combo · 5 ramp · 4 aggro
  (intentional: offsets Batch 01's aggro surplus per cumulative plan)
- Keywords used: evade (7), reactive (6), interceptor (6), ablative_plating (5), auto_repair (4), priority_fire (4), reinforced_hull (3), countermeasure (3), gain_stealth (3), scrap (2), critical_breach (2), tracking_array (2), emergency_reboot (2), phase_drive (2), deep_scan (2), negate (2), signal_jammer (1), cloaked_entry (1), disable (1), flanking_fire (1), skyward_maneuver (1), probe (1), cycling_protocol (1), rapid_launch (1), bounce (1), tactical_draw (1), archive_recall (1), tracking_lock (1), overcharge (1), alpha_strike (1)

### Cards

| # | id | name | type | cost | A/D | archetype | keywords |
|---|---|---|---|---|---|---|---|
| 101 | basic_deflector | Basic Deflector | Defense | 0 | 0/3 | control | reactive |
| 102 | emergency_shield | Emergency Shield | Defense | 0 | 0/3 | control |  |
| 103 | panic_plating | Panic Plating | Defense | 0 | 0/3 | control | reactive, scrap |
| 104 | light_shield | Light Shield | Defense | 1 | 0/5 | midrange |  |
| 105 | deflector_plate | Deflector Plate | Defense | 1 | 0/4 | control | ablative_plating |
| 106 | point_barrier | Point Barrier | Defense | 1 | 0/3 | ramp | auto_repair |
| 107 | reactive_plate | Reactive Plate | Defense | 1 | 0/4 | control | critical_breach |
| 108 | combat_shield | Combat Shield | Defense | 1 | 1/4 | midrange |  |
| 109 | interceptor_wall | Interceptor Wall | Defense | 1 | 0/4 | control | interceptor |
| 110 | armor_strip | Armor Strip | Defense | 1 | 0/5 | midrange |  |
| 111 | cover_panel | Cover Panel | Defense | 1 | 0/4 | midrange |  |
| 112 | medium_shield | Medium Shield | Defense | 2 | 0/8 | midrange |  |
| 113 | ablative_hull | Ablative Hull | Defense | 2 | 0/7 | control | ablative_plating |
| 114 | defense_drone_wall | Defense Drone Wall | Defense | 2 | 0/6 | control | interceptor |
| 115 | repair_nanites | Repair Nanites | Defense | 2 | 0/6 | ramp | auto_repair |
| 116 | mirror_panel | Mirror Panel | Defense | 2 | 0/6 | control |  |
| 117 | emergency_bulkhead | Emergency Bulkhead | Defense | 2 | 0/7 | control | reinforced_hull |
| 118 | phase_barrier | Phase Barrier | Defense | 2 | 0/6 | control | evade |
| 119 | countermeasure_grid | Countermeasure Grid | Defense | 2 | 0/6 | control | countermeasure |
| 120 | signal_jammer_field | Signal Jammer Field | Defense | 2 | 0/5 | control | signal_jammer |
| 121 | tracking_shield | Tracking Shield | Defense | 2 | 0/6 | control | tracking_array |
| 122 | cloaked_barrier | Cloaked Barrier | Defense | 2 | 0/6 | control | cloaked_entry |
| 123 | reboot_plate | Reboot Plate | Defense | 2 | 0/5 | control | emergency_reboot |
| 124 | defense_drone_turret | Defense Drone Turret | Defense | 2 | 1/6 | midrange |  |
| 125 | heavy_shield | Heavy Shield | Defense | 3 | 0/10 | midrange |  |
| 126 | reinforced_bulwark | Reinforced Bulwark | Defense | 3 | 1/9 | control | interceptor |
| 127 | fortress_plate | Fortress Plate | Defense | 3 | 0/11 | midrange |  |
| 128 | regen_armor | Regen Armor | Defense | 3 | 0/9 | ramp | auto_repair |
| 129 | adaptive_hull | Adaptive Hull | Defense | 3 | 0/8 | control | ablative_plating |
| 130 | last_stand_plate | Last Stand Plate | Defense | 3 | 0/8 | control | reinforced_hull |
| 131 | stealth_field | Stealth Field | Defense | 3 | 0/8 | control | gain_stealth |
| 132 | dodge_field | Dodge Field | Defense | 3 | 0/8 | control | evade |
| 133 | energy_sink | Energy Sink | Defense | 3 | 0/8 | control | countermeasure |
| 134 | tracking_grid | Tracking Grid | Defense | 3 | 0/8 | control | tracking_array |
| 135 | deflector_dome | Deflector Dome | Defense | 3 | 1/9 | midrange |  |
| 136 | shield_node | Shield Node | Defense | 3 | 0/10 | midrange |  |
| 137 | reinforce_wall | Reinforce Wall | Defense | 3 | 0/9 | control | critical_breach |
| 138 | auxiliary_bulkhead | Auxiliary Bulkhead | Defense | 3 | 0/10 | midrange |  |
| 139 | reinforced_plating | Reinforced Plating | Defense | 4 | 0/14 | midrange |  |
| 140 | heavy_bulwark | Heavy Bulwark | Defense | 4 | 2/12 | control | interceptor |
| 141 | fortress_wall | Fortress Wall | Defense | 4 | 0/15 | midrange |  |
| 142 | aegis_barrier | Aegis Barrier | Defense | 4 | 0/13 | control | ablative_plating |
| 143 | hull_reinforcement | Hull Reinforcement | Defense | 4 | 0/14 | ramp | auto_repair |
| 144 | stealth_barrier | Stealth Barrier | Defense | 4 | 0/13 | control | gain_stealth |
| 145 | phase_wall | Phase Wall | Defense | 4 | 0/13 | control | evade |
| 146 | reboot_bulwark | Reboot Bulwark | Defense | 4 | 0/12 | control | emergency_reboot |
| 147 | countermeasure_array | Countermeasure Array | Defense | 4 | 0/12 | control | countermeasure |
| 148 | heavy_fortress | Heavy Fortress | Defense | 5 | 2/16 | midrange |  |
| 149 | mega_shield | Mega Shield | Defense | 5 | 0/18 | midrange |  |
| 150 | battle_bulwark | Battle Bulwark | Defense | 5 | 3/15 | control | interceptor |
| 151 | titanic_plating | Titanic Plating | Defense | 5 | 0/17 | control | reinforced_hull |
| 152 | aegis_fortress | Aegis Fortress | Defense | 5 | 0/16 | control | ablative_plating |
| 153 | orbital_fortress | Orbital Fortress | Defense | 6 | 3/18 | midrange |  |
| 154 | citadel_plating | Citadel Plating | Defense | 6 | 0/22 | midrange |  |
| 155 | capital_bulwark | Capital Bulwark | Defense | 6 | 5/16 | control | interceptor |
| 156 | evasive_swerve | Evasive Swerve | Maneuver | 0 | 0/0 | control | reactive |
| 157 | barrel_roll | Barrel Roll | Maneuver | 0 | 0/0 | utility |  |
| 158 | emergency_brake | Emergency Brake | Maneuver | 0 | 0/0 | control |  |
| 159 | skip_frame | Skip Frame | Maneuver | 0 | 0/0 | control | scrap |
| 160 | panic_eject | Panic Eject | Maneuver | 0 | 0/0 | control | reactive |
| 161 | dive | Dive | Maneuver | 1 | 0/0 | combo | priority_fire |
| 162 | weave | Weave | Maneuver | 1 | 0/0 | utility | evade |
| 163 | pivot | Pivot | Maneuver | 1 | 0/0 | combo | priority_fire |
| 164 | feint | Feint | Maneuver | 1 | 0/0 | control |  |
| 165 | combat_roll | Combat Roll | Maneuver | 1 | 0/0 | utility |  |
| 166 | flare | Flare | Maneuver | 1 | 0/0 | control | disable |
| 167 | chaff_dump | Chaff Dump | Maneuver | 1 | 0/0 | control |  |
| 168 | overthrust | Overthrust | Maneuver | 1 | 0/0 | combo |  |
| 169 | break_line | Break Line | Maneuver | 1 | 0/0 | utility |  |
| 170 | sidewinder | Sidewinder | Maneuver | 1 | 0/0 | combo | flanking_fire |
| 171 | hard_brake | Hard Brake | Maneuver | 2 | 0/0 | control | reactive |
| 172 | inverted_dive | Inverted Dive | Maneuver | 2 | 0/0 | combo | phase_drive |
| 173 | evasive_pattern | Evasive Pattern | Maneuver | 2 | 0/0 | utility | evade |
| 174 | skyward_burst | Skyward Burst | Maneuver | 2 | 0/0 | combo | skyward_maneuver |
| 175 | probe_scan | Probe Scan | Maneuver | 2 | 0/0 | utility | probe |
| 176 | tactical_sweep | Tactical Sweep | Maneuver | 2 | 0/0 | utility | deep_scan |
| 177 | cycle_routine | Cycle Routine | Maneuver | 2 | 0/0 | utility | cycling_protocol |
| 178 | adrenal_surge | Adrenal Surge | Maneuver | 2 | 0/0 | combo |  |
| 179 | evasive_split | Evasive Split | Maneuver | 2 | 0/0 | utility | evade |
| 180 | counter_flare | Counter Flare | Maneuver | 2 | 0/0 | control | negate |
| 181 | combat_reroute | Combat Reroute | Maneuver | 2 | 0/0 | control |  |
| 182 | vector_cut | Vector Cut | Maneuver | 2 | 0/0 | combo | priority_fire |
| 183 | full_evasion | Full Evasion | Maneuver | 3 | 0/0 | control | gain_stealth |
| 184 | deep_maneuver | Deep Maneuver | Maneuver | 3 | 0/0 | utility | evade |
| 185 | swarm_pattern | Swarm Pattern | Maneuver | 3 | 0/0 | aggro | rapid_launch |
| 186 | tactical_reposition | Tactical Reposition | Maneuver | 3 | 0/0 | utility | bounce |
| 187 | force_dodge | Force Dodge | Maneuver | 3 | 0/0 | control |  |
| 188 | ion_dive | Ion Dive | Maneuver | 3 | 0/0 | utility | phase_drive |
| 189 | snap_draw | Snap Draw | Maneuver | 3 | 0/0 | utility | tactical_draw |
| 190 | archive_pull | Archive Pull | Maneuver | 3 | 0/0 | combo | archive_recall |
| 191 | counter_maneuver | Counter Maneuver | Maneuver | 3 | 0/0 | control | negate |
| 192 | combat_vectoring | Combat Vectoring | Maneuver | 3 | 0/0 | combo | priority_fire |
| 193 | all_out_charge | All-Out Charge | Maneuver | 4 | 0/0 | aggro |  |
| 194 | perfect_evasion | Perfect Evasion | Maneuver | 4 | 0/0 | control |  |
| 195 | deep_scan_lock | Deep Scan Lock | Maneuver | 4 | 0/0 | combo | deep_scan, tracking_lock |
| 196 | tactical_overdrive | Tactical Overdrive | Maneuver | 4 | 0/0 | ramp | overcharge |
| 197 | last_stand_maneuver | Last Stand Maneuver | Maneuver | 4 | 0/0 | aggro |  |
| 198 | full_alpha_strike | Full Alpha Strike | Maneuver | 5 | 0/0 | aggro | alpha_strike |
| 199 | battle_warp | Battle Warp | Maneuver | 5 | 0/0 | control | reactive |
| 200 | heroic_dive | Heroic Dive | Maneuver | 5 | 0/0 | control |  |
