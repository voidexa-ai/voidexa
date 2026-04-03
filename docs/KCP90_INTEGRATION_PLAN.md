# KCP-90 INTEGRATION PLAN — voidexa Ecosystem
## voidexa (CVR 46343387) | March 28, 2026

---

## STATUS: What We Have

### KCP-90 Fine-Tuned Model (PROVEN)
- **Model:** Llama 3.1 8B fine-tuned with Unsloth LoRA
- **Compression:** 84% average, 92% peak (byte-level)
- **Format:** GGUF Q4_K_M (4.58 GB)
- **Location PC:** `C:\Users\Jixwu\Projects\kcp90\models\kcp90-merged.gguf`
- **Ollama model:** `kcp90` (running locally, RTX 4060 8GB VRAM)
- **Response time:** ~200ms locally
- **Training:** 236 examples, 400 steps, $3.91 total cost
- **LoRA adapter:** `C:\Users\Jixwu\Projects\kcp90\models\adapter_model.safetensors` (161MB)

### KCP-90 Python Library (v0.7.0)
- **Location:** `C:\Users\Jixwu\Projects\kcp90\`
- **Tests:** 216
- **Phases 1-7 complete:** codebook, encoder, decoder, tags, binary frames, SHM, semantic frame compiler
- **Current encoder:** regex-based (-14% compression — OBSOLETE)

### KCP-BINARY Rust Crate (v0.7.0)
- **Tests:** 154
- **Complete:** FlatBuffers, gRPC, SPSC SHM, Ed25519+SHA-256, Arrow IPC, HMAC fastpath

### Quantum Engine
- **Location:** `C:\Users\Jixwu\Projects\quantum\`
- **Tests:** 944
- **Providers:** Claude, ChatGPT, Gemini, Perplexity, Ollama, (DeepSeek excluded)

### Trading Bot (v4.0.0-scalper-core)
- **Location:** `C:\Users\Jixwu\Desktop\trading-bot\`
- **Tests:** 340
- **Components:** APEX TRADER CORE + SCALPER CORE + 8 defense layers + exchange monitor + slow bleed detector + tier manager

### Vast.ai Server (RUNNING)
- **H100 NVL, 94GB VRAM, $0.028/hr (~$20/month)**
- **Available for:** fine-tuning, Ollama 70B, Quantum remote, testing

---

## INTEGRATION PRIORITY (Quantum + ChatGPT Strategic Analysis)

> "Voidexa should treat KCP not as a feature to sprinkle across products, but as the internal nervous system of the company."

### Phase 1: KCP-90 Python Library + Ollama Encoder (Week 1)
**Goal:** Replace regex encoder with fine-tuned Ollama model

**What to build:**
1. `kcp90/ollama_encoder.py` — New encoder module that calls local `ollama run kcp90`
2. `kcp90/encoder.py` — Updated main encoder with fallback chain: Ollama → regex → raw
3. `kcp90/benchmarks/` — Compression benchmark suite comparing regex vs Ollama vs raw
4. Update all existing tests to work with new encoder
5. Add integration tests: encode → decode → verify semantic equivalence

**Architecture:**
```
User text → OllamaEncoder.encode(text)
         → calls `ollama run kcp90 "{text}"`
         → parses KCP-90 output
         → wraps in KCP Frame (with codebook header)
         → returns CompressedFrame

Fallback: If Ollama fails (timeout/crash) → RegexEncoder → RawText
```

**CLAUDE.md updates:** Add Ollama dependency, model path, fallback rules
**SKILL.md:** Not needed (existing project, no new skill pattern)

**Files to create:**
- `kcp90/ollama_encoder.py`
- `kcp90/encoder_router.py` (routes between Ollama/regex/raw)
- `tests/test_ollama_encoder.py`
- `tests/test_encoder_router.py`
- `benchmarks/compression_benchmark.py`

**Files to modify:**
- `kcp90/encoder.py` (import router)
- `CLAUDE.md` (add Ollama section)

---

### Phase 2: Quantum + KCP-90 Integration (Week 2)
**Goal:** All AI messages compressed via KCP-90 before inter-provider relay

**What to build:**
1. `quantum/kcp90_middleware.py` — Middleware that compresses/decompresses AI responses
2. Integrate into Quantum's message pipeline between providers
3. Token cost tracking: measure savings per session
4. KCP-90 codebook synced across Quantum session

**Architecture:**
```
Provider A response (500 tokens)
  → KCP-90 encode (84% compression → ~80 tokens)
  → Store compressed in session context
  → When Provider B needs context: decompress relevant frames
  → Provider B sees full context but we only STORED 80 tokens

Result: 5x more context fits in same window
```

**CLAUDE.md updates:** Add KCP-90 middleware config to Quantum
**SKILL.md:** Not needed

**Files to create:**
- `quantum/kcp90_middleware.py`
- `quantum/kcp90_session.py` (manages codebook per session)
- `tests/test_kcp90_middleware.py`

**Files to modify:**
- `quantum/engine.py` (hook middleware into pipeline)
- `quantum/CLAUDE.md`

---

### Phase 3: Trading Bot + KCP-90 (Week 3)
**Goal:** Compress tier manager communications (Ollama↔Claude)

**What to build:**
1. KCP-90 compression for tier2 (Ollama) and tier3 (Claude) communications
2. Compress APEX TRADER CORE responses before storage
3. Compress defense layer state for Telegram summaries
4. Historical trade log compression (reduce 12_LOGS/ disk usage)

**Architecture:**
```
Tier 3 (Claude) responds with 800 tokens
  → KCP-90 encode → ~130 tokens stored
  → Tier 2 (Ollama) reads compressed context
  → Tier 1 (rules) gets decompressed params only

