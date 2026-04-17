# MVP Launch Checklist — voidexa.com

Final pre-launch items the autonomous run could not verify. Tag
`mvp-launch-ready` indicates the codebase is in a known-good state;
this list is what Jix needs to confirm in production.

## Environment variables (Vercel production)
- [ ] `ANTHROPIC_API_KEY` — for VoidForge planner + Quantum Debate.
- [ ] `STRIPE_SECRET_KEY` — wallet top-ups + product checkout.
- [ ] `STRIPE_WEBHOOK_SECRET` — points at the `/api/wallet/webhook`
      endpoint (NOT the publishable key — see CLAUDE.md 2026-04-13
      for the post-mortem on this exact mistake).
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — client-side Stripe.js.
- [ ] `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- [ ] `SUPABASE_SERVICE_ROLE_KEY` — server-only API routes.
- [ ] `NEXT_PUBLIC_SITE_URL` — `https://voidexa.com` (no trailing newline).
- [ ] `TESTER_EMAILS` — comma-separated list including `tom@voidexa.com`.
- All values sanity-checked for trailing `\r\n` (paste artifacts).

## Stripe configuration
- [ ] Wallet webhook live at `https://voidexa.com/api/wallet/webhook`,
      event `checkout.session.completed`.
- [ ] Subscription webhook live at `https://voidexa.com/api/stripe/webhook`.
- [ ] Both webhook secrets in Vercel env (separate `STRIPE_WEBHOOK_SECRET`
      and optional `STRIPE_WALLET_WEBHOOK_SECRET`).
- [ ] Test top-up of $5 lands in `user_wallets` within 5 seconds.

## Supabase
- [ ] All migrations applied to production project (`ihuljnekxkyqgroklurp`).
- [ ] RLS policies enabled on `user_wallets`, `wallet_transactions`,
      `quantum_sessions`, `wrecks`, `quest_progress`.
- [ ] Admin policies grant access to `ceo@voidexa.com` only.

## Sounds
- [ ] 67 MP3s actually present in `public/sounds/` (gitignored, deploy
      via separate asset upload or Vercel build step that fetches them).
- [ ] Voiceover placeholder file `voiceover-home-placeholder.mp3` —
      currently silent. Replace once real VO is recorded.

## Models / 3D assets
- [ ] `public/models/` populated on Vercel (gitignored — needs separate
      asset CDN sync OR upload to Supabase Storage `models` bucket).
- [ ] `qs_bob.glb` accessible at `/models/glb-ready/qs_bob.glb` (used by
      Free Flight default ship).
- [ ] `shuttle-hero.png` deployed at `/images/shuttle-hero.png` (✅
      tracked in repo as of Sprint 8).

## Live verification (post-deploy)
- [ ] Homepage loads <2s on 3G simulated profile.
- [ ] `/freeflight` renders cockpit + ship without `useGLTF` warnings.
- [ ] `/starmap` Galaxy view renders all planet nodes.
- [ ] `/api/universe/landmarks?zone=outer_rim` returns ≥10 items.
- [ ] `/quantum/chat` accepts a guest session.
- [ ] Wallet top-up end-to-end (Stripe test card → balance update).
- [ ] 404 page renders at `/this-route-does-not-exist`.
- [ ] Error boundary catches a thrown error in dev mode.

## Lighthouse + perf (manual)
- [ ] Run Lighthouse mobile profile on `/`, `/products`, `/freeflight`.
- [ ] LCP <2.5s on `/` (shuttle hero is the LCP element).
- [ ] CLS <0.05 on every audited page.
- [ ] Total blocking time <300ms on `/`.

## Cross-browser
- [ ] Chrome (desktop + mobile)
- [ ] Safari (macOS + iOS — known `100vh` quirk to watch)
- [ ] Firefox (desktop)
- [ ] Edge (desktop)

## Accessibility (next sprint)
Not run this sprint:
- WCAG 2.1 AA color contrast check
- Keyboard navigation audit
- Screen reader pass (NVDA / VoiceOver)
- Tap target sizes (44×44 minimum)

## Tags + branches
- ✅ `sprint-12-complete`
- ✅ `mvp-launch-ready`
- All sprint tags on `main`. Push tags before Vercel rolls out.

## Roll-back plan
If anything looks bad post-deploy:
```
git tag rollback/mvp-broken-$(date +%Y%m%d)
git reset --hard sprint-11-complete
git push --force-with-lease origin main   # ← only with explicit Jix approval
```

## Post-launch monitoring (out of scope)
- Sentry / Posthog wiring for `console.error` from `app/error.tsx`.
- Stripe → Slack alerts for failed payments.
- Supabase usage dashboard — watch row count growth on `quantum_sessions`.
