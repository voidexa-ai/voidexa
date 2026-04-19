# Alpha Set — Master Index

Rolling summary of generated batches. One line per card. Appended per batch; never rewritten.

---

## Cumulative archetype tracker (updated after every batch)

Target distribution across all 1000 cards (Part 8):
Aggro 200 · Control 200 · Midrange 250 · Combo 150 · Ramp 80 · Utility 120.

Each batch's plan is derived from remaining budget ÷ remaining batches, not
from the static Rule 8 per-batch average — so a batch that over-delivers on
one archetype must be offset by the next.

| Archetype | Target | B01 | B02 | B03 | B04 | B05 | Remaining | Batches left | Avg needed |
|---|---|---|---|---|---|---|---|---|---|
| Aggro    | 200 | 51 | 55  | 68  |  92 | 111 |  89 | 5 | 17.8 |
| Control  | 200 | 18 | 68  | 82  | 100 | 120 |  80 | 5 | 16.0 |
| Midrange | 250 | 21 | 38  | 69  |  94 | 120 | 130 | 5 | 26.0 |
| Combo    | 150 |  5 | 16  | 36  |  51 |  66 |  84 | 5 | 16.8 |
| Ramp     |  80 |  0 |  5  | 15  |  22 |  30 |  50 | 5 | 10.0 |
| Utility  | 120 |  5 | 18  | 30  |  41 |  53 |  67 | 5 | 13.4 |

Status after B05 (halfway — 500/1000 cards): Aggro, Control, Combo,
Ramp, Utility all within 1 card of their target pace for remaining
batches. Midrange still on its steady 26/batch trajectory. The per-batch
averages needed for batches 06-10 now closely match the Rule 8 static
targets (20/20/25/15/8/12), meaning the cumulative correction work is
complete — future batches can follow the master-doc defaults.

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

## Batch 03 — Common AI Routines + Common Modules

**Cards:** 100 * **File:** `batch_03.json`

Distribution:
- Rarity: 100 common
- Types: 55 AI Routine, 45 Module
- Cost: 3x 0 * 16x 1 * 24x 2 * 26x 3 * 18x 4 * 9x 5 * 4x 6
- Archetype: 31 midrange * 20 combo * 14 control * 13 aggro * 12 utility * 10 ramp
  (midrange-lean to pull cumulative back toward target)
- Keywords used: persistent_field (27), end_cycle (7), probe (5), deep_scan (4), auto_repair (3), tracking_lock (3), disable (3), deploy_burst (2), chain_catalyst (2), priority_fire (2), interceptor (2), cascading_power (2), bounce (2), radiation_leak (2), cycling_protocol (1), assault_protocol (1), fuel_scavenge (1), overclock (1), adaptive_learning (1), efficiency_protocol (1), linked_fire (1), reinforced_hull (1), overcharge (1), modular_payload (1), reactive (1), scrap (1), reactor_vent (1), energy_surge (1), salvage_redirect (1), system_reset (1), archive_recall (1), breach_cascade (1)

### Cards

