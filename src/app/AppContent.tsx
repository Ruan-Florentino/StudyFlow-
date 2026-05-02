import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Outlet } from 'react-router-dom';
import { useStore } from '../store';
import { AppShell } from './shell';
import { Onboarding } from '../components/Onboarding';
import { initAudioUnlocker } from '../lib/studyUtils';

/**
 * AppContent (Layout)
 * Componente principal que coordena o layout (Shell) e as telas (Outlet).
 * Gerencia efeitos globais e estado do AppShell (Command Palette).
 */

export function AppContent() {
  const { user, loading } = useAuth();
  const { hasCompletedOnboarding, checkStreak, themeColor, setName, completeOnboarding } = useStore();
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isUserInteracted, setIsUserInteracted] = useState(false);

  // Sync with backend on mount
  useEffect(() => {
    if (loading) return;
    if (!user?.uid) return;

    const sync = async () => {
      try {
        const snap = await getDoc(doc(db, 'users', user.uid));
        const data = snap.exists() ? snap.data() : { name: '' };
        if (data.name) setName(data.name);
      } catch (e) {
        console.error("Failed to sync with backend", e);
      }
    };
    sync();
  }, [setName, user?.uid, loading]);

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
      <div className="min-h-screen bg-black flex justify-center selection:bg-primary selection:text-black">
        <Onboarding onComplete={() => completeOnboarding()} />
      </div>
    );
  }

  return (
    <AppShell 
      isCommandPaletteOpen={isCommandPaletteOpen}
      setIsCommandPaletteOpen={setIsCommandPaletteOpen}
      isUserInteracted={isUserInteracted}
    >
      <Outlet />
    </AppShell>
  );
}
