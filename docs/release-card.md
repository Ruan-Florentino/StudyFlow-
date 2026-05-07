# Release Card (1 página)

## Pré-deploy (3 min)

- [ ] `npm run -s lint`
- [ ] `npm run -s test`
- [ ] `npm run build`
- [ ] Env de produção OK (Supabase + pagamento)

## Smoke pós-deploy (5 min)

- [ ] Login/logout
- [ ] Rotas: `/`, `/questoes`, `/exames`, `/estatisticas`
- [ ] Questões: abrir/responder/feedback
- [ ] Simulado: iniciar/concluir
- [ ] Premium: checkout/sucesso (ambiente controlado)

## PWA (2 min)

- [ ] Hard refresh
- [ ] SW atualizado
- [ ] Offline básico após navegação inicial

## Monitoramento (5 min)

- [ ] Erros JS
- [ ] Auth failures
- [ ] Pagamento/webhook

## GO / NO-GO

- **GO:** tudo verde acima.
- **NO-GO:** falha em login, checkout, build, ou rota principal.

## Se der ruim (rollback)

Rollback imediato se:
- login quebrado > 5 min
- checkout quebrado > 5 min
- rota principal em branco sem workaround

Referência completa: `docs/release-checklist.md` e `docs/release-incident-runbook.md`.
Templates de comunicação: `docs/release-status-template.md`.
Sequência recomendada: `docs/release-communication-sequence.md`.
Modo solo: `docs/release-solo-mode.md`.

