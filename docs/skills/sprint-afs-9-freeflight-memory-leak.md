# SPRINT 2 — AFS-9 Free Flight Memory Leak
## Skill file for Claude Code
## Location: `docs/skills/sprint-afs-9-freeflight-memory-leak.md`

**Sprint type:** Diagnostic + fix
**Estimated time:** 2 sessions (Phase A diagnostic, Phase B fix)
**Priority:** P0 (blocks live verification af Free Flight + downstream sprints)
**Risk:** Medium (Three.js cleanup-patterns, side-effects mulige)
**Depends on:** Nothing
**Blocks:** AFS-32 (Skybox library wiring), AFS-11 (Speed Run live test), Sprint 6 (Pointer Lock fix)

---

## SCOPE

Find og fix memory leak i Free Flight scene (BUG-04). Symptomer fra raw log:
- Fresh reload: 233MB / 259MB heap (90% used IMMEDIATELY)
- Efter ~12 sec flight + boost: FPS dropper til 1-5
- `Three.js sceneObjectCount: 0` efter route change → references leaked
- Recovery: full reload required

**Sprint delivers:**
- Phase A: Forensic diagnostic + root cause identified
- Phase B: Fix + verify
- Memory profile baseline before/after
- 5+ unit tests for cleanup patterns

**Sprint does NOT cover:**
- Pointer Lock fix (AFS-8 separat)
- HUD collision fix (AFS-8 separat)
- Free Flight skybox swap (AFS-32 wiring)
- Free Flight content gap (45+ NPCs designed, 10 deployed — separate sprint)

---

## CONTEXT

### Why this sprint:
BUG-04 har eksisteret siden Apr 19 (chat `5987ea92-4a46-43c2-a0cd-03329da7b04e`). Sprint 15 forsøgte at fixe det — fejlede. Bug blokerer:
- Live audit af Free Flight (man kan ikke teste end-to-end gameplay)
- AFS-32 skybox wiring (kan ikke verify rendering uden FPS)
- AFS-11 Speed Run kan have samme leak (skal også verificeres)
- Universal chat på Free Flight (chat når aldrig at loade)

### Previous fix attempt (Sprint 16 / Apr 19):
- Deployed BoostTrail GPU optimization
- Deployed rarity badges
- Memory leak fix NOT explicitly confirmed
- Issue persisted

### Suspected leak sources (kandidater fra raw log):
1. **AsteroidField** — 100+ instances, may not unmount cleanly
2. **ExplorationEncounters** — dynamic spawn/despawn lifecycle
3. **NPCManager** — 45+ NPCs with AI loops
4. **BoostTrail** — particle system tied to ship physics
5. **Three.js renderer.dispose()** missing on route change
6. **Event listeners** ikke cleaned op (keyboard, gamepad, pointer)
7. **requestAnimationFrame loops** der overlever component unmount

### What MUST NOT change:
- Free Flight gameplay logic
- Ship physics
- HUD layout (separate AFS-8)
- Existing Three.js scene composition

---

## PHASE A — DIAGNOSTIC (Session 1)

### Task A0: Pre-flight verify file structure

**STOP. Don't change anything yet. Run these greps and report.**

```bash
# Find Free Flight main scene file
find components/freeflight -name "*.tsx" 2>/dev/null
find components/freeflight -name "*.ts" 2>/dev/null

# Find suspected leak components
grep -rn "AsteroidField\|ExplorationEncounters\|NPCManager\|BoostTrail" \
  components/freeflight/ --include="*.tsx" 2>/dev/null

# Find existing cleanup patterns
grep -rn "useEffect.*return\|cleanup\|dispose\|removeEventListener" \
  components/freeflight/ --include="*.tsx" 2>/dev/null | head -30

# Find requestAnimationFrame usage
grep -rn "requestAnimationFrame\|cancelAnimationFrame" \
  components/freeflight/ --include="*.tsx" 2>/dev/null
```

**STOP. Report findings:**
- List af filer i components/freeflight/
- Cleanup patterns currently in place
- requestAnimationFrame callsites + paired cancelAnimationFrame
- Wait for Jix approval before Task A1.

---

### Task A1: Backup tag

```bash
git tag backup/pre-afs-9-20260426
git push origin backup/pre-afs-9-20260426
```

### Task A2: Add memory monitoring telemetry

**Goal:** Get observability BEFORE attempting fix.

**File:** `components/freeflight/MemoryMonitor.tsx` (NEW)

