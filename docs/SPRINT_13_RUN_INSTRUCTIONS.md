# SPRINT 13 — CLAUDE CODE PROMPT
## Homepage Cinematic (45-sec Three.js film)

---

## Usage (two PowerShell boxes as per Jix's workflow)

### Box 1 — Start Claude Code

```powershell
cd C:\Users\Jixwu\Desktop\voidexa; claude --dangerously-skip-permissions
```

### Box 2 — Paste this prompt when Claude Code asks "what do you want to do?"

```
Read docs/VOIDEXA_INTENT_SPEC.md section 2 first. That is the canonical spec for this homepage.

Then read docs/skills/sprint-13-homepage-cinematic.md. Execute that sprint completely.

Summary of what to build:
- Replace current static parallax homepage with a 45-second Three.js cinematic film
- Film sequence: shuttle approach → warp → arrival at voidexa Galaxy → door opens → galaxy reveal → freeze frame with 4 box overlay
- Auto-play voiceover (Eleven Labs MP3, see script in SKILL file)
- Skip button top-right from sec 3, jumps to freeze frame
- 4 semi-transparent boxes in 2×2 grid appear at sec 42 as OVERLAY on freeze frame (NOT below hero)
- Enter Free Flight CTA button below 4 boxes
- Remove KCP-90 terminal from homepage (move to /starmap in later sprint)
- Homepage becomes single-screen, non-scrollable (100vh, overflow hidden)
- Background asset preloader during film playback (load freeflight + starmap assets)
- Font rules: body ≥16px, labels ≥14px, opacity ≥0.5
- Use claude-opus-4-7 (NOT 4.6, deprecated)

Pre-flight:
1. Create git backup tag: `git tag backup/pre-sprint-13-20260417`
2. Run existing tests to confirm baseline: `node node_modules/vitest/vitest.mjs run` (must be 642 green)

Execute plan:
1. Read required files (INTENT_SPEC section 2, V3 part 2, existing warp shader in app/freeflight)
2. Create components/home/HomeCinematic.tsx (main Three.js scene with GSAP timeline)
3. Create components/home/CinematicOverlay.tsx (4 boxes + CTA)
4. Create components/home/SkipButton.tsx
5. Create components/home/VoiceoverPlayer.tsx (handle browser autoplay blocking)
6. Generate voiceover via Eleven Labs using script in SKILL file — save to public/audio/homepage-voiceover.mp3
   - If Eleven Labs API not available, leave placeholder comment + silent MP3, Jix will provide audio later
7. Create lib/game/preload.ts (asset preloader)
8. Replace app/page.tsx entirely (remove old parallax + cards)
9. Run npm run build — must succeed with no errors
10. Run tests — must remain 642 green

Post-build:
1. Visual sanity: film plays, skip works, boxes appear at sec 42, CTA works
2. Check mobile at 375×812 (panels should stack vertically if too narrow)
3. Performance check: first paint <2s, film <3s, no frame drops

Commit and deploy:
```
git add .
git commit -m "feat(sprint-13): homepage cinematic — Three.js 45-sec film + voiceover + 4 box overlay + skip"
git push origin main
```

Report back:
- Files created
- Build status
- Test results
- Any blockers or missing assets (e.g., if Eleven Labs audio needs to be provided manually)
- Commit hash
- Vercel deployment URL

If anything breaks that cannot be fixed within 3 attempts, halt and report. Rollback available via `git reset --hard backup/pre-sprint-13-20260417`.

Stop conditions:
- Build fails 3 times consecutively → halt, report
- Tests regress below 642 → halt, report
- Voiceover MP3 cannot be generated AND no placeholder silence MP3 available → halt, report

GO.
```

---

## After Sprint 13 completes, verify on voidexa.com

1. Visit https://voidexa.com/
2. Film should auto-play
3. Audio: should start muted with "unmute" prompt, or play if browser allows
4. Skip button visible from sec 3
5. At sec 42: 4 boxes fade in as overlay
6. Enter Free Flight CTA works → leads to /freeflight with 2-3 sec loading

## If Sprint 13 succeeds

Next sprints in order:
- **Sprint 14:** Cards UI rewire to 257 rendered PNGs
- **Sprint 15:** Starter GHAI grant + Warp Gate texture + Supabase Lock fix
- **Sprint 16:** Shop Stripe checkout wire-up
- **Sprint 17:** Starmap Level 2 + zoom + gaming landmarks + move KCP-90

## Rollback if needed

```powershell
cd C:\Users\Jixwu\Desktop\voidexa
git reset --hard backup/pre-sprint-13-20260417
git push --force-with-lease origin main
```

Static parallax homepage becomes fallback until issues resolved.
