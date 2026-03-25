// src/lib/supabase/chat-queries.ts
// Ghost AI Chat — Database queries for conversations and messages
// These use service_role key for server-side API routes.

import { createClient } from '@supabase/supabase-js';
import type { Conversation, ChatMessage } from '@/types/chat';
import type { ProviderSlug } from '@/config/providers';

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// ── Conversations ──

export async function listConversations(userId: string): Promise<Conversation[]> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from('chat_conversations')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
    .limit(50);

  if (error) throw new Error(error.message);
  return (data || []) as Conversation[];
}

export async function getConversation(conversationId: string, userId: string): Promise<Conversation | null> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from('chat_conversations')
    .select('*')
    .eq('id', conversationId)
    .eq('user_id', userId)
    .single();

  if (error) return null;
  return data as Conversation;
}

export async function createConversation(
  userId: string,
  provider: ProviderSlug,
  model: string,
  title?: string
): Promise<Conversation> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from('chat_conversations')
    .insert({
      user_id: userId,
      provider,
      model,
      title: title || 'New Chat',
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Conversation;
}

export async function updateConversationTitle(
  conversationId: string,
  userId: string,
  title: string
): Promise<void> {
  const supabase = getServiceClient();
  const { error } = await supabase
    .from('chat_conversations')
    .update({ title, updated_at: new Date().toISOString() })
    .eq('id', conversationId)
    .eq('user_id', userId);

  if (error) throw new Error(error.message);
}

export async function deleteConversation(conversationId: string, userId: string): Promise<void> {
  const supabase = getServiceClient();
  const { error } = await supabase
    .from('chat_conversations')
    .delete()
    .eq('id', conversationId)
    .eq('user_id', userId);

  if (error) throw new Error(error.message);
}

// ── Messages ──

export async function getMessages(conversationId: string, userId: string): Promise<ChatMessage[]> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) throw new Error(error.message);
  return (data || []) as ChatMessage[];
}

export async function insertMessage(
  conversationId: string,
  userId: string,
  role: 'user' | 'assistant' | 'system',
  content: string,
  provider?: string,
  model?: string,
  tokensInput?: number,
  tokensOutput?: number,
  ghaiCost?: number
): Promise<ChatMessage> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from('chat_messages')
    .insert({
      conversation_id: conversationId,
      user_id: userId,
      role,
      content,
      provider: provider || null,
      model: model || null,
      tokens_input: tokensInput || 0,
      tokens_output: tokensOutput || 0,
      ghai_cost: ghaiCost || 0,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as ChatMessage;
}
