import { clsx } from 'clsx';
import { motion } from 'motion/react';
import { springs } from '../../lib/animations';

export interface FilterChipProps {
  children: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

export function FilterChip({ children, active, disabled, onClick, className }: FilterChipProps) {
  return (
    <motion.button
      type="button"
      transition={springs.snappy}
      whileHover={disabled ? undefined : { scale: 1.025, y: -1 }}
      whileTap={disabled ? undefined : { scale: 0.975, y: 0 }}
      disabled={disabled}
      onClick={onClick}
      className={clsx(
        'px-4 py-2 rounded-2xl text-[10px] font-bold uppercase tracking-widest border transition-all duration-300 ease-out whitespace-nowrap',
        active
          ? 'bg-primary text-black border-primary shadow-[0_0_16px_rgba(var(--hub-primary-rgb),0.25)]'
          : 'bg-white/5 text-text-secondary border-white/10 hover:border-primary/40',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {children}
    </motion.button>
  );
}
