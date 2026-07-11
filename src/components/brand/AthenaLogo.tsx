import { useState } from 'react';
import { clsx } from 'clsx';
import { motion, useReducedMotion } from 'motion/react';
import type { AthenaTheme } from '../../design-system/brand';

export type AthenaLogoVariant =
  | 'app'
  | 'app-alt'
  | 'circle'
  | 'square'
  | 'light-bg'
  | 'symbol'
  | 'mini'
  | 'favicon'
  | 'monochrome'
  | 'outline'
  | 'badge-glow'
  | 'badge-dark'
  | 'horizontal'
  | 'vertical'
  | 'loading'
  | 'notification';

export interface AthenaLogoProps {
  variant?: AthenaLogoVariant;
  size?: number;
  theme?: AthenaTheme;
  animated?: boolean;
  showWordmark?: boolean;
  className?: string;
  accessibilityLabel?: string;
  decorative?: boolean;
}

const variants: Record<Exclude<AthenaLogoVariant, 'monochrome'>, string> = {
  app: '/brand/athena-app-icon.png',
  'app-alt': '/brand/athena-app-icon-alt.png',
  circle: '/brand/athena-circle.png',
  square: '/brand/athena-square.png',
  'light-bg': '/brand/athena-light-bg.png',
  symbol: '/brand/athena-symbol.webp',
  mini: '/brand/athena-mini.svg',
  favicon: '/brand/athena-favicon.png',
  outline: '/brand/athena-outline.svg',
  'badge-glow': '/brand/athena-badge-glow.png',
  'badge-dark': '/brand/athena-badge-dark.png',
  horizontal: '/brand/athena-horizontal.webp',
  vertical: '/brand/athena-vertical.webp',
  loading: '/brand/athena-loading.svg',
  notification: '/brand/athena-notification.png',
};

const monochromeDark = '/brand/athena-monochrome-dark.png';
const monochromeLight = '/brand/athena-monochrome-light.png';
const mini = '/brand/athena-mini.svg';

const aspectRatios: Partial<Record<AthenaLogoVariant, number>> = {
  horizontal: 1100 / 280,
  vertical: 560 / 720,
};

export function AthenaLogo({
  variant = 'symbol',
  size = 40,
  theme = 'auto',
  animated = false,
  showWordmark = false,
  className,
  accessibilityLabel = 'Logo da Athena',
  decorative = false,
}: AthenaLogoProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const [failed, setFailed] = useState(false);
  const resolvedVariant: AthenaLogoVariant = showWordmark && !['horizontal', 'vertical'].includes(variant)
    ? 'horizontal'
    : variant;
  const src = failed
    ? mini
    : resolvedVariant === 'monochrome'
      ? theme === 'light' ? monochromeDark : monochromeLight
      : variants[resolvedVariant];
  const aspectRatio = aspectRatios[resolvedVariant] ?? 1;
  const width = aspectRatio >= 1 ? size * aspectRatio : size;
  const height = aspectRatio >= 1 ? size : size / aspectRatio;
  const shouldAnimate = animated && !reduceMotion;

  return (
    <motion.img
      src={src}
      alt={decorative ? '' : accessibilityLabel}
      aria-hidden={decorative || undefined}
      width={Math.round(width)}
      height={Math.round(height)}
      draggable={false}
      decoding="async"
      loading={resolvedVariant === 'app' ? 'eager' : 'lazy'}
      onError={() => setFailed(true)}
      initial={shouldAnimate ? { opacity: 0, scale: 0.92 } : false}
      animate={shouldAnimate ? { opacity: 1, scale: 1 } : undefined}
      transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
      className={clsx('select-none object-contain', className)}
      style={{ width, height }}
    />
  );
}
