-- Fase 2: tentativas de questão + sessões de estudo + recorde de streak
-- Aplicar no projeto Supabase (SQL editor ou CLI). Requer public.users existente com id = auth.users.id.

create table if not exists public.user_question_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  question_id text not null,
  answer_given integer not null,
  is_correct boolean not null,
  time_spent_seconds integer not null default 0,
  attempted_at timestamptz not null default now(),
  subject text,
  topic text,
  exam_source text,
  created_at timestamptz not null default now()
);

create index if not exists user_question_attempts_user_attempted_idx
  on public.user_question_attempts (user_id, attempted_at desc);

alter table public.user_question_attempts enable row level security;

drop policy if exists "Users manage own question attempts" on public.user_question_attempts;
create policy "Users manage own question attempts"
  on public.user_question_attempts
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create table if not exists public.user_study_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  started_at timestamptz not null,
  ended_at timestamptz not null,
  duration_seconds integer not null,
  activity_type text not null,
  subject text,
  topic text,
  created_at timestamptz not null default now(),
  constraint user_study_sessions_activity_type_chk check (
    activity_type in ('questions', 'flashcards', 'mindmap', 'reading', 'focus', 'other')
  )
);

create index if not exists user_study_sessions_user_started_idx
  on public.user_study_sessions (user_id, started_at desc);

alter table public.user_study_sessions enable row level security;

drop policy if exists "Users manage own study sessions" on public.user_study_sessions;
create policy "Users manage own study sessions"
  on public.user_study_sessions
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

alter table public.users add column if not exists longest_streak integer not null default 0;
