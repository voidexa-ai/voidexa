# VOIDEXA GAME — KOMPLET KONTEKST TIL NY CHAT

**Samlet: 19. april 2026**
**Formål:** Denne kontekst gør at den nye chat forstår situationen uden at bruge energi på research. Den skal teste, debugge, og fikse spillet. Den skal IKKE bygge noget nyt før det er diskuteret igennem og aftalt.

---

## 1. SITUATIONEN

Jix kører tre parallelle spor på voidexa:

- **Cards:** 1000 alpha-kort designet, prompts v2 færdige. Kort-art rendering fejlede på alle testede modeller (SDXL, Juggernaut, DreamShaper, FLUX) — LoRA training er næste skridt i separat chat.
- **Shop:** 400 shop-items designet. Ships kan renderes nu, resten venter på gameplay features.
- **Game:** Denne chat's scope. Spillet skal op på samme niveau som cards og shop. Shop-art af ship skins, cockpits, battle boards osv. kan ikke renderes meningsfuldt før spil-features eksisterer.

---

## 2. HVAD DER ER BYGGET OG DEPLOYED

Spillet er live på voidexa.com med disse moduler:

- Mission board (`/game/mission-board`) — 90 mission-templates
- Deck builder (`/game/cards/deck-builder`) — 257 originale kort loadet (IKKE de nye 1000 alpha)
- Free flight (`/freeflight`) — tutorial, encounters, docking, warp map
- Speed Run (`/game/speed-run`)
- Hauling (`/game/hauling`)
- Quests (`/game/quests`)
- Universe Wall (`/game/universe-wall`)
- Battle scene (`/game/battle`) — PvE card battle med 3D, hand UI, AI loop
- Profile (`/game/profile`)
- Star map (`/starmap`) — Level 1 Galaxy View
- Starmap voidexa system (`/starmap/voidexa`) — Level 2 med landmarks

### Content bygget
- 257 originale kort med 15 keywords, 5 deck archetypes
- 20 landmarks, 10 NPC pilots, 60 exploration encounters, 4 bosses
- 5 starter quest chains, onboarding tutorial
- Booster pack shop, warp system, wreck system
- 67 SUNO sounds

### Nye 1000 alpha kort
- Designet i `docs/alpha_set/batch_01.json` til `batch_10.json`
- 400 Common / 280 Uncommon / 160 Rare / 90 Epic / 50 Legendary / 20 Mythic
- **IKKE integreret i deck builder endnu**

---

## 3. KNOWN BUGS (fra Sprint 1-14 og Jix's observation)

Nogle er muligvis fixet efter Sprint 13. Den nye chat SKAL verificere live før fix.

### BUG-01 — Free Flight access broken
"Explore the Universe" CTA på `/starmap` virker ikke. Brugere kan KUN komme til `/freeflight` via direkte URL.

### BUG-02 — W-key konflikt åbner map
Når man flyver fremad med W, åbner map'et samtidig. Umuligt at flyve og teste. Keybind-konflikt. Skal fixes først — uden dette kan spillet ikke testes.

### BUG-03 — Map er 2D, skal være 3D holografisk
Nuværende map er flat 2D. Per V3 skal det være 3D holografisk universe-map med personal fog-of-war.

### BUG-04 — Lag når tæt på planeter
Asteroider/stones begynder at "hover" og lag kicker ind nær planeter. Gjorde det IKKE før. Længere væk fra planeter kan man flyve gennem stones uden problem. Sandsynligvis docks/LOD-problem der blev skabt i et senere sprint.

### BUG-05 — Q/E bruges til up/down, men bør være roll
Nu: Q/E = up/down. Jix vil have Q/E som venstre/højre spin thrusters (roll). Up/down skal bindes til andre taster.

### BUG-06 — Ship rotation er instant (no inertia)
Ship roterer øjeblikkeligt med mouse. Kan gå boost-frem → 180° → boost-tilbage på 0.5 sekunder. Skal have FPV drone-style inertia: efter 180° turn skal ship fortsætte drifting i original retning mens ny thrust accelererer modsat vej. Som FPV racing drones med VR goggles.