```typescript
'use client';

import { useEffect, useRef } from 'react';

/**
 * Diagnostic component for AFS-9 — logs heap usage every 5s.
 * Renders nothing. Remove or gate behind ?debug=true after fix verified.
 */
export function MemoryMonitor({ scene }: { scene?: 'freeflight' | 'speedrun' | 'starmap' }) {
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('performance' in window)) return;
    
    // @ts-expect-error - performance.memory is non-standard but Chrome supports
    if (!window.performance.memory) return;

    const log = () => {
      // @ts-expect-error
      const m = window.performance.memory;
      const usedMB = (m.usedJSHeapSize / 1024 / 1024).toFixed(1);
      const totalMB = (m.totalJSHeapSize / 1024 / 1024).toFixed(1);
      const limitMB = (m.jsHeapSizeLimit / 1024 / 1024).toFixed(1);
      const pct = ((m.usedJSHeapSize / m.totalJSHeapSize) * 100).toFixed(0);
      console.log(`[AFS-9 ${scene ?? 'unknown'}] heap ${usedMB}MB / ${totalMB}MB (${pct}%, limit ${limitMB}MB)`);
    };

    log();
    intervalRef.current = window.setInterval(log, 5000);

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [scene]);

  return null;
}
```

**Mount in FreeFlightScene:**
```tsx
<MemoryMonitor scene="freeflight" />
```

### Task A3: Run diagnostic session

**Jix manually executes:**
1. Open Chrome DevTools → Performance Monitor (NOT Memory tab)
2. Navigate to `/freeflight` after fresh reload
3. Watch console for `[AFS-9 freeflight]` logs every 5s
4. Fly for 5 minutes (gentle cruise, no boost)
5. Note when FPS drops below 30
6. Note heap MB at FPS-drop moment
7. Hit boost — note FPS drop pattern
8. Click navigate to `/` (route change)
9. Wait 5s — note if heap returns to ~50MB or stays elevated
10. Save Performance Monitor recording

**Report back:**
- Heap MB at fresh load
- Heap MB at minute 1, 2, 3, 4, 5
- FPS at minute 1, 2, 3, 4, 5
- Heap MB after route change to `/`
- Any console errors
- Three.js Stats addon counters (drawcalls, geometries, textures, programs)

**STOP. Report all data points to Jix. Wait for go-signal before Phase B.**

### Task A4: Heap snapshot diff

**Manual:**
1. Fresh load `/freeflight`
2. DevTools → Memory tab → Take Heap Snapshot ("Snapshot 1")
3. Fly 30 seconds
4. Take Heap Snapshot ("Snapshot 2")
5. Compare Snapshot 2 vs 1, sort by "Delta" descending
6. Identify top 5 retained constructors

**Look for:**
- `BufferGeometry` instances increasing
- `Material` instances increasing
- `Mesh` instances increasing
- `Texture` instances increasing
- Custom class names (AsteroidInstance, NPCEntity, etc.)

**Report top 5 retained constructors med delta count + total size.**

---

## PHASE B — FIX (Session 2, after Phase A diagnostic)

### Task B0: Fix planning

Based on Phase A findings, narrow root cause. Most likely candidates:

**Candidate 1: requestAnimationFrame loop overlever unmount**
```typescript
// BEFORE (leak):
useEffect(() => {
  const animate = () => {
    // ... three.js render
    requestAnimationFrame(animate);  // ← loop kører evigt
  };
  animate();
}, []);

// AFTER (fixed):
useEffect(() => {
  let frameId: number;
  const animate = () => {
    // ... three.js render
    frameId = requestAnimationFrame(animate);
  };
  animate();
  return () => cancelAnimationFrame(frameId);
}, []);
```

**Candidate 2: Three.js geometries/materials ikke disposed**
```typescript
// BEFORE (leak):
useEffect(() => {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial();
  // ... use them
  return () => { /* nothing */ };  // ← geometry + material orphaned
}, []);

// AFTER (fixed):
useEffect(() => {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial();
  return () => {
    geometry.dispose();
    material.dispose();
  };
}, []);
```

**Candidate 3: Event listeners not removed**
```typescript
// BEFORE:
useEffect(() => {
  window.addEventListener('keydown', handleKey);
  // ... no cleanup
}, []);

// AFTER:
useEffect(() => {
  window.addEventListener('keydown', handleKey);
  return () => window.removeEventListener('keydown', handleKey);
}, []);
```

**Candidate 4: Renderer not disposed on route change**
```typescript
// In FreeFlightScene root:
useEffect(() => {
  const renderer = new THREE.WebGLRenderer({ ... });
  return () => {
    renderer.dispose();
    renderer.forceContextLoss();
    renderer.domElement = null;
  };
}, []);
```

**Candidate 5: NPC AI loops use setInterval without cleanup**
```typescript
// BEFORE:
useEffect(() => {
  setInterval(() => updateNPC(), 100);  // ← never cleared
}, []);

// AFTER:
useEffect(() => {
  const id = setInterval(() => updateNPC(), 100);
  return () => clearInterval(id);
}, []);
```

### Task B1: Apply targeted fix(es)

**Based on Phase A diagnostic, fix specific issues identified.**

This task is data-driven. Cannot pre-write all fixes — depends on what diagnostic finds.

**General principle:**
- Every `useEffect` with side-effect MUST have cleanup
- Every Three.js object MUST have `.dispose()` paired
- Every `requestAnimationFrame` MUST have `cancelAnimationFrame`
- Every event listener MUST have removeEventListener
- Every `setInterval`/`setTimeout` MUST have clear

