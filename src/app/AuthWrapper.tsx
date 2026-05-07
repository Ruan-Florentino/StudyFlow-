import React, { ReactNode, Suspense, lazy, useEffect } from 'react';
import { devAgentLog } from '../lib/devAgentLog';
import { useAuth } from '../contexts/AuthContext';
import { useUserStore } from '../store/useUserStore';

const LoginPage = lazy(() =>
  import('../pages/LoginPage').then((module) => ({ default: module.LoginPage }))
);

/**
 * AuthWrapper
 * Gerencia a renderização baseado no estado de autenticação.
 */

interface AuthWrapperProps {
  children: ReactNode;
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const { user, loading } = useAuth();
  const isAuthReady = useUserStore((s) => s.isAuthReady);

  const blockingAuth =
    loading || (Boolean(user) && !isAuthReady);

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
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="animate-pulse">Autenticando...</div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <Suspense
        fallback={
          <div className="min-h-screen bg-black flex items-center justify-center text-white/70">
            Carregando login...
          </div>
        }
      >
        <LoginPage />
      </Suspense>
    );
  }
  
  return <>{children}</>;
}
