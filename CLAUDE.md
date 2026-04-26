# voidexa — CLAUDE.md

**Project memory for Claude Code sessions on voidexa repo.**

Location: `C:\Users\Jixwu\Desktop\voidexa\CLAUDE.md`
Repo: `voidexa-ai/voidexa` (Public, TypeScript)
Owner: Jix (Jimmi Wulff, CVR 46343387, Vordingborg DK)
Model: `claude-opus-4-7` only (NOT 4.6)

---

## PROJECT IDENTITY

voidexa.com is a multi-product sovereign AI infrastructure platform combining:
- AI trading bot (live, regime-based, backtested +194.79%)
- Quantum multi-AI debate engine (4 providers: Claude, Gemini, GPT, Perplexity — 960 tests)
- Void Chat (3 providers: Claude, ChatGPT, Gemini)
- Quantum Forge (debate-to-build pipeline)
- Gaming universe (257-card battle, Free Flight, Star Map, 5 zones)
- GHAI virtual currency ($1 = 100 GHAI, V-Bucks model)
- Comlink encrypted messenger (parked)
- KCP-90 compression (v3 95.67% verified, 4-layer)
- Jarvis PC assistant (v4.1.0, 668 tests, 26 voice commands)
- AEGIS security monitor (hardware, AFS-43)
- Break Room social space (Universe dropdown position 8)

---

## CORE STACK

- **Framework:** Next.js 16 + React 19 + TypeScript
- **Deploy:** Vercel Pro (auto-deploy via GitHub)
- **Production branch:** `main` (since April 15 — master is STALE)
- **Database:** Supabase EU (`ihuljnekxkyqgroklurp`, 58 tables, RLS enabled)
- **Storage:** Supabase Storage bucket `models` (3D GLBs), `intro/` (cinematic)
- **Payments:** Stripe (webhook `we_1TLluLDVfBjAC4z8878uAbqXl`)
- **Auth:** Supabase SSR + AuthProvider

---

## CRITICAL RULES (never violate)

### Code delivery
- FULL copy-paste blackbox only — never line-edits
- NO a/b/c option menus — give direct answer
- Short first, expand on request

### Git (voidexa repo)
- `git push origin main` ONLY
- Post-push MANDATORY: `git status` clean + `git log origin/main --oneline -3`
- Commit SKILL.md FIRST in any sprint
- Explicit staging (not `git add .`)

### File size limits
- React components: MAX 300 lines
- page.tsx files: MAX 100 lines
- lib/ files: MAX 500 lines

### PowerShell (if needed)
- Use `;` not `&&`
- ASCII only — NO em-dashes (breaks scripts, proven twice)
- UTF-8 without BOM
- Danish Downloads = "Overførsler"

### Vercel env vars
- ALWAYS `.trim()` in API routes

### Model
- Always `claude-opus-4-7`

---

## SPRINT HISTORY

| Sprint | Commit | Tests | Feature |
|---|---|---|---|
| Sprint 13c | `19f4178` | 658 | Kling/Veo MP4 cinematic |
| Sprint 14a | `6d67a4d` | 718 | Auth-lock storm fix |
| Sprint 15 | `20231ce` | 766 | Flight foundation |
| Sprint 16 | `e833c73` | 800 | BoostTrail GPU |
| Sprint 17 SKILL | `e9d6efa` | — | Pushed, Tasks 2-8 NOT executed |
| Alpha set | `b47053e` | — | 1000-card alpha on main |
| **AFS-1 complete** | `8d3a1e6` | **825** | **Homepage cinematic repair** |
| **AFS-1d** | `357e1a9` | 825 | **Ultrawide backdrop PNG** |
| **AFS-7 complete** | `b58fcb8` | **860** | **Legal pages + sitemap + robots + cookie banner** |
| **AFS-2 complete** | `36d5f62` | **910** | **Auth route infra — 14 redirects + /wallet + /settings** |
| **AFS-3 complete** | `3da828c` | **938** | **Game hub 404 fixes — 8 redirects + tile UX pass** |
| **AFS-4 complete** | `a15e568` | **973** | **Admin Control Plane data pipeline — kcp90_compression_events + 4 product loggers + real dashboard** |
| **AFS-6a complete** | `bf1ce98` | **994** | **In-game Shop GHAI flow — mount ShopCosmeticsClient, /shop modal rewire, /inventory page** |
| **AFS-6a-fix complete** | `6144e08` | **1014** | **Post-ship bugfixes — Universe nav +Inventory, back-link, cross-nav, Alpha copy, pack Coming Soon lockdown** |
| **AFS-6d complete** | `bdc6f3f` | **1087** | **Cards Premium Rebuild — 1000 Alpha cards in DB, paginated catalog, deck builder, 5 saved slots** |
| **AFS-6g complete** | `sprint-afs-6g-complete` | **1141** | **Battle Scene v2 — SpaceSkybox (battle + freeflight), WoW-style orbit camera, footer hotfix, 27 CVEs deferred** |
| **afs-6g-skybox-fix complete** | `21c5db7` | **1150** | **Canvas alpha buffer fix — `gl.alpha=false` on BattleCanvas + FreeFlightCanvas; skybox no longer renders transparent** |
| **afs-6g-skybox-fix-2 complete** | `191eede` | **1152** | **Vignette darkness 0.78 → 0.55 — unblocks nebula midtones that post-processing crushed below fallback color** |
| **afs-6g-skybox-fix-3 complete** | `8d8021a` | **1157** | **`brightness` prop on SpaceSkybox + battle uses 2.5x — boosts dim nebula past Bloom threshold and over scene.background fallback** |
| **afs-6g-skybox-fix-4 complete** | `26cbde1` | **1158** | **Imperative `matRef.current.color.setRGB()` replaces prop-based color — fix-3 prop did not reach shader; ref-based mutation guaranteed to apply** |
| **afs-6g-skybox-fix-5 complete** | `3a18aa6` | **1159** | **Skybox material `fog={false}` — scene fog (far=160) was masking sphere (radius 1500) at fogFactor=0, overwriting all earlier fixes with fogColor=scene.background** |
| **afs-6g-skybox-fix-6 complete** | `9cd590d` | **1160** | **Empirical brightness tuning 2.5 → 4.0 — fog disable lifted skybox to avgSum 28.7, brightness bump pushes nebula past sum 50 visibility threshold** |
| **afs-6g-skybox-fix-7 complete** | `8aedc1a` | **1162** | **Texture swap to custom AI-generated `deep_space_universe.png` — closes 7-fix skybox bug-cluster; asset quality > pipeline tuning** |
| **commbubble-hotfix complete** | `commbubble-hotfix-complete` | **1168** | **Move Jarvis bubble to bottom-right + route-skip on /starmap and /dk/starmap — fixes z-[60] vs z-50 overlap with UniverseChat on 9 ruter while preserving Sprint 16 Task 6 KCP-90 collision avoidance** |

---

## SESSION LOG

### Session 2026-04-26 — CommBubble Hotfix COMPLETE (Jarvis → bottom-right + /starmap route-skip)

**Status:** ✅ SHIPPED to `origin/main`, tag `commbubble-hotfix-complete` pushed, build clean, 1168/1168 tests green. Live verify pending Jix browser check on 3 ruter (incognito + hard reload).
**Tag:** `commbubble-hotfix-complete`
**Backup:** `backup/pre-commbubble-hotfix-20260426` → `3683d52`
**Tests:** 1168/1168 green (was 1162, +6 new commbubble-position assertions). Pre-existing `tests/sprint-16-performance-and-asset-pipeline.test.ts` flipped one assertion to track new state (same pattern as AFS-3 nav-dropdown flip).
**SKILL:** `docs/skills/bugfix-commbubble-position.md` (already committed at `3683d52`)

**Bug:** Live audit SLUT 11 (Apr 25) confirmed Jarvis (`z-[60]`) sat ON TOP of UniverseChat (`z-50`) — both at `fixed bottom-6 left-6` — blocking Universe Chat clicks on `/cards`, `/cards/alpha`, `/shop`, `/break-room`, `/wallet`, `/quantum/chat`, `/about`, `/home`, `/cards/alpha/deck-builder`. Pre-flight Task 0 confirmed exact identical positions, no `md:` responsive variants to chase.

**Fix shipped (option (b) — route-conditional render):**
- `components/ui/JarvisAssistant.tsx`:
  1. Trigger bubble div: `fixed bottom-6 left-6 z-[60]` → `fixed bottom-6 right-6 z-[60]`
  2. Chat panel motion.div: `fixed bottom-24 left-6 z-[60]` → `fixed bottom-24 right-6 z-[60]` (mirrors trigger so panel pops up next to bubble)
  3. New route-skip: `if (/^\/(?:dk\/)?starmap(?:\/|$)/.test(pathname ?? '')) return null` — preserves Sprint 16 Task 6 fix (Jarvis was originally moved bottom-left to dodge KCP-90 terminal at bottom-right on `/starmap`; we move back to right but skip /starmap entirely)
  4. Existing skips preserved (`/`, `/freeflight`, `/assembly-editor`)
- UniverseChat stays at `fixed bottom-6 left-6 z-50` — UNCHANGED, still alone on bottom-left

**Why option (b) over SKILL's option (a):** the SKILL as written would have re-introduced the Sprint 16 Task 6 collision on `/starmap` (KCP-90 terminal vs Jarvis at bottom-right). Pre-flight reading of the comment block on `JarvisAssistant.tsx:82-83` flagged this. Option (b) preserves both prior fixes — overlap on 9 routes goes away AND the KCP-90 terminal stays unblocked on /starmap.

**Sprint deviations from SKILL (documented):**
1. **Three className edits, not one** — SKILL flagged only the trigger bubble. Reading the file revealed the chat panel (`bottom-24 left-6`) also needed the `right-6` swap so the panel doesn't pop up away from the trigger. Caught at Task 0; no checkpoint surprise.
2. **Test count overshoot** — 6 new assertions vs SKILL target of 3. Added coverage for chat panel position parity, route-skip regex presence, and existing route-skip preservation guard.
3. **Pre-existing test flipped** — `tests/sprint-16-performance-and-asset-pipeline.test.ts:210` asserted `bottom-6 left-6 z-[60]` (the Sprint 16 Task 6 state). Updated to assert `bottom-6 right-6 z-[60]` AND the new `/starmap` route-skip is present, with comment block explaining both fixes are now active. Same pattern AFS-3 used for the Break Room/Inventory nav order flip.
4. **SKILL Task 2 was a no-op** — SKILL was already committed at `3683d52` (HEAD) before this session started. Skipped re-commit.

**Files modified:**
- `components/ui/JarvisAssistant.tsx` (trigger position + chat panel position + new route-skip + comment block rewrite)
- `tests/sprint-16-performance-and-asset-pipeline.test.ts` (one assertion flipped)
- `CLAUDE.md` (this entry + sprint history row + P0 bug row update)

**Files added:**
- `tests/commbubble-position.test.ts` (6 assertions across 2 describe blocks)

**Known items out-of-scope (tracked for AFS-13 CommBubble Merge):**
- Chat-close-bubble-disappears (P0)
- Chat cannot fold to bubble (P1)
- Jarvis missing on `/` homepage (intentional skip — preserved in route-skip list)
- `hello@voidexa.com` typo in JARVIS contact response copy
- Two separate widgets → proper merge to ONE bubble with tabs

**Live verification (pending Jix):**
- Hard-reload + incognito on `/cards/alpha/deck-builder` — Jarvis bottom-right, Universe Chat bottom-left, both clickable separately, no overlap
- `/starmap` Level 1 + Level 2 — Jarvis NOT visible (route-skip), KCP-90 terminal at bottom-right unblocked
- One sample route from the original 9 (e.g. `/break-room`, `/wallet`) — Jarvis bottom-right, Universe Chat bottom-left

**Rollback:**
```bash
git reset --hard backup/pre-commbubble-hotfix-20260426
git push origin main --force-with-lease
git push origin :refs/tags/commbubble-hotfix-complete
git tag -d commbubble-hotfix-complete
```

---

### Session 2026-04-26 — afs-6g-skybox-fix-7 COMPLETE (cluster closure)

**Status:** ✅ SHIPPED to `origin/main`, tag `afs-6g-skybox-fix-7-complete` pushed, build clean, 1162/1162 tests green. Live visual verify pending Jix browser check.
**Tag:** `afs-6g-skybox-fix-7-complete`
**Backup:** `backup/pre-afs-6g-skybox-fix-7-20260426` → `a5f591e`
**Tests:** 1162/1162 green (was 1160, +4 fix-7 path assertions, -2 obsolete brightness assertions, +1 updated afs-6g-battle-camera assertion = +2 net)
**Final HEAD:** `8aedc1a`

**Closes:** afs-6g skybox bug-cluster (7 fixes, 9 commits across 5 hours of diagnostic-driven iteration)

