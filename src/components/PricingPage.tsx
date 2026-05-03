import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Star, ArrowLeft, ShieldCheck, Sparkles, Zap, Crown } from 'lucide-react';
import { GlassCard, AnimatedButton, Badge } from './UI';
import { useStore } from '../store';
import { PAYMENT_CONFIG } from '../config/payment';
import { toast } from '../store/useToastStore';

export const PricingPage = ({ onBack }: { onBack: () => void }) => {
  const [loading, setLoading] = useState(false);
  const planDetails = PAYMENT_CONFIG.premium;

  const handleCheckout = () => {
    setLoading(true);
    toast.success("Checkout", "Redirecionando para o pagamento seguro...");
    
    // Pequeno delay para feedback visual do toast
    setTimeout(() => {
      window.open(planDetails.mercadoPagoUrl, '_blank');
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      {/* Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-8 space-y-12">
        <header className="flex items-center justify-between">
          <AnimatedButton onClick={onBack} variant="secondary" className="p-2 rounded-full bg-white/5 border-white/10">
            <ArrowLeft size={18} />
          </AnimatedButton>
          <div className="flex items-center gap-2">
             <h2 className="text-xl font-premium-title italic text-white uppercase tracking-tight">Premium<span className="text-primary not-italic ml-0.5">.</span></h2>
          </div>
        </header>

        <section className="text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex p-4 rounded-3xl bg-primary/10 border border-primary/20 mb-2"
          >
            <Crown size={40} className="text-primary" />
          </motion.div>
          
          <div className="space-y-2">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">StudyFlow <span className="text-primary">Premium</span></h1>
            <p className="text-text-secondary text-base md:text-xl max-w-2xl mx-auto font-medium">
              Desbloqueie todo o potencial dos seus estudos com inteligência artificial de elite.
            </p>
          </div>
        </section>

        <div className="grid md:grid-cols-1 gap-8 items-center max-w-2xl mx-auto">
          {/* Main Premium Card */}
          <GlassCard 
            glow 
            className="p-8 h-full flex flex-col justify-between border-primary/40 relative overflow-hidden shadow-2xl shadow-primary/10"
          >
            {/* Header do Card */}
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div className="space-y-1">
                  <Badge variant="primary" className="mb-2 bg-primary/20 text-primary border-primary/30 uppercase tracking-[0.2em] font-bold text-[9px]">
                    Mais Popular 🔥
                  </Badge>
                  <h3 className="text-3xl font-bold flex items-center gap-2">
                    Acesso Full
                  </h3>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-bold text-white/50">R$</span>
                    <span className="text-5xl font-premium-mono font-bold">{planDetails.price.toString().replace('.', ',')}</span>
                  </div>
                  <span className="text-xs font-bold text-white/30 uppercase tracking-widest">por mês</span>
                </div>
              </div>

              {/* Benefícios */}
              <div className="space-y-4 mb-10">
                <p className="text-[10px] font-premium-mono font-bold text-white/40 uppercase tracking-[0.3em] mb-4">O que você desbloqueia:</p>
                <div className="grid grid-cols-1 gap-4">
                  {planDetails.benefits.map((benefit) => (
                    <motion.div 
                      key={benefit.id} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-start gap-4 p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/20 transition-all group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                        {benefit.icon}
                      </div>
                      <div className="flex-1 pt-1">
                        <span className="text-sm font-bold text-white/90 group-hover:text-primary transition-colors">{benefit.text}</span>
                      </div>
                      <Check size={16} className="text-primary mt-1.5" />
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Botão de Checkout */}
              <div className="space-y-4">
                <AnimatedButton 
                  onClick={handleCheckout} 
                  disabled={loading}
                  className="w-full bg-primary text-black border-primary py-5 rounded-2xl font-bold text-lg uppercase tracking-widest shadow-lg shadow-primary/20"
                  glow
                >
                  <div className="flex items-center justify-center gap-2">
                    {loading ? (
                      <Zap className="animate-spin" size={20} />
                    ) : (
                      <>
                        <Zap size={20} fill="currentColor" />
                        Assinar Agora
                      </>
                    )}
                  </div>
                </AnimatedButton>
                
                <div className="flex items-center justify-center gap-4 pt-2">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/30 lowercase italic">
                    <ShieldCheck size={12} className="text-primary" />
                    Pagamento seguro via Mercado Pago
                  </div>
                </div>
              </div>
            </div>

            {/* Decoration Elements */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
          </GlassCard>
        </div>

        {/* FAQ / Trust Badges */}
        <div className="grid grid-cols-3 gap-4 pt-8">
          {[
            { icon: Sparkles, label: 'Upgrade Imediato' },
            { icon: Zap, label: 'Cancele quando quiser' },
            { icon: ShieldCheck, label: 'Satisfação Garantida' },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-2 text-center">
              <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                <item.icon size={20} className="text-primary" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">{item.label}</span>
            </div>
          ))}
        </div>
        
        <footer className="text-center pt-12 text-[10px] text-white/20 uppercase tracking-[0.2em]">
          <p>© 2026 StudyFlow AI • São Paulo, Brasil</p>
          <div className="flex justify-center gap-4 mt-2">
            <span className="hover:text-white transition-colors cursor-pointer">Termos de Uso</span>
            <span className="hover:text-white transition-colors cursor-pointer">Privacidade</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

