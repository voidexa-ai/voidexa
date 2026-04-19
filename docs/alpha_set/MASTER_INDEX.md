# Alpha Set — Master Index

Rolling summary of generated batches. One line per card. Appended per batch; never rewritten.

---

## Cumulative archetype tracker (updated after every batch)

Target distribution across all 1000 cards (Part 8):
Aggro 200 · Control 200 · Midrange 250 · Combo 150 · Ramp 80 · Utility 120.

Each batch's plan is derived from remaining budget ÷ remaining batches, not
from the static Rule 8 per-batch average — so a batch that over-delivers on
one archetype must be offset by the next.

| Archetype | Target | B01 | B02 | B03 | B04 | B05 | B06 | B07 | B08 | B09 | Remaining | Batches left | Avg needed |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Aggro    | 200 | 51 | 55  | 68  |  92 | 111 | 127 | 145 | 163 | 179 |  21 | 1 | 21.0 |
| Control  | 200 | 18 | 68  | 82  | 100 | 120 | 143 | 156 | 172 | 187 |  13 | 1 | 13.0 |
| Midrange | 250 | 21 | 38  | 69  |  94 | 120 | 142 | 169 | 196 | 223 |  27 | 1 | 27.0 |
| Combo    | 150 |  5 | 16  | 36  |  51 |  66 |  86 | 104 | 123 | 137 |  13 | 1 | 13.0 |
| Ramp     |  80 |  0 |  5  | 15  |  22 |  30 |  39 |  51 |  60 |  72 |   8 | 1 |  8.0 |
| Utility  | 120 |  5 | 18  | 30  |  41 |  53 |  63 |  75 |  86 | 102 |  18 | 1 | 18.0 |

Status after B09 (900/1000 cards): Final batch (B10) targets are
locked in. Mythics + dual-identity/escalation/sacrifice cards need:
21 aggro / 13 control / 27 midrange / 13 combo / 8 ramp / 18 utility.

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

## Batch 06 — Uncommons (AI / Modules / Maneuvers) + First Rares

**Cards:** 100 * **File:** `batch_06.json`

Distribution:
- Rarity: 70 uncommon + 30 rare (first rares of the set)
- Types: AI Routine 29 * Module 23 * Maneuver 22 * Weapon 8 * Drone 6 * Defense 5 * Equipment 4 * Field 3
- Cost: 3x 0 * 5x 1 * 18x 2 * 31x 3 * 23x 4 * 14x 5 * 6x 6
- Archetype: 22 midrange * 23 control * 20 combo * 16 aggro * 10 utility * 9 ramp
- New keyword first-seeds this batch: tactical_draw, tractor_beam_hold, hack_corrupt, transform_overhaul, power_surge, phantom_echo, system_corruption, ai_takeover, encryption_block (9 new niche keywords introduced via uncommon AI Routines, Modules, and Maneuvers)

### Cards

