# VOIDFORGE ALPHA — AI Cockpit Generator

## What This Is
VoidForge Alpha is an AI-assisted cockpit generator built on top of the existing
`/assembly-editor` on voidexa.com. It is NOT image reconstruction. It is NOT
general-purpose 3D generation. It is a template-driven, socket-based,
metadata-aware cockpit assembly system.

## Core Promise
User chooses a style intent (aggressive, industrial, sleek, submarine, heavy military).
VoidForge then:
1. Selects a cockpit template
2. Selects compatible parts from the model library
3. Places them using sockets and rules
4. Validates the result (collision, clipping, sightline, symmetry)
5. Repairs obvious issues
6. Loads the result directly into the assembly editor for refinement

## MVP Constraints
- Scope: cockpits ONLY
- Models: only the 20 uploaded CDN models
- Templates: exactly 5
- AI: Opus 4.6 ONLY (model: claude-opus-4-6-20250205)
- Placement: deterministic socket-based, NOT AI geometry
- Opus role: selection and planning ONLY, never transforms or geometry math

## Tech Stack
- Next.js 16 on Vercel (auto-deploy via git push origin main)
- Supabase PostgreSQL + Storage (project: ihuljnekxkyqgroklurp, EU)
- React Three Fiber + @react-three/drei (existing editor)
- Zustand (existing editor store)
- Claude Opus 4.6 API for planning calls

## System Architecture
```
User UI (/assembly-editor + VoidForge panel)
    ↓
Next.js API routes (/api/voidforge/*)
    ↓
Supabase Postgres (metadata, templates, generations)
Supabase Storage (GLB files)
    ↓
VoidForge Services
    ├─ Asset Metadata Service
    ├─ Template Resolver
    ├─ Opus Planning Service (JSON-only output)
    ├─ Placement Engine (deterministic, socket-based)
    ├─ Validator Engine (deterministic rules)
    └─ Repair Engine (nudge/remove/swap)
    ↓
Assembly JSON → Existing Zustand editor store
```

## AI Separation of Concerns
**Opus DOES:**
- Interpret user intent
- Select template
- Rank suitable parts for each role
- Decide style-consistent composition
- Propose alternative variants
- Suggest repairs when rule conflicts appear

**Opus does NOT:**
- Collision math
- Bounding box math
- Matrix transforms
- Raycasts
- Scene graph validation
- Socket resolution

## 5 Cockpit Templates

### 1. compact_fighter
Tight, forward-focused, agile. Max 8 parts. Strict bilateral symmetry.
Style: aggressive 0.8, sleek 0.7, military 0.7

### 2. heavy_military
Dense, armored, command-ready. Max 12 parts. Medium/high density.
Style: aggressive 0.9, military 1.0, industrial 0.7

### 3. panoramic_bridge
Wide command bridge, open sightlines. Max 10 parts. Low frontal clutter.
Style: sleek 0.7, military 0.5, ceremonial 0.3

### 4. industrial_hauler
Practical, worn, utility-focused. Max 10 parts. Allow asymmetry.
Style: industrial 1.0, civilian 0.8, submarine 0.4

### 5. submarine_command
Claustrophobic, screen-heavy, pressure-vessel. Max 12 parts. Dense.
Style: submarine 1.0, industrial 0.8, military 0.6

## Generator Pipeline (9 stages)
1. **Normalize** — parse prompt, map style weights, set defaults
2. **Resolve pool** — fetch active models with metadata/sockets/tags
3. **Select template** — rule-based scoring, Opus confirms if ambiguous
4. **Opus planning** — choose models for each role (JSON-only, no transforms)
5. **Deterministic placement** — resolve sockets, compute transforms
6. **Validation** — collision, clipping, sightline, symmetry, ergonomics
7. **Repair** — nudge, remove optional, swap alternate, revalidate
8. **Save** — persist generation + variants to Supabase
9. **Load** — inject into existing assembly editor Zustand store

