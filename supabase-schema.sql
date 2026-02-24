-- Run this in Supabase SQL Editor (https://supabase.com/dashboard → SQL Editor)

-- 1. Create the table
-- `completed` stores a JSON object: { "item-id": { "date": "2026-02-21", "note": "...", "link": "..." }, ... }
create table public.checklist_progress (
  id         uuid default gen_random_uuid() primary key,
  user_id    uuid references auth.users(id) not null,
  track_id   text not null default 'sa',
  completed  jsonb default '{}'::jsonb not null,
  updated_at timestamptz default now() not null,
  unique (user_id, track_id)
);

-- If your table already exists, run this migration block once instead:
-- alter table public.checklist_progress add column if not exists track_id text not null default 'sa';
-- update public.checklist_progress set track_id = 'sa' where track_id is null;
-- alter table public.checklist_progress add constraint checklist_progress_user_track_unique unique (user_id, track_id);

-- 2. Enable RLS
alter table public.checklist_progress enable row level security;

-- 3. Anyone can READ (visitors see your progress)
create policy "Public read access"
  on public.checklist_progress
  for select
  using (true);

-- 4. Only the row owner can INSERT
create policy "Owner insert"
  on public.checklist_progress
  for insert
  with check (auth.uid() = user_id);

-- 5. Only the row owner can UPDATE
create policy "Owner update"
  on public.checklist_progress
  for update
  using (auth.uid() = user_id);

-- 6. Auto-update the updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_checklist_updated
  before update on public.checklist_progress
  for each row
  execute function public.handle_updated_at();

-- ==========================================
-- 7. Storage bucket for proof images
-- ==========================================

insert into storage.buckets (id, name, public) values ('proof-images', 'proof-images', true);

-- Anyone can VIEW images (public portfolio)
create policy "Public read proof images"
  on storage.objects for select
  using (bucket_id = 'proof-images');

-- Only authenticated users can UPLOAD
create policy "Owner upload proof images"
  on storage.objects for insert
  with check (bucket_id = 'proof-images' and auth.role() = 'authenticated');

-- Only authenticated users can DELETE their own uploads
create policy "Owner delete proof images"
  on storage.objects for delete
  using (bucket_id = 'proof-images' and auth.role() = 'authenticated');
