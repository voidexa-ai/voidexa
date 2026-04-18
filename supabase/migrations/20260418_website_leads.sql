create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  contact text not null,
  type text not null check (type in ('email', 'phone')),
  source text not null default 'website_creation',
  created_at timestamptz not null default now()
);

alter table leads enable row level security;

drop policy if exists "leads insert public" on leads;
create policy "leads insert public" on leads for insert to anon with check (true);
