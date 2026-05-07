# Resposta a incidentes (passo 6 — expandido)

Runbook para quando **produção** ou **dados** estiverem em risco. Mantenha este arquivo acessível ao time (Notion link, README, etc.).

---

## 1. Severidade (sugestão)

| Nível | Exemplo | Tempo de resposta alvo |
|-------|---------|-------------------------|
| **S1** | Vazamento de `service_role` / chave OpenRouter no client; DB exposto | Imediato |
| **S2** | Auth quebrada; proxy IA 5xx em massa; perda de dados usuário | meta: menos de 1 h |
| **S3** | Feature degradada; rate limit agressivo demais; bug UI crítico | meta: 1 dia útil |

---

## 2. Fluxo DERC + comunicação

1. **Detectar** — alerta, log, usuário, monitoração manual ([`OBSERVABILITY.md`](OBSERVABILITY.md)).  
2. **Estabilizar (conter)** — reduzir dano sem “consertar tudo”: desligar rota, aumentar limite, rollback deploy, revogar chave ([`SECRETS_ROTATION.md`](SECRETS_ROTATION.md)).  
3. **Eradicar** — causa raiz: patch, migration, config, código.  
4. **Recuperar** — smoke completo ([`RELEASE_CHECKLIST.md`](RELEASE_CHECKLIST.md)); confirmar métricas normais.  
5. **Registrar** — post-mortem curto (modelo abaixo).

**Comunicação:** usuários afetados merecem mensagem honesta e curta (status page, Instagram, email) — sem detalhe técnico de exploit.

---

## 3. Papéis (time pequeno)

| Papel | Responsabilidade |
|-------|------------------|
| **Incident commander** | Decide conter vs continuar investigando; cronometra |
| **Executor** | Deploy, SQL, painel Supabase/Vercel |
| **Comms** | Texto pro usuário se S1/S2 |

Num time de uma pessoa, você faz os três com checklist.

---

## 4. Checklist S1 (segredo vazado)

- [ ] Revogar/regenerar chave **agora** (OpenRouter / Supabase service role).  
- [ ] Atualizar env no **host** + redeploy.  
- [ ] Buscar no repo e histórico se o segredo foi commitado (git log, GitHub secret scan).  
- [ ] Se commit público: assumir chave comprometida mesmo após delete do commit.  
- [ ] Documentar em post-mortem.

---

## 5. Post-mortem (modelo)

```
Data:
Severidade:
Duração (detectado → resolvido):
Impacto (usuários / dados):

Linha do tempo (bullet):
Causa raiz:
O que funcionou:
O que falhou:

Ações (owner + prazo):
- [ ]
```

Arquive em pasta interna (`/incidents/2026-05-06-openrouter.md`).

---

## 6. Ligação com outros docs

- [`OBSERVABILITY.md`](OBSERVABILITY.md) — detecção e logs  
- [`SECRETS_ROTATION.md`](SECRETS_ROTATION.md) — rotação  
- [`RELEASE_CHECKLIST.md`](RELEASE_CHECKLIST.md) — validação pós-fix  
- [`ENVIRONMENT.md`](ENVIRONMENT.md) — índice do plano operacional  

**Próximo eixo (produto):** [`PRODUCT_FOCUS.md`](PRODUCT_FOCUS.md) — clareza de jornada e home.
