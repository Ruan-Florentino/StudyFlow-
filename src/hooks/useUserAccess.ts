import { useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useUIStore } from '../store/useUIStore';
import { useFlashcardStore } from '../store/useFlashcardStore';
import { useDevAccessStore } from '../store/useDevAccessStore';
import { useUserStore } from '../store/useUserStore';
import type { PremiumFeature, UserRole } from '../types/userAccess';
import { computeFeatureAccess, isDevToolsAllowed } from '../lib/userAccessLogic';

/**
 * Gates de premium + papel `supremo`/`admin` (bypass total, exceto com "simular free" no painel DEV).
 */
export function useUserAccess() {
  const { user } = useAuth();
  const accessRole = useUserStore((s) => s.accessRole);
  const billingPlan = useUserStore((s) => s.billingPlan);
  const uiPlan = useUIStore((s) => s.plan);
  const flashcardsUsed = useFlashcardStore((s) => s.dailyFlashcardsUsed);
  const aiTutorQueries = useUIStore((s) => s.aiTutorQueriesToday);
  const aiTutorDate = useUIStore((s) => s.lastAiTutorQueryDate);
  const essaysWeek = useUIStore((s) => s.essaysThisWeek);

  const devRoleOverride = useDevAccessStore((s) => s.devRoleOverride);
  const simulateFree = useDevAccessStore((s) => s.simulateFree);

  const allowDevTools = useMemo(
    () =>
      isDevToolsAllowed({
        isDevBuild: import.meta.env.DEV,
        userEmail: user?.email,
        ownerEmailEnv: import.meta.env.VITE_DEV_OWNER_EMAIL,
      }),
    [user?.email]
  );

  const effectiveRole: UserRole = useMemo(() => {
    if (allowDevTools && devRoleOverride) return devRoleOverride;
    return accessRole;
  }, [accessRole, allowDevTools, devRoleOverride]);

  const rawSupremo = effectiveRole === 'supremo' || effectiveRole === 'admin';
  const planPremium =
    billingPlan === 'premium' || billingPlan === 'pro' || uiPlan === 'premium';
  const rawPremium = rawSupremo || effectiveRole === 'premium' || planPremium;

  const isSupremo = !simulateFree && rawSupremo;
  const isPremium = !simulateFree && rawPremium;
  const isFree = !isPremium;

  const plan: 'free' | 'premium' = isPremium ? 'premium' : 'free';

  const checkLimit = (feature: PremiumFeature) =>
    computeFeatureAccess(
      {
        isPremiumEffective: isPremium,
        flashcardsUsed,
        aiTutorQueries,
        aiTutorDate,
        essaysWeek,
      },
      feature
    );

  const canAccess = (feature: PremiumFeature) => checkLimit(feature);

  return {
    role: effectiveRole,
    isSupremo,
    isPremium,
    isFree,
    plan,
    checkLimit,
    canAccess,
    allowDevTools,
    simulateFree,
  };
}

/** @deprecated Prefira `useUserAccess` para `role`, `isSupremo` e painel DEV. */
export function usePlan() {
  const { plan, isPremium, checkLimit } = useUserAccess();
  return { plan, isPremium, checkLimit };
}
