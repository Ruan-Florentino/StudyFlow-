import type {
  FilterFieldDefinition,
  FilterSchema,
  InferFilterValues,
} from './types';

const SPLIT_MULTI = ',';

function defaultForField(def: FilterFieldDefinition): unknown {
  switch (def.type) {
    case 'chips':
      return def.multi === false ? '' : [...(def.default ?? [])];
    case 'select': {
      if (def.multiple === true) {
        const d = def.default;
        if (Array.isArray(d)) return [...d];
        if (typeof d === 'string' && d) return [d];
        return [];
      }
      const d = def.default;
      if (typeof d === 'string') return d;
      if (Array.isArray(d) && typeof d[0] === 'string') return d[0];
      return '';
    }
    case 'toggle':
      return def.default ?? false;
    case 'search':
      return def.default ?? '';
    case 'range':
      return {
        min: def.defaultMin ?? null,
        max: def.defaultMax ?? null,
      };
  }
}

export function emptyValuesFromSchema<S extends FilterSchema>(schema: S): InferFilterValues<S> {
  const out = {} as InferFilterValues<S>;
  for (const key of Object.keys(schema) as (keyof S)[]) {
    (out as Record<string, unknown>)[key as string] = defaultForField(schema[key]);
  }
  return out;
}

export function parseFiltersFromParams<S extends FilterSchema>(
  schema: S,
  params: URLSearchParams
): InferFilterValues<S> {
  const base = emptyValuesFromSchema(schema);
  for (const key of Object.keys(schema) as (keyof S)[]) {
    const def = schema[key];
    switch (def.type) {
      case 'chips': {
        const raw = params.get(def.paramKey);
        if (raw == null || raw === '') {
          (base as Record<string, unknown>)[key as string] = defaultForField(def);
          break;
        }
        if (def.multi === false) {
          const v = raw.trim();
          (base as Record<string, unknown>)[key as string] = def.options.includes(v) ? v : '';
        } else {
          const parts = raw
            .split(SPLIT_MULTI)
            .map((s) => s.trim())
            .filter(Boolean);
          const valid = parts.filter((p) => def.options.includes(p));
          (base as Record<string, unknown>)[key as string] = valid;
        }
        break;
      }
      case 'select': {
        const raw = params.get(def.paramKey);
        if (raw == null || raw === '') {
          (base as Record<string, unknown>)[key as string] = defaultForField(def);
          break;
        }
        const allowed = new Set(def.options.map((o) => o.value));
        if (def.multiple === true) {
          const parts = raw.split(SPLIT_MULTI).map((s) => s.trim());
          (base as Record<string, unknown>)[key as string] = parts.filter((p) => allowed.has(p));
        } else {
          const v = raw.trim();
          (base as Record<string, unknown>)[key as string] = allowed.has(v) ? v : defaultForField(def);
        }
        break;
      }
      case 'toggle': {
        const raw = params.get(def.paramKey);
        (base as Record<string, unknown>)[key as string] = raw === '1' || raw === 'true';
        break;
      }
      case 'search': {
        const raw = params.get(def.paramKey);
        (base as Record<string, unknown>)[key as string] = raw ?? def.default ?? '';
        break;
      }
      case 'range': {
        const a = params.get(def.paramKeyMin);
        const b = params.get(def.paramKeyMax);
        let min: number | null = null;
        let max: number | null = null;
        if (a != null && a !== '') {
          const n = Number(a);
          if (!Number.isNaN(n)) min = Math.min(def.max, Math.max(def.min, n));
        }
        if (b != null && b !== '') {
          const n = Number(b);
          if (!Number.isNaN(n)) max = Math.min(def.max, Math.max(def.min, n));
        }
        if (min != null && max != null && min > max) {
          const t = min;
          min = max;
          max = t;
        }
        (base as Record<string, unknown>)[key as string] = { min, max };
        break;
      }
    }
  }
  return base;
}

/** Lista todas as query keys pertencentes ao schema (para limpar URL). */
export function allParamKeysForSchema(schema: FilterSchema): string[] {
  const keys: string[] = [];
  for (const def of Object.values(schema)) {
    switch (def.type) {
      case 'range':
        keys.push(def.paramKeyMin, def.paramKeyMax);
        break;
      default:
        keys.push(def.paramKey);
    }
  }
  return keys;
}

