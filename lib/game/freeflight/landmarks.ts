/**
 * Sprint 2 — Task 1: 20 named landmarks for /freeflight.
 * Source: docs/VOIDEXA_UNIVERSE_CONTENT.md SECTION 1, rows 1–15 (Core) + 16–20 (Inner Ring).
 *
 * Coordinates are placed deterministically in a 3D sphere:
 *   Core Zone   — radius 60–130 from origin, all quadrants
 *   Inner Ring  — radius 170–240, all quadrants
 *
 * Every landmark has a visual type driving which primitive geometry
 * `components/freeflight/environment/Landmarks.tsx` renders.
 */

export type LandmarkZone = 'Core Zone' | 'Inner Ring'

export type LandmarkType =
  | 'station'
  | 'monument'
  | 'training_ring'
  | 'beacon_garden'
  | 'bio_dome'
  | 'relay'
  | 'gate_marker'
  | 'waypoint_path'
  | 'refinery'
  | 'data_vault'
  | 'agri_orbital'

export interface LandmarkDef {
  id: string
  name: string
  zone: LandmarkZone
  type: LandmarkType
  x: number
  y: number
  z: number
  /** Emissive color hex — drives how the landmark glows at distance. */
  color: string
  /** Scale multiplier applied to the primitive geometry. */
  scale: number
  /** Shown when the player is in scan range — pulled from doc's visual description. */
  scanText: string
  /** Shown in the lore popup when scanned — doc's lore snippet. */
  loreSnippet: string
  /** Doc's gameplay hook — used as a subtitle in the popup. */
  hook: string
}

