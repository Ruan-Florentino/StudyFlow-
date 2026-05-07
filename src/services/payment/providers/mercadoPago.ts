import { PAYMENT_RUNTIME_CONFIG } from '../config';
import type {
  CheckoutParams,
  CheckoutResult,
  PaymentStatus,
  UnifiedPaymentProvider,
} from '../types';

const log = (...a: unknown[]) => {
  console.log('[MP]', ...a);
};

/**
 * Provedor Mercado Pago — **dormente** até `activeProvider === 'mercadoPago'` e `enabled === true`.
 *
 * - **Checkout / preferências:** devem ser criados no **backend** (token secreto).
 * - **Cliente:** recebe apenas `init_point` ou dados do Brick; nunca o `access_token`.
 * - Pacote npm `mercadopago` é opcional (Bricks); preferências via REST na Edge Function.
 */
export class MercadoPagoPaymentProvider implements UnifiedPaymentProvider {
  async createCheckout(params: CheckoutParams): Promise<CheckoutResult> {
    const { mercadoPago } = PAYMENT_RUNTIME_CONFIG;
    if (!mercadoPago.enabled) {
      log('blocked — mercadoPago.enabled is false');
      throw new Error('[MP] Mercado Pago desligado (config.mercadoPago.enabled).');
    }

    log('createCheckout — use Edge Function', {
      planId: params.planId,
      amount: params.amount,
      env: mercadoPago.environment,
    });

    throw new Error(
      '[MP] Crie a preferência no servidor (POST /checkout/preferences) e redirecione com init_point. Ver docs/mercado-pago-setup.md'
    );
  }

  async getPaymentStatus(paymentId: string): Promise<PaymentStatus> {
    log('getPaymentStatus — implementar na Edge Function', paymentId);
    return {
      id: paymentId,
      status: 'unknown',
      detail: 'Consulte pagamentos no backend (GET /v1/payments/:id).',
    };
  }

  async cancelSubscription(preapprovalId: string): Promise<void> {
    log('cancelSubscription — implementar na Edge Function', preapprovalId);
    void preapprovalId;
    throw new Error('[MP] Cancelamento de assinatura (preapproval) só no servidor.');
  }
}
