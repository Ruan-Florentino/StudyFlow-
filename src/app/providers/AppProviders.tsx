import { ReactNode, Suspense, lazy } from 'react';
import { AuthProvider } from '../../contexts/AuthContext';
import { ErrorBoundary } from '../../components/shared/ErrorBoundary';

const DevAccessPanel = lazy(() =>
  import('../../components/dev/DevAccessPanel').then((module) => ({
    default: module.DevAccessPanel,
  }))
);

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
    <ErrorBoundary>
      <AuthProvider>
        {children}
        <Suspense fallback={null}>
          <DevAccessPanel />
        </Suspense>
      </AuthProvider>
    </ErrorBoundary>
  );
}
