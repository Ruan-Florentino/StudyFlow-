import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './RouterConfig';

export function AppRouterProvider() {
  return <RouterProvider router={router} />;
}
