// lib/kcp90/compress-context.ts
// KCP-90 lightweight server-side context compressor for Void Chat
//
// Strategy: oldest 80% of messages get codebook replacement to shrink token count;
// newest 20% stay raw so the model sees recent context clearly.
// This is NOT the full Ollama KCP-90 (which runs locally) — this is the
// regex-based server-side variant for fitting more history into context windows.

import type { ChatMessage } from '@/types/chat';
import type { ProviderMessage } from '@/types/providers';

// ---------------------------------------------------------------------------
// Codebook — ordered longest-first so longer phrases match before their parts
// ---------------------------------------------------------------------------
const CODEBOOK: Array<[RegExp, string]> = [
  // Technical / infrastructure
  [/\bauthentication\b/gi,        'auth'],
  [/\bauthorization\b/gi,         'authz'],
  [/\bconfiguration\b/gi,         'cfg'],
  [/\bdatabase\b/gi,              'db'],
  [/\bdeployment\b/gi,            'deploy'],
  [/\bdocumentation\b/gi,         'docs'],
  [/\benvironment\b/gi,           'env'],
  [/\bimplementation\b/gi,        'impl'],
  [/\binitialization\b/gi,        'init'],
  [/\bintegration\b/gi,           'integ'],
  [/\binterface\b/gi,             'iface'],
  [/\bmanagement\b/gi,            'mgmt'],
  [/\bmessage\b/gi,               'msg'],
  [/\bobservation\b/gi,           'obs'],
  [/\boptimization\b/gi,          'optim'],
  [/\bparameter\b/gi,             'param'],
  [/\bperformance\b/gi,           'perf'],
  [/\brecommendation\b/gi,        'rec'],
  [/\brepository\b/gi,            'repo'],
  [/\brequirement\b/gi,           'req'],
  [/\bresponse\b/gi,              'resp'],
  [/\bsignificant\b/gi,           'sig'],
  [/\bspecification\b/gi,         'spec'],
  [/\btemporary\b/gi,             'tmp'],
  [/\btransaction\b/gi,           'txn'],
  [/\butilization\b/gi,           'util'],
  [/\bvalidation\b/gi,            'valid'],
  [/\bvariable\b/gi,              'var'],
  // Common filler phrases
  [/\bin order to\b/gi,           'to'],
  [/\bfor the purpose of\b/gi,    'for'],
  [/\bwith respect to\b/gi,       're:'],
  [/\bas a result of\b/gi,        'due to'],
  [/\bit is important to note\b/gi, 'note:'],
  [/\bplease note that\b/gi,      'note:'],
  [/\bI would like to\b/gi,       'I want to'],
  [/\bI am going to\b/gi,         "I'll"],
  [/\bwe are going to\b/gi,       "we'll"],
  [/\byou should be able to\b/gi, 'you can'],
];

// Rough chars-per-token estimate (conservative)
const CHARS_PER_TOKEN = 4;
const COMPRESSION_THRESHOLD_TOKENS = 4000;
const COMPRESSED_FRACTION = 0.8; // oldest 80% get compressed

// ---------------------------------------------------------------------------

export interface CompressedMessage extends ProviderMessage {
  /** Original DB message id — used to persist compression metadata */
  _id?: string;
  /** Compressed text (undefined if this message was not compressed) */
  _compressed?: string;
  /** 0–1 ratio; undefined if not compressed */
  _compressionRatio?: number;
}

export interface CompressionResult {
  messages: CompressedMessage[];
  /** Total characters saved across all compressed messages */
  charsSaved: number;
  /** Approximate tokens saved */
  tokensSaved: number;
  /** Whether compression was applied at all */
  compressed: boolean;
  /** Per-message compression metadata keyed by DB message id */
  byId: Record<string, { content_compressed: string; compression_ratio: number }>;
}

/**
 * Applies codebook compression to a single string.
 */
export function applyCodebook(text: string): string {
  let out = text;
  for (const [pattern, replacement] of CODEBOOK) {
    out = out.replace(pattern, replacement);
  }
  return out;
}

/**
 * Main entry point. Takes the full DB message history and returns:
 *  - `messages`    — ProviderMessage[] ready to send to the AI provider
 *  - `tokensSaved` — approximate tokens freed by compression
 *  - `compressed`  — true if any compression was applied
 *  - `byId`        — per-message compression metadata for Supabase updates
 *
 * Only runs if total estimated tokens > COMPRESSION_THRESHOLD_TOKENS.
 */
export function compressForContext(history: ChatMessage[]): CompressionResult {
  const totalChars = history.reduce((sum, m) => sum + m.content.length, 0);
  const estimatedTokens = Math.ceil(totalChars / CHARS_PER_TOKEN);

  // No compression needed
  if (estimatedTokens <= COMPRESSION_THRESHOLD_TOKENS) {
    return {
      messages: history.map((m) => ({
        role: m.role as 'user' | 'assistant' | 'system',
        content: m.content,
        _id: m.id,
      })),
      charsSaved: 0,
      tokensSaved: 0,
      compressed: false,
      byId: {},
    };
  }

  const cutoff = Math.floor(history.length * COMPRESSED_FRACTION);
  let charsSaved = 0;
  const byId: CompressionResult['byId'] = {};

  const messages: CompressedMessage[] = history.map((m, idx) => {
    if (idx >= cutoff) {
      // Newest 20% — keep raw
      return {
        role: m.role as 'user' | 'assistant' | 'system',
        content: m.content,
        _id: m.id,
      };
    }

    // Oldest 80% — compress
    const compressed = applyCodebook(m.content);
    const saved = m.content.length - compressed.length;
    charsSaved += saved;

    const ratio = saved > 0 ? saved / m.content.length : 0;

    if (saved > 0) {
      byId[m.id] = {
        content_compressed: compressed,
        compression_ratio: Math.round(ratio * 10000) / 10000, // 4 decimal places
      };
    }

    return {
      role: m.role as 'user' | 'assistant' | 'system',
      content: compressed,
      _id: m.id,
      _compressed: compressed,
      _compressionRatio: ratio,
    };
  });

  return {
    messages,
    charsSaved,
    tokensSaved: Math.ceil(charsSaved / CHARS_PER_TOKEN),
    compressed: charsSaved > 0,
    byId,
  };
}
