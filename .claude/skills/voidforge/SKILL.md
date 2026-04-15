---
name: voidforge
description: Build and maintain VoidForge Alpha, the AI-assisted cockpit generator on voidexa.com. Use this skill when working on the VoidForge panel, cockpit templates, model metadata system, socket system, placement engine, validator, repair engine, Opus planning service, or generation pipeline. Triggers on any mention of "voidforge", "cockpit generator", "template-based assembly", "socket placement", "model metadata", "AI assembly", "generate cockpit", or "placement engine" in the context of voidexa.
---

# VoidForge Alpha — Build Skill

Read CLAUDE.md in this skill folder for architecture overview, rules, and context.

## 1. DATABASE SCHEMA

Create ALL tables in one Supabase migration.

```sql
-- 1. models
create table if not exists public.models (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  display_name text not null,
  storage_path text not null,
  public_url text not null,
  thumbnail_url text,
  is_uploaded boolean not null default false,
  is_active boolean not null default true,
  source_pack text,
  source_license text,
  version integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. model_metadata
create table if not exists public.model_metadata (
  id uuid primary key default gen_random_uuid(),
  model_id uuid not null references public.models(id) on delete cascade,
  category text not null,
  subcategory text not null,
  aabb_x double precision not null,
  aabb_y double precision not null,
  aabb_z double precision not null,
  obb_x double precision,
  obb_y double precision,
  obb_z double precision,
  pivot_x double precision not null default 0,
  pivot_y double precision not null default 0,
  pivot_z double precision not null default 0,
  default_scale double precision not null default 1,
  forward_axis text not null check (forward_axis in ('x','y','z','-x','-y','-z')),
  up_axis text not null check (up_axis in ('x','y','z','-x','-y','-z')),
  symmetry_type text not null default 'none',
  role_weight double precision not null default 1,
  quality_tier text not null default 'starter',
  geometry_hash text,
  mesh_count integer,
  material_count integer,
  vertex_count integer,
  collision_proxy jsonb,
  ergonomics jsonb,
  semantics jsonb not null default '{}'::jsonb,
  compatibility jsonb not null default '{}'::jsonb,
  validation jsonb not null default '{}'::jsonb,
  metadata_version integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(model_id)
);

-- 3. model_tags
create table if not exists public.model_tags (
  id uuid primary key default gen_random_uuid(),
  model_id uuid not null references public.models(id) on delete cascade,
  tag text not null,
  tag_type text not null default 'style',
  created_at timestamptz not null default now(),
  unique(model_id, tag, tag_type)
);

-- 4. model_sockets
create table if not exists public.model_sockets (
  id uuid primary key default gen_random_uuid(),
  model_id uuid not null references public.models(id) on delete cascade,
  socket_key text not null,
  name text not null,
  socket_type text not null,
  occupancy text not null default 'single' check (occupancy in ('single','multi')),
  local_pos_x double precision not null,
  local_pos_y double precision not null,
  local_pos_z double precision not null,
  local_rot_x double precision not null default 0,
  local_rot_y double precision not null default 0,
  local_rot_z double precision not null default 0,
  normal_x double precision not null default 0,
  normal_y double precision not null default 1,
  normal_z double precision not null default 0,
  priority integer not null default 0,
  max_scale_deviation double precision,
  mirrored_socket_key text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(model_id, socket_key)
);

-- 5. socket_compatibility
create table if not exists public.socket_compatibility (
  id uuid primary key default gen_random_uuid(),
  socket_type text not null,
  allowed_category text,
  allowed_subcategory text,
  required_tag text,
  forbidden_tag text,
  priority_bias integer not null default 0,
  created_at timestamptz not null default now()
);

-- 6. templates
create table if not exists public.templates (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  template_type text not null default 'cockpit',
  description text,
  style_profile jsonb not null default '{}'::jsonb,
  rules jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  version integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 7. template_roles
create table if not exists public.template_roles (
  id uuid primary key default gen_random_uuid(),
  template_id uuid not null references public.templates(id) on delete cascade,
  role_key text not null,
  role_name text not null,
  role_type text not null,
  is_required boolean not null default true,
  min_count integer not null default 1,
  max_count integer not null default 1,
  allowed_categories text[] not null default '{}',
  allowed_subcategories text[] not null default '{}',
  required_tags text[] not null default '{}',
  forbidden_tags text[] not null default '{}',
  preferred_anchor text,
  symmetry_group text,
  placement_phase integer not null default 1,
  role_priority integer not null default 100,
  rules jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 8. assemblies (replaces assembly_configs)
create table if not exists public.assemblies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  slug text unique,
  name text not null,
  source text not null default 'manual' check (source in ('manual','voidforge','imported')),
  template_id uuid references public.templates(id),
  generation_id uuid,
  assembly_json jsonb not null,
  thumbnail_url text,
  metadata_version integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 9. generations
create table if not exists public.generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  template_id uuid references public.templates(id),
  prompt_text text not null,
  prompt_style jsonb not null default '{}'::jsonb,
  input_image_url text,
  model_pool jsonb not null default '[]'::jsonb,
  planner_response jsonb,
  draft_assembly jsonb,
  validated_assembly jsonb,
  validation_report jsonb,
  repair_report jsonb,
  status text not null default 'pending' check (
    status in ('pending','planning','placing','validating','repairing','completed','failed')
  ),
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 10. generation_variants
create table if not exists public.generation_variants (
  id uuid primary key default gen_random_uuid(),
  generation_id uuid not null references public.generations(id) on delete cascade,
  variant_index integer not null,
  label text,
  assembly_json jsonb not null,
  validation_score double precision,
  style_score double precision,
  usability_score double precision,
  created_at timestamptz not null default now(),
  unique(generation_id, variant_index)
);

-- 11. validation_reports
create table if not exists public.validation_reports (
  id uuid primary key default gen_random_uuid(),
  generation_id uuid references public.generations(id) on delete cascade,
  assembly_id uuid references public.assemblies(id) on delete cascade,
  severity text not null check (severity in ('info','warning','error')),
  rule_code text not null,
  target_instance_id text,
  related_instance_id text,
  message text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- 12. indexes
create index if not exists idx_models_slug on public.models(slug);
create index if not exists idx_model_metadata_model_id on public.model_metadata(model_id);
create index if not exists idx_model_metadata_category on public.model_metadata(category, subcategory);
create index if not exists idx_model_tags_model_id on public.model_tags(model_id);
create index if not exists idx_model_tags_tag on public.model_tags(tag, tag_type);
create index if not exists idx_model_sockets_model_id on public.model_sockets(model_id);
create index if not exists idx_socket_compat_type on public.socket_compatibility(socket_type);
create index if not exists idx_template_roles_tid on public.template_roles(template_id);
create index if not exists idx_generations_status on public.generations(status);
create index if not exists idx_assemblies_source on public.assemblies(source);

-- RLS
alter table public.models enable row level security;
alter table public.model_metadata enable row level security;
alter table public.model_tags enable row level security;
alter table public.model_sockets enable row level security;
alter table public.socket_compatibility enable row level security;
alter table public.templates enable row level security;
alter table public.template_roles enable row level security;
alter table public.assemblies enable row level security;
alter table public.generations enable row level security;
alter table public.generation_variants enable row level security;
alter table public.validation_reports enable row level security;

-- Public read for models, metadata, tags, sockets, templates (game data)
create policy "Public read models" on public.models for select using (true);
create policy "Public read model_metadata" on public.model_metadata for select using (true);
create policy "Public read model_tags" on public.model_tags for select using (true);
create policy "Public read model_sockets" on public.model_sockets for select using (true);
create policy "Public read socket_compatibility" on public.socket_compatibility for select using (true);
create policy "Public read templates" on public.templates for select using (true);
create policy "Public read template_roles" on public.template_roles for select using (true);

-- User-owned for assemblies, generations, variants
create policy "User assemblies" on public.assemblies for all
  using ((select auth.uid()) = user_id);
create policy "User generations" on public.generations for all
  using ((select auth.uid()) = user_id);
create policy "User gen_variants" on public.generation_variants for all
  using (generation_id in (select id from public.generations where user_id = (select auth.uid())));
create policy "User validation_reports" on public.validation_reports for all
  using (
    generation_id in (select id from public.generations where user_id = (select auth.uid()))
    or assembly_id in (select id from public.assemblies where user_id = (select auth.uid()))
  );
```

