# SHOP TEST CHECKLIST
## Last 4-5 days of builds — use this to verify Shop features

Test live at https://voidexa.com/shop and https://voidexa.com/shop/packs

Every item traces to a real commit. Mark each ❓ → ✅ / ❌ / ⚠️ with evidence.

---

## Price display (GHAI conversion)

### [ ] 1. All product card prices show as GHAI (not USD)
- **Origin:** Sprint 13d — commit `0cf0d22` (feat(sprint-13d): global GHAI nav balance + shop GHAI prices + mission payout REST)
- **Route:** `/shop`
- **Look for:** Prices like "300 GHAI", "150 GHAI", "199 GHAI" on every tile
- **Should NOT see:** "$3.00", "$1.50", "$1.99"
- **Test file:** `tests/ghai-format.test.ts` (11 cases on `formatCentsAsGhai`)
- **Implementation:** `components/shop/ShopPage.tsx:87-89` `formatPrice(cents)` → `formatCentsAsGhai`

### [ ] 2. Starter Pack banner price renders as GHAI
- **Origin:** Sprint 13d — commit `0cf0d22`
- **Route:** `/shop` (top "NEW PILOT BUNDLE" banner)
- **Look for:** Big `199 GHAI` number + button text `BUY · 199 GHAI`
- **Should NOT see:** `$1.99`, `COMING SOON · STRIPE`
- **Implementation:** `components/shop/ShopPage.tsx:673-708` uses `formatUsdAsGhai(1.99)`

### [ ] 3. 1 USD = 100 GHAI conversion holds across the grid
- **Origin:** Sprint 13d — commit `0cf0d22`
- **Route:** `/shop`
- **Look for:** A $3 item labelled 300 GHAI, a $1.50 item labelled 150 GHAI, a $4.99 item labelled 499 GHAI
- **Test file:** `tests/ghai-format.test.ts` (asserts `USD_TO_GHAI = 100`)
- **Manual verification only** for on-screen rendering

---

## Starter Pack banner (active purchase flow)

### [ ] 4. Starter Pack button is active (not Coming Soon)
- **Origin:** Sprint 13d — commit `0cf0d22`
- **Route:** `/shop`
- **Look for:** Active cyan/purple gradient button reading `BUY · 199 GHAI`
- **Action:** Click while signed out → nothing visible (silent).
- **Action:** Click while signed in with empty balance → network tab shows POST `/api/wallet/deduct`; 402 response dispatches `voidexa:topup-required` event
- **Implementation:** `components/shop/ShopPage.tsx:677-709`
- **Manual verification only** (no automated test)

### [ ] 5. Starter Pack banner uses cyan/purple glow treatment
- **Origin:** Sprint 3 baseline — commit `8dfaa88` (feat: shop UI + achievement panel + unified client progress store), retained through Sprint 13d
- **Route:** `/shop`
- **Look for:** Banner with cyan→purple linear gradient, 32px cyan outer glow, "NEW PILOT BUNDLE" cyan eyebrow text above "STARTER PACK" title
- **Manual verification only**

---

## Tab navigation

### [ ] 6. Tab bar shows the correct 7 tabs in order
- **Origin:** Sprint 3 + Round B polish — commit `4eb1efe` (feat: Round B polish (shop All, homepage sections, galaxy footer, achievements, white paper, starter ships)); revised by Sprint 13d commit `0cf0d22`
- **Route:** `/shop`
- **Look for (left → right):** `ALL`, `FEATURED`, `SHIPS`, `SKINS`, `TRAILS`, `CARD PACKS`, `COCKPITS`
- **Implementation:** `components/shop/ShopPage.tsx:69-81` `buildTabs()`
- **Manual verification only**

### [ ] 7. "ALL" tab is the default landing tab
- **Origin:** Round B polish — commit `4eb1efe`
- **Route:** `/shop` (fresh load)
- **Look for:** `ALL` tab highlighted cyan on first paint; grid populated immediately (not empty)
- **Implementation:** `components/shop/ShopPage.tsx:534` `useState<TabKey>('all')`
- **Manual verification only**

### [ ] 8. Each category tab filters the grid correctly
- **Origin:** Sprint 4 — commit `2eb451d` (feat(sprint4): shop expansion — Racing, Combat, Pilot, Premium tabs); audit round — commit `32a0782`
- **Route:** `/shop`
- **Action:** Click SHIPS → only Ship Skin items; SKINS → only Attachment items; TRAILS → only Trail items; CARD PACKS → only CardPack items; COCKPITS → only CockpitTheme items
- **Manual verification only**

### [ ] 9. Page counter resets when switching tabs
- **Origin:** Round B polish — commit `4eb1efe`
- **Route:** `/shop`
- **Action:** On ALL, click `Next →` to page 2 → click SHIPS → counter shows `1 / N` (not `2 / N`)
- **Implementation:** `components/shop/ShopPage.tsx:551` `useEffect(() => { setPage(0) }, [activeTab])`
- **Manual verification only**

