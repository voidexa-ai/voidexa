# SPRINT AFS-1 — HOMEPAGE REPAIR
## Skill file for Claude Code
## Location: docs/skills/sprint-afs-1-homepage-repair.md

---

## SCOPE

Reparerer homepage cinematic → quick menu flow. 6 sammenhængende bugs i samme user-flow fixes i ét sprint fordi de deler state machine + shared components.

**Sprint delivers:**
- MUTE button fjernet fra video
- Sound popup session-based (ikke localStorage-permanent)
- Zoom mismatch matematisk løst via matched PNG dimensions
- Bespoke-ord erstattet i alle locales
- Checkbox + link contrast hævet
- /starmap auto-routing verificeret

**Sprint does NOT cover:** Star Map bugs (AFS-10), Free Flight bugs (AFS-8/9), Legal pages (AFS-7), Auth (AFS-2), Game Hub (AFS-3), Admin (AFS-4), Cards (AFS-5), Shop (AFS-6).

---

## CONTEXT

### Why this sprint:
Homepage er det første besøgende ser. 6 bugs har ødelagt onboarding-flowet i 2+ dage:

1. MUTE button synlig under video (shouldn't be — tags user like they're doing something wrong)
2. Sound popup vises kun én gang nogensinde → brugere fanges i muted-state forever efter første Yes/No
3. Zoom mismatch mellem video last frame og quick menu baggrund PNG
4. "Bespoke" er stiv tailoring-sprog, passer ikke til AI-produkt
5. Checkbox + "Replay" link er for lavkontrast — brugere ser dem ikke
6. ENTER STAR MAP / ENTER FREE FLIGHT auto-routing uverificeret

### Live audit evidence (Apr 22, Claude in Chrome):

**Video:**
- `https://ihuljnekxkyqgroklurp.supabase.co/storage/v1/object/public/intro/voidexa_intro_final.mp4`
- Intrinsic: 1920×1080 (aspect 1.778)
- CSS: `object-fit: cover`, `object-position: 50% 50%`, `position: fixed`

**Still frame:**
- `https://ihuljnekxkyqgroklurp.supabase.co/storage/v1/object/public/intro/stil_picture_intro.png`
- Intrinsic: 1536×1024 (aspect 1.500) ← **MISMATCH**
- CSS: identisk med video (`cover`, `50% 50%`)
- Rendered 1818×700 (aspect 2.598 på test-viewport)

**Matematik:**
- Video mister 31% højde i cover-crop
- PNG mister 42% højde i cover-crop
- Differential = 11% zoom-shift ved overgang = det Jix ser

**Sound popup storage:**
- `localStorage["voidexaAudioPreference"] = "enabled"` → popup aldrig vises igen efter første Yes
- Live confirmed: popup kommer kun efter `localStorage.clear()`

**Button references found live:**
- Sound popup har "Yes" / "No" buttons (lowercase, ikke YES/NO som vist i UI)
- MUTE button text: "MUTE" (bottom-right)
- Quick menu: "Enter Free Flight" / "Enter Star Map"
- Checkboxes: "Don't show intro video on future visits" / "Skip quick menu on future visits (go directly to star map)"
- Link: "Replay intro video"

### Previous sprint state:
- Sprint 16 complete (commit `e833c73`, 800/800 tests)
- Sprint 17 SKILL pushed (`e9d6efa`), only Task 1 (nebula `93866cc`) executed
- Alpha set 1000 cards (`b47053e`) pushed, on main branch ✅
- BATCH 1 data safety: 100% complete (6 commits Apr 21)

### What MUST NOT change:
- Video file (`voidexa_intro_final.mp4`) — do not re-encode
- Homepage state machine architecture (page.tsx stages 1-5)
- Quick menu 4-box content structure (only text of "Custom Apps" box)
- ENTER FREE FLIGHT / ENTER STAR MAP button positions
- Break Room in Universe dropdown position 8
- `localStorage["voidexaAudioPreference"]` key name (for backwards compat) — only change WHEN the popup shows

---

## TASKS

Build in this order. Each task has own commit.

### Task 1: Extract video last frame as matched-aspect PNG

**Goal:** Eliminate zoom mismatch by ensuring still PNG has identical aspect ratio to video.

**Implementation:**

