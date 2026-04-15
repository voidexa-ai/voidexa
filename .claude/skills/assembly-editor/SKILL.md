---
name: assembly-editor
description: Build and maintain the voidexa 3D Assembly Editor at /assembly-editor. Use this skill when working on the in-browser 3D scene builder, model placement tools, transform gizmos, export/import configs, assembly saving, or cockpit/station/scene composition tools. Triggers on any mention of "assembly editor", "3D editor", "scene builder", "cockpit editor", "position models", "export coordinates", "model placement", or "build tool" in the context of voidexa.
---

# 3D Assembly Editor — Build Skill

## Context
This is a page on voidexa.com (C:\Users\Jixwu\Desktop\voidexa) at route `/assembly-editor`.
It is a general-purpose 3D scene builder where the user:
1. Browses models from Supabase Storage (20+ .glb models, growing)
2. Clicks to add models to a 3D scene
3. Selects models with mouse click → transform gizmo appears
4. Moves/rotates/scales with mouse gizmo OR numeric sliders
5. Uses camera presets to check from all angles + pilot eye view
6. Exports a JSON config → paste to Claude Code for exact implementation
7. Saves/loads assemblies to Supabase for later editing

Read CLAUDE.md in this skill folder for full file structure, tech stack, and export format.

## Architecture

### State Management (Zustand)
```typescript
interface EditorState {
  // Scene
  placedModels: PlacedModel[]          // All models in scene
  selectedId: string | null            // Currently selected model UUID
  
  // Transform
  transformMode: 'translate' | 'rotate' | 'scale'
  snapEnabled: boolean
  snapValue: number                    // Default 0.1
  
  // History
  history: PlacedModel[][]             // Undo stack
  future: PlacedModel[][]              // Redo stack
  
  // Catalog
  modelCatalog: ModelEntry[]           // From Supabase bucket listing
  catalogLoading: boolean
  
  // Actions
  addModel: (entry: ModelEntry) => void
  removeModel: (id: string) => void
  selectModel: (id: string | null) => void
  updateTransform: (id: string, transform: Partial<Transform>) => void
  duplicateModel: (id: string) => void
  toggleVisibility: (id: string) => void
  undo: () => void
  redo: () => void
  setTransformMode: (mode: 'translate' | 'rotate' | 'scale') => void
  toggleSnap: () => void
  
  // Persistence
  exportConfig: () => AssemblyConfig
  importConfig: (config: AssemblyConfig) => void
  saveToSupabase: (name: string) => Promise<void>
  loadFromSupabase: (id: string) => Promise<void>
}

interface PlacedModel {
  id: string                           // UUID
  modelUrl: string                     // Supabase CDN URL
  modelName: string                    // e.g. "hirez_cockpit01"
  category: string                     // e.g. "cockpit_frame"
  position: [number, number, number]
  rotation: [number, number, number]   // Euler angles in radians
  scale: [number, number, number]
  visible: boolean
  opacity: number
}

interface ModelEntry {
  name: string                         // Filename without extension
  url: string                          // Full Supabase CDN URL
  category: string                     // Derived from name prefix
  size: number                         // File size in bytes
}
```

### Model Categories (derived from filename prefix)
```typescript
const CATEGORY_MAP: Record<string, string> = {
  'qs_': 'Ships (Quaternius)',
  'usc_': 'Ships (USC)',
  'uscx_': 'Ships (USC-X)',
  'hirez_cockpit': 'Cockpit Frames',       // cockpit[01-05].glb
  'hirez_cockpit.*_interior': 'Cockpit Interiors',  // cockpit[01-05]_interior.glb
  'hirez_equipments': 'Equipment',
  'hirez_screens': 'Screens',
  'hirez_ship': 'Hi-Rez Ships',
}
```

### Supabase Integration

**Fetch model catalog from storage bucket:**
```typescript
// List all objects in "models" bucket
const { data } = await supabase.storage.from('models').list('', {
  limit: 200,
  sortBy: { column: 'name', order: 'asc' }
})
// Build public URLs
const catalog = data.map(f => ({
  name: f.name.replace('.glb', ''),
  url: `${SUPABASE_URL}/storage/v1/object/public/models/${f.name}`,
  category: deriveCategory(f.name),
  size: f.metadata?.size || 0
}))
```

**Save/load assemblies:**
```sql
CREATE TABLE assembly_configs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  config_json JSONB NOT NULL,
  thumbnail_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE assembly_configs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own assemblies"
  ON assembly_configs FOR ALL
  USING ((SELECT auth.uid()) = user_id);
CREATE INDEX idx_assembly_user ON assembly_configs(user_id);
```

### 3D Viewport (EditorCanvas.tsx)

```
Canvas (R3F)
├── ambientLight (intensity 0.4)
├── directionalLight (position [5,10,5], intensity 0.8)
├── Grid (infiniteGrid, cellSize 0.5, sectionSize 5, fadeDistance 30)
├── OrbitControls (ref, enabled when NOT dragging gizmo)
├── For each placedModel:
│   ├── Suspense fallback={WireframeBox}
│   │   └── GLTFModel (url from Supabase)
│   └── if selected: TransformControls (mode, onObjectChange → updateTransform)
└── Environment (preset "night" or custom HDRI)
```

**Critical: TransformControls + OrbitControls conflict.**
When the user grabs the gizmo, OrbitControls must be disabled.
Use the `dragging-changed` event on TransformControls:
```typescript
controls.addEventListener('dragging-changed', (e) => {
  orbitControls.current.enabled = !e.value
})
```

