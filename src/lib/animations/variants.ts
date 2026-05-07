import { easings, springs, tweens } from './easings';

/** Container de lista: cascata de filhos */
export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.048,
      delayChildren: 0.04,
      when: 'beforeChildren',
    },
  },
} as const;

/** Item de lista — entra de baixo com spring */
export const staggerItem = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: springs.card,
  },
} as const;

/** Item mais compacto (grids densos) */
export const staggerItemTight = {
  hidden: { opacity: 0, y: 6 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 360, damping: 29, mass: 0.84 },
  },
} as const;

/** Fade + leve slide (páginas / seções) */
export const fadeUp = {
  initial: { opacity: 0, y: 18 },
  animate: {
    opacity: 1,
    y: 0,
    transition: springs.soft,
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: tweens.fast,
  },
} as const;

/** Modal / overlay */
export const scaleFade = {
  initial: { opacity: 0, scale: 0.965 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: springs.soft,
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    transition: tweens.fast,
  },
} as const;

/** Props de transition recomendadas (opacity, layout simples) */
export const defaultTransition = tweens.normal;

/** Transição de rota com spring (respeitar `prefers-reduced-motion` no outlet). */
export const pageShellTransition = springs.page;

/**
 * Shell de rota — sem scale (evita flicker GPU, sobretudo no mobile).
 * Y reduzido; transição em tween aplicada no outlet (mobile mais curta).
 */
export const pageShell = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -5 },
} as const;

/** Troca de rota em viewports estreitas — só opacidade */
export const pageShellTouch = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
} as const;

/** Troca de rota com prefers-reduced-motion */
export const pageShellReduced = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
} as const;
