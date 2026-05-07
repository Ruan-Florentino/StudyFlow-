# Release Commands Cheatsheet

## Preflight local

```bash
npm run -s lint
npm run -s test
npm run build
```

## Verificar estado git (antes de publicar)

```bash
git status --short
git log -1 --oneline
```

## Conferência rápida de build/PWA

```bash
npm run build
```

Esperado no final:
- `PWA ... precache ...`
- sem erro de TypeScript/build

## Smoke manual (roteiro curto)

1. Login/logout
2. Rotas: `/`, `/questoes`, `/exames`, `/estatisticas`
3. Questões: abrir/responder/feedback
4. Simulado: iniciar/finalizar
5. Checkout/sucesso (ambiente controlado)

## Troubleshooting rápido

### Testes quebraram

```bash
npm run -s test
```

Corrigir teste determinístico primeiro (mocks/timers), depois reexecutar.

### Build falhou

```bash
npm run -s lint
npm run build
```

Resolver tipo/import quebrado antes de novo deploy.

## Rollback (conceitual)

1. Acionar rollback no provedor de deploy para a versão anterior estável.
2. Confirmar rotas principais e login após rollback.
3. Comunicar status com template em `docs/release-status-template.md`.

## Referências

- `docs/release-card.md`
- `docs/release-checklist.md`
- `docs/release-incident-runbook.md`
- `docs/release-summary.md`