### Layout (4-panel)

```
┌──────────────────────────────────────────────────────────────┐
│  TOOLBAR: [Move][Rotate][Scale] │ [Undo][Redo] │ [Grid:0.1] │ [Top][Front][Side][Pilot] │
├────────────┬─────────────────────────────────────┬───────────┤
│            │                                     │ HIERARCHY │
│   MODEL    │                                     │ - model1  │
│   BROWSER  │          3D VIEWPORT                │ - model2  │
│            │                                     │ - model3  │
│  [Ships]   │      (click to select,              ├───────────┤
│  [Cockpits]│       gizmo to transform)           │ TRANSFORM │
│  [Interior]│                                     │ X: [0.00] │
│  [Equip]   │                                     │ Y: [0.00] │
│  [Screens] │                                     │ Z: [0.00] │
│            │                                     │ Rx:[0.00] │
│  Click to  │                                     │ Ry:[0.00] │
│  add to    │                                     │ Rz:[0.00] │
│  scene     │                                     │ S: [1.00] │
├────────────┴─────────────────────────────────────┴───────────┤
│  EXPORT: [Export JSON] [Copy to Clipboard] [Save] [Load]     │
└──────────────────────────────────────────────────────────────┘
```

- Left panel: 250px wide, scrollable, categorized model list with thumbnails
- Center: fills remaining space, R3F Canvas
- Right panel: 280px wide, split: hierarchy top, transform bottom
- Top toolbar: 48px height, sticky
- Bottom export bar: 56px height, sticky

### Keyboard Shortcuts
| Key | Action |
|-----|--------|
| G | Switch to Translate mode |
| R | Switch to Rotate mode |
| S | Switch to Scale mode |
| X / Delete | Delete selected model |
| D | Duplicate selected model |
| H | Toggle visibility of selected |
| Ctrl+Z | Undo |
| Ctrl+Shift+Z | Redo |
| Ctrl+S | Save assembly |
| 1 | Camera: Top view |
| 2 | Camera: Front view |
| 3 | Camera: Side view |
| 4 | Camera: Pilot eye |
| Escape | Deselect |

### Camera Presets
```typescript
const PRESETS = {
  top:   { position: [0, 10, 0],  target: [0, 0, 0] },
  front: { position: [0, 1, 8],   target: [0, 0, 0] },
  side:  { position: [8, 1, 0],   target: [0, 0, 0] },
  pilot: { position: [0, 0.5, 0], target: [0, 0.5, 5] },  // Inside cockpit looking forward
}
```

### Export Config Format
See CLAUDE.md for full JSON schema. The exported config must include:
- Every placed model with its exact position/rotation/scale
- Camera position and target (from current viewport)
- Metadata (name, description, tags)
- Version number for forward compatibility

### Cockpit Quick-Start Template
When user clicks "New Cockpit Assembly" button:
- Auto-add: cockpit01 frame at origin
- Auto-add: cockpit01_interior at [0, 0, 0] (same parent group)
- Auto-add: equipments at [0, 0, 0]
- Auto-add: screens at [0, 0, 0]
- Set camera to pilot-eye preset
- User adjusts positions until it looks right → export

## Build Order (FOLLOW THIS EXACTLY)
1. Supabase migration: `assembly_configs` table with RLS
2. `app/assembly-editor/hooks/useEditorStore.ts` — Zustand store with full state
3. `app/assembly-editor/hooks/useModelCatalog.ts` — fetch from Supabase bucket
4. `app/assembly-editor/lib/editorTypes.ts` — TypeScript interfaces
5. `app/assembly-editor/lib/exportConfig.ts` — JSON export/import
6. `app/assembly-editor/components/EditorCanvas.tsx` — R3F viewport with grid + lights
7. `app/assembly-editor/components/GizmoWrapper.tsx` — TransformControls per model
8. `app/assembly-editor/components/ModelBrowser.tsx` — left panel, categorized list
9. `app/assembly-editor/components/SceneHierarchy.tsx` — right panel top
10. `app/assembly-editor/components/TransformPanel.tsx` — right panel bottom
11. `app/assembly-editor/components/EditorToolbar.tsx` — top bar with modes + presets
12. `app/assembly-editor/components/ExportPanel.tsx` — bottom bar
13. `app/assembly-editor/components/SaveLoadPanel.tsx` — Supabase persistence
14. `app/assembly-editor/page.tsx` — assemble all components
15. Add "Assembly Editor" to Universe dropdown in nav
16. Keyboard shortcut listeners (global, not in inputs)
17. Cockpit quick-start template button
18. npm run build → verify → git push origin main

## Strict Rules
1. Models load ONLY from Supabase Storage CDN
2. TransformControls gizmo MUST work with mouse drag
3. Undo/redo MUST work via history stack
4. Export JSON MUST match the schema in CLAUDE.md exactly
5. OrbitControls MUST disable during gizmo drag (conflict prevention)
6. Grid snap defaults to 0.1, toggleable
7. Selected model has emissive outline (drei <Outlines>)
8. Suspense fallback = wireframe box during model load
9. Mobile shows "Desktop recommended" banner, does not break
10. Minimum font: 14px labels, 16px body, opacity >= 0.5
11. Dark space aesthetic matching voidexa.com
12. Git backup before build. Git push origin main after build.
13. Do NOT modify any existing pages or components outside app/assembly-editor/
14. ONLY exception: adding nav link to Navigation.tsx
