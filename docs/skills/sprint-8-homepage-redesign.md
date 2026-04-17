---
name: sprint-8-homepage-redesign
description: Replace the homepage star-map intro with a shuttle parallax hero + 4 product panels
sprint: 8
status: pending
---

## Inputs
- `public/images/shuttle-hero.png` — 2.5MB hero plate (verified).
- `docs/gpt_keywords_homepage.md` — **corrupt** (PowerShell artifact). Falling back
  to the 4 panel headings supplied in the run prompt + inferred sub-keywords pulled
  from existing voidexa context (CLAUDE.md, products page, About).

## Panel content (fallback inferred from prompt + repo context)
1. **Website Creation**
   - "From sketch to live in days." Modular Next.js + Tailwind sites, three-tier pricing,
     deploy on Vercel Pro. CTA → `/products` Website tier.
2. **Custom Apps**
   - "Bespoke web tools for the Nordic SMB sector." Quantum Debate, Wallet, KCP
     billing rails. CTA → `/apps`.
3. **Universe**
   - "Step into the voidexa galaxy." Free Flight, card combat, claim-your-planet
     ecosystem. CTA → `/starmap` + `/freeflight`.
4. **Tools**
   - "Internal accelerators." VoidForge, ship tagger, scaffold mode (Quantum).
     CTA → `/admin/ship-tagger` (or `/voidforge` if public-safe).

## Deliverables
1. **Hero**
   - `components/home/ShuttleHero.tsx` — full-viewport CSS parallax (no Three.js).
     `background-attachment: fixed` fallback + IntersectionObserver translateY for
     mobile. Image `next/image` priority load.
   - `<h1>` "voidexa — engineered for the void"
   - Subhead 16px+, voiceover audio placeholder `<audio>` referencing
     `/sounds/voiceover-home-placeholder.mp3` (silent file ok if asset not present).
2. **Panels grid**
   - `components/home/ProductPanels.tsx` — 4 glassmorphism cards in 2×2 (desktop)
     / stacked (mobile <768px).
   - Each card: icon (lucide-react), title, 2-line desc, CTA button.
3. **Page wire**
   - `app/page.tsx` (or current home component) renders `<ShuttleHero />` then
     `<ProductPanels />`. Star map preserved further down OR moved to `/starmap`
     (decision: keep on home below the panels per existing CLAUDE.md "/" route rule).
4. **Voiceover hook**
   - `lib/sound/voiceover.ts` — single-shot play on first user interaction
     (browser autoplay policy). Mute respected.

## Plan
1. Backup tag.
2. Read current `app/page.tsx` + `components/home/HomePage.tsx` to understand current
   structure (Sprint 5 audit touched it — see CLAUDE.md font fixes).
3. Build hero + panels components. Font minima 16/14, opacity ≥0.5.
4. Insert above existing home content; do not delete star map (it is Level 2 anchor).
5. Mobile: stacked, hero 70vh not 100vh.
6. `npx next build` + visual sanity (header→hero→panels→starmap order).
7. Commit, tag `sprint-8-complete`, push.

## Gates
- LCP element = hero image. `next/image` priority + sizes attribute set.
- No layout shift between hero and first panel (CLS ≤0.05 in build report if available).
- All 4 panels reachable on mobile by scroll.
