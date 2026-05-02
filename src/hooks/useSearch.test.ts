import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSearch } from './useSearch';

describe('useSearch', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('inicia com resultados vazios e isSearching false', () => {
    const { result } = renderHook(() => useSearch(''));
    expect(result.current.results).toEqual([]);
    expect(result.current.isSearching).toBe(false);
  });

  it('ativa isSearching e retorna resultados apos o delay', async () => {
    const { result } = renderHook(() => useSearch('Natureza'));

    // Deve estar buscando imediatamente
    expect(result.current.isSearching).toBe(true);

    // Avanca o tempo
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current.isSearching).toBe(false);
    expect(result.current.results.length).toBeGreaterThan(0);
    
    // Verifica se Natureza aparece no titulo do primeiro resultado (Sujeito)
    expect(result.current.results[0].title).toMatch(/Natureza/i);
  });

  it('limpa resultados quando a query fica vazia', () => {
    const { result, rerender } = renderHook(({ q }) => useSearch(q), {
      initialProps: { q: 'Matemática' }
    });

    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current.results.length).toBeGreaterThan(0);

    rerender({ q: '' });
    expect(result.current.results).toEqual([]);
    expect(result.current.isSearching).toBe(false);
  });
});
