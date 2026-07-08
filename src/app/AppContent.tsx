import React, { Suspense, lazy, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useUIStore } from '../store/useUIStore';
import { useUserStore } from '../store/useUserStore';
import { AppShell, AnimatedPageOutlet } from './shell';
import { initAudioUnlocker } from '../lib/studyUtils';
import { devAgentLog } from '../lib/devAgentLog';
import { preloadCoreRoutes } from './router/preload';

const Onboarding = lazy(() =>
  import('../components/Onboarding').then((module) => ({ default: module.Onboarding }))
);
function isEditableShortcutTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  const tagName = target.tagName.toLowerCase();
  return target.isContentEditable || tagName === 'input' || tagName === 'textarea' || tagName === 'select';
}

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

  // Global Interaction & Audio — iOS/Safari exige gesto; click pode chegar tarde ou não subir ao window.
  useEffect(() => {
    let unlocked = false;
    const handleInteraction = () => {
      if (unlocked) return;
      unlocked = true;
      setIsUserInteracted(true);
      window.removeEventListener('pointerdown', handleInteraction, true);
      window.removeEventListener('touchstart', handleInteraction, true);
      window.removeEventListener('click', handleInteraction, true);
    };
    const captureOpts = { capture: true, passive: true } as const;
    window.addEventListener('pointerdown', handleInteraction, captureOpts);
    window.addEventListener('touchstart', handleInteraction, captureOpts);
    window.addEventListener('click', handleInteraction, captureOpts);
    initAudioUnlocker();
    checkStreak();
    return () => {
      window.removeEventListener('pointerdown', handleInteraction, true);
      window.removeEventListener('touchstart', handleInteraction, true);
      window.removeEventListener('click', handleInteraction, true);
    };
  }, [checkStreak]);

  useEffect(() => {
    preloadCoreRoutes();
  }, []);

  useEffect(() => {
    const handleGlobalShortcut = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== 'k') return;
      if (isEditableShortcutTarget(event.target) && !isCommandPaletteOpen) return;
      event.preventDefault();
      setIsCommandPaletteOpen((open) => !open);
    };
    window.addEventListener('keydown', handleGlobalShortcut);
    return () => window.removeEventListener('keydown', handleGlobalShortcut);
  }, [isCommandPaletteOpen]);

  // Theme Sync
  useEffect(() => {
    document.documentElement.style.setProperty('--theme-primary', themeColor);
  }, [themeColor]);

  if (false && !hasCompletedOnboarding) {
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
