import { useEffect, useState } from 'react';
import { loadAllQuestions, loadQuestionMap } from '../data/questionsLoader';
import type { Question } from '../data/types';

export function useAllQuestions() {
  const [data, setData] = useState<Question[] | null>(null);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    let mounted = true;
    loadAllQuestions()
      .then((q) => { if (mounted) setData(q); })
      .catch((e) => { if (mounted) setError(e); });
    return () => { mounted = false; };
  }, []);
  
  return { questions: data, loading: data === null && !error, error };
}

export function useQuestionMap() {
  const [data, setData] = useState<Map<string, Question> | null>(null);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    let mounted = true;
    loadQuestionMap()
      .then((m) => { if (mounted) setData(m); })
      .catch((e) => { if (mounted) setError(e); });
    return () => { mounted = false; };
  }, []);
  
  return { questionMap: data, loading: data === null && !error, error };
}
