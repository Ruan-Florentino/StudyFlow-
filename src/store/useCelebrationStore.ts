import { create } from 'zustand';

interface XPEvent {
  id: string;
  amount: number;
  x: number;
  y: number;
}

interface CelebrationState {
  xpEvents: XPEvent[];
  addXPEvent: (amount: number, x: number, y: number) => void;
  removeXPEvent: (id: string) => void;
  
  showLevelUp: boolean;
  newLevel: number;
  triggerLevelUp: (level: number) => void;
  closeLevelUp: () => void;
}

export const useCelebrationStore = create<CelebrationState>((set) => ({
  xpEvents: [],
  addXPEvent: (amount, x, y) => {
    const id = `xp-${Date.now()}-${Math.random()}`;
    set((state) => ({
      xpEvents: [...state.xpEvents, { id, amount, x, y }]
    }));
  },
  removeXPEvent: (id) => set((state) => ({
    xpEvents: state.xpEvents.filter(e => e.id !== id)
  })),
  
  showLevelUp: false,
  newLevel: 1,
  triggerLevelUp: (level) => set({ showLevelUp: true, newLevel: level }),
  closeLevelUp: () => set({ showLevelUp: false })
}));
