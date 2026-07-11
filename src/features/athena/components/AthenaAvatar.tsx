import { cn } from '../../../components/UI';
import { ATHENA_CONFIG } from '../constants/config';
import { AthenaLogo } from '../../../components/brand/AthenaLogo';

type AthenaAvatarSize = 'sm' | 'md' | 'lg' | 'xl';

const sizeClasses: Record<AthenaAvatarSize, string> = {
  sm: 'h-9 w-9 rounded-2xl',
  md: 'h-10 w-10 rounded-2xl',
  lg: 'h-16 w-16 rounded-[26px]',
  xl: 'h-20 w-20 rounded-[30px]',
};

const imageClasses: Record<AthenaAvatarSize, string> = {
  sm: 'h-7 w-7',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
  xl: 'h-14 w-14',
};

export function AthenaAvatar({
  size = 'md',
  active = false,
  className,
}: {
  size?: AthenaAvatarSize;
  active?: boolean;
  className?: string;
}) {
  return (
    <span
      role="img"
      aria-label={ATHENA_CONFIG.NAME}
      data-size={size}
      data-active={active ? 'true' : 'false'}
      className={cn('athena-avatar relative inline-flex shrink-0 items-center justify-center overflow-hidden', sizeClasses[size], className)}
    >
      <span className="athena-avatar-aura" aria-hidden />
      <span className="athena-avatar-core relative z-10 flex h-full w-full items-center justify-center">
        <AthenaLogo
          variant={active && (size === 'lg' || size === 'xl') ? 'badge-glow' : size === 'sm' ? 'mini' : 'badge-dark'}
          size={size === 'sm' ? 28 : size === 'md' ? 32 : size === 'lg' ? 52 : 60}
          decorative
          className={cn('athena-avatar-image object-contain', imageClasses[size])}
        />
      </span>
      <span className="athena-avatar-status" aria-hidden />
    </span>
  );
}