**Commit chain (SKILL + fix + docs):**
```
8aedc1a fix(afs-6g): swap battle skybox to custom AI-generated equirectangular nebula
3a9fdb3 chore(afs-6g-fix-7): add skybox-fix-7 SKILL documentation (cluster closer)
```

**Bug-cluster summary (chronological):**
| # | Fix | Commit | Real fix? | Diagnostic value |
|---|---|---|---|---|
| 1 | Canvas alpha buffer (`gl.alpha=false`) | `21c5db7` | ✅ Yes | Necessary, not sufficient |
| 2 | Vignette darkness 0.78 → 0.55 | `191eede` | ✅ Yes | Cosmetic edge correction |
| 3 | Brightness prop with `Color` instance | `8d8021a` | ❌ Dead-end | Proved R3F prop wasn't bottleneck |
| 4 | Imperative `matRef.current.color.setRGB()` | `26cbde1` | ❌ Dead-end | Proved color setter mechanism wasn't bottleneck |
| 5 | Skybox material `fog={false}` | `3a18aa6` | ✅ Yes — THE blocker | Single uniform replacement masking all earlier fixes |
| 6 | Brightness 2.5 → 4.0 on dim texture | `9cd590d` | ⚠️ Partial workaround | Lifted avgSum 16 → 28.7; not enough |
| 7 | **Texture swap to custom AI nebula** | `8aedc1a` | **✅ The proper solution** | **Closes the cluster** |

**Final state of skybox stack:**
- **Battle Scene:** `<SpaceSkybox texture="/skybox/deep_space_universe.png" radius={1500} rotateWithCamera={false} intensity={1} />` — no brightness prop (default 1.0)
- **Free Flight:** unchanged — `<SpaceSkybox texture="/skybox/deep_space_01.png" radius={1500} rotateWithCamera={true} intensity={1} />` — no brightness prop
- **SpaceSkybox component:** retains all architectural fixes (brightness prop API + imperative ref + setRGB + fog={false} + BackSide + toneMapped={false})
- **BattleCanvas:** retains gl.alpha=false + vignette darkness 0.55

**New asset:** `public/skybox/deep_space_universe.png` (1774×887, 2:1 equirectangular, ~2.6 MB, AI-generated by Jix via ChatGPT image gen, internal voidexa asset per OpenAI ToS)

**Sprint deviations from convention (documented):**
1. **SKILL committed** — bracket-symmetry with fix-1 SKILL commit. Substantial diagnostic document worth preserving for future cluster regressions; Jix override of "skip SKILL" default.
2. **Default-path assertion retained** — `texture path unchanged` in fix-1 test asserts SpaceSkybox component DEFAULT (not battle usage). Free Flight depends on the default; assertion stays valid.
3. **Test net +2 vs -2 brightness obsolete** — Removed `Battle scene brightness > 1` and `Battle scene brightness >= 4.0` assertions; added `Battle scene texture path is /skybox/deep_space_universe.png`, `Battle does NOT pass brightness`, `Battle does not reference deep_space_01`, `Free Flight still uses deep_space_01`. Updated existing `tests/afs-6g-battle-camera.test.ts` `bundled deep_space_01.png texture` assertion to point at new path.
4. **brightness prop architecture retained even though Battle no longer uses it** — Free Flight may need brightness tuning later, and the architecture proved correct in fix-4 (just blocked by fog in fix-5). Keeping the API saves a future round-trip.

**Files added:**
- `public/skybox/deep_space_universe.png` (1774×887, ~2.6 MB)
- `docs/skills/sprint-afs-6g-skybox-fix-7.md` (cluster-closer SKILL)

**Files modified:**
- `public/skybox/README.md` (+attribution block for custom asset)
- `components/game/battle/BattleScene.tsx` (texture path + brightness prop removal, 2 lines)
- `tests/afs-6g-skybox-fix.test.ts` (-2 obsolete brightness assertions, +4 fix-7 path assertions)
- `tests/afs-6g-battle-camera.test.ts` (1 assertion updated to new texture path + comment)

**Lesson:**
Asset quality matters more than pipeline tuning. After 6 fixes against the wrong texture, the right texture closed the bug in one swap. Worth remembering for future visual regressions: validate the asset against the visual target before debugging the renderer.

**Live verification command for Jix (paste in DevTools console on `/game/battle` Tier 1, hard-refresh + 5s wait):**

```js
new Promise((resolve) => {
  requestAnimationFrame(() => {
    const canvas = document.querySelectorAll('canvas')[1];
    const off = document.createElement('canvas');
    off.width = canvas.width; off.height = canvas.height;
    const ctx = off.getContext('2d');
    ctx.drawImage(canvas, 0, 0);
    const points = [
      [639, 80], [250, 100], [1028, 100], [200, 270], [1078, 270],
      [350, 450], [928, 450], [639, 500], [639, 600]
    ];
    let sums = []; let tints = {purple:0, blue:0, red:0, neutral:0};
    for (const [x,y] of points) {
      const d = ctx.getImageData(x, y, 1, 1).data;
      const sum = d[0]+d[1]+d[2];
      sums.push(sum);
      let tint = 'neutral';
      if (d[2] > d[0]+5 && d[2] > d[1]+5) tint = d[0] > d[1]+3 ? 'purple' : 'blue';
      else if (d[0] > d[1]+5 && d[0] > d[2]+5) tint = 'red';
      tints[tint]++;
    }
    resolve({avgSum: (sums.reduce((a,b)=>a+b,0)/sums.length).toFixed(1), maxSum: Math.max(...sums), over50: sums.filter(s=>s>50).length, over100: sums.filter(s=>s>100).length, tints});
  });
})
```

**Expected after fix-7:** `avgSum > 60`, `over50 > 5`, multiple non-neutral tints (purple/blue/red — not all neutral). If significantly lower, texture path may be wrong or asset failed to load.

**Known items out-of-scope (unchanged):**
- AFS-6h Battle Scene v3 camera reframing — pre-flight done, awaiting Option A/B decision; scene now renders properly so live evaluation against `docs/design/battle_scene_v3_reference.png` becomes meaningful
- BUG-04 Free Flight memory leak still blocks live verify on `/freeflight`. Free Flight uses unchanged `deep_space_01.png` so no impact

**Rollback (reverts ONLY texture swap, keeps fixes 1-6):**
```bash
git reset --hard backup/pre-afs-6g-skybox-fix-7-20260426
git push origin main --force-with-lease
git push origin :refs/tags/afs-6g-skybox-fix-7-complete
git tag -d afs-6g-skybox-fix-7-complete
```
The new `public/skybox/deep_space_universe.png` will be removed from tracking but may persist in working tree — verify with `git status` and delete manually if needed.

---

### Session 2026-04-26 — Bugfix afs-6g-skybox-fix-6 COMPLETE (Brightness tuning 2.5 → 4.0)

**Status:** ✅ SHIPPED to `origin/main`, tag `afs-6g-skybox-fix-6-complete` pushed, build clean, 1160/1160 tests green. Live visual verify pending Jix browser check.
**Tag:** `afs-6g-skybox-fix-6-complete`
**Backup:** `backup/pre-afs-6g-skybox-fix-6-20260426` → `c73bca6`
**Tests:** 1160/1160 green (was 1159, +1 brightness ≥ 4.0 lower-bound guard)
**Final HEAD:** `9cd590d`

**Why a sixth fix:**
fix-5 (`fog={false}`) WAS the architectural root cause — pixel sampling after fix-5 confirmed the skybox color finally reaches the framebuffer:
- avgSum 16.4 (fallback) → 28.7 (skybox visible)
- maxSum 18 → 39
- Channel imbalance starting to emerge (= nebula tint detectable but dim)

But avgSum 28.7 is still below the perceptual sum-50 floor and `over50` was 0/9 samples — visually the skybox reads as "very dark blue/purple wash" rather than "nebula clouds." The pipeline is correct end-to-end now; only the empirical multiplier needs to land at the right value for `hazy_nebulae_1.png`'s native low luminance.

**Fix shipped (single value):**
- `components/game/battle/BattleScene.tsx:41`: `brightness={4.0}` (was `2.5`)

That's it. All other dials stay locked from previous fixes:
- `gl.alpha=false` (fix-1)
- Vignette darkness 0.55 (fix-2)
- Imperative ref-based `setRGB(brightness, brightness, brightness)` (fix-4)
- Skybox material `fog={false}` (fix-5)
- Free Flight `brightness=1.0` default (unchanged — Free Flight reads correctly without boost)

**Sprint deviations from convention (documented):**
1. **Sixth fix in same bug-cluster** — empirical tuning step after architectural fix landed. Granular separation lets future tuning regress this single line without touching architecture.
2. **No SKILL.md** (sixth time in this cluster).
3. **Test guard** — added `brightness >= 4.0` floor as regression guard. Original `brightness > 1` lower-bound retained; both must pass.

**Files modified:**
- `components/game/battle/BattleScene.tsx` (1 char change effectively: `2.5` → `4.0`)
- `tests/afs-6g-skybox-fix.test.ts` (+1 lower-bound assertion + comment block on empirical tuning history)

**Live verification command — same 41-sample script as fix-4/5.**

**Decision matrix:**
| Pixel sample result | Action |
|---|---|
| avgSum > 50 + channel imbalance visible | ✅ skybox bug-cluster CLOSED → AFS-6h camera reframing can begin |
| avgSum 40-50, dim but tinted | Bump to 6.0 in fix-7 (one-line) |
| Looks washed out / too white | Sink to 3.0 in fix-7 |
| Still below sum 30 | Math is not the problem — texture is fundamentally too dim. Plan B: swap to brighter spacespheremaps texture (e.g., `nebulae_2.png`) or generate custom |

**Known items out-of-scope (unchanged):**
- AFS-6h camera reframing — pre-flight done, awaiting Option A/B decision
- BUG-04 Free Flight memory leak still blocks live verify on `/freeflight`. Free Flight uses brightness=1.0 default (unchanged) — fix-6 has no effect there

**Rollback (reverts ONLY brightness 4.0 → 2.5):**
```bash
git reset --hard backup/pre-afs-6g-skybox-fix-6-20260426
git push origin main --force-with-lease
git push origin :refs/tags/afs-6g-skybox-fix-6-complete
git tag -d afs-6g-skybox-fix-6-complete
```

---

### Session 2026-04-26 — Bugfix afs-6g-skybox-fix-5 COMPLETE (Scene fog masking skybox)

**Status:** ✅ SHIPPED to `origin/main`, tag `afs-6g-skybox-fix-5-complete` pushed, build clean, 1159/1159 tests green. Live visual verify pending Jix browser check.
**Tag:** `afs-6g-skybox-fix-5-complete`
**Backup:** `backup/pre-afs-6g-skybox-fix-5-20260426` → `c7dabf9`
**Tests:** 1159/1159 green (was 1158, +1 fog={false} regression guard)
**Final HEAD:** `3a18aa6`

**Why a fifth fix on the same skybox — and why it's the actual root cause:**
After fix-4 (imperative ref-based color setter) ALSO produced zero visual change, pixel sampling showed:
- avgSum 16.4 (identical to fix-3, identical to fix-2 baseline)
- range 5 across 41 samples
- ALL pixels matched scene.background `#04030b` modulo vignette

This ruled out the entire investigation chain so far: alpha buffer, vignette aggression, brightness prop value, color-prop reconciliation, ref-based mutation — none of those were the dominant issue. The fog hypothesis emerged from the math: pixel range floor 12 matches `#04030b` × vignette 0.55 ≈ 8 (corners) to 18 (center). NO nebula colors were ever reaching the framebuffer.

**Root cause:**
`BattleScene.tsx:34`: `<fog attach="fog" args={['#04030b', 40, 160]} />` was added in AFS-6g for atmospheric depth on near-mid range ships. THREE's `meshBasicMaterial.fog` defaults to `true`. The skybox sphere (radius 1500) sits at distance ~1484 from the camera (z=16). With fog far=160, distance >> far means `fogFactor = 0` → `finalColor = mix(fogColor, materialColor, 0) = fogColor`. The skybox texture × brightness × everything else was being 100% replaced by fog color (= scene.background) before reaching the framebuffer.

In other words: AFS-6g introduced fog and skybox in the same commit. The skybox has been visually broken since AFS-6g shipped — what users saw was always scene.background painted before meshes, plus skybox sphere fragments overwritten with the same color by fog. The earlier "23.7% skybox activity" reported in fix-2 was vignette modulation of fog-replaced skybox pixels, not actual nebula color.

**Fix shipped (single prop):**
- `components/three/SpaceSkybox.tsx`: added `fog={false}` to `<meshBasicMaterial>`. Skybox material now opts out of scene fog. Other meshes (ships, asteroids, ability effects) keep fog applied unchanged.

**Sprint deviations from convention (documented):**
1. **Fifth fix in same bug-cluster** — investigation sequence taught us five distinct things about R3F + post-processing + scene config interactions. Granular commits keep the diagnostic narrative intact for future cluster regressions.
2. **No SKILL.md** (fifth time in this cluster). Commit message + this CLAUDE.md entry are the documentation trail.
3. **Diagnostic-first methodology validated** — each fix shipped only after the previous one's failure was empirically verified via pixel sampling. Without that data, fix-5 would have been guessed at fix-2.

