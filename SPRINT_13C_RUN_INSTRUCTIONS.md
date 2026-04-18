# SPRINT 13C — HOMEPAGE CINEMATIC REPLACEMENT
## Replace Three.js Sprint 13/13b Film with Veo 3.1 MP4 Video

---

## CONTEXT

Sprint 13 and Sprint 13b built a 45-second Three.js cinematic film on the homepage. Sprint 13b identified 8 rendering bugs (black Phase 1, invisible warp shader, dark door reveal, invisible skip button, opaque panels, etc). Root cause: Three.js was the wrong tool for this cinematic.

During the April 17-18 session, Jix produced a real 31.1-second cinematic MP4 using Runway Veo 3.1 (`voidexa_intro_final.mp4`, 1920x1080, 65MB, H.264/AAC). The final video frame matches `stil_picture_intro.png` pixel-for-pixel, enabling a seamless transition from video to overlay background.

**This sprint replaces the Three.js film entirely with the MP4 video.** Keep the good parts from Sprint 13/13b (glass panel overlay, skip button, no scroll, 100vh single screen). Remove everything else.

---

## ASSETS READY IN JIX'S DOWNLOADS

- `voidexa_intro_final.mp4` — 31.1s cinematic, 1920x1080, ~65MB
- `stil_picture_intro.png` — final frame backdrop (matches last video frame)

---

## USAGE (TWO POWERSHELL BOXES)

### Box 1 — Start Claude Code

```powershell
cd C:\Users\Jixwu\Desktop\voidexa; claude --dangerously-skip-permissions
```

### Box 2 — Paste this prompt when Claude Code asks "what do you want to do?"

