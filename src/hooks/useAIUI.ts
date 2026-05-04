import { create } from 'zustand';
interface AIUIState {
  isOpen: boolean;
  selectedTopic: string | null;
  currentSessionId: string | null;
  viewMode: 'sidebar' | 'page';
  openChat: (topic?: string, sessionId?: string | null) => void;
  closeChat: () => void;
  setTopic: (topic: string) => void;
  setSession: (sessionId: string | null) => void;
  setViewMode: (mode: 'sidebar' | 'page') => void;
}

export const useAIUI = create<AIUIState>((set) => ({
  isOpen: false,
  selectedTopic: 'Geral',
  currentSessionId: null,
  viewMode: 'sidebar',
  openChat: (topic, sessionId = null) => set((state) => ({ 
    isOpen: true, 
    selectedTopic: topic || state.selectedTopic,
    currentSessionId: sessionId
  })),
  closeChat: () => set({ isOpen: false }),
  setTopic: (topic) => set({ selectedTopic: topic, currentSessionId: null }),
  setSession: (sessionId) => set({ currentSessionId: sessionId }),
  setViewMode: (mode) => set({ viewMode: mode }),
}));
