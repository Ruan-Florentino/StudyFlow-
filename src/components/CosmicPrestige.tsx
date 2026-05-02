import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ChevronLeft, AlertTriangle } from 'lucide-react';
import { AnimatedButton, GlassCard } from './UI';
import { useStore } from '../store';

export const CosmicPrestige = ({ onBack }: { onBack: () => void }) => {
  const { level, prestigeLevel, prestige } = useStore();
  const [confirming, setConfirming] = useState(false);
  const [transcending, setTranscending] = useState(false);

  const handlePrestige = () => {
    setTranscending(true);
    setTimeout(() => {
      prestige();
      setTimeout(() => {
        onBack();
      }, 4000);
    }, 3000);
  };

  if (transcending) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden">
        <motion.div
          initial={{ scale: 1, opacity: 1 }}
          animate={{ scale: 100, opacity: 0 }}
          transition={{ duration: 4, ease: "easeInOut" }}
          className="w-4 h-4 bg-white rounded-full shadow-[0_0_100px_50px_rgba(255,255,255,1)]"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3, duration: 2 }}
          className="absolute text-white font-premium-title italic text-4xl"
        >
          Renascimento Cósmico.
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-black relative overflow-hidden flex flex-col items-center justify-center">
      {/* Nebula Background */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/30 rounded-full blur-[100px] mix-blend-screen" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/30 rounded-full blur-[100px] mix-blend-screen" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/20 rounded-full blur-[120px] mix-blend-screen" />
      </div>

      <AnimatedButton onClick={onBack} variant="ghost" className="absolute top-6 left-6 text-white/50 hover:text-white z-10">
        <ChevronLeft size={24} /> Voltar
      </AnimatedButton>

      <div className="relative z-10 max-w-xl w-full text-center space-y-8">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="mx-auto w-32 h-32 rounded-full border-2 border-dashed border-amber-500/50 flex items-center justify-center"
        >
          <Sparkles size={48} className="text-amber-400" />
        </motion.div>

        <div>
          <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 uppercase tracking-widest mb-2">
            Prestígio Cósmico
          </h2>
          <p className="text-amber-500/70 font-mono tracking-widest uppercase text-sm">
            Nível de Prestígio Atual: {prestigeLevel}
          </p>
        </div>

        <GlassCard className="p-8 border-amber-500/30 bg-black/60 backdrop-blur-xl text-left space-y-6">
          <div className="flex items-start gap-4 text-amber-400">
            <AlertTriangle size={24} className="shrink-0 mt-1" />
            <p className="text-sm leading-relaxed">
              O Prestígio Cósmico reiniciará seu Nível (voltará para 1), seu XP e suas conquistas. Em troca, você ganhará um nível de Prestígio, que concede um multiplicador permanente de XP e desbloqueia a aura cósmica no seu perfil.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm font-mono text-gray-400">
              <span>Requisito: Nível 50</span>
              <span className={level >= 50 ? "text-green-400" : "text-red-400"}>Atual: {level}</span>
            </div>
            <div className="h-2 bg-gray-900 rounded-full overflow-hidden">
              <div 
                className="h-full bg-amber-500 transition-all duration-1000"
                style={{ width: `${Math.min(100, (level / 50) * 100)}%` }}
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!confirming ? (
              <AnimatedButton 
                onClick={() => setConfirming(true)}
                disabled={level < 50}
                className="w-full py-4 bg-amber-600 hover:bg-amber-500 text-black font-black tracking-widest uppercase disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Iniciar Renascimento
              </AnimatedButton>
            ) : (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-4">
                <p className="text-red-400 text-center font-bold uppercase text-sm">Tem certeza? Esta ação é irreversível.</p>
                <div className="flex gap-4">
                  <AnimatedButton onClick={() => setConfirming(false)} variant="secondary" className="flex-1">
                    Cancelar
                  </AnimatedButton>
                  <AnimatedButton onClick={handlePrestige} className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold">
                    Confirmar
                  </AnimatedButton>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </GlassCard>
      </div>
    </div>
  );
};
