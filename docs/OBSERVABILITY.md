# Observabilidade mínima (passo 5)

Objetivo: **enxergar falhas** do proxy Node (`server.ts`) e do stack sem montar um APM completo. Comece com **logs do host + backend + checklist humano**; evolua para SaaS de erros quando o tráfego justificar.

---

## 1. O que o backend já registra hoje

| Mecanismo | Quando | Onde aparece |
|-----------|--------|----------------|
| **`logSecurityEvent`** | Eventos de segurança (auth falha, rate limit, rotas sensíveis) | Inserção em `public.security_events` quando service role + migration aplicada; ou **stdout** se `SECURITY_EVENTS_STDOUT=true` |
| **`console.warn` / `console.error`** | OpenRouter, proxy de vídeo, erros genéricos | Logs do processo Node (local: terminal; Vercel: **Functions/Runtime logs** ou log drain) |
| **`console.log`** | Startup, alguns fluxos de sucesso (ex.: transcript) | Idem |

Em **produção**, prefira **`SECURITY_EVENTS_STDOUT=false`** e persistência no DB **apenas** se o backend estiver configurado com service role e a migration `security_events` aplicada — caso contrário, `SECURITY_EVENTS_STDOUT=true` é aceitável para não perder eventos (revise se há PII em `details`).

---

## 2. Onde olhar (por plataforma)

### Vercel (SPA + serverless / Node)

- **Deployments** → último deploy → **Logs** (ou **Runtime Logs** conforme o setup).  
- Filtre por: `error`, `OpenRouter`, `Proxy AI`, `429`, `401`, `5xx`.  
- Se o app for **só static** no Vercel e o **Node rodar em outro host**, os logs do proxy ficam **nesse** host (VPS, Railway, etc.).

### backend

- **Logs** → API, Auth, Postgres (consultas lentas, erros).  
- Útil para: picos de 401, falhas RLS, quota.

### OpenRouter

- Painel de uso / billing e histórico de requests (debug de modelo indisponível ou key inválida).

### Assinatura: lojas (Play / App Store)

- **Google:** Play Console → ordens / assinaturas; **Real-time developer notifications** (RTDN) ou Pub/Sub, se configurado.
- **Apple:** App Store Connect → assinaturas; **App Store Server Notifications** e/ou API de status.
- **Sintoma:** compra ativa na loja mas plano inalterado no backend → logs da validação de recibo / server notifications (ver runbook §2.2).

### Mercado Pago (opcional — web)

- Só se vender pelo PWA/site: webhooks, taxa de falha, HTTP 4xx/5xx (runbook §2.1).
- Não logar payload completo sem mascarar PII.

---

## 3. Checklist semanal (5–10 min)

- [ ] Últimos 7 dias: algum pico de **5xx** no host?  
- [ ] Erros **OpenRouter** recorrentes (key, modelo, timeout)?  
- [ ] **Rate limit** disparando muito (usuário legítimo vs abuso)?  
- [ ] Tabela `security_events` (se em uso): eventos `high` / `critical`?
- [ ] Lojas: falhas recorrentes na validação de recibo ou notificações não processadas?
- [ ] Mercado Pago (se ativo no web): webhooks com falhas recorrentes?

---

## 4. Alertas “nível 1” (sem código)

| Gatilho | Ação mínima |
|---------|-------------|
| Deploy novo | Alguém do time online **15 min** olhando logs (já no [`RELEASE_CHECKLIST.md`](RELEASE_CHECKLIST.md)). |
| Usuários reportam “IA parou” | Ver logs `OPENROUTER` + quota OpenRouter + env `OPENROUTER_API_KEY` no host. |
| Suspeita de abuso | Filtrar `logSecurityEvent` / 429; revisar [`SECRETS_ROTATION.md`](SECRETS_ROTATION.md) se vazamento. |

**Evolução:** integrar Vercel → Slack/Discord; ou **Sentry** / **Axiom** / **Logtail** no `server.ts` (fora do escopo deste doc; exige COMANDO para dependências).

---

## 5. Boas práticas

- Não logar **corpo completo** de prompts com dados pessoais em produção sem política de retenção.  
- Correlacionar com **`request id`** se no futuro o middleware adicionar header interno (melhoria opcional).  
- Manter **timezone UTC** na cabeça ao cruzar backend vs host.

---

## 6. Ligação com o plano

| Passo | Doc |
|-------|-----|
| 1–4 | [`ENVIRONMENT.md`](ENVIRONMENT.md), migrations, secrets, release |
| 5 | Este arquivo |
| 6 | [`INCIDENT_RESPONSE.md`](INCIDENT_RESPONSE.md) — resposta a incidentes (severidade, DERC, post-mortem) |
