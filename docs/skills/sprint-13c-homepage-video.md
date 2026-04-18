# SPRINT 13C — HOMEPAGE CINEMATIC REPLACEMENT
## Skill file for Claude Code
## Location: docs/skills/sprint-13c-homepage-video.md

---

## SCOPE

Replace the Three.js cinematic film built in Sprint 13 (and partially fixed in Sprint 13b) with the real Veo 3.1 MP4 video produced on April 17-18. Keep the glass panel overlay from Sprint 13b. Remove all Three.js cinematic code.

Final deliverable:
- `/` = intro video → glass panel overlay with 4 panels + 2 CTAs + checkbox
- First visit: full video plays, overlay fades in at end
- Returning visit with skip flag: direct to `/starmap`
- Website Creation panel → modal (not route)
- Other panels → routes
- Top nav cleanup (remove Break Room)

---

## PRE-TASKS

1. Read `docs/VOIDEXA_INTENT_SPEC.md` section 2 (canonical homepage spec)
2. Read `docs/skills/sprint-13-homepage-cinematic.md` (original Three.js version, for cleanup reference)
3. Verify `voidexa_intro_final.mp4` and `stil_picture_intro.png` in Jix's Downloads
4. Create git backup: `git tag backup/pre-sprint-13c-20260418 ; git push origin --tags`
5. Baseline: `npm test` (expect 654+ green from 13b)

---

## TASKS

### 1. Supabase Storage upload
- Bucket: `intro` (PUBLIC read, create if missing)
- Upload `voidexa_intro_final.mp4` and `stil_picture_intro.png`
- Add to `.env.local` + Vercel env:
  - `NEXT_PUBLIC_INTRO_VIDEO_URL`
  - `NEXT_PUBLIC_INTRO_BACKDROP_URL`

### 2. Remove Sprint 13 Three.js files
Delete:
- `components/home/HomeCinematic.tsx`
- `components/home/scenes/SceneApproach.tsx`
- `components/home/scenes/SceneWarp.tsx`
- `components/home/scenes/SceneArrival.tsx`
- `components/home/scenes/SceneDoorOpen.tsx`
- `components/home/scenes/SceneGalaxyReveal.tsx`
- `components/home/VoiceoverPlayer.tsx`
- `hooks/useCinematicTimeline.ts`
- `lib/cinematic/` (entire directory)
- `lib/game/preload.ts`

Keep (reuse/rename):
- `components/home/SkipButton.tsx` (keep as-is)
- `components/home/CinematicOverlay.tsx` → rename to `QuickMenuOverlay.tsx` (keep glass styling)

### 3. Create new components

**`components/home/IntroVideo.tsx`** (max 200 lines)
- `<video>` element, src from env var
- `autoPlay muted playsInline`
- Mute toggle bottom-right (UI control)
- `onTimeUpdate` → parent callback when `currentTime >= 3`
- `onEnded` → parent callback
- Full-bleed fixed positioning, object-fit cover

**`components/home/WebsiteCreationModal.tsx`** (max 200 lines)
- Modal triggered by Website Creation panel click
- Content:
  - Warm short copy: "We'd love to help you build your website. Our team automates the process with AI so we can deliver fast and affordable. Give us a call, send an email, or leave your contact and we'll reach out."
  - Phone button (tel: link)
  - Email button (mailto:contact@voidexa.com)
  - Inline form: single input (email OR phone) + submit → POST `/api/contact/website-lead`
- Close: button + ESC key + click outside
- Body 16px, labels 14px, titles opacity 0.9 / body 0.75

**`components/home/QuickMenuOverlay.tsx`** (max 250 lines, renamed from CinematicOverlay)
- Keep Sprint 13b glass panel styling:
  - `background: rgba(10, 15, 30, 0.35)`
  - `backdrop-filter: blur(6px)`
  - `border: 1px solid rgba(150, 200, 255, 0.25)`
  - `box-shadow: 0 0 20px rgba(0, 180, 255, 0.08) inset`
- 4 panels in 2x2 grid (1 column on mobile <768px):
  1. **Website Creation** — onClick opens WebsiteCreationModal, no navigation
  2. **Custom Apps** — href `/products/apps`
  3. **Universe** — href `/universe`
  4. **Tools** — href `/products/ai-tools`
- 2 CTAs side by side below panels (stack on mobile):
  1. **Enter Free Flight** — href `/freeflight`, primary style (stronger glow)
  2. **Enter Star Map** — href `/starmap`, secondary style (subtler)
- Checkbox below CTAs: "Don't show quick menu next time"
- When CTA/panel clicked with checkbox checked → `localStorage.setItem('voidexa_skip_intro', 'true')` before navigation
- Fade in animation: 800ms ease-out when `show` prop becomes true
- Panel title 18px opacity 0.9, description 14px opacity 0.75

