import React, { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import confetti from 'canvas-confetti';
import { CheckCircle2, Sparkles } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnimatedButton, GlassCard } from '../../components/UI';
import { useUserStore } from '../../store/useUserStore';
import { trackPremiumEvent } from '../../lib/premiumAnalytics';
import type { BillingPeriod, PlanTier } from '../../services/paymentService';

function planFromQuery(raw: string | null): PlanTier {
  return raw === 'supremo' ? 'supremo' : 'premium';
}

function periodFromQuery(raw: string | null): BillingPeriod {
  return raw === 'yearly' ? 'yearly' : 'monthly';
}

export function PremiumSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const reduceMotion = useReducedMotion();
  const fired = useRef(false);
  const billingPlan = useUserStore((state) => state.billingPlan);

  const searchParams = new URLSearchParams(location.search);
  const fromMp = searchParams.get('source') === 'mp';

  const state = location.state as { plan?: PlanTier; period?: BillingPeriod; sessionId?: string } | null;
  const plan = state?.plan ?? planFromQuery(searchParams.get('plan'));
  const period = state?.period ?? periodFromQuery(searchParams.get('period'));
  const sessionId = fromMp ? 'mercadopago' : undefined;
  const paymentConfirmed = billingPlan === 'premium' || billingPlan === 'pro';

  useEffect(() => {
    if (!sessionId) {
      navigate('/premium', { replace: true });
      return;
    }
    trackPremiumEvent('premium_checkout_completed', {
      plan,
      period,
      sessionId,
      source: 'mercadopago',
    });

    if (reduceMotion || fired.current) return;
    fired.current = true;
    const end = Date.now() + 800;
    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.65 },
        colors: ['#00ff88', '#22d3ee', '#a78bfa'],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.65 },
        colors: ['#00ff88', '#22d3ee', '#a78bfa'],
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, [sessionId, navigate, plan, period, reduceMotion, fromMp]);

  if (!sessionId) return null;

  return (
    <div className="min-h-screen bg-[#050808] text-white flex flex-col items-center justify-center p-4 pb-32">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg"
      >
        <GlassCard className="p-8 md:p-10 border-primary/30 text-center bg-black/50">
          <div className="w-16 h-16 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={36} className="text-primary" />
          </div>
          <h1 className="text-3xl font-black mb-2">
            {paymentConfirmed ? 'Premium confirmado!' : 'Pagamento em processamento'}
          </h1>
          <p className="text-white/50 text-sm mb-8">
            {fromMp ? (
              <>
                Pagamento registrado no processador web. Se foi aprovado, seu plano{' '}
                <span className="text-primary font-bold">{plan === 'supremo' ? 'Supremo' : 'Premium'}</span> (
                {period === 'yearly' ? 'anual' : 'mensal'}) pode atualizar conforme a integração (ex.: webhook). Na
                versão com lojas, a confirmação virá da Play / App Store.
              </>
            ) : (
              <>
                Sua assinatura <span className="text-primary font-bold">{plan === 'supremo' ? 'Supremo' : 'Premium'}</span>{' '}
                ({period === 'yearly' ? 'anual' : 'mensal'}) foi confirmada na simulação. Plano local atualizado para
                desbloquear recursos.
              </>
            )}
          </p>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left space-y-2 mb-8 text-sm">
            <p className="flex items-center gap-2 text-white/70">
              <Sparkles size={14} className="text-primary" />
              Próximos passos: explorar IA, simulados e redação sem limites.
            </p>
            {!fromMp ? (
              <p className="text-[11px] text-white/35 font-mono">session: {state?.sessionId}</p>
            ) : (
              <p className="text-[11px] text-white/35 font-mono">retorno: checkout web</p>
            )}
          </div>

          <AnimatedButton
            onClick={() => navigate('/')}
            className="w-full py-4 rounded-2xl bg-primary text-black font-bold border-primary uppercase tracking-widest text-xs"
            glow
          >
            Começar a usar
          </AnimatedButton>
        </GlassCard>
      </motion.div>
    </div>
  );
}
