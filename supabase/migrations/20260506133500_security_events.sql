-- Auditoria de segurança: eventos de acesso/abuso por usuário.
-- Uso recomendado: inserir via backend com service role.

create table if not exists public.security_events (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references public.users (id) on delete set null,
  event_type text not null,
  severity text not null default 'medium',
  source text not null default 'backend',
  ip text,
  user_agent text,
  route text,
  details jsonb,
  created_at timestamptz not null default now(),
  constraint security_events_severity_chk check (severity in ('low', 'medium', 'high', 'critical'))
);

create index if not exists security_events_actor_created_idx
  on public.security_events (actor_user_id, created_at desc);

create index if not exists security_events_type_created_idx
  on public.security_events (event_type, created_at desc);

alter table public.security_events enable row level security;

drop policy if exists "Users can read own security events" on public.security_events;
create policy "Users can read own security events"
  on public.security_events
  for select
  using (actor_user_id = auth.uid());

drop policy if exists "Admins can read all security events" on public.security_events;
create policy "Admins can read all security events"
  on public.security_events
  for select
  using (public.is_supremo_or_admin(auth.uid()));
