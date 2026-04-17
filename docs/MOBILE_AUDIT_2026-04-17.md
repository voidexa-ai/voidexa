# Mobile Responsive Audit — voidexa.com (Sprint 11, 2026-04-17)

## Method
Static heuristics only (no live device testing in the autonomous run):
1. Grep `app/**` + `components/**` for fixed pixel widths (`width: \d{3,}px`,
   `minWidth.*\d{3,}`, `maxWidth.*\d{3,}`, `w-\[\d{3,}px\]`).
2. Inspect grid definitions for `auto-fit` vs hard column counts.
3. Scan for `position: absolute` blocks without responsive containment.
4. Visual inspection (file read) of P0 routes.

Live device testing remains a Jix responsibility — see "Out of scope" below.

## Headline finding
**Most homepage components already use `auto-fit minmax(280px, 1fr)` grids
that collapse cleanly on small screens.** The Sprint 8 hero
(`ShuttleHero`) already detects touch devices and downsizes to 70vh.
The biggest mobile risks live in the desktop-first 3D surfaces and
internal admin tools, not the marketing pages.

## P0 routes — must work on mobile

| Route | Audit | Status |
|---|---|---|
| `/` (home) | Hero + 4 panels + auto-fit grids; ShuttleHero touch-aware. | ✅ Pass |
| `/products` | Card grid uses auto-fit minmax 280px. | ✅ Pass |
| `/about` | Single-column with max-width container. | ✅ Pass |
| `/contact` | Form with stacked inputs, no horizontal layout. | ✅ Pass |
| `/quantum/chat` | Chat UI with sidebar — sidebar collapses below 768px in existing CSS. | ✅ Pass |
| `/wallet` | Modal-driven, narrow content. | ✅ Pass |
| `/claim-your-planet` | Sectioned glass cards already auto-fit. | ✅ Pass |
| `/shop` | `ShopCosmeticsClient` uses fixed widths in some panels — see fixes below. | ⚠ Partial |
| `/achievements` | `AchievementPanel` uses fixed minWidth. Verify on 375px. | ⚠ Partial |
| `/cards` | Deck builder — desktop-first. Acceptable at this stage. | ⚠ Note |
| `/break-room` | Arcade frames — fixed sizes. Should add touch warning. | ⚠ Notice |
| `/starmap` | Galaxy view — Three.js canvas auto-resizes. Sidebar collapses. | ✅ Pass |
| `/starmap/voidexa` | Inherits from StarMapPage — auto-fit. | ✅ Pass |

## P1 routes — desktop-first by design (banner added)

| Route | Banner | Behavior on touch |
|---|---|---|
| `/freeflight` | ✅ Added | WASD ship + pointer lock — physically incompatible with touch. Banner shows + offers "Return to Galaxy". |
| `/assembly-editor` | ✅ Added | 3D editor needs precision pointer. Banner + read-only fallback noted. |
| `/admin/ship-tagger` | ✅ Added | Internal admin tool. Banner + redirect to `/`. |
| `/voidforge` | ✅ Added | AI cockpit generator UI assumes mouse + keyboard. Banner. |

## Fixes applied this sprint

1. **`lib/ui/isTouch.ts`** — `useIsTouch()` (hover-media-query) and
   `useIsNarrow(maxPx=768)` hooks. SSR-safe.
2. **`components/ui/DesktopOnlyNotice.tsx`** — top-pinned banner
   shown only on touch devices, dismissible per-session, optional
   fallback link.
3. **Banner wired into 4 P1 routes** — `/freeflight`,
   `/assembly-editor`, `/admin/ship-tagger`, `/voidforge`.

## Backlog (P2 — defer to live device test)

The static audit cannot reproduce these — they need a real iPhone /
Android in hand:
- iOS Safari `100vh` viewport bug (uses URL bar height inconsistently).
  Hero might extend past the visible area on iOS. Mitigation: switch to
  `100dvh` if testing confirms.
- Three.js `<Canvas>` performance on low-end Android — may need
  `dpr={[1, 1.5]}` cap on `<GalaxyCanvas />` and `<StarMapCanvas />`.
- Tap target sizes <44×44px — flagged in Lighthouse, can't
  verify here without DOM measurement.
- Long-press vs tap behavior on planet nodes (R3F doesn't distinguish
  by default).

## Out of scope (Jix to handle post-deploy)

- Live device testing (iPhone, Pixel, iPad).
- Real Lighthouse mobile score.
- iOS Safari + Android Chrome cross-browser.
- Accessibility audit (axe / WCAG 2.1 AA touch-target rules).
- Tablet-specific layouts (1024px target — currently treated as desktop).

## Honest disclaimer
This audit is a static-analysis pass. Six routes that look fine via
file-read may still ship visual regressions on a real 375px screen.
Treat the ✅ Pass marks as "no known structural blocker", not "verified
by hand".
