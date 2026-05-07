# Smoke test — Premium e pagamento (10–15 min)

Roteiro para validar **transparência ao consumidor**, fluxo de checkout (web demo ou lojas) e **sincronização de plano**.

## Pré-requisitos

- Build de produção ou staging com mesmas variáveis `VITE_*` que o deploy alvo.
- Conta de teste no app (e-mail acessível).
- **App nas lojas:** contas sandbox Google Play / App Store Connect, produto de assinatura configurado, servidor validando recibos (quando implementado).
- **Checkout web opcional:** Mercado Pago ou outro PSP + webhook, se ainda usar PWA pago.

## 1) Conteúdo legal e CDC (2 min)

- [ ] Abrir `/premium` e verificar card **“Antes de assinar — consumidor (CDC)”** e nota sobre cenários de exemplo.
- [ ] Links **Termos de Uso**, **Privacidade**, **Suporte** abrem e carregam.
- [ ] Em `/perfil/termos-de-uso`, Seção 4 menciona BRL, lojas (Play/App Store), arrependimento, cancelamento e suporte.

## 2) Preço e resumo (1 min)

- [ ] Valor mensal exibido confere com `src/config/payment.ts` (ex.: R$ 19,99).
- [ ] Lista de benefícios condiz com o que o `PremiumGate` realmente libera (ajustar copy se divergir).

## 3) Checkout (3 min)

- [ ] `/premium/checkout` com usuário logado (se Edge checkout exigir login).
- [ ] Se **live**: badge “Checkout seguro”; lista “Sua compra e seus direitos” visível.
- [ ] Se **demo**: aviso âmbar de ambiente de demonstração visível; nenhuma promessa de cobrança real.

## 4) Pós-compra (5 min) — lojas ou web de teste

- [ ] Concluir compra de teste (sandbox da loja ou fluxo web controlado).
- [ ] Retorno ao app; mensagem coerente.
- [ ] **Backend / Supabase:** plano ou entitlement atualizado conforme validação de recibo (regra do projeto).
- [ ] App: feature premium acessível após refresh ou novo login.
- [ ] Se plano **não** subir: runbook §2.1 (webhook PSP) ou §2.2 (notificações / recibos das lojas).

## 5) Registro

Anotar: data, ambiente (prod/staging), ID de pagamento de teste (se houver), resultado OK/FAIL e link do deploy.

## Ver também

- [`ENVIRONMENT.md`](ENVIRONMENT.md) §3.1 (Vercel e variáveis)
- [`release-checklist.md`](release-checklist.md)
