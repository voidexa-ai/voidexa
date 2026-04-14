# SKILL.md — voidexa Star System Phase 1-3 Build
# Location: C:\Users\Jixwu\Desktop\voidexa\docs\SKILL_STAR_SYSTEM_PHASE1-3.md

## What This Covers
Phase 1: Premium star map upgrade (bloom, nebula, effects, planet types)
Phase 2: Level 1 Galaxy View (navigation, zoom reveal, constellation grouping)
Phase 3: Free Flight (cockpit, chase cam, asteroids, NPCs, stations, controls)

These three phases share the same Three.js scene and MUST be built together.

## Pre-Build Checklist
- [ ] Read `docs/VOIDEXA_STAR_SYSTEM_COMPLETE_PLAN_v1.2_FINAL.md` completely
- [ ] Read the CLAUDE.md Star System section
- [ ] `git add -A && git commit -m "backup before star system build"`
- [ ] Install dependencies: `npm install @react-three/postprocessing postprocessing gsap three-custom-shader-material`
- [ ] Download and place 3D assets in `public/models/` (see asset list below)
- [ ] Verify existing star map works: `npx next dev` → localhost:3000

## 3D Assets Required Before Build
These must be downloaded and placed before building:

### Ships (place in public/models/ships/)
Free packs — download from links in COMPLETE_PLAN Part 13:
- Quaternius pack → public/models/ships/quaternius/
- CraftPix pack → public/models/ships/craftpix/
- At least 1 fighter, 1 cruiser, 1 battleship for testing

### Cockpits (place in public/models/cockpits/)
- Free Cockpit + Seat from Sketchfab → public/models/cockpits/cockpit_free.glb
- If purchased: Demonic Arts cockpit → public/models/cockpits/cockpit_premium.glb

### Stations (place in public/models/stations/)
- Modular Interior Pack from Sketchfab → public/models/stations/modular/
- Or: use procedural geometry for v1 stations (cylinders + rings + emissive)

All .glb files should be Draco-compressed. If they are .fbx or .blend, convert to .glb first:
```bash
npx gltf-pipeline -i model.gltf -o model.glb --draco.compressionLevel 7
```

---

## PHASE 1: PREMIUM STAR MAP UPGRADE

