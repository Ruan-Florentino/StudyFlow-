import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useUserAccess } from './useUserAccess';

const mockUser = { email: null as string | null };

const mockUserStore = {
  accessRole: 'free' as 'free' | 'premium' | 'supremo' | 'admin',
  billingPlan: 'free' as 'free' | 'pro' | 'premium',
};

const mockUIStore = {
  plan: 'free' as 'free' | 'premium',
  aiTutorQueriesToday: 0,
  lastAiTutorQueryDate: null as string | null,
  essaysThisWeek: 0,
};

const mockFlashcardStore = {
  dailyFlashcardsUsed: 0,
};

const mockDevStore = {
  devRoleOverride: null as 'free' | 'premium' | 'supremo' | 'admin' | null,
  simulateFree: false,
};

vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({ user: mockUser.email ? { email: mockUser.email } : null }),
}));

vi.mock('../store/useUserStore', () => ({
  useUserStore: (sel: (s: typeof mockUserStore) => unknown) => sel(mockUserStore),
}));

vi.mock('../store/useUIStore', () => ({
  useUIStore: (sel: (s: typeof mockUIStore) => unknown) => sel(mockUIStore),
}));

vi.mock('../store/useFlashcardStore', () => ({
  useFlashcardStore: (sel: (s: typeof mockFlashcardStore) => unknown) => sel(mockFlashcardStore),
}));

vi.mock('../store/useDevAccessStore', () => ({
  useDevAccessStore: (sel: (s: typeof mockDevStore) => unknown) => sel(mockDevStore),
}));

describe('useUserAccess', () => {
  beforeEach(() => {
    mockUser.email = null;
    mockUserStore.accessRole = 'free';
    mockUserStore.billingPlan = 'free';
    mockUIStore.plan = 'free';
    mockUIStore.aiTutorQueriesToday = 0;
    mockUIStore.lastAiTutorQueryDate = null;
    mockUIStore.essaysThisWeek = 0;
    mockFlashcardStore.dailyFlashcardsUsed = 0;
    mockDevStore.devRoleOverride = null;
    mockDevStore.simulateFree = false;
  });

  it('free: isFree true e exams bloqueado', () => {
    const { result } = renderHook(() => useUserAccess());
    expect(result.current.isFree).toBe(true);
    expect(result.current.isPremium).toBe(false);
    expect(result.current.canAccess('exams')).toBe(false);
  });

  it('billingPlan premium concede isPremium', () => {
    mockUserStore.billingPlan = 'premium';
    const { result } = renderHook(() => useUserAccess());
    expect(result.current.isPremium).toBe(true);
    expect(result.current.canAccess('exams')).toBe(true);
  });

  it('uiPlan premium concede isPremium mesmo com role free', () => {
    mockUIStore.plan = 'premium';
    const { result } = renderHook(() => useUserAccess());
    expect(result.current.isPremium).toBe(true);
  });

  it('papel supremo concede isSupremo', () => {
    mockUserStore.accessRole = 'supremo';
    const { result } = renderHook(() => useUserAccess());
    expect(result.current.isSupremo).toBe(true);
    expect(result.current.isPremium).toBe(true);
  });

  it('simulateFree força experiência free mesmo premium', () => {
    mockUserStore.billingPlan = 'premium';
    mockDevStore.simulateFree = true;
    const { result } = renderHook(() => useUserAccess());
    expect(result.current.isPremium).toBe(false);
    expect(result.current.simulateFree).toBe(true);
  });
});