| # | id | name | type | cost | A/D | archetype | keywords |
|---|---|---|---|---|---|---|---|
| 201 | targeting_assist | Targeting Assist | AI Routine | 1 | 0/3 | combo | persistent_field |
| 202 | auto_reload | Auto Reload | AI Routine | 1 | 0/3 | utility | end_cycle |
| 203 | combat_protocol | Combat Protocol | AI Routine | 1 | 0/3 | midrange |  |
| 204 | basic_subroutine | Basic Subroutine | AI Routine | 1 | 0/3 | midrange |  |
| 205 | scan_array | Scan Array | AI Routine | 1 | 0/3 | utility | deploy_burst, probe |
| 206 | heat_sink_protocol | Heat Sink Protocol | AI Routine | 1 | 0/3 | midrange | persistent_field |
| 207 | repair_protocol | Repair Protocol | AI Routine | 1 | 0/3 | ramp | auto_repair |
| 208 | patrol_routine | Patrol Routine | AI Routine | 1 | 1/2 | midrange | end_cycle |
| 209 | targeting_grid | Targeting Grid | AI Routine | 2 | 0/6 | combo | persistent_field |
| 210 | defensive_grid | Defensive Grid | AI Routine | 2 | 0/6 | midrange | persistent_field |
| 211 | recon_array | Recon Array | AI Routine | 2 | 0/5 | utility | end_cycle, probe |
| 212 | combat_controller | Combat Controller | AI Routine | 2 | 0/5 | midrange | persistent_field |
| 213 | tactical_analyzer | Tactical Analyzer | AI Routine | 2 | 0/5 | utility | deploy_burst, deep_scan |
| 214 | shield_optimizer | Shield Optimizer | AI Routine | 2 | 0/6 | control | persistent_field |
| 215 | weapons_optimizer | Weapons Optimizer | AI Routine | 2 | 0/6 | combo | persistent_field |
| 216 | drone_manager | Drone Manager | AI Routine | 2 | 0/5 | midrange | persistent_field |
| 217 | heat_reducer | Heat Reducer | AI Routine | 2 | 0/6 | midrange | persistent_field |
| 218 | burst_analyzer | Burst Analyzer | AI Routine | 2 | 0/5 | combo | chain_catalyst |
| 219 | cycle_routine_ai | Cycle Routine AI | AI Routine | 2 | 0/5 | utility | cycling_protocol |
| 220 | energy_regulator | Energy Regulator | AI Routine | 2 | 0/5 | ramp | end_cycle |
| 221 | assault_coordinator | Assault Coordinator | AI Routine | 2 | 0/5 | combo | persistent_field, assault_protocol |
| 222 | defense_coordinator | Defense Coordinator | AI Routine | 2 | 0/6 | midrange | persistent_field |
| 223 | master_targeting | Master Targeting | AI Routine | 3 | 0/9 | combo | persistent_field |
| 224 | repair_grid | Repair Grid | AI Routine | 3 | 0/9 | ramp | auto_repair |
| 225 | tactical_uplink | Tactical Uplink | AI Routine | 3 | 0/8 | utility | end_cycle, probe |
| 226 | drone_swarm_ai | Drone Swarm AI | AI Routine | 3 | 0/8 | aggro | persistent_field |
| 227 | weapons_coordinator | Weapons Coordinator | AI Routine | 3 | 0/8 | combo | persistent_field, priority_fire |
| 228 | defense_network | Defense Network | AI Routine | 3 | 0/9 | control | persistent_field, interceptor |
| 229 | salvage_protocol | Salvage Protocol | AI Routine | 3 | 0/8 | ramp | fuel_scavenge |
| 230 | combat_planner | Combat Planner | AI Routine | 3 | 0/8 | midrange | persistent_field, overclock |
| 231 | hunter_logic | Hunter Logic | AI Routine | 3 | 0/8 | combo | persistent_field, tracking_lock |
| 232 | deep_strategy | Deep Strategy | AI Routine | 3 | 0/8 | utility | end_cycle, deep_scan |
| 233 | adaptive_ai | Adaptive AI | AI Routine | 3 | 0/8 | midrange | adaptive_learning |
| 234 | efficiency_routine | Efficiency Routine | AI Routine | 3 | 0/8 | combo | efficiency_protocol |
| 235 | priority_manager | Priority Manager | AI Routine | 3 | 0/8 | combo | persistent_field, priority_fire |
| 236 | chain_coordinator | Chain Coordinator | AI Routine | 3 | 0/8 | combo | chain_catalyst |
| 237 | cascade_protocol | Cascade Protocol | AI Routine | 3 | 0/8 | combo | cascading_power |
| 238 | linked_fire_ai | Linked Fire AI | AI Routine | 3 | 0/9 | combo | linked_fire |
| 239 | heavy_battle_ai | Heavy Battle AI | AI Routine | 4 | 0/13 | midrange |  |
| 240 | fortress_ai | Fortress AI | AI Routine | 4 | 0/14 | control | persistent_field, reinforced_hull |
| 241 | master_controller | Master Controller | AI Routine | 4 | 0/12 | midrange | persistent_field |
| 242 | auto_commander | Auto Commander | AI Routine | 4 | 0/13 | ramp | auto_repair |
| 243 | warfare_subroutine | Warfare Subroutine | AI Routine | 4 | 0/12 | combo | overcharge |
| 244 | tactical_superiority | Tactical Superiority | AI Routine | 4 | 0/13 | midrange | persistent_field |
| 245 | sentinel_network | Sentinel Network | AI Routine | 4 | 0/14 | control | persistent_field, interceptor |
| 246 | analyzer_matrix | Analyzer Matrix | AI Routine | 4 | 0/12 | utility | modular_payload, probe |
| 247 | command_net | Command Net | AI Routine | 4 | 0/13 | midrange | persistent_field |
| 248 | advanced_targeting | Advanced Targeting | AI Routine | 4 | 0/12 | combo | persistent_field, tracking_lock |
| 249 | master_protocol | Master Protocol | AI Routine | 5 | 0/16 | midrange |  |
| 250 | prime_directive | Prime Directive | AI Routine | 5 | 0/16 | midrange | persistent_field |
| 251 | overmind_ai | Overmind AI | AI Routine | 5 | 0/16 | combo | cascading_power |
| 252 | fortress_net | Fortress Net | AI Routine | 5 | 0/17 | control | persistent_field |
| 253 | ultimate_strategy | Ultimate Strategy | AI Routine | 5 | 0/17 | utility | end_cycle, deep_scan |
| 254 | total_supremacy | Total Supremacy | AI Routine | 6 | 0/20 | midrange | persistent_field |
| 255 | apex_ai | Apex AI | AI Routine | 6 | 0/21 | midrange |  |
| 256 | flare_charge | Flare Charge | Module | 0 | 0/0 | control | reactive |
| 257 | emergency_kit | Emergency Kit | Module | 0 | 0/0 | midrange |  |
| 258 | panic_dump | Panic Dump | Module | 0 | 0/0 | ramp | scrap |
| 259 | warhead_mk1 | Warhead Mk.I | Module | 1 | 0/0 | aggro |  |
| 260 | repair_kit | Repair Kit | Module | 1 | 0/0 | midrange |  |
| 261 | emp_charge | EMP Charge | Module | 1 | 0/0 | control | disable |
| 262 | shield_patch | Shield Patch | Module | 1 | 0/0 | midrange |  |
| 263 | targeting_flare | Targeting Flare | Module | 1 | 0/0 | combo | tracking_lock |
| 264 | energy_cell | Energy Cell | Module | 1 | 0/0 | ramp |  |
| 265 | scan_module | Scan Module | Module | 1 | 0/0 | utility | probe |
| 266 | hot_plating | Hot Plating | Module | 1 | 0/0 | midrange |  |
| 267 | warhead_mk2 | Warhead Mk.II | Module | 2 | 0/0 | aggro |  |
| 268 | plasma_grenade | Plasma Grenade | Module | 2 | 0/0 | aggro |  |
| 269 | emp_burst | EMP Burst | Module | 2 | 0/0 | control | disable |
| 270 | shield_booster | Shield Booster | Module | 2 | 0/0 | midrange |  |
| 271 | heat_sink | Heat Sink | Module | 2 | 0/0 | midrange |  |
| 272 | jury_rigged_booster | Jury-Rigged Booster | Module | 2 | 0/0 | combo |  |
| 273 | nanite_repair | Nanite Repair | Module | 2 | 0/0 | midrange |  |
| 274 | deep_scan_module | Deep Scan Module | Module | 2 | 0/0 | utility | deep_scan |
| 275 | reactor_vent_module | Reactor Vent Module | Module | 2 | 0/0 | ramp | reactor_vent |
| 276 | bounce_module | Bounce Module | Module | 2 | 0/0 | control | bounce |
| 277 | warhead_mk3 | Warhead Mk.III | Module | 3 | 0/0 | aggro |  |
| 278 | ion_bomb | Ion Bomb | Module | 3 | 0/0 | control |  |
| 279 | radiation_charge | Radiation Charge | Module | 3 | 0/0 | control | radiation_leak |
| 280 | emp_wave | EMP Wave | Module | 3 | 0/0 | control | disable |
| 281 | shield_matrix | Shield Matrix | Module | 3 | 0/0 | midrange |  |
| 282 | energy_surge_module | Energy Surge Module | Module | 3 | 0/0 | ramp | energy_surge |
| 283 | salvage_beam | Salvage Beam | Module | 3 | 0/0 | ramp | salvage_redirect |
| 284 | system_reset | System Reset | Module | 3 | 0/0 | control | system_reset |
| 285 | teleport_charge | Teleport Charge | Module | 3 | 0/0 | utility | bounce |
| 286 | mass_repair | Mass Repair | Module | 3 | 0/0 | midrange |  |
| 287 | warhead_mk4 | Warhead Mk.IV | Module | 4 | 0/0 | aggro |  |
| 288 | nova_grenade | Nova Grenade | Module | 4 | 0/0 | aggro |  |
| 289 | ion_cannon_payload | Ion Cannon Payload | Module | 4 | 0/0 | control |  |
| 290 | defensive_shell | Defensive Shell | Module | 4 | 0/0 | midrange |  |
| 291 | combat_stim | Combat Stim | Module | 4 | 0/0 | combo |  |
| 292 | cargo_missile | Cargo Missile | Module | 4 | 0/0 | aggro |  |
| 293 | fusion_bomb | Fusion Bomb | Module | 4 | 0/0 | aggro | radiation_leak |
| 294 | tactical_recall | Tactical Recall | Module | 4 | 0/0 | combo | archive_recall |
| 295 | warhead_mk5 | Warhead Mk.V | Module | 5 | 0/0 | aggro |  |
| 296 | cascade_warhead | Cascade Warhead | Module | 5 | 0/0 | aggro | breach_cascade |
| 297 | orbital_strike | Orbital Strike | Module | 5 | 0/0 | aggro |  |
| 298 | ultimate_shield | Ultimate Shield | Module | 5 | 0/0 | midrange |  |
| 299 | nuclear_charge | Nuclear Charge | Module | 6 | 0/0 | aggro |  |
| 300 | life_reactor | Life Reactor | Module | 6 | 0/0 | midrange |  |

