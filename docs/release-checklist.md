# Checklist de Release (15 min)

## 1) Gate técnico local (3-5 min)

- [ ] Rodar `npm run -s lint`
- [ ] Rodar `npm run -s test`
- [ ] Rodar `npm run build`
- [ ] Confirmar que não há erro de TypeScript, Vitest ou build

## 2) Verificação de ambiente (2 min)

- [ ] Confirmar variáveis de produção configuradas
- [ ] Validar `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`
- [ ] Validar variáveis de pagamento no ambiente correto (sem segredo indevido no client)
- [ ] Confirmar que webhooks/URLs externas apontam para produção
- [ ] Se assinatura real: **lojas** (Play/App Store) com produto + validação de recibo testados em staging; ou webhook PSP web se usar checkout fora da loja
- [ ] Vercel: após mudar `VITE_*`, novo deploy executado (build não pega env antigo)

## 3) Smoke funcional (5 min)

- [ ] Login/logout funcionando
- [ ] Navegação principal carregando (`/`, `/questoes`, `/exames`, `/estatisticas`)
- [ ] Fluxo de questões (abrir, responder, feedback)
- [ ] Fluxo de simulado (início, progresso, conclusão)
- [ ] Fluxo de premium (checkout/sucesso) em ambiente de teste controlado
- [ ] Telas `/premium` e `/premium/checkout`: avisos ao consumidor (CDC) visíveis; links Termos / Privacidade / Suporte
- [ ] Roteiro detalhado pago: [`smoke-test-premium.md`](smoke-test-premium.md)

## 4) PWA e cache (2 min)

- [ ] Hard reload com service worker atualizado
- [ ] Abrir app, navegar rotas-chave e confirmar carregamento estável
- [ ] Teste offline básico após navegação inicial (abrir novamente sem rede)

## 5) Pós-deploy imediato (2 min)

- [ ] Monitorar erros JS/client nos primeiros minutos
- [ ] Monitorar auth (taxa de falha)
- [ ] Monitorar integração de pagamento (webhook PSP **ou** fila de notificações / logs de validação de recibo das lojas)
- [ ] Se possível: compra sandbox na loja ou transação web de teste e conferência de plano no backend
- [ ] Confirmar sem regressões críticas em produção

---

## Critério GO / NO-GO

- **GO:** lint + test + build verdes, smoke funcional OK, env de produção validado.
- **NO-GO:** qualquer falha em autenticação, pagamento, build, ou erro crítico de rota principal.

## Referência

- Runbook de incidentes: `docs/release-incident-runbook.md`
- Revisão jurídica (advogado): `docs/legal-review-checklist.md`

