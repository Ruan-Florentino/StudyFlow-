import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { X, Check, Star, Zap, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GlassCard, AnimatedButton } from './UI';
import { PAYMENT_CONFIG } from '../config/payment';
import { toast } from '../store/useToastStore';
import { trackPremiumEvent } from '../lib/premiumAnalytics';
import { aiPremiumCopy } from '../lib/productDisclosure';
import { springs } from '../lib/animations';

const FEATURE_TEASER: Record<string, { title: string; bullets: string[] }> = {
  flashcards: {
    title: 'Flashcards sem teto',
    bullets: ['Mais repetição espaçada', 'Decks ilimitados', 'Sincronização fluida'],
  },
  aiTutor: {
    title: 'ATHENA sem limites',
    bullets: ['Chat ilimitado', 'Contexto das suas trilhas', 'Respostas mais profundas'],
  },
  essay: {
    title: 'Redação nível ENEM',
    bullets: ['Correção com IA', 'Competências detalhadas', 'Histórico completo'],
  },
  exams: {
    title: 'Simulados completos',
    bullets: ['Provas completas', 'Cronômetro e gabarito', 'Análise por área'],
  },
  default: {
    title: 'Athena Premium',
    bullets: [
      'Toda a IA do app em modo completo (ATHENA e ferramentas com modelo)',
      'Simulados e trilhas sem o teto do Free',
      'Experiência premium sem travas',
    ],
  },
};

export const PaywallModal = ({
  onClose,
  feature,
}: {
  onClose: () => void;
  feature?: string;
}) => {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const [loading, setLoading] = useState(false);
  const planDetails = PAYMENT_CONFIG.premium;
  const teaser = FEATURE_TEASER[feature || ''] ?? FEATURE_TEASER.default;

  const goPremiumPage = () => {
    trackPremiumEvent('premium_paywall_cta', { feature: feature ?? 'unknown', target: '/premium' });
    onClose();
    navigate('/premium');
  };

  const handleLegacyCheckout = () => {
    setLoading(true);
    toast.success('Checkout', 'Abrindo link legado de checkout web em nova aba…');
    setTimeout(() => {
      window.open(planDetails.mercadoPagoUrl, '_blank');
      setLoading(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        aria-hidden
      />
      <motion.div
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 22 }}
        animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: 12 }}
        transition={reduceMotion ? { duration: 0.12 } : springs.card}
        className="w-full max-w-md relative z-10"
        role="dialog"
        aria-modal="true"
        aria-labelledby="paywall-title"
      >
        <GlassCard glow className="border-primary/50 overflow-hidden relative p-6 md:p-8">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors"
            aria-label="Fechar"
          >
            <X size={20} />
          </button>

          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[50px] rounded-full pointer-events-none" />

          <div className="text-center space-y-3 mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-primary to-green-600 rounded-2xl flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(0,255,148,0.3)]">
              <Sparkles size={28} className="text-black" />
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-primary mb-1">Você está quase lá</p>
              <h2 id="paywall-title" className="text-2xl md:text-3xl font-black tracking-tight">
                {teaser.title}
              </h2>
              <p className="text-text-secondary text-sm mt-2 leading-relaxed">{aiPremiumCopy.full}</p>
            </div>
          </div>

          <div className="space-y-2 mb-6">
            {teaser.bullets.map((text, i) => (
              <motion.div
                key={text}
                initial={reduceMotion ? false : { opacity: 0, x: -8 }}
                animate={reduceMotion ? undefined : { opacity: 1, x: 0 }}
                transition={reduceMotion ? undefined : { ...springs.card, delay: 0.06 + i * 0.04 }}
                className="flex items-center gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <Check size={14} className="text-primary" />
                </div>
                <span className="text-sm font-medium text-white/85">{text}</span>
              </motion.div>
            ))}
          </div>

          <div className="space-y-3">
            <AnimatedButton
              onClick={goPremiumPage}
              className="w-full bg-primary text-black border-primary py-4 text-sm relative overflow-hidden group font-bold uppercase tracking-widest"
              glow
            >
              <span className="flex items-center justify-center gap-2 w-full">
                Desbloquear com Athena Premium
                <ArrowRight size={18} />
              </span>
            </AnimatedButton>
            <p className="text-[10px] text-center text-white/35 font-mono">
              A partir de {planDetails.priceMonthly.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}/
              mês · confira planos Supremo na página
            </p>
            <button
              type="button"
              onClick={handleLegacyCheckout}
              disabled={loading}
              className="w-full py-3 rounded-xl border border-white/10 text-xs font-bold text-white/50 hover:text-white hover:bg-white/5 transition-colors uppercase tracking-widest flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Zap size={14} className="animate-spin" />
                  Abrindo link legado…
                </>
              ) : (
                <>
                  <Star size={14} />
                  Link legado checkout web (opcional)
                </>
              )}
            </button>
          </div>
          <p className="text-[10px] text-center text-text-secondary mt-4 uppercase tracking-widest font-premium-mono">
            Cancele quando quiser.
          </p>
        </GlassCard>
      </motion.div>
    </div>
  );
};
