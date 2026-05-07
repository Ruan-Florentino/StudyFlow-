import { loadAllQuestions } from '../data/questionsLoader';
import { useImportedQuestionsStore } from '../store/useImportedQuestionsStore';
import type { Question } from '../data/types';

/** Última ocorrência vence (importadas sobrescrevem bundle por id). */
export function mergeQuestionLists(bundle: Question[], imported: Question[]): Question[] {
  const byId = new Map<string, Question>();
  for (const q of bundle) {
    if (q?.id) byId.set(q.id, q);
  }
  for (const q of imported) {
    if (q?.id) byId.set(q.id, q);
  }
  return Array.from(byId.values());
}

export async function loadAllQuestionsWithImported(): Promise<Question[]> {
  const base = await loadAllQuestions();
  const imported = useImportedQuestionsStore.getState().importedQuestions;
  return mergeQuestionLists(base, imported);
}

export async function loadQuestionMapWithImported(): Promise<Map<string, Question>> {
  const all = await loadAllQuestionsWithImported();
  const map = new Map<string, Question>();
  for (const q of all) {
    map.set(q.id, q);
  }
  return map;
}
