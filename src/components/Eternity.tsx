import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft } from 'lucide-react';

export const Eternity = ({ onBack }: { onBack: () => void }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden">
      <button onClick={onBack} className="absolute top-8 left-8 text-white/20 hover:text-white z-20">
        <ChevronLeft size={24} />
      </button>
      
      {Array.from({ length: 100 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute border border-white/5 rounded-full pointer-events-none"
          style={{ width: i * 30, height: i * 30 }}
          animate={{ 
            rotate: i % 2 === 0 ? 360 : -360, 
            scale: [1, 1.1, 1] 
          }}
          transition={{ 
            duration: 20 + (i * 0.5), 
            repeat: Infinity, 
            ease: "linear" 
          }}
        />
      ))}
      
      <motion.div 
        animate={{ opacity: [0.1, 0.8, 0.1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="z-10 text-white font-serif text-4xl tracking-[1em] ml-[1em] uppercase mix-blend-difference pointer-events-none"
      >
        Eternidade
      </motion.div>
    </div>
  );
};
