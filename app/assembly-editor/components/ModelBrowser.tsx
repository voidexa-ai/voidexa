'use client'

import { useMemo, useRef, useState } from 'react'
import { useModelCatalog } from '../hooks/useModelCatalog'
import { useEditorStore } from '../hooks/useEditorStore'
import { CATEGORY_ORDER, type ModelEntry } from '../lib/editorTypes'
import { ModelPreview } from './ModelPreview'

// Individual equipment parts that have cockpit-relative positions baked into
// their vertex data. Loaded with preserveOrigin=true so each sits at its
// authored offset. Replaces the single hirez_equipments combined piece
// (which spreads parts in a line along Z instead of nesting them in the cockpit).
const EQUIPMENT_PARTS = [
  'equipment_cockpitequipments_seat_mesh_650',
  'equipment_cockpitequipments_joystick1_base_mesh_652',
  'equipment_cockpitequipments_joystick1_handle_mesh_653',
  'equipment_cockpitequipments_joystick2_base_mesh_643',
  'equipment_cockpitequipments_joystick2_handle_mesh_644',
  'equipment_cockpitequipments_screen1_mesh_632',
  'equipment_cockpitequipments_screen2_mesh_633',
  'equipment_cockpitequipments_hud_mesh_628',
  'equipment_cockpitequipments_throttlecontro1_base_mesh_645',
  'equipment_cockpitequipments_throttlecontrol2_base_mesh_648',
]

// 5 synthetic "Complete Cockpit" presets. Clicking one loads the frame +
// interior + screens (combined) + individual equipment parts, all at origin
// with preserveOrigin=true so they nest as the artist intended.
const COMPLETE_COCKPIT_PRESETS: Array<{
  label: string
  slugs: string[]
}> = [1, 2, 3, 4, 5].map((n) => {
  const id = String(n).padStart(2, '0')
  return {
    label: `Cockpit ${id} (complete)`,
    slugs: [
      `hirez_cockpit${id}`,
      `hirez_cockpit${id}_interior`,
      'hirez_screens',
      ...EQUIPMENT_PARTS,
    ],
  }
})

