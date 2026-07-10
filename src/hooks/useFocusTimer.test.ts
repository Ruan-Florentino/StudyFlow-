import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useFocusTimer } from './useFocusTimer';

describe('useFocusTimer', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-10T12:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
    window.localStorage.clear();
  });

  it('inicia, persiste, conclui uma vez e avanca para pausa', () => {
    const onComplete = vi.fn();
    const { result, unmount } = renderHook(() => useFocusTimer(onComplete));

    act(() => result.current.chooseQuickSession(10));
    act(() => result.current.toggle());
    expect(result.current.snapshot.isRunning).toBe(true);
    expect(result.current.snapshot.endAt).not.toBeNull();

    act(() => {
      vi.setSystemTime(new Date('2026-07-10T12:00:01.000Z'));
      vi.advanceTimersByTime(1000);
    });
    expect(result.current.snapshot.timeLeft).toBeLessThan(600);
    expect(result.current.snapshot.timeLeft).toBeGreaterThanOrEqual(598);

    act(() => result.current.finish());
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(result.current.snapshot.phase).toBe('shortBreak');
    expect(result.current.snapshot.isRunning).toBe(false);

    unmount();
    const restored = renderHook(() => useFocusTimer(onComplete));
    expect(restored.result.current.snapshot.phase).toBe('shortBreak');
    restored.unmount();
  });
});
