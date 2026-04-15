# 3D Asset Renders — Shop & Card Art Previews

> **Generated:** 2026-04-15 via headless Chromium (puppeteer + Three.js r158)
> **Resolution:** 512 × 512 PNG
> **Settings:** Dark space background `#0a0a0f`, ACES tone-mapping, 35° heroic angle from front-below, model auto-scaled to fill ~80% of frame
> **Lighting rig:** key (upper-left, white, 2.4×) + fill (lower-right, cool blue, 1.0×) + ambient (white, 0.18×)
> **Accents:** Legendary ships have golden rim light (`#ffd54a`, 1.6×); weapons have cyan rim (`#67e8f9`, 1.4×)
> **Pipeline:** `@react-three/fiber`-compatible — these renders mirror what the in-app `useGLTF` will display

**59 renders total, ~6.2 MB on disk, organised into 9 subfolders below.**

| Subfolder | Count | Size |
|---|---:|---:|
| `legendary/` | 5 | 858 KB |
| `epic/` | 10 | 1307 KB |
| `soulbound/` | 5 | 370 KB |
| `weapons/` | 7 | 640 KB |
| `cockpits/` | 5 | 718 KB |
| `rare/` | 8 | 578 KB |
| `uncommon/` | 13 | 903 KB |
| `starter/` | 1 | 73 KB |
| `cockpit-interiors/` | 5 | 869 KB |

---

## Legendary ships (5) — `legendary/`

PvP-token-only — never directly purchasable. Each picked from a distinct MainBody texture set so they look genuinely different. **All carry the golden rim light.**

| File | Source glb | Size | Use |
|---|---|---:|---|
| `legendary/hirez_ship01_full.png` | `hirez_ship01_full.glb` (MainBody1) | 183 KB | Tournament reward art |
| `legendary/hirez_ship06_full.png` | `hirez_ship06_full.glb` (MainBody6) | 179 KB | Tournament reward art |
| `legendary/hirez_ship09_full.png` | `hirez_ship09_full.glb` (MainBody9) | 217 KB | Apex prize art (8.7 MB source — largest ship) |
| `legendary/hirez_ship13_full.png` | `hirez_ship13_full.glb` (MainBody13) | 160 KB | Tournament reward art |
| `legendary/hirez_ship16_full.png` | `hirez_ship16_full.glb` (MainBody16) | 118 KB | Tournament reward art |

---

## Epic ships (10) — `epic/`

Premium tier. Suggested shop price $5–$8 depending on size.

| File | Source glb | Size |
|---|---|---:|
| `epic/hirez_ship02_full.png` | `hirez_ship02_full.glb` | 102 KB |
| `epic/hirez_ship03_full.png` | `hirez_ship03_full.glb` | 191 KB |
| `epic/hirez_ship04_full.png` | `hirez_ship04_full.glb` | 103 KB |
| `epic/hirez_ship05_full.png` | `hirez_ship05_full.glb` | 151 KB |
| `epic/hirez_ship07_full.png` | `hirez_ship07_full.glb` | 143 KB |
| `epic/hirez_ship08_full.png` | `hirez_ship08_full.glb` | 131 KB |
| `epic/hirez_ship10_full.png` | `hirez_ship10_full.glb` | 102 KB |
| `epic/hirez_ship11_full.png` | `hirez_ship11_full.glb` | 89 KB |
| `epic/hirez_ship12_full.png` | `hirez_ship12_full.glb` | 210 KB |
| `epic/hirez_ship14_full.png` | `hirez_ship14_full.glb` | 85 KB |

---

## Soulbound (5) — `soulbound/`

Achievement rewards from `lib/achievements/definitions.ts`. Cannot be purchased.

| File | Source glb | Achievement | Size |
|---|---|---|---:|
| `soulbound/usc_voidwhale01.png` | `usc_voidwhale01.glb` | `debater` (10× Quantum) → "AI-class Cruiser" | 48 KB |
| `soulbound/usc_genericspaceship04.png` | `usc_genericspaceship04.glb` | `trader` (>10% profit) → "Trader Vessel" | 131 KB |
| `soulbound/usc_spaceexcalibur01.png` | `usc_spaceexcalibur01.glb` | `pioneer` (claim planet) → "Pioneer Frigate" | 84 KB |
| `soulbound/qs_dispatcher.png` | `qs_dispatcher.glb` | `explorer` (visit all planets) → "Scout Ship" | 67 KB |
| `soulbound/uscx_nova.png` | `uscx_nova.glb` | `secret` (easter egg) → "Mystery Ship" | 40 KB |

---

## Weapons (7) — `weapons/`

Card art source (see `docs/CARD_ART_MAPPING.md`) plus shop attachments. **All carry the cyan rim light.**

