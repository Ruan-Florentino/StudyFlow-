import React, { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LoginPage } from '../pages/LoginPage';

/**
 * AuthWrapper
 * Gerencia a renderização baseado no estado de autenticação.
 */

interface AuthWrapperProps {
  children: ReactNode;
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="animate-pulse">Autenticando...</div>
      </div>
    );
  }
  
  if (!user) {
    return <LoginPage />;
  }
  
  return <>{children}</>;
}
