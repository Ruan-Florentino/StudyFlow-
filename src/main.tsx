import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { SupabaseProvider } from './components/SupabaseProvider.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import { ToastProvider } from './design-system/components/Toast.tsx';
import './index.css';

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
