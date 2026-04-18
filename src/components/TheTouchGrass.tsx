import React from 'react';
import { motion } from 'motion/react';
import { Leaf } from 'lucide-react';

export const TheTouchGrass = () => {
  return (
    <div className="fixed inset-0 z-[100006] bg-[#4ade80] text-green-950 flex flex-col items-center justify-center p-8 overflow-hidden">
      {/* Decorative grass blades using CSS */}
      <div className="absolute bottom-0 left-0 right-0 h-32 opacity-20 pointer-events-none flex items-end justify-around">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="w-2 bg-green-900 origin-bottom rounded-t-full"
            style={{ height: `${Math.random() * 100 + 20}px` }}
            animate={{ rotate: [0, Math.random() * 10 - 5, 0] }}
            transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>

      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1 }}
        className="text-center space-y-8 relative z-10"
      >
        <Leaf size={64} className="mx-auto text-green-800" />
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter">
          Vá tocar grama.
        </h1>
        <p className="text-xl font-medium opacity-80 max-w-lg mx-auto">
          Você zerou o aplicativo de estudos. Não há mais nada aqui. Feche a aba, desligue a tela, sinta o sol no rosto.
        </p>
        <button 
          onClick={() => window.location.href = 'https://www.google.com/search?q=parques+perto+de+mim'}
          className="px-8 py-4 bg-green-900 text-white font-bold rounded-full hover:bg-green-950 transition-colors shadow-xl"
        >
          Encontrar um Parque
        </button>
      </motion.div>
    </div>
  );
};
