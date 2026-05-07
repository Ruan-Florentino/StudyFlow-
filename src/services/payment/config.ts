/**
 * Configuração de provedores de pagamento.
 * ⚠️ Não coloque access token secreto em variável VITE_* em produção — use Edge Function / backend.
 */
export const PAYMENT_RUNTIME_CONFIG = {
  /**
   * 🚨 Trocar para 'mercadoPago' quando integração estiver validada (ex.: após Play Store / web).
   * Com 'mock', o app segue o fluxo atual (paymentService legado).
   */
  activeProvider: 'mock' as 'mock' | 'mercadoPago',

  mercadoPago: {
    /** Flag mestre — só efeito quando activeProvider === 'mercadoPago'. */
    enabled: false,
    /** Chave pública (checkout brick / frontend). */
    publicKey: import.meta.env.VITE_MP_PUBLIC_KEY ?? '',
    /**
     * Nunca usar access token com prefixo VITE_ em build público.
     * Mantido aqui só para desenvolvimento local / documentação; produção → Edge Function.
     */
    accessToken: import.meta.env.VITE_MP_ACCESS_TOKEN ?? '',
    webhookUrl: import.meta.env.VITE_MP_WEBHOOK_URL ?? '',
    environment: 'sandbox' as 'sandbox' | 'production',
  },
} as const;
