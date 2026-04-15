# voidexa 3D Assembly Editor

## What This Is
A general-purpose in-browser 3D scene builder at `/assembly-editor` on voidexa.com.
Users browse the full Supabase model library, drag models into a 3D viewport,
position/rotate/scale them with mouse gizmos and sliders, then export a JSON config
that Claude Code (or any builder) can implement exactly.

## Primary Use Cases
1. **Cockpit assembly** — position frame + interior + equipments + screens
2. **Station interiors** — arrange rooms, corridors, props
3. **Shop displays** — layout items for the shop page
4. **Scene composition** — build any 3D scene from existing assets
5. **Planet owner customization** — future: owners build their own spaces

## Tech Stack
- Next.js (existing voidexa app)
- React Three Fiber + @react-three/drei
- Three.js TransformControls for gizmos (move/rotate/scale)
- Supabase Storage for model loading (bucket: "models", public CDN)
- Supabase Database for saving/loading assemblies
- Zustand for editor state management

## Supabase Details
- Project: ihuljnekxkyqgroklurp (EU)
- Storage bucket: "models" (public, 50MB limit)
- ~20 models currently uploaded
- Public URL pattern: https://ihuljnekxkyqgroklurp.supabase.co/storage/v1/object/public/models/{filename}
- New table needed: `assembly_configs` (id, user_id, name, config_json, thumbnail_url, created_at, updated_at)

## Model Categories (from existing catalog)
- **Ships**: qs_bob, qs_challenger, qs_executioner, qs_striker, qs_imperial, qs_omen, qs_spitfire, usc_astroeagle01, usc_cosmicshark01, usc_voidwhale01, uscx_galacticokamoto1, uscx_starforce01
- **Cockpit Frames**: hirez_cockpit01 through hirez_cockpit05
- **Cockpit Interiors**: hirez_cockpit01_interior through hirez_cockpit05_interior
- **Equipment**: hirez_equipments
- **Screens**: hirez_screens
- **More will be added** — editor must handle dynamic catalog from Supabase

## Design Language
- Background: dark space gradient (#0d0a1f → #060412)
- Primary accent: cyan (#00d4ff)
- Secondary: purple (#a855f7)
- Panel backgrounds: rgba(10, 8, 25, 0.95) with subtle borders
- Font minimum: 14px labels, 16px body
- Match voidexa.com dark sci-fi aesthetic

## File Structure
```
app/assembly-editor/
  page.tsx                          # Main editor page
  components/
    EditorCanvas.tsx                # R3F Canvas with grid, lights, controls
    ModelBrowser.tsx                 # Left panel: browse Supabase models by category
    TransformPanel.tsx              # Right panel: position/rotation/scale inputs
    EditorToolbar.tsx               # Top: mode select, undo/redo, camera presets, grid toggle
    SceneHierarchy.tsx              # Right panel top: list of placed models, select/delete
    ExportPanel.tsx                 # Bottom-right: export JSON, copy to clipboard
    SaveLoadPanel.tsx               # Save/load assemblies to Supabase
    ModelPreview.tsx                # Thumbnail preview in browser panel
    GizmoWrapper.tsx                # TransformControls wrapper for selected model
    CameraPresets.tsx               # Top/front/side/pilot-eye camera buttons
  hooks/
    useEditorStore.ts               # Zustand store: placed models, selection, history
    useModelCatalog.ts              # Fetch model list from Supabase storage
    useAssemblyStorage.ts           # Save/load assemblies from Supabase DB
  lib/
    editorTypes.ts                  # TypeScript types for editor state
    exportConfig.ts                 # Generate JSON config from scene
    importConfig.ts                 # Load JSON config into scene
```

## Build Order
1. Supabase migration: create `assembly_configs` table with RLS
2. Zustand store (useEditorStore) with undo/redo history
3. EditorCanvas with grid, ambient light, directional light, OrbitControls
4. ModelBrowser panel — list models from Supabase bucket by category
5. Click model in browser → add to scene at origin
6. Click model in scene → select it (highlight outline)
7. GizmoWrapper with TransformControls (translate/rotate/scale modes)
8. TransformPanel with numeric X/Y/Z inputs synced to gizmo
9. SceneHierarchy list of placed models with select/delete/visibility
10. EditorToolbar: mode buttons (Move/Rotate/Scale), grid snap toggle, undo/redo
11. CameraPresets: Top, Front, Side, Pilot Eye (position at cockpit headrest looking forward)
12. ExportPanel: generate JSON config, copy to clipboard, download as .json
13. SaveLoadPanel: save assembly to Supabase, load saved assemblies
14. Keyboard shortcuts: G=grab, R=rotate, S=scale, X=delete, Ctrl+Z=undo, Ctrl+Shift+Z=redo
15. Nav bar: add "Assembly Editor" under Universe dropdown (or Tools)
16. npm run build → verify → git push origin main

## Export Format
```json
{
  "name": "cockpit_01_complete",
  "version": 1,
  "created": "2026-04-16T...",
  "models": [
    {
      "id": "uuid",
      "modelUrl": "https://...supabase.co/.../hirez_cockpit01.glb",
      "modelName": "hirez_cockpit01",
      "category": "cockpit_frame",
      "position": [0, -0.4, 1.4],
      "rotation": [0, 3.14159, 0],
      "scale": [3.2, 3.2, 3.2],
      "visible": true,
      "opacity": 1.0
    }
  ],
  "camera": {
    "position": [0, 0.5, 0],
    "target": [0, 0, 5]
  },
  "metadata": {
    "description": "Complete cockpit 01 assembly with interior, screens, equipments",
    "tags": ["cockpit", "interior"]
  }
}
```

## Strict Rules
1. ALL models load from Supabase Storage CDN — never from local /public/models/
2. Gizmo MUST work with mouse — not just sliders
3. Undo/redo MUST work (Ctrl+Z / Ctrl+Shift+Z)
4. Export JSON MUST be valid and complete — Claude Code reads it directly
5. Camera presets MUST include "Pilot Eye" (for cockpit work)
6. Grid snap defaults to 0.1 units
7. Selected model has visible outline/highlight
8. No model loads block the UI — use Suspense with wireframe fallback
9. Mobile: show warning "Editor works best on desktop" — don't try to make it touch-friendly
10. Git backup before build, git push origin main after build
11. Minimum font sizes: 14px labels, 16px body, opacity minimum 0.5
12. Match voidexa dark space aesthetic exactly
