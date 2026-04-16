---
name: ghai-compliance-fix
description: Urgent scrub of GHAI token specifics from the voidexa White Paper page after Round B CC-A7 accidentally reintroduced supply numbers, mint/burn mechanics, and "utility token" framing. Use this skill when fixing GHAI compliance issues on /white-paper, /home, /ghost-ai, /token, /station, /claim-your-planet, /apps, or any page that mentions GHAI amounts or token mechanics. Triggers on "GHAI compliance", "token scrub", "pending legal review", "MiCA compliance", "ADVORA review", or "V-Bucks GHAI" in voidexa context.
---

# GHAI Compliance Fix — Pre-ADVORA Launch Scrub

## Context
Voidexa has not received legal clearance from ADVORA (Danish crypto lawyer Niels Gade-Jacobsen) regarding MiCA compliance for GHAI. Until that clearance arrives, the public-facing site must treat GHAI purely as a platform credit (V-Bucks model), not as a token with specific economic properties.

Previous scrub in commit a7f30cc (April 11-12) removed all specific amounts and promises. Round B CC-A7 (April 16) accidentally reintroduced them in the White Paper page. This skill fixes that regression.

## The Compliance Framing (memory #24, April 16)

GHAI is marketed as:
- **Platform currency** (think Fortnite V-Bucks)
- **$1 = 100 GHAI fixed rate** (no market price, no DEX reference)
- Used for paying for voidexa AI services (Void Chat, VoidForge, Quantum)
- Purchasable via Stripe subscriptions (Pilot $9.99/1500 GHAI, Commander $24.99/5000 GHAI)
- Any reference to blockchain is tentative: "blockchain integration being explored with legal advisors"

## Files to Edit

### Primary fix: `app/white-paper/WhitePaperPageClient.tsx`

**Remove ALL of the following:**
- "700,000,000 Total Supply" stat card
- "200M Minted + Distributed" stat card
- "300M Burned Permanently" stat card
- "Utility · Token Type — Platform Currency" label
- "It is not a security, not an investment vehicle, and not listed on any public exchange"
- "utility model behind GHAI"
- Any reference to "Token" as a standalone noun
- Any reference to tokenomics, burn, mint, supply, distribution

**Replace the GHAI section with:**

```tsx
// GHAI Section
<section className="ghai-section">
  <div className="ghai-orb">
    {/* Keep existing SVG orb animation */}
  </div>
  
  <div className="ghai-label">PLATFORM CURRENCY · GHAI</div>
  <h2>Ghost AI (GHAI)</h2>
  
  <p className="ghai-description">
    GHAI is the platform currency of the voidexa ecosystem — similar in concept 
    to in-game currencies you may have used elsewhere. GHAI is earned or purchased 
    in fixed increments and spent inside voidexa to unlock AI compute, priority 
    access, and seasonal content.
  </p>
  
  <div className="ghai-simple-stats">
    <div className="stat">
      <div className="stat-value">$1 = 100 GHAI</div>
      <div className="stat-label">Fixed exchange rate</div>
    </div>
    <div className="stat">
      <div className="stat-value">Platform credit</div>
      <div className="stat-label">Not an investment vehicle</div>
    </div>
    <div className="stat">
      <div className="stat-value">In-ecosystem only</div>
      <div className="stat-label">Used for voidexa services</div>
    </div>
  </div>
  
  <div className="ghai-legal-notice">
    <div className="notice-heading">Blockchain integration under review</div>
    <p>
      voidexa is exploring blockchain integration for GHAI with legal advisors 
      in Denmark. Mechanics, technical infrastructure, and distribution details 
      will be disclosed only after regulatory review is complete. Until then, 
      GHAI functions exclusively as a platform credit within voidexa products.
    </p>
  </div>
</section>
```

**Replace the "In the full paper" section with:**