```
Read docs/VOIDEXA_INTENT_SPEC.md section 2 first. Then read docs/skills/sprint-13-homepage-cinematic.md to understand what Sprint 13 built.

This sprint (Sprint 13c) REPLACES the Three.js cinematic with a real Veo MP4 video. The film has already been produced and is ready.

Summary of what to do:
- Remove the Three.js cinematic from Sprint 13 (components/home/HomeCinematic.tsx, all scenes/*.tsx, useCinematicTimeline.ts, lib/cinematic/*)
- Keep the glass panel overlay design from Sprint 13b (those visual choices are good)
- Replace Three.js film with HTML5 video element playing voidexa_intro_final.mp4
- Video ends on the same frame as stil_picture_intro.png (seamless transition to overlay background)
- After video ends, wait 2 seconds, then fade in the 4 glass panels + 2 CTAs + checkbox
- Fix Break Room nav issue (remove from top nav — not built yet)
- Remove the session persistence bug (film must replay from sec 0 on every reload, no skip-by-default)

Pre-flight:
1. Create git backup tag: git tag backup/pre-sprint-13c-20260418
2. Push the tag: git push origin --tags
3. Verify current test count: node node_modules/vitest/vitest.mjs run (expect 654 or higher from Sprint 13b)
4. Verify video file exists: Test-Path "$env:USERPROFILE\Downloads\voidexa_intro_final.mp4"
5. Verify backdrop file exists: Test-Path "$env:USERPROFILE\Downloads\stil_picture_intro.png"
6. If either asset missing, HALT and report

Execute plan:

STEP 1 — Upload video + backdrop to Supabase Storage

Project ID: ihuljnekxkyqgroklurp (EU)
Bucket: intro (create if missing, PUBLIC read access)

Upload two files from Jix's Downloads:
- voidexa_intro_final.mp4 → public/voidexa_intro_final.mp4
- stil_picture_intro.png → public/stil_picture_intro.png

Use Supabase MCP tool if available. Otherwise write a one-shot PowerShell script using @supabase/supabase-js with service role key from .env.local.

Record public URLs and add to .env.local AND Vercel env vars (production + preview):
NEXT_PUBLIC_INTRO_VIDEO_URL=https://ihuljnekxkyqgroklurp.supabase.co/storage/v1/object/public/intro/voidexa_intro_final.mp4
NEXT_PUBLIC_INTRO_BACKDROP_URL=https://ihuljnekxkyqgroklurp.supabase.co/storage/v1/object/public/intro/stil_picture_intro.png

STEP 2 — Remove Sprint 13 Three.js cinematic files

Delete these files (Sprint 13 created them, Sprint 13c replaces them):
- components/home/HomeCinematic.tsx
- components/home/scenes/SceneApproach.tsx
- components/home/scenes/SceneWarp.tsx
- components/home/scenes/SceneArrival.tsx
- components/home/scenes/SceneDoorOpen.tsx
- components/home/scenes/SceneGalaxyReveal.tsx
- components/home/VoiceoverPlayer.tsx (no voiceover in MP4 version)
- hooks/useCinematicTimeline.ts
- lib/cinematic/config.ts
- lib/cinematic/* (whole directory if it exists)
- lib/game/preload.ts (was used for Three.js asset preloading, not needed with MP4)

Keep these from Sprint 13/13b:
- components/home/SkipButton.tsx (reuse, may need small tweaks)
- components/home/CinematicOverlay.tsx (rename to QuickMenuOverlay.tsx — glass panel design is kept)

STEP 3 — Create new homepage components

Create components/home/IntroVideo.tsx:
- HTML5 <video> element with src from NEXT_PUBLIC_INTRO_VIDEO_URL
- Props: autoPlay, muted (initially true for browser policy), playsInline
- Mute toggle button bottom-right — clickable icon, toggles video.muted
- onTimeUpdate callback — when currentTime >= 3, notify parent to show skip button
- onEnded callback — notify parent that video is complete
- Full-bleed: fixed inset-0, object-fit cover, z-10
- Max file size: 200 lines

Create components/home/WebsiteCreationModal.tsx:
- Modal popup triggered by clicking Website Creation panel
- Content (warm, short copy):
  "We'd love to help you build your website. Our team automates the process with AI so we can deliver fast and affordable. Give us a call, send an email, or leave your contact and we'll reach out."
- Three contact options:
  1. Phone button (tel: link) — use jix's phone number from CONTACT_EMAIL env or placeholder
  2. Email button (mailto: link) — contact@voidexa.com
  3. Inline form: email OR phone input + submit → POST to /api/contact/website-lead (create stub route that writes to Supabase leads table OR just sends email to contact@voidexa.com for now)
- Close button top-right
- ESC key closes modal
- Click outside modal closes modal
- Font rules: body 16px, labels 14px, opacity 0.9 on titles / 0.75 on body
- Max file size: 200 lines

Rename components/home/CinematicOverlay.tsx → components/home/QuickMenuOverlay.tsx and modify:
- Keep glass panel styling from Sprint 13b (rgba(10,15,30,0.35), backdrop-filter blur(6px), border rgba(150,200,255,0.25))
- Reduce to 4 panels total (2x2 grid):
  1. Website Creation — onClick opens WebsiteCreationModal (no navigation)
  2. Custom Apps — href: /products/apps
  3. Universe — href: /universe
  4. Tools — href: /products/ai-tools
- Below panels: 2 CTAs side by side
  1. Enter Free Flight — href: /freeflight (primary style, stronger glow)
  2. Enter Star Map — href: /starmap (secondary style, subtler)
- Below CTAs: checkbox "Don't show quick menu next time"
- Panel title 18px opacity 0.9, description 14px opacity 0.75
- When any CTA or panel is clicked with checkbox checked, write localStorage.setItem('voidexa_skip_intro', 'true') before navigation
- Max file size: 250 lines

Create lib/intro/preferences.ts (max 40 lines):
- export const SKIP_KEY = 'voidexa_skip_intro'
- export function shouldSkipIntro(): boolean (client-side safe)
- export function setSkipIntro(value: boolean): void

STEP 4 — Replace app/page.tsx

Rewrite app/page.tsx as client component:
- 'use client'
- On mount: check shouldSkipIntro() → if true, router.replace('/starmap') and return null
- State: videoEnded (boolean), showOverlay (boolean), showSkip (boolean), checkboxChecked (boolean)
- Render <IntroVideo> with onEnded callback setting videoEnded=true and setTimeout 2000ms → showOverlay=true
- Render <SkipButton> with visible={showSkip}
- When videoEnded, render full-bleed <img src={NEXT_PUBLIC_INTRO_BACKDROP_URL}> as background behind overlay
- Render <QuickMenuOverlay> with show={showOverlay} and checkbox state lifted
- Render <WebsiteCreationModal> controlled by overlay click
- Layout: single screen, overflow hidden, 100vh, no scroll
- Max file size: 150 lines

STEP 5 — Fix top nav Break Room issue

File: components/layout/Nav.tsx (or wherever top nav is)

Current nav: Home, Products, Universe, About, Break Room

Break Room is not built yet. Either:
- Option A: Remove Break Room from nav entirely until it ships
- Option B: Keep it but link to /break-room and create a simple "Coming Soon" page at app/break-room/page.tsx

Choose Option A (simpler, clean nav). Remove Break Room entirely.

Final top nav: Home, Products, Universe, About

Ensure Home link points to / (the new intro page). Ensure Universe link points to /universe.

STEP 6 — Create contact lead API route

Create app/api/contact/website-lead/route.ts:
- POST method
- Accepts { contact: string, type: 'email' | 'phone' }
- Trim env vars defensively (process.env.SUPABASE_URL?.trim())
- Insert into Supabase 'leads' table (create table if missing: id uuid, contact text, type text, source text default 'website_creation', created_at timestamptz default now())
- Also send email notification to contact@voidexa.com (can be stubbed as console.log for now if email sending not configured)
- Return { success: true } or { error: string }
- Max file size: 80 lines

STEP 7 — Tests

Create tests/homepage-intro.test.ts with minimum 8 tests:
1. Homepage renders video element on first visit
2. Homepage redirects to /starmap when skip flag is set in localStorage
3. Skip button hidden before video currentTime reaches 3
4. Skip button appears after currentTime 3
5. Overlay hidden while video plays
6. Overlay fades in 2 seconds after video ends
7. Checkbox click toggles localStorage skip flag
8. All 4 panels have expected routes (Website Creation opens modal, others navigate)
9. (bonus) Enter Free Flight button has href=/freeflight
10. (bonus) Enter Star Map button has href=/starmap
11. (bonus) WebsiteCreationModal opens when Website Creation panel clicked
12. (bonus) Modal closes on ESC key

Test count must remain at or above 654 (from Sprint 13b).

STEP 8 — Build, verify, deploy

1. npm run build — zero errors
2. npm run lint — no new errors  
3. npm test — 654+ green
4. npm run dev — visit localhost:3000
   - Video plays from start
   - Skip button appears at sec 3
   - After video ends + 2s, overlay fades in with glass panels visible over voidexa galaxy backdrop
   - Click Website Creation → modal opens
   - Click Custom Apps → routes to /products/apps
   - Click Universe → routes to /universe
   - Click Tools → routes to /products/ai-tools
   - Click Enter Free Flight → routes to /freeflight
   - Click Enter Star Map → routes to /starmap
   - Click checkbox + click any route → reload page → skips intro, lands on /starmap
   - Clear localStorage → reload → intro plays again
5. Mobile check at 375x812:
   - Panels stack vertically (1 column instead of 2x2)
   - CTAs stack vertically
   - Video still covers full viewport
   - Skip button remains top-right

6. git add .
7. git commit -m "feat(sprint-13c): replace Three.js cinematic with Veo MP4 + quick menu overlay + website creation modal"
8. git push origin main
9. Wait for Vercel deploy
10. Test on production voidexa.com (incognito to reset localStorage)
11. git tag sprint-13c-complete
12. git push origin --tags

Report back:
- Files created (with line counts)
- Files deleted (from Sprint 13 cleanup)
- Build status
- Test results
- Video and backdrop public URLs from Supabase
- Any blockers
- Commit hash
- Vercel deployment URL

Stop conditions:
- Build fails 3 times consecutively → halt, report
- Tests regress below 654 → halt, report
- Video or backdrop upload to Supabase fails → halt, report (may need manual upload)
- Any panel destination route does not exist in app/ → halt, report which one

File size rules apply:
- React components max 300 lines (Tom's rule)
- app/page.tsx max 100 lines (split into components if grows)
- Hooks max 300 lines
- Lib files max 500 lines

Use claude-opus-4-7 model. Font rules: body ≥16px, labels ≥14px, opacity ≥0.5 (glass panels may go lower for intentional transparency effect).

GO.
```

