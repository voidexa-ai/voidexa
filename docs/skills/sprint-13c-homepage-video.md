# SPRINT 13C — HOMEPAGE CINEMATIC REPLACEMENT + VOICEOVER
## Skill file for Claude Code
## Location: docs/skills/sprint-13c-homepage-video.md

---

## SCOPE

Replace the Three.js cinematic film built in Sprint 13 (and partially fixed in Sprint 13b) with the real Veo 3.1 MP4 video produced on April 17-18. Add ElevenLabs AI voiceover. Keep the glass panel overlay from Sprint 13b.

Final deliverable:
- `/` = intro video with AI voiceover → glass panel overlay with 4 panels + 2 CTAs + checkbox
- First visit: full video plays, overlay fades in at end
- Returning visit with skip flag: direct to `/starmap`
- Website Creation panel opens modal (not route)
- Other panels → routes
- Top nav cleanup (remove Break Room)

---

## CONTEXT (do not rebuild)

- Video file: `voidexa_intro_final.mp4` (31.1s, 1920x1080, 65MB) in Jix's Downloads — NO voiceover yet, only ambient Veo sound
- Backdrop: `stil_picture_intro.png` in Downloads, matches video's final frame pixel-perfect
- ElevenLabs credentials in `C:\Users\Jixwu\Projects\jarvis\.env` (`ELEVENLABS_API_KEY`, `ELEVENLABS_VOICE_ID`)
- Top nav exists: Home, Products, Universe, About, Break Room (Break Room must be removed)
- Star map at `/starmap`
- Universe at `/universe`
- Free Flight at `/freeflight`
- Supabase EU project: `ihuljnekxkyqgroklurp`
- Vercel Pro auto-deploys on `git push origin main`
- Product transparency: "Powered by Claude + GPT + Gemini — orchestrated by voidexa"
- Font standards: body ≥16px, labels ≥14px, opacity ≥0.5

---

## VOICEOVER SCRIPT (LOCKED)

| Sec | Text |
|-----|------|
| 0 | "Welcome aboard Voidexa Intergalactic Transit." |
| 7 | "Engaging warp drive. Destination: Voidexa Star System." |
| 22 | "Arriving at Voidexa Star System." |
| 28 | "Welcome to the future of AI." |

---

## PRE-TASKS

1. Create git backup: `git tag backup/pre-sprint-13c-20260418 ; git push origin --tags`
2. Baseline: `npm test` (expect 654+ green from 13b)
3. Verify all required assets exist (video, backdrop, Jarvis .env, ffmpeg in PATH)

---

## TASKS

### STEP 0 — Voiceover generation + audio stitching

**0.1** Read ElevenLabs credentials from Jarvis `.env`:
```powershell
$envPath = "C:\Users\Jixwu\Projects\jarvis\.env"
$envContent = Get-Content $envPath
$apiKey = ($envContent | Where-Object { $_ -match "^ELEVENLABS_API_KEY=" }) -replace "^ELEVENLABS_API_KEY=", "" -replace '"', ''
$voiceId = ($envContent | Where-Object { $_ -match "^ELEVENLABS_VOICE_ID=" }) -replace "^ELEVENLABS_VOICE_ID=", "" -replace '"', ''
```
Verify both non-empty. HALT if empty.

**0.2** Generate 4 MP3 voiceover clips via ElevenLabs API.

Endpoint: `POST https://api.elevenlabs.io/v1/text-to-speech/{voiceId}?output_format=mp3_44100_128`

Headers:
- `xi-api-key: <apiKey>`
- `Content-Type: application/json`

Body:
```json
{
  "text": "<script line>",
  "model_id": "eleven_multilingual_v2",
  "voice_settings": {
    "stability": 0.5,
    "similarity_boost": 0.75,
    "style": 0.3,
    "use_speaker_boost": true
  }
}
```