**`lib/intro/preferences.ts`** (max 40 lines)
```typescript
export const SKIP_KEY = 'voidexa_skip_intro';

export function shouldSkipIntro(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(SKIP_KEY) === 'true';
}

export function setSkipIntro(value: boolean): void {
  if (typeof window === 'undefined') return;
  if (value) localStorage.setItem(SKIP_KEY, 'true');
  else localStorage.removeItem(SKIP_KEY);
}
```

### 4. Rewrite `app/page.tsx` (max 150 lines)
- `'use client'` directive
- On mount: `if (shouldSkipIntro()) { router.replace('/starmap'); return null; }`
- State: `videoEnded`, `showOverlay`, `showSkip`, `checkboxChecked`
- Render `<IntroVideo>` with callbacks
  - `onSkipAvailable` → `setShowSkip(true)`
  - `onEnded` → `setVideoEnded(true)`; `setTimeout(() => setShowOverlay(true), 2000)`
- Render `<SkipButton visible={showSkip} />` — on click, force video to end state
- When `videoEnded`, render backdrop `<img src={NEXT_PUBLIC_INTRO_BACKDROP_URL}>` full-bleed behind overlay
- Render `<QuickMenuOverlay show={showOverlay}>` with lifted checkbox state
- Render `<WebsiteCreationModal>` controlled by overlay
- Layout: `h-screen w-screen overflow-hidden fixed inset-0`
- No scroll, no footer, no nav scroll

### 5. Top nav cleanup
File: `components/layout/Nav.tsx` (or the top nav component)
- Remove "Break Room" link
- Final nav: Home, Products, Universe, About
- Ensure Home → `/`, Universe → `/universe`

### 6. Contact lead API route
`app/api/contact/website-lead/route.ts` (max 80 lines)
- POST { contact: string, type: 'email' | 'phone' }
- `.trim()` all env vars defensively
- Insert into Supabase `leads` table (create migration if missing):
  ```sql
  create table if not exists leads (
    id uuid primary key default gen_random_uuid(),
    contact text not null,
    type text not null check (type in ('email', 'phone')),
    source text not null default 'website_creation',
    created_at timestamptz not null default now()
  );
  alter table leads enable row level security;
  create policy "leads insert public" on leads for insert to anon with check (true);
  ```
- Return `{ success: true }` or `{ error: string }`
- Optional: send email notification to contact@voidexa.com (stub with console.log for now)

### 7. Tests (`tests/homepage-intro.test.ts`, minimum 8)
1. Homepage renders video element on first visit
2. Homepage redirects to `/starmap` when skip flag is true
3. Skip button hidden before `currentTime >= 3`
4. Skip button appears at `currentTime >= 3`
5. Overlay hidden while video plays
6. Overlay fades in 2000ms after video `ended` event
7. Checkbox toggle writes correct value to localStorage
8. All 4 panels have expected handlers (Website Creation = modal, others = routes)
9. (bonus) Enter Free Flight href is `/freeflight`
10. (bonus) Enter Star Map href is `/starmap`
11. (bonus) Modal opens on Website Creation click
12. (bonus) ESC closes modal

Test count must end at 654+ (from 13b baseline).

---

## EXIT CRITERIA

- `/` renders intro video on first visit (no Three.js)
- Video plays with mute toggle + skip button
- Overlay fades in 2s after video end, over backdrop
- All 4 panels function correctly (1 modal + 3 routes)
- Both CTAs navigate correctly
- Checkbox + click writes skip flag
- Returning visit with skip flag redirects to `/starmap`
- Top nav: Home, Products, Universe, About (no Break Room)
- Minimum 8 new tests, all passing
- Total tests 654+ green
- `npm run build` clean
- Vercel deployed via `git push origin main`
- Tag `sprint-13c-complete` pushed
- File size rules respected (page.tsx ≤100 lines, components ≤300 lines)

---

## COMMIT MESSAGE

```
feat(sprint-13c): replace Three.js cinematic with Veo MP4 + quick menu overlay

- Remove Three.js HomeCinematic and all scene files (Sprint 13/13b)
- Add IntroVideo component with mute toggle + skip button
- Rename CinematicOverlay → QuickMenuOverlay (glass panels preserved)
- Add WebsiteCreationModal for Website Creation panel (contact popup)
- Add Enter Star Map CTA alongside Enter Free Flight
- Upload 31.1s Veo 3.1 video + backdrop to Supabase Storage bucket 'intro'
- Add /api/contact/website-lead route for contact form
- Remove Break Room from top nav (not built yet)
- Fix session persistence bug (intro plays from sec 0 on every reload)
- Add 8+ tests for homepage intro flow
```

---

## GIT TAG

```
sprint-13c-complete
```

---

## STOP CONDITIONS

- Build fails 3 times consecutively → halt, report
- Tests regress below 654 → halt, report
- Supabase upload fails → halt, report (may need manual upload)
- Panel destination route missing → halt, report which one

---

## ROLLBACK

```powershell
git reset --hard backup/pre-sprint-13c-20260418
git push --force-with-lease origin main
```
