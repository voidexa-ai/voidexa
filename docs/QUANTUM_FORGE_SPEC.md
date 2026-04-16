# QUANTUM FORGE — Product Specification
## Version 1.0 — April 17, 2026
## voidexa ecosystem product — standalone from Quantum Debate

---

## ONE-LINE PITCH

Quantum Forge collapses the 4-tab, 10-copy-paste workflow of AI-assisted building into one interface: debate → plan → scaffold → build → validate.

---

## THE PROBLEM

Jix's actual workflow today (and every power user's):
1. Open ChatGPT → get a rough spec
2. Paste into Claude chat → debate and refine
3. Hand-write SKILL.md + CLAUDE.md
4. Paste into Claude Code → manual instructions
5. Review output → catch errors → bounce back to chat
6. Repeat

That is 4+ browser tabs, 3 different products, 10+ copy-pastes per feature. Forge eliminates the glue work.

---

## THE PRODUCT

### Complete workflow

```
USER: "Build a Fortnite-style shop for voidexa.com"
         │
         ▼
┌─────────────────────────────────────────────┐
│ PHASE 1: DEBATE                             │
│ 4 AI providers debate the approach:         │
│ - Claude: architecture                      │
│ - GPT: implementation                       │
│ - Gemini: UX/design                         │
│ - Perplexity: market/reference research     │
│ Output: consensus plan                      │
└──────────────────┬──────────────────────────┘
                   ▼
         ⛔ GATE 1: PLAN APPROVAL
         User reviews. Edit / Approve / Reject.
                   │
                   ▼
┌─────────────────────────────────────────────┐
│ PHASE 2: SCAFFOLD GENERATION                │
│ - Auto-writes SKILL.md                      │
│ - Auto-writes CLAUDE.md                     │
│ - Generates task breakdown                  │
│ - Defines success criteria                  │
└──────────────────┬──────────────────────────┘
                   ▼
         ⛔ GATE 2: SCAFFOLD APPROVAL
         User reviews files. Edit / Approve.
                   │
                   ▼
┌─────────────────────────────────────────────┐
│ PHASE 3: BUILD EXECUTION                    │
│ - Executor AI (Claude or GPT with tools)    │
│ - Runs in sandbox (Modal / E2B / Docker)    │
│ - Tools: file I/O, git, npm, test runner    │
│ - Live log streamed to user                 │
└──────────────────┬──────────────────────────┘
                   ▼
         ⛔ GATE 3: BUILD APPROVAL
         User reviews output.
         Accept / Revise / Reject.
         On accept: optional auto-deploy.
```

### Autonomy slider — the key differentiator

User-controlled knob per task:

| Mode | Gates active | User effort | Trust level |
|---|---|---|---|
| **STRICT** | All 3 | Reviews everything | Low trust, maximum control |
| **BALANCED** | Plan + Build | Scaffold auto-generated | Medium trust |
| **AUTONOMOUS** | Plan only | Scaffold + build auto | High trust, minimum effort |

This is unique. Devin forces full autonomous. Cursor forces inline editing. Forge lets the user decide how much trust to extend per task.

---

## TECHNICAL ARCHITECTURE

### Frontend
- Next.js on voidexa.com (`/forge` route)
- React UI: debate view, plan editor, scaffold viewer, build log
- SSE streaming for live debate + build output

### Backend
- Python FastAPI (reuses Quantum backend on Railway)
- New `/forge` endpoints on top of existing `/sessions`
- Supabase for project state, history, user data

### Sandbox options for Phase 3 (decision needed)

| Option | Pros | Cons |
|---|---|---|
| **Modal Sandbox** | Serverless, fast cold start, pay-per-use | Vendor lock-in |
| **E2B** | Purpose-built for AI code execution | Newer, smaller community |
| **Docker on Railway** | Own infra, full control | Slower cold start, ops burden |

### Executor AI
- Claude (Anthropic API with tool use) — primary
- GPT (OpenAI API with tool calling) — secondary
- User picks in settings, or Forge picks best-fit per task

### Tools exposed to executor
- `file.read`, `file.write`, `file.edit`
- `git.commit`, `git.push`
- `shell.run` (npm, pip, test runners)
- `project.search`
- No network write access beyond git push

---

## PRICING MODEL

### Per-build pricing

