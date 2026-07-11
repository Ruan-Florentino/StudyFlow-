# Mercado Pago — ativação (opcional / web)

> **Estratégia atual do produto:** assinatura paga prevista via **Google Play Billing** e **Apple App Store** após publicação do app nativo. Este arquivo serve para **PWA/site** ou fluxo híbrido; não é obrigatório se você não vender pelo web.
>
> Integração web (Checkout Pro + Edge Functions) fica **opcional** quando o lançamento for focado nas lojas.

## Pré-requisitos

- [ ] Conta Mercado Pago aprovada
- [ ] CNPJ ou CPF cadastrado conforme regras do MP
- [ ] Credenciais de **produção** (e sandbox para testes)

## Variáveis de ambiente

No `.env` local / CI (não commitar valores reais):

```env
# Apenas chave pública no front (Bricks / identificação)
VITE_MP_PUBLIC_KEY=APP_USR-xxx

# Token de acesso: NÃO use prefixo VITE_ em produção pública.
# Preferir Edge Function (backend) com secret.
VITE_MP_ACCESS_TOKEN=

VITE_MP_WEBHOOK_URL=https://seu-dominio.com/functions/v1/mp-webhook
```

## Ativar o provider

Em `src/services/payment/config.ts`:

1. `activeProvider: 'mercadoPago'`
2. `mercadoPago.enabled: true`
3. `mercadoPago.environment: 'production'` (após testes em sandbox)

Implemente na **Edge Function**:

- `POST` criando [preferência](https://www.mercadopago.com.br/developers/pt/reference/preferences/_checkout_preferences/post) (Checkout Pro) **ou** fluxo com [Pix](https://www.mercadopago.com.br/developers/pt/docs/checkout-api/integration-configuration/integrate-pix) / cartão conforme produto.
- Webhook validando assinatura e atualizando `plan` do usuário no backend.

Depois, nas telas, troque o uso de `paymentService` legado por `getUnifiedPaymentProvider()` e trate `init_point` / retorno do Brick.

## Webhook (painel MP)

- URL pública da Edge Function: `https://<project-ref>.backend.co/functions/v1/mp-webhook`
- Eventos sugeridos: **payment** (Checkout Pro / pagamentos avulsos).
- Secrets no backend (Dashboard → Edge Functions → **Secrets**):
  - `MERCADOPAGO_ACCESS_TOKEN` — token de produção ou sandbox
  - `MERCADOPAGO_WEBHOOK_SECRET` — assinatura gerada no painel MP (recomendado; sem isso a função não valida `x-signature`)
- Deploy (CLI): `backend functions deploy mp-webhook`
- **Preferência / pagamento** devem enviar:
  - `external_reference`: UUID do usuário (`public.users.id`, igual ao `auth.users.id`)
  - `metadata.studyflow_plan`: `premium` ou `supremo`  
  Sem `external_reference`, o webhook responde `200` com `missing_external_reference` (evita loop de retentativas) e **não** altera o banco.

Links fixos do painel MP **não** costumam incluir `external_reference` por comprador. Para produção, use a Edge Function **`create-mp-preference`** (JWT obrigatório):

- Deploy: `backend functions deploy create-mp-preference`
- Secrets: `MERCADOPAGO_ACCESS_TOKEN`, **`PUBLIC_APP_URL`** (URL do app, ex. `https://app.seudominio.com` — usada em `back_urls`)
- Opcional: `MERCADOPAGO_ENV=sandbox` (usa `sandbox_init_point`); overrides de preço `CHECKOUT_PRICE_PREMIUM_MONTHLY`, `CHECKOUT_PRICE_PREMIUM_YEARLY`, `CHECKOUT_PRICE_SUPREMO_MONTHLY`, `CHECKOUT_PRICE_SUPREMO_YEARLY`
- Front: `VITE_ENABLE_MP_EDGE_CHECKOUT=true` (e usuário logado). Se também existir `VITE_CHECKOUT_*` para o plano/período, o link estático tem prioridade.

A função define `external_reference` = `auth.uid()` e `metadata.studyflow_plan`, e aponta `notification_url` para `mp-webhook`.

## Testes antes de produção

- [ ] Pix (QR / copia e cola) em sandbox
- [ ] Cartão aprovado (cartões de teste MP)
- [ ] Cartão recusado
- [ ] Webhook recebido e idempotente
- [ ] Renovação / preapproval (se usar assinatura nativa MP)
- [ ] Cancelamento

## Google Play — política de pagamentos

A Google Play exige **Google Play Billing** para a maioria dos **conteúdos digitais** consumidos no app Android.

- **Web / PWA:** Mercado Pago costuma ser viável para assinatura.
- **App nativo Android vendendo premium in-app:** em geral use **Play Billing**; MP pode servir para fluxos fora da loja (ex.: site) conforme assessoria jurídica.

Verifique o enquadramento antes de publicar.

## SDK npm `mercadopago`

Opcional, para [Checkout Bricks](https://www.mercadopago.com.br/developers/pt/docs/checkout-bricks/landing):

```bash
npm install mercadopago
```

O projeto **não** adiciona essa dependência por padrão; adicione quando for integrar Bricks no front.
