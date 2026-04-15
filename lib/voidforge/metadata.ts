// lib/voidforge/metadata.ts
//
// Server-side fetch of the full runtime model catalog: models + metadata + tags
// + sockets. This is the single source of truth consumed by the candidate pool
// builder and the placement engine.

import { supabaseAdmin } from '@/lib/supabase-admin'
import type {
  Axis,
  Model,
  ModelMetadata,
  ModelWithMetadata,
  Socket,
  SocketType,
  SymmetryType,
  QualityTier,
  ModelCategory,
} from './types'

interface ModelRow {
  id: string
  slug: string
  name: string
  display_name: string
  storage_path: string
  public_url: string
  thumbnail_url: string | null
  is_uploaded: boolean
  is_active: boolean
  source_pack: string | null
  source_license: string | null
  version: number
}

interface MetaRow {
  id: string
  model_id: string
  category: string
  subcategory: string
  aabb_x: number
  aabb_y: number
  aabb_z: number
  obb_x: number | null
  obb_y: number | null
  obb_z: number | null
  pivot_x: number
  pivot_y: number
  pivot_z: number
  default_scale: number
  forward_axis: string
  up_axis: string
  symmetry_type: string
  role_weight: number
  quality_tier: string
  geometry_hash: string | null
  mesh_count: number | null
  material_count: number | null
  vertex_count: number | null
  collision_proxy: unknown
  ergonomics: unknown
  semantics: Record<string, unknown>
  compatibility: Record<string, unknown>
  validation: Record<string, unknown>
  metadata_version: number
}

interface TagRow {
  model_id: string
  tag: string
  tag_type: string
}

interface SocketRow {
  model_id: string
  socket_key: string
  name: string
  socket_type: string
  occupancy: string
  local_pos_x: number
  local_pos_y: number
  local_pos_z: number
  local_rot_x: number
  local_rot_y: number
  local_rot_z: number
  normal_x: number
  normal_y: number
  normal_z: number
  priority: number
  max_scale_deviation: number | null
  mirrored_socket_key: string | null
  metadata: Record<string, unknown>
}

function toModel(r: ModelRow): Model {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    displayName: r.display_name,
    storagePath: r.storage_path,
    publicUrl: r.public_url,
    thumbnailUrl: r.thumbnail_url ?? undefined,
    isUploaded: r.is_uploaded,
    isActive: r.is_active,
    sourcePack: r.source_pack ?? undefined,
    sourceLicense: r.source_license ?? undefined,
    version: r.version,
  }
}

function toMetadata(r: MetaRow): ModelMetadata {
  return {
    id: r.id,
    modelId: r.model_id,
    category: r.category as ModelCategory,
    subcategory: r.subcategory,
    aabb: { x: r.aabb_x, y: r.aabb_y, z: r.aabb_z },
    obb: r.obb_x != null ? { x: r.obb_x, y: r.obb_y ?? 0, z: r.obb_z ?? 0 } : undefined,
    pivot: { x: r.pivot_x, y: r.pivot_y, z: r.pivot_z },
    defaultScale: r.default_scale,
    forwardAxis: r.forward_axis as Axis,
    upAxis: r.up_axis as Axis,
    symmetryType: r.symmetry_type as SymmetryType,
    roleWeight: r.role_weight,
    qualityTier: r.quality_tier as QualityTier,
    geometryHash: r.geometry_hash ?? undefined,
    meshCount: r.mesh_count ?? undefined,
    materialCount: r.material_count ?? undefined,
    vertexCount: r.vertex_count ?? undefined,
    collisionProxy: (r.collision_proxy ?? undefined) as Record<string, unknown> | undefined,
    ergonomics: (r.ergonomics ?? undefined) as ModelMetadata['ergonomics'],
    semantics: (r.semantics ?? {}) as ModelMetadata['semantics'],
    compatibility: (r.compatibility ?? {}) as ModelMetadata['compatibility'],
    validation: (r.validation ?? {}) as ModelMetadata['validation'],
    metadataVersion: r.metadata_version,
  }
}

function toSocket(r: SocketRow): Socket {
  return {
    socketKey: r.socket_key,
    name: r.name,
    socketType: r.socket_type as SocketType,
    occupancy: r.occupancy as 'single' | 'multi',
    localPosition: { x: r.local_pos_x, y: r.local_pos_y, z: r.local_pos_z },
    localRotationEuler: { x: r.local_rot_x, y: r.local_rot_y, z: r.local_rot_z },
    normal: { x: r.normal_x, y: r.normal_y, z: r.normal_z },
    priority: r.priority,
    maxScaleDeviation: r.max_scale_deviation ?? undefined,
    mirroredSocketKey: r.mirrored_socket_key ?? undefined,
    metadata: r.metadata ?? {},
  }
}

export async function fetchActiveModelCatalog(): Promise<ModelWithMetadata[]> {
  const [modelsRes, metasRes, tagsRes, socketsRes] = await Promise.all([
    supabaseAdmin.from('models').select('*').eq('is_active', true),
    supabaseAdmin.from('model_metadata').select('*'),
    supabaseAdmin.from('model_tags').select('*'),
    supabaseAdmin.from('model_sockets').select('*'),
  ])
  if (modelsRes.error) throw modelsRes.error
  if (metasRes.error) throw metasRes.error
  if (tagsRes.error) throw tagsRes.error
  if (socketsRes.error) throw socketsRes.error

  const models = (modelsRes.data as ModelRow[]) || []
  const metas = (metasRes.data as MetaRow[]) || []
  const tags = (tagsRes.data as TagRow[]) || []
  const sockets = (socketsRes.data as SocketRow[]) || []

  const metaByModelId = new Map<string, MetaRow>()
  for (const m of metas) metaByModelId.set(m.model_id, m)

  const tagsByModelId = new Map<string, string[]>()
  for (const t of tags) {
    const arr = tagsByModelId.get(t.model_id) ?? []
    arr.push(t.tag)
    tagsByModelId.set(t.model_id, arr)
  }

  const socketsByModelId = new Map<string, Socket[]>()
  for (const s of sockets) {
    const arr = socketsByModelId.get(s.model_id) ?? []
    arr.push(toSocket(s))
    socketsByModelId.set(s.model_id, arr)
  }

  const out: ModelWithMetadata[] = []
  for (const m of models) {
    const meta = metaByModelId.get(m.id)
    if (!meta) continue // skip rows without metadata — they cannot be planned against
    out.push({
      ...toModel(m),
      metadata: toMetadata(meta),
      tags: tagsByModelId.get(m.id) ?? [],
      sockets: socketsByModelId.get(m.id) ?? [],
    })
  }
  return out
}
