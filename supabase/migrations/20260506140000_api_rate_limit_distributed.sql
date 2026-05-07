-- Rate limiting distribuído (Postgres) para o backend Express.
-- Chamado apenas com service_role via RPC (sem exposição ao cliente).

create table if not exists public.api_rate_limit_buckets (
  bucket_key text primary key,
  window_start_ms bigint not null,
  count int not null default 0
);

alter table public.api_rate_limit_buckets enable row level security;

-- Sem policies para authenticated/anon: acesso só via service_role (bypass RLS).

create or replace function public.check_api_rate_limit(
  p_bucket_key text,
  p_max_requests int,
  p_window_ms bigint
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_now bigint := (extract(epoch from clock_timestamp()) * 1000)::bigint;
  v_start bigint;
  v_count int;
  v_reset bigint;
begin
  if p_bucket_key is null or length(p_bucket_key) > 256 or p_max_requests < 1 or p_window_ms < 1000 then
    return jsonb_build_object('limited', true, 'reset_ms', coalesce(p_window_ms, 60000));
  end if;

  select b.window_start_ms, b.count into v_start, v_count
  from public.api_rate_limit_buckets b
  where b.bucket_key = p_bucket_key
  for update;

  if not found then
    insert into public.api_rate_limit_buckets (bucket_key, window_start_ms, count)
    values (p_bucket_key, v_now, 1);
    return jsonb_build_object('limited', false, 'reset_ms', p_window_ms);
  end if;

  if (v_now - v_start) >= p_window_ms then
    update public.api_rate_limit_buckets
    set window_start_ms = v_now, count = 1
    where bucket_key = p_bucket_key;
    return jsonb_build_object('limited', false, 'reset_ms', p_window_ms);
  end if;

  if v_count >= p_max_requests then
    v_reset := greatest(p_window_ms - (v_now - v_start), 0);
    return jsonb_build_object('limited', true, 'reset_ms', v_reset);
  end if;

  update public.api_rate_limit_buckets
  set count = count + 1
  where bucket_key = p_bucket_key;

  v_reset := greatest(p_window_ms - (v_now - v_start), 0);
  return jsonb_build_object('limited', false, 'reset_ms', v_reset);
end;
$$;

revoke all on function public.check_api_rate_limit(text, int, bigint) from public;
grant execute on function public.check_api_rate_limit(text, int, bigint) to service_role;
