# Produto — foco e clareza (primeiro bloco rumo a 10/10)

Checklist **estratégico** (não é código). Execute na ordem; cada item pode virar COMANDO de implementação depois.

---

## Passo 1 — Uma jornada principal

- [ ] Escolher **uma** jornada nomeada (ex.: *“30 min hoje”*: Foco → Questões filtradas → Revisão de erros).  
- [ ] Escrever em **1 frase** o resultado que o aluno sente ao terminar.  
- [ ] Definir **de onde entra** (Dashboard? Bottom nav? Notificação?).  
- [ ] Listar **3 telas máximas** nesse happy path.  
- [ ] Decidir se isso vira **feature explícita** (“Iniciar meu plano de hoje”) ou só organização de UI.  
- [ ] Medir depois: % que completam o 1º passo da jornada (mesmo que planilha manual na primeira versão).

---

## Passo 2 — Hierarquia na Home / Dashboard

- [ ] **1 CTA dominante** (ação do dia — ex.: continuar estudo / foco).  
- [ ] Até **3 ações secundárias** visíveis sem scroll longo no mobile.  
- [ ] Demais ferramentas: seção **“Ver tudo”** ou agrupadas por objetivo (não por nome técnico).  
- [ ] Revisar se **Premium / paywall** atrapalha o CTA principal (timing e copy).  
- [ ] Garantir que **voltar** do fluxo principal não perde contexto (filtros, última rota).  
- [ ] Screenshot **antes/depois** para não regredir em redesigns futuros.

---

## Passo 3 — Mapa de conteúdo por objetivo

- [ ] Agrupar rotas em **4–6 buckets** (ex.: Prova, Prática, Métodos, Comunidade, Conta).  
- [ ] Cada bucket com **1 linha** de promessa ao usuário.  
- [ ] Command palette / busca alinhada aos mesmos nomes (evitar sinônimos antigos).  
- [ ] Remover ou **esconder** rotas mortas ou duplicadas da navegação principal.  
- [ ] Documentar no [`ENVIRONMENT.md`](ENVIRONMENT.md) ou wiki interna **qual URL é canônica** quando houver duas entradas.  
- [ ] Validar com 1 usuário real (5 min de teste guerrilha).

---

## Passo 4 — Onboarding curto (3 passos)

- [ ] Pergunta 1: **objetivo** (vestibular, concurso, reforço).  
- [ ] Pergunta 2: **tempo semanal** ou “quando estuda”.  
- [ ] Pergunta 3: **matérias fracas** ou prova alvo.  
- [ ] Persistir no **perfil** / `localStorage` + sync Supabase quando existir coluna.  
- [ ] Após concluir: **deep link** para jornada principal (passo 1).  
- [ ] Opção **pular** sem bloquear o app (não prender usuário).

---

## Passo 5 — Copy audit (glossário único)

- [ ] Lista de **10 termos** proibidos ou deprecados (ex.: jargão sci-fi residual).  
- [ ] Lista de **10 termos canônicos** (Mentoria, Questões, Foco, etc.).  
- [ ] Varredura em **rotas mais usadas** (Dashboard, Questões, Explore, Perfil).  
- [ ] Varredura em **componentes compartilhados** (toasts, empty states, erros).  
- [ ] Atualizar **command palette** e labels de nav com o glossário.  
- [ ] Congelar glossário — ver [`GLOSSARY.md`](GLOSSARY.md) (atualizar ao mudar naming).

---

## Passo 6 — Métrica mínima de sucesso

- [ ] Escolher **1 métrica norte** (ex.: sessões de foco iniciadas / semana).  
- [ ] Escolher **1 métrica de retenção** (ex.: retorno D7 após primeiro uso da jornada principal).  
- [ ] Instrumentar **só o necessário** (evento no client ou log server-side) — sem excesso de PII.  
- [ ] Revisar números **semanalmente** (15 min).  
- [ ] Decisão: se métrica cai após release, **rollback** ou **hotfix** conforme [`RELEASE_CHECKLIST.md`](RELEASE_CHECKLIST.md).  
- [ ] Conectar com post-mortem se queda for pós-incidente ([`INCIDENT_RESPONSE.md`](INCIDENT_RESPONSE.md)).

---

## Próximo bloco de produto

- Estados de UI: [`PRODUCT_UX_STATES.md`](PRODUCT_UX_STATES.md).  
- Copy canônica: [`GLOSSARY.md`](GLOSSARY.md).  
- Credibilidade de dados: [`PRODUCT_DATA_TRUST.md`](PRODUCT_DATA_TRUST.md).  
- A11y: [`PRODUCT_A11Y.md`](PRODUCT_A11Y.md).

Quando um item virar implementação no código, use o protocolo do projeto (**COMANDO T.X**) para não misturar escopos.
