# SPRINT 13C — HOMEPAGE CINEMATIC REPLACEMENT + VOICEOVER
## Replace Three.js Sprint 13/13b Film with Veo 3.1 MP4 Video (with AI voiceover)

---

## CONTEXT

Sprint 13 and Sprint 13b built a 45-second Three.js cinematic film on the homepage. It had 8 rendering bugs and was the wrong tool for the job.

During the April 17-18 session, Jix produced a real 31.1-second cinematic MP4 using Runway Veo 3.1 (`voidexa_intro_final.mp4`, 1920x1080, 65MB, H.264/AAC). The final video frame matches `stil_picture_intro.png` pixel-for-pixel, enabling a seamless transition from video to overlay background.

**This sprint replaces the Three.js film entirely with the MP4 video + adds AI voiceover.** Keep the good parts from Sprint 13/13b (glass panel overlay, skip button, no scroll, 100vh single screen). Remove everything else.

---

## ASSETS READY

In Jix's Downloads:
- `voidexa_intro_final.mp4` — 31.1s cinematic, 1920x1080, ~65MB (NO voiceover yet — only ambient sound from Veo)
- `stil_picture_intro.png` — final frame backdrop

In Jarvis project (for voiceover generation):
- `C:\Users\Jixwu\Projects\jarvis\.env` contains `ELEVENLABS_API_KEY` and `ELEVENLABS_VOICE_ID`

Voiceover script (locked — confirmed by Jix):
- **Sec 0-2:** "Welcome aboard Voidexa Intergalactic Transit."
- **Sec 7-10:** "Engaging warp drive. Destination: Voidexa Star System."
- **Sec 22-25:** "Arriving at Voidexa Star System."
- **Sec 28-30:** "Welcome to the future of AI."

---

## USAGE (TWO POWERSHELL BOXES)

### Box 1 — Start Claude Code

```powershell
cd C:\Users\Jixwu\Desktop\voidexa; claude --dangerously-skip-permissions
```

### Box 2 — Paste this prompt

