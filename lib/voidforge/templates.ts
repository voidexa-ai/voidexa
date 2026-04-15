// lib/voidforge/templates.ts
//
// Hardcoded definitions for the 5 VoidForge Alpha cockpit templates.
// Mirrored to the `templates` and `template_roles` Supabase tables by
// scripts/seed-templates.ts.

import type { CockpitTemplate } from './types'

// Shared role sets — keep subtle variation per template via overrides.
function baseRole(
  roleKey: string,
  roleName: string,
  overrides: Partial<CockpitTemplate['roles'][number]> = {}
): CockpitTemplate['roles'][number] {
  return {
    roleKey,
    roleName,
    roleType: 'core',
    isRequired: true,
    minCount: 1,
    maxCount: 1,
    allowedCategories: [],
    allowedSubcategories: [],
    requiredTags: [],
    forbiddenTags: [],
    placementPhase: 1,
    rolePriority: 100,
    ...overrides,
  }
}

export const COMPACT_FIGHTER: CockpitTemplate = {
  slug: 'compact_fighter',
  name: 'Compact Fighter',
  templateType: 'cockpit',
  description: 'Tight, forward-focused, agile. Strict bilateral symmetry. Max 8 parts.',
  styleProfile: { aggressive: 0.8, sleek: 0.7, military: 0.7 },
  rules: { maxParts: 8, requireBilateralSymmetry: true, density: 'medium' },
  isActive: true,
  version: 1,
  roles: [
    baseRole('core_shell', 'Cockpit shell', {
      allowedCategories: ['cockpit_frame'],
      requiredTags: [],
      preferredAnchor: 'origin',
      placementPhase: 1,
      rolePriority: 10,
    }),
    baseRole('interior_bay', 'Interior bay', {
      allowedCategories: ['cockpit_interior'],
      preferredAnchor: 'interior_pair_mount',
      placementPhase: 2,
      rolePriority: 20,
    }),
    baseRole('front_screen', 'Front screen', {
      isRequired: false,
      allowedCategories: ['screen'],
      preferredAnchor: 'screen_mount',
      placementPhase: 3,
      rolePriority: 40,
    }),
    baseRole('hud_overlay', 'HUD overlay', {
      isRequired: false,
      allowedCategories: ['screen', 'hud'],
      preferredAnchor: 'hud_anchor',
      placementPhase: 4,
      rolePriority: 60,
    }),
  ],
}

export const HEAVY_MILITARY: CockpitTemplate = {
  slug: 'heavy_military',
  name: 'Heavy Military',
  templateType: 'cockpit',
  description: 'Dense, armored, command-ready. Medium/high density. Max 12 parts.',
  styleProfile: { aggressive: 0.9, military: 1.0, industrial: 0.7 },
  rules: { maxParts: 12, requireBilateralSymmetry: true, density: 'high' },
  isActive: true,
  version: 1,
  roles: [
    baseRole('core_shell', 'Armored shell', {
      allowedCategories: ['cockpit_frame'],
      requiredTags: ['military'],
      forbiddenTags: ['civilian'],
      placementPhase: 1,
      rolePriority: 10,
    }),
    baseRole('interior_bay', 'Command interior', {
      allowedCategories: ['cockpit_interior'],
      requiredTags: ['military'],
      preferredAnchor: 'interior_pair_mount',
      placementPhase: 2,
      rolePriority: 20,
    }),
    baseRole('console_left', 'Left console', {
      isRequired: false,
      allowedCategories: ['console', 'equipment'],
      preferredAnchor: 'console_mount_left',
      symmetryGroup: 'consoles',
      placementPhase: 3,
      rolePriority: 30,
    }),
    baseRole('console_right', 'Right console', {
      isRequired: false,
      allowedCategories: ['console', 'equipment'],
      preferredAnchor: 'console_mount_right',
      symmetryGroup: 'consoles',
      placementPhase: 3,
      rolePriority: 30,
    }),
    baseRole('front_screen', 'Front screen', {
      isRequired: false,
      allowedCategories: ['screen'],
      preferredAnchor: 'screen_mount',
      placementPhase: 4,
      rolePriority: 40,
    }),
    baseRole('floor_equipment', 'Floor equipment', {
      isRequired: false,
      minCount: 0,
      maxCount: 2,
      allowedCategories: ['equipment'],
      preferredAnchor: 'floor_anchor',
      placementPhase: 5,
      rolePriority: 70,
    }),
  ],
}

export const PANORAMIC_BRIDGE: CockpitTemplate = {
  slug: 'panoramic_bridge',
  name: 'Panoramic Bridge',
  templateType: 'cockpit',
  description: 'Wide command bridge with open sightlines. Low frontal clutter. Max 10 parts.',
  styleProfile: { sleek: 0.7, military: 0.5, ceremonial: 0.3 },
  rules: { maxParts: 10, requireBilateralSymmetry: true, density: 'low', maxFrontalClutter: 0.25 },
  isActive: true,
  version: 1,
  roles: [
    baseRole('core_shell', 'Bridge shell', {
      allowedCategories: ['cockpit_frame'],
      requiredTags: ['sleek'],
      forbiddenTags: ['submarine'],
      placementPhase: 1,
      rolePriority: 10,
    }),
    baseRole('interior_bay', 'Bridge interior', {
      allowedCategories: ['cockpit_interior'],
      preferredAnchor: 'interior_pair_mount',
      placementPhase: 2,
      rolePriority: 20,
    }),
    baseRole('console_center', 'Center console', {
      isRequired: false,
      allowedCategories: ['console', 'equipment'],
      preferredAnchor: 'console_mount_center',
      placementPhase: 3,
      rolePriority: 30,
    }),
    baseRole('side_screen_left', 'Left side screen', {
      isRequired: false,
      allowedCategories: ['screen'],
      preferredAnchor: 'screen_mount',
      symmetryGroup: 'side_screens',
      placementPhase: 4,
      rolePriority: 40,
    }),
    baseRole('side_screen_right', 'Right side screen', {
      isRequired: false,
      allowedCategories: ['screen'],
      preferredAnchor: 'screen_mount',
      symmetryGroup: 'side_screens',
      placementPhase: 4,
      rolePriority: 40,
    }),
  ],
}

