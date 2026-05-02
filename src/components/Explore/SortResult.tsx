import React from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { AnimatedButton } from '../UI';

interface SortResultProps {
  result: {
    subject: string;
    topic: string;
    questions: number;
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
        transition={{ type: "spring", damping: 12 }}
        className="text-6xl mb-2 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
      >
        {result.icon}
      </motion.div>
      
      <div className="space-y-1">
        <motion.h3 
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]"
        >
          {result.subject}
        </motion.h3>
        <motion.h4 
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-2xl font-premium-title italic text-white"
        >
          {result.topic}
        </motion.h4>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center gap-2"
        >
          <div className="w-1 h-1 rounded-full bg-primary/50" />
          <p className="text-xs text-text-secondary">{result.questions} questões disponíveis</p>
          <div className="w-1 h-1 rounded-full bg-primary/50" />
        </motion.div>
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
          className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl text-white/60 text-xs font-bold uppercase tracking-widest hover:bg-white/ hover:text-white transition-all"
        >
          Sortear Outro
        </button>
      </div>
    </motion.div>
  );
};

export default SortResult;