export function writeFiltersToParams<S extends FilterSchema>(
  schema: S,
  values: InferFilterValues<S>,
  base: URLSearchParams
): URLSearchParams {
  const next = new URLSearchParams(base.toString());
  for (const key of Object.keys(schema) as (keyof S)[]) {
    const def = schema[key];
    const val = (values as Record<string, unknown>)[key as string];
    switch (def.type) {
      case 'chips': {
        const d = defaultForField(def);
        if (def.multi === false) {
          const s = val as string;
          const defS = d as string;
          if (!s || s === defS) next.delete(def.paramKey);
          else next.set(def.paramKey, s);
        } else {
          const arr = val as string[];
          const defArr = d as string[];
          const same =
            arr.length === defArr.length && arr.every((x, i) => x === defArr[i]);
          if (arr.length === 0 || same) next.delete(def.paramKey);
          else next.set(def.paramKey, arr.join(SPLIT_MULTI));
        }
        break;
      }
      case 'select': {
        const d = defaultForField(def);
        if (def.multiple === true) {
          const arr = val as string[];
          const defArr = d as string[];
          const same =
            arr.length === defArr.length && arr.every((x, i) => x === defArr[i]);
          if (arr.length === 0 || same) next.delete(def.paramKey);
          else next.set(def.paramKey, arr.join(SPLIT_MULTI));
        } else {
          const s = val as string;
          const defS = d as string;
          if (!s || s === defS) next.delete(def.paramKey);
          else next.set(def.paramKey, s);
        }
        break;
      }
      case 'toggle': {
        const b = val as boolean;
        const defB = (def.default ?? false) as boolean;
        if (b === defB) next.delete(def.paramKey);
        else if (b) next.set(def.paramKey, '1');
        else next.delete(def.paramKey);
        break;
      }
      case 'search': {
        const s = (val as string).trim();
        const defS = (def.default ?? '') as string;
        if (!s || s === defS) next.delete(def.paramKey);
        else next.set(def.paramKey, s);
        break;
      }
      case 'range': {
        const r = val as { min: number | null; max: number | null };
        const defMin = def.defaultMin ?? null;
        const defMax = def.defaultMax ?? null;
        if (r.min == null || r.min === defMin) next.delete(def.paramKeyMin);
        else next.set(def.paramKeyMin, String(r.min));
        if (r.max == null || r.max === defMax) next.delete(def.paramKeyMax);
        else next.set(def.paramKeyMax, String(r.max));
        break;
      }
    }
  }
  return next;
}

function filterValueEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    const sa = [...a].sort();
    const sb = [...b].sort();
    return sa.every((v, i) => v === sb[i]);
  }
  if (
    typeof a === 'object' &&
    a !== null &&
    typeof b === 'object' &&
    b !== null &&
    'min' in a &&
    'max' in a &&
    'min' in b &&
    'max' in b
  ) {
    const ra = a as { min: number | null; max: number | null };
    const rb = b as { min: number | null; max: number | null };
    return ra.min === rb.min && ra.max === rb.max;
  }
  return false;
}

export function countActiveFilters<S extends FilterSchema>(
  schema: S,
  values: InferFilterValues<S>
): number {
  const defaults = emptyValuesFromSchema(schema);
  let n = 0;
  for (const key of Object.keys(schema) as (keyof S)[]) {
    if (
      !filterValueEqual(
        (values as Record<string, unknown>)[key as string],
        (defaults as Record<string, unknown>)[key as string]
      )
    ) {
      n++;
    }
  }
  return n;
}

export function isFieldActive<S extends FilterSchema>(
  schema: S,
  values: InferFilterValues<S>,
  fieldKey: keyof S
): boolean {
  const defaults = emptyValuesFromSchema(schema);
  return !filterValueEqual(
    (values as Record<string, unknown>)[fieldKey as string],
    (defaults as Record<string, unknown>)[fieldKey as string]
  );
}
