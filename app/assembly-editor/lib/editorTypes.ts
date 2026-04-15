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
}

export interface ModelEntry {
  name: string
  url: string
  category: string
  size: number
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

export const CATEGORY_ORDER = [
  'Cockpit Frames',
  'Cockpit Interiors',
  'Equipment',
  'Screens',
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
  if (n.startsWith('hirez_equipment')) return 'Equipment'
  if (n.startsWith('hirez_screen')) return 'Screens'
  if (n.startsWith('hirez_ship')) return 'Hi-Rez Ships'
  if (n.startsWith('uscx_')) return 'Ships (USC-X)'
  if (n.startsWith('usc_')) return 'Ships (USC)'
  if (n.startsWith('qs_')) return 'Ships (Quaternius)'
  return 'Other'
}
