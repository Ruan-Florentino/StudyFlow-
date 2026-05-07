# Migrations Supabase — ordem e aplicação (passo 2)

Este repositório mantém SQL versionado em `supabase/migrations/`. Aplique **sempre em staging antes de produção**.

---

## Pré-requisito (obrigatório)

- Tabela **`public.users`** existente, com **`id uuid` referenciando `auth.users(id)`** (mesmo `id` do usuário autenticado).  
  As migrations `user_question_attempts`, `user_study_sessions` e `user_exam_runs` fazem `references public.users (id)`.

Se `public.users` ainda não existir, crie-a (ou rode a migration inicial do produto) **antes** da primeira abaixo.

---

## Ordem aplicável (já validada no código)

| # | Arquivo | O que faz |
|---|---------|-----------|
| 1 | `20260505120000_persistence_v2.sql` | `user_question_attempts`, `user_study_sessions`, coluna `longest_streak` em `users`, RLS. |
| 2 | `20260505130000_user_roles.sql` | Coluna `role`, função **`is_supremo_or_admin(uuid)`** (necessária depois). |
| 3 | `20260506100000_user_exam_runs.sql` | Tabela `user_exam_runs`, RLS. |
| 4 | `20260506132000_users_rls_hardening.sql` | RLS restrito em `public.users` (select/insert/update só o próprio). |
| 5 | `20260506133500_security_events.sql` | Tabela `security_events`, RLS (usa `is_supremo_or_admin`). |
| 6 | `20260506140000_api_rate_limit_distributed.sql` | Tabela `api_rate_limit_buckets`, função **`check_api_rate_limit`** (só `service_role`). |

**Não inverta** 2 e 5: `security_events` depende de `is_supremo_or_admin`.

---

## Opção A — Supabase CLI (recomendado)

Na raiz do projeto (Windows PowerShell):

```powershell
# CLI via npx (versão testada no dev: 2.x)
npx supabase login
npx supabase link --project-ref SEU_PROJECT_REF
npx supabase db push
```

- `link` associa o diretório ao projeto remoto.  
- `db push` aplica migrations pendentes na ordem dos nomes de arquivo.

Se o projeto **nunca** foi ligado ao CLI, pode ser necessário:

```powershell
npx supabase init
```

Isso cria `supabase/config.toml`. Revise se não sobrescrever nada importante; em seguida `link` + `db push`.

**Dry-run / inspeção:** use o dashboard Supabase → **SQL Editor** para rodar trechos de verificação (abaixo), ou consulte a doc oficial do CLI para `db diff` entre ambientes.

---

## Opção B — SQL Editor (manual)

1. Abra **Supabase Dashboard** → **SQL Editor**.  
2. Rode **um arquivo por vez**, na ordem da tabela acima (conteúdo completo de cada `.sql`).  
3. Confirme que não houve erro entre um e outro.

Útil quando o CLI não está disponível ou há política de mudança só via ticket.

---

## Verificação pós-deploy (smoke)

Rode no SQL Editor (ajuste se os nomes de policy diferirem):

```sql
-- Tabelas existem
select to_regclass('public.user_question_attempts') as attempts,
       to_regclass('public.user_study_sessions') as sessions,
       to_regclass('public.user_exam_runs') as exam_runs,
       to_regclass('public.security_events') as security_events,
       to_regclass('public.api_rate_limit_buckets') as rate_buckets;

-- Funções
select proname from pg_proc
where proname in ('is_supremo_or_admin', 'check_api_rate_limit');
```

- Esperado: todas as tabelas **não nulas**; duas funções listadas.  
- `check_api_rate_limit` deve estar com `EXECUTE` apenas para `service_role` (conforme migration).

---

## App / backend

- **`SUPABASE_SERVICE_ROLE_KEY`** no servidor: necessária para RPC `check_api_rate_limit` e para inserções administrativas em `security_events` (se o backend usar).  
- Cliente só com **anon key** + RLS; não expor service role no Vite.

---

## Se algo falhar

1. Copie a mensagem de erro completa do Postgres.  
2. Confira se `public.users` e FK batem com `auth.users`.  
3. Confira se uma migration antiga já criou policy conflitante em `public.users` (a migration de hardening faz `drop policy if exists` com nomes fixos).  
4. Em staging, pode ser aceitável `rollback` manual documentado — em produção, preferir migration nova de correção.

---

## Ligação com o plano

- **Passo 1:** `docs/ENVIRONMENT.md`  
- **Passo 2 (este arquivo):** aplicar e validar migrations.  
- **Passo 3:** `docs/SECRETS_ROTATION.md` — rotacionar segredos e revisar o host.