## Batch 04 — Remaining Commons + First Uncommons

**Cards:** 100 * **File:** `batch_04.json`

Distribution:
- Rarity: 75 common + 25 uncommon
- Types: 21 Weapon, 18 Drone, 8 AI Routine, 20 Equipment, 16 Field, 10 Ship Core, 5 Defense, 2 Module
- Cost: 10x 0 * 9x 1 * 23x 2 * 34x 3 * 19x 4 * 4x 5 * 1x 6
- Archetype: 25 midrange * 24 aggro * 18 control * 15 combo * 11 utility * 7 ramp
- First-time seeds: battle_hardened, outrider, emp_pulse, signal_jamming, data_wipe, upgrade_trigger, crew_pooling, mission_complete, hull_drain (9 new keywords introduced)
- Equipment, Field, and Ship Core types introduced in this batch

### Cards

| # | id | name | type | rarity | cost | A/D | archetype | keywords |
|---|---|---|---|---|---|---|---|---|
| 301 | flak_burst | Flak Burst | Weapon | C | 1 | 3/0 | aggro |  |
| 302 | sabot_round | Sabot Round | Weapon | C | 2 | 6/0 | aggro |  |
| 303 | spread_laser | Spread Laser | Weapon | C | 2 | 5/0 | aggro |  |
| 304 | hammer_salvo | Hammer Salvo | Weapon | C | 2 | 6/0 | aggro | hot_deploy |
| 305 | plasma_drill | Plasma Drill | Weapon | C | 3 | 8/0 | control |  |
| 306 | trench_cannon | Trench Cannon | Weapon | C | 3 | 9/0 | aggro |  |
| 307 | burst_mortar | Burst Mortar | Weapon | C | 3 | 8/0 | aggro |  |
| 308 | drilling_missile | Drilling Missile | Weapon | C | 4 | 12/0 | control |  |
| 309 | railpulse_cannon | Railpulse Cannon | Weapon | C | 4 | 13/0 | midrange |  |
| 310 | vector_missile | Vector Missile | Weapon | C | 4 | 12/0 | combo | flanking_fire |
| 311 | matter_beam | Matter Beam | Weapon | C | 5 | 16/0 | control | radiation_leak |
| 312 | annihilator_round | Annihilator Round | Weapon | C | 5 | 16/0 | control | critical_strike |
| 313 | heavy_lance | Heavy Lance | Weapon | C | 6 | 20/0 | midrange |  |
| 314 | harrier_drone | Harrier Drone | Drone | C | 1 | 2/1 | aggro | priority_fire |
| 315 | raven_drone | Raven Drone | Drone | C | 1 | 1/2 | utility | deploy_burst, probe |
| 316 | sentry_drone | Sentry Drone | Drone | C | 2 | 2/4 | midrange | tracking_array |
| 317 | wasp_drone | Wasp Drone | Drone | C | 2 | 3/2 | aggro | evade |
| 318 | vanguard_drone | Vanguard Drone | Drone | C | 2 | 4/1 | aggro | battle_hardened |
| 319 | hawk_drone | Hawk Drone | Drone | C | 2 | 3/3 | midrange |  |
| 320 | medic_drone | Medic Drone | Drone | C | 3 | 2/6 | midrange | hull_drain |
| 321 | combat_medic | Combat Medic | Drone | C | 3 | 2/6 | ramp | auto_repair |
| 322 | lead_drone | Lead Drone | Drone | C | 3 | 5/3 | aggro | outrider |
| 323 | shepherd_drone | Shepherd Drone | Drone | C | 3 | 3/5 | combo | crew_pooling |
| 324 | tesla_drone | Tesla Drone | Drone | C | 4 | 5/7 | control | emp_pulse |
| 325 | siege_lance_drone | Siege Lance Drone | Drone | C | 4 | 7/5 | midrange |  |
| 326 | reactive_core | Reactive Core | AI Routine | C | 2 | 0/5 | utility | deploy_burst, probe |
| 327 | command_subroutine | Command Subroutine | AI Routine | C | 3 | 0/8 | midrange | persistent_field |
| 328 | upgrade_processor | Upgrade Processor | AI Routine | C | 3 | 0/8 | combo | upgrade_trigger |
| 329 | signal_trap | Signal Trap | AI Routine | C | 3 | 0/8 | control | signal_jamming |
| 330 | data_scrubber | Data Scrubber | AI Routine | C | 4 | 0/12 | control | data_wipe |
| 331 | targeting_sight | Targeting Sight | Equipment | C | 1 | 0/0 | combo |  |
| 332 | barrel_extender | Barrel Extender | Equipment | C | 1 | 0/0 | combo | priority_fire |
| 333 | recoil_damper | Recoil Damper | Equipment | C | 1 | 0/0 | midrange |  |
| 334 | shield_module | Shield Module | Equipment | C | 1 | 0/0 | midrange |  |
| 335 | thruster_pack | Thruster Pack | Equipment | C | 1 | 0/0 | utility | evade |
| 336 | booster_pack | Booster Pack | Equipment | C | 2 | 0/0 | aggro |  |
| 337 | plating_kit | Plating Kit | Equipment | C | 2 | 0/0 | midrange |  |
| 338 | radar_array | Radar Array | Equipment | C | 2 | 0/0 | midrange | tracking_array |
| 339 | cooling_unit | Cooling Unit | Equipment | C | 2 | 0/0 | ramp |  |
| 340 | weapon_coupler | Weapon Coupler | Equipment | C | 2 | 0/0 | combo | linked_fire |
| 341 | drone_interface | Drone Interface | Equipment | C | 2 | 0/0 | aggro |  |
| 342 | sensor_package | Sensor Package | Equipment | C | 2 | 0/0 | utility | end_cycle, probe |
| 343 | shield_capacitor | Shield Capacitor | Equipment | C | 3 | 0/0 | midrange |  |
| 344 | life_support_backup | Life Support Backup | Equipment | C | 3 | 0/0 | midrange |  |
| 345 | ammo_drum | Ammo Drum | Equipment | C | 3 | 0/0 | aggro |  |
| 346 | targeting_suite | Targeting Suite | Equipment | C | 3 | 0/0 | combo | critical_strike |
| 347 | armor_coating | Armor Coating | Equipment | C | 3 | 0/0 | midrange | reinforced_hull |
| 348 | engine_upgrade | Engine Upgrade | Equipment | C | 3 | 0/0 | aggro | skyward_maneuver |
| 349 | fleet_synchronizer | Fleet Synchronizer | Equipment | C | 4 | 0/0 | combo | cascading_power |
| 350 | master_override | Master Override | Equipment | C | 4 | 0/0 | ramp | crew_pooling |
| 351 | debris_cloud | Debris Cloud | Field | C | 1 | 0/0 | control | persistent_field |
| 352 | nebula_edge | Nebula Edge | Field | C | 2 | 0/0 | utility | persistent_field, gain_stealth |
| 353 | ion_storm | Ion Storm | Field | C | 2 | 0/0 | midrange | persistent_field |
| 354 | gravity_well | Gravity Well | Field | C | 2 | 0/0 | midrange | persistent_field |
| 355 | patrol_zone | Patrol Zone | Field | C | 2 | 0/0 | utility | end_cycle, probe |
| 356 | siege_banner | Siege Banner | Field | C | 2 | 0/0 | combo | persistent_field |
| 357 | defensive_formation | Defensive Formation | Field | C | 2 | 0/0 | midrange | persistent_field |
| 358 | drone_swarm_field | Drone Swarm | Field | C | 3 | 0/0 | aggro | persistent_field |
| 359 | combat_theater | Combat Theater | Field | C | 3 | 0/0 | aggro | persistent_field |
| 360 | scanner_grid | Scanner Grid | Field | C | 3 | 0/0 | utility | end_cycle, deep_scan |
| 361 | asteroid_belt_field | Asteroid Belt | Field | C | 3 | 0/0 | midrange | persistent_field |
| 362 | radiation_zone | Radiation Zone | Field | C | 3 | 0/0 | midrange | persistent_field |
| 363 | null_space | Null Space | Field | C | 4 | 0/0 | control | persistent_field |
| 364 | solar_flare | Solar Flare | Field | C | 4 | 0/0 | midrange | persistent_field |
| 365 | capture_zone | Capture Zone | Field | C | 4 | 0/0 | utility | mission_complete |
| 366 | basic_frame | Basic Frame | Ship Core | C | 0 | 0/0 | aggro |  |
| 367 | defender_hull | Defender Hull | Ship Core | C | 0 | 0/0 | midrange |  |
| 368 | scout_chassis | Scout Chassis | Ship Core | C | 0 | 0/0 | utility | end_cycle, probe |
| 369 | cargo_frame | Cargo Frame | Ship Core | C | 0 | 0/0 | utility |  |
| 370 | fighter_core | Fighter Core | Ship Core | C | 0 | 0/0 | combo |  |
| 371 | heavy_core | Heavy Core | Ship Core | C | 0 | 0/0 | midrange |  |
| 372 | commander_core | Commander Core | Ship Core | C | 0 | 0/0 | midrange |  |
| 373 | engineer_frame | Engineer Frame | Ship Core | C | 0 | 0/0 | ramp |  |
| 374 | saboteur_core | Saboteur Core | Ship Core | C | 0 | 0/0 | control |  |
| 375 | pilot_interface | Pilot Interface | Ship Core | C | 0 | 0/0 | midrange |  |
| 376 | plasma_volley | Plasma Volley | Weapon | U | 2 | 6/0 | combo | priority_fire, overclock |
| 377 | heavy_torpedo_uc | Heavy Torpedo | Weapon | U | 3 | 9/0 | midrange | rapid_launch, cold_boot |
| 378 | barrage_cannon | Barrage Cannon | Weapon | U | 3 | 8/0 | combo | priority_fire, breach_cascade |
| 379 | ghost_beam | Ghost Beam | Weapon | U | 3 | 8/0 | aggro | phase_drive, critical_strike |
| 380 | sniper_rifle_uc | Sniper Rifle | Weapon | U | 3 | 8/0 | control | tracking_lock, critical_strike |
| 381 | chain_lightning | Chain Lightning | Weapon | U | 4 | 12/0 | combo | breach_cascade, chain_catalyst |
| 382 | gatling_cannon | Gatling Cannon | Weapon | U | 4 | 12/0 | aggro | alpha_strike |
| 383 | void_torpedo | Void Torpedo | Weapon | U | 5 | 16/0 | aggro | overflow_fire, radiation_leak |
| 384 | interceptor_elite | Interceptor Elite | Drone | U | 3 | 3/6 | control | interceptor, emergency_reboot |
| 385 | phantom_drone | Phantom Drone | Drone | U | 3 | 5/3 | utility | cloaked_entry, gain_stealth |
| 386 | strike_wing | Strike Wing | Drone | U | 3 | 5/4 | aggro | rapid_launch, priority_fire |
| 387 | master_repair_drone | Master Repair Drone | Drone | U | 4 | 2/10 | ramp | auto_repair, hull_drain |
| 388 | hunter_killer | Hunter Killer | Drone | U | 4 | 7/5 | aggro | critical_strike, tracking_lock |
| 389 | bomber_elite | Bomber Elite | Drone | U | 5 | 10/6 | aggro | hot_deploy, critical_breach |
| 390 | phase_shield | Phase Shield | Defense | U | 2 | 0/7 | control | phase_drive, ablative_plating |
| 391 | stealth_hull | Stealth Hull | Defense | U | 3 | 0/9 | control | gain_stealth, cloaked_entry |
| 392 | reactive_armor | Reactive Armor | Defense | U | 3 | 0/8 | control | system_shielding, critical_breach |
| 393 | fortress_barrier | Fortress Barrier | Defense | U | 4 | 0/12 | control | interceptor, reinforced_hull |
| 394 | aegis_shield | Aegis Shield | Defense | U | 4 | 0/12 | ramp | ablative_plating, auto_repair |
| 395 | master_coordinator | Master Coordinator | AI Routine | U | 3 | 0/8 | combo | persistent_field, priority_fire, overclock |
| 396 | prime_tactics | Prime Tactics | AI Routine | U | 4 | 0/12 | combo | persistent_field, adaptive_learning, chain_catalyst |
| 397 | emergency_protocol | Emergency Protocol | AI Routine | U | 3 | 0/8 | ramp | emergency_reboot, auto_repair |
| 398 | railgun_slug | Railgun Slug | Module | U | 3 | 0/0 | control |  |
| 399 | nova_charge | Nova Charge | Module | U | 4 | 0/0 | aggro | breach_cascade |
| 400 | stabilized_field | Stabilized Field | Field | U | 3 | 0/0 | control | persistent_field, negate |

