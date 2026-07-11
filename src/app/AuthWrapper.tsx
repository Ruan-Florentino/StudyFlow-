import React, { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { devAgentLog } from '../lib/devAgentLog';
import { useAuth } from '../contexts/AuthContext';
import { isSupabaseConfigured } from '../lib/supabase';
import { useUserStore } from '../store/useUserStore';

/**
 * AuthWrapper
 * Protege a área autenticada e preserva o destino para retorno após o login.
 */
interface AuthWrapperProps {
  children: ReactNode;
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const { user, loading } = useAuth();
  const location = useLocation();
  const isAuthReady = useUserStore((s) => s.isAuthReady);

  const blockingAuth = loading || (Boolean(user) && !isAuthReady);

  useEffect(() => {
    devAgentLog({
      hypothesisId: 'H1',
      location: 'src/app/AuthWrapper.tsx',
      message: 'AuthWrapper state',
      data: { loading, hasUser: Boolean(user), isAuthReady, blockingAuth },
    });
  }, [loading, user, isAuthReady, blockingAuth]);

  if (blockingAuth) {
    return (
      <div className="app-shell-viewport bg-black flex items-center justify-center text-white pl-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))]">
        <div className="animate-pulse">Autenticando...</div>
      </div>
    );
  }

  if (isSupabaseConfigured && !user) {
    return <Navigate to="/login" replace state={{ from: `${location.pathname}${location.search}` }} />;
  }

  return <>{children}</>;
}
