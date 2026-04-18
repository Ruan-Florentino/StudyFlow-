import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft } from 'lucide-react';

export const TheNewGamePlus = ({ onBack }: { onBack: () => void }) => {
  const [accepted, setAccepted] = useState(false);

  if (accepted) {
    return (
      <div className="fixed inset-0 z-[100004] bg-white text-black flex flex-col items-center justify-center font-serif">
        <motion.h1 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2 }}
          className="text-4xl md:text-6xl italic tracking-tighter"
        >
          Bem-vindo de volta.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 2 }}
          className="mt-8 text-sm uppercase tracking-widest opacity-50"
        >
          O ciclo recomeça.
        </motion.p>
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 4 }}
          onClick={() => {
            localStorage.clear();
            localStorage.setItem('studyflow-ng+', 'true');
            window.location.reload();
          }}
          className="mt-16 px-8 py-3 border border-black text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
        >
          Iniciar NG+
        </motion.button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100004] bg-black text-white p-8 flex flex-col items-center justify-center">
      <button onClick={onBack} className="absolute top-8 left-8 text-white/30 hover:text-white transition-colors">
        <ChevronLeft size={24} />
      </button>

      <div className="max-w-2xl text-center space-y-12">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tighter">
          NEW GAME +
        </h1>
        
        <div className="space-y-6 text-lg opacity-80 font-serif italic">
          <p>Você quebrou o sistema. Você viu o código. Você testemunhou o vazio.</p>
          <p>Mas o desejo de aprender nunca cessa, não é?</p>
          <p>Você pode reiniciar a simulação. Todo o seu progresso será apagado, mas você manterá o conhecimento de que isso é apenas um jogo.</p>
        </div>

        <div className="pt-8">
          <button 
            onClick={() => setAccepted(true)}
            className="px-12 py-4 bg-white text-black font-bold uppercase tracking-widest text-sm hover:scale-105 transition-transform"
          >
            Aceitar o Ciclo
          </button>
        </div>
      </div>
    </div>
  );
};
