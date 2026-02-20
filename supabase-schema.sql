-- Run this in Supabase SQL Editor (https://supabase.com/dashboard → SQL Editor)

-- 1. Create the table
create table public.checklist_progress (
  id         uuid default gen_random_uuid() primary key,
  user_id    uuid references auth.users(id) not null,
  completed  jsonb default '[]'::jsonb not null,
  updated_at timestamptz default now() not null
);

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