---

## AFTER SPRINT 13C COMPLETES, VERIFY ON VOIDEXA.COM

1. Visit https://voidexa.com/ in incognito
2. Video should auto-play muted
3. Mute toggle should be visible bottom-right, clickable to unmute
4. Skip button visible top-right from sec 3
5. At video end + 2s: 4 glass panels fade in over galaxy backdrop
6. Enter Free Flight CTA works → leads to /freeflight
7. Enter Star Map CTA works → leads to /starmap
8. Click Website Creation → modal opens with phone/email/form
9. Check the checkbox + click any CTA → reload → skips directly to /starmap
10. Clear localStorage → reload → intro plays again from start
11. Top nav shows: Home, Products, Universe, About (no Break Room)

---

## IF SPRINT 13C SUCCEEDS

Next sprints in order:
- **Sprint 14:** Cards UI rewire to 257 rendered PNGs
- **Sprint 15:** Starter GHAI grant + Warp Gate texture + Supabase Lock fix
- **Sprint 16:** Shop Stripe checkout wire-up
- **Sprint 17:** Starmap Level 2 + Universe zoom + gaming landmarks
- **Sprint 18:** Enable disabled Universe sidebar search (was previously planned in 13c but deferred)

---

## ROLLBACK IF NEEDED

```powershell
cd C:\Users\Jixwu\Desktop\voidexa
git reset --hard backup/pre-sprint-13c-20260418
git push --force-with-lease origin main
```

Previous Sprint 13b state becomes active again (Three.js film, buggy but present).

---

## FILES DELIVERED BY THIS SPRINT

**New:**
- components/home/IntroVideo.tsx
- components/home/WebsiteCreationModal.tsx
- components/home/QuickMenuOverlay.tsx (renamed from CinematicOverlay.tsx)
- lib/intro/preferences.ts
- app/api/contact/website-lead/route.ts
- tests/homepage-intro.test.ts
- Supabase bucket 'intro' with voidexa_intro_final.mp4 + stil_picture_intro.png

**Modified:**
- app/page.tsx (full rewrite)
- components/layout/Nav.tsx (remove Break Room)
- .env.local (+ Vercel env vars)

**Deleted:**
- components/home/HomeCinematic.tsx
- components/home/scenes/*.tsx (5 files)
- components/home/VoiceoverPlayer.tsx
- hooks/useCinematicTimeline.ts
- lib/cinematic/* (directory)
- lib/game/preload.ts