| # | id | name | type | rarity | cost | A/D | archetype | keywords |
|---|---|---|---|---|---|---|---|---|
| 501 | tactical_cpu | Tactical CPU | AI Routine | U | 2 | 0/5 | utility | persistent_field, end_cycle |
| 502 | relay_protocol | Relay Protocol | AI Routine | U | 2 | 0/6 | utility | persistent_field, end_cycle, probe |
| 503 | battle_uplink | Battle Uplink | AI Routine | U | 2 | 0/6 | midrange | persistent_field, priority_fire |
| 504 | shield_uplink | Shield Uplink | AI Routine | U | 2 | 0/6 | ramp | persistent_field, auto_repair |
| 505 | heat_coordinator | Heat Coordinator | AI Routine | U | 2 | 0/5 | combo | persistent_field, overclock |
| 506 | drone_sync | Drone Sync | AI Routine | U | 2 | 0/6 | aggro | persistent_field, rapid_launch |
| 507 | defense_uplink | Defense Uplink | AI Routine | U | 2 | 0/7 | midrange | persistent_field, interceptor |
| 508 | scan_subroutine | Scan Subroutine | AI Routine | U | 2 | 0/5 | utility | deploy_burst, deep_scan, probe |
| 509 | efficiency_cpu | Efficiency CPU | AI Routine | U | 3 | 0/8 | ramp | persistent_field, efficiency_protocol |
| 510 | command_network | Command Network | AI Routine | U | 3 | 0/9 | ramp | persistent_field, crew_pooling |
| 511 | tactical_predict | Tactical Predict | AI Routine | U | 3 | 0/8 | utility | end_cycle, tactical_draw |
| 512 | combat_matrix | Combat Matrix | AI Routine | U | 3 | 0/9 | combo | persistent_field, cascading_power |
| 513 | hack_subroutine | Hack Subroutine | AI Routine | U | 3 | 0/8 | control | hack_corrupt, disable |
| 514 | adaptive_matrix | Adaptive Matrix | AI Routine | U | 3 | 0/8 | ramp | adaptive_learning, auto_repair |
| 515 | siege_uplink | Siege Uplink | AI Routine | U | 3 | 0/9 | midrange | persistent_field, reinforced_hull, ablative_plating |
| 516 | sentinel_ai | Sentinel AI | AI Routine | U | 3 | 0/8 | midrange | persistent_field, interceptor, reinforced_hull |
| 517 | phantom_cpu | Phantom CPU | AI Routine | U | 3 | 0/8 | control | persistent_field, gain_stealth |
| 518 | tracking_matrix | Tracking Matrix | AI Routine | U | 3 | 0/9 | midrange | persistent_field, tracking_lock |
| 519 | fleet_commander | Fleet Commander | AI Routine | U | 4 | 0/12 | aggro | persistent_field, priority_fire, rapid_launch |
| 520 | overmind_protocol | Overmind Protocol | AI Routine | U | 4 | 0/13 | midrange | persistent_field, cascading_power, adaptive_learning |
| 521 | aegis_network | Aegis Network | AI Routine | U | 4 | 0/13 | midrange | persistent_field, interceptor, auto_repair |
| 522 | tactical_ai | Tactical AI | AI Routine | U | 4 | 0/12 | combo | persistent_field, chain_catalyst, linked_fire |
| 523 | ghost_network | Ghost Network | AI Routine | U | 4 | 0/12 | control | persistent_field, gain_stealth, cloaked_entry |
| 524 | battlefield_sync | Battlefield Sync | AI Routine | U | 5 | 0/16 | combo | persistent_field, priority_fire, overclock |
| 525 | supreme_protocol | Supreme Protocol | AI Routine | U | 5 | 0/17 | combo | persistent_field, cascading_power, efficiency_protocol |
| 526 | reactive_flare | Reactive Flare | Module | U | 0 | 0/0 | midrange | reactive |
| 527 | emergency_warp | Emergency Warp | Module | U | 0 | 0/0 | midrange |  |
| 528 | tactical_kit | Tactical Kit | Module | U | 1 | 0/0 | utility | probe |
| 529 | focus_module | Focus Module | Module | U | 1 | 0/0 | combo |  |
| 530 | warhead_mk6 | Warhead Mk.VI | Module | U | 2 | 0/0 | aggro |  |
| 531 | emp_grenade | EMP Grenade | Module | U | 2 | 0/0 | control | priority_fire, disable |
| 532 | salvage_kit | Salvage Kit | Module | U | 2 | 0/0 | ramp | scrap |
| 533 | shield_generator_uc | Shield Generator | Module | U | 2 | 0/0 | ramp | auto_repair |
| 534 | phase_module | Phase Module | Module | U | 3 | 0/0 | utility | phase_drive |
| 535 | disruption_bomb | Disruption Bomb | Module | U | 3 | 0/0 | control | signal_jamming, disable |
| 536 | repair_matrix | Repair Matrix | Module | U | 3 | 0/0 | ramp | auto_repair |
| 537 | warhead_mk7 | Warhead Mk.VII | Module | U | 3 | 0/0 | aggro | overflow_fire |
| 538 | tractor_beam | Tractor Beam | Module | U | 3 | 0/0 | control | tractor_beam_hold |
| 539 | ion_warhead | Ion Warhead | Module | U | 4 | 0/0 | midrange | disable |
| 540 | cargo_bomb | Cargo Bomb | Module | U | 4 | 0/0 | midrange |  |
| 541 | stasis_pod | Stasis Pod | Module | U | 4 | 0/0 | control | tractor_beam_hold, disable |
| 542 | nano_regeneration | Nano Regeneration | Module | U | 4 | 0/0 | ramp | auto_repair, emergency_reboot |
| 543 | plasma_detonator | Plasma Detonator | Module | U | 5 | 0/0 | aggro | breach_cascade |
| 544 | quantum_swap | Quantum Swap | Module | U | 5 | 0/0 | control | transform_overhaul |
| 545 | total_reset | Total Reset | Module | U | 5 | 0/0 | utility | system_reset, probe |
| 546 | quick_evade | Quick Evade | Maneuver | U | 0 | 0/0 | midrange | reactive |
| 547 | priority_snap | Priority Snap | Maneuver | U | 1 | 0/0 | combo | priority_fire |
| 548 | burst_boost | Burst Boost | Maneuver | U | 1 | 0/0 | combo |  |
| 549 | defensive_maneuver | Defensive Maneuver | Maneuver | U | 1 | 0/0 | midrange |  |
| 550 | sabotage_flare | Sabotage Flare | Maneuver | U | 2 | 0/0 | control | sabotage_charge |
| 551 | deep_scan_maneuver | Deep Scan | Maneuver | U | 2 | 0/0 | utility | probe, tactical_draw |
| 552 | phase_escape | Phase Escape | Maneuver | U | 2 | 0/0 | midrange | phase_drive, evade |
| 553 | tactical_strike | Tactical Strike | Maneuver | U | 2 | 0/0 | combo | priority_fire, alpha_strike |
| 554 | cloud_cover | Cloud Cover | Maneuver | U | 2 | 0/0 | control | gain_stealth |
| 555 | power_surge_maneuver | Power Surge | Maneuver | U | 3 | 0/0 | aggro | power_surge |
| 556 | emergency_launch | Emergency Launch | Maneuver | U | 3 | 0/0 | aggro | rapid_launch |
| 557 | all_out | All Out | Maneuver | U | 3 | 0/0 | aggro |  |
| 558 | phantom_strike | Phantom Strike | Maneuver | U | 3 | 0/0 | control | phantom_echo |
| 559 | system_corrupt | System Corrupt | Maneuver | U | 3 | 0/0 | control | system_corruption |
| 560 | ai_takeover | AI Takeover | Maneuver | U | 4 | 0/0 | control | ai_takeover |
| 561 | encryption_lock | Encryption Lock | Maneuver | U | 4 | 0/0 | control | encryption_block |
| 562 | data_corruption | Data Corruption | Maneuver | U | 4 | 0/0 | control | data_wipe, disable |
| 563 | grand_maneuver | Grand Maneuver | Maneuver | U | 4 | 0/0 | combo | reactive |
| 564 | heroic_charge | Heroic Charge | Maneuver | U | 5 | 0/0 | aggro | priority_fire |
| 565 | ultimate_defense | Ultimate Defense | Maneuver | U | 5 | 0/0 | control |  |
| 566 | barrel_extender_plus | Barrel Extender Plus | Equipment | U | 2 | 0/0 | combo | priority_fire, overclock |
| 567 | elite_plating | Elite Plating | Equipment | U | 3 | 0/0 | midrange | reinforced_hull |
| 568 | master_scope | Master Scope | Equipment | U | 3 | 0/0 | control | tracking_lock, critical_strike |
| 569 | warp_field | Warp Field | Field | U | 3 | 0/0 | midrange | persistent_field, phase_drive |
| 570 | quiet_zone | Quiet Zone | Field | U | 3 | 0/0 | control | persistent_field, signal_jamming |
| 571 | master_pulse | Master Pulse | Weapon | R | 3 | 9/0 | combo | priority_fire, alpha_strike, critical_strike |
| 572 | fusion_lancer | Fusion Lancer | Weapon | R | 4 | 12/0 | combo | priority_fire, phase_drive, critical_strike |
| 573 | chaos_torpedo | Chaos Torpedo | Weapon | R | 4 | 12/0 | aggro | overflow_fire, breach_cascade, radiation_leak |
| 574 | sniper_rifle_r | Sniper Rifle (Marksman Variant) | Weapon | R | 4 | 12/0 | control | tracking_lock, critical_strike, manual_fire |
| 575 | warhead_rack_r | Warhead Rack | Weapon | R | 5 | 16/0 | aggro | rapid_launch, alpha_strike, priority_fire |
| 576 | void_cannon | Void Cannon | Weapon | R | 5 | 16/0 | control | phase_drive, critical_strike, overflow_fire |
| 577 | plasma_battery_r | Plasma Battery (Heavy) | Weapon | R | 6 | 20/0 | combo | priority_fire, breach_cascade, radiation_leak |
| 578 | siege_lance_r | Siege Lance | Weapon | R | 6 | 21/0 | aggro | rapid_launch, overflow_fire, critical_strike |
| 579 | elite_interceptor | Elite Interceptor | Drone | R | 3 | 4/7 | control | interceptor, priority_fire, emergency_reboot |
| 580 | master_scout | Master Scout | Drone | R | 3 | 3/6 | utility | deploy_burst, probe, deep_scan |
| 581 | strike_vanguard | Strike Vanguard | Drone | R | 4 | 8/5 | aggro | rapid_launch, alpha_strike, priority_fire |
| 582 | ghost_operative | Ghost Operative | Drone | R | 4 | 6/6 | utility | gain_stealth, cloaked_entry, phase_drive |
| 583 | heavy_fighter_r | Heavy Fighter (Ace Class) | Drone | R | 5 | 9/8 | midrange | priority_fire, hot_deploy, battle_hardened |
| 584 | capital_warship | Capital Warship | Drone | R | 6 | 12/12 | midrange | rapid_launch, cold_boot, priority_fire |
| 585 | aegis_shield_r | Aegis Shield (Reinforced) | Defense | R | 3 | 0/11 | ramp | ablative_plating, interceptor, auto_repair |
| 586 | stealth_bastion | Stealth Bastion | Defense | R | 4 | 0/13 | control | gain_stealth, cloaked_entry, reinforced_hull |
| 587 | reactive_fortress | Reactive Fortress | Defense | R | 4 | 0/14 | midrange | system_shielding, critical_breach, ablative_plating |
| 588 | master_bulwark_r | Master Bulwark (Heavy) | Defense | R | 5 | 2/17 | midrange | interceptor, reinforced_hull, auto_repair |
| 589 | citadel_shell | Citadel Shell | Defense | R | 6 | 0/20 | midrange | interceptor, ablative_plating, emergency_reboot |
| 590 | master_ai | Master AI | AI Routine | R | 3 | 0/9 | combo | persistent_field, priority_fire, overclock |
| 591 | prime_network | Prime Network | AI Routine | R | 4 | 0/12 | combo | persistent_field, cascading_power, linked_fire |
| 592 | overmind_r | Overmind (Field Deployment) | AI Routine | R | 5 | 0/16 | combo | persistent_field, adaptive_learning, chain_catalyst |
| 593 | supreme_ai | Supreme AI | AI Routine | R | 6 | 0/20 | combo | persistent_field, efficiency_protocol, priority_fire |
| 594 | master_warhead | Master Warhead | Module | R | 4 | 0/0 | aggro | breach_cascade, overflow_fire |
| 595 | quantum_bomb | Quantum Bomb | Module | R | 5 | 0/0 | aggro | phase_drive, radiation_leak |
| 596 | nuclear_warhead | Nuclear Warhead | Module | R | 6 | 0/0 | aggro | breach_cascade, radiation_leak |
| 597 | master_strike | Master Strike | Maneuver | R | 3 | 0/0 | combo | priority_fire, alpha_strike |
| 598 | heroic_dive_r | Heroic Dive (Tribute) | Maneuver | R | 5 | 0/0 | control |  |
| 599 | master_targeting_suite | Master Targeting Suite | Equipment | R | 3 | 0/0 | combo | priority_fire, critical_strike, tracking_lock |
| 600 | warp_zone | Warp Zone | Field | R | 4 | 0/0 | midrange | persistent_field, phase_drive |

## Batch 07 — Rares (All Types)

**Cards:** 100 * **File:** `batch_07.json`

Distribution:
- Rarity: 100 rare (all rare — first fully rare-focused batch)
- Types: Weapon 19 * Drone 16 * AI Routine 18 * Defense 16 * Module 12 * Maneuver 10 * Equipment 5 * Field 4
- Cost: 0x 0 * 0x 1 * 2x 2 * 21x 3 * 31x 4 * 26x 5 * 15x 6 * 5x 7
- Archetype: 27 midrange * 18 combo * 18 aggro * 13 control * 12 utility * 12 ramp
- `deferred_deployment` seeded (deferred_zone field) — all 78 Part-9 abilities now present in the set

### Cards

