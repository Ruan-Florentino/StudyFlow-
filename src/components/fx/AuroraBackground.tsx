import { useReducedMotion } from 'motion/react';
import { cn } from '../UI';

export type AuroraIntensity = 'subtle' | 'normal';

export interface AuroraBackgroundProps {
  className?: string;
  /** `subtle` — home / hubs; `normal` — mais presença (use com parcimônia). */
  intensity?: AuroraIntensity;
}

/**
 * Camada de luz orgânica (blobs + blur + mesh).
 * Não captura pointer-events. Respeita `prefers-reduced-motion`.
 */
export function AuroraBackground({ className, intensity = 'subtle' }: AuroraBackgroundProps) {
  const reduceMotion = useReducedMotion();
  const blob =
    intensity === 'subtle'
      ? 'opacity-[0.2] md:opacity-[0.24]'
      : 'opacity-[0.32] md:opacity-[0.4]';

  if (reduceMotion) {
    return (
      <div
        className={cn('pointer-events-none absolute inset-0 -z-10 overflow-hidden', className)}
        aria-hidden
      >
        <div
          className="absolute inset-0 opacity-80"
          style={{
            background: 'var(--mesh-bg-spot-a), var(--mesh-bg-spot-b)',
          }}
        />
      </div>
    );
  }

  return (
    <div
      className={cn('pointer-events-none absolute inset-0 -z-10 overflow-hidden', className)}
      aria-hidden
    >
      <div
        className="absolute inset-0 opacity-[0.5]"
        style={{
          background: 'var(--mesh-bg-spot-a), var(--mesh-bg-spot-b)',
        }}
      />
      <div
        className={cn(
          'absolute -left-[18%] -top-[28%] h-[min(400px,72vw)] w-[min(400px,72vw)] rounded-full bg-primary/35 blur-[100px] animate-aurora-1',
          blob
        )}
      />
      <div
        className={cn(
          'absolute -bottom-[22%] -right-[12%] h-[min(460px,78vw)] w-[min(460px,78vw)] rounded-full bg-neon-purple/30 blur-[118px] animate-aurora-2',
          blob
        )}
      />
      <div
        className={cn(
          'absolute left-1/2 top-[38%] h-[min(300px,58vw)] w-[min(300px,58vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-neon-cyan/20 blur-[88px] animate-aurora-3',
          intensity === 'subtle' ? 'opacity-[0.16] md:opacity-[0.2]' : 'opacity-[0.26] md:opacity-[0.32]'
        )}
      />
    </div>
  );
}
