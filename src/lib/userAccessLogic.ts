import type { PremiumFeature, UserRole } from '../types/userAccess';

/** Alinha `public.users.role` ao union usado no app. */
export function normalizeDbRole(raw: string | null | undefined): UserRole {
  if (raw === 'premium' || raw === 'supremo' || raw === 'admin') return raw;
  return 'free';
}

export function parseBillingPlanFromDb(raw: string | null | undefined): 'free' | 'pro' | 'premium' {
  if (raw === 'pro' || raw === 'premium' || raw === 'free') return raw;
  return 'free';
}

export function computeFeatureAccess(
  params: {
    isPremiumEffective: boolean;
    flashcardsUsed: number;
    aiTutorQueries: number;
    aiTutorDate: string | null;
    essaysWeek: number;
  },
  feature: PremiumFeature
): boolean {
  if (params.isPremiumEffective) return true;
  const today = new Date().toISOString().split('T')[0];
  switch (feature) {
    case 'flashcards':
      return params.flashcardsUsed < 10;
    case 'aiTutor':
      return params.aiTutorDate !== today || params.aiTutorQueries < 3;
    case 'essay':
      return params.essaysWeek < 1;
    case 'exams':
      return false;
    default:
      return true;
  }
}

export function isDevToolsAllowed(params: {
  isDevBuild: boolean;
  userEmail: string | null | undefined;
  ownerEmailEnv: string | undefined;
}): boolean {
  if (params.isDevBuild) return true;
  const owner = (params.ownerEmailEnv || '').trim().toLowerCase();
  const email = (params.userEmail || '').trim().toLowerCase();
  if (!owner || !email) return false;
  return email === owner;
}
