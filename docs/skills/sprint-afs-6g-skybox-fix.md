# Bugfix AFS-6g — Skybox Renders Transparent on /game/battle

**Status:** 🔴 NEEDS EXECUTION
**Priority:** P0 (visual regression — skybox shipped invisible)
**Parent sprint:** AFS-6g (`sprint-afs-6g-complete` → `7f09077`)
**Tag format:** `afs-6g-skybox-fix-complete` (per SLUT 8 bugfix tag convention)
**Backup tag (must push before code):** `backup/pre-afs-6g-skybox-fix-20260426`

---

## SCOPE

AFS-6g shipped a SpaceSkybox component and live-verified "skybox visible (no twinkling stars)". Re-audit on Apr 26 with deeper Chrome diagnostics revealed the skybox is technically rendering but the canvas output is near-fully transparent — pixel sampling shows alpha values of 1–37 out of 255 (avg 0.5) across the viewport. The dark blue/purple body background `rgb(7,7,13)` shines through, making the scene look like solid black.

Two compounding issues:

1. **Three.js Canvas alpha buffer issue.** `<Canvas>` likely runs with default `gl.alpha=true` and no explicit `scene.background` color, so each frame clears to fully transparent. Skybox sphere materials write to color buffer but alpha buffer stays mostly 0.

2. **CSS `opacity: 0.8` on canvas element.** Live-inspected CSS shows the canvas itself has `opacity: 0.8` applied — another 20% reduction stacked on top.

This bugfix restores opaque skybox rendering on `/game/battle` (and `/freeflight`, since they share `SpaceSkybox`). No new visual features. No camera changes. No HUD changes.

---

## OUT OF SCOPE

