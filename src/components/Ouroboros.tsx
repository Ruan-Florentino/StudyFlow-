import React from 'react';
import { motion } from 'motion/react';
import { RotateCcw } from 'lucide-react';

export const Ouroboros = ({ onBack }: { onBack: () => void }) => {
  const handleReset = () => {
    if (window.confirm("Isso apagará TODO o seu progresso, histórico, XP e configurações. O universo será reiniciado. Tem certeza?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center overflow-hidden">
      {/* The Snake eating its tail (abstract representation) */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="w-64 h-64 md:w-96 md:h-96 rounded-full border-[8px] border-t-white border-r-white/50 border-b-white/10 border-l-transparent"
      />
      
      <div className="absolute text-center z-10 flex flex-col items-center">
        <h1 className="text-white text-4xl md:text-6xl font-serif tracking-[0.5em] uppercase mb-4 ml-[0.5em]">
          Ouroboros
        </h1>
        <p className="text-gray-400 font-mono text-sm md:text-base tracking-widest mb-12 uppercase">
          O fim é o começo.
        </p>
        
        <button 
          onClick={handleReset}
          className="flex items-center gap-3 px-8 py-4 bg-white text-black font-black uppercase tracking-widest hover:scale-110 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.3)]"
        >
          <RotateCcw size={20} /> Reiniciar Universo
        </button>
        
        <button 
          onClick={onBack} 
          className="mt-8 text-white/30 hover:text-white text-xs uppercase tracking-widest transition-colors"
        >
          Permanecer no Fim
        </button>
      </div>
    </div>
  );
};
