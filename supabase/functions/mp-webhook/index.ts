/**
 * Webhook Mercado Pago → atualiza `public.users` após pagamento aprovado.
 *
 * Secrets (Supabase Dashboard → Edge Functions → Secrets):
 * - MERCADOPAGO_ACCESS_TOKEN (obrigatório)
 * - MERCADOPAGO_WEBHOOK_SECRET (recomendado — painel MP → Webhooks → assinatura)
 * - SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (injetados pelo Supabase)
 *
 * Preferência / pagamento devem incluir:
 * - external_reference: UUID do usuário (`auth.users.id` / `public.users.id`)
 * - metadata.studyflow_plan: `premium` | `supremo`
 */
import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-signature, x-request-id',
};

function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) {
    out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return out === 0;
}

async function verifyMercadoPagoSignature(
  secret: string,
  xSignature: string,
  dataId: string,
  xRequestId: string,
): Promise<boolean> {
  const parts = xSignature.split(',').map((s) => s.trim());
  let ts = '';
  let v1 = '';
  for (const part of parts) {
    const eq = part.indexOf('=');
    if (eq === -1) continue;
    const key = part.slice(0, eq).trim();
    const value = part.slice(eq + 1).trim();
    if (key === 'ts') ts = value;
    if (key === 'v1') v1 = value;
  }
  if (!ts || !v1) return false;

  const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(manifest));
  const hex = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return timingSafeEqualHex(hex.toLowerCase(), v1.toLowerCase());
}

function normalizePaymentId(raw: string): string {
  const s = raw.trim();
  if (!s) return '';
  return s.replace(/[A-Z]/g, (c) => c.toLowerCase());
}

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  const accessToken = Deno.env.get('MERCADOPAGO_ACCESS_TOKEN') ?? '';
  const webhookSecret = Deno.env.get('MERCADOPAGO_WEBHOOK_SECRET') ?? '';
  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

  if (!accessToken || !supabaseUrl || !serviceKey) {
    return jsonResponse({ error: 'Server misconfigured' }, 500);
  }

  const url = new URL(req.url);
  let body: Record<string, unknown> = {};
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return jsonResponse({ error: 'Invalid JSON' }, 400);
  }

  const dataRaw = body.data as { id?: string | number } | undefined;
  const fromBody = dataRaw?.id != null ? String(dataRaw.id) : '';
  const fromQueryDataId = url.searchParams.get('data.id') ?? '';
  const fromQueryId = url.searchParams.get('id') ?? '';
  const paymentId = normalizePaymentId(fromBody || fromQueryDataId || fromQueryId);

  const notifType = String(body.type ?? url.searchParams.get('topic') ?? '');
  if (notifType && !notifType.toLowerCase().includes('payment')) {
    return jsonResponse({ ok: true, ignored: notifType }, 200);
  }

  if (!paymentId) {
    return jsonResponse({ error: 'Missing payment id' }, 400);
  }

  const xSignature = req.headers.get('x-signature') ?? '';
  const xRequestId = req.headers.get('x-request-id') ?? '';

  if (webhookSecret) {
    if (!xSignature || !xRequestId) {
      return jsonResponse({ error: 'Missing signature headers' }, 401);
    }
    const sigOk = await verifyMercadoPagoSignature(webhookSecret, xSignature, paymentId, xRequestId);
    if (!sigOk) {
      return jsonResponse({ error: 'Invalid signature' }, 401);
    }
  }

  const payRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!payRes.ok) {
    return jsonResponse({ error: 'Failed to fetch payment from Mercado Pago' }, 502);
  }

  const payment = (await payRes.json()) as {
    status?: string;
    external_reference?: string | null;
    metadata?: Record<string, unknown>;
  };

  if (payment.status !== 'approved') {
    return jsonResponse({ ok: true, payment_status: payment.status ?? 'unknown' }, 200);
  }

  const externalRef = payment.external_reference?.trim();
  if (!externalRef) {
    // 200 evita reenvios infinitos; configure external_reference na preferência.
    return jsonResponse({ ok: false, reason: 'missing_external_reference' }, 200);
  }

  const planMeta = payment.metadata?.studyflow_plan;
  const tier = typeof planMeta === 'string' ? planMeta.trim().toLowerCase() : 'premium';

  const patch =
    tier === 'supremo'
      ? { plan: 'premium', role: 'supremo' }
      : { plan: 'premium', role: 'premium' };

  const admin = createClient(supabaseUrl, serviceKey);
  const { data: updatedRows, error } = await admin
    .from('users')
    .update(patch)
    .eq('id', externalRef)
    .select('id');

  if (error) {
    return jsonResponse({ error: error.message }, 500);
  }

  if (!updatedRows?.length) {
    return jsonResponse({ ok: false, reason: 'user_not_found', external_reference: externalRef }, 200);
  }

  return jsonResponse({ ok: true, user_id: externalRef, tier }, 200);
});