Savings: ~$50-100/month on Claude API at scale
```

**Files to create:**
- `engine/kcp90_bridge.py` (encoder/decoder for trading context)
- `tests/test_kcp90_bridge.py`

**Files to modify:**
- `engine/scalper/tier_manager.py` (compress/decompress at tier boundaries)
- `engine/agents/coach_agent.py` (compress coach feedback)
- `CLAUDE.md`

---

### Phase 4: Void Chat + KCP-90 (Week 4)
**Goal:** Reduce per-message token cost for Void Chat users

**What to build:**
1. Server-side KCP-90 compression of chat history
2. When context window fills: compress older messages with KCP-90
3. User sees full text, API sees compressed frames
4. Dynamic pricing adjustment: lower GHAI cost per msg with KCP-90

**Architecture:**
```
User message history (10,000 tokens)
  → Oldest 80% compressed via KCP-90 → 1,600 tokens
  → Newest 20% kept raw → 2,000 tokens
  → Total context: 3,600 tokens instead of 10,000
  → 64% API cost reduction
```

**Files to create:**
- Void Chat backend KCP-90 module
- Supabase function for compression

---

### Phase 5: KCP-90 Control Plane (Month 2-3)
**Goal:** Central dashboard for all KCP-90 activity across voidexa

**What to build:**
1. Web dashboard showing compression stats per product
2. Codebook management (add/remove/version codebooks)
3. Fine-tuning pipeline (upload new examples → retrain → deploy)
4. Cost savings tracker

---

## SAFETY FIRST (Per Quantum Review)

Before ANY integration goes live:

1. **Fallback chain MUST work:** If Ollama crashes → regex encoder → raw text. NEVER lose data.
2. **Semantic verification:** Decoded KCP-90 must match original meaning. Test with Claude comparing original vs decoded.
3. **Codebook versioning:** Both encoder and decoder must agree on codebook version. Mismatch = decode failure.
4. **Rate limiting:** Ollama encoder limited to 100 calls/minute locally to prevent GPU overload.
5. **Monitoring:** Every encode/decode logged with compression ratio. Alert if ratio drops below 50%.

---

## BUILD ORDER FOR CLAUDE CODE

### Session 1: KCP-90 Library Update
```
cd C:\Users\Jixwu\Projects\kcp90; claude --dangerously-skip-permissions
```
Prompt: See Phase 1 details above.

### Session 2: Quantum Integration  
```
cd C:\Users\Jixwu\Projects\quantum; claude --dangerously-skip-permissions
```
Prompt: See Phase 2 details above.

### Session 3: Trading Bot Integration
```
cd C:\Users\Jixwu\Desktop\trading-bot; claude --dangerously-skip-permissions
```
Prompt: See Phase 3 details above.

---

## FILE LOCATIONS REFERENCE

| Project | Path | Tests | Version |
|---------|------|-------|---------|
| KCP-90 Library | `C:\Users\Jixwu\Projects\kcp90\` | 216 | v0.7.0 |
| KCP-90 Model | `C:\Users\Jixwu\Projects\kcp90\models\kcp90-merged.gguf` | — | 84% compression |
| KCP-BINARY Rust | `C:\Users\Jixwu\Projects\kcp90\` | 154 | v0.7.0 |
| Quantum | `C:\Users\Jixwu\Projects\quantum\` | 944 | latest |
| Trading Bot | `C:\Users\Jixwu\Desktop\trading-bot\` | 340 | v4.0.0 |
| Void Chat | Supabase `ihuljnekxkyqgroklurp` | — | Phase 2 |
| voidexa.com | `C:\Users\Jixwu\Desktop\voidexa\` | — | Live |
| Vast.ai Server | H100 NVL $0.028/hr | — | Running |

---

## COST PROJECTIONS

### Current (without KCP-90):
- Claude API for trading: ~$30-50/month (estimated at scale)
- Quantum sessions: ~$5-10/session (multiple providers)
- Void Chat: $0.01-0.05/message passed to API

### With KCP-90 (84% compression):
- Claude API for trading: ~$5-10/month (84% reduction)
- Quantum sessions: ~$1-2/session (compressed context relay)
- Void Chat: $0.002-0.01/message (compressed history)
- Vast.ai for fine-tuning/serving: ~$20/month

### Net savings: 60-80% on all AI API costs

---

## NEXT FINE-TUNING SESSION (When Ready)

Current: 84% average, 236 examples
Target: 88-90% average, 500+ examples

**New example categories needed:**
- Danish language examples (voidexa is Danish)
- Multi-turn conversation compression
- Code snippet compression
- JSON/structured data compression
- Long paragraph → multi-frame compression

**Server:** Use existing Vast.ai H100 NVL ($0.028/hr)
**Estimated time:** 30 minutes
**Estimated cost:** ~$1

---

## DOCUMENT OWNERSHIP
- Created: March 28, 2026
- Author: Jix (voidexa CEO) + Claude
- Status: READY FOR EXECUTION
- First build session: Phase 1 (KCP-90 Library + Ollama Encoder)
