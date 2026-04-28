// app/admin/void-chat/page.tsx
// Void Chat — Admin Dashboard (role=admin only)

import { redirect } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

export default async function AdminVoidChatPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  // Check admin role
  const serviceClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const { data: profile } = await serviceClient
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') redirect('/void-chat');

  // Fetch stats
  const { count: totalUsers } = await serviceClient
    .from('user_credits')
    .select('*', { count: 'exact', head: true });

  const { count: totalConversations } = await serviceClient
    .from('chat_conversations')
    .select('*', { count: 'exact', head: true });

  const { count: totalMessages } = await serviceClient
    .from('chat_messages')
    .select('*', { count: 'exact', head: true });

  const { count: proSubscribers } = await serviceClient
    .from('user_credits')
    .select('*', { count: 'exact', head: true })
    .eq('subscription_status', 'active');

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Void Chat — Admin Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <StatCard label="Total Users" value={totalUsers || 0} />
        <StatCard label="Conversations" value={totalConversations || 0} />
        <StatCard label="Messages" value={totalMessages || 0} />
        <StatCard label="Pro Subscribers" value={proSubscribers || 0} />
        <StatCard label="Stripe MRR" value={`$${((proSubscribers || 0) * 5).toFixed(0)}`} />
      </div>

      <p className="text-gray-500 text-sm mt-8">
        Provider cost tracking will be added once API usage data accumulates.
      </p>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <p className="text-gray-400 text-sm mb-1">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
