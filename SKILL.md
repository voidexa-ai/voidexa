---
name: voidexa
description: Local codebase analysis for voidexa
doc_version: 
---

# voidexa Codebase

## Description

Local codebase analysis and documentation generated from code analysis.

**Path:** `C:\Users\Jixwu\Desktop\voidexa`
**Files Analyzed:** 119
**Languages:** TypeScript, JavaScript
**Analysis Depth:** deep

## When to Use This Skill

Use this skill when you need to:
- Understand the codebase architecture and design patterns
- Find implementation examples and usage patterns
- Review API documentation extracted from code
- Check configuration patterns and best practices
- Explore test examples and real-world usage
- Navigate the codebase structure efficiently

## ⚡ Quick Reference

### Codebase Statistics

**Languages:**
- **TypeScript**: 118 files (99.2%)
- **JavaScript**: 1 files (0.8%)

**Analysis Performed:**
- ✅ API Reference (C2.5)
- ✅ Dependency Graph (C2.6)
- ✅ Design Patterns (C3.1)
- ✅ Test Examples (C3.2)
- ✅ Configuration Patterns (C3.4)
- ✅ Architectural Analysis (C3.7)
- ✅ Project Documentation (C3.9)

## 📝 Code Examples

*High-quality examples extracted from test files (C3.2)*

**Test: should return all chains when no namespace is provided** (complexity: 0.60)

```javascript
const mockChains = new Map([
            ['eip155', {}],
            ['solana', {}],
            ['polkadot', {}],
            ['bip122', {}]
        ])
```

**Test: should return all namespaces connected with WalletConnect connector** (complexity: 0.60)

```javascript
const mockChains = new Map([
            ['eip155', {}],
            ['solana', {}],
            ['polkadot', {}],
            ['bip122', {}]
        ])
```

**Test: should return all namespaces connected with WalletConnect connector** (complexity: 0.60)

```javascript
const mockChains = new Map([
            ['eip155', {}],
            ['solana', {}],
            ['polkadot', {}],
            ['bip122', {}]
        ])
```

**Test: emit error if thread exits** (complexity: 0.20)

```javascript
const stream = new ThreadStream({
    filename: join(__dirname, 'exit.js')
```

**Test: emit error if thread exits** (complexity: 0.20)

```javascript
const stream = new ThreadStream({
    filename: join(__dirname, 'exit.js')
```

**Test: should fetch wallet image and update AssetController state correctly** (complexity: 0.10)

```javascript
const blob = new Blob([image])
```

**Test: should fetch network image and update AssetController state correctly** (complexity: 0.10)

```javascript
const blob = new Blob([image])
```

**Test: should fetch connector image and update AssetController state correctly** (complexity: 0.10)

```javascript
const blob = new Blob([image])
```

**Test: should fetch currency image and update AssetController state correctly** (complexity: 0.10)

```javascript
const blob = new Blob([image])
```

**Test: should fetch token image and update AssetController state correctly** (complexity: 0.10)

```javascript
const blob = new Blob([image])
```

*See `references/test_examples/` for all extracted examples*

## 🏗️ Architecture Overview

*From C3.7 architectural analysis*

**Detected Architectural Patterns:**

- **Layered Architecture (2-tier)** (confidence: 0.85)

*Total: 1 architectural patterns detected*

*See `references/architecture/` for complete architectural analysis*

## ⚙️ Configuration Patterns

*From C3.4 configuration analysis*

**Configuration Files Analyzed:** 100
**Total Settings:** 12975
**Patterns Detected:** 0

**Configuration Types:**
- unknown: 100 files

*See `references/config_patterns/` for detailed configuration analysis*

## 📖 Project Documentation

*Extracted from markdown files in the project (C3.9)*

**Total Documentation Files:** 13
**Categories:** 2

### Overview

- **This is NOT the Next.js you know**: Agent rules for Next.js usage within the voidexa platform, clarifying non-standard Next.js conventions used in this codebase.
- **CLAUDE.md — Void Chat MVP (Phase 2)**: Primary project instructions for Void Chat MVP Phase 2, defining the tech stack, architecture, Supabase schema, and strict development rules for the voidexa.com platform.
- **CLAUDE.md — Control Plane Dashboard Addendum**: Addendum to CLAUDE.md scoping the Control Plane dashboard build â€” admin-only access, existing infrastructure to reuse, and specific components to build.
- **Ghost AI Chat — Phase 2 Dependencies**: Dependency installation reference for Ghost AI Chat Phase 2, listing the Anthropic SDK, OpenAI, and Google Generative AI npm packages.
- **voidexa — Sovereign AI Infrastructure**: Public-facing overview of voidexa as a sovereign AI infrastructure company, introducing KCP-90 semantic compression and kcp-binary Rust transport layer.

### Other

- **SKILL.md — voidexa Control Plane Dashboard**: **SKILL.md — voidexa Control Plane Dashboard**
- **SKILL.md — voidexa Control Plane Dashboard**: **SKILL.md — voidexa Control Plane Dashboard**
- **10_AI_IDEAS_CHATGPT**: I cannot honestly prove that nobody has proposed any of these. What I can say is that I pressure-tes...
- **10_AI_IDEAS_NOBODY_THOUGHT_OF**: TOP 5 (mine picks fra alle 4 AI'er):
- **KCP-90 INTEGRATION PLAN — voidexa Ecosystem**: **KCP-90 INTEGRATION PLAN — voidexa Ecosystem**
- *...and 3 more*

**Key Topics:** Next.js rules, agent behavior, codebase conventions, Void Chat MVP, Phase 2, Supabase auth, wallet connection, RLS, AI chat, revenue features

*See `references/documentation/` for all project documentation*

## 📚 Available References

This skill includes detailed reference documentation:

- **API Reference**: `references/api_reference/` - Complete API documentation
- **Dependencies**: `references/dependencies/` - Dependency graph and analysis
- **Examples**: `references/test_examples/` - Usage examples from tests
- **Configuration**: `references/config_patterns/` - Configuration patterns
- **Architecture**: `references/architecture/` - Architectural patterns
- **Documentation**: `references/documentation/` - Project documentation

---

**Generated by Skill Seeker** | Codebase Analyzer with C3.x Analysis
