/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />
/// <reference types="vite-plugin-pwa/react" />

interface ImportMetaEnv {
  /** URL POST opcional para ingest de logs de agente (somente dev; ver `devAgentLog`). */
  readonly VITE_DEBUG_INGEST_URL?: string;
  /**
   * `true` | `false` — controla teste de conectividade OpenRouter no mount (ver `openRouterHealthCheck.ts`).
   */
  readonly VITE_OPENROUTER_HEALTHCHECK?: string;
  /** Link HTTPS da preferência Mercado Pago (Checkout Pro) — Premium mensal. */
  readonly VITE_CHECKOUT_PREMIUM_MONTHLY?: string;
  readonly VITE_CHECKOUT_PREMIUM_YEARLY?: string;
  readonly VITE_CHECKOUT_SUPREMO_MONTHLY?: string;
  readonly VITE_CHECKOUT_SUPREMO_YEARLY?: string;
  /**
   * `true` — usa Edge Function `create-mp-preference` quando não há `VITE_CHECKOUT_*` estático.
   * Requer função deployada + usuário logado.
   */
  readonly VITE_ENABLE_MP_EDGE_CHECKOUT?: string;
}
