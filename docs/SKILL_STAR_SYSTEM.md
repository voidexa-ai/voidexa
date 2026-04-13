# SKILL.md — voidexa Star System

## Formål
Denne skill definerer hvordan en agent skal arbejde på voidexa Star System — det multi-level 3D galaxy ecosystem hvor virksomheder claimer planeter og handler med hinanden via GHAI.

## Hovedregel
Agenten skal altid:
1. Læse `docs/STAR_SYSTEM_SPEC.md` inden noget bygges
2. Bevare det eksisterende star map som Level 2 for voidexa
3. Matche voidexa's eksisterende dark space æstetik
4. Levere komplette filer, ikke fragmenter
5. Git backup før og commit efter hvert build

## Arkitektur

### Tre niveauer
- **Level 1 — Galaxy View:** Alle company-planeter synlige. voidexa som central sol. Sektorer/constellations. Claim Your Planet ved kanten.
- **Level 2 — Company System:** Klik en planet → enter dens interne system. Produkter/services som orbiterende planeter. Trade routes synlige.
- **Level 3 — Planet Surface:** Klik produkt-planet → navigér til side. Eksisterer allerede.

### Økonomisk motor
- Service Mesh: planeter sælger API-services til hinanden via GHAI
- Gravity Score: dynamisk metrik der bestemmer planetstørrelse og synlighed
- Pioneer Rewards: tiered GHAI grants (10M/7M/5M/3M/1M) med vesting
- Pioneer Royalties: 2% af derivative services til original pioneer
- Governance: planet-ejere stemmer om ecosystem-retning

### Anti-clutter regler
- 1-20 planeter: vis alle som rigtige planeter
- 20-100: sector clustering, labels kun ved fokus
- 100-500: tre-lags abstraktion (sektor → marker → hero planet)
- Aldrig 500 labels på én gang
- Max synlig detail: 8-12 sektorer, 20-40 markers, 1 hero planet

## Build-rækkefølge
Byg ALT men aktivér features baseret på planet-antal:

### Byg nu (Phase 1-4)
1. Refactor eksisterende star map til reusable CompanySystemScene
2. Galaxy View MVP med voidexa center, sektorer, company markers
3. Warp transitions mellem Level 1 og Level 2
4. Claim Your Planet side med komplet ecosystem forklaring
5. Supabase tabeller (companies, services, trade_routes, gravity_events, osv.)
6. Directory/list view som alternativ navigation

### Aktivér ved 5+ planeter (Phase 5)
- Service Mesh marketplace
- GHAI betalinger for inter-planet API calls

### Aktivér ved 10+ planeter (Phase 6-7)
- Live Gravity Score
- Trade routes visuelt på star map

### Aktivér ved 20+ planeter (Phase 8-10)
- Governance stemmer
- Pioneer Royalties
- Quantum staking, KCP-90 licensing, Orbital Slot auctions

## Tekniske krav

### Three.js
- Én renderer, én app shell
- Scene manager swapper aktive scene groups
- InstancedMesh for 500+ planet markers
- LOD tiers: far=point, mid=glow marker, near=full mesh
- Frustum culling
- Labels kun for hovered/selected/searched

### Supabase
- 9 tabeller defineret i STAR_SYSTEM_SPEC.md Part 3
- Real-time subscriptions for live Gravity Scores
- RLS på alle tabeller

### React
- Zustand for state management
- Komponent-hierarki defineret i STAR_SYSTEM_SPEC.md Part 4

## Visuelle regler
- Background: dark gradients (#0d0a1f → #060412)
- Primary accent: cyan (#00d4ff)
- Secondary: purple (#a855f7)
- Planet farver: unikke brand colors med cyan rim-light
- Trade routes: cyan/teal pulse
- Minimum font: 16px body, 14px labels, opacity minimum 0.5
- Mobile: top=simplified 3D, bottom=searchable directory

## Transition design
- Level 1 → 2: warp-lock zoom (~1.6s) med starfield stretch
- Level 2 → 1: reverse pull-back (~1.2s)
- Sektor fokus: camera dolly + dim non-selected til 15-20%

## Claim Your Planet siden
Skal indeholde komplet ecosystem forklaring:
- Infrastructure bundle (Quantum, KCP-90, Supabase, deployment)
- Service Mesh (sælg services, tjen GHAI)
- Gravity Score (hvad det måler, hvad det påvirker)
- Pioneer Rewards (tiered tabel med GHAI grants)
- Inter-planet commerce flow (70/15/15 split)
- Governance
- Pricing ($500 deposit, $50/month)
- FOMO sektion (hvorfor join tidligt)
- CTA med 10 pioneer slots

## Røde linjer
Agenten må IKKE:
- Fjerne eller ødelægge det eksisterende star map
- Introducere en anden token end GHAI
- Bygge planet-claiming der kræver on-chain transactions (Supabase + manual onboarding i v1)
- Vise priser der ikke matcher STAR_SYSTEM_SPEC.md
- Gøre Service Mesh obligatorisk for planet-ejere
- Bygge governance features før 20+ planeter eksisterer

## Leveranceformat
1. Kort designbeslutning
2. Fulde filer
3. Build/run kommandoer
4. Verificeringstrin
5. Kendte begrænsninger

## Definition of done
- Filer er komplette og køreklare
- Matcher voidexa's eksisterende æstetik
- Git committed
- Deployed via npx vercel --prod
- Claim Your Planet side forklarer hele ecosystem'et
- Eksisterende star map fungerer stadig som Level 2
