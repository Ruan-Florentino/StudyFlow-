import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft } from 'lucide-react';

export const TheClicker = ({ onBack }: { onBack: () => void }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (count > 10) {
        setCount(c => c + Math.max(1, Math.floor(c * 0.05))); // Auto-advance exponentially
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [count]);

  return (
    <div className="fixed inset-0 z-[100013] bg-zinc-950 text-white flex flex-col items-center justify-center font-mono select-none">
      <button onClick={onBack} className="absolute top-8 left-8 opacity-50 hover:opacity-100 flex items-center gap-2 transition-opacity">
        <ChevronLeft size={20} /> Voltar
      </button>
      
      <div className="text-center space-y-12">
        <h1 className="text-xl md:text-2xl text-zinc-500 uppercase tracking-widest">Simulador de Avanço</h1>
        
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={() => setCount(c => c + 1)}
          className="w-48 h-48 md:w-64 md:h-64 mx-auto bg-zinc-800 rounded-full flex items-center justify-center text-3xl md:text-4xl font-black border-8 border-zinc-700 shadow-[0_0_50px_rgba(0,0,0,0.5)] hover:bg-zinc-700 transition-colors"
        >
          AVANÇAR
        </motion.button>
        
        <div className="space-y-2">
          <div className="text-5xl md:text-7xl font-black tracking-tighter">
            {count.toLocaleString()}
          </div>
          <p className="text-zinc-500 uppercase tracking-widest text-sm">avanços realizados</p>
        </div>

        <div className="h-8">
          {count > 10 && count < 1000 && <p className="text-green-500 animate-pulse text-sm">Auto-avanço ativado...</p>}
          {count >= 1000 && count < 100000 && <p className="text-yellow-500 animate-pulse text-sm">Avanço exponencial atingido...</p>}
          {count >= 100000 && <p className="text-red-500 animate-pulse text-sm font-bold">SOBRECARGA DE AVANÇO</p>}
        </div>
      </div>
    </div>
  );
};