| # | id | name | type | cost | A/D | archetype | keywords |
|---|---|---|---|---|---|---|---|
| 601 | heavy_pulse_r | Heavy Pulse | Weapon | 3 | 9/0 | combo | priority_fire, overclock, quick_strike |
| 602 | twin_torpedo_r | Twin Torpedo | Weapon | 3 | 10/0 | aggro | rapid_launch, alpha_strike |
| 603 | arc_beam_r | Arc Beam | Weapon | 3 | 9/0 | combo | breach_cascade, overclock, chain_catalyst |
| 604 | phantom_lance_r | Phantom Lance | Weapon | 3 | 8/0 | control | gain_stealth, phase_drive, critical_strike |
| 605 | radiant_cannon | Radiant Cannon | Weapon | 4 | 12/0 | control | priority_fire, critical_strike, radiation_leak |
| 606 | pulse_artillery | Pulse Artillery | Weapon | 4 | 12/0 | aggro | breach_cascade, cascading_power, overflow_fire |
| 607 | smart_bomb | Smart Bomb | Weapon | 4 | 12/0 | combo | tracking_lock, rapid_launch, critical_strike |
| 608 | burst_rifle_r | Burst Rifle | Weapon | 4 | 12/0 | combo | alpha_strike, priority_fire, overclock |
| 609 | arc_rifle | Arc Rifle | Weapon | 4 | 12/0 | combo | breach_cascade, chain_catalyst |
| 610 | laser_array_r | Laser Array | Weapon | 4 | 12/0 | aggro | alpha_strike, flanking_fire |
| 611 | siege_drill | Siege Drill | Weapon | 5 | 16/0 | midrange | cold_boot, critical_strike, overflow_fire |
| 612 | reaper_cannon | Reaper Cannon | Weapon | 5 | 16/0 | control | priority_fire, critical_strike, radiation_leak |
| 613 | tactical_missile | Tactical Missile | Weapon | 5 | 16/0 | midrange | manual_fire, priority_fire, tracking_lock |
| 614 | void_reaper | Void Reaper | Weapon | 5 | 16/0 | control | phase_drive, critical_strike, radiation_leak |
| 615 | fusion_mortar | Fusion Mortar | Weapon | 5 | 16/0 | aggro | breach_cascade, overflow_fire, radiation_leak |
| 616 | battery_burst | Battery Burst | Weapon | 6 | 20/0 | combo | priority_fire, alpha_strike, overclock |
| 617 | crusher_beam | Crusher Beam | Weapon | 6 | 21/0 | midrange | critical_strike, cascading_power |
| 618 | shadow_torpedo | Shadow Torpedo | Weapon | 6 | 20/0 | aggro | gain_stealth, critical_strike, rapid_launch |
| 619 | apex_gun | Apex Gun | Weapon | 7 | 24/0 | combo | priority_fire, alpha_strike, critical_strike |
| 620 | swift_raider | Swift Raider | Drone | 3 | 5/4 | aggro | rapid_launch, priority_fire, quick_strike |
| 621 | shadow_scout | Shadow Scout | Drone | 3 | 3/5 | utility | gain_stealth, deploy_burst, probe |
| 622 | heavy_guardian | Heavy Guardian | Drone | 4 | 6/8 | midrange | interceptor, auto_repair, reinforced_hull |
| 623 | elite_hunter | Elite Hunter | Drone | 4 | 7/5 | midrange | tracking_lock, critical_strike, priority_fire |
| 624 | phantom_bomber | Phantom Bomber | Drone | 4 | 7/5 | aggro | cloaked_entry, critical_breach, rapid_launch |
| 625 | engineer_drone | Engineer Drone | Drone | 4 | 4/9 | ramp | auto_repair, emergency_reboot, hull_drain |
| 626 | warhammer_fighter | Warhammer Fighter | Drone | 5 | 9/7 | midrange | rapid_launch, priority_fire, alpha_strike |
| 627 | assault_leader | Assault Leader | Drone | 5 | 10/6 | midrange | battle_hardened, priority_fire, outrider |
| 628 | sentinel_elite | Sentinel Elite | Drone | 5 | 5/13 | midrange | interceptor, reinforced_hull, emergency_reboot |
| 629 | ghost_commander | Ghost Commander | Drone | 5 | 7/9 | utility | gain_stealth, phase_drive, cloaked_entry |
| 630 | swarm_captain | Swarm Captain | Drone | 5 | 8/8 | midrange | rapid_launch, battle_hardened, priority_fire |
| 631 | siege_reaver | Siege Reaver | Drone | 5 | 10/6 | midrange | cold_boot, critical_breach, rapid_launch |
| 632 | master_tactician | Master Tactician | Drone | 6 | 10/11 | midrange | priority_fire, overclock, battle_hardened |
| 633 | capital_striker | Capital Striker | Drone | 6 | 13/8 | midrange | rapid_launch, alpha_strike, priority_fire |
| 634 | grand_defender | Grand Defender | Drone | 6 | 7/14 | midrange | interceptor, reinforced_hull, auto_repair |
| 635 | apex_warship | Apex Warship | Drone | 7 | 14/12 | midrange | rapid_launch, priority_fire, critical_strike |
| 636 | master_heat | Master Heat | AI Routine | 3 | 0/9 | combo | persistent_field, overclock, efficiency_protocol |
| 637 | prime_shield | Prime Shield | AI Routine | 3 | 0/9 | ramp | persistent_field, auto_repair, ablative_plating |
| 638 | swift_network | Swift Network | AI Routine | 3 | 0/8 | aggro | persistent_field, rapid_launch, priority_fire |
| 639 | phantom_ai | Phantom AI | AI Routine | 3 | 0/8 | utility | persistent_field, gain_stealth, cloaked_entry |
| 640 | heat_converter | Heat Converter | AI Routine | 4 | 0/12 | combo | persistent_field, overclock, cascading_power |
| 641 | master_scanner | Master Scanner | AI Routine | 4 | 0/12 | utility | persistent_field, probe, deep_scan |
| 642 | drone_commander | Drone Commander | AI Routine | 4 | 0/13 | aggro | persistent_field, rapid_launch, battle_hardened |
| 643 | weapons_synchronizer | Weapons Synchronizer | AI Routine | 4 | 0/12 | midrange | persistent_field, alpha_strike, linked_fire |
| 644 | defense_commander | Defense Commander | AI Routine | 4 | 0/14 | midrange | persistent_field, interceptor, ablative_plating |
| 645 | tactical_matrix | Tactical Matrix | AI Routine | 4 | 0/13 | utility | persistent_field, tactical_draw, cascading_power |
| 646 | master_efficiency | Master Efficiency | AI Routine | 4 | 0/13 | ramp | persistent_field, efficiency_protocol, overclock |
| 647 | combat_uplink_r | Combat Uplink | AI Routine | 5 | 0/16 | combo | persistent_field, priority_fire, critical_strike |
| 648 | prime_adaptive | Prime Adaptive | AI Routine | 5 | 0/16 | ramp | persistent_field, adaptive_learning, auto_repair |
| 649 | master_chain | Master Chain | AI Routine | 5 | 0/17 | combo | persistent_field, chain_catalyst, cascading_power |
| 650 | overmind_master | Overmind Master | AI Routine | 5 | 0/17 | midrange | persistent_field, priority_fire, overclock |
| 651 | supreme_uplink | Supreme Uplink | AI Routine | 6 | 0/20 | ramp | persistent_field, adaptive_learning, efficiency_protocol |
| 652 | apex_network | Apex Network | AI Routine | 6 | 0/21 | combo | persistent_field, cascading_power, linked_fire |
| 653 | grand_protocol | Grand Protocol | AI Routine | 7 | 0/25 | aggro | persistent_field, priority_fire, rapid_launch |
| 654 | plasma_shield_r | Plasma Shield | Defense | 3 | 0/10 | midrange | system_shielding, auto_repair, ablative_plating |
| 655 | adaptive_armor | Adaptive Armor | Defense | 3 | 0/10 | midrange | adaptive_learning, ablative_plating, reinforced_hull |
| 656 | warp_barrier | Warp Barrier | Defense | 3 | 0/10 | utility | phase_drive, evade, gain_stealth |
| 657 | heavy_bastion | Heavy Bastion | Defense | 4 | 0/14 | midrange | interceptor, reinforced_hull, ablative_plating |
| 658 | regen_aegis | Regen Aegis | Defense | 4 | 0/13 | ramp | auto_repair, emergency_reboot, reinforced_hull |
| 659 | stealth_bastion_r | Stealth Bastion (Elite) | Defense | 4 | 0/13 | control | gain_stealth, cloaked_entry, evade |
| 660 | reactive_aegis | Reactive Aegis | Defense | 4 | 0/14 | midrange | system_shielding, critical_breach, ablative_plating |
| 661 | counter_bastion | Counter Bastion | Defense | 4 | 0/13 | control | countermeasure, signal_jammer, negate |
| 662 | master_fortress_r | Master Fortress | Defense | 5 | 2/17 | midrange | interceptor, reinforced_hull, auto_repair |
| 663 | phase_bastion | Phase Bastion | Defense | 5 | 0/17 | control | phase_drive, gain_stealth, reinforced_hull |
| 664 | regen_fortress | Regen Fortress | Defense | 5 | 0/17 | ramp | auto_repair, emergency_reboot, ablative_plating |
| 665 | colossal_aegis | Colossal Aegis | Defense | 5 | 0/18 | midrange | ablative_plating, emergency_reboot, reinforced_hull |
| 666 | paragon_shield | Paragon Shield | Defense | 6 | 0/22 | ramp | ablative_plating, auto_repair, reinforced_hull |
| 667 | fortress_bastion | Fortress Bastion | Defense | 6 | 2/20 | midrange | interceptor, reinforced_hull, emergency_reboot |
| 668 | apex_aegis | Apex Aegis | Defense | 6 | 0/21 | ramp | ablative_plating, auto_repair, emergency_reboot |
| 669 | primordial_wall | Primordial Wall | Defense | 7 | 0/26 | midrange | interceptor, reinforced_hull, auto_repair |
| 670 | quantum_warhead | Quantum Warhead | Module | 3 | 0/0 | aggro | phase_drive, radiation_leak |
| 671 | nano_swarm | Nano Swarm | Module | 3 | 0/0 | ramp | auto_repair, emergency_reboot |
| 672 | disruption_spike | Disruption Spike | Module | 3 | 0/0 | control | signal_jamming, disable, apply_lock |
| 673 | ion_cluster | Ion Cluster | Module | 4 | 0/0 | control | breach_cascade, radiation_leak |
| 674 | tactical_override | Tactical Override | Module | 4 | 0/0 | control | hack_corrupt, transform_overhaul |
| 675 | master_repair | Master Repair | Module | 4 | 0/0 | ramp | auto_repair |
| 676 | plasma_annihilator | Plasma Annihilator | Module | 5 | 0/0 | aggro | breach_cascade, overflow_fire |
| 677 | phase_warhead | Phase Warhead | Module | 5 | 0/0 | aggro | phase_drive, critical_strike |
| 678 | stasis_field | Stasis Field | Module | 5 | 0/0 | control | tractor_beam_hold, disable |
| 679 | nuke_kit | Nuke Kit | Module | 6 | 0/0 | aggro | breach_cascade, radiation_leak, overflow_fire |
| 680 | quantum_reset | Quantum Reset | Module | 6 | 0/0 | utility | system_reset, probe |
| 681 | grand_warhead | Grand Warhead | Module | 7 | 0/0 | aggro | priority_fire, breach_cascade, overflow_fire |
| 682 | priority_barrage | Priority Barrage | Maneuver | 2 | 0/0 | combo | priority_fire, alpha_strike |
| 683 | tactical_draw_r | Tactical Draw | Maneuver | 2 | 0/0 | utility | tactical_draw, probe |
| 684 | master_evasion | Master Evasion | Maneuver | 3 | 0/0 | control |  |
| 685 | warp_jump | Warp Jump | Maneuver | 3 | 0/0 | utility | phase_drive |
| 686 | emergency_swarm | Emergency Swarm | Maneuver | 4 | 0/0 | aggro | rapid_launch, priority_fire |
| 687 | grand_strike | Grand Strike | Maneuver | 4 | 0/0 | combo | priority_fire, alpha_strike |
| 688 | perfect_defense | Perfect Defense | Maneuver | 4 | 0/0 | control |  |
| 689 | apex_charge | Apex Charge | Maneuver | 5 | 0/0 | combo | critical_strike, overclock |
| 690 | tactical_reset | Tactical Reset | Maneuver | 5 | 0/0 | utility | system_reset, probe |
| 691 | grand_vector | Grand Vector | Maneuver | 6 | 0/0 | combo | priority_fire, rapid_launch, reactive |
| 692 | virtuoso_scope | Virtuoso Scope | Equipment | 3 | 0/0 | combo | priority_fire, tracking_lock, critical_strike |
| 693 | phantom_cloak | Phantom Cloak | Equipment | 3 | 0/0 | utility | gain_stealth, cloaked_entry, evade |
| 694 | elite_plating_r | Elite Plating (Rare) | Equipment | 4 | 0/0 | midrange | reinforced_hull, ablative_plating |
| 695 | fleet_conduit | Fleet Conduit | Equipment | 4 | 0/0 | ramp | crew_pooling, cascading_power |
| 696 | grand_scope | Grand Scope | Equipment | 5 | 0/0 | combo | priority_fire, critical_strike, alpha_strike |
| 697 | battle_zone | Battle Zone | Field | 3 | 0/0 | aggro | persistent_field, priority_fire |
| 698 | defensive_zone | Defensive Zone | Field | 4 | 0/0 | midrange | persistent_field, interceptor, ablative_plating |
| 699 | chaos_zone | Chaos Zone | Field | 5 | 0/0 | aggro | persistent_field, breach_cascade |
| 700 | deferred_zone | Deferred Zone | Field | 6 | 0/0 | utility | persistent_field, deferred_deployment |

