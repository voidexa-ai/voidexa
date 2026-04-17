---
name: sprint-11-mobile-responsive
description: Audit and fix mobile layouts at 375 / 768 / 1024 breakpoints across all routes
sprint: 11
status: pending
---

## Method (no live browser — static heuristics)
The autonomous run can't open headless Chrome reliably here, so the audit uses
static signals:
1. Grep for fixed pixel widths (`width: \d{3,}px`, `minWidth.*\d{3,}`) in
   `app/**` + `components/**`.
2. Grep for missing responsive Tailwind prefixes (`md:`, `sm:`) on layout
   classes (`grid-cols-`, `flex-row`, `w-`).
3. Grep for `position: absolute` blocks without responsive containment.
4. Check `MiniNav` and `Footer` mobile collapse behavior.

## Routes in scope (50+ pages — prioritized)
P0 (must work on mobile):
- `/` (home), `/products`, `/about`, `/contact`, `/quantum/chat`,
  `/wallet`, `/claim-your-planet`, `/shop`, `/achievements`,
  `/cards`, `/break-room`, `/starmap`, `/starmap/voidexa`
P1 (degrade gracefully):
- `/freeflight` — spec is desktop-first, show "Best on desktop" notice on touch
- `/assembly-editor`, `/admin/ship-tagger` — internal tools, OK to be desktop-only
- `/voidforge` — desktop-first

## Deliverables
1. **Audit report** `docs/MOBILE_AUDIT_2026-04-17.md`
   - Per-route findings + severity (P0/P1/P2) + fix proposed.
2. **Component fixes** for P0 issues only.
3. **Touch detection helper** `lib/ui/isTouch.ts` — `useIsTouch()` hook.
4. **Best-on-desktop banner** `components/ui/DesktopOnlyNotice.tsx` for `/freeflight`
   and editor surfaces.

## Plan
1. Backup tag.
2. Run grep sweeps, write the audit doc.
3. Fix P0 issues — typically: add `md:` prefixes, change `w-[600px]` to `w-full md:w-[600px]`.
4. Add the touch banner to 3 routes.
5. Build + test + commit + tag `sprint-11-complete` + push.

## Gates
- Audit doc lists every P0 route with finding + fix status.
- No new TS errors. Tests green.
- Honest disclaimer: live device testing is Jix's responsibility post-deploy.
