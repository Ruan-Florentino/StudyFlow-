/**
 * Curvas e durações padrão para motion/react e CSS.
 * Preferir estes valores em novas microinterações (Fase 3+).
 */

/** Tuplas cubic-bezier para `transition: { ease: [...] }` no motion/react */
export const easings = {
  /** Apple-like default */
  smooth: [0.25, 0.1, 0.25, 1],
  /** Saída suave — padrão para fades e troca de estado */
  smoothOut: [0.22, 1, 0.36, 1],
  /** Entrada/saída simétrica — modais, overlays */
  smoothInOut: [0.45, 0, 0.55, 1],
  spring: [0.34, 1.56, 0.64, 1],
  springSoft: [0.43, 1.31, 0.42, 1],
  snappy: [0.4, 0, 0.2, 1],
  /** Entrada com leve “pull” — destaque hero */
  anticipate: [0.68, -0.55, 0.265, 1.55],
} as const;

export type EasingName = keyof typeof easings;

/** Durações em ms */
export const durations = {
  instant: 100,
  fast: 200,
  normal: 300,
  slow: 500,
  slower: 800,
  cinematic: 1200,
} as const;

export type DurationName = keyof typeof durations;

/**
 * Tweens (duração em s + ease) quando spring polui ou para exit rápido.
 */
export const tweens = {
  micro: { duration: 0.12, ease: easings.smoothOut },
  fast: { duration: 0.2, ease: easings.smoothOut },
  normal: { duration: 0.32, ease: easings.smoothOut },
  slow: { duration: 0.48, ease: easings.smoothInOut },
  /** Ênfase curta — CTAs, badges */
  pop: { duration: 0.38, ease: easings.springSoft },
} as const;

/**
 * Presets de spring para `transition={{ type: 'spring', ... }}`.
 * `page` / `card` / `pill` — hierarquia visual consistente (rotas, cartões, indicador nav).
 */
export const springs = {
  /** Toque / press — botões, chips */
  snappy: { type: 'spring' as const, stiffness: 460, damping: 31, mass: 0.74 },
  /** Hover, drawers leves */
  soft: { type: 'spring' as const, stiffness: 300, damping: 27, mass: 0.88 },
  bouncy: { type: 'spring' as const, stiffness: 520, damping: 19, mass: 0.72 },
  /** Troca de rota (`AnimatedPageOutlet`) — pouco overshoot, sensação “app nativo” */
  page: { type: 'spring' as const, stiffness: 275, damping: 36, mass: 0.96 },
  /** Entrada de cartões glass / listas */
  card: { type: 'spring' as const, stiffness: 315, damping: 28, mass: 0.9 },
  /** `layoutId` (ex.: pill da BottomNav) */
  pill: { type: 'spring' as const, stiffness: 390, damping: 33, mass: 0.8 },
  /** Shared layout / reorder */
  layout: { type: 'spring' as const, stiffness: 350, damping: 32, mass: 0.86 },
} as const;

/** `cubic-bezier(...)` para style/CSS inline */
export function cssCubicBezier(tuple: readonly [number, number, number, number]): string {
  return `cubic-bezier(${tuple[0]}, ${tuple[1]}, ${tuple[2]}, ${tuple[3]})`;
}
