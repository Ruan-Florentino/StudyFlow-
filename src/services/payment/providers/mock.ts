import type { CheckoutParams, CheckoutResult, PaymentStatus, UnifiedPaymentProvider } from '../types';

const log = (...a: unknown[]) => {
  if (import.meta.env.DEV) console.log('[payment:mock]', ...a);
};

/**
 * Provedor mock alinhado ao contrato unificado (sem chamadas externas).
 */
export class MockUnifiedPaymentProvider implements UnifiedPaymentProvider {
  async createCheckout(params: CheckoutParams): Promise<CheckoutResult> {
    log('[payment:mock] createCheckout', params.planId, params.amount);
    await new Promise((r) => setTimeout(r, 400));
    const id = `mock_unified_${params.planId}_${Date.now()}`;
    return { id, initPoint: undefined };
  }

  async getPaymentStatus(id: string): Promise<PaymentStatus> {
    log('[payment:mock] getPaymentStatus', id);
    await new Promise((r) => setTimeout(r, 200));
    if (!id.startsWith('mock_')) {
      return { id, status: 'unknown', detail: 'not mock id' };
    }
    return { id, status: 'approved' };
  }

  async cancelSubscription(id: string): Promise<void> {
    log('[payment:mock] cancelSubscription', id);
    await new Promise((r) => setTimeout(r, 200));
  }
}
