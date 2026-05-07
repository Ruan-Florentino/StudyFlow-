import { useCallback, useEffect, useRef, useState } from 'react';

export interface UseExamTimerOptions {
  enabled: boolean;
  initialSeconds: number;
  pauseOnBlur: boolean;
  onExpire?: () => void;
}

/**
 * Cronômetro de simulado com pausa opcional ao perder foco da aba.
 */
export function useExamTimer({
  enabled,
  initialSeconds,
  pauseOnBlur,
  onExpire,
}: UseExamTimerOptions) {
  const [remaining, setRemaining] = useState(initialSeconds);
  const [paused, setPaused] = useState(false);
  const expiredRef = useRef(false);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  useEffect(() => {
    if (!enabled) return;
    setRemaining(initialSeconds);
    expiredRef.current = false;
  }, [enabled, initialSeconds]);

  useEffect(() => {
    if (!enabled || paused) return;
    const id = window.setInterval(() => {
      setRemaining((r) => {
        if (r <= 0) return 0;
        if (r <= 1) {
          if (!expiredRef.current) {
            expiredRef.current = true;
            onExpireRef.current?.();
          }
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [enabled, paused]);

  useEffect(() => {
    if (!enabled || !pauseOnBlur) return;
    const onVis = () => {
      setPaused(document.hidden);
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [enabled, pauseOnBlur]);

  const format = useCallback((sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }, []);

  return { remaining, setRemaining, paused, setPaused, format };
}
