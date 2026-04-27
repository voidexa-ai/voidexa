# Wishes Pending — Repo-side Tracking

Repo-side mirror of cross-sprint follow-up items.

Each entry:
- States what was deferred and why
- Names the sprint that deferred it
- Names the sprint or condition that should pick it up
- Carries seed content forward when ready

The Project Knowledge `09_WISHES_PENDING.md` is the master index across
all surfaces (repo + chats + sketches). This repo-side file is the
companion that travels with the code so seed content does not get lost
between sprints.

---

## FAQ surface for GHAI vs DKK/EUR (deferred from AFS-6b)

**Status:** deferred
**Deferred by:** AFS-6b (Real-world GHAI Commerce UX)
**Pick up after:** AFS-6c (Shop v1 catalog) — FAQ surface to be built
post-Shop, location TBD (own `/faq` route vs section inside `/help`
vs floating help-modal — decision lives with AFS-6c scoping)

### Why deferred

No FAQ route exists in the app today. Pre-flight grep on 2026-04-27
confirmed: no `app/faq/`, no `app/dk/faq/`, no `components/faq/`,
no FAQ entries in any existing route. Building a new FAQ surface
inside AFS-6b would double sprint scope and split copy decisions
across two sprints. SKILL v2 explicitly defers Task 4 to a follow-up.

### Seed content (3 Q&A — drop in when FAQ surface lands)

**Q1:** Can I pay for AEGIS / Comlink / Website Builder / Consulting with GHAI?

**A1:** No. Real-world products use DKK or EUR via Stripe and include
2-year Danish reklamationsret. GHAI is for in-game purchases and
pay-per-use AI services only.

---

**Q2:** What is the difference between Void Chat and Ghost AI?

**A2:** Void Chat is an in-game AI assistant accessed inside voidexa.com
gameplay. Ghost AI Services (paid in GHAI tokens) refers to pay-per-use
AI products including Quantum Chat debates. They are billed and
accessed differently.

---

**Q3:** Why is GHAI not accepted for real-world products?

**A3:** GHAI is a virtual currency for digital in-game and AI-service
purchases. Danish consumer law (reklamationsret) requires real-world
product transactions in legal tender (DKK or EUR), which we process
directly through Stripe.

### DK translations

Defer to AFS-26 (full DK i18n rebuild). Until then, when FAQ surface
ships, the EN copy renders on `/dk/faq` via the same component-reuse
pattern as `/dk/services` and `/dk/wallet`.

### Cross-references

- Locked copy source: `components/shop/RealWorldPaymentNotice.tsx`
- Locked copy source: `components/wallet/WalletPageClient.tsx` (GHAI scope clarification section)
- Updated contact pills: `app/contact/page.tsx`, `components/GetInTouchModal.tsx`
- AFS-6b SKILL v2: `skills/AFS-6b-realworld-ghai-ux/SKILL.md`
