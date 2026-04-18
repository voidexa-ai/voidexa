# Security — Deferred Upgrades

Dependabot / `npm audit` findings that were evaluated during Sprint 13F but deferred because the patched version is a breaking change. Each entry lists the package, current version, target version, why it was deferred, and the estimated effort to fix it safely in a future sprint.

Created: 2026-04-18 (Sprint 13F)

---

## 1. `@solana/spl-token` chain (3 high-severity)

- **Packages affected:** `@solana/spl-token`, `@solana/buffer-layout-utils`, `bigint-buffer`
- **Advisory:** GHSA series covering `bigint-buffer` heap buffer overflow (CWE-787) in `toBigIntLE` / `toBigIntBE`
- **Current:** `@solana/spl-token@0.4.14`
- **npm audit "fix":** `@solana/spl-token@0.1.8` — **downgrade**, removes the modern token API
- **Root cause:** `bigint-buffer@1.1.5` is the latest published version and has not been patched. Every downstream that imports it (including `@solana/spl-token@0.4.x`) is flagged.
- **Why deferred:**
  - `lib/ghai/balance.ts` uses `getAssociatedTokenAddress` + `getAccount` from `@solana/spl-token@0.4.x`. Those helpers don't exist in `0.1.8`.
  - Downgrading would require rewriting the GHAI balance read path against the pre-0.2 API (raw `Token.getOrCreateAssociatedAccountInfo` etc.).
- **Path to fix:**
  1. Wait for `bigint-buffer` to publish a patched release, **or**
  2. Replace the SPL token call with Solana web3.js v2 `@solana/kit` (no `bigint-buffer` dep), **or**
  3. Vendor a local fork of `bigint-buffer` with the overflow fix and pin via `overrides`.
- **Exploitability in voidexa:** the overflow is triggered by `toBigIntLE`/`BE` on attacker-controlled `Buffer` input. voidexa calls `getAccount` with RPC-returned data only; no untrusted Buffer path.
- **Estimated effort:** 1–2 days (option 2), 0 days (option 1, just wait).

---

## 2. `vitest@2 → 4` chain (4 moderate)

- **Packages affected:** `vitest`, `@vitest/mocker`, `vite`, `vite-node`, `esbuild` (transitive)
- **Advisories:**
  - `vite` — Path traversal in optimized deps `.map` handling (GHSA-4w7w-66w2-5vf9)
  - `esbuild` — dev-server responds to arbitrary cross-origin requests (GHSA-67mh-4wv8-2f99)
- **Current:** `vitest@2.1.9` (pulls `vite@5.x`, `esbuild@0.21.x`)
- **npm audit "fix":** `vitest@4.1.4` — **major upgrade**, breaking config + plugin API
- **Why deferred:**
  - Vitest 4 splits `@vitest/browser` into provider-specific packages, changes coverage config, and reshuffles `defineConfig` types. 705 tests currently green under v2 — high regression risk.
  - Both advisories affect only the **dev server**. voidexa's production runtime is Next.js / Vercel edge; vite and esbuild never run in production.
- **Exploitability in voidexa:** none in production. Developer-machine risk only while `npm run test:watch` is up and bound to a reachable port (default localhost, not exposed).
- **Path to fix:**
  1. Pin `vite@^7` and `esbuild@latest` via `overrides` without bumping vitest (may work for the path-traversal fix), or
  2. Full `vitest@4` migration — update `vitest.config.ts`, re-run suite, fix breakage.
- **Estimated effort:** 0.5 days (option 1, try first), 1–2 days (option 2 migration).

---

## 3. Not deferred — resolved in Sprint 13F

For reference, the following were fixed in Sprint 13F and are listed here so the audit trail is complete:

| Package | Before | After | Method |
|---|---|---|---|
| `@solana/wallet-adapter-wallets` (meta) | `0.19.38` | **removed** | Replaced with direct `@solana/wallet-adapter-phantom@0.9.29` + `@solana/wallet-adapter-solflare@0.6.33` imports (voidexa only used those two adapters anyway). Eliminated the entire Trezor + WalletConnect + Torus + Reown transitive tree and all 10 critical advisories. |
| `@anthropic-ai/sdk` | `0.80.0` | `0.90.0` | Direct minor-API-compatible bump. Memory Tool path validation advisory resolved. |
| `defu`, `lodash-es`, `picomatch`, `axios`, `brace-expansion`, `follow-redirects` | various | patched | `npm audit fix` auto-applied safe patches. |
