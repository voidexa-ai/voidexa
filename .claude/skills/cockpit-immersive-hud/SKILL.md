---
name: cockpit-immersive-hud
description: Raise the pilot seat position in the Vattalus cockpit so the user's view sits at canopy eye-level instead of below the dashboard. Also implements immersive HUD — render the hull, shield, velocity, nearest target, and dock prompt data as live textures ON the cockpit's physical screens in first-person view, while keeping the existing 2D HUD overlays for third-person view. Use this skill when fixing pilot seat too low, cockpit camera too low, or adding in-cockpit screen HUD rendering. Triggers on "pilot seat height", "camera too low in cockpit", "immersive HUD", "cockpit screens showing data", "HUD in cockpit screens", or "in-cockpit display".
---

# Cockpit Immersive HUD + Seat Height Fix

## Fix 1 — Pilot Seat Height (land this FIRST, always)

### Problem
User sees the cockpit from too low — below dashboard level, mostly looking up at ceiling ribs and canopy frame. The Vattalus model is authored with its origin at the base of the seat/floor, so when we mount it at `[0, -0.5, -0.3]`, the camera (at world origin) ends up below where the pilot's head should be.

### Fix
Edit `lib/data/shipCockpits.ts`. Adjust `COCKPIT_MODELS.fighter_light.offset`:

```typescript
fighter_light: {
  url: '...',
  withSeat: '...',
  scale: 1.0,
  // OLD: offset: [0, -0.5, -0.3]
  // NEW: raise cockpit DOWN more = effectively raises camera UP
  // (because we're moving the cockpit geometry further below camera)
  offset: [0, -1.4, -0.3],
  rotation: [0, Math.PI, 0],
},
```

**How offset works here:** The cockpit geometry moves DOWN (negative Y) relative to the camera at world origin. Moving it down more = camera's EYE LEVEL relatively rises. Think of it like sitting on a stool: lower the stool, your head stays the same, but you see more of the room because you're effectively higher relative to it.

**Initial target: `[0, -1.4, -0.3]`** (move 0.9 units lower than before — typical human eye-to-seat distance is 0.9-1.1m in game units).

**If that's too high or too low after testing**, user will use the dev-mode window.__cockpit helper in development or we tune via a couple of quick commits:
- Too high (see over canopy): offset `[0, -1.1, -0.3]`
- Too low (looking at dashboard): offset `[0, -1.7, -0.3]`
- Forward/back (too far from windshield): Z axis — `[0, -1.4, -0.6]` pulls cockpit back, camera relatively forward

### Add Runtime Tuning in Dev Mode
The `window.__cockpit` helper already exists from previous commit. Make sure it's still working. In `components/freeflight/cockpit/CockpitModel.tsx` StandaloneCockpit branch, verify:

```typescript
useEffect(() => {
  if (process.env.NODE_ENV === 'development' && innerRef.current) {
    (window as any).__cockpit = innerRef.current;
    console.log('[voidexa] cockpit exposed as window.__cockpit');
    console.log('[voidexa] tune: window.__cockpit.position.set(0, -1.4, -0.3)');
    console.log('[voidexa] tune: window.__cockpit.rotation.set(0, Math.PI, 0)');
    return () => { delete (window as any).__cockpit; };
  }
}, []);
```

---

## Fix 2 — Immersive HUD on Cockpit Screens

### Vision
The Vattalus cockpit has multiple screen surfaces baked into the model (center dashboard screens, side panels with screen-like areas). Currently they render as dark/black rectangles. Users want data shown on them: hull percentage, shield percentage, velocity readout, nearest target with distance, "PRESS E TO DOCK" prompts, chat messages.

### Architecture

**Data flow:**
```
Game state (hull, shield, velocity, nearestTarget, dockPrompt, chat)
    ↓
Custom hook: useCockpitHUDData()
    ↓
For first-person cockpit view:
    → <CockpitScreen> components (3D planes with CanvasTexture)
    → HUD drawn to HTMLCanvasElement, pushed to THREE.CanvasTexture
    → Texture mapped to plane positioned where screens are in .glb
    
For third-person view:
    → Existing 2D HUD overlays (unchanged)
```

### Implementation

#### Step 1: Identify cockpit screen positions
The Vattalus model has 4 mesh groups: Body, Joystick, ThrottleControl, Glass. The "Body" mesh contains the dashboard geometry including screen faces. We need to overlay screen planes at known positions.

Define screen positions manually (Claude Code will tune these after testing):

