---
name: cockpit-screens-remap
description: The in-world HUD screens (3D planes rendering live flight data — hull, shield, velocity, nearest target, dock prompts) already exist in voidexa Free Flight. They are correctly positioned for the Hi-Rez cockpit but sit in wrong positions when Vattalus cockpit is loaded. This skill locates the existing HUD plane definitions, adds per-cockpit-type position overrides, and re-aligns the planes to sit on the Vattalus cockpit's physical screen surfaces. Use when HUD data appears in wrong spots in cockpit first-person view, or when cockpit physical screens are empty/black but HUD renders elsewhere.
---

# Remap Cockpit In-World HUD Screens for Vattalus

## Context from Live Investigation

Free Flight uses in-world HUD (3D planes with textures) rendered inside Three.js scene — NOT DOM overlays. Browser DOM search returned zero `[class*="hud"]` elements at the expected positions. Only 2 canvases on the page. The HUD elements visible in user's screenshot (flight data strip at top, 2 graph panels at bottom) are part of the 3D scene.

These planes are:
- Designed for Hi-Rez cockpit dimensions  
- Positioned relative to cockpit group's origin
- Not currently aware of which cockpit type is loaded

When Vattalus cockpit is used (different geometry, smaller, different screen locations), the HUD planes end up floating in visually-wrong places instead of overlaying the Vattalus dashboard screens.

## Phase 1 — Recon (do this FIRST, report back before changes)

Find where HUD planes are defined. Likely candidates:

```bash
# Search codebase for HUD plane components
grep -rn "planeGeometry\|PlaneGeometry" components/freeflight/ --include="*.tsx"
grep -rn "CanvasTexture\|canvasTexture" components/freeflight/ --include="*.tsx"
grep -rn "useFrame" components/freeflight/ --include="*.tsx" | grep -iE "hud|screen|panel|display"
grep -rn "\bhud\b\|\bHUD\b" components/freeflight/ --include="*.tsx" --include="*.ts"
grep -rn "Nearest\|NEAREST" components/freeflight/ --include="*.tsx"
grep -rn "hull.*shield\|shield.*hull" components/freeflight/ --include="*.tsx"
```

Also search lib/:
```bash
grep -rn "hud\|HUD" lib/freeflight/ --include="*.ts" --include="*.tsx" 2>/dev/null
ls components/freeflight/ components/freeflight/cockpit/ components/freeflight/hud/ 2>/dev/null
```

**Report what you find:**
1. File path(s) containing HUD plane definitions
2. Current positions (x, y, z) for each HUD plane
3. Are positions hardcoded constants? In config file? In component props?
4. How are they attached to the cockpit group — as children of the cockpit model, or separate?
5. Are there "nearest target" / "hull" / "velocity" / "dock prompt" separate components, or one combined HUD?

**STOP and wait for confirmation** before moving to Phase 2. User/Claude will review findings together.

## Phase 2 — Add Per-Cockpit Override System

Once we know where HUD planes live, add a cockpit-type-aware position system.

### Option A: If HUD plane positions are currently hardcoded constants

Extract them into `lib/data/cockpitHudLayout.ts`:

```typescript
import type { CockpitType } from './shipCockpits';

export type HudScreenLayout = {
  id: string;  // 'nearest' | 'hull-shield' | 'velocity' | 'dock-prompt' | 'chat' | etc.
  position: [number, number, number];
  rotation: [number, number, number];
  scale?: [number, number, number];  // optional size override
  opacity?: number;
};

export const HUD_LAYOUTS: Record<CockpitType, HudScreenLayout[]> = {
  hirez_generic: [
    // Keep existing positions — they work for Hi-Rez
    { id: 'nearest', position: [x1, y1, z1], rotation: [...] },
    { id: 'hull-shield', position: [x2, y2, z2], rotation: [...] },
    // ... copy whatever is currently hardcoded
  ],
  fighter_light: [
    // Initial guess based on screenshot — tune after testing
    // Vattalus has screens in these approx local positions:
    // - Main center-dashboard screen: front of pilot, slightly below eye level
    // - Left side panel: left of pilot
    // - Right side panel: right of pilot
    // - Bottom strip: low front for chat/prompts
    { id: 'nearest', position: [0, -0.2, -0.8], rotation: [-0.15, 0, 0], scale: [0.7, 0.7, 1] },
    { id: 'hull-shield', position: [-0.45, -0.35, -0.6], rotation: [-0.2, 0.3, 0], scale: [0.5, 0.5, 1] },
    { id: 'velocity', position: [0.45, -0.35, -0.6], rotation: [-0.2, -0.3, 0], scale: [0.5, 0.5, 1] },
    { id: 'dock-prompt', position: [0, -0.4, -0.7], rotation: [-0.3, 0, 0], scale: [0.6, 0.4, 1] },
    { id: 'chat', position: [0, -0.5, -0.7], rotation: [-0.4, 0, 0], scale: [0.6, 0.3, 1] },
  ],
  fighter_medium: [
    // Placeholder — same as fighter_light with scale 1.3
  ],
  bridge_command: [
    // Placeholder — same as hirez_generic
  ],
};

export function getHudLayouts(cockpitType: CockpitType): HudScreenLayout[] {
  return HUD_LAYOUTS[cockpitType] ?? HUD_LAYOUTS.hirez_generic;
}
```

