/**
 * Pagamentos — implementação mock.
 *
 * Integração futura:
 * - Stripe Checkout / Customer Portal
 * - Mercado Pago (cartão + Pix)
 * - Substituir `MockPaymentProvider` por provider real mantendo a interface `PaymentProvider`.
 */

export type PlanTier = 'premium' | 'supremo';
export type BillingPeriod = 'monthly' | 'yearly';

export interface StartCheckoutResult {
  sessionId: string;
  /** URL do PSP quando existir (Stripe redirect, MP, etc.) */
  redirectUrl?: string;
}

export interface PaymentProvider {
  startCheckout(input: {
    plan: PlanTier;
    period: BillingPeriod;
    customerEmail?: string | null;
  }): Promise<StartCheckoutResult>;

  /** Confirma pagamento em ambiente de demo (sem webhook). */
  confirmMockPayment(sessionId: string): Promise<{ ok: boolean }>;
}

class MockPaymentProvider implements PaymentProvider {
  async startCheckout(input: {
    plan: PlanTier;
    period: BillingPeriod;
    customerEmail?: string | null;
  }): Promise<StartCheckoutResult> {
    await new Promise((r) => setTimeout(r, 500 + Math.random() * 400));
    const sessionId = `mock_${input.plan}_${input.period}_${Date.now()}`;
    return { sessionId };
  }

  async confirmMockPayment(sessionId: string): Promise<{ ok: boolean }> {
    await new Promise((r) => setTimeout(r, 350));
    if (!sessionId.startsWith('mock_')) return { ok: false };
    return { ok: true };
  }
}

export const paymentService: PaymentProvider = new MockPaymentProvider();

/** Contrato unificado + Mercado Pago (dormente): `src/services/payment/` — `getUnifiedPaymentProvider()`. */
