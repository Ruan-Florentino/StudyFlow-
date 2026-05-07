import React, { Suspense, lazy, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useUIStore } from '../store/useUIStore';
import { useUserStore } from '../store/useUserStore';
import { AppShell, AnimatedPageOutlet } from './shell';
import { initAudioUnlocker } from '../lib/studyUtils';
import { devAgentLog } from '../lib/devAgentLog';

const Onboarding = lazy(() =>
  import('../components/Onboarding').then((module) => ({ default: module.Onboarding }))
);

/**
 * AppContent (Layout)
 * Componente principal que coordena o layout (Shell) e as telas (`AnimatedPageOutlet`).
 * Gerencia efeitos globais e estado do AppShell (Command Palette).
 */

export function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const hasCompletedOnboarding = useUIStore((state) => state.hasCompletedOnboarding);
  const themeColor = useUIStore((state) => state.themeColor);
  const completeOnboarding = useUIStore((state) => state.completeOnboarding);
  const checkStreak = useUserStore((state) => state.checkStreak);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isUserInteracted, setIsUserInteracted] = useState(false);

  useEffect(() => {
    devAgentLog({
      hypothesisId: 'H2',
      location: 'src/app/AppContent.tsx',
      message: 'AppContent route context',
      data: {
        pathname: location.pathname,
        search: location.search,
        hasCompletedOnboarding,
        userLoading: loading,
        hasUser: Boolean(user),
      },
    });
  }, [location.pathname, location.search, hasCompletedOnboarding, loading, user]);

  // Global Interaction & Audio
  useEffect(() => {
    const handleInteraction = () => {
      setIsUserInteracted(true);
      window.removeEventListener('click', handleInteraction);
    };
    window.addEventListener('click', handleInteraction);
    initAudioUnlocker();
    checkStreak();
    return () => window.removeEventListener('click', handleInteraction);
  }, [checkStreak]);

  // Theme Sync
  useEffect(() => {
    document.documentElement.style.setProperty('--theme-primary', themeColor);
  }, [themeColor]);

  if (!hasCompletedOnboarding) {
    return (
      <div className="relative app-shell-viewport w-full bg-black flex justify-center selection:bg-primary selection:text-black">
        <Suspense fallback={<div className="text-white/60 text-sm font-mono pt-20">Carregando onboarding...</div>}>
          <Onboarding
            onComplete={(initialPath) => {
              completeOnboarding();
              navigate(initialPath, { replace: true });
            }}
          />
        </Suspense>
      </div>
    );
  }

  return (
    <AppShell 
      isCommandPaletteOpen={isCommandPaletteOpen}
      setIsCommandPaletteOpen={setIsCommandPaletteOpen}
      isUserInteracted={isUserInteracted}
    >
      <AnimatedPageOutlet />
    </AppShell>
  );
}