```
Read docs/VOIDEXA_INTENT_SPEC.md section 2 first. Then read docs/skills/sprint-13c-homepage-video.md for full context. Then read docs/skills/sprint-13-homepage-cinematic.md to understand what Sprint 13 built (and what needs to be removed).

This sprint replaces the Three.js cinematic with a real Veo MP4 video + AI voiceover.

Summary:
- Generate AI voiceover using ElevenLabs API (4 lines, script locked)
- Stitch voiceover into voidexa_intro_final.mp4 at correct timings (preserve existing ambient audio)
- Upload new MP4 with voiceover + backdrop image to Supabase Storage
- Remove the Three.js cinematic from Sprint 13 (HomeCinematic.tsx, all scenes/*.tsx, useCinematicTimeline.ts, lib/cinematic/*)
- Keep the glass panel overlay design from Sprint 13b
- Build new intro system: HTML5 video → overlay with 4 glass panels + 2 CTAs + checkbox
- Website Creation panel opens modal (not a route)
- Fix Break Room nav issue (remove from top nav)
- Remove the session persistence bug (film must replay from sec 0 on every reload)

Pre-flight:
1. Create git backup tag: git tag backup/pre-sprint-13c-20260418
2. Push the tag: git push origin --tags
3. Verify current test count: node node_modules/vitest/vitest.mjs run (expect 654 or higher)
4. Verify video file exists: Test-Path "$env:USERPROFILE\Downloads\voidexa_intro_final.mp4"
5. Verify backdrop file exists: Test-Path "$env:USERPROFILE\Downloads\stil_picture_intro.png"
6. Verify Jarvis .env exists: Test-Path "C:\Users\Jixwu\Projects\jarvis\.env"
7. Verify ffmpeg is installed: ffmpeg -version (must exist in PATH)
8. If any check fails, HALT and report

===========================================
STEP 0 — AI VOICEOVER GENERATION + AUDIO STITCHING
===========================================

This step produces `voidexa_intro_final_with_voiceover.mp4` before anything else.

STEP 0.1 — Read ElevenLabs credentials

Read ELEVENLABS_API_KEY and ELEVENLABS_VOICE_ID from C:\Users\Jixwu\Projects\jarvis\.env.

Method: Use PowerShell to parse the .env file:
```
$envPath = "C:\Users\Jixwu\Projects\jarvis\.env"
$envContent = Get-Content $envPath
$apiKey = ($envContent | Where-Object { $_ -match "^ELEVENLABS_API_KEY=" }) -replace "^ELEVENLABS_API_KEY=", "" -replace '"', ''
$voiceId = ($envContent | Where-Object { $_ -match "^ELEVENLABS_VOICE_ID=" }) -replace "^ELEVENLABS_VOICE_ID=", "" -replace '"', ''
```

Verify both values are non-empty. If empty, HALT and report.

STEP 0.2 — Generate 4 voiceover MP3 files

Use the ElevenLabs Text-to-Speech API. Model: eleven_multilingual_v2 (highest quality for cinematic voiceover).

For each of the 4 scripts below, call POST https://api.elevenlabs.io/v1/text-to-speech/{voice_id}?output_format=mp3_44100_128 with JSON body:
{
  "text": "<script text>",
  "model_id": "eleven_multilingual_v2",
  "voice_settings": {
    "stability": 0.5,
    "similarity_boost": 0.75,
    "style": 0.3,
    "use_speaker_boost": true
  }
}

Headers:
- xi-api-key: <API_KEY>
- Content-Type: application/json

Save each response body as MP3 to:
- C:\Users\Jixwu\Desktop\voidexa\tmp\audio\vo_01_welcome.mp3 — Text: "Welcome aboard Voidexa Intergalactic Transit."
- C:\Users\Jixwu\Desktop\voidexa\tmp\audio\vo_02_engage.mp3 — Text: "Engaging warp drive. Destination: Voidexa Star System."
- C:\Users\Jixwu\Desktop\voidexa\tmp\audio\vo_03_arrive.mp3 — Text: "Arriving at Voidexa Star System."
- C:\Users\Jixwu\Desktop\voidexa\tmp\audio\vo_04_welcome_future.mp3 — Text: "Welcome to the future of AI."

Create tmp/audio/ directory first. Add tmp/ to .gitignore if not already there.

If any API call fails (non-200 response), HALT and report the error.

STEP 0.3 — Verify audio files

For each generated MP3, check:
- File exists
- File size > 10KB
- ffprobe can read duration (should be 1-4 seconds each)

STEP 0.4 — Copy video to working directory

Copy C:\Users\Jixwu\Downloads\voidexa_intro_final.mp4 to C:\Users\Jixwu\Desktop\voidexa\tmp\video\voidexa_intro_final.mp4 (create folders).

STEP 0.5 — Stitch voiceover into video using ffmpeg

Use ffmpeg's amix filter to mix the 4 voiceover clips into the existing audio track at precise timings. This PRESERVES the ambient warp sounds from Veo and layers the AI voice on top.

Run this ffmpeg command (PowerShell):

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

Notes:
- adelay values are in milliseconds (0, 7000, 22000, 28000)
- Voiceover clips get volume 1.2 (boost for clarity)
- Original ambient audio reduced to volume 0.4 so voiceover is dominant
- Video stream is copied unchanged (fast, lossless)
- Output is AAC 192kbps stereo audio

If ffmpeg fails, HALT and report stderr output.

STEP 0.6 — Verify final MP4

Check:
- File exists at C:\Users\Jixwu\Desktop\voidexa\tmp\video\voidexa_intro_final_with_voiceover.mp4
- ffprobe duration is approximately 31.1 seconds (within 0.5s tolerance)
- ffprobe reports 2 streams: video (h264) + audio (aac)
- File size is between 55MB and 80MB

If any check fails, HALT and report.

STEP 0.7 — Continue to STEP 1 once audio version is ready

===========================================
STEP 1 — Upload video + backdrop to Supabase Storage
===========================================

Project ID: ihuljnekxkyqgroklurp (EU)
Bucket: intro (create if missing, PUBLIC read access)

Upload two files:
- voidexa_intro_final_with_voiceover.mp4 from tmp/video/ → public/voidexa_intro_final.mp4 (USE THE VOICEOVER VERSION)
- stil_picture_intro.png from Jix's Downloads → public/stil_picture_intro.png

Use Supabase MCP tool if available. Otherwise write a one-shot PowerShell script using @supabase/supabase-js with service role key from .env.local.

Record public URLs and add to .env.local AND Vercel env vars (production + preview):
NEXT_PUBLIC_INTRO_VIDEO_URL=https://ihuljnekxkyqgroklurp.supabase.co/storage/v1/object/public/intro/voidexa_intro_final.mp4
NEXT_PUBLIC_INTRO_BACKDROP_URL=https://ihuljnekxkyqgroklurp.supabase.co/storage/v1/object/public/intro/stil_picture_intro.png

===========================================
STEP 2 — Remove Sprint 13 Three.js cinematic files
===========================================

Delete these files:
- components/home/HomeCinematic.tsx
- components/home/scenes/SceneApproach.tsx
- components/home/scenes/SceneWarp.tsx
- components/home/scenes/SceneArrival.tsx
- components/home/scenes/SceneDoorOpen.tsx
- components/home/scenes/SceneGalaxyReveal.tsx
- components/home/VoiceoverPlayer.tsx
- hooks/useCinematicTimeline.ts
- lib/cinematic/config.ts
- lib/cinematic/* (whole directory)
- lib/game/preload.ts

Keep:
- components/home/SkipButton.tsx
- components/home/CinematicOverlay.tsx (rename to QuickMenuOverlay.tsx)

===========================================
STEP 3 — Create new homepage components
===========================================

components/home/IntroVideo.tsx (max 200 lines):
- HTML5 video element with src from NEXT_PUBLIC_INTRO_VIDEO_URL
- autoPlay, muted (initially true), playsInline
- Mute toggle button bottom-right — clickable icon, toggles video.muted
  - IMPORTANT: When user unmutes, they hear AI voiceover (primary feature)
  - Default muted=true for autoplay, prompt user to unmute via animated icon/tooltip
- onTimeUpdate callback — when currentTime >= 3, notify parent to show skip button
- onEnded callback — notify parent video is complete
- Full-bleed: fixed inset-0, object-fit cover, z-10

components/home/WebsiteCreationModal.tsx (max 200 lines):
- Modal popup triggered by Website Creation panel click
- Copy: "We'd love to help you build your website. Our team automates the process with AI so we can deliver fast and affordable. Give us a call, send an email, or leave your contact and we'll reach out."
- Three contact options:
  1. Phone button (tel: link)
  2. Email button (mailto:contact@voidexa.com)
  3. Inline form: email OR phone input + submit → POST /api/contact/website-lead
- Close button, ESC key, click outside — all close modal
- Body 16px, labels 14px, titles opacity 0.9 / body 0.75

Rename components/home/CinematicOverlay.tsx → QuickMenuOverlay.tsx (max 250 lines):
- Keep Sprint 13b glass panel styling (rgba(10,15,30,0.35), backdrop-filter blur(6px), border rgba(150,200,255,0.25))
- 4 panels in 2x2 grid (1 column on mobile <768px):
  1. Website Creation — onClick opens WebsiteCreationModal (no nav)
  2. Custom Apps — href: /products/apps
  3. Universe — href: /universe
  4. Tools — href: /products/ai-tools
- 2 CTAs side by side below panels (stack on mobile):
  1. Enter Free Flight — href: /freeflight (primary, stronger glow)
  2. Enter Star Map — href: /starmap (secondary, subtler)
- Checkbox: "Don't show quick menu next time"
- Panel title 18px opacity 0.9, description 14px opacity 0.75
- On CTA click with checkbox checked → localStorage.setItem('voidexa_skip_intro', 'true') before navigation

lib/intro/preferences.ts (max 40 lines):
- export const SKIP_KEY = 'voidexa_skip_intro'
- export function shouldSkipIntro(): boolean
- export function setSkipIntro(value: boolean): void

===========================================
STEP 4 — Replace app/page.tsx (max 150 lines)
===========================================

- 'use client' directive
- On mount: if shouldSkipIntro() → router.replace('/starmap'), return null
- State: videoEnded, showOverlay, showSkip, checkboxChecked
- Render IntroVideo with callbacks
- Render SkipButton with visible={showSkip}
- When videoEnded, render backdrop img full-bleed behind overlay
- Render QuickMenuOverlay with show={showOverlay}
- Render WebsiteCreationModal controlled by overlay
- Layout: h-screen w-screen overflow-hidden fixed inset-0

===========================================
STEP 5 — Fix top nav
===========================================

File: components/layout/Nav.tsx
- Remove Break Room link entirely
- Final nav: Home, Products, Universe, About
- Home → /, Universe → /universe

===========================================
STEP 6 — Contact lead API route
===========================================

app/api/contact/website-lead/route.ts (max 80 lines):
- POST { contact: string, type: 'email' | 'phone' }
- .trim() all env vars defensively
- Create leads table if missing:
  create table if not exists leads (
    id uuid primary key default gen_random_uuid(),
    contact text not null,
    type text not null check (type in ('email', 'phone')),
    source text not null default 'website_creation',
    created_at timestamptz not null default now()
  );
  alter table leads enable row level security;
  create policy "leads insert public" on leads for insert to anon with check (true);
- Insert lead into Supabase
- Stub email notification to contact@voidexa.com (console.log for now)
- Return { success: true } or { error: string }

===========================================
STEP 7 — Tests
===========================================

tests/homepage-intro.test.ts (minimum 8 tests):
1. Homepage renders video element on first visit
2. Homepage redirects to /starmap when skip flag set
3. Skip button hidden before currentTime >= 3
4. Skip button appears at currentTime >= 3
5. Overlay hidden while video plays
6. Overlay fades in 2s after video ends
7. Checkbox toggles localStorage flag
8. All 4 panels have expected handlers
9. (bonus) Enter Free Flight href is /freeflight
10. (bonus) Enter Star Map href is /starmap
11. (bonus) Modal opens on Website Creation click
12. (bonus) ESC closes modal

Test count must remain at 654+ (from Sprint 13b).

===========================================
STEP 8 — Build, verify, deploy
===========================================

1. npm run build — zero errors
2. npm run lint — no new errors
3. npm test — 654+ green
4. npm run dev — manual verification at localhost:3000:
   - Video plays from start with ambient warp sound
   - Click unmute → AI voiceover audible at sec 0, 7, 22, 28
   - Skip button appears at sec 3
   - Overlay fades in 2s after video ends with glass panels over backdrop
   - Website Creation → modal opens
   - Custom Apps → /products/apps
   - Universe → /universe
   - Tools → /products/ai-tools
   - Enter Free Flight → /freeflight
   - Enter Star Map → /starmap
   - Checkbox + click CTA → reload → lands directly on /starmap
   - Clear localStorage → reload → intro plays again
5. Mobile check at 375x812 — panels and CTAs stack vertically
6. Delete tmp/video/ and tmp/audio/ working directories

7. git add .
8. git commit -m "feat(sprint-13c): replace Three.js cinematic with Veo MP4 + ElevenLabs voiceover + quick menu overlay"
9. git push origin main
10. Wait for Vercel deploy
11. Test on production (incognito)
12. git tag sprint-13c-complete
13. git push origin --tags

Report back:
- 4 MP3 durations from ElevenLabs
- Final video file size with audio
- Files created/deleted (line counts)
- Build status, test count, commit hash
- Video + backdrop Supabase URLs
- Vercel deployment URL
- Any blockers

Stop conditions:
- ElevenLabs API failure → halt, report
- ffmpeg stitching failure → halt, report
- Build fails 3 times → halt, report
- Tests regress below 654 → halt, report
- Supabase upload fails → halt, report
- Panel destination route missing → halt, report

Use claude-opus-4-7. Font rules: body ≥16px, labels ≥14px, opacity ≥0.5.

GO.
```

