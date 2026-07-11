# Checklist de release (passo 4)

Use **antes de merge em `main`** ou antes de promover deploy de staging → produção. Tempo alvo: **~10 min** de gates automáticos + smoke manual.

---

## A. Gates automáticos (obrigatório)

Rodar na raiz do repositório.

**PowerShell (Windows):**

```powershell
npm run lint
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
npm run build
```

| Comando | Esperado |
|---------|----------|
| `npm run lint` | `tsc --noEmit` sem erros |
| `npm run build` | `vite build` conclui sem falha |

**Opcional (se o PR mexer em lógica crítica):**

```powershell
npm run test:run
```

---

## B. Smoke manual rápido (~10 min)

Em **local** (`npm run dev`) ou URL de **preview/staging**, com usuário de teste logado quando o fluxo exigir:

| # | Fluxo | Critério de sucesso |
|---|--------|----------------------|
| 1 | Abrir **home / dashboard** | Carrega sem tela branca; sem erro crítico no console |
| 2 | Navegar para **Questões** (`/questoes`) | Lista ou empty state coerente; filtros respondem |
| 3 | Navegar para **Explorar** (`/explorar`) | Busca/áreas abrem |
| 4 | **Login** (se aplicável) | Sessão mantida após refresh |
| 5 | **Mentoria / IA** (rota que usa proxy) | Com usuário logado: resposta ou erro amigável (não 401 silencioso em loop) |
| 6 | **Mobile** (DevTools ou device) | Bottom nav + 1 fluxo crítico usável |

Ajuste rotas se o produto renomear paths; mantenha sempre **6 verificações** cobrindo shell + dados + auth + IA.

---

## C. Antes de apertar “Deploy” no host

- [ ] Branch atualizada com `main` (ou PR sem conflitos).
- [ ] **Variáveis de ambiente** do ambiente alvo conferidas (sem `VITE_*` para segredos).
- [ ] Se houver **migration nova**: já aplicada em staging e smoke SQL ok — ver [`backend_MIGRATIONS.md`](backend_MIGRATIONS.md).
- [ ] **Diff revisado** (sem arquivo acidental: `.env`, tokens, `dist/` indesejado no git).

---

## D. Após deploy (produção)

- [ ] Abrir URL pública e repetir **linhas 1–3** do smoke (mínimo).
- [ ] Verificar **logs** do host nas primeiras 15 min (5xx, CORS, rate limit).

---

## E. Referência rápida de documentos

| Passo | Doc |
|-------|-----|
| Ambientes | [`ENVIRONMENT.md`](ENVIRONMENT.md) |
| Migrations | [`backend_MIGRATIONS.md`](backend_MIGRATIONS.md) |
| Segredos | [`SECRETS_ROTATION.md`](SECRETS_ROTATION.md) |
| Release | Este arquivo |
| Observabilidade | [`OBSERVABILITY.md`](OBSERVABILITY.md) |
| Incidentes | [`INCIDENT_RESPONSE.md`](INCIDENT_RESPONSE.md) |
| Produto — foco | [`PRODUCT_FOCUS.md`](PRODUCT_FOCUS.md) |
| Produto — copy | [`GLOSSARY.md`](GLOSSARY.md) |
| Produto — UI states | [`PRODUCT_UX_STATES.md`](PRODUCT_UX_STATES.md) |
| Produto — dados | [`PRODUCT_DATA_TRUST.md`](PRODUCT_DATA_TRUST.md) |
| Produto — a11y | [`PRODUCT_A11Y.md`](PRODUCT_A11Y.md) |