| File | Source glb | Card art for | Size |
|---|---|---|---:|
| `weapons/hirez_weapon_biglauncher.png` | `hirez_weapon_biglauncher.glb` | Void Lance (Epic), Fortress Turret (Epic deployment) | 96 KB |
| `weapons/hirez_weapon_bigmachinegun.png` | `hirez_weapon_bigmachinegun.glb` | Railgun Shot (Uncommon), Phase Beam (Rare) | 197 KB |
| `weapons/hirez_weapon_blaster.png` | `hirez_weapon_blaster.glb` | Laser Pulse, Plasma Bolt, Thermal Lance, Damage Booster | 38 KB |
| `weapons/hirez_weapon_missile.png` | `hirez_weapon_missile.glb` | Micro Missile, Homing Missile | 65 KB |
| `weapons/hirez_weapon_smalllauncher.png` | `hirez_weapon_smalllauncher.glb` | Acid Cloud (Uncommon) | 100 KB |
| `weapons/hirez_weapon_smallmachinegun.png` | `hirez_weapon_smallmachinegun.glb` | Gatling Burst, Point Defense | 60 KB |
| `weapons/hirez_weapon_trilauncher.png` | `hirez_weapon_trilauncher.glb` | Torpedo Barrage (Rare), Nova Barrage (Epic) | 84 KB |

---

## Cockpits — exterior (5) — `cockpits/`

For shop "Cockpit theme" SKUs. Suggested price $3.

| File | Source glb | Size |
|---|---|---:|
| `cockpits/hirez_cockpit01.png` | `hirez_cockpit01.glb` | 246 KB |
| `cockpits/hirez_cockpit02.png` | `hirez_cockpit02.glb` | 138 KB |
| `cockpits/hirez_cockpit03.png` | `hirez_cockpit03.glb` | 87 KB |
| `cockpits/hirez_cockpit04.png` | `hirez_cockpit04.glb` | 133 KB |
| `cockpits/hirez_cockpit05.png` | `hirez_cockpit05.glb` | 114 KB |

---

## Cockpit interiors (5) — `cockpit-interiors/`

For shop FPV cockpit theme SKUs. Suggested price $5. Use these inside the FPV camera in Free Flight.

| File | Source glb | Size |
|---|---|---:|
| `cockpit-interiors/hirez_cockpit01_interior.png` | `hirez_cockpit01_interior.glb` | 291 KB |
| `cockpit-interiors/hirez_cockpit02_interior.png` | `hirez_cockpit02_interior.glb` | 145 KB |
| `cockpit-interiors/hirez_cockpit03_interior.png` | `hirez_cockpit03_interior.glb` | 84 KB |
| `cockpit-interiors/hirez_cockpit04_interior.png` | `hirez_cockpit04_interior.glb` | 187 KB |
| `cockpit-interiors/hirez_cockpit05_interior.png` | `hirez_cockpit05_interior.glb` | 162 KB |

---

## Rare ships (8) — `rare/`

USC Expansion uniques. Suggested price $2 (variant) – $4 (one-of-a-kind shape). The 6 GenericSpacehips entries (`arrowship`, `nova`, `pullora`, `scorpionship`, `spidership`, `starship`) are the premium hand-crafted silhouettes — note `nova` doubles as the "Mystery Ship" soulbound reward (also rendered in `soulbound/`).

| File | Source glb | Size | Notes |
|---|---|---:|---|
| `rare/uscx_galacticokamoto1.png` | `uscx_galacticokamoto1.glb` | 55 KB | First variant of the GalacticOkamoto class |
| `rare/uscx_starforce01.png` | `uscx_starforce01.glb` | 92 KB | First variant of the StarForce class |
| `rare/uscx_arrowship.png` | `uscx_arrowship.glb` | 97 KB | Arrow-silhouette unique |
| `rare/uscx_nova.png` | `uscx_nova.glb` | 40 KB | Also bound to `secret` achievement (Mystery Ship) |
| `rare/uscx_pullora.png` | `uscx_pullora.glb` | 61 KB | Reserved for `void-pulse` Alien card art |
| `rare/uscx_scorpionship.png` | `uscx_scorpionship.glb` | 93 KB | Scorpion silhouette |
| `rare/uscx_spidership.png` | `uscx_spidership.glb` | 56 KB | Reserved for `reality-warp` Legendary Alien card art |
| `rare/uscx_starship.png` | `uscx_starship.glb` | 85 KB | Classic starship silhouette |

---

## Uncommon ships (13) — `uncommon/`

One-per-class hero render from USC. Suggested price $1 (fighter) – $2 (capital ship: VoidWhale, SpaceExcalibur, ProtonLegacy, StriderOx). Each is the `01` variant of its class — thumbnail of the whole line. `voidwhale01` doubles as the "AI-class Cruiser" soulbound reward.

