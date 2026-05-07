import { useMemo } from 'react';
import { useExamStore } from '../store/useExamStore';

export function useUserStats() {
  const history = useExamStore((s) => s.history);

  return useMemo(() => {
    const totalAttempts = history.length;
    const correctCount = history.filter((h) => h.isCorrect).length;
    const accuracyPercentage =
      totalAttempts === 0
        ? 0
        : Math.round((correctCount / totalAttempts) * 100);

    return {
      totalAttempts,
      correctCount,
      accuracyPercentage,
    };
  }, [history]);
}
