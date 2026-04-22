---
sprint: AFS-7
title: Legal Pages + Sitemap + Robots + Cookie Banner
date: 2026-04-22
status: IN_PROGRESS
branch: main
backup_tag: backup/pre-sprint-afs-7-20260422
complete_tag: sprint-afs-7-complete
owner: Jix
---

# Sprint AFS-7 — Legal Pages

Unblocks 5 P0 404 routes (`/privacy`, `/terms`, `/cookies`, `/sitemap.xml`, `/robots.txt`) and installs a first-visit cookie consent banner. Boilerplate is sufficient for technical compliance; ADVORA attorney review is tracked under AFS-37 before any major marketing push.

---

## Scope

### Pages

**`/privacy`** — GDPR-compliant privacy policy.
- Data controller: voidexa, CVR 46343387, Vordingborg, Denmark
- User rights (access, rectification, erasure, portability, objection, complaint to Datatilsynet)
- Retention periods per data category
- Sub-processors: Supabase EU, Stripe, Vercel, Anthropic, Google, OpenAI, Perplexity
- Jurisdiction: Denmark / EU GDPR
- Language: English (Danish mirror at `/dk/privacy`)

**`/terms`** — Terms of service for a commercial platform.
- User accounts (Supabase Auth)
- GHAI credits — non-refundable digital goods, NOT cryptocurrency, NOT an investment instrument
- User-generated content (Trading Hub strategies, Break Room chat, Universe Wall posts) — licensed to voidexa for platform operation, user retains ownership
- Physical products: 2-year Danish `reklamationsret` (consumer defect warranty) per Købeloven
- Jurisdiction: Denmark, Vordingborg retskreds
- Service-as-is disclaimers for AI output

**`/cookies`** — Cookie policy + `CookieBanner` component.
- Essential vs analytics split
- Consent stored in `localStorage` key `voidexa_cookie_consent_v1`
- Values: `essential` (default, implied) or `all` (analytics opt-in)
- Banner renders on first visit across the whole app via `app/layout.tsx`
- Dismisses on accept, respects stored preference thereafter

### Infrastructure

**`app/sitemap.ts`** — Next.js native `MetadataRoute.Sitemap`. Emits every public route including `/dk/*` mirrors. Excludes `/admin/*`, `/control-plane/*`, `/auth/*`, `/api/*`, and preview-only paths. 30+ URLs minimum.

**`app/robots.ts`** — Next.js native `MetadataRoute.Robots`. Allows `/`, disallows `/admin/*`, `/control-plane/*`, `/auth/*`, `/api/*`. Points to `https://voidexa.com/sitemap.xml`.

### Component

**`components/legal/CookieBanner.tsx`** — client component, bottom-fixed, two buttons (Essentials only / Allow all), dismiss stores consent.

Wired into `app/layout.tsx` once for the whole tree (English + Danish routes share the same root layout).

---

## Tests (Vitest, source-level)

Covering:
1. Each page file exists and exports a default React component
2. `/privacy` mentions CVR 46343387 and Datatilsynet
3. `/terms` mentions GHAI non-refundable and Danish jurisdiction
4. `/cookies` mentions the consent key and both consent modes
5. `CookieBanner` reads and writes the consent localStorage key
6. `app/sitemap.ts` lists the known public routes and excludes admin/control-plane/auth
7. `app/robots.ts` disallows admin/control-plane/auth and sets the sitemap URL
8. `/dk` mirrors re-export their English counterparts

---

## Git Workflow

1. Tag backup: `backup/pre-sprint-afs-7-20260422` (DONE)
2. Commit SKILL.md (this file) separately: `chore(afs-7): add sprint SKILL documentation`
3. Build routes + component + tests
4. Commit: `feat(afs-7): legal pages + sitemap + robots + cookie banner`
5. `npm test` green, `npm run build` green
6. `git push origin main`
7. Verify `git status` clean, `git log origin/main --oneline -3` shows our commits
8. Tag `sprint-afs-7-complete` and push
9. Wait 90s for Vercel, live-verify `/privacy`, `/terms`, `/cookies`, `/sitemap.xml`, `/robots.txt` return 200
10. Update `CLAUDE.md` session log

---

## Definition of Done

- [ ] All 5 routes return 200 on voidexa.com (Vercel deploy finished)
- [ ] Cookie banner shows on first visit, dismisses on accept, respects localStorage thereafter
- [ ] `sitemap.xml` lists 30+ routes
- [ ] `robots.txt` blocks admin/auth correctly and references the sitemap
- [ ] `npm test` green
- [ ] `npm run build` green
- [ ] SKILL.md + routes committed on `main`
- [ ] `sprint-afs-7-complete` tag pushed
- [ ] `CLAUDE.md` session log updated

---

## Rollback

```
git reset --hard backup/pre-sprint-afs-7-20260422
git push origin main --force-with-lease
git tag -d sprint-afs-7-complete
git push origin :refs/tags/sprint-afs-7-complete
```

---

## Follow-ups (out of scope)

- **AFS-37** — ADVORA attorney review of legal copy before major marketing push
- **AFS-26** — Proper Danish translations (currently `/dk/*` legal routes re-export English)
- **CW-4** — Cookie banner copy polish (localized strings in `lib/i18n/*.ts`)
- Analytics integration that actually respects the consent flag (no analytics SDK is installed yet as of HEAD `5615aab`)
