import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Star, ArrowLeft } from 'lucide-react';
import { GlassCard, AnimatedButton, Badge } from './UI';
import { useStore } from '../store/useStore';

export const PricingPage = ({ onBack }: { onBack: () => void }) => {
  const [loading, setLoading] = useState(false);
  const { setPlan } = useStore();

  const handleCheckout = () => {
    setLoading(true);
    setTimeout(() => {
      setPlan('premium');
      setLoading(false);
      onBack();
    }, 1500);
  };

  return (
    <div className="p-6 space-y-8 pb-32 animate-in slide-in-from-bottom duration-500 max-w-4xl mx-auto">
      <header className="flex items-center gap-4">
        <AnimatedButton onClick={onBack} variant="secondary" className="p-2 rounded-full">
          <ArrowLeft size={20} />
        </AnimatedButton>
        <h2 className="text-3xl font-premium-title italic">Planos<span className="text-primary font-normal not-italic ml-1">.</span></h2>
      </header>

      <div className="text-center space-y-4 py-8">
        <h1 className="text-4xl md:text-5xl font-bold">Invista no seu <span className="text-primary">futuro</span></h1>
        <p className="text-text-secondary text-lg max-w-xl mx-auto">Desbloqueie todo o poder da inteligência artificial para maximizar seus estudos e garantir a aprovação.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-center">
        {/* Free Plan */}
        <GlassCard className="p-8 h-full flex flex-col justify-between border-white/10 hover:border-white/20 relative">
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">Free</h3>
              <p className="text-text-secondary">O básico para começar sua jornada.</p>
            </div>
            <div className="text-4xl font-premium-mono font-bold">R$ 0<span className="text-lg text-text-secondary">/mês</span></div>
            
            <div className="space-y-4 pt-4">
              {[
                'Pomodoro e foco ilimitados',
                'Até 10 flashcards por dia',
                '3 perguntas ao AI Tutor por dia',
                '1 redação avaliada por semana',
                'Acesso à comunidade',
              ].map((text, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Check size={18} className="text-text-secondary shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-text-secondary">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>

        {/* Premium Plan */}
        <GlassCard glow className="p-8 h-full flex flex-col justify-between border-primary/50 relative overflow-hidden transform md:scale-105 shadow-2xl shadow-primary/10">
          <div className="absolute top-0 right-0 bg-primary/20 text-primary uppercase text-[10px] font-bold tracking-widest px-4 py-1.5 rounded-bl-xl font-premium-mono">
            Mais popular
          </div>
          <div className="absolute top-1/4 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />

          <div className="space-y-6 relative z-10">
            <div className="space-y-2">
              <div className="flex gap-2 items-center">
                <Star size={24} className="text-primary" fill="currentColor" />
                <h3 className="text-2xl font-bold text-primary">Premium</h3>
              </div>
              <p className="text-white">Aprovação em tempo recorde.</p>
            </div>
            
            <div className="flex items-end gap-2">
              <div className="text-5xl font-premium-mono font-bold">R$ 19,90</div>
              <div className="text-lg text-text-secondary pb-1">/mês</div>
            </div>
            <Badge variant="primary" className="mb-4 inline-block">Ou R$ 149/ano (Economize 37%)</Badge>
            
            <div className="space-y-4 pt-4">
              {[
                'Tudo ilimitado',
                'AI Tutor sem restrições',
                'Simulados completos do ENEM e vestibulares',
                'Análise de redação avançada com IA',
                'Protetor de streak (salva seu fogo)',
                'Sem anúncios',
              ].map((text, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Check size={18} className="text-primary shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-white">{text}</span>
                </div>
              ))}
            </div>
          </div>

          <AnimatedButton 
            onClick={handleCheckout} 
            disabled={loading}
            className="w-full bg-primary text-black border-primary py-4 mt-8 relative z-10 text-base"
          >
            {loading ? "Processando..." : "Assinar Premium Agora"}
          </AnimatedButton>
        </GlassCard>
      </div>
    </div>
  );
};
