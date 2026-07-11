import { motion, useReducedMotion } from 'motion/react';
import { clsx } from 'clsx';
import { AthenaLogo } from './AthenaLogo';

type LoaderProps = { size?: number; className?: string; label?: string };

export function AthenaLoader({ size = 52, className, label = 'Athena carregando' }: LoaderProps) {
  const reduceMotion = useReducedMotion() ?? false;
  return (
    <span role="status" aria-label={label} className={clsx('relative inline-flex items-center justify-center', className)} style={{ width: size, height: size }}>
      <motion.span
        aria-hidden
        className="absolute inset-0 rounded-full border-2 border-primary/15 border-t-primary"
        animate={reduceMotion ? { opacity: [0.6, 1, 0.6] } : { rotate: 360 }}
        transition={{ duration: reduceMotion ? 1.4 : 1.05, repeat: Infinity, ease: 'linear' }}
      />
      <AthenaLogo variant="mini" size={size * 0.58} decorative />
    </span>
  );
}

export function AthenaPulse({ size = 42, className, label = 'Athena processando' }: LoaderProps) {
  const reduceMotion = useReducedMotion() ?? false;
  return (
    <motion.span
      role="status"
      aria-label={label}
      className={clsx('inline-flex items-center justify-center rounded-full bg-primary/[0.06]', className)}
      animate={reduceMotion ? undefined : { opacity: [0.82, 1, 0.82], scale: [0.98, 1, 0.98] }}
      transition={{ duration: 1.7, repeat: Infinity, ease: 'easeInOut' }}
      style={{ width: size, height: size }}
    >
      <AthenaLogo variant="mini" size={size * 0.72} decorative />
    </motion.span>
  );
}

export function AthenaOrbit({ size = 56, className, label = 'Athena gerando resultado' }: LoaderProps) {
  const reduceMotion = useReducedMotion() ?? false;
  return (
    <span role="status" aria-label={label} className={clsx('relative inline-flex items-center justify-center', className)} style={{ width: size, height: size }}>
      <AthenaLogo variant="outline" size={size * 0.68} decorative />
      <motion.span
        aria-hidden
        className="absolute inset-0"
        animate={reduceMotion ? undefined : { rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
      >
        <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-primary shadow-[0_0_12px_rgba(0,232,143,.55)]" />
      </motion.span>
    </span>
  );
}