### BUG-07 — Boost trail er cone
Shift-boost viser grim cone bag skibet. Skal være partikel-baseret engine trail (blå ved engine, orange under boost, længde skalerer med hastighed).

### BUG-08 — NPCs er cones
Alle NPC-skibe renderer som små cone-geometrier. Skal erstattes med rigtige glb ship-modeller.

### BUG-09 — Bought 3D assets ikke loaded (813 kr)
- USC ships (AstroEagle, CosmicShark, VoidWhale, 289 stk) — ikke loaded
- Hi-Rez cockpits (5 stk) — ikke loaded
- Hi-Rez ships — ikke loaded
- Expansion ships (50 stk) — ikke loaded
- Root cause: FBX/OBJ → glb konvertering mistede texture-binding
- Kun qs_bob (free starter) er loadet og virker
- Quaternius ships HAR teksturer og kan bruges som alternative NPC-modeller

### BUG-10 — Tutorial er forkert implementeret
- NPC popper op som chat-bobble, ligner ikke tutorial
- Spilleren opdager ikke det er en tutorial
- Skal være dedikeret stort vindue med "Start Tutorial" valg

### BUG-11 — Tutorial er gated af GHAI
Koster GHAI at starte tutorial. Skal være GRATIS. Ingen pressure-to-buy umiddelbart.

### BUG-12 — Jarvis chat på voidexa.com broken
Jarvis-chatten responderer ikke. Er bare en død widget.

### BUG-13 — Homepage video audio problem
- Audio starter så hurtigt at man ikke når at enable sound
- Kan ikke disable sound
- Mangler pre-video popup: "Enable sound for full experience? Yes/No"

### BUG-14 — In-game audio issue
Rapporteret men detaljer mangler. Skal reproduceres før fix.

### BUG-15 — Footer synlig i cockpit view
Status: Muligvis fixet i Sprint 13 via ConditionalFooter.tsx. **Verificeres live.**

### BUG-16 — Ship orientation i cockpit view
Usikker om spilleren kigger ud af SKIBETS FRONT i first-person mode. Verificeres.

---

## 4. FEATURES DER ØNSKES BYGGET (diskuter før build)

Disse er ideer — ingen er aftalt endnu. Den nye chat må IKKE skrive CLAUDE.md eller SKILL.md før hver feature er diskuteret og alle detaljer aftalt.

### FEATURE-01 — The Hive (Swiss Cheese Mega-Structure)
**Placering:** Mid Ring
**Størrelse:** ~1-2 km game-scale
**Koncept:** Massiv asteroid/struktur. Fra afstand = mørk klump. Tæt på = hundreder af huller/tunneler/kamre. Du flyver igennem som drone-helikopter. Når du er tæt nok på ser du entrances.

**Tunnel-typer:**
| Type | Bredde | Svært | Adgang |
|------|--------|-------|--------|
| Highway | Bred | Let | Alle skibe |
| Passage | Medium | Medium | Alle skibe |
| Crack | Smal | Hård | Kun Bob, Fighter, Explorer |
| Needle | Ekstremt smal | Expert | Kun Bob, Fighter (wall collision = wreck risk) |
| Chamber | Stort åbent rum | Varierer | Social/boss/loot |

**Deep Chamber:** Glødende kerne i centrum, lore-objekt, potentiel boss lair, bioluminescente vægge (cyan/amber), flydende debris.

**Use cases:** Obstacle course (leaderboard), Void Prix track genvej, exploration, social hangout, training ground, arena dome for Void Duel.

**Ting der SKAL diskuteres før build:**
- Procedurel eller handcrafted?
- Hvor mange tunneler total?
- LOD-system
- Collision detection strategi
- Performance-cap
- Hvordan ser entrances ud tæt på?
- Deep Chamber visuelle identitet