## 2. CORE TYPESCRIPT TYPES

Place in `lib/voidforge/types.ts`. See ChatGPT spec for complete types including:
- ModelMetadata, Socket, SocketType, ModelCategory, PlacementRole
- ModelCompatibility, ModelErgonomics, ModelSemantics, ModelValidationConfig
- CockpitTemplate, TemplateRole
- AssemblyPlan, AssemblyInstance, AssemblyJson
- NormalizedGenerationInput, CandidateModelPool
- SocketPlacementRequest, SocketPlacementResult
- ValidationReport, ValidationIssue

Copy ALL types exactly from the ChatGPT spec (Section 3, 4, 6, 7, 8, 11 of the briefing).

## 3. OPUS PROMPT CONTRACT

System prompt for Opus planning calls:
```
You are the planning engine for VoidForge, a modular cockpit assembly system.

You do not produce transforms, geometry math, or freeform prose.
You only choose the best model for each role from the provided model pool.

Your job:
1. Respect the selected cockpit template.
2. Choose models that are stylistically coherent.
3. Respect compatibility, role hints, and context tags.
4. Favor parts that fit the user's requested feel.
5. Prefer parts with stronger template compatibility.
6. Return strict JSON only.

Never invent models that are not in the provided list.
Never return coordinates.
Never return markdown.
```

Response format:
```json
{
  "templateSlug": "compact_fighter",
  "styleSummary": "tight aggressive pilot-focused cockpit",
  "roleAssignments": [
    {
      "roleKey": "core_shell",
      "chosenModelSlug": "hirez_cockpit03",
      "alternateModelSlugs": ["hirez_cockpit02"],
      "rationale": "narrow aggressive canopy",
      "confidence": 0.93
    }
  ]
}
```

