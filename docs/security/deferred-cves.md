# AFS-6g Deferred CVE Register

**Sprint:** AFS-6g (Battle Scene v2 + Universal Skybox + Security Sweep)
**Date:** 2026-04-25
**Audit baseline:** `npm audit` — 27 vulnerabilities (24 moderate, 3 high)
**Disposition:** All 27 deferred this sprint. Rationale below.
**Supersedes:** `docs/SECURITY_DEFERRED.md` (Sprint 13F register, still authoritative for technical detail; this file records the AFS-6g re-evaluation outcome only).

---

## Decision

| Severity | Count | This sprint | Reason |
|---|---|---|---|
| Critical | 0 | — | None present. SKILL pre-flight count was wrong. |
| High | 3 | **Deferred** | Solana wallet chain. Code path not exploitable. ADVORA review pending. |
| Moderate | 24 | **Deferred** | Dev-only (vitest/vite/esbuild) or transitive Solana. No production runtime risk. |

`npm audit fix --force` was **not** run. Forcing fixes would either downgrade `@solana/spl-token` to a pre-API version (breaks `lib/ghai/balance.ts`) or major-bump `vitest@2 → 4` (breaks 1087-test suite under unverified Vitest 4 config).

---

## High-severity register (3)

All three trace to a single root advisory: **GHSA-3gc7-fjrx-p6mg** — `bigint-buffer` heap buffer overflow in `toBigIntLE`/`toBigIntBE`. npm counts the transitive packages (`@solana/buffer-layout-utils`, `@solana/spl-token`) as separate "high" entries because they inherit the unpatched dep.

### 1. `bigint-buffer` (root)

- **Advisory:** [GHSA-3gc7-fjrx-p6mg](https://github.com/advisories/GHSA-3gc7-fjrx-p6mg)
- **Current:** `bigint-buffer@1.1.5` (latest published — no patch upstream)
- **Fix path proposed by npm:** downgrade `@solana/spl-token` to `0.1.8` (pre-modern-API)
- **Disposition:** Deferred. No upstream patch exists yet; downgrade breaks `lib/ghai/balance.ts:5` (`getAssociatedTokenAddress`, `getAccount` are 0.4.x-only API).

### 2. `@solana/buffer-layout-utils` (transitive)

- **Inherits:** `bigint-buffer@1.1.5`
- **Disposition:** Deferred. Resolves automatically when (1) is patched.

### 3. `@solana/spl-token` (transitive)

- **Inherits:** `@solana/buffer-layout-utils` → `bigint-buffer@1.1.5`
- **Used at:** `lib/ghai/balance.ts:5` (read-only balance lookup)
- **Disposition:** Deferred. Resolves automatically when (1) is patched.

---

## Exploitability assessment (current build)

The `bigint-buffer` overflow triggers when `toBigIntLE`/`toBigIntBE` is called with attacker-controlled `Buffer` input.

voidexa call sites:
- `lib/ghai/balance.ts:5` — `getAccount(connection, ata)` reads a Solana RPC response, parses with library code. Input is RPC-returned bytes, not user-supplied.
- `lib/ghai/verify-deposit.ts:5` — `Connection.getParsedTransaction(sig)` reads chain data. Same RPC-only input pattern.
- `components/WalletProvider.tsx` — mounts Phantom + Solflare adapters. All buffer parsing happens against signed transactions returned by the user's own wallet extension, not arbitrary remote input.

**No user-controlled Buffer reaches `bigint-buffer`.** The overflow is not reachable in the current code paths.

---

## Project context

- **Crypto-GHAI is parked** — pending ADVORA / MiCA legal review. The Solana wallet chain stays mounted because `WalletProvider` is a global layout-level provider, but the user-facing crypto deposit/withdrawal flows are not exposed in the current production UI.
- **Platform-GHAI is the active currency** — Stripe top-up + `user_credits.ghai_balance_platform`. Does not touch any Solana code.
- The Solana CVE chain therefore has neither an exploitable path nor an active business surface that requires immediate patching.

---

## Moderate-severity register (24, summarised)

| Family | Count | Driver | Production risk |
|---|---|---|---|
| `vitest`/`vite`/`esbuild`/`vite-node`/`@vitest/mocker` | ~5 | Dev-server-only advisories (path traversal, cross-origin dev server) | None — vite/esbuild never run in production (Next.js + Vercel edge runtime) |
| `postcss <8.5.10` | 1 | XSS in CSS Stringify, propagates via `next` | Negligible — Next.js compile-time only, no untrusted CSS input |
| `uuid <14.0.0` (transitive via `rpc-websockets`, `jayson`, `@solflare-wallet/sdk`) | ~3 root + transitive | Buffer bounds check in v3/v5/v6 with provided `buf` | None — v4 (random) is the variant used in voidexa app code; transitive chain only on parked Solana |
| Solana wallet-adapter ecosystem inheritance | remainder | Inherit via `@solana/web3.js` → `rpc-websockets` → `uuid` | Same parked-crypto-GHAI rationale as the high-severity chain |

---

## Re-evaluation triggers

This deferral is revisited when **any** of the following occur:

1. `bigint-buffer` ships a patched release (resolves all 3 high)
2. ADVORA / MiCA review approves crypto-GHAI launch (changes exploitability profile)
3. A new advisory raises any of these from moderate → high or high → critical
4. Vitest 4 migration is scheduled (resolves the dev-server moderate cluster)
5. Next.js minor/major release bumps `postcss` past 8.5.10

Any of the above triggers a fresh `npm audit` review and update to this register.

---

## Cross-reference

- `docs/SECURITY_DEFERRED.md` — Sprint 13F technical analysis, kept as historical record
- `package.json` — pinned versions
- `package-lock.json` — resolved tree

---

## Sign-off

- **Sprint:** AFS-6g
- **Author:** Claude Code (this session)
- **Reviewed:** Awaiting Jix sign-off as part of AFS-6g closeout
