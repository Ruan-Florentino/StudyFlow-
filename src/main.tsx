import { setupChunkErrorHandler } from './utils/handleChunkError';
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { SupabaseProvider } from './components/SupabaseProvider.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import { ToastProvider } from './design-system/components/Toast.tsx';
import './index.css';

setupChunkErrorHandler();

const PWA_CACHE_RESET_VERSION = 'studyflow-cache-reset-t13-2-2026-07-01';

function hasCompletedPwaCacheReset() {
  try {
    return window.localStorage.getItem('studyflow:pwa-cache-reset') === PWA_CACHE_RESET_VERSION;
  } catch {
    return true;
  }
}

function markPwaCacheResetComplete() {
  try {
    window.localStorage.setItem('studyflow:pwa-cache-reset', PWA_CACHE_RESET_VERSION);
  } catch {
    // Ignore storage failures: cache cleanup is best-effort and must not block boot.
  }
}

async function forcePwaCacheRefreshOnce() {
  if (typeof window === 'undefined' || hasCompletedPwaCacheReset()) return;

  const hadController = Boolean(navigator.serviceWorker?.controller);

  try {
    if ('caches' in window) {
      const cacheNames = await window.caches.keys();
      await Promise.all(cacheNames.map((cacheName) => window.caches.delete(cacheName)));
    }

    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((registration) => registration.unregister()));
    }
  } finally {
    markPwaCacheResetComplete();
  }

  if (hadController) {
    window.location.reload();
  }
}

void forcePwaCacheRefreshOnce();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <SupabaseProvider>
        <App />
        <ToastProvider />
      </SupabaseProvider>
    </ErrorBoundary>
  </StrictMode>,
);
