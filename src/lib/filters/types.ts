/**
 * Schema declarativo para useFilters (FASE 2).
 * Opções de chip não devem conter vírgula (serialização multi).
 */

export type FilterChipsField = {
  type: 'chips';
  /** Query param (ex: vest) */
  paramKey: string;
  label: string;
  options: readonly string[];
  /** default: true — vários valores separados por vírgula na URL */
  multi?: boolean;
  default?: string | readonly string[];
};

export type FilterSelectField = {
  type: 'select';
  paramKey: string;
  label: string;
  options: readonly { value: string; label: string }[];
  multiple?: boolean;
  default?: string | readonly string[];
};

export type FilterToggleField = {
  type: 'toggle';
  paramKey: string;
  label: string;
  default?: boolean;
};

export type FilterSearchField = {
  type: 'search';
  paramKey: string;
  label: string;
  placeholder?: string;
  default?: string;
};

export type FilterRangeField = {
  type: 'range';
  paramKeyMin: string;
  paramKeyMax: string;
  label: string;
  min: number;
  max: number;
  defaultMin?: number | null;
  defaultMax?: number | null;
};

export type FilterFieldDefinition =
  | FilterChipsField
  | FilterSelectField
  | FilterToggleField
  | FilterSearchField
  | FilterRangeField;

export type FilterSchema = Record<string, FilterFieldDefinition>;

type InferChipsValue<F extends FilterChipsField> = F['multi'] extends false ? string : string[];

type InferSelectValue<F extends FilterSelectField> = F['multiple'] extends true ? string[] : string;

export type InferFilterValues<S extends FilterSchema> = {
  [K in keyof S]: S[K] extends FilterChipsField
    ? InferChipsValue<S[K]>
    : S[K] extends FilterSelectField
      ? InferSelectValue<S[K]>
      : S[K] extends FilterToggleField
        ? boolean
        : S[K] extends FilterSearchField
          ? string
          : S[K] extends FilterRangeField
            ? { min: number | null; max: number | null }
            : never;
};
