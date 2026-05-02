import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UIStore {
  themeColor: string;
  hasCompletedOnboarding: boolean;
  plan: 'free' | 'premium';
  sidebarOpen: boolean;
  voiceEnabled: boolean;
  navFilters: any;
  aiTutorQueriesToday: number;
  lastAiTutorQueryDate: string | null;
  essaysThisWeek: number;
  featureUsage: Record<string, number>;
  onboardingData: any;
  streakProtectorActive: boolean;
  
  setThemeColor: (color: string) => void;
  completeOnboarding: () => void;
  setOnboardingData: (data: any) => void;
  setPlan: (plan: 'free' | 'premium') => void;
  toggleSidebar: () => void;
  toggleVoice: () => void;
  setNavFilters: (filters: any) => void;
  clearNavFilters: () => void;
  trackFeature: (feature: string) => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      themeColor: '#10B981',
      hasCompletedOnboarding: false,
      onboardingData: null,
      streakProtectorActive: false,
      plan: 'free',
      sidebarOpen: false,
      voiceEnabled: false,
      navFilters: {},
      aiTutorQueriesToday: 0,
      lastAiTutorQueryDate: null,
      essaysThisWeek: 0,
      featureUsage: {},

      setThemeColor: (themeColor) => set({ themeColor }),
      completeOnboarding: () => set({ hasCompletedOnboarding: true }),
      setOnboardingData: (onboardingData) => set({ onboardingData }),
      setPlan: (plan) => set({ plan }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      toggleVoice: () => set((state) => ({ voiceEnabled: !state.voiceEnabled })),
      setNavFilters: (navFilters) => set({ navFilters }),
      clearNavFilters: () => set({ navFilters: {} }),
      trackFeature: (feature) => set((state) => ({
        featureUsage: { ...state.featureUsage, [feature]: (state.featureUsage[feature] || 0) + 1 }
      })),
    }),
    { name: 'studyflow-ui' }
  )
);
