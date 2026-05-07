-- FASE-1: papéis de usuário + helper para RLS (Modo Supremo / admin)
-- Aplicar após public.users existir com id = auth.users.id

alter table public.users
  add column if not exists role text not null default 'free';

alter table public.users
  drop constraint if exists users_role_chk;

alter table public.users
  add constraint users_role_chk
  check (role in ('free', 'premium', 'supremo', 'admin'));

create or replace function public.is_supremo_or_admin(check_uid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.users u
    where u.id = check_uid
      and u.role in ('supremo', 'admin')
  );
$$;

comment on function public.is_supremo_or_admin(uuid) is
  'Retorna true se o usuário tem role supremo ou admin. Use em policies RLS quando necessário.';

-- Opcional: promover owner (substitua o e-mail e descomente após conferir em auth.users)
-- update public.users u
-- set role = 'supremo'
-- from auth.users a
-- where u.id = a.id and lower(a.email) = lower('seu-email@dominio.com');
