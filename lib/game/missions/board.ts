/**
 * Phase 1b — Mission Board 8-mission MVP seed.
 * Source of truth: docs/VOIDEXA_GAMING_COMBINED_V3.md PART 4.
 */

export type MissionCategory = 'Courier' | 'Rush' | 'Hunt' | 'Recovery' | 'Signal'

export type MissionRisk = 'Safe' | 'Low' | 'Contested' | 'Wreck Risk' | 'Timed' | 'Ranked' | 'Medium'

export type CastIssuer = 'jix' | 'claude' | 'gpt' | 'gemini' | 'perplexity' | 'llama'

export interface MissionTemplate {
  id: string
  name: string
  category: MissionCategory
  issuer: CastIssuer
  timeEstimate: string
  rewardMin: number
  rewardMax: number
  risk: MissionRisk
  recommended?: boolean
  description: string
  quote: string
  objective: string
  encounterChance: string
}

export const CAST_META: Readonly<Record<CastIssuer, { name: string; role: string; avatar: string }>> = {
  jix: { name: 'Jix', role: 'Founder', avatar: '/images/cast/jix.jpg' },
  claude: { name: 'Claude', role: 'Chief Architect', avatar: '/images/cast/claude.jpg' },
  gpt: { name: 'GPT', role: 'Lead Developer', avatar: '/images/cast/gpt.jpg' },
  gemini: { name: 'Gemini', role: 'Senior Reviewer', avatar: '/images/cast/gemini.jpg' },
  perplexity: { name: 'Perplexity', role: 'Fact Checker', avatar: '/images/cast/perplexity.jpg' },
  llama: { name: 'Llama', role: 'Scout', avatar: '/images/cast/llama.jpg' },
}

export const RISK_META: Readonly<Record<MissionRisk, { color: string; bg: string; label: string }>> = {
  Safe: { color: '#7fff9f', bg: 'rgba(127,255,159,0.14)', label: 'Safe' },
  Low: { color: '#b3ff8f', bg: 'rgba(179,255,143,0.14)', label: 'Low' },
  Medium: { color: '#ffd166', bg: 'rgba(255,209,102,0.14)', label: 'Medium' },
  Contested: { color: '#ffb347', bg: 'rgba(255,179,71,0.14)', label: 'Contested' },
  'Wreck Risk': { color: '#ff6b6b', bg: 'rgba(255,107,107,0.14)', label: 'Wreck Risk' },
  Timed: { color: '#5ac8fa', bg: 'rgba(90,200,250,0.14)', label: 'Timed' },
  Ranked: { color: '#af52de', bg: 'rgba(175,82,222,0.14)', label: 'Ranked' },
}

export const CATEGORY_META: Readonly<Record<MissionCategory, { color: string; icon: string }>> = {
  Courier: { color: '#00d4ff', icon: '◈' },
  Rush: { color: '#ff8a3c', icon: '➤' },
  Hunt: { color: '#ff6b6b', icon: '✖' },
  Recovery: { color: '#7fff9f', icon: '⧗' },
  Signal: { color: '#af52de', icon: '⎔' },
}

