import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { FilterSchema, InferFilterValues } from '../lib/filters/types';
import {
  allParamKeysForSchema,
  countActiveFilters,
  emptyValuesFromSchema,
  isFieldActive,
  parseFiltersFromParams,
  writeFiltersToParams,
} from '../lib/filters/urlCodec';

export interface UseFiltersOptions {
  /** Debounce só para campos `type: 'search'` (ms). Padrão 300. */
  debounceMs?: number;
  /** Padrão `true` — evita poluir histórico do browser. */
  replace?: boolean;
  /**
   * Opcional: persiste valores em localStorage.
   * Na primeira montagem, se nenhuma query do schema existir na URL, tenta hidratar a partir do JSON salvo.
   */
  persistKey?: string;
}

const log = (...args: unknown[]) => {
  if (import.meta.env.DEV) {
    console.log('[FILTERS]', ...args);
  }
};

export function useFilters<S extends FilterSchema>(schema: S, options: UseFiltersOptions = {}) {
  const { debounceMs = 300, replace = true, persistKey } = options;
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTimersRef = useRef<Partial<Record<string, ReturnType<typeof setTimeout>>>>({});
  const pendingSearchKeysRef = useRef<Set<string>>(new Set());
  const hydratedPersistRef = useRef(false);

  const paramsKey = searchParams.toString();

  const urlFilters = useMemo(
    () => parseFiltersFromParams(schema, searchParams),
    [schema, searchParams]
  );

  const [searchDrafts, setSearchDrafts] = useState<Partial<Record<string, string>>>(() => {
    const d: Partial<Record<string, string>> = {};
    const initial = parseFiltersFromParams(schema, searchParams);
    for (const key of Object.keys(schema) as (keyof S)[]) {
      if (schema[key].type === 'search') {
        d[key as string] = (initial as Record<string, unknown>)[key as string] as string;
      }
    }
    return d;
  });

  /** Sincroniza drafts de busca com a URL (back/forward, link compartilhado), sem pisar no que o usuário está digitando (debounce pendente). */
  useEffect(() => {
    const parsed = parseFiltersFromParams(schema, searchParams);
    setSearchDrafts((prev) => {
      const next = { ...prev };
      for (const key of Object.keys(schema) as (keyof S)[]) {
        if (schema[key].type !== 'search') continue;
        const sk = String(key);
        if (pendingSearchKeysRef.current.has(sk)) continue;
        next[sk] = (parsed as Record<string, unknown>)[sk] as string;
      }
      return next;
    });
  }, [paramsKey, schema, searchParams]);

  useEffect(() => {
    if (!persistKey || hydratedPersistRef.current) return;
    const keys = allParamKeysForSchema(schema);
    const hasUrl = keys.some((k) => searchParams.has(k));
    if (hasUrl) {
      hydratedPersistRef.current = true;
      return;
    }
    try {
      const raw = localStorage.getItem(persistKey);
      if (!raw) {
        hydratedPersistRef.current = true;
        return;
      }
      const parsed = JSON.parse(raw) as InferFilterValues<S>;
      setSearchParams(writeFiltersToParams(schema, parsed, new URLSearchParams(searchParams)), {
        replace: true,
      });
      log('hydrate from localStorage', persistKey);
    } catch (e) {
      log('persist hydrate failed', e);
    } finally {
      hydratedPersistRef.current = true;
    }
  }, [persistKey, schema, searchParams, setSearchParams]);

  const filters = useMemo(() => {
    const f = { ...urlFilters } as InferFilterValues<S>;
    for (const key of Object.keys(schema) as (keyof S)[]) {
      if (schema[key].type === 'search') {
        const draft = searchDrafts[key as string];
        if (draft !== undefined) {
          (f as Record<string, unknown>)[key as string] = draft;
        }
      }
    }
    return f;
  }, [urlFilters, searchDrafts, schema]);

  useEffect(() => {
    if (!persistKey || !hydratedPersistRef.current) return;
    try {
      localStorage.setItem(persistKey, JSON.stringify(urlFilters));
    } catch {
      /* quota / private mode */
    }
  }, [persistKey, urlFilters]);

  useEffect(
    () => () => {
      for (const t of Object.values(searchTimersRef.current)) {
        if (t) clearTimeout(t);
      }
    },
    []
  );

  const setFilter = useCallback(
    <K extends keyof S>(key: K, value: InferFilterValues<S>[K]) => {
      const def = schema[key];
      if (def.type === 'search') {
        const v = String(value ?? '');
        setSearchDrafts((prev) => ({ ...prev, [key as string]: v }));
        const k = String(key);
        pendingSearchKeysRef.current.add(k);
        const prevT = searchTimersRef.current[k];
        if (prevT) clearTimeout(prevT);
        searchTimersRef.current[k] = setTimeout(() => {
          setSearchParams(
            (prevParams) => {
              const current = parseFiltersFromParams(schema, prevParams);
              const merged = { ...current, [key]: v } as InferFilterValues<S>;
              return writeFiltersToParams(schema, merged, new URLSearchParams(prevParams));
            },
            { replace }
          );
          searchTimersRef.current[k] = undefined;
          pendingSearchKeysRef.current.delete(k);
          log('search committed', key, v);
        }, debounceMs);
        return;
      }

      setSearchParams(
        (prevParams) => {
          const current = parseFiltersFromParams(schema, prevParams);
          const merged = { ...current, [key]: value } as InferFilterValues<S>;
          return writeFiltersToParams(schema, merged, new URLSearchParams(prevParams));
        },
        { replace }
      );
      log('setFilter', key, value);
    },
    [schema, setSearchParams, replace, debounceMs]
  );

  const toggleChip = useCallback(
    (key: keyof S, option: string) => {
      const def = schema[key];
      if (def.type !== 'chips') {
        log('toggleChip ignored: not chips', key);
        return;
      }
      setSearchParams(
        (prevParams) => {
          const current = parseFiltersFromParams(schema, prevParams);
          const cur = (current as Record<string, unknown>)[key as string];
          if (def.multi === false) {
            const nextVal = cur === option ? '' : option;
            const merged = { ...current, [key]: nextVal } as InferFilterValues<S>;
            return writeFiltersToParams(schema, merged, new URLSearchParams(prevParams));
          }
          const arr = [...(cur as string[])];
          const i = arr.indexOf(option);
          if (i >= 0) arr.splice(i, 1);
          else arr.push(option);
          const merged = { ...current, [key]: arr } as InferFilterValues<S>;
          return writeFiltersToParams(schema, merged, new URLSearchParams(prevParams));
        },
        { replace }
      );
      log('toggleChip', key, option);
    },
    [schema, setSearchParams, replace]
  );

  const clearFilters = useCallback(() => {
    pendingSearchKeysRef.current.clear();
    for (const k of Object.keys(searchTimersRef.current)) {
      const t = searchTimersRef.current[k];
      if (t) clearTimeout(t);
      searchTimersRef.current[k] = undefined;
    }
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev.toString());
        for (const p of allParamKeysForSchema(schema)) {
          next.delete(p);
        }
        return next;
      },
      { replace }
    );
    const clearedDrafts: Partial<Record<string, string>> = {};
    for (const key of Object.keys(schema) as (keyof S)[]) {
      if (schema[key].type === 'search') {
        clearedDrafts[key as string] = (schema[key].default ?? '') as string;
      }
    }
    setSearchDrafts(clearedDrafts);
    log('clearFilters');
  }, [schema, setSearchParams, replace]);

  const clearFilter = useCallback(
    (key: keyof S) => {
      const def = schema[key];
      if (def.type === 'search') {
        const sk = String(key);
        pendingSearchKeysRef.current.delete(sk);
        const t = searchTimersRef.current[sk];
        if (t) clearTimeout(t);
        searchTimersRef.current[sk] = undefined;
        const empty = (def.default ?? '') as string;
        setSearchDrafts((prev) => ({ ...prev, [key as string]: empty }));
      }
      setSearchParams(
        (prevParams) => {
          const defaults = emptyValuesFromSchema(schema);
          const current = parseFiltersFromParams(schema, prevParams);
          const defaultVal = (defaults as Record<string, unknown>)[key as string];
          const merged = { ...current, [key]: defaultVal } as InferFilterValues<S>;
          return writeFiltersToParams(schema, merged, new URLSearchParams(prevParams));
        },
        { replace }
      );
      log('clearFilter', key);
    },
    [schema, setSearchParams, replace]
  );

  const activeCount = useMemo(() => countActiveFilters(schema, urlFilters), [schema, urlFilters]);

  const isActive = useCallback(
    (key: keyof S) => isFieldActive(schema, urlFilters, key),
    [schema, urlFilters]
  );

  const asQueryParams = useCallback((): Record<string, string> => {
    const p = writeFiltersToParams(schema, urlFilters, new URLSearchParams());
    const o: Record<string, string> = {};
    p.forEach((v, k) => {
      o[k] = v;
    });
    return o;
  }, [schema, urlFilters]);

  const asReadable = useCallback((): string[] => {
    const labels: string[] = [];
    for (const key of Object.keys(schema) as (keyof S)[]) {
      if (!isFieldActive(schema, urlFilters, key)) continue;
      const def = schema[key];
      const v = (urlFilters as Record<string, unknown>)[key as string];
      switch (def.type) {
        case 'chips':
          if (Array.isArray(v) && v.length > 0) labels.push(`${def.label}: ${v.join(', ')}`);
          else if (typeof v === 'string' && v) labels.push(`${def.label}: ${v}`);
          break;
        case 'select':
          if (def.multiple === true && Array.isArray(v) && v.length > 0) {
            const map = new Map(def.options.map((o) => [o.value, o.label]));
            labels.push(
              `${def.label}: ${v.map((x) => map.get(x) ?? x).join(', ')}`
            );
          } else if (typeof v === 'string' && v) {
            const o = def.options.find((x) => x.value === v);
            labels.push(`${def.label}: ${o?.label ?? v}`);
          }
          break;
        case 'toggle':
          if (v === true) labels.push(def.label);
          break;
        case 'search':
          if (typeof v === 'string' && v.trim()) labels.push(`${def.label}: "${v.trim()}"`);
          break;
        case 'range': {
          const r = v as { min: number | null; max: number | null };
          if (r.min != null || r.max != null) {
            const a = r.min != null ? String(r.min) : '…';
            const b = r.max != null ? String(r.max) : '…';
            labels.push(`${def.label}: ${a}–${b}`);
          }
          break;
        }
      }
    }
    return labels;
  }, [schema, urlFilters]);

  return {
    filters,
    urlFilters,
    setFilter,
    toggleChip,
    clearFilters,
    clearFilter,
    activeCount,
    isActive,
    asQueryParams,
    asReadable,
  };
}