```bash
# From voidexa repo root
cd scripts/

# Download video from Supabase (or use local copy if available)
curl -o /tmp/voidexa_intro.mp4 \
  "https://ihuljnekxkyqgroklurp.supabase.co/storage/v1/object/public/intro/voidexa_intro_final.mp4"

# Extract last frame at exactly 31.0s (video is 31.146s)
# Use -sseof to seek from end for precision
ffmpeg -sseof -0.15 -i /tmp/voidexa_intro.mp4 \
  -update 1 -q:v 1 \
  /tmp/stil_picture_intro_1920x1080.png

# Verify dimensions
ffprobe -v error -select_streams v:0 -show_entries stream=width,height \
  -of csv=p=0 /tmp/stil_picture_intro_1920x1080.png
# Expected: 1920,1080

# Create @2x for retina (just upscale lossless — video is already 1080p max)
cp /tmp/stil_picture_intro_1920x1080.png /tmp/stil_picture_intro_1920x1080@2x.png

# Upload to Supabase Storage intro bucket (overwrites existing with same URL)
# Use existing upload script pattern from scripts/upload-ships-to-supabase.mjs as template
node scripts/upload-intro-frame.mjs /tmp/stil_picture_intro_1920x1080.png

# New URL remains: 
# https://ihuljnekxkyqgroklurp.supabase.co/storage/v1/object/public/intro/stil_picture_intro.png
# (overwrite), or new path:
# https://ihuljnekxkyqgroklurp.supabase.co/storage/v1/object/public/intro/stil_picture_intro_v2.png
```

**Script needed:** `scripts/upload-intro-frame.mjs` — create using `@supabase/supabase-js` with service role key, upsert to `intro/` bucket.

**Files modified:**
- `scripts/upload-intro-frame.mjs` (NEW, ~40 lines)
- Supabase Storage `intro/stil_picture_intro.png` (overwrite with 1920×1080)
- `components/QuickMenuOverlay.tsx` — update PNG URL if new path used

**Validation:**
- [ ] `ffprobe` confirms 1920×1080
- [ ] Browser DevTools shows new PNG loads
- [ ] Live test: video end → menu overlay → **no visible zoom shift** (record GIF if possible)
- [ ] Compare Image 1 (video last frame) vs Image 2 (quick menu) — matching compositions

---

### Task 2: Remove MUTE button + audio-preference respect

**Goal:** MUTE button never shows during cinematic. Video respects existing `voidexaAudioPreference` on load.

**Files modified:**
- `components/IntroVideo.tsx`

**Find + remove:**

```tsx
// DELETE this block in IntroVideo.tsx (or equivalent):
<button 
  className="mute-btn"
  onClick={() => setMuted(!muted)}
>
  {muted ? <VolumeX/> : <Volume2/>} MUTE
</button>
```

**Replace with:** Nothing. Video state derives entirely from `voidexaAudioPreference` localStorage + sound popup answer.

**Add logic (pseudocode):**

```tsx
// On mount in IntroVideo.tsx
const pref = localStorage.getItem('voidexaAudioPreference');
const sessionAsked = sessionStorage.getItem('voidexaSoundPopupAnsweredThisSession');

if (pref === null || sessionAsked !== 'true') {
  // Show sound popup — muted until answered
  videoRef.current.muted = true;
  setShowSoundPopup(true);
} else if (pref === 'enabled') {
  videoRef.current.muted = false;
} else {
  // pref === 'disabled'
  videoRef.current.muted = true;
}
```

**Validation:**
- [ ] Fresh session → popup shows
- [ ] Answer Yes → video unmutes, no popup for rest of session
- [ ] Reload same tab → popup re-shows (NEW session behavior)
- [ ] Close browser → new session → popup shows again
- [ ] No MUTE button visible at any point

---

### Task 3: Sound popup → sessionStorage

**Goal:** Popup appears every new session (not just once per device forever).

**Files modified:**
- `components/SoundPopup.tsx` (or inline in page.tsx / IntroVideo.tsx — find via grep)

**Find current pattern:**

```bash
grep -rn "voidexaAudioPreference" app/ components/ lib/
```

**Change storage logic:**

```tsx
// OLD (wrong — persists forever):
const handleYes = () => {
  localStorage.setItem('voidexaAudioPreference', 'enabled');
  setShow(false);
};

// NEW (session-based popup, but preference persists for default):
const handleYes = () => {
  localStorage.setItem('voidexaAudioPreference', 'enabled');  // keep for future-session default
  sessionStorage.setItem('voidexaSoundPopupAnsweredThisSession', 'true');
  videoRef.current.muted = false;
  setShow(false);
};

const handleNo = () => {
  localStorage.setItem('voidexaAudioPreference', 'disabled');
  sessionStorage.setItem('voidexaSoundPopupAnsweredThisSession', 'true');
  videoRef.current.muted = true;
  setShow(false);
};

// Show logic:
useEffect(() => {
  const asked = sessionStorage.getItem('voidexaSoundPopupAnsweredThisSession');
  if (asked !== 'true') {
    setShow(true);
  }
}, []);
```

