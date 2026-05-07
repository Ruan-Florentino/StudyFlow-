import type { BillingPeriod, PlanTier } from '../services/paymentService';

const isHttpsUrl = (value: string | undefined): value is string =>
  typeof value === 'string' && (value.startsWith('https://') || value.startsWith('http://localhost'));

/**
 * URLs de checkout hospedadas no Mercado Pago (Checkout Pro / link de pagamento).
 * Crie uma preferência por combinação plano + período no painel ou via API no servidor.
 * Se todas estiverem vazias, o app usa o fluxo mock interno.
 */
export function resolveExternalCheckoutUrl(
  plan: PlanTier,
  period: BillingPeriod
): string | null {
  const env = import.meta.env;

  if (plan === 'supremo') {
    if (period === 'yearly') {
      return isHttpsUrl(env.VITE_CHECKOUT_SUPREMO_YEARLY) ? env.VITE_CHECKOUT_SUPREMO_YEARLY : null;
    }
    return isHttpsUrl(env.VITE_CHECKOUT_SUPREMO_MONTHLY) ? env.VITE_CHECKOUT_SUPREMO_MONTHLY : null;
  }

  if (period === 'yearly') {
    return isHttpsUrl(env.VITE_CHECKOUT_PREMIUM_YEARLY) ? env.VITE_CHECKOUT_PREMIUM_YEARLY : null;
  }
  return isHttpsUrl(env.VITE_CHECKOUT_PREMIUM_MONTHLY) ? env.VITE_CHECKOUT_PREMIUM_MONTHLY : null;
}

export function hasAnyExternalCheckoutUrl(): boolean {
  const env = import.meta.env;
  return [
    env.VITE_CHECKOUT_PREMIUM_MONTHLY,
    env.VITE_CHECKOUT_PREMIUM_YEARLY,
    env.VITE_CHECKOUT_SUPREMO_MONTHLY,
    env.VITE_CHECKOUT_SUPREMO_YEARLY,
  ].some((u) => isHttpsUrl(u));
}
