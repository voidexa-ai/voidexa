export type TransformMode = 'translate' | 'rotate' | 'scale'

export interface PlacedModel {
  id: string
  modelUrl: string
  modelName: string
  category: string
  position: [number, number, number]
  rotation: [number, number, number]
  scale: [number, number, number]
  visible: boolean
  opacity: number
  // When true, the renderer preserves the GLB's baked-in origin (no AABB
  // recenter). Required for matched-set pieces (frame+interior+equipment+
  // screens) that share a common world origin — recentering would shift
  // each piece independently and destroy the alignment.
  preserveOrigin?: boolean
  // VoidForge-generated instances carry role + lineage so the editor can show
  // which slot they fill and which generation they came from.
  generated?: boolean
  roleKey?: string
  voidforgeInstanceId?: string
}

export interface ModelEntry {
  name: string
  url: string
  category: string
  size: number
  // Human-readable label — falls back to name when missing.
  displayName?: string
}

export interface AssemblyConfig {
  name: string
  version: number
  created: string
  models: PlacedModel[]
  camera: {
    position: [number, number, number]
    target: [number, number, number]
  }
  metadata: {
    description?: string
    tags?: string[]
  }
}

// UI category order in the Model Library left panel. "Complete Cockpits" is
// a synthetic category containing click-to-add matched-set presets and
// always sits at the top. The rest of the order follows the user's spec.
export const CATEGORY_ORDER = [
  'Complete Cockpits',
  'Cockpit Frames',
  'Cockpit Interiors',
  'Equipment',
  'Screens',
  'Individual Parts',
  'Hi-Rez Ships',
  'Ships (USC)',
  'Ships (USC-X)',
  'Ships (Quaternius)',
  'Other',
]

export function deriveCategory(filename: string): string {
  const n = filename.replace(/\.glb$/i, '').toLowerCase()
  if (/^hirez_cockpit\d+_interior$/.test(n)) return 'Cockpit Interiors'
  if (/^hirez_cockpit\d+$/.test(n)) return 'Cockpit Frames'
  if (n === 'hirez_equipments') return 'Equipment'
  if (n === 'hirez_screens') return 'Screens'
  // Split pieces uploaded by scripts/split-glb-models.ts.
  if (n.startsWith('equipment_') || n.startsWith('screen_')) return 'Individual Parts'
  if (n.startsWith('hirez_equipment')) return 'Equipment'
  if (n.startsWith('hirez_screen')) return 'Screens'
  if (n.startsWith('hirez_ship')) return 'Hi-Rez Ships'
  if (n.startsWith('uscx_')) return 'Ships (USC-X)'
  if (n.startsWith('usc_')) return 'Ships (USC)'
  if (n.startsWith('qs_')) return 'Ships (Quaternius)'
  return 'Other'
}