**Remove text on popup:** Delete `"YOUR CHOICE IS SAVED FOR NEXT TIME."` — misleading now (choice is per-session, not next-time).

**Replace with:** `"Session-only — you can change this anytime from settings."` or remove line entirely.

**Validation:**
- [ ] Popup shows on first load
- [ ] Click Yes → popup closes, video unmutes
- [ ] Same tab reload → popup shows AGAIN
- [ ] Close tab, open voidexa.com in new tab → popup shows
- [ ] Last preference still influences what Yes/No DEFAULT highlights

---

### Task 4: Fix "Bespoke" in Custom Apps box

**Files modified:**
- `components/QuickMenuOverlay.tsx`
- `lib/i18n/en.ts`
- `lib/i18n/da.ts`

**Find:**

```bash
grep -rn "Bespoke" components/ lib/
```

**Replace:**

EN: `"Bespoke software tailored to your business workflow."` → `"Custom-built apps tailored to your workflow."`

DA: `"Skræddersyet software tilpasset din forretningsworkflow."` (hvis eksisterer) → `"Specialbyggede apps tilpasset dit behov."`

**If hard-coded in QuickMenuOverlay.tsx:** Extract to i18n dictionary + use `tCards('custom-apps.description')` pattern.

**Validation:**
- [ ] Live EN: reads "Custom-built apps tailored to your workflow."
- [ ] Live DA (/dk): reads "Specialbyggede apps tilpasset dit behov."
- [ ] No references to "bespoke" remain in public-facing strings (`grep -r "bespoke" components/` empty)

---

### Task 5: Checkbox + link contrast fix

**Goal:** "Don't show intro", "Skip quick menu", "Replay intro video" all visible.

**Files modified:**
- `components/QuickMenuOverlay.tsx` (or CSS module)

**Current (low contrast, hard to see on dark bg):**

```css
.quickmenu-checkbox-label,
.quickmenu-replay-link {
  opacity: 0.4;
  color: rgba(255, 255, 255, 0.6);
}
```

**Fix:**

```css
.quickmenu-checkbox-label,
.quickmenu-replay-link {
  opacity: 0.9;
  color: rgba(230, 240, 255, 0.95);
  font-weight: 500;  /* bump from 400 */
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);  /* readable on any bg */
}

.quickmenu-replay-link:hover {
  color: #00d4ff;  /* voidexa cyan brand */
}
```

**Validation:**
- [ ] Checkboxes clearly readable
- [ ] "Replay intro video" stands out
- [ ] Works on both dark + lit baggage (test with video end frame + default bg)

---

### Task 6: Verify /starmap auto-routing + checkbox behavior

**Goal:** Confirm existing routing logic still works. No new code expected — this is regression check.

**Test manually (or via Playwright test):**

1. Click "Enter Star Map" button → navigates to `/starmap`
2. Click "Enter Free Flight" button → navigates to `/freeflight`
3. Check "Skip quick menu on future visits" → reload → lands directly on `/starmap`
4. Uncheck → reload → sees quick menu again
5. Check "Don't show intro video" → reload → skips to quick menu state (4-box directly, no video)

**Add Playwright test:** `tests/homepage-flow.spec.ts` (new, ~80 lines)

**If any broken:** Add to task scope, fix. If all work: mark verified.

**Validation:**
- [ ] All 5 test scenarios pass
- [ ] New Playwright test added + green
- [ ] No console errors during flow

---

## FILE SIZE LIMITS (Tom's rules)

- `components/IntroVideo.tsx`: currently 151 lines — must stay < 300
- `components/QuickMenuOverlay.tsx`: currently 180 lines — must stay < 300
- `app/page.tsx`: currently 160 lines — target < 100 if possible (extract client wrapper)
- `scripts/upload-intro-frame.mjs`: NEW, must be < 100 lines

---

## TESTING REQUIREMENTS

### Before commit:
- [ ] `npm test` passes
- [ ] `npm run build` succeeds
- [ ] No TypeScript errors
- [ ] No console errors in dev mode
- [ ] Playwright homepage-flow test added + green

### Expected test count:
- Sprint start baseline: 800/800
- Sprint end target: 803+ (Playwright test adds 3-5 assertions minimum)

---

## GIT WORKFLOW

### Before starting:

```powershell
cd C:\Users\Jixwu\Desktop\voidexa
git status                                      # must be clean
git pull origin main                             # up to date
git tag backup/pre-sprint-afs-1-20260422        # safety tag
git push origin backup/pre-sprint-afs-1-20260422
```