### FEATURE-02 — Ship Ability System (erstat boost)
Fjern generisk boost. Erstat med ship-class-specifikke abilities (trigger via X eller lignende). Hver klasse får unikke abilities tied til achievements + card game.

**Ideer:**
- Kort warp
- EMP release når jagtet
- Class-specifikke abilities (se V3 for Fighter/Hauler/Explorer/Salvager/Bob abilities)

### FEATURE-03 — PvP Flag System (WoW-style)
- Spiller trykker knap → broadcaster "open to PvP"
- Hvis angrebet mens flagged, attacker auto-flags
- Visuel indikator når flagged

### FEATURE-04 — Warp-Ambush Mekanik
- Scanner upgrade (alien-tech themed) lokaliserer flagged PvP targets
- Brug special fuel/credits til at warp-strike inden for range
- Sneak attack fra warp — small ship kan tage down større ship
- Konsekvenser: reputation hit, builds revenge/bounty mekanik

**Ting der SKAL diskuteres:**
- Hvor meget special fuel koster en warp-ambush?
- Cooldown?
- Range?
- Hvilken scanner-tier kræves?

### FEATURE-05 — Faction System (future)
- Planet vs planet PvP
- Faction standing/reputation — low standing = attacked on sight
- Faction-liste ikke defineret endnu

### FEATURE-06 — GHAI grant til nye spillere
Gratis GHAI ved signup så spillere kan lave et par quests før de bliver bedt om at betale. Belønning for at gennemføre tutorial, ikke betaling for at starte.

**Beløb TBD.**

### FEATURE-07 — Tutorial rework
Fra chat-popup til dedikeret stor tutorial-window med "Start Tutorial" valg. Gratis.

### FEATURE-08 — 1000 alpha kort integration i Deck Builder
Integrer stats/text nu (uden art — art kommer senere via LoRA). Art kan placeholder-renderes indtil LoRA er klar.

### FEATURE-09 — Restore/fix 3D assets
- Hi-Rez cockpit01 med teksturer (erstatter procedurel cockpit)
- USC ships som spiller/NPC-modeller
- Expansion ships
- Partikel-baseret engine trail

### FEATURE-10 — 3D Holographic Universe Map
Erstat 2D map med 3D holografisk map. Personal fog-of-war per spiller. Scanner resolution pr. ship class. Tilgængelig fra stationer, cockpit HUD, dedikeret holo-map page.

### FEATURE-11 — Homepage video sound gate
Pre-video popup: "Enable sound for full experience? Yes/No". Pre-roll segment (karakter sidder i sæde, rejser sig op, genereret via ChatGPT start-frame + Runway Kling 3.0 Pro First+Last Frame).

### FEATURE-12 — Jarvis chat reboot
Jarvis skal være ægte AI assistant, ikke decoration. Tied til faktisk Jarvis backend med KCP-90 embedded.
Skal håndtere:
- Produkt-spørgsmål ("Tell me about Quantum")
- Server rental guidance (step-by-step hvis spilleren ikke kender specs)
- Opsætning end-to-end (local models, environments, configs)
- Monetization: gratis basic, premium actions charger GHAI (dækker API costs)

---

## 5. LOCKED DECISIONS (må ikke diskuteres igen)

Fra V3 PART 14:

1. Universe er 3D sphere, 1 time radius, 5 zone shells
2. Platform-GHAI $1=100, V-Bucks model (separate fra Crypto-GHAI)
3. 5 ship classes (Bob free, class=function, tier=cosmetic)
4. 8 card statuses only
5. 15 keywords
6. PvP i transparent dome only, no open-world ganking (men se FEATURE-03 for PvP flag udvidelse)
7. Cast er contract issuers, ikke playable characters
8. Card PvP og Ship PvP (Void Duel) er SEPARATE modes
9. Void Prix (multiplayer racing) er separate fra Speed Run (solo time trial)
10. The Hive er i Mid Ring
11. Deep Void har ingen warp gates
12. Mythic cards: 50 copies max per card, 0.1% drop rate
13. Bob kan aldrig wagered eller mistes
14. Platform-GHAI og Crypto-GHAI må aldrig blandes
15. Universe tone: NMS + Firefly + Guardians
16. Wreck system hybrid timers, 3 recovery paths
17. Hauling risk: player's choice per contract

