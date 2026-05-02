import { ReactNode } from 'react';
import { AuthProvider } from '../../contexts/AuthContext';

/**
 * AppProviders
 * Agrupa todos os providers globais da aplicação.
 * Extraído de: App.tsx (T.45-F)
 */

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
