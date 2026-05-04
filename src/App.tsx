import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { AppProviders } from './app/providers';
import { router } from './app/router/RouterConfig';
import { PWAUpdatePrompt } from './components/shared/PWAUpdatePrompt';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import { testOpenRouterConnection } from './lib/testAPI';

/**
 * App
 * Ponto de entrada da aplicação consolidado em arquitetura limpa.
 * v12: Migração para createBrowserRouter (React Router v7 Pattern)
 */

export default function App() {
  useEffect(() => {
    testOpenRouterConnection();
  }, []);

  return (
    <AppProviders>
      <RouterProvider router={router} />
      <PWAUpdatePrompt />
      <PWAInstallPrompt />
    </AppProviders>
  );
}