**Files modified:**
- `components/three/SpaceSkybox.tsx` (+1 line: `fog={false}` on meshBasicMaterial)
- `tests/afs-6g-skybox-fix.test.ts` (+1 assertion + comment block explaining root cause for future cluster regressions)

**Live verification command for Jix (paste in DevTools console on `/game/battle` Tier 1, hard-refresh + 5s wait):**
Same 41-sample script as fix-4. Expected after fix-5:
- `range > 50` (vs fix-4 range 5)
- `over50 > 5` of 41 samples
- Channel imbalance — purple `b > r > g` if camera angled toward purple nebula region, red `r > g > b` toward red region, etc.
- avgSum ~80-150 (vs fix-4 avg 16.4)

**If those numbers land:** skybox bug-cluster CLOSED. brightness=2.5 + alpha=false + vignette=0.55 + ref-color + fog=false work in concert. Proceed to AFS-6h camera reframing.

**If still uniform:** texture itself is too dim natively (hazy_nebulae_1 is the dimmest of the spacespheremaps catalog). Next move would be either (a) bump brightness to 4.0+ in BattleScene, or (b) swap to a brighter texture from spacespheremaps (e.g., `nebulae_2.png`). Architecture is now correct; only tuning remains.

**Known items out-of-scope (unchanged):**
- AFS-6h camera reframing — pre-flight done, awaiting Option A/B decision
- BUG-04 Free Flight memory leak still blocks live verify on `/freeflight`. Note: Free Flight uses the same SpaceSkybox component, so fog={false} also lands there. Free Flight has `<fog>` only via NebulaZones (per-zone), so this fix is harmless if no nebula zone is active and correct if one is

**Rollback (reverts ONLY fog disable, keeps everything else):**
```bash
git reset --hard backup/pre-afs-6g-skybox-fix-5-20260426
git push origin main --force-with-lease
git push origin :refs/tags/afs-6g-skybox-fix-5-complete
git tag -d afs-6g-skybox-fix-5-complete
```

---

### Session 2026-04-26 — Bugfix afs-6g-skybox-fix-4 COMPLETE (Imperative color setter)

**Status:** ✅ SHIPPED to `origin/main`, tag `afs-6g-skybox-fix-4-complete` pushed, build clean, 1158/1158 tests green. Live visual verify pending Jix browser check.
**Tag:** `afs-6g-skybox-fix-4-complete`
**Backup:** `backup/pre-afs-6g-skybox-fix-4-20260426` → `ecb0703`
**Tests:** 1158/1158 green (was 1157, +1 net — 2 added asserting ref+setRGB pattern, 1 removed asserting old prop pattern)
**Final HEAD:** `26cbde1`

**Why a fourth fix on the same skybox:**
Empirical pixel sampling after fix-3 deployed showed brightness=2.5 had ZERO visual effect:
- Average sum 16.4 across 41 horizontal samples (var. range 6, all in 12-18)
- Pre-fix-3 baseline (fix-2): 23.7% of canvas in sum 8-12 = active skybox zone
- Post-fix-3: skybox-active zone GONE — entire row reads as fallback `#04030b` (sum 18) modulated by vignette

Verification ruled out three alternative theories:
- Source code correct (color={colorMul}, brightness={2.5}, radius=1500) ✓
- Camera at z=16 inside sphere of radius 1500 (BackSide rendrers correctly) ✓
- Vercel deploy confirmed: commit ecb0703 → deploy `dpl_3mKp7oWJoJTfzMjamgpSYmVHF1dJ` → success ✓

Conclusion: R3F's prop reconciliation for `color={ColorInstance}` with `r/g/b > 1` silently clamped or no-op'd the update on production. The implementation pattern itself was the bug, not the values.

**Fix shipped:**
- `components/three/SpaceSkybox.tsx`:
  - Removed `Color` import; added `MeshBasicMaterial` type + `useEffect` from react
  - Removed `colorMul` `useMemo` and `color={colorMul}` prop
  - Added `matRef = useRef<MeshBasicMaterial>(null)` on the material
  - Added `useEffect([brightness])` that calls `matRef.current.color.setRGB(brightness, brightness, brightness)` — direct mutation of `THREE.Color`'s raw r/g/b properties bypasses R3F prop reconciliation entirely
- `components/game/battle/BattleScene.tsx`: NOT touched (still passes `brightness={2.5}`)

**Sprint deviations from convention (documented):**
1. **Fourth fix in same bug-cluster** — diagnostic-driven sequence: alpha buffer (fix-1) → vignette crush (fix-2) → brightness prop (fix-3) → imperative ref (fix-4). Each step revealed the next via empirical pixel sampling. Granular commits keep rollback surgical.
2. **No SKILL.md committed** (fourth time in this cluster). Commit message + this CLAUDE.md entry are the documentation trail.
3. **Test pattern swap** — replaced fix-3's `color={colorMul}` and `new Color(brightness, ...)` matchers with fix-4's `matRef.current.color.setRGB(brightness, ...)` and `<meshBasicMaterial ref={matRef}` matchers. Net +1 test.
4. **Why ref over prop:** `meshBasicMaterial.color` is a `THREE.Color` instance with raw float `r/g/b` properties. Setting them directly via `setRGB(2.5, 2.5, 2.5)` stores values 1:1; the only clamping happens later at sRGB framebuffer encoding (which is the desired behavior — values > 1 clamp visually to white at the bright end). R3F's prop path may apply Color via `.set(value)` which internally branches on the value type and was apparently dropping our values somewhere.

**Files modified:**
- `components/three/SpaceSkybox.tsx` (- `Color` import, + `useEffect` import, + `MeshBasicMaterial` type import, - `colorMul` memo, - `color={colorMul}` prop, + `matRef` useRef, + `useEffect` for setRGB, + `ref={matRef}` on material)
- `tests/afs-6g-skybox-fix.test.ts` (- 1 prop matcher, + 2 ref/setRGB matchers + regression guard)

**Live verification command for Jix (paste in DevTools console on `/game/battle` Tier 1, hard-refresh + 5s wait):**
```js
(() => {
  const canvas = document.querySelectorAll('canvas')[1];
  // 41 samples along Y=200 (background area, above ship)
  const samples = [];
  return new Promise(resolve => {
    requestAnimationFrame(() => {
      const off = document.createElement('canvas');
      off.width = canvas.width; off.height = canvas.height;
      off.getContext('2d').drawImage(canvas, 0, 0);
      const ctx = off.getContext('2d');
      const y = 200;
      const step = Math.floor(canvas.width / 41);
      for (let i = 0; i < 41; i++) {
        const x = i * step;
        const [r, g, b] = ctx.getImageData(x, y, 1, 1).data;
        samples.push({ x, rgb: `(${r},${g},${b})`, sum: r+g+b });
      }
      const sums = samples.map(s => s.sum);
      resolve({
        avg: (sums.reduce((a,b)=>a+b,0)/sums.length).toFixed(1),
        min: Math.min(...sums),
        max: Math.max(...sums),
        range: Math.max(...sums) - Math.min(...sums),
        over50: sums.filter(s => s > 50).length,
        over100: sums.filter(s => s > 100).length,
        peakSamples: samples.filter(s => s.sum > 50).slice(0, 5)
      });
    });
  });
})()
```

