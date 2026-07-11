# Release Ready Now

## Mensagens prontas (copiar/colar)

### 1) Pré-deploy

`[DEPLOY][PRE] Iniciando deploy da Athena em produção agora. Janela estimada: 15 min. Escopo: pacote de release operacional + otimizações de precache PWA. Risco: baixo.`

### 2) Deploy em andamento

`[DEPLOY][RUN] Deploy em andamento. Build: OK. Migração: N/A (neste pacote). Smoke inicial: em execução.`

### 3) Deploy concluído (sucesso)

`[DEPLOY][OK] Deploy concluído. Checks: lint ✅ test ✅ build ✅ smoke ✅. Status: operação normal.`

### 4) Alerta (se necessário)

`[DEPLOY][ALERTA] Detectado incidente pós-deploy: __. Impacto: __. Mitigação em curso. Próxima atualização em 5 min.`

## Comandos pré-check (se quiser repetir rapidamente)

```bash
npm run -s lint
npm run -s test
npm run build
```

## Referências operacionais

- `docs/release-card.md`
- `docs/release-commands-cheatsheet.md`
- `docs/release-incident-runbook.md`

