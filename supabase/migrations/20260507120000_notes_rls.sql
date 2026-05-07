-- Tabela public.notes alinhada ao sync em src/lib/supabase/userRemoteSync.ts (idempotente).

create table if not exists public.notes (
  id uuid primary key,
  user_id uuid not null references public.users (id) on delete cascade,
  title text not null,
  content text not null,
  subject text not null,
  updated_at timestamptz not null default timezone('utc'::text, now()),
  created_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists notes_user_id_updated_idx on public.notes (user_id, updated_at desc);

alter table public.notes enable row level security;

drop policy if exists "Users manage own notes" on public.notes;
create policy "Users manage own notes"
  on public.notes
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