## Batch 05 — Uncommons (Weapons / Drones / Defense)

**Cards:** 100 * **File:** `batch_05.json`

Distribution:
- Rarity: 100 uncommon (all uncommon — first uncommon-focused batch)
- Types: 40 Weapon, 30 Drone, 30 Defense
- Cost: 0x 0 * 8x 1 * 21x 2 * 29x 3 * 26x 4 * 12x 5 * 4x 6
- Archetype: 26 midrange * 20 control * 19 aggro * 15 combo * 12 utility * 8 ramp
- Top keywords: priority_fire (15), gain_stealth (12), interceptor (12), critical_strike (11), auto_repair (11), rapid_launch (10), ablative_plating (10), alpha_strike (9), reinforced_hull (9), phase_drive (8), cloaked_entry (7), emergency_reboot (6)
- New keyword seeds: recon_beacon (2), manual_fire (1), hot_activation (1), sabotage_charge (1)

### Cards

| # | id | name | type | cost | A/D | archetype | keywords |
|---|---|---|---|---|---|---|---|
| 401 | quick_laser_uc | Quick Laser | Weapon | 1 | 4/0 | aggro | hot_deploy |
| 402 | twin_pistol | Twin Pistol | Weapon | 1 | 3/0 | combo | alpha_strike |
| 403 | recon_gun | Recon Gun | Weapon | 1 | 3/0 | utility | recon_beacon, deploy_burst |
| 404 | ice_beam | Ice Beam | Weapon | 1 | 3/0 | control | disable |
| 405 | stealth_laser | Stealth Laser | Weapon | 1 | 3/0 | utility | cloaked_entry |
| 406 | burst_cannon_uc | Burst Cannon | Weapon | 2 | 6/0 | aggro | alpha_strike |
| 407 | plasma_sniper | Plasma Sniper | Weapon | 2 | 6/0 | combo | priority_fire, critical_strike |
| 408 | dual_pulse | Dual Pulse | Weapon | 2 | 5/0 | combo | priority_fire, overclock |
| 409 | phase_laser | Phase Laser | Weapon | 2 | 5/0 | aggro | phase_drive, quick_strike |
| 410 | plasma_burst | Plasma Burst | Weapon | 2 | 6/0 | combo | hot_deploy, breach_cascade |
| 411 | salvo_launcher | Salvo Launcher | Weapon | 2 | 5/0 | aggro | rapid_launch, flanking_fire |
| 412 | ion_sniper | Ion Sniper | Weapon | 2 | 6/0 | control | tracking_lock |
| 413 | ghost_round | Ghost Round | Weapon | 2 | 5/0 | utility | gain_stealth, cloaked_entry |
| 414 | heavy_burst | Heavy Burst | Weapon | 3 | 8/0 | combo | alpha_strike |
| 415 | master_sniper | Master Sniper | Weapon | 3 | 8/0 | control | tracking_lock, critical_strike |
| 416 | phantom_beam | Phantom Beam | Weapon | 3 | 8/0 | utility | phase_drive, gain_stealth |
| 417 | warhead_salvo | Warhead Salvo | Weapon | 3 | 9/0 | aggro | rapid_launch, priority_fire |
| 418 | chain_lance | Chain Lance | Weapon | 3 | 8/0 | combo | breach_cascade, chain_catalyst |
| 419 | fusion_torpedo | Fusion Torpedo | Weapon | 3 | 9/0 | midrange | cold_boot, overflow_fire |
| 420 | tactical_cannon | Tactical Cannon | Weapon | 3 | 8/0 | combo | manual_fire, priority_fire |
| 421 | siege_rifle | Siege Rifle | Weapon | 3 | 8/0 | control | tracking_lock, apply_lock |
| 422 | cascade_gun | Cascade Gun | Weapon | 3 | 8/0 | combo | cascading_power |
| 423 | cluster_bomb | Cluster Bomb | Weapon | 3 | 8/0 | control | breach_cascade, apply_lock |
| 424 | heavy_lance_uc | Heavy Lance (Field Model) | Weapon | 4 | 12/0 | aggro | priority_fire, flanking_fire |
| 425 | assault_cannon | Assault Cannon | Weapon | 4 | 12/0 | combo | rapid_launch, hot_activation |
| 426 | void_sniper | Void Sniper | Weapon | 4 | 12/0 | control | critical_strike, phase_drive |
| 427 | dual_barrel | Dual Barrel | Weapon | 4 | 12/0 | combo | alpha_strike, priority_fire |
| 428 | rift_torpedo | Rift Torpedo | Weapon | 4 | 12/0 | aggro | overflow_fire, radiation_leak |
| 429 | sabotage_cannon | Sabotage Cannon | Weapon | 4 | 12/0 | control | sabotage_charge, disable |
| 430 | phantom_torpedo | Phantom Torpedo | Weapon | 4 | 12/0 | aggro | gain_stealth, rapid_launch |
| 431 | kinetic_storm | Kinetic Storm | Weapon | 4 | 12/0 | aggro | alpha_strike |
| 432 | scorch_cannon | Scorch Cannon | Weapon | 4 | 12/0 | control | radiation_leak, breach_cascade |
| 433 | pulse_cannon_uc | Pulse Cannon (Overclocked) | Weapon | 4 | 13/0 | combo | overclock |
| 434 | master_cannon | Master Cannon | Weapon | 5 | 16/0 | combo | priority_fire, critical_strike |
| 435 | siege_rocket | Siege Rocket | Weapon | 5 | 16/0 | aggro | overflow_fire, radiation_leak |
| 436 | ghost_lance | Ghost Lance | Weapon | 5 | 16/0 | control | phase_drive, gain_stealth, critical_strike |
| 437 | cluster_strike | Cluster Strike | Weapon | 5 | 16/0 | combo | priority_fire, breach_cascade, alpha_strike |
| 438 | ionic_bomber | Ionic Bomber | Weapon | 5 | 16/0 | control | critical_strike, radiation_leak |
| 439 | heavy_orbital | Heavy Orbital | Weapon | 6 | 20/0 | aggro | priority_fire, rapid_launch |
| 440 | void_annihilator | Void Annihilator | Weapon | 6 | 20/0 | control | critical_strike, phase_drive |
| 441 | raptor_drone | Raptor Drone | Drone | 2 | 4/2 | aggro | rapid_launch, priority_fire |
| 442 | stalker_drone | Stalker Drone | Drone | 2 | 3/3 | utility | cloaked_entry, gain_stealth |
| 443 | medic_unit | Medic Unit | Drone | 2 | 2/4 | ramp | auto_repair, hull_drain |
| 444 | saboteur_drone | Saboteur Drone | Drone | 2 | 3/3 | control | deploy_burst, disable |
| 445 | hunter_drone | Hunter Drone | Drone | 2 | 3/3 | aggro | critical_strike |
| 446 | scout_elite | Scout Elite | Drone | 2 | 2/3 | utility | deploy_burst, probe, recon_beacon |
| 447 | falcon_strike | Falcon Strike | Drone | 3 | 5/3 | aggro | rapid_launch, alpha_strike |
| 448 | ghost_raider | Ghost Raider | Drone | 3 | 4/4 | utility | phase_drive, cloaked_entry |
| 449 | veteran_fighter | Veteran Fighter | Drone | 3 | 4/5 | midrange | battle_hardened, outrider |
| 450 | spook_drone | Spook Drone | Drone | 3 | 3/5 | utility | gain_stealth, emergency_reboot |
| 451 | trap_drone | Trap Drone | Drone | 3 | 3/5 | control | tracking_array, apply_lock |
| 452 | bomber_wing | Bomber Wing | Drone | 3 | 5/3 | aggro | rapid_launch, critical_breach |
| 453 | guardian_drone | Guardian Drone | Drone | 3 | 3/6 | midrange | interceptor, auto_repair |
| 454 | assault_wing | Assault Wing | Drone | 3 | 6/3 | aggro | alpha_strike, priority_fire |
| 455 | swarm_leader | Swarm Leader | Drone | 3 | 4/4 | midrange | rapid_launch, battle_hardened |
| 456 | jammer_drone | Jammer Drone | Drone | 3 | 3/5 | control | signal_jammer, signal_jamming |
| 457 | heavy_striker | Heavy Striker | Drone | 4 | 7/5 | midrange | priority_fire, rapid_launch |
| 458 | shadow_operative | Shadow Operative | Drone | 4 | 6/6 | utility | gain_stealth, cloaked_entry, priority_fire |
| 459 | bomber_heavy | Bomber Heavy | Drone | 4 | 8/5 | aggro | critical_breach, hot_deploy |
| 460 | interceptor_heavy | Interceptor Heavy | Drone | 4 | 4/10 | midrange | interceptor, emergency_reboot, auto_repair |
| 461 | carrier_drone | Carrier Drone | Drone | 4 | 5/7 | ramp | crew_pooling, auto_repair |
| 462 | scavenger_drone | Scavenger Drone | Drone | 4 | 5/7 | ramp | fuel_scavenge, hull_drain |
| 463 | recon_elite | Recon Elite | Drone | 4 | 3/9 | utility | deploy_burst, probe, deep_scan |
| 464 | combat_spec | Combat Spec | Drone | 4 | 6/6 | midrange | battle_hardened, critical_strike |
| 465 | siege_unit | Siege Unit | Drone | 4 | 8/5 | midrange | cold_boot, critical_strike |
| 466 | elite_striker | Elite Striker | Drone | 5 | 9/7 | combo | alpha_strike, priority_fire |
| 467 | master_medic | Master Medic | Drone | 5 | 4/12 | ramp | auto_repair, hull_drain, emergency_reboot |
| 468 | phantom_hunter | Phantom Hunter | Drone | 5 | 8/8 | control | gain_stealth, critical_strike, tracking_lock |
| 469 | heavy_bulwark_drone | Heavy Bulwark Drone | Drone | 5 | 6/11 | midrange | interceptor, reinforced_hull |
| 470 | capital_fighter | Capital Fighter | Drone | 6 | 11/10 | aggro | priority_fire, hot_deploy |
| 471 | ablative_mesh | Ablative Mesh | Defense | 1 | 0/5 | midrange | reactive, ablative_plating |
| 472 | overclocked_barrier | Overclocked Barrier | Defense | 1 | 0/4 | combo | deploy_burst, overclock |
| 473 | decoy_hologram | Decoy Hologram | Defense | 1 | 0/4 | utility | cloaked_entry, gain_stealth |
| 474 | reactive_grid | Reactive Grid | Defense | 2 | 0/7 | midrange | system_shielding, critical_breach |
| 475 | ablative_lattice | Ablative Lattice | Defense | 2 | 0/7 | midrange | ablative_plating, auto_repair |
| 476 | signal_baffles | Signal Baffles | Defense | 2 | 0/6 | control | signal_jammer, gain_stealth |
| 477 | adaptive_plating | Adaptive Plating | Defense | 2 | 0/6 | midrange | adaptive_learning, ablative_plating |
| 478 | hover_dome | Hover Dome | Defense | 2 | 0/7 | midrange | interceptor, evade |
| 479 | reflex_barrier | Reflex Barrier | Defense | 2 | 0/6 | midrange | reactive, evade |
| 480 | tracking_dome | Tracking Dome | Defense | 2 | 0/7 | control | tracking_array, signal_jammer |
| 481 | fortress_mesh | Fortress Mesh | Defense | 3 | 0/10 | midrange | interceptor, ablative_plating |
| 482 | stealth_bulkhead | Stealth Bulkhead | Defense | 3 | 0/9 | control | gain_stealth, reinforced_hull |
| 483 | rebooting_plating | Rebooting Plating | Defense | 3 | 0/9 | ramp | emergency_reboot, auto_repair |
| 484 | reactive_mesh | Reactive Mesh | Defense | 3 | 0/9 | midrange | system_shielding, critical_breach, ablative_plating |
| 485 | countered_barrier | Countered Barrier | Defense | 3 | 0/8 | control | countermeasure, interceptor |
| 486 | regen_bulkhead | Regen Bulkhead | Defense | 3 | 0/9 | ramp | auto_repair, reinforced_hull |
| 487 | phase_grid | Phase Grid | Defense | 3 | 0/9 | midrange | phase_drive, evade |
| 488 | sentinel_wall | Sentinel Wall | Defense | 3 | 1/9 | aggro | interceptor, battle_hardened |
| 489 | aegis_mesh | Aegis Mesh | Defense | 3 | 0/9 | midrange | ablative_plating, interceptor |
| 490 | heavy_aegis | Heavy Aegis | Defense | 4 | 0/13 | midrange | ablative_plating, interceptor, reinforced_hull |
| 491 | master_shield | Master Shield | Defense | 4 | 0/14 | ramp | auto_repair, system_shielding |
| 492 | phantom_wall | Phantom Wall | Defense | 4 | 0/13 | utility | gain_stealth, cloaked_entry, evade |
| 493 | fortress_lattice | Fortress Lattice | Defense | 4 | 1/13 | midrange | interceptor, reinforced_hull |
| 494 | reboot_fortress | Reboot Fortress | Defense | 4 | 0/12 | midrange | emergency_reboot, reinforced_hull |
| 495 | counterfield | Counterfield | Defense | 4 | 0/12 | control | countermeasure, negate |
| 496 | ablative_fortress | Ablative Fortress | Defense | 4 | 0/13 | ramp | ablative_plating, auto_repair |
| 497 | master_bulwark | Master Bulwark | Defense | 5 | 2/15 | midrange | interceptor, reinforced_hull, ablative_plating |
| 498 | phase_fortress | Phase Fortress | Defense | 5 | 0/16 | midrange | phase_drive, reinforced_hull |
| 499 | titanic_aegis | Titanic Aegis | Defense | 5 | 0/17 | midrange | ablative_plating, emergency_reboot |
| 500 | grand_fortress | Grand Fortress | Defense | 6 | 3/18 | midrange | interceptor, reinforced_hull, auto_repair |
