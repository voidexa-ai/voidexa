SPRINT 14B — QUANTUM TOOLS NAV REPORT
======================================

Status: success

Files modified:
- components/layout/Navigation.tsx
- tests/nav-quantum-tools.test.ts (new)

New dropdown: Quantum Tools
Position: between Products and Universe (verified by test ordering both group labels in source)
Items:
  1. Void Chat     → /void-chat
  2. Quantum Chat  → /quantum/chat
  3. Quantum Forge → https://forge.voidexa.com (new tab, target="_blank", rel="noopener noreferrer", external: true)

Implementation notes:
- NavLink interface gained optional `external?: boolean` flag (non-breaking, defaults to internal route behavior).
- Desktop dropdown and mobile hamburger menu both render plain `<a>` with target="_blank" + rel="noopener noreferrer" when `external: true`; otherwise keep `<Link>` + localizeHref. External items skip active-route highlighting and show a small `↗` glyph.
- Products dropdown untouched. Universe dropdown untouched (still Star Map, voidexa System, Free Flight, Shop, Cards, Achievements, Assembly Editor, Break Room).
- Mobile hamburger menu: verified by source-inspection tests (same NAV_GROUPS config drives both breakpoints; external branch added to mobile submap as well).

Mobile menu: verified (data-driven NAV_GROUPS flows into both desktop + mobile renderers; new `external` branch landed in both)
Tests: 728/728 passing — baseline 718 → +10 new in tests/nav-quantum-tools.test.ts (ran `npm test` locally, all 60 suites green)
Build: clean (`npm run build` succeeded, all prerendered routes intact, /void-chat + /void-chat/[conversationId] + /void-chat/pricing present as ƒ dynamic as before)
Lint: no new errors introduced by this sprint — error count 152 before and 152 after the commit (all pre-existing in scripts/, lib/voidforge/, and two pre-existing useEffect setState warnings in Navigation.tsx that predate this change)

Commit: 637a4d7 feat(sprint-14b): add Quantum Tools nav dropdown (Void Chat, Quantum Chat, Quantum Forge)
Deploy: pushed to origin/main; Vercel auto-deploy triggered. https://voidexa.com returned HTTP/1.1 200 OK on post-push curl.
Tag: sprint-14b-complete pushed to origin (backup tag backup/pre-sprint-14b-20260418 also pushed at sprint start).

Known side effects: none expected (purely additive — added one NavGroup entry + a single optional field on NavLink + a conditional external branch in the two renderers)

Verification checklist for Jix:
- Open https://voidexa.com → top nav shows Home, Products, Quantum Tools, Universe, About.
- Hover Quantum Tools → dropdown lists Void Chat, Quantum Chat, Quantum Forge in that order.
- Click Void Chat → navigates to /void-chat (same tab).
- Click Quantum Chat → navigates to /quantum/chat (same tab).
- Click Quantum Forge → opens https://forge.voidexa.com in a new tab (rel noopener).
- Resize to mobile, open hamburger → Quantum Tools expands to show the same 3 items with the same behavior.

Next sprints (NOT in 14b scope):
- 14c: Exploration encounter dismissible modals
- 14d: Audio event wiring
- 14e: Realtime subscriptions
