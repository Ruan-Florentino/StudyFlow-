import { clsx } from 'clsx';

export interface FilterRangeInputsProps {
  label: string;
  minBound: number;
  maxBound: number;
  valueMin: number | null;
  valueMax: number | null;
  onChange: (next: { min: number | null; max: number | null }) => void;
  disabled?: boolean;
  className?: string;
}

export function FilterRangeInputs({
  label,
  minBound,
  maxBound,
  valueMin,
  valueMax,
  onChange,
  disabled,
  className,
}: FilterRangeInputsProps) {
  return (
    <fieldset
      disabled={disabled}
      className={clsx('space-y-2', disabled && 'opacity-50', className)}
    >
      <legend className="text-[10px] font-bold uppercase tracking-widest text-text-secondary px-1">
        {label}
      </legend>
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="number"
          min={minBound}
          max={maxBound}
          placeholder={String(minBound)}
          value={valueMin ?? ''}
          onChange={(e) => {
            const raw = e.target.value;
            onChange({
              min: raw === '' ? null : Math.min(maxBound, Math.max(minBound, Number(raw))),
              max: valueMax,
            });
          }}
          className="w-24 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs outline-none focus:border-primary/50"
          aria-label={`${label} mínimo`}
        />
        <span className="text-text-secondary text-xs">—</span>
        <input
          type="number"
          min={minBound}
          max={maxBound}
          placeholder={String(maxBound)}
          value={valueMax ?? ''}
          onChange={(e) => {
            const raw = e.target.value;
            onChange({
              min: valueMin,
              max: raw === '' ? null : Math.min(maxBound, Math.max(minBound, Number(raw))),
            });
          }}
          className="w-24 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs outline-none focus:border-primary/50"
          aria-label={`${label} máximo`}
        />
      </div>
    </fieldset>
  );
}
