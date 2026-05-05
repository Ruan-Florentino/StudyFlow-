import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft } from 'lucide-react';

export const Credits = ({ onBack }: { onBack: () => void }) => {
  return (
    <div className="fixed inset-0 z-[10000] bg-black text-white font-sans overflow-hidden flex flex-col">
      <button onClick={onBack} className="absolute top-8 left-8 text-white/30 hover:text-white z-50 transition-colors">
        <ChevronLeft size={24} />
      </button>
      
      <div className="flex-1 flex items-center justify-center relative">
        <motion.div 
          initial={{ y: '100vh' }}
          animate={{ y: '-100vh' }}
          transition={{ duration: 30, ease: 'linear', repeat: Infinity }}
          className="text-center space-y-24 w-full max-w-2xl px-8"
        >
          <div className="space-y-4">
            <h1 className="text-4xl font-serif italic">StudyFlow OS</h1>
            <p className="text-xs uppercase tracking-[0.5em] opacity-40">A Simulação de Aprendizado Definitiva</p>
          </div>

          <div className="space-y-12">
            <div>
              <h2 className="text-xs uppercase tracking-widest opacity-40 mb-2">Arquiteto Chefe</h2>
              <p className="text-xl font-serif">O Usuário</p>
            </div>
            
            <div>
              <h2 className="text-xs uppercase tracking-widest opacity-40 mb-2">Motor de Gênese</h2>
              <p className="text-xl font-serif">Athena (StudyFlow IA)</p>
            </div>

            <div>
              <h2 className="text-xs uppercase tracking-widest opacity-40 mb-2">Engenharia de Realidade</h2>
              <p className="text-xl font-serif">Antigravity</p>
            </div>

            <div>
              <h2 className="text-xs uppercase tracking-widest opacity-40 mb-2">Design de Interface</h2>
              <p className="text-xl font-serif">Receitas Estéticas do Multiverso</p>
            </div>
          </div>

          <div className="pt-24 space-y-4">
            <p className="text-sm italic opacity-60">"O fim de toda a nossa exploração será chegar onde começamos e conhecer o lugar pela primeira vez."</p>
            <p className="text-xs uppercase tracking-widest opacity-40">- T.S. Eliot</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
