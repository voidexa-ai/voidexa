// app/api/chat/conversations/route.ts
// Void Chat — Conversation CRUD

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import {
  listConversations,
  createConversation,
  deleteConversation,
  updateConversationTitle,
} from '@/lib/supabase/chat-queries';
import type { ProviderSlug } from '@/config/providers';

async function getUser() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// GET — list conversations
export async function GET() {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const conversations = await listConversations(user.id);
    return NextResponse.json({ conversations });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 });
  }
}

// POST — create conversation
export async function POST(req: NextRequest) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { provider, model, title } = await req.json() as {
      provider: ProviderSlug;
      model: string;
      title?: string;
    };

    if (!provider || !model) {
      return NextResponse.json({ error: 'provider and model are required' }, { status: 400 });
    }

    const conversation = await createConversation(user.id, provider, model, title);
    return NextResponse.json({ conversation }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create conversation' }, { status: 500 });
  }
}

// DELETE — delete conversation
export async function DELETE(req: NextRequest) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { conversationId } = await req.json() as { conversationId: string };
    if (!conversationId) {
      return NextResponse.json({ error: 'conversationId is required' }, { status: 400 });
    }

    await deleteConversation(conversationId, user.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete conversation' }, { status: 500 });
  }
}

// PATCH — update conversation title
export async function PATCH(req: NextRequest) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { conversationId, title } = await req.json() as { conversationId: string; title: string };
    if (!conversationId || !title) {
      return NextResponse.json({ error: 'conversationId and title are required' }, { status: 400 });
    }

    await updateConversationTitle(conversationId, user.id, title);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update conversation' }, { status: 500 });
  }
}
