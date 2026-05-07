import { create, type StoreApi } from 'zustand';
import { useUserStore, UserStore } from './useUserStore';
import { useFlashcardStore, FlashcardStore } from './useFlashcardStore';
import { useExamStore, ExamStore } from './useExamStore';
import { useSessionStore, SessionStore } from './useSessionStore';
import { useUIStore, UIStore } from './useUIStore';

export * from './types';
export { useImportedQuestionsStore } from './useImportedQuestionsStore';
export { useAITrailsStore } from './useAITrailsStore';
export { useUserStore, useFlashcardStore, useExamStore, useSessionStore, useUIStore };

export type AppStore = UserStore & FlashcardStore & ExamStore & SessionStore & UIStore;

/** Snapshot atual de todas as fatias — única função de merge para hub + getState patreado. */
export function getMergedAppStoreState(): AppStore {
  return {
    ...useUserStore.getState(),
    ...useFlashcardStore.getState(),
    ...useExamStore.getState(),
    ...useSessionStore.getState(),
    ...useUIStore.getState(),
  } as AppStore;
}

/**
 * useStore (Unified Proxy Store)
 * Atua como um hub reativo que consolida todas as fatias para compatibilidade total.
 * v12: Pattern de Agregador de Estado
 */
/** Hub só espelha fatias; `set` interno não é usado — sync via `subscribe`. */
export const useStore = create<AppStore>(_set => getMergedAppStoreState());

const syncHubFromSlices: StoreApi<AppStore>['setState'] = useStore.setState;

function sync(): void {
  syncHubFromSlices(getMergedAppStoreState(), true);
}

useUserStore.subscribe(sync);
useFlashcardStore.subscribe(sync);
useExamStore.subscribe(sync);
useSessionStore.subscribe(sync);
useUIStore.subscribe(sync);

/** `getState` lê sempre o merge das fatias (comportamento legado do hub). */
const storeApi = useStore as typeof useStore & StoreApi<AppStore>;
storeApi.getState = (): AppStore => getMergedAppStoreState();

export { useUserAccess, usePlan } from '../hooks/useUserAccess';
