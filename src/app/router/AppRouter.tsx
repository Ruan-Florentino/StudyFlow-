import React, { Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { routes } from './routes';
import { RouteFallback } from './RouteFallback';
import { RouteErrorBoundary } from './RouteErrorBoundary';

/**
 * AppRouter
 * Renderiza rotas usando React Router v6.
 * Migrado de tab-based para URL-based em T.46-A.
 * v2: Lazy loading por rota com Suspense (T.46-B).
 */

export function AppRouter() {
  const location = useLocation();
  const resetKey = `${location.pathname}${location.search}`;

  return (
    <RouteErrorBoundary resetKey={resetKey}>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          {routes.map(({ path, Component }) => (
            <Route
              key={path}
              path={path}
              element={<Component />}
            />
          ))}
          
          {/* Fallback 404 → redireciona pra home */}
          <Route 
            path="*" 
            element={<Navigate to="/" replace />} 
          />
        </Routes>
      </Suspense>
    </RouteErrorBoundary>
  );
}

