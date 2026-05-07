import { useEffect, useState } from 'react';
import { loadAllQuestionsWithImported, loadQuestionMapWithImported } from '../lib/mergeImportedQuestions';
import { useImportedQuestionsStore } from '../store/useImportedQuestionsStore';
import type { Question } from '../data/types';

export function useAllQuestions() {
  const importedQuestions = useImportedQuestionsStore((s) => s.importedQuestions);
  const [data, setData] = useState<Question[] | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    loadAllQuestionsWithImported()
      .then((q) => {
        if (mounted) setData(q);
      })
      .catch((e) => {
        if (mounted) setError(e instanceof Error ? e : new Error(String(e)));
      });
    return () => {
      mounted = false;
    };
  }, [importedQuestions]);

  return { questions: data, loading: data === null && !error, error };
}

export function useQuestionMap() {
  const importedQuestions = useImportedQuestionsStore((s) => s.importedQuestions);
  const [data, setData] = useState<Map<string, Question> | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    loadQuestionMapWithImported()
      .then((m) => {
        if (mounted) setData(m);
      })
      .catch((e) => {
        if (mounted) setError(e instanceof Error ? e : new Error(String(e)));
      });
    return () => {
      mounted = false;
    };
  }, [importedQuestions]);

  return { questionMap: data, loading: data === null && !error, error };
}