Save to `C:\Users\Jixwu\Desktop\voidexa\tmp\audio\`:
- `vo_01_welcome.mp3` — "Welcome aboard Voidexa Intergalactic Transit."
- `vo_02_engage.mp3` — "Engaging warp drive. Destination: Voidexa Star System."
- `vo_03_arrive.mp3` — "Arriving at Voidexa Star System."
- `vo_04_welcome_future.mp3` — "Welcome to the future of AI."

Create `tmp/audio/` first. Add `tmp/` to `.gitignore`. HALT on any non-200 response.

**0.3** Verify each MP3:
- File exists
- Size > 10KB
- ffprobe reads duration (1-4s each)

**0.4** Copy video to working dir:
```
Copy C:\Users\Jixwu\Downloads\voidexa_intro_final.mp4 → C:\Users\Jixwu\Desktop\voidexa\tmp\video\voidexa_intro_final.mp4
```

**0.5** Stitch voiceover into video (preserves Veo ambient audio, layers AI voice on top):

```powershell
cd C:\Users\Jixwu\Desktop\voidexa\tmp\video

ffmpeg -y `
  -i voidexa_intro_final.mp4 `
  -i ..\audio\vo_01_welcome.mp3 `
  -i ..\audio\vo_02_engage.mp3 `
  -i ..\audio\vo_03_arrive.mp3 `
  -i ..\audio\vo_04_welcome_future.mp3 `
  -filter_complex "[1:a]adelay=0|0,volume=1.2[a1];[2:a]adelay=7000|7000,volume=1.2[a2];[3:a]adelay=22000|22000,volume=1.2[a3];[4:a]adelay=28000|28000,volume=1.2[a4];[0:a]volume=0.4[bg];[bg][a1][a2][a3][a4]amix=inputs=5:duration=first:dropout_transition=0:normalize=0[aout]" `
  -map 0:v -map "[aout]" `
  -c:v copy `
  -c:a aac -b:a 192k `
  voidexa_intro_final_with_voiceover.mp4
```

Timings: adelay in ms (0, 7000, 22000, 28000). Voice volume 1.2, ambient reduced to 0.4.

**0.6** Verify `voidexa_intro_final_with_voiceover.mp4`:
- Duration ~31.1s (±0.5s tolerance)
- 2 streams (h264 video + aac audio)
- Size 55-80MB

HALT on any failure.

### STEP 1 — Supabase Storage upload

- Bucket: `intro` (PUBLIC read, create if missing)
- Upload `voidexa_intro_final_with_voiceover.mp4` → `public/voidexa_intro_final.mp4` (the WITH_VOICEOVER version)
- Upload `stil_picture_intro.png` from Downloads → `public/stil_picture_intro.png`
- Add to `.env.local` + Vercel env (production + preview):
  - `NEXT_PUBLIC_INTRO_VIDEO_URL=https://ihuljnekxkyqgroklurp.supabase.co/storage/v1/object/public/intro/voidexa_intro_final.mp4`
  - `NEXT_PUBLIC_INTRO_BACKDROP_URL=https://ihuljnekxkyqgroklurp.supabase.co/storage/v1/object/public/intro/stil_picture_intro.png`

### STEP 2 — Remove Sprint 13 Three.js files

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
- `components/home/CinematicOverlay.tsx` → rename to `QuickMenuOverlay.tsx`

### STEP 3 — Create new components

**`components/home/IntroVideo.tsx`** (max 200 lines)
- HTML5 `<video>` element, src from env var
- `autoPlay muted playsInline`
- Mute toggle bottom-right — when clicked, user hears AI voiceover (primary feature)
- Default muted=true for autoplay, prompt user with animated icon/tooltip
- `onTimeUpdate` → parent callback when `currentTime >= 3`
- `onEnded` → parent callback
- Full-bleed fixed positioning, object-fit cover

