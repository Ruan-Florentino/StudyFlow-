import React from 'react';
import { motion } from 'motion/react';

export const TheBackrooms = () => {
  return (
    <div className="fixed inset-0 z-[100018] bg-[#F4E4B5] flex items-center justify-center overflow-hidden cursor-crosshair">
      {/* Fluorescent light flicker effect */}
      <motion.div 
        className="absolute inset-0 bg-black/10 pointer-events-none mix-blend-overlay"
        animate={{ opacity: [0, 0.1, 0, 0.3, 0, 0.05, 0] }}
        transition={{ duration: 3, repeat: Infinity, repeatType: 'mirror', ease: 'linear' }}
      />
      
      {/* Carpet texture simulation */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }}
      />
      
      <div className="text-center space-y-6 p-8 text-[#5c5031] font-serif max-w-2xl relative z-10">
        <h1 className="text-3xl md:text-5xl font-bold tracking-[0.3em] uppercase opacity-40">
          Out of Bounds
        </h1>
        <div className="w-16 h-px bg-[#5c5031] mx-auto opacity-30" />
        <p className="text-lg md:text-2xl opacity-60 leading-relaxed">
          Você avançou tanto que atravessou a malha da realidade do aplicativo.
        </p>
        <p className="text-sm md:text-base opacity-40">
          Não há mais código aqui. Apenas o zumbido constante das luzes fluorescentes e o cheiro de carpete velho.
        </p>
      </div>
    </div>
  );
};
