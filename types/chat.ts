// types/chat.ts
// Void Chat — Chat Type Definitions

import type { ProviderSlug } from '@/config/providers';

export interface Conversation {
  id: string;
  user_id: string;
  title: string;
  provider: ProviderSlug;
  model: string;
  message_count: number;
  tokens_saved: number;
  compression_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  user_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  content_compressed: string | null;
  compression_ratio: number | null;
  encoder_used: string | null;
  provider: ProviderSlug | null;
  model: string | null;
  tokens_input: number;
  tokens_output: number;
  ghai_cost: number;
  created_at: string;
}

export interface SendMessageRequest {
  conversationId: string;
  message: string;
  provider: ProviderSlug;
  model: string;
}

export interface SendMessageResponse {
  messageId: string;
  content: string;
  tokens_input: number;
  tokens_output: number;
  ghai_cost: number;
}

export interface CreateConversationRequest {
  provider: ProviderSlug;
  model: string;
  title?: string;
}

// SSE stream event types
export interface StreamEvent {
  type: 'token' | 'done' | 'error';
  data: string;
  // 'done' event includes metadata:
  metadata?: {
    messageId: string;
    tokens_input: number;
    tokens_output: number;
    ghai_cost: number;
  };
}
