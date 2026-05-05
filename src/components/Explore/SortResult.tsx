import React from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { AnimatedButton } from '../UI';

interface SortResultProps {
  result: {
    area: string;
    subtopic: string;
    icon: string;
  };
  onStart: () => void;
  onRetry: () => void;
}

const SortResult: React.FC<SortResultProps> = ({ result, onStart, onRetry }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: -10 }}
      className="relative z-10 flex flex-col items-center text-center space-y-4 py-4 w-full"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 12 }}
        className="text-6xl mb-2 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
      >
        {result.icon}
      </motion.div>

      <p className="text-[10px] font-bold text-primary uppercase tracking-[0.25em]">Sua matéria surpresa</p>

      <div className="space-y-2">
        <motion.h3
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-lg md:text-xl font-premium-title italic text-white leading-snug px-2"
        >
          <span className="text-white/90">{result.area}</span>
          <span className="text-primary mx-1">→</span>
          <span className="text-primary">{result.subtopic}</span>
        </motion.h3>
        <p className="text-xs text-text-secondary max-w-sm mx-auto">
          Ao iniciar, abrimos o banco de questões já filtrado por esta área e subtópico.
        </p>
      </div>

      <div className="flex items-center justify-center gap-2 pt-1 text-white/30">
        <Sparkles size={14} />
        <span className="text-[10px] uppercase tracking-widest font-bold">Sorteio em dois níveis</span>
      </div>

      <div className="flex gap-3 w-full pt-4">
        <AnimatedButton
          onClick={onStart}
          className="flex-1 py-4 bg-primary text-black text-xs font-bold uppercase tracking-widest"
          glow
        >
          Começar Agora
        </AnimatedButton>
        <button
          onClick={onRetry}
          className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl text-white/60 text-xs font-bold uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all"
        >
          Sortear Outro
        </button>
      </div>
    </motion.div>
  );
};

export default SortResult;
