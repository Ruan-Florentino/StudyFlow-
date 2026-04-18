import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Check, Star, Zap } from 'lucide-react';
import { GlassCard, AnimatedButton } from './UI';
import { useStore } from '../store/useStore';

export const PaywallModal = ({ onClose, feature }: { onClose: () => void, feature?: string }) => {
  const [loading, setLoading] = useState(false);
  const { setPlan } = useStore();

  const handleCheckout = () => {
    setLoading(true);
    // Mock Stripe flow
    setTimeout(() => {
      setPlan('premium');
      setLoading(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-lg relative z-10"
      >
        <GlassCard glow className="border-primary/50 overflow-hidden relative p-8">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
          
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[50px] rounded-full pointer-events-none" />

          <div className="text-center space-y-4 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-green-600 rounded-2xl flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(0,255,148,0.3)]">
              <Star size={32} className="text-black" />
            </div>
            <div>
              <h2 className="text-3xl font-premium-title italic">StudyFlow <span className="text-primary not-italic">Premium</span></h2>
              <p className="text-text-secondary mt-2">Você atingiu o limite da sua conta gratuita. Assine o Premium para desbloquear seu potencial verdadeiro.</p>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            {[
              'Tudo ilimitado (Flashcards, AI Tutor, Redações)',
              'Simulados completos e inéditos',
              'Análise de redação detalhada com IA',
              'Sem interrupções ou limites de pomodoro',
              'Protetor de Streak de estudos'
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                  <Check size={14} className="text-primary" />
                </div>
                <span className="text-sm font-medium">{text}</span>
              </div>
            ))}
          </div>

          <AnimatedButton 
            onClick={handleCheckout} 
            disabled={loading}
            className="w-full bg-primary text-black border-primary py-4 text-base relative overflow-hidden group"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Zap size={20} className="animate-spin" />
                <span>Processando pagamento (Mock)...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 font-bold w-full">
                <span>Assinar Premium — R$ 19,90/mês</span>
                <Star size={16} fill="currentColor" />
              </div>
            )}
          </AnimatedButton>
          <p className="text-[10px] text-center text-text-secondary mt-4 uppercase tracking-widest font-premium-mono">
            Cancele quando quiser.
          </p>
        </GlassCard>
      </motion.div>
    </div>
  );
};
