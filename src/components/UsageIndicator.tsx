import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useUsage } from '../hooks/useUsage';
import { cn } from './UI';
import { springs } from '../lib/animations';

interface Props {
  onUpgradeClick?: () => void;
}

export function UsageIndicator({ onUpgradeClick }: Props) {
  const { used, limit, percentage, isExhausted } = useUsage();

  const colorClass = percentage < 50 
    ? 'bg-emerald-500' 
    : percentage < 80 
      ? 'bg-amber-500' 
      : 'bg-red-500';

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springs.card}
      className="flex flex-col gap-1 min-w-[120px]"
    >
      <div className="flex items-center justify-between text-[10px] uppercase tracking-widest font-bold">
        <span className="text-text-secondary">IA Hoje</span>
        <motion.span
          key={`${used}-${limit}`}
          initial={{ opacity: 0, y: -3 }}
          animate={{ opacity: 1, y: 0 }}
          transition={springs.snappy}
          className={cn(isExhausted ? 'text-red-500' : 'text-white')}
        >
          {used}/{limit}
        </motion.span>
      </div>
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className={cn("h-full", colorClass)}
          initial={false}
          animate={{ width: `${Math.min(100, percentage)}%` }}
          transition={springs.soft}
        />
      </div>
      <AnimatePresence>
        {percentage >= 80 && onUpgradeClick && (
          <motion.button
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            whileTap={{ scale: 0.97 }}
            transition={springs.snappy}
            onClick={onUpgradeClick}
            className="text-[9px] text-amber-500 hover:text-amber-400 uppercase tracking-widest text-right mt-1 transition-colors duration-300 ease-out"
          >
            {isExhausted ? 'Upgrade Necessário' : 'Fazer Upgrade'}
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
