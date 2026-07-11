# Templates de Status de Deploy

## 1) Pré-deploy

`[DEPLOY][PRE] Iniciando deploy da Athena em produção às __:__. Janela estimada: __ min. Escopo: __. Risco: baixo/médio.`

## 2) Deploy em andamento

`[DEPLOY][RUN] Deploy em andamento. Build: OK/ERRO. Migração: OK/N/A. Smoke inicial: em execução.`

## 3) Deploy concluído (sucesso)

`[DEPLOY][OK] Deploy concluído às __:__. Checks: lint ✅ test ✅ build ✅ smoke ✅. Status: operação normal.`

## 4) Alerta de incidente

`[DEPLOY][ALERTA] Detectado incidente pós-deploy: __. Impacto: __. Mitigação em curso. Próxima atualização em __ min.`

## 5) Rollback executado

`[DEPLOY][ROLLBACK] Rollback executado às __:__ por falha em __. Serviço estabilizado. Próximo passo: análise de causa raiz.`

## 6) Encerramento do incidente

`[DEPLOY][RESOLVIDO] Incidente encerrado às __:__. Causa: __. Correção aplicada: __. Ação preventiva: __.`

