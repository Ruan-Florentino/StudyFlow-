/**
 * Cria preferência Checkout Pro no Mercado Pago com JWT do usuário.
 *
 * Secrets: MERCADOPAGO_ACCESS_TOKEN, PUBLIC_APP_URL (URL do front, ex. https://app.seudominio.com)
 * Opcional: MERCADOPAGO_ENV=sandbox → responde com sandbox_init_point.
 * Opcional: CHECKOUT_PRICE_* para override numérico (BRL).
 *
 * @see supabase/functions/mp-webhook — notification_url aponta para o webhook.
 */
import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function priceFromEnv(key: string, fallback: number): number {
  const raw = Deno.env.get(key);
  if (raw == null || raw === '') return fallback;
  const n = Number(raw);
  return Number.isFinite(n) ? n : fallback;
}

type Plan = 'premium' | 'supremo';
type Period = 'monthly' | 'yearly';

function resolveUnitPrice(plan: Plan, period: Period): number {
  if (plan === 'supremo') {
    return period === 'yearly'
      ? priceFromEnv('CHECKOUT_PRICE_SUPREMO_YEARLY', 419)
      : priceFromEnv('CHECKOUT_PRICE_SUPREMO_MONTHLY', 49.9);
  }
  return period === 'yearly'
    ? priceFromEnv('CHECKOUT_PRICE_PREMIUM_YEARLY', 199)
    : priceFromEnv('CHECKOUT_PRICE_PREMIUM_MONTHLY', 19.99);
}

function itemTitle(plan: Plan, period: Period): string {
  const cadence = period === 'yearly' ? 'anual' : 'mensal';
  return plan === 'supremo' ? `Athena Supremo — ${cadence}` : `Athena Premium — ${cadence}`;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
  const mpToken = Deno.env.get('MERCADOPAGO_ACCESS_TOKEN') ?? '';
  const publicAppUrl = (Deno.env.get('PUBLIC_APP_URL') ?? '').replace(/\/$/, '');

  if (!supabaseUrl || !anonKey || !mpToken) {
    return jsonResponse({ error: 'Server misconfigured' }, 500);
  }

  if (!publicAppUrl || !publicAppUrl.startsWith('http')) {
    return jsonResponse(
      { error: 'Set PUBLIC_APP_URL secret (frontend origin) for back_urls' },
      500,
    );
  }

  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return jsonResponse({ error: 'Unauthorized' }, 401);
  }

  const supabaseAuth = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
  });

  const {
    data: { user },
    error: authErr,
  } = await supabaseAuth.auth.getUser();

  if (authErr || !user) {
    return jsonResponse({ error: 'Invalid session' }, 401);
  }

  let body: { plan?: string; period?: string };
  try {
    body = (await req.json()) as { plan?: string; period?: string };
  } catch {
    return jsonResponse({ error: 'Invalid JSON' }, 400);
  }

  const plan: Plan = body.plan === 'supremo' ? 'supremo' : 'premium';
  const period: Period = body.period === 'yearly' ? 'yearly' : 'monthly';
  const unitPrice = resolveUnitPrice(plan, period);

  const notificationUrl = `${supabaseUrl}/functions/v1/mp-webhook`;
  const studyflowPlan = plan === 'supremo' ? 'supremo' : 'premium';

  const preferenceBody = {
    items: [
      {
        title: itemTitle(plan, period),
        quantity: 1,
        currency_id: 'BRL',
        unit_price: unitPrice,
      },
    ],
    payer: user.email ? { email: user.email } : undefined,
    external_reference: user.id,
    metadata: { studyflow_plan: studyflowPlan },
    notification_url: notificationUrl,
    back_urls: {
      success: `${publicAppUrl}/premium/success?source=mp&plan=${plan}&period=${period}`,
      failure: `${publicAppUrl}/premium/checkout?cancel=1`,
      pending: `${publicAppUrl}/premium?payment=pending`,
    },
    auto_return: 'approved',
  };

  const prefRes = await fetch('https://api.mercadopago.com/checkout/preferences', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${mpToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(preferenceBody),
  });

  if (!prefRes.ok) {
    const errText = await prefRes.text();
    return jsonResponse(
      { error: 'Mercado Pago preference failed', detail: errText.slice(0, 500) },
      502,
    );
  }

  const pref = (await prefRes.json()) as {
    id?: string;
    init_point?: string;
    sandbox_init_point?: string;
  };

  const useSandbox = Deno.env.get('MERCADOPAGO_ENV') === 'sandbox';
  const url = useSandbox
    ? pref.sandbox_init_point ?? pref.init_point
    : pref.init_point ?? pref.sandbox_init_point;

  if (!url) {
    return jsonResponse({ error: 'No init_point from Mercado Pago' }, 502);
  }

  return jsonResponse({ url, preference_id: pref.id ?? null }, 200);
});
