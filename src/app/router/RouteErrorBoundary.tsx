import React, { Component, type ReactNode } from 'react';
import { devAgentLog } from '../../lib/devAgentLog';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * RouteErrorBoundary
 * Captura erros de chunk loading (deploy stale)
 * e força reload da página.
 */
export class RouteErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false };

  public static getDerivedStateFromError(error: Error): State {
    // Detectar erros típicos de chunk
    const isChunkError =
      /Loading chunk [\d]+ failed/.test(error.message) ||
      /Failed to fetch dynamically imported module/.test(error.message) ||
      /dynamically imported module/.test(error.message);
    devAgentLog({
      hypothesisId: 'H4',
      location: 'src/app/router/RouteErrorBoundary.tsx:getDerivedStateFromError',
      message: 'Route boundary captured error',
      data: { message: error.message, isChunkError },
    });

    if (isChunkError) {
      // Auto-recovery: reload
      window.location.reload();
      return { hasError: true };
    }

    return { hasError: true };
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 text-center h-full flex items-center justify-center">
          <p className="text-zinc-400">Atualizando o aplicativo. Aguarde um momento...</p>
        </div>
      );
    }
    return this.props.children;
  }
}
