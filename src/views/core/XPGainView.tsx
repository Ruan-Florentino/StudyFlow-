import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { springs } from '../../lib/animations/easings';

interface XPGainProps {
  amount: number;
  onComplete: () => void;
}

const XPGainView = ({ amount, onComplete }: XPGainProps) => {
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: reduceMotion ? 0 : 20,
        scale: reduceMotion ? 1 : 0.5,
      }}
      animate={{
        opacity: 1,
        y: reduceMotion ? -24 : -50,
        scale: reduceMotion ? 1.15 : 1.5,
      }}
      exit={{ opacity: 0, scale: reduceMotion ? 1 : 2 }}
      transition={reduceMotion ? { duration: 0.18, ease: [0.22, 1, 0.36, 1] } : springs.bouncy}
      onAnimationComplete={onComplete}
      className="fixed bottom-32 left-1/2 -translate-x-1/2 z-[200] pointer-events-none"
    >
      <div className="flex items-center gap-2 px-4 py-2 bg-primary/20 backdrop-blur-xl border border-primary/50 rounded-full shadow-[0_0_30px_rgba(var(--hub-primary-rgb),0.45)]">
        <Sparkles size={20} className="text-primary animate-pulse" />
        <span className="text-2xl font-black text-primary font-premium-mono">+{amount} XP</span>
      </div>
    </motion.div>
  );
};

export default XPGainView;
