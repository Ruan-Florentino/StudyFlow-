import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Question } from '../data/types';
import { invalidateQuestionsBundleCache } from '../data/questionsLoader';

export interface ImportedQuestionsStore {
  importedQuestions: Question[];
  addImportedQuestions: (questions: Question[]) => void;
  clearImportedQuestions: () => void;
}

export const useImportedQuestionsStore = create<ImportedQuestionsStore>()(
  persist(
    (set) => ({
      importedQuestions: [],
      addImportedQuestions: (questions) => {
        invalidateQuestionsBundleCache();
        set((s) => {
          const byId = new Map(s.importedQuestions.map((q) => [q.id, q]));
          for (const q of questions) {
            byId.set(q.id, q);
          }
          return { importedQuestions: Array.from(byId.values()) };
        });
      },
      clearImportedQuestions: () => {
        invalidateQuestionsBundleCache();
        set({ importedQuestions: [] });
      },
    }),
    { name: 'studyflow-imported-questions' }
  )
);