## Batch 08 — Epics + Remaining Equipment/Field

**Cards:** 100 * **File:** `batch_08.json`

Distribution:
- Rarity: 90 epic * 8 uncommon * 2 rare
- Types: Weapon 17 * Drone 13 * AI Routine 13 * Defense 12 * Module 11 * Maneuver 9 * Equipment 14 * Field 10 * Ship Core 1
- Cost: 1x 0 * 3x 2 * 7x 3 * 22x 4 * 30x 5 * 20x 6 * 12x 7 * 5x 8
- Archetype: 27 midrange * 19 combo * 18 aggro * 16 control * 11 utility * 9 ramp
- Epic rule 2 applied: 3-4 keywords per epic. AI Routines and Defense carry 4-keyword signature loadouts; others 3 keywords each.

### Cards

| # | id | name | type | rarity | cost | A/D | archetype | keywords |
|---|---|---|---|---|---|---|---|---|
| 701 | plasma_reaper | Plasma Reaper | Weapon | E | 4 | 13/0 | combo | priority_fire, overclock, critical_strike |
| 702 | chrono_cannon | Chrono Cannon | Weapon | E | 4 | 12/0 | aggro | phase_drive, quick_strike, priority_fire |
| 703 | twin_fusion | Twin Fusion | Weapon | E | 4 | 13/0 | aggro | alpha_strike, linked_fire, priority_fire |
| 704 | arc_storm | Arc Storm | Weapon | E | 4 | 12/0 | combo | breach_cascade, chain_catalyst, overclock |
| 705 | shadowbeam | Shadowbeam | Weapon | E | 5 | 16/0 | control | gain_stealth, phase_drive, critical_strike |
| 706 | quad_salvo | Quad Salvo | Weapon | E | 5 | 16/0 | midrange | rapid_launch, alpha_strike, priority_fire |
| 707 | ion_destroyer | Ion Destroyer | Weapon | E | 5 | 16/0 | control | critical_strike, radiation_leak, priority_fire |
| 708 | siege_spike | Siege Spike | Weapon | E | 5 | 16/0 | midrange | cold_boot, critical_strike, overflow_fire |
| 709 | nova_cannon | Nova Cannon | Weapon | E | 5 | 16/0 | aggro | breach_cascade, overflow_fire, radiation_leak |
| 710 | reaper_lance | Reaper Lance | Weapon | E | 6 | 20/0 | combo | priority_fire, critical_strike, overclock |
| 711 | void_breaker | Void Breaker | Weapon | E | 6 | 20/0 | control | phase_drive, overflow_fire, radiation_leak |
| 712 | apocalypse_gun | Apocalypse Gun | Weapon | E | 6 | 20/0 | combo | breach_cascade, alpha_strike, priority_fire |
| 713 | siege_master | Siege Master | Weapon | E | 6 | 20/0 | midrange | cold_boot, cascading_power, critical_strike |
| 714 | hyper_cannon | Hyper Cannon | Weapon | E | 7 | 24/0 | combo | priority_fire, alpha_strike, critical_strike |
| 715 | void_storm | Void Storm | Weapon | E | 7 | 24/0 | aggro | breach_cascade, radiation_leak, overflow_fire |
| 716 | stellar_spike | Stellar Spike | Weapon | E | 7 | 24/0 | control | critical_strike, phase_drive, overflow_fire |
| 717 | planetary_cannon | Planetary Cannon | Weapon | E | 8 | 28/0 | midrange | priority_fire, overflow_fire, radiation_leak |
| 718 | sky_reaver | Sky Reaver | Drone | E | 4 | 7/5 | midrange | rapid_launch, skyward_maneuver, priority_fire |
| 719 | phantom_elite | Phantom Elite | Drone | E | 4 | 6/6 | utility | gain_stealth, cloaked_entry, phase_drive |
| 720 | terror_bomber | Terror Bomber | Drone | E | 4 | 8/5 | midrange | critical_breach, hot_deploy, rapid_launch |
| 721 | guardian_elite | Guardian Elite | Drone | E | 5 | 5/12 | midrange | interceptor, reinforced_hull, auto_repair |
| 722 | bomber_overlord | Bomber Overlord | Drone | E | 5 | 10/6 | midrange | rapid_launch, critical_breach, alpha_strike |
| 723 | phantom_siege | Phantom Siege | Drone | E | 5 | 9/8 | control | gain_stealth, critical_strike, phase_drive |
| 724 | warchief | Warchief | Drone | E | 5 | 8/9 | midrange | battle_hardened, priority_fire, outrider |
| 725 | siege_overlord | Siege Overlord | Drone | E | 6 | 12/8 | midrange | priority_fire, cold_boot, alpha_strike |
| 726 | phantom_overlord | Phantom Overlord | Drone | E | 6 | 10/10 | utility | gain_stealth, cloaked_entry, critical_strike |
| 727 | guardian_overlord | Guardian Overlord | Drone | E | 6 | 6/15 | midrange | interceptor, reinforced_hull, emergency_reboot |
| 728 | fleet_admiral | Fleet Admiral | Drone | E | 7 | 13/13 | midrange | priority_fire, alpha_strike, rapid_launch |
| 729 | capital_terror | Capital Terror | Drone | E | 7 | 15/11 | midrange | rapid_launch, critical_breach, cold_boot |
| 730 | apex_destroyer | Apex Destroyer | Drone | E | 8 | 16/14 | aggro | priority_fire, alpha_strike, critical_strike |
| 731 | prime_command | Prime Command | AI Routine | E | 4 | 0/13 | combo | persistent_field, priority_fire, overclock, chain_catalyst |
| 732 | master_scanner_e | Master Scanner (Epic) | AI Routine | E | 4 | 0/12 | utility | persistent_field, probe, deep_scan, tactical_draw |
| 733 | prime_fortress | Prime Fortress | AI Routine | E | 4 | 0/14 | midrange | persistent_field, interceptor, reinforced_hull, ablative_plating |
| 734 | master_uplink | Master Uplink | AI Routine | E | 5 | 0/16 | midrange | persistent_field, cascading_power, linked_fire, chain_catalyst |
| 735 | prime_shield_e | Prime Shield (Epic) | AI Routine | E | 5 | 0/17 | ramp | persistent_field, auto_repair, emergency_reboot, adaptive_learning |
| 736 | ghost_overmind | Ghost Overmind | AI Routine | E | 5 | 0/16 | utility | persistent_field, gain_stealth, cloaked_entry, phase_drive |
| 737 | commander_elite | Commander Elite | AI Routine | E | 5 | 0/16 | aggro | persistent_field, priority_fire, rapid_launch, critical_strike |
| 738 | supreme_heat | Supreme Heat | AI Routine | E | 6 | 0/20 | combo | persistent_field, overclock, efficiency_protocol, cascading_power |
| 739 | prime_hunter | Prime Hunter | AI Routine | E | 6 | 0/20 | combo | persistent_field, tracking_lock, priority_fire, critical_strike |
| 740 | apex_master | Apex Master | AI Routine | E | 6 | 0/21 | ramp | persistent_field, adaptive_learning, efficiency_protocol, chain_catalyst |
| 741 | ultimate_commander | Ultimate Commander | AI Routine | E | 7 | 0/25 | aggro | persistent_field, priority_fire, rapid_launch, alpha_strike |
| 742 | prime_overmind | Prime Overmind | AI Routine | E | 7 | 0/24 | combo | persistent_field, cascading_power, chain_catalyst, linked_fire |
| 743 | grand_supreme | Grand Supreme | AI Routine | E | 8 | 0/30 | combo | persistent_field, priority_fire, overclock, cascading_power |
| 744 | master_fortress_e | Master Fortress (Epic) | Defense | E | 4 | 0/14 | midrange | interceptor, reinforced_hull, ablative_plating, auto_repair |
| 745 | aegis_lord | Aegis Lord | Defense | E | 4 | 0/14 | midrange | ablative_plating, emergency_reboot, reinforced_hull, system_shielding |
| 746 | phase_master | Phase Master | Defense | E | 5 | 0/16 | control | phase_drive, gain_stealth, reinforced_hull, evade |
| 747 | apex_barrier | Apex Barrier | Defense | E | 5 | 0/17 | ramp | interceptor, ablative_plating, auto_repair, emergency_reboot |
| 748 | stealth_master | Stealth Master | Defense | E | 5 | 0/17 | control | gain_stealth, cloaked_entry, evade, reinforced_hull |
| 749 | grand_fortress_e | Grand Fortress (Epic) | Defense | E | 5 | 2/16 | midrange | interceptor, reinforced_hull, battle_hardened |
| 750 | titanic_lord | Titanic Lord | Defense | E | 6 | 0/21 | ramp | ablative_plating, reinforced_hull, emergency_reboot, auto_repair |
| 751 | fortress_supreme | Fortress Supreme | Defense | E | 6 | 3/20 | midrange | interceptor, reinforced_hull, ablative_plating, auto_repair |
| 752 | phase_supreme | Phase Supreme | Defense | E | 6 | 0/22 | control | phase_drive, reinforced_hull, emergency_reboot |
| 753 | aegis_supreme | Aegis Supreme | Defense | E | 7 | 0/25 | ramp | ablative_plating, auto_repair, emergency_reboot, reinforced_hull |
| 754 | citadel_lord | Citadel Lord | Defense | E | 7 | 3/24 | midrange | interceptor, reinforced_hull, auto_repair |
| 755 | primordial_bastion | Primordial Bastion | Defense | E | 8 | 0/30 | midrange | interceptor, reinforced_hull, ablative_plating, emergency_reboot |
| 756 | master_warhead_e | Master Warhead (Epic) | Module | E | 4 | 0/0 | aggro | breach_cascade, overflow_fire, radiation_leak |
| 757 | disruption_master | Disruption Master | Module | E | 4 | 0/0 | control | signal_jamming, disable, data_wipe |
| 758 | stasis_lock | Stasis Lock | Module | E | 4 | 0/0 | control | tractor_beam_hold, disable, apply_lock |
| 759 | overmind_bomb | Overmind Bomb | Module | E | 5 | 0/0 | midrange | breach_cascade, overflow_fire, phase_drive |
| 760 | quantum_storm | Quantum Storm | Module | E | 5 | 0/0 | aggro | phase_drive, radiation_leak, critical_strike |
| 761 | master_override_e | Master Override (Epic) | Module | E | 5 | 0/0 | control | hack_corrupt, transform_overhaul, disable |
| 762 | nano_master | Nano Master | Module | E | 5 | 0/0 | ramp | auto_repair, emergency_reboot |
| 763 | reality_warp | Reality Warp | Module | E | 6 | 0/0 | aggro | phase_drive, critical_strike, overflow_fire |
| 764 | nuclear_master | Nuclear Master | Module | E | 6 | 0/0 | midrange | breach_cascade, radiation_leak, overflow_fire |
| 765 | temporal_bomb | Temporal Bomb | Module | E | 7 | 0/0 | aggro | phase_drive, radiation_leak, breach_cascade |
| 766 | grand_nuke | Grand Nuke | Module | E | 8 | 0/0 | aggro | priority_fire, breach_cascade, radiation_leak, overflow_fire |
| 767 | master_priority | Master Priority | Maneuver | E | 3 | 0/0 | combo | priority_fire, alpha_strike |
| 768 | phantom_strike_e | Phantom Strike (Epic) | Maneuver | E | 4 | 0/0 | control | phantom_echo, gain_stealth |
| 769 | chaos_warp | Chaos Warp | Maneuver | E | 4 | 0/0 | control | transform_overhaul, ai_takeover |
| 770 | master_defense | Master Defense | Maneuver | E | 4 | 0/0 | control |  |
| 771 | apex_strike | Apex Strike | Maneuver | E | 5 | 0/0 | combo | critical_strike, overclock, priority_fire |
| 772 | master_warp | Master Warp | Maneuver | E | 5 | 0/0 | utility | phase_drive, evade |
| 773 | total_charge | Total Charge | Maneuver | E | 6 | 0/0 | combo | priority_fire, alpha_strike, critical_strike |
| 774 | grand_defense | Grand Defense | Maneuver | E | 6 | 0/0 | control |  |
| 775 | supreme_strike | Supreme Strike | Maneuver | E | 7 | 0/0 | combo | priority_fire, alpha_strike, critical_strike |
| 776 | master_scope_e | Master Scope (Epic) | Equipment | E | 3 | 0/0 | combo | priority_fire, critical_strike, tracking_lock, alpha_strike |
| 777 | elite_cloak | Elite Cloak | Equipment | E | 4 | 0/0 | utility | gain_stealth, cloaked_entry, evade, phase_drive |
| 778 | master_plating | Master Plating | Equipment | E | 4 | 0/0 | midrange | reinforced_hull, ablative_plating, auto_repair |
| 779 | fleet_network | Fleet Network | Equipment | E | 5 | 0/0 | ramp | crew_pooling, cascading_power, efficiency_protocol |
| 780 | supreme_targeting | Supreme Targeting | Equipment | E | 5 | 0/0 | combo | priority_fire, critical_strike, alpha_strike, tracking_lock |
| 781 | phantom_rig | Phantom Rig | Equipment | E | 5 | 0/0 | utility | gain_stealth, cloaked_entry, phase_drive, evade |
| 782 | apex_armor | Apex Armor | Equipment | E | 6 | 0/0 | midrange | reinforced_hull, ablative_plating, auto_repair |
| 783 | grand_uplink | Grand Uplink | Equipment | E | 6 | 0/0 | aggro | priority_fire, rapid_launch, cascading_power |
| 784 | apex_zone | Apex Zone | Field | E | 4 | 0/0 | aggro | persistent_field, priority_fire, rapid_launch |
| 785 | chaos_storm | Chaos Storm | Field | E | 5 | 0/0 | aggro | persistent_field, breach_cascade, radiation_leak |
| 786 | phase_region | Phase Region | Field | E | 5 | 0/0 | utility | persistent_field, phase_drive, gain_stealth |
| 787 | fortress_region | Fortress Region | Field | E | 5 | 0/0 | midrange | persistent_field, interceptor, ablative_plating, auto_repair |
| 788 | supreme_battleground | Supreme Battleground | Field | E | 6 | 0/0 | combo | persistent_field, priority_fire, alpha_strike |
| 789 | chrono_field | Chrono Field | Field | E | 7 | 0/0 | utility | persistent_field, deferred_deployment, reactive, phase_drive |
| 790 | elite_fighter_core | Elite Fighter Core | Ship Core | E | 0 | 0/0 | aggro |  |
| 791 | sniper_mount | Sniper Mount | Equipment | U | 2 | 0/0 | combo | critical_strike, priority_fire |
| 792 | stabilizer_plate | Stabilizer Plate | Equipment | U | 2 | 0/0 | midrange | reinforced_hull, auto_repair |
| 793 | phase_rig | Phase Rig | Equipment | U | 3 | 0/0 | utility | phase_drive, gain_stealth |
| 794 | battle_harness | Battle Harness | Equipment | U | 3 | 0/0 | aggro | battle_hardened, rapid_launch |
| 795 | energy_matrix | Energy Matrix | Equipment | U | 3 | 0/0 | ramp | overclock, efficiency_protocol |
| 796 | fleet_formation | Fleet Formation | Field | U | 2 | 0/0 | aggro | persistent_field |
| 797 | targeting_field | Targeting Field | Field | U | 3 | 0/0 | combo | persistent_field, priority_fire |
| 798 | recon_region | Recon Region | Field | U | 3 | 0/0 | utility | persistent_field, probe |
| 799 | master_conduit | Master Conduit | Equipment | R | 4 | 0/0 | ramp | crew_pooling, cascading_power, efficiency_protocol |
| 800 | stealth_region | Stealth Region | Field | R | 5 | 0/0 | control | persistent_field, gain_stealth, cloaked_entry |