---

## Daily Featured + Limited Edition shelves

### [ ] 10. "FEATURED" tab shows the Daily Featured banner
- **Origin:** Sprint 3 baseline + Round B — commit `4eb1efe`
- **Route:** `/shop` → click `FEATURED` tab
- **Look for:** Section headed "Daily Featured" with cyan `border-left`, 1–2 large hero cards with 16:9 hero image, per-item cyan glow
- **Implementation:** `components/shop/ShopPage.tsx:749-932`
- **Manual verification only**

### [ ] 11. Daily Featured shows a countdown to UTC midnight
- **Origin:** Round B polish — commit `4eb1efe`
- **Route:** `/shop` → `FEATURED`
- **Look for:** Right-aligned label "Resets in" + cyan glowing HH:MM:SS counter that ticks each second
- **Implementation:** `components/shop/ShopPage.tsx:97-110` `useCountdownToUtcMidnight()`
- **Manual verification only**

### [ ] 12. "Limited Edition" strip appears on Featured tab when active
- **Origin:** Sprint 3 baseline — commit `ad6eb41` (assets: 59 ship/weapon/cockpit renders for shop + cards)
- **Route:** `/shop` → `FEATURED`
- **Look for:** Section headed "LIMITED EDITION" with amber `border-left` + amber glow; every tile carries an amber `LIMITED` chip top-left
- **Implementation:** `components/shop/ShopPage.tsx:935-961`
- **Manual verification only**

---

## Item grid rendering

### [ ] 13. Static preview PNGs render for mapped items (no WebGL canvas in grid)
- **Origin:** Render asset import — commit `ad6eb41`
- **Route:** `/shop`
- **Look for:** Skin/ship/cockpit/weapon tiles show static PNG heroes with rarity-tinted drop-shadow (no canvas context exhaustion, no "placeholder geometry")
- **Implementation:** `components/shop/ShopPage.tsx:55-65` `ITEM_IMAGE` map
- **Manual verification only**

### [ ] 14. Un-mapped items fall back to SVG geometric shapes
- **Origin:** Sprint 3 baseline — commit `8dfaa88`
- **Route:** `/shop`
- **Look for:** Items without a render (e.g. Trail items) draw a rarity-colored SVG primitive with glow halo
- **Implementation:** `components/shop/ShopPage.tsx:113-174` `CategoryShape`
- **Manual verification only**

### [ ] 15. Rarity borders + glows render correctly
- **Origin:** Sprint 3 baseline — commit `8dfaa88`
- **Route:** `/shop`
- **Look for:** Common = slate, Uncommon = green, Rare = blue, Epic = purple, Legendary = amber. Border + outer box-shadow recolored per tile. Hover = `translateY(-3px)` + stronger glow.
- **Implementation:** `components/shop/ShopPage.tsx:22-28` `RARITY_COLOR`, `:180-316`
- **Manual verification only**

### [ ] 16. Pagination controls appear when > 8 items in a tab
- **Origin:** Audit round — commit `32a0782`
- **Route:** `/shop` → `ALL`
- **Look for:** `← Prev` / `Next →` pills, page counter `1 / N`, prev disabled on first page, next disabled on last
- **Implementation:** `components/shop/ShopPage.tsx:989-1045`, `PAGE_SIZE = 8` at `:83`
- **Manual verification only**

---

## Item modal

### [ ] 17. Clicking a product opens the detail modal
- **Origin:** Sprint 3 baseline — commit `8dfaa88`
- **Route:** `/shop`
- **Action:** Click any tile → modal centered with glass backdrop (rgba(2,4,14,0.92) + blur 14px)
- **Look for:** Left panel 3D model or SVG; right panel rarity + category + name + description + price; close via ✕ or Escape or click-outside
- **Implementation:** `components/shop/ShopPage.tsx:318-528` `ItemModal`
- **Manual verification only**

### [ ] 18. Modal loads live 3D preview for mapped items
- **Origin:** Render asset import — commit `ad6eb41` + Supabase CDN migration `5a24aa4` (feat: move .glb model hosting to Supabase Storage)
- **Route:** `/shop` → click Crimson Fighter / Chrome Cruiser / Obsidian Stealth / Void Legend / Carbon cockpit
- **Look for:** Rotating .glb model inside modal's left panel (OrbitControls enabled, rotate speed 0.25)
- **Implementation:** `components/shop/ShopPage.tsx:44-51` `ITEM_MODEL`, `:365-367` `ShopItemPreviewCanvas`
- **Manual verification only**

### [ ] 19. Card Pack items show parsed content list in modal
- **Origin:** Sprint 3 baseline — commit `8dfaa88`
- **Route:** `/shop` → open any CardPack item
- **Look for:** Cyan-bordered content box titled "Pack Contents" with bulleted list parsed from description
- **Implementation:** `components/shop/ShopPage.tsx:91-95` `parseCardPackContents`, `:446-474`
- **Manual verification only**

