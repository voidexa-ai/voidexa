---
name: sprint-7-sound-system
description: Rename 67 sounds, move to public/sounds/, build sound-manager + wire to gameplay events
sprint: 7
status: pending
---

## Inputs
`docs/sounds/` — 67 numbered MP3s like `14_Card_play_____weapon.mp3` (4-underscore
separator from Suno export artifact). Plus 1 stray `.zip` to skip.

## Naming convention
`<category>-<event>.mp3` — kebab-case. Examples:
- `14_Card_play_____weapon.mp3` → `card-play-weapon.mp3`
- `28_Freeflight_____calm_space.mp3` → `freeflight-calm-space.mp3`
- `43_Kestrel_Reclaimer_theme.mp3` → `boss-kestrel-reclaimer.mp3`
- `1_Weapon_fire_____laser_beam.mp3` → `weapon-fire-laser-beam.mp3`

## Deliverables
1. **Renamed asset folder** `public/sounds/` (gitignored binaries — see notes).
2. **Mapping doc** `public/sounds/SOUND_INDEX.md` (tracked) — old → new + event key.
3. **Manager**
   - `lib/sound/types.ts` — `SoundEventKey` union of all 67 keys.
   - `lib/sound/manager.ts` — `SoundManager` class:
     - `play(key, opts?: { volume?, loop? })` (HTMLAudioElement pool, max 6 concurrent)
     - `stop(key)`, `stopAll()`, `setMasterVolume(v)`, `setMuted(b)`
     - LocalStorage persistence: `voidexa.sound.volume`, `voidexa.sound.muted`
   - `lib/sound/events.ts` — semantic event → key map
     (e.g. `'card.play.weapon' → 'card-play-weapon'`).
4. **Hook** `useSoundManager()` — singleton SSR-safe (`typeof window` guard).
5. **UI**
   - `components/sound/VolumeControl.tsx` — gear/slider in MiniNav top-right.
6. **Wiring** (minimum viable, expandable later)
   - Card play → `card.play.weapon|shield`
   - Free Flight: engine start, ambient loop, scanner ping, dock prompt
   - Menu hover/click on top nav
7. **Tests** `lib/sound/__tests__/manager.test.ts` — mock Audio, assert pool/limit/volume.

## Plan
1. Backup tag.
2. Bash rename script: parse number prefix, strip 4-underscore, kebab-case,
   move to `public/sounds/`. Skip `.zip`. Build mapping JSON during move.
3. Write SOUND_INDEX.md from mapping JSON.
4. Write types/manager/events/hook.
5. Write VolumeControl + add to MiniNav.
6. Wire 6+ events.
7. `.gitignore` add `public/sounds/*.mp3` with `!SOUND_INDEX.md` negation.
8. Tests + build + commit + tag `sprint-7-complete` + push.

## Notes
- MP3 binaries follow `public/models/` convention (gitignored, indexed by markdown).
- HTMLAudio chosen over WebAudio for v1 simplicity. Upgrade path noted in manager docstring.
