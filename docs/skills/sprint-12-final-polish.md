---
name: sprint-12-final-polish
description: Font + opacity audit, error boundaries, 404/500 pages, Lighthouse-ready static hardening
sprint: 12
status: pending
---

## Scope
Final pre-MVP-launch sweep. Builds on Sprint 5's font audit
(`docs/FONT_OPACITY_AUDIT.md`) and extends it.

## Deliverables
1. **Refreshed font/opacity audit** `docs/FONT_OPACITY_AUDIT_FINAL.md`
   - Sweep `app/**` and `components/**` post-Sprint-8 changes.
   - Fix any new violations introduced by the homepage redesign / mobile sprint.
2. **Error boundaries**
   - `app/error.tsx` — top-level Next.js error boundary (logs to console + showing
     a recoverable card with "Reload" + "Report" links).
   - `app/global-error.tsx` — root crash boundary.
3. **Custom 404/500**
   - `app/not-found.tsx` — branded 404 with starmap visual, search, popular links.
   - `app/error.tsx` doubles as 500 surface.
4. **Lighthouse-ready hardening** (static)
   - Verify all `<img>` migrated to `next/image` where size known.
   - Verify metadata: Open Graph, Twitter card, viewport meta.
   - `app/layout.tsx` metadata block reviewed.
   - `next.config.ts` — image domains, compression, headers (CSP-lite).
5. **MVP launch checklist** `docs/MVP_LAUNCH_CHECKLIST.md`
   - Manual go-live items (Stripe webhooks, env vars, analytics, monitoring).

## Plan
1. Backup tag.
2. Audit + fix font/opacity violations.
3. Add error/404 pages.
4. Metadata sweep on `app/layout.tsx`.
5. Build + test + commit.
6. Tag `sprint-12-complete` AND `mvp-launch-ready`. Push tags.
7. Final summary appended to CLAUDE.md.

## Gates
- 599 baseline tests still green plus all new tests added across sprints.
- `npx next build` clean.
- Audit doc shows zero P0 font/opacity violations on user-facing surfaces.
- Two release tags pushed.

## Out of scope (Jix to handle post-deploy)
- Real Lighthouse run (requires live URL + headless Chrome).
- Real device mobile testing.
- Cross-browser compatibility (Safari, Firefox).
- Accessibility audit (axe / WCAG).