export const INDUSTRIAL_HAULER: CockpitTemplate = {
  slug: 'industrial_hauler',
  name: 'Industrial Hauler',
  templateType: 'cockpit',
  description: 'Practical, worn, utility-focused. Asymmetry allowed. Max 10 parts.',
  styleProfile: { industrial: 1.0, civilian: 0.8, submarine: 0.4 },
  rules: { maxParts: 10, allowAsymmetry: true, density: 'medium' },
  isActive: true,
  version: 1,
  roles: [
    baseRole('core_shell', 'Utility shell', {
      allowedCategories: ['cockpit_frame'],
      requiredTags: [],
      forbiddenTags: ['ceremonial'],
      placementPhase: 1,
      rolePriority: 10,
    }),
    baseRole('interior_bay', 'Working interior', {
      allowedCategories: ['cockpit_interior'],
      preferredAnchor: 'interior_pair_mount',
      placementPhase: 2,
      rolePriority: 20,
    }),
    baseRole('console_left', 'Left console', {
      isRequired: false,
      allowedCategories: ['console', 'equipment'],
      preferredAnchor: 'console_mount_left',
      placementPhase: 3,
      rolePriority: 30,
    }),
    baseRole('console_right', 'Right console', {
      isRequired: false,
      allowedCategories: ['console', 'equipment'],
      preferredAnchor: 'console_mount_right',
      placementPhase: 3,
      rolePriority: 30,
    }),
    baseRole('floor_equipment', 'Floor equipment', {
      isRequired: false,
      minCount: 0,
      maxCount: 3,
      allowedCategories: ['equipment'],
      preferredAnchor: 'floor_anchor',
      placementPhase: 5,
      rolePriority: 70,
    }),
    baseRole('wall_panel', 'Wall panel', {
      isRequired: false,
      minCount: 0,
      maxCount: 2,
      allowedCategories: ['equipment', 'accessory'],
      preferredAnchor: 'wall_anchor',
      placementPhase: 5,
      rolePriority: 75,
    }),
  ],
}

export const SUBMARINE_COMMAND: CockpitTemplate = {
  slug: 'submarine_command',
  name: 'Submarine Command',
  templateType: 'cockpit',
  description: 'Claustrophobic, screen-heavy pressure-vessel cockpit. Dense. Max 12 parts.',
  styleProfile: { submarine: 1.0, industrial: 0.8, military: 0.6 },
  rules: { maxParts: 12, requireBilateralSymmetry: false, density: 'high' },
  isActive: true,
  version: 1,
  roles: [
    baseRole('core_shell', 'Pressure hull', {
      allowedCategories: ['cockpit_frame'],
      requiredTags: ['submarine'],
      placementPhase: 1,
      rolePriority: 10,
    }),
    baseRole('interior_bay', 'Pressure bay', {
      allowedCategories: ['cockpit_interior'],
      requiredTags: ['submarine'],
      preferredAnchor: 'interior_pair_mount',
      placementPhase: 2,
      rolePriority: 20,
    }),
    baseRole('front_screen', 'Front screen', {
      isRequired: false,
      allowedCategories: ['screen'],
      preferredAnchor: 'screen_mount',
      placementPhase: 3,
      rolePriority: 40,
    }),
    baseRole('side_screen_left', 'Left screen', {
      isRequired: false,
      allowedCategories: ['screen'],
      preferredAnchor: 'screen_mount',
      symmetryGroup: 'side_screens',
      placementPhase: 3,
      rolePriority: 40,
    }),
    baseRole('side_screen_right', 'Right screen', {
      isRequired: false,
      allowedCategories: ['screen'],
      preferredAnchor: 'screen_mount',
      symmetryGroup: 'side_screens',
      placementPhase: 3,
      rolePriority: 40,
    }),
    baseRole('wall_panel', 'Wall panel', {
      isRequired: false,
      minCount: 0,
      maxCount: 3,
      allowedCategories: ['equipment', 'accessory'],
      preferredAnchor: 'wall_anchor',
      placementPhase: 5,
      rolePriority: 70,
    }),
    baseRole('floor_equipment', 'Floor equipment', {
      isRequired: false,
      minCount: 0,
      maxCount: 2,
      allowedCategories: ['equipment'],
      preferredAnchor: 'floor_anchor',
      placementPhase: 5,
      rolePriority: 75,
    }),
  ],
}

export const ALL_TEMPLATES: CockpitTemplate[] = [
  COMPACT_FIGHTER,
  HEAVY_MILITARY,
  PANORAMIC_BRIDGE,
  INDUSTRIAL_HAULER,
  SUBMARINE_COMMAND,
]

export function getTemplateBySlug(slug: string): CockpitTemplate | undefined {
  return ALL_TEMPLATES.find((t) => t.slug === slug)
}
