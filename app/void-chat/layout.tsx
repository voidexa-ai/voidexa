// app/void-chat/layout.tsx
// Void Chat — Auth guard + client shell with sidebar

import { redirect } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { VoidChatShell } from '@/components/ghost-ai/VoidChatShell';

export const metadata = {
  title: 'voidexa Void Chat — Multi-AI Chat',
}

export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/auth/login?redirect=/void-chat');
  }

  return <VoidChatShell>{children}</VoidChatShell>;
}
