import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { safeJsonStorage } from '../lib/safeJsonStorage';
import type { RecommendedTrail } from '../data/explore';

const MAX_TRAILS = 12;

export interface AITrailsStore {
  aiTrails: RecommendedTrail[];
  addAiTrail: (trail: RecommendedTrail) => void;
  removeAiTrail: (id: string) => void;
  clearAiTrails: () => void;
}

export const useAITrailsStore = create<AITrailsStore>()(
  persist(
    (set) => ({
      aiTrails: [],
      addAiTrail: (trail) =>
        set((s) => ({
          aiTrails: [trail, ...s.aiTrails.filter((t) => t.id !== trail.id)].slice(0, MAX_TRAILS),
        })),
      removeAiTrail: (id) =>
        set((s) => ({
          aiTrails: s.aiTrails.filter((t) => t.id !== id),
        })),
      clearAiTrails: () => set({ aiTrails: [] }),
    }),
    { name: 'studyflow-ai-trails', storage: safeJsonStorage }
  )
);
