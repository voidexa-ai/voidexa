# SPRINT 13C — RUN INSTRUCTIONS
## Replace Three.js cinematic with Veo MP4 + ElevenLabs voiceover

---

## Box 1 — Start Claude Code

```powershell
cd C:\Users\Jixwu\Desktop\voidexa; claude --dangerously-skip-permissions
```

---

## Box 2 — Paste when Claude Code is ready

```
Read docs/skills/sprint-13c-homepage-video.md and execute it completely from STEP 0 through STEP 8. Follow all pre-tasks, tasks, exit criteria, and stop conditions exactly as specified. Commit and deploy when all tests pass. Report back when done with: voiceover durations, file sizes, build status, test count, commit hash, Vercel URL.
```

---

## AFTER COMPLETION — Verify on voidexa.com

1. Visit https://voidexa.com/ in incognito
2. Video auto-plays muted (ambient warp sounds)
3. Click unmute → AI voiceover:
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

## ROLLBACK IF NEEDED

```powershell
cd C:\Users\Jixwu\Desktop\voidexa
git reset --hard backup/pre-sprint-13c-20260418
git push --force-with-lease origin main
```