---

## 6. UNIVERSE STRUKTUR

| Zone | Travel | Content | Risk |
|------|--------|---------|------|
| Core | 0–5 min | voidexa Core, stations, tutorial | Safe |
| Inner Ring | 5–15 min | Claimed planets, trade routes | Low |
| Mid Ring | 15–30 min | Unclaimed planets, derelicts, PvE 1–3, **THE HIVE** | Medium |
| Outer Ring | 30–45 min | Rare resources, high-risk hauling, PvE 4–5 | High |
| Deep Void | 45–60 min | Mythic encounters, The Silent Ones | Very High |

### Ship stats (locked for Void Duel, ikke card PvP)

| Stat | Fighter | Hauler | Explorer | Salvager | Bob |
|------|---------|--------|----------|----------|-----|
| Hull HP | 80 | 130 | 90 | 110 | 100 |
| Speed | 10 | 5 | 8 | 6 | 7 |
| Turn rate | 9 | 4 | 7 | 6 | 6 |
| DPS | 8 | 5 | 6 | 5 | 5 |

---

## 7. MASTER DOKUMENTER I REPOET (læs først)

| Fil | Formål |
|-----|--------|
| `docs/VOIDEXA_INTENT_SPEC.md` (21KB) | Single source of truth |
| `docs/VOIDEXA_GAMING_COMBINED_V3.md` (1825 linjer) | Gameplay mechanics, zones, cards, ship classes |
| `docs/VOIDEXA_UNIVERSE_CONTENT.md` (2322 linjer) | 100 landmarks, 90 missions, 60 encounters, 30 NPCs, 20 quest chains |
| `docs/gpt-outputs/GPT_*.md` | Bosses, sound, archetypes, mechanics, retrofit |
| `lib/game/cards/index.ts` | Card types + keywords |
| `lib/game/battle/engine.ts` | Pure function battle engine |
| `lib/game/battle/ai.ts` | PvE enemy AI |
| `lib/game/battle/encounters.ts` | Tier 1-5 + Kestrel Reclaimer boss |
| `docs/alpha_set/batch_01.json` - `batch_10.json` | 1000 nye alpha kort |

---

## 8. TEST METODER (ud over Chrome extension og Jix's eget program)

**Primære metoder til at finde fejl live:**

1. **Browser DevTools (F12)**
   - Console: JavaScript errors, warnings, React fejl i realtid
   - Network: API-kald, Supabase requests, failed fetches, latency
   - Performance: FPS, lag-kilder (asteroid-lag bug bliver synlig her)
   - Memory: memory leaks (hvorfor lag nær planeter)
   - Application: localStorage/sessionStorage/cookies (tutorial-flag state)

2. **Vercel deployment logs** — server-side errors, build logs, runtime crashes

3. **Supabase dashboard** — table editor, logs (SQL errors, RLS failures), realtime inspector

4. **Next.js lokalt (`npm run dev`)** — hot reload, source maps, React DevTools extension, Three.js inspector (r3f-perf) for FPS counter/draw calls/GPU memory

5. **Chrome Performance Profile recording** — record session hvor spilleren flyver nær planet → se præcis hvilken funktion lagger (long tasks der blokerer main thread). Præcis hvad der skal bruges til BUG-04.

6. **Lighthouse audit** — performance, accessibility, best practices

7. **GitHub Actions / CI logs** — test-run results på hver push

8. **Manual testing matrix** — Chrome, Firefox, Safari, mobile emulator, incognito (fresh state)

9. **Supabase MCP** — direkte queries mod production DB

10. **`npm run test`** — 642 tests da MVP-launch-ready tag blev pushed. Fanger regressioner.

---

## 9. WORKFLOW FOR DEN NYE CHAT

