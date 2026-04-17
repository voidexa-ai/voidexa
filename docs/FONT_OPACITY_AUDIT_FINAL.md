# Font + Opacity Audit FINAL — voidexa.com (Sprint 12, 2026-04-17)

This refresh extends Sprint 5's `FONT_OPACITY_AUDIT.md` and Sprint 11's
mobile audit. Targets the 4 components added in Sprints 7/8/11 and
spot-checks ones touched indirectly.

## Method
Targeted grep for fontSize patterns under the minima, plus inspection
of new files.

## New / changed files inspected this sprint

| File | Smallest font | Smallest opacity | Status |
|---|---|---|---|
| `components/home/ShuttleHero.tsx` | 14px (scroll cue) | 0.7 (Listen btn) | ✅ |
| `components/home/ProductPanels.tsx` | 14px (bullets) | 0.78 | ✅ |
| `components/sound/VolumeControl.tsx` | 14px | 0.85 | ✅ |
| `components/ui/DesktopOnlyNotice.tsx` | 14px | 0.94 (banner bg) | ✅ |
| `app/error.tsx` | 14px (digest) | 0.55 (digest only) | ✅ |
| `app/global-error.tsx` | 14px | 0.5 | ✅ (at floor) |
| `app/not-found.tsx` | 14px | 0.8 | ✅ |
| `components/freeflight/environment/UniverseLandmarks.tsx` | (3D, no text) | n/a | ✅ |

## Decorative exceptions (accepted from Sprint 5)
- Status pills: 11–12px monospace
- CDN pips and event-type chips
- Background art / atmosphere shells (opacity < 0.5 by design)

## Carry-over from Sprint 5
- `app/assembly-editor/**` — 50 internal-tool font violations.
  Banner now warns touch users; full remediation deferred to a tools
  refresh sprint.
- `app/admin/ship-tagger/**` — 5 internal-tool violations.
  Banner added.

## Verdict
Zero new user-facing violations introduced in Sprints 6–12. The
internal admin/editor surfaces remain known-deferred.
