import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserRole } from '../types/userAccess';
import { useUIStore } from './useUIStore';

export interface DevAccessStore {
  /** Só aplicado quando painel DEV está permitido (dev build ou e-mail owner). */
  devRoleOverride: UserRole | null;
  simulateFree: boolean;
  setDevRoleOverride: (role: UserRole | null) => void;
  setSimulateFree: (v: boolean) => void;
  applyDevRoleToLocalPlan: (role: UserRole | null) => void;
  resetOnboardingLocal: () => void;
  clearStudyflowLocalCaches: () => void;
}

export const useDevAccessStore = create<DevAccessStore>()(
  persist(
    (set, get) => ({
      devRoleOverride: null,
      simulateFree: false,

      setDevRoleOverride: (role) => set({ devRoleOverride: role }),

      setSimulateFree: (v) => set({ simulateFree: v }),

      applyDevRoleToLocalPlan: (role) => {
        if (role === 'supremo' || role === 'admin' || role === 'premium') {
          useUIStore.getState().setPlan('premium');
        } else {
          useUIStore.getState().setPlan('free');
        }
      },

      resetOnboardingLocal: () => {
        useUIStore.setState({
          hasCompletedOnboarding: false,
          onboardingData: null,
        });
      },

      clearStudyflowLocalCaches: () => {
        try {
          const keys = Object.keys(localStorage).filter(
            (k) =>
              k === 'studyflow-ui' ||
              k === 'studyflow-dev-access' ||
              k.startsWith('studyflow-') ||
              k === 'athena_chat_history'
          );
          for (const k of keys) localStorage.removeItem(k);
        } catch (e) {
          console.error('[FASE-1] clearStudyflowLocalCaches', e);
        }
        window.location.reload();
      },
    }),
    { name: 'studyflow-dev-access' }
  )
);
