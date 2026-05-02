# 📊 PERFORMANCE AUDIT - Phase A (Diagnóstico)

**Data da Auditoria:** 2026-04-29
**Estado:** Finalizado

---

## 1. Estado Atual do Bundle

| Métrica | Valor |
|---------|-------|
| **Total JS Size (Raw)** | 9.86 MB |
| **Total JS Size (Gzipped - approx)** | ~1.4 MB |
| **Total CSS Size** | 192.51 KB |
| **JS Chunks** | 56 |
| **CSS Chunks** | 1 |
| **Tempo de Build** | ~60s |

### Top 5 Maiores Chunks (Raw)
1. 🔴 `assets/index-Ct_DuT9K.js` - **6.58 MB** (Main Bundle / Data Asset)
2. 🟡 `assets/dash.all.min-B7SfqX9N.js` - **992.84 KB** (Dash.js Library)
3. 🟡 `assets/index-9M0TYVFr.js` - **528.63 KB** (Unknown Module / Internal)
4. 🟡 `assets/hls-DOrn6Lom.js` - **522.87 kB** (HLS.js Library)
5. 🟡 `assets/BarChart-BXITzQdF.js` - **369.62 kB** (Recharts / D3)

---

## 2. Gargalos Identificados

| Problema | Severidade | Justificativa |
|----------|------------|---------------|
| **Mega Chunk (Main)** | 🔴 Alto | O chunk `index-...js` de 6.5MB está superando todos os limites. Provavelmente contém o banco de 12k questões injetado estaticamente no código. Isso impede que o app carregue rápido, pois o browser precisa parsear esse JS gigante logo no início. |
| **Bibliotecas de Vídeo Pesadas** | 🟡 Médio | `dash.js` e `hls.js` somam quase 1.5MB. Elas só são necessárias se o usuário abrir players de vídeo específicos (VideoSummarizer). Atualmente parecem estar sendo carregadas sem uma estratégia de lazy-loading agressiva o suficiente ou estão em chunks compartilhados. |
| **Visualização de Dados (Recharts)** | 🟡 Médio | `BarChart` e dependências (D3) estão ocupando 370KB. Esses componentes só são necessários na `StatsView`. |
| **Vendor Chunks Não Otimizados** | 🟢 Baixo | Embora tenhamos `vendor-react` e `vendor-utils`, o `vendor-utils` (Zustand, Framer Motion, Lucide) está em ~180KB (gzipped: 54KB). Pode ser melhorado quebrando por biblioteca. |

---

## 3. Recomendações Priorizadas (T.48-B)

| Ordem | Ação | Impacto Estimado | Esforço |
|-------|------|------------------|---------|
| 1 | **Externalizar/Async Load do Banco de Dados** (12k questões). Transformar `.ts` em `.json` e carregar via `fetch()` ou dynamic import sob demanda. | **-6.2 MB** no bundle JS | M |
| 2 | **Lazy Load Estrito de Video Libs**. Garantir que `dash.js` e `hls.js` só sejam baixados ao entrar na `VideoSummarizer`. | **-1.5 MB** no inicial | S |
| 3 | **Fragmentar Vendor Utils**. Separar `framer-motion` do resto do vendor, pois é pesado e nem todo componente usa animações complexas. | **-100 KB** no share chunk | S |
| 4 | **Otimização de Recharts**. Verificar se estamos importando apenas os módulos necessários de `recharts`. | **-100-200 KB** | S |

---

## 4. Métricas de Referência (Baseline)

- **Lighthouse (Simulado):** Provável score crítico em TBT (Total Blocking Time) e LCP devido ao tamanho do main chunk.
- **Bundle JS Total:** 9.86 MB.
- **Critical Path:** Atualmente bloqueado pelo carregamento do banco de dados estático.

---

**Veredito do Escudeiro:** 
O principal vilão é a injeção estática de dados massivos no bundle JS. Resolver isso (Ação #1) trará o maior ganho de performance imediato, reduzindo o bundle JS em mais de 60%.