## 4. BUILD ORDER (FOLLOW EXACTLY)

### Week 1 — Foundation

**Step 1: Database tables**
Run the full SQL migration from Section 1 above.

**Step 2: TypeScript types**
Create `lib/voidforge/types.ts` with ALL types from Section 2.

**Step 3: Metadata extraction script**
Create `scripts/extract-model-metadata.ts`:
- Load each .glb from Supabase Storage URL
- Compute AABB (Three.js Box3)
- Count meshes, materials, vertices
- Detect pivot offset
- Insert into models + model_metadata tables

**Step 4: Manual metadata seed**
Create `scripts/seed-model-metadata.ts`:
- Seed category, subcategory, style tags, role hints for all 20 models
- Seed quality tier, compatibility, semantics
- Insert into model_tags table

**Step 5: Template definitions**
Create `lib/voidforge/templates.ts`:
- Hardcode all 5 cockpit templates with roles
- Mirror to templates + template_roles tables via seed script

### Week 2 — Core Engine

**Step 6: Socket authoring**
Create `scripts/seed-sockets.ts`:
- Add sockets to cockpit frames (interior_pair_mount, seat_mount, console_mounts, hud_anchor)
- Add sockets to interiors (screen_mount, equipment_mount, floor_anchor)
- Define mirrored pairs for bilateral symmetry

**Step 7: Candidate pool builder**
Create `lib/voidforge/candidate-pool.ts`:
- Fetch models with metadata + tags + sockets
- Filter by template role requirements
- Group by role fit
- Score by style weight match

**Step 8: Opus planner**
Create `lib/voidforge/planner.ts`:
- Construct prompt payload (user intent + template + candidates)
- Call Opus 4.6 API with JSON-only instruction
- Parse response, validate model slugs exist
- Return AssemblyPlan

**Step 9: Placement engine**
Create `lib/voidforge/placement.ts`:
- Start with core_shell at origin [0,0,0]
- For each role in placement phase order:
  - Find matching socket on parent
  - Resolve child transform from socket + pivot offset
  - Apply scale within deviation limits
  - Handle mirrored pairs
- Output DraftAssembly

### Week 3 — Quality

**Step 10: Validator**
Create `lib/voidforge/validator.ts`:
- Implement all 18 rules from 7 groups (see CLAUDE.md)
- Use transformed AABBs for collision
- Use raycasting for sightline occlusion
- Return ValidationReport with score

**Step 11: Repair engine**
Create `lib/voidforge/repair.ts`:
- Strategy 1: nudge position to resolve collision
- Strategy 2: remove lowest-priority optional part
- Strategy 3: swap to alternate model from plan
- Rerun validation after each repair
- Max 3 repair iterations

**Step 12: Variant generation**
In planner.ts: run Opus 3 times with temperature variation
Each variant gets independent placement + validation + repair

### Week 4 — Integration

**Step 13: API routes**
- `app/api/voidforge/generate/route.ts` — full pipeline
- `app/api/voidforge/validate/route.ts` — standalone validation
- `app/api/voidforge/save/route.ts` — persist to Supabase

**Step 14: VoidForge UI panel**
Create `app/assembly-editor/components/VoidForgePanel.tsx`:
- Prompt textarea
- Style preset buttons (aggressive, industrial, sleek, submarine, military)
- Template dropdown (auto or specific)
- Complexity selector (low/medium/high)
- "Generate" button
- "Generate 3 Variants" button
- Loading state with pipeline stage indicator

**Step 15: Variant picker**
Create `VoidForgeVariantPicker.tsx`:
- Show 3 variants side by side (thumbnail or mini viewport)
- Validation score per variant
- "Load into Editor" button per variant

**Step 16: Validation display**
Create `ValidationIssuesPanel.tsx`:
- Show warnings/errors from validation
- Click issue → highlight offending model in scene
- Severity icons (info/warning/error)

**Step 17: Zustand integration**
Add to existing editor store:
- `loadGeneratedAssembly(assembly: AssemblyJson)` — clear scene, load instances
- `setValidationIssues(issues: ValidationIssue[])` — display in panel
- Mark generated instances with `generated: true` and `roleKey`

**Step 18: Final**
- Add VoidForge section to assembly editor page
- npm run build → verify → git push origin main

## 5. STRICT RULES

1. Never let Opus invent transforms — transforms come from placement engine only
2. Never bypass template rules during generation
3. Every generated part needs: role, model slug, parent socket, validation state
4. Validator runs on EVERY generation before user sees result
5. Repair uses deterministic rules only (no AI geometry)
6. Do NOT expand beyond cockpit scope
7. Do NOT build: image upload, depth estimation, loot boxes, marketplace, 689-model rollout
8. Git backup before build, git push origin main after
9. Minimum font: 14px labels, 16px body, opacity >= 0.5
10. Opus model: claude-opus-4-6-20250205 — nothing else
11. ALL model loading from Supabase Storage CDN
12. API routes use SUPABASE_SERVICE_ROLE_KEY server-side only
