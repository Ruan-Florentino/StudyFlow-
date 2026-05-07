import { clsx } from 'clsx';

export interface FilterSelectOption {
  value: string;
  label: string;
}

export interface FilterSelectProps {
  label: string;
  value: string;
  options: readonly FilterSelectOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export function FilterSelect({
  label,
  value,
  options,
  onChange,
  disabled,
  className,
  id,
}: FilterSelectProps) {
  const selectId = id ?? `filter-select-${label.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <div className={clsx('space-y-1', className)}>
      <label htmlFor={selectId} className="sr-only">
        {label}
      </label>
      <select
        id={selectId}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className={clsx(
          'w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 text-[10px] font-bold outline-none focus:border-primary/50 uppercase tracking-widest appearance-none text-center',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        aria-label={label}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-[var(--bg-secondary)]">
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