---

## AFTER SPRINT 13C COMPLETES — VERIFY ON VOIDEXA.COM

1. Visit https://voidexa.com/ in incognito
2. Video auto-plays muted (ambient warp sounds only)
3. Click unmute → AI voiceover audible:
   - Sec 0: "Welcome aboard Voidexa Intergalactic Transit."
   - Sec 7: "Engaging warp drive. Destination: Voidexa Star System."
   - Sec 22: "Arriving at Voidexa Star System."
   - Sec 28: "Welcome to the future of AI."
4. Skip button top-right from sec 3
5. Video end + 2s: 4 glass panels fade in over galaxy backdrop
6. Enter Free Flight → /freeflight
7. Enter Star Map → /starmap
8. Website Creation → modal with phone/email/form
9. Checkbox + CTA click → reload → skips to /starmap
10. Clear localStorage → reload → intro plays again
11. Top nav: Home, Products, Universe, About

---

## ROLLBACK

```powershell
cd C:\Users\Jixwu\Desktop\voidexa
git reset --hard backup/pre-sprint-13c-20260418
git push --force-with-lease origin main
```

---

## FILES DELIVERED BY THIS SPRINT

**New:**
- components/home/IntroVideo.tsx
- components/home/WebsiteCreationModal.tsx
- components/home/QuickMenuOverlay.tsx (renamed)
- lib/intro/preferences.ts
- app/api/contact/website-lead/route.ts
- tests/homepage-intro.test.ts
- Supabase bucket 'intro' with voiceover MP4 + backdrop PNG

**Modified:**
- app/page.tsx (full rewrite)
- components/layout/Nav.tsx (remove Break Room)
- .env.local + Vercel env vars
- .gitignore (+ tmp/)

**Deleted:**
- components/home/HomeCinematic.tsx
- components/home/scenes/*.tsx (5 files)
- components/home/VoiceoverPlayer.tsx
- hooks/useCinematicTimeline.ts
- lib/cinematic/*
- lib/game/preload.ts