**`components/home/WebsiteCreationModal.tsx`** (max 200 lines)
- Modal popup triggered by Website Creation panel click
- Copy: "We'd love to help you build your website. Our team automates the process with AI so we can deliver fast and affordable. Give us a call, send an email, or leave your contact and we'll reach out."
- Three options:
  - Phone button (tel: link)
  - Email button (mailto:contact@voidexa.com)
  - Inline form: email/phone input + submit → POST `/api/contact/website-lead`
- Close: button + ESC + click outside
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
- Fade in: 800ms ease-out when `show` prop becomes true
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

### STEP 4 — Rewrite `app/page.tsx` (max 150 lines)

- `'use client'` directive
- On mount: `if (shouldSkipIntro()) { router.replace('/starmap'); return null; }`
- State: `videoEnded`, `showOverlay`, `showSkip`, `checkboxChecked`
- Render `<IntroVideo>` with callbacks:
  - `onSkipAvailable` → `setShowSkip(true)`
  - `onEnded` → `setVideoEnded(true)`; `setTimeout(() => setShowOverlay(true), 2000)`
- Render `<SkipButton visible={showSkip} />` — on click, jump video to end state
- When `videoEnded`, render backdrop `<img src={NEXT_PUBLIC_INTRO_BACKDROP_URL}>` full-bleed behind overlay
- Render `<QuickMenuOverlay show={showOverlay}>` with lifted checkbox state
- Render `<WebsiteCreationModal>` controlled by overlay
- Layout: `h-screen w-screen overflow-hidden fixed inset-0`
- No scroll, no footer, no nav scroll

### STEP 5 — Top nav cleanup

File: `components/layout/Nav.tsx`
- Remove "Break Room" link
- Final nav: Home, Products, Universe, About
- Home → `/`, Universe → `/universe`

### STEP 6 — Contact lead API route

`app/api/contact/website-lead/route.ts` (max 80 lines)
- POST `{ contact: string, type: 'email' | 'phone' }`
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
- Optional: send email notification to contact@voidexa.com (stub with console.log for now)
- Return `{ success: true }` or `{ error: string }`

### STEP 7 — Tests

`tests/homepage-intro.test.ts` (minimum 8):
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

### STEP 8 — Build, verify, deploy

1. `npm run build` — zero errors
2. `npm run lint` — no new errors
3. `npm test` — 654+ green
4. `npm run dev` at localhost:3000 — manual verification of full flow including voiceover
5. Mobile check at 375x812
6. Delete `tmp/video/` and `tmp/audio/` working dirs
7. `git add .`
8. `git commit -m "feat(sprint-13c): replace Three.js cinematic with Veo MP4 + ElevenLabs voiceover + quick menu overlay"`
9. `git push origin main`
10. Wait for Vercel deploy
11. Test production (incognito)
12. `git tag sprint-13c-complete ; git push origin --tags`

---

## EXIT CRITERIA

- `/` renders intro video with AI voiceover on first visit (no Three.js)
- 4 voiceover lines play at correct timings (sec 0, 7, 22, 28)
- Video plays with mute toggle + skip button
- Overlay fades in 2s after video end, over backdrop
- All 4 panels function correctly (1 modal + 3 routes)
- Both CTAs navigate correctly
- Checkbox + click writes skip flag
- Returning visit with skip flag redirects to `/starmap`
- Top nav: Home, Products, Universe, About
- Minimum 8 new tests, all passing
- Total tests 654+ green
- `npm run build` clean
- Vercel deployed via `git push origin main`
- Tag `sprint-13c-complete` pushed
- File size rules respected (page.tsx ≤100 lines, components ≤300 lines)

---

## STOP CONDITIONS

- ElevenLabs API call fails → halt, report
- ffmpeg stitching fails → halt, report
- Build fails 3 times consecutively → halt, report
- Tests regress below 654 → halt, report
- Supabase upload fails → halt, report
- Panel destination route missing → halt, report which one

---

## ROLLBACK

```powershell
git reset --hard backup/pre-sprint-13c-20260418
git push --force-with-lease origin main
```
