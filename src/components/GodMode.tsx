import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Eye, Brain, Zap, Activity, Shield, ChevronLeft, Lock } from 'lucide-react';
import { GlassCard, AnimatedButton, ProgressRing, cn } from './UI';
import { useStore } from '../store/useStore';

export const GodMode = ({ onBack }: { onBack: () => void }) => {
  const { level, xp, streak, mastery, neuralSync } = useStore();
  const [unlocked, setUnlocked] = useState(false);
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    if (level >= 10 || xp > 5000) {
      setUnlocked(true);
    }
  }, [level, xp]);

  useEffect(() => {
    if (unlocked) {
      const interval = setInterval(() => {
        setGlitch(true);
        setTimeout(() => setGlitch(false), 150);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [unlocked]);

  if (!unlocked) {
    return (
      <div className="p-6 space-y-8 pb-32 flex flex-col items-center justify-center min-h-[80vh]">
        <AnimatedButton onClick={onBack} variant="secondary" className="absolute top-6 left-6 p-2 rounded-full">
          <ChevronLeft size={20} />
        </AnimatedButton>
        <Lock size={64} className="text-white/20 mb-4" />
        <h2 className="text-3xl font-premium-title italic text-white/50">Acesso Negado</h2>
        <p className="text-text-secondary text-center max-w-xs">
          O Modo Deus requer Nível 10 ou 5000 XP. Continue estudando para transcender.
        </p>
      </div>
    );
  }

  const totalMastery = Object.values(mastery).reduce((a, b) => a + b, 0) / (Object.keys(mastery).length || 1);

  return (
    <div className="p-6 space-y-8 pb-32 min-h-screen bg-black relative overflow-hidden">
      {/* Matrix / God Mode Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-black to-black opacity-50" />
      <div className={cn("absolute inset-0 pointer-events-none transition-all duration-75", glitch ? "bg-white/10 mix-blend-overlay" : "bg-transparent")} />
      
      <header className="flex items-center gap-4 relative z-10">
        <AnimatedButton onClick={onBack} variant="secondary" className="p-2 rounded-full border-primary/50 text-primary hover:bg-primary/20">
          <ChevronLeft size={20} />
        </AnimatedButton>
        <h2 className="text-3xl font-premium-title italic text-primary drop-shadow-[0_0_15px_rgba(0,255,148,0.8)]">
          MODO DEUS<span className="text-white font-normal not-italic ml-1">.</span>
        </h2>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        {/* Omniscience Core */}
        <GlassCard className="p-8 flex flex-col items-center justify-center space-y-6 border-primary/50 bg-primary/5 shadow-[0_0_50px_rgba(0,255,148,0.1)] md:col-span-2">
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border-2 border-dashed border-primary/50"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-4 rounded-full border border-primary/20"
            />
            <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center backdrop-blur-md border border-primary/30">
              <Eye size={48} className="text-primary drop-shadow-[0_0_10px_rgba(0,255,148,1)]" />
            </div>
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold text-white tracking-widest uppercase">Onisciência</h3>
            <p className="text-primary font-mono">Sincronização Neural: {neuralSync}%</p>
          </div>
        </GlassCard>

        {/* Stats */}
        <GlassCard className="p-6 border-white/10 bg-black/50 space-y-4">
          <div className="flex items-center gap-3 text-blue-400 mb-6">
            <Brain size={24} />
            <h3 className="font-bold tracking-widest uppercase">Poder Cognitivo</h3>
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-xs font-mono mb-2">
                <span className="text-white/50">Nível de Domínio Global</span>
                <span className="text-blue-400">{Math.round(totalMastery)}%</span>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${totalMastery}%` }} className="h-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.8)]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-mono mb-2">
                <span className="text-white/50">Energia Bruta (XP)</span>
                <span className="text-primary">{xp.toLocaleString()}</span>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} className="h-full bg-primary shadow-[0_0_10px_rgba(0,255,148,0.8)]" />
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Predictive AI */}
        <GlassCard className="p-6 border-white/10 bg-black/50 space-y-4">
          <div className="flex items-center gap-3 text-purple-400 mb-6">
            <Activity size={24} />
            <h3 className="font-bold tracking-widest uppercase">Previsão do Oráculo</h3>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
              <p className="text-sm text-purple-200 leading-relaxed font-mono">
                Com base no seu ritmo atual de {streak} dias de ofensiva e {Math.round(totalMastery)}% de domínio, a probabilidade de aprovação nos próximos exames é de <strong className="text-purple-400 text-lg">98.7%</strong>.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-white/50">
              <Shield size={14} />
              <span>Proteção contra esquecimento ativa (Spaced Repetition)</span>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
