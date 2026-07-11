# Ambientes — Athena / MyHUB.IA

Documento vivo do **passo 1** do plano operacional: o que é *staging*, o que é *produção*, quais variáveis existem e **quem pode ver o quê**.

> Valores reais **não** entram neste arquivo. Use `.env` local (não commitado) e secrets do provedor (Vercel, VPS, etc.).

---

## 1. Papéis e acesso

| Ator | O que usa | Onde roda | Pode fazer |
|------|-----------|-----------|------------|
| **App (browser)** | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` | Cliente Vite | Auth do usuário, chamadas Supabase com RLS como *usuário logado*. |
| **Proxy Node (`server.ts`)** | `SUPABASE_*` ou fallback `VITE_*`, `OPENROUTER_API_KEY`, opcional `SUPABASE_SERVICE_ROLE_KEY` | Servidor | Valida JWT, proxy de IA, rate limit, CSP em produção. |
| **CI / dev local** | Mesmas vars que o proxy, mais `TEST_SUPABASE_ACCESS_TOKEN` só para scripts de teste | Máquina isolada | Nunca commitar token real. |
| **Time humano** | Dashboard Supabase, logs do host | Supabase / Vercel | Service role **só** em painel ou servidor; não colar em issue/Slack. |

**Regra de ouro:** `SUPABASE_SERVICE_ROLE_KEY` e `OPENROUTER_API_KEY` **somente** em variáveis **server-side**. Nunca prefixo `VITE_*`.

---

## 2. Staging vs produção (congelamento lógico)

| Aspecto | Staging (recomendado) | Produção |
|---------|------------------------|----------|
| **Projeto Supabase** | Projeto dedicado *ou* branch preview com URL própria | Projeto principal |
| **URL do app** | `https://staging.seudominio.com` (exemplo) | `https://seudominio.com` |
| **Dados** | Cópia anonimizada ou seed; pode resetar | Dados reais de usuários |
| **Migrations** | Aplicar **primeiro** aqui; validar RLS e funções | Só após OK em staging |
| **Logs debug** | `DEBUG_AGENT_LOG=true` permitido com cautela | `DEBUG_AGENT_LOG` desligado ou ausente |
| **CORS** | `CORS_ALLOWED_ORIGINS` com URL de staging | Lista fechada de origens reais |
| **CSP** | `CSP_EXTRA_CONNECT` espelhando integrações reais | Idem, revisado |

Preencha na tabela abaixo os valores **não secretos** do teu time (URLs públicas):

| Campo | Staging | Produção |
|-------|---------|----------|
| App URL | _preencher_ | _preencher_ |
| Supabase URL | _preencher_ | _preencher_ |
| Deploy (Vercel/projeto) | _preencher_ | _preencher_ |

---

## 3. Variáveis obrigatórias por ambiente

### Cliente (build Vite — exposto no bundle)

- `VITE_SUPABASE_URL` — URL do projeto Supabase.
- `VITE_SUPABASE_ANON_KEY` — chave anônima (pública por design; proteção é RLS).

### Servidor (Node — `server.ts`)

- `SUPABASE_URL` e `SUPABASE_ANON_KEY` — preferidos em produção (evita depender de nomes `VITE_*` no servidor). Se omitidos, o código pode cair no fallback `VITE_*` (ver `server.ts`).
- `OPENROUTER_API_KEY` — proxy de IA; obrigatório para rotas `/api/ai` funcionarem com provedor externo.
- `SUPABASE_SERVICE_ROLE_KEY` — opcional mas necessário para recursos que exijam service role (ex.: alguns fluxos de auditoria/rate limit distribuído no DB, conforme migrations). **Nunca** no frontend.

### Opcionais (conforme feature)

- `CORS_ALLOWED_ORIGINS` — CSV de origens extras.
- `CSP_EXTRA_CONNECT` — hosts extras em `connect-src` da CSP em produção.
- `SECURITY_EVENTS_STDOUT=true` — log de eventos de segurança em stdout se não persistir no DB.
- `TEST_SUPABASE_ACCESS_TOKEN` — apenas scripts locais/CI para bater em `/api/ai` autenticado.
- `VITE_DEV_OWNER_EMAIL` — painel dev em produção (se usado).
- `DEBUG_AGENT_LOG=true` — só diagnóstico local; evitar produção.

