import { X } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { clsx } from 'clsx';
import { easings, springs, staggerContainer, staggerItemTight } from '../../lib/animations';

export interface ActiveFilterChipsProps {
  labels: string[];
  onRemoveIndex?: (index: number) => void;
  className?: string;
}

/** Resumo legível dos filtros (ex.: abaixo do botão “Filtros” no mobile). */
export function ActiveFilterChips({ labels, onRemoveIndex, className }: ActiveFilterChipsProps) {
  const reduceMotion = useReducedMotion() ?? false;

  if (labels.length === 0) return null;

  return (
    <motion.ul
      className={clsx('flex flex-wrap gap-2', className)}
      aria-label="Filtros ativos"
      variants={staggerContainer}
      initial="hidden"
      animate="show"
    >
      {labels.map((text, i) => (
        <motion.li
          key={`${text}-${i}`}
          variants={staggerItemTight}
          className="flex items-center gap-1 pl-3 pr-1 py-1 rounded-full bg-primary/15 border border-primary/25 text-[10px] font-bold text-primary max-w-full"
        >
          <span className="truncate">{text}</span>
          {onRemoveIndex ? (
            <motion.button
              type="button"
              whileTap={{ scale: reduceMotion ? 1 : 0.9 }}
              transition={reduceMotion ? { duration: 0.12, ease: easings.smoothOut } : springs.snappy}
              className="p-1 rounded-full hover:bg-primary/20 text-primary shrink-0"
              aria-label={`Remover ${text}`}
              onClick={() => onRemoveIndex(i)}
            >
              <X size={12} />
            </motion.button>
          ) : null}
        </motion.li>
      ))}
    </motion.ul>
  );
}