Then update the HUD plane component(s) to read from this layout by cockpit type:

```typescript
// Before: position hardcoded
<mesh position={[x, y, z]} rotation={[...]}>...</mesh>

// After: lookup from layout
const layout = getHudLayouts(currentCockpitType).find(l => l.id === 'nearest');
<mesh position={layout.position} rotation={layout.rotation} scale={layout.scale}>...</mesh>
```

### Option B: If positions are already in a config file

Just add `fighter_light` variant to that existing config. Report the file name and I'll give specific changes.

### Option C: If HUD is a single component with multiple sub-planes

Wrap it in a `<group>` with cockpit-type-aware transform. Quickest hack but less precise:

```typescript
const cockpitType = useCockpitType(); // however it's accessed
const transform = cockpitType === 'fighter_light' 
  ? { position: [0, -0.3, 0.5], scale: 0.65 }
  : { position: [0, 0, 0], scale: 1 };

<group {...transform}>
  <ExistingHUDComponent />
</group>
```

This moves ALL HUD planes together, which is simpler but less flexible than per-plane positioning.

## Phase 3 — Add Dev-Mode Tuning for Each HUD Plane

Expose the HUD planes individually on `window` in dev mode so user can tune positions live:

```typescript
useEffect(() => {
  if (process.env.NODE_ENV === 'development' && meshRef.current) {
    const hudRefs = (window as any).__hud = (window as any).__hud ?? {};
    hudRefs[layout.id] = meshRef.current;
    console.log(`[voidexa] HUD plane "${layout.id}" exposed as window.__hud.${layout.id}`);
    console.log(`[voidexa] tune: window.__hud.${layout.id}.position.set(x, y, z)`);
    return () => { delete hudRefs[layout.id]; };
  }
}, [layout.id]);
```

User can then open dev tools in Chrome, navigate to /freeflight, enter cockpit, and move planes to exactly match the physical screens on Vattalus model:

```javascript
window.__hud.nearest.position.set(0, -0.15, -0.75)
window.__hud['hull-shield'].position.set(-0.42, -0.3, -0.55)
```

When positions look right, user reports them and we bake into HUD_LAYOUTS.

## Phase 4 — Build, Deploy, Test

1. Git backup: `git add -A && git commit -m "backup before HUD remap" --allow-empty`
2. Implement Phase 2 (whichever option fits the codebase)
3. Add Phase 3 dev-helpers
4. `npx next build` — must pass
5. `git push origin main`
6. User tests qs_challenger + V in cockpit
7. User either confirms positions work OR uses dev helpers to tune
8. If tuned values are reported, bake them into HUD_LAYOUTS.fighter_light in a follow-up commit

## Success Criteria

- Top HUD strip (flight data, "FREE FLIGHT" label, tile icons) — repositioned so it aligns with the top dashboard strip of Vattalus cockpit, NOT floating above canopy
- "NEAREST VOIDEXA HUB 169U" panel — moved to center or right dashboard screen (physical screen on Vattalus)
- "COCKPIT · FIRST PERSON / V · THIRD PERSON / ESC · MENU" panel — could stay top-left as-is (it's a control hint, not in-world HUD), OR moved inside cockpit if desired
- HULL / SHIELD bars — moved from bottom-right corner onto the right dashboard panel surface
- VELOCITY readout — moved from bottom-left onto the left dashboard panel surface
- Chat messages — bottom strip should overlay the low-front panel of Vattalus
- Third-person view — HUD overlays stay 2D as they were, OR continue using in-world positioning (whatever is simpler; don't break what works)

## What NOT to Do

- Do NOT rebuild HUD system from scratch
- Do NOT change Hi-Rez cockpit HUD positions (they work)
- Do NOT touch Vattalus .glb file
- Do NOT touch seat offset (just landed, user confirmed it's much better)
- Do NOT introduce new dependencies (no new React libs, no new Three.js addons — use what's already there)
- Do NOT guess at final positions without the dev-mode helper — user will tune them live

## Reporting Back

After Phase 1 recon, report:
1. File paths where HUD planes live
2. Current position/rotation values for each plane
3. Whether HUD is parented to cockpit group or separate
4. Your recommended Option (A, B, or C) for the fix

Then stop and wait. We decide together before Phase 2+ execution.

After Phase 2-4 (once executed):
1. What positions were initially set for fighter_light  
2. Dev-helper status (window.__hud exposed)
3. Build + deploy confirmation
4. User will tune in browser and report back final values
