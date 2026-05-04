import React, { Component, ReactNode } from 'react';

interface Props { 
  children: ReactNode; 
  fallback?: ReactNode; 
}

interface State { 
  hasError: boolean; 
  error?: Error; 
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };
  
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Erro capturado no ErrorBoundary:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white p-6">
          <div className="max-w-md text-center">
            <h1 className="text-2xl font-bold mb-4">Ops! Algo deu errado.</h1>
            <p className="text-gray-400 mb-6 font-mono text-xs">
              {this.state.error?.message || 'Erro desconhecido'}
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-primary text-black rounded-lg hover:bg-primary/80 transition-colors font-bold uppercase tracking-widest"
            >
              Recarregar aplicação
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
