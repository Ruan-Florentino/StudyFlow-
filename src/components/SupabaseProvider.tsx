import React, { useEffect, useMemo, useRef, useState, ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  SupabaseAuthSessionContext,
  type SupabaseAuthSessionValue,
} from '../contexts/SupabaseAuthSessionContext';
import { useUserStore } from '../store/useUserStore';

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
      setSession(null);
      setAuthHydrated(true);
      setAuthReady(true);
      return;
    }

    let syncGeneration = 0;
    let cancelled = false;

    const teardownRemote = () => {
      remoteCleanupRef.current?.();
      remoteCleanupRef.current = null;
    };

    const mountSession = async (user: User) => {
      if (cancelled) return;
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
        if (!cancelled && gen === syncGeneration) {
          setAuthReady(true);
        }
      }
    };

    const applyAuthSession = (nextSession: Session | null) => {
      if (cancelled) return;
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
    };

    /** Safari por vezes não entrega o primeiro `onAuthStateChange`; sem fallback a UI fica em loading eterno. */
    let receivedAuthCallback = false;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (cancelled) return;
      receivedAuthCallback = true;
      applyAuthSession(nextSession);
    });

    const fallbackId = window.setTimeout(() => {
      if (cancelled || receivedAuthCallback) return;
      void supabase.auth
        .getSession()
        .then(({ data: { session: next } }) => {
          if (receivedAuthCallback) return;
          applyAuthSession(next);
        })
        .catch((e) => {
          console.error('[SupabaseProvider] getSession (Safari fallback):', e);
          if (!receivedAuthCallback) {
            setAuthHydrated(true);
            setAuthReady(true);
          }
        });
    }, 0);

    return () => {
      cancelled = true;
      window.clearTimeout(fallbackId);
      receivedAuthCallback = true;
      teardownRemote();
      subscription.unsubscribe();
    };
  }, [setUserId, setAuthReady]);


  return (
    <SupabaseAuthSessionContext.Provider value={sessionValue}>
      {children}
    </SupabaseAuthSessionContext.Provider>
  );
};
