import type { FC, ReactNode } from 'react';
import { cn } from '../UI';

const tones = {
  primary:
    'border-primary/45 bg-primary/12 text-primary shadow-[0_0_14px_rgba(0,232,143,0.22)]',
  amber:
    'border-neon-amber/50 bg-neon-amber/10 text-neon-amber shadow-[0_0_12px_rgba(251,191,36,0.2)]',
  purple:
    'border-neon-purple/45 bg-neon-purple/10 text-neon-purple shadow-[0_0_14px_rgba(183,148,244,0.2)]',
} as const;

export type NeonBadgeTone = keyof typeof tones;

export interface NeonBadgeProps {
  children: ReactNode;
  tone?: NeonBadgeTone;
  className?: string;
}

/** Selo VIP / destaque — uso parcimonioso (Premium, streak, conquistas). */
export const NeonBadge: FC<NeonBadgeProps> = ({ children, tone = 'primary', className }) => (
  <span
    className={cn(
      'inline-flex items-center rounded-full border px-2.5 py-0.5 text-[9px] font-premium-mono font-bold uppercase tracking-[0.2em]',
      tones[tone],
      className
    )}
  >
    {children}
  </span>
);