### [ ] 20. Modal "Coming Soon · Stripe" CTA is intentionally disabled
- **Origin:** Sprint 3 baseline — commit `8dfaa88`; design decision retained through Sprint 13d
- **Route:** `/shop` → open any non-Starter Pack item
- **Look for:** Button `COMING SOON · STRIPE` with `cursor: not-allowed`, `opacity` reduced, rarity-tinted gradient — this is known deferred state (individual item purchases wired in a later sprint)
- **Implementation:** `components/shop/ShopPage.tsx:506-522`
- **Manual verification only**

---

## Sub-route — `/shop/packs` (Booster Packs)

### [ ] 21. `/shop/packs` route renders three tiered pack cards
- **Origin:** Sprint 3 — commit `3eddef6` (feat(sprint3): booster pack shop with Mythic supply tracking)
- **Route:** `/shop/packs`
- **Look for:** Three cards: `Standard Pack` (cyan, 100 GHAI), `Premium Pack` (purple, 300 GHAI), `Legendary Pack` (amber, 1000 GHAI)
- **Implementation:** `lib/game/packs/types.ts:27-55` `PACK_DEFS`
- **Test file:** `lib/game/packs/__tests__/rollPack.test.ts`
- **Manual verification only** for rendered UI

### [ ] 22. Balance strip shows "YOUR BALANCE — N GHAI"
- **Origin:** Sprint 3 — commit `3eddef6`
- **Route:** `/shop/packs`
- **Look for:** Header balance row reading `YOUR BALANCE` + GHAI total (placeholder `…` while fetching, `0 GHAI` for new users)
- **Implementation:** `components/shop/PackShopClient.tsx:82-86`
- **Manual verification only**

### [ ] 23. Pack open requires sign-in
- **Origin:** Sprint 3 — commit `3eddef6`
- **Route:** `/shop/packs` (signed out)
- **Action:** Click Open on any tier → error banner `Sign in to open packs.`
- **Implementation:** `components/shop/PackShopClient.tsx:39`
- **Manual verification only**

### [ ] 24. Pack open rejects when GHAI balance < pack price
- **Origin:** Sprint 3 — commit `3eddef6`
- **Route:** `/shop/packs` (signed in, empty wallet)
- **Action:** Click Open Standard → error `Need 100 GHAI. You have 0.`
- **Implementation:** `components/shop/PackShopClient.tsx:41`
- **Manual verification only**

### [ ] 25. Pack open deducts balance + reveals cards with animation
- **Origin:** Sprint 3 — commit `3eddef6`
- **Route:** `/shop/packs` (signed in, sufficient GHAI)
- **Action:** Click Open → POST `/api/shop/open-pack` → `PackOpeningAnimation` plays with 5 cards revealing in sequence
- **Look for:** Balance decrements atomically; Mythic pulls trigger distinct golden burst
- **Implementation:** `components/shop/PackShopClient.tsx:44-69`, `PackOpeningAnimation.tsx`
- **Test file:** `lib/game/packs/__tests__/rollPack.test.ts` (pack roll logic)
- **Manual verification only** for UI animation

### [ ] 26. Mythic chance = 0.1% on best slot of every pack
- **Origin:** Sprint 3 — commit `3eddef6`
- **Route:** `/shop/packs` (subtitle copy)
- **Look for:** Subtitle text `Every pack has a 0.1% Mythic chance in its best slot.`
- **Implementation:** `lib/game/packs/types.ts:60` `MYTHIC_CHANCE = 0.001`
- **Test file:** `lib/game/packs/__tests__/rollPack.test.ts`
- **Manual verification only** for copy

### [ ] 27. Back link to `/shop` is visible top-left
- **Origin:** Sprint 3 — commit `3eddef6`
- **Route:** `/shop/packs`
- **Look for:** `← Shop` link; click returns to `/shop`
- **Implementation:** `components/shop/PackShopClient.tsx:75`
- **Manual verification only**

---

## Cosmetic catalog (Sprint 4 data)

### [ ] 28. Sprint 4 cosmetic catalog contains 19 items across 4 categories
- **Origin:** Sprint 4 — commit `2eb451d`
- **File:** `lib/game/shop/catalog.ts`
- **Look for:** Racing (5 items, 300–1200 GHAI), Combat (5 items, 200–900 GHAI), Pilot (5 items, 300–800 GHAI), Premium (4 items, 1500–5000 GHAI)
- **Test file:** `lib/game/shop/__tests__/catalog.test.ts`
- **Source-inspection only** — catalog shipped as data; UI surface for these tabs rendered via `ShopTabs.tsx` / `ShopCosmeticsClient.tsx` / `CosmeticTab.tsx`

### [ ] 29. Named Asteroid premium item (5000 GHAI, permanent) exists in catalog
- **Origin:** Sprint 4 — commit `2eb451d`
- **File:** `lib/game/shop/catalog.ts:165-170`
- **Look for:** Item id `premium_named_asteroid`, price 5000 GHAI, "One per pilot"
- **Source-inspection only**