| File | Source glb | Class | Size |
|---|---|---|---:|
| `uncommon/usc_astroeagle01.png` | `usc_astroeagle01.glb` | AstroEagle (fighter) | 88 KB |
| `uncommon/usc_cosmicshark01.png` | `usc_cosmicshark01.glb` | CosmicShark (assault) | 66 KB |
| `uncommon/usc_voidwhale01.png` | `usc_voidwhale01.glb` | VoidWhale (capital) — also Soulbound | 48 KB |
| `uncommon/usc_forcebadger01.png` | `usc_forcebadger01.glb` | ForceBadger (cruiser) | 109 KB |
| `uncommon/usc_galaxyraptor01.png` | `usc_galaxyraptor01.glb` | GalaxyRaptor (heavy fighter) | 63 KB |
| `uncommon/usc_hyperfalcon01.png` | `usc_hyperfalcon01.glb` | HyperFalcon (interceptor) | 65 KB |
| `uncommon/usc_lightfox01.png` | `usc_lightfox01.glb` | LightFox (scout) | 46 KB |
| `uncommon/usc_meteormantis01.png` | `usc_meteormantis01.glb` | MeteorMantis (gunship) | 83 KB |
| `uncommon/usc_nightaye01.png` | `usc_nightaye01.glb` | NightAye (stealth) | 75 KB |
| `uncommon/usc_protonlegacy01.png` | `usc_protonlegacy01.glb` | ProtonLegacy (capital) | 76 KB |
| `uncommon/usc_striderox01.png` | `usc_striderox01.glb` | StriderOx (capital) | 63 KB |
| `uncommon/usc_craizanstar01.png` | `usc_craizanstar01.glb` | CraizanStar (frigate) | 56 KB |
| `uncommon/usc_galacticleopard1.png` | `usc_galacticleopard1.glb` | GalacticLeopard (note: single-digit naming in source) | 64 KB |

---

## Starter ship (1) — `starter/`

Free starter ship. Every new pilot lands with this on first login.

| File | Source glb | Size | Notes |
|---|---|---:|---|
| `starter/qs_bob.png` | `qs_bob.glb` | 73 KB | Quaternius "Bob" — balanced starter cruiser silhouette |

---

## Render pipeline notes

- **Tooling:** `puppeteer` (with bundled Chromium) + Three.js r158 + GLTFLoader + DRACOLoader (Draco decoder loaded from gstatic CDN).
- **Browser flags required for headless WebGL:** `--use-angle=swiftshader --enable-unsafe-swiftshader --ignore-gpu-blocklist --enable-webgl`. Without these, the bundled Chromium refuses to expose a WebGL context.
- **Heroic camera:** position `(2.8, -1.2, 4.0)`, FOV 35° (40° for trilauncher — wider to fit elongated geometry), `lookAt(0,0,0)`. Model is recentered after auto-scale so the bounding-box centroid sits at origin.
- **Auto-scale:** `scale = 4 / max(boxDim)` for ships, `3 / max(boxDim)` for weapons (slightly tighter so the cyan accent reads).
- **Per-render cost:** ~3 s on the headless Chromium, including Draco decode + GLTF parse + render + PNG encode.

## Re-rendering

The render script lives at `/tmp/render_test/render_glb.cjs` (sandbox) — copy to `scripts/render-models.cjs` if you want it permanent, then:

```bash
npm install puppeteer
node scripts/render-models.cjs
```

The script reads its model queue inline. To add more models, edit the `QUEUE` array. For variant colors, swap the source glb for a Blue/Red/etc. variant (re-run `add_textures.mjs` with a different base color first — see `public/models/TEXTURE_FIX_GUIDE.md`).

## Known issues fixed during the runs

- **`hirez_cockpit01.glb` first-pass failure** (`Cannot read properties of null (reading 'precision')`) — caused by leaked WebGL state from a previous render. Fixed by retrying with a fresh browser instance.
- **`hirez_weapon_trilauncher.glb` rendered as a 7 KB blank** — model has an unusual elongated bounding box (5.65 along Z vs 1.5/1.3 on X/Y). Fixed by re-fitting after the initial auto-scale + using a wider 40° FOV.
- **Second batch hit `Runtime.callFunctionOn timed out` after rendering 26/28** — Chromium worker hung on cockpit04+05 interiors after ~5 min of continuous renders. Fixed by retrying the last 3 in a fresh-browser-per-render harness (one Chromium spawn per glb).
- **`usc_meteormantis01.glb` first attempt was a 7 KB blank** — same elongated-bbox class of issue as trilauncher. Fixed via the fresh-browser retry which re-ran auto-fit cleanly.

## Not touched

- `components/`, `lib/`, any code files
- All renders go to `public/images/renders/` — new directory tree, no conflicts
- The render script lives in `/tmp/` (sandbox) — not committed
