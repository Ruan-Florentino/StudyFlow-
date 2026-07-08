import React, { useEffect } from 'react';
import { createBrowserRouter, Navigate, useLocation } from 'react-router-dom';
import { devAgentLog } from '../../lib/devAgentLog';
import { routes } from './routes';
import { RouteErrorBoundary } from './RouteErrorBoundary';
import { AppContent } from '../AppContent';

/**
 * RouterConfig
 * Configuração centralizada de rotas usando a Data API do React Router v7.
 */

// Elemento de erro funcional para o roteador
const ErrorLoader = () => {
  const location = useLocation();
  return (
    <RouteErrorBoundary resetKey={`${location.pathname}${location.search}`}>
      <div>Erro Crítico</div>
    </RouteErrorBoundary>
  );
};
const NotFoundRedirect = () => {
  const location = useLocation();
  useEffect(() => {
    devAgentLog({
      hypothesisId: 'H8',
      location: 'src/app/router/RouterConfig.tsx:NotFoundRedirect',
      message: 'NotFound redirect triggered',
      data: { pathname: location.pathname, search: location.search },
    });
  }, [location.pathname, location.search]);
  return <Navigate to="/" replace />;
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppContent />,
    errorElement: <ErrorLoader />,
    children: [
      ...routes.map(route => ({
        index: route.path === '/',
        path: route.path === '/' ? undefined : route.path.startsWith('/') ? route.path.substring(1) : route.path,
        element: <route.Component />,
      })),
      {
        path: '*',
        element: <NotFoundRedirect />,
      }
    ]
  }
]);