### Goal
Transform existing "Windows 95" star map into Elite Dangerous quality.
This upgrades Level 2 (voidexa's internal star map).

### Step 1.1 — Post-Processing Pipeline
Modify `components/starmap/StarMapCanvas.tsx`:

```jsx
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing'

// Inside Canvas, after scene content:
<EffectComposer multisampling={0}>
  <Bloom
    luminanceThreshold={0.2}
    luminanceSmoothing={0.9}
    intensity={1.5}
    mipmapBlur
    radius={0.8}
  />
  <ChromaticAberration offset={[0.0005, 0.0005]} />
  <Vignette darkness={0.4} offset={0.3} />
</EffectComposer>
```

### Step 1.2 — Emissive Node Materials
Modify `components/starmap/NodeMesh.tsx`:
- Replace MeshStandardMaterial with emissive materials
- Set `emissive={color}` and `emissiveIntensity={2.0}`
- Add `toneMapped={false}` to all glowing materials
- This makes bloom pick up the nodes naturally

### Step 1.3 — Procedural Nebula Background
Create `components/starmap/Nebula.tsx`:
- Fragment shader with layered simplex noise
- 3-4 color channels (purple, blue, cyan, dark)
- Rendered on a large background sphere or plane
- Subtle animation (slow drift)
- Performance: runs in fragment shader, nearly free

### Step 1.4 — Star Particle Upgrade
Modify star particles:
- Use Points geometry with custom shader
- Twinkle effect: `sin(time + random_offset)` modulates brightness
- Slight size variation based on distance
- Max 5000 particles

### Step 1.5 — Warp Transition
When clicking a planet:
- GSAP animation: camera FOV increases (speed sensation)
- Star particles elongate into streaks (warp effect)
- Camera moves to target planet position
- FOV returns to normal on arrival
- Duration: 1-1.5 seconds

### Step 1.6 — Planet Type Visuals
Modify node rendering to support planet types:
- Each node in `nodes.ts` gets a `planetType` field
- Planet type determines: texture, atmosphere color, size modifier
- Atmosphere: glowing ring around planet (bloom + transparent sphere shell)
- Types: desert (orange), ocean (blue), ice (white), jungle (green), gas (swirl), volcanic (red), tech (city lights)
- For v1: use procedural shaders, not image textures

### Step 1.7 — Camera Polish
- Idle: slow auto-orbit continues
- Mouse parallax: camera tilts 2-3 degrees following cursor
- Hover on planet: subtle zoom toward it
- All transitions GSAP-driven for smoothness

### Verify Phase 1
- [ ] Bloom makes nodes glow beyond their geometry
- [ ] Nebula background visible and animated
- [ ] Stars twinkle
- [ ] Warp transition works on planet click
- [ ] Planet types have different colors/atmosphere
- [ ] Performance smooth (60fps on desktop, 30fps on mobile with effects disabled)
- [ ] Existing navigation still works (click planet → go to page)

---

## PHASE 2: LEVEL 1 GALAXY VIEW

### Goal
Create a parent view above Level 2 where all company planets are visible.
voidexa becomes a "sun" and clicking it enters Level 2 (existing star map).

### Step 2.1 — Galaxy Scene Component
Create `components/galaxy/GalaxyScene.tsx`:
- voidexa sun in center (largest, brightest, unique model/shader)
- Company planets orbit at various distances
- "Claim Your Planet" as distant mysterious glowing planet at edge
- Use same post-processing pipeline as Phase 1
- Same nebula background

### Step 2.2 — Zoom-Based Level of Detail
Implement LOD for planet display:
- Far (zoomed out): planets are small glowing dots, no labels
- Medium: planet shapes appear, labels fade in, atmosphere visible
- Close: full detail, surface features, clickable
- Use camera distance to drive transitions
- Prevents clutter with many planets

### Step 2.3 — Constellation Grouping
If multiple company planets exist, group by industry:
- Tech companies cluster together
- Finance cluster
- Creative cluster
- Subtle connection lines between planets in same constellation (dim, not solid)
- Labels per constellation visible at medium zoom

### Step 2.4 — Navigation Between Levels
- Galaxy View (Level 1) is the default when entering star map
- Click voidexa sun → warp transition → enter Level 2 (existing star map)
- Click any company planet → warp → enter that company's Level 2
- "Back to Galaxy" button → warp back to Level 1
- URL routing: /starmap = Level 1, /starmap/voidexa = Level 2

### Step 2.5 — Search/Directory Sidebar
- Left sidebar panel (collapsible)
- Search bar: type company name → highlights planet in 3D
- List view: all companies sorted by Gravity Score / alphabetical / industry
- Click list item → warp to that planet
- Essential for accessibility and mobile

### Step 2.6 — Data Source
- For v1: hardcode voidexa as the only real planet
- Company planets come from Supabase `companies` table (empty initially)
- "Claim Your Planet" is always present as a static mystery node
- Structure ready for 500+ planets (instanced rendering)

### Verify Phase 2
- [ ] Galaxy View loads as default star map entry
- [ ] voidexa sun is center and brightest
- [ ] Click voidexa → warp → enter Level 2 (existing star map)
- [ ] Back button returns to Level 1
- [ ] Zoom LOD works (dots → shapes → labels → detail)
- [ ] Search sidebar filters/highlights planets
- [ ] "Claim Your Planet" visible at edge
- [ ] URL routing works (/starmap, /starmap/voidexa)

---

## PHASE 3: FREE FLIGHT

### Goal
Add spaceship controls, cockpit view, chase cam, asteroids, NPCs, and stations
to the same 3D scene used in Phases 1-2.

### Step 3.1 — Ship Model Loader
Create `components/freeflight/ships/ShipModel.tsx`:
- Load .glb via useGLTF with Draco
- LOD: full detail < 100m, medium 100-500m, billboard > 500m
- Apply skin/material based on player data
- Default: starter ship from Quaternius pack

### Step 3.2 — Flight Controls
Create `components/freeflight/controls/FlightControls.tsx`:
- WASD movement relative to ship orientation
- Mouse controls ship rotation (pitch/yaw)
- Shift = boost (2x speed, engine trail intensifies)
- Space = brake (decelerate)
- Ship physics: momentum-based (not instant stop), slight drift
- No gravity — space flight

### Step 3.3 — Camera System
Create `components/freeflight/controls/CameraManager.tsx`:
- V key toggles between two modes:
- **First Person:** camera inside ship at cockpit position, ship model hidden
- **Third Person:** camera behind/above ship, offset (0, 2, -8), ship visible
- Smooth transition between modes (0.3s lerp)
- Both modes: camera follows ship rotation with slight lag (cinematic feel)

### Step 3.4 — Cockpit HUD
Create `components/freeflight/cockpit/CockpitHUD.tsx`:
- Cockpit 3D model rendered around camera (first person only)
- Holographic HUD elements (Three.js + bloom):
  - Center: radar orb showing nearby objects (planets, ships, stations)
  - Bottom-left: speed, boost meter
  - Bottom-right: shield/hull bars
  - Top-right: rank badge, PvP toggle status
  - Top-left: alien tech status (empty/installed/stored)
  - Bottom-center: card hand (when in card combat, future phase)
- Semi-transparent, cyan/blue color, matches voidexa palette
- Chat messages fade in bottom-left (see Phase 5 spec)

### Step 3.5 — Asteroid Fields
Create `components/freeflight/environment/AsteroidField.tsx`:
- InstancedMesh: one geometry, many positions (200-500 per field)
- Procedural shapes: IcosahedronGeometry with noise displacement
- Placed between planets (defined zones)
- Slow rotation on each asteroid (random axis/speed)
- Collision: distance check between ship position and asteroid positions
- On collision: camera shake, red flash, hull damage (future), bounce ship back

### Step 3.6 — Nebula Zones
Create `components/freeflight/environment/NebulaZone.tsx`:
- Large semi-transparent colored volumes
- When ship enters: fog increases, visibility drops
- Volumetric feel via layered transparent planes
- Different colors per zone (purple, orange, green)

### Step 3.7 — Space Stations
Create `components/freeflight/environment/SpaceStation.tsx`:
- voidexa Hub: largest, built from modular pack or procedural geometry
  - Cylinder body + ring structures + antenna + beacon light
  - voidexa branding (text/logo on surface)
  - Dock trigger: fly within 50m → "Press E to dock" prompt
  - Dock → opens station UI overlay (shop, leaderboard, missions)
- Planet-owner stations: smaller, standardized, customizable color
- Repair stations: smallest, green glow, heal on dock
- Trading posts: medium, yellow/orange glow
- Abandoned: damaged version of standard model, flickering lights, debris

### Step 3.8 — NPCs
Create `components/freeflight/environment/NPCManager.tsx`:
- NPC ships: instanced mesh (same as player ships but AI-controlled)
- Patrol: fly predefined routes between stations, loop
- Pirates: spawn in dangerous zones, fly toward nearest player, attack range
  - v1: just fly aggressively near you, no actual combat yet (needs Phase 10)
  - Visual: red engine glow, "hostile" label
- Caravans: slow NPC cargo ships between trading posts
- Alien probes: small, fast, appear near alien tech spawns, scan and flee
- Orbital traffic: ships circling planets at various altitudes

### Step 3.9 — Alien Tech Spawns
Create `components/freeflight/environment/AlienTechSpawn.tsx`:
- Glowing green/gold artifact objects placed randomly
- Spawn logic: 1 per 5 active players per hour (for v1: 2-3 static spawns)
- Fly within 20m → "Press E to collect" → added to inventory
- HUD updates to show installed/stored status

### Step 3.10 — Free Flight Entry/Exit
- Entry: button on star map ("Explore the Universe") or Break Room link
- URL: /freeflight or /break-room/explore
- Exit: ESC menu → "Return to Star Map" or dock at station → UI has exit
- Transition: camera pulls back from cockpit → star map orbit view fades in

### Step 3.11 — Layer Loading
- When entering Free Flight: load Layer 2 content (asteroids, NPCs, stations, pickups)
- When exiting: unload Layer 2
- Navigation mode NEVER loads Layer 2 (keeps website fast)

### Verify Phase 3
- [ ] Ship model loads and responds to WASD
- [ ] V toggles cockpit/chase cam smoothly
- [ ] Cockpit HUD shows all elements (radar, speed, health, rank)
- [ ] Asteroids render via instanced mesh, collision works
- [ ] At least 1 station dockable (voidexa Hub)
- [ ] NPCs fly patrol routes
- [ ] Alien tech spawns collectible
- [ ] Entry/exit from Free Flight works
- [ ] Layer 2 loads only in Free Flight
- [ ] Performance: 60fps with all content on desktop
- [ ] Existing star map navigation still works (not broken by Free Flight code)

---

## Build Command Template

Before running, ensure:
1. 3D assets are in public/models/
2. Dependencies installed
3. Git backup made

Split into multiple Claude Code sessions if needed:
- Session 1: Phase 1 (post-processing, nebula, emissive, warp, planet types)
- Session 2: Phase 2 (galaxy view, zoom LOD, search, routing)
- Session 3: Phase 3a (ship loader, controls, camera, cockpit HUD)
- Session 4: Phase 3b (asteroids, stations, NPCs, alien tech, entry/exit)

Each session should:
1. Read this SKILL.md and CLAUDE.md first
2. Git backup
3. Build the specified steps
4. Run `npx next build` to verify no errors
5. Git commit with descriptive message
6. Test in browser

## Post-Build
After Phase 1-3 complete:
- Run Skill_Seekers to update SKILL.md with actual code analysis
- Run DreamGraph to map new entities
- Create SKILL_STAR_SYSTEM_PHASE4-5.md for shop + chat
