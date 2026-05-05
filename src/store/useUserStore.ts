import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Achievement, LeaderboardEntry, QuestionHistory } from './types';

export interface UserStore {
  // Auth
  name: string;
  bio: string;
  profilePic: string;
  coverPic: string;
  userId: string | null;
  isAuthReady: boolean;
  
  // Stats
  xp: number;
  level: number;
  streak: number;
  league: 'Bronze' | 'Prata' | 'Ouro' | 'Diamante';
  dailyXP: number;
  lastStudyDate: string | null;
  dailyGoalMinutes: number;
  coins: number;
  prestigeLevel: number;
  mastery: Record<string, number>;
  achievements: Achievement[];
  leaderboard: LeaderboardEntry[];
  levelUpData: { oldLevel: number, newLevel: number } | null;

  // Actions
  setName: (name: string) => void;
  setBio: (bio: string) => void;
  setProfilePic: (pic: string) => void;
  setCoverPic: (pic: string) => void;
  setUserId: (userId: string | null) => void;
  setAuthReady: (isAuthReady: boolean) => void;
  
  addXP: (amount: number) => void;
  checkStreak: () => void;
  addCoins: (amount: number) => void;
  clearLevelUp: () => void;
  updateMastery: (subject: string, score: number) => void;
  updateLeaderboard: () => void;
  prestige: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      name: 'Estudante',
      bio: 'Focado na aprovação! 🚀',
      profilePic: '',
      coverPic: '',
      userId: null,
      isAuthReady: false,
      xp: 0,
      level: 1,
      streak: 0,
      league: 'Bronze',
      dailyXP: 0,
      lastStudyDate: null,
      dailyGoalMinutes: 120,
      coins: 0,
      prestigeLevel: 0,
      mastery: {},
      achievements: [],
      leaderboard: [],
      levelUpData: null,

      setName: (name) => set({ name }),
      setBio: (bio) => set({ bio }),
      setProfilePic: (profilePic) => set({ profilePic }),
      setCoverPic: (coverPic) => set({ coverPic }),
      setUserId: (userId) => set({ userId }),
      setAuthReady: (isAuthReady) => set({ isAuthReady }),

      addXP: (amount) => {
        const { xp, level, league, dailyXP } = get();
        const newXP = xp + amount;
        const newLevel = Math.min(100, Math.floor(newXP / 1000) + 1);
        let newLeague = league;
        if (newXP >= 10000) newLeague = 'Diamante';
        else if (newXP >= 5000) newLeague = 'Ouro';
        else if (newXP >= 2000) newLeague = 'Prata';

        set({
          xp: newXP,
          level: newLevel,
          dailyXP: dailyXP + amount,
          league: newLeague,
          levelUpData: newLevel > level ? { oldLevel: level, newLevel } : get().levelUpData
        });
      },

      checkStreak: () => {
        const { lastStudyDate, streak } = get();
        if (!lastStudyDate) return;
        const last = new Date(lastStudyDate);
        const today = new Date();
        const diffDays = Math.ceil(Math.abs(today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays > 1) set({ streak: 0 });
      },

      addCoins: (amount) => set(state => ({ coins: state.coins + amount })),
      clearLevelUp: () => set({ levelUpData: null }),
      updateMastery: (subject, score) => set(state => {
        const current = state.mastery[subject] || 0;
        return { mastery: { ...state.mastery, [subject]: Math.min(100, current + score) } };
      }),
      updateLeaderboard: () => {}, // Mock
      prestige: () => set(state => ({ prestigeLevel: state.prestigeLevel + 1, level: 1, xp: 0 })),
    }),
    {
      name: 'studyflow-user',
      // Fotos vêm do Supabase (users + Storage); persistir aqui gerava URL apagada após reidratação.
      partialize: (s) => {
        const { profilePic: _p, coverPic: _c, ...rest } = s;
        return rest;
      }
    }
  )
);
