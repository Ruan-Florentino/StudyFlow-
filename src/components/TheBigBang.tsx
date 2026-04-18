import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export const TheBigBang = ({ onBack }: { onBack: () => void }) => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 2000), // Singularity appears
      setTimeout(() => setStage(2), 6000), // Starts throbbing/expanding slightly
      setTimeout(() => setStage(3), 9000), // The explosion
      setTimeout(() => setStage(4), 11000), // The aftermath (white)
      setTimeout(() => setStage(5), 14000), // New universe text
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="fixed inset-0 z-[99999] bg-black flex items-center justify-center overflow-hidden cursor-none">
      <AnimatePresence>
        {stage >= 1 && stage < 3 && (
          <motion.div
            key="singularity"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: stage === 2 ? [1, 1.5, 1] : 1, 
              opacity: 1 
            }}
            transition={{ 
              scale: { duration: 0.5, repeat: Infinity },
              opacity: { duration: 2 }
            }}
            className="w-2 h-2 bg-white rounded-full shadow-[0_0_50px_rgba(255,255,255,1)]"
          />
        )}

        {stage >= 3 && (
          <motion.div
            key="explosion"
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 300, opacity: stage >= 4 ? 0 : 1 }}
            transition={{ duration: 1.5, ease: "easeIn" }}
            className="absolute w-10 h-10 bg-white rounded-full"
          />
        )}

        {stage >= 4 && (
          <motion.div
            key="whiteout"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-white"
          />
        )}

        {stage >= 5 && (
          <motion.div
            key="text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 3 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-white text-black z-10 cursor-default"
          >
            <h1 className="font-serif italic text-4xl md:text-6xl tracking-tighter mb-8">
              Haja luz.
            </h1>
            <button 
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="px-8 py-3 border border-black text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
            >
              Iniciar Novo Universo
            </button>
            <button 
              onClick={onBack}
              className="mt-8 text-black/30 hover:text-black text-xs uppercase tracking-widest transition-colors"
            >
              Voltar ao Vazio
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
