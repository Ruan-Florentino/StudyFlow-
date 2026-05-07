/**
 * Eventos de conversão — hoje: CustomEvent + log em DEV.
 * Plug: GTM / PostHog / etc. ouvindo `studyflow:analytics` no `window`.
 */
export type PremiumAnalyticsEvent =
  | 'premium_page_viewed'
  | 'premium_plan_clicked'
  | 'premium_purchase_started'
  | 'premium_redirect_checkout'
  | 'premium_checkout_viewed'
  | 'premium_checkout_completed'
  | 'premium_paywall_cta';

export function trackPremiumEvent(
  name: PremiumAnalyticsEvent,
  payload?: Record<string, unknown>
): void {
  const detail = { name, ...payload, ts: Date.now() };
  if (import.meta.env.DEV) {
    console.log('[premium-analytics]', detail);
  }
  try {
    window.dispatchEvent(new CustomEvent('studyflow:analytics', { detail }));
  } catch {
    /* ignore */
  }
}