```typescript
// lib/data/cockpitScreens.ts

export type ScreenLayout = {
  id: string;
  position: [number, number, number];  // relative to cockpit origin
  rotation: [number, number, number];
  size: [number, number];  // width, height in world units
  type: 'nav' | 'target' | 'status' | 'chat' | 'prompt';
};

export const COCKPIT_SCREEN_LAYOUTS: Record<string, ScreenLayout[]> = {
  fighter_light: [
    // Center main screen (large, in front of pilot)
    { 
      id: 'main', 
      position: [0, 0.6, -0.9],  // tune after testing
      rotation: [-0.2, 0, 0],    // slight tilt toward pilot
      size: [0.55, 0.35],
      type: 'target',  // shows nearest target + dock prompts
    },
    // Left dashboard panel
    {
      id: 'left',
      position: [-0.5, 0.45, -0.7],
      rotation: [-0.3, 0.4, 0],
      size: [0.35, 0.22],
      type: 'status',  // hull + shield bars
    },
    // Right dashboard panel  
    {
      id: 'right',
      position: [0.5, 0.45, -0.7],
      rotation: [-0.3, -0.4, 0],
      size: [0.35, 0.22],
      type: 'nav',  // velocity + nav data
    },
    // Bottom-center small strip (chat)
    {
      id: 'chat',
      position: [0, 0.25, -0.8],
      rotation: [-0.6, 0, 0],
      size: [0.6, 0.12],
      type: 'chat',  // recent chat messages, WoW style
    },
  ],
  hirez_generic: [
    // For the existing Hi-Rez cockpit, reuse similar layout — can tune separately
  ],
};
```

#### Step 2: Canvas-texture HUD components

Create `components/freeflight/cockpit/CockpitScreen.tsx`:

```typescript
'use client';

import { useRef, useMemo, useEffect } from 'react';
import { CanvasTexture, Mesh } from 'three';
import { useFrame } from '@react-three/fiber';
import type { ScreenLayout } from '@/lib/data/cockpitScreens';

type Props = {
  layout: ScreenLayout;
  data: {
    hull: number;
    shield: number;
    velocity: number;
    nearestTarget?: { name: string; distance: number };
    dockPrompt?: string;
    chatMessages?: Array<{ author: string; text: string }>;
  };
};

export function CockpitScreen({ layout, data }: Props) {
  const meshRef = useRef<Mesh>(null);

  // Create offscreen canvas for drawing HUD
  const { canvas, texture } = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = Math.round(512 * (layout.size[1] / layout.size[0]));
    const t = new CanvasTexture(c);
    t.anisotropy = 4;
    return { canvas: c, texture: t };
  }, [layout]);

  // Redraw HUD each frame
  useFrame(() => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear with dark screen tint
    ctx.fillStyle = 'rgba(5, 12, 20, 0.95)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Cyan grid pattern (subtle sci-fi)
    ctx.strokeStyle = 'rgba(0, 212, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 32) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw content based on screen type
    ctx.font = 'bold 24px "JetBrains Mono", monospace';
    ctx.textBaseline = 'top';
    
    if (layout.type === 'target') {
      // Main screen — nearest target + dock prompt
      ctx.fillStyle = 'rgba(0, 212, 255, 0.95)';
      ctx.fillText('NEAREST', 16, 16);
      ctx.font = 'bold 36px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(0, 255, 200, 1)';
      ctx.fillText(data.nearestTarget?.name ?? '—', 16, 50);
      ctx.font = '22px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(180, 220, 255, 0.9)';
      ctx.fillText(`${data.nearestTarget?.distance.toFixed(1) ?? '—'} U`, 16, 100);
      
      if (data.dockPrompt) {
        ctx.fillStyle = 'rgba(255, 200, 0, 0.95)';
        ctx.font = 'bold 28px "JetBrains Mono", monospace';
        ctx.fillText('▶ ' + data.dockPrompt, 16, canvas.height - 60);
      }
    } else if (layout.type === 'status') {
      // Left — hull + shield
      ctx.fillStyle = 'rgba(0, 212, 255, 0.95)';
      ctx.fillText('HULL', 16, 20);
      drawBar(ctx, 16, 50, canvas.width - 32, 18, data.hull / 100, '#4ade80');
      ctx.fillStyle = 'rgba(0, 212, 255, 0.95)';
      ctx.fillText('SHIELD', 16, 90);
      drawBar(ctx, 16, 120, canvas.width - 32, 18, data.shield / 100, '#22d3ee');
    } else if (layout.type === 'nav') {
      // Right — velocity + nav
      ctx.fillStyle = 'rgba(0, 212, 255, 0.95)';
      ctx.fillText('VELOCITY', 16, 20);
      ctx.font = 'bold 48px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(0, 255, 200, 1)';
      ctx.fillText(Math.round(data.velocity).toString(), 16, 55);
      ctx.font = '18px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(180, 220, 255, 0.8)';
      ctx.fillText('U/S', 16, 120);
    } else if (layout.type === 'chat') {
      // Bottom — chat strip (WoW style, last 3 messages)
      const msgs = (data.chatMessages ?? []).slice(-3);
      ctx.font = '16px "JetBrains Mono", monospace';
      msgs.forEach((m, i) => {
        ctx.fillStyle = 'rgba(0, 212, 255, 0.7)';
        ctx.fillText(`[${m.author}]`, 16, 10 + i * 22);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fillText(m.text.slice(0, 60), 120, 10 + i * 22);
      });
    }
    
    texture.needsUpdate = true;
  });

  return (
    <mesh 
      ref={meshRef}
      position={layout.position}
      rotation={layout.rotation}
    >
      <planeGeometry args={[layout.size[0], layout.size[1]]} />
      <meshBasicMaterial map={texture} transparent opacity={0.95} toneMapped={false} />
    </mesh>
  );
}

function drawBar(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, pct: number, color: string) {
  ctx.fillStyle = 'rgba(0, 30, 50, 0.8)';
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w * Math.max(0, Math.min(1, pct)), h);
  ctx.strokeStyle = 'rgba(0, 212, 255, 0.5)';
  ctx.lineWidth = 1;
  ctx.strokeRect(x, y, w, h);
}
```

