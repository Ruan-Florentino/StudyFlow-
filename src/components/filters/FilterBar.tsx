import { type ReactNode } from 'react';
import { Filter } from 'lucide-react';
import { clsx } from 'clsx';
import { motion, useReducedMotion } from 'motion/react';
import { easings, springs } from '../../lib/animations';

export interface FilterBarProps {
  title?: string;
  activeCount: number;
  onClear?: () => void;
  children: ReactNode;
  className?: string;
  /** `sticky` mantém a barra visível ao rolar (desktop). */
  variant?: 'inline' | 'sticky';
  id?: string;
}

export function FilterBar({
  title = 'Filtros',
  activeCount,
  onClear,
  children,
  className,
  variant = 'inline',
  id = 'filter-bar',
}: FilterBarProps) {
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduceMotion ? { duration: 0.15, ease: easings.smoothOut } : springs.card}
      className={clsx(
        'rounded-2xl border border-white/10 bg-white/[0.02] p-4 space-y-4 transition-colors duration-300 ease-out',
        variant === 'sticky' && 'sticky top-4 z-20 backdrop-blur-md bg-[var(--bg-secondary)]/90',
        className
      )}
      aria-label={title}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <Filter size={18} className="text-primary shrink-0" aria-hidden />
          <span className="text-sm font-bold text-white/90 truncate">{title}</span>
          {activeCount > 0 && (
            <motion.span
              initial={{ scale: reduceMotion ? 1 : 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={reduceMotion ? { duration: 0.12, ease: easings.smoothOut } : springs.snappy}
              className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/25 shrink-0"
            >
              {activeCount} ativo{activeCount !== 1 ? 's' : ''}
            </motion.span>
          )}
        </div>
        {activeCount > 0 && onClear ? (
          <motion.button
            type="button"
            whileTap={{ scale: reduceMotion ? 1 : 0.97 }}
            transition={reduceMotion ? { duration: 0.12, ease: easings.smoothOut } : springs.snappy}
            onClick={onClear}
            className="text-[10px] font-bold uppercase tracking-widest text-text-secondary hover:text-primary transition-colors px-3 py-1.5 rounded-xl border border-white/10 hover:border-primary/30"
          >
            Limpar tudo
          </motion.button>
        ) : null}
      </div>
      {children}
    </motion.section>
  );
}
