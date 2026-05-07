export type PaymentCurrency = 'BRL';

export type PaymentMethodPreference = 'pix' | 'credit_card' | 'boleto';

export type CheckoutPaymentStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'cancelled'
  | 'refunded'
  | 'unknown';

export interface CheckoutParams {
  planId: string;
  userId: string;
  amount: number;
  currency: PaymentCurrency;
  paymentMethods?: PaymentMethodPreference[];
  /** Metadados serializáveis (evite PII desnecessária). */
  metadata?: Record<string, string>;
}

export interface CheckoutResult {
  /** ID da preferência / pagamento no PSP (quando existir). */
  id: string;
  /** URL de redirect (Checkout Pro / init_point). */
  initPoint?: string;
  /** QR Pix em base64 ou payload — preenchido quando aplicável. */
  pixQrData?: string;
  raw?: unknown;
}

export interface PaymentStatus {
  id: string;
  status: CheckoutPaymentStatus;
  detail?: string;
}

/**
 * Contrato unificado para provedores (FASE 2 — uso futuro além do mock legado em paymentService.ts).
 */
export interface UnifiedPaymentProvider {
  createCheckout(params: CheckoutParams): Promise<CheckoutResult>;
  getPaymentStatus(id: string): Promise<PaymentStatus>;
  cancelSubscription(id: string): Promise<void>;
}
