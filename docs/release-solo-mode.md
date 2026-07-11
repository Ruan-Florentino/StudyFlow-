# Release Solo Mode (1 pessoa)

## Objetivo

Executar deploy com segurança em fluxo enxuto, quando só uma pessoa está operando.

## Janela recomendada (10-15 min)

## 1) Gate local (3 min)

- [ ] `npm run -s lint`
- [ ] `npm run -s test`
- [ ] `npm run build`

Se qualquer item falhar: **NO-GO**.

## 2) Pré-check de produção (2 min)

- [ ] Env de produção conferido (backend + pagamento)
- [ ] Endpoint/webhook crítico validado

## 3) Deploy (2 min)

- [ ] Publicar build
- [ ] Confirmar conclusão sem erro no provedor

## 4) Smoke crítico (4 min)

- [ ] Login/logout
- [ ] Rotas: `/`, `/questoes`, `/exames`
- [ ] Fluxo de questão (abrir/responder)
- [ ] Checkout/sucesso (ou sandbox controlado)

## 5) Decisão (até 2 min)

- **GO:** tudo acima OK.
- **NO-GO + rollback:** login quebrado, checkout quebrado, rota principal em branco.

## 6) Pós-deploy mínimo (2 min)

- [ ] Verificar erros JS no cliente
- [ ] Verificar falhas de auth
- [ ] Verificar webhook/pagamento

---

## Atalho mental (solo)

- `build ok + smoke ok = GO`
- `auth/pay/quebra de rota = rollback`

## Referências

- `docs/release-card.md`
- `docs/release-checklist.md`
- `docs/release-incident-runbook.md`

