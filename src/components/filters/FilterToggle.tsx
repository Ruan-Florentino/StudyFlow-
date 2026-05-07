import { clsx } from 'clsx';

export interface FilterToggleProps {
  label: string;
  checked: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export function FilterToggle({ label, checked, onChange, disabled, className }: FilterToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={clsx(
        'flex items-center justify-between gap-3 w-full px-3 py-2.5 rounded-xl border text-left transition-colors',
        checked ? 'border-primary/50 bg-primary/10' : 'border-white/10 bg-white/[0.02] hover:border-white/20',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <span className="text-xs font-bold text-white/90">{label}</span>
      <span
        className={clsx(
          'w-10 h-6 rounded-full relative transition-colors shrink-0',
          checked ? 'bg-primary' : 'bg-white/15'
        )}
      >
        <span
          className={clsx(
            'absolute top-1 w-4 h-4 rounded-full bg-black transition-all',
            checked ? 'left-5' : 'left-1'
          )}
        />
      </span>
    </button>
  );
}
