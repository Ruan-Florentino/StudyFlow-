# Rotação de segredos e revisão no host (passo 3)

Use este runbook quando houver **vazamento passado** (ex.: chave em `VITE_*`, commit, print, log público) ou revisão periódica de produção.

> Não commite valores reais. Atualize apenas o **painel de variáveis** do host (Vercel, Railway, VPS, etc.) e o `.env` local.

---

## 1. Inventário rápido (o que pode ter sido exposto)

| Segredo | Onde deve existir | Nunca |
|---------|-------------------|--------|
| `OPENROUTER_API_KEY` | Servidor (`server.ts`), env **sem** `VITE_` | Bundle do browser, repositório, issue |
| `SUPABASE_SERVICE_ROLE_KEY` | Só servidor / Edge com privilégio | Cliente, Vite, screenshot |
| `VITE_SUPABASE_ANON_KEY` | Cliente (público por design) | Tratar como “público”; proteção é RLS |
| `TEST_SUPABASE_ACCESS_TOKEN` | Máquina local / CI secreto | Git, chat |

Se **`VITE_OPENROUTER_API_KEY`** ou chave OpenRouter apareceu no front: considere **comprometida** e rotacione.

---

## 2. OpenRouter

1. Acesse o painel OpenRouter → **API keys**.  
2. **Revogue** a chave antiga (ou crie chave nova e depois revogue a antiga).  
3. No host de **produção** e **staging**, defina `OPENROUTER_API_KEY` = chave nova (variável **server-side** / “Build” só se o build precisar — neste projeto o proxy é runtime Node).  
4. Confirme que **não** existe `VITE_OPENROUTER` ou similar no painel.  
5. Redeploy ou restart do processo Node que serve `/api/ai`.  
6. Smoke: uma chamada autenticada ao proxy de IA (ex.: fluxo “Mentoria” com usuário logado).

---

## 3. Supabase

1. **Anon key**: exposição no client é esperada; rotacione só se política do time exigir (Dashboard → Settings → API → regenerate anon) e atualize `VITE_SUPABASE_ANON_KEY` + apps.  
2. **Service role**: se **qualquer** chance de vazamento, **Project Settings → API → service_role** → gere novo segredo, atualize o host, redeploy; em seguida invalide/rotação conforme doc Supabase.  
3. Verifique que **service role** não está em variável `VITE_*` nem em `dist/`.  
4. Revise **Git history**: se `service_role` entrou em commit, trate como incidente (chave nova + escaneamento).  
5. Opcional: **JWT secret** / rotação de signing só com planejamento (afeta sessões).  
6. Smoke: login, leitura de perfil, uma operação que dependa de RLS.

---

## 4. Host de deploy (ex.: Vercel)

1. Abra **Settings → Environment Variables** (Production / Preview / Development).  
2. Liste todas as chaves que parecem API keys; remova duplicadas ou nomes legados (`VITE_OPENROUTER_*`, etc.).  
3. Garanta: produção com valores finais; preview com projeto **staging** quando possível (não misturar DB de prod em preview).  
4. Confirme que **build** não imprime env (logs de CI).  
5. Após alterar secrets: **Redeploy** o último deployment ou push vazio.  
6. Anote data + responsável num run interno (mesmo que só Notion/issue).

---

## 5. Repositório e máquinas locais

1. `.env` no `.gitignore` — nunca adicionar `-f` com secrets.  
2. Quem clonou o repo: atualizar `.env` local com chaves **novas** após rotação.  
3. `TEST_SUPABASE_ACCESS_TOKEN`: gere novo JWT curto de teste se vazou; não reutilizar em prod.  
4. Busca rápida no repo: `sk-or-`, `service_role`, `eyJ` (JWT) — não deve haver matches em arquivos rastreados.  
5. Se usou chave em script temporário, apagar do histórico de shell compartilhado.  
6. Opcional: **git-secrets** ou pre-commit que bloqueie padrões de chave.

---

## 6. Verificação final

- [ ] OpenRouter: só chave nova ativa; proxy responde em staging.  
- [ ] Supabase: service role só no servidor; anon no client.  
- [ ] Painel do host sem variáveis `VITE_*` de API de terceiros sensíveis.  
- [ ] Smoke manual: login + mentoria + questões (ou script `test-ai.cjs` com token de teste).  
- [ ] Equipe avisada de invalidação da chave antiga.

---

## Próximo passo do plano (passo 4)

Checklist de release: [`RELEASE_CHECKLIST.md`](RELEASE_CHECKLIST.md) (`lint`, `build`, smoke ~10 min).