### Commit SKILL.md FIRST (before any code):

```powershell
git add docs/skills/sprint-afs-1-homepage-repair.md
git commit -m "chore(sprint-afs-1): add SKILL.md for homepage repair sprint"
git push origin main
git log origin/main --oneline -3                # verify
```

### During build — commit per task:

```powershell
# Task 1 — last frame extraction
git add scripts/upload-intro-frame.mjs components/QuickMenuOverlay.tsx
git commit -m "fix(homepage): extract matched-aspect still frame from video, eliminate zoom mismatch"
git push origin main

# Task 2 — MUTE removal
git add components/IntroVideo.tsx
git commit -m "fix(homepage): remove MUTE button, respect voidexaAudioPreference on mount"
git push origin main

# Task 3 — session popup
git add components/SoundPopup.tsx components/IntroVideo.tsx
git commit -m "fix(homepage): sound popup now session-based, shows once per browser session"
git push origin main

# Task 4 — text fix
git add components/QuickMenuOverlay.tsx lib/i18n/en.ts lib/i18n/da.ts
git commit -m "fix(homepage): replace 'Bespoke' with 'Custom-built', cleaner product language"
git push origin main

# Task 5 — contrast
git add components/QuickMenuOverlay.tsx
git commit -m "fix(homepage): increase checkbox + replay link contrast for readability"
git push origin main

# Task 6 — verification + test
git add tests/homepage-flow.spec.ts
git commit -m "test(homepage): add Playwright coverage for cinematic → menu → route flow"
git push origin main
```

### After completion — tag:

```powershell
git tag sprint-afs-1-complete
git push origin sprint-afs-1-complete
git status                                      # MUST show "nothing to commit, working tree clean"
git log origin/main --oneline -10               # confirm all 6 task commits + SKILL commit + tag
```

---

## POST-SPRINT LIVE VERIFICATION

After push, wait 90 seconds for Vercel deploy. Then:

```
# Open voidexa.com in incognito (fresh sessionStorage)
# Expected flow:

1. Sound popup appears: "Enable sound for the best experience" with Yes/No
   ✓ No MUTE button anywhere
2. Click Yes
   ✓ Video unmutes and plays
   ✓ Popup disappears
3. Video ends (~31s)
   ✓ Seamlessly transitions to quick menu
   ✓ Background composition identical to video last frame (no zoom shift)
4. Quick menu shows:
   ✓ "Custom-built apps tailored to your workflow" (not "Bespoke")
   ✓ Checkboxes clearly visible (opacity ~0.9)
   ✓ "Replay intro video" clearly visible
5. Click ENTER STAR MAP → /starmap loads
6. Back button → back to voidexa.com
7. Close tab, re-open voidexa.com → sound popup appears AGAIN (new session)
```

If any step fails: DO NOT mark sprint complete. Document failure, create follow-up AFS.

---

## DEFINITION OF DONE

- [ ] All 6 tasks complete
- [ ] All 6 task commits pushed to origin/main
- [ ] SKILL.md committed first (not untracked)
- [ ] Tag `sprint-afs-1-complete` pushed
- [ ] Tests pass: 803+ green
- [ ] Build succeeds
- [ ] Live verification: all 7 flow steps pass in incognito
- [ ] CLAUDE.md updated with new session log entry
- [ ] No regression in other homepage behaviors

---

## TOOLS USED

- Claude Code (`claude --dangerously-skip-permissions`)
- FFmpeg (for video frame extraction)
- Supabase JS SDK (for Storage upload)
- Playwright (for homepage-flow test)
- Git
- npm
- Vercel (auto-deploy via GitHub on push to main)

---

## ROLLBACK

If anything breaks catastrophically:

```powershell
git reset --hard backup/pre-sprint-afs-1-20260422
git push origin main --force-with-lease
```

NEVER `--force` without `--with-lease`.

---

## NOTES

**Why PNG re-export vs CSS-only fix:** CSS `object-fit: contain` produces black letterbox bars. User sees ugly bars on ultrawide/mobile. Matching aspect ratios at asset level produces pixel-perfect crop identity without visual compromise.

**Why sessionStorage not localStorage for popup flag:** localStorage persists across sessions indefinitely. Users who answered 6 months ago get cached into muted-forever state. Session-based means respect for user intent on each visit, while `voidexaAudioPreference` in localStorage still provides smart default for what Yes/No highlights.

**Why "Custom-built" not "Specialbygget":** "Specialbygget" works in DA but in EN "Custom-built" is cleaner than alternatives like "Tailored" (too fashion-y) or "Custom" alone (vague). Both convey same intent without Savile Row tailoring language.
