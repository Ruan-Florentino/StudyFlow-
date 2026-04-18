import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft } from 'lucide-react';

export const Zenith = ({ onBack }: { onBack: () => void }) => {
  return (
    <div className="fixed inset-0 z-50 bg-white flex items-center justify-center">
      <button 
        onClick={onBack} 
        className="absolute top-8 left-8 text-black/10 hover:text-black transition-colors duration-1000"
      >
        <ChevronLeft size={32} strokeWidth={1} />
      </button>
      
      <div className="text-center">
        <motion.div
          animate={{ 
            scale: [1, 2.5, 1],
            opacity: [0.05, 0.3, 0.05]
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-64 h-64 rounded-full border border-black mx-auto mb-24"
        />
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 4 }}
          className="text-black font-serif tracking-[1em] uppercase text-xs ml-[1em]"
        >
          Apenas respire.
        </motion.p>
      </div>
    </div>
  );
};
