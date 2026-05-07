import { type ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';
import { clsx } from 'clsx';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { easings, springs } from '../../lib/animations/easings';

export interface FilterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

/**
 * Bottom sheet simples para filtros no mobile (sem dependências novas).
 */
export function FilterSheet({
  open,
  onOpenChange,
  title = 'Filtros',
  children,
  footer,
  className,
}: FilterSheetProps) {
  const reduceMotion = useReducedMotion() ?? false;

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[200] md:hidden flex flex-col justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={reduceMotion ? { duration: 0.12, ease: easings.smoothOut } : undefined}
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm border-0 p-0 cursor-default"
            aria-label="Fechar filtros"
            onClick={() => onOpenChange(false)}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="filter-sheet-title"
            initial={{ y: reduceMotion ? 0 : 48, opacity: reduceMotion ? 1 : 0.9 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: reduceMotion ? 0 : 32, opacity: 0 }}
            transition={reduceMotion ? { duration: 0.15, ease: easings.smoothOut } : springs.soft}
            className={clsx(
              'relative max-h-[85vh] rounded-t-3xl border-t border-white/10 bg-[var(--bg-secondary)] shadow-lg flex flex-col',
              className
            )}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 80) onOpenChange(false);
            }}
          >
            <div className="flex justify-center pt-2 pb-1" aria-hidden>
              <div className="w-10 h-1 rounded-full bg-white/20" />
            </div>
            <div className="flex items-center justify-between px-4 pb-2 border-b border-white/5">
              <h2 id="filter-sheet-title" className="text-sm font-bold">
                {title}
              </h2>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="p-2 rounded-xl bg-white/5 border border-white/10"
                aria-label="Fechar"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">{children}</div>
            {footer ? (
              <div className="p-4 pt-2 border-t border-white/10 bg-[var(--bg-secondary)]">{footer}</div>
            ) : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