Referência completa de nomes: `.env.example`.

---

## 3.1. Vercel (SPA / deploy estático + funções)

**Assinatura:** o produto pode priorizar **Google Play / App Store**; variáveis abaixo de Mercado Pago são **opcionais** para quem não vende pelo web.

Use o painel **Settings → Environment Variables** por ambiente (Production / Preview). O build Vite **injeta** tudo com prefixo `VITE_*` no bundle — **nunca** coloque access token de PSP, service role do Supabase ou OpenRouter key como `VITE_*`.

| Variável | Onde usar | Notas |
|----------|-----------|--------|
| `VITE_SUPABASE_URL` | Build (cliente) | Obrigatória para auth e dados. |
| `VITE_SUPABASE_ANON_KEY` | Build (cliente) | Chave **anon** pública; proteção é RLS. |
| `VITE_ENABLE_MP_EDGE_CHECKOUT` | Build (cliente) | `true` só quando a Edge Function `create-mp-preference` estiver deployada e testada. |
| `VITE_CHECKOUT_PREMIUM_MONTHLY_URL` (e análogas) | Build (cliente) | Opcional: links estáticos Checkout Pro; ver `checkoutUrls.ts`. |
| `OPENROUTER_API_KEY` / `SUPABASE_SERVICE_ROLE_KEY` | **Somente** runtime do Node / Edge / serverless | Configurar nas **Functions** ou host do `server.ts`, não no mesmo escopo do static export se não houver backend. |
| URL de **webhook** (PSP web, se usar) | Painel do provedor + secret | Opcional se só houver billing nas lojas; ver smoke + runbook. |
| Secrets **Play / App Store** (backend) | Servidor que valida recibos | Não no bundle; configurar no host das Edge Functions / API. |

Após alterar variáveis no Vercel, faça **novo deploy** para o build incorporar `VITE_*`.

---

## 4. Checklist antes de “subir” mudança sensível

1. Diff de `.env.example` revisado (sem segredos).
2. Staging com as mesmas **chaves lógicas** que prod (não precisa ser o mesmo valor).
3. Migration aplicada em staging + smoke: login, uma rota autenticada no proxy, uma página crítica.
4. Segredos no painel do host atualizados; nada de secret em PR.

---

## 5. Status do plano operacional

| Passo | Documento | Você executa no provedor |
|-------|-----------|---------------------------|
| 1 | Este arquivo (`ENVIRONMENT.md`) | Preencher tabela staging/prod com URLs públicas |
| 2 | [`SUPABASE_MIGRATIONS.md`](SUPABASE_MIGRATIONS.md) | `db push` ou SQL Editor + smoke |
| 3 | [`SECRETS_ROTATION.md`](SECRETS_ROTATION.md) | Rotacionar chaves + limpar env no host |
| 4 | [`RELEASE_CHECKLIST.md`](RELEASE_CHECKLIST.md) · [`smoke-test-premium.md`](smoke-test-premium.md) | `npm run lint` + `npm run build` + smoke manual e, se houver cobrança, smoke de pagamento |
| 5 | [`OBSERVABILITY.md`](OBSERVABILITY.md) | Logs do host + Supabase + checklist semanal; alertas manuais |
| 6 | [`INCIDENT_RESPONSE.md`](INCIDENT_RESPONSE.md) | Severidade, conter/eradicar, post-mortem |

Plano operacional **1–6** coberto em documentação; execução continua sendo no teu host e dashboards.

**Produto (rumo 10/10):** [`PRODUCT_FOCUS.md`](PRODUCT_FOCUS.md) · [`GLOSSARY.md`](GLOSSARY.md) · [`PRODUCT_UX_STATES.md`](PRODUCT_UX_STATES.md) · [`PRODUCT_DATA_TRUST.md`](PRODUCT_DATA_TRUST.md) · [`PRODUCT_A11Y.md`](PRODUCT_A11Y.md).

**Jurídico (checklist advogado):** [`legal-review-checklist.md`](legal-review-checklist.md).
