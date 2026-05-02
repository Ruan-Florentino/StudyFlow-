import { create } from 'zustand';
import { useUserStore, UserStore } from './useUserStore';
import { useFlashcardStore, FlashcardStore } from './useFlashcardStore';
import { useExamStore, ExamStore } from './useExamStore';
import { useSessionStore, SessionStore } from './useSessionStore';
import { useUIStore, UIStore } from './useUIStore';

export * from './types';
export { useUserStore, useFlashcardStore, useExamStore, useSessionStore, useUIStore };

export type AppStore = UserStore & FlashcardStore & ExamStore & SessionStore & UIStore;

/**
 * useStore (Unified Proxy Store)
 * Atua como um hub reativo que consolida todas as fatias para compatibilidade total.
 * v12: Pattern de Agregador de Estado
 */
export const useStore = create<AppStore>((set, get) => {
  // Estado inicial consolidado
  const initialState = {
    ...useUserStore.getState(),
    ...useFlashcardStore.getState(),
    ...useExamStore.getState(),
    ...useSessionStore.getState(),
    ...useUIStore.getState(),
  } as AppStore;

  // Sincronização reativa entre as stores
  const sync = () => {
    set({
      ...useUserStore.getState(),
      ...useFlashcardStore.getState(),
      ...useExamStore.getState(),
      ...useSessionStore.getState(),
      ...useUIStore.getState(),
    } as any);
  };

  // Subscrever a mudanças em todas as stores
  useUserStore.subscribe(sync);
  useFlashcardStore.subscribe(sync);
  useExamStore.subscribe(sync);
  useSessionStore.subscribe(sync);
  useUIStore.subscribe(sync);

  return initialState;
});

// Helper para acessar o estado diretamente (compatibilidade useStore.getState())
(useStore as any).getState = () => ({
  ...useUserStore.getState(),
  ...useFlashcardStore.getState(),
  ...useExamStore.getState(),
  ...useSessionStore.getState(),
  ...useUIStore.getState(),
});

export const usePlan = () => {
  const plan = useUIStore(s => s.plan);
  const flashcardsUsed = useFlashcardStore(s => s.dailyFlashcardsUsed);
  const aiTutorQueries = useUIStore(s => s.aiTutorQueriesToday);
  const aiTutorDate = useUIStore(s => s.lastAiTutorQueryDate);
  const essaysWeek = useUIStore(s => s.essaysThisWeek);

  const isPremium = plan === 'premium';
  
  const checkLimit = (feature: 'flashcards' | 'aiTutor' | 'essay' | 'exams') => {
    if (isPremium) return true;
    const today = new Date().toISOString().split('T')[0];
    
    switch(feature) {
      case 'flashcards': return flashcardsUsed < 10;
      case 'aiTutor': return aiTutorDate !== today || aiTutorQueries < 3;
      case 'essay': return essaysWeek < 1;
      case 'exams': return false;
      default: return true;
    }
  };

  return { plan, isPremium, checkLimit };
};
