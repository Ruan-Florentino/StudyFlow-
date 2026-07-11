import { motion, useReducedMotion } from 'motion/react';
import { AthenaLogo } from './AthenaLogo';

export function AthenaSplash({ compact = false }: { compact?: boolean }) {
  const reduceMotion = useReducedMotion() ?? false;
  return (
    <div className="relative flex min-h-[240px] w-full items-center justify-center overflow-hidden bg-[#050505] px-6 text-center text-white" role="status" aria-label="Iniciando Athena">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(0,232,143,.12),transparent_42%)]" />
      <svg aria-hidden viewBox="0 0 260 150" className="absolute bottom-[-12%] w-[min(520px,90vw)] text-primary opacity-[0.035]" fill="none" stroke="currentColor" strokeWidth="5">
        <path d="M130 132C103 101 70 91 25 97V18c43-3 78 9 105 36 27-27 62-39 105-36v79c-45-6-78 4-105 35Z" />
        <path d="M130 54v78" />
      </svg>
      <motion.div
        initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.92, y: reduceMotion ? 0 : 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0.15 : 0.48, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex flex-col items-center"
      >
        <AthenaLogo variant="badge-glow" size={compact ? 78 : 112} decorative />
        <span className="mt-4 text-2xl font-black tracking-[0.34em] text-primary sm:text-3xl">ATHENA</span>
        <span className="mt-2 text-xs font-medium tracking-[0.14em] text-white/55 sm:text-sm">Sua inteligência de estudos</span>
      </motion.div>
    </div>
  );
}