**Expected after fix-4 if implementation was the bug:**
- `range > 30` (vs fix-3's 6)
- `over50 > 0` (vs fix-3's 0)
- Some samples showing nebula tint (channel imbalance: purple b>r>g, red r>g, blue b>g)

**If still range < 10 and 0 over 50:** the texture's native dim values × 2.5 are insufficient. Fix-5 bumps brightness to 4.0 or 5.0 (one-line change in `BattleScene.tsx:41`). The architecture (ref-based) stays.

**If range > 30 and over50 > 0:** R3F prop was the bug, math holds, skybox bug-cluster CLOSED. Proceed to AFS-6h.

**Known items out-of-scope (unchanged):**
- AFS-6h camera reframing — pre-flight done, awaiting Option A/B decision
- BUG-04 Free Flight memory leak still blocks live verify on `/freeflight`

**Rollback (reverts ONLY ref pattern, keeps brightness=2.5 prop wiring + vignette + alpha):**
```bash
git reset --hard backup/pre-afs-6g-skybox-fix-4-20260426
git push origin main --force-with-lease
git push origin :refs/tags/afs-6g-skybox-fix-4-complete
git tag -d afs-6g-skybox-fix-4-complete
```

---

### Session 2026-04-26 — Bugfix afs-6g-skybox-fix-3 COMPLETE (SpaceSkybox brightness prop)

**Status:** ✅ SHIPPED to `origin/main`, tag `afs-6g-skybox-fix-3-complete` pushed, build clean, 1157/1157 tests green. Live visual verify pending Jix browser check.
**Tag:** `afs-6g-skybox-fix-3-complete`
**Backup:** `backup/pre-afs-6g-skybox-fix-3-20260426` → `abf9ff7`
**Tests:** 1157/1157 green (was 1152, +5 brightness assertions appended to `tests/afs-6g-skybox-fix.test.ts`)
**Final HEAD:** `8d8021a`

**Why a third fix on the same skybox:**
- `fix-1` opened the canvas (`gl.alpha=false`) — necessary, not sufficient
- `fix-2` lowered Vignette (0.78 → 0.55) — cosmetic edge correction, not the dim-midtones cause
- `fix-3` raises the texture's effective brightness — addresses the actual root cause (hazy_nebulae_1 native midtones too dim for Battle's lighting + Bloom config)

Each step revealed the next layer of the bug via empirical pixel sampling. Three commits keep the rollback granularity clean: if brightness 2.5 reads "too washed out" we can revert ONLY fix-3 without losing the alpha + vignette work.

**Root cause (per pixel sampling on prod after fix-2):**
- 23.7% of canvas had skybox activity (not fallback) — proves SpaceSkybox WAS rendering
- All those pixels in `sum=8-12` range — DARKER than scene.background fallback `rgb(4,3,11)` `sum=18`
- `hazy_nebulae_1.png` native midtones are intentionally subtle ("hazy")
- Free Flight reads correctly because of brighter directional light + Bloom `intensity=1.2`
- Battle has subdued lighting + Bloom `intensity=0.85` + `luminanceThreshold=0.25` → skips dim midtones entirely
- Result: skybox geometry rendered, but visually below the fallback color, indistinguishable from "missing skybox"

**Fix shipped:**
- `components/three/SpaceSkybox.tsx`: added optional `brightness?: number` prop (default 1.0). Memoized `THREE.Color(b, b, b)` passed to `<meshBasicMaterial color={...}>`. With existing `toneMapped={false}` from AFS-6g, the multiplier > 1 takes effect — nebula colors brighten linearly until clamped at framebuffer write (≤ white).
- `components/game/battle/BattleScene.tsx`: `<SpaceSkybox ... brightness={2.5} />`. 2.5× chosen as starting point — pixel sampling math suggested 2-3× minimum to clear the fallback floor; 2.5 leaves headroom for live tuning up or down.
- `components/freeflight/FreeFlightScene.tsx`: NOT touched. Default `brightness=1` preserves Free Flight visuals (already reads correctly).

**Sprint deviations from convention (documented):**
1. **No SKILL.md committed** (third time same pattern) — 3-line architectural change on documented hypothesis. Commit message + this CLAUDE.md entry are the trail.
2. **Test consolidation** — appended fix-3 describe block to existing `tests/afs-6g-skybox-fix.test.ts` rather than creating fix-3 file. Same skybox bug-cluster.
3. **`color={colorMul}` instead of `color={[b,b,b]}` shorthand** — explicit `THREE.Color` instance is memoized via `useMemo` so we don't allocate a new color each render frame. R3F would otherwise reconstruct the array prop every render.
4. **Free Flight asymmetry intentional** — same skybox texture, different scenes render it differently. Per-scene brightness is the correct architectural answer. Documented in code comment.

**Files modified:**
- `components/three/SpaceSkybox.tsx` (+ `Color` import, + `brightness` prop interface, + `colorMul` memo, + `color={colorMul}` on material — 6 logical lines added, 1 modified)
- `components/game/battle/BattleScene.tsx` (1 line: `brightness={2.5}` added to SpaceSkybox usage)
- `tests/afs-6g-skybox-fix.test.ts` (added battleSceneSrc + freeFlightSceneSrc reads at top, + 5 assertions in new describe block)

**Live verification command for Jix (paste in DevTools console on `/game/battle` Tier 1, hard-refresh + 5s wait):**
```js
(() => {
  const canvas = document.querySelectorAll('canvas')[1];
  const points = [
    [0.5, 0.5], [0.5, 0.35], [0.35, 0.5], [0.65, 0.5], [0.5, 0.65],
    [0.25, 0.25], [0.75, 0.25], [0.25, 0.75], [0.75, 0.75]  // closer to corners
  ];
  return new Promise(resolve => {
    requestAnimationFrame(() => {
      const off = document.createElement('canvas');
      off.width = canvas.width; off.height = canvas.height;
      off.getContext('2d').drawImage(canvas, 0, 0);
      const ctx = off.getContext('2d');
      resolve(points.map(([nx, ny]) => {
        const x = Math.floor(nx * canvas.width);
        const y = Math.floor(ny * canvas.height);
        const [r, g, b] = ctx.getImageData(x, y, 1, 1).data;
        return { pos: `${(nx*100)|0}%,${(ny*100)|0}%`, rgb: `(${r},${g},${b})`, sum: r+g+b };
      }));
    });
  });
})()
```
**Expected after fix-3:** non-edge `sum > 50`, ideally with channel imbalance showing nebula tint (purple `b > r > g`, red `r > g`, blue `b > g`). Fix-2 baseline was `sum=8-12`. Fix-3 target is 2.5× that minimum = `sum > 20-30` with nebula-shaped color distribution.

**Next decision points:**
- If `sum < 50` everywhere → tune brightness up to 3.5 in fix-4 (one-line change)
- If looks washed out / too white → tune down to 2.0
- If reads correctly → close skybox bug-cluster, proceed to AFS-6h Battle Scene v3 camera reframing

**Known items out-of-scope (unchanged):**
- AFS-6h camera reframing — pre-flight done, awaiting Option A/B decision
- BUG-04 Free Flight memory leak still blocks live verify on `/freeflight` (source-level test only)

**Rollback (reverts ONLY brightness, keeps alpha + vignette fixes):**
```bash
git reset --hard backup/pre-afs-6g-skybox-fix-3-20260426
git push origin main --force-with-lease
git push origin :refs/tags/afs-6g-skybox-fix-3-complete
git tag -d afs-6g-skybox-fix-3-complete
```

---

### Session 2026-04-26 — Bugfix afs-6g-skybox-fix-2 COMPLETE (Vignette midtone crush)

**Status:** ✅ SHIPPED to `origin/main`, tag `afs-6g-skybox-fix-2-complete` pushed, build clean, 1152/1152 tests green. Live visual verify pending Jix browser check.
**Tag:** `afs-6g-skybox-fix-2-complete`
**Backup:** `backup/pre-afs-6g-skybox-fix-2-20260426` → `6afcf22`
**Tests:** 1152/1152 green (was 1150, +2 vignette assertions appended to existing `tests/afs-6g-skybox-fix.test.ts` since same bug-cluster)
**Final HEAD:** `191eede`

**Why a separate sprint and not amend:**
`afs-6g-skybox-fix` (`21c5db7`) was already pushed + tagged + referenced in this CLAUDE.md sprint history. Amending would have forced a destructive rewrite of published main. New commit gives clean granular rollback if the vignette change reads worse than 0.78 looked.

**Root cause (per pixel sampling on prod after fix-1 landed):**
Alpha buffer fix correctly opened the canvas, but pixel sampling showed:
- Corner pixels: `(1, 0, 2)` — Vignette `darkness=0.78` × fallback `#04030b` = exactly what we got
- Center pixels: `(3, 3, 9)` — barely above scene.background fallback `rgb(4, 3, 11)`, no nebula saturation
- `performance.getEntriesByType` confirmed `deep_space_01.png` decoded in 115ms (cached), status 200, GPU upload complete

So the skybox WAS rendering — but Vignette darkness 0.78 was multiplying the dim `hazy_nebulae_1` nebula midtones below the visible threshold. Combined with `Bloom luminanceThreshold=0.25` filtering most of the nebula out of the bright pass, the post-FX chain crushed the texture back to fallback-color flat black.

**Fix shipped (single line):**
- `components/game/battle/BattleCanvas.tsx:54`: `<Vignette eskil={false} offset={0.22} darkness={0.55} />` (was `0.78`)

`0.55` matches `FreeFlightCanvas.tsx:55` — Free Flight was already at this darkness and the nebula reads correctly there. Battle was the outlier.

**Sprint deviations from convention (documented):**
1. **No SKILL.md committed.** Single-line cosmetic tuning on a hypothesis already documented via `afs-6g-skybox-fix` SKILL + diagnostic log. SKILL overhead not warranted; commit message + this CLAUDE.md entry are the documentation trail.
2. **Test placement** — appended 2 assertions to existing `tests/afs-6g-skybox-fix.test.ts` rather than creating fix-2 file. Same bug-cluster (canvas-alpha + post-FX visibility) reads better as one consolidated test surface than scattered files.
3. **Tag naming** — `afs-6g-skybox-fix-2-complete` not `afs-6g-skybox-fix-fix-complete` to keep the increment-counter convention readable.

**Files modified:**
- `components/game/battle/BattleCanvas.tsx` (1 line: vignette darkness 0.78 → 0.55)
- `tests/afs-6g-skybox-fix.test.ts` (appended new describe block with 2 assertions: vignette ≤ 0.6 + battle/freeflight parity)

**Live verification command for Jix (paste into DevTools console on `/game/battle` Tier 1, AFTER hard-refresh + 5s wait for skybox decode):**
```js
(() => {
  const canvas = document.querySelectorAll('canvas')[1];
  // Sample center + 4 inner-ring (avoid extreme vignette zone)
  const points = [
    [0.5, 0.5],   // dead center
    [0.5, 0.35],  // above ship
    [0.35, 0.5],  // left of ship
    [0.65, 0.5],  // right of ship
    [0.5, 0.65],  // below ship
  ];
  return new Promise(resolve => {
    requestAnimationFrame(() => {
      const off = document.createElement('canvas');
      off.width = canvas.width; off.height = canvas.height;
      off.getContext('2d').drawImage(canvas, 0, 0);
      const ctx = off.getContext('2d');
      resolve(points.map(([nx, ny]) => {
        const x = Math.floor(nx * canvas.width);
        const y = Math.floor(ny * canvas.height);
        const [r, g, b, a] = ctx.getImageData(x, y, 1, 1).data;
        return { pos: `${(nx*100)|0}%,${(ny*100)|0}%`, rgb: `(${r},${g},${b})`, sum: r+g+b };
      }));
    });
  });
})()
```
**Expected after fix:** non-edge samples should show `sum > 100` with at least one channel showing nebula tint (purple `b > r`, red `r > g`, blue `b > g`). Pre-fix baseline was `sum < 15` everywhere.

**Known items out-of-scope (unchanged):**
- AFS-6h Battle Scene v3 visual layer — pre-flight done, awaiting Option A/B decision; can now actually be live-evaluated against the reference image since the scene renders properly
- Free Flight live verify still blocked by BUG-04 memory leak

**Rollback:**
```bash
git reset --hard backup/pre-afs-6g-skybox-fix-2-20260426
git push origin main --force-with-lease
git push origin :refs/tags/afs-6g-skybox-fix-2-complete
git tag -d afs-6g-skybox-fix-2-complete
```

Reverts ONLY the vignette change. `afs-6g-skybox-fix` (alpha buffer) stays in place.

---

### Session 2026-04-26 — Bugfix afs-6g-skybox-fix COMPLETE (Canvas alpha buffer)

**Status:** ✅ SHIPPED to `origin/main`, tag `afs-6g-skybox-fix-complete` pushed, build clean, 1150/1150 tests green. Live visual verify pending Jix browser check.
**Tag:** `afs-6g-skybox-fix-complete`
**Backup:** `backup/pre-afs-6g-skybox-fix-20260426` → `7f09077`
**Tests:** 1150/1150 green (was 1141, +9 new skybox-fix assertions — target was 6-8)
**Final HEAD:** `21c5db7`

**Commit chain (1 SKILL + 1 fix):**
```
21c5db7 fix(afs-6g): canvas alpha buffer drops skybox to transparent
0b01dd2 chore(afs-6g-fix): add skybox-fix SKILL documentation
```

**Root cause (per live diagnostic Apr 26):**
Production `/game/battle` showed `avgAlpha 0.5/255` and `coloredPercent 5.4%` across 425 sample points. SpaceSkybox renders correct nebula colors but the canvas reads as near-fully transparent — body `rgb(7,7,13)` shines through making the scene look like solid black. SKILL identified two compounding issues; pre-flight only confirmed one.

**Fix shipped:**
- `components/game/battle/BattleCanvas.tsx`: added `alpha: false` to `gl` prop. Forces opaque framebuffer; WebGL clears to opaque each frame so post-processing chain (Bloom + ChromaticAberration + Vignette) can no longer drop the alpha contribution from `<color attach="background" args={['#04030b']} />` on `BattleScene.tsx:33`.
- `components/freeflight/FreeFlightCanvas.tsx`: same `alpha: false` for parity. FF was already masked by inline `style.background='#02030a'` on the canvas element so the visual change there is nil — but the underlying alpha-buffer behavior now matches battle.
- `tests/afs-6g-skybox-fix.test.ts` — 9 source-level invariants across three describe blocks: alpha buffer config, wrapper opacity regression guard, SpaceSkybox component intact.

**Sprint deviation from SKILL (documented):**
1. **Task 4 — `opacity: 0.8` removal — NO-OP.** Pre-flight Task 0.1 ran exhaustive grep across `**/*.{tsx,ts,jsx,js,css}` for `opacity: 0.8`, `opacity:0.8`, `opacity-80`, `opacity.*\.8`, `opacity.*0?\.80`. Returned 40+ hits — none on the battle canvas, its wrapper stack (`S.wrap`/`S.canvasLayer` in `BattleController.tsx:225-226`), or any global `canvas { ... }` rule in `app/globals.css`. The Chrome diagnostic that reported `canvas opacity (computed): 0.8` was likely misattributed (hover state, wrong sample target, or computed-style fortolkningsfejl). Replaced Task 4 with regression-guard tests in Task 5 that fail if opacity is ever introduced on the wrapper styles.
2. **Test overshoot** — 9 assertions vs SKILL target of 6-8.
3. **Live verify** — automation bridge (Playwright extension) not connected this session, so the diagnostic re-run from Task 7 must be performed by Jix in Chrome. Source-level proof of fix is in place; visual proof pending.

**Files added:**
- `tests/afs-6g-skybox-fix.test.ts` (9 assertions across 3 describe blocks)

**Files modified:**
- `components/game/battle/BattleCanvas.tsx` (added `alpha: false` to `gl` prop + 4-line comment block explaining the alpha-buffer rationale)
- `components/freeflight/FreeFlightCanvas.tsx` (added `alpha: false` to `gl` prop)

**Live verification command for Jix (paste into DevTools console on `/game/battle` Tier 1):**
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
**Expected after fix:** `coloredPercent` > 60%, `avgAlpha` > 200. Pre-fix baseline was 5.4% / 0.5.

**Known items out-of-scope (unchanged):**
- AFS-6h Battle Scene v3 visual layer (camera reframing per `docs/design/battle_scene_v3_reference.png`) — pre-flight done same session, awaiting Option A/B decision
- BUG-04 Free Flight memory leak still blocks live verify on `/freeflight` — source-level test only
- Any actual CSS opacity rule discovery (none found, treated as misattributed diagnostic)

**Rollback:**
```bash
git reset --hard backup/pre-afs-6g-skybox-fix-20260426
git push origin main --force-with-lease
git push origin :refs/tags/afs-6g-skybox-fix-complete
git tag -d afs-6g-skybox-fix-complete
```

---

### Session 2026-04-25 — Sprint AFS-6g COMPLETE (Battle Scene v2 + Universal Skybox + CSS Hotfix + Security Sweep)

**Status:** ✅ SHIPPED to `origin/main`, tag `sprint-afs-6g-complete` pushed, build clean, 1141/1141 tests green.
**Tag:** `sprint-afs-6g-complete`
**Backup:** `backup/pre-afs-6g-20260425` → `bdc6f3f`
**Tests:** 1141/1141 green (was 1087, +54 new AFS-6g assertions across 4 test files — target was ~15)
**Final HEAD:** see tag

**Commit chain (6 code commits + this docs commit):**
```
27fb644 chore(afs-6g): defer 27 CVEs with exploitability assessment
15ddeba fix(afs-6g): hide footer on /game/battle to free fullscreen viewport
274a981 feat(afs-6g): add SpaceSkybox component and CC-BY 4.0 nebula asset
675fa49 feat(afs-6g): swap battle scene Stars for SpaceSkybox and add WoW-style orbit camera
404c58e feat(afs-6g): swap freeflight Stars for SpaceSkybox
fd3214e docs(afs-6g): document Star Map skybox skip rationale
```

**What shipped:**

**Section A — Security sweep (Tasks 1-2):**
- `docs/security/deferred-cves.md` — full register for 27 CVEs (0 critical, 3 high, 24 moderate). All deferred per Jix decision; no `npm audit fix --force` (would break GHAI balance read by downgrading `@solana/spl-token` to 0.1.8 pre-modern API).
- 3 high are the `bigint-buffer` chain (`@solana/buffer-layout-utils`, `@solana/spl-token`). Exploitability assessment: no user-controlled `Buffer` reaches `toBigIntLE`/`BE` in any of the 3 voidexa call sites (`lib/ghai/balance.ts`, `lib/ghai/verify-deposit.ts`, `components/WalletProvider.tsx`).
- 24 moderate = vitest/vite/esbuild dev-server-only + transitive Solana via uuid/jayson/rpc-websockets. None reachable in production.
- Cross-references existing `docs/SECURITY_DEFERRED.md` (Sprint 13F), keeps it as historical record.
- 5 re-evaluation triggers documented (ADVORA approval, upstream patch, vitest 4 migration, etc.).

**Section B — CSS hotfix (Task 3):**
- `components/layout/ConditionalFooter.tsx` — single-line addition: `pathname.startsWith('/game/battle')` to existing hide-list. No new layout file, no `<main>` height changes. Battle scene was already wrapped in `position: fixed inset: 0` via `BattleController`; the bug was purely the footer rendering below the collapsed `<main>`.
- SKILL Option A (new `app/game/battle/layout.tsx`) and Option B (explicit `<main>` height) both bypassed because they would have introduced new layout abstractions when the existing `ConditionalFooter` hide-list pattern was already the right answer.

**Section C — Universal SpaceSkybox (Tasks 4-5):**
- `public/skybox/deep_space_01.png` — 8192x4096 equirectangular PNG, 7.6 MB. Sourced from spacespheremaps.com (`hazy_nebulae_1.png`). License: CC-BY 4.0 with attribution made optional, redistribution permitted, single restriction is no-AI-training.
- `public/skybox/README.md` — full attribution + license + source URL.
- `components/three/SpaceSkybox.tsx` (53 lines) — pure R3F backdrop component. Uses `useLoader` + `TextureLoader` with sRGB color space, `toneMapped={false}` so post-FX bloom does not blow out the nebula, `rotateWithCamera` implemented via `useFrame` (camera-locked for first-person scenes). Uses JSX primitives (`<sphereGeometry>`, `<meshBasicMaterial>`) for proper R3F disposal lifecycle.
- `tests/afs-6g-skybox.test.ts` — 19 source-level invariants.

**Section D — Battle scene rework (Tasks 6-8):**
- `components/game/battle/BattleScene.tsx`: replaced `<Stars>` (drei particle system, 2500 points) with `<SpaceSkybox texture="/skybox/deep_space_01.png" radius={1500} rotateWithCamera={false} intensity={1}>`, Suspense-wrapped.
- `components/game/battle/BattleCanvas.tsx`: added `<OrbitControls>` with locked envelope per Jix spec — zoom 10-24, azimuth ±20° (Math.PI/9), polar 60-82° (Math.PI/3 to Math.PI/2.2), target [0,0,0], zoomSpeed 0.6, rotateSpeed 0.4, pan disabled.
- `BattleCanvas.tsx`: bumped camera `far` plane 800 → 4000 so the radius-1500 skybox sphere is not frustum-culled. (Proactive deviation flagged at checkpoint, approved by Jix. Inline comment documents the reason.)
- Ship positions, scales, fog, lighting all UNCHANGED — locked by 8 invariant tests in `tests/afs-6g-ship-positions.test.ts`. Camera position [0,0,16], fov 55, dpr [1, 1.75], post-processing (Bloom 0.85, ChromaticAberration, Vignette) all preserved.
- `tests/afs-6g-battle-camera.test.ts` — 19 assertions (skybox swap + OrbitControls config + camera frustum bump).

**Section E — Cross-app skybox rollout (Tasks 9-10):**
- Task 9: `components/freeflight/FreeFlightScene.tsx` — replaced single `<Stars radius={1200} depth={600} count={3500}>` line with `<SpaceSkybox radius={1500} rotateWithCamera={true}>`, Suspense-wrapped. `rotateWithCamera={true}` means the skybox follows the player ship origin in first-person flight (player can never reach the sphere).
- Task 9 live verify deferred per BUG-04 (memory leak) — source-level test only via `tests/afs-6g-freeflight-skybox.test.ts` (8 assertions).
- Task 10: SKIPPED. `components/starmap/README.md` documents the rationale. Star Map's `StarField` + `CSSStarfield` + `NebulaBg` are intentional curated design (stars are navigable game elements, not decoration). Universal skybox does not apply.

**Sprint scope deviations from SKILL (all approved at checkpoints):**
1. **CVE counts wrong in SKILL** — pre-flight revealed 0 critical (SKILL claimed 1) + 3 high + 24 moderate (SKILL claimed 6 + 8). All deferred rather than patched, per Jix decision after seeing exploitability + breakage risk.
2. **CSS fix path** — Skipped SKILL Option A (new layout file) and Option B (explicit `<main>` height). One-line `ConditionalFooter` edit was the existing pattern.
3. **3D asset scope** — Skipped `usc_astroeagle01.glb` and zip mining entirely (license audit deferred to separate sprint). Ships unchanged at `qs_bob.glb` + `qs_executioner.glb` defaults.
4. **Skybox source** — Polyhaven has zero space HDRIs (verified via WebFetch). Pivoted to spacespheremaps.com CC-BY 4.0 PNG. Filename uses `.png` not `.jpg`.
5. **Camera position** — Kept current `[0, 0, 16]`, did NOT move to SKILL's proposed `[0, 1, 10]` per Jix decision.
6. **Camera far plane** — Bumped 800 → 4000 (not in SKILL) so radius-1500 skybox sphere is not frustum-culled. Critical correctness fix.
7. **OrbitControls envelope** — Adopted limited config (option (c) from checkpoint review): ±20° azimuth, narrow polar range, narrow zoom band. SKILL proposed wider envelope which would have allowed orbiting under the CardHand.
8. **Ship positions UNCHANGED** — Did NOT reposition to SKILL's proposed `[0, -2, 5]` / `[0, 0, -8]`. Current `[0, -3.5, 8]` / `[0, 3.5, -14]` already gives more depth (z-distance 22 vs proposed 13).
9. **Free Flight live verify skipped** — BUG-04 prevents safe entry. Source-level grep + test only.
10. **Star Map skip** — Replaced Task 10's "swap or document" with explicit "skip + design doc" given star nodes carry click-to-travel semantics.
11. **Test overshoot** — 54 new assertions vs SKILL target of ~15. Source-level invariants for skybox component, asset bundling, camera config, ship-position regression guards, and freeflight swap.

**Files added:**
- `docs/security/deferred-cves.md` (CVE register)
- `components/three/SpaceSkybox.tsx` (53 lines, R3F backdrop)
- `components/starmap/README.md` (Task 10 design rationale)
- `public/skybox/deep_space_01.png` (7.6 MB, CC-BY 4.0 nebula)
- `public/skybox/README.md` (asset attribution)
- `tests/afs-6g-skybox.test.ts` (19 assertions)
- `tests/afs-6g-battle-camera.test.ts` (19 assertions)
- `tests/afs-6g-ship-positions.test.ts` (8 assertions)
- `tests/afs-6g-freeflight-skybox.test.ts` (8 assertions)

**Files modified:**
- `components/layout/ConditionalFooter.tsx` (+1 line, footer hide-list)
- `components/game/battle/BattleScene.tsx` (skybox swap)
- `components/game/battle/BattleCanvas.tsx` (OrbitControls + far plane bump)
- `components/freeflight/FreeFlightScene.tsx` (skybox swap)

**Known items out-of-scope (unchanged):**
- AFS-6e Pack Shop Alpha rewire (separate sprint, tracked in PENDING SPRINTS)
- AFS-9 Free Flight memory leak (BUG-04, separate sprint)
- AFS-10 Starmap Level 2 repair (separate sprint)
- AFS-18 Alpha engine extension (Heat, 6-subsystem, Pilot select)
- Card combat reactions (skud, shield flash) — separate sprint
- 3D asset license audit for `voidexa-3d-assets/` zips — separate sprint
- Per-scene skybox differentiation (currently same texture battle + freeflight) — P3 polish
- Bloom oversaturation on bright nebula regions — P2 polish, log if observed during live verify
- Hauling, Speedrun, Galaxy, ShipPreviewCanvas, ShopItemPreviewCanvas still use drei `<Stars>` — explicitly out-of-scope, replace if/when needed in future sprint

**Rollback:**
```bash
git reset --hard backup/pre-afs-6g-20260425
git push origin main --force-with-lease
git push origin :refs/tags/sprint-afs-6g-complete
```

---

### Session 2026-04-25 — SLUT 12 — Brain-storm + Live audit + AFS-6g SKILL written

**Status:** 🔴 NO CODE PUSHED. Brain-storm session + live audit + AFS-6g SKILL drafting + secrets migration to D:\krypteret usb. SKILL ready for execution next session.
**HEAD unchanged:** `bdc6f3f` (still AFS-6d)
**Tests unchanged:** 1087/1087

**Session arc:**

**Phase 1 — Brain-storm (deck ownership + trading + economy):**
- Jix raised concern: deck builder shipped in AFS-6d allows building decks from all 1000 alpha cards without ownership. Should be collection-gated like Hearthstone/MTG Arena.
- Decision: ownership check added to AFS-6e scope (cards must be owned via packs to be used in decks). Same cards reusable across multiple decks (assignment, not consumption).
- Universal inventory logic locked: cross-app ownership model (shop, game, trading, all read from same `user_inventory` source). New sprint planned: Universal Inventory Layer.
- Trading Hub vision: peer-to-peer card swap (real trading hub, not just name). New sprint: Trading Hub v1.
- Trade chat integration: `/trade` channel in universal chat with WTB/WTS posts. New sprint: Trade Chat Channel.

**Phase 2 — Trade fee economy (locked):**
- Discussion of GHAI as utility token (V-Bucks model, NOT crypto-GHAI which is parked pending ADVORA/MiCA review).
- Trade fee LOCKED: **5 GHAI flat per trade, paid by initiator alone**.
- Why flat over percentage: simpler UX, no whale-penalty, anti-spam without revenue-driver framing.
- GHAI as trade asset: ✅ allowed (cards + GHAI ↔ cards).
- P2P GHAI gift: ❌ never (regulatory landmine — money laundering risk under MiCA/PSD2).
- P2P item gift from inventory: ❌ never (laundering risk + secondary market problem).
- "Gift a pack" (real money in, item out to friend): ⚪ future feature, safe legally.

**Phase 3 — Live audit `/game/battle`:**
- Verified 2 ships ALREADY render in 3D (player + enemy face-to-face). Original assumption "only 1 ship" was wrong.
- BUT: scene has issues — player ship hidden under cards, camera fixed/static, twinkling stars, footer overlapping battle viewport (`<main>` collapsed to 72px).
- 2 Three.js canvases verified, "ENEMY HULL 60/60" element exists in DOM.
- Scope for fix locked: camera rework (WoW scroll zoom + over-the-shoulder), Universal Skybox component, CSS hotfix.

**Phase 4 — Skills.zip + tree.txt analysis:**
- Jix uploaded skills.zip with 30 historical SKILL files (sprint-0 through AFS-6d).
- Found Phase 4b commit `5d4ad07` shipped basic 3D battle scene with Kestrel boss.
- Found `components/combat/` already has 11 files / 2319 lines (DON'T rebuild).
- Tree.txt analysis of E:\ drive (mobil USB, 110k lines, 13MB) revealed:
  - **GOLDFIND:** `E:\Archives\voidexa-3d-assets\` — 25+ ship asset zips + uncompressed `usc_astroeagle01.glb`
  - Eliminates need for FLUX/Vast.ai rendering pipeline for battle scene v2 enemy ship
  - 8 unique sensitive files migrated from E:\ to D:\krypteret usb (GitHub recovery codes, Wallet.json, Exodus pdf, Binance konto info, wallet transaction CSVs, Kostplan)
  - 9 duplicate sensitive files deleted from E:\ (5x Google Passwords.csv, 1x Proton 2FA, 2x ekstra Binance, 1x ekstra GitHub recovery)

**Phase 5 — AFS-6g SKILL written:**
- Sprint scope: Battle Scene v2 + Universal Skybox + CSS Hotfix + Security Sweep (AFS-24b folded in)
- Single sprint, 5 sections (A-E), 11 tasks, one tag.
- Backup strategy decision: NO 2-SSD purchase needed pt. Jix has D:\krypteret usb + Google Drive + Proton Drive + local PC. AFS-24e SSD rotation deferred. Memory updated.

**No git operations performed this session.**

### Decisions locked SLUT 12

1. Trade fee: 5 GHAI flat, initiator pays alone
2. GHAI rules: trade asset OK, P2P transfer forbidden, item gifting forbidden
3. Universal inventory: cross-app ownership model
4. Trading Hub v1: peer-to-peer card swap (separate sprint)
5. Trade Chat: integrated `/trade` channel (separate sprint)
6. Battle scene v2 scope: camera rework + skybox + CSS fix (AFS-6g)
7. Backup strategy: D:\krypteret usb + cloud is sufficient for now (no SSD purchase)

### New sprints added to roadmap

- **AFS-6g** — Battle Scene v2 + Universal Skybox + CSS Hotfix + Security Sweep — SKILL READY
- **AFS-?? Universal Inventory Layer** — central inventory cross-app
- **AFS-?? Trading Hub v1** — P2P card swap with 5 GHAI fee
- **AFS-?? Trade Chat Channel** — integrate `/trade` with universal chat

### Open items for next session

- [ ] Approve AFS-6g pre-flight findings, then execute Tasks 1-11
- [ ] Decide: cross-set trading (Alpha ↔ V3) or same-set only
- [ ] Decide: soulbound rules (mythics, mission rewards)
- [ ] Verify license status of `voidexa-3d-assets/` packs before commit
- [ ] PvP scope decision (card PvP async vs real-time — partially discussed, not locked)

### Files migrated (E:\ → D:\krypteret usb\fra-e-drev-20260425):

| File | Size | Purpose |
|---|---|---|
| github-recovery-codes.txt | 206 B | GitHub backdoor |
| Wallet.json | 10 B | Samsung BLOCKCHAIN_WALLET (likely empty) |
| Exodus sf.pdf | 217 KB | Exodus wallet info |
| konto-hos-binance.pdf | 466 KB | Binance konto details |
| account-0x4C0db84... csv x2 | 146 B each | Wallet transaction history |
| export-address-token-0xbfec559... csv | 3.6 KB | Token export |
| Kostplan - Jimmi.pdf | 68 KB | Personal health (privacy) |

---

### Session 2026-04-25 — AFS-6a-fix COMPLETE (Post-ship live audit bugfixes)

**Status:** ✅ SHIPPED to `origin/main`, tag `afs-6a-fix-complete` pushed, build clean, all 5 bugs fixed
**Tag:** `afs-6a-fix-complete`
**Backup:** `backup/pre-afs-6a-fix-20260425`
**Tests:** 1014/1014 green (was 994, +20 new AFS-6a-fix assertions — target was +5)
**Final HEAD:** `6144e08`

**Commit chain:**
```
6144e08 test(afs-6a-fix): nav + back-link + coming-soon invariants
cc5c2e3 test(afs-6a-fix): update nav-dropdown test for 9-item Universe
c095fc8 fix(afs-6a-fix): pack shop Coming Soon lockdown until Alpha 1000 ships
4c46411 fix(afs-6a-fix): pack shop copy 257-card -> Alpha library
afde42e fix(afs-6a-fix): cross-nav links from /shop to cosmetics + packs
84ae49f fix(afs-6a-fix): back-link on /shop/cosmetics points to /shop not /
47eb0cc fix(afs-6a-fix): add Inventory as 9th Universe nav item
f817347 docs(afs-6a-fix): bugfix SKILL for post-ship live audit
```

**5 bugs fixed:**

**Bug 1 — Universe dropdown missing Inventory.** Pre-flight revealed the other 8 items (Shop, Cards, etc.) were already wired in `components/layout/Navigation.tsx:70-77` (SKILL's premise that Shop/Cards were missing was wrong — live audit miss likely due to mid-rollout Vercel deploy). Real gap: only `/inventory` was unwired. Appended as 9th item at line 78. Added EN "Inventory" + DK "Beholdning" i18n keys.

**Bug 2 — Back-link on /shop/cosmetics.** `ShopCosmeticsClient.tsx:20` had `<Link href="/">← voidexa</Link>` leftover from orphan state. Changed to `<Link href="/shop">← Shop</Link>`.

**Bug 3 — No cross-nav between /shop and /shop/cosmetics.** Extracted `components/shop/ShopCrossNav.tsx` (42 lines) with pill links — cyan to `/shop/cosmetics`, gold to `/shop/packs`. Rendered in ShopPage hero. ShopPage stayed inside 1050-line budget (1040 → 1042).

**Bug 4 — "257-CARD LIBRARY" copy.** Per Jix: neutral "ALPHA LIBRARY" without count (avoids overstating since `library.test.ts` still asserts 257). `PackShopClient.tsx:76` → "BOOSTER PACKS · ALPHA LIBRARY". `app/shop/packs/page.tsx` metadata "257 cards" removed. Code/test references deliberately untouched — still reflect actual loader state.

**Bug 5 — Pack BUY lockdown.** All 3 tiers now render unconditionally disabled "Coming Soon" button. Italic lockdown note under YOUR BALANCE: "Coming soon — Alpha library launches when art is ready." Dead client state (`openPack`, `opening/result/err`, `PackOpeningAnimation`, `canAfford`) removed with pointer comment to predecessor commit for future restoration. `/api/shop/open-pack` endpoint untouched — infrastructure stays ready for when AFS-5 + AFS-18 complete. Matches Apr 24 powerplan decision: eliminate V3-card-id retirement risk + DK 2-year reklamationsret refund risk.

**Sprint deviations from SKILL:**
1. DK copy for Bug 4 deferred — no `/dk/shop/packs` route exists; DK pack surface is AFS-26 scope.
2. Test overshoot — 20 new assertions vs SKILL target of 5 (source-level invariants for all 5 bugs + API route existence tripwire).
3. Extra sweep-up commit `cc5c2e3` — pre-existing Sprint 13e test asserted "Break Room is LAST" in Universe; flipped to assert Inventory last / Break Room second-to-last.
4. Bug 3 refactor — extracted `ShopCrossNav` rather than inlining to respect 1050-line trigger.

**Files added:**
- `docs/skills/bugfix-afs-6a-fix.md`
- `components/shop/ShopCrossNav.tsx` (42 lines)

**Files modified:**
- `components/layout/Navigation.tsx` (+Inventory entry)
- `components/shop/ShopCosmeticsClient.tsx` (back-link href)
- `components/shop/ShopPage.tsx` (cross-nav rendering, 1040 → 1042 lines)
- `components/shop/PackShopClient.tsx` (Alpha library copy + Coming Soon lockdown + dead state cleanup)
- `app/shop/packs/page.tsx` (metadata copy)
- `lib/i18n/en.ts`, `lib/i18n/da.ts` (Inventory / Beholdning keys)
- Existing nav-dropdown test (flipped Break Room-last assertion)

**Known gaps (unchanged):**
- DK `/dk/shop/packs` route still missing (AFS-26)
- 5 V3 reference files still untracked (intentional)
- GHAI top-up modal stuck-open bug (out of scope, pre-existing)

**Rollback:**
```bash
git reset --hard backup/pre-afs-6a-fix-20260425
git push --force-with-lease origin main
git push origin :refs/tags/afs-6a-fix-complete
```

---

### Session 2026-04-24 — Sprint AFS-6a COMPLETE (In-game Shop GHAI Flow)

**Status:** ✅ SHIPPED to `origin/main`, tag `sprint-afs-6a-complete` pushed, build clean, 4 new routes (/shop/cosmetics, /dk/shop/cosmetics, /inventory, /dk/inventory)
**Tag:** `sprint-afs-6a-complete`
**Backup:** `backup/pre-sprint-afs-6a-20260424`
**Tests:** 994/994 green (was 973, +21 new AFS-6a assertions — target was +10)
**Final HEAD:** `bf1ce98`

**Commit chain:**
```
bf1ce98 test(afs-6a): playwright e2e spec (voidexa-tests handoff)
21bbaf3 test(afs-6a): vitest unit coverage
525afde feat(afs-6a): /inventory page read view
f607377 feat(afs-6a): rewire ShopPage ItemModal BUY to spendGhai + packs redirect
e2c99fa feat(afs-6a): mount ShopCosmeticsClient at /shop/cosmetics
4e9a333 docs(afs-6a): SKILL v2 based on live codebase audit
```

**SKILL v2 reason:** Claude Code pre-flight 2026-04-24 exposed v1 SKILL built on false premise. Reality: GHAI purchases already shipped for packs (`/shop/packs` via `PackShopClient` + `/api/shop/open-pack` with Mythic supply, optimistic concurrency, Universe Wall broadcast, ghai_transactions ledger) AND cosmetics (`CosmeticTab` via `spendGhai()`). The real bug was narrower: `/shop` rendered `ShopPage` with dead "Coming Soon · Stripe" modal buttons, and `ShopCosmeticsClient` was orphan code (zero `app/` imports). v1 would have duplicated working schema (proposed new `shop_packs`, `user_inventory`, `shop_transactions`, `purchase_pack_atomic` RPC — all already exist via `user_credits.ghai_balance_platform` + `user_cards` + `user_cosmetics` + `ghai_transactions` + `mythic_supply`). v2 reshaped to narrow fix.

**What shipped:**
- `/shop/cosmetics` + `/dk/shop/cosmetics` — mount previously orphaned `ShopCosmeticsClient` with Next.js 16 async `searchParams`, SEO canonical+alternates, default `tab=racing`
- `ShopTabs` push target retargeted from `/shop` → `/shop/cosmetics` so tab nav stays inside cosmetics surface
- `ShopPage.tsx` ItemModal BUY rewired — dead "Coming Soon · Stripe" button replaced with new `<ItemBuyButton>`. Card packs redirect to `/shop/packs`; all other categories spend via `spendGhai` + insert `user_cosmetics`. Error branches link to `/wallet` (low GHAI) and `/auth/login` (unauth)
- `lib/shop/buy-handler.ts` — pure helper, no new tables/RPC; reuses existing `spendGhai` + `user_cosmetics` schema per SKILL v2
- `/inventory` + `/dk/inventory` — auth-gated server page (`redirect('/auth/login?redirect=/inventory')`), reads `user_cards` + `user_cosmetics`, client grid with All/Cards/Cosmetics tabs, empty state CTA, links to `/shop/packs` + `/shop/cosmetics`
- `ShopPage.tsx` went 1055 → 1040 lines (15-line reduction)

**Sprint deviations from SKILL v2:**
1. Vitest over Playwright in-repo — Playwright is not installed in `voidexa-ai/voidexa`; lives in `voidexa-tests`. Matches AFS-4 precedent. Spec committed to `tests/e2e/afs6a-shop-buy.spec.ts` as handoff artifact for voidexa-tests maintainer.
2. Test count overshoot — 21 new assertions vs SKILL target of ~10 (source-level invariants + mocked buy-handler unit tests).
3. Minor SKILL text note — PACK_DEFS third tier is actually `legendary`, not `ultimate` as sanity-check comment claimed (line 86 of SKILL v2). No code impact.

**Known items out-of-scope (per SKILL v2 exclusions):**
- No new Supabase tables / RPC (existing schema reused)
- ShopPage still 1040 lines (pre-existing debt)
- STARTER_SHOP_ITEMS acquired via /shop BUY own `user_cosmetics` row keyed by starter id (skin-crimson-fighter etc.) — the game doesn't yet render these as visuals because rendering code is keyed off separate COSMETIC_CATALOG IDs. Ownership flow is real; visual application is a future rebuild concern
- `t.shop.comingSoonStripe` translation key left in `lib/i18n/*` as harmless dead code
- No PACK_DEFS expansion to 5 tiers
- Danish copy in new cosmetic/inventory pages uses English handler (AFS-28)
- 400-item catalog rebuild from `shop_alpha_master.md` remains a future multi-sprint chain
- Playwright spec file is source-only in this repo — not executed

**Post-ship live audit findings (handled in AFS-6a-fix above):**
- Universe dropdown missing Inventory entry
- `/shop/cosmetics` back-link pointed to `/` not `/shop`
- No cross-nav between `/shop` and `/shop/cosmetics`
- `/shop/packs` copy said "257-CARD LIBRARY"
- `/shop/packs` BUY was active — locked to "Coming Soon" until AFS-5 + AFS-18 complete

**Files added:**
- `docs/skills/sprint-afs-6a-shop-ghai-flow.md` (SKILL v2)
- `app/shop/cosmetics/page.tsx` + `app/dk/shop/cosmetics/page.tsx`
- `app/inventory/page.tsx` + `app/dk/inventory/page.tsx`
- `components/inventory/InventoryGrid.tsx`
- `components/shop/ItemBuyButton.tsx`
- `lib/shop/buy-handler.ts`
- `tests/afs-6a-shop-rewire.test.ts`
- `tests/e2e/afs6a-shop-buy.spec.ts` (handoff to voidexa-tests)

**Files modified:**
- `components/shop/ShopPage.tsx` (1055 → 1040, BUY rewire)
- `components/shop/ShopTabs.tsx` (retargeted push)

**Rollback:**
```bash
git reset --hard backup/pre-sprint-afs-6a-20260424
git push origin main --force-with-lease
git push origin :refs/tags/sprint-afs-6a-complete
```

---

### Session 2026-04-22 — Sprint AFS-4 COMPLETE (Admin Control Plane Data Pipeline)

**Status:** ✅ SHIPPED to `origin/main`, migration applied in Supabase
(`ihuljnekxkyqgroklurp`), tests green, build clean. Live dashboard
verification to be done by Jix after first real events land.
**Tag:** `sprint-afs-4-complete`
**Backup:** `backup/pre-afs-4-20260422`
**Tests:** 973/973 green (was 938, +35 new AFS-4 assertions)
**Final HEAD:** `a15e568`

**Commit chain:**
```
a15e568 test(afs-4): playwright admin flow + unit tests
b455380 feat(afs-4): rewire control plane dashboard to real data
3d2b3da feat(afs-4): rewire /api/kcp90/stats to aggregate real events
8233b93 feat(afs-4): trading bot events endpoint stub
6eb13b5 feat(afs-4): wire break room logging
3e20887 feat(afs-4): wire quantum session logging via proxy endpoint
42a4f62 feat(afs-4): wire void chat compression logging
72b2459 feat(afs-4): server-side log-event helper
b91ec9e feat(afs-4): kcp90_compression_events migration
6f5bcbf docs(afs-4): SKILL v2 for admin data pipeline
```

**What shipped:**
- New Supabase table `kcp90_compression_events` (13 cols + 3 indexes),
  RLS enabled, exactly one policy `admin_read_all` using existing
  `public.is_admin()` — default-deny for everyone else; service-role
  bypass handles writes by design
- Server-only helper `lib/kcp90/log-event.ts` — fire-and-forget,
  `import 'server-only'`, singleton `supabaseAdmin`, never throws to
  caller, console-only error path
- **Void Chat:** `app/api/chat/send/route.ts` now captures raw vs
  compressed history byte sizes around the existing
  `compressForContext()` call and logs a `product: 'void-chat'` event
  in `onDone` after GHAI deduction (non-blocking)
- **Quantum:** new proxy endpoint `/api/quantum/log-session` so the
  browser-side SSE loop can report without ever touching the
  service-role key. `lib/quantum/client.ts` posts to it on
  `session_complete` events, carrying `mode`, `rounds`,
  `providers_used`, `kcp_savings`, `cost`
- **Break Room:** `app/api/break-room/chat/route.ts` logs each chat
  turn with `product: 'break-room'`, token counts estimated from
  character counts (`~4 chars/token`) and flagged
  `tokensEstimated: true` in `meta`
- **Trading Bot:** new `/api/trading-bot/events` endpoint using the
  shared `KCP90_API_SECRET` + Bearer convention (no new bespoke
  secret). Bot repo wiring stays out of scope (AFS-16)
- **`/api/kcp90/stats` overwrite (not new path):** preserved POST
  contract with external callers but migrated writes to new table via
  `logKcp90Event`; GET now enforces `profile.role === 'admin'` and
  returns `{ generatedAt, windows: {24h,7d,30d}, recent }` aggregated
  from `kcp90_compression_events`. Public consumer
  `/api/kcp90/public-stats` untouched
- **Dashboard rewire:** extracted `lib/kcp90/dashboard-adapter.ts` with
  pure `toLegacySummary` + `toLegacyRecent` that map the new API shape
  onto the existing `Summary`/`RecentStat` UI types, so no panel
  code had to change. Dashboard fetches on mount + every 30s, keeps
  previous data on network error. `app/control-plane/page.tsx`
  dropped legacy SSR fetch of `kcp90_summary`/`kcp90_daily_stats`
  and now uses `createServerSupabaseClient` + `supabaseAdmin` for
  auth + role check

**Sprint scope deviations from SKILL v2 (documented):**
1. **Server-client export name** — SKILL's VERIFY-FIRST tag flagged
   correctly: `lib/supabase-server.ts` exports
   `createServerSupabaseClient`, not `createServerClient`. Tasks 4, 7,
   and 8 adjusted.
2. **Admin-client shape** — `lib/supabase-admin.ts` exports the
   pre-built `supabaseAdmin` singleton, not a factory. Task 2 helper
   uses the singleton directly (dropped the local `serviceClient()`
   factory from the SKILL's "universally safe" variant in favour of
   the SKILL's own "Alternative" block).
3. **Test framework** — Vitest, not Playwright. AFS-1/2/3 precedent
   was explicit. Playwright is in a separate `voidexa-tests` repo.
   35 assertions shipped against the SKILL's target of ~20.
4. **Task 7 existing POST ingest** — SKILL assumed the endpoint
   "returns nulls". Reality: it had a working POST path writing to
   legacy `kcp90_stats` table via `KCP90_API_SECRET` + Bearer. Per
   approved plan: preserved the POST body contract for external
   callers, delegated writes to `logKcp90Event` so legacy callers
   start contributing to the new table.
5. **Shared secret for trading-bot** — SKILL proposed a new
   `TRADING_BOT_WEBHOOK_SECRET`. Per approved plan: reused the
   existing `KCP90_API_SECRET` so there is ONE machine-to-machine
   secret across all product ingest endpoints. No new env var.
6. **Dashboard adapter extracted** — originally inlined in
   `ControlPlaneDashboard.tsx` but that put the file at 944 lines
   (SKILL target 900). Extracted the pure functions to
   `lib/kcp90/dashboard-adapter.ts` — kept the dashboard under budget
   AND gave Task 9 real unit tests (not just source-level grep).

**Files added:**
- `docs/skills/sprint-afs-4-admin-data-pipeline.md` (Task 0)
- `supabase/migrations/20260422_kcp90_compression_events.sql`
- `lib/kcp90/log-event.ts` (73 lines, server-only)
- `lib/kcp90/dashboard-adapter.ts` (108 lines, pure)
- `app/api/quantum/log-session/route.ts` (48 lines)
- `app/api/trading-bot/events/route.ts` (49 lines)
- `tests/afs-4-admin-data-pipeline.test.ts` (35 assertions)

**Files modified:**
- `app/api/chat/send/route.ts` (Void Chat wire, +17 lines)
- `app/api/break-room/chat/route.ts` (Break Room wire, +19 lines)
- `app/api/kcp90/stats/route.ts` (OVERWRITE — 131 → 191 lines)
- `lib/quantum/client.ts` (session_complete hook, +30 lines)
- `app/control-plane/page.tsx` (dropped legacy SSR fetch, 66 → 36
  lines)
- `components/control-plane/ControlPlaneDashboard.tsx` (adapter fetch
  + mount-refresh, 861 → 872 lines, still over component 300-line
  limit — pre-existing debt, not introduced by AFS-4)
- `CLAUDE.md` (this entry + sprint history row + P0 bug row update)

**Supabase changes (project `ihuljnekxkyqgroklurp`, EU):**
- Table `kcp90_compression_events` — created + smoke-tested by Jix
  (insert → count=1 → delete)
- RLS enabled with 1 policy (`admin_read_all`)
- Legacy `kcp90_stats` / `kcp90_summary` / `kcp90_daily_stats` tables
  untouched — frozen for historical data, no longer written to

**Known items out-of-scope:**
- AFS-16 — Trading Bot repo-side wiring (endpoint stub built here,
  bot still needs to POST to `/api/trading-bot/events`)
- AFS-26 — Danish translation of dashboard copy
- Live dashboard screenshot verification — waits for Void Chat /
  Quantum / Break Room traffic to generate real events. Jix to
  confirm once numbers appear
- Legacy `kcp90_stats` table migration into new table — data remains
  queryable in Supabase, never auto-merged
- `components/control-plane/ControlPlaneDashboard.tsx` at 872 lines
  still violates the 300-line component limit (inherited from
  pre-sprint state; touching it here was constrained to a minimal
  adapter wire-up)

**Rollback:**
```bash
git reset --hard backup/pre-afs-4-20260422
git push origin main --force-with-lease
git push origin :refs/tags/sprint-afs-4-complete
# Supabase: drop table kcp90_compression_events (no production data yet)
```

---

### Session 2026-04-22 — Sprint AFS-3 COMPLETE (Game Hub 404 Fixes)

**Status:** ✅ SHIPPED to `origin/main`, live-verified on voidexa.com
**Tag:** `sprint-afs-3-complete`
**Backup:** `backup/pre-sprint-afs-3-20260422`
**Tests:** 938/938 green (was 910, +28 new AFS-3 assertions)
**Final HEAD:** `3da828c`

**Commit chain:**
```
3da828c test(afs-3): game hub redirects + tile UX coverage
83c798b feat(afs-3): game hub tile UX with icons and descriptions
631d08d feat(afs-3): 308 redirects for canonical game hub aliases
ebd6a8b chore(afs-3): add sprint SKILL documentation
```

**What shipped:**
- 8 permanent (308) redirects in `next.config.ts`: 4 EN canonicals
  (`/game/card-battle` → `/game/battle`, `/game/deck-builder` →
  `/game/cards/deck-builder`, `/game/pilot-profile` → `/game/profile`,
  `/game/shop` → `/shop`) plus 4 DK mirrors pointing at the same
  English destinations (DK game surface is untranslated for now —
  tracked under AFS-26)
- Game Hub tile UX refresh: extracted to `components/game/GameHubTiles.tsx`,
  every tile now carries a lucide-react icon, a 1-line description, a
  responsive grid (1 col mobile / 2 tablet / 4 desktop), hover + focus
  states, and a `data-testid` hook for future E2E
- UniverseWallFeed retained below the grid

**Sprint scope deviation (documented):** The AFS-3 SKILL (pushed as
`ebd6a8b`) was written assuming `/game/card-battle`, `/game/deck-builder`,
and `/game/pilot-profile` did not exist. Task 1 inventory proved the
features **already ship** at non-canonical URLs — `/game/battle`
(BattleClient + BattleEntry + BattleController, 12 components),
`/game/cards/deck-builder` (DeckBuilderClient, 584 lines), and
`/game/profile[/userId]` (PilotCard + TalesLog + ProfileEditForm). The
Shop tile in the hub already pointed at `/shop`, not the dead
`/game/shop`. Re-implementing these from `components/combat/*` would
have produced two live URLs for every feature and ~2000 lines of
duplicated code. Using the AFS-2 redirect pattern instead delivers the
P0 fix (canonical URLs no longer 404) without touching working
battle/deck/profile code.

**Files added:**
- `components/game/GameHubTiles.tsx` (141 lines, exports `GAME_HUB_TILES`)
- `tests/afs-3-game-hub.test.ts` (28 assertions)

**Files modified:** `next.config.ts`, `app/game/page.tsx`, `CLAUDE.md`.

**Live verification (2026-04-22 via curl):**
- 308 with `Location: /game/battle` for `/game/card-battle`
- 308 with `Location: /game/cards/deck-builder` for `/game/deck-builder`
- 308 with `Location: /game/profile` for `/game/pilot-profile`
- 308 with `Location: /shop` for `/game/shop`
- Same 308s for all 4 DK mirror URLs
- Destinations: `/game/battle` 200, `/game/cards/deck-builder` 200,
  `/game/profile` 307 (server-component auth redirect, expected),
  `/shop` 200, `/game` 200

**Known items out-of-scope (unchanged):**
- AFS-26 — Danish translation of the game surface; DK redirects
  currently land on English destinations on purpose
- AFS-12 — sound wiring on battle events (5 boss themes still unwired)
- AFS-4 — Admin Control Plane data pipeline
- AFS-5 — 257-card art pipeline
- Tutorial flow for first-time card battle players

**Rollback:**
```bash
git reset --hard backup/pre-sprint-afs-3-20260422
git push origin main --force-with-lease
git push origin :refs/tags/sprint-afs-3-complete
```

---

### Session 2026-04-22 — Sprint AFS-2 COMPLETE (Auth Route Infrastructure)

**Status:** ✅ SHIPPED to `origin/main`, live verification pending Vercel deploy
**Tag:** `sprint-afs-2-complete`
**Backup:** `backup/pre-sprint-afs-2-20260422`
**Tests:** 910/910 green (was 860, +50 new AFS-2 assertions)
**Final HEAD:** `36d5f62`

**Commit chain:**
```
36d5f62 test(afs-2): wallet/settings/smoke coverage
ee70831 feat(afs-2): wallet + settings in user dropdown
11055b1 feat(afs-2): /settings page MVP
6ec6c2e feat(afs-2): /wallet page binds existing backend APIs
e223382 feat(afs-2): 308 redirects for canonical auth aliases
00c6c0c chore(afs-2): add sprint SKILL documentation
```

**What shipped:**
- 14 permanent (308) redirects in `next.config.ts`: 7 EN canonicals
  (`/login`, `/signin`, `/signup`, `/register`, `/auth/signin`,
  `/auth/register`, `/account`) plus 7 DK mirrors
- `/wallet` (+ `/dk/wallet`) — server-rendered auth-gated page that
  redirects unauthenticated visitors to `/auth/login?redirect=/wallet`,
  reuses the existing `WalletBar` component for Stripe top-up, and
  shows the last 10 `wallet_transactions` with Stripe flag + running
  balance
- `/settings` (+ `/dk/settings`) — MVP account settings: display name
  (writes to `profiles.name`), read-only email, language preference
  stored under `voidexa_locale_pref_v1`, notifications stub, sign-out,
  delete-account hand-off to `/contact`
- DK auth re-export pages: `/dk/auth/login`, `/dk/auth/signup`,
  `/dk/profile` — thin wrappers around the English pages with DK
  metadata, matching the AFS-7 locale-mirror pattern
- `app/auth/login/page.tsx` — now reads `?redirect=` and sends users
  back to their intended destination after signing in, with an
  allowlist that blocks open-redirect abuse; wrapped in Suspense to
  keep Next.js 16 prerender happy
- `components/AuthButton.tsx` — user dropdown now contains Profile +
  Wallet + Settings + Sign out with Danish labels (Profil, Tegnebog,
  Indstillinger, Log ud, Tilmeld); all links route through
  `localizeHref`

**Files added:**
- `app/wallet/page.tsx` + `layout.tsx`
- `app/settings/page.tsx` + `layout.tsx`
- `app/dk/wallet/page.tsx`, `app/dk/settings/page.tsx`
- `app/dk/auth/login/page.tsx`, `app/dk/auth/signup/page.tsx`
- `app/dk/profile/page.tsx`
- `components/wallet/WalletPageClient.tsx`
- `components/settings/SettingsPageClient.tsx`
- `tests/afs-2-auth-routes.test.ts` (50 assertions)

**Files modified:** `next.config.ts`, `app/auth/login/page.tsx`,
`components/AuthButton.tsx`.

**Known items out-of-scope (unchanged):**
- Password reset flow (separate sprint)
- 2FA / MFA
- OAuth provider expansion
- Deeper wallet analytics (GHAI balance, per-product spend)
- Deeper settings (email change, notification backend, GDPR-automation
  delete) — currently stub/toast only, handled by support
- Danish translation of the auth forms themselves (AFS-26)

**Rollback:**
```bash
git reset --hard backup/pre-sprint-afs-2-20260422
git push origin main --force-with-lease
git push origin :refs/tags/sprint-afs-2-complete
```

---

### Session 2026-04-22 — Sprint AFS-1 COMPLETE (+ 1b, 1c, 1d hotfixes)

**Status:** ✅ SHIPPED to production, live verified
**Tag:** `sprint-afs-1-complete`
**Tests:** 825/825 green
**Final HEAD:** `357e1a9`

**Full commit chain on main:**
```
357e1a9 feat(afs-1d): add ultrawide 1928x816 still frame, matches viewport aspect
fa01588 Revert "fix(afs-1c): still frame object-fit cover to contain, full scene visible"
dee8ffa fix(afs-1c): still frame object-fit cover to contain, full scene visible (reverted)
8d3a1e6 docs(sprint-afs-1): mark sprint complete, record 7 commits + 825 tests green
b8aed26 test(homepage): AFS-1 regression suite (25 tests)
85c830f fix(afs-1): checkbox + replay link contrast
228d79e fix(afs-1): Bespoke -> Custom-built apps
122ac57 fix(afs-1): per-session audio gate via sessionStorage
cb16c40 fix(afs-1): MUTE button deleted (IntroVideo 151 -> 73 lines)
fa5d379 fix(afs-1): matched-aspect still frame upload
a819608 chore(sprint-afs-1): SKILL.md + upload script
```

**6 tasks executed:**
1. FFmpeg extracted video last frame (WRONG — see AFS-1b)
2. MUTE button deleted from IntroVideo.tsx
3. Sound popup moved to sessionStorage
4. "Bespoke" → "Custom-built apps" (EN + DA)
5. Checkbox + Replay link contrast (opacity 0.95, weight 500, text-shadow)
6. Vitest regression suite (25 tests) — deviation from Playwright in SKILL (saved ~300MB deps)

**Hotfixes chain:**

**AFS-1b:** Restored Jix's original 1536×1024 Runway PNG to Supabase (overwrote video-frame extract which had wrong composition — camera-through-window reveal was cropped)

**AFS-1c:** Changed `object-fit: cover` to `contain` on still frame (`app/page.tsx:122`) — revealed full scene but introduced black pillar-bars on ultrawide

**AFS-1d:** Final fix. Jix generated new 1928×816 ultrawide PNG (aspect 2.363, matches viewport 2.386). Uploaded to Supabase, reverted AFS-1c (object-fit back to cover). Result: full screen + full composition + no bars.

**Live verified:** Jix confirmed "det virker nu" after Chrome cache clear.

**Known items out-of-scope (unchanged):**
- "We are live. Welcome to voidexa" banner still top of page (Sprint 17 Task 3)
- Starmap nebula zoom too close (AFS-10 Starmap Level 2)
- Video cinematic still ends on OLD still composition, not new ultrawide (Jix: "skal have ændret filmen til den nye baggrund på et tidspunkt — ikke vigtigt nu")
- 15 Dependabot advisories unrelated to AFS-1 (AFS-22 repo hygiene)
- `app/page.tsx` 166 lines (over 100 target)
- "Bespoke" still in HomeProducts.tsx + ProductPanels.tsx (different sections, explicitly excluded from AFS-1)

**Files changed (this sprint):**
- `docs/skills/sprint-afs-1-homepage-repair.md` (new)
- `scripts/upload-intro-frame.mjs` (new)
- `components/IntroVideo.tsx`
- `components/QuickMenuOverlay.tsx`
- `components/SoundPopup.tsx`
- `app/page.tsx` (line 122 reverted to cover after AFS-1d)
- `lib/i18n/en.ts`
- `lib/i18n/da.ts`
- `tests/homepage-flow.test.ts` (Vitest, 25 assertions)
- `CLAUDE.md` (session log)
- `assets/intro/stil_picture_intro_ultrawide.png` (new, committed for provenance)

**Supabase Storage:**
- `intro/stil_picture_intro.png` = 1928×816 ultrawide (current live)

**Rollback tags available:**
- `backup/pre-sprint-afs-1-20260422`
- `backup/pre-sprint-afs-1b-20260422`

---

### Session 2026-04-22 — Sprint AFS-7 COMPLETE (Legal Pages)

**Status:** ✅ SHIPPED to production, 8/8 routes live-verified (200)
**Tag:** `sprint-afs-7-complete`
**Backup:** `backup/pre-sprint-afs-7-20260422`
**Tests:** 860/860 green (was 825, +35 new AFS-7 assertions)
**Final HEAD:** `b58fcb8`

**Commit chain:**
```
b58fcb8 feat(afs-7): legal pages + sitemap + robots + cookie banner
5971d52 chore(afs-7): add sprint SKILL documentation
```

**What shipped:**
- `/privacy` (+ `/dk/privacy`) — GDPR policy: data controller (CVR 46343387),
  7 sub-processors (Supabase EU, Stripe, Vercel, Anthropic, OpenAI, Google,
  Perplexity), retention table, GDPR rights, Datatilsynet escalation, Danish
  governing law
- `/terms` (+ `/dk/terms`) — commercial ToS: GHAI as non-refundable digital
  platform credit (not crypto / not investment / not security / not legal
  tender / not cash-redeemable), UGC license, 2-year reklamationsret for
  physical products, 14-day distance-sales return right, Vordingborg
  retskreds jurisdiction
- `/cookies` (+ `/dk/cookies`) — policy + inline `CookieSettings` mid-page
  consent toggle. Key `voidexa_cookie_consent_v1` stores `essential` or `all`.
- `/sitemap.xml` — 48 URLs (34 EN + 14 DK), change-frequency and priority
  tuned per route class
- `/robots.txt` — allow `/`, disallow `/admin`, `/control-plane`, `/auth`,
  `/api` (with + without trailing slash), Sitemap + Host point to voidexa.com
- `CookieBanner` wired globally via `app/layout.tsx`; pure helpers in
  `lib/cookies/consent.ts` so Vitest exercises them without a DOM

**Files added:**
- `docs/skills/sprint-afs-7-legal-pages.md` (new)
- `app/privacy/page.tsx` + `layout.tsx`
- `app/terms/page.tsx` + `layout.tsx`
- `app/cookies/page.tsx` + `layout.tsx`
- `app/dk/privacy/page.tsx`, `app/dk/terms/page.tsx`, `app/dk/cookies/page.tsx`
- `app/sitemap.ts`, `app/robots.ts`
- `components/legal/LegalPage.tsx`
- `components/legal/CookieBanner.tsx`, `components/legal/CookieSettings.tsx`
- `lib/cookies/consent.ts`
- `tests/afs-7-legal-pages.test.ts` (35 assertions)

**Files modified:** `app/layout.tsx` (CookieBanner import + render).

**Live verification (2026-04-22 via curl):**
- 200 `/privacy`, `/terms`, `/cookies`, `/sitemap.xml`, `/robots.txt`
- 200 `/dk/privacy`, `/dk/terms`, `/dk/cookies`
- Content checks: CVR 46343387 + Datatilsynet render on `/privacy`;
  non-refundable + Vordingborg + reklamationsret render on `/terms`;
  consent key + CookieSettings id render on `/cookies`

**Legal disclaimer baked into both /privacy and /terms:** boilerplate
sufficient for technical compliance. Full solicitor review tracked as
**AFS-37** before any major marketing push.

**Known items out-of-scope:**
- AFS-26 — proper Danish translations (DK routes re-export English)
- AFS-37 — ADVORA attorney review of legal copy
- CW-4 — cookie banner copy polish with i18n strings
- Analytics SDK not yet installed; when added, it must read
  `getCookieConsent()` and gate itself on `'all'` before firing

**Prior CLAUDE.md claim that AFS-4 + AFS-5 SKILL files were pushed was
incorrect** — only AFS-1 was actually committed before this sprint. AFS-4
and AFS-5 SKILL files still do not exist and need to be written before they
can be executed.

---

## ACTIVE P0 BUGS (remaining)

| Bug | Fix |
|---|---|
| ~~Homepage cinematic + quick menu~~ | ✅ **AFS-1 COMPLETE** |
| ~~`/login`, `/signin`, `/wallet`, `/settings`, `/account` 404~~ | ✅ **AFS-2 COMPLETE** |
| ~~`/game/card-battle`, `/game/deck-builder`, `/game/pilot-profile`, `/game/shop` 404~~ | ✅ **AFS-3 COMPLETE** |
| ~~Admin Control Plane ZERO data~~ | ✅ **AFS-4 COMPLETE** |
| Cards blank art (1000 Alpha scope) | AFS-5 (external chat in progress — scope pivoted from 257 V3 to 1000 Alpha) |
| ~~Shop 26 cosmetics "COMING SOON"~~ | ✅ **AFS-6a COMPLETE** (reality was narrower — see SKILL v2 reshape) |
| ~~Shop nav + cross-nav + copy + pack lockdown~~ | ✅ **AFS-6a-fix COMPLETE** |
| ~~`/privacy`, `/terms`, `/cookies`, `/sitemap.xml`, `/robots.txt` 404~~ | ✅ **AFS-7 COMPLETE** |
| ~~Battle scene footer overlap + twinkling Stars backdrop~~ | ✅ **AFS-6g COMPLETE** |
| ~~Jarvis bubble overlapping UniverseChat on 9 ruter~~ | ✅ **CommBubble Hotfix COMPLETE** (proper merge in AFS-13) |
| GHAI top-up modal stuck open across pages | **NEW — needs investigation sprint** |
| Starmap Level 2 nebula zoom | AFS-10 |
| Cinematic video end-frame ≠ new backdrop | AFS-11 (future, low prio) |
| "We are live. Welcome" banner | AFS-12 (polish) |
| Danish i18n overflade-only | AFS-26 |
| `/dk/shop/packs` route missing | AFS-26 |
| STARTER_SHOP_ITEMS ownership → visual render gap | Future rebuild (tracked, not P0) |

---

## PENDING SPRINTS (this chat)

- **AFS-6b** — Real-world GHAI Commerce UX (disambiguation: DKK/EUR disclaimer on AEGIS/Comlink/Consulting pages, contact form "Ghost AI Chat" rename, wallet clarification)
- **AFS-6c** — voidexa Shop v1: catalog + "Kontakt for køb" form → contact@voidexa.com via Resend. Products: AEGIS Monitor, Comlink Node, Website Builder, AI Consulting. NO checkout/payment in v1. 2-year DK reklamationsret.

---

## DATA SAFETY CHECKLIST (every sprint)

Before marking sprint complete:
- [ ] `git status` clean
- [ ] `git log origin/main --oneline -3` shows our commit at HEAD
- [ ] Untracked reviewed
- [ ] Tag pushed: `git push origin sprint-afs-N-complete`
- [ ] If UI: live-verify on voidexa.com (incognito, hard-reload)
- [ ] CLAUDE.md updated AND uploaded to Project Knowledge (new Apr 25 rule)
- [ ] SKILL.md committed first

---

## AUTHORITY HIERARCHY

1. Live audit (Claude in Chrome)
2. GROUND_TRUTH.md raw log
3. INDEX files (00-18)
4. userMemories
5. Claude session context

Never guess. Search INDEX → raw → past chats → only then ask Jix.
