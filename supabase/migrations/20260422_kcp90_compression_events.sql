-- AFS-4: Admin Control Plane Data Pipeline
-- kcp90_compression_events: unified event log for KCP-90 usage across products

create table if not exists kcp90_compression_events (
  id uuid primary key default gen_random_uuid(),
  ts timestamptz not null default now(),
  product text not null check (product in ('void-chat','quantum','trading-bot','break-room')),
  user_id uuid references auth.users(id) on delete set null,
  session_id text,
  tokens_in int not null default 0,
  tokens_out int not null default 0,
  bytes_raw int,
  bytes_compressed int,
  compression_ratio numeric(5,4),
  layer_used text,
  success boolean not null default true,
  meta jsonb
);

create index if not exists kcp90_events_ts_idx
  on kcp90_compression_events (ts desc);

create index if not exists kcp90_events_product_ts_idx
  on kcp90_compression_events (product, ts desc);

create index if not exists kcp90_events_user_idx
  on kcp90_compression_events (user_id)
  where user_id is not null;

alter table kcp90_compression_events enable row level security;

-- Admin read policy: uses existing is_admin() SECURITY DEFINER function
-- (defined in 20260417_game_core.sql line 12).
create policy "admin_read_all"
  on kcp90_compression_events
  for select
  using (public.is_admin());

-- NOTE: No insert policy. RLS default-deny applies to anon + authed.
-- Service-role key (used by lib/kcp90/log-event.ts) bypasses RLS by design.
-- This matches the voidexa convention — no redundant "for clarity" policies.

comment on table kcp90_compression_events is
  'AFS-4: Event log for KCP-90 compression across Void Chat, Quantum, Trading Bot, Break Room. Insert only via server-side service-role client. Admin read via is_admin().';