export function ModelBrowser() {
  const { catalog, loading, error } = useModelCatalog()
  const addModel = useEditorStore((s) => s.addModel)
  const addMatchedSet = useEditorStore((s) => s.addMatchedSet)
  const setCameraPreset = useEditorStore((s) => s.setCameraPreset)
  const [filter, setFilter] = useState('')
  const [openCat, setOpenCat] = useState<Record<string, boolean>>({
    'Complete Cockpits': true,
    'Cockpit Frames': true,
    'Cockpit Interiors': true,
  })

  // Hover-preview state. We wait ~260ms before showing so moving the mouse
  // across the list doesn't flicker through every item.
  const [hover, setHover] = useState<{ entry: ModelEntry; x: number; y: number } | null>(null)
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const onEnter = (entry: ModelEntry, e: React.MouseEvent<HTMLElement>) => {
    const x = e.clientX
    const y = e.clientY
    if (hoverTimer.current) clearTimeout(hoverTimer.current)
    hoverTimer.current = setTimeout(() => setHover({ entry, x, y }), 260)
  }
  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    setHover((prev) => (prev ? { ...prev, x: e.clientX, y: e.clientY } : prev))
  }
  const onLeave = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current)
    hoverTimer.current = null
    setHover(null)
  }

  const catalogBySlug = useMemo(() => {
    const map = new Map<string, ModelEntry>()
    for (const e of catalog) map.set(e.name, e)
    return map
  }, [catalog])

  // Synthetic Complete Cockpit entries — surfaced at the top of the library
  // using the frame slug for the hover preview. Clicking loads all slugs.
  const completeCockpitEntries = useMemo<ModelEntry[]>(() => {
    const out: ModelEntry[] = []
    for (const preset of COMPLETE_COCKPIT_PRESETS) {
      const frame = catalogBySlug.get(preset.slugs[0])
      if (!frame) continue
      out.push({
        name: preset.label,
        url: frame.url,
        category: 'Complete Cockpits',
        size: frame.size,
        displayName: preset.label,
      })
    }
    return out
  }, [catalogBySlug])

  const loadPreset = (preset: (typeof COMPLETE_COCKPIT_PRESETS)[number]) => {
    const pieces = preset.slugs
      .map((slug) => catalogBySlug.get(slug))
      .filter((e): e is ModelEntry => !!e)
    if (pieces.length === 0) return
    addMatchedSet(pieces)
    setCameraPreset('pilot')
  }

  const grouped = useMemo(() => {
    const g: Record<string, ModelEntry[]> = { 'Complete Cockpits': completeCockpitEntries }
    const f = filter.trim().toLowerCase()
    for (const e of catalog) {
      const haystack = (e.displayName || e.name).toLowerCase() + ' ' + e.name.toLowerCase()
      if (f && !haystack.includes(f)) continue
      if (!g[e.category]) g[e.category] = []
      g[e.category].push(e)
    }
    // Filter doesn't apply to Complete Cockpits unless actively searching.
    if (f) {
      g['Complete Cockpits'] = completeCockpitEntries.filter((e) => e.name.toLowerCase().includes(f))
      if (g['Complete Cockpits'].length === 0) delete g['Complete Cockpits']
    }
    return g
  }, [catalog, filter, completeCockpitEntries])

  const orderedCats = useMemo(() => {
    const known = CATEGORY_ORDER.filter((c) => grouped[c]?.length)
    const extras = Object.keys(grouped).filter((c) => !CATEGORY_ORDER.includes(c))
    return [...known, ...extras]
  }, [grouped])

  return (
    <aside
      style={{
        width: 260,
        minWidth: 260,
        background: 'rgba(10, 8, 25, 0.95)',
        borderRight: '1px solid rgba(168, 85, 247, 0.2)',
        color: '#e5e5f0',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <div style={{ padding: 14, borderBottom: '1px solid rgba(168, 85, 247, 0.15)' }}>
        <div
          style={{
            fontSize: 13,
            letterSpacing: 1,
            color: '#00d4ff',
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          Model Library
        </div>
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Search models..."
          style={{
            width: '100%',
            background: 'rgba(0,0,0,0.4)',
            border: '1px solid rgba(0, 212, 255, 0.25)',
            color: '#e5e5f0',
            padding: '7px 10px',
            borderRadius: 6,
            fontSize: 14,
            outline: 'none',
          }}
        />
        {loading && <div style={{ fontSize: 13, opacity: 0.7, marginTop: 8 }}>Loading catalog...</div>}
        {error && <div style={{ fontSize: 13, color: '#ff6b9d', marginTop: 8 }}>{error}</div>}
        {!loading && !error && catalog.length === 0 && (
          <div style={{ fontSize: 13, opacity: 0.7, marginTop: 8 }}>No models in bucket.</div>
        )}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '6px 4px' }}>
        {orderedCats.map((cat) => {
          const items = grouped[cat] || []
          const open = openCat[cat] ?? filter.length > 0
          const isCompleteCockpits = cat === 'Complete Cockpits'
          return (
            <div key={cat} style={{ marginBottom: 4 }}>
              <button
                onClick={() => setOpenCat((s) => ({ ...s, [cat]: !open }))}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  background: 'transparent',
                  border: 'none',
                  color: isCompleteCockpits ? '#00d4ff' : '#a855f7',
                  fontSize: 14,
                  fontWeight: 600,
                  padding: '6px 10px',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span>
                  {cat} <span style={{ opacity: 0.55 }}>({items.length})</span>
                </span>
                <span style={{ fontSize: 12 }}>{open ? '▾' : '▸'}</span>
              </button>
              {open &&
                items.map((entry) => {
                  const label = entry.displayName || entry.name
                  const preset = isCompleteCockpits
                    ? COMPLETE_COCKPIT_PRESETS.find((p) => p.label === entry.name)
                    : undefined
                  return (
                    <button
                      key={entry.name}
                      onClick={() => {
                        if (preset) loadPreset(preset)
                        // Split equipment/screen parts have world-space positions
                        // baked into their vertex data. preserveOrigin keeps them
                        // at their cockpit-relative position instead of recentering.
                        else if (cat === 'Individual Parts') addModel(entry, { preserveOrigin: true })
                        else addModel(entry)
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(0, 212, 255, 0.12)'
                        onEnter(entry, e)
                      }}
                      onMouseMove={onMove}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = isCompleteCockpits
                          ? 'rgba(0, 212, 255, 0.10)'
                          : 'rgba(30, 24, 60, 0.55)'
                        onLeave()
                      }}
                      style={{
                        width: 'calc(100% - 8px)',
                        margin: '2px 4px',
                        textAlign: 'left',
                        background: isCompleteCockpits ? 'rgba(0, 212, 255, 0.10)' : 'rgba(30, 24, 60, 0.55)',
                        border: isCompleteCockpits
                          ? '1px solid rgba(0, 212, 255, 0.35)'
                          : '1px solid rgba(0, 212, 255, 0.12)',
                        color: '#e5e5f0',
                        padding: '6px 10px',
                        borderRadius: 5,
                        cursor: 'pointer',
                        fontSize: 13,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                      title={preset ? `Load ${entry.name} (4 pieces at origin)` : `Add ${label}`}
                    >
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {label}
                      </span>
                      <span style={{ color: '#00d4ff', fontSize: 16, marginLeft: 6 }}>+</span>
                    </button>
                  )
                })}
            </div>
          )
        })}
      </div>

      {hover && <ModelPreview url={hover.entry.url} name={hover.entry.displayName || hover.entry.name} x={hover.x} y={hover.y} />}
    </aside>
  )
}
