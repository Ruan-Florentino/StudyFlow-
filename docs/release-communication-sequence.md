# Sequência de Comunicação de Deploy (15 min)

## T-2 min (antes de iniciar)

- Enviar template: **Pré-deploy**
- Objetivo: avisar janela, escopo e risco

## T+0 min (deploy iniciado)

- Enviar template: **Deploy em andamento**
- Objetivo: confirmar início real da execução

## T+3 min (build/migração)

- Atualizar o template: **Deploy em andamento**
- Preencher status de build e migração (`OK`, `ERRO` ou `N/A`)

## T+6 min (smoke inicial)

- Atualizar novamente: **Deploy em andamento**
- Informar progresso do smoke em rotas críticas

## T+10 min (decisão operacional)

- Se tudo OK: enviar template **Deploy concluído (sucesso)**
- Se houver impacto: enviar template **Alerta de incidente**

## T+10 a T+15 min (se incidente)

- Se mitigou sem rollback: atualizar com **Alerta de incidente** + novo ETA
- Se rollback necessário: enviar **Rollback executado**
- Após estabilizar: enviar **Encerramento do incidente**

---

## Regra prática

- Nunca ficar mais de **5 min sem atualização** durante janela ativa.
- Se não houver novidade técnica, enviar status curto mesmo assim.
- Comunicação deve vir sempre com próximo marco/horário.

## Referências

- Templates: `docs/release-status-template.md`
- Card rápido: `docs/release-card.md`
- Checklist completo: `docs/release-checklist.md`
- Runbook de incidentes: `docs/release-incident-runbook.md`

