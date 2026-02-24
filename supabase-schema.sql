-- Run this in Supabase SQL Editor (idempotent migration).
-- It supports BOTH fresh setup and upgrading an existing legacy table.

-- ==========================================
-- 1) Table + columns
-- ==========================================

create table if not exists public.checklist_progress (
  id         uuid default gen_random_uuid() primary key,
  user_id    uuid references auth.users(id) not null,
  track_id   text not null default 'sa',
  completed  jsonb default '{}'::jsonb not null,
  updated_at timestamptz default now() not null
);

alter table public.checklist_progress
  add column if not exists track_id text not null default 'sa';

alter table public.checklist_progress
  add column if not exists completed jsonb default '{}'::jsonb not null;

alter table public.checklist_progress
  add column if not exists updated_at timestamptz default now() not null;

update public.checklist_progress
set track_id = 'sa'
where track_id is null or trim(track_id) = '';

-- If legacy data has duplicate (user_id, track_id), keep newest row.
with ranked as (
  select
    id,
    row_number() over (
      partition by user_id, track_id
      order by updated_at desc nulls last, id desc
    ) as rn
  from public.checklist_progress
)
delete from public.checklist_progress p
using ranked r
where p.id = r.id and r.rn > 1;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'checklist_progress_user_track_unique'
  ) then
    alter table public.checklist_progress
      add constraint checklist_progress_user_track_unique unique (user_id, track_id);
  end if;
end $$;

-- ==========================================
-- 2) RLS + policies
-- ==========================================

alter table public.checklist_progress enable row level security;

drop policy if exists "Public read access" on public.checklist_progress;
create policy "Public read access"
  on public.checklist_progress
  for select
  using (true);

drop policy if exists "Owner insert" on public.checklist_progress;
create policy "Owner insert"
  on public.checklist_progress
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "Owner update" on public.checklist_progress;
create policy "Owner update"
  on public.checklist_progress
  for update
  using (auth.uid() = user_id);

-- ==========================================
-- 3) updated_at trigger
-- ==========================================

create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists on_checklist_updated on public.checklist_progress;
create trigger on_checklist_updated
  before update on public.checklist_progress
  for each row
  execute function public.handle_updated_at();

-- ==========================================
-- 4) Storage bucket + policies
-- ==========================================

insert into storage.buckets (id, name, public)
values ('proof-images', 'proof-images', true)
on conflict (id) do nothing;

drop policy if exists "Public read proof images" on storage.objects;
create policy "Public read proof images"
  on storage.objects for select
  using (bucket_id = 'proof-images');

drop policy if exists "Owner upload proof images" on storage.objects;
create policy "Owner upload proof images"
  on storage.objects for insert
  with check (bucket_id = 'proof-images' and auth.role() = 'authenticated');

drop policy if exists "Owner delete proof images" on storage.objects;
create policy "Owner delete proof images"
  on storage.objects for delete
  using (bucket_id = 'proof-images' and auth.role() = 'authenticated');
