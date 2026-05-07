import { useMemo } from 'react';
import { useExamStore } from '../store/useExamStore';
import {
  computeQuestionHistorySummary,
  type QuestionHistorySummary,
} from '../lib/questionHistory';

export function useQuestionHistory(questionId: string): QuestionHistorySummary {
  const history = useExamStore((s) => s.history);
  const viewedAtByQuestionId = useExamStore((s) => s.viewedAtByQuestionId);

  return useMemo(
    () =>
      computeQuestionHistorySummary(
        questionId,
        history,
        viewedAtByQuestionId
      ),
    [questionId, history, viewedAtByQuestionId]
  );
}
