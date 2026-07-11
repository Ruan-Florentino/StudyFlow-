# Produto — credibilidade de dados (XP, ligas, rankings)

Objetivo: o usuário **confiar** no que vê. Tudo que for **local / heurístico** deve ser tratado como tal na copy ou sincronizado com **backend** quando a migration de persistência estiver ativa.

---

## 1. Fonte da verdade hoje (referência técnica)

| Dado | Onde vive hoje | Observação |
|------|----------------|------------|
| **XP, level, league, streak, coins, prestige, leaderboard interno** | `useUserStore` (Zustand + **persist** no browser) | Progressão é **por dispositivo** até haver sync explícito com `public.users` / eventos. |
| **Tentativas de questão, sessões, exam runs** | Podem ser persistidas via `lib/persistence` → tabelas `user_question_attempts`, etc., **se** migrations aplicadas e app gravando. |
| **Perfil backend** | `public.users` + RLS | Campos como `longest_streak` na migration podem divergir do Zustand se não houver reconciliação. |

**Regra de produto:** não prometer “ranking nacional” ou “top X% real” sem backend que prove.

---

## 2. Passo 1 — Auditoria de telas (inventário)

- [ ] Listar cada lugar que mostra **XP**, **nível**, **liga**, **streak**, **moedas**, **prestígio**.  
- [ ] Listar textos tipo **“TOP 5%”**, **“melhor que X%”**, **leaderboard** global.  
- [ ] Marcar cada item: **(L)** local apenas, **(S)** servidor, **(M)** misto.  
- [ ] Priorizar **Dashboard**, **Perfil**, **resultado de simulado**, **Premium**.  
- [ ] Tirar **screenshot** da lista para baseline.  
- [ ] Decidir dono do critério (produto + 1 dev).

---

## 3. Passo 2 — Política por tipo de métrica

| Se for… | Política sugerida |
|---------|-------------------|
| **Só local** | Copy neutra: “Seu progresso neste aparelho” **ou** omitir claim competitivo. |
| **Sincronizado** | Copy pode falar “sua conta” após login e sync validado. |
| **Barra / percentil inventado** | Remover ou trocar por “meta pessoal” / progresso relativo ao próprio histórico. |
| **Liga Bronze→Diamante** | Manter como **gamificação local** clara (“sua liga de hábito”) ou amarrar regra a dados reais. |

Documente a decisão numa linha por métrica na coluna “política” da planilha do passo 1.

---

## 4. Passo 3 — Ajuste de copy (rápido)

- [ ] Remover ou suavizar **“TOP 5%”** até haver cálculo definido ([`GLOSSARY.md`](GLOSSARY.md)).  
- [ ] Revisar **subtítulos** de cards que soam como estatística oficial.  
- [ ] Alinhar **tooltips** e **modais** de conquista com a política (local vs conta).  
- [ ] Garantir que **Premium** não use métricas fake como prova social.  
- [ ] Passar texto final pelo [`GLOSSARY.md`](GLOSSARY.md).  
- [ ] Registrar mudanças no changelog interno / release notes.

---

## 5. Passo 4 — Alinhamento técnico (quando for prioridade)

- [ ] Definir **fonte única** para streak longo: Zustand vs coluna `longest_streak` em `public.users`.  
- [ ] Após login: **hidratar** store a partir do backend ou **merge** documentado.  
- [ ] Eventos de XP no servidor: idempotência e anti-cheat básico (rate limit já no proxy).  
- [ ] Testes manuais: logout/login, outro browser — comportamento esperado documentado.  
- [ ] Feature flag se precisar lançar sync em waves.  
- [ ] Atualizar [`ENVIRONMENT.md`](ENVIRONMENT.md) se novas vars forem necessárias.

---

## 6. Passo 5 — Comunicação com o usuário

- [ ] Se houver **reset** de dados locais (PWA, cache): aviso em FAQ / Suporte.  
- [ ] Texto curto em **Perfil** ou **Sobre**: “Progresso sincronizado com a conta quando logado” (se verdade).  
- [ ] Se ainda não houver sync: “Alguns dados ficam neste dispositivo” — honestidade > marketing vazio.  
- [ ] Revisar **Política de privacidade** se coletar novos agregados.  
- [ ] Treinar suporte com 2 frases padrão sobre XP/liga.  
- [ ] Revisar após **6 meses** ou mudança grande de persistência.

---

## 7. Passo 6 — Aceite (definição de pronto)

- [ ] Nenhuma string em **produção** promete ranking/percentil **sem** backend.  
- [ ] Dashboard e Perfil **consistentes** com a política escolhida.  
- [ ] Time sabe responder: “meu XP sumiu?” em 30 s.  
- [ ] Smoke: novo usuário logado não vê claims globais falsas.  
- [ ] Documento este atualizado com data da última auditoria.  
- [ ] Próximo passo opcional: métricas de produto em [`PRODUCT_FOCUS.md`](PRODUCT_FOCUS.md) passo 6.

---

## Ligação

- Migrations: [`backend_MIGRATIONS.md`](backend_MIGRATIONS.md)  
- Copy: [`GLOSSARY.md`](GLOSSARY.md)  
- Estados de UI: [`PRODUCT_UX_STATES.md`](PRODUCT_UX_STATES.md)
