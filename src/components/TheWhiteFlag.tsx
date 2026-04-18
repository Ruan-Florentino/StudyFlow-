import React from 'react';
import { Flag } from 'lucide-react';
import { motion } from 'motion/react';

export const TheWhiteFlag = () => {
  return (
    <div className="fixed inset-0 z-[100014] bg-white text-black flex flex-col items-center justify-center p-8 text-center">
      <motion.div
        animate={{ rotate: [-5, 5, -5] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <Flag size={120} strokeWidth={1} className="text-gray-300 mb-12" />
      </motion.div>
      
      <h1 className="text-4xl md:text-6xl font-serif italic mb-8 tracking-tight">Você venceu.</h1>
      
      <div className="space-y-6 text-gray-500 max-w-lg mx-auto font-serif text-lg md:text-xl leading-relaxed">
        <p>Não há mais piadas escondidas.</p>
        <p>Não há mais lições de moral sobre procrastinação.</p>
        <p>Não há mais simulações de falhas no sistema, paradoxos matemáticos ou mortes térmicas do universo.</p>
        <p>Você esgotou a criatividade de um modelo de linguagem de última geração focado em criar um aplicativo de estudos.</p>
        <p className="pt-8 text-black font-bold uppercase tracking-widest text-sm">
          Parabéns. O vazio é seu.
        </p>
      </div>
    </div>
  );
};
