import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AI_MODELS, AIModelConfig } from '../config/aiModels';

interface AIModelState {
  selectedModelId: string;
  setModel: (id: string) => void;
  getSelectedModel: () => AIModelConfig;
}

export const useAIModel = create<AIModelState>()(
  persist(
    (set, get) => ({
      selectedModelId: 'core-pro',
      setModel: (id: string) => set({ selectedModelId: id }),
      getSelectedModel: () => {
        const id = get().selectedModelId;
        const model = AI_MODELS.find(m => m.id === id);
        return model || AI_MODELS.find(m => m.isDefault) || AI_MODELS[0];
      }
    }),
    {
      name: 'studyflow-ai-model-selection',
    }
  )
);