```tsx
<section className="full-paper-preview">
  <h2>In the full paper</h2>
  
  <div className="paper-sections">
    <div className="section-card">
      <h3>Platform economy</h3>
      <p>How GHAI moves through voidexa products — earning, spending, and seasonal cycles. Details finalized post legal review.</p>
    </div>
    
    <div className="section-card">
      <h3>Roadmap</h3>
      <p>Product launches, platform milestones, and seasonal content drops.</p>
      <a href="/station">See Station →</a>
    </div>
    
    <div className="section-card">
      <h3>Partners</h3>
      <p>Integrations, data providers, and channel partners. Announcements coming soon.</p>
    </div>
    
    <div className="section-card">
      <h3>Technology Stack</h3>
      <p>Quantum debate engine, KCP-90 compression protocol, voidexa.com surface. All sovereign, all in-house.</p>
    </div>
  </div>
</section>
```

### Secondary checks: Search these files for leakage

Run a grep across the codebase for patterns that shouldn't appear:

```bash
# Search for specific numbers that should not appear in public-facing pages
grep -rn "700,000,000\|700000000\|300M burned\|200M minted\|1 billion" app/ components/ --include="*.tsx" --include="*.ts"

# Search for problematic framing
grep -rn "cryptocurrency\|crypto token\|token supply\|tokenomics\|burn mechanics" app/ components/ --include="*.tsx" --include="*.ts"
```

For any hits found in public-facing files (app/**/page.tsx, components that render on public pages), replace with platform-credit framing.

**Internal files OK to leave alone:**
- `lib/ghai/*` (infrastructure)
- `app/api/ghai/*` (backend)
- `config/*` (server-side)
- `types/credits.ts` (type definitions)
- Game engine files (internal mechanics)

### Additional page check — /ghost-ai

This page is known to have had GHAI content. Verify it still says:
- "Pioneer Rewards" (not "Earn GHAI")
- "Token rewards structure pending legal review"
- "GHAI integration coming soon — subject to regulatory approval"

If any specific amounts slipped back in, replace with generic "coming soon" language.

### /home GHAI card

Should say "Coming Soon" — verify it still does.

### /claim-your-planet

Should say:
- "$500 deposit / $50/month USD" (OK to keep)
- "Pioneer benefits — details shared during onboarding, subject to regulatory approval" (OK)
- NO specific GHAI grant amounts (check)
- NO vesting schedules

## Success Criteria

After fix, running this search should return ZERO hits in public-facing files:

```bash
grep -rn "700,000,000\|700M\|300M\|200M" app/white-paper/ app/home/ app/ghost-ai/ app/token/ app/claim-your-planet/
```

Chrome-visible text on /white-paper should:
- ✅ Show GHAI as "platform currency"
- ✅ Show "$1 = 100 GHAI" fixed rate
- ✅ Show "Blockchain integration under review"
- ❌ NOT show any specific supply numbers
- ❌ NOT show burn/mint mechanics
- ❌ NOT use the word "cryptocurrency" or "crypto"
- ❌ NOT reference exchange listings

## Build & Deploy

```bash
git add -A && git commit -m "legal: re-scrub GHAI specifics from White Paper — V-Bucks framing only pending ADVORA"
git push origin main
```

Vercel auto-deploys. Verify live at voidexa.com/white-paper.

## Report Back

After completion:
1. Which files were modified
2. What specific text was removed
3. Confirm grep returns zero hits for banned patterns
4. Deployment status

## Legal Context (Background)

ADVORA (Niels Gade-Jacobsen) received formal letter requesting MiCA compliance review. Until their guidance arrives, voidexa treats GHAI as:

**Internal reality:** Solana SPL token exists, contract `Ch8Ek9PTbzSGdL4EWHC2pQfPq2vTseiCPjeZsAZLx5gK`, 1B supply, 300M burned, 200M on Ledger, 50M in Raydium pool. Mint authority revoked.

**Public reality (until launch):** Platform credit, $1 = 100 GHAI, used inside voidexa, blockchain integration being explored.

The two realities will merge only after ADVORA provides legal clearance and we're ready to launch the on-chain component publicly. Until then, the public face is V-Bucks.

**NEVER:**
- Share contract address publicly
- Reference DEX prices
- Publish supply numbers
- Discuss tokenomics mechanics
- Link to Solscan/DexScreener
- Offer token rewards with specific amounts
