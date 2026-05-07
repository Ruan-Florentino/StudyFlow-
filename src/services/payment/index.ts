/**
 * Camada de pagamento unificada (FASE 2).
 * O fluxo atual da UI continua usando `src/services/paymentService.ts` (mock legado).
 * Quando migrar telas, use `getUnifiedPaymentProvider()`.
 */
import { PAYMENT_RUNTIME_CONFIG } from './config';
import type { UnifiedPaymentProvider } from './types';

export type {
  CheckoutParams,
  CheckoutPaymentStatus,
  CheckoutResult,
  PaymentCurrency,
  PaymentMethodPreference,
  PaymentStatus,
  UnifiedPaymentProvider,
} from './types';

export { PAYMENT_RUNTIME_CONFIG } from './config';

export async function getUnifiedPaymentProvider(): Promise<UnifiedPaymentProvider> {
  if (PAYMENT_RUNTIME_CONFIG.activeProvider === 'mock') {
    const { MockUnifiedPaymentProvider } = await import('./providers/mock');
    return new MockUnifiedPaymentProvider();
  }

  if (!PAYMENT_RUNTIME_CONFIG.mercadoPago.enabled) {
    console.warn('[MP] activeProvider=mercadoPago mas enabled=false — usando mock unificado');
    const { MockUnifiedPaymentProvider } = await import('./providers/mock');
    return new MockUnifiedPaymentProvider();
  }

  const { MercadoPagoPaymentProvider } = await import('./providers/mercadoPago');
  return new MercadoPagoPaymentProvider();
}
