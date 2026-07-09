import React from 'react';
import { cn } from '../../../components/UI';
import { ATHENA_CONFIG } from '../constants/config';

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
  const [imageOk, setImageOk] = React.useState(true);

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
        {imageOk ? (
          <img
            src={ATHENA_CONFIG.ICON_SRC}
            alt=""
            className={cn('athena-avatar-image object-contain', imageClasses[size])}
            draggable={false}
            decoding="async"
            onError={() => setImageOk(false)}
          />
        ) : (
          <span className={cn('athena-avatar-fallback leading-none', size === 'sm' ? 'text-lg' : size === 'md' ? 'text-xl' : 'text-3xl')}>
            {ATHENA_CONFIG.ICON}
          </span>
        )}
      </span>
      <span className="athena-avatar-status" aria-hidden />
    </span>
  );
}