#### Step 3: Integrate into StandaloneCockpit

In `components/freeflight/cockpit/CockpitModel.tsx`, inside StandaloneCockpit:

```typescript
// After the <primitive object={scene} /> that renders the cockpit GLB:
{COCKPIT_SCREEN_LAYOUTS[cockpitType]?.map(layout => (
  <CockpitScreen 
    key={layout.id}
    layout={layout}
    data={hudData}  // passed via prop or context
  />
))}
```

#### Step 4: Connect HUD data source

The game state (hull, shield, velocity, etc.) lives somewhere in Free Flight. Find where the EXISTING 2D HUD reads this state from — probably a Zustand store, React context, or prop drilling from FreeFlightPage.

Pass the same data to CockpitScreen components. Easiest: if there's a HUD store, subscribe to it from inside CockpitModel; if it's prop-drilled, add a `hudData` prop to StandaloneCockpit.

#### Step 5: Hide 2D HUD in first-person mode

In FreeFlightPage or wherever the 2D HUD is rendered, wrap the 2D overlay in a conditional:

```typescript
{!isFirstPerson && <HUD2D />}
```

Or fade it out when entering cockpit mode. Don't remove entirely — third-person still needs it.

### What the user will see

**Center main screen**: "NEAREST" label, target name in big letters ("VOIDEXA HUB"), distance ("85 U"), and if docking is possible, a yellow "▶ PRESS E TO DOCK" prompt.

**Left panel**: Two bars — green HULL, cyan SHIELD, with percentages.

**Right panel**: Large velocity number in game units per second.

**Bottom strip**: Last 3 chat messages, WoW-style, thin text.

**Black rectangles in middle**: FILLED with data instead of empty.

### Performance

CanvasTexture redraw on every frame at 512×? px per screen × 4 screens = ~1MB/frame texture uploads. On any modern GPU that's nothing. If performance drops: drop redraw rate to every 3rd frame using a frame counter.

---

## Build Order

1. Git backup: `git add -A && git commit -m "backup before cockpit HUD work" --allow-empty`
2. **Fix 1 FIRST** — shipCockpits.ts offset change to `[0, -1.4, -0.3]`. Build + deploy + let user verify height feels right.
3. **If Fix 1 needs tuning** — do that before Fix 2. Height is the dealbreaker.
4. **Fix 2** — implement CockpitScreen.tsx + cockpitScreens.ts + integration. Build + deploy.
5. User reports back on screen positions — they almost certainly need tuning to align with actual screen geometry in .glb.
6. Iterate on positions in cockpitScreens.ts until screens overlay correctly.

## Success Criteria

**Fix 1:**
- User's view in first-person shows: canopy frame at edges, dashboard BELOW eye level, clear forward view
- Not "sitting on the floor looking at the ceiling"
- Still sees cockpit interior around them (not floating in space)

**Fix 2:**
- Black screens in cockpit now show live data
- Hull/shield bars animate
- Velocity updates in real time
- Nearest target updates as user flies near stations
- Chat messages appear in bottom strip
- In third-person view, 2D overlays still visible (unchanged)
- No flickering, no missing textures, no z-fighting

## What NOT to Do

- Do NOT replace or delete 2D HUD (needed for third-person)
- Do NOT modify the .glb file
- Do NOT re-run Blender conversion
- Do NOT touch Hi-Rez cockpit offset `[0, -0.8, -1.5]` unless user reports it's also wrong
- Do NOT add real-time maps, minimap, radar yet — those are Round C gameplay
- Do NOT add interactive screen elements (buttons, clickable) — static data display only

## Report Back

Separately for each fix:
1. Which values were used (offset, rotation, screen positions)
2. Build status
3. Deployment URL
4. Any R3F console errors or warnings
5. Confirmed dev-mode window.__cockpit still works

User will then test:
- Fix 1: load qs_challenger + V → report if height feels right  
- Fix 2: same view → confirm screens show data, third-person still has 2D HUD

If Fix 1 needed tuning, adjust offset and redeploy before attempting Fix 2.
