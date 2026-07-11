import { useRef, useCallback } from 'react';
import {
  recordStudySession,
  type StudyActivityType,
} from '../lib/persistence';

/**
 * Registra início/fim de uma sessão de estudo e persiste (local + backend).
 */
export function useStudyTimer(userId: string | null) {
  const startRef = useRef<Date | null>(null);

  const startSession = useCallback(() => {
    startRef.current = new Date();
    console.log('[PERSIST] useStudyTimer start');
  }, []);

  const endSession = useCallback(
    async (
      activityType: StudyActivityType,
      opts?: { subject?: string; topic?: string }
    ) => {
      if (!startRef.current) {
        console.warn('[PERSIST] useStudyTimer end without start');
        return;
      }
      const endedAt = new Date();
      const startedAt = startRef.current;
      startRef.current = null;
      await recordStudySession({
        userId,
        startedAt,
        endedAt,
        activityType,
        subject: opts?.subject,
        topic: opts?.topic,
      });
    },
    [userId]
  );

  const cancelSession = useCallback(() => {
    startRef.current = null;
  }, []);

  return { startSession, endSession, cancelSession };
}
