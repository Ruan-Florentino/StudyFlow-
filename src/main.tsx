import { setupChunkErrorHandler } from './utils/handleChunkError';
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { SupabaseProvider } from './components/SupabaseProvider.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import { ToastProvider } from './design-system/components/Toast.tsx';
import './index.css';

setupChunkErrorHandler();

const PWA_CACHE_RESET_VERSION = 'studyflow-cache-reset-athena-chat-2026-07-09-v1';
const PWA_CACHE_RESET_STORAGE_KEY = 'studyflow:pwa-cache-reset';

function hasCompletedPwaCacheReset() {
  try {
    return window.localStorage.getItem(PWA_CACHE_RESET_STORAGE_KEY) === PWA_CACHE_RESET_VERSION;
  } catch {
    return true;
  }
}

function markPwaCacheResetComplete() {
  try {
    window.localStorage.setItem(PWA_CACHE_RESET_STORAGE_KEY, PWA_CACHE_RESET_VERSION);
  } catch {
    // Ignore storage failures: cache cleanup is best-effort and must not block boot.
  }
}

async function forcePwaCacheRefreshOnce() {
  if (typeof window === 'undefined' || hasCompletedPwaCacheReset()) return;

  const hadController = Boolean(navigator.serviceWorker?.controller);
  let deletedCaches = 0;
  let removedRegistrations = 0;

  try {
    if ('caches' in window) {
      const cacheNames = await window.caches.keys();
      deletedCaches = cacheNames.length;
      await Promise.all(cacheNames.map((cacheName) => window.caches.delete(cacheName)));
    }

    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      removedRegistrations = registrations.length;
      await Promise.all(registrations.map((registration) => registration.unregister()));
    }
  } finally {
    markPwaCacheResetComplete();
  }

  if (hadController || deletedCaches > 0 || removedRegistrations > 0) {
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