**Test først, fix derefter. Altid.**

For hver bug eller issue:
1. **Reproducer live** via Chrome extension eller DevTools (find den faktiske fejl, ikke antaget fejl)
2. **Console errors?** Network fails? Performance bottleneck? — identificer root cause
3. **Forstå root cause FØR fix skrives** — ingen "fix it again" loops
4. **Diskuter fix med Jix før Claude Code kaldes** — især hvis det rører flere systemer
5. **Backup tag før ændringer** (`git tag backup/pre-TASK-YYYYMMDD`)
6. **Deploy = `git push origin main`** (auto-Vercel)

**Første prioritet: Fix BUG-02 (W-key/map konflikt).** Uden denne kan spillet ikke testes — spilleren kan ikke flyve frem uden at map'et åbner. Det blokerer ALT andet test-arbejde.

For hver feature (IKKE bugs):
1. **Diskuter hele konceptet igennem** med Jix først
2. **Alle detaljer skal aftales** før noget skrives
3. **CLAUDE.md + SKILL.md først**, derefter build
4. **Ingen "vil du have det sådan her? — yes — bygget"** — Jix vil have fuld plan aftalt først

---

## 10. BUILD REGLER (Jix's standarder)

- **TWO boxes:** Box 1 (`cd + claude --dangerously-skip-permissions`), Box 2 (instructions). Aldrig sammen.
- **Altid CLAUDE.md + SKILL.md** før større builds.
- **claude-opus-4-7** (NOT 4.6, deprecated).
- **`/effort xhigh`** for komplekse builds.
- **PowerShell:** Semicolons not `&&`. UTF-8 no BOM. No em-dashes i scripts.
- **Git:** Backup tag før major changes. Tests + build før commit. Aldrig commit binary 3D assets (`public/models/` gitignored).
- **3D models på Supabase Storage bucket "models".**
- **UI:** Body 16px min, labels 14px min, opacity 0.5 min. Non-negotiable.
- **Transparency:** ALLE voidexa AI products MUST vise "Powered by [Claude + GPT + Gemini] — orchestrated by voidexa."
- **Vercel env vars:** Altid `.trim()` i API routes.
- **Tom's file limits:** React 300 lines, page.tsx 100, lib 500, hooks 300.
- **Listen the first time something is reported broken.** No cirkulær troubleshooting.
- **Manual debugging** (chat-to-terminal copy-paste) er allowed as last resort.

---

## 11. STATUS PR. 19. APRIL 2026

- MVP Launch-Ready tag pushed (642 tests)
- Sprint 13c complete: Homepage intro-video live
- 30-dages voidexa milestone nået
- Card art: 1000 prompts v2 færdige, LoRA training næste (separat chat)
- Shop art: 400 prompts færdige, shop ships kan renderes nu, resten venter på gameplay
- Game: Denne chat's scope

---

## 12. SEPARATE PARALLELLE SPOR (ikke denne chats ansvar)

**LoRA training for card art** — separat chat. Jix samler 20-30 reference-billeder (Marvel Snap, Hearthstone: Mercenaries, Gwent, Star Realms, Magic sci-fi, Stellaris/EVE/Star Citizen concept art). Træner LoRA på Vast.ai H200. Derefter renderes 1000 kort i voidexa-stil.

**Shop renders** — kan starte når ship-skin system + cockpit system + battle board UI + osv. er bygget. Indtil da kan kun ~140 af 400 shop-items renderes (card backs, frames, titles, banners, profile items).

**Mulig Quantum-forespørgsel** — brug Quantum til at lave multi-AI debate om "hvordan laves TCG art uden mennesker når alle modeller bias'er mod mennesker?" Fodres med hele historikken (SDXL/Juggernaut/DreamShaper/FLUX resultater, prompts, LoRA-plan). Separat chat.

---

*Dette dokument erstatter behovet for at den nye chat laver research i tidligere chats. Den har alt den skal bruge til at starte test → debug → fix cyklen.*
