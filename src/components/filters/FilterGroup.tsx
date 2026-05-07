import { type ReactNode, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { easings } from '../../lib/animations/easings';

export interface FilterGroupProps {
  label: string;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export function FilterGroup({ label, children, defaultOpen = true, className }: FilterGroupProps) {
  const [open, setOpen] = useState(defaultOpen);
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <div className={clsx('border border-white/5 rounded-xl overflow-hidden', className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-2 px-3 py-2.5 bg-white/[0.03] hover:bg-white/[0.06] transition-colors text-left"
        aria-expanded={open}
      >
        <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">
          {label}
        </span>
        <ChevronDown
          size={16}
          className={clsx('text-text-secondary transition-transform shrink-0', open && 'rotate-180')}
          aria-hidden
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={
              reduceMotion
                ? { duration: 0.12, ease: easings.smoothOut }
                : { duration: 0.2, ease: easings.smooth }
            }
            className="overflow-hidden"
          >
            <div className="p-3 pt-0 space-y-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
