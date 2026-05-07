import React, { useEffect, useMemo, useRef, useState, ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  SupabaseAuthSessionContext,
  type SupabaseAuthSessionValue,
} from '../contexts/SupabaseAuthSessionContext';
import { useUserStore } from '../store/useUserStore';
import { SupabaseSetupRequired } from './SupabaseSetupRequired';

interface SupabaseProviderProps {
  children: ReactNode;
}

export const SupabaseProvider: React.FC<SupabaseProviderProps> = ({ children }) => {
  const setUserId = useUserStore((state) => state.setUserId);
  const setAuthReady = useUserStore((state) => state.setAuthReady);
  const remoteCleanupRef = useRef<(() => void) | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [authHydrated, setAuthHydrated] = useState(false);

  const sessionValue = useMemo<SupabaseAuthSessionValue>(
    () => ({
      session,
      user: session?.user ?? null,
      authHydrated,
    }),
    [session, authHydrated]
  );

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setAuthReady(true);
      return;
    }

    let syncGeneration = 0;

    const teardownRemote = () => {
      remoteCleanupRef.current?.();
      remoteCleanupRef.current = null;
    };

    const mountSession = async (user: User) => {
      teardownRemote();
      const gen = ++syncGeneration;
      setUserId(user.id);
      setAuthReady(false);
      try {
        const { startUserRemoteSync } = await import('../lib/supabase/userRemoteSync');
        const cleanup = await startUserRemoteSync(user);
        if (gen !== syncGeneration) {
          cleanup();
          return;
        }
        remoteCleanupRef.current = cleanup;
      } catch (e) {
        console.error('[SupabaseProvider] startUserRemoteSync:', e);
      } finally {
        if (gen === syncGeneration) {
          setAuthReady(true);
        }
      }
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setAuthHydrated(true);

      if (nextSession) {
        void mountSession(nextSession.user);
      } else {
        teardownRemote();
        void import('../lib/supabase/clearClientStoresForSignOut').then((module) => {
          module.clearClientStoresForSignOut();
        });
        setAuthReady(true);
      }
    });

    return () => {
      teardownRemote();
      subscription.unsubscribe();
    };
  }, [setUserId, setAuthReady]);

  if (!isSupabaseConfigured) {
    return <SupabaseSetupRequired />;
  }

  return (
    <SupabaseAuthSessionContext.Provider value={sessionValue}>
      {children}
    </SupabaseAuthSessionContext.Provider>
  );
};
