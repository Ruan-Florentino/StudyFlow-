import React from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCw, X } from 'lucide-react';
import { cn } from '../UI';

export function PWAUpdatePrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered: ' + r);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  if (!offlineReady && !needRefresh) return null;

  return (
    <div 
      role="alert"
      className={cn(
        "fixed bottom-24 left-1/2 -translate-x-1/2 z-50",
        "w-[calc(100%-2rem)] max-w-sm animate-in slide-in-from-bottom-5 duration-500",
        "bg-black border border-green-500/50 shadow-2xl shadow-green-500/20 rounded-xl p-4",
      )}
    >
      <div className="flex items-start gap-4">
        <div className="p-2 bg-green-500/20 rounded-full text-green-500 shrink-0">
          <RefreshCw className="w-5 h-5 animate-spin-slow" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-bold text-white mb-1">
            {needRefresh ? 'Nova versão disponível!' : 'App pronto para uso offline!'}
          </h3>
          <p className="text-xs text-white/70 mb-3">
            {needRefresh 
              ? 'Clique em atualizar para carregar a versão mais recente.' 
              : 'O aplicativo foi baixado e pode ser usado sem internet.'}
          </p>
          
          {needRefresh && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => updateServiceWorker(true)}
                className="px-4 py-2 bg-green-500 text-white text-xs font-bold rounded-lg hover:bg-green-600 transition-colors"
              >
                Atualizar agora
              </button>
              <button
                onClick={close}
                className="px-4 py-2 text-white/50 text-xs font-medium hover:text-white transition-colors"
              >
                Depois
              </button>
            </div>
          )}
        </div>
        
        {!needRefresh && (
          <button 
            onClick={close}
            className="text-white/50 hover:text-white transition-colors shrink-0 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
