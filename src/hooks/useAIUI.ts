import { create } from 'zustand';
import { AgentKey, STUDY_AGENTS } from '../config/aiAgents';

interface AIUIState {
  isOpen: boolean;
  selectedAgent: AgentKey | null;
  currentSessionId: string | null;
  viewMode: 'sidebar' | 'page';
  openChat: (agent?: AgentKey, sessionId?: string | null) => void;
  closeChat: () => void;
  setAgent: (agent: AgentKey) => void;
  setSession: (sessionId: string | null) => void;
  setViewMode: (mode: 'sidebar' | 'page') => void;
}

export const useAIUI = create<AIUIState>((set) => ({
  isOpen: false,
  selectedAgent: 'TUTOR',
  currentSessionId: null,
  viewMode: 'sidebar',
  openChat: (agent, sessionId = null) => set((state) => ({ 
    isOpen: true, 
    selectedAgent: agent || state.selectedAgent,
    currentSessionId: sessionId
  })),
  closeChat: () => set({ isOpen: false }),
  setAgent: (agent) => set({ selectedAgent: agent, currentSessionId: null }),
  setSession: (sessionId) => set({ currentSessionId: sessionId }),
  setViewMode: (mode) => set({ viewMode: mode }),
}));
