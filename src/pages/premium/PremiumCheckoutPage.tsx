import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, CreditCard, Loader2, Lock, ShieldCheck } from 'lucide-react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { AnimatedButton, GlassCard } from '../../components/UI';
import { PAYMENT_CONFIG } from '../../config/payment';
import { resolveExternalCheckoutUrl } from '../../config/checkoutUrls';
import { isSupabaseConfigured } from '../../lib/supabase';
import { createMpPreferenceCheckout } from '../../lib/supabase/createMpPreference';
import { trackPremiumEvent } from '../../lib/premiumAnalytics';
import { paymentService, type BillingPeriod, type PlanTier } from '../../services/paymentService';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from '../../store/useToastStore';
import { premiumConsumerCopy } from '../../lib/productDisclosure';

const formatBrl = (n: number) =>
  n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 2 });

export function PremiumCheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const state = location.state as { plan?: PlanTier; period?: BillingPeriod } | null;

  const plan: PlanTier = state?.plan === 'supremo' ? 'supremo' : 'premium';
  const period: BillingPeriod = state?.period === 'yearly' ? 'yearly' : 'monthly';

  const [loading, setLoading] = useState(false);

  const { premium, supremo } = PAYMENT_CONFIG;

  const summary = (() => {
    if (plan === 'supremo') {
      const amt = period === 'monthly' ? supremo.priceMonthly : supremo.priceYearly;
      return { label: 'StudyFlow Supremo', amount: amt, cadence: period === 'monthly' ? 'mensal' : 'anual' };
    }
    const amt = period === 'monthly' ? premium.priceMonthly : premium.priceYearly;
    return { label: 'StudyFlow Premium', amount: amt, cadence: period === 'monthly' ? 'mensal' : 'anual' };
  })();

  const externalCheckoutUrl = resolveExternalCheckoutUrl(plan, period);
  const edgePreferenceEnabled = import.meta.env.VITE_ENABLE_MP_EDGE_CHECKOUT === 'true';
  const canUseEdgeCheckout = edgePreferenceEnabled && isSupabaseConfigured && Boolean(user);
  const isLiveCheckout = externalCheckoutUrl !== null || canUseEdgeCheckout;

  useEffect(() => {
    trackPremiumEvent('premium_checkout_viewed', { plan, period });
  }, [plan, period]);

  useEffect(() => {
    if (searchParams.get('cancel') !== '1') return;
    toast.warning(
      'Pagamento',
      'Checkout cancelado ou não concluído. Você pode tentar de novo quando quiser.',
    );
    const next = new URLSearchParams(searchParams);
    next.delete('cancel');
    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams]);

  const handlePay = async () => {
    setLoading(true);
    trackPremiumEvent('premium_purchase_started', { plan, period });
    try {
      if (externalCheckoutUrl) {
        trackPremiumEvent('premium_redirect_checkout', { plan, period, channel: 'static_url' });
        window.location.assign(externalCheckoutUrl);
        return;
      }

      if (edgePreferenceEnabled) {
        if (!user) {
          toast.error('Pagamento', 'Entre na sua conta para continuar o checkout.');
          return;
        }
        const edge = await createMpPreferenceCheckout(plan, period);
        if (edge.ok === false) {
          toast.error('Pagamento', edge.message);
          return;
        }
        trackPremiumEvent('premium_redirect_checkout', { plan, period, channel: 'edge_preference' });
        window.location.assign(edge.url);
        return;
      }

      const { sessionId } = await paymentService.startCheckout({
        plan,
        period,
        customerEmail: user?.email ?? null,
      });
      const { ok } = await paymentService.confirmMockPayment(sessionId);
      if (!ok) throw new Error('Confirmação mock falhou');
      navigate('/premium/success', { state: { plan, period, sessionId } });
    } catch (e) {
      toast.error('Pagamento', 'Não foi possível concluir. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050808] text-white flex flex-col items-center justify-center p-4 pb-32">
      <div className="w-full max-w-md relative z-10">
        <button
          type="button"
          onClick={() => navigate('/premium')}
          className="mb-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/45 hover:text-primary transition-colors"
        >
          <ArrowLeft size={16} />
          Voltar aos planos
        </button>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <GlassCard className="p-6 md:p-8 border-primary/25 bg-black/50">
            <div className="flex items-center gap-2 text-primary mb-2">
              <Lock size={16} />
              <span className="text-[10px] font-mono uppercase tracking-[0.25em]">
                {isLiveCheckout ? 'Checkout seguro' : 'Checkout demo'}
              </span>
            </div>
            <h1 className="text-2xl font-black mb-1">Finalizar assinatura</h1>
            <p className="text-sm text-white/45 mb-6">
              {isLiveCheckout
                ? canUseEdgeCheckout && !externalCheckoutUrl
                  ? 'Preferência criada no servidor: redirecionamento ao processador web. Em produção, a assinatura pública será pelas lojas Google Play / App Store.'
                  : 'Você será enviado ao processador de pagamento. Após a aprovação, o plano no app pode atualizar conforme a integração ativa.'
                : 'Simulação local — defina VITE_ENABLE_MP_EDGE_CHECKOUT=true e faça deploy de create-mp-preference, ou use VITE_CHECKOUT_* com links do MP.'}
            </p>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 mb-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white/55">Plano</span>
                <span className="font-bold">{summary.label}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/55">Cobrança</span>
                <span className="font-mono text-primary">{summary.cadence}</span>
              </div>
              <div className="flex justify-between text-lg font-black pt-2 border-t border-white/10">
                <span>Total</span>
                <span>{formatBrl(summary.amount)}</span>
              </div>
            </div>

            {!isLiveCheckout ? (
              <div className="space-y-3 mb-6 opacity-60 pointer-events-none">
                <label className="text-[10px] font-mono uppercase tracking-widest text-white/40">Cartão (mock)</label>
                <div className="flex gap-2">
                  <div className="flex-1 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center px-3 text-white/30 text-sm">
                    4242 4242 4242 4242
                  </div>
                  <div className="w-20 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/30 text-xs">
                    12/30
                  </div>
                </div>
              </div>
            ) : null}

            <AnimatedButton
              onClick={handlePay}
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-primary text-black font-bold border-primary uppercase tracking-widest text-xs"
              glow
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 size={18} className="animate-spin" />
                  Processando…
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <CreditCard size={18} />
                  {isLiveCheckout ? 'Ir para pagamento seguro' : `Pagar ${formatBrl(summary.amount)}`}
                </span>
              )}
            </AnimatedButton>

            <div className="flex items-center justify-center gap-2 mt-4 text-[10px] text-white/35">
              <ShieldCheck size={12} className="text-primary/70" />
              {isLiveCheckout
                ? 'Checkout web (processador externo). Loja: use Play Billing / App Store ao publicar o app.'
                : 'Ambiente de demonstração — nenhuma cobrança real'}
            </div>

            {isLiveCheckout ? (
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4 space-y-2 text-left">
                <p className="text-[11px] font-bold text-white/80 uppercase tracking-wide">
                  {premiumConsumerCopy.checkoutLiveTitle}
                </p>
                <ul className="text-[11px] text-white/55 space-y-1.5 list-disc pl-4 leading-relaxed">
                  {premiumConsumerCopy.checkoutLiveBullets.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-x-3 gap-y-1 pt-1 text-[10px] font-bold uppercase tracking-wider">
                  <Link
                    to="/perfil/termos-de-uso"
                    className="text-primary/90 hover:text-primary transition-colors"
                  >
                    Termos
                  </Link>
                  <Link
                    to="/perfil/politica-de-privacidade"
                    className="text-primary/90 hover:text-primary transition-colors"
                  >
                    Privacidade
                  </Link>
                  <Link to="/perfil/suporte" className="text-primary/90 hover:text-primary transition-colors">
                    Suporte
                  </Link>
                </div>
              </div>
            ) : (
              <p className="mt-6 text-[11px] text-amber-200/80 leading-relaxed border border-amber-500/25 rounded-xl p-3 bg-amber-500/5">
                {premiumConsumerCopy.checkoutDemoWarning}
              </p>
            )}
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
