import { useCallback, useEffect, useRef, useState } from 'react';

export type FocusPhase = 'focus' | 'shortBreak' | 'longBreak';
export type FocusSound = 'silence' | 'rain' | 'forest' | 'whiteNoise' | 'cafe' | 'lofi';

export interface FocusTimerSnapshot {
  version: 2;
  phase: FocusPhase;
  durationSeconds: number;
  timeLeft: number;
  isRunning: boolean;
  endAt: number | null;
  sessionNumber: number;
  focusMinutes: number;
  breakMinutes: number;
  longBreakMinutes: number;
  selectedSound: FocusSound;
  soundEnabled: boolean;
  volume: number;
  deepFocus: boolean;
}

export interface CompletedFocusSession {
  startedAt: Date;
  endedAt: Date;
  elapsedSeconds: number;
  manual: boolean;
}

const STORAGE_KEY = 'studyflow_focus_timer_v2';

const DEFAULT_SNAPSHOT: FocusTimerSnapshot = {
  version: 2,
  phase: 'focus',
  durationSeconds: 25 * 60,
  timeLeft: 25 * 60,
  isRunning: false,
  endAt: null,
  sessionNumber: 1,
  focusMinutes: 25,
  breakMinutes: 5,
  longBreakMinutes: 15,
  selectedSound: 'silence',
  soundEnabled: true,
  volume: 36,
  deepFocus: false,
};

function phaseDuration(snapshot: FocusTimerSnapshot, phase: FocusPhase) {
  if (phase === 'focus') return snapshot.focusMinutes * 60;
  if (phase === 'longBreak') return snapshot.longBreakMinutes * 60;
  return snapshot.breakMinutes * 60;
}

function safeNumber(value: unknown, fallback: number, min: number, max: number) {
  return typeof value === 'number' && Number.isFinite(value)
    ? Math.min(max, Math.max(min, value))
    : fallback;
}

function readSnapshot(): FocusTimerSnapshot {
  if (typeof window === 'undefined') return DEFAULT_SNAPSHOT;
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{}') as Partial<FocusTimerSnapshot>;
    const phase: FocusPhase = parsed.phase === 'shortBreak' || parsed.phase === 'longBreak' ? parsed.phase : 'focus';
    const focusMinutes = safeNumber(parsed.focusMinutes, 25, 1, 180);
    const breakMinutes = safeNumber(parsed.breakMinutes, 5, 1, 60);
    const longBreakMinutes = safeNumber(parsed.longBreakMinutes, 15, 1, 90);
    const durationSeconds = safeNumber(
      parsed.durationSeconds,
      phase === 'focus' ? focusMinutes * 60 : phase === 'longBreak' ? longBreakMinutes * 60 : breakMinutes * 60,
      1,
      180 * 60
    );
    const endAt = typeof parsed.endAt === 'number' && Number.isFinite(parsed.endAt) ? parsed.endAt : null;
    const wasRunning = parsed.isRunning === true && endAt !== null;
    const computedRemaining = wasRunning ? Math.max(0, Math.ceil((endAt - Date.now()) / 1000)) : parsed.timeLeft;
    const selectedSound: FocusSound = ['rain', 'forest', 'whiteNoise', 'cafe', 'lofi'].includes(String(parsed.selectedSound))
      ? parsed.selectedSound as FocusSound
      : 'silence';

    return {
      version: 2,
      phase,
      durationSeconds,
      timeLeft: safeNumber(computedRemaining, durationSeconds, 0, durationSeconds),
      isRunning: wasRunning && Number(computedRemaining) > 0,
      endAt: wasRunning && Number(computedRemaining) > 0 ? endAt : null,
      sessionNumber: safeNumber(parsed.sessionNumber, 1, 1, 4),
      focusMinutes,
      breakMinutes,
      longBreakMinutes,
      selectedSound,
      soundEnabled: parsed.soundEnabled !== false,
      volume: safeNumber(parsed.volume, 36, 0, 100),
      deepFocus: parsed.deepFocus === true,
    };
  } catch {
    return DEFAULT_SNAPSHOT;
  }
}

