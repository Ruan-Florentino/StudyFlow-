-- Resumo de simulados/provas por usuário (histórico agregado, além de user_question_attempts).

create table if not exists public.user_exam_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  exam_id text not null,
  exam_name text,
  correct_count integer not null,
  total_count integer not null,
  duration_seconds integer,
  finished_at timestamptz not null default now(),
  meta jsonb,
  created_at timestamptz not null default now()
);

create index if not exists user_exam_runs_user_finished_idx
  on public.user_exam_runs (user_id, finished_at desc);

alter table public.user_exam_runs enable row level security;

drop policy if exists "Users manage own exam runs" on public.user_exam_runs;
create policy "Users manage own exam runs"
  on public.user_exam_runs
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
