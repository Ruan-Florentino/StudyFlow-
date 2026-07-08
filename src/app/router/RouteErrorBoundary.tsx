import React, { Component, type ReactNode } from 'react';
import { devAgentLog } from '../../lib/devAgentLog';

interface Props {
  children: ReactNode;
  resetKey?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
  isChunkError: boolean;
}

const CHUNK_RELOAD_KEY = 'studyflow:chunk-reload-url';

function isChunkLoadError(error: Error) {
  return (
    /Loading chunk [\d]+ failed/.test(error.message) ||
    /Failed to fetch dynamically imported module/.test(error.message) ||
    /dynamically imported module/.test(error.message)
  );
}

function clearChunkReloadGuard() {
  try {
    window.sessionStorage.removeItem(CHUNK_RELOAD_KEY);
  } catch {
    // sessionStorage can be unavailable in private browsing.
  }
}

/**
 * RouteErrorBoundary
 * Captura erros de rota/chunk e oferece recuperacao sem travar o app.
 */
export class RouteErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false, isChunkError: false };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, isChunkError: isChunkLoadError(error) };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const chunkError = isChunkLoadError(error);
    devAgentLog({
      hypothesisId: 'H4',
      location: 'src/app/router/RouteErrorBoundary.tsx:componentDidCatch',
      message: 'Route boundary captured error',
      data: { message: error.message, isChunkError: chunkError },
    });
    if (!chunkError) {
      console.error('Route error:', error, errorInfo);
      return;
    }

    try {
      const currentUrl = window.location.href;
      const lastReloadUrl = window.sessionStorage.getItem(CHUNK_RELOAD_KEY);
      if (lastReloadUrl !== currentUrl) {
        window.sessionStorage.setItem(CHUNK_RELOAD_KEY, currentUrl);
        window.location.reload();
      }
    } catch {
      window.location.reload();
    }
  }

  public componentDidUpdate(previousProps: Props) {
    if (previousProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false, error: undefined, isChunkError: false });
    }
  }

  private retry = () => {
    clearChunkReloadGuard();
    this.setState({ hasError: false, error: undefined, isChunkError: false });
  };

  private reload = () => {
    clearChunkReloadGuard();
    window.location.reload();
  };

  private goHome = () => {
    clearChunkReloadGuard();
    window.location.assign('/');
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[70vh] items-center justify-center p-6 text-center">
          <div className="premium-empty-panel w-full max-w-md rounded-[28px] border border-white/12 bg-black/30 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.42)]">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/25 bg-primary/10 text-2xl">
              !
            </div>
            <h1 className="text-xl font-black tracking-tight text-white">
              {this.state.isChunkError ? 'Atualizacao carregada' : 'Algo travou nessa tela'}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">
              {this.state.isChunkError
                ? 'O app recebeu uma versao nova. Recarregue uma vez para usar o bundle mais recente.'
                : 'A tela encontrou um erro, mas o restante da plataforma continua disponivel.'}
            </p>
            {this.state.error?.message && (
              <p className="mt-4 rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-left font-mono text-[11px] text-white/55">
                {this.state.error.message}
              </p>
            )}
            <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={this.retry}
                className="rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-white/12"
              >
                Tentar de novo
              </button>
              <button
                type="button"
                onClick={this.reload}
                className="rounded-2xl bg-primary px-4 py-3 text-sm font-black text-black transition-colors hover:bg-primary/90"
              >
                Recarregar
              </button>
            </div>
            <button
              type="button"
              onClick={this.goHome}
              className="mt-3 text-xs font-bold uppercase tracking-widest text-text-secondary transition-colors hover:text-white"
            >
              Voltar para inicio
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