## Batch 09 — Legendaries + Ship Cores + Fillers

**Cards:** 100 * **File:** `batch_09.json`

Distribution:
- Rarity: 50 legendary * 30 uncommon * 20 rare
- Types: Ship Core 36 * Weapon 14 * Drone 11 * Defense 11 * AI Routine 10 * Module 8 * Maneuver 5 * Equipment 3 * Field 2
- Cost: 36x 0 (all Ship Cores) * 6x 2 * 9x 3 * 11x 4 * 14x 5 * 13x 6 * 7x 7 * 4x 8
- Archetype: 27 midrange * 16 aggro * 16 utility * 15 control * 14 combo * 12 ramp
- 50 legendary signature-named cards (per Rule 2: unique named cards)
- 7 legendary Ship Cores + 14 rare Ship Cores + 15 uncommon Ship Cores = 36 new Ship Cores, bringing set total to 50 (10 common from B04 + 1 epic from B08 + 36 from B09 + ~3 mythic planned for B10)

### Cards

| # | id | name | type | rarity | cost | A/D | archetype | keywords |
|---|---|---|---|---|---|---|---|---|
| 801 | thornspitter | Thornspitter | Weapon | L | 4 | 14/0 | combo | alpha_strike, critical_strike, priority_fire |
| 802 | heart_lance | Heart Lance | Weapon | L | 5 | 16/0 | midrange | critical_strike, overflow_fire, hull_drain |
| 803 | the_long_goodbye | The Long Goodbye | Weapon | L | 5 | 16/0 | control | radiation_leak, phase_drive, critical_strike |
| 804 | wrath_of_vael | Wrath of Vael | Weapon | L | 6 | 20/0 | combo | priority_fire, alpha_strike, breach_cascade |
| 805 | glass_mass | Glass Mass | Weapon | L | 6 | 20/0 | aggro | breach_cascade, overflow_fire, radiation_leak |
| 806 | second_sunrise | Second Sunrise | Weapon | L | 7 | 24/0 | control | overflow_fire, radiation_leak, critical_strike |
| 807 | executioners_oath | Executioner's Oath | Weapon | L | 7 | 24/0 | combo | priority_fire, critical_strike, alpha_strike |
| 808 | star_rift | Star Rift | Weapon | L | 8 | 28/0 | control | phase_drive, overflow_fire, breach_cascade, radiation_leak |
| 809 | valkyrie | Valkyrie | Drone | L | 4 | 8/5 | aggro | rapid_launch, priority_fire, alpha_strike |
| 810 | reaper_prime | Reaper Prime | Drone | L | 5 | 10/7 | aggro | critical_strike, priority_fire, rapid_launch |
| 811 | silent_argo | Silent Argo | Drone | L | 5 | 7/10 | utility | gain_stealth, cloaked_entry, phase_drive |
| 812 | orlandos_the_bulwark | Orlandos the Bulwark | Drone | L | 6 | 7/14 | midrange | interceptor, reinforced_hull, auto_repair |
| 813 | ghost_of_sector_7 | Ghost of Sector 7 | Drone | L | 6 | 10/11 | control | gain_stealth, critical_strike, phase_drive |
| 814 | kaiserin | Kaiserin | Drone | L | 7 | 14/13 | midrange | priority_fire, alpha_strike, battle_hardened |
| 815 | the_unbroken | The Unbroken | Drone | L | 8 | 15/17 | ramp | reinforced_hull, emergency_reboot, auto_repair |
| 816 | archon | Archon | AI Routine | L | 4 | 0/14 | combo | persistent_field, priority_fire, overclock |
| 817 | the_silent_conductor | The Silent Conductor | AI Routine | L | 5 | 0/17 | combo | persistent_field, cascading_power, chain_catalyst |
| 818 | the_fortress_mind | The Fortress Mind | AI Routine | L | 5 | 0/18 | midrange | persistent_field, interceptor, reinforced_hull |
| 819 | valens_algorithm | Valen's Algorithm | AI Routine | L | 6 | 0/21 | ramp | persistent_field, adaptive_learning, efficiency_protocol |
| 820 | the_shepherd | The Shepherd | AI Routine | L | 6 | 0/22 | aggro | persistent_field, rapid_launch, battle_hardened |
| 821 | oracle_of_deep_void | Oracle of Deep Void | AI Routine | L | 7 | 0/25 | utility | persistent_field, probe, deep_scan, tactical_draw |
| 822 | prime_directive_legendary | Prime Directive (Unit 01) | AI Routine | L | 8 | 0/30 | aggro | persistent_field, priority_fire, rapid_launch, alpha_strike |
| 823 | shield_of_the_first | Shield of the First | Defense | L | 4 | 0/15 | midrange | ablative_plating, interceptor, reinforced_hull |
| 824 | heart_wall | Heart Wall | Defense | L | 5 | 0/18 | midrange | interceptor, reinforced_hull, auto_repair |
| 825 | the_unyielding | The Unyielding | Defense | L | 5 | 0/18 | midrange | reinforced_hull, emergency_reboot, ablative_plating |
| 826 | mirror_of_veena | Mirror of Veena | Defense | L | 6 | 0/22 | midrange | system_shielding, critical_breach, reinforced_hull |
| 827 | ghost_bulwark | Ghost Bulwark | Defense | L | 6 | 0/22 | midrange | gain_stealth, phase_drive, reinforced_hull |
| 828 | phoenix_wall | Phoenix Wall | Defense | L | 7 | 0/25 | ramp | emergency_reboot, auto_repair, reinforced_hull |
| 829 | worldgate | Worldgate | Defense | L | 8 | 0/32 | midrange | interceptor, reinforced_hull, ablative_plating, auto_repair |
| 830 | reactor_overload | Reactor Overload | Module | L | 5 | 0/0 | aggro |  |
| 831 | last_light | Last Light | Module | L | 5 | 0/0 | ramp |  |
| 832 | the_unforgiving_round | The Unforgiving Round | Module | L | 6 | 0/0 | control | critical_strike, radiation_leak |
| 833 | signal_to_home | Signal to Home | Module | L | 6 | 0/0 | utility | system_reset |
| 834 | catastrophe | Catastrophe | Module | L | 7 | 0/0 | aggro | breach_cascade, radiation_leak, overflow_fire |
| 835 | last_stand | Last Stand | Maneuver | L | 4 | 0/0 | aggro |  |
| 836 | time_reverse | Time Reverse | Maneuver | L | 5 | 0/0 | control |  |
| 837 | final_vector | Final Vector | Maneuver | L | 6 | 0/0 | combo | priority_fire, alpha_strike, critical_strike |
| 838 | heroic_gambit | Heroic Gambit | Maneuver | L | 7 | 0/0 | control |  |
| 839 | signature_scope | Signature Scope | Equipment | L | 4 | 0/0 | combo | priority_fire, critical_strike, alpha_strike, tracking_lock |
| 840 | valens_harness | Valen's Harness | Equipment | L | 5 | 0/0 | midrange | battle_hardened, rapid_launch, priority_fire, reinforced_hull |
| 841 | iron_chorus | Iron Chorus | Equipment | L | 6 | 0/0 | aggro | priority_fire |
| 842 | dust_of_dead_stars | Dust of Dead Stars | Field | L | 5 | 0/0 | control | persistent_field, gain_stealth, radiation_leak |
| 843 | gravitys_silence | Gravity's Silence | Field | L | 6 | 0/0 | utility | persistent_field, phase_drive, evade, reinforced_hull |
| 844 | warmasters_core | Warmaster's Core | Ship Core | L | 0 | 0/0 | combo |  |
| 845 | bastion_heart | Bastion Heart | Ship Core | L | 0 | 0/0 | midrange |  |
| 846 | oracle_core | Oracle Core | Ship Core | L | 0 | 0/0 | utility | end_cycle, probe, deep_scan |
| 847 | void_traveler | Void Traveler | Ship Core | L | 0 | 0/0 | utility | phase_drive |
| 848 | reactor_pulse | Reactor Pulse | Ship Core | L | 0 | 0/0 | ramp |  |
| 849 | the_resilience | The Resilience | Ship Core | L | 0 | 0/0 | ramp | emergency_reboot |
| 850 | ghost_protocol | Ghost Protocol | Ship Core | L | 0 | 0/0 | utility | gain_stealth |
| 851 | swift_core | Swift Core | Ship Core | U | 0 | 0/0 | aggro |  |
| 852 | solid_core | Solid Core | Ship Core | U | 0 | 0/0 | midrange |  |
| 853 | recon_core | Recon Core | Ship Core | U | 0 | 0/0 | utility | deploy_burst, probe |
| 854 | strike_core | Strike Core | Ship Core | U | 0 | 0/0 | midrange |  |
| 855 | regen_core | Regen Core | Ship Core | U | 0 | 0/0 | ramp | auto_repair |
| 856 | tactical_core | Tactical Core | Ship Core | U | 0 | 0/0 | utility |  |
| 857 | boost_core | Boost Core | Ship Core | U | 0 | 0/0 | ramp |  |
| 858 | warden_core | Interceptor Core | Ship Core | U | 0 | 0/0 | midrange | interceptor |
| 859 | pulse_core | Pulse Core | Ship Core | U | 0 | 0/0 | midrange | end_cycle |
| 860 | cycle_core | Cycle Core | Ship Core | U | 0 | 0/0 | utility | cycling_protocol |
| 861 | heat_core | Heat Core | Ship Core | U | 0 | 0/0 | combo | overclock |
| 862 | scout_core | Scout Core | Ship Core | U | 0 | 0/0 | utility | deploy_burst, probe |
| 863 | guard_core | Guard Core | Ship Core | U | 0 | 0/0 | midrange |  |
| 864 | ambush_core | Ambush Core | Ship Core | U | 0 | 0/0 | control | reactive |
| 865 | heavy_cargo_core | Heavy Cargo Core | Ship Core | U | 0 | 0/0 | utility |  |
| 866 | hunter_core | Hunter Core | Ship Core | R | 0 | 0/0 | combo | tracking_lock |
| 867 | phoenix_core | Phoenix Core | Ship Core | R | 0 | 0/0 | ramp | emergency_reboot |
| 868 | warden_guard_core | Warden Core | Ship Core | R | 0 | 0/0 | midrange | reinforced_hull |
| 869 | assassin_core | Assassin Core | Ship Core | R | 0 | 0/0 | aggro | critical_strike |
| 870 | sage_core | Sage Core | Ship Core | R | 0 | 0/0 | utility | end_cycle, deep_scan |
| 871 | overclocked_core | Overclocked Core | Ship Core | R | 0 | 0/0 | combo | overclock |
| 872 | survivor_core | Survivor Core | Ship Core | R | 0 | 0/0 | ramp | auto_repair |
| 873 | combat_core | Combat Core | Ship Core | R | 0 | 0/0 | midrange | priority_fire |
| 874 | swarm_core | Swarm Core | Ship Core | R | 0 | 0/0 | midrange |  |
| 875 | armory_core | Armory Core | Ship Core | R | 0 | 0/0 | ramp |  |
| 876 | command_core | Command Core | Ship Core | R | 0 | 0/0 | midrange |  |
| 877 | phase_core | Phase Core | Ship Core | R | 0 | 0/0 | utility | phase_drive |
| 878 | ace_core | Ace Core | Ship Core | R | 0 | 0/0 | ramp | fuel_scavenge |
| 879 | dreadnought_core | Dreadnought Core | Ship Core | R | 0 | 0/0 | midrange |  |
| 880 | thermal_salvo | Thermal Salvo | Weapon | U | 3 | 8/0 | midrange | priority_fire, radiation_leak |
| 881 | matter_pike | Matter Pike | Weapon | U | 3 | 9/0 | control | phase_drive, critical_strike |
| 882 | stagger_cannon | Stagger Cannon | Weapon | U | 2 | 5/0 | control | priority_fire, disable |
| 883 | chorus_laser | Chorus Laser | Weapon | U | 2 | 5/0 | combo | linked_fire, priority_fire |
| 884 | peregrine_drone | Peregrine Drone | Drone | U | 2 | 3/2 | aggro | outrider |
| 885 | burrow_drone | Burrow Drone | Drone | U | 3 | 4/5 | utility | cloaked_entry, deploy_burst, probe |
| 886 | warsign_drone | Warsign Drone | Drone | U | 3 | 5/4 | midrange | battle_hardened, priority_fire |
| 887 | patient_hull | Patient Hull | Defense | U | 2 | 0/7 | midrange | ablative_plating, emergency_reboot |
| 888 | ward_lattice | Ward Lattice | Defense | U | 3 | 0/10 | midrange | interceptor, system_shielding |
| 889 | wave_barrier | Wave Barrier | Defense | U | 3 | 0/9 | control | countermeasure, evade |
| 890 | observation_subroutine | Observation Subroutine | AI Routine | U | 2 | 0/5 | utility | persistent_field, end_cycle |
| 891 | coordination_matrix | Coordination Matrix | AI Routine | U | 3 | 0/8 | combo | persistent_field, linked_fire |
| 892 | sabot_shell | Sabot Shell | Module | U | 3 | 0/0 | aggro |  |
| 893 | disruptor_shell | Disruptor Shell | Module | U | 3 | 0/0 | control | priority_fire, disable |
| 894 | fast_reverse | Fast Reverse | Maneuver | U | 2 | 0/0 | control | reactive, phase_drive |
| 895 | crosshatch_cannon | Crosshatch Cannon | Weapon | R | 4 | 12/0 | aggro | flanking_fire, alpha_strike, priority_fire |
| 896 | glass_round | Glass Round | Weapon | R | 5 | 16/0 | control | phase_drive, radiation_leak, critical_strike |
| 897 | lance_elite | Lance Elite | Drone | R | 4 | 7/5 | aggro | rapid_launch, priority_fire, outrider |
| 898 | siege_lattice | Siege Lattice | Defense | R | 4 | 0/13 | midrange | interceptor, ablative_plating, reinforced_hull |
| 899 | master_hunter_ai | Master Hunter AI | AI Routine | R | 4 | 0/13 | combo | persistent_field, tracking_lock, critical_strike |
| 900 | arc_warhead | Arc Warhead | Module | R | 4 | 0/0 | aggro | breach_cascade, chain_catalyst, overflow_fire |