export const LANDMARKS: readonly LandmarkDef[] = [
  // ─── Core Zone — 15 landmarks ────────────────────────────────────────────
  {
    id: 'break_room_halo',
    name: 'Break Room Halo',
    zone: 'Core Zone',
    type: 'station',
    x: 0, y: 35, z: 45,
    color: '#ffba60',
    scale: 1.6,
    scanText: 'A bright ring station with rotating café windows and soft amber beacons. Cargo drones zip between glass corridors.',
    loreSnippet: 'Built as the first neutral stop for new pilots, it became the unofficial heart of civilian traffic. Every cast member has, at some point, claimed to "own" a chair here.',
    hook: 'Safe social hub, light shops, tutorial chatter.',
  },
  {
    id: 'stones_of_hush',
    name: 'The Stones of Hush',
    zone: 'Core Zone',
    type: 'monument',
    x: -70, y: -40, z: -55,
    color: '#af52de',
    scale: 1.0,
    scanText: 'Six black stone obelisks drift in perfect balance around a silent transmitter. Faint light pulses under their surfaces.',
    loreSnippet: 'Nobody agrees who placed them. Pilots swear the Stones respond differently depending on who approaches first.',
    hook: 'Intro scanning puzzle, lore fragment drops.',
  },
  {
    id: 'dock_nine_lark',
    name: 'Dock Nine-Lark',
    zone: 'Core Zone',
    type: 'station',
    x: 95, y: 10, z: 20,
    color: '#7fd8ff',
    scale: 1.3,
    scanText: 'A compact training dock painted in chipped teal, surrounded by target drones and luminous lane markers.',
    loreSnippet: 'Once a repair yard, it was repurposed when flight schools outgrew the first station. Local instructors insist the scratches on the hull are "historical texture."',
    hook: 'Flight tutorial, time-trial practice.',
  },
  {
    id: 'bobs_first_loop',
    name: "Bob's First Loop",
    zone: 'Core Zone',
    type: 'training_ring',
    x: 40, y: 60, z: -40,
    color: '#7fff9f',
    scale: 1.2,
    scanText: 'A circular buoy course floating around a small blue-white reactor node. Each buoy projects cheerful arrows.',
    loreSnippet: 'Named after the free starter ship, this loop taught generations of pilots how not to panic-spin into a wall. The current record holder refuses interviews.',
    hook: 'Tutorial race, early Rush unlock.',
  },
  {
    id: 'warm_coil_market',
    name: 'Warm Coil Market',
    zone: 'Core Zone',
    type: 'station',
    x: -80, y: 25, z: 35,
    color: '#ff9447',
    scale: 1.4,
    scanText: 'A loose spiral of merchant pods wrapped around a glowing heat radiator. Neon cargo tags flicker in many languages.',
    loreSnippet: 'It began as an illegal swap meet and was legalized when officials realized half the zone already used it. Good coffee, suspicious parts, excellent gossip.',
    hook: 'Shop hub, daily trade deals, rumor board.',
  },
  {
    id: 'lantern_verge',
    name: 'Lantern Verge',
    zone: 'Core Zone',
    type: 'beacon_garden',
    x: 65, y: -35, z: 70,
    color: '#ffd166',
    scale: 1.5,
    scanText: 'Hundreds of tiny lantern buoys drift like stars within stars. They emit soft musical chimes.',
    loreSnippet: 'Families launched the first lanterns to mark safe return routes. New lanterns still appear after major community events.',
    hook: 'Relaxed discovery spot, screenshot location.',
  },
  {
    id: 'glass_anchor',
    name: 'Glass Anchor',
    zone: 'Core Zone',
    type: 'station',
    x: 15, y: -80, z: -25,
    color: '#a8ecff',
    scale: 1.5,
    scanText: 'A crystal-paneled station tethered to a stubby asteroid by six silver trusses. Interior lights make it look warm from afar.',
    loreSnippet: 'Originally a mining office, it became a civic service hub after the mine ran dry. Nobody bothered changing the name.',
    hook: 'Insurance, recovery jobs, beginner salvage.',
  },
  {
    id: 'echo_gymnasium',
    name: 'Echo Gymnasium',
    zone: 'Core Zone',
    type: 'training_ring',
    x: 50, y: 85, z: 35,
    color: '#c8ffc8',
    scale: 1.3,
    scanText: 'Metallic cubes and rotating barriers float in a clean practice volume. Each obstacle emits projected route hints.',
    loreSnippet: 'Designed to train pilots in three-axis movement, it accidentally became the favorite place for show-offs. The station staff pretends to disapprove.',
    hook: 'Obstacle courses, advanced flight tutorial.',
  },
  {
    id: 'saffron_relay',
    name: 'Saffron Relay',
    zone: 'Core Zone',
    type: 'relay',
    x: 85, y: 55, z: 60,
    color: '#ffdd66',
    scale: 1.1,
    scanText: 'A slim saffron-yellow communications mast with spinning dishes and bright docking fins.',
    loreSnippet: 'The relay handled the first public broadcasts between rings. It still runs on patched hardware and stubborn optimism.',
    hook: 'Comms-themed couriers, quick scan tasks, lore audio logs.',
  },
  {
    id: 'pocket_orchard',
    name: 'Pocket Orchard',
    zone: 'Core Zone',
    type: 'bio_dome',
    x: -115, y: 20, z: -95,
    color: '#7fff7f',
    scale: 1.4,
    scanText: 'A sphere filled with green hydroponic terraces glows softly through transparent plating. Water droplets drift between branches.',
    loreSnippet: 'Built to keep crews sane on long shifts, it became the most fought-over lunch destination in the Core. Smugglers once hid in a melon shipment here for three days.',
    hook: 'Perishables trade source, social meeting point.',
  },
  {
    id: 'trimline_array',
    name: 'Trimline Array',
    zone: 'Core Zone',
    type: 'relay',
    x: 75, y: 20, z: -75,
    color: '#00d4ff',
    scale: 1.25,
    scanText: 'Three concentric rings of navigational lasers mark safe departures into the Inner Ring.',
    loreSnippet: 'Installed after early outbound traffic turned chaotic, the Array gave the Core its first proper traffic discipline. Pilots still ignore it when in a hurry.',
    hook: 'Navigation tutorial, timed departure missions.',
  },
  {
    id: 'hearth_span',
    name: 'Hearth Span',
    zone: 'Core Zone',
    type: 'station',
    x: -55, y: -70, z: 25,
    color: '#ffb3b3',
    scale: 1.3,
    scanText: 'Two small habitation hubs joined by a long illuminated bridge over open space.',
    loreSnippet: 'Couples, rivals, and exhausted crew all meet halfway on Hearth Span. The place has seen confessions, contracts, and one famous food fight.',
    hook: 'Dialogue hub, cast banter, escort pickup.',
  },
  {
    id: 'copper_wicket',
    name: 'Copper Wicket',
    zone: 'Core Zone',
    type: 'gate_marker',
    x: 130, y: 0, z: 0,
    color: '#cd7f32',
    scale: 1.4,
    scanText: 'A copper-orange arch with old analog light strips marking a major traffic exit.',
    loreSnippet: 'The Wicket predates most current transit standards. It remains in service because, in Jix\'s words, "it still works, so relax."',
    hook: 'Transition point to Inner Ring.',
  },
  {
    id: 'ember_canteen',
    name: 'Ember Canteen',
    zone: 'Core Zone',
    type: 'station',
    x: 25, y: -55, z: 95,
    color: '#ff8a3c',
    scale: 1.2,
    scanText: 'A squat diner station with glowing orange windows and docking pads shaped like petals.',
    loreSnippet: 'Truckers made it popular, racers made it legendary, and nobody can prove who first started serving soup in anti-grav bowls.',
    hook: 'Vendor hub, rumor chain starts.',
  },
  {
    id: 'chalk_run',
    name: 'The Chalk Run',
    zone: 'Core Zone',
    type: 'waypoint_path',
    x: -40, y: 75, z: -85,
    color: '#ffffff',
    scale: 1.0,
    scanText: 'A dashed trail of white training markers leading through easy debris.',
    loreSnippet: 'Pilots used mineral paint to mark the original path by hand. The digital version still keeps the old imperfect curves.',
    hook: 'Beginner courier and rush route.',
  },

  // ─── Inner Ring — 5 landmarks ────────────────────────────────────────────
  {
    id: 'vanta_trestle',
    name: 'Vanta Trestle',
    zone: 'Inner Ring',
    type: 'relay',
    x: 180, y: 65, z: -160,
    color: '#222233',
    scale: 1.6,
    scanText: 'A long black truss spanning two mining rocks, lined with blinking cargo rails.',
    loreSnippet: 'Built by a logistics company that wanted to "make distance feel owned." It succeeded for a while.',
    hook: 'Trade lane checkpoint, escort jobs.',
  },
  {
    id: 'helio_ward',
    name: 'Helio Ward',
    zone: 'Inner Ring',
    type: 'agri_orbital',
    x: 215, y: 85, z: 60,
    color: '#ffefb0',
    scale: 1.8,
    scanText: 'A terraced orbital clinic platform over a pale gold world. Med-shuttles flow in disciplined loops.',
    loreSnippet: 'The Ward made frontier medicine scalable. It also made stolen med-crates one of the ring\'s most persistent problems.',
    hook: 'Medical courier missions, rescue contracts.',
  },
  {
    id: 'needle_prospect',
    name: 'Needle Prospect',
    zone: 'Inner Ring',
    type: 'refinery',
    x: 170, y: -90, z: 150,
    color: '#5ac8fa',
    scale: 1.5,
    scanText: 'A thin spear-shaped asteroid wrapped in drilling scaffolds and blue flare vents.',
    loreSnippet: 'Prospectors nicknamed it the Needle before survey maps caught up. Half the crews here swear they\'ll retire soon.',
    hook: 'Raw materials source, mining missions.',
  },
  {
    id: 'orchard_meridian',
    name: 'Orchard Meridian',
    zone: 'Inner Ring',
    type: 'agri_orbital',
    x: -160, y: 110, z: -180,
    color: '#9cff9c',
    scale: 1.9,
    scanText: 'Green ring farms circle a cloud-banded planet, visible as bright bands from afar.',
    loreSnippet: 'The Meridian feeds half the Inner Ring\'s polite conversations and nearly all of its fruit pies. Pirates usually leave it alone out of superstition.',
    hook: 'Perishable haul source, convoy defense.',
  },
  {
    id: 'hollow_ledger',
    name: 'Hollow Ledger',
    zone: 'Inner Ring',
    type: 'data_vault',
    x: 195, y: -45, z: -210,
    color: '#d87fff',
    scale: 1.4,
    scanText: 'A cube station with mirrored faces and a narrow glowing seam.',
    loreSnippet: 'Corporations archive route history here, which makes it a magnet for spies and auditors.',
    hook: 'Recovery and signal missions, encrypted pickups.',
  },
] as const

export const LANDMARK_SCAN_RADIUS = 80
export const LANDMARK_VISIBLE_RADIUS = 400

export function getLandmarkById(id: string): LandmarkDef | undefined {
  return LANDMARKS.find(l => l.id === id)
}
