import { isSupabaseConfigured, supabase } from '../supabase';
import type { BillingPeriod, PlanTier } from '../../services/paymentService';

export type CreateMpPreferenceResult =
  | { ok: true; url: string }
  | { ok: false; message: string };

/**
 * Invoca Edge Function `create-mp-preference` (requer sessão Supabase + deploy da função).
 */
export async function createMpPreferenceCheckout(
  plan: PlanTier,
  period: BillingPeriod,
): Promise<CreateMpPreferenceResult> {
  if (!isSupabaseConfigured) {
    return { ok: false, message: 'Supabase não configurado.' };
  }

  const { data, error } = await supabase.functions.invoke('create-mp-preference', {
    body: { plan, period },
  });

  if (error) {
    return { ok: false, message: error.message || 'Falha ao criar checkout.' };
  }

  const payload = data as { url?: string; error?: string } | null;
  const url = payload && typeof payload.url === 'string' ? payload.url : '';
  if (!url) {
    const detail =
      payload && typeof payload.error === 'string' ? payload.error : 'Resposta inválida do servidor.';
    return { ok: false, message: detail };
  }

  return { ok: true, url };
}