## Validator Rules (7 groups, 18 rules)
- **Structural**: missing roles, overflow, broken root
- **Collision**: hard collision, seat collision, control blockage
- **Clipping**: exterior-interior mismatch, screen through hull, excessive embed
- **Visibility**: pilot sightline blocked, HUD unreadable, frontal clutter
- **Symmetry**: broken bilateral pair, centerline drift, density overflow
- **Ergonomics**: reach failure, seat visibility, entry obstruction
- **Semantic**: forbidden pair, template mismatch, style incoherence

## Non-Negotiable Rules
1. Never let Opus invent transforms
2. Never let generation bypass template rules
3. Every generated part must have: role, model slug, parent socket, validation state
4. Validator runs on EVERY generation before user sees result
5. Repair uses deterministic rules only
6. Do not expand beyond cockpit scope until Alpha proves usable outputs

## File Structure
```
app/
  assembly-editor/
    page.tsx                          (existing — add VoidForge panel)
    components/
      VoidForgePanel.tsx              (prompt, style, template, generate)
      VoidForgeVariantPicker.tsx      (show 3 variants, pick one)
      ValidationIssuesPanel.tsx       (show warnings/errors)
  api/
    voidforge/
      generate/route.ts              (main generation endpoint)
      validate/route.ts              (standalone validation)
      save/route.ts                  (persist generation)

lib/
  voidforge/
    types.ts                         (all TypeScript types)
    templates.ts                     (5 cockpit templates)
    scoring.ts                       (template selection scoring)
    metadata.ts                      (fetch models + sockets + tags)
    candidate-pool.ts                (role-fit filtering)
    planner.ts                       (Opus prompt + API call + parse)
    placement.ts                     (socket-based transform resolution)
    validator.ts                     (18 deterministic rules)
    repair.ts                        (nudge/remove/swap strategies)
    persistence.ts                   (Supabase insert/update)
    prompts.ts                       (Opus system prompt + payload)
    utils/
      transforms.ts                  (matrix math helpers)
      sockets.ts                     (socket resolution logic)
      collisions.ts                  (AABB/OBB overlap checks)
      occlusion.ts                   (raycasting for sightline)
      symmetry.ts                    (bilateral pair validation)
```

## Database Tables (12 tables)
1. models — asset registry
2. model_metadata — structured metadata per model
3. model_tags — fast tag queries (style, context, faction, etc.)
4. model_sockets — attachment points per model
5. socket_compatibility — allowed category/tag per socket type
6. templates — cockpit template definitions
7. template_roles — required/optional roles per template
8. assemblies — saved user assemblies (replaces assembly_configs)
9. generations — VoidForge generation attempts
10. generation_variants — multiple candidates per generation
11. validation_reports — normalized validation logs
12. (indexes on all foreign keys + query patterns)

## Existing Infrastructure
- Assembly editor is LIVE at /assembly-editor with Zustand store
- 20 models on Supabase Storage CDN (public bucket "models")
- TransformControls, click-to-select, snap grid all working
- Save/load assemblies to Supabase already working
- assembly_configs table exists (will be migrated to assemblies)

## Design Language
- Background: dark space gradient (#0d0a1f → #060412)
- Primary accent: cyan (#00d4ff)
- Secondary: purple (#a855f7)
- Panel backgrounds: rgba(10, 8, 25, 0.95)
- Font minimum: 14px labels, 16px body, opacity >= 0.5
- Match voidexa.com dark sci-fi aesthetic

## Success Metrics
- % of generations user loads into editor
- % of generations user saves without deleting major parts
- Average manual transforms per accepted generation
- Average validation score
- Opus plan parse success rate
- Target: usable cockpit in under 3 minutes with under 10 manual transforms

## Strict Build Rules
1. Git backup before every build
2. After build clean: git push origin main
3. Do NOT modify existing editor components unless adding VoidForge integration hooks
4. Do NOT expand beyond cockpit scope
5. Do NOT build image upload, depth estimation, loot boxes, marketplace
6. Minimum font: 14px labels, 16px body, opacity >= 0.5
7. All API routes use SUPABASE_SERVICE_ROLE_KEY server-side only
8. Opus API key: ANTHROPIC_API_KEY (already in Vercel env vars)
9. Opus model string: claude-opus-4-6-20250205