### Task B2: Add cleanup tests

**File:** `tests/freeflight-cleanup.test.ts`

```typescript
import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react-hooks';
// Adjust import path based on actual location
import { useFreeFlightScene } from '../components/freeflight/useFreeFlightScene';

describe('FreeFlight cleanup invariants', () => {
  it('cancels animation frame on unmount', () => {
    const cancelSpy = vi.spyOn(window, 'cancelAnimationFrame');
    const { unmount } = renderHook(() => useFreeFlightScene());
    unmount();
    expect(cancelSpy).toHaveBeenCalled();
  });

  it('removes keyboard event listeners on unmount', () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = renderHook(() => useFreeFlightScene());
    unmount();
    expect(removeSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
  });

  // Add 3-5 more assertions based on actual cleanup patterns
});
```

**Note:** Test paths assume hook-extraction. If FreeFlightScene is monolithic, refactor to expose lifecycle for testing OR use integration test with full mount/unmount cycle.

### Task B3: Manual verify with monitor

**Jix manually:**
1. Fresh load `/freeflight`
2. Note heap at load
3. Fly 5 minutes (mix cruise + boost)
4. Note heap at minute 5
5. Navigate to `/`
6. Wait 5s
7. Note heap after navigate

**Pass criteria:**
- Fresh load < 100MB (was 233MB)
- After 5 min flight: < 200MB (was crashing)
- After route change: < 100MB within 5s (was leaking)
- FPS stays >= 30 throughout (was dropping to 1-5)

### Task B4: Remove or gate MemoryMonitor

After fix verified, either:
- Delete `MemoryMonitor.tsx`
- OR gate behind `?debug=true` query param

```tsx
{searchParams.get('debug') === 'true' && <MemoryMonitor scene="freeflight" />}
```

Recommended: gate behind debug flag for future regression detection.

### Task B5: Commit + tag + push

```bash
git status
git add -A
git commit -m "fix(afs-9): free flight memory leak — [root cause summary]

[Bullet list of specific fixes applied based on Phase A diagnostic]

Before: 233MB heap on load, FPS dropped to 1-5 after 12s, refs leaked on unmount.
After: <100MB load, stable FPS >= 30 over 5min flight, clean unmount.

Closes BUG-04. Unblocks AFS-32 skybox wiring + AFS-11 Speed Run live verify."

git tag sprint-afs-9-complete
git push origin main
git push origin sprint-afs-9-complete

git status
git log origin/main --oneline -3
```

---

## DEFINITION OF DONE

### Phase A complete when:
- [ ] Pre-flight grep results reported to Jix
- [ ] Backup tag pushed
- [ ] MemoryMonitor mounted + logs visible
- [ ] Diagnostic session run by Jix (5 min cruise)
- [ ] Heap snapshot diff captured
- [ ] Top 5 retained constructors identified
- [ ] Root cause hypothesis locked

### Phase B complete when:
- [ ] Targeted fix(es) applied based on Phase A
- [ ] 5+ cleanup unit tests added, all passing
- [ ] Manual verify by Jix passes (fresh load < 100MB, 5 min flight stable, clean unmount)
- [ ] FPS >= 30 throughout test
- [ ] No console errors during test
- [ ] MemoryMonitor either removed or gated behind ?debug=true
- [ ] Committed + tagged + pushed
- [ ] CLAUDE.md updated with sprint history entry
- [ ] Backup verification (AFS-46 standard)

---

## ROLLBACK

```bash
git reset --hard backup/pre-afs-9-20260426
git push --force-with-lease origin main
git push origin :refs/tags/sprint-afs-9-complete
```

---

## RISKS

| Risk | Mitigation |
|---|---|
| Fix breaks gameplay (ship physics, controls) | Manual smoke test efter fix før commit |
| Phase A diagnostic finder ingen leak (false negative) | Run 10 min flight test, ikke kun 5 |
| Multiple leak sources | Phase B kan blive 2 commits, ikke 1 |
| Three.js renderer.dispose() crasher route change | Wrap i try/catch, fallback til soft-reset |
| Test framework mocks ikke Three.js korrekt | Use integration test med full mount/unmount cycle |

---

## OUT OF SCOPE (TRACKED)

- Pointer Lock fix → AFS-8
- HUD collision → AFS-8
- Skybox swap → AFS-32 wiring (after this sprint)
- Free Flight content gap (NPCs, landmarks, quests) → separate content sprint
- Speed Run memory leak verification → check separately in AFS-11

---

## CLAUDE EXECUTION COMMAND

```bash
cd C:\Users\Jixwu\Desktop\voidexa
claude --dangerously-skip-permissions
```

Then paste this entire SKILL into chat with `/effort xhigh`.

**Important for this sprint:** Phase A and Phase B should be SEPARATE Claude Code sessions. Run Phase A → diagnostic data → STOP and report → start NEW session for Phase B with diagnostic data in context.
