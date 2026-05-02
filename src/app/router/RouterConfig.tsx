import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { routes } from './routes';
import { RouteErrorBoundary } from './RouteErrorBoundary';
import { AppContent } from '../AppContent';
import { AuthWrapper } from '../AuthWrapper';

/**
 * RouterConfig
 * Configuração centralizada de rotas usando a Data API do React Router v7.
 */

// Elemento de erro funcional para o roteador
const ErrorLoader = () => <RouteErrorBoundary><div>Erro Crítico</div></RouteErrorBoundary>;

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthWrapper><AppContent /></AuthWrapper>,
    errorElement: <ErrorLoader />,
    children: [
      ...routes.map(route => ({
        index: route.path === '/',
        path: route.path === '/' ? undefined : route.path.startsWith('/') ? route.path.substring(1) : route.path,
        element: <route.Component />,
      })),
      {
        path: '*',
        element: <Navigate to="/" replace />,
      }
    ]
  }
]);
