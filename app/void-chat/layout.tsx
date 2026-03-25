// app/void-chat/layout.tsx
// Void Chat — Layout with sidebar
// Protected route — redirects to login if not authenticated

import { redirect } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

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

  return (
    <div className="flex h-screen bg-gray-950 text-white">
      {/* Sidebar — will be ChatSidebar component */}
      <aside className="w-72 border-r border-gray-800 flex-shrink-0 hidden md:flex flex-col">
        {/* ChatSidebar goes here */}
        <div className="p-4 border-b border-gray-800">
          <h2 className="text-lg font-semibold">Void Chat</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {/* ConversationList goes here */}
        </div>
        <div className="p-4 border-t border-gray-800">
          {/* CreditDisplay goes here */}
        </div>
      </aside>

      {/* Main chat area */}
      <main className="flex-1 flex flex-col min-w-0">
        {children}
      </main>
    </div>
  );
}
