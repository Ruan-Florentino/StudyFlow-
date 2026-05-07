import type { Question } from './types';

let _allQuestionsPromise: Promise<Question[]> | null = null;
let _questionMapPromise: Promise<Map<string, Question>> | null = null;

export function loadAllQuestions(): Promise<Question[]> {
  if (_allQuestionsPromise) return _allQuestionsPromise;
  _allQuestionsPromise = Promise.all([
    import('./questions_base'),
    import('./questions_extra'),
    import('./questions_12k'),
  ]).then(([base, extra, more]) => {
    const all = [
      ...base.BASE_QUESTIONS,
      ...extra.EXTRA_QUESTIONS,
      ...more.MORE_QUESTIONS_12K,
    ];
    return all.filter(q => q && q.id);
  });
  return _allQuestionsPromise;
}

export function loadQuestionMap(): Promise<Map<string, Question>> {
  if (_questionMapPromise) return _questionMapPromise;
  _questionMapPromise = loadAllQuestions().then((questions) => {
    const map = new Map<string, Question>();
    for (const q of questions) map.set(q.id, q);
    return map;
  });
  return _questionMapPromise;
}

/** Limpa cache após hot-reload ou quando o bundle de questões mudar em runtime. */
export function invalidateQuestionsBundleCache(): void {
  _allQuestionsPromise = null;
  _questionMapPromise = null;
}
