// VoidForge Alpha — core TypeScript types.
// These mirror the Supabase schema in migration 20260416_voidforge_schema
// and the contracts used across planner, placement, validator, repair.

export type Axis = 'x' | 'y' | 'z' | '-x' | '-y' | '-z'

export type QualityTier = 'starter' | 'standard' | 'premium' | 'legendary'

export type SymmetryType = 'none' | 'bilateral' | 'radial' | 'mirrored_pair'

export type ModelCategory =
  | 'cockpit_frame'
  | 'cockpit_interior'
  | 'seat'
  | 'console'
  | 'screen'
  | 'control'
  | 'hud'
  | 'equipment'
  | 'accessory'
  | 'ship'
  | 'station'
  | 'prop'

export type PlacementRole =
  | 'core_shell'
  | 'interior_bay'
  | 'seat'
  | 'console_left'
  | 'console_right'
  | 'console_center'
  | 'front_screen'
  | 'side_screen_left'
  | 'side_screen_right'
  | 'hud_overlay'
  | 'yoke'
  | 'stick'
  | 'throttle'
  | 'floor_equipment'
  | 'ceiling_equipment'
  | 'wall_panel'
  | 'accessory'

export type SocketType =
  | 'interior_pair_mount'
  | 'seat_mount'
  | 'console_mount_left'
  | 'console_mount_right'
  | 'console_mount_center'
  | 'screen_mount'
  | 'hud_anchor'
  | 'floor_anchor'
  | 'ceiling_anchor'
  | 'wall_anchor'
  | 'control_mount'
  | 'equipment_mount'
  | 'accessory_mount'

export interface Vec3 {
  x: number
  y: number
  z: number
}

export interface Quat {
  x: number
  y: number
  z: number
  w: number
}

export interface AABB {
  x: number
  y: number
  z: number
}

// ---------- Socket ----------

export interface Socket {
  socketKey: string
  name: string
  socketType: SocketType
  occupancy: 'single' | 'multi'
  localPosition: Vec3
  localRotationEuler: Vec3
  normal: Vec3
  priority: number
  maxScaleDeviation?: number
  mirroredSocketKey?: string
  metadata?: Record<string, unknown>
}

// ---------- Model metadata ----------

export interface ModelCompatibility {
  requiresTags?: string[]
  forbidsTags?: string[]
  preferredTemplates?: string[]
  incompatibleModelSlugs?: string[]
  allowedSocketTypes?: SocketType[]
}

export interface ModelErgonomics {
  seatHeightMeters?: number
  pilotEyeOffset?: Vec3
  reachRadiusMeters?: number
  entryClearanceMeters?: number
  blocksSightline?: boolean
  frontalFootprintM2?: number
}

export interface ModelSemantics {
  descriptor?: string
  role_hints?: PlacementRole[]
  faction_affinity?: string[]
  era?: string
  maturity?: 'clean' | 'worn' | 'battle_damaged'
  notes?: string
}

export interface ModelValidationConfig {
  minClearanceMeters?: number
  allowEmbedDepthMeters?: number
  requiresSymmetryPartner?: boolean
  maxInstancesPerScene?: number
}

export interface ModelMetadata {
  id: string
  modelId: string
  category: ModelCategory
  subcategory: string
  aabb: AABB
  obb?: AABB
  pivot: Vec3
  defaultScale: number
  forwardAxis: Axis
  upAxis: Axis
  symmetryType: SymmetryType
  roleWeight: number
  qualityTier: QualityTier
  geometryHash?: string
  meshCount?: number
  materialCount?: number
  vertexCount?: number
  collisionProxy?: Record<string, unknown>
  ergonomics?: ModelErgonomics
  semantics: ModelSemantics
  compatibility: ModelCompatibility
  validation: ModelValidationConfig
  metadataVersion: number
}

export interface Model {
  id: string
  slug: string
  name: string
  displayName: string
  storagePath: string
  publicUrl: string
  thumbnailUrl?: string
  isUploaded: boolean
  isActive: boolean
  sourcePack?: string
  sourceLicense?: string
  version: number
}

export interface ModelWithMetadata extends Model {
  metadata: ModelMetadata
  tags: string[]
  sockets: Socket[]
}

// ---------- Templates ----------

export interface TemplateStyleProfile {
  aggressive?: number
  industrial?: number
  sleek?: number
  submarine?: number
  military?: number
  civilian?: number
  ceremonial?: number
}

export interface TemplateRules {
  maxParts?: number
  allowAsymmetry?: boolean
  requireBilateralSymmetry?: boolean
  minFrontalClearance?: number
  maxFrontalClutter?: number
  density?: 'low' | 'medium' | 'high'
}

export interface TemplateRole {
  id?: string
  templateId?: string
  roleKey: PlacementRole | string
  roleName: string
  roleType: string
  isRequired: boolean
  minCount: number
  maxCount: number
  allowedCategories: ModelCategory[]
  allowedSubcategories: string[]
  requiredTags: string[]
  forbiddenTags: string[]
  preferredAnchor?: string
  symmetryGroup?: string
  placementPhase: number
  rolePriority: number
  rules?: Record<string, unknown>
}

