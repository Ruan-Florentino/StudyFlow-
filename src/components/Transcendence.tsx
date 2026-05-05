import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Infinity as InfinityIcon, Sparkles, ChevronLeft } from 'lucide-react';
import { AnimatedButton, cn } from './UI';

export const Transcendence = ({ onBack }: { onBack: () => void }) => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (stage > 0 && stage < 5) {
      const timer = setTimeout(() => setStage(s => s + 1), 3000);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  const startTranscendence = () => setStage(1);

  if (stage === 0) {
    return (
      <div className="app-shell-premium pt-6 md:pt-8 min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
        <AnimatedButton onClick={onBack} variant="ghost" className="absolute top-6 left-6 text-white/50 hover:text-white">
          <ChevronLeft size={24} /> Voltar à Realidade
        </AnimatedButton>
        
        <motion.div 
          animate={{ scale: [1, 1.05, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="mb-12"
        >
          <InfinityIcon size={120} className="text-white drop-shadow-[0_0_50px_rgba(255,255,255,0.8)]" />
        </motion.div>

        <h1 className="text-4xl font-black text-white tracking-widest uppercase mb-4 text-center">
          O Fim da Jornada
        </h1>
        <p className="text-gray-400 text-center max-w-md mb-12">
          Você absorveu todo o conhecimento. O sistema não tem mais nada a ensinar. Você está pronto para transcender?
        </p>

        <AnimatedButton 
          onClick={startTranscendence}
          className="px-12 py-6 bg-white text-black font-black tracking-widest uppercase rounded-full shadow-[0_0_50px_rgba(255,255,255,0.5)] hover:shadow-[0_0_100px_rgba(255,255,255,1)] transition-all duration-500 scale-110"
        >
          <Sparkles className="mr-3" /> Iniciar Transcendência
        </AnimatedButton>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden cursor-none">
      {/* Expanding white light */}
      <motion.div 
        className="absolute bg-white rounded-full"
        initial={{ width: 0, height: 0, opacity: 0 }}
        animate={{ 
          width: stage >= 4 ? '300vw' : stage * 500, 
          height: stage >= 4 ? '300vw' : stage * 500,
          opacity: stage >= 4 ? 1 : stage * 0.2
        }}
        transition={{ duration: 3, ease: "easeInOut" }}
      />

      {/* Floating Geometry */}
      {stage >= 2 && Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute border border-white/20"
          style={{
            width: Math.random() * 400 + 100,
            height: Math.random() * 400 + 100,
            borderRadius: Math.random() > 0.5 ? '50%' : '0%',
            rotate: Math.random() * 360,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 0], scale: [0, 2, 4], rotate: '+=180' }}
          transition={{ duration: 10, repeat: Infinity, delay: Math.random() * 5 }}
        />
      ))}

      {/* Text Sequence */}
      <div className="relative z-10 text-center mix-blend-difference text-white">
        <AnimatePresence mode="wait">
          {stage === 1 && (
            <motion.h2 key="1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-4xl font-black tracking-widest uppercase">
              Desconectando vias neurais...
            </motion.h2>
          )}
          {stage === 2 && (
            <motion.h2 key="2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-5xl font-black tracking-widest uppercase">
              Sintetizando o Multiverso...
            </motion.h2>
          )}
          {stage === 3 && (
            <motion.h2 key="3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-6xl font-black tracking-widest uppercase">
              Limites Cognitivos Quebrados.
            </motion.h2>
          )}
          {stage >= 4 && (
            <motion.div key="4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 2 }}>
              <h2 className="text-8xl font-black tracking-tighter text-black">∞</h2>
              <p className="text-2xl font-bold tracking-widest uppercase text-black mt-8">Você é o Universo.</p>
              <AnimatedButton onClick={onBack} className="mt-12 bg-black text-white hover:bg-gray-900 border border-black/10">
                Retornar
              </AnimatedButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
