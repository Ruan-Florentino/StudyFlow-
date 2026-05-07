import { clsx } from 'clsx';
import { Search } from 'lucide-react';

export interface FilterSearchInputProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  inputId?: string;
}

export function FilterSearchInput({
  label,
  value,
  onChange,
  placeholder = 'Buscar…',
  disabled,
  className,
  inputId,
}: FilterSearchInputProps) {
  const id = inputId ?? `filter-search-${label.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <div className={clsx('relative', className)}>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none"
        size={18}
        aria-hidden
      />
      <input
        id={id}
        type="search"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={clsx(
          'w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-10 pr-4 text-sm outline-none focus:border-primary/50 placeholder:text-text-secondary/50',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        autoComplete="off"
      />
    </div>
  );
}
