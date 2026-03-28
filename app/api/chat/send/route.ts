// app/api/chat/send/route.ts
// Void Chat — Main message endpoint
// Auth check → Credit check → Provider call (streamed) → Log message → Deduct credits

import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { checkCredits } from '@/lib/credits/check';
import { deductCredits } from '@/lib/credits/deduct';
import { getModelById } from '@/config/providers';
import { getMessages, insertMessage, getConversation, updateMessageCompression, updateConversationTokensSaved } from '@/lib/supabase/chat-queries';
import { logGhaiTransaction } from '@/lib/supabase/credit-queries';
import { compressForContext } from '@/lib/kcp90/compress-context';
import { PLATFORM } from '@/config/constants';
import { streamProvider } from '@/lib/providers/router';
import type { ProviderMessage } from '@/types/providers';
import type { ProviderSlug } from '@/config/providers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // 1. Auth check
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => cookieStore.getAll() } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    // 2. Parse request
    const body = await req.json();
    const { conversationId, message, provider, model: modelId } = body as {
      conversationId: string;
      message: string;
      provider: ProviderSlug;
      model: string;
    };

    if (!conversationId || !message || !provider || !modelId) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    if (message.length > PLATFORM.maxMessagesPerConversation) {
      return new Response(JSON.stringify({ error: 'Message too long' }), { status: 400 });
    }

    // 3. Validate model exists
    const modelDef = getModelById(modelId);
    if (!modelDef || modelDef.provider !== provider) {
      return new Response(JSON.stringify({ error: 'Invalid model' }), { status: 400 });
    }

    // 4. Verify conversation belongs to user
    const conversation = await getConversation(conversationId, user.id);
    if (!conversation) {
      return new Response(JSON.stringify({ error: 'Conversation not found' }), { status: 404 });
    }

    // 5. Credit check
    const creditCheck = await checkCredits(user.id, modelId);
    if (!creditCheck.canSend) {
      return new Response(JSON.stringify({
        error: 'Insufficient credits',
        reason: creditCheck.reason,
        tier: creditCheck.tier,
      }), { status: 402 });
    }

    // 6. Save user message to DB
    await insertMessage(conversationId, user.id, 'user', message);

    // 7. Build message history for provider — with KCP-90 context compression
    const history = await getMessages(conversationId, user.id);
    const compressionResult = compressForContext(history);
    const providerMessages: ProviderMessage[] = compressionResult.messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    // Persist compression metadata async (non-blocking — don't delay the stream)
    if (compressionResult.compressed) {
      void (async () => {
        try {
          await Promise.all(
            Object.entries(compressionResult.byId).map(([msgId, meta]) =>
              updateMessageCompression(msgId, meta.content_compressed, meta.compression_ratio)
            )
          );
          if (compressionResult.tokensSaved > 0) {
            await updateConversationTokensSaved(conversationId, compressionResult.tokensSaved);
          }
        } catch {
          // Compression metadata is best-effort — never block the user's chat
        }
      })();
    }

    // 8. Stream response via SSE
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        let fullContent = '';
        let tokensIn = 0;
        let tokensOut = 0;

        try {
          await streamProvider(provider, {
            model: modelDef.apiModel,
            messages: providerMessages,
            maxTokens: modelDef.maxTokens,
            stream: true,
          }, {
            onToken(token) {
              const event = `data: ${JSON.stringify({ type: 'token', data: token })}\n\n`;
              controller.enqueue(encoder.encode(event));
            },
            async onDone(response) {
              fullContent = response.content;
              tokensIn = response.tokensInput;
              tokensOut = response.tokensOutput;

              // Save assistant message
              const ghaiCost = creditCheck.ghaiCost || 0;
              const assistantMsg = await insertMessage(
                conversationId, user.id, 'assistant', fullContent,
                provider, modelId, tokensIn, tokensOut, ghaiCost
              );

              // Deduct credits
              const deductResult = await deductCredits(user.id, modelId, creditCheck.tier);

              // Log GHAI transaction if applicable
              if (deductResult.ghaiDeducted && deductResult.ghaiDeducted > 0) {
                await logGhaiTransaction(user.id, -deductResult.ghaiDeducted, 'spend', 'ghost-ai');
              }

              // Send done event with metadata
              const doneEvent = `data: ${JSON.stringify({
                type: 'done',
                data: '',
                metadata: {
                  messageId: assistantMsg.id,
                  tokens_input: tokensIn,
                  tokens_output: tokensOut,
                  ghai_cost: ghaiCost,
                },
              })}\n\n`;
              controller.enqueue(encoder.encode(doneEvent));
              controller.close();
            },
            onError(error) {
              const errorEvent = `data: ${JSON.stringify({ type: 'error', data: error.message })}\n\n`;
              controller.enqueue(encoder.encode(errorEvent));
              controller.close();
            },
          });
        } catch (error) {
          const msg = error instanceof Error ? error.message : 'Provider error';
          const errorEvent = `data: ${JSON.stringify({ type: 'error', data: msg })}\n\n`;
          controller.enqueue(encoder.encode(errorEvent));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Internal server error';
    return new Response(JSON.stringify({ error: msg }), { status: 500 });
  }
}
