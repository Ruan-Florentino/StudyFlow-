import { Suspense, useEffect } from 'react';
import { AppProviders } from './app/providers';
import { lazy } from 'react';
import { devAgentLog } from './lib/devAgentLog';
import { shouldRunOpenRouterHealthCheckOnMount } from './lib/openRouterHealthCheck';

const PWAUpdatePrompt = lazy(() =>
  import('./components/shared/PWAUpdatePrompt').then((module) => ({ default: module.PWAUpdatePrompt }))
);

const PWAInstallPrompt = lazy(() =>
  import('./components/PWAInstallPrompt').then((module) => ({ default: module.PWAInstallPrompt }))
);

const AppRouterProvider = lazy(() =>
  import('./app/router/AppRouterProvider').then((module) => ({ default: module.AppRouterProvider }))
);

devAgentLog({
  hypothesisId: 'H0',
  location: 'src/App.tsx:module',
  message: 'App module evaluated',
  data: { hasWindow: typeof window !== 'undefined' },
});

/**
 * App
 * Ponto de entrada da aplicação consolidado em arquitetura limpa.
 * v12: Migração para createBrowserRouter (React Router v7 Pattern)
 */

export default function App() {
  useEffect(() => {
    devAgentLog({
      hypothesisId: 'H0',
      location: 'src/App.tsx:mount',
      message: 'App mounted effect',
      data: { pathname: window.location.pathname, search: window.location.search },
    });
    if (shouldRunOpenRouterHealthCheckOnMount()) {
      void import('./lib/testAPI').then((module) => {
        void module.testOpenRouterConnection();
      });
    }
  }, []);

  return (
    <AppProviders>
      <Suspense
        fallback={
          <div className="min-h-screen bg-black flex items-center justify-center text-white/60 text-sm font-mono">
            Carregando…
          </div>
        }
      >
        <AppRouterProvider />
      </Suspense>
      <Suspense fallback={null}>
        <PWAUpdatePrompt />
        <PWAInstallPrompt />
      </Suspense>
    </AppProviders>
  );
}
