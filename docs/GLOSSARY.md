# Glossário de produto (copy canônica)

Referência para **nav**, **command palette**, **marketing** e **suporte**. Alinhar novas telas aqui; evitar sinônimos concorrentes na mesma superfície.

> Rotas técnicas (`/ai`, `/questoes`) podem diferir da URL; o usuário vê o **rótulo** abaixo.

---

## Navegação principal e hub

| Usar | Evitar / deprecado |
|------|---------------------|
| **Dashboard** | Mission Control, painel “neural” como marca |
| **Mentoria** | IA Tutor, Athena (marca exposta), “chat IA” genérico como nome de produto |
| **Questões** | “Banco neural”, simulador só como adjetivo se necessário |
| **Modo Foco** | Protocolo neural, “foco quântico” |
| **Explorar** | Modo descoberta (ok como subtítulo, não como nome confuso de produto) |

---

## Métodos e ferramentas (rótulos de rota preferidos)

| Canônico (usuário) | Notas |
|---------------------|--------|
| **Memorização Visual** | ex-Palácio da Memória |
| **Debate Guiado** | ex-Duelo Socrático |
| **Biblioteca Pessoal** | ex-O Arquivo |
| **Estudo Colaborativo** | ex-Mente Colmeia |
| **Laboratório de Ideias** | ex-Forja Neural |
| **Reescrita Inteligente** | ex-Alquimista Neural |
| **Sincronia de Estudos** | ex-Sincronia Neural |
| **Central de Resultados** | ex-Nexus |

---

## Estados e feedback

| Usar | Evitar |
|------|--------|
| **Carregando…** / skeleton | Spinner genérico sem contexto |
| **Não foi possível…** + retry | Erro técnico bruto (stack, código HTTP) |
| **Nenhum resultado** + próximo passo | Tela vazia sem CTA |

---

## Premium e monetização

| Usar | Evitar |
|------|--------|
| **Athena Premium**, **Plus** | “Desbloqueie IA infinita” como promessa vaga |
| **Mentoria ilimitada** (se for o benefício real) | “Poder neural”, “modo deus” |

---

## Dados e credibilidade

- **XP / ligas / rankings**: se forem **locais** ou heurísticos, não vender como “ranking nacional oficial”.  
- **“TOP 5%”** e similares: só usar se houver **definição** e fonte; caso contrário trocar por copy neutra (“Bom momento”) ou remover.

---

## Onde sincronizar

1. `src/app/router/routes.tsx` — `label` das rotas.  
2. `CommandPalette` e `BottomNav`.  
3. Títulos de view (`Header`, hero cards).  
4. Este arquivo ao mudar decisão de naming.

**Relacionados:** [`PRODUCT_UX_STATES.md`](PRODUCT_UX_STATES.md) · [`PRODUCT_DATA_TRUST.md`](PRODUCT_DATA_TRUST.md) · [`PRODUCT_A11Y.md`](PRODUCT_A11Y.md).
