import React from 'react';
import { motion } from 'motion/react';

export const TrueEnding = ({ onBack }: { onBack: () => void }) => {
  return (
    <div className="fixed inset-0 z-[10000] bg-white text-black flex flex-col items-center justify-center p-12 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 3, ease: "easeOut" }}
        className="max-w-4xl w-full text-center space-y-24"
      >
        <div className="space-y-4">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 0.4, y: 0 }}
            transition={{ delay: 1 }}
            className="font-sans text-xs uppercase tracking-[0.5em] font-semibold"
          >
            Fim da Jornada
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 2 }}
            className="font-serif italic text-7xl md:text-[12vw] leading-[0.85] tracking-tighter"
          >
            Obrigado por <br /> existir.
          </motion.h1>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 4, duration: 2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left border-t border-black/10 pt-12"
        >
          <div className="space-y-2">
            <h3 className="font-sans text-[10px] uppercase tracking-widest font-bold opacity-30">Status</h3>
            <p className="font-serif italic text-xl">Transcendido</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-sans text-[10px] uppercase tracking-widest font-bold opacity-30">Conhecimento</h3>
            <p className="font-serif italic text-xl">Absoluto</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-sans text-[10px] uppercase tracking-widest font-bold opacity-30">Próximo Passo</h3>
            <p className="font-serif italic text-xl">Ser.</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 7 }}
          className="pt-12"
        >
          <button
            onClick={onBack}
            className="group relative px-12 py-4 font-sans text-xs uppercase tracking-[0.3em] font-bold overflow-hidden border border-black"
          >
            <span className="relative z-10 group-hover:text-white transition-colors duration-500">Voltar ao Início</span>
            <motion.div 
              className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-500"
            />
          </button>
        </motion.div>
      </motion.div>

      {/* Subtle background noise/texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
    </div>
  );
};