export const MISSION_TEMPLATES: readonly MissionTemplate[] = [
  {
    id: 'local_parcel_run',
    name: 'Local Parcel Run',
    category: 'Courier',
    issuer: 'perplexity',
    timeEstimate: '6–8 min',
    rewardMin: 40,
    rewardMax: 60,
    risk: 'Safe',
    recommended: true,
    description: 'Routine inner-ring delivery. One checkpoint, clean skies. Good for first flights.',
    quote: '"Cross-referenced the route. No active warnings. Perfect first run."',
    objective: 'Pick up a sealed parcel at Voidexa Hub and deliver it to Station Alpha within the time window.',
    encounterChance: 'Core zone — 0–1 encounter rolls per trip. Usually quiet.',
  },
  {
    id: 'priority_courier',
    name: 'Priority Courier',
    category: 'Courier',
    issuer: 'claude',
    timeEstimate: '8–10 min',
    rewardMin: 70,
    rewardMax: 90,
    risk: 'Low',
    recommended: true,
    description: 'Time-sensitive data crystal for a corporate client. Two checkpoints, mid-ring traffic.',
    quote: '"Architectural specs. Sign-off is waiting on delivery. Don\'t miss the window."',
    objective: 'Transport a priority data crystal across two checkpoints. Bonus GHAI if delivered early.',
    encounterChance: 'Mid ring — 1–2 encounter rolls per trip. Mostly navigation.',
  },
  {
    id: 'black_route_contract',
    name: 'Black Route Contract',
    category: 'Courier',
    issuer: 'jix',
    timeEstimate: '12–15 min',
    rewardMin: 160,
    rewardMax: 220,
    risk: 'Wreck Risk',
    description: 'Unregistered cargo. Deep Void corridor. No questions, full payout. Don\'t get scanned.',
    quote: '"Du skal ikke vide hvad det er. Bare lever det. Og hvis patruljen dukker op — dump lasten eller kæmp."',
    objective: 'Transport sealed contraband through the Deep Void corridor. Evade patrols or drop cargo.',
    encounterChance: 'Deep Void — 3–5 encounter rolls per trip. Pirates, patrols, wreck risk.',
  },
  {
    id: 'relay_sprint',
    name: 'Relay Sprint',
    category: 'Rush',
    issuer: 'llama',
    timeEstimate: '3–5 min',
    rewardMin: 20,
    rewardMax: 35,
    risk: 'Safe',
    description: 'Short course around three beacon pylons. Pure speed, no combat.',
    quote: '"bro bare fly hurtigt 3 ringe og hjem igen. nemme penge lmao"',
    objective: 'Pass through 3 beacon pylons in order, shortest time wins bronze/silver/gold.',
    encounterChance: 'Closed course — no encounters. All skill.',
  },
  {
    id: 'sector_grand_prix',
    name: 'Sector Grand Prix',
    category: 'Rush',
    issuer: 'gpt',
    timeEstimate: '6–8 min',
    rewardMin: 50,
    rewardMax: 80,
    risk: 'Safe',
    recommended: true,
    description: 'Full sector lap. Eight checkpoints, narrow gates, optional boost pickups.',
    quote: '"Full spec: eight gates, two optional boost rings, one hairpin through the debris belt. Execute."',
    objective: 'Complete the sector lap through all 8 gates. Medals based on lap time.',
    encounterChance: 'Closed course — no encounters. Boost pickups available.',
  },
  {
    id: 'distress_ping',
    name: 'Distress Ping',
    category: 'Recovery',
    issuer: 'gemini',
    timeEstimate: '8–12 min',
    rewardMin: 90,
    rewardMax: 140,
    risk: 'Low',
    description: 'A pilot\'s beacon is pinging in the mid ring. Tow them back and earn reputation.',
    quote: '"Reviewed the signal pattern — it\'s a real pilot, not a trap. Standard tow, solid reputation gain."',
    objective: 'Locate the distressed pilot, attach tow cable, return to nearest station. Paid by distance.',
    encounterChance: 'Mid ring — 1–2 encounter rolls. Occasional opportunist pirate.',
  },
  {
    id: 'derelict_breach',
    name: 'Derelict Breach',
    category: 'Hunt',
    issuer: 'gpt',
    timeEstimate: '12–18 min',
    rewardMin: 120,
    rewardMax: 180,
    risk: 'Medium',
    description: 'An abandoned hauler is broadcasting an old access code. Breach, clear hostiles, loot.',
    quote: '"Pre-war salvage. Expect 2–3 automated drones still running. Bring defense cards."',
    objective: 'Dock with the derelict, clear drones, extract salvage. Card battle on breach.',
    encounterChance: 'Guaranteed combat encounter on breach. 2–3 drone waves.',
  },
  {
    id: 'pirate_nest_raid',
    name: 'Pirate Nest Raid',
    category: 'Hunt',
    issuer: 'jix',
    timeEstimate: '18–25 min',
    rewardMin: 220,
    rewardMax: 320,
    risk: 'Wreck Risk',
    description: 'A known pirate cluster is squatting in the outer ring. Clear it. Keep everything that floats after.',
    quote: '"De har hugget fra vores rute i tre uger. Tag dem, og hvad de har stjålet er dit."',
    objective: 'Destroy the pirate base. Loot drops proportional to damage dealt. Wreck protected 10 min.',
    encounterChance: 'Outer ring — 2–4 encounter rolls plus boss fight. High wreck risk.',
  },
] as const

export function getMissionById(id: string): MissionTemplate | undefined {
  return MISSION_TEMPLATES.find(m => m.id === id)
}

export const MISSION_CATEGORIES: readonly MissionCategory[] = [
  'Courier', 'Rush', 'Hunt', 'Recovery', 'Signal',
]