export function useFocusTimer(onFocusComplete: (session: CompletedFocusSession) => void) {
  const [snapshot, setSnapshot] = useState<FocusTimerSnapshot>(readSnapshot);
  const completionLockRef = useRef(false);
  const onFocusCompleteRef = useRef(onFocusComplete);
  const snapshotRef = useRef(snapshot);

  useEffect(() => {
    onFocusCompleteRef.current = onFocusComplete;
  }, [onFocusComplete]);

  useEffect(() => {
    snapshotRef.current = snapshot;
  }, [snapshot]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
    } catch {
      // Safari private mode can reject storage writes.
    }
  }, [snapshot]);

  const advancePhase = useCallback((manual: boolean) => {
    if (completionLockRef.current) return;
    completionLockRef.current = true;
    const current = snapshotRef.current;

    if (current.phase === 'focus') {
      const elapsedSeconds = Math.max(1, current.durationSeconds - current.timeLeft);
      const endedAt = new Date();
      onFocusCompleteRef.current({
        startedAt: new Date(endedAt.getTime() - elapsedSeconds * 1000),
        endedAt,
        elapsedSeconds,
        manual,
      });
      const nextPhase: FocusPhase = current.sessionNumber === 4 ? 'longBreak' : 'shortBreak';
      const nextDuration = phaseDuration(current, nextPhase);
      const next = {
        ...current,
        phase: nextPhase,
        durationSeconds: nextDuration,
        timeLeft: nextDuration,
        isRunning: false,
        endAt: null,
        deepFocus: false,
      };
      snapshotRef.current = next;
      setSnapshot(next);
    } else {
      const nextSession = current.sessionNumber === 4 ? 1 : current.sessionNumber + 1;
      const nextDuration = current.focusMinutes * 60;
      const next = {
        ...current,
        phase: 'focus' as const,
        sessionNumber: nextSession,
        durationSeconds: nextDuration,
        timeLeft: nextDuration,
        isRunning: false,
        endAt: null,
      };
      snapshotRef.current = next;
      setSnapshot(next);
    }

    queueMicrotask(() => { completionLockRef.current = false; });
  }, []);

  useEffect(() => {
    if (!snapshot.isRunning || snapshot.endAt === null) return undefined;
    const tick = () => {
      setSnapshot((current) => {
        if (!current.isRunning || current.endAt === null) return current;
        const remaining = Math.max(0, Math.ceil((current.endAt - Date.now()) / 1000));
        return remaining === current.timeLeft ? current : { ...current, timeLeft: remaining };
      });
    };
    tick();
    const intervalId = window.setInterval(tick, 250);
    return () => window.clearInterval(intervalId);
  }, [snapshot.endAt, snapshot.isRunning]);

  useEffect(() => {
    if (snapshot.timeLeft === 0 && !completionLockRef.current) advancePhase(false);
  }, [advancePhase, snapshot.timeLeft]);

  useEffect(() => {
    if (!snapshot.deepFocus || !snapshot.isRunning) return undefined;
    const guard = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', guard);
    return () => window.removeEventListener('beforeunload', guard);
  }, [snapshot.deepFocus, snapshot.isRunning]);

  const toggle = useCallback(() => {
    setSnapshot((current) => {
      if (current.isRunning) {
        const remaining = current.endAt === null ? current.timeLeft : Math.max(0, Math.ceil((current.endAt - Date.now()) / 1000));
        return { ...current, isRunning: false, endAt: null, timeLeft: remaining };
      }
      const timeLeft = current.timeLeft > 0 ? current.timeLeft : current.durationSeconds;
      return { ...current, timeLeft, isRunning: true, endAt: Date.now() + timeLeft * 1000 };
    });
  }, []);

  const reset = useCallback(() => {
    setSnapshot((current) => ({
      ...current,
      timeLeft: current.durationSeconds,
      isRunning: false,
      endAt: null,
      deepFocus: false,
    }));
  }, []);

  const finish = useCallback(() => advancePhase(true), [advancePhase]);

  const chooseQuickSession = useCallback((minutes: number) => {
    const safeMinutes = safeNumber(minutes, 25, 1, 180);
    setSnapshot((current) => ({
      ...current,
      phase: 'focus',
      focusMinutes: safeMinutes,
      durationSeconds: safeMinutes * 60,
      timeLeft: safeMinutes * 60,
      isRunning: false,
      endAt: null,
    }));
  }, []);

  const updateDurations = useCallback((focusMinutes: number, breakMinutes: number, longBreakMinutes: number) => {
    setSnapshot((current) => {
      const next = {
        ...current,
        focusMinutes: safeNumber(focusMinutes, current.focusMinutes, 1, 180),
        breakMinutes: safeNumber(breakMinutes, current.breakMinutes, 1, 60),
        longBreakMinutes: safeNumber(longBreakMinutes, current.longBreakMinutes, 1, 90),
        isRunning: false,
        endAt: null,
      };
      const durationSeconds = phaseDuration(next, next.phase);
      return { ...next, durationSeconds, timeLeft: durationSeconds };
    });
  }, []);

  const updatePreferences = useCallback((preferences: Partial<Pick<FocusTimerSnapshot, 'selectedSound' | 'soundEnabled' | 'volume' | 'deepFocus'>>) => {
    setSnapshot((current) => ({ ...current, ...preferences }));
  }, []);

  return { snapshot, toggle, reset, finish, chooseQuickSession, updateDurations, updatePreferences };
}