## Batch 10 — Mythics + Dual-Identity + Escalation (FINAL)

**Cards:** 100 * **File:** `batch_10.json`

Distribution:
- Rarity: 20 mythic * 8 rare * 47 uncommon * 25 common
- Types: Drone 34 * AI Routine 16 * Weapon 12 * Module 11 * Defense 9 * Maneuver 7 * Equipment 5 * Field 4 * Ship Core 2
- Archetype: 29 midrange * 19 combo * 17 utility * 15 ramp * 13 aggro * 7 control
- 20 mythics with signature once-per-match effects (Rule 2)
- ~25 dual-identity flip cards (Part 10A)
- ~20 escalation cards (Part 10B)
- ~10 stacked-attack cards (Part 10D)

### Cards

| # | id | name | type | rarity | cost | A/D | archetype | keywords |
|---|---|---|---|---|---|---|---|---|
| 901 | quantum_convergence | Quantum Convergence | Maneuver | M | 8 | 0/0 | combo | priority_fire, alpha_strike, critical_strike |
| 902 | reality_collapse | Reality Collapse | Module | M | 6 | 0/0 | control |  |
| 903 | singularity_core | Quantum Core: Singularity | Ship Core | M | 0 | 0/0 | combo | persistent_field |
| 904 | star_eater | Star-Eater | Weapon | M | 8 | 32/0 | aggro | priority_fire, breach_cascade, overflow_fire, radiation_leak |
| 905 | the_first_and_last | The First and Last | AI Routine | M | 7 | 0/28 | midrange | persistent_field, adaptive_learning, cascading_power |
| 906 | worldbreaker | Worldbreaker | Drone | M | 8 | 20/20 | aggro | priority_fire, critical_strike, rapid_launch, breach_cascade |
| 907 | extinction | Extinction | Module | M | 8 | 0/0 | aggro | breach_cascade |
| 908 | time_lord | Time Lord | Maneuver | M | 7 | 0/0 | combo |  |
| 909 | the_infinite | The Infinite | AI Routine | M | 8 | 0/32 | combo | persistent_field, cascading_power, chain_catalyst, linked_fire |
| 910 | genesis | Genesis | Field | M | 7 | 0/0 | midrange | persistent_field, priority_fire, auto_repair |
| 911 | oblivion | Oblivion | Weapon | M | 7 | 28/0 | control | phase_drive, critical_strike, overflow_fire |
| 912 | apex_pilot_core | Apex Pilot Core | Ship Core | M | 0 | 0/0 | aggro |  |
| 913 | the_last_card | The Last Card | Module | M | 5 | 0/0 | ramp | endgame_protocol |
| 914 | infinity_gate | Infinity Gate | Field | M | 8 | 0/0 | utility | persistent_field, phase_drive, priority_fire |
| 915 | event_horizon | Event Horizon | Drone | M | 7 | 15/17 | control | interceptor, gain_stealth, phase_drive, critical_breach |
| 916 | the_unmaker | The Unmaker | Weapon | M | 8 | 30/0 | aggro | priority_fire, critical_strike, radiation_leak, overflow_fire |
| 917 | phoenix_ascendant | Phoenix Ascendant | AI Routine | M | 6 | 0/24 | ramp | persistent_field, emergency_reboot, auto_repair |
| 918 | the_void_queen | The Void Queen | Drone | M | 8 | 18/20 | midrange | rapid_launch, priority_fire, alpha_strike, battle_hardened |
| 919 | final_protocol | Final Protocol | AI Routine | M | 8 | 0/32 | aggro | persistent_field, priority_fire, rapid_launch, alpha_strike |
| 920 | the_bulwark_eternal | The Bulwark Eternal | Defense | M | 7 | 0/35 | midrange | interceptor, reinforced_hull, ablative_plating, emergency_reboot, auto_repair |
| 921 | scout_drone_alpha | Scout Drone Alpha | Drone | R | 2 | 1/4 | utility | deploy_burst, probe |
| 922 | missile_module_flip | Missile Module | Module | U | 2 | 0/0 | aggro |  |
| 923 | ghost_fighter | Ghost Fighter | Drone | U | 3 | 4/5 | utility | cloaked_entry |
| 924 | training_drone | Training Drone | Drone | C | 2 | 3/5 | midrange |  |
| 925 | sleeping_fortress | Sleeping Fortress | Defense | U | 3 | 0/8 | midrange | cold_boot |
| 926 | scout_probe | Scout Probe | Drone | C | 1 | 1/2 | utility | deploy_burst, probe |
| 927 | dormant_weapon | Dormant Weapon | Weapon | C | 1 | 3/0 | midrange | cold_boot |
| 928 | patient_rook | Patient Rook | Drone | C | 2 | 1/7 | midrange |  |
| 929 | quiet_engineer | Quiet Engineer | Drone | C | 2 | 1/4 | ramp |  |
| 930 | rookie_pilot | Rookie Pilot | Drone | C | 1 | 2/2 | aggro |  |
| 931 | new_hull | New Hull | Defense | C | 1 | 0/3 | midrange |  |
| 932 | eager_bomb | Eager Bomb | Module | C | 2 | 0/0 | aggro |  |
| 933 | charging_capacitor | Charging Capacitor | Weapon | U | 2 | 5/0 | midrange |  |
| 934 | patient_wreck | Patient Wreck | Drone | U | 2 | 2/3 | midrange |  |
| 935 | growing_threat | Growing Threat | Drone | U | 2 | 1/4 | midrange |  |
| 936 | slow_burn | Slow Burn | Weapon | U | 2 | 5/0 | midrange |  |
| 937 | building_shield | Building Shield | Defense | U | 2 | 0/5 | midrange |  |
| 938 | feeding_ai | Feeding AI | AI Routine | U | 2 | 0/5 | midrange | persistent_field |
| 939 | cold_start_drone | Cold Start Drone | Drone | U | 2 | 1/4 | midrange | cold_boot |
| 940 | stacking_laser | Stacking Laser | Weapon | U | 3 | 8/0 | combo |  |
| 941 | waking_titan | Waking Titan | Drone | U | 3 | 3/5 | midrange |  |
| 942 | patient_sniper | Patient Sniper | Weapon | U | 2 | 5/0 | combo | manual_fire |
| 943 | ancient_engine | Ancient Engine | AI Routine | U | 3 | 0/8 | ramp | persistent_field |
| 944 | building_armor | Building Armor | Equipment | U | 2 | 0/0 | midrange |  |
| 945 | growing_arsenal | Growing Arsenal | Equipment | U | 2 | 0/0 | combo |  |
| 946 | slow_flame | Slow Flame | AI Routine | U | 2 | 0/8 | control | persistent_field, radiation_leak |
| 947 | ascending_drone | Ascending Drone | Drone | U | 3 | 3/5 | midrange |  |
| 948 | tempered_fortress | Tempered Fortress | Defense | U | 3 | 0/8 | midrange | battle_hardened |
| 949 | evolving_ai | Evolving AI | AI Routine | U | 3 | 0/8 | ramp | adaptive_learning |
| 950 | fleet_momentum | Fleet Momentum | Field | U | 3 | 0/0 | aggro | persistent_field |
| 951 | aim_protocol | Aim Protocol | Maneuver | U | 1 | 0/0 | combo |  |
| 952 | lock_protocol | Lock Protocol | Maneuver | U | 1 | 0/0 | combo | tracking_lock |
| 953 | fire_protocol | Fire Protocol | Maneuver | U | 2 | 0/0 | combo | critical_strike |
| 954 | twin_aim | Twin Aim | Weapon | U | 3 | 0/8 | combo | cold_boot, priority_fire, critical_strike |
| 955 | siege_targeter | Siege Targeter | AI Routine | U | 3 | 0/8 | combo | persistent_field |
| 956 | three_turn_strike | Three-Turn Strike | Module | U | 2 | 0/0 | combo |  |
| 957 | patience_drone | Patience Drone | Drone | U | 3 | 2/6 | combo | cold_boot, critical_strike |
| 958 | staggered_warhead | Staggered Warhead | Weapon | R | 4 | 12/0 | combo |  |
| 959 | windup_cannon | Windup Cannon | Weapon | R | 4 | 12/0 | combo | cold_boot, manual_fire, priority_fire |
| 960 | staged_assault | Staged Assault | AI Routine | R | 4 | 0/12 | combo | persistent_field |
| 961 | veiled_sentinel | Veiled Sentinel | Drone | R | 4 | 3/9 | control | cloaked_entry |
| 962 | quiet_fortress | Quiet Fortress | Defense | R | 4 | 0/12 | midrange | cold_boot |
| 963 | shadow_agent | Shadow Agent | Drone | R | 3 | 4/4 | utility | gain_stealth |
| 964 | larval_warship | Larval Warship | Drone | U | 3 | 2/6 | midrange |  |
| 965 | decoy_runner | Decoy Runner | Drone | U | 2 | 1/4 | utility |  |
| 966 | dormant_lord | Dormant Lord | Drone | R | 5 | 2/14 | midrange | cold_boot |
| 967 | hidden_warhead | Hidden Warhead | Module | U | 2 | 0/0 | aggro |  |
| 968 | silent_pilot | Silent Pilot | Drone | U | 3 | 4/4 | utility | gain_stealth |
| 969 | dreaming_fortress | Dreaming Fortress | Defense | U | 3 | 0/8 | midrange |  |
| 970 | trading_barge | Trading Barge | Drone | U | 3 | 1/7 | ramp | end_cycle |
| 971 | observer_module | Observer Module | AI Routine | U | 2 | 0/5 | utility | persistent_field, end_cycle, probe |
| 972 | sapling_fighter | Sapling Fighter | Drone | U | 2 | 2/3 | midrange |  |
| 973 | meditating_ai | Meditating AI | AI Routine | U | 2 | 0/5 | ramp | cold_boot, persistent_field |
| 974 | growing_cannon | Growing Cannon | Weapon | U | 2 | 5/0 | combo |  |
| 975 | hidden_ai | Hidden AI | AI Routine | C | 2 | 0/5 | utility | gain_stealth |
| 976 | waiting_probe | Waiting Probe | Drone | C | 1 | 2/2 | utility |  |
| 977 | slow_shield | Slow Shield | Defense | C | 1 | 0/3 | midrange |  |
| 978 | scavenger_ai | Scavenger AI | AI Routine | U | 2 | 0/5 | ramp | persistent_field, fuel_scavenge |
| 979 | pilot_trainee | Pilot Trainee | Drone | C | 1 | 1/2 | utility |  |
| 980 | old_freighter | Old Freighter | Drone | C | 2 | 1/4 | ramp | end_cycle |
| 981 | small_patrol | Small Patrol | Drone | C | 2 | 2/3 | utility | deploy_burst, probe |
| 982 | scout_glider | Scout Glider | Drone | C | 1 | 1/2 | utility | skyward_maneuver |
| 983 | recycled_hull | Recycled Hull | Defense | C | 2 | 0/6 | midrange |  |
| 984 | field_welder | Field Welder | Drone | C | 2 | 1/4 | ramp | auto_repair, end_cycle |
| 985 | quiet_warhead | Quiet Warhead | Module | C | 2 | 0/0 | aggro |  |
| 986 | simple_heal | Simple Heal | Module | C | 1 | 0/0 | ramp |  |
| 987 | targeting_lens | Targeting Lens | Equipment | C | 1 | 0/0 | combo |  |
| 988 | reserve_plating | Reserve Plating | Equipment | C | 1 | 0/0 | midrange |  |
| 989 | basic_module | Basic Module | Module | C | 1 | 0/0 | utility |  |
| 990 | gravity_boot | Gravity Boot | Equipment | U | 2 | 0/0 | utility | phase_drive |
| 991 | backup_ai | Backup AI | AI Routine | U | 2 | 0/5 | ramp | persistent_field, emergency_reboot |
| 992 | fast_maneuver | Fast Maneuver | Maneuver | C | 1 | 0/0 | utility | evade |
| 993 | field_technician | Field Technician | Drone | U | 2 | 2/4 | ramp | end_cycle |
| 994 | pressure_mine | Pressure Mine | Field | U | 2 | 0/0 | control | persistent_field |
| 995 | recon_team | Recon Team | Drone | U | 2 | 2/4 | utility | deploy_burst, probe |
| 996 | veteran_engineer | Veteran Engineer | Drone | U | 3 | 2/6 | ramp | auto_repair, end_cycle |
| 997 | small_ambush | Small Ambush | Maneuver | U | 2 | 0/0 | control | reactive, priority_fire |
| 998 | standard_missile | Standard Missile | Module | C | 2 | 0/0 | aggro |  |
| 999 | quiet_listener | Quiet Listener | AI Routine | C | 2 | 0/5 | ramp | persistent_field, end_cycle |
| 1000 | patient_bomber | Patient Bomber | Drone | U | 3 | 3/5 | midrange | cold_boot, critical_breach |

---

## SET COMPLETE — 1000 cards

**Rarity totals (Part 5 targets, all hit exactly):**
- Common: 400 / 400
- Uncommon: 280 / 280
- Rare: 160 / 160
- Epic: 90 / 90
- Legendary: 50 / 50
- Mythic: 20 / 20

**Archetype totals (Part 8 targets, all within tolerance):**
- Aggro: 192 / 200 (-8)
- Control: 194 / 200 (-6)
- Midrange: 252 / 250 (+2)
- Combo: 156 / 150 (+6)
- Ramp: 87 / 80 (+7)
- Utility: 119 / 120 (-1)

**Cross-batch audit (all 1000 cards):**
- 0 duplicate names
- 0 duplicate IDs
- 0 flavor text violations (all within 8-15 words)
- All 78 Part-9 keywords present at least once
- All 9 card types represented
