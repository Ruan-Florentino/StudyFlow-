import React from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

/**
 * ViewTemplate / XPGainView
 * Componente minimalista para validação do padrão de extração.
 */
interface XPGainProps {
  amount: number;
  onComplete: () => void;
}

const XPGainView = ({ amount, onComplete }: XPGainProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.5 }}
      animate={{ opacity: 1, y: -50, scale: 1.5 }}
      exit={{ opacity: 0, scale: 2 }}
      onAnimationComplete={onComplete}
      className="fixed bottom-32 left-1/2 -translate-x-1/2 z-[200] pointer-events-none"
    >
      <div className="flex items-center gap-2 px-4 py-2 bg-primary/20 backdrop-blur-xl border border-primary/50 rounded-full shadow-[0_0_30px_rgba(0,232,143,0.5)]">
        <Sparkles size={20} className="text-primary animate-pulse" />
        <span className="text-2xl font-black text-primary font-premium-mono">+{amount} XP</span>
      </div>
    </motion.div>
  );
};

export default XPGainView;
