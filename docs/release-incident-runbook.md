# Runbook de Incidentes (5 min)

## Objetivo

Restaurar operação rapidamente em produção quando houver falha crítica após deploy.

## 0) Regra de ouro

- Priorizar mitigação rápida.
- Não fazer refactor durante incidente.
- Se necessário, executar rollback do deploy.

---

## 1) Falha de autenticação (Supabase/Auth)

### Sintomas

- Usuário não consegue logar.
- Sessão cai imediatamente após login.
- Tela volta para login em loop.

### Checagem rápida

- Validar `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` no ambiente de produção.
- Confirmar domínio/redirect permitido no painel do Supabase.
- Verificar erros 401/403 no DevTools (Network) e console.

### Mitigação imediata

- Corrigir env e redeploy rápido.
- Se erro começou no último deploy, rollback.

---

## 2) Falha em pagamento/checkout

### Sintomas

- Checkout não abre.
- Fluxo premium não conclui.
- Webhook não atualiza status.

### Checagem rápida

- Confirmar variáveis de pagamento no ambiente correto.
- Validar URL de webhook em produção.
- Verificar erros 4xx/5xx no endpoint de pagamento.

### Mitigação imediata

- Corrigir configuração de ambiente e revalidar fluxo.
- Se necessário, desativar temporariamente CTA de compra até normalizar.

### 2.1) Pagamento aprovado no Mercado Pago, mas plano não atualiza no app

**Sintomas:** usuário mostra comprovante “aprovado”; conta continua free; Premium não abre.

**Checagem rápida (ordem):**

1. **Webhook:** painel Mercado Pago → integrações / webhooks → últimas entregas: status HTTP (esperado 2xx). Corpo rejeitado ou timeout?
2. **Função receptora:** logs no Vercel (ou host da Edge Function) no horário do pagamento; assinatura secreta do webhook validada?
3. **Supabase:** registro do usuário / tabela de assinatura (conforme schema do projeto): campo de plano ou `premium_until` atualizado?
4. **Cliente:** usuário fez logout/login após alguns minutos? Cache de sessão antiga?
5. **Ambiente:** webhook aponta para URL de **produção**, não preview antigo; secret MP corresponde ao ambiente (prod vs sandbox).

**Mitigação imediata:**

- Corrigir URL/secret do webhook e redeploy; reenviar notificação de teste no MP quando disponível.
- **Atendimento:** atualizar plano manualmente no Supabase **só** com procedimento interno documentado e comprovante (evitar bypass sistemático).
- Comunicar ao usuário pelo canal de suporte com prazo de regularização.

**Pós-incidente:** adicionar alerta manual pós-deploy (primeira compra do dia) conforme [`OBSERVABILITY.md`](OBSERVABILITY.md).

### 2.2) Compra aprovada na Play Store / App Store, mas plano não atualiza

**Sintomas:** usuário mostra assinatura ativa na loja; app continua free.

**Checagem rápida:**

1. **Recibo / Purchase Token:** backend está recebendo e validando com a API da Google ou Apple?
2. **Logs** da função de validação (Vercel/Supabase): 401, assinatura inválida, bundle ID errado?
3. **Sandbox vs produção:** conta de teste na loja correta; produto e grupo de assinatura batendo com o app publicado.
4. **Supabase:** atualização de `plan` / entitlement após validação bem-sucedida.

**Mitigação:** corrigir credenciais da loja no servidor, mapeamento de `productId`, ou bug na persistência; atendimento manual só com comprovante da loja.

---

## 3) Rota branca/tela vazia

### Sintomas

- App abre, mas fica branca.
- Alguma rota principal quebra sem renderizar.

### Checagem rápida

- Abrir console e capturar erro JS principal.
- Verificar se chunk dinâmico falhou (`Failed to fetch dynamically imported module`).
- Forçar hard reload para invalidar cache antigo.

### Mitigação imediata

- Se erro de chunk/caching: incrementar versão/deploy para invalidar cache.
- Se erro lógico de código: rollback do deploy.

---

## 4) Falha de PWA/service worker

### Sintomas

- App não atualiza após deploy.
- Assets antigos carregando.
- Comportamento inconsistente offline/online.

### Checagem rápida

- DevTools > Application > Service Workers.
- Confirmar SW ativo e versão esperada.
- Testar hard reload e navegação em rotas principais.

### Mitigação imediata

- Publicar novo build para renovar manifest/chunks.
- Pedir atualização forçada para usuários críticos (hard refresh).

---

## 5) Critério de rollback

Executar rollback se qualquer condição abaixo ocorrer:

- Login indisponível por mais de 5 min.
- Checkout indisponível por mais de 5 min.
- Rota principal quebrada sem workaround.
- Erro crítico em massa após deploy.

---

## 6) Pós-incidente (obrigatório)

- Registrar causa raiz.
- Documentar correção aplicada.
- Adicionar teste para prevenir recorrência.
- Atualizar checklist de release se necessário.