- Camera repositioning → that's still **AFS-6h** (will run after this fix)
- HUD redesign → AFS-6i / AFS-6j
- Any change to `SpaceSkybox.tsx` itself unless pre-flight proves the component is at fault (current evidence says it's the consumer, not the component)

---

## ROOT CAUSE EVIDENCE (from live audit Apr 26)

Already established via Claude in Chrome diagnostics on `https://voidexa.com/game/battle`:

```
canvas opacity (computed): 0.8
canvas backgroundColor: rgba(0, 0, 0, 0)
canvas parent backgroundColor: rgba(0, 0, 0, 0)
body backgroundColor: rgb(7, 7, 13)

Pixel sampling (425 sample points across canvas):
  - 5.4% of points have any visible color (R+G+B > 30)
  - Average alpha across viewport: 0.5 / 255
  - Colored samples show clear nebula tones (b=255, r=128, g=128 etc)
    confirming SpaceSkybox texture IS rendering
  - But alpha values on those colored pixels: 1, 4, 37, 18 — barely registering
```

Conclusion: SpaceSkybox renders correct colors. Output is transparent because:
- Canvas alpha buffer is not being written to (Three.js Canvas default)
- CSS `opacity: 0.8` further reduces what little alpha makes it through

---

## PRE-FLIGHT (Task 0) — STOP FOR JIX APPROVAL BEFORE ANY CODE

### Task 0.1 — Locate the `opacity: 0.8` rule

```bash
cd C:/Users/Jixwu/Desktop/voidexa
grep -rn "opacity.*0\.8" components/game/battle/ components/freeflight/ components/three/ app/ --include="*.tsx" --include="*.ts" --include="*.css"
grep -rn "opacity-80\b" components/game/battle/ components/freeflight/ components/three/ app/ --include="*.tsx" --include="*.ts"
```

Report back: which file + which line applies `opacity: 0.8` (or Tailwind `opacity-80`) to the canvas or its container. Most likely candidates:
- A wrapper `<div className="opacity-80">` around `<Canvas>`
- Inline style on `<Canvas style={{ opacity: 0.8 }}>` (intentional but wrong)
- A global CSS rule targeting `canvas` element

### Task 0.2 — Inspect Canvas configuration

```bash
cat components/game/battle/BattleCanvas.tsx
```

Report back:
- Does `<Canvas>` have a `gl` prop? If yes, what's in it?
- Does it set a `scene` prop with `background`?
- Is there any `<color attach="background" args={[...]} />` inside the Canvas?

### Task 0.3 — Check Free Flight Canvas for parity

```bash
cat components/freeflight/FreeFlightScene.tsx | head -60
grep -n "Canvas\|gl=\|background" components/freeflight/*.tsx
```

If Free Flight's Canvas has the same default-alpha problem, the fix should cover both. If Free Flight already has `gl.alpha=false` or an explicit background, the fix is battle-only.

### Task 0.4 — Verify SpaceSkybox itself is correct

```bash
cat components/three/SpaceSkybox.tsx
```

Confirm:
- Material is `meshBasicMaterial` with `side: THREE.BackSide` — required so the inside of the sphere is what renders
- Texture is wrapped in `useTexture` or `useLoader` with proper Suspense
- No transparent or alpha props on the material

If `side` is `FrontSide` or default (also FrontSide), that's a third issue — but the live audit data shows colors ARE coming through, so BackSide is probably already set. Verify anyway.

### STOP

Post pre-flight report to Jix with answers to 0.1–0.4. Wait for approval before Task 1.

---

## TASKS (executed only after Task 0 approved)

### Task 1 — Backup tag

```bash
git tag backup/pre-afs-6g-skybox-fix-20260426
git push origin backup/pre-afs-6g-skybox-fix-20260426
git ls-remote --tags origin | grep afs-6g-skybox-fix
```

### Task 2 — Commit SKILL.md FIRST

```bash
cp /path/to/sprint-afs-6g-skybox-fix.md docs/skills/sprint-afs-6g-skybox-fix.md
git add docs/skills/sprint-afs-6g-skybox-fix.md
git commit -m "chore(afs-6g-fix): add skybox-fix SKILL documentation"
git push origin main
```

### Task 3 — Fix Canvas alpha buffer

**Primary fix in `components/game/battle/BattleCanvas.tsx`:**

Find the `<Canvas>` opening tag. Add `gl={{ alpha: false }}` if missing, or merge into existing `gl` prop:

```tsx
<Canvas
  gl={{ alpha: false, antialias: true }}
  // existing camera, dpr, other props stay unchanged
>
```

`alpha: false` makes WebGL use an opaque framebuffer. Each frame clears to opaque black by default. Skybox renders on top fully visible.

**Alternative (if `alpha: false` breaks something):** keep `alpha: true` but explicitly set scene background:

```tsx
<Canvas gl={{ alpha: true }}>
  <color attach="background" args={['#000000']} />
  {/* rest of scene */}
</Canvas>
```

Use the simpler `alpha: false` first. Only fall back to `<color>` if the simpler fix breaks transparent overlays elsewhere.

**Mirror the fix in `components/freeflight/FreeFlightScene.tsx`** if Task 0.3 showed it has the same issue.

### Task 4 — Remove the `opacity: 0.8`

Based on Task 0.1's finding, remove the offending rule. Most common scenarios:

**If a wrapper div:**
```tsx
// before
<div className="opacity-80">
  <BattleCanvas />
</div>

// after — remove the wrapper or remove opacity-80
<BattleCanvas />
```

**If inline on Canvas:**
```tsx
// before
<Canvas style={{ opacity: 0.8 }} ...>

// after — drop the style or set opacity: 1
<Canvas ...>
```

**If global CSS:**
Find the rule in `globals.css` (or wherever) targeting `canvas` and either delete it or scope it to a class that excludes battle/freeflight canvases.

If the `opacity: 0.8` was intentional for a fade-in/fade-out animation, replace it with a class that's only applied during transition state, not statically.

### Task 5 — Tests

**New file:** `tests/afs-6g-skybox-fix.test.ts`

Assertions (target ~6-8):
- `BattleCanvas` Canvas component receives `gl.alpha === false` (parse the JSX prop)
- `BattleCanvas` does not have `opacity: 0.8` inline style or `opacity-80` class
- `FreeFlightScene` Canvas has consistent alpha config (whatever Task 3 chose)
- SpaceSkybox component still uses `BackSide` material (regression guard)
- SpaceSkybox texture path unchanged (`/skybox/deep_space_01.png`)

Total target: ~6-8 new assertions. Cumulative: 1141 → ~1148.

### Task 6 — Build + commit + tag

```bash
npm test
npm run build
git add -A
git commit -m "fix(afs-6g): canvas alpha buffer + opacity dropping skybox to transparent"
git tag afs-6g-skybox-fix-complete
git push origin main
git push origin afs-6g-skybox-fix-complete

git status                                          # must be clean
git log origin/main --oneline -3                    # must show new commit
git ls-remote --tags origin | grep afs-6g-skybox-fix
```

### Task 7 — Wait + live verify

```bash
sleep 90
```

Then in Claude in Chrome (incognito hard-refresh, or ask Jix to verify):

1. Navigate to https://voidexa.com/game/battle
2. Start Tier 1 fight
3. Take screenshot
4. **Expected result:** nebula visible — purple/blue/red clouds, distant stars. Player ship and enemy ship sit ON TOP of the nebula, not on a black void.
5. Re-run the diagnostic script that found the bug:

```js
(() => {
  const canvas = document.querySelector('canvas');
  const off = document.createElement('canvas');
  off.width = canvas.width; off.height = canvas.height;
  const ctx = off.getContext('2d');
  ctx.drawImage(canvas, 0, 0);
  let coloredPixels = 0; let alphaSum = 0;
  const step = 50;
  for (let y = 0; y < canvas.height; y += step) {
    for (let x = 0; x < canvas.width; x += step) {
      const d = ctx.getImageData(x, y, 1, 1).data;
      alphaSum += d[3];
      if (d[0] + d[1] + d[2] > 30) coloredPixels++;
    }
  }
  const total = Math.floor(canvas.height/step) * Math.floor(canvas.width/step);
  return { coloredPercent: (coloredPixels/total*100).toFixed(1), avgAlpha: (alphaSum/total).toFixed(1) };
})()
```

**Expected after fix:** `coloredPercent` > 60%, `avgAlpha` > 200. Anything significantly below means the fix is incomplete.

6. Repeat on `/freeflight` (skip if BUG-04 memory leak makes it unstable — source-test only)

### Task 8 — CLAUDE.md update

Append to `CLAUDE.md`:

```markdown
### Session 2026-04-26 — Bugfix afs-6g-skybox-fix COMPLETE

**Tag:** `afs-6g-skybox-fix-complete`
**Backup:** `backup/pre-afs-6g-skybox-fix-20260426`
**Tests:** 1141 → ~1148 (+~7)
**HEAD:** [final hash]

**Root cause:** AFS-6g shipped SpaceSkybox component working correctly,
but its consumer `BattleCanvas.tsx` used Three.js default `gl.alpha=true`
without explicit scene background, plus a stacked CSS `opacity: 0.8`,
together making the canvas output near-fully transparent (avg alpha 0.5/255
in live diagnostic). Body `rgb(7,7,13)` showed through making it look black.

**Fix:**
- `<Canvas gl={{ alpha: false }}>` in BattleCanvas (and FreeFlightScene if needed)
- Removed `opacity: 0.8` from canvas / wrapper / global CSS

**Live verification:** coloredPercent went from 5.4% → [post-fix value]%,
avgAlpha 0.5 → [post-fix value].
```

---

## DEFINITION OF DONE

- [ ] Task 0 pre-flight report posted, Jix approved fix path
- [ ] SKILL committed first (Task 2)
- [ ] Backup tag pushed (Task 1)
- [ ] `gl.alpha: false` (or `<color attach="background">`) added to BattleCanvas
- [ ] FreeFlight Canvas mirrored if needed (Task 0.3 finding)
- [ ] `opacity: 0.8` removed from canvas / wrapper / global CSS
- [ ] Tests added (~6-8 assertions, cumulative ~1148)
- [ ] `npm test` green
- [ ] `npm run build` clean
- [ ] Committed + tagged + pushed
- [ ] `git status` clean post-push
- [ ] Wait ≥90s for Vercel deploy
- [ ] Live diagnostic re-run shows coloredPercent > 60% and avgAlpha > 200
- [ ] Visual confirmation: nebula clearly visible on `/game/battle`
- [ ] CLAUDE.md updated + delivered at SLUT
- [ ] No regression on transparent UI overlays (cards still semi-transparent if they were before)

---

## RISKS

1. **`alpha: false` breaks transparent UI overlays.** If cards or HUD elements rely on alpha-blending against the canvas, switching to opaque framebuffer might make them look different. Mitigation: cards are HTML elements rendered ABOVE canvas in the DOM, not in WebGL, so they should be unaffected. Verify live.

2. **The `opacity: 0.8` may have been intentional** for a vibe / "spacey" feel. Restoring full opacity will look more saturated than before. If Jix wants the dimmed look back, the right way is to dim the skybox texture itself (via the `brightness` prop pattern from AFS-6h SKILL) — not by killing canvas alpha.

3. **Free Flight is hard to live-verify** due to BUG-04 memory leak. If FreeFlightScene needs the same fix, source-test only — accept that live verify there is blocked.

4. **Camera config from AFS-6g unchanged.** Once skybox is visible, the existing AFS-6g camera setup will look much better than the black-void state, but ships will still be too close to camera by AFS-6h's reference target. That's expected — AFS-6h runs after this fix to address framing.

---

## ROLLBACK

```bash
git reset --hard backup/pre-afs-6g-skybox-fix-20260426
git push origin main --force-with-lease
git push origin :refs/tags/afs-6g-skybox-fix-complete
git tag -d afs-6g-skybox-fix-complete
```

---

## NEXT SPRINT

After this fix lands and live-verifies:
- **AFS-6h** Battle Scene v3 visual layer (camera reframing per reference image) runs as planned
- AFS-6h's pre-flight will get more accurate measurements because the scene now renders properly

---

# END SKILL
