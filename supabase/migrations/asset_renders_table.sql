-- voidexa asset_renders table — see VOIDEXA_VAST_AI_RENDER_MASTER.md Part 9.
-- Manifest of every rendered game/shop asset. Powers item_id -> public_url lookup
-- in game and shop UIs. Populated by scripts/vast_render.py after each batch.

create extension if not exists "pgcrypto";

create table if not exists public.asset_renders (
    item_id          text primary key,
    asset_type       text not null check (asset_type in ('shop', 'card')),
    rarity           text not null check (rarity in ('common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic')),
    public_url       text not null,
    rendered_at      timestamptz not null default now(),
    seed             bigint not null,
    render_seconds   numeric(10, 3) not null,
    canvas           text not null default '768x1024',
    style_anchor     text,
    render_source    text,
    updated_at       timestamptz not null default now()
);

create index if not exists asset_renders_asset_type_idx on public.asset_renders (asset_type);
create index if not exists asset_renders_rarity_idx      on public.asset_renders (rarity);
create index if not exists asset_renders_rendered_at_idx on public.asset_renders (rendered_at desc);

-- Keep updated_at current on row updates.
create or replace function public.asset_renders_touch_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at := now();
    return new;
end;
$$;

drop trigger if exists trg_asset_renders_touch on public.asset_renders;
create trigger trg_asset_renders_touch
before update on public.asset_renders
for each row execute function public.asset_renders_touch_updated_at();

-- RLS: public-read (game/shop UI), service-role-write (orchestrator only).
alter table public.asset_renders enable row level security;

drop policy if exists asset_renders_public_read on public.asset_renders;
create policy asset_renders_public_read
    on public.asset_renders
    for select
    using (true);

drop policy if exists asset_renders_service_write on public.asset_renders;
create policy asset_renders_service_write
    on public.asset_renders
    for all
    to service_role
    using (true)
    with check (true);

comment on table  public.asset_renders is 'Rendered-asset manifest populated by scripts/vast_render.py (see Part 9).';
comment on column public.asset_renders.asset_type is 'shop | card — matches prompt source.';
comment on column public.asset_renders.public_url is 'Full Supabase Storage public URL for the PNG.';
comment on column public.asset_renders.render_seconds is 'Wall-clock time spent in SDXL sampler for this image.';
comment on column public.asset_renders.render_source is 'Optional: Vast.ai offer id or gpu profile used for this render.';