| Build size | Description | Est. cost |
|---|---|---|
| Small | Single component, fix, or utility | $0.80 (80 GHAI) |
| Medium | Page + state + API route | $1.50 (150 GHAI) |
| Large | Multi-file system, migration, full feature | $3.30 (330 GHAI) |

### Subscription alternative

| Tier | Price | Included |
|---|---|---|
| Forge Free | $0 | 1 small build/month |
| Forge Pilot | $19/month | 20 builds (any size) |
| Forge Commander | $49/month | Unlimited small/medium, 10 large |

All pricing uses Platform-GHAI at $1 = 100 GHAI.

---

## COMPETITIVE LANDSCAPE

| Feature | ChatGPT | Claude | Cursor | Devin | **Forge** |
|---|---|---|---|---|---|
| Multi-AI debate before build | No | No | No | No | **Yes** |
| Auto SKILL/CLAUDE generation | No | No | No | No | **Yes** |
| Tunable autonomy (3 modes) | No | No | No | No | **Yes** |
| Validation gates | No | No | No | No | **Yes** |
| Sandbox execution | No | No | Yes | Yes | **Yes** |
| User owns output code | No | No | Yes | Yes | **Yes** |

The debate layer is the moat. Nobody else does plan-via-consensus-debate before build.

---

## ROLLOUT PHASES

### Phase 1 — MVP (Weeks 1-2)
- Debate → consensus plan → SKILL.md generation only (no build)
- Validate the debate-to-plan loop works
- 5 internal voidexa builds as test cases
- Ship as `/forge` on voidexa.com, internal only

### Phase 2 — Sandbox Build (Weeks 3-4)
- Add Phase 3 executor with sandbox
- Single executor (Claude with tool use)
- Modal Sandbox integration
- Live log streaming

### Phase 3 — Autonomy + Multi-executor (Weeks 5-6)
- Add Strict/Balanced/Autonomous modes
- Add GPT as alternative executor
- Full 3-gate system operational
- Internal dogfooding complete

### Phase 4 — Public Launch (Week 7+)
- Pricing integration via GHAI wallet
- Public `/forge` page
- Marketing: "Your AI team builds it for you"
- Target: developers AND non-developers

---

## RISK ASSESSMENT

### Technical risks
- Sandbox security (code execution = attack surface)
- Executor AI hallucinating file paths or dependencies
- Long debates timing out on complex tasks
- Cost runaway on large builds (need per-build caps)

### Business risks
- Devin has $2B valuation — competition is well-funded
- Claude Code / Cursor already work for developers
- Non-developers are the real target but need education
- Pricing may be too low (debate layer has real cost)

### Legal risks
- Code ownership: generated code = user's code (define in TOS)
- Sandbox liability: user runs malicious prompts (sandboxed, logged)
- GHAI payment: pending ADVORA MiCA review (Stripe-only at launch)

---

## WHY THIS IS A REAL PRODUCT

The debate-to-build loop is what Jix already does manually every day. Every voidexa feature gets debated across Claude, ChatGPT, and Quantum before Claude Code builds it. Forge productizes that workflow.

Non-developers can't do it because they don't know how to split work across AIs. Forge makes the expert workflow accessible to everyone.

Multi-AI debate → plan → scaffold → validated build is a pipeline nobody else has shipped. That is the opportunity.

---

## REVENUE TARGET

$10-50K/month at 500-1000 active users. At $49/month Commander tier with 30% conversion from free: 1000 users × 30% × $49 = $14,700/month baseline before per-build revenue.

---

## STATUS

- **Current:** Spec phase. Not built.
- **Priority:** Build after gaming layer MVP + Quantum stable.
- **Dependencies:** Quantum backend (Railway), Supabase, sandbox provider choice.
- **Reuses:** Quantum debate engine, voidexa auth, GHAI wallet.

---

## OPEN QUESTIONS

1. Sandbox choice: Modal / E2B / Docker-on-Railway?
2. Executor priority: Claude first, GPT later? Or both from day 1?
3. Pricing: per-build or subscription-first?
4. Naming: "Quantum Forge" vs potential confusion with VoidForge (3D ship designer)?
5. MVP scope: debate → SKILL.md only? Or include sandbox build in MVP?
6. Target user: internal dogfood first, or public from start?