export interface CockpitTemplate {
  id?: string
  slug: string
  name: string
  templateType: 'cockpit'
  description?: string
  styleProfile: TemplateStyleProfile
  rules: TemplateRules
  roles: TemplateRole[]
  isActive: boolean
  version: number
}

// ---------- Generation pipeline ----------

export interface NormalizedGenerationInput {
  promptText: string
  style: TemplateStyleProfile
  templateSlug?: string
  complexity: 'low' | 'medium' | 'high'
  seed?: number
  variantCount: number
}

export interface CandidateModelPool {
  templateSlug: string
  candidatesByRole: Record<string, CandidateForRole[]>
}

export interface CandidateForRole {
  modelSlug: string
  displayName: string
  category: ModelCategory
  subcategory: string
  tags: string[]
  roleWeight: number
  qualityTier: QualityTier
  styleScore: number
  fitScore: number
  sockets: Socket[]
  aabb: AABB
  semantics: ModelSemantics
}

export interface RoleAssignment {
  roleKey: string
  chosenModelSlug: string
  alternateModelSlugs: string[]
  rationale: string
  confidence: number
}

export interface AssemblyPlan {
  templateSlug: string
  styleSummary: string
  roleAssignments: RoleAssignment[]
}

// ---------- Placement ----------

export interface SocketPlacementRequest {
  parentInstanceId: string
  parentModelSlug: string
  parentSocketKey: string
  childModelSlug: string
  roleKey: string
  targetScale?: number
  mirror?: boolean
}

export interface SocketPlacementResult {
  instanceId: string
  modelSlug: string
  roleKey: string
  parentInstanceId?: string
  parentSocketKey?: string
  position: Vec3
  rotationEuler: Vec3
  quaternion?: Quat
  scale: Vec3
  mirrored: boolean
}

export interface AssemblyInstance {
  instanceId: string
  modelSlug: string
  roleKey: string
  parentInstanceId?: string
  parentSocketKey?: string
  position: Vec3
  rotationEuler: Vec3
  scale: Vec3
  mirrored: boolean
  generated: boolean
  metadata?: Record<string, unknown>
}

export interface AssemblyJson {
  version: number
  templateSlug?: string
  generationId?: string
  rootInstanceId: string
  instances: AssemblyInstance[]
  createdAt: string
}

// ---------- Validation ----------

export type ValidationSeverity = 'info' | 'warning' | 'error'

export type ValidationRuleCode =
  | 'missing_required_role'
  | 'role_overflow'
  | 'broken_root'
  | 'hard_collision'
  | 'seat_collision'
  | 'control_blockage'
  | 'exterior_interior_mismatch'
  | 'screen_through_hull'
  | 'excessive_embed'
  | 'pilot_sightline_blocked'
  | 'hud_unreadable'
  | 'frontal_clutter'
  | 'broken_bilateral_pair'
  | 'centerline_drift'
  | 'density_overflow'
  | 'reach_failure'
  | 'seat_visibility'
  | 'entry_obstruction'
  | 'forbidden_pair'
  | 'template_mismatch'
  | 'style_incoherence'

export interface ValidationIssue {
  severity: ValidationSeverity
  ruleCode: ValidationRuleCode
  targetInstanceId?: string
  relatedInstanceId?: string
  message: string
  payload?: Record<string, unknown>
}

export interface ValidationReport {
  score: number
  passed: boolean
  issues: ValidationIssue[]
  generatedAt: string
}

// ---------- Repair ----------

export type RepairStrategy = 'nudge' | 'remove_optional' | 'swap_alternate'

export interface RepairAction {
  iteration: number
  strategy: RepairStrategy
  targetInstanceId: string
  description: string
  success: boolean
  resolvedRuleCodes: ValidationRuleCode[]
}

export interface RepairReport {
  iterations: number
  actions: RepairAction[]
  finalScore: number
}

// ---------- Generation record ----------

export type GenerationStatus =
  | 'pending'
  | 'planning'
  | 'placing'
  | 'validating'
  | 'repairing'
  | 'completed'
  | 'failed'

export interface GenerationRecord {
  id: string
  userId?: string
  templateId?: string
  promptText: string
  promptStyle: TemplateStyleProfile
  modelPool: unknown
  plannerResponse?: AssemblyPlan
  draftAssembly?: AssemblyJson
  validatedAssembly?: AssemblyJson
  validationReport?: ValidationReport
  repairReport?: RepairReport
  status: GenerationStatus
  errorMessage?: string
  createdAt: string
  updatedAt: string
}

export interface GenerationVariant {
  id: string
  generationId: string
  variantIndex: number
  label?: string
  assemblyJson: AssemblyJson
  validationScore?: number
  styleScore?: number
  usabilityScore?: number
}
