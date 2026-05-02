import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props { children: React.ReactNode; }
interface State { hasError: boolean; error?: Error; }

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };
  
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('App Error:', error, info);
    // Analytics/Sentry could go here
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6">
          <div className="max-w-sm w-full text-center">
            <div className="w-16 h-16 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={28} className="text-rose-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Ops! Algo quebrou</h2>
            <p className="text-sm text-white/60 mb-6">
              Tivemos um erro inesperado. Tenta recarregar que geralmente resolve.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-black font-bold"
            >
              <RefreshCw size={16} />
              Recarregar
            </button>
            {/* @ts-ignore */}
            {import.meta.env.DEV && this.state.error && (
              <pre className="mt-6 text-[10px] text-rose-400/70 text-left p-3 bg-rose-500/10 rounded-lg overflow-auto max-h-32">
                {this.state.error.message}
              </pre>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
