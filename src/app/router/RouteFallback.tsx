import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { pageShell, pageShellReduced, pageShellTransition } from '../../lib/animations';

/**
 * RouteFallback
 * Mostrado durante o lazy load de uma rota.
 * Deve ser RÁPIDO de renderizar e visualmente
 * estável (evitar layout shift).
 */
export function RouteFallback() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      variants={reduceMotion ? pageShellReduced : pageShell}
      initial="initial"
      animate="animate"
      transition={reduceMotion ? { duration: 0.12 } : pageShellTransition}
      className="mx-auto w-full max-w-7xl px-4 md:px-8 pt-6 md:pt-8 space-y-4"
    >
      <div className="skeleton-shine h-8 rounded-md w-48 max-w-full" />
      <div className="skeleton-shine h-4 rounded-md w-full max-w-md" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <div className="skeleton-shine h-32 rounded-xl w-full" />
        <div className="skeleton-shine h-32 rounded-xl w-full" />
        <div className="skeleton-shine h-32 rounded-xl w-full" />
      </div>
    </motion.div>
  );
}
