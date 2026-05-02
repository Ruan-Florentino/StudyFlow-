import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

/**
 * Renderiza componente com TODOS os providers necessários
 * (Router, etc). Use em vez de render() direto.
 */
function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, {
    wrapper: ({ children }) => (
      <BrowserRouter>{children}</BrowserRouter>
    ),
    ...options,
  });
}

export * from '@testing-library/react';
export { customRender as render };
