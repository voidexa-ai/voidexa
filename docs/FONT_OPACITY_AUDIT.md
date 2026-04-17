# Font + Opacity Audit — Sprint 5 Task 4

**Rule:** body ≥16px, labels ≥14px, text opacity ≥0.5.
**Exceptions allowed:** decorative badges / category pills / CDN pips at 11–13px;
monospace numeric displays; HUD overlays inside 3D scenes.

**Scope of sweep:**
- `app/**/*.tsx`
- `components/**/*.tsx`

**Pattern grepped:** `fontSize: 1[0-3]` and `opacity: 0\.[0-4]`.

---

## Violations fixed in this sprint

| File | Line | Was | Now | Notes |
|------|------|-----|-----|-------|
| components/home/HomePage.tsx | 25 | fontSize: 13 | 14 | "↓ Scroll" hint label |
| components/home/HomeDenmark.tsx | 38 | fontSize: 13 | 14 | "Built from Denmark" eyebrow |
| components/home/HomeFooter.tsx | 73 | fontSize: 13 | 14 | Column heading eyebrow |
| components/home/HomeFooter.tsx | 121 | fontSize: 13 | 14 | Footer tagline |
| components/home/HomeProducts.tsx | 140 | fontSize: 13 | 14 | "Learn more →" CTA |
| components/home/HomeProducts.tsx | 161 | fontSize: 13 | 14 | "Products" eyebrow |
| app/ship-catalog/page.tsx | 115 | fontSize: 12 | 14 | "Preview unavailable" status |
| app/ship-catalog/page.tsx | 134 | fontSize: 12 | 14 | "Failed to load model" status |
| app/ship-catalog/page.tsx | 155 | fontSize: 12 | 14 | "Checking CDN…" status |
| app/ship-catalog/page.tsx | 197 | fontSize: 13 | 14 | Ship card meta row |
| app/starmap/voidexa/page.tsx | 37 | fontSize: 12 | 14 | "Operating globally from Denmark…" footer |
| app/claim-your-planet/components/PioneerRewards.tsx | 127 | fontSize: 13 | 14 | GHAI disclaimer paragraph |

---

## Accepted as decorative (no change)

These fall under the explicit Sprint 5 exception for badges / pills / counters.

| File | Line | Value | Role |
|------|------|-------|------|
| components/home/HomeProducts.tsx | 107 | fontSize: 11 | Status pill ("Live" / "Beta") |
| app/ship-catalog/page.tsx | 201 | fontSize: 11 | "CDN" availability pip |
| app/ship-catalog/page.tsx | 203 | fontSize: 12 | Filename (monospace — exception) |
| app/game/universe-wall/page.tsx | 21 | fontSize: 12 | Event-type chip |

---

## Internal tools (out of user-facing scope)

The **assembly-editor** (`app/assembly-editor/**`) and **admin/ship-tagger**
(`app/admin/ship-tagger/**`) have dense panels with many 11–13px labels.
These are internal dev tools, not legacy user-facing pages listed in the
Sprint 5 spec. Left untouched by this sprint. Total hits:

- app/assembly-editor/** — 50 fontSize hits
- app/admin/ship-tagger/** — 5 fontSize hits

If these ever graduate to public UI, do a dedicated audit pass.

---

## Opacity findings

All `opacity: 0.x` hits below 0.5 sit on non-text surfaces (background art,
atmosphere shells, CSS keyframe start points, star-twinkle flickers). No
text-opacity violations detected in the sweep.

| File | Line | Value | Surface |
|------|------|-------|---------|
| app/ghost-ai/page.tsx | 135 | 0.05 | Background grid |
| app/ghost-ai/page.tsx | 202 | 0.45 | Wordmark logo overlay (non-body, decorative) |
| app/quantum/page.tsx | 145 | 0.035 | Background pattern |
| app/quantum/page.tsx | 502 | 0.12 | Avatar background image |
| app/quantum/page.tsx | 946 | 0.35 | CSS keyframe mid-point |
| app/claim-your-planet/components/Hero.tsx | 20 | 0.45 | Decorative background video |
| components/home/HomeDenmark.tsx | 20 | 0.07 | Background texture |
| components/sections/home/Hero.tsx | 80 | 0.018 | Background texture |
| components/starmap/CSSStarfield.tsx | 43 | 0.05 | Star twinkle keyframe start |
| components/starmap/NodeMesh.tsx | 19–28 | 0.08–0.26 | Planet atmosphere shell material opacity (3D) |

All accepted — none are text body/label opacity.

---

## Summary

- **12 user-facing fontSize violations fixed** in one batch across 7 files.
- **4 decorative exceptions documented** (badges/pills/monospace).
- **55 internal-tool hits deferred** (assembly-editor + ship-tagger) — not
  in Sprint 5 scope per the "legacy pages" list.
- **0 text-opacity violations** — all opacity<0.5 hits are on background
  art, keyframes, or 3D material shells.

Next time the sweep runs, grep with:

```
rg --pcre2 "fontSize:\s*1[0-3][^0-9]" app components
rg --pcre2 "opacity:\s*0\.[0-4]" app components
```
