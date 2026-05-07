# Produto — estados de UI (loading, erro, vazio)

Segundo bloco rumo a 10/10: **consistência** de feedback. Checklist por fluxo; implementação exige **COMANDO T.X** no código.

---

## Princípios

1. Toda tela **assíncrona** tem: **loading** → **sucesso** ou **erro** ou **vazio**.  
2. **Erro**: mensagem em pt-BR curta + ação **Tentar novamente** ou **Voltar**.  
3. **Vazio**: explicar *por que* está vazio + **1 CTA** claro.  
4. Preferir **skeleton** a spinner solto em listas e dashboards (regra do projeto).  
5. Não mostrar **detalhe técnico** (JSON, status 500) ao usuário final.

---

## Passo 1 — Inventário

- [ ] Listar **10 telas** mais usadas (analytics ou opinião do time).  
- [ ] Para cada uma, anotar: tem skeleton? empty state? erro com retry?  
- [ ] Marcar **gaps** (prioridade P0 = login, questões, mentoria, pagamento).  
- [ ] Exportar tabela (sheet) para não perder no chat.  
- [ ] Definir **1 componente** padrão de empty (ex.: ilustração + título + CTA) se ainda não existir.  
- [ ] Definir **1 componente** padrão de erro de rede.

---

## Passo 2 — Padrões visuais

- [ ] Empty: usar tokens (`text-text-secondary`, `primary` no CTA), sem cor hex solta.  
- [ ] Loading: skeleton com **mesma geometria** do conteúdo final (evitar layout shift).  
- [ ] Erro: ícone + uma frase; botão primário **Tentar de novo**; secundário **Voltar**.  
- [ ] Toast: só para **confirmação** curta ou erro não bloqueante; não substituir tela de erro grave.  
- [ ] Acessível: foco no botão de retry após erro ([`GLOSSARY.md`](GLOSSARY.md) + focus-visible já no app).  
- [ ] `prefers-reduced-motion`: reduzir animação em skeleton se possível.

---

## Passo 3 — Fluxos críticos (aceite)

Marque quando estiver OK em **staging**:

| Fluxo | Loading | Erro | Vazio |
|-------|---------|------|--------|
| Dashboard | ☐ | ☐ | ☐ |
| Questões (banco) | ☐ | ☐ | ☐ |
| Explorar | ☐ | ☐ | ☐ |
| Mentoria / proxy IA | ☐ | ☐ | N/A |
| Login / sessão | ☐ | ☐ | ☐ |
| Premium / checkout | ☐ | ☐ | ☐ |

---

## Passo 4 — Mensagens (alinhamento ao glossário)

- [ ] Revisar strings de erro da Mentoria (timeout, 401, quota).  
- [ ] Revisar empty de questões (“nenhum filtro” vs “banco indisponível”).  
- [ ] Garantir que **401** vira “Sessão expirada” + login, não “Erro desconhecido”.  
- [ ] Copiar **3 mensagens** mais vistas nos logs e ajustar copy uma vez.  
- [ ] Documentar mensagens estáveis aqui ou em `GLOSSARY.md` se virarem marca.  
- [ ] Evitar “tente mais tarde” sem ação.

---

## Passo 5 — Mobile

- [ ] Empty/erro ocupam **altura mínima** confortável (não só uma linha no meio da tela).  
- [ ] CTAs com **min-height** tocável (já alinhado nas views críticas).  
- [ ] Teclado não esconde botão de envio em formulários longos.  
- [ ] Testar **3G lento** (DevTools) no fluxo Questões + Mentoria.  
- [ ] Offline: mensagem clara se PWA sem rede (se aplicável).  
- [ ] Screenshot regressão a cada release grande.

---

## Passo 6 — Definição de pronto (PR)

- [ ] PR que mexe em fetch: **3 estados** considerados ou justificativa no texto do PR.  
- [ ] Sem `console.log` novo em produção.  
- [ ] Copy revisada contra [`GLOSSARY.md`](GLOSSARY.md).  
- [ ] Smoke manual 2 min no fluxo alterado.  
- [ ] Se novo padrão: **1 exemplo** na pasta de componentes compartilhados.  
- [ ] Link para este doc no comentário do PR (opcional, até virar hábito).

---

## Próximo bloco

- **Credibilidade de dados:** [`PRODUCT_DATA_TRUST.md`](PRODUCT_DATA_TRUST.md).  
- **A11y:** [`PRODUCT_A11Y.md`](PRODUCT_A11Y.md).
