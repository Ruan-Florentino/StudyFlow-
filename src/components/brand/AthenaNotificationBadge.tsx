import { motion, useReducedMotion } from 'motion/react';
import { AthenaLogo } from './AthenaLogo';

export function AthenaNotificationBadge({ count = 0, label = 'Notificações da Athena' }: { count?: number; label?: string }) {
  const reduceMotion = useReducedMotion() ?? false;
  const displayCount = count > 99 ? '99+' : String(Math.max(0, count));
  return (
    <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-primary/25 bg-[#07110e]" aria-label={`${label}: ${displayCount}`}>
      <AthenaLogo variant="mini" size={27} decorative />
      {count > 0 ? (
        <motion.span
          initial={reduceMotion ? false : { scale: 0.6 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 420, damping: 22 }}
          className="absolute -right-1.5 -top-1.5 min-w-5 rounded-full border-2 border-[#050505] bg-primary px-1 text-center text-[10px] font-black leading-4 text-[#03110b]"
        >
          {displayCount}
        </motion.span>
      ) : null}
    </span>
  );
}